import fs from 'fs';

const content = fs.readFileSync('3def3ti6rk0vr.patched.js', 'utf8');
const idx = content.indexOf('header:"Foto Profil Personel"');
console.log(content.substring(idx - 100, idx + 1400));
