import { runFE } from './fe_exec.mjs';

function main() {
    const res = runFE(`
docker exec bdb-web grep -rnwl "/usr/src/app/.next" -e "3def3ti6rk0vr" 2>/dev/null
    `);
    console.log("Profile references:", res);
}

main();
