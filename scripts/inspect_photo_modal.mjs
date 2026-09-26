import fs from 'fs';

const content = fs.readFileSync('3def3ti6rk0vr.patched.js', 'utf8');

const modalIdx = content.indexOf('header:"Foto Profil Personel"');
console.log("Found Photo Modal at:", modalIdx);
console.log(content.substring(modalIdx - 100, modalIdx + 1200));
