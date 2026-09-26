import fs from 'fs';

const content = fs.readFileSync('3def3ti6rk0vr.patched.js', 'utf8');
const idx = content.indexOf('e.s(["default",0,function()');
console.log('Component start at:', idx);
console.log(content.substring(idx, idx + 400));
