# Riwayat Perubahan / Changelog — Big Data Binops (BDB) & CAS (*Community Anggota Serse*)

> 🌐 **Daftar Isi / Sections:** [**🇮🇩 Bagian I: Bahasa Indonesia**](#-bagian-i-riwayat-perubahan--evolusi-platform-bahasa-indonesia) &nbsp;|&nbsp; [**🇬🇧 Part II: English Version**](#-part-ii-platform-changelog--release-history-english)

---

## 🇮🇩 Bagian I: Riwayat Perubahan & Evolusi Platform (Bahasa Indonesia)

Seluruh tonggak pencapaian arsitektur, rilis fitur, dan penyempurnaan rekayasa produksi pada platform **Big Data Binops (BDB)** serta ekosistem **CAS (*Community Anggota Serse*)** didokumentasikan di dalam berkas ini.

### [v2.5.0] — Oktober 2026 (Rilis Produksi Aktif — Tahap 4: Pendataan Kompleks BDB)
#### Ditambahkan (*Added*)
- **Sinkronisasi Penuh Arsitektur Produksi Multi-Node**:
  - Backend NestJS 11 (`bareskrim_nest_v11`, klaster 32-worker PM2) lengkap dengan lapisan `app_core` dan seluruh **26 sub-modul operasional `bdb`**.
  - Portal Frontend Next.js `16.2.10` + React `19.2.4` standalone (`bdb-web`) yang mencakup **73 halaman App Router** dan **21 bundel modul fitur**.
  - Layanan Mikro Python 3 **Jukminu Polri & Integrasi ONLYOFFICE** (`cas_doc_service.py` di port `3860` + `onlyoffice-ds` di port `8088`) dengan Kop Surat dinamis Satker/Fungsi, blok tanda tangan `a.n. Pimpinan`, *watermark* NRP/NIP, serta sinkronisasi CT/CC otomatis.
  - Skema DDL PostgreSQL produksi aktif ([`000_live_production_schema.sql`](database/schema/000_live_production_schema.sql)) yang mencakup **171 tabel aktif**, **7 fungsi PL/pgSQL kustom**, **433 indeks**, **5 trigger**, dan **90 berkas migrasi SQL berurutan** (`000`–`089`).
- **Suite Keamanan Passkey Perangkat Keras FIDO2 / WebAuthn & Gawai Terpercaya**:
  - Autentikasi biometrik tanpa kata sandi (`@simplewebauthn/server`, `auth_passkeys`, `auth_passkey_challenges`) berdampingan dengan TOTP 2FA, PIN 6 Digit, OTP Email, serta fitur **Otorisasi Cabut Akses Gawai**.
- **Keselarasan SOTK `Perpol 4/2025` & Integrasi 4 Bagian Robinopsnal**:
  - Modul operasional terpadu untuk **Bagrenopsnal** (*Operasi Satgas & Sprin/Renops MinIO S3*), **Bagkerma** (*Bank Data MoU/PKS dengan alarm kedaluwarsa H-180 s/d H-30*), **Baganev** (*CT/CP/CC/CR, Mesin SLA Perkap 6/2019, Kasus Menonjol/Atensi, & Skor 5.828 Subjek Sindikat Lintas Provinsi*), serta **Bagyanmas** (*Dumas Non-LP & SP2HP*).
  - Dukungan penuh untuk satker pemekaran baru **Ditres PPA-PPO** (Polda) dan **Satres PPA-PPO** (Polres) beserta pemetaan kelompok kejahatan TPPO Konvensional (`782`) dan Penyelundupan Orang (`783`).

#### Diperbaiki & Dioptimalkan (*Fixed & Optimized*)
- **Penyatuan Nasional Cakupan `POLSEK` $\leftrightarrow$ `UNIT RESKRIM POLSEK`**:
  - Menyatukan hak akses dan agregasi snapshot antara induk `POLSEK` dan anak `UNIT RESKRIM POLSEK` pada `laporan-polisi.service.ts`, `kinerja-perkara.service.ts`, dan `lp-monitoring-access.service.ts`, menuntaskan laporan lapangan dari anggota **CAS (*Community Anggota Serse*)**.
- **Inisialisasi Snapshot Non-Blocking (`onModuleInit`)**:
  - Memisahkan proses penyegaran awal `KinerjaPerkaraService.onModuleInit()` menggunakan `setImmediate()` + *PostgreSQL Advisory Lock* sehingga `bdb-api` langsung membuka port `3850` dalam $<2\text{ detik}$ tanpa memicu *502 Bad Gateway*.
- **Kemurnian Kamar Reserse pada Snapshot Kinerja**:
  - Mengecualikan perkara lalu lintas murni (`jenis_kejahatan_id IN (516, 741)`) dan satker non-Reserse (*Sabhara/Samapta, Polairud, Lantas*) dari `bdb_kinerja_perkara_snapshot`, menghasilkan `0` anomali *Unmapped/Review* pada Periode I & Periode II.

### [v2.0.0] — Juli s/d September 2026 (Ingesti DORS 4-Tingkat & Mesin Snapshot)
- Meluncurkan pipa ingesti otomatis 4-tingkat dari **DORS Stamaops Polri** (`bdb_dors_raw_lp` $\to$ `bdb_laporan_polisi`) dengan pembersihan spasi gaib `chr(160)` dan kamus alias `bdb_dors_satker_map`.
- Membangun `bdb_kinerja_perkara_snapshot`, `bdb_anev_rekap_snapshot`, `bdb_pihak_terlibat_ranking_snapshot`, dan `bdb_barang_bukti_summary_snapshot` untuk memangkas kueri nasional dari $>10\text{ detik}$ menjadi $<100\text{ ms}$.
- Meluncurkan forum taktis internal **SHARESE** (`/cms/broadcaster`) dan distribusi **Jukrah** pimpinan.

### [v1.0.0 — Tahap Historis 1–3] — Pra-2023 s/d 2025
- **Tahap 1 (Pra-2023)**: Rekapitulasi template Excel kewilayahan melalui email dinas ke 34 Polda.
- **Tahap 2 (2023–2025)**: Spreadsheet cloud bersama (dihentikan setelah mengalami penguncian kuota 15,02 GB selama 34 hari dan ledakan >153 tab).
- **Tahap 3 (2024–2025)**: Platform statis CT/CC tahap awal (digantikan sepenuhnya oleh klaster mandiri **Big Data Binops [BDB]**).

---

## 🇬🇧 Part II: Platform Changelog & Release History (English)

### [v2.5.0] — 2026-10 (Current Production Release — Stage 4: Complex Data Governance BDB)
#### Added
- **Complete Multi-Node Production Architecture Sync**: Full NestJS 11 backend (32-worker PM2 cluster, 26 `bdb` submodules), Next.js `16.2.10` standalone portal (73 routes, 21 feature bundles), Python 3 **Jukminu Polri & ONLYOFFICE Microservice** (`cas_doc_service.py`), and live PostgreSQL DDL schema (`171` active tables, `7` PL/pgSQL functions, `433` indexes, `90` migrations).
- **FIDO2 / WebAuthn Hardware Passkey & Trusted Device Suite**: Biometric/hardware-bound passwordless login plus TOTP 2FA, 6-Digit PIN, Email OTP, and self-service device revocation.
- **SOTK Perpol 4/2025 & 4 Bagian Robinopsnal Integration**: Integrated workflows for **Bagrenopsnal**, **Bagkerma**, **Baganev**, and **Bagyanmas**, including newly established **Ditres PPA-PPO** and **Satres PPA-PPO** jurisdictions.

#### Fixed & Optimized
- **Nationwide Polsek $\leftrightarrow$ Unit Reskrim Scope Unification**: Unified parent `POLSEK` and child `UNIT RESKRIM POLSEK` visibility and snapshot rollups based on **CAS (*Community Anggota Serse*)** field reports.
- **Non-Blocking Container Startup (`onModuleInit`)**: Asynchronous `setImmediate()` + PostgreSQL Advisory Lock snapshot initialization preventing 502 Bad Gateway timeouts on restart.
- **Reserse Snapshot Purity**: Isolated traffic offenses (`516, 741`) and non-Reserse units from Reserse performance snapshots (`0` unmapped anomalies).
