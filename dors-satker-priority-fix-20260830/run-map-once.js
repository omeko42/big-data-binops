const { DataSource } = require('/usr/src/app/node_modules/typeorm');
const { LaporanPolisiService } = require('/usr/src/app/dist/bdb/laporan-polisi/laporan-polisi.service.js');
(async () => {
  const ds = new DataSource({ type: 'postgres', host: process.env.DB_HOST, port: Number(process.env.DB_PORT), username: process.env.DB_USERNAME, password: process.env.DB_PASSWORD, database: process.env.DB_DATABASE, ssl: false });
  await ds.initialize();
  try {
    const before = await ds.query(`select count(*)::int c from bdb_dors_raw_lp r where not exists (select 1 from bdb_laporan_polisi lp where lp.dors_lp_id=r.dors_lp_id and lp.model_lp=r.model_lp)`);
    const svc = new LaporanPolisiService(ds, null);
    const result = await svc.mapFromDors();
    const after = await ds.query(`select count(*)::int c from bdb_dors_raw_lp r where not exists (select 1 from bdb_laporan_polisi lp where lp.dors_lp_id=r.dors_lp_id and lp.model_lp=r.model_lp)`);
    console.log(JSON.stringify({ before: before[0].c, result, after: after[0].c }, null, 2));
  } finally { await ds.destroy(); }
})().catch((e) => { console.error(e.stack || e); process.exit(1); });