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
    console.log("Connected to DB!");
    try {
      await c.query("ALTER TABLE trb_police ALTER COLUMN foto TYPE TEXT");
      console.log("ALTER TABLE trb_police ALTER COLUMN foto TYPE TEXT: SUCCESS");
    } catch(e) {
      console.error("Error altering trb_police.foto:", e.message);
    }
    try {
      await c.query("ALTER TABLE auth_users ALTER COLUMN photo_url TYPE TEXT");
      console.log("ALTER TABLE auth_users ALTER COLUMN photo_url TYPE TEXT: SUCCESS");
    } catch(e) {
      console.error("Error altering auth_users.photo_url:", e.message);
    }
    const r = await c.query("SELECT column_name, data_type, character_maximum_length FROM information_schema.columns WHERE table_name = \\x27trb_police\\x27 AND column_name = \\x27foto\\x27");
    console.log("Current trb_police.foto type:", r.rows);
    c.end();
  });
'`;

console.log(runBE(cmd));
