"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runPendingMigrations = runPendingMigrations;
const pg_1 = require("pg");
const fs = require("fs");
const path = require("path");
const SKIP = new Set([
    '005_dev_superadmin_single_user.sql',
    '015_dors_sync_scheduler.sql',
    '016_dors_normalized_relations.sql',
    '035_revert_status_distribution.sql'
]);
async function runPendingMigrations() {
    const dir = path.join(__dirname, '..', 'sql', 'bdb');
    const files = fs
        .readdirSync(dir)
        .filter((f) => f.endsWith('.sql') && !SKIP.has(f))
        .sort();
    const pool = new pg_1.Pool({
        host: process.env.DB_HOST || '127.0.0.1',
        port: Number(process.env.DB_PORT || 5432),
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE || 'bdb_dev'
    });
    try {
        await pool.query(`create table if not exists bdb_schema_migrations (filename text primary key, applied_at timestamptz not null default now())`);
        const applied = await pool.query('select filename from bdb_schema_migrations');
        const appliedSet = new Set(applied.rows.map((r) => r.filename));
        const pending = files.filter((f) => !appliedSet.has(f));
        if (!pending.length) {
            console.log(`[migrations] semua ${files.length} migration sudah jalan, tak ada yg baru.`);
            return;
        }
        console.log(`[migrations] menjalankan ${pending.length} migration yg belum tercatat...`);
        for (const f of pending) {
            const sql = fs.readFileSync(path.join(dir, f), 'utf8');
            try {
                await pool.query(sql);
                await pool.query('insert into bdb_schema_migrations (filename) values ($1) on conflict (filename) do update set applied_at=now()', [f]);
                console.log(`[migrations] APPLIED ${f}`);
            }
            catch (e) {
                console.error(`[migrations] GAGAL menjalankan ${f}: ${e?.message || e}`);
                throw e;
            }
        }
        console.log(`[migrations] selesai, ${pending.length} migration baru diterapkan.`);
    }
    finally {
        await pool.end();
    }
}
//# sourceMappingURL=run-pending-migrations.js.map