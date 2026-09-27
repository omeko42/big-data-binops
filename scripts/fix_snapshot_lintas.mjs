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

  const countQuery = await client.query(\`
    SELECT 
      count(*) as total_rows,
      count(*) FILTER (WHERE is_lintas_wilayah = true) as total_lintas,
      count(*) FILTER (WHERE is_lintas_wilayah = true AND (jumlah_polda_unik <= 1 OR jumlah_polda_unik IS NULL)) as false_lintas
    FROM bdb_pihak_terlibat_ranking_snapshot;
  \`);
  console.log('Snapshot stats:', countQuery.rows[0]);

  // Check Wirna specifically before update
  const beforeWirna = await client.query(\`
    SELECT id, nama, nik, total_lp, jumlah_satker_unik, jumlah_polda_unik, is_lintas_wilayah, nasional_score
    FROM bdb_pihak_terlibat_ranking_snapshot
    WHERE nama ILIKE '%WIRNA%' OR nik = '5107083112740170';
  \`);
  console.log('Wirna BEFORE update:', beforeWirna.rows);

  // Execute the fix
  const updateRes = await client.query(\`
    UPDATE bdb_pihak_terlibat_ranking_snapshot
    SET is_lintas_wilayah = false,
        nasional_score = GREATEST(0, nasional_score - (CASE WHEN nasional_score >= 30000 THEN 30000 ELSE 0 END))
    WHERE is_lintas_wilayah = true AND (jumlah_polda_unik <= 1 OR jumlah_polda_unik IS NULL);
  \`);
  console.log('Updated rows:', updateRes.rowCount);

  // Check Wirna specifically after update
  const afterWirna = await client.query(\`
    SELECT id, nama, nik, total_lp, jumlah_satker_unik, jumlah_polda_unik, is_lintas_wilayah, nasional_score
    FROM bdb_pihak_terlibat_ranking_snapshot
    WHERE nama ILIKE '%WIRNA%' OR nik = '5107083112740170';
  \`);
  console.log('Wirna AFTER update:', afterWirna.rows);

  await client.end();
}
main().catch(console.error);
`;

const b64 = Buffer.from(script).toString('base64');
console.log(runBE(`echo "${b64}" | base64 -d | docker exec -i bdb-api node`));
