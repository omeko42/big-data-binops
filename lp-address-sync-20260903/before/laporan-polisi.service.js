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
var LaporanPolisiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LaporanPolisiService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const fs_1 = require("fs");
const id_cipher_util_1 = require("./id-cipher.util");
const scope_util_1 = require("../common/scope.util");
const audit_service_1 = require("../audit/audit.service");
const path_1 = require("path");
const satker_placement_util_1 = require("./satker-placement.util");
const lp_scope_util_1 = require("../common/lp-scope.util");
let LaporanPolisiService = class LaporanPolisiService {
    static { LaporanPolisiService_1 = this; }
    dataSource;
    audit;
    logger = new common_1.Logger('LaporanPolisiService');
    static ensureTablePromise = null;
    constructor(dataSource, audit) {
        this.dataSource = dataSource;
        this.audit = audit;
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
        case
            when lower(coalesce(r.payload_json->'unit'->>'level',''))='polres'
             and r.payload_json->'polres'->>'kode'='060.30.22'
              then '060.01.30.35'
            else (
case
            when lower(coalesce(r.payload_json->'unit'->>'level',''))='polsek'
                 and jsonb_typeof(r.payload_json->'polsek')='object'
                 then r.payload_json->'polsek'->>'kode_pusiknas'
            when lower(coalesce(r.payload_json->'unit'->>'level',''))='polres'
                 and jsonb_typeof(r.payload_json->'polres')='object'
                 then r.payload_json->'polres'->>'kode_pusiknas'
            when lower(coalesce(r.payload_json->'unit'->>'level',''))='polda'
                 and jsonb_typeof(r.payload_json->'polda')='object'
                 then r.payload_json->'polda'->>'kode_pusiknas'
            when jsonb_typeof(r.payload_json->'polsek')='object' then r.payload_json->'polsek'->>'kode_pusiknas'
            when jsonb_typeof(r.payload_json->'polres')='object' then r.payload_json->'polres'->>'kode_pusiknas'
            when jsonb_typeof(r.payload_json->'polda')='object' then r.payload_json->'polda'->>'kode_pusiknas'
        end
            )
        end`;
    static DORS_KODE_SQL = `
        case
            when lower(coalesce(r.payload_json->'unit'->>'level',''))='polsek'
                 and jsonb_typeof(r.payload_json->'polsek')='object'
                 then r.payload_json->'polsek'->>'kode'
            when lower(coalesce(r.payload_json->'unit'->>'level',''))='polres'
                 and jsonb_typeof(r.payload_json->'polres')='object'
                 then r.payload_json->'polres'->>'kode'
            when lower(coalesce(r.payload_json->'unit'->>'level',''))='polda'
                 and jsonb_typeof(r.payload_json->'polda')='object'
                 then r.payload_json->'polda'->>'kode'
            when jsonb_typeof(r.payload_json->'polsek')='object' then r.payload_json->'polsek'->>'kode'
            when jsonb_typeof(r.payload_json->'polres')='object' then r.payload_json->'polres'->>'kode'
            when jsonb_typeof(r.payload_json->'polda')='object' then r.payload_json->'polda'->>'kode'
        end`;
    static NARKOBA_PENGGELAPAN_CONFLICT_SQL = `
        (
            upper(coalesce(lp.payload_json->'kategori_gk'->>'keterangan','')) like '%PENGGELAPAN%'
            or exists (
                select 1
                from jsonb_array_elements(
                    case when jsonb_typeof(lp.payload_json->'tindak_pidana')='array'
                         then lp.payload_json->'tindak_pidana' else '[]'::jsonb end
                ) tp
                where upper(concat_ws(' ',
                    tp->>'nama_kategori_kejahatan',
                    tp->>'pasal_mapping',
                    tp->>'pasal',
                    tp->>'nama_uu'
                )) like '%PENGGELAPAN%'
            )
        )
        and not (
            upper(coalesce(lp.payload_json->'kategori_gk'->>'keterangan','')) ~ '(NARKOT|PSIKOTROP)'
            or exists (
                select 1
                from jsonb_array_elements(
                    case when jsonb_typeof(lp.payload_json->'tindak_pidana')='array'
                         then lp.payload_json->'tindak_pidana' else '[]'::jsonb end
                ) tp
                where upper(concat_ws(' ',
                    tp->>'nama_kategori_kejahatan',
                    tp->>'pasal_mapping',
                    tp->>'pasal',
                    tp->>'nama_uu'
                )) ~ '(NARKOT|PSIKOTROP)'
            )
        )`;
    static narkobaPenggelapanConflictSql(alias) {
        if (!/^[a-z][a-z0-9_]*$/i.test(alias))
            throw new Error('Alias SQL LP tidak valid.');
        return this.NARKOBA_PENGGELAPAN_CONFLICT_SQL.replace(/\blp\./g, `${alias}.`);
    }
    static normKode(expr) {
        return `regexp_replace(replace(coalesce((${expr}), ''), chr(160), ''), '\\s+', '', 'g')`;
    }
    async resolveSatkerPlacement(satkerId) {
        const chain = await this.dataSource.query(`with recursive satker_chain as (
                 select s.id, s.kode, s.deskripsi, s.parent_id, s.tipe_satker, 0 as depth,
                        array[s.id]::bigint[] as visited
                 from bdb_satker s
                 where s.id=$1 and s.is_synthetic=false and s.dors_mapping_aktif=true
                 union all
                 select p.id, p.kode, p.deskripsi, p.parent_id, p.tipe_satker, c.depth + 1,
                        c.visited || p.id
                 from satker_chain c
                 join bdb_satker p on p.id=c.parent_id
                 where c.depth < 32 and not (p.id = any(c.visited))
             )
             select id, kode, deskripsi, parent_id, tipe_satker, depth
             from satker_chain
             order by depth`, [satkerId]);
        if (!chain.length)
            throw new common_1.NotFoundException('Satker tujuan tidak ditemukan.');
        return (0, satker_placement_util_1.resolveSatkerPlacementFromChain)(chain);
    }
    async ensureTable() {
        if (!LaporanPolisiService_1.ensureTablePromise) {
            // Skema produksi dikelola saat deploy. Request biasa hanya memvalidasi
            // kontrak kolom, agar tidak mengantre ACCESS EXCLUSIVE lewat ALTER TABLE.
            LaporanPolisiService_1.ensureTablePromise = this.dataSource.query(`
                select id,dors_lp_id,model_lp,raw_lp_id,satker_id,unit_satker_id,
                       deleted_at,dilimpahkan_eksternal,sudah_dilimpahkan
                from bdb_laporan_polisi where false
            `).catch((error) => {
                LaporanPolisiService_1.ensureTablePromise = null;
                throw error;
            });
        }
        await LaporanPolisiService_1.ensureTablePromise;
    }
    async ensureTableLocked() {
        const runner = this.dataSource.createQueryRunner();
        await runner.connect();
        await runner.startTransaction();
        try {
            await runner.query('select pg_advisory_xact_lock(20260812, 1)');
            await runner.query(`
            create table if not exists bdb_laporan_polisi (
                id bigserial primary key,
                dors_lp_id bigint not null,
                model_lp text not null,
                raw_lp_id bigint references bdb_dors_raw_lp(id) on delete set null,
                no_laporan text, tgl_laporan text, kategori text, tempat_kejadian text, uraian_singkat text,
                penanganan_level text, kode_pusiknas text,
                satker_id bigint references bdb_satker(id) on delete set null,
                satker_nama text, unit_nama text, unit_level text,
                data_scope text, status text not null default 'BARU', payload_json jsonb,
                synced_at timestamp not null default now(),
                created_at timestamp not null default now(),
                updated_at timestamp not null default now(),
                unique (dors_lp_id, model_lp)
            );
            alter table bdb_laporan_polisi add column if not exists unit_satker_id bigint references bdb_satker(id) on delete set null;
            alter table bdb_laporan_polisi add column if not exists unit_satker_nama text;
            alter table bdb_laporan_polisi add column if not exists unit_satker_kode text;
            alter table bdb_laporan_polisi add column if not exists deleted_at timestamp;
            alter table bdb_laporan_polisi add column if not exists deleted_by bigint references auth_users(id) on delete set null;
            alter table bdb_laporan_polisi add column if not exists delete_reason text;
            -- self-heal di sini juga (bukan cuma di lp-pelimpahan.service.ts) -- list()/detail()/stats()
            -- di service INI langsung query kolom ini, jangan sampai halaman Daftar LP ikut rusak
            -- kalau modul pelimpahan kebetulan belum sempat jalan/ensureTable() dulu.
            alter table bdb_laporan_polisi add column if not exists dilimpahkan_eksternal boolean not null default false;
            create index if not exists bdb_laporan_polisi_dilimpahkan_eksternal_idx on bdb_laporan_polisi (dilimpahkan_eksternal);
            create index if not exists bdb_laporan_polisi_deleted_idx on bdb_laporan_polisi (deleted_at);
            create index if not exists bdb_laporan_polisi_satker_idx on bdb_laporan_polisi (satker_id);
            create index if not exists bdb_laporan_polisi_unitsatker_idx on bdb_laporan_polisi (unit_satker_id);
            create index if not exists bdb_laporan_polisi_level_idx on bdb_laporan_polisi (penanganan_level);
            create index if not exists bdb_laporan_polisi_nolap_idx on bdb_laporan_polisi (lower(no_laporan));
            `);
            await this.ensureDefaultStatusTrigger(runner);
            await this.ensureMasterDataLinkColumns(runner);
            await runner.commitTransaction();
        }
        catch (error) {
            await runner.rollbackTransaction();
            throw error;
        }
        finally {
            await runner.release();
        }
    }
    async ensureDefaultStatusTrigger(runner) {
        await runner.query(`
            create or replace function bdb_lp_default_status() returns trigger as $f$
            begin
                if new.status_id is null then
                    new.status_id := (select id from bdb_status_master where code = 'LP' limit 1);
                end if;
                return new;
            end;
            $f$ language plpgsql;
            drop trigger if exists trg_bdb_lp_default_status on bdb_laporan_polisi;
            create trigger trg_bdb_lp_default_status
                before insert on bdb_laporan_polisi
                for each row execute function bdb_lp_default_status();
        `);
        await runner.query(`
            update bdb_laporan_polisi
            set status_id = (select id from bdb_status_master where code = 'LP' limit 1)
            where status_id is null and deleted_at is null
        `);
    }
    async ensureMasterDataLinkColumns(runner) {
        await runner.query(`
            alter table bdb_laporan_polisi add column if not exists jenis_kejahatan_id bigint references cm_jenis_kejahatan(id) on delete set null;
            alter table bdb_laporan_polisi add column if not exists golongan_kejahatan_id bigint references cm_golongan_kejahatan(id) on delete set null;
            alter table bdb_laporan_polisi add column if not exists kategori_lokasi_id bigint references cm_kategori_lokasi(id) on delete set null;
            alter table bdb_laporan_polisi add column if not exists motif_kejahatan_id bigint references cm_motif_kejahatan(id) on delete set null;
            alter table bdb_laporan_polisi add column if not exists modus_operandi_id bigint references cm_modus_operandi(id) on delete set null;
            alter table bdb_laporan_polisi add column if not exists tkp_provinsi_code bigint references cm_provinsi(code) on delete set null;
            alter table bdb_laporan_polisi add column if not exists tkp_kabupaten_code bigint references cm_kabupaten(code) on delete set null;
            alter table bdb_laporan_polisi add column if not exists tkp_kecamatan_code bigint references cm_kecamatann(code) on delete set null;
            alter table bdb_laporan_polisi add column if not exists tkp_desa_code bigint references cm_desa(code) on delete set null;
            alter table bdb_laporan_polisi add column if not exists master_data_linked_at timestamp;
            create index if not exists bdb_laporan_polisi_jk_idx on bdb_laporan_polisi (jenis_kejahatan_id);
            create index if not exists bdb_laporan_polisi_golongan_kejahatan_idx on bdb_laporan_polisi (golongan_kejahatan_id);
            create index if not exists bdb_laporan_polisi_lokasi_idx on bdb_laporan_polisi (kategori_lokasi_id);
            create table if not exists bdb_lp_tindak_pidana_dors (
                id bigserial primary key,
                laporan_polisi_id bigint not null references bdb_laporan_polisi(id) on delete cascade,
                dors_tp_id bigint,
                jenis_kejahatan_id bigint references cm_jenis_kejahatan(id) on delete set null,
                undang_undang_id bigint references cm_undang_undang(id) on delete set null,
                nama_kategori_kejahatan text, nama_uu text,
                pasal_mapping text, pasal_tambahan text, juncto text, subsider text,
                created_at timestamp not null default now(),
                unique (laporan_polisi_id, dors_tp_id)
            );
            create index if not exists bdb_lp_tp_dors_lp_idx on bdb_lp_tindak_pidana_dors(laporan_polisi_id);
        `);
    }
    async autoRegisterMasterData() {
        const NA = "'(Tidak diketahui - dari DORS)'";
        await this.dataSource.query(`
            insert into cm_jenis_kejahatan (id, keterangan, status_aktif, id_sub_golongan, "golonganKejahatanId", created_at, updated_at)
            select distinct on ((lp.payload_json->'kategori_gk'->>'id')::bigint)
                   (lp.payload_json->'kategori_gk'->>'id')::bigint,
                   coalesce(nullif(lp.payload_json->'kategori_gk'->>'keterangan',''), ${NA}), true,
                   nullif(lp.payload_json->'kategori_gk'->>'id_sub_golongan','')::int,
                   case when nullif(lp.payload_json->'kategori_gk'->>'id_sub_golongan','')::int in (1,2,3,4)
                        then nullif(lp.payload_json->'kategori_gk'->>'id_sub_golongan','')::bigint end,
                   now(), now()
            from bdb_laporan_polisi lp
            where lp.jenis_kejahatan_id is null and nullif(lp.payload_json->'kategori_gk'->>'id','') ~ '^[0-9]+$'
            order by (lp.payload_json->'kategori_gk'->>'id')::bigint
            on conflict (id) do nothing;

            -- Jaga-jaga: baris cm_jenis_kejahatan lama (dari sinkronisasi sebelum kolom ini ada,
            -- atau sempat gagal terisi) yg id_sub_golongan-nya sudah dikenal tapi golongan resminya
            -- belum di-set -- self-heal tiap sync, idempotent.
            update cm_jenis_kejahatan
               set "golonganKejahatanId" = id_sub_golongan
             where id_sub_golongan in (1,2,3,4) and "golonganKejahatanId" is null;

            insert into cm_kategori_lokasi (id, name, created_at, updated_at)
            select distinct nullif(lp.payload_json->>'id_kategori_lokasi','')::bigint,
                   coalesce(nullif(lp.payload_json->'kategori_lokasi'->>'lokasi',''), ${NA}), now(), now()
            from bdb_laporan_polisi lp
            where lp.kategori_lokasi_id is null and nullif(lp.payload_json->>'id_kategori_lokasi','') ~ '^[0-9]+$'
            on conflict (id) do nothing;

            insert into cm_motif_kejahatan (id, name, created_at, updated_at)
            select distinct nullif(lp.payload_json->>'id_emp_motif_kejahatan','')::bigint,
                   coalesce(nullif(lp.payload_json->>'motif_kejahatan',''), ${NA}), now(), now()
            from bdb_laporan_polisi lp
            where lp.motif_kejahatan_id is null and nullif(lp.payload_json->>'id_emp_motif_kejahatan','') ~ '^[0-9]+$'
            on conflict (id) do nothing;

            insert into cm_modus_operandi (id, name, created_at, updated_at)
            select distinct nullif(lp.payload_json->>'id_emp_modus_operandi','')::bigint,
                   coalesce(nullif(lp.payload_json->>'modus_operandi',''), ${NA}), now(), now()
            from bdb_laporan_polisi lp
            where lp.modus_operandi_id is null and nullif(lp.payload_json->>'id_emp_modus_operandi','') ~ '^[0-9]+$'
            on conflict (id) do nothing;

            insert into cm_undang_undang (id, name, created_at, updated_at)
            select distinct nullif(elem->>'id_uu','')::bigint,
                   coalesce(nullif(elem->>'nama_uu',''), ${NA}), now(), now()
            from bdb_laporan_polisi lp
            cross join lateral jsonb_array_elements(coalesce(lp.payload_json->'tindak_pidana', '[]'::jsonb)) elem
            where nullif(elem->>'id_uu','') ~ '^[0-9]+$'
              and not exists (select 1 from cm_undang_undang u where u.id = (elem->>'id_uu')::bigint)
            on conflict (id) do nothing;

            insert into cm_provinsi (code, name, created_at, updated_at)
            select distinct nullif(lp.payload_json->>'tkp_id_provinsi','')::bigint,
                   coalesce(nullif(lp.payload_json->'tkp_provinsi'->>'provinsi',''), ${NA}), now(), now()
            from bdb_laporan_polisi lp
            where lp.tkp_provinsi_code is null and nullif(lp.payload_json->>'tkp_id_provinsi','') ~ '^[0-9]+$'
            on conflict (code) do nothing;

            insert into cm_kabupaten (code, name, "provinsiCode", created_at, updated_at)
            select distinct nullif(lp.payload_json->>'tkp_id_kota','')::bigint,
                   coalesce(nullif(lp.payload_json->'tkp_kota'->>'kabupaten',''), ${NA}),
                   nullif(lp.payload_json->>'tkp_id_provinsi','')::bigint, now(), now()
            from bdb_laporan_polisi lp
            where lp.tkp_kabupaten_code is null and nullif(lp.payload_json->>'tkp_id_kota','') ~ '^[0-9]+$'
            on conflict (code) do nothing;

            insert into cm_kecamatann (code, name, "kabupatenCode", "provinsiCode", created_at, updated_at)
            select distinct nullif(lp.payload_json->>'tkp_id_kecamatan','')::bigint,
                   coalesce(nullif(lp.payload_json->'tkp_kecamatan'->>'kecamatan',''), ${NA}),
                   nullif(lp.payload_json->>'tkp_id_kota','')::bigint, nullif(lp.payload_json->>'tkp_id_provinsi','')::bigint, now(), now()
            from bdb_laporan_polisi lp
            where lp.tkp_kecamatan_code is null and nullif(lp.payload_json->>'tkp_id_kecamatan','') ~ '^[0-9]+$'
            on conflict (code) do nothing;

            insert into cm_desa (code, name, "kecamatanCode", "kabupatenCode", "provinsiCode", created_at, updated_at)
            select distinct nullif(lp.payload_json->>'tkp_id_desa','')::bigint,
                   coalesce(nullif(lp.payload_json->'tkp_desa'->>'desa',''), ${NA}),
                   nullif(lp.payload_json->>'tkp_id_kecamatan','')::bigint, nullif(lp.payload_json->>'tkp_id_kota','')::bigint,
                   nullif(lp.payload_json->>'tkp_id_provinsi','')::bigint, now(), now()
            from bdb_laporan_polisi lp
            where lp.tkp_desa_code is null and nullif(lp.payload_json->>'tkp_id_desa','') ~ '^[0-9]+$'
            on conflict (code) do nothing;
        `);
    }
    async linkMasterData() {
        await this.ensureTable();
        await this.autoRegisterMasterData();
        const started = Date.now();
        const updated = await this.dataSource.query(`
            with candidates as (
                select
                    lp.id,
                    nullif(lp.payload_json->'kategori_gk'->>'id','')::bigint as jk_raw,
                    nullif(lp.payload_json->'kategori_gk'->>'id_sub_golongan','')::bigint as gk_raw,
                    nullif(lp.payload_json->>'id_kategori_lokasi','')::bigint as kl_raw,
                    nullif(lp.payload_json->>'id_emp_motif_kejahatan','')::bigint as mk_raw,
                    nullif(lp.payload_json->>'id_emp_modus_operandi','')::bigint as mo_raw,
                    nullif(lp.payload_json->>'tkp_id_provinsi','')::bigint as prov_raw,
                    nullif(lp.payload_json->>'tkp_id_kota','')::bigint as kab_raw,
                    nullif(lp.payload_json->>'tkp_id_kecamatan','')::bigint as kec_raw,
                    nullif(lp.payload_json->>'tkp_id_desa','')::bigint as desa_raw
                from bdb_laporan_polisi lp
                where lp.master_data_linked_at is null
            )
            update bdb_laporan_polisi lp set
                jenis_kejahatan_id = jk.id,
                golongan_kejahatan_id = gk.id,
                kategori_lokasi_id = kl.id,
                motif_kejahatan_id = mk.id,
                modus_operandi_id = mo.id,
                tkp_provinsi_code = prov.code,
                tkp_kabupaten_code = kab.code,
                tkp_kecamatan_code = kec.code,
                tkp_desa_code = desa.code,
                master_data_linked_at = now()
            from candidates c
            left join cm_jenis_kejahatan jk on jk.id = c.jk_raw
            left join cm_golongan_kejahatan gk on gk.id = c.gk_raw
            left join cm_kategori_lokasi kl on kl.id = c.kl_raw
            left join cm_motif_kejahatan mk on mk.id = c.mk_raw
            left join cm_modus_operandi mo on mo.id = c.mo_raw
            left join cm_provinsi prov on prov.code = c.prov_raw
            left join cm_kabupaten kab on kab.code = c.kab_raw
            left join cm_kecamatann kec on kec.code = c.kec_raw
            left join cm_desa desa on desa.code = c.desa_raw
            where lp.id = c.id
            returning lp.id
        `);
        const n = Array.isArray(updated?.[0]) ? updated[0].length : 0;
        const tp = await this.dataSource.query(`
            insert into bdb_lp_tindak_pidana_dors
                (laporan_polisi_id, dors_tp_id, jenis_kejahatan_id, undang_undang_id,
                 nama_kategori_kejahatan, nama_uu, pasal_mapping, pasal_tambahan, juncto, subsider)
            select lp.id, (elem->>'id')::bigint,
                   jk.id, uu.id,
                   elem->>'nama_kategori_kejahatan', elem->>'nama_uu',
                   elem->>'pasal_mapping', elem->>'pasal_tambahan', elem->>'juncto', elem->>'subsider'
            from bdb_laporan_polisi lp
            cross join lateral jsonb_array_elements(coalesce(lp.payload_json->'tindak_pidana', '[]'::jsonb)) elem
            left join cm_jenis_kejahatan jk on jk.id = nullif(elem->>'id_kategori_kejahatan','')::bigint
            left join cm_undang_undang uu on uu.id = nullif(elem->>'id_uu','')::bigint
            where not exists (
                select 1 from bdb_lp_tindak_pidana_dors x
                where x.laporan_polisi_id = lp.id and x.dors_tp_id = (elem->>'id')::bigint
            )
            on conflict (laporan_polisi_id, dors_tp_id) do nothing
            returning id
        `);
        const nTp = Array.isArray(tp) ? tp.length : 0;
        this.logger.log(`Link master data: ${n} LP di-link, ${nTp} rincian tindak pidana ditambahkan, ${Date.now() - started}ms`);
        return { lp_linked: n, tindak_pidana_added: nTp };
    }
    mappingConfig() {
        try {
            const p = (0, path_1.join)(process.cwd(), 'config', 'dors-unit-mapping.json');
            const raw = JSON.parse((0, fs_1.readFileSync)(p, 'utf8'));
            return {
                units: raw?.units || {},
                mabes_units: raw?.mabes_units || {},
                polsek_min_lp_id: Number(raw?.polsek_min_lp_id) || Number.MAX_SAFE_INTEGER,
            };
        }
        catch (e) {
            this.logger.warn('config/dors-unit-mapping.json tidak terbaca: ' + (e?.message || e));
            return { units: {}, mabes_units: {}, polsek_min_lp_id: Number.MAX_SAFE_INTEGER };
        }
    }
    unitMapping() {
        return this.mappingConfig().units;
    }
    async mapMabesByUnit() {
        await this.ensureTable();
        const mabes = this.mappingConfig().mabes_units;
        const pairs = Object.entries(mabes)
            .map(([dors, kw]) => [String(dors).toUpperCase().replace(/[^A-Z0-9]/g, ''), String(kw).toUpperCase().replace(/[^A-Z0-9]/g, '')])
            .filter(([d, k]) => d && k);
        if (!pairs.length)
            return 0;
        const valuesSql = pairs.map(([d, k]) => `('${d}','${k}')`).join(',');
        const KP = LaporanPolisiService_1.KP_SQL;
        const ret = await this.dataSource.query(`
            insert into bdb_laporan_polisi
                (dors_lp_id, model_lp, raw_lp_id, no_laporan, tgl_laporan, kategori, tempat_kejadian, uraian_singkat,
                 penanganan_level, kode_pusiknas, satker_id, satker_nama, unit_nama, unit_level, data_scope, payload_json, synced_at)
            select distinct on (r.dors_lp_id, r.model_lp)
                   r.dors_lp_id, r.model_lp, r.id,
                   r.no_laporan, r.payload_json->>'tgl_laporan', r.payload_json->>'kategori', r.payload_json->>'tempat_kejadian',
                   coalesce(r.payload_json->>'uraian_singkat_kejadian', r.payload_json->>'uraian_kejadian'),
                   'Mabes', ${KP}, s.id, s.deskripsi,
                   r.payload_json->'unit'->>'unit', r.payload_json->'unit'->>'level', r.data_scope, r.payload_json, now()
            from bdb_dors_raw_lp r
            join (values ${valuesSql}) cfg(dors, kw)
              on upper(regexp_replace(coalesce(r.payload_json->'unit'->>'unit',''),'[^A-Za-z0-9]','','g')) = cfg.dors
            join bdb_satker s
              on regexp_replace(upper(s.deskripsi),'[^A-Z0-9]','','g') like '%' || cfg.kw || '%' and s.dors_mapping_aktif=true
            where jsonb_typeof(r.payload_json->'polda')='object' and r.payload_json->'polda'->>'nama' ilike '%mabes%'
              and not exists (select 1 from bdb_laporan_polisi lp where lp.dors_lp_id=r.dors_lp_id and lp.model_lp=r.model_lp)
            order by r.dors_lp_id, r.model_lp, s.id
            on conflict (dors_lp_id, model_lp) do nothing
            returning id
        `);
        const n = Array.isArray(ret) ? ret.length : 0;
        this.logger.log(`Map Mabes via unit: ${n} LP dipetakan ke satker Bareskrim/Densus.`);
        return n;
    }
    async remapDeeper() {
        await this.ensureTable();
        const units = this.unitMapping();
        const polsekMinLpId = this.mappingConfig().polsek_min_lp_id;
        const offenseConflictSql = LaporanPolisiService_1.narkobaPenggelapanConflictSql('lp0');
        let updated = 0;
        for (const [unit, keyword] of Object.entries(units)) {
            const kw = String(keyword).toUpperCase().replace(/[^A-Z0-9]/g, '');
            if (!kw)
                continue;
            const ret = await this.dataSource.query(`with tujuan_unik as (
                   select lp0.id as lp_id, min(c.id) as target_id
                   from bdb_laporan_polisi lp0
                   join bdb_satker c
                     on c.parent_id = lp0.satker_id
                    and coalesce(c.is_synthetic,false) = false and c.dors_mapping_aktif=true
                    and upper(coalesce(c.tipe_satker,'FUNGSI')) not in ('POLDA','POLRES','POLSEK')
                    and regexp_replace(upper(c.deskripsi),'[^A-Z0-9]','','g') like '%' || $2 || '%'
                   where upper(coalesce(lp0.penanganan_level,'')) in ('POLDA','POLRES','POLSEK','MABES')
                     and lp0.deleted_at is null
                     and lp0.unit_satker_id is null
                     and lower(coalesce(lp0.payload_json#>>'{_cas_owner_override,locked}','')) <> 'true'
                     and (upper(coalesce(lp0.penanganan_level,'')) <> 'POLSEK' or lp0.id >= $3)
                     and upper(regexp_replace(coalesce(lp0.unit_nama,''),'[^A-Za-z0-9]','','g')) = $1
                     and not coalesce(lp0.sudah_dilimpahkan,false)
                     and not coalesce(lp0.dilimpahkan_eksternal,false)
                     and not exists (
                       select 1 from bdb_lp_pelimpahan ph where ph.lp_id = lp0.id
                     )
                     and not ($2 = 'NARKOBA' and (${offenseConflictSql}))
                   group by lp0.id
                   having count(distinct c.id) = 1
                 )
                 update bdb_laporan_polisi lp
                 set unit_satker_id = c.id,
                     unit_satker_nama = c.deskripsi,
                     unit_satker_kode = c.kode,
                     updated_at = now()
                 from tujuan_unik t
                 join bdb_satker c on c.id = t.target_id
                 where lp.id = t.lp_id
                   and lp.unit_satker_id is null
                   and lower(coalesce(lp.payload_json#>>'{_cas_owner_override,locked}','')) <> 'true'
                   and not coalesce(lp.sudah_dilimpahkan,false)
                   and not coalesce(lp.dilimpahkan_eksternal,false)
                   and not exists (
                     select 1 from bdb_lp_pelimpahan ph where ph.lp_id = lp.id
                   )
                 returning lp.id`, [unit, kw, polsekMinLpId]);
            updated += Array.isArray(ret?.[0]) ? ret[0].length : 0;
        }
        const polsekRet = await this.dataSource.query(`with tujuan_unik as (
               select lp0.id as lp_id, min(c.id) as target_id
               from bdb_laporan_polisi lp0
               join bdb_satker c
                 on c.parent_id = lp0.satker_id
                and coalesce(c.is_synthetic,false) = false
                and c.dors_mapping_aktif = true
               join bdb_satker_taxonomy_r11 tx
                 on tx.source_table = 'BDB_SATKER'
                and tx.entity_id = c.id
                and tx.organization_domain = 'INTERNAL_POLRI'
                and tx.function_domain = 'INTERNAL_RESERSE'
                and tx.counting_eligible = true
               where upper(coalesce(lp0.penanganan_level,'')) = 'POLSEK'
                 and lp0.id >= $1
                 and lp0.deleted_at is null
                 and lp0.unit_satker_id is null
                 and lower(coalesce(lp0.payload_json#>>'{_cas_owner_override,locked}','')) <> 'true'
                 and not coalesce(lp0.sudah_dilimpahkan,false)
                 and not coalesce(lp0.dilimpahkan_eksternal,false)
                 and not exists (
                   select 1 from bdb_lp_pelimpahan ph where ph.lp_id = lp0.id
                 )
               group by lp0.id
               having count(distinct c.id) = 1
             )
             update bdb_laporan_polisi lp
             set unit_satker_id = c.id,
                 unit_satker_nama = c.deskripsi,
                 unit_satker_kode = c.kode,
                 updated_at = now()
             from tujuan_unik t
             join bdb_satker c on c.id = t.target_id
             where lp.id = t.lp_id
               and lp.unit_satker_id is null
               and lower(coalesce(lp.payload_json#>>'{_cas_owner_override,locked}','')) <> 'true'
               and not coalesce(lp.sudah_dilimpahkan,false)
               and not coalesce(lp.dilimpahkan_eksternal,false)
               and not exists (
                 select 1 from bdb_lp_pelimpahan ph where ph.lp_id = lp.id
               )
             returning lp.id`, [polsekMinLpId]);
        updated += Array.isArray(polsekRet?.[0]) ? polsekRet[0].length : 0;
        this.logger.log(`Remap dalam: ${updated} LP dipetakan ke unit satker terdalam.`);
        return updated;
    }
    async autoReconcileExistingForSatker(satkerId) {
        await this.ensureTable();
        await this.ensureAliasTable();
        const targetId = Number(satkerId);
        if (!Number.isInteger(targetId) || targetId <= 0)
            throw new common_1.BadRequestException('Target auto-reconcile tidak valid.');
        const placement = await this.resolveSatkerPlacement(targetId);
        const targetTerritoryId = Number(placement.satker.id);
        const selectedUnitId = placement.unit ? Number(placement.unit.id) : null;
        const offenseConflictSql = LaporanPolisiService_1.narkobaPenggelapanConflictSql('lp');
        const batchSize = 500;
        const maxBatches = 20;
        let reconciled = 0;
        let audited = 0;
        let aliases = 0;
        let batches = 0;
        for (; batches < maxBatches; batches++) {
            const runner = this.dataSource.createQueryRunner();
            await runner.connect();
            await runner.startTransaction();
            try {
                await runner.query(`set local statement_timeout = '30s'`);
                const rows = await runner.query(`
                    with target_territory as materialized (
                        select id, kode, kode_canonical, dors_kode, deskripsi
                        from bdb_satker
                        where id=$1
                          and coalesce(is_synthetic,false)=false
                          and dors_mapping_aktif=true
                          and upper(coalesce(tipe_satker,'')) in ('POLDA','POLRES','POLSEK')
                        for share
                    ),
                    candidates as materialized (
                        select
                            lp.id,
                            lp.no_laporan,
                            lp.satker_id as old_satker_id,
                            lp.satker_nama as old_satker_nama,
                            lp.unit_satker_id as old_unit_id,
                            lp.unit_satker_nama as old_unit_nama,
                            lower(coalesce(lp.payload_json->'unit'->>'level',lp.unit_level,'')) as target_level,
                            nullif(trim(coalesce(
                                case lower(coalesce(lp.payload_json->'unit'->>'level',lp.unit_level,''))
                                    when 'polda' then lp.payload_json->'polda'->>'kode_pusiknas'
                                    when 'polres' then case
                                        when lp.payload_json->'polres'->>'kode'='060.30.22'
                                          then '060.01.30.35'
                                        else lp.payload_json->'polres'->>'kode_pusiknas'
                                    end
                                    when 'polsek' then lp.payload_json->'polsek'->>'kode_pusiknas'
                                end,
                                lp.kode_pusiknas
                            )), '') as target_kp,
                            nullif(trim(case lower(coalesce(lp.payload_json->'unit'->>'level',lp.unit_level,''))
                                when 'polda' then lp.payload_json->'polda'->>'nama'
                                when 'polres' then lp.payload_json->'polres'->>'nama'
                                when 'polsek' then lp.payload_json->'polsek'->>'nama'
                            end), '') as target_nama,
                            nullif(trim(case lower(coalesce(lp.payload_json->'unit'->>'level',lp.unit_level,''))
                                when 'polres' then lp.payload_json->'polda'->>'nama'
                                when 'polsek' then lp.payload_json->'polres'->>'nama'
                            end), '') as target_parent_nama,
                            nullif(trim(coalesce(lp.payload_json->'unit'->>'unit',lp.unit_nama)), '') as target_unit_nama,
                            upper(regexp_replace(coalesce(lp.payload_json->'unit'->>'unit',lp.unit_nama,''),'[^A-Za-z0-9]','','g')) as target_unit
                        from bdb_laporan_polisi lp
                        cross join target_territory tt
                        where lp.deleted_at is null
                          and not coalesce(lp.sudah_dilimpahkan,false)
                          and not coalesce(lp.dilimpahkan_eksternal,false)
                          and lower(coalesce(lp.payload_json#>>'{_cas_owner_override,locked}','')) <> 'true'
                          and not exists (
                              select 1 from bdb_lp_pelimpahan ph where ph.lp_id=lp.id
                          )
                          and upper(regexp_replace(coalesce(
                              case lower(coalesce(lp.payload_json->'unit'->>'level',lp.unit_level,''))
                                  when 'polda' then lp.payload_json->'polda'->>'kode_pusiknas'
                                  when 'polres' then case
                                        when lp.payload_json->'polres'->>'kode'='060.30.22'
                                          then '060.01.30.35'
                                        else lp.payload_json->'polres'->>'kode_pusiknas'
                                    end
                                  when 'polsek' then lp.payload_json->'polsek'->>'kode_pusiknas'
                              end,
                              lp.kode_pusiknas,''
                          ),'[^A-Za-z0-9]','','g')) in (
                              upper(regexp_replace(coalesce(tt.kode,''),'[^A-Za-z0-9]','','g')),
                              upper(regexp_replace(coalesce(tt.kode_canonical,''),'[^A-Za-z0-9]','','g')),
                              upper(regexp_replace(coalesce(tt.dors_kode,''),'[^A-Za-z0-9]','','g'))
                          )
                          and upper(regexp_replace(coalesce(lp.payload_json->'unit'->>'unit',lp.unit_nama,''),'[^A-Za-z0-9]','','g')) <> ''
                          and not (
                              upper(regexp_replace(coalesce(lp.payload_json->'unit'->>'unit',lp.unit_nama,''),'[^A-Za-z0-9]','','g')) like '%NARKOBA%'
                              and (${offenseConflictSql})
                          )
                    ),
                    unit_candidates as materialized (
                        select c.id as lp_id, u.id as unit_id
                        from candidates c
                        join bdb_satker u
                          on u.parent_id=$1
                         and coalesce(u.is_synthetic,false)=false
                         and u.dors_mapping_aktif=true
                         and upper(coalesce(u.tipe_satker,'FUNGSI'))='FUNGSI'
                         and ($2::bigint is null or u.id=$2::bigint)
                        cross join lateral (
                            select
                                regexp_replace(upper(coalesce(u.deskripsi,'')),'[^A-Z0-9]','','g') as deskripsi_key,
                                regexp_replace(upper(coalesce(u.nama_satker_dors,'')),'[^A-Z0-9]','','g') as dors_nama_key,
                                regexp_replace(upper(coalesce(u.operational_role,'')),'[^A-Z0-9]','','g') as role_key,
                                regexp_replace(upper(concat_ws(' ',u.deskripsi,u.nama_satker_dors,u.operational_role)),'[^A-Z0-9]','','g') as label
                        ) norm
                        where c.target_unit = norm.deskripsi_key
                           or (norm.dors_nama_key <> '' and c.target_unit = norm.dors_nama_key)
                           or (norm.role_key <> '' and c.target_unit = norm.role_key)
                           or case c.target_unit
                                when 'SATRESKRIM' then norm.label like 'SATRESKRIM%'
                                when 'SATRESNARKOBA' then norm.label like 'SATRESNARKOBA%' or norm.label like 'SATNARKOBA%'
                                when 'SATRESPPADANPPO' then norm.label like '%PPA%' and norm.label like '%PPO%'
                                when 'DITRESKRIMUM' then norm.label like 'DITRESKRIMUM%' or norm.label like 'DITKRIMUM%'
                                when 'DITPPADANPPO' then norm.label like '%PPA%' and norm.label like '%PPO%'
                                when 'RESKRIM' then norm.label like 'UNITRESKRIM%' or norm.label like 'RESKRIM%'
                                else false
                              end
                    ),
                    resolved as materialized (
                        select c.*, min(uc.unit_id)::bigint as unit_id
                        from candidates c
                        join unit_candidates uc on uc.lp_id=c.id
                        group by c.id, c.no_laporan, c.old_satker_id, c.old_satker_nama,
                                 c.old_unit_id, c.old_unit_nama, c.target_level, c.target_kp,
                                 c.target_nama, c.target_parent_nama, c.target_unit_nama, c.target_unit
                        having count(distinct uc.unit_id)=1
                    ),
                    scoped as materialized (
                        select r.*, tt.deskripsi as territory_nama,
                               u.deskripsi as unit_nama, u.kode as unit_kode
                        from resolved r
                        cross join target_territory tt
                        join bdb_satker u on u.id=r.unit_id
                        where (r.old_satker_id,r.old_unit_id)
                              is distinct from (tt.id,r.unit_id)
                          and not exists (
                              select 1
                              from bdb_dors_satker_map a
                              join bdb_satker active_target
                                on active_target.id=a.satker_id
                               and active_target.dors_mapping_aktif=true
                              where a.unit_nama is not null
                                and a.dors_kode_pusiknas is not null
                                and upper(regexp_replace(a.dors_kode_pusiknas,'[^A-Za-z0-9]','','g'))
                                    = upper(regexp_replace(r.target_kp,'[^A-Za-z0-9]','','g'))
                                and upper(regexp_replace(a.unit_nama,'[^A-Za-z0-9]','','g'))
                                    = r.target_unit
                                and a.satker_id <> r.unit_id
                          )
                        order by r.id
                        limit $3
                    ),
                    locked as materialized (
                        select s.*
                        from scoped s
                        join bdb_laporan_polisi lp on lp.id=s.id
                        where lp.deleted_at is null
                          and not coalesce(lp.sudah_dilimpahkan,false)
                          and not coalesce(lp.dilimpahkan_eksternal,false)
                          and lower(coalesce(lp.payload_json#>>'{_cas_owner_override,locked}','')) <> 'true'
                          and not exists (
                              select 1 from bdb_lp_pelimpahan ph where ph.lp_id=lp.id
                          )
                          and (lp.satker_id,lp.unit_satker_id)
                              is distinct from ($1::bigint,s.unit_id)
                        for update of lp
                    ),
                    audit_inserted as (
                        insert into bdb_audit_log
                            (user_id,user_nama,action,entity,entity_id,meta,ip,outcome)
                        select null,
                               'SYSTEM AUTO RECONCILE',
                               'AUTO_CORRECT_SATKER',
                               'laporan_polisi',
                               l.id::text,
                               jsonb_build_object(
                                   'no_laporan',l.no_laporan,
                                   'satker_lama_id',l.old_satker_id,
                                   'satker_lama_nama',l.old_satker_nama,
                                   'unit_satker_lama_id',l.old_unit_id,
                                   'unit_satker_lama_nama',l.old_unit_nama,
                                   'satker_baru_id',$1::bigint,
                                   'satker_baru_nama',l.territory_nama,
                                   'unit_satker_baru_id',l.unit_id,
                                   'unit_satker_baru_nama',l.unit_nama,
                                   'auto_reconcile_existing',true,
                                   'dors_identity',jsonb_build_object(
                                       'level',l.target_level,
                                       'kode_pusiknas',l.target_kp,
                                       'nama',l.target_nama,
                                       'unit_nama',l.target_unit_nama
                                   )
                               ),
                               null,
                               'SUCCESS'
                        from locked l
                        returning entity_id
                    ),
                    updated as (
                        update bdb_laporan_polisi lp
                        set satker_id=$1,
                            satker_nama=l.territory_nama,
                            unit_satker_id=l.unit_id,
                            unit_satker_nama=l.unit_nama,
                            unit_satker_kode=l.unit_kode,
                            updated_at=now()
                        from locked l
                        join audit_inserted a on a.entity_id=l.id::text
                        where lp.id=l.id
                          and (lp.satker_id,lp.unit_satker_id)
                              is distinct from ($1::bigint,l.unit_id)
                        returning lp.id
                    ),
                    alias_inserted as (
                        insert into bdb_dors_satker_map
                            (dors_kode_pusiknas,dors_nama,dors_parent_nama,unit_nama,
                             satker_id,satker_nama,catatan)
                        select distinct l.target_kp,
                               coalesce(l.target_nama,l.territory_nama),
                               l.target_parent_nama,
                               l.target_unit_nama,
                               l.unit_id,
                               l.unit_nama,
                               'auto reconcile existing'
                        from locked l
                        join updated u on u.id=l.id
                        where coalesce(l.target_nama,l.territory_nama) is not null
                          and l.target_unit_nama is not null
                        on conflict (
                            coalesce(dors_kode_pusiknas,''),
                            lower(dors_nama),
                            lower(coalesce(dors_parent_nama,'')),
                            lower(coalesce(unit_nama,''))
                        )
                        do update set
                            satker_id=excluded.satker_id,
                            satker_nama=excluded.satker_nama,
                            catatan='auto reconcile existing',
                            updated_at=now()
                        returning id
                    )
                    select
                        (select count(*)::int from updated) as reconciled,
                        (select count(*)::int from audit_inserted) as audited,
                        (select count(*)::int from alias_inserted) as aliases
                `, [targetTerritoryId, selectedUnitId, batchSize]);
                const summary = rows[0] || {};
                const changed = Number(summary.reconciled || 0);
                const batchAudited = Number(summary.audited || 0);
                if (changed !== batchAudited)
                    throw new Error(`Auto-reconcile audit mismatch: updated=${changed}, audit=${batchAudited}.`);
                await runner.commitTransaction();
                reconciled += changed;
                audited += batchAudited;
                aliases += Number(summary.aliases || 0);
                if (changed < batchSize)
                    break;
            }
            catch (error) {
                await runner.rollbackTransaction();
                throw error;
            }
            finally {
                await runner.release();
            }
        }
        const truncated = batches >= maxBatches && reconciled >= batchSize * maxBatches;
        if (reconciled > 0) {
            this.logger.log(`Auto-reconcile satker ${targetId}: ${reconciled} LP diperbaiki, ${audited} audit, ${aliases} alias.`);
        }
        return {
            target_satker_id: targetId,
            target_territory_id: targetTerritoryId,
            selected_unit_id: selectedUnitId,
            reconciled,
            audited,
            aliases,
            truncated
        };
    }
    async syncPelimpahanOwnershipFromDors() {
        const rows = await this.dataSource.query(`
            with universe as materialized (
                select
                    lp.id,
                    lp.dors_lp_id,
                    lp.model_lp,
                    lp.satker_id,
                    lp.satker_nama,
                    lp.unit_satker_id,
                    lp.unit_satker_nama,
                    lp.sudah_dilimpahkan,
                    lp.dilimpahkan_eksternal,
                    lp.deleted_at,
                    lower(coalesce(lp.payload_json#>>'{_cas_owner_override,locked}','')) = 'true' as owner_override_locked,
                    r.id as raw_lp_id,
                    r.data_scope as raw_data_scope,
                    r.payload_json as raw_payload
                from bdb_laporan_polisi lp
                join bdb_dors_raw_lp r
                  on r.dors_lp_id = lp.dors_lp_id
                 and r.model_lp = lp.model_lp
                where coalesce(lp.payload_json->>'pelimpahan','') = '0'
                  and coalesce(r.payload_json->>'pelimpahan','') = '1'
            ),
            processable as materialized (
                select u.*
                from universe u
                where not coalesce(u.sudah_dilimpahkan,false)
                  and not coalesce(u.dilimpahkan_eksternal,false)
                  and not u.owner_override_locked
                  and u.deleted_at is null
                  and coalesce(u.unit_satker_id,u.satker_id) is not null
                  and not exists (
                      select 1
                      from bdb_lp_pelimpahan ph
                      where ph.lp_id = u.id
                  )
            ),
            target as materialized (
                select
                    p.*,
                    lower(p.raw_payload->'unit'->>'level') as target_level,
                    upper(trim(p.raw_payload->'unit'->>'unit')) as target_unit_nama,
                    upper(regexp_replace(coalesce(p.raw_payload->'unit'->>'unit',''),'[^A-Za-z0-9]','','g')) as target_unit,
                    nullif(trim(case lower(p.raw_payload->'unit'->>'level')
                        when 'polda' then p.raw_payload->'polda'->>'kode_pusiknas'
                        when 'polres' then case
                            when p.raw_payload->'polres'->>'kode'='060.30.22'
                              then '060.01.30.35'
                            else p.raw_payload->'polres'->>'kode_pusiknas'
                        end
                        when 'polsek' then p.raw_payload->'polsek'->>'kode_pusiknas'
                    end),'') as target_kp,
                    upper(trim(case lower(p.raw_payload->'unit'->>'level')
                        when 'polda' then p.raw_payload->'polda'->>'nama'
                        when 'polres' then p.raw_payload->'polres'->>'nama'
                        when 'polsek' then p.raw_payload->'polsek'->>'nama'
                    end)) as target_nama,
                    upper(trim(case lower(p.raw_payload->'unit'->>'level')
                        when 'polres' then p.raw_payload->'polda'->>'nama'
                        when 'polsek' then p.raw_payload->'polres'->>'nama'
                    end)) as target_parent_nama,
                    nullif(trim(case lower(p.raw_payload->'unit'->>'level')
                        when 'polres' then p.raw_payload->'polda'->>'kode_pusiknas'
                        when 'polsek' then case
                            when p.raw_payload->'polres'->>'kode'='060.30.22'
                              then '060.01.30.35'
                            else p.raw_payload->'polres'->>'kode_pusiknas'
                        end
                    end),'') as target_parent_kp,
                    case lower(p.raw_payload->'unit'->>'level')
                        when 'polres' then 'POLDA'
                        when 'polsek' then 'POLRES'
                    end as target_parent_level
                from processable p
                where lower(coalesce(p.raw_payload->'unit'->>'level','')) in ('polda','polres','polsek')
            ),
            territory_candidates as materialized (
                select t.id as lp_id, coalesce(pa.id,s.id) as territory_id
                from target t
                join bdb_satker s
                  on (s.kode = t.target_kp or s.kode_canonical = t.target_kp)
                 and coalesce(s.is_synthetic,false) = false
                 and s.dors_mapping_aktif = true
                 and upper(coalesce(s.tipe_satker,'')) = upper(t.target_level)
                left join lateral (
                    -- parent-aware exact-KP conflict guard
                    select min(child.id)::bigint as id
                    from bdb_satker parent
                    join bdb_satker child
                      on child.parent_id=parent.id
                     and coalesce(child.is_synthetic,false)=false
                     and child.dors_mapping_aktif=true
                     and upper(coalesce(child.tipe_satker,''))='POLSEK'
                     and (
                          regexp_replace(upper(coalesce(child.deskripsi,'')),'[^A-Z0-9]','','g')
                            = regexp_replace(upper(coalesce(t.target_nama,'')),'[^A-Z0-9]','','g')
                       or regexp_replace(upper(coalesce(child.nama_satker_dors,'')),'[^A-Z0-9]','','g')
                            = regexp_replace(upper(coalesce(t.target_nama,'')),'[^A-Z0-9]','','g')
                     )
                    where lower(coalesce(t.target_level,''))='polsek'
                      and t.target_parent_kp is not null
                      and (
                           parent.kode=t.target_parent_kp
                        or parent.kode_canonical=t.target_parent_kp
                      )
                      and s.parent_id is distinct from parent.id
                      and coalesce(parent.is_synthetic,false)=false
                      and parent.dors_mapping_aktif=true
                      and upper(coalesce(parent.tipe_satker,''))='POLRES'
                    having count(distinct child.id)=1
                ) pa on true
                where t.target_kp is not null

                union

                select t.id, s.id
                from target t
                join bdb_dors_satker_map dm
                  on upper(trim(dm.dors_nama)) = t.target_nama
                 and upper(trim(coalesce(dm.dors_parent_nama,''))) = coalesce(t.target_parent_nama,'')
                join bdb_satker s
                  on s.id = dm.satker_id
                 and coalesce(s.is_synthetic,false) = false
                 and s.dors_mapping_aktif = true
                 and upper(coalesce(s.tipe_satker,'')) = upper(t.target_level)
                where t.target_kp is null

                union

                select t.id, child.id
                from target t
                join bdb_satker parent
                  on (parent.kode = t.target_parent_kp or parent.kode_canonical = t.target_parent_kp)
                 and coalesce(parent.is_synthetic,false) = false
                 and parent.dors_mapping_aktif = true
                 and upper(coalesce(parent.tipe_satker,'')) = t.target_parent_level
                join bdb_satker child
                  on child.parent_id = parent.id
                 and coalesce(child.is_synthetic,false) = false
                 and child.dors_mapping_aktif = true
                 and upper(coalesce(child.tipe_satker,'')) = upper(t.target_level)
                 and (
                      upper(trim(coalesce(child.deskripsi,''))) = t.target_nama
                   or upper(trim(coalesce(child.nama_satker_dors,''))) = t.target_nama
                 )
                where t.target_kp is null
            ),
            territory_coverage as materialized (
                select
                    t.*,
                    coalesce(c.territory_count,0)::int as territory_count,
                    c.territory_id
                from target t
                left join lateral (
                    select
                        count(distinct tc.territory_id) as territory_count,
                        min(tc.territory_id) as territory_id
                    from territory_candidates tc
                    where tc.lp_id = t.id
                ) c on true
            ),
            unit_candidates as materialized (
                select tc.id as lp_id, u.id as unit_id
                from territory_coverage tc
                join bdb_satker u
                  on u.parent_id = tc.territory_id
                 and coalesce(u.is_synthetic,false) = false
                 and u.dors_mapping_aktif = true
                 and upper(coalesce(u.tipe_satker,'FUNGSI')) = 'FUNGSI'
                cross join lateral (
                    select regexp_replace(
                        upper(concat_ws(' ',u.deskripsi,u.nama_satker_dors,u.operational_role)),
                        '[^A-Z0-9]','','g'
                    ) as label
                ) norm
                where tc.territory_count = 1
                  and case tc.target_unit
                      when 'SATRESKRIM' then norm.label like 'SATRESKRIM%'
                      when 'SATRESNARKOBA' then norm.label like 'SATRESNARKOBA%' or norm.label like 'SATNARKOBA%'
                      when 'SATRESPPADANPPO' then norm.label like '%PPA%' and norm.label like '%PPO%'
                      when 'DITRESKRIMUM' then norm.label like 'DITRESKRIMUM%' or norm.label like 'DITKRIMUM%'
                      when 'DITPPADANPPO' then norm.label like '%PPA%' and norm.label like '%PPO%'
                      when 'RESKRIM' then norm.label like 'UNITRESKRIM%' or norm.label like 'RESKRIM%'
                      else false
                  end
            ),
            resolved_coverage as materialized (
                select
                    tc.*,
                    coalesce(c.unit_count,0)::int as unit_count,
                    c.unit_id
                from territory_coverage tc
                left join lateral (
                    select
                        count(distinct uc.unit_id) as unit_count,
                        min(uc.unit_id) as unit_id
                    from unit_candidates uc
                    where uc.lp_id = tc.id
                ) c on true
            ),
            resolved as materialized (
                select
                    rc.*,
                    wilayah.deskripsi as territory_nama,
                    wilayah.kode as territory_kode,
                    unit.deskripsi as resolved_unit_nama,
                    unit.kode as resolved_unit_kode
                from resolved_coverage rc
                join bdb_satker wilayah on wilayah.id = rc.territory_id
                join bdb_satker unit on unit.id = rc.unit_id
                where rc.territory_count = 1
                  and rc.unit_count = 1
            ),
            locked as materialized (
                select
                    r.*,
                    coalesce(lp.unit_satker_id,lp.satker_id) as owner_asal_id,
                    case
                        when lp.unit_satker_id is not null then lp.unit_satker_nama
                        else lp.satker_nama
                    end as owner_asal_nama,
                    coalesce(lp.unit_satker_id,lp.satker_id) is distinct from r.unit_id as owner_changed
                from resolved r
                join bdb_laporan_polisi lp on lp.id = r.id
                where coalesce(lp.payload_json->>'pelimpahan','') = '0'
                  and not coalesce(lp.sudah_dilimpahkan,false)
                  and not coalesce(lp.dilimpahkan_eksternal,false)
                  and lower(coalesce(lp.payload_json#>>'{_cas_owner_override,locked}','')) <> 'true'
                  and lp.deleted_at is null
                  and not exists (
                      select 1
                      from bdb_lp_pelimpahan ph
                      where ph.lp_id = lp.id
                  )
                for update of lp
            ),
            inserted_history as (
                insert into bdb_lp_pelimpahan (
                    lp_id,
                    satker_asal_id,
                    satker_asal_nama,
                    satker_tujuan_id,
                    satker_tujuan_nama,
                    keterangan,
                    dilimpahkan_oleh,
                    dilimpahkan_oleh_nama
                )
                select
                    l.id,
                    l.owner_asal_id,
                    l.owner_asal_nama,
                    l.unit_id,
                    l.resolved_unit_nama,
                    'Sinkronisasi pelimpahan otomatis dari DORS',
                    null,
                    'SYSTEM DORS'
                from locked l
                where l.owner_changed
                returning lp_id
            ),
            updated as (
                update bdb_laporan_polisi lp
                set
                    satker_id = l.territory_id,
                    satker_nama = l.territory_nama,
                    kode_pusiknas = coalesce(l.target_kp,l.territory_kode),
                    unit_nama = l.target_unit_nama,
                    unit_level = l.target_level,
                    unit_satker_id = l.unit_id,
                    unit_satker_nama = l.resolved_unit_nama,
                    unit_satker_kode = l.resolved_unit_kode,
                    penanganan_level = case l.target_level
                        when 'polda' then 'Polda'
                        when 'polres' then 'Polres'
                        when 'polsek' then 'Polsek'
                    end,
                    sudah_dilimpahkan = case
                        when l.owner_changed then true
                        else lp.sudah_dilimpahkan
                    end,
                    raw_lp_id = l.raw_lp_id,
                    data_scope = l.raw_data_scope,
                    payload_json = l.raw_payload,
                    synced_at = now(),
                    updated_at = now()
                from locked l
                left join inserted_history h on h.lp_id = l.id
                where lp.id = l.id
                  and (not l.owner_changed or h.lp_id is not null)
                returning lp.id, l.owner_changed
            )
            select
                (select count(*)::int from universe) as transition_total,
                (select count(*)::int from processable) as processable_total,
                (select count(*)::int from universe) -
                    (select count(*)::int from processable) as protected_total,
                (select count(*)::int from territory_coverage where territory_count <> 1) as territory_quarantined,
                (select count(*)::int from resolved_coverage where territory_count = 1 and unit_count <> 1) as unit_quarantined,
                (select count(*)::int from updated where owner_changed) as ownership_updated,
                (select count(*)::int from updated where not owner_changed) as already_owner_acknowledged
        `);
        const row = rows[0] || {};
        const summary = {
            transition_total: Number(row.transition_total || 0),
            processable_total: Number(row.processable_total || 0),
            protected_total: Number(row.protected_total || 0),
            territory_quarantined: Number(row.territory_quarantined || 0),
            unit_quarantined: Number(row.unit_quarantined || 0),
            ownership_updated: Number(row.ownership_updated || 0),
            already_owner_acknowledged: Number(row.already_owner_acknowledged || 0)
        };
        if (summary.territory_quarantined || summary.unit_quarantined || summary.protected_total) {
            this.logger.warn(`Pelimpahan DORS dikarantina/protected: territory=${summary.territory_quarantined}, unit=${summary.unit_quarantined}, protected=${summary.protected_total}.`);
        }
        if (summary.ownership_updated || summary.already_owner_acknowledged) {
            this.logger.log(`Pelimpahan DORS: ${summary.ownership_updated} ownership dipindahkan, ${summary.already_owner_acknowledged} sudah tepat dan diakui.`);
        }
        return summary;
    }
    async mapFromDors() {
        await this.ensureTable();
        const started = Date.now();
        const ret = await this.dataSource.query(`
            with raw_target as materialized (
                select r.*,
                       ${LaporanPolisiService_1.LEVEL_SQL} as target_level,
                       ${LaporanPolisiService_1.KP_SQL} as child_kp,
                       ${LaporanPolisiService_1.DORS_KODE_SQL} as child_dkode,
                       case
                           when lower(coalesce(r.payload_json->'unit'->>'level',''))='polsek'
                                and r.payload_json->'polres'->>'kode'='060.30.22' then '060.01.30.35'
                           when lower(coalesce(r.payload_json->'unit'->>'level',''))='polsek'
                                then r.payload_json->'polres'->>'kode_pusiknas'
                           when lower(coalesce(r.payload_json->'unit'->>'level',''))='polres'
                                then r.payload_json->'polda'->>'kode_pusiknas'
                           when jsonb_typeof(r.payload_json->'polsek')='object'
                                and r.payload_json->'polres'->>'kode'='060.30.22' then '060.01.30.35'
                           when jsonb_typeof(r.payload_json->'polsek')='object'
                                then r.payload_json->'polres'->>'kode_pusiknas'
                           when jsonb_typeof(r.payload_json->'polres')='object'
                                then r.payload_json->'polda'->>'kode_pusiknas'
                       end as parent_kp,
                       case
                           when lower(coalesce(r.payload_json->'unit'->>'level',''))='polsek'
                                then r.payload_json->'polres'->>'kode'
                           when lower(coalesce(r.payload_json->'unit'->>'level',''))='polres'
                                then r.payload_json->'polda'->>'kode'
                           when jsonb_typeof(r.payload_json->'polsek')='object'
                                then r.payload_json->'polres'->>'kode'
                           when jsonb_typeof(r.payload_json->'polres')='object'
                                then r.payload_json->'polda'->>'kode'
                       end as parent_dkode,
                       case when lower(coalesce(r.payload_json->'unit'->>'level',''))='polsek'
                                  or jsonb_typeof(r.payload_json->'polsek')='object'
                            then r.payload_json->'polda'->>'kode_pusiknas' end as grandparent_kp,
                       case when lower(coalesce(r.payload_json->'unit'->>'level',''))='polsek'
                                  or jsonb_typeof(r.payload_json->'polsek')='object'
                            then r.payload_json->'polda'->>'kode' end as grandparent_dkode
                from bdb_dors_raw_lp r
                where not exists (
                    select 1 from bdb_laporan_polisi lp
                    where lp.dors_lp_id=r.dors_lp_id and lp.model_lp=r.model_lp
                )
            ), candidate_base as (
                select r.*, s.id as resolved_satker_id,
                       s.deskripsi as resolved_satker_nama,
                       coalesce(s.kode,r.child_kp) as resolved_kode,
                       case
                           when nullif(${LaporanPolisiService_1.normKode('r.child_dkode')},'') is not null
                            and ${LaporanPolisiService_1.normKode('s.dors_kode')}=${LaporanPolisiService_1.normKode('r.child_dkode')}
                           then 2 else 1
                       end as signal_rank
                from raw_target r
                join bdb_satker s
                  on lower(coalesce(s.tipe_satker,''))=lower(r.target_level)
                 and coalesce(s.is_synthetic,false)=false
                 and coalesce(s.kinerja_aktif,true)=true
                 and s.dors_mapping_aktif=true
                 and (
                      (nullif(${LaporanPolisiService_1.normKode('r.child_kp')},'') is not null and (
                           ${LaporanPolisiService_1.normKode('s.kode')}=${LaporanPolisiService_1.normKode('r.child_kp')}
                           or ${LaporanPolisiService_1.normKode('s.kode_canonical')}=${LaporanPolisiService_1.normKode('r.child_kp')}
                      ))
                      or (nullif(${LaporanPolisiService_1.normKode('r.child_dkode')},'') is not null
                          and ${LaporanPolisiService_1.normKode('s.dors_kode')}=${LaporanPolisiService_1.normKode('r.child_dkode')})
                 )
                left join bdb_satker p on p.id=s.parent_id
                left join bdb_satker gp on gp.id=p.parent_id
                where r.target_level in ('Polda','Polres','Polsek')
                  and (
                      r.target_level='Polda'
                      or (
                          p.id is not null
                          and upper(coalesce(p.tipe_satker,''))=case when r.target_level='Polsek' then 'POLRES' else 'POLDA' end
                          and coalesce(p.is_synthetic,false)=false
                          and coalesce(p.kinerja_aktif,true)=true
                          and p.dors_mapping_aktif=true
                          and (
                               (nullif(${LaporanPolisiService_1.normKode('r.parent_kp')},'') is not null and (
                                    ${LaporanPolisiService_1.normKode('p.kode')}=${LaporanPolisiService_1.normKode('r.parent_kp')}
                                    or ${LaporanPolisiService_1.normKode('p.kode_canonical')}=${LaporanPolisiService_1.normKode('r.parent_kp')}
                               ))
                               or (nullif(${LaporanPolisiService_1.normKode('r.parent_dkode')},'') is not null
                                   and ${LaporanPolisiService_1.normKode('p.dors_kode')}=${LaporanPolisiService_1.normKode('r.parent_dkode')})
                          )
                      )
                  )
                  and (
                      r.target_level<>'Polsek'
                      or (
                          gp.id is not null
                          and upper(coalesce(gp.tipe_satker,''))='POLDA'
                          and coalesce(gp.is_synthetic,false)=false
                          and coalesce(gp.kinerja_aktif,true)=true
                          and gp.dors_mapping_aktif=true
                          and (
                               (nullif(${LaporanPolisiService_1.normKode('r.grandparent_kp')},'') is not null and (
                                    ${LaporanPolisiService_1.normKode('gp.kode')}=${LaporanPolisiService_1.normKode('r.grandparent_kp')}
                                    or ${LaporanPolisiService_1.normKode('gp.kode_canonical')}=${LaporanPolisiService_1.normKode('r.grandparent_kp')}
                               ))
                               or (nullif(${LaporanPolisiService_1.normKode('r.grandparent_dkode')},'') is not null
                                   and ${LaporanPolisiService_1.normKode('gp.dors_kode')}=${LaporanPolisiService_1.normKode('r.grandparent_dkode')})
                          )
                      )
                  )
            ), candidate_ranked as (
                select c.*, max(c.signal_rank) over (partition by c.id) as best_signal_rank
                from candidate_base c
            ), candidate as (
                select c.*, count(*) over (partition by c.id) as candidate_count
                from candidate_ranked c
                where c.signal_rank=c.best_signal_rank
            ), resolved as (
                select * from candidate where candidate_count=1
            )
            insert into bdb_laporan_polisi
                (dors_lp_id, model_lp, raw_lp_id, no_laporan, tgl_laporan, kategori, tempat_kejadian, uraian_singkat,
                 penanganan_level, kode_pusiknas, satker_id, satker_nama, unit_nama, unit_level, data_scope, payload_json, synced_at)
            select
                   r.dors_lp_id, r.model_lp, r.id,
                   r.no_laporan,
                   r.payload_json->>'tgl_laporan',
                   r.payload_json->>'kategori',
                   r.payload_json->>'tempat_kejadian',
                   coalesce(r.payload_json->>'uraian_singkat_kejadian', r.payload_json->>'uraian_kejadian'),
                   r.target_level,
                   r.resolved_kode, r.resolved_satker_id, r.resolved_satker_nama,
                   r.payload_json->'unit'->>'unit', r.payload_json->'unit'->>'level',
                   r.data_scope, r.payload_json, now()
            from resolved r
            on conflict (dors_lp_id, model_lp) do nothing
            returning id
        `);
        const mapped = Array.isArray(ret) ? ret.length : 0;
        const mabes = await this.mapMabesByUnit();
        const viaAlias = await this.applyAliases();
        // AUTO fuzzy-name mapping dinonaktifkan sementara:
        // jangan pernah memilih satker nasional hanya berdasarkan nama + LIMIT 1.
        // Jika exact code / Mabes / alias gagal, LP dibiarkan unmapped
        // sampai resolver parent-scoped tersedia.
        const viaName = 0;
        const deeper = await this.remapDeeper();
        const unmapped = await this.unmappedCount();
        await this.linkMasterData();
        const ownershipSync = await this.syncPelimpahanOwnershipFromDors();
        this.logger.log(`Map DORS->LP: ${mapped} kode, ${mabes} Mabes, ${viaAlias} alias, ${viaName} nama, ${deeper} unit terdalam, ${unmapped} belum, ownership ${ownershipSync.ownership_updated}, karantina ${ownershipSync.territory_quarantined + ownershipSync.unit_quarantined + ownershipSync.protected_total}, ${Date.now() - started}ms`);
        return { status: 1, data: { mapped_baru: mapped + mabes + viaAlias + viaName, via_kode: mapped, mabes_via_unit: mabes, via_alias: viaAlias, via_nama: viaName, unit_terdalam: deeper, belum_termapping: unmapped, ownership_sync: ownershipSync }, message: `${mapped + mabes + viaAlias + viaName} LP dipetakan (kode ${mapped}, Mabes ${mabes}, alias ${viaAlias}, nama ${viaName}).` };
    }
    async unmappedCount() {
        const r = await this.dataSource.query(`
            select count(*)::int as c
            from bdb_dors_raw_lp r
            where not exists (select 1 from bdb_laporan_polisi lp where lp.dors_lp_id=r.dors_lp_id and lp.model_lp=r.model_lp)
        `);
        return r[0]?.c || 0;
    }
    satkerChainFromNoLaporan(no) {
        const parts = String(no || '')
            .split('/')
            .map((s) => s.trim())
            .filter(Boolean);
        const idx = parts.findIndex((p) => /^SPKT/i.test(p));
        return idx >= 0 ? parts.slice(idx + 1) : [];
    }
    async mapByNameSimilarity(threshold = 0.9) {
        throw new common_1.BadRequestException('Pemetaan massal berdasarkan kemiripan nama dinonaktifkan. Gunakan pemetaan 1:1 agar parent dan grandparent dapat diverifikasi.');
        await this.ensureTable();
        await this.dataSource.query('create extension if not exists pg_trgm');
        const th = Math.max(0.5, Math.min(1, Number(threshold) || 0.9));
        const rows = await this.dataSource.query(`
            select r.id as raw_id, r.dors_lp_id, r.model_lp, r.no_laporan, r.data_scope, r.payload_json,
                   ${LaporanPolisiService_1.LEVEL_SQL} as lvl, ${LaporanPolisiService_1.KP_SQL} as kp
            from bdb_dors_raw_lp r
            where not exists (select 1 from bdb_laporan_polisi lp where lp.dors_lp_id=r.dors_lp_id and lp.model_lp=r.model_lp)
        `);
        let mapped = 0;
        for (const r of rows) {
            const p = r.payload_json || {};
            const isObj = (k) => p[k] && typeof p[k] === 'object' && !Array.isArray(p[k]);
            const deepestPayload = isObj('polsek') ? p.polsek?.nama : isObj('polres') ? p.polres?.nama : isObj('polda') ? p.polda?.nama : null;
            const parentPayload = isObj('polsek') ? p.polres?.nama : isObj('polres') ? p.polda?.nama : null;
            const chain = this.satkerChainFromNoLaporan(r.no_laporan);
            const target = (deepestPayload || chain[0] || '').trim();
            if (!target)
                continue;
            const parentChain = (chain[1] || '').trim();
            const parentPay = (parentPayload || '').trim();
            const best = await this.dataSource.query(`select c.id, c.deskripsi
                 from bdb_satker c left join bdb_satker par on par.id = c.parent_id
                 where c.is_synthetic = false and c.dors_mapping_aktif=true and similarity(upper(c.deskripsi), upper($1)) >= $4
                 order by similarity(upper(c.deskripsi), upper($1))
                        + greatest(coalesce(similarity(upper(par.deskripsi), upper($2)), 0), coalesce(similarity(upper(par.deskripsi), upper($3)), 0)) desc,
                        c.id
                 limit 1`, [target, parentChain || target, parentPay || target, th]);
            if (!best.length)
                continue;
            await this.insertMappedLp(r, best[0].id, best[0].deskripsi);
            mapped++;
        }
        const deeper = await this.remapDeeper();
        const unmapped = await this.unmappedCount();
        this.logger.log(`Map via nama (>=${th}): ${mapped} LP dipetakan, ${deeper} ke unit terdalam, sisa ${unmapped}.`);
        return { status: 1, data: { mapped, threshold: th, unit_terdalam: deeper, belum_termapping: unmapped }, message: `${mapped} LP dipetakan via kemiripan nama (ambang ${Math.round(th * 100)}%).` };
    }
    async ensureAliasTable() {
        await this.dataSource.query(`
            create table if not exists bdb_dors_satker_map (
                id bigserial primary key,
                dors_kode_pusiknas text,
                dors_nama text not null,
                dors_parent_nama text,
                satker_id bigint not null references bdb_satker(id) on delete cascade,
                satker_nama text, catatan text,
                created_at timestamp not null default now(),
                updated_at timestamp not null default now()
            );
            alter table bdb_dors_satker_map add column if not exists unit_nama text;
            drop index if exists bdb_dors_satker_map_key;
            create unique index if not exists bdb_dors_satker_map_key
                on bdb_dors_satker_map (coalesce(dors_kode_pusiknas,''), lower(dors_nama), lower(coalesce(dors_parent_nama,'')), lower(coalesce(unit_nama,'')));
        `);
    }
    async insertMappedLp(r, satkerId, _satkerNama) {
        const p = r.payload_json || {};
        const placement = await this.resolveSatkerPlacement(satkerId);
        await this.dataSource.query(`insert into bdb_laporan_polisi
                (dors_lp_id, model_lp, raw_lp_id, no_laporan, tgl_laporan, kategori, tempat_kejadian, uraian_singkat,
                 penanganan_level, kode_pusiknas, satker_id, satker_nama, unit_nama, unit_level,
                 unit_satker_id, unit_satker_nama, unit_satker_kode, data_scope, payload_json, synced_at)
             values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19::jsonb, now())
             on conflict (dors_lp_id, model_lp) do nothing`, [
            r.dors_lp_id, r.model_lp, r.raw_id, r.no_laporan,
            p.tgl_laporan ?? null, p.kategori ?? null, p.tempat_kejadian ?? null,
            p.uraian_singkat_kejadian ?? p.uraian_kejadian ?? null,
            r.lvl, r.kp, placement.satker.id, placement.satker.deskripsi,
            p.unit?.unit ?? null, p.unit?.level ?? null,
            placement.unit?.id ?? null, placement.unit?.deskripsi ?? null, placement.unit?.kode ?? null,
            r.data_scope, JSON.stringify(p)
        ]);
    }
    async forceMap(threshold = 0.4) {
        throw new common_1.BadRequestException('Paksa mapping massal dinonaktifkan. Gunakan pemetaan 1:1 agar jalur parent dan grandparent tidak tertukar.');
        await this.ensureTable();
        await this.ensureAliasTable();
        await this.dataSource.query('create extension if not exists pg_trgm');
        const floor = Math.max(0.2, Math.min(0.95, Number(threshold) || 0.4));
        const rows = await this.dataSource.query(`
            select r.id as raw_id, r.dors_lp_id, r.model_lp, r.no_laporan, r.data_scope, r.payload_json,
                   ${LaporanPolisiService_1.LEVEL_SQL} as lvl, ${LaporanPolisiService_1.KP_SQL} as kp
            from bdb_dors_raw_lp r
            where not exists (select 1 from bdb_laporan_polisi lp where lp.dors_lp_id=r.dors_lp_id and lp.model_lp=r.model_lp)
        `);
        let mapped = 0;
        for (const r of rows) {
            const p = r.payload_json || {};
            const isObj = (k) => p[k] && typeof p[k] === 'object' && !Array.isArray(p[k]);
            const unitLevel = String(p.unit?.level ?? '').toLowerCase();
            const deepest =
                unitLevel === 'polsek' && isObj('polsek') ? p.polsek?.nama :
                unitLevel === 'polres' && isObj('polres') ? p.polres?.nama :
                unitLevel === 'polda' && isObj('polda') ? p.polda?.nama :
                isObj('polsek') ? p.polsek?.nama :
                isObj('polres') ? p.polres?.nama :
                isObj('polda') ? p.polda?.nama : null;
            const parentPay =
                unitLevel === 'polsek' && isObj('polres') ? p.polres?.nama :
                unitLevel === 'polres' && isObj('polda') ? p.polda?.nama :
                unitLevel === 'polda' ? null :
                isObj('polsek') ? p.polres?.nama :
                isObj('polres') ? p.polda?.nama : null;
            const chain = this.satkerChainFromNoLaporan(r.no_laporan);
            const target = (deepest || chain[0] || '').trim();
            if (!target)
                continue;
            const parentChain = (chain[1] || '').trim();
            const best = await this.dataSource.query(`select c.id, c.deskripsi
                 from bdb_satker c left join bdb_satker par on par.id = c.parent_id
                 where c.is_synthetic = false and c.dors_mapping_aktif=true and similarity(upper(c.deskripsi), upper($1)) >= $4
                 order by similarity(upper(c.deskripsi), upper($1))
                        + greatest(coalesce(similarity(upper(par.deskripsi), upper($2)), 0), coalesce(similarity(upper(par.deskripsi), upper($3)), 0)) desc,
                        c.id
                 limit 1`, [target, parentChain || target, parentPay || target, floor]);
            if (!best.length)
                continue;
            const parentAlias = (parentPay || parentChain || null);
            await this.dataSource.query(`insert into bdb_dors_satker_map (dors_kode_pusiknas, dors_nama, dors_parent_nama, satker_id, satker_nama, catatan)
                 values ($1,$2,$3,$4,$5,'paksa mapping')
                 on conflict (coalesce(dors_kode_pusiknas,''), lower(dors_nama), lower(coalesce(dors_parent_nama,'')), lower(coalesce(unit_nama,'')))
                 do update set satker_id=excluded.satker_id, satker_nama=excluded.satker_nama, updated_at=now()`, [r.kp || null, target, parentAlias, best[0].id, best[0].deskripsi]);
            await this.insertMappedLp(r, best[0].id, best[0].deskripsi);
            mapped++;
        }
        const deeper = await this.remapDeeper();
        const unmapped = await this.unmappedCount();
        this.logger.log(`PAKSA map: ${mapped} LP dipaksa dipetakan + direkam alias, ${deeper} ke unit terdalam, sisa ${unmapped}.`);
        return { status: 1, data: { mapped, unit_terdalam: deeper, belum_termapping: unmapped }, message: `${mapped} LP dipetakan paksa & direkam sebagai alias.` };
    }
    async applyUnitAliases() {
        await this.ensureAliasTable();
        const ret = await this.dataSource.query(`
            with raw_target as materialized (
                select r.*,
                       ${LaporanPolisiService_1.LEVEL_SQL} as target_level,
                       ${LaporanPolisiService_1.KP_SQL} as child_kp,
                       case
                           when lower(coalesce(r.payload_json->'unit'->>'level',''))='polsek'
                                and r.payload_json->'polres'->>'kode'='060.30.22' then '060.01.30.35'
                           when lower(coalesce(r.payload_json->'unit'->>'level',''))='polsek' then r.payload_json->'polres'->>'kode_pusiknas'
                           when lower(coalesce(r.payload_json->'unit'->>'level',''))='polres' then r.payload_json->'polda'->>'kode_pusiknas'
                           when jsonb_typeof(r.payload_json->'polsek')='object' then r.payload_json->'polres'->>'kode_pusiknas'
                           when jsonb_typeof(r.payload_json->'polres')='object' then r.payload_json->'polda'->>'kode_pusiknas'
                       end as parent_kp,
                       case
                           when lower(coalesce(r.payload_json->'unit'->>'level',''))='polsek' then r.payload_json->'polres'->>'kode'
                           when lower(coalesce(r.payload_json->'unit'->>'level',''))='polres' then r.payload_json->'polda'->>'kode'
                           when jsonb_typeof(r.payload_json->'polsek')='object' then r.payload_json->'polres'->>'kode'
                           when jsonb_typeof(r.payload_json->'polres')='object' then r.payload_json->'polda'->>'kode'
                       end as parent_dkode,
                       case when lower(coalesce(r.payload_json->'unit'->>'level',''))='polsek'
                                  or jsonb_typeof(r.payload_json->'polsek')='object'
                            then r.payload_json->'polda'->>'kode_pusiknas' end as grandparent_kp,
                       case when lower(coalesce(r.payload_json->'unit'->>'level',''))='polsek'
                                  or jsonb_typeof(r.payload_json->'polsek')='object'
                            then r.payload_json->'polda'->>'kode' end as grandparent_dkode
                from bdb_dors_raw_lp r
                where not exists (select 1 from bdb_laporan_polisi lp where lp.dors_lp_id=r.dors_lp_id and lp.model_lp=r.model_lp)
            ), candidate as (
                select r.*, target.id as target_id, target.deskripsi as target_nama, target.kode as target_kode,
                       wilayah.id as wilayah_id, wilayah.deskripsi as wilayah_nama,
                       count(*) over (partition by r.id) as candidate_count
                from raw_target r
                join bdb_dors_satker_map a
                  on a.unit_nama is not null
                 and a.dors_kode_pusiknas is not null
                 and ${LaporanPolisiService_1.normKode('a.dors_kode_pusiknas')}=${LaporanPolisiService_1.normKode('r.child_kp')}
                 and upper(regexp_replace(a.unit_nama,'[^A-Za-z0-9]','','g'))=
                     upper(regexp_replace(coalesce(r.payload_json->'unit'->>'unit',''),'[^A-Za-z0-9]','','g'))
                join bdb_satker target
                  on target.id=a.satker_id
                 and coalesce(target.is_synthetic,false)=false
                 and coalesce(target.kinerja_aktif,true)=true
                 and target.dors_mapping_aktif=true
                join lateral (
                    with recursive ancestors as (
                        select s.id,s.parent_id,s.tipe_satker,0 as depth,array[s.id]::bigint[] as visited
                        from bdb_satker s where s.id=target.id
                        union all
                        select p.id,p.parent_id,p.tipe_satker,x.depth+1,x.visited||p.id
                        from ancestors x join bdb_satker p on p.id=x.parent_id
                        where x.depth<32 and not (p.id=any(x.visited))
                    )
                    select id from ancestors
                    where upper(coalesce(tipe_satker,'')) in ('POLDA','POLRES','POLSEK')
                    order by depth limit 1
                ) pick on true
                join bdb_satker wilayah
                  on wilayah.id=pick.id
                 and lower(coalesce(wilayah.tipe_satker,''))=lower(r.target_level)
                 and coalesce(wilayah.is_synthetic,false)=false
                 and coalesce(wilayah.kinerja_aktif,true)=true
                 and wilayah.dors_mapping_aktif=true
                left join bdb_satker wp on wp.id=wilayah.parent_id
                left join bdb_satker wgp on wgp.id=wp.parent_id
                where (r.target_level='Polda' or (
                    wp.id is not null
                    and coalesce(wp.is_synthetic,false)=false
                    and coalesce(wp.kinerja_aktif,true)=true
                    and wp.dors_mapping_aktif=true
                    and (
                         (nullif(${LaporanPolisiService_1.normKode('r.parent_kp')},'') is not null and (
                              ${LaporanPolisiService_1.normKode('wp.kode')}=${LaporanPolisiService_1.normKode('r.parent_kp')}
                              or ${LaporanPolisiService_1.normKode('wp.kode_canonical')}=${LaporanPolisiService_1.normKode('r.parent_kp')}
                         ))
                         or (nullif(${LaporanPolisiService_1.normKode('r.parent_dkode')},'') is not null
                             and ${LaporanPolisiService_1.normKode('wp.dors_kode')}=${LaporanPolisiService_1.normKode('r.parent_dkode')})
                    )
                ))
                  and (r.target_level<>'Polsek' or (
                    wgp.id is not null
                    and coalesce(wgp.is_synthetic,false)=false
                    and coalesce(wgp.kinerja_aktif,true)=true
                    and wgp.dors_mapping_aktif=true
                    and (
                         (nullif(${LaporanPolisiService_1.normKode('r.grandparent_kp')},'') is not null and (
                              ${LaporanPolisiService_1.normKode('wgp.kode')}=${LaporanPolisiService_1.normKode('r.grandparent_kp')}
                              or ${LaporanPolisiService_1.normKode('wgp.kode_canonical')}=${LaporanPolisiService_1.normKode('r.grandparent_kp')}
                         ))
                         or (nullif(${LaporanPolisiService_1.normKode('r.grandparent_dkode')},'') is not null
                             and ${LaporanPolisiService_1.normKode('wgp.dors_kode')}=${LaporanPolisiService_1.normKode('r.grandparent_dkode')})
                    )
                ))
            )
            insert into bdb_laporan_polisi
                (dors_lp_id, model_lp, raw_lp_id, no_laporan, tgl_laporan, kategori, tempat_kejadian, uraian_singkat,
                 penanganan_level, kode_pusiknas, satker_id, satker_nama, unit_nama, unit_level,
                 unit_satker_id, unit_satker_nama, unit_satker_kode, data_scope, payload_json, synced_at)
            select
                   r.dors_lp_id, r.model_lp, r.id, r.no_laporan,
                   r.payload_json->>'tgl_laporan', r.payload_json->>'kategori', r.payload_json->>'tempat_kejadian',
                   coalesce(r.payload_json->>'uraian_singkat_kejadian', r.payload_json->>'uraian_kejadian'),
                   r.target_level, r.child_kp, r.wilayah_id, r.wilayah_nama,
                   r.payload_json->'unit'->>'unit', r.payload_json->'unit'->>'level',
                   case when r.wilayah_id<>r.target_id then r.target_id end,
                   case when r.wilayah_id<>r.target_id then r.target_nama end,
                   case when r.wilayah_id<>r.target_id then r.target_kode end,
                   r.data_scope, r.payload_json, now()
            from candidate r
            where r.candidate_count=1
            on conflict (dors_lp_id, model_lp) do nothing
            returning id
        `);
        return Array.isArray(ret) ? ret.length : 0;
    }
    async applyGroupAliases() {
        await this.ensureAliasTable();
        const ret = await this.dataSource.query(`
            with raw_target as materialized (
                select r.*,
                       ${LaporanPolisiService_1.LEVEL_SQL} as target_level,
                       ${LaporanPolisiService_1.KP_SQL} as child_kp,
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
                           when jsonb_typeof(r.payload_json->'polsek')='object'
                                then r.payload_json->'polsek'->>'nama'
                           when jsonb_typeof(r.payload_json->'polres')='object'
                                then r.payload_json->'polres'->>'nama'
                           when jsonb_typeof(r.payload_json->'polda')='object'
                                then r.payload_json->'polda'->>'nama'
                       end as dors_nama,
                       case
                           when lower(coalesce(r.payload_json->'unit'->>'level',''))='polsek'
                                and jsonb_typeof(r.payload_json->'polsek')='object'
                                then r.payload_json->'polres'->>'nama'
                           when lower(coalesce(r.payload_json->'unit'->>'level',''))='polres'
                                and jsonb_typeof(r.payload_json->'polres')='object'
                                then r.payload_json->'polda'->>'nama'
                           when jsonb_typeof(r.payload_json->'polsek')='object'
                                then r.payload_json->'polres'->>'nama'
                           when jsonb_typeof(r.payload_json->'polres')='object'
                                then r.payload_json->'polda'->>'nama'
                       end as parent_nama
                from bdb_dors_raw_lp r
                where not exists (
                    select 1 from bdb_laporan_polisi lp
                    where lp.dors_lp_id=r.dors_lp_id and lp.model_lp=r.model_lp
                )
            ), candidate_base as (
                select distinct on (r.id,target.id)
                       r.*, target.id as target_id, target.deskripsi as target_nama,
                       target.kode as target_kode
                from raw_target r
                join bdb_dors_satker_map a
                  on a.unit_nama is null
                 and nullif(upper(regexp_replace(coalesce(a.dors_nama,''),'[^A-Za-z0-9]','','g')),'') is not null
                 and upper(regexp_replace(coalesce(a.dors_nama,''),'[^A-Za-z0-9]','','g'))=
                     upper(regexp_replace(coalesce(r.dors_nama,''),'[^A-Za-z0-9]','','g'))
                 and (
                     (r.target_level='Polda' and nullif(trim(coalesce(a.dors_parent_nama,'')),'') is null)
                     or (
                         r.target_level in ('Polres','Polsek')
                         and nullif(trim(coalesce(a.dors_parent_nama,'')),'') is not null
                         and upper(regexp_replace(coalesce(a.dors_parent_nama,''),'[^A-Za-z0-9]','','g'))=
                             upper(regexp_replace(coalesce(r.parent_nama,''),'[^A-Za-z0-9]','','g'))
                     )
                 )
                join bdb_satker target
                  on target.id=a.satker_id
                 and lower(coalesce(target.tipe_satker,''))=lower(r.target_level)
                 and coalesce(target.is_synthetic,false)=false
                 and coalesce(target.kinerja_aktif,true)=true
                 and target.dors_mapping_aktif=true
                order by r.id,target.id,a.id
            ), candidate as (
                select c.*,count(*) over (partition by c.id) as candidate_count
                from candidate_base c
            )
            insert into bdb_laporan_polisi
                (dors_lp_id, model_lp, raw_lp_id, no_laporan, tgl_laporan, kategori, tempat_kejadian, uraian_singkat,
                 penanganan_level, kode_pusiknas, satker_id, satker_nama, unit_nama, unit_level,
                 unit_satker_id, unit_satker_nama, unit_satker_kode, data_scope, payload_json, synced_at)
            select r.dors_lp_id,r.model_lp,r.id,r.no_laporan,
                   r.payload_json->>'tgl_laporan',r.payload_json->>'kategori',r.payload_json->>'tempat_kejadian',
                   coalesce(r.payload_json->>'uraian_singkat_kejadian',r.payload_json->>'uraian_kejadian'),
                   r.target_level,r.child_kp,r.target_id,r.target_nama,
                   r.payload_json->'unit'->>'unit',r.payload_json->'unit'->>'level',
                   null,null,null,r.data_scope,r.payload_json,now()
            from candidate r
            where r.candidate_count=1
            on conflict (dors_lp_id,model_lp) do nothing
            returning id
        `);
        return Array.isArray(ret) ? ret.length : 0;
    }
    async applyAliases() {
        const viaUnit = await this.applyUnitAliases();
        const viaGroup = await this.applyGroupAliases();
        return viaUnit + viaGroup;
    }
    async mapOne(dorsLpId, modelLp, satkerId, scopeUnitNama) {
        await this.ensureTable();
        await this.ensureAliasTable();
        const rr = await this.dataSource.query(`select r.id as raw_id, r.dors_lp_id, r.model_lp, r.no_laporan, r.data_scope, r.payload_json,
                    ${LaporanPolisiService_1.LEVEL_SQL} as lvl, ${LaporanPolisiService_1.KP_SQL} as kp
             from bdb_dors_raw_lp r where r.dors_lp_id=$1 and r.model_lp=$2 limit 1`, [dorsLpId, modelLp]);
        if (!rr.length)
            throw new Error('LP DORS tidak ditemukan.');
        const r = rr[0];
        const existingRows = await this.dataSource.query(`select lp.id,
                    coalesce(lp.sudah_dilimpahkan,false) as sudah_dilimpahkan,
                    coalesce(lp.dilimpahkan_eksternal,false) as dilimpahkan_eksternal,
                    exists (
                        select 1
                        from bdb_lp_pelimpahan ph
                        where ph.lp_id = lp.id
                    ) as punya_riwayat_pelimpahan
             from bdb_laporan_polisi lp
             where lp.dors_lp_id=$1 and lp.model_lp=$2
             limit 1`, [dorsLpId, modelLp]);
        const existing = existingRows[0];
        if (existing &&
            (existing.sudah_dilimpahkan ||
             existing.dilimpahkan_eksternal ||
             existing.punya_riwayat_pelimpahan)) {
            throw new common_1.BadRequestException('LP sudah/pernah dilimpahkan; mapping manual tidak boleh menimpa satker penanganan.');
        }
        const placement = await this.resolveSatkerPlacement(satkerId);
        const selected = placement.selected;
        const p = r.payload_json || {};
        const isObj = (k) => p[k] && typeof p[k] === 'object' && !Array.isArray(p[k]);
        const dorsNama = (isObj('polsek') ? p.polsek?.nama : isObj('polres') ? p.polres?.nama : isObj('polda') ? p.polda?.nama : null) || this.satkerChainFromNoLaporan(r.no_laporan)[0] || '';
        const parentNama = (isObj('polsek') ? p.polres?.nama : isObj('polres') ? p.polda?.nama : null) || this.satkerChainFromNoLaporan(r.no_laporan)[1] || null;
        await this.dataSource.query(`insert into bdb_laporan_polisi
                (dors_lp_id, model_lp, raw_lp_id, no_laporan, tgl_laporan, kategori, tempat_kejadian, uraian_singkat,
                 penanganan_level, kode_pusiknas, satker_id, satker_nama, unit_nama, unit_level,
                 unit_satker_id, unit_satker_nama, unit_satker_kode, data_scope, payload_json, synced_at)
             values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19::jsonb, now())
             on conflict (dors_lp_id, model_lp) do update
                 set satker_id=excluded.satker_id, satker_nama=excluded.satker_nama,
                     unit_satker_id=excluded.unit_satker_id,
                     unit_satker_nama=excluded.unit_satker_nama,
                     unit_satker_kode=excluded.unit_satker_kode,
                     updated_at=now()`, [
            r.dors_lp_id, r.model_lp, r.raw_id, r.no_laporan,
            p.tgl_laporan ?? null, p.kategori ?? null, p.tempat_kejadian ?? null,
            p.uraian_singkat_kejadian ?? p.uraian_kejadian ?? null,
            r.lvl, r.kp, placement.satker.id, placement.satker.deskripsi,
            p.unit?.unit ?? null, p.unit?.level ?? null,
            placement.unit?.id ?? null, placement.unit?.deskripsi ?? null, placement.unit?.kode ?? null,
            r.data_scope, JSON.stringify(p)
        ]);
        const unitNamaForAlias = scopeUnitNama ? (p.unit?.unit ?? scopeUnitNama) : null;
        if (dorsNama) {
            await this.dataSource.query(`insert into bdb_dors_satker_map (dors_kode_pusiknas, dors_nama, dors_parent_nama, unit_nama, satker_id, satker_nama, catatan)
                 values ($1,$2,$3,$4,$5,$6,'manual')
                 on conflict (coalesce(dors_kode_pusiknas,''), lower(dors_nama), lower(coalesce(dors_parent_nama,'')), lower(coalesce(unit_nama,'')))
                 do update set satker_id=excluded.satker_id, satker_nama=excluded.satker_nama, catatan='manual', updated_at=now()`, [r.kp || null, dorsNama, parentNama, unitNamaForAlias, selected.id, selected.deskripsi]);
        }
        return {
            status: 1,
            data: {
                dors_lp_id: dorsLpId,
                satker_id: placement.satker.id,
                satker_nama: placement.satker.deskripsi,
                unit_satker_id: placement.unit?.id ?? null,
                unit_satker_nama: placement.unit?.deskripsi ?? null
            },
            message: `LP dipetakan ke ${selected.deskripsi}.`
        };
    }
    async operationalReadIds(rootId) {
        return (0, lp_scope_util_1.operationalLpScopeIds)(this.dataSource, rootId);
    }
    async stats(userId, opts = {}) {
        await this.ensureTable();
        const scope = await (0, scope_util_1.resolveScope)(this.dataSource, userId);
        if (!scope.all && !scope.satkerId) {
            return { status: 1, data: { total: 0, per_level: { Mabes: 0, Polda: 0, Polres: 0, Polsek: 0 }, per_status: [], belum_termapping: 0, terakhir: null } };
        }
        const functionDomain = String(opts?.functionDomain || '').trim().toUpperCase();
        const organizationDomain = String(opts?.organizationDomain || (functionDomain ? 'INTERNAL_POLRI' : '')).trim().toUpperCase();
        if (functionDomain && !['INTERNAL_RESERSE', 'EKSTERNAL_RESERSE'].includes(functionDomain))
            throw new common_1.BadRequestException('functionDomain tidak valid.');
        if (organizationDomain && !['INTERNAL_POLRI', 'EKSTERNAL_POLRI'].includes(organizationDomain))
            throw new common_1.BadRequestException('organizationDomain tidak valid.');
        const scopeParams = [];
        const scopeConditions = ['lp.deleted_at is null'];
        if (!scope.all) {
            scopeParams.push(await this.operationalReadIds(scope.satkerId));
            scopeConditions.push(`coalesce(lp.unit_satker_id, lp.satker_id) = any($${scopeParams.length})`);
            scopeConditions.push('coalesce(lp.dilimpahkan_eksternal, false) = false');
        }
        if (functionDomain) {
            scopeParams.push(functionDomain, organizationDomain);
            scopeConditions.push(`exists (
                select 1 from public.bdb_satker_taxonomy_r11 tx
                where tx.source_table='BDB_SATKER'
                  and tx.entity_id=coalesce(lp.unit_satker_id, lp.satker_id)
                  and tx.organization_domain=$${scopeParams.length}
                  and (tx.function_domain=$${scopeParams.length - 1}
                       or ($${scopeParams.length - 1}='INTERNAL_RESERSE' and tx.function_domain='STRUCTURAL'))
            )`);
        }
        const datePattern = /^\d{4}-\d{2}-\d{2}$/;
        if (opts.from) {
            if (!datePattern.test(opts.from))
                throw new common_1.BadRequestException('Tanggal awal tidak valid (format YYYY-MM-DD).');
            scopeParams.push(opts.from);
            scopeConditions.push(`to_timestamp(nullif(lp.tgl_laporan,''), 'DD-MM-YYYY HH24:MI:SS')::date >= $${scopeParams.length}::date`);
        }
        if (opts.to) {
            if (!datePattern.test(opts.to))
                throw new common_1.BadRequestException('Tanggal akhir tidak valid (format YYYY-MM-DD).');
            scopeParams.push(opts.to);
            scopeConditions.push(`to_timestamp(nullif(lp.tgl_laporan,''), 'DD-MM-YYYY HH24:MI:SS')::date <= $${scopeParams.length}::date`);
        }
        const scopeWhere = 'where ' + scopeConditions.join(' and ');
        const r = await this.dataSource.query(`
            select count(*)::int as total,
                count(*) filter (where penanganan_level='Mabes')::int as mabes,
                count(*) filter (where penanganan_level='Polda')::int as polda,
                count(*) filter (where penanganan_level='Polres')::int as polres,
                count(*) filter (where penanganan_level='Polsek')::int as polsek,
                max(synced_at) as terakhir
            from bdb_laporan_polisi lp ${scopeWhere}
        `, scopeParams);
        const belum = scope.all ? await this.unmappedCount() : 0;
        let perStatus = [];
        try {
            const joinScope = 'and ' + scopeConditions.join(' and ');
            perStatus = await this.dataSource.query(`
                select s.code, s.nama, coalesce(s.kategori,'CT') as kategori, s.urutan, count(lp.id)::int as jumlah
                from bdb_status_master s
                left join bdb_laporan_polisi lp on lp.status_id = s.id ${joinScope}
                group by s.code, s.nama, s.kategori, s.urutan, s.id
                order by s.urutan nulls last, s.id`, scopeParams);
        }
        catch {
        }
        return { status: 1, data: { total: r[0]?.total || 0, per_level: { Mabes: r[0]?.mabes || 0, Polda: r[0]?.polda || 0, Polres: r[0]?.polres || 0, Polsek: r[0]?.polsek || 0 }, per_status: perStatus, belum_termapping: belum, terakhir: r[0]?.terakhir || null } };
    }
    async list(opts, userId) {
        await this.ensureTable();
        const scope = await (0, scope_util_1.resolveScope)(this.dataSource, userId);
        const revealDors = scope.isSuper;
        const page = Math.max(1, Number(opts.page) || 1);
        const row = Math.max(1, Math.min(1000, Number(opts.row) || 25));
        const offset = (page - 1) * row;
        if (!scope.all && !scope.satkerId)
            return { status: 1, data: [], total: 0, page, row, total_page: 0 };
        const where = ['lp.deleted_at is null'];
        const params = [];
        if (!scope.all) {
            params.push(await this.operationalReadIds(scope.satkerId));
            where.push(`coalesce(lp.unit_satker_id, lp.satker_id) = any($${params.length})`);
            where.push(`coalesce(lp.dilimpahkan_eksternal, false) = false`);
        }
        const functionDomain = String(opts?.functionDomain || '').trim().toUpperCase();
        const organizationDomain = String(opts?.organizationDomain || (functionDomain ? 'INTERNAL_POLRI' : '')).trim().toUpperCase();
        if (functionDomain && !['INTERNAL_RESERSE', 'EKSTERNAL_RESERSE'].includes(functionDomain))
            throw new common_1.BadRequestException('functionDomain tidak valid.');
        if (organizationDomain && !['INTERNAL_POLRI', 'EKSTERNAL_POLRI'].includes(organizationDomain))
            throw new common_1.BadRequestException('organizationDomain tidak valid.');
        if (functionDomain) {
            params.push(functionDomain, organizationDomain);
            where.push(`exists (
                select 1 from public.bdb_satker_taxonomy_r11 tx
                where tx.source_table='BDB_SATKER'
                  and tx.entity_id=coalesce(lp.unit_satker_id, lp.satker_id)
                  and tx.organization_domain=$${params.length}
                  and (tx.function_domain=$${params.length - 1}
                       or ($${params.length - 1}='INTERNAL_RESERSE' and tx.function_domain='STRUCTURAL'))
            )`);
        }
        if (opts.search) {
            params.push(`%${opts.search}%`);
            where.push(`(lp.no_laporan ilike $${params.length} or lp.satker_nama ilike $${params.length})`);
        }
        if (opts.level) {
            params.push(opts.level);
            where.push(`lp.penanganan_level = $${params.length}`);
        }
        if (opts.model) {
            params.push(opts.model);
            where.push(`lp.model_lp = $${params.length}`);
        }
        if (opts.status) {
            params.push(opts.status);
            where.push(`coalesce(sm.code,'LP') = $${params.length}`);
        }
        const datePattern = /^\d{4}-\d{2}-\d{2}$/;
        if (opts.from) {
            if (!datePattern.test(opts.from))
                throw new common_1.BadRequestException('Tanggal awal tidak valid (format YYYY-MM-DD).');
            params.push(opts.from);
            where.push(`to_timestamp(lp.tgl_laporan, 'DD-MM-YYYY HH24:MI:SS')::date >= $${params.length}::date`);
        }
        if (opts.to) {
            if (!datePattern.test(opts.to))
                throw new common_1.BadRequestException('Tanggal akhir tidak valid (format YYYY-MM-DD).');
            params.push(opts.to);
            where.push(`to_timestamp(lp.tgl_laporan, 'DD-MM-YYYY HH24:MI:SS')::date <= $${params.length}::date`);
        }
        const whereSql = where.length ? 'where ' + where.join(' and ') : '';
        const totalRow = await this.dataSource.query(`select count(*)::int c from bdb_laporan_polisi lp left join bdb_status_master sm on sm.id=lp.status_id ${whereSql}`, params);
        const total = totalRow[0]?.c || 0;
        params.push(row, offset);
        const rows = await this.dataSource.query(`select lp.id, lp.dors_lp_id, lp.model_lp, lp.no_laporan, lp.tgl_laporan, lp.kategori, lp.tempat_kejadian, lp.uraian_singkat,
                    lp.penanganan_level, lp.kode_pusiknas, lp.satker_id, lp.satker_nama, lp.unit_nama, lp.unit_level,
                    lp.unit_satker_id, lp.unit_satker_nama, lp.unit_satker_kode, lp.data_scope, lp.status, lp.synced_at,
                    coalesce(sm.code,'LP') as status_code, coalesce(sm.nama,'Laporan Polisi') as status_nama,
                    (select string_agg(x.txt, '; ') from (
                        select distinct coalesce(nullif(tp->>'nama_kategori_kejahatan',''),'(tanpa kategori)')
                            || case when coalesce(nullif(tp->>'pasal_mapping',''), nullif(tp->>'pasal','')) is not null
                                    then ' — ' || coalesce(nullif(tp->>'pasal_mapping',''), nullif(tp->>'pasal','')) else '' end as txt
                        from jsonb_array_elements(case when jsonb_typeof(lp.payload_json->'tindak_pidana')='array' then lp.payload_json->'tindak_pidana' else '[]'::jsonb end) tp
                    ) x) as dugaan_tindak_pidana
             from bdb_laporan_polisi lp left join bdb_status_master sm on sm.id=lp.status_id ${whereSql}
             order by to_timestamp(nullif(lp.tgl_laporan,''), 'DD-MM-YYYY HH24:MI:SS') desc nulls last, lp.synced_at desc, lp.id desc
             limit $${params.length - 1} offset $${params.length}`, params);
        for (const r of rows) {
            r.pid = (0, id_cipher_util_1.encodeId)(r.id);
            if (!revealDors)
                r.dors_lp_id = null;
        }
        return { status: 1, data: rows, total, page, row, total_page: Math.ceil(total / row) };
    }
    async searchGlobal(q, userId, opts) {
        await this.ensureTable();
        const query = String(q || '').trim();
        if (query.length < 5)
            throw new common_1.BadRequestException('Kata kunci pencarian minimal 5 karakter.');
        const scope = await (0, scope_util_1.resolveScope)(this.dataSource, userId);
        if (!scope.all && !scope.satkerId)
            return { status: 1, data: [], total: 0 };
        const page = Math.max(1, Number(opts?.page) || 1);
        const row = Math.max(1, Math.min(100, Number(opts?.row) || 25));
        const offset = (page - 1) * row;
        const params = [`%${query.toLowerCase()}%`, `%${query}%`];
        const where = ['lp.deleted_at is null'];
        if (!scope.all) {
            params.push(await this.operationalReadIds(scope.satkerId));
            where.push(`coalesce(lp.unit_satker_id, lp.satker_id) = any($${params.length})`);
            where.push(`coalesce(lp.dilimpahkan_eksternal, false) = false`);
        }
        const pihakMatchSql = `(
            exists (
                select 1 from bdb_dors_lp_terlibat t
                join bdb_dors_lp d on d.id = t.lp_id
                where d.dors_lp_id = lp.dors_lp_id and d.model_lp = lp.model_lp
                  and (lower(coalesce(t.nama,'')) like $1 or lower(coalesce(t.nik,'')) like $1)
            )
            or exists (
                select 1 from bdb_lp_pihak_manual m
                where m.lp_id = lp.id and m.deleted_at is null
                  and (lower(coalesce(m.nama,'')) like $1 or lower(coalesce(m.nik,'')) like $1)
            )
        )`;
        where.push(`(lp.no_laporan ilike $2 or ${pihakMatchSql})`);
        const whereSql = 'where ' + where.join(' and ');
        const countRows = await this.dataSource.query(`select count(*)::int as c from bdb_laporan_polisi lp ${whereSql}`, params);
        const total = countRows[0]?.c || 0;
        const rows = await this.dataSource.query(`select lp.id, lp.no_laporan, lp.tgl_laporan, lp.kategori, lp.tempat_kejadian,
                    lp.penanganan_level, lp.satker_nama, lp.unit_nama, lp.unit_level, lp.model_lp,
                    coalesce(sm.code,'LP') as status_code, coalesce(sm.nama,'Laporan Polisi') as status_nama,
                    (lp.no_laporan ilike $2) as match_no_laporan,
                    ${pihakMatchSql} as match_pihak
             from bdb_laporan_polisi lp
             left join bdb_status_master sm on sm.id = lp.status_id
             ${whereSql}
             order by lp.synced_at desc, lp.id desc
             limit $${params.length + 1} offset $${params.length + 2}`, [...params, row, offset]);
        for (const r of rows)
            r.pid = (0, id_cipher_util_1.encodeId)(r.id);
        return { status: 1, data: rows, total, page, row, total_page: Math.ceil(total / row) };
    }
    async detail(token, userId) {
        await this.ensureTable();
        const scope = await (0, scope_util_1.resolveScope)(this.dataSource, userId);
        const id = (0, id_cipher_util_1.decodeId)(token);
        if (id == null)
            return { status: 0, data: null, message: 'LP tidak ditemukan.' };
        const rows = await this.dataSource.query('select * from bdb_laporan_polisi where id=$1', [id]);
        const row = rows[0] || null;
        const allowed = !scope.all && scope.satkerId ? await this.operationalReadIds(scope.satkerId) : null;
        if (row && row.deleted_at && !scope.isSuper) {
            return { status: 0, data: null, message: 'LP tidak ditemukan.' };
        }
        if (row && !scope.all && !allowed?.includes((0, lp_scope_util_1.effectiveLpOwnerId)(row))) {
            return { status: 0, data: null, message: 'LP tidak ditemukan.' };
        }
        if (row && !scope.all && row.dilimpahkan_eksternal) {
            return { status: 0, data: null, message: 'LP tidak ditemukan.' };
        }
        if (row) {
            row.pid = (0, id_cipher_util_1.encodeId)(row.id);
            if (!scope.isSuper) {
                row.dors_lp_id = null;
                row.raw_lp_id = null;
            }
            if (row.operasi_satgas_id) {
                const os = await this.dataSource.query('select id, jenis, nama from bdb_operasi_satgas where id=$1 and deleted_at is null', [row.operasi_satgas_id]);
                row.operasi_satgas = os[0] || null;
            }
            else {
                row.operasi_satgas = null;
            }
        }
        return { status: 1, data: row };
    }
    async setOperasiSatgas(id, operasiSatgasId, userId) {
        await this.ensureTable();
        const scope = await (0, scope_util_1.resolveScope)(this.dataSource, userId);
        let lpRow = null;
        if (!scope.all) {
            const lp = await this.dataSource.query('select satker_id, unit_satker_id, dilimpahkan_eksternal, operasi_satgas_id from bdb_laporan_polisi where id=$1', [id]);
            lpRow = lp[0] || null;
            if (!lp.length || !(await (0, lp_scope_util_1.hasOperationalLpAccess)(this.dataSource, lp[0], scope.satkerId)) || lp[0].dilimpahkan_eksternal) {
                throw new common_1.ForbiddenException('LP ini bukan (lagi) di satker Anda -- kemungkinan sudah dilimpahkan ke satker lain.');
            }
        }
        else {
            const lp = await this.dataSource.query('select satker_id, unit_satker_id, dilimpahkan_eksternal, operasi_satgas_id from bdb_laporan_polisi where id=$1', [id]);
            lpRow = lp[0] || null;
        }
        let osRow = null;
        if (operasiSatgasId != null) {
            const os = await this.dataSource.query(`select id, jenis, nama, is_aktif, deleted_at, tanggal_selesai from bdb_operasi_satgas where id=$1`, [operasiSatgasId]);
            if (!os.length || os[0].deleted_at)
                throw new common_1.BadRequestException('Operasi/Satgas tidak ditemukan.');
            const selesai = os[0].tanggal_selesai && new Date(os[0].tanggal_selesai) < new Date(new Date().toDateString());
            if (!os[0].is_aktif || selesai)
                throw new common_1.BadRequestException('Operasi/Satgas ini sudah tidak aktif.');
            osRow = { id: os[0].id, jenis: os[0].jenis, nama: os[0].nama };
        }
        await this.dataSource.query('update bdb_laporan_polisi set operasi_satgas_id=$2, updated_at=now() where id=$1', [id, operasiSatgasId]);
        await this.audit.log({ userId, action: 'SET_OPERASI_SATGAS', entity: 'laporan_polisi', entityId: id, meta: { old: lpRow?.operasi_satgas_id ?? null, new: operasiSatgasId, operator_scope_satker_id: scope.satkerId ?? null } });
        return { status: 1, data: { operasi_satgas: osRow }, message: operasiSatgasId ? 'Operasi/Satgas ditautkan.' : 'Tautan operasi/satgas dilepas.' };
    }
    async setTingkatKesulitan(id, value, userId) {
        await this.ensureTable();
        const scope = await (0, scope_util_1.resolveScope)(this.dataSource, userId);
        let lpRow = null;
        if (!scope.all) {
            const lp = await this.dataSource.query('select satker_id, unit_satker_id, dilimpahkan_eksternal, tingkat_kesulitan from bdb_laporan_polisi where id=$1', [id]);
            lpRow = lp[0] || null;
            if (!lp.length || !(await (0, lp_scope_util_1.hasOperationalLpAccess)(this.dataSource, lp[0], scope.satkerId)) || lp[0].dilimpahkan_eksternal) {
                throw new common_1.ForbiddenException('LP ini bukan (lagi) di satker Anda -- kemungkinan sudah dilimpahkan ke satker lain.');
            }
        }
        else {
            const lp = await this.dataSource.query('select satker_id, unit_satker_id, dilimpahkan_eksternal, tingkat_kesulitan from bdb_laporan_polisi where id=$1', [id]);
            lpRow = lp[0] || null;
        }
        const allowed = ['Mudah', 'Sedang', 'Sulit', 'Sangat Sulit'];
        const v = allowed.includes(String(value)) ? String(value) : null;
        await this.dataSource.query('update bdb_laporan_polisi set tingkat_kesulitan=$2, updated_at=now() where id=$1', [id, v]);
        await this.audit.log({ userId, action: 'SET_TINGKAT_KESULITAN', entity: 'laporan_polisi', entityId: id, meta: { old: lpRow?.tingkat_kesulitan ?? null, new: v, operator_scope_satker_id: scope.satkerId ?? null } });
        return { status: 1, data: { tingkat_kesulitan: v }, message: 'Tingkat kesulitan diperbarui.' };
    }
    async setSubDitPenanganan(id, value, userId) {
        await this.ensureTable();
        const scope = await (0, scope_util_1.resolveScope)(this.dataSource, userId);
        let lpRow = null;
        if (!scope.all) {
            const lp = await this.dataSource.query('select satker_id, unit_satker_id, dilimpahkan_eksternal, sub_dit_penanganan from bdb_laporan_polisi where id=$1', [id]);
            lpRow = lp[0] || null;
            if (!lp.length || !(await (0, lp_scope_util_1.hasOperationalLpAccess)(this.dataSource, lp[0], scope.satkerId)) || lp[0].dilimpahkan_eksternal) {
                throw new common_1.ForbiddenException('LP ini bukan (lagi) di satker Anda -- kemungkinan sudah dilimpahkan ke satker lain.');
            }
        }
        else {
            const lp = await this.dataSource.query('select satker_id, unit_satker_id, dilimpahkan_eksternal, sub_dit_penanganan from bdb_laporan_polisi where id=$1', [id]);
            lpRow = lp[0] || null;
        }
        const v = value === undefined || value === null || String(value).trim() === '' ? null : String(value).trim();
        await this.dataSource.query('update bdb_laporan_polisi set sub_dit_penanganan=$2, updated_at=now() where id=$1', [id, v]);
        await this.audit.log({ userId, action: 'SET_SUB_DIT_PENANGANAN', entity: 'laporan_polisi', entityId: id, meta: { old: lpRow?.sub_dit_penanganan ?? null, new: v, operator_scope_satker_id: scope.satkerId ?? null } });
        return { status: 1, data: { sub_dit_penanganan: v }, message: 'Sub Dit/Unit yang menangani diperbarui.' };
    }
    async correctSatker(id, satkerId, keterangan, userId) {
        await this.ensureTable();
        const scope = await (0, scope_util_1.resolveScope)(this.dataSource, userId);
        if (!scope.isSuper) {
            throw new common_1.ForbiddenException('Hanya superadmin yang dapat mengubah satker penanganan secara langsung.');
        }
        const lpRows = await this.dataSource.query('select id, no_laporan, satker_id, satker_nama, unit_satker_id, unit_satker_nama from bdb_laporan_polisi where id=$1', [id]);
        if (!lpRows.length)
            throw new common_1.NotFoundException('LP tidak ditemukan.');
        const lp = lpRows[0];
        const placement = await this.resolveSatkerPlacement(satkerId);
        const selected = placement.selected;
        if (Number(lp.satker_id) === Number(placement.satker.id) &&
            Number(lp.unit_satker_id || 0) === Number(placement.unit?.id || 0)) {
            throw new common_1.BadRequestException('Satker tujuan sama dengan satker saat ini.');
        }
        await this.dataSource.query(`update bdb_laporan_polisi
             set satker_id=$2, satker_nama=$3,
                 unit_satker_id=$4, unit_satker_nama=$5, unit_satker_kode=$6,
                 updated_at=now()
             where id=$1`, [
            id, placement.satker.id, placement.satker.deskripsi,
            placement.unit?.id ?? null, placement.unit?.deskripsi ?? null, placement.unit?.kode ?? null
        ]);
        let userNama = null;
        if (userId) {
            const u = await this.dataSource.query('select name from auth_users where id=$1', [userId]);
            userNama = u[0]?.name || null;
        }
        await this.audit.log({
            userId,
            userName: userNama || undefined,
            action: 'CORRECT_SATKER',
            entity: 'laporan_polisi',
            entityId: id,
            meta: {
                no_laporan: lp.no_laporan,
                satker_lama_id: lp.satker_id,
                satker_lama_nama: lp.satker_nama,
                unit_satker_lama_id: lp.unit_satker_id,
                unit_satker_lama_nama: lp.unit_satker_nama,
                satker_baru_id: placement.satker.id,
                satker_baru_nama: placement.satker.deskripsi,
                unit_satker_baru_id: placement.unit?.id ?? null,
                unit_satker_baru_nama: placement.unit?.deskripsi ?? null,
                satker_dipilih_id: selected.id,
                satker_dipilih_nama: selected.deskripsi,
                keterangan: keterangan || null
            }
        });
        return {
            status: 1,
            data: {
                id,
                satker_id: placement.satker.id,
                satker_nama: placement.satker.deskripsi,
                unit_satker_id: placement.unit?.id ?? null,
                unit_satker_nama: placement.unit?.deskripsi ?? null
            },
            message: `Satker penanganan diperbarui ke "${selected.deskripsi}".`
        };
    }
    async softDelete(id, keterangan, userId) {
        await this.ensureTable();
        const scope = await (0, scope_util_1.resolveScope)(this.dataSource, userId);
        if (!scope.isSuper) {
            throw new common_1.ForbiddenException('Hanya superadmin yang dapat menghapus Laporan Polisi.');
        }
        const alasan = (keterangan || '').trim();
        if (!alasan) {
            throw new common_1.BadRequestException('Keterangan/alasan hapus wajib diisi.');
        }
        const lpRows = await this.dataSource.query('select id, no_laporan, deleted_at from bdb_laporan_polisi where id=$1', [id]);
        if (!lpRows.length)
            throw new common_1.NotFoundException('LP tidak ditemukan.');
        const lp = lpRows[0];
        if (lp.deleted_at) {
            throw new common_1.BadRequestException('LP ini sudah dihapus sebelumnya.');
        }
        await this.dataSource.query('update bdb_laporan_polisi set deleted_at=now(), deleted_by=$2, delete_reason=$3, updated_at=now() where id=$1', [id, userId || null, alasan]);
        let userNama = null;
        if (userId) {
            const u = await this.dataSource.query('select name from auth_users where id=$1', [userId]);
            userNama = u[0]?.name || null;
        }
        await this.audit.log({
            userId,
            userName: userNama || undefined,
            action: 'SOFT_DELETE',
            entity: 'laporan_polisi',
            entityId: id,
            meta: { no_laporan: lp.no_laporan, keterangan: alasan }
        });
        return { status: 1, message: `Laporan Polisi "${lp.no_laporan}" dihapus.` };
    }
    async listUnmapped(opts) {
        await this.ensureTable();
        const page = Math.max(1, Number(opts.page) || 1);
        const row = Math.max(1, Math.min(1000, Number(opts.row) || 25));
        const offset = (page - 1) * row;
        const params = [];
        let extra = '';
        if (opts.search) {
            params.push(`%${opts.search}%`);
            extra = `and r.no_laporan ilike $${params.length}`;
        }
        const base = `
            from bdb_dors_raw_lp r
            cross join lateral (select ${LaporanPolisiService_1.KP_SQL} as kp) m
            cross join lateral (select ${LaporanPolisiService_1.LEVEL_SQL} as lvl) lv
            where not exists (select 1 from bdb_laporan_polisi lp where lp.dors_lp_id=r.dors_lp_id and lp.model_lp=r.model_lp) ${extra}`;
        const totalRow = await this.dataSource.query(`select count(*)::int c ${base}`, params);
        const total = totalRow[0]?.c || 0;
        params.push(row, offset);
        const rows = await this.dataSource.query(`select r.id, r.dors_lp_id, r.model_lp, r.no_laporan, r.data_scope, r.synced_at, r.payload_json,
                    lv.lvl as penanganan_level, m.kp as kode_pusiknas,
                    case
                        when jsonb_typeof(r.payload_json->'polsek')='object' then r.payload_json->'polsek'->>'nama'
                        when jsonb_typeof(r.payload_json->'polres')='object' then r.payload_json->'polres'->>'nama'
                        when jsonb_typeof(r.payload_json->'polda')='object' then r.payload_json->'polda'->>'nama'
                    end as penanganan_nama,
                    r.payload_json->'unit'->>'unit' as unit_nama,
                    r.payload_json->'unit'->>'level' as unit_level,
                    r.payload_json->'polda'->>'nama' as polda_nama,
                    r.payload_json->'polres'->>'nama' as polres_nama,
                    r.payload_json->'polsek'->>'nama' as polsek_nama,
                    case when m.kp is null then 'Tanpa kode pusiknas' else 'Kode tidak ada di satker' end as alasan,
                    (select string_agg(y.txt, '; ') from (
                        select distinct coalesce(nullif(tp->>'nama_kategori_kejahatan',''),'(tanpa kategori)')
                            || case when coalesce(nullif(tp->>'pasal_mapping',''), nullif(tp->>'pasal','')) is not null
                                    then ' — ' || coalesce(nullif(tp->>'pasal_mapping',''), nullif(tp->>'pasal','')) else '' end as txt
                        from jsonb_array_elements(case when jsonb_typeof(r.payload_json->'tindak_pidana')='array' then r.payload_json->'tindak_pidana' else '[]'::jsonb end) tp
                    ) y) as dugaan_tindak_pidana
             ${base}
             order by r.synced_at desc, r.id desc
             limit $${params.length - 1} offset $${params.length}`, params);
        return { status: 1, data: rows, total, page, row, total_page: Math.ceil(total / row) };
    }
    async deleteAllUnmapped(opts, userId) {
        await this.ensureTable();
        const scope = await (0, scope_util_1.resolveScope)(this.dataSource, userId);
        if (!scope.isSuper) {
            throw new common_1.ForbiddenException('Hanya superadmin yang dapat menghapus data LP belum termapping.');
        }
        const params = [];
        let extra = '';
        if (opts.search) {
            params.push(`%${opts.search}%`);
            extra = `and r.no_laporan ilike $${params.length}`;
        }
        const ret = await this.dataSource.query(`delete from bdb_dors_raw_lp r
             where not exists (select 1 from bdb_laporan_polisi lp where lp.dors_lp_id=r.dors_lp_id and lp.model_lp=r.model_lp) ${extra}
             returning r.id`, params);
        const deleted = Array.isArray(ret?.[0]) ? ret[0].length : 0;
        let userNama = null;
        if (userId) {
            const u = await this.dataSource.query('select name from auth_users where id=$1', [userId]);
            userNama = u[0]?.name || null;
        }
        await this.audit.log({
            userId,
            userName: userNama || undefined,
            action: 'DELETE_ALL_UNMAPPED',
            entity: 'dors_raw_lp',
            meta: { deleted, search: opts.search || null }
        });
        return { status: 1, data: { deleted }, message: `${deleted} data LP belum termapping dihapus.` };
    }
};
exports.LaporanPolisiService = LaporanPolisiService;
exports.LaporanPolisiService = LaporanPolisiService = LaporanPolisiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        audit_service_1.AuditService])
], LaporanPolisiService);
//# sourceMappingURL=laporan-polisi.service.js.map
