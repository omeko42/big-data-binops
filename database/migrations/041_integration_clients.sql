-- Portal Integrasi Keluar: klien pihak luar yang boleh menarik data via API BDB.
-- Setiap klien punya username + password unik sendiri (di-hash), tidak ada secret bersama.
create table if not exists bdb_integration_client (
    id bigserial primary key,
    nama_klien text not null,
    username varchar(100) not null unique,
    password_hash text not null,
    status varchar(20) not null default 'AKTIF', -- AKTIF | NONAKTIF
    allowed_scopes jsonb not null default '[]'::jsonb,
    keterangan text,
    created_by bigint,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    last_used_at timestamptz,
    last_used_ip text
);

create index if not exists idx_integration_client_status on bdb_integration_client(status);
