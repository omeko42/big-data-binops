-- 015_dors_sync_scheduler.sql
-- Penjadwalan penarikan data LP dari DORS + log tiap eksekusi.
-- Idempotent: aman dijalankan berulang.

-- 1) Kolom penjadwalan pada config DORS (menimpa ENV lewat UI).
alter table bdb_dors_config add column if not exists sync_enabled          boolean not null default false;
alter table bdb_dors_config add column if not exists sync_mode             text    not null default 'interval'; -- 'interval' | 'cron'
alter table bdb_dors_config add column if not exists sync_interval_minutes integer not null default 30;        -- untuk mode interval
alter table bdb_dors_config add column if not exists sync_cron             text    not null default '0 2 * * *'; -- untuk mode cron (tiap hari 02:00)
alter table bdb_dors_config add column if not exists sync_days_back        integer not null default 1;          -- tarik dari (hari ini - N) s/d hari ini
alter table bdb_dors_config add column if not exists data_scope            text    not null default 'OPERASIONAL'; -- TEST|OPERASIONAL|ARCHIVE

-- 2) Log tiap eksekusi sync (manual maupun terjadwal).
create table if not exists bdb_dors_sync_log (
    id            bigserial primary key,
    trigger       text        not null default 'manual',   -- 'manual' | 'cron'
    from_date     date,
    to_date       date,
    status        text        not null default 'running',   -- 'running' | 'success' | 'error'
    total_fetched integer     not null default 0,
    total_upserted integer    not null default 0,
    sources_json  jsonb       not null default '[]'::jsonb,  -- ringkasan per sumber
    error         text,
    started_at    timestamp   not null default now(),
    finished_at   timestamp,
    duration_ms   integer
);

create index if not exists bdb_dors_sync_log_started_idx on bdb_dors_sync_log (started_at desc);
