import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

// Sinkron manual dgn SKIP di scripts/bdb/bootstrap-fresh-db.sh & scripts/bdb/check-pending-migrations.js
// -- file yg SENGAJA tak pernah dijalankan otomatis (nonaktif permanen / tabelnya dibuat runtime
// service / script undo opsional, bukan migrasi maju).
const SKIP = new Set([
    '005_dev_superadmin_single_user.sql',
    '015_dors_sync_scheduler.sql',
    '016_dors_normalized_relations.sql',
    '035_revert_status_distribution.sql'
]);

/**
 * Jalankan SEMUA migration sql/bdb/*.sql yg BELUM tercatat di bdb_schema_migrations, otomatis,
 * urut nama file, SEBELUM NestFactory.create(AppModule) -- supaya tak ada module/service yg
 * sempat query tabel yg belum ada. Dipanggil di awal main.ts, pakai koneksi pg mentah (bukan
 * lewat TypeORM/DI) persis spt scripts/bdb/apply-sql-file.js, krn app belum boot sama sekali.
 *
 * Sebelumnya migration dijalankan manual satu-per-satu tiap deploy (lihat scripts/bdb/
 * check-pending-migrations.js) -- gampang lupa satu file (tm_org_role kosong di prod krn
 * migration 069 kelewat). Ini gantinya: TIDAK ADA LAGI langkah manual, app sendiri yg pastikan
 * skemanya lengkap tiap kali nyala. Semua migration di repo ini idempotent by design (ON
 * CONFLICT DO NOTHING/DO UPDATE, IF NOT EXISTS), jadi aman dijalankan ulang kapan saja.
 *
 * Gagal di tengah jalan = throw (bikin boot GAGAL total, bukan lanjut diam-diam dgn skema
 * setengah-migrasi) -- lebih baik app tak nyala & ketahuan langsung drpd korupsi data senyap.
 */
export async function runPendingMigrations(): Promise<void> {
    const dir = path.join(__dirname, '..', 'sql', 'bdb');
    const files = fs
        .readdirSync(dir)
        .filter((f) => f.endsWith('.sql') && !SKIP.has(f))
        .sort();

    const pool = new Pool({
        host: process.env.DB_HOST || '127.0.0.1',
        port: Number(process.env.DB_PORT || 5432),
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE || 'bdb_dev'
    });

    try {
        await pool.query(
            `create table if not exists bdb_schema_migrations (filename text primary key, applied_at timestamptz not null default now())`
        );
        const applied = await pool.query('select filename from bdb_schema_migrations');
        const appliedSet = new Set<string>(applied.rows.map((r) => r.filename));

        const pending = files.filter((f) => !appliedSet.has(f));
        if (!pending.length) {
            console.log(`[migrations] semua ${files.length} migration sudah jalan, tak ada yg baru.`);
        } else {
            console.log(`[migrations] menjalankan ${pending.length} migration yg belum tercatat...`);
            for (const f of pending) {
                const sql = fs.readFileSync(path.join(dir, f), 'utf8');
                try {
                    await pool.query(sql);
                    await pool.query(
                        'insert into bdb_schema_migrations (filename) values ($1) on conflict (filename) do update set applied_at=now()',
                        [f]
                    );
                    console.log(`[migrations] APPLIED ${f}`);
                } catch (e: any) {
                    console.error(`[migrations] GAGAL menjalankan ${f}: ${e?.message || e}`);
                    throw e;
                }
            }
            console.log(`[migrations] selesai, ${pending.length} migration baru diterapkan.`);
        }

        try {
            const syncScriptPath = path.join(__dirname, '..', 'scripts', 'sync_master_user_callsigns.js');
            if (fs.existsSync(syncScriptPath)) {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const { syncMasterUserCallsigns } = require(syncScriptPath);
                const syncRes = await syncMasterUserCallsigns(pool);
                console.log(`[migrations] syncMasterUserCallsigns selesai (total=${syncRes.totalUsers}, updated=${syncRes.updatedCount}).`);
            }
        } catch (syncErr: any) {
            console.warn(`[migrations] syncMasterUserCallsigns warning: ${syncErr?.message || syncErr}`);
        }
    } finally {
        await pool.end();
    }
}
