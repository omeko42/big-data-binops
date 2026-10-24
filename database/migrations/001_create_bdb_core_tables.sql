create table if not exists bdb_dors_raw_lp (
    id bigserial primary key,
    dors_lp_id bigint not null,
    model_lp text not null default 'lp_model_unknown',
    no_laporan text,
    payload_json jsonb not null,
    source text not null default 'DORS',
    data_scope text not null default 'TEST',
    import_batch text,
    synced_at timestamp not null default now(),
    created_at timestamp not null default now(),
    updated_at timestamp not null default now(),
    unique(dors_lp_id, model_lp),
    check (data_scope in ('TEST', 'OPERASIONAL', 'ARCHIVE'))
);

create table if not exists bdb_satker_master (
    id bigserial primary key,
    domain text not null default 'INTERNAL POLRI',
    sub_domain text not null default 'INTERNAL RESERSE',
    level text not null,
    nama_satker_canonical text not null,
    dors_satker_id text,
    dors_kode text,
    nama_satker_dors text,
    nama_parent_satker_dors text,
    nama_grandparent_satker_dors text,
    status text not null default 'AKTIF',
    payload_json jsonb,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now(),
    unique(level, dors_satker_id, dors_kode)
);

create table if not exists bdb_crime_master (
    id bigserial primary key,
    kategori text not null default 'Kejahatan',
    jenis_kejahatan text not null,
    nama_kejahatan_canonical text not null,
    dors_crime_id bigint unique,
    nama_kejahatan_dors text,
    pasal text,
    status text not null default 'AKTIF',
    payload_json jsonb,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now()
);

create table if not exists bdb_lp_master (
    id bigserial primary key,
    dors_lp_id bigint not null,
    nomor_lp text not null,
    model_lp text not null default 'lp_model_unknown',
    tanggal_lp timestamp,
    waktu_kejadian timestamp,
    zona_waktu text,
    satker_master_id bigint references bdb_satker_master(id),
    crime_master_id bigint references bdb_crime_master(id),
    nama_kejahatan_canonical text,
    uraian_singkat text,
    status text not null default 'AKTIF',
    raw_lp_id bigint references bdb_dors_raw_lp(id),
    data_scope text not null default 'TEST',
    import_batch text,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now(),
    unique(dors_lp_id, model_lp),
    check (data_scope in ('TEST', 'OPERASIONAL', 'ARCHIVE'))
);

create table if not exists bdb_distribution_letters (
    id bigserial primary key,
    lp_id bigint not null references bdb_lp_master(id),
    jenis_surat text not null,
    nomor_surat text not null,
    tanggal_ttd_surat date not null,
    waktu_ttd_surat time,
    ttd_at timestamp not null,
    tujuan_satker_id bigint not null references bdb_satker_master(id),
    catatan text,
    arsip_file_id text,
    created_by bigint,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now(),
    unique(nomor_surat)
);

create table if not exists bdb_distribution_logs (
    id bigserial primary key,
    lp_id bigint not null references bdb_lp_master(id),
    from_satker_id bigint references bdb_satker_master(id),
    to_satker_id bigint not null references bdb_satker_master(id),
    distribution_letter_id bigint references bdb_distribution_letters(id),
    status text not null default 'DISTRIBUSI',
    catatan text,
    created_by bigint,
    created_at timestamp not null default now()
);
