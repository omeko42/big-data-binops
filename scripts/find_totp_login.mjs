import { runFE } from './fe_exec.mjs';

const res = runFE(`docker exec bdb-web cat /usr/src/app/.next/static/chunks/0e6hr18kin4n-.js`);
console.log(res);
