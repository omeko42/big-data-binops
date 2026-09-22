import { runBE } from './fe_inspect.mjs';

const cmd = `docker exec bdb-api grep -n 'resolveScope' /usr/src/app/src/bdb/laporan-polisi/laporan-polisi.service.ts || true`;
try {
    console.log(runBE(cmd));
} catch (e) {
    console.error(e.message);
}
