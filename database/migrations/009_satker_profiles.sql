create table if not exists bdb_satker_profiles (
    id bigserial primary key,
    satker_master_id bigint null references bdb_satker_master(id) on delete set null,
    satker_key text not null unique,
    alamat text,
    provinsi text,
    kabupaten_kota text,
    kecamatan text,
    latitude numeric(12,8),
    longitude numeric(12,8),
    jumlah_penduduk bigint,
    luas_wilayah numeric(14,2),
    telepon text,
    email text,
    website text,
    keterangan text,
    payload_json jsonb,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now()
);

create index if not exists idx_bdb_satker_profiles_satker_master_id
    on bdb_satker_profiles (satker_master_id);

