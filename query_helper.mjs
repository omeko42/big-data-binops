import { runBE } from './scripts/be_exec.mjs';

export async function runQuery(sql) {
    const code = `
const { Client } = require('pg');
const client = new Client({
    host: '10.0.0.x',
    port: 5432,
    user: 'bdb_app',
    password: 'Bareskrim2026',
    database: 'big_data_binops',
});
async function run() {
    await client.connect();
    const t0 = Date.now();
    const res = await client.query(\`${sql.replace(/`/g, '\\`')}\`);
    console.log("QUERY_RESULT_START");
    console.log(JSON.stringify({ timeMs: Date.now() - t0, rows: res.rows }));
    console.log("QUERY_RESULT_END");
    await client.end();
}
run().catch(err => {
    console.error("QUERY_ERROR:", err.message);
    process.exit(1);
});
`;
    const b64 = Buffer.from(code).toString('base64');
    const out = runBE(`
echo "${b64}" | base64 -d > /tmp/run_q.js
docker cp /tmp/run_q.js bdb-api:/usr/src/app/run_q.js
docker exec bdb-api node /usr/src/app/run_q.js
docker exec bdb-api rm -f /usr/src/app/run_q.js
rm -f /tmp/run_q.js
`);
    const start = out.indexOf("QUERY_RESULT_START");
    const end = out.indexOf("QUERY_RESULT_END");
    if (start >= 0 && end >= 0) {
        const jsonStr = out.substring(start + "QUERY_RESULT_START".length, end).trim();
        return JSON.parse(jsonStr);
    }
    throw new Error("Failed to get query result: " + out);
}
