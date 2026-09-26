import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web node -e "
const fs = require('fs');
const content = fs.readFileSync('/usr/src/app/.next/static/chunks/00l7wgk9jmf2_.js', 'utf8');
const idx = content.toLowerCase().indexOf('satker melekat');
if (idx !== -1) {
  console.log('00l7 snippet:');
  console.log(content.slice(Math.max(0, idx - 400), Math.min(content.length, idx + 600)));
}
"`;
console.log(runFE(cmd));
