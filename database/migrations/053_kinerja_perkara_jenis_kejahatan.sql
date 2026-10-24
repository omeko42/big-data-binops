-- Filter laporan Kinerja Perkara berdasarkan jenis kejahatan.
alter table bdb_kinerja_perkara_snapshot add column if not exists jenis_kejahatan_id bigint;
create index if not exists idx_kps_jenis_kejahatan on bdb_kinerja_perkara_snapshot(jenis_kejahatan_id);
