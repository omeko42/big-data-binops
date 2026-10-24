-- Tabel snapshot laporan Kinerja Perkara (CT/CP/CC/CR/Indeks) -- sengaja TERPISAH dari
-- bdb_laporan_polisi supaya query laporan (yg mahal: derive tanggal_mulai_penanganan lewat
-- pelimpahan, batas_hari, jatuh_tempo) tidak membebani tabel transaksional utama. Full
-- rebuild berkala (module init + tiap 30 menit + tombol refresh manual), lihat
-- kinerja-perkara.service.ts.
create table if not exists bdb_kinerja_perkara_snapshot (
    lp_id bigint primary key references bdb_laporan_polisi(id) on delete cascade,
    satker_id bigint,
    tanggal_mulai_penanganan date,
    tanggal_selesai date,
    tingkat_kesulitan text,
    kesulitan_belum_dipilih boolean not null default false,
    batas_hari integer not null default 30,
    tanggal_jatuh_tempo date,
    refreshed_at timestamptz not null default now()
);
create index if not exists idx_kps_satker on bdb_kinerja_perkara_snapshot(satker_id);
create index if not exists idx_kps_mulai on bdb_kinerja_perkara_snapshot(tanggal_mulai_penanganan);
create index if not exists idx_kps_selesai on bdb_kinerja_perkara_snapshot(tanggal_selesai);
create index if not exists idx_kps_jatuh_tempo on bdb_kinerja_perkara_snapshot(tanggal_jatuh_tempo);
