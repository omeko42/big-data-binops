# Inventarisasi Skema Database Produksi BDB (Bareskrim Database)

> **Sumber Ekstraksi:** PostgreSQL 15 Live Production (`public` schema via `bdb-api`)  
> **Waktu Ekstraksi:** `2026-10-24T07:12:02.432Z`  
> **File DDL Utama:** [`database/schema/000_live_production_schema.sql`](./000_live_production_schema.sql)

---

## Ringkasan Eksekutif Statistik Skema

| Komponen Skema | Jumlah Aktif | Keterangan |
| :--- | ---: | :--- |
| **Tabel Produksi Aktif** | **171** | Diambil dari total 423 relasi (251 tabel *backup*/*patch_backup* sementara diabaikan) |
| **Views Aktif** | **1 (+1)** | `bdb_satker_taxonomy_r11` (SQL View) + `bdb_jukrah_view` (Tabel katalog view) |
| **Total Kolom** | **2.283** | Seluruh kolom aktif beserta tipe data, `DEFAULT`, dan `NOT NULL` |
| **Total Constraints** | **496** | Mencakup `PRIMARY KEY`, `UNIQUE`, `FOREIGN KEY`, dan `CHECK` |
| **Total Indexes** | **433** | B-Tree, Unique, Partial, dan GIN Trigram Indexes (`pg_trgm`) |
| **Custom SQL Functions** | **7** | Fungsi PL/pgSQL & SQL kustom untuk otomatisasi trigger dan klasifikasi R11 |
| **Active Triggers** | **5** | Trigger sinkronisasi real-time snapshot, pemetaan unit otomatis, dan validasi tanggal |
| **Total Baris Data Aktif** | **~68.890.877** | Akumulasi baris pada seluruh tabel produksi aktif |

---

## Rekapitulasi Domain Fungsional

| No | Domain Fungsional | Jumlah Tabel/View | Estimasi Total Baris |
| :-: | :--- | ---: | ---: |
| 1 | **Authentication, RBAC & Audit Governance** | 18 | 5.515.190 |
| 2 | **Master Satker & Hirarki Organisasi** | 7 | 26.588 |
| 3 | **DORS Ingestion & Raw Mirror** | 20 | 54.816.216 |
| 4 | **Laporan Polisi & Dokumen Penyidikan (Mindik)** | 18 | 5.186.315 |
| 5 | **Kinerja Perkara & ANEV Snapshots** | 10 | 2.625.365 |
| 6 | **Pihak Terlibat & DPO** | 5 | 424.524 |
| 7 | **Barang Bukti** | 2 | 171.614 |
| 8 | **Kasus Menonjol (Susjol) & Kasus Atensi** | 6 | 969 |
| 9 | **Operasi Satgas, Kerma & Jukrah** | 8 | 36 |
| 10 | **SHARESE Social, Chat & Notifications** | 11 | 14.889 |
| 11 | **Master Referensi Pusiknas (`cm_*`)** | 28 | 105.128 |
| 12 | **Legacy & Specialized Tables (`trb_*`, `tm_*`, `an_*`, `ac_*`, `app_*`)** | 39 | 4.043 |

---

## 1. Authentication, RBAC & Audit Governance

Mengelola identitas pengguna, autentikasi multi-metode (Password, Google/Polri SSO, WebAuthn Passkey), otorisasi berbasis Role & Cakupan Satker (RBAC), audit trail, serta parameter sistem.

| Nama Tabel / View | Tipe | Jml Kolom | Jml Index | Jumlah Baris Produksi | Fungsi Utama |
| :--- | :-: | ---: | ---: | ---: | :--- |
| `auth_users` | `TABLE` | 66 | 10 | **3.611** | Tabel utama akun pengguna BDB (personel Polri/operator/admin/pimpinan), menyimpan kredensial, role_bdb, cakupan satker (scope_satker_id), status persetujuan, dan pengaturan 2FA/OTP. |
| `auth_devices` | `TABLE` | 20 | 2 | **37.602** | Registri sesi dan perangkat login aktif pengguna (device token, IP, user agent, refresh token session). |
| `auth_passkeys` | `TABLE` | 15 | 4 | **4** | Penyimpanan kredensial WebAuthn / Passkey (FIDO2 public key, credential_id, counter, transports) untuk autentikasi biometrik tanpa password. |
| `auth_passkey_challenges` | `TABLE` | 6 | 3 | **138** | Penyimpanan challenge sementara (ephemeral nonce) untuk proses registrasi dan verifikasi login WebAuthn/Passkey. |
| `auth_user_mutations` | `TABLE` | 19 | 2 | **50** | Riwayat mutasi jabatan/satker pengguna serta pengajuan perpindahan satker atau perubahan role. |
| `auth_users_activity_cache` | `TABLE` | 9 | 1 | **3.624** | Cache metrik aktivitas pengguna (skor keaktifan login, jumlah aksi, waktu aktif terakhir) untuk pemantauan operator. |
| `auth_role` | `TABLE` | 2 | 1 | **0** | Tabel definisi role autentikasi dasar (kompatibilitas modul autentikasi RBAC). |
| `auth_role_permission_permission` | `TABLE` | 2 | 3 | **0** | Tabel pivot relasi many-to-many antara auth_role dan permission. |
| `permission` | `TABLE` | 20 | 2 | **134** | Daftar master hak akses (permission node) sistem. |
| `permission_closure` | `TABLE` | 2 | 3 | **175** | Tabel closure tree hirarki hak akses (ancestor-descendant permission). |
| `bdb_menu_role_access` | `TABLE` | 5 | 2 | **3** | Konfigurasi matriks hak akses menu navigasi berdasarkan role_bdb. |
| `bdb_bulk_password_reset_job` | `TABLE` | 10 | 1 | **1** | Header job eksekusi reset password massal oleh Superadmin. |
| `bdb_bulk_password_reset_item` | `TABLE` | 7 | 2 | **117** | Detail item akun pengguna pada setiap job reset password massal. |
| `bdb_integration_client` | `TABLE` | 13 | 3 | **1** | Kredensial klien integrasi API eksternal (machine-to-machine client authentication). |
| `bdb_audit_log` | `TABLE` | 10 | 5 | **5.469.632** | Log audit komprehensif seluruh aktivitas pengguna dan API (login, pembacaan data sensitif, mutasi LP/dokumen, ekspor laporan). |
| `bdb_system_settings` | `TABLE` | 4 | 1 | **10** | Penyimpanan konfigurasi parameter global sistem BDB (key-value JSON/text settings). |
| `bdb_panduan_pengguna` | `TABLE` | 14 | 2 | **1** | Manajemen dokumen panduan pengguna (User Manual PDF/dokumen bantuan per role). |
| `bdb_schema_migrations` | `TABLE` | 2 | 1 | **87** | Tabel pelacakan versi file migrasi SQL (`001` s/d `089`) yang telah dieksekusi di produksi. |

## 2. Master Satker & Hirarki Organisasi

Menyimpan struktur pohon organisasi Polri dari tingkat Mabes/Bareskrim, Polda, Polres, hingga Polsek dan Unit Fungsi, termasuk pemetaan kode DORS dan taksonomi R11.

| Nama Tabel / View | Tipe | Jml Kolom | Jml Index | Jumlah Baris Produksi | Fungsi Utama |
| :--- | :-: | ---: | ---: | ---: | :--- |
| `bdb_satker` | `TABLE` | 39 | 13 | **14.217** | Tabel master utama pohon hirarki Satuan Kerja Polri (Mabes/Bareskrim, Polda, Polres, Polsek, Direktorat, Satuan Fungsi, dan Unit) beserta klasifikasi taksonomi R11 dan kode DORS. |
| `bdb_satker_eksternal` | `TABLE` | 8 | 2 | **6.666** | Daftar instansi/satker eksternal non-Polri atau lintas instansi (Kejaksaan, BNN, Bea Cukai, PPNS, Polisi Militer) untuk tujuan pelimpahan perkara eksternal. |
| `bdb_satker_master` | `TABLE` | 24 | 4 | **14** | Tabel referensi satker tingkat tinggi generasi awal BDB. |
| `bdb_satker_profiles` | `TABLE` | 18 | 3 | **0** | Profil detail satuan kerja (alamat kantor, koordinat lokasi, kontak pejabat/operator). |
| `bdb_satker_taxonomy_r11` | `VIEW` | 28 | 0 | ***(Dinamis)*** | [SQL VIEW] View klasifikasi dinamis taksonomi R11 satker (STRUCTURAL, INTERNAL_RESERSE, EKSTERNAL_RESERSE) menggunakan fungsi bdb_satker_classify_r11. |
| `bdb_satker_taxonomy_r11_manifest` | `TABLE` | 8 | 1 | **0** | Tabel manifest snapshot hasil klasifikasi taksonomi satker R11. |
| `bdb_dors_satker_map` | `TABLE` | 10 | 2 | **5.691** | Tabel pemetaan (mapping alias & kode) nama/kode satker dan unit dari feed DORS Stamaops Polri ke ID satker kanonik di bdb_satker. |

## 3. DORS Ingestion & Raw Mirror

Menyimpan konfigurasi worker sinkronisasi, payload JSON mentah (`bdb_dors_raw_lp`), serta tabel-tabel relasional hasil normalisasi langsung dari feed DORS Stamaops Polri.

| Nama Tabel / View | Tipe | Jml Kolom | Jml Index | Jumlah Baris Produksi | Fungsi Utama |
| :--- | :-: | ---: | ---: | ---: | :--- |
| `bdb_dors_config` | `TABLE` | 12 | 1 | **1** | Konfigurasi penjadwal (scheduler), watermark sinkronisasi, dan status worker penarikan data DORS Stamaops Polri. |
| `bdb_dors_sync_log` | `TABLE` | 22 | 1 | **815** | Log histori eksekusi job sinkronisasi DORS (rentang tanggal chunk, halaman, jumlah LP masuk/diperbarui, durasi, dan error). |
| `bdb_dors_raw_lp` | `TABLE` | 11 | 5 | **2.852.128** | Penyimpanan payload JSON mentah (raw mirror) Laporan Polisi yang diterima dari API DORS Stamaops Polri. |
| `bdb_dors_lp` | `TABLE` | 50 | 2 | **2.852.161** | Tabel utama hasil normalisasi data Laporan Polisi dari DORS Stamaops Polri. |
| `bdb_dors_lp_polda` | `TABLE` | 15 | 2 | **2.851.899** | Atribut relasi tingkat Polda pada LP DORS. |
| `bdb_dors_lp_polres` | `TABLE` | 16 | 2 | **2.689.581** | Atribut relasi tingkat Polres pada LP DORS. |
| `bdb_dors_lp_polsek` | `TABLE` | 18 | 2 | **835.693** | Atribut relasi tingkat Polsek pada LP DORS. |
| `bdb_dors_lp_unit` | `TABLE` | 8 | 2 | **2.851.687** | Atribut unit fungsi penerima/penangan pada LP DORS. |
| `bdb_dors_lp_kategori_gk` | `TABLE` | 13 | 2 | **2.854.189** | Atribut golongan kejahatan / gangguan kamtibmas pada LP DORS. |
| `bdb_dors_lp_kategori_lokasi` | `TABLE` | 7 | 2 | **2.834.728** | Atribut kategori lokasi tempat kejadian perkara (TKP) pada LP DORS. |
| `bdb_dors_lp_petugas_penerima` | `TABLE` | 10 | 2 | **2.823.748** | Data petugas kepolisian penerima laporan pada LP DORS. |
| `bdb_dors_lp_tkp_provinsi` | `TABLE` | 7 | 2 | **2.850.859** | Data wilayah Provinsi TKP pada LP DORS. |
| `bdb_dors_lp_tkp_kota` | `TABLE` | 9 | 2 | **2.851.458** | Data wilayah Kabupaten/Kota TKP pada LP DORS. |
| `bdb_dors_lp_tkp_kecamatan` | `TABLE` | 9 | 2 | **2.846.747** | Data wilayah Kecamatan TKP pada LP DORS. |
| `bdb_dors_lp_tkp_desa` | `TABLE` | 10 | 2 | **2.757.192** | Data wilayah Kelurahan/Desa TKP pada LP DORS. |
| `bdb_dors_lp_tindak_pidana` | `TABLE` | 16 | 2 | **2.032.961** | Daftar pasal dan tindak pidana yang tercatat pada LP DORS. |
| `bdb_dors_lp_terlibat` | `TABLE` | 31 | 4 | **11.164.838** | Data seluruh pihak terlibat (Pelapor, Korban, Saksi, Terlapor/Tersangka) dari feed DORS (~11,16 juta baris). |
| `bdb_dors_lp_hubungan_korban_pelaku` | `TABLE` | 6 | 2 | **1.025.175** | Data relasi hubungan antara korban dan pelaku pada LP DORS. |
| `bdb_dors_lp_barang_bukti` | `TABLE` | 28 | 2 | **5.840.308** | Data barang bukti perkara dari feed DORS (~5,84 juta baris). |
| `bdb_dors_history_delete` | `TABLE` | 12 | 5 | **48** | Catatan audit penghapusan/pembatalan LP yang terdeteksi dari sinkronisasi DORS. |

## 4. Laporan Polisi & Dokumen Penyidikan (Mindik)

Inti operasional BDB yang mengelola siklus hidup Laporan Polisi (`bdb_laporan_polisi`), tahapan administrasi penyidikan (`bdb_dokumen`), pelimpahan internal/eksternal, dan rekonsiliasi status.

| Nama Tabel / View | Tipe | Jml Kolom | Jml Index | Jumlah Baris Produksi | Fungsi Utama |
| :--- | :-: | ---: | ---: | ---: | :--- |
| `bdb_laporan_polisi` | `TABLE` | 44 | 25 | **2.847.302** | Tabel inti operasional Laporan Polisi BDB (~2,85 juta LP), menggabungkan data DORS dan input operasional, status penyelesaian perkara, pemetaan satker/unit, TKP, dan klasifikasi kejahatan. |
| `bdb_lp_master` | `TABLE` | 24 | 6 | **0** | Tabel master LP skema awal BDB (menyimpan metadata distribusi dan ruang lingkup LP). |
| `bdb_lp_history_logs` | `TABLE` | 22 | 3 | **0** | Log riwayat perubahan status dan perjalanan dokumen pada bdb_lp_master. |
| `bdb_status_master` | `TABLE` | 5 | 2 | **11** | Master tahapan/status penanganan perkara (LP, Lidik, Sidik, SP2 Lidik, SP3, P21, Tahap II, RJ, Diversi, Limpah Internal/Eksternal). |
| `bdb_document_type_master` | `TABLE` | 11 | 2 | **19** | Master jenis dokumen administrasi penyidikan (Mindik) beserta aturan transisi status targetnya. |
| `bdb_dokumen` | `TABLE` | 11 | 4 | **235.849** | Tabel transaksi dokumen penyidikan (Sprin Lidik, SPDP, Sprin Sidik, SP2HP, P19, P21, Tahap II, SP3, RJ, dll.) yang diinput pada setiap LP. |
| `bdb_dokumen_pasal` | `TABLE` | 5 | 2 | **51.699** | Relasi pasal-pasal tindak pidana yang disangkakan pada dokumen penyidikan tertentu. |
| `bdb_lp_tindak_pidana` | `TABLE` | 14 | 2 | **2.669** | Daftar tindak pidana dan pasal yang dikaitkan secara operasional ke Laporan Polisi di BDB. |
| `bdb_lp_tindak_pidana_dors` | `TABLE` | 12 | 3 | **2.040.373** | Tabel relasi terindeks antara bdb_laporan_polisi dengan master jenis kejahatan & undang-undang hasil ekstraksi DORS. |
| `bdb_lp_pelimpahan` | `TABLE` | 14 | 5 | **2.627** | Transaksi pelimpahan Laporan Polisi antar-Satker/Subdit internal Polri maupun ke instansi eksternal. |
| `bdb_lp_pelimpahan_attachments` | `TABLE` | 7 | 2 | **56** | Lampiran dokumen surat pelimpahan perkara (file metadata & object key). |
| `bdb_status_override_log` | `TABLE` | 7 | 1 | **84** | Log audit perubahan/koreksi manual status Laporan Polisi oleh admin/operator. |
| `bdb_lp_status_reconcile_log` | `TABLE` | 7 | 2 | **2.578** | Log eksekusi rekonsiliasi otomatis maupun manual antara dokumen penyidikan terakhir dan status_id pada bdb_laporan_polisi. |
| `bdb_lp_monitoring_access_log` | `TABLE` | 13 | 4 | **516** | Log audit deklarasi kepatuhan akses saat pejabat/operator melihat detail LP lintas satker. |
| `bdb_distribution_letters` | `TABLE` | 13 | 2 | **0** | Data surat distribusi pelimpahan/penugasan perkara dari Biro Binops. |
| `bdb_distribution_logs` | `TABLE` | 9 | 1 | **0** | Log riwayat distribusi perkara. |
| `bdb_crime_master` | `TABLE` | 11 | 2 | **89** | Tabel master klasifikasi kejahatan kanonik BDB (pemetaan jenis kejahatan, golongan, dan direktorat pengampu). |
| `bdb_pasal_master` | `TABLE` | 5 | 2 | **2.443** | Tabel master referensi pasal pidana di BDB. |

## 5. Kinerja Perkara & ANEV Snapshots

Tabel materialisasi dan snapshot teragregasi untuk akselerasi perhitungan Kinerja Penyidikan, Crime Clearance, dan Dashboard Eksekutif ANEV secara real-time.

| Nama Tabel / View | Tipe | Jml Kolom | Jml Index | Jumlah Baris Produksi | Fungsi Utama |
| :--- | :-: | ---: | ---: | ---: | :--- |
| `bdb_kinerja_perkara_snapshot` | `TABLE` | 13 | 7 | **2.114.283** | Tabel materialisasi snapshot per-LP (~2,11 juta baris) untuk perhitungan super-cepat statistik Kinerja Penyidikan (Crime Total, Crime Clearance, Tunggakan, Persentase Penyelesaian). |
| `bdb_kinerja_perkara_snapshot_meta` | `TABLE` | 2 | 1 | **1** | Metadata waktu pembaruan terakhir (watermark) tabel bdb_kinerja_perkara_snapshot. |
| `bdb_kinerja_perkara_summary_snapshot` | `TABLE` | 8 | 3 | **14** | Snapshot agregat ringkasan kinerja perkara tingkat nasional/direktorat. |
| `bdb_kinerja_crime_group_mapping` | `TABLE` | 14 | 3 | **629** | Pemetaan jenis kejahatan Pusiknas ke dalam grup kejahatan ANEV Bareskrim (Dittipidum, Dittipideksus, Dittipidkor, Dittipidnarkoba, Dittipidsiber, Dittipidter, Ditresppa-ppo). |
| `bdb_kinerja_crime_group_mapping_version` | `TABLE` | 10 | 3 | **2** | Manajemen versi skema pengelompokan jenis kejahatan ANEV. |
| `bdb_kinerja_ppappo_crime_mapping` | `TABLE` | 8 | 3 | **34** | Pemetaan khusus jenis kejahatan di bawah domain Direktorat PPA dan PPO. |
| `bdb_anev_rekap_snapshot` | `TABLE` | 7 | 5 | **508.586** | Snapshot agregasi harian rekapitulasi ANEV per Satker, Status Perkara, dan Tanggal (~508 ribu baris). |
| `bdb_anev_dashboard_snapshot` | `TABLE` | 8 | 3 | **1.583** | Snapshot pre-computed metrik kartu & grafik Dashboard Eksekutif ANEV per bulan, tahun, dan domain fungsi. |
| `bdb_anev_report_logs` | `TABLE` | 18 | 4 | **9** | Log riwayat pencetakan/unduhan laporan eksekutif ANEV oleh pengguna. |
| `bdb_iccs_mapping_audit` | `TABLE` | 6 | 1 | **224** | Tabel audit pemetaan klasifikasi kejahatan berstandar internasional (ICCS - International Classification of Crime for Statistical Purposes). |

## 6. Pihak Terlibat & DPO

Mengelola data subjek hukum yang terlibat dalam perkara (Pelapor, Korban, Saksi, Terlapor/Tersangka), snapshot analitik pihak terlibat, serta Daftar Pencarian Orang (DPO).

| Nama Tabel / View | Tipe | Jml Kolom | Jml Index | Jumlah Baris Produksi | Fungsi Utama |
| :--- | :-: | ---: | ---: | ---: | :--- |
| `bdb_lp_pihak_manual` | `TABLE` | 23 | 2 | **0** | Data pihak terlibat (Pelapor, Korban, Saksi, Tersangka) yang ditambahkan atau diperbarui secara manual oleh penyidik pada LP di BDB. |
| `bdb_pihak_terlibat_summary_snapshot` | `TABLE` | 12 | 4 | **272.865** | Snapshot agregasi ringkasan jumlah pihak terlibat (Korban, Terlapor, Tersangka) per satker dan periode (~272 ribu baris). |
| `bdb_pihak_terlibat_ranking_snapshot` | `TABLE` | 26 | 7 | **151.659** | Snapshot peringkat kejahatan dan demografi pihak terlibat untuk analitik Susjol/ANEV (~151 ribu baris). |
| `bdb_dpo` | `TABLE` | 40 | 14 | **0** | Daftar Pencarian Orang (DPO) yang diterbitkan oleh satuan kerja reserse. |
| `bdb_dpo_arsip` | `TABLE` | 9 | 2 | **0** | Arsip pencabutan/penangkapan DPO yang telah selesai ditangani. |

## 7. Barang Bukti

Mengelola pencatatan barang bukti sitaan penyidik secara manual serta snapshot agregasi barang bukti nasional.

| Nama Tabel / View | Tipe | Jml Kolom | Jml Index | Jumlah Baris Produksi | Fungsi Utama |
| :--- | :-: | ---: | ---: | ---: | :--- |
| `bdb_lp_barang_bukti_manual` | `TABLE` | 13 | 2 | **19** | Data barang bukti sitaan yang diinput secara manual oleh penyidik pada detail Laporan Polisi. |
| `bdb_barang_bukti_summary_snapshot` | `TABLE` | 9 | 4 | **171.595** | Snapshot agregasi jenis dan kuantitas barang bukti per satker dan periode waktu (~171 ribu baris). |

## 8. Kasus Menonjol (Susjol) & Kasus Atensi

Mengelola pelaporan dan pemantauan khusus terhadap Kasus Menonjol (Susjol) dan Kasus Atensi Pimpinan/Publik beserta keterkaitannya dengan Laporan Polisi.

| Nama Tabel / View | Tipe | Jml Kolom | Jml Index | Jumlah Baris Produksi | Fungsi Utama |
| :--- | :-: | ---: | ---: | ---: | :--- |
| `bdb_kasus_menonjol` | `TABLE` | 27 | 3 | **709** | Data utama Kasus Menonjol (Susjol) yang dilaporkan oleh satuan kerja beserta kronologi, nilai kerugian, dan progres penanganan. |
| `bdb_kasus_menonjol_lp` | `TABLE` | 4 | 4 | **245** | Tabel pivot relasi antara entri Kasus Menonjol dengan satu atau lebih Laporan Polisi (`bdb_laporan_polisi`). |
| `bdb_kasus_menonjol_attachments` | `TABLE` | 7 | 2 | **6** | Lampiran dokumen/foto/paparan pada laporan Kasus Menonjol. |
| `bdb_kasus_atensi` | `TABLE` | 13 | 1 | **5** | Daftar Kasus Atensi Pimpinan / Publik yang dipantau secara khusus. |
| `bdb_kasus_atensi_lp` | `TABLE` | 4 | 2 | **4** | Tabel pivot relasi antara Kasus Atensi dengan Laporan Polisi terkait. |
| `bdb_kasus_atensi_attachments` | `TABLE` | 7 | 1 | **0** | Lampiran dokumen pendukung pada Kasus Atensi. |

## 9. Operasi Satgas, Kerma & Jukrah

Mengelola data Operasi Kepolisian / Satgas, dokumen Kerja Sama (Kerma) dalam/luar negeri, serta publikasi Petunjuk dan Arahan (Jukrah).

| Nama Tabel / View | Tipe | Jml Kolom | Jml Index | Jumlah Baris Produksi | Fungsi Utama |
| :--- | :-: | ---: | ---: | ---: | :--- |
| `bdb_operasi_satgas` | `TABLE` | 17 | 4 | **12** | Data master Operasi Kepolisian / Satuan Tugas (Satgas) khusus beserta masa berlaku operasi. |
| `bdb_operasi_satgas_jenis` | `TABLE` | 4 | 2 | **10** | Referensi jenis-jenis Operasi Kepolisian / Satgas. |
| `bdb_operasi_satgas_attachments` | `TABLE` | 7 | 2 | **1** | Lampiran dokumen Sprin/Rencana Operasi Satgas. |
| `bdb_kerma_master` | `TABLE` | 22 | 5 | **2** | Data kerja sama (MoU / PKS / Naskah Kerja Sama) dalam dan luar negeri. |
| `bdb_kerma_jenis_naskah` | `TABLE` | 4 | 2 | **8** | Master jenis naskah kerja sama kelembagaan. |
| `bdb_kerma_attachments` | `TABLE` | 7 | 2 | **0** | Lampiran file dokumen naskah kerja sama (Kerma). |
| `bdb_jukrah` | `TABLE` | 9 | 1 | **0** | Penyimpanan dokumen Petunjuk dan Arahan (Jukrah) / Surat Telegram pimpinan. |
| `bdb_jukrah_view` | `TABLE` | 4 | 2 | **3** | Tabel katalog tampilan dokumen Jukrah yang dipublikasikan ke jajaran. |

## 10. SHARESE Social, Chat & Notifications

Mendukung kolaborasi sosial internal penyidik (SHARESE), ruang percakapan, pengumuman broadcast, dan sistem notifikasi.

| Nama Tabel / View | Tipe | Jml Kolom | Jml Index | Jumlah Baris Produksi | Fungsi Utama |
| :--- | :-: | ---: | ---: | ---: | :--- |
| `bdb_social_posts` | `TABLE` | 17 | 4 | **44** | Unggahan (post/feed) pada modul jejaring internal penyidik SHARESE. |
| `bdb_social_comments` | `TABLE` | 6 | 2 | **23** | Komentar dan balasan berjenjang (threaded comments) pada unggahan SHARESE. |
| `bdb_social_reactions` | `TABLE` | 5 | 3 | **91** | Reaksi (like/apresiasi) pengguna pada unggahan SHARESE. |
| `bdb_social_bookmarks` | `TABLE` | 4 | 3 | **0** | Daftar unggahan SHARESE yang disimpan (bookmark) oleh pengguna. |
| `bdb_social_read_receipts` | `TABLE` | 5 | 4 | **6** | Catatan tanda baca (read receipts) pengguna pada unggahan penting SHARESE. |
| `bdb_social_notifications` | `TABLE` | 10 | 3 | **104** | Notifikasi interaksi sosial SHARESE (komentar, mention, reaksi, koneksi). |
| `user_connections` | `TABLE` | 6 | 5 | **3.350** | Relasi pertemanan/kolega antar-pengguna di dalam fitur jejaring internal. |
| `bdb_chat_rooms` | `TABLE` | 9 | 3 | **0** | Daftar ruang percakapan (chat rooms) internal pengguna. |
| `bdb_chat_messages` | `TABLE` | 10 | 3 | **0** | Pesan percakapan di dalam ruang chat internal. |
| `bdb_broadcast_messages` | `TABLE` | 18 | 3 | **0** | Pesan pengumuman siaran (broadcast banner/modal) dari pusat ke seluruh jajaran. |
| `bdb_notification_checkpoint` | `TABLE` | 3 | 1 | **11.271** | Penanda waktu terakhir (watermark) pembacaan notifikasi sistem per pengguna (~11,2 ribu baris). |

## 11. Master Referensi Pusiknas (`cm_*`)

Katalog referensi standar Pusiknas Bareskrim Polri yang mencakup wilayah administratif (Provinsi s/d Desa), kode kewilayahan Polri, taksonomi kejahatan, undang-undang, pasal, dan demografi.

| Nama Tabel / View | Tipe | Jml Kolom | Jml Index | Jumlah Baris Produksi | Fungsi Utama |
| :--- | :-: | ---: | ---: | ---: | :--- |
| `cm_provinsi` | `TABLE` | 12 | 1 | **37** | Master referensi kode dan nama Provinsi seluruh Indonesia (standar Pusiknas/Kemendagri). |
| `cm_kabupaten` | `TABLE` | 14 | 1 | **569** | Master referensi kode dan nama Kabupaten/Kota seluruh Indonesia. |
| `cm_kecamatann` | `TABLE` | 15 | 1 | **7.551** | Master referensi kode dan nama Kecamatan seluruh Indonesia (~7.551 kecamatan). |
| `cm_desa` | `TABLE` | 16 | 1 | **82.951** | Master referensi kode dan nama Kelurahan/Desa seluruh Indonesia (~82.951 desa). |
| `cm_polda` | `TABLE` | 42 | 1 | **37** | Master referensi kode Polda pada katalog Pusiknas. |
| `cm_polres` | `TABLE` | 30 | 1 | **521** | Master referensi kode Polres pada katalog Pusiknas. |
| `cm_polsek` | `TABLE` | 34 | 1 | **5.091** | Master referensi kode Polsek pada katalog Pusiknas (~5.091 polsek). |
| `cm_unit` | `TABLE` | 9 | 1 | **0** | Master referensi unit fungsi pada katalog Pusiknas. |
| `cm_golongan_kejahatan` | `TABLE` | 8 | 1 | **5** | Master referensi golongan kejahatan (Kejahatan Konvensional, Transnasional, Kekayaan Negara, Kontinjensi, Berimplikasi Pelanggaran). |
| `cm_golongan_kamtibmas` | `TABLE` | 8 | 1 | **4** | Master referensi golongan gangguan Kamtibmas (Kejahatan, Pelanggaran, Gangguan, Bencana). |
| `cm_sub_golongan_kamtibmas` | `TABLE` | 9 | 1 | **18** | Master referensi sub-golongan Kamtibmas. |
| `cm_iccs_kategori` | `TABLE` | 10 | 2 | **11** | Master referensi kategori kejahatan standar UNODC ICCS. |
| `cm_jenis_kejahatan` | `TABLE` | 25 | 2 | **413** | Master referensi 413 jenis kejahatan standar Pusiknas. |
| `cm_undang_undang` | `TABLE` | 9 | 1 | **367** | Master referensi 367 Undang-Undang pidana/khusus. |
| `cm_jenis_kejahatan_undang_undang_cm_undang_undang` | `TABLE` | 2 | 3 | **491** | Tabel relasi many-to-many antara jenis kejahatan dan Undang-Undang terkait. |
| `cm_pasal` | `TABLE` | 9 | 2 | **2.508** | Master referensi 2.508 pasal pidana standar Pusiknas. |
| `cm_kategori_lokasi` | `TABLE` | 8 | 1 | **217** | Master referensi 217 kategori lokasi TKP. |
| `cm_modus_operandi` | `TABLE` | 8 | 1 | **147** | Master referensi 147 modus operandi tindak pidana. |
| `cm_motif_kejahatan` | `TABLE` | 8 | 1 | **23** | Master referensi 23 motif kejahatan. |
| `cm_jenis_barang_bukti` | `TABLE` | 11 | 2 | **1.005** | Master referensi 1.005 jenis barang bukti standar Pusiknas. |
| `cm_agama` | `TABLE` | 8 | 1 | **18** | Master referensi agama. |
| `cm_jenis_kelamin` | `TABLE` | 9 | 1 | **4** | Master referensi jenis kelamin. |
| `cm_kewarganegaraan` | `TABLE` | 9 | 1 | **74** | Master referensi kewarganegaraan/negara. |
| `cm_pekerjaan` | `TABLE` | 9 | 1 | **2.140** | Master referensi 2.140 jenis profesi/pekerjaan. |
| `cm_pendidikan` | `TABLE` | 8 | 1 | **16** | Master referensi tingkat pendidikan. |
| `cm_suku` | `TABLE` | 8 | 1 | **900** | Master referensi 900 suku bangsa. |
| `cm_terlapor_status` | `TABLE` | 8 | 1 | **1** | Master referensi status pihak terlapor/tersangka. |
| `cm_tipe_identitas` | `TABLE` | 9 | 1 | **9** | Master referensi jenis dokumen identitas (NIK/KTP, Paspor, SIM, dll.). |

## 12. Legacy & Specialized Tables (`trb_*`, `tm_*`, `an_*`, `ac_*`, `app_*`)

Tabel-tabel warisan arsitektur TypeORM generasi awal (`trb_*`, `tm_*`, `an_*`) yang dipertahankan untuk kompatibilitas skema dan integrasi historis.

| Nama Tabel / View | Tipe | Jml Kolom | Jml Index | Jumlah Baris Produksi | Fungsi Utama |
| :--- | :-: | ---: | ---: | ---: | :--- |
| `trb_police` | `TABLE` | 20 | 1 | **3.763** | Tabel legacy direktori data personel kepolisian (~3.763 baris). |
| `trb_dir` | `TABLE` | 9 | 1 | **0** | Tabel legacy daftar direktorat. |
| `trb_dir_permisson` | `TABLE` | 11 | 1 | **0** | Tabel legacy hak akses direktorat. |
| `trb_dir_role` | `TABLE` | 9 | 1 | **0** | Tabel legacy role direktorat. |
| `trb_dir_role_directorate_permissions_trb_dir_permisson` | `TABLE` | 2 | 3 | **0** | Tabel pivot legacy role dan permission direktorat. |
| `trb_dir_team` | `TABLE` | 10 | 1 | **0** | Tabel legacy keanggotaan tim direktorat. |
| `trb_dir_report` | `TABLE` | 11 | 1 | **0** | Tabel legacy distribusi laporan direktorat. |
| `trb_dp_report` | `TABLE` | 18 | 1 | **0** | Tabel legacy data laporan. |
| `trb_log_imports` | `TABLE` | 19 | 1 | **0** | Tabel legacy log impor file Excel. |
| `trb_log_report` | `TABLE` | 18 | 1 | **0** | Tabel legacy log perubahan laporan. |
| `trb_report` | `TABLE` | 83 | 5 | **0** | Tabel legacy laporan perkara. |
| `trb_report_barang_bukti` | `TABLE` | 10 | 2 | **0** | Tabel legacy barang bukti laporan. |
| `trb_report_excels` | `TABLE` | 24 | 1 | **0** | Tabel legacy file impor Excel laporan. |
| `trb_report_korban` | `TABLE` | 31 | 3 | **0** | Tabel legacy data korban laporan. |
| `trb_report_pasal` | `TABLE` | 15 | 1 | **0** | Tabel legacy data pasal laporan. |
| `trb_report_pelapor` | `TABLE` | 30 | 3 | **0** | Tabel legacy data pelapor. |
| `trb_report_saksi` | `TABLE` | 30 | 3 | **0** | Tabel legacy data saksi. |
| `trb_report_status` | `TABLE` | 10 | 2 | **0** | Tabel legacy master status laporan. |
| `trb_report_status_closure` | `TABLE` | 2 | 3 | **0** | Tabel legacy closure tree status laporan. |
| `trb_report_terlapor` | `TABLE` | 31 | 3 | **0** | Tabel legacy data terlapor. |
| `tm_org` | `TABLE` | 12 | 2 | **1** | Tabel legacy struktur organisasi. |
| `tm_org_closure` | `TABLE` | 2 | 3 | **1** | Tabel legacy closure tree organisasi. |
| `tm_org_level` | `TABLE` | 10 | 2 | **2** | Tabel legacy level organisasi. |
| `tm_org_level_akses_child_tm_org_level` | `TABLE` | 2 | 3 | **0** | Tabel pivot legacy akses level organisasi. |
| `tm_org_level_closure` | `TABLE` | 2 | 3 | **3** | Tabel legacy closure tree level organisasi. |
| `tm_org_level_permission_permission` | `TABLE` | 2 | 3 | **134** | Tabel pivot legacy hak akses level organisasi. |
| `tm_org_role` | `TABLE` | 12 | 4 | **5** | Tabel legacy role organisasi (digunakan untuk sinkronisasi organisasi_role_id). |
| `tm_org_role_permission_permission` | `TABLE` | 2 | 3 | **134** | Tabel pivot legacy hak akses role organisasi. |
| `tm_kategori_lp` | `TABLE` | 8 | 1 | **0** | Tabel legacy kategori LP. |
| `tm_org_kategori_lp_tm_kategori_lp` | `TABLE` | 2 | 3 | **0** | Tabel pivot legacy organisasi dan kategori LP. |
| `tm_type_kejahatan` | `TABLE` | 8 | 1 | **0** | Tabel legacy tipe kejahatan. |
| `an_dashboard` | `TABLE` | 23 | 1 | **0** | Tabel legacy agregasi dashboard. |
| `an_dashboard_jenis_kejahatan` | `TABLE` | 17 | 1 | **0** | Tabel legacy agregasi jenis kejahatan dashboard. |
| `an_dashboard_kategori_kejahatan` | `TABLE` | 14 | 1 | **0** | Tabel legacy agregasi kategori kejahatan dashboard. |
| `an_dashboard_status` | `TABLE` | 13 | 1 | **0** | Tabel legacy agregasi status dashboard. |
| `an_dashboard_type_kejahatan` | `TABLE` | 15 | 1 | **0** | Tabel legacy agregasi tipe kejahatan dashboard. |
| `an_kasus_menonjol` | `TABLE` | 17 | 2 | **0** | Tabel legacy kasus menonjol. |
| `ac_judol` | `TABLE` | 29 | 1 | **0** | Tabel modul khusus pemantauan perkara perjudian online (Judol). |
| `app_synchronize` | `TABLE` | 13 | 1 | **0** | Tabel legacy pencatatan sinkronisasi aplikasi. |

---

## Daftar Custom SQL Functions (7 Fungsi)

| Nama Fungsi | Argumen | Bahasa | Fungsi & Kegunaan Utama |
| :--- | :--- | :-: | :--- |
| `bdb_lp_auto_map_unit` | `()` | `plpgsql` | Trigger function pada `bdb_laporan_polisi` untuk memetakan `unit_nama` (Reskrim, Narkoba, Lantas, Samapta, Polair) ke child satker (`unit_satker_id`) secara otomatis saat LP baru dimasukkan. |
| `bdb_lp_default_status` | `()` | `plpgsql` | Trigger function pada `bdb_laporan_polisi` yang mengisi nilai default `status_id` ke status awal `LP` apabila kosong saat insert. |
| `bdb_satker_auto_tipe` | `()` | `plpgsql` | Trigger function pada `bdb_satker` yang mengklasifikasikan `tipe_satker` (`POLDA`, `POLRES`, `POLSEK`, atau `FUNGSI`) berdasarkan awalan deskripsi satker. |
| `bdb_satker_classify_r11` | `(p_id bigint, p_tipe_satker text, ...)` | `sql` | Fungsi *immutable parallel-safe* untuk mengklasifikasikan setiap satker ke dalam domain fungsi R11 (`STRUCTURAL`, `INTERNAL_RESERSE`, `EKSTERNAL_RESERSE`) beserta bukti token klasifikasinya. |
| `bdb_sync_kinerja_snapshot_from_lp` | `()` | `plpgsql` | Trigger function pada `bdb_laporan_polisi` yang menyinkronkan perubahan status, tanggal selesai, satker, unit, atau jenis kejahatan langsung ke tabel `bdb_kinerja_perkara_snapshot`. |
| `fn_guard_tanggal_dokumen_lp` | `()` | `plpgsql` | Trigger function validasi integritas tanggal pada `bdb_dokumen` (menolak tanggal dokumen di masa depan `> CURRENT_DATE` dan menolak tanggal dokumen yang mendahului tanggal terbit LP). |
| `parse_tgl_laporan` | `(val text)` | `plpgsql` | Fungsi utilitas *immutable* untuk mengonversi string `tgl_laporan` berformat `DD-MM-YYYY` menjadi tipe `date` secara aman. |

---

## Daftar Active Database Triggers (5 Triggers)

| Nama Trigger | Tabel Target | Event | Fungsi yang Dieksekusi |
| :--- | :--- | :--- | :--- |
| `trg_guard_tanggal_dokumen_lp` | `bdb_dokumen` | `BEFORE INSERT OR UPDATE OF tanggal_dokumen, tanggal_mulai, tanggal_berakhir` | `fn_guard_tanggal_dokumen_lp()` |
| `bdb_trg_sync_kinerja_snapshot_from_lp` | `bdb_laporan_polisi` | `AFTER UPDATE OF status_id, tanggal_selesai, satker_id, unit_satker_id, jenis_kejahatan_id, model_lp` | `bdb_sync_kinerja_snapshot_from_lp()` |
| `trg_bdb_lp_auto_map_unit` | `bdb_laporan_polisi` | `BEFORE INSERT` | `bdb_lp_auto_map_unit()` |
| `trg_bdb_lp_default_status` | `bdb_laporan_polisi` | `BEFORE INSERT` | `bdb_lp_default_status()` |
| `trg_bdb_satker_auto_tipe` | `bdb_satker` | `BEFORE INSERT` | `bdb_satker_auto_tipe()` |

---

## Catatan File Migrasi (`database/migrations/`)

- Seluruh file migrasi struktural dari `/usr/src/app/sql/bdb/` (`001` s/d `088`), skrip instalasi pohon satker (`000_bdb_install_satker_auto_children.sql`), serta migrasi WebAuthn Passkey (`089_passkey_webauthn.sql`) telah disimpan secara berurutan di folder `database/migrations/`.
- Tiga file *seed data dump* berukuran raksasa di atas 3 MB sengaja dikecualikan dari repositori Git agar ukuran repositori tetap ringan:
  1. `037_seed_cm_master_data.sql` (~17,4 MB — dump data referensi wilayah `cm_desa` s/d `cm_provinsi`)
  2. `055_seed_bdb_satker_data.sql` (~3,8 MB — dump data awal pohon `bdb_satker`)
  3. `063_satker_dors_kode_data.sql` (~4,8 MB — dump pemetaan kode DORS satker)
