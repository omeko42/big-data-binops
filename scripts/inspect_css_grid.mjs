import { runFE } from './fe_inspect.mjs';

const cmd = `
docker exec bdb-web grep -rn 'dash-grid' /usr/src/app/.next/static/css/ /usr/src/app/public/ /usr/src/app/src/ 2>/dev/null || true
`;

try {
    console.log(runFE(cmd));
} catch (e) {
    console.error(e.message);
}
