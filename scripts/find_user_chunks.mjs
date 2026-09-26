import { runFE } from './fe_exec.mjs';

console.log(runFE(`docker exec bdb-web find /usr/src/app/.next/static/chunks -type f -name "*.js" -exec grep -l "Data Pengguna" {} +`));
