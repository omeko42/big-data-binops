const fs = require('fs');
let typeorm;
try {
  typeorm = require('/usr/src/app/node_modules/typeorm');
} catch (e) {
  typeorm = require('typeorm');
}
const { DataSource } = typeorm;

const ds = new DataSource({
  type: 'postgres',
  host: '10.0.0.x',
  port: 5432,
  username: process.env.DB_USERNAME || 'bdb_app',
  password: process.env.DB_PASSWORD || 'Bareskrim2026',
  database: 'big_data_binops'
});

async function main() {
  await ds.initialize();
  console.log('Database connected.');

  const sistemUserId = 17189;
  const list = JSON.parse(fs.readFileSync('/tmp/payload_84.json', 'utf8'));
  console.log('Loaded ' + list.length + ' LPs from /tmp/payload_84.json');

  // Verify sistem user
  const u = await ds.query('SELECT id, name FROM auth_users WHERE id = $1', [sistemUserId]);
  if (!u.length || u[0].name !== 'Sistem') {
    throw new Error('Sistem user with ID ' + sistemUserId + ' not found or name mismatch!');
  }
  console.log('Validated Sistem user: ID ' + u[0].id + ' - Name: ' + u[0].name);

  const runner = ds.createQueryRunner();
  await runner.connect();
  await runner.startTransaction();

  const results = [];
  try {
    for (let i = 0; i < list.length; i++) {
      const item = list[i];

      // 1. Get current LP
      const lpCur = await runner.query('SELECT id, no_laporan, status_id, satker_id FROM bdb_laporan_polisi WHERE id = $1', [item.lpId]);
      if (!lpCur.length) {
        console.warn('LP ID not found in DB: ' + item.lpId);
        continue;
      }
      const curFromStatus = lpCur[0].status_id;

      // 2. Insert into bdb_dokumen
      const docData = {
        nomor_dokumen: item.nomorDokumen,
        tanggal_dokumen: item.tanggalDokumen,
        alasan: item.alasan || ''
      };

      const insDoc = await runner.query(
        `INSERT INTO bdb_dokumen (
            lp_id, 
            document_type_id, 
            nomor_dokumen, 
            tanggal_dokumen, 
            data, 
            lampiran, 
            created_by, 
            created_at
          ) VALUES ($1, $2, $3, $4::date, $5::jsonb, '[]'::jsonb, $6, now())
          RETURNING id`,
        [item.lpId, item.docTypeId, item.nomorDokumen, item.tanggalDokumen, JSON.stringify(docData), sistemUserId]
      );
      const docId = insDoc[0].id;

      // 3. Update bdb_laporan_polisi
      const tglSelesai = item.targetKategori === 'CC' ? item.tanggalDokumen : null;
      await runner.query(
        `UPDATE bdb_laporan_polisi 
          SET 
            satker_id = 18,
            satker_nama = 'DIT TIPIDUM BARESKRIM',
            status_id = $2,
            tanggal_selesai = $3::date,
            updated_at = now()
          WHERE id = $1`,
        [item.lpId, item.targetStatusId, tglSelesai]
      );

      // 4. Insert into bdb_status_override_log
      await runner.query(
        `INSERT INTO bdb_status_override_log (
            lp_id, 
            from_status_id, 
            to_status_id, 
            alasan, 
            created_by, 
            created_at
          ) VALUES ($1, $2, $3, $4, $5, now())`,
        [item.lpId, curFromStatus, item.targetStatusId, item.alasan || 'Pembaruan Dokumen & Status Sistem', sistemUserId]
      );

      results.push({
        lpId: item.lpId,
        noLaporan: item.noLaporan,
        docId: docId,
        fromStatus: curFromStatus,
        toStatus: item.targetStatusId,
        targetStatusName: item.targetStatusName,
        targetKategori: item.targetKategori,
        nomorDokumen: item.nomorDokumen,
        tanggalDokumen: item.tanggalDokumen
      });
    }

    await runner.commitTransaction();
    console.log('TRANSACTION COMMITTED SUCCESSFULLY. Total processed: ' + results.length);
    console.log(JSON.stringify({ success: true, count: results.length, sample: results.slice(0, 3) }));
    process.exit(0);
  } catch (err) {
    await runner.rollbackTransaction();
    console.error('TRANSACTION FAILED & ROLLED BACK:', err);
    process.exit(1);
  } finally {
    await runner.release();
  }
}

main().catch(e => {
  console.error('FATAL:', e);
  process.exit(1);
});
