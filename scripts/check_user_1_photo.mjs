import { runBE } from './be_exec.mjs';

const cmd = `docker exec bdb-api node -e '
  const { Client } = require("pg");
  const c = new Client({ host: "10.0.0.x", port: 5432, user: "bdb_app", password: "Bareskrim2026", database: "big_data_binops" });
  c.connect().then(async () => {
    const res = await c.query("SELECT id, name, email, email_polri, photo_url, photo_hash FROM auth_users WHERE id = 1");
    console.log("auth_users id 1:", res.rows[0].id, res.rows[0].name, "photo_url starts with:", String(res.rows[0].photo_url).substring(0, 30));
    c.end();
  });
'`;

console.log(runBE(cmd));
