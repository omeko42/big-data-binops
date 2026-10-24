-- Hapus (soft delete) Laporan Polisi -- superadmin-only, wajib keterangan. Data tetap ada
-- di DB (bukan hard delete), cuma disembunyikan dari daftar & statistik normal.
alter table bdb_laporan_polisi add column if not exists deleted_at timestamp;
alter table bdb_laporan_polisi add column if not exists deleted_by bigint references auth_users(id) on delete set null;
alter table bdb_laporan_polisi add column if not exists delete_reason text;

create index if not exists bdb_laporan_polisi_deleted_idx on bdb_laporan_polisi (deleted_at);
