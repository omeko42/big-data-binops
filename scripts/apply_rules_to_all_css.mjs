import { runFE, copyFileToFE } from './fe_exec.mjs';

async function main() {
    console.log('1. Copying append_rules.css to remote /tmp...');
    copyFileToFE('scripts/append_rules.css', '/tmp/append_rules.css');

    console.log('2. Copying into container /tmp...');
    runFE('docker cp /tmp/append_rules.css bdb-web:/tmp/append_rules.css');

    console.log('3. Appending to 34oh417k1w4ti.css...');
    runFE(`
        docker exec bdb-web cp -n /usr/src/app/.next/static/chunks/34oh417k1w4ti.css /usr/src/app/.next/static/chunks/34oh417k1w4ti.css.bak-modal-fix || true
        docker exec bdb-web sh -c "cat /tmp/append_rules.css >> /usr/src/app/.next/static/chunks/34oh417k1w4ti.css"
    `);

    console.log('4. Appending to 233p45nuh4m5b.css...');
    runFE(`
        docker exec bdb-web cp -n /usr/src/app/.next/static/chunks/233p45nuh4m5b.css /usr/src/app/.next/static/chunks/233p45nuh4m5b.css.bak-modal-fix || true
        docker exec bdb-web sh -c "cat /tmp/append_rules.css >> /usr/src/app/.next/static/chunks/233p45nuh4m5b.css"
    `);

    console.log('5. Cleaning up /tmp...');
    runFE('rm -f /tmp/append_rules.css && docker exec bdb-web rm -f /tmp/append_rules.css');

    console.log('6. Verifying all 3 CSS files in bdb-web...');
    const verif = runFE(`
        docker exec bdb-web grep -c "z-index: 99999 !important" /usr/src/app/.next/static/chunks/20sy5p32bn-wu.css /usr/src/app/.next/static/chunks/34oh417k1w4ti.css /usr/src/app/.next/static/chunks/233p45nuh4m5b.css
    `);
    console.log('Grep counts across all CSS chunks:\n', verif.trim());
}

main().catch(e => {
    console.error('ERROR:', e);
    process.exit(1);
});
