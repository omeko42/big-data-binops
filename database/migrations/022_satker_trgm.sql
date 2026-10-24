-- 022_satker_trgm.sql
-- Index trigram untuk pencocokan nama satker (mapping via kemiripan nama). Idempotent.
create extension if not exists pg_trgm;
create index if not exists bdb_satker_desk_trgm on bdb_satker using gin (upper(deskripsi) gin_trgm_ops);
