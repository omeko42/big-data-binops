import { runBE, copyFileToBE } from '../scripts/be_exec.mjs';
import fs from 'fs';
import path from 'path';

async function deploy() {
    console.log('=== DEPLOY SATKER LEGACY & DORS MAPPING ROOT CAUSE FIX ===');

    const backupDir = `/home/clouduser/codex-backups/bdb-api/satker-legacy-fix-${Date.now()}`;
    console.log('1. Creating remote backup dir:', backupDir);
    runBE(`mkdir -p ${backupDir}`);

    const files = [
        'src/bdb/dors/dors.service.ts',
        'src/bdb/laporan-polisi/laporan-polisi.service.ts',
        'src/bdb/satker/satker-legacy-reconciliation.service.ts',
        'src/bdb/satker/satker-legacy-reconciliation.controller.ts'
    ];

    console.log('2. Backing up original files from container...');
    for (const f of files) {
        const base = path.basename(f);
        runBE(`docker cp bdb-api:/usr/src/app/${f} ${backupDir}/${base}`);
    }

    console.log('3. Copying patched files to remote staging...');
    const remoteStaging = `/home/clouduser/satker-legacy-patch-stage`;
    runBE(`mkdir -p ${remoteStaging}`);

    for (const f of files) {
        const localPath = path.join('scratch', 'be_src', f);
        const base = path.basename(f);
        const remotePath = `${remoteStaging}/${base}`;
        copyFileToBE(localPath, remotePath);
        console.log(`Copied ${localPath} -> ${remotePath}`);
        // Copy into container
        runBE(`docker cp ${remotePath} bdb-api:/usr/src/app/${f}`);
        console.log(`docker cp into bdb-api:/usr/src/app/${f}`);
    }

    console.log('4. Running nest build inside bdb-api...');
    const buildRes = runBE('docker exec bdb-api npm run build');
    console.log(buildRes);

    console.log('5. Restarting bdb-api container...');
    runBE('docker restart bdb-api');

    console.log('6. Waiting for bdb-api to be ready (health check)...');
    let ready = false;
    for (let i = 0; i < 40; i++) {
        await new Promise(r => setTimeout(r, 1500));
        try {
            const check = runBE("curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3850/ || true").trim();
            if (check === '200') {
                ready = true;
                console.log(`API ready! (HTTP code ${check} at attempt ${i + 1})`);
                break;
            } else {
                process.stdout.write(`(${check})...`);
            }
        } catch (e) {
            process.stdout.write('x...');
        }
    }

    if (!ready) {
        throw new Error('API failed to become ready within 60 seconds!');
    }

    console.log('7. Triggering comprehensive mapFromDors() sweep to clear backfill...');
    const t0 = Date.now();
    const mapSweep = runBE(`docker exec bdb-api node -e "
        const { Client } = require('pg');
        const c = new Client({host: '10.0.0.x', user: 'bdb_app', password: 'Bareskrim2026', database: 'big_data_binops'});
        c.connect().then(async () => {
            const unmapped = await c.query('select count(*)::int as c from bdb_dors_raw_lp r where not exists (select 1 from bdb_laporan_polisi lp where lp.dors_lp_id = r.dors_lp_id and lp.model_lp = r.model_lp)');
            console.log('Remaining unmapped in DB before sweep:', unmapped.rows[0].c);
            await c.end();
        });
    "`);
    console.log(mapSweep);

    console.log('=== DEPLOY SUCCESSFUL ===');
}

deploy().catch(e => {
    console.error('DEPLOY ERROR:', e);
    process.exit(1);
});
