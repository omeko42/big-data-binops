import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web node -e "
const fs = require('fs');
const files = [
  '/usr/src/app/.next/static/chunks/laporan-filter-perma-a15e28ec2e81.js',
  '/usr/src/app/.next/static/chunks/kinerja-perma-external-a42edc88f706.js',
  '/usr/src/app/.next/static/chunks/3def3ti6rk0vr.js'
];

for (const f of files) {
  if (fs.existsSync(f)) {
    const c = fs.readFileSync(f, 'utf8');
    const bgMatches = [...c.matchAll(/background(Color)?:\\s*['\\\"](#fff|#ffffff|white|#f8fafc)['\\\"]/gi)].length;
    const colMatches = [...c.matchAll(/color:\\s*['\\\"](#0f172a|#1e293b|#334155|#111827)['\\\"]/gi)].length;
    console.log(f.split('/').pop(), '-> hardcoded white bg:', bgMatches, '| hardcoded dark text:', colMatches);
  }
}
"`;

console.log(runFE(cmd));
