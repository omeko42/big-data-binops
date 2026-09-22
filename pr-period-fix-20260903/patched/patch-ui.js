'use strict';
const fs=require('fs');let s=fs.readFileSync(process.argv[2],'utf8');
const replacements=[
 ['PR Lama = CP / CT × 100%','PR Lama = (CP Aktual + CP Tunggakan) / CT × 100%'],
 [' = belum lewat jatuh tempo; ',' = mulai ditangani dalam periode CT dan belum melewati batas usia/jatuh tempo; '],
 [' = sudah lewat jatuh tempo. CP tidak masuk langsung ke rumus CR, murni informasi kesehatan jatuh-tempo.',' = perkara yang masih diproses dari sebelum awal periode, termasuk yang belum melewati batas usia/jatuh tempo, ditambah perkara periode CT yang sudah melewati batas tersebut. Berlaku untuk acuan Kedua tanggal/default; acuan khusus Mulai tetap hanya kohort periode, dan acuan Selesai memiliki CP = 0. Perkara Belum Update tetap terpisah dan tidak masuk CP.'],
 [' — pasangan CP thd CR: indikator persentase yang berasal dari CP, sedangkan CR berasal dari CC. PR tidak masuk ke rumus CR maupun dasar Level/Indeks.',' — dihitung dari CP Aktual + CP Tunggakan. PR Lama dapat melebihi 100%; PR Baru maksimal 100% karena CP Aktual bagian dari CT dan CP Tunggakan ditambahkan pada pembilang serta penyebut. PR tidak masuk ke rumus CR maupun dasar Level/Indeks.'],
 ['CT dihitung dari tanggal mulai penanganan, CC dari tanggal selesai. CC dari luar periode CT masuk Tunggakan; CC Aktual hanya berasal dari CT periode terpilih dan masih sesuai batas usia/jatuh tempo.','CT dihitung dari tanggal mulai penanganan, CC dari tanggal selesai. CP yang masih diproses dari sebelum periode serta CC dari luar periode CT masuk Tunggakan. Aktual hanya berasal dari CT periode terpilih dan masih sesuai batas usia/jatuh tempo.']
];
for(const[a,b]of replacements){if(!s.includes(a))throw new Error('Missing UI text: '+a);s=s.split(a).join(b);}
fs.writeFileSync(process.argv[3],s);console.log('PR_UI_UPDATED=1');

