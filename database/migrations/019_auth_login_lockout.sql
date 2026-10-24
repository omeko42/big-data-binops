-- 019_auth_login_lockout.sql
-- Kunci akun setelah 3x gagal login (30 menit). Idempotent.
alter table auth_users add column if not exists failed_login_attempts integer not null default 0;
alter table auth_users add column if not exists locked_until timestamp without time zone;
