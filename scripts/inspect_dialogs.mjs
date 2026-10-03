import fs from 'fs';

const c = fs.readFileSync('frontend-patch/3def3ti6rk0vr.patched.js', 'utf8');
let idx = 0;
while ((idx = c.indexOf('r.Dialog', idx)) !== -1) {
  console.log('Dialog at', idx, ':\n', c.slice(idx, idx + 250));
  console.log('-------------------------------------------');
  idx += 8;
}
