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
  const cols = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'bdb_satker'");
  console.log('=== bdb_satker columns ===');
  console.log(cols.rows.map(r => r.column_name));

  const satkerRes = await client.query("SELECT * FROM bdb_satker WHERE kode_pusiknas = '060.01.12' LIMIT 5");
  console.log('=== satker 060.01.12 ===', satkerRes.rows);

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
