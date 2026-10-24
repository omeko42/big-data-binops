-- Alias login baru: username, alternatif dari email_polri. Keduanya wajib unik global
-- (bukan per-satker) supaya findByLoginIdentifier tidak ambigu.
alter table auth_users add column if not exists username text;
create unique index if not exists auth_users_username_lower_uidx on auth_users (lower(username)) where username is not null and username <> '';
