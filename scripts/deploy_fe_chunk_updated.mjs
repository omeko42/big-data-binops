import { runFE, copyFileToFE } from './fe_exec.mjs';

console.log('1. Copying patched frontend chunk to FE host...');
copyFileToFE('frontend-patch/laporan-filter-perma-a15e28ec2e81.patched.js', '/home/clouduser/laporan-filter-perma-a15e28ec2e81.js');

console.log('2. Copying from FE host into bdb-web container...');
runFE('docker cp /home/clouduser/laporan-filter-perma-a15e28ec2e81.js bdb-web:/usr/src/app/.next/static/chunks/laporan-filter-perma-a15e28ec2e81.js && rm /home/clouduser/laporan-filter-perma-a15e28ec2e81.js');

console.log('3. Verifying syntax inside bdb-web...');
const syntax = runFE('docker exec bdb-web node -c /usr/src/app/.next/static/chunks/laporan-filter-perma-a15e28ec2e81.js && echo "SYNTAX_OK"');
console.log('Syntax check:', syntax.trim());

console.log('4. Restarting bdb-web container...');
runFE('docker restart bdb-web');
console.log('bdb-web restarted successfully!');
