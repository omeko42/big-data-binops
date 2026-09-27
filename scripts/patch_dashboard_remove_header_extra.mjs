import fs from 'fs';

const filePath = 'd:/Prototype CAS/EDIT MASTER MASAL/pihak-sering-terlibat-fix-20260927/fe/dashboard-perma-318125d33290.js';
let content = fs.readFileSync(filePath, 'utf8');

const targetStr = `headerExtra:(0,t.jsx)(d.Dropdown,{id:"dash-filter-pihak-jenis",inputId:"dash-filter-pihak-jenis-select",name:"pihak_jenis",value:pihakJenis,options:[{label:"Semua",value:"ALL"},{label:"DPO",value:"DPO"},{label:"Tersangka",value:"TERSANGKA"},{label:"Terlapor",value:"TERLAPOR"},{label:"Pelapor",value:"PELAPOR"},{label:"Saksi",value:"SAKSI"},{label:"Korban",value:"KORBAN"}],onChange:e=>{setPihakJenis(e.value);setDpoRows([]);loadPihakRanking(!0,e.value)},style:{height:"1.65rem",width:"5.4rem",fontSize:"0.72rem",borderRadius:"6px",background:"rgba(30, 41, 59, 0.55)",borderColor:"rgba(255, 255, 255, 0.12)",display:"inline-flex",alignItems:"center",flexShrink:0},pt:{root:{style:{height:"1.65rem",width:"5.4rem",padding:0}},input:{style:{padding:"0 0.35rem",fontSize:"0.72rem",color:"#e2e8f0"}},trigger:{style:{width:"1.3rem"}}}}),`;

if (!content.includes(targetStr)) {
    console.error('Target string not found in local file!');
    process.exit(1);
}

content = content.replace(targetStr, '');

// Also ensure title click navigates to /cms/laporan/pihak-sering-terlibat
const oldTitleClick = `onClick:ev=>{ev.stopPropagation();e.push("/cms/laporan/rekap-pihak-terlibat")},style:{cursor:"pointer",color:"inherit",transition:"color .15s,text-decoration .15s"},onMouseEnter:ev=>{ev.currentTarget.style.color="#dc2626";ev.currentTarget.style.textDecoration="underline"},onMouseLeave:ev=>{ev.currentTarget.style.color="inherit";ev.currentTarget.style.textDecoration="none"},title:"Buka Rekap Pihak Terlibat",children:"Pihak Paling Sering Terlibat"`;
const newTitleClick = `onClick:ev=>{ev.stopPropagation();e.push("/cms/laporan/pihak-sering-terlibat")},style:{cursor:"pointer",color:"inherit",transition:"color .15s,text-decoration .15s"},onMouseEnter:ev=>{ev.currentTarget.style.color="#dc2626";ev.currentTarget.style.textDecoration="underline"},onMouseLeave:ev=>{ev.currentTarget.style.color="inherit";ev.currentTarget.style.textDecoration="none"},title:"Buka Pihak Paling Sering Terlibat",children:"Pihak Paling Sering Terlibat"`;

if (content.includes(oldTitleClick)) {
    content = content.replace(oldTitleClick, newTitleClick);
    console.log('Title click updated to /cms/laporan/pihak-sering-terlibat');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully patched local dashboard-perma-318125d33290.js');
