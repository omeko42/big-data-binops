begin;

alter table auth_users add column if not exists email_google varchar(255);
alter table auth_users add column if not exists email_polri varchar(255);
alter table auth_users add column if not exists login_method varchar(30) not null default 'LOCAL';
alter table auth_users add column if not exists local_password_enabled boolean not null default true;
alter table auth_users add column if not exists role_bdb varchar(40) not null default 'viewer';
alter table auth_users add column if not exists requested_role_bdb varchar(40) not null default 'viewer';
alter table auth_users add column if not exists scope_satker_id bigint;
alter table auth_users add column if not exists scope_satker_key text;
alter table auth_users add column if not exists requested_scope_satker_id bigint;
alter table auth_users add column if not exists requested_scope_satker_key text;
alter table auth_users add column if not exists approval_status varchar(40) not null default 'APPROVED';
alter table auth_users add column if not exists approved_by bigint;
alter table auth_users add column if not exists approved_at timestamp;
alter table auth_users add column if not exists rejected_by bigint;
alter table auth_users add column if not exists rejected_at timestamp;
alter table auth_users add column if not exists reject_reason text;
alter table auth_users add column if not exists self_deactivated_at timestamp;
alter table auth_users add column if not exists deactivated_by bigint;
alter table auth_users add column if not exists deactivated_at timestamp;
alter table auth_users add column if not exists deactivation_reason text;
alter table auth_users add column if not exists two_factor_required boolean not null default false;
alter table auth_users add column if not exists email_otp_required boolean not null default true;
alter table auth_users add column if not exists last_login_method varchar(30);
alter table auth_users add column if not exists last_login_at timestamp;

update auth_users set email_polri = email where email_polri is null and lower(email) like '%@polri.go.id';
update auth_users set email_google = email where email_google is null and lower(email) like '%@gmail.com';
update auth_users set approval_status = 'APPROVED' where approval_status is null or btrim(approval_status) = '';
update auth_users set login_method = 'LOCAL' where login_method is null or btrim(login_method) = '';
update auth_users set role_bdb = case when lower(coalesce(role_bdb, '')) in ('superadmin','admin_binops','operator','viewer') then lower(role_bdb) else 'viewer' end;
update auth_users set requested_role_bdb = case when lower(coalesce(requested_role_bdb, '')) in ('superadmin','admin_binops','operator','viewer') then lower(requested_role_bdb) else role_bdb end;

create unique index if not exists auth_users_email_google_lower_uidx on auth_users (lower(email_google)) where email_google is not null;
create unique index if not exists auth_users_email_polri_lower_uidx on auth_users (lower(email_polri)) where email_polri is not null;
create index if not exists idx_auth_users_bdb_approval on auth_users (approval_status, role_bdb, requested_role_bdb);
create index if not exists idx_auth_users_bdb_scope on auth_users (scope_satker_id, scope_satker_key);
create index if not exists idx_auth_users_bdb_requested_scope on auth_users (requested_scope_satker_id, requested_scope_satker_key);

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'auth_users_login_method_check' and conrelid = 'auth_users'::regclass) then
    alter table auth_users add constraint auth_users_login_method_check check (login_method in ('LOCAL', 'GOOGLE', 'POLRI_SSO', 'HYBRID'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'auth_users_role_bdb_check' and conrelid = 'auth_users'::regclass) then
    alter table auth_users add constraint auth_users_role_bdb_check check (role_bdb in ('superadmin', 'admin_binops', 'operator', 'viewer'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'auth_users_requested_role_bdb_check' and conrelid = 'auth_users'::regclass) then
    alter table auth_users add constraint auth_users_requested_role_bdb_check check (requested_role_bdb in ('superadmin', 'admin_binops', 'operator', 'viewer'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'auth_users_approval_status_check' and conrelid = 'auth_users'::regclass) then
    alter table auth_users add constraint auth_users_approval_status_check check (approval_status in ('PENDING_EMAIL', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'NONAKTIF_MANDIRI', 'NONAKTIF_ADMIN', 'ARSIP'));
  end if;
end $$;

commit;
