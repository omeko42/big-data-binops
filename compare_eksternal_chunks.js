const fs = require('fs');
const p1 = '/home/clouduser/satker-eksternal-fix-20260903/1yixcwazh7jpx.js';
const p2 = '/home/clouduser/satker-eksternal-fix-20260903/satker-eksternal-paged-20260903.js';
const s1 = fs.readFileSync(p1, 'utf8');
const s2 = fs.readFileSync(p2, 'utf8');

console.log('1yixcwazh7jpx.js length:', s1.length);
console.log('satker-eksternal-paged-20260903.js length:', s2.length);

console.log('--- 1yixcwazh7jpx.js API calls ---');
console.log(s1.match(/\/bdb\/[a-zA-Z0-9_\-\/]+/g));

console.log('--- satker-eksternal-paged-20260903.js API calls ---');
console.log(s2.match(/\/bdb\/[a-zA-Z0-9_\-\/]+/g));
