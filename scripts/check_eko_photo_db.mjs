import { runBE } from './be_exec.mjs';

const cmd = `docker exec bdb-api node -e '
  const { Client } = require("pg");
  const c = new Client({ host: "10.0.0.x", port: 5432, user: "bdb_app", password: "Bareskrim2026", database: "big_data_binops" });
  c.connect().then(async () => {
    const res = await c.query("SELECT id, name, email, email_polri, length(photo_url) as photo_len, photo_hash, photo_updated_at FROM auth_users WHERE email LIKE $1 OR email_polri LIKE $1", ["%agungkrisdianto%"]);
    console.log("auth_users for Eko:", res.rows);
    const res2 = await c.query("SELECT id, nama, nrp, length(foto) as foto_len, photo_hash, photo_updated_at FROM trb_police WHERE nrp = $1", ["98010710"]);
    console.log("trb_police for Eko:", res2.rows);
    c.end();
  });
'`;

console.log(runBE(cmd));
