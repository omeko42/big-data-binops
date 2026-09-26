import { runBE } from './be_exec.mjs';

console.log("=== forgotPasswordRequest in auth.service.ts ===");
const res = runBE(`docker exec bdb-api grep -n -A 40 "async forgotPasswordRequest(" /usr/src/app/src/app_core/auth/auth.service.ts`);
console.log(res);
