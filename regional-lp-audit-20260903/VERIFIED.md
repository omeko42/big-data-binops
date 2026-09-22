# Perbaikan akses operasional LP — LIVE

Terverifikasi 3 September 2026, 20.14 WIB (13.14 UTC).

## Perubahan

- Helper bersama akses operasional sekarang mengikuti pemilik efektif: unit_satker_id, atau satker_id jika unit kosong.
- Satreskrim tidak otomatis diberi akses baca/tulis ke semua Polsek dalam Polres.
- Semua pemanggil helper untuk daftar, statistik, detail, dan pelimpahan menggunakan aturan yang sama.
- Tidak memindahkan LP berdasarkan jenis kejahatan. Tujuan penanganan tetap berasal dari alamat/pemilik yang dipetakan dari DORS.
- Tidak mengubah data LP, tautan akun, parent master satker, atau riwayat transfer.
- Tidak mengubah scope.util (guard superadmin/admin), rumus kinerja, maupun kode hierarki rekap.

## Pemasangan

Container bdb-api, host 10.0.0.x.

Backup: /home/clouduser/codex-backups/bdb-api/regional-owner-scope-20260903-131306

Hanya dua file produksi diperbarui:

- /usr/src/app/dist/bdb/common/lp-scope.util.js — SHA256 6eb14fed2bf546fb729dc9c8443b15387053186f8bdaf1d258806abb1854147c
- /usr/src/app/src/bdb/common/lp-scope.util.ts — SHA256 4dfc8a69a6832a6f37cd7fd4535f7db2140698003a4636aa3ad12def55cea4f6

laporan-polisi.service.js tetap SHA256 31b4109abc128bcc361c73bb52a458c73da16378e9460cd06208ce351ce024fa; hotfix alamat sebelumnya dipertahankan.

## Bukti uji

- Empat pengujian lulus terhadap file runtime produksi dan parity source TypeScript.
- HTTP health backend kembali 200 setelah restart.
- Verifikasi read-only memakai LaporanPolisiService dari dist produksi langsung, tanpa mengganti helper dengan mock kandidat:

| Akun / unit | LP 2026 sebelum | LP 2026 sesudah | Statistik |
| --- | ---: | ---: | --- |
| 14843 / Satreskrim Bone Bolango | 188 | 135 | sama dengan daftar |
| 14970 / Satreskrim Hulu Sungai Utara | 57 | 36 | sama dengan daftar |
| 14353 / Satreskrim Ciamis | 288 | 188 | sama dengan daftar |
| 15957 / Unit Reskrim Penrang | 8 | 8 | sama dengan daftar |

- Helper menolak akses tulis lintas pemilik Polsek; akses milik Polsek sendiri tetap diterima.
- LP7 Jembrana yang berstatus pelimpahan eksternal tetap terlindungi, tanpa rollback riwayat.
- resolveScope superadmin tetap all=true dan isSuper=true.
- Belum melakukan pengujian antarmuka dengan login/impersonasi pengguna atau pengiriman perubahan dokumen produksi.

## Job penarikan

Tidak ada job running atau proses mapping aktif pada kedua pemeriksaan sebelum restart. Kedua job tetap success setelah pemasangan:

- 463: fetched 47.596, upserted 46.295, selesai 09.33.05 UTC / 16.33.05 WIB.
- 464: fetched 49.963, upserted 48.594, selesai 11.45.50 UTC / 18.45.50 WIB.

Tidak menghentikan, mengulang, menghapus, atau mengubah job.

## Belum termasuk

Perbaikan parent Pangandaran/Toraja, konsolidasi LAPRI/Pitumpanua, tautan akun Julian, dan review pelimpahan Jembrana tetap temuan audit terpisah. Penentuan Polsek Harkamtibmas belum boleh didasarkan pada asumsi dari master yang tidak memiliki penanda tepercaya. Tampilan loading DORS tidak diubah dalam patch ini.
