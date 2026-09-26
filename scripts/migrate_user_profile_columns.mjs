import { runQuery } from '../query_helper.mjs';

async function main() {
    console.log("=== CHECKING EXISTING COLUMNS IN auth_users & trb_police ===");
    const resUsers = await runQuery(`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 'auth_users'
          AND column_name IN ('social_media', 'photo_url', 'is_pns', 'secondary_email_verified_at');
    `);
    console.log("Existing columns in auth_users:", resUsers.rows);

    const resPolice = await runQuery(`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 'trb_police'
          AND column_name IN ('social_media', 'is_pns');
    `);
    console.log("Existing columns in trb_police:", resPolice.rows);

    console.log("=== APPLYING SCHEMA MIGRATIONS IF MISSING ===");
    await runQuery(`
        ALTER TABLE auth_users
        ADD COLUMN IF NOT EXISTS social_media JSONB DEFAULT '{}'::jsonb,
        ADD COLUMN IF NOT EXISTS photo_url TEXT,
        ADD COLUMN IF NOT EXISTS is_pns BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS secondary_email_verified_at TIMESTAMP;
    `);

    await runQuery(`
        ALTER TABLE trb_police
        ADD COLUMN IF NOT EXISTS social_media JSONB DEFAULT '{}'::jsonb,
        ADD COLUMN IF NOT EXISTS is_pns BOOLEAN DEFAULT FALSE;
    `);

    console.log("Schema migration applied successfully.");

    // Verify
    const verify = await runQuery(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'auth_users'
          AND column_name IN ('social_media', 'photo_url', 'is_pns', 'secondary_email_verified_at');
    `);
    console.log("Verified auth_users columns:", verify.rows);
}

main().catch(console.error);
