'use strict';
const fs = require('fs');
const Module = require('module');
const path = require('path');
const assert = require('node:assert/strict');
const { Client } = require('pg');

const live = '/usr/src/app/dist/bdb/kinerja-perkara/kinerja-perkara.service.js';
const code = fs.readFileSync(live, 'utf8');
const loaded = new Module(live, module);
loaded.filename = live;
loaded.paths = Module._nodeModulePaths(path.dirname(live));
loaded._compile(code, live);
const Service = loaded.exports.KinerjaPerkaraService;

(async () => {
  const client = new Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    application_name: 'codex-dashboard-summary-readonly',
    statement_timeout: 60000
  });
  await client.connect();
  try {
    await client.query('begin transaction isolation level repeatable read read only');
    const ds = {
      query: async (sql, params = []) => {
        if (/^\s*(create|alter|insert|update|delete)\b/i.test(sql)) {
          throw new Error('Write query rejected in Dashboard regression test');
        }
        return (await client.query(sql, params)).rows;
      }
    };
    const service = new Service(ds, {});
    service.lastRefreshedAt = async () => null;
    const args = [undefined, '2026-01-01', '2026-12-31', 'both', undefined, undefined, undefined];
    const national = await service.summary(...args, 'national');
    const scopedWithoutSatker = await service.summary(...args, 'scoped');

    assert.equal(national.data.scoped, false);
    assert.ok(Number(national.data.ct) > 0, 'National Dashboard summary must contain CT');
    assert.ok(Number(national.data.cp_berjalan) + Number(national.data.cp_tunggakan) + Number(national.data.cc_aktual) + Number(national.data.cc_tunggakan) > 0,
      'National Dashboard Kinerja metrics must not all be zero');
    assert.equal(scopedWithoutSatker.data.scoped, true);
    assert.equal(Number(scopedWithoutSatker.data.ct), 0);

    console.log(JSON.stringify({
      verified: true,
      live: true,
      readOnly: true,
      caseContentRead: false,
      national: {
        scoped: national.data.scoped,
        ct: Number(national.data.ct),
        cp: Number(national.data.cp_berjalan) + Number(national.data.cp_tunggakan),
        cc: Number(national.data.cc_aktual) + Number(national.data.cc_tunggakan)
      },
      priorBugReproduced: scopedWithoutSatker.data.scoped === true && Number(scopedWithoutSatker.data.ct) === 0
    }));
  } finally {
    await client.query('rollback').catch(() => {});
    await client.end();
  }
})().catch((error) => {
  console.error(error.stack);
  process.exitCode = 1;
});
