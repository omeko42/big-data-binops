import fs from 'fs';

const content = fs.readFileSync('scratch/fe_auth/user-page-pagination-v9-dfbc949b.patched.js', 'utf8');

let pos = 0;
while (true) {
    const idx = content.indexOf('er(', pos);
    if (idx === -1) break;
    console.log("Found er( at", idx, ":", content.substring(idx - 40, idx + 200));
    pos = idx + 3;
}
