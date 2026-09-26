import { runFE } from './fe_exec.mjs';

const res = runFE(`docker exec bdb-web grep -rn "59008:" /usr/src/app/.next/static/chunks/`);
console.log(res);
