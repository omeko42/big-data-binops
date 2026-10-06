import { runBE, copyFileToBE } from './be_exec.mjs';

console.log('1. Copying patched laporan-polisi.service.js to BE host...');
copyFileToBE('backend-patch/laporan-polisi.service.js', '/tmp/laporan-polisi.service.js');

console.log('2. Copying into bdb-api container and restarting...');
const cmd = `
docker cp /tmp/laporan-polisi.service.js bdb-api:/usr/src/app/dist/bdb/laporan-polisi/laporan-polisi.service.js
docker restart bdb-api
`;

console.log(runBE(cmd));

console.log('3. Waiting for bdb-api to boot...');
Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 5000);

console.log('4. Verifying bdb-api logs...');
console.log(runBE('docker logs --tail 20 bdb-api'));
console.log('=== Deployment of LP service fix complete! ===');
