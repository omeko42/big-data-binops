import { runBE } from './be_exec.mjs';

const code = `
const http = require('http');

function post(path, body) {
    return new Promise((resolve, reject) => {
        const payload = JSON.stringify(body);
        const req = http.request('http://127.0.0.1:3850' + path, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(data) }));
        });
        req.on('error', reject);
        req.write(payload);
        req.end();
    });
}

function get(path, token) {
    return new Promise((resolve, reject) => {
        const req = http.request('http://127.0.0.1:3850' + path, {
            method: 'GET',
            headers: token ? { 'Authorization': 'Bearer ' + token } : {}
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(data) }));
        });
        req.on('error', reject);
        req.end();
    });
}

const crypto = require('crypto');
function leadingZeroBits(hex) {
    let bits = 0;
    for (const ch of hex) {
        const v = parseInt(ch, 16);
        if (v === 0) { bits += 4; continue; }
        if (v < 2) bits += 3;
        else if (v < 4) bits += 2;
        else if (v < 8) bits += 1;
        break;
    }
    return bits;
}
function solvePoW(prefix, difficulty) {
    let nonce = 0;
    while (true) {
        const hash = crypto.createHash('sha256').update(prefix + ':' + nonce).digest('hex');
        if (leadingZeroBits(hash) >= difficulty) return nonce;
        nonce++;
    }
}

async function main() {
    console.log("1. Getting captcha...");
    const cRes = (await get('/api/Authentication/captcha')).body;
    console.log("2. Solving PoW...");
    const nonce = solvePoW(cRes.data.prefix, cRes.data.difficulty);
    console.log("3. Logging in...");
    const lRes = await post('/api/Authentication/login', {
        email: 'agungkrisdianto98@polri.go.id',
        password: 'Bareskrim2026',
        captcha_id: cRes.data.id,
        captcha: String(nonce)
    });
    const token = lRes.body.data.access_token;
    console.log("TOKEN RECEIVED! Length:", token.length);
    const parts = token.split('.');
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
    console.log("Token payload keys:", Object.keys(payload));
    for (const k of Object.keys(payload)) {
        const val = payload[k];
        const valStr = typeof val === 'object' ? JSON.stringify(val) : String(val);
        console.log("  Key: " + k + ", size: " + valStr.length);
    }

    console.log("4. Testing GET /api/Authentication/user with token...");
    const uRes = await get('/api/Authentication/user', token);
    console.log("GET /api/Authentication/user status:", uRes.status);
    console.log("Has photo_url in body:", Boolean(uRes.body.data?.photo_url));
    console.log("photo_url length in body:", uRes.body.data?.photo_url?.length);

    console.log("5. Testing GET /api/user/me/profile with token...");
    const pRes = await get('/api/user/me/profile', token);
    console.log("GET /api/user/me/profile status:", pRes.status);
    console.log("pRes data:", JSON.stringify(pRes.body.data, null, 2));
}

main().catch(console.error);
`;

const b64 = Buffer.from(code).toString('base64');
const out = runBE(`
echo "${b64}" | base64 -d > /tmp/test_jwt_on_host.js
node /tmp/test_jwt_on_host.js
rm -f /tmp/test_jwt_on_host.js
`);
console.log(out);
