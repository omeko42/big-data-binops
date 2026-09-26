import fs from 'fs';
let code = fs.readFileSync('3def3ti6rk0vr.patched.js', 'utf8');
const oldOtpEmailText = '(0,t.jsxs)("p",{style:{margin:0,fontSize:"0.82rem",color:"#64748b"},children:["Kode 6 digit sudah dikirim ke ",(0,t.jsx)("b",{children:K(a.email)}),"."]}),';
const idx = code.indexOf(oldOtpEmailText);
console.log('idx:', idx);
console.log('Before 100:', code.substring(idx - 100, idx));
console.log('After 200:', code.substring(idx + oldOtpEmailText.length, idx + oldOtpEmailText.length + 200));
