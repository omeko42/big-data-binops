-- 076_schema_migrations_tracking.sql
-- Tabel pelacak migration SQL yg SUDAH dijalankan -- selama ini apply-sql-file.js cuma
-- mengeksekusi file & print "APPLIED", TANPA mencatat apapun, jadi tidak ada cara mengetahui
-- migration mana yg sudah/belum jalan di suatu database selain ingatan manual. Ini akar
-- masalah kenapa migration 069 (Organisasi Role) & migration lain berulang kali kelewat
-- di prod -- proses deploy manual satu-satu, gampang lupa satu file.
--
-- Tabel ini sendiri idempotent & aman dibuat kapan saja; scripts/bdb/apply-sql-file.js &
-- scripts/bdb/check-pending-migrations.js (baru) memakainya utk skip-jika-sudah-jalan &
-- utk laporan "migration mana yg belum jalan di database ini".
create table if not exists bdb_schema_migrations (
    filename text primary key,
    applied_at timestamptz not null default now()
);
