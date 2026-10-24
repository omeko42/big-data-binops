# Pedoman Tata Kelola & Kontribusi / Governance & Contribution Guidelines — Big Data Binops (BDB) — Powered by CAS (*Community Anggota Serse*)

> 🌐 **Daftar Isi / Sections:** [**🇮🇩 Bagian I: Bahasa Indonesia**](#-bagian-i-pedoman-tata-kelola--kontribusi-bahasa-indonesia) &nbsp;|&nbsp; [**🇬🇧 Part II: English Version**](#-part-ii-governance--contribution-guidelines-english)

---

## 🇮🇩 Bagian I: Pedoman Tata Kelola & Kontribusi (Bahasa Indonesia)

Dokumen ini mengatur standar teknis, keamanan, dan alur pelaporan bagi **Tim Pokja Pengembang Internal Bareskrim Polri** serta anggota **CAS (*Community Anggota Serse*)** dalam mengusulkan perbaikan data, rekonsiliasi hierarki Satker, maupun pengembangan modul pada platform **Big Data Binops (BDB)**.

### 1. Alur Pelaporan Kendala Lapangan melalui CAS (*Community Anggota Serse*)
Anggota Reserse, operator, Kanit Reskrim Polsek, dan KBO Satreskrim/Ditreskrim dapat melaporkan temuan operasional melalui kanal resmi **CAS (*Community Anggota Serse*)** atau fitur **Pusat Bantuan / SHARESE** di dalam aplikasi dengan menyertakan:
1. **Identitas Satker & Akun Operator**: Tingkat Satker (`Mabes / Polda / Polres / Polsek`), Satuan Fungsi (`Reskrim / Narkoba / PPA-PPO / Siber / Eksus / Pidter`), dan `username` / NRP.
2. **Kategori Kendala Operasional**:
   - **Rekonsiliasi Hirarki / Pemekaran Satker**: Misalnya Polsek atau Satres baru hasil pemekaran `Perpol 4/2025` yang belum terpetakan di `bdb_dors_satker_map`.
   - **Sinkronisasi LP DORS Stamaops Polri**: Nomor LP yang sudah diinput di DORS Stamaops Polri namun belum tampil atau salah kamar fungsi.
   - **Perhitungan Kinerja Perkara (CT / CP / CC / CR / Indeks)**: Ketidaksesuaian antara status dokumen penyidikan (`Tahap II`, `SP3`, `RJ`, `SP2Lid`) dengan angka pada tabel *Kinerja Perkara*.

### 2. Standar Rekayasa Kode & Basis Data (Bagi Tim Pokja Pengembang)
Setiap perubahan pada kode sumber (`backend/`, `frontend/`) dan skema basis data (`database/`) wajib mematuhi prinsip berikut:
1. **Kebijakan Tanpa Rahasia (*Zero-Secret*) & Kepatuhan UU PDP**:
   - **Dilarang keras** melakukan *commit* file `.env`, kata sandi basis data, `JWT_SECRET`, kunci privat SSL/TLS, alamat IP internal, maupun data identitas pribadi (NIK/NRP/Nama Tersangka riil) ke dalam repositori Git.
   - Seluruh konfigurasi sensitif wajib dipanggil melalui `process.env.*` (Node.js/NestJS) atau `os.environ.get(...)` (Python).
2. **Keamanan Parameter SQL (Anti-Injeksi & Anti-Interpolasi)**:
   - Seluruh kueri SQL dinamis wajib menggunakan *parameterized placeholders* (`$1, $2, ...` atau `ANY($1::bigint[])`).
3. **Kepatuhan Doktrin Yuridis KUHAP & SOTK Polri**:
   - Pemisahan tegas antara `INTERNAL_RESERSE` dan `EKSTERNAL_RESERSE` pada `bdb_satker_taxonomy_r11` tidak boleh dicampur.
   - Status **P-21** tetap dihitung sebagai beban **CT / Crime Process** hingga penyerahan fisik tersangka dan barang bukti (**Tahap II**).
   - Cakupan akses tingkat Polsek wajib menyatukan induk `POLSEK` dan anak `UNIT RESKRIM POLSEK` agar tidak terjadi selisih visibilitas bagi operator Polsek.
4. **Eksekusi Klaster Non-Blocking**:
   - Mengingat `bdb-api` berjalan di atas **32 instance worker PM2**, operasi latar belakang berskala berat (seperti *refresh* `bdb_kinerja_perkara_snapshot`) wajib dieksekusi secara *non-blocking* (`setImmediate`) dan dikunci menggunakan **PostgreSQL Advisory Lock** (`pg_try_advisory_lock`).

---

## 🇬🇧 Part II: Governance & Contribution Guidelines (English)

This document defines the technical, security, and operational reporting standards for the **Bareskrim Polri Internal Development Working Group (Tim Pokja)** and members of **CAS (*Community Anggota Serse*)** contributing to **Big Data Binops (BDB)**.

### 1. Field Issue Reporting via CAS (*Community Anggota Serse*)
Investigators, operators, Kanit Reskrim Polsek, and KBO Satreskrim/Ditreskrim can report operational edge cases via the official **CAS (*Community Anggota Serse*)** channels or the in-app **Help Center / SHARESE** feed by providing:
1. **Satker Identity & Operator Account**: Territorial tier (`Mabes / Polda / Polres / Polsek`), functional unit (`Reskrim / Narkoba / PPA-PPO / Siber / Eksus / Pidter`), and `username` / NRP.
2. **Issue Classification**:
   - **Satker Hierarchy / New Jurisdiction Split (*Pemekaran*)**: Newly established Polsek or Satres units under `Perpol 4/2025` requiring alias mapping in `bdb_dors_satker_map`.
   - **DORS Stamaops Polri LP Synchronization**: Police Reports entered upstream in DORS Stamaops Polri requiring unit placement or crime-group reconciliation.
   - **Case Performance Metrics (CT / CP / CC / CR / Index)**: Verification of investigation document statuses (`Tahap II`, `SP3`, `RJ`, `SP2Lid`) against *Kinerja Perkara* aggregations.

### 2. Engineering & Database Standards (For Core Developers)
1. **Strict Zero-Secret & UU PDP Compliance**: Never commit `.env` files, database passwords, `JWT_SECRET`, TLS private keys, internal subnet IPs, or real citizen PII into Git. Always read secrets from `process.env.*` or `os.environ.get(...)`.
2. **Parameterized SQL Queries**: Always use PostgreSQL positional parameters (`$1, $2, ...` or `ANY($1::bigint[])`).
3. **Juridical & SOTK Invariants**: Preserve strict separation between `INTERNAL_RESERSE` and `EKSTERNAL_RESERSE`, maintain the KUHAP doctrine that **P-21** remains active CT workload until physical **Tahap II** handover, and keep parent `POLSEK` $\leftrightarrow$ child `UNIT RESKRIM POLSEK` scopes unified.
4. **Non-Blocking 32-Worker PM2 Cluster Coordination**: Heavy background jobs must run asynchronously via `setImmediate()` guarded by PostgreSQL Advisory Locks (`pg_try_advisory_lock`).
