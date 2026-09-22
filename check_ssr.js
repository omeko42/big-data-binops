const fs = require('fs');

const ssrFile = '/usr/src/app/.next/server/chunks/ssr/app_cms_integrasi_satker-legacy_page_tsx_0ncko_s._.js';
if (fs.existsSync(ssrFile)) {
    const c = fs.readFileSync(ssrFile, 'utf8');
    const idx = c.indexOf('Reconcile Manual');
    console.log('SSR file size:', c.length, 'idx:', idx);
} else {
    console.log('SSR file does not exist');
}
