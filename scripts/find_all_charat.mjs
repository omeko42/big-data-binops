import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web grep -rn "charAt(0).toUpperCase()" /usr/src/app/.next/ || true`;
console.log(runFE(cmd));
