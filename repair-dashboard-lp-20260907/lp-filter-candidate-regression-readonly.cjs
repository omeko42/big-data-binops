require('/usr/src/app/node_modules/ts-node/register/transpile-only');
const { Client } = require('pg');
const { LpMonitoringAccessService } = require('/usr/src/app/src/bdb/common/lp-monitoring-access.service.ts');
const { LaporanPolisiService } = require('/usr/src/app/src/bdb/laporan-polisi/laporan-polisi.service.candidate.ts');
const { KinerjaPerkaraService } = require('/usr/src/app/src/bdb/kinerja-perkara/kinerja-perkara.service.ts');

const ACTOR = 9900709;
function assert(ok, message) { if (!ok) throw new Error(message); }

(async () => {
  const pg = new Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    application_name: 'codex-lp-filter-candidate-readonly',
    statement_timeout: 120000
  });
  await pg.connect();
  try {
    await pg.query('begin transaction isolation level repeatable read read only');
    const ds = {
      query: async (sql, params = []) => {
        if (/^\s*(create|alter|insert|update|delete|drop|truncate)\b/i.test(sql)) throw new Error('write query rejected');
        if (/select role_bdb, role_name, scope_satker_id from auth_users/i.test(sql) && Number(params[0]) === ACTOR) {
          return [{ role_bdb: 'superadmin', role_name: 'Superadmin', scope_satker_id: null }];
        }
        return (await pg.query(sql, params)).rows;
      }
    };
    const policy = new LpMonitoringAccessService(ds);
    const service = new LaporanPolisiService(ds, { log: async () => {} }, policy);
    service.ensureTable = async () => {};
    service.kinerjaPerkara = new KinerjaPerkaraService(ds, {});

    const sample = (await pg.query(`
      select lp.no_laporan, lp.model_lp, lp.penanganan_level, coalesce(sm.code,'LP') status_code,
             to_char(to_timestamp(nullif(lp.tgl_laporan,''),'DD-MM-YYYY HH24:MI:SS'),'YYYY-MM-DD') report_date
      from bdb_laporan_polisi lp left join bdb_status_master sm on sm.id=lp.status_id
      where lp.deleted_at is null and nullif(lp.no_laporan,'') is not null
        and nullif(lp.model_lp,'') is not null and nullif(lp.penanganan_level,'') is not null
        and nullif(coalesce(sm.code,'LP'),'') is not null and nullif(lp.tgl_laporan,'') is not null
      order by lp.id desc limit 1
    `)).rows[0];
    assert(sample, 'sample LP tidak ditemukan');

    const cases = [
      ['model', { model: sample.model_lp }],
      ['level', { level: sample.penanganan_level }],
      ['status', { status: sample.status_code }],
      ['date', { from: sample.report_date, to: sample.report_date }],
      ['search', { search: sample.no_laporan }],
      ['combined', { model: sample.model_lp, level: sample.penanganan_level, status: sample.status_code, from: sample.report_date, to: sample.report_date, search: sample.no_laporan }]
    ];

    const result = {};
    for (const [name, f] of cases) {
      const list = await service.list({ ...f, page: 1, row: 1 }, ACTOR);
      const stats = await service.stats(ACTOR, undefined, f.from, f.to, undefined, undefined, f.search, f.level, f.model, f.status);
      assert(Number(stats.data.total) === Number(list.total), `${name}: total kartu ${stats.data.total} tidak sama dengan tabel ${list.total}`);
      result[name] = Number(list.total);
    }
    console.log(JSON.stringify({ verified: true, readOnly: true, caseContentRead: false, totalsMatch: result }));
    await pg.query('rollback');
  } finally {
    await pg.end();
  }
})().catch(error => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
