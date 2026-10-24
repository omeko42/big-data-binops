-- 020_bdb_laporan_polisi.sql
-- Laporan Polisi terkelola: salinan LP dari integrasi DORS yang SUDAH termapping ke
-- satker (bdb_satker) via kode_pusiknas. Data ini siap untuk aktivitas berikutnya.
-- Idempotent; juga dibuat oleh LaporanPolisiService.ensureTable().

create table if not exists bdb_laporan_polisi (
    id               bigserial primary key,
    dors_lp_id       bigint not null,
    model_lp         text   not null,
    raw_lp_id        bigint references bdb_dors_raw_lp(id) on delete set null,
    no_laporan       text,
    tgl_laporan      text,
    kategori         text,
    tempat_kejadian  text,
    uraian_singkat   text,
    -- satker penanganan (hasil mapping)
    penanganan_level text,          -- Mabes | Polda | Polres | Polsek
    kode_pusiknas    text,          -- kode_pusiknas satker penanganan
    satker_id        bigint references bdb_satker(id) on delete set null,
    satker_nama      text,
    unit_nama        text,
    unit_level       text,
    data_scope       text,
    status           text not null default 'BARU',   -- alur aktivitas berikutnya
    payload_json     jsonb,
    synced_at        timestamp not null default now(),
    created_at       timestamp not null default now(),
    updated_at       timestamp not null default now(),
    unique (dors_lp_id, model_lp)
);

create index if not exists bdb_laporan_polisi_satker_idx on bdb_laporan_polisi (satker_id);
create index if not exists bdb_laporan_polisi_level_idx on bdb_laporan_polisi (penanganan_level);
create index if not exists bdb_laporan_polisi_nolap_idx on bdb_laporan_polisi (lower(no_laporan));
