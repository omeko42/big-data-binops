import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web node -e "
const fs = require('fs');
const content = fs.readFileSync('/usr/src/app/.next/static/chunks/09so0o9ty_zeh.js', 'utf8');
console.log('Size:', content.length);
// Find email template
const idx = content.indexOf('@polri.go.id');
if (idx !== -1) {
  console.log('Context around email template:');
  console.log(content.slice(Math.max(0, idx - 300), Math.min(content.length, idx + 400)));
}
const idxCard = content.indexOf('Cari nama');
if (idxCard !== -1) {
  console.log('Context around search card:');
  console.log(content.slice(Math.max(0, idxCard - 300), Math.min(content.length, idxCard + 400)));
}
"`;
console.log(runFE(cmd));
