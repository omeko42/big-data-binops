import { runFE } from './fe_inspect.mjs';

const cmd = `docker exec bdb-web grep -rn 'top_kejahatan' /usr/src/app/.next/server/app/`;
try {
    const res = runFE(cmd);
    console.log('Result:', res.length > 500 ? res.slice(0, 500) + '...' : res);
} catch (e) {
    console.log('Error/no match:', e.message);
}
