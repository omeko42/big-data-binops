-- Klasifikasi wilayah vs fungsi per satker -- dasar hitung Jumlah Penduduk/Crime Rate yang BENAR.
--
-- Masalah sebelumnya: kolom jumlah_penduduk bisa diisi di SATKER MANA PUN (termasuk satker
-- fungsional spt "SAT RESKRIM"/"BAG OPS" yang sama sekali bukan wilayah geografis sendiri), dan
-- rollup (KinerjaPerkaraService.sumLeafPopulation) menjumlah SELURUH subtree tanpa penjagaan --
-- kalau diisi dobel di 2 level (mis. Polda DAN Polres yang sama) atau tersasar di satker
-- fungsional, angka rekap nasional bisa jauh meleset. Solusi: klasifikasi eksplisit per satker
-- (POLDA/POLRES/POLSEK/FUNGSI) dari pola nama, field Jumlah Penduduk cuma aktif di 3 tingkat
-- wilayah, dan rollup diganti algoritma "pakai jumlah anak kalau ada breakdown, fallback ke nilai
-- sendiri kalau tidak ada" (lihat KinerjaPerkaraService) -- sesuai kunci utama: Polsek adalah
-- satuan penduduk asli, Polres = jumlah Polsek-nya, Polda = jumlah Polres-nya, Mabes = jumlah
-- semua Polda.
alter table bdb_satker add column if not exists tipe_satker text not null default 'FUNGSI';
create index if not exists bdb_satker_tipe_idx on bdb_satker (tipe_satker);
do $$ begin
    if not exists (select 1 from pg_constraint where conname = 'chk_satker_tipe') then
        alter table bdb_satker add constraint chk_satker_tipe check (tipe_satker in ('POLDA','POLRES','POLSEK','FUNGSI'));
    end if;
end $$;

-- Backfill 1x dari pola nama yang sudah ada (aman diulang -- cuma menimpa baris yg msh default
-- 'FUNGSI' tapi namanya cocok pola wilayah; baris yg sudah pernah dikoreksi manual superadmin
-- tidak disentuh lagi krn tipe_satker-nya sudah bukan 'FUNGSI' atau sudah sesuai).
update bdb_satker set tipe_satker = 'POLDA'
    where tipe_satker <> 'POLDA' and deskripsi ~* '^POLDA ';
update bdb_satker set tipe_satker = 'POLRES'
    where tipe_satker <> 'POLRES' and deskripsi ~* '^POLRES(TA|TABES)? ';
update bdb_satker set tipe_satker = 'POLSEK'
    where tipe_satker <> 'POLSEK' and deskripsi ~* '^POLSEK(TA)? ';

-- Auto-klasifikasi utk baris BARU ke depan (Tambah Satker manual, sync DORS, migrasi data) --
-- superadmin masih bisa override manual lewat menu Struktur Satker kalau nama tak lazim (trigger
-- cuma jalan di INSERT, tidak pernah menimpa koreksi manual lewat UPDATE).
create or replace function bdb_satker_auto_tipe() returns trigger as $f$
begin
    new.tipe_satker := case
        when new.deskripsi ~* '^POLDA ' then 'POLDA'
        when new.deskripsi ~* '^POLRES(TA|TABES)? ' then 'POLRES'
        when new.deskripsi ~* '^POLSEK(TA)? ' then 'POLSEK'
        else 'FUNGSI'
    end;
    return new;
end;
$f$ language plpgsql;
drop trigger if exists trg_bdb_satker_auto_tipe on bdb_satker;
create trigger trg_bdb_satker_auto_tipe
    before insert on bdb_satker
    for each row execute function bdb_satker_auto_tipe();
