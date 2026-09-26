import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web grep -rn "function getUser" /usr/src/app/.next/static/chunks/ || docker exec bdb-web grep -rn "getUser=" /usr/src/app/.next/static/chunks/ || true`;
console.log(runFE(cmd));
