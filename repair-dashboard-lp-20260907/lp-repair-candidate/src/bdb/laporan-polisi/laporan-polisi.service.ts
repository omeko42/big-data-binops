import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException, Inject } from '@nestjs/common';
import { KinerjaPerkaraService } from '../kinerja-perkara/kinerja-perkara.service';
import { DataSource } from 'typeorm';
import { readFileSync } from 'fs';
import { encodeId, decodeId } from './id-cipher.util';
import { resolveScope } from '../common/scope.util';
import { AuditService } from '../audit/audit.service';
import { join } from 'path';
import { operationalLpScopeIds } from '../common/lp-scope.util';
import { LpMonitoringAccessService } from '../common/lp-monitoring-access.service';

/**
 * Laporan Polisi terkelola. Menyalin LP dari integrasi DORS yang SUDAH termapping
 * ke satker (bdb_satker) berdasarkan kode_pusiknas satker penanganan.
 * LP yang tidak cocok = "belum termapping" (tetap di integrasi DORS).
 */
@Injectable()
export class LaporanPolisiService {
    @Inject(KinerjaPerkaraService)
    private readonly kinerjaPerkara!: KinerjaPerkaraService;
    private readonly logger = new Logger('LaporanPolisiService');
    private ensureTablePromise: Promise<void> | null = null;
    constructor(
        private readonly dataSource: DataSource,
        private readonly audit: AuditService,
        private readonly monitoring: LpMonitoringAccessService
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

    async ensureTable() {
        if (!this.ensureTablePromise) {
            this.ensureTablePromise = this.initializeTables().catch((error) => {
                this.ensureTablePromise = null;
                throw error;
            });
        }
        return this.ensureTablePromise;
    }

    private async initializeTables() {
        await this.dataSource.query(`
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
        await this.ensureDefaultStatusTrigger();
        await this.ensureMasterDataLinkColumns();
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
    private async ensureDefaultStatusTrigger() {
        await this.dataSource.query(`
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
        await this.dataSource.query(`
            update bdb_laporan_polisi
            set status_id = (select id from bdb_status_master where code = 'LP' limit 1)
            where status_id is null and deleted_at is null
        `);
    }

    /**
     * Kolom link ke master data (cm_*) hasil parse payload DORS (jenis kejahatan, kategori
     * lokasi, motif, modus operandi, wilayah TKP). Lihat linkMasterData(). Idempotent.
     */
    private async ensureMasterDataLinkColumns() {
        await this.dataSource.query(`
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
        await this.ensureMasterDataLinkColumns();
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
    async syncPelimpahanOwnershipFromDors() {
        // Use the SAME configured unit dictionary as initial/deeper mapping.
        const unitPairs = Object.entries(this.unitMapping()).map(([dors, keyword]) => [
            String(dors).toUpperCase().replace(/[^A-Z0-9]/g, ''),
            String(keyword).toUpperCase().replace(/[^A-Z0-9]/g, '')
        ]).filter(([dors, keyword]) => dors && keyword);
        if (!unitPairs.length) throw new Error('Kamus unit DORS kosong; sinkronisasi alamat dibatalkan.');
        const unitValues = unitPairs.map(([dors, keyword]) => `('${dors}','${keyword}')`).join(',');
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
                where (coalesce(lp.payload_json->>'pelimpahan','') = '0'
                  and coalesce(r.payload_json->>'pelimpahan','') = '1')
                  or (r.synced_at > lp.synced_at and
                      jsonb_build_array(lp.payload_json#>>'{unit,unit}',lp.payload_json#>>'{unit,level}',
                          lp.payload_json#>>'{polda,kode_pusiknas}',lp.payload_json#>>'{polres,kode_pusiknas}',lp.payload_json#>>'{polsek,kode_pusiknas}')
                      is distinct from
                      jsonb_build_array(r.payload_json#>>'{unit,unit}',r.payload_json#>>'{unit,level}',
                          r.payload_json#>>'{polda,kode_pusiknas}',r.payload_json#>>'{polres,kode_pusiknas}',r.payload_json#>>'{polsek,kode_pusiknas}'))
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
            ancestry_verified as materialized (
                select distinct tc.lp_id, tc.territory_id
                from territory_candidates tc
                join target t on t.id=tc.lp_id
                join bdb_satker territory on territory.id=tc.territory_id
                left join bdb_satker parent on parent.id=territory.parent_id
                left join bdb_satker grandparent on grandparent.id=parent.parent_id
                where t.target_level='polda'
                   or (
                    upper(parent.tipe_satker)=t.target_parent_level
                    and parent.dors_mapping_aktif=true and not coalesce(parent.is_synthetic,false)
                    and (
                        (t.target_parent_kp is not null and (parent.kode=t.target_parent_kp or parent.kode_canonical=t.target_parent_kp))
                        or (t.target_parent_kp is null and t.target_parent_nama is not null and
                            (upper(trim(parent.deskripsi))=t.target_parent_nama or upper(trim(parent.nama_satker_dors))=t.target_parent_nama))
                    )
                    and (t.target_level<>'polsek' or (
                        upper(grandparent.tipe_satker)='POLDA' and grandparent.dors_mapping_aktif=true
                        and not coalesce(grandparent.is_synthetic,false)
                        and ((nullif(t.raw_payload#>>'{polda,kode_pusiknas}','') is not null and
                              (grandparent.kode=t.raw_payload#>>'{polda,kode_pusiknas}' or grandparent.kode_canonical=t.raw_payload#>>'{polda,kode_pusiknas}'))
                            or (nullif(t.raw_payload#>>'{polda,kode_pusiknas}','') is null and
                              (upper(trim(grandparent.deskripsi))=upper(trim(t.raw_payload#>>'{polda,nama}')) or
                               upper(trim(grandparent.nama_satker_dors))=upper(trim(t.raw_payload#>>'{polda,nama}')))))
                    ))
                )
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
                    from ancestry_verified tc
                    where tc.lp_id = t.id
                ) c on true
            ),
            unit_candidates as materialized (
                select tc.id as lp_id, u.id as unit_id
                from territory_coverage tc
                join (values ${unitValues}) unit_cfg(dors_unit,keyword) on unit_cfg.dors_unit=tc.target_unit
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
                  and norm.label like '%' || unit_cfg.keyword || '%'
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
                where lp.satker_id is not distinct from r.satker_id
                  and lp.unit_satker_id is not distinct from r.unit_satker_id
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
                -- Address reconciliation is audited; it is NOT a new CAS transfer.
                insert into bdb_audit_log (user_id,user_nama,action,entity,entity_id,meta,outcome)
                select
                    null,'SYSTEM DORS','DORS_ADDRESS_RECONCILED','laporan_polisi',l.id::text,
                    jsonb_build_object('reason','Unique source unit + territory + parent/grandparent match',
                        'old_satker_id',l.satker_id,'old_satker_nama',l.satker_nama,
                        'old_unit_satker_id',l.unit_satker_id,'old_unit_satker_nama',l.unit_satker_nama,
                        'new_satker_id',l.territory_id,'new_satker_nama',l.territory_nama,
                        'new_unit_satker_id',l.unit_id,'new_unit_satker_nama',l.resolved_unit_nama,
                        'source_raw_id',l.raw_lp_id,'source_updated_at',l.raw_payload->>'updated_at'),'success'
                from locked l
                where l.owner_changed
                returning entity_id::bigint as lp_id
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
                    raw_lp_id = l.raw_lp_id,
                    data_scope = l.raw_data_scope,
                    payload_json = coalesce(lp.payload_json,'{}'::jsonb) || jsonb_build_object(
                        'unit',l.raw_payload->'unit','polda',l.raw_payload->'polda',
                        'polres',l.raw_payload->'polres','polsek',l.raw_payload->'polsek',
                        'pelimpahan',l.raw_payload->'pelimpahan',
                        '_cas_dors_address_sync',jsonb_build_object('raw_id',l.raw_lp_id,'source_updated_at',l.raw_payload->>'updated_at')),
                    synced_at = now(),
                    updated_at = now()
                from locked l
                left join inserted_history h on h.lp_id = l.id
                where lp.id = l.id
                  and (not l.owner_changed or h.lp_id is not null)
                returning lp.id, l.owner_changed,lp.unit_satker_id
            ),
            snapshot_updated as (
                update bdb_kinerja_perkara_snapshot sn set satker_id=u.unit_satker_id
                from updated u where sn.lp_id=u.id and sn.satker_id is distinct from u.unit_satker_id
                returning sn.lp_id
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
                       ${LaporanPolisiService.LEVEL_SQL} as target_level,
                       ${LaporanPolisiService.KP_SQL} as child_kp,
                       ${LaporanPolisiService.DORS_KODE_SQL} as child_dkode,
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
                           when nullif(${LaporanPolisiService.normKode('r.child_dkode')},'') is not null
                            and ${LaporanPolisiService.normKode('s.dors_kode')}=${LaporanPolisiService.normKode('r.child_dkode')}
                           then 2 else 1
                       end as signal_rank
                from raw_target r
                join bdb_satker s
                  on lower(coalesce(s.tipe_satker,''))=lower(r.target_level)
                 and coalesce(s.is_synthetic,false)=false
                 and coalesce(s.kinerja_aktif,true)=true
                 and s.dors_mapping_aktif=true
                 and (
                      (nullif(${LaporanPolisiService.normKode('r.child_kp')},'') is not null and (
                           ${LaporanPolisiService.normKode('s.kode')}=${LaporanPolisiService.normKode('r.child_kp')}
                           or ${LaporanPolisiService.normKode('s.kode_canonical')}=${LaporanPolisiService.normKode('r.child_kp')}
                      ))
                      or (nullif(${LaporanPolisiService.normKode('r.child_dkode')},'') is not null
                          and ${LaporanPolisiService.normKode('s.dors_kode')}=${LaporanPolisiService.normKode('r.child_dkode')})
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
                               (nullif(${LaporanPolisiService.normKode('r.parent_kp')},'') is not null and (
                                    ${LaporanPolisiService.normKode('p.kode')}=${LaporanPolisiService.normKode('r.parent_kp')}
                                    or ${LaporanPolisiService.normKode('p.kode_canonical')}=${LaporanPolisiService.normKode('r.parent_kp')}
                               ))
                               or (nullif(${LaporanPolisiService.normKode('r.parent_dkode')},'') is not null
                                   and ${LaporanPolisiService.normKode('p.dors_kode')}=${LaporanPolisiService.normKode('r.parent_dkode')})
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
                               (nullif(${LaporanPolisiService.normKode('r.grandparent_kp')},'') is not null and (
                                    ${LaporanPolisiService.normKode('gp.kode')}=${LaporanPolisiService.normKode('r.grandparent_kp')}
                                    or ${LaporanPolisiService.normKode('gp.kode_canonical')}=${LaporanPolisiService.normKode('r.grandparent_kp')}
                               ))
                               or (nullif(${LaporanPolisiService.normKode('r.grandparent_dkode')},'') is not null
                                   and ${LaporanPolisiService.normKode('gp.dors_kode')}=${LaporanPolisiService.normKode('r.grandparent_dkode')})
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
            await this.dataSource.query(
                `insert into bdb_laporan_polisi
                    (dors_lp_id, model_lp, raw_lp_id, no_laporan, tgl_laporan, kategori, tempat_kejadian, uraian_singkat,
                     penanganan_level, kode_pusiknas, satker_id, satker_nama, unit_nama, unit_level, data_scope, payload_json, synced_at)
                 values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16::jsonb, now())
                 on conflict (dors_lp_id, model_lp) do nothing`,
                [
                    r.dors_lp_id, r.model_lp, r.raw_id, r.no_laporan,
                    p.tgl_laporan ?? null, p.kategori ?? null, p.tempat_kejadian ?? null,
                    p.uraian_singkat_kejadian ?? p.uraian_kejadian ?? null,
                    r.lvl, r.kp, best[0].id, best[0].deskripsi,
                    p.unit?.unit ?? null, p.unit?.level ?? null, r.data_scope, JSON.stringify(p)
                ]
            );
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

    private async insertMappedLp(r: any, satkerId: number, satkerNama: string) {
        const p = r.payload_json || {};
        await this.dataSource.query(
            `insert into bdb_laporan_polisi
                (dors_lp_id, model_lp, raw_lp_id, no_laporan, tgl_laporan, kategori, tempat_kejadian, uraian_singkat,
                 penanganan_level, kode_pusiknas, satker_id, satker_nama, unit_nama, unit_level, data_scope, payload_json, synced_at)
             values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16::jsonb, now())
             on conflict (dors_lp_id, model_lp) do nothing`,
            [r.dors_lp_id, r.model_lp, r.raw_id, r.no_laporan, p.tgl_laporan ?? null, p.kategori ?? null, p.tempat_kejadian ?? null, p.uraian_singkat_kejadian ?? p.uraian_kejadian ?? null, r.lvl, r.kp, satkerId, satkerNama, p.unit?.unit ?? null, p.unit?.level ?? null, r.data_scope, JSON.stringify(p)]
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
                 penanganan_level, kode_pusiknas, satker_id, satker_nama, unit_nama, unit_level, data_scope, payload_json, synced_at)
            select distinct on (r.dors_lp_id, r.model_lp)
                   r.dors_lp_id, r.model_lp, r.id, r.no_laporan,
                   r.payload_json->>'tgl_laporan', r.payload_json->>'kategori', r.payload_json->>'tempat_kejadian',
                   coalesce(r.payload_json->>'uraian_singkat_kejadian', r.payload_json->>'uraian_kejadian'),
                   ${LaporanPolisiService.LEVEL_SQL}, ${LaporanPolisiService.KP_SQL}, a.satker_id, a.satker_nama,
                   r.payload_json->'unit'->>'unit', r.payload_json->'unit'->>'level', r.data_scope, r.payload_json, now()
            from bdb_dors_raw_lp r
            join bdb_dors_satker_map a
              on a.unit_nama is not null
                 and a.dors_kode_pusiknas is not null
                 and ${LaporanPolisiService.normKode('a.dors_kode_pusiknas')} = ${LaporanPolisiService.normKode(LaporanPolisiService.KP_SQL)}
                 and upper(regexp_replace(a.unit_nama,'[^A-Za-z0-9]','','g')) = upper(regexp_replace(coalesce(r.payload_json->'unit'->>'unit',''),'[^A-Za-z0-9]','','g'))
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
                 penanganan_level, kode_pusiknas, satker_id, satker_nama, unit_nama, unit_level, data_scope, payload_json, synced_at)
            select distinct on (r.dors_lp_id, r.model_lp)
                   r.dors_lp_id, r.model_lp, r.id, r.no_laporan,
                   r.payload_json->>'tgl_laporan', r.payload_json->>'kategori', r.payload_json->>'tempat_kejadian',
                   coalesce(r.payload_json->>'uraian_singkat_kejadian', r.payload_json->>'uraian_kejadian'),
                   ${LaporanPolisiService.LEVEL_SQL}, ${LaporanPolisiService.KP_SQL}, a.satker_id, a.satker_nama,
                   r.payload_json->'unit'->>'unit', r.payload_json->'unit'->>'level', r.data_scope, r.payload_json, now()
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
        const s = await this.dataSource.query('select id, deskripsi, kode from bdb_satker where id=$1 and is_synthetic=false', [satkerId]);
        if (!s.length) throw new Error('Satker tujuan tidak ditemukan.');
        const p = r.payload_json || {};
        const isObj = (k: string) => p[k] && typeof p[k] === 'object' && !Array.isArray(p[k]);
        const dorsNama = (isObj('polsek') ? p.polsek?.nama : isObj('polres') ? p.polres?.nama : isObj('polda') ? p.polda?.nama : null) || this.satkerChainFromNoLaporan(r.no_laporan)[0] || '';
        const parentNama = (isObj('polsek') ? p.polres?.nama : isObj('polres') ? p.polda?.nama : null) || this.satkerChainFromNoLaporan(r.no_laporan)[1] || null;

        await this.dataSource.query(
            `insert into bdb_laporan_polisi
                (dors_lp_id, model_lp, raw_lp_id, no_laporan, tgl_laporan, kategori, tempat_kejadian, uraian_singkat,
                 penanganan_level, kode_pusiknas, satker_id, satker_nama, unit_nama, unit_level, data_scope, payload_json, synced_at)
             values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16::jsonb, now())
             on conflict (dors_lp_id, model_lp) do update
                set satker_id=excluded.satker_id, satker_nama=excluded.satker_nama,
                    unit_satker_id=null, unit_satker_nama=null, unit_satker_kode=null, updated_at=now()`,
            [r.dors_lp_id, r.model_lp, r.raw_id, r.no_laporan, p.tgl_laporan ?? null, p.kategori ?? null, p.tempat_kejadian ?? null, p.uraian_singkat_kejadian ?? p.uraian_kejadian ?? null, r.lvl, r.kp, s[0].id, s[0].deskripsi, p.unit?.unit ?? null, p.unit?.level ?? null, r.data_scope, JSON.stringify(p)]
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
                [r.kp || null, dorsNama, parentNama, unitNamaForAlias, s[0].id, s[0].deskripsi]
            );
        }
        return { status: 1, data: { dors_lp_id: dorsLpId, satker_id: s[0].id, satker_nama: s[0].deskripsi }, message: `LP dipetakan ke ${s[0].deskripsi}.` };
    }

    /**
     * Scope baca operasional. Operator biasa tetap exact. Sat Reskrim tingkat Polres juga boleh
     * membaca Polsek + Unit Reskrim Polsek di bawah Polres yang sama untuk supervisi jaringan.
     * Hak mutasi tetap diperiksa terpisah oleh masing-masing aksi.
     */
    private async operationalReadIds(rootId: number): Promise<number[]> {
        return operationalLpScopeIds(this.dataSource, rootId);
    }

    async monitoringOptions(userId?: number) {
        return { status: 1, data: await this.monitoring.metadata(userId) };
    }

    private csvNumbers(value?: string): number[] {
        return Array.from(new Set(String(value || '').split(',').map((x) => Number(x.trim())).filter((x) => Number.isInteger(x) && x > 0)));
    }

    private csvValues(value?: string): string[] {
        return Array.from(new Set(String(value || '').split(',').map((x) => x.trim().toUpperCase()).filter(Boolean)));
    }

    private lpTaxonomy(
        functionDomain?: string,
        organizationDomain?: string
    ): {
        functionDomain:
            | 'INTERNAL_RESERSE'
            | 'EKSTERNAL_RESERSE'
            | 'STRUCTURAL'
            | 'NOT_APPLICABLE';
        organizationDomain:
            | 'INTERNAL_POLRI'
            | 'EKSTERNAL_POLRI'
            | 'NOT_APPLICABLE';
    } | null {
        const rawFunction = String(functionDomain || '')
            .trim()
            .toUpperCase();

        // "Semua cakupan" dari FE = tidak ada taxonomy filter.
        if (!rawFunction) return null;

        const functionAliases: Record<string, any> = {
            RESERSE: 'INTERNAL_RESERSE',
            INTERNAL_RESERSE: 'INTERNAL_RESERSE',
            NON_RESERSE: 'EKSTERNAL_RESERSE',
            EKSTERNAL_RESERSE: 'EKSTERNAL_RESERSE',
            STRUCTURAL: 'STRUCTURAL',
            NOT_APPLICABLE: 'NOT_APPLICABLE',
            UNCLASSIFIED: 'STRUCTURAL'
        };

        const organizationAliases: Record<string, any> = {
            INTERNAL_POLRI: 'INTERNAL_POLRI',
            EKSTERNAL_POLRI: 'EKSTERNAL_POLRI',
            EXTERNAL_POLRI: 'EKSTERNAL_POLRI',
            NOT_APPLICABLE: 'NOT_APPLICABLE',
            UNCLASSIFIED: 'NOT_APPLICABLE'
        };

        const f = functionAliases[rawFunction];
        const o = organizationAliases[
            String(organizationDomain || 'INTERNAL_POLRI')
                .trim()
                .toUpperCase()
        ];

        if (!f) {
            throw new BadRequestException(
                'functionDomain tidak valid.'
            );
        }

        if (!o) {
            throw new BadRequestException(
                'organizationDomain tidak valid.'
            );
        }

        return {
            functionDomain: f,
            organizationDomain: o
        };
    }

    private async auditActor(userId?: number): Promise<{ name: string | null; satkerName: string | null }> {
        if (!userId) return { name: null, satkerName: null };
        const rows = await this.dataSource.query(
            `select u.name,s.deskripsi as satker_nama from auth_users u left join bdb_satker s on s.id=u.scope_satker_id where u.id=$1`,
            [userId]
        );
        return { name: rows[0]?.name || null, satkerName: rows[0]?.satker_nama || null };
    }

    async stats(
        userId?: number,
        targetSatkerId?: number,
        from?: string,
        to?: string,
        functionDomain?: string,
        organizationDomain?: string,
        search?: string,
        level?: string,
        model?: string,
        status?: string
    ) {
        await this.ensureTable();

        const scope = await resolveScope(this.dataSource, userId);
        const plan = await this.monitoring.plan(userId, targetSatkerId);

        if (!plan.all && !plan.actorSatkerId) {
            return {
                status: 1,
                data: {
                    total: 0,
                    per_level: {
                        Mabes: 0,
                        Polda: 0,
                        Polres: 0,
                        Polsek: 0
                    },
                    per_status: [],
                    belum_termapping: 0,
                    terakhir: null
                }
            };
        }

        const where: string[] = ['lp.deleted_at is null'];
        const params: any[] = [];

        // Scope satker / monitoring — pertahankan logic existing.
        if (!plan.all) {
            if (plan.own) {
                params.push(plan.actorSatkerId);
                where.push(
                    `coalesce(lp.unit_satker_id, lp.satker_id) = $${params.length}`
                );
            } else {
                params.push(plan.ownerIds);
                where.push(
                    `coalesce(lp.unit_satker_id, lp.satker_id) = any($${params.length})`
                );

                params.push(plan.crimeIds.length ? plan.crimeIds : [-1]);
                where.push(
                    `lp.jenis_kejahatan_id = any($${params.length})`
                );
            }

            where.push(
                'coalesce(lp.dilimpahkan_eksternal, false) = false'
            );
        }

        const taxonomy = this.lpTaxonomy(
            functionDomain,
            organizationDomain
        );

        if (taxonomy) {
            const taxonomyIds =
                await this.kinerjaPerkara.lpTaxonomyAggregateSatkerIds(
                    taxonomy.functionDomain,
                    taxonomy.organizationDomain
                );

            params.push(
                taxonomyIds.length ? taxonomyIds : [-1]
            );

            where.push(
                `coalesce(lp.unit_satker_id, lp.satker_id) = any($${params.length})`
            );
        }

        // Statistik dan tabel Daftar LP harus memakai filter dasar yang sama.
        // Subquery status membuat predicate aman dipakai juga di query per-status.
        if (search) {
            params.push(`%${search}%`);
            where.push(`(lp.no_laporan ilike $${params.length} or lp.satker_nama ilike $${params.length} or exists (select 1 from bdb_lp_pelimpahan px where px.lp_id=lp.id and px.satker_eksternal_id is not null and px.satker_eksternal_nama ilike $${params.length}))`);
        }
        if (level) {
            params.push(level);
            where.push(`lp.penanganan_level = $${params.length}`);
        }
        if (model) {
            params.push(model);
            where.push(`lp.model_lp = $${params.length}`);
        }
        if (status) {
            params.push(status);
            where.push(`coalesce((select sm.code from bdb_status_master sm where sm.id=lp.status_id),'LP') = $${params.length}`);
        }

        // tgl_laporan tersimpan sebagai TEXT:
        // DD-MM-YYYY HH24:MI:SS
        const datePattern = /^\d{4}-\d{2}-\d{2}$/;

        if (from) {
            if (!datePattern.test(from)) {
                throw new BadRequestException(
                    'Tanggal awal tidak valid (format YYYY-MM-DD).'
                );
            }

            params.push(from);
            where.push(
                `to_timestamp(nullif(lp.tgl_laporan,''), 'DD-MM-YYYY HH24:MI:SS')::date >= $${params.length}::date`
            );
        }

        if (to) {
            if (!datePattern.test(to)) {
                throw new BadRequestException(
                    'Tanggal akhir tidak valid (format YYYY-MM-DD).'
                );
            }

            params.push(to);
            where.push(
                `to_timestamp(nullif(lp.tgl_laporan,''), 'DD-MM-YYYY HH24:MI:SS')::date <= $${params.length}::date`
            );
        }

        const predicate = where.join(' and ');

        // Total + level memakai dataset/filter yang sama.
        const r = await this.dataSource.query(
            `
            select
                count(*)::int as total,
                count(*) filter (
                    where lp.penanganan_level = 'Mabes'
                )::int as mabes,
                count(*) filter (
                    where lp.penanganan_level = 'Polda'
                )::int as polda,
                count(*) filter (
                    where lp.penanganan_level = 'Polres'
                )::int as polres,
                count(*) filter (
                    where lp.penanganan_level = 'Polsek'
                )::int as polsek,
                max(lp.synced_at) as terakhir
            from bdb_laporan_polisi lp
            where ${predicate}
            `,
            params
        );

        // Semua kartu status WAJIB memakai predicate yang sama.
        let perStatus: any[] = [];

        try {
            perStatus = await this.dataSource.query(
                `
                select
                    s.code,
                    s.nama,
                    coalesce(s.kategori,'CT') as kategori,
                    s.urutan,
                    count(lp.id)::int as jumlah
                from bdb_status_master s
                left join bdb_laporan_polisi lp
                    on lp.status_id = s.id
                   and ${predicate}
                group by
                    s.code,
                    s.nama,
                    s.kategori,
                    s.urutan,
                    s.id
                order by
                    s.urutan nulls last,
                    s.id
                `,
                params
            );
        } catch {
            /* tabel status belum ada */
        }

        const belum = scope.all
            ? await this.unmappedCount()
            : 0;

        return {
            status: 1,
            data: {
                total: r[0]?.total || 0,
                per_level: {
                    Mabes: r[0]?.mabes || 0,
                    Polda: r[0]?.polda || 0,
                    Polres: r[0]?.polres || 0,
                    Polsek: r[0]?.polsek || 0
                },
                per_status: perStatus,
                belum_termapping: belum,
                terakhir: r[0]?.terakhir || null
            }
        };
    }

    /** Daftar Laporan Polisi terkelola (paginasi + filter). */
    async list(opts: { search?: string; level?: string; model?: string; status?: string; from?: string; to?: string; targetSatkerId?: string; jenisKejahatanIds?: string; golonganKejahatanIds?: string; monitoringTags?: string; functionDomain?: string; organizationDomain?: string; page?: number; row?: number }, userId?: number) {
        await this.ensureTable();
        const scope = await resolveScope(this.dataSource, userId);
        const targetSatkerId = opts.targetSatkerId ? Number(opts.targetSatkerId) : undefined;
        if (opts.targetSatkerId && (!Number.isInteger(targetSatkerId) || Number(targetSatkerId) <= 0)) throw new BadRequestException('Satker monitoring tidak valid.');
        const plan = await this.monitoring.plan(userId, targetSatkerId);
        const revealDors = scope.isSuper;
        const page = Math.max(1, Number(opts.page) || 1);
        const row = Math.max(1, Math.min(1000, Number(opts.row) || 25));
        const offset = (page - 1) * row;
        // Operator tanpa satker -> tidak melihat data
        if (!scope.all && !scope.satkerId) return { status: 1, data: [], total: 0, page, row, total_page: 0 };
        const where: string[] = ['lp.deleted_at is null'];
        const params: any[] = [];
        if (!plan.all) {
            params.push(plan.own ? plan.actorSatkerId : plan.ownerIds);
            where.push(plan.own
                ? `coalesce(lp.unit_satker_id, lp.satker_id) = $${params.length}`
                : `coalesce(lp.unit_satker_id, lp.satker_id) = any($${params.length})`);
            if (!plan.own) {
                params.push(plan.crimeIds.length ? plan.crimeIds : [-1]);
                where.push(`lp.jenis_kejahatan_id = any($${params.length})`);
            }
            // LP yang sudah dilimpahkan ke instansi eksternal sudah selesai ditangani Polri --
            // satker terakhir kehilangan akses aktif, hanya bisa lihat lewat Arsip LP Pelimpahan.
            where.push(`coalesce(lp.dilimpahkan_eksternal, false) = false`);
        }
        const taxonomy = this.lpTaxonomy(
            opts.functionDomain,
            opts.organizationDomain
        );

        if (taxonomy) {
            const taxonomyIds =
                await this.kinerjaPerkara.lpTaxonomyAggregateSatkerIds(
                    taxonomy.functionDomain,
                    taxonomy.organizationDomain
                );

            params.push(
                taxonomyIds.length ? taxonomyIds : [-1]
            );

            where.push(
                `coalesce(lp.unit_satker_id, lp.satker_id) = any($${params.length})`
            );
        }

        if (opts.search) {
            params.push(`%${opts.search}%`);
            where.push(`(lp.no_laporan ilike $${params.length} or lp.satker_nama ilike $${params.length} or exists (select 1 from bdb_lp_pelimpahan px where px.lp_id=lp.id and px.satker_eksternal_id is not null and px.satker_eksternal_nama ilike $${params.length}))`);
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
        const requestedCrimeIds = this.csvNumbers(opts.jenisKejahatanIds);
        if (requestedCrimeIds.length) {
            const effectiveCrimeIds = plan.all || plan.own ? requestedCrimeIds : requestedCrimeIds.filter((id) => plan.crimeIds.includes(id));
            params.push(effectiveCrimeIds.length ? effectiveCrimeIds : [-1]);
            where.push(`lp.jenis_kejahatan_id = any($${params.length})`);
        }
        const golonganIds = this.csvNumbers(opts.golonganKejahatanIds);
        if (golonganIds.length) {
            params.push(golonganIds);
            where.push(`lp.golongan_kejahatan_id = any($${params.length})`);
        }
        const tags = this.csvValues(opts.monitoringTags);
        const supportedTags = new Set(['OPERASI', 'SATGAS', 'ATENSI', 'MENONJOL']);
        if (tags.some((x) => !supportedTags.has(x))) throw new BadRequestException('Filter keterkaitan LP tidak valid.');
        if (tags.length) {
            const parts: string[] = [];
            if (tags.includes('OPERASI')) parts.push(`exists(select 1 from bdb_operasi_satgas os where os.id=lp.operasi_satgas_id and os.deleted_at is null and upper(os.jenis)='OPERASI')`);
            if (tags.includes('SATGAS')) parts.push(`exists(select 1 from bdb_operasi_satgas os where os.id=lp.operasi_satgas_id and os.deleted_at is null and upper(os.jenis)='SATGAS')`);
            if (tags.includes('ATENSI')) parts.push(`exists(select 1 from bdb_kasus_atensi_lp kal join bdb_kasus_atensi ka on ka.id=kal.kasus_atensi_id and ka.deleted_at is null where kal.lp_id=lp.id)`);
            if (tags.includes('MENONJOL')) parts.push(`exists(select 1 from bdb_kasus_menonjol_lp kml join bdb_kasus_menonjol km on km.id=kml.kasus_menonjol_id and km.deleted_at is null where kml.lp_id=lp.id)`);
            where.push(`(${parts.join(' or ')})`);
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
                    lp.unit_satker_id, lp.unit_satker_nama, lp.unit_satker_kode, lp.jenis_kejahatan_id, lp.golongan_kejahatan_id, lp.data_scope, lp.status, lp.synced_at,
                    lp.dilimpahkan_eksternal,
                    (select px.satker_eksternal_id from bdb_lp_pelimpahan px where px.lp_id=lp.id and px.satker_eksternal_id is not null order by px.created_at desc, px.id desc limit 1) as satker_eksternal_id,
                    (select px.satker_eksternal_nama from bdb_lp_pelimpahan px where px.lp_id=lp.id and px.satker_eksternal_id is not null order by px.created_at desc, px.id desc limit 1) as satker_eksternal_nama,
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
            r.monitoring_mode = !plan.all && !plan.own;
            r.can_transfer = plan.all || plan.own;
            if (r.dilimpahkan_eksternal && r.satker_eksternal_nama) {
                r.satker_asal_id = r.unit_satker_id ?? r.satker_id;
                r.satker_asal_nama = r.unit_satker_nama ?? r.satker_nama;
                // UI lama membaca satker_nama/unit_satker_nama. Untuk tujuan eksternal,
                // arahkan field tampilan yang sama ke tabel satker eksternal tanpa memalsukan FK internal.
                r.satker_id = null;
                r.satker_nama = r.satker_eksternal_nama;
                r.unit_satker_id = null;
                r.unit_satker_nama = null;
                r.unit_satker_kode = null;
                // Jangan biarkan fallback UI menggabungkan unit Polri lama dengan nama instansi eksternal.
                r.unit_nama = null;
                r.unit_level = null;
                r.kode_pusiknas = null;
                r.penanganan_level = 'Eksternal';
            }
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
            const allowed = await this.operationalReadIds(scope.satkerId!);
            params.push(allowed);
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
        const access = row ? await this.monitoring.canAccessLp(userId, row) : { allowed: false, monitoring: false, plan: null };
        // LP yang sudah dihapus (soft delete) disembunyikan dari semua kecuali superadmin (mis. utk audit).
        if (row && row.deleted_at && !scope.isSuper) {
            return { status: 0, data: null, message: 'LP tidak ditemukan.' };
        }
        // isolasi: operator hanya boleh membuka LP satkernya sendiri (termasuk kalau di-scope ke
        // level unit_satker_id -- lihat catatan di stats() soal operator level-unit)
        if (row && !access.allowed) {
            return { status: 0, data: null, message: 'LP tidak ditemukan.' };
        }
        // LP yang sudah dilimpahkan ke instansi eksternal: satker terakhir kehilangan akses aktif
        // (sama seperti pelimpahan internal), sisa akses cuma lewat Arsip LP Pelimpahan.
        if (row && !scope.all && row.dilimpahkan_eksternal) {
            return { status: 0, data: null, message: 'LP tidak ditemukan.' };
        }
        if (row) {
            row.pid = encodeId(row.id);
            row.monitoring_mode = access.monitoring;
            row.can_transfer = scope.all || !access.monitoring;
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
        const lp = await this.dataSource.query('select satker_id, unit_satker_id, jenis_kejahatan_id, dilimpahkan_eksternal, operasi_satgas_id from bdb_laporan_polisi where id=$1', [id]);
        const lpRow: any = lp[0] || null;
        const access = await this.monitoring.assertCanAccessLp(userId, id);
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
        const actor = await this.auditActor(userId);
        await this.audit.log({ userId, userName: actor.name || undefined, action: 'SET_OPERASI_SATGAS', entity: 'laporan_polisi', entityId: id, meta: { old: lpRow?.operasi_satgas_id ?? null, new: operasiSatgasId, actor_satker_id: scope.satkerId ?? null, actor_satker_nama: actor.satkerName, owner_satker_id: lpRow?.unit_satker_id ?? lpRow?.satker_id ?? null, monitoring_update: access.monitoring, target_satker_id: access.plan?.targetSatkerId ?? null } });
        return { status: 1, data: { operasi_satgas: osRow }, message: operasiSatgasId ? 'Operasi/Satgas ditautkan.' : 'Tautan operasi/satgas dilepas.' };
    }

    /** Set tingkat kesulitan penanganan LP (Mudah/Sedang/Sulit atau null). */
    async setTingkatKesulitan(id: number, value: any, userId?: number) {
        await this.ensureTable();
        const scope = await resolveScope(this.dataSource, userId);
        const lp = await this.dataSource.query('select satker_id, unit_satker_id, jenis_kejahatan_id, dilimpahkan_eksternal, tingkat_kesulitan from bdb_laporan_polisi where id=$1', [id]);
        const lpRow: any = lp[0] || null;
        const access = await this.monitoring.assertCanAccessLp(userId, id);
        const allowed = ['Mudah', 'Sedang', 'Sulit', 'Sangat Sulit'];
        const v = allowed.includes(String(value)) ? String(value) : null;
        await this.dataSource.query('update bdb_laporan_polisi set tingkat_kesulitan=$2, updated_at=now() where id=$1', [id, v]);
        const actor = await this.auditActor(userId);
        await this.audit.log({ userId, userName: actor.name || undefined, action: 'SET_TINGKAT_KESULITAN', entity: 'laporan_polisi', entityId: id, meta: { old: lpRow?.tingkat_kesulitan ?? null, new: v, actor_satker_id: scope.satkerId ?? null, actor_satker_nama: actor.satkerName, owner_satker_id: lpRow?.unit_satker_id ?? lpRow?.satker_id ?? null, monitoring_update: access.monitoring, target_satker_id: access.plan?.targetSatkerId ?? null } });
        return { status: 1, data: { tingkat_kesulitan: v }, message: 'Tingkat kesulitan diperbarui.' };
    }

    /** Sub Dit/Unit yang menangani -- freetext manual (sementara, blm dihubungkan ke satker tree). */
    async setSubDitPenanganan(id: number, value: any, userId?: number) {
        await this.ensureTable();
        const scope = await resolveScope(this.dataSource, userId);
        const lp = await this.dataSource.query('select satker_id, unit_satker_id, jenis_kejahatan_id, dilimpahkan_eksternal, sub_dit_penanganan from bdb_laporan_polisi where id=$1', [id]);
        const lpRow: any = lp[0] || null;
        const access = await this.monitoring.assertCanAccessLp(userId, id);
        const v = value === undefined || value === null || String(value).trim() === '' ? null : String(value).trim();
        await this.dataSource.query('update bdb_laporan_polisi set sub_dit_penanganan=$2, updated_at=now() where id=$1', [id, v]);
        const actor = await this.auditActor(userId);
        await this.audit.log({ userId, userName: actor.name || undefined, action: 'SET_SUB_DIT_PENANGANAN', entity: 'laporan_polisi', entityId: id, meta: { old: lpRow?.sub_dit_penanganan ?? null, new: v, actor_satker_id: scope.satkerId ?? null, actor_satker_nama: actor.satkerName, owner_satker_id: lpRow?.unit_satker_id ?? lpRow?.satker_id ?? null, monitoring_update: access.monitoring, target_satker_id: access.plan?.targetSatkerId ?? null } });
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
        const lpRows = await this.dataSource.query('select id, no_laporan, satker_id, satker_nama, dilimpahkan_eksternal from bdb_laporan_polisi where id=$1', [id]);
        if (!lpRows.length) throw new NotFoundException('LP tidak ditemukan.');
        const lp = lpRows[0];

        const satkerRows = await this.dataSource.query('select id, kode, deskripsi from bdb_satker where id=$1', [satkerId]);
        if (!satkerRows.length) throw new NotFoundException('Satker tujuan tidak ditemukan.');
        const satker = satkerRows[0];

        if (!lp.dilimpahkan_eksternal && Number(lp.satker_id) === Number(satker.id)) {
            throw new BadRequestException('Satker tujuan sama dengan satker saat ini.');
        }

        await this.dataSource.query(
            `update bdb_laporan_polisi
             set satker_id=$2, satker_nama=$3, unit_satker_id=null, unit_satker_nama=null, unit_satker_kode=null, dilimpahkan_eksternal=false, updated_at=now()
             where id=$1`,
            [id, satker.id, satker.deskripsi]
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
                satker_baru_id: satker.id,
                satker_baru_nama: satker.deskripsi,
                keterangan: keterangan || null,
                rollback_pelimpahan_eksternal: !!lp.dilimpahkan_eksternal
            }
        });

        return { status: 1, data: { id, satker_id: satker.id, satker_nama: satker.deskripsi }, message: lp.dilimpahkan_eksternal ? `Pelimpahan eksternal dibatalkan dan penanganan dikembalikan ke "${satker.deskripsi}".` : `Satker penanganan diperbarui ke "${satker.deskripsi}".` };
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
