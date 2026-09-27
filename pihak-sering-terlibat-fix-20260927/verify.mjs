import { runFE, runBE } from '../scripts/fe_inspect.mjs';

async function verify() {
    console.log('=== VERIFY PIHAK PALING SERING TERLIBAT LIVE ENVIRONMENT ===');

    console.log('\n1. Checking HTTP response for /cms/laporan/pihak-sering-terlibat on FE...');
    const httpRes = runFE('curl -k -s -I -H "Host: cas.bareskrim.polri.go.id" https://127.0.0.1/cms/laporan/pihak-sering-terlibat');
    const firstLine = httpRes.split('\n')[0].trim();
    console.log('HTTP Status:', firstLine);
    if (!firstLine.includes('200')) {
        throw new Error('Expected 200 OK, got: ' + firstLine);
    }

    console.log('\n2. Verifying register-pihak chunk on live bdb-web...');
    const satkerModalGrep = runFE('docker exec bdb-web grep -o "Daftar Satker Terkait" /usr/src/app/.next/static/chunks/register-pihak-v5-6478da3b8c2c.js || true').trim();
    console.log('Found "Daftar Satker Terkait" in live chunk:', satkerModalGrep ? 'YES' : 'NO');
    if (!satkerModalGrep) {
        throw new Error('Satker modal not found in live chunk!');
    }

    const tempusColGrep = runFE('docker exec bdb-web grep -o "Tempus Kejadian" /usr/src/app/.next/static/chunks/register-pihak-v5-6478da3b8c2c.js || true').trim();
    console.log('Found "Tempus Kejadian" in live chunk:', tempusColGrep ? 'YES' : 'NO');
    if (!tempusColGrep) {
        throw new Error('Tempus Kejadian not found in live chunk!');
    }

    const uraianGrep = runFE('docker exec bdb-web grep -o "Uraian Kejadian" /usr/src/app/.next/static/chunks/register-pihak-v5-6478da3b8c2c.js || true').trim();
    console.log('Found "Uraian Kejadian" in live chunk:', uraianGrep ? 'YES' : 'NO');
    if (!uraianGrep) {
        throw new Error('Uraian Kejadian not found in live chunk!');
    }

    const lpLinkGrep = runFE('docker exec bdb-web grep -o "/cms/laporan-polisi/" /usr/src/app/.next/static/chunks/register-pihak-v5-6478da3b8c2c.js || true').trim();
    console.log('Found any "/cms/laporan-polisi/" links in live chunk:', lpLinkGrep ? 'FAIL (STILL PRESENT)' : 'CLEAN (NONE)');
    if (lpLinkGrep) {
        throw new Error('Forbidden /cms/laporan-polisi/ links still exist in chunk!');
    }

    const searchParamGrep = runFE('docker exec bdb-web grep -o "\\?search=" /usr/src/app/.next/static/chunks/register-pihak-v5-6478da3b8c2c.js || true').trim();
    console.log('Found any plain "?search=" in live chunk:', searchParamGrep ? 'FAIL (STILL PRESENT)' : 'CLEAN (NONE)');
    if (searchParamGrep) {
        throw new Error('Forbidden ?search= query params still exist in chunk!');
    }

    console.log('\n3. Verifying dashboard chunk on live bdb-web...');
    const filterGrep = runFE('docker exec bdb-web grep -o "dash-filter-pihak-jenis" /usr/src/app/.next/static/chunks/dashboard-perma-318125d33290.js || true').trim();
    console.log('Card headerExtra filter dropdown present:', filterGrep ? 'YES' : 'NO');
    if (!filterGrep) {
        throw new Error('Filter dropdown missing from dashboard chunk!');
    }

    const cssFixGrep = runFE('docker exec bdb-web grep -o "FIX NESTED INNER BORDER IN DROPDOWNS" /usr/src/app/.next/static/chunks/20sy5p32bn-wu.css || true').trim();
    console.log('CSS fix for nested inner border in dropdowns present:', cssFixGrep ? 'YES' : 'NO');
    if (!cssFixGrep) {
        throw new Error('CSS nested border fix missing from 20sy5p32bn-wu.css!');
    }

    console.log('\n4. Verifying backend API health...');
    const check = runBE("curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3850/ || true").trim();
    console.log('BE Health HTTP Code:', check);
    if (check !== '200') {
        throw new Error('Backend health check returned ' + check);
    }

    console.log('\n5. Verifying DB Snapshot status for I NYOMAN WIRNA...');
    const testDbScript = `
    const { Client } = require('pg');
    const client = new Client({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });
    async function main() {
      await client.connect();
      const wirna = await client.query(\`
        SELECT nama, nik, total_lp, jumlah_satker_unik, jumlah_polda_unik, is_lintas_wilayah, nasional_score
        FROM bdb_pihak_terlibat_ranking_snapshot
        WHERE nik = '5107083112740170' OR nama ILIKE '%WIRNA%'
        LIMIT 1;
      \`);
      console.log('Wirna row:', JSON.stringify(wirna.rows[0]));
      if (wirna.rows[0] && wirna.rows[0].is_lintas_wilayah === true) {
        throw new Error('Wirna still has is_lintas_wilayah = true!');
      }
      await client.end();
    }
    main().catch(err => { console.error(err); process.exit(1); });
    `;
    const b64 = Buffer.from(testDbScript).toString('base64');
    const dbOut = runBE(`echo "${b64}" | base64 -d | docker exec -i bdb-api node`);
    console.log(dbOut.trim());

    console.log('\n=== ALL VERIFICATIONS PASSED (100% HEALTHY) ===');
}

verify().catch(e => {
    console.error('VERIFY ERROR:', e);
    process.exit(1);
});
