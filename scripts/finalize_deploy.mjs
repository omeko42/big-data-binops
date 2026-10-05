import { runFE } from './fe_exec.mjs';

async function main() {
    console.log('1. Restarting bdb-web container...');
    runFE('docker restart bdb-web');
    console.log('Container restarted. Waiting 5s for Next.js to start up...');
    await new Promise(r => setTimeout(r, 5000));

    console.log('2. Checking local container HTTP status...');
    const httpRes = runFE('curl -k -s -I -H "Host: cas.bareskrim.polri.go.id" https://127.0.0.1/cms/laporan-polisi | head -n 5');
    console.log('HTTP Status:\n', httpRes.trim());

    if (!httpRes.includes('200 OK')) {
        console.warn('Warning: Did not get 200 OK immediately, waiting 3s and retrying...');
        await new Promise(r => setTimeout(r, 3000));
        const retryRes = runFE('curl -k -s -I -H "Host: cas.bareskrim.polri.go.id" https://127.0.0.1/cms/laporan-polisi | head -n 5');
        console.log('Retry HTTP Status:\n', retryRes.trim());
    }

    console.log('3. Committing bdb-web container to bdb-web:latest...');
    const commitOut = runFE('docker commit bdb-web bdb-web:latest');
    console.log('Docker commit output:', commitOut.trim());

    console.log('=== FINALIZATION COMPLETE! ===');
}

main().catch(e => {
    console.error('ERROR:', e);
    process.exit(1);
});
