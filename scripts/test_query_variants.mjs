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

  const urls = [
    '/api/bdb/jukrah/network/users?connected_to=14746',
    '/api/bdb/jukrah/network/users?search=&satker=&page=1&limit=9&connected_to=14746',
    '/api/bdb/jukrah/network/users?search=&satker=&page=1&limit=9&connected_to=14746&filter=connected',
    '/api/bdb/jukrah/network/users?search=&satker=&page=1&limit=9',
    '/api/bdb/jukrah/network/users?connected_to=',
    '/api/bdb/jukrah/network/users?connected_to=undefined',
    '/api/bdb/jukrah/network/users?connected_to=null'
  ];

  for (const path of urls) {
    await new Promise((resolve) => {
      const options = {
        hostname: '127.0.0.1',
        port: 3850,
        path,
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      };
      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const p = JSON.parse(data);
            console.log(path, '=> total:', p.total, 'count:', p.data ? p.data.length : 0);
          } catch (e) {
            console.log(path, '=> status:', res.statusCode);
          }
          resolve();
        });
      });
      req.on('error', e => { console.error(e); resolve(); });
      req.end();
    });
  }
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
`;

const b64 = Buffer.from(code).toString('base64');
console.log(runBE(`docker exec bdb-api node -e "eval(Buffer.from('${b64}', 'base64').toString('utf8'))"`));
