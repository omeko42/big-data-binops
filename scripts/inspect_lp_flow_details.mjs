import fs from 'fs';

const code = fs.readFileSync('scratch/lp-flow-perma-56d42847ec39.js', 'utf8');

// Find all fetch/axios/http endpoints
const reUrls = /['"`](\/(?:api\/)?[a-zA-Z0-9_\-\/]+)['"`]/g;
const urls = new Set();
let m;
while ((m = reUrls.exec(code)) !== null) {
    if (m[1].includes('/') && (m[1].includes('api') || m[1].includes('wf') || m[1].includes('dokumen') || m[1].includes('lp'))) {
        urls.add(m[1]);
    }
}
console.log('--- RELEVANT URLS IN CHUNK ---');
console.log(Array.from(urls));

// Search for upload or FormData or file handling
console.log('\n--- FORMDATA / FILE HANDLING ---');
let pos = 0;
while ((pos = code.indexOf('FormData', pos)) !== -1) {
    console.log('FormData at', pos, ':\n', code.substring(Math.max(0, pos - 100), Math.min(code.length, pos + 400)));
    pos += 8;
}

// Search for error toasts / messages
console.log('\n--- TOAST / ERROR NOTIFICATIONS ---');
pos = 0;
while ((pos = code.indexOf('severity:"error"', pos)) !== -1) {
    console.log('Error toast at', pos, ':\n', code.substring(Math.max(0, pos - 50), Math.min(code.length, pos + 300)));
    pos += 16;
}
