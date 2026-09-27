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

  const topPerorangan = await client.query(\`
    SELECT nama, nik, total_lp, count_dpo, count_tersangka, count_terlapor, count_korban, is_lintas_wilayah, jumlah_satker_unik, nasional_score
    FROM bdb_pihak_terlibat_ranking_snapshot
    WHERE tahun = 2026 AND bulan IS NULL AND tipe_subjek = 'PERORANGAN' AND kategori_filter = 'ALL'
    ORDER BY nasional_score DESC, total_lp DESC
    LIMIT 10
  \`);
  console.log('Top 10 Perorangan 2026 by nasional_score:');
  topPerorangan.rows.forEach((r, i) => {
    console.log((i + 1) + '. ' + r.nama + ' (NIK: ' + r.nik + ') | Skor: ' + r.nasional_score + ' | Total LP: ' + r.total_lp + ' | TSK: ' + r.count_tersangka + ' | TLP: ' + r.count_terlapor + ' | Lintas Wilayah: ' + r.is_lintas_wilayah + ' | Satker: ' + r.jumlah_satker_unik);
  });

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
