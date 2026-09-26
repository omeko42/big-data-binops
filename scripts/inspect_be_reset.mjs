import { runBE } from './be_exec.mjs';

console.log("=== Searching reset-password in backend ===");
const res = runBE(`docker exec bdb-api grep -rn "reset-password" /usr/src/app/src/ || true`);
console.log(res);
