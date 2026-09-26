import { runBE } from './be_exec.mjs';

console.log("=== 1. Checking bdb-api health ===");
const apiHealth = runBE(`curl -s http://127.0.0.1:3850/health || curl -s http://localhost:3850/api || docker exec bdb-api ps aux | grep node || true`);
console.log(apiHealth);

console.log("=== 2. Checking DB photo columns in big_data_binops ===");
const dbCols = runBE(`docker exec bdb-api node -e '
  const { Client } = require("pg");
  const c = new Client({ connectionString: process.env.DATABASE_URL || "postgresql://bdb_app:BdbApp2024Secure!@10.0.0.x:5432/big_data_binops" });
  c.connect().then(async () => {
    const res1 = await c.query("SELECT column_name, data_type, character_maximum_length FROM information_schema.columns WHERE table_name = \\"auth_users\\" AND column_name LIKE \\"%photo%\\"");
    console.log("auth_users cols:", res1.rows);
    const res2 = await c.query("SELECT column_name, data_type, character_maximum_length FROM information_schema.columns WHERE table_name = \\"trb_police\\" AND column_name IN (\\"foto\\", \\"photo_hash\\", \\"photo_updated_at\\")");
    console.log("trb_police cols:", res2.rows);
    await c.end();
  }).catch(err => console.error(err.message));
' || true`);
console.log(dbCols);
