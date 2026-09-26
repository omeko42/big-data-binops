import { runFE } from './fe_exec.mjs';

function main() {
    console.log("=== SEARCHING NEXT.JS APP ROUTES ON FE ===");
    const routes = runFE(`
        find /usr/src/app/.next/server/app -type f | grep -E "(profil|user|pengguna|security|keamanan)" | head -n 40
    `);
    console.log("App routes:", routes);

    console.log("=== SEARCHING NEXT.JS PAGES ON FE ===");
    const pages = runFE(`
        find /usr/src/app/.next/server/pages -type f 2>/dev/null | grep -E "(profil|user|pengguna)" | head -n 40
    `);
    console.log("Pages:", pages);

    console.log("=== GREP CMS PROFILE IN STATIC CHUNKS ===");
    const grepProfile = runFE(`
        grep -rnwl "/usr/src/app/.next/static/chunks" -e "/cms/profil" -e "Profil Saya" -e "Ubah Profil" 2>/dev/null | head -n 20
    `);
    console.log("Profile chunks:", grepProfile);
}

main();
