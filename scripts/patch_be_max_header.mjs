import { runBE } from './be_exec.mjs';

const script = `
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('/usr/src/app/package.json', 'utf8'));
pkg.scripts['start:prod'] = 'node --max-http-header-size=65536 dist/main.js';
fs.writeFileSync('/usr/src/app/package.json', JSON.stringify(pkg, null, 4));
console.log('package.json successfully updated with max-http-header-size=65536');
`;

const b64 = Buffer.from(script).toString('base64');
console.log(runBE(`
echo '${b64}' | base64 -d > /tmp/update_pkg.js
docker cp /tmp/update_pkg.js bdb-api:/usr/src/app/update_pkg.js
docker exec bdb-api node /usr/src/app/update_pkg.js
docker exec bdb-api rm -f /usr/src/app/update_pkg.js
rm -f /tmp/update_pkg.js

docker restart bdb-api
sleep 5
docker ps --filter "name=bdb-api"
`));
