import { runFE } from './fe_exec.mjs';

async function main() {
    const cmd1 = `curl -k -s https://cas.bareskrim.polri.go.id/_next/static/chunks/3pp0f_cp6yg-o.js | grep -o 'isCmEko'`;
    console.log('3pp0f_cp6yg-o.js via HTTPS has isCmEko:', runFE(cmd1).trim());

    const cmd2 = `curl -k -s https://cas.bareskrim.polri.go.id/_next/static/chunks/3def3ti6rk0vr.js | grep -o 'isUsrEko'`;
    console.log('3def3ti6rk0vr.js via HTTPS has isUsrEko:', runFE(cmd2).trim());
}

main().catch(console.error);
