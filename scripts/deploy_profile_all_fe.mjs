import { runFE, copyFileToFE } from './fe_exec.mjs';

function main() {
    console.log("=== 1. COPYING CHUNKS TO FE HOST ===");
    copyFileToFE('3def3ti6rk0vr.patched.js', '/tmp/3def3ti6rk0vr.js');
    copyFileToFE('0-gigr76s0g8t.patched.js', '/tmp/0-gigr76s0g8t.js');
    console.log("Files copied to /tmp on FE host.");

    console.log("=== 2. COPYING INTO bdb-web CONTAINER ===");
    const res = runFE(`
        docker exec bdb-web cp /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js.bak2 2>/dev/null || true
        docker exec bdb-web cp /usr/src/app/.next/static/chunks/0-gigr76s0g8t.js /usr/src/app/.next/static/chunks/0-gigr76s0g8t.js.bak2 2>/dev/null || true
        
        docker cp /tmp/3def3ti6rk0vr.js bdb-web:/usr/src/app/.next/static/chunks/3def3ti6rk0vr.js
        docker cp /tmp/0-gigr76s0g8t.js bdb-web:/usr/src/app/.next/static/chunks/0-gigr76s0g8t.js
        
        rm -f /tmp/3def3ti6rk0vr.js /tmp/0-gigr76s0g8t.js
        
        docker exec bdb-web ls -lh /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js /usr/src/app/.next/static/chunks/0-gigr76s0g8t.js
    `);
    console.log(res);

    console.log("=== 3. COMMITTING CONTAINER SNAPSHOT ===");
    const commitRes = runFE(`docker commit bdb-web bdb-web:latest && echo "DOCKER_COMMIT_SUCCESS"`);
    console.log(commitRes);

    console.log("=== DEPLOYMENT AND COMMIT COMPLETED! ===");
}

main();
