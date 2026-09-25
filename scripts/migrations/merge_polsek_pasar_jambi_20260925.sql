-- Migration: Merge duplicate Polsek Pasar Jambi into Polsek Pasar
-- Date: 2026-09-25
-- Author: Bareskrim CAS Team
-- Description:
--   Sesuai kop surat dinas resmi ("POLRI DAERAH JAMBI / RESOR KOTA JAMBI / SEKTOR PASAR")
--   dan konfirmasi kewilayahan, satker Polsek Pasar Jambi (id: 4057, unit: 4059) tidak ada,
--   yang sah dan benar adalah POLSEK PASAR (id: 19225, unit: 20830).
--   Seluruh data LP (46 LP), akun operator (user: 16870), dan snapshot diremap ke POLSEK PASAR.
--   Satker duplikat dinonaktifkan (kinerja_aktif = false).

BEGIN;

-- 1. Create backups
CREATE TABLE IF NOT EXISTS bdb_backup_polsek_pasar_jambi_merge_20260925_satker AS 
SELECT * FROM bdb_satker WHERE id IN (4057, 4059, 19225, 20830);

CREATE TABLE IF NOT EXISTS bdb_backup_polsek_pasar_jambi_merge_20260925_lp AS 
SELECT * FROM bdb_laporan_polisi WHERE satker_id IN (4057, 19225) OR unit_satker_id IN (4059, 20830);

CREATE TABLE IF NOT EXISTS bdb_backup_polsek_pasar_jambi_merge_20260925_users AS 
SELECT * FROM auth_users WHERE scope_satker_id IN (4057, 4059, 19225, 20830);

-- 2. Remap LPs from 4057/4059 to 19225/20830
UPDATE bdb_laporan_polisi 
SET satker_id = 19225, 
    satker_nama = 'POLSEK PASAR'
WHERE satker_id = 4057;

UPDATE bdb_laporan_polisi 
SET unit_satker_id = 20830
WHERE unit_satker_id = 4059;

-- 3. Remap user accounts
UPDATE auth_users 
SET scope_satker_id = 20830,
    scope_satker_key = '060.01.10.01.21.06',
    requested_scope_satker_id = 20830,
    requested_scope_satker_key = '060.01.10.01.21.06'
WHERE scope_satker_id = 4059 OR requested_scope_satker_id = 4059;

-- 4. Update snapshots
UPDATE bdb_kinerja_perkara_snapshot 
SET satker_id = 20830 
WHERE satker_id = 4059;

DELETE FROM bdb_anev_rekap_snapshot WHERE satker_id IN (4057, 4059);
DELETE FROM bdb_barang_bukti_summary_snapshot WHERE satker_id IN (4057, 4059);
DELETE FROM bdb_pihak_terlibat_summary_snapshot WHERE satker_id IN (4057, 4059);

-- 5. Deactivate duplicate satkers
UPDATE bdb_satker 
SET kinerja_aktif = false,
    dors_mapping_aktif = false,
    pelimpahan_target_aktif = false,
    deskripsi = 'POLSEK PASAR JAMBI (DUPLIKAT NONAKTIF)',
    updated_at = now()
WHERE id = 4057;

UPDATE bdb_satker 
SET kinerja_aktif = false,
    dors_mapping_aktif = false,
    pelimpahan_target_aktif = false,
    deskripsi = 'UNIT RESKRIM POLSEK PASAR JAMBI (DUPLIKAT NONAKTIF)',
    updated_at = now()
WHERE id = 4059;

-- 6. Ensure authoritative Polsek Pasar is active
UPDATE bdb_satker 
SET kinerja_aktif = true,
    dors_mapping_aktif = true,
    pelimpahan_target_aktif = true,
    updated_at = now()
WHERE id = 19225;

UPDATE bdb_satker 
SET kinerja_aktif = true,
    dors_mapping_aktif = true,
    pelimpahan_target_aktif = true,
    updated_at = now()
WHERE id = 20830;

COMMIT;
