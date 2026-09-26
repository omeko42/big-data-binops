import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web find /usr/src/app/.next/static/chunks -type f -name "*.js" -exec grep -l "requires_totp" {} +`;
console.log(runFE(cmd));
