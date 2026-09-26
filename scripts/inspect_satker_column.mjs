import fs from 'fs';

const js = fs.readFileSync('user-page-pagination-v9-dfbc949b.patched.js', 'utf8');
const idx = js.indexOf('header:"Satker Melekat"');
console.log(js.substring(idx - 20, idx + 800));
