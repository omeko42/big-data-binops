import { runBE } from './be_exec.mjs';
import fs from 'fs';

function main() {
    const remote = runBE(`docker exec bdb-api cat /usr/src/app/src/app_core/auth/user/user.service.ts`);
    const local = fs.readFileSync('user.service.ts', 'utf8');
    console.log("Remote len:", remote.length, "Local len:", local.length);
    console.log("Equal:", remote === local);
    if (remote !== local) {
        fs.writeFileSync('scratch/remote_user.service.ts', remote);
        console.log("Wrote scratch/remote_user.service.ts for diffing");
    }
}

main();
