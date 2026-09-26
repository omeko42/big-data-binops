import fs from 'fs';
let code = fs.readFileSync('3def3ti6rk0vr.patched.js', 'utf8');
let idx = contentIndexOf(code, 'confirmTotpActivation');
console.log(code.substring(idx + 200, idx + 600));

function contentIndexOf(c, s) { return c.indexOf(s); }
