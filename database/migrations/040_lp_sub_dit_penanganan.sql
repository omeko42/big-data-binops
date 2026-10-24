-- 040_lp_sub_dit_penanganan.sql — sub dit/unit yang menangani LP (freetext manual, sementara)
alter table bdb_laporan_polisi add column if not exists sub_dit_penanganan text;
