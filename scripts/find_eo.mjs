import fs from 'fs';

const content = fs.readFileSync('0-gigr76s0g8t.js', 'utf8');
const userIdx = content.indexOf('className:"cms-user"');

// Search backwards for eo = or similar
console.log(content.substring(userIdx - 3000, userIdx - 1500));
