import { runBE } from './be_exec.mjs';

const res = runBE("docker exec bdb-api sed -n '205,250p' /usr/src/app/src/app_core/auth/auth.controller.ts");
console.log(res);
