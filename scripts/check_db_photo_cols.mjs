import { runBE } from './be_exec.mjs';

const cmd = `docker exec bdb-api node -e '
  const { Client } = require("pg");
  const c = new Client("postgres://postgres:postgres@10.0.0.x:5432/big_data_binops");
  c.connect().then(async () => {
    const r1 = await c.query("SELECT column_name, data_type, character_maximum_length FROM information_schema.columns WHERE table_name = \\x27trb_police\\x27 AND column_name IN (\\x27foto\\x27, \\x27photo_url\\x27)");
    console.log("trb_police:", r1.rows);
    const r2 = await c.query("SELECT column_name, data_type, character_maximum_length FROM information_schema.columns WHERE table_name = \\x27auth_users\\x27 AND column_name IN (\\x27foto\\x27, \\x27photo_url\\x27)");
    console.log("auth_users:", r2.rows);
    c.end();
  });
'`;

console.log(runBE(cmd));
