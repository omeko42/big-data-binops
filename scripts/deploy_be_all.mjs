import { runBE, copyFileToBE } from './be_exec.mjs';

console.log('1. Copying service and controller to BE host...');
copyFileToBE('backend-patch/laporan-polisi.service.ts', '/home/clouduser/laporan-polisi.service.ts');
copyFileToBE('backend-patch/laporan-polisi.controller.ts', '/home/clouduser/laporan-polisi.controller.ts');

console.log('2. Copying files to bdb-api container...');
runBE('docker cp /home/clouduser/laporan-polisi.service.ts bdb-api:/usr/src/app/src/bdb/laporan-polisi/laporan-polisi.service.ts && rm /home/clouduser/laporan-polisi.service.ts');
runBE('docker cp /home/clouduser/laporan-polisi.controller.ts bdb-api:/usr/src/app/src/bdb/laporan-polisi/laporan-polisi.controller.ts && rm /home/clouduser/laporan-polisi.controller.ts');

console.log('3. Running nest build inside bdb-api...');
const buildOut = runBE('docker exec bdb-api npm run build');
console.log('Build Output:', buildOut);

console.log('4. Restarting bdb-api...');
runBE('docker restart bdb-api');
console.log('Backend deployed and restarted successfully!');
