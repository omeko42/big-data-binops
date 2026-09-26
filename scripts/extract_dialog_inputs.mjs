import fs from 'fs';

const content = fs.readFileSync('scratch/fe_auth/user-page-pagination-v9-dfbc949b.patched.js', 'utf8');

const dialogIdx = 55441;
console.log(content.substring(dialogIdx + 400, dialogIdx + 2000));
