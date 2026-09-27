import fs from 'fs';

const filePath = 'pihak-sering-terlibat-fix-20260927/fe/register-pihak-v5-6478da3b8c2c.js';
let code = fs.readFileSync(filePath, 'utf8');

// 1. Add state satkerModalData and satkerModalLoading
code = code.replace(
  `[satkerModalParty,setSatkerModalParty]=(0,t.useState)(null),`,
  `[satkerModalParty,setSatkerModalParty]=(0,t.useState)(null),[satkerModalData,setSatkerModalData]=(0,t.useState)([]),[satkerModalLoading,setSatkerModalLoading]=(0,t.useState)(!1),`
);

// 2. Add openSatkerModal definition right before openLpModal
const openSatkerDef = `let openSatkerModal=function(row){setSatkerModalParty(row),setSatkerModalData([]),setSatkerModalLoading(!0);let nik=String(row?.nik||"").trim();if(!nik){setSatkerModalLoading(!1);return}o.apiAuth.get("/bdb/pihak-terlibat/laporan-by-nik/"+encodeURIComponent(nik)).then(res=>{let raw=res?.data?.data||res?.data;setSatkerModalData(Array.isArray(raw)?raw:[]),setSatkerModalLoading(!1)}).catch(()=>{setSatkerModalData([]),setSatkerModalLoading(!1)})};`;
code = code.replace(
  `let openLpModal=function(row){`,
  openSatkerDef + `let openLpModal=function(row){`
);

// 3. In qSering, add Lintas Wilayah card
code = code.replace(
  `qSering=[{key:"semua",label:"Semua",peran:"ALL"},`,
  `qSering=[{key:"semua",label:"Semua",peran:"ALL"},{key:"lintas_wilayah",label:"Lintas Wilayah",peran:"LINTAS_WILAYAH"},`
);

// 4. In main table columns:
// Update "Cakupan Wilayah" button to call openSatkerModal(row)
code = code.replace(
  `onClick:()=>setSatkerModalParty(row),style:{display:"inline-flex",alignItems:"center",gap:"0.35rem",background:"#f8fafc",border:"1px solid #cbd5e1",borderRadius:"6px",padding:"0.2rem 0.5rem",fontSize:"0.75rem",fontWeight:600,color:"#0284c7",cursor:"pointer"},title:"Klik untuk melihat daftar satker"`,
  `onClick:()=>openSatkerModal(row),style:{display:"inline-flex",alignItems:"center",gap:"0.35rem",background:"#f8fafc",border:"1px solid #cbd5e1",borderRadius:"6px",padding:"0.2rem 0.5rem",fontSize:"0.75rem",fontWeight:600,color:"#0284c7",cursor:"pointer"},title:"Klik untuk melihat daftar seluruh satker & tempus keterlibatan"`
);

// 5. Update "Total LP" column to pure Tag badge (not a button)
const oldTotalLpCol = `(0,a.jsx)(r.Column,{header:"Total LP",body:row=>(0,a.jsx)("button",{type:"button",onClick:()=>openLpModal(row),title:"Klik untuk melihat rincian LP",style:{background:"none",border:"none",padding:0,cursor:"pointer"},children:(0,a.jsxs)(n.Tag,{value:String(row.total_lp||row.jumlah_lp||0)+" LP",severity:"danger",style:{fontWeight:700,fontSize:"0.78rem",cursor:"pointer",padding:"0.25rem 0.55rem"},children:[(0,a.jsx)("i",{className:"pi pi-external-link",style:{marginLeft:"0.35rem",fontSize:"0.65rem"}})]})}),style:{width:"7rem",textAlign:"center"}})`;
const newTotalLpCol = `(0,a.jsx)(r.Column,{header:"Total LP",body:row=>(0,a.jsx)(n.Tag,{value:String(row.total_lp||row.jumlah_lp||0)+" LP",severity:"danger",style:{fontWeight:700,fontSize:"0.78rem",padding:"0.25rem 0.6rem"}}),style:{width:"6.5rem",textAlign:"center"}})`;
code = code.replace(oldTotalLpCol, newTotalLpCol);

// 6. Update "Aksi" column to have 2 distinct buttons: [📄 Rincian] and [🔍 Register]
const oldAksiCol = `(0,a.jsx)(r.Column,{header:"Aksi",body:row=>(0,a.jsxs)("button",{type:"button",onClick:()=>openLpModal(row),title:"Lihat Rincian Laporan Polisi",className:"att-btn primary",style:{padding:"0.25rem 0.55rem",fontSize:"0.75rem",display:"inline-flex",alignItems:"center",gap:"0.3rem",cursor:"pointer",fontWeight:600},children:[(0,a.jsx)("i",{className:"pi pi-file"}),(0,a.jsx)("span",{children:"Rincian LP"})]}),style:{width:"8rem",textAlign:"center"}})`;
const newAksiCol = `(0,a.jsx)(r.Column,{header:"Aksi",body:row=>{let qVal=encodeURIComponent(row.nik&&!String(row.nik).startsWith("KORP:")?row.nik:(row.nama||""));return (0,a.jsxs)("div",{style:{display:"inline-flex",alignItems:"center",gap:"0.35rem",justifyContent:"center"},children:[(0,a.jsxs)("button",{type:"button",onClick:()=>openLpModal(row),title:"Lihat Rincian Laporan Polisi & Tempus",className:"att-btn primary",style:{padding:"0.25rem 0.5rem",fontSize:"0.74rem",display:"inline-flex",alignItems:"center",gap:"0.25rem",cursor:"pointer",fontWeight:600},children:[(0,a.jsx)("i",{className:"pi pi-file-o",style:{fontSize:"0.72rem"}}),(0,a.jsx)("span",{children:"Rincian"})]}),(0,a.jsxs)("button",{type:"button",onClick:()=>window.open("/cms/laporan/rekap-pihak-terlibat?search="+qVal+"&scope=national","_blank"),title:"Buka di Register Pihak Terlibat",className:"att-btn",style:{padding:"0.25rem 0.5rem",fontSize:"0.74rem",display:"inline-flex",alignItems:"center",gap:"0.25rem",cursor:"pointer",fontWeight:600,color:"#0284c7"},children:[(0,a.jsx)("i",{className:"pi pi-search",style:{fontSize:"0.72rem"}}),(0,a.jsx)("span",{children:"Register"})]})]});},style:{width:"11.5rem",textAlign:"center"}})`;
code = code.replace(oldAksiCol, newAksiCol);

// 7. Update satkerModalParty JSX with the full all-time satker breakdown + tempus
const oldSatkerModal = `satkerModalParty?(0,a.jsx)("div",{style:{position:"fixed",top:0,left:0,right:0,bottom:0,backgroundColor:"rgba(15,23,42,0.6)",backdropFilter:"blur(2px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,padding:"1rem"},onClick:()=>setSatkerModalParty(null),children:(0,a.jsxs)("div",{style:{backgroundColor:"#ffffff",borderRadius:"12px",boxShadow:"0 20px 25px -5px rgba(0,0,0,0.2)",width:"100%",maxWidth:"36rem",maxHeight:"85vh",display:"flex",flexDirection:"column",overflow:"hidden"},onClick:ev=>ev.stopPropagation(),children:[(0,a.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"1rem 1.25rem",borderBottom:"1px solid #e2e8f0",background:"#f8fafc"},children:[(0,a.jsxs)("div",{children:[(0,a.jsx)("div",{style:{fontWeight:700,fontSize:"1.05rem",color:"#0f172a"},children:"Daftar Satker Terkait"}),(0,a.jsxs)("div",{style:{fontSize:"0.8rem",color:"#64748b",marginTop:"0.15rem"},children:[satkerModalParty.nama||"Tanpa Nama"," (",satkerModalParty.nik?.startsWith("KORP:")?"Badan Hukum / Korporasi":("NIK: "+(satkerModalParty.nik||"—")),")"]})]}),(0,a.jsx)("button",{type:"button",onClick:()=>setSatkerModalParty(null),style:{background:"none",border:"none",fontSize:"1.25rem",cursor:"pointer",color:"#64748b",padding:"0.25rem 0.5rem"},children:"✕"})]}),(0,a.jsxs)("div",{style:{padding:"1.25rem",overflowY:"auto",maxHeight:"60vh"},children:[(0,a.jsxs)("div",{style:{marginBottom:"0.75rem",fontSize:"0.85rem",fontWeight:600,color:"#334155",display:"flex",alignItems:"center",gap:"0.5rem"},children:[(0,a.jsx)("i",{className:"pi pi-building",style:{color:"#0284c7"}}),(0,a.jsx)("span",{children:"Tercatat pada "+(satkerModalParty.jumlah_satker_unik||(satkerModalParty.daftar_satker?satkerModalParty.daftar_satker.split(",").length:1))+" Satuan Kerja:"})]}),(0,a.jsx)("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:(satkerModalParty.daftar_satker||satkerModalParty.satker_nama||"Mabes Polri").split(",").map((stk,idx)=>(0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.6rem",padding:"0.5rem 0.75rem",background:"#f1f5f9",borderRadius:"6px",border:"1px solid #e2e8f0"},children:[(0,a.jsx)("span",{style:{background:"#0284c7",color:"#ffffff",width:"1.4rem",height:"1.4rem",borderRadius:"50%",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:"0.7rem",fontWeight:700,flexShrink:0},children:idx+1}),(0,a.jsx)("span",{style:{fontWeight:600,fontSize:"0.82rem",color:"#1e293b"},children:stk.trim()})]},idx))})]}),(0,a.jsx)("div",{style:{padding:"0.75rem 1.25rem",borderTop:"1px solid #e2e8f0",display:"flex",justifyContent:"flex-end",background:"#f8fafc"},children:(0,a.jsx)("button",{type:"button",onClick:()=>setSatkerModalParty(null),className:"att-btn",children:"Tutup"})})]})}):null`;

const newSatkerModal = `satkerModalParty?(0,a.jsx)("div",{style:{position:"fixed",top:0,left:0,right:0,bottom:0,backgroundColor:"rgba(15,23,42,0.6)",backdropFilter:"blur(2px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,padding:"1rem"},onClick:()=>setSatkerModalParty(null),children:(0,a.jsxs)("div",{style:{backgroundColor:"#ffffff",borderRadius:"12px",boxShadow:"0 20px 25px -5px rgba(0,0,0,0.2)",width:"100%",maxWidth:"44rem",maxHeight:"88vh",display:"flex",flexDirection:"column",overflow:"hidden"},onClick:ev=>ev.stopPropagation(),children:[
  (0,a.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"1rem 1.25rem",borderBottom:"1px solid #e2e8f0",background:"#f8fafc"},children:[
    (0,a.jsxs)("div",{children:[
      (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[
        (0,a.jsx)("div",{style:{fontWeight:700,fontSize:"1.05rem",color:"#0f172a"},children:"Daftar Satker Terkait & Tempus"}),
        satkerModalParty.is_lintas_wilayah?(0,a.jsx)(n.Tag,{value:"Lintas Wilayah ("+(satkerModalParty.jumlah_polda_unik||2)+" Polda)",severity:"warning",style:{fontSize:"0.7rem",padding:"0.15rem 0.45rem"}}):(0,a.jsx)(n.Tag,{value:"Satu Wilayah",severity:"info",style:{fontSize:"0.7rem",padding:"0.15rem 0.45rem"}})
      ]}),
      (0,a.jsxs)("div",{style:{fontSize:"0.8rem",color:"#64748b",marginTop:"0.15rem"},children:[satkerModalParty.nama||"Tanpa Nama"," (",satkerModalParty.nik?.startsWith("KORP:")?"Badan Hukum / Korporasi":("NIK: "+(satkerModalParty.nik||"—")),")"]})
    ]}),
    (0,a.jsx)("button",{type:"button",onClick:()=>setSatkerModalParty(null),style:{background:"none",border:"none",fontSize:"1.25rem",cursor:"pointer",color:"#64748b",padding:"0.25rem 0.5rem"},children:"✕"})
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

    return (0,a.jsxs)("div",{style:{padding:"1.25rem",overflowY:"auto",maxHeight:"65vh",display:"flex",flexDirection:"column",gap:"0.75rem"},children:[
      (0,a.jsxs)("div",{style:{fontSize:"0.85rem",fontWeight:600,color:"#334155",display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.25rem"},children:[
        (0,a.jsx)("i",{className:"pi pi-building",style:{color:"#0284c7"}}),
        (0,a.jsxs)("span",{children:["Tercatat pada ",(0,a.jsx)("strong",{style:{color:"#0f172a"},children:totalUnik})," Satuan Kerja (Total ",(0,a.jsx)("strong",{style:{color:"#b91c1c"},children:totalLpAll})," LP All-Time):"]})
      ]}),
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
          (0,a.jsx)("div",{style:{padding:"0.5rem 0.85rem",display:"flex",flexDirection:"column",gap:"0.45rem",background:"#ffffff"},children:
            g.lps.map((lp,lIdx)=>(
              (0,a.jsxs)("div",{style:{padding:"0.4rem 0.6rem",background:"#f8fafc",borderRadius:"6px",border:"1px solid #f1f5f9",fontSize:"0.76rem",display:"flex",flexDirection:"column",gap:"0.2rem"},children:[
                (0,a.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap"},children:[
                  lp.lp_id?(0,a.jsxs)("a",{href:"/cms/laporan-polisi/"+lp.lp_id,target:"_blank",rel:"noopener noreferrer",style:{fontWeight:700,color:"#0284c7",textDecoration:"none",display:"inline-flex",alignItems:"center",gap:"0.25rem"},children:[lp.no_laporan||"LP Tanpa Nomor",(0,a.jsx)("i",{className:"pi pi-external-link",style:{fontSize:"0.65rem"}})]}):(0,a.jsx)("span",{style:{fontWeight:700,color:"#0f172a"},children:lp.no_laporan||"LP Tanpa Nomor"}),
                  (0,a.jsxs)("div",{style:{color:"#64748b",fontSize:"0.72rem"},children:["Tgl LP: ",(0,a.jsx)("strong",{style:{color:"#334155"},children:lp.tgl_laporan||"—"})]})
                ]}),
                (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.35rem",color:"#b45309",background:"#fffbeb",padding:"0.2rem 0.4rem",borderRadius:"4px",border:"1px solid #fde68a"},children:[
                  (0,a.jsx)("i",{className:"pi pi-calendar-clock",style:{fontSize:"0.75rem"}}),
                  (0,a.jsxs)("span",{children:[(0,a.jsx)("strong",{children:"Tempus Kejadian: "}),lp.waktu_kejadian||"—"]})
                ]}),
                lp.kejahatan&&lp.kejahatan!=="—"?(0,a.jsxs)("div",{style:{color:"#475569",fontSize:"0.72rem"},children:["Kejahatan: ",lp.kejahatan]}):null
              ]},lIdx)
            ))
          })
        ]},sIdx)
      )):((satkerModalParty.daftar_satker||satkerModalParty.satker_nama||"Mabes Polri").split(",").map((stk,idx)=>(0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.6rem",padding:"0.5rem 0.75rem",background:"#f1f5f9",borderRadius:"6px",border:"1px solid #e2e8f0"},children:[(0,a.jsx)("span",{style:{background:"#0284c7",color:"#ffffff",width:"1.4rem",height:"1.4rem",borderRadius:"50%",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:"0.7rem",fontWeight:700,flexShrink:0},children:idx+1}),(0,a.jsx)("span",{style:{fontWeight:600,fontSize:"0.82rem",color:"#1e293b"},children:stk.trim()})]},idx)))
    ]});
  })(),
  (0,a.jsxs)("div",{style:{padding:"0.75rem 1.25rem",borderTop:"1px solid #e2e8f0",display:"flex",justifyContent:"space-between",alignItems:"center",background:"#f8fafc",flexWrap:"wrap",gap:"0.5rem"},children:[
    (0,a.jsxs)("button",{type:"button",onClick:()=>{let qVal=encodeURIComponent(satkerModalParty?.nik&&!String(satkerModalParty.nik).startsWith("KORP:")?satkerModalParty.nik:(satkerModalParty?.nama||""));window.open("/cms/laporan/rekap-pihak-terlibat?search="+qVal+"&scope=national","_blank");},className:"att-btn",style:{display:"inline-flex",alignItems:"center",gap:"0.4rem",fontSize:"0.78rem",fontWeight:600,color:"#0284c7"},children:[(0,a.jsx)("i",{className:"pi pi-search"}),(0,a.jsx)("span",{children:"Buka di Register Pihak Terlibat"})]}),
    (0,a.jsx)("button",{type:"button",onClick:()=>setSatkerModalParty(null),className:"att-btn primary",children:"Tutup"})
  ]})
]})}):null`;

code = code.replace(oldSatkerModal, newSatkerModal);

// 8. In lpModalParty DataTable, add "Tempus Kejadian" column
const oldLpColKejahatan = `(0,a.jsx)(r.Column,{field:"kejahatan",header:"Kejahatan",body:row=>row.kejahatan||"—",style:{minWidth:"10rem"}}),`;
const newLpColKejahatan = `(0,a.jsx)(r.Column,{field:"kejahatan",header:"Kejahatan",body:row=>row.kejahatan||"—",style:{minWidth:"10rem"}}),(0,a.jsx)(r.Column,{header:"Tempus Kejadian",body:row=>(0,a.jsxs)("div",{children:[(0,a.jsx)("div",{style:{fontWeight:600,fontSize:"0.78rem",color:"#1e293b"},children:row.waktu_kejadian||"—"}),row.tempat_kejadian&&row.tempat_kejadian!=="—"?(0,a.jsx)("div",{style:{fontSize:"0.7rem",color:"#64748b",marginTop:"0.15rem"},children:row.tempat_kejadian}):null]}),style:{minWidth:"12rem"}}),`;
code = code.replace(oldLpColKejahatan, newLpColKejahatan);

fs.writeFileSync(filePath, code, 'utf8');
console.log('Successfully patched register-pihak-v5-6478da3b8c2c.js!');
