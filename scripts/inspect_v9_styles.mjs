import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web node -e "
const fs = require('fs');
const content = fs.readFileSync('/usr/src/app/.next/static/chunks/user-page-pagination-v9-dfbc949b.js', 'utf8');

// Look for inline styles with colors or classNames
const colorMatches = [...content.matchAll(/style:\\{[^}]*(color|background)[^}]*\\}/g)].map(m => m[0]);
console.log('Sample inline styles with colors:', colorMatches.slice(0, 20));

// Look for email body template
const emailIdx = content.indexOf('@polri.go.id');
if (emailIdx !== -1) {
  console.log('--- Email Template snippet ---');
  console.log(content.slice(Math.max(0, emailIdx - 200), Math.min(content.length, emailIdx + 300)));
}

// Look for Satker snippet
const satkerIdx = content.indexOf('SATKER MELEKAT');
if (satkerIdx !== -1) {
  console.log('--- Satker Column snippet ---');
  console.log(content.slice(Math.max(0, satkerIdx - 100), Math.min(content.length, satkerIdx + 400)));
}
"`;
console.log(runFE(cmd));
