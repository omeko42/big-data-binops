-- 056_sp2_sp3_alasan_kategori.sql
-- SP3 & SP2_LIDIK: "Alasan Dihentikan" diubah dari 3 pilihan datar jadi 2 kategori resmi
-- ("Demi Hukum" & "Alasan Utama") dgn alasan spesifik per kategori -- menggantikan isi dari
-- 030_sp3_sp2_alasan_demi_hukum.sql. Field "Rincian Alasan (Demi Hukum)" dihapus krn sudah
-- tak perlu -- alasan spesifiknya kini langsung terpilih dari dropdown (bukan kategori umum
-- lagi yg butuh rincian teks tambahan).
update bdb_document_type_master set form_schema =
  '{"fields":[
     {"field_key":"nomor_dokumen","label":"Nomor Surat","type":"text","required":true},
     {"field_key":"tanggal_dokumen","label":"Tanggal Surat","type":"date","required":true},
     {"field_key":"alasan_penghentian","label":"Alasan Dihentikan","type":"select","required":true,"source":"static","option_groups":[
        {"label":"Masuk Kategori \"Demi Hukum\"","items":[
           "Putusan tetap / Ne Bis in Idem",
           "Tersangka atau terdakwa meninggal dunia",
           "Kedaluwarsa",
           "Amnesti atau abolisi"
        ]},
        {"label":"Masuk Kategori \"Alasan Utama\"","items":[
           "Penyelesaian luar proses peradilan / Restorative Justice",
           "Ditariknya pengaduan",
           "Maksimum pidana denda dibayar sukarela",
           "Tidak terdapat cukup alat bukti",
           "Peristiwa bukan merupakan tindak pidana"
        ]}
     ]},
     {"field_key":"keterangan","label":"Keterangan","type":"textarea"},
     {"field_key":"lampiran_dokumen","label":"Lampiran","type":"file","lampiran":true}
  ]}'::jsonb, updated_at=now()
where code in ('SP3','SP2_LIDIK');
