import fs from 'fs';
const content = fs.readFileSync('3def3ti6rk0vr.patched.js', 'utf8');
let idx = content.indexOf('children:1===eOtpStep?');
console.log(content.substring(idx + 2400, idx + 4500));
