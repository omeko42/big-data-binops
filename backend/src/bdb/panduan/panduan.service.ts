import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes } from 'crypto';
import { jwtConstants } from '@app_core/auth/constants';
import { generatePowCaptcha, verifyPowCaptcha } from '@app_core/auth/pow-captcha.util';
import { MinioService, UploadedFileLike } from '../kerma/minio.service';
import { AuditService } from '../audit/audit.service';

const ALLOWED_TIPE = ['VIDEO', 'PDF'];

function getEncryptionKey(): Buffer {
    const rawSecret = String(jwtConstants?.secret || process.env.JWT_SECRET || 'cas-bareskrim-panduan-secret-2026');
    return createHash('sha256').update(rawSecret + '::panduan-stream-v1').digest();
}

function encryptTokenPayload(payload: Record<string, any>): string {
    const key = getEncryptionKey();
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', key, iv);
    const json = Buffer.from(JSON.stringify(payload), 'utf8');
    const enc = Buffer.concat([cipher.update(json), cipher.final()]);
    const tag = cipher.getAuthTag();
    return Buffer.concat([iv, tag, enc]).toString('base64url');
}

function decryptTokenPayload(token: string): Record<string, any> | null {
    try {
        const buf = Buffer.from(String(token || '').trim(), 'base64url');
        if (buf.length < 29) return null;
        const iv = buf.subarray(0, 12);
        const tag = buf.subarray(12, 28);
        const enc = buf.subarray(28);
        const key = getEncryptionKey();
        const decipher = createDecipheriv('aes-256-gcm', key, iv);
        decipher.setAuthTag(tag);
        const dec = Buffer.concat([decipher.update(enc), decipher.final()]).toString('utf8');
        const data = JSON.parse(dec);
        if (data.exp && Date.now() > Number(data.exp)) return null;
        return data;
    } catch {
        return null;
    }
}

function assertMimetypeMatchesTipe(tipe: string, file: UploadedFileLike) {
    const mt = file.mimetype || '';
    if (tipe === 'PDF' && mt && mt !== 'application/pdf') {
        throw new BadRequestException('File yang diunggah harus berformat PDF.');
    }
    if (tipe === 'VIDEO' && mt && !mt.startsWith('video/')) {
        throw new BadRequestException('File yang diunggah harus berupa video.');
    }
}

/** Panduan Pengguna (video/PDF). Lihat = semua role login. Kelola = superadmin-only. */
@Injectable()
export class PanduanService {
    private accessTableEnsured = false;

    constructor(
        private readonly dataSource: DataSource,
        private readonly minio: MinioService,
        private readonly audit: AuditService
    ) {}

    private async ensureAccessLogTable() {
        if (this.accessTableEnsured) return;
        this.accessTableEnsured = true;
        await this.dataSource.query(`
            create table if not exists bdb_panduan_access_log (
                id bigserial primary key,
                panduan_id bigint not null,
                jenis_personel text not null,
                nama text not null,
                nrp_nip text not null,
                ip_address text,
                user_agent text,
                created_at timestamptz not null default now()
            );
            create index if not exists idx_bdb_panduan_access_log_panduan on bdb_panduan_access_log(panduan_id, created_at desc);
        `);
    }

    createShareToken(panduanId: number): string {
        return encryptTokenPayload({
            kind: 'panduan_share',
            id: Number(panduanId),
            exp: Date.now() + 30 * 24 * 3600 * 1000 // berlaku 30 hari untuk link share
        });
    }

    createStreamToken(panduanId: number, viewer?: { jenis_personel?: string; nama?: string; nrp_nip?: string; userId?: number }): string {
        return encryptTokenPayload({
            kind: 'panduan_stream',
            id: Number(panduanId),
            viewer: viewer || null,
            exp: Date.now() + 6 * 3600 * 1000 // berlaku 6 jam sesi tonton/baca
        });
    }

    private assertSuperadmin(authUser: any, action: string) {
        const role = String(authUser?.role_bdb || '').toLowerCase();
        if (!['superadmin', 'admin_binops'].includes(role)) {
            void this.audit.log({ user: authUser, action, entity: 'panduan_pengguna', meta: { outcome: 'ERROR', message: 'Bukan superadmin/admin' } });
            throw new ForbiddenException('Hanya superadmin/admin yang dapat mengelola Panduan Pengguna.');
        }
    }

    /**
     * Daftar panduan. Role selain superadmin (atau superadmin tanpa includeInactive) cuma
     * lihat yang AKTIF. Superadmin di halaman Kelola minta includeInactive=true utk lihat semua.
     */
    async list(authUser: any, includeInactive: boolean) {
        const isSuper = ['superadmin', 'admin_binops', 'vendor_mitra', 'vendor', 'mitra'].includes(String(authUser?.role_bdb || '').toLowerCase());
        const where = includeInactive && isSuper ? '' : "where status = 'AKTIF'";
        const rows = await this.dataSource.query(
            `select id, judul, deskripsi, kategori, tipe, file_name, content_type, size, urutan, status, created_at
             from bdb_panduan_pengguna ${where} order by urutan asc, created_at desc`
        );
        const viewerInfo = {
            jenis_personel: 'INTERNAL',
            userId: authUser?.id || authUser?.user?.id,
            nama: authUser?.name || authUser?.user?.name || authUser?.username || 'Internal User',
            nrp_nip: authUser?.nrp || authUser?.nip || authUser?.username || authUser?.email_polri || '-'
        };
        const enriched = rows.map((r: any) => {
            const streamToken = this.createStreamToken(Number(r.id), viewerInfo);
            const streamUrl = `/api/bdb/panduan/stream/${streamToken}`;
            return {
                ...r,
                share_token: this.createShareToken(Number(r.id)),
                stream_token: streamToken,
                direct_stream_token: streamToken,
                stream_url: streamUrl,
                url: streamUrl
            };
        });
        return { status: 1, data: enriched };
    }

    /** Detail 1 panduan + URL stream terenkripsi & share_token. */
    async detail(authUser: any, id: number) {
        const rows = await this.dataSource.query(
            `select id, judul, deskripsi, kategori, tipe, file_name, object_key, content_type, size, status, created_at from bdb_panduan_pengguna where id=$1`,
            [id]
        );
        if (!rows.length) throw new NotFoundException('Panduan tidak ditemukan.');
        const row = rows[0];
        const isSuper = ['superadmin', 'admin_binops', 'vendor_mitra', 'vendor', 'mitra'].includes(String(authUser?.role_bdb || '').toLowerCase());
        if (row.status !== 'AKTIF' && !isSuper) {
            throw new NotFoundException('Panduan tidak ditemukan.');
        }
        const streamToken = this.createStreamToken(Number(row.id), {
            jenis_personel: 'INTERNAL',
            userId: authUser?.id || authUser?.user?.id,
            nama: authUser?.name || authUser?.user?.name || authUser?.username || 'Internal User',
            nrp_nip: authUser?.nrp || authUser?.nip || authUser?.username || authUser?.email_polri || '-'
        });
        const streamUrl = `/api/bdb/panduan/stream/${streamToken}`;
        const shareToken = this.createShareToken(Number(row.id));
        const url = streamUrl;
        delete row.object_key;
        return {
            status: 1,
            data: {
                ...row,
                url,
                stream_url: streamUrl,
                stream_token: streamToken,
                direct_stream_token: streamToken,
                share_token: shareToken
            }
        };
    }

    /**
     * Menghasilkan tantangan Captcha (6-char Alphanumeric SVG + PoW Login-style) & info dasar panduan saat link terenkripsi dibuka di luar sistem.
     */
    async getShareChallenge(shareToken?: string, panduanId?: number) {
        let targetId = Number(panduanId || 0);
        if (shareToken) {
            const decoded = decryptTokenPayload(shareToken);
            if (decoded && (decoded.kind === 'panduan_share' || decoded.kind === 'panduan_stream')) {
                targetId = Number(decoded.id || 0);
            } else if (/^\d+$/.test(String(shareToken).trim())) {
                targetId = Number(String(shareToken).trim());
            } else {
                throw new BadRequestException('Tautan terenkripsi tidak valid atau sudah kedaluwarsa.');
            }
        }
        let panduanInfo: any = null;
        if (targetId > 0) {
            const rows = await this.dataSource.query(
                `select id, judul, deskripsi, kategori, tipe, file_name, size, created_at from bdb_panduan_pengguna where id = $1 and status = 'AKTIF' limit 1`,
                [targetId]
            );
            if (!rows.length) throw new NotFoundException('Materi panduan tidak ditemukan atau tidak aktif.');
            panduanInfo = {
                ...rows[0],
                share_token: this.createShareToken(Number(rows[0].id))
            };
        }

        // 6-character alphanumeric SVG Captcha (tanpa operasi hitung, gaya Login)
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars[Math.floor(Math.random() * chars.length)];
        }
        const answer = code;
        const questionText = 'Ketik 6 karakter kode di samping';
        const palette = ['#f8fafc', '#38bdf8', '#a7f3d0', '#fde047', '#f472b6', '#c4b5fd'];

        let noiseLines = '';
        for (let i = 0; i < 5; i++) {
            const x1 = 8 + Math.floor(Math.random() * 28);
            const y1 = 8 + Math.floor(Math.random() * 44);
            const cx = 70 + Math.floor(Math.random() * 60);
            const cy = 6 + Math.floor(Math.random() * 48);
            const x2 = 164 + Math.floor(Math.random() * 28);
            const y2 = 8 + Math.floor(Math.random() * 44);
            const stroke = palette[i % palette.length];
            noiseLines += `<path d="M${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}" stroke="${stroke}" stroke-opacity="0.28" stroke-width="1.5" fill="none"/>`;
        }

        let noiseDots = '';
        for (let i = 0; i < 24; i++) {
            const cx = 6 + Math.floor(Math.random() * 188);
            const cy = 6 + Math.floor(Math.random() * 48);
            const r = (Math.random() * 1.4 + 0.6).toFixed(1);
            const fill = palette[i % palette.length];
            noiseDots += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" fill-opacity="0.28"/>`;
        }

        let charNodes = '';
        for (let i = 0; i < code.length; i++) {
            const ch = code[i];
            const x = 24 + i * 28 + Math.floor(Math.random() * 5) - 2;
            const y = 38 + Math.floor(Math.random() * 7) - 3;
            const rot = Math.floor(Math.random() * 29) - 14;
            const color = palette[i % palette.length];
            charNodes += `<text x="${x}" y="${y}" fill="${color}" font-family="monospace" font-size="24" font-weight="bold" text-anchor="middle" transform="rotate(${rot} ${x} ${y})">${ch}</text>`;
        }

        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="60" viewBox="0 0 200 60"><rect width="200" height="60" rx="8" fill="#0f172a"/>${noiseLines}${noiseDots}${charNodes}</svg>`;
        const svgDataUrl = `data:image/svg+xml;base64,${Buffer.from(svg, 'utf8').toString('base64')}`;

        const challengeToken = encryptTokenPayload({
            kind: 'panduan_captcha',
            ans: answer.toUpperCase(),
            id: targetId || null,
            exp: Date.now() + 10 * 60 * 1000 // 10 menit
        });

        const pow = generatePowCaptcha();

        return {
            status: 1,
            data: {
                challenge_token: challengeToken,
                captcha_token: challengeToken,
                question: questionText,
                code_hint: '6 karakter kode di samping',
                svg_data_url: svgDataUrl,
                captcha_svg: svgDataUrl,
                pow,
                panduan: panduanInfo
            }
        };
    }

    /**
     * Verifikasi identitas penonton ("Siapa Kamu?" — khusus akses eksternal di luar sistem):
     * - jenis_personel: 'ANGGOTA_POLRI' | 'PNS_POLRI'
     * - nama: Nama Lengkap
     * - nrp_nip: NRP (~8 digit, validasi 6-10 digit) atau NIP (~16-18 digit, validasi 14-18 digit)
     * - captcha_answer & challenge_token / captcha_token (atau PoW captcha_id + captcha)
     */
    async verifyViewer(
        body: {
            share_token?: string;
            panduan_id?: number;
            jenis_personel?: string;
            nama?: string;
            nrp_nip?: string;
            captcha_answer?: string;
            challenge_token?: string;
            captcha_token?: string;
            captcha_id?: string;
            captcha?: string | number;
        },
        reqMeta?: { ip?: string; userAgent?: string }
    ) {
        await this.ensureAccessLogTable();

        const rawId = String((body as any)?.nrp || body?.nrp_nip || '').replace(/[\s.-]/g, '').trim();
        if (!/^\d+$/.test(rawId)) {
            throw new BadRequestException('NRP / NIP wajib berupa angka.');
        }

        let jenis = String(body?.jenis_personel || '').trim().toUpperCase();
        if (!['ANGGOTA_POLRI', 'PNS_POLRI'].includes(jenis)) {
            jenis = rawId.length >= 14 ? 'PNS_POLRI' : 'ANGGOTA_POLRI';
        }
        if (jenis === 'ANGGOTA_POLRI' && (rawId.length < 6 || rawId.length > 10)) {
            throw new BadRequestException('NRP Anggota Polri wajib terdiri dari ±8 digit angka (rentang valid: 6 s.d. 10 digit).');
        }
        if (jenis === 'PNS_POLRI' && (rawId.length < 14 || rawId.length > 18)) {
            throw new BadRequestException('NIP PNS Polri wajib terdiri dari ±16-18 digit angka (rentang valid: 14 s.d. 18 digit).');
        }

        let nama = String(body?.nama || '').trim().replace(/\s+/g, ' ');
        let satker = 'Polri';
        let pangkat = '-';
        let jabatan = 'PERSONEL POLRI';
        if (!nama || nama.length < 3) {
            const pRows = await this.dataSource.query(
                `SELECT coalesce(u.name, tp.nama) as nama,
                        coalesce(s.nama_singkat, s.deskripsi, tp.satuan, 'Polri') as satker,
                        coalesce(tp.pangkat, '-') as pangkat,
                        coalesce(tp.jabatan, 'PERSONEL POLRI') as jabatan
                 FROM auth_users u
                 LEFT JOIN bdb_satker s ON s.id = u.scope_satker_id
                 FULL OUTER JOIN trb_police tp ON (tp.nrp = $1 OR lower(tp.email) = lower(u.email_polri))
                 WHERE (u.deleted_at IS NULL AND (split_part(lower(coalesce(u.email_polri, '')), '@', 1) = lower($1) OR lower(coalesce(u.username, '')) = lower($1)))
                    OR (tp.deleted_at IS NULL AND tp.nrp = $1)
                 LIMIT 1`,
                [rawId]
            );
            if (!pRows.length || !pRows[0].nama) {
                throw new ForbiddenException('NRP / NIP tidak terdaftar sebagai personel aktif di database CAS Bareskrim Polri.');
            }
            nama = String(pRows[0].nama).trim();
            satker = String(pRows[0].satker || 'Polri').trim();
            pangkat = String(pRows[0].pangkat || '-').trim();
            jabatan = String(pRows[0].jabatan || 'PERSONEL POLRI').trim();
        }

        const tokenStr = String(body?.challenge_token || (body as any)?.captcha_token || '');
        const challenge = tokenStr ? decryptTokenPayload(tokenStr) : null;
        const powValid = Boolean(body?.captcha_id && body?.captcha !== undefined && verifyPowCaptcha(String(body.captcha_id), String(body.captcha)));

        if (!powValid && tokenStr) {
            if (!challenge || challenge.kind !== 'panduan_captcha') {
                throw new BadRequestException('Sesi Captcha telah kedaluwarsa. Silakan muat ulang Captcha.');
            }
            const userAns = String(body?.captcha_answer || (body as any)?.captcha_code || body?.captcha || '').trim().toUpperCase().replace(/[\s-]+/g, '');
            const expectedAns = String(challenge.ans || '').trim().toUpperCase().replace(/[\s-]+/g, '');
            if (!userAns || userAns !== expectedAns) {
                throw new BadRequestException('Kode Captcha belum tepat. Ketik 6 karakter kode sesuai gambar.');
            }
        } else if (!powValid && !tokenStr && body?.panduan_id) {
            throw new BadRequestException('Sesi Captcha wajib diisi.');
        }

        let targetId = Number(body?.panduan_id || challenge?.id || 0);
        if (body?.share_token) {
            const shared = decryptTokenPayload(body.share_token);
            if (shared && (shared.kind === 'panduan_share' || shared.kind === 'panduan_stream')) {
                targetId = Number(shared.id || targetId);
            } else if (/^\d+$/.test(String(body.share_token).trim())) {
                targetId = Number(String(body.share_token).trim());
            } else if (!targetId) {
                throw new BadRequestException('Tautan panduan terenkripsi tidak valid.');
            }
        }
        if (!targetId) {
            const viewerObj = {
                jenis_personel: jenis,
                nama,
                nrp: rawId,
                nrp_nip: rawId,
                pangkat,
                jabatan,
                satker,
                verified: true
            };
            return {
                status: 1,
                message: 'Verifikasi identitas personel berhasil.',
                data: {
                    verified: true,
                    nrp: rawId,
                    viewer: viewerObj
                },
                viewer: viewerObj
            };
        }

        const rows = await this.dataSource.query(
            `select id, judul, deskripsi, kategori, tipe, file_name, object_key, content_type, size, status, created_at
             from bdb_panduan_pengguna where id = $1 and status = 'AKTIF' limit 1`,
            [targetId]
        );
        if (!rows.length) {
            throw new NotFoundException('Materi panduan tidak ditemukan atau sudah dinonaktifkan.');
        }
        const row = rows[0];

        await this.dataSource.query(
            `insert into bdb_panduan_access_log (panduan_id, jenis_personel, nama, nrp_nip, ip_address, user_agent)
             values ($1, $2, $3, $4, $5, $6)`,
            [row.id, jenis, nama, rawId, reqMeta?.ip || null, reqMeta?.userAgent || null]
        );

        const streamToken = this.createStreamToken(Number(row.id), {
            jenis_personel: jenis,
            nama,
            nrp_nip: rawId
        });
        const streamUrl = `/api/bdb/panduan/stream/${streamToken}`;
        const shareToken = this.createShareToken(Number(row.id));
        delete row.object_key;

        return {
            status: 1,
            message: 'Verifikasi identitas berhasil. Selamat menyaksikan materi panduan.',
            data: {
                ...row,
                url: streamUrl,
                stream_url: streamUrl,
                share_token: shareToken,
                viewer: {
                    jenis_personel: jenis,
                    nama,
                    nrp_nip: rawId
                }
            }
        };
    }

    /**
     * Stream terenkripsi langsung dari MinIO dengan dukungan HTTP 206 Partial Content (Byte-Range)
     * agar pemutaran video tutorial & pembacaan PDF aman tanpa mengekspos bucket publik.
     */
    async streamMedia(token: string, req: any, res: any) {
        const payload = decryptTokenPayload(token);
        let rows: any[] = [];
        if (payload && (payload.kind === 'panduan_stream' || payload.kind === 'panduan_share')) {
            const id = Number(payload.id || 0);
            rows = await this.dataSource.query(
                `select id, judul, tipe, file_name, object_key, content_type, size, status from bdb_panduan_pengguna where id = $1 limit 1`,
                [id]
            );
        } else {
            let decoded = '';
            try {
                decoded = decodeURIComponent(String(token || '').trim());
            } catch {
                decoded = String(token || '').trim();
            }
            if (/^\d+$/.test(decoded)) {
                rows = await this.dataSource.query(
                    `select id, judul, tipe, file_name, object_key, content_type, size, status from bdb_panduan_pengguna where id = $1 limit 1`,
                    [Number(decoded)]
                );
            } else if (decoded) {
                rows = await this.dataSource.query(
                    `select id, judul, tipe, file_name, object_key, content_type, size, status from bdb_panduan_pengguna
                     where lower(file_name) = lower($1)
                        or lower(object_key) = lower($1)
                        or lower(object_key) like '%/' || lower($1)
                     order by id asc limit 1`,
                    [decoded]
                );
            }
            if (!rows.length) {
                throw new ForbiddenException('Token stream terenkripsi tidak valid atau telah kedaluwarsa.');
            }
        }
        if (!rows.length || rows[0].status !== 'AKTIF') {
            throw new NotFoundException('Berkas panduan tidak ditemukan.');
        }
        const row = rows[0];
        const stat = await this.minio.statObject(row.object_key);
        const totalSize = Number(stat?.size || row.size || 0);
        const contentType = row.content_type || (row.tipe === 'VIDEO' ? 'video/mp4' : 'application/pdf');
        const safeName = String(row.file_name || `panduan_${row.id}`).replace(/[^a-zA-Z0-9._-]/g, '_');

        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Accept-Ranges', 'bytes');
        res.setHeader('Cache-Control', 'private, max-age=3600');
        res.setHeader('Content-Disposition', `inline; filename="${safeName}"`);

        const rangeHeader = req.headers?.range;
        if (rangeHeader && totalSize > 0) {
            const match = /^bytes=(\d*)-(\d*)$/i.exec(String(rangeHeader).trim());
            if (match) {
                const start = match[1] ? parseInt(match[1], 10) : 0;
                const end = match[2] ? Math.min(parseInt(match[2], 10), totalSize - 1) : Math.min(start + 2 * 1024 * 1024 - 1, totalSize - 1);
                if (start >= 0 && start <= end && end < totalSize) {
                    const chunkLength = end - start + 1;
                    res.status(206);
                    res.setHeader('Content-Range', `bytes ${start}-${end}/${totalSize}`);
                    res.setHeader('Content-Length', String(chunkLength));
                    res.setHeader('Content-Type', contentType);
                    const partialStream = await this.minio.getPartialObject(row.object_key, start, chunkLength);
                    partialStream.on('error', () => {
                        if (!res.headersSent) res.status(500).end();
                    });
                    return partialStream.pipe(res);
                }
            }
        }

        if (totalSize > 0) {
            res.setHeader('Content-Length', String(totalSize));
        }
        res.setHeader('Content-Type', contentType);
        res.status(200);
        const fullStream = await this.minio.getObjectStream(row.object_key);
        fullStream.on('error', () => {
            if (!res.headersSent) res.status(500).end();
        });
        return fullStream.pipe(res);
    }

    async create(authUser: any, dto: { judul?: string; deskripsi?: string; kategori?: string; tipe?: string; urutan?: string }, file?: UploadedFileLike) {
        this.assertSuperadmin(authUser, 'CREATE');
        const judul = (dto.judul || '').trim();
        if (!judul) throw new BadRequestException('Judul panduan wajib diisi.');
        const tipe = (dto.tipe || '').toUpperCase();
        if (!ALLOWED_TIPE.includes(tipe)) throw new BadRequestException('Tipe harus VIDEO atau PDF.');
        if (!file) throw new BadRequestException('File panduan wajib diunggah.');
        assertMimetypeMatchesTipe(tipe, file);

        const key = await this.minio.upload(file, 'panduan');
        const ins = await this.dataSource.query(
            `insert into bdb_panduan_pengguna (judul, deskripsi, kategori, tipe, file_name, object_key, content_type, size, urutan, created_by)
             values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) returning id`,
            [judul, dto.deskripsi?.trim() || null, dto.kategori?.trim() || null, tipe, file.originalname, key, file.mimetype || null, file.size || null, Number(dto.urutan) || 0, authUser?.id || null]
        );

        await this.audit.log({ user: authUser, action: 'CREATE', entity: 'panduan_pengguna', entityId: ins[0].id, meta: { judul, tipe, file_name: file.originalname } });
        return { status: 1, message: 'Panduan ditambahkan.', data: { id: ins[0].id } };
    }

    async update(authUser: any, id: number, dto: { judul?: string; deskripsi?: string; kategori?: string; urutan?: string }, file?: UploadedFileLike) {
        this.assertSuperadmin(authUser, 'UPDATE');
        const rows = await this.dataSource.query('select id, object_key, judul, tipe from bdb_panduan_pengguna where id=$1', [id]);
        if (!rows.length) throw new NotFoundException('Panduan tidak ditemukan.');
        const existing = rows[0];

        let objectKey = existing.object_key;
        let fileName: string | undefined;
        let contentType: string | undefined;
        let size: number | undefined;
        if (file) {
            assertMimetypeMatchesTipe(existing.tipe, file);
            objectKey = await this.minio.upload(file, 'panduan');
            fileName = file.originalname;
            contentType = file.mimetype;
            size = file.size;
            try {
                await this.minio.remove(existing.object_key);
            } catch {
                /* file lama dibiarkan kalau gagal dihapus */
            }
        }

        await this.dataSource.query(
            `update bdb_panduan_pengguna set
                judul = coalesce($2, judul),
                deskripsi = $3,
                kategori = $4,
                urutan = coalesce($5, urutan),
                object_key = $6,
                file_name = coalesce($7, file_name),
                content_type = coalesce($8, content_type),
                size = coalesce($9, size),
                updated_at = now()
             where id = $1`,
            [id, dto.judul?.trim() || null, dto.deskripsi?.trim() || null, dto.kategori?.trim() || null, dto.urutan !== undefined ? Number(dto.urutan) : null, objectKey, fileName || null, contentType || null, size || null]
        );

        await this.audit.log({ user: authUser, action: 'UPDATE', entity: 'panduan_pengguna', entityId: id, meta: { judul: dto.judul || existing.judul, file_replaced: !!file } });
        return { status: 1, message: 'Panduan diperbarui.' };
    }

    async updateStatus(authUser: any, id: number, status: string) {
        this.assertSuperadmin(authUser, 'UPDATE_STATUS');
        const s = (status || '').toUpperCase();
        if (!['AKTIF', 'NONAKTIF'].includes(s)) throw new BadRequestException('Status harus AKTIF atau NONAKTIF.');
        const rows = await this.dataSource.query('select judul from bdb_panduan_pengguna where id=$1', [id]);
        if (!rows.length) throw new NotFoundException('Panduan tidak ditemukan.');
        await this.dataSource.query('update bdb_panduan_pengguna set status=$2, updated_at=now() where id=$1', [id, s]);
        await this.audit.log({ user: authUser, action: 'UPDATE_STATUS', entity: 'panduan_pengguna', entityId: id, meta: { judul: rows[0].judul, status: s } });
        return { status: 1, message: `Panduan ${s === 'AKTIF' ? 'diaktifkan' : 'dinonaktifkan'}.`, data: { status: s } };
    }

    async remove(authUser: any, id: number) {
        this.assertSuperadmin(authUser, 'DELETE');
        const rows = await this.dataSource.query('select object_key, judul from bdb_panduan_pengguna where id=$1', [id]);
        if (!rows.length) throw new NotFoundException('Panduan tidak ditemukan.');
        try {
            await this.minio.remove(rows[0].object_key);
        } catch {
            /* metadata tetap dihapus walau objek gagal dihapus */
        }
        await this.dataSource.query('delete from bdb_panduan_pengguna where id=$1', [id]);
        await this.audit.log({ user: authUser, action: 'DELETE', entity: 'panduan_pengguna', entityId: id, meta: { judul: rows[0].judul } });
        return { status: 1, message: 'Panduan dihapus.' };
    }
}
