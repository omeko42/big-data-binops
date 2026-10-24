-- 013_kasus_menonjol_lp_link.sql
-- Entity KasusMenonjol (src/dashboard/entity/kasus_menonjol.entity.ts) memetakan
-- kolom `bdb_lp_master_id` (bigint) yang tidak ada di tabel an_kasus_menonjol,
-- menyebabkan endpoint /api/bareskrim/kasus-menonjol gagal "Database query failed".

alter table an_kasus_menonjol add column if not exists bdb_lp_master_id bigint;
