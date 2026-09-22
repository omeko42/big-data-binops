import { runBE } from './fe_inspect.mjs';

const inspectCmd = `docker exec bdb-api sed -n '520,555p' /usr/src/app/src/bdb/anev/anev.service.ts`;
console.log(runBE(inspectCmd));
