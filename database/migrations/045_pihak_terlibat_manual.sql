-- Register Pihak Terlibat: gabungan 2 sumber --
--  1) bdb_dors_lp_terlibat -- read-only, disalin dari DORS tiap sync (saksi/terlapor/korban/pelapor).
--  2) bdb_lp_pihak_manual  -- diisi manual di halaman detail LP: SAKSI, AHLI, TERSANGKA saja
--     (field detail personil sama seperti punya DORS; TERSANGKA & DPO dsb tidak pernah dikirim
--     DORS krn itu status hasil penanganan kasus, bukan data pelaporan awal).
-- Syarat per jenis (ditegakkan di service, bukan constraint DB, spy pesan errornya jelas):
--   SAKSI     -> wajib bap_tanggal + lampiran (BAP)
--   TERSANGKA -> wajib nomor_dokumen + tanggal_dokumen + lampiran (surat penetapan tersangka)
--   AHLI      -> bebas, tanpa syarat tambahan
create table if not exists bdb_lp_pihak_manual (
    id bigserial primary key,
    lp_id bigint not null references bdb_laporan_polisi(id) on delete cascade,
    keterlibatan text not null, -- SAKSI | AHLI | TERSANGKA
    nama text not null,
    nik text,
    jenis_kelamin text,
    tempat_lahir text,
    tgl_lahir text,
    pekerjaan text,
    alamat text,
    no_hp text,
    bap_tanggal date,
    nomor_dokumen text,
    tanggal_dokumen date,
    lampiran_file_name text,
    lampiran_object_key text,
    lampiran_content_type text,
    lampiran_size bigint,
    keterangan text,
    created_by bigint references auth_users(id) on delete set null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    deleted_at timestamptz
);
create index if not exists idx_lp_pihak_manual_lp on bdb_lp_pihak_manual(lp_id);
