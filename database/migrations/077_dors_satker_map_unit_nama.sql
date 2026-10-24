-- Tambah granularitas UNIT ke alias mapping DORS -> satker (bdb_dors_satker_map).
-- Sebelumnya kunci alias cuma (kode_pusiknas, nama, parent_nama) -- satu grup kode_pusiknas
-- (mis. Mabes Polri 060.01.00) yang sebenarnya berisi LP dari BEBERAPA unit berbeda (mis.
-- "KORPOLAIRUD BAHARKAM POLRI" vs "DITTIPID PPA DAN PPO BARESKRIM POLRI") tidak bisa dipetakan
-- ke node tree yang berbeda-beda -- Paksa Petakan/Tambah ke Tree selalu menyamaratakan SEMUA LP
-- di grup itu ke satu satker_id yang sama. Kolom unit_nama (nullable) memungkinkan alias
-- di-scope ke unit tertentu di dalam grup; alias lama (unit_nama null) tetap berlaku sbg
-- fallback "seluruh grup" utk baris yang tak match alias unit manapun.
alter table bdb_dors_satker_map add column if not exists unit_nama text;

drop index if exists bdb_dors_satker_map_key;
create unique index if not exists bdb_dors_satker_map_key
    on bdb_dors_satker_map (coalesce(dors_kode_pusiknas,''), lower(dors_nama), lower(coalesce(dors_parent_nama,'')), lower(coalesce(unit_nama,'')));
