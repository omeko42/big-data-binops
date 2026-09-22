const fs=require('fs');
const src=process.argv[2],dst=process.argv[3];
let s=fs.readFileSync(src,'utf8');
function once(from,to,label){const i=s.indexOf(from);if(i<0)throw new Error('anchor missing: '+label);if(s.indexOf(from,i+1)>=0)throw new Error('anchor not unique: '+label);s=s.slice(0,i)+to+s.slice(i+from.length);}

once(
  '[eG,e$]=(0,n.useState)({isSuperadmin:!1,isAdminBinops:!1});',
  '[eMonMeta,eSetMonMeta]=(0,n.useState)(null),[eTargetSatker,eSetTargetSatker]=(0,n.useState)(""),[eCrimeIds,eSetCrimeIds]=(0,n.useState)([]),[eGolIds,eSetGolIds]=(0,n.useState)([]),[eMonTags,eSetMonTags]=(0,n.useState)([]),[eCrimeSearch,eSetCrimeSearch]=(0,n.useState)(""),[eG,e$]=(0,n.useState)({isSuperadmin:!1,isAdminBinops:!1});',
  'monitoring states'
);

once(
  '(0,n.useEffect)(()=>{let e=(0,E.deriveRoles)((0,E.getUser)());e$({isSuperadmin:e.isSuperadmin,isAdminBinops:e.isAdminBinops})},[]);let eV=',
  '(0,n.useEffect)(()=>{let e=(0,E.deriveRoles)((0,E.getUser)());e$({isSuperadmin:e.isSuperadmin,isAdminBinops:e.isAdminBinops})},[]);(0,n.useEffect)(()=>{let e=!0;return(async()=>{try{let t=await L.apiAuth.get("/bdb/laporan-polisi/monitoring-options");e&&eSetMonMeta(t.data?.data||null)}catch{e&&eSetMonMeta(null)}})(),()=>{e=!1}},[]);let eV=',
  'load monitoring metadata'
);

once(
  '...eAP.functionDomain?{functionDomain:eAP.functionDomain,organizationDomain:"INTERNAL_POLRI"}:{}}});er',
  '...eAP.functionDomain?{functionDomain:eAP.functionDomain,organizationDomain:"INTERNAL_POLRI"}:{},...eAP.targetSatkerId?{target_satker_id:eAP.targetSatkerId}:{}}});er',
  'stats target param'
);

once(
  '...eAP.functionDomain?{functionDomain:eAP.functionDomain,organizationDomain:"INTERNAL_POLRI"}:{},page:e,row:ej',
  '...eAP.functionDomain?{functionDomain:eAP.functionDomain,organizationDomain:"INTERNAL_POLRI"}:{},...eAP.targetSatkerId?{target_satker_id:eAP.targetSatkerId}:{},...eAP.crimeIds?.length?{jenis_kejahatan_ids:eAP.crimeIds.join(",")}:{},...eAP.golonganIds?.length?{golongan_kejahatan_ids:eAP.golonganIds.join(",")}:{},...eAP.monitoringTags?.length?{monitoring_tags:eAP.monitoringTags.join(",")}:{},page:e,row:ej',
  'list filter params'
);

once(
  '(0,n.useEffect)(()=>{eQ()},[eQ]);let e1=',
  '(0,n.useEffect)(()=>{eQ()},[eQ]);let eCrimeOptions=eMonMeta?.crimes||[],eAllowedCrimeIds=eCrimeOptions.filter(e=>e.allowed).map(e=>Number(e.id)),eTargetOptions=[{label:eMonMeta?.own_satker?.nama?`Satker Saya — ${eMonMeta.own_satker.nama}`:"Satker Saya",value:""},...(eMonMeta?.targets||[]).map(e=>({label:`${e.nama} (${e.tipe})`,value:String(e.id)}))],eVisibleCrimes=eCrimeOptions.filter(e=>!eCrimeSearch||String(e.nama||"").toLowerCase().includes(eCrimeSearch.toLowerCase())),eAllowedGolongan=new Set(eCrimeOptions.filter(e=>e.allowed).map(e=>Number(e.golongan_id)).filter(Boolean)),eFilterCount=eCrimeIds.length+eGolIds.length+eMonTags.length;function eChangeTarget(e){let t=e?eAllowedCrimeIds:[];eSetTargetSatker(e),eSetCrimeIds(t),eSetGolIds([]),eSetMonTags([]),ex(0),X([]),Q(0),eSetAP(n=>({...n,targetSatkerId:e,crimeIds:t,golonganIds:[],monitoringTags:[]}))}function eApplyMonitoringFilters(){ex(0),X([]),Q(0),eSetAP(e=>({...e,targetSatkerId:eTargetSatker,crimeIds:eCrimeIds,golonganIds:eGolIds,monitoringTags:eMonTags,level:eo,status:eu,model:ed,from:em,to:eg,search:eh.trim(),functionDomain:eFD}))}function eResetMonitoringFilters(){let e=eTargetSatker?eAllowedCrimeIds:[];eSetCrimeIds(e),eSetGolIds([]),eSetMonTags([]),ex(0),X([]),Q(0),eSetAP(t=>({...t,crimeIds:e,golonganIds:[],monitoringTags:[]}))}let e1=',
  'derived monitoring controls'
);

const oldApply='eSetAP({level:eo,status:"",model:ed,from:em,to:eg,search:eh.trim(),functionDomain:eFD})';
while(s.includes(oldApply))s=s.replace(oldApply,'eSetAP(e=>({...e,level:eo,status:"",model:ed,from:em,to:eg,search:eh.trim(),functionDomain:eFD}))');
const oldStatus='eSetAP({level:eo,status:t,model:ed,from:em,to:eg,search:eh.trim(),functionDomain:eFD})';
while(s.includes(oldStatus))s=s.replace(oldStatus,'eSetAP(e=>({...e,level:eo,status:t,model:ed,from:em,to:eg,search:eh.trim(),functionDomain:eFD}))');
const oldSearch='eSetAP({level:eo,status:eu,model:ed,from:em,to:eg,search:eh.trim(),functionDomain:eFD})';
while(s.includes(oldSearch))s=s.replace(oldSearch,'eSetAP(e=>({...e,level:eo,status:eu,model:ed,from:em,to:eg,search:eh.trim(),functionDomain:eFD}))');

once(
  ']}),eG.isSuperadmin&&(0,t.jsxs)(o.Button,',
  ']}),!eMonMeta?.all&&eTargetOptions.length>1&&(0,t.jsxs)("div",{style:{display:"grid",gap:"0.25rem",minWidth:"23rem",maxWidth:"100%"},children:[(0,t.jsx)("label",{style:{fontSize:"0.72rem",fontWeight:800,color:"#64748b",textTransform:"uppercase"},children:"Domain satker yang dibuka"}),(0,t.jsx)(i.Dropdown,{value:eTargetSatker,options:eTargetOptions,onChange:e=>eChangeTarget(e.value),filter:!0,filterBy:"label",showClear:!0,placeholder:"Satker Saya",style:{width:"100%"}})]}),eG.isSuperadmin&&(0,t.jsxs)(o.Button,',
  'top target selector'
);

once(
  '(0,t.jsx)(o.Button,{icon:"pi pi-refresh",outlined:!0,onClick:()=>{eZ(),eQ()},loading:ee,"aria-label":"Muat ulang"})]}),(0,t.jsxs)(a.DataTable,',
  '(0,t.jsx)(o.Button,{icon:"pi pi-refresh",outlined:!0,onClick:()=>{eZ(),eQ()},loading:ee,"aria-label":"Muat ulang"})]}),eTargetSatker&&(0,t.jsxs)("div",{style:{margin:"0 1rem 0.75rem",padding:"0.6rem 0.8rem",borderRadius:8,background:"#eff6ff",border:"1px solid #bfdbfe",color:"#1e40af",fontSize:"0.82rem"},children:[(0,t.jsx)("strong",{children:"Mode monitoring aktif."})," Data dibatasi ke fungsi ",(eMonMeta?.domains||[]).join(" / ")," pada satker pilihan. Pelimpahan tetap dilakukan operator satker pemilik."]}),(0,t.jsxs)("details",{open:!0,style:{borderTop:"1px solid #e2e8f0",borderBottom:"1px solid #e2e8f0",padding:"0.65rem 1rem"},children:[(0,t.jsxs)("summary",{style:{cursor:"pointer",fontWeight:800,color:"#334155"},children:["Filter lanjutan",eFilterCount?` (${eFilterCount} pilihan)`:""]}),(0,t.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"minmax(18rem,2fr) minmax(12rem,1fr) minmax(12rem,1fr)",gap:"0.9rem",marginTop:"0.75rem"},children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{style:{display:"block",fontSize:"0.76rem",fontWeight:800,color:"#64748b",marginBottom:"0.35rem"},children:"Jenis kejahatan"}),(0,t.jsx)(l.InputText,{value:eCrimeSearch,onChange:e=>eSetCrimeSearch(e.target.value),placeholder:"Cari nama kejahatan…",style:{width:"100%",marginBottom:"0.35rem"}}),(0,t.jsx)("div",{style:{maxHeight:"12rem",overflowY:"auto",border:"1px solid #e2e8f0",borderRadius:8,padding:"0.35rem"},children:eVisibleCrimes.map(e=>{let n=Number(e.id),a=!!eTargetSatker&&!e.allowed;return(0,t.jsxs)("label",{title:a?"Di luar domain fungsi akun Anda":e.nama,style:{display:"flex",alignItems:"flex-start",gap:"0.4rem",padding:"0.25rem",opacity:a?.48:1,cursor:a?"not-allowed":"pointer",fontSize:"0.78rem"},children:[(0,t.jsx)("input",{type:"checkbox",checked:eCrimeIds.includes(n),disabled:a,onChange:e=>eSetCrimeIds(t=>e.target.checked?[...t,n]:t.filter(e=>e!==n))}),(0,t.jsx)("span",{children:e.nama})]},e.id)})})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{style:{display:"block",fontSize:"0.76rem",fontWeight:800,color:"#64748b",marginBottom:"0.35rem"},children:"Golongan kejahatan"}),(0,t.jsx)("div",{style:{maxHeight:"15rem",overflowY:"auto",border:"1px solid #e2e8f0",borderRadius:8,padding:"0.35rem"},children:(eMonMeta?.golongan||[]).map(e=>{let n=Number(e.id),a=!!eTargetSatker&&!eAllowedGolongan.has(n);return(0,t.jsxs)("label",{style:{display:"flex",gap:"0.4rem",padding:"0.3rem",opacity:a?.48:1,fontSize:"0.8rem"},children:[(0,t.jsx)("input",{type:"checkbox",checked:eGolIds.includes(n),disabled:a,onChange:e=>eSetGolIds(t=>e.target.checked?[...t,n]:t.filter(e=>e!==n))}),(0,t.jsx)("span",{children:e.nama})]},e.id)})})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{style:{display:"block",fontSize:"0.76rem",fontWeight:800,color:"#64748b",marginBottom:"0.35rem"},children:"Keterkaitan LP"}),(0,t.jsx)("div",{style:{border:"1px solid #e2e8f0",borderRadius:8,padding:"0.45rem"},children:[{value:"OPERASI",label:"Masuk Operasi"},{value:"SATGAS",label:"Masuk Satgas"},{value:"ATENSI",label:"Atensi"},{value:"MENONJOL",label:"Kasus Menonjol"}].map(e=>(0,t.jsxs)("label",{style:{display:"flex",gap:"0.4rem",padding:"0.35rem",fontSize:"0.8rem"},children:[(0,t.jsx)("input",{type:"checkbox",checked:eMonTags.includes(e.value),onChange:n=>eSetMonTags(t=>n.target.checked?[...t,e.value]:t.filter(t=>t!==e.value))}),(0,t.jsx)("span",{children:e.label})]},e.value))}),(0,t.jsxs)("div",{style:{display:"flex",gap:"0.4rem",marginTop:"0.65rem"},children:[(0,t.jsx)(o.Button,{label:"Terapkan",icon:"pi pi-filter",onClick:eApplyMonitoringFilters,size:"small"}),(0,t.jsx)(o.Button,{label:"Reset",outlined:!0,onClick:eResetMonitoringFilters,size:"small"})]})]})]})]}),(0,t.jsxs)(a.DataTable,',
  'filter area'
);

fs.writeFileSync(dst,s);
console.log(JSON.stringify({ok:true,bytes:s.length,target:dst}));
