# Patch Profil Seamless Header (2026-09-27)

## Latar Belakang & Masalah
Pada halaman `/cms/profile`, informasi profil pengguna (foto profil, nama, email dinas/sekunder, dan badge peranan) sebelumnya dibungkus di dalam kartu `.cms-card` besar dengan banner hardcoded `#1e2a44` dan footer `#111a2e`. Hal ini menyebabkan:
1. Warna kartu dan banner bertabrakan dengan latar belakang halaman mode gelap (`#090e1a` / `#0b1120`).
2. Sekitar 85% area kartu di sisi kanan kosong, menimbulkan kesan kotak kosong yang canggung dan tidak estetik.
3. Posisi badge peranan dipaksa overlap dengan `marginTop: -1.6rem`, menghasilkan border dan styling yang kaku.

## Solusi yang Diterapkan
1. **Peniadaan Card Wrapper (Seamless Integration)**:
   - Menghapus kelas `.cms-card` dan latar belakang hardcoded `#1e2a44`.
   - Mengubah container header menjadi transparan dan menyatu sempurna dengan background halaman (`background: transparent`, `border: none`, `boxShadow: none`).
   - Memberikan pembatas garis bawah yang sangat halus (`borderBottom: 1px solid var(--cas-border, rgba(255,255,255,0.08))`) untuk memisahkan hero profil secara anggun dari kartu `DATA PERSONIL` dan `KEAMANAN AKUN`.
2. **Harmonisasi Warna Typography & Badge**:
   - Nama menggunakan `var(--cas-text-primary)` (terbaca jernih di dark mode maupun light mode).
   - Email menggunakan `var(--cas-text-secondary)` dengan pill badge transparan (`rgba(...)`).
   - Badge role (`Superadmin`, `AKTIF`, `Satker`) ditata rapi tepat di bawah baris email dengan chip berlatar semi-transparan `rgba(..., 0.12)` yang menyatu dengan latar belakang tanpa balok putih/hitam pekat.
3. **Deployment Live**:
   - File chunk client: `/usr/src/app/.next/static/chunks/3def3ti6rk0vr.js`
   - File chunk SSR: `/usr/src/app/.next/server/chunks/ssr/app_cms_profile_page_tsx_0_ymkmx._.js`
   - Container `bdb-web` direstart dan verifikasi HTTP 200 OK.
