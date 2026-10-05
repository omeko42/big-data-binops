import fs from 'fs';
import { runFE, copyFileToFE } from './fe_exec.mjs';

async function deploy() {
    console.log('=== STEP 1: VALIDATING LOCAL FILES ===');
    
    // Check CSS
    const cssContent = fs.readFileSync('live-20sy5p32bn-wu.css', 'utf8');
    if (!cssContent.includes('z-index: 99999 !important')) {
        throw new Error('Local CSS missing z-index: 99999 !important');
    }
    if (!cssContent.includes('3000 !important')) {
        throw new Error('Local CSS missing secondary dialog z-index rules');
    }
    console.log('Local CSS validated: Contains 99999 popover & 3000 secondary dialog stacking rules.');

    // Check JS Chunk
    const jsContent = fs.readFileSync('live-laporan-perma.js', 'utf8');
    if (!jsContent.includes('lp-quick-doc-type') || !jsContent.includes('appendTo:typeof document!=="undefined"?document.body:undefined')) {
        throw new Error('Local JS chunk missing appendTo fix');
    }
    console.log('Local JS chunk validated: Contains appendTo fix for quick and bulk dropdowns.');

    console.log('\n=== STEP 2: CREATING REMOTE BACKUPS ===');
    runFE(`
        docker exec bdb-web cp -n /usr/src/app/.next/static/chunks/20sy5p32bn-wu.css /usr/src/app/.next/static/chunks/20sy5p32bn-wu.css.bak-modal-fix || true
        docker exec bdb-web cp -n /usr/src/app/.next/static/chunks/laporan-filter-perma-a15e28ec2e81.js /usr/src/app/.next/static/chunks/laporan-filter-perma-a15e28ec2e81.js.bak-modal-fix || true
    `);
    console.log('Remote backups created.');

    console.log('\n=== STEP 3: UPLOADING PATCHED FILES TO REMOTE HOST ===');
    copyFileToFE('live-20sy5p32bn-wu.css', '/tmp/20sy5p32bn-wu.css');
    copyFileToFE('live-laporan-perma.js', '/tmp/laporan-filter-perma-a15e28ec2e81.js');
    console.log('Files copied to remote /tmp.');

    console.log('\n=== STEP 4: DEPLOYING INTO BDB-WEB CONTAINER ===');
    runFE(`
        docker cp /tmp/20sy5p32bn-wu.css bdb-web:/usr/src/app/.next/static/chunks/20sy5p32bn-wu.css
        docker cp /tmp/laporan-filter-perma-a15e28ec2e81.js bdb-web:/usr/src/app/.next/static/chunks/laporan-filter-perma-a15e28ec2e81.js
        docker exec bdb-web chmod 644 /usr/src/app/.next/static/chunks/20sy5p32bn-wu.css
        docker exec bdb-web chmod 644 /usr/src/app/.next/static/chunks/laporan-filter-perma-a15e28ec2e81.js
        rm -f /tmp/20sy5p32bn-wu.css /tmp/laporan-filter-perma-a15e28ec2e81.js
    `);
    console.log('Files copied into bdb-web and permissions set.');

    console.log('\n=== STEP 5: VERIFYING DEPLOYED CHUNKS INSIDE CONTAINER ===');
    const cssVerif = runFE(`docker exec bdb-web grep -o "z-index: 99999 !important" /usr/src/app/.next/static/chunks/20sy5p32bn-wu.css | head -n 1`).trim();
    console.log('CSS verification in container:', cssVerif);
    if (!cssVerif.includes('99999')) {
        throw new Error('Failed to verify CSS in container!');
    }

    const jsVerif = runFE(`docker exec bdb-web grep -o "appendTo:typeof document!==\\\\\"undefined\\\\\"?document.body:undefined" /usr/src/app/.next/static/chunks/laporan-filter-perma-a15e28ec2e81.js | wc -l`).trim();
    console.log('JS appendTo occurrences in container:', jsVerif);
    if (parseInt(jsVerif) < 8) {
        throw new Error(`Expected at least 8 appendTo occurrences, got: ${jsVerif}`);
    }

    const syntaxCheck = runFE(`docker exec bdb-web node --check /usr/src/app/.next/static/chunks/laporan-filter-perma-a15e28ec2e81.js`);
    console.log('Container JS syntax check:', syntaxCheck.trim() || 'ALL GOOD (0 errors)');

    console.log('\n=== STEP 6: RESTARTING BDB-WEB CONTAINER ===');
    runFE('docker restart bdb-web');
    console.log('bdb-web restarted. Waiting 5s for warmup...');
    await new Promise(r => setTimeout(r, 5000));

    console.log('\n=== STEP 7: HEALTH CHECK ===');
    const httpRes = runFE(`curl -k -s -I -H "Host: cas.bareskrim.polri.go.id" https://127.0.0.1/cms/laporan-polisi | head -n 5`);
    console.log('HTTP Response from local nginx / FE:\n' + httpRes.trim());

    console.log('\n=== STEP 8: COMMITTING CONTAINER IMAGE ===');
    const commitRes = runFE('docker commit bdb-web bdb-web:latest');
    console.log('Container committed:', commitRes.trim());

    console.log('\n==============================================');
    console.log('>>> DEPLOYMENT 100% COMPLETE AND VERIFIED! <<<');
    console.log('==============================================');
}

deploy().catch(err => {
    console.error('DEPLOYMENT FAILED:', err);
    process.exit(1);
});
