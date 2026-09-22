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
exports.BarangBuktiService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const scope_util_1 = require("../common/scope.util");
const audit_service_1 = require("../audit/audit.service");
const lp_scope_util_1 = require("../common/lp-scope.util");
const STATUS_MANUAL = ['MASUK', 'KELUAR'];
let BarangBuktiService = class BarangBuktiService {
    dataSource;
    audit;
    constructor(dataSource, audit) {
        this.dataSource = dataSource;
        this.audit = audit;
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
    scopeClause(scope, params) {
        if (scope.all)
            return '1=1';
        if (!scope.satkerId)
            return '1=0';
        params.push(scope.satkerId);
        return (0, lp_scope_util_1.effectiveLpScopeSql)('lp', `$${params.length}`);
    }
    unionSql() {
        return `
            select 'DORS' as sumber, concat('dors-', lp.id, '-', elem.ord)::text as row_id, lp.id as lp_id,
                   null::text as nomor_register,
                   coalesce(elem.item->>'jenis_bb', elem.item->>'kode_bb', 'Barang Bukti') as jenis,
                   elem.item->>'jumlah' as jumlah,
                   null::text as kepemilikan,
                   null::date as tanggal_penyitaan,
                   'MASUK'::text as status,
                   nullif(trim(concat_ws(' · ', elem.item->>'keterangan',
                       nullif(concat_ws(' ', elem.item->>'ran_jenis', elem.item->>'ran_merk', elem.item->>'ran_type', elem.item->>'ran_no_registrasi'), ''))), '') as keterangan,
                   false as can_delete,
                   lp.synced_at as created_at
            from bdb_laporan_polisi lp
            cross join lateral jsonb_array_elements(coalesce(lp.payload_json->'barang_bukti', '[]'::jsonb)) with ordinality as elem(item, ord)
            where lp.deleted_at is null

            union all

            select 'MANUAL' as sumber, m.id::text as row_id, m.lp_id,
                   m.nomor_register, m.jenis, m.jumlah, m.kepemilikan, m.tanggal_penyitaan, m.status, m.keterangan,
                   true as can_delete, m.created_at
            from bdb_lp_barang_bukti_manual m
            where m.deleted_at is null
        `;
    }
    async list(authUser, query = {}) {
        const scope = await (0, scope_util_1.resolveScope)(this.dataSource, authUser?.id ? Number(authUser.id) : undefined);
        const page = Math.max(1, Number(query.page || 1));
        const limit = Math.max(1, Math.min(Number(query.row || query.limit || 20), 100));
        const offset = (page - 1) * limit;
        const params = [];
        const outerWhere = ['lp.deleted_at is null'];
        outerWhere.push(this.scopeClause(scope, params));
        const search = this.toText(query.search);
        if (search) {
            params.push(`%${search.toLowerCase()}%`);
            const p = params.length;
            outerWhere.push(`(lower(coalesce(c.jenis,'')) like $${p} or lower(coalesce(c.nomor_register,'')) like $${p} or lower(coalesce(lp.no_laporan,'')) like $${p})`);
        }
        const status = this.toText(query.status);
        if (status && status.toUpperCase() !== 'ALL' && status.toUpperCase() !== 'SEMUA') {
            params.push(status.toUpperCase());
            outerWhere.push(`c.status = $${params.length}`);
        }
        const sumber = this.toText(query.sumber);
        if (sumber && sumber.toUpperCase() !== 'ALL') {
            params.push(sumber.toUpperCase());
            outerWhere.push(`c.sumber = $${params.length}`);
        }
        const datePattern = /^\d{4}-\d{2}-\d{2}$/;
        for (const [name, operator] of [['from', '>='], ['to', '<=']]) {
            const value = this.toText(query[name]);
            if (!value)
                continue;
            if (!datePattern.test(value)) {
                throw new common_1.BadRequestException(`Format tanggal ${name} harus YYYY-MM-DD.`);
            }
            params.push(value);
            outerWhere.push(`case when lp.tgl_laporan ~ '^\d{2}-\d{2}-\d{4}' then to_date(left(lp.tgl_laporan,10),'DD-MM-YYYY') end ${operator} $${params.length}::date`);
        }
        const baseSql = `
            from (${this.unionSql()}) c
            join bdb_laporan_polisi lp on lp.id = c.lp_id
            where ${outerWhere.join(' and ')}
        `;
        const rows = await this.dataSource.query(`select c.sumber, c.row_id, c.lp_id, c.nomor_register, c.jenis, c.jumlah, c.kepemilikan, c.tanggal_penyitaan,
                    c.status, c.keterangan, c.can_delete, c.created_at,
                    lp.no_laporan, lp.satker_id, lp.satker_nama, lp.unit_nama,
                    (select string_agg(x.txt, '; ') from (
                        select distinct coalesce(nullif(tp->>'nama_kategori_kejahatan',''),'(tanpa kategori)')
                            || case when coalesce(nullif(tp->>'pasal_mapping',''), nullif(tp->>'pasal','')) is not null
                                    then ' — ' || coalesce(nullif(tp->>'pasal_mapping',''), nullif(tp->>'pasal','')) else '' end as txt
                        from jsonb_array_elements(case when jsonb_typeof(lp.payload_json->'tindak_pidana')='array' then lp.payload_json->'tindak_pidana' else '[]'::jsonb end) tp
                    ) x) as dugaan_tindak_pidana
             ${baseSql}
             order by c.created_at desc
             limit $${params.length + 1} offset $${params.length + 2}`, [...params, limit + 1, offset]);
        const hasNext = rows.length > limit;
        return {
            data: rows.slice(0, limit),
            meta: { total: null, estimatedTotal: null, page, limit, hasNext, totalPages: null, mode: 'lookahead-no-count' }
        };
    }
    async listByLpAll(authUser, lpId) {
        await this.assertLpAccess(authUser, lpId);
        const rows = await this.dataSource.query(`select c.sumber, c.row_id, c.lp_id, c.nomor_register, c.jenis, c.jumlah, c.kepemilikan, c.tanggal_penyitaan,
                    c.status, c.keterangan, c.can_delete, c.created_at
             from (${this.unionSql()}) c
             where c.lp_id = $1
             order by c.created_at desc`, [lpId]);
        return { data: rows };
    }
    assertAccess(authUser, lp, scope) {
        const roleBdb = String(authUser?.role_bdb || '').toLowerCase();
        if (!['superadmin', 'admin_binops', 'operator'].includes(roleBdb)) {
            throw new common_1.ForbiddenException('Tidak berwenang mengelola barang bukti.');
        }
        if (!scope.all && !(0, lp_scope_util_1.hasEffectiveLpAccess)(lp, scope.satkerId)) {
            throw new common_1.ForbiddenException('Anda hanya dapat mengelola barang bukti untuk LP di satker Anda sendiri.');
        }
    }
    async assertLpAccess(authUser, lpId) {
        const scope = await (0, scope_util_1.resolveScope)(this.dataSource, authUser?.id ? Number(authUser.id) : undefined);
        const lpRows = await this.dataSource.query('select id, satker_id, unit_satker_id, no_laporan from bdb_laporan_polisi where id=$1 and deleted_at is null', [lpId]);
        if (!lpRows.length)
            throw new common_1.NotFoundException('LP tidak ditemukan.');
        const lp = lpRows[0];
        this.assertAccess(authUser, lp, scope);
        return lp;
    }
    async addManual(authUser, lpId, dto) {
        const lp = await this.assertLpAccess(authUser, lpId);
        const jenis = this.toText(dto?.jenis);
        if (!jenis)
            throw new common_1.BadRequestException('Jenis barang bukti wajib diisi.');
        const status = String(dto?.status || 'MASUK').trim().toUpperCase();
        if (!STATUS_MANUAL.includes(status))
            throw new common_1.BadRequestException(`Status harus salah satu dari: ${STATUS_MANUAL.join(', ')}.`);
        const rows = await this.dataSource.query(`insert into bdb_lp_barang_bukti_manual (lp_id, nomor_register, jenis, jumlah, kepemilikan, tanggal_penyitaan, status, keterangan, created_by)
             values ($1,$2,$3,$4,$5,$6,$7,$8,$9)
             returning id`, [
            lpId,
            this.toText(dto?.nomor_register),
            jenis,
            this.toText(dto?.jumlah),
            this.toText(dto?.kepemilikan),
            this.toDate(dto?.tanggal_penyitaan),
            status,
            this.toText(dto?.keterangan),
            authUser?.id ? Number(authUser.id) : null
        ]);
        await this.audit.log({ user: authUser, action: 'CREATE', entity: 'barang_bukti_manual', entityId: rows[0].id, meta: { lp_id: lpId, no_laporan: lp.no_laporan, jenis, status } });
        return this.detail(rows[0].id);
    }
    async detail(id) {
        const rows = await this.dataSource.query('select * from bdb_lp_barang_bukti_manual where id=$1 and deleted_at is null', [id]);
        if (!rows.length)
            throw new common_1.NotFoundException('Data tidak ditemukan.');
        return { sumber: 'MANUAL', row_id: rows[0].id, can_delete: true, ...rows[0] };
    }
    async updateManual(authUser, rowId, dto) {
        const existingRows = await this.dataSource.query('select * from bdb_lp_barang_bukti_manual where id=$1 and deleted_at is null', [rowId]);
        if (!existingRows.length)
            throw new common_1.NotFoundException('Data tidak ditemukan.');
        const existing = existingRows[0];
        const lp = await this.assertLpAccess(authUser, Number(existing.lp_id));
        const jenis = this.toText(dto?.jenis);
        if (!jenis)
            throw new common_1.BadRequestException('Jenis barang bukti wajib diisi.');
        const status = String(dto?.status || existing.status || 'MASUK').trim().toUpperCase();
        if (!STATUS_MANUAL.includes(status))
            throw new common_1.BadRequestException(`Status harus salah satu dari: ${STATUS_MANUAL.join(', ')}.`);
        await this.dataSource.query(`update bdb_lp_barang_bukti_manual set
                nomor_register=$2, jenis=$3, jumlah=$4, kepemilikan=$5, tanggal_penyitaan=$6, status=$7, keterangan=$8, updated_at=now()
             where id=$1`, [
            rowId,
            this.toText(dto?.nomor_register),
            jenis,
            this.toText(dto?.jumlah),
            this.toText(dto?.kepemilikan),
            this.toDate(dto?.tanggal_penyitaan) ?? existing.tanggal_penyitaan,
            status,
            this.toText(dto?.keterangan)
        ]);
        await this.audit.log({ user: authUser, action: 'UPDATE', entity: 'barang_bukti_manual', entityId: rowId, meta: { lp_id: existing.lp_id, no_laporan: lp.no_laporan, jenis, status } });
        return this.detail(rowId);
    }
    async removeManual(authUser, id) {
        const roleBdb = String(authUser?.role_bdb || '').toLowerCase();
        if (!['superadmin', 'admin_binops'].includes(roleBdb)) {
            throw new common_1.ForbiddenException('Hanya superadmin/admin binops yang dapat menghapus entri barang bukti manual.');
        }
        const rows = await this.dataSource.query('select id, lp_id, jenis from bdb_lp_barang_bukti_manual where id=$1 and deleted_at is null', [id]);
        if (!rows.length)
            throw new common_1.NotFoundException('Data tidak ditemukan.');
        await this.dataSource.query('update bdb_lp_barang_bukti_manual set deleted_at = now() where id=$1', [id]);
        await this.audit.log({ user: authUser, action: 'DELETE', entity: 'barang_bukti_manual', entityId: id, meta: { lp_id: rows[0].lp_id, jenis: rows[0].jenis } });
        return { status: 1, message: 'Barang bukti manual dihapus.' };
    }
};
exports.BarangBuktiService = BarangBuktiService;
exports.BarangBuktiService = BarangBuktiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        audit_service_1.AuditService])
], BarangBuktiService);
//# sourceMappingURL=barang-bukti.service.js.map