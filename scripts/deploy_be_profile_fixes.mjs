import { runBE, copyFileToBE } from './be_exec.mjs';

function main() {
    console.log("=== COPYING FILES TO BE HOST VIA PSCP ===");
    copyFileToBE('user.entity.ts', '/tmp/user.entity.ts');
    copyFileToBE('user.service.ts', '/tmp/user.service.ts');
    copyFileToBE('auth.service.ts', '/tmp/auth.service.ts');
    console.log("Files copied to BE host.");

    console.log("=== COPYING INTO DOCKER CONTAINER bdb-api ===");
    runBE(`
        docker cp /tmp/user.entity.ts bdb-api:/usr/src/app/src/app_core/auth/user/entities/user.entity.ts
        docker cp /tmp/user.service.ts bdb-api:/usr/src/app/src/app_core/auth/user/user.service.ts
        docker cp /tmp/auth.service.ts bdb-api:/usr/src/app/src/app_core/auth/auth.service.ts
        rm -f /tmp/user.entity.ts /tmp/user.service.ts /tmp/auth.service.ts
    `);
    console.log("Copied into bdb-api.");

    console.log("=== COMPILING BDB-API (nest build) ===");
    const buildRes = runBE(`docker exec bdb-api npm run build`);
    console.log("Build output:\n", buildRes);

    console.log("=== RESTARTING BDB-API ===");
    runBE(`docker restart bdb-api`);
    console.log("Restart issued. Waiting 7s...");

    setTimeout(() => {
        const ps = runBE(`docker ps --filter "name=bdb-api"`);
        console.log(ps);
        const logs = runBE(`docker logs --tail 25 bdb-api`);
        console.log("Recent logs:\n", logs);
    }, 7000);
}

main();
