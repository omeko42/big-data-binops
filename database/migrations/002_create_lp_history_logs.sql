create table if not exists bdb_lp_history_logs (
  id bigserial primary key,

  lp_master_id bigint not null references bdb_lp_master(id) on delete cascade,

  event_type text not null, -- DISTRIBUSI | STATUS | DETAIL
  event_status text null,

  event_text text not null,

  document_type text null, -- Surat | Nota Dinas | SP3 | P21 | dll
  document_number text null,
  document_date timestamp without time zone null,
  document_timezone text null default 'WIB',

  from_satker_id bigint null references bdb_satker_master(id),
  to_satker_id bigint null references bdb_satker_master(id),

  from_satker_name text null,
  to_satker_name text null,

  note text null,
  payload_json jsonb null,

  created_by_id bigint null,
  created_by_name text null,
  created_at timestamp without time zone not null default now()
);

create index if not exists idx_bdb_lp_history_logs_lp_master_id
on bdb_lp_history_logs(lp_master_id);

create index if not exists idx_bdb_lp_history_logs_created_at
on bdb_lp_history_logs(created_at desc);
