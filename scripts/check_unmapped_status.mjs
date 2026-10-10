import { runBE } from './be_exec.mjs';

const nodeScript = `
const { Client } = require("pg");
const c = new Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});
async function main() {
  await c.connect();
  const res = await c.query('SELECT count(*)::int as c FROM bdb_dors_raw_lp r WHERE not exists (select 1 from bdb_laporan_polisi lp where lp.dors_lp_id=r.dors_lp_id and lp.model_lp=r.model_lp)');
  console.log('Unmapped remaining:', res.rows[0].c);
  await c.end();
}
main().catch(console.error);
`;

const b64 = Buffer.from(nodeScript).toString('base64');
const cmd = `echo "${b64}" | base64 -d | docker exec -i bdb-api node`;
console.log(runBE(cmd));
