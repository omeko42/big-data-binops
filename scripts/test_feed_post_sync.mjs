import { runBE } from './be_exec.mjs';

const script = `
const http = require('http');
const { Client } = require('pg');

async function test() {
  const c = new Client('postgresql://bdb_app:Bareskrim2026@10.0.0.x:5432/big_data_binops');
  await c.connect();
  const d = await c.query('select * from auth_devices order by id desc limit 1');
  const u122 = (await c.query("select * from auth_users where id = 122")).rows[0];
  await c.end();

  const jwt = require('jsonwebtoken');
  const token = jwt.sign({
    id: u122.id,
    user: { id: u122.id, organisasi_id: 1, organisasiRoleId: 3, Organisasi: { id: 1 } },
    device_token: d.rows[0]?.device_token || 'dummy'
  }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

  const req = http.request({
    hostname: 'localhost',
    port: 3850,
    path: '/api/bdb/jukrah/feed?type=all',
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + token }
  }, res => {
    let buf = '';
    res.on('data', chunk => buf += chunk);
    res.on('end', () => {
      const json = JSON.parse(buf);
      console.log('Posts count:', json.data?.length);
      json.data?.forEach(p => {
        console.log('Post id:', p.id, 'author_id:', p.author_id, 'author_callsign:', p.author_callsign, 'author_username:', p.author_username, 'author_name:', p.author_name);
      });
    });
  });
  req.end();
}
test();
`;

const b64 = Buffer.from(script).toString('base64');
console.log(runBE(`docker exec bdb-api node -e "$(echo '${b64}' | base64 -d)"`));
