import { runBE } from './be_exec.mjs';

const testScript = `
const { DataSource } = require('typeorm');
const ds = new DataSource({
  type: 'postgres',
  host: '10.0.0.x',
  port: 5432,
  username: 'bdb_app',
  password: 'Bareskrim2026',
  database: 'big_data_binops'
});

async function main() {
  await ds.initialize();
  const { JukrahService } = require('./dist/bdb/jukrah/jukrah.service.js');
  const s = new JukrahService(ds);

  // Check formatCallsign for dolly and idris
  const fDolly = s.formatCallsign('dolly', 14481, 'dolly');
  const fIdris = s.formatCallsign('idrisganteng', 15403, 'idrisganteng');
  const fEko = s.formatCallsign('omeko11', 1, 'omeko11');
  const fOther = s.formatCallsign(null, 14787, null);

  console.log('FORMAT RESULTS:', {
    dolly: fDolly,
    idris: fIdris,
    eko: fEko,
    other: fOther
  });
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
`;

const b64 = Buffer.from(testScript).toString('base64');
console.log(runBE(`docker exec bdb-api node -e "eval(Buffer.from('${b64}', 'base64').toString('utf8'))"`));
