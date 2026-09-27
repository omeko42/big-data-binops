import { runFE, copyFileToFE } from './fe_exec.mjs';

function main() {
    console.log("=== 1. COPYING PATCHED CHUNKS TO FE HOST ===");
    copyFileToFE('3def3ti6rk0vr.patched.js', '/tmp/3def3ti6rk0vr.js');
    copyFileToFE('app_cms_profile_page_tsx_0_ymkmx._.patched.js', '/tmp/app_cms_profile_page_tsx_0_ymkmx._.js');
    console.log("Chunks uploaded to /tmp on FE host.");

    console.log("=== 2. DEPLOYING TO bdb-web CONTAINER ===");
    const res = runFE(`
        # Backup
        docker exec bdb-web cp /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js.bak-seamless-$(date +%s) 2>/dev/null || true
        docker exec bdb-web cp /usr/src/app/.next/server/chunks/ssr/app_cms_profile_page_tsx_0_ymkmx._.js /usr/src/app/.next/server/chunks/ssr/app_cms_profile_page_tsx_0_ymkmx._.js.bak-seamless-$(date +%s) 2>/dev/null || true

        # Copy in
        docker cp /tmp/3def3ti6rk0vr.js bdb-web:/usr/src/app/.next/static/chunks/3def3ti6rk0vr.js
        docker cp /tmp/app_cms_profile_page_tsx_0_ymkmx._.js bdb-web:/usr/src/app/.next/server/chunks/ssr/app_cms_profile_page_tsx_0_ymkmx._.js

        # Remove temp files
        rm -f /tmp/3def3ti6rk0vr.js /tmp/app_cms_profile_page_tsx_0_ymkmx._.js

        # Verify presence and size
        docker exec bdb-web ls -lh /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js /usr/src/app/.next/server/chunks/ssr/app_cms_profile_page_tsx_0_ymkmx._.js
    `);
    console.log(res);

    console.log("=== 3. VERIFY STRING IN CONTAINER ===");
    const verifyClient = runFE(`docker exec bdb-web grep -c '1e2a44' /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js || true`);
    const verifySSR = runFE(`docker exec bdb-web grep -c '1e2a44' /usr/src/app/.next/server/chunks/ssr/app_cms_profile_page_tsx_0_ymkmx._.js || true`);
    console.log("Remaining 1e2a44 in client chunk:", verifyClient.trim());
    console.log("Remaining 1e2a44 in SSR chunk:", verifySSR.trim());

    console.log("=== 4. HTTP HEALTH CHECK ===");
    const curlRes = runFE(`docker exec bdb-web curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/cms/profile`);
    console.log("HTTP status for /cms/profile:", curlRes.trim());
}

main();
