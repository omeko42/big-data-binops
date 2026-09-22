'use strict';
const fs=require('fs');
const source=process.argv[2],target=process.argv[3];let text=fs.readFileSync(source,'utf8');
const replacements=[
 ['CR Lama = CC / CT × 100%','CR Lama = (CC Aktual + CC Tunggakan) / CT × 100%'],
 ['CR boleh melebihi 100% (tidak dipotong utk tampilan, hanya dibatasi maks 100 khusus utk perhitungan Indeks).','CR Lama dapat melebihi 100%. CR Baru maksimal 100% karena CC Aktual merupakan bagian dari CT, sedangkan CC Tunggakan ditambahkan pada pembilang dan penyebut.'],
 ['CR Baru dan CR Lama berasal dari data yang berbeda (lihat rumus masing-masing di atas), jadi tidak diperbandingkan langsung dengan angka yang sama.','Kedua rumus menggunakan total CC yang sama. CR Lama membaginya dengan CT; CR Baru membaginya dengan CT + CC Tunggakan.'],
 [' = selesai sebelum/tepat jatuh tempo; ',' = selesai sebelum/tepat batas usia atau jatuh tempo dan, pada acuan Kedua tanggal, mulai ditangani dalam periode CT; '],
 [' = selesai setelah lewat jatuh tempo.',' = selesai melewati batas usia/jatuh tempo, atau pada acuan Kedua tanggal berasal dari luar periode CT. Total CC tetap sama.'],
 ['Sesuai ketentuan resmi: CT dihitung dari tanggal mulai penanganan, CC dari tanggal selesai — dua tanggal berbeda bisa dipakai bersamaan dalam satu periode.','CT dihitung dari tanggal mulai penanganan, CC dari tanggal selesai. CC dari luar periode CT masuk Tunggakan; CC Aktual hanya berasal dari CT periode terpilih dan masih sesuai batas usia/jatuh tempo.']
];
for(const [before,after]of replacements){if(!text.includes(before))throw new Error('Missing text: '+before);text=text.split(before).join(after);}
fs.writeFileSync(target,text);console.log('CR_UI_TEXT_UPDATED=1');
