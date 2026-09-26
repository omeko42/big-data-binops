import { runBE } from './be_exec.mjs';

const cmd = `docker exec bdb-api node -e '
  const { Client } = require("pg");
  const c = new Client({ host: "10.0.0.x", port: 5432, user: "bdb_app", password: "Bareskrim2026", database: "big_data_binops" });
  c.connect().then(async () => {
    // Check what is in trb_police
    const pol = await c.query("select nrp, nama, satuan, no_hp, pangkat, jabatan, email, length(foto) as foto_len, is_pns from trb_police where lower(email) in ($1, $2)", ["admin@example.go.id", "agungkrisdianto98@polri.go.id"]);
    console.log("Police query result:", pol.rows);
    c.end();
  });
'`;

console.log(runBE(cmd));
