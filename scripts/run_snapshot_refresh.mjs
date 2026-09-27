import { runBE } from './be_exec.mjs';

const script = `
const { Client } = require('pg');
const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

async function main() {
  await client.connect();
  console.log('1. Checking Sarjono before update...');
  const before = await client.query("SELECT nik, nama, is_lintas_wilayah, jumlah_satker_unik, jumlah_polda_unik, total_lp, nasional_score FROM bdb_pihak_terlibat_ranking_snapshot WHERE nik = '3404111801740001'");
  console.log('Before rows count:', before.rows.length);
  if (before.rows.length > 0) {
    console.log('Sample before:', before.rows[0]);
  }

  // Refresh Sarjono's record in bdb_pihak_terlibat_ranking_snapshot
  console.log('\\n2. Refreshing Sarjono record directly with the new logic...');
  const refreshSql = \`
    WITH raw_dors AS (
        SELECT 
            lp.id as lp_id,
            coalesce(lp.unit_satker_id, lp.satker_id) as satker_id,
            case 
                when s.kode is not null then split_part(s.kode, '.', 1) || '.' || split_part(s.kode, '.', 2) || '.' || split_part(s.kode, '.', 3)
                when d.id_polda is not null then d.id_polda
                else '060.01.00'
            end as wilayah_kode,
            upper(trim(t.nama)) as nama,
            trim(t.nik) as nik,
            upper(trim(coalesce(t.keterlibatan, 'PIHAK'))) as keterlibatan,
            d.synced_at as seen_at,
            CASE 
                WHEN lp.satker_id = 13 OR upper(coalesce(lp.satker_nama,'')) LIKE '%BARESKRIM%' OR upper(coalesce(lp.unit_satker_nama,'')) LIKE '%BARESKRIM%' OR upper(coalesce(lp.satker_nama,'')) LIKE '%MABES%' THEN 1
                WHEN upper(coalesce(lp.satker_nama,'')) LIKE '%POLDA%' OR upper(coalesce(lp.unit_satker_nama,'')) LIKE '%POLDA%' THEN 2
                WHEN upper(coalesce(lp.satker_nama,'')) LIKE '%POLRES%' OR upper(coalesce(lp.satker_nama,'')) LIKE '%POLRESTA%' OR upper(coalesce(lp.unit_satker_nama,'')) LIKE '%POLRES%' THEN 3
                ELSE 4
            END as satker_tier,
            coalesce(nullif(trim(lp.unit_satker_nama),''), lp.satker_nama, 'POLRI') as satker_nama,
            false as is_md,
            null::int as umur
        FROM bdb_laporan_polisi lp
        JOIN bdb_dors_lp d ON d.dors_lp_id = lp.dors_lp_id AND d.model_lp = lp.model_lp
        JOIN bdb_dors_lp_terlibat t ON t.lp_id = d.id
        LEFT JOIN bdb_satker s ON s.id = coalesce(lp.unit_satker_id, lp.satker_id)
        WHERE lp.deleted_at IS NULL AND t.nik = '3404111801740001'
    ),
    raw_tsk AS (
        SELECT 
            d.lp_id,
            coalesce(lp.unit_satker_id, lp.satker_id) as satker_id,
            case 
                when s.kode is not null then split_part(s.kode, '.', 1) || '.' || split_part(s.kode, '.', 2) || '.' || split_part(s.kode, '.', 3)
                else '060.01.00'
            end as wilayah_kode,
            upper(trim(item->>'nama')) as nama,
            trim(item->>'nik') as nik,
            'TERSANGKA'::text as keterlibatan,
            d.created_at as seen_at,
            CASE 
                WHEN lp.satker_id = 13 OR upper(coalesce(lp.satker_nama,'')) LIKE '%BARESKRIM%' OR upper(coalesce(lp.unit_satker_nama,'')) LIKE '%BARESKRIM%' OR upper(coalesce(lp.satker_nama,'')) LIKE '%MABES%' THEN 1
                WHEN upper(coalesce(lp.satker_nama,'')) LIKE '%POLDA%' OR upper(coalesce(lp.unit_satker_nama,'')) LIKE '%POLDA%' THEN 2
                WHEN upper(coalesce(lp.satker_nama,'')) LIKE '%POLRES%' OR upper(coalesce(lp.satker_nama,'')) LIKE '%POLRESTA%' OR upper(coalesce(lp.unit_satker_nama,'')) LIKE '%POLRES%' THEN 3
                ELSE 4
            END as satker_tier,
            coalesce(nullif(trim(lp.unit_satker_nama),''), lp.satker_nama, 'POLRI') as satker_nama,
            false as is_md,
            null::int as umur
        FROM bdb_dokumen d
        JOIN bdb_document_type_master dt ON dt.id = d.document_type_id AND dt.code = 'PENETAPAN_TSK'
        LEFT JOIN bdb_laporan_polisi lp ON lp.id = d.lp_id
        LEFT JOIN bdb_satker s ON s.id = coalesce(lp.unit_satker_id, lp.satker_id)
        CROSS JOIN LATERAL jsonb_array_elements(
            CASE WHEN jsonb_typeof(d.data->'tersangka') = 'array' THEN d.data->'tersangka' ELSE '[]'::jsonb END
        ) party(item)
        WHERE party.item->>'nik' = '3404111801740001'
    ),
    unioned AS (
        SELECT * FROM raw_dors
        UNION ALL
        SELECT * FROM raw_tsk
    ),
    person_agg AS (
        SELECT 
            nik,
            max(nama) as nama,
            count(distinct lp_id)::int as total_lp,
            count(distinct case when keterlibatan = 'TERSANGKA' then lp_id end)::int as count_tersangka,
            count(distinct case when keterlibatan = 'TERLAPOR' then lp_id end)::int as count_terlapor,
            count(distinct case when keterlibatan = 'SAKSI' then lp_id end)::int as count_saksi,
            count(distinct case when keterlibatan = 'KORBAN' then lp_id end)::int as count_korban,
            count(distinct case when keterlibatan = 'PELAPOR' then lp_id end)::int as count_pelapor,
            count(distinct case when keterlibatan = 'DPO' then lp_id end)::int as count_dpo,
            count(distinct satker_id)::int as jumlah_satker_unik,
            count(distinct wilayah_kode)::int as jumlah_polda_unik,
            min(satker_tier)::int as satker_tier,
            (count(distinct wilayah_kode) > 1) as is_lintas_wilayah,
            (array_agg(satker_nama order by satker_tier asc))[1] as satker_nama_tertinggi,
            string_agg(distinct satker_nama, ', ') as daftar_satker,
            max(seen_at) as last_seen,
            (
                (case 
                    when count(distinct case when keterlibatan = 'DPO' then lp_id end) > 0 
                        then 100000 + (count(distinct case when keterlibatan = 'DPO' then lp_id end) * 10000)
                    when count(distinct case when keterlibatan = 'TERSANGKA' then lp_id end) > 0 
                        then 50000 + (count(distinct case when keterlibatan = 'TERSANGKA' then lp_id end) * 5000)
                    when count(distinct case when keterlibatan = 'TERLAPOR' then lp_id end) > 0 
                        then 20000 + (count(distinct case when keterlibatan = 'TERLAPOR' then lp_id end) * 2000)
                    when count(distinct case when keterlibatan = 'SAKSI' then lp_id end) > 0 
                        then 500 + (count(distinct case when keterlibatan = 'SAKSI' then lp_id end) * 10)
                    when count(distinct case when keterlibatan = 'KORBAN' then lp_id end) > 0 
                        then 200 + (count(distinct case when keterlibatan = 'KORBAN' then lp_id end) * 5)
                    when count(distinct case when keterlibatan = 'PELAPOR' then lp_id end) > 0 
                        then 100 + (count(distinct case when keterlibatan = 'PELAPOR' then lp_id end) * 5)
                    else 0 
                end)
                + (case when count(distinct wilayah_kode) > 1 then 25000 + (count(distinct wilayah_kode) * 5000) else 0 end)
                + (count(distinct satker_id) * 300)
                + (case when min(satker_tier) = 1 then 5000 when min(satker_tier) = 2 then 2000 when min(satker_tier) = 3 then 500 else 0 end)
                + (count(distinct lp_id) * 50)
            )::int as nasional_score
        FROM unioned
        GROUP BY nik
    )
    UPDATE bdb_pihak_terlibat_ranking_snapshot s
    SET 
        is_lintas_wilayah = p.is_lintas_wilayah,
        jumlah_satker_unik = p.jumlah_satker_unik,
        jumlah_polda_unik = p.jumlah_polda_unik,
        daftar_satker = p.daftar_satker,
        nasional_score = p.nasional_score,
        refreshed_at = now()
    FROM person_agg p
    WHERE s.nik = p.nik;
  \`;

  await client.query(refreshSql);
  console.log('Update executed successfully!');

  // Check Sarjono after update
  const after = await client.query("SELECT nik, nama, is_lintas_wilayah, jumlah_satker_unik, jumlah_polda_unik, total_lp, nasional_score FROM bdb_pihak_terlibat_ranking_snapshot WHERE nik = '3404111801740001'");
  console.log('\\n3. Sarjono after update:');
  after.rows.forEach(r => console.log(r));

  await client.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
`;

const b64 = Buffer.from(script).toString('base64');
const cmd = `echo "${b64}" | base64 -d | docker exec -i bdb-api node`;
console.log(runBE(cmd));
