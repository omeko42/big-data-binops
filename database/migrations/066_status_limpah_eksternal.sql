-- Status baru "Dilimpahkan ke Instansi Eksternal" (kategori CC) -- dipakai saat LP dilimpahkan
-- lewat menu Pelimpahan LP ke Satker Eksternal (mis. Kejaksaan, BNN, dst di luar hierarki
-- bdb_satker). Berbeda dari TAHAP_II (Penyerahan tersangka & BB ke Kejaksaan lewat dokumen
-- workflow biasa) -- status ini menandai bahwa PENANGANAN LP itu sendiri sudah berpindah
-- keluar dari struktur satker Polri, bukan sekadar tahap dokumen berkas.
--
-- kategori='CC' supaya otomatis terhitung Crime Complete di Anev CT/CC & Kinerja Perkara
-- (keduanya baca murni dari bdb_status_master.kategori / bdb_laporan_polisi.tanggal_selesai,
-- tidak perlu perubahan lain di kedua modul itu).
insert into bdb_status_master (code, nama, urutan, kategori)
select 'LIMPAH_EKSTERNAL', 'Dilimpahkan ke Instansi Eksternal', coalesce((select max(urutan) from bdb_status_master), 0) + 1, 'CC'
where not exists (select 1 from bdb_status_master where code = 'LIMPAH_EKSTERNAL');
