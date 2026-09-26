import { runBE } from './be_exec.mjs';

const cmd = `docker exec bdb-api node -e '
  const { Client } = require("pg");
  const c = new Client({ host: "10.0.0.x", port: 5432, user: "bdb_app", password: "Bareskrim2026", database: "big_data_binops" });
  c.connect().then(async () => {
    const res = await c.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = $1 AND (column_name LIKE $2 OR column_name LIKE $3)", ["auth_users", "%otp%", "%two_factor%"]);
    console.log(res.rows);
    c.end();
  });
'`;

console.log(runBE(cmd));
