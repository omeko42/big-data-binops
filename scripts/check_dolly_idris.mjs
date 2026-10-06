import { runBE } from './be_exec.mjs';

const script = `
const { Client } = require('pg');
const c = new Client({
  host: '10.0.0.x',
  port: 5432,
  user: 'bdb_app',
  password: 'Bareskrim2026',
  database: 'big_data_binops'
});
async function main() {
  await c.connect();
  const res = await c.query('SELECT id, name, username, callsign, role_bdb FROM auth_users WHERE id IN (1, 14481, 15403)');
  console.log('USERS:', JSON.stringify(res.rows, null, 2));
  await c.end();
}
main().catch(err => { console.error(err); process.exit(1); });
`;

const b64 = Buffer.from(script).toString('base64');
console.log(runBE(`docker exec bdb-api node -e "eval(Buffer.from('${b64}', 'base64').toString('utf8'))"`));
