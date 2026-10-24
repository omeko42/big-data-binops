-- 031_document_type_kategori.sql
-- Kategori status dokumen: CT (Crime Total) | CC (Crime Clearance).
-- TAHAP_2, SP3, SP2_LIDIK = CC; selain itu = CT.
alter table bdb_document_type_master add column if not exists kategori text not null default 'CT';

update bdb_document_type_master set kategori = 'CC' where code in ('TAHAP_2','SP3','SP2_LIDIK');
update bdb_document_type_master set kategori = 'CT' where code not in ('TAHAP_2','SP3','SP2_LIDIK');
