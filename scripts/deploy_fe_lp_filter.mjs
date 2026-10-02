import { runFE, copyFileToFE } from './fe_exec.mjs';

console.log('--- Step 1: Backup current remote lp filter chunk ---');
console.log(runFE(`docker exec bdb-web cp -n /usr/src/app/.next/static/chunks/laporan-filter-perma-a15e28ec2e81.js /usr/src/app/.next/static/chunks/laporan-filter-perma-a15e28ec2e81.js.bak-satker-direktorat || true`));

console.log('--- Step 2: Upload patched file to host ---');
copyFileToFE('frontend-patch/laporan-filter-perma-a15e28ec2e81.live.js', '/tmp/laporan-filter-perma-a15e28ec2e81.js');

console.log('--- Step 3: Copy into bdb-web container ---');
console.log(runFE(`
  docker cp /tmp/laporan-filter-perma-a15e28ec2e81.js bdb-web:/usr/src/app/.next/static/chunks/laporan-filter-perma-a15e28ec2e81.js
  docker exec bdb-web chmod 644 /usr/src/app/.next/static/chunks/laporan-filter-perma-a15e28ec2e81.js
  rm -f /tmp/laporan-filter-perma-a15e28ec2e81.js
`));

console.log('--- Step 4: Verification ---');
const res = runFE(`docker exec bdb-web grep -o "DIREKTORAT" /usr/src/app/.next/static/chunks/laporan-filter-perma-a15e28ec2e81.js | head -n 3`);
console.log('Verification result:', res.trim());

const resLimit = runFE(`docker exec bdb-web grep -o "limit: 5" /usr/src/app/.next/static/chunks/laporan-filter-perma-a15e28ec2e81.js`);
console.log('Limit verification:', resLimit.trim());

const resGuard = runFE(`docker exec bdb-web grep -o "isSatkerAllowedForOperator" /usr/src/app/.next/static/chunks/laporan-filter-perma-a15e28ec2e81.js | head -n 3`);
console.log('Guard verification:', resGuard.trim());

const resBadge = runFE(`docker exec bdb-web grep -o "Di Luar Fungsi" /usr/src/app/.next/static/chunks/laporan-filter-perma-a15e28ec2e81.js`);
console.log('Badge verification:', resBadge.trim());

console.log('--- Step 5: Commit container ---');
const resCommit = runFE(`docker commit bdb-web bdb-web:latest`);
console.log('Docker commit:', resCommit.trim());

