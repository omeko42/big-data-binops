"use strict";
/**
 * Master User Callsign & Username 2-Word Standardizer + Bidirectional DB Trigger Installer
 *
 * Rules:
 * 1. User ID = 1 is always preserved as `om.eko_42` (`@om.eko_42`).
 * 2. All other users derive their base handle from `auth_users.name` (first 2 words after
 *    stripping academic degrees after comma `,` and stripping police/military/civilian ranks & titles).
 *    Example: "Briptu Eko Agung Krisdianto, S.Kom." -> "eko.agung"
 *    Example: "Cantya Diana Rismarini, S.H." -> "cantya.diana"
 *    Example: "Budi" -> "budi"
 * 3. Disambiguation numbers (`_1`, `_2`, ...) are appended ONLY when 2 or more users share the
 *    exact same `baseUsername` (ordered by `id ASC`). Unique `baseUsername`s never get numbers.
 * 4. Synchronizes `auth_users.username = auth_users.callsign = bdb_user_social_profiles.callsign`
 *    and installs PostgreSQL triggers to keep them bidirectionally synced on INSERT/UPDATE.
 */

const path = require("path");
const fs = require("fs");

const RANK_AND_TITLE_STOPWORDS = new Set([
    // Police & Military Ranks
    "jenderal", "komjen", "irjen", "brigjen", "kombes", "akbp", "kompol", "akp",
    "iptu", "ipda", "aiptu", "aipda", "bripka", "brigpol", "brigadir", "briptu", "bripda",
    "abrip", "abriptu", "abripda", "bharaka", "bharatu", "bharada",
    "pol", "polri", "tni", "purn",
    // Civil Servant / Honorifics
    "pns", "asn", "cpns", "pembina", "penata", "pengatur", "juru", "penda",
    "dr", "drs", "dra", "ir", "prof", "h", "hj", "kh", "ny", "tn", "alm",
    // Academic Degrees (if written without comma)
    "sh", "sik", "mh", "msi", "skom", "st", "ssos", "spd", "sap", "spsi", "se",
    "mm", "msc", "mkrim", "amd", "phd", "mkom", "mt", "mpd", "ma", "mkn",
    "sp", "shi", "mip", "map", "skm", "skep", "ners", "apt", "psi"
]);

/**
 * Extracts clean 2-word lowercase callsign/username from a personnel full name.
 * Strips everything from the first comma `,` onwards, removes ranks/titles/degrees,
 * and joins the first 2 remaining words with `.`.
 */
function extractTwoWordBaseCallsign(rawName, fallbackId) {
    if (Number(fallbackId) === 1 || String(fallbackId) === "1") return "om.eko_42";
    const str = String(rawName || "").trim();
    // 1. Strip everything from the first comma onwards (academic degrees like ", S.Kom., S.H., M.H.")
    let beforeComma = str.split(",")[0] || "";

    // 2. Strip common dotted degree/title patterns that might appear before a comma
    beforeComma = beforeComma
        .replace(/\b(s\.h|s\.i\.k|s\.kom|s\.t|s\.sos|s\.pd|s\.psi|s\.e|s\.ap|s\.ip|m\.h|m\.si|m\.m|m\.sc|m\.kom|m\.krim|ph\.d|a\.md|dr|drs|dra|ir|prof|h|hj)\b\.?/gi, " ")
        .replace(/\([^)]*\)/g, " ");

    // 3. Split into tokens and normalize to alphanumeric lowercase
    const rawTokens = beforeComma
        .toLowerCase()
        .replace(/[^a-z0-9\s.\-']/g, " ")
        .split(/[\s.\-']+/)
        .map((w) => w.replace(/[^a-z0-9]/g, ""))
        .filter(Boolean);

    // 4. Filter out ranks, titles, degrees, and pure numbers (NRP/NIP)
    const filtered = rawTokens.filter((w) => {
        if (!w) return false;
        if (/^\d+$/.test(w)) return false;
        if (RANK_AND_TITLE_STOPWORDS.has(w)) return false;
        return true;
    });

    // Prefer tokens with at least 2 characters if >= 2 such tokens exist (avoids 1-letter initials like "M.")
    const multiChar = filtered.filter((w) => w.length >= 2);
    const chosenPool = multiChar.length >= 2 ? multiChar : (multiChar.length === 1 && filtered.length === 1 ? multiChar : (multiChar.length >= 1 ? multiChar : filtered));

    if (chosenPool.length >= 2) {
        return `${chosenPool[0]}.${chosenPool[1]}`.slice(0, 60);
    }
    if (chosenPool.length === 1) {
        return chosenPool[0].slice(0, 60);
    }

    // Fallback if name had no valid alphabetic words
    return `personil.${String(fallbackId || "0").replace(/[^0-9]/g, "") || "0"}`;
}

/**
 * Checks whether a handle is empty, auto-generated (`user_<hex>`, `pers_...`),
 * email-local-part derived, 3+ words, or contains trailing digits attached to letters.
 */
function isAutoOrUnstandardizedHandle(handle, email, emailPolri) {
    if (!handle) return true;
    const h = String(handle).trim().replace(/^@+/, "").toLowerCase();
    if (!h || h.length < 3) return true;
    if (h === "om.eko_42" || h === "omeko42") return false;
    if (/^user_[0-9a-f_]+$/i.test(h) || h.startsWith("user_") || h.startsWith("pers_")) return true;
    if (/^\d+$/.test(h)) return true;

    const emailLocal = String(email || "").split("@")[0].trim().toLowerCase();
    const polriLocal = String(emailPolri || "").split("@")[0].trim().toLowerCase();
    if (emailLocal && h === emailLocal) return true;
    if (polriLocal && h === polriLocal) return true;

    // 3 or more dot-separated words (e.g. cantya.diana.rismarini)
    const dotParts = h.split(".");
    if (dotParts.length >= 3) return true;

    // Trailing digits attached directly to letters without underscore (e.g. mat.doang7, inggrid12)
    if (/[a-z]\d+$/i.test(h)) return true;

    return false;
}

/**
 * Installs PostgreSQL helper functions and bidirectional triggers between
 * `auth_users` (username, callsign) and `bdb_user_social_profiles` (callsign).
 */
async function installCallsignTriggers(runQuery) {
    // 1. SQL function for 2-word extraction inside PostgreSQL triggers
    await runQuery(`
        CREATE OR REPLACE FUNCTION fn_extract_two_word_callsign(raw_name TEXT, fallback_id BIGINT DEFAULT 0)
        RETURNS VARCHAR AS $$
        DECLARE
            clean_str TEXT;
            tok TEXT;
            tokens TEXT[];
            multi_tokens TEXT[];
            stopwords TEXT[] := ARRAY[
                'jenderal','komjen','irjen','brigjen','kombes','akbp','kompol','akp',
                'iptu','ipda','aiptu','aipda','bripka','brigpol','brigadir','briptu','bripda',
                'abrip','abriptu','abripda','bharaka','bharatu','bharada',
                'pol','polri','tni','purn','pns','asn','cpns',
                'pembina','penata','pengatur','juru','penda',
                'dr','drs','dra','ir','prof','h','hj','kh','ny','tn','alm',
                'sh','sik','mh','msi','skom','st','ssos','spd','sap','spsi','se',
                'mm','msc','mkrim','amd','phd','mkom','mt','mpd','ma','mkn',
                'sp','shi','mip','map','skm','skep','ners','apt','psi'
            ];
            res TEXT;
        BEGIN
            IF fallback_id = 1 THEN
                RETURN 'om.eko_42';
            END IF;

            clean_str := split_part(COALESCE(raw_name, ''), ',', 1);
            clean_str := regexp_replace(clean_str, '\\([^)]*\\)', ' ', 'g');
            clean_str := lower(regexp_replace(clean_str, '[^a-zA-Z0-9\\s.\\-'']', ' ', 'g'));

            tokens := ARRAY[]::TEXT[];
            multi_tokens := ARRAY[]::TEXT[];

            FOREACH tok IN ARRAY regexp_split_to_array(clean_str, '[\\s.\\-'']+')
            LOOP
                tok := regexp_replace(tok, '[^a-z0-9]', '', 'g');
                IF tok <> '' AND tok !~ '^[0-9]+$' AND NOT (tok = ANY(stopwords)) THEN
                    tokens := array_append(tokens, tok);
                    IF length(tok) >= 2 THEN
                        multi_tokens := array_append(multi_tokens, tok);
                    END IF;
                END IF;
            END LOOP;

            IF array_length(multi_tokens, 1) >= 2 THEN
                res := multi_tokens[1] || '.' || multi_tokens[2];
            ELSIF array_length(multi_tokens, 1) = 1 THEN
                res := multi_tokens[1];
            ELSIF array_length(tokens, 1) >= 2 THEN
                res := tokens[1] || '.' || tokens[2];
            ELSIF array_length(tokens, 1) = 1 THEN
                res := tokens[1];
            ELSE
                res := 'personil.' || COALESCE(fallback_id::TEXT, '0');
            END IF;

            RETURN substring(res from 1 for 60);
        END;
        $$ LANGUAGE plpgsql IMMUTABLE;
    `);

    // 2. BEFORE INSERT OR UPDATE trigger on auth_users to keep username == callsign
    await runQuery(`
        CREATE OR REPLACE FUNCTION fn_before_auth_users_callsign_sync()
        RETURNS TRIGGER AS $$
        DECLARE
            candidate TEXT;
            base_h TEXT;
            suffix_idx INT := 1;
            probe TEXT;
            conflict_exists BOOLEAN;
        BEGIN
            IF NEW.id = 1 THEN
                NEW.username := 'om.eko_42';
                NEW.callsign := 'om.eko_42';
                RETURN NEW;
            END IF;

            -- Determine which field changed or is being set
            IF TG_OP = 'UPDATE' THEN
                IF NEW.username IS DISTINCT FROM OLD.username AND COALESCE(btrim(NEW.username), '') <> '' THEN
                    candidate := lower(regexp_replace(btrim(NEW.username), '^@+', ''));
                ELSIF NEW.callsign IS DISTINCT FROM OLD.callsign AND COALESCE(btrim(NEW.callsign), '') <> '' THEN
                    candidate := lower(regexp_replace(btrim(NEW.callsign), '^@+', ''));
                ELSE
                    candidate := lower(regexp_replace(btrim(COALESCE(NULLIF(NEW.callsign, ''), NULLIF(NEW.username, ''), '')), '^@+', ''));
                END IF;
            ELSE
                candidate := lower(regexp_replace(btrim(COALESCE(NULLIF(NEW.callsign, ''), NULLIF(NEW.username, ''), '')), '^@+', ''));
            END IF;

            -- Reject auto-generated user_<hex> or empty handles -> generate 2-word handle from name
            IF candidate IS NULL OR candidate = '' OR candidate ~ '^user_[0-9a-f_]+$' OR candidate LIKE 'user_%' OR candidate LIKE 'pers_%' THEN
                base_h := fn_extract_two_word_callsign(NEW.name, NEW.id);
                probe := base_h;
                LOOP
                    SELECT EXISTS(
                        SELECT 1 FROM auth_users
                        WHERE id IS DISTINCT FROM NEW.id
                          AND (lower(username) = probe OR lower(callsign) = probe)
                    ) INTO conflict_exists;
                    EXIT WHEN NOT conflict_exists;
                    probe := base_h || '_' || suffix_idx::TEXT;
                    suffix_idx := suffix_idx + 1;
                    EXIT WHEN suffix_idx > 500;
                END LOOP;
                candidate := probe;
            END IF;

            NEW.username := candidate;
            NEW.callsign := candidate;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
    `);

    await runQuery(`
        DROP TRIGGER IF EXISTS trg_sync_master_user_callsign ON auth_users;
        CREATE TRIGGER trg_sync_master_user_callsign
        BEFORE INSERT OR UPDATE OF name, username, callsign ON auth_users
        FOR EACH ROW
        EXECUTE FUNCTION fn_before_auth_users_callsign_sync();
    `);

    // 3. Ensure bdb_user_social_profiles table exists and has bidirectional sync trigger
    await runQuery(`
        CREATE TABLE IF NOT EXISTS bdb_user_social_profiles (
            user_id BIGINT PRIMARY KEY,
            callsign VARCHAR(100),
            bio TEXT,
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        ALTER TABLE bdb_user_social_profiles ADD COLUMN IF NOT EXISTS callsign VARCHAR(100);
        ALTER TABLE bdb_user_social_profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
    `);

    await runQuery(`
        CREATE OR REPLACE FUNCTION fn_after_auth_users_callsign_sync()
        RETURNS TRIGGER AS $$
        BEGIN
            IF pg_trigger_depth() > 1 THEN
                RETURN NEW;
            END IF;
            IF NEW.id IS NOT NULL AND COALESCE(NEW.callsign, '') <> '' THEN
                BEGIN
                    INSERT INTO bdb_user_social_profiles (user_id, callsign, updated_at)
                    VALUES (NEW.id, NEW.callsign, NOW())
                    ON CONFLICT (user_id) DO UPDATE
                    SET callsign = EXCLUDED.callsign,
                        updated_at = NOW()
                    WHERE bdb_user_social_profiles.callsign IS DISTINCT FROM EXCLUDED.callsign;
                EXCEPTION WHEN OTHERS THEN
                    -- Ignore if bdb_user_social_profiles has a different constraint in legacy schema
                    UPDATE bdb_user_social_profiles
                    SET callsign = NEW.callsign
                    WHERE user_id = NEW.id AND callsign IS DISTINCT FROM NEW.callsign;
                END;
            END IF;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
    `);

    await runQuery(`
        DROP TRIGGER IF EXISTS trg_after_sync_master_user_callsign ON auth_users;
        CREATE TRIGGER trg_after_sync_master_user_callsign
        AFTER INSERT OR UPDATE OF username, callsign ON auth_users
        FOR EACH ROW
        EXECUTE FUNCTION fn_after_auth_users_callsign_sync();
    `);

    await runQuery(`
        CREATE OR REPLACE FUNCTION fn_sync_social_profile_callsign()
        RETURNS TRIGGER AS $$
        DECLARE
            clean_c VARCHAR(100);
        BEGIN
            IF pg_trigger_depth() > 1 THEN
                RETURN NEW;
            END IF;
            clean_c := lower(regexp_replace(btrim(COALESCE(NEW.callsign, '')), '^@+', ''));
            IF clean_c <> '' AND clean_c !~ '^user_[0-9a-f_]+$' THEN
                UPDATE auth_users
                SET username = clean_c,
                    callsign = clean_c
                WHERE id = NEW.user_id
                  AND id <> 1
                  AND (username IS DISTINCT FROM clean_c OR callsign IS DISTINCT FROM clean_c);
            END IF;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
    `);

    await runQuery(`
        DROP TRIGGER IF EXISTS trg_sync_social_profile_callsign ON bdb_user_social_profiles;
        CREATE TRIGGER trg_sync_social_profile_callsign
        AFTER INSERT OR UPDATE OF callsign ON bdb_user_social_profiles
        FOR EACH ROW
        EXECUTE FUNCTION fn_sync_social_profile_callsign();
    `);
}

/**
 * Main idempotent synchronization routine.
 * Accepts either a TypeORM DataSource (where `.query()` returns rows array)
 * or a `pg` Pool/Client (where `.query()` returns `{ rows }`).
 */
async function syncMasterUserCallsigns(executor, options = {}) {
    const runQuery = async (sql, params = []) => {
        const res = await executor.query(sql, params);
        if (Array.isArray(res)) return res;
        if (res && Array.isArray(res.rows)) return res.rows;
        return [];
    };

    // 1. Ensure columns exist with sufficient length
    await runQuery(`ALTER TABLE auth_users ADD COLUMN IF NOT EXISTS username VARCHAR(100);`);
    await runQuery(`ALTER TABLE auth_users ADD COLUMN IF NOT EXISTS callsign VARCHAR(100);`);
    try {
        await runQuery(`ALTER TABLE auth_users ALTER COLUMN callsign TYPE VARCHAR(100);`);
    } catch (_) {}

    // 2. Check if initial full standardization v2 has already been applied
    await runQuery(`
        CREATE TABLE IF NOT EXISTS bdb_system_settings (
            key VARCHAR(120) PRIMARY KEY,
            value TEXT,
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );
    `);
    const settingRows = await runQuery(
        `SELECT value FROM bdb_system_settings WHERE key = 'master_user_callsign_2word_v2' LIMIT 1`
    );
    const fullSyncAlreadyDone = Boolean(settingRows.length && settingRows[0].value === "1") && !options.forceFull;

    // 3. Load all users from auth_users ordered by id ASC
    const users = await runQuery(`
        SELECT id, name, email, email_polri, username, callsign
        FROM auth_users
        ORDER BY id ASC
    `);

    if (!users.length) {
        await installCallsignTriggers(runQuery);
        return { totalUsers: 0, updatedCount: 0 };
    }

    // 4. Compute base 2-word handles for all users
    // On first run (or forceFull): standardize ALL users except id=1 ('om.eko_42') to the 2-word name rule.
    // On subsequent runs: preserve already-standardized handles unless empty, mismatched, or auto/unstandardized.
    const groupsByBase = new Map();
    const fixedByUserId = new Map();
    const usedHandles = new Set();

    for (const u of users) {
        const uid = Number(u.id);
        if (uid === 1) {
            fixedByUserId.set(uid, "om.eko_42");
            usedHandles.add("om.eko_42");
            continue;
        }

        const existingHandle = String(u.callsign || u.username || "")
            .trim()
            .replace(/^@+/, "")
            .toLowerCase();

        if (
            fullSyncAlreadyDone &&
            existingHandle &&
            u.username === u.callsign &&
            !isAutoOrUnstandardizedHandle(existingHandle, u.email, u.email_polri)
        ) {
            fixedByUserId.set(uid, existingHandle);
            usedHandles.add(existingHandle);
            continue;
        }

        const baseUsername = extractTwoWordBaseCallsign(u.name, uid);
        if (!groupsByBase.has(baseUsername)) {
            groupsByBase.set(baseUsername, []);
        }
        groupsByBase.get(baseUsername).push(u);
    }

    // 5. Disambiguate ONLY when 2 or more users share the exact same baseUsername
    const finalByUserId = new Map(fixedByUserId);

    for (const [baseUsername, group] of groupsByBase.entries()) {
        // Sort deterministically by id ASC
        group.sort((a, b) => Number(a.id) - Number(b.id));

        if (group.length === 1 && !usedHandles.has(baseUsername)) {
            const uid = Number(group[0].id);
            finalByUserId.set(uid, baseUsername);
            usedHandles.add(baseUsername);
        } else {
            let counter = 1;
            for (const u of group) {
                const uid = Number(u.id);
                let candidate = `${baseUsername}_${counter}`;
                while (usedHandles.has(candidate)) {
                    counter++;
                    candidate = `${baseUsername}_${counter}`;
                }
                finalByUserId.set(uid, candidate);
                usedHandles.add(candidate);
                counter++;
            }
        }
    }

    // 6. Collect rows that need updating in auth_users
    const updateIds = [];
    const updateHandles = [];

    for (const u of users) {
        const uid = Number(u.id);
        const targetHandle = finalByUserId.get(uid);
        if (!targetHandle) continue;
        if (u.username !== targetHandle || u.callsign !== targetHandle) {
            updateIds.push(uid);
            updateHandles.push(targetHandle);
        }
    }

    // 7. Temporarily drop triggers before bulk update to avoid mid-chunk uniqueness conflicts
    await runQuery(`DROP TRIGGER IF EXISTS trg_sync_master_user_callsign ON auth_users;`);
    await runQuery(`DROP TRIGGER IF EXISTS trg_after_sync_master_user_callsign ON auth_users;`);

    // 8. Perform batch update on auth_users using two-phase update to prevent unique index collisions
    if (updateIds.length > 0) {
        await runQuery(
            `UPDATE auth_users
             SET username = '__tmp_cs_' || id::text,
                 callsign = '__tmp_cs_' || id::text
             WHERE id = ANY($1::bigint[])`,
            [updateIds]
        );
    }

    const CHUNK_SIZE = 2000;
    for (let i = 0; i < updateIds.length; i += CHUNK_SIZE) {
        const chunkIds = updateIds.slice(i, i + CHUNK_SIZE);
        const chunkHandles = updateHandles.slice(i, i + CHUNK_SIZE);
        await runQuery(
            `UPDATE auth_users AS u
             SET username = v.new_handle,
                 callsign = v.new_handle
             FROM UNNEST($1::bigint[], $2::varchar[]) AS v(user_id, new_handle)
             WHERE u.id = v.user_id
               AND (u.username IS DISTINCT FROM v.new_handle OR u.callsign IS DISTINCT FROM v.new_handle)`,
            [chunkIds, chunkHandles]
        );
    }

    // 8b. Install triggers & social profile table after bulk update
    await installCallsignTriggers(runQuery);

    // 9. Sync bdb_user_social_profiles with auth_users
    try {
        await runQuery(`
            INSERT INTO bdb_user_social_profiles (user_id, callsign, updated_at)
            SELECT id, callsign, NOW()
            FROM auth_users
            WHERE callsign IS NOT NULL AND callsign <> ''
            ON CONFLICT (user_id) DO UPDATE
            SET callsign = EXCLUDED.callsign,
                updated_at = NOW()
            WHERE bdb_user_social_profiles.callsign IS DISTINCT FROM EXCLUDED.callsign;
        `);
    } catch (_) {
        try {
            await runQuery(`
                UPDATE bdb_user_social_profiles sp
                SET callsign = u.callsign
                FROM auth_users u
                WHERE sp.user_id = u.id
                  AND sp.callsign IS DISTINCT FROM u.callsign;
            `);
        } catch (_e2) {}
    }

    // 9b. Rewrite any legacy @user_<id><hex> mentions inside bdb_social_posts and bdb_social_comments
    try {
        for (const tbl of ["bdb_social_posts", "bdb_social_comments"]) {
            const rows = await runQuery(
                `SELECT id, content FROM ${tbl} WHERE content ~ '@user_[0-9a-f]+'`
            );
            for (const r of rows) {
                const nextContent = String(r.content || "").replace(
                    /@user_(\d+)[0-9a-f]{4}/gi,
                    (match, uidStr) => {
                        const target = finalByUserId.get(Number(uidStr));
                        return target ? `@${target}` : match;
                    }
                );
                if (nextContent !== r.content) {
                    await runQuery(`UPDATE ${tbl} SET content = $1 WHERE id = $2`, [
                        nextContent,
                        r.id
                    ]);
                }
            }
        }
    } catch (_) {}

    // 10. Mark initial full standardization as completed
    if (!fullSyncAlreadyDone) {
        await runQuery(
            `INSERT INTO bdb_system_settings (key, value, updated_at)
             VALUES ('master_user_callsign_2word_v2', '1', NOW())
             ON CONFLICT (key) DO UPDATE SET value = '1', updated_at = NOW()`
        );
    }

    return {
        totalUsers: users.length,
        updatedCount: updateIds.length
    };
}

// Allow standalone CLI execution: `node backend/scripts/sync_master_user_callsigns.js`
if (require.main === module) {
    (async () => {
        try {
            const envPath = path.join(__dirname, "..", ".env");
            if (fs.existsSync(envPath)) {
                const envContent = fs.readFileSync(envPath, "utf8");
                for (const line of envContent.split(/\r?\n/)) {
                    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
                    if (m && !process.env[m[1]]) {
                        process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, "");
                    }
                }
            }
            const { Pool } = require("pg");
            const pool = new Pool({
                host: process.env.DB_HOST || "127.0.0.1",
                port: Number(process.env.DB_PORT || 5432),
                user: process.env.DB_USERNAME || "postgres",
                password: process.env.DB_PASSWORD || "",
                database: process.env.DB_DATABASE || "bdb_dev"
            });
            try {
                const res = await syncMasterUserCallsigns(pool, { forceFull: true });
                console.log(`[sync_master_user_callsigns] Done: total=${res.totalUsers}, updated=${res.updatedCount}`);
                const sample = await pool.query(
                    `SELECT id, name, username, callsign FROM auth_users ORDER BY (id = 1) DESC, id ASC LIMIT 25`
                );
                console.table(sample.rows);
            } finally {
                await pool.end();
            }
        } catch (err) {
            console.error("[sync_master_user_callsigns] Error:", err?.message || err);
            process.exitCode = 1;
        }
    })();
}

module.exports = {
    extractTwoWordBaseCallsign,
    isAutoOrUnstandardizedHandle,
    installCallsignTriggers,
    syncMasterUserCallsigns
};
