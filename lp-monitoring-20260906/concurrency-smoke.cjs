require('/usr/src/app/node_modules/ts-node/register/transpile-only');
const { Client } = require('/usr/src/app/node_modules/pg');
const { LaporanPolisiService } = require('/usr/src/app/src/bdb/laporan-polisi/laporan-polisi.service.ts');

(async () => {
  const pg = new Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });
  await pg.connect();
  try {
    let queryCount = 0;
    const ds = { query: async (sql, params = []) => {
      queryCount += 1;
      return (await pg.query(sql, params)).rows;
    }};
    const service = new LaporanPolisiService(ds, { log: async () => {} }, {});
    await Promise.all([service.ensureTable(), service.ensureTable(), service.ensureTable()]);
    if (queryCount !== 4) throw new Error(`inisialisasi dijalankan lebih dari sekali: ${queryCount} query`);
    console.log(JSON.stringify({ status: 'ok', parallel_calls: 3, initialization_query_count: queryCount }));
  } finally {
    await pg.end();
  }
})().catch((error) => { console.error(error.stack || error.message); process.exit(1); });
