-- 032_status_kategori.sql — Kategori CT/CC menginduk pada STATUS (bukan jenis surat).
-- CC (Crime Clearance) = status penyelesaian: SP3, Penghentian Penyelidikan (SP2), Tahap II (penyerahan).
alter table bdb_status_master add column if not exists kategori text not null default 'CT';
update bdb_status_master set kategori='CC' where code in ('SP3','SP2_LIDIK','SP2_LID','TAHAP_II');
update bdb_status_master set kategori='CT' where code not in ('SP3','SP2_LIDIK','SP2_LID','TAHAP_II');
-- kategori tidak lagi di jenis surat (dipindah ke status)
alter table bdb_document_type_master drop column if exists kategori;
