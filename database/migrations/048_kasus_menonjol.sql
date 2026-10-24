-- Master Rekap Susjol & Susatensi (kasus menonjol/viral): pola bdb baru, menggantikan
-- an_kasus_menonjol lama (TypeORM, 0 baris di prod, tabel legacy dibiarkan sbg entity
-- mati krn masih jadi target relasi Organisasi/Report). Bisa ditautkan ke banyak LP
-- (many-to-many) + lampiran dokumentasi multi-file via MinIO, dan di-scope per satker
-- (operator/viewer cuma lihat milik satkernya, superadmin/admin_binops lihat semua).
create table if not exists bdb_kasus_menonjol (
    id bigserial primary key,
    judul text not null,
    skala_viral text, -- nasional | regional | tidak viral
    tanggal_rilis date,
    rilis boolean not null default false,
    keterangan text,
    satker_id bigint, -- diisi dari satker LP pertama yg ditautkan, atau satker pembuat kalau tak ada tautan
    created_by bigint references auth_users(id) on delete set null,
    updated_by bigint references auth_users(id) on delete set null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    deleted_at timestamptz
);
create index if not exists idx_kasus_menonjol_deleted on bdb_kasus_menonjol(deleted_at);
create index if not exists idx_kasus_menonjol_satker on bdb_kasus_menonjol(satker_id);

create table if not exists bdb_kasus_menonjol_lp (
    id bigserial primary key,
    kasus_menonjol_id bigint not null references bdb_kasus_menonjol(id) on delete cascade,
    lp_id bigint not null references bdb_laporan_polisi(id) on delete cascade,
    created_at timestamptz not null default now(),
    unique (kasus_menonjol_id, lp_id)
);
create index if not exists idx_kasus_menonjol_lp_parent on bdb_kasus_menonjol_lp(kasus_menonjol_id);
create index if not exists idx_kasus_menonjol_lp_lp on bdb_kasus_menonjol_lp(lp_id);

create table if not exists bdb_kasus_menonjol_attachments (
    id bigserial primary key,
    kasus_menonjol_id bigint not null references bdb_kasus_menonjol(id) on delete cascade,
    file_name text not null,
    object_key text not null,
    content_type text,
    size bigint,
    created_at timestamptz not null default now()
);
create index if not exists idx_kasus_menonjol_attachments_parent on bdb_kasus_menonjol_attachments(kasus_menonjol_id);
