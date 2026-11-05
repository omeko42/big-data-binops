# Inventarisasi Rute & Modul Fitur Frontend — Big Data Binops (BDB)

Dokumen ini memetakan **77 rute halaman Next.js App Router** (`bdb-web`, Next.js `16.2.10` + React `19.2.4` + PrimeReact `10.9.8`), **28 bundel modul fitur** di `frontend/src/modules/`, layanan mikro dokumen `cas-doc-service` (`3860`), serta endpoint API Backend (`bdb-api` `3850`) yang dipanggil oleh masing-masing halaman.

---

## 1. Struktur Direktori `frontend/`

| Path | Deskripsi |
| :--- | :--- |
| `frontend/package.json` | Manifest dependensi Next.js 16.2.10, React 19.2.4, PrimeReact 10.9.8, Chart.js 4.5.1, Lucide React, Axios |
| `frontend/server.js` | Custom standalone HTTP server Next.js (port `3000`, override header `Cache-Control: public, max-age=0, must-revalidate` untuk mencegah stale chunk) |
| `frontend/src/app-routes-manifest.json` | Manifest resmi rute App Router (`.next/app-path-routes-manifest.json`) |
| `frontend/services/cas-doc-service/cas_doc_service.py` | Microservice Python v3.0 (port `3860`) untuk manajemen dokumen ANEV Jukminu Polri & integrasi ONLYOFFICE Document Server (`8088`) |
| `frontend/services/cas-doc-service/cas-docs.service` | Unit systemd untuk menjalankan `cas_doc_service.py` secara otomatis |
| `frontend/src/styles/theme.modern.css` | Stylesheet tema modern BDB/CAS Polri (Dark/Light mode, standarisasi filter bar, & komponen PrimeReact) |

---

## 2. Daftar Lengkap 28 Bundel Modul Fitur (`frontend/src/modules/`)

| No | Sub-Folder & Nama Bundle | Fitur & Tanggung Jawab Utama |
| :-: | :--- | :--- |
| 1 | `auth/layout-guard.bundle.js` | Sidebar navigasi dinamis (termasuk placeholder menu **Coserse**), RBAC route guard, proteksi *Read-Only* untuk role `testing`, multi-tab logout sync, Obrolan Cepat (`@cosersebot`), halaman Koneksi/Profil Personel (`pangkat` aktual), serta modal mengambang **Lapor Bug & Kendala Sistem**. |
| 2 | `auth/profile-security.bundle.js` | Manajemen profil personel, WebAuthn Passkey, TOTP Authenticator, PIN, Email OTP, ganti kata sandi, dan halaman penuh **Keamanan & Pengaturan Akun Sharese (`/cms/profile-keamanan`)**. |
| 3 | `auth/session-manager.bundle.js` | Interceptor Axios (`apiAuth`), manajemen sesi JWT, `device_token`, dan penanganan error `401`/`403`. |
| 4 | `anev/anev-ctcc-onlyoffice.bundle.js` | Modul Laporan ANEV CT/CC terintegrasi ONLYOFFICE Document Editor & 13 Lembar Lampiran rekapitulasi resmi. |
| 5 | `anev/anev-lp.bundle.js` | Modul Analisis dan Evaluasi Laporan Polisi hierarkis per Satker. |
| 6 | `barang-bukti/rekap-barang-bukti.bundle.js` | Register Barang Bukti nasional dengan kolom gabungan **JENIS & NAMA / DETAIL BARANG** (maks 2 baris + elipsis), **16 kategori induk barang bukti**, pemisahan **Jumlah (Numerik)** & **Satuan (Dropdown Standar Indonesia)**, serta edit satuan khusus record DORS. |
| 7 | `broadcaster/sharese-broadcaster.bundle.js` | Jejaring sosial internal **SHARESE** (`/cms/broadcaster`) dengan *autocomplete* **`@username`** saat mengetik `@`, standarisasi kontainer gelembung pesan di **Obrolan**, Jukrah pimpinan, komentar, dan reaksi. |
| 8 | `broadcaster/pengumuman-moderator.bundle.js` | Panel moderasi pengumuman, laporan konten, dan *Panic Takedown*. |
| 9 | `dashboard/dashboard-main.bundle.js` | Dashboard Eksekutif Utama (CT/CC/CR, *hover flyout* rincian Satker pada **10 Kejahatan Tertinggi**, **10 Satker CT/CC Tertinggi**, serta modul **Peta Kejahatan** dengan agregasi cakupan **Satker + Jajaran di Bawahnya**). |
| 10 | `dors/dors-integration.bundle.js` | **Portal Integrasi Masuk (`/cms/integrasi/masuk-penarikan`)** berbasis tabel daftar klien (klien pertama: `DORS — Stamaops Polri`), tombol switch aktif/nonaktif dengan konfirmasi, serta modal **Kelola & Log** permanen. |
| 11 | `dors/integrasi-dors-data.bundle.js` | **Staging Data Integrasi (`/cms/integrasi/staging`)** dengan pemuatan paralel instan antara kartu penghitungan statistik dan tabel daftar LP, disertai lencana status pemetaan per tahap. |
| 12 | `dors/integrasi-master-data-gap.bundle.js` | Pemantauan dan rekonsiliasi **Cek Gap Master Data (`/cms/integrasi/master-data-gap`)** dengan resolusi otomatis kode referensi. |
| 13 | `integrasi/portal-keluar.bundle.js` | Manajemen **Portal Integrasi Keluar (`/cms/integrasi/portal-keluar`)**, pengaturan *Scope* 9 kategori, IP Whitelist, dan log akses API eksternal. |
| 14 | `kasus-menonjol-atensi/kasus-menonjol.bundle.js` | Manajemen dan pemantauan **Kasus Menonjol (Susjol)** dengan kolom **LP & Satker yg menangani**, **Lampiran Dokumentasi**, dropdown `Sub-Kelompok Tipid`, tabel **Sprin** 1-baris (periode otomatis), dan tabel **Dokumentasi Kegiatan** (maks 5 foto). |
| 15 | `kasus-menonjol-atensi/kasus-atensi.bundle.js` | Manajemen dan pemantauan **Kasus Atensi Pimpinan / Publik** dengan struktur tabel dan lampiran terstandar. |
| 16 | `kerma/kerma.bundle.js` | Manajemen Bank Data **Kerja Sama (`/cms/kerma`)** dalam dan luar negeri (`MoU` / `PKS`) dengan pratinjau dokumen terintegrasi. |
| 17 | `kerma/kerma-lihat.bundle.js` | Halaman katalog **Lihat Kerja Sama (`/cms/kerma/lihat`)** dengan tombol layar lebar terpadu di sudut kanan atas modal pratinjau. |
| 18 | `kinerja-perkara/kinerja-perkara.bundle.js` | Tabel hierarki **Kinerja Perkara** (`CT`, `CC Aktual/Tunggakan`, `CP`, `PERMA`, `CR Rumus Lama & Baru`, `Indeks Kinerja`) menggunakan `nama_singkat` master satker (`POLDA SUMUT`, `DITKRIMUM`, dll.). |
| 19 | `laporan-polisi/laporan-polisi.bundle.js` | **Daftar Laporan Polisi (`/cms/laporan-polisi`)** dengan Nomor LP maksimal 2 baris (*wrap text* lalu elipsis), nama Satker Penanganan dari kamus `nama_singkat`, serta kolom Dugaan Tindak Pidana 2 baris (1 ikon palu di baris kejahatan, diikuti baris pasal). |
| 20 | `laporan-polisi/laporan-polisi-detail-flow.bundle.js` | **Detail Laporan Polisi & Alur Dokumen Penyidikan** dengan label sumber `DORS` (bukan `Terintegrasi`/`Terpusat`) serta proteksi **Edit-Only / No-Delete** untuk seluruh item Tindak Pidana, Pihak Terlibat, dan Barang Bukti yang berasal dari DORS. |
| 21 | `master/master-menu.bundle.js` | Pengaturan matriks hak akses menu per role (`/cms/master/menu`). |
| 22 | `master/master-ref-hub.bundle.js` | Portal navigasi **Master Referensi (`/cms/master-ref`)** termasuk kartu **Kelompok Kejahatan** (`KRIMUM`, `KRIMSUS`, `NARKOBA`, `PPA-PPO`, `SIBER`) dan **Sub-Kelompok Tipid** (`TIPIDUM`, `TIPIDEKSUS`, `TIPIDKOR`, `TIPIDTER`, `TIPIDNARKOBA`, `TIPIDPPA-PPO`, `TIPIDSIBER`). |
| 23 | `master/master-slug.bundle.js` | Modul CRUD generik untuk tabel-tabel referensi di `/cms/master/[slug]`. |
| 24 | `master-user/master-user.bundle.js` | Manajemen **Master User (`/cms/master/user`)** dengan urutan pangkat komando Polri (`Jenderal` → `Bharada`), indikator **Skor Keaktifan (30d Login + Durasi Sesi)**, bulk import, dan bulk reset password. |
| 25 | `operasi-satgas/operasi-satgas-master.bundle.js` | Manajemen Master **Susopsgas / Operasi Kepolisian** (`/cms/master/operasi-satgas`) dengan tabel Sprin dan Dokumentasi Kegiatan. |
| 26 | `operasi-satgas/rekap-operasi-satgas.bundle.js` | Rekapitulasi **Susopsgas (`/cms/laporan/rekap-operasi-satgas`)** berdasarkan operasi satgas aktif. |
| 27 | `panduan/panduan-page.bundle.js` & `panduan/panduan-kelola.bundle.js` | **Pusat Panduan Multi-Media (`/cms/panduan` & `/cms/panduan/kelola`)** dengan 3 tab terpisah: **Buku Panduan (PDF)**, **Video Tutorial**, dan **Infografis**. |
| 28 | `pengaturan/pengaturan-email.bundle.js`, `pihak-terlibat/rekap-pihak-terlibat.bundle.js`, `satker/satker-tree.bundle.js`, `satker/satker-legacy-reconcile.bundle.js` | Konfigurasi **Multi-SMTP Failover** dengan kartu variabel di bawah kartu SMTP Polri, **Register Pihak Terlibat & Pihak Sering Terlibat** (maks 2 baris per sel, label `Direktur Utama`, kontainer *rounded rectangle* `8px–10px`), **Pohon Satker**, dan **Cek Duplikat / Rekonsiliasi Satker Legacy**. |

---

## 3. Rute Utama Aplikasi (`app-routes-manifest.json`)

| Kelompok Modul | URL Path Utama | Endpoint API Backend / Layanan Dokumen |
| :--- | :--- | :--- |
| **Dashboard & Peta Kejahatan** | `/cms/dashboard/main`, `/cms/dashboard/peta-kejahatan` (`/cms/dashboard/heatmap`) | `GET /api/bdb/kinerja-perkara/summary`, `GET /api/bdb/kinerja-perkara/rekap`, `GET /api/bdb/anev/dashboard` |
| **SHARESE, Obrolan & Keamanan** | `/cms/broadcaster`, `/cms/sharese-koneksi`, `/cms/profile-keamanan`, `/cms/pengumuman` | `GET/POST /api/bdb/jukrah/feed`, `GET /api/bdb/jukrah/mention-users`, `GET/POST /api/bdb/jukrah/chat/*` |
| **Laporan Polisi & Kinerja** | `/cms/laporan-polisi`, `/cms/laporan-polisi/[id]`, `/cms/laporan-polisi/arsip-pelimpahan`, `/cms/report/kinerja-perkara`, `/cms/report/anev-ctcc` | `GET /api/bdb/laporan-polisi`, `GET/POST /api/bdb/wf/lp/:id`, `GET /api/bdb/kinerja-perkara/*`, `/doc-api/*` |
| **Register Pihak & Barang Bukti** | `/cms/laporan/rekap-pihak-terlibat`, `/cms/laporan/pihak-sering-terlibat`, `/cms/laporan/rekap-barang-bukti` | `GET /api/bdb/pihak-terlibat`, `GET /api/bdb/pihak-terlibat/ranking`, `GET /api/bdb/barang-bukti` |
| **Susopsgas, Kasus Menonjol & Kerma** | `/cms/laporan/rekap-operasi-satgas`, `/cms/master/operasi-satgas`, `/cms/laporan/kasus-menonjol`, `/cms/laporan/kasus-menonjol/lihat`, `/cms/kerma`, `/cms/kerma/lihat` | `GET/POST/PUT /api/bdb/operasi-satgas`, `GET/POST/PUT /api/bdb/kasus-menonjol`, `GET/POST/PUT /api/bdb/kerma` |
| **Portal Integrasi Masuk & Keluar** | `/cms/integrasi/masuk-penarikan` (`/cms/integrasi/dors`), `/cms/integrasi/staging` (`/cms/integrasi/dors-data`), `/cms/integrasi/dors-unmapped`, `/cms/integrasi/master-data-gap`, `/cms/integrasi/satker-legacy`, `/cms/integrasi/portal-keluar` | `GET/PUT/POST /api/bdb/dors/*`, `GET /api/bdb/master-data-gap/*`, `GET /api/bdb/satker-legacy/*`, `GET/POST /api/bdb/integration-client/*` |
| **Master Data, Panduan & Sistem** | `/cms/master/user`, `/cms/master/satker-tree`, `/cms/master-ref`, `/cms/master/[slug]`, `/cms/panduan`, `/cms/panduan/kelola`, `/cms/pengaturan/email`, `/cms/audit-log` | `GET/POST/PUT /api/user`, `GET /api/bdb/satker/*`, `GET/POST/PUT /api/master/:slug`, `GET/PUT /api/bdb/system-setting/*` |
