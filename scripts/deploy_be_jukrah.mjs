import { runBE, copyFileToBE } from './be_exec.mjs';

async function main() {
  console.log('1. Copying patched files to backend host...');
  copyFileToBE('backend-patch/jukrah.service.js', '/tmp/jukrah.service.js');
  copyFileToBE('backend-patch/jukrah.controller.js', '/tmp/jukrah.controller.js');

  console.log('2. Copying files into bdb-api container...');
  console.log(runBE(`
    docker cp /tmp/jukrah.service.js bdb-api:/usr/src/app/dist/bdb/jukrah/jukrah.service.js
    docker cp /tmp/jukrah.controller.js bdb-api:/usr/src/app/dist/bdb/jukrah/jukrah.controller.js
    rm -f /tmp/jukrah.service.js /tmp/jukrah.controller.js
  `));

  console.log('3. Validating syntax inside container...');
  const v = runBE(`
    docker exec bdb-api node -c /usr/src/app/dist/bdb/jukrah/jukrah.service.js
    docker exec bdb-api node -c /usr/src/app/dist/bdb/jukrah/jukrah.controller.js
    echo "CONTAINER_SYNTAX_OK"
  `);
  console.log(v);

  console.log('4. Restarting bdb-api container...');
  runBE(`docker restart bdb-api`);

  console.log('5. Waiting 5s for bdb-api to boot...');
  await new Promise(r => setTimeout(r, 5000));

  console.log('6. Checking health of bdb-api...');
  const health = runBE(`docker exec bdb-api node -e "
    const http = require('http');
    http.get('http://127.0.0.1:3850/api/bdb/health', res => {
      console.log('Health status:', res.statusCode);
      process.exit(0);
    }).on('error', e => {
      console.error('Error:', e.message);
      process.exit(1);
    });
  "`);
  console.log(health);
}

main().catch(console.error);
