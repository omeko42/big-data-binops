import { runBE } from './be_exec.mjs';

const script = `docker exec bdb-api node -e '
const { Client } = require("pg");
const c = new Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});
c.connect().then(async () => {
  // Check count of LPs for Polda Metro Jaya (id=4891) direct vs hierarchy
  const direct = await c.query("select count(*) from bdb_laporan_polisi where coalesce(unit_satker_id, satker_id) = 4891");
  const hier = await c.query(\`
    with recursive satker_tree as (
      select id from bdb_satker where id = 4891
      union all
      select s.id from bdb_satker s join satker_tree st on s.parent_id = st.id
    )
    select count(*) from bdb_laporan_polisi where coalesce(unit_satker_id, satker_id) in (select id from satker_tree)
  \`);
  console.log("Direct Polda Metro:", direct.rows[0].count, "Hierarchy Polda Metro:", hier.rows[0].count);
  await c.end();
}).catch(e => { console.error(e); process.exit(1); });
'`;

console.log(runBE(script));
