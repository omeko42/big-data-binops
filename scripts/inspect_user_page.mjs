import fs from 'fs';

const content = fs.readFileSync('user-page-pagination-v9-dfbc949b.patched.js', 'utf8');

let mutIdx = content.indexOf('mut-satker-');
if (mutIdx !== -1) {
  console.log('--- Mutasi Satker Context: ---');
  console.log(content.substring(mutIdx - 200, mutIdx + 600));
}
