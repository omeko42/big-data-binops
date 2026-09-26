import fs from 'fs';
const code = fs.readFileSync('user-page-pagination-v9-dfbc949b.patched.js', 'utf8');

const idx = code.indexOf('async function ay()');
console.log("=== FUNCTION ay() ===");
console.log(code.substring(idx, idx + 1500));
