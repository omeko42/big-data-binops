begin;

alter table bdb_dors_raw_lp
  add column if not exists model_lp text;

alter table bdb_dors_raw_lp
  add column if not exists data_scope text not null default 'TEST';

alter table bdb_dors_raw_lp
  add column if not exists import_batch text;

alter table bdb_lp_master
  add column if not exists data_scope text not null default 'TEST';

alter table bdb_lp_master
  add column if not exists import_batch text;

update bdb_dors_raw_lp raw
set model_lp = case
    when lower(coalesce(lp.model_lp, raw.payload_json->>'kategori', raw.payload_json->>'lp_model', '')) in ('a', 'lp_a', 'lpa', 'lp_model_a') then 'lp_model_a'
    when lower(coalesce(lp.model_lp, raw.payload_json->>'kategori', raw.payload_json->>'lp_model', '')) in ('b', 'lp_b', 'lpb', 'lp_model_b') then 'lp_model_b'
    else coalesce(nullif(lp.model_lp, ''), nullif(raw.payload_json->>'kategori', ''), nullif(raw.payload_json->>'lp_model', ''), 'lp_model_unknown')
  end
from bdb_lp_master lp
where lp.raw_lp_id = raw.id
  and (raw.model_lp is null or btrim(raw.model_lp) = '');

update bdb_dors_raw_lp raw
set model_lp = case
    when lower(coalesce(raw.payload_json->>'kategori', raw.payload_json->>'lp_model', '')) in ('a', 'lp_a', 'lpa', 'lp_model_a') then 'lp_model_a'
    when lower(coalesce(raw.payload_json->>'kategori', raw.payload_json->>'lp_model', '')) in ('b', 'lp_b', 'lpb', 'lp_model_b') then 'lp_model_b'
    else coalesce(nullif(raw.payload_json->>'kategori', ''), nullif(raw.payload_json->>'lp_model', ''), 'lp_model_unknown')
  end
where raw.model_lp is null or btrim(raw.model_lp) = '';

update bdb_lp_master lp
set model_lp = case
    when lower(coalesce(lp.model_lp, '')) in ('a', 'lp_a', 'lpa', 'lp_model_a') then 'lp_model_a'
    when lower(coalesce(lp.model_lp, '')) in ('b', 'lp_b', 'lpb', 'lp_model_b') then 'lp_model_b'
    else coalesce(nullif(lp.model_lp, ''), 'lp_model_unknown')
  end
where lp.model_lp is null or btrim(lp.model_lp) = '' or lower(lp.model_lp) in ('a', 'lp_a', 'lpa', 'b', 'lp_b', 'lpb');

alter table bdb_dors_raw_lp
  alter column model_lp set default 'lp_model_unknown';

alter table bdb_dors_raw_lp
  alter column model_lp set not null;

alter table bdb_lp_master
  alter column model_lp set default 'lp_model_unknown';

alter table bdb_lp_master
  alter column model_lp set not null;

alter table bdb_dors_raw_lp
  drop constraint if exists bdb_dors_raw_lp_dors_lp_id_key;

alter table bdb_lp_master
  drop constraint if exists bdb_lp_master_dors_lp_id_key;

drop index if exists bdb_dors_raw_lp_dors_lp_id_key;
drop index if exists bdb_lp_master_dors_lp_id_key;

create unique index if not exists bdb_dors_raw_lp_dors_lp_id_model_lp_uidx
  on bdb_dors_raw_lp (dors_lp_id, model_lp);

create unique index if not exists bdb_lp_master_dors_lp_id_model_lp_uidx
  on bdb_lp_master (dors_lp_id, model_lp);

create index if not exists idx_bdb_lp_master_data_scope_tanggal
  on bdb_lp_master (data_scope, tanggal_lp);

create index if not exists idx_bdb_lp_master_model_lp
  on bdb_lp_master (model_lp);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'bdb_dors_raw_lp_data_scope_check'
      and conrelid = 'bdb_dors_raw_lp'::regclass
  ) then
    alter table bdb_dors_raw_lp
      add constraint bdb_dors_raw_lp_data_scope_check
      check (data_scope in ('TEST', 'OPERASIONAL', 'ARCHIVE'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'bdb_lp_master_data_scope_check'
      and conrelid = 'bdb_lp_master'::regclass
  ) then
    alter table bdb_lp_master
      add constraint bdb_lp_master_data_scope_check
      check (data_scope in ('TEST', 'OPERASIONAL', 'ARCHIVE'));
  end if;
end $$;

commit;
