import { runFE } from './fe_inspect.mjs';
import cp from 'child_process';
import path from 'path';

const pscpPath = 'D:\\Putty\\pscp.exe';
const feHostKey = 'ssh-ed25519 255 SHA256:EhFJ6wZFiZJkJ7xKC3+WjqIC8T82VfFrmW8JlOhn/og';
const password = 'or@eK2q5';
const feTarget = 'clouduser@10.0.0.x';

function copyFile(localPath, target, hostKey, remotePath) {
    return cp.execFileSync(pscpPath, [
        '-batch', '-hostkey', hostKey,
        '-pw', password,
        localPath,
        `${target}:${remotePath}`
    ], { timeout: 60000 }).toString();
}

async function deployFE() {
    console.log('=== DEPLOY FRONTEND MODAL POLISH & MAXIMIZE MODE ===');
    const timestamp = Date.now();
    const chunk = 'register-pihak-v5-6478da3b8c2c.js';
    const localFePath = path.join('pihak-sering-terlibat-fix-20260927', 'fe', chunk);
    const remoteFeStage = `/home/clouduser/fe-chunk-stage-${timestamp}-${chunk}`;

    console.log(`Copying local ${localFePath} -> ${remoteFeStage}...`);
    copyFile(localFePath, feTarget, feHostKey, remoteFeStage);

    console.log(`Injecting into bdb-web:/usr/src/app/.next/static/chunks/${chunk}...`);
    runFE(`docker cp ${remoteFeStage} bdb-web:/usr/src/app/.next/static/chunks/${chunk}`);

    console.log('Verifying syntax inside bdb-web...');
    runFE(`docker exec bdb-web node --check /usr/src/app/.next/static/chunks/${chunk}`);
    console.log('✓ Syntax check passed inside container');

    console.log('Restarting bdb-web...');
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
    console.log('\nDeployment completed successfully!');
}

deployFE().catch(console.error);
