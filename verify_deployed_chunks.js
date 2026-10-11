const http = require('http');

function fetchChunk(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, data }));
    }).on('error', reject);
  });
}

async function verify() {
  const r1 = await fetchChunk('http://10.0.0.x:3000/_next/static/chunks/3pp0f_cp6yg-o.js');
  console.log('3pp0f status:', r1.statusCode, 'length:', r1.data.length);
  console.log('3pp0f has /cms/profile?id= :', r1.data.includes('/cms/profile?id='));
  console.log('3pp0f has hardcoded omeko11 isSelf:', r1.data.includes("targetUsername === 'omeko11'"));

  const r2 = await fetchChunk('http://10.0.0.x:3000/_next/static/chunks/3def3ti6rk0vr.js');
  console.log('3def status:', r2.statusCode, 'length:', r2.data.length);
  console.log('3def has proportional crop b2n:', r2.data.includes('let b2n = 1 / (cssScale * zm);'));
  console.log('3def has cas_banner_:', r2.data.includes('cas_banner_'));
  console.log('3def has /cms/profile?id= :', r2.data.includes('/cms/profile?id='));
}

verify().catch(console.error);
