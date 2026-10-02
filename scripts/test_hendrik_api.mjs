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
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); } catch (e) { resolve({ status: res.statusCode, body: data }); }
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
  const user122 = (await c.query("select * from auth_users where id = 122")).rows[0];
  await c.end();

  const token = jwt.sign({
    id: user122.id,
    user: { id: user122.id, organisasi_id: user122.scope_satker_id, organisasiRoleId: 2, Organisasi: { id: user122.scope_satker_id } },
    device_token: d.rows[0]?.device_token || 'dummy'
  }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

  console.log('=== SEARCH DEFAULT ===');
  const rDef = await callApi(token, '/api/bdb/satker/search?limit=5&functionDomain=INTERNAL_RESERSE');
  console.log('Default:', rDef.body?.data?.map(x => ({ id: x.id, desc: x.deskripsi, depth: x.depth, tipe: x.tipe_satker })));

  console.log('=== SEARCH KRIMSUS ===');
  const rKrim = await callApi(token, '/api/bdb/satker/search?q=KRIMSUS&limit=5&functionDomain=INTERNAL_RESERSE');
  console.log('Krimsus:', rKrim.body?.data?.map(x => ({ id: x.id, desc: x.deskripsi, depth: x.depth, tipe: x.tipe_satker })));

  console.log('=== SEARCH KRIMUM ===');
  const rKrimum = await callApi(token, '/api/bdb/satker/search?q=KRIMUM&limit=5&functionDomain=INTERNAL_RESERSE');
  console.log('Krimum:', rKrimum.body?.data?.map(x => ({ id: x.id, desc: x.deskripsi, depth: x.depth, tipe: x.tipe_satker })));
}

run().catch(console.error);
`;

const b64 = Buffer.from(script).toString('base64');
console.log(runBE(`docker exec bdb-api node -e "$(echo '${b64}' | base64 -d)"`));
