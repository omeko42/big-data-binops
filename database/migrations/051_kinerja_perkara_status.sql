-- Tambah breakdown status LP (LIDIK s/d SP3/Tahap II dst) ke snapshot Kinerja Perkara, biar
-- laporan CT/CP/CC/CR/Indeks juga menampilkan rincian status penanganan spt Anev CT/CC.
alter table bdb_kinerja_perkara_snapshot add column if not exists status_code text;
create index if not exists idx_kps_status on bdb_kinerja_perkara_snapshot(status_code);
