-- Pola BEDA dari 079/081/082/083 (yg semua duplikat sesama FUNGSI atau sesama WILAYAH) -- ini
-- duplikat LINTAS TIPE: satu baris "shell" kosong (POLRES/POLSEK hasil DORS_MASTER_BACKFILL, 0
-- anak) ternyata duplikat dari baris LAIN yg SALAH LABEL tipe_satker='FUNGSI' padahal isinya
-- beneran POLRES/POLSEK (py anak Polsek/unit sungguhan, ratusan LP nyantol) -- shell-nya kebentuk
-- krn nama unit dari DORS ("POLRESTABES SURABAYA") tak ketemu tree yg cocok (tree aslinya ke-tag
-- FUNGSI, bukan POLRES, jadi DORS anggap belum ada & bikin baris baru kosong).
--
-- Ditemukan via pemindaian 2 arah (shell POLRES/POLSEK 0-anak vs saudara FUNGSI berisi, dan
-- sebaliknya shell FUNGSI 0-anak vs saudara POLRES/POLSEK berisi) di bawah induk yg sama, cocok kalau
-- nama salah satu (flatten, dibuang spasi/tanda baca) jadi SUBSTRING dari nama satunya. Lokal ketemu
-- PERSIS 4 pasang: POLRESTABES SURABAYA/SEMARANG, POLSEK KASOKANDEL (semua shell POLRES/POLSEK vs
-- saudara FUNGSI berisi), POLSEK KSKP TARAKAN (arah kebalik: shell FUNGSI kosong vs POLSEK asli
-- yg sudah benar tipenya).
--
-- SENGAJA jauh lebih ketat dari 079-083 (pola ini baru & lebih jarang, prioritaskan aman drpd
-- lengkap): CUMA proses pasangan yg baris shell-nya BENAR-BENAR 0 referensi nyata (bukan cuma
-- dors_map alias -- itu dipindah, bukan dihitung sbg referensi penghalang). Kalau ternyata di prod
-- ada shell yg py referensi asli (auth_users/LP/pelimpahan), pasangan itu DILEWATI, bukan dipaksa --
-- lihat WHERE di langkah 3.
--
-- Baris yang DIPERTAHANKAN = yang py anak (unit sungguhan). Kalau tipe-nya kebetulan FUNGSI padahal
-- baris shell yg dihapus tipenya POLRES/POLSEK, tipe_satker baris pemenang DIKOREKSI ikut tipe shell
-- -- INI PENTING: tanpa koreksi ini, node yg sebenarnya POLRES/POLSEK akan terus dianggap FUNGSI
-- selamanya oleh SatkerService.syncPopulasiWilayahDariDors() (query itu match tipe_satker=$1 PERSIS
-- ke level DORS, jadi kalau tetap FUNGSI, Jumlah Penduduk-nya TAK PERNAH ke-sync otomatis walau
-- dors_kode-nya sudah benar).
--
-- Nama tampilan (deskripsi) baris pemenang: DIGANTI ke nama shell HANYA kalau tipe_satker-nya ikut
-- dikoreksi (FUNGSI->POLRES/POLSEK) -- ditemukan lewat review user langsung: utk Surabaya/Semarang/
-- Kasokandel, nama shell ("POLRESTABES SURABAYA" dkk) justru nama WILAYAH yang bersih & benar,
-- sedangkan nama baris FUNGSI-nya nyasar bawa embel2 nama sub-unit ("SAT RES PPA DAN PPO ...") yang
-- sama sekali bukan nama wilayahnya. Kalau tipe TIDAK dikoreksi (baris pemenang sudah dari awal
-- POLRES/POLSEK yg benar, mis. kasus Tarakan -- shell yg dihapus cuma versi FUNGSI nama pendek yg
-- kurang lengkap), nama pemenang TIDAK disentuh -- sudah benar dari awal.
--
-- Sama spt 079-083: murni SQL, tak hardcode id, escape kata sebelum jadi pola regex (aman dari
-- crash), lepas dulu bdb_lp_pelimpahan sebelum delete (FK tanpa ON DELETE SET NULL). Idempotent.
do $$
declare
    v_updated int;
    v_pairs int;
begin
    -- 1) Kandidat shell: satker (tipe apa pun) TANPA anak, dg total referensi nyata NOL (dors_map
    --    alias tak dihitung sbg penghalang -- itu dipindah, bukan diabaikan).
    create temporary table _shell_candidates on commit drop as
    select s.id, s.parent_id, s.deskripsi, s.tipe_satker, s.source,
           upper(regexp_replace(s.deskripsi, '[^A-Za-z0-9]', '', 'g')) as flat
    from bdb_satker s
    where s.is_synthetic = false
      and not exists (select 1 from bdb_satker c where c.parent_id = s.id)
      and (select count(*) from auth_users where scope_satker_id = s.id or requested_scope_satker_id = s.id) = 0
      and (select count(*) from bdb_laporan_polisi where unit_satker_id = s.id) = 0
      and (select count(*) from bdb_laporan_polisi where satker_id = s.id) = 0
      and (select count(*) from bdb_lp_pelimpahan where satker_asal_id = s.id or satker_tujuan_id = s.id) = 0;

    -- 2) Kandidat pemenang: satker LAIN di bawah induk yg sama, PUNYA anak (unit sungguhan), yg
    --    namanya (flatten) MENGANDUNG nama shell sbg substring -- dan tipenya beda dari shell (kalau
    --    tipenya sama & namanya identik persis, itu urusan 079/081, bukan migration ini).
    create temporary table _shell_pair_map on commit drop as
    with winners as (
        select w.id, w.parent_id, w.deskripsi, w.tipe_satker,
               upper(regexp_replace(w.deskripsi, '[^A-Za-z0-9]', '', 'g')) as flat,
               (select count(*) from bdb_satker c where c.parent_id = w.id) as anak
        from bdb_satker w
        where w.is_synthetic = false
    ),
    matched as (
        select sh.id as loser_id, sh.tipe_satker as loser_tipe, sh.deskripsi as loser_nama,
               wi.id as winner_id, wi.tipe_satker as winner_tipe_lama,
               row_number() over (partition by sh.id order by wi.anak desc, wi.id) as rn,
               count(*) over (partition by sh.id) as jumlah_cocok
        from _shell_candidates sh
        join winners wi on wi.parent_id = sh.parent_id and wi.id <> sh.id
            and wi.anak > 0 and length(sh.flat) >= 6
            and wi.flat like '%' || sh.flat || '%'
    )
    select loser_id, winner_id, loser_tipe, loser_nama, winner_tipe_lama,
           case when loser_tipe in ('POLRES','POLSEK') and winner_tipe_lama = 'FUNGSI'
                then loser_tipe else winner_tipe_lama end as winner_tipe_baru
    from matched
    where rn = 1 and jumlah_cocok = 1;

    select count(*) into v_pairs from _shell_pair_map;
    raise notice 'Pasangan duplikat lintas-tipe (shell kosong) ditemukan & diproses: %', v_pairs;
    if v_pairs = 0 then
        return;
    end if;

    -- 3) Alias DORS (satu-satunya referensi yg mungkin nempel di shell -- dipindah, bukan dihitung
    --    penghalang di langkah 1).
    update bdb_dors_satker_map a
    set satker_id = m.winner_id, updated_at = now()
    from _shell_pair_map m
    where a.satker_id = m.loser_id;
    get diagnostics v_updated = row_count;
    raise notice 'bdb_dors_satker_map.satker_id dipindah: %', v_updated;

    -- 4) Jaga-jaga defense-in-depth (audit lokal: shell dijamin 0 di sini krn filter langkah 1, tapi
    --    prod bisa beda -- lihat riwayat sesi ini soal ini) -- tetap pindahkan kalau ada, jangan
    --    andalkan asumsi lokal.
    update bdb_laporan_polisi lp set satker_id = m.winner_id, updated_at = now() from _shell_pair_map m where lp.satker_id = m.loser_id;
    update bdb_laporan_polisi lp set unit_satker_id = m.winner_id, unit_satker_kode = (select kode from bdb_satker where id = m.winner_id), updated_at = now() from _shell_pair_map m where lp.unit_satker_id = m.loser_id;
    update bdb_lp_pelimpahan p set satker_asal_id = m.winner_id from _shell_pair_map m where p.satker_asal_id = m.loser_id;
    update bdb_lp_pelimpahan p set satker_tujuan_id = m.winner_id from _shell_pair_map m where p.satker_tujuan_id = m.loser_id;
    update auth_users u set scope_satker_id = m.winner_id, scope_satker_key = (select kode from bdb_satker where id = m.winner_id) from _shell_pair_map m where u.scope_satker_id = m.loser_id;
    update auth_users u set requested_scope_satker_id = m.winner_id, requested_scope_satker_key = (select kode from bdb_satker where id = m.winner_id) from _shell_pair_map m where u.requested_scope_satker_id = m.loser_id;
    update bdb_satker s set parent_id = m.winner_id from _shell_pair_map m where s.parent_id = m.loser_id;
    update bdb_satker s set root_id = m.winner_id from _shell_pair_map m where s.root_id = m.loser_id;

    -- 5) Koreksi tipe_satker baris pemenang kalau ternyata salah label FUNGSI (lihat catatan panjang
    --    di atas migration ini soal syncPopulasiWilayahDariDors()) -- SEKALIAN ganti nama tampilan
    --    ke nama shell (lebih bersih/benar) HANYA kalau tipe-nya memang dikoreksi.
    update bdb_satker s
    set tipe_satker = m.winner_tipe_baru,
        deskripsi = case when m.winner_tipe_baru is distinct from s.tipe_satker
                         then m.loser_nama else s.deskripsi end,
        updated_at = now()
    from _shell_pair_map m
    where s.id = m.winner_id and s.tipe_satker is distinct from m.winner_tipe_baru;
    get diagnostics v_updated = row_count;
    raise notice 'bdb_satker tipe_satker & nama pemenang dikoreksi: %', v_updated;

    -- 6) Hapus baris shell -- semua referensi (kalaupun ada) sudah dipindah ke pemenang duluan.
    delete from bdb_satker s using _shell_pair_map m where s.id = m.loser_id;
    get diagnostics v_updated = row_count;
    raise notice 'bdb_satker baris shell lintas-tipe dihapus: %', v_updated;
end $$;
