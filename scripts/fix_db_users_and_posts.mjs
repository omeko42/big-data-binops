import { runBE } from './be_exec.mjs';

const script = `
const { Client } = require('pg');
async function run() {
  const c = new Client('postgresql://bdb_app:Bareskrim2026@10.0.0.x:5432/big_data_binops');
  await c.connect();

  console.log('--- 1. Set callsign for Hendrik (id 122) ---');
  await c.query("UPDATE auth_users SET callsign = 'hendrik_dwi' WHERE id = 122");
  const u122 = await c.query("SELECT id, name, username, callsign FROM auth_users WHERE id = 122");
  console.log('User 122:', u122.rows[0]);

  console.log('--- 2. Set callsign for Rachmat (id 16568) ---');
  await c.query("UPDATE auth_users SET callsign = 'mat.doang7' WHERE id = 16568");
  const u16568 = await c.query("SELECT id, name, username, callsign FROM auth_users WHERE id = 16568");
  console.log('User 16568:', u16568.rows[0]);

  console.log('--- 3. Ensure post 3 is authored by Eko (id 1) ---');
  await c.query("UPDATE bdb_social_posts SET author_id = 1 WHERE id = 3");
  const p3 = await c.query("SELECT id, author_id, content FROM bdb_social_posts WHERE id = 3");
  console.log('Post 3:', p3.rows[0]);

  await c.end();
}
run();
`;

const b64 = Buffer.from(script).toString('base64');
console.log(runBE(`docker exec bdb-api node -e "$(echo '${b64}' | base64 -d)"`));
