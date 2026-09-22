import { runBE } from './fe_inspect.mjs';

try {
    console.log('Backing up anev.service.ts...');
    runBE('docker exec bdb-api cp /usr/src/app/src/bdb/anev/anev.service.ts /usr/src/app/src/bdb/anev/anev.service.ts.bak-20260913');

    console.log('Patching anev.service.ts directly inside bdb-api container...');
    const patchScript = `
docker exec bdb-api node -e '
const fs = require("fs");
const p = "/usr/src/app/src/bdb/anev/anev.service.ts";
let s = fs.readFileSync(p, "utf8");
const target = "top_kejahatan: kej.map((k: any) => ({ nama: k.nama, jml: k.jml })),";
const rep = "top_kejahatan: (!scope.all && top_kejahatan_regional.length > 0) ? top_kejahatan_regional : kej.map((k: any) => ({ nama: k.nama, jml: k.jml })),";
if (!s.includes(target)) {
    console.error("Target not found!");
    process.exit(1);
}
s = s.replace(target, rep);
fs.writeFileSync(p, s, "utf8");
console.log("File patched successfully!");
'
`;
    console.log(runBE(patchScript));

    console.log('Verifying patch...');
    const verifyScript = `docker exec bdb-api grep -n 'top_kejahatan:' /usr/src/app/src/bdb/anev/anev.service.ts`;
    console.log(runBE(verifyScript));
} catch (e) {
    console.error('FAILED:', e.message);
    if (e.stderr) console.error('STDERR:', e.stderr);
    if (e.stdout) console.log('STDOUT:', e.stdout);
}
