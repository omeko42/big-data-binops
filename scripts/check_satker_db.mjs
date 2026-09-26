import { runBE } from './be_exec.mjs';

const cmd = `docker exec bdb-api node -e '
  const { Client } = require("pg");
  const c = new Client({ host: "10.0.0.x", port: 5432, user: "bdb_app", password: "Bareskrim2026", database: "big_data_binops" });
  c.connect().then(async () => {
    const res = await c.query("SELECT id, kode, kode_canonical, deskripsi, parent_id FROM bdb_satker WHERE deskripsi ILIKE $1 LIMIT 10", ["%jatim%"]);
    console.log("Jatim satkers:", JSON.stringify(res.rows, null, 2));
    const res2 = await c.query("SELECT id, kode, kode_canonical, deskripsi, parent_id FROM bdb_satker WHERE deskripsi ILIKE $1 LIMIT 10", ["%siber%"]);
    console.log("Siber satkers:", JSON.stringify(res2.rows, null, 2));
    c.end();
  });
'`;

console.log(runBE(cmd));
