-- 075_document_type_status_target_sync.sql
-- Sinkron alur dokumen (bdb_status_master + bdb_document_type_master) dari lokal ke prod --
-- tabel ini SELAMA INI cuma dikelola manual lewat menu Pengaturan Sistem > Alur Dokumen, tak
-- pernah ada migration lengkapnya (024/025/028/029/031 cuma seed AWAL, banyak field sudah
-- diedit lewat UI sesudahnya & tak pernah ikut ter-deploy). Upsert LENGKAP per kode (semua
-- kolom, bukan cuma yg keliatan beda di UI) supaya tak ada field lain yg kelewat diam2 beda.
-- PENTING: perubahan status_target_id (SPT_LIDIK/SPT_SIDIK/PENETAPAN_TSK/SPDP/P19/P21 kini
-- ikut mengubah status LP, sebelumnya cuma dokumen informatif) sudah dikonfirmasi user sbg
-- perubahan alur yg disengaja, bukan sisa percobaan lokal.

-- status baru (SPDP/P19/P21 blm pernah ada migration-nya, cuma dibuat manual lewat tab Status)
insert into bdb_status_master (code, nama, kategori, urutan) values ('SPDP', 'Pemberitahuan Dimulainya Penyidikan Ke Kejaksaan', 'CT', 6)
on conflict (code) do update set nama=excluded.nama, kategori=excluded.kategori, urutan=excluded.urutan;
insert into bdb_status_master (code, nama, kategori, urutan) values ('P19', 'P19', 'CT', 8)
on conflict (code) do update set nama=excluded.nama, kategori=excluded.kategori, urutan=excluded.urutan;
insert into bdb_status_master (code, nama, kategori, urutan) values ('P21', 'P21', 'CT', 9)
on conflict (code) do update set nama=excluded.nama, kategori=excluded.kategori, urutan=excluded.urutan;

-- upsert lengkap tiap jenis surat, TANPA dokumen_prasyarat_id dulu (di-set terpisah di bawah
-- via UPDATE by code, spy tak tergantung urutan insert antar baris yg saling mereferensi --
-- pola sama persis spt 024/025/028).
insert into bdb_document_type_master (code, nama, status_prasyarat_id, status_target_id, urutan_tahap, form_schema, aktif) values (
    'SP_LIDIK', 'Surat Perintah Penyelidikan',
    (select id from bdb_status_master where code='LP'), (select id from bdb_status_master where code='PENYELIDIKAN'), 1,
    '{"fields": [{"type": "text", "label": "Nomor Surat", "required": true, "field_key": "nomor_dokumen"}, {"type": "date", "label": "Tanggal Surat", "required": true, "field_key": "tanggal_dokumen"}, {"type": "repeater", "label": "Personel Penyelidik", "field_key": "personel", "subfields": [{"type": "text", "label": "Nama", "required": true, "field_key": "nama"}, {"type": "text", "label": "Pangkat / NRP", "field_key": "pangkat_nrp"}, {"type": "text", "label": "Jabatan", "field_key": "jabatan"}]}, {"type": "file", "label": "Lampiran", "lampiran": true, "field_key": "lampiran_dokumen"}]}'::jsonb, true
) on conflict (code) do update set
    nama=excluded.nama, status_prasyarat_id=excluded.status_prasyarat_id,
    status_target_id=excluded.status_target_id, urutan_tahap=excluded.urutan_tahap, form_schema=excluded.form_schema,
    aktif=excluded.aktif, updated_at=now();

insert into bdb_document_type_master (code, nama, status_prasyarat_id, status_target_id, urutan_tahap, form_schema, aktif) values (
    'SPT_LIDIK', 'Surat Perintah Tugas Penyelidikan',
    null, (select id from bdb_status_master where code='PENYELIDIKAN'), 1,
    '{"fields": [{"type": "text", "label": "Nomor Surat", "required": true, "field_key": "nomor_dokumen"}, {"type": "date", "label": "Tanggal Surat", "required": true, "field_key": "tanggal_dokumen"}, {"type": "repeater", "label": "Personel yang Ditugaskan", "field_key": "personel", "subfields": [{"type": "text", "label": "Nama", "required": true, "field_key": "nama"}, {"type": "text", "label": "Pangkat / NRP", "field_key": "pangkat_nrp"}, {"type": "text", "label": "Jabatan", "field_key": "jabatan"}]}, {"type": "file", "label": "Lampiran", "lampiran": true, "field_key": "lampiran_dokumen"}]}'::jsonb, true
) on conflict (code) do update set
    nama=excluded.nama, status_prasyarat_id=excluded.status_prasyarat_id,
    status_target_id=excluded.status_target_id, urutan_tahap=excluded.urutan_tahap, form_schema=excluded.form_schema,
    aktif=excluded.aktif, updated_at=now();

insert into bdb_document_type_master (code, nama, status_prasyarat_id, status_target_id, urutan_tahap, form_schema, aktif) values (
    'LHP', 'Laporan Hasil Penyelidikan (LHP)',
    (select id from bdb_status_master where code='PENYELIDIKAN'), null, 2,
    '{"fields": [{"type": "text", "label": "Nomor LHP", "required": true, "field_key": "nomor_dokumen"}, {"type": "date", "label": "Tanggal LHP", "required": true, "field_key": "tanggal_dokumen"}, {"type": "textarea", "label": "Kesimpulan", "field_key": "kesimpulan"}, {"type": "file", "label": "Lampiran", "lampiran": true, "field_key": "lampiran_dokumen"}]}'::jsonb, true
) on conflict (code) do update set
    nama=excluded.nama, status_prasyarat_id=excluded.status_prasyarat_id,
    status_target_id=excluded.status_target_id, urutan_tahap=excluded.urutan_tahap, form_schema=excluded.form_schema,
    aktif=excluded.aktif, updated_at=now();

insert into bdb_document_type_master (code, nama, status_prasyarat_id, status_target_id, urutan_tahap, form_schema, aktif) values (
    'SP2_LIDIK', 'Surat Pemberitahuan Penghentian Penyelidikan',
    (select id from bdb_status_master where code='PENYELIDIKAN'), (select id from bdb_status_master where code='SP2_LIDIK'), 2,
    '{"fields": [{"type": "text", "label": "Nomor Surat", "required": true, "field_key": "nomor_dokumen"}, {"type": "date", "label": "Tanggal Surat", "required": true, "field_key": "tanggal_dokumen"}, {"type": "select", "label": "Alasan Dihentikan", "source": "static", "required": true, "field_key": "alasan_penghentian", "option_groups": [{"items": ["Putusan tetap / Ne Bis in Idem", "Tersangka atau terdakwa meninggal dunia", "Kedaluwarsa", "Amnesti atau abolisi"], "label": "Masuk Kategori \"Demi Hukum\""}, {"items": ["Penyelesaian luar proses peradilan / Restorative Justice", "Ditariknya pengaduan", "Maksimum pidana denda dibayar sukarela", "Tidak terdapat cukup alat bukti", "Peristiwa bukan merupakan tindak pidana"], "label": "Masuk Kategori \"Alasan Utama\""}]}, {"type": "textarea", "label": "Keterangan", "field_key": "keterangan"}, {"type": "file", "label": "Lampiran", "lampiran": true, "field_key": "lampiran_dokumen"}]}'::jsonb, true
) on conflict (code) do update set
    nama=excluded.nama, status_prasyarat_id=excluded.status_prasyarat_id,
    status_target_id=excluded.status_target_id, urutan_tahap=excluded.urutan_tahap, form_schema=excluded.form_schema,
    aktif=excluded.aktif, updated_at=now();

insert into bdb_document_type_master (code, nama, status_prasyarat_id, status_target_id, urutan_tahap, form_schema, aktif) values (
    'SP_SIDIK', 'Surat Perintah Penyidikan',
    null, (select id from bdb_status_master where code='PENYIDIKAN'), 3,
    '{"fields": [{"type": "text", "label": "Nomor Surat", "required": true, "field_key": "nomor_dokumen"}, {"type": "date", "label": "Tanggal Surat", "required": true, "field_key": "tanggal_dokumen"}, {"type": "repeater", "label": "Personel Penyidik", "field_key": "personel", "subfields": [{"type": "text", "label": "Nama", "required": true, "field_key": "nama"}, {"type": "text", "label": "Pangkat / NRP", "field_key": "pangkat_nrp"}, {"type": "text", "label": "Jabatan", "field_key": "jabatan"}]}, {"type": "pasal_picker", "label": "Pasal yang Disangkakan", "source": "inherit:lp_pasal", "required": true, "field_key": "pasal"}, {"type": "file", "label": "Lampiran", "lampiran": true, "field_key": "lampiran_dokumen"}]}'::jsonb, true
) on conflict (code) do update set
    nama=excluded.nama, status_prasyarat_id=excluded.status_prasyarat_id,
    status_target_id=excluded.status_target_id, urutan_tahap=excluded.urutan_tahap, form_schema=excluded.form_schema,
    aktif=excluded.aktif, updated_at=now();

insert into bdb_document_type_master (code, nama, status_prasyarat_id, status_target_id, urutan_tahap, form_schema, aktif) values (
    'SPT_SIDIK', 'Surat Perintah Tugas Penyidikan',
    null, (select id from bdb_status_master where code='PENYIDIKAN'), 3,
    '{"fields": [{"type": "text", "label": "Nomor Surat", "required": true, "field_key": "nomor_dokumen"}, {"type": "date", "label": "Tanggal Surat", "required": true, "field_key": "tanggal_dokumen"}, {"type": "repeater", "label": "Personel Penyidik", "field_key": "personel", "subfields": [{"type": "text", "label": "Nama", "required": true, "field_key": "nama"}, {"type": "text", "label": "Pangkat / NRP", "field_key": "pangkat_nrp"}, {"type": "text", "label": "Jabatan", "field_key": "jabatan"}]}, {"type": "file", "label": "Lampiran", "lampiran": true, "field_key": "lampiran_dokumen"}]}'::jsonb, true
) on conflict (code) do update set
    nama=excluded.nama, status_prasyarat_id=excluded.status_prasyarat_id,
    status_target_id=excluded.status_target_id, urutan_tahap=excluded.urutan_tahap, form_schema=excluded.form_schema,
    aktif=excluded.aktif, updated_at=now();

insert into bdb_document_type_master (code, nama, status_prasyarat_id, status_target_id, urutan_tahap, form_schema, aktif) values (
    'PENETAPAN_TSK', 'Surat Ketetapan Penetapan Tersangka',
    (select id from bdb_status_master where code='PENYIDIKAN'), (select id from bdb_status_master where code='PENYIDIKAN'), 4,
    '{"fields": [{"type": "text", "label": "Nomor Ketetapan", "required": true, "field_key": "nomor_dokumen"}, {"type": "date", "label": "Tanggal Ketetapan", "required": true, "field_key": "tanggal_dokumen"}, {"type": "date", "label": "Tanggal Gelar Perkara", "field_key": "tanggal_gelar_perkara"}, {"type": "repeater", "label": "Data Tersangka", "required": true, "field_key": "tersangka", "subfields": [{"type": "text", "label": "Nama", "required": true, "field_key": "nama"}, {"type": "text", "label": "NIK", "field_key": "nik"}, {"type": "text", "label": "Tempat Lahir", "field_key": "tempat_lahir"}, {"type": "date", "label": "Tgl Lahir", "field_key": "tgl_lahir"}, {"type": "text", "label": "Alamat", "field_key": "alamat"}]}, {"type": "file", "label": "Lampiran", "lampiran": true, "field_key": "lampiran_dokumen"}]}'::jsonb, true
) on conflict (code) do update set
    nama=excluded.nama, status_prasyarat_id=excluded.status_prasyarat_id,
    status_target_id=excluded.status_target_id, urutan_tahap=excluded.urutan_tahap, form_schema=excluded.form_schema,
    aktif=excluded.aktif, updated_at=now();

insert into bdb_document_type_master (code, nama, status_prasyarat_id, status_target_id, urutan_tahap, form_schema, aktif) values (
    'SPDP', 'Surat Pemberitahuan Dimulainya Penyidikan (SPDP)',
    (select id from bdb_status_master where code='PENYIDIKAN'), (select id from bdb_status_master where code='PENYIDIKAN'), 4,
    '{"fields": [{"type": "text", "label": "Nomor SPDP", "required": true, "field_key": "nomor_dokumen"}, {"type": "date", "label": "Tanggal SPDP", "required": true, "field_key": "tanggal_dokumen"}, {"type": "repeater", "label": "Tersangka", "field_key": "tersangka", "subfields": [{"type": "text", "label": "Nama", "required": true, "field_key": "nama"}, {"type": "text", "label": "NIK", "field_key": "nik"}]}, {"type": "pasal_picker", "label": "Pasal", "source": "inherit:lp_pasal", "field_key": "pasal"}, {"type": "file", "label": "Lampiran", "lampiran": true, "field_key": "lampiran_dokumen"}]}'::jsonb, true
) on conflict (code) do update set
    nama=excluded.nama, status_prasyarat_id=excluded.status_prasyarat_id,
    status_target_id=excluded.status_target_id, urutan_tahap=excluded.urutan_tahap, form_schema=excluded.form_schema,
    aktif=excluded.aktif, updated_at=now();

insert into bdb_document_type_master (code, nama, status_prasyarat_id, status_target_id, urutan_tahap, form_schema, aktif) values (
    'SP3', 'Surat Pemberitahuan Penghentian Penyidikan (SP3)',
    (select id from bdb_status_master where code='PENYIDIKAN'), (select id from bdb_status_master where code='SP3'), 5,
    '{"fields": [{"type": "text", "label": "Nomor Surat", "required": true, "field_key": "nomor_dokumen"}, {"type": "date", "label": "Tanggal Surat", "required": true, "field_key": "tanggal_dokumen"}, {"type": "select", "label": "Alasan Dihentikan", "source": "static", "required": true, "field_key": "alasan_penghentian", "option_groups": [{"items": ["Putusan tetap / Ne Bis in Idem", "Tersangka atau terdakwa meninggal dunia", "Kedaluwarsa", "Amnesti atau abolisi"], "label": "Masuk Kategori \"Demi Hukum\""}, {"items": ["Penyelesaian luar proses peradilan / Restorative Justice", "Ditariknya pengaduan", "Maksimum pidana denda dibayar sukarela", "Tidak terdapat cukup alat bukti", "Peristiwa bukan merupakan tindak pidana"], "label": "Masuk Kategori \"Alasan Utama\""}]}, {"type": "textarea", "label": "Keterangan", "field_key": "keterangan"}, {"type": "file", "label": "Lampiran", "lampiran": true, "field_key": "lampiran_dokumen"}]}'::jsonb, true
) on conflict (code) do update set
    nama=excluded.nama, status_prasyarat_id=excluded.status_prasyarat_id,
    status_target_id=excluded.status_target_id, urutan_tahap=excluded.urutan_tahap, form_schema=excluded.form_schema,
    aktif=excluded.aktif, updated_at=now();

insert into bdb_document_type_master (code, nama, status_prasyarat_id, status_target_id, urutan_tahap, form_schema, aktif) values (
    'TAHAP_1', 'Surat Pengantar Tahap I',
    (select id from bdb_status_master where code='PENYIDIKAN'), (select id from bdb_status_master where code='TAHAP_I'), 6,
    '{"fields": [{"type": "text", "label": "Nomor Pengantar", "required": true, "field_key": "nomor_dokumen"}, {"type": "date", "label": "Tanggal", "required": true, "field_key": "tanggal_dokumen"}, {"type": "text", "label": "Kejaksaan Tujuan", "required": true, "field_key": "kejaksaan_tujuan"}, {"type": "textarea", "label": "Keterangan", "field_key": "keterangan"}, {"type": "file", "label": "Berkas Perkara", "lampiran": true, "field_key": "lampiran_dokumen"}]}'::jsonb, true
) on conflict (code) do update set
    nama=excluded.nama, status_prasyarat_id=excluded.status_prasyarat_id,
    status_target_id=excluded.status_target_id, urutan_tahap=excluded.urutan_tahap, form_schema=excluded.form_schema,
    aktif=excluded.aktif, updated_at=now();

insert into bdb_document_type_master (code, nama, status_prasyarat_id, status_target_id, urutan_tahap, form_schema, aktif) values (
    'TAHAP_2', 'Surat Pengantar Tahap II (Tersangka & Barang Bukti)',
    (select id from bdb_status_master where code='PENYIDIKAN'), (select id from bdb_status_master where code='TAHAP_II'), 7,
    '{"fields": [{"type": "text", "label": "Nomor Pengantar", "required": true, "field_key": "nomor_dokumen"}, {"type": "date", "label": "Tanggal Penyerahan", "required": true, "field_key": "tanggal_dokumen"}, {"type": "text", "label": "Nomor P-21", "field_key": "nomor_p21"}, {"type": "text", "label": "Jaksa Penerima", "field_key": "jaksa_penerima"}, {"type": "repeater", "label": "Daftar Tersangka", "field_key": "tersangka", "subfields": [{"type": "text", "label": "Nama", "required": true, "field_key": "nama"}, {"type": "text", "label": "NIK", "field_key": "nik"}]}, {"type": "repeater", "label": "Daftar Barang Bukti", "field_key": "barang_bukti", "subfields": [{"type": "text", "label": "Jenis", "required": true, "field_key": "jenis"}, {"type": "text", "label": "Jumlah", "field_key": "jumlah"}, {"type": "text", "label": "Keterangan", "field_key": "keterangan"}]}, {"type": "repeater", "label": "Daftar Saksi", "field_key": "saksi", "subfields": [{"type": "text", "label": "Nama", "required": true, "field_key": "nama"}, {"type": "text", "label": "Keterangan", "field_key": "keterangan"}]}, {"type": "file", "label": "Lampiran", "lampiran": true, "field_key": "lampiran_dokumen"}]}'::jsonb, true
) on conflict (code) do update set
    nama=excluded.nama, status_prasyarat_id=excluded.status_prasyarat_id,
    status_target_id=excluded.status_target_id, urutan_tahap=excluded.urutan_tahap, form_schema=excluded.form_schema,
    aktif=excluded.aktif, updated_at=now();

insert into bdb_document_type_master (code, nama, status_prasyarat_id, status_target_id, urutan_tahap, form_schema, aktif) values (
    'P19', 'Surat Pengembalian Berkas untuk Dilengkapi (P-19)',
    (select id from bdb_status_master where code='PENYIDIKAN'), (select id from bdb_status_master where code='P19'), 7,
    '{"fields": [{"type": "text", "label": "Nomor P-19", "required": true, "field_key": "nomor_dokumen"}, {"type": "date", "label": "Tanggal P-19", "required": true, "field_key": "tanggal_dokumen"}, {"type": "textarea", "label": "Petunjuk Jaksa / Kekurangan Berkas", "field_key": "petunjuk"}, {"type": "file", "label": "Lampiran", "lampiran": true, "field_key": "lampiran_dokumen"}]}'::jsonb, true
) on conflict (code) do update set
    nama=excluded.nama, status_prasyarat_id=excluded.status_prasyarat_id,
    status_target_id=excluded.status_target_id, urutan_tahap=excluded.urutan_tahap, form_schema=excluded.form_schema,
    aktif=excluded.aktif, updated_at=now();

insert into bdb_document_type_master (code, nama, status_prasyarat_id, status_target_id, urutan_tahap, form_schema, aktif) values (
    'P21', 'Surat Pemberitahuan Berkas Perkara Lengkap (P-21)',
    (select id from bdb_status_master where code='PENYIDIKAN'), (select id from bdb_status_master where code='P21'), 7,
    '{"fields": [{"type": "text", "label": "Nomor P-21", "required": true, "field_key": "nomor_dokumen"}, {"type": "date", "label": "Tanggal P-21", "required": true, "field_key": "tanggal_dokumen"}, {"type": "textarea", "label": "Keterangan", "field_key": "keterangan"}, {"type": "file", "label": "Lampiran", "lampiran": true, "field_key": "lampiran_dokumen"}]}'::jsonb, true
) on conflict (code) do update set
    nama=excluded.nama, status_prasyarat_id=excluded.status_prasyarat_id,
    status_target_id=excluded.status_target_id, urutan_tahap=excluded.urutan_tahap, form_schema=excluded.form_schema,
    aktif=excluded.aktif, updated_at=now();

-- rantai dokumen_prasyarat (terpisah, sesudah semua kode di atas pasti sudah ada)
update bdb_document_type_master set dokumen_prasyarat_id=(select id from bdb_document_type_master where code='SP_LIDIK'), updated_at=now()
where code='LHP';
update bdb_document_type_master set dokumen_prasyarat_id=(select id from bdb_document_type_master where code='SP_LIDIK'), updated_at=now()
where code='SP2_LIDIK';
update bdb_document_type_master set dokumen_prasyarat_id=(select id from bdb_document_type_master where code='SP_SIDIK'), updated_at=now()
where code='PENETAPAN_TSK';
update bdb_document_type_master set dokumen_prasyarat_id=(select id from bdb_document_type_master where code='SP_SIDIK'), updated_at=now()
where code='SPDP';
update bdb_document_type_master set dokumen_prasyarat_id=(select id from bdb_document_type_master where code='SP_SIDIK'), updated_at=now()
where code='SP3';
update bdb_document_type_master set dokumen_prasyarat_id=(select id from bdb_document_type_master where code='SPDP'), updated_at=now()
where code='TAHAP_1';
update bdb_document_type_master set dokumen_prasyarat_id=(select id from bdb_document_type_master where code='P21'), updated_at=now()
where code='TAHAP_2';
update bdb_document_type_master set dokumen_prasyarat_id=(select id from bdb_document_type_master where code='TAHAP_1'), updated_at=now()
where code='P19';
update bdb_document_type_master set dokumen_prasyarat_id=(select id from bdb_document_type_master where code='TAHAP_1'), updated_at=now()
where code='P21';