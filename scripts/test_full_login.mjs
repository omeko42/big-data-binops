import { runBE } from './be_exec.mjs';

const testFlow = `
const http = require('http');
const crypto = require('crypto');

function get(path) {
    return new Promise((resolve, reject) => {
        http.get('http://127.0.0.1:3850' + path, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        }).on('error', reject);
    });
}

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
        if (leadingZeroBits(hash) >= difficulty) {
            return nonce;
        }
        nonce++;
    }
}

async function main() {
    console.log("1. Getting captcha...");
    const captchaRes = await get('/api/Authentication/captcha');
    console.log("Captcha received:", captchaRes.data.id, "difficulty:", captchaRes.data.difficulty);

    console.log("2. Solving PoW...");
    const t0 = Date.now();
    const nonce = solvePoW(captchaRes.data.prefix, captchaRes.data.difficulty);
    console.log("Solved in", Date.now() - t0, "ms, nonce:", nonce);

    console.log("3. Calling /api/Authentication/login...");
    const loginRes = await post('/api/Authentication/login', {
        email: 'agungkrisdianto98@polri.go.id',
        password: 'Bareskrim2026',
        captcha_id: captchaRes.data.id,
        captcha: String(nonce)
    });
    console.log("Login response status:", loginRes.status);
    console.log("Login response body:", JSON.stringify(loginRes.body, null, 2));
}

main().catch(console.error);
`;

const b64 = Buffer.from(testFlow).toString('base64');
const out = runBE(`
echo "${b64}" | base64 -d > /tmp/test_full_login.js
docker cp /tmp/test_full_login.js bdb-api:/usr/src/app/test_full_login.js
docker exec bdb-api node /usr/src/app/test_full_login.js
docker exec bdb-api rm -f /usr/src/app/test_full_login.js
rm -f /tmp/test_full_login.js
`);
console.log(out);
