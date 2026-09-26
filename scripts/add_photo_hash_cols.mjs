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
      await c.query("ALTER TABLE auth_users ADD COLUMN IF NOT EXISTS photo_hash VARCHAR(64)");
      await c.query("ALTER TABLE auth_users ADD COLUMN IF NOT EXISTS photo_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()");
      console.log("Added photo_hash & photo_updated_at to auth_users");
    } catch(e) {
      console.error("auth_users error:", e.message);
    }
    try {
      await c.query("ALTER TABLE trb_police ADD COLUMN IF NOT EXISTS photo_hash VARCHAR(64)");
      await c.query("ALTER TABLE trb_police ADD COLUMN IF NOT EXISTS photo_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()");
      console.log("Added photo_hash & photo_updated_at to trb_police");
    } catch(e) {
      console.error("trb_police error:", e.message);
    }
    c.end();
  });
'`;

console.log(runBE(cmd));
