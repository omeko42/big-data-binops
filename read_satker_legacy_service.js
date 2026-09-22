const fs = require('fs');

const f = '/usr/src/app/src/bdb/satker/satker-legacy-reconciliation.service.ts';
const content = fs.readFileSync(f, 'utf8');
console.log('Lines count:', content.split('\n').length);
console.log(content.slice(0, 3000));
