import { runBE } from './be_exec.mjs';

const cmd = `docker exec bdb-api grep -rn "user" /usr/src/app/dist/controllers/ || docker exec bdb-api find /usr/src/app/dist -name "*controller*"`;
console.log(runBE(cmd));
