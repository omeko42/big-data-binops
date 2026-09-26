import fs from 'fs';

const content = fs.readFileSync('0-gigr76s0g8t.js', 'utf8');

// Find where L is called with user: c
const uIdx = content.indexOf('user:c,roleLabel:v');
console.log("Usage at:", uIdx);
console.log(content.substring(uIdx - 1500, uIdx + 200));
