import { runFE, copyFileToFE } from './fe_exec.mjs';

console.log('=== Deploying Frontend Chunks to bdb-web ===');

console.log('1. Copying local patched files to FE host...');
copyFileToFE('frontend-patch/3def3ti6rk0vr.patched.js', '/tmp/3def3ti6rk0vr.js');
copyFileToFE('frontend-patch/dashboard-perma-318125d33290_v2.final.js', '/tmp/dashboard-perma.js');
copyFileToFE('frontend-patch/3pp0f_cp6yg-o.patched.js', '/tmp/3pp0f_cp6yg-o.js');

console.log('2. Copying into bdb-web container static chunks...');
const cpCmd = `
docker cp /tmp/3def3ti6rk0vr.js bdb-web:/usr/src/app/.next/static/chunks/3def3ti6rk0vr.js
docker cp /tmp/dashboard-perma.js bdb-web:/usr/src/app/.next/static/chunks/dashboard-perma-318125d33290.js
docker cp /tmp/dashboard-perma.js bdb-web:/usr/src/app/.next/static/chunks/dashboard-perma-318125d33290_v2.js
docker cp /tmp/3pp0f_cp6yg-o.js bdb-web:/usr/src/app/.next/static/chunks/3pp0f_cp6yg-o.js
docker restart bdb-web
`;

console.log(runFE(cpCmd));

console.log('3. Waiting for bdb-web container to reboot...');
Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 5000);

console.log('4. Verifying container content live...');
const verifyCmd = `
echo "=== anak_serse check in 3def ==="
docker exec bdb-web grep -c "anak_serse" /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js || true

echo "=== greeting check in dashboard ==="
docker exec bdb-web grep -c "Robinopsnal Bareskrim Polri" /usr/src/app/.next/static/chunks/dashboard-perma-318125d33290.js || true

echo "=== formatCallsign check in 3pp ==="
docker exec bdb-web grep -c "formatCallsign" /usr/src/app/.next/static/chunks/3pp0f_cp6yg-o.js || true
`;

console.log(runFE(verifyCmd));
console.log('=== Deployment completed successfully! ===');
