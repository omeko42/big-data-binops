import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web node -e "
const fs = require('fs');
const content = fs.readFileSync('/usr/src/app/.next/static/chunks/0-gigr76s0g8t.js', 'utf8');

const idx = content.indexOf('className:\"cms-user\"');
console.log(content.substring(idx - 600, idx + 100));
"`;

console.log(runFE(cmd));
