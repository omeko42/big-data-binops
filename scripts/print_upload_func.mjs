import fs from 'fs';

const code = fs.readFileSync('scratch/lp-flow-perma-56d42847ec39.js', 'utf8');

const start = 25000;
const end = 27600;
console.log(code.substring(start, end));
