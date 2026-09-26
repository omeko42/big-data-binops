import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web find /usr/src/app/.next -name "*manifest*.json"`;
console.log(runFE(cmd));
