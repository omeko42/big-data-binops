import { runBE, copyFileToBE, runBEWithInput } from '../scripts/be_exec.mjs';
import path from 'path';

async function deploy() {
    console.log('=== DEPLOY MASTER SATKER & KINERJA PERKARA ROOT CAUSE FIX ===');

    const backupDir = `/home/clouduser/codex-backups/bdb-api/master-satker-audit-fix-${Date.now()}`;
    console.log('1. Creating remote backup dir:', backupDir);
    runBE(`mkdir -p ${backupDir}`);

    const files = [
        'src/bdb/satker/satker.service.ts',
        'src/bdb/kinerja-perkara/kinerja-perkara.service.ts'
    ];

    console.log('2. Backing up original files from container...');
    for (const f of files) {
        const base = path.basename(f);
        runBE(`docker cp bdb-api:/usr/src/app/${f} ${backupDir}/${base}`);
    }

    console.log('3. Copying patched files to remote staging...');
    const remoteStaging = `/home/clouduser/master-satker-patch-stage`;
    runBE(`mkdir -p ${remoteStaging}`);

    for (const f of files) {
        const localPath = path.join('master-satker-audit-fix-20260927', f);
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

    console.log('7. Verifying KinerjaPerkaraService cache clearing and satker tree building...');
    const verifyScript = `
        const { NestFactory } = require('@nestjs/core');
        const { AppModule } = require('/usr/src/app/dist/app.module');
        const { KinerjaPerkaraService } = require('/usr/src/app/dist/bdb/kinerja-perkara/kinerja-perkara.service');

        async function verify() {
            const app = await NestFactory.createApplicationContext(AppModule, { logger: ['warn', 'error'] });
            const kps = app.get(KinerjaPerkaraService);
            kps.clearCache();
            console.log('KinerjaPerkara cache cleared.');
            const opts = await kps.scopeOptions(undefined);
            console.log('Scope options loaded successfully. Count:', opts.length);
            await app.close();
        }
        verify().catch(e => { console.error('Verification error:', e); process.exit(1); });
    `;
    const verifyOut = runBEWithInput('docker exec -i bdb-api node', verifyScript);
    console.log(verifyOut);

    console.log('=== DEPLOY SUCCESSFUL ===');
}

deploy().catch(e => {
    console.error('DEPLOY ERROR:', e);
    process.exit(1);
});
