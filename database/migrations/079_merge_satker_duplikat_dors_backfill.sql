-- Gabungkan satker FUNGSI (Dit/Sat di bawah Polda/Polres) yang tercatat DOBEL akibat 2 sumber
-- berbeda (ROBINOPS = tree resmi awal, DORS_MASTER_BACKFILL = backfill otomatis saat nama unit
-- dari payload DORS tak persis cocok ke tree ROBINOPS yang sudah ada, mis. "DIT KRIMUM ACEH" vs
-- "DITRESKRIMUM Polda Aceh"). Ditemukan via audit manual (normalisasi nama + banding di bawah
-- induk yang sama), lokal ketemu 150 pasangan.
--
-- PENTING -- migration ini SENGAJA tidak hardcode id satker manapun. id bigserial auto-generated
-- ini SANGAT MUNGKIN beda antara lokal dan prod (riwayat sync/import beda), jadi hardcode id dari
-- hasil audit lokal akan SALAH TOTAL kalau ditempel apa adanya ke prod -- bisa gabung/hapus baris
-- yang sama sekali tak berhubungan. Sebagai gantinya, migration ini MENEMUKAN & MENGHITUNG
-- ulang pasangan duplikatnya sendiri dari data yang benar-benar ada di database tempat dia
-- dijalankan (logika sama yang dipakai saat audit, dituliskan ulang jadi SQL murni di sini).
--
-- Baris yang DIPERTAHANKAN per pasangan = yang referensi nyatanya lebih banyak (user admin
-- operator, LP ter-mapping baik langsung/unit, alias DORS, anak satker, riwayat pelimpahan) --
-- BUKAN selalu sumber yang sama, supaya minim LP/user yang perlu dipindah. Nama tampilan akhir
-- diutamakan dari sisi ROBINOPS (konvensi penamaan tree resmi, tanpa akhiran "Polda X"/"Polres X"
-- yang redundan), meski id yang bertahan kebetulan dari sisi DORS_MASTER_BACKFILL.
--
-- Idempotent: setelah baris duplikatnya digabung, jalan lagi tidak akan menemukan pasangan
-- (butuh PERSIS 2 baris FUNGSI senama di bawah induk yang sama utk dianggap kandidat) -- aman
-- diulang.
do $$
declare
    v_updated int;
    v_pairs int;
begin
    -- 1) Kandidat: satker FUNGSI di bawah Polda/Polres, dinormalisasi (buang kata induk + level
    --    wilayah + non-alfanumerik + awalan DIT/DITRES/SAT/SATRES) jadi "core" nama unitnya.
    create temporary table _dup_candidates on commit drop as
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
            upper(regexp_replace(induk_nama, '^(POLDA|POLRESTABES|POLRESTA|POLRES|POLSEK) +', '')) as induk_region
        from base
    ),
    stripped as (
        select *,
            -- PENTING: pakai replace() (substring LITERAL), BUKAN regexp_replace(), utk buang
            -- induk_region -- string itu berasal dari DATA (nama satker asli), bukan pola tetap
            -- yg dikontrol di sini. Kalau dipakai sbg pola regexp_replace dan datanya kebetulan
            -- mengandung karakter regex-spesial (mis. tanda kurung/titik/plus di nama satker),
            -- regexp_replace akan lempar error sintaks regex -- migration ini jalan otomatis saat
            -- boot (runPendingMigrations()) dan GAGAL = boot API GAGAL TOTAL, bukan cuma migration
            -- ini yg dilewati. replace() tak pernah menafsirkan argumennya sbg pola, jadi aman dari
            -- input apa pun.
            regexp_replace(child_u, '\yPOLDA\y|\yPOLRESTABES\y|\yPOLRESTA\y|\yPOLRES\y|\yPOLSEK\y', ' ', 'g')
                as child_words_step1
        from keyed
    ),
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

    -- 2) Skor referensi nyata per baris kandidat -- dihitung ULANG dari data live di database ini,
    --    bukan angka yang dibawa dari environment lain.
    create temporary table _dup_scored on commit drop as
    select c.*,
        (select count(*) from auth_users where scope_satker_id = c.id or requested_scope_satker_id = c.id)
        + (select count(*) from bdb_laporan_polisi where unit_satker_id = c.id)
        + (select count(*) from bdb_laporan_polisi where satker_id = c.id)
        + (select count(*) from bdb_dors_satker_map where satker_id = c.id)
        + (select count(*) from bdb_satker where parent_id = c.id)
        + (select count(*) from bdb_lp_pelimpahan where satker_asal_id = c.id or satker_tujuan_id = c.id)
        as total_ref
    from _dup_candidates c
    where c.core <> '';

    -- 3) Grup dgn PERSIS 2 baris = pasangan duplikat yg aman diotomasi. Grup dgn jumlah lain
    --    (0 kandidat cocok, atau kebetulan >2) SENGAJA dilewati -- jangan menebak, biar aman.
    create temporary table _satker_merge_map on commit drop as
    with grp as (
        select parent_id, core, array_agg(id order by total_ref desc, id) as ids
        from _dup_scored
        group by parent_id, core
        having count(*) = 2
    )
    select
        g.ids[2] as loser_id,
        g.ids[1] as winner_id,
        coalesce(
            (select s.deskripsi from _dup_scored s where s.id in (g.ids[1], g.ids[2]) and s.source = 'ROBINOPS' limit 1),
            (select s.deskripsi from _dup_scored s where s.id = g.ids[1])
        ) as nama_final
    from grp g;

    select count(*) into v_pairs from _satker_merge_map;
    raise notice 'Pasangan duplikat ditemukan & diproses di database ini: %', v_pairs;
    if v_pairs = 0 then
        return;
    end if;

    -- 4) LP yang satker_id-nya (level Polda/Polres/Polsek si LP) langsung ke salah satu baris ganda.
    update bdb_laporan_polisi lp
    set satker_id = m.winner_id, satker_nama = m.nama_final, updated_at = now()
    from _satker_merge_map m
    where lp.satker_id = m.loser_id;
    get diagnostics v_updated = row_count;
    raise notice 'bdb_laporan_polisi.satker_id dipindah: %', v_updated;

    -- 5) LP yang unit_satker_id-nya (unit spesifik, DIT/SAT) ke salah satu baris ganda.
    update bdb_laporan_polisi lp
    set unit_satker_id = m.winner_id, unit_satker_nama = m.nama_final,
        unit_satker_kode = (select kode from bdb_satker where id = m.winner_id), updated_at = now()
    from _satker_merge_map m
    where lp.unit_satker_id = m.loser_id;
    get diagnostics v_updated = row_count;
    raise notice 'bdb_laporan_polisi.unit_satker_id dipindah: %', v_updated;

    -- 6) Alias DORS (bdb_dors_satker_map) -- supaya sync berikutnya tetap konsisten ke pemenang.
    update bdb_dors_satker_map a
    set satker_id = m.winner_id, satker_nama = m.nama_final, updated_at = now()
    from _satker_merge_map m
    where a.satker_id = m.loser_id;
    get diagnostics v_updated = row_count;
    raise notice 'bdb_dors_satker_map.satker_id dipindah: %', v_updated;

    -- 7) Riwayat pelimpahan LP (asal/tujuan).
    update bdb_lp_pelimpahan p set satker_asal_id = m.winner_id from _satker_merge_map m where p.satker_asal_id = m.loser_id;
    update bdb_lp_pelimpahan p set satker_tujuan_id = m.winner_id from _satker_merge_map m where p.satker_tujuan_id = m.loser_id;

    -- 8) Akun user (admin operator dkk) yang scope-nya ke baris ganda -- kolom ini TIDAK ada FK
    --    constraint di DB (dicek app-level lewat resolveScope()), jadi wajib disamakan manual di
    --    sini supaya operator yang sudah login tidak tiba-tiba kehilangan akses satkernya sendiri.
    update auth_users u
    set scope_satker_id = m.winner_id, scope_satker_key = (select kode from bdb_satker where id = m.winner_id)
    from _satker_merge_map m
    where u.scope_satker_id = m.loser_id;
    get diagnostics v_updated = row_count;
    raise notice 'auth_users.scope_satker_id dipindah: %', v_updated;

    update auth_users u
    set requested_scope_satker_id = m.winner_id, requested_scope_satker_key = (select kode from bdb_satker where id = m.winner_id)
    from _satker_merge_map m
    where u.requested_scope_satker_id = m.loser_id;

    -- 9) Kalau baris yang dihapus kebetulan punya anak sendiri (audit lokal ketemu 0, tapi dijaga
    --    utk keamanan jangka panjang -- data prod bisa beda).
    update bdb_satker s set parent_id = m.winner_id from _satker_merge_map m where s.parent_id = m.loser_id;
    update bdb_satker s set root_id = m.winner_id from _satker_merge_map m where s.root_id = m.loser_id;

    -- 10) Pastikan baris pemenang pakai nama tampilan final (bisa dari sisi ROBINOPS meski id yang
    --     menang dari DORS_MASTER_BACKFILL).
    update bdb_satker s
    set deskripsi = m.nama_final, updated_at = now()
    from _satker_merge_map m
    where s.id = m.winner_id and s.deskripsi is distinct from m.nama_final;

    -- 11) Hapus baris yang kalah -- semua referensi di atas sudah dipindah ke pemenang duluan.
    delete from bdb_satker s using _satker_merge_map m where s.id = m.loser_id;
    get diagnostics v_updated = row_count;
    raise notice 'bdb_satker baris duplikat dihapus: %', v_updated;
end $$;
