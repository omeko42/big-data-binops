const http = require('http');
const jwt = require('jsonwebtoken');
const { Client } = require('pg');

async function testOperator() {
  const c = new Client('postgresql://bdb_app:Bareskrim2026@10.0.0.x:5432/big_data_binops');
  await c.connect();
  const d = await c.query('select * from auth_devices order by id desc limit 1');
  const u = await c.query("select * from auth_users where id = 122");
  const user = u.rows[0];
  console.log('Testing as operator:', user.name, 'satker:', user.scope_satker_id);
  await c.end();

  const payload = {
      id: user.id,
      user: {
          id: user.id,
          organisasi_id: user.organisasi_id || 1,
          organisasiRoleId: user.organisasiRoleId || 3,
          Organisasi: { id: user.organisasi_id || 1 }
      },
      device_token: d.rows[0].device_token
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

  function req(p) {
      return new Promise((resolve, reject) => {
          http.get({
              hostname: 'localhost',
              port: 3850,
              path: p,
              headers: { 'Authorization': 'Bearer ' + token }
          }, res => {
              let data = '';
              res.on('data', chunk => data += chunk);
              res.on('end', () => {
                  try {
                      resolve({ statusCode: res.statusCode, body: JSON.parse(data) });
                  } catch (e) {
                      resolve({ statusCode: res.statusCode, body: data });
                  }
              });
          }).on('error', reject);
      });
  }

  const res = await req('/api/bdb/pihak-terlibat/ranking?master=1&subjek=KORPORASI');
  console.log('Operator Status code:', res.statusCode);
  console.log('Operator Total:', res.body.pagination?.total);
  console.log('Data count:', res.body.data?.length);
  if (res.body.data?.length > 0) {
    console.log('Top corporate for Jatim operator:');
    res.body.data.slice(0, 5).forEach((r, i) => {
      console.log(`[${i+1}] ${r.nama} | Total LP: ${r.total_lp} | Kasta: ${r.kasta} | Satker: ${r.satker_nama}`);
    });
  }
}

testOperator().catch(console.error);
