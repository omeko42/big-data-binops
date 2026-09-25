# Patch Dashboard Sorotan & Kinerja Perkara (25 September 2026)

## Ringkasan Perubahan:
1. **Card Kinerja Perkara**:
   - Menghilangkan aksi / teks `"Lihat laporan lengkap →"` pada header kartu Kinerja Perkara.
   - Header kartu menjadi lebih bersih, rapi, dan proporsional.

2. **Bagian Sorotan (3 Card Utama)**:
   - **Hilangkan `"Lihat Semua →"`**:
     - Tombol `"Lihat Semua →"` pada seluruh kartu Sorotan (Kasus Atensi / Menonjol, Operasi & Satgas, Pihak Paling Sering Terlibat) dihilangkan.
   - **Judul Card Interaktif & Navigasi**:
     - **Card Kasus Atensi / Menonjol**:
       - Judul dipisahkan menjadi dua tautan interaktif:
         - Klik `Kasus Atensi` -> `/cms/laporan/kasus-atensi/lihat`
         - Klik `Menonjol` -> `/cms/laporan/kasus-menonjol/lihat`
       - Efek hover aksen amber (#f59e0b) dengan underline.
     - **Card Operasi & Satgas**:
       - Judul `Operasi & Satgas` dapat diklik -> `/cms/master/operasi-satgas`.
       - Efek hover aksen biru (#3b82f6) dengan underline.
     - **Card Pihak Paling Sering Terlibat**:
       - Judul `Pihak Paling Sering Terlibat` dapat diklik -> `/cms/laporan/rekap-pihak-terlibat`.
       - Efek hover aksen merah/rose (#ef4444) dengan underline.

3. **Tema Warna yang Harmonis & Senada (Theme & Palette Polish)**:
   - **Sistem Badge Translucent (`renderCasBadge`)**:
     - Menggantikan tag solid bawaan PrimeReact yang sebelumnya kontras tajam (merah/hijau pekat neon) dengan soft translucent pill badges.
     - Warna badges ramah dark mode:
       - *Nasional / Tinggi / Tersangka*: Soft Red tint (`rgba(239, 68, 68, 0.14)`, text `#f87171`).
       - *DPO*: Vivid Red border & text (`rgba(220, 38, 38, 0.22)`, border `#ef4444`, text `#fca5a5`).
       - *Regional / Sedang / Terlapor*: Soft Amber tint (`rgba(245, 158, 11, 0.14)`, text `#fbbf24`).
       - *Operasi / Aktif*: Soft Tech Blue tint (`rgba(59, 130, 246, 0.14)`, text `#60a5fa`).
       - *Satgas*: Soft Indigo tint (`rgba(99, 102, 241, 0.14)`, text `#818cf8`).
       - *Sudah Rilis / Selesai*: Soft Emerald tint (`rgba(16, 185, 129, 0.14)`, text `#34d399`).
       - *Belum Rilis / Nonaktif*: Soft Slate tint (`rgba(148, 163, 184, 0.12)`, text `#94a3b8`).
   - **Icon Header Beraksen Senada**:
     - Ikon header tiap kartu memiliki background badge melingkar lembut dengan warna aksen masing-masing (Amber, Blue, Red).
   - **Item Card Dark Mode Elegance**:
     - Background item menggunakan `rgba(255, 255, 255, 0.02)` dengan efek hover halus `rgba(255, 255, 255, 0.05)`, border `var(--cas-border-card, #233554)`, dan teks judul `#f1f5f9`.

4. **Kesenadaan Ukuran & Zero Truncation (Card Sizing)**:
   - **Eliminasi Pemotongan Judul Header**:
     - Dropdown filter diatur menjadi compact micro-selector (`height: 1.65rem`, `width: 5.4rem`, `padding: 0 0.35rem`, font `0.72rem`).
     - Judul **"Pihak Paling Sering Terlibat"** dan label opsi **"Semua"** kini tampil utuh tanpa terpotong (*zero truncation*).
   - **Presisi Tinggi Baris Horizontal**:
     - Tinggi setiap kotak item (`dash-kasus-item`) ditetapkan seragam `4.35rem` dengan gap `0.5rem`.
     - Ketinggian total 3 kartu disesuaikan `29.5rem` secara simetris.
     - Baris ke-1 hingga ke-5 pada ketiga kartu sejajar secara horizontal (*aligned row baselines*).

5. **Deployment & Cache Busting**:
   - Diperbarui pada chunk `dashboard-perma-318125d33290.js` dan `dashboard-perma-318125d33290_v2.js` pada container `bdb-web`.

