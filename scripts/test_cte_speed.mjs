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
  const t0 = Date.now();
  const res = await c.query(\`
    with recursive satker_tree as (
      select id from bdb_satker where id = 4891
      union all
      select s.id from bdb_satker s join satker_tree st on s.parent_id = st.id
    )
    select count(*)
    from bdb_laporan_polisi lp
    join satker_tree st on st.id = coalesce(lp.unit_satker_id, lp.satker_id)
    where lp.deleted_at is null
      and coalesce(lp.dilimpahkan_eksternal, false) = false
      and parse_tgl_laporan(lp.tgl_laporan) >= \\x272026-09-01\\x27::date
      and parse_tgl_laporan(lp.tgl_laporan) <= \\x272026-09-30\\x27::date
  \`);
  const t1 = Date.now();
  console.log("Count for Sep 2026 Polda Metro:", res.rows[0].count, "Time (ms):", t1 - t0);
  await c.end();
}).catch(e => { console.error(e); process.exit(1); });
'`;

console.log(runBE(script));
