import { runBE } from './be_exec.mjs';

const nodeScript = `
const { Client } = require('pg');
const c = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});
c.connect().then(() => c.query("SELECT id, kode, deskripsi, is_synthetic FROM bdb_satker WHERE id IN (8155, 1456) OR kode IN ('060.01.15.18.00.10', '060.01.03.14.07.06')"))
.then(r => {
  console.log(JSON.stringify(r.rows, null, 2));
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
`;

const b64 = Buffer.from(nodeScript).toString('base64');
console.log(runBE(`echo '${b64}' | base64 -d | docker exec -i bdb-api node`));
