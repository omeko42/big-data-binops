-- 029_lp_sp2_lidik.sql
-- SP2_LIDIK: Surat Pemberitahuan Penghentian Penyelidikan (paralel SP3, tapi di tahap PENYELIDIKAN).
-- Isian (form_schema) sama seperti SP3. Mengubah status LP menjadi "Penghentian Penyelidikan".

-- status baru (terminal untuk tahap penyelidikan)
insert into bdb_status_master (code, nama, urutan) values ('SP2_LIDIK','Penghentian Penyelidikan', 7)
on conflict (code) do update set nama=excluded.nama, urutan=excluded.urutan;

insert into bdb_document_type_master (code, nama, status_prasyarat_id, status_target_id, urutan_tahap, form_schema, aktif) values
 ('SP2_LIDIK','Surat Pemberitahuan Penghentian Penyelidikan',
   (select id from bdb_status_master where code='PENYELIDIKAN'),
   (select id from bdb_status_master where code='SP2_LIDIK'), 2,
  '{"fields":[
     {"field_key":"nomor_dokumen","label":"Nomor Surat","type":"text","required":true},
     {"field_key":"tanggal_dokumen","label":"Tanggal Surat","type":"date","required":true},
     {"field_key":"alasan_penghentian","label":"Alasan Dihentikan","type":"select","required":true,"source":"static","options":["Tidak cukup bukti","Bukan tindak pidana","Demi hukum (nebis in idem/kadaluarsa/tersangka meninggal)"]},
     {"field_key":"keterangan","label":"Keterangan","type":"textarea"},
     {"field_key":"lampiran_dokumen","label":"Lampiran","type":"file","lampiran":true}
  ]}'::jsonb, true)
on conflict (code) do update set
   nama=excluded.nama, status_prasyarat_id=excluded.status_prasyarat_id, status_target_id=excluded.status_target_id,
   urutan_tahap=excluded.urutan_tahap, form_schema=excluded.form_schema, aktif=excluded.aktif, updated_at=now();

-- prasyarat: wajib ada Surat Perintah Penyelidikan
update bdb_document_type_master set dokumen_prasyarat_id=(select id from bdb_document_type_master where code='SP_LIDIK') where code='SP2_LIDIK';
