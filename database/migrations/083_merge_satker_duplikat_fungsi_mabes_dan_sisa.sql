-- Lanjutan 079/082 -- 2 celah baru ditemukan saat investigasi pertanyaan user "level Polda aman
-- gak": (1) normalizer 079/082 cuma scan induk bertipe POLDA/POLRES -- padahal beberapa unit FUNGSI
-- (mis. BARESKRIM POLRI, id=13) SENDIRI adalah induk dari FUNGSI lain (Dit Tipidum/Tipidkor/dst di
-- bawahnya) -- tak pernah ke-scan sama sekali oleh migration manapun sebelumnya, padahal ini PERSIS
-- yang muncul di screenshot user PALING AWAL sesi ini ("DIT TIPIDUM BARESKRIM" vs "DITTIPIDUM
-- BARESKRIM POLRI"). (2) cara 079/082 buang nama induk dari nama anak masih terlalu kaku -- treat
-- nama induk sbg SATU BLOK utuh ("POLRES METRO BEKASI KOTA"), jadi kalau anaknya cuma pakai
-- sebagian kata induk (mis. "SAT RESKRIM RESTA BEKASI KOTA" -- tanpa kata "METRO"), whole-block
-- match gagal & pasangannya lolos tak ke-gabung. Migration ini ganti pendekatan: buang kata induk
-- SATU-PER-SATU (bukan satu blok), lebih toleran thd variasi ejaan.
--
-- Diverifikasi menyeluruh sebelum ditulis: dgn pendekatan baru + scope induk FUNGSI, ketemu 13
-- pasang SISA (5 di bawah BARESKRIM POLRI: Tipideksus/Tipidnarkoba/Tipidsiber/Tipidter/Tipidum, 8
-- lainnya tersebar di bawah Polres Metro Bekasi Kota/Cirebon Kota/Pulau Morotai -- yg 082 lewatkan
-- krn alasan (2) di atas). SEMUA persis 2 baris per grup. Cross-check tambahan pakai pg_trgm
-- (similarity nama, bukan cuma exact core) TIDAK menemukan kandidat lain yg masuk akal -- hasil
-- fuzzy lain semua ternyata unit BEDA jenis yg kebetulan mirip teks (mis. "DIT KRIMSUS X" vs "DIT
-- KRIMUM X" -- dua direktorat BEDA, bukan duplikat), jadi SENGAJA tidak diikutkan (exact core match
-- tetap jadi satu-satunya kriteria otomatis -- jangan menebak dari kemiripan teks semata).
--
-- Sama persis desain 079/081/082 (audit crash-safety sudah lolos sesi ini, prinsip sama dipakai
-- lagi di sini): murni SQL, tak hardcode id, kata induk yg dipakai utk strip DIESCAPE dulu jadi
-- literal regex-safe (regexp_replace(w, '([.^$|()\[\]{}*+?\\])', '\\\1', 'g')) SEBELUM dipakai jadi
-- pola pencarian -- sekalipun nama satker mengandung karakter regex-spesial, pola yg terbentuk
-- selalu valid (escape menetralkan artinya jadi literal), jadi tak mungkin lempar "invalid regular
-- expression" & bikin boot API gagal total spt bug asli di 079. Lepas dulu
-- bdb_lp_pelimpahan.dilimpahkan_oleh/satker_asal_id/satker_tujuan_id sebelum delete (FK tanpa ON
-- DELETE SET NULL). Skor referensi nyata utk pilih pemenang, cuma proses grup PERSIS 2 baris.
-- Idempotent -- begitu digabung, jalan lagi tak menemukan pasangan yg sama lagi.
do $$
declare
    v_updated int;
    v_pairs int;
begin
    -- 1) Kandidat: satker FUNGSI di bawah Polda/Polres/FUNGSI (BARESKRIM POLRI dkk termasuk induk
    --    bertipe FUNGSI juga), dinormalisasi: buang kata umum level wilayah dari nama anak, lalu
    --    buang kata2 nama induk SATU PER SATU (bukan satu blok) dari sisa nama anak.
    create temporary table _dup_candidates3 on commit drop as
    with base as (
        select s.id, s.parent_id, s.deskripsi, s.source,
               p.deskripsi as induk_nama
        from bdb_satker s
        join bdb_satker p on p.id = s.parent_id
        where s.is_synthetic = false and s.tipe_satker = 'FUNGSI'
          and p.tipe_satker in ('POLDA', 'POLRES', 'FUNGSI')
    ),
    keyed as (
        select *,
            regexp_replace(upper(deskripsi), '[^A-Z0-9 ]', ' ', 'g') as child_u,
            regexp_replace(upper(induk_nama), '[^A-Z0-9 ]', ' ', 'g') as induk_clean
        from base
    ),
    stripped1 as (
        select *,
            regexp_replace(
                child_u,
                '\yPOLDA\y|\yPOLRESTABES\y|\yPOLRESTA\y|\yPOLRES\y|\yPOLSEK\y|\yRESTABES\y|\yRESTA\y|\yRES\y',
                ' ', 'g'
            ) as child_words_step1
        from keyed
    ),
    -- Pola per baris: gabungan kata2 unik dari nama induk (>=3 huruf, buang kata level wilayah
    -- generik) yg SUDAH DIESCAPE jadi literal regex-safe -- lihat catatan di atas migration ini.
    induk_words as (
        select s.id,
            (select string_agg('\y' || regexp_replace(w, '([.^$|()\[\]{}*+?\\])', '\\\1', 'g') || '\y', '|')
             from unnest(string_to_array(s.induk_clean, ' ')) as w
             where length(w) >= 3 and w not in ('POLDA','POLRES','POLRESTA','POLRESTABES','POLSEK')) as pat
        from stripped1 s
    ),
    stripped2 as (
        select s.*,
            case when iw.pat is not null and iw.pat <> ''
                 then regexp_replace(s.child_words_step1, iw.pat, ' ', 'g')
                 else s.child_words_step1
            end as child_words
        from stripped1 s
        join induk_words iw on iw.id = s.id
    ),
    flat as (
        select *, regexp_replace(child_words, '[^A-Z0-9]', '', 'g') as child_flat
        from stripped2
    )
    select id, parent_id, deskripsi, source,
           regexp_replace(child_flat, '^(DITRES|DITBIN|DITPAM|SATRES|DIT|SAT|UNIT|RES)', '') as core
    from flat;

    -- 2) Skor referensi nyata per baris kandidat -- dihitung ULANG dari data live.
    create temporary table _dup_scored3 on commit drop as
    select c.*,
        (select count(*) from auth_users where scope_satker_id = c.id or requested_scope_satker_id = c.id)
        + (select count(*) from bdb_laporan_polisi where unit_satker_id = c.id)
        + (select count(*) from bdb_laporan_polisi where satker_id = c.id)
        + (select count(*) from bdb_dors_satker_map where satker_id = c.id)
        + (select count(*) from bdb_satker where parent_id = c.id)
        + (select count(*) from bdb_lp_pelimpahan where satker_asal_id = c.id or satker_tujuan_id = c.id)
        as total_ref
    from _dup_candidates3 c
    where c.core <> '';

    -- 3) Grup dgn PERSIS 2 baris = pasangan duplikat yg aman diotomasi.
    create temporary table _satker_merge_map3 on commit drop as
    with grp as (
        select parent_id, core, array_agg(id order by total_ref desc, id) as ids
        from _dup_scored3
        group by parent_id, core
        having count(*) = 2
    )
    select
        g.ids[2] as loser_id,
        g.ids[1] as winner_id,
        coalesce(
            (select s.deskripsi from _dup_scored3 s where s.id in (g.ids[1], g.ids[2]) and s.source = 'ROBINOPS' limit 1),
            (select s.deskripsi from _dup_scored3 s where s.id = g.ids[1])
        ) as nama_final
    from grp g;

    select count(*) into v_pairs from _satker_merge_map3;
    raise notice 'Pasangan duplikat FUNGSI (Mabes & sisa) ditemukan & diproses: %', v_pairs;
    if v_pairs = 0 then
        return;
    end if;

    -- 4) LP yang satker_id-nya langsung ke salah satu baris ganda.
    update bdb_laporan_polisi lp
    set satker_id = m.winner_id, satker_nama = m.nama_final, updated_at = now()
    from _satker_merge_map3 m
    where lp.satker_id = m.loser_id;
    get diagnostics v_updated = row_count;
    raise notice 'bdb_laporan_polisi.satker_id dipindah: %', v_updated;

    -- 5) LP yang unit_satker_id-nya ke salah satu baris ganda.
    update bdb_laporan_polisi lp
    set unit_satker_id = m.winner_id, unit_satker_nama = m.nama_final,
        unit_satker_kode = (select kode from bdb_satker where id = m.winner_id), updated_at = now()
    from _satker_merge_map3 m
    where lp.unit_satker_id = m.loser_id;
    get diagnostics v_updated = row_count;
    raise notice 'bdb_laporan_polisi.unit_satker_id dipindah: %', v_updated;

    -- 6) Alias DORS.
    update bdb_dors_satker_map a
    set satker_id = m.winner_id, satker_nama = m.nama_final, updated_at = now()
    from _satker_merge_map3 m
    where a.satker_id = m.loser_id;
    get diagnostics v_updated = row_count;
    raise notice 'bdb_dors_satker_map.satker_id dipindah: %', v_updated;

    -- 7) Riwayat pelimpahan LP -- satker_asal_id/satker_tujuan_id, NO ACTION (bukan SET NULL) ke
    --    bdb_satker, wajib dipindah dulu sebelum delete.
    update bdb_lp_pelimpahan p set satker_asal_id = m.winner_id from _satker_merge_map3 m where p.satker_asal_id = m.loser_id;
    update bdb_lp_pelimpahan p set satker_tujuan_id = m.winner_id from _satker_merge_map3 m where p.satker_tujuan_id = m.loser_id;

    -- 8) Akun user (admin operator dkk) yang scope-nya ke baris ganda.
    update auth_users u
    set scope_satker_id = m.winner_id, scope_satker_key = (select kode from bdb_satker where id = m.winner_id)
    from _satker_merge_map3 m
    where u.scope_satker_id = m.loser_id;
    get diagnostics v_updated = row_count;
    raise notice 'auth_users.scope_satker_id dipindah: %', v_updated;

    update auth_users u
    set requested_scope_satker_id = m.winner_id, requested_scope_satker_key = (select kode from bdb_satker where id = m.winner_id)
    from _satker_merge_map3 m
    where u.requested_scope_satker_id = m.loser_id;

    -- 9) Anak satker dari baris yang kalah (audit lokal ketemu 0 utk level ini, tapi dijaga utk
    --    keamanan jangka panjang -- data prod bisa beda).
    update bdb_satker s set parent_id = m.winner_id from _satker_merge_map3 m where s.parent_id = m.loser_id;
    update bdb_satker s set root_id = m.winner_id from _satker_merge_map3 m where s.root_id = m.loser_id;

    -- 10) Pastikan baris pemenang pakai nama tampilan final (gaya ROBINOPS).
    update bdb_satker s
    set deskripsi = m.nama_final, updated_at = now()
    from _satker_merge_map3 m
    where s.id = m.winner_id and s.deskripsi is distinct from m.nama_final;

    -- 11) Hapus baris yang kalah -- semua referensi di atas sudah dipindah ke pemenang duluan.
    delete from bdb_satker s using _satker_merge_map3 m where s.id = m.loser_id;
    get diagnostics v_updated = row_count;
    raise notice 'bdb_satker baris duplikat FUNGSI (Mabes & sisa) dihapus: %', v_updated;
end $$;
