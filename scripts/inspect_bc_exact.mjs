import fs from 'fs';

const content = fs.readFileSync('0-gigr76s0g8t.js', 'utf8');
const idx = content.indexOf('className:"cms-bc-back"');
console.log(content.substring(idx - 60, idx + 250));
