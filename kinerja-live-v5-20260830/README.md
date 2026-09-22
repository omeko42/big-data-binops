# Kinerja Perkara V5 — Filter Scope Terhubung

Status: **live dan terverifikasi** pada 30 Agustus 2026.

Baseline diambil dari container produksi aktif pada 30 Agustus 2026 sebelum perubahan.

## Perilaku

- Super Admin/Admin Binops default Nasional; saat memilih Regional tersedia pencarian Polda.
- Akun Polda/fungsi Polda dapat memilih Polda sendiri atau mencari Polres di bawahnya.
- Akun Polres/fungsi Polres dapat memilih Polres sendiri atau mencari Polsek di bawahnya.
- Akun Polsek/fungsi Polsek dibatasi ke Polsek sendiri.
- Semua level memiliki pilihan Nasional dan Regional.
- Target regional di luar hierarki akun ditolak fail-closed oleh backend.
- Scope wilayah, Kelompok Fungsi, Jenis Kejahatan, Golongan, ICCS, Model LP,
  Penyelesaian, dan Mode Kinerja diterapkan sebagai irisan pada request yang sama.
- Filter Kelompok Fungsi tidak lagi dinonaktifkan untuk akun wilayah.
- Endpoint CSV/XLSX/PDF menerima scope wilayah yang sama dengan tabel dan kartu ringkasan.

## File

- Source backend kandidat: `backend/src/bdb/kinerja-perkara/`
- Runtime backend kandidat: `backend/dist/bdb/kinerja-perkara/`
- Chunk frontend kandidat: `frontend/kinerja-v6-20260830.js`
- Patch frontend reproducible: `patch_frontend_v5.ps1`
- Tes hierarki scope: `verify_scope_logic.js`

## Verifikasi lokal

- `node --check` lulus untuk service, controller, dan frontend.
- Tes Polda → Polres lulus.
- Tes Polres → Polsek lulus.
- Tes Polsek tetap pada wilayah sendiri lulus.
- Tes target di luar hierarki ditolak lulus.
- Tes akun fungsi KRIMSUS + regional hanya memuat fungsi KRIMSUS lulus.

## Aktivasi produksi

- Backend backup: `/home/clouduser/codex-backups/bdb-api/kinerja-v5-20260830-163150`
- Frontend backup: `/home/clouduser/codex-backups/bdb-web/kinerja-v5-20260830-163236`
- Backend source controller: `a180aacada81217abc7b67648c4e827e7bc94f5a068e5ca5e96a2efdec6a2d6c`
- Backend source service: `280d122cc4ed67a0c98f2ec754291404d466358cc0730bcd43b85ded9af4b2df`
- Backend runtime controller: `4d4504c0cadc279def892a04d3c6cba51894ce9107b181d408dc1fcd73416546`
- Backend runtime service: `ad87d4b03f0bdc8642f665a4c337a8bd4d1b4494e98a95aabf5d0fe3434a6767`
- Frontend chunk: `de5f7d6ed7f12bb16ea85b628570f2ee52a732a97eeed992c82f92b457690b3d`
- Kedua container running dengan restart count 0 setelah cutover.
- Route `/api/bdb/kinerja-perkara/meta/scope-options` terdaftar dan merespons.
- Halaman serta chunk Next.js live merespons HTTP 200.
- Smoke test live lulus untuk Super Admin Regional Polda Aceh + KRIMSUS,
  Polda Papua Barat Daya → Polres Raja Ampat, Nasional akun Polda,
  dan penolakan target lintas wilayah.
