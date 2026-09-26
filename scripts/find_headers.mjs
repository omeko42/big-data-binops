import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web node -e "
const fs = require('fs');
const content = fs.readFileSync('/usr/src/app/.next/static/chunks/user-page-pagination-v9-dfbc949b.js', 'utf8');
const regex = new RegExp('header:\\\\\"([^\\\\\"]+)\\\\\"', 'g');
let m;
while ((m = regex.exec(content)) !== null) {
  console.log('Header found:', m[1]);
}
"`;
console.log(runFE(cmd));
