import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web node -e "
const fs = require('fs');
const content = fs.readFileSync('/usr/src/app/.next/static/chunks/user-page-pagination-v9-dfbc949b.js', 'utf8');
const idx = content.indexOf('openActivityDetail');
if (idx !== -1) {
  const nextIdx = content.indexOf('openActivityDetail', idx + 50);
  console.log('Second openActivityDetail:');
  console.log(content.slice(Math.max(0, nextIdx - 500), Math.min(content.length, nextIdx + 2000)));
}
"`;
console.log(runFE(cmd));
