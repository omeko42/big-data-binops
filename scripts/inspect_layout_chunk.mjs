import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web node -e "
const fs = require('fs');
const content = fs.readFileSync('/usr/src/app/.next/static/chunks/0-gigr76s0g8t.js', 'utf8');
console.log('Length:', content.length);

let idx = 0;
while ((idx = content.indexOf('Kembali', idx)) !== -1) {
    console.log('Kembali at', idx, ':', content.substring(idx - 60, idx + 100));
    idx += 7;
}

let idx2 = 0;
while ((idx2 = content.indexOf('Superadmin', idx2)) !== -1) {
    console.log('Superadmin at', idx2, ':', content.substring(idx2 - 60, idx2 + 100));
    idx2 += 10;
}
"`;

console.log(runFE(cmd));
