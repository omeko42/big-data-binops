-- 018_bdb_satker_location.sql
-- Kolom alamat & lokasi Satker (dikelola manual). Idempotent; juga dibuat oleh ensureTable().
alter table bdb_satker add column if not exists alamat text;
alter table bdb_satker add column if not exists provinsi text;
alter table bdb_satker add column if not exists kabupaten_kota text;
alter table bdb_satker add column if not exists kecamatan text;
alter table bdb_satker add column if not exists desa text;
alter table bdb_satker add column if not exists kode_pos text;
alter table bdb_satker add column if not exists longitude text;
alter table bdb_satker add column if not exists latitude text;
