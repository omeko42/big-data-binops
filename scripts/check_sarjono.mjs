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
  
  console.log('=== CHECK SARJONO IN RANKING SNAPSHOT ===');
  const snapRes = await client.query("SELECT * FROM bdb_pihak_terlibat_ranking_snapshot WHERE nik = '3404111801740001'");
  console.log('Snap count:', snapRes.rows.length);
  snapRes.rows.forEach(r => {
    console.log({
      tahun: r.tahun,
      bulan: r.bulan,
      kat: r.kategori_filter,
      total_lp: r.total_lp,
      count_tsk: r.count_tersangka,
      count_tlp: r.count_terlapor,
      satker_unik: r.jumlah_satker_unik,
      lintas_wilayah: r.is_lintas_wilayah,
      daftar_satker: r.daftar_satker
    });
  });

  console.log('\\n=== ALL DORS INVOLVEMENTS FOR SARJONO ===');
  const dorsRes = await client.query(\`
    SELECT 
      t.id as pihak_id,
      t.nama,
      t.nik,
      t.keterlibatan,
      d.id as dors_lp_id,
      d.no_laporan as dors_no_lp,
      d.tgl_laporan as dors_tgl_lp,
      d.waktu_kejadian,
      d.waktu_kejadian_faktual,
      d.id_polda,
      d.id_polres,
      d.id_polsek,
      d.tempat_kejadian,
      lp.id as lp_id,
      lp.no_laporan,
      lp.tgl_laporan,
      lp.satker_id,
      lp.satker_nama,
      lp.unit_satker_id,
      lp.unit_satker_nama
    FROM bdb_dors_lp_terlibat t
    JOIN bdb_dors_lp d ON d.id = t.lp_id
    LEFT JOIN bdb_laporan_polisi lp ON lp.dors_lp_id = d.dors_lp_id AND lp.model_lp = d.model_lp
    WHERE t.nik = '3404111801740001'
  \`);
  console.log('Dors count:', dorsRes.rows.length);
  console.log(JSON.stringify(dorsRes.rows, null, 2));

  console.log('\\n=== ALL DOKUMEN TSK FOR SARJONO ===');
  const dokRes = await client.query(\`
    SELECT 
      d.id as doc_id,
      d.lp_id,
      lp.no_laporan,
      lp.tgl_laporan,
      lp.satker_nama,
      lp.unit_satker_nama,
      party.item->>'nama' as nama,
      party.item->>'nik' as nik
    FROM bdb_dokumen d
    JOIN bdb_document_type_master dt ON dt.id = d.document_type_id AND dt.code = 'PENETAPAN_TSK'
    LEFT JOIN bdb_laporan_polisi lp ON lp.id = d.lp_id
    CROSS JOIN LATERAL jsonb_array_elements(
      CASE WHEN jsonb_typeof(d.data->'tersangka') = 'array' THEN d.data->'tersangka' ELSE '[]'::jsonb END
    ) party(item)
    WHERE party.item->>'nik' = '3404111801740001'
  \`);
  console.log('Dok count:', dokRes.rows.length);
  console.log(JSON.stringify(dokRes.rows, null, 2));

  console.log('\\n=== ALL MANUAL PIHAK FOR SARJONO ===');
  const manRes = await client.query(\`
    SELECT 
      m.id,
      m.lp_id,
      m.nama,
      m.nik,
      m.keterlibatan,
      lp.no_laporan,
      lp.tgl_laporan,
      lp.satker_nama,
      lp.unit_satker_nama
    FROM bdb_lp_pihak_manual m
    JOIN bdb_laporan_polisi lp ON lp.id = m.lp_id
    WHERE m.nik = '3404111801740001' AND m.deleted_at IS NULL
  \`);
  console.log('Manual count:', manRes.rows.length);
  console.log(JSON.stringify(manRes.rows, null, 2));

  await client.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
`;

const b64 = Buffer.from(script).toString('base64');
const cmd = `echo "${b64}" | base64 -d | docker exec -i bdb-api node`;
console.log(runBE(cmd));
