-- Hapus seluruh node SPKT (Sentra Pelayanan Kepolisian Terpadu) dari Struktur Satker.
-- SPKT adalah loket/fungsi layanan di tiap Polres/Polsek, bukan satker penanganan LP
-- sungguhan -- diverifikasi sblm migrasi ini dibuat: seluruh 5.207 baris berasal dari
-- source ROBINOPS (bukan hasil backfill dors_kode), 0 baris punya anak (child), 0 LP
-- termapping ke node ini (baik via satker_id maupun unit_satker_id), 0 alias DORS
-- (bdb_dors_satker_map) yg menunjuk ke node ini -- aman dihapus tanpa efek samping.
delete from bdb_satker where deskripsi ilike 'SPKT%';
