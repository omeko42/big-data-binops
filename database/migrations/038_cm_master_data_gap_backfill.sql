-- 038_cm_master_data_gap_backfill.sql
-- ~30 ID master (cm_jenis_kejahatan, cm_kategori_lokasi, cm_motif_kejahatan, cm_modus_operandi,
-- cm_undang_undang) yang dipakai oleh payload DORS tapi tidak ikut ter-dump di backup lama
-- (037_seed_cm_master_data.sql) -- kemungkinan sudah soft-deleted di sistem asal sebelum dump
-- diambil. Nama direkonstruksi dari payload_json DORS (bdb_dors_raw_lp) yang masih merekam nama
-- entitasnya. Ditemukan via halaman Integrasi > Master Data Tidak Termapping. Idempotent.
-- Jalankan SETELAH 037_seed_cm_master_data.sql.

insert into cm_jenis_kejahatan (id, keterangan, id_sub_golongan, kasus_menonjol, atensi_pimpinan, pasal_mapping, status_aktif, kasus_menojol, created_at, updated_at)
values
 (717,'Penyanderaan',1,false,0,'451 UU 1/2023',true,false,now(),now()),
 (719,'Mengganggu ketentraman dengan memberikan teriakan isyarat palsu',1,false,0,'265 UU 1/2023,265 Huruf a UU 1/2023',true,false,now(),now()),
 (721,'Tentang merintangi jalan',1,false,0,'268 UU 1/2023,317 UU 1/2023',true,false,now(),now()),
 (730,'Penganiayaan Ringan',1,false,1,'471 UU 1/2023',true,false,now(),now()),
 (731,'Penipuan Ringan',1,false,0,'494 UU 1/2023',true,false,now(),now()),
 (732,'Penipuan terhadap pembeli',1,false,0,'493 UU 1/2023',true,false,now(),now()),
 (733,'Perusakan ringan',1,false,0,'521 UU 1/2023',true,false,now(),now()),
 (735,'Kenakalan terhadap orang atau barang',1,false,0,'331 UU 1/2023',true,false,now(),now()),
 (740,'Menghancurkan atau merusak barang',1,false,0,'521 Ayat (1) UU 1/2023,521 Ayat (2) UU 1/2023,524 UU 1/2023',true,false,now(),now())
on conflict (id) do nothing;
select setval('cm_jenis_kejahatan_id_seq', (select max(id) from cm_jenis_kejahatan));

insert into cm_kategori_lokasi (id, name, created_at, updated_at) values
 (0,'(Tidak diketahui - dari DORS)',now(),now()),
 (78,'APARTEMEN',now(),now()),
 (112,'Taman Bermain',now(),now()),
 (114,'Hutan Lindung',now(),now()),
 (122,'Pertanian/Ladang',now(),now()),
 (123,'Semak/Lahan Terbuka',now(),now()),
 (125,'Indomaret',now(),now()),
 (126,'Alfamart',now(),now()),
 (127,'Bengkel',now(),now()),
 (128,'Ruko',now(),now())
on conflict (id) do nothing;
select setval('cm_kategori_lokasi_id_seq', (select max(id) from cm_kategori_lokasi));

insert into cm_motif_kejahatan (id, name, created_at, updated_at) values
 (24,'(Tidak diketahui - dari DORS)',now(),now())
on conflict (id) do nothing;
select setval('cm_motif_kejahatan_id_seq', (select max(id) from cm_motif_kejahatan));

insert into cm_modus_operandi (id, name, created_at, updated_at) values
 (133,'(Tidak diketahui - dari DORS)',now(),now()),
 (142,'(Tidak diketahui - dari DORS)',now(),now()),
 (144,'(Tidak diketahui - dari DORS)',now(),now()),
 (151,'(Tidak diketahui - dari DORS)',now(),now()),
 (153,'(Tidak diketahui - dari DORS)',now(),now()),
 (157,'(Tidak diketahui - dari DORS)',now(),now())
on conflict (id) do nothing;
select setval('cm_modus_operandi_id_seq', (select max(id) from cm_modus_operandi));

-- 4 ID undang-undang yang dipakai di rincian tindak_pidana (payload DORS) tapi hilang dari dump --
-- berdampak ke ribuan LP (mis. id 490 = KUHP baru UU 1/2023, dipakai 3.321 LP).
insert into cm_undang_undang (id, name, created_at, updated_at) values
 (474,'Undang-undang (UU) Nomor 2 Tahun 2025 tentang Perubahan Keempat atas Undang-Undang Nomor 4 Tahun 2009 tentang Pertambangan Mineral dan Batubara',now(),now()),
 (490,'Undang-Undang Nomor 1 Tahun 2023 Tentang  KUHP',now(),now()),
 (491,'Undang-Undang Nomor 1 Tahun 2026 tentang Penyesuaian Pidana',now(),now()),
 (515,'UU Nomor 11 Tahun 2008 tentang Informasi dan Transaksi Elektronik',now(),now())
on conflict (id) do nothing;
select setval('cm_undang_undang_id_seq', (select max(id) from cm_undang_undang));

-- 8 kode desa TKP yang dipakai payload DORS tapi hilang dari dump -- kode wilayah (provinsi/
-- kabupaten/kecamatan) dari payload cocok skema BPS/Kemendagri yg sama dgn cm_provinsi/kabupaten/
-- kecamatan.code, jadi bisa direkonstruksi penuh dgn induknya (bukan cuma placeholder).
insert into cm_desa (code, name, "kecamatanCode", "kabupatenCode", "provinsiCode", status_aktif, status, created_at, updated_at) values
 (9692011328,'TAWABI',8204060,8204,82,true,'A',now(),now()),
 (9692011026,'DESA KERKEP',3506100,3506,35,true,'A',now(),now()),
 (9692011034,'NUNUSUNU',5304061,5304,53,true,'A',now(),now()),
 (9692011062,'TUUTU',7102190,7102,71,true,'A',now(),now()),
 (9692011128,'WELALA',7411050,7411,74,true,'A',now(),now()),
 (9692011217,'ORIMAKURUNGA',8204062,8204,82,true,'A',now(),now()),
 (9692011222,'KRENCENG',3506120,3506,35,true,'A',now(),now()),
 (9692011329,'GURUAPIN',8204060,8204,82,true,'A',now(),now())
on conflict (code) do nothing;

-- Sejak ini, gap sejenis di atas TIDAK PERLU migration manual lagi -- LaporanPolisiService
-- .autoRegisterMasterData() (dipanggil dari linkMasterData(), jalan tiap sync DORS) otomatis
-- mendaftarkan ID master baru (jenis_kejahatan/kategori_lokasi/motif/modus/undang_undang/
-- provinsi/kabupaten/kecamatan/desa) begitu payload DORS membawa ID yang belum ada di cm_*.
-- TIDAK berlaku utk cm_polda/cm_polres/cm_polsek -- itu tetap manual via menu
-- Rekonsiliasi Satker (Data Lama) krn berpotensi tumpang tindih dgn bdb_satker.
