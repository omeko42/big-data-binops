import fs from 'fs';

const code = fs.readFileSync('user-page-pagination-v9-dfbc949b.patched.js', 'utf8');
const sStart = '(0,a.jsx)(i.Column,{header:"Status",body:e=>{';
const sIdx = code.indexOf(sStart);
console.log('sIdx:', sIdx);
const sEnd = code.indexOf(',sortable:!0,sortField:"status"})', sIdx);
console.log('sEnd:', sEnd);
const fullCol = code.substring(sIdx, sEnd + ',sortable:!0,sortField:"status"})'.length);
console.log('=== EXACT STATUS COLUMN ===');
console.log(fullCol);
