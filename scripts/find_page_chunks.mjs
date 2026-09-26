import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web node -e "
const fs = require('fs');

const pages = [
  'satker',
  'master-ref',
  'audit-log',
  'profile',
  'laporan',
  'integrasi',
  'panduan',
  'kerma'
];

for (const p of pages) {
  const files = fs.readdirSync('/usr/src/app/.next/static/chunks').filter(f => f.includes(p) && f.endsWith('.js'));
  console.log('Page group:', p, '-> Files:', files.slice(0, 5));
}
"`;

console.log(runFE(cmd));
