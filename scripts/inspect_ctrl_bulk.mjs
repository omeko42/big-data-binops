import { runBE } from './be_exec.mjs';

const res = runBE("docker exec bdb-api sed -n '45,85p' /usr/src/app/src/app_core/auth/user/user.controller.ts");
console.log(res);
