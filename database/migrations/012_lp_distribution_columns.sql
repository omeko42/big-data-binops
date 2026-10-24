-- 012_lp_distribution_columns.sql
-- Menangkap kolom distribusi/operasional pada bdb_lp_master yang dipakai oleh
-- modul rekap-lp (bdb-rekap-lp.service.ts) namun sebelumnya tidak pernah ada di
-- migrasi mana pun (ditambahkan ad-hoc). Tanpa kolom ini, endpoint
-- /api/bdb/rekap-lp/worklist gagal dengan "Database query failed".
--
-- 008_lp_master_detail_attributes.sql menambahkan 3 kolom pertama; diulang di
-- sini dengan "if not exists" agar idempotent.

begin;

alter table bdb_lp_master add column if not exists uraian_singkat_operasional text;
alter table bdb_lp_master add column if not exists tingkat_kesulitan text;
alter table bdb_lp_master add column if not exists detail_updated_at timestamp;

-- Kolom distribusi
alter table bdb_lp_master add column if not exists is_distributed boolean not null default false;
alter table bdb_lp_master add column if not exists operational_satker_id bigint;
alter table bdb_lp_master add column if not exists distributed_at timestamp;

commit;
