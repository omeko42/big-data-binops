-- Master Operasi/Satgas: daftar Operasi & Satgas Polri beserta dasar (nomor Sprin), tanggal
-- dibentuk, periode aktif, dan lampiran dokumen (PDF Sprin dkk, multi-file via MinIO -- pola
-- sama seperti bdb_kerma_master/bdb_kerma_attachments).
create table if not exists bdb_operasi_satgas (
    id bigserial primary key,
    jenis text not null default 'OPERASI', -- OPERASI | SATGAS
    nama text not null,
    nomor_dasar text,                       -- nomor Sprin/surat perintah pembentukan
    tanggal_dibentuk date,
    tanggal_mulai date,
    tanggal_selesai date,
    satker_penyelenggara text,
    pimpinan text,
    deskripsi text,
    is_aktif boolean not null default true, -- override manual ("Off") -- lepas dari periode tanggal
    created_by bigint references auth_users(id) on delete set null,
    updated_by bigint references auth_users(id) on delete set null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    deleted_at timestamptz
);
create index if not exists idx_operasi_satgas_deleted on bdb_operasi_satgas(deleted_at);
create index if not exists idx_operasi_satgas_jenis on bdb_operasi_satgas(jenis);
create index if not exists idx_operasi_satgas_tanggal_selesai on bdb_operasi_satgas(tanggal_selesai);

create table if not exists bdb_operasi_satgas_attachments (
    id bigserial primary key,
    operasi_satgas_id bigint not null references bdb_operasi_satgas(id) on delete cascade,
    file_name text not null,
    object_key text not null,
    content_type text,
    size bigint,
    created_at timestamptz not null default now()
);
create index if not exists idx_operasi_satgas_attachments_parent on bdb_operasi_satgas_attachments(operasi_satgas_id);
