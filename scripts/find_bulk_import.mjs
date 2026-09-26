import { runBE } from './be_exec.mjs';

const res = runBE("docker exec bdb-api grep -rn 'bulk-import' /usr/src/app/src/ 2>/dev/null || true");
console.log(res);
