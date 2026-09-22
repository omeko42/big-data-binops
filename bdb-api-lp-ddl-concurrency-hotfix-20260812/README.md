# Hotfix minimal konkurensi DDL LP

Paket ini sengaja tidak memuat perubahan aturan scope dan tidak memuat migrasi/data correction.
Perubahan hanya:

1. `ensureTable()` menjadi single-flight per proses dan memakai PostgreSQL advisory transaction
   lock, sehingga list/stats/cron tidak menjalankan DDL trigger secara paralel.
2. `QueryFailedError` aman ketika `parameters` tidak tersedia, sehingga error database asli tidak
   tertutup error sekunder `.join`.

Semua pernyataan schema di dalam `ensureTable()` adalah pernyataan yang sudah ada pada source
production. Hotfix tidak menambahkan tabel, kolom, trigger, atau backfill baru.
