# Audit laporan wilayah — 3 September 2026
## Status terbaru — LIVE, 3 September 2026 21.39 WIB

Permintaan terakhir: bereskan kendala yang sudah diaudit dan pasang live dahulu; sisanya ditentukan kemudian. Berangas/Alalak dan empat Polsek Mempawah/Kubu Raya sudah dikoreksi. Bukti lengkap: VERIFIED-FINAL-REGIONS.md. Bagian audit berikutnya merupakan kondisi sebelum perbaikan ini.

- Barito Kuala kini 17 Polsek aktif. Sebanyak 25 LP pada master Berangas dikonsolidasikan ke Alalak; akun Alalak memiliki 46 LP seluruh periode, 20 tahun 2026. Master lama dan unit duplikat tidak dihapus, hanya dikeluarkan dari pemetaan/kinerja/tujuan aktif.
- Teluk Pakedai, Terentang, Kubu, Batu Ampar kini berada pada Polres Kubu Raya. Empat override hierarki mempertahankan koreksi setelah restart tanpa mengganti kode historis.
- Kubu: 6 LP dari master lama dikonsolidasikan ke master yang dipakai akun. Dua field klasifikasi master baru yang kosong juga diperbaiki (Polsek STRUCTURAL, Unit Reskrim INTERNAL_RESERSE, keduanya INTERNAL_POLRI). Akun Kubu kini 6 LP seluruh periode, 4 tahun 2026 melalui daftar dan statistik.
- Penrang: diuji melalui jalur daftar layanan dengan kolom keluaran dibatasi metadata. Daftar dan statistik sama: 14 seluruh periode, 5 tahun 2025, 8 tahun 2026. Bukan klaim seluruh data DORS sudah lengkap.
- Pitumpanua tetap 112/42 (seluruh periode/2026), Ciamis tetap 581/188; koreksi sebelumnya bertahan setelah restart.
- Audit final 1792663; backup server /home/clouduser/codex-backups/bdb-api/final-regions-v2-20260903-143723. API dan web HTTP200. Job463/464 tetap success, tidak dihentikan.

Tidak membaca isi kasus, identitas pihak, dokumen, password/token; tidak mengubah isi/status/riwayat LP maupun role/scope akun. Hanya metadata master, alias, serta 31 alamat kepemilikan LP. Aturan Harkamtibmas nasional dan pekerjaan lain di luar paket ini belum diubah.

## Audit ulang empat foto terbaru — 3 September 2026 21.15 WIB (READ-ONLY)

Permintaan pengguna hanya cek ulang penafsiran kendala. Tidak mengubah kode/data produksi pada audit ulang ini. Keluhan master/hierarki, data terbelah, dan akses tidak boleh disamaratakan menjadi masalah Harkamtibmas.

- BaritoKuala12615 masih18Polsekaktif. BERANGAS12641/unit12643 memiliki25LP dan ALALAK19870/unit20901 memiliki21LP; keduanya memiliki sumberDORS POLSEKALALAK, kode060.23.31.18, parentPOLRESBARITOKUALA. Belum dikonsolidasikan. Pengguna melaporkan seharusnya17Polsek karenaBerangasbergantinamaAlalak.
- Mempawah11757 masih menjadi parentTelukPakedai11786,Terentang11789,Kubu11792,BatuAmpar11795. Masing-masing9/1/6/4LP bersumberPOLRESKUBURAYA kode060.21.37. TargetPolresKubuRaya12282. Kubu juga memiliki masterkedua21027/unit21028 diKubuRaya(kosong pada queryLPaktif). Belumdikoreksi. SaatiniMempawah14Polsekaktif,KubuRaya4.
- Ciamis: koreksisebelumnya bertahan; Pangandaran6371 parent6878. Seluruh581LPaksesakun14353 beralamat sumberPOLRESCIAMIS;188tahun2026. Tidak ada kelompok sumberPangandaran pada akunini.
- Penrangakun15957/scope15552:14LPseluruhtahun,8tahun2026 melalui statistikserviceproduksi. Kondisifoto2LP2025 tidakreproduksi pada backend; belumverifikasi UI/filter akun dan belumklaimkelengkapanterhadapDORSlive.
- Pitumpanuaakun15950/scope20952:112LPseluruhtahun,42tahun2026; konsolidasiyangtelahdipasang tetapberlaku.

Tambahan pekerjaan belumselesai dari fotoini adalah konsolidasiBerangas/Alalak dan perbaikansalahindukempatPolsekMempawah/KubuRaya(denganreviewduplikatKubu). Dua masalah ini berbeda dari aturanpenangananHarkamtibmas yang dibahas sebelumnya.

## Pembaruan — koreksi master sudah LIVE, 3 September 2026 20.53 WIB

Pengguna menyetujui koreksi master dan kemudian secara eksplisit menyetujui pembacaan cuplikan kode/metadata ke sesi ini setelah dijelaskan bahwa pemrosesan AI tidak sepenuhnya lokal. Batas tambahan: tidak menyentuh isi sensitif kasus atau password/token. Perbaikan menggunakan metadata satker, scope akun, dan alamat pemilik LP saja. Cadangan tetap di server.

- Empat induk Polsek dikoreksi: Pangandaran -> Polres Pangandaran; Rantepao/Sanggalangi/Sesean -> Polres Toraja Utara.
- Empat aturan hierarchyParentOverrides ditambahkan di runtime dan source SatkerService agar bootstrap tidak mengembalikan parent ke lineage historis. ID/kode DORS lama tidak diganti.
- Julian15597 direlink11716 ->19785, termasuk scope_satker_key dan requested_scope pasangan. Role tidak berubah. Total163 LP,73tahun2026.
- Pitumpanua:56 LP pemiliklama15541/15543 ->20254/20952, tanpa perubahan isi/status/riwayat. Snapshot selaras. Akun15950 kini112 LP,42tahun2026.
- LAPRI15512/15514 dan Pitumpanualama15541/15543 nonaktif untuk mapping/kinerja/tujuan; tidak dihapus. Tidak tersisa LP/akun yang bergantung pada empat node duplikat itu.
- Tujuh alias ditambahkan, IDs6214..6220, termasuk unit RESKRIM dan identitas legacy; alias lama yang historis dipertahankan.
- Audit1790043. Backupserver /home/clouduser/codex-backups/bdb-api/regional-master-20260903-135102. Verifikasi setelah restart lulus; job463/464 tetap success.

Harkamtibmas belum boleh diklaim selesai nasional. Kamus live memisahkan SATRESNARKOBA->NARKOBA dan SATRESPPADANPPO->PPA. Salinan DORS untuk69 LP PolsekHSU masih levelpolsek/unitRESKRIM; master tidak memiliki penanda Harkamtibmas yang tepercaya. Pengguna diminta daftar PolsekHarkamtibmas atau contoh IDLP dengan tujuan DORS terbaruPolres. Tidak melakukan klasifikasi/pemindahan berdasarkan isi perkara.

Rincian bukti terbaru: VERIFIED-MASTER.md. Bagian di bawah adalah rekaman audit sebelumnya, bukan status final terkini.

## Status terbaru — 3 September 2026, 20.14 WIB
Perbaikan helper akses operasional exact-owner sudah LIVE. Pengguna meminta melanjutkan perbaikan setelah pemeriksaan job. Sebelum deployment job463 dan464 sudah success; tidak ada job running atau aktivitas mapping. Tidak menghentikan job.
Hanya common/lp-scope.util.js dan source TypeScript pasangannya yang diganti. Backup: /home/clouduser/codex-backups/bdb-api/regional-owner-scope-20260903-131306. Empat tes runtime/source lulus, health HTTP200, verifikasi service produksi read-only lulus untuk empat akun. Detail bukti di VERIFIED.md.
Temuan master, relasi akun, dan transfer di bawah belum diubah oleh pemasangan ini. Catatan status kandidat di bagian berikut adalah rekaman audit sebelum deployment.

## Status pekerjaan saat audit awal
DLHK38 provinsi selesai LIVE: audit1699189, total master eksternal6552, lookup live25+13 halaman dan38 pilihan LP terverifikasi.
Audit regional READ-ONLY. Tidak ada akun, LP, parent satker, riwayat transfer, atau master satker regional yang diubah.
Kandidat perbaikan helper akses ada di patched/lp-scope.util.{js,ts}; belum live. Empat tes lulus pada runtime server; integrasi kandidat terhadap data live via koneksi read-only juga lulus.
Deployment memerlukan restart backend. Job463 aktif; pengguna telah ditanya secara asynchronous apakah boleh menghentikannya. Belum ada persetujuan. Jangan restart tanpa persetujuan atau bukti job sudah selesai.

## Ketentuan pengguna terbaru
- Polsek penyidik tetap menangani LP sendiri.
- Untuk Polsek Harkamtibmas, narkoba harus ditangani Satresnarkoba Polres induk dan PPA/PPO oleh fungsi PPA/PPO, bukan semuanya Satreskrim.
- Pengguna menjelaskan DORS sudah otomatis melimpahkan ke Polres induk. CAS harus mengikuti alamat tujuan DORS dan unit fungsinya.
- Jangan menyimpulkan pemilik penanganan dari nomor LP/origin atau jenis kejahatan saja.
- Master saat ini tidak punya penanda Harkamtibmas yang dapat dipercaya: operational_role NULL untuk semua Polsek. Tidak membuat flag palsu dari kinerja_aktif/dors_status.
- Salinan DORS dalam CAS bukan bukti keadaan DORS hari ini. Contoh narkoba HSU masih unitRESKRIM levelpolsek, pelimpahan0, raw_syncedAgustus. DORS live belum dicek perLP.

## Temuan terbukti
1. Scope operasional terlalu luas
Runtime common/lp-scope.util.js operationalLpScopeIds memasukkan semua Polsek dan Unit Reskrim Polsek bagi Satreskrim Polres tanpa cek Harkamtibmas. Helper dipakai baca dan tulis; ini memberi akses lintas pemilik unit, bukan sekadar rollup.
Aturan tersebut sudah ada dalam salinan source30Agustus sebelum patch alamat LP/DLHK hari ini. File helper aktif mtime27Agustus, tetapi mtime bukan bukti tanggal awal introduksi.
- Bone Bolango, user14843/Hendra, scope17093:188 LP2026 terlihat =135 milikSatreskrim+53 milikPolsek.
- HSU, user14970, scope12518:57 LP2026 terlihat =36 milikSatreskrim+21 milikPolsek. Di seluruh tahun ada26 LP dengan label Narkotika/Narkoba pada unitPolsek yang ikut terlihat.
- Ciamis, user14353, scope19437:288 LP2026 terlihat =188 milikSatreskrim+100 milikPolsek.
Candidate exact-owner fixes list and stats consistently to135/36/188; denies write access to foreign Polsek. Rekap hierarchy and superadmin role guards not changed.

2. Pangandaran/Ciamis
MasterPolsekPangandaran6371 masih parent6318 PolresCiamis. DORSraw menyebut PolresPangandaran. Alias2787 juga menyebut parentPangandaran tetapi menunjuk master6371 yang parentnyaCiamis. Unit6373 memiliki21LP (11tahun2026). Ini master/alias-parent salah ditambah pelebaran scope, bukan error browser.

3. Toraja Utara
Rantepao15379, Sanggalangi15391, Sesean15400 masih parent15371 PolresTanaToraja; DORSraw menunjuk PolresTorajaUtara15667. LP masing-masing18/5/12. SebagianRantepao3 danSesean1 rawunitSAMAPTA tetapi dipetakan keUnitReskrim: perlu reviewfungsi, jangan pindahkan semua tanpa cek.
Tidak mengubah parent saat audit.

4. LAPRI/Lappariaja
MasterLAPRI15512/Unit15514 kosong. Lappariaja20246/Unit20950 memiliki31LP,11tahun2026, akun16131. Jangan delete luas; bila disetujui, konsolidasikan alias dan nonaktifkan masterduplikat setelah cek semua referensi.

5. Julian Rahmadani
User15597 scope11716 SAT NARKOBA RESTA PONTIANAK KOTA kosong.
Master19785 SAT NARKOBA RESTA PONTIANAK di bawahPolresta yang sama11713 memiliki145LP,73tahun2026, sesuai unitSATRESNARKOBA pada DORS.
Masalah tautan akun ke masterlama, sejenis kasusIka. Belum relink (permintaan awal laporan adalah audit).

6. Pitumpanua
Akun15950 scope20952 UnitReskrimPolsekUrbanPitumpanua memiliki39LP,3tahun2026.
Unitlama15543 memiliki56LP,39tahun2026. Kedua kelompok mempunyai DORS polseknameURBAN PITUMPANUA, kode060.27.41.14 dan kode_pusiknas060.01.25.21.01 yang sama; data terbelah karena master/alias lama-baru.
Total95LP,42tahun2026 jika dikonsolidasikan, sebelum mempertimbangkan5raw2025 yang baru ditarikjob463 dan belum masukCAS. Jangan restart mappingjob aktif tanpa izin.
Belum memindahkan LP.

7. Penrang
Akun15957 scope15552 saat audit sudah terlihat14LP semua tahun,8tahun2026. Klaimfoto2LP2025 tidak lagi mereproduksi jumlah saat ini. Perlu ulang uji akun/filter setelah job selesai bila masih dilaporkan.
Tidak mengklaim semua LP DORS sudah lengkap.

8. LP7Jembrana
CAS281806, nomorLP/A/7/VII/2026/SPKT.SATRESKRIM/POLRES JEMBRANA/POLDA BALI.
sudah_dilimpahkan=true; dilimpahkan_eksternal=true.
Riwayat2087: user229 I KOMANG CITA MULYA UTAMA pada2026-08-31 05:28UTC (12:28WIB) ke eksternal2676 KPPBC KabupatenJembrana. Nomor/tanggal dokumen NULL.
Jadi hilang dari daftaroperator dan read-only arsip sesuai penandaeksternal, meskipun labelinternal lama masih tampil. Jangan rollback transfer riil tanpa persetujuan. Audit tidak menghapus sejarah.
Candidate scope tetap melindungiLPeksternal tersebut.

## Job463
Read at approximately08:15UTC: running, manual2025-02-01..2025-03-01, halaman392/627, total_fetched35874,total_upserted35261; started07:37:33UTC.
Restart akan membuat bootstrap menandai runningjob error; data/checkpoint tersimpan tetap ada, tetapi penarikan perlu dijalankan lagi dengan rentang sama. Jangan menjanjikan resume halaman otomatis.
Belum ada perubahan pada job.

## Artefak
- before/: salinan kode produksi aktual.
- discovery-results.json, scope-results.json, source-results.json: bukti metadata wilayah/LP terbatas (tanpa password/token).
- scripts/: audit read-only.
- patched/: kandidat exact-owner helper, unit tests, preflight.
- Candidate server: /tmp/regional-lp-scope-candidate-20260903 dalam bdb-api; tidak mengganti dist/srcaktif.
- Filehelperbaseline JS349bde832801b4fc2b1bc27d9444b876710c8bf47d8e667314dc6793c281b034; TS9ec25bf4cc7ad8f6d09524f215530e8f7cc7e41753c5eb79aa6fb0c29ead7ab2.
- CurrentLPserviceSHA31b4109abc128bcc361c73bb52a458c73da16378e9460cd06208ce351ce024fa matches patchalamatsebelumnya.
