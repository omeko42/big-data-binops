const fs = require('fs');

function read(name) {
  return fs.readFileSync(`${__dirname}/${name}`, 'utf8');
}

function expect(condition, message) {
  if (!condition) throw new Error(message);
}

for (const ext of ['ts', 'js']) {
  const pihak = read(`pihak-terlibat.service.candidate.${ext}`);
  expect(pihak.includes("scope: scope.all ? 'ALL'"), `pihak ${ext}: shared cache scope missing`);
  expect(!pihak.includes('summaryKey(authUser, query)'), `pihak ${ext}: per-user cache call remains`);
  expect(pihak.includes('Promise.all([dorsPromise, manualPromise, documentPromise])'), `pihak ${ext}: recent branches are not parallel`);

  const bb = read(`barang-bukti.service.candidate.${ext}`);
  expect(!bb.includes('select count(*)::int as total ${baseSql}'), `BB ${ext}: full count remains`);
  expect(bb.includes('limit + 1'), `BB ${ext}: lookahead fetch missing`);
  expect(bb.includes("mode: 'lookahead-no-count'"), `BB ${ext}: response mode missing`);
  expect(bb.includes('data: rows.slice(0, limit)'), `BB ${ext}: extra lookahead row leaks`);
}

const bbUi = read('register-bb-fast-20260905.js');
expect(bbUi.includes('t.hasNext?1:0'), 'BB UI: hasNext paginator fallback missing');
expect(!bbUi.includes('y(e?.meta?.total||0)'), 'BB UI: old exact-total assumption remains');

const pihakUi = read('register-pihak-v7-fast-20260905.js');
expect(pihakUi.includes('setTimeout'), 'Pihak UI: summary defer missing');
expect(pihakUi.includes('clearTimeout'), 'Pihak UI: summary defer cleanup missing');
expect(pihakUi.includes('scrollable:!0,tableStyle:{minWidth:"112rem"}'), 'Pihak UI: previous horizontal scroll fix lost');

console.log(JSON.stringify({
  ok: true,
  pihak: { sharedSummaryCache: true, parallelRecentBranches: true, deferredSummary: true },
  barangBukti: { fullCountRemoved: true, lookaheadPagination: true, frontendFallback: true }
}, null, 2));
