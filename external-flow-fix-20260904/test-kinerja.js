'use strict';
const fs = require('fs');
const Module = require('module');
const path = require('path');
const assert = require('node:assert/strict');
const { Client } = require('pg');

const dir = '/tmp/external-flow-fix-20260904';
const live = '/usr/src/app/dist/bdb/kinerja-perkara/kinerja-perkara.service.js';
function load(code) {
  const m = new Module(live, module);
  m.filename = live;
  m.paths = Module._nodeModulePaths(path.dirname(live));
  m._compile(code, live);
  return m.exports.KinerjaPerkaraService;
}
const candidateCode = fs.readFileSync(process.env.VERIFY_LIVE === '1' ? live : `${dir}/kinerja-perkara.service.js`, 'utf8');
const Candidate = load(candidateCode);
const Before = load(fs.readFileSync(`${dir}/before.service.js`, 'utf8'));
const ts = require('typescript');
const transpiled = ts.transpileModule(fs.readFileSync(`${dir}/kinerja-perkara.service.ts`, 'utf8'), {
  compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS, experimentalDecorators: true, emitDecoratorMetadata: true }
}).outputText;
assert.equal(typeof load(transpiled), 'function', 'TypeScript source must transpile to the service');
assert.match(candidateCode, /active_external/);
assert.match(candidateCode, /limpah_eksternal/);

const flatten = (nodes) => nodes.flatMap((node) => [node, ...flatten(node.children || [])]);
const ignored = new Set(['children', 'limpah_eksternal']);
(async () => {
  const client = new Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    application_name: 'codex-external-metric-readonly',
    statement_timeout: 45000
  });
  await client.connect();
  try {
    await client.query('begin transaction isolation level repeatable read read only');
    const cache = new Map();
    let externalRows = [];
    const ds = {
      query: async (sql, params = []) => {
        if (/^\s*(create|alter|insert|update|delete)\b/i.test(sql)) throw new Error('write query rejected in regression test');
        const key = JSON.stringify([sql, params]);
        if (!cache.has(key)) cache.set(key, (await client.query(sql, params)).rows);
        const rows = cache.get(key);
        if (/active_external/.test(sql)) externalRows = rows;
        return rows;
      }
    };
    const outputs = [];
    for (const bucket of ['age', 'difficulty']) {
      const args = [undefined, '2026-01-01', '2026-12-31', 'both', undefined, undefined, undefined, 'national', undefined, undefined, undefined, bucket, []];
      const before = await new Before(ds, {}).buildTree(...args);
      const service = new Candidate(ds, {});
      const tree = await service.buildTree(...args);
      const beforeNodes = new Map(flatten(before.roots).map((n) => [n.id, n]));
      for (const node of flatten(tree.roots)) {
        const old = beforeNodes.get(node.id);
        assert.ok(old, `missing prior node ${node.id}`);
        for (const key of Object.keys(node)) {
          if (!ignored.has(key)) assert.deepEqual(node[key], old[key], `unrelated value changed: ${key}`);
        }
        assert.ok(Number.isInteger(node.limpah_eksternal) && node.limpah_eksternal >= 0);
      }
      for (const key of Object.keys(before.totals)) assert.deepEqual(tree.totals[key], before.totals[key], `unrelated total changed: ${key}`);
      const direct = externalRows.reduce((sum, row) => sum + Number(row.limpah_eksternal || 0), 0);
      assert.equal(tree.totals.limpah_eksternal, direct, 'tree total must equal filtered external transfer count');
      service.buildTree = async () => tree;
      service.lastRefreshedAt = async () => null;
      const summary = await service.summary(...args);
      const exported = await service.exportRows(...args);
      assert.equal(summary.data.limpah_eksternal, tree.totals.limpah_eksternal);
      const byCode = new Map(flatten(tree.roots).map((n) => [n.kode, n]));
      for (const row of exported.rows) assert.equal(row.limpah_eksternal, byCode.get(row.kode).limpah_eksternal);
      outputs.push({ bucket, nodes: beforeNodes.size, limpahEksternal: direct, unrelatedMetricsUnchanged: true, summaryExportConsistent: true });
    }
    console.log(JSON.stringify({ verified: true, live: process.env.VERIFY_LIVE === '1', readOnly: true, caseContentRead: false, outputs }));
  } finally {
    await client.query('rollback').catch(() => {});
    await client.end();
  }
})().catch((error) => { console.error(error.stack); process.exitCode = 1; });
