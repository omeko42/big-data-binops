import { runBE, copyFileToBE } from './be_exec.mjs';

console.log('1. Copying backend files to BE...');
copyFileToBE('backend-patch/jukrah.service.js', '/tmp/jukrah.service.js');
copyFileToBE('backend-patch/jukrah.controller.js', '/tmp/jukrah.controller.js');

console.log('2. Installing into bdb-api container...');
const cmd = `
docker cp /tmp/jukrah.service.js bdb-api:/usr/src/app/dist/bdb/jukrah/jukrah.service.js
docker cp /tmp/jukrah.controller.js bdb-api:/usr/src/app/dist/bdb/jukrah/jukrah.controller.js
docker restart bdb-api
`;

console.log(runBE(cmd));
console.log('3. Waiting for bdb-api to boot...');
Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 5000);

const testOut = runBE(`docker exec bdb-api node -e "
const { DataSource } = require('typeorm');
const ds = new DataSource({
  type: 'postgres',
  host: '10.0.0.x',
  port: 5432,
  username: 'bdb_app',
  password: 'Bareskrim2026',
  database: 'big_data_binops'
});
ds.initialize().then(async () => {
  const { JukrahService } = require('./dist/bdb/jukrah/jukrah.service.js');
  const s = new JukrahService(ds);
  const dollyRes = await s.getNetworkProfile({ id: 1 }, 'dolly');
  console.log('DOLLY PROFILE OK:', dollyRes.data.username, dollyRes.data.callsign, dollyRes.data.role_bdb);
  const idrisRes = await s.getNetworkProfile({ id: 1 }, 'idrisganteng');
  console.log('IDRIS PROFILE OK:', idrisRes.data.username, idrisRes.data.callsign, idrisRes.data.role_bdb);
  const dollyCodeRes = await s.getNetworkProfile({ id: 1 }, 'user_14481abcd');
  console.log('DOLLY USER_CODE RESOLVE OK:', dollyCodeRes.data.username);
  process.exit(0);
}).catch(e => {
  console.error('TEST ERROR:', e);
  process.exit(1);
});
"`);

console.log('4. Live Verification Output:');
console.log(testOut);
