import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web node -e "
const fs = require('fs');
const content = fs.readFileSync('/usr/src/app/.next/static/chunks/user-page-pagination-v9-dfbc949b.js', 'utf8');

const idx = content.indexOf('SATKER MELEKAT');
if (idx !== -1) {
  console.log('--- Context around SATKER MELEKAT ---');
  console.log(content.slice(Math.max(0, idx - 400), Math.min(content.length, idx + 1000)));
} else {
  console.log('NOT FOUND SATKER MELEKAT');
}
"`;
console.log(runFE(cmd));
