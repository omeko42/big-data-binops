import http from 'http';
import { runBE } from './be_exec.mjs';

const testScript = `
const http = require('http');

// Get auth token for user 1
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
  const res = await c.query("SELECT id, name, username, callsign, role_bdb FROM auth_users WHERE id IN (1, 14481, 15403)");
  console.log("DB USERS:", res.rows);
  await c.end();

  // Test BE controller directly
  const { DataSource } = require('typeorm');
  const ds = new DataSource({
    type: 'postgres',
    host: '10.0.0.x',
    port: 5432,
    username: 'bdb_app',
    password: 'Bareskrim2026',
    database: 'big_data_binops'
  });
  await ds.initialize();
  const { JukrahService } = require('./dist/bdb/jukrah/jukrah.service.js');
  const s = new JukrahService(ds);

  const dollyProf = await s.getNetworkProfile({ id: 1, role_bdb: 'superadmin' }, 'dolly');
  console.log("DOLLY PROFILE:", {
    id: dollyProf.data.id,
    name: dollyProf.data.name,
    username: dollyProf.data.username,
    callsign: dollyProf.data.callsign,
    role_bdb: dollyProf.data.role_bdb
  });

  const idrisProf = await s.getNetworkProfile({ id: 1, role_bdb: 'superadmin' }, 'idrisganteng');
  console.log("IDRIS PROFILE:", {
    id: idrisProf.data.id,
    name: idrisProf.data.name,
    username: idrisProf.data.username,
    callsign: idrisProf.data.callsign,
    role_bdb: idrisProf.data.role_bdb
  });

  const feed = await s.getFeed({ id: 1, role_bdb: 'superadmin' }, { limit: 5 });
  console.log("FEED POSTS COUNT:", feed.posts?.length || 0);
  if (feed.posts && feed.posts.length) {
    console.log("SAMPLE POST AUTHOR:", {
      id: feed.posts[0].author_id,
      name: feed.posts[0].author_name,
      handle: feed.posts[0].author_handle,
      role: feed.posts[0].author_role,
      satker: feed.posts[0].satker
    });
  }
}

main().catch(err => {
  console.error("VERIFICATION FAILED:", err);
  process.exit(1);
});
`;

const b64 = Buffer.from(testScript).toString('base64');
const out = runBE(`docker exec bdb-api node -e "eval(Buffer.from('${b64}', 'base64').toString('utf8'))"`);
console.log(out);
