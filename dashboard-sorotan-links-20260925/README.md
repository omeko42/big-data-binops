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
       - Judul kini dipisahkan secara elegan menjadi dua tautan interaktif:
         - Klik `Kasus Atensi` -> diarahkan ke `/cms/laporan/kasus-atensi/lihat`
         - Klik `Menonjol` -> diarahkan ke `/cms/laporan/kasus-menonjol/lihat`
       - Efek hover aksen amber (#d97706) dengan underline.
     - **Card Operasi & Satgas**:
       - Judul `Operasi & Satgas` dapat diklik -> diarahkan langsung ke `/cms/master/operasi-satgas`.
       - Efek hover aksen biru (#2563eb) dengan underline.
     - **Card Pihak Paling Sering Terlibat**:
       - Judul `Pihak Paling Sering Terlibat` dapat diklik -> diarahkan langsung ke `/cms/laporan/rekap-pihak-terlibat`.
       - Efek hover aksen merah (#dc2626) dengan underline.

3. **Kesenadaan Ukuran Card & Mencegah Konten Tertutup**:
   - Penyesuaian `minHeight: 31.5rem` seragam untuk ketiga kartu Sorotan agar ketinggiannya simetris dan senada.
   - Pengaturan grid `minmax(21rem, 1fr)` dan `overflow: visible` sehingga tidak ada teks judul (seperti `Pihak Pa...`) maupun item terbawah (ke-5) yang terpotong atau tertutup border.
   - Perampingan lebar dropdown jenis pihak terlibat agar judul tetap memiliki ruang yang lega.
   - Dukungan penuh untuk mode Light dan Dark.

4. **Cache Busting**:
   - Diperbarui pada chunk `dashboard-perma-318125d33290.js` dan direferensikan pada `dashboard-perma-318125d33290_v2.js` pada server manifest Next.js agar browser pengguna langsung memuat perubahan terbaru tanpa tertahan cache lama.
