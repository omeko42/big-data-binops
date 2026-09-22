const fs = require('fs');
const path = require('path');
const Module = require('module');

const [pihakPath, bbPath] = process.argv.slice(2);
if (!pihakPath || !bbPath) {
  throw new Error('Usage: node test-backend-runtime.js <pihak.js> <bb.js>');
}

function loadAt(candidatePath, logicalPath) {
  const instance = new Module(logicalPath, module);
  instance.filename = logicalPath;
  instance.paths = Module._nodeModulePaths(path.dirname(logicalPath));
  instance._compile(fs.readFileSync(candidatePath, 'utf8'), logicalPath);
  return instance.exports;
}

const pihakSource = fs.readFileSync(pihakPath, 'utf8');
const bbSource = fs.readFileSync(bbPath, 'utf8');

if (!pihakSource.includes('Promise.all([dorsPromise, manualPromise, documentPromise])')) {
  throw new Error('Pihak recent branches are not parallel');
}
if (!pihakSource.includes("scope: scope.all ? 'ALL'")) {
  throw new Error('Pihak shared summary cache key is missing');
}
if (bbSource.includes('select count(*)::int as total ${baseSql}')) {
  throw new Error('BB full count query is still present');
}
if (!bbSource.includes("mode: 'lookahead-no-count'")) {
  throw new Error('BB lookahead response mode is missing');
}

const { PihakTerlibatService } = loadAt(
  pihakPath,
  '/usr/src/app/dist/bdb/pihak-terlibat/pihak-terlibat.service.performance-test.js'
);
const { BarangBuktiService } = loadAt(
  bbPath,
  '/usr/src/app/dist/bdb/barang-bukti/barang-bukti.service.performance-test.js'
);

if (typeof PihakTerlibatService !== 'function' || typeof BarangBuktiService !== 'function') {
  throw new Error('Candidate service classes failed to load');
}

let active = 0;
let maxActive = 0;
let calls = 0;
const dataSource = {
  query: async (_sql, params) => {
    calls += 1;
    active += 1;
    maxActive = Math.max(maxActive, active);
    if (params?.[0] !== 26) throw new Error(`Unexpected recent fetch size: ${params?.[0]}`);
    await new Promise((resolve) => setTimeout(resolve, 20));
    active -= 1;
    return [];
  }
};

(async () => {
  const service = new PihakTerlibatService(dataSource, {}, {});
  const result = await service.recentGlobal(1, 25);
  if (calls !== 3 || maxActive !== 3) {
    throw new Error(`Expected 3 concurrent recent queries, calls=${calls}, maxActive=${maxActive}`);
  }
  if (result.meta.hasNext !== false || result.data.length !== 0) {
    throw new Error('Unexpected recentGlobal result contract');
  }
  console.log(JSON.stringify({ ok: true, modulesLoaded: true, recentQueries: calls, maxConcurrent: maxActive }));
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
