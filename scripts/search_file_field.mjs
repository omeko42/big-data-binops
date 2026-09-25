import fs from 'fs';

const c = fs.readFileSync('scratch/lp-flow-perma-56d42847ec39.js', 'utf8');

let pos = 0;
while ((pos = c.indexOf('"file"', pos)) !== -1) {
    console.log('"file" at', pos, ':\n', c.substring(Math.max(0, pos - 150), Math.min(c.length, pos + 350)));
    pos += 6;
}

console.log('\n--- Search for tM (multi-file) or tF (single-file) ---');
pos = 0;
while ((pos = c.indexOf('tM(', pos)) !== -1) {
    console.log('tM( at', pos, ':\n', c.substring(Math.max(0, pos - 100), Math.min(c.length, pos + 300)));
    pos += 3;
}
pos = 0;
while ((pos = c.indexOf('tF(', pos)) !== -1) {
    console.log('tF( at', pos, ':\n', c.substring(Math.max(0, pos - 100), Math.min(c.length, pos + 300)));
    pos += 3;
}
