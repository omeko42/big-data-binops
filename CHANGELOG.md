# Riwayat Perubahan / Changelog — Big Data Binops (BDB) — Powered by CAS (*Community Anggota Serse*)

> 🌐 **Daftar Isi / Sections:** [**🇮🇩 Bagian I: Bahasa Indonesia**](#-bagian-i-riwayat-perubahan--evolusi-platform-bahasa-indonesia) &nbsp;|&nbsp; [**🇬🇧 Part II: English Version**](#-part-ii-platform-changelog--release-history-english)

---

## 🇮🇩 Bagian I: Riwayat Perubahan & Evolusi Platform (Bahasa Indonesia)

Seluruh tonggak pencapaian arsitektur, rilis fitur, dan penyempurnaan rekayasa produksi pada platform **Big Data Binops (BDB)** serta ekosistem **CAS (*Community Anggota Serse*)** didokumentasikan di dalam berkas ini.

### [v2.6.0] — November 2026 (Rilis Produksi Aktif — Penyempurnaan Performa, Taksonomi & Tata Kelola Terpadu)
#### Ditambahkan (*Added*)
- **Optimasi Performa Sub-20ms & Fast Cache (`bdb_pihak_terlibat_fast_cache`)**:
  - Mempercepat perpindahan tab dan filter pada **Rekap Pihak Terlibat**, **Ringkasan Dashboard**, **Staging DORS**, dan **Kinerja Perkara** menggunakan tabel *fast-cache* pra-hitung dan payload terkompresi.
- **Standarisasi Master Referensi & Taksonomi Polri**:
  - Menambahkan modul **Kelompok Kejahatan** (`KRIMUM`, `KRIMSUS`, `NARKOBA`, `PPA-PPO`, `SIBER`) dan **Sub-Kelompok Tipid** (`TIPIDUM`, `TIPIDEKSUS`, `TIPIDKOR`, `TIPIDTER`, `TIPIDNARKOBA`, `TIPIDPPA-PPO`, `TIPIDSIBER`) pada menu **Master Referensi (`/cms/master-ref`)**.
  - Menstandarkan singkatan nama satuan fungsi secara menyeluruh (`DITKRIMUM`, `DITKRIMSUS`, `DITNARKOBA`, `DITPPA-PPO`, `DITSIBER`, `SATRESKRIM`, `RES`, `SEK`) di seluruh tabel, kartu ringkasan, dan *hover flyout*.
- **Dashboard Interaktif & Peta Kejahatan Hierarkis (`Satker + Jajaran`)**:
  - Menambahkan *hover flyout* rincian kontribusi Satker pada **10 Jenis Kejahatan Tertinggi** di Dashboard (identik dengan perilaku *10 Satker CT/CC Tertinggi*).
  - Memperluas cakupan **Peta Kejahatan (`/cms/dashboard/peta-kejahatan`)** agar menampilkan **Satker + Jajaran di Bawahnya** secara agregat seperti pada *Kinerja Perkara*.
  - Menyiapkan menu *sidebar* **Coserse** (serta bot pendamping `@cosersebot`) sebagai *placeholder* asisten AI masa depan.
- **Standarisasi Register Barang Bukti & Proteksi Provenans DORS**:
  - Menggabungkan kolom menjadi **JENIS & NAMA / DETAIL BARANG** (maksimal 2 baris dengan elipsis otomatis), memisahkan input **Jumlah (Numerik)** dan **Satuan (Dropdown Standar Indonesia)**, serta mengklasifikasikan barang bukti ke dalam **16 kategori induk standar nasional**.
  - Memberlakukan kebijakan **Edit-Only / No-Delete** untuk data LP, Tindak Pidana, Pihak Terlibat, dan Barang Bukti yang bersumber dari **DORS** (termasuk izin pelengkapan satuan barang bukti DORS tanpa menghapus record asli).
- **Tata Kelola Pengguna, Skor Keaktifan & Role (`sharese` / `testing`)**:
  - Memperbarui rumus **Skor Keaktifan Pengguna (0–100pt)** dengan mengombinasikan **frekuensi hari login dalam 30 hari terakhir (maks 50pt)** dan **rata-rata durasi sesi login harian (maks 50pt)**.
  - Mengalihkan akun personel yang belum pernah aktif menjadi ber-role **`sharese`**, serta menghadirkan role **`testing`** (*Vendor / Mitra*) dengan akses **Read-Only** di seluruh modul.
- **Pembaruan Modul Susopsgas, Sharese, Multi-SMTP & Lapor Bug**:
  - Menyempurnakan **Susopsgas & Kasus Menonjol** dengan tabel input **Sprin** 1-baris (periode operasi ditarik otomatis dari tanggal mulai–berakhir Sprin) dan tabel **Dokumentasi Kegiatan** (maksimal 5 foto per giat).
  - Menambahkan *autocomplete* **`@username`** pada **Sharese Feed**, standarisasi ukuran kontainer gelembung pesan di **Obrolan**, penyelarasan halaman **Keamanan Sharese**, tata letak vertikal **Pengaturan Email Multi-SMTP**, serta tombol mengambang **Lapor Bug & Kendala Sistem**.

### [v2.5.0] — Oktober 2026 (Rilis Arsitektur Multi-Node & Jukminu ONLYOFFICE)
#### Ditambahkan (*Added*)
- **Sinkronisasi Penuh Arsitektur Produksi Multi-Node**:
  - Backend NestJS 11 (`bareskrim_nest_v11`, klaster 32-worker PM2) lengkap dengan lapisan `app_core` dan seluruh **26 sub-modul operasional `bdb`**.
  - Portal Frontend Next.js `16.2.10` + React `19.2.4` standalone (`bdb-web`) yang mencakup **77 halaman App Router** dan **28 bundel modul fitur**.
  - Layanan Mikro Python 3 **Jukminu Polri & Integrasi ONLYOFFICE** (`cas_doc_service.py` di port `3860` + `onlyoffice-ds` di port `8088`) dengan Kop Surat dinamis Satker/Fungsi, blok tanda tangan `a.n. Pimpinan`, dan *watermark* NRP/NIP.
  - Skema DDL PostgreSQL produksi aktif ([`000_live_production_schema.sql`](database/schema/000_live_production_schema.sql)) beserta rangkaian berkas migrasi SQL berurutan.
- **Suite Keamanan Passkey Perangkat Keras FIDO2 / WebAuthn & Gawai Terpercaya**:
  - Autentikasi biometrik tanpa kata sandi (`@simplewebauthn/server`, `auth_passkeys`, `auth_passkey_challenges`) berdampingan dengan TOTP 2FA, PIN 6 Digit, OTP Email, serta fitur **Otorisasi Cabut Akses Gawai**.
- **Keselarasan SOTK `Perpol 4/2025` & Integrasi 4 Bagian Robinopsnal**:
  - Modul operasional terpadu untuk **Bagrenopsnal**, **Bagkerma**, **Baganev**, dan **Bagyanmas**, termasuk dukungan penuh untuk satker pemekaran baru **Ditres PPA-PPO** (Polda) dan **Satres PPA-PPO** (Polres).

### [v2.0.0] — Juli s/d September 2026 (Ingesti DORS 4-Tingkat & Mesin Snapshot)
- Meluncurkan pipa ingesti otomatis 4-tingkat dari **DORS Stamaops Polri** (`bdb_dors_raw_lp` → `bdb_laporan_polisi`) dengan pembersihan karakter spasi dan kamus alias `bdb_dors_satker_map`.
- Membangun `bdb_kinerja_perkara_snapshot`, `bdb_anev_rekap_snapshot`, `bdb_pihak_terlibat_ranking_snapshot`, dan `bdb_barang_bukti_summary_snapshot` untuk memangkas waktu kueri nasional menjadi di bawah 100 milidetik.
- Meluncurkan forum taktis internal **SHARESE** (`/cms/broadcaster`) dan distribusi **Jukrah** pimpinan.

### [v1.0.0 — Tahap Historis 1–3] — Pra-2023 s/d 2025
- **Tahap 1 (Pra-2023)**: Rekapitulasi berkas lembar kerja (*spreadsheet*) kewilayahan secara berkala melalui surat elektronik.
- **Tahap 2 (2023–2025)**: Kolaborasi lembar kerja daring (*cloud spreadsheet*) lintas satuan kerja yang kemudian dimigrasikan ke basis data relasional karena keterbatasan kapasitas dan konkurensi.
- **Tahap 3 (2024–2025)**: Prototipe awal aplikasi pelaporan web CT/CC sebelum bertransformasi penuh menjadi arsitektur mandiri **Big Data Binops (BDB)**.

---

## 🇬🇧 Part II: Platform Changelog & Release History (English)

### [v2.6.0] — 2026-11 (Current Production Release — Sub-20ms Performance, Taxonomy & Unified Governance)
#### Added
- **Sub-20ms Analytical & Register Fast Cache (`bdb_pihak_terlibat_fast_cache`)**: Pre-computed role counters and compressed payloads for instant filtering across **Pihak Terlibat**, **Dashboard Ringkasan**, **Staging DORS**, and **Kinerja Perkara**.
- **Master Reference Crime Taxonomy & Satker Short-Names**: Added **Kelompok Kejahatan** (`KRIMUM`, `KRIMSUS`, `NARKOBA`, `PPA-PPO`, `SIBER`) and **Sub-Kelompok Tipid** (`TIPIDUM`, `TIPIDEKSUS`, `TIPIDKOR`, `TIPIDTER`, `TIPIDNARKOBA`, `TIPIDPPA-PPO`, `TIPIDSIBER`) to `/cms/master-ref`, plus standardized Satker short-names (`DITKRIMUM`, `DITKRIMSUS`, `DITSIBER`, `SATRESKRIM`, etc.).
- **Interactive Dashboard Hover Flyouts & Hierarchical Crime Map (`Satker + Jajaran`)**: Added Satker breakdown hover flyouts on **Top 10 Crimes**, expanded **Peta Kejahatan** to aggregate parent Satker + subordinate jurisdictions, and prepared the **Coserse** AI sidebar menu (`@cosersebot`).
- **Evidence Register Standardization & DORS Edit-Only Provenance**: Unified **JENIS & NAMA / DETAIL BARANG** 2-line display, separated numeric **Jumlah** and Indonesian **Satuan** dropdowns across 16 national evidence categories, and enforced **Edit-Only / No-Delete** provenance for DORS records.
- **User Activity Score (30d Login + Session Duration) & `sharese` / `testing` Roles**: Combined 30-day login frequency with average session duration for the 0–100pt activity score, assigned inactive accounts to the `sharese` role, and enforced strict **Read-Only** access for the `testing` (*Vendor / Mitra*) role.
- **Susopsgas, Sharese `@username` Autocomplete, Multi-SMTP & Bug Reporting**: Added 1-row inline **Sprin** tables (deriving operation dates automatically) and **Dokumentasi Kegiatan** tables (up to 5 photos), `@username` mention autocomplete in **Sharese Feed**, standardized chat bubble sizing, vertical **Multi-SMTP** configuration layout, and a floating **Bug Report** modal.

### [v2.5.0] — 2026-10 (Multi-Node Production Architecture & ONLYOFFICE Jukminu Release)
- Full NestJS 11 backend (`26` `bdb` submodules), Next.js `16.2.10` standalone portal (`77` routes, `28` feature bundles), Python 3 **Jukminu Polri & ONLYOFFICE Microservice** (`cas_doc_service.py`), FIDO2/WebAuthn hardware passkeys, and SOTK `Perpol 4/2025` alignment across all 4 Bagian of Robinopsnal.
