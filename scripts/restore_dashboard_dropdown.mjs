import fs from 'fs';

const filePath = 'pihak-sering-terlibat-fix-20260927/fe/dashboard-perma-318125d33290.js';
let content = fs.readFileSync(filePath, 'utf8');

const targetStr = `children:(0,t.jsx)("i",{className:"pi pi-users",style:{fontSize:"0.82rem"}})}),emptyText:(J||pihakLoading)?"Memuat…":"Belum ada pihak terlibat.",`;

const replacement = `children:(0,t.jsx)("i",{className:"pi pi-users",style:{fontSize:"0.82rem"}})}),headerExtra:(0,t.jsx)(d.Dropdown,{id:"dash-filter-pihak-jenis",inputId:"dash-filter-pihak-jenis-select",name:"pihak_jenis",value:pihakJenis,options:[{label:"Semua",value:"ALL"},{label:"DPO",value:"DPO"},{label:"Tersangka",value:"TERSANGKA"},{label:"Terlapor",value:"TERLAPOR"},{label:"Pelapor",value:"PELAPOR"},{label:"Saksi",value:"SAKSI"},{label:"Korban",value:"KORBAN"}],onChange:e=>{setPihakJenis(e.value);setDpoRows([]);loadPihakRanking(!0,e.value)},style:{height:"1.75rem",minWidth:"5.6rem",fontSize:"0.74rem",borderRadius:"6px",display:"inline-flex",alignItems:"center",flexShrink:0},pt:{root:{style:{height:"1.75rem",padding:0}},input:{style:{padding:"0 0.4rem",fontSize:"0.74rem",border:"0 none",background:"transparent"}},trigger:{style:{width:"1.3rem"}}}}),emptyText:(J||pihakLoading)?"Memuat…":"Belum ada pihak terlibat.",`;

if (!content.includes(targetStr)) {
    console.error('Target string not found in dashboard-perma-318125d33290.js!');
    process.exit(1);
}

content = content.replace(targetStr, replacement);
fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully restored headerExtra in dashboard-perma-318125d33290.js');
