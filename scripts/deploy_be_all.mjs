import { copyFileToBE, runBE } from './be_exec.mjs';

function main() {
    console.log("=== 1. Copying user.service.ts and auth.service.ts to BE ===");
    copyFileToBE('user.service.ts', '/tmp/user.service.ts');
    copyFileToBE('auth.service.ts', '/tmp/auth.service.ts');

    console.log("=== 2. Replacing files in bdb-api container and building ===");
    const res = runBE(`
        docker exec bdb-api cp /usr/src/app/src/app_core/auth/user/user.service.ts /usr/src/app/src/app_core/auth/user/user.service.ts.bak-$(date +%s)
        docker exec bdb-api cp /usr/src/app/src/app_core/auth/auth.service.ts /usr/src/app/src/app_core/auth/auth.service.ts.bak-$(date +%s)
        
        docker cp /tmp/user.service.ts bdb-api:/usr/src/app/src/app_core/auth/user/user.service.ts
        docker cp /tmp/auth.service.ts bdb-api:/usr/src/app/src/app_core/auth/auth.service.ts
        
        rm -f /tmp/user.service.ts /tmp/auth.service.ts
        
        echo "Building bdb-api..."
        docker exec bdb-api npm run build
        
        echo "Restarting bdb-api..."
        docker restart bdb-api
        sleep 5
        docker ps --filter "name=bdb-api"
    `);
    console.log(res);
}

main();
