const fs = require('fs');
const content = fs.readFileSync('/usr/src/app/.next/static/chunks/register-pihak-v5-6478da3b8c2c.js', 'utf8');
let idx = 0;
while ((idx = content.indexOf('from:', idx)) !== -1) {
  console.log(content.substring(idx - 100, idx + 150));
  console.log('-------------------');
  idx += 6;
}
