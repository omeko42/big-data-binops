import { runQuery } from '../query_helper.mjs';

async function main() {
    const res = await runQuery(`
        SELECT id, created_at, user_id, user_nama, action, entity, meta, ip, outcome 
        FROM bdb_audit_log 
        WHERE action = 'LOGIN' 
        ORDER BY created_at DESC 
        LIMIT 10
    `);
    console.log(JSON.stringify(res.rows, null, 2));
}

main().catch(console.error);
