-- 027_satker_eksternal.sql — master satker eksternal (instansi/mitra di luar Polri)
create table if not exists bdb_satker_eksternal (
    id          bigserial primary key,
    nama        text not null,
    alamat      text,
    keterangan  text,
    created_at  timestamptz not null default now(),
    updated_at  timestamptz not null default now()
);
create index if not exists idx_satker_eksternal_nama on bdb_satker_eksternal(lower(nama));
