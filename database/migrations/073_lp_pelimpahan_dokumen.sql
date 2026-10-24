-- 073_lp_pelimpahan_dokumen.sql
-- Pelimpahan LP (internal & eksternal, satu tabel bdb_lp_pelimpahan -- lihat 039/067): tambah
-- nomor & tanggal dokumen resmi pelimpahan + lampiran arsip dokumennya (MinIO, multi-file),
-- berlaku sama utk pelimpahan internal maupun ke Satker Eksternal krn keduanya baris di tabel
-- yang sama. Auto-dibuat juga oleh LpPelimpahanService.ensureTable() (idempotent).

alter table bdb_lp_pelimpahan add column if not exists nomor_dokumen text;
alter table bdb_lp_pelimpahan add column if not exists tanggal_dokumen date;

create table if not exists bdb_lp_pelimpahan_attachments (
    id bigserial primary key,
    pelimpahan_id bigint not null references bdb_lp_pelimpahan(id) on delete cascade,
    file_name text not null,
    object_key text not null,
    content_type text,
    size bigint,
    created_at timestamptz not null default now()
);
create index if not exists idx_lp_pelimpahan_attachments_parent on bdb_lp_pelimpahan_attachments(pelimpahan_id);
