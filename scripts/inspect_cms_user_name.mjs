import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web node -e "
const fs = require('fs');
const content = fs.readFileSync('/usr/src/app/.next/static/chunks/0-gigr76s0g8t.js', 'utf8');

let idx = 0;
while ((idx = content.indexOf('cms-user-name', idx)) !== -1) {
    console.log('Found cms-user-name at:', idx);
    console.log(content.substring(idx - 400, idx + 150));
    idx += 13;
}
"`;

console.log(runFE(cmd));
