const fs = require('fs');

const src = process.argv[2];
const dst = process.argv[3];
if (!src || !dst) throw new Error('usage: node patch-dashboard-regressions.cjs SOURCE DEST');
let source = fs.readFileSync(src, 'utf8');

function once(from, to, label) {
  const first = source.indexOf(from);
  if (first < 0) throw new Error(`anchor missing: ${label}`);
  if (source.indexOf(from, first + from.length) >= 0) throw new Error(`anchor not unique: ${label}`);
  source = source.slice(0, first) + to + source.slice(first + from.length);
}

// Pulihkan default bulan lalu sebagai rentang custom supaya pilihan custom berikutnya
// dipakai persis dan tidak dicampur dengan preset bulan lalu.
once(
  '[Y,X]=(0,a.useState)("tahun"),[q,G]=(0,a.useState)(""),[Z,Q]=(0,a.useState)("")',
  '[Y,X]=(0,a.useState)("custom"),[q,G]=(0,a.useState)(()=>{let e=new Date;return N(new Date(e.getFullYear(),e.getMonth()-1,1))}),[Z,Q]=(0,a.useState)(()=>{let e=new Date;return N(new Date(e.getFullYear(),e.getMonth(),0))})',
  'dashboard previous-month state'
);

// Superadmin/admin Binops harus meminta ringkasan nasional. Tanpa parameter ini
// endpoint summary jatuh ke scope kosong dan seluruh panel Kinerja menjadi nol.
const common = 'from:e,to:t,functionDomain:"INTERNAL_RESERSE",organizationDomain:"INTERNAL_POLRI"';
const scopedCommon = 'from:e,to:t,visibility:(()=>{let e=(0,h.deriveRoles)((0,h.getUser)());return e.isSuperadmin||e.isAdminBinops?"national":"scoped"})(),functionDomain:"INTERNAL_RESERSE",organizationDomain:"INTERNAL_POLRI"';
const commonCount = source.split(common).length - 1;
if (commonCount !== 2) throw new Error(`expected two ranking request anchors, found ${commonCount}`);
source = source.split(common).join(scopedCommon);
once(
  'from:ee,to:et,functionDomain:"INTERNAL_RESERSE",organizationDomain:"INTERNAL_POLRI"}}).catch(()=>null)',
  'from:ee,to:et,visibility:(()=>{let e=(0,h.deriveRoles)((0,h.getUser)());return e.isSuperadmin||e.isAdminBinops?"national":"scoped"})(),functionDomain:"INTERNAL_RESERSE",organizationDomain:"INTERNAL_POLRI"}}).catch(()=>null)',
  'dashboard summary visibility'
);

// Hero dashboard harus memakai sumber dan rumus yang sama dengan Kinerja Perkara.
once(
  '(0,t.jsx)(D,{label:"CT — Crime Total",value:J?"…":z(l?.ct??0),color:"#ef4444",bg:"#fef2f2",icon:"pi-file",note:"Total laporan polisi"}),(0,t.jsx)(D,{label:"CC — Crime Clearance",value:J?"…":z(l?.cc??0),color:"#16a34a",bg:"#f0fdf4",icon:"pi-check-circle",note:"Perkara selesai"}),(0,t.jsx)(D,{label:"CR - Clearance Rate",value:J?"…":`${l?.pct??0}%`,color:"#2563eb",bg:"#eff6ff",icon:"pi-percentage",note:"Tingkat penyelesaian"})',
  '(0,t.jsx)(D,{label:"CT — Crime Total",value:J?"…":z(i?.ct??0),color:"#ef4444",bg:"#fef2f2",icon:"pi-file",note:"Sesuai Kinerja Perkara"}),(0,t.jsx)(D,{label:"CC — Crime Clearance",value:J?"…":z((i?.cc_aktual??0)+(i?.cc_tunggakan??0)),color:"#16a34a",bg:"#f0fdf4",icon:"pi-check-circle",note:"CC Aktual + CC Tunggakan"}),(0,t.jsx)(D,{label:"CR - Clearance Rate",value:J?"…":`${(i?.cr??0).toFixed(2)}%`,color:"#2563eb",bg:"#eff6ff",icon:"pi-percentage",note:"Rumus baru Kinerja Perkara"})',
  'dashboard hero kinerja metrics'
);

// Pulihkan state, request, dan card Sorotan DPO dari implementasi existing.
once(
  '[B,H]=(0,a.useState)([]),[$,U]=(0,a.useState)([])',
  '[B,H]=(0,a.useState)([]),[dpoRows,setDpoRows]=(0,a.useState)([]),[$,U]=(0,a.useState)([])',
  'dashboard DPO state'
);
once(
  'let[t,a,r,n,l,i]=await Promise.all([',
  'let[t,a,r,n,l,dpoResponse,i]=await Promise.all([',
  'dashboard DPO tuple'
);
once(
  'p.apiAuth.get("/bdb/operasi-satgas",{params:{row:5,page:1,status:"AKTIF"}}).catch(()=>null),el(ee,et)',
  'p.apiAuth.get("/bdb/operasi-satgas",{params:{row:5,page:1,status:"AKTIF"}}).catch(()=>null),p.apiAuth.get("/bdb/pihak-terlibat",{params:{page:1,row:5,keterlibatan:"DPO"}}).catch(()=>null),el(ee,et)',
  'dashboard DPO fetch'
);
once(
  'l&&H(l.data?.data??[]),U(i)',
  'l&&H(l.data?.data??[]),dpoResponse&&setDpoRows(dpoResponse.data?.data??[]),U(i)',
  'dashboard DPO setter'
);
once(
  '(0,t.jsx)(M,{title:"Operasi & Satgas",icon:(0,t.jsx)(w.Flag,{size:15,style:{color:"#2563eb"}}),emptyText:"Belum ada operasi/satgas.",onLihatSemua:()=>e.push("/cms/master/operasi-satgas"),items:B.map(e=>({id:e.id,judul:e.nama,tag:"SATGAS"===e.jenis?"Satgas":"Operasi",tagSeverity:"SATGAS"===e.jenis?"info":void 0,status:"SELESAI"===e.status_tampil?"Selesai":"NONAKTIF"===e.status_tampil?"Nonaktif":"Aktif",statusSeverity:"SELESAI"===e.status_tampil?"secondary":"NONAKTIF"===e.status_tampil?"warning":"success",tanggal:I(e.tanggal_mulai),lpInfo:`${e.jumlah_lp||0} LP`})),onOpenItem:t=>e.push(`/cms/master/operasi-satgas?open=${t}`)})',
  '(0,t.jsx)(M,{title:"Operasi & Satgas",icon:(0,t.jsx)(w.Flag,{size:15,style:{color:"#2563eb"}}),emptyText:"Belum ada operasi/satgas.",onLihatSemua:()=>e.push("/cms/master/operasi-satgas"),items:B.map(e=>({id:e.id,judul:e.nama,tag:"SATGAS"===e.jenis?"Satgas":"Operasi",tagSeverity:"SATGAS"===e.jenis?"info":void 0,status:"SELESAI"===e.status_tampil?"Selesai":"NONAKTIF"===e.status_tampil?"Nonaktif":"Aktif",statusSeverity:"SELESAI"===e.status_tampil?"secondary":"NONAKTIF"===e.status_tampil?"warning":"success",tanggal:I(e.tanggal_mulai),lpInfo:`${e.jumlah_lp||0} LP`})),onOpenItem:t=>e.push(`/cms/master/operasi-satgas?open=${t}`)}),(0,t.jsx)(M,{title:"DPO",icon:(0,t.jsx)("i",{className:"pi pi-user-minus",style:{color:"#dc2626"}}),emptyText:"Belum ada DPO.",onLihatSemua:()=>e.push("/cms/laporan/rekap-pihak-terlibat"),items:dpoRows.slice(0,5).map(e=>({id:e.nama||e.nik||String(e.row_id||e.id||""),judul:e.nama||"Tanpa Nama",tag:"DPO",tagSeverity:"danger",status:"DORS"===e.sumber?"DORS":"DOKUMEN"===e.sumber?"Dokumen":"Manual",statusSeverity:"DORS"===e.sumber?"info":"DOKUMEN"===e.sumber?"warning":"success",tanggal:I(e.tanggal_laporan||e.tanggal_dokumen||e.created_at),lpInfo:e.no_laporan||e.kejahatan||"Belum terhubung LP"})),onOpenItem:t=>e.push(`/cms/laporan/rekap-pihak-terlibat?search=${encodeURIComponent(String(t))}`)})',
  'dashboard DPO card'
);

const checks = {
  defaultCustom: source.includes('[Y,X]=(0,a.useState)("custom")'),
  previousMonth: source.includes('e.getMonth()-1,1') && source.includes('e.getMonth(),0'),
  exactCustomSemantics: source.includes('if("custom"===e)return{from:t||n,to:a||n}'),
  scopedCalls: (source.match(/isSuperadmin\|\|e\.isAdminBinops\?"national":"scoped"/g) || []).length === 3,
  heroUsesKinerja: source.includes('note:"Sesuai Kinerja Perkara"') && source.includes('z((i?.cc_aktual??0)+(i?.cc_tunggakan??0))'),
  dpoState: source.includes('[dpoRows,setDpoRows]=(0,a.useState)([])'),
  dpoFetch: source.includes('keterlibatan:"DPO"'),
  dpoCard: source.includes('title:"DPO"'),
  monitoringUiAbsent: !source.includes('target_satker_id')
};
for (const [name, ok] of Object.entries(checks)) if (!ok) throw new Error(`verification failed: ${name}`);

fs.writeFileSync(dst, source);
console.log(JSON.stringify({ ok: true, output: dst, bytes: Buffer.byteLength(source), checks }, null, 2));
