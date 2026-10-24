-- Sama seperti 079 (gabung satker duplikat DORS_MASTER_BACKFILL vs ROBINOPS), tapi utk level
-- WILAYAH (Polres/Polsek itu sendiri, bukan unit FUNGSI di bawahnya) -- pola beda-nya cuma spasi
-- pada ejaan nama wilayah (mis. "POLSEK SAPTO SARI" vs "POLSEK SAPTOSARI", "POLRES BANJAR BARU"
-- vs "POLRES BANJARBARU"), bukan awalan DIT/DITRES/SAT/SATRES spt di 079. "Kalau Polda-nya masih
-- sama, treatment-nya sama" -- ini level lebih dalam dari Polda (Polres/Polsek), logika gabung
-- yang sama tetap berlaku: baris dgn referensi nyata lebih banyak dipertahankan, sisanya
-- dipindah, nama tampilan dipertahankan gaya ROBINOPS.
--
-- PENTING beda dari 079: level ini SERING py data lokasi/wilayah sendiri (jumlah_penduduk --
-- dasar hitung Crime Rate, alamat, provinsi/kabupaten/kecamatan/desa, koordinat, dors_kode dkk)
-- yang bisa jadi TERISI di baris yang kalah tapi KOSONG di baris pemenang (lokal: 56 dari 106
-- pasang py jumlah_penduduk di sisi DORS_MASTER_BACKFILL, 0 di sisi ROBINOPS-nya) -- kalau cuma
-- dihapus apa adanya spt 079, data itu HILANG. Migration ini WAJIB salin field2 itu dari yang
-- kalah ke yang menang SEBELUM dihapus, kalau punya pemenang masih kosong.
--
-- Sama seperti 079: murni SQL, tak hardcode id manapun, temukan & hitung ulang pasangannya
-- sendiri dari data live di database tempat dia jalan. Idempotent.
do $$
declare
    v_updated int;
    v_pairs int;
begin
    -- 1) Kandidat: satker WILAYAH (Polres/Polsek) yang namanya (dibuang spasi/tanda baca) sama
    --    persis dgn baris lain di bawah induk yang sama.
    create temporary table _dup_wilayah_candidates on commit drop as
    select s.id, s.parent_id, s.deskripsi, s.source,
           upper(regexp_replace(s.deskripsi, '[^A-Za-z0-9]', '', 'g')) as key
    from bdb_satker s
    join bdb_satker p on p.id = s.parent_id
    where s.is_synthetic = false and s.tipe_satker in ('POLRES', 'POLSEK')
      and p.tipe_satker in ('POLDA', 'POLRES');

    -- 2) Skor referensi nyata per baris kandidat -- dihitung ULANG dari data live.
    create temporary table _dup_wilayah_scored on commit drop as
    select c.*,
        (select count(*) from auth_users where scope_satker_id = c.id or requested_scope_satker_id = c.id)
        + (select count(*) from bdb_laporan_polisi where unit_satker_id = c.id)
        + (select count(*) from bdb_laporan_polisi where satker_id = c.id)
        + (select count(*) from bdb_dors_satker_map where satker_id = c.id)
        + (select count(*) from bdb_satker where parent_id = c.id)
        + (select count(*) from bdb_lp_pelimpahan where satker_asal_id = c.id or satker_tujuan_id = c.id)
        as total_ref
    from _dup_wilayah_candidates c
    where c.key <> '';

    -- 3) Grup dgn PERSIS 2 baris = pasangan duplikat yang aman diotomasi.
    create temporary table _satker_wilayah_merge_map on commit drop as
    with grp as (
        select parent_id, key, array_agg(id order by total_ref desc, id) as ids
        from _dup_wilayah_scored
        group by parent_id, key
        having count(*) = 2
    )
    select
        g.ids[2] as loser_id,
        g.ids[1] as winner_id,
        coalesce(
            (select s.deskripsi from _dup_wilayah_scored s where s.id in (g.ids[1], g.ids[2]) and s.source = 'ROBINOPS' limit 1),
            (select s.deskripsi from _dup_wilayah_scored s where s.id = g.ids[1])
        ) as nama_final
    from grp g;

    select count(*) into v_pairs from _satker_wilayah_merge_map;
    raise notice 'Pasangan duplikat WILAYAH ditemukan & diproses: %', v_pairs;
    if v_pairs = 0 then
        return;
    end if;

    -- 4) Selamatkan data lokasi/wilayah yang cuma terisi di baris yang kalah -- SEBELUM baris itu
    --    dihapus. coalesce: pertahankan nilai pemenang kalau sudah terisi, isi dari yang kalah
    --    HANYA kalau pemenang masih kosong.
    update bdb_satker w
    set alamat = coalesce(nullif(w.alamat, ''), l.alamat),
        provinsi = coalesce(nullif(w.provinsi, ''), l.provinsi),
        kabupaten_kota = coalesce(nullif(w.kabupaten_kota, ''), l.kabupaten_kota),
        kecamatan = coalesce(nullif(w.kecamatan, ''), l.kecamatan),
        desa = coalesce(nullif(w.desa, ''), l.desa),
        kode_pos = coalesce(nullif(w.kode_pos, ''), l.kode_pos),
        longitude = coalesce(nullif(w.longitude, ''), l.longitude),
        latitude = coalesce(nullif(w.latitude, ''), l.latitude),
        jumlah_penduduk = coalesce(nullif(w.jumlah_penduduk, ''), l.jumlah_penduduk),
        dors_kode = coalesce(nullif(w.dors_kode, ''), l.dors_kode),
        dors_satker_id = coalesce(nullif(w.dors_satker_id, ''), l.dors_satker_id),
        nama_satker_dors = coalesce(nullif(w.nama_satker_dors, ''), l.nama_satker_dors),
        sub_domain = coalesce(nullif(w.sub_domain, ''), l.sub_domain),
        operational_role = coalesce(nullif(w.operational_role, ''), l.operational_role),
        dors_status = coalesce(nullif(w.dors_status, ''), l.dors_status),
        updated_at = now()
    from _satker_wilayah_merge_map m
    join bdb_satker l on l.id = m.loser_id
    where w.id = m.winner_id;
    get diagnostics v_updated = row_count;
    raise notice 'bdb_satker (pemenang) diisi data lokasi/wilayah dari yang kalah kalau kosong: %', v_updated;

    -- 5) LP yang satker_id-nya langsung ke salah satu baris ganda.
    update bdb_laporan_polisi lp
    set satker_id = m.winner_id, satker_nama = m.nama_final, updated_at = now()
    from _satker_wilayah_merge_map m
    where lp.satker_id = m.loser_id;
    get diagnostics v_updated = row_count;
    raise notice 'bdb_laporan_polisi.satker_id dipindah: %', v_updated;

    -- 6) LP yang unit_satker_id-nya ke salah satu baris ganda.
    update bdb_laporan_polisi lp
    set unit_satker_id = m.winner_id, unit_satker_nama = m.nama_final,
        unit_satker_kode = (select kode from bdb_satker where id = m.winner_id), updated_at = now()
    from _satker_wilayah_merge_map m
    where lp.unit_satker_id = m.loser_id;
    get diagnostics v_updated = row_count;
    raise notice 'bdb_laporan_polisi.unit_satker_id dipindah: %', v_updated;

    -- 7) Alias DORS.
    update bdb_dors_satker_map a
    set satker_id = m.winner_id, satker_nama = m.nama_final, updated_at = now()
    from _satker_wilayah_merge_map m
    where a.satker_id = m.loser_id;
    get diagnostics v_updated = row_count;
    raise notice 'bdb_dors_satker_map.satker_id dipindah: %', v_updated;

    -- 8) Riwayat pelimpahan LP (asal/tujuan).
    update bdb_lp_pelimpahan p set satker_asal_id = m.winner_id from _satker_wilayah_merge_map m where p.satker_asal_id = m.loser_id;
    update bdb_lp_pelimpahan p set satker_tujuan_id = m.winner_id from _satker_wilayah_merge_map m where p.satker_tujuan_id = m.loser_id;

    -- 9) Akun user (admin operator dkk) yang scope-nya ke baris ganda.
    update auth_users u
    set scope_satker_id = m.winner_id, scope_satker_key = (select kode from bdb_satker where id = m.winner_id)
    from _satker_wilayah_merge_map m
    where u.scope_satker_id = m.loser_id;
    get diagnostics v_updated = row_count;
    raise notice 'auth_users.scope_satker_id dipindah: %', v_updated;

    update auth_users u
    set requested_scope_satker_id = m.winner_id, requested_scope_satker_key = (select kode from bdb_satker where id = m.winner_id)
    from _satker_wilayah_merge_map m
    where u.requested_scope_satker_id = m.loser_id;

    -- 10) Anak satker dari baris yang kalah (level ini SERING punya anak -- FUNGSI di bawah
    --     Polres/Polsek) -- pindahkan ke pemenang, jangan ikut hilang.
    update bdb_satker s set parent_id = m.winner_id from _satker_wilayah_merge_map m where s.parent_id = m.loser_id;
    get diagnostics v_updated = row_count;
    raise notice 'bdb_satker (anak dari yang kalah) dipindah ke pemenang: %', v_updated;
    update bdb_satker s set root_id = m.winner_id from _satker_wilayah_merge_map m where s.root_id = m.loser_id;

    -- 11) Pastikan baris pemenang pakai nama tampilan final (gaya ROBINOPS).
    update bdb_satker s
    set deskripsi = m.nama_final, updated_at = now()
    from _satker_wilayah_merge_map m
    where s.id = m.winner_id and s.deskripsi is distinct from m.nama_final;

    -- 12) Hapus baris yang kalah -- semua referensi & data di atas sudah dipindah/diselamatkan.
    delete from bdb_satker s using _satker_wilayah_merge_map m where s.id = m.loser_id;
    get diagnostics v_updated = row_count;
    raise notice 'bdb_satker baris duplikat WILAYAH dihapus: %', v_updated;
end $$;
