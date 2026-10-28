import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes } from 'crypto';
import { jwtConstants } from '@app_core/auth/constants';
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
        if (role !== 'superadmin') {
            void this.audit.log({ user: authUser, action, entity: 'panduan_pengguna', meta: { outcome: 'ERROR', message: 'Bukan superadmin' } });
            throw new ForbiddenException('Hanya superadmin yang dapat mengelola Panduan Pengguna.');
        }
    }

    /**
     * Daftar panduan. Role selain superadmin (atau superadmin tanpa includeInactive) cuma
     * lihat yang AKTIF. Superadmin di halaman Kelola minta includeInactive=true utk lihat semua.
     */
    async list(authUser: any, includeInactive: boolean) {
        const isSuper = String(authUser?.role_bdb || '').toLowerCase() === 'superadmin';
        const where = includeInactive && isSuper ? '' : "where status = 'AKTIF'";
        const rows = await this.dataSource.query(
            `select id, judul, deskripsi, kategori, tipe, file_name, content_type, size, urutan, status, created_at
             from bdb_panduan_pengguna ${where} order by urutan asc, created_at desc`
        );
        const enriched = rows.map((r: any) => ({
            ...r,
            share_token: this.createShareToken(Number(r.id))
        }));
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
        const isSuper = String(authUser?.role_bdb || '').toLowerCase() === 'superadmin';
        if (row.status !== 'AKTIF' && !isSuper) {
            throw new NotFoundException('Panduan tidak ditemukan.');
        }
        const streamToken = this.createStreamToken(Number(row.id), {
            userId: authUser?.id || authUser?.user?.id,
            nama: authUser?.name || authUser?.user?.name || 'Internal User'
        });
        const streamUrl = `/api/bdb/panduan/stream/${streamToken}`;
        const shareToken = this.createShareToken(Number(row.id));
        let url: string | null = streamUrl;
        if (row.tipe === 'PDF') {
            try {
                url = (await this.minio.presignedUrl(row.object_key, 3600)) || streamUrl;
            } catch {
                url = streamUrl;
            }
        }
        delete row.object_key;
        return {
            status: 1,
            data: {
                ...row,
                url,
                stream_url: streamUrl,
                share_token: shareToken
            }
        };
    }

    /**
     * Menghasilkan tantangan Captcha & info dasar panduan saat link terenkripsi dibuka.
     */
    async getShareChallenge(shareToken?: string, panduanId?: number) {
        let targetId = Number(panduanId || 0);
        if (shareToken) {
            const decoded = decryptTokenPayload(shareToken);
            if (!decoded || (decoded.kind !== 'panduan_share' && decoded.kind !== 'panduan_stream')) {
                throw new BadRequestException('Tautan terenkripsi tidak valid atau sudah kedaluwarsa.');
            }
            targetId = Number(decoded.id || 0);
        }
        let panduanInfo: any = null;
        if (targetId > 0) {
            const rows = await this.dataSource.query(
                `select id, judul, deskripsi, kategori, tipe, file_name, size from bdb_panduan_pengguna where id = $1 and status = 'AKTIF' limit 1`,
                [targetId]
            );
            if (!rows.length) throw new NotFoundException('Materi panduan tidak ditemukan atau tidak aktif.');
            panduanInfo = rows[0];
        }

        // Buat kode captcha kombinasi angka + huruf + operasi hitung mudah agar ramah pengguna tapi tahan bot
        const a = Math.floor(Math.random() * 8) + 2; // 2..9
        const b = Math.floor(Math.random() * 8) + 1; // 1..8
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = '';
        for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
        const answer = `${code}-${a + b}`;
        const questionText = `Ketik kode "${code}" diikuti tanda strip dan hasil ${a} + ${b} (contoh: ${code}-${a + b})`;

        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="54" viewBox="0 0 240 54">
            <defs>
                <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="#0f172a"/>
                    <stop offset="100%" stop-color="#1e3a8a"/>
                </linearGradient>
            </defs>
            <rect width="240" height="54" rx="8" fill="url(#bg)"/>
            <path d="M12 40 Q 70 10, 130 38 T 228 18" stroke="rgba(56,189,248,0.28)" stroke-width="2" fill="none"/>
            <path d="M18 16 Q 95 44, 160 18 T 225 42" stroke="rgba(251,191,36,0.25)" stroke-width="1.5" fill="none"/>
            <text x="120" y="34" text-anchor="middle" fill="#f8fafc" font-family="monospace" font-size="21" font-weight="bold" letter-spacing="3">${code} - (${a}+${b})</text>
        </svg>`;
        const svgDataUrl = `data:image/svg+xml;base64,${Buffer.from(svg, 'utf8').toString('base64')}`;

        const challengeToken = encryptTokenPayload({
            kind: 'panduan_captcha',
            ans: answer.toUpperCase(),
            id: targetId || null,
            exp: Date.now() + 10 * 60 * 1000 // 10 menit
        });

        return {
            status: 1,
            data: {
                challenge_token: challengeToken,
                question: questionText,
                code_hint: `${code} + hasil (${a}+${b})`,
                svg_data_url: svgDataUrl,
                panduan: panduanInfo
            }
        };
    }

    /**
     * Verifikasi identitas penonton ("Siapa Kamu?"):
     * - jenis_personel: 'ANGGOTA_POLRI' | 'PNS_POLRI'
     * - nama: Nama Lengkap
     * - nrp_nip: NRP (~8 digit, validasi 6-10 digit) atau NIP (~16-18 digit, validasi 14-18 digit)
     * - captcha_answer & challenge_token
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
        },
        reqMeta?: { ip?: string; userAgent?: string }
    ) {
        await this.ensureAccessLogTable();

        const jenis = String(body?.jenis_personel || '').trim().toUpperCase();
        if (!['ANGGOTA_POLRI', 'PNS_POLRI'].includes(jenis)) {
            throw new BadRequestException('Pilih jenis personel: Anggota Polri atau PNS Polri.');
        }

        const nama = String(body?.nama || '').trim().replace(/\s+/g, ' ');
        if (nama.length < 3 || nama.length > 120) {
            throw new BadRequestException('Nama lengkap wajib diisi dengan benar (minimal 3 karakter).');
        }

        const rawId = String(body?.nrp_nip || '').replace(/[\s.-]/g, '').trim();
        if (!/^\d+$/.test(rawId)) {
            throw new BadRequestException(jenis === 'ANGGOTA_POLRI' ? 'NRP wajib berupa angka.' : 'NIP wajib berupa angka.');
        }
        if (jenis === 'ANGGOTA_POLRI' && (rawId.length < 6 || rawId.length > 10)) {
            throw new BadRequestException('NRP Anggota Polri wajib terdiri dari ±8 digit angka (rentang valid: 6 s.d. 10 digit).');
        }
        if (jenis === 'PNS_POLRI' && (rawId.length < 14 || rawId.length > 18)) {
            throw new BadRequestException('NIP PNS Polri wajib terdiri dari ±16-18 digit angka (rentang valid: 14 s.d. 18 digit).');
        }

        const challenge = decryptTokenPayload(String(body?.challenge_token || ''));
        if (!challenge || challenge.kind !== 'panduan_captcha') {
            throw new BadRequestException('Sesi Captcha telah kedaluwarsa. Silakan muat ulang Captcha.');
        }

        const userAns = String(body?.captcha_answer || '').trim().toUpperCase().replace(/\s+/g, '');
        const expectedAns = String(challenge.ans || '').trim().toUpperCase();
        // Izinkan juga jika user langsung mengetik kode saja atau format KODE-HASIL
        if (!userAns || userAns !== expectedAns) {
            throw new BadRequestException('Jawaban Captcha belum tepat. Perhatikan huruf/angka dan hasil penjumlahan pada gambar.');
        }

        let targetId = Number(body?.panduan_id || challenge.id || 0);
        if (body?.share_token) {
            const shared = decryptTokenPayload(body.share_token);
            if (!shared || (shared.kind !== 'panduan_share' && shared.kind !== 'panduan_stream')) {
                throw new BadRequestException('Tautan panduan terenkripsi tidak valid.');
            }
            targetId = Number(shared.id || targetId);
        }
        if (!targetId) {
            throw new BadRequestException('ID Panduan tidak ditemukan pada tautan.');
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
        delete row.object_key;

        return {
            status: 1,
            message: 'Verifikasi identitas berhasil. Selamat menyaksikan materi panduan.',
            data: {
                ...row,
                url: streamUrl,
                stream_url: streamUrl,
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
        if (!payload || (payload.kind !== 'panduan_stream' && payload.kind !== 'panduan_share')) {
            throw new ForbiddenException('Token stream terenkripsi tidak valid atau telah kedaluwarsa.');
        }
        const id = Number(payload.id || 0);
        const rows = await this.dataSource.query(
            `select id, judul, tipe, file_name, object_key, content_type, size, status from bdb_panduan_pengguna where id = $1 limit 1`,
            [id]
        );
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
