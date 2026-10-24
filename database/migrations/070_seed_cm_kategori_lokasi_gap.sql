-- 070_seed_cm_kategori_lokasi_gap.sql
-- Tambahan cm_kategori_lokasi yg belum ikut ke 037_seed_cm_master_data.sql (export lama cuma
-- 197 baris, dev sekarang sudah 213 -- selisihnya ke-auto-create oleh
-- laporan-polisi.service.ts#autoRegisterMasterData() tiap sync DORS memproses payload yg
-- kategori lokasinya belum ada di master).
--
-- Cuma 15 baris "asli" (nama lokasi nyata dari payload DORS) yg disertakan di sini -- SENGAJA
-- TIDAK menyertakan sisa selisihnya:
--   - id 0 dan id 133/140/142/144/146/147/151-158 (cm_modus_operandi) / id 24 (cm_motif_kejahatan):
--     baris placeholder "(Tidak diketahui - dari DORS)" yg dibuat autoRegisterMasterData() sendiri
--     kalau payload tak bawa nama -- akan otomatis muncul lagi di prod begitu DORS sync jalan,
--     tak perlu diseed manual.
--   - id 1000-1119 cm_kategori_lokasi ("lokasi 0"/"Lain-lain"): data sintetis dari generator
--     stress-test scripts/seed-realistic-lp.js di dev lokal, BUKAN data DORS asli -- jangan
--     ikut ke prod.
-- Idempotent (ON CONFLICT DO NOTHING), aman dijalankan ulang.

insert into "cm_kategori_lokasi" ("id", "name", "created_by", "updated_by", "deleted_by", "created_at", "updated_at", "deleted_at") values
 (78, 'APARTEMEN', NULL, NULL, NULL, '2026-07-19 16:57:40.447536', '2026-07-19 16:57:40.447536', NULL),
 (111, 'JALUR KERETA API', NULL, NULL, NULL, '2026-07-31 08:13:05.012839', '2026-07-31 08:13:05.012839', NULL),
 (112, 'Taman Bermain', NULL, NULL, NULL, '2026-07-19 16:57:40.447536', '2026-07-19 16:57:40.447536', NULL),
 (114, 'Hutan Lindung', NULL, NULL, NULL, '2026-07-19 16:57:40.447536', '2026-07-19 16:57:40.447536', NULL),
 (115, 'Hutan Produksi Tetap', NULL, NULL, NULL, '2026-07-31 08:13:05.012839', '2026-07-31 08:13:05.012839', NULL),
 (116, 'Hutan Produksi Terbatas', NULL, NULL, NULL, '2026-07-31 08:13:05.012839', '2026-07-31 08:13:05.012839', NULL),
 (117, 'Hutan Produksi yang dapat Dikonversi', NULL, NULL, NULL, '2026-07-30 22:29:10.707874', '2026-07-30 22:29:10.707874', NULL),
 (118, 'Hutan Konservasi', NULL, NULL, NULL, '2026-07-31 08:13:05.012839', '2026-07-31 08:13:05.012839', NULL),
 (122, 'Pertanian/Ladang', NULL, NULL, NULL, '2026-07-19 16:57:40.447536', '2026-07-19 16:57:40.447536', NULL),
 (123, 'Semak/Lahan Terbuka', NULL, NULL, NULL, '2026-07-19 16:57:40.447536', '2026-07-19 16:57:40.447536', NULL),
 (124, 'Lahan Gambut', NULL, NULL, NULL, '2026-07-30 22:29:10.707874', '2026-07-30 22:29:10.707874', NULL),
 (125, 'Indomaret', NULL, NULL, NULL, '2026-07-19 16:57:40.447536', '2026-07-19 16:57:40.447536', NULL),
 (126, 'Alfamart', NULL, NULL, NULL, '2026-07-19 16:57:40.447536', '2026-07-19 16:57:40.447536', NULL),
 (127, 'Bengkel', NULL, NULL, NULL, '2026-07-19 16:57:40.447536', '2026-07-19 16:57:40.447536', NULL),
 (128, 'Ruko', NULL, NULL, NULL, '2026-07-19 16:57:40.447536', '2026-07-19 16:57:40.447536', NULL)
on conflict ("id") do nothing;
do $$ declare seq text; begin seq := pg_get_serial_sequence('cm_kategori_lokasi', 'id'); if seq is not null then perform setval(seq, greatest((select coalesce(max("id"),0) from "cm_kategori_lokasi"), 1)); end if; end $$;
