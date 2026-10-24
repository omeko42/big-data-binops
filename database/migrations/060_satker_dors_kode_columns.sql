-- Kolom referensi dari bdb_satker_master (sistem satker terpisah, sumber DORS_LP_REGISTER) --
-- dipakai sbg fallback match kalau kode_pusiknas kosong dari payload DORS (banyak terjadi di
-- level Polsek). PENTING: "dors_kode" BUKAN skema yang sama dgn bdb_satker.kode/kode_canonical
-- (yg berbasis kode_pusiknas/Robinops) -- jangan pernah dipakai utk hitung hierarki/segmen,
-- murni kolom referensi/lookup tambahan. Data diisi oleh scripts/bdb/backfill-satker-dors-kode.js
-- (matching by nama, bukan lewat migrasi ini -- perlu logic fuzzy/disambiguasi yg lebih pas di JS).
alter table bdb_satker add column if not exists dors_kode text;
alter table bdb_satker add column if not exists dors_satker_id text;
alter table bdb_satker add column if not exists nama_satker_dors text;
alter table bdb_satker add column if not exists sub_domain text;
alter table bdb_satker add column if not exists operational_role text;
alter table bdb_satker add column if not exists dors_status text;

create index if not exists bdb_satker_dors_kode_idx on bdb_satker (dors_kode) where dors_kode is not null;
