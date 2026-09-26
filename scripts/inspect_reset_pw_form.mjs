import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web node -e "
const fs = require('fs');
const c = fs.readFileSync('/usr/src/app/.next/static/chunks/34x5c31vs359z.js', 'utf8');
console.log(c.substring(18500, 21100));
"`;

console.log(runFE(cmd));
