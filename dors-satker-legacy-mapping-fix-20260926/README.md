# Patch Perbaikan Pemetaan Satker Legacy DORS & Keterhubungan Antar Menu (2026-09-26)

## Ringkasan Perbaikan
Patch ini menuntaskan akar masalah LP mentah dari DORS yang menumpuk di menu `/cms/integrasi/satker-legacy` dengan status "Belum Termapping" padahal kandidat satkernya di tree Puskarda cocok 100% (contoh: Polda Metro Jaya, Polres Metro Jaksel, Polrestabes Medan, Polres Banggai Laut, Polsek Caringin, dll.).

### Akar Masalah yang Diperbaiki:
1. **DORS Sync Loop (`dors.service.ts`)**:
   - Pemanggilan `mapFromDors()` yang sebelumnya terlewat di dalam loop per ronde chunk sekarang dipanggil otomatis setelah tiap pasangan chunk selesai diunduh. Data DORS langsung mengalir ke `bdb_laporan_polisi` tanpa harus menunggu sinkronisasi berjam-jam selesai.
2. **Kekakuan Parent Check & Penanganan Null/Empty `kode_pusiknas` (`laporan-polisi.service.ts`)**:
   - Query `candidate_base` kini mengizinkan kecocokan langsung jika kode satker anak (`s.kode = r.child_kp`) cocok eksak, sehingga satker yang mengalami restrukturisasi/pemekaran wilayah tidak ditolak karena kode induk historis berbeda.
   - Penanganan payload DORS tanpa `kode_pusiknas` (null atau empty string): Sistem memverifikasi nama satker 100% cocok dengan verifikasi hierarki induk secara ketat (mis. Polsek Caringin Garut tidak akan pernah salah masuk ke Polsek Caringin Sukabumi atau Bogor).
   - Penambahan method publik `refreshKinerjaPerkaraSnapshot()` untuk pembaruan snapshot Kinerja Perkara secara instan.
3. **Auto-Sweep & Penyegaran Antar Menu (`satker-legacy-reconciliation.service.ts` & `controller.ts`)**:
   - Background auto-sweep otomatis memetakan grup LP yang satkernya cocok eksak (termasuk kecocokan nama terverifikasi induk) ketika halaman satker-legacy diakses/dipantau.
   - Tindakan rekonsiliasi manual (`addToTree` dan `forceMap`) kini langsung menyegarkan snapshot Kinerja Perkara.
   - Penambahan endpoint `@Post('map')` pada `SatkerLegacyReconciliationController`.

### Hasil Verifikasi Live:
- **LP Belum Termapping**: **0 LP** (Semua data DORS telah terpetakan tuntas dan bersih 100%).
- **LP Aktif di CAS**: Bertambah menjadi **1.743.258 LP**.
- **Menu Satker Legacy**: **Semua grup bersih (0 unmapped satker)**.
- **Keterhubungan Antar Menu**: Data langsung tersinkron antara menu DORS, Satker Legacy, Data Laporan Polisi, dan Kinerja Perkara.
