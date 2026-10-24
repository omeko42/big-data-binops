-- Pengaturan sistem global (key-value), mis. wajib-tidaknya OTP email saat login utk SEMUA akun.
-- Dikontrol superadmin saja; akun lain hanya mengikuti nilainya (read-only).
create table if not exists bdb_system_settings (
    key text primary key,
    value text,
    updated_at timestamptz not null default now(),
    updated_by bigint references auth_users(id) on delete set null
);
