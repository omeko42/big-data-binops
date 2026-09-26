import fs from 'fs';

const content = fs.readFileSync('user-page-pagination-v9-dfbc949b.patched.js', 'utf8');

let idx = content.indexOf('header:e9?"Edit Pengguna":"Tambah Pengguna"');
console.log('header index:', idx);
if (idx !== -1) {
  console.log(content.substring(idx - 50, idx + 200));
}
