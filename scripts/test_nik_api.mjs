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
  const res = await client.query(\`
    SELECT 
      lp.id as lp_id,
      coalesce(lp.no_laporan, d.no_laporan, 'LP Tanpa Nomor') as no_laporan,
      coalesce(nullif(trim(d.waktu_kejadian_faktual), ''), nullif(trim(d.waktu_kejadian), ''), '—') as waktu_kejadian,
      coalesce(nullif(trim(d.tempat_kejadian), ''), nullif(trim(lp.tempat_kejadian), ''), '—') as tempat_kejadian,
      coalesce(nullif(trim(d.apa_terjadi), ''), jk.keterangan, '—') as kejahatan,
      coalesce(nullif(trim(lp.status), ''), 'PROSES') as status_lp,
      coalesce(nullif(trim(d.uraian_kejadian), ''), nullif(trim(d.uraian_singkat_kejadian), ''), nullif(trim(lp.uraian_singkat), ''), '—') as uraian_kejadian,
      coalesce(lp.unit_satker_id, lp.satker_id) as satker_id,
      coalesce(nullif(trim(lp.unit_satker_nama), ''), lp.satker_nama, 'POLRI') as satker_nama,
      coalesce(p.deskripsi, 'POLRI') as wilayah_nama
    FROM bdb_dors_lp_terlibat t
    JOIN bdb_dors_lp d ON d.id = t.lp_id
    LEFT JOIN bdb_laporan_polisi lp ON lp.dors_lp_id = d.dors_lp_id AND lp.model_lp = d.model_lp
    LEFT JOIN cm_jenis_kejahatan jk ON jk.id = lp.jenis_kejahatan_id
    LEFT JOIN bdb_satker s ON s.id = coalesce(lp.unit_satker_id, lp.satker_id)
    LEFT JOIN bdb_satker p ON p.kode = (split_part(s.kode, '.', 1) || '.' || split_part(s.kode, '.', 2) || '.' || split_part(s.kode, '.', 3))
    WHERE t.nik = '3404111801740001'
    LIMIT 3;
  \`);
  console.log(JSON.stringify(res.rows, null, 2));
  await client.end();
}
main().catch(console.error);
`;

const b64 = Buffer.from(script).toString('base64');
console.log(runBE(`echo "${b64}" | base64 -d | docker exec -i bdb-api node`));
