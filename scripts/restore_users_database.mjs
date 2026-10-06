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
        // 1. Restore Idris
        const resIdris = await c.query("UPDATE auth_users SET username = 'idrisganteng', callsign = 'idrisganteng' WHERE id = 15403 RETURNING id, name, username, callsign, role_bdb");
        console.log("Idris restored:", resIdris.rows[0]);

        // 2. Restore Dolly
        // Let's check Dolly's record
        const dollyCheck = await c.query("SELECT id, name, username, callsign, role_bdb FROM auth_users WHERE id = 14481 OR name ILIKE '%dolly%'");
        console.log("Dolly found in DB:", dollyCheck.rows);

        for (const d of dollyCheck.rows) {
            const role = (d.role_bdb && d.role_bdb !== 'viewer' && d.role_bdb !== 'sharese') ? d.role_bdb : 'admin_binops';
            await c.query("UPDATE auth_users SET username = 'dolly', callsign = 'dolly', role_bdb = $1 WHERE id = $2", [role, d.id]);
            console.log("Dolly updated ID " + d.id + " with role " + role);
        }

        // 3. Restore any other users whose callsign is a real custom handle
        const restoreOthers = await c.query(\`
            UPDATE auth_users 
            SET username = lower(regexp_replace(callsign, '[^a-zA-Z0-9_.]', '_', 'g'))
            WHERE callsign IS NOT NULL 
              AND trim(callsign) != '' 
              AND lower(trim(callsign)) NOT IN ('personil', 'null', 'undefined', 'admin', 'user', 'none', '-')
              AND NOT (callsign LIKE 'user_%' OR callsign LIKE 'pers_%')
              AND (username LIKE 'user_%' OR username IS NULL)
            RETURNING id, name, username, callsign
        \`);
        console.log("Other restored users with real callsigns:", restoreOthers.rows);

        await c.query("COMMIT");
        console.log("RESTORATION COMMITTED SUCCESSFULLY!");
    } catch(err) {
        await c.query("ROLLBACK");
        console.error("RESTORATION FAILED:", err);
        process.exit(1);
    }

    // Verify
    const vDolly = await c.query("SELECT id, name, username, callsign, role_bdb FROM auth_users WHERE id = 14481");
    console.log("Verified Dolly:", vDolly.rows[0]);
    const vIdris = await c.query("SELECT id, name, username, callsign, role_bdb FROM auth_users WHERE id = 15403");
    console.log("Verified Idris:", vIdris.rows[0]);

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
    fs.unlinkSync('scripts/tmp_restore_users.js');
}
