(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,72382,e=>{"use strict";let a=(0,e.i(56420).default)("eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);e.s(["Eye",0,a],72382)},45184,e=>{"use strict";var a=e.i(43476),l=e.i(68242);e.s(["ALL_ROWS_CLIENT",0,1e6,"ALL_ROWS_LAZY",0,1e3,"CurrentPageReport",0,function(e){let t=Math.max(0,Number(e?.totalRecords)||0),n=t>0?Math.max(1,Math.min(t,Number(e?.first)||0)):0,r=t>0?Math.max(n,Math.min(t,Number(e?.last)||n)):0;return(0,a.jsx)("span",{className:"p-paginator-current cas-paginator-info",children:`Menampilkan ${n.toLocaleString("id-ID")} s.d. ${r.toLocaleString("id-ID")} dari ${t.toLocaleString("id-ID")} data`})},"DEFAULT_PAGINATOR_LAYOUT",0,"CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown","rowsPerPageTemplate",0,function(e,t=1e3){let n=[...e.map(e=>({label:String(e),value:e})),{label:"Semua",value:t}];return e=>(0,a.jsx)(l.Dropdown,{id:"fld-0n5r-6beatsas-1",inputId:"fld-0n5r-6beatsas-1-select",name:"field_0n5r_6beatsas_1",value:e.value,options:n,onChange:e.onChange})}])},2114,e=>{"use strict";let a=(0,e.i(56420).default)("gavel",[["path",{d:"m14 13-8.381 8.38a1 1 0 0 1-3.001-3l8.384-8.381",key:"pgg06f"}],["path",{d:"m16 16 6-6",key:"vzrcl6"}],["path",{d:"m21.5 10.5-8-8",key:"a17d9x"}],["path",{d:"m8 8 6-6",key:"18bi4p"}],["path",{d:"m8.5 7.5 8 8",key:"1oyaui"}]]);e.s(["Gavel",0,a],2114)},74544,e=>{"use strict";let a=(0,e.i(56420).default)("clock",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 6v6l4 2",key:"mmk7yg"}]]);e.s(["Clock",0,a],74544)},82303,e=>{"use strict";let a=(0,e.i(56420).default)("users",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["path",{d:"M16 3.128a4 4 0 0 1 0 7.744",key:"16gr8j"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}]]);e.s(["Users",0,a],82303)},29210,e=>{"use strict";let a=(0,e.i(56420).default)("landmark",[["path",{d:"M10 18v-7",key:"wt116b"}],["path",{d:"M11.119 2.205a2 2 0 0 1 1.762 0l7.84 3.846A.5.5 0 0 1 20.5 7h-17a.5.5 0 0 1-.22-.949z",key:"yxxwt6"}],["path",{d:"M14 18v-7",key:"vav6t3"}],["path",{d:"M18 18v-7",key:"aexdmj"}],["path",{d:"M3 22h18",key:"8prr45"}],["path",{d:"M6 18v-7",key:"1ivflk"}]]);e.s(["Landmark",0,a],29210)},34899,e=>{"use strict";var a=e.i(43476),l=e.i(71144),t=e.i(53729),n=e.i(29210),r=e.i(82303);let s={Mabes:"danger",Polda:"danger",Polres:"warning",Polsek:"info"};function i(e){return e.replace(/_/g," ").replace(/\b\w/g,e=>e.toUpperCase())}let d=(0,a.jsx)("span",{style:{color:"#94a3b8"},children:"—"});function o({value:e}){if(null==e||""===e)return(0,a.jsx)(a.Fragment,{children:d});if("boolean"==typeof e)return(0,a.jsx)(a.Fragment,{children:e?"Ya":"Tidak"});if("number"==typeof e)return(0,a.jsx)(a.Fragment,{children:e.toLocaleString("id-ID")});if("string"==typeof e)return e.includes("|")?(0,a.jsx)("ul",{style:{margin:0,paddingLeft:"1.05rem"},children:e.split("|").map((e,l)=>(0,a.jsx)("li",{style:{wordBreak:"break-word"},children:e.trim()||d},l))}):(0,a.jsx)("span",{style:{wordBreak:"break-word"},children:e});if(Array.isArray(e))return 0===e.length?(0,a.jsx)(a.Fragment,{children:d}):(0,a.jsx)("div",{style:{display:"grid",gap:"0.5rem"},children:e.map((l,t)=>(0,a.jsxs)("div",{style:{border:"1px solid #e5e7eb",borderRadius:8,padding:"0.5rem 0.65rem",background:"var(--surface-hover, #f8fafc)"},children:[e.length>1&&(0,a.jsxs)("div",{style:{fontSize:"0.68rem",fontWeight:700,color:"#94a3b8",marginBottom:"0.3rem"},children:["#",t+1]}),(0,a.jsx)(o,{id:"fld-0n5r-6beatsas-2",name:"field_0n5r_6beatsas_2",value:l})]},t))});let l=Object.keys(e);return 0===l.length?(0,a.jsx)(a.Fragment,{children:d}):(0,a.jsx)("div",{style:{display:"grid",gap:"0.28rem"},children:l.map(l=>(0,a.jsxs)("div",{style:{display:"flex",gap:"0.5rem",alignItems:"baseline",flexWrap:"wrap"},children:[(0,a.jsx)("span",{style:{fontSize:"0.7rem",fontWeight:700,color:"#64748b",minWidth:"7rem"},children:i(l)}),(0,a.jsx)("span",{style:{fontSize:"0.82rem",flex:"1 1 8rem",minWidth:0},children:(0,a.jsx)(o,{id:"fld-0n5r-6beatsas-3",name:"field_0n5r_6beatsas_3",value:e[l]})})]},l))})}e.s(["default",0,function({visible:e,onHide:d,detail:m}){return(0,a.jsx)(l.Dialog,{header:m?.no_laporan||"Detail LP",visible:e,onHide:d,style:{width:"56rem",maxWidth:"96vw"},modal:!0,dismissableMask:!0,children:m&&(0,a.jsxs)("div",{children:[(0,a.jsxs)("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap",marginBottom:"0.9rem"},children:[m.model_lp&&(0,a.jsx)(t.Tag,{value:"lp_model_a"===m.model_lp?"Model A":"lp_model_b"===m.model_lp?"Model B":m.model_lp,severity:"lp_model_a"===m.model_lp?"info":"warning"}),null!=m.dors_lp_id&&(0,a.jsx)(t.Tag,{value:`DORS ID ${m.dors_lp_id}`}),m.data_scope&&(0,a.jsx)(t.Tag,{value:m.data_scope}),m.synced_at&&(0,a.jsx)(t.Tag,{value:`Ditarik ${function(e){if(!e)return"—";try{return new Date(e).toLocaleString("id-ID",{dateStyle:"medium",timeStyle:"short"})}catch{return String(e)}}(m.synced_at)}`,severity:"success"})]}),(0,a.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(13rem, 1fr))",gap:"0.75rem",marginBottom:"1rem",padding:"0.85rem",background:"var(--surface-hover, #f8fafc)",borderRadius:10,border:"1px solid var(--surface-border, #e5e7eb)"},children:[(0,a.jsxs)("div",{children:[(0,a.jsxs)("div",{style:{fontSize:"0.68rem",fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.03em",marginBottom:"0.3rem",display:"flex",alignItems:"center",gap:"0.3rem"},children:[(0,a.jsx)(n.Landmark,{size:13})," Satker Penanganan"]}),m.penanganan_nama?(0,a.jsxs)("div",{children:[(0,a.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.4rem"},children:[(0,a.jsx)(t.Tag,{value:m.penanganan_level||"-",severity:s[m.penanganan_level||""]||void 0}),(0,a.jsx)("span",{style:{fontWeight:700,fontSize:"0.9rem"},children:m.penanganan_nama})]}),m.penanganan_kode_pusiknas&&(0,a.jsx)("div",{style:{fontSize:"0.74rem",color:"#94a3b8",fontFamily:"monospace",marginTop:"0.2rem"},children:m.penanganan_kode_pusiknas})]}):(0,a.jsx)("span",{style:{color:"var(--cas-text-muted, #64748b)"},children:"—"})]}),(0,a.jsxs)("div",{children:[(0,a.jsxs)("div",{style:{fontSize:"0.68rem",fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.03em",marginBottom:"0.3rem",display:"flex",alignItems:"center",gap:"0.3rem"},children:[(0,a.jsx)(r.Users,{size:13})," Unit"]}),m.unit_nama?(0,a.jsxs)("div",{style:{fontWeight:700,fontSize:"0.9rem"},children:[m.unit_nama," ",m.unit_level&&(0,a.jsxs)("span",{style:{fontSize:"0.75rem",color:"#94a3b8",fontWeight:400},children:["(",m.unit_level,")"]})]}):(0,a.jsx)("span",{style:{color:"var(--cas-text-muted, #64748b)"},children:"—"})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("div",{style:{fontSize:"0.68rem",fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.03em",marginBottom:"0.3rem"},children:"Hierarki"}),(0,a.jsxs)("div",{style:{fontSize:"0.78rem",color:"#475569",lineHeight:1.5},children:[m.polda_nama&&(0,a.jsxs)("div",{children:["Polda: ",(0,a.jsx)("strong",{children:m.polda_nama})]}),m.polres_nama&&(0,a.jsxs)("div",{children:["Polres: ",(0,a.jsx)("strong",{children:m.polres_nama})]}),m.polsek_nama&&(0,a.jsxs)("div",{children:["Polsek: ",(0,a.jsx)("strong",{children:m.polsek_nama})]})]})]})]}),(0,a.jsx)("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(15rem, 1fr))",gap:"0.6rem 1.25rem",alignItems:"start"},children:Object.keys(m.payload_json||{}).map(e=>{let l=m.payload_json[e],t=Array.isArray(l)?l.length>0:"object"==typeof l&&null!==l&&Object.keys(l).length>0;return(0,a.jsxs)("div",{style:{borderBottom:"1px solid #f1f5f9",paddingBottom:"0.4rem",minWidth:0,gridColumn:t?"1 / -1":"auto"},children:[(0,a.jsx)("div",{style:{fontSize:"0.68rem",fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.03em",marginBottom:t?"0.35rem":0},children:i(e)}),(0,a.jsx)("div",{style:{fontWeight:t?500:600,fontSize:"0.85rem"},children:(0,a.jsx)(o,{id:"fld-0n5r-6beatsas-4",name:"field_0n5r_6beatsas_4",value:l})})]},e)})})]})})}])},9584,e=>{"use strict";let a=(0,e.i(56420).default)("database",[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5",key:"1wlel7"}],["path",{d:"M3 12A9 3 0 0 0 21 12",key:"mv7ke4"}]]);e.s(["Database",0,a],9584)},1417,e=>{"use strict";var a=e.i(43476),l=e.i(71645),t=e.i(17580),n=e.i(24718),r=e.i(44080),s=e.i(68242),i=e.i(1743),d=e.i(53729),o=e.i(85118),m=e.i(9584),c=e.i(72382),p=e.i(41120),u=e.i(74544),g=e.i(82303),h=e.i(2114),y=e.i(54858),x=e.i(45184),f=e.i(34899);function j(e){if(!e.dugaan_tindak_pidana)return(0,a.jsx)("span",{style:{color:"var(--cas-text-muted, #64748b)"},children:"—"});let l=e.dugaan_tindak_pidana.split("; ");return(0,a.jsx)("div",{style:{display:"flex",flexDirection:"column",gap:"0.15rem"},children:l.map((e,l)=>{let[t,n]=e.split(" — ");return(0,a.jsxs)("span",{style:{display:"inline-flex",alignItems:"baseline",gap:"0.35rem",flexWrap:"wrap"},children:[(0,a.jsx)(h.Gavel,{size:12,style:{color:"#b45309",flex:"0 0 auto",alignSelf:"center"}}),(0,a.jsx)("span",{style:{fontWeight:600},children:t}),n&&(0,a.jsxs)("span",{style:{fontSize:"0.72rem",color:"#b45309",background:"#fffbeb",borderRadius:6,padding:"0.02rem 0.35rem"},children:["Pasal ",n]})]},l)})})}let v={Polda:"danger",Polres:"warning",Polsek:"info"};function b(e){return e.penanganan_nama?(0,a.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.15rem"},children:[(0,a.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.4rem"},children:[(0,a.jsx)(d.Tag,{value:e.penanganan_level||"-",severity:v[e.penanganan_level||""]||void 0}),(0,a.jsx)("span",{style:{fontWeight:600},children:e.penanganan_nama})]}),e.penanganan_kode_pusiknas&&(0,a.jsx)("span",{style:{fontSize:"0.72rem",color:"#94a3b8",fontFamily:"monospace"},children:e.penanganan_kode_pusiknas})]}):(0,a.jsx)("span",{style:{color:"var(--cas-text-muted, #64748b)"},children:"—"})}function k(e){return e.unit_nama?(0,a.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.35rem"},children:[(0,a.jsx)(g.Users,{size:13,style:{color:"#2563eb"}}),(0,a.jsx)("span",{style:{fontWeight:600},children:e.unit_nama}),e.unit_level&&(0,a.jsxs)("span",{style:{fontSize:"0.72rem",color:"#94a3b8"},children:["(",e.unit_level,")"]})]}):(0,a.jsx)("span",{style:{color:"var(--cas-text-muted, #64748b)"},children:"—"})}function _(e){if(!e)return"—";try{return new Date(e).toLocaleString("id-ID",{dateStyle:"medium",timeStyle:"short"})}catch{return String(e)}}
function bulkMonthNames(){return["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"]}
function bulkMonthOptions(){return bulkMonthNames().map((x,idx)=>({label:x,value:String(idx+1).padStart(2,"0")}))}
function bulkYearOptions(){let yr=new Date().getFullYear(),out=[];for(let x=yr;x>=yr-5;x--)out.push({label:String(x),value:String(x)});return out}
function bulkDaysInMonth(year,month){return new Date(Number(year),Number(month),0).getDate()}
function bulkMonthRange(year,month){let y=String(year),m=String(month).padStart(2,"0"),last=String(bulkDaysInMonth(y,m)).padStart(2,"0");return{from:y+"-"+m+"-01",to:y+"-"+m+"-"+last,label:bulkMonthNames()[Number(m)-1]+" "+y}}
function bulkYearRange(year){let y=String(year);return{from:y+"-01-01",to:y+"-12-31",label:"Tahun "+y}}
function bulkDescribePeriod(from,to){
    let now=new Date(),cy=String(now.getFullYear()),cm=String(now.getMonth()+1).padStart(2,"0");
    if(!from&&!to)return{mode:"year",month:cm,year:cy,customFrom:"",customTo:"",label:"Semua Periode"};
    let fy=String(from||"").slice(0,4),fm=String(from||"").slice(5,7),ty=String(to||"").slice(0,4),tm=String(to||"").slice(5,7);
    if(fy&&fy===ty&&from===fy+"-01-01"&&to===fy+"-12-31"){let td=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Jakarta"}).format(new Date());return{mode:"year",month:fm||cm,year:fy,customFrom:from,customTo:to>td?td:to,label:"Tahun "+fy}}
    if(fy&&fy===ty&&fm&&fm===tm&&from===fy+"-"+fm+"-01"&&to===fy+"-"+fm+"-"+String(bulkDaysInMonth(fy,fm)).padStart(2,"0"))return{mode:"month",month:fm,year:fy,customFrom:from,customTo:to,label:bulkMonthNames()[Number(fm)-1]+" "+fy};
    return{mode:"custom",month:fm||cm,year:fy||cy,customFrom:from||"",customTo:to||"",label:(from||"…")+" s.d. "+(to||"…")};
}
e.s(["default",0,function(){let e=(0,l.useRef)(null),DORS_STATS_CACHE_KEY="cas_dors_staging_stats_v1",defaultStats={total:0,per_model:[{model_lp:"lp_model_a",label:"LP Model A",jumlah:0,terakhir_sync:null},{model_lp:"lp_model_b",label:"LP Model B",jumlah:0,terakhir_sync:null}],per_level:{Mabes:0,Polda:0,Polres:0,Polsek:0}},[g,h]=(0,l.useState)([]),[v,S]=(0,l.useState)(0),[w,P]=(0,l.useState)(!0),[T,z]=(0,l.useState)(()=>{try{let raw=sessionStorage.getItem(DORS_STATS_CACHE_KEY);if(raw){let parsed=JSON.parse(raw);if(parsed&&"object"==typeof parsed)return parsed}}catch{}return defaultStats}),[D,W]=(0,l.useState)(""),[L,C]=(0,l.useState)(""),[A,I]=(0,l.useState)(""),[M,R]=(0,l.useState)(0),[O,B]=(0,l.useState)(25),[N,U]=(0,l.useState)(null),[periodOpen,setPeriodOpen]=(0,l.useState)(!1),[periodMode,setPeriodMode]=(0,l.useState)("year"),[periodMonth,setPeriodMonth]=(0,l.useState)(()=>{let d=new Date();return String(d.getMonth()+1).padStart(2,"0")}),[periodYear,setPeriodYear]=(0,l.useState)(()=>String(new Date().getFullYear())),[customFrom,setCustomFrom]=(0,l.useState)(""),[customTo,setCustomTo]=(0,l.useState)(""),[periodLabel,setPeriodLabel]=(0,l.useState)(()=>"Tahun "+new Date().getFullYear()),[appliedFrom,setAppliedFrom]=(0,l.useState)(()=>new Date().getFullYear()+"-01-01"),[appliedTo,setAppliedTo]=(0,l.useState)(()=>new Date().getFullYear()+"-12-31"),saveStatsState=(0,l.useCallback)(st=>{if(!st||"object"!=typeof st)return;z(prev=>{let next={...defaultStats,...prev,...st,per_model:Array.isArray(st.per_model)&&st.per_model.length>0?st.per_model:prev?.per_model||defaultStats.per_model,per_level:st.per_level||prev?.per_level||defaultStats.per_level};try{sessionStorage.setItem(DORS_STATS_CACHE_KEY,JSON.stringify(next))}catch{}return next})},[]),F=(0,l.useCallback)(async()=>{try{let e=await y.apiAuth.get("/bdb/dors/data/stats"),st=e.data?.data||e.data?.stats||null;if(st)saveStatsState(st)}catch{}},[saveStatsState]),E=(0,l.useCallback)(async()=>{P(!0);try{let pageNum=Math.floor(M/O)+1,params={...D?{model:D}:{},...L?{level:L}:{},...A?{search:A}:{},...appliedFrom?{from:appliedFrom}:{},...appliedTo?{to:appliedTo}:{},page:pageNum,row:O},[listSettled,statsSettled]=await Promise.allSettled([y.apiAuth.get("/bdb/dors/data",{params}),y.apiAuth.get("/bdb/dors/data/stats")]);if("fulfilled"===statsSettled.status){let st=statsSettled.value?.data?.data||statsSettled.value?.data?.stats||null;if(st)saveStatsState(st)}if("fulfilled"===listSettled.status){let res=listSettled.value?.data,rows=Array.isArray(res?.data)?res.data:[],tot=Number(res?.total??res?.meta?.total??rows.length),inlineStats=res?.meta?.stats||res?.stats||null;if(inlineStats)saveStatsState(inlineStats);else if(tot>0&&"fulfilled"!==statsSettled.status)saveStatsState({total:tot});h(rows);S(tot)}else{let err=listSettled.reason;e.current?.show({severity:"error",summary:"Gagal memuat",detail:err?.response?.data?.message||"Gagal memuat data"});h([])}}catch(err){e.current?.show({severity:"error",summary:"Gagal memuat",detail:err?.response?.data?.message||"Gagal memuat data"});h([])}finally{P(!1)}},[M,O,D,L,A,appliedFrom,appliedTo,saveStatsState]);(0,l.useEffect)(()=>{E()},[E]);let $=[{label:"Semua model",value:""},...(T?.per_model||[]).map(e=>({label:`${e.label} (${e.jumlah})`,value:e.model_lp}))],G=T?.per_level||{},H=[{label:"Semua satker",value:""},{label:`Mabes (${G.Mabes??0})`,value:"Mabes"},{label:`Polda (${G.Polda??0})`,value:"Polda"},{label:`Polres (${G.Polres??0})`,value:"Polres"},{label:`Polsek (${G.Polsek??0})`,value:"Polsek"}];
function openPeriodDialog(){let p=bulkDescribePeriod(appliedFrom,appliedTo);setPeriodMode(p.mode);setPeriodMonth(p.month);setPeriodYear(p.year);setCustomFrom(p.customFrom);setCustomTo(p.customTo);setPeriodOpen(!0)}
function applyPeriod(){let f="",t="",lbl="";if("month"===periodMode){let p=bulkMonthRange(periodYear,periodMonth);f=p.from;t=p.to;lbl=p.label}else if("year"===periodMode){let p=bulkYearRange(periodYear);f=p.from;t=p.to;lbl=p.label}else{f=customFrom;t=customTo;if(!f||!t){return void e.current?.show({severity:"warn",summary:"Periode belum lengkap",detail:"Tanggal awal dan akhir wajib dipilih."})}if(f>t){return void e.current?.show({severity:"warn",summary:"Periode tidak valid",detail:"Tanggal awal tidak boleh melewati tanggal akhir."})}lbl=f+" s.d. "+t}setAppliedFrom(f);setAppliedTo(t);setPeriodLabel(lbl);setPeriodOpen(!1);R(0)}
function resetPeriod(){setAppliedFrom("");setAppliedTo("");setPeriodLabel("Semua Periode");setPeriodOpen(!1);R(0)}
function Y(){R(0),E()}
return(0,a.jsxs)("div",{children:[(0,a.jsx)(o.Toast,{ref:e}),(0,a.jsx)("style",{children:`
.cas-staging-toolbar {
  display: flex !important;
  align-items: center !important;
  gap: 0.6rem !important;
  flex-wrap: wrap !important;
  padding: 0.85rem 1rem !important;
  border-bottom: 1px solid var(--cas-border, #e2e8f0);
}
.cas-staging-toolbar .cas-filter-item {
  height: 38px !important;
  min-height: 38px !important;
  max-height: 38px !important;
  box-sizing: border-box !important;
  display: flex !important;
  align-items: center !important;
}
.cas-staging-toolbar .p-button,
.cas-staging-toolbar .p-dropdown,
.cas-staging-toolbar .p-inputtext {
  height: 38px !important;
  min-height: 38px !important;
  max-height: 38px !important;
  border-radius: 8px !important;
  font-size: 0.82rem !important;
  box-sizing: border-box !important;
  margin: 0 !important;
}
.cas-staging-toolbar .p-dropdown,
.cas-staging-toolbar .p-inputtext,
.cas-staging-toolbar .p-button.p-button-outlined {
  border: 1px solid var(--cas-border, #cbd5e1) !important;
  background: var(--cas-input-bg, var(--surface-card, #ffffff)) !important;
  color: var(--cas-text-primary, #0f172a) !important;
}
.cas-staging-toolbar .p-dropdown {
  display: inline-flex !important;
  align-items: center !important;
  padding: 0 !important;
}
.cas-staging-toolbar .p-dropdown .p-dropdown-label {
  padding: 0 0.75rem !important;
  font-size: 0.82rem !important;
  line-height: 36px !important;
  height: 100% !important;
  display: flex !important;
  align-items: center !important;
}
.cas-staging-toolbar .p-dropdown .p-dropdown-trigger {
  width: 2.2rem !important;
  height: 100% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}
.cas-staging-toolbar .p-inputtext {
  padding: 0 0.75rem !important;
  line-height: 36px !important;
}
.cas-staging-toolbar .p-button {
  padding: 0 0.85rem !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  line-height: 1 !important;
}
.lp-period-popover-v2 .p-dropdown,
.lp-period-popover-v2 .p-inputtext,
.lp-period-popover-v2 .p-button {
  height: 38px !important;
  min-height: 38px !important;
  max-height: 38px !important;
  border-radius: 8px !important;
  font-size: 0.82rem !important;
  box-sizing: border-box !important;
}
`}),(0,a.jsxs)("div",{style:{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:"1rem",flexWrap:"wrap",marginBottom:"0.35rem"},children:[(0,a.jsxs)("div",{children:[(0,a.jsx)("div",{style:{fontSize:"0.72rem",fontWeight:800,color:"#2563eb",textTransform:"uppercase",letterSpacing:"0.04em",marginBottom:"0.2rem"},children:"PORTAL INTEGRASI MASUK / STAGING"}),(0,a.jsx)("h1",{className:"cms-page-title",style:{margin:0},children:"Staging Data LP (DORS Stamaops)"}),(0,a.jsx)("p",{className:"cms-page-sub",style:{margin:"0.25rem 0 0"},children:"Data mentah (staging) Laporan Polisi yang berhasil ditarik & tersimpan dari DORS Stamaops Polri. Seluruh field integrasi disimpan utuh."})]}),(0,a.jsx)("a",{href:"/cms/integrasi/masuk-penarikan",style:{display:"inline-flex",alignItems:"center",gap:"0.4rem",height:"38px",padding:"0 0.85rem",borderRadius:"8px",border:"1px solid var(--cas-border, #cbd5e1)",background:"var(--cas-surface-subtle, #f8fafc)",color:"#2563eb",fontSize:"0.82rem",fontWeight:700,textDecoration:"none"},children:"← Tarik Data & Konfigurasi Portal"})]}),(0,a.jsxs)("div",{className:"cms-cards",style:{margin:"1rem 0"},children:[(0,a.jsxs)("div",{className:"cms-card",style:{display:"flex",alignItems:"center",gap:"0.7rem"},children:[(0,a.jsx)(m.Database,{size:22,style:{color:"#2563eb"}}),(0,a.jsxs)("div",{children:[(0,a.jsx)("div",{style:{fontSize:"0.72rem",color:"#94a3b8",fontWeight:700,textTransform:"uppercase"},children:"Total Tersimpan"}),(0,a.jsx)("div",{style:{fontSize:"1.4rem",fontWeight:800},children:(T?.total??0).toLocaleString("id-ID")})]})]}),(T?.per_model||[]).map(e=>(0,a.jsxs)("div",{className:"cms-card",children:[(0,a.jsx)("div",{style:{fontSize:"0.72rem",color:"#94a3b8",fontWeight:700,textTransform:"uppercase"},children:e.label}),(0,a.jsx)("div",{style:{fontSize:"1.4rem",fontWeight:800},children:e.jumlah.toLocaleString("id-ID")}),(0,a.jsxs)("div",{style:{fontSize:"0.72rem",color:"#94a3b8",display:"flex",alignItems:"center",gap:"0.3rem",marginTop:"0.2rem"},children:[(0,a.jsx)(u.Clock,{size:12})," ",_(e.terakhir_sync)]})]},e.model_lp))]}),(0,a.jsxs)("div",{className:"cms-card",style:{padding:0,overflow:periodOpen?"visible":"hidden"},children:[(0,a.jsxs)("div",{className:"cas-staging-toolbar",children:[
(0,a.jsxs)("div",{
    className:"cas-filter-item",
    style:{position:"relative",flex:"1 1 13rem",minWidth:"12.5rem"},
    children:[
        (0,a.jsx)(i.Button,{
            id:"fld-0n5r-period-btn",
            label:"Periode: "+periodLabel,
            icon:"pi pi-calendar",
            outlined:!0,
            onClick:()=>periodOpen?setPeriodOpen(!1):openPeriodDialog(),
            style:{width:"100%",height:"38px",minHeight:"38px",maxHeight:"38px",borderRadius:"8px",fontSize:"0.82rem",border:"1px solid var(--cas-border, #cbd5e1)",justifyContent:"flex-start",whiteSpace:"nowrap",boxSizing:"border-box"}
        }),
        periodOpen&&(0,a.jsx)("div",{style:{position:"fixed",inset:0,zIndex:99},onClick:()=>setPeriodOpen(!1)}),
        periodOpen&&(0,a.jsxs)("div",{
            className:"lp-period-popover-v2",
            style:{
                position:"absolute",
                left:0,
                top:"calc(100% + 0.45rem)",
                zIndex:100,
                width:"32rem",
                maxWidth:"calc(100vw - 2rem)",
                background:"var(--surface-card, #fff)",
                border:"1px solid var(--cas-border, #cbd5e1)",
                borderRadius:10,
                boxShadow:"0 14px 36px rgba(15,23,42,.16)",
                padding:"0.85rem"
            },
            children:[
                (0,a.jsx)("div",{style:{fontWeight:800,color:"var(--cas-text-primary, #0f172a)",marginBottom:"0.7rem",fontSize:"0.86rem"},children:"Pilih Periode Sinkronisasi DORS"}),
                (0,a.jsxs)("div",{
                    style:{display:"grid",gap:"0.85rem"},
                    children:[
                        (0,a.jsxs)("div",{
                            style:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"0.4rem"},
                            children:[
                                (0,a.jsx)(i.Button,{label:"Bulan",outlined:"month"!==periodMode,onClick:()=>setPeriodMode("month"),style:{height:"38px",minHeight:"38px",maxHeight:"38px",borderRadius:"8px",fontSize:"0.82rem"}}),
                                (0,a.jsx)(i.Button,{label:"Tahun",outlined:"year"!==periodMode,onClick:()=>setPeriodMode("year"),style:{height:"38px",minHeight:"38px",maxHeight:"38px",borderRadius:"8px",fontSize:"0.82rem"}}),
                                (0,a.jsx)(i.Button,{label:"Custom",outlined:"custom"!==periodMode,onClick:()=>setPeriodMode("custom"),style:{height:"38px",minHeight:"38px",maxHeight:"38px",borderRadius:"8px",fontSize:"0.82rem"}})
                            ]
                        }),
                        "month"===periodMode&&(0,a.jsxs)("div",{
                            style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.6rem"},
                            children:[
                                (0,a.jsx)(s.Dropdown,{id:"fld-0n5r-p-month",value:periodMonth,options:bulkMonthOptions(),onChange:x=>setPeriodMonth(x.value),placeholder:"Bulan",style:{width:"100%",height:"38px",minHeight:"38px",maxHeight:"38px",borderRadius:"8px",fontSize:"0.82rem",border:"1px solid var(--cas-border, #cbd5e1)"}}),
                                (0,a.jsx)(s.Dropdown,{id:"fld-0n5r-p-year-m",value:periodYear,options:bulkYearOptions(),onChange:x=>setPeriodYear(x.value),placeholder:"Tahun",style:{width:"100%",height:"38px",minHeight:"38px",maxHeight:"38px",borderRadius:"8px",fontSize:"0.82rem",border:"1px solid var(--cas-border, #cbd5e1)"}})
                            ]
                        }),
                        "year"===periodMode&&(0,a.jsx)(s.Dropdown,{id:"fld-0n5r-p-year",value:periodYear,options:bulkYearOptions(),onChange:x=>setPeriodYear(x.value),placeholder:"Pilih tahun",style:{width:"100%",height:"38px",minHeight:"38px",maxHeight:"38px",borderRadius:"8px",fontSize:"0.82rem",border:"1px solid var(--cas-border, #cbd5e1)"}}),
                        "custom"===periodMode&&(0,a.jsxs)("div",{
                            style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.6rem"},
                            children:[
                                (0,a.jsxs)("div",{
                                    children:[
                                        (0,a.jsx)("label",{style:{display:"block",fontSize:"0.72rem",marginBottom:"0.25rem",color:"#64748b"},children:"Dari"}),
                                        (0,a.jsx)(r.InputText,{id:"fld-0n5r-c-from",type:"date",max:new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Jakarta"}).format(new Date()),value:customFrom,onChange:x=>{let td=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Jakarta"}).format(new Date()),v=x.target.value;setCustomFrom(v&&v>td?td:v)},style:{width:"100%",height:"38px",minHeight:"38px",maxHeight:"38px",borderRadius:"8px",fontSize:"0.82rem",border:"1px solid var(--cas-border, #cbd5e1)"}})
                                    ]
                                }),
                                (0,a.jsxs)("div",{
                                    children:[
                                        (0,a.jsx)("label",{style:{display:"block",fontSize:"0.72rem",marginBottom:"0.25rem",color:"#64748b"},children:"Sampai"}),
                                        (0,a.jsx)(r.InputText,{id:"fld-0n5r-c-to",type:"date",max:new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Jakarta"}).format(new Date()),value:customTo,onChange:x=>{let td=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Jakarta"}).format(new Date()),v=x.target.value;setCustomTo(v&&v>td?td:v)},style:{width:"100%",height:"38px",minHeight:"38px",maxHeight:"38px",borderRadius:"8px",fontSize:"0.82rem",border:"1px solid var(--cas-border, #cbd5e1)"}})
                                    ]
                                })
                            ]
                        }),
                        (0,a.jsxs)("div",{
                            style:{display:"flex",justifyContent:"flex-end",gap:"0.45rem"},
                            children:[
                                (0,a.jsx)(i.Button,{label:"Semua Periode",icon:"pi pi-refresh",text:!0,onClick:resetPeriod,style:{height:"38px",minHeight:"38px",maxHeight:"38px",borderRadius:"8px",fontSize:"0.82rem"}}),
                                (0,a.jsx)(i.Button,{label:"Terapkan",icon:"pi pi-check",onClick:applyPeriod,style:{height:"38px",minHeight:"38px",maxHeight:"38px",borderRadius:"8px",fontSize:"0.82rem"}})
                            ]
                        })
                    ]
                })
            ]
        })
    ]
}),
(0,a.jsx)("div",{className:"cas-filter-item",style:{flex:"1 1 13rem",minWidth:"12rem"},children:(0,a.jsx)(s.Dropdown,{id:"fld-0n5r-6beatsas-5",inputId:"fld-0n5r-6beatsas-5-select",name:"field_0n5r_6beatsas_5",value:D,options:$,onChange:e=>{W(e.value),R(0)},style:{width:"100%",height:"38px",minHeight:"38px",maxHeight:"38px",borderRadius:"8px",fontSize:"0.82rem",border:"1px solid var(--cas-border, #cbd5e1)",boxSizing:"border-box"}})}),(0,a.jsx)("div",{className:"cas-filter-item",style:{flex:"1 1 13rem",minWidth:"12rem"},children:(0,a.jsx)(s.Dropdown,{id:"fld-0n5r-6beatsas-6",inputId:"fld-0n5r-6beatsas-6-select",name:"field_0n5r_6beatsas_6",value:L,options:H,onChange:e=>{C(e.value),R(0)},placeholder:"Semua satker",style:{width:"100%",height:"38px",minHeight:"38px",maxHeight:"38px",borderRadius:"8px",fontSize:"0.82rem",border:"1px solid var(--cas-border, #cbd5e1)",boxSizing:"border-box"}})}),(0,a.jsx)("div",{className:"cas-filter-item",style:{flex:"1.4 1 16rem",minWidth:"14rem"},children:(0,a.jsx)(r.InputText,{id:"fld-0n5r-6beatsas-7",name:"field_0n5r_6beatsas_7",value:A,onChange:e=>I(e.target.value),onKeyDown:e=>"Enter"===e.key&&Y(),placeholder:"Cari nomor laporan…",style:{width:"100%",height:"38px",minHeight:"38px",maxHeight:"38px",borderRadius:"8px",fontSize:"0.82rem",border:"1px solid var(--cas-border, #cbd5e1)",boxSizing:"border-box"}})}),(0,a.jsx)(i.Button,{label:"Cari",icon:"pi pi-search",onClick:Y,style:{height:"38px",minHeight:"38px",maxHeight:"38px",borderRadius:"8px",fontSize:"0.82rem",flex:"0 0 auto"}}),(0,a.jsx)(i.Button,{icon:"pi pi-refresh",outlined:!0,onClick:()=>{F(),E()},loading:w,"aria-label":"Muat ulang",style:{height:"38px",minHeight:"38px",maxHeight:"38px",width:"38px",borderRadius:"8px",fontSize:"0.82rem",border:"1px solid var(--cas-border, #cbd5e1)",flex:"0 0 auto"}})]}),(0,a.jsxs)(t.DataTable,{value:g,loading:w,lazy:!0,paginator:!0,first:M,rows:O,totalRecords:v,onPage:function(e){R(e.first),B(e.rows)},rowsPerPageOptions:[25,50,100,x.ALL_ROWS_LAZY],paginatorTemplate:{layout:x.DEFAULT_PAGINATOR_LAYOUT,CurrentPageReport:x.CurrentPageReport,RowsPerPageDropdown:(0,x.rowsPerPageTemplate)([25,50,100])},emptyMessage:"Belum ada data tarikan. Jalankan penarikan di menu Portal Integrasi Masuk — Tarik Data.",stripedRows:!0,size:"small",children:[(0,a.jsx)(n.Column,{header:"No",body:(e,a)=>M+a.rowIndex+1,style:{width:"3.5rem"},headerStyle:{width:"3.5rem"}}),(0,a.jsx)(n.Column,{header:"No. Laporan",body:e=>(0,a.jsx)("span",{style:{fontWeight:600},children:e.no_laporan||"—"})}),(0,a.jsx)(n.Column,{header:"Model",body:e=>(0,a.jsx)(d.Tag,{value:"lp_model_a"===e.model_lp?"A":"lp_model_b"===e.model_lp?"B":e.model_lp,severity:"lp_model_a"===e.model_lp?"info":"warning"})}),(0,a.jsx)(n.Column,{header:"Satker Penanganan",body:b,style:{minWidth:"15rem"}}),(0,a.jsx)(n.Column,{header:"Unit",body:k,style:{minWidth:"10rem"}}),(0,a.jsx)(n.Column,{header:"Dugaan Tindak Pidana",body:j,style:{minWidth:"15rem"}}),(0,a.jsx)(n.Column,{header:"DORS ID",field:"dors_lp_id"}),(0,a.jsx)(n.Column,{header:"Ditarik",body:e=>_(e.synced_at)}),(0,a.jsx)(n.Column,{header:"",style:{width:"3.5rem"},body:e=>(0,a.jsx)("button",{type:"button",className:"att-icon-link",onClick:()=>U(e),"aria-label":"Lihat detail",title:"Lihat detail",children:(0,a.jsx)(c.Eye,{size:17})})})]})]}),(0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.4rem",marginTop:"1rem",color:"#94a3b8",fontSize:"0.78rem"},children:[(0,a.jsx)(p.RefreshCw,{size:13})," Penarikan & penjadwalan dilakukan di menu ",(0,a.jsx)("a",{href:"/cms/integrasi/masuk-penarikan",style:{color:"#2563eb",fontWeight:700,textDecoration:"none"},children:"Integrasi Masuk > Tarik Data"}),". Data yang sudah ditarik tidak akan diambil ulang."]}),(0,a.jsx)(f.default,{visible:!!N,onHide:()=>U(null),detail:N})]})}])}]);