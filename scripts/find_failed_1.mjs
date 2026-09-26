import { runQuery } from '../query_helper.mjs';

async function main() {
    const res = await runQuery(`
        SELECT id, name, username, email, email_polri, failed_login_attempts, locked_until
        FROM auth_users 
        WHERE failed_login_attempts = 1
    `);
    console.log(JSON.stringify(res.rows, null, 2));
}

main().catch(console.error);
