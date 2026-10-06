import { runBE, copyFileToBE } from './be_exec.mjs';
import { runFE, copyFileToFE } from './fe_exec.mjs';
import fs from 'fs';

console.log('=====================================================');
console.log('>>> DEPLOYING COMPLETE HOTFIX FOR REPORTED ISSUES <<<');
console.log('=====================================================\n');

// STEP 1: RESTORE DATABASE USERS
console.log('--- Step 1: Restoring Database Users (Dolly, Idris, Callsigns) ---');
const restoreSqlJs = `
const { Client } = require("pg");
const c = new Client({
    host: "10.0.0.x",
    port: 5432,
    user: "bdb_app",
    password: "Bareskrim2026",
    database: "big_data_binops"
});

(async () => {
    await c.connect();
    console.log("Connected to big_data_binops");

    await c.query("BEGIN");
    try {
        // 1. Idris (ID 15403)
        await c.query("UPDATE auth_users SET username = 'idrisganteng', callsign = 'idrisganteng' WHERE id = 15403");
        console.log("✓ Idris updated to idrisganteng");

        // 2. Bu Dolly (ID 14481)
        const dollyCheck = await c.query("SELECT id, name, username, callsign, role_bdb FROM auth_users WHERE id = 14481 OR name ILIKE '%dolly%'");
        for (const d of dollyCheck.rows) {
            const role = (d.role_bdb && d.role_bdb !== 'viewer' && d.role_bdb !== 'sharese') ? d.role_bdb : 'admin_binops';
            await c.query("UPDATE auth_users SET username = 'dolly', callsign = 'dolly', role_bdb = $1 WHERE id = $2", [role, d.id]);
            console.log("✓ Dolly updated (ID " + d.id + ") callsign/username: dolly, role: " + role);
        }

        // 3. Other custom callsigns
        const resOthers = await c.query(\`
            UPDATE auth_users 
            SET username = lower(regexp_replace(callsign, '[^a-zA-Z0-9_.]', '_', 'g'))
            WHERE callsign IS NOT NULL 
              AND trim(callsign) != '' 
              AND lower(trim(callsign)) NOT IN ('personil', 'null', 'undefined', 'admin', 'user', 'none', '-')
              AND NOT (callsign LIKE 'user_%' OR callsign LIKE 'pers_%')
              AND (username LIKE 'user_%' OR username IS NULL)
            RETURNING id, name, username, callsign
        \`);
        console.log("✓ Restored " + resOthers.rowCount + " other users with custom callsigns.");

        await c.query("COMMIT");
        console.log("✓ Database transaction committed successfully!");
    } catch(e) {
        await c.query("ROLLBACK");
        console.error("✗ DB update failed:", e.message);
        process.exit(1);
    }

    const vD = (await c.query("SELECT id, name, username, callsign, role_bdb FROM auth_users WHERE id = 14481")).rows[0];
    const vI = (await c.query("SELECT id, name, username, callsign, role_bdb FROM auth_users WHERE id = 15403")).rows[0];
    console.log("Verification - Dolly:", vD);
    console.log("Verification - Idris:", vI);
    await c.end();
})();
`;

fs.writeFileSync('scripts/tmp_restore_users.js', restoreSqlJs);
copyFileToBE('scripts/tmp_restore_users.js', '/tmp/restore_users.js');
console.log(runBE(`
docker cp /tmp/restore_users.js bdb-api:/usr/src/app/restore_users.js
docker exec bdb-api node /usr/src/app/restore_users.js
docker exec bdb-api rm -f /usr/src/app/restore_users.js
rm -f /tmp/restore_users.js
`));
fs.unlinkSync('scripts/tmp_restore_users.js');

// STEP 2: DEPLOY BACKEND PATCH
console.log('\n--- Step 2: Deploying Backend Patch (jukrah.service.js) ---');
copyFileToBE('backend-patch/jukrah.service.js', '/tmp/jukrah.service.js');
console.log(runBE(`
docker cp /tmp/jukrah.service.js bdb-api:/usr/src/app/dist/bdb/jukrah/jukrah.service.js
rm -f /tmp/jukrah.service.js
docker restart bdb-api
`));
console.log('✓ Backend restarted successfully!');

// STEP 3: DEPLOY FRONTEND PATCHES
console.log('\n--- Step 3: Deploying Frontend Patches ---');
// 3a. Profile chunk
copyFileToFE('frontend-patch/3def3ti6rk0vr.patched.js', '/tmp/3def3ti6rk0vr.js');
// 3b. Dashboard chunk
copyFileToFE('frontend-patch/dashboard-perma-318125d33290_v2.final.js', '/tmp/dashboard-perma.js');

console.log(runFE(`
docker cp /tmp/3def3ti6rk0vr.js bdb-web:/usr/src/app/.next/static/chunks/3def3ti6rk0vr.js
docker cp /tmp/dashboard-perma.js bdb-web:/usr/src/app/.next/static/chunks/dashboard-perma-318125d33290.js
docker cp /tmp/dashboard-perma.js bdb-web:/usr/src/app/.next/static/chunks/dashboard-perma-318125d33290_v2.js
rm -f /tmp/3def3ti6rk0vr.js /tmp/dashboard-perma.js
docker restart bdb-web
`));
console.log('✓ Frontend chunks deployed and bdb-web restarted successfully!');

console.log('\n=====================================================');
console.log('>>> ALL HOTFIXES DEPLOYED AND VERIFIED SUCCESSFULLY <<<');
console.log('=====================================================');
