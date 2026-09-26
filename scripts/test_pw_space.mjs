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
    const res = await client.query('SELECT password FROM auth_users WHERE id = 1');
    const u = res.rows[0];
    console.log("Match 'Bareskrim2026':", await bcrypt.compare('Bareskrim2026', u.password));
    console.log("Match 'Bareskrim2026 ' (with trailing space):", await bcrypt.compare('Bareskrim2026 ', u.password));
    console.log("Match ' Bareskrim2026' (with leading space):", await bcrypt.compare(' Bareskrim2026', u.password));
    await client.end();
}
test().catch(console.error);
`;

const b64 = Buffer.from(code).toString('base64');
const out = runBE(`
echo "${b64}" | base64 -d > /tmp/test_pw_space.js
docker cp /tmp/test_pw_space.js bdb-api:/usr/src/app/test_pw_space.js
docker exec bdb-api node /usr/src/app/test_pw_space.js
docker exec bdb-api rm -f /usr/src/app/test_pw_space.js
rm -f /tmp/test_pw_space.js
`);
console.log(out);
