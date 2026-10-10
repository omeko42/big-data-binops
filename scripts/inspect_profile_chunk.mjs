import fs from 'fs';

const code = fs.readFileSync('frontend-patch/3def3ti6rk0vr.patched.js', 'utf8');
const regex = /\/api\/bdb\/jukrah[^"'`)]+/g;
const matches = new Set();
let m;
while ((m = regex.exec(code)) !== null) {
  matches.add(m[0]);
}
console.log('Jukrah URLs in profile chunk:');
for (const url of matches) {
  console.log(' - ' + url);
}

// Also check mentions of anak_serse
const serseCount = (code.match(/anak_serse/g) || []).length;
console.log('anak_serse occurrences:', serseCount);
