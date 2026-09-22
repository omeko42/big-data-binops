require('/usr/src/app/node_modules/ts-node/register/transpile-only');
const { Client } = require('pg');
const { LpMonitoringAccessService } = require('./src/bdb/common/lp-monitoring-access.service.ts');
const { LaporanPolisiService } = require('./src/bdb/laporan-polisi/laporan-polisi.service.ts');
const { KinerjaPerkaraService } = require('./src/bdb/kinerja-perkara/kinerja-perkara.service.ts');

const ACTOR = 9900709;
function assert(ok, message) { if (!ok) throw new Error(message); }

(async () => {
  const pg = new Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    application_name: 'codex-lp-filter-regression-readonly',
    statement_timeout: 120000
  });
  await pg.connect();
  try {
    await pg.query('begin transaction isolation level repeatable read read only');
    const ds = {
      query: async (sql, params = []) => {
        if (/^\s*(create|alter|insert|update|delete|drop|truncate)\b/i.test(sql)) {
          throw new Error('write query rejected by LP filter regression test');
        }
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
      select lp.model_lp, lp.penanganan_level, coalesce(sm.code,'LP') status_code,
             to_char(to_timestamp(nullif(lp.tgl_laporan,''),'DD-MM-YYYY HH24:MI:SS'),'YYYY-MM-DD') report_date
      from bdb_laporan_polisi lp
      left join bdb_status_master sm on sm.id=lp.status_id
      where lp.deleted_at is null and nullif(lp.model_lp,'') is not null
        and nullif(lp.penanganan_level,'') is not null and nullif(coalesce(sm.code,'LP'),'') is not null
        and nullif(lp.tgl_laporan,'') is not null
      order by lp.id desc limit 1
    `)).rows[0];
    assert(sample, 'sample LP untuk pengujian filter tidak ditemukan');

    const cases = [
      ['model', { model: sample.model_lp }, row => row.model_lp === sample.model_lp],
      ['level', { level: sample.penanganan_level }, row => row.penanganan_level === sample.penanganan_level],
      ['status', { status: sample.status_code }, row => row.status_code === sample.status_code],
      ['date', { from: sample.report_date, to: sample.report_date }, row => {
        const raw = String(row.tgl_laporan || '').slice(0, 10).split('-');
        return raw.length === 3 && `${raw[2]}-${raw[1]}-${raw[0]}` === sample.report_date;
      }],
      ['combined', { model: sample.model_lp, level: sample.penanganan_level, status: sample.status_code, from: sample.report_date, to: sample.report_date }, row => row.model_lp === sample.model_lp && row.penanganan_level === sample.penanganan_level && row.status_code === sample.status_code]
    ];

    const result = {};
    for (const [name, filters, predicate] of cases) {
      const response = await service.list({ ...filters, page: 1, row: 100 }, ACTOR);
      assert(response.status === 1, `${name}: status gagal`);
      assert(response.data.every(predicate), `${name}: hasil bocor dari filter`);
      result[name] = { total: Number(response.total), checked: response.data.length };
    }

    const internal = await service.list({ functionDomain: 'INTERNAL_RESERSE', organizationDomain: 'INTERNAL_POLRI', page: 1, row: 100 }, ACTOR);
    assert(internal.status === 1, 'domain: status gagal');
    result.domain = { total: Number(internal.total), checked: internal.data.length };

    console.log(JSON.stringify({ verified: true, readOnly: true, caseContentRead: false, result }));
    await pg.query('rollback');
  } finally {
    await pg.end();
  }
})().catch(error => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
