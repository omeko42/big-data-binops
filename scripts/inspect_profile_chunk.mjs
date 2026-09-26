import fs from 'fs';

const content = fs.readFileSync('3def3ti6rk0vr.patched.js', 'utf8');

console.log('=== Dialog 1 (TOTP Setup Modal, ~90000-94000) ===');
console.log(content.substring(90500, 93500));

console.log('=== Dialog 2 (Security OTP Modal, ~102000-105500) ===');
console.log(content.substring(102000, 105500));
