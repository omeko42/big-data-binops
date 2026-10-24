-- 047_lp_operasi_satgas.sql — tag LP ke operasi/satgas aktif (opsional, dipilih manual di detail LP)
alter table bdb_laporan_polisi add column if not exists operasi_satgas_id bigint references bdb_operasi_satgas(id) on delete set null;
create index if not exists idx_lp_operasi_satgas on bdb_laporan_polisi(operasi_satgas_id);
