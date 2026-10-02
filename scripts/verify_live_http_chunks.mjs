import http from 'http';

function checkChunk(url, label, terms) {
  return new Promise((resolve) => {
    http.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('===', label, '===');
        console.log('Status:', res.statusCode, 'Length:', data.length);
        terms.forEach(t => {
          console.log('Has', t, ':', data.includes(t));
        });
        resolve();
      });
    }).on('error', err => {
      console.error(err);
      resolve();
    });
  });
}

async function run() {
  await checkChunk('http://10.0.0.x:3000/_next/static/chunks/3pp0f_cp6yg-o.js', 'Feed Chunk (3pp0f)', ['Unduh Berkas', '/cms/profile?u=', 'Pratinjau']);
  await checkChunk('http://10.0.0.x:3000/_next/static/chunks/3def3ti6rk0vr.js', 'Profile Chunk (3def)', ["sp.get('id')", 'setIsReadOnlyMode']);
}
run();
