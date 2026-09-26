# Patch Perbaikan Pemetaan Satker Legacy DORS & Keterhubungan Antar Menu (2026-09-26)

## Ringkasan Perbaikan
Patch ini menuntaskan akar masalah LP mentah dari DORS yang menumpuk di menu `/cms/integrasi/satker-legacy` dengan status "Belum Termapping" padahal kandidat satkernya di tree Puskarda cocok 100% (contoh: Polda Metro Jaya, Polres Metro Jaksel, Polrestabes Medan, dll.).

### Akar Masalah yang Diperbaiki:
1. **DORS Sync Loop (`dors.service.ts`)**:
   - Pemanggilan `mapFromDors()` yang sebelumnya terlewat di dalam loop per ronde chunk sekarang dipanggil otomatis setelah tiap pasangan chunk selesai diunduh. Data DORS langsung mengalir ke `bdb_laporan_polisi` tanpa harus menunggu sinkronisasi berjam-jam selesai.
2. **Kekakuan Parent Check (`laporan-polisi.service.ts`)**:
   - Query `candidate_base` kini mengizinkan kecocokan langsung jika kode satker anak (`s.kode = r.child_kp`) cocok eksak, sehingga satker yang mengalami restrukturisasi/pemekaran wilayah (seperti Papua Tengah, Papua Barat Daya, dsb.) tidak ditolak karena kode induk historis berbeda.
   - Penambahan method publik `refreshKinerjaPerkaraSnapshot()` untuk pembaruan snapshot Kinerja Perkara secara instan.
3. **Auto-Sweep & Penyegaran Antar Menu (`satker-legacy-reconciliation.service.ts` & `controller.ts`)**:
   - Background auto-sweep otomatis memetakan grup LP yang satkernya cocok eksak ketika halaman satker-legacy diakses/dipantau.
   - Tindakan rekonsiliasi manual (`addToTree` dan `forceMap`) kini langsung menyegarkan snapshot Kinerja Perkara.
   - Penambahan endpoint `@Post('map')` pada `SatkerLegacyReconciliationController`.

### Hasil Verifikasi:
- **LP Belum Termapping**: Berkurang dari 4.106 menjadi 1 LP (hanya menyisakan 1 data anomali historis Polsek Caringin tanpa kode pusiknas untuk penanganan manual admin).
- **LP Aktif di CAS**: Bertambah menjadi 1.742.798 LP.
- **Keterhubungan Antar Menu**: Data langsung tersinkron antara menu DORS, Satker Legacy, Data Laporan Polisi, dan Kinerja Perkara.
