import { runFE } from './fe_exec.mjs';

async function main() {
    const cmd = process.argv[2] || 'docker exec bdb-web ls -la /usr/src/app/.next/static/chunks/3pp0f_cp6yg-o.js';
    console.log(runFE(cmd));
}
main().catch(console.error);
