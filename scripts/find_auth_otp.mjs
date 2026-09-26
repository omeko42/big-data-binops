import { runBE } from './be_exec.mjs';

const res = runBE('docker exec bdb-api grep -rn "otp" /usr/src/app/src/authentication/ | head -n 40');
console.log(res);

const res2 = runBE('docker exec bdb-api grep -rn "password" /usr/src/app/src/authentication/auth.controller.ts');
console.log('Controller password endpoints:\n', res2);
