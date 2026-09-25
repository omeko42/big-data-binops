import { runBE } from './be_exec.mjs';

const nodeScript = `
const { Client } = require('pg');
const jwt = require('jsonwebtoken');
const http = require('http');

async function test() {
    const c = new Client("postgresql://bdb_app:Bareskrim2026@10.0.0.x:5432/big_data_binops");
    await c.connect();
    const res = await c.query("select * from auth_users where role_name ilike '%super%' or role_bdb = 'superadmin' limit 1");
    const u = res.rows[0];
    await c.end();

    const payload = {
        id: u.id,
        username: u.username || u.name,
        user: u
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET || '9948e67a185be09aeba80edc2a7db0d56dfd02615d346f17c09c64111ab7939a', { expiresIn: '1h' });

    const req = http.request({
        hostname: '127.0.0.1',
        port: 3850,
        path: '/api/bdb/kinerja-perkara/rekap/export.xlsx?from=2026-01-01&to=2026-12-31&visibility=national',
        headers: { Authorization: 'Bearer ' + token }
    }, (res) => {
        console.log('XLSX Status:', res.statusCode, res.headers['content-type']);
        let buf = '';
        res.on('data', chunk => buf += chunk);
        res.on('end', () => {
            console.log('CSV Total Bytes:', buf.length);
            console.log('CSV First 300 chars:', buf.slice(0, 300));
        });
    });
    req.end();
}
test().catch(e => console.error(e));
`;

const b64 = Buffer.from(nodeScript).toString('base64');
const out = runBE(`docker exec bdb-api node -e "$(echo '${b64}' | base64 -d)"`);
console.log(out);
