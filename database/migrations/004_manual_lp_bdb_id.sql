begin;

alter table bdb_lp_master
  alter column dors_lp_id drop not null;

alter table bdb_lp_master
  add column if not exists bdb_lp_id text;

create unique index if not exists bdb_lp_master_bdb_lp_id_uidx
  on bdb_lp_master (bdb_lp_id)
  where bdb_lp_id is not null;

commit;
