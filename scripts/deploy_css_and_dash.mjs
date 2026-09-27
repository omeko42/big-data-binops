import { runFE, copyFileToFE } from './fe_exec.mjs';

async function deploy() {
    console.log('1. Copying live-20sy5p32bn-wu.css to remote /tmp/...');
    copyFileToFE('live-20sy5p32bn-wu.css', '/tmp/20sy5p32bn-wu.css');

    console.log('2. Copying dashboard chunk to remote /tmp/...');
    copyFileToFE('pihak-sering-terlibat-fix-20260927/fe/dashboard-perma-318125d33290.js', '/tmp/dashboard-perma-318125d33290.js');

    console.log('3. Copying into docker container bdb-web...');
    runFE('docker cp /tmp/20sy5p32bn-wu.css bdb-web:/usr/src/app/.next/static/chunks/20sy5p32bn-wu.css');
    runFE('docker cp /tmp/dashboard-perma-318125d33290.js bdb-web:/usr/src/app/.next/static/chunks/dashboard-perma-318125d33290.js');

    console.log('4. Verifying CSS inside container...');
    const cssGrep = runFE('docker exec bdb-web grep -o "FIX NESTED INNER BORDER IN DROPDOWNS" /usr/src/app/.next/static/chunks/20sy5p32bn-wu.css || true').trim();
    console.log('Found CSS fix in container:', cssGrep ? 'YES' : 'NO');
    if (!cssGrep) {
        throw new Error('CSS fix not found in container!');
    }

    console.log('5. Verifying dashboard chunk inside container...');
    const dashGrep = runFE('docker exec bdb-web grep -o "dash-filter-pihak-jenis" /usr/src/app/.next/static/chunks/dashboard-perma-318125d33290.js || true').trim();
    console.log('Found dash-filter-pihak-jenis in container:', dashGrep ? 'YES' : 'NO');
    if (!dashGrep) {
        throw new Error('Dashboard dropdown not found in container!');
    }

    console.log('6. Checking syntax of dashboard chunk inside container...');
    const syntax = runFE('docker exec bdb-web node --check /usr/src/app/.next/static/chunks/dashboard-perma-318125d33290.js');
    console.log('Syntax check:', syntax || 'OK');

    console.log('7. Restarting bdb-web container...');
    runFE('docker restart bdb-web');

    console.log('8. Waiting 4 seconds for container to initialize...');
    await new Promise(r => setTimeout(r, 4000));

    console.log('9. Checking HTTP status of dashboard...');
    const httpCheck = runFE('curl -k -s -I -H "Host: cas.bareskrim.polri.go.id" https://127.0.0.1/cms/dashboard');
    console.log('HTTP Status:\n' + httpCheck.split('\n')[0]);
    if (!httpCheck.includes('200 OK')) {
        throw new Error('Dashboard returned non-200!');
    }

    console.log('=== DEPLOYMENT COMPLETE & 100% HEALTHY ===');
}

deploy().catch(e => {
    console.error('DEPLOY ERROR:', e);
    process.exit(1);
});
