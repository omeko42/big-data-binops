import { runBE } from './be_exec.mjs';

console.log("=== auth.controller.ts around line 240 ===");
console.log(runBE(`docker exec bdb-api sed -n '235,270p' /usr/src/app/src/app_core/auth/auth.controller.ts`));

console.log("=== user.controller.ts around line 75 ===");
console.log(runBE(`docker exec bdb-api sed -n '70,115p' /usr/src/app/src/app_core/auth/user/user.controller.ts`));
