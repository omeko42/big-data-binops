import fs from 'fs';

const content = fs.readFileSync('0-gigr76s0g8t.js', 'utf8');

// Find where c comes from
const uIdx = content.indexOf('user:c,roleLabel:v');
console.log(content.substring(uIdx - 4000, uIdx - 2000));
