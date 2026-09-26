import fs from 'fs';

const code = fs.readFileSync('user-page-pagination-v9-dfbc949b.patched.js', 'utf8');

// Find dialog
const dIdx = code.indexOf('header:e9?"Edit Pengguna"');
console.log('Dialog idx:', dIdx);
if (dIdx !== -1) {
    console.log('=== DIALOG SNIPPET (first 2500 chars) ===');
    console.log(code.substring(dIdx, dIdx + 2500));
}

// Find status column
let sIdx = code.indexOf('header:"STATUS"');
if (sIdx === -1) sIdx = code.indexOf('header:"Status"');
console.log('Status col idx:', sIdx);
if (sIdx !== -1) {
    console.log('=== STATUS COL SNIPPET (600 chars) ===');
    console.log(code.substring(sIdx - 100, sIdx + 500));
}
