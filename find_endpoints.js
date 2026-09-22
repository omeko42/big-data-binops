const fs = require('fs');

const file = '/usr/src/app/.next/static/chunks/satker-legacy-reconcile-neutral-adc968b7.js';
const content = fs.readFileSync(file, 'utf8');

// find all fetch or axios or api endpoints in content
const matches = content.match(/["'`](\/api\/[^"'`]+|\/bdb\/[^"'`]+)["'`]/g);
console.log('Endpoints found:', [...new Set(matches)]);
