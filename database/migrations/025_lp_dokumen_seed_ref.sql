-- 025_lp_dokumen_seed_ref.sql
-- Selaraskan jenis surat dengan referensi "Rincian Surat per Tahapan".
-- status_target_id NULL = surat yang TIDAK mengubah status (mis. LHP, Surat Perintah Tugas).
-- Idempotent (upsert by code). Rantai prasyarat di-set via UPDATE setelah insert.

-- helper: id status by code
-- (subselect langsung dipakai di bawah)

insert into bdb_document_type_master (code, nama, status_prasyarat_id, status_target_id, urutan_tahap, form_schema, aktif) values
 -- ===== PENYELIDIKAN =====
 ('SPT_LIDIK','Surat Perintah Tugas Penyelidikan', null, null, 1,
  '{"fields":[
     {"field_key":"nomor_dokumen","label":"Nomor Surat","type":"text","required":true},
     {"field_key":"tanggal_dokumen","label":"Tanggal Surat","type":"date","required":true},
     {"field_key":"personel","label":"Personel yang Ditugaskan","type":"repeater","subfields":[
        {"field_key":"nama","label":"Nama","type":"text","required":true},
        {"field_key":"pangkat_nrp","label":"Pangkat / NRP","type":"text"},
        {"field_key":"jabatan","label":"Jabatan","type":"text"}]},
     {"field_key":"lampiran_dokumen","label":"Lampiran","type":"file","lampiran":true}
  ]}'::jsonb, true),
 ('SP_LIDIK','Surat Perintah Penyelidikan',
   (select id from bdb_status_master where code='LP'),
   (select id from bdb_status_master where code='PENYELIDIKAN'), 1,
  '{"fields":[
     {"field_key":"nomor_dokumen","label":"Nomor Surat","type":"text","required":true},
     {"field_key":"tanggal_dokumen","label":"Tanggal Surat","type":"date","required":true},
     {"field_key":"personel","label":"Personel Penyelidik","type":"repeater","subfields":[
        {"field_key":"nama","label":"Nama","type":"text","required":true},
        {"field_key":"pangkat_nrp","label":"Pangkat / NRP","type":"text"},
        {"field_key":"jabatan","label":"Jabatan","type":"text"}]},
     {"field_key":"lampiran_dokumen","label":"Lampiran","type":"file","lampiran":true}
  ]}'::jsonb, true),
 ('LHP','Laporan Hasil Penyelidikan (LHP)',
   (select id from bdb_status_master where code='PENYELIDIKAN'), null, 2,
  '{"fields":[
     {"field_key":"nomor_dokumen","label":"Nomor LHP","type":"text","required":true},
     {"field_key":"tanggal_dokumen","label":"Tanggal LHP","type":"date","required":true},
     {"field_key":"kesimpulan","label":"Kesimpulan","type":"textarea"},
     {"field_key":"lampiran_dokumen","label":"Lampiran","type":"file","lampiran":true}
  ]}'::jsonb, true),
 -- ===== PENYIDIKAN =====
 ('SPT_SIDIK','Surat Perintah Tugas Penyidikan', null, null, 3,
  '{"fields":[
     {"field_key":"nomor_dokumen","label":"Nomor Surat","type":"text","required":true},
     {"field_key":"tanggal_dokumen","label":"Tanggal Surat","type":"date","required":true},
     {"field_key":"personel","label":"Personel Penyidik","type":"repeater","subfields":[
        {"field_key":"nama","label":"Nama","type":"text","required":true},
        {"field_key":"pangkat_nrp","label":"Pangkat / NRP","type":"text"},
        {"field_key":"jabatan","label":"Jabatan","type":"text"}]},
     {"field_key":"lampiran_dokumen","label":"Lampiran","type":"file","lampiran":true}
  ]}'::jsonb, true),
 ('SP_SIDIK','Surat Perintah Penyidikan', null,
   (select id from bdb_status_master where code='PENYIDIKAN'), 3,
  '{"fields":[
     {"field_key":"nomor_dokumen","label":"Nomor Surat","type":"text","required":true},
     {"field_key":"tanggal_dokumen","label":"Tanggal Surat","type":"date","required":true},
     {"field_key":"personel","label":"Personel Penyidik","type":"repeater","subfields":[
        {"field_key":"nama","label":"Nama","type":"text","required":true},
        {"field_key":"pangkat_nrp","label":"Pangkat / NRP","type":"text"},
        {"field_key":"jabatan","label":"Jabatan","type":"text"}]},
     {"field_key":"pasal","label":"Pasal yang Disangkakan","type":"pasal_picker","source":"inherit:lp_pasal","required":true},
     {"field_key":"lampiran_dokumen","label":"Lampiran","type":"file","lampiran":true}
  ]}'::jsonb, true),
 ('PENETAPAN_TSK','Surat Ketetapan Penetapan Tersangka',
   (select id from bdb_status_master where code='PENYIDIKAN'), null, 4,
  '{"fields":[
     {"field_key":"nomor_dokumen","label":"Nomor Ketetapan","type":"text","required":true},
     {"field_key":"tanggal_dokumen","label":"Tanggal Ketetapan","type":"date","required":true},
     {"field_key":"tanggal_gelar_perkara","label":"Tanggal Gelar Perkara","type":"date"},
     {"field_key":"tersangka","label":"Data Tersangka","type":"repeater","required":true,"subfields":[
        {"field_key":"nama","label":"Nama","type":"text","required":true},
        {"field_key":"nik","label":"NIK","type":"text"},
        {"field_key":"tempat_lahir","label":"Tempat Lahir","type":"text"},
        {"field_key":"tgl_lahir","label":"Tgl Lahir","type":"date"},
        {"field_key":"alamat","label":"Alamat","type":"text"}]},
     {"field_key":"lampiran_dokumen","label":"Lampiran","type":"file","lampiran":true}
  ]}'::jsonb, true),
 ('SPDP','Surat Pemberitahuan Dimulainya Penyidikan (SPDP)',
   (select id from bdb_status_master where code='PENYIDIKAN'), null, 4,
  '{"fields":[
     {"field_key":"nomor_dokumen","label":"Nomor SPDP","type":"text","required":true},
     {"field_key":"tanggal_dokumen","label":"Tanggal SPDP","type":"date","required":true},
     {"field_key":"tersangka","label":"Tersangka","type":"repeater","subfields":[
        {"field_key":"nama","label":"Nama","type":"text","required":true},
        {"field_key":"nik","label":"NIK","type":"text"}]},
     {"field_key":"pasal","label":"Pasal","type":"pasal_picker","source":"inherit:lp_pasal"},
     {"field_key":"lampiran_dokumen","label":"Lampiran","type":"file","lampiran":true}
  ]}'::jsonb, true),
 -- ===== SP3 =====
 ('SP3','Surat Pemberitahuan Penghentian Penyidikan (SP3)',
   (select id from bdb_status_master where code='PENYIDIKAN'),
   (select id from bdb_status_master where code='SP3'), 5,
  '{"fields":[
     {"field_key":"nomor_dokumen","label":"Nomor Surat","type":"text","required":true},
     {"field_key":"tanggal_dokumen","label":"Tanggal Surat","type":"date","required":true},
     {"field_key":"alasan_penghentian","label":"Alasan Dihentikan","type":"select","required":true,"source":"static","options":["Tidak cukup bukti","Bukan tindak pidana","Demi hukum (nebis in idem/kadaluarsa/tersangka meninggal)"]},
     {"field_key":"keterangan","label":"Keterangan","type":"textarea"},
     {"field_key":"lampiran_dokumen","label":"Lampiran","type":"file","lampiran":true}
  ]}'::jsonb, true),
 -- ===== TAHAP I & II =====
 ('TAHAP_1','Surat Pengantar Tahap I',
   (select id from bdb_status_master where code='PENYIDIKAN'),
   (select id from bdb_status_master where code='TAHAP_I'), 6,
  '{"fields":[
     {"field_key":"nomor_dokumen","label":"Nomor Pengantar","type":"text","required":true},
     {"field_key":"tanggal_dokumen","label":"Tanggal","type":"date","required":true},
     {"field_key":"kejaksaan_tujuan","label":"Kejaksaan Tujuan","type":"text","required":true},
     {"field_key":"keterangan","label":"Keterangan","type":"textarea"},
     {"field_key":"lampiran_dokumen","label":"Berkas Perkara","type":"file","lampiran":true}
  ]}'::jsonb, true),
 ('TAHAP_2','Surat Pengantar Tahap II (Tersangka & Barang Bukti)',
   (select id from bdb_status_master where code='PENYIDIKAN'),
   (select id from bdb_status_master where code='TAHAP_II'), 7,
  '{"fields":[
     {"field_key":"nomor_dokumen","label":"Nomor Pengantar","type":"text","required":true},
     {"field_key":"tanggal_dokumen","label":"Tanggal Penyerahan","type":"date","required":true},
     {"field_key":"nomor_p21","label":"Nomor P-21","type":"text"},
     {"field_key":"jaksa_penerima","label":"Jaksa Penerima","type":"text"},
     {"field_key":"tersangka","label":"Daftar Tersangka","type":"repeater","subfields":[
        {"field_key":"nama","label":"Nama","type":"text","required":true},{"field_key":"nik","label":"NIK","type":"text"}]},
     {"field_key":"barang_bukti","label":"Daftar Barang Bukti","type":"repeater","subfields":[
        {"field_key":"jenis","label":"Jenis","type":"text","required":true},{"field_key":"jumlah","label":"Jumlah","type":"text"},{"field_key":"keterangan","label":"Keterangan","type":"text"}]},
     {"field_key":"saksi","label":"Daftar Saksi","type":"repeater","subfields":[
        {"field_key":"nama","label":"Nama","type":"text","required":true},{"field_key":"keterangan","label":"Keterangan","type":"text"}]},
     {"field_key":"lampiran_dokumen","label":"Lampiran","type":"file","lampiran":true}
  ]}'::jsonb, true)
on conflict (code) do update set
   nama=excluded.nama, status_prasyarat_id=excluded.status_prasyarat_id, status_target_id=excluded.status_target_id,
   urutan_tahap=excluded.urutan_tahap, form_schema=excluded.form_schema, aktif=excluded.aktif, updated_at=now();

-- rantai prasyarat dokumen sesuai referensi
update bdb_document_type_master set dokumen_prasyarat_id=(select id from bdb_document_type_master where code='SP_LIDIK') where code='LHP';
update bdb_document_type_master set dokumen_prasyarat_id=(select id from bdb_document_type_master where code='SP_SIDIK') where code in ('PENETAPAN_TSK','SPDP','SP3');
update bdb_document_type_master set dokumen_prasyarat_id=(select id from bdb_document_type_master where code='SPDP') where code='TAHAP_1';
update bdb_document_type_master set dokumen_prasyarat_id=(select id from bdb_document_type_master where code='TAHAP_1') where code='TAHAP_2';
