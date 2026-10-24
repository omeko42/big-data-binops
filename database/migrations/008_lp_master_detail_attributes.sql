begin;

alter table bdb_lp_master
  add column if not exists uraian_singkat_operasional text;

alter table bdb_lp_master
  add column if not exists tingkat_kesulitan text;

alter table bdb_lp_master
  add column if not exists detail_updated_at timestamp;

commit;
