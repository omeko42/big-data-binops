import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web grep -rn "cms-user-avatar" /usr/src/app/.next/server/ || true`;
console.log(runFE(cmd));
