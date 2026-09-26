import { runBE } from './be_exec.mjs';

const code = `
const http = require('http');
function post(path, body) {
    return new Promise((res, rej) => {
        const p = JSON.stringify(body);
        const req = http.request('http://127.0.0.1:3850' + path, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(p) }
        }, r => {
            let d = '';
            r.on('data', c => d += c);
            r.on('end', () => res(JSON.parse(d)));
        }).on('error', rej);
        req.write(p); req.end();
    });
}
function get(path, token) {
    return new Promise((res, rej) => {
        const req = http.request('http://127.0.0.1:3850' + path, {
            method: 'GET',
            headers: token ? { 'Authorization': 'Bearer ' + token } : {}
        }, r => {
            let d = '';
            r.on('data', c => d += c);
            r.on('end', () => res({ status: r.statusCode, body: JSON.parse(d) }));
        }).on('error', rej);
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
async function test() {
    const c = (await get('/api/Authentication/captcha')).body;
    const nonce = solvePoW(c.data.prefix, c.data.difficulty);
    const l = await post('/api/Authentication/login', {
        email: 'agungkrisdianto98@polri.go.id',
        password: 'Bareskrim2026',
        captcha_id: c.data.id,
        captcha: String(nonce)
    });
    const token = l.data.access_token;
    const roots = await get('/api/bdb/satker/roots', token);
    console.log('ROOTS STATUS:', roots.status);
    console.log('ROOTS BODY:', JSON.stringify(roots.body, null, 2));

    const children = await get('/api/bdb/satker/children?parentId=1', token);
    console.log('CHILDREN 1 STATUS:', children.status);
    console.log('CHILDREN 1 COUNT:', Array.isArray(children.body.data) ? children.body.data.length : children.body);
}
test().catch(console.error);
`;

const b64 = Buffer.from(code).toString('base64');
console.log(runBE(`echo '${b64}' | base64 -d | node`));
