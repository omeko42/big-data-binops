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
  
  const q = await client.query(\`
    WITH party_satker AS (
      SELECT 
        t.nik,
        t.nama,
        split_part(s.kode, '.', 1) || '.' || split_part(s.kode, '.', 2) || '.' || split_part(s.kode, '.', 3) as wilayah_kode,
        count(distinct lp.id) as lp_cnt
      FROM bdb_dors_lp_terlibat t
      JOIN bdb_dors_lp d ON d.id = t.lp_id
      JOIN bdb_laporan_polisi lp ON lp.dors_lp_id = d.dors_lp_id AND lp.model_lp = d.model_lp
      LEFT JOIN bdb_satker s ON s.id = coalesce(lp.unit_satker_id, lp.satker_id)
      WHERE t.nik IS NOT NULL AND length(trim(t.nik)) >= 10
      GROUP BY t.nik, t.nama, wilayah_kode
    ),
    wilayah_summary AS (
      SELECT 
        nik,
        max(nama) as nama,
        count(distinct wilayah_kode) as jumlah_wilayah,
        string_agg(distinct wilayah_kode, ', ') as list_wilayah,
        sum(lp_cnt) as total_lp
      FROM party_satker
      GROUP BY nik
      HAVING count(distinct wilayah_kode) > 1
    )
    SELECT * FROM wilayah_summary ORDER BY jumlah_wilayah DESC, total_lp DESC LIMIT 5;
  \`);
  console.log('Top True Lintas Wilayah Parties:');
  console.log(q.rows);

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
