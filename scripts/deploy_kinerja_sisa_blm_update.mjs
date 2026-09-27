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

async function deployKinerja() {
    console.log('=== DEPLOY KINERJA PERKARA SISA (BLM UPDATE) ===');
    const timestamp = Date.now();
    const chunkName = 'kinerja-perma-external-a42edc88f706.js';
    const localChunkPath = path.join('live-kinerja-chunk.js');
    const remoteStagePath = `/home/clouduser/kinerja-stage-${timestamp}.js`;

    console.log(`1. Backing up live chunk in container to bdb-web backup...`);
    runFE(`docker exec bdb-web cp /usr/src/app/.next/static/chunks/${chunkName} /usr/src/app/.next/static/chunks/${chunkName}.bak-before-blm-update-${timestamp}`);

    console.log(`2. Uploading local patched ${localChunkPath} -> ${remoteStagePath}...`);
    copyFile(localChunkPath, feTarget, feHostKey, remoteStagePath);

    console.log(`3. Injecting into container bdb-web:/usr/src/app/.next/static/chunks/${chunkName}...`);
    runFE(`docker cp ${remoteStagePath} bdb-web:/usr/src/app/.next/static/chunks/${chunkName}`);

    console.log(`4. Verifying syntax inside bdb-web...`);
    const checkRes = runFE(`docker exec bdb-web node --check /usr/src/app/.next/static/chunks/${chunkName}`);
    console.log('✓ Syntax check passed inside container');

    console.log(`5. Restarting bdb-web container...`);
    runFE('docker restart bdb-web');

    console.log(`6. Waiting for bdb-web health check...`);
    let feReady = false;
    for (let i = 0; i < 30; i++) {
        await new Promise(r => setTimeout(r, 1500));
        try {
            const check = runFE("curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3000/cms/report/kinerja-perkara || true").trim();
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

    console.log(`\n7. Verifying live container content...`);
    const grepRes = runFE(`docker exec bdb-web grep -o "SISA (BLM UPDATE)" /usr/src/app/.next/static/chunks/${chunkName} || true`).trim();
    console.log('Found "SISA (BLM UPDATE)" in live container:', grepRes ? grepRes.split('\n').length + ' times' : 'NO');

    const grepOld = runFE(`docker exec bdb-web grep -o "SISA (BU)" /usr/src/app/.next/static/chunks/${chunkName} || true`).trim();
    console.log('Found old "SISA (BU)" in live container (should be 0):', grepOld ? grepOld.split('\n').length : '0');

    console.log('\n=== DEPLOYMENT & VERIFICATION FINISHED SUCCESSFULLY ===');
}

deployKinerja().catch(console.error);
