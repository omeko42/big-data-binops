import fs from 'fs';

const content = fs.readFileSync('3def3ti6rk0vr.patched.js', 'utf8');

// Find the security dialog (around line 102000-106000)
let idx = content.indexOf('header:"enable_email_otp"===et?');
if (idx === -1) idx = content.indexOf('"enable_email_otp"===et');
console.log('Dialog index:', idx);
if (idx !== -1) {
  console.log(content.substring(idx - 100, idx + 2500));
}
