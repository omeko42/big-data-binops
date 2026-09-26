import fs from 'fs';

const code = fs.readFileSync('3jkbfmy5u6eqq.js', 'utf8');

const sIdx = code.indexOf('async function _(a){');
console.log('sIdx:', sIdx);
console.log(code.substring(sIdx, sIdx + 1500));
