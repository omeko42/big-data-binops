import { copyFileToBE, runBE } from './be_exec.mjs';

async function main() {
    console.log("=== 1. COPYING FILES TO BE HOST ===");
    copyFileToBE('auth.service.ts', '/tmp/auth.service.ts');
    copyFileToBE('user.controller.ts', '/tmp/user.controller.ts');
    copyFileToBE('user.service.ts', '/tmp/user.service.ts');
    console.log("Files copied to /tmp on BE host.");

    console.log("=== 2. COPYING FILES INTO bdb-api CONTAINER ===");
    const res = runBE(`
        docker exec bdb-api cp /usr/src/app/src/app_core/auth/auth.service.ts /usr/src/app/src/app_core/auth/auth.service.ts.bak
        docker exec bdb-api cp /usr/src/app/src/app_core/auth/user/user.controller.ts /usr/src/app/src/app_core/auth/user/user.controller.ts.bak
        docker exec bdb-api cp /usr/src/app/src/app_core/auth/user/user.service.ts /usr/src/app/src/app_core/auth/user/user.service.ts.bak

        docker cp /tmp/auth.service.ts bdb-api:/usr/src/app/src/app_core/auth/auth.service.ts
        docker cp /tmp/user.controller.ts bdb-api:/usr/src/app/src/app_core/auth/user/user.controller.ts
        docker cp /tmp/user.service.ts bdb-api:/usr/src/app/src/app_core/auth/user/user.service.ts

        rm -f /tmp/auth.service.ts /tmp/user.controller.ts /tmp/user.service.ts
    `);
    console.log(res);

    console.log("=== 3. RUNNING NEST BUILD INSIDE CONTAINER ===");
    const buildRes = runBE(`docker exec bdb-api npm run build`);
    console.log(buildRes);

    console.log("=== 4. RESTARTING bdb-api CONTAINER ===");
    runBE(`docker restart bdb-api`);
    console.log("Container restarted. Waiting 5s for startup...");
    await new Promise(r => setTimeout(r, 5000));

    const logs = runBE(`docker logs bdb-api --tail 20`);
    console.log("=== 5. CONTAINER LOGS ===");
    console.log(logs);
}

main().catch(console.error);
