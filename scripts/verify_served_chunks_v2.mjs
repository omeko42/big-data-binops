import { runFE } from './fe_exec.mjs';

const cmd = `
curl -s http://127.0.0.1:3000/_next/static/chunks/3def3ti6rk0vr.js | grep -o 'fontSize:"0.65rem"' | head -n 1
curl -s http://127.0.0.1:3000/_next/static/chunks/user-page-pagination-v9-dfbc949b.js | grep -o 'Pencarian Cepat Satker' | head -n 1
`;

console.log('Result:', runFE(cmd));
