import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web node -e "
const fs = require('fs');
const content = fs.readFileSync('/usr/src/app/.next/static/chunks/0w77m6y2tq5qr.js', 'utf8');
const idx = content.indexOf('Selamat datang');
console.log(content.substring(idx - 400, idx + 400));
"`;

console.log(runFE(cmd));
