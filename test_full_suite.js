const http = require('http');
const jwt = require('jsonwebtoken');
const { Client } = require('pg');

async function testAll() {
  const c = new Client('postgresql://bdb_app:Bareskrim2026@10.0.0.x:5432/big_data_binops');
  await c.connect();
  const d = await c.query('select * from auth_devices order by id desc limit 1');
  const superUser = (await c.query("select * from auth_users where id = 320")).rows[0];
  const opUser122 = (await c.query("select * from auth_users where id = 122")).rows[0];
  const opUser124 = (await c.query("select * from auth_users where id = 124")).rows[0];
  await c.end();

  function makeToken(user, roleId) {
    const payload = {
        id: user.id,
        user: {
            id: user.id,
            organisasi_id: user.organisasi_id || 1,
            organisasiRoleId: roleId,
            Organisasi: { id: user.organisasi_id || 1 }
        },
        device_token: d.rows[0].device_token
    };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  }

  function req(path, token) {
      return new Promise((resolve, reject) => {
          http.get({
              hostname: 'localhost',
              port: 3850,
              path: path,
              headers: { 'Authorization': 'Bearer ' + token }
          }, res => {
              let data = '';
              res.on('data', chunk => data += chunk);
              res.on('end', () => {
                  try {
                      resolve({ statusCode: res.statusCode, body: JSON.parse(data) });
                  } catch (e) {
                      resolve({ statusCode: res.statusCode, body: data });
                  }
              });
          }).on('error', reject);
      });
  }

  const superToken = makeToken(superUser, 1);
  const opToken122 = makeToken(opUser122, 3);
  const opToken124 = makeToken(opUser124, 3);

  console.log('====================================================');
  console.log('TEST 1: Superadmin Corporate Ranking (Year 2026)');
  console.log('====================================================');
  const t1 = await req('/api/bdb/pihak-terlibat/ranking?master=1&subjek=KORPORASI', superToken);
  console.log('HTTP Status:', t1.statusCode);
  console.log('Pagination:', t1.body.pagination);
  console.log('Summary:', t1.body.meta?.summary);
  console.log('Top 3:');
  (t1.body.data || []).slice(0, 3).forEach((r, i) => {
    console.log(`  [${i+1}] ${r.nama} (NIK: ${r.nik}) | Total: ${r.total_lp} | Kasta: ${r.kasta} | Subjek: ${r.tipe_subjek} | Satker: ${r.satker_nama}`);
  });

  console.log('\n====================================================');
  console.log('TEST 2: Superadmin Personal Ranking (PERORANGAN)');
  console.log('====================================================');
  const t2 = await req('/api/bdb/pihak-terlibat/ranking?master=1&subjek=PERORANGAN', superToken);
  console.log('HTTP Status:', t2.statusCode);
  console.log('Pagination:', t2.body.pagination);
  console.log('Top 2:');
  (t2.body.data || []).slice(0, 2).forEach((r, i) => {
    console.log(`  [${i+1}] ${r.nama} (NIK: ${r.nik}) | Total: ${r.total_lp} | Kasta: ${r.kasta} | Subjek: ${r.tipe_subjek}`);
  });

  console.log('\n====================================================');
  console.log('TEST 3: Operator 122 (Jatim) Corporate Ranking');
  console.log('====================================================');
  const t3 = await req('/api/bdb/pihak-terlibat/ranking?master=1&subjek=KORPORASI', opToken122);
  console.log('HTTP Status:', t3.statusCode);
  console.log('Pagination (Scoped):', t3.body.pagination);
  console.log('Summary (Scoped):', t3.body.meta?.summary);
  console.log('Top 3:');
  (t3.body.data || []).slice(0, 3).forEach((r, i) => {
    console.log(`  [${i+1}] ${r.nama} | Total: ${r.total_lp} | Kasta: ${r.kasta} | Satker: ${r.satker_nama}`);
  });

  console.log('\n====================================================');
  console.log('TEST 4: Operator 124 (Jambi) Corporate Ranking');
  console.log('====================================================');
  const t4 = await req('/api/bdb/pihak-terlibat/ranking?master=1&subjek=KORPORASI', opToken124);
  console.log('HTTP Status:', t4.statusCode);
  console.log('Pagination (Scoped):', t4.body.pagination);
  console.log('Summary (Scoped):', t4.body.meta?.summary);
  console.log('Top 3:');
  (t4.body.data || []).slice(0, 3).forEach((r, i) => {
    console.log(`  [${i+1}] ${r.nama} | Total: ${r.total_lp} | Kasta: ${r.kasta} | Satker: ${r.satker_nama}`);
  });

  console.log('\n====================================================');
  console.log('TEST 5: Detail LP by Corporate NIK');
  console.log('====================================================');
  const testNik = t1.body.data?.[0]?.nik || 'KORP:PT_DANA_SYARIAH_INDONESIA';
  const t5 = await req('/api/bdb/pihak-terlibat/laporan-by-nik/' + encodeURIComponent(testNik), superToken);
  console.log('HTTP Status:', t5.statusCode);
  console.log('Total LPs found for', testNik, ':', t5.body.data?.length);
  if (t5.body.data?.length > 0) {
    console.log('Sample LP:', t5.body.data[0]);
  }

  console.log('\n====================================================');
  console.log('TEST 6: All-Time Corporate Ranking (tahun=all)');
  console.log('====================================================');
  const t6 = await req('/api/bdb/pihak-terlibat/ranking?master=1&subjek=KORPORASI&tahun=all', superToken);
  console.log('HTTP Status:', t6.statusCode);
  console.log('All-Time Pagination:', t6.body.pagination);
  console.log('All-Time Summary:', t6.body.meta?.summary);
  console.log('Top 3 All-Time:');
  (t6.body.data || []).slice(0, 3).forEach((r, i) => {
    console.log(`  [${i+1}] ${r.nama} | Total: ${r.total_lp} | Kasta: ${r.kasta} | Satker: ${r.satker_nama}`);
  });
}

testAll().catch(console.error);
