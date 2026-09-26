import fs from 'fs';

const content = fs.readFileSync('0-gigr76s0g8t.js', 'utf8');
const start = content.indexOf('function L(');
const end = content.indexOf('className:"cms-user"');

const codeL = content.substring(start, end);
// Regex to find eo = or ec =
const matches = [...codeL.matchAll(/\b(eo|ec)\s*=/g)];
for (const m of matches) {
    const idx = m.index;
    console.log(m[1], 'defined at:', idx, codeL.substring(Math.max(0, idx - 40), Math.min(codeL.length, idx + 100)));
}
