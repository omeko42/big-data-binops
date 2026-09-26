import { runQuery } from '../query_helper.mjs';

async function main() {
    console.log("=== AUTH_USERS TABLE COLUMNS ===");
    const usersCols = await runQuery(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'auth_users'
        ORDER BY ordinal_position;
    `);
    console.log(usersCols.rows.map(r => `${r.column_name} (${r.data_type}, nullable: ${r.is_nullable})`).join('\n'));

    console.log("\n=== TRB_POLICE COLUMNS ===");
    const policeCols = await runQuery(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'trb_police'
        ORDER BY ordinal_position;
    `);
    console.log(policeCols.rows.map(r => `${r.column_name} (${r.data_type})`).join('\n'));

    console.log("\n=== SAMPLE USERS & POLICE PROFILE ===");
    const sample = await runQuery(`
        SELECT u.id, u.name, u.email, u.email_google, u.email_polri, u.username,
               p.nrp, p.pangkat, p.jabatan, p.satuan, p.no_hp
        FROM auth_users u
        LEFT JOIN trb_police p ON p."userId" = u.id
        ORDER BY u.id DESC
        LIMIT 10;
    `);
    console.log(JSON.stringify(sample.rows, null, 2));

    console.log("\n=== DISTINCT PANGKAT IN TRB_POLICE ===");
    const distinctPangkat = await runQuery(`
        SELECT distinct pangkat, count(*) as cnt
        FROM trb_police
        WHERE pangkat is not null and trim(pangkat) != ''
        GROUP BY pangkat
        ORDER BY cnt DESC;
    `);
    console.log(JSON.stringify(distinctPangkat.rows, null, 2));
}

main().catch(console.error);
