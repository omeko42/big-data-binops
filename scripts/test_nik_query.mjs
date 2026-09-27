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
  
  const sql = \`
    SELECT 
        lp.id as lp_id,
        coalesce(lp.no_laporan, d.no_laporan, 'LP Tanpa Nomor') as no_laporan,
        case 
            when coalesce(lp.tgl_laporan, d.tgl_laporan) ~ '^[0-9]{2}-[0-9]{2}-[0-9]{4}' then substring(coalesce(lp.tgl_laporan, d.tgl_laporan) from 1 for 10)
            else to_char(coalesce(d.synced_at, lp.synced_at, now()), 'DD-MM-YYYY')
        end as tgl_laporan,
        case 
            when coalesce(lp.tgl_laporan, d.tgl_laporan) ~ '^[0-9]{2}-[0-9]{2}-[0-9]{4}' then to_date(substring(coalesce(lp.tgl_laporan, d.tgl_laporan) from 1 for 10), 'DD-MM-YYYY')
            else coalesce(d.synced_at, lp.synced_at, now())::date
        end as tgl_date,
        coalesce(nullif(trim(d.waktu_kejadian_faktual),''), nullif(trim(d.waktu_kejadian),''), '—') as waktu_kejadian,
        d.tempat_kejadian,
        coalesce(jk.keterangan, '—') as kejahatan,
        coalesce(lp.unit_satker_id, lp.satker_id) as satker_id,
        coalesce(nullif(trim(lp.unit_satker_nama),''), lp.satker_nama, 'POLRI') as satker_nama,
        coalesce(p.deskripsi, 'POLRI') as wilayah_nama,
        upper(trim(coalesce(t.keterlibatan, 'PIHAK'))) as peran,
        'DORS' as sumber
    FROM bdb_dors_lp_terlibat t
    JOIN bdb_dors_lp d ON d.id = t.lp_id
    LEFT JOIN bdb_laporan_polisi lp ON lp.dors_lp_id = d.dors_lp_id AND lp.model_lp = d.model_lp
    LEFT JOIN cm_jenis_kejahatan jk ON jk.id = lp.jenis_kejahatan_id
    LEFT JOIN bdb_satker s ON s.id = coalesce(lp.unit_satker_id, lp.satker_id)
    LEFT JOIN bdb_satker p ON p.kode = (split_part(s.kode, '.', 1) || '.' || split_part(s.kode, '.', 2) || '.' || split_part(s.kode, '.', 3))
    WHERE t.nik = '3404111801740001'
  \`;

  const res = await client.query(sql);
  console.log('Returned rows:', res.rows.length);
  res.rows.forEach(r => {
    console.log({
      no_lp: r.no_laporan,
      tgl_lp: r.tgl_laporan,
      tempus: r.waktu_kejadian,
      satker: r.satker_nama,
      wilayah: r.wilayah_nama,
      peran: r.peran
    });
  });

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
