import { runFE } from './fe_inspect.mjs';

const cmd = `docker exec bdb-web grep -n 'dash-grid' /usr/src/app/.next/static/chunks/20sy5p32bn-wu.css /usr/src/app/.next/static/chunks/34oh417k1w4ti.css /usr/src/app/.next/static/chunks/233p45nuh4m5b.css`;
try {
    console.log(runFE(cmd));
} catch (e) {
    console.error(e.message);
}
