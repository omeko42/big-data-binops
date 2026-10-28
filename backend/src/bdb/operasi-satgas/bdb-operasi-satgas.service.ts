import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { MinioService, UploadedFileLike } from '../kerma/minio.service';
import { resolveScope } from '../common/scope.util';
import { effectiveLpScopeSql } from '../common/lp-scope.util';
import { encodeId } from '../laporan-polisi/id-cipher.util';
import { LaporanPolisiService } from '../laporan-polisi/laporan-polisi.service';

type Payload = Record<string, any>;

@Injectable()
export class BdbOperasiSatgasService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly minio: MinioService,
        private readonly laporanPolisiService: LaporanPolisiService
    ) {}

    private async actor(userId?: number) {
        const id = Number(userId || 0);
        if (!id) throw new ForbiddenException('Sesi pengguna tidak valid. Silakan login ulang.');
        const rows = await this.dataSource.query(
            `select id, name, lower(coalesce(role_bdb,'')) as role_bdb
             from auth_users
             where id = $1 and deleted_at is null
             limit 1`,
            [id]
        );
        if (!rows.length) throw new ForbiddenException('Akun pengguna tidak ditemukan atau sudah tidak aktif.');
        return {
            id: Number(rows[0].id),
            name: this.toText(rows[0].name),
            role: String(rows[0].role_bdb || '').toLowerCase(),
            isSuper: String(rows[0].role_bdb || '').toLowerCase() === 'superadmin'
        };
    }

    private assertNotViewer(actor: { role: string }) {
        if (actor?.role === 'viewer') {
            throw new ForbiddenException('Role viewer hanya memiliki hak akses lihat (read-only). Aksi tidak diizinkan.');
        }
    }

    private async ensureAttachmentTable() {
        await this.dataSource.query(`
            create table if not exists bdb_operasi_satgas_attachments (
                id bigserial primary key,
                operasi_satgas_id bigint not null,
                file_name text not null,
                object_key text not null,
                content_type text,
                size bigint,
                created_at timestamptz not null default now()
            );
            create index if not exists idx_operasi_satgas_attachments_parent on bdb_operasi_satgas_attachments (operasi_satgas_id);
            alter table bdb_operasi_satgas_attachments
                add column if not exists kategori_lampiran text not null default 'DOKUMENTASI',
                add column if not exists revisi_ke int,
                add column if not exists nomor_sprin text,
                add column if not exists tanggal_sprin date,
                add column if not exists catatan_perubahan text,
                add column if not exists judul_dokumentasi text,
                add column if not exists uploaded_by bigint;
        `);
    }

    private async syncLampiranJsonb(id: number) {
        try {
            const rows = await this.dataSource.query(
                `select id, file_name, object_key, content_type, size, created_at,
                        coalesce(kategori_lampiran, 'DOKUMENTASI') as kategori_lampiran,
                        revisi_ke, nomor_sprin, tanggal_sprin::text as tanggal_sprin,
                        catatan_perubahan, judul_dokumentasi, uploaded_by
                 from bdb_operasi_satgas_attachments
                 where operasi_satgas_id = $1
                 order by id asc`,
                [id]
            );
            const jsonArr = rows.map((r: any) => ({
                id: Number(r.id),
                file_name: r.file_name,
                filename: r.file_name,
                object_key: r.object_key,
                content_type: r.content_type,
                size: r.size ? Number(r.size) : null,
                kategori_lampiran: r.kategori_lampiran || 'DOKUMENTASI',
                revisi_ke: r.revisi_ke ? Number(r.revisi_ke) : null,
                nomor_sprin: r.nomor_sprin || null,
                tanggal_sprin: r.tanggal_sprin || null,
                catatan_perubahan: r.catatan_perubahan || null,
                judul_dokumentasi: r.judul_dokumentasi || null,
                uploaded_by: r.uploaded_by ? Number(r.uploaded_by) : null,
                uploaded_at: r.created_at
            }));
            await this.dataSource.query(`update bdb_operasi_satgas set lampiran = $2::jsonb where id = $1`, [id, JSON.stringify(jsonArr)]);
        } catch {
            /* ignore sync error */
        }
    }

    async addAttachments(id: number, files: UploadedFileLike[], meta: Payload = {}, userId?: number) {
        await this.ensureTable();
        await this.ensureAttachmentTable();
        const kategoriLampiran = String(meta?.kategori_lampiran || meta?.kategori || 'DOKUMENTASI').trim().toUpperCase() === 'SPRIN' ? 'SPRIN' : 'DOKUMENTASI';
        const nomorSprin = this.toText(meta?.nomor_sprin);
        const tanggalSprin = this.toDate(meta?.tanggal_sprin);
        const catatanPerubahan = this.toText(meta?.catatan_perubahan || meta?.catatan);
        const judulDokumentasi = this.toText(meta?.judul_dokumentasi || meta?.keterangan || meta?.judul);

        let nextRev: number | null = null;
        if (kategoriLampiran === 'SPRIN') {
            if (meta?.revisi_ke && Number(meta.revisi_ke) > 0) {
                nextRev = Number(meta.revisi_ke);
            } else {
                const revRow = await this.dataSource.query(
                    `select coalesce(max(revisi_ke), count(*))::int as max_rev
                     from bdb_operasi_satgas_attachments
                     where operasi_satgas_id = $1 and coalesce(kategori_lampiran, 'DOKUMENTASI') = 'SPRIN'`,
                    [id]
                );
                nextRev = Number(revRow?.[0]?.max_rev || 0) + 1;
            }
        }

        if (!files?.length) {
            if (kategoriLampiran === 'SPRIN' && (nomorSprin || catatanPerubahan)) {
                await this.dataSource.query(
                    `insert into bdb_operasi_satgas_attachments
                        (operasi_satgas_id, file_name, object_key, content_type, size, kategori_lampiran, revisi_ke, nomor_sprin, tanggal_sprin, catatan_perubahan, judul_dokumentasi, uploaded_by)
                     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
                    [
                        id,
                        nomorSprin ? `Sprin_${nomorSprin.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf` : `Sprin_Revisi_${nextRev || 1}.pdf`,
                        '',
                        'application/pdf',
                        null,
                        'SPRIN',
                        nextRev,
                        nomorSprin,
                        tanggalSprin,
                        catatanPerubahan,
                        judulDokumentasi,
                        userId ?? null
                    ]
                );
                if (nomorSprin) {
                    await this.dataSource.query(
                        `update bdb_operasi_satgas set nomor_dasar = coalesce(nullif(nomor_dasar, ''), $2), tanggal_dibentuk = coalesce(tanggal_dibentuk, $3::date), updated_at = now() where id = $1`,
                        [id, nomorSprin, tanggalSprin]
                    );
                }
                await this.syncLampiranJsonb(id);
            }
            return this.listAttachments(id);
        }

        let idx = 0;
        for (const f of files) {
            const key = await this.minio.upload(f, 'operasi-satgas');
            const revVal = kategoriLampiran === 'SPRIN' ? (nextRev !== null ? nextRev + idx : idx + 1) : null;
            await this.dataSource.query(
                `insert into bdb_operasi_satgas_attachments
                    (operasi_satgas_id, file_name, object_key, content_type, size, kategori_lampiran, revisi_ke, nomor_sprin, tanggal_sprin, catatan_perubahan, judul_dokumentasi, uploaded_by)
                 values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
                [
                    id,
                    f.originalname,
                    key,
                    f.mimetype || null,
                    f.size || null,
                    kategoriLampiran,
                    revVal,
                    nomorSprin,
                    tanggalSprin,
                    catatanPerubahan,
                    judulDokumentasi,
                    userId ?? null
                ]
            );
            idx++;
        }
        if (kategoriLampiran === 'SPRIN' && nomorSprin) {
            await this.dataSource.query(
                `update bdb_operasi_satgas set nomor_dasar = $2, tanggal_dibentuk = coalesce($3::date, tanggal_dibentuk), updated_at = now() where id = $1`,
                [id, nomorSprin, tanggalSprin]
            );
        }
        await this.syncLampiranJsonb(id);
        return this.listAttachments(id);
    }

    async listAttachments(id: number) {
        await this.ensureAttachmentTable();
        const rows = await this.dataSource.query(
            `select id, file_name, object_key, content_type, size, created_at,
                    coalesce(kategori_lampiran, 'DOKUMENTASI') as kategori_lampiran,
                    revisi_ke, nomor_sprin, tanggal_sprin::text as tanggal_sprin,
                    catatan_perubahan, judul_dokumentasi, uploaded_by
             from bdb_operasi_satgas_attachments
             where operasi_satgas_id = $1
             order by case when coalesce(kategori_lampiran,'DOKUMENTASI')='SPRIN' then coalesce(revisi_ke,0) else 0 end desc, id desc`,
            [id]
        );
        const data = [];
        for (const r of rows) {
            let url: string | null = null;
            if (r.object_key) {
                try {
                    url = await this.minio.presignedUrl(r.object_key, 3600);
                } catch {
                    url = null;
                }
            }
            data.push({
                id: r.id,
                file_name: r.file_name,
                filename: r.file_name,
                content_type: r.content_type,
                size: r.size,
                created_at: r.created_at,
                uploaded_at: r.created_at,
                kategori_lampiran: r.kategori_lampiran || 'DOKUMENTASI',
                revisi_ke: r.revisi_ke ? Number(r.revisi_ke) : null,
                nomor_sprin: r.nomor_sprin || null,
                tanggal_sprin: r.tanggal_sprin || null,
                catatan_perubahan: r.catatan_perubahan || null,
                judul_dokumentasi: r.judul_dokumentasi || null,
                uploaded_by: r.uploaded_by ? Number(r.uploaded_by) : null,
                url
            });
        }
        return {
            status: 1,
            data,
            sprin: data.filter((x) => x.kategori_lampiran === 'SPRIN'),
            dokumentasi: data.filter((x) => x.kategori_lampiran !== 'SPRIN')
        };
    }

    async removeAttachment(attId: number) {
        await this.ensureAttachmentTable();
        const rows = await this.dataSource.query(`select operasi_satgas_id, object_key from bdb_operasi_satgas_attachments where id = $1`, [attId]);
        if (!rows.length) throw new NotFoundException('Lampiran tidak ditemukan');
        const opsId = Number(rows[0].operasi_satgas_id);
        if (rows[0].object_key) {
            try {
                await this.minio.remove(rows[0].object_key);
            } catch {
                /* biarkan hapus metadata walau objek gagal dihapus */
            }
        }
        await this.dataSource.query(`delete from bdb_operasi_satgas_attachments where id = $1`, [attId]);
        await this.syncLampiranJsonb(opsId);
        return { status: 1, message: 'Lampiran dihapus' };
    }

    private tableEnsured = false;
    async ensureTable() {
        if (this.tableEnsured) return;
        this.tableEnsured = true;
        await this.dataSource.query(`
            create table if not exists bdb_operasi_satgas (
                id bigserial primary key,
                jenis text not null default 'OPERASI',
                nama text not null,
                nomor_dasar text,
                tanggal_dibentuk date,
                tanggal_mulai date,
                tanggal_selesai date,
                satker_penyelenggara text,
                pimpinan text,
                deskripsi text,
                is_aktif boolean not null default true,
                created_by bigint,
                updated_by bigint,
                created_at timestamptz not null default now(),
                updated_at timestamptz not null default now(),
                deleted_at timestamptz
            );
        `);
        await this.dataSource.query(`alter table bdb_operasi_satgas add column if not exists jenis_kategori text;`);
        await this.dataSource.query(`alter table bdb_operasi_satgas add column if not exists is_pinned boolean not null default false, add column if not exists pinned_at timestamptz;`);
        await this.dataSource.query(`alter table bdb_operasi_satgas add column if not exists lampiran jsonb default '[]'::jsonb;`);
        await this.dataSource.query(`create index if not exists idx_operasi_satgas_deleted on bdb_operasi_satgas(deleted_at);`);
        await this.dataSource.query(`create index if not exists idx_operasi_satgas_jenis on bdb_operasi_satgas(jenis);`);
        await this.ensureAttachmentTable();
    }

    /** Master ringan "Jenis Operasi"/"Jenis Satgas" (dropdown opsional, dapat ditambah bebas dari form). */
    private async ensureJenisMasterTable() {
        await this.dataSource.query(`
            create table if not exists bdb_operasi_satgas_jenis (
                id bigserial primary key,
                kelompok text not null,
                nama text not null,
                created_at timestamptz not null default now(),
                unique (kelompok, nama)
            );
        `);
    }

    async listJenisMaster(kelompok: string) {
        await this.ensureJenisMasterTable();
        const k = this.toJenis(kelompok);
        const rows = await this.dataSource.query(`select id, nama from bdb_operasi_satgas_jenis where kelompok = $1 order by nama`, [k]);
        return { status: 1, data: rows };
    }

    private async ensureJenisMasterValue(kelompok: string, nama: string | null) {
        if (!nama) return;
        await this.ensureJenisMasterTable();
        await this.dataSource.query(`insert into bdb_operasi_satgas_jenis (kelompok, nama) values ($1,$2) on conflict (kelompok, nama) do nothing`, [kelompok, nama]);
    }

    private toText(v: any): string | null {
        if (v === undefined || v === null) return null;
        const t = String(v).trim();
        return t ? t : null;
    }

    private toDate(v: any): string | null {
        if (!v) return null;
        if (v instanceof Date && !isNaN(v.getTime())) {
            const jkt = new Date(v.getTime() + 7 * 3600 * 1000);
            return jkt.toISOString().slice(0, 10);
        }
        const t = String(v).trim();
        if (/^\d{4}-\d{2}-\d{2}$/.test(t)) return t;
        const dmy = t.match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/);
        if (dmy) return `${dmy[3]}-${dmy[2]}-${dmy[1]}`;
        if (/^\d{4}-\d{2}-\d{2}T/.test(t)) return t.slice(0, 10);
        return null;
    }

    private toBoolean(v: any, fallback = true): boolean {
        if (v === undefined || v === null || v === '') return fallback;
        if (typeof v === 'boolean') return v;
        return !['false', '0', 'tidak', 'off'].includes(String(v).trim().toLowerCase());
    }

    private toJenis(v: any): string {
        const j = String(v || 'OPERASI').trim().toUpperCase();
        return ['OPERASI', 'SATGAS'].includes(j) ? j : 'OPERASI';
    }

    private normalizePayload(dto: Payload, partial = false): Payload {
        const source = dto || {};
        const payload: Payload = {
            jenis: this.toJenis(source.jenis),
            nama: this.toText(source.nama),
            jenis_kategori: this.toText(source.jenis_kategori),
            nomor_dasar: this.toText(source.nomor_dasar),
            tanggal_dibentuk: this.toDate(source.tanggal_dibentuk),
            tanggal_mulai: this.toDate(source.tanggal_mulai),
            tanggal_selesai: this.toDate(source.tanggal_selesai),
            satker_penyelenggara: this.toText(source.satker_penyelenggara),
            pimpinan: this.toText(source.pimpinan),
            deskripsi: this.toText(source.deskripsi),
            is_aktif: this.toBoolean(source.is_aktif),
            is_pinned: this.toBoolean(source.is_pinned, false),
            updated_by: this.toText(source.updated_by)
        };

        if (!partial) {
            payload.created_by = this.toText(source.created_by);
            if (payload.is_pinned) payload.pinned_at = new Date();
            return payload;
        }

        const partialPayload: Payload = {};
        for (const key of Object.keys(payload)) {
            if (Object.prototype.hasOwnProperty.call(source, key)) partialPayload[key] = payload[key];
        }
        if (Object.prototype.hasOwnProperty.call(source, 'is_pinned')) {
            partialPayload.pinned_at = partialPayload.is_pinned ? new Date() : null;
        }
        return partialPayload;
    }

    private buildBaseSelect() {
        return `
            select
                id, jenis, nama, nama as judul, jenis as kategori,
                jenis_kategori, nomor_dasar, tanggal_dibentuk::text as tanggal_dibentuk,
                tanggal_mulai::text as tanggal_mulai, tanggal_selesai::text as tanggal_selesai,
                satker_penyelenggara, satker_penyelenggara as satker_nama, pimpinan, deskripsi, deskripsi as keterangan,
                coalesce(is_pinned, false) as is_pinned,
                pinned_at,
                coalesce(lampiran, '[]'::jsonb) as lampiran,
                coalesce(tanggal_mulai, tanggal_dibentuk, (created_at at time zone 'Asia/Jakarta')::date)::text as effective_date,
                is_aktif as is_aktif_manual,
                case
                    when tanggal_selesai is not null
                     and tanggal_selesai <= (now() at time zone 'Asia/Jakarta')::date
                    then false
                    else is_aktif
                end as is_aktif,
                case
                    when deleted_at is not null then 'DIHAPUS'
                    when tanggal_selesai is not null
                     and tanggal_selesai <= (now() at time zone 'Asia/Jakarta')::date
                    then 'SELESAI'
                    when not is_aktif then 'NONAKTIF'
                    else 'AKTIF'
                end as status_tampil,
                (select count(*)::int from bdb_laporan_polisi lp where lp.operasi_satgas_id = bdb_operasi_satgas.id and lp.deleted_at is null) as jumlah_lp,
                (select count(distinct lp.satker_nama)::int from bdb_laporan_polisi lp where lp.operasi_satgas_id = bdb_operasi_satgas.id and lp.deleted_at is null) as jumlah_satker,
                (select string_agg(distinct lp.satker_nama, ', ') from bdb_laporan_polisi lp where lp.operasi_satgas_id = bdb_operasi_satgas.id and lp.deleted_at is null) as satker_terkait,
                (select lp0.no_laporan from bdb_laporan_polisi lp0 where lp0.operasi_satgas_id = bdb_operasi_satgas.id and lp0.deleted_at is null order by lp0.id limit 1) as first_no_laporan,
                (select lp0.tgl_laporan from bdb_laporan_polisi lp0 where lp0.operasi_satgas_id = bdb_operasi_satgas.id and lp0.deleted_at is null order by lp0.id limit 1) as first_tgl_laporan,
                (select count(*)::int from bdb_operasi_satgas_attachments a where a.operasi_satgas_id = bdb_operasi_satgas.id) as jumlah_lampiran,
                (select count(*)::int from bdb_operasi_satgas_attachments a where a.operasi_satgas_id = bdb_operasi_satgas.id and coalesce(a.kategori_lampiran,'DOKUMENTASI') = 'SPRIN') as jumlah_lampiran_sprin,
                (select count(*)::int from bdb_operasi_satgas_attachments a where a.operasi_satgas_id = bdb_operasi_satgas.id and coalesce(a.kategori_lampiran,'DOKUMENTASI') <> 'SPRIN') as jumlah_lampiran_dokumentasi,
                coalesce(
                    (select a.nomor_sprin from bdb_operasi_satgas_attachments a where a.operasi_satgas_id = bdb_operasi_satgas.id and coalesce(a.kategori_lampiran,'DOKUMENTASI') = 'SPRIN' order by coalesce(a.revisi_ke,0) desc, a.id desc limit 1),
                    bdb_operasi_satgas.nomor_dasar
                ) as latest_nomor_sprin,
                coalesce(
                    (select a.tanggal_sprin::text from bdb_operasi_satgas_attachments a where a.operasi_satgas_id = bdb_operasi_satgas.id and coalesce(a.kategori_lampiran,'DOKUMENTASI') = 'SPRIN' order by coalesce(a.revisi_ke,0) desc, a.id desc limit 1),
                    bdb_operasi_satgas.tanggal_dibentuk::text
                ) as latest_tanggal_sprin,
                (select max(coalesce(a.revisi_ke,1))::int from bdb_operasi_satgas_attachments a where a.operasi_satgas_id = bdb_operasi_satgas.id and coalesce(a.kategori_lampiran,'DOKUMENTASI') = 'SPRIN') as latest_revisi_sprin,
                (
                    select min(
                        case
                            when s.id in (1,2,3,4,13) or s.parent_id = 13
                              or upper(coalesce(s.deskripsi,'')) like '%BARESKRIM%'
                              or upper(coalesce(s.deskripsi,'')) like '%MABES%'
                              or upper(coalesce(s.deskripsi,'')) like '%DITTIPID%'
                              or upper(coalesce(s.deskripsi,'')) like '%TIPID%'
                              or upper(coalesce(s.nama_singkat,'')) like '%BARESKRIM%' then 1
                            when upper(coalesce(s.deskripsi,'')) like '%POLSEK%' then 4
                            when upper(coalesce(s.deskripsi,'')) like '%POLRES%'
                              or upper(coalesce(s.deskripsi,'')) like '%POLRESTA%'
                              or upper(coalesce(s.deskripsi,'')) like 'RES %'
                              or upper(coalesce(s.deskripsi,'')) like '% RES %' then 3
                            when upper(coalesce(s.deskripsi,'')) like '%POLDA%' or s.depth <= 2 then 2
                            else greatest(2, least(4, coalesce(s.depth::int, 4)))
                        end
                    )::int
                    from regexp_split_to_table(
                        coalesce(bdb_operasi_satgas.satker_penyelenggara,''),
                        '\\s*[,;/]\\s*'
                    ) as x(token)
                    join bdb_satker s
                      on (
                           lower(coalesce(s.kode,'')) = lower(x.token)
                        or lower(coalesce(s.kode_canonical,'')) = lower(x.token)
                        or lower(coalesce(s.deskripsi,'')) like '%' || lower(x.token) || '%'
                      )
                    where nullif(trim(x.token),'') is not null
                ) as satker_depth,
                created_by, updated_by, created_at, updated_at
            from bdb_operasi_satgas
        `;
    }

    async list(query: any = {}, userId?: number) {
        await this.ensureTable();
        const actor = await this.actor(userId);

        const page = Math.max(1, Number(query.page || 1));
        const limit = Math.max(1, Math.min(Number(query.row || query.limit || 20), 200));
        const offset = (page - 1) * limit;

        const params: any[] = [];
        const innerWhere: string[] = ['deleted_at is null'];

        const search = this.toText(query.search);
        if (search) {
            params.push(`%${search.toLowerCase()}%`);
            const p = params.length;
            innerWhere.push(`(
                lower(coalesce(nama,'')) like $${p}
                or lower(coalesce(nomor_dasar,'')) like $${p}
                or lower(coalesce(satker_penyelenggara,'')) like $${p}
                or lower(coalesce(pimpinan,'')) like $${p}
                or lower(coalesce(deskripsi,'')) like $${p}
                or exists (select 1 from bdb_laporan_polisi lp_s where lp_s.operasi_satgas_id = bdb_operasi_satgas.id and lp_s.deleted_at is null and (lower(coalesce(lp_s.no_laporan,'')) like $${p} or lower(coalesce(lp_s.satker_nama,'')) like $${p}))
            )`);
        }

        const satker = this.toText(query.satker || query.satker_nama);
        if (satker && !['all', 'semua'].includes(satker.toLowerCase())) {
            params.push(`%${satker.toLowerCase()}%`);
            const p = params.length;
            innerWhere.push(`(
                lower(coalesce(satker_penyelenggara,'')) like $${p}
                or exists (select 1 from bdb_laporan_polisi lp_f where lp_f.operasi_satgas_id = bdb_operasi_satgas.id and lp_f.deleted_at is null and lower(coalesce(lp_f.satker_nama,'')) like $${p})
            )`);
        }

        const fromDate = this.toDate(query.from || query.tgl_mulai || query.start_date);
        if (fromDate) {
            params.push(fromDate);
            innerWhere.push(`coalesce(tanggal_mulai, tanggal_dibentuk, (created_at at time zone 'Asia/Jakarta')::date) >= $${params.length}::date`);
        }

        const toDate = this.toDate(query.to || query.tgl_selesai || query.end_date);
        if (toDate) {
            params.push(toDate);
            innerWhere.push(`coalesce(tanggal_mulai, tanggal_dibentuk, (created_at at time zone 'Asia/Jakarta')::date) <= $${params.length}::date`);
        }

        const jenis = this.toText(query.jenis);
        if (jenis && jenis.toUpperCase() !== 'ALL') {
            params.push(jenis.toUpperCase());
            innerWhere.push(`jenis = $${params.length}`);
        }

        const baseSql = `
            from (${this.buildBaseSelect()} where ${innerWhere.join(' and ')}) o
        `;
        const outerWhere: string[] = ['1=1'];
        const status = this.toText(query.status);
        if (status && status.toUpperCase() !== 'ALL') {
            params.push(status.toUpperCase());
            outerWhere.push(`status_tampil = $${params.length}`);
        }
        const rawPinned = this.toText(query.pinned);
        if (rawPinned && !['all', 'semua'].includes(rawPinned.toLowerCase())) {
            const isPinned = ['true', '1', 'ya', 'yes', 'pinned', 'disematkan'].includes(rawPinned.toLowerCase());
            params.push(isPinned);
            outerWhere.push(`coalesce(is_pinned, false) = $${params.length}`);
        }

        const countRows = await this.dataSource.query(`select count(*)::int as total ${baseSql} where ${outerWhere.join(' and ')}`, params);
        const total = Number(countRows?.[0]?.total || 0);

        const rows = await this.dataSource.query(
            `select * ${baseSql} where ${outerWhere.join(' and ')} order by coalesce(is_pinned, false) desc, pinned_at desc nulls last, coalesce(tanggal_mulai::date, tanggal_dibentuk::date, created_at::date) desc nulls last, jumlah_lp desc, coalesce(satker_depth, 99) asc, (case when jenis = 'OPERASI' then 0 else 1 end) asc, created_at desc, id desc limit $${params.length + 1} offset $${params.length + 2}`,
            [...params, limit, offset]
        );

        for (const row of rows) {
            row.can_delete = actor.isSuper || (row.created_by !== null && Number(row.created_by) === actor.id);
        }

        return { data: rows, meta: { total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) } };
    }

    /** Register LP yang sudah ditautkan ke operasi/satgas. */
    async rekapLp(userId: number | undefined, query: any = {}) {
        await this.ensureTable();
        const scope = await resolveScope(this.dataSource, userId);

        const page = Math.max(1, Number(query.page || 1));
        const limit = Math.max(1, Math.min(Number(query.row || query.limit || 20), 200));
        const offset = (page - 1) * limit;

        const params: any[] = [];
        const where: string[] = ['lp.deleted_at is null', 'os.deleted_at is null'];
        if (!scope.all) {
            if (!scope.satkerId) {
                where.push('1=0');
            } else {
                params.push(scope.satkerId);
                where.push(effectiveLpScopeSql('lp', `$${params.length}`));
            }
        }

        const search = this.toText(query.search);
        if (search) {
            params.push(`%${search.toLowerCase()}%`);
            where.push(`(lower(coalesce(os.nama,'')) like $${params.length} or lower(coalesce(lp.no_laporan,'')) like $${params.length} or lower(coalesce(lp.satker_nama,'')) like $${params.length})`);
        }
        const jenis = this.toText(query.jenis);
        if (jenis && jenis.toUpperCase() !== 'ALL') {
            params.push(jenis.toUpperCase());
            where.push(`os.jenis = $${params.length}`);
        }
        const satker = this.toText(query.satker || query.satker_nama);
        if (satker && !['all', 'semua'].includes(satker.toLowerCase())) {
            params.push(`%${satker.toLowerCase()}%`);
            where.push(`(lower(coalesce(lp.satker_nama,'')) like $${params.length} or lower(coalesce(os.satker_penyelenggara,'')) like $${params.length})`);
        }

        const whereSql = where.join(' and ');
        const totalRow = await this.dataSource.query(
            `select count(*)::int as total from bdb_laporan_polisi lp join bdb_operasi_satgas os on os.id = lp.operasi_satgas_id where ${whereSql}`,
            params
        );
        const total = Number(totalRow?.[0]?.total || 0);

        const rows = await this.dataSource.query(
            `select
                lp.id as lp_id, lp.no_laporan, lp.satker_nama, lp.unit_nama, lp.tgl_laporan,
                os.id as ops_id, os.jenis as ops_jenis, os.nama as ops_nama, os.nomor_dasar as ops_nomor_dasar,
                coalesce(os.is_pinned, false) as ops_is_pinned, os.pinned_at as ops_pinned_at,
                coalesce(sm.code,'LP') as status_code, coalesce(sm.nama,'Laporan Polisi') as status_nama,
                coalesce(sm.kategori,'CT') as status_kategori,
                (select string_agg(x.txt, '; ') from (
                    select distinct coalesce(nullif(tp->>'nama_kategori_kejahatan',''),'(tanpa kategori)') as txt
                    from jsonb_array_elements(case when jsonb_typeof(lp.payload_json->'tindak_pidana')='array' then lp.payload_json->'tindak_pidana' else '[]'::jsonb end) tp
                ) x) as kejahatan,
                (select count(*)::int from bdb_dors_lp_terlibat t join bdb_dors_lp d on d.id = t.lp_id
                    where d.dors_lp_id = lp.dors_lp_id and d.model_lp = lp.model_lp and upper(coalesce(t.keterlibatan,'')) = 'KORBAN') as jumlah_korban,
                (case when jsonb_typeof(lp.payload_json->'barang_bukti') = 'array' then jsonb_array_length(lp.payload_json->'barang_bukti') else 0 end) as jumlah_bb
             from bdb_laporan_polisi lp
             join bdb_operasi_satgas os on os.id = lp.operasi_satgas_id
             left join bdb_status_master sm on sm.id = lp.status_id
             where ${whereSql}
             order by
                coalesce(os.is_pinned, false) desc,
                os.pinned_at desc nulls last,
                coalesce(
                    case
                        when lp.tgl_laporan ~ '^\\d{2}[-/]\\d{2}[-/]\\d{4}' then to_date(replace(left(lp.tgl_laporan, 10), '/', '-'), 'DD-MM-YYYY')
                        when lp.tgl_laporan ~ '^\\d{4}[-/]\\d{2}[-/]\\d{2}' then replace(left(lp.tgl_laporan, 10), '/', '-')::date
                        else null
                    end,
                    os.tanggal_mulai,
                    os.tanggal_dibentuk,
                    (lp.synced_at at time zone 'Asia/Jakarta')::date
                ) desc nulls last,
                (select count(*)::int from bdb_laporan_polisi lp_cnt where lp_cnt.operasi_satgas_id = os.id and lp_cnt.deleted_at is null) desc,
                lp.synced_at desc,
                lp.id desc
             limit $${params.length + 1} offset $${params.length + 2}`,
            [...params, limit, offset]
        );
        for (const r of rows) r.pid = encodeId(Number(r.lp_id));

        return { data: rows, meta: { total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) } };
    }

    async findOne(id: number) {
        await this.ensureTable();
        const rows = await this.dataSource.query(`select * from (${this.buildBaseSelect()} where deleted_at is null) o where id = $1`, [id]);
        if (!rows.length) throw new NotFoundException('Data operasi/satgas tidak ditemukan');
        return rows[0];
    }

    private async enrichLpRowsWithDocs(rows: any[]) {
        if (!rows.length) return rows;
        const lpIds = rows.map((r) => Number(r.lp_id || r.id)).filter((n) => Number.isFinite(n) && n > 0);
        for (const r of rows) {
            const lid = Number(r.lp_id || r.id);
            r.id = lid;
            r.lp_id = lid;
            r.pid = encodeId(lid);
            r.dokumen_list = [];
        }
        if (!lpIds.length) return rows;
        try {
            const docRows = await this.dataSource.query(
                `select d.id, d.lp_id, d.nomor_dokumen, d.tanggal_dokumen::text as tanggal_dokumen, d.lampiran,
                        t.code as type_code, t.nama as type_nama, t.urutan_tahap
                 from bdb_dokumen d
                 join bdb_document_type_master t on t.id = d.document_type_id
                 where d.lp_id = any($1)
                 order by t.urutan_tahap asc nulls last, d.tanggal_dokumen asc nulls last, d.id asc`,
                [lpIds]
            );
            const docMap = new Map<number, any[]>();
            for (const d of docRows) {
                const lid = Number(d.lp_id);
                const rawLampiran = Array.isArray(d.lampiran) ? d.lampiran : [];
                const lampiran = [];
                for (const att of rawLampiran) {
                    let url: string | null = att?.url || null;
                    if (!url && att?.key) {
                        try {
                            url = await this.minio.presignedUrl(att.key, 3600);
                        } catch {
                            url = null;
                        }
                    }
                    lampiran.push({
                        name: att?.name || att?.file_name || 'Dokumen.pdf',
                        key: att?.key || null,
                        size: att?.size || null,
                        mime: att?.mime || att?.content_type || 'application/pdf',
                        url
                    });
                }
                if (!docMap.has(lid)) docMap.set(lid, []);
                docMap.get(lid)!.push({
                    id: Number(d.id),
                    type_code: d.type_code,
                    type_nama: d.type_nama,
                    nomor_dokumen: d.nomor_dokumen || null,
                    tanggal_dokumen: d.tanggal_dokumen || null,
                    lampiran
                });
            }
            for (const r of rows) {
                r.dokumen_list = docMap.get(Number(r.lp_id)) || [];
            }
        } catch {
            /* ignore doc enrichment error */
        }
        return rows;
    }

    /** LP yang saat ini tertaut ke operasi/satgas ini -- dipakai isi awal LpPickerDialog & Drilldown. */
    async listLinkedLp(id: number) {
        await this.ensureTable();
        const rows = await this.dataSource.query(
            `select lp.id, lp.id as lp_id, lp.no_laporan, lp.satker_nama, lp.unit_nama, lp.tgl_laporan, lp.tingkat_kesulitan,
                    coalesce(sm.code, 'LP') as status_code, coalesce(sm.nama, 'Laporan Polisi') as status_nama,
                    coalesce(sm.kategori, 'CT') as status_kategori,
                    coalesce(
                        nullif((select string_agg(distinct coalesce(nullif(tp_m.nomor_pasal,'') || coalesce(' (' || nullif(tp_m.nama_kategori,'') || ')', ''), tp_m.nama_kategori), '; ') from bdb_lp_tindak_pidana tp_m where tp_m.lp_id = lp.id), ''),
                        (select string_agg(x.txt, '; ') from (
                            select distinct coalesce(nullif(tp->>'nama_kategori_kejahatan',''), nullif(tp->>'pasal',''), '(tanpa kategori)') as txt
                            from jsonb_array_elements(case when jsonb_typeof(lp.payload_json->'tindak_pidana')='array' then lp.payload_json->'tindak_pidana' else '[]'::jsonb end) tp
                        ) x)
                    ) as kejahatan
             from bdb_laporan_polisi lp
             left join bdb_status_master sm on sm.id = lp.status_id
             where lp.operasi_satgas_id = $1 and lp.deleted_at is null
             order by lp.no_laporan`,
            [id]
        );
        const enriched = await this.enrichLpRowsWithDocs(rows);
        return { status: 1, data: enriched };
    }

    async setLinkedLp(id: number, lpIds: number[], userId?: number) {
        const actor = await this.actor(userId);
        this.assertNotViewer(actor);
        await this.findOne(id);
        const currentRows = await this.dataSource.query(`select id from bdb_laporan_polisi where operasi_satgas_id = $1 and deleted_at is null`, [id]);
        const current = new Set<number>(currentRows.map((r: any) => Number(r.id)));
        const target = new Set<number>((lpIds || []).map(Number).filter((n) => Number.isFinite(n) && n > 0));
        const toAdd = [...target].filter((x) => !current.has(x));
        const toRemove = [...current].filter((x) => !target.has(x));

        let added = 0;
        let removed = 0;
        const failed: { id: number; message: string }[] = [];
        for (const lpId of toAdd) {
            try {
                await this.laporanPolisiService.setOperasiSatgas(lpId, id, userId);
                added++;
            } catch (e: any) {
                failed.push({ id: lpId, message: e?.message || 'Gagal menautkan' });
            }
        }
        for (const lpId of toRemove) {
            try {
                await this.laporanPolisiService.setOperasiSatgas(lpId, null, userId);
                removed++;
            } catch (e: any) {
                failed.push({ id: lpId, message: e?.message || 'Gagal melepas' });
            }
        }
        return { status: 1, data: { added, removed, failed }, message: `${added} LP ditautkan, ${removed} LP dilepas.${failed.length ? ` ${failed.length} gagal.` : ''}` };
    }

    async create(dto: Payload, userId?: number) {
        await this.ensureTable();
        const actor = await this.actor(userId);
        this.assertNotViewer(actor);
        const payload = this.normalizePayload(dto);
        payload.created_by = actor.id;
        payload.updated_by = actor.id;
        if (!payload.nama) throw new NotFoundException('Nama wajib diisi');
        await this.ensureJenisMasterValue(payload.jenis, payload.jenis_kategori);
        const keys = Object.keys(payload).filter((k) => payload[k] !== undefined);
        const columns = keys.join(', ');
        const values = keys.map((_, i) => `$${i + 1}`).join(', ');
        const params = keys.map((k) => payload[k]);
        const rows = await this.dataSource.query(`insert into bdb_operasi_satgas (${columns}) values (${values}) returning id`, params);
        const newId = Number(rows[0].id);
        if (Array.isArray(dto?.lp_ids) && dto.lp_ids.length) {
            await this.setLinkedLp(newId, dto.lp_ids, userId);
        }
        return this.findOne(newId);
    }

    async update(id: number, dto: Payload, userId?: number) {
        await this.ensureTable();
        const actor = await this.actor(userId);
        this.assertNotViewer(actor);
        const existing = await this.findOne(id);
        const payload = this.normalizePayload(dto, true);
        payload.updated_by = actor.id;
        if (Object.prototype.hasOwnProperty.call(payload, 'jenis_kategori')) {
            await this.ensureJenisMasterValue(payload.jenis ?? existing.jenis, payload.jenis_kategori);
        }
        const keys = Object.keys(payload);
        if (keys.length) {
            const sets = keys.map((k, i) => `${k} = $${i + 1}`);
            sets.push('updated_at = now()');
            const params = keys.map((k) => payload[k]);
            params.push(id);
            await this.dataSource.query(`update bdb_operasi_satgas set ${sets.join(', ')} where id = $${params.length} and deleted_at is null`, params);
        }
        if (Array.isArray(dto?.lp_ids)) {
            await this.setLinkedLp(id, dto.lp_ids, userId);
        }
        return this.findOne(id);
    }

    async setAktif(id: number, aktif: boolean, userId?: number) {
        await this.ensureTable();
        const actor = await this.actor(userId);
        this.assertNotViewer(actor);
        await this.findOne(id);
        await this.dataSource.query('update bdb_operasi_satgas set is_aktif = $2, updated_by = $3, updated_at = now() where id = $1', [id, aktif, actor.id]);
        return this.findOne(id);
    }

    async setPin(id: number, pinned?: any, userId?: number) {
        await this.ensureTable();
        const actor = await this.actor(userId);
        this.assertNotViewer(actor);
        const existing = await this.findOne(id);
        const nextPin = pinned !== undefined && pinned !== null ? this.toBoolean(pinned, false) : !Boolean(existing.is_pinned);
        await this.dataSource.query(
            `update bdb_operasi_satgas
             set is_pinned = $2,
                 pinned_at = case when $2 then now() else null end,
                 updated_by = $3,
                 updated_at = now()
             where id = $1 and deleted_at is null`,
            [id, nextPin, actor.id]
        );
        return this.findOne(id);
    }

    async remove(id: number, userId?: number, alasan?: string) {
        await this.ensureTable();
        const actor = await this.actor(userId);
        this.assertNotViewer(actor);
        const existing = await this.findOne(id);
        const ownerId = existing.created_by === null ? null : Number(existing.created_by);
        if (!actor.isSuper && ownerId !== actor.id) {
            throw new ForbiddenException('Hanya pembuat Operasi/Satgas atau superadmin yang dapat menghapus data ini.');
        }
        const reason = this.toText(alasan) || 'Penghapusan melalui menu Operasi/Satgas';
        await this.dataSource.transaction(async (manager) => {
            await manager.query(
                `update bdb_operasi_satgas
                 set deleted_at = now(), updated_by = $2, updated_at = now()
                 where id = $1 and deleted_at is null`,
                [id, actor.id]
            );
            await manager.query(
                `insert into bdb_audit_log
                    (user_id,user_nama,action,entity,entity_id,meta,outcome)
                 values ($1,$2,'DELETE_OWNED_OPERASI_SATGAS','bdb_operasi_satgas',$3,$4::jsonb,'SUCCESS')`,
                [actor.id, actor.name, String(id), JSON.stringify({ alasan: reason, before: existing })]
            );
        });
        return { status: 1, message: 'Operasi/Satgas dihapus' };
    }
}
