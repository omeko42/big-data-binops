import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web node -e "
const fs = require('fs');
const content = fs.readFileSync('/usr/src/app/.next/static/chunks/user-page-pagination-v9-dfbc949b.js', 'utf8');
const idx = content.toLowerCase().indexOf('keaktifan');
if (idx !== -1) {
  console.log('keaktifan snippet:');
  console.log(content.slice(Math.max(0, idx - 500), Math.min(content.length, idx + 2000)));
}
"`;
console.log(runFE(cmd));
