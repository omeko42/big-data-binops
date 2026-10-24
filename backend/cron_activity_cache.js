const { Client } = require('pg');

async function run() {
    console.log('Connecting to database...');
    const client = new Client({
        host: process.env.DB_HOST || '127.0.0.1',
        port: parseInt(process.env.DB_PORT || '5432'),
        user: process.env.DB_USERNAME || 'bdb_app',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_DATABASE || 'big_data_binops',
        statement_timeout: 30000
    });
    await client.connect();
    console.log('Connected.');

    console.log('--- Aggregating activity data from last 30 days ---');
    console.time('aggregate');

    // 1. Get activity summary per user from bdb_audit_log for last 30 days
    const auditStats = await client.query(`
        SELECT 
            user_id,
            count(DISTINCT date(created_at)) as active_days,
            count(*) filter (where action in ('UPDATE_DOCUMENT', 'SET_SUB_DIT_PENANGANAN', 'SET_TINGKAT_KESULITAN', 'SET_OPERASI_SATGAS') or (action = 'POST' and entity in ('bdb/laporan-polisi', 'bdb/lp-pelimpahan'))) as lp_updated,
            count(*) filter (where action = 'POST' and entity = 'bdb/wf') as docs_uploaded,
            count(*) filter (where action = 'GET' and entity in ('bdb/kinerja-perkara', 'bdb/laporan-polisi')) as view_actions,
            max(created_at) as last_audit_time
        FROM bdb_audit_log
        WHERE created_at >= NOW() - INTERVAL '30 days'
          AND user_id IS NOT NULL
        GROUP BY user_id
    `);
    console.log(`Found audit activity for ${auditStats.rows.length} users.`);

    // 2. Get active documents from bdb_dokumen (FIX & NETTO: excludes deleted tutorial/test documents)
    const docStats = await client.query(`
        SELECT 
            created_by as user_id,
            count(*) as total_active_docs,
            count(*) filter (where nomor_dokumen IS NOT NULL AND nomor_dokumen NOT ILIKE '%prememory%' AND trim(nomor_dokumen) <> '') as valid_docs,
            count(*) filter (where nomor_dokumen ILIKE '%prememory%') as prememory_docs
        FROM bdb_dokumen
        WHERE created_at >= NOW() - INTERVAL '30 days'
          AND created_by IS NOT NULL
        GROUP BY created_by
    `);
    console.log(`Found active bdb_dokumen for ${docStats.rows.length} users.`);
    const docMap = new Map(docStats.rows.map(r => [Number(r.user_id), r]));

    const auditMap = new Map();
    for (const r of auditStats.rows) {
        auditMap.set(Number(r.user_id), {
            active_days: Number(r.active_days || 0),
            lp_updated: Number(r.lp_updated || 0),
            docs_uploaded: Number(r.docs_uploaded || 0),
            view_actions: Number(r.view_actions || 0),
            last_audit_time: r.last_audit_time ? new Date(r.last_audit_time) : null
        });
    }

    // 3. Get all users from auth_users with their satker depth & role
    const users = await client.query(`
        SELECT u.id, u.role_bdb, u.last_login_at, u.status, s.depth, s.tipe_satker
        FROM auth_users u
        LEFT JOIN bdb_satker s ON s.id::text = u.scope_satker_id::text
    `);
    console.log(`Processing ${users.rows.length} users...`);

    const now = new Date();
    const rowsToUpsert = [];

    for (const u of users.rows) {
        const uId = Number(u.id);
        const a = auditMap.get(uId) || {
            active_days: 0,
            lp_updated: 0,
            docs_uploaded: 0,
            view_actions: 0,
            last_audit_time: null
        };
        const userDoc = docMap.get(uId) || { total_active_docs: 0, valid_docs: 0, prememory_docs: 0 };
        const activeDocsCount = Number(userDoc.total_active_docs || 0);
        const validDocsCount = Number(userDoc.valid_docs || 0);
        const prememoryDocsCount = Number(userDoc.prememory_docs || 0);

        const lastLogin = u.last_login_at ? new Date(u.last_login_at) : null;
        let lastActive = a.last_audit_time;
        if (lastLogin && (!lastActive || lastLogin > lastActive)) {
            lastActive = lastLogin;
        }

        // Days since last active
        let diffDays = 999;
        if (lastActive) {
            diffDays = Math.max(0, (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
        }

        // Rule: If inactive >= 15 days or never active -> Score 0% (INAKTIF)
        if (diffDays >= 15) {
            rowsToUpsert.push({
                user_id: uId,
                score: 0,
                login_days_count: Math.min(30, a.active_days),
                lp_created_count: activeDocsCount,
                lp_updated_count: a.lp_updated,
                docs_uploaded_count: a.docs_uploaded,
                last_active_at: lastActive ? lastActive.toISOString() : null,
                status_keaktifan: 'INAKTIF'
            });
            continue;
        }

        // 1. Login score (max 30 pts): 1 active day = 1 point
        const loginScore = Math.min(30, Math.max(1, a.active_days));

        // 2. Recency score (max 20 pts)
        let recencyScore = 0;
        if (diffDays <= 2) recencyScore = 20;
        else if (diffDays <= 7) recencyScore = 15;
        else if (diffDays <= 14) recencyScore = 10;
        else recencyScore = 0;

        // 3. Document / Operational score (max 50 pts)
        const isViewer = (u.role_bdb || '').toLowerCase() === 'viewer';
        let docScore = 0;

        if (isViewer) {
            // Viewers are evaluated on review and login consistency
            const viewTarget = 10;
            docScore = Math.min(50, Math.round(((a.view_actions + a.active_days) / viewTarget) * 50));
        } else {
            // Operator / Admin: fair threshold based on satker level
            const satkerDepth = u.depth != null ? Number(u.depth) : 2;
            let targetPoints = 40; // default Polres
            if (satkerDepth >= 3 || u.tipe_satker === 'POLSEK') {
                targetPoints = 15; // Polsek fair target (~3 LP/updates)
            } else if (satkerDepth <= 1 || u.tipe_satker === 'POLDA' || u.tipe_satker === 'MABES') {
                targetPoints = 75; // Polda / Mabes
            }

            // Valid documents = 5 pts, prememory/draft = 2 pts
            const rawPoints = (validDocsCount * 5) + (prememoryDocsCount * 2) + (a.lp_updated * 3) + (a.docs_uploaded * 2);
            docScore = Math.min(50, Math.round((rawPoints / targetPoints) * 50));
        }

        const totalScore = Math.min(100, Math.max(0, loginScore + recencyScore + docScore));
        let status = 'INAKTIF';
        if (totalScore >= 80) status = 'SANGAT_AKTIF';
        else if (totalScore >= 50) status = 'CUKUP_AKTIF';
        else if (totalScore > 0) status = 'KURANG_AKTIF';

        rowsToUpsert.push({
            user_id: uId,
            score: totalScore,
            login_days_count: a.active_days,
            lp_created_count: activeDocsCount,
            lp_updated_count: a.lp_updated,
            docs_uploaded_count: a.docs_uploaded,
            last_active_at: lastActive ? lastActive.toISOString() : null,
            status_keaktifan: status
        });
    }

    console.timeEnd('aggregate');

    // Batch insert/upsert into auth_users_activity_cache
    console.log(`Upserting ${rowsToUpsert.length} records into auth_users_activity_cache...`);
    console.time('upsert');

    // Chunk by 500
    const chunkSize = 500;
    for (let i = 0; i < rowsToUpsert.length; i += chunkSize) {
        const chunk = rowsToUpsert.slice(i, i + chunkSize);
        const values = [];
        const params = [];
        let pIdx = 1;

        for (const row of chunk) {
            values.push(`($${pIdx++}, $${pIdx++}, $${pIdx++}, $${pIdx++}, $${pIdx++}, $${pIdx++}, $${pIdx++}, $${pIdx++}, NOW())`);
            params.push(
                row.user_id,
                row.score,
                row.login_days_count,
                row.lp_created_count,
                row.lp_updated_count,
                row.docs_uploaded_count,
                row.last_active_at,
                row.status_keaktifan
            );
        }

        const sql = `
            INSERT INTO auth_users_activity_cache (
                user_id, score, login_days_count, lp_created_count, lp_updated_count, docs_uploaded_count, last_active_at, status_keaktifan, updated_at
            ) VALUES ${values.join(', ')}
            ON CONFLICT (user_id) DO UPDATE SET
                score = EXCLUDED.score,
                login_days_count = EXCLUDED.login_days_count,
                lp_created_count = EXCLUDED.lp_created_count,
                lp_updated_count = EXCLUDED.lp_updated_count,
                docs_uploaded_count = EXCLUDED.docs_uploaded_count,
                last_active_at = EXCLUDED.last_active_at,
                status_keaktifan = EXCLUDED.status_keaktifan,
                updated_at = NOW()
        `;
        await client.query(sql, params);
    }

    console.timeEnd('upsert');

    console.log('Syncing activity_score to auth_users table...');
    await client.query(`
        UPDATE auth_users u
        SET activity_score = coalesce(c.score, 0)
        FROM auth_users_activity_cache c
        WHERE c.user_id = u.id;
    `);

    console.log('\n--- Activity Score Distribution ---');
    const dist = await client.query(`
        SELECT status_keaktifan, count(*), round(avg(score), 1) as avg_score, min(score) as min_score, max(score) as max_score
        FROM auth_users_activity_cache
        GROUP BY status_keaktifan
        ORDER BY min(score) DESC
    `);
    console.table(dist.rows);

    await client.end();
}

run().catch(e => {
    console.error('Error:', e);
    process.exit(1);
});
