import { runBE } from './be_exec.mjs';

const cmd = `docker exec bdb-api node -e "
const { authenticator } = require('otplib');
const secret = 'LB2DUQLOOVFWCEJQ';
const token = authenticator.generate(secret);
console.log('Valid token generated:', token);

// Test via curl to localhost:3850
const http = require('http');

function post(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request({
      hostname: '127.0.0.1',
      port: 3850,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        'User-Agent': 'Node-Test/1.0'
      }
    }, res => {
      let buf = '';
      res.on('data', chunk => buf += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: buf }));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

(async () => {
  // Test 1: Invalid token with username omeko11
  const res1 = await post('/api/Authentication/verify-totp', {
    email: 'omeko11',
    password: 'wrongpassword',
    totp_token: '123456'
  });
  console.log('Test 1 (Wrong password):', res1.status, res1.body);

  // Test 2: Invalid TOTP token with invalid credentials format
  const res2 = await post('/api/Authentication/verify-totp', {
    email: 'nonexistent_user_xyz',
    password: 'any',
    totp_token: '123456'
  });
  console.log('Test 2 (User not found):', res2.status, res2.body);
})();
"`;

console.log(runBE(cmd));
