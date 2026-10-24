-- 024_lp_dokumen_workflow.sql
-- Alur dokumen Laporan Polisi (config-driven state machine). LP = bdb_laporan_polisi.
-- Menambah jenis surat baru cukup tambah row di bdb_document_type_master (tanpa ubah kode).
-- Idempotent; juga di-ensure oleh WorkflowService.ensureTables().

-- 1) Master status LP
create table if not exists bdb_status_master (
    id bigserial primary key,
    code text not null unique,
    nama text not null,
    urutan integer not null default 0
);

-- 2) Master pasal / tindak pidana
create table if not exists bdb_pasal_master (
    id bigserial primary key,
    nomor_pasal text not null,
    deskripsi text,
    uu_referensi text,
    created_at timestamp not null default now()
);
create unique index if not exists bdb_pasal_master_uidx on bdb_pasal_master (lower(nomor_pasal), lower(coalesce(uu_referensi,'')));

-- 3) Master jenis surat (otak alur)
create table if not exists bdb_document_type_master (
    id bigserial primary key,
    code text not null unique,
    nama text not null,
    status_prasyarat_id bigint references bdb_status_master(id) on delete set null,   -- status yg harus SUDAH pernah dicapai
    dokumen_prasyarat_id bigint references bdb_document_type_master(id) on delete set null, -- dokumen yg harus sudah ada (rantai)
    status_target_id bigint references bdb_status_master(id) on delete set null,      -- status LP setelah dokumen dibuat
    urutan_tahap integer not null default 0,
    form_schema jsonb not null default '{"fields":[]}'::jsonb,
    aktif boolean not null default true,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now()
);

-- 4) status_id pada LP (berubah otomatis via pembuatan dokumen)
alter table bdb_laporan_polisi add column if not exists status_id bigint references bdb_status_master(id) on delete set null;

-- 5) Dokumen generic (semua jenis surat)
create table if not exists bdb_dokumen (
    id bigserial primary key,
    lp_id bigint not null references bdb_laporan_polisi(id) on delete cascade,
    document_type_id bigint not null references bdb_document_type_master(id),
    nomor_dokumen text,
    tanggal_dokumen date,
    tanggal_mulai date,
    tanggal_berakhir date,
    data jsonb not null default '{}'::jsonb,
    lampiran jsonb not null default '[]'::jsonb,
    created_by bigint,
    created_at timestamp not null default now()
);
create index if not exists bdb_dokumen_lp_idx on bdb_dokumen (lp_id);
create index if not exists bdb_dokumen_type_idx on bdb_dokumen (document_type_id);

-- 6) Relasi dokumen <-> pasal
create table if not exists bdb_dokumen_pasal (
    id bigserial primary key,
    dokumen_id bigint not null references bdb_dokumen(id) on delete cascade,
    pasal_id bigint references bdb_pasal_master(id) on delete set null,
    nomor_pasal text,           -- snapshot teks (kalau pasal belum jadi master)
    sumber text not null default 'tambahan_manual'  -- 'dari_lp' | 'tambahan_manual'
);
create index if not exists bdb_dokumen_pasal_dok_idx on bdb_dokumen_pasal (dokumen_id);

-- 7) Log override status manual (admin) -- perubahan status LP normalnya HANYA via dokumen
create table if not exists bdb_status_override_log (
    id bigserial primary key,
    lp_id bigint not null references bdb_laporan_polisi(id) on delete cascade,
    from_status_id bigint, to_status_id bigint,
    alasan text, created_by bigint, created_at timestamp not null default now()
);

-- ============ SEED ============
insert into bdb_status_master (code, nama, urutan) values
    ('LP','Laporan Polisi',1),
    ('PENYELIDIKAN','Penyelidikan',2),
    ('PENYIDIKAN','Penyidikan',3),
    ('SP3','Penghentian Penyidikan (SP3)',4),
    ('TAHAP_I','Tahap I (Pemberkasan)',5),
    ('TAHAP_II','Tahap II (Penyerahan)',6)
on conflict (code) do nothing;

-- default status LP untuk baris yang belum punya
update bdb_laporan_polisi set status_id = (select id from bdb_status_master where code='LP')
where status_id is null;

-- beberapa pasal contoh
insert into bdb_pasal_master (nomor_pasal, deskripsi, uu_referensi) values
    ('362','Pencurian','KUHP'),
    ('363','Pencurian dengan pemberatan','KUHP'),
    ('365','Pencurian dengan kekerasan','KUHP'),
    ('351','Penganiayaan','KUHP'),
    ('372','Penggelapan','KUHP'),
    ('378','Penipuan','KUHP'),
    ('477','Pencurian dengan pemberatan','UU 1/2023'),
    ('479','Pencurian dengan kekerasan','UU 1/2023')
on conflict do nothing;

-- jenis surat + form_schema + relasi prasyarat
insert into bdb_document_type_master (code, nama, status_prasyarat_id, dokumen_prasyarat_id, status_target_id, urutan_tahap, form_schema, aktif)
values
 ('SP_LIDIK','Surat Perintah Penyelidikan',
   (select id from bdb_status_master where code='LP'), null,
   (select id from bdb_status_master where code='PENYELIDIKAN'), 1,
   '{"fields":[
      {"field_key":"nomor_dokumen","label":"Nomor Surat","type":"text","required":true},
      {"field_key":"tanggal_dokumen","label":"Tanggal Surat","type":"date","required":true},
      {"field_key":"tanggal_mulai","label":"Mulai Penyelidikan","type":"date","required":true},
      {"field_key":"tanggal_berakhir","label":"Sampai","type":"date"},
      {"field_key":"dasar","label":"Dasar","type":"text"},
      {"field_key":"penyelidik","label":"Nama Penyelidik","type":"text"},
      {"field_key":"pasal","label":"Dugaan Pasal","type":"pasal_picker","source":"master:pasal"},
      {"field_key":"lampiran_dokumen","label":"Lampiran Surat","type":"file","lampiran":true}
   ]}'::jsonb, true),
 ('SP_SIDIK','Surat Perintah Penyidikan',
   null, null,
   (select id from bdb_status_master where code='PENYIDIKAN'), 1,
   '{"fields":[
      {"field_key":"nomor_dokumen","label":"Nomor Surat","type":"text","required":true},
      {"field_key":"tanggal_dokumen","label":"Tanggal Surat","type":"date","required":true},
      {"field_key":"tanggal_mulai","label":"Mulai Penyidikan","type":"date","required":true},
      {"field_key":"tanggal_berakhir","label":"Sampai","type":"date"},
      {"field_key":"penyidik","label":"Nama Penyidik","type":"text"},
      {"field_key":"pasal","label":"Pasal yang Disangkakan","type":"pasal_picker","source":"inherit:lp_pasal","required":true},
      {"field_key":"lampiran_dokumen","label":"Lampiran Surat","type":"file","lampiran":true}
   ]}'::jsonb, true),
 ('SP3','Surat Ketetapan Penghentian Penyidikan (SP3)',
   (select id from bdb_status_master where code='PENYIDIKAN'),
   (select id from bdb_document_type_master where code='SP_SIDIK'),
   (select id from bdb_status_master where code='SP3'), 2,
   '{"fields":[
      {"field_key":"nomor_dokumen","label":"Nomor Ketetapan","type":"text","required":true},
      {"field_key":"tanggal_dokumen","label":"Tanggal Ketetapan","type":"date","required":true},
      {"field_key":"alasan_penghentian","label":"Alasan Penghentian","type":"select","required":true,"source":"static","options":["Tidak cukup bukti","Bukan tindak pidana","Demi hukum (nebis in idem/kadaluarsa)"]},
      {"field_key":"uraian","label":"Uraian","type":"text"},
      {"field_key":"pasal","label":"Pasal","type":"pasal_picker","source":"inherit:lp_pasal"},
      {"field_key":"lampiran_dokumen","label":"Lampiran","type":"file","lampiran":true}
   ]}'::jsonb, true),
 ('TAHAP_1','Pemberkasan Tahap I',
   (select id from bdb_status_master where code='PENYIDIKAN'),
   (select id from bdb_document_type_master where code='SP_SIDIK'),
   (select id from bdb_status_master where code='TAHAP_I'), 2,
   '{"fields":[
      {"field_key":"nomor_dokumen","label":"Nomor Pengiriman Berkas","type":"text","required":true},
      {"field_key":"tanggal_dokumen","label":"Tanggal Kirim","type":"date","required":true},
      {"field_key":"kejaksaan_tujuan","label":"Kejaksaan Tujuan","type":"text","required":true},
      {"field_key":"pasal","label":"Pasal","type":"pasal_picker","source":"inherit:lp_pasal"},
      {"field_key":"lampiran_dokumen","label":"Berkas Perkara","type":"file","lampiran":true}
   ]}'::jsonb, true),
 ('TAHAP_2','Penyerahan Tahap II (Tersangka & Barang Bukti)',
   (select id from bdb_status_master where code='PENYIDIKAN'),
   (select id from bdb_document_type_master where code='TAHAP_1'),
   (select id from bdb_status_master where code='TAHAP_II'), 3,
   '{"fields":[
      {"field_key":"nomor_dokumen","label":"Nomor BA Serah Terima","type":"text","required":true},
      {"field_key":"tanggal_dokumen","label":"Tanggal Penyerahan","type":"date","required":true},
      {"field_key":"nama_tersangka","label":"Nama Tersangka","type":"text","required":true},
      {"field_key":"jaksa_penerima","label":"Jaksa Penerima","type":"text"},
      {"field_key":"pasal","label":"Pasal","type":"pasal_picker","source":"inherit:lp_pasal"},
      {"field_key":"lampiran_dokumen","label":"Lampiran","type":"file","lampiran":true}
   ]}'::jsonb, true)
on conflict (code) do nothing;

-- set dokumen_prasyarat (rantai) — setelah insert agar subselect terlihat
update bdb_document_type_master set dokumen_prasyarat_id = (select id from bdb_document_type_master where code='SP_SIDIK'), updated_at=now()
where code in ('SP3','TAHAP_1') and dokumen_prasyarat_id is null;
update bdb_document_type_master set dokumen_prasyarat_id = (select id from bdb_document_type_master where code='TAHAP_1'), updated_at=now()
where code='TAHAP_2' and dokumen_prasyarat_id is null;
