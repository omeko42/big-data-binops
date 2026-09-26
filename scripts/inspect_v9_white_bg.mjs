import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web node -e "
const fs = require('fs');
const content = fs.readFileSync('/usr/src/app/.next/static/chunks/user-page-pagination-v9-dfbc949b.js', 'utf8');
const matches = [...content.matchAll(/style:\\{[^}]*background(Color)?:\\s*['\\\"](#fff|#ffffff|white|#f8fafc|#f1f5f9|#eff6ff)['\\\"][^}]*\\}/gi)];
for (const m of matches) {
  console.log(m[0]);
  console.log('Context:', content.slice(Math.max(0, m.index - 80), Math.min(content.length, m.index + m[0].length + 80)));
  console.log('-------------------------');
}
"`;

console.log(runFE(cmd));
