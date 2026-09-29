import { runBE } from './be_exec.mjs';

const patchScript = `
const fs = require('fs');

const files = [
  '/usr/src/app/dist/app_core/auth/auth.service.js',
  '/usr/src/app/src/app_core/auth/auth.service.ts'
];

files.forEach(p => {
  if (!fs.existsSync(p)) {
    console.log('Not found:', p);
    return;
  }
  let c = fs.readFileSync(p, 'utf8');
  if (c.includes('bdbSatkerRows')) {
    console.log('Already patched:', p);
    return;
  }

  // Find the Promise.all with bdb_satker_master
  const oldCodeDist = \`        const [scopeRows, policeRows] = await Promise.all([
            this.dataSource.query(\\\`
                select id, satker_key, nama_satker_canonical, level, full_path
                from bdb_satker_master
                where ($1::bigint is not null and id = $1::bigint)
                   or ($2::text is not null and satker_key = $2::text)
                order by id asc
                limit 1
                \\\`, [user.scope_satker_id ? Number(user.scope_satker_id) : null, user.scope_satker_key || null]),
            this.dataSource.query(\\\`
                select nrp, nama, satuan, no_hp, pangkat, jabatan, email, foto, is_pns, social_media
                from trb_police
                where lower(email) = any($1::text[])
                order by id desc
                limit 1
                \\\`, [[this.normalizeEmail(user.email), this.normalizeEmail(user.email_polri)].filter(Boolean)])
        ]);
        const scopeRow = scopeRows[0];
        const policeProfile = policeRows[0];
        const roleBdb = this.normalizeBdbRole(user.role_bdb);
        const scopeAccessDisplay = roleBdb === 'superadmin'
            ? 'Nasional'
            : scopeRow?.nama_satker_canonical
                ? \\\`\\\${scopeRow.nama_satker_canonical} dan bawahannya\\\`
                : satker || 'Belum pilih';\`;

  const newCode = \`        const [scopeRowsMaster, policeRows] = await Promise.all([
            this.dataSource.query(\\\`
                select id, satker_key, nama_satker_canonical, level, full_path
                from bdb_satker_master
                where ($1::bigint is not null and id = $1::bigint)
                   or ($2::text is not null and satker_key = $2::text)
                order by id asc
                limit 1
                \\\`, [user.scope_satker_id ? Number(user.scope_satker_id) : null, user.scope_satker_key || null]),
            this.dataSource.query(\\\`
                select nrp, nama, satuan, no_hp, pangkat, jabatan, email, foto, is_pns, social_media
                from trb_police
                where lower(email) = any($1::text[])
                order by id desc
                limit 1
                \\\`, [[this.normalizeEmail(user.email), this.normalizeEmail(user.email_polri)].filter(Boolean)])
        ]);
        let scopeRow = scopeRowsMaster[0];
        if (!scopeRow) {
            const bdbSatkerRows = await this.dataSource.query(\\\`
                select id, kode as satker_key, coalesce(deskripsi, nama_singkat) as nama_satker_canonical, tipe_satker as level, coalesce(deskripsi, nama_singkat) as full_path
                from bdb_satker
                where ($1::bigint is not null and id = $1::bigint)
                   or ($2::text is not null and kode = $2::text)
                order by id asc
                limit 1
            \\\`, [user.scope_satker_id ? Number(user.scope_satker_id) : null, user.scope_satker_key || null]);
            scopeRow = bdbSatkerRows[0];
        }
        const policeProfile = policeRows[0];
        const roleBdb = this.normalizeBdbRole(user.role_bdb);
        if (scopeRow?.nama_satker_canonical && roleBdb !== 'superadmin') {
            satker = scopeRow.nama_satker_canonical;
        }
        const scopeAccessDisplay = roleBdb === 'superadmin'
            ? 'Nasional'
            : scopeRow?.nama_satker_canonical
                ? \\\`\\\${scopeRow.nama_satker_canonical} dan bawahannya\\\`
                : satker || 'Belum pilih';\`;

  if (c.includes(oldCodeDist)) {
    c = c.replace(oldCodeDist, newCode);
    fs.writeFileSync(p, c);
    console.log('Successfully patched:', p);
  } else {
    // Try normalized whitespace replace
    console.log('Exact string not matched, attempting regex match in:', p);
    const regex = /const\\s+\\[scopeRows,\\s*policeRows\\]\\s*=\\s*await\\s+Promise\\.all\\(\\[[\\s\\S]*?const\\s+scopeAccessDisplay\\s*=\\s*roleBdb\\s*===\\s*'superadmin'[\\s\\S]*?:\\s*satker\\s*\\|\\|\\s*'Belum pilih';/;
    if (regex.test(c)) {
      c = c.replace(regex, newCode.trim());
      fs.writeFileSync(p, c);
      console.log('Successfully patched via regex:', p);
    } else {
      console.error('Failed to match pattern in:', p);
    }
  }
});
`;

const b64 = Buffer.from(patchScript).toString('base64');
console.log('Applying patch...');
console.log(runBE(`docker exec bdb-api node -e "$(echo '${b64}' | base64 -d)"`));

console.log('Restarting bdb-api...');
console.log(runBE('docker restart bdb-api'));

console.log('Waiting 5s...');
Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 5000);

console.log('Testing Authentication endpoint for Hendrik (id 122)...');
const testScript = `
const http = require('http');
const { Client } = require('pg');
const jwt = require('jsonwebtoken');

async function test() {
  const c = new Client('postgresql://bdb_app:Bareskrim2026@10.0.0.x:5432/big_data_binops');
  await c.connect();
  const d = (await c.query('select * from auth_devices order by id desc limit 1')).rows[0];
  const u122 = (await c.query('select * from auth_users where id = 122')).rows[0];
  await c.end();

  const token = jwt.sign({
    id: u122.id,
    user: { id: u122.id, organisasi_id: u122.organisasi_id, organisasiRoleId: u122.organisasi_role_id, Organisasi: { id: u122.organisasi_id } },
    device_token: d?.device_token || 'dummy'
  }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

  const req = http.request({
    hostname: '127.0.0.1',
    port: 3850,
    path: '/api/Authentication/user',
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + token }
  }, res => {
    let buf = '';
    res.on('data', chunk => buf += chunk);
    res.on('end', () => {
      console.log('Status code:', res.statusCode);
      try {
        const json = JSON.parse(buf);
        console.log('User 122 returned:', {
          id: json.data?.id,
          name: json.data?.name,
          username: json.data?.username,
          callsign: json.data?.callsign,
          role_bdb: json.data?.role_bdb,
          satker: json.data?.satker,
          scope_satker_name: json.data?.scope_satker_name,
          scope_access_display: json.data?.scope_access_display
        });
      } catch(e) {
        console.log('Raw body:', buf);
      }
    });
  });
  req.on('error', console.error);
  req.end();
}
test();
`;
const testB64 = Buffer.from(testScript).toString('base64');
console.log(runBE(`docker exec bdb-api node -e "$(echo '${testB64}' | base64 -d)"`));
