import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web find /usr/src/app/.next -type f -exec grep -l "user-page-pagination-v9" {} +`;
console.log(runFE(cmd));
