import fs from 'fs';

const code = fs.readFileSync('user-page-pagination-v9-dfbc949b.patched.js', 'utf8');

// Find dialog
const dIdx = code.indexOf('header:e9?"Edit Pengguna"');
const dEnd = code.indexOf('id:"fld-user-page-paginati-23"', dIdx);
console.log('Dialog end approx:', dEnd);
console.log('=== FULL DIALOG CONTENT ===');
console.log(code.substring(dIdx, dEnd + 500));

// Find status column
let sIdx = code.indexOf('header:"Status"');
let sEnd = code.indexOf('(0,a.jsx)(i.Column,{body:e=>', sIdx);
console.log('=== FULL STATUS COL ===');
console.log(code.substring(sIdx, sEnd));
