import { runFE, copyFileToFE } from './fe_exec.mjs';

async function deploy() {
    console.log('1. Copying patched dashboard chunk to remote FE host...');
    copyFileToFE('pihak-sering-terlibat-fix-20260927/fe/dashboard-perma-318125d33290.js', '/tmp/dashboard-perma-318125d33290.js');

    console.log('2. Copying into docker container bdb-web...');
    runFE('docker cp /tmp/dashboard-perma-318125d33290.js bdb-web:/usr/src/app/.next/static/chunks/dashboard-perma-318125d33290.js');

    console.log('3. Checking syntax inside container...');
    const syntax = runFE('docker exec bdb-web node --check /usr/src/app/.next/static/chunks/dashboard-perma-318125d33290.js');
    console.log('Syntax check:', syntax || 'OK');

    console.log('4. Verifying dash-filter-pihak-jenis is gone...');
    const filterCheck = runFE('docker exec bdb-web grep -o "dash-filter-pihak-jenis" /usr/src/app/.next/static/chunks/dashboard-perma-318125d33290.js || true').trim();
    console.log('dash-filter-pihak-jenis present?', filterCheck ? 'YES (Error)' : 'NO (Successfully removed)');
    if (filterCheck) {
        throw new Error('Filter dropdown still present in dashboard chunk!');
    }

    console.log('5. Restarting bdb-web container...');
    runFE('docker restart bdb-web');

    console.log('6. Waiting 4 seconds for container to initialize...');
    await new Promise(r => setTimeout(r, 4000));

    console.log('7. Checking HTTP response for dashboard...');
    const httpCheck = runFE('curl -k -s -I -H "Host: cas.bareskrim.polri.go.id" https://127.0.0.1/cms/dashboard');
    console.log('HTTP Response:\n' + httpCheck);
    if (!httpCheck.includes('200 OK')) {
        throw new Error('Dashboard did not return 200 OK!');
    }

    console.log('=== DEPLOYMENT AND VERIFICATION SUCCESSFUL ===');
}

deploy().catch(e => {
    console.error('DEPLOY ERROR:', e);
    process.exit(1);
});
