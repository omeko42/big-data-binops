import fs from 'fs';

const content = fs.readFileSync('3def3ti6rk0vr.patched.js', 'utf8');
const idx = content.indexOf('accept:"image/png,image/jpeg,image/webp"');
console.log(content.substring(idx - 60, idx + 400));
