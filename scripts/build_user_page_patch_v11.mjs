import fs from 'fs';

let content = fs.readFileSync('clean_user_page.js', 'utf8');

console.log('Original clean_user_page length:', content.length);

// 1. Add state variables for satker modal picker
const stateTarget = `[es,er]=(0,s.useState)(Y),`;
const stateAdd = `[es,er]=(0,s.useState)(Y),[showSatkerModal,setShowSatkerModal]=(0,s.useState)(!1),[satkerModalTarget,setSatkerModalTarget]=(0,s.useState)("user"),[satkerLevelOptions,setSatkerLevelOptions]=(0,s.useState)([]),[satkerLevelSelected,setSatkerLevelSelected]=(0,s.useState)([]),[satkerLoading,setSatkerLoading]=(0,s.useState)(!1),[satkerFetchError,setSatkerFetchError]=(0,s.useState)(""),`;

if (!content.includes(stateTarget)) {
  console.error('stateTarget not found');
  process.exit(1);
}
content = content.replace(stateTarget, stateAdd);

// 2. Add Satker helper functions
const funcTarget = `function ak(e,a){er(s=>({...s,[e]:a}))}`;
const satkerHelpers = `function ak(e,a){er(s=>({...s,[e]:a}))}
const fetchSatkerChildren=async(parentId)=>{
  try{
    let res=await L.apiAuth.get("/bdb/satker/children",{params:{parentId}});
    return res.data?.data||[];
  }catch(err){
    console.error("fetchSatkerChildren err:",err);
    return[];
  }
};
const openSatkerPicker=async(target)=>{
  setSatkerModalTarget(target);
  setShowSatkerModal(!0);
  setSatkerLoading(!0);
  setSatkerFetchError("");
  setSatkerLevelOptions([]);
  setSatkerLevelSelected([]);
  try{
    let rootsRes=await L.apiAuth.get("/bdb/satker/roots");
    let rootItem=(rootsRes.data?.data||[])[0]||null;
    if(!rootItem){
      setSatkerFetchError("Gagal memuat data satker induk (root).");
      setSatkerLoading(!1);
      return;
    }
    let lvl0Children=await fetchSatkerChildren(rootItem.id);
    let curId=target==="user"?es.scope_satker_id:mutData.to_satker_id;
    if(curId){
      try{
        let pathRes=await L.apiAuth.get("/bdb/satker/path",{params:{id:curId}});
        let pathIds=(pathRes.data?.data||[]).map(Number).slice(1);
        let curOpts=[lvl0Children];
        let curSel=[];
        let running=lvl0Children;
        for(let stepId of pathIds){
          let match=running.find(c=>Number(c.id)===stepId);
          if(!match)break;
          curSel.push(match);
          if(match.has_children){
            running=await fetchSatkerChildren(match.id);
            curOpts.push(running);
          }else{
            running=[];
          }
        }
        setSatkerLevelOptions(curOpts.length?curOpts:[lvl0Children]);
        setSatkerLevelSelected(curSel);
      }catch{
        setSatkerLevelOptions([lvl0Children]);
        setSatkerLevelSelected([]);
      }
    }else{
      setSatkerLevelOptions([lvl0Children]);
      setSatkerLevelSelected([]);
    }
  }catch(err){
    setSatkerFetchError("Gagal memuat hierarki satker dari server.");
  }finally{
    setSatkerLoading(!1);
  }
};
const onSatkerLevelChange=async(lvlIdx,selectedId)=>{
  if(!selectedId){
    setSatkerLevelSelected(prev=>prev.slice(0,lvlIdx));
    setSatkerLevelOptions(prev=>prev.slice(0,lvlIdx+1));
    return;
  }
  let curOpts=satkerLevelOptions[lvlIdx]||[];
  let chosen=curOpts.find(item=>item.id===selectedId)||null;
  if(!chosen)return;
  let nextSel=[...satkerLevelSelected.slice(0,lvlIdx),chosen];
  let nextOpts=[...satkerLevelOptions.slice(0,lvlIdx+1)];
  setSatkerLevelSelected(nextSel);
  if(chosen.has_children){
    setSatkerLoading(!0);
    let ch=await fetchSatkerChildren(chosen.id);
    setSatkerLoading(!1);
    if(ch.length>0)nextOpts.push(ch);
  }
  setSatkerLevelOptions(nextOpts);
};
const applySelectedSatker=()=>{
  if(satkerLevelSelected.length===0)return;
  let deepest=satkerLevelSelected[satkerLevelSelected.length-1];
  if(satkerModalTarget==="user"){
    er(prev=>({
      ...prev,
      scope_satker_id:Number(deepest.id),
      scope_satker_name:deepest.deskripsi||prev.scope_satker_name,
      scope_satker_key:deepest.kode||prev.scope_satker_key||""
    }));
  }else if(satkerModalTarget==="mutasi"){
    setMutData(prev=>({
      ...prev,
      to_satker_id:Number(deepest.id),
      to_satker_name:deepest.deskripsi||prev.to_satker_name,
      to_satker_key:deepest.kode||prev.to_satker_key||""
    }));
  }
  setShowSatkerModal(!1);
};`;

if (!content.includes(funcTarget)) {
  console.error('funcTarget not found');
  process.exit(1);
}
content = content.replace(funcTarget, satkerHelpers);

// 3. Two-way validation on email_polri and username in Tambah/Edit form
const oldEmailPolri = `(0,a.jsxs)(ee,{id:"fld-user-page-paginati-13",name:"field_user_page_paginati_13",label:"Email Dinas Polri (Utama)",required:!0,hint:"wajib @polri.go.id, login & OTP",children:[(0,a.jsx)(W.default,{id:"user-form-email-polri",name:"email_polri",autoComplete:"email",value:es.email_polri,onChange:e=>{ak("email_polri",e),el.onChangeDebounced("email_polri",e)},onBlur:e=>el.onBlurNow("email_polri",e),status:el.status.email_polri,placeholder:"nrp@polri.go.id atau nip@polri.go.id"}),el.message.email_polri&&(0,a.jsx)("small",{className:"bdb-error",children:el.message.email_polri})]}),`;

const newEmailPolri = `(()=>{
  let isIdentical=es.username&&es.email_polri&&es.username.trim().toLowerCase()===es.email_polri.trim().toLowerCase();
  return (0,a.jsxs)(ee,{id:"fld-user-page-paginati-13",name:"field_user_page_paginati_13",label:"Email Dinas Polri (Utama)",required:!0,hint:"wajib @polri.go.id, login & OTP",children:[
    (0,a.jsx)(W.default,{id:"user-form-email-polri",name:"email_polri",autoComplete:"email",value:es.email_polri,onChange:e=>{ak("email_polri",e),el.onChangeDebounced("email_polri",e)},onBlur:e=>el.onBlurNow("email_polri",e),status:isIdentical?"error":el.status.email_polri,placeholder:"nrp@polri.go.id atau nip@polri.go.id"}),
    isIdentical?(0,a.jsx)("small",{className:"bdb-error",style:{color:"#ef4444",fontWeight:600},children:"Email Dinas Polri tidak boleh sama dengan Username!"}):el.message.email_polri&&(0,a.jsx)("small",{className:"bdb-error",children:el.message.email_polri})
  ]});
})(),`;

if (!content.includes(oldEmailPolri)) {
  console.error('oldEmailPolri not found');
  process.exit(1);
}
content = content.replace(oldEmailPolri, newEmailPolri);

// 4. In form footer, disable submit if isIdentical:
const oldFooterBtn = `(0,a.jsx)(o.Button,{label:e9?"Simpan":"Tambah",icon:"pi pi-check",onClick:ay,loading:ei})`;
const newFooterBtn = `(()=>{
  let isIdentical=es.username&&es.email_polri&&es.username.trim().toLowerCase()===es.email_polri.trim().toLowerCase();
  return (0,a.jsx)(o.Button,{label:e9?"Simpan":"Tambah",icon:"pi pi-check",onClick:ay,loading:ei,disabled:ei||isIdentical});
})()`;

if (!content.includes(oldFooterBtn)) {
  console.error('oldFooterBtn not found');
  process.exit(1);
}
content = content.replace(oldFooterBtn, newFooterBtn);

// 5. Replace stacked Satker cascading component in Tambah/Edit form:
const oldSatkerForm = `ae?(0,a.jsx)(ee,{id:"fld-user-page-paginati-15",name:"field_user_page_paginati_15",htmlFor:"fld-user-satker-0-select",label:"Satker Melekat",hint:ed.isOperator?"pilih satker sendiri atau subordinat regional":"pilih berjenjang",children:(0,a.jsx)(F.default,{key:es.id?\`user-satker-\${es.id}\`:"user-satker-new",initialId:es.scope_satker_id?Number(es.scope_satker_id):null,onSelect:e=>{er(a=>({...a,scope_satker_id:e?Number(e.id):null,scope_satker_key:e?(e.kode||a.scope_satker_key):(a.scope_satker_key||""),scope_satker_name:e?(e.deskripsi||a.scope_satker_name):(a.scope_satker_name||"")}))}})}):(0,a.jsx)("p",{style:{fontSize:"0.78rem",color:"#94a3b8",margin:0},children:"Superadmin: akses nasional (tanpa satker melekat)."})`;

const newSatkerForm = `ae?(0,a.jsxs)(ee,{id:"fld-user-page-paginati-15",name:"field_user_page_paginati_15",label:"Satker Melekat",hint:ed.isOperator?"pilih satker sendiri atau subordinat regional":"pilih berjenjang",children:[
  (0,a.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.45rem",background:"rgba(255,255,255,0.03)",padding:"0.65rem 0.8rem",borderRadius:"8px",border:"1px solid rgba(255,255,255,0.08)"},children:[
    (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"0.5rem"},children:[
      (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.45rem",minWidth:0,flex:1},children:[
        (0,a.jsx)(P.Building2,{size:16,style:{color:"#38bdf8",flexShrink:0}}),
        (0,a.jsx)("div",{style:{fontSize:"0.84rem",fontWeight:600,color:es.scope_satker_name?"#f8fafc":"#94a3b8",wordBreak:"break-word"},children:es.scope_satker_name||"— Belum Memilih Satker —"})
      ]}),
      (0,a.jsxs)("div",{style:{display:"flex",gap:"0.35rem",flexShrink:0},children:[
        (0,a.jsx)(o.Button,{type:"button",label:es.scope_satker_id?"Ubah Satker":"Pilih Satker Berjenjang",icon:"pi pi-sitemap",className:"p-button-sm p-button-outlined",onClick:()=>openSatkerPicker("user"),style:{fontSize:"0.75rem",padding:"0.3rem 0.6rem"}}),
        es.scope_satker_id&&(0,a.jsx)(o.Button,{type:"button",icon:"pi pi-times",className:"p-button-sm p-button-text p-button-danger",onClick:()=>er(a=>({...a,scope_satker_id:null,scope_satker_name:"",scope_satker_key:""})),tooltip:"Hapus Satker",style:{padding:"0.3rem"}})
      ]})
    ]}),
    es.scope_satker_key&&(0,a.jsxs)("div",{style:{fontSize:"0.72rem",color:"#64748b",fontFamily:"monospace"},children:["Kode: ",es.scope_satker_key]})
  ]})
]}):(0,a.jsx)("p",{style:{fontSize:"0.78rem",color:"#94a3b8",margin:0},children:"Superadmin: akses nasional (tanpa satker melekat)."})`;

if (!content.includes(oldSatkerForm)) {
  console.error('oldSatkerForm not found');
  process.exit(1);
}
content = content.replace(oldSatkerForm, newSatkerForm);

// 6. Replace Mutasi Satker cascading component:
const oldMutSatker = `satuan kerja baru",
                    children:(0,a.jsx)(F.default,{
                        key:\`mut-satker-\${mutUser.id}\`,
                        initialId:mutData.to_satker_id?Number(mutData.to_satker_id):null,
                        onSelect:(e)=>{
                            setMutData(prev=>({
                                ...prev,
                                to_satker_id:e?Number(e.id):null,
                                to_satker_key:e?(e.kode||prev.to_satker_key):"",
                                to_satker_name:e?(e.deskripsi||prev.to_satker_name):""
                            }));
                        }
                    })
                })`;

const newMutSatker = `satuan kerja baru",
                    children:(0,a.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.45rem",background:"rgba(255,255,255,0.03)",padding:"0.65rem 0.8rem",borderRadius:"8px",border:"1px solid rgba(255,255,255,0.08)"},children:[
                        (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"0.5rem"},children:[
                            (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.45rem",minWidth:0,flex:1},children:[
                                (0,a.jsx)(P.Building2,{size:16,style:{color:"#38bdf8",flexShrink:0}}),
                                (0,a.jsx)("div",{style:{fontSize:"0.84rem",fontWeight:600,color:mutData.to_satker_name?"#f8fafc":"#94a3b8",wordBreak:"break-word"},children:mutData.to_satker_name||"— Belum Memilih Satker Tujuan —"})
                            ]}),
                            (0,a.jsx)(o.Button,{type:"button",label:mutData.to_satker_id?"Ubah Satker":"Pilih Satker Berjenjang",icon:"pi pi-sitemap",className:"p-button-sm p-button-outlined",onClick:()=>openSatkerPicker("mutasi"),style:{fontSize:"0.75rem",padding:"0.3rem 0.6rem"}})
                        ]}),
                        mutData.to_satker_key&&(0,a.jsxs)("div",{style:{fontSize:"0.72rem",color:"#64748b",fontFamily:"monospace"},children:["Kode: ",mutData.to_satker_key]})
                    ]})
                })`;

if (!content.includes(oldMutSatker)) {
  console.error('oldMutSatker not found');
  process.exit(1);
}
content = content.replace(oldMutSatker, newMutSatker);

// 7. Insert the dedicated Satker Modal Dialog right before the main Dialog:
const targetDialog = `(0,a.jsx)(d.Dialog,{header:e9?"Edit Pengguna":"Tambah Pengguna"`;

const satkerModalDialog = `(0,a.jsx)(d.Dialog,{
  header:"Pilih Satker Berjenjang",
  visible:showSatkerModal,
  onHide:()=>setShowSatkerModal(!1),
  style:{width:"32rem",maxWidth:"95vw"},
  modal:!0,
  baseZIndex:3000,
  footer:(0,a.jsxs)("div",{children:[
    (0,a.jsx)(o.Button,{label:"Batal",text:!0,onClick:()=>setShowSatkerModal(!1),disabled:satkerLoading}),
    (0,a.jsx)(o.Button,{label:"Terapkan Satker",icon:"pi pi-check",onClick:applySelectedSatker,disabled:satkerLevelSelected.length===0||satkerLoading})
  ]}),
  children:(0,a.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.9rem"},children:[
    (0,a.jsx)("p",{style:{fontSize:"0.78rem",color:"#94a3b8",margin:0},children:"Pilih satuan kerja secara berjenjang dari tingkat Polda/Mabes hingga satuan kerja tujuan."}),
    satkerFetchError&&(0,a.jsx)("div",{style:{color:"#ef4444",fontSize:"0.78rem",background:"rgba(239,68,68,0.1)",padding:"0.4rem 0.6rem",borderRadius:6,border:"1px solid rgba(239,68,68,0.25)"},children:satkerFetchError}),
    satkerLoading&&(0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem",fontSize:"0.78rem",color:"#38bdf8"},children:[(0,a.jsx)("i",{className:"pi pi-spin pi-spinner"}),"Memuat daftar satuan kerja..."]}),
    satkerLevelOptions.map((opts,idx)=>{
      let lvlLabels=["Tingkat 1: Mabes / Polda","Tingkat 2: Direktorat / Satuan / Polres","Tingkat 3: Sub-satker / Polsek / Bagian","Tingkat 4: Sub-unit"];
      return (0,a.jsxs)("div",{key:\`satker-lvl-\${idx}\`,style:{display:"flex",flexDirection:"column",gap:"0.3rem"},children:[
        (0,a.jsx)("label",{style:{fontSize:"0.76rem",fontWeight:600,color:"#cbd5e1"},children:lvlLabels[idx]||lvlLabels[3]}),
        (0,a.jsx)(u.Dropdown,{
          value:satkerLevelSelected[idx]?.id??null,
          onChange:e=>onSatkerLevelChange(idx,e.value),
          options:opts,
          optionLabel:"deskripsi",
          optionValue:"id",
          filter:!0,
          showClear:!0,
          placeholder:\`— Pilih \${lvlLabels[idx]||"Satker"} —\`,
          emptyMessage:"Tidak ada pilihan satuan kerja",
          style:{width:"100%"},
          itemTemplate:e=>(0,a.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",gap:"0.5rem",width:"100%"},children:[
            (0,a.jsx)("span",{children:e.deskripsi}),
            e.kode&&(0,a.jsx)("span",{style:{fontSize:"0.68rem",color:"#64748b",fontFamily:"monospace"},children:e.kode})
          ]})
        })
      ]});
    }),
    satkerLevelSelected.length>0&&(0,a.jsxs)("div",{style:{background:"rgba(37,99,235,0.08)",border:"1px solid rgba(59,130,246,0.25)",borderRadius:6,padding:"0.55rem 0.75rem",marginTop:"0.2rem"},children:[
      (0,a.jsx)("span",{style:{fontSize:"0.68rem",color:"#60a5fa",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px",display:"block",marginBottom:"0.25rem"},children:"Satker Terpilih (Jenjang Terakhir):"}),
      (0,a.jsx)("span",{style:{fontSize:"0.85rem",fontWeight:700,color:"#f8fafc"},children:satkerLevelSelected[satkerLevelSelected.length-1].deskripsi}),
      (0,a.jsxs)("div",{style:{fontSize:"0.72rem",color:"#94a3b8",marginTop:"0.25rem"},children:["Jalur: POLRI ",satkerLevelSelected.map(s=>" > "+s.deskripsi).join("")]})
    ]})
  ]})
}),`;

if (!content.includes(targetDialog)) {
  console.error('targetDialog not found');
  process.exit(1);
}

content = content.replace(targetDialog, `${satkerModalDialog}${targetDialog}`);

fs.writeFileSync('user-page-pagination-v9-dfbc949b.patched.js', content, 'utf8');
console.log('user-page-pagination-v9-dfbc949b.patched.js successfully generated with Satker Dialog!');
