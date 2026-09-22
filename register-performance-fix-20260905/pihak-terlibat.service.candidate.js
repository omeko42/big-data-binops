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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PihakTerlibatService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const scope_util_1 = require("../common/scope.util");
const audit_service_1 = require("../audit/audit.service");
const minio_service_1 = require("../kerma/minio.service");
const lp_scope_util_1 = require("../common/lp-scope.util");
const KETERLIBATAN_MANUAL = ['SAKSI', 'AHLI', 'TERSANGKA'];
/**
 * Register Pihak Terlibat: gabungan 3 sumber --
 *  1) bdb_dors_lp_terlibat -- read-only, disalin dari DORS tiap sync (saksi/terlapor/korban/pelapor).
 *  2) bdb_lp_pihak_manual -- diisi manual di halaman detail LP: SAKSI, AHLI, TERSANGKA saja, dengan
 *     field detail personil sama seperti punya DORS.
 *  3) bdb_dokumen PENETAPAN_TSK -- read-only, sumber resmi tersangka dari alur dokumen LP.
 */
let PihakTerlibatService = class PihakTerlibatService {
    constructor(dataSource, audit, minio) {
        this.dataSource = dataSource;
        this.audit = audit;
        this.minio = minio;
        this.summaryCache = new Map();
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
        return `(lp.satker_id = $${params.length} or lp.unit_satker_id = $${params.length})`;
    }
    async readOnlyQuery(sql, params, timeoutMs = 12000) {
        const runner = this.dataSource.createQueryRunner();
        await runner.connect();
        await runner.startTransaction();
        try {
            await runner.query('set transaction read only');
            await runner.query(`set local statement_timeout = '${Math.max(1000, Math.min(timeoutMs, 15000))}ms'`);
            const rows = await runner.query(sql, params);
            await runner.commitTransaction();
            return rows;
        }
        catch (error) {
            await runner.rollbackTransaction();
            if (String(error?.code || '') === '57014') {
                throw new common_1.BadRequestException('Filter terlalu berat dan melewati batas 12 detik. Persempit periode, area, atau kata pencarian lalu klik Terapkan kembali.');
            }
            throw error;
        }
        finally {
            await runner.release();
        }
    }
    summaryKey(scope, query) {
        return JSON.stringify({ scope: scope.all ? 'ALL' : Number(scope.satkerId || 0), search: query.search || '', sumber: query.sumber || 'ALL', from: query.from || '', to: query.to || '', kejahatan: query.kejahatan || '', area: query.area || '', satker_id: query.satker_id || null });
    }
    hasCommonFilter(query) {
        return !!(this.toText(query.search) || this.toText(query.from) || this.toText(query.to) || this.toText(query.kejahatan) || this.toText(query.area) || query.satker_id || (this.toText(query.sumber) && String(query.sumber).toUpperCase() !== 'ALL'));
    }
    buildWhere(scope, query, includeFacetFilters) {
        const params = [];
        const where = ['lp.deleted_at is null', this.scopeClause(scope, params)];
        const addLike = (column, value) => {
            const text = this.toText(value);
            if (!text)
                return;
            params.push(`%${text.toLowerCase()}%`);
            where.push(`lower(coalesce(${column},'')) like $${params.length}`);
        };
        const search = this.toText(query.search);
        if (search) {
            params.push(`%${search.toLowerCase()}%`);
            const p = params.length;
            where.push(`(lower(coalesce(c.nama,'')) like $${p} or lower(coalesce(c.nik,'')) like $${p} or lower(coalesce(lp.no_laporan,'')) like $${p})`);
        }
        const sumber = this.toText(query.sumber);
        if (sumber && sumber.toUpperCase() !== 'ALL') {
            params.push(sumber.toUpperCase());
            where.push(`c.sumber=$${params.length}`);
        }
        const datePattern = /^\d{4}-\d{2}-\d{2}$/;
        for (const [name, op] of [['from', '>='], ['to', '<=']]) {
            const value = this.toText(query[name]);
            if (!value)
                continue;
            if (!datePattern.test(value))
                throw new common_1.BadRequestException(`Tanggal ${name === 'from' ? 'awal' : 'akhir'} tidak valid (format YYYY-MM-DD).`);
            params.push(value);
            where.push(`to_timestamp(nullif(lp.tgl_laporan,''),'DD-MM-YYYY HH24:MI:SS')::date ${op} $${params.length}::date`);
        }
        addLike('jk.keterangan', query.kejahatan);
        const area = this.toText(query.area);
        if (area) {
            params.push(`%${area.toLowerCase()}%`);
            const p = params.length;
            where.push(`(lower(coalesce(lp.satker_nama,'')) like $${p} or lower(coalesce(lp.unit_satker_nama,'')) like $${p})`);
        }
        const satkerId = Number(query.satker_id || 0);
        if (Number.isSafeInteger(satkerId) && satkerId > 0) {
            params.push(satkerId);
            where.push(`(lp.satker_id=$${params.length} or lp.unit_satker_id=$${params.length})`);
        }
        if (includeFacetFilters) {
            const keterlibatan = this.toText(query.keterlibatan);
            if (keterlibatan && keterlibatan.toUpperCase() !== 'ALL') {
                params.push(keterlibatan.toUpperCase());
                where.push(`c.keterlibatan=$${params.length}`);
            }
            const status = this.toText(query.status);
            if (status && status.toUpperCase() !== 'ALL') {
                params.push(status.toUpperCase() === 'LIDIK' ? 'PENYELIDIKAN' : status.toUpperCase());
                where.push(`coalesce(sm.code,'LP')=$${params.length}`);
            }
        }
        return { params, where };
    }
    /**
     * Summary memakai jalur langsung per sumber supaya tabel LP tidak di-join dua kali.
     * Data DORS dan manual sengaja dibaca terpisah lalu dijumlahkan di aplikasi. Selain
     * lebih ringan pada jutaan baris, bentuk ini tetap mempertahankan semesta LP aktif
     * dan scope owner/unit yang sama dengan tabel register.
     */
    buildDirectSummaryWhere(scope, query, partyAlias, source, includeFacetFilters = false) {
        const params = [];
        const where = ['lp.deleted_at is null', this.scopeClause(scope, params)];
        const selectedSource = (this.toText(query.sumber) || 'ALL').toUpperCase();
        if (selectedSource !== 'ALL' && selectedSource !== source) {
            return { params, where: ['1=0'], skip: true };
        }
        const search = this.toText(query.search);
        if (search) {
            params.push(`%${search.toLowerCase()}%`);
            const p = params.length;
            where.push(`(lower(coalesce(${partyAlias}.nama,'')) like $${p} or lower(coalesce(${partyAlias}.nik,'')) like $${p} or lower(coalesce(lp.no_laporan,'')) like $${p})`);
        }
        const datePattern = /^\d{4}-\d{2}-\d{2}$/;
        for (const [name, op] of [['from', '>='], ['to', '<=']]) {
            const value = this.toText(query[name]);
            if (!value)
                continue;
            if (!datePattern.test(value))
                throw new common_1.BadRequestException(`Tanggal ${name === 'from' ? 'awal' : 'akhir'} tidak valid (format YYYY-MM-DD).`);
            params.push(value);
            where.push(`to_timestamp(nullif(lp.tgl_laporan,''),'DD-MM-YYYY HH24:MI:SS')::date ${op} $${params.length}::date`);
        }
        const kejahatan = this.toText(query.kejahatan);
        if (kejahatan) {
            params.push(`%${kejahatan.toLowerCase()}%`);
            where.push(`lower(coalesce(jk.keterangan,'')) like $${params.length}`);
        }
        const area = this.toText(query.area);
        if (area) {
            params.push(`%${area.toLowerCase()}%`);
            const p = params.length;
            where.push(`(lower(coalesce(lp.satker_nama,'')) like $${p} or lower(coalesce(lp.unit_satker_nama,'')) like $${p})`);
        }
        const satkerId = Number(query.satker_id || 0);
        if (Number.isSafeInteger(satkerId) && satkerId > 0) {
            params.push(satkerId);
            where.push(`(lp.satker_id=$${params.length} or lp.unit_satker_id=$${params.length})`);
        }
        if (includeFacetFilters) {
            const keterlibatan = this.toText(query.keterlibatan);
            if (keterlibatan && keterlibatan.toUpperCase() !== 'ALL') {
                params.push(keterlibatan.toUpperCase());
                where.push(`upper(coalesce(${partyAlias}.keterlibatan,'-'))=$${params.length}`);
            }
            const status = this.toText(query.status);
            if (status && status.toUpperCase() !== 'ALL') {
                params.push(status.toUpperCase() === 'LIDIK' ? 'PENYELIDIKAN' : status.toUpperCase());
                where.push(`coalesce(sm.code,'LP')=$${params.length}`);
            }
        }
        return { params, where, skip: false };
    }
    documentPartiesCte() {
        return `document_tsk as (
                    select distinct on (
                               d.lp_id,
                               upper(trim(coalesce(item->>'nama',''))),
                               trim(coalesce(item->>'nik',''))
                           )
                           d.lp_id,
                           d.id as dokumen_id,
                           ordinality::int as urutan,
                           nullif(trim(item->>'nama'),'') as nama,
                           nullif(trim(item->>'nik'),'') as nik,
                           nullif(trim(item->>'jenis_kelamin'),'') as jenis_kelamin,
                           nullif(trim(item->>'tempat_lahir'),'') as tempat_lahir,
                           nullif(trim(item->>'tgl_lahir'),'') as tgl_lahir,
                           nullif(trim(item->>'pekerjaan'),'') as pekerjaan,
                           nullif(trim(item->>'alamat'),'') as alamat,
                           nullif(trim(item->>'no_hp'),'') as no_hp,
                           'TERSANGKA'::text as keterlibatan,
                           coalesce(nullif(trim(d.nomor_dokumen),''), nullif(trim(d.data->>'nomor_dokumen'),'')) as nomor_dokumen,
                           coalesce(d.tanggal_dokumen, nullif(trim(d.data->>'tanggal_dokumen'),'')::date) as tanggal_dokumen,
                           d.created_at
                    from bdb_dokumen d
                    join bdb_document_type_master dt on dt.id=d.document_type_id and dt.code='PENETAPAN_TSK'
                    cross join lateral jsonb_array_elements(
                        case when jsonb_typeof(d.data->'tersangka')='array'
                             then d.data->'tersangka' else '[]'::jsonb end
                    ) with ordinality as party(item, ordinality)
                    where nullif(trim(item->>'nama'),'') is not null
                    order by d.lp_id,
                             upper(trim(coalesce(item->>'nama',''))),
                             trim(coalesce(item->>'nik','')),
                             d.created_at desc,
                             d.id desc,
                             ordinality desc
                ),
                document_dpo_raw as (
                    select d.lp_id,
                           d.id as dokumen_id,
                           ordinality::int as urutan,
                           nullif(trim(item->>'nama'),'') as nama,
                           nullif(trim(item->>'nik'),'') as nik,
                           nullif(trim(item->>'jenis_kelamin'),'') as jenis_kelamin,
                           nullif(trim(item->>'tempat_lahir'),'') as tempat_lahir,
                           nullif(trim(item->>'tgl_lahir'),'') as tgl_lahir,
                           nullif(trim(item->>'pekerjaan'),'') as pekerjaan,
                           nullif(trim(item->>'alamat'),'') as alamat,
                           nullif(trim(item->>'no_hp'),'') as no_hp,
                           coalesce(nullif(trim(d.nomor_dokumen),''),nullif(trim(d.data->>'nomor_dokumen'),'')) as nomor_dokumen,
                           coalesce(d.tanggal_dokumen,nullif(trim(d.data->>'tanggal_dokumen'),'')::date) as tanggal_dokumen,
                           d.created_at
                    from bdb_dokumen d
                    join bdb_document_type_master dt on dt.id=d.document_type_id and dt.code='PENETAPAN_DPO'
                    cross join lateral jsonb_array_elements(
                        case when jsonb_typeof(d.data->'tersangka')='array'
                             then d.data->'tersangka' else '[]'::jsonb end
                    ) with ordinality as party(item,ordinality)
                    where nullif(trim(item->>'nama'),'') is not null
                ),
                document_dpo_active as (
                    select distinct on (
                               r.lp_id,
                               upper(trim(coalesce(r.nama,''))),
                               trim(coalesce(r.nik,''))
                           )
                           r.lp_id,r.dokumen_id,r.urutan,r.nama,r.nik,r.jenis_kelamin,
                           r.tempat_lahir,r.tgl_lahir,r.pekerjaan,r.alamat,r.no_hp,
                           'DPO'::text as keterlibatan,r.nomor_dokumen,r.tanggal_dokumen,r.created_at
                    from document_dpo_raw r
                    where not exists (
                        select 1
                        from bdb_dokumen c
                        join bdb_document_type_master ct on ct.id=c.document_type_id and ct.code='CABUT_DPO'
                        where c.lp_id=r.lp_id
                          and lower(regexp_replace(trim(coalesce(c.data->>'nomor_dpo','')),'\\s+','','g'))
                              = lower(regexp_replace(trim(coalesce(r.nomor_dokumen,'')),'\\s+','','g'))
                          and exists (
                              select 1
                              from jsonb_array_elements(
                                  case when jsonb_typeof(c.data->'tersangka')='array'
                                       then c.data->'tersangka' else '[]'::jsonb end
                              ) revoked_person
                              where (
                                  nullif(regexp_replace(coalesce(revoked_person->>'nik',''),'\\D','','g'),'') is not null
                                  and nullif(regexp_replace(coalesce(r.nik,''),'\\D','','g'),'') is not null
                                  and regexp_replace(coalesce(revoked_person->>'nik',''),'\\D','','g')
                                      = regexp_replace(coalesce(r.nik,''),'\\D','','g')
                              ) or upper(regexp_replace(coalesce(revoked_person->>'nama',''),'[^A-Za-z0-9]+','','g'))
                                  = upper(regexp_replace(coalesce(r.nama,''),'[^A-Za-z0-9]+','','g'))
                          )
                    )
                    order by r.lp_id,upper(trim(coalesce(r.nama,''))),trim(coalesce(r.nik,'')),r.created_at desc,r.dokumen_id desc,r.urutan desc
                ),
                document_parties as (
                    select t.* from document_tsk t
                    where not exists (
                        select 1 from document_dpo_active a
                        where a.lp_id=t.lp_id
                          and ((nullif(trim(a.nik),'') is not null and nullif(trim(t.nik),'') is not null and trim(a.nik)=trim(t.nik))
                               or upper(trim(a.nama))=upper(trim(t.nama)))
                    )
                    union all
                    select a.* from document_dpo_active a
                )`;
    }
    summaryProjection(partyAlias) {
        return `count(*)::int as semua,
                count(*) filter (where upper(coalesce(${partyAlias}.keterlibatan,'-'))='KORBAN')::int as korban,
                count(*) filter (where upper(coalesce(${partyAlias}.keterlibatan,'-'))='SAKSI')::int as saksi,
                count(*) filter (where upper(coalesce(${partyAlias}.keterlibatan,'-'))='PELAPOR')::int as pelapor,
                count(*) filter (where upper(coalesce(${partyAlias}.keterlibatan,'-'))='TERLAPOR')::int as terlapor,
                count(*) filter (where upper(coalesce(${partyAlias}.keterlibatan,'-'))='TERSANGKA')::int as tersangka,
                count(*) filter (where upper(coalesce(${partyAlias}.keterlibatan,'-'))='DPO')::int as dpo,
                count(*) filter (where coalesce(sm.code,'LP')='PENYELIDIKAN')::int as lidik`;
    }
    emptySummary() {
        return { semua: 0, lidik: 0, korban: 0, saksi: 0, pelapor: 0, terlapor: 0, tersangka: 0, dpo: 0 };
    }
    mergeSummary(target, source) {
        for (const key of Object.keys(target))
            target[key] += Number(source?.[key] || 0);
        return target;
    }
    async globalSummary(authUser, query) {
        const scope = await (0, scope_util_1.resolveScope)(this.dataSource, authUser?.id ? Number(authUser.id) : undefined);
        const cacheable = scope.all && !this.hasCommonFilter(query);
        const key = this.summaryKey(scope, query);
        const cached = cacheable ? this.summaryCache.get(key) : null;
        if (cached && cached.expiresAt > Date.now())
            return { ...cached.data, cached: true };
        const summary = this.emptySummary();
        const dorsWhere = this.buildDirectSummaryWhere(scope, query, 't', 'DORS');
        if (!dorsWhere.skip) {
            const rows = await this.readOnlyQuery(`select ${this.summaryProjection('t')}
                 from bdb_laporan_polisi lp
                 join bdb_dors_lp d on d.dors_lp_id=lp.dors_lp_id and d.model_lp=lp.model_lp
                 join bdb_dors_lp_terlibat t on t.lp_id=d.id and t.nama is not null
                 left join cm_jenis_kejahatan jk on jk.id=lp.jenis_kejahatan_id
                 left join bdb_status_master sm on sm.id=lp.status_id
                 where ${dorsWhere.where.join(' and ')}`, dorsWhere.params, 12000);
            this.mergeSummary(summary, rows[0]);
        }
        const manualWhere = this.buildDirectSummaryWhere(scope, query, 'm', 'MANUAL');
        if (!manualWhere.skip) {
            const rows = await this.readOnlyQuery(`select ${this.summaryProjection('m')}
                 from bdb_laporan_polisi lp
                 join bdb_lp_pihak_manual m on m.lp_id=lp.id and m.deleted_at is null
                 left join cm_jenis_kejahatan jk on jk.id=lp.jenis_kejahatan_id
                 left join bdb_status_master sm on sm.id=lp.status_id
                 where ${manualWhere.where.join(' and ')}`, manualWhere.params, 12000);
            this.mergeSummary(summary, rows[0]);
        }
        const documentWhere = this.buildDirectSummaryWhere(scope, query, 'x', 'DOKUMEN');
        if (!documentWhere.skip) {
            const rows = await this.readOnlyQuery(`with ${this.documentPartiesCte()}
                 select ${this.summaryProjection('x')}
                 from bdb_laporan_polisi lp
                 join document_parties x on x.lp_id=lp.id
                 left join cm_jenis_kejahatan jk on jk.id=lp.jenis_kejahatan_id
                 left join bdb_status_master sm on sm.id=lp.status_id
                 where ${documentWhere.where.join(' and ')}`, documentWhere.params, 12000);
            this.mergeSummary(summary, rows[0]);
        }
        const result = { summary, mode: cacheable ? 'exact-active-lp-cache-5m' : 'exact-active-lp-filtered', cached: false };
        if (cacheable)
            this.summaryCache.set(key, { expiresAt: Date.now() + 300000, data: result });
        return result;
    }
    async recentGlobal(page, limit) {
        const offset = (page - 1) * limit;
        const fetch = offset + limit + 1;
        const dorsPromise = this.dataSource.query(`select 'DORS' as sumber, t.id::text as row_id, lp.id as lp_id, t.nama, t.nik,
                    upper(coalesce(t.keterlibatan,'-')) as keterlibatan,
                    null::text as nomor_dokumen, null::date as tanggal_dokumen, null::date as bap_tanggal,
                    null::text as keterangan, false as has_lampiran, d.synced_at as created_at,
                    lp.no_laporan, lp.satker_id, lp.satker_nama, lp.unit_nama, jk.keterangan as kejahatan
             from bdb_dors_lp_terlibat t
             join bdb_dors_lp d on d.id=t.lp_id
             join bdb_laporan_polisi lp on lp.dors_lp_id=d.dors_lp_id and lp.model_lp=d.model_lp and lp.deleted_at is null
             left join cm_jenis_kejahatan jk on jk.id=lp.jenis_kejahatan_id
             where t.nama is not null
             order by t.id desc
             limit $1`, [fetch]);
        const manualPromise = this.dataSource.query(`select 'MANUAL' as sumber, m.id::text as row_id, m.lp_id, m.nama, m.nik,
                    upper(m.keterlibatan) as keterlibatan, m.nomor_dokumen, m.tanggal_dokumen, m.bap_tanggal,
                    m.keterangan, (m.lampiran_object_key is not null) as has_lampiran, m.created_at,
                    lp.no_laporan, lp.satker_id, lp.satker_nama, lp.unit_nama, jk.keterangan as kejahatan
             from bdb_lp_pihak_manual m
             join bdb_laporan_polisi lp on lp.id=m.lp_id and lp.deleted_at is null
             left join cm_jenis_kejahatan jk on jk.id=lp.jenis_kejahatan_id
             where m.deleted_at is null
             order by m.id desc
             limit $1`, [fetch]);
        const documentPromise = this.dataSource.query(`with ${this.documentPartiesCte()}
             select 'DOKUMEN' as sumber,
                    (x.dokumen_id::text || ':' || x.urutan::text) as row_id,
                    lp.id as lp_id,x.nama,x.nik,x.keterlibatan,x.nomor_dokumen,x.tanggal_dokumen,
                    null::date as bap_tanggal,case when x.keterlibatan='DPO' then 'Penetapan DPO aktif' else 'Surat Ketetapan Penetapan Tersangka' end::text as keterangan,
                    false as has_lampiran,x.created_at,
                    lp.no_laporan,lp.satker_id,lp.satker_nama,lp.unit_nama,jk.keterangan as kejahatan
             from document_parties x
             join bdb_laporan_polisi lp on lp.id=x.lp_id and lp.deleted_at is null
             left join cm_jenis_kejahatan jk on jk.id=lp.jenis_kejahatan_id
             order by x.created_at desc,x.dokumen_id desc,x.urutan desc
             limit $1`, [fetch]);
        const [dors, manual, document] = await Promise.all([dorsPromise, manualPromise, documentPromise]);
        const merged = [...dors, ...manual, ...document].sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
        const pageRows = merged.slice(offset, offset + limit + 1);
        const hasNext = pageRows.length > limit;
        return { data: pageRows.slice(0, limit), meta: { total: null, estimatedTotal: null, page, limit, hasNext, totalPages: null, mode: 'recent-key-tail' } };
    }
    async list(authUser, query = {}) {
        const scope = await (0, scope_util_1.resolveScope)(this.dataSource, authUser?.id ? Number(authUser.id) : undefined);
        if (String(query.summary_only || '') === '1') {
            const result = await this.globalSummary(authUser, query);
            return { data: [], meta: result };
        }
        const page = Math.max(1, Number(query.page || 1));
        const limit = Math.max(1, Math.min(Number(query.row || query.limit || 25), 100));
        const isDefaultGlobal = scope.all && !this.hasCommonFilter(query) && (!query.keterlibatan || String(query.keterlibatan).toUpperCase() === 'ALL') && (!query.status || String(query.status).toUpperCase() === 'ALL');
        if (isDefaultGlobal)
            return this.recentGlobal(page, limit);
        const fetch = page * limit + 1;
        const rows = [];
        const dorsWhere = this.buildDirectSummaryWhere(scope, query, 't', 'DORS', true);
        if (!dorsWhere.skip) {
            const dorsRows = await this.readOnlyQuery(`select 'DORS' as sumber,t.id::text as row_id,lp.id as lp_id,t.nama,t.nik,
                        upper(coalesce(t.keterlibatan,'-')) as keterlibatan,
                        null::text as nomor_dokumen,null::date as tanggal_dokumen,null::date as bap_tanggal,
                        null::text as keterangan,false as has_lampiran,d.synced_at as created_at,
                        lp.no_laporan,lp.satker_id,lp.satker_nama,lp.unit_nama,jk.keterangan as kejahatan
                 from bdb_laporan_polisi lp
                 join bdb_dors_lp d on d.dors_lp_id=lp.dors_lp_id and d.model_lp=lp.model_lp
                 join bdb_dors_lp_terlibat t on t.lp_id=d.id and t.nama is not null
                 left join cm_jenis_kejahatan jk on jk.id=lp.jenis_kejahatan_id
                 left join bdb_status_master sm on sm.id=lp.status_id
                 where ${dorsWhere.where.join(' and ')}
                 order by d.synced_at desc,t.id desc limit $${dorsWhere.params.length + 1}`, [...dorsWhere.params, fetch], 12000);
            rows.push(...dorsRows);
        }
        const manualWhere = this.buildDirectSummaryWhere(scope, query, 'm', 'MANUAL', true);
        if (!manualWhere.skip) {
            const manualRows = await this.readOnlyQuery(`select 'MANUAL' as sumber,m.id::text as row_id,m.lp_id,m.nama,m.nik,
                        upper(m.keterlibatan) as keterlibatan,m.nomor_dokumen,m.tanggal_dokumen,m.bap_tanggal,
                        m.keterangan,(m.lampiran_object_key is not null) as has_lampiran,m.created_at,
                        lp.no_laporan,lp.satker_id,lp.satker_nama,lp.unit_nama,jk.keterangan as kejahatan
                 from bdb_laporan_polisi lp
                 join bdb_lp_pihak_manual m on m.lp_id=lp.id and m.deleted_at is null
                 left join cm_jenis_kejahatan jk on jk.id=lp.jenis_kejahatan_id
                 left join bdb_status_master sm on sm.id=lp.status_id
                 where ${manualWhere.where.join(' and ')}
                 order by m.created_at desc,m.id desc limit $${manualWhere.params.length + 1}`, [...manualWhere.params, fetch], 12000);
            rows.push(...manualRows);
        }
        const documentWhere = this.buildDirectSummaryWhere(scope, query, 'x', 'DOKUMEN', true);
        if (!documentWhere.skip) {
            const documentRows = await this.readOnlyQuery(`with ${this.documentPartiesCte()}
                 select 'DOKUMEN' as sumber,
                        (x.dokumen_id::text || ':' || x.urutan::text) as row_id,
                        lp.id as lp_id,x.nama,x.nik,x.keterlibatan,x.nomor_dokumen,x.tanggal_dokumen,
                        null::date as bap_tanggal,case when x.keterlibatan='DPO' then 'Penetapan DPO aktif' else 'Surat Ketetapan Penetapan Tersangka' end::text as keterangan,
                        false as has_lampiran,x.created_at,
                        lp.no_laporan,lp.satker_id,lp.satker_nama,lp.unit_nama,jk.keterangan as kejahatan
                 from bdb_laporan_polisi lp
                 join document_parties x on x.lp_id=lp.id
                 left join cm_jenis_kejahatan jk on jk.id=lp.jenis_kejahatan_id
                 left join bdb_status_master sm on sm.id=lp.status_id
                 where ${documentWhere.where.join(' and ')}
                 order by x.created_at desc,x.dokumen_id desc,x.urutan desc
                 limit $${documentWhere.params.length + 1}`, [...documentWhere.params, fetch], 12000);
            rows.push(...documentRows);
        }
        rows.sort((a, b) => {
            const time = new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
            if (time)
                return time;
            return Number(b.row_id || 0) - Number(a.row_id || 0);
        });
        const offset = (page - 1) * limit;
        const pageRows = rows.slice(offset, offset + limit + 1);
        const hasNext = pageRows.length > limit;
        return { data: pageRows.slice(0, limit), meta: { total: null, estimatedTotal: null, page, limit, hasNext, totalPages: null, mode: 'filtered-direct-branch-timeout-12s' } };
    }
    async assertAccess(authUser, lp, scope) {
        const roleBdb = String(authUser?.role_bdb || '').toLowerCase();
        if (!['superadmin', 'admin_binops', 'operator'].includes(roleBdb)) {
            throw new common_1.ForbiddenException('Tidak berwenang menambahkan pihak terlibat.');
        }
        const scopeSatkerId = scope.satkerId == null ? null : Number(scope.satkerId);
        if (!scope.all && (scopeSatkerId == null || !Number.isFinite(scopeSatkerId))) {
            throw new common_1.ForbiddenException('Akun belum memiliki scope satker yang valid.');
        }
        if (!scope.all && !(await (0, lp_scope_util_1.hasOperationalLpAccess)(this.dataSource, lp, scopeSatkerId))) {
            throw new common_1.ForbiddenException('Anda hanya dapat menambahkan pihak terlibat untuk LP di satker Anda sendiri.');
        }
    }
    async addManual(authUser, lpId, dto, file) {
        const scope = await (0, scope_util_1.resolveScope)(this.dataSource, authUser?.id ? Number(authUser.id) : undefined);
        const lpRows = await this.dataSource.query('select id, satker_id, unit_satker_id, no_laporan from bdb_laporan_polisi where id=$1 and deleted_at is null', [lpId]);
        if (!lpRows.length)
            throw new common_1.NotFoundException('LP tidak ditemukan.');
        const lp = lpRows[0];
        await this.assertAccess(authUser, lp, scope);
        const nama = this.toText(dto?.nama);
        if (!nama)
            throw new common_1.BadRequestException('Nama wajib diisi.');
        const keterlibatan = String(dto?.keterlibatan || '').trim().toUpperCase();
        if (!KETERLIBATAN_MANUAL.includes(keterlibatan)) {
            throw new common_1.BadRequestException(`Keterlibatan harus salah satu dari: ${KETERLIBATAN_MANUAL.join(', ')}.`);
        }
        const bapTanggal = this.toDate(dto?.bap_tanggal);
        const nomorDokumen = this.toText(dto?.nomor_dokumen);
        const tanggalDokumen = this.toDate(dto?.tanggal_dokumen);
        // Syarat per jenis -- SAKSI & TERSANGKA wajib dokumen pendukung + lampirannya, AHLI bebas.
        if (keterlibatan === 'SAKSI') {
            if (!bapTanggal)
                throw new common_1.BadRequestException('Tanggal BAP wajib diisi untuk menambahkan Saksi.');
            if (!file)
                throw new common_1.BadRequestException('Lampiran BAP wajib diunggah untuk menambahkan Saksi.');
        }
        else if (keterlibatan === 'TERSANGKA') {
            if (!nomorDokumen)
                throw new common_1.BadRequestException('Nomor surat penetapan tersangka wajib diisi.');
            if (!tanggalDokumen)
                throw new common_1.BadRequestException('Tanggal surat penetapan tersangka wajib diisi.');
            if (!file)
                throw new common_1.BadRequestException('Lampiran surat penetapan tersangka wajib diunggah.');
        }
        let lampiran = null;
        if (file) {
            const key = await this.minio.upload(file, 'pihak-terlibat');
            lampiran = { key, name: file.originalname, type: file.mimetype, size: file.size };
        }
        const rows = await this.dataSource.query(`insert into bdb_lp_pihak_manual
                (lp_id, keterlibatan, nama, nik, jenis_kelamin, tempat_lahir, tgl_lahir, pekerjaan, alamat, no_hp,
                 bap_tanggal, nomor_dokumen, tanggal_dokumen, lampiran_file_name, lampiran_object_key, lampiran_content_type, lampiran_size,
                 keterangan, created_by)
             values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
             returning id`, [
            lpId,
            keterlibatan,
            nama,
            this.toText(dto?.nik),
            this.toText(dto?.jenis_kelamin),
            this.toText(dto?.tempat_lahir),
            this.toText(dto?.tgl_lahir),
            this.toText(dto?.pekerjaan),
            this.toText(dto?.alamat),
            this.toText(dto?.no_hp),
            bapTanggal,
            nomorDokumen,
            tanggalDokumen,
            lampiran?.name || null,
            lampiran?.key || null,
            lampiran?.type || null,
            lampiran?.size || null,
            this.toText(dto?.keterangan),
            authUser?.id ? Number(authUser.id) : null
        ]);
        await this.audit.log({
            user: authUser,
            action: 'CREATE',
            entity: 'pihak_terlibat_manual',
            entityId: rows[0].id,
            meta: { lp_id: lpId, no_laporan: lp.no_laporan, nama, keterlibatan }
        });
        return this.detail(rows[0].id);
    }
    async detail(id) {
        const rows = await this.dataSource.query('select * from bdb_lp_pihak_manual where id=$1 and deleted_at is null', [id]);
        if (!rows.length)
            throw new common_1.NotFoundException('Data tidak ditemukan.');
        const row = rows[0];
        let lampiran_url = null;
        if (row.lampiran_object_key) {
            try {
                lampiran_url = await this.minio.presignedUrl(row.lampiran_object_key, 3600);
            }
            catch {
                lampiran_url = null;
            }
        }
        return { ...row, lampiran_url };
    }
    async listByLp(authUser, lpId) {
        await this.assertLpAccess(authUser, lpId);
        const rows = await this.dataSource.query(`select id, keterlibatan, nama, nik, jenis_kelamin, tempat_lahir, tgl_lahir, pekerjaan, alamat, no_hp,
                    bap_tanggal, nomor_dokumen, tanggal_dokumen, lampiran_file_name, lampiran_object_key, keterangan, created_at
             from bdb_lp_pihak_manual
             where lp_id = $1 and deleted_at is null
             order by created_at desc`, [lpId]);
        const data = [];
        for (const r of rows) {
            let lampiran_url = null;
            if (r.lampiran_object_key) {
                try {
                    lampiran_url = await this.minio.presignedUrl(r.lampiran_object_key, 3600);
                }
                catch {
                    lampiran_url = null;
                }
            }
            data.push({ sumber: 'MANUAL', row_id: r.id, ...r, lampiran_url });
        }
        return { data };
    }
    /** Gabungan DORS + DOKUMEN + MANUAL untuk satu LP. Sumber dokumen selalu read-only. */
    async listByLpAll(authUser, lpId) {
        await this.assertLpAccess(authUser, lpId);
        const dorsRows = await this.dataSource.query(`select t.id as row_id, upper(coalesce(t.keterlibatan,'-')) as keterlibatan, t.nama, t.nik, t.jenis_kelamin,
                    t.tempat_lahir, t.tgl_lahir, t.pekerjaan, t.alamat, t.no_hp
             from bdb_dors_lp_terlibat t
             join bdb_dors_lp d on d.id = t.lp_id
             join bdb_laporan_polisi lp0 on lp0.dors_lp_id = d.dors_lp_id and lp0.model_lp = d.model_lp
             where lp0.id = $1 and t.nama is not null
             order by t.id`, [lpId]);
        const dorsData = dorsRows.map((r) => ({ sumber: 'DORS', ...r, bap_tanggal: null, nomor_dokumen: null, tanggal_dokumen: null, lampiran_url: null, keterangan: null }));
        const documentRows = await this.dataSource.query(`with ${this.documentPartiesCte()}
             select (x.dokumen_id::text || ':' || x.urutan::text) as row_id,
                    x.keterlibatan,x.nama,x.nik,x.jenis_kelamin,x.tempat_lahir,x.tgl_lahir,
                    x.pekerjaan,x.alamat,x.no_hp,null::date as bap_tanggal,x.nomor_dokumen,
                    x.tanggal_dokumen,null::text as lampiran_url,
                    case when x.keterlibatan='DPO' then 'Penetapan DPO aktif' else 'Surat Ketetapan Penetapan Tersangka' end::text as keterangan,
                    false as can_edit,false as can_delete
             from document_parties x
             where x.lp_id=$1
             order by x.created_at desc,x.dokumen_id desc,x.urutan`, [lpId]);
        const documentData = documentRows.map((r) => ({ sumber: 'DOKUMEN', ...r }));
        const manual = await this.listByLp(authUser, lpId);
        return { data: [...dorsData, ...documentData, ...manual.data] };
    }
    async assertLpAccess(authUser, lpId) {
        const scope = await (0, scope_util_1.resolveScope)(this.dataSource, authUser?.id ? Number(authUser.id) : undefined);
        const lpRows = await this.dataSource.query('select id, satker_id, unit_satker_id, no_laporan from bdb_laporan_polisi where id=$1 and deleted_at is null', [lpId]);
        if (!lpRows.length)
            throw new common_1.NotFoundException('LP tidak ditemukan.');
        const lp = lpRows[0];
        await this.assertAccess(authUser, lp, scope);
        return lp;
    }
    async updateDors(authUser, rowId, dto) {
        const rows = await this.dataSource.query(`select t.id, lp0.id as lp_id, lp0.no_laporan
             from bdb_dors_lp_terlibat t
             join bdb_dors_lp d on d.id = t.lp_id
             join bdb_laporan_polisi lp0 on lp0.dors_lp_id = d.dors_lp_id and lp0.model_lp = d.model_lp
             where t.id = $1`, [rowId]);
        if (!rows.length)
            throw new common_1.NotFoundException('Data tidak ditemukan.');
        const row = rows[0];
        await this.assertLpAccess(authUser, Number(row.lp_id));
        const nama = this.toText(dto?.nama);
        if (!nama)
            throw new common_1.BadRequestException('Nama wajib diisi.');
        await this.dataSource.query(`update bdb_dors_lp_terlibat
             set nama=$2, nik=$3, keterlibatan=$4, jenis_kelamin=$5, tempat_lahir=$6, tgl_lahir=$7, pekerjaan=$8, alamat=$9, no_hp=$10
             where id=$1`, [
            rowId,
            nama,
            this.toText(dto?.nik),
            (this.toText(dto?.keterlibatan) || 'saksi').toLowerCase(),
            this.toText(dto?.jenis_kelamin),
            this.toText(dto?.tempat_lahir),
            this.toText(dto?.tgl_lahir),
            this.toText(dto?.pekerjaan),
            this.toText(dto?.alamat),
            this.toText(dto?.no_hp)
        ]);
        await this.audit.log({
            user: authUser,
            action: 'UPDATE',
            entity: 'pihak_terlibat_dors',
            entityId: rowId,
            meta: { lp_id: row.lp_id, no_laporan: row.no_laporan, nama }
        });
        return { status: 1, message: 'Data pihak terlibat (DORS) diperbarui.' };
    }
    async updateManual(authUser, rowId, dto, file) {
        const existingRows = await this.dataSource.query('select * from bdb_lp_pihak_manual where id=$1 and deleted_at is null', [rowId]);
        if (!existingRows.length)
            throw new common_1.NotFoundException('Data tidak ditemukan.');
        const existing = existingRows[0];
        const lp = await this.assertLpAccess(authUser, Number(existing.lp_id));
        const nama = this.toText(dto?.nama);
        if (!nama)
            throw new common_1.BadRequestException('Nama wajib diisi.');
        const keterlibatan = String(dto?.keterlibatan || existing.keterlibatan || '').trim().toUpperCase();
        if (!KETERLIBATAN_MANUAL.includes(keterlibatan)) {
            throw new common_1.BadRequestException(`Keterlibatan harus salah satu dari: ${KETERLIBATAN_MANUAL.join(', ')}.`);
        }
        const bapTanggal = this.toDate(dto?.bap_tanggal) || existing.bap_tanggal;
        const nomorDokumen = this.toText(dto?.nomor_dokumen) ?? existing.nomor_dokumen;
        const tanggalDokumen = this.toDate(dto?.tanggal_dokumen) || existing.tanggal_dokumen;
        const willHaveLampiran = !!file || !!existing.lampiran_object_key;
        if (keterlibatan === 'SAKSI') {
            if (!bapTanggal)
                throw new common_1.BadRequestException('Tanggal BAP wajib diisi untuk Saksi.');
            if (!willHaveLampiran)
                throw new common_1.BadRequestException('Lampiran BAP wajib diunggah untuk Saksi.');
        }
        else if (keterlibatan === 'TERSANGKA') {
            if (!nomorDokumen)
                throw new common_1.BadRequestException('Nomor surat penetapan tersangka wajib diisi.');
            if (!tanggalDokumen)
                throw new common_1.BadRequestException('Tanggal surat penetapan tersangka wajib diisi.');
            if (!willHaveLampiran)
                throw new common_1.BadRequestException('Lampiran surat penetapan tersangka wajib diunggah.');
        }
        let lampiran = null;
        if (file) {
            const key = await this.minio.upload(file, 'pihak-terlibat');
            lampiran = { key, name: file.originalname, type: file.mimetype, size: file.size };
            if (existing.lampiran_object_key) {
                try {
                    await this.minio.remove(existing.lampiran_object_key);
                }
                catch {
                    /* biarkan, jangan gagalkan update krn file lama tak terhapus */
                }
            }
        }
        await this.dataSource.query(`update bdb_lp_pihak_manual set
                keterlibatan=$2, nama=$3, nik=$4, jenis_kelamin=$5, tempat_lahir=$6, tgl_lahir=$7, pekerjaan=$8, alamat=$9, no_hp=$10,
                bap_tanggal=$11, nomor_dokumen=$12, tanggal_dokumen=$13, keterangan=$14, updated_at=now()
                ${lampiran ? ', lampiran_file_name=$15, lampiran_object_key=$16, lampiran_content_type=$17, lampiran_size=$18' : ''}
             where id=$1`, [
            rowId,
            keterlibatan,
            nama,
            this.toText(dto?.nik),
            this.toText(dto?.jenis_kelamin),
            this.toText(dto?.tempat_lahir),
            this.toText(dto?.tgl_lahir),
            this.toText(dto?.pekerjaan),
            this.toText(dto?.alamat),
            this.toText(dto?.no_hp),
            bapTanggal,
            nomorDokumen,
            tanggalDokumen,
            this.toText(dto?.keterangan),
            ...(lampiran ? [lampiran.name, lampiran.key, lampiran.type, lampiran.size] : [])
        ]);
        await this.audit.log({
            user: authUser,
            action: 'UPDATE',
            entity: 'pihak_terlibat_manual',
            entityId: rowId,
            meta: { lp_id: existing.lp_id, no_laporan: lp.no_laporan, nama, keterlibatan }
        });
        return this.detail(rowId);
    }
    async removeManual(authUser, id) {
        const roleBdb = String(authUser?.role_bdb || '').toLowerCase();
        if (!['superadmin', 'admin_binops'].includes(roleBdb)) {
            throw new common_1.ForbiddenException('Hanya superadmin/admin binops yang dapat menghapus entri pihak terlibat manual.');
        }
        const rows = await this.dataSource.query('select id, lp_id, nama, lampiran_object_key from bdb_lp_pihak_manual where id=$1 and deleted_at is null', [id]);
        if (!rows.length)
            throw new common_1.NotFoundException('Data tidak ditemukan.');
        await this.dataSource.query('update bdb_lp_pihak_manual set deleted_at = now() where id=$1', [id]);
        await this.audit.log({
            user: authUser,
            action: 'DELETE',
            entity: 'pihak_terlibat_manual',
            entityId: id,
            meta: { lp_id: rows[0].lp_id, nama: rows[0].nama }
        });
        return { status: 1, message: 'Pihak terlibat manual dihapus.' };
    }
};
exports.PihakTerlibatService = PihakTerlibatService;
exports.PihakTerlibatService = PihakTerlibatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_1.DataSource !== "undefined" && typeorm_1.DataSource) === "function" ? _a : Object, typeof (_b = typeof audit_service_1.AuditService !== "undefined" && audit_service_1.AuditService) === "function" ? _b : Object, typeof (_c = typeof minio_service_1.MinioService !== "undefined" && minio_service_1.MinioService) === "function" ? _c : Object])
], PihakTerlibatService);
