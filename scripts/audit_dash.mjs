import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web node -e "
const fs = require('fs');
const dashFile = '/usr/src/app/.next/static/chunks/dashboard-perma-318125d33290.js';
if (fs.existsSync(dashFile)) {
  const content = fs.readFileSync(dashFile, 'utf8');
  const matches = [...content.matchAll(/style:\\{[^}]*(#fff|#ffffff|white|#0f172a|#1e293b|#334155)[^}]*\\}/gi)];
  console.log('Dashboard inline styles with hardcoded light colors:', matches.length);
  for (const m of matches.slice(0, 10)) {
    console.log(m[0]);
  }
} else {
  console.log('File not found:', dashFile);
}
"`;

console.log(runFE(cmd));
