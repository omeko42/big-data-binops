import { runBE } from './fe_inspect.mjs';

const cmd = `docker exec bdb-api cat /usr/src/app/src/bdb/pihak-terlibat/pihak-terlibat.controller.ts`;
try {
    console.log(runBE(cmd));
} catch (e) {
    console.error(e.message);
}
