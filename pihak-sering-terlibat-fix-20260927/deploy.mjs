import { runFE, runBE } from '../scripts/fe_inspect.mjs';
import cp from 'child_process';
import path from 'path';
import fs from 'fs';

const plinkPath = 'D:\\Putty\\plink.exe';
const pscpPath = 'D:\\Putty\\pscp.exe';
const feHostKey = 'ssh-ed25519 255 SHA256:EhFJ6wZFiZJkJ7xKC3+WjqIC8T82VfFrmW8JlOhn/og';
const beHostKey = 'ssh-ed25519 255 SHA256:zAYHmppgblxgqRQp+jYN9Gs3sNIt2LQ91UJO5I1J2WI';
const password = 'or@eK2q5';
const feTarget = 'clouduser@10.0.0.x';
const beTarget = 'clouduser@10.0.0.x';

function copyFile(localPath, target, hostKey, remotePath) {
    return cp.execFileSync(pscpPath, [
        '-batch', '-hostkey', hostKey,
        '-pw', password,
        localPath,
        `${target}:${remotePath}`
    ], { timeout: 60000 }).toString();
}

async function deploy() {
    console.log('=== DEPLOY PIHAK PALING SERING TERLIBAT COMPREHENSIVE FIX ===');
    const timestamp = Date.now();

    // -------------------------------------------------------------
    // PART 1: DEPLOY BACKEND (bdb-api)
    // -------------------------------------------------------------
    console.log('\n--- 1. BACKEND DEPLOYMENT (bdb-api) ---');
    const beBackupDir = `/home/clouduser/codex-backups/bdb-api/pihak-fix-${timestamp}`;
    console.log('Creating BE backup dir:', beBackupDir);
    runBE(`mkdir -p ${beBackupDir}`);

    const beFile = 'src/bdb/pihak-terlibat/pihak-terlibat.service.ts';
    console.log(`Backing up bdb-api:/usr/src/app/${beFile}...`);
    runBE(`docker cp bdb-api:/usr/src/app/${beFile} ${beBackupDir}/pihak-terlibat.service.ts`);

    const localBePath = path.join('pihak-sering-terlibat-fix-20260927', 'be', beFile);
    const remoteBeStage = `/home/clouduser/pihak-service-stage-${timestamp}.ts`;
    console.log(`Copying local ${localBePath} -> ${remoteBeStage}...`);
    copyFile(localBePath, beTarget, beHostKey, remoteBeStage);

    console.log(`Injecting into container bdb-api:/usr/src/app/${beFile}...`);
    runBE(`docker cp ${remoteBeStage} bdb-api:/usr/src/app/${beFile}`);

    console.log('Building backend inside bdb-api (npm run build)...');
    const buildRes = runBE('docker exec bdb-api npm run build');
    console.log(buildRes);

    console.log('Restarting bdb-api container...');
    runBE('docker restart bdb-api');

    console.log('Waiting for bdb-api health check...');
    let beReady = false;
    for (let i = 0; i < 40; i++) {
        await new Promise(r => setTimeout(r, 1500));
        try {
            const check = runBE("curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3850/ || true").trim();
            if (check === '200') {
                beReady = true;
                console.log(`BE API ready! (HTTP code ${check} at attempt ${i + 1})`);
                break;
            } else {
                process.stdout.write(`(${check})...`);
            }
        } catch (e) {
            process.stdout.write('x...');
        }
    }
    if (!beReady) {
        throw new Error('BE API failed to become ready within 60s!');
    }

    // -------------------------------------------------------------
    // PART 2: DEPLOY FRONTEND (bdb-web)
    // -------------------------------------------------------------
    console.log('\n--- 2. FRONTEND DEPLOYMENT (bdb-web) ---');
    const feBackupDir = `/home/clouduser/codex-backups/bdb-web/pihak-fix-${timestamp}`;
    console.log('Creating FE backup dir:', feBackupDir);
    runFE(`mkdir -p ${feBackupDir}`);

    const feChunks = [
        'register-pihak-v5-6478da3b8c2c.js',
        'dashboard-perma-318125d33290.js',
        '0-gigr76s0g8t.js'
    ];

    for (const chunk of feChunks) {
        console.log(`Backing up bdb-web chunk ${chunk}...`);
        runFE(`docker cp bdb-web:/usr/src/app/.next/static/chunks/${chunk} ${feBackupDir}/${chunk}`);

        const localFePath = path.join('pihak-sering-terlibat-fix-20260927', 'fe', chunk);
        const remoteFeStage = `/home/clouduser/fe-chunk-stage-${chunk}`;
        console.log(`Copying local ${localFePath} -> ${remoteFeStage}...`);
        copyFile(localFePath, feTarget, feHostKey, remoteFeStage);

        console.log(`Injecting into bdb-web:/usr/src/app/.next/static/chunks/${chunk}...`);
        runFE(`docker cp ${remoteFeStage} bdb-web:/usr/src/app/.next/static/chunks/${chunk}`);
    }

    console.log('Verifying syntax of patched chunks inside bdb-web...');
    for (const chunk of feChunks) {
        runFE(`docker exec bdb-web node --check /usr/src/app/.next/static/chunks/${chunk}`);
        console.log(`✓ bdb-web chunk ${chunk} syntax OK`);
    }

    console.log('Restarting bdb-web container...');
    runFE('docker restart bdb-web');

    console.log('Waiting for bdb-web health check...');
    let feReady = false;
    for (let i = 0; i < 30; i++) {
        await new Promise(r => setTimeout(r, 1500));
        try {
            const check = runFE("curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3000/cms/laporan/pihak-sering-terlibat || true").trim();
            if (check === '200') {
                feReady = true;
                console.log(`FE Web ready! (HTTP code ${check} at attempt ${i + 1})`);
                break;
            } else {
                process.stdout.write(`(${check})...`);
            }
        } catch (e) {
            process.stdout.write('x...');
        }
    }
    if (!feReady) {
        throw new Error('FE Web failed to become ready within 45s!');
    }

    console.log('\n=== ALL DEPLOYMENTS SUCCESSFUL ===');
}

deploy().catch(e => {
    console.error('DEPLOY ERROR:', e);
    process.exit(1);
});
