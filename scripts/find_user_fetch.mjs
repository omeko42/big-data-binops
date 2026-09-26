import fs from 'fs';
const code = fs.readFileSync('user-page-pagination-v9-dfbc949b.patched.js', 'utf8');

let idx = 0;
while ((idx = code.indexOf('apiAuth.get("/user', idx)) !== -1) {
    console.log('get user at', idx, 'context:', code.substring(idx - 150, idx + 150));
    idx += 10;
}
