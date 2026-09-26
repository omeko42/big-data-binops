import { runFE } from './fe_exec.mjs';

console.log("Committing container bdb-web to preserve patched chunks...");
const res = runFE(`
docker commit bdb-web bdb-web:persisted-$(date +%Y%m%d%H%M) &&
echo "BDB-WEB COMMIT SUCCESS"
`);
console.log(res);
