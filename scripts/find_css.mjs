import { runFE } from './fe_inspect.mjs';

const cmd = `docker exec bdb-web find /usr/src/app/.next/ -name '*.css'`;
try {
    console.log(runFE(cmd));
} catch (e) {
    console.error(e.message);
}
