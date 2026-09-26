import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web node -e "
const fs = require('fs');
const glob = require('path');

const files = fs.readdirSync('/usr/src/app/.next/static/chunks').filter(f => f.endsWith('.js'));
const whiteBgMap = {};

for (const file of files) {
  const content = fs.readFileSync('/usr/src/app/.next/static/chunks/' + file, 'utf8');
  const matches = [...content.matchAll(/style:\\{[^}]*background(Color)?:\\s*['\\\"](#fff|#ffffff|white|#f8fafc|#f1f5f9)['\\\"][^}]*\\}/gi)];
  if (matches.length > 0) {
    whiteBgMap[file] = matches.length;
  }
}

console.log('Files with inline white/light backgrounds in chunks:');
for (const [k, v] of Object.entries(whiteBgMap)) {
  console.log(k.padEnd(40), ':', v, 'instances');
}
"`;

console.log(runFE(cmd));
