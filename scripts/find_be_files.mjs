import { runBE } from './be_exec.mjs';

function main() {
    const res = runBE(`
docker exec bdb-api find /usr/src/app/src -name "user.service.ts"
docker exec bdb-api find /usr/src/app/src -name "auth.service.ts"
docker exec bdb-api find /usr/src/app/src -name "user.entity.ts"
    `);
    console.log(res);
}

main();
