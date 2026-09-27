# Audit Komprehensif & Perbaikan Menu Pihak Paling Sering Terlibat (2026-09-27)

## Ringkasan Eksekusi
Audit menyeluruh terhadap menu **Pihak Paling Sering Terlibat** (`https://cas.bareskrim.polri.go.id/cms/laporan/pihak-sering-terlibat`), memetakan seluruh alur navigasi dan API backend, memvalidasi kelogisan pemeringkatan kasta kejahatan reserse, serta memperbaiki seluruh kejanggalan (*dead-end* klik nomor LP, tombol aksi tabel utama, kesalahan arah tombol dashboard, dan ketahanan metrik DPO) hingga ke akarnya.

---

## 1. Peta Keterhubungan ("Larinya Kemana Aja")

1. **Rute URL & Frontend Rewriting**:
   - URL: `/cms/laporan/pihak-sering-terlibat`
   - Next.js server merujuk rute ini ke komponen `register-pihak-v5-6478da3b8c2c.js`.
   - Di dalam komponen, `checkSering()` mendeteksi *pathname* `pihak-sering` dan secara otomatis mengaktifkan tampilan antarmuka **Pihak Paling Sering Terlibat** (judul: *"Peringkat pihak yang paling sering terlibat dalam Laporan Polisi (Kasta Tertinggi, Lintas Wilayah, Total LP > 1)"*).
2. **Backend API (`bdb-api`)**:
   - Endpoint: `GET /api/bdb/pihak-terlibat/ranking?master=1&peran=...`
   - Melakukan *query* ke basis data `bdb_pihak_terlibat_ranking_snapshot` partisi tahun 2026 (`tahun = 2026 AND bulan IS NULL` dan `total_lp > 1`).
3. **Modal Daftar Laporan Polisi (`getLaporanByNik`)**:
   - Endpoint: `GET /api/bdb/pihak-terlibat/laporan-by-nik/:nik?from=...&to=...`
   - Menggabungkan riwayat LP dari DORS (`bdb_dors_lp_terlibat`) dan entri dokumen manual (`bdb_lp_pihak_manual`), mengembalikan rincian `lp_id`, `no_laporan`, `kejahatan`, `satker_nama`, `peran`, serta penanda `in_period`.

---

## 2. Analisis Kelogisan ("Udah Logis Belom?")

### A. Sangat Logis: Logika Pemeringkatan "Kasta Tertinggi" (*Criminal Recidivism Priority*)
- **Tantangan Data Riil**: Pihak dengan jumlah LP terbanyak secara nasional adalah korban pencurian massal dari sektor korporasi/ritel (misal: PT Sumber Alfaria Trijaya/Alfamart 104 LP korban pencurian, PT Adei 246 LP korban pencurian sawit, atau pelapor tunggal 110 LP).
- **Keputusan Desain Intelijen Reserse Polri**:
  Jika pemeringkatan diurutkan murni `total_lp DESC`, daftar teratas akan dipenuhi korban ritel dan perbankan, sehingga penyidik tidak dapat mendeteksi sindikat kriminal dan pelaku residivis berulang.
  Sistem menerapkan rumus pemeringkatan:
  ```sql
  ORDER BY kasta_rank ASC, satker_tier ASC, jumlah_satker_unik DESC, total_lp DESC
  ```
  - **Rank 1**: DPO
  - **Rank 2**: TERSANGKA (misal: *Sarjono* di DIY - 4 LP tersangka, *R. Pandji Wirianto* - 3 LP tersangka)
  - **Rank 3**: TERLAPOR (misal: *PT Dana Syariah Indonesia* - 83 LP Terlapor di 25 Satker!)
  - **Rank 4**: SAKSI
  - **Rank 5**: KORBAN (misal: Alfamart, PT Adei)
  - **Rank 6**: PELAPOR
- **Kesimpulan**: **100% Sangat Logis dan Tepat Guna bagi Operasional Penyelidikan Polri.**

### B. Sangat Logis: Deteksi Lintas Wilayah (*Cross-Jurisdiction Alert*)
- Menandai secara otomatis perkara yang tersebar di lebih dari 1 Satker/Polda (misal: PT Dana Syariah Indonesia beraksi di 25 Satker berbeda di Indonesia), memberikan sinyal visual "Lintas Wilayah" untuk atensi Mabes/Polda.

---

## 3. Hasil Audit & Perbaikan 4 Anomali

| No | Anomali Ditemukan | Kondisi Sebelum | Kondisi Sesudah (Live) | Status |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **Nomor LP di Modal Tidak Bisa Diklik (*Dead-End*)** | Kolom nomor LP di modal daftar LP hanya berupa teks mati `<div>`. Penyidik tidak bisa membuka berkas perkara. | Nomor LP dibungkus menjadi tautan aktif `<a>` ke `/cms/laporan-polisi/:lp_id` (`target="_blank"`) dilengkapi ikon eksternal dan tombol "Buka LP". | **Fixed (Aktif 100%)** |
| **2** | **Tabel Utama Pasif / Tidak Responsif** | Mengklik nama pihak atau baris tabel tidak memicu respons apapun. Hanya badge kecil merah yang bisa diklik. | 1. Kolom Nama dibuat interaktif (`cursor: pointer`).<br>2. Ditambahkan kolom aksi eksplisit **"Rincian LP"** (`pi pi-file`). | **Fixed (Responsif & Jelas)** |
| **3** | **Tombol 'Lihat Semua' pada Dashboard Salah Sasaran** | Tombol "Lihat Semua" pada widget *Pihak Paling Sering Terlibat* di Dashboard melompat ke `/cms/laporan/rekap-pihak-terlibat` (Register LP mentah). | Tombol "Lihat Semua" diarahkan langsung ke halaman resmi `/cms/laporan/pihak-sering-terlibat`. | **Fixed (Alur Navigasi Tepat)** |
| **4** | **Ketahanan Metrik Card DPO & Pencarian** | Query summary card DPO hanya menghitung dari snapshot yang kosong DPO-nya. | Query summary card DPO diselaraskan langsung dengan kondisi tabel `bdb_dpo`, dan parameter pencarian nama/NIK dibersihkan (`trim`). | **Fixed (Tangguh & Sinkron)** |

---

## 4. File-File yang Diperbarui

1. `pihak-sering-terlibat-fix-20260927/fe/register-pihak-v5-6478da3b8c2c.js`:
   - Modal LP link ke `/cms/laporan-polisi/:lp_id`.
   - Tombol "Buka di Register Pihak Terlibat" di footer modal.
   - Kolom "Aksi" dengan tombol "Rincian LP" pada tabel ranking.
   - Interaktivitas klik pada kolom Nama & Identitas.
2. `pihak-sering-terlibat-fix-20260927/fe/dashboard-perma-318125d33290.js`:
   - Tombol "Lihat Semua" widget diarahkan ke `/cms/laporan/pihak-sering-terlibat`.
3. `pihak-sering-terlibat-fix-20260927/fe/0-gigr76s0g8t.js`:
   - Entri breadcrumb `"pihak-sering-terlibat": "Pihak Paling Sering Terlibat"`.
4. `pihak-sering-terlibat-fix-20260927/be/src/bdb/pihak-terlibat/pihak-terlibat.service.ts`:
   - Penyelarasan hitungan DPO di summary card dan `trim` parameter pencarian.
