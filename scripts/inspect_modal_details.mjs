import fs from 'fs';

const code = fs.readFileSync('user-page-pagination-v9-dfbc949b.patched.js', 'utf8');

const dIdx = code.indexOf('header:e9?"Edit Pengguna"');
const footerIdx = code.indexOf('id:"fld-user-page-paginati-23"', dIdx);

console.log("=== DIALOG STRUCTURE ===");
console.log(code.substring(dIdx, footerIdx + 300));
