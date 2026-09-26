import { runQuery } from '../query_helper.mjs';

async function main() {
    const res = await runQuery(`
        SELECT id, name, username, email, email_polri, role_bdb, status, approval_status, 
               failed_login_attempts, locked_until, local_password_enabled, two_factor_required
        FROM auth_users 
        WHERE id = 1 OR lower(email) LIKE '%agung%' OR lower(email_polri) LIKE '%agung%' OR lower(username) LIKE '%agung%'
    `);
    console.log(JSON.stringify(res.rows, null, 2));
}

main().catch(console.error);
