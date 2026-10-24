-- 021_lp_unit_satker.sql
-- Kolom untuk mapping lebih dalam: unit satker terdalam (anak dari polda/polres) hasil
-- pencocokan unit DORS dgn anak satker (config/dors-unit-mapping.json). Idempotent.
alter table bdb_laporan_polisi add column if not exists unit_satker_id   bigint references bdb_satker(id) on delete set null;
alter table bdb_laporan_polisi add column if not exists unit_satker_nama text;
alter table bdb_laporan_polisi add column if not exists unit_satker_kode text;
create index if not exists bdb_laporan_polisi_unitsatker_idx on bdb_laporan_polisi (unit_satker_id);
