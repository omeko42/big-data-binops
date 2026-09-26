import fs from 'fs';

const content = fs.readFileSync('0w77m6y2tq5qr.js', 'utf8');
const idx = content.indexOf('Selamat datang');
console.log(content.substring(idx - 60, idx + 260));
