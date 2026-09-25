# Kinerja Perkara Unified Filter, PDF Export, Mobile Drawer & LP Status Cards (2026-09-25)

## Ringkasan Perubahan

1. **Unified Filter Perkara (4-in-1 Filter Modal)**:
   - Menggabungkan 4 tombol filter terpisah menjadi 1 tombol utama: `[ 🎛️ Filter Perkara (X) ▾ ]`.
   - Modal dialog komprehensif dengan 4 tab:
     - 📅 **Periode**: Bulan, Tahun, Custom rentang tanggal.
     - 🏛️ **Satker & Wilayah**: Kelompok Nasional vs Regional, Pemilihan Satker Wilayah, Cakupan Satker (Internal vs Eksternal Reserse).
     - ⚖️ **Kejahatan**: Kelompok Induk Kejahatan (Krimum, Krimsus, Narkoba), Sub-Kelompok TIPID, MultiSelect Golongan & ICCS, MultiSelect Jenis Kejahatan dengan filter search dan shortcut Pilih Semua / Hapus Pilihan.
     - ⚙️ **Parameter & Model**: Acuan Tanggal Perhitungan (Tgl Lapor, Tgl Kejadian, Keduanya), Model LP (A/B), Penyelesaian Perkara (RJ vs Non-RJ), Mode Kinerja (Usia Perkara vs Tingkat Kesulitan).
   - Chip filter aktif di bawah toolbar dengan tombol `✕` untuk menghapus filter spesifik secara langsung.
   - Peningkatan kontras tinggi (Dark Mode & Light Mode) untuk tab, teks panduan, dropdown, dan tombol modal.

2. **Ekspor Menu & Cetak PDF Resmi Format Surat Dinas (Word/Dinas Style)**:
   - Menu dropdown `[ Ekspor ▾ ]` dengan icon badge:
     - Ekspor CSV (Excel)
     - Cetak / Ekspor PDF Resmi
   - Modal editor interaktif layout surat dinas kepolisian:
     - Form sebelah kiri untuk custom teks KOP instansi, alamat kontak, judul laporan, cakupan wilayah, periode, tanggal/tempat TTD, jabatan, nama, dan pangkat NRP pejabat.
     - Live preview dokumen A4 landscape formal dengan tabel data lengkap (CT, BU, Limpah, CP, PR, CC, CR, Indeks Kinerja) beserta baris total dan area tanda tangan resmi.
     - Tombol cetak yang mengaktifkan print engine native browser presisi (@page A4 landscape).

3. **Perbaikan Drawer Sidebar di HP (Mobile Layout & Stacking)**:
   - Mengatasi masalah sidebar buram/terhalang overlay backdrop di versi mobile.
   - Z-index drawer mobile ditingkatkan menjadi `1000` di atas backdrop overlay (`998`), sehingga drawer tampil tajam, jernih, dan responsif terhadap sentuhan tap.
   - Aturan desktop `.cms-sidebar` diisolasi khusus untuk `@media (min-width: 1025px)`.

4. **Redesain Kartu Metrik Status Laporan Polisi (Executive KPI Cards)**:
   - Memperbaiki bug di mana `.lp-stat` salah masuk ke aturan styling badge/pill (`border-radius: 999px`), yang sebelumnya menyebabkan kartu menjadi kapsul gepeng dengan teks terjepit.
   - Dirombak menjadi Executive Metric Cards modern dengan layout vertikal: angka metrik besar (`1.35rem`, tebal 900) di atas, dan label status uppercase bersih di bawah.
   - Garis aksen indikator kategori 3.5px:
     - Merah Presisi (`#dc2626`) untuk Semua LP.
     - Amber hangat (`#f59e0b`) untuk Belum Update.
     - Biru eksekutif (`#2563eb`) untuk Dalam Proses (Lidik, Sidik, SPDP, Tahap I, P19, P21).
     - Hijau emerald (`#10b981`) untuk Penyelesaian (SP2LID, PERMA, SP3, Tahap II).
   - Efek elevasi hover dan highlight aktif saat filter status dipilih.
