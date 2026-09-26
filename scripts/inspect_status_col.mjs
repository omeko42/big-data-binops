import fs from 'fs';

const code = fs.readFileSync('user-page-pagination-v9-dfbc949b.patched.js', 'utf8');

const sIdx = code.indexOf('header:"Status"');
console.log("=== STATUS COLUMN ===");
console.log(code.substring(sIdx, sIdx + 1500));
