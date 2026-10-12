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

  const r2 = await fetchChunk('http://10.0.0.x:3000/_next/static/chunks/3def3ti6rk0vr.js');
  console.log('3def status:', r2.statusCode, 'length:', r2.data.length);
  console.log('3def has cas-profile-hero-banner:', r2.data.includes('cas-profile-hero-banner'));
  console.log('3def has 100% Sesuai Hasil:', r2.data.includes('100% Sesuai Hasil'));
  console.log('3def has Muat Semua (Fit):', r2.data.includes('Muat Semua (Fit)'));
  console.log('3def has Isi Penuh (Fill):', r2.data.includes('Isi Penuh (Fill)'));
  console.log('3def has DOM scaleToCv math:', r2.data.includes('scaleToCv = cvWidth / boxRect.width'));
  console.log('3def has min 0.3 zoom:', r2.data.includes('min:"0.3"'));
  console.log('3def has cas_banner_:', r2.data.includes('cas_banner_'));
}

verify().catch(console.error);
