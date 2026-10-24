-- 017_bdb_satker_tree.sql
-- Master Satker Puskarda (sumber: Robinops Bareskrim GetDataMaster?JenisDokumen=Satker).
-- Hierarki treeview dari KodeSatkerPuskarda (prefix per-segmen, "00" = placeholder).
-- Tabel dibuat/di-refresh oleh SatkerService; file ini untuk referensi/deploy.

create table if not exists bdb_satker (
    id              bigserial primary key,
    kode            text not null,              -- KodeSatkerPuskarda asli
    kode_canonical  text not null,              -- kode tanpa trailing "00" (kunci hierarki)
    deskripsi       text,                        -- nama satker
    parent_id       bigint references bdb_satker(id) on delete set null,
    root_id         bigint references bdb_satker(id) on delete set null,  -- root pohon (POLRI/060)
    parent_kode     text,                        -- kode_canonical induk (debug)
    depth           integer not null default 0,  -- kedalaman dari root
    is_root         boolean not null default false,
    is_synthetic    boolean not null default false,  -- node buatan (root POLRI)
    source          text not null default 'ROBINOPS',
    synced_at       timestamp not null default now(),
    created_at      timestamp not null default now(),
    updated_at      timestamp not null default now()
);

create unique index if not exists bdb_satker_kode_canonical_uidx on bdb_satker (kode_canonical);
create index if not exists bdb_satker_parent_idx on bdb_satker (parent_id);
create index if not exists bdb_satker_root_idx on bdb_satker (root_id);
create index if not exists bdb_satker_desk_idx on bdb_satker (lower(deskripsi));
