'use strict';

(async () => {
  const base = `http://${require('node:os').hostname()}:3000`;
  const urls = [
    `${base}/cms/report/kinerja-perkara`,
    `${base}/_next/static/chunks/kinerja-v6-20260830.js`
  ];
  const results = [];
  for (const url of urls) {
    const response = await fetch(url, { redirect: 'manual' });
    const text = await response.text();
    results.push({
      url,
      status: response.status,
      location: response.headers.get('location'),
      length: text.length,
      regional: text.includes('Wilayah Regional:'),
      scopeApi: text.includes('meta/scope-options'),
      scopeParam: text.includes('scope_satker_id:')
    });
  }
  const chunk = results[1];
  if (chunk.status !== 200 || !chunk.regional || !chunk.scopeApi || !chunk.scopeParam) {
    throw new Error('Chunk live belum menyajikan signature filter Regional V5.');
  }
  console.log(JSON.stringify({ ok: true, results }, null, 2));
})().catch((error) => {
  console.error(error.stack || error);
  process.exit(1);
});
