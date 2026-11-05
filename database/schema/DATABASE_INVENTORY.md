# Inventarisasi Skema Database — Big Data Binops (BDB)

> **Mesin Basis Data:** PostgreSQL 15 (`public` schema)  
> **Versi Skema:** `v2.6` (November 2026)  
> **File DDL Utama:** [`database/schema/000_live_production_schema.sql`](./000_live_production_schema.sql)

---

## Ringkasan Statistik Arsitektur Skema

| Komponen Skema | Cakupan | Keterangan |
| :--- | :--- | :--- |
| **Tabel Operasional & Master** | **170+ Tabel** | Mencakup 12 domain fungsional utama (Autentikasi, Satker, DORS, LP, Kinerja, Pihak, BB, Susopsgas, Kerma, Sharese, Master Ref) |
| **Views & Katalog** | **2 Views** | `bdb_satker_taxonomy_r11` (SQL View klasifikasi R11) + `bdb_jukrah_view` (katalog visibilitas Jukrah) |
| **Constraints & Integritas** | **490+ Constraints** | Mencakup `PRIMARY KEY`, `UNIQUE`, `FOREIGN KEY`, dan `CHECK` |
| **Indeks Performa Tinggi** | **430+ Indexes** | B-Tree, Unique, Partial, dan GIN Trigram Indexes (`pg_trgm`) untuk pencarian cepat |
| **Custom SQL Functions** | **7 Fungsi** | Fungsi PL/pgSQL & SQL kustom untuk otomatisasi trigger dan klasifikasi R11 |
| **Active Triggers** | **5 Triggers** | Trigger sinkronisasi real-time snapshot, pemetaan unit otomatis, dan validasi tanggal |

---

## Rekapitulasi 12 Domain Fungsional

| No | Domain Fungsional | Fokus Utama |
| :-: | :--- | :--- |
| 1 | **Authentication, RBAC & Audit Governance** | Manajemen akun, WebAuthn Passkey, TOTP/PIN/OTP, perangkat aktif, matriks role (`superadmin`, `admin`, `operator`, `sharese`, `testing`), skor keaktifan pengguna, dan log audit. |
| 2 | **Master Satker & Hirarki Organisasi** | Pohon hierarki 4-tingkat Polri (`Mabes`, `Polda`, `Polres`, `Polsek`), singkatan standar (`DITKRIMUM`, `SATRESKRIM`, dll.), satker eksternal, dan pemetaan alias DORS. |
| 3 | **DORS Ingestion & Raw Mirror** | Penyimpanan muatan JSONB mentah (`bdb_dors_raw_lp`), log sinkronisasi portal integrasi masuk, dan tabel relasional hasil ekstraksi DORS. |
| 4 | **Laporan Polisi & Dokumen Penyidikan (Mindik)** | Tabel inti operasional `bdb_laporan_polisi`, transaksi dokumen penyidikan (`bdb_dokumen`), pelimpahan perkara, dan master kamus kejahatan (`bdb_master_kelompok_kejahatan`, `bdb_master_sub_kelompok_tipid`). |
| 5 | **Kinerja Perkara & ANEV Snapshots** | Tabel materialisasi `bdb_kinerja_perkara_snapshot` dan `bdb_anev_dashboard_snapshot` untuk analitik CT, CP, CC, CR, Indeks Kinerja, dan *hover flyout* 10 Kejahatan Tertinggi. |
| 6 | **Pihak Terlibat, Fast Cache & DPO** | Register pihak terlibat, tabel `bdb_pihak_terlibat_fast_cache` untuk perpindahan tab sub-20ms, peringkat subjek berulang (`bdb_pihak_terlibat_ranking_snapshot`), dan DPO. |
| 7 | **Barang Bukti** | Pencatatan barang bukti manual/DORS dengan pemisahan jumlah numerik, satuan standar Indonesia, dan 16 kategori induk barang bukti. |
| 8 | **Kasus Menonjol (Susjol) & Kasus Atensi** | Pemantauan kasus menonjol dan kasus atensi pimpinan beserta tabel Sprin dan dokumentasi kegiatan. |
| 9 | **Operasi Satgas (Susopsgas), Kerma & Jukrah** | Master operasi kepolisian, lampiran Sprin & foto giat, bank data kerja sama (MoU/PKS), dan direktif Jukrah. |
| 10 | **SHARESE Social, Chat & Notifications** | Unggahan feed taktis, komentar, reaksi, koneksi personel, obrolan langsung, notifikasi real-time, dan laporan kendala/bug. |
| 11 | **Master Referensi Pusiknas (`cm_*`)** | Katalog referensi wilayah administratif (`Provinsi` s/d `Desa`), jenis kejahatan, undang-undang, pasal, lokasi TKP, dan demografi. |
| 12 | **Tabel Kompatibilitas Historis (`trb_*`, `tm_*`, `an_*`)** | Tabel kompatibilitas skema generasi awal untuk mendukung transisi organisasi dan arsip. |

---

## 1. Authentication, RBAC & Audit Governance

| Nama Tabel / View | Tipe | Fungsi Utama |
| :--- | :-: | :--- |
| `auth_users` | `TABLE` | Tabel utama akun pengguna BDB, menyimpan kredensial, `role_bdb` (`superadmin`, `admin`, `operator`, `sharese`, `testing`), cakupan satker (`scope_satker_id`), dan pengaturan MFA. |
| `auth_devices` | `TABLE` | Registri sesi dan perangkat login aktif pengguna (`device_token`, IP, user agent, durasi sesi). |
| `auth_passkeys` | `TABLE` | Penyimpanan kredensial WebAuthn / Passkey (FIDO2 public key, `credential_id`, counter) untuk autentikasi biometrik. |
| `auth_passkey_challenges` | `TABLE` | Penyimpanan challenge kriptografis sementara untuk registrasi dan verifikasi WebAuthn/Passkey. |
| `auth_user_mutations` | `TABLE` | Riwayat mutasi jabatan/satker pengguna serta pengajuan perpindahan satker atau perubahan role. |
| `auth_users_activity_cache` | `TABLE` | Cache metrik **Skor Keaktifan Pengguna (`0–100pt`)** yang mengombinasikan frekuensi hari login 30 hari terakhir (maks 50pt) dan rata-rata durasi sesi login (maks 50pt). |
| `bdb_menu_role_access` | `TABLE` | Konfigurasi matriks hak akses menu navigasi berdasarkan `role_bdb` (termasuk akses *view-only* untuk role `testing`). |
| `bdb_bulk_password_reset_job` | `TABLE` | Header job eksekusi reset kata sandi massal oleh Superadmin. |
| `bdb_bulk_password_reset_item` | `TABLE` | Detail item akun pengguna pada setiap job reset kata sandi massal. |
| `bdb_integration_client` | `TABLE` | Kredensial klien Portal Integrasi Keluar (`X-API-Key` / Basic Auth, IP Whitelist, dan Scope). |
| `bdb_audit_log` | `TABLE` | Log audit komprehensif seluruh aktivitas pengguna dan API (login, pembacaan data, mutasi LP/dokumen, ekspor laporan). |
| `bdb_system_settings` | `TABLE` | Penyimpanan konfigurasi parameter global sistem BDB (termasuk konfigurasi Multi-SMTP, kebijakan OTP, dan mode pemeliharaan). |
| `bdb_panduan_pengguna` | `TABLE` | Manajemen dokumen panduan pengguna (Buku Panduan PDF, Video Tutorial, dan Infografis). |
| `bdb_schema_migrations` | `TABLE` | Tabel pelacakan versi file migrasi SQL yang telah dieksekusi. |

## 2. Master Satker & Hirarki Organisasi

| Nama Tabel / View | Tipe | Fungsi Utama |
| :--- | :-: | :--- |
| `bdb_satker` | `TABLE` | Tabel master utama pohon hierarki Satuan Kerja Polri (`Mabes`, `Polda`, `Polres`, `Polsek`, Direktorat, Satuan Fungsi, dan Unit) beserta `nama_singkat` standar (`DITKRIMUM`, `DITSIBER`, `SATRESKRIM`, dll.). |
| `bdb_satker_eksternal` | `TABLE` | Daftar instansi/satker eksternal non-Polri (Kejaksaan, BNN, Bea Cukai, PPNS, Polisi Militer) untuk pelimpahan perkara eksternal. |
| `bdb_satker_profiles` | `TABLE` | Profil detail satuan kerja (alamat kantor, koordinat wilayah hukum, kontak pejabat/operator). |
| `bdb_satker_taxonomy_r11` | `VIEW` | SQL View klasifikasi dinamis taksonomi R11 satker (`STRUCTURAL`, `INTERNAL_RESERSE`, `EKSTERNAL_RESERSE`). |
| `bdb_dors_satker_map` | `TABLE` | Tabel pemetaan alias & kode satker/unit dari feed DORS Stamaops Polri ke ID satker kanonik di `bdb_satker`. |

## 3. DORS Ingestion & Raw Mirror

| Nama Tabel / View | Tipe | Fungsi Utama |
| :--- | :-: | :--- |
| `bdb_dors_config` | `TABLE` | Konfigurasi penjadwal, watermark sinkronisasi, dan status worker Portal Integrasi Masuk (DORS Stamaops Polri). |
| `bdb_dors_sync_log` | `TABLE` | Log histori permanen eksekusi job sinkronisasi DORS (rentang tanggal, jumlah LP masuk/diperbarui, durasi, dan diagnostik error). |
| `bdb_dors_raw_lp` | `TABLE` | Penyimpanan payload JSONB mentah (*immutable raw mirror*) Laporan Polisi dari API DORS. |
| `bdb_dors_lp` | `TABLE` | Tabel utama hasil normalisasi data Laporan Polisi dari DORS. |
| `bdb_dors_lp_polda` / `polres` / `polsek` / `unit` | `TABLE` | Atribut relasi tingkat kewilayahan dan unit fungsi pada LP DORS. |
| `bdb_dors_lp_tindak_pidana` | `TABLE` | Daftar pasal dan tindak pidana yang tercatat pada LP DORS. |
| `bdb_dors_lp_terlibat` | `TABLE` | Data seluruh pihak terlibat (Pelapor, Korban, Saksi, Terlapor/Tersangka) dari feed DORS. |
| `bdb_dors_lp_barang_bukti` | `TABLE` | Data barang bukti perkara dari feed DORS (mendukung pengayaan satuan barang bukti tanpa menghapus record asli). |

## 4. Laporan Polisi, Taksonomi Kejahatan & Dokumen Penyidikan (Mindik)

| Nama Tabel / View | Tipe | Fungsi Utama |
| :--- | :-: | :--- |
| `bdb_laporan_polisi` | `TABLE` | Tabel inti operasional Laporan Polisi BDB, menggabungkan data DORS dan input operasional, status penyelesaian perkara, pemetaan satker/unit, TKP, dan klasifikasi kejahatan. |
| `bdb_status_master` | `TABLE` | Master tahapan penanganan perkara (`LP`, `Lidik`, `Sidik`, `SP2 Lidik`, `SP3`, `P21`, `Tahap II`, `RJ`, `Diversi`, `PERMA`). |
| `bdb_document_type_master` | `TABLE` | Master jenis dokumen administrasi penyidikan (`Mindik`) beserta aturan transisi status targetnya. |
| `bdb_dokumen` | `TABLE` | Tabel transaksi dokumen penyidikan (`Sprin Lidik`, `SPDP`, `Sprin Sidik`, `SP2HP`, `P19`, `P21`, `Tahap II`, `SP3`, `RJ`, dll.). |
| `bdb_lp_tindak_pidana` & `bdb_lp_tindak_pidana_dors` | `TABLE` | Daftar tindak pidana dan pasal yang dikaitkan ke Laporan Polisi (dengan label sumber `DORS` atau `Manual`). |
| `bdb_lp_pelimpahan` | `TABLE` | Transaksi pelimpahan Laporan Polisi antar-Satker internal Polri maupun ke instansi eksternal. |
| `bdb_master_kelompok_kejahatan` | `TABLE` | Master referensi Kelompok Kejahatan (`KRIMUM`, `KRIMSUS`, `NARKOBA`, `PPA-PPO`, `SIBER`). |
| `bdb_master_sub_kelompok_tipid` | `TABLE` | Master referensi Sub-Kelompok Tipid (`TIPIDUM`, `TIPIDEKSUS`, `TIPIDKOR`, `TIPIDTER`, `TIPIDNARKOBA`, `TIPIDPPA-PPO`, `TIPIDSIBER`). |

## 5. Kinerja Perkara & ANEV Snapshots

| Nama Tabel / View | Tipe | Fungsi Utama |
| :--- | :-: | :--- |
| `bdb_kinerja_perkara_snapshot` | `TABLE` | Tabel materialisasi snapshot per-LP untuk perhitungan cepat statistik Kinerja Penyidikan (`CT`, `CP`, `CC`, `CR`, `Indeks Kinerja`). |
| `bdb_kinerja_perkara_summary_snapshot` | `TABLE` | Snapshot agregat ringkasan kinerja perkara tingkat nasional/direktorat. |
| `bdb_kinerja_crime_group_mapping` | `TABLE` | Pemetaan jenis kejahatan Pusiknas ke dalam grup kejahatan ANEV Bareskrim. |
| `bdb_anev_rekap_snapshot` | `TABLE` | Snapshot agregasi harian rekapitulasi ANEV per Satker, Status Perkara, dan Tanggal. |
| `bdb_anev_dashboard_snapshot` | `TABLE` | Snapshot metrik kartu, grafik, dan *hover flyout* rincian Satker pada 10 Jenis Kejahatan Tertinggi di Dashboard. |

## 6. Pihak Terlibat, Fast Cache & DPO

| Nama Tabel / View | Tipe | Fungsi Utama |
| :--- | :-: | :--- |
| `bdb_lp_pihak_manual` | `TABLE` | Data pihak terlibat yang ditambahkan atau diperbarui secara manual oleh penyidik pada LP. |
| `bdb_pihak_terlibat_fast_cache` | `TABLE` | Tabel *fast-cache* pra-hitung untuk respons instan (`< 20ms`) saat berpindah tab peran (`Tersangka`, `Terlapor`, `Korban`, `Saksi`, `Pelapor`). |
| `bdb_pihak_terlibat_summary_snapshot` | `TABLE` | Snapshot agregasi ringkasan jumlah pihak terlibat per satker dan periode. |
| `bdb_pihak_terlibat_ranking_snapshot` | `TABLE` | Snapshot peringkat subjek hukum dan korporasi yang sering terlibat lintas wilayah. |
| `bdb_dpo` & `bdb_dpo_arsip` | `TABLE` | Daftar Pencarian Orang (DPO) aktif dan arsip pencabutan/penangkapan DPO. |

## 7. Barang Bukti, Susopsgas, Kerma & SHARESE

| Nama Tabel / View | Tipe | Fungsi Utama |
| :--- | :-: | :--- |
| `bdb_lp_barang_bukti_manual` | `TABLE` | Data barang bukti sitaan yang diinput secara manual dengan kolom `jumlah` numerik, `satuan` standar Indonesia, dan 16 kategori jenis barang bukti. |
| `bdb_barang_bukti_summary_snapshot` | `TABLE` | Snapshot agregasi jenis dan kuantitas barang bukti per satker dan periode waktu. |
| `bdb_kasus_menonjol` & `bdb_kasus_atensi` | `TABLE` | Data Kasus Menonjol (*Susjol*) dan Kasus Atensi beserta relasi multi-LP, tabel Sprin, dan dokumentasi kegiatan. |
| `bdb_operasi_satgas` | `TABLE` | Data master Operasi Kepolisian / Satgas khusus beserta tabel Sprin (periode otomatis) dan dokumentasi foto giat. |
| `bdb_kerma_master` | `TABLE` | Bank data naskah kerja sama (`MoU` / `PKS`) dalam dan luar negeri beserta pemantauan masa berlaku. |
| `bdb_social_posts` / `comments` / `reactions` | `TABLE` | Jejaring sosial internal **SHARESE**, mendukung *autocomplete* `@username`, lampiran LP, dan tanda baca. |
| `bdb_chat_rooms` & `bdb_chat_messages` | `TABLE` | Ruang percakapan dan pesan instan antar-personel di modul **Obrolan**. |

---

## Daftar Custom SQL Functions (7 Fungsi)

| Nama Fungsi | Bahasa | Fungsi & Kegunaan Utama |
| :--- | :-: | :--- |
| `bdb_lp_auto_map_unit` | `plpgsql` | Trigger function pada `bdb_laporan_polisi` untuk memetakan `unit_nama` ke child satker (`unit_satker_id`) secara otomatis. |
| `bdb_lp_default_status` | `plpgsql` | Trigger function pada `bdb_laporan_polisi` yang mengisi nilai default `status_id` ke status awal `LP` apabila kosong. |
| `bdb_satker_auto_tipe` | `plpgsql` | Trigger function pada `bdb_satker` yang mengklasifikasikan `tipe_satker` (`POLDA`, `POLRES`, `POLSEK`, atau `FUNGSI`). |
| `bdb_satker_classify_r11` | `sql` | Fungsi *immutable parallel-safe* untuk mengklasifikasikan setiap satker ke dalam domain fungsi R11 (`STRUCTURAL`, `INTERNAL_RESERSE`, `EKSTERNAL_RESERSE`). |
| `bdb_sync_kinerja_snapshot_from_lp` | `plpgsql` | Trigger function pada `bdb_laporan_polisi` yang menyinkronkan perubahan langsung ke tabel `bdb_kinerja_perkara_snapshot`. |
| `fn_guard_tanggal_dokumen_lp` | `plpgsql` | Trigger function validasi integritas tanggal pada `bdb_dokumen` (menolak tanggal di masa depan `> CURRENT_DATE`). |
| `parse_tgl_laporan` | `plpgsql` | Fungsi utilitas *immutable* untuk mengonversi string `tgl_laporan` menjadi tipe `date` secara aman. |
