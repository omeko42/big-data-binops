import fs from 'fs';

const filePath = 'd:/Prototype CAS/EDIT MASTER MASAL/pihak-sering-terlibat-fix-20260927/fe/register-pihak-v5-6478da3b8c2c.js';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add cleanCrime and cleanTkp helpers & maximize state variables
// Find: let [arsipModalDoc,setArsipModalDoc]=(0,t.useState)(null),
const oldStates = `let [arsipModalDoc,setArsipModalDoc]=(0,t.useState)(null),[arsipModalTab,setArsipModalTab]=(0,t.useState)("doc"),[satkerModalParty,setSatkerModalParty]=(0,t.useState)(null),[satkerModalData,setSatkerModalData]=(0,t.useState)([]),[satkerModalLoading,setSatkerModalLoading]=(0,t.useState)(!1),[lpModalParty,setLpModalParty]=(0,t.useState)(null),[lpModalData,setLpModalData]=(0,t.useState)([]),[lpModalLoading,setLpModalLoading]=(0,t.useState)(!1),[lpModalTab,setLpModalTab]=(0,t.useState)("period");`;

const newStates = `let cleanCrime=function(val){if(!val)return"—";let str=String(val).replace(/<[^>]*>/g,"").replace(/^[-\\—_:=\\s]+/,"").replace(/[-\\—_:=\\s]+$/,"").trim();return str||"—"};let cleanTkp=function(val){if(!val||val==="—")return null;let str=String(val).replace(/<[^>]*>/g,"").replace(/^[-\\—_:=\\s]+/,"").trim();return str||null};let [arsipModalDoc,setArsipModalDoc]=(0,t.useState)(null),[arsipModalTab,setArsipModalTab]=(0,t.useState)("doc"),[satkerModalParty,setSatkerModalParty]=(0,t.useState)(null),[satkerModalData,setSatkerModalData]=(0,t.useState)([]),[satkerModalLoading,setSatkerModalLoading]=(0,t.useState)(!1),[satkerModalMax,setSatkerModalMax]=(0,t.useState)(!1),[lpModalParty,setLpModalParty]=(0,t.useState)(null),[lpModalData,setLpModalData]=(0,t.useState)([]),[lpModalLoading,setLpModalLoading]=(0,t.useState)(!1),[lpModalTab,setLpModalTab]=(0,t.useState)("period"),[lpModalMax,setLpModalMax]=(0,t.useState)(!1);`;

if (!content.includes(oldStates)) {
  console.error('Error: oldStates not found!');
  process.exit(1);
}
content = content.replace(oldStates, newStates);

// 2. In openSatkerModal and openLpModal, reset maximize flags
content = content.replace(
  'let openSatkerModal=function(row){setSatkerModalParty(row),',
  'let openSatkerModal=function(row){setSatkerModalMax(!1);setSatkerModalParty(row),'
);
content = content.replace(
  'let openLpModal=function(row){setLpModalParty(row),',
  'let openLpModal=function(row){setLpModalMax(!1);setLpModalParty(row),'
);

// 3. Find satkerModalParty and lpModalParty rendering block
const modalStartIdx = content.indexOf('satkerModalParty?(0,a.jsx)("div",{style:{position:"fixed"');
const modalEndIdx = content.indexOf('return(0,a.jsxs)("div",{children:[(0,a.jsx)("h1",{className:"cms-page-title",children:"Register Pihak Terlibat"}');

if (modalStartIdx === -1 || modalEndIdx === -1) {
  console.error('Error: Modal boundaries not found!', { modalStartIdx, modalEndIdx });
  process.exit(1);
}

const newModalSnippet = `satkerModalParty?(0,a.jsx)("div",{style:{position:"fixed",top:0,left:0,right:0,bottom:0,backgroundColor:"rgba(15,23,42,0.65)",backdropFilter:"blur(3px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,padding:satkerModalMax?"0.5rem":"1rem"},onClick:()=>setSatkerModalParty(null),children:(0,a.jsxs)("div",{style:{backgroundColor:"#ffffff",borderRadius:satkerModalMax?"8px":"12px",boxShadow:"0 25px 50px -12px rgba(0,0,0,0.25)",width:"100%",maxWidth:satkerModalMax?"98vw":"58rem",height:satkerModalMax?"96vh":"auto",maxHeight:satkerModalMax?"96vh":"88vh",display:"flex",flexDirection:"column",overflow:"hidden",transition:"all 0.18s ease-in-out"},onClick:ev=>ev.stopPropagation(),children:[
  (0,a.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0.9rem 1.25rem",borderBottom:"1px solid #e2e8f0",background:"#f8fafc"},children:[
    (0,a.jsxs)("div",{children:[
      (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[
        (0,a.jsx)("div",{style:{fontWeight:700,fontSize:"1.05rem",color:"#0f172a"},children:"Daftar Satker Terkait & Tempus"}),
        (satkerModalParty.is_lintas_wilayah&&Number(satkerModalParty.jumlah_polda_unik)>1)?(0,a.jsx)(n.Tag,{value:"Lintas Wilayah ("+satkerModalParty.jumlah_polda_unik+" Polda)",severity:"warning",style:{fontSize:"0.7rem",padding:"0.15rem 0.45rem"}}):(0,a.jsx)(n.Tag,{value:"Satu Wilayah",severity:"info",style:{fontSize:"0.7rem",padding:"0.15rem 0.45rem"}})
      ]}),
      (0,a.jsxs)("div",{style:{fontSize:"0.8rem",color:"#64748b",marginTop:"0.15rem"},children:[satkerModalParty.nama||"Tanpa Nama"," (",satkerModalParty.nik?.startsWith("KORP:")?"Badan Hukum / Korporasi":("NIK: "+(satkerModalParty.nik||"—")),")"]})
    ]}),
    (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.3rem"},children:[
      (0,a.jsx)("button",{type:"button",onClick:()=>setSatkerModalMax(!satkerModalMax),title:satkerModalMax?"Perkecil Tampilan":"Perbesar / Maksimalkan Layar",style:{background:satkerModalMax?"#eff6ff":"#f8fafc",border:"1px solid "+(satkerModalMax?"#93c5fd":"#cbd5e1"),fontSize:"0.95rem",cursor:"pointer",color:satkerModalMax?"#2563eb":"#475569",padding:"0.3rem 0.55rem",borderRadius:"6px",display:"inline-flex",alignItems:"center",justifyContent:"center"},children:(0,a.jsx)("i",{className:satkerModalMax?"pi pi-window-minimize":"pi pi-window-maximize"})}),
      (0,a.jsx)("button",{type:"button",onClick:()=>{setSatkerModalParty(null);setSatkerModalMax(!1);},style:{background:"none",border:"none",fontSize:"1.25rem",cursor:"pointer",color:"#64748b",padding:"0.25rem 0.5rem"},children:"✕"})
    ]})
  ]}),
  (()=>{
    if(satkerModalLoading){
      return (0,a.jsxs)("div",{style:{padding:"2.5rem",textAlign:"center",color:"#64748b"},children:[
        (0,a.jsx)("i",{className:"pi pi-spin pi-spinner",style:{fontSize:"1.75rem",color:"#0284c7",marginBottom:"0.5rem"}}),
        (0,a.jsx)("div",{style:{fontSize:"0.85rem",fontWeight:600},children:"Memuat seluruh riwayat Satker dan Tempus keterlibatan..."})
      ]});
    }
    let grpMap={};
    if(satkerModalData&&satkerModalData.length>0){
      for(let item of satkerModalData){
        let sName=item.satker_nama||"POLRI";
        if(!grpMap[sName]){
          grpMap[sName]={name:sName,wilayah:item.wilayah_nama||"",lps:[],perans:new Set()};
        }
        grpMap[sName].lps.push(item);
        if(item.peran)grpMap[sName].perans.add(item.peran);
      }
    }
    let grpList=Object.values(grpMap);
    let totalUnik=grpList.length>0?grpList.length:(satkerModalParty.jumlah_satker_unik||1);
    let totalLpAll=satkerModalData.length>0?satkerModalData.length:(satkerModalParty.total_lp||1);

    return (0,a.jsxs)("div",{style:{padding:"1.25rem",overflowY:"auto",flex:"1 1 auto",maxHeight:satkerModalMax?"calc(96vh - 135px)":"65vh",display:"flex",flexDirection:"column",gap:"0.75rem"},children:[
      (0,a.jsxs)("div",{style:{fontSize:"0.85rem",fontWeight:600,color:"#334155",display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.25rem"},children:[
        (0,a.jsx)("i",{className:"pi pi-building",style:{color:"#0284c7"}}),
        (0,a.jsxs)("span",{children:["Tercatat pada ",(0,a.jsx)("strong",{style:{color:"#0f172a"},children:totalUnik})," Satuan Kerja (Total ",(0,a.jsx)("strong",{style:{color:"#b91c1c"},children:totalLpAll})," LP All-Time):"]})
      ]}),
      (0,a.jsx)("div",{style:{display:"grid",gridTemplateColumns:satkerModalMax?"repeat(auto-fill,minmax(28rem,1fr))":"1fr",gap:"0.75rem"},children:
        grpList.length>0?grpList.map((g,sIdx)=>(
          (0,a.jsxs)("div",{style:{borderRadius:"8px",border:"1px solid #e2e8f0",background:"#ffffff",overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,0.05)"},children:[
            (0,a.jsxs)("div",{style:{padding:"0.6rem 0.85rem",background:"#f8fafc",borderBottom:"1px solid #e2e8f0",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"0.4rem"},children:[
              (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[
                (0,a.jsx)("span",{style:{background:"#0284c7",color:"#ffffff",width:"1.35rem",height:"1.35rem",borderRadius:"50%",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:"0.7rem",fontWeight:700},children:sIdx+1}),
                (0,a.jsxs)("div",{children:[
                  (0,a.jsx)("div",{style:{fontWeight:700,fontSize:"0.84rem",color:"#0f172a"},children:g.name}),
                  g.wilayah&&g.wilayah!=="POLRI"?(0,a.jsx)("div",{style:{fontSize:"0.7rem",color:"#64748b"},children:"Induk: "+g.wilayah}):null
                ]})
              ]}),
              (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.35rem"},children:[
                Array.from(g.perans).map(pr=>{
                  let sev="info";
                  if(pr==="TERSANGKA"||pr==="DPO")sev="danger";
                  else if(pr==="TERLAPOR")sev="warning";
                  else if(pr==="KORBAN")sev="success";
                  return (0,a.jsx)(n.Tag,{value:pr,severity:sev,style:{fontSize:"0.68rem",padding:"0.1rem 0.35rem"}},pr);
                }),
                (0,a.jsx)(n.Tag,{value:g.lps.length+" LP",severity:"contrast",style:{fontSize:"0.68rem",padding:"0.1rem 0.4rem"}})
              ]})
            ]}),
            (0,a.jsx)("div",{style:{padding:"0.6rem 0.85rem",display:"flex",flexDirection:"column",gap:"0.6rem",background:"#ffffff"},children:
              g.lps.map((lp,lIdx)=>{
                let cCrime=cleanCrime(lp.kejahatan);
                let cTkp=cleanTkp(lp.tempat_kejadian);
                return (0,a.jsxs)("div",{style:{padding:"0.6rem 0.75rem",background:"#f8fafc",borderRadius:"8px",border:"1px solid #e2e8f0",fontSize:"0.76rem",display:"flex",flexDirection:"column",gap:"0.35rem"},children:[
                  (0,a.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"0.35rem"},children:[
                    (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.4rem"},children:[
                      (0,a.jsx)("span",{style:{fontWeight:700,color:"#0f172a",fontSize:"0.82rem"},children:lp.no_laporan||"LP Tanpa Nomor"}),
                      (0,a.jsx)(n.Tag,{value:lp.status_lp||"PROSES",severity:lp.status_lp==="SELESAI"?"success":(lp.status_lp==="BARU"?"info":"warning"),style:{fontSize:"0.65rem",padding:"0.1rem 0.35rem",fontWeight:700}})
                    ]}),
                    (0,a.jsxs)("div",{style:{color:"#64748b",fontSize:"0.72rem"},children:["Tgl LP: ",(0,a.jsx)("strong",{style:{color:"#334155"},children:lp.tgl_laporan||"—"})]})
                  ]}),
                  (0,a.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.25rem"},children:[
                    (0,a.jsxs)("div",{style:{display:"flex",alignItems:"flex-start",gap:"0.35rem",color:"#b45309",background:"#fffbeb",padding:"0.25rem 0.45rem",borderRadius:"5px",border:"1px solid #fde68a"},children:[
                      (0,a.jsx)("i",{className:"pi pi-calendar-clock",style:{fontSize:"0.75rem",marginTop:"0.1rem"}}),
                      (0,a.jsxs)("span",{children:[(0,a.jsx)("strong",{children:"Tempus Kejadian: "}),lp.waktu_kejadian||"—"]})
                    ]}),
                    cTkp?(0,a.jsxs)("div",{style:{display:"flex",alignItems:"flex-start",gap:"0.35rem",color:"#334155",background:"#f1f5f9",padding:"0.25rem 0.45rem",borderRadius:"5px",border:"1px solid #e2e8f0",fontSize:"0.73rem"},children:[
                      (0,a.jsx)("i",{className:"pi pi-map-marker",style:{fontSize:"0.75rem",color:"#ef4444",marginTop:"0.1rem"}}),
                      (0,a.jsxs)("span",{children:[(0,a.jsx)("strong",{children:"TKP: "}),cTkp]})
                    ]}):null,
                    (0,a.jsxs)("div",{style:{color:"#0f172a",fontSize:"0.74rem",padding:"0.15rem 0.2rem"},children:[
                      (0,a.jsx)("strong",{children:"Kejahatan: "}),
                      (0,a.jsx)("span",{style:{color:"#b91c1c",fontWeight:600},children:cCrime})
                    ]}),
                    lp.uraian_kejadian&&lp.uraian_kejadian!=="—"?(0,a.jsxs)("div",{style:{background:"#ffffff",border:"1px solid #e2e8f0",borderRadius:"6px",padding:"0.4rem 0.55rem",color:"#334155",fontSize:"0.73rem",lineHeight:"1.4"},children:[
                      (0,a.jsx)("div",{style:{fontWeight:700,color:"#475569",marginBottom:"0.15rem",display:"flex",alignItems:"center",gap:"0.3rem"},children:[(0,a.jsx)("i",{className:"pi pi-align-left",style:{fontSize:"0.7rem"}}),"Uraian Kejadian:"]}),
                      (0,a.jsx)("div",{style:{color:"#1e293b",whiteSpace:"pre-wrap"},children:lp.uraian_kejadian})
                    ]}):null
                  ]})
                ]},lIdx);
              })
            })
          ]},sIdx)
        )):((satkerModalParty.daftar_satker||satkerModalParty.satker_nama||"Mabes Polri").split(",").map((stk,idx)=>(0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.6rem",padding:"0.5rem 0.75rem",background:"#f1f5f9",borderRadius:"6px",border:"1px solid #e2e8f0"},children:[(0,a.jsx)("span",{style:{background:"#0284c7",color:"#ffffff",width:"1.4rem",height:"1.4rem",borderRadius:"50%",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:"0.7rem",fontWeight:700,flexShrink:0},children:idx+1}),(0,a.jsx)("span",{style:{fontWeight:600,fontSize:"0.82rem",color:"#1e293b"},children:stk.trim()})]},idx)))
      })
    ]});
  })(),
  (0,a.jsxs)("div",{style:{padding:"0.75rem 1.25rem",borderTop:"1px solid #e2e8f0",display:"flex",justifyContent:"space-between",alignItems:"center",background:"#f8fafc",flexWrap:"wrap",gap:"0.5rem"},children:[
    (0,a.jsxs)("button",{type:"button",onClick:()=>{let val=satkerModalParty?.nik&&!String(satkerModalParty.nik).startsWith("KORP:")?satkerModalParty.nik:(satkerModalParty?.nama||"");jumpToRegister(val);},className:"att-btn",style:{display:"inline-flex",alignItems:"center",gap:"0.4rem",fontSize:"0.78rem",fontWeight:600,color:"#0284c7"},children:[(0,a.jsx)("i",{className:"pi pi-search"}),(0,a.jsx)("span",{children:"Buka di Register Pihak Terlibat"})]}),
    (0,a.jsx)("button",{type:"button",onClick:()=>{setSatkerModalParty(null);setSatkerModalMax(!1);},className:"att-btn primary",children:"Tutup"})
  ]})
]})}):null,lpModalParty?(0,a.jsx)("div",{style:{position:"fixed",top:0,left:0,right:0,bottom:0,backgroundColor:"rgba(15,23,42,0.65)",backdropFilter:"blur(3px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,padding:lpModalMax?"0.5rem":"1rem"},onClick:()=>setLpModalParty(null),children:(()=>{
  let pRows=lpModalData.filter(x=>x.in_period);
  let actRows=lpModalTab==="period"?(pRows.length>0?pRows:lpModalData):lpModalData;
  let pCount=pRows.length>0?pRows.length:(lpModalParty?.total_lp||0);
  let isCorp=lpModalParty?.nik?.startsWith("KORP:");
  return (0,a.jsxs)("div",{style:{backgroundColor:"#ffffff",borderRadius:lpModalMax?"8px":"12px",boxShadow:"0 25px 50px -12px rgba(0,0,0,0.25)",width:"100%",maxWidth:lpModalMax?"98vw":"76rem",height:lpModalMax?"96vh":"auto",maxHeight:lpModalMax?"96vh":"90vh",display:"flex",flexDirection:"column",overflow:"hidden",transition:"all 0.18s ease-in-out"},onClick:ev=>ev.stopPropagation(),children:[
    (0,a.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"1rem 1.25rem",borderBottom:"1px solid #e2e8f0",background:"#f8fafc"},children:[
      (0,a.jsxs)("div",{children:[
        (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[
          (0,a.jsx)("div",{style:{fontWeight:700,fontSize:"1.05rem",color:"#0f172a"},children:"Daftar Laporan Polisi"}),
          (0,a.jsx)(n.Tag,{value:(lpModalLoading?(lpModalParty?.total_lp||"..."):actRows.length)+" LP",severity:"danger",style:{fontWeight:700,fontSize:"0.75rem"}})
        ]}),
        (0,a.jsxs)("div",{style:{fontSize:"0.8rem",color:"#64748b",marginTop:"0.15rem"},children:[
          lpModalParty.nama||"Tanpa Nama",
          " (",
          isCorp?"Badan Hukum / Korporasi":("NIK: "+(lpModalParty.nik||"—")),
          ")"
        ]}),
        (0,a.jsxs)("div",{style:{display:"flex",gap:"0.4rem",marginTop:"0.5rem"},children:[
          (0,a.jsxs)("button",{type:"button",onClick:()=>setLpModalTab("period"),style:{padding:"0.22rem 0.65rem",borderRadius:"6px",fontSize:"0.75rem",fontWeight:700,cursor:"pointer",border:lpModalTab==="period"?"1px solid #0284c7":"1px solid #cbd5e1",background:lpModalTab==="period"?"#0284c7":"#ffffff",color:lpModalTab==="period"?"#ffffff":"#475569"},children:["Periode Terpilih (",lpModalLoading?(lpModalParty?.total_lp||"..."):pCount," LP)"]}),
          (0,a.jsxs)("button",{type:"button",onClick:()=>setLpModalTab("all"),style:{padding:"0.22rem 0.65rem",borderRadius:"6px",fontSize:"0.75rem",fontWeight:700,cursor:"pointer",border:lpModalTab==="all"?"1px solid #0284c7":"1px solid #cbd5e1",background:lpModalTab==="all"?"#0284c7":"#ffffff",color:lpModalTab==="all"?"#ffffff":"#475569"},children:["Semua Riwayat (",lpModalLoading?"...":lpModalData.length," LP)"]})
        ]})
      ]}),
      (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.3rem"},children:[
        (0,a.jsx)("button",{type:"button",onClick:()=>setLpModalMax(!lpModalMax),title:lpModalMax?"Perkecil Tampilan":"Perbesar / Maksimalkan Layar",style:{background:lpModalMax?"#eff6ff":"#f8fafc",border:"1px solid "+(lpModalMax?"#93c5fd":"#cbd5e1"),fontSize:"0.95rem",cursor:"pointer",color:lpModalMax?"#2563eb":"#475569",padding:"0.3rem 0.55rem",borderRadius:"6px",display:"inline-flex",alignItems:"center",justifyContent:"center"},children:(0,a.jsx)("i",{className:lpModalMax?"pi pi-window-minimize":"pi pi-window-maximize"})}),
        (0,a.jsx)("button",{type:"button",onClick:()=>{setLpModalParty(null);setLpModalMax(!1);},style:{background:"none",border:"none",fontSize:"1.25rem",cursor:"pointer",color:"#64748b",padding:"0.25rem 0.5rem"},children:"✕"})
      ]})
    ]}),
    (0,a.jsx)("div",{style:{padding:"0.75rem 1rem",overflowY:"auto",flex:"1 1 auto",maxHeight:lpModalMax?"calc(96vh - 145px)":"68vh"},children:
      (0,a.jsxs)(l.DataTable,{
        value:actRows,
        loading:lpModalLoading,
        paginator:actRows.length>(lpModalMax?10:5),
        rows:lpModalMax?10:5,
        rowsPerPageOptions:[5,10,25,50],
        paginatorTemplate:"CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown",
        currentPageReportTemplate:"Menampilkan {first} - {last} dari {totalRecords} LP",
        size:"small",
        stripedRows:!0,
        emptyMessage:lpModalLoading?"Memuat rincian laporan polisi...":"Tidak ada rincian laporan polisi untuk pihak ini.",
        children:[
          (0,a.jsx)(r.Column,{header:"No",body:(row,opt)=>opt.rowIndex+1,style:{width:"3.2rem",textAlign:"center"}}),
          (0,a.jsx)(r.Column,{header:"Nomor LP & Status",body:row=>(0,a.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.2rem"},children:[
            (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.35rem",flexWrap:"wrap"},children:[
              (0,a.jsx)("span",{style:{fontWeight:700,color:"#0f172a",fontSize:"0.8rem",lineHeight:"1.3",wordBreak:"break-word"},children:row.no_laporan||"LP Tanpa Nomor"}),
              (0,a.jsx)(n.Tag,{value:row.status_lp||"PROSES",severity:row.status_lp==="SELESAI"?"success":(row.status_lp==="BARU"?"info":"warning"),style:{fontSize:"0.65rem",padding:"0.1rem 0.35rem",fontWeight:700}})
            ]}),
            (0,a.jsxs)("div",{style:{fontSize:"0.72rem",color:"#64748b",display:"flex",alignItems:"center",gap:"0.3rem"},children:[
              (0,a.jsx)("span",{children:row.tgl_laporan||"—"}),
              row.tahun&&row.tahun!=="2026"?(0,a.jsx)(n.Tag,{value:"Thn "+row.tahun,severity:"secondary",style:{fontSize:"0.65rem",padding:"0.1rem 0.3rem"}}):null
            ]})
          ]}),style:{minWidth:"14rem"}}),
          (0,a.jsx)(r.Column,{header:"Kejahatan",body:row=>{
            let cText=cleanCrime(row.kejahatan);
            return (0,a.jsx)("div",{style:{fontSize:"0.76rem",fontWeight:600,color:"#b91c1c",lineHeight:"1.35",background:"#fef2f2",padding:"0.35rem 0.5rem",borderRadius:"6px",border:"1px solid #fee2e2",wordBreak:"break-word"},children:cText});
          },style:{minWidth:"12rem"}}),
          (0,a.jsx)(r.Column,{header:"Tempus & TKP",body:row=>{
            let tkp=cleanTkp(row.tempat_kejadian);
            return (0,a.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.25rem"},children:[
              (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.3rem",fontWeight:700,fontSize:"0.74rem",color:"#b45309",background:"#fffbeb",padding:"0.2rem 0.4rem",borderRadius:"5px",border:"1px solid #fde68a"},children:[
                (0,a.jsx)("i",{className:"pi pi-calendar-clock",style:{fontSize:"0.72rem",flexShrink:0}}),
                (0,a.jsx)("span",{children:row.waktu_kejadian||"—"})
              ]}),
              tkp?(0,a.jsxs)("div",{style:{fontSize:"0.7rem",color:"#475569",display:"flex",alignItems:"flex-start",gap:"0.25rem",lineHeight:"1.3",wordBreak:"break-word"},children:[
                (0,a.jsx)("i",{className:"pi pi-map-marker",style:{fontSize:"0.72rem",color:"#ef4444",marginTop:"0.1rem",flexShrink:0}}),
                (0,a.jsx)("span",{children:tkp})
              ]}):null
            ]});
          },style:{minWidth:"14rem"}}),
          (0,a.jsx)(r.Column,{header:"Uraian Kejadian",body:row=>(0,a.jsx)("div",{style:{maxHeight:lpModalMax?"10rem":"6rem",overflowY:"auto",fontSize:"0.74rem",lineHeight:"1.45",color:"#334155",background:"#f8fafc",padding:"0.4rem 0.6rem",borderRadius:"6px",border:"1px solid #e2e8f0",wordBreak:"break-word",whiteSpace:"pre-wrap"},children:row.uraian_kejadian||"—"}),style:{minWidth:"18rem"}}),
          (0,a.jsx)(r.Column,{header:"Satker",body:row=>(0,a.jsxs)("div",{children:[
            (0,a.jsx)("div",{style:{fontWeight:600,color:"#0f172a",fontSize:"0.75rem",lineHeight:"1.3"},children:row.satker_nama||"POLRI"}),
            row.wilayah_nama&&row.wilayah_nama!=="POLRI"?(0,a.jsx)("div",{style:{fontSize:"0.68rem",color:"#64748b"},children:row.wilayah_nama}):null
          ]}),style:{minWidth:"10rem"}}),
          (0,a.jsx)(r.Column,{header:"Peran",body:row=>{
            let p=(row.peran||"PIHAK").toUpperCase(),sev="info";
            if(p==="TERSANGKA"||p==="DPO")sev="danger";
            else if(p==="TERLAPOR")sev="warning";
            else if(p==="KORBAN")sev="success";
            else if(p==="PELAPOR")sev="contrast";
            return(0,a.jsx)(n.Tag,{value:p,severity:sev,style:{fontWeight:700,fontSize:"0.72rem"}});
          },style:{width:"6.5rem",textAlign:"center"}})
        ]
      })
    }),
    (0,a.jsxs)("div",{style:{padding:"0.75rem 1.25rem",borderTop:"1px solid #e2e8f0",display:"flex",justifyContent:"space-between",alignItems:"center",background:"#f8fafc",flexWrap:"wrap",gap:"0.5rem"},children:[
      (0,a.jsxs)("button",{type:"button",onClick:()=>{let val=lpModalParty?.nik&&!String(lpModalParty.nik).startsWith("KORP:")?lpModalParty.nik:(lpModalParty?.nama||"");jumpToRegister(val);},className:"att-btn",style:{display:"inline-flex",alignItems:"center",gap:"0.4rem",fontSize:"0.78rem",fontWeight:600,color:"#0284c7"},children:[(0,a.jsx)("i",{className:"pi pi-search"}),(0,a.jsx)("span",{children:"Buka di Register Pihak Terlibat"})]}),
      (0,a.jsx)("button",{type:"button",onClick:()=>{setLpModalParty(null);setLpModalMax(!1);},className:"att-btn primary",children:"Tutup"})
    ]})
  ]});
})()}):null]})} `;

content = content.substring(0, modalStartIdx) + newModalSnippet + content.substring(modalEndIdx);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully patched register-pihak-v5-6478da3b8c2c.js!');
