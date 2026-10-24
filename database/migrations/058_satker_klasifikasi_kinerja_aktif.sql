-- 058_satker_klasifikasi_kinerja_aktif.sql
-- Master Satker: tambah klasifikasi (2 sumbu independen) + saklar manual "tampil di rekap Kinerja
-- Perkara" per satker.
--  - keanggotaan: INTERNAL_POLRI / EKSTERNAL_POLRI
--  - fungsi     : INTERNAL_RESERSE / EKSTERNAL_RESERSE
--  - kinerja_aktif: default true (semua satker tetap tampil di rekap spt sebelumnya) -- superadmin
--    baru mengecualikan satker tertentu (mis. Propam/Humas yg bukan unit penindak perkara) secara manual.

alter table bdb_satker add column if not exists keanggotaan text;
alter table bdb_satker add column if not exists fungsi text;
alter table bdb_satker add column if not exists kinerja_aktif boolean not null default true;
