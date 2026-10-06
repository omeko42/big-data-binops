import { runBE } from './be_exec.mjs';

const script = `
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
  console.log('Creating partial index on bdb_laporan_polisi(id) WHERE master_data_linked_at IS NULL...');
  await ds.query("CREATE INDEX IF NOT EXISTS bdb_lp_master_linked_null_idx ON bdb_laporan_polisi(id) WHERE master_data_linked_at IS NULL");
  console.log('Index created successfully!');

  const idxCheck = await ds.query("SELECT indexname FROM pg_indexes WHERE tablename = 'bdb_laporan_polisi' AND indexname = 'bdb_lp_master_linked_null_idx'");
  console.log('Verified index:', idxCheck);
  process.exit(0);
}

main().catch(e => { console.error('Index creation failed:', e.message); process.exit(1); });
`;

const b64 = Buffer.from(script).toString('base64');
console.log(runBE(`docker exec bdb-api node -e "eval(Buffer.from('${b64}', 'base64').toString('utf8'))"`));
