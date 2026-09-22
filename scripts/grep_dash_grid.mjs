import { runFE } from './fe_inspect.mjs';

const cmd = `docker exec bdb-web grep -rn 'dash-grid' /usr/src/app/.next/static/chunks/*.css`;
try {
    console.log(runFE(cmd));
} catch (e) {
    console.error(e.message);
}
