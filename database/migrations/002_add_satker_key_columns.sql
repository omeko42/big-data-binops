alter table bdb_satker_master
add column if not exists satker_key text,
add column if not exists parent_key text,
add column if not exists grandparent_key text,
add column if not exists full_path text;

create unique index if not exists bdb_satker_master_satker_key_uidx
on bdb_satker_master (satker_key)
where satker_key is not null;
