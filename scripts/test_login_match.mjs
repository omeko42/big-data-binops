import { runBE } from './be_exec.mjs';

const code = `
const { Client } = require('pg');
const client = new Client({
    host: '10.0.0.x',
    user: 'bdb_app',
    password: 'Bareskrim2026',
    database: 'big_data_binops',
});
async function test() {
    await client.connect();
    const normalized = 'agungkrisdianto98@polri.go.id'.trim().toLowerCase();
    const res = await client.query(\`
        SELECT id, name, username, email, email_polri 
        FROM auth_users 
        WHERE lower(email_polri) = $1 OR lower(username) = $1 OR lower(email) = $1
    \`, [normalized]);
    console.log("Matching users count:", res.rows.length);
    console.log("Matching users:", res.rows);
    await client.end();
}
test().catch(console.error);
`;

const b64 = Buffer.from(code).toString('base64');
const out = runBE(`
echo "${b64}" | base64 -d > /tmp/test_login_user.js
docker cp /tmp/test_login_user.js bdb-api:/usr/src/app/test_login_user.js
docker exec bdb-api node /usr/src/app/test_login_user.js
docker exec bdb-api rm -f /usr/src/app/test_login_user.js
rm -f /tmp/test_login_user.js
`);
console.log(out);
