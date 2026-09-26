import { runBE } from './be_exec.mjs';
import fs from 'fs';

function main() {
    const remote = runBE(`docker exec bdb-api cat /usr/src/app/src/app_core/auth/user/entities/user.entity.ts`);
    const local = fs.readFileSync('bdb-api-source-20260811/src/app_core/auth/user/entities/user.entity.ts', 'utf8');
    console.log("Remote len:", remote.length, "Local len:", local.length, "Equal:", remote === local);
    if (remote !== local) {
        fs.writeFileSync('scratch/remote_user.entity.ts', remote);
    }
}

main();
