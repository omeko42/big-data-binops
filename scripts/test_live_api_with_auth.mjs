import { runBE } from './fe_inspect.mjs';

const testScript = `
const http = require('http');
const jwt = require('jsonwebtoken');
const { Client } = require('pg');

async function testAll() {
  const c = new Client('postgresql://bdb_app:Bareskrim2026@10.0.0.x:5432/big_data_binops');
  await c.connect();
  const d = await c.query('select * from auth_devices order by id desc limit 1');
  const superUser = (await c.query("select * from auth_users where id = 320")).rows[0];
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
    return jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
  }

  function req(path, token) {
      return new Promise((resolve, reject) => {
          http.get({
              hostname: '127.0.0.1',
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

  console.log('=== TEST 1: Sarjono (3404111801740001) ===');
  const t1 = await req('/api/bdb/pihak-terlibat/laporan-by-nik/3404111801740001', superToken);
  console.log('HTTP Status:', t1.statusCode);
  console.log('Total LPs found:', t1.body.data?.length);
  if (t1.body.data?.length > 0) {
    const s = t1.body.data[0];
    console.log('Sample LP fields:', {
      no_laporan: s.no_laporan,
      tgl_laporan: s.tgl_laporan,
      waktu_kejadian: s.waktu_kejadian,
      tempat_kejadian: s.tempat_kejadian ? s.tempat_kejadian.substring(0, 40) : null,
      kejahatan: s.kejahatan,
      status_lp: s.status_lp,
      uraian_kejadian: s.uraian_kejadian ? s.uraian_kejadian.substring(0, 50) + '...' : null,
      satker_nama: s.satker_nama,
      wilayah_nama: s.wilayah_nama
    });
  }

  console.log('\\n=== TEST 2: I Nyoman Wirna (5107083112740170) ===');
  const t2 = await req('/api/bdb/pihak-terlibat/laporan-by-nik/5107083112740170', superToken);
  console.log('HTTP Status:', t2.statusCode);
  console.log('Total LPs found:', t2.body.data?.length);
  if (t2.body.data?.length > 0) {
    const w = t2.body.data[0];
    console.log('Sample LP fields:', {
      no_laporan: w.no_laporan,
      tgl_laporan: w.tgl_laporan,
      waktu_kejadian: w.waktu_kejadian,
      tempat_kejadian: w.tempat_kejadian ? w.tempat_kejadian.substring(0, 40) : null,
      kejahatan: w.kejahatan,
      status_lp: w.status_lp,
      uraian_kejadian: w.uraian_kejadian ? w.uraian_kejadian.substring(0, 50) + '...' : null,
      satker_nama: w.satker_nama,
      wilayah_nama: w.wilayah_nama
    });
  }

  console.log('\\n=== TEST 3: PT DANA SYARIAH INDONESIA ===');
  const t3 = await req('/api/bdb/pihak-terlibat/laporan-by-nik/' + encodeURIComponent('KORP:PT_DANA_SYARIAH_INDONESIA'), superToken);
  console.log('HTTP Status:', t3.statusCode);
  console.log('Total LPs found:', t3.body.data?.length);
  if (t3.body.data?.length > 0) {
    const c = t3.body.data[0];
    console.log('Sample LP fields:', {
      no_laporan: c.no_laporan,
      tgl_laporan: c.tgl_laporan,
      waktu_kejadian: c.waktu_kejadian,
      tempat_kejadian: c.tempat_kejadian ? c.tempat_kejadian.substring(0, 40) : null,
      kejahatan: c.kejahatan,
      status_lp: c.status_lp,
      uraian_kejadian: c.uraian_kejadian ? c.uraian_kejadian.substring(0, 50) + '...' : null,
      satker_nama: c.satker_nama,
      wilayah_nama: c.wilayah_nama
    });
  }
}

testAll().catch(console.error);
`;

const b64 = Buffer.from(testScript).toString('base64');
console.log(runBE(`echo "${b64}" | base64 -d | docker exec -i bdb-api node`));
