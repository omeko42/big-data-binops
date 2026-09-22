import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { readFileSync } from 'fs';
import { encodeId, decodeId } from './id-cipher.util';
import { resolveScope } from '../common/scope.util';
import { AuditService } from '../audit/audit.service';
import { join } from 'path';
import { resolveSatkerPlacementFromChain, SatkerPlacement } from './satker-placement.util';
import { effectiveLpScopeSql, hasEffectiveLpAccess } from '../common/lp-scope.util';

/**
 * Laporan Polisi terkelola. Menyalin LP dari integrasi DORS yang SUDAH termapping
 * ke satker (bdb_satker) berdasarkan kode_pusiknas satker penanganan.
 * LP yang tidak cocok = "belum termapping" (tetap di integrasi DORS).
 */
@Injectable()
export class LaporanPolisiService {
    private readonly logger = new Logger('LaporanPolisiService');
    private static ensureTablePromise: Promise<void> | null = null;
    constructor(
        private readonly dataSource: DataSource,
        private readonly audit: AuditService
    ) {}

    // Ekspresi SQL: level & kode_pusiknas satker penanganan (terdalam yang terisi).
    private static readonly LEVEL_SQL = `
        case
            when jsonb_typeof(r.payload_json->'polsek')='object' then 'Polsek'
            when jsonb_typeof(r.payload_json->'polres')='object' then 'Polres'
            when jsonb_typeof(r.payload_json->'polda')='object' and r.payload_json->'polda'->>'nama' ilike '%mabes%' then 'Mabes'
            when jsonb_typeof(r.payload_json->'polda')='object' then 'Polda'
            else 'Mabes'
        end`;
    private static readonly KP_SQL = `
        case
            when jsonb_typeof(r.payload_json->'polsek')='object' then r.payload_json->'polsek'->>'kode_pusiknas'
            when jsonb_typeof(r.payload_json->'polres')='object' then r.payload_json->'polres'->>'kode_pusiknas'
            when jsonb_typeof(r.payload_json->'polda')='object' then r.payload_json->'polda'->>'kode_pusiknas'
        end`;
    // Field "kode" DORS internal (BEDA dari "kode_pusiknas") -- kadang kode_pusiknas kosong
    // (terutama level Polsek) padahal "kode" ada. bdb_satker.dors_kode diisi dari bdb_satker_master
    // (yg sumbernya "kode" ini juga), jadi bisa jadi fallback match kalau kode_pusiknas nihil.
    private static readonly DORS_KODE_SQL = `
        case
            when jsonb_typeof(r.payload_json->'polsek')='object' then r.payload_json->'polsek'->>'kode'
            when jsonb_typeof(r.payload_json->'polres')='object' then r.payload_json->'polres'->>'kode'
            when jsonb_typeof(r.payload_json->'polda')='object' then r.payload_json->'polda'->>'kode'
        end`;

    /** Normalisasi kode sblm exact-match -- kode_pusiknas dari payload DORS kadang bawa karakter
     *  tak-kelihatan (spasi trailing, non-breaking space chr(160)) yg bikin "=" biasa gagal match
     *  walau keliatan identik di layar. Ditemukan dari kasus prod: LP tetap "belum termapping"
     *  padahal kandidat di halaman rekonsiliasi keliatan kode-nya identik persis. */
    private static normKode(expr: string): string {
        return `regexp_replace(replace(coalesce((${expr}), ''), chr(160), ''), '\\s+', '', 'g')`;
    }

    /** Pecah node pilihan menjadi satker wilayah + unit fungsi bila mempunyai induk wilayah. */
    private async resolveSatkerPlacement(satkerId: number): Promise<SatkerPlacement> {
        const chain = await this.dataSource.query(
            `with recursive satker_chain as (
                 select s.id, s.kode, s.deskripsi, s.parent_id, s.tipe_satker, 0 as depth,
                        array[s.id]::bigint[] as visited
                 from bdb_satker s
                 where s.id=$1 and s.is_synthetic=false
                 union all
                 select p.id, p.kode, p.deskripsi, p.parent_id, p.tipe_satker, c.depth + 1,
                        c.visited || p.id
                 from satker_chain c
                 join bdb_satker p on p.id=c.parent_id
                 where c.depth < 32 and not (p.id = any(c.visited))
             )
             select id, kode, deskripsi, parent_id, tipe_satker, depth
             from satker_chain
             order by depth`,
            [satkerId]
        );
        if (!chain.length) throw new NotFoundException('Satker tujuan tidak ditemukan.');
        return resolveSatkerPlacementFromChain(chain);
    }

    async ensureTable() {
        // list(), stats(), cron mapping, dan endpoint detail dapat masuk bersamaan. Tanpa single-flight,
        // semuanya mengeksekusi CREATE OR REPLACE FUNCTION / DROP TRIGGER paralel dan PostgreSQL
        // melempar "tuple concurrently updated". Promise statis menahan duplikasi dalam satu proses;
        // advisory transaction lock melindungi bila deployment memakai beberapa proses/instance.
        if (!LaporanPolisiService.ensureTablePromise) {
            LaporanPolisiService.ensureTablePromise = this.ensureTableLocked().catch((error) => {
                LaporanPolisiService.ensureTablePromise = null;
                throw error;
            });
        }
        await LaporanPolisiService.ensureTablePromise;
    }

    private async ensureTableLocked() {
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
        } catch (error) {
            await runner.rollbackTransaction();
            throw error;
        } finally {
            await runner.release();
        }
    }

    /**
     * status_id TIDAK PERNAH diisi oleh satu pun dari 6 titik INSERT ke bdb_laporan_polisi
     * (mapFromDors, mapMabesByUnit, mapByNameSimilarity, applyAliases, forceMap, mapOne) --
     * baris baru selalu masuk dgn status_id NULL, jadi tak pernah muncul di kolom "LP" pada
     * Kinerja Perkara/rekap status manapun (yg nge-group by status_code, NULL jatuh ke bucket
     * "TANPA_STATUS" yg tak ditampilkan). Trigger ini isi default status_id ke kode 'LP'
     * (Laporan Polisi baru, status paling awal) kalau NULL saat insert -- dipasang di DB level
     * (bukan ditambal di tiap query insert) supaya otomatis berlaku ke SEMUA jalur insert,
     * termasuk yg mungkin ditambah nanti. Backfill sekali utk baris lama yg sudah kadung NULL.
     */
    private async ensureDefaultStatusTrigger(runner: QueryRunner) {
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

    /**
     * Kolom link ke master data (cm_*) hasil parse payload DORS (jenis kejahatan, kategori
     * lokasi, motif, modus operandi, wilayah TKP). Lihat linkMasterData(). Idempotent.
     */
    private async ensureMasterDataLinkColumns(runner: QueryRunner) {
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

    /**
     * Isi kolom link master data (cm_*) dari payload_json DORS yang sudah tersimpan di
     * bdb_laporan_polisi. Hanya proses baris yang belum di-link (master_data_linked_at is null)
     * atau payload_json berubah sejak terakhir di-link, sehingga aman dipanggil berulang tiap
     * sync (idempotent, incremental). ID yang tak cocok ke cm_* otomatis dibiarkan null via LEFT
     * JOIN — payload_json mentah tetap tersimpan utuh sebagai sumber kebenaran cadangan.
     */
    /**
     * Auto-daftarkan master data (cm_*) yang ID-nya dikirim DORS tapi belum ada di master kita --
     * payload DORS membawa cukup info (id + nama, utk wilayah juga kode induk) utk membuat baris
     * baru sendiri, jadi TIDAK perlu tunggu ditinjau manusia. Placeholder nama dipakai kalau
     * payload tak menyertakan nama (tetap mengunci ID-nya, bukan dibuang). TIDAK berlaku utk
     * polda/polres/polsek -- itu sengaja tetap manual lewat menu Rekonsiliasi Satker (Data Lama)
     * krn datanya bisa tumpang tindih dgn bdb_satker yang sudah dikurasi.
     */
    private async autoRegisterMasterData() {
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
        // ensureTable() sudah memastikan seluruh kolom master-data tersedia di bawah
        // single-flight + advisory transaction lock. Jangan menjalankan DDL di luar
        // jalur tersebut karena linkMasterData() dapat berbarengan dengan list/stats/cron.
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
        // UPDATE ... RETURNING via DataSource.query() balikin tuple [rows[], affectedCount], BUKAN
        // array baris langsung (beda dari INSERT ... RETURNING) -- lihat memory bdb-typeorm-returning-count-bug.
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

    private mappingConfig(): { units: Record<string, string>; mabes_units: Record<string, string> } {
        try {
            const p = join(process.cwd(), 'config', 'dors-unit-mapping.json');
            const raw = JSON.parse(readFileSync(p, 'utf8'));
            return { units: raw?.units || {}, mabes_units: raw?.mabes_units || {} };
        } catch (e: any) {
            this.logger.warn('config/dors-unit-mapping.json tidak terbaca: ' + (e?.message || e));
            return { units: {}, mabes_units: {} };
        }
    }
    /** Peta unit DORS -> kata kunci anak satker (Polda/Polres). */
    private unitMapping(): Record<string, string> {
        return this.mappingConfig().units;
    }

    /**
     * Mapping LP level Mabes (Bareskrim/Densus): kode_pusiknas 060.01.00 tidak ada sbg
     * satker, tapi unitnya (mis. DITTIPIDNARKOBA BARESKRIM POLRI) ada. Cocokkan nama unit
     * DORS ke satker via config mabes_units (kata kunci global unik). Idempotent.
     */
    async mapMabesByUnit() {
        await this.ensureTable();
        const mabes = this.mappingConfig().mabes_units;
        // hanya keyword alfanumerik yang aman untuk di-inline
        const pairs = Object.entries(mabes)
            .map(([dors, kw]) => [String(dors).toUpperCase().replace(/[^A-Z0-9]/g, ''), String(kw).toUpperCase().replace(/[^A-Z0-9]/g, '')])
            .filter(([d, k]) => d && k);
        if (!pairs.length) return 0;
        const valuesSql = pairs.map(([d, k]) => `('${d}','${k}')`).join(',');
        const KP = LaporanPolisiService.KP_SQL;
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
              on regexp_replace(upper(s.deskripsi),'[^A-Z0-9]','','g') like '%' || cfg.kw || '%'
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

    /**
     * Mapping lebih dalam: untuk LP level Polda/Polres/Mabes, cocokkan unit DORS ke anak
     * satker (mis. SATRESKRIM -> "SAT RESKRIM RES ..."). Set unit_satker_* bila ketemu.
     * Aman diulang (hanya yang unit_satker_id masih null).
     */
    async remapDeeper() {
        await this.ensureTable();
        const units = this.unitMapping();
        let updated = 0;
        for (const [unit, keyword] of Object.entries(units)) {
            const kw = String(keyword).toUpperCase().replace(/[^A-Z0-9]/g, '');
            if (!kw) continue;
            const ret = await this.dataSource.query(
                `update bdb_laporan_polisi lp
                 set unit_satker_id = c.id, unit_satker_nama = c.deskripsi, unit_satker_kode = c.kode, updated_at = now()
                 from bdb_satker c
                 where lp.penanganan_level in ('Polda','Polres','Mabes')
                   and lp.unit_satker_id is null
                   and upper(regexp_replace(lp.unit_nama,'[^A-Za-z0-9]','','g')) = $1
                   and c.parent_id = lp.satker_id
                   and regexp_replace(upper(c.deskripsi),'[^A-Z0-9]','','g') like '%' || $2 || '%'
                 returning lp.id`,
                [unit, kw]
            );
            // UPDATE ... RETURNING balikin tuple [rows[], affectedCount], bukan array baris langsung.
            updated += Array.isArray(ret?.[0]) ? ret[0].length : 0;
        }
        this.logger.log(`Remap dalam: ${updated} LP dipetakan ke unit satker terdalam.`);
        return updated;
    }

    /**
     * Petakan LP DORS -> Laporan Polisi. Hanya yang kode_pusiknas-nya cocok dengan
     * bdb_satker.kode yang disalin. Idempotent (unik dors_lp_id+model_lp).
     */
    async mapFromDors() {
        await this.ensureTable();
        const started = Date.now();
        const ret = await this.dataSource.query(`
            insert into bdb_laporan_polisi
                (dors_lp_id, model_lp, raw_lp_id, no_laporan, tgl_laporan, kategori, tempat_kejadian, uraian_singkat,
                 penanganan_level, kode_pusiknas, satker_id, satker_nama, unit_nama, unit_level, data_scope, payload_json, synced_at)
            select distinct on (r.dors_lp_id, r.model_lp)
                   r.dors_lp_id, r.model_lp, r.id,
                   r.no_laporan,
                   r.payload_json->>'tgl_laporan',
                   r.payload_json->>'kategori',
                   r.payload_json->>'tempat_kejadian',
                   coalesce(r.payload_json->>'uraian_singkat_kejadian', r.payload_json->>'uraian_kejadian'),
                   ${LaporanPolisiService.LEVEL_SQL},
                   m.kp, s.id, s.deskripsi,
                   r.payload_json->'unit'->>'unit', r.payload_json->'unit'->>'level',
                   r.data_scope, r.payload_json, now()
            from bdb_dors_raw_lp r
            cross join lateral (select ${LaporanPolisiService.KP_SQL} as kp, ${LaporanPolisiService.DORS_KODE_SQL} as dkode) m
            join bdb_satker s
              on (m.kp is not null and ${LaporanPolisiService.normKode('s.kode')} = ${LaporanPolisiService.normKode('m.kp')})
              or (m.dkode is not null and s.dors_kode is not null and ${LaporanPolisiService.normKode('s.dors_kode')} = ${LaporanPolisiService.normKode('m.dkode')})
            where (m.kp is not null or m.dkode is not null)
              and not exists (select 1 from bdb_laporan_polisi lp where lp.dors_lp_id=r.dors_lp_id and lp.model_lp=r.model_lp)
            order by r.dors_lp_id, r.model_lp, (m.kp is not null and ${LaporanPolisiService.normKode('s.kode')} = ${LaporanPolisiService.normKode('m.kp')}) desc, s.id
            on conflict (dors_lp_id, model_lp) do nothing
            returning id
        `);
        const mapped = Array.isArray(ret) ? ret.length : 0;
        // LP Mabes (Bareskrim/Densus) dipetakan via nama unit (kode_pusiknas 060.01.00 tak ada satkernya)
        const mabes = await this.mapMabesByUnit();
        // Terapkan alias hasil paksa mapping sebelumnya (jadi aturan otomatis ke depan)
        const viaAlias = await this.applyAliases();
        // Otomatis: petakan sisa via kemiripan nama (>=90%, disambiguasi hirarki no. laporan).
        // Fungsi ini juga menjalankan remapDeeper (ke unit terdalam) di akhir.
        const nameRes = await this.mapByNameSimilarity(0.9);
        const viaName = nameRes?.data?.mapped || 0;
        const deeper = nameRes?.data?.unit_terdalam || 0;
        const unmapped = nameRes?.data?.belum_termapping ?? (await this.unmappedCount());
        // Link ke master data (jenis kejahatan, lokasi, motif, modus, wilayah TKP) dari payload DORS
        // yang baru disalin -- wajib jalan tiap sync, bukan langkah terpisah/manual.
        await this.linkMasterData();
        this.logger.log(`Map DORS->LP: ${mapped} kode, ${mabes} Mabes, ${viaAlias} alias, ${viaName} nama, ${deeper} unit terdalam, ${unmapped} belum, ${Date.now() - started}ms`);
        return { status: 1, data: { mapped_baru: mapped + mabes + viaAlias + viaName, via_kode: mapped, mabes_via_unit: mabes, via_alias: viaAlias, via_nama: viaName, unit_terdalam: deeper, belum_termapping: unmapped }, message: `${mapped + mabes + viaAlias + viaName} LP dipetakan (kode ${mapped}, Mabes ${mabes}, alias ${viaAlias}, nama ${viaName}).` };
    }

    private async unmappedCount(): Promise<number> {
        const r = await this.dataSource.query(`
            select count(*)::int as c
            from bdb_dors_raw_lp r
            where not exists (select 1 from bdb_laporan_polisi lp where lp.dors_lp_id=r.dors_lp_id and lp.model_lp=r.model_lp)
        `);
        return r[0]?.c || 0;
    }

    /** Ambil rantai satker dari nomor laporan: [terdalam, induk, ...] (setelah segmen SPKT). */
    private satkerChainFromNoLaporan(no?: string): string[] {
        const parts = String(no || '')
            .split('/')
            .map((s) => s.trim())
            .filter(Boolean);
        const idx = parts.findIndex((p) => /^SPKT/i.test(p));
        return idx >= 0 ? parts.slice(idx + 1) : [];
    }

    /**
     * Petakan LP yang belum termapping via KEMIRIPAN NAMA (trigram >= threshold).
     * Disambiguasi memakai induk (polres/polda) dari nomor laporan DAN payload,
     * karena nama polsek bisa sama di polres berbeda. Default threshold 0.9.
     * Bersifat manual (tidak auto) karena berbasis kemiripan.
     */
    async mapByNameSimilarity(threshold = 0.9) {
        await this.ensureTable();
        await this.dataSource.query('create extension if not exists pg_trgm');
        const th = Math.max(0.5, Math.min(1, Number(threshold) || 0.9));
        const rows = await this.dataSource.query(`
            select r.id as raw_id, r.dors_lp_id, r.model_lp, r.no_laporan, r.data_scope, r.payload_json,
                   ${LaporanPolisiService.LEVEL_SQL} as lvl, ${LaporanPolisiService.KP_SQL} as kp
            from bdb_dors_raw_lp r
            where not exists (select 1 from bdb_laporan_polisi lp where lp.dors_lp_id=r.dors_lp_id and lp.model_lp=r.model_lp)
        `);
        let mapped = 0;
        for (const r of rows) {
            const p = r.payload_json || {};
            const isObj = (k: string) => p[k] && typeof p[k] === 'object' && !Array.isArray(p[k]);
            const deepestPayload = isObj('polsek') ? p.polsek?.nama : isObj('polres') ? p.polres?.nama : isObj('polda') ? p.polda?.nama : null;
            const parentPayload = isObj('polsek') ? p.polres?.nama : isObj('polres') ? p.polda?.nama : null;
            const chain = this.satkerChainFromNoLaporan(r.no_laporan);
            const target = (deepestPayload || chain[0] || '').trim();
            if (!target) continue;
            const parentChain = (chain[1] || '').trim();
            const parentPay = (parentPayload || '').trim();
            const best = await this.dataSource.query(
                `select c.id, c.deskripsi
                 from bdb_satker c left join bdb_satker par on par.id = c.parent_id
                 where c.is_synthetic = false and similarity(upper(c.deskripsi), upper($1)) >= $4
                 order by similarity(upper(c.deskripsi), upper($1))
                        + greatest(coalesce(similarity(upper(par.deskripsi), upper($2)), 0), coalesce(similarity(upper(par.deskripsi), upper($3)), 0)) desc,
                        c.id
                 limit 1`,
                [target, parentChain || target, parentPay || target, th]
            );
            if (!best.length) continue;
            await this.insertMappedLp(r, best[0].id, best[0].deskripsi);
            mapped++;
        }
        // rapikan ke unit terdalam utk yang polda/polres
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

    private async insertMappedLp(r: any, satkerId: number, _satkerNama: string) {
        const p = r.payload_json || {};
        const placement = await this.resolveSatkerPlacement(satkerId);
        await this.dataSource.query(
            `insert into bdb_laporan_polisi
                (dors_lp_id, model_lp, raw_lp_id, no_laporan, tgl_laporan, kategori, tempat_kejadian, uraian_singkat,
                 penanganan_level, kode_pusiknas, satker_id, satker_nama, unit_nama, unit_level,
                 unit_satker_id, unit_satker_nama, unit_satker_kode, data_scope, payload_json, synced_at)
             values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19::jsonb, now())
             on conflict (dors_lp_id, model_lp) do nothing`,
            [
                r.dors_lp_id, r.model_lp, r.raw_id, r.no_laporan,
                p.tgl_laporan ?? null, p.kategori ?? null, p.tempat_kejadian ?? null,
                p.uraian_singkat_kejadian ?? p.uraian_kejadian ?? null,
                r.lvl, r.kp, placement.satker.id, placement.satker.deskripsi,
                p.unit?.unit ?? null, p.unit?.level ?? null,
                placement.unit?.id ?? null, placement.unit?.deskripsi ?? null, placement.unit?.kode ?? null,
                r.data_scope, JSON.stringify(p)
            ]
        );
    }

    /**
     * PAKSA MAPPING: petakan LP belum termapping ke satker TERBAIK (ranking nama+induk),
     * meski di bawah 90% (floor rendah agar tak asal). Setiap hasil DIREKAM sebagai alias
     * (bdb_dors_satker_map) sehingga LP serupa berikutnya otomatis termapping tanpa paksa ulang.
     */
    async forceMap(threshold = 0.4) {
        await this.ensureTable();
        await this.ensureAliasTable();
        await this.dataSource.query('create extension if not exists pg_trgm');
        const floor = Math.max(0.2, Math.min(0.95, Number(threshold) || 0.4));
        const rows = await this.dataSource.query(`
            select r.id as raw_id, r.dors_lp_id, r.model_lp, r.no_laporan, r.data_scope, r.payload_json,
                   ${LaporanPolisiService.LEVEL_SQL} as lvl, ${LaporanPolisiService.KP_SQL} as kp
            from bdb_dors_raw_lp r
            where not exists (select 1 from bdb_laporan_polisi lp where lp.dors_lp_id=r.dors_lp_id and lp.model_lp=r.model_lp)
        `);
        let mapped = 0;
        for (const r of rows) {
            const p = r.payload_json || {};
            const isObj = (k: string) => p[k] && typeof p[k] === 'object' && !Array.isArray(p[k]);
            const deepest = isObj('polsek') ? p.polsek?.nama : isObj('polres') ? p.polres?.nama : isObj('polda') ? p.polda?.nama : null;
            const parentPay = isObj('polsek') ? p.polres?.nama : isObj('polres') ? p.polda?.nama : null;
            const chain = this.satkerChainFromNoLaporan(r.no_laporan);
            const target = (deepest || chain[0] || '').trim();
            if (!target) continue;
            const parentChain = (chain[1] || '').trim();
            const best = await this.dataSource.query(
                `select c.id, c.deskripsi
                 from bdb_satker c left join bdb_satker par on par.id = c.parent_id
                 where c.is_synthetic = false and similarity(upper(c.deskripsi), upper($1)) >= $4
                 order by similarity(upper(c.deskripsi), upper($1))
                        + greatest(coalesce(similarity(upper(par.deskripsi), upper($2)), 0), coalesce(similarity(upper(par.deskripsi), upper($3)), 0)) desc,
                        c.id
                 limit 1`,
                [target, parentChain || target, parentPay || target, floor]
            );
            if (!best.length) continue;
            const parentAlias = (parentPay || parentChain || null) as string | null;
            await this.dataSource.query(
                `insert into bdb_dors_satker_map (dors_kode_pusiknas, dors_nama, dors_parent_nama, satker_id, satker_nama, catatan)
                 values ($1,$2,$3,$4,$5,'paksa mapping')
                 on conflict (coalesce(dors_kode_pusiknas,''), lower(dors_nama), lower(coalesce(dors_parent_nama,'')), lower(coalesce(unit_nama,'')))
                 do update set satker_id=excluded.satker_id, satker_nama=excluded.satker_nama, updated_at=now()`,
                [r.kp || null, target, parentAlias, best[0].id, best[0].deskripsi]
            );
            await this.insertMappedLp(r, best[0].id, best[0].deskripsi);
            mapped++;
        }
        const deeper = await this.remapDeeper();
        const unmapped = await this.unmappedCount();
        this.logger.log(`PAKSA map: ${mapped} LP dipaksa dipetakan + direkam alias, ${deeper} ke unit terdalam, sisa ${unmapped}.`);
        return { status: 1, data: { mapped, unit_terdalam: deeper, belum_termapping: unmapped }, message: `${mapped} LP dipetakan paksa & direkam sebagai alias.` };
    }

    /**
     * Terapkan alias YANG DI-SCOPE KE UNIT TERTENTU (unit_nama terisi) -- hasil "Paksa
     * Petakan"/"Tambah ke Tree" per-unit dari halaman LP Tanpa Satker. Dijalankan LEBIH DULU
     * daripada applyGroupAliases() supaya lebih presisi: satu grup kode_pusiknas (mis. Mabes
     * Polri 060.01.00) bisa punya alias unit BERBEDA-BEDA ke satker_id BERBEDA-BEDA, bukan
     * semua LP di grup itu numpuk ke satu satker yg sama.
     */
    private async applyUnitAliases() {
        await this.ensureAliasTable();
        const ret = await this.dataSource.query(`
            insert into bdb_laporan_polisi
                (dors_lp_id, model_lp, raw_lp_id, no_laporan, tgl_laporan, kategori, tempat_kejadian, uraian_singkat,
                 penanganan_level, kode_pusiknas, satker_id, satker_nama, unit_nama, unit_level,
                 unit_satker_id, unit_satker_nama, unit_satker_kode, data_scope, payload_json, synced_at)
            select distinct on (r.dors_lp_id, r.model_lp)
                   r.dors_lp_id, r.model_lp, r.id, r.no_laporan,
                   r.payload_json->>'tgl_laporan', r.payload_json->>'kategori', r.payload_json->>'tempat_kejadian',
                   coalesce(r.payload_json->>'uraian_singkat_kejadian', r.payload_json->>'uraian_kejadian'),
                   ${LaporanPolisiService.LEVEL_SQL}, ${LaporanPolisiService.KP_SQL},
                   coalesce(wilayah.id, target.id), coalesce(wilayah.deskripsi, target.deskripsi),
                   r.payload_json->'unit'->>'unit', r.payload_json->'unit'->>'level',
                   case when wilayah.id is not null and wilayah.id <> target.id then target.id end,
                   case when wilayah.id is not null and wilayah.id <> target.id then target.deskripsi end,
                   case when wilayah.id is not null and wilayah.id <> target.id then target.kode end,
                   r.data_scope, r.payload_json, now()
            from bdb_dors_raw_lp r
            join bdb_dors_satker_map a
              on a.unit_nama is not null
                 and a.dors_kode_pusiknas is not null
                  and ${LaporanPolisiService.normKode('a.dors_kode_pusiknas')} = ${LaporanPolisiService.normKode(LaporanPolisiService.KP_SQL)}
                  and upper(regexp_replace(a.unit_nama,'[^A-Za-z0-9]','','g')) = upper(regexp_replace(coalesce(r.payload_json->'unit'->>'unit',''),'[^A-Za-z0-9]','','g'))
            join bdb_satker target on target.id=a.satker_id
            left join lateral (
                with recursive ancestors as (
                    select s.id, s.deskripsi, s.parent_id, s.tipe_satker, 0 as depth, array[s.id]::bigint[] as visited
                    from bdb_satker s where s.id=target.id
                    union all
                    select p.id, p.deskripsi, p.parent_id, p.tipe_satker, x.depth + 1, x.visited || p.id
                    from ancestors x join bdb_satker p on p.id=x.parent_id
                    where x.depth < 32 and not (p.id = any(x.visited))
                )
                select id, deskripsi from ancestors
                where upper(coalesce(tipe_satker,'')) in ('POLDA','POLRES','POLSEK')
                order by depth limit 1
            ) wilayah on true
            where not exists (select 1 from bdb_laporan_polisi lp where lp.dors_lp_id=r.dors_lp_id and lp.model_lp=r.model_lp)
            order by r.dors_lp_id, r.model_lp, a.id
            on conflict (dors_lp_id, model_lp) do nothing
            returning id
        `);
        return Array.isArray(ret) ? ret.length : 0;
    }

    /** Alias "seluruh grup" (unit_nama kosong) -- perilaku asli, sebelum ada granularitas unit. */
    private async applyGroupAliases() {
        await this.ensureAliasTable();
        const ret = await this.dataSource.query(`
            insert into bdb_laporan_polisi
                (dors_lp_id, model_lp, raw_lp_id, no_laporan, tgl_laporan, kategori, tempat_kejadian, uraian_singkat,
                 penanganan_level, kode_pusiknas, satker_id, satker_nama, unit_nama, unit_level,
                 unit_satker_id, unit_satker_nama, unit_satker_kode, data_scope, payload_json, synced_at)
            select distinct on (r.dors_lp_id, r.model_lp)
                   r.dors_lp_id, r.model_lp, r.id, r.no_laporan,
                   r.payload_json->>'tgl_laporan', r.payload_json->>'kategori', r.payload_json->>'tempat_kejadian',
                   coalesce(r.payload_json->>'uraian_singkat_kejadian', r.payload_json->>'uraian_kejadian'),
                   ${LaporanPolisiService.LEVEL_SQL}, ${LaporanPolisiService.KP_SQL},
                   coalesce(wilayah.id, target.id), coalesce(wilayah.deskripsi, target.deskripsi),
                   r.payload_json->'unit'->>'unit', r.payload_json->'unit'->>'level',
                   case when wilayah.id is not null and wilayah.id <> target.id then target.id end,
                   case when wilayah.id is not null and wilayah.id <> target.id then target.deskripsi end,
                   case when wilayah.id is not null and wilayah.id <> target.id then target.kode end,
                   r.data_scope, r.payload_json, now()
            from bdb_dors_raw_lp r
            cross join lateral (select
                case when jsonb_typeof(r.payload_json->'polsek')='object' then r.payload_json->'polsek'->>'nama'
                     when jsonb_typeof(r.payload_json->'polres')='object' then r.payload_json->'polres'->>'nama'
                     when jsonb_typeof(r.payload_json->'polda')='object' then r.payload_json->'polda'->>'nama' end as dors_nama,
                case when jsonb_typeof(r.payload_json->'polsek')='object' then r.payload_json->'polres'->>'nama'
                     when jsonb_typeof(r.payload_json->'polres')='object' then r.payload_json->'polda'->>'nama' end as parent_nama
            ) x
            join bdb_dors_satker_map a
              on a.unit_nama is null
                 and ((a.dors_kode_pusiknas is not null and ${LaporanPolisiService.normKode('a.dors_kode_pusiknas')} = ${LaporanPolisiService.normKode(LaporanPolisiService.KP_SQL)})
                  or (lower(a.dors_nama) = lower(x.dors_nama)
                      and (a.dors_parent_nama is null or lower(a.dors_parent_nama) = lower(coalesce(x.parent_nama,'')))))
            join bdb_satker target on target.id=a.satker_id
            left join lateral (
                with recursive ancestors as (
                    select s.id, s.deskripsi, s.parent_id, s.tipe_satker, 0 as depth, array[s.id]::bigint[] as visited
                    from bdb_satker s where s.id=target.id
                    union all
                    select p.id, p.deskripsi, p.parent_id, p.tipe_satker, x.depth + 1, x.visited || p.id
                    from ancestors x join bdb_satker p on p.id=x.parent_id
                    where x.depth < 32 and not (p.id = any(x.visited))
                )
                select id, deskripsi from ancestors
                where upper(coalesce(tipe_satker,'')) in ('POLDA','POLRES','POLSEK')
                order by depth limit 1
            ) wilayah on true
            where not exists (select 1 from bdb_laporan_polisi lp where lp.dors_lp_id=r.dors_lp_id and lp.model_lp=r.model_lp)
            order by r.dors_lp_id, r.model_lp, a.id
            on conflict (dors_lp_id, model_lp) do nothing
            returning id
        `);
        return Array.isArray(ret) ? ret.length : 0;
    }

    /**
     * Terapkan alias yang sudah direkam (dari paksa mapping) ke LP belum termapping.
     * Dipanggil otomatis di tiap sync -> yang sudah pernah dipaksakan langsung termapping.
     * Alias unit-scoped diprioritaskan (lebih presisi) sebelum alias seluruh grup.
     */
    async applyAliases() {
        const viaUnit = await this.applyUnitAliases();
        const viaGroup = await this.applyGroupAliases();
        return viaUnit + viaGroup;
    }

    /**
     * Petakan SATU LP ke satker yang dipilih (manual, 1:1). Merekam alias (catatan 'manual')
     * agar LP serupa berikutnya otomatis termapping. Bisa dipakai memetakan yg belum,
     * maupun mengoreksi yang sudah termapping.
     *
     * @param scopeUnitNama Kalau diisi, alias yang direkam DI-SCOPE ke unit ini saja (dari
     *   `payload_json->'unit'->>'unit'` milik LP ini) -- dipakai jalur "petakan per unit" di
     *   halaman LP Tanpa Satker, supaya LP lain di grup kode_pusiknas yg sama tapi UNIT BEDA
     *   tidak ikut kena alias ini. Kalau kosong/undefined, alias berlaku utk SELURUH grup
     *   kode_pusiknas (perilaku asli, dipakai jalur "Paksa Petakan"/"Tambah ke Tree" biasa).
     */
    async mapOne(dorsLpId: number, modelLp: string, satkerId: number, scopeUnitNama?: string | null) {
        await this.ensureTable();
        await this.ensureAliasTable();
        const rr = await this.dataSource.query(
            `select r.id as raw_id, r.dors_lp_id, r.model_lp, r.no_laporan, r.data_scope, r.payload_json,
                    ${LaporanPolisiService.LEVEL_SQL} as lvl, ${LaporanPolisiService.KP_SQL} as kp
             from bdb_dors_raw_lp r where r.dors_lp_id=$1 and r.model_lp=$2 limit 1`,
            [dorsLpId, modelLp]
        );
        if (!rr.length) throw new Error('LP DORS tidak ditemukan.');
        const r = rr[0];
        const placement = await this.resolveSatkerPlacement(satkerId);
        const selected = placement.selected;
        const p = r.payload_json || {};
        const isObj = (k: string) => p[k] && typeof p[k] === 'object' && !Array.isArray(p[k]);
        const dorsNama = (isObj('polsek') ? p.polsek?.nama : isObj('polres') ? p.polres?.nama : isObj('polda') ? p.polda?.nama : null) || this.satkerChainFromNoLaporan(r.no_laporan)[0] || '';
        const parentNama = (isObj('polsek') ? p.polres?.nama : isObj('polres') ? p.polda?.nama : null) || this.satkerChainFromNoLaporan(r.no_laporan)[1] || null;

        await this.dataSource.query(
            `insert into bdb_laporan_polisi
                (dors_lp_id, model_lp, raw_lp_id, no_laporan, tgl_laporan, kategori, tempat_kejadian, uraian_singkat,
                 penanganan_level, kode_pusiknas, satker_id, satker_nama, unit_nama, unit_level,
                 unit_satker_id, unit_satker_nama, unit_satker_kode, data_scope, payload_json, synced_at)
             values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19::jsonb, now())
             on conflict (dors_lp_id, model_lp) do update
                 set satker_id=excluded.satker_id, satker_nama=excluded.satker_nama,
                     unit_satker_id=excluded.unit_satker_id,
                     unit_satker_nama=excluded.unit_satker_nama,
                     unit_satker_kode=excluded.unit_satker_kode,
                     updated_at=now()`,
            [
                r.dors_lp_id, r.model_lp, r.raw_id, r.no_laporan,
                p.tgl_laporan ?? null, p.kategori ?? null, p.tempat_kejadian ?? null,
                p.uraian_singkat_kejadian ?? p.uraian_kejadian ?? null,
                r.lvl, r.kp, placement.satker.id, placement.satker.deskripsi,
                p.unit?.unit ?? null, p.unit?.level ?? null,
                placement.unit?.id ?? null, placement.unit?.deskripsi ?? null, placement.unit?.kode ?? null,
                r.data_scope, JSON.stringify(p)
            ]
        );
        // Kalau dipetakan per-unit, ambil unit_nama dari payload LP ini sendiri (bukan dari
        // caller) supaya alias yg terekam PERSIS mencerminkan unit LP yg baru saja dipetakan.
        const unitNamaForAlias = scopeUnitNama ? (p.unit?.unit ?? scopeUnitNama) : null;
        if (dorsNama) {
            await this.dataSource.query(
                `insert into bdb_dors_satker_map (dors_kode_pusiknas, dors_nama, dors_parent_nama, unit_nama, satker_id, satker_nama, catatan)
                 values ($1,$2,$3,$4,$5,$6,'manual')
                 on conflict (coalesce(dors_kode_pusiknas,''), lower(dors_nama), lower(coalesce(dors_parent_nama,'')), lower(coalesce(unit_nama,'')))
                 do update set satker_id=excluded.satker_id, satker_nama=excluded.satker_nama, catatan='manual', updated_at=now()`,
                [r.kp || null, dorsNama, parentNama, unitNamaForAlias, selected.id, selected.deskripsi]
            );
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

    async stats(userId?: number) {
        await this.ensureTable();
        const scope = await resolveScope(this.dataSource, userId);
        if (!scope.all && !scope.satkerId) {
            return { status: 1, data: { total: 0, per_level: { Mabes: 0, Polda: 0, Polres: 0, Polsek: 0 }, per_status: [], belum_termapping: 0, terakhir: null } };
        }
        // Unit adalah pemilik akses efektif bila unit_satker_id terisi. Parent Polres/Polda hanya
        // menjadi pemilik untuk LP teritorial/legacy yang belum memiliki unit_satker_id.
        const scopeWhere = scope.all
            ? 'where lp.deleted_at is null'
            : `where lp.deleted_at is null and ${effectiveLpScopeSql('lp', '$1')} and coalesce(lp.dilimpahkan_eksternal, false) = false`;
        const scopeParams = scope.all ? [] : [scope.satkerId];
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
        // jumlah per status LP — SEMUA status dari master (0 tetap tampil) agar operator paham strukturnya
        let perStatus: any[] = [];
        try {
            const joinScope = scope.all
                ? 'and lp.deleted_at is null'
                : `and lp.deleted_at is null and ${effectiveLpScopeSql('lp', '$1')} and coalesce(lp.dilimpahkan_eksternal, false) = false`;
            perStatus = await this.dataSource.query(`
                select s.code, s.nama, coalesce(s.kategori,'CT') as kategori, s.urutan, count(lp.id)::int as jumlah
                from bdb_status_master s
                left join bdb_laporan_polisi lp on lp.status_id = s.id ${joinScope}
                group by s.code, s.nama, s.kategori, s.urutan, s.id
                order by s.urutan nulls last, s.id`, scopeParams);
        } catch {
            /* tabel status belum ada */
        }
        return { status: 1, data: { total: r[0]?.total || 0, per_level: { Mabes: r[0]?.mabes || 0, Polda: r[0]?.polda || 0, Polres: r[0]?.polres || 0, Polsek: r[0]?.polsek || 0 }, per_status: perStatus, belum_termapping: belum, terakhir: r[0]?.terakhir || null } };
    }

    /** Daftar Laporan Polisi terkelola (paginasi + filter). */
    async list(opts: { search?: string; level?: string; model?: string; status?: string; from?: string; to?: string; page?: number; row?: number }, userId?: number) {
        await this.ensureTable();
        const scope = await resolveScope(this.dataSource, userId);
        const revealDors = scope.isSuper;
        const page = Math.max(1, Number(opts.page) || 1);
        const row = Math.max(1, Math.min(1000, Number(opts.row) || 25));
        const offset = (page - 1) * row;
        // Operator tanpa satker -> tidak melihat data
        if (!scope.all && !scope.satkerId) return { status: 1, data: [], total: 0, page, row, total_page: 0 };
        const where: string[] = ['lp.deleted_at is null'];
        const params: any[] = [];
        if (!scope.all) {
            params.push(scope.satkerId);
            where.push(effectiveLpScopeSql('lp', `$${params.length}`));
            // LP yang sudah dilimpahkan ke instansi eksternal sudah selesai ditangani Polri --
            // satker terakhir kehilangan akses aktif, hanya bisa lihat lewat Arsip LP Pelimpahan.
            where.push(`coalesce(lp.dilimpahkan_eksternal, false) = false`);
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
        // tgl_laporan tersimpan sbg text 'DD-MM-YYYY HH:MM:SS' (bukan kolom date/timestamp asli) --
        // parse dulu via to_timestamp baru dibandingkan sbg tanggal (inklusif kedua ujung range).
        const datePattern = /^\d{4}-\d{2}-\d{2}$/;
        if (opts.from) {
            if (!datePattern.test(opts.from)) throw new BadRequestException('Tanggal awal tidak valid (format YYYY-MM-DD).');
            params.push(opts.from);
            where.push(`to_timestamp(lp.tgl_laporan, 'DD-MM-YYYY HH24:MI:SS')::date >= $${params.length}::date`);
        }
        if (opts.to) {
            if (!datePattern.test(opts.to)) throw new BadRequestException('Tanggal akhir tidak valid (format YYYY-MM-DD).');
            params.push(opts.to);
            where.push(`to_timestamp(lp.tgl_laporan, 'DD-MM-YYYY HH24:MI:SS')::date <= $${params.length}::date`);
        }
        const whereSql = where.length ? 'where ' + where.join(' and ') : '';
        const totalRow = await this.dataSource.query(`select count(*)::int c from bdb_laporan_polisi lp left join bdb_status_master sm on sm.id=lp.status_id ${whereSql}`, params);
        const total = totalRow[0]?.c || 0;
        params.push(row, offset);
        const rows = await this.dataSource.query(
            `select lp.id, lp.dors_lp_id, lp.model_lp, lp.no_laporan, lp.tgl_laporan, lp.kategori, lp.tempat_kejadian, lp.uraian_singkat,
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
             limit $${params.length - 1} offset $${params.length}`,
            params
        );
        for (const r of rows) {
            r.pid = encodeId(r.id);
            if (!revealDors) r.dors_lp_id = null; // ID DORS hanya untuk superadmin
        }
        return { status: 1, data: rows, total, page, row, total_page: Math.ceil(total / row) };
    }

    /**
     * Pencarian global lintas No. LP / nama / NIK pihak terlibat -- dipakai search box Dashboard
     * (halaman "Hasil Pencarian" tersendiri, BUKAN Register Pihak Terlibat yg per-baris-pihak).
     * Beda dari list({search}) di atas (cuma no_laporan/satker_nama): di sini nama & NIK pihak
     * terlibat (dari 2 sumber, sama seperti PihakTerlibatService.list -- DORS + manual) IKUT
     * dicocokkan, tapi hasilnya di-dedup jadi 1 baris per LP (bukan 1 baris per pihak). Minimal
     * 5 karakter WAJIB dicek di sini juga (bukan cuma di frontend) -- query < 5 karakter di tabel
     * besar (puluhan ribu LP) bisa sangat lambat & hasil nyaris tak berguna (kecocokan massal).
     */
    async searchGlobal(q: string, userId?: number, opts?: { page?: number; row?: number }) {
        await this.ensureTable();
        const query = String(q || '').trim();
        if (query.length < 5) throw new BadRequestException('Kata kunci pencarian minimal 5 karakter.');
        const scope = await resolveScope(this.dataSource, userId);
        if (!scope.all && !scope.satkerId) return { status: 1, data: [], total: 0 };

        const page = Math.max(1, Number(opts?.page) || 1);
        const row = Math.max(1, Math.min(100, Number(opts?.row) || 25));
        const offset = (page - 1) * row;

        const params: any[] = [`%${query.toLowerCase()}%`, `%${query}%`];
        const where: string[] = ['lp.deleted_at is null'];
        if (!scope.all) {
            params.push(scope.satkerId);
            where.push(effectiveLpScopeSql('lp', `$${params.length}`));
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

        const rows = await this.dataSource.query(
            `select lp.id, lp.no_laporan, lp.tgl_laporan, lp.kategori, lp.tempat_kejadian,
                    lp.penanganan_level, lp.satker_nama, lp.unit_nama, lp.unit_level, lp.model_lp,
                    coalesce(sm.code,'LP') as status_code, coalesce(sm.nama,'Laporan Polisi') as status_nama,
                    (lp.no_laporan ilike $2) as match_no_laporan,
                    ${pihakMatchSql} as match_pihak
             from bdb_laporan_polisi lp
             left join bdb_status_master sm on sm.id = lp.status_id
             ${whereSql}
             order by lp.synced_at desc, lp.id desc
             limit $${params.length + 1} offset $${params.length + 2}`,
            [...params, row, offset]
        );
        for (const r of rows) r.pid = encodeId(r.id);
        return { status: 1, data: rows, total, page, row, total_page: Math.ceil(total / row) };
    }

    /** Detail 1 LP (termasuk payload utuh). Terima token opaque (pid); tolak id numerik mentah agar tak bisa dienumerasi via URL. */
    async detail(token: string, userId?: number) {
        await this.ensureTable();
        const scope = await resolveScope(this.dataSource, userId);
        const id = decodeId(token);
        if (id == null) return { status: 0, data: null, message: 'LP tidak ditemukan.' };
        const rows = await this.dataSource.query('select * from bdb_laporan_polisi where id=$1', [id]);
        const row = rows[0] || null;
        // LP yang sudah dihapus (soft delete) disembunyikan dari semua kecuali superadmin (mis. utk audit).
        if (row && row.deleted_at && !scope.isSuper) {
            return { status: 0, data: null, message: 'LP tidak ditemukan.' };
        }
        // Pemilik efektif tunggal: unit bila terisi, selain itu satker utama.
        if (row && !scope.all && !hasEffectiveLpAccess(row, scope.satkerId)) {
            return { status: 0, data: null, message: 'LP tidak ditemukan.' };
        }
        // LP yang sudah dilimpahkan ke instansi eksternal: satker terakhir kehilangan akses aktif
        // (sama seperti pelimpahan internal), sisa akses cuma lewat Arsip LP Pelimpahan.
        if (row && !scope.all && row.dilimpahkan_eksternal) {
            return { status: 0, data: null, message: 'LP tidak ditemukan.' };
        }
        if (row) {
            row.pid = encodeId(row.id);
            if (!scope.isSuper) { row.dors_lp_id = null; row.raw_lp_id = null; } // ID DORS hanya untuk superadmin
            if (row.operasi_satgas_id) {
                const os = await this.dataSource.query('select id, jenis, nama from bdb_operasi_satgas where id=$1 and deleted_at is null', [row.operasi_satgas_id]);
                row.operasi_satgas = os[0] || null;
            } else {
                row.operasi_satgas = null;
            }
        }
        return { status: 1, data: row };
    }

    /** Tag/lepas LP ke operasi/satgas (harus berstatus AKTIF, atau null untuk melepas). */
    async setOperasiSatgas(id: number, operasiSatgasId: number | null, userId?: number) {
        await this.ensureTable();
        const scope = await resolveScope(this.dataSource, userId);
        if (!scope.all) {
            const lp = await this.dataSource.query('select satker_id, unit_satker_id, dilimpahkan_eksternal from bdb_laporan_polisi where id=$1', [id]);
            if (!lp.length || !hasEffectiveLpAccess(lp[0], scope.satkerId) || lp[0].dilimpahkan_eksternal) {
                throw new ForbiddenException('LP ini bukan (lagi) di satker Anda -- kemungkinan sudah dilimpahkan ke satker lain.');
            }
        }
        let osRow: any = null;
        if (operasiSatgasId != null) {
            const os = await this.dataSource.query(
                `select id, jenis, nama, is_aktif, deleted_at, tanggal_selesai from bdb_operasi_satgas where id=$1`,
                [operasiSatgasId]
            );
            if (!os.length || os[0].deleted_at) throw new BadRequestException('Operasi/Satgas tidak ditemukan.');
            const selesai = os[0].tanggal_selesai && new Date(os[0].tanggal_selesai) < new Date(new Date().toDateString());
            if (!os[0].is_aktif || selesai) throw new BadRequestException('Operasi/Satgas ini sudah tidak aktif.');
            osRow = { id: os[0].id, jenis: os[0].jenis, nama: os[0].nama };
        }
        await this.dataSource.query('update bdb_laporan_polisi set operasi_satgas_id=$2, updated_at=now() where id=$1', [id, operasiSatgasId]);
        return { status: 1, data: { operasi_satgas: osRow }, message: operasiSatgasId ? 'Operasi/Satgas ditautkan.' : 'Tautan operasi/satgas dilepas.' };
    }

    /** Set tingkat kesulitan penanganan LP (Mudah/Sedang/Sulit atau null). */
    async setTingkatKesulitan(id: number, value: any, userId?: number) {
        await this.ensureTable();
        const scope = await resolveScope(this.dataSource, userId);
        if (!scope.all) {
            const lp = await this.dataSource.query('select satker_id, unit_satker_id, dilimpahkan_eksternal from bdb_laporan_polisi where id=$1', [id]);
            if (!lp.length || !hasEffectiveLpAccess(lp[0], scope.satkerId) || lp[0].dilimpahkan_eksternal) {
                throw new ForbiddenException('LP ini bukan (lagi) di satker Anda -- kemungkinan sudah dilimpahkan ke satker lain.');
            }
        }
        const allowed = ['Mudah', 'Sedang', 'Sulit', 'Sangat Sulit'];
        const v = allowed.includes(String(value)) ? String(value) : null;
        await this.dataSource.query('update bdb_laporan_polisi set tingkat_kesulitan=$2, updated_at=now() where id=$1', [id, v]);
        return { status: 1, data: { tingkat_kesulitan: v }, message: 'Tingkat kesulitan diperbarui.' };
    }

    /** Sub Dit/Unit yang menangani -- freetext manual (sementara, blm dihubungkan ke satker tree). */
    async setSubDitPenanganan(id: number, value: any, userId?: number) {
        await this.ensureTable();
        const scope = await resolveScope(this.dataSource, userId);
        if (!scope.all) {
            const lp = await this.dataSource.query('select satker_id, unit_satker_id, dilimpahkan_eksternal from bdb_laporan_polisi where id=$1', [id]);
            if (!lp.length || !hasEffectiveLpAccess(lp[0], scope.satkerId) || lp[0].dilimpahkan_eksternal) {
                throw new ForbiddenException('LP ini bukan (lagi) di satker Anda -- kemungkinan sudah dilimpahkan ke satker lain.');
            }
        }
        const v = value === undefined || value === null || String(value).trim() === '' ? null : String(value).trim();
        await this.dataSource.query('update bdb_laporan_polisi set sub_dit_penanganan=$2, updated_at=now() where id=$1', [id, v]);
        return { status: 1, data: { sub_dit_penanganan: v }, message: 'Sub Dit/Unit yang menangani diperbarui.' };
    }

    /**
     * Perbaiki satker penanganan LP secara langsung (BUKAN pelimpahan/serah-terima —
     * ini koreksi kesalahan mapping otomatis, bebas pilih satker apa pun). Superadmin-only,
     * tercatat ke audit log. Beda dari lp-pelimpahan yang: (a) hanya boleh oleh pemegang LP
     * saat ini, (b) tujuan dibatasi induk/anak/sesama, (c) direkam sebagai riwayat serah-terima.
     */
    async correctSatker(id: number, satkerId: number, keterangan: string | undefined, userId?: number) {
        await this.ensureTable();
        const scope = await resolveScope(this.dataSource, userId);
        if (!scope.isSuper) {
            throw new ForbiddenException('Hanya superadmin yang dapat mengubah satker penanganan secara langsung.');
        }
        const lpRows = await this.dataSource.query(
            'select id, no_laporan, satker_id, satker_nama, unit_satker_id, unit_satker_nama from bdb_laporan_polisi where id=$1',
            [id]
        );
        if (!lpRows.length) throw new NotFoundException('LP tidak ditemukan.');
        const lp = lpRows[0];

        const placement = await this.resolveSatkerPlacement(satkerId);
        const selected = placement.selected;

        if (
            Number(lp.satker_id) === Number(placement.satker.id) &&
            Number(lp.unit_satker_id || 0) === Number(placement.unit?.id || 0)
        ) {
            throw new BadRequestException('Satker tujuan sama dengan satker saat ini.');
        }

        await this.dataSource.query(
             `update bdb_laporan_polisi
             set satker_id=$2, satker_nama=$3,
                 unit_satker_id=$4, unit_satker_nama=$5, unit_satker_kode=$6,
                 updated_at=now()
             where id=$1`,
            [
                id, placement.satker.id, placement.satker.deskripsi,
                placement.unit?.id ?? null, placement.unit?.deskripsi ?? null, placement.unit?.kode ?? null
            ]
        );

        let userNama: string | null = null;
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

    /**
     * Hapus (SOFT delete) Laporan Polisi -- superadmin-only, wajib keterangan alasan.
     * Baris TIDAK dihapus dari database, hanya ditandai deleted_at/deleted_by/delete_reason
     * dan disembunyikan dari daftar & statistik normal (lihat list()/stats()/detail()).
     */
    async softDelete(id: number, keterangan: string | undefined, userId?: number) {
        await this.ensureTable();
        const scope = await resolveScope(this.dataSource, userId);
        if (!scope.isSuper) {
            throw new ForbiddenException('Hanya superadmin yang dapat menghapus Laporan Polisi.');
        }
        const alasan = (keterangan || '').trim();
        if (!alasan) {
            throw new BadRequestException('Keterangan/alasan hapus wajib diisi.');
        }

        const lpRows = await this.dataSource.query('select id, no_laporan, deleted_at from bdb_laporan_polisi where id=$1', [id]);
        if (!lpRows.length) throw new NotFoundException('LP tidak ditemukan.');
        const lp = lpRows[0];
        if (lp.deleted_at) {
            throw new BadRequestException('LP ini sudah dihapus sebelumnya.');
        }

        await this.dataSource.query('update bdb_laporan_polisi set deleted_at=now(), deleted_by=$2, delete_reason=$3, updated_at=now() where id=$1', [id, userId || null, alasan]);

        let userNama: string | null = null;
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

    /** Daftar LP DORS yang BELUM termapping (kode_pusiknas kosong / tak cocok satker). */
    async listUnmapped(opts: { search?: string; page?: number; row?: number }) {
        await this.ensureTable();
        const page = Math.max(1, Number(opts.page) || 1);
        const row = Math.max(1, Math.min(1000, Number(opts.row) || 25));
        const offset = (page - 1) * row;
        const params: any[] = [];
        let extra = '';
        if (opts.search) {
            params.push(`%${opts.search}%`);
            extra = `and r.no_laporan ilike $${params.length}`;
        }
        const base = `
            from bdb_dors_raw_lp r
            cross join lateral (select ${LaporanPolisiService.KP_SQL} as kp) m
            cross join lateral (select ${LaporanPolisiService.LEVEL_SQL} as lvl) lv
            where not exists (select 1 from bdb_laporan_polisi lp where lp.dors_lp_id=r.dors_lp_id and lp.model_lp=r.model_lp) ${extra}`;
        const totalRow = await this.dataSource.query(`select count(*)::int c ${base}`, params);
        const total = totalRow[0]?.c || 0;
        params.push(row, offset);
        const rows = await this.dataSource.query(
            `select r.id, r.dors_lp_id, r.model_lp, r.no_laporan, r.data_scope, r.synced_at, r.payload_json,
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
             limit $${params.length - 1} offset $${params.length}`,
            params
        );
        return { status: 1, data: rows, total, page, row, total_page: Math.ceil(total / row) };
    }

    /**
     * Hapus SEMUA baris DORS mentah yang belum termapping (filter search sama seperti
     * listUnmapped) -- superadmin-only. Ini menghapus dari staging (bdb_dors_raw_lp), BUKAN
     * dari bdb_laporan_polisi -- jadi tidak menyentuh LP yang sudah termapping. Dipakai utk
     * pemulihan kondisi "satker kosong tapi terlanjur sync DORS di prod": data mentah dibersihkan,
     * lalu sync DORS berikutnya akan menarik ulang datanya dari sumber (tidak hilang permanen).
     */
    async deleteAllUnmapped(opts: { search?: string }, userId?: number) {
        await this.ensureTable();
        const scope = await resolveScope(this.dataSource, userId);
        if (!scope.isSuper) {
            throw new ForbiddenException('Hanya superadmin yang dapat menghapus data LP belum termapping.');
        }
        const params: any[] = [];
        let extra = '';
        if (opts.search) {
            params.push(`%${opts.search}%`);
            extra = `and r.no_laporan ilike $${params.length}`;
        }
        const ret = await this.dataSource.query(
            `delete from bdb_dors_raw_lp r
             where not exists (select 1 from bdb_laporan_polisi lp where lp.dors_lp_id=r.dors_lp_id and lp.model_lp=r.model_lp) ${extra}
             returning r.id`,
            params
        );
        // DELETE ... RETURNING balikin tuple [rows[], affectedCount], bukan array baris langsung.
        const deleted = Array.isArray(ret?.[0]) ? ret[0].length : 0;

        let userNama: string | null = null;
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
}
