import fs from 'fs';

const content = fs.readFileSync('3def3ti6rk0vr.patched.js', 'utf8');

// Find 34850 module entry
const target = '34850,e=>{"use strict";';
const idx = content.indexOf(target);
console.log("Found target at:", idx);

if (idx === -1) {
    console.error("Target not found!");
    process.exit(1);
}

// Check where maskEmail is defined in the file
console.log("Indices of maskEmail:");
let p = 0;
while ((p = content.indexOf('maskEmail', p)) !== -1) {
    console.log(" - at", p);
    p += 9;
}
