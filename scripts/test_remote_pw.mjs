import { runBE } from './be_exec.mjs';

const code = `
const bcrypt = require('bcrypt');
const { Client } = require('pg');
const client = new Client({
    host: '10.0.0.x',
    user: 'bdb_app',
    password: 'Bareskrim2026',
    database: 'big_data_binops',
});
async function test() {
    await client.connect();
    const res = await client.query('SELECT id, name, username, email, email_polri, password FROM auth_users WHERE id = 1');
    const u = res.rows[0];
    console.log("User:", u.id, u.name, "email_polri:", u.email_polri, "username:", u.username);
    console.log("Match 'Bareskrim2026':", await bcrypt.compare('Bareskrim2026', u.password));
    console.log("Match 'bareskrim2026':", await bcrypt.compare('bareskrim2026', u.password));
    console.log("Match '123456':", await bcrypt.compare('123456', u.password));
    console.log("Match 'Admin123':", await bcrypt.compare('Admin123', u.password));
    await client.end();
}
test().catch(console.error);
`;

const b64 = Buffer.from(code).toString('base64');
const out = runBE(`
echo "${b64}" | base64 -d > /tmp/test_pw.js
docker cp /tmp/test_pw.js bdb-api:/usr/src/app/test_pw.js
docker exec bdb-api node /usr/src/app/test_pw.js
docker exec bdb-api rm -f /usr/src/app/test_pw.js
rm -f /tmp/test_pw.js
`);
console.log(out);
