import { runBE } from './be_exec.mjs';

const cmd = `docker exec bdb-api node -e '
  const { Client } = require("pg");
  const c = new Client({ host: "10.0.0.x", port: 5432, user: "bdb_app", password: "Bareskrim2026", database: "big_data_binops" });
  c.connect().then(async () => {
    const res = await c.query("SELECT id, kode, kode_canonical, deskripsi FROM bdb_satker WHERE deskripsi ILIKE $1 ORDER BY id LIMIT 5", ["%siber aceh%"]);
    console.log("Search result for siber aceh:", JSON.stringify(res.rows, null, 2));
    c.end();
  });
'`;

console.log(runBE(cmd));
