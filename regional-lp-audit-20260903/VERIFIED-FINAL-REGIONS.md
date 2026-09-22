# Koreksi terakhir wilayah — bukti LIVE

Diverifikasi 3 September 2026 21.39 WIB. Pengguna meminta kendala yang sudah diaudit diselesaikan dan live dahulu, sebelum menentukan pekerjaan lainnya.

## Perubahan produksi

| Objek | Koreksi | Hasil pemeriksaan |
| --- | --- | --- |
| Berangas / Alalak | 25 LP dari 12641/12643 ke 19870/20901 | Alalak 46 LP seluruh periode, 20 tahun 2026; Barito Kuala 17 Polsek aktif |
| Teluk Pakedai 11786 | parent 11757 Mempawah ke 12282 Kubu Raya | Tetap benar setelah restart; unit 11788 tetap anak Polsek |
| Terentang 11789 | parent 11757 ke 12282 | Tetap benar setelah restart; unit 11791 tetap anak Polsek |
| Batu Ampar 11795 | parent 11757 ke 12282 | Tetap benar setelah restart; unit 11797 tetap anak Polsek |
| Kubu lama 11792/11794 | 6 LP ke master akun 21027/21028; master lama menjadi alias tidak aktif, parent diperbaiki ke 12282 | Akun 14320 memiliki 6 LP seluruh periode, 4 tahun 2026 |
| Kubu baru 21027/21028 | organization_domain NULL menjadi INTERNAL_POLRI; function_domain menjadi STRUCTURAL / INTERNAL_RESERSE sesuai level | Terlihat pada filter Internal Reserse; daftar dan statistik cocok |

Master duplikat 12641,12643,11792,11794 tidak dihapus. Flag kinerja_aktif, dors_mapping_aktif, pelimpahan_target_aktif menjadi false; tidak tersisa LP atau scope akun yang bergantung padanya. Mempawah kini 10 Polsek aktif, Kubu Raya 7; empat nama Polsek yang dikeluhkan masing-masing muncul tepat satu kali di Kubu Raya.

Untuk 31 LP, skrip hanya memperbarui satker_id/nama, unit_satker_id/nama/kode, updated_at. Nomor LP, isi, status, dokumen, dan riwayat tidak dimodifikasi. Trigger yang sudah ada menyelaraskan snapshot; 31 pemilik snapshot diverifikasi. Tidak ada LP dihapus atau akun dinonaktifkan. Role dan seluruh field scope akun identik sebelum/sesudah.

Sembilan alias memastikan nama/kode historis tetap menuju master aktif, termasuk Berangas/Alalak serta Kubu. Dua alias lama diperbarui (3564,681); tujuh alias baru: 6231,6232,6233,6235,6236,6237,6238.

## Verifikasi daftar, statistik, dan regresi

Pengujian menggunakan metode list dan stats dari layanan produksi. Untuk list, hanya proyeksi kolom hasil diubah menjadi ID/pemilik sebelum query dieksekusi; WHERE, scope, filter domain, rentang tanggal, urutan, dan pagination tetap kode aplikasi sebenarnya. Tidak mengambil uraian kasus atau identitas pihak.

| Akun/scope | Semua periode | Tahun 2026 | Daftar = statistik |
| --- | ---: | ---: | --- |
| Alalak 15845/20901 | 46 | 20 | Ya |
| Kubu 14320/21028 | 6 | 4 | Ya |
| Penrang 15957/15552 | 14 | 8 | Ya |
| Pitumpanua 15950/20952 | 112 | 42 | Ya |
| Ciamis 14353/19437 | 581 | 188 | Ya |

Penrang tahun 2025 = 5 LP. Hasil ini bukan klaim kelengkapan terhadap seluruh LP di DORS, dan bukan pengujian antarmuka dengan sesi operator.

Uji hierarki runtime dan source lulus: empat parent baru benar, child/unit tetap benar, override Pangandaran dan Toraja Utara sebelumnya tidak berubah. Sesudah restart, pemeriksaan aktual dan regresi Julian, Pitumpanua, Lappariaja, Pangandaran/Toraja Utara juga lulus.

## Deployment, rollback, dan cadangan

- Final audit: 1792663 / FINAL_REGIONS_REPAIRED_V2_20260903.
- Backup kode dan metadata tetap di produksi: /home/clouduser/codex-backups/bdb-api/final-regions-v2-20260903-143723.
- Backup metadata container: /tmp/final-regions-repair-v2-20260903/data-before.json.
- Hanya runtime dan source SatkerService ditambahi empat hierarchyParentOverrides; tidak full-build dari source lama.
- Runtime SHA256: ca0580d02bb2d6acdbc76e0aa10d067376676e85b392ae4836ec8bc55ac07537.
- Source SHA256: 5c3cfd63bf0e1dd75e8ccc79245aec0c1795fe75b23286d3f8120d893f2a8f5f.
- Pengecekan akhir 14:39:10 UTC: API_HTTP=200 dan PUBLIC_WEB_HTTP=200.
- Job463 dan464 tetap success; guard tidak menemukan penarikan aktif atau proses mapping panjang sebelum/sesudah restart. Tidak menghentikan job.

Percobaan pertama (audit1792383) otomatis di-rollback seluruhnya (audit1792397) karena verifikasi akun Kubu menghasilkan 0, bukan 6. Penyebab ditemukan: klasifikasi domain master Kubu baru NULL sehingga filter daftar menolaknya. Versi kedua memasukkan koreksi dua master tersebut, lulus pemeriksaan sebelum dan sesudah restart. Backup percobaan pertama tetap tersimpan di final-regions-20260903-143134.

## Batas pekerjaan

Tidak membaca password/token, isi sensitif kasus, identitas pihak, atau dokumen. Tidak mengubah status penanganan dan pelimpahan. Aturan Harkamtibmas nasional, perbaikan generik pembuatan master agar domain tidak kosong, serta audit kelengkapan seluruh DORS tidak termasuk perubahan kali ini dan belum dinyatakan selesai.
