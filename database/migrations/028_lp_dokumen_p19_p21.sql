-- 028_lp_dokumen_p19_p21.sql
-- Tambah jenis surat P-19 (berkas belum lengkap) & P-21 (berkas dinyatakan lengkap).
-- Keduanya TIDAK mengubah status (status_target null); prasyarat: wajib ada Surat Pengantar Tahap I (TAHAP_1).
-- Alur: Tahap 1 dikirim -> jaksa nilai -> P19 (kembalikan utk dilengkapi) ATAU P21 (lengkap) -> P21 jadi syarat Tahap 2.

insert into bdb_document_type_master (code, nama, status_prasyarat_id, status_target_id, urutan_tahap, form_schema, aktif) values
 ('P19','Surat Pengembalian Berkas untuk Dilengkapi (P-19)',
   (select id from bdb_status_master where code='PENYIDIKAN'), null, 7,
  '{"fields":[
     {"field_key":"nomor_dokumen","label":"Nomor P-19","type":"text","required":true},
     {"field_key":"tanggal_dokumen","label":"Tanggal P-19","type":"date","required":true},
     {"field_key":"petunjuk","label":"Petunjuk Jaksa / Kekurangan Berkas","type":"textarea"},
     {"field_key":"lampiran_dokumen","label":"Lampiran","type":"file","lampiran":true}
  ]}'::jsonb, true),
 ('P21','Surat Pemberitahuan Berkas Perkara Lengkap (P-21)',
   (select id from bdb_status_master where code='PENYIDIKAN'), null, 7,
  '{"fields":[
     {"field_key":"nomor_dokumen","label":"Nomor P-21","type":"text","required":true},
     {"field_key":"tanggal_dokumen","label":"Tanggal P-21","type":"date","required":true},
     {"field_key":"keterangan","label":"Keterangan","type":"textarea"},
     {"field_key":"lampiran_dokumen","label":"Lampiran","type":"file","lampiran":true}
  ]}'::jsonb, true)
on conflict (code) do update set
   nama=excluded.nama, status_prasyarat_id=excluded.status_prasyarat_id, status_target_id=excluded.status_target_id,
   urutan_tahap=excluded.urutan_tahap, form_schema=excluded.form_schema, aktif=excluded.aktif, updated_at=now();

-- rantai prasyarat dokumen (UPDATE agar bisa merujuk baris yang baru di-insert)
update bdb_document_type_master set dokumen_prasyarat_id=(select id from bdb_document_type_master where code='TAHAP_1') where code in ('P19','P21');
-- Tahap 2 kini wajib ada P21 (bukan Tahap 1 langsung)
update bdb_document_type_master set dokumen_prasyarat_id=(select id from bdb_document_type_master where code='P21') where code='TAHAP_2';
