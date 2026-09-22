import { runBE } from './fe_inspect.mjs';

const cmd = `
docker exec bdb-api node -e '
const { Client } = require("pg");
async function run() {
    const c = new Client("postgresql://bdb_app:Bareskrim2026@10.0.0.x:5432/big_data_binops");
    await c.connect();
    const res = await c.query("select id, name, username, email, role_bdb, role_name, scope_satker_id from auth_users where role_bdb = \\$1 or role_name ilike \\$2 limit 5", ["superadmin", "%super%"]);
    console.log(res.rows);
    await c.end();
}
run();
'
`;

try {
    console.log(runBE(cmd));
} catch (e) {
    console.error(e.message);
}
