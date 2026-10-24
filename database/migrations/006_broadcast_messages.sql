create table if not exists bdb_broadcast_messages (
    id bigserial primary key,
    title varchar(160) not null,
    message text not null,
    severity varchar(30) not null default 'info',
    audience varchar(30) not null default 'all',
    display_duration_minutes int null,
    attachment_title varchar(180) null,
    attachment_url text null,
    scope_satker_id bigint null,
    scope_satker_key text null,
    is_running boolean not null default true,
    is_active boolean not null default true,
    starts_at timestamptz not null default now(),
    ends_at timestamptz null,
    created_by bigint null,
    updated_by bigint null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_bdb_broadcast_active
    on bdb_broadcast_messages (is_active, starts_at, ends_at, audience);

create index if not exists idx_bdb_broadcast_scope
    on bdb_broadcast_messages (scope_satker_key);
