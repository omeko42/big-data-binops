import { runFE } from './fe_inspect.mjs';

const cmd = `docker exec bdb-web grep -rn 'cas_pt_jump' /usr/src/app/.next/static/chunks/`;
try {
    console.log(runFE(cmd));
} catch (e) {
    console.error(e.message);
}
