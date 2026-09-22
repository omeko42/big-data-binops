import { runBE } from './fe_inspect.mjs';

const inspectCmd = `docker exec bdb-api sed -n '400,440p' /usr/src/app/src/bdb/anev/anev.service.ts`;
console.log(runBE(inspectCmd));
