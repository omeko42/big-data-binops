import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web node -e "
const fs = require('fs');
const content = fs.readFileSync('/usr/src/app/.next/static/chunks/3jkbfmy5u6eqq.js', 'utf8');
const idx = content.indexOf('requires_totp');
if (idx !== -1) {
    console.log('--- 3jkbfmy5u6eqq.js context ---');
    console.log(content.slice(Math.max(0, idx - 200), Math.min(content.length, idx + 400)));
}
const content2 = fs.readFileSync('/usr/src/app/.next/static/chunks/3i7ew21veo-ic.js', 'utf8');
const idx2 = content2.indexOf('requires_totp');
if (idx2 !== -1) {
    console.log('--- 3i7ew21veo-ic.js context ---');
    console.log(content2.slice(Math.max(0, idx2 - 200), Math.min(content2.length, idx2 + 400)));
}
"`;
console.log(runFE(cmd));
