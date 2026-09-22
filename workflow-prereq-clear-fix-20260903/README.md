# Perbaikan clear dokumen prasyarat

Target: Master Alur Dokumen, pilihan `— tidak ada —` pada `Butuh Dokumen (prasyarat)`.

Perubahan:

- Frontend memvalidasi `status` bisnis respons API sebelum menampilkan notifikasi sukses.
- Nilai kosong dikirim eksplisit sebagai `null`.
- Backend memakai `UPDATE ... RETURNING` dan memastikan nilai prasyarat yang tersimpan sama dengan permintaan.
- Konfigurasi `LHP` yang diminta pengguna dikosongkan satu kali dalam transaksi terjaga.
- Deployment memakai hash guard, backup, pemeriksaan sintaks, health check, dan rollback otomatis.

