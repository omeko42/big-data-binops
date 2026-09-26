import fs from 'fs';

const code = fs.readFileSync('3jkbfmy5u6eqq.js', 'utf8');

// Find where error is rendered
const pwdIdx = code.indexOf('type:"password"');
console.log('pwdIdx:', pwdIdx);
if (pwdIdx !== -1) {
    console.log(code.substring(pwdIdx - 100, pwdIdx + 600));
}
