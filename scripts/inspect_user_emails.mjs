import { runQuery } from '../query_helper.mjs';

async function main() {
    const res = await runQuery(`
        SELECT count(*)::int as total,
               count(case when email ilike '%@polri.go.id' then 1 end)::int as email_is_polri,
               count(case when email_polri is not null and trim(email_polri) != '' then 1 end)::int as has_email_polri,
               count(case when email_google is not null and trim(email_google) != '' then 1 end)::int as has_email_google,
               count(case when email not ilike '%@polri.go.id' and (email_polri is null or trim(email_polri) = '') then 1 end)::int as non_polri_no_polri_col
        FROM auth_users;
    `);
    console.log("User email breakdown:", res.rows[0]);

    const sample = await runQuery(`
        SELECT id, name, email, email_polri, email_google, username, role_bdb
        FROM auth_users
        ORDER BY id DESC
        LIMIT 10;
    `);
    console.log("Sample users:", JSON.stringify(sample.rows, null, 2));
}

main().catch(console.error);
