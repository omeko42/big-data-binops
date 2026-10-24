-- Kolom urutan tampil satker -- sebelumnya Struktur Satker & rekap Kinerja Perkara diurutkan pakai
-- kode_canonical/kode mentah (string compare) -- KEBETULAN sering benar krn Puskarda menomori
-- hierarkis, tapi berantakan tiap ada baris yg kode-nya tak ikut pola bersih (hasil DORS backfill,
-- hasil merge duplikat sesi ini dkk) -- lihat instruksi user: butuh urutan EKSPLISIT, bukan
-- ketebtulan dari string kode.
--
-- Aturan urutan (dari user, bukan tebakan): Bareskrim, Densus 88, Pol Air (Korpolair Baharkam +
-- Dit Polair Baharkam) TETAP DI ATAS semua Polda. Lalu tiap Polda: baris Polda itu sendiri, diikuti
-- FUNGSI (Dit) di bawahnya, diikuti tiap Polres (baris Polres, lalu FUNGSI/Sat di bawahnya, lalu
-- tiap Polsek -- Polsek & anaknya sendiri direkursi sama). Diverifikasi dry-run sebelum ditulis:
-- sample Polda Aceh -> Bareskrim/Densus/Polair, lalu Dit-Dit Aceh, lalu Polresta Banda Aceh + Sat-
-- satnya, lalu Polsek-Polsek-nya, lalu Polres Aceh Besar -- persis urutan yg diminta.
--
-- Revisi (feedback user langsung stlh lihat hasil di UI): urutan ANTAR-Polres di bawah 1 Polda dan
-- ANTAR-Polsek di bawah 1 Polres WAJIB alfabetis nama (A-Z), BUKAN ikut nomor kode Puskarda (kode
-- Puskarda historis tak selalu alfabetis, mis. "POLRESTA BANDA ACEH" bisa bernomor kode duluan
-- padahal scr alfabet ada nama lain yg harusnya duluan) -- Polda sendiri & FUNGSI (Dit/Sat) TETAP
-- ikut kode (di luar cakupan revisi ini, user cuma minta utk level Polres/Polsek).
--
-- Diimplementasi sbg traversal rekursif: tiap level, anak2 satu induk diberi peringkat via
-- row_number() dgn prioritas (case tipe_satker & apakah induknya root) lalu digabung jadi
-- "sortpath" hierarkis (dewey-decimal, di-zero-pad), urutan akhir = row_number() global dari
-- sortpath itu -- 1 nomor urut per baris, konsisten dari akar sampai daun.
--
-- Baris yg parent_id-nya "nyasar" (bug lama, sudah diketahui & didiskusikan terpisah dgn user --
-- Papua Tengah/Intan Jaya/Lalolae yg nempel langsung ke root krn Polda/Polres induknya blm ada di
-- tree) TETAP ikut ditempatkan (supaya tak ada baris yg urutan-nya NULL/hilang), diberi prioritas
-- PALING BELAKANG di level induknya masing2 (kalau di root: sesudah semua Polda; kalau tipe lain
-- tak dikenal: sesudah semua yg dikenal) -- bukan solusi utk bug penempatan itu sendiri (itu
-- keputusan terpisah), cuma jaga urutan tetap deterministik & tak error.
--
-- Idempotent: fungsi murni dari struktur tree saat ini, jalan ulang kapan pun hasilnya sama.
-- PENTING: kalau nanti ada satker baru ditambah/dipindah (via UI, sync DORS, dst), migration ini
-- PERLU dijalankan ulang manual (scripts/bdb/apply-sql-file.js sql/bdb/087_....sql --force) supaya
-- urutan tetap konsisten -- BUKAN otomatis ter-maintain tiap ada perubahan (di luar cakupan
-- permintaan sesi ini, cuma isi kolom + urutan awal).
alter table bdb_satker add column if not exists urutan integer;
create index if not exists bdb_satker_urutan_idx on bdb_satker (urutan);

with recursive tree as (
    select s.id,
        lpad((row_number() over (order by s.kode_canonical))::text, 8, '0') as sortpath
    from bdb_satker s
    where s.is_root = true
    union all
    select c.id,
        t.sortpath || '.' || lpad((
            row_number() over (
                partition by c.parent_id
                order by
                    case
                        when p.is_root and c.tipe_satker = 'FUNGSI' then 0
                        when p.is_root and c.tipe_satker = 'POLDA' then 1
                        when p.is_root then 2
                        when c.tipe_satker = 'FUNGSI' then 0
                        when c.tipe_satker in ('POLRES', 'POLSEK') then 1
                        else 2
                    end,
                    case when p.is_root and c.tipe_satker = 'FUNGSI' then
                        case c.id when 13 then 1 when 4 then 2 when 2 then 3 when 3 then 4 else 5 end
                    else 0 end,
                    -- Polres (di bawah Polda) & Polsek (di bawah Polres) urut ALFABETIS nama --
                    -- selain itu (Polda sendiri, FUNGSI/Dit/Sat) tetap ikut kode_canonical.
                    case when c.tipe_satker in ('POLRES', 'POLSEK') then upper(c.deskripsi) else c.kode_canonical end
            )
        )::text, 8, '0')
    from bdb_satker c
    join tree t on t.id = c.parent_id
    join bdb_satker p on p.id = c.parent_id
),
final as (
    select id, row_number() over (order by sortpath) as urutan_baru
    from tree
)
update bdb_satker s
set urutan = f.urutan_baru
from final f
where s.id = f.id and s.urutan is distinct from f.urutan_baru;
