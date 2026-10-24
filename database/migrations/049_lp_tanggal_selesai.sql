-- Tanggal pasti penyelesaian perkara, dipakai laporan Kinerja Perkara (CT/CP/CC/CR/Indeks)
-- sesuai "Ketentuan Penghitungan CT, CP, CC, CR, dan Indeks" (TW IV 2025). TIDAK di-backfill
-- dari updated_at -- LP lama yang sudah CC sebelum kolom ini ada akan NULL sampai statusnya
-- benar-benar berubah lewat sistem lagi (keputusan sadar, lihat sql/bdb/049 changelog / plan).
alter table bdb_laporan_polisi add column if not exists tanggal_selesai date;
create index if not exists idx_lp_tanggal_selesai on bdb_laporan_polisi(tanggal_selesai);
