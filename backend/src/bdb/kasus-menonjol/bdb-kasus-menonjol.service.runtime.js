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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BdbKasusMenonjolService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const scope_util_1 = require("../common/scope.util");
const minio_service_1 = require("../kerma/minio.service");
const id_cipher_util_1 = require("../laporan-polisi/id-cipher.util");
const SKALA_OPTS = ['nasional', 'regional', 'tidak viral'];
let BdbKasusMenonjolService = class BdbKasusMenonjolService {
    dataSource;
    minio;
    ensureTablesPromise = null;
    constructor(dataSource, minio) {
        this.dataSource = dataSource;
        this.minio = minio;
    }
    async ensureTables() {
        if (!this.ensureTablesPromise) {
            this.ensureTablesPromise = this.dataSource.query(`
            create table if not exists bdb_kasus_menonjol (
                id bigserial primary key,
                judul text not null,
                skala_viral text,
                tanggal_rilis date,
                rilis boolean not null default false,
                keterangan text,
                satker_id bigint,
                created_by bigint,
                updated_by bigint,
                created_at timestamptz not null default now(),
                updated_at timestamptz not null default now(),
                deleted_at timestamptz
            );
            create table if not exists bdb_kasus_menonjol_lp (
                id bigserial primary key,
                kasus_menonjol_id bigint not null,
                lp_id bigint not null,
                created_at timestamptz not null default now(),
                unique (kasus_menonjol_id, lp_id)
            );
            create table if not exists bdb_kasus_menonjol_attachments (
                id bigserial primary key,
                kasus_menonjol_id bigint not null,
                file_name text not null,
                object_key text not null,
                content_type text,
                size bigint,
                created_at timestamptz not null default now()
            );
            alter table bdb_kasus_menonjol
                add column if not exists is_pinned boolean not null default false,
                add column if not exists pinned_at timestamptz,
                add column if not exists kategori text default 'MENONJOL',
                add column if not exists lampiran jsonb default '[]'::jsonb;
            alter table bdb_kasus_menonjol_attachments
                add column if not exists kategori_lampiran text not null default 'DOKUMENTASI',
                add column if not exists revisi_ke int,
                add column if not exists nomor_sprin text,
                add column if not exists tanggal_sprin date,
                add column if not exists catatan_perubahan text,
                add column if not exists judul_dokumentasi text,
                add column if not exists uploaded_by bigint;
        `)
                .then(() => undefined)
                .catch((error) => {
                this.ensureTablesPromise = null;
                throw error;
            });
        }
        return this.ensureTablesPromise;
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
        if (v instanceof Date && !isNaN(v.getTime())) {
            const jkt = new Date(v.getTime() + 7 * 3600 * 1000);
            return jkt.toISOString().slice(0, 10);
        }
        const t = String(v).trim();
        if (/^\d{4}-\d{2}-\d{2}$/.test(t))
            return t;
        const dmy = t.match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/);
        if (dmy)
            return `${dmy[3]}-${dmy[2]}-${dmy[1]}`;
        if (/^\d{4}-\d{2}-\d{2}T/.test(t)) {
            const parsed = new Date(t);
            if (!isNaN(parsed.getTime())) {
                const jkt = new Date(parsed.getTime() + 7 * 3600 * 1000);
                return jkt.toISOString().slice(0, 10);
            }
            return t.slice(0, 10);
        }
        return null;
    }
    toBoolean(v) {
        if (typeof v === 'boolean')
            return v;
        return ['true', '1', 'ya', 'yes'].includes(String(v ?? '').trim().toLowerCase());
    }
    toSkala(v) {
        const s = String(v ?? '').trim().toLowerCase();
        return SKALA_OPTS.includes(s) ? s : null;
    }
    toLpIds(v) {
        const arr = Array.isArray(v) ? v : v === undefined || v === null || v === '' ? [] : [v];
        return [...new Set(arr.map((x) => Number(x)).filter((n) => Number.isFinite(n) && n > 0))];
    }
    /** Pastikan LP yg mau ditautkan benar ada & (kalau bukan admin) semuanya di satker pemanggil. */
    async validateLpIds(lpIds, scope) {
        if (!lpIds.length)
            return [];
        const rows = await this.dataSource.query(`select id, satker_id from bdb_laporan_polisi where id = any($1) and deleted_at is null`, [lpIds]);
        if (rows.length !== lpIds.length)
            throw new common_1.BadRequestException('Ada LP yang dipilih tidak ditemukan.');
        if (!scope.all) {
            const outside = rows.filter((r) => Number(r.satker_id) !== scope.satkerId);
            if (outside.length)
                throw new common_1.ForbiddenException('Semua LP yang ditautkan harus dari satker Anda sendiri.');
        }
        return rows;
    }
    async enrichGenericTitle(judul, lpIds) {
        const isGeneric = /^(pihak\s+)?terlibat\s+(wna|anggota\s+polri|polri)$/i.test(judul.trim()) ||
            /^(perhatian\s+publik)$/i.test(judul.trim());
        if (!isGeneric || !lpIds.length)
            return judul;
        const rows = await this.dataSource.query(`select tempat_kejadian, unit_nama, satker_nama, payload_json from bdb_laporan_polisi where id = $1 limit 1`, [lpIds[0]]);
        if (!rows.length)
            return judul;
        const r = rows[0];
        const rawTkp = (r.tempat_kejadian || r.payload_json?.tempat_kejadian || '').replace(/^JL\.?\s*/i, '').split(',')[0].trim();
        const tag = rawTkp ? rawTkp.slice(0, 45) : (r.unit_nama || r.satker_nama || '').trim();
        return tag ? `${judul.trim().toUpperCase()} - ${tag.toUpperCase()}` : judul;
    }
    satkerDepthExpr() {
        return `coalesce((
            select case
                when s.id in (1,2,3,4,13) or s.parent_id = 13
                  or upper(coalesce(s.deskripsi,'')) like '%BARESKRIM%'
                  or upper(coalesce(s.deskripsi,'')) like '%MABES%'
                  or upper(coalesce(s.deskripsi,'')) like '%DITTIPID%'
                  or upper(coalesce(s.deskripsi,'')) like '%DENSUS%'
                  or upper(coalesce(s.deskripsi,'')) like '%BAHARKAM%'
                  or upper(coalesce(s.nama_singkat,'')) like '%BARESKRIM%' then 1
                when upper(coalesce(s.deskripsi,'')) like '%POLSEK%' then 4
                when upper(coalesce(s.deskripsi,'')) like '%POLRES%'
                  or upper(coalesce(s.deskripsi,'')) like '%POLRESTA%'
                  or upper(coalesce(s.deskripsi,'')) like 'RES %'
                  or upper(coalesce(s.deskripsi,'')) like '% RES %' then 3
                when upper(coalesce(s.deskripsi,'')) like '%POLDA%' or s.depth <= 2 then 2
                else greatest(2, least(4, coalesce(s.depth::int, 4)))
            end
            from bdb_satker s
            where s.id = coalesce(
                k.satker_id,
                (select coalesce(lp0.unit_satker_id, lp0.satker_id) from bdb_kasus_menonjol_lp l0 join bdb_laporan_polisi lp0 on lp0.id = l0.lp_id where l0.kasus_menonjol_id = k.id order by l0.id limit 1)
            )
            limit 1
        ), 99)`;
    }
    effectiveDateExpr() {
        return `coalesce(
            k.tanggal_rilis,
            (
                select case
                    when lp0.tgl_laporan ~ '^\\d{2}[-/]\\d{2}[-/]\\d{4}' then to_date(replace(left(lp0.tgl_laporan, 10), '/', '-'), 'DD-MM-YYYY')
                    when lp0.tgl_laporan ~ '^\\d{4}[-/]\\d{2}[-/]\\d{2}' then replace(left(lp0.tgl_laporan, 10), '/', '-')::date
                    else null
                end
                from bdb_kasus_menonjol_lp l0
                join bdb_laporan_polisi lp0 on lp0.id = l0.lp_id
                where l0.kasus_menonjol_id = k.id
                order by l0.id
                limit 1
            ),
            (k.created_at at time zone 'Asia/Jakarta')::date
        )`;
    }
    buildBaseSelect() {
        return `
            select
                k.id, k.judul, coalesce(k.kategori, 'MENONJOL') as kategori,
                k.skala_viral, k.tanggal_rilis::text as tanggal_rilis, k.rilis, k.keterangan, k.satker_id,
                coalesce(k.is_pinned, false) as is_pinned,
                k.pinned_at,
                coalesce(k.lampiran, '[]'::jsonb) as lampiran,
                (${this.effectiveDateExpr()})::text as effective_date,
                ${this.satkerDepthExpr()} as satker_depth,
                coalesce(
                    (select coalesce(nullif(s.nama_singkat,''), s.deskripsi) from bdb_satker s where s.id = k.satker_id limit 1),
                    (select lp0.satker_nama from bdb_kasus_menonjol_lp l0 join bdb_laporan_polisi lp0 on lp0.id = l0.lp_id where l0.kasus_menonjol_id = k.id order by l0.id limit 1)
                ) as satker_nama,
                k.created_by, k.updated_by, k.created_at, k.updated_at,
                (select count(*)::int from bdb_kasus_menonjol_lp l where l.kasus_menonjol_id = k.id) as jumlah_lp,
                (select count(distinct s.satker_nama)::int from bdb_kasus_menonjol_lp l
                    join bdb_laporan_polisi s on s.id = l.lp_id where l.kasus_menonjol_id = k.id) as jumlah_satker,
                (select count(*)::int from bdb_kasus_menonjol_attachments a where a.kasus_menonjol_id = k.id) as jumlah_lampiran,
                (select count(*)::int from bdb_kasus_menonjol_attachments a where a.kasus_menonjol_id = k.id and coalesce(a.kategori_lampiran,'DOKUMENTASI') = 'SPRIN') as jumlah_lampiran_sprin,
                (select count(*)::int from bdb_kasus_menonjol_attachments a where a.kasus_menonjol_id = k.id and coalesce(a.kategori_lampiran,'DOKUMENTASI') <> 'SPRIN') as jumlah_lampiran_dokumentasi,
                (select a.nomor_sprin from bdb_kasus_menonjol_attachments a where a.kasus_menonjol_id = k.id and coalesce(a.kategori_lampiran,'DOKUMENTASI') = 'SPRIN' order by coalesce(a.revisi_ke,0) desc, a.id desc limit 1) as latest_nomor_sprin,
                (select a.tanggal_sprin::text from bdb_kasus_menonjol_attachments a where a.kasus_menonjol_id = k.id and coalesce(a.kategori_lampiran,'DOKUMENTASI') = 'SPRIN' order by coalesce(a.revisi_ke,0) desc, a.id desc limit 1) as latest_tanggal_sprin,
                (select max(coalesce(a.revisi_ke,1))::int from bdb_kasus_menonjol_attachments a where a.kasus_menonjol_id = k.id and coalesce(a.kategori_lampiran,'DOKUMENTASI') = 'SPRIN') as latest_revisi_sprin,
                (select string_agg(distinct s.satker_nama, ', ') from bdb_kasus_menonjol_lp l
                    join bdb_laporan_polisi s on s.id = l.lp_id where l.kasus_menonjol_id = k.id) as satker_terkait,
                (select lp0.no_laporan from bdb_kasus_menonjol_lp l0 join bdb_laporan_polisi lp0 on lp0.id = l0.lp_id
                    where l0.kasus_menonjol_id = k.id order by l0.id limit 1) as first_no_laporan,
                (select lp0.tgl_laporan from bdb_kasus_menonjol_lp l0 join bdb_laporan_polisi lp0 on lp0.id = l0.lp_id
                    where l0.kasus_menonjol_id = k.id order by l0.id limit 1) as first_tgl_laporan
            from bdb_kasus_menonjol k
        `;
    }
    async list(userId, query = {}) {
        await this.ensureTables();
        const kat = String(query?.kategori || '').trim().toUpperCase();
        if (kat === 'ATENSI') {
            return this.listAtensiViaKategori(userId, query);
        }
        const scope = await (0, scope_util_1.resolveScope)(this.dataSource, userId);
        const page = Math.max(1, Number(query.page || 1));
        const limit = Math.max(1, Math.min(Number(query.row || query.limit || 20), 200));
        const offset = (page - 1) * limit;
        const params = [];
        const where = ['k.deleted_at is null'];
        if (query.scope === 'scoped' && !scope.all) {
            if (!scope.satkerId) {
                return {
                    data: [],
                    meta: {
                        total: 0,
                        page,
                        limit,
                        totalPages: 1,
                        summary: { total_all: 0, nasional: 0, regional: 0, tidak_viral: 0, sudah_rilis: 0, belum_rilis: 0, total_lp_terkait: 0 }
                    }
                };
            }
            params.push(scope.satkerId);
            where.push(`k.satker_id = $${params.length}`);
        }
        const search = this.toText(query.search);
        if (search) {
            params.push(`%${search.toLowerCase()}%`);
            const p = params.length;
            where.push(`(
                lower(coalesce(k.judul,'')) like $${p}
                or lower(coalesce(k.keterangan,'')) like $${p}
                or exists (
                    select 1 from bdb_kasus_menonjol_lp l_s
                    join bdb_laporan_polisi lp_s on lp_s.id = l_s.lp_id
                    where l_s.kasus_menonjol_id = k.id
                      and (lower(coalesce(lp_s.no_laporan,'')) like $${p} or lower(coalesce(lp_s.satker_nama,'')) like $${p})
                )
            )`);
        }
        const satker = this.toText(query.satker || query.satker_nama);
        if (satker && !['all', 'semua'].includes(satker.toLowerCase())) {
            params.push(`%${satker.toLowerCase()}%`);
            const p = params.length;
            where.push(`(
                exists (select 1 from bdb_satker s_f where s_f.id = k.satker_id and (lower(coalesce(s_f.nama_singkat,'')) like $${p} or lower(coalesce(s_f.deskripsi,'')) like $${p}))
                or exists (select 1 from bdb_kasus_menonjol_lp l_f join bdb_laporan_polisi lp_f on lp_f.id = l_f.lp_id where l_f.kasus_menonjol_id = k.id and lower(coalesce(lp_f.satker_nama,'')) like $${p})
            )`);
        }
        const fromDate = this.toDate(query.from || query.tgl_mulai || query.start_date);
        if (fromDate) {
            params.push(fromDate);
            where.push(`(${this.effectiveDateExpr()}) >= $${params.length}::date`);
        }
        const toDate = this.toDate(query.to || query.tgl_selesai || query.end_date);
        if (toDate) {
            params.push(toDate);
            where.push(`(${this.effectiveDateExpr()}) <= $${params.length}::date`);
        }
        const summaryWhereSql = where.join(' and ');
        const summaryParams = [...params];
        const skala = this.toText(query.skala_viral)?.toLowerCase() || null;
        if (skala && !['all', 'semua'].includes(skala)) {
            params.push(skala);
            where.push(`lower(coalesce(k.skala_viral,'')) = $${params.length}`);
        }
        const rawRilis = this.toText(query.rilis);
        if (rawRilis && !['all', 'semua'].includes(rawRilis.toLowerCase())) {
            const isRilis = ['true', '1', 'ya', 'yes', 'sudah'].includes(rawRilis.toLowerCase());
            params.push(isRilis);
            where.push(`coalesce(k.rilis, false) = $${params.length}`);
        }
        const rawPinned = this.toText(query.pinned);
        if (rawPinned && !['all', 'semua'].includes(rawPinned.toLowerCase())) {
            const isPinned = ['true', '1', 'ya', 'yes', 'pinned', 'disematkan'].includes(rawPinned.toLowerCase());
            params.push(isPinned);
            where.push(`coalesce(k.is_pinned, false) = $${params.length}`);
        }
        const whereSql = where.join(' and ');
        const orderBy = `order by
            coalesce(k.is_pinned, false) desc,
            k.pinned_at desc nulls last,
            ${this.effectiveDateExpr()} desc nulls last,
            (select count(*)::int from bdb_kasus_menonjol_lp l where l.kasus_menonjol_id = k.id) desc,
            ${this.satkerDepthExpr()} asc,
            case when lower(coalesce(k.skala_viral,'')) = 'nasional' then 1
                 when lower(coalesce(k.skala_viral,'')) = 'regional' then 2
                 else 3 end asc,
            case when coalesce(k.rilis, false) = true then 0 else 1 end asc,
            k.created_at desc,
            k.id desc`;
        const [totalRow, summaryRow, rows] = await Promise.all([
            this.dataSource.query(`select count(*)::int as total from bdb_kasus_menonjol k where ${whereSql}`, params),
            this.dataSource.query(`select
                    count(*)::int as total_all,
                    count(*) filter (where coalesce(k.is_pinned, false) = true)::int as disematkan,
                    count(*) filter (where lower(coalesce(k.skala_viral,'')) = 'nasional')::int as nasional,
                    count(*) filter (where lower(coalesce(k.skala_viral,'')) = 'regional')::int as regional,
                    count(*) filter (where lower(coalesce(k.skala_viral,'')) = 'tidak viral' or coalesce(k.skala_viral,'') = '')::int as tidak_viral,
                    count(*) filter (where k.rilis = true)::int as sudah_rilis,
                    count(*) filter (where coalesce(k.rilis, false) = false)::int as belum_rilis,
                    coalesce((
                        select count(*)::int
                        from bdb_kasus_menonjol_lp l_cnt
                        join bdb_kasus_menonjol k on k.id = l_cnt.kasus_menonjol_id
                        where ${summaryWhereSql}
                    ), 0) as total_lp_terkait
                 from bdb_kasus_menonjol k
                 where ${summaryWhereSql}`, summaryParams),
            this.dataSource.query(`${this.buildBaseSelect()} where ${whereSql} ${orderBy} limit $${params.length + 1} offset $${params.length + 2}`, [...params, limit, offset])
        ]);
        const total = Number(totalRow?.[0]?.total || 0);
        const s = summaryRow?.[0] || {};
        const summary = {
            total_all: Number(s.total_all || 0),
            disematkan: Number(s.disematkan || 0),
            nasional: Number(s.nasional || 0),
            regional: Number(s.regional || 0),
            tidak_viral: Number(s.tidak_viral || 0),
            sudah_rilis: Number(s.sudah_rilis || 0),
            belum_rilis: Number(s.belum_rilis || 0),
            total_lp_terkait: Number(s.total_lp_terkait || 0)
        };
        return { data: rows, meta: { total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)), summary } };
    }
    /** Fallback ketika /bdb/kasus-menonjol?kategori=ATENSI dipanggil langsung. */
    async listAtensiViaKategori(userId, query = {}) {
        const page = Math.max(1, Number(query.page || 1));
        const limit = Math.max(1, Math.min(Number(query.row || query.limit || 20), 200));
        const offset = (page - 1) * limit;
        const params = [];
        const where = ['k.deleted_at is null'];
        const search = this.toText(query.search);
        if (search) {
            params.push(`%${search.toLowerCase()}%`);
            const p = params.length;
            where.push(`(lower(coalesce(k.judul,'')) like $${p} or lower(coalesce(k.keterangan,'')) like $${p})`);
        }
        const whereSql = where.join(' and ');
        const [totalRow, rows] = await Promise.all([
            this.dataSource.query(`select count(*)::int as total from bdb_kasus_atensi k where ${whereSql}`, params),
            this.dataSource.query(`select
                    k.id, k.judul, 'ATENSI'::text as kategori,
                    k.sumber_atensi, k.level_atensi, k.tanggal_atensi::text as tanggal_atensi, k.status_atensi, k.keterangan, k.satker_id,
                    coalesce(k.is_pinned, false) as is_pinned, k.pinned_at,
                    coalesce(k.lampiran, '[]'::jsonb) as lampiran,
                    coalesce(k.tanggal_atensi, (k.created_at at time zone 'Asia/Jakarta')::date)::text as effective_date,
                    coalesce(
                        (select coalesce(nullif(s.nama_singkat,''), s.deskripsi) from bdb_satker s where s.id = k.satker_id limit 1),
                        (select lp0.satker_nama from bdb_kasus_atensi_lp l0 join bdb_laporan_polisi lp0 on lp0.id = l0.lp_id where l0.kasus_atensi_id = k.id order by l0.id limit 1)
                    ) as satker_nama,
                    k.created_by, k.updated_by, k.created_at, k.updated_at,
                    (select count(*)::int from bdb_kasus_atensi_lp l where l.kasus_atensi_id = k.id) as jumlah_lp,
                    (select count(distinct s.satker_nama)::int from bdb_kasus_atensi_lp l join bdb_laporan_polisi s on s.id = l.lp_id where l.kasus_atensi_id = k.id) as jumlah_satker,
                    (select count(*)::int from bdb_kasus_atensi_attachments a where a.kasus_atensi_id = k.id) as jumlah_lampiran,
                    (select count(*)::int from bdb_kasus_atensi_attachments a where a.kasus_atensi_id = k.id and coalesce(a.kategori_lampiran,'DOKUMENTASI') = 'SPRIN') as jumlah_lampiran_sprin,
                    (select count(*)::int from bdb_kasus_atensi_attachments a where a.kasus_atensi_id = k.id and coalesce(a.kategori_lampiran,'DOKUMENTASI') <> 'SPRIN') as jumlah_lampiran_dokumentasi,
                    (select a.nomor_sprin from bdb_kasus_atensi_attachments a where a.kasus_atensi_id = k.id and coalesce(a.kategori_lampiran,'DOKUMENTASI') = 'SPRIN' order by coalesce(a.revisi_ke,0) desc, a.id desc limit 1) as latest_nomor_sprin,
                    (select a.tanggal_sprin::text from bdb_kasus_atensi_attachments a where a.kasus_atensi_id = k.id and coalesce(a.kategori_lampiran,'DOKUMENTASI') = 'SPRIN' order by coalesce(a.revisi_ke,0) desc, a.id desc limit 1) as latest_tanggal_sprin,
                    (select max(coalesce(a.revisi_ke,1))::int from bdb_kasus_atensi_attachments a where a.kasus_atensi_id = k.id and coalesce(a.kategori_lampiran,'DOKUMENTASI') = 'SPRIN') as latest_revisi_sprin,
                    (select string_agg(distinct s.satker_nama, ', ') from bdb_kasus_atensi_lp l join bdb_laporan_polisi s on s.id = l.lp_id where l.kasus_atensi_id = k.id) as satker_terkait,
                    (select lp0.no_laporan from bdb_kasus_atensi_lp l0 join bdb_laporan_polisi lp0 on lp0.id = l0.lp_id where l0.kasus_atensi_id = k.id order by l0.id limit 1) as first_no_laporan,
                    (select lp0.tgl_laporan from bdb_kasus_atensi_lp l0 join bdb_laporan_polisi lp0 on lp0.id = l0.lp_id where l0.kasus_atensi_id = k.id order by l0.id limit 1) as first_tgl_laporan
                 from bdb_kasus_atensi k
                 where ${whereSql}
                 order by coalesce(k.is_pinned, false) desc, k.pinned_at desc nulls last, k.created_at desc, k.id desc
                 limit $${params.length + 1} offset $${params.length + 2}`, [...params, limit, offset])
        ]);
        const total = Number(totalRow?.[0]?.total || 0);
        return { data: rows, meta: { total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) } };
    }
    async findOne(id, userId) {
        await this.ensureTables();
        await (0, scope_util_1.resolveScope)(this.dataSource, userId);
        const rows = await this.dataSource.query(`${this.buildBaseSelect()} where k.id = $1 and k.deleted_at is null`, [id]);
        const row = rows[0];
        if (!row)
            throw new common_1.NotFoundException('Kasus menonjol tidak ditemukan.');
        return row;
    }
    async enrichLpRowsWithDocs(rows) {
        if (!rows.length)
            return rows;
        const lpIds = rows.map((r) => Number(r.lp_id || r.id)).filter((n) => Number.isFinite(n) && n > 0);
        for (const r of rows) {
            const lid = Number(r.lp_id || r.id);
            r.id = lid;
            r.lp_id = lid;
            r.pid = (0, id_cipher_util_1.encodeId)(lid);
            r.dokumen_list = [];
        }
        if (!lpIds.length)
            return rows;
        try {
            const docRows = await this.dataSource.query(`select d.id, d.lp_id, d.nomor_dokumen, d.tanggal_dokumen::text as tanggal_dokumen, d.lampiran,
                        t.code as type_code, t.nama as type_nama, t.urutan_tahap
                 from bdb_dokumen d
                 join bdb_document_type_master t on t.id = d.document_type_id
                 where d.lp_id = any($1)
                 order by t.urutan_tahap asc nulls last, d.tanggal_dokumen asc nulls last, d.id asc`, [lpIds]);
            const docMap = new Map();
            for (const d of docRows) {
                const lid = Number(d.lp_id);
                const rawLampiran = Array.isArray(d.lampiran) ? d.lampiran : [];
                const lampiran = [];
                for (const att of rawLampiran) {
                    let url = att?.url || null;
                    if (!url && att?.key) {
                        try {
                            url = await this.minio.presignedUrl(att.key, 3600);
                        }
                        catch {
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
                if (!docMap.has(lid))
                    docMap.set(lid, []);
                docMap.get(lid).push({
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
        }
        catch {
            /* ignore doc enrichment error */
        }
        return rows;
    }
    async listLp(kasusId, userId) {
        await this.findOne(kasusId, userId); // scope-check
        const rows = await this.dataSource.query(`select lp.id, lp.id as lp_id, lp.no_laporan, lp.satker_nama, lp.unit_nama, lp.tgl_laporan, lp.tingkat_kesulitan,
                    coalesce(sm.code,'LP') as status_code, coalesce(sm.nama,'Laporan Polisi') as status_nama,
                    coalesce(sm.kategori,'CT') as status_kategori,
                    coalesce(
                        nullif((select string_agg(distinct coalesce(nullif(tp_m.nomor_pasal,'') || coalesce(' (' || nullif(tp_m.nama_kategori,'') || ')', ''), tp_m.nama_kategori), '; ') from bdb_lp_tindak_pidana tp_m where tp_m.lp_id = lp.id), ''),
                        (select string_agg(x.txt, '; ') from (
                            select distinct coalesce(nullif(tp->>'nama_kategori_kejahatan',''), nullif(tp->>'pasal',''), '(tanpa kategori)') as txt
                            from jsonb_array_elements(case when jsonb_typeof(lp.payload_json->'tindak_pidana')='array' then lp.payload_json->'tindak_pidana' else '[]'::jsonb end) tp
                        ) x)
                    ) as kejahatan
             from bdb_kasus_menonjol_lp l
             join bdb_laporan_polisi lp on lp.id = l.lp_id
             left join bdb_status_master sm on sm.id = lp.status_id
             where l.kasus_menonjol_id = $1
             order by l.id`, [kasusId]);
        return this.enrichLpRowsWithDocs(rows);
    }
    async replaceLpLinks(kasusId, lpIds) {
        await this.dataSource.query(`delete from bdb_kasus_menonjol_lp where kasus_menonjol_id = $1`, [kasusId]);
        for (const lpId of lpIds) {
            await this.dataSource.query(`insert into bdb_kasus_menonjol_lp (kasus_menonjol_id, lp_id) values ($1,$2) on conflict do nothing`, [kasusId, lpId]);
        }
    }
    async create(userId, dto) {
        await this.ensureTables();
        const scope = await (0, scope_util_1.resolveScope)(this.dataSource, userId);
        let judul = this.toText(dto.judul);
        if (!judul)
            throw new common_1.BadRequestException('Judul wajib diisi.');
        const lpIds = this.toLpIds(dto.lp_ids);
        const lpRows = await this.validateLpIds(lpIds, scope);
        judul = await this.enrichGenericTitle(judul, lpIds);
        let satkerId = null;
        if (lpRows.length)
            satkerId = Number(lpRows[0].satker_id) || null;
        else if (!scope.all)
            satkerId = scope.satkerId;
        const rilis = this.toBoolean(dto.rilis);
        const tanggalRilis = this.toDate(dto.tanggal_rilis);
        if (rilis && !tanggalRilis)
            throw new common_1.BadRequestException('Tanggal rilis wajib diisi jika sudah dirilis.');
        const isPinned = this.toBoolean(dto.is_pinned);
        const payload = {
            judul,
            kategori: String(dto.kategori || 'MENONJOL').trim().toUpperCase() === 'ATENSI' ? 'ATENSI' : 'MENONJOL',
            skala_viral: this.toSkala(dto.skala_viral),
            tanggal_rilis: tanggalRilis,
            rilis,
            keterangan: this.toText(dto.keterangan),
            is_pinned: isPinned,
            pinned_at: isPinned ? new Date() : null,
            satker_id: satkerId,
            created_by: userId ?? null,
            updated_by: userId ?? null
        };
        const keys = Object.keys(payload);
        const rows = await this.dataSource.query(`insert into bdb_kasus_menonjol (${keys.join(', ')}) values (${keys.map((_, i) => `$${i + 1}`).join(', ')}) returning id`, keys.map((k) => payload[k]));
        const id = Number(rows[0].id);
        if (lpIds.length)
            await this.replaceLpLinks(id, lpIds);
        return this.findOne(id, userId);
    }
    async update(id, userId, dto) {
        await this.ensureTables();
        const scope = await (0, scope_util_1.resolveScope)(this.dataSource, userId);
        const existing = await this.findOne(id, userId); // scope-checked
        if (!scope.all && Number(existing.satker_id) !== scope.satkerId) {
            throw new common_1.ForbiddenException('Tidak memiliki akses mengubah kasus ini.');
        }
        const lpIds = dto.lp_ids !== undefined ? this.toLpIds(dto.lp_ids) : null;
        const lpRows = lpIds !== null ? await this.validateLpIds(lpIds, scope) : null;
        let satkerId = existing.satker_id;
        if (lpRows !== null) {
            if (lpRows.length)
                satkerId = Number(lpRows[0].satker_id) || null;
            else if (!scope.all)
                satkerId = scope.satkerId;
            else
                satkerId = null;
        }
        const payload = { updated_by: userId ?? null, satker_id: satkerId };
        if (dto.judul !== undefined) {
            let judul = this.toText(dto.judul);
            if (!judul)
                throw new common_1.BadRequestException('Judul wajib diisi.');
            const targetLpIds = lpIds !== null ? lpIds : (await this.dataSource.query('select lp_id from bdb_kasus_menonjol_lp where kasus_menonjol_id = $1 limit 1', [id])).map((r) => r.lp_id);
            judul = await this.enrichGenericTitle(judul, targetLpIds);
            payload.judul = judul;
        }
        if (dto.skala_viral !== undefined)
            payload.skala_viral = this.toSkala(dto.skala_viral);
        if (dto.tanggal_rilis !== undefined)
            payload.tanggal_rilis = this.toDate(dto.tanggal_rilis);
        if (dto.rilis !== undefined)
            payload.rilis = this.toBoolean(dto.rilis);
        if (dto.keterangan !== undefined)
            payload.keterangan = this.toText(dto.keterangan);
        if (dto.is_pinned !== undefined) {
            const nextPin = this.toBoolean(dto.is_pinned);
            payload.is_pinned = nextPin;
            payload.pinned_at = nextPin ? (existing.pinned_at || new Date()) : null;
        }
        const rilisFinal = dto.rilis !== undefined ? payload.rilis : existing.rilis;
        const tanggalRilisFinal = dto.tanggal_rilis !== undefined ? payload.tanggal_rilis : existing.tanggal_rilis;
        if (rilisFinal && !tanggalRilisFinal)
            throw new common_1.BadRequestException('Tanggal rilis wajib diisi jika sudah dirilis.');
        const keys = Object.keys(payload);
        const sets = keys.map((k, i) => `${k} = $${i + 1}`);
        sets.push('updated_at = now()');
        const params = keys.map((k) => payload[k]);
        params.push(id);
        await this.dataSource.query(`update bdb_kasus_menonjol set ${sets.join(', ')} where id = $${params.length} and deleted_at is null`, params);
        if (lpIds !== null)
            await this.replaceLpLinks(id, lpIds);
        return this.findOne(id, userId);
    }
    async setPin(id, userId, pinned) {
        await this.ensureTables();
        const existing = await this.findOne(id, userId);
        const nextPin = pinned !== undefined && pinned !== null ? this.toBoolean(pinned) : !Boolean(existing.is_pinned);
        await this.dataSource.query(`update bdb_kasus_menonjol
             set is_pinned = $2,
                 pinned_at = case when $2 then now() else null end,
                 updated_by = $3,
                 updated_at = now()
             where id = $1 and deleted_at is null`, [id, nextPin, userId ?? null]);
        return this.findOne(id, userId);
    }
    async remove(id, userId) {
        await this.ensureTables();
        const scope = await (0, scope_util_1.resolveScope)(this.dataSource, userId);
        const existing = await this.findOne(id, userId); // scope-checked
        if (!scope.all && Number(existing.satker_id) !== scope.satkerId) {
            throw new common_1.ForbiddenException('Tidak memiliki akses menghapus kasus ini.');
        }
        await this.dataSource.query('update bdb_kasus_menonjol set deleted_at = now() where id = $1', [id]);
        return { status: 1, message: 'Kasus menonjol dihapus.' };
    }
    // ===== Lampiran (MinIO) — mendukung pemisahan SPRIN (multi-revisi) vs DOKUMENTASI =====
    async syncLampiranJsonb(kasusId) {
        try {
            const rows = await this.dataSource.query(`select id, file_name, object_key, content_type, size, created_at,
                        coalesce(kategori_lampiran, 'DOKUMENTASI') as kategori_lampiran,
                        revisi_ke, nomor_sprin, tanggal_sprin::text as tanggal_sprin,
                        catatan_perubahan, judul_dokumentasi, uploaded_by
                 from bdb_kasus_menonjol_attachments
                 where kasus_menonjol_id = $1
                 order by id asc`, [kasusId]);
            const jsonArr = rows.map((r) => ({
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
            await this.dataSource.query(`update bdb_kasus_menonjol set lampiran = $2::jsonb where id = $1`, [kasusId, JSON.stringify(jsonArr)]);
        }
        catch {
            /* ignore sync error */
        }
    }
    async addAttachments(kasusId, userId, files, meta = {}) {
        await this.findOne(kasusId, userId); // scope-check
        const kategoriLampiran = String(meta?.kategori_lampiran || meta?.kategori || 'DOKUMENTASI').trim().toUpperCase() === 'SPRIN' ? 'SPRIN' : 'DOKUMENTASI';
        const nomorSprin = this.toText(meta?.nomor_sprin);
        const tanggalSprin = this.toDate(meta?.tanggal_sprin);
        const catatanPerubahan = this.toText(meta?.catatan_perubahan || meta?.catatan);
        const judulDokumentasi = this.toText(meta?.judul_dokumentasi || meta?.keterangan || meta?.judul);
        let nextRev = null;
        if (kategoriLampiran === 'SPRIN') {
            if (meta?.revisi_ke && Number(meta.revisi_ke) > 0) {
                nextRev = Number(meta.revisi_ke);
            }
            else {
                const revRow = await this.dataSource.query(`select coalesce(max(revisi_ke), count(*))::int as max_rev
                     from bdb_kasus_menonjol_attachments
                     where kasus_menonjol_id = $1 and coalesce(kategori_lampiran, 'DOKUMENTASI') = 'SPRIN'`, [kasusId]);
                nextRev = Number(revRow?.[0]?.max_rev || 0) + 1;
            }
        }
        if (!files?.length) {
            if (kategoriLampiran === 'SPRIN' && (nomorSprin || catatanPerubahan)) {
                await this.dataSource.query(`insert into bdb_kasus_menonjol_attachments
                        (kasus_menonjol_id, file_name, object_key, content_type, size, kategori_lampiran, revisi_ke, nomor_sprin, tanggal_sprin, catatan_perubahan, judul_dokumentasi, uploaded_by)
                     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`, [
                    kasusId,
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
                ]);
                await this.syncLampiranJsonb(kasusId);
            }
            return this.listAttachments(kasusId, userId);
        }
        let idx = 0;
        for (const f of files) {
            const key = await this.minio.upload(f, 'kasus-menonjol');
            const revVal = kategoriLampiran === 'SPRIN' ? (nextRev !== null ? nextRev + idx : idx + 1) : null;
            await this.dataSource.query(`insert into bdb_kasus_menonjol_attachments
                    (kasus_menonjol_id, file_name, object_key, content_type, size, kategori_lampiran, revisi_ke, nomor_sprin, tanggal_sprin, catatan_perubahan, judul_dokumentasi, uploaded_by)
                 values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`, [
                kasusId,
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
            ]);
            idx++;
        }
        await this.syncLampiranJsonb(kasusId);
        return this.listAttachments(kasusId, userId);
    }
    async listAttachments(kasusId, userId) {
        await this.findOne(kasusId, userId); // scope-check
        const rows = await this.dataSource.query(`select id, file_name, object_key, content_type, size, created_at,
                    coalesce(kategori_lampiran, 'DOKUMENTASI') as kategori_lampiran,
                    revisi_ke, nomor_sprin, tanggal_sprin::text as tanggal_sprin,
                    catatan_perubahan, judul_dokumentasi, uploaded_by
             from bdb_kasus_menonjol_attachments
             where kasus_menonjol_id = $1
             order by case when coalesce(kategori_lampiran,'DOKUMENTASI')='SPRIN' then coalesce(revisi_ke,0) else 0 end desc, id desc`, [kasusId]);
        const data = [];
        for (const r of rows) {
            let url = null;
            if (r.object_key) {
                try {
                    url = await this.minio.presignedUrl(r.object_key, 3600);
                }
                catch {
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
    async removeAttachment(attId, userId) {
        const rows = await this.dataSource.query(`select kasus_menonjol_id, object_key from bdb_kasus_menonjol_attachments where id = $1`, [attId]);
        if (!rows.length)
            throw new common_1.NotFoundException('Lampiran tidak ditemukan.');
        const kasusId = Number(rows[0].kasus_menonjol_id);
        await this.findOne(kasusId, userId); // scope-check
        if (rows[0].object_key) {
            try {
                await this.minio.remove(rows[0].object_key);
            }
            catch {
                /* biarkan hapus metadata walau objek gagal dihapus */
            }
        }
        await this.dataSource.query(`delete from bdb_kasus_menonjol_attachments where id = $1`, [attId]);
        await this.syncLampiranJsonb(kasusId);
        return { status: 1, message: 'Lampiran dihapus.' };
    }
};
exports.BdbKasusMenonjolService = BdbKasusMenonjolService;
exports.BdbKasusMenonjolService = BdbKasusMenonjolService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_1.DataSource !== "undefined" && typeorm_1.DataSource) === "function" ? _a : Object, typeof (_b = typeof minio_service_1.MinioService !== "undefined" && minio_service_1.MinioService) === "function" ? _b : Object])
], BdbKasusMenonjolService);
