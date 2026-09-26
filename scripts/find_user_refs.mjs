import { runFE } from './fe_exec.mjs';

function main() {
    const res = runFE(`
docker exec bdb-web grep -rnwl "/usr/src/app/.next" -e "user-page-pagination-v9-dfbc949b" 2>/dev/null
    `);
    console.log("References:", res);
}

main();
