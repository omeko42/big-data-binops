-- 034_lp_tingkat_kesulitan.sql — tingkat kesulitan penanganan LP (Mudah/Sedang/Sulit)
alter table bdb_laporan_polisi add column if not exists tingkat_kesulitan text;
