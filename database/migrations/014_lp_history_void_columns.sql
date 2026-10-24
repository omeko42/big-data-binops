-- 014_lp_history_void_columns.sql
-- Kolom void/rollback pada bdb_lp_history_logs yang dipakai
-- rekap-lp rollbackLastEvent (bdb-rekap-lp.service.ts) namun tidak ada di
-- migrasi mana pun -> endpoint /api/bdb/rekap-lp/rollback-last gagal
-- "Database query failed".

alter table bdb_lp_history_logs add column if not exists is_voided boolean not null default false;
alter table bdb_lp_history_logs add column if not exists voided_at timestamp;
alter table bdb_lp_history_logs add column if not exists void_reason text;
alter table bdb_lp_history_logs add column if not exists voided_by_event_id bigint;
