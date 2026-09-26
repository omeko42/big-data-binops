import { runBE } from './be_exec.mjs';

const testCall = `
const http = require('http');

const data = JSON.stringify({
    email: 'agungkrisdianto98@polri.go.id',
    password: 'Bareskrim2026',
    captcha: '',
    captcha_id: ''
});

const req = http.request({
    hostname: '127.0.0.1',
    port: 3850,
    path: '/api/Authentication/login',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)'
    }
}, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
        console.log('STATUS:', res.statusCode);
        console.log('RESPONSE:', body);
    });
});

req.on('error', (e) => console.error(e));
req.write(data);
req.end();
`;

const b64 = Buffer.from(testCall).toString('base64');
const out = runBE(`
echo "${b64}" | base64 -d > /tmp/test_login_call.js
docker cp /tmp/test_login_call.js bdb-api:/usr/src/app/test_login_call.js
docker exec bdb-api node /usr/src/app/test_login_call.js
docker exec bdb-api rm -f /usr/src/app/test_login_call.js
rm -f /tmp/test_login_call.js
`);
console.log(out);
