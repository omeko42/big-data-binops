import { runBE } from './be_exec.mjs';

const script = `
const http = require('http');
const { Client } = require('pg');
const jwt = require('jsonwebtoken');

function callApi(token, path) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: '127.0.0.1',
      port: 3850,
      path: path,
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + token }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { resolve(data); }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function run() {
  const c = new Client('postgresql://bdb_app:Bareskrim2026@10.0.0.x:5432/big_data_binops');
  await c.connect();
  const d = await c.query('select * from auth_devices order by id desc limit 1');
  const user1 = (await c.query("select * from auth_users where id = 1")).rows[0];
  await c.end();

  const token = jwt.sign({
    id: user1.id,
    user: { id: user1.id, organisasi_id: 1, organisasiRoleId: 1, Organisasi: { id: 1 } },
    device_token: d.rows[0]?.device_token || 'dummy'
  }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

  const res = await callApi(token, '/api/bdb/jukrah/feed?limit=2');
  console.log('Post 17 in feed:');
  const post17 = res.data?.find(p => p.id === 17);
  console.log('post.media:', post17?.media);
  if (post17?.media?.[0]?.stream_url) {
    const streamRes = await callApi(token, post17.media[0].stream_url);
    console.log('Stream status:', streamRes);
  }
}
run();
`;

const b64 = Buffer.from(script).toString('base64');
console.log(runBE(`docker exec bdb-api node -e "$(echo '${b64}' | base64 -d)"`));
