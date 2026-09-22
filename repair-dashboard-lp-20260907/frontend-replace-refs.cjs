const fs = require('fs');

const replacements = [
  {
    oldName: 'dashboard-ct-total-79de4cddc9e6.js',
    newName: 'dashboard-repair-d76b08a0fc43.js',
    files: [
      '/usr/src/app/.next/server/app/cms/dashboard/main.html',
      '/usr/src/app/.next/server/app/cms/dashboard/main.rsc',
      '/usr/src/app/.next/server/app/cms/dashboard/main.segments/cms/dashboard/main/__PAGE__.segment.rsc',
      '/usr/src/app/.next/server/app/cms/dashboard/main.segments/_full.segment.rsc',
      '/usr/src/app/.next/server/app/cms/dashboard/main/page_client-reference-manifest.js',
    ],
  },
  {
    oldName: 'kinerja-v6-20260830.js',
    newName: 'kinerja-prevmonth-a5c742c0b4ae.js',
    files: [
      '/usr/src/app/.next/server/app/cms/report/kinerja-perkara.html',
      '/usr/src/app/.next/server/app/cms/report/kinerja-perkara.rsc',
      '/usr/src/app/.next/server/app/cms/report/kinerja-perkara.segments/cms/report/kinerja-perkara/__PAGE__.segment.rsc',
      '/usr/src/app/.next/server/app/cms/report/kinerja-perkara.segments/_full.segment.rsc',
      '/usr/src/app/.next/server/app/cms/report/kinerja-perkara/page_client-reference-manifest.js',
    ],
  },
  {
    oldName: 'laporan-list-numbering-ba7ce8518953.js',
    newName: 'laporan-filter-linked-50f10501998b.js',
    files: [
      '/usr/src/app/.next/server/app/cms/laporan-polisi.html',
      '/usr/src/app/.next/server/app/cms/laporan-polisi.rsc',
      '/usr/src/app/.next/server/app/cms/laporan-polisi.segments/cms/laporan-polisi/__PAGE__.segment.rsc',
      '/usr/src/app/.next/server/app/cms/laporan-polisi.segments/_full.segment.rsc',
      '/usr/src/app/.next/server/app/cms/laporan-polisi/page_client-reference-manifest.js',
    ],
  },
];

for (const group of replacements) {
  for (const file of group.files) {
    const before = fs.readFileSync(file, 'utf8');
    if (!before.includes(group.oldName)) {
      throw new Error(`Referensi lama tidak ditemukan di ${file}`);
    }
    if (before.includes(group.newName)) {
      throw new Error(`Referensi baru sudah ada di ${file}`);
    }
    const after = before.split(group.oldName).join(group.newName);
    fs.writeFileSync(file, after);
    const verified = fs.readFileSync(file, 'utf8');
    if (verified.includes(group.oldName) || !verified.includes(group.newName)) {
      throw new Error(`Verifikasi penggantian gagal di ${file}`);
    }
  }
}

console.log('FRONTEND_REFERENCES_REPLACED');
