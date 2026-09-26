import fs from 'fs';

const content = fs.readFileSync('user-page-pagination-v9-dfbc949b.patched.js', 'utf8');
const idx = content.indexOf('sortField:"email_polri"');
console.log(content.substring(idx - 50, idx + 600));
