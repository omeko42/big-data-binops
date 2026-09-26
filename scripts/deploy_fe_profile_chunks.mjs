import { runFE, copyFileToFE } from './fe_exec.mjs';

function main() {
    console.log("=== 1. COPYING CHUNKS TO FE HOST VIA PSCP ===");
    copyFileToFE('user-page-pagination-v9-dfbc949b.patched.js', '/tmp/user-page-pagination-v9-dfbc949b.js');
    copyFileToFE('3def3ti6rk0vr.patched.js', '/tmp/3def3ti6rk0vr.js');
    console.log("Chunks copied to /tmp on FE host.");

    console.log("=== 2. BACKUP EXISTING AND COPY INTO bdb-web CONTAINER ===");
    const res = runFE(`
        docker exec bdb-web cp /usr/src/app/.next/static/chunks/user-page-pagination-v9-dfbc949b.js /usr/src/app/.next/static/chunks/user-page-pagination-v9-dfbc949b.js.bak 2>/dev/null || true
        docker exec bdb-web cp /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js.bak 2>/dev/null || true
        
        docker cp /tmp/user-page-pagination-v9-dfbc949b.js bdb-web:/usr/src/app/.next/static/chunks/user-page-pagination-v9-dfbc949b.js
        docker cp /tmp/3def3ti6rk0vr.js bdb-web:/usr/src/app/.next/static/chunks/3def3ti6rk0vr.js
        
        rm -f /tmp/user-page-pagination-v9-dfbc949b.js /tmp/3def3ti6rk0vr.js
        
        docker exec bdb-web ls -lh /usr/src/app/.next/static/chunks/user-page-pagination-v9-dfbc949b.js /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js
    `);
    console.log(res);

    console.log("=== 3. VERIFY CONTAINER STATUS ===");
    const ps = runFE(`docker ps --filter "name=bdb-web"`);
    console.log(ps);
}

main();
