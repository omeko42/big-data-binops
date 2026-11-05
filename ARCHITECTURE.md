# Catatan Keputusan Arsitektur / Architecture Decision Records (ADR) — Big Data Binops (BDB) — Powered by CAS (*Community Anggota Serse*)

> 🌐 **Daftar Isi / Sections:** [**🇮🇩 Bagian I: Bahasa Indonesia**](#-bagian-i-catatan-keputusan-arsitektur-rekayasa-bahasa-indonesia) &nbsp;|&nbsp; [**🇬🇧 Part II: English Version**](#-part-ii-system-architecture--engineering-decision-records-english)

---

## 🇮🇩 Bagian I: Catatan Keputusan Arsitektur Rekayasa (Bahasa Indonesia)

Dokumen ini merangkum pola arsitektur inti dan keputusan rekayasa utama (**Architecture Decision Records / ADR**) yang memungkinkan **Big Data Binops (BDB)** — yang digerakkan oleh komunitas **CAS (*Community Anggota Serse*)** — mengelola jutaan baris data operasional kepolisian secara nasional (*Laporan Polisi, Pihak Terlibat, Barang Bukti, dan Log Audit Forensik*) dengan waktu respons analitik **di bawah 20–100 milidetik**.

### ADR-001: Pemisahan Staging JSONB (*Decoupled Staging*) dari Tabel Inti Ternormalisasi (`bdb_dors_raw_lp` → `bdb_laporan_polisi`)
- **Konteks**: Data hulu dari **DORS Stamaops Polri** memiliki format kewilayahan yang beragam, variasi penulisan nama satuan kerja, karakter spasi tak terlihat (*Non-Breaking Space* / `chr(160)`), serta struktur larik bersarang (`tindak_pidana`, `terlibat`, `barang_bukti`).
- **Keputusan**: Menerapkan pipa ingesti dua tahap:
  1. **Staging Mentah Tak Berubah (`bdb_dors_raw_lp` & `bdb_dors_lp`)**: Menyimpan muatan JSONB asli dari hulu berdasarkan kunci `raw_lp_id` tanpa merusak struktur sumber, sekaligus memberlakukan proteksi *Edit-Only / No-Delete* pada data yang bersumber dari DORS.
  2. **Tabel Inti Relasional Ternormalisasi (`bdb_laporan_polisi`, `bdb_lp_tindak_pidana_dors`, `bdb_dokumen`)**: Menjalankan pembersihan karakter spasi melalui `REGEXP_REPLACE`, penempatan hierarki Satker 4-tingkat (`Mabes` → `Polda` → `Polres` → `Polsek`), serta penautan kategori kejahatan berjenjang sesuai kamus **Master Referensi Kelompok Kejahatan & Sub-Kelompok Tipid**.
- **Dampak**: Nol kehilangan data hulu (*Zero Data Loss*) dan konsistensi rekonsiliasi data lintas 36 Polda dan Bareskrim Polri.

### ADR-002: Mesin *Materialized Snapshot* & *Fast Cache* Pra-Hitung (`bdb_kinerja_perkara_snapshot` & `bdb_pihak_terlibat_fast_cache`)
- **Konteks**: Perhitungan langsung (*live query*) atas **Crime Total (CT)**, **Crime Process (CP Aktual & Tunggakan)**, **Crime Clearance (CC Aktual & Tunggakan)**, **Clearance Rate (Rumus Lama & Baru)**, **Indeks Kinerja 5-Level**, serta filter peran **Pihak Terlibat** (*Tersangka, Saksi, Korban, Terlapor*) pada jutaan baris data secara serentak memicu lonjakan beban CPU basis data.
- **Keputusan**: Membangun arsitektur *Pre-Computed Snapshot & Fast Cache* (`bdb_kinerja_perkara_snapshot`, `bdb_anev_dashboard_snapshot`, `bdb_pihak_terlibat_fast_cache`, dan `bdb_barang_bukti_summary_snapshot`) yang dipelihara melalui:
  - *Trigger* PostgreSQL tingkat baris (`bdb_trg_sync_kinerja_snapshot_from_lp`) setiap kali status atau unit LP diperbarui.
  - Orkestrasi latar belakang *non-blocking* (`setImmediate()` saat inisialisasi modul + **PostgreSQL Advisory Lock** `pg_try_advisory_lock`) sehingga klaster worker PM2 tidak pernah memblokir port HTTP saat layanan dimulai ulang.
- **Dampak**: Waktu kueri agregasi nasional dan perpindahan tab register terpangkas menjadi **`< 20–100 milidetik`** tanpa kendala *timeout*.

### ADR-003: Pemisahan Tegas SOTK Reserse (`Perkap 6/2017 jo. Perpol 4/2025`) & Doktrin Yuridis KUHAP
- **Konteks**: Tercampurnya satker non-Reserse (*Baharkam, Polairud, Sabhara/Samapta, Lantas, Intelkam*) atau status kejaksaan prematur ke dalam perhitungan *Clearance Rate* Reserse akan mendistorsi ukuran kinerja penyidikan nasional.
- **Keputusan**:
  1. **Isolasi Korps Reserse vs Non-Reserse (`bdb_satker_taxonomy_r11`)**: Memisahkan secara mutlak `INTERNAL_RESERSE` dari `EKSTERNAL_RESERSE`, menonaktifkan perkara lalu lintas murni dari snapshot kinerja Reserse, serta menstandarkan nomenklatur singkatan satuan fungsi (`DITKRIMUM`, `DITKRIMSUS`, `DITNARKOBA`, `DITPPA-PPO`, `DITSIBER`, `SATRESKRIM`, dll.).
  2. **Doktrin Yuridis KUHAP P-21 vs Tahap II**: Perkara yang berkasnya dinyatakan lengkap oleh Jaksa (**P-21**) tetap dihitung sebagai beban perkara aktif (**CT / CP**) hingga penyerahan fisik tersangka dan barang bukti (**Tahap II**) diselesaikan.
  3. **Penyatuan Cakupan Satker & Jajaran Bawahan**: Menyatukan visibilitas cakupan Satker induk beserta jajaran di bawahnya pada *Kinerja Perkara* dan *Peta Kejahatan*, serta menyatukan induk `POLSEK` dan anak `UNIT RESKRIM POLSEK`.

### ADR-004: Pola *Dual-Client* pada Penyimpanan Objek MinIO S3
- **Konteks**: Menyimpan ribuan berkas biner PDF dan dokumentasi foto (*Sprin Satgas, Dokumentasi Giat Susopsgas, Naskah Kerma MoU/PKS, Buku Panduan, Lampiran Kasus Menonjol*) di dalam tabel PostgreSQL memicu pembengkakan basis data (*database bloat*).
- **Keputusan**: Memindahkan seluruh dokumen biner ke klaster **MinIO S3 (`bdb-attachments`)** menggunakan **Pola Dual-Client** pada `minio.service.ts` — memisahkan jalur trafik internal berkecepatan tinggi (`:9100`) dari rute unduhan publik (`/bdb-attachments/`) yang diproksikan melalui Nginx.

### ADR-005: Mesin Dokumen Ganda (13 Lembar Perkap Polri WYSIWYG + Layanan Python Jukminu ONLYOFFICE)
- **Konteks**: Pelaporan eksekutif Polri membutuhkan penyuntingan cepat **13 Lembar Anev Resmi Perkap Polri** sekaligus pembuatan naskah surat dinas `.docx`/`.pdf` yang patuh pada **Jukminu Polri**.
- **Keputusan**: Menggabungkan mesin WYSIWYG 13 lembar di peramban (`anev.service.ts`) dengan layanan mikro Python (`cas_doc_service.py` di port `3860`) yang terintegrasi dengan **ONLYOFFICE Document Server (`onlyoffice-ds` di port `8088`)** untuk menghasilkan Kop Surat dinamis, blok tanda tangan `a.n. Pimpinan`, *watermark* NRP/NIP, dan penomoran halaman standar kedinasan.

---

## 🇬🇧 Part II: System Architecture & Engineering Decision Records (English)

This section summarizes the core architectural patterns and key engineering decisions (**ADRs**) that enable **Big Data Binops (BDB)** to process multi-million-row operational records with sub-100ms analytical latency.

### ADR-001: Decoupled JSONB Staging vs. Normalized Core (`bdb_dors_raw_lp` → `bdb_laporan_polisi`)
- **Context**: Upstream payloads from **DORS Stamaops Polri** arrive with heterogeneous regional formatting, non-breaking spaces (`chr(160)` / NBSP) in Satker codes, and evolving nested arrays.
- **Decision**: Implement an immutable raw JSONB staging layer (`bdb_dors_raw_lp` & `bdb_dors_lp`) with strict *Edit-Only / No-Delete* provenance rules, decoupled from the normalized relational core (`bdb_laporan_polisi`), applying NBSP sanitization, 4-tier Satker placement resolution, and standardized crime taxonomy mapping.
- **Impact**: Zero upstream data loss and consistent mathematical reconciliation across all 36 Polda and Bareskrim Polri.

### ADR-002: Pre-Computed Materialized Snapshot & Fast Cache Engine (`bdb_kinerja_perkara_snapshot` & `bdb_pihak_terlibat_fast_cache`)
- **Context**: Live national aggregations of CT, CP, CC, CR, Performance Index, and involved-party role filters across millions of records and 14,200+ Satker nodes can bottleneck relational CPU resources.
- **Decision**: Maintain pre-computed snapshots and fast caches (`bdb_kinerja_perkara_snapshot`, `bdb_anev_dashboard_snapshot`, `bdb_pihak_terlibat_fast_cache`, `bdb_barang_bukti_summary_snapshot`) via real-time PostgreSQL triggers (`bdb_trg_sync_kinerja_snapshot_from_lp`) and non-blocking `setImmediate()` background workers coordinated by PostgreSQL Advisory Locks (`pg_try_advisory_lock`).
- **Impact**: Analytical and register filtering latency reduced to **`< 20–100 ms`** with zero downtime during container restarts.

### ADR-003: Strict Juridical & SOTK Separation (`Perkap 6/2017 jo. Perpol 4/2025` & KUHAP)
- **Decision**: Strictly isolate `INTERNAL_RESERSE` from `EKSTERNAL_RESERSE` (`bdb_satker_taxonomy_r11`), enforce the KUHAP doctrine that **P-21** remains active CT workload until physical **Tahap II** handover, and unify hierarchical Satker + subordinate (*Satker + Jajaran*) scopes nationwide.

### ADR-004: Dual-Client MinIO S3 Object Storage Pattern
- **Decision**: Offload all binary PDF and photo attachments to a dedicated **MinIO S3 cluster (`bdb-attachments`)** using a Dual-Client Pattern in `minio.service.ts` to eliminate PostgreSQL table bloat.

### ADR-005: Dual Document Engine (13-Sheet Perkap Polri WYSIWYG + Python Jukminu ONLYOFFICE Service)
- **Decision**: Combine an in-browser 13-sheet Perkap Polri WYSIWYG telemetry engine (`anev.service.ts`) with a dedicated Python microservice (`cas_doc_service.py` on port `3860`) integrated with **ONLYOFFICE Document Server (`onlyoffice-ds` on port `8088`)** for full **Jukminu Polri** administrative compliance.
