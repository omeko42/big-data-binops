import fs from 'fs';

const code = fs.readFileSync('3def3ti6rk0vr.patched.js', 'utf8');
const idx = code.indexOf('id:"profile-form-username"');
console.log('Username idx:', idx);
console.log(code.substring(idx - 50, idx + 1000));
