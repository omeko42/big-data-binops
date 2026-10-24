# Catatan Keputusan Arsitektur / Architecture Decision Records (ADR) — Big Data Binops (BDB) — Powered by CAS (*Community Anggota Serse*)

> 🌐 **Daftar Isi / Sections:** [**🇮🇩 Bagian I: Bahasa Indonesia**](#-bagian-i-catatan-keputusan-arsitektur-rekayasa-bahasa-indonesia) &nbsp;|&nbsp; [**🇬🇧 Part II: English Version**](#-part-ii-system-architecture--engineering-decision-records-english)

---

## 🇮🇩 Bagian I: Catatan Keputusan Arsitektur Rekayasa (Bahasa Indonesia)

Dokumen ini merangkum pola arsitektur inti dan keputusan rekayasa utama (**Architecture Decision Records / ADR**) yang memungkinkan **Big Data Binops (BDB)** — yang digerakkan oleh komunitas **CAS (*Community Anggota Serse*)** — mengelola **~68,89 juta baris data produksi aktif** (**2,84+ juta Laporan Polisi**, **11,16+ juta pihak terlibat**, **5,84+ juta barang bukti**, dan **5,46+ juta catatan audit forensik**) dengan waktu respons analitik di bawah **100 milidetik**.

### ADR-001: Pemisahan Staging JSONB (*Decoupled Staging*) dari Tabel Inti Ternormalisasi (`bdb_dors_raw_lp` $\to$ `bdb_laporan_polisi`)
- **Konteks**: Data hulu dari **DORS Stamaops Polri** memiliki format kewilayahan yang beragam, karakter spasi gaib (`chr(160)` / *Non-Breaking Space*) pada kode Satker, serta struktur larik bersarang (`tindak_pidana`, `terlibat`, `barang_bukti`).
- **Keputusan**: Menerapkan pipa ingesti dua tahap:
  1. **Staging Mentah Tak Berubah (`bdb_dors_raw_lp` & `bdb_dors_lp`)**: Menyimpan muatan JSONB asli dari hulu berdasarkan kunci `raw_lp_id` tanpa risiko merusak data sumber.
  2. **Tabel Inti Relasional Ternormalisasi (`bdb_laporan_polisi`, `bdb_lp_tindak_pidana_dors`, `bdb_dokumen`)**: Menjalankan pembersihan karakter `chr(160)` melalui `REGEXP_REPLACE`, penempatan hierarki Satker 4-tingkat (`Mabes` $\to$ `Polda` $\to$ `Polres` $\to$ `Polsek`), serta penautan kategori kejahatan berjenjang (`coalesce(kategori_gk, tindak_pidana[0].id_kategori_kejahatan)`).
- **Dampak**: Nol kehilangan data hulu (*Zero Data Loss*) dan akurasi rekonsiliasi matematis 100% lintas 36 Polda dan Bareskrim Polri.

### ADR-002: Mesin *Materialized Snapshot* Pra-Hitung (`bdb_kinerja_perkara_snapshot`)
- **Konteks**: Perhitungan langsung (*live query*) atas **Crime Total (CT)**, **Crime Process (CP Aktual & Tunggakan)**, **Crime Clearance (CC Aktual & Tunggakan)**, **Clearance Rate (Rumus Lama & Baru)**, dan **Indeks Kinerja 5-Level** terhadap 2,84 juta LP di 14.217 Satker sebelumnya memakan waktu $>10\text{ detik}$ dan memicu lonjakan beban CPU saat jam sibuk Anev komando.
- **Keputusan**: Membangun tabel `bdb_kinerja_perkara_snapshot` (**2,11+ juta baris aktif Reserse**) yang dipelihara melalui:
  - *Trigger* PostgreSQL tingkat baris (`bdb_trg_sync_kinerja_snapshot_from_lp`) setiap kali status atau unit LP diperbarui.
  - Orkestrasi latar belakang *non-blocking* (`setImmediate()` saat inisialisasi modul + **PostgreSQL Advisory Lock** `pg_try_advisory_lock`) sehingga ke-32 *worker* PM2 tidak pernah memblokir port HTTP `3850` saat *container* dimulai ulang.
- **Dampak**: Waktu kueri agregasi nasional terpangkas dari **$>10\text{ detik}$ menjadi $<100\text{ milidetik}$** tanpa kendala *502 Bad Gateway*.

### ADR-003: Pemisahan Tegas SOTK Reserse (`Perkap 6/2017 jo. Perpol 4/2025`) & Doktrin Yuridis KUHAP
- **Konteks**: Tercampurnya satker non-Reserse (*Baharkam, Polairud, Sabhara/Samapta, Lantas, Intelkam*) atau status kejaksaan prematur ke dalam perhitungan *Clearance Rate* Reserse akan mendistorsi ukuran kinerja penyidikan nasional.
- **Keputusan**:
  1. **Isolasi Korps Reserse vs Non-Reserse (`bdb_satker_taxonomy_r11`)**: Memisahkan secara mutlak `INTERNAL_RESERSE` dari `EKSTERNAL_RESERSE` serta menonaktifkan tindak pidana lalu lintas murni (`jenis_kejahatan_id IN (516, 741)`) dari snapshot kinerja Reserse.
  2. **Doktrin Yuridis KUHAP P-21 vs Tahap II**: Perkara yang berkasnya dinyatakan lengkap oleh Jaksa (**P-21**) tetap dihitung sebagai beban perkara aktif (**CT / CP**) hingga penyerahan fisik tersangka dan barang bukti (**Tahap II**) diselesaikan.
  3. **Penyatuan Cakupan Polsek & Unit Reskrim**: Menyatukan secara otomatis cakupan induk `POLSEK` dan anak `UNIT RESKRIM POLSEK` agar Kanit Reskrim dan operator Polsek tidak mengalami selisih angka.

### ADR-004: Pola *Dual-Client* pada Penyimpanan Objek MinIO S3
- **Konteks**: Menyimpan ribuan berkas biner PDF (*Sprin Satgas, Renops, Naskah Kerma MoU/PKS, Lampiran Kasus Menonjol/Atensi, Berkas Pelimpahan*) di dalam tabel PostgreSQL memicu pembengkakan basis data (*database bloat*).
- **Keputusan**: Memindahkan seluruh dokumen biner ke klaster **MinIO S3 (`bdb-attachments`)** menggunakan **Pola Dual-Client** pada `minio.service.ts` — memisahkan jalur trafik internal berkecepatan tinggi (`:9100`) dari rute unduhan publik (`/bdb-attachments/`) yang diproksikan melalui Nginx.

### ADR-005: Mesin Dokumen Ganda (13 Lembar Perkap Polri WYSIWYG + Layanan Python Jukminu ONLYOFFICE)
- **Konteks**: Pelaporan eksekutif Polri membutuhkan penyuntingan cepat **13 Lembar Anev Resmi Perkap Polri** sekaligus pembuatan naskah surat dinas `.docx`/`.pdf` yang patuh pada **Jukminu Polri**.
- **Keputusan**: Menggabungkan mesin WYSIWYG 13 lembar di peramban (`anev.service.ts`) dengan layanan mikro Python (`cas_doc_service.py` di port `3860`) yang terintegrasi dengan **ONLYOFFICE Document Server (`onlyoffice-ds` di port `8088`)** untuk menghasilkan Kop Surat dinamis, blok tanda tangan `a.n. Pimpinan`, *watermark* NRP/NIP, penomoran halaman mulai halaman 2, serta *Kata Penghubung (Catchword)*.

---

## 🇬🇧 Part II: System Architecture & Engineering Decision Records (English)

This section summarizes the core architectural patterns and key engineering decisions (**ADRs**) that enable **Big Data Binops (BDB)** to process **~68.89 million live database rows** with sub-100ms analytical latency.

### ADR-001: Decoupled JSONB Staging vs. Normalized Core (`bdb_dors_raw_lp` $\to$ `bdb_laporan_polisi`)
- **Context**: Upstream payloads from **DORS Stamaops Polri** arrive with heterogeneous regional formatting, non-breaking spaces (`chr(160)` / NBSP) in Satker codes, and evolving nested arrays.
- **Decision**: Implement an immutable raw JSONB staging layer (`bdb_dors_raw_lp` & `bdb_dors_lp`) decoupled from the normalized relational core (`bdb_laporan_polisi`), applying `REGEXP_REPLACE` NBSP sanitization and 4-tier Satker placement resolution.
- **Impact**: Zero upstream data loss and 100% mathematical reconciliation accuracy across all 36 Polda and Bareskrim Polri.

### ADR-002: Pre-Computed Materialized Snapshot Engine (`bdb_kinerja_perkara_snapshot`)
- **Context**: Live national aggregations of CT, CP, CC, CR, and Performance Index across 2.84M+ LPs and 14,217 Satker nodes previously took $>10\text{ seconds}$.
- **Decision**: Maintain `bdb_kinerja_perkara_snapshot` (**2.11M+ active Reserse rows**) via real-time PostgreSQL triggers (`bdb_trg_sync_kinerja_snapshot_from_lp`) and non-blocking `setImmediate()` background workers coordinated by PostgreSQL Advisory Locks (`pg_try_advisory_lock`).
- **Impact**: Analytical query latency reduced from **$>10\text{ s}$ to $<100\text{ ms}$** with zero 502 Bad Gateway downtime during container restarts.

### ADR-003: Strict Juridical & SOTK Separation (`Perkap 6/2017 jo. Perpol 4/2025` & KUHAP)
- **Decision**: Strictly isolate `INTERNAL_RESERSE` from `EKSTERNAL_RESERSE` (`bdb_satker_taxonomy_r11`), enforce the KUHAP doctrine that **P-21** remains active CT workload until physical **Tahap II** handover, and unify parent `POLSEK` $\leftrightarrow$ child `UNIT RESKRIM POLSEK` scopes nationwide.

### ADR-004: Dual-Client MinIO S3 Object Storage Pattern
- **Decision**: Offload all binary PDF attachments to a dedicated **MinIO S3 cluster (`bdb-attachments`)** using a Dual-Client Pattern in `minio.service.ts` to eliminate PostgreSQL table bloat.

### ADR-005: Dual Document Engine (13-Sheet Perkap Polri WYSIWYG + Python Jukminu ONLYOFFICE Service)
- **Decision**: Combine an in-browser 13-sheet Perkap Polri WYSIWYG telemetry engine (`anev.service.ts`) with a dedicated Python microservice (`cas_doc_service.py` on port `3860`) integrated with **ONLYOFFICE Document Server (`onlyoffice-ds` on port `8088`)** for full **Jukminu Polri** administrative compliance.
