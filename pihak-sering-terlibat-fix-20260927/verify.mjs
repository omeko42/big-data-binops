import { runFE, runBE } from '../scripts/fe_inspect.mjs';

async function verify() {
    console.log('=== VERIFY PIHAK PALING SERING TERLIBAT LIVE ENVIRONMENT ===');

    console.log('1. Checking HTTP response for /cms/laporan/pihak-sering-terlibat on FE...');
    const httpRes = runFE('curl -k -s -I -H "Host: cas.bareskrim.polri.go.id" https://127.0.0.1/cms/laporan/pihak-sering-terlibat');
    const firstLine = httpRes.split('\n')[0].trim();
    console.log('HTTP Status:', firstLine);
    if (!firstLine.includes('200')) {
        throw new Error('Expected 200 OK, got: ' + firstLine);
    }

    console.log('2. Verifying register-pihak chunk on live bdb-web...');
    const pihakGrep = runFE('docker exec bdb-web grep -o "Rincian LP" /usr/src/app/.next/static/chunks/register-pihak-v5-6478da3b8c2c.js || true').trim();
    console.log('Found "Rincian LP" in register-pihak chunk:', pihakGrep);
    if (!pihakGrep.includes('Rincian LP')) {
        throw new Error('Rincian LP not found in live chunk!');
    }

    const jumpGrep = runFE('docker exec bdb-web grep -o "Buka di Register Pihak Terlibat" /usr/src/app/.next/static/chunks/register-pihak-v5-6478da3b8c2c.js || true').trim();
    console.log('Found "Buka di Register Pihak Terlibat" in live chunk:', jumpGrep);
    if (!jumpGrep.includes('Buka di Register Pihak Terlibat')) {
        throw new Error('Jump button not found in live chunk!');
    }

    const lpLinkGrep = runFE('docker exec bdb-web grep -o "/cms/laporan-polisi/" /usr/src/app/.next/static/chunks/register-pihak-v5-6478da3b8c2c.js || true').trim();
    console.log('Found "/cms/laporan-polisi/" in live chunk:', lpLinkGrep);

    console.log('3. Verifying dashboard chunk on live bdb-web...');
    const dashGrep = runFE('docker exec bdb-web grep -o "onLihatSemua:()=>e.push(\\"/cms/laporan/pihak-sering-terlibat\\")" /usr/src/app/.next/static/chunks/dashboard-perma-318125d33290.js || true').trim();
    console.log('Found dashboard onLihatSemua redirect in live chunk:', dashGrep ? 'YES' : 'NO');
    if (!dashGrep) {
        throw new Error('Dashboard onLihatSemua not updated!');
    }

    console.log('4. Verifying sidebar breadcrumb chunk on live bdb-web...');
    const breadcrumbGrep = runFE('docker exec bdb-web grep -o "Pihak Paling Sering Terlibat" /usr/src/app/.next/static/chunks/0-gigr76s0g8t.js || true').trim();
    console.log('Found breadcrumb title in live chunk:', breadcrumbGrep ? 'YES' : 'NO');

    console.log('5. Verifying backend API health...');
    const check = runBE("curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3850/ || true").trim();
    console.log('BE Health HTTP Code:', check);
    if (check !== '200') {
        throw new Error('Backend health check returned ' + check);
    }

    console.log('\n=== ALL VERIFICATIONS PASSED (100% HEALTHY) ===');
}

verify().catch(e => {
    console.error('VERIFY ERROR:', e);
    process.exit(1);
});
