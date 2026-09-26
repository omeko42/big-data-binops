import { runBE } from './be_exec.mjs';

const res = runBE(`docker exec bdb-api node -e '
const { Client } = require("pg");
const pg = new Client("postgresql://bdb_app:Bareskrim2026@10.0.0.x:5432/big_data_binops");
pg.connect().then(async () => {
    const r = await pg.query("select table_name from information_schema.tables where table_name ilike \\'%audit%\\' or table_name ilike \\'%mutation%\\' or table_name ilike \\'%mutasi%\\'");
    console.log(r.rows);
    await pg.end();
});
'`);
console.log(res);
