-- 030_sp3_sp2_alasan_demi_hukum.sql
-- SP3 & SP2_LIDIK: bila "Alasan Dihentikan" = "Demi hukum ...", tampilkan input teks rincian alasan (kondisional).
update bdb_document_type_master set form_schema =
  '{"fields":[
     {"field_key":"nomor_dokumen","label":"Nomor Surat","type":"text","required":true},
     {"field_key":"tanggal_dokumen","label":"Tanggal Surat","type":"date","required":true},
     {"field_key":"alasan_penghentian","label":"Alasan Dihentikan","type":"select","required":true,"source":"static","options":["Tidak cukup bukti","Bukan tindak pidana","Demi hukum (nebis in idem/kadaluarsa/tersangka meninggal)"]},
     {"field_key":"alasan_demi_hukum","label":"Rincian Alasan (Demi Hukum)","type":"text","required":true,"visible_if":{"field":"alasan_penghentian","value":"Demi hukum (nebis in idem/kadaluarsa/tersangka meninggal)"}},
     {"field_key":"keterangan","label":"Keterangan","type":"textarea"},
     {"field_key":"lampiran_dokumen","label":"Lampiran","type":"file","lampiran":true}
  ]}'::jsonb, updated_at=now()
where code in ('SP3','SP2_LIDIK');
