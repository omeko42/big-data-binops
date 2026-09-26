import fs from 'fs';

const code = fs.readFileSync('user-page-pagination-v9-dfbc949b.patched.js', 'utf8');

const dIdx = code.indexOf('header:e9?"Edit Pengguna"');
console.log("=== EDIT PENGGUNA DIALOG PART 2 ===");
console.log(code.substring(dIdx + 1500, dIdx + 4500));
