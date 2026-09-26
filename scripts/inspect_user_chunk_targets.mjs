import fs from 'fs';

const content = fs.readFileSync('user-page-pagination-v9-dfbc949b.patched.js', 'utf8');

let idx = 0;
while ((idx = content.indexOf('Satker Melekat', idx)) !== -1) {
  console.log('Occurrence at', idx, ':', content.substring(Math.max(0, idx - 40), Math.min(content.length, idx + 120)));
  idx += 14;
}
