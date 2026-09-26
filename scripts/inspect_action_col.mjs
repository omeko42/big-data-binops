import fs from 'fs';

const code = fs.readFileSync('user-page-pagination-v9-dfbc949b.patched.js', 'utf8');

const sIdx = code.indexOf('(0,a.jsx)(i.Column,{header:"",body:e=>');
console.log("=== ACTION COLUMN ===");
console.log(code.substring(sIdx, sIdx + 2000));
