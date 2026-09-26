import fs from 'fs';

const code = fs.readFileSync('user-page-pagination-v9-dfbc949b.patched.js', 'utf8');

// Find dialog start
const dStart = 'header:e9?"Edit Pengguna":"Tambah Pengguna"';
const dIdx = code.indexOf(dStart);
console.log('dIdx:', dIdx);

// Find the children div
const childDivStart = 'children:(0,a.jsxs)("div",{className:"p-fluid",style:{display:"grid",gap:"0.7rem"}';
const cIdx = code.indexOf(childDivStart, dIdx);
console.log('cIdx:', cIdx);

// Find the end of this dialog
// It ends where the next dialog begins:
// Look at what dialog comes next after Edit Pengguna dialog
const nextDialogIdx = code.indexOf('(0,a.jsx)(d.Dialog,{', dIdx);
console.log('nextDialogIdx:', nextDialogIdx);

console.log('Snippet between cIdx and nextDialogIdx - 100:');
console.log(code.substring(nextDialogIdx - 300, nextDialogIdx + 50));
