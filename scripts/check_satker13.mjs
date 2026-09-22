import { runBE } from './fe_inspect.mjs';

const cmd = `
docker exec bdb-api node -e '
const { Client } = require("pg");
async function run() {
    const c = new Client("postgresql://bdb_app:Bareskrim2026@10.0.0.x:5432/big_data_binops");
    await c.connect();
    const rows = await c.query("select id, kode, deskripsi, parent_id, tipe_satker from bdb_satker where id in (1, 13, 9444, 9453)");
    console.log("Satkers:", rows.rows);
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
