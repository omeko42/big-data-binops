import { runQuery } from './query_helper.mjs';

async function main() {
    console.log("=== Documents for LP 1413292 ===");
    const qDocs = await runQuery(`
        select *
        from bdb_dokumen
        where lp_id = 1413292
        order by created_at desc
    `);
    console.log(JSON.stringify(qDocs.rows, null, 2));

    console.log("\n=== Audit log for LP 1413292 ===");
    const qAudit = await runQuery(`
        select *
        from bdb_audit_log
        where entity_id = '1413292' or (meta::text ilike '%1413292%')
        order by created_at desc
        limit 10
    `);
    console.log(JSON.stringify(qAudit.rows, null, 2));

    console.log("\n=== Overall Count of future tanggal_selesai ===");
    const qCount = await runQuery(`
        select count(*)::int as future_count
        from bdb_laporan_polisi
        where tanggal_selesai > CURRENT_DATE
    `);
    console.log("LPs with tanggal_selesai > CURRENT_DATE:", qCount.rows[0]);

    const qSampleFuture = await runQuery(`
        select id, no_laporan, tgl_laporan, status_id, tanggal_selesai, created_at, updated_at
        from bdb_laporan_polisi
        where tanggal_selesai > CURRENT_DATE
        order by tanggal_selesai desc
        limit 15
    `);
    console.log("Sample future LPs:", JSON.stringify(qSampleFuture.rows, null, 2));
}

main().catch(console.error);
