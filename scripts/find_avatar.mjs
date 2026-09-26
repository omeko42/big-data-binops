import { runFE } from './fe_exec.mjs';

const res = runFE(`docker exec bdb-web grep -rn -l "cms-user-avatar" /usr/src/app/.next/static/chunks/`);
console.log(res);
