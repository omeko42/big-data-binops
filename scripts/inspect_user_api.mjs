import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-api node -e "
const http = require('http');
// Let's inspect /user or auth controllers in NestJS
console.log('Inspecting BE routes...');
"`;
console.log(runFE(cmd));
