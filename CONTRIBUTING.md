# Pedoman Tata Kelola Pengembangan & Kontribusi — Big Data Binops (BDB) & CAS

Dokumen ini mengatur standar teknis, keamanan, dan alur pelaporan bagi **Tim Pokja Pengembang Internal Bareskrim Polri** serta anggota **CAS (*Community Anggota Serse*)** dalam mengusulkan perbaikan data, rekonsiliasi hierarki Satker, maupun pengembangan modul pada platform **Big Data Binops (BDB)**.

---

## 1. Alur Pelaporan Kendala Lapangan via CAS (*Community Anggota Serse*)

Anggota Reserse, operator, Kanit Reskrim Polsek, dan KBO Satreskrim/Ditreskrim dapat melaporkan temuan operasional melalui kanal resmi **CAS (*Community Anggota Serse*)** atau fitur **Pusat Bantuan / SHARESE** di dalam aplikasi dengan menyertakan:
1. **Identitas Satker & Akun Operator**: Tingkat Satker (`Mabes / Polda / Polres / Polsek`), Satuan Fungsi (`Reskrim / Narkoba / PPA-PPO / Siber / Eksus / Pidter`), dan `username` / NRP.
2. **Kategori Kendala**:
   - **Rekonsiliasi Hirarki / Pemekaran Satker**: Misalnya Polsek atau Satres baru hasil pemekaran `Perpol 4/2025` yang belum terpetakan di `bdb_dors_satker_map`.
   - **Sinkronisasi LP DORS**: Nomor LP yang sudah diinput di DORS Stamaops Polri namun belum tampil atau salah kamar fungsi.
   - **Perhitungan Kinerja Perkara (CT / CP / CC / CR / Indeks)**: Ketidaksesuaian antara status dokumen penyidikan (`Tahap II`, `SP3`, `RJ`, `SP2Lid`) dengan angka pada tabel *Kinerja Perkara*.

---

## 2. Standar Rekayasa Kode & Database (Bagi Tim Pokja Pengembang)

Setiap perubahan pada kode sumber (`backend/`, `frontend/`) dan skema database (`database/`) wajib mematuhi prinsip berikut:

1. **Zero-Secret & Kepatuhan UU PDP (Mutlak)**:
   - **Dilarang keras** melakukan *commit* file `.env`, password database, `JWT_SECRET`, kunci privat SSL/TLS, alamat IP internal (`10.200.x.x`), maupun data identitas pribadi (NIK/NRP/Nama Tersangka riil) ke dalam repositori Git.
   - Seluruh konfigurasi sensitif wajib dipanggil melalui `process.env.*` (Node.js/NestJS) atau `os.environ.get(...)` (Python).
2. **Keamanan Parameter SQL (Anti SQL Injection & Interpolasi)**:
   - Seluruh query SQL dinamis wajib menggunakan *parameterized placeholders* (`$1, $2, ...` atau `ANY($1::bigint[])`).
3. **Kepatuhan Doktrin Yuridis KUHAP & SOTK Polri**:
   - Pemisahan tegas antara `INTERNAL_RESERSE` dan `EKSTERNAL_RESERSE` pada `bdb_satker_taxonomy_r11` tidak boleh dicampur.
   - Status **P-21** tetap dihitung sebagai beban **CT / Crime Process** hingga penyerahan fisik tersangka dan barang bukti (**Tahap II**).
   - Cakupan akses tingkat Polsek wajib menyatukan induk `POLSEK` dan anak `UNIT RESKRIM POLSEK` agar tidak terjadi selisih visibilitas bagi operator Polsek.
4. **Non-Blocking Cluster Execution**:
   - Mengingat `bdb-api` berjalan di atas **32 instance worker PM2**, operasi *heavy background* (seperti *refresh* `bdb_kinerja_perkara_snapshot`) wajib dieksekusi secara *non-blocking* (`setImmediate`) dan dikunci menggunakan **PostgreSQL Advisory Lock** (`pg_try_advisory_lock`).
