import { runBE } from './be_exec.mjs';
console.log(runBE('docker exec bdb-api node -e "require(\'dotenv\').config({ path: \'/usr/src/app/.env\' }); console.log(\'PORT:\', process.env.PORT);"'));
