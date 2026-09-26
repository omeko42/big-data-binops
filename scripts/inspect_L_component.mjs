import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web node -e "
const fs = require('fs');
const content = fs.readFileSync('/usr/src/app/.next/static/chunks/0-gigr76s0g8t.js', 'utf8');

// Search for definition of L
// Let's find function L(
let idx = content.indexOf('function L(');
if (idx === -1) {
    // maybe var L = or const L =
    console.log('function L( not found, searching around usages');
    const uIdx = content.indexOf('fld-0-gigr76s0g8t-18');
    console.log('Usage at:', uIdx);
    console.log(content.substring(uIdx - 100, uIdx + 100));
} else {
    console.log('L found at:', idx);
    console.log(content.substring(idx, idx + 1200));
}
"`;

console.log(runFE(cmd));
