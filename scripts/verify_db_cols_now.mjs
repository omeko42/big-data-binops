import { runBE } from './be_exec.mjs';

const cmd = `docker exec bdb-api node -e '
  const { Client } = require("pg");
  const c = new Client({
    host: "10.0.0.x",
    port: 5432,
    user: "bdb_app",
    password: "Bareskrim2026",
    database: "big_data_binops"
  });
  c.connect().then(async () => {
    const r1 = await c.query("SELECT column_name, data_type, character_maximum_length FROM information_schema.columns WHERE table_name = $1 AND column_name IN ($2, $3, $4)", ["trb_police", "foto", "photo_hash", "photo_updated_at"]);
    console.log("trb_police:", r1.rows);
    const r2 = await c.query("SELECT column_name, data_type, character_maximum_length FROM information_schema.columns WHERE table_name = $1 AND column_name IN ($2, $3, $4)", ["auth_users", "photo_url", "photo_hash", "photo_updated_at"]);
    console.log("auth_users:", r2.rows);
    c.end();
  });
'`;

console.log(runBE(cmd));
