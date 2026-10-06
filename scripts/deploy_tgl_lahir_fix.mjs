import fs from 'fs';
import cp from 'child_process';
import { runFE, copyFileToFE } from './fe_exec.mjs';

console.log('=== Step 1: Check bdb-web status ===');
const psOut = runFE("docker ps --filter name=bdb-web --format '{{.Names}} - {{.Status}}'");
console.log('bdb-web status:', psOut.trim());

console.log('=== Step 2: Backup remote chunk ===');
runFE("docker exec bdb-web cp /usr/src/app/.next/static/chunks/upload-doc-form-1mb-help-6acc5bceec6e.js /usr/src/app/.next/static/chunks/upload-doc-form-1mb-help-6acc5bceec6e.js.bak-before-tgl-lahir || true");
console.log('Backup created in container.');

console.log('=== Step 3: Copy patched file to FE host and into container ===');
const localPatched = 'upload-doc-fix-20260925/upload-doc-form-1mb-help-6acc5bceec6e.js';
console.log('Local file size:', fs.statSync(localPatched).size, 'bytes');

copyFileToFE(localPatched, '/tmp/upload-doc-form-patched-birth.js');
console.log('Copied to /tmp/upload-doc-form-patched-birth.js on host');

const cpOut = runFE(`
docker cp /tmp/upload-doc-form-patched-birth.js bdb-web:/usr/src/app/.next/static/chunks/upload-doc-form-1mb-help-6acc5bceec6e.js
rm -f /tmp/upload-doc-form-patched-birth.js
echo "DOCKER_CP_DONE"
`);
console.log('Docker cp output:', cpOut.trim());

console.log('=== Step 4: Restart bdb-web container ===');
console.log(runFE('docker restart bdb-web').trim());

console.log('=== Step 5: Verification in container ===');
const verifyOut = runFE(`
sleep 3
echo "--- Check birth regex in container ---"
docker exec bdb-web grep -o "/lahir|birth/i" /usr/src/app/.next/static/chunks/upload-doc-form-1mb-help-6acc5bceec6e.js

echo "--- HTTP test chunk ---"
curl -s -I http://localhost:3000/_next/static/chunks/upload-doc-form-1mb-help-6acc5bceec6e.js | head -n 5
`);
console.log(verifyOut);
console.log('=== DEPLOYMENT COMPLETED ===');
