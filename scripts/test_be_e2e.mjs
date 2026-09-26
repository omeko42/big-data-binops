import { runBE } from './be_exec.mjs';

const script = `
const http = require('http');

function post(path, body) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(body);
        const req = http.request({
            hostname: '127.0.0.1',
            port: 3850,
            path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        }, res => {
            let buf = '';
            res.on('data', c => buf += c);
            res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(buf || '{}') }));
        });
        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

function get(path, token) {
    return new Promise((resolve, reject) => {
        const req = http.request({
            hostname: '127.0.0.1',
            port: 3850,
            path,
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }, res => {
            let buf = '';
            res.on('data', c => buf += c);
            res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(buf || '{}') }));
        });
        req.on('error', reject);
        req.end();
    });
}

async function main() {
    // 1. Health check
    console.log("=== CHECK BE STATUS ===");
    const health = await get('/api/bdb/barang-bukti');
    console.log("Health test status:", health.status);

    // 2. Check DB column structure
    const { Client } = require('pg');
    const pg = new Client('postgresql://bdb_app:Bareskrim2026@10.0.0.x:5432/big_data_binops');
    await pg.connect();
    const cols = await pg.query(\`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'auth_users' 
          AND column_name IN ('social_media', 'photo_url', 'is_pns', 'secondary_email_verified_at', 'email_polri')
    \`);
    console.log("DB columns on auth_users:", cols.rows);
    await pg.end();
}

main().catch(console.error);
`;

const res = runBE(`docker exec bdb-api node -e '${script.replace(/'/g, "'\\''")}'`);
console.log(res);
