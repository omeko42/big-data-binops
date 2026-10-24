alter table auth_users add column if not exists security_pin_hash varchar(255);
alter table auth_users add column if not exists pin_required boolean not null default false;

update auth_users
set email_otp_required = true
where email_otp_required is distinct from true;
