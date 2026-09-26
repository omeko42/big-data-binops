import { runBE } from './be_exec.mjs';
import fs from 'fs';

function main() {
    const remote = runBE(`docker exec bdb-api cat /usr/src/app/src/app_core/auth/auth.service.ts`);
    const local = fs.readFileSync('bdb-api-source-20260811/src/app_core/auth/auth.service.ts', 'utf8');
    console.log("Remote auth len:", remote.length, "Local auth len:", local.length);
    console.log("Equal:", remote === local);
    if (remote !== local) {
        fs.writeFileSync('scratch/remote_auth.service.ts', remote);
        console.log("Wrote scratch/remote_auth.service.ts for diffing");
    }
}

main();
