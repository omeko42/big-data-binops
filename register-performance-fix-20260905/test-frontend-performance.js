const fs = require('fs');

const [pihakPath, bbPath] = process.argv.slice(2);
if (!pihakPath || !bbPath) {
  throw new Error('Usage: node test-frontend-performance.js <pihak.js> <bb.js>');
}

const pihak = fs.readFileSync(pihakPath, 'utf8');
const bb = fs.readFileSync(bbPath, 'utf8');

function expect(value, message) {
  if (!value) throw new Error(message);
}

expect(pihak.includes('setTimeout'), 'Pihak summary request is not deferred');
expect(pihak.includes('clearTimeout'), 'Pihak summary timer cleanup is missing');
expect(pihak.includes('summary_only:1'), 'Pihak summary endpoint was lost');
expect(pihak.includes('scrollable:!0,tableStyle:{minWidth:"112rem"}'), 'Pihak scroll fix was lost');
expect(bb.includes('t.hasNext?1:0'), 'BB lookahead paginator fallback is missing');
expect(!bb.includes('y(e?.meta?.total||0)'), 'BB still assumes every response has an exact total');
expect(bb.includes('lazy:!0,paginator:!0'), 'BB lazy pagination was lost');

console.log(JSON.stringify({ ok: true, pihakSummaryDeferred: true, bbLookaheadPagination: true }));
