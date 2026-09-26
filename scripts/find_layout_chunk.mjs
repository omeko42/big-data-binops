import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web node -e "
const fs = require('fs');
const path = '/usr/src/app/.next/static/chunks/';
const files = fs.readdirSync(path).filter(f => f.endsWith('.js'));
for (const file of files) {
    const full = path + file;
    try {
        const c = fs.readFileSync(full, 'utf8');
        // Check for Kembali
        if (c.includes('Kembali') && (c.includes('arrow-left') || c.includes('pi-arrow-left') || c.includes('←') || c.includes('router.back') || c.includes('history.back'))) {
            console.log('Found KEMBALI in:', file);
        }
        // Check for topbar / navbar user profile
        if (c.includes('Superadmin') && (c.includes('cms/profile') || c.includes('avatar') || c.includes('header') || c.includes('topbar'))) {
            console.log('Found HEADER/TOPBAR in:', file);
        }
    } catch(e) {}
}
"`;

console.log(runFE(cmd));
