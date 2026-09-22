# Patch UI Kinerja Perkara — 2026-08-30

Patch ini hanya mengubah presentasi tabel Kinerja Perkara pada build Next.js aktif:

- palet header utama menjadi navy/blue;
- subheader utama memakai biru muda;
- kolom rincian memakai warna detail indigo muda;
- header PR Rumus Lama memakai warna yang sama dengan PR Rumus Baru (pasangan rate),
  dan pola pasangan yang sama berlaku pada CR;
- kontras grid, hover, dan dark theme dirapikan;
- PR/CR ditampilkan 4 desimal agar selisih rumus lama–baru terlihat;
- teks bantuan CR Lama diselaraskan menjadi `CC Total / CT`.

Patch **tidak mengubah** kondisi tombol Tampilkan/Sembunyikan Detail, urutan, jumlah, atau struktur kolom.
Script memvalidasi signature chunk, membuat backup berdampingan, dan berhenti bila build target tidak cocok.

Pemakaian pada salinan build:

```powershell
.\patch-compiled.ps1 -NextRoot 'C:\path\to\app\.next'
```
