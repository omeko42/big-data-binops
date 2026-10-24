-- Lanjutan 083 -- 1 pola singkatan lagi ditemukan lewat review user langsung (screenshot POLDA
-- ACEH): DORS_MASTER_BACKFILL selalu pakai singkatan "DITPOLAIR" (tanpa nama provinsi & tanpa
-- "UD"), sedangkan ROBINOPS selalu pakai "DIT POLAIRUD <PROVINSI>" -- keduanya direktorat yang
-- SAMA (Polisi Perairan dan Udara), cuma beda gaya singkatan, jadi core hasil normalisasi 083
-- ("POLAIR" vs "POLAIRUD") tak pernah cocok persis -- pasangan ini lolos dari 079/081/082/083.
--
-- Diverifikasi menyeluruh sebelum ditulis: pola ini SISTEMIK di HAMPIR SEMUA Polda (29 pasang
-- ditemukan, tersebar di 29 Polda berbeda dari Aceh sampai Papua Barat Daya), SEMUA persis 2 baris
-- per grup (tak ada yg ambigu >2), semua "DITPOLAIR" (DORS) berpasangan dgn "DIT POLAIRUD
-- <PROVINSI>" (ROBINOPS) yg levelnya sama (langsung di bawah Polda yg sama).
--
-- Sama persis desain 083 (satu-satunya beda: 1 baris tambahan menyamakan "POLAIRUD" jadi "POLAIR"
-- SEBELUM final grouping -- substitusi LITERAL TETAP yg dikontrol kode, bukan dari data, jadi tak
-- menambah risiko apa pun thd crash-safety yg sudah diaudit). Lepas dulu bdb_lp_pelimpahan sebelum
-- delete (FK tanpa ON DELETE SET NULL). Skor referensi nyata utk pilih pemenang, cuma proses grup
-- PERSIS 2 baris. Idempotent.
do $$
declare
    v_updated int;
    v_pairs int;
begin
    create temporary table _dup_candidates4 on commit drop as
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
    -- PENTING (beda dari 083): "POLAIRUD" disamakan jadi "POLAIR" -- string TETAP yg dikontrol di
    -- sini (bukan dari data), aman dipakai di replace() literal.
    select id, parent_id, deskripsi, source,
           replace(
               regexp_replace(child_flat, '^(DITRES|DITBIN|DITPAM|SATRES|DIT|SAT|UNIT|RES)', ''),
               'POLAIRUD', 'POLAIR'
           ) as core
    from flat;

    create temporary table _dup_scored4 on commit drop as
    select c.*,
        (select count(*) from auth_users where scope_satker_id = c.id or requested_scope_satker_id = c.id)
        + (select count(*) from bdb_laporan_polisi where unit_satker_id = c.id)
        + (select count(*) from bdb_laporan_polisi where satker_id = c.id)
        + (select count(*) from bdb_dors_satker_map where satker_id = c.id)
        + (select count(*) from bdb_satker where parent_id = c.id)
        + (select count(*) from bdb_lp_pelimpahan where satker_asal_id = c.id or satker_tujuan_id = c.id)
        as total_ref
    from _dup_candidates4 c
    where c.core <> '';

    create temporary table _satker_merge_map4 on commit drop as
    with grp as (
        select parent_id, core, array_agg(id order by total_ref desc, id) as ids
        from _dup_scored4
        group by parent_id, core
        having count(*) = 2
    )
    select
        g.ids[2] as loser_id,
        g.ids[1] as winner_id,
        coalesce(
            (select s.deskripsi from _dup_scored4 s where s.id in (g.ids[1], g.ids[2]) and s.source = 'ROBINOPS' limit 1),
            (select s.deskripsi from _dup_scored4 s where s.id = g.ids[1])
        ) as nama_final
    from grp g;

    select count(*) into v_pairs from _satker_merge_map4;
    raise notice 'Pasangan duplikat FUNGSI (POLAIR/POLAIRUD) ditemukan & diproses: %', v_pairs;
    if v_pairs = 0 then
        return;
    end if;

    update bdb_laporan_polisi lp
    set satker_id = m.winner_id, satker_nama = m.nama_final, updated_at = now()
    from _satker_merge_map4 m
    where lp.satker_id = m.loser_id;
    get diagnostics v_updated = row_count;
    raise notice 'bdb_laporan_polisi.satker_id dipindah: %', v_updated;

    update bdb_laporan_polisi lp
    set unit_satker_id = m.winner_id, unit_satker_nama = m.nama_final,
        unit_satker_kode = (select kode from bdb_satker where id = m.winner_id), updated_at = now()
    from _satker_merge_map4 m
    where lp.unit_satker_id = m.loser_id;
    get diagnostics v_updated = row_count;
    raise notice 'bdb_laporan_polisi.unit_satker_id dipindah: %', v_updated;

    update bdb_dors_satker_map a
    set satker_id = m.winner_id, satker_nama = m.nama_final, updated_at = now()
    from _satker_merge_map4 m
    where a.satker_id = m.loser_id;
    get diagnostics v_updated = row_count;
    raise notice 'bdb_dors_satker_map.satker_id dipindah: %', v_updated;

    update bdb_lp_pelimpahan p set satker_asal_id = m.winner_id from _satker_merge_map4 m where p.satker_asal_id = m.loser_id;
    update bdb_lp_pelimpahan p set satker_tujuan_id = m.winner_id from _satker_merge_map4 m where p.satker_tujuan_id = m.loser_id;

    update auth_users u
    set scope_satker_id = m.winner_id, scope_satker_key = (select kode from bdb_satker where id = m.winner_id)
    from _satker_merge_map4 m
    where u.scope_satker_id = m.loser_id;
    get diagnostics v_updated = row_count;
    raise notice 'auth_users.scope_satker_id dipindah: %', v_updated;

    update auth_users u
    set requested_scope_satker_id = m.winner_id, requested_scope_satker_key = (select kode from bdb_satker where id = m.winner_id)
    from _satker_merge_map4 m
    where u.requested_scope_satker_id = m.loser_id;

    update bdb_satker s set parent_id = m.winner_id from _satker_merge_map4 m where s.parent_id = m.loser_id;
    update bdb_satker s set root_id = m.winner_id from _satker_merge_map4 m where s.root_id = m.loser_id;

    update bdb_satker s
    set deskripsi = m.nama_final, updated_at = now()
    from _satker_merge_map4 m
    where s.id = m.winner_id and s.deskripsi is distinct from m.nama_final;

    delete from bdb_satker s using _satker_merge_map4 m where s.id = m.loser_id;
    get diagnostics v_updated = row_count;
    raise notice 'bdb_satker baris duplikat FUNGSI (POLAIR/POLAIRUD) dihapus: %', v_updated;
end $$;
