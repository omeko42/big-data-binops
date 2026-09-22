# Reconcile backlog DORS 2026-09-04

Paket produksi untuk 465 LP / 42 grup satker yang tertahan di menu Belum Termapping dan Tanpa Satker.

- Semua 42 grup sudah memiliki master kanonis; tidak membuat node baru.
- 31 Polsek dipindah dari induk administratif lama ke Polres yang dikirim DORS saat ini.
- 17 master lama dilengkapi kode DORS.
- 42 alias exact nama + induk diarahkan ke target unik.
- Mapper aktif tetap memakai guard nama, level, induk, target aktif, dan kandidat tunggal.
- Backup persisten route, raw DORS, master, alias, dan metadata tersedia di schema codex_backup.

Urutan: 01_preflight.sql, 02_dry_run.sql, 03_apply.sql, jalankan mapper, 04_postflight.sql.
Gunakan 05_rollback.sql hanya segera setelah apply dan hanya bila guard rollback mengizinkan.

Tambrauw follow-up:

- `06_tambrauw_audit.sql` dan `06b_tambrauw_decision.sql`: bukti akar masalah kandidat ganda.
- `07_tambrauw_dry_run.sql`: simulasi penuh dan rollback otomatis.
- `08_tambrauw_apply.sql`: backup persisten lalu nonaktifkan node legacy hanya dari aliran DORS.
- `08b_tambrauw_map_lp.sql`: petakan tepat dua LP ke unit kanonis memakai guard yang sama dengan mapper produksi.
- `09_tambrauw_rollback.sql`: rollback node dan dua LP dari backup.
- `10_tambrauw_postflight.sql` dan `11_final_audit.sql`: verifikasi akhir baca-saja.
