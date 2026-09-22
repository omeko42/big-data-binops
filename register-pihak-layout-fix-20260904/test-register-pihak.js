const fs = require('fs');

const file = process.argv[2];
if (!file) throw new Error('Usage: node test-register-pihak.js <bundle.js>');

const source = fs.readFileSync(file, 'utf8');

function expect(condition, message) {
  if (!condition) throw new Error(message);
}

expect(
  source.includes('a?.meta?.summary??a?.data?.summary??a?.summary??a?.data??a?.meta??{}'),
  'summary response fallback chain is missing'
);
expect(
  source.includes('Array.isArray(r)?r[0]||{}:r'),
  'array/object summary normalization is missing'
);
expect(
  !source.includes('e||j(a?.meta?.summary||{})'),
  'old summary-only response assumption is still present'
);
expect(
  source.includes('scrollable:!0,tableStyle:{minWidth:"112rem"}'),
  'horizontal DataTable scrolling is missing'
);
expect(
  (source.match(/scrollable:!0,tableStyle:\{minWidth:"112rem"\}/g) || []).length === 1,
  'horizontal scrolling patch must occur exactly once'
);
expect(source.includes('header:"Satker"'), 'the final Satker column was lost');
expect(source.includes('header:"Kejahatan"'), 'the Kejahatan column was lost');
expect(source.includes('rowsPerPageOptions:[25,50,100]'), 'pagination options were lost');

console.log(JSON.stringify({
  ok: true,
  summaryResponseNormalized: true,
  horizontalTableScroll: true,
  columnsPreserved: true,
  paginationPreserved: true
}, null, 2));
