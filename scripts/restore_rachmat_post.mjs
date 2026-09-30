import { runBE } from './be_exec.mjs';

const script = `
const { Client } = require('pg');

async function fix() {
  const c = new Client('postgresql://bdb_app:Bareskrim2026@10.0.0.x:5432/big_data_binops');
  await c.connect();

  console.log('--- Restoring Post 3 author_id to 16568 (Rachmat) ---');
  await c.query("UPDATE bdb_social_posts SET author_id = 16568 WHERE id = 3");
  const p3 = (await c.query(\`
    SELECT p.id, p.author_id, u.name as author_name, u.username as author_username, u.callsign as author_callsign, u.role_bdb as author_role, p.content 
    FROM bdb_social_posts p 
    LEFT JOIN auth_users u ON p.author_id = u.id 
    WHERE p.id = 3
  \`)).rows[0];
  console.log('Post 3:', p3);

  console.log('--- Ensuring Rachmat (id 16568) callsign is mat.doang7 ---');
  await c.query("UPDATE auth_users SET callsign = 'mat.doang7' WHERE id = 16568");
  const u16568 = (await c.query("SELECT id, name, username, callsign, role_bdb FROM auth_users WHERE id = 16568")).rows[0];
  console.log('User 16568:', u16568);

  await c.end();
}
fix();
`;

const b64 = Buffer.from(script).toString('base64');
console.log(runBE(`docker exec bdb-api node -e "$(echo '${b64}' | base64 -d)"`));
