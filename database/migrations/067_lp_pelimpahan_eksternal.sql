-- Perluasan Pelimpahan LP: mendukung tujuan Satker Eksternal (instansi di luar hierarki
-- bdb_satker, mis. Kejaksaan) selain sesama satker Polri seperti sebelumnya.
--
-- satker_tujuan_id jadi NULLABLE (dulu wajib diisi krn tujuan cuma bisa internal). Tepat SATU
-- dari satker_tujuan_id (internal) / satker_eksternal_id (eksternal) yang boleh terisi per baris
-- riwayat -- dijaga lewat CHECK constraint, bukan cuma disiplin aplikasi.
alter table bdb_lp_pelimpahan alter column satker_tujuan_id drop not null;
alter table bdb_lp_pelimpahan add column if not exists satker_eksternal_id bigint references bdb_satker_eksternal(id);
alter table bdb_lp_pelimpahan add column if not exists satker_eksternal_nama text;
create index if not exists bdb_lp_pelimpahan_eksternal_idx on bdb_lp_pelimpahan(satker_eksternal_id);

alter table bdb_lp_pelimpahan drop constraint if exists chk_lp_pelimpahan_tujuan;
alter table bdb_lp_pelimpahan add constraint chk_lp_pelimpahan_tujuan check (
    (satker_tujuan_id is not null and satker_eksternal_id is null)
    or (satker_tujuan_id is null and satker_eksternal_id is not null)
);

-- Flag terpisah dari sudah_dilimpahkan (yang juga dipakai pelimpahan internal): begitu true,
-- LP dianggap SELESAI ditangani Polri (status kategori CC) dan satker terakhir yang memegangnya
-- kehilangan akses aktif -- persis semantik pelimpahan internal, tapi tidak bisa "pindah lagi"
-- krn satker_id LP TETAP di satker Polri terakhir (satker eksternal bukan bagian hierarki
-- bdb_satker, tidak bisa jadi target FK satker_id). Riwayat lengkap tetap tercatat di
-- bdb_lp_pelimpahan dan tetap bisa dilihat lewat menu Arsip LP Pelimpahan (read-only) oleh
-- satker yang pernah jadi asal.
alter table bdb_laporan_polisi add column if not exists dilimpahkan_eksternal boolean not null default false;
create index if not exists bdb_laporan_polisi_dilimpahkan_eksternal_idx on bdb_laporan_polisi(dilimpahkan_eksternal);
