-- 074_populasi_wilayah_dari_dors.sql
-- Isi Jumlah Penduduk satker WILAYAH (Polda/Polres/Polsek) dari data yg sudah tertarik lewat
-- integrasi DORS -- tiap LP membawa objek polda/polres/polsek dgn field jml_penduduk, dicocokkan
-- ke bdb_satker via kolom dors_kode (BUKAN kode_pusiknas, itu kunci lain yg dipakai utk mapping
-- LP->satker -- lihat KP_SQL/DORS_KODE_SQL di laporan-polisi.service.ts). Kunci join ADA di objek
-- polda/polres/polsek itu sendiri (field "kode"), bukan di satker manapun.
--
-- Skema (kolom jumlah_penduduk, tipe_satker) sudah ada sejak migration 068 -- sql ini murni backfill
-- data, aman diulang (hanya menimpa baris yg nilainya benar2 beda, WHERE ... IS DISTINCT FROM).
-- Sinkron BERKELANJUTAN (bukan cuma sekali saat deploy) sudah dijalankan otomatis tiap sync DORS
-- selesai lewat SatkerService.syncPopulasiWilayahDariDors() (dipanggil dari DorsService), jadi
-- migration ini hanya utk mengejar data yg SUDAH tertarik sebelum kode ini di-deploy.

do $$
declare
    v_level record;
begin
    for v_level in select * from (values ('polda','POLDA'), ('polres','POLRES'), ('polsek','POLSEK')) as t(json_key, tipe)
    loop
        execute format($f$
            with latest as (
                select distinct on (lp.payload_json->%1$L->>'kode')
                    lp.payload_json->%1$L->>'kode' as dkode,
                    nullif(lp.payload_json->%1$L->>'jml_penduduk','')::bigint as jml
                from bdb_laporan_polisi lp
                where jsonb_typeof(lp.payload_json->%1$L)='object'
                  and lp.payload_json->%1$L->>'kode' is not null
                order by lp.payload_json->%1$L->>'kode', lp.synced_at desc
            )
            update bdb_satker s set jumlah_penduduk = latest.jml::text, updated_at = now()
            from latest
            where s.tipe_satker = %2$L and s.dors_kode = latest.dkode
              and latest.jml is not null
              and s.jumlah_penduduk is distinct from latest.jml::text
        $f$, v_level.json_key, v_level.tipe);
    end loop;
end $$;
