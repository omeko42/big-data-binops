import fs from 'fs';

const content = fs.readFileSync('3def3ti6rk0vr.patched.js', 'utf8');

const sIdx = content.indexOf('ePhotoRef=(0,n.useRef)(null)');
console.log("Ref at:", sIdx);

const iIdx = content.indexOf('accept:"image/png,image/jpeg,image/webp"');
console.log("Input at:", iIdx);
console.log("Input block:\n", content.substring(iIdx - 40, iIdx + 600));

const mIdx = content.indexOf('header:"Foto Profil Personel"');
console.log("Modal at:", mIdx);
console.log("Modal block:\n", content.substring(mIdx, mIdx + 1500));
