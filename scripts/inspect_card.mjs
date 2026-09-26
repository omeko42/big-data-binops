import fs from 'fs';
const content = fs.readFileSync('3def3ti6rk0vr.patched.js', 'utf8');
let sIdx = content.indexOf('(0,t.jsx)("div",{className:"cms-card-label",children:"Keamanan Akun"})');
let eIdx = content.indexOf('Siap Didaftarkan"})]})})', sIdx) + 'Siap Didaftarkan"})]})})'.length;
console.log('Block length:', eIdx - sIdx);
console.log(content.substring(sIdx, eIdx));
