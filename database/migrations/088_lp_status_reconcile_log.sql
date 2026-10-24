-- Jejak tiap kali rekonsiliasi status LP dijalankan (otomatis tiap jam via cron, ATAU dipaksa
-- manual superadmin dari UI Alur Dokumen) -- dipakai UI utk tampilkan "terakhir dijalankan kapan"
-- & "dipicu siapa", supaya user bisa yakin jadwal cron memang jalan (bukan cuma percaya asumsi),
-- dan bisa bedakan run otomatis vs manual. Dicatat SETIAP kali jalan (termasuk saat diperbaiki=0)
-- -- justru itu yg penting, "terakhir dijalankan" harus akurat walau tak ada yg perlu diperbaiki.
create table if not exists bdb_lp_status_reconcile_log (
    id bigserial primary key,
    triggered_by text not null check (triggered_by in ('CRON', 'MANUAL')),
    user_id bigint,
    user_name text,
    diperiksa integer not null,
    diperbaiki integer not null,
    created_at timestamptz not null default now()
);
create index if not exists idx_lp_status_reconcile_log_triggered_by_created_at on bdb_lp_status_reconcile_log (triggered_by, created_at desc);
