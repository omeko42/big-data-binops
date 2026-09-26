import fs from 'fs';
const content = fs.readFileSync('3def3ti6rk0vr.patched.js', 'utf8');
let idx = content.indexOf('"enable_email_otp"===et&&(');
console.log(content.substring(idx, idx + 2000));
