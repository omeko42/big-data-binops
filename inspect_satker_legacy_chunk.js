const fs = require('fs');

const file = '/usr/src/app/.next/static/chunks/satker-legacy-reconcile-neutral-adc968b7.js';
if (!fs.existsSync(file)) {
    console.log('File does not exist:', file);
    process.exit(1);
}

const content = fs.readFileSync(file, 'utf8');
const idx = content.indexOf('Reconcile Manual');
console.log('File size:', content.length);
console.log('Index of "Reconcile Manual":', idx);

if (idx !== -1) {
    const start = Math.max(0, idx - 200);
    const end = Math.min(content.length, idx + 200);
    console.log('--- SNIPPET ---');
    console.log(content.slice(start, end));
    console.log('--- END SNIPPET ---');
}
