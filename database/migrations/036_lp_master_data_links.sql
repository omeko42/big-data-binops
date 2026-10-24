-- 036_lp_master_data_links.sql
-- Payload DORS (bdb_dors_raw_lp.payload_json) memuat ID master (jenis kejahatan, kategori lokasi,
-- motif, modus operandi, wilayah TKP, undang-undang) yang cocok dgn tabel cm_* (diimpor dari backup
-- lama). Sebelumnya bdb_laporan_polisi hanya simpan salinan teks bebas (kategori, tempat_kejadian) --
-- linknya hilang. Tabel/kolom ini mengembalikan link tsb (idempotent).

alter table bdb_laporan_polisi add column if not exists jenis_kejahatan_id bigint references cm_jenis_kejahatan(id) on delete set null;
alter table bdb_laporan_polisi add column if not exists kategori_lokasi_id bigint references cm_kategori_lokasi(id) on delete set null;
alter table bdb_laporan_polisi add column if not exists motif_kejahatan_id bigint references cm_motif_kejahatan(id) on delete set null;
alter table bdb_laporan_polisi add column if not exists modus_operandi_id bigint references cm_modus_operandi(id) on delete set null;
alter table bdb_laporan_polisi add column if not exists tkp_provinsi_code bigint references cm_provinsi(code) on delete set null;
alter table bdb_laporan_polisi add column if not exists tkp_kabupaten_code bigint references cm_kabupaten(code) on delete set null;
alter table bdb_laporan_polisi add column if not exists tkp_kecamatan_code bigint references cm_kecamatann(code) on delete set null;
alter table bdb_laporan_polisi add column if not exists tkp_desa_code bigint references cm_desa(code) on delete set null;
alter table bdb_laporan_polisi add column if not exists master_data_linked_at timestamp;

create index if not exists bdb_laporan_polisi_jk_idx on bdb_laporan_polisi (jenis_kejahatan_id);
create index if not exists bdb_laporan_polisi_lokasi_idx on bdb_laporan_polisi (kategori_lokasi_id);

-- Rincian tindak pidana per LP (payload_json->'tindak_pidana' bisa berisi >1 entri pasal/UU per LP;
-- disimpan sbg baris terpisah supaya tidak ada informasi yang hilang saat diringkas jadi kolom skalar).
create table if not exists bdb_lp_tindak_pidana_dors (
    id                     bigserial primary key,
    laporan_polisi_id      bigint not null references bdb_laporan_polisi(id) on delete cascade,
    dors_tp_id             bigint,
    jenis_kejahatan_id     bigint references cm_jenis_kejahatan(id) on delete set null,
    undang_undang_id       bigint references cm_undang_undang(id) on delete set null,
    nama_kategori_kejahatan text,
    nama_uu                text,
    pasal_mapping          text,
    pasal_tambahan         text,
    juncto                 text,
    subsider               text,
    created_at             timestamp not null default now(),
    unique (laporan_polisi_id, dors_tp_id)
);
create index if not exists bdb_lp_tp_dors_lp_idx on bdb_lp_tindak_pidana_dors(laporan_polisi_id);
