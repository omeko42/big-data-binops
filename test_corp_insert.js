const { Client } = require('pg');
const client = new Client({
  host: '10.0.0.x',
  port: 5432,
  user: 'bdb_app',
  password: 'Bareskrim2026',
  database: 'big_data_binops'
});

async function main() {
  await client.connect();

  console.log('Testing Corporate Insertion for Year 2026 (bulan IS NULL)...');
  
  // Delete existing KORPORASI for year 2026 bulan IS NULL
  await client.query("DELETE FROM bdb_pihak_terlibat_ranking_snapshot WHERE tahun = 2026 AND bulan IS NULL AND tipe_subjek = 'KORPORASI';");

  console.time('insert_2026_year');
  const resYear = await client.query(`
    WITH raw_corp AS (
        SELECT 
            lp.id as lp_id,
            lp.satker_id,
            regexp_replace(regexp_replace(upper(trim(t.nama)), '^(PT|CV|UD)[.]?\\s*', '\\1 '), '\\s+', ' ', 'g') as norm_nama,
            'KORP:' || rtrim(regexp_replace(regexp_replace(regexp_replace(upper(trim(t.nama)), '^(PT|CV|UD)[.]?\\s*', '\\1_'), '[^A-Z0-9]+', '_', 'g'), '_+', '_', 'g'), '_') as synth_nik,
            upper(trim(coalesce(t.keterlibatan, 'PIHAK'))) as keterlibatan,
            d.synced_at as seen_at,
            CASE 
                WHEN lp.satker_id = 13 OR upper(coalesce(lp.satker_nama,'')) LIKE '%BARESKRIM%' OR upper(coalesce(lp.unit_satker_nama,'')) LIKE '%BARESKRIM%' OR upper(coalesce(lp.satker_nama,'')) LIKE '%MABES%' THEN 1
                WHEN upper(coalesce(lp.satker_nama,'')) LIKE '%POLDA%' OR upper(coalesce(lp.unit_satker_nama,'')) LIKE '%POLDA%' THEN 2
                WHEN upper(coalesce(lp.satker_nama,'')) LIKE '%POLRES%' OR upper(coalesce(lp.satker_nama,'')) LIKE '%POLRESTA%' OR upper(coalesce(lp.unit_satker_nama,'')) LIKE '%POLRES%' THEN 3
                ELSE 4
            END as satker_tier,
            coalesce(nullif(trim(lp.unit_satker_nama),''), lp.satker_nama, 'POLRI') as satker_nama
        FROM bdb_laporan_polisi lp
        JOIN bdb_dors_lp d ON d.dors_lp_id = lp.dors_lp_id AND d.model_lp = lp.model_lp
        JOIN bdb_dors_lp_terlibat t ON t.lp_id = d.id
        WHERE lp.deleted_at IS NULL
          AND (case when lp.tgl_laporan ~ '^[0-9]{2}-[0-9]{2}-[0-9]{4}' then to_date(substring(lp.tgl_laporan from 1 for 10),'DD-MM-YYYY') else coalesce(d.synced_at, lp.synced_at)::date end) >= '2026-01-01'::date
          AND (case when lp.tgl_laporan ~ '^[0-9]{2}-[0-9]{2}-[0-9]{4}' then to_date(substring(lp.tgl_laporan from 1 for 10),'DD-MM-YYYY') else coalesce(d.synced_at, lp.synced_at)::date end) <= '2026-12-31'::date
          AND (
            upper(trim(t.nama)) ~ '^(PT[ .]|CV[ .]|UD[ .]|YAYASAN |KOPERASI |BANK |PERUM |PERUSAHAAN |KOP[ .]|KONSORSIUM )'
            OR upper(coalesce(t.jenis_identitas,'')) = 'BADAN HUKUM'
          )
          AND length(trim(t.nama)) > 2
          AND upper(trim(t.nama)) NOT IN ('TIDAK DIKETAHUI','LIDIK','NIHIL','-','--','BELUM DIKETAHUI','NKRI','INDONESIA','NEGARA KESATUAN REPUBLIK INDONESIA')
    ),
    corp_agg AS (
        SELECT 
            synth_nik as nik,
            max(norm_nama) as nama,
            count(distinct lp_id)::int as total_lp,
            count(distinct case when keterlibatan = 'TERSANGKA' then lp_id end)::int as count_tersangka,
            count(distinct case when keterlibatan = 'TERLAPOR' then lp_id end)::int as count_terlapor,
            count(distinct case when keterlibatan = 'SAKSI' then lp_id end)::int as count_saksi,
            count(distinct case when keterlibatan = 'KORBAN' then lp_id end)::int as count_korban,
            count(distinct case when keterlibatan = 'PELAPOR' then lp_id end)::int as count_pelapor,
            count(distinct case when keterlibatan = 'DPO' then lp_id end)::int as count_dpo,
            count(distinct satker_id)::int as jumlah_satker_unik,
            min(satker_tier)::int as satker_tier,
            (count(distinct satker_id) > 1 OR min(satker_tier) != max(satker_tier)) as is_lintas_wilayah,
            (array_agg(satker_nama order by satker_tier asc))[1] as satker_nama_tertinggi,
            string_agg(distinct satker_nama, ', ') as daftar_satker,
            max(seen_at) as last_seen,
            (
                (case when (count(distinct satker_id) > 1 OR min(satker_tier) != max(satker_tier)) then 10000 else 0 end)
                + (case when min(satker_tier) = 1 then 5000 when min(satker_tier) = 2 then 2000 when min(satker_tier) = 3 then 1000 else 0 end)
                + (count(distinct satker_id) * 100)
                + (count(distinct lp_id) * 10)
            )::int as nasional_score
        FROM raw_corp
        GROUP BY synth_nik
        HAVING count(distinct lp_id) > 1
    ),
    multi_corp AS (
        SELECT c.*, 'ALL' as kategori_filter, 'ALL' as keterlibatan FROM corp_agg c
        UNION ALL
        SELECT c.*, 'TERSANGKA' as kategori_filter, 'TERSANGKA' as keterlibatan FROM corp_agg c WHERE count_tersangka > 0
        UNION ALL
        SELECT c.*, 'TERLAPOR' as kategori_filter, 'TERLAPOR' as keterlibatan FROM corp_agg c WHERE count_terlapor > 0
        UNION ALL
        SELECT c.*, 'PELAPOR' as kategori_filter, 'PELAPOR' as keterlibatan FROM corp_agg c WHERE count_pelapor > 0
        UNION ALL
        SELECT c.*, 'SAKSI' as kategori_filter, 'SAKSI' as keterlibatan FROM corp_agg c WHERE count_saksi > 0
        UNION ALL
        SELECT c.*, 'KORBAN' as kategori_filter, 'KORBAN' as keterlibatan FROM corp_agg c WHERE count_korban > 0
        UNION ALL
        SELECT c.*, 'DPO' as kategori_filter, 'DPO' as keterlibatan FROM corp_agg c WHERE count_dpo > 0
    )
    INSERT INTO bdb_pihak_terlibat_ranking_snapshot (
        tahun, bulan, satker_id, keterlibatan, kategori_filter, nama, nik, total_lp,
        satker_tier, satker_nama_tertinggi, last_seen, refreshed_at,
        count_dpo, count_tersangka, count_terlapor, count_saksi, count_korban, count_pelapor,
        jumlah_satker_unik, is_lintas_wilayah, daftar_satker, nasional_score,
        tipe_subjek, tipe_identitas
    )
    SELECT 
        2026 as tahun,
        NULL::int as bulan,
        NULL::bigint as satker_id,
        keterlibatan,
        kategori_filter,
        nama, nik, total_lp,
        satker_tier, satker_nama_tertinggi, last_seen, NOW() as refreshed_at,
        count_dpo, count_tersangka, count_terlapor, count_saksi, count_korban, count_pelapor,
        jumlah_satker_unik, is_lintas_wilayah, daftar_satker, nasional_score,
        'KORPORASI' as tipe_subjek,
        'BADAN HUKUM' as tipe_identitas
    FROM multi_corp;
  `);
  console.timeEnd('insert_2026_year');
  console.log('Inserted rows:', resYear.rowCount);

  const checkCount = await client.query("SELECT count(*) FROM bdb_pihak_terlibat_ranking_snapshot WHERE tahun = 2026 AND bulan IS NULL AND tipe_subjek = 'KORPORASI';");
  console.log('Verification in snapshot table:', checkCount.rows[0]);

  await client.end();
}

main().catch(console.error);
