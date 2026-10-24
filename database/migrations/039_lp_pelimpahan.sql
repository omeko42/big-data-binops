-- 039_lp_pelimpahan.sql
-- Pelimpahan LP antar satker: riwayat wajib (asal, tujuan, waktu, pelaku, keterangan).
-- Satker asal otomatis kehilangan akses begitu satker_id LP berpindah ke tujuan (lihat
-- pengecekan scope di laporan-polisi.service.ts/workflow.service.ts). Auto-dibuat juga oleh
-- LpPelimpahanService.ensureTable().
create table if not exists bdb_lp_pelimpahan (
    id bigserial primary key,
    lp_id bigint not null references bdb_laporan_polisi(id) on delete cascade,
    satker_asal_id bigint not null references bdb_satker(id),
    satker_asal_nama text,
    satker_tujuan_id bigint not null references bdb_satker(id),
    satker_tujuan_nama text,
    keterangan text,
    dilimpahkan_oleh bigint references auth_users(id),
    dilimpahkan_oleh_nama text,
    created_at timestamp not null default now()
);
create index if not exists bdb_lp_pelimpahan_lp_idx on bdb_lp_pelimpahan(lp_id);
create index if not exists bdb_lp_pelimpahan_asal_idx on bdb_lp_pelimpahan(satker_asal_id);
create index if not exists bdb_lp_pelimpahan_tujuan_idx on bdb_lp_pelimpahan(satker_tujuan_id);

alter table bdb_laporan_polisi add column if not exists sudah_dilimpahkan boolean not null default false;
create index if not exists bdb_laporan_polisi_dilimpahkan_idx on bdb_laporan_polisi(sudah_dilimpahkan);
