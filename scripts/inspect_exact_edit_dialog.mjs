import fs from 'fs';

const code = fs.readFileSync('user-page-pagination-v9-dfbc949b.patched.js', 'utf8');

const dStart = '(0,a.jsx)(d.Dialog,{header:e9?"Edit Pengguna"';
const dIdx = code.indexOf(dStart);
console.log('dIdx:', dIdx);

const nextDialog = ',(0,a.jsx)(d.Dialog,{header:ed.isOperator?"Ajukan P';
const nextIdx = code.indexOf(nextDialog, dIdx);
console.log('nextIdx:', nextIdx);

console.log('Exact Dialog to replace:');
console.log(code.substring(dIdx, nextIdx));
