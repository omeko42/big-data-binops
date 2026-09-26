import fs from 'fs';

const c = fs.readFileSync('3def3ti6rk0vr.patched.js', 'utf8');
const start = c.indexOf('fld-3def3ti6rk0vr-pwd');
console.log(c.substring(start - 200, start + 2400));
