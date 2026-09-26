import { copyFileToBE, runBE } from './be_exec.mjs';

function main() {
    console.log("=== 1. Copying auth files to BE ===");
    copyFileToBE('auth.controller.ts', '/tmp/auth.controller.ts');
    copyFileToBE('auth.service.ts', '/tmp/auth.service.ts');
    copyFileToBE('user.service.ts', '/tmp/user.service.ts');

    console.log("=== 2. Replacing files in bdb-api container and rebuilding ===");
    const res = runBE(`
        docker exec bdb-api cp /usr/src/app/src/app_core/auth/auth.controller.ts /usr/src/app/src/app_core/auth/auth.controller.ts.bak
        docker exec bdb-api cp /usr/src/app/src/app_core/auth/auth.service.ts /usr/src/app/src/app_core/auth/auth.service.ts.bak
        docker exec bdb-api cp /usr/src/app/src/app_core/auth/user/user.service.ts /usr/src/app/src/app_core/auth/user/user.service.ts.bak
        
        docker cp /tmp/auth.controller.ts bdb-api:/usr/src/app/src/app_core/auth/auth.controller.ts
        docker cp /tmp/auth.service.ts bdb-api:/usr/src/app/src/app_core/auth/auth.service.ts
        docker cp /tmp/user.service.ts bdb-api:/usr/src/app/src/app_core/auth/user/user.service.ts
        
        rm -f /tmp/auth.controller.ts /tmp/auth.service.ts /tmp/user.service.ts
        
        echo "Building bdb-api..."
        docker exec bdb-api npm run build
        
        echo "Restarting bdb-api..."
        docker restart bdb-api
        sleep 5
        docker ps --filter "name=bdb-api"

        echo "Committing bdb-api container image..."
        docker commit bdb-api bdb-api:latest
        echo "DEPLOY_AND_COMMIT_SUCCESS"
    `);
    console.log(res);
}

main();
