# Cleanup akun sintetis @bdb.local — 2026-08-12

Target dikunci tepat pada akun hasil generate 11 Agustus 2026 pukul 18:00–19:00 dengan seluruh syarat berikut:

- email `admin.%@bdb.local`;
- nama `Admin_%`;
- role `operator`;
- `email_polri` dan `username` kosong;
- belum pernah login;
- jumlah wajib tepat 13.605 akun.

Pelaksana dicatat sebagai auth user ID 1, `98010710@polri.go.id` (EKO), menggunakan waktu database saat apply.

Preflight menemukan tepat 7 sesi/perangkat milik akun sintetis. Versi 2 mencadangkan metadata non-rahasia dan mencabut ketujuh sesi tersebut sebelum akun dihapus, dalam transaksi yang sama. Token sesi tidak disalin ke backup. Rollback dapat mengembalikan akun, tetapi sengaja tidak menghidupkan sesi lama. Patch berhenti otomatis bila jumlah akun bukan 13.605, jumlah sesi bukan 7, pelaksana tidak valid, ada referensi aktivitas/audit, atau backup sudah pernah dibuat. Profil `trb_police` tidak dihapus.

Versi 3 mengatasi FK `ON DELETE SET NULL` yang lambat pada tabel LP besar. Setelah audit referensi nol, patch mengambil lock tulis singkat dengan `lock_timeout` 5 detik, memeriksa ulang seluruh kondisi, kemudian melewati trigger FK hanya pada transaksi cleanup. Tidak ada constraint atau indeks permanen yang diubah. Jika lock tidak segera tersedia atau data berubah, transaksi otomatis batal.

Urutan:

1. `01_preflight_readonly.sql`
2. `02_dry_run.sql`
3. `03_apply.sql`
4. `04_rollback.sql` hanya jika perlu mengembalikan akun.

Apply membuat dua tabel permanen untuk keselamatan dan audit:

- `public.bdb_backup_auth_users_bdb_local_20260812`
- `public.bdb_backup_auth_devices_bdb_local_20260812`
- `public.bdb_auth_cleanup_audit_20260812`

Jangan menghapus dua tabel tersebut sebelum handover selesai.
