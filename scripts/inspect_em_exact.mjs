import fs from 'fs';

const code = fs.readFileSync('3def3ti6rk0vr.patched.js', 'utf8');
const idx = code.indexOf('let t="disable_pin"!==et;');
console.log(code.substring(idx, idx + 600));
