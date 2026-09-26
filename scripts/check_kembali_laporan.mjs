import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web node -e "
const fs = require('fs');
const c = fs.readFileSync('/usr/src/app/.next/static/chunks/laporan-filter-perma-a15e28ec2e80.js', 'utf8');
let idx = 0;
while ((idx = c.indexOf('Kembali', idx)) !== -1) {
    console.log(c.substring(idx - 60, idx + 80));
    idx += 7;
}
"`;

console.log(runFE(cmd));
