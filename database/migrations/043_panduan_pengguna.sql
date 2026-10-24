-- Panduan Pengguna: video/PDF panduan pakai aplikasi. Kelola = superadmin-only,
-- lihat = semua role yang login. File disimpan di MinIO (bucket sama dgn Kerma).
create table if not exists bdb_panduan_pengguna (
    id bigserial primary key,
    judul text not null,
    deskripsi text,
    kategori text,
    tipe varchar(10) not null default 'PDF', -- VIDEO | PDF
    file_name text not null,
    object_key text not null,
    content_type text,
    size bigint,
    urutan int not null default 0,
    status varchar(20) not null default 'AKTIF', -- AKTIF | NONAKTIF
    created_by bigint references auth_users(id) on delete set null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table bdb_panduan_pengguna add column if not exists status varchar(20) not null default 'AKTIF';

create index if not exists bdb_panduan_pengguna_tipe_idx on bdb_panduan_pengguna(tipe);
