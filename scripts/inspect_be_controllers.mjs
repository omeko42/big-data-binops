import { runBE } from './be_exec.mjs';

const res = runBE('docker exec bdb-api grep -E "@(Get|Post|Patch|Put|Delete)" /usr/src/app/src/app_core/auth/auth.controller.ts');
console.log('=== AUTH CONTROLLER ===\n' + res);

const res2 = runBE('docker exec bdb-api grep -E "@(Get|Post|Patch|Put|Delete)" /usr/src/app/src/app_core/auth/user/user.controller.ts');
console.log('=== USER CONTROLLER ===\n' + res2);
