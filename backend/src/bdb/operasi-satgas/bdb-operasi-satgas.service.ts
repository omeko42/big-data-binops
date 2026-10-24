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
        `);
    }

    async addAttachments(id: number, files: UploadedFileLike[]) {
        await this.ensureAttachmentTable();
        if (!files?.length) return this.listAttachments(id);
        for (const f of files) {
            if (f.mimetype && f.mimetype !== 'application/pdf') {
                throw new BadRequestException(`Lampiran "${f.originalname}" harus berupa file PDF.`);
            }
        }
        for (const f of files) {
            const key = await this.minio.upload(f, 'operasi-satgas');
            await this.dataSource.query(
                `insert into bdb_operasi_satgas_attachments (operasi_satgas_id, file_name, object_key, content_type, size) values ($1,$2,$3,$4,$5)`,
                [id, f.originalname, key, f.mimetype || null, f.size || null]
            );
        }
        return this.listAttachments(id);
    }

    async listAttachments(id: number) {
        await this.ensureAttachmentTable();
        const rows = await this.dataSource.query(`select id, file_name, object_key, content_type, size, created_at from bdb_operasi_satgas_attachments where operasi_satgas_id = $1 order by id desc`, [id]);
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

    async removeAttachment(attId: number) {
        await this.ensureAttachmentTable();
        const rows = await this.dataSource.query(`select object_key from bdb_operasi_satgas_attachments where id = $1`, [attId]);
        if (!rows.length) throw new NotFoundException('Lampiran tidak ditemukan');
        try {
            await this.minio.remove(rows[0].object_key);
        } catch {
            /* biarkan hapus metadata walau objek gagal dihapus */
        }
        await this.dataSource.query(`delete from bdb_operasi_satgas_attachments where id = $1`, [attId]);
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
        // jenis_kategori = sub-klasifikasi opsional (mis. "Operasi Tangkap", "Satgas Anti Narkoba"),
        // beda dari kolom `jenis` (yg cuma diskriminator OPERASI/SATGAS) -- lihat ensureJenisMasterTable().
        await this.dataSource.query(`alter table bdb_operasi_satgas add column if not exists jenis_kategori text;`);
        await this.dataSource.query(`create index if not exists idx_operasi_satgas_deleted on bdb_operasi_satgas(deleted_at);`);
        await this.dataSource.query(`create index if not exists idx_operasi_satgas_jenis on bdb_operasi_satgas(jenis);`);
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

    /** Idempotent -- dipanggil dari create/update kalau user mengetik kategori baru yg belum ada di master. */
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
        const t = String(v).trim();
        return /^\d{4}-\d{2}-\d{2}$/.test(t) ? t : null;
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
            updated_by: this.toText(source.updated_by)
        };

        if (!partial) {
            payload.created_by = this.toText(source.created_by);
            return payload;
        }

        const partialPayload: Payload = {};
        for (const key of Object.keys(payload)) {
            if (Object.prototype.hasOwnProperty.call(source, key)) partialPayload[key] = payload[key];
        }
        return partialPayload;
    }

    private buildBaseSelect() {
        return `
            select
                id, jenis, nama, jenis_kategori, nomor_dasar, tanggal_dibentuk, tanggal_mulai, tanggal_selesai,
                satker_penyelenggara, pimpinan, deskripsi,
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
                (
                    select min(s.depth)::int
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
        const limit = Math.max(1, Math.min(Number(query.row || query.limit || 20), 100));
        const offset = (page - 1) * limit;

        const params: any[] = [];
        const innerWhere: string[] = ['deleted_at is null'];

        const search = this.toText(query.search);
        if (search) {
            params.push(`%${search.toLowerCase()}%`);
            innerWhere.push(`(lower(coalesce(nama,'')) like $${params.length} or lower(coalesce(nomor_dasar,'')) like $${params.length} or lower(coalesce(satker_penyelenggara,'')) like $${params.length})`);
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

        const countRows = await this.dataSource.query(`select count(*)::int as total ${baseSql} where ${outerWhere.join(' and ')}`, params);
        const total = Number(countRows?.[0]?.total || 0);

        const rows = await this.dataSource.query(
            `select * ${baseSql} where ${outerWhere.join(' and ')} order by coalesce(tanggal_mulai, created_at::date) desc, id desc limit $${params.length + 1} offset $${params.length + 2}`,
            [...params, limit, offset]
        );

        for (const row of rows) {
            row.can_delete = actor.isSuper || (row.created_by !== null && Number(row.created_by) === actor.id);
        }

        return { data: rows, meta: { total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) } };
    }

    /** Register LP yang sudah ditautkan ke operasi/satgas (diisi dari input di detail LP). */
    async rekapLp(userId: number | undefined, query: any = {}) {
        await this.ensureTable();
        const scope = await resolveScope(this.dataSource, userId);

        const page = Math.max(1, Number(query.page || 1));
        const limit = Math.max(1, Math.min(Number(query.row || query.limit || 20), 100));
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
            where.push(`(lower(coalesce(os.nama,'')) like $${params.length} or lower(coalesce(lp.no_laporan,'')) like $${params.length})`);
        }
        const jenis = this.toText(query.jenis);
        if (jenis && jenis.toUpperCase() !== 'ALL') {
            params.push(jenis.toUpperCase());
            where.push(`os.jenis = $${params.length}`);
        }

        const whereSql = where.join(' and ');
        const totalRow = await this.dataSource.query(
            `select count(*)::int as total from bdb_laporan_polisi lp join bdb_operasi_satgas os on os.id = lp.operasi_satgas_id where ${whereSql}`,
            params
        );
        const total = Number(totalRow?.[0]?.total || 0);

        const rows = await this.dataSource.query(
            `select
                lp.id as lp_id, lp.no_laporan, lp.satker_nama, lp.unit_nama,
                os.id as ops_id, os.jenis as ops_jenis, os.nama as ops_nama,
                coalesce(sm.code,'LP') as status_code, coalesce(sm.nama,'Laporan Polisi') as status_nama,
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
             order by lp.synced_at desc, lp.id desc
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

    /** LP yang saat ini tertaut ke operasi/satgas ini -- dipakai isi awal LpPickerDialog di halaman ini. */
    async listLinkedLp(id: number) {
        await this.ensureTable();
        const rows = await this.dataSource.query(
            `select lp.id, lp.no_laporan, lp.satker_nama, lp.unit_nama, coalesce(sm.nama, 'Laporan Polisi') as status_nama
             from bdb_laporan_polisi lp
             left join bdb_status_master sm on sm.id = lp.status_id
             where lp.operasi_satgas_id = $1 and lp.deleted_at is null
             order by lp.no_laporan`,
            [id]
        );
        return { status: 1, data: rows };
    }

    /**
     * Samakan LP yang tertaut ke operasi/satgas ini dgn daftar lp_ids yg dipilih di LpPickerDialog
     * (model sama spt halaman Kasus Menonjol/Susjol) -- LP baru ditautkan, LP yg dihapus dari
     * pilihan dilepas. Pakai LaporanPolisiService.setOperasiSatgas() per LP (sudah ada validasi
     * scope satker & status aktif operasi/satgas), bukan query massal langsung.
     */
    async setLinkedLp(id: number, lpIds: number[], userId?: number) {
        const actor = await this.actor(userId);
        this.assertNotViewer(actor);
        await this.findOne(id);
        const currentRows = await this.dataSource.query(`select id from bdb_laporan_polisi where operasi_satgas_id = $1 and deleted_at is null`, [id]);
        const current = new Set<number>(currentRows.map((r: any) => Number(r.id)));
        const target = new Set<number>((lpIds || []).map(Number));
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
        return this.findOne(Number(rows[0].id));
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
        if (!keys.length) return this.findOne(id);
        const sets = keys.map((k, i) => `${k} = $${i + 1}`);
        sets.push('updated_at = now()');
        const params = keys.map((k) => payload[k]);
        params.push(id);
        await this.dataSource.query(`update bdb_operasi_satgas set ${sets.join(', ')} where id = $${params.length} and deleted_at is null`, params);
        return this.findOne(id);
    }

    /** Toggle "Off"/"On" -- override manual, lepas dari status periode tanggal. */
    async setAktif(id: number, aktif: boolean, userId?: number) {
        await this.ensureTable();
        const actor = await this.actor(userId);
        this.assertNotViewer(actor);
        await this.findOne(id);
        await this.dataSource.query('update bdb_operasi_satgas set is_aktif = $2, updated_by = $3, updated_at = now() where id = $1', [id, aktif, actor.id]);
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
