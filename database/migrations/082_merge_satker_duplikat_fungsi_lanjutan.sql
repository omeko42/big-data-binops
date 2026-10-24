-- Lanjutan 079 -- normalizer di 079 TERLALU SEMPIT: cuma buang awalan "POLDA/POLRESTABES/
-- POLRESTA/POLRES/POLSEK" kalau muncul UTUH (mis. "DITRESKRIMUM Polda Aceh"), tapi banyak nama
-- ROBINOPS pakai singkatan LEPAS "RES"/"RESTA"/"RESTABES" TANPA "POL" di depannya (mis. "SAT
-- RESKRIM RES PIDIE", "SAT RESKRIM RESTA BANDA ACEH") -- kata "RES"/"RESTA" itu tak pernah
-- dibuang, jadi core-nya beda dgn versi DORS_MASTER_BACKFILL ("SATRESKRIM POLRES PIDIE") padahal
-- unitnya SAMA. Ditemukan user via screenshot nyata (POLRESTA BANDA ACEH, POLRES PIDIE) --
-- SATRESKRIM/SATRESNARKOBA/SATLANTAS gaya DORS_MASTER_BACKFILL vs SAT RESKRIM RES.../SAT
-- NARKOBA RES.../SAT LANTAS RES... gaya ROBINOPS, sama sekali tak ketangkep 079.
--
-- Diverifikasi menyeluruh sebelum migration ini ditulis: 1.275 pasangan tambahan (2.550 baris),
-- SEMUA persis 2 baris per grup (tak ada yg >2, aman), 3 jenis unit dominan (KRIM/LANTAS/NARKOBA
-- = 1.268 dari 1.275), sisanya (7 pasang) cuma beda krn nama wilayah berhubung tanda pisah
-- ("BAU-BAU"/"FAK-FAK"/"PARE-PARE") -- migration ini SEKALIAN normalisasi tanda pisah spy core
-- lebih bersih & tak bergantung kebetulan simetris spt di 079. Level Polsek SUDAH dicek terpisah
-- (0 baris DORS_MASTER_BACKFILL di bawah Polsek manapun -- tak ada yg perlu digabung di situ).
--
-- Sama persis desain 079/081 (sudah lolos audit crash-safety sesi ini): murni SQL, tak hardcode
-- id, replace() BUKAN regexp_replace() utk substring yg berasal dari data (induk_region), lepas
-- dulu bdb_lp_pelimpahan.dilimpahkan_oleh/satker_asal_id/satker_tujuan_id sebelum delete (FK
-- tanpa ON DELETE SET NULL), skor referensi nyata utk pilih pemenang, cuma proses grup PERSIS 2
-- baris. Idempotent.
do $$
declare
    v_updated int;
    v_pairs int;
begin
    -- 1) Kandidat: satker FUNGSI di bawah Polda/Polres, dinormalisasi LEBIH LENGKAP dari 079 --
    --    tambahan: strip kata lepas RESTABES/RESTA/RES (bukan cuma yg nempel "POL"), dan
    --    normalisasi tanda pisah (-) jadi spasi di INDUK juga (bukan cuma di anak) spy substring
    --    match konsisten.
    create temporary table _dup_candidates2 on commit drop as
    with base as (
        select s.id, s.parent_id, s.deskripsi, s.source,
               p.deskripsi as induk_nama
        from bdb_satker s
        join bdb_satker p on p.id = s.parent_id
        where s.is_synthetic = false and s.tipe_satker = 'FUNGSI'
          and p.tipe_satker in ('POLDA', 'POLRES')
    ),
    keyed as (
        select *,
            regexp_replace(upper(deskripsi), '[^A-Z0-9 ]', ' ', 'g') as child_u,
            upper(regexp_replace(regexp_replace(induk_nama, '[^A-Za-z0-9 ]', ' ', 'g'), '^(POLDA|POLRESTABES|POLRESTA|POLRES|POLSEK) +', '')) as induk_region
        from base
    ),
    stripped as (
        select *,
            regexp_replace(
                child_u,
                '\yPOLDA\y|\yPOLRESTABES\y|\yPOLRESTA\y|\yPOLRES\y|\yPOLSEK\y|\yRESTABES\y|\yRESTA\y|\yRES\y',
                ' ', 'g'
            ) as child_words_step1
        from keyed
    ),
    -- PENTING (sama spt fix 079): replace() literal, BUKAN regexp_replace() -- induk_region
    -- berasal dari DATA (nama satker), bukan pola tetap. Kalau dipakai sbg pola regex dan
    -- kebetulan ada karakter regex-spesial di nama satker, bisa lempar error & bikin boot API
    -- gagal total (lihat riwayat bug persis ini di 079, sudah dibuktikan & diperbaiki).
    stripped2 as (
        select *, replace(child_words_step1, induk_region, ' ') as child_words
        from stripped
    ),
    flat as (
        select *, regexp_replace(child_words, '[^A-Z0-9]', '', 'g') as child_flat
        from stripped2
    )
    select id, parent_id, deskripsi, source,
           regexp_replace(child_flat, '^(DITRES|DITBIN|DITPAM|SATRES|DIT|SAT|UNIT|RES)', '') as core
    from flat;

    -- 2) Skor referensi nyata per baris kandidat -- dihitung ULANG dari data live.
    create temporary table _dup_scored2 on commit drop as
    select c.*,
        (select count(*) from auth_users where scope_satker_id = c.id or requested_scope_satker_id = c.id)
        + (select count(*) from bdb_laporan_polisi where unit_satker_id = c.id)
        + (select count(*) from bdb_laporan_polisi where satker_id = c.id)
        + (select count(*) from bdb_dors_satker_map where satker_id = c.id)
        + (select count(*) from bdb_satker where parent_id = c.id)
        + (select count(*) from bdb_lp_pelimpahan where satker_asal_id = c.id or satker_tujuan_id = c.id)
        as total_ref
    from _dup_candidates2 c
    where c.core <> '';

    -- 3) Grup dgn PERSIS 2 baris = pasangan duplikat yg aman diotomasi.
    create temporary table _satker_merge_map2 on commit drop as
    with grp as (
        select parent_id, core, array_agg(id order by total_ref desc, id) as ids
        from _dup_scored2
        group by parent_id, core
        having count(*) = 2
    )
    select
        g.ids[2] as loser_id,
        g.ids[1] as winner_id,
        coalesce(
            (select s.deskripsi from _dup_scored2 s where s.id in (g.ids[1], g.ids[2]) and s.source = 'ROBINOPS' limit 1),
            (select s.deskripsi from _dup_scored2 s where s.id = g.ids[1])
        ) as nama_final
    from grp g;

    select count(*) into v_pairs from _satker_merge_map2;
    raise notice 'Pasangan duplikat FUNGSI (lanjutan) ditemukan & diproses: %', v_pairs;
    if v_pairs = 0 then
        return;
    end if;

    -- 4) LP yang satker_id-nya langsung ke salah satu baris ganda.
    update bdb_laporan_polisi lp
    set satker_id = m.winner_id, satker_nama = m.nama_final, updated_at = now()
    from _satker_merge_map2 m
    where lp.satker_id = m.loser_id;
    get diagnostics v_updated = row_count;
    raise notice 'bdb_laporan_polisi.satker_id dipindah: %', v_updated;

    -- 5) LP yang unit_satker_id-nya ke salah satu baris ganda.
    update bdb_laporan_polisi lp
    set unit_satker_id = m.winner_id, unit_satker_nama = m.nama_final,
        unit_satker_kode = (select kode from bdb_satker where id = m.winner_id), updated_at = now()
    from _satker_merge_map2 m
    where lp.unit_satker_id = m.loser_id;
    get diagnostics v_updated = row_count;
    raise notice 'bdb_laporan_polisi.unit_satker_id dipindah: %', v_updated;

    -- 6) Alias DORS.
    update bdb_dors_satker_map a
    set satker_id = m.winner_id, satker_nama = m.nama_final, updated_at = now()
    from _satker_merge_map2 m
    where a.satker_id = m.loser_id;
    get diagnostics v_updated = row_count;
    raise notice 'bdb_dors_satker_map.satker_id dipindah: %', v_updated;

    -- 7) Riwayat pelimpahan LP -- LEPAS dulu dilimpahkan_oleh yg kebetulan menunjuk ke user yg
    --    scope_satker_id-nya salah satu baris ganda TIDAK relevan di sini (itu soal user, bukan
    --    satker) -- yang relevan di migration ini: satker_asal_id/satker_tujuan_id, keduanya
    --    NO ACTION (bukan SET NULL) ke bdb_satker, jadi WAJIB dipindah dulu sebelum delete.
    update bdb_lp_pelimpahan p set satker_asal_id = m.winner_id from _satker_merge_map2 m where p.satker_asal_id = m.loser_id;
    update bdb_lp_pelimpahan p set satker_tujuan_id = m.winner_id from _satker_merge_map2 m where p.satker_tujuan_id = m.loser_id;

    -- 8) Akun user (admin operator dkk) yang scope-nya ke baris ganda.
    update auth_users u
    set scope_satker_id = m.winner_id, scope_satker_key = (select kode from bdb_satker where id = m.winner_id)
    from _satker_merge_map2 m
    where u.scope_satker_id = m.loser_id;
    get diagnostics v_updated = row_count;
    raise notice 'auth_users.scope_satker_id dipindah: %', v_updated;

    update auth_users u
    set requested_scope_satker_id = m.winner_id, requested_scope_satker_key = (select kode from bdb_satker where id = m.winner_id)
    from _satker_merge_map2 m
    where u.requested_scope_satker_id = m.loser_id;

    -- 9) Anak satker dari baris yang kalah (audit lokal ketemu 0 utk level ini, tapi dijaga utk
    --    keamanan jangka panjang -- data prod bisa beda).
    update bdb_satker s set parent_id = m.winner_id from _satker_merge_map2 m where s.parent_id = m.loser_id;
    update bdb_satker s set root_id = m.winner_id from _satker_merge_map2 m where s.root_id = m.loser_id;

    -- 10) Pastikan baris pemenang pakai nama tampilan final (gaya ROBINOPS).
    update bdb_satker s
    set deskripsi = m.nama_final, updated_at = now()
    from _satker_merge_map2 m
    where s.id = m.winner_id and s.deskripsi is distinct from m.nama_final;

    -- 11) Hapus baris yang kalah -- semua referensi di atas sudah dipindah ke pemenang duluan.
    delete from bdb_satker s using _satker_merge_map2 m where s.id = m.loser_id;
    get diagnostics v_updated = row_count;
    raise notice 'bdb_satker baris duplikat FUNGSI (lanjutan) dihapus: %', v_updated;
end $$;
