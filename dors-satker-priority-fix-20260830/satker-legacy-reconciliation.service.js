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
var SatkerLegacyReconciliationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SatkerLegacyReconciliationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const satker_service_1 = require("./satker.service");
const laporan_polisi_service_1 = require("../laporan-polisi/laporan-polisi.service");
const scope_util_1 = require("../common/scope.util");
const audit_service_1 = require("../audit/audit.service");
let SatkerLegacyReconciliationService = class SatkerLegacyReconciliationService {
    static { SatkerLegacyReconciliationService_1 = this; }
    dataSource;
    satkerService;
    laporanPolisiService;
    audit;
    logger = new common_1.Logger('SatkerLegacyReconciliationService');
    constructor(dataSource, satkerService, laporanPolisiService, audit) {
        this.dataSource = dataSource;
        this.satkerService = satkerService;
        this.laporanPolisiService = laporanPolisiService;
        this.audit = audit;
    }
    async ensureExtension() {
        await this.dataSource.query('create extension if not exists pg_trgm');
    }
    static LEVEL_SQL = `
        case
            when lower(coalesce(r.payload_json->'unit'->>'level',''))='polsek'
                 and jsonb_typeof(r.payload_json->'polsek')='object' then 'Polsek'
            when lower(coalesce(r.payload_json->'unit'->>'level',''))='polres'
                 and jsonb_typeof(r.payload_json->'polres')='object' then 'Polres'
            when lower(coalesce(r.payload_json->'unit'->>'level',''))='polda'
                 and jsonb_typeof(r.payload_json->'polda')='object'
                 and r.payload_json->'polda'->>'nama' ilike '%mabes%' then 'Mabes'
            when lower(coalesce(r.payload_json->'unit'->>'level',''))='polda'
                 and jsonb_typeof(r.payload_json->'polda')='object' then 'Polda'
            when jsonb_typeof(r.payload_json->'polsek')='object' then 'Polsek'
            when jsonb_typeof(r.payload_json->'polres')='object' then 'Polres'
            when jsonb_typeof(r.payload_json->'polda')='object'
                 and r.payload_json->'polda'->>'nama' ilike '%mabes%' then 'Mabes'
            when jsonb_typeof(r.payload_json->'polda')='object' then 'Polda'
            else 'Mabes'
        end`;
    static KP_SQL = `
        nullif(case
            when lower(coalesce(r.payload_json->'unit'->>'level',''))='polsek'
                 and jsonb_typeof(r.payload_json->'polsek')='object'
                 then r.payload_json->'polsek'->>'kode_pusiknas'
            when lower(coalesce(r.payload_json->'unit'->>'level',''))='polres'
                 and jsonb_typeof(r.payload_json->'polres')='object'
                 then r.payload_json->'polres'->>'kode_pusiknas'
            when lower(coalesce(r.payload_json->'unit'->>'level',''))='polda'
                 and jsonb_typeof(r.payload_json->'polda')='object'
                 then r.payload_json->'polda'->>'kode_pusiknas'
            when jsonb_typeof(r.payload_json->'polsek')='object'
                 then r.payload_json->'polsek'->>'kode_pusiknas'
            when jsonb_typeof(r.payload_json->'polres')='object'
                 then r.payload_json->'polres'->>'kode_pusiknas'
            when jsonb_typeof(r.payload_json->'polda')='object'
                 then r.payload_json->'polda'->>'kode_pusiknas'
        end, '')`;
    static DORS_KODE_SQL = `
        nullif(case
            when lower(coalesce(r.payload_json->'unit'->>'level',''))='polsek'
                 and jsonb_typeof(r.payload_json->'polsek')='object'
                 then r.payload_json->'polsek'->>'kode'
            when lower(coalesce(r.payload_json->'unit'->>'level',''))='polres'
                 and jsonb_typeof(r.payload_json->'polres')='object'
                 then r.payload_json->'polres'->>'kode'
            when lower(coalesce(r.payload_json->'unit'->>'level',''))='polda'
                 and jsonb_typeof(r.payload_json->'polda')='object'
                 then r.payload_json->'polda'->>'kode'
            when jsonb_typeof(r.payload_json->'polsek')='object'
                 then r.payload_json->'polsek'->>'kode'
            when jsonb_typeof(r.payload_json->'polres')='object'
                 then r.payload_json->'polres'->>'kode'
            when jsonb_typeof(r.payload_json->'polda')='object'
                 then r.payload_json->'polda'->>'kode'
        end, '')`;
    static NAMA_SQL = `
        case
            when lower(coalesce(r.payload_json->'unit'->>'level',''))='polsek'
                 and jsonb_typeof(r.payload_json->'polsek')='object'
                 then r.payload_json->'polsek'->>'nama'
            when lower(coalesce(r.payload_json->'unit'->>'level',''))='polres'
                 and jsonb_typeof(r.payload_json->'polres')='object'
                 then r.payload_json->'polres'->>'nama'
            when lower(coalesce(r.payload_json->'unit'->>'level',''))='polda'
                 and jsonb_typeof(r.payload_json->'polda')='object'
                 then r.payload_json->'polda'->>'nama'
            else coalesce(
                r.payload_json->'polsek'->>'nama',
                r.payload_json->'polres'->>'nama',
                r.payload_json->'polda'->>'nama'
            )
        end`;
    static PARENT_NAMA_SQL = `
        case
            when lower(coalesce(r.payload_json->'unit'->>'level',''))='polsek'
                 then r.payload_json->'polres'->>'nama'
            when lower(coalesce(r.payload_json->'unit'->>'level',''))='polres'
                 then r.payload_json->'polda'->>'nama'
            when lower(coalesce(r.payload_json->'unit'->>'level',''))='polda'
                 then null
            when jsonb_typeof(r.payload_json->'polsek')='object'
                 then r.payload_json->'polres'->>'nama'
            when jsonb_typeof(r.payload_json->'polres')='object'
                 then r.payload_json->'polda'->>'nama'
        end`;
    static normKode(expr) {
        return `regexp_replace(replace(coalesce((${expr}), ''), chr(160), ''), '\\s+', '', 'g')`;
    }
    unmappedCte() {
        return `
            select r.id as raw_id, r.dors_lp_id, r.model_lp, r.no_laporan, r.payload_json, r.data_scope, r.synced_at,
                   ${SatkerLegacyReconciliationService_1.LEVEL_SQL} as level,
                   ${SatkerLegacyReconciliationService_1.KP_SQL} as kode_pusiknas,
                   ${SatkerLegacyReconciliationService_1.DORS_KODE_SQL} as kode_dors,
                   ${SatkerLegacyReconciliationService_1.NAMA_SQL} as nama,
                   ${SatkerLegacyReconciliationService_1.PARENT_NAMA_SQL} as parent_nama
            from bdb_dors_raw_lp r
            where not exists (select 1 from bdb_laporan_polisi lp where lp.dors_lp_id = r.dors_lp_id and lp.model_lp = r.model_lp)
        `;
    }
    groupsCte() {
        return `
            with unmapped as (${this.unmappedCte()}),
            grouped as (
                select level, kode_pusiknas, nama,
                       count(*)::int as lp_terdampak,
                       (array_agg(no_laporan order by no_laporan))[1:5] as contoh_no_laporan,
                       (array_agg(dors_lp_id order by no_laporan))[1] as sample_dors_lp_id,
                       (array_agg(model_lp order by no_laporan))[1] as sample_model_lp,
                       (array_agg(parent_nama order by no_laporan))[1] as parent_nama,
                       (array_agg(kode_dors order by no_laporan))[1] as kode_dors
                from unmapped
                group by level, coalesce(kode_pusiknas, 'NOKODE:' || coalesce(nama, '')), nama, kode_pusiknas
            )
            select g.*, exact.id as exact_id, exact.kode as exact_kode, exact.deskripsi as exact_deskripsi,
                   nm.id as nama_id, nm.kode as nama_kode, nm.deskripsi as nama_deskripsi, nm.sim as nama_sim
            from grouped g
            left join lateral (
                select s.id, s.kode, s.deskripsi
                from bdb_satker s
                where lower(coalesce(s.tipe_satker,''))=lower(g.level)
                  and coalesce(s.is_synthetic,false)=false
                  and coalesce(s.kinerja_aktif,true)=true
                  and s.dors_mapping_aktif=true
                  and (
                      (g.kode_dors is not null
                       and ${SatkerLegacyReconciliationService_1.normKode('s.dors_kode')}=${SatkerLegacyReconciliationService_1.normKode('g.kode_dors')})
                      or (g.kode_pusiknas is not null
                          and ${SatkerLegacyReconciliationService_1.normKode('s.kode')} in (
                              ${SatkerLegacyReconciliationService_1.normKode('g.kode_pusiknas')},
                              ${SatkerLegacyReconciliationService_1.normKode(`regexp_replace(g.kode_pusiknas, '(\\.00)+$', '')`)}
                          ))
                  )
                order by
                    (g.kode_dors is not null
                     and ${SatkerLegacyReconciliationService_1.normKode('s.dors_kode')}=${SatkerLegacyReconciliationService_1.normKode('g.kode_dors')}) desc,
                    s.id
                limit 1
            ) exact on true
            left join lateral (
                select s.id, s.kode, s.deskripsi, similarity(upper(s.deskripsi), upper(g.nama)) as sim
                from bdb_satker s
                left join bdb_satker par on par.id = s.parent_id
                where exact.id is null and g.nama is not null and length(g.nama) >= 4
                  and upper(s.deskripsi) % upper(g.nama)
                  -- WAJIB induknya jg mirip (kalau DORS punya info induk) -- cegah kandidat senama
                  -- tapi beda provinsi/polres (mis. "Polsek Grogol" di Jakbar vs di Kediri) ikut
                  -- disodorkan cuma krn nama daunnya kebetulan mirip.
                  and (g.parent_nama is null or par.deskripsi is null or similarity(upper(par.deskripsi), upper(g.parent_nama)) >= 0.35)
                -- alias "sim" tak bisa dipakai dlm ekspresi majemuk di ORDER BY (Postgres cuma
                -- izinkan alias polos) -- ulangi ekspresinya, bukan pakai aliasnya.
                order by similarity(upper(s.deskripsi), upper(g.nama)) + coalesce(similarity(upper(par.deskripsi), upper(g.parent_nama)), 0) desc
                limit 1
            ) nm on true
        `;
    }
    async stats() {
        try {
            await this.ensureExtension();
            await this.dataSource.query('select set_limit(0.5)');
            const rows = await this.dataSource.query(`
                with g as (${this.groupsCte()})
                select level,
                       count(*)::int as grup,
                       sum(lp_terdampak)::int as lp_terdampak,
                       count(*) filter (where exact_id is not null)::int as grup_cocok
                from g group by level order by level
            `);
            const totalLp = await this.dataSource.query(`
                select count(*)::int as c from bdb_dors_raw_lp r
                where not exists (select 1 from bdb_laporan_polisi lp where lp.dors_lp_id = r.dors_lp_id and lp.model_lp = r.model_lp)
            `);
            return { status: 1, data: { per_level: rows, total_lp_belum_termapping: totalLp[0]?.c || 0 } };
        }
        catch (e) {
            this.logger.error(`stats() gagal: ${e?.message || e}`);
            throw e;
        }
    }
    async list(opts) {
        try {
            await this.ensureExtension();
            await this.dataSource.query('select set_limit(0.5)');
            const page = Math.max(opts.page || 1, 1);
            const row = Math.min(Math.max(opts.row || 25, 1), 1000);
            const offset = (page - 1) * row;
            const whereClauses = [];
            const params = [];
            if (opts.level) {
                params.push(opts.level);
                whereClauses.push(`level = $${params.length}`);
            }
            if (opts.search) {
                params.push(`%${opts.search.toUpperCase()}%`);
                whereClauses.push(`(upper(coalesce(nama,'')) like $${params.length} or upper(coalesce(kode_pusiknas,'')) like $${params.length})`);
            }
            if (opts.onlyUnmatched) {
                whereClauses.push(`exact_id is null`);
            }
            const where = whereClauses.length ? `where ${whereClauses.join(' and ')}` : '';
            const rows = await this.dataSource.query(`
                with g as (${this.groupsCte()})
                select * from g
                ${where}
                order by lp_terdampak desc, level, nama
                limit ${row} offset ${offset}
                `, params);
            const countRes = await this.dataSource.query(`with g as (${this.groupsCte()}) select count(*)::int as c from g ${where}`, params);
            return {
                status: 1,
                data: rows.map((r) => ({
                    level: r.level,
                    kode_pusiknas: r.kode_pusiknas,
                    nama: r.nama,
                    lp_terdampak: r.lp_terdampak,
                    contoh_no_laporan: r.contoh_no_laporan || [],
                    match: r.exact_id != null
                        ? { tipe: 'kode', id: Number(r.exact_id), kode: r.exact_kode, deskripsi: r.exact_deskripsi }
                        : r.nama_id != null
                            ? { tipe: 'nama', id: Number(r.nama_id), kode: r.nama_kode, deskripsi: r.nama_deskripsi, kemiripan: Number(r.nama_sim) }
                            : null,
                })),
                total: countRes[0]?.c || 0,
                page,
                row,
            };
        }
        catch (e) {
            this.logger.error(`list() gagal: ${e?.message || e}`);
            throw e;
        }
    }
    async deleteAllUnmapped(opts, userId) {
        await this.ensureExtension();
        const scope = await (0, scope_util_1.resolveScope)(this.dataSource, userId);
        if (!scope.isSuper) {
            throw new common_1.ForbiddenException('Hanya superadmin yang dapat menghapus data LP tanpa satker.');
        }
        await this.dataSource.query('select set_limit(0.5)');
        const whereClauses = [];
        const params = [];
        if (opts.level) {
            params.push(opts.level);
            whereClauses.push(`level = $${params.length}`);
        }
        if (opts.search) {
            params.push(`%${opts.search.toUpperCase()}%`);
            whereClauses.push(`(upper(coalesce(nama,'')) like $${params.length} or upper(coalesce(kode_pusiknas,'')) like $${params.length})`);
        }
        if (opts.onlyUnmatched) {
            whereClauses.push(`exact_id is null`);
        }
        const where = whereClauses.length ? `where ${whereClauses.join(' and ')}` : '';
        const ret = await this.dataSource.query(`
            with g as (${this.groupsCte()}),
            target_groups as (select level, kode_pusiknas, nama from g ${where}),
            unmapped as (${this.unmappedCte()})
            delete from bdb_dors_raw_lp
            where id in (
                select u.raw_id from unmapped u
                join target_groups tg on tg.level = u.level
                    and coalesce(tg.kode_pusiknas, 'NOKODE:' || coalesce(tg.nama, '')) = coalesce(u.kode_pusiknas, 'NOKODE:' || coalesce(u.nama, ''))
            )
            returning id
            `, params);
        const deleted = Array.isArray(ret?.[0]) ? ret[0].length : 0;
        let userNama = null;
        if (userId) {
            const u = await this.dataSource.query('select name from auth_users where id=$1', [userId]);
            userNama = u[0]?.name || null;
        }
        await this.audit.log({
            userId,
            userName: userNama || undefined,
            action: 'DELETE_ALL_SATKER_LEGACY',
            entity: 'dors_raw_lp',
            meta: { deleted, level: opts.level || null, search: opts.search || null, only_unmatched: !!opts.onlyUnmatched }
        });
        return { status: 1, data: { deleted }, message: `${deleted} data LP tanpa satker dihapus.` };
    }
    static normUnit(expr) {
        return `upper(regexp_replace(coalesce((${expr}), ''), '[^A-Za-z0-9]', '', 'g'))`;
    }
    async groupRawRowsAll(level, kodePusiknas, nama, unitNama) {
        const params = [level];
        const conds = ['lower(rs.level) = lower($1)'];

        if (kodePusiknas) {
            params.push(kodePusiknas);
            conds.push(`rs.kode_pusiknas = $${params.length}`);
        }
        else {
            conds.push('rs.kode_pusiknas is null');
        }

        if (nama) {
            params.push(nama);
            conds.push(`lower(coalesce(rs.nama,'')) = lower($${params.length})`);
        }

        if (unitNama) {
            params.push(unitNama);
            conds.push(`${SatkerLegacyReconciliationService_1.normUnit("rs.payload_json->'unit'->>'unit'")} = ${SatkerLegacyReconciliationService_1.normUnit(`$${params.length}`)}`);
        }

        return this.dataSource.query(`
            with raw_scope as (
                select r.id as raw_id,
                       r.dors_lp_id,
                       r.model_lp,
                       r.no_laporan,
                       r.payload_json,
                       r.data_scope,
                       r.synced_at,
                       ${SatkerLegacyReconciliationService_1.LEVEL_SQL} as level,
                       ${SatkerLegacyReconciliationService_1.KP_SQL} as kode_pusiknas,
                       ${SatkerLegacyReconciliationService_1.NAMA_SQL} as nama,
                       ${SatkerLegacyReconciliationService_1.PARENT_NAMA_SQL} as parent_nama
                from bdb_dors_raw_lp r
            )
            select rs.*,
                   lp.id as lp_id,
                   lp.satker_id as current_satker_id,
                   lp.satker_nama as current_satker_nama,
                   lp.unit_satker_id as current_unit_satker_id,
                   lp.unit_satker_nama as current_unit_satker_nama,
                   lp.deleted_at,
                   coalesce(lp.sudah_dilimpahkan,false) as sudah_dilimpahkan,
                   coalesce(lp.dilimpahkan_eksternal,false) as dilimpahkan_eksternal,
                   case
                     when lp.id is null then false
                     else exists (
                       select 1
                       from bdb_lp_pelimpahan ph
                       where ph.lp_id = lp.id
                     )
                   end as punya_riwayat_pelimpahan
            from raw_scope rs
            left join bdb_laporan_polisi lp
              on lp.dors_lp_id = rs.dors_lp_id
             and lp.model_lp = rs.model_lp
            where ${conds.join(' and ')}
            order by rs.no_laporan
        `, params);
    }

    async reconcileExistingCandidates(opts) {
        const search = String(opts?.search || '').trim();
        const level = String(opts?.level || '').trim();

        if (search.length < 3) {
            throw new common_1.BadRequestException(
                'Pencarian kandidat reconcile minimal 3 karakter.'
            );
        }

        const page = Math.max(Number(opts?.page) || 1, 1);
        const row = Math.min(Math.max(Number(opts?.row) || 25, 1), 100);
        const offset = (page - 1) * row;

        const params = [`%${search.toUpperCase()}%`];
        let levelCond = '';

        if (level) {
            params.push(level);
            levelCond = `and lower(rs.level) = lower($${params.length})`;
        }

        params.push(row + 1);
        const limitParam = `$${params.length}`;

        params.push(offset);
        const offsetParam = `$${params.length}`;

        const rows = await this.dataSource.query(`
            with raw_scope as (
                select
                    r.dors_lp_id,
                    r.model_lp,
                    r.no_laporan,
                    r.payload_json,
                    ${SatkerLegacyReconciliationService_1.LEVEL_SQL} as level,
                    ${SatkerLegacyReconciliationService_1.KP_SQL} as kode_pusiknas,
                    ${SatkerLegacyReconciliationService_1.NAMA_SQL} as nama,
                    ${SatkerLegacyReconciliationService_1.PARENT_NAMA_SQL} as parent_nama,
                    r.payload_json->'unit'->>'unit' as unit_nama,
                    ${SatkerLegacyReconciliationService_1.normUnit("r.payload_json->'unit'->>'unit'")} as unit_key
                from bdb_dors_raw_lp r
            ),
            scoped as (
                select
                    rs.*,
                    lp.id as lp_id,
                    lp.satker_id,
                    lp.satker_nama,
                    lp.unit_satker_id,
                    lp.unit_satker_nama,
                    lp.deleted_at,
                    coalesce(lp.sudah_dilimpahkan,false) as sudah_dilimpahkan,
                    coalesce(lp.dilimpahkan_eksternal,false) as dilimpahkan_eksternal,
                    exists (
                        select 1
                        from bdb_lp_pelimpahan ph
                        where ph.lp_id = lp.id
                    ) as punya_riwayat_pelimpahan,
                    case
                        when lp.unit_satker_id is not null
                            then coalesce(us.dors_mapping_aktif,false)
                        when lp.satker_id is not null
                            then coalesce(ss.dors_mapping_aktif,false)
                        else false
                    end as current_mapping_aktif
                from raw_scope rs
                join bdb_laporan_polisi lp
                  on lp.dors_lp_id = rs.dors_lp_id
                 and lp.model_lp = rs.model_lp
                left join bdb_satker ss
                  on ss.id = lp.satker_id
                left join bdb_satker us
                  on us.id = lp.unit_satker_id
                where rs.kode_pusiknas is not null
                  and rs.unit_key <> ''
                  and (
                       upper(coalesce(rs.nama,'')) like $1
                    or upper(coalesce(rs.kode_pusiknas,'')) like $1
                    or upper(coalesce(rs.parent_nama,'')) like $1
                    or upper(coalesce(rs.unit_nama,'')) like $1
                  )
                  ${levelCond}
            ),
            grouped as (
                select
                    min(level) as level,
                    kode_pusiknas,
                    min(nama) as nama,
                    min(parent_nama) as parent_nama,
                    min(unit_nama) as unit_nama,
                    unit_key,

                    count(*)::int as total_existing,

                    count(*) filter (
                        where deleted_at is not null
                    )::int as terhapus,

                    count(*) filter (
                        where deleted_at is null
                          and (
                               sudah_dilimpahkan
                            or dilimpahkan_eksternal
                            or punya_riwayat_pelimpahan
                          )
                    )::int as protected_pelimpahan,

                    count(*) filter (
                        where deleted_at is null
                          and not sudah_dilimpahkan
                          and not dilimpahkan_eksternal
                          and not punya_riwayat_pelimpahan
                    )::int as actionable,

                    count(distinct (satker_id, unit_satker_id)) filter (
                        where deleted_at is null
                          and not sudah_dilimpahkan
                          and not dilimpahkan_eksternal
                          and not punya_riwayat_pelimpahan
                    )::int as posisi_actionable,

                    bool_or(not current_mapping_aktif) filter (
                        where deleted_at is null
                          and not sudah_dilimpahkan
                          and not dilimpahkan_eksternal
                          and not punya_riwayat_pelimpahan
                    ) as ada_posisi_nonaktif,

                    (array_agg(no_laporan order by no_laporan) filter (
                        where deleted_at is null
                          and not sudah_dilimpahkan
                          and not dilimpahkan_eksternal
                          and not punya_riwayat_pelimpahan
                    ))[1:5] as contoh_no_laporan

                from scoped

                group by
                    lower(level),
                    kode_pusiknas,
                    lower(coalesce(nama,'')),
                    lower(coalesce(parent_nama,'')),
                    unit_key
            )
            select *
            from grouped
            where actionable > 0
              and (
                   posisi_actionable > 1
                or coalesce(ada_posisi_nonaktif,false)
              )
            order by actionable desc, level, nama, unit_nama
            limit ${limitParam}
            offset ${offsetParam}
        `, params);

        const hasMore = rows.length > row;
        const data = hasMore ? rows.slice(0, row) : rows;

        return {
            status: 1,
            data: data.map((r) => ({
                level: r.level,
                kode_pusiknas: r.kode_pusiknas,
                nama: r.nama,
                parent_nama: r.parent_nama,
                unit_nama: r.unit_nama,
                total_existing: Number(r.total_existing || 0),
                actionable: Number(r.actionable || 0),
                protected_pelimpahan: Number(r.protected_pelimpahan || 0),
                terhapus: Number(r.terhapus || 0),
                posisi_actionable: Number(r.posisi_actionable || 0),
                ada_posisi_nonaktif: !!r.ada_posisi_nonaktif,
                contoh_no_laporan: r.contoh_no_laporan || []
            })),
            page,
            row,
            has_more: hasMore
        };
    }

    async previewReconcileExisting(level, kodePusiknas, nama, satkerId, unitNama) {
        const targetId = Number(satkerId);

        if (!Number.isFinite(targetId) || targetId <= 0) {
            throw new common_1.BadRequestException('Satker tujuan tidak valid.');
        }

        const targetRows = await this.dataSource.query(
            `select id, deskripsi, dors_mapping_aktif
             from bdb_satker
             where id=$1
             limit 1`,
            [targetId]
        );

        if (!targetRows.length) {
            throw new common_1.BadRequestException('Satker tujuan tidak ditemukan.');
        }

        if (!targetRows[0].dors_mapping_aktif) {
            throw new common_1.BadRequestException('Satker tujuan tidak aktif untuk mapping DORS.');
        }

        const placement =
            await this.laporanPolisiService.resolveSatkerPlacement(targetId);

        const rows =
            await this.groupRawRowsAll(
                level,
                kodePusiknas,
                nama,
                unitNama
            );

        if (!rows.length) {
            throw new common_1.BadRequestException(
                'Identitas DORS ini tidak ditemukan.'
            );
        }

        const result = {
            total_raw: 0,
            belum_termapping: 0,
            existing: 0,
            terhapus: 0,
            protected_pelimpahan: 0,
            sudah_di_target: 0,
            perlu_reconcile: 0,
        };

        const positions = new Map();

        const targetSatkerId = Number(placement.satker.id);
        const targetUnitId =
            placement.unit?.id == null
                ? null
                : Number(placement.unit.id);

        for (const r of rows) {
            result.total_raw++;

            if (!r.lp_id) {
                result.belum_termapping++;
                continue;
            }

            result.existing++;

            const currentSatkerId =
                r.current_satker_id == null
                    ? null
                    : Number(r.current_satker_id);

            const currentUnitId =
                r.current_unit_satker_id == null
                    ? null
                    : Number(r.current_unit_satker_id);

            const protectedPelimpahan =
                !!r.sudah_dilimpahkan ||
                !!r.dilimpahkan_eksternal ||
                !!r.punya_riwayat_pelimpahan;

            const sameTarget =
                currentSatkerId === targetSatkerId &&
                currentUnitId === targetUnitId;

            let klasifikasi;

            if (r.deleted_at) {
                result.terhapus++;
                klasifikasi = 'TERHAPUS';
            }
            else if (protectedPelimpahan) {
                result.protected_pelimpahan++;
                klasifikasi = 'PROTECTED_PELIMPAHAN';
            }
            else if (sameTarget) {
                result.sudah_di_target++;
                klasifikasi = 'SUDAH_DI_TARGET';
            }
            else {
                result.perlu_reconcile++;
                klasifikasi = 'PERLU_RECONCILE';
            }

            const key =
                `${currentSatkerId || ''}|${currentUnitId || ''}|${klasifikasi}`;

            if (!positions.has(key)) {
                positions.set(key, {
                    satker_id: currentSatkerId,
                    satker_nama: r.current_satker_nama || null,
                    unit_satker_id: currentUnitId,
                    unit_satker_nama: r.current_unit_satker_nama || null,
                    klasifikasi,
                    jumlah: 0,
                    contoh_no_laporan: [],
                });
            }

            const p = positions.get(key);
            p.jumlah++;

            if (p.contoh_no_laporan.length < 5 && r.no_laporan) {
                p.contoh_no_laporan.push(r.no_laporan);
            }
        }

        return {
            status: 1,
            data: {
                identity: {
                    level,
                    kode_pusiknas: kodePusiknas || null,
                    nama: nama || null,
                    unit_nama: unitNama || null,
                },
                target: {
                    satker_id: placement.satker.id,
                    satker_nama: placement.satker.deskripsi,
                    unit_satker_id: placement.unit?.id ?? null,
                    unit_satker_nama: placement.unit?.deskripsi ?? null,
                },
                summary: result,
                current_positions: Array.from(positions.values()),
            },
            message: 'Preview reconcile berhasil. Tidak ada data LP yang diubah.',
        };
    }

    async reconcileExisting(level, kodePusiknas, nama, satkerId, unitNama, expectedReconcile, sourceSatkerId, sourceUnitSatkerId, userId) {
        const targetId = Number(satkerId);
        const expected = Number(expectedReconcile);
        const sourceId = Number(sourceSatkerId);
        const sourceUnitId =
            sourceUnitSatkerId == null
                ? null
                : Number(sourceUnitSatkerId);
        const actorUserId = Number(userId);

        if (!level || !kodePusiknas || !nama || !unitNama) {
            throw new common_1.BadRequestException(
                'Reconcile existing wajib memakai exact level + kode Pusiknas + nama + unit.'
            );
        }

        if (!Number.isFinite(targetId) || targetId <= 0) {
            throw new common_1.BadRequestException('Satker tujuan tidak valid.');
        }

        if (!Number.isInteger(expected) || expected <= 0) {
            throw new common_1.BadRequestException(
                'expected_reconcile wajib berupa angka bulat lebih dari 0.'
            );
        }

        if (!Number.isFinite(sourceId) || sourceId <= 0) {
            throw new common_1.BadRequestException(
                'source_satker_id wajib diisi.'
            );
        }

        if (
            sourceUnitId !== null &&
            (!Number.isFinite(sourceUnitId) || sourceUnitId <= 0)
        ) {
            throw new common_1.BadRequestException(
                'source_unit_satker_id tidak valid.'
            );
        }

        if (!Number.isInteger(actorUserId) || actorUserId <= 0) {
            throw new common_1.ForbiddenException(
                'Identitas superadmin tidak valid.'
            );
        }

        const targetRows = await this.dataSource.query(
            `select id, deskripsi, dors_mapping_aktif
             from bdb_satker
             where id=$1
             limit 1`,
            [targetId]
        );

        if (!targetRows.length) {
            throw new common_1.BadRequestException(
                'Satker tujuan tidak ditemukan.'
            );
        }

        if (!targetRows[0].dors_mapping_aktif) {
            throw new common_1.BadRequestException(
                'Satker tujuan tidak aktif untuk mapping DORS.'
            );
        }

        const placement =
            await this.laporanPolisiService.resolveSatkerPlacement(targetId);

        if (!placement.unit) {
            throw new common_1.BadRequestException(
                'Reconcile unit wajib memilih node unit tujuan.'
            );
        }

        await this.laporanPolisiService.ensureAliasTable();

        const targetSatkerId = Number(placement.satker.id);
        const targetUnitId = Number(placement.unit.id);
        const selectedId = Number(placement.selected.id);

        if (
            sourceId === targetSatkerId &&
            sourceUnitId === targetUnitId
        ) {
            throw new common_1.BadRequestException(
                'Posisi sumber sama dengan posisi tujuan.'
            );
        }

        const rawScopeCte = `
            with raw_scope as (
                select r.id as raw_id,
                       r.dors_lp_id,
                       r.model_lp,
                       r.no_laporan,
                       r.payload_json,
                       r.data_scope,
                       r.synced_at,
                       ${SatkerLegacyReconciliationService_1.LEVEL_SQL} as level,
                       ${SatkerLegacyReconciliationService_1.KP_SQL} as kode_pusiknas,
                       ${SatkerLegacyReconciliationService_1.NAMA_SQL} as nama,
                       ${SatkerLegacyReconciliationService_1.PARENT_NAMA_SQL} as parent_nama
                from bdb_dors_raw_lp r
            )
        `;

        const scopeWhere = `
            lower(rs.level) = lower($1)
            and rs.kode_pusiknas = $2
            and lower(coalesce(rs.nama,'')) = lower($3)
            and ${SatkerLegacyReconciliationService_1.normUnit("rs.payload_json->'unit'->>'unit'")}
                = ${SatkerLegacyReconciliationService_1.normUnit("$4")}
        `;

        const scopeParams = [
            level,
            kodePusiknas,
            nama,
            unitNama
        ];

        const runner = this.dataSource.createQueryRunner();

        await runner.connect();
        await runner.startTransaction();

        try {
            const lockedTarget = await runner.query(
                `select id, dors_mapping_aktif
                 from bdb_satker
                 where id=$1
                 for share`,
                [targetId]
            );

            if (
                !lockedTarget.length ||
                !lockedTarget[0].dors_mapping_aktif
            ) {
                throw new common_1.BadRequestException(
                    'Satker tujuan berubah/tidak aktif. Reconcile dibatalkan.'
                );
            }

            const lockedSource = await runner.query(
                `select id, deskripsi
                 from bdb_satker
                 where id=$1
                 for share`,
                [sourceId]
            );

            if (!lockedSource.length) {
                throw new common_1.BadRequestException(
                    'Satker sumber tidak ditemukan.'
                );
            }

            const actorRows = await runner.query(
                `select id, name, role_bdb, role_name
                 from auth_users
                 where id=$1
                 for share`,
                [actorUserId]
            );

            if (!actorRows.length) {
                throw new common_1.ForbiddenException(
                    'User pelaksana tidak ditemukan.'
                );
            }

            const actorRole = String(
                actorRows[0].role_bdb ||
                actorRows[0].role_name ||
                ''
            ).trim().toLowerCase();

            if (actorRole !== 'superadmin') {
                throw new common_1.ForbiddenException(
                    'Hak Superadmin berubah/tidak valid. Reconcile dibatalkan.'
                );
            }

            const actorName = actorRows[0].name || null;

            const parentRows = await runner.query(
                `${rawScopeCte}
                 select distinct nullif(trim(rs.parent_nama),'') as parent_nama
                 from raw_scope rs
                 where ${scopeWhere}
                 order by 1`,
                scopeParams
            );

            const parents = parentRows
                .map((r) => String(r.parent_nama || '').trim())
                .filter(Boolean);

            if (parents.length > 1) {
                throw new common_1.BadRequestException(
                    'Identitas DORS mempunyai lebih dari satu parent. Reconcile dibatalkan.'
                );
            }

            const parentNama = parents[0] || null;

            const rows = await runner.query(
                `${rawScopeCte}
                 select lp.id,
                        lp.no_laporan,
                        lp.satker_id,
                        lp.satker_nama,
                        lp.unit_satker_id,
                        lp.unit_satker_nama
                 from raw_scope rs
                 join bdb_laporan_polisi lp
                   on lp.dors_lp_id = rs.dors_lp_id
                  and lp.model_lp = rs.model_lp
                 where ${scopeWhere}
                   and lp.deleted_at is null
                   and not coalesce(lp.sudah_dilimpahkan,false)
                   and not coalesce(lp.dilimpahkan_eksternal,false)
                   and not exists (
                       select 1
                       from bdb_lp_pelimpahan ph
                       where ph.lp_id = lp.id
                   )
                   and lp.satker_id = $5
                   and lp.unit_satker_id is not distinct from $6::bigint
                 order by lp.id
                 for update of lp`,
                [
                    ...scopeParams,
                    sourceId,
                    sourceUnitId
                ]
            );

            const rowMap = new Map();

            for (const r of rows) {
                const id = Number(r.id);

                if (Number.isFinite(id) && !rowMap.has(id)) {
                    rowMap.set(id, r);
                }
            }

            const reconcileRows =
                Array.from(rowMap.values());

            const ids =
                reconcileRows.map((r) => Number(r.id));

            if (ids.length !== expected) {
                throw new common_1.BadRequestException(
                    `Jumlah PERLU_RECONCILE berubah. Expected ${expected}, aktual ${ids.length}. Tidak ada data diubah.`
                );
            }

            const conflictingAliases = await runner.query(
                `select a.id, a.satker_id, a.satker_nama
                 from bdb_dors_satker_map a
                 join bdb_satker s
                   on s.id=a.satker_id
                  and s.dors_mapping_aktif=true
                 where a.unit_nama is not null
                   and a.dors_kode_pusiknas is not null
                   and upper(regexp_replace(a.dors_kode_pusiknas,'[^A-Za-z0-9]','','g'))
                       = upper(regexp_replace($1,'[^A-Za-z0-9]','','g'))
                   and upper(regexp_replace(a.unit_nama,'[^A-Za-z0-9]','','g'))
                       = upper(regexp_replace($2,'[^A-Za-z0-9]','','g'))
                   and a.satker_id <> $3
                 order by a.id
                 for update of a`,
                [
                    kodePusiknas,
                    unitNama,
                    selectedId
                ]
            );

            if (conflictingAliases.length) {
                throw new common_1.BadRequestException(
                    `Ada alias unit aktif menuju satker lain (alias id ${conflictingAliases[0].id}). Reconcile dibatalkan.`
                );
            }

            const updated = await runner.query(
                `update bdb_laporan_polisi lp
                 set satker_id=$2,
                     satker_nama=$3,
                     unit_satker_id=$4,
                     unit_satker_nama=$5,
                     unit_satker_kode=$6,
                     updated_at=now()
                 where lp.id = any($1::bigint[])
                   and lp.deleted_at is null
                   and not coalesce(lp.sudah_dilimpahkan,false)
                   and not coalesce(lp.dilimpahkan_eksternal,false)
                   and not exists (
                       select 1
                       from bdb_lp_pelimpahan ph
                       where ph.lp_id = lp.id
                   )
                   and lp.satker_id=$7
                   and lp.unit_satker_id is not distinct from $8::bigint
                 returning lp.id`,
                [
                    ids,
                    targetSatkerId,
                    placement.satker.deskripsi,
                    targetUnitId,
                    placement.unit.deskripsi,
                    placement.unit.kode ?? null,
                    sourceId,
                    sourceUnitId
                ]
            );

            const updatedRows =
                Array.isArray(updated) && Array.isArray(updated[0])
                    ? updated[0]
                    : Array.isArray(updated)
                        ? updated
                        : [];

            const updatedCount =
                Array.isArray(updated) &&
                Array.isArray(updated[0]) &&
                Number.isFinite(Number(updated[1]))
                    ? Number(updated[1])
                    : updatedRows.length;

            if (
                updatedCount !== expected ||
                updatedRows.length !== expected
            ) {
                throw new common_1.BadRequestException(
                    `Jumlah UPDATE tidak sesuai. Expected ${expected}, affected ${updatedCount}, returning ${updatedRows.length}. Reconcile di-rollback.`
                );
            }

            const auditPayload =
                reconcileRows.map((r) => ({
                    id: String(r.id),
                    meta: {
                        no_laporan: r.no_laporan || null,

                        satker_lama_id:
                            r.satker_id ?? null,
                        satker_lama_nama:
                            r.satker_nama || null,

                        unit_satker_lama_id:
                            r.unit_satker_id ?? null,
                        unit_satker_lama_nama:
                            r.unit_satker_nama || null,

                        satker_baru_id:
                            placement.satker.id,
                        satker_baru_nama:
                            placement.satker.deskripsi,

                        unit_satker_baru_id:
                            placement.unit.id,
                        unit_satker_baru_nama:
                            placement.unit.deskripsi,

                        satker_dipilih_id:
                            placement.selected.id,
                        satker_dipilih_nama:
                            placement.selected.deskripsi,

                        reconcile_existing: true,

                        dors_identity: {
                            level,
                            kode_pusiknas: kodePusiknas,
                            nama,
                            unit_nama: unitNama
                        },

                        source_satker_expected_id:
                            sourceId,

                        source_unit_satker_expected_id:
                            sourceUnitId,

                        keterangan:
                            'Reconcile existing berdasarkan identitas DORS exact'
                    }
                }));

            const auditInserted = await runner.query(
                `insert into bdb_audit_log
                    (user_id,
                     user_nama,
                     action,
                     entity,
                     entity_id,
                     meta,
                     ip,
                     outcome)
                 select $1::bigint,
                        $2::text,
                        'CORRECT_SATKER',
                        'laporan_polisi',
                        x->>'id',
                        x->'meta',
                        null,
                        'SUCCESS'
                 from jsonb_array_elements($3::jsonb) as x
                 returning id`,
                [
                    actorUserId,
                    actorName,
                    JSON.stringify(auditPayload)
                ]
            );

            const auditCount =
                Array.isArray(auditInserted)
                    ? auditInserted.length
                    : 0;

            if (auditCount !== expected) {
                throw new common_1.BadRequestException(
                    `Jumlah AUDIT tidak sesuai. Expected ${expected}, aktual ${auditCount}. Reconcile di-rollback.`
                );
            }

            await runner.query(
                `insert into bdb_dors_satker_map
                    (dors_kode_pusiknas,
                     dors_nama,
                     dors_parent_nama,
                     unit_nama,
                     satker_id,
                     satker_nama,
                     catatan)
                 values ($1,$2,$3,$4,$5,$6,'reconcile existing')
                 on conflict (
                     coalesce(dors_kode_pusiknas,''),
                     lower(dors_nama),
                     lower(coalesce(dors_parent_nama,'')),
                     lower(coalesce(unit_nama,''))
                 )
                 do update
                    set satker_id=excluded.satker_id,
                        satker_nama=excluded.satker_nama,
                        catatan='reconcile existing',
                        updated_at=now()`,
                [
                    kodePusiknas,
                    nama,
                    parentNama,
                    unitNama,
                    selectedId,
                    placement.selected.deskripsi
                ]
            );

            await runner.commitTransaction();

            this.logger.log(
                `Reconcile existing: ${updatedCount} LP ${nama} / ${unitNama} dari satker ${sourceId} -> ${placement.selected.deskripsi}`
            );

            return {
                status: 1,
                data: {
                    identity: {
                        level,
                        kode_pusiknas: kodePusiknas,
                        nama,
                        unit_nama: unitNama
                    },
                    source: {
                        satker_id: sourceId,
                        satker_nama:
                            lockedSource[0].deskripsi,
                        unit_satker_id:
                            sourceUnitId
                    },
                    target: {
                        satker_id:
                            placement.satker.id,
                        satker_nama:
                            placement.satker.deskripsi,
                        unit_satker_id:
                            placement.unit.id,
                        unit_satker_nama:
                            placement.unit.deskripsi
                    },
                    reconciled: updatedCount,
                    audited: auditCount,
                    expected_reconcile: expected,
                    alias_target_id: selectedId
                },
                message:
                    `${updatedCount} LP berhasil direconcile secara transaksional.`
            };
        }
        catch (error) {
            await runner.rollbackTransaction();
            throw error;
        }
        finally {
            await runner.release();
        }
    }

    async groupRawRows(level, kodePusiknas, nama, unitNama) {
        const params = [level];
        let cond;
        if (kodePusiknas) {
            params.push(kodePusiknas);
            cond = `kode_pusiknas = $2`;
        }
        else {
            params.push(nama || '');
            cond = `kode_pusiknas is null and coalesce(nama,'') = $2`;
        }
        let unitCond = '';
        if (unitNama) {
            params.push(unitNama);
            unitCond = `and ${SatkerLegacyReconciliationService_1.normUnit('payload_json->\'unit\'->>\'unit\'')} = ${SatkerLegacyReconciliationService_1.normUnit(`$${params.length}`)}`;
        }
        return this.dataSource.query(`
            with unmapped as (${this.unmappedCte()})
            select * from unmapped where level = $1 and ${cond} ${unitCond}
            order by no_laporan
            `, params);
    }
    async groupDetail(level, kodePusiknas, nama) {
        const rows = await this.groupRawRows(level, kodePusiknas, nama);
        return {
            status: 1,
            data: rows.map((r) => {
                const p = r.payload_json || {};
                return {
                    raw_id: r.raw_id,
                    dors_lp_id: r.dors_lp_id,
                    model_lp: r.model_lp,
                    no_laporan: r.no_laporan,
                    tgl_laporan: p.tgl_laporan || null,
                    kategori: p.kategori || null,
                    tempat_kejadian: p.tempat_kejadian || null,
                    uraian_singkat: p.uraian_singkat_kejadian || p.uraian_kejadian || null,
                    unit_nama: p.unit?.unit || null,
                    unit_level: p.unit?.level || null,
                    polda_nama: p.polda?.nama || null,
                    polda_kp: p.polda?.kode_pusiknas || null,
                    polres_nama: p.polres?.nama || null,
                    polres_kp: p.polres?.kode_pusiknas || null,
                    polsek_nama: p.polsek?.nama || null,
                    polsek_kp: p.polsek?.kode_pusiknas || null,
                    data_scope: r.data_scope || null,
                    synced_at: r.synced_at || null,
                    payload_json: p,
                };
            }),
        };
    }
    async previewAddToTree(level, kodePusiknas, nama, unitNama) {
        const rows = await this.groupRawRows(level, kodePusiknas, nama, unitNama);
        if (!rows.length)
            throw new common_1.BadRequestException('Grup LP ini tidak ditemukan (mungkin sudah termapping).');
        let parentPreview = null;
        if (kodePusiknas) {
            const segs = kodePusiknas.split('.');
            for (let cut = segs.length - 1; cut >= 1 && !parentPreview; cut--) {
                const candidate = segs.slice(0, cut).join('.');
                const r = await this.dataSource.query(`select kode, deskripsi from bdb_satker where ${SatkerLegacyReconciliationService_1.normKode('kode')} = ${SatkerLegacyReconciliationService_1.normKode('$1')} or ${SatkerLegacyReconciliationService_1.normKode('kode_canonical')} = ${SatkerLegacyReconciliationService_1.normKode('$1')}`, [candidate]);
                if (r[0])
                    parentPreview = r[0];
            }
        }
        return { status: 1, data: { nama, kode_pusiknas: kodePusiknas, lp_terdampak: rows.length, induk_otomatis: parentPreview } };
    }
    async mapGroupTo(level, kodePusiknas, nama, satkerId, unitNama) {
        const rows = await this.groupRawRows(level, kodePusiknas, nama, unitNama);
        let mapped = 0;
        for (const r of rows) {
            try {
                await this.laporanPolisiService.mapOne(Number(r.dors_lp_id), r.model_lp, satkerId, unitNama);
                mapped++;
            }
            catch (e) {
                this.logger.warn(`Gagal mapOne dors_lp_id=${r.dors_lp_id}: ${e?.message || e}`);
            }
        }
        if (!unitNama) {
            try {
                await this.laporanPolisiService.remapDeeper();
            }
            catch (e) {
                this.logger.warn('Gagal remapDeeper setelah mapGroupTo: ' + (e?.message || e));
            }
        }
        return mapped;
    }
    async addToTree(opts) {
        const deskripsi = (opts.nama || '').trim();
        if (!deskripsi)
            throw new common_1.BadRequestException('Nama satker wajib diisi.');
        let created;
        if (opts.parent_id && opts.segment) {
            created = await this.satkerService.create({ parent_id: opts.parent_id, segment: opts.segment, deskripsi });
        }
        else {
            const kode = (opts.kode || opts.kode_pusiknas || '').trim();
            if (!kode)
                throw new common_1.BadRequestException('Kode Puskarda kosong -- pilih induk manual + segmen.');
            created = await this.satkerService.create({ kode, deskripsi });
        }
        const mapped = await this.mapGroupTo(opts.level, opts.kode_pusiknas, opts.nama, created.data.id, opts.unit_nama);
        const cakupan = opts.unit_nama ? ` (unit "${opts.unit_nama}")` : '';
        this.logger.log(`"${deskripsi}" ditambahkan ke tree (id ${created.data.id}, kode ${created.data.kode}), ${mapped} LP langsung termapping${cakupan}`);
        return {
            status: 1,
            data: { ...created.data, lp_mapped: mapped },
            message: mapped > 0 ? `Satker "${deskripsi}" ditambahkan ke tree, dan ${mapped} LP${cakupan} langsung termapping ke Laporan Polisi.` : `Satker "${deskripsi}" ditambahkan ke tree, tapi tidak ada LP yang berhasil dipetakan otomatis.`,
        };
    }
    async forceMap(opts) {
        const s = await this.dataSource.query('select id, deskripsi from bdb_satker where id = $1', [opts.satker_id]);
        if (!s.length)
            throw new common_1.BadRequestException('Satker tujuan tidak ditemukan.');
        const mapped = await this.mapGroupTo(opts.level, opts.kode_pusiknas, opts.nama, opts.satker_id, opts.unit_nama);
        const cakupan = opts.unit_nama ? ` (unit "${opts.unit_nama}")` : '';
        this.logger.log(`Paksa petakan "${opts.nama}"${cakupan} -> ${s[0].deskripsi} (id ${opts.satker_id}), ${mapped} LP termapping`);
        return {
            status: 1,
            data: { satker_id: opts.satker_id, satker_nama: s[0].deskripsi, lp_mapped: mapped },
            message: mapped > 0 ? `${mapped} LP${cakupan} dipetakan paksa ke "${s[0].deskripsi}".` : `Tidak ada LP yang berhasil dipetakan (mungkin sudah termapping).`,
        };
    }
    async path(satkerId) {
        const rows = await this.dataSource.query(`
            with recursive up as (
                select id, kode, deskripsi, parent_id, 0 as lvl from bdb_satker where id = $1
                union all
                select s.id, s.kode, s.deskripsi, s.parent_id, up.lvl + 1
                from bdb_satker s join up on s.id = up.parent_id
            )
            select id, kode, deskripsi from up order by lvl desc
            `, [satkerId]);
        return { status: 1, data: rows };
    }
};
exports.SatkerLegacyReconciliationService = SatkerLegacyReconciliationService;
exports.SatkerLegacyReconciliationService = SatkerLegacyReconciliationService = SatkerLegacyReconciliationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        satker_service_1.SatkerService,
        laporan_polisi_service_1.LaporanPolisiService,
        audit_service_1.AuditService])
], SatkerLegacyReconciliationService);
//# sourceMappingURL=satker-legacy-reconciliation.service.js.map