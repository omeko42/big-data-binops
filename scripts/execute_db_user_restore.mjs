import { runBE, copyFileToBE } from './be_exec.mjs';
import fs from 'fs';

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
    console.log("Connected to PostgreSQL big_data_binops");

    await c.query("BEGIN");
    try {
        // 1. Restore Dolly (ID 14481) strictly as operator with dolly handle
        const resDolly = await c.query(
            "UPDATE auth_users SET username = 'dolly', callsign = 'dolly', role_bdb = 'operator' WHERE id = 14481 RETURNING id, name, username, callsign, role_bdb"
        );
        console.log("Dolly restored:", resDolly.rows[0]);

        // 2. Restore Idris (ID 15403) as superadmin with idrisganteng handle
        const resIdris = await c.query(
            "UPDATE auth_users SET username = 'idrisganteng', callsign = 'idrisganteng', role_bdb = 'superadmin' WHERE id = 15403 RETURNING id, name, username, callsign, role_bdb"
        );
        console.log("Idris restored:", resIdris.rows[0]);

        // 3. Ensure Eko (ID 1)
        const resEko = await c.query(
            "UPDATE auth_users SET username = 'omeko11', callsign = 'omeko11', role_bdb = 'superadmin' WHERE id = 1 RETURNING id, name, username, callsign, role_bdb"
        );
        console.log("Eko verified:", resEko.rows[0]);

        // 4. Sync callsign from username for any users who have custom username but null callsign
        const resSync = await c.query(\`
            UPDATE auth_users 
            SET callsign = username 
            WHERE (callsign IS NULL OR trim(callsign) = '') 
              AND username IS NOT NULL 
              AND NOT (username LIKE 'user_%')
            RETURNING id, name, username, callsign
        \`);
        console.log("Synced callsigns for other users count:", resSync.rowCount);

        await c.query("COMMIT");
        console.log("ALL USER RESTORATION COMMITTED SUCCESSFULLY!");
    } catch(err) {
        await c.query("ROLLBACK");
        console.error("RESTORATION FAILED:", err);
        process.exit(1);
    }

    // Verify
    const vAll = await c.query("SELECT id, name, username, callsign, role_bdb FROM auth_users WHERE id IN (1, 14481, 15403)");
    console.log("VERIFIED TARGETS:", JSON.stringify(vAll.rows, null, 2));

    await c.end();
})();
`;

fs.writeFileSync('scripts/tmp_restore_users.js', restoreSqlJs);
copyFileToBE('scripts/tmp_restore_users.js', '/tmp/restore_users.js');

const cmd = `
docker cp /tmp/restore_users.js bdb-api:/usr/src/app/restore_users.js
docker exec bdb-api node /usr/src/app/restore_users.js
docker exec bdb-api rm -f /usr/src/app/restore_users.js
`;

try {
    const out = runBE(cmd);
    console.log(out);
} catch (e) {
    console.error('Error:', e.message);
} finally {
    if (fs.existsSync('scripts/tmp_restore_users.js')) fs.unlinkSync('scripts/tmp_restore_users.js');
}
