-- Klasifikasi bdb_satker.kinerja_aktif ("Ikut Rekap" vs "Dikecualikan" di Struktur Satker & rekap
-- Kinerja Perkara CT/CP/CC/CR) utk satker FUNGSI di bawah wilayah (Polda/Polres/Polsek) -- SEBELUM
-- migration ini kinerja_aktif default true utk SEMUA satker (cuma 2 baris pernah dikecualikan
-- manual superadmin, keduanya di luar cakupan migration ini -- lihat WHERE di bawah, cuma
-- menyentuh FUNGSI yg induknya persis POLDA/POLRES/POLSEK).
--
-- Aturan dari user (bukan ditebak dari data): kinerja perkara cuma masuk akal dihitung dari fungsi
-- penindak tindak pidana yg relevan -- fungsi administratif/dukungan (Bag Ops, Bag Renmin, Sabhara,
-- Tahti, Intelkam, Binmas, Propam, dll) dikecualikan.
--   - POLRES -> tetap masuk rekap: Reskrim, Narkoba, Lantas, Pol Air. Selain itu dikecualikan.
--   - POLDA  -> tetap masuk rekap: Krimum, Krimsus, Narkoba, Siber, Polairud. Selain itu
--     dikecualikan (termasuk Dit Lantas Polda -- SENGAJA beda dari level Polres, sesuai instruksi
--     user langsung).
--   - POLSEK -> semua fungsi tetap masuk rekap, tak ada yg dikecualikan.
--
-- Deteksi jenis fungsi pakai LIKE substring ke deskripsi yg sudah diratakan (upper, dibuang semua
-- non-alfanumerik) -- SENGAJA bukan pendekatan "core" rumit ala migration 079-085 (yg buang nama
-- induk kata-per-kata) krn tujuannya beda: di situ perlu presisi utk cocokkan PASANGAN persis, di
-- sini cuma perlu deteksi KATA KUNCI jenis fungsi (RESKRIM/NARKOBA/LANTAS/POLAIR/KRIMUM/KRIMSUS/
-- SIBER) yg SELALU muncul utuh di nama asli terlepas dari kondisi nama wilayahnya (rapi atau
-- berantakan/hyphen/dsb) -- lebih tahan banting utk kasus spt "RESKRIMMULIA"/"KRIMBATANGHARI" dkk
-- (nama wilayah nempel tanpa spasi di core -- pipeline core 079-085 akan salah klasifikasi baris
-- ini sbg "tak dikenal", padahal jelas Reskrim). Diverifikasi dry-run sebelum ditulis: 180/2022/4806
-- baris POLDA/POLRES/POLSEK yg akan tetap TRUE semuanya cocok pola yg diharapkan (spot-check nama).
--
-- Idempotent murni (fungsi deterministik dari deskripsi+induk saat ini, jalan ulang kapan pun
-- hasilnya sama, tak ada state tersembunyi).
do $$
declare
    v_polres int;
    v_polda int;
    v_polsek int;
begin
    with target as (
        select s.id,
            (regexp_replace(upper(s.deskripsi), '[^A-Z0-9]', '', 'g') like '%RESKRIM%')
            or (regexp_replace(upper(s.deskripsi), '[^A-Z0-9]', '', 'g') like '%NARKOBA%')
            or (regexp_replace(upper(s.deskripsi), '[^A-Z0-9]', '', 'g') like '%LANTAS%')
            or (regexp_replace(upper(s.deskripsi), '[^A-Z0-9]', '', 'g') like '%POLAIR%')
            as target_aktif
        from bdb_satker s join bdb_satker p on p.id = s.parent_id
        where s.is_synthetic = false and s.tipe_satker = 'FUNGSI' and p.tipe_satker = 'POLRES'
    )
    update bdb_satker s set kinerja_aktif = t.target_aktif, updated_at = now()
    from target t where s.id = t.id and s.kinerja_aktif is distinct from t.target_aktif;
    get diagnostics v_polres = row_count;
    raise notice 'kinerja_aktif diperbarui utk FUNGSI di bawah POLRES: %', v_polres;

    with target as (
        select s.id,
            (regexp_replace(upper(s.deskripsi), '[^A-Z0-9]', '', 'g') like '%KRIMUM%')
            or (regexp_replace(upper(s.deskripsi), '[^A-Z0-9]', '', 'g') like '%KRIMSUS%')
            or (regexp_replace(upper(s.deskripsi), '[^A-Z0-9]', '', 'g') like '%NARKOBA%')
            or (regexp_replace(upper(s.deskripsi), '[^A-Z0-9]', '', 'g') like '%SIBER%')
            or (regexp_replace(upper(s.deskripsi), '[^A-Z0-9]', '', 'g') like '%POLAIR%')
            as target_aktif
        from bdb_satker s join bdb_satker p on p.id = s.parent_id
        where s.is_synthetic = false and s.tipe_satker = 'FUNGSI' and p.tipe_satker = 'POLDA'
    )
    update bdb_satker s set kinerja_aktif = t.target_aktif, updated_at = now()
    from target t where s.id = t.id and s.kinerja_aktif is distinct from t.target_aktif;
    get diagnostics v_polda = row_count;
    raise notice 'kinerja_aktif diperbarui utk FUNGSI di bawah POLDA: %', v_polda;

    update bdb_satker s
    set kinerja_aktif = true, updated_at = now()
    from bdb_satker p
    where p.id = s.parent_id and s.is_synthetic = false and s.tipe_satker = 'FUNGSI' and p.tipe_satker = 'POLSEK'
      and s.kinerja_aktif = false;
    get diagnostics v_polsek = row_count;
    raise notice 'kinerja_aktif dipulihkan ke true utk FUNGSI di bawah POLSEK: %', v_polsek;
end $$;
