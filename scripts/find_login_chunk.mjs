import { runFE } from './fe_exec.mjs';

function main() {
    const out = runFE(`docker exec bdb-web grep -rnwl "/usr/src/app/.next" -e "Masuk ke Akun" 2>/dev/null`);
    console.log(out);
}

main();
