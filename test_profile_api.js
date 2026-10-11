const http = require('http');

function check(url) {
  return new Promise((resolve) => {
    http.get(url, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ url, status: res.statusCode, body: d.slice(0, 300) }));
    }).on('error', e => resolve({ url, error: e.message }));
  });
}

async function run() {
  console.log(await check('http://10.0.0.x:3850/api/bdb/jukrah/network/profile/2'));
  console.log(await check('http://10.0.0.x:3850/api/bdb/jukrah/network/profile/user_2'));
  console.log(await check('http://10.0.0.x:3850/api/user/profile/2'));
}
run();
