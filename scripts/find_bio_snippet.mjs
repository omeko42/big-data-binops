import fs from 'fs';

let code = fs.readFileSync('3def3ti6rk0vr.patched.js', 'utf8');

let p1 = '(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.4rem",marginTop:"1.1rem",marginBottom:"0.5rem"';
let idx1 = code.indexOf(p1);
console.log('idx1:', idx1);

let bioIdx = code.indexOf('fld-3def3ti6rk0vr-biometric', idx1);
console.log('bioIdx:', bioIdx);

// print 500 chars from bioIdx
console.log(code.substring(bioIdx, bioIdx + 300));
