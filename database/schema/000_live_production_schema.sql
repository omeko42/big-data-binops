-- ============================================================================
-- BARESKRIM DATABASE (BDB) - LIVE PRODUCTION POSTGRESQL SCHEMA
-- ============================================================================
-- Extracted At       : 2026-10-24T07:12:02.432Z
-- Source Database    : PostgreSQL Production (schema: public)
-- Active Tables      : 171 tables (filtered from 423 total relations; 251 backup/temp tables excluded)
-- Active Views       : 1 SQL view (bdb_satker_taxonomy_r11) + 1 view-table (bdb_jukrah_view)
-- Custom Functions   : 7 SQL/PLpgSQL functions
-- Table Constraints  : 496 constraints (PK, UNIQUE, FK, CHECK)
-- Active Indexes     : 433 indexes
-- Active Triggers    : 5 triggers
-- ============================================================================

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;

-- ============================================================================
-- 1. EXTENSIONS & SEQUENCES
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;

CREATE SEQUENCE IF NOT EXISTS public."ac_judol_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."an_kasus_menonjol_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."app_synchronize_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."auth_devices_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."auth_passkeys_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."auth_role_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."auth_user_mutations_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."auth_users_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_anev_dashboard_snapshot_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_anev_rekap_snapshot_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_anev_report_logs_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_audit_log_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_barang_bukti_summary_snapshot_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_broadcast_messages_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_bulk_password_reset_item_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_bulk_password_reset_job_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_chat_messages_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_chat_rooms_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_crime_master_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_distribution_letters_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_distribution_logs_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_document_type_master_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_dokumen_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_dokumen_pasal_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_dors_history_delete_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_dors_lp_barang_bukti_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_dors_lp_hubungan_korban_pelaku_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_dors_lp_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_dors_lp_kategori_gk_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_dors_lp_kategori_lokasi_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_dors_lp_petugas_penerima_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_dors_lp_polda_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_dors_lp_polres_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_dors_lp_polsek_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_dors_lp_terlibat_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_dors_lp_tindak_pidana_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_dors_lp_tkp_desa_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_dors_lp_tkp_kecamatan_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_dors_lp_tkp_kota_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_dors_lp_tkp_provinsi_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_dors_lp_unit_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_dors_raw_lp_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_dors_satker_map_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_dors_sync_log_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_dpo_arsip_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_dpo_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_integration_client_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_jukrah_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_jukrah_view_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_kasus_atensi_attachments_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_kasus_atensi_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_kasus_atensi_lp_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_kasus_menonjol_attachments_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_kasus_menonjol_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_kasus_menonjol_lp_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_kerma_attachments_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_kerma_jenis_naskah_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_kerma_master_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_kinerja_crime_group_mapping_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_kinerja_crime_group_mapping_version_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_kinerja_perkara_summary_snapshot_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_kinerja_ppappo_crime_mapping_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_laporan_polisi_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_lp_barang_bukti_manual_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_lp_history_logs_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_lp_master_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_lp_monitoring_access_log_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_lp_pelimpahan_attachments_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_lp_pelimpahan_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_lp_pihak_manual_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_lp_status_reconcile_log_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_lp_tindak_pidana_dors_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_lp_tindak_pidana_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_menu_role_access_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_operasi_satgas_attachments_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_operasi_satgas_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_operasi_satgas_jenis_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_panduan_pengguna_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_pasal_master_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_pihak_terlibat_ranking_snapshot_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_pihak_terlibat_summary_snapshot_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_satker_eksternal_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_satker_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_satker_master_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_satker_profiles_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_social_bookmarks_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_social_comments_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_social_notifications_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_social_posts_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_social_reactions_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_social_read_receipts_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_status_master_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."bdb_status_override_log_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."cm_agama_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."cm_desa_code_seq";
CREATE SEQUENCE IF NOT EXISTS public."cm_golongan_kamtibmas_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."cm_golongan_kejahatan_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."cm_iccs_kategori_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."cm_jenis_barang_bukti_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."cm_jenis_kejahatan_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."cm_jenis_kelamin_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."cm_kabupaten_code_seq";
CREATE SEQUENCE IF NOT EXISTS public."cm_kategori_lokasi_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."cm_kecamatann_code_seq";
CREATE SEQUENCE IF NOT EXISTS public."cm_kewarganegaraan_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."cm_modus_operandi_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."cm_motif_kejahatan_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."cm_pasal_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."cm_pekerjaan_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."cm_pendidikan_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."cm_provinsi_code_seq";
CREATE SEQUENCE IF NOT EXISTS public."cm_sub_golongan_kamtibmas_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."cm_suku_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."cm_terlapor_status_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."cm_tipe_identitas_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."cm_undang_undang_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."cm_unit_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."permission_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."tm_kategori_lp_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."tm_org_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."tm_org_level_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."tm_org_role_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."tm_type_kejahatan_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."trb_dir_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."trb_dir_permisson_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."trb_dir_report_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."trb_dir_role_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."trb_dir_team_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."trb_dp_report_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."trb_log_imports_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."trb_log_report_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."trb_police_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."trb_report_barang_bukti_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."trb_report_excels_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."trb_report_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."trb_report_korban_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."trb_report_pasal_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."trb_report_pelapor_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."trb_report_saksi_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."trb_report_status_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."trb_report_terlapor_id_seq";
CREATE SEQUENCE IF NOT EXISTS public."user_connections_id_seq";

-- ============================================================================
-- 2. CUSTOM SQL FUNCTIONS (7 FUNCTIONS)
-- ============================================================================

-- Function: public.bdb_lp_auto_map_unit()
CREATE OR REPLACE FUNCTION public.bdb_lp_auto_map_unit()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_clean_unit text;
    v_target_id bigint;
    v_target_nama text;
    v_target_kode text;
BEGIN
    IF NEW.unit_satker_id IS NULL AND NEW.satker_id IS NOT NULL AND NEW.unit_nama IS NOT NULL THEN
        v_clean_unit := upper(regexp_replace(NEW.unit_nama, '[^A-Za-z0-9]', '', 'g'));
        
        IF v_clean_unit = 'RESKRIM' THEN
            SELECT c.id, c.deskripsi, c.kode INTO v_target_id, v_target_nama, v_target_kode
            FROM bdb_satker c
            WHERE c.parent_id = NEW.satker_id
              AND regexp_replace(upper(c.deskripsi), '[^A-Z0-9]', '', 'g') LIKE '%RESKRIM%'
            LIMIT 1;
        ELSIF v_clean_unit = 'SATRESKRIM' THEN
            SELECT c.id, c.deskripsi, c.kode INTO v_target_id, v_target_nama, v_target_kode
            FROM bdb_satker c
            WHERE c.parent_id = NEW.satker_id
              AND regexp_replace(upper(c.deskripsi), '[^A-Z0-9]', '', 'g') LIKE '%RESKRIM%'
            LIMIT 1;
        ELSIF v_clean_unit IN ('SATRESNARKOBA', 'DITRESNARKOBA', 'NARKOBA') THEN
            SELECT c.id, c.deskripsi, c.kode INTO v_target_id, v_target_nama, v_target_kode
            FROM bdb_satker c
            WHERE c.parent_id = NEW.satker_id
              AND regexp_replace(upper(c.deskripsi), '[^A-Z0-9]', '', 'g') LIKE '%NARKOBA%'
            LIMIT 1;
        ELSIF v_clean_unit IN ('SATLANTAS', 'DITLANTAS', 'LANTAS') THEN
            SELECT c.id, c.deskripsi, c.kode INTO v_target_id, v_target_nama, v_target_kode
            FROM bdb_satker c
            WHERE c.parent_id = NEW.satker_id
              AND regexp_replace(upper(c.deskripsi), '[^A-Z0-9]', '', 'g') LIKE '%LANTAS%'
            LIMIT 1;
        ELSIF v_clean_unit IN ('SATSAMAPTA', 'SATSABHARA', 'DITSAMAPTA', 'DITSABHARA', 'SAMAPTA', 'SABHARA') THEN
            SELECT c.id, c.deskripsi, c.kode INTO v_target_id, v_target_nama, v_target_kode
            FROM bdb_satker c
            WHERE c.parent_id = NEW.satker_id
              AND (
                  regexp_replace(upper(c.deskripsi), '[^A-Z0-9]', '', 'g') LIKE '%SAMAPTA%'
                  OR regexp_replace(upper(c.deskripsi), '[^A-Z0-9]', '', 'g') LIKE '%SABHARA%'
              )
            LIMIT 1;
        ELSIF v_clean_unit IN ('SATPOLAIR', 'DITPOLAIR', 'POLAIR') THEN
            SELECT c.id, c.deskripsi, c.kode INTO v_target_id, v_target_nama, v_target_kode
            FROM bdb_satker c
            WHERE c.parent_id = NEW.satker_id
              AND regexp_replace(upper(c.deskripsi), '[^A-Z0-9]', '', 'g') LIKE '%POLAIR%'
            LIMIT 1;
        END IF;

        IF v_target_id IS NOT NULL THEN
            NEW.unit_satker_id := v_target_id;
            NEW.unit_satker_nama := v_target_nama;
            NEW.unit_satker_kode := v_target_kode;
        END IF;
    END IF;

    RETURN NEW;
END;
$function$;

-- Function: public.bdb_lp_default_status()
CREATE OR REPLACE FUNCTION public.bdb_lp_default_status()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
            begin
                if new.status_id is null then
                    new.status_id := (select id from bdb_status_master where code = 'LP' limit 1);
                end if;
                return new;
            end;
            $function$;

-- Function: public.bdb_satker_auto_tipe()
CREATE OR REPLACE FUNCTION public.bdb_satker_auto_tipe()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
    new.tipe_satker := case
        when new.deskripsi ~* '^POLDA ' then 'POLDA'
        when new.deskripsi ~* '^POLRES(TA|TABES)? ' then 'POLRES'
        when new.deskripsi ~* '^POLSEK(TA)? ' then 'POLSEK'
        else 'FUNGSI'
    end;
    return new;
end;
$function$;

-- Function: public.bdb_satker_classify_r11(p_id bigint, p_tipe_satker text, p_legacy_sub_domain text, p_deskripsi text, p_fungsi text, p_operational_role text, p_nama_satker_dors text, p_parent_deskripsi text, p_grandparent_deskripsi text)
CREATE OR REPLACE FUNCTION public.bdb_satker_classify_r11(p_id bigint, p_tipe_satker text, p_legacy_sub_domain text, p_deskripsi text, p_fungsi text, p_operational_role text, p_nama_satker_dors text, p_parent_deskripsi text, p_grandparent_deskripsi text)
 RETURNS TABLE(proposed_function_domain text, classification_evidence text, exact_reserse boolean, exact_non_reserse boolean)
 LANGUAGE sql
 IMMUTABLE PARALLEL SAFE
 SET search_path TO 'pg_catalog'
AS $function$
WITH normalized AS (
  SELECT upper(btrim(coalesce(p_tipe_satker,''))) tipe,
    upper(btrim(coalesce(p_legacy_sub_domain,''))) legacy,
    ' '||btrim(regexp_replace(upper(concat_ws(' ',p_deskripsi,p_fungsi,p_operational_role,p_nama_satker_dors)),'[^A-Z0-9]+',' ','g'))||' ' tokens,
    regexp_replace(upper(coalesce(p_deskripsi,'')),'[^A-Z0-9]','','g') description_compact,
    regexp_replace(upper(coalesce(p_operational_role,'')),'[^A-Z0-9]','','g') role_compact,
    regexp_replace(upper(concat_ws(' ',p_parent_deskripsi,p_grandparent_deskripsi)),'[^A-Z0-9]','','g') ancestor_compact
), flags AS (
  SELECT n.*,
    (role_compact IN ('BARESKRIM','ROBINOPS','WASSIDIK','PUSIKNAS','KORWASPPNS','RESKRIM','UNITRESKRIM','DITRESKRIMUM','DITRESKRIMSUS','DITRESSIBER','DITRESNARKOBA','DITRESPPADANPPO','SATRESKRIM','SATRESNARKOBA','SATRESPPADANPPO')
      OR description_compact ~ '^(DITRESKRIMUM|DITRESKRIMSUS|DITRESSIBER|DITRESNARKOBA|DITRESPPADANPPO|SATRESKRIM|SATRESNARKOBA|SATRESPPADANPPO|UNITRESKRIM)(POLDA|POLRES|POLRESTA|POLRESTABES|POLSEK|MABES|BARESKRIM|$)'
      OR tokens LIKE ANY(ARRAY['% BARESKRIM %','% RESKRIM %','% KRIMUM %','% KRIMSUS %','% TIPID %','% TIPIDKOR %','% TIPIDEKSUS %','% TIPIDTER %','% TIPIDUM %','% TIPIDSIBER %','% SIBER %','% NARKO %','% NARKOBA %','% NARKOTIKA %','% ROBINOPS %','% WASSIDIK %','% PUSIKNAS %','% KORWAS PPNS %','% UNIT PPA %','% SAT PPA %','% DIT PPA %','% PPA DAN PPO %','% PPA PPO %','% UNIT PPO %','% SAT PPO %','% DIT PPO %'])) exact_reserse,
    (role_compact IN ('LANTAS','SATLANTAS','DITLANTAS','SAMAPTA','SATSAMAPTA','DITSAMAPTA','SABHARA','POLSABHARA','KORPOLAIR','POLAIR','POLAIRUD','DITPOLAIRUD','SATPOLAIRUD','BRIMOB','PROPAM','INTEL','INTELKAM','LOGISTIK','HUMAS','SDM','DOKKES','KEUANGAN','DENSUS','TAHTI','DITTAHTI','SATTAHTI')
      OR description_compact ~ '^(SATLANTAS|DITLANTAS|SATSAMAPTA|DITSAMAPTA|SATSABHARA|KORPOLAIR|DITPOLAIRUD|SATPOLAIRUD|SATINTELKAM|DITINTELKAM|DITTAHTI|SATTAHTI)(POLDA|POLRES|POLRESTA|POLRESTABES|POLSEK|BAHARKAM|MABES|$)'
      OR tokens LIKE ANY(ARRAY['% LANTAS %','% SAMAPTA %','% SABHARA %','% POL AIR %','% POLAIR %','% POLAIRUD %','% BRIMOB %','% PROPAM %','% INTEL %','% INTELKAM %','% LOGISTIK %','% HUMAS %','% SDM %','% DOKKES %','% KEUANGAN %','% DENSUS %','% TAHTI %'])
      OR (description_compact IN ('BAGOPS','BAGBANOPS','BAGRENMIN','DITCEGAH','DITTINDAK','DITSIDIK','DITIDENSOS') AND ancestor_compact LIKE '%DENSUS88%')) exact_non_reserse
  FROM normalized n
)
SELECT CASE
    WHEN p_id=1 OR tipe IN ('POLDA','POLRES','POLSEK') THEN 'STRUCTURAL'
    WHEN legacy='INTERNAL RESERSE' THEN 'INTERNAL_RESERSE'
    WHEN legacy='EKSTERNAL RESERSE' THEN 'EKSTERNAL_RESERSE'
    WHEN exact_reserse THEN 'INTERNAL_RESERSE'
    WHEN exact_non_reserse THEN 'EKSTERNAL_RESERSE'
  END,
  CASE
    WHEN p_id=1 OR tipe IN ('POLDA','POLRES','POLSEK') THEN 'EXACT_STRUCTURAL_TYPE_OR_ROOT'
    WHEN legacy='INTERNAL RESERSE' THEN 'LEGACY_INTERNAL_RESERSE'
    WHEN legacy='EKSTERNAL RESERSE' THEN 'LEGACY_EKSTERNAL_RESERSE'
    WHEN exact_reserse THEN 'EXACT_NORMALIZED_INTERNAL_RESERSE'
    WHEN exact_non_reserse THEN 'EXACT_NORMALIZED_EXTERNAL_RESERSE'
  END,
  exact_reserse,exact_non_reserse
FROM flags;
$function$;

-- Function: public.bdb_sync_kinerja_snapshot_from_lp()
CREATE OR REPLACE FUNCTION public.bdb_sync_kinerja_snapshot_from_lp()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
    if to_regclass('public.bdb_kinerja_perkara_snapshot') is null then
        return new;
    end if;

    update public.bdb_kinerja_perkara_snapshot snap
    set satker_id = coalesce(new.unit_satker_id, new.satker_id),
        tanggal_selesai = new.tanggal_selesai,
        status_code = st.code,
        jenis_kejahatan_id = new.jenis_kejahatan_id,
        model_lp = new.model_lp,
        is_rj = coalesce(dok.is_rj, false)
    from public.bdb_status_master st
    left join lateral (
        select coalesce(
            d.data->>'alasan_penghentian' ilike '%restorative%justice%'
            or d.data->>'alasan_penghentian' ilike '%restoratif%justice%'
            or d.data->>'alasan_penghentian' ~* '(^|[^[:alnum:]])RJ([^[:alnum:]]|$)',
            false
        ) as is_rj
        from public.bdb_dokumen d
        join public.bdb_document_type_master dt on dt.id = d.document_type_id
        where d.lp_id = new.id and dt.code = st.code
        order by d.created_at desc
        limit 1
    ) dok on true
    where snap.lp_id = new.id
      and st.id = new.status_id;

    return new;
end;
$function$;

-- Function: public.fn_guard_tanggal_dokumen_lp()
CREATE OR REPLACE FUNCTION public.fn_guard_tanggal_dokumen_lp()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
        DECLARE
            v_tgl_lp date;
        BEGIN
            -- Guard 1: Tanggal dokumen, mulai, berakhir tidak boleh di masa depan (maksimal CURRENT_DATE)
            IF NEW.tanggal_dokumen IS NOT NULL AND NEW.tanggal_dokumen > CURRENT_DATE THEN
                RAISE EXCEPTION 'Tanggal dokumen (%) tidak boleh di masa depan (maksimal hari ini: %). Input ditolak.', NEW.tanggal_dokumen, CURRENT_DATE;
            END IF;

            -- Guard 2: Terhadap tanggal LP (tidak boleh mendahului tanggal terbit LP)
            IF NEW.lp_id IS NOT NULL THEN
                SELECT parse_tgl_laporan(tgl_laporan)::date INTO v_tgl_lp
                FROM bdb_laporan_polisi
                WHERE id = NEW.lp_id;

                IF v_tgl_lp IS NOT NULL THEN
                    IF NEW.tanggal_dokumen IS NOT NULL AND NEW.tanggal_dokumen < v_tgl_lp THEN
                        RAISE EXCEPTION 'Tanggal dokumen (%) tidak boleh lebih awal dari tanggal terbit LP (%). Input ditolak.', NEW.tanggal_dokumen, v_tgl_lp;
                    END IF;
                    IF NEW.tanggal_mulai IS NOT NULL AND NEW.tanggal_mulai < v_tgl_lp THEN
                        RAISE EXCEPTION 'Tanggal mulai (%) tidak boleh lebih awal dari tanggal terbit LP (%). Input ditolak.', NEW.tanggal_mulai, v_tgl_lp;
                    END IF;
                    IF NEW.tanggal_berakhir IS NOT NULL AND NEW.tanggal_berakhir < v_tgl_lp THEN
                        RAISE EXCEPTION 'Tanggal berakhir (%) tidak boleh lebih awal dari tanggal terbit LP (%). Input ditolak.', NEW.tanggal_berakhir, v_tgl_lp;
                    END IF;
                END IF;
            END IF;
            RETURN NEW;
        END;
        $function$;

-- Function: public.parse_tgl_laporan(val text)
CREATE OR REPLACE FUNCTION public.parse_tgl_laporan(val text)
 RETURNS date
 LANGUAGE plpgsql
 IMMUTABLE
AS $function$
BEGIN
    IF val IS NULL OR val = '' THEN
        RETURN NULL;
    END IF;
    RETURN to_date(substring(val from 1 for 10), 'DD-MM-YYYY');
EXCEPTION WHEN OTHERS THEN
    RETURN NULL;
END;
$function$;

-- ============================================================================
-- 3. ACTIVE PRODUCTION TABLES (171 TABLES)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Table: public.ac_judol
-- Live row estimate: ~0 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."ac_judol" (
    "id" bigint DEFAULT nextval('ac_judol_id_seq'::regclass) NOT NULL,
    "tanggal" date,
    "jumlah_laporan" bigint,
    "jumlah_tersangka" bigint,
    "tersangka_u_15_30" bigint,
    "tersangka_u_31_60" bigint,
    "tersangka_laki_laki" bigint,
    "tersangka_perempuan" bigint,
    "tersangka_pns" bigint,
    "tersangka_swasta" bigint,
    "tersangka_tni" bigint,
    "tersangka_polri" bigint,
    "tersangka_publik_figur" bigint,
    "tersangka_peran_pemain" bigint,
    "tersangka_peran_penyelenggara" bigint,
    "tersangka_peran_endorse" bigint,
    "tersangka_peran_lainnya" bigint,
    "status_sp3" bigint,
    "status_p21" bigint,
    "status_limpah" bigint,
    "ajuan_blokir_situs" bigint,
    "poldaCode" character varying(50),
    "pasalId" bigint,
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "PK_67645dbfed82d1b9cbbbe54b2e1" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.an_dashboard
-- Live row estimate: ~0 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."an_dashboard" (
    "organisasi_path" character varying(255) NOT NULL,
    "date" date NOT NULL,
    "kategori_id" integer NOT NULL,
    "level_path" character varying(255) NOT NULL,
    "total" integer,
    "total_status_selesai" integer,
    "total_tunggakan_status_selesai" integer,
    "total_pelapor" integer,
    "total_terlapor" integer,
    "total_korban" integer,
    "total_saksi" integer,
    "total_type_kejahatan" text,
    "total_kategori_kejahatan" text,
    "total_jenis_kejahatan" text,
    "total_status" text,
    "total_dpo" integer,
    "total_tersangka" integer,
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "PK_8fb3c7f27474108a6500d1653b4" PRIMARY KEY (organisasi_path, date, kategori_id, level_path)
);

-- ----------------------------------------------------------------------------
-- Table: public.an_dashboard_jenis_kejahatan
-- Live row estimate: ~0 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."an_dashboard_jenis_kejahatan" (
    "organisasi_path" character varying(255) NOT NULL,
    "date" date NOT NULL,
    "kategori_id" integer NOT NULL,
    "level_path" character varying(255) NOT NULL,
    "jenis_kejahatan_id" integer NOT NULL,
    "jenis_kejahatan_name" text NOT NULL,
    "total" integer DEFAULT 0 NOT NULL,
    "total_selesai" integer DEFAULT 0 NOT NULL,
    "total_tunggakan_status_selesai" integer,
    "total_selesai_rjlid" integer DEFAULT 0 NOT NULL,
    "total_selesai_rjsid" integer DEFAULT 0 NOT NULL,
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "PK_5ded2c0e3e33f86dec537d0d413" PRIMARY KEY (organisasi_path, date, kategori_id, level_path, jenis_kejahatan_id)
);

-- ----------------------------------------------------------------------------
-- Table: public.an_dashboard_kategori_kejahatan
-- Live row estimate: ~0 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."an_dashboard_kategori_kejahatan" (
    "organisasi_path" character varying(255) NOT NULL,
    "date" date NOT NULL,
    "kategori_id" integer NOT NULL,
    "level_path" character varying(255) NOT NULL,
    "kategori_name" character varying(255) NOT NULL,
    "total" integer DEFAULT 0 NOT NULL,
    "total_selesai" integer DEFAULT 0 NOT NULL,
    "total_tunggakan_status_selesai" integer,
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "PK_ae6b02a53880a1ab0351e11bbab" PRIMARY KEY (organisasi_path, date, kategori_id, level_path)
);

-- ----------------------------------------------------------------------------
-- Table: public.an_dashboard_status
-- Live row estimate: ~0 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."an_dashboard_status" (
    "organisasi_path" character varying(255) NOT NULL,
    "date" date NOT NULL,
    "kategori_id" integer NOT NULL,
    "level_path" character varying(255) NOT NULL,
    "status_id" integer NOT NULL,
    "status_name" character varying(100) NOT NULL,
    "total" integer DEFAULT 0 NOT NULL,
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "PK_c88a623d9eee2d1add5927ae96d" PRIMARY KEY (organisasi_path, date, kategori_id, level_path, status_id)
);

-- ----------------------------------------------------------------------------
-- Table: public.an_dashboard_type_kejahatan
-- Live row estimate: ~0 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."an_dashboard_type_kejahatan" (
    "organisasi_path" character varying(255) NOT NULL,
    "date" date NOT NULL,
    "kategori_id" integer NOT NULL,
    "level_path" character varying(255) NOT NULL,
    "type_id" integer NOT NULL,
    "type_name" character varying(255) NOT NULL,
    "total" integer DEFAULT 0 NOT NULL,
    "total_selesai" integer DEFAULT 0 NOT NULL,
    "total_tunggakan_status_selesai" integer,
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "PK_8d7e020fe4b11a1e286eb34a222" PRIMARY KEY (organisasi_path, date, kategori_id, level_path, type_id)
);

-- ----------------------------------------------------------------------------
-- Table: public.an_kasus_menonjol
-- Live row estimate: ~0 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."an_kasus_menonjol" (
    "id" bigint DEFAULT nextval('an_kasus_menonjol_id_seq'::regclass) NOT NULL,
    "organisasi_path" character varying(255) NOT NULL,
    "judul" character varying(255) NOT NULL,
    "rilis" boolean DEFAULT false NOT NULL,
    "tanggal_rilis" date,
    "bdb_lp_master_id" bigint,
    "skala_viral" an_kasus_menonjol_skala_viral_enum,
    "keterangan" text,
    "dokumen_rilis" character varying,
    "organisasiId" bigint,
    "reportId" bigint,
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "PK_174ac22ebd109934c0d35c7b7db" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.app_synchronize
-- Live row estimate: ~0 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."app_synchronize" (
    "id" bigint DEFAULT nextval('app_synchronize_id_seq'::regclass) NOT NULL,
    "code" character varying(255),
    "module" character varying(255),
    "task" character varying(255),
    "updated_via" character varying(255) DEFAULT 'scheduler'::character varying,
    "updated_status" character varying(255),
    "updated_message" text,
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "PK_99828d48c336a4d1d160c738637" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.auth_devices
-- Live row estimate: ~37,602 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."auth_devices" (
    "id" bigint DEFAULT nextval('auth_devices_id_seq'::regclass) NOT NULL,
    "device_name" character varying(255),
    "device_token" character varying(255),
    "device_os" character varying(255),
    "device_vendor" character varying(255),
    "device_browser" character varying(255),
    "device_app_version" character varying(255),
    "last_hit" timestamp without time zone,
    "last_token_change" timestamp without time zone,
    "request_token" character varying(255),
    "request_token_old" character varying(255),
    "refresh_token" character varying(255),
    "refresh_token_expired_at" timestamp without time zone,
    "userId" bigint,
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "PK_a65bdebf3b888127e62fc5a5ffa" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.auth_passkey_challenges
-- Live row estimate: ~138 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."auth_passkey_challenges" (
    "id" character varying(128) NOT NULL,
    "user_id" bigint,
    "challenge" text NOT NULL,
    "type" character varying(32) NOT NULL,
    "expires_at" timestamp with time zone NOT NULL,
    "created_at" timestamp with time zone DEFAULT now(),
    CONSTRAINT "auth_passkey_challenges_pkey" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.auth_passkeys
-- Live row estimate: ~4 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."auth_passkeys" (
    "id" integer DEFAULT nextval('auth_passkeys_id_seq'::regclass) NOT NULL,
    "user_id" bigint NOT NULL,
    "credential_id" text NOT NULL,
    "public_key" text NOT NULL,
    "counter" bigint DEFAULT 0 NOT NULL,
    "device_name" character varying(150),
    "device_type" character varying(50) DEFAULT 'gawai'::character varying,
    "transports" text[],
    "created_at" timestamp with time zone DEFAULT now(),
    "last_used_at" timestamp with time zone DEFAULT now(),
    "aaguid" character varying(64),
    "credential_device_type" character varying(32),
    "credential_backed_up" boolean DEFAULT false,
    "os_name" character varying(64),
    "browser_name" character varying(64),
    CONSTRAINT "auth_passkeys_pkey" PRIMARY KEY (id),
    CONSTRAINT "auth_passkeys_credential_id_key" UNIQUE (credential_id)
);

-- ----------------------------------------------------------------------------
-- Table: public.auth_role
-- Live row estimate: ~0 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."auth_role" (
    "id" bigint DEFAULT nextval('auth_role_id_seq'::regclass) NOT NULL,
    "name" character varying(255),
    CONSTRAINT "PK_695d9779f1a6218ed589cb436d6" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.auth_role_permission_permission
-- Live row estimate: ~0 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."auth_role_permission_permission" (
    "authRoleId" bigint NOT NULL,
    "permissionId" bigint NOT NULL,
    CONSTRAINT "PK_91974fc11fcdeefe72edb9cbc53" PRIMARY KEY ("authRoleId", "permissionId")
);

-- ----------------------------------------------------------------------------
-- Table: public.auth_user_mutations
-- Live row estimate: ~50 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."auth_user_mutations" (
    "id" bigint DEFAULT nextval('auth_user_mutations_id_seq'::regclass) NOT NULL,
    "user_id" bigint NOT NULL,
    "from_satker_id" bigint,
    "from_satker_key" character varying(100),
    "from_satker_name" character varying(255),
    "from_role" character varying(50),
    "to_satker_id" bigint,
    "to_satker_key" character varying(100),
    "to_satker_name" character varying(255),
    "to_role" character varying(50),
    "nomor_surat" character varying(150) NOT NULL,
    "tanggal_efektif" date DEFAULT CURRENT_DATE NOT NULL,
    "keterangan" text,
    "mutated_by" bigint,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "status" character varying(30) DEFAULT 'APPROVED'::character varying,
    "reviewed_by" bigint,
    "reviewed_at" timestamp with time zone,
    "is_keluar_reserse" boolean DEFAULT false,
    CONSTRAINT "auth_user_mutations_pkey" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.auth_users
-- Live row estimate: ~3,611 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."auth_users" (
    "id" bigint DEFAULT nextval('auth_users_id_seq'::regclass) NOT NULL,
    "name" character varying(255),
    "email" character varying(255) NOT NULL,
    "email_google" character varying(255),
    "email_polri" character varying(255),
    "login_method" character varying(30) DEFAULT 'LOCAL'::character varying NOT NULL,
    "local_password_enabled" boolean DEFAULT true NOT NULL,
    "email_verified_at" timestamp without time zone,
    "password" character varying(255),
    "remember_token" character varying(255),
    "otp" boolean DEFAULT true,
    "totp" boolean DEFAULT true,
    "totp_secret" character varying(255),
    "otp_id" character varying(255),
    "otp_token" character varying(255),
    "otp_expires_at" timestamp without time zone,
    "directorate_id" integer,
    "role_name" character varying(255),
    "role_bdb" character varying(40) DEFAULT 'viewer'::character varying NOT NULL,
    "requested_role_bdb" character varying(40) DEFAULT 'viewer'::character varying NOT NULL,
    "scope_satker_id" bigint,
    "scope_satker_key" text,
    "requested_scope_satker_id" bigint,
    "requested_scope_satker_key" text,
    "approval_status" character varying(40) DEFAULT 'APPROVED'::character varying NOT NULL,
    "approved_by" bigint,
    "approved_at" timestamp without time zone,
    "rejected_by" bigint,
    "rejected_at" timestamp without time zone,
    "reject_reason" text,
    "self_deactivated_at" timestamp without time zone,
    "deactivated_by" bigint,
    "deactivated_at" timestamp without time zone,
    "deactivation_reason" text,
    "two_factor_required" boolean DEFAULT false NOT NULL,
    "email_otp_required" boolean DEFAULT false NOT NULL,
    "security_pin_hash" character varying(255),
    "pin_required" boolean DEFAULT false NOT NULL,
    "last_login_method" character varying(30),
    "last_login_at" timestamp without time zone,
    "failed_login_attempts" integer DEFAULT 0 NOT NULL,
    "locked_until" timestamp without time zone,
    "status" character varying(255),
    "invitation_code" character varying(255),
    "invitation_expired_at" timestamp without time zone,
    "organisasiId" bigint,
    "organisasiRoleId" bigint,
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    "username" text,
    "activity_score" integer DEFAULT 0,
    "social_media" jsonb DEFAULT '{}'::jsonb,
    "photo_url" text,
    "is_pns" boolean DEFAULT false,
    "secondary_email_verified_at" timestamp without time zone,
    "photo_hash" character varying(64),
    "photo_updated_at" timestamp with time zone DEFAULT now(),
    "callsign" character varying(64),
    "custom_permissions" jsonb DEFAULT '[]'::jsonb,
    "dikjur_polri" jsonb DEFAULT '[]'::jsonb,
    "sertifikasi_keahlian" jsonb DEFAULT '[]'::jsonb,
    "sprin_count" integer DEFAULT 0,
    CONSTRAINT "PK_c88cc8077366b470dafc2917366" PRIMARY KEY (id),
    CONSTRAINT "UQ_13d8b49e55a8b06bee6bbc828fb" UNIQUE (email),
    CONSTRAINT "auth_users_approval_status_check" CHECK (approval_status::text = ANY (ARRAY['PENDING_EMAIL'::character varying, 'PENDING_APPROVAL'::character varying, 'APPROVED'::character varying, 'REJECTED'::character varying, 'NONAKTIF_MANDIRI'::character varying, 'NONAKTIF_ADMIN'::character varying, 'ARSIP'::character varying, 'REQUEST_DELETE'::character varying, 'REQUEST_DEACTIVATE'::character varying, 'REQUEST_MUTASI'::character varying, 'REQUEST_MUTASI_KELUAR'::character varying, 'MUTASI_KELUAR_RESERSE'::character varying]::text[])),
    CONSTRAINT "auth_users_login_method_check" CHECK (login_method::text = ANY (ARRAY['LOCAL'::character varying, 'GOOGLE'::character varying, 'POLRI_SSO'::character varying, 'HYBRID'::character varying]::text[])),
    CONSTRAINT "auth_users_requested_role_bdb_check" CHECK (requested_role_bdb::text = ANY (ARRAY['superadmin'::text, 'admin_binops'::text, 'operator'::text, 'viewer'::text, 'sharese'::text])),
    CONSTRAINT "auth_users_role_bdb_check" CHECK (role_bdb::text = ANY (ARRAY['superadmin'::text, 'admin_binops'::text, 'operator'::text, 'viewer'::text, 'sharese'::text])),
    CONSTRAINT "chk_auth_users_username_format" CHECK (username ~ '^[a-z0-9_.]{3,30}$'::text AND username = lower(username))
);

-- ----------------------------------------------------------------------------
-- Table: public.auth_users_activity_cache
-- Live row estimate: ~3,624 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."auth_users_activity_cache" (
    "user_id" bigint NOT NULL,
    "score" integer DEFAULT 0 NOT NULL,
    "login_days_count" integer DEFAULT 0 NOT NULL,
    "lp_created_count" integer DEFAULT 0 NOT NULL,
    "lp_updated_count" integer DEFAULT 0 NOT NULL,
    "docs_uploaded_count" integer DEFAULT 0 NOT NULL,
    "last_active_at" timestamp with time zone,
    "status_keaktifan" character varying(30) DEFAULT 'INAKTIF'::character varying NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "auth_users_activity_cache_pkey" PRIMARY KEY (user_id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_anev_dashboard_snapshot
-- Live row estimate: ~1,583 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_anev_dashboard_snapshot" (
    "id" integer DEFAULT nextval('bdb_anev_dashboard_snapshot_id_seq'::regclass) NOT NULL,
    "tahun" integer NOT NULL,
    "bulan" integer,
    "scope_key" text NOT NULL,
    "function_domain" text DEFAULT 'INTERNAL_RESERSE'::text NOT NULL,
    "organization_domain" text DEFAULT 'INTERNAL_POLRI'::text NOT NULL,
    "data" jsonb NOT NULL,
    "refreshed_at" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "bdb_anev_dashboard_snapshot_pkey" PRIMARY KEY (id),
    CONSTRAINT "uidx_anev_dash_snap" UNIQUE NULLS NOT DISTINCT (tahun, bulan, scope_key, function_domain, organization_domain)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_anev_rekap_snapshot
-- Live row estimate: ~508,586 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_anev_rekap_snapshot" (
    "id" bigint DEFAULT nextval('bdb_anev_rekap_snapshot_id_seq'::regclass) NOT NULL,
    "satker_id" bigint NOT NULL,
    "status_code" text NOT NULL,
    "kategori" text DEFAULT 'CT'::text NOT NULL,
    "tanggal" date NOT NULL,
    "total_lp" integer DEFAULT 0 NOT NULL,
    "refreshed_at" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "bdb_anev_rekap_snapshot_pkey" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_anev_report_logs
-- Live row estimate: ~9 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_anev_report_logs" (
    "id" bigint DEFAULT nextval('bdb_anev_report_logs_id_seq'::regclass) NOT NULL,
    "user_id" integer,
    "user_nama" character varying(255),
    "user_nrp" character varying(100),
    "satker_id" integer,
    "satker_nama" character varying(255),
    "periode_tipe" character varying(50),
    "periode_label" character varying(255),
    "periode_start" date,
    "periode_end" date,
    "content_hash" character varying(64),
    "ip_address" character varying(100),
    "user_agent" text,
    "created_at" timestamp with time zone DEFAULT now(),
    "document_title" character varying(255),
    "encrypted_payload" text,
    "security_stamp" character varying(128),
    "file_size" integer,
    CONSTRAINT "bdb_anev_report_logs_pkey" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_audit_log
-- Live row estimate: ~5,469,632 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_audit_log" (
    "id" bigint DEFAULT nextval('bdb_audit_log_id_seq'::regclass) NOT NULL,
    "user_id" bigint,
    "user_nama" text,
    "action" text NOT NULL,
    "entity" text,
    "entity_id" text,
    "meta" jsonb,
    "ip" text,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "outcome" text,
    CONSTRAINT "bdb_audit_log_pkey" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_barang_bukti_summary_snapshot
-- Live row estimate: ~171,595 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_barang_bukti_summary_snapshot" (
    "id" bigint DEFAULT nextval('bdb_barang_bukti_summary_snapshot_id_seq'::regclass) NOT NULL,
    "satker_id" bigint NOT NULL,
    "tanggal" date NOT NULL,
    "semua" integer DEFAULT 0 NOT NULL,
    "masuk" integer DEFAULT 0 NOT NULL,
    "keluar" integer DEFAULT 0 NOT NULL,
    "dors" integer DEFAULT 0 NOT NULL,
    "manual" integer DEFAULT 0 NOT NULL,
    "refreshed_at" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "bdb_barang_bukti_summary_snapshot_pkey" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_broadcast_messages
-- Live row estimate: ~0 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_broadcast_messages" (
    "id" bigint DEFAULT nextval('bdb_broadcast_messages_id_seq'::regclass) NOT NULL,
    "title" character varying(160) NOT NULL,
    "message" text NOT NULL,
    "severity" character varying(30) DEFAULT 'info'::character varying NOT NULL,
    "audience" character varying(30) DEFAULT 'all'::character varying NOT NULL,
    "display_duration_minutes" integer,
    "attachment_title" character varying(180),
    "attachment_url" text,
    "scope_satker_id" bigint,
    "scope_satker_key" text,
    "is_running" boolean DEFAULT true NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "starts_at" timestamp with time zone DEFAULT now() NOT NULL,
    "ends_at" timestamp with time zone,
    "created_by" bigint,
    "updated_by" bigint,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "bdb_broadcast_messages_pkey" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_bulk_password_reset_item
-- Live row estimate: ~117 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_bulk_password_reset_item" (
    "id" bigint DEFAULT nextval('bdb_bulk_password_reset_item_id_seq'::regclass) NOT NULL,
    "job_id" bigint NOT NULL,
    "user_id" bigint NOT NULL,
    "email" text,
    "ok" boolean NOT NULL,
    "message" text,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "bdb_bulk_password_reset_item_pkey" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_bulk_password_reset_job
-- Live row estimate: ~1 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_bulk_password_reset_job" (
    "id" bigint DEFAULT nextval('bdb_bulk_password_reset_job_id_seq'::regclass) NOT NULL,
    "status" text DEFAULT 'running'::text NOT NULL,
    "total" integer DEFAULT 0 NOT NULL,
    "done" integer DEFAULT 0 NOT NULL,
    "success" integer DEFAULT 0 NOT NULL,
    "failed" integer DEFAULT 0 NOT NULL,
    "started_by" bigint,
    "started_at" timestamp with time zone DEFAULT now() NOT NULL,
    "finished_at" timestamp with time zone,
    "last_error" text,
    CONSTRAINT "bdb_bulk_password_reset_job_pkey" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_chat_messages
-- Live row estimate: ~0 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_chat_messages" (
    "id" bigint DEFAULT nextval('bdb_chat_messages_id_seq'::regclass) NOT NULL,
    "room_id" bigint NOT NULL,
    "sender_id" bigint NOT NULL,
    "recipient_id" bigint,
    "message_type" character varying(30) DEFAULT 'text'::character varying NOT NULL,
    "content" text NOT NULL,
    "metadata" jsonb DEFAULT '{}'::jsonb,
    "is_read" boolean DEFAULT false,
    "read_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT now(),
    CONSTRAINT "bdb_chat_messages_pkey" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_chat_rooms
-- Live row estimate: ~0 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_chat_rooms" (
    "id" bigint DEFAULT nextval('bdb_chat_rooms_id_seq'::regclass) NOT NULL,
    "room_type" character varying(30) DEFAULT 'direct'::character varying NOT NULL,
    "participant_ids" bigint[] NOT NULL,
    "title" text,
    "last_message_text" text,
    "last_message_sender_id" bigint,
    "last_message_at" timestamp with time zone DEFAULT now(),
    "created_at" timestamp with time zone DEFAULT now(),
    "updated_at" timestamp with time zone DEFAULT now(),
    CONSTRAINT "bdb_chat_rooms_pkey" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_crime_master
-- Live row estimate: ~89 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_crime_master" (
    "id" bigint DEFAULT nextval('bdb_crime_master_id_seq'::regclass) NOT NULL,
    "kategori" text DEFAULT 'Kejahatan'::text NOT NULL,
    "jenis_kejahatan" text NOT NULL,
    "nama_kejahatan_canonical" text NOT NULL,
    "dors_crime_id" bigint,
    "nama_kejahatan_dors" text,
    "pasal" text,
    "status" text DEFAULT 'AKTIF'::text NOT NULL,
    "payload_json" jsonb,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT "bdb_crime_master_pkey" PRIMARY KEY (id),
    CONSTRAINT "bdb_crime_master_dors_crime_id_key" UNIQUE (dors_crime_id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_distribution_letters
-- Live row estimate: ~0 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_distribution_letters" (
    "id" bigint DEFAULT nextval('bdb_distribution_letters_id_seq'::regclass) NOT NULL,
    "lp_id" bigint NOT NULL,
    "jenis_surat" text NOT NULL,
    "nomor_surat" text NOT NULL,
    "tanggal_ttd_surat" date NOT NULL,
    "waktu_ttd_surat" time without time zone,
    "ttd_at" timestamp without time zone NOT NULL,
    "tujuan_satker_id" bigint NOT NULL,
    "catatan" text,
    "arsip_file_id" text,
    "created_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT "bdb_distribution_letters_pkey" PRIMARY KEY (id),
    CONSTRAINT "bdb_distribution_letters_nomor_surat_key" UNIQUE (nomor_surat)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_distribution_logs
-- Live row estimate: ~0 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_distribution_logs" (
    "id" bigint DEFAULT nextval('bdb_distribution_logs_id_seq'::regclass) NOT NULL,
    "lp_id" bigint NOT NULL,
    "from_satker_id" bigint,
    "to_satker_id" bigint NOT NULL,
    "distribution_letter_id" bigint,
    "status" text DEFAULT 'DISTRIBUSI'::text NOT NULL,
    "catatan" text,
    "created_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT "bdb_distribution_logs_pkey" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_document_type_master
-- Live row estimate: ~19 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_document_type_master" (
    "id" bigint DEFAULT nextval('bdb_document_type_master_id_seq'::regclass) NOT NULL,
    "code" text NOT NULL,
    "nama" text NOT NULL,
    "status_prasyarat_id" bigint,
    "dokumen_prasyarat_id" bigint,
    "status_target_id" bigint,
    "urutan_tahap" integer DEFAULT 0 NOT NULL,
    "form_schema" jsonb DEFAULT '{"fields": []}'::jsonb NOT NULL,
    "aktif" boolean DEFAULT true NOT NULL,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT "bdb_document_type_master_pkey" PRIMARY KEY (id),
    CONSTRAINT "bdb_document_type_master_code_key" UNIQUE (code)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_dokumen
-- Live row estimate: ~235,849 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_dokumen" (
    "id" bigint DEFAULT nextval('bdb_dokumen_id_seq'::regclass) NOT NULL,
    "lp_id" bigint NOT NULL,
    "document_type_id" bigint NOT NULL,
    "nomor_dokumen" text,
    "tanggal_dokumen" date,
    "tanggal_mulai" date,
    "tanggal_berakhir" date,
    "data" jsonb DEFAULT '{}'::jsonb NOT NULL,
    "lampiran" jsonb DEFAULT '[]'::jsonb NOT NULL,
    "created_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT "bdb_dokumen_pkey" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_dokumen_pasal
-- Live row estimate: ~51,699 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_dokumen_pasal" (
    "id" bigint DEFAULT nextval('bdb_dokumen_pasal_id_seq'::regclass) NOT NULL,
    "dokumen_id" bigint NOT NULL,
    "pasal_id" bigint,
    "nomor_pasal" text,
    "sumber" text DEFAULT 'tambahan_manual'::text NOT NULL,
    CONSTRAINT "bdb_dokumen_pasal_pkey" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_dors_config
-- Live row estimate: ~1 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_dors_config" (
    "id" integer DEFAULT 1 NOT NULL,
    "base_url" text,
    "client_id" text,
    "client_header" text,
    "timeout_ms" integer,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "sync_enabled" boolean DEFAULT false NOT NULL,
    "sync_mode" text DEFAULT 'interval'::text NOT NULL,
    "sync_interval_minutes" integer DEFAULT 30 NOT NULL,
    "sync_cron" text DEFAULT '0 2 * * *'::text NOT NULL,
    "sync_days_back" integer DEFAULT 1 NOT NULL,
    "data_scope" text DEFAULT 'OPERASIONAL'::text NOT NULL,
    CONSTRAINT "bdb_dors_config_pkey" PRIMARY KEY (id),
    CONSTRAINT "bdb_dors_config_single" CHECK (id = 1)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_dors_history_delete
-- Live row estimate: ~48 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_dors_history_delete" (
    "id" bigint DEFAULT nextval('bdb_dors_history_delete_id_seq'::regclass) NOT NULL,
    "dors_history_id" bigint,
    "id_laporan" bigint,
    "no_laporan" text,
    "tgl_laporan" text,
    "kategori" text,
    "action" text,
    "action_date" text,
    "applied" boolean DEFAULT false,
    "applied_at" timestamp without time zone,
    "created_at" timestamp without time zone DEFAULT now(),
    "updated_at" timestamp without time zone DEFAULT now(),
    CONSTRAINT "bdb_dors_history_delete_pkey" PRIMARY KEY (id),
    CONSTRAINT "bdb_dors_history_delete_dors_history_id_key" UNIQUE (dors_history_id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_dors_lp
-- Live row estimate: ~2,852,161 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_dors_lp" (
    "id" bigint DEFAULT nextval('bdb_dors_lp_id_seq'::regclass) NOT NULL,
    "raw_id" bigint,
    "dors_lp_id" bigint NOT NULL,
    "model_lp" text NOT NULL,
    "data_scope" text,
    "import_batch" text,
    "source_created_at" text,
    "source_updated_at" text,
    "synced_at" timestamp without time zone DEFAULT now() NOT NULL,
    "apa_terjadi" text,
    "bagaimana_terjadi" text,
    "dilimpahkan" text,
    "id_emp_modus_operandi" text,
    "id_emp_motif_kejahatan" text,
    "id_emp_sasaran_kejahatan" text,
    "id_hubungan_korban_pelaku" text,
    "id_kategori_lokasi" text,
    "id_operasi" text,
    "id_pasal_kamtibmas" text,
    "id_polda" text,
    "id_polres" text,
    "id_polsek" text,
    "id_satuan" text,
    "id_unit_terusan" text,
    "kategori" text,
    "kerugian" text,
    "nama_mengetahui" text,
    "nama_pembuat" text,
    "no_laporan" text,
    "no_sttlp" text,
    "nrp_mengetahui" text,
    "nrp_pembuat" text,
    "nrp_penerima" text,
    "pangkat_mengetahui" text,
    "pangkat_pembuat" text,
    "pelimpahan" text,
    "perhatian_publik" text,
    "redaksional_mengetahui_spkt" text,
    "status_aktif" text,
    "tempat_kejadian" text,
    "tgl_laporan" text,
    "tkp_id_desa" text,
    "tkp_id_kecamatan" text,
    "tkp_id_kota" text,
    "tkp_id_provinsi" text,
    "uraian_kejadian" text,
    "uraian_singkat_kejadian" text,
    "waktu_kejadian" text,
    "waktu_kejadian_faktual" text,
    "zona_waktu" text,
    CONSTRAINT "bdb_dors_lp_pkey" PRIMARY KEY (id),
    CONSTRAINT "bdb_dors_lp_dors_lp_id_model_lp_key" UNIQUE (dors_lp_id, model_lp)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_dors_lp_barang_bukti
-- Live row estimate: ~5,840,308 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_dors_lp_barang_bukti" (
    "id" bigint DEFAULT nextval('bdb_dors_lp_barang_bukti_id_seq'::regclass) NOT NULL,
    "lp_id" bigint NOT NULL,
    "dors_lp_id" bigint,
    "model_lp" text,
    "dors_ref_id" text,
    "id_laporan" text,
    "kode_bb" text,
    "jenis_bb" text,
    "jumlah" text,
    "keterangan" text,
    "ran_jenis" text,
    "ran_merk" text,
    "ran_model" text,
    "ran_type" text,
    "ran_warna" text,
    "ran_warna_tnkb" text,
    "ran_no_registrasi" text,
    "ran_no_rangka" text,
    "ran_no_mesin" text,
    "ran_no_bpkb" text,
    "ran_nama_pemilik" text,
    "ran_alamat" text,
    "ran_thn_pembuatan" text,
    "ran_thn_registrasi" text,
    "ran_isi_silinder" text,
    "ran_bahan_bakar" text,
    "source_created_at" text,
    "source_updated_at" text,
    CONSTRAINT "bdb_dors_lp_barang_bukti_pkey" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_dors_lp_hubungan_korban_pelaku
-- Live row estimate: ~1,025,175 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_dors_lp_hubungan_korban_pelaku" (
    "id" bigint DEFAULT nextval('bdb_dors_lp_hubungan_korban_pelaku_id_seq'::regclass) NOT NULL,
    "lp_id" bigint NOT NULL,
    "dors_lp_id" bigint,
    "model_lp" text,
    "dors_ref_id" text,
    "nama" text,
    CONSTRAINT "bdb_dors_lp_hubungan_korban_pelaku_pkey" PRIMARY KEY (id),
    CONSTRAINT "bdb_dors_lp_hubungan_korban_pelaku_lp_id_key" UNIQUE (lp_id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_dors_lp_kategori_gk
-- Live row estimate: ~2,854,189 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_dors_lp_kategori_gk" (
    "id" bigint DEFAULT nextval('bdb_dors_lp_kategori_gk_id_seq'::regclass) NOT NULL,
    "lp_id" bigint NOT NULL,
    "dors_lp_id" bigint,
    "model_lp" text,
    "dors_ref_id" text,
    "id_emp" text,
    "id_sub_golongan" text,
    "id_uu" text,
    "pasal" text,
    "pasal_mapping" text,
    "keterangan" text,
    "kasus_menonjol" text,
    "atensi_pimpinan" text,
    CONSTRAINT "bdb_dors_lp_kategori_gk_pkey" PRIMARY KEY (id),
    CONSTRAINT "bdb_dors_lp_kategori_gk_lp_id_key" UNIQUE (lp_id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_dors_lp_kategori_lokasi
-- Live row estimate: ~2,834,728 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_dors_lp_kategori_lokasi" (
    "id" bigint DEFAULT nextval('bdb_dors_lp_kategori_lokasi_id_seq'::regclass) NOT NULL,
    "lp_id" bigint NOT NULL,
    "dors_lp_id" bigint,
    "model_lp" text,
    "dors_ref_id" text,
    "id_emp" text,
    "lokasi" text,
    CONSTRAINT "bdb_dors_lp_kategori_lokasi_pkey" PRIMARY KEY (id),
    CONSTRAINT "bdb_dors_lp_kategori_lokasi_lp_id_key" UNIQUE (lp_id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_dors_lp_petugas_penerima
-- Live row estimate: ~2,823,748 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_dors_lp_petugas_penerima" (
    "id" bigint DEFAULT nextval('bdb_dors_lp_petugas_penerima_id_seq'::regclass) NOT NULL,
    "lp_id" bigint NOT NULL,
    "dors_lp_id" bigint,
    "model_lp" text,
    "nrp_admin" text,
    "username" text,
    "nama" text,
    "pangkat" text,
    "email" text,
    "no_telpon" text,
    CONSTRAINT "bdb_dors_lp_petugas_penerima_pkey" PRIMARY KEY (id),
    CONSTRAINT "bdb_dors_lp_petugas_penerima_lp_id_key" UNIQUE (lp_id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_dors_lp_polda
-- Live row estimate: ~2,851,899 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_dors_lp_polda" (
    "id" bigint DEFAULT nextval('bdb_dors_lp_polda_id_seq'::regclass) NOT NULL,
    "lp_id" bigint NOT NULL,
    "dors_lp_id" bigint,
    "model_lp" text,
    "dors_ref_id" text,
    "kode" text,
    "nama" text,
    "alamat" text,
    "kode_pusiknas" text,
    "jml_desa" text,
    "jml_kel" text,
    "jml_penduduk" text,
    "jml_pers_dsp" text,
    "jml_pers_riil" text,
    "luas_wilayah" text,
    CONSTRAINT "bdb_dors_lp_polda_pkey" PRIMARY KEY (id),
    CONSTRAINT "bdb_dors_lp_polda_lp_id_key" UNIQUE (lp_id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_dors_lp_polres
-- Live row estimate: ~2,689,581 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_dors_lp_polres" (
    "id" bigint DEFAULT nextval('bdb_dors_lp_polres_id_seq'::regclass) NOT NULL,
    "lp_id" bigint NOT NULL,
    "dors_lp_id" bigint,
    "model_lp" text,
    "dors_ref_id" text,
    "kode" text,
    "nama" text,
    "alamat" text,
    "kode_polda" text,
    "kode_pusiknas" text,
    "jml_desa" text,
    "jml_kel" text,
    "jml_penduduk" text,
    "jml_pers_dsp" text,
    "jml_pers_riil" text,
    "luas_wilayah" text,
    CONSTRAINT "bdb_dors_lp_polres_pkey" PRIMARY KEY (id),
    CONSTRAINT "bdb_dors_lp_polres_lp_id_key" UNIQUE (lp_id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_dors_lp_polsek
-- Live row estimate: ~835,693 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_dors_lp_polsek" (
    "id" bigint DEFAULT nextval('bdb_dors_lp_polsek_id_seq'::regclass) NOT NULL,
    "lp_id" bigint NOT NULL,
    "dors_lp_id" bigint,
    "model_lp" text,
    "dors_ref_id" text,
    "kode" text,
    "nama" text,
    "alamat" text,
    "alamat_web" text,
    "kode_polda" text,
    "kode_polres" text,
    "kode_pusiknas" text,
    "jml_desa" text,
    "jml_kel" text,
    "jml_penduduk" text,
    "jml_pers_dsp" text,
    "jml_pers_riil" text,
    "luas_wilayah" text,
    CONSTRAINT "bdb_dors_lp_polsek_pkey" PRIMARY KEY (id),
    CONSTRAINT "bdb_dors_lp_polsek_lp_id_key" UNIQUE (lp_id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_dors_lp_terlibat
-- Live row estimate: ~11,164,838 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_dors_lp_terlibat" (
    "id" bigint DEFAULT nextval('bdb_dors_lp_terlibat_id_seq'::regclass) NOT NULL,
    "lp_id" bigint NOT NULL,
    "dors_lp_id" bigint,
    "model_lp" text,
    "dors_ref_id" text,
    "id_laporan" text,
    "nama" text,
    "nik" text,
    "jenis_identitas" text,
    "jenis_kelamin" text,
    "gender" text,
    "tempat_lahir" text,
    "tgl_lahir" text,
    "umur" text,
    "agama" text,
    "suku" text,
    "kewarganegaraan" text,
    "pekerjaan" text,
    "pendidikan_terakhir" text,
    "alamat" text,
    "alamat_non_nkri" text,
    "no_hp" text,
    "telphone" text,
    "email" text,
    "sosmed" text,
    "keterlibatan" text,
    "jenis_korban" text,
    "status_korban" text,
    "nomor_visum" text,
    "source_created_at" text,
    "source_updated_at" text,
    CONSTRAINT "bdb_dors_lp_terlibat_pkey" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_dors_lp_tindak_pidana
-- Live row estimate: ~2,032,961 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_dors_lp_tindak_pidana" (
    "id" bigint DEFAULT nextval('bdb_dors_lp_tindak_pidana_id_seq'::regclass) NOT NULL,
    "lp_id" bigint NOT NULL,
    "dors_lp_id" bigint,
    "model_lp" text,
    "dors_ref_id" text,
    "id_lp" text,
    "id_kategori_kejahatan" text,
    "nama_kategori_kejahatan" text,
    "id_uu" text,
    "nama_uu" text,
    "pasal" text,
    "pasal_tambahan" text,
    "pasal_mapping" text,
    "juncto" text,
    "subsider" text,
    "source_updated_at" text,
    CONSTRAINT "bdb_dors_lp_tindak_pidana_pkey" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_dors_lp_tkp_desa
-- Live row estimate: ~2,757,192 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_dors_lp_tkp_desa" (
    "id" bigint DEFAULT nextval('bdb_dors_lp_tkp_desa_id_seq'::regclass) NOT NULL,
    "lp_id" bigint NOT NULL,
    "dors_lp_id" bigint,
    "model_lp" text,
    "kode_provinsi" text,
    "kode_kabupaten" text,
    "kode_kecamatan" text,
    "kode_desa" text,
    "desa" text,
    "singkatan" text,
    CONSTRAINT "bdb_dors_lp_tkp_desa_pkey" PRIMARY KEY (id),
    CONSTRAINT "bdb_dors_lp_tkp_desa_lp_id_key" UNIQUE (lp_id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_dors_lp_tkp_kecamatan
-- Live row estimate: ~2,846,747 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_dors_lp_tkp_kecamatan" (
    "id" bigint DEFAULT nextval('bdb_dors_lp_tkp_kecamatan_id_seq'::regclass) NOT NULL,
    "lp_id" bigint NOT NULL,
    "dors_lp_id" bigint,
    "model_lp" text,
    "kode_provinsi" text,
    "kode_kabupaten" text,
    "kode_kecamatan" text,
    "kecamatan" text,
    "singkatan" text,
    CONSTRAINT "bdb_dors_lp_tkp_kecamatan_pkey" PRIMARY KEY (id),
    CONSTRAINT "bdb_dors_lp_tkp_kecamatan_lp_id_key" UNIQUE (lp_id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_dors_lp_tkp_kota
-- Live row estimate: ~2,851,458 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_dors_lp_tkp_kota" (
    "id" bigint DEFAULT nextval('bdb_dors_lp_tkp_kota_id_seq'::regclass) NOT NULL,
    "lp_id" bigint NOT NULL,
    "dors_lp_id" bigint,
    "model_lp" text,
    "kode_provinsi" text,
    "kode_kabupaten" text,
    "kabupaten" text,
    "ibukota" text,
    "singkatan" text,
    CONSTRAINT "bdb_dors_lp_tkp_kota_pkey" PRIMARY KEY (id),
    CONSTRAINT "bdb_dors_lp_tkp_kota_lp_id_key" UNIQUE (lp_id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_dors_lp_tkp_provinsi
-- Live row estimate: ~2,850,859 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_dors_lp_tkp_provinsi" (
    "id" bigint DEFAULT nextval('bdb_dors_lp_tkp_provinsi_id_seq'::regclass) NOT NULL,
    "lp_id" bigint NOT NULL,
    "dors_lp_id" bigint,
    "model_lp" text,
    "kode_provinsi" text,
    "provinsi" text,
    "singkatan" text,
    CONSTRAINT "bdb_dors_lp_tkp_provinsi_pkey" PRIMARY KEY (id),
    CONSTRAINT "bdb_dors_lp_tkp_provinsi_lp_id_key" UNIQUE (lp_id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_dors_lp_unit
-- Live row estimate: ~2,851,687 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_dors_lp_unit" (
    "id" bigint DEFAULT nextval('bdb_dors_lp_unit_id_seq'::regclass) NOT NULL,
    "lp_id" bigint NOT NULL,
    "dors_lp_id" bigint,
    "model_lp" text,
    "dors_ref_id" text,
    "unit" text,
    "level" text,
    "id_emp" text,
    CONSTRAINT "bdb_dors_lp_unit_pkey" PRIMARY KEY (id),
    CONSTRAINT "bdb_dors_lp_unit_lp_id_key" UNIQUE (lp_id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_dors_raw_lp
-- Live row estimate: ~2,852,128 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_dors_raw_lp" (
    "id" bigint DEFAULT nextval('bdb_dors_raw_lp_id_seq'::regclass) NOT NULL,
    "dors_lp_id" bigint NOT NULL,
    "model_lp" text DEFAULT 'lp_model_unknown'::text NOT NULL,
    "no_laporan" text,
    "payload_json" jsonb NOT NULL,
    "source" text DEFAULT 'DORS'::text NOT NULL,
    "data_scope" text DEFAULT 'TEST'::text NOT NULL,
    "import_batch" text,
    "synced_at" timestamp without time zone DEFAULT now() NOT NULL,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT "bdb_dors_raw_lp_pkey" PRIMARY KEY (id),
    CONSTRAINT "bdb_dors_raw_lp_dors_lp_id_model_lp_key" UNIQUE (dors_lp_id, model_lp),
    CONSTRAINT "bdb_dors_raw_lp_data_scope_check" CHECK (data_scope = ANY (ARRAY['TEST'::text, 'OPERASIONAL'::text, 'ARCHIVE'::text]))
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_dors_satker_map
-- Live row estimate: ~5,691 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_dors_satker_map" (
    "id" bigint DEFAULT nextval('bdb_dors_satker_map_id_seq'::regclass) NOT NULL,
    "dors_kode_pusiknas" text,
    "dors_nama" text NOT NULL,
    "dors_parent_nama" text,
    "satker_id" bigint NOT NULL,
    "satker_nama" text,
    "catatan" text,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "unit_nama" text,
    CONSTRAINT "bdb_dors_satker_map_pkey" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_dors_sync_log
-- Live row estimate: ~815 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_dors_sync_log" (
    "id" bigint DEFAULT nextval('bdb_dors_sync_log_id_seq'::regclass) NOT NULL,
    "trigger" text DEFAULT 'manual'::text NOT NULL,
    "from_date" date,
    "to_date" date,
    "status" text DEFAULT 'running'::text NOT NULL,
    "total_fetched" integer DEFAULT 0 NOT NULL,
    "total_upserted" integer DEFAULT 0 NOT NULL,
    "sources_json" jsonb DEFAULT '[]'::jsonb NOT NULL,
    "error" text,
    "started_at" timestamp without time zone DEFAULT now() NOT NULL,
    "finished_at" timestamp without time zone,
    "duration_ms" integer,
    "attempt" integer DEFAULT 1 NOT NULL,
    "max_attempts" integer DEFAULT 5 NOT NULL,
    "current_source" text,
    "current_page" integer,
    "current_last_page" integer,
    "stopped_reason" text,
    "current_chunk_from" date,
    "current_chunk_to" date,
    "chunks_done" integer,
    "chunks_total" integer,
    CONSTRAINT "bdb_dors_sync_log_pkey" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_dpo
-- Live row estimate: ~0 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_dpo" (
    "id" bigint DEFAULT nextval('bdb_dpo_id_seq'::regclass) NOT NULL,
    "timestamp_input" timestamp with time zone,
    "email_pelapor" character varying(255),
    "tingkatan_satker" character varying(50),
    "sub_satker_bareskrim" character varying(100),
    "sub_satker_polda" character varying(100),
    "nama_polda" character varying(100),
    "sub_satker_polres" character varying(100),
    "nama_polres" character varying(100),
    "sub_satker_polsek" character varying(100),
    "nama_polsek" character varying(100),
    "satker_nama" text,
    "satker_id" bigint,
    "nama_dpo" text NOT NULL,
    "foto_dpo_url" text,
    "kewarganegaraan" character varying(100),
    "jenis_identitas" character varying(100),
    "nomor_identitas" character varying(100),
    "alamat_terakhir" text,
    "nomor_dpo" text NOT NULL,
    "tanggal_dpo" date,
    "scan_dokumen_url" text,
    "penyidik_nama" character varying(255),
    "penyidik_telp" character varying(50),
    "kategori_kejahatan" character varying(100),
    "nama_kejahatan" text,
    "kategori_kejahatan_detail" character varying(100),
    "ceklist_duplikat" text,
    "raw_payload" jsonb,
    "created_at" timestamp with time zone DEFAULT now(),
    "updated_at" timestamp with time zone DEFAULT now(),
    "status_dpo" character varying(50) DEFAULT 'AKTIF'::character varying,
    "nomor_surat_cabut" text,
    "tanggal_cabut" date,
    "alasan_cabut" character varying(100),
    "keterangan_cabut" text,
    "scan_dokumen_cabut_url" text,
    "lp_id" bigint,
    "nomor_lp" text,
    "jenis_kejahatan_id" bigint,
    CONSTRAINT "bdb_dpo_pkey" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_dpo_arsip
-- Live row estimate: ~0 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_dpo_arsip" (
    "id" bigint DEFAULT nextval('bdb_dpo_arsip_id_seq'::regclass) NOT NULL,
    "dpo_id" bigint NOT NULL,
    "tipe_dokumen" character varying(50) DEFAULT 'SCAN_DPO'::character varying,
    "file_name" character varying(255),
    "mime_type" character varying(100) DEFAULT 'application/pdf'::character varying,
    "file_size" bigint DEFAULT 0,
    "file_data" bytea,
    "created_at" timestamp with time zone DEFAULT now(),
    "updated_at" timestamp with time zone DEFAULT now(),
    CONSTRAINT "bdb_dpo_arsip_pkey" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_iccs_mapping_audit
-- Live row estimate: ~224 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_iccs_mapping_audit" (
    "batch_id" text NOT NULL,
    "jenis_kejahatan_id" bigint NOT NULL,
    "keterangan" text,
    "old_iccs_id" bigint,
    "new_iccs_id" bigint NOT NULL,
    "changed_at" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "bdb_iccs_mapping_audit_pkey" PRIMARY KEY (batch_id, jenis_kejahatan_id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_integration_client
-- Live row estimate: ~1 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_integration_client" (
    "id" bigint DEFAULT nextval('bdb_integration_client_id_seq'::regclass) NOT NULL,
    "nama_klien" text NOT NULL,
    "username" character varying(100) NOT NULL,
    "password_hash" text NOT NULL,
    "status" character varying(20) DEFAULT 'AKTIF'::character varying NOT NULL,
    "allowed_scopes" jsonb DEFAULT '[]'::jsonb NOT NULL,
    "keterangan" text,
    "created_by" bigint,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
    "last_used_at" timestamp with time zone,
    "last_used_ip" text,
    "allowed_ips" jsonb DEFAULT '[]'::jsonb NOT NULL,
    CONSTRAINT "bdb_integration_client_pkey" PRIMARY KEY (id),
    CONSTRAINT "bdb_integration_client_username_key" UNIQUE (username)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_jukrah
-- Live row estimate: ~0 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_jukrah" (
    "id" bigint DEFAULT nextval('bdb_jukrah_id_seq'::regclass) NOT NULL,
    "nama" text NOT NULL,
    "deskripsi" text,
    "aktif" boolean DEFAULT true NOT NULL,
    "lampiran" jsonb,
    "tanggal_publish" date DEFAULT CURRENT_DATE NOT NULL,
    "created_by" bigint,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "bdb_jukrah_pkey" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_jukrah_view
-- Live row estimate: ~3 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_jukrah_view" (
    "id" bigint DEFAULT nextval('bdb_jukrah_view_id_seq'::regclass) NOT NULL,
    "jukrah_id" bigint NOT NULL,
    "user_id" bigint NOT NULL,
    "viewed_at" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "bdb_jukrah_view_pkey" PRIMARY KEY (id),
    CONSTRAINT "bdb_jukrah_view_jukrah_id_user_id_key" UNIQUE (jukrah_id, user_id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_kasus_atensi
-- Live row estimate: ~5 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_kasus_atensi" (
    "id" bigint DEFAULT nextval('bdb_kasus_atensi_id_seq'::regclass) NOT NULL,
    "judul" text NOT NULL,
    "sumber_atensi" text,
    "level_atensi" text,
    "tanggal_atensi" date,
    "status_atensi" text DEFAULT 'aktif'::text NOT NULL,
    "keterangan" text,
    "satker_id" bigint,
    "created_by" bigint,
    "updated_by" bigint,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp with time zone,
    CONSTRAINT "bdb_kasus_atensi_pkey" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_kasus_atensi_attachments
-- Live row estimate: ~0 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_kasus_atensi_attachments" (
    "id" bigint DEFAULT nextval('bdb_kasus_atensi_attachments_id_seq'::regclass) NOT NULL,
    "kasus_atensi_id" bigint NOT NULL,
    "file_name" text NOT NULL,
    "object_key" text NOT NULL,
    "content_type" text,
    "size" bigint,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "bdb_kasus_atensi_attachments_pkey" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_kasus_atensi_lp
-- Live row estimate: ~4 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_kasus_atensi_lp" (
    "id" bigint DEFAULT nextval('bdb_kasus_atensi_lp_id_seq'::regclass) NOT NULL,
    "kasus_atensi_id" bigint NOT NULL,
    "lp_id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "bdb_kasus_atensi_lp_pkey" PRIMARY KEY (id),
    CONSTRAINT "bdb_kasus_atensi_lp_kasus_atensi_id_lp_id_key" UNIQUE (kasus_atensi_id, lp_id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_kasus_menonjol
-- Live row estimate: ~709 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_kasus_menonjol" (
    "id" bigint DEFAULT nextval('bdb_kasus_menonjol_id_seq'::regclass) NOT NULL,
    "judul" text NOT NULL,
    "skala_viral" text,
    "tanggal_rilis" date,
    "rilis" boolean DEFAULT false NOT NULL,
    "keterangan" text,
    "satker_id" bigint,
    "created_by" bigint,
    "updated_by" bigint,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp with time zone,
    "nomor_lp" text,
    "model_lp" character varying(10),
    "tgl_lp" date,
    "tindak_pidana" text,
    "pasal" text,
    "tempat_kejadian" text,
    "waktu_kejadian" text,
    "kronologis" text,
    "pelapor" text,
    "daftar_tersangka" text,
    "daftar_bb" text,
    "modus_operandi" text,
    "motif_pelaku" text,
    "link_dokumentasi" text,
    "raw_payload" jsonb,
    CONSTRAINT "bdb_kasus_menonjol_pkey" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_kasus_menonjol_attachments
-- Live row estimate: ~6 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_kasus_menonjol_attachments" (
    "id" bigint DEFAULT nextval('bdb_kasus_menonjol_attachments_id_seq'::regclass) NOT NULL,
    "kasus_menonjol_id" bigint NOT NULL,
    "file_name" text NOT NULL,
    "object_key" text NOT NULL,
    "content_type" text,
    "size" bigint,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "bdb_kasus_menonjol_attachments_pkey" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_kasus_menonjol_lp
-- Live row estimate: ~245 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_kasus_menonjol_lp" (
    "id" bigint DEFAULT nextval('bdb_kasus_menonjol_lp_id_seq'::regclass) NOT NULL,
    "kasus_menonjol_id" bigint NOT NULL,
    "lp_id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "bdb_kasus_menonjol_lp_pkey" PRIMARY KEY (id),
    CONSTRAINT "bdb_kasus_menonjol_lp_kasus_menonjol_id_lp_id_key" UNIQUE (kasus_menonjol_id, lp_id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_kerma_attachments
-- Live row estimate: ~0 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_kerma_attachments" (
    "id" bigint DEFAULT nextval('bdb_kerma_attachments_id_seq'::regclass) NOT NULL,
    "kerma_id" bigint NOT NULL,
    "file_name" text NOT NULL,
    "object_key" text NOT NULL,
    "content_type" text,
    "size" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT "bdb_kerma_attachments_pkey" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_kerma_jenis_naskah
-- Live row estimate: ~8 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_kerma_jenis_naskah" (
    "id" bigint DEFAULT nextval('bdb_kerma_jenis_naskah_id_seq'::regclass) NOT NULL,
    "nama" text NOT NULL,
    "urutan" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "bdb_kerma_jenis_naskah_pkey" PRIMARY KEY (id),
    CONSTRAINT "bdb_kerma_jenis_naskah_nama_key" UNIQUE (nama)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_kerma_master
-- Live row estimate: ~2 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_kerma_master" (
    "id" bigint DEFAULT nextval('bdb_kerma_master_id_seq'::regclass) NOT NULL,
    "tahun_data" integer,
    "institusi" text,
    "nomor_dokumen_mitra" text,
    "nomor_dokumen_polri" text,
    "jenis_naskah" text,
    "tentang" text,
    "tanggal_mulai" date,
    "tanggal_akhir" date,
    "masa_berlaku_text" text,
    "satker_terkait" text,
    "sub_satker_terkait" text,
    "pedoman_pelaksanaan" text,
    "status" text DEFAULT 'AKTIF'::text,
    "file_dokumen_url" text,
    "is_tampil" boolean DEFAULT true,
    "created_by" text,
    "updated_by" text,
    "created_at" timestamp with time zone DEFAULT now(),
    "updated_at" timestamp with time zone DEFAULT now(),
    "deleted_at" timestamp with time zone,
    "catatan" text,
    CONSTRAINT "bdb_kerma_master_pkey" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_kinerja_crime_group_mapping
-- Live row estimate: ~629 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_kinerja_crime_group_mapping" (
    "id" bigint DEFAULT nextval('bdb_kinerja_crime_group_mapping_id_seq'::regclass) NOT NULL,
    "version_id" bigint NOT NULL,
    "jenis_kejahatan_id" bigint NOT NULL,
    "kelompok" text NOT NULL,
    "decision_status" text DEFAULT 'CANDIDATE'::text NOT NULL,
    "source" text NOT NULL,
    "confidence" numeric(7,6),
    "evidence" jsonb DEFAULT '{}'::jsonb NOT NULL,
    "note" text,
    "active" boolean DEFAULT true NOT NULL,
    "created_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "approved_by" bigint,
    "approved_at" timestamp without time zone,
    CONSTRAINT "bdb_kinerja_crime_group_mapping_pkey" PRIMARY KEY (id),
    CONSTRAINT "uq_kinerja_crime_group_version_crime" UNIQUE (version_id, jenis_kejahatan_id),
    CONSTRAINT "approved_mapping_has_approver" CHECK (decision_status <> 'APPROVED'::text OR approved_by IS NOT NULL AND approved_at IS NOT NULL),
    CONSTRAINT "bdb_kinerja_crime_group_mapping_decision_status_check" CHECK (decision_status = ANY (ARRAY['CANDIDATE'::text, 'APPROVED'::text, 'REJECTED'::text])),
    CONSTRAINT "bdb_kinerja_crime_group_mapping_kelompok_check" CHECK (kelompok = ANY (ARRAY['KRIMUM'::text, 'KRIMSUS'::text, 'NARKOBA'::text, 'TIPIDUM'::text, 'TIPIDTER'::text, 'TIPIDEKSUS'::text, 'TIPIDKOR'::text, 'TIPIDSIBER'::text, 'TIPIDNARKOBA'::text, 'TIPIDPPAPPO'::text]))
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_kinerja_crime_group_mapping_version
-- Live row estimate: ~2 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_kinerja_crime_group_mapping_version" (
    "id" bigint DEFAULT nextval('bdb_kinerja_crime_group_mapping_version_id_seq'::regclass) NOT NULL,
    "version_code" text NOT NULL,
    "status" text DEFAULT 'DRAFT'::text NOT NULL,
    "active" boolean DEFAULT false NOT NULL,
    "source_snapshot_at" timestamp without time zone,
    "note" text,
    "created_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "approved_by" bigint,
    "approved_at" timestamp without time zone,
    CONSTRAINT "bdb_kinerja_crime_group_mapping_version_pkey" PRIMARY KEY (id),
    CONSTRAINT "bdb_kinerja_crime_group_mapping_version_version_code_key" UNIQUE (version_code),
    CONSTRAINT "approved_version_has_approver" CHECK (status <> 'APPROVED'::text OR approved_by IS NOT NULL AND approved_at IS NOT NULL),
    CONSTRAINT "bdb_kinerja_crime_group_mapping_version_status_check" CHECK (status = ANY (ARRAY['DRAFT'::text, 'APPROVED'::text, 'RETIRED'::text]))
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_kinerja_perkara_snapshot
-- Live row estimate: ~2,114,283 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_kinerja_perkara_snapshot" (
    "lp_id" bigint NOT NULL,
    "satker_id" bigint,
    "tanggal_mulai_penanganan" date,
    "tanggal_selesai" date,
    "tingkat_kesulitan" text,
    "kesulitan_belum_dipilih" boolean DEFAULT false NOT NULL,
    "batas_hari" integer DEFAULT 30 NOT NULL,
    "tanggal_jatuh_tempo" date,
    "refreshed_at" timestamp with time zone DEFAULT now() NOT NULL,
    "status_code" text,
    "jenis_kejahatan_id" bigint,
    "model_lp" text,
    "is_rj" boolean DEFAULT false NOT NULL,
    CONSTRAINT "bdb_kinerja_perkara_snapshot_pkey" PRIMARY KEY (lp_id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_kinerja_perkara_snapshot_meta
-- Live row estimate: ~1 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_kinerja_perkara_snapshot_meta" (
    "id" smallint NOT NULL,
    "last_refreshed_at" timestamp with time zone NOT NULL,
    CONSTRAINT "bdb_kinerja_perkara_snapshot_meta_pkey" PRIMARY KEY (id),
    CONSTRAINT "bdb_kinerja_perkara_snapshot_meta_id_check" CHECK (id = 1)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_kinerja_perkara_summary_snapshot
-- Live row estimate: ~14 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_kinerja_perkara_summary_snapshot" (
    "id" integer DEFAULT nextval('bdb_kinerja_perkara_summary_snapshot_id_seq'::regclass) NOT NULL,
    "tahun" integer NOT NULL,
    "bulan" integer,
    "scope_key" text NOT NULL,
    "summary_data" jsonb NOT NULL,
    "rekap_totals" jsonb,
    "refreshed_at" timestamp with time zone DEFAULT now() NOT NULL,
    "rekap_data" jsonb,
    CONSTRAINT "bdb_kinerja_perkara_summary_snapshot_pkey" PRIMARY KEY (id),
    CONSTRAINT "uidx_kp_summary_snap" UNIQUE NULLS NOT DISTINCT (tahun, bulan, scope_key)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_kinerja_ppappo_crime_mapping
-- Live row estimate: ~34 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_kinerja_ppappo_crime_mapping" (
    "id" bigint DEFAULT nextval('bdb_kinerja_ppappo_crime_mapping_id_seq'::regclass) NOT NULL,
    "jenis_kejahatan_id" bigint NOT NULL,
    "subkelompok" character varying(3) NOT NULL,
    "alasan" text NOT NULL,
    "sumber" text NOT NULL,
    "active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT "bdb_kinerja_ppappo_crime_mapping_pkey" PRIMARY KEY (id),
    CONSTRAINT "bdb_kinerja_ppappo_crime_mapping_jenis_uk" UNIQUE (jenis_kejahatan_id),
    CONSTRAINT "bdb_kinerja_ppappo_crime_mapping_subkelompok_check" CHECK (subkelompok::text = ANY (ARRAY['PPA'::character varying, 'PPO'::character varying]::text[]))
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_laporan_polisi
-- Live row estimate: ~2,847,302 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_laporan_polisi" (
    "id" bigint DEFAULT nextval('bdb_laporan_polisi_id_seq'::regclass) NOT NULL,
    "dors_lp_id" bigint NOT NULL,
    "model_lp" text NOT NULL,
    "raw_lp_id" bigint,
    "no_laporan" text,
    "tgl_laporan" text,
    "kategori" text,
    "tempat_kejadian" text,
    "uraian_singkat" text,
    "penanganan_level" text,
    "kode_pusiknas" text,
    "satker_id" bigint,
    "satker_nama" text,
    "unit_nama" text,
    "unit_level" text,
    "data_scope" text,
    "status" text DEFAULT 'BARU'::text NOT NULL,
    "payload_json" jsonb,
    "synced_at" timestamp without time zone DEFAULT now() NOT NULL,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "unit_satker_id" bigint,
    "unit_satker_nama" text,
    "unit_satker_kode" text,
    "status_id" bigint,
    "tingkat_kesulitan" text,
    "jenis_kejahatan_id" bigint,
    "kategori_lokasi_id" bigint,
    "motif_kejahatan_id" bigint,
    "modus_operandi_id" bigint,
    "tkp_provinsi_code" bigint,
    "tkp_kabupaten_code" bigint,
    "tkp_kecamatan_code" bigint,
    "tkp_desa_code" bigint,
    "master_data_linked_at" timestamp without time zone,
    "sudah_dilimpahkan" boolean DEFAULT false NOT NULL,
    "sub_dit_penanganan" text,
    "deleted_at" timestamp without time zone,
    "deleted_by" bigint,
    "delete_reason" text,
    "operasi_satgas_id" bigint,
    "tanggal_selesai" date,
    "dilimpahkan_eksternal" boolean DEFAULT false NOT NULL,
    "golongan_kejahatan_id" bigint,
    CONSTRAINT "bdb_laporan_polisi_pkey" PRIMARY KEY (id),
    CONSTRAINT "bdb_laporan_polisi_dors_lp_id_model_lp_key" UNIQUE (dors_lp_id, model_lp)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_lp_barang_bukti_manual
-- Live row estimate: ~19 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_lp_barang_bukti_manual" (
    "id" bigint DEFAULT nextval('bdb_lp_barang_bukti_manual_id_seq'::regclass) NOT NULL,
    "lp_id" bigint NOT NULL,
    "nomor_register" text,
    "jenis" text NOT NULL,
    "jumlah" text,
    "kepemilikan" text,
    "tanggal_penyitaan" date,
    "status" text DEFAULT 'MASUK'::text NOT NULL,
    "keterangan" text,
    "created_by" bigint,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp with time zone,
    CONSTRAINT "bdb_lp_barang_bukti_manual_pkey" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_lp_history_logs
-- Live row estimate: ~0 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_lp_history_logs" (
    "id" bigint DEFAULT nextval('bdb_lp_history_logs_id_seq'::regclass) NOT NULL,
    "lp_master_id" bigint NOT NULL,
    "event_type" text NOT NULL,
    "event_status" text,
    "event_text" text NOT NULL,
    "document_type" text,
    "document_number" text,
    "document_date" timestamp without time zone,
    "document_timezone" text DEFAULT 'WIB'::text,
    "from_satker_id" bigint,
    "to_satker_id" bigint,
    "from_satker_name" text,
    "to_satker_name" text,
    "note" text,
    "payload_json" jsonb,
    "created_by_id" bigint,
    "created_by_name" text,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "is_voided" boolean DEFAULT false NOT NULL,
    "voided_at" timestamp without time zone,
    "void_reason" text,
    "voided_by_event_id" bigint,
    CONSTRAINT "bdb_lp_history_logs_pkey" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_lp_master
-- Live row estimate: ~0 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_lp_master" (
    "id" bigint DEFAULT nextval('bdb_lp_master_id_seq'::regclass) NOT NULL,
    "dors_lp_id" bigint,
    "nomor_lp" text NOT NULL,
    "model_lp" text DEFAULT 'lp_model_unknown'::text NOT NULL,
    "tanggal_lp" timestamp without time zone,
    "waktu_kejadian" timestamp without time zone,
    "zona_waktu" text,
    "satker_master_id" bigint,
    "crime_master_id" bigint,
    "nama_kejahatan_canonical" text,
    "uraian_singkat" text,
    "status" text DEFAULT 'AKTIF'::text NOT NULL,
    "raw_lp_id" bigint,
    "data_scope" text DEFAULT 'TEST'::text NOT NULL,
    "import_batch" text,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "bdb_lp_id" text,
    "uraian_singkat_operasional" text,
    "tingkat_kesulitan" text,
    "detail_updated_at" timestamp without time zone,
    "is_distributed" boolean DEFAULT false NOT NULL,
    "operational_satker_id" bigint,
    "distributed_at" timestamp without time zone,
    CONSTRAINT "bdb_lp_master_pkey" PRIMARY KEY (id),
    CONSTRAINT "bdb_lp_master_dors_lp_id_model_lp_key" UNIQUE (dors_lp_id, model_lp),
    CONSTRAINT "bdb_lp_master_data_scope_check" CHECK (data_scope = ANY (ARRAY['TEST'::text, 'OPERASIONAL'::text, 'ARCHIVE'::text]))
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_lp_monitoring_access_log
-- Live row estimate: ~516 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_lp_monitoring_access_log" (
    "id" bigint DEFAULT nextval('bdb_lp_monitoring_access_log_id_seq'::regclass) NOT NULL,
    "user_id" bigint NOT NULL,
    "user_nama" text,
    "actor_satker_id" bigint,
    "actor_satker_nama" text,
    "actor_function" text,
    "target_satker_id" bigint NOT NULL,
    "target_satker_nama" text,
    "pernyataan" text NOT NULL,
    "alasan" text,
    "ip_address" text,
    "user_agent" text,
    "created_at" timestamp with time zone DEFAULT now(),
    CONSTRAINT "bdb_lp_monitoring_access_log_pkey" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_lp_pelimpahan
-- Live row estimate: ~2,627 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_lp_pelimpahan" (
    "id" bigint DEFAULT nextval('bdb_lp_pelimpahan_id_seq'::regclass) NOT NULL,
    "lp_id" bigint NOT NULL,
    "satker_asal_id" bigint NOT NULL,
    "satker_asal_nama" text,
    "satker_tujuan_id" bigint,
    "satker_tujuan_nama" text,
    "keterangan" text,
    "dilimpahkan_oleh" bigint,
    "dilimpahkan_oleh_nama" text,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "satker_eksternal_id" bigint,
    "satker_eksternal_nama" text,
    "nomor_dokumen" text,
    "tanggal_dokumen" date,
    CONSTRAINT "bdb_lp_pelimpahan_pkey" PRIMARY KEY (id),
    CONSTRAINT "chk_lp_pelimpahan_tujuan" CHECK (satker_tujuan_id IS NOT NULL AND satker_eksternal_id IS NULL OR satker_tujuan_id IS NULL AND satker_eksternal_id IS NOT NULL)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_lp_pelimpahan_attachments
-- Live row estimate: ~56 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_lp_pelimpahan_attachments" (
    "id" bigint DEFAULT nextval('bdb_lp_pelimpahan_attachments_id_seq'::regclass) NOT NULL,
    "pelimpahan_id" bigint NOT NULL,
    "file_name" text NOT NULL,
    "object_key" text NOT NULL,
    "content_type" text,
    "size" bigint,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "bdb_lp_pelimpahan_attachments_pkey" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_lp_pihak_manual
-- Live row estimate: ~0 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_lp_pihak_manual" (
    "id" bigint DEFAULT nextval('bdb_lp_pihak_manual_id_seq'::regclass) NOT NULL,
    "lp_id" bigint NOT NULL,
    "keterlibatan" text NOT NULL,
    "nama" text NOT NULL,
    "nik" text,
    "jenis_kelamin" text,
    "tempat_lahir" text,
    "tgl_lahir" text,
    "pekerjaan" text,
    "alamat" text,
    "no_hp" text,
    "bap_tanggal" date,
    "nomor_dokumen" text,
    "tanggal_dokumen" date,
    "lampiran_file_name" text,
    "lampiran_object_key" text,
    "lampiran_content_type" text,
    "lampiran_size" bigint,
    "keterangan" text,
    "created_by" bigint,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp with time zone,
    CONSTRAINT "bdb_lp_pihak_manual_pkey" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_lp_status_reconcile_log
-- Live row estimate: ~2,578 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_lp_status_reconcile_log" (
    "id" bigint DEFAULT nextval('bdb_lp_status_reconcile_log_id_seq'::regclass) NOT NULL,
    "triggered_by" text NOT NULL,
    "user_id" bigint,
    "user_name" text,
    "diperiksa" integer NOT NULL,
    "diperbaiki" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "bdb_lp_status_reconcile_log_pkey" PRIMARY KEY (id),
    CONSTRAINT "bdb_lp_status_reconcile_log_triggered_by_check" CHECK (triggered_by = ANY (ARRAY['CRON'::text, 'MANUAL'::text]))
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_lp_tindak_pidana
-- Live row estimate: ~2,669 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_lp_tindak_pidana" (
    "id" bigint DEFAULT nextval('bdb_lp_tindak_pidana_id_seq'::regclass) NOT NULL,
    "lp_id" bigint NOT NULL,
    "pasal_id" bigint,
    "nomor_pasal" text,
    "nama_kategori" text,
    "uu_referensi" text,
    "ayat" text,
    "juncto" text,
    "subsider" text,
    "sumber" text DEFAULT 'manual'::text NOT NULL,
    "sumber_ref" text,
    "dokumen_id" bigint,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "bdb_lp_tindak_pidana_pkey" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_lp_tindak_pidana_dors
-- Live row estimate: ~2,040,373 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_lp_tindak_pidana_dors" (
    "id" bigint DEFAULT nextval('bdb_lp_tindak_pidana_dors_id_seq'::regclass) NOT NULL,
    "laporan_polisi_id" bigint NOT NULL,
    "dors_tp_id" bigint,
    "jenis_kejahatan_id" bigint,
    "undang_undang_id" bigint,
    "nama_kategori_kejahatan" text,
    "nama_uu" text,
    "pasal_mapping" text,
    "pasal_tambahan" text,
    "juncto" text,
    "subsider" text,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT "bdb_lp_tindak_pidana_dors_pkey" PRIMARY KEY (id),
    CONSTRAINT "bdb_lp_tindak_pidana_dors_laporan_polisi_id_dors_tp_id_key" UNIQUE (laporan_polisi_id, dors_tp_id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_menu_role_access
-- Live row estimate: ~3 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_menu_role_access" (
    "id" bigint DEFAULT nextval('bdb_menu_role_access_id_seq'::regclass) NOT NULL,
    "role" text NOT NULL,
    "menu_key" text NOT NULL,
    "allowed" boolean DEFAULT true NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "bdb_menu_role_access_pkey" PRIMARY KEY (id),
    CONSTRAINT "bdb_menu_role_access_role_menu_key_key" UNIQUE (role, menu_key)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_notification_checkpoint
-- Live row estimate: ~11,271 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_notification_checkpoint" (
    "user_id" bigint NOT NULL,
    "entity" text NOT NULL,
    "last_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "bdb_notification_checkpoint_pkey" PRIMARY KEY (user_id, entity)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_operasi_satgas
-- Live row estimate: ~12 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_operasi_satgas" (
    "id" bigint DEFAULT nextval('bdb_operasi_satgas_id_seq'::regclass) NOT NULL,
    "jenis" text DEFAULT 'OPERASI'::text NOT NULL,
    "nama" text NOT NULL,
    "nomor_dasar" text,
    "tanggal_dibentuk" date,
    "tanggal_mulai" date,
    "tanggal_selesai" date,
    "satker_penyelenggara" text,
    "pimpinan" text,
    "deskripsi" text,
    "is_aktif" boolean DEFAULT true NOT NULL,
    "created_by" bigint,
    "updated_by" bigint,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp with time zone,
    "jenis_kategori" text,
    CONSTRAINT "bdb_operasi_satgas_pkey" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_operasi_satgas_attachments
-- Live row estimate: ~1 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_operasi_satgas_attachments" (
    "id" bigint DEFAULT nextval('bdb_operasi_satgas_attachments_id_seq'::regclass) NOT NULL,
    "operasi_satgas_id" bigint NOT NULL,
    "file_name" text NOT NULL,
    "object_key" text NOT NULL,
    "content_type" text,
    "size" bigint,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "bdb_operasi_satgas_attachments_pkey" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_operasi_satgas_jenis
-- Live row estimate: ~10 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_operasi_satgas_jenis" (
    "id" bigint DEFAULT nextval('bdb_operasi_satgas_jenis_id_seq'::regclass) NOT NULL,
    "kelompok" text NOT NULL,
    "nama" text NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "bdb_operasi_satgas_jenis_pkey" PRIMARY KEY (id),
    CONSTRAINT "bdb_operasi_satgas_jenis_kelompok_nama_key" UNIQUE (kelompok, nama)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_panduan_pengguna
-- Live row estimate: ~1 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_panduan_pengguna" (
    "id" bigint DEFAULT nextval('bdb_panduan_pengguna_id_seq'::regclass) NOT NULL,
    "judul" text NOT NULL,
    "deskripsi" text,
    "kategori" text,
    "tipe" character varying(10) DEFAULT 'PDF'::character varying NOT NULL,
    "file_name" text NOT NULL,
    "object_key" text NOT NULL,
    "content_type" text,
    "size" bigint,
    "urutan" integer DEFAULT 0 NOT NULL,
    "status" character varying(20) DEFAULT 'AKTIF'::character varying NOT NULL,
    "created_by" bigint,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "bdb_panduan_pengguna_pkey" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_pasal_master
-- Live row estimate: ~2,443 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_pasal_master" (
    "id" bigint DEFAULT nextval('bdb_pasal_master_id_seq'::regclass) NOT NULL,
    "nomor_pasal" text NOT NULL,
    "deskripsi" text,
    "uu_referensi" text,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT "bdb_pasal_master_pkey" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_pihak_terlibat_ranking_snapshot
-- Live row estimate: ~151,659 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_pihak_terlibat_ranking_snapshot" (
    "id" bigint DEFAULT nextval('bdb_pihak_terlibat_ranking_snapshot_id_seq'::regclass) NOT NULL,
    "tahun" integer NOT NULL,
    "satker_id" bigint,
    "keterlibatan" text NOT NULL,
    "nama" text NOT NULL,
    "nik" text,
    "total_lp" integer DEFAULT 0 NOT NULL,
    "last_seen" timestamp with time zone,
    "refreshed_at" timestamp with time zone DEFAULT now() NOT NULL,
    "bulan" integer,
    "satker_tier" integer DEFAULT 4,
    "satker_nama_tertinggi" text,
    "kategori_filter" character varying(32) DEFAULT 'ALL'::character varying,
    "count_dpo" integer DEFAULT 0,
    "count_tersangka" integer DEFAULT 0,
    "count_terlapor" integer DEFAULT 0,
    "count_saksi" integer DEFAULT 0,
    "count_korban" integer DEFAULT 0,
    "count_pelapor" integer DEFAULT 0,
    "jumlah_satker_unik" integer DEFAULT 1,
    "jumlah_polda_unik" integer DEFAULT 1,
    "is_lintas_wilayah" boolean DEFAULT false,
    "daftar_satker" text,
    "nasional_score" integer DEFAULT 0,
    "tipe_subjek" character varying(30) DEFAULT 'PERORANGAN'::character varying,
    "tipe_identitas" character varying(30) DEFAULT 'NIK'::character varying,
    CONSTRAINT "bdb_pihak_terlibat_ranking_snapshot_pkey" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_pihak_terlibat_summary_snapshot
-- Live row estimate: ~272,865 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_pihak_terlibat_summary_snapshot" (
    "id" bigint DEFAULT nextval('bdb_pihak_terlibat_summary_snapshot_id_seq'::regclass) NOT NULL,
    "satker_id" bigint NOT NULL,
    "tanggal" date NOT NULL,
    "semua" integer DEFAULT 0 NOT NULL,
    "korban" integer DEFAULT 0 NOT NULL,
    "saksi" integer DEFAULT 0 NOT NULL,
    "pelapor" integer DEFAULT 0 NOT NULL,
    "terlapor" integer DEFAULT 0 NOT NULL,
    "tersangka" integer DEFAULT 0 NOT NULL,
    "dpo" integer DEFAULT 0 NOT NULL,
    "lidik" integer DEFAULT 0 NOT NULL,
    "refreshed_at" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "bdb_pihak_terlibat_summary_snapshot_pkey" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_satker
-- Live row estimate: ~14,217 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_satker" (
    "id" bigint DEFAULT nextval('bdb_satker_id_seq'::regclass) NOT NULL,
    "kode" text NOT NULL,
    "kode_canonical" text NOT NULL,
    "deskripsi" text,
    "parent_id" bigint,
    "root_id" bigint,
    "parent_kode" text,
    "depth" integer DEFAULT 0 NOT NULL,
    "is_root" boolean DEFAULT false NOT NULL,
    "is_synthetic" boolean DEFAULT false NOT NULL,
    "source" text DEFAULT 'ROBINOPS'::text NOT NULL,
    "synced_at" timestamp without time zone DEFAULT now() NOT NULL,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "alamat" text,
    "provinsi" text,
    "kabupaten_kota" text,
    "kecamatan" text,
    "desa" text,
    "kode_pos" text,
    "longitude" text,
    "latitude" text,
    "jumlah_penduduk" text,
    "keanggotaan" text,
    "fungsi" text,
    "kinerja_aktif" boolean DEFAULT true NOT NULL,
    "dors_kode" text,
    "dors_satker_id" text,
    "nama_satker_dors" text,
    "sub_domain" text,
    "operational_role" text,
    "dors_status" text,
    "tipe_satker" text DEFAULT 'FUNGSI'::text NOT NULL,
    "urutan" integer,
    "dors_mapping_aktif" boolean DEFAULT true NOT NULL,
    "pelimpahan_target_aktif" boolean DEFAULT false NOT NULL,
    "function_domain" text,
    "organization_domain" text,
    "nama_singkat" text,
    CONSTRAINT "bdb_satker_pkey" PRIMARY KEY (id),
    CONSTRAINT "bdb_satker_function_domain_r11_chk" CHECK (function_domain = ANY (ARRAY['INTERNAL_RESERSE'::text, 'EKSTERNAL_RESERSE'::text, 'STRUCTURAL'::text, 'NOT_APPLICABLE'::text])),
    CONSTRAINT "bdb_satker_organization_domain_r11_chk" CHECK (organization_domain = ANY (ARRAY['INTERNAL_POLRI'::text, 'EKSTERNAL_POLRI'::text])),
    CONSTRAINT "chk_satker_tipe" CHECK (tipe_satker = ANY (ARRAY['POLDA'::text, 'POLRES'::text, 'POLSEK'::text, 'FUNGSI'::text]))
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_satker_eksternal
-- Live row estimate: ~6,666 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_satker_eksternal" (
    "id" bigint DEFAULT nextval('bdb_satker_eksternal_id_seq'::regclass) NOT NULL,
    "nama" text NOT NULL,
    "alamat" text,
    "keterangan" text,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
    "function_domain" text,
    "organization_domain" text,
    CONSTRAINT "bdb_satker_eksternal_pkey" PRIMARY KEY (id),
    CONSTRAINT "bdb_satker_eksternal_function_domain_r11_chk" CHECK (function_domain = ANY (ARRAY['INTERNAL_RESERSE'::text, 'EKSTERNAL_RESERSE'::text, 'STRUCTURAL'::text, 'NOT_APPLICABLE'::text])),
    CONSTRAINT "bdb_satker_eksternal_organization_domain_r11_chk" CHECK (organization_domain = ANY (ARRAY['INTERNAL_POLRI'::text, 'EKSTERNAL_POLRI'::text]))
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_satker_master
-- Live row estimate: ~14 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_satker_master" (
    "id" bigint DEFAULT nextval('bdb_satker_master_id_seq'::regclass) NOT NULL,
    "domain" text DEFAULT 'INTERNAL POLRI'::text NOT NULL,
    "sub_domain" text DEFAULT 'INTERNAL RESERSE'::text NOT NULL,
    "level" text NOT NULL,
    "nama_satker_canonical" text NOT NULL,
    "dors_satker_id" text,
    "dors_kode" text,
    "nama_satker_dors" text,
    "nama_parent_satker_dors" text,
    "nama_grandparent_satker_dors" text,
    "status" text DEFAULT 'AKTIF'::text NOT NULL,
    "payload_json" jsonb,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "satker_key" text,
    "parent_key" text,
    "grandparent_key" text,
    "full_path" text,
    "source_type" text DEFAULT 'DORS'::text NOT NULL,
    "manual_code" text,
    "operational_role" text,
    "is_holding_node" boolean DEFAULT false NOT NULL,
    "function_domain" text,
    "organization_domain" text,
    CONSTRAINT "bdb_satker_master_pkey" PRIMARY KEY (id),
    CONSTRAINT "bdb_satker_master_level_dors_satker_id_dors_kode_key" UNIQUE (level, dors_satker_id, dors_kode),
    CONSTRAINT "bdb_satker_master_function_domain_r11_chk" CHECK (function_domain = ANY (ARRAY['INTERNAL_RESERSE'::text, 'EKSTERNAL_RESERSE'::text, 'STRUCTURAL'::text, 'NOT_APPLICABLE'::text])),
    CONSTRAINT "bdb_satker_master_organization_domain_r11_chk" CHECK (organization_domain = ANY (ARRAY['INTERNAL_POLRI'::text, 'EKSTERNAL_POLRI'::text]))
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_satker_profiles
-- Live row estimate: ~0 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_satker_profiles" (
    "id" bigint DEFAULT nextval('bdb_satker_profiles_id_seq'::regclass) NOT NULL,
    "satker_master_id" bigint,
    "satker_key" text NOT NULL,
    "alamat" text,
    "provinsi" text,
    "kabupaten_kota" text,
    "kecamatan" text,
    "latitude" numeric(12,8),
    "longitude" numeric(12,8),
    "jumlah_penduduk" bigint,
    "luas_wilayah" numeric(14,2),
    "telepon" text,
    "email" text,
    "website" text,
    "keterangan" text,
    "payload_json" jsonb,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT "bdb_satker_profiles_pkey" PRIMARY KEY (id),
    CONSTRAINT "bdb_satker_profiles_satker_key_key" UNIQUE (satker_key)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_satker_taxonomy_r11_manifest
-- Live row estimate: ~0 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_satker_taxonomy_r11_manifest" (
    "run_id" text NOT NULL,
    "package_sha256" text NOT NULL,
    "source_fingerprint" text NOT NULL,
    "protected_fingerprint" text NOT NULL,
    "classification_counts" jsonb NOT NULL,
    "applied_at" timestamp with time zone DEFAULT clock_timestamp() NOT NULL,
    "verified_at" timestamp with time zone,
    "rolled_back_at" timestamp with time zone,
    CONSTRAINT "bdb_satker_taxonomy_r11_manifest_pkey" PRIMARY KEY (run_id),
    CONSTRAINT "bdb_satker_taxonomy_r11_manifest_package_sha256_check" CHECK (package_sha256 ~ '^[0-9a-f]{64}$'::text),
    CONSTRAINT "bdb_satker_taxonomy_r11_manifest_protected_fingerprint_check" CHECK (protected_fingerprint ~ '^[0-9a-f]{32}$'::text),
    CONSTRAINT "bdb_satker_taxonomy_r11_manifest_source_fingerprint_check" CHECK (source_fingerprint ~ '^[0-9a-f]{32}$'::text)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_schema_migrations
-- Live row estimate: ~87 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_schema_migrations" (
    "filename" text NOT NULL,
    "applied_at" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "bdb_schema_migrations_pkey" PRIMARY KEY (filename)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_social_bookmarks
-- Live row estimate: ~0 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_social_bookmarks" (
    "id" bigint DEFAULT nextval('bdb_social_bookmarks_id_seq'::regclass) NOT NULL,
    "post_id" bigint NOT NULL,
    "user_id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT now(),
    CONSTRAINT "bdb_social_bookmarks_pkey" PRIMARY KEY (id),
    CONSTRAINT "uq_user_post_bookmark" UNIQUE (user_id, post_id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_social_comments
-- Live row estimate: ~23 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_social_comments" (
    "id" bigint DEFAULT nextval('bdb_social_comments_id_seq'::regclass) NOT NULL,
    "post_id" bigint NOT NULL,
    "user_id" bigint NOT NULL,
    "parent_id" bigint,
    "content" text NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "bdb_social_comments_pkey" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_social_notifications
-- Live row estimate: ~104 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_social_notifications" (
    "id" bigint DEFAULT nextval('bdb_social_notifications_id_seq'::regclass) NOT NULL,
    "recipient_id" bigint NOT NULL,
    "sender_id" bigint NOT NULL,
    "category" character varying(20) DEFAULT 'social'::character varying NOT NULL,
    "type" character varying(30) NOT NULL,
    "post_id" bigint,
    "title" text NOT NULL,
    "message" text NOT NULL,
    "is_read" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "bdb_social_notifications_pkey" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_social_posts
-- Live row estimate: ~44 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_social_posts" (
    "id" bigint DEFAULT nextval('bdb_social_posts_id_seq'::regclass) NOT NULL,
    "author_id" bigint NOT NULL,
    "audience_type" character varying(20) DEFAULT 'public'::character varying NOT NULL,
    "target_satker_ids" bigint[] DEFAULT '{}'::bigint[],
    "content" text NOT NULL,
    "media_urls" jsonb DEFAULT '[]'::jsonb,
    "case_lp_ids" text[] DEFAULT '{}'::text[],
    "reaction_counts" jsonb DEFAULT '{"fire": 0, "like": 0, "respect": 0, "applause": 0, "insightful": 0}'::jsonb,
    "repost_count" integer DEFAULT 0,
    "view_count" integer DEFAULT 0,
    "is_official_jukrah" boolean DEFAULT false,
    "is_pinned" boolean DEFAULT false,
    "status" character varying(20) DEFAULT 'active'::character varying,
    "parent_post_id" bigint,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
    "is_edited" boolean DEFAULT false,
    CONSTRAINT "bdb_social_posts_pkey" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_social_reactions
-- Live row estimate: ~91 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_social_reactions" (
    "id" bigint DEFAULT nextval('bdb_social_reactions_id_seq'::regclass) NOT NULL,
    "post_id" bigint NOT NULL,
    "user_id" bigint NOT NULL,
    "reaction_type" character varying(20) DEFAULT 'like'::character varying NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "bdb_social_reactions_pkey" PRIMARY KEY (id),
    CONSTRAINT "uq_post_user_reaction" UNIQUE (post_id, user_id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_social_read_receipts
-- Live row estimate: ~6 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_social_read_receipts" (
    "id" bigint DEFAULT nextval('bdb_social_read_receipts_id_seq'::regclass) NOT NULL,
    "post_id" bigint NOT NULL,
    "satker_id" bigint NOT NULL,
    "user_id" bigint NOT NULL,
    "acknowledged_at" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "bdb_social_read_receipts_pkey" PRIMARY KEY (id),
    CONSTRAINT "uq_post_user_read" UNIQUE (post_id, user_id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_status_master
-- Live row estimate: ~11 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_status_master" (
    "id" bigint DEFAULT nextval('bdb_status_master_id_seq'::regclass) NOT NULL,
    "code" text NOT NULL,
    "nama" text NOT NULL,
    "urutan" integer DEFAULT 0 NOT NULL,
    "kategori" text DEFAULT 'CT'::text NOT NULL,
    CONSTRAINT "bdb_status_master_pkey" PRIMARY KEY (id),
    CONSTRAINT "bdb_status_master_code_key" UNIQUE (code)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_status_override_log
-- Live row estimate: ~84 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_status_override_log" (
    "id" bigint DEFAULT nextval('bdb_status_override_log_id_seq'::regclass) NOT NULL,
    "lp_id" bigint NOT NULL,
    "from_status_id" bigint,
    "to_status_id" bigint,
    "alasan" text,
    "created_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT "bdb_status_override_log_pkey" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.bdb_system_settings
-- Live row estimate: ~10 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."bdb_system_settings" (
    "key" text NOT NULL,
    "value" text,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_by" bigint,
    CONSTRAINT "bdb_system_settings_pkey" PRIMARY KEY (key)
);

-- ----------------------------------------------------------------------------
-- Table: public.cm_agama
-- Live row estimate: ~18 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."cm_agama" (
    "id" bigint DEFAULT nextval('cm_agama_id_seq'::regclass) NOT NULL,
    "name" character varying(255),
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "PK_1fc18eb196bfc88fd9310e9e451" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.cm_desa
-- Live row estimate: ~82,951 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."cm_desa" (
    "code" bigint DEFAULT nextval('cm_desa_code_seq'::regclass) NOT NULL,
    "name" character varying(255),
    "singkatan" character varying(255),
    "puskarda_kode" character varying(255),
    "status_aktif" boolean DEFAULT true NOT NULL,
    "status" character varying(1) DEFAULT 'A'::character varying NOT NULL,
    "tanggal_update" timestamp without time zone,
    "kecamatanCode" bigint,
    "kabupatenCode" bigint,
    "provinsiCode" bigint,
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "PK_be401103ff47f0fcac923902d29" PRIMARY KEY (code)
);

-- ----------------------------------------------------------------------------
-- Table: public.cm_golongan_kamtibmas
-- Live row estimate: ~4 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."cm_golongan_kamtibmas" (
    "id" bigint DEFAULT nextval('cm_golongan_kamtibmas_id_seq'::regclass) NOT NULL,
    "name" character varying(255),
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "PK_77440b8b8b1c388851bd7c4f334" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.cm_golongan_kejahatan
-- Live row estimate: ~5 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."cm_golongan_kejahatan" (
    "id" bigint DEFAULT nextval('cm_golongan_kejahatan_id_seq'::regclass) NOT NULL,
    "name" character varying(255),
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "cm_golongan_kejahatan_pkey" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.cm_iccs_kategori
-- Live row estimate: ~11 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."cm_iccs_kategori" (
    "id" bigint DEFAULT nextval('cm_iccs_kategori_id_seq'::regclass) NOT NULL,
    "kode" integer NOT NULL,
    "nama" text NOT NULL,
    "keterangan" text,
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "cm_iccs_kategori_pkey" PRIMARY KEY (id),
    CONSTRAINT "cm_iccs_kategori_kode_key" UNIQUE (kode)
);

-- ----------------------------------------------------------------------------
-- Table: public.cm_jenis_barang_bukti
-- Live row estimate: ~1,005 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."cm_jenis_barang_bukti" (
    "id" bigint DEFAULT nextval('cm_jenis_barang_bukti_id_seq'::regclass) NOT NULL,
    "kelompok" character varying(255),
    "satuan" character varying(255),
    "kode" character varying(255),
    "jenis" character varying(255),
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "PK_e8b8c166dae818fccfb15301974" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.cm_jenis_kejahatan
-- Live row estimate: ~413 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."cm_jenis_kejahatan" (
    "id" bigint DEFAULT nextval('cm_jenis_kejahatan_id_seq'::regclass) NOT NULL,
    "keterangan" text,
    "street_crime" boolean,
    "id_sub_golongan" integer,
    "sort" integer,
    "atensi_pimpinan" integer,
    "nomor" character varying(255),
    "pasal_mapping" text,
    "id_uu" integer,
    "pasal" character varying(255),
    "kasus_menojol" boolean DEFAULT false,
    "status_aktif" boolean DEFAULT false,
    "id_emp" integer,
    "kasus_menonjol" boolean DEFAULT false,
    "subGolonganKamtibmasId" bigint,
    "kategoriLpId" bigint,
    "typeKejahatanId" bigint,
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    "iccsKategoriId" bigint,
    "golonganKejahatanId" bigint,
    CONSTRAINT "PK_44769d9218240f67aaf86ada249" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.cm_jenis_kejahatan_undang_undang_cm_undang_undang
-- Live row estimate: ~491 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."cm_jenis_kejahatan_undang_undang_cm_undang_undang" (
    "cmJenisKejahatanId" bigint NOT NULL,
    "cmUndangUndangId" bigint NOT NULL,
    CONSTRAINT "PK_ed59b2fe6ce2b703dabc0e924bc" PRIMARY KEY ("cmJenisKejahatanId", "cmUndangUndangId")
);

-- ----------------------------------------------------------------------------
-- Table: public.cm_jenis_kelamin
-- Live row estimate: ~4 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."cm_jenis_kelamin" (
    "id" bigint DEFAULT nextval('cm_jenis_kelamin_id_seq'::regclass) NOT NULL,
    "name" character varying(255),
    "code" character varying(255),
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "PK_aa9ff3fd56d3d55185749c2c66c" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.cm_kabupaten
-- Live row estimate: ~569 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."cm_kabupaten" (
    "code" bigint DEFAULT nextval('cm_kabupaten_code_seq'::regclass) NOT NULL,
    "name" character varying(255) NOT NULL,
    "ibukota" character varying(255),
    "puskarda_kode" character varying(255),
    "singkatan" character varying(255),
    "status_aktif" boolean DEFAULT true NOT NULL,
    "status" character varying(1) DEFAULT 'A'::character varying NOT NULL,
    "provinsiCode" bigint,
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "PK_646c14e21168c1e623699e70012" PRIMARY KEY (code)
);

-- ----------------------------------------------------------------------------
-- Table: public.cm_kategori_lokasi
-- Live row estimate: ~217 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."cm_kategori_lokasi" (
    "id" bigint DEFAULT nextval('cm_kategori_lokasi_id_seq'::regclass) NOT NULL,
    "name" character varying(255),
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "PK_ef2808745dbe11ee49da9942e4f" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.cm_kecamatann
-- Live row estimate: ~7,551 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."cm_kecamatann" (
    "code" bigint DEFAULT nextval('cm_kecamatann_code_seq'::regclass) NOT NULL,
    "name" character varying(255) NOT NULL,
    "puskarda_kode" character varying(255),
    "singkatan" character varying(255),
    "status_aktif" boolean DEFAULT true NOT NULL,
    "status" character varying(1) DEFAULT 'A'::character varying NOT NULL,
    "tanggal_update" timestamp without time zone,
    "kabupatenCode" bigint,
    "provinsiCode" bigint,
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "PK_37fa6f914adf70088f812760336" PRIMARY KEY (code)
);

-- ----------------------------------------------------------------------------
-- Table: public.cm_kewarganegaraan
-- Live row estimate: ~74 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."cm_kewarganegaraan" (
    "id" bigint DEFAULT nextval('cm_kewarganegaraan_id_seq'::regclass) NOT NULL,
    "name" character varying(255),
    "code" character varying(255),
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "PK_ae86768db8ec07abb2dded3c997" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.cm_modus_operandi
-- Live row estimate: ~147 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."cm_modus_operandi" (
    "id" bigint DEFAULT nextval('cm_modus_operandi_id_seq'::regclass) NOT NULL,
    "name" character varying(255),
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "PK_4c1aded0b1365312a952a08aee6" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.cm_motif_kejahatan
-- Live row estimate: ~23 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."cm_motif_kejahatan" (
    "id" bigint DEFAULT nextval('cm_motif_kejahatan_id_seq'::regclass) NOT NULL,
    "name" character varying(255),
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "PK_741474a7ce873110dc602dc0052" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.cm_pasal
-- Live row estimate: ~2,508 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."cm_pasal" (
    "id" bigint DEFAULT nextval('cm_pasal_id_seq'::regclass) NOT NULL,
    "pasal" character varying(255),
    "jenisKejahatanId" bigint,
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "PK_bbc272ce4eb3f735498998841a1" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.cm_pekerjaan
-- Live row estimate: ~2,140 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."cm_pekerjaan" (
    "id" bigint DEFAULT nextval('cm_pekerjaan_id_seq'::regclass) NOT NULL,
    "name" character varying(255),
    "code" character varying(255),
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "PK_c2f7b63f184f42e1a144c0c4d1f" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.cm_pendidikan
-- Live row estimate: ~16 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."cm_pendidikan" (
    "id" bigint DEFAULT nextval('cm_pendidikan_id_seq'::regclass) NOT NULL,
    "name" character varying(255),
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "PK_15dd2084aedf9cd77f66593394b" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.cm_polda
-- Live row estimate: ~37 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."cm_polda" (
    "code" character varying(50) NOT NULL,
    "nama" character varying(255),
    "status" character varying(255),
    "alamat" text,
    "telpon" character varying(255),
    "nrp_kepala" character varying(255),
    "lat" numeric(15,6),
    "lon" numeric(15,6),
    "singkat" character varying(255),
    "abbr" character varying(255),
    "jml_penduduk" bigint,
    "is_sp2hp_online" boolean,
    "kode_kota" integer,
    "kode_depkeu" character varying(255),
    "kode_pusiknas" character varying(255),
    "kode_polda_new" character varying(255),
    "polda_polisiku" character varying(255),
    "siaga_a_nama" character varying(255),
    "siaga_a_pangkat" character varying(255),
    "siaga_a_nrp" bigint,
    "siaga_b_nama" character varying(255),
    "siaga_b_pangkat" character varying(255),
    "siaga_b_nrp" bigint,
    "siaga_c_nama" character varying(255),
    "siaga_c_pangkat" character varying(255),
    "siaga_c_nrp" bigint,
    "alamat_web" character varying(255),
    "luas_wilayah" bigint,
    "jml_pers_dsp" bigint,
    "jml_pers_riil" bigint,
    "jml_kel" bigint,
    "jml_desa" bigint,
    "status_aktif" boolean,
    "provinsiCode" bigint,
    "kabupatenCode" bigint,
    "kecamatanCode" bigint,
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "PK_8dd630f158c1a02752d1165b452" PRIMARY KEY (code)
);

-- ----------------------------------------------------------------------------
-- Table: public.cm_polres
-- Live row estimate: ~521 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."cm_polres" (
    "code" character varying(255) NOT NULL,
    "polres_polisiku" character varying(255),
    "nrp_kepala" character varying(255),
    "telpon" character varying(255),
    "lat" numeric(15,6),
    "lon" numeric(15,6),
    "kode_kota" character varying(255),
    "kode_depkeu" character varying(255),
    "kode_pusiknas" character varying(255),
    "kode_polres_new" character varying(255),
    "kode_polda_new" character varying(255),
    "alamat" text,
    "nama" character varying(255),
    "jml_penduduk" bigint,
    "is_sp2hp_online" boolean,
    "jml_pers_riil" bigint,
    "jml_pers_dsp" bigint,
    "jml_kel" bigint,
    "jml_desa" bigint,
    "status_aktif" boolean,
    "poldaCode" character varying(50),
    "provinsiCode" bigint,
    "kabupatenCode" bigint,
    "kecamatanCode" bigint,
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "PK_b7574624c34e940ef5a93ad249d" PRIMARY KEY (code)
);

-- ----------------------------------------------------------------------------
-- Table: public.cm_polsek
-- Live row estimate: ~5,091 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."cm_polsek" (
    "code" character varying(50) NOT NULL,
    "polsek_polisiku" character varying(255),
    "kode_polsek_new" character varying(255),
    "kode_kota" character varying(255),
    "alamat" text,
    "nama" character varying(255),
    "jml_penduduk" bigint,
    "is_penerima_lp" boolean,
    "is_sp2hp_online" boolean,
    "jml_pers_riil" bigint,
    "jml_pers_dsp" bigint,
    "jml_kel" bigint,
    "jml_desa" bigint,
    "status_aktif" boolean,
    "lat" numeric(15,6),
    "lon" numeric(15,6),
    "luas_wilayah" double precision,
    "telpon" character varying(255),
    "alamat_web" character varying(255),
    "nrp_kepala" character varying(255),
    "kode_polda_new" character varying(255),
    "kode_depkeu" character varying(255),
    "kode_pusiknas" character varying(255),
    "polresCode" character varying(255),
    "poldaCode" character varying(50),
    "provinsiCode" bigint,
    "kabupatenCode" bigint,
    "kecamatanCode" bigint,
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "PK_236e31fe8d1704340b1faddc0e3" PRIMARY KEY (code)
);

-- ----------------------------------------------------------------------------
-- Table: public.cm_provinsi
-- Live row estimate: ~37 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."cm_provinsi" (
    "code" bigint DEFAULT nextval('cm_provinsi_code_seq'::regclass) NOT NULL,
    "name" character varying(255) NOT NULL,
    "singkatan" character varying(255),
    "puskarda_kode" character varying(255),
    "status_aktif" boolean DEFAULT true NOT NULL,
    "status" character varying(1) DEFAULT 'A'::character varying NOT NULL,
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "PK_6b5c85a2ba9b0b02747aae5ba07" PRIMARY KEY (code)
);

-- ----------------------------------------------------------------------------
-- Table: public.cm_sub_golongan_kamtibmas
-- Live row estimate: ~18 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."cm_sub_golongan_kamtibmas" (
    "id" bigint DEFAULT nextval('cm_sub_golongan_kamtibmas_id_seq'::regclass) NOT NULL,
    "name" character varying(255),
    "golonganKamtibmasId" bigint,
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "PK_1eff8cd9dbb4a0e1ade6b76e24b" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.cm_suku
-- Live row estimate: ~900 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."cm_suku" (
    "id" bigint DEFAULT nextval('cm_suku_id_seq'::regclass) NOT NULL,
    "name" character varying(255),
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "PK_fc149171522e7a6ae4ea8714797" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.cm_terlapor_status
-- Live row estimate: ~1 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."cm_terlapor_status" (
    "id" bigint DEFAULT nextval('cm_terlapor_status_id_seq'::regclass) NOT NULL,
    "name" character varying(255),
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "PK_2ce680f954999dcf567b4b0a096" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.cm_tipe_identitas
-- Live row estimate: ~9 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."cm_tipe_identitas" (
    "id" bigint DEFAULT nextval('cm_tipe_identitas_id_seq'::regclass) NOT NULL,
    "name" character varying(255),
    "code" character varying(255),
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "PK_c55d73abfe52e8f085b2807fe1a" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.cm_undang_undang
-- Live row estimate: ~367 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."cm_undang_undang" (
    "id" bigint DEFAULT nextval('cm_undang_undang_id_seq'::regclass) NOT NULL,
    "name" character varying(255),
    "deskripsi" text,
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "PK_4102a526b3a532aedc40eafbe09" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.cm_unit
-- Live row estimate: ~0 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."cm_unit" (
    "id" bigint DEFAULT nextval('cm_unit_id_seq'::regclass) NOT NULL,
    "name" character varying(255),
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    "level" character varying(255),
    CONSTRAINT "PK_e8d76e31e11f6a3a400516ef7b0" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.permission
-- Live row estimate: ~134 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."permission" (
    "id" bigint DEFAULT nextval('permission_id_seq'::regclass) NOT NULL,
    "group" character varying(255),
    "menu" character varying(255),
    "action" character varying(255),
    "access_name" character varying(255),
    "access_route" character varying(255),
    "method" character varying(255),
    "parent_menu" character varying(255),
    "form_id" character varying(255),
    "icon" character varying(255),
    "to" character varying(255),
    "hide" boolean DEFAULT false,
    "path" character varying(255),
    "parentId" bigint,
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.permission_closure
-- Live row estimate: ~175 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."permission_closure" (
    "id_ancestor" bigint NOT NULL,
    "id_descendant" bigint NOT NULL,
    CONSTRAINT "PK_17ddd758cee77e49c62fb6c80d3" PRIMARY KEY (id_ancestor, id_descendant)
);

-- ----------------------------------------------------------------------------
-- Table: public.tm_kategori_lp
-- Live row estimate: ~0 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."tm_kategori_lp" (
    "id" bigint DEFAULT nextval('tm_kategori_lp_id_seq'::regclass) NOT NULL,
    "name" character varying(255),
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "PK_5c0d8a6bd1bf744cf4e14535c05" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.tm_org
-- Live row estimate: ~1 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."tm_org" (
    "id" bigint DEFAULT nextval('tm_org_id_seq'::regclass) NOT NULL,
    "name" character varying(255),
    "path" character varying(255),
    "parent_id" bigint,
    "jumlah_penduduk" integer,
    "organisasiLevelId" bigint,
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "PK_dc594740663c657463713d6973d" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.tm_org_closure
-- Live row estimate: ~1 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."tm_org_closure" (
    "id_ancestor" bigint NOT NULL,
    "id_descendant" bigint NOT NULL,
    CONSTRAINT "PK_78e8b3f4a2dadb3950b38f13019" PRIMARY KEY (id_ancestor, id_descendant)
);

-- ----------------------------------------------------------------------------
-- Table: public.tm_org_kategori_lp_tm_kategori_lp
-- Live row estimate: ~0 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."tm_org_kategori_lp_tm_kategori_lp" (
    "tmOrgId" bigint NOT NULL,
    "tmKategoriLpId" bigint NOT NULL,
    CONSTRAINT "PK_46b9f67aff7c4067dab7b50b2e5" PRIMARY KEY ("tmOrgId", "tmKategoriLpId")
);

-- ----------------------------------------------------------------------------
-- Table: public.tm_org_level
-- Live row estimate: ~2 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."tm_org_level" (
    "id" bigint DEFAULT nextval('tm_org_level_id_seq'::regclass) NOT NULL,
    "level_name" character varying(255),
    "parent_id" bigint,
    "path" character varying(255),
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "PK_f77ae2e7c3c4ed3467c884578cb" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.tm_org_level_akses_child_tm_org_level
-- Live row estimate: ~0 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."tm_org_level_akses_child_tm_org_level" (
    "tmOrgLevelId_1" bigint NOT NULL,
    "tmOrgLevelId_2" bigint NOT NULL,
    CONSTRAINT "PK_38631a77add10e679615f92c0a6" PRIMARY KEY ("tmOrgLevelId_1", "tmOrgLevelId_2")
);

-- ----------------------------------------------------------------------------
-- Table: public.tm_org_level_closure
-- Live row estimate: ~3 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."tm_org_level_closure" (
    "id_ancestor" bigint NOT NULL,
    "id_descendant" bigint NOT NULL,
    CONSTRAINT "PK_958c7ae42f61f012d43bda02c27" PRIMARY KEY (id_ancestor, id_descendant)
);

-- ----------------------------------------------------------------------------
-- Table: public.tm_org_level_permission_permission
-- Live row estimate: ~134 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."tm_org_level_permission_permission" (
    "tmOrgLevelId" bigint NOT NULL,
    "permissionId" bigint NOT NULL,
    CONSTRAINT "PK_7bb57472f859ed66543254f4123" PRIMARY KEY ("tmOrgLevelId", "permissionId")
);

-- ----------------------------------------------------------------------------
-- Table: public.tm_org_role
-- Live row estimate: ~5 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."tm_org_role" (
    "id" bigint DEFAULT nextval('tm_org_role_id_seq'::regclass) NOT NULL,
    "role_name" character varying(255),
    "invitation_code" character varying,
    "invitation_url" character varying,
    "temporary_invitation_code" character varying,
    "organisasiId" bigint,
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "PK_829ac1de7e4a55c23bd20f95d09" PRIMARY KEY (id),
    CONSTRAINT "UQ_18f3903a55bd5717f54c408f410" UNIQUE (invitation_url),
    CONSTRAINT "UQ_3fa13ba0ecc3034f8430ab9d570" UNIQUE (temporary_invitation_code),
    CONSTRAINT "UQ_fa79b3843507bc264c74cb4a358" UNIQUE (invitation_code)
);

-- ----------------------------------------------------------------------------
-- Table: public.tm_org_role_permission_permission
-- Live row estimate: ~134 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."tm_org_role_permission_permission" (
    "tmOrgRoleId" bigint NOT NULL,
    "permissionId" bigint NOT NULL,
    CONSTRAINT "PK_2c95ace53b3877b79a3057e3a09" PRIMARY KEY ("tmOrgRoleId", "permissionId")
);

-- ----------------------------------------------------------------------------
-- Table: public.tm_type_kejahatan
-- Live row estimate: ~0 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."tm_type_kejahatan" (
    "id" bigint DEFAULT nextval('tm_type_kejahatan_id_seq'::regclass) NOT NULL,
    "name" character varying(255),
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "PK_b693ba36e956662b70e43b53f70" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.trb_dir
-- Live row estimate: ~0 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."trb_dir" (
    "id" bigint DEFAULT nextval('trb_dir_id_seq'::regclass) NOT NULL,
    "name" character varying(255),
    "status" integer DEFAULT 0 NOT NULL,
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "PK_c1e22af9d062f3d3f0e6ee10c8a" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.trb_dir_permisson
-- Live row estimate: ~0 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."trb_dir_permisson" (
    "id" bigint DEFAULT nextval('trb_dir_permisson_id_seq'::regclass) NOT NULL,
    "path" character varying(255) NOT NULL,
    "method" character varying(255) NOT NULL,
    "name" character varying(255) NOT NULL,
    "tags" character varying(255) NOT NULL,
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "PK_cd2180366aa0fbb0e99aeea162f" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.trb_dir_report
-- Live row estimate: ~0 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."trb_dir_report" (
    "id" bigint DEFAULT nextval('trb_dir_report_id_seq'::regclass) NOT NULL,
    "status" integer,
    "reportId" bigint,
    "directorateId" bigint,
    "directorateFromId" bigint,
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "PK_25d5b7ddf36c66781b2861a658f" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.trb_dir_role
-- Live row estimate: ~0 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."trb_dir_role" (
    "id" bigint DEFAULT nextval('trb_dir_role_id_seq'::regclass) NOT NULL,
    "role_name" character varying(255),
    "directorateId" bigint,
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "PK_e6a032aa8cb9c026e135d13b0d3" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.trb_dir_role_directorate_permissions_trb_dir_permisson
-- Live row estimate: ~0 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."trb_dir_role_directorate_permissions_trb_dir_permisson" (
    "trbDirRoleId" bigint NOT NULL,
    "trbDirPermissonId" bigint NOT NULL,
    CONSTRAINT "PK_c5d428f9c9247304b742123bc6d" PRIMARY KEY ("trbDirRoleId", "trbDirPermissonId")
);

-- ----------------------------------------------------------------------------
-- Table: public.trb_dir_team
-- Live row estimate: ~0 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."trb_dir_team" (
    "id" bigint DEFAULT nextval('trb_dir_team_id_seq'::regclass) NOT NULL,
    "directorateId" bigint,
    "userId" bigint,
    "directorateRoleId" bigint,
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "PK_993123fe4d2e76d7407f8f55b00" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.trb_dp_report
-- Live row estimate: ~0 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."trb_dp_report" (
    "id" bigint DEFAULT nextval('trb_dp_report_id_seq'::regclass) NOT NULL,
    "nomor" character varying(255),
    "tanggal" date,
    "pasal" character varying(255),
    "uraian_kejadian" text,
    "pelapor" character varying(255),
    "tersangka" character varying(255),
    "barang_bukti" text,
    "tujuan_penyaluran" character varying(255),
    "bukti_penyaluran" character varying(255),
    "tanggal_penyaluran" date,
    "logImportId" bigint,
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "PK_65ab1d4d18dc56d4e1624005f7f" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.trb_log_imports
-- Live row estimate: ~0 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."trb_log_imports" (
    "id" bigint DEFAULT nextval('trb_log_imports_id_seq'::regclass) NOT NULL,
    "year" integer,
    "import_date" date,
    "status" integer DEFAULT 0 NOT NULL,
    "report_file" character varying(255),
    "total_data" integer,
    "transform_data" integer,
    "duplicated_data" integer,
    "empty_row" integer,
    "duplicate_update" integer,
    "duplicate_add" integer,
    "duplicate_remove" integer,
    "createById" bigint,
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "PK_746ece0e5b008a06d09accf6bf0" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.trb_log_report
-- Live row estimate: ~0 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."trb_log_report" (
    "id" bigint DEFAULT nextval('trb_log_report_id_seq'::regclass) NOT NULL,
    "tanggal_dinyatakan" date,
    "keterangan" text,
    "status" character varying(255),
    "bukti_dinyatakan" text,
    "dokumen_bukti_dinyatakan" text,
    "jenis_distribusi" trb_log_report_jenis_distribusi_enum,
    "tujuan_distribusi" text,
    "keterangan_tambahan" text,
    "reportId" bigint,
    "directorateId" bigint,
    "reportStatusId" bigint,
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "PK_19cb0c0dae2baacc984c895bdf6" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.trb_police
-- Live row estimate: ~3,763 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."trb_police" (
    "id" bigint DEFAULT nextval('trb_police_id_seq'::regclass) NOT NULL,
    "nrp" character varying(255),
    "nama" character varying(255),
    "jenis_kelamin" character varying(255),
    "pangkat" character varying(255),
    "jabatan" character varying(255),
    "satuan" character varying(255),
    "no_hp" character varying(255),
    "email" character varying(255),
    "foto" text,
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    "social_media" jsonb DEFAULT '{}'::jsonb,
    "is_pns" boolean DEFAULT false,
    "photo_hash" character varying(64),
    "photo_updated_at" timestamp with time zone DEFAULT now(),
    CONSTRAINT "PK_94d8a200e0d9fd0193b26903f39" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.trb_report
-- Live row estimate: ~0 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."trb_report" (
    "id" bigint DEFAULT nextval('trb_report_id_seq'::regclass) NOT NULL,
    "integration_id" bigint,
    "nomor" character varying(255),
    "tanggal" date,
    "pasal" text,
    "uraian_kejadian" text,
    "pelapor" character varying(255),
    "tersangka" character varying(255),
    "barang_bukti" text,
    "tujuan_penyaluran" character varying(255),
    "bukti_penyaluran" character varying(255),
    "tanggal_penyaluran" date,
    "model_lp" character varying(255),
    "sumber" character varying(255),
    "ket_sumber" character varying(255),
    "ceklist_croscek" character varying(255),
    "status" character varying(255),
    "sumber_data" character varying(255),
    "tgl_update_penanganan" character varying(255),
    "no_sttlp" text,
    "waktu_kejadian" timestamp without time zone,
    "tempat_kejadian" text,
    "apa_terjadi" text,
    "bagaimana_terjadi" text,
    "uraian_singkat_kejadian" text,
    "id_satuan" integer,
    "id_kantor" integer,
    "lokasi" text,
    "nama_pembuat" character varying(255),
    "pangkat_pembuat" character varying(255),
    "nrp_pembuat" character varying(255),
    "nama_mengetahui" character varying(255),
    "pangkat_mengetahui" character varying(255),
    "nrp_mengetahui" character varying(255),
    "nama_penerima" character varying(255),
    "nrp_penerima" character varying(255),
    "pangkat_penerima" character varying(255),
    "telpon_penerima" character varying(255),
    "email_penerima" character varying,
    "username_penerima" character varying,
    "keterangan" text,
    "catatan_kepolisian" text,
    "ck_barang_bukti" text,
    "ck_tindakan_diambil" text,
    "ck_tindak_pidana" text,
    "kerugian" numeric(20,6),
    "pasal_mapping_tindak_pidana" text,
    "ket_pasal_kamtibmas" text,
    "pasal_kamtibmas" text,
    "street_crime" boolean DEFAULT false NOT NULL,
    "status_selesai" boolean DEFAULT false NOT NULL,
    "kasus_menonjol" boolean DEFAULT false NOT NULL,
    "status_aktif" boolean DEFAULT true NOT NULL,
    "zona_waktu" character varying,
    "g_rev_formatted_address" character varying,
    "g_rev_lat" double precision,
    "g_rev_lon" double precision,
    "pelimpahan" integer DEFAULT 0 NOT NULL,
    "dilimpahkan" integer DEFAULT 0 NOT NULL,
    "logImportId" bigint,
    "directorateId" bigint,
    "organisasiId" bigint,
    "reportStatusId" bigint,
    "kategoriLpId" bigint,
    "provinsiCode" bigint,
    "kabupatenCode" bigint,
    "kecamatanCode" bigint,
    "desaCode" bigint,
    "poldaCode" character varying(50),
    "polresCode" character varying(255),
    "polsekCode" character varying(50),
    "golonganKamtibmasId" bigint,
    "kategoriLokasiId" bigint,
    "modusOperandiId" bigint,
    "motifKejahatanId" bigint,
    "subGolonganKamtibmasId" bigint,
    "jenisKejahatanId" bigint,
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "PK_ba3152c621a003188acfc9a2bf0" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.trb_report_barang_bukti
-- Live row estimate: ~0 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."trb_report_barang_bukti" (
    "id" bigint DEFAULT nextval('trb_report_barang_bukti_id_seq'::regclass) NOT NULL,
    "jumlah" numeric(15,6),
    "jenisBarangBuktiId" bigint,
    "reportId" bigint,
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "PK_73bb237be6b84582500609e09a8" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.trb_report_excels
-- Live row estimate: ~0 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."trb_report_excels" (
    "id" bigint DEFAULT nextval('trb_report_excels_id_seq'::regclass) NOT NULL,
    "row" integer,
    "nomor_dan_tanggal" character varying(255),
    "pasal" character varying(255) NOT NULL,
    "uraian_kejadian" text,
    "pelapor" character varying(255),
    "tersangka" character varying(255),
    "barang_bukti" text,
    "tujuan_penyaluran" character varying(255),
    "bukti_penyaluran" character varying(255),
    "model_lp" character varying(255),
    "tgl_lp" character varying(255),
    "sumber" character varying(255),
    "ket_sumber" character varying(255),
    "ceklist_croscek" character varying(255),
    "status_penanganan" character varying(255),
    "tgl_update_penanganan" character varying(255),
    "logImportId" bigint,
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "PK_ebb2332de621b62d791f052814b" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.trb_report_korban
-- Live row estimate: ~0 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."trb_report_korban" (
    "id" bigint DEFAULT nextval('trb_report_korban_id_seq'::regclass) NOT NULL,
    "nomor_identitas" character varying(255),
    "nama" character varying(255),
    "tanggal_lahir" character varying(255),
    "tempat_lahir" character varying(255),
    "alamat" text,
    "kode_pos" character varying(255),
    "no_handpone" character varying(255),
    "no_telepon" character varying(255),
    "email" character varying(255),
    "media_sosial" character varying(255),
    "dokumen" character varying(255),
    "kondisi" character varying(255),
    "tipeIdentitasId" bigint,
    "jenisKelaminId" bigint,
    "agamaId" bigint,
    "provinsiCode" bigint,
    "kabupatenCode" bigint,
    "kecamatanCode" bigint,
    "desaCode" bigint,
    "kewarganegaraanId" bigint,
    "sukuId" bigint,
    "pekerjaanId" bigint,
    "pendidikanId" bigint,
    "reportId" bigint,
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "PK_e7c3be1502d30609e57d194fa74" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.trb_report_pasal
-- Live row estimate: ~0 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."trb_report_pasal" (
    "id" bigint DEFAULT nextval('trb_report_pasal_id_seq'::regclass) NOT NULL,
    "pasal" character varying(255),
    "dan_atau" character varying(255),
    "junto" character varying(255),
    "subsider" character varying(255),
    "jenisKejahatanId" bigint,
    "undangUndangId" bigint,
    "reportId" bigint,
    "pasalId" bigint,
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "PK_80699cf0dfe00d2bcd688b76a0a" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.trb_report_pelapor
-- Live row estimate: ~0 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."trb_report_pelapor" (
    "id" bigint DEFAULT nextval('trb_report_pelapor_id_seq'::regclass) NOT NULL,
    "nomor_identitas" character varying(255),
    "nama" character varying(255),
    "tanggal_lahir" character varying(255),
    "tempat_lahir" character varying(255),
    "alamat" text,
    "kode_pos" character varying(255),
    "no_handpone" character varying(255),
    "no_telepon" character varying(255),
    "email" character varying(255),
    "media_sosial" character varying(255),
    "dokumen" character varying(255),
    "tipeIdentitasId" bigint,
    "jenisKelaminId" bigint,
    "agamaId" bigint,
    "provinsiCode" bigint,
    "kabupatenCode" bigint,
    "kecamatanCode" bigint,
    "desaCode" bigint,
    "kewarganegaraanId" bigint,
    "sukuId" bigint,
    "pekerjaanId" bigint,
    "pendidikanId" bigint,
    "reportId" bigint,
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "PK_c693fa05af37f02798262f8890a" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.trb_report_saksi
-- Live row estimate: ~0 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."trb_report_saksi" (
    "id" bigint DEFAULT nextval('trb_report_saksi_id_seq'::regclass) NOT NULL,
    "nomor_identitas" character varying(255),
    "nama" character varying(255),
    "tanggal_lahir" character varying(255),
    "tempat_lahir" character varying(255),
    "alamat" text,
    "kode_pos" character varying(255),
    "no_handpone" character varying(255),
    "no_telepon" character varying(255),
    "email" character varying(255),
    "media_sosial" character varying(255),
    "dokumen" character varying(255),
    "tipeIdentitasId" bigint,
    "jenisKelaminId" bigint,
    "agamaId" bigint,
    "provinsiCode" bigint,
    "kabupatenCode" bigint,
    "kecamatanCode" bigint,
    "desaCode" bigint,
    "kewarganegaraanId" bigint,
    "sukuId" bigint,
    "pekerjaanId" bigint,
    "pendidikanId" bigint,
    "reportId" bigint,
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "PK_5808190edf8db4120c28f5617ea" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.trb_report_status
-- Live row estimate: ~0 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."trb_report_status" (
    "id" bigint DEFAULT nextval('trb_report_status_id_seq'::regclass) NOT NULL,
    "status_name" character varying(255),
    "path" character varying(255),
    "parent_id" bigint,
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "PK_96ec2bd91e7a6ce9dc3e3bdc87d" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.trb_report_status_closure
-- Live row estimate: ~0 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."trb_report_status_closure" (
    "id_ancestor" bigint NOT NULL,
    "id_descendant" bigint NOT NULL,
    CONSTRAINT "PK_6a6b7f36051ec0b69c4b8f0b845" PRIMARY KEY (id_ancestor, id_descendant)
);

-- ----------------------------------------------------------------------------
-- Table: public.trb_report_terlapor
-- Live row estimate: ~0 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."trb_report_terlapor" (
    "id" bigint DEFAULT nextval('trb_report_terlapor_id_seq'::regclass) NOT NULL,
    "nomor_identitas" character varying(255),
    "nama" character varying(255),
    "tanggal_lahir" character varying(255),
    "tempat_lahir" character varying(255),
    "alamat" text,
    "kode_pos" character varying(255),
    "no_handpone" character varying(255),
    "no_telepon" character varying(255),
    "email" character varying(255),
    "media_sosial" character varying(255),
    "dokumen" character varying(255),
    "tipeIdentitasId" bigint,
    "jenisKelaminId" bigint,
    "agamaId" bigint,
    "provinsiCode" bigint,
    "kabupatenCode" bigint,
    "kecamatanCode" bigint,
    "desaCode" bigint,
    "kewarganegaraanId" bigint,
    "sukuId" bigint,
    "pekerjaanId" bigint,
    "pendidikanId" bigint,
    "reportId" bigint,
    "terlaporStatusId" bigint,
    "created_by" bigint,
    "updated_by" bigint,
    "deleted_by" bigint,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp without time zone,
    CONSTRAINT "PK_3b595d403a4ecc258fd94130d3c" PRIMARY KEY (id)
);

-- ----------------------------------------------------------------------------
-- Table: public.user_connections
-- Live row estimate: ~3,350 rows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."user_connections" (
    "id" bigint DEFAULT nextval('user_connections_id_seq'::regclass) NOT NULL,
    "requester_id" bigint NOT NULL,
    "addressee_id" bigint NOT NULL,
    "status" connection_status_enum DEFAULT 'PENDING'::connection_status_enum NOT NULL,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "user_connections_pkey" PRIMARY KEY (id),
    CONSTRAINT "uq_connection_pair" UNIQUE (requester_id, addressee_id),
    CONSTRAINT "chk_no_self_connection" CHECK (requester_id <> addressee_id)
);

-- ============================================================================
-- 4. VIEWS (1 SQL VIEW + bdb_jukrah_view Note)
-- ============================================================================
-- Note: public.bdb_jukrah_view is persisted as a base table in production (defined in Section 3 above).

-- View: public.bdb_satker_taxonomy_r11
CREATE OR REPLACE VIEW public."bdb_satker_taxonomy_r11" AS
SELECT 'BDB_SATKER'::text AS source_table,
    s.id AS entity_id,
    s.deskripsi AS entity_name,
    s.parent_id,
    s.function_domain,
    s.organization_domain,
    s.function_domain = 'STRUCTURAL'::text AS is_structural_context,
    s.function_domain = 'INTERNAL_RESERSE'::text AND COALESCE(s.kinerja_aktif, false) AS counting_eligible
   FROM bdb_satker s
UNION ALL
 SELECT 'BDB_SATKER_MASTER'::text AS source_table,
    s.id AS entity_id,
    s.nama_satker_canonical AS entity_name,
    NULL::bigint AS parent_id,
    s.function_domain,
    s.organization_domain,
    false AS is_structural_context,
    false AS counting_eligible
   FROM bdb_satker_master s
UNION ALL
 SELECT 'BDB_SATKER_EKSTERNAL'::text AS source_table,
    s.id AS entity_id,
    s.nama AS entity_name,
    NULL::bigint AS parent_id,
    s.function_domain,
    s.organization_domain,
    false AS is_structural_context,
    false AS counting_eligible
   FROM bdb_satker_eksternal s;

-- ============================================================================
-- 5. FOREIGN KEY CONSTRAINTS (251 CONSTRAINTS)
-- ============================================================================

ALTER TABLE ONLY public."ac_judol" ADD CONSTRAINT "FK_22c97b8e18ef02bfcfd0f3b9c6e" FOREIGN KEY ("pasalId") REFERENCES cm_pasal(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."ac_judol" ADD CONSTRAINT "FK_7fb70d2bb12d2a8715d9c3b0a47" FOREIGN KEY ("poldaCode") REFERENCES cm_polda(code) ON DELETE SET NULL;
ALTER TABLE ONLY public."an_kasus_menonjol" ADD CONSTRAINT "FK_4f81310b7d661137fa79d36f7a2" FOREIGN KEY ("organisasiId") REFERENCES tm_org(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."an_kasus_menonjol" ADD CONSTRAINT "FK_526a6be73e16e3f3e454a3f18dc" FOREIGN KEY ("reportId") REFERENCES trb_report(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."auth_devices" ADD CONSTRAINT "FK_6896ad136b9b5e7ce9fa37ec159" FOREIGN KEY ("userId") REFERENCES auth_users(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."auth_passkeys" ADD CONSTRAINT "auth_passkeys_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth_users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."auth_role_permission_permission" ADD CONSTRAINT "FK_3a94820d2d8c300d012246d6d8e" FOREIGN KEY ("permissionId") REFERENCES permission(id);
ALTER TABLE ONLY public."auth_role_permission_permission" ADD CONSTRAINT "FK_ee8ad33ef3aad1195d448ab1acd" FOREIGN KEY ("authRoleId") REFERENCES auth_role(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public."auth_users" ADD CONSTRAINT "FK_05953837d8ed9e7583a3d841a57" FOREIGN KEY ("organisasiId") REFERENCES tm_org(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."auth_users" ADD CONSTRAINT "FK_77bfd57e3851893ebb266acbf63" FOREIGN KEY ("organisasiRoleId") REFERENCES tm_org_role(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."bdb_bulk_password_reset_item" ADD CONSTRAINT "bdb_bulk_password_reset_item_job_id_fkey" FOREIGN KEY (job_id) REFERENCES bdb_bulk_password_reset_job(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."bdb_bulk_password_reset_job" ADD CONSTRAINT "bdb_bulk_password_reset_job_started_by_fkey" FOREIGN KEY (started_by) REFERENCES auth_users(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."bdb_chat_messages" ADD CONSTRAINT "bdb_chat_messages_room_id_fkey" FOREIGN KEY (room_id) REFERENCES bdb_chat_rooms(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."bdb_distribution_letters" ADD CONSTRAINT "bdb_distribution_letters_lp_id_fkey" FOREIGN KEY (lp_id) REFERENCES bdb_lp_master(id);
ALTER TABLE ONLY public."bdb_distribution_letters" ADD CONSTRAINT "bdb_distribution_letters_tujuan_satker_id_fkey" FOREIGN KEY (tujuan_satker_id) REFERENCES bdb_satker_master(id);
ALTER TABLE ONLY public."bdb_distribution_logs" ADD CONSTRAINT "bdb_distribution_logs_distribution_letter_id_fkey" FOREIGN KEY (distribution_letter_id) REFERENCES bdb_distribution_letters(id);
ALTER TABLE ONLY public."bdb_distribution_logs" ADD CONSTRAINT "bdb_distribution_logs_from_satker_id_fkey" FOREIGN KEY (from_satker_id) REFERENCES bdb_satker_master(id);
ALTER TABLE ONLY public."bdb_distribution_logs" ADD CONSTRAINT "bdb_distribution_logs_lp_id_fkey" FOREIGN KEY (lp_id) REFERENCES bdb_lp_master(id);
ALTER TABLE ONLY public."bdb_distribution_logs" ADD CONSTRAINT "bdb_distribution_logs_to_satker_id_fkey" FOREIGN KEY (to_satker_id) REFERENCES bdb_satker_master(id);
ALTER TABLE ONLY public."bdb_document_type_master" ADD CONSTRAINT "bdb_document_type_master_dokumen_prasyarat_id_fkey" FOREIGN KEY (dokumen_prasyarat_id) REFERENCES bdb_document_type_master(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."bdb_document_type_master" ADD CONSTRAINT "bdb_document_type_master_status_prasyarat_id_fkey" FOREIGN KEY (status_prasyarat_id) REFERENCES bdb_status_master(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."bdb_document_type_master" ADD CONSTRAINT "bdb_document_type_master_status_target_id_fkey" FOREIGN KEY (status_target_id) REFERENCES bdb_status_master(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."bdb_dokumen" ADD CONSTRAINT "bdb_dokumen_document_type_id_fkey" FOREIGN KEY (document_type_id) REFERENCES bdb_document_type_master(id);
ALTER TABLE ONLY public."bdb_dokumen" ADD CONSTRAINT "bdb_dokumen_lp_id_fkey" FOREIGN KEY (lp_id) REFERENCES bdb_laporan_polisi(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."bdb_dokumen_pasal" ADD CONSTRAINT "bdb_dokumen_pasal_dokumen_id_fkey" FOREIGN KEY (dokumen_id) REFERENCES bdb_dokumen(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."bdb_dokumen_pasal" ADD CONSTRAINT "bdb_dokumen_pasal_pasal_id_fkey" FOREIGN KEY (pasal_id) REFERENCES bdb_pasal_master(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."bdb_dors_lp" ADD CONSTRAINT "bdb_dors_lp_raw_id_fkey" FOREIGN KEY (raw_id) REFERENCES bdb_dors_raw_lp(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."bdb_dors_lp_barang_bukti" ADD CONSTRAINT "bdb_dors_lp_barang_bukti_lp_id_fkey" FOREIGN KEY (lp_id) REFERENCES bdb_dors_lp(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."bdb_dors_lp_hubungan_korban_pelaku" ADD CONSTRAINT "bdb_dors_lp_hubungan_korban_pelaku_lp_id_fkey" FOREIGN KEY (lp_id) REFERENCES bdb_dors_lp(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."bdb_dors_lp_kategori_gk" ADD CONSTRAINT "bdb_dors_lp_kategori_gk_lp_id_fkey" FOREIGN KEY (lp_id) REFERENCES bdb_dors_lp(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."bdb_dors_lp_kategori_lokasi" ADD CONSTRAINT "bdb_dors_lp_kategori_lokasi_lp_id_fkey" FOREIGN KEY (lp_id) REFERENCES bdb_dors_lp(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."bdb_dors_lp_petugas_penerima" ADD CONSTRAINT "bdb_dors_lp_petugas_penerima_lp_id_fkey" FOREIGN KEY (lp_id) REFERENCES bdb_dors_lp(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."bdb_dors_lp_polda" ADD CONSTRAINT "bdb_dors_lp_polda_lp_id_fkey" FOREIGN KEY (lp_id) REFERENCES bdb_dors_lp(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."bdb_dors_lp_polres" ADD CONSTRAINT "bdb_dors_lp_polres_lp_id_fkey" FOREIGN KEY (lp_id) REFERENCES bdb_dors_lp(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."bdb_dors_lp_polsek" ADD CONSTRAINT "bdb_dors_lp_polsek_lp_id_fkey" FOREIGN KEY (lp_id) REFERENCES bdb_dors_lp(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."bdb_dors_lp_terlibat" ADD CONSTRAINT "bdb_dors_lp_terlibat_lp_id_fkey" FOREIGN KEY (lp_id) REFERENCES bdb_dors_lp(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."bdb_dors_lp_tindak_pidana" ADD CONSTRAINT "bdb_dors_lp_tindak_pidana_lp_id_fkey" FOREIGN KEY (lp_id) REFERENCES bdb_dors_lp(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."bdb_dors_lp_tkp_desa" ADD CONSTRAINT "bdb_dors_lp_tkp_desa_lp_id_fkey" FOREIGN KEY (lp_id) REFERENCES bdb_dors_lp(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."bdb_dors_lp_tkp_kecamatan" ADD CONSTRAINT "bdb_dors_lp_tkp_kecamatan_lp_id_fkey" FOREIGN KEY (lp_id) REFERENCES bdb_dors_lp(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."bdb_dors_lp_tkp_kota" ADD CONSTRAINT "bdb_dors_lp_tkp_kota_lp_id_fkey" FOREIGN KEY (lp_id) REFERENCES bdb_dors_lp(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."bdb_dors_lp_tkp_provinsi" ADD CONSTRAINT "bdb_dors_lp_tkp_provinsi_lp_id_fkey" FOREIGN KEY (lp_id) REFERENCES bdb_dors_lp(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."bdb_dors_lp_unit" ADD CONSTRAINT "bdb_dors_lp_unit_lp_id_fkey" FOREIGN KEY (lp_id) REFERENCES bdb_dors_lp(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."bdb_dors_satker_map" ADD CONSTRAINT "bdb_dors_satker_map_satker_id_fkey" FOREIGN KEY (satker_id) REFERENCES bdb_satker(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."bdb_dpo_arsip" ADD CONSTRAINT "bdb_dpo_arsip_dpo_id_fkey" FOREIGN KEY (dpo_id) REFERENCES bdb_dpo(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."bdb_kasus_menonjol" ADD CONSTRAINT "bdb_kasus_menonjol_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth_users(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."bdb_kasus_menonjol" ADD CONSTRAINT "bdb_kasus_menonjol_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES auth_users(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."bdb_kasus_menonjol_attachments" ADD CONSTRAINT "bdb_kasus_menonjol_attachments_kasus_menonjol_id_fkey" FOREIGN KEY (kasus_menonjol_id) REFERENCES bdb_kasus_menonjol(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."bdb_kasus_menonjol_lp" ADD CONSTRAINT "bdb_kasus_menonjol_lp_kasus_menonjol_id_fkey" FOREIGN KEY (kasus_menonjol_id) REFERENCES bdb_kasus_menonjol(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."bdb_kasus_menonjol_lp" ADD CONSTRAINT "bdb_kasus_menonjol_lp_lp_id_fkey" FOREIGN KEY (lp_id) REFERENCES bdb_laporan_polisi(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."bdb_kinerja_crime_group_mapping" ADD CONSTRAINT "bdb_kinerja_crime_group_mapping_jenis_kejahatan_id_fkey" FOREIGN KEY (jenis_kejahatan_id) REFERENCES cm_jenis_kejahatan(id) ON DELETE RESTRICT;
ALTER TABLE ONLY public."bdb_kinerja_crime_group_mapping" ADD CONSTRAINT "bdb_kinerja_crime_group_mapping_version_id_fkey" FOREIGN KEY (version_id) REFERENCES bdb_kinerja_crime_group_mapping_version(id) ON DELETE RESTRICT;
ALTER TABLE ONLY public."bdb_kinerja_perkara_snapshot" ADD CONSTRAINT "bdb_kinerja_perkara_snapshot_lp_id_fkey" FOREIGN KEY (lp_id) REFERENCES bdb_laporan_polisi(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."bdb_kinerja_ppappo_crime_mapping" ADD CONSTRAINT "bdb_kinerja_ppappo_crime_mapping_jenis_kejahatan_id_fkey" FOREIGN KEY (jenis_kejahatan_id) REFERENCES cm_jenis_kejahatan(id) ON DELETE RESTRICT;
ALTER TABLE ONLY public."bdb_laporan_polisi" ADD CONSTRAINT "bdb_laporan_polisi_deleted_by_fkey" FOREIGN KEY (deleted_by) REFERENCES auth_users(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."bdb_laporan_polisi" ADD CONSTRAINT "bdb_laporan_polisi_golongan_kejahatan_id_fkey" FOREIGN KEY (golongan_kejahatan_id) REFERENCES cm_golongan_kejahatan(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."bdb_laporan_polisi" ADD CONSTRAINT "bdb_laporan_polisi_jenis_kejahatan_id_fkey" FOREIGN KEY (jenis_kejahatan_id) REFERENCES cm_jenis_kejahatan(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."bdb_laporan_polisi" ADD CONSTRAINT "bdb_laporan_polisi_kategori_lokasi_id_fkey" FOREIGN KEY (kategori_lokasi_id) REFERENCES cm_kategori_lokasi(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."bdb_laporan_polisi" ADD CONSTRAINT "bdb_laporan_polisi_modus_operandi_id_fkey" FOREIGN KEY (modus_operandi_id) REFERENCES cm_modus_operandi(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."bdb_laporan_polisi" ADD CONSTRAINT "bdb_laporan_polisi_motif_kejahatan_id_fkey" FOREIGN KEY (motif_kejahatan_id) REFERENCES cm_motif_kejahatan(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."bdb_laporan_polisi" ADD CONSTRAINT "bdb_laporan_polisi_operasi_satgas_id_fkey" FOREIGN KEY (operasi_satgas_id) REFERENCES bdb_operasi_satgas(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."bdb_laporan_polisi" ADD CONSTRAINT "bdb_laporan_polisi_raw_lp_id_fkey" FOREIGN KEY (raw_lp_id) REFERENCES bdb_dors_raw_lp(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."bdb_laporan_polisi" ADD CONSTRAINT "bdb_laporan_polisi_satker_id_fkey" FOREIGN KEY (satker_id) REFERENCES bdb_satker(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."bdb_laporan_polisi" ADD CONSTRAINT "bdb_laporan_polisi_status_id_fkey" FOREIGN KEY (status_id) REFERENCES bdb_status_master(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."bdb_laporan_polisi" ADD CONSTRAINT "bdb_laporan_polisi_tkp_desa_code_fkey" FOREIGN KEY (tkp_desa_code) REFERENCES cm_desa(code) ON DELETE SET NULL;
ALTER TABLE ONLY public."bdb_laporan_polisi" ADD CONSTRAINT "bdb_laporan_polisi_tkp_kabupaten_code_fkey" FOREIGN KEY (tkp_kabupaten_code) REFERENCES cm_kabupaten(code) ON DELETE SET NULL;
ALTER TABLE ONLY public."bdb_laporan_polisi" ADD CONSTRAINT "bdb_laporan_polisi_tkp_kecamatan_code_fkey" FOREIGN KEY (tkp_kecamatan_code) REFERENCES cm_kecamatann(code) ON DELETE SET NULL;
ALTER TABLE ONLY public."bdb_laporan_polisi" ADD CONSTRAINT "bdb_laporan_polisi_tkp_provinsi_code_fkey" FOREIGN KEY (tkp_provinsi_code) REFERENCES cm_provinsi(code) ON DELETE SET NULL;
ALTER TABLE ONLY public."bdb_laporan_polisi" ADD CONSTRAINT "bdb_laporan_polisi_unit_satker_id_fkey" FOREIGN KEY (unit_satker_id) REFERENCES bdb_satker(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."bdb_lp_barang_bukti_manual" ADD CONSTRAINT "bdb_lp_barang_bukti_manual_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth_users(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."bdb_lp_barang_bukti_manual" ADD CONSTRAINT "bdb_lp_barang_bukti_manual_lp_id_fkey" FOREIGN KEY (lp_id) REFERENCES bdb_laporan_polisi(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."bdb_lp_history_logs" ADD CONSTRAINT "bdb_lp_history_logs_from_satker_id_fkey" FOREIGN KEY (from_satker_id) REFERENCES bdb_satker_master(id);
ALTER TABLE ONLY public."bdb_lp_history_logs" ADD CONSTRAINT "bdb_lp_history_logs_lp_master_id_fkey" FOREIGN KEY (lp_master_id) REFERENCES bdb_lp_master(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."bdb_lp_history_logs" ADD CONSTRAINT "bdb_lp_history_logs_to_satker_id_fkey" FOREIGN KEY (to_satker_id) REFERENCES bdb_satker_master(id);
ALTER TABLE ONLY public."bdb_lp_master" ADD CONSTRAINT "bdb_lp_master_crime_master_id_fkey" FOREIGN KEY (crime_master_id) REFERENCES bdb_crime_master(id);
ALTER TABLE ONLY public."bdb_lp_master" ADD CONSTRAINT "bdb_lp_master_raw_lp_id_fkey" FOREIGN KEY (raw_lp_id) REFERENCES bdb_dors_raw_lp(id);
ALTER TABLE ONLY public."bdb_lp_master" ADD CONSTRAINT "bdb_lp_master_satker_master_id_fkey" FOREIGN KEY (satker_master_id) REFERENCES bdb_satker_master(id);
ALTER TABLE ONLY public."bdb_lp_pelimpahan" ADD CONSTRAINT "bdb_lp_pelimpahan_dilimpahkan_oleh_fkey" FOREIGN KEY (dilimpahkan_oleh) REFERENCES auth_users(id);
ALTER TABLE ONLY public."bdb_lp_pelimpahan" ADD CONSTRAINT "bdb_lp_pelimpahan_lp_id_fkey" FOREIGN KEY (lp_id) REFERENCES bdb_laporan_polisi(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."bdb_lp_pelimpahan" ADD CONSTRAINT "bdb_lp_pelimpahan_satker_asal_id_fkey" FOREIGN KEY (satker_asal_id) REFERENCES bdb_satker(id);
ALTER TABLE ONLY public."bdb_lp_pelimpahan" ADD CONSTRAINT "bdb_lp_pelimpahan_satker_eksternal_id_fkey" FOREIGN KEY (satker_eksternal_id) REFERENCES bdb_satker_eksternal(id);
ALTER TABLE ONLY public."bdb_lp_pelimpahan" ADD CONSTRAINT "bdb_lp_pelimpahan_satker_tujuan_id_fkey" FOREIGN KEY (satker_tujuan_id) REFERENCES bdb_satker(id);
ALTER TABLE ONLY public."bdb_lp_pelimpahan_attachments" ADD CONSTRAINT "bdb_lp_pelimpahan_attachments_pelimpahan_id_fkey" FOREIGN KEY (pelimpahan_id) REFERENCES bdb_lp_pelimpahan(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."bdb_lp_pihak_manual" ADD CONSTRAINT "bdb_lp_pihak_manual_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth_users(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."bdb_lp_pihak_manual" ADD CONSTRAINT "bdb_lp_pihak_manual_lp_id_fkey" FOREIGN KEY (lp_id) REFERENCES bdb_laporan_polisi(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."bdb_lp_tindak_pidana" ADD CONSTRAINT "bdb_lp_tindak_pidana_dokumen_id_fkey" FOREIGN KEY (dokumen_id) REFERENCES bdb_dokumen(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."bdb_lp_tindak_pidana" ADD CONSTRAINT "bdb_lp_tindak_pidana_lp_id_fkey" FOREIGN KEY (lp_id) REFERENCES bdb_laporan_polisi(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."bdb_lp_tindak_pidana" ADD CONSTRAINT "bdb_lp_tindak_pidana_pasal_id_fkey" FOREIGN KEY (pasal_id) REFERENCES bdb_pasal_master(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."bdb_lp_tindak_pidana_dors" ADD CONSTRAINT "bdb_lp_tindak_pidana_dors_jenis_kejahatan_id_fkey" FOREIGN KEY (jenis_kejahatan_id) REFERENCES cm_jenis_kejahatan(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."bdb_lp_tindak_pidana_dors" ADD CONSTRAINT "bdb_lp_tindak_pidana_dors_laporan_polisi_id_fkey" FOREIGN KEY (laporan_polisi_id) REFERENCES bdb_laporan_polisi(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."bdb_lp_tindak_pidana_dors" ADD CONSTRAINT "bdb_lp_tindak_pidana_dors_undang_undang_id_fkey" FOREIGN KEY (undang_undang_id) REFERENCES cm_undang_undang(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."bdb_operasi_satgas" ADD CONSTRAINT "bdb_operasi_satgas_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth_users(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."bdb_operasi_satgas" ADD CONSTRAINT "bdb_operasi_satgas_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES auth_users(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."bdb_operasi_satgas_attachments" ADD CONSTRAINT "bdb_operasi_satgas_attachments_operasi_satgas_id_fkey" FOREIGN KEY (operasi_satgas_id) REFERENCES bdb_operasi_satgas(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."bdb_panduan_pengguna" ADD CONSTRAINT "bdb_panduan_pengguna_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth_users(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."bdb_satker" ADD CONSTRAINT "bdb_satker_parent_id_fkey" FOREIGN KEY (parent_id) REFERENCES bdb_satker(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."bdb_satker" ADD CONSTRAINT "bdb_satker_root_id_fkey" FOREIGN KEY (root_id) REFERENCES bdb_satker(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."bdb_satker_profiles" ADD CONSTRAINT "bdb_satker_profiles_satker_master_id_fkey" FOREIGN KEY (satker_master_id) REFERENCES bdb_satker_master(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."bdb_social_bookmarks" ADD CONSTRAINT "bdb_social_bookmarks_post_id_fkey" FOREIGN KEY (post_id) REFERENCES bdb_social_posts(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."bdb_social_comments" ADD CONSTRAINT "bdb_social_comments_parent_id_fkey" FOREIGN KEY (parent_id) REFERENCES bdb_social_comments(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."bdb_social_comments" ADD CONSTRAINT "bdb_social_comments_post_id_fkey" FOREIGN KEY (post_id) REFERENCES bdb_social_posts(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."bdb_social_comments" ADD CONSTRAINT "bdb_social_comments_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth_users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."bdb_social_notifications" ADD CONSTRAINT "bdb_social_notifications_post_id_fkey" FOREIGN KEY (post_id) REFERENCES bdb_social_posts(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."bdb_social_notifications" ADD CONSTRAINT "bdb_social_notifications_recipient_id_fkey" FOREIGN KEY (recipient_id) REFERENCES auth_users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."bdb_social_notifications" ADD CONSTRAINT "bdb_social_notifications_sender_id_fkey" FOREIGN KEY (sender_id) REFERENCES auth_users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."bdb_social_posts" ADD CONSTRAINT "bdb_social_posts_author_id_fkey" FOREIGN KEY (author_id) REFERENCES auth_users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."bdb_social_posts" ADD CONSTRAINT "bdb_social_posts_parent_post_id_fkey" FOREIGN KEY (parent_post_id) REFERENCES bdb_social_posts(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."bdb_social_reactions" ADD CONSTRAINT "bdb_social_reactions_post_id_fkey" FOREIGN KEY (post_id) REFERENCES bdb_social_posts(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."bdb_social_reactions" ADD CONSTRAINT "bdb_social_reactions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth_users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."bdb_social_read_receipts" ADD CONSTRAINT "bdb_social_read_receipts_post_id_fkey" FOREIGN KEY (post_id) REFERENCES bdb_social_posts(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."bdb_social_read_receipts" ADD CONSTRAINT "bdb_social_read_receipts_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth_users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."bdb_status_override_log" ADD CONSTRAINT "bdb_status_override_log_lp_id_fkey" FOREIGN KEY (lp_id) REFERENCES bdb_laporan_polisi(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."bdb_system_settings" ADD CONSTRAINT "bdb_system_settings_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES auth_users(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."cm_desa" ADD CONSTRAINT "FK_65de5581c0f1a8722f736968011" FOREIGN KEY ("kabupatenCode") REFERENCES cm_kabupaten(code) ON DELETE SET NULL;
ALTER TABLE ONLY public."cm_desa" ADD CONSTRAINT "FK_b22b42ec4c37b36cd72e5f3b03e" FOREIGN KEY ("kecamatanCode") REFERENCES cm_kecamatann(code) ON DELETE SET NULL;
ALTER TABLE ONLY public."cm_desa" ADD CONSTRAINT "FK_d0be8489534673dc43f85a5c499" FOREIGN KEY ("provinsiCode") REFERENCES cm_provinsi(code) ON DELETE SET NULL;
ALTER TABLE ONLY public."cm_jenis_kejahatan" ADD CONSTRAINT "FK_04691f54a77b539c6b24b528c1e" FOREIGN KEY ("typeKejahatanId") REFERENCES tm_type_kejahatan(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."cm_jenis_kejahatan" ADD CONSTRAINT "FK_66d050253b227b5f04c4ef48361" FOREIGN KEY ("kategoriLpId") REFERENCES tm_kategori_lp(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."cm_jenis_kejahatan" ADD CONSTRAINT "FK_97b4df2daa924738f76eaa61f32" FOREIGN KEY ("subGolonganKamtibmasId") REFERENCES cm_sub_golongan_kamtibmas(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."cm_jenis_kejahatan" ADD CONSTRAINT "cm_jenis_kejahatan_golonganKejahatanId_fkey" FOREIGN KEY ("golonganKejahatanId") REFERENCES cm_golongan_kejahatan(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."cm_jenis_kejahatan" ADD CONSTRAINT "cm_jenis_kejahatan_iccsKategoriId_fkey" FOREIGN KEY ("iccsKategoriId") REFERENCES cm_iccs_kategori(id);
ALTER TABLE ONLY public."cm_jenis_kejahatan_undang_undang_cm_undang_undang" ADD CONSTRAINT "FK_244334ac3d84f5076a5fe91b294" FOREIGN KEY ("cmUndangUndangId") REFERENCES cm_undang_undang(id);
ALTER TABLE ONLY public."cm_jenis_kejahatan_undang_undang_cm_undang_undang" ADD CONSTRAINT "FK_885b0d23a962874dc2cfc7a5a40" FOREIGN KEY ("cmJenisKejahatanId") REFERENCES cm_jenis_kejahatan(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public."cm_kabupaten" ADD CONSTRAINT "FK_9a84ad9168b220a7e9084c9387e" FOREIGN KEY ("provinsiCode") REFERENCES cm_provinsi(code) ON DELETE SET NULL;
ALTER TABLE ONLY public."cm_kecamatann" ADD CONSTRAINT "FK_0352174ef11852cce9f13efe245" FOREIGN KEY ("kabupatenCode") REFERENCES cm_kabupaten(code) ON DELETE SET NULL;
ALTER TABLE ONLY public."cm_kecamatann" ADD CONSTRAINT "FK_0d41f702d8015691245b7b4d083" FOREIGN KEY ("provinsiCode") REFERENCES cm_provinsi(code) ON DELETE SET NULL;
ALTER TABLE ONLY public."cm_pasal" ADD CONSTRAINT "FK_38df986186c8255c2b266340b20" FOREIGN KEY ("jenisKejahatanId") REFERENCES cm_jenis_kejahatan(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."cm_polda" ADD CONSTRAINT "FK_356b6e65bffdd28224bb3d1ff53" FOREIGN KEY ("kecamatanCode") REFERENCES cm_kecamatann(code) ON DELETE SET NULL;
ALTER TABLE ONLY public."cm_polda" ADD CONSTRAINT "FK_a3e86ea0280c6d5b2cafb34f462" FOREIGN KEY ("provinsiCode") REFERENCES cm_provinsi(code) ON DELETE SET NULL;
ALTER TABLE ONLY public."cm_polda" ADD CONSTRAINT "FK_c7e6ca543b72682f4c2dc1850cc" FOREIGN KEY ("kabupatenCode") REFERENCES cm_kabupaten(code) ON DELETE SET NULL;
ALTER TABLE ONLY public."cm_polres" ADD CONSTRAINT "FK_9d4a869e20443096ef2857b4cf6" FOREIGN KEY ("poldaCode") REFERENCES cm_polda(code) ON DELETE SET NULL;
ALTER TABLE ONLY public."cm_polres" ADD CONSTRAINT "FK_b57482ae8bbf2cc7a3a5e945683" FOREIGN KEY ("provinsiCode") REFERENCES cm_provinsi(code) ON DELETE SET NULL;
ALTER TABLE ONLY public."cm_polres" ADD CONSTRAINT "FK_e1eeefb24bfc7e4fd2a204ecf90" FOREIGN KEY ("kecamatanCode") REFERENCES cm_kecamatann(code) ON DELETE SET NULL;
ALTER TABLE ONLY public."cm_polres" ADD CONSTRAINT "FK_ea185b73b1fe958bba88755e65f" FOREIGN KEY ("kabupatenCode") REFERENCES cm_kabupaten(code) ON DELETE SET NULL;
ALTER TABLE ONLY public."cm_polsek" ADD CONSTRAINT "FK_35eda7bcdf4fd93504d3cf27488" FOREIGN KEY ("polresCode") REFERENCES cm_polres(code) ON DELETE SET NULL;
ALTER TABLE ONLY public."cm_polsek" ADD CONSTRAINT "FK_7810a1539591aff48f6bebd43aa" FOREIGN KEY ("provinsiCode") REFERENCES cm_provinsi(code) ON DELETE SET NULL;
ALTER TABLE ONLY public."cm_polsek" ADD CONSTRAINT "FK_ad4adcad862e6419798930ce195" FOREIGN KEY ("kecamatanCode") REFERENCES cm_kecamatann(code) ON DELETE SET NULL;
ALTER TABLE ONLY public."cm_polsek" ADD CONSTRAINT "FK_b354b901a1eedaab245d345795d" FOREIGN KEY ("poldaCode") REFERENCES cm_polda(code) ON DELETE SET NULL;
ALTER TABLE ONLY public."cm_polsek" ADD CONSTRAINT "FK_d8f4fe5459d01075e2f71f2b6d6" FOREIGN KEY ("kabupatenCode") REFERENCES cm_kabupaten(code) ON DELETE SET NULL;
ALTER TABLE ONLY public."cm_sub_golongan_kamtibmas" ADD CONSTRAINT "FK_05e9c47e8ad60e20415f14c5b10" FOREIGN KEY ("golonganKamtibmasId") REFERENCES cm_golongan_kamtibmas(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."permission" ADD CONSTRAINT "FK_41c446d29bbb76111ace88bcc59" FOREIGN KEY ("parentId") REFERENCES permission(id);
ALTER TABLE ONLY public."permission_closure" ADD CONSTRAINT "FK_13672a2e7e3e11c7edb147298a4" FOREIGN KEY (id_descendant) REFERENCES permission(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."permission_closure" ADD CONSTRAINT "FK_5a9be34c7833062e6cceb562d54" FOREIGN KEY (id_ancestor) REFERENCES permission(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."tm_org" ADD CONSTRAINT "FK_afea582b0ae56787ec7e1b6b6f1" FOREIGN KEY (parent_id) REFERENCES tm_org(id);
ALTER TABLE ONLY public."tm_org" ADD CONSTRAINT "FK_b3eb456bdbc9c0f1ff31b21bdc3" FOREIGN KEY ("organisasiLevelId") REFERENCES tm_org_level(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."tm_org_closure" ADD CONSTRAINT "FK_6d0d7e8b5adf456a844e3a4dd82" FOREIGN KEY (id_ancestor) REFERENCES tm_org(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."tm_org_closure" ADD CONSTRAINT "FK_c29f36e0e694b024de9dcc7e38d" FOREIGN KEY (id_descendant) REFERENCES tm_org(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."tm_org_kategori_lp_tm_kategori_lp" ADD CONSTRAINT "FK_19b6a9a4d5ea1de20b60589a676" FOREIGN KEY ("tmOrgId") REFERENCES tm_org(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public."tm_org_kategori_lp_tm_kategori_lp" ADD CONSTRAINT "FK_4837023dd251cc1bdd9db6774e2" FOREIGN KEY ("tmKategoriLpId") REFERENCES tm_kategori_lp(id);
ALTER TABLE ONLY public."tm_org_level" ADD CONSTRAINT "FK_fcc1f5cb0773622b3b3eb54fc42" FOREIGN KEY (parent_id) REFERENCES tm_org_level(id);
ALTER TABLE ONLY public."tm_org_level_akses_child_tm_org_level" ADD CONSTRAINT "FK_9883a0f88fa01e02c8277183556" FOREIGN KEY ("tmOrgLevelId_1") REFERENCES tm_org_level(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public."tm_org_level_akses_child_tm_org_level" ADD CONSTRAINT "FK_dc50759ca796eac367ddb588928" FOREIGN KEY ("tmOrgLevelId_2") REFERENCES tm_org_level(id);
ALTER TABLE ONLY public."tm_org_level_closure" ADD CONSTRAINT "FK_4eda63766223235fad254c9aead" FOREIGN KEY (id_descendant) REFERENCES tm_org_level(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."tm_org_level_closure" ADD CONSTRAINT "FK_87eaeb0cf5e68e90bac8b25e2ff" FOREIGN KEY (id_ancestor) REFERENCES tm_org_level(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."tm_org_level_permission_permission" ADD CONSTRAINT "FK_5be4119100144c877df5308fbce" FOREIGN KEY ("permissionId") REFERENCES permission(id);
ALTER TABLE ONLY public."tm_org_level_permission_permission" ADD CONSTRAINT "FK_a542eb80e37d04a59f859ca3357" FOREIGN KEY ("tmOrgLevelId") REFERENCES tm_org_level(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public."tm_org_role" ADD CONSTRAINT "FK_9db9b2e9724a7fee7bdc64337dc" FOREIGN KEY ("organisasiId") REFERENCES tm_org(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."tm_org_role_permission_permission" ADD CONSTRAINT "FK_2a6e1cd548dd4849fec50098ee2" FOREIGN KEY ("permissionId") REFERENCES permission(id);
ALTER TABLE ONLY public."tm_org_role_permission_permission" ADD CONSTRAINT "FK_5048a95025e1eecd5df5851317c" FOREIGN KEY ("tmOrgRoleId") REFERENCES tm_org_role(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public."trb_dir_report" ADD CONSTRAINT "FK_19e56e645255d72dc97b0331210" FOREIGN KEY ("directorateId") REFERENCES trb_dir(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_dir_report" ADD CONSTRAINT "FK_97d18309ca5aa26d275365bb56a" FOREIGN KEY ("directorateFromId") REFERENCES trb_dir(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_dir_report" ADD CONSTRAINT "FK_f5ecc0002953a060b342cfd957f" FOREIGN KEY ("reportId") REFERENCES trb_report(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_dir_role" ADD CONSTRAINT "FK_b43176d1bb537d052c0f78f063e" FOREIGN KEY ("directorateId") REFERENCES trb_dir(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_dir_role_directorate_permissions_trb_dir_permisson" ADD CONSTRAINT "FK_1ed56218d91a53dfcbc47446743" FOREIGN KEY ("trbDirPermissonId") REFERENCES trb_dir_permisson(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public."trb_dir_role_directorate_permissions_trb_dir_permisson" ADD CONSTRAINT "FK_894e910947270385cf0c42c3df8" FOREIGN KEY ("trbDirRoleId") REFERENCES trb_dir_role(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public."trb_dir_team" ADD CONSTRAINT "FK_6f8c7ab77bfbd46a9a3fc5c0fc9" FOREIGN KEY ("userId") REFERENCES auth_users(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_dir_team" ADD CONSTRAINT "FK_8eee0059aca3c03a9271321d412" FOREIGN KEY ("directorateRoleId") REFERENCES trb_dir_role(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_dir_team" ADD CONSTRAINT "FK_f5d70b88bd5e75c2e282b371227" FOREIGN KEY ("directorateId") REFERENCES trb_dir(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_dp_report" ADD CONSTRAINT "FK_613bb8506e7353568c8f96a3361" FOREIGN KEY ("logImportId") REFERENCES trb_log_imports(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_log_imports" ADD CONSTRAINT "FK_50f506dae2fcd7cb38669539277" FOREIGN KEY ("createById") REFERENCES auth_users(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_log_report" ADD CONSTRAINT "FK_20a10ccfe7f7f48e13fcb82aabe" FOREIGN KEY ("directorateId") REFERENCES trb_dir(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_log_report" ADD CONSTRAINT "FK_419cef7ee812e121eeb2f179d26" FOREIGN KEY ("reportStatusId") REFERENCES trb_report_status(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_log_report" ADD CONSTRAINT "FK_8c0e1e5ba27d949f4467a2a2c86" FOREIGN KEY ("reportId") REFERENCES trb_report(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report" ADD CONSTRAINT "FK_120a7c27902b64cb87e437fb102" FOREIGN KEY ("polsekCode") REFERENCES cm_polsek(code) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report" ADD CONSTRAINT "FK_202ea1cc9fcfc788ffa1c64e673" FOREIGN KEY ("directorateId") REFERENCES trb_dir(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report" ADD CONSTRAINT "FK_230624361aab0d25c39790d1592" FOREIGN KEY ("jenisKejahatanId") REFERENCES cm_jenis_kejahatan(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report" ADD CONSTRAINT "FK_3b5844d94b2b7ca56f0a2de31c7" FOREIGN KEY ("modusOperandiId") REFERENCES cm_modus_operandi(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report" ADD CONSTRAINT "FK_45a80c95790989d52c3ac87c0cb" FOREIGN KEY ("reportStatusId") REFERENCES trb_report_status(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report" ADD CONSTRAINT "FK_493f9e3f3dfb4076351fe7f63e2" FOREIGN KEY ("polresCode") REFERENCES cm_polres(code) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report" ADD CONSTRAINT "FK_5c46b3358258385976893b8ea2a" FOREIGN KEY ("organisasiId") REFERENCES tm_org(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report" ADD CONSTRAINT "FK_63079166368f75f555b36eca530" FOREIGN KEY ("kategoriLpId") REFERENCES tm_kategori_lp(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report" ADD CONSTRAINT "FK_6770be5e3f6e4a557d35b02e5ba" FOREIGN KEY ("provinsiCode") REFERENCES cm_provinsi(code) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report" ADD CONSTRAINT "FK_7c812916388199e66f7360ff831" FOREIGN KEY ("motifKejahatanId") REFERENCES cm_motif_kejahatan(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report" ADD CONSTRAINT "FK_7c9769005fb71d0f4bd4d1c000a" FOREIGN KEY ("subGolonganKamtibmasId") REFERENCES cm_sub_golongan_kamtibmas(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report" ADD CONSTRAINT "FK_8103ca44b446f8846c5658a8d2c" FOREIGN KEY ("desaCode") REFERENCES cm_desa(code) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report" ADD CONSTRAINT "FK_a0cdb56aaf1a4b3d6ecc04ae869" FOREIGN KEY ("logImportId") REFERENCES trb_log_imports(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report" ADD CONSTRAINT "FK_ca3f7c8b11d6d00009b745e1745" FOREIGN KEY ("golonganKamtibmasId") REFERENCES cm_golongan_kamtibmas(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report" ADD CONSTRAINT "FK_dd51f6dbaa35287de3078046c3c" FOREIGN KEY ("poldaCode") REFERENCES cm_polda(code) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report" ADD CONSTRAINT "FK_ddc66ac80da552520c2829f7c67" FOREIGN KEY ("kabupatenCode") REFERENCES cm_kabupaten(code) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report" ADD CONSTRAINT "FK_f78e5dc3d8f0c1797f175be2218" FOREIGN KEY ("kategoriLokasiId") REFERENCES cm_kategori_lokasi(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report" ADD CONSTRAINT "FK_f7a2682eff57d8fcd45344a3789" FOREIGN KEY ("kecamatanCode") REFERENCES cm_kecamatann(code) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report_barang_bukti" ADD CONSTRAINT "FK_2ae98b0561c6f11e9c8eea5269a" FOREIGN KEY ("reportId") REFERENCES trb_report(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report_barang_bukti" ADD CONSTRAINT "FK_7a6c8d2cc96cef2aaff25c7ff25" FOREIGN KEY ("jenisBarangBuktiId") REFERENCES cm_jenis_barang_bukti(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report_excels" ADD CONSTRAINT "FK_ff9c1c052c7e502cdef84d91f02" FOREIGN KEY ("logImportId") REFERENCES trb_log_imports(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report_korban" ADD CONSTRAINT "FK_132cdde30f52871d021d1856859" FOREIGN KEY ("sukuId") REFERENCES cm_suku(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report_korban" ADD CONSTRAINT "FK_143972f7eac7b2d6a4cc67bf664" FOREIGN KEY ("reportId") REFERENCES trb_report(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report_korban" ADD CONSTRAINT "FK_4187a32999bce7aae4b2449791d" FOREIGN KEY ("kewarganegaraanId") REFERENCES cm_kewarganegaraan(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report_korban" ADD CONSTRAINT "FK_4d85ce0b88d1795a31d223416a8" FOREIGN KEY ("provinsiCode") REFERENCES cm_provinsi(code) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report_korban" ADD CONSTRAINT "FK_559380a1e4f5fcb96fe80b98911" FOREIGN KEY ("jenisKelaminId") REFERENCES cm_jenis_kelamin(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report_korban" ADD CONSTRAINT "FK_66d55595f98637e5aad35e11a5c" FOREIGN KEY ("kabupatenCode") REFERENCES cm_kabupaten(code) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report_korban" ADD CONSTRAINT "FK_94fb44aebf632f2ad36efd98700" FOREIGN KEY ("pekerjaanId") REFERENCES cm_pekerjaan(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report_korban" ADD CONSTRAINT "FK_9e700edfa96ca5c71f3cf47513f" FOREIGN KEY ("agamaId") REFERENCES cm_agama(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report_korban" ADD CONSTRAINT "FK_a454a543951a8bf385725a49fa0" FOREIGN KEY ("desaCode") REFERENCES cm_desa(code) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report_korban" ADD CONSTRAINT "FK_bae80b8cd98b2d9afe320201929" FOREIGN KEY ("tipeIdentitasId") REFERENCES cm_tipe_identitas(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report_korban" ADD CONSTRAINT "FK_c730b168c1eb40afca94af53d9f" FOREIGN KEY ("pendidikanId") REFERENCES cm_pendidikan(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report_korban" ADD CONSTRAINT "FK_daa0153be509fda1f7a5c2cc2e9" FOREIGN KEY ("kecamatanCode") REFERENCES cm_kecamatann(code) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report_pasal" ADD CONSTRAINT "FK_1bbdcb025df802b411ff80b09ad" FOREIGN KEY ("reportId") REFERENCES trb_report(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report_pasal" ADD CONSTRAINT "FK_a4b2773a3e002b1193a11effe91" FOREIGN KEY ("pasalId") REFERENCES cm_pasal(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report_pasal" ADD CONSTRAINT "FK_cf8369c78ded3e2d177525665e6" FOREIGN KEY ("jenisKejahatanId") REFERENCES cm_jenis_kejahatan(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report_pasal" ADD CONSTRAINT "FK_e9715e2c47f489b2de9b736a409" FOREIGN KEY ("undangUndangId") REFERENCES cm_undang_undang(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report_pelapor" ADD CONSTRAINT "FK_202147679109ac4b90215f6373c" FOREIGN KEY ("sukuId") REFERENCES cm_suku(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report_pelapor" ADD CONSTRAINT "FK_2d9e07a306c74db821f292905f9" FOREIGN KEY ("reportId") REFERENCES trb_report(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report_pelapor" ADD CONSTRAINT "FK_5f1e655839c9363814cd938df8c" FOREIGN KEY ("tipeIdentitasId") REFERENCES cm_tipe_identitas(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report_pelapor" ADD CONSTRAINT "FK_87b29ee4a85158a20139dda7ce7" FOREIGN KEY ("kabupatenCode") REFERENCES cm_kabupaten(code) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report_pelapor" ADD CONSTRAINT "FK_924a26831540088569f59f0dd2d" FOREIGN KEY ("desaCode") REFERENCES cm_desa(code) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report_pelapor" ADD CONSTRAINT "FK_998cd47c52359d4201b0069dbc3" FOREIGN KEY ("pekerjaanId") REFERENCES cm_pekerjaan(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report_pelapor" ADD CONSTRAINT "FK_9a25c7bee29c45a2b365a319d04" FOREIGN KEY ("kecamatanCode") REFERENCES cm_kecamatann(code) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report_pelapor" ADD CONSTRAINT "FK_9b63f7740fb0174343ea4835985" FOREIGN KEY ("pendidikanId") REFERENCES cm_pendidikan(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report_pelapor" ADD CONSTRAINT "FK_c54542783ca4b05620d80906a1d" FOREIGN KEY ("provinsiCode") REFERENCES cm_provinsi(code) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report_pelapor" ADD CONSTRAINT "FK_c5ee7fc000bf014481172bb1b03" FOREIGN KEY ("agamaId") REFERENCES cm_agama(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report_pelapor" ADD CONSTRAINT "FK_f2e7abb6fc53a95af2482c5d0d0" FOREIGN KEY ("jenisKelaminId") REFERENCES cm_jenis_kelamin(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report_pelapor" ADD CONSTRAINT "FK_f7de68a2ae510d69bd345bebd6a" FOREIGN KEY ("kewarganegaraanId") REFERENCES cm_kewarganegaraan(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report_saksi" ADD CONSTRAINT "FK_069a79d1475fe2b9fb27d1b2689" FOREIGN KEY ("kabupatenCode") REFERENCES cm_kabupaten(code) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report_saksi" ADD CONSTRAINT "FK_0e6efaca2f6ece580ba8143adce" FOREIGN KEY ("tipeIdentitasId") REFERENCES cm_tipe_identitas(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report_saksi" ADD CONSTRAINT "FK_31c95ba637349e2aa7d607c1a13" FOREIGN KEY ("agamaId") REFERENCES cm_agama(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report_saksi" ADD CONSTRAINT "FK_3dd2479cb03c213b5f4d1f464bc" FOREIGN KEY ("provinsiCode") REFERENCES cm_provinsi(code) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report_saksi" ADD CONSTRAINT "FK_6106ac43db377035e31666f8f2e" FOREIGN KEY ("pekerjaanId") REFERENCES cm_pekerjaan(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report_saksi" ADD CONSTRAINT "FK_68c99c91bc37074121c8b6d1ad3" FOREIGN KEY ("kecamatanCode") REFERENCES cm_kecamatann(code) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report_saksi" ADD CONSTRAINT "FK_90717c19c93b2041a1365b06aec" FOREIGN KEY ("reportId") REFERENCES trb_report(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report_saksi" ADD CONSTRAINT "FK_9d32dda70811649e3c4f1a64672" FOREIGN KEY ("pendidikanId") REFERENCES cm_pendidikan(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report_saksi" ADD CONSTRAINT "FK_ab64efdeb6a94e0f1af75ae19d4" FOREIGN KEY ("kewarganegaraanId") REFERENCES cm_kewarganegaraan(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report_saksi" ADD CONSTRAINT "FK_ae7284eb3c363d39c70c4ac8cf7" FOREIGN KEY ("desaCode") REFERENCES cm_desa(code) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report_saksi" ADD CONSTRAINT "FK_ecaddc19ef793891ee5d2f9ff9a" FOREIGN KEY ("sukuId") REFERENCES cm_suku(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report_saksi" ADD CONSTRAINT "FK_f9f0600c1ba35ac000dced1948b" FOREIGN KEY ("jenisKelaminId") REFERENCES cm_jenis_kelamin(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report_status" ADD CONSTRAINT "FK_a38ac57c7e63db1d140ef3b8b04" FOREIGN KEY (parent_id) REFERENCES trb_report_status(id);
ALTER TABLE ONLY public."trb_report_status_closure" ADD CONSTRAINT "FK_a7bd8638bc365b8bc5783295320" FOREIGN KEY (id_descendant) REFERENCES trb_report_status(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."trb_report_status_closure" ADD CONSTRAINT "FK_f8264fb99a6a7d754c6383b7b7e" FOREIGN KEY (id_ancestor) REFERENCES trb_report_status(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."trb_report_terlapor" ADD CONSTRAINT "FK_07fded4a3daf398e34ccdfe3a2f" FOREIGN KEY ("reportId") REFERENCES trb_report(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report_terlapor" ADD CONSTRAINT "FK_14c15f5b56311317e2007328a27" FOREIGN KEY ("pendidikanId") REFERENCES cm_pendidikan(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report_terlapor" ADD CONSTRAINT "FK_265f3bec8a83c5eba852e4247dd" FOREIGN KEY ("jenisKelaminId") REFERENCES cm_jenis_kelamin(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report_terlapor" ADD CONSTRAINT "FK_455affe7ad661b0bde6e76b9756" FOREIGN KEY ("agamaId") REFERENCES cm_agama(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report_terlapor" ADD CONSTRAINT "FK_5bb81741d44df328f949297952c" FOREIGN KEY ("pekerjaanId") REFERENCES cm_pekerjaan(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report_terlapor" ADD CONSTRAINT "FK_70ee657f8bd3125ee60c47ffa4b" FOREIGN KEY ("terlaporStatusId") REFERENCES cm_terlapor_status(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report_terlapor" ADD CONSTRAINT "FK_7dcf004bd6a362ac494de727f41" FOREIGN KEY ("provinsiCode") REFERENCES cm_provinsi(code) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report_terlapor" ADD CONSTRAINT "FK_87c45319bf24b63515ef66e5048" FOREIGN KEY ("sukuId") REFERENCES cm_suku(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report_terlapor" ADD CONSTRAINT "FK_abb15c6746860a76ce5f18cb41d" FOREIGN KEY ("kecamatanCode") REFERENCES cm_kecamatann(code) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report_terlapor" ADD CONSTRAINT "FK_b3648c9d49039ca1c487579d386" FOREIGN KEY ("kewarganegaraanId") REFERENCES cm_kewarganegaraan(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report_terlapor" ADD CONSTRAINT "FK_d1fd9983d6fc862b3ee02d3a781" FOREIGN KEY ("tipeIdentitasId") REFERENCES cm_tipe_identitas(id) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report_terlapor" ADD CONSTRAINT "FK_d5721763f41469d3e4df230e0a1" FOREIGN KEY ("desaCode") REFERENCES cm_desa(code) ON DELETE SET NULL;
ALTER TABLE ONLY public."trb_report_terlapor" ADD CONSTRAINT "FK_dcf805aff7091b23317eb300374" FOREIGN KEY ("kabupatenCode") REFERENCES cm_kabupaten(code) ON DELETE SET NULL;
ALTER TABLE ONLY public."user_connections" ADD CONSTRAINT "user_connections_addressee_id_fkey" FOREIGN KEY (addressee_id) REFERENCES auth_users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."user_connections" ADD CONSTRAINT "user_connections_requester_id_fkey" FOREIGN KEY (requester_id) REFERENCES auth_users(id) ON DELETE CASCADE;

-- ============================================================================
-- 6. INDEXES (433 INDEXES)
-- ============================================================================

CREATE UNIQUE INDEX IF NOT EXISTS "PK_67645dbfed82d1b9cbbbe54b2e1" ON public.ac_judol USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_8fb3c7f27474108a6500d1653b4" ON public.an_dashboard USING btree (organisasi_path, date, kategori_id, level_path);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_5ded2c0e3e33f86dec537d0d413" ON public.an_dashboard_jenis_kejahatan USING btree (organisasi_path, date, kategori_id, level_path, jenis_kejahatan_id);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_ae6b02a53880a1ab0351e11bbab" ON public.an_dashboard_kategori_kejahatan USING btree (organisasi_path, date, kategori_id, level_path);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_c88a623d9eee2d1add5927ae96d" ON public.an_dashboard_status USING btree (organisasi_path, date, kategori_id, level_path, status_id);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_8d7e020fe4b11a1e286eb34a222" ON public.an_dashboard_type_kejahatan USING btree (organisasi_path, date, kategori_id, level_path, type_id);
CREATE INDEX IF NOT EXISTS "IDX_5b3b8e42ea73f1a04406e551da" ON public.an_kasus_menonjol USING btree (organisasi_path);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_174ac22ebd109934c0d35c7b7db" ON public.an_kasus_menonjol USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_99828d48c336a4d1d160c738637" ON public.app_synchronize USING btree (id);
CREATE INDEX IF NOT EXISTS "IDX_9c1ba0b85b582a4288f0f2056b" ON public.auth_devices USING btree (device_token);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_a65bdebf3b888127e62fc5a5ffa" ON public.auth_devices USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS auth_passkey_challenges_pkey ON public.auth_passkey_challenges USING btree (id);
CREATE INDEX IF NOT EXISTS idx_passkey_challenges_challenge ON public.auth_passkey_challenges USING btree (challenge);
CREATE INDEX IF NOT EXISTS idx_passkey_challenges_expires ON public.auth_passkey_challenges USING btree (expires_at);
CREATE UNIQUE INDEX IF NOT EXISTS auth_passkeys_credential_id_key ON public.auth_passkeys USING btree (credential_id);
CREATE UNIQUE INDEX IF NOT EXISTS auth_passkeys_pkey ON public.auth_passkeys USING btree (id);
CREATE INDEX IF NOT EXISTS idx_auth_passkeys_credential_id ON public.auth_passkeys USING btree (credential_id);
CREATE INDEX IF NOT EXISTS idx_auth_passkeys_user_id ON public.auth_passkeys USING btree (user_id);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_695d9779f1a6218ed589cb436d6" ON public.auth_role USING btree (id);
CREATE INDEX IF NOT EXISTS "IDX_3a94820d2d8c300d012246d6d8" ON public.auth_role_permission_permission USING btree ("permissionId");
CREATE INDEX IF NOT EXISTS "IDX_ee8ad33ef3aad1195d448ab1ac" ON public.auth_role_permission_permission USING btree ("authRoleId");
CREATE UNIQUE INDEX IF NOT EXISTS "PK_91974fc11fcdeefe72edb9cbc53" ON public.auth_role_permission_permission USING btree ("authRoleId", "permissionId");
CREATE UNIQUE INDEX IF NOT EXISTS auth_user_mutations_pkey ON public.auth_user_mutations USING btree (id);
CREATE INDEX IF NOT EXISTS idx_mutations_user_id ON public.auth_user_mutations USING btree (user_id);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_c88cc8077366b470dafc2917366" ON public.auth_users USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS "UQ_13d8b49e55a8b06bee6bbc828fb" ON public.auth_users USING btree (email);
CREATE UNIQUE INDEX IF NOT EXISTS auth_users_email_google_lower_uidx ON public.auth_users USING btree (lower((email_google)::text)) WHERE (email_google IS NOT NULL);
CREATE UNIQUE INDEX IF NOT EXISTS auth_users_email_polri_lower_uidx ON public.auth_users USING btree (lower((email_polri)::text)) WHERE (email_polri IS NOT NULL);
CREATE UNIQUE INDEX IF NOT EXISTS auth_users_username_lower_uidx ON public.auth_users USING btree (lower(username)) WHERE ((username IS NOT NULL) AND (username <> ''::text));
CREATE INDEX IF NOT EXISTS idx_auth_users_bdb_approval ON public.auth_users USING btree (approval_status, role_bdb, requested_role_bdb);
CREATE INDEX IF NOT EXISTS idx_auth_users_bdb_requested_scope ON public.auth_users USING btree (requested_scope_satker_id, requested_scope_satker_key);
CREATE INDEX IF NOT EXISTS idx_auth_users_bdb_scope ON public.auth_users USING btree (scope_satker_id, scope_satker_key);
CREATE UNIQUE INDEX IF NOT EXISTS idx_auth_users_callsign ON public.auth_users USING btree (lower((callsign)::text)) WHERE (callsign IS NOT NULL);
CREATE INDEX IF NOT EXISTS idx_auth_users_role_bdb ON public.auth_users USING btree (lower((role_bdb)::text));
CREATE UNIQUE INDEX IF NOT EXISTS auth_users_activity_cache_pkey ON public.auth_users_activity_cache USING btree (user_id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_anev_dashboard_snapshot_pkey ON public.bdb_anev_dashboard_snapshot USING btree (id);
CREATE INDEX IF NOT EXISTS idx_anev_dash_snap_lookup ON public.bdb_anev_dashboard_snapshot USING btree (tahun, bulan, scope_key, function_domain, organization_domain);
CREATE UNIQUE INDEX IF NOT EXISTS uidx_anev_dash_snap ON public.bdb_anev_dashboard_snapshot USING btree (tahun, bulan, scope_key, function_domain, organization_domain) NULLS NOT DISTINCT;
CREATE UNIQUE INDEX IF NOT EXISTS bdb_anev_rekap_snapshot_pkey ON public.bdb_anev_rekap_snapshot USING btree (id);
CREATE INDEX IF NOT EXISTS idx_ars_kategori ON public.bdb_anev_rekap_snapshot USING btree (kategori);
CREATE INDEX IF NOT EXISTS idx_ars_satker ON public.bdb_anev_rekap_snapshot USING btree (satker_id);
CREATE INDEX IF NOT EXISTS idx_ars_tanggal ON public.bdb_anev_rekap_snapshot USING btree (tanggal);
CREATE UNIQUE INDEX IF NOT EXISTS uidx_ars_satker_status_tgl ON public.bdb_anev_rekap_snapshot USING btree (satker_id, status_code, tanggal);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_anev_report_logs_pkey ON public.bdb_anev_report_logs USING btree (id);
CREATE INDEX IF NOT EXISTS idx_anev_report_logs_created ON public.bdb_anev_report_logs USING btree (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_anev_report_logs_satker ON public.bdb_anev_report_logs USING btree (satker_id);
CREATE INDEX IF NOT EXISTS idx_anev_report_logs_user ON public.bdb_anev_report_logs USING btree (user_id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_audit_log_pkey ON public.bdb_audit_log USING btree (id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON public.bdb_audit_log USING btree (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON public.bdb_audit_log USING btree (entity, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_outcome ON public.bdb_audit_log USING btree (outcome);
CREATE INDEX IF NOT EXISTS idx_audit_user_created ON public.bdb_audit_log USING btree (user_id, created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_barang_bukti_summary_snapshot_pkey ON public.bdb_barang_bukti_summary_snapshot USING btree (id);
CREATE INDEX IF NOT EXISTS idx_bbs_satker ON public.bdb_barang_bukti_summary_snapshot USING btree (satker_id);
CREATE INDEX IF NOT EXISTS idx_bbs_tanggal ON public.bdb_barang_bukti_summary_snapshot USING btree (tanggal);
CREATE UNIQUE INDEX IF NOT EXISTS uidx_bbs_satker_tanggal ON public.bdb_barang_bukti_summary_snapshot USING btree (satker_id, tanggal);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_broadcast_messages_pkey ON public.bdb_broadcast_messages USING btree (id);
CREATE INDEX IF NOT EXISTS idx_bdb_broadcast_active ON public.bdb_broadcast_messages USING btree (is_active, starts_at, ends_at, audience);
CREATE INDEX IF NOT EXISTS idx_bdb_broadcast_scope ON public.bdb_broadcast_messages USING btree (scope_satker_key);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_bulk_password_reset_item_pkey ON public.bdb_bulk_password_reset_item USING btree (id);
CREATE INDEX IF NOT EXISTS idx_bprj_items_job ON public.bdb_bulk_password_reset_item USING btree (job_id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_bulk_password_reset_job_pkey ON public.bdb_bulk_password_reset_job USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_chat_messages_pkey ON public.bdb_chat_messages USING btree (id);
CREATE INDEX IF NOT EXISTS idx_bdb_chat_messages_room ON public.bdb_chat_messages USING btree (room_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bdb_chat_messages_unread ON public.bdb_chat_messages USING btree (recipient_id, is_read) WHERE (is_read = false);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_chat_rooms_pkey ON public.bdb_chat_rooms USING btree (id);
CREATE INDEX IF NOT EXISTS idx_bdb_chat_rooms_last_msg ON public.bdb_chat_rooms USING btree (last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_bdb_chat_rooms_participants ON public.bdb_chat_rooms USING gin (participant_ids);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_crime_master_dors_crime_id_key ON public.bdb_crime_master USING btree (dors_crime_id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_crime_master_pkey ON public.bdb_crime_master USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_distribution_letters_nomor_surat_key ON public.bdb_distribution_letters USING btree (nomor_surat);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_distribution_letters_pkey ON public.bdb_distribution_letters USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_distribution_logs_pkey ON public.bdb_distribution_logs USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_document_type_master_code_key ON public.bdb_document_type_master USING btree (code);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_document_type_master_pkey ON public.bdb_document_type_master USING btree (id);
CREATE INDEX IF NOT EXISTS bdb_dokumen_lp_idx ON public.bdb_dokumen USING btree (lp_id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_dokumen_pkey ON public.bdb_dokumen USING btree (id);
CREATE INDEX IF NOT EXISTS bdb_dokumen_type_idx ON public.bdb_dokumen USING btree (document_type_id);
CREATE INDEX IF NOT EXISTS idx_dokumen_created_by ON public.bdb_dokumen USING btree (created_by);
CREATE INDEX IF NOT EXISTS bdb_dokumen_pasal_dok_idx ON public.bdb_dokumen_pasal USING btree (dokumen_id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_dokumen_pasal_pkey ON public.bdb_dokumen_pasal USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_dors_config_pkey ON public.bdb_dors_config USING btree (id);
CREATE INDEX IF NOT EXISTS bdb_dors_hd_applied_idx ON public.bdb_dors_history_delete USING btree (applied);
CREATE INDEX IF NOT EXISTS bdb_dors_hd_id_laporan_idx ON public.bdb_dors_history_delete USING btree (id_laporan);
CREATE INDEX IF NOT EXISTS bdb_dors_hd_no_laporan_idx ON public.bdb_dors_history_delete USING btree (no_laporan);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_dors_history_delete_dors_history_id_key ON public.bdb_dors_history_delete USING btree (dors_history_id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_dors_history_delete_pkey ON public.bdb_dors_history_delete USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_dors_lp_dors_lp_id_model_lp_key ON public.bdb_dors_lp USING btree (dors_lp_id, model_lp);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_dors_lp_pkey ON public.bdb_dors_lp USING btree (id);
CREATE INDEX IF NOT EXISTS bdb_dors_lp_barang_bukti_lp_idx ON public.bdb_dors_lp_barang_bukti USING btree (lp_id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_dors_lp_barang_bukti_pkey ON public.bdb_dors_lp_barang_bukti USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_dors_lp_hubungan_korban_pelaku_lp_id_key ON public.bdb_dors_lp_hubungan_korban_pelaku USING btree (lp_id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_dors_lp_hubungan_korban_pelaku_pkey ON public.bdb_dors_lp_hubungan_korban_pelaku USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_dors_lp_kategori_gk_lp_id_key ON public.bdb_dors_lp_kategori_gk USING btree (lp_id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_dors_lp_kategori_gk_pkey ON public.bdb_dors_lp_kategori_gk USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_dors_lp_kategori_lokasi_lp_id_key ON public.bdb_dors_lp_kategori_lokasi USING btree (lp_id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_dors_lp_kategori_lokasi_pkey ON public.bdb_dors_lp_kategori_lokasi USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_dors_lp_petugas_penerima_lp_id_key ON public.bdb_dors_lp_petugas_penerima USING btree (lp_id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_dors_lp_petugas_penerima_pkey ON public.bdb_dors_lp_petugas_penerima USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_dors_lp_polda_lp_id_key ON public.bdb_dors_lp_polda USING btree (lp_id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_dors_lp_polda_pkey ON public.bdb_dors_lp_polda USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_dors_lp_polres_lp_id_key ON public.bdb_dors_lp_polres USING btree (lp_id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_dors_lp_polres_pkey ON public.bdb_dors_lp_polres USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_dors_lp_polsek_lp_id_key ON public.bdb_dors_lp_polsek USING btree (lp_id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_dors_lp_polsek_pkey ON public.bdb_dors_lp_polsek USING btree (id);
CREATE INDEX IF NOT EXISTS bdb_dors_lp_terlibat_lp_idx ON public.bdb_dors_lp_terlibat USING btree (lp_id);
CREATE INDEX IF NOT EXISTS bdb_dors_lp_terlibat_nama_upper_idx ON public.bdb_dors_lp_terlibat USING btree (upper(TRIM(BOTH FROM nama)));
CREATE INDEX IF NOT EXISTS bdb_dors_lp_terlibat_nik_idx ON public.bdb_dors_lp_terlibat USING btree (nik);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_dors_lp_terlibat_pkey ON public.bdb_dors_lp_terlibat USING btree (id);
CREATE INDEX IF NOT EXISTS bdb_dors_lp_tindak_pidana_lp_idx ON public.bdb_dors_lp_tindak_pidana USING btree (lp_id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_dors_lp_tindak_pidana_pkey ON public.bdb_dors_lp_tindak_pidana USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_dors_lp_tkp_desa_lp_id_key ON public.bdb_dors_lp_tkp_desa USING btree (lp_id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_dors_lp_tkp_desa_pkey ON public.bdb_dors_lp_tkp_desa USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_dors_lp_tkp_kecamatan_lp_id_key ON public.bdb_dors_lp_tkp_kecamatan USING btree (lp_id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_dors_lp_tkp_kecamatan_pkey ON public.bdb_dors_lp_tkp_kecamatan USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_dors_lp_tkp_kota_lp_id_key ON public.bdb_dors_lp_tkp_kota USING btree (lp_id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_dors_lp_tkp_kota_pkey ON public.bdb_dors_lp_tkp_kota USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_dors_lp_tkp_provinsi_lp_id_key ON public.bdb_dors_lp_tkp_provinsi USING btree (lp_id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_dors_lp_tkp_provinsi_pkey ON public.bdb_dors_lp_tkp_provinsi USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_dors_lp_unit_lp_id_key ON public.bdb_dors_lp_unit USING btree (lp_id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_dors_lp_unit_pkey ON public.bdb_dors_lp_unit USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_dors_raw_lp_dors_lp_id_model_lp_key ON public.bdb_dors_raw_lp USING btree (dors_lp_id, model_lp);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_dors_raw_lp_dors_lp_id_model_lp_uidx ON public.bdb_dors_raw_lp USING btree (dors_lp_id, model_lp);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_dors_raw_lp_pkey ON public.bdb_dors_raw_lp USING btree (id);
CREATE INDEX IF NOT EXISTS idx_dors_raw_model_synced ON public.bdb_dors_raw_lp USING btree (model_lp, synced_at DESC, id DESC);
CREATE INDEX IF NOT EXISTS idx_dors_raw_synced_id ON public.bdb_dors_raw_lp USING btree (synced_at DESC, id DESC);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_dors_satker_map_key ON public.bdb_dors_satker_map USING btree (COALESCE(dors_kode_pusiknas, ''::text), lower(dors_nama), lower(COALESCE(dors_parent_nama, ''::text)), lower(COALESCE(unit_nama, ''::text)));
CREATE UNIQUE INDEX IF NOT EXISTS bdb_dors_satker_map_pkey ON public.bdb_dors_satker_map USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_dors_sync_log_pkey ON public.bdb_dors_sync_log USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_dpo_pkey ON public.bdb_dpo USING btree (id);
CREATE INDEX IF NOT EXISTS idx_bdb_dpo_jenis_kejahatan_id ON public.bdb_dpo USING btree (jenis_kejahatan_id);
CREATE INDEX IF NOT EXISTS idx_bdb_dpo_kategori ON public.bdb_dpo USING btree (kategori_kejahatan);
CREATE INDEX IF NOT EXISTS idx_bdb_dpo_lp_id ON public.bdb_dpo USING btree (lp_id);
CREATE INDEX IF NOT EXISTS idx_bdb_dpo_nama ON public.bdb_dpo USING btree (nama_dpo);
CREATE INDEX IF NOT EXISTS idx_bdb_dpo_nomor_dpo ON public.bdb_dpo USING btree (nomor_dpo);
CREATE INDEX IF NOT EXISTS idx_bdb_dpo_nomor_identitas ON public.bdb_dpo USING btree (nomor_identitas);
CREATE INDEX IF NOT EXISTS idx_bdb_dpo_nomor_lp ON public.bdb_dpo USING btree (nomor_lp);
CREATE INDEX IF NOT EXISTS idx_bdb_dpo_polda ON public.bdb_dpo USING btree (nama_polda);
CREATE INDEX IF NOT EXISTS idx_bdb_dpo_polres ON public.bdb_dpo USING btree (nama_polres);
CREATE INDEX IF NOT EXISTS idx_bdb_dpo_satker_id ON public.bdb_dpo USING btree (satker_id);
CREATE INDEX IF NOT EXISTS idx_bdb_dpo_satker_nama ON public.bdb_dpo USING btree (satker_nama);
CREATE INDEX IF NOT EXISTS idx_bdb_dpo_status ON public.bdb_dpo USING btree (status_dpo);
CREATE INDEX IF NOT EXISTS idx_bdb_dpo_tanggal ON public.bdb_dpo USING btree (tanggal_dpo);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_dpo_arsip_pkey ON public.bdb_dpo_arsip USING btree (id);
CREATE INDEX IF NOT EXISTS idx_dpo_arsip_dpo_id ON public.bdb_dpo_arsip USING btree (dpo_id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_iccs_mapping_audit_pkey ON public.bdb_iccs_mapping_audit USING btree (batch_id, jenis_kejahatan_id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_integration_client_pkey ON public.bdb_integration_client USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_integration_client_username_key ON public.bdb_integration_client USING btree (username);
CREATE INDEX IF NOT EXISTS idx_integration_client_status ON public.bdb_integration_client USING btree (status);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_jukrah_pkey ON public.bdb_jukrah USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_jukrah_view_jukrah_id_user_id_key ON public.bdb_jukrah_view USING btree (jukrah_id, user_id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_jukrah_view_pkey ON public.bdb_jukrah_view USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_kasus_atensi_pkey ON public.bdb_kasus_atensi USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_kasus_atensi_attachments_pkey ON public.bdb_kasus_atensi_attachments USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_kasus_atensi_lp_kasus_atensi_id_lp_id_key ON public.bdb_kasus_atensi_lp USING btree (kasus_atensi_id, lp_id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_kasus_atensi_lp_pkey ON public.bdb_kasus_atensi_lp USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_kasus_menonjol_pkey ON public.bdb_kasus_menonjol USING btree (id);
CREATE INDEX IF NOT EXISTS idx_kasus_menonjol_deleted ON public.bdb_kasus_menonjol USING btree (deleted_at);
CREATE INDEX IF NOT EXISTS idx_kasus_menonjol_satker ON public.bdb_kasus_menonjol USING btree (satker_id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_kasus_menonjol_attachments_pkey ON public.bdb_kasus_menonjol_attachments USING btree (id);
CREATE INDEX IF NOT EXISTS idx_kasus_menonjol_attachments_parent ON public.bdb_kasus_menonjol_attachments USING btree (kasus_menonjol_id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_kasus_menonjol_lp_kasus_menonjol_id_lp_id_key ON public.bdb_kasus_menonjol_lp USING btree (kasus_menonjol_id, lp_id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_kasus_menonjol_lp_pkey ON public.bdb_kasus_menonjol_lp USING btree (id);
CREATE INDEX IF NOT EXISTS idx_kasus_menonjol_lp_lp ON public.bdb_kasus_menonjol_lp USING btree (lp_id);
CREATE INDEX IF NOT EXISTS idx_kasus_menonjol_lp_parent ON public.bdb_kasus_menonjol_lp USING btree (kasus_menonjol_id);
CREATE INDEX IF NOT EXISTS bdb_kerma_attachments_kerma_id_idx ON public.bdb_kerma_attachments USING btree (kerma_id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_kerma_attachments_pkey ON public.bdb_kerma_attachments USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_kerma_jenis_naskah_nama_key ON public.bdb_kerma_jenis_naskah USING btree (nama);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_kerma_jenis_naskah_pkey ON public.bdb_kerma_jenis_naskah USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_kerma_master_pkey ON public.bdb_kerma_master USING btree (id);
CREATE INDEX IF NOT EXISTS idx_bdb_kerma_deleted ON public.bdb_kerma_master USING btree (deleted_at);
CREATE INDEX IF NOT EXISTS idx_bdb_kerma_status ON public.bdb_kerma_master USING btree (status);
CREATE INDEX IF NOT EXISTS idx_bdb_kerma_tahun ON public.bdb_kerma_master USING btree (tahun_data);
CREATE INDEX IF NOT EXISTS idx_bdb_kerma_tanggal_akhir ON public.bdb_kerma_master USING btree (tanggal_akhir);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_kinerja_crime_group_mapping_pkey ON public.bdb_kinerja_crime_group_mapping USING btree (id);
CREATE INDEX IF NOT EXISTS ix_kinerja_crime_group_approved_lookup ON public.bdb_kinerja_crime_group_mapping USING btree (version_id, kelompok, jenis_kejahatan_id) WHERE ((active = true) AND (decision_status = 'APPROVED'::text));
CREATE UNIQUE INDEX IF NOT EXISTS uq_kinerja_crime_group_version_crime ON public.bdb_kinerja_crime_group_mapping USING btree (version_id, jenis_kejahatan_id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_kinerja_crime_group_mapping_version_pkey ON public.bdb_kinerja_crime_group_mapping_version USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_kinerja_crime_group_mapping_version_version_code_key ON public.bdb_kinerja_crime_group_mapping_version USING btree (version_code);
CREATE UNIQUE INDEX IF NOT EXISTS uq_kinerja_crime_group_one_active_approved ON public.bdb_kinerja_crime_group_mapping_version USING btree ((1)) WHERE ((active = true) AND (status = 'APPROVED'::text));
CREATE UNIQUE INDEX IF NOT EXISTS bdb_kinerja_perkara_snapshot_pkey ON public.bdb_kinerja_perkara_snapshot USING btree (lp_id);
CREATE INDEX IF NOT EXISTS idx_kps_jatuh_tempo ON public.bdb_kinerja_perkara_snapshot USING btree (tanggal_jatuh_tempo);
CREATE INDEX IF NOT EXISTS idx_kps_jenis_kejahatan ON public.bdb_kinerja_perkara_snapshot USING btree (jenis_kejahatan_id);
CREATE INDEX IF NOT EXISTS idx_kps_mulai ON public.bdb_kinerja_perkara_snapshot USING btree (tanggal_mulai_penanganan);
CREATE INDEX IF NOT EXISTS idx_kps_satker ON public.bdb_kinerja_perkara_snapshot USING btree (satker_id);
CREATE INDEX IF NOT EXISTS idx_kps_selesai ON public.bdb_kinerja_perkara_snapshot USING btree (tanggal_selesai);
CREATE INDEX IF NOT EXISTS idx_kps_status ON public.bdb_kinerja_perkara_snapshot USING btree (status_code);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_kinerja_perkara_snapshot_meta_pkey ON public.bdb_kinerja_perkara_snapshot_meta USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_kinerja_perkara_summary_snapshot_pkey ON public.bdb_kinerja_perkara_summary_snapshot USING btree (id);
CREATE INDEX IF NOT EXISTS idx_kp_summary_snap_lookup ON public.bdb_kinerja_perkara_summary_snapshot USING btree (tahun, bulan, scope_key);
CREATE UNIQUE INDEX IF NOT EXISTS uidx_kp_summary_snap ON public.bdb_kinerja_perkara_summary_snapshot USING btree (tahun, bulan, scope_key) NULLS NOT DISTINCT;
CREATE INDEX IF NOT EXISTS bdb_kinerja_ppappo_crime_mapping_active_idx ON public.bdb_kinerja_ppappo_crime_mapping USING btree (active, jenis_kejahatan_id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_kinerja_ppappo_crime_mapping_jenis_uk ON public.bdb_kinerja_ppappo_crime_mapping USING btree (jenis_kejahatan_id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_kinerja_ppappo_crime_mapping_pkey ON public.bdb_kinerja_ppappo_crime_mapping USING btree (id);
CREATE INDEX IF NOT EXISTS bdb_laporan_polisi_deleted_idx ON public.bdb_laporan_polisi USING btree (deleted_at);
CREATE INDEX IF NOT EXISTS bdb_laporan_polisi_dilimpahkan_eksternal_idx ON public.bdb_laporan_polisi USING btree (dilimpahkan_eksternal);
CREATE INDEX IF NOT EXISTS bdb_laporan_polisi_dilimpahkan_idx ON public.bdb_laporan_polisi USING btree (sudah_dilimpahkan);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_laporan_polisi_dors_lp_id_model_lp_key ON public.bdb_laporan_polisi USING btree (dors_lp_id, model_lp);
CREATE INDEX IF NOT EXISTS bdb_laporan_polisi_golongan_kejahatan_idx ON public.bdb_laporan_polisi USING btree (golongan_kejahatan_id);
CREATE INDEX IF NOT EXISTS bdb_laporan_polisi_jk_idx ON public.bdb_laporan_polisi USING btree (jenis_kejahatan_id);
CREATE INDEX IF NOT EXISTS bdb_laporan_polisi_level_idx ON public.bdb_laporan_polisi USING btree (penanganan_level);
CREATE INDEX IF NOT EXISTS bdb_laporan_polisi_lokasi_idx ON public.bdb_laporan_polisi USING btree (kategori_lokasi_id);
CREATE INDEX IF NOT EXISTS bdb_laporan_polisi_nolap_idx ON public.bdb_laporan_polisi USING btree (lower(no_laporan));
CREATE UNIQUE INDEX IF NOT EXISTS bdb_laporan_polisi_pkey ON public.bdb_laporan_polisi USING btree (id);
CREATE INDEX IF NOT EXISTS bdb_laporan_polisi_satker_idx ON public.bdb_laporan_polisi USING btree (satker_id);
CREATE INDEX IF NOT EXISTS bdb_laporan_polisi_trim_nolap_idx ON public.bdb_laporan_polisi USING btree (TRIM(BOTH FROM no_laporan)) WHERE ((deleted_at IS NULL) AND (no_laporan IS NOT NULL));
CREATE INDEX IF NOT EXISTS bdb_laporan_polisi_unitsatker_idx ON public.bdb_laporan_polisi USING btree (unit_satker_id);
CREATE INDEX IF NOT EXISTS bdb_lp_lower_trim_nolap_idx ON public.bdb_laporan_polisi USING btree (lower(TRIM(BOTH FROM no_laporan))) WHERE (deleted_at IS NULL);
CREATE INDEX IF NOT EXISTS bdb_lp_master_linked_null_idx ON public.bdb_laporan_polisi USING btree (id) WHERE (master_data_linked_at IS NULL);
CREATE INDEX IF NOT EXISTS idx_lp_kode_pusiknas ON public.bdb_laporan_polisi USING btree (kode_pusiknas);
CREATE INDEX IF NOT EXISTS idx_lp_operasi_satgas ON public.bdb_laporan_polisi USING btree (operasi_satgas_id);
CREATE INDEX IF NOT EXISTS idx_lp_satker_id_desc ON public.bdb_laporan_polisi USING btree (satker_id, id DESC) WHERE (deleted_at IS NULL);
CREATE INDEX IF NOT EXISTS idx_lp_satker_status ON public.bdb_laporan_polisi USING btree (satker_id, status_id);
CREATE INDEX IF NOT EXISTS idx_lp_satker_tgl_desc ON public.bdb_laporan_polisi USING btree (satker_id, parse_tgl_laporan(tgl_laporan) DESC) WHERE (deleted_at IS NULL);
CREATE INDEX IF NOT EXISTS idx_lp_status ON public.bdb_laporan_polisi USING btree (status_id);
CREATE INDEX IF NOT EXISTS idx_lp_synced_at ON public.bdb_laporan_polisi USING btree (synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_lp_tanggal_selesai ON public.bdb_laporan_polisi USING btree (tanggal_selesai);
CREATE INDEX IF NOT EXISTS idx_lp_tgl_desc ON public.bdb_laporan_polisi USING btree (parse_tgl_laporan(tgl_laporan) DESC NULLS LAST, id DESC);
CREATE INDEX IF NOT EXISTS idx_lp_unit_satker_id_desc ON public.bdb_laporan_polisi USING btree (unit_satker_id, id DESC) WHERE (deleted_at IS NULL);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_lp_barang_bukti_manual_pkey ON public.bdb_lp_barang_bukti_manual USING btree (id);
CREATE INDEX IF NOT EXISTS idx_lp_bb_manual_lp ON public.bdb_lp_barang_bukti_manual USING btree (lp_id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_lp_history_logs_pkey ON public.bdb_lp_history_logs USING btree (id);
CREATE INDEX IF NOT EXISTS idx_bdb_lp_history_logs_created_at ON public.bdb_lp_history_logs USING btree (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bdb_lp_history_logs_lp_master_id ON public.bdb_lp_history_logs USING btree (lp_master_id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_lp_master_bdb_lp_id_uidx ON public.bdb_lp_master USING btree (bdb_lp_id) WHERE (bdb_lp_id IS NOT NULL);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_lp_master_dors_lp_id_model_lp_key ON public.bdb_lp_master USING btree (dors_lp_id, model_lp);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_lp_master_dors_lp_id_model_lp_uidx ON public.bdb_lp_master USING btree (dors_lp_id, model_lp);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_lp_master_pkey ON public.bdb_lp_master USING btree (id);
CREATE INDEX IF NOT EXISTS idx_bdb_lp_master_data_scope_tanggal ON public.bdb_lp_master USING btree (data_scope, tanggal_lp);
CREATE INDEX IF NOT EXISTS idx_bdb_lp_master_model_lp ON public.bdb_lp_master USING btree (model_lp);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_lp_monitoring_access_log_pkey ON public.bdb_lp_monitoring_access_log USING btree (id);
CREATE INDEX IF NOT EXISTS idx_lp_mon_access_created ON public.bdb_lp_monitoring_access_log USING btree (created_at);
CREATE INDEX IF NOT EXISTS idx_lp_mon_access_target ON public.bdb_lp_monitoring_access_log USING btree (target_satker_id);
CREATE INDEX IF NOT EXISTS idx_lp_mon_access_user ON public.bdb_lp_monitoring_access_log USING btree (user_id);
CREATE INDEX IF NOT EXISTS bdb_lp_pelimpahan_asal_idx ON public.bdb_lp_pelimpahan USING btree (satker_asal_id);
CREATE INDEX IF NOT EXISTS bdb_lp_pelimpahan_eksternal_idx ON public.bdb_lp_pelimpahan USING btree (satker_eksternal_id);
CREATE INDEX IF NOT EXISTS bdb_lp_pelimpahan_lp_idx ON public.bdb_lp_pelimpahan USING btree (lp_id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_lp_pelimpahan_pkey ON public.bdb_lp_pelimpahan USING btree (id);
CREATE INDEX IF NOT EXISTS bdb_lp_pelimpahan_tujuan_idx ON public.bdb_lp_pelimpahan USING btree (satker_tujuan_id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_lp_pelimpahan_attachments_pkey ON public.bdb_lp_pelimpahan_attachments USING btree (id);
CREATE INDEX IF NOT EXISTS idx_lp_pelimpahan_attachments_parent ON public.bdb_lp_pelimpahan_attachments USING btree (pelimpahan_id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_lp_pihak_manual_pkey ON public.bdb_lp_pihak_manual USING btree (id);
CREATE INDEX IF NOT EXISTS idx_lp_pihak_manual_lp ON public.bdb_lp_pihak_manual USING btree (lp_id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_lp_status_reconcile_log_pkey ON public.bdb_lp_status_reconcile_log USING btree (id);
CREATE INDEX IF NOT EXISTS idx_lp_status_reconcile_log_triggered_by_created_at ON public.bdb_lp_status_reconcile_log USING btree (triggered_by, created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_lp_tindak_pidana_pkey ON public.bdb_lp_tindak_pidana USING btree (id);
CREATE INDEX IF NOT EXISTS idx_lp_tp_lp ON public.bdb_lp_tindak_pidana USING btree (lp_id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_lp_tindak_pidana_dors_laporan_polisi_id_dors_tp_id_key ON public.bdb_lp_tindak_pidana_dors USING btree (laporan_polisi_id, dors_tp_id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_lp_tindak_pidana_dors_pkey ON public.bdb_lp_tindak_pidana_dors USING btree (id);
CREATE INDEX IF NOT EXISTS bdb_lp_tp_dors_lp_idx ON public.bdb_lp_tindak_pidana_dors USING btree (laporan_polisi_id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_menu_role_access_pkey ON public.bdb_menu_role_access USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_menu_role_access_role_menu_key_key ON public.bdb_menu_role_access USING btree (role, menu_key);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_notification_checkpoint_pkey ON public.bdb_notification_checkpoint USING btree (user_id, entity);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_operasi_satgas_pkey ON public.bdb_operasi_satgas USING btree (id);
CREATE INDEX IF NOT EXISTS idx_operasi_satgas_deleted ON public.bdb_operasi_satgas USING btree (deleted_at);
CREATE INDEX IF NOT EXISTS idx_operasi_satgas_jenis ON public.bdb_operasi_satgas USING btree (jenis);
CREATE INDEX IF NOT EXISTS idx_operasi_satgas_tanggal_selesai ON public.bdb_operasi_satgas USING btree (tanggal_selesai);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_operasi_satgas_attachments_pkey ON public.bdb_operasi_satgas_attachments USING btree (id);
CREATE INDEX IF NOT EXISTS idx_operasi_satgas_attachments_parent ON public.bdb_operasi_satgas_attachments USING btree (operasi_satgas_id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_operasi_satgas_jenis_kelompok_nama_key ON public.bdb_operasi_satgas_jenis USING btree (kelompok, nama);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_operasi_satgas_jenis_pkey ON public.bdb_operasi_satgas_jenis USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_panduan_pengguna_pkey ON public.bdb_panduan_pengguna USING btree (id);
CREATE INDEX IF NOT EXISTS bdb_panduan_pengguna_tipe_idx ON public.bdb_panduan_pengguna USING btree (tipe);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_pasal_master_pkey ON public.bdb_pasal_master USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_pasal_master_uidx ON public.bdb_pasal_master USING btree (lower(nomor_pasal), lower(COALESCE(uu_referensi, ''::text)));
CREATE UNIQUE INDEX IF NOT EXISTS bdb_pihak_terlibat_ranking_snapshot_pkey ON public.bdb_pihak_terlibat_ranking_snapshot USING btree (id);
CREATE INDEX IF NOT EXISTS idx_ptr_lookup ON public.bdb_pihak_terlibat_ranking_snapshot USING btree (tahun, keterlibatan, satker_id);
CREATE INDEX IF NOT EXISTS idx_ptr_tahun_keterlibatan ON public.bdb_pihak_terlibat_ranking_snapshot USING btree (tahun, keterlibatan);
CREATE INDEX IF NOT EXISTS idx_ranking_snap_lookup ON public.bdb_pihak_terlibat_ranking_snapshot USING btree (tahun, bulan, kategori_filter, satker_tier);
CREATE INDEX IF NOT EXISTS idx_ranking_snap_thn_bln ON public.bdb_pihak_terlibat_ranking_snapshot USING btree (tahun, bulan, keterlibatan, satker_tier, total_lp DESC);
CREATE INDEX IF NOT EXISTS idx_ranking_snapshot_subjek ON public.bdb_pihak_terlibat_ranking_snapshot USING btree (tahun, bulan, tipe_subjek, keterlibatan, total_lp DESC);
CREATE UNIQUE INDEX IF NOT EXISTS uq_ranking_snap_tahun_bulan_cat_nik ON public.bdb_pihak_terlibat_ranking_snapshot USING btree (tahun, COALESCE(bulan, 0), kategori_filter, nik);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_pihak_terlibat_summary_snapshot_pkey ON public.bdb_pihak_terlibat_summary_snapshot USING btree (id);
CREATE INDEX IF NOT EXISTS idx_pts_satker ON public.bdb_pihak_terlibat_summary_snapshot USING btree (satker_id);
CREATE INDEX IF NOT EXISTS idx_pts_tanggal ON public.bdb_pihak_terlibat_summary_snapshot USING btree (tanggal);
CREATE UNIQUE INDEX IF NOT EXISTS uidx_pts_satker_tanggal ON public.bdb_pihak_terlibat_summary_snapshot USING btree (satker_id, tanggal);
CREATE INDEX IF NOT EXISTS bdb_satker_desk_idx ON public.bdb_satker USING btree (lower(deskripsi));
CREATE INDEX IF NOT EXISTS bdb_satker_desk_trgm ON public.bdb_satker USING gin (upper(deskripsi) gin_trgm_ops);
CREATE INDEX IF NOT EXISTS bdb_satker_dors_kode_idx ON public.bdb_satker USING btree (dors_kode) WHERE (dors_kode IS NOT NULL);
CREATE INDEX IF NOT EXISTS bdb_satker_dors_kode_norm_idx ON public.bdb_satker USING btree (regexp_replace(replace(COALESCE(dors_kode, ''::text), chr(160), ''::text), '\s+'::text, ''::text, 'g'::text)) WHERE (dors_kode IS NOT NULL);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_satker_kode_canonical_uidx ON public.bdb_satker USING btree (kode_canonical);
CREATE INDEX IF NOT EXISTS bdb_satker_kode_norm_idx ON public.bdb_satker USING btree (regexp_replace(replace(COALESCE(kode, ''::text), chr(160), ''::text), '\s+'::text, ''::text, 'g'::text));
CREATE INDEX IF NOT EXISTS bdb_satker_parent_idx ON public.bdb_satker USING btree (parent_id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_satker_pkey ON public.bdb_satker USING btree (id);
CREATE INDEX IF NOT EXISTS bdb_satker_root_idx ON public.bdb_satker USING btree (root_id);
CREATE INDEX IF NOT EXISTS bdb_satker_taxonomy_r11_idx ON public.bdb_satker USING btree (organization_domain, function_domain) WHERE (organization_domain IS NOT NULL);
CREATE INDEX IF NOT EXISTS bdb_satker_tipe_idx ON public.bdb_satker USING btree (tipe_satker);
CREATE INDEX IF NOT EXISTS bdb_satker_urutan_idx ON public.bdb_satker USING btree (urutan);
CREATE INDEX IF NOT EXISTS idx_satker_kode ON public.bdb_satker USING btree (kode);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_satker_eksternal_pkey ON public.bdb_satker_eksternal USING btree (id);
CREATE INDEX IF NOT EXISTS idx_satker_eksternal_nama ON public.bdb_satker_eksternal USING btree (lower(nama));
CREATE UNIQUE INDEX IF NOT EXISTS bdb_satker_master_level_dors_satker_id_dors_kode_key ON public.bdb_satker_master USING btree (level, dors_satker_id, dors_kode);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_satker_master_pkey ON public.bdb_satker_master USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_satker_master_satker_key_uidx ON public.bdb_satker_master USING btree (satker_key) WHERE (satker_key IS NOT NULL);
CREATE INDEX IF NOT EXISTS bdb_satker_master_taxonomy_r11_idx ON public.bdb_satker_master USING btree (organization_domain, function_domain) WHERE (organization_domain IS NOT NULL);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_satker_profiles_pkey ON public.bdb_satker_profiles USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_satker_profiles_satker_key_key ON public.bdb_satker_profiles USING btree (satker_key);
CREATE INDEX IF NOT EXISTS idx_bdb_satker_profiles_satker_master_id ON public.bdb_satker_profiles USING btree (satker_master_id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_satker_taxonomy_r11_manifest_pkey ON public.bdb_satker_taxonomy_r11_manifest USING btree (run_id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_schema_migrations_pkey ON public.bdb_schema_migrations USING btree (filename);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_social_bookmarks_pkey ON public.bdb_social_bookmarks USING btree (id);
CREATE INDEX IF NOT EXISTS idx_social_bookmarks_user ON public.bdb_social_bookmarks USING btree (user_id);
CREATE UNIQUE INDEX IF NOT EXISTS uq_user_post_bookmark ON public.bdb_social_bookmarks USING btree (user_id, post_id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_social_comments_pkey ON public.bdb_social_comments USING btree (id);
CREATE INDEX IF NOT EXISTS idx_social_comments_post ON public.bdb_social_comments USING btree (post_id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_social_notifications_pkey ON public.bdb_social_notifications USING btree (id);
CREATE INDEX IF NOT EXISTS idx_social_notif_category ON public.bdb_social_notifications USING btree (category);
CREATE INDEX IF NOT EXISTS idx_social_notif_recipient ON public.bdb_social_notifications USING btree (recipient_id, is_read);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_social_posts_pkey ON public.bdb_social_posts USING btree (id);
CREATE INDEX IF NOT EXISTS idx_social_posts_author ON public.bdb_social_posts USING btree (author_id);
CREATE INDEX IF NOT EXISTS idx_social_posts_created ON public.bdb_social_posts USING btree (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_social_posts_status ON public.bdb_social_posts USING btree (status);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_social_reactions_pkey ON public.bdb_social_reactions USING btree (id);
CREATE INDEX IF NOT EXISTS idx_social_rx_post ON public.bdb_social_reactions USING btree (post_id);
CREATE UNIQUE INDEX IF NOT EXISTS uq_post_user_reaction ON public.bdb_social_reactions USING btree (post_id, user_id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_social_read_receipts_pkey ON public.bdb_social_read_receipts USING btree (id);
CREATE INDEX IF NOT EXISTS idx_social_receipts_post ON public.bdb_social_read_receipts USING btree (post_id);
CREATE INDEX IF NOT EXISTS idx_social_receipts_satker ON public.bdb_social_read_receipts USING btree (satker_id);
CREATE UNIQUE INDEX IF NOT EXISTS uq_post_user_read ON public.bdb_social_read_receipts USING btree (post_id, user_id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_status_master_code_key ON public.bdb_status_master USING btree (code);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_status_master_pkey ON public.bdb_status_master USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_status_override_log_pkey ON public.bdb_status_override_log USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS bdb_system_settings_pkey ON public.bdb_system_settings USING btree (key);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_1fc18eb196bfc88fd9310e9e451" ON public.cm_agama USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_be401103ff47f0fcac923902d29" ON public.cm_desa USING btree (code);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_77440b8b8b1c388851bd7c4f334" ON public.cm_golongan_kamtibmas USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS cm_golongan_kejahatan_pkey ON public.cm_golongan_kejahatan USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS cm_iccs_kategori_kode_key ON public.cm_iccs_kategori USING btree (kode);
CREATE UNIQUE INDEX IF NOT EXISTS cm_iccs_kategori_pkey ON public.cm_iccs_kategori USING btree (id);
CREATE INDEX IF NOT EXISTS "IDX_da65578860340e7dad4add124c" ON public.cm_jenis_barang_bukti USING btree (kode);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_e8b8c166dae818fccfb15301974" ON public.cm_jenis_barang_bukti USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_44769d9218240f67aaf86ada249" ON public.cm_jenis_kejahatan USING btree (id);
CREATE INDEX IF NOT EXISTS cm_jenis_kejahatan_golongan_kejahatan_idx ON public.cm_jenis_kejahatan USING btree ("golonganKejahatanId");
CREATE INDEX IF NOT EXISTS "IDX_244334ac3d84f5076a5fe91b29" ON public.cm_jenis_kejahatan_undang_undang_cm_undang_undang USING btree ("cmUndangUndangId");
CREATE INDEX IF NOT EXISTS "IDX_885b0d23a962874dc2cfc7a5a4" ON public.cm_jenis_kejahatan_undang_undang_cm_undang_undang USING btree ("cmJenisKejahatanId");
CREATE UNIQUE INDEX IF NOT EXISTS "PK_ed59b2fe6ce2b703dabc0e924bc" ON public.cm_jenis_kejahatan_undang_undang_cm_undang_undang USING btree ("cmJenisKejahatanId", "cmUndangUndangId");
CREATE UNIQUE INDEX IF NOT EXISTS "PK_aa9ff3fd56d3d55185749c2c66c" ON public.cm_jenis_kelamin USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_646c14e21168c1e623699e70012" ON public.cm_kabupaten USING btree (code);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_ef2808745dbe11ee49da9942e4f" ON public.cm_kategori_lokasi USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_37fa6f914adf70088f812760336" ON public.cm_kecamatann USING btree (code);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_ae86768db8ec07abb2dded3c997" ON public.cm_kewarganegaraan USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_4c1aded0b1365312a952a08aee6" ON public.cm_modus_operandi USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_741474a7ce873110dc602dc0052" ON public.cm_motif_kejahatan USING btree (id);
CREATE INDEX IF NOT EXISTS "IDX_be8f9bf2c1fa89cf40ab876849" ON public.cm_pasal USING btree (pasal);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_bbc272ce4eb3f735498998841a1" ON public.cm_pasal USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_c2f7b63f184f42e1a144c0c4d1f" ON public.cm_pekerjaan USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_15dd2084aedf9cd77f66593394b" ON public.cm_pendidikan USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_8dd630f158c1a02752d1165b452" ON public.cm_polda USING btree (code);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_b7574624c34e940ef5a93ad249d" ON public.cm_polres USING btree (code);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_236e31fe8d1704340b1faddc0e3" ON public.cm_polsek USING btree (code);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_6b5c85a2ba9b0b02747aae5ba07" ON public.cm_provinsi USING btree (code);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_1eff8cd9dbb4a0e1ade6b76e24b" ON public.cm_sub_golongan_kamtibmas USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_fc149171522e7a6ae4ea8714797" ON public.cm_suku USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_2ce680f954999dcf567b4b0a096" ON public.cm_terlapor_status USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_c55d73abfe52e8f085b2807fe1a" ON public.cm_tipe_identitas USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_4102a526b3a532aedc40eafbe09" ON public.cm_undang_undang USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_e8d76e31e11f6a3a400516ef7b0" ON public.cm_unit USING btree (id);
CREATE INDEX IF NOT EXISTS "IDX_3fab5567ee1fe830dfd2c307ce" ON public.permission USING btree (path);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_3b8b97af9d9d8807e41e6f48362" ON public.permission USING btree (id);
CREATE INDEX IF NOT EXISTS "IDX_13672a2e7e3e11c7edb147298a" ON public.permission_closure USING btree (id_descendant);
CREATE INDEX IF NOT EXISTS "IDX_5a9be34c7833062e6cceb562d5" ON public.permission_closure USING btree (id_ancestor);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_17ddd758cee77e49c62fb6c80d3" ON public.permission_closure USING btree (id_ancestor, id_descendant);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_5c0d8a6bd1bf744cf4e14535c05" ON public.tm_kategori_lp USING btree (id);
CREATE INDEX IF NOT EXISTS "IDX_06494ed965debc1fadeadb0c4a" ON public.tm_org USING btree (path);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_dc594740663c657463713d6973d" ON public.tm_org USING btree (id);
CREATE INDEX IF NOT EXISTS "IDX_6d0d7e8b5adf456a844e3a4dd8" ON public.tm_org_closure USING btree (id_ancestor);
CREATE INDEX IF NOT EXISTS "IDX_c29f36e0e694b024de9dcc7e38" ON public.tm_org_closure USING btree (id_descendant);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_78e8b3f4a2dadb3950b38f13019" ON public.tm_org_closure USING btree (id_ancestor, id_descendant);
CREATE INDEX IF NOT EXISTS "IDX_19b6a9a4d5ea1de20b60589a67" ON public.tm_org_kategori_lp_tm_kategori_lp USING btree ("tmOrgId");
CREATE INDEX IF NOT EXISTS "IDX_4837023dd251cc1bdd9db6774e" ON public.tm_org_kategori_lp_tm_kategori_lp USING btree ("tmKategoriLpId");
CREATE UNIQUE INDEX IF NOT EXISTS "PK_46b9f67aff7c4067dab7b50b2e5" ON public.tm_org_kategori_lp_tm_kategori_lp USING btree ("tmOrgId", "tmKategoriLpId");
CREATE INDEX IF NOT EXISTS "IDX_477eae86ae7b99b13517c3b163" ON public.tm_org_level USING btree (path);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_f77ae2e7c3c4ed3467c884578cb" ON public.tm_org_level USING btree (id);
CREATE INDEX IF NOT EXISTS "IDX_9883a0f88fa01e02c827718355" ON public.tm_org_level_akses_child_tm_org_level USING btree ("tmOrgLevelId_1");
CREATE INDEX IF NOT EXISTS "IDX_dc50759ca796eac367ddb58892" ON public.tm_org_level_akses_child_tm_org_level USING btree ("tmOrgLevelId_2");
CREATE UNIQUE INDEX IF NOT EXISTS "PK_38631a77add10e679615f92c0a6" ON public.tm_org_level_akses_child_tm_org_level USING btree ("tmOrgLevelId_1", "tmOrgLevelId_2");
CREATE INDEX IF NOT EXISTS "IDX_4eda63766223235fad254c9aea" ON public.tm_org_level_closure USING btree (id_descendant);
CREATE INDEX IF NOT EXISTS "IDX_87eaeb0cf5e68e90bac8b25e2f" ON public.tm_org_level_closure USING btree (id_ancestor);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_958c7ae42f61f012d43bda02c27" ON public.tm_org_level_closure USING btree (id_ancestor, id_descendant);
CREATE INDEX IF NOT EXISTS "IDX_5be4119100144c877df5308fbc" ON public.tm_org_level_permission_permission USING btree ("permissionId");
CREATE INDEX IF NOT EXISTS "IDX_a542eb80e37d04a59f859ca335" ON public.tm_org_level_permission_permission USING btree ("tmOrgLevelId");
CREATE UNIQUE INDEX IF NOT EXISTS "PK_7bb57472f859ed66543254f4123" ON public.tm_org_level_permission_permission USING btree ("tmOrgLevelId", "permissionId");
CREATE UNIQUE INDEX IF NOT EXISTS "PK_829ac1de7e4a55c23bd20f95d09" ON public.tm_org_role USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS "UQ_18f3903a55bd5717f54c408f410" ON public.tm_org_role USING btree (invitation_url);
CREATE UNIQUE INDEX IF NOT EXISTS "UQ_3fa13ba0ecc3034f8430ab9d570" ON public.tm_org_role USING btree (temporary_invitation_code);
CREATE UNIQUE INDEX IF NOT EXISTS "UQ_fa79b3843507bc264c74cb4a358" ON public.tm_org_role USING btree (invitation_code);
CREATE INDEX IF NOT EXISTS "IDX_2a6e1cd548dd4849fec50098ee" ON public.tm_org_role_permission_permission USING btree ("permissionId");
CREATE INDEX IF NOT EXISTS "IDX_5048a95025e1eecd5df5851317" ON public.tm_org_role_permission_permission USING btree ("tmOrgRoleId");
CREATE UNIQUE INDEX IF NOT EXISTS "PK_2c95ace53b3877b79a3057e3a09" ON public.tm_org_role_permission_permission USING btree ("tmOrgRoleId", "permissionId");
CREATE UNIQUE INDEX IF NOT EXISTS "PK_b693ba36e956662b70e43b53f70" ON public.tm_type_kejahatan USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_c1e22af9d062f3d3f0e6ee10c8a" ON public.trb_dir USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_cd2180366aa0fbb0e99aeea162f" ON public.trb_dir_permisson USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_25d5b7ddf36c66781b2861a658f" ON public.trb_dir_report USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_e6a032aa8cb9c026e135d13b0d3" ON public.trb_dir_role USING btree (id);
CREATE INDEX IF NOT EXISTS "IDX_1ed56218d91a53dfcbc4744674" ON public.trb_dir_role_directorate_permissions_trb_dir_permisson USING btree ("trbDirPermissonId");
CREATE INDEX IF NOT EXISTS "IDX_894e910947270385cf0c42c3df" ON public.trb_dir_role_directorate_permissions_trb_dir_permisson USING btree ("trbDirRoleId");
CREATE UNIQUE INDEX IF NOT EXISTS "PK_c5d428f9c9247304b742123bc6d" ON public.trb_dir_role_directorate_permissions_trb_dir_permisson USING btree ("trbDirRoleId", "trbDirPermissonId");
CREATE UNIQUE INDEX IF NOT EXISTS "PK_993123fe4d2e76d7407f8f55b00" ON public.trb_dir_team USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_65ab1d4d18dc56d4e1624005f7f" ON public.trb_dp_report USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_746ece0e5b008a06d09accf6bf0" ON public.trb_log_imports USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_19cb0c0dae2baacc984c895bdf6" ON public.trb_log_report USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_94d8a200e0d9fd0193b26903f39" ON public.trb_police USING btree (id);
CREATE INDEX IF NOT EXISTS "IDX_2d237b46d0678e1a704fb0da02" ON public.trb_report USING btree (sumber_data);
CREATE INDEX IF NOT EXISTS "IDX_625e6c1bf17bbcc590883d1c40" ON public.trb_report USING btree (integration_id);
CREATE INDEX IF NOT EXISTS "IDX_6546a5afdb4d31c1d0fab499cd" ON public.trb_report USING btree (nomor);
CREATE INDEX IF NOT EXISTS "IDX_9a7d858610076e32f995b0a4e5" ON public.trb_report USING btree (tanggal);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_ba3152c621a003188acfc9a2bf0" ON public.trb_report USING btree (id);
CREATE INDEX IF NOT EXISTS "IDX_3866dafa4af95a64c5f59f13da" ON public.trb_report_barang_bukti USING btree (jumlah);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_73bb237be6b84582500609e09a8" ON public.trb_report_barang_bukti USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_ebb2332de621b62d791f052814b" ON public.trb_report_excels USING btree (id);
CREATE INDEX IF NOT EXISTS "IDX_2d464add664f536935b779eb23" ON public.trb_report_korban USING btree (nama);
CREATE INDEX IF NOT EXISTS "IDX_d4123d81a663aa0736c66cd11c" ON public.trb_report_korban USING btree (nomor_identitas);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_e7c3be1502d30609e57d194fa74" ON public.trb_report_korban USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_80699cf0dfe00d2bcd688b76a0a" ON public.trb_report_pasal USING btree (id);
CREATE INDEX IF NOT EXISTS "IDX_611d50bcae3b4b12b3b8c97bc0" ON public.trb_report_pelapor USING btree (nama);
CREATE INDEX IF NOT EXISTS "IDX_b4f38d67b3e86028395e1d7579" ON public.trb_report_pelapor USING btree (nomor_identitas);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_c693fa05af37f02798262f8890a" ON public.trb_report_pelapor USING btree (id);
CREATE INDEX IF NOT EXISTS "IDX_34106b62aca7f47332cbeeaf3c" ON public.trb_report_saksi USING btree (nama);
CREATE INDEX IF NOT EXISTS "IDX_b2a6669302626d2673cc49d7ea" ON public.trb_report_saksi USING btree (nomor_identitas);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_5808190edf8db4120c28f5617ea" ON public.trb_report_saksi USING btree (id);
CREATE INDEX IF NOT EXISTS "IDX_90d1f01b69bb25bbcfadf8b2f2" ON public.trb_report_status USING btree (path);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_96ec2bd91e7a6ce9dc3e3bdc87d" ON public.trb_report_status USING btree (id);
CREATE INDEX IF NOT EXISTS "IDX_a7bd8638bc365b8bc578329532" ON public.trb_report_status_closure USING btree (id_descendant);
CREATE INDEX IF NOT EXISTS "IDX_f8264fb99a6a7d754c6383b7b7" ON public.trb_report_status_closure USING btree (id_ancestor);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_6a6b7f36051ec0b69c4b8f0b845" ON public.trb_report_status_closure USING btree (id_ancestor, id_descendant);
CREATE INDEX IF NOT EXISTS "IDX_6d7d329dffd53a3fa7f77dc802" ON public.trb_report_terlapor USING btree (nama);
CREATE INDEX IF NOT EXISTS "IDX_7205490c83f807b489cf23937c" ON public.trb_report_terlapor USING btree (nomor_identitas);
CREATE UNIQUE INDEX IF NOT EXISTS "PK_3b595d403a4ecc258fd94130d3c" ON public.trb_report_terlapor USING btree (id);
CREATE INDEX IF NOT EXISTS idx_user_connections_active_only ON public.user_connections USING btree (requester_id, addressee_id) WHERE (status = 'ACCEPTED'::connection_status_enum);
CREATE INDEX IF NOT EXISTS idx_user_connections_addr_status ON public.user_connections USING btree (addressee_id, status);
CREATE INDEX IF NOT EXISTS idx_user_connections_req_status ON public.user_connections USING btree (requester_id, status);
CREATE UNIQUE INDEX IF NOT EXISTS uq_connection_pair ON public.user_connections USING btree (requester_id, addressee_id);
CREATE UNIQUE INDEX IF NOT EXISTS user_connections_pkey ON public.user_connections USING btree (id);

-- ============================================================================
-- 7. TRIGGERS (5 TRIGGERS)
-- ============================================================================

-- Trigger: trg_guard_tanggal_dokumen_lp on public.bdb_dokumen
CREATE TRIGGER trg_guard_tanggal_dokumen_lp BEFORE INSERT OR UPDATE OF tanggal_dokumen, tanggal_mulai, tanggal_berakhir ON bdb_dokumen FOR EACH ROW EXECUTE FUNCTION fn_guard_tanggal_dokumen_lp();

-- Trigger: bdb_trg_sync_kinerja_snapshot_from_lp on public.bdb_laporan_polisi
CREATE TRIGGER bdb_trg_sync_kinerja_snapshot_from_lp AFTER UPDATE OF status_id, tanggal_selesai, satker_id, unit_satker_id, jenis_kejahatan_id, model_lp ON bdb_laporan_polisi FOR EACH ROW WHEN (old.status_id IS DISTINCT FROM new.status_id OR old.tanggal_selesai IS DISTINCT FROM new.tanggal_selesai OR old.satker_id IS DISTINCT FROM new.satker_id OR old.unit_satker_id IS DISTINCT FROM new.unit_satker_id OR old.jenis_kejahatan_id IS DISTINCT FROM new.jenis_kejahatan_id OR old.model_lp IS DISTINCT FROM new.model_lp) EXECUTE FUNCTION bdb_sync_kinerja_snapshot_from_lp();

-- Trigger: trg_bdb_lp_auto_map_unit on public.bdb_laporan_polisi
CREATE TRIGGER trg_bdb_lp_auto_map_unit BEFORE INSERT ON bdb_laporan_polisi FOR EACH ROW EXECUTE FUNCTION bdb_lp_auto_map_unit();

-- Trigger: trg_bdb_lp_default_status on public.bdb_laporan_polisi
CREATE TRIGGER trg_bdb_lp_default_status BEFORE INSERT ON bdb_laporan_polisi FOR EACH ROW EXECUTE FUNCTION bdb_lp_default_status();

-- Trigger: trg_bdb_satker_auto_tipe on public.bdb_satker
CREATE TRIGGER trg_bdb_satker_auto_tipe BEFORE INSERT ON bdb_satker FOR EACH ROW EXECUTE FUNCTION bdb_satker_auto_tipe();
