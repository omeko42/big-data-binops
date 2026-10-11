import { runBE } from './be_exec.mjs';

const nodeScript = `
const fs = require('fs');
const content = fs.readFileSync('/usr/src/app/src/bdb/laporan-polisi/laporan-polisi.controller.ts', 'utf8');
const lines = content.split('\\n');
lines.forEach((l, idx) => {
  if (l.includes('findAll') || l.includes('Get(') || l.includes('Post(')) {
    console.log((idx + 1) + ': ' + l.trim());
  }
});
`;

const b64 = Buffer.from(nodeScript).toString('base64');
console.log(runBE(`docker exec bdb-api node -e "$(echo '${b64}' | base64 -d)"`));
