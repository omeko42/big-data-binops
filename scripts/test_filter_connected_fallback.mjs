import { runBE } from './be_exec.mjs';

const code = `
const { DataSource } = require('typeorm');
const { JwtService } = require('@nestjs/jwt');
const http = require('http');

const ds = new DataSource({
  type: 'postgres',
  host: '10.0.0.x',
  port: 5432,
  username: 'bdb_app',
  password: 'Bareskrim2026',
  database: 'big_data_binops'
});

async function main() {
  await ds.initialize();
  const user = (await ds.query('SELECT u.id, u.username, u."organisasiId", d.device_token FROM auth_users u LEFT JOIN auth_devices d ON d."userId" = u.id WHERE u.id = 14746 LIMIT 1'))[0];

  const jwt = new JwtService({ secret: process.env.JWT_SECRET || 'BDB_SECRET_KEY_2026' });
  const token = jwt.sign({
    id: user.id,
    username: user.username,
    device_token: user.device_token,
    user: {
      id: user.id,
      organisasi_id: user.organisasiId || 1,
      Organisasi: { id: user.organisasiId || 1 }
    }
  });

  const options = {
    hostname: '127.0.0.1',
    port: 3850,
    path: '/api/bdb/jukrah/network/users?filter=connected&page=1&limit=9',
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + token
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const p = JSON.parse(data);
      console.log('Test filter=connected (no connected_to param):');
      console.log('Total:', p.total);
      console.log('Data:', (p.data || []).map(u => ({ id: u.id, name: u.name, callsign: u.callsign })));
      process.exit(0);
    });
  });
  req.on('error', e => { console.error(e); process.exit(1); });
  req.end();
}

main().catch(e => { console.error(e); process.exit(1); });
`;

const b64 = Buffer.from(code).toString('base64');
console.log(runBE(`docker exec bdb-api node -e "eval(Buffer.from('${b64}', 'base64').toString('utf8'))"`));
