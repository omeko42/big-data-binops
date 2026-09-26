import { runFE, copyFileToFE } from './fe_exec.mjs';

function main() {
    console.log("=== 1. COPYING user-page-pagination-v9-dfbc949b.patched.js TO FE HOST ===");
    copyFileToFE('user-page-pagination-v9-dfbc949b.patched.js', '/tmp/user-page-pagination-v9-dfbc949b.js');
    console.log("Copied to /tmp/user-page-pagination-v9-dfbc949b.js on FE host.");

    console.log("=== 2. BACKUP AND REPLACE IN bdb-web CONTAINER ===");
    const res = runFE(`
        docker exec bdb-web cp /usr/src/app/.next/static/chunks/user-page-pagination-v9-dfbc949b.js /usr/src/app/.next/static/chunks/user-page-pagination-v9-dfbc949b.js.bak-$(date +%s) 2>/dev/null || true
        docker cp /tmp/user-page-pagination-v9-dfbc949b.js bdb-web:/usr/src/app/.next/static/chunks/user-page-pagination-v9-dfbc949b.js
        rm -f /tmp/user-page-pagination-v9-dfbc949b.js
        
        docker exec bdb-web ls -lh /usr/src/app/.next/static/chunks/user-page-pagination-v9-dfbc949b.js
    `);
    console.log(res);

    console.log("=== 3. COMMIT CONTAINER bdb-web ===");
    const commitRes = runFE(`
        docker commit bdb-web bdb-web:latest
        docker ps --filter "name=bdb-web"
    `);
    console.log(commitRes);
}

main();
