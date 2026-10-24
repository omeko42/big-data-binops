-- Barang Bukti: gabungan 2 sumber, sama pola dgn Register Pihak Terlibat (045) --
--  1) bdb_laporan_polisi.payload_json->'barang_bukti' -- read-only, dari DORS tiap sync. Tak ada
--     nomor register/kepemilikan/tanggal penyitaan/status masuk-keluar di data DORS -- field itu
--     didefaultkan (status='MASUK', field lain null) & ditandai Sumber=DORS di UI.
--  2) bdb_lp_barang_bukti_manual -- dicatat manual di halaman detail LP, field lengkap.
create table if not exists bdb_lp_barang_bukti_manual (
    id bigserial primary key,
    lp_id bigint not null references bdb_laporan_polisi(id) on delete cascade,
    nomor_register text,
    jenis text not null,
    jumlah text,
    kepemilikan text,
    tanggal_penyitaan date,
    status text not null default 'MASUK', -- MASUK | KELUAR
    keterangan text,
    created_by bigint references auth_users(id) on delete set null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    deleted_at timestamptz
);
create index if not exists idx_lp_bb_manual_lp on bdb_lp_barang_bukti_manual(lp_id);
