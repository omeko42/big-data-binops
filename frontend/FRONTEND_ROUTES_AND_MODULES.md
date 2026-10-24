# CAS Frontend Routes, Chunks, and Feature Modules Inventory

Dokumen ini memetakan **73 route Next.js App Router** (`bdb-web` / `cas-web-master`, Next.js `16.2.10` + React `19.2.4` + PrimeReact `10.9.8`), bundle modul yang diekstrak ke `frontend/src/modules/`, microservice dokumen `cas-doc-service` (`3860`), serta endpoint API Backend (`bdb-api` `3850`) yang dipanggil oleh masing-masing halaman.

---

## 1. Struktur Direktori `frontend/`

| Path | Deskripsi |
| :--- | :--- |
| `frontend/package.json` | Manifest dependensi Next.js 16.2.10, React 19.2.4, PrimeReact 10.9.8, Chart.js 4.5.1, Lucide React, Axios |
| `frontend/server.js` | Custom standalone HTTP server Next.js (port `3000`, override header `Cache-Control: public, max-age=0, must-revalidate` untuk mencegah stale chunk) |
| `frontend/public/tools/Bersihkan-Cache-CAS.bat` | Utilitas pembersih cache browser & DNS klien operasional |
| `frontend/src/app-routes-manifest.json` | Manifest resmi 73 route App Router (`.next/app-path-routes-manifest.json`) |
| `frontend/services/cas-doc-service/cas_doc_service.py` | Microservice Python v3.0 (port `3860`) untuk manajemen dokumen ANEV Jukminu Polri & integrasi ONLYOFFICE Document Server (`8088`) |
| `frontend/services/cas-doc-service/cas-docs.service` | Unit systemd untuk menjalankan `cas_doc_service.py` secara otomatis |
| `frontend/src/styles/theme.modern.css` | Stylesheet tema modern CAS Polri (Dark/Light mode & komponen PrimeReact) |

---

## 2. Daftar Bundle Modul Fitur (`frontend/src/modules/`)

| Sub-Folder & Nama Bundle | Chunk Asal (`.next/static/chunks/`) | Fitur & Tanggung Jawab Utama |
| :--- | :--- | :--- |
| `auth/layout-guard.bundle.js` | `0-gigr76s0g8t.js` | Sidebar navigasi dinamis, RBAC route guard, multi-tab logout sync, notifikasi SHARESE, dan breadcrumb |
| `auth/profile-security.bundle.js` | `3def3ti6rk0vs.js` / `profile-password-v2-eedb4a42b164.js` | Manajemen profil personel, WebAuthn Passkey, TOTP Authenticator, PIN, Email OTP, dan ganti kata sandi |
| `auth/session-manager.bundle.js` | `0kqp3_mvrigjm_v2.js` | Interceptor Axios (`apiAuth`), manajemen sesi JWT, device token, dan penanganan error 401/403 |
| `anev/anev-ctcc-onlyoffice.bundle.js` | `1s8uqnrz-0f75.js` | Modul Laporan ANEV CT/CC terintegrasi ONLYOFFICE Document Editor & 16 Tabel Lampiran rekapitulasi |
| `anev/anev-lp.bundle.js` | `3d12hm434qu8s.js` | Modul Analisis dan Evaluasi Laporan Polisi hierarkis per Satker |
| `barang-bukti/rekap-barang-bukti.bundle.js` | `2ujgx3l9cne0r.js` | Rekapitulasi dan pencarian Barang Bukti perkara |
| `broadcaster/sharese-broadcaster.bundle.js` | `3pp0f_cp6yg-p.js` | Lini masa direktif **SHARESE** (Share Reserse / Broadcaster Jukrah, polling, komentar, reaksi, SSE stream) |
| `broadcaster/pengumuman-moderator.bundle.js` | `35hkjujo3bzzb.js` | Panel moderasi pengumuman, laporan konten, dan *Panic Takedown* |
| `dashboard/dashboard-main.bundle.js` | `dashboard-perma-318125d33290_v3.js` | Dashboard Eksekutif Utama (CT/CC/CR, Crime Clock, ranking pihak terlibat, operasi satgas, kasus menonjol/atensi) |
| `dors/dors-integration.bundle.js` | `2euu9hqyjbvnk.js` | Konfigurasi sinkronisasi DORS, metrik, pembatalan sync, dan rekonsiliasi *History Delete* |
| `kasus-menonjol-atensi/kasus-menonjol.bundle.js` | `0kjv9dce1v-lq.js` | Manajemen dan pemantauan Kasus Menonjol |
| `kasus-menonjol-atensi/kasus-atensi.bundle.js` | `3ag78ek877aol.js` | Manajemen dan pemantauan Kasus Atensi Pimpinan / Publik |
| `kinerja-perkara/kinerja-perkara.bundle.js` | `kinerja-perma-external-a42edc88f706.js` | Tabel hierarki Kinerja Perkara (CT, CC Aktual/Tunggakan, CP, PERMA, ekspor PDF/XLSX, filter terpadu) |
| `laporan-polisi/laporan-polisi.bundle.js` | `laporan-filter-perma-a15e28ec2e82.js` | Daftar utama Laporan Polisi, filter multi-dimensi, bulk import, dan pemetaan Satker |
| `laporan-polisi/laporan-polisi-detail-flow.bundle.js` | `lp-flow-perma-56d42847ec39.js` | Detail Laporan Polisi, alur dokumen penyidikan (Workflow), pelimpahan internal/eksternal, dan unggah dokumen 1 MB |
| `master-user/master-user.bundle.js` | `user-page-pagination-v9-dfbc949c.js` | Manajemen Master User, filter keaktifan personel, bulk import user, dan bulk reset password |
| `operasi-satgas/operasi-satgas-master.bundle.js` | `operasi-satgas-acl-a7aec9d53fb4.js` | Manajemen Master Operasi Kepolisian / Satgas & penautan LP |
| `operasi-satgas/rekap-operasi-satgas.bundle.js` | `2c44xu9jx7w_v.js` | Rekapitulasi Laporan Polisi berdasarkan Operasi Satgas |
| `pihak-terlibat/rekap-pihak-terlibat.bundle.js` | `register-pihak-v5-6478da3b8c2c.js` | Register Pihak Terlibat (Pelapor, Terlapor, Tersangka, Korban, Saksi, DPO) dan pencarian lintas LP berdasar NIK |
| `satker/satker-tree.bundle.js` | `0jwnqdsk5av20.js` | Pohon hierarki Satker Polri (Mabes, Polda, Polres, Polsek) & backfill admin |
| `satker/satker-legacy-reconcile.bundle.js` | `satker-legacy-reconcile-neutral-c1f928a4.js` | Rekonsiliasi dan pemetaan Satker Legacy (data historis DORS) ke pohon Satker aktif |

---

## 3. Peta Lengkap 73 Route App Router (`app-routes-manifest.json`)

| No | Route Key (`app-path-routes-manifest.json`) | URL Path | Chunk JS Spesifik Halaman | Endpoint API Backend / Layanan Dokumen yang Dipanggil |
| :-: | :--- | :--- | :--- | :--- |
| 1 | `/_global-error/page` | `/_global-error` | `05-c3ty_6dwfk.js` | *(Boundary Error Global)* |
| 2 | `/_not-found/page` | `/_not-found` | *(Server Render)* | *(Halaman 404)* |
| 3 | `/access/page` | `/access` | `3li0xsoagdjsa.js` | Redirect ke `/cms/dashboard/main` |
| 4 | `/cms/[...slug]/page` | `/cms/[...slug]` | `1-y0lpw5my758.js` | Catch-all fallback `/cms/*` -> `/cms/dashboard/main` |
| 5 | `/cms/audit-log/page` | `/cms/audit-log` | `05xp3k59ooeaa.js` | `GET /api/bdb/audit-log`, `GET /api/bdb/audit-log/filters` |
| 6 | `/cms/audit-log/uji-beban/page` | `/cms/audit-log/uji-beban` | `0vd2_l2166hx-.js` | `POST /api/bdb/load-test/run`, `GET /api/bdb/load-test/koneksi` |
| 7 | `/cms/broadcaster/page` | `/cms/broadcaster` | `3pp0f_cp6yg-p.js` | `GET /api/bdb/jukrah/feed`, `POST /api/bdb/jukrah/post`, `GET /api/bdb/jukrah/satkers`, `GET /api/bdb/jukrah/stream/` (SSE) |
| 8 | `/cms/dashboard/heatmap/page` | `/cms/dashboard/heatmap` | `0ckr06q1dpcc7.js` | Visualisasi peta kerawanan kejahatan |
| 9 | `/cms/dashboard/main/page` | `/cms/dashboard/main` | `07-bb45yl7w11.js`, `dashboard-perma-318125d33290_v3.js` | `GET /api/bdb/kinerja-perkara/summary`, `GET /api/bdb/kinerja-perkara/rekap`, `GET /api/bdb/anev/dashboard`, `GET /api/bdb/pihak-terlibat/ranking`, `GET /api/bdb/kasus-menonjol`, `GET /api/bdb/kasus-atensi`, `GET /api/bdb/operasi-satgas`, `GET /api/bdb/jukrah/feed`, `POST /api/bdb/system/orchestrator/trigger-recalculate` |
| 10 | `/cms/integrasi/dors-data/page` | `/cms/integrasi/dors-data` | `0n5r-6beatsas.js` | `GET /api/bdb/dors/data`, `GET /api/bdb/dors/data/stats` |
| 11 | `/cms/integrasi/dors-unmapped/page` | `/cms/integrasi/dors-unmapped` | `10hzc38qdsv5f.js` | `GET /api/bdb/laporan-polisi/unmapped`, `POST /api/bdb/laporan-polisi/map-by-name`, `POST /api/bdb/laporan-polisi/map-one`, `DELETE /api/bdb/laporan-polisi/unmapped/delete-all`, `GET /api/bdb/satker/*` |
| 12 | `/cms/integrasi/dors/page` | `/cms/integrasi/dors` | `2euu9hqyjbvnk.js` | `GET /api/bdb/dors/status`, `GET/PUT /api/bdb/dors/config`, `POST /api/bdb/dors/config/reveal`, `POST /api/bdb/dors/sync`, `POST /api/bdb/dors/sync/cancel`, `GET /api/bdb/dors/sync/logs`, `GET /api/bdb/dors/metrics`, `GET /api/bdb/dors/history-delete`, `POST /api/bdb/dors/history-delete/sync`, `POST /api/bdb/dors/history-delete/apply` |
| 13 | `/cms/integrasi/master-data-gap/page` | `/cms/integrasi/master-data-gap` | `2sdpxnq9xkyq7.js` | `GET /api/bdb/master-data-gap/stats`, `GET /api/bdb/master-data-gap/list` |
| 14 | `/cms/integrasi/portal-keluar/page` | `/cms/integrasi/portal-keluar` | `290_n8qu6ly7y.js` | `GET/POST /api/bdb/integration-client`, `GET /api/bdb/integration-client/scopes`, `GET /api/bdb/integration-client/access-log`, `GET /api/external/v1/laporan-polisi` |
| 15 | `/cms/integrasi/satker-legacy/page` | `/cms/integrasi/satker-legacy` | `satker-legacy-reconcile-neutral-c1f928a4.js` | `GET /api/bdb/satker-legacy/stats`, `GET /api/bdb/satker-legacy/list`, `POST /api/bdb/satker-legacy/reconcile-existing`, `POST /api/bdb/satker-legacy/add-to-tree`, `POST /api/bdb/satker-legacy/force-map`, `POST /api/bdb/laporan-polisi/map` |
| 16 | `/cms/kerma/lihat/page` | `/cms/kerma/lihat` | `0kfj2_t8uz9-5.js` | `GET /api/bdb/kerma/public` |
| 17 | `/cms/kerma/page` | `/cms/kerma` | `2xmmqbmls4pw8.js` | `GET/POST/PUT/DELETE /api/bdb/kerma`, `GET /api/bdb/kerma/jenis-naskah` |
| 18 | `/cms/laporan-polisi/[id]/page` | `/cms/laporan-polisi/[id]` | `lp-flow-perma-56d42847ec39.js`, `upload-doc-form-1mb-help-6acc5bceec6e.js`, `0wh0oi8yblbdb.js`, `1jawzg71wu77h.js`, `1xkj0e2ztq9mo.js` | `GET /api/bdb/laporan-polisi/:id`, `GET/POST /api/bdb/wf/lp/:id`, `GET /api/bdb/wf/pasal`, `GET /api/bdb/operasi-satgas`, `POST /api/bdb/lp-pelimpahan`, `POST /api/bdb/lp-pelimpahan/eksternal` |
| 19 | `/cms/laporan-polisi/arsip-pelimpahan/page` | `/cms/laporan-polisi/arsip-pelimpahan` | `029606szmgj31.js` | `GET /api/bdb/lp-pelimpahan/arsip` |
| 20 | `/cms/laporan-polisi/page` | `/cms/laporan-polisi` | `laporan-filter-perma-a15e28ec2e82.js` | `GET /api/bdb/laporan-polisi`, `GET /api/bdb/laporan-polisi/stats`, `GET /api/bdb/laporan-polisi/monitoring-options`, `POST /api/bdb/laporan-polisi/acknowledge-satker-access`, `GET /api/bdb/wf/status`, `GET /api/bdb/wf/document-types`, `POST /api/bdb/laporan-polisi/bulk-import/*` |
| 21 | `/cms/laporan/distribusi-lp/page` | `/cms/laporan/distribusi-lp` | *(Server Redirect)* | Redirect ke `/cms/laporan/rekap-laporan-polisi` |
| 22 | `/cms/laporan/kasus-atensi/lihat/page` | `/cms/laporan/kasus-atensi/lihat` | `0w87y1d16g9p5.js`, `11x2kzzorqvmu.js`, `12j9p488kvwu8.js` | `GET /api/bdb/kasus-atensi` |
| 23 | `/cms/laporan/kasus-atensi/page` | `/cms/laporan/kasus-atensi` | `3ag78ek877aol.js` | `GET/POST/PUT/DELETE /api/bdb/kasus-atensi`, `GET /api/bdb/laporan-polisi` |
| 24 | `/cms/laporan/kasus-menonjol/lihat/page` | `/cms/laporan/kasus-menonjol/lihat` | `2topwy88bzyr3.js`, `11x2kzzorqvmu.js`, `12j9p488kvwu8.js` | `GET /api/bdb/kasus-menonjol` |
| 25 | `/cms/laporan/kasus-menonjol/page` | `/cms/laporan/kasus-menonjol` | `0kjv9dce1v-lq.js` | `GET/POST/PUT/DELETE /api/bdb/kasus-menonjol`, `GET /api/bdb/laporan-polisi` |
| 26 | `/cms/laporan/laporan-kejahatan/page` | `/cms/laporan/laporan-kejahatan` | `1ifb67wn8ubwp.js`, `1ukbs6nbj1t7-.js`, `1jawzg71wu77h.js`, `0g9b_sl89kju6.js` | `GET /api/bareskrim/report`, `GET /api/bareskrim/report-korban`, `GET /api/bareskrim/report-saksi`, `GET /api/bareskrim/report-pasal`, `GET /api/bareskrim/report-pelapor`, `GET /api/bareskrim/report-terlapor` |
| 27 | `/cms/laporan/penanganan-lp/page` | `/cms/laporan/penanganan-lp` | *(Server Redirect)* | Redirect ke `/cms/laporan/rekap-laporan-polisi` |
| 28 | `/cms/laporan/rekap-barang-bukti/page` | `/cms/laporan/rekap-barang-bukti` | `2ujgx3l9cne0r.js` | `GET /api/bdb/barang-bukti` |
| 29 | `/cms/laporan/rekap-kerma/page` | `/cms/laporan/rekap-kerma` | `3-e4www6vx-1a.js` | `GET /api/bdb/kerma/rekap` |
| 30 | `/cms/laporan/rekap-laporan-polisi/page` | `/cms/laporan/rekap-laporan-polisi` | `1lh3k7a6ch_na.js`, `2d-p425qmvbf6.js` | `GET /api/bdb/rekap-lp/worklist`, `GET /api/bdb/rekap-lp/history`, `GET /api/bdb/rekap-lp/detail`, `GET /api/bdb/rekap-lp/distribution-targets`, `POST /api/bdb/rekap-lp/distribute`, `POST /api/bdb/rekap-lp/report-status` |
| 31 | `/cms/laporan/rekap-operasi-satgas/page` | `/cms/laporan/rekap-operasi-satgas` | `2c44xu9jx7w_v.js` | `GET /api/bdb/operasi-satgas/rekap-lp` |
| 32 | `/cms/laporan/rekap-pihak-terlibat/page` | `/cms/laporan/rekap-pihak-terlibat` | `register-pihak-v5-6478da3b8c2c.js` | `GET /api/bdb/pihak-terlibat`, `GET /api/bdb/pihak-terlibat/ranking`, `GET /api/bdb/pihak-terlibat/laporan-by-nik/:nik`, `POST /api/bdb/pihak-terlibat/dpo/*`, `GET /api/bdb/kinerja-perkara/meta/*` |
| 33 | `/cms/master-ref/page` | `/cms/master-ref` | `0_lihyrdd9dfk.js` | Portal navigasi Master Referensi (`/cms/master/[slug]`) |
| 34 | `/cms/master/[slug]/page` | `/cms/master/[slug]` | `3-ar4cnx5wek1.js` | CRUD generik tabel referensi (`/api/master/:slug`) |
| 35 | `/cms/master/alur-dokumen/page` | `/cms/master/alur-dokumen` | `13l-perma-court-1c433719b3e0.js`, `1ukbs6nbj1t7-.js`, `1jawzg71wu77h.js`, `1xkj0e2ztq9mo.js` | `GET/POST/PUT /api/bdb/wf/document-types`, `GET/POST/PUT /api/bdb/wf/status`, `GET /api/bdb/wf/reconcile-status/info`, `POST /api/bdb/wf/reconcile-status`, `GET /api/bdb/wf/pasal` |
| 36 | `/cms/master/jenis-barang-bukti/page` | `/cms/master/jenis-barang-bukti` | `1ahdfak8tpnp2.js` | `GET/POST/PUT/DELETE /api/bdb/master/jenis-barang-bukti` |
| 37 | `/cms/master/jenis-kejahatan/page` | `/cms/master/jenis-kejahatan` | `0t69o5etdw2tk.js` | `GET/POST/PUT/DELETE /api/master/jenis-kejahatan`, `GET /api/master/golongan-kejahatan`, `GET /api/master/iccs-kategori`, `POST /api/master/jenis-kejahatan/bulk-import/*` |
| 38 | `/cms/master/kerma/page` | `/cms/master/kerma` | `1exwgkq84-5wj.js` | `GET/POST/PUT/DELETE /api/bdb/kerma` |
| 39 | `/cms/master/laporan-polisi/page` | `/cms/master/laporan-polisi` | `04vfi24zl2wla.js` | `GET/POST/PUT/DELETE /api/bdb/master/laporan-polisi` |
| 40 | `/cms/master/menu/page` | `/cms/master/menu` | `3t62a0k0tjm_u.js`, `2a226ltnpj3p_.js`, `0mbz-mtpa93rx.js`, `11x2kzzorqvmu.js` | `GET/PUT /api/bdb/menu-access` |
| 41 | `/cms/master/operasi-satgas/page` | `/cms/master/operasi-satgas` | `operasi-satgas-acl-a7aec9d53fb4.js`, `1lh3k7a6ch_na.js` | `GET/POST/PUT/DELETE /api/bdb/operasi-satgas`, `GET /api/bdb/operasi-satgas/jenis-master`, `GET /api/bdb/laporan-polisi` |
| 42 | `/cms/master/organisasi-level/page` | `/cms/master/organisasi-level` | `2fu3d-3vdykb7.js` | `GET/POST/PUT/DELETE /api/master/organisasi-level` |
| 43 | `/cms/master/organisasi-role/page` | `/cms/master/organisasi-role` | `20xwmv9mlei35.js` | `GET/POST/PUT/DELETE /api/master/organisasi/role` |
| 44 | `/cms/master/organisasi-team/page` | `/cms/master/organisasi-team` | `319lqn-yxz2e0.js` | `GET/POST/PUT/DELETE /api/master/organisasi-team` |
| 45 | `/cms/master/organisasi/page` | `/cms/master/organisasi` | `2-_70z7ecxeol.js` | `GET/POST/PUT/DELETE /api/bdb/master/satker` |
| 46 | `/cms/master/pasal/page` | `/cms/master/pasal` | `2jiibxq9qc42t.js`, `0g9b_sl89kju6.js` | `GET/POST/PUT/DELETE /api/bdb/wf/pasal` |
| 47 | `/cms/master/satker-eksternal/page` | `/cms/master/satker-eksternal` | `satker-eksternal-paged-20260913.js` | `GET/POST/PUT/DELETE /api/bdb/satker-eksternal`, `POST /api/bdb/satker-eksternal/bulk-import/*` |
| 48 | `/cms/master/satker-tree/page` | `/cms/master/satker-tree` | `0jwnqdsk5av20.js`, `1jawzg71wu77h.js`, `3tblyojz-l213.js`, `0cuwkpi0-kidt.js` | `GET /api/bdb/satker/roots`, `GET /api/bdb/satker/children`, `GET /api/bdb/satker/stats`, `GET /api/bdb/satker/search`, `GET /api/bdb/satker/path`, `POST /api/bdb/satker/admins/backfill` |
| 49 | `/cms/master/sub-golongan-kamtibmas/page` | `/cms/master/sub-golongan-kamtibmas` | `14ifuxx1tahpq.js` | `GET/POST/PUT/DELETE /api/master/sub-golongan-kamtibmas`, `GET /api/master/golongan-kamtibmas` |
| 50 | `/cms/master/user/page` | `/cms/master/user` | `user-page-pagination-v9-dfbc949c.js`, `00l7wgk9jmf2_-user-satker-fix-20260812.js` | `GET/POST/PUT/DELETE /api/user`, `GET /api/user/check-availability`, `POST /api/user/bulk-import/*`, `POST /api/user/bulk-reset-password/*`, `GET /api/bdb/satker/*` |
| 51 | `/cms/panduan/kelola/page` | `/cms/panduan/kelola` | `3msp_3ifddmyc.js` | `GET/POST/PUT/DELETE /api/bdb/panduan` |
| 52 | `/cms/panduan/page` | `/cms/panduan` | `3yywym7exn42g.js`, `2ummu459_qhc2.js` | `GET /api/bdb/panduan` |
| 53 | `/cms/pencarian/page` | `/cms/pencarian` | `1rpmnf5wl2_10.js` | `GET /api/bdb/laporan-polisi/search-global` |
| 54 | `/cms/pengaturan/email/page` | `/cms/pengaturan/email` | `0hamt5dfwnhm7.js`, `184pebicmt2c5.js` | `GET/PUT /api/bdb/system-setting/smtp`, `POST /api/bdb/system-setting/smtp/test` |
| 55 | `/cms/pengaturan/login-otp/page` | `/cms/pengaturan/login-otp` | `0kb7hamp7ld1d.js`, `2a226ltnpj3p_.js`, `102_vvzmgu_f3.js`, `11x2kzzorqvmu.js` | `GET/PUT /api/bdb/system-setting/login-otp` |
| 56 | `/cms/pengaturan/maintenance/page` | `/cms/pengaturan/maintenance` | `16-sz81wqp4tr.js`, `1uuhf3djz7dby.js`, `27xa121lmflhv.js` | `GET/PUT /api/bdb/system-setting/maintenance` |
| 57 | `/cms/pengaturan/pusat-bantuan/page` | `/cms/pengaturan/pusat-bantuan` | `3_aq052z3q5ln.js`, `0wh0oi8yblbdb.js`, `0ki121je0opuo.js` | `GET/PUT /api/bdb/system-setting/pusat-bantuan` |
| 58 | `/cms/pengaturan/satker/page` | `/cms/pengaturan/satker` | `25xovob_oafqc.js`, `1lh3k7a6ch_na.js` | `GET/PUT /api/bdb/master/satker-profile`, `GET /api/bdb/master/satker` |
| 59 | `/cms/pengumuman/page` | `/cms/pengumuman` | `35hkjujo3bzzb.js`, `12j9p488kvwu8.js` | `GET /api/bdb/jukrah/feed`, `POST /api/bdb/jukrah/post`, `GET /api/bdb/jukrah/report/*`, `POST /api/bdb/jukrah/post/:id/panic-takedown` |
| 60 | `/cms/profile/page` | `/cms/profile` | `3def3ti6rk0vs.js`, `0hamt5dfwnhm7.js` | `GET /api/Authentication/user`, `PUT /api/user/me/profile`, `GET /api/bdb/satker/me/profile`, `POST /api/Authentication/profile/security/{totp,otp,email-otp,pin}`, `GET/POST/DELETE /api/Authentication/passkey/*` |
| 61 | `/cms/profile/reset-password/page` | `/cms/profile/reset-password` | `profile-password-v2-eedb4a42b164.js`, `1gt80cxrerqpb.js` | `POST /api/Authentication/reset-password` |
| 62 | `/cms/profile/reset-totp/page` | `/cms/profile/reset-totp` | `22__odlq6jg-0.js` | `POST /api/Authentication/profile/security/totp/setup`, `POST /api/Authentication/profile/security/totp` |
| 63 | `/cms/report/anev-ctcc/page` | `/cms/report/anev-ctcc` | `1s8uqnrz-0f75.js`, `1xkj0e2ztq9mo.js`, `0lhdontvez07e.js`, `2n62mbxqcet8i.js` | `GET /doc-api/list`, `GET /doc-api/get`, `GET /doc-api/satkers`, `POST /doc-api/create`, `POST /doc-api/sync-cas`, `POST /doc-api/update-meta`, `GET /doc-api/forcesave`, `GET /doc-api/stamp`, `GET /doc-api/export-pdf`, `GET /doc-api/download`, `POST /doc-api/delete`, `GET /api/bdb/anev/meta`, `GET /api/bdb/anev/rekap` |
| 64 | `/cms/report/anev-lp/page` | `/cms/report/anev-lp` | `3d12hm434qu8s.js`, `01erg7k-cgnlo.js` | `GET /api/bdb/rekap-lp/nodes` |
| 65 | `/cms/report/cetak/page` | `/cms/report/cetak` | `1umvuh94kqtl6.js` | `GET /api/analytic-laporan/jenis-kejahatan` |
| 66 | `/cms/report/generate/page` | `/cms/report/generate` | `2_sn5nxat39te.js` | `POST /api/upload` |
| 67 | `/cms/report/kinerja-perkara/page` | `/cms/report/kinerja-perkara` | `kinerja-perma-external-a42edc88f706.js`, `1xkj0e2ztq9mo.js`, `0lhdontvez07e.js` | `GET /api/bdb/kinerja-perkara/rekap`, `GET /api/bdb/kinerja-perkara/summary`, `POST /api/bdb/kinerja-perkara/refresh`, `GET /api/bdb/kinerja-perkara/meta/scope-options`, `GET /api/bdb/kinerja-perkara/meta/jenis-kejahatan`, `GET /api/master/golongan-kejahatan`, `GET /api/master/iccs-kategori` |
| 68 | `/dashboard/page` | `/dashboard` | *(Server Redirect)* | Redirect ke `/cms/dashboard/main` |
| 69 | `/error-page/page` | `/error-page` | `085_vq8r_4b3p.js` | Halaman penampil kode kesalahan HTTP |
| 70 | `/favicon.ico/route` | `/favicon.ico` | *(Static Asset Route)* | Menyajikan ikon aplikasi |
| 71 | `/forgot-password/page` | `/forgot-password` | `1upo18rh7_k78.js` | `GET /api/Authentication/captcha`, `GET /api/Authentication/pusat-bantuan`, `POST /api/Authentication/forgot-password/request`, `POST /api/Authentication/forgot-password/confirm` |
| 72 | `/form-management/page` | `/form-management` | `32q3_kuo7palk.js` | Redirect / utilitas manajemen formulir ke `/cms/dashboard/main` |
| 73 | `/guest/invitation/[code]/[organisasi]/page` | `/guest/invitation/[code]/[organisasi]` | `16qwnbieb9mgl.js`, `1gt80cxrerqpb.js` | `POST /api/Authentication/received-invitation` |
| 74 | `/login-otp/page` | `/login-otp` | `2f3dompr1ixs6.js` | `GET /api/Authentication/user`, `POST /api/Authentication/verify-login-otp`, `POST /api/Authentication/resend-login-otp`, `POST /api/Authentication/logout` |
| 75 | `/login/page` | `/login` | `3jkbfmy5u6eqq.js` | `GET /api/Authentication/captcha`, `POST /api/Authentication/login`, `POST /api/Authentication/passkey/login-options`, `POST /api/Authentication/passkey/login-verify`, `GET /api/Authentication/pusat-bantuan` |
| 76 | `/maintenance/page` | `/maintenance` | `0676j4vvvs3e7.js` | `GET /api/Authentication/maintenance-status`, `GET /api/Authentication/user` |
| 77 | `/otp/page` | `/otp` | `2sz_lihyh64nz.js` | Redirect ke alur `/login-otp` / `/login` |
| 78 | `/page` | `/` | *(Root Entry)* | Redirect ke `/login` atau `/cms/dashboard/main` |
| 79 | `/pin/page` | `/pin` | `3i7ew21veo-ic.js`, `1gt80cxrerqpb.js` | `POST /api/Authentication/verify-pin`, `GET /api/Authentication/user` |
| 80 | `/register-success/page` | `/register-success` | `3wbbs8yaf_ung.js` | Halaman konfirmasi pasca-registrasi |
| 81 | `/register/page` | `/register` | `203wa2v_j7w1h.js` | Redirect ke `/login` (registrasi mandiri dinonaktifkan, menggunakan sistem undangan/Master User) |
| 82 | `/totp/page` | `/totp` | `0e6hr18kin4n-.js` | `GET /api/Authentication/totp-registration/*`, `POST /api/Authentication/verify-totp`, `GET /api/Authentication/user` |

> **Catatan**: Dari 82 entri di `app-path-routes-manifest.json`, terdapat **73 route fungsional halaman CMS & autentikasi** serta 9 route sistem/redirect/asset (`/_global-error`, `/_not-found`, `/favicon.ico`, `/`, `/access`, `/dashboard`, `/otp`, `/register`, `/cms/[...slug]`).
