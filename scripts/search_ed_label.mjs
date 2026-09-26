import fs from 'fs';

const content = fs.readFileSync('0w77m6y2tq5qr.js', 'utf8');
let idx = 0;
while ((idx = content.indexOf('ed.label', idx)) !== -1) {
    console.log("ed.label at", idx, content.substring(idx - 40, idx + 50));
    idx += 8;
}
