import fs from 'fs';

const content = fs.readFileSync('user-page-pagination-v9-dfbc949b.patched.js', 'utf8');
let idx = 0;
while ((idx = content.indexOf('reset-password', idx)) !== -1) {
  console.log("reset-password in user page at", idx, content.substring(idx - 60, idx + 120));
  idx += 14;
}
