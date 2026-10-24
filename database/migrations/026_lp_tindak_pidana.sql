-- 026_lp_tindak_pidana.sql
-- Tindak pidana per LP yang dapat dikelola (CRUD) — sumber: dugaan DORS, manual, atau tarik dari dokumen surat.
create table if not exists bdb_lp_tindak_pidana (
    id           bigserial primary key,
    lp_id        bigint not null references bdb_laporan_polisi(id) on delete cascade,
    pasal_id     bigint references bdb_pasal_master(id) on delete set null,
    nomor_pasal  text,
    nama_kategori text,
    uu_referensi text,
    ayat         text,
    juncto       text,
    subsider     text,
    sumber       text not null default 'manual',   -- dugaan_lp | manual | dari_dokumen
    sumber_ref   text,                              -- mis. nomor/nama surat asal
    dokumen_id   bigint references bdb_dokumen(id) on delete set null,
    created_at   timestamptz not null default now(),
    updated_at   timestamptz not null default now()
);
create index if not exists idx_lp_tp_lp on bdb_lp_tindak_pidana(lp_id);
