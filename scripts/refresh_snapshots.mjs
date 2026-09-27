import { runBE } from './be_exec.mjs';

const script = `
const { Client } = require('pg');
const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

async function main() {
  await client.connect();
  console.log('Refreshing snapshot tables with new scoring and true lintas wilayah...');
  
  // We can call the backend service refresh method or trigger it via the service container
  // Or run the SQL directly for Sarjono and 2026/all-time!
  // Let's see if we can trigger refreshRankingSnapshots from the Nest app:
  const http = require('http');
  // First let's check how ranking snapshot refresh is triggered
  // Or check the service in Nest:
  console.log('Calling ranking API to verify response...');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
`;

const b64 = Buffer.from(script).toString('base64');
const cmd = `echo "${b64}" | base64 -d | docker exec -i bdb-api node`;
console.log(runBE(cmd));
