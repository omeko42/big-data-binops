import fs from 'fs';

const patched = fs.readFileSync('3def3ti6rk0vr.patched.js', 'utf8');
const regex = /style:\s*"([^"]+)"/g;
let m;
let count = 0;
while ((m = regex.exec(patched)) !== null) {
  console.log(`Found string style at ${m.index}: ${m[0]}`);
  count++;
}
console.log('Total string styles in patched:', count);
