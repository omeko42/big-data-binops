import fs from 'fs';

const content = fs.readFileSync('3def3ti6rk0vr.patched.js', 'utf8');

let idxStartTotp = content.indexOf('async function startTotpSetup(');
console.log('startTotpSetup:');
if (idxStartTotp !== -1) {
  console.log(content.substring(idxStartTotp, idxStartTotp + 800));
}

let idxEz = content.indexOf('async function ez(');
console.log('ez:');
if (idxEz !== -1) {
  console.log(content.substring(idxEz, idxEz + 900));
}
