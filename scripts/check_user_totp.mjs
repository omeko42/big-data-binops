import { runBE } from './be_exec.mjs';

const cmd = `docker exec bdb-api node -e "
require('dotenv').config({ path: '/usr/src/app/.env' });
const { Client } = require('pg');
const c = new Client({
  host: process.env.POSTGRES_HOST || process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.POSTGRES_PORT || process.env.DB_PORT || 5432),
  user: process.env.POSTGRES_USER || process.env.DB_USERNAME || 'postgres',
  password: process.env.POSTGRES_PASSWORD || process.env.DB_PASSWORD,
  database: process.env.POSTGRES_DATABASE || process.env.DB_DATABASE || 'postgres',
});
c.connect()
  .then(() => c.query('SELECT id, username, email, email_polri, totp, pin_required, two_factor_required, length(totp_secret) as secret_len, totp_secret FROM auth_users WHERE id = 1;'))
  .then(r => { console.log('USER_ROW:', JSON.stringify(r.rows[0])); return c.end(); })
  .catch(e => { console.error('ERR:', e.message); c.end(); });
"`;

console.log(runBE(cmd));
