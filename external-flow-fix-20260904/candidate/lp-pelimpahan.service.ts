import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { resolveScope } from '../common/scope.util';
import { encodeId } from '../laporan-polisi/id-cipher.util';
import { MinioService, UploadedFileLike } from '../kerma/minio.service';

/**
 * Pelimpahan LP antar satker. Riwayat WAJIB (asal, tujuan, waktu, pelaku, keterangan) --
 * lihat 039_lp_pelimpahan.sql. Tujuan pelimpahan DIBATASI server-side (bukan cuma UI):
 * hanya boleh ke 1 hirarki ke atas (induk langsung), 1 hirarki ke bawah (anak langsung),
 * atau sesama level dalam 1 kelompok (sibling -- anak lain dari induk yang sama, mis. dari
 * SATRESKRIM ke SAT NARKOBA / SAT LANTAS di bawah polres yang sama).
 *
 * Begitu satker_id LP berpindah ke tujuan, satker asal OTOMATIS kehilangan akses ke semua
 * aktivitas LP ini (detail/list/dokumen/tingkat-kesulitan semua bandingkan scope.satkerId
 * dengan satker_id TERKINI) -- satu-satunya akses yang tersisa utk satker asal adalah lewat
 * menu Arsip LP Pelimpahan (profil + riwayat, read-only).
 */
@Injectable()
export class LpPelimpahanService {
    private readonly logger = new Logger('LpPelimpahanService');
    constructor(
        private readonly dataSource: DataSource,
        private readonly minio: MinioService
    ) {}

    private schemaCheck: Promise<void> | null = null;

    async ensureTable() {
        if (!this.schemaCheck) {
            this.schemaCheck = (async () => {
                await this.dataSource.query(`select id,lp_id,satker_asal_id,satker_tujuan_id,
                    satker_eksternal_id,satker_eksternal_nama,nomor_dokumen,tanggal_dokumen
                    from bdb_lp_pelimpahan where false`);
                await this.dataSource.query(`select id,pelimpahan_id,file_name,object_key,content_type,size
                    from bdb_lp_pelimpahan_attachments where false`);
                await this.dataSource.query(`select sudah_dilimpahkan,dilimpahkan_eksternal
                    from bdb_laporan_polisi where false`);
            })().catch((error) => { this.schemaCheck = null; throw error; });
        }
        await this.schemaCheck;
    }

    // Deployment-only schema initializer; never called from a normal request.
    private async ensureTableForMigration() {
        await this.dataSource.query(`
            create table if not exists bdb_lp_pelimpahan (
                id bigserial primary key,
                lp_id bigint not null references bdb_laporan_polisi(id) on delete cascade,
                satker_asal_id bigint not null references bdb_satker(id),
                satker_asal_nama text,
                satker_tujuan_id bigint references bdb_satker(id),
                satker_tujuan_nama text,
                keterangan text,
                dilimpahkan_oleh bigint references auth_users(id),
                dilimpahkan_oleh_nama text,
                created_at timestamp not null default now()
            );
            create index if not exists bdb_lp_pelimpahan_lp_idx on bdb_lp_pelimpahan(lp_id);
            create index if not exists bdb_lp_pelimpahan_asal_idx on bdb_lp_pelimpahan(satker_asal_id);
            create index if not exists bdb_lp_pelimpahan_tujuan_idx on bdb_lp_pelimpahan(satker_tujuan_id);
            alter table bdb_lp_pelimpahan alter column satker_tujuan_id drop not null;
            alter table bdb_lp_pelimpahan add column if not exists satker_eksternal_id bigint references bdb_satker_eksternal(id);
            alter table bdb_lp_pelimpahan add column if not exists satker_eksternal_nama text;
            create index if not exists bdb_lp_pelimpahan_eksternal_idx on bdb_lp_pelimpahan(satker_eksternal_id);
            do $$ begin
                if not exists (select 1 from pg_constraint where conname = 'chk_lp_pelimpahan_tujuan') then
                    alter table bdb_lp_pelimpahan add constraint chk_lp_pelimpahan_tujuan check (
                        (satker_tujuan_id is not null and satker_eksternal_id is null)
                        or (satker_tujuan_id is null and satker_eksternal_id is not null)
                    );
                end if;
            end $$;
            alter table bdb_laporan_polisi add column if not exists sudah_dilimpahkan boolean not null default false;
            create index if not exists bdb_laporan_polisi_dilimpahkan_idx on bdb_laporan_polisi(sudah_dilimpahkan);
            alter table bdb_laporan_polisi add column if not exists dilimpahkan_eksternal boolean not null default false;
            create index if not exists bdb_laporan_polisi_dilimpahkan_eksternal_idx on bdb_laporan_polisi(dilimpahkan_eksternal);
            alter table bdb_lp_pelimpahan add column if not exists nomor_dokumen text;
            alter table bdb_lp_pelimpahan add column if not exists tanggal_dokumen date;
            create table if not exists bdb_lp_pelimpahan_attachments (
                id bigserial primary key,
                pelimpahan_id bigint not null references bdb_lp_pelimpahan(id) on delete cascade,
                file_name text not null,
                object_key text not null,
                content_type text,
                size bigint,
                created_at timestamptz not null default now()
            );
            create index if not exists idx_lp_pelimpahan_attachments_parent on bdb_lp_pelimpahan_attachments(pelimpahan_id);
        `);
    }

    private async lpRow(lpId: number) {
        const rows = await this.dataSource.query('select id, satker_id, satker_nama, no_laporan from bdb_laporan_polisi where id=$1', [lpId]);
        return rows[0] || null;
    }

    /** Induk (1 ke atas), anak (1 ke bawah), sesama kelompok (sibling) dari satker LP saat ini. */
    async allowedTargets(lpId: number) {
        const lp = await this.lpRow(lpId);
        if (!lp) throw new NotFoundException('LP tidak ditemukan.');
        if (!lp.satker_id) return { status: 1, data: { induk: [], anak: [], sesama: [] } };

        const current = await this.dataSource.query('select id, kode, deskripsi, parent_id from bdb_satker where id=$1', [lp.satker_id]);
        if (!current.length) return { status: 1, data: { induk: [], anak: [], sesama: [] } };
        const c = current[0];

        const induk = c.parent_id ? await this.dataSource.query('select id, kode, deskripsi from bdb_satker where id=$1', [c.parent_id]) : [];
        const anak = await this.dataSource.query('select id, kode, deskripsi from bdb_satker where parent_id=$1 order by deskripsi', [c.id]);
        const sesama = c.parent_id
            ? await this.dataSource.query('select id, kode, deskripsi from bdb_satker where parent_id=$1 and id != $2 order by deskripsi', [c.parent_id, c.id])
            : [];

        return { status: 1, data: { induk, anak, sesama } };
    }

    private async isAllowedTarget(currentSatkerId: number, targetSatkerId: number): Promise<boolean> {
        const rows = await this.dataSource.query(
            `select 1 from bdb_satker cur
             where cur.id = $1 and (
                 cur.parent_id = $2
                 or exists (select 1 from bdb_satker t where t.id = $2 and t.parent_id = cur.id)
                 or exists (select 1 from bdb_satker t where t.id = $2 and t.parent_id = cur.parent_id and t.id != cur.id)
             )`,
            [currentSatkerId, targetSatkerId]
        );
        return rows.length > 0;
    }

    /** Buat pelimpahan: validasi akses (pelaku = satker pemegang saat ini / admin) + validasi tujuan (server-side). */
    async create(opts: { lpId: number; satkerTujuanId: number; keterangan?: string; nomorDokumen?: string; tanggalDokumen?: string; userId?: number }) {
        await this.ensureTable();
        const lp = await this.lpRow(opts.lpId);
        if (!lp) throw new NotFoundException('LP tidak ditemukan.');
        if (!lp.satker_id) throw new BadRequestException('LP ini belum punya satker penanganan.');

        const scope = await resolveScope(this.dataSource, opts.userId);
        if (!scope.all && Number(lp.satker_id) !== scope.satkerId) {
            throw new ForbiddenException('LP ini bukan berada di satker Anda -- tidak bisa dilimpahkan.');
        }

        if (Number(opts.satkerTujuanId) === Number(lp.satker_id)) {
            throw new BadRequestException('Satker tujuan sama dengan satker saat ini.');
        }
        const allowed = await this.isAllowedTarget(Number(lp.satker_id), Number(opts.satkerTujuanId));
        if (!allowed) {
            throw new BadRequestException('Satker tujuan harus 1 tingkat di atas, 1 tingkat di bawah, atau sesama kelompok (induk yang sama) dari satker saat ini.');
        }

        const tujuan = await this.dataSource.query('select id, kode, deskripsi from bdb_satker where id=$1', [opts.satkerTujuanId]);
        if (!tujuan.length) throw new NotFoundException('Satker tujuan tidak ditemukan.');

        let userNama: string | null = null;
        if (opts.userId) {
            const u = await this.dataSource.query('select name from auth_users where id=$1', [opts.userId]);
            userNama = u[0]?.name || null;
        }

        let pelimpahanId: number;
        const runner = this.dataSource.createQueryRunner();
        await runner.connect();
        await runner.startTransaction();
        try {
            const inserted = await runner.query(
                `insert into bdb_lp_pelimpahan
                    (lp_id, satker_asal_id, satker_asal_nama, satker_tujuan_id, satker_tujuan_nama, keterangan, nomor_dokumen, tanggal_dokumen, dilimpahkan_oleh, dilimpahkan_oleh_nama)
                 values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
                 returning id`,
                [opts.lpId, lp.satker_id, lp.satker_nama, tujuan[0].id, tujuan[0].deskripsi, opts.keterangan || null, opts.nomorDokumen || null, opts.tanggalDokumen || null, opts.userId || null, userNama]
            );
            pelimpahanId = inserted[0].id;
            await runner.query(
                `update bdb_laporan_polisi
                 set satker_id=$2, satker_nama=$3, sudah_dilimpahkan=true,
                     unit_satker_id=null, unit_satker_nama=null, unit_satker_kode=null, updated_at=now()
                 where id=$1`,
                [opts.lpId, tujuan[0].id, tujuan[0].deskripsi]
            );
            await runner.commitTransaction();
        } catch (e) {
            await runner.rollbackTransaction();
            throw e;
        } finally {
            await runner.release();
        }

        this.logger.log(`LP ${opts.lpId} (${lp.no_laporan}) dilimpahkan dari "${lp.satker_nama}" ke "${tujuan[0].deskripsi}" oleh ${userNama || opts.userId || '?'}`);
        return {
            status: 1,
            data: { pelimpahan_id: pelimpahanId, lp_id: opts.lpId, satker_asal: lp.satker_nama, satker_tujuan: tujuan[0].deskripsi },
            message: `LP dilimpahkan ke "${tujuan[0].deskripsi}". Satker asal tidak lagi punya akses aktif ke LP ini.`,
        };
    }

    /** Limpahkan LP ke Satker Eksternal (instansi di luar hierarki bdb_satker, mis. Kejaksaan).
     *  Pelimpahan hanya memindahkan penanganan; pelimpahan BUKAN penyelesaian perkara dan tidak
     *  boleh mengubah kategori statistik CT menjadi CC. Karena tujuan eksternal bukan bagian dari
     *  FK bdb_satker, tujuan disimpan di riwayat bdb_lp_pelimpahan dan LP dikeluarkan dari akses
     *  aktif satker asal lewat dilimpahkan_eksternal=true. Status alur dan tanggal_selesai tetap. */
    async createEksternal(opts: { lpId: number; satkerEksternalId: number; keterangan?: string; nomorDokumen?: string; tanggalDokumen?: string; userId?: number }) {
        await this.ensureTable();
        const lp = await this.dataSource.query('select id, satker_id, satker_nama, no_laporan, dilimpahkan_eksternal from bdb_laporan_polisi where id=$1', [opts.lpId]);
        if (!lp.length) throw new NotFoundException('LP tidak ditemukan.');
        if (!lp[0].satker_id) throw new BadRequestException('LP ini belum punya satker penanganan.');
        if (lp[0].dilimpahkan_eksternal) throw new BadRequestException('LP ini sudah pernah dilimpahkan ke instansi eksternal sebelumnya.');

        const scope = await resolveScope(this.dataSource, opts.userId);
        if (!scope.all && Number(lp[0].satker_id) !== scope.satkerId) {
            throw new ForbiddenException('LP ini bukan berada di satker Anda -- tidak bisa dilimpahkan.');
        }

        const tujuan = await this.dataSource.query('select id, nama from bdb_satker_eksternal where id=$1', [opts.satkerEksternalId]);
        if (!tujuan.length) throw new NotFoundException('Satker eksternal tujuan tidak ditemukan.');


        let userNama: string | null = null;
        if (opts.userId) {
            const u = await this.dataSource.query('select name from auth_users where id=$1', [opts.userId]);
            userNama = u[0]?.name || null;
        }

        let pelimpahanId: number;
        const runner = this.dataSource.createQueryRunner();
        await runner.connect();
        await runner.startTransaction();
        try {
            const inserted = await runner.query(
                `insert into bdb_lp_pelimpahan
                    (lp_id, satker_asal_id, satker_asal_nama, satker_eksternal_id, satker_eksternal_nama, keterangan, nomor_dokumen, tanggal_dokumen, dilimpahkan_oleh, dilimpahkan_oleh_nama)
                 values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
                 returning id`,
                [opts.lpId, lp[0].satker_id, lp[0].satker_nama, tujuan[0].id, tujuan[0].nama, opts.keterangan || null, opts.nomorDokumen || null, opts.tanggalDokumen || null, opts.userId || null, userNama]
            );
            pelimpahanId = inserted[0].id;
            await runner.query(
                `update bdb_laporan_polisi
                 set sudah_dilimpahkan=true, dilimpahkan_eksternal=true, updated_at=now()
                 where id=$1`,
                [opts.lpId]
            );
            await runner.commitTransaction();
        } catch (e) {
            await runner.rollbackTransaction();
            throw e;
        } finally {
            await runner.release();
        }

        this.logger.log(`LP ${opts.lpId} (${lp[0].no_laporan}) dilimpahkan dari "${lp[0].satker_nama}" ke instansi eksternal "${tujuan[0].nama}" oleh ${userNama || opts.userId || '?'}`);
        return {
            status: 1,
            data: { pelimpahan_id: pelimpahanId, lp_id: opts.lpId, satker_asal: lp[0].satker_nama, satker_eksternal: tujuan[0].nama },
            message: `LP dilimpahkan ke instansi eksternal "${tujuan[0].nama}". Status CT/CC tidak diubah; satker Anda tidak lagi punya akses aktif ke LP ini.`,
        };
    }

    /** Riwayat pelimpahan 1 LP (dipakai di profil LP & arsip -- tampil ke siapa saja yg pernah jadi asal/tujuan). */
    async riwayat(lpId: number) {
        const rows = await this.dataSource.query(
            `select p.id, p.satker_asal_id, p.satker_asal_nama, p.satker_tujuan_id, p.satker_tujuan_nama, p.satker_eksternal_id, p.satker_eksternal_nama,
                    p.keterangan, p.nomor_dokumen, p.tanggal_dokumen, p.dilimpahkan_oleh_nama, p.created_at,
                    (select count(*)::int from bdb_lp_pelimpahan_attachments a where a.pelimpahan_id = p.id) as jumlah_lampiran
             from bdb_lp_pelimpahan p where p.lp_id=$1 order by p.created_at asc`,
            [lpId]
        );
        return { status: 1, data: rows };
    }

    /** Cek user berhak lihat arsip 1 LP: pernah jadi asal/tujuan di riwayatnya, atau admin/superadmin. */
    private async hasArsipAccess(lpId: number, userId?: number): Promise<boolean> {
        const scope = await resolveScope(this.dataSource, userId);
        if (scope.all) return true;
        if (!scope.satkerId) return false;
        const rows = await this.dataSource.query(
            `select 1 from bdb_lp_pelimpahan where lp_id=$1 and (satker_asal_id=$2 or satker_tujuan_id=$2) limit 1`,
            [lpId, scope.satkerId]
        );
        return rows.length > 0;
    }

    /** Daftar arsip: LP yang pernah dilimpahkan, di-scope ke satker yg pernah terlibat (asal/tujuan) di riwayatnya. */
    async arsip(opts: { userId?: number; search?: string; page?: number; row?: number }) {
        await this.ensureTable();
        const scope = await resolveScope(this.dataSource, opts.userId);
        const page = Math.max(opts.page || 1, 1);
        const row = Math.min(Math.max(opts.row || 25, 1), 1000);
        const offset = (page - 1) * row;

        const params: any[] = [];
        const where: string[] = [`lp.sudah_dilimpahkan = true`];
        if (!scope.all) {
            if (!scope.satkerId) return { status: 1, data: [], total: 0, page, row };
            params.push(scope.satkerId);
            where.push(`exists (select 1 from bdb_lp_pelimpahan p where p.lp_id = lp.id and (p.satker_asal_id = $${params.length} or p.satker_tujuan_id = $${params.length}))`);
        }
        if (opts.search) {
            params.push(`%${opts.search}%`);
            where.push(`lp.no_laporan ilike $${params.length}`);
        }
        const whereSql = `where ${where.join(' and ')}`;

        const totalRes = await this.dataSource.query(`select count(*)::int as c from bdb_laporan_polisi lp ${whereSql}`, params);
        const rows = await this.dataSource.query(
            `select lp.id, lp.no_laporan, lp.tgl_laporan, lp.kategori, lp.dilimpahkan_eksternal, coalesce(lp.unit_satker_id, lp.satker_id) as satker_saat_ini_id, coalesce(lp.unit_satker_nama, lp.satker_nama) as satker_saat_ini_nama,
                    (select p2.satker_asal_nama from bdb_lp_pelimpahan p2 where p2.lp_id = lp.id order by p2.created_at asc limit 1) as satker_asal_pertama,
                    (select count(*)::int from bdb_lp_pelimpahan p3 where p3.lp_id = lp.id) as jumlah_pelimpahan,
                    (select p4.created_at from bdb_lp_pelimpahan p4 where p4.lp_id = lp.id order by p4.created_at desc limit 1) as terakhir_dilimpahkan_at,
                    case when lp.dilimpahkan_eksternal then
                        (select coalesce(p5.satker_tujuan_nama, p5.satker_eksternal_nama) from bdb_lp_pelimpahan p5 where p5.lp_id = lp.id order by p5.created_at desc, p5.id desc limit 1)
                    else coalesce(lp.unit_satker_nama, lp.satker_nama) end as tujuan_terakhir_nama
             from bdb_laporan_polisi lp
             ${whereSql}
             order by lp.updated_at desc
             limit ${row} offset ${offset}`,
            params
        );
        for (const r of rows) r.pid = encodeId(r.id);
        return { status: 1, data: rows, total: totalRes[0]?.c || 0, page, row };
    }

    /** Detail arsip 1 LP: profil (read-only) + riwayat lengkap. Akses via hasArsipAccess(). */
    async arsipDetail(lpId: number, userId?: number) {
        const boleh = await this.hasArsipAccess(lpId, userId);
        if (!boleh) return { status: 0, data: null, message: 'LP tidak ditemukan.' };
        const rows = await this.dataSource.query('select * from bdb_laporan_polisi where id=$1', [lpId]);
        const row = rows[0] || null;
        if (!row) return { status: 0, data: null, message: 'LP tidak ditemukan.' };
        row.pid = encodeId(row.id);
        const riwayat = await this.riwayat(lpId);
        return { status: 1, data: { profil: row, riwayat: riwayat.data } };
    }

    /** lp_id pemilik 1 baris riwayat pelimpahan -- dipakai utk scope-check akses lampiran. */
    private async pelimpahanLpId(pelimpahanId: number): Promise<number | null> {
        const rows = await this.dataSource.query('select lp_id from bdb_lp_pelimpahan where id=$1', [pelimpahanId]);
        return rows[0]?.lp_id ?? null;
    }

    /** Cek akses ke 1 baris riwayat pelimpahan: sama seperti akses arsip LP-nya (pernah jadi
     *  asal/tujuan, atau superadmin) -- dokumen pelimpahan bukan milik satker tertentu saja. */
    private async assertAttachmentAccess(pelimpahanId: number, userId?: number): Promise<number> {
        const lpId = await this.pelimpahanLpId(pelimpahanId);
        if (lpId == null) throw new NotFoundException('Riwayat pelimpahan tidak ditemukan.');
        const boleh = await this.hasArsipAccess(lpId, userId);
        if (!boleh) throw new ForbiddenException('Anda tidak berhak mengakses lampiran pelimpahan ini.');
        return lpId;
    }

    // ===== Lampiran dokumen pelimpahan (MinIO) =====
    async addAttachments(pelimpahanId: number, userId: number | undefined, files: UploadedFileLike[]) {
        await this.ensureTable();
        await this.assertAttachmentAccess(pelimpahanId, userId);
        for (const f of files || []) {
            const key = await this.minio.upload(f, 'lp-pelimpahan');
            await this.dataSource.query(
                `insert into bdb_lp_pelimpahan_attachments (pelimpahan_id, file_name, object_key, content_type, size) values ($1,$2,$3,$4,$5)`,
                [pelimpahanId, f.originalname, key, f.mimetype || null, f.size || null]
            );
        }
        return this.listAttachments(pelimpahanId, userId);
    }

    async listAttachments(pelimpahanId: number, userId: number | undefined) {
        await this.assertAttachmentAccess(pelimpahanId, userId);
        const rows = await this.dataSource.query(
            `select id, file_name, object_key, content_type, size, created_at from bdb_lp_pelimpahan_attachments where pelimpahan_id = $1 order by id desc`,
            [pelimpahanId]
        );
        const data = [];
        for (const r of rows) {
            let url: string | null = null;
            try {
                url = await this.minio.presignedUrl(r.object_key, 3600);
            } catch {
                url = null;
            }
            data.push({ id: r.id, file_name: r.file_name, content_type: r.content_type, size: r.size, created_at: r.created_at, url });
        }
        return { status: 1, data };
    }

    async removeAttachment(attId: number, userId: number | undefined) {
        const rows = await this.dataSource.query('select pelimpahan_id, object_key from bdb_lp_pelimpahan_attachments where id = $1', [attId]);
        if (!rows.length) throw new NotFoundException('Lampiran tidak ditemukan.');
        await this.assertAttachmentAccess(Number(rows[0].pelimpahan_id), userId);
        try {
            await this.minio.remove(rows[0].object_key);
        } catch {
            /* biarkan hapus metadata walau objek gagal dihapus */
        }
        await this.dataSource.query('delete from bdb_lp_pelimpahan_attachments where id = $1', [attId]);
        return { status: 1, message: 'Lampiran dihapus.' };
    }
}
