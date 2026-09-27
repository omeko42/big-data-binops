import fs from 'fs';

const filePath = 'pihak-sering-terlibat-fix-20260927/be/src/bdb/pihak-terlibat/pihak-terlibat.service.ts';
let code = fs.readFileSync(filePath, 'utf8');

// For non-corp branch
// 1. DORS
code = code.replace(
  `                FROM bdb_dors_lp_terlibat t
                JOIN bdb_dors_lp d ON d.id = t.lp_id
                LEFT JOIN bdb_laporan_polisi lp ON lp.dors_lp_id = d.dors_lp_id AND lp.model_lp = d.model_lp
                LEFT JOIN cm_jenis_kejahatan jk ON jk.id = lp.jenis_kejahatan_id
                WHERE t.nik = $1`,
  `                FROM bdb_dors_lp_terlibat t
                JOIN bdb_dors_lp d ON d.id = t.lp_id
                LEFT JOIN bdb_laporan_polisi lp ON lp.dors_lp_id = d.dors_lp_id AND lp.model_lp = d.model_lp
                LEFT JOIN cm_jenis_kejahatan jk ON jk.id = lp.jenis_kejahatan_id
                LEFT JOIN bdb_satker s ON s.id = coalesce(lp.unit_satker_id, lp.satker_id)
                LEFT JOIN bdb_satker p ON p.kode = (split_part(s.kode, '.', 1) || '.' || split_part(s.kode, '.', 2) || '.' || split_part(s.kode, '.', 3))
                WHERE t.nik = $1`
);

// 2. DOKUMEN
code = code.replace(
  `                FROM document_parties x
                JOIN bdb_laporan_polisi lp ON lp.id = x.lp_id AND lp.deleted_at is null
                LEFT JOIN cm_jenis_kejahatan jk ON jk.id = lp.jenis_kejahatan_id
                WHERE x.nik = $1`,
  `                FROM document_parties x
                JOIN bdb_laporan_polisi lp ON lp.id = x.lp_id AND lp.deleted_at is null
                LEFT JOIN bdb_dors_lp d ON d.dors_lp_id = lp.dors_lp_id AND d.model_lp = lp.model_lp
                LEFT JOIN cm_jenis_kejahatan jk ON jk.id = lp.jenis_kejahatan_id
                LEFT JOIN bdb_satker s ON s.id = coalesce(lp.unit_satker_id, lp.satker_id)
                LEFT JOIN bdb_satker p ON p.kode = (split_part(s.kode, '.', 1) || '.' || split_part(s.kode, '.', 2) || '.' || split_part(s.kode, '.', 3))
                WHERE x.nik = $1`
);

// 3. MANUAL
code = code.replace(
  `                FROM bdb_lp_pihak_manual m
                JOIN bdb_laporan_polisi lp ON lp.id = m.lp_id AND lp.deleted_at is null
                LEFT JOIN cm_jenis_kejahatan jk ON jk.id = lp.jenis_kejahatan_id
                WHERE m.deleted_at is null AND m.nik = $1`,
  `                FROM bdb_lp_pihak_manual m
                JOIN bdb_laporan_polisi lp ON lp.id = m.lp_id AND lp.deleted_at is null
                LEFT JOIN bdb_dors_lp d ON d.dors_lp_id = lp.dors_lp_id AND d.model_lp = lp.model_lp
                LEFT JOIN cm_jenis_kejahatan jk ON jk.id = lp.jenis_kejahatan_id
                LEFT JOIN bdb_satker s ON s.id = coalesce(lp.unit_satker_id, lp.satker_id)
                LEFT JOIN bdb_satker p ON p.kode = (split_part(s.kode, '.', 1) || '.' || split_part(s.kode, '.', 2) || '.' || split_part(s.kode, '.', 3))
                WHERE m.deleted_at is null AND m.nik = $1`
);

// Also add fields to the SELECTs
code = code.replace(
  `                    coalesce(jk.keterangan, '—') as kejahatan,
                    coalesce(nullif(trim(lp.unit_satker_nama),''), lp.satker_nama, 'POLRI') as satker_nama,
                    upper(trim(coalesce(t.keterlibatan, 'PIHAK'))) as peran,
                    'DORS' as sumber`,
  `                    coalesce(nullif(trim(d.waktu_kejadian_faktual),''), nullif(trim(d.waktu_kejadian),''), '—') as waktu_kejadian,
                    coalesce(d.tempat_kejadian, '—') as tempat_kejadian,
                    coalesce(jk.keterangan, '—') as kejahatan,
                    coalesce(lp.unit_satker_id, lp.satker_id) as satker_id,
                    coalesce(nullif(trim(lp.unit_satker_nama),''), lp.satker_nama, 'POLRI') as satker_nama,
                    coalesce(p.deskripsi, 'POLRI') as wilayah_nama,
                    upper(trim(coalesce(t.keterlibatan, 'PIHAK'))) as peran,
                    'DORS' as sumber`
);

code = code.replace(
  `                    coalesce(jk.keterangan, '—') as kejahatan,
                    coalesce(nullif(trim(lp.unit_satker_nama),''), lp.satker_nama, 'POLRI') as satker_nama,
                    upper(trim(coalesce(x.keterlibatan, 'PIHAK'))) as peran,
                    'DOKUMEN' as sumber`,
  `                    coalesce(nullif(trim(d.waktu_kejadian_faktual),''), nullif(trim(d.waktu_kejadian),''), '—') as waktu_kejadian,
                    coalesce(d.tempat_kejadian, '—') as tempat_kejadian,
                    coalesce(jk.keterangan, '—') as kejahatan,
                    coalesce(lp.unit_satker_id, lp.satker_id) as satker_id,
                    coalesce(nullif(trim(lp.unit_satker_nama),''), lp.satker_nama, 'POLRI') as satker_nama,
                    coalesce(p.deskripsi, 'POLRI') as wilayah_nama,
                    upper(trim(coalesce(x.keterlibatan, 'PIHAK'))) as peran,
                    'DOKUMEN' as sumber`
);

code = code.replace(
  `                    coalesce(jk.keterangan, '—') as kejahatan,
                    coalesce(nullif(trim(lp.unit_satker_nama),''), lp.satker_nama, 'POLRI') as satker_nama,
                    upper(trim(coalesce(m.keterlibatan, 'PIHAK'))) as peran,
                    'MANUAL' as sumber`,
  `                    coalesce(nullif(trim(d.waktu_kejadian_faktual),''), nullif(trim(d.waktu_kejadian),''), '—') as waktu_kejadian,
                    coalesce(d.tempat_kejadian, '—') as tempat_kejadian,
                    coalesce(jk.keterangan, '—') as kejahatan,
                    coalesce(lp.unit_satker_id, lp.satker_id) as satker_id,
                    coalesce(nullif(trim(lp.unit_satker_nama),''), lp.satker_nama, 'POLRI') as satker_nama,
                    coalesce(p.deskripsi, 'POLRI') as wilayah_nama,
                    upper(trim(coalesce(m.keterlibatan, 'PIHAK'))) as peran,
                    'MANUAL' as sumber`
);

// In deduped.push
code = code.replace(
  `                deduped.push({
                    ...r,
                    in_period: inPeriod,
                    tahun: tDateStr ? tDateStr.substring(0, 4) : '—'
                });`,
  `                deduped.push({
                    ...r,
                    waktu_kejadian: r.waktu_kejadian || '—',
                    tempat_kejadian: r.tempat_kejadian || '—',
                    satker_nama: r.satker_nama || 'POLRI',
                    wilayah_nama: r.wilayah_nama || 'POLRI',
                    in_period: inPeriod,
                    tahun: tDateStr ? tDateStr.substring(0, 4) : '—'
                });`
);

fs.writeFileSync(filePath, code, 'utf8');
console.log('Successfully patched getLaporanByNik in pihak-terlibat.service.ts!');
