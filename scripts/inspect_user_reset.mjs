import { runBE } from './be_exec.mjs';

console.log("=== resetPasswordAndNotify in user.service.ts ===");
const res = runBE(`docker exec bdb-api grep -n -A 40 "async resetPasswordAndNotify(" /usr/src/app/src/app_core/auth/user/user.service.ts`);
console.log(res);
