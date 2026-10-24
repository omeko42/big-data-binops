-- 033_performance_indexes.sql — indeks performa untuk query yang sering dijalankan.
-- Dijalankan manual via psql -f (autocommit) sehingga CONCURRENTLY aman & tak mengunci tabel di produksi.

-- Laporan Polisi: join/filter status (anev, grid, stats), mapping via kode_pusiknas, urut synced_at.
create index concurrently if not exists idx_lp_status on bdb_laporan_polisi(status_id);
create index concurrently if not exists idx_lp_kode_pusiknas on bdb_laporan_polisi(kode_pusiknas);
create index concurrently if not exists idx_lp_synced_at on bdb_laporan_polisi(synced_at desc);
-- agregat Anev CT/CC: group by satker_id, status_id
create index concurrently if not exists idx_lp_satker_status on bdb_laporan_polisi(satker_id, status_id);

-- Satker Puskarda: lookup by kode (pemetaan LP -> satker), parent/root sudah terindeks.
create index concurrently if not exists idx_satker_kode on bdb_satker(kode);

-- Menu-access & filter role: select distinct role_bdb dijalankan tiap page-load.
create index concurrently if not exists idx_auth_users_role_bdb on auth_users(lower(role_bdb));

-- Dokumen: join creator (timeline).
create index concurrently if not exists idx_dokumen_created_by on bdb_dokumen(created_by);
