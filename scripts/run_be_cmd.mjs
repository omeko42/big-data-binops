import { runBE } from './fe_inspect.mjs';

const cmd = process.argv[2] || 'docker exec bdb-api sed -n 20,40p /usr/src/app/src/bdb/pihak-terlibat/pihak-terlibat.controller.ts';
console.log(runBE(cmd));
