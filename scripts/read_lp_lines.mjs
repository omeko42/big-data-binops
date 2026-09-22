import { runBE } from './fe_inspect.mjs';

const cmd = `docker exec bdb-api sed -n '1350,1380p' /usr/src/app/src/bdb/laporan-polisi/laporan-polisi.service.ts`;
try {
    console.log(runBE(cmd));
} catch (e) {
    console.error(e.message);
}
