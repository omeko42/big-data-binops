"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BdbOperasiSatgasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const minio_service_1 = require("../kerma/minio.service");
const scope_util_1 = require("../common/scope.util");
const lp_scope_util_1 = require("../common/lp-scope.util");
const id_cipher_util_1 = require("../laporan-polisi/id-cipher.util");
const laporan_polisi_service_1 = require("../laporan-polisi/laporan-polisi.service");
let BdbOperasiSatgasService = class BdbOperasiSatgasService {
    dataSource;
    minio;
    laporanPolisiService;
    constructor(dataSource, minio, laporanPolisiService) {
        this.dataSource = dataSource;
        this.minio = minio;
        this.laporanPolisiService = laporanPolisiService;
    }
    async actor(userId) {
        const id = Number(userId || 0);
        if (!id)
            throw new common_1.ForbiddenException('Sesi pengguna tidak valid. Silakan login ulang.');
        const rows = await this.dataSource.query(`select id, name, lower(coalesce(role_bdb,'')) as role_bdb
             from auth_users
             where id = $1 and deleted_at is null
             limit 1`, [id]);
        if (!rows.length)
            throw new common_1.ForbiddenException('Akun pengguna tidak ditemukan atau sudah tidak aktif.');
        return {
            id: Number(rows[0].id),
            name: this.toText(rows[0].name),
            role: String(rows[0].role_bdb || '').toLowerCase(),
            isSuper: String(rows[0].role_bdb || '').toLowerCase() === 'superadmin'
        };
    }
    assertNotViewer(actor) {
        if (actor?.role === 'viewer') {
            throw new common_1.ForbiddenException('Role viewer hanya memiliki hak akses lihat (read-only). Aksi tidak diizinkan.');
        }
    }
    async ensureAttachmentTable() {
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
    async addAttachments(id, files) {
        await this.ensureAttachmentTable();
        if (!files?.length)
            return this.listAttachments(id);
        for (const f of files) {
            if (f.mimetype && f.mimetype !== 'application/pdf') {
                throw new common_1.BadRequestException(`Lampiran "${f.originalname}" harus berupa file PDF.`);
            }
        }
        for (const f of files) {
            const key = await this.minio.upload(f, 'operasi-satgas');
            await this.dataSource.query(`insert into bdb_operasi_satgas_attachments (operasi_satgas_id, file_name, object_key, content_type, size) values ($1,$2,$3,$4,$5)`, [id, f.originalname, key, f.mimetype || null, f.size || null]);
        }
        return this.listAttachments(id);
    }
    async listAttachments(id) {
        await this.ensureAttachmentTable();
        const rows = await this.dataSource.query(`select id, file_name, object_key, content_type, size, created_at from bdb_operasi_satgas_attachments where operasi_satgas_id = $1 order by id desc`, [id]);
        const data = [];
        for (const r of rows) {
            let url = null;
            try {
                url = await this.minio.presignedUrl(r.object_key, 3600);
            }
            catch {
                url = null;
            }
            data.push({ id: r.id, file_name: r.file_name, content_type: r.content_type, size: r.size, created_at: r.created_at, url });
        }
        return { status: 1, data };
    }
    async removeAttachment(attId) {
        await this.ensureAttachmentTable();
        const rows = await this.dataSource.query(`select object_key from bdb_operasi_satgas_attachments where id = $1`, [attId]);
        if (!rows.length)
            throw new common_1.NotFoundException('Lampiran tidak ditemukan');
        try {
            await this.minio.remove(rows[0].object_key);
        }
        catch {
        }
        await this.dataSource.query(`delete from bdb_operasi_satgas_attachments where id = $1`, [attId]);
        return { status: 1, message: 'Lampiran dihapus' };
    }
    tableEnsured = false;
    async ensureTable() {
        if (this.tableEnsured)
            return;
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
        await this.dataSource.query(`create index if not exists idx_operasi_satgas_deleted on bdb_operasi_satgas(deleted_at);`);
        await this.dataSource.query(`create index if not exists idx_operasi_satgas_jenis on bdb_operasi_satgas(jenis);`);
    }
    async ensureJenisMasterTable() {
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
    async listJenisMaster(kelompok) {
        await this.ensureJenisMasterTable();
        const k = this.toJenis(kelompok);
        const rows = await this.dataSource.query(`select id, nama from bdb_operasi_satgas_jenis where kelompok = $1 order by nama`, [k]);
        return { status: 1, data: rows };
    }
    async ensureJenisMasterValue(kelompok, nama) {
        if (!nama)
            return;
        await this.ensureJenisMasterTable();
        await this.dataSource.query(`insert into bdb_operasi_satgas_jenis (kelompok, nama) values ($1,$2) on conflict (kelompok, nama) do nothing`, [kelompok, nama]);
    }
    toText(v) {
        if (v === undefined || v === null)
            return null;
        const t = String(v).trim();
        return t ? t : null;
    }
    toDate(v) {
        if (!v)
            return null;
        const t = String(v).trim();
        return /^\d{4}-\d{2}-\d{2}$/.test(t) ? t : null;
    }
    toBoolean(v, fallback = true) {
        if (v === undefined || v === null || v === '')
            return fallback;
        if (typeof v === 'boolean')
            return v;
        return !['false', '0', 'tidak', 'off'].includes(String(v).trim().toLowerCase());
    }
    toJenis(v) {
        const j = String(v || 'OPERASI').trim().toUpperCase();
        return ['OPERASI', 'SATGAS'].includes(j) ? j : 'OPERASI';
    }
    normalizePayload(dto, partial = false) {
        const source = dto || {};
        const payload = {
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
        const partialPayload = {};
        for (const key of Object.keys(payload)) {
            if (Object.prototype.hasOwnProperty.call(source, key))
                partialPayload[key] = payload[key];
        }
        return partialPayload;
    }
    buildBaseSelect() {
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
    async list(query = {}, userId) {
        await this.ensureTable();
        const actor = await this.actor(userId);
        const page = Math.max(1, Number(query.page || 1));
        const limit = Math.max(1, Math.min(Number(query.row || query.limit || 20), 100));
        const offset = (page - 1) * limit;
        const params = [];
        const innerWhere = ['deleted_at is null'];
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
        const outerWhere = ['1=1'];
        const status = this.toText(query.status);
        if (status && status.toUpperCase() !== 'ALL') {
            params.push(status.toUpperCase());
            outerWhere.push(`status_tampil = $${params.length}`);
        }
        const countRows = await this.dataSource.query(`select count(*)::int as total ${baseSql} where ${outerWhere.join(' and ')}`, params);
        const total = Number(countRows?.[0]?.total || 0);
        const rows = await this.dataSource.query(`select * ${baseSql} where ${outerWhere.join(' and ')} order by coalesce(tanggal_mulai, created_at::date) desc, id desc limit $${params.length + 1} offset $${params.length + 2}`, [...params, limit, offset]);
        for (const row of rows) {
            row.can_delete = actor.isSuper || (row.created_by !== null && Number(row.created_by) === actor.id);
        }
        return { data: rows, meta: { total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) } };
    }
    async rekapLp(userId, query = {}) {
        await this.ensureTable();
        const scope = await (0, scope_util_1.resolveScope)(this.dataSource, userId);
        const page = Math.max(1, Number(query.page || 1));
        const limit = Math.max(1, Math.min(Number(query.row || query.limit || 20), 100));
        const offset = (page - 1) * limit;
        const params = [];
        const where = ['lp.deleted_at is null', 'os.deleted_at is null'];
        if (!scope.all) {
            if (!scope.satkerId) {
                where.push('1=0');
            }
            else {
                params.push(scope.satkerId);
                where.push((0, lp_scope_util_1.effectiveLpScopeSql)('lp', `$${params.length}`));
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
        const totalRow = await this.dataSource.query(`select count(*)::int as total from bdb_laporan_polisi lp join bdb_operasi_satgas os on os.id = lp.operasi_satgas_id where ${whereSql}`, params);
        const total = Number(totalRow?.[0]?.total || 0);
        const rows = await this.dataSource.query(`select
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
             limit $${params.length + 1} offset $${params.length + 2}`, [...params, limit, offset]);
        for (const r of rows)
            r.pid = (0, id_cipher_util_1.encodeId)(Number(r.lp_id));
        return { data: rows, meta: { total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) } };
    }
    async findOne(id) {
        await this.ensureTable();
        const rows = await this.dataSource.query(`select * from (${this.buildBaseSelect()} where deleted_at is null) o where id = $1`, [id]);
        if (!rows.length)
            throw new common_1.NotFoundException('Data operasi/satgas tidak ditemukan');
        return rows[0];
    }
    async listLinkedLp(id) {
        await this.ensureTable();
        const rows = await this.dataSource.query(`select lp.id, lp.no_laporan, lp.satker_nama, lp.unit_nama, coalesce(sm.nama, 'Laporan Polisi') as status_nama
             from bdb_laporan_polisi lp
             left join bdb_status_master sm on sm.id = lp.status_id
             where lp.operasi_satgas_id = $1 and lp.deleted_at is null
             order by lp.no_laporan`, [id]);
        return { status: 1, data: rows };
    }
    async setLinkedLp(id, lpIds, userId) {
        const actor = await this.actor(userId);
        this.assertNotViewer(actor);
        await this.findOne(id);
        const currentRows = await this.dataSource.query(`select id from bdb_laporan_polisi where operasi_satgas_id = $1 and deleted_at is null`, [id]);
        const current = new Set(currentRows.map((r) => Number(r.id)));
        const target = new Set((lpIds || []).map(Number));
        const toAdd = [...target].filter((x) => !current.has(x));
        const toRemove = [...current].filter((x) => !target.has(x));
        let added = 0;
        let removed = 0;
        const failed = [];
        for (const lpId of toAdd) {
            try {
                await this.laporanPolisiService.setOperasiSatgas(lpId, id, userId);
                added++;
            }
            catch (e) {
                failed.push({ id: lpId, message: e?.message || 'Gagal menautkan' });
            }
        }
        for (const lpId of toRemove) {
            try {
                await this.laporanPolisiService.setOperasiSatgas(lpId, null, userId);
                removed++;
            }
            catch (e) {
                failed.push({ id: lpId, message: e?.message || 'Gagal melepas' });
            }
        }
        return { status: 1, data: { added, removed, failed }, message: `${added} LP ditautkan, ${removed} LP dilepas.${failed.length ? ` ${failed.length} gagal.` : ''}` };
    }
    async create(dto, userId) {
        await this.ensureTable();
        const actor = await this.actor(userId);
        this.assertNotViewer(actor);
        const payload = this.normalizePayload(dto);
        payload.created_by = actor.id;
        payload.updated_by = actor.id;
        if (!payload.nama)
            throw new common_1.NotFoundException('Nama wajib diisi');
        await this.ensureJenisMasterValue(payload.jenis, payload.jenis_kategori);
        const keys = Object.keys(payload).filter((k) => payload[k] !== undefined);
        const columns = keys.join(', ');
        const values = keys.map((_, i) => `$${i + 1}`).join(', ');
        const params = keys.map((k) => payload[k]);
        const rows = await this.dataSource.query(`insert into bdb_operasi_satgas (${columns}) values (${values}) returning id`, params);
        return this.findOne(Number(rows[0].id));
    }
    async update(id, dto, userId) {
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
        if (!keys.length)
            return this.findOne(id);
        const sets = keys.map((k, i) => `${k} = $${i + 1}`);
        sets.push('updated_at = now()');
        const params = keys.map((k) => payload[k]);
        params.push(id);
        await this.dataSource.query(`update bdb_operasi_satgas set ${sets.join(', ')} where id = $${params.length} and deleted_at is null`, params);
        return this.findOne(id);
    }
    async setAktif(id, aktif, userId) {
        await this.ensureTable();
        const actor = await this.actor(userId);
        this.assertNotViewer(actor);
        await this.findOne(id);
        await this.dataSource.query('update bdb_operasi_satgas set is_aktif = $2, updated_by = $3, updated_at = now() where id = $1', [id, aktif, actor.id]);
        return this.findOne(id);
    }
    async remove(id, userId, alasan) {
        await this.ensureTable();
        const actor = await this.actor(userId);
        this.assertNotViewer(actor);
        const existing = await this.findOne(id);
        const ownerId = existing.created_by === null ? null : Number(existing.created_by);
        if (!actor.isSuper && ownerId !== actor.id) {
            throw new common_1.ForbiddenException('Hanya pembuat Operasi/Satgas atau superadmin yang dapat menghapus data ini.');
        }
        const reason = this.toText(alasan) || 'Penghapusan melalui menu Operasi/Satgas';
        await this.dataSource.transaction(async (manager) => {
            await manager.query(`update bdb_operasi_satgas
                 set deleted_at = now(), updated_by = $2, updated_at = now()
                 where id = $1 and deleted_at is null`, [id, actor.id]);
            await manager.query(`insert into bdb_audit_log
                    (user_id,user_nama,action,entity,entity_id,meta,outcome)
                 values ($1,$2,'DELETE_OWNED_OPERASI_SATGAS','bdb_operasi_satgas',$3,$4::jsonb,'SUCCESS')`, [actor.id, actor.name, String(id), JSON.stringify({ alasan: reason, before: existing })]);
        });
        return { status: 1, message: 'Operasi/Satgas dihapus' };
    }
};
exports.BdbOperasiSatgasService = BdbOperasiSatgasService;
exports.BdbOperasiSatgasService = BdbOperasiSatgasService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        minio_service_1.MinioService,
        laporan_polisi_service_1.LaporanPolisiService])
], BdbOperasiSatgasService);
//# sourceMappingURL=bdb-operasi-satgas.service.js.map