import { runBE } from './be_exec.mjs';

const cmd = `docker exec bdb-api printenv | grep DB`;
console.log(runBE(cmd));
