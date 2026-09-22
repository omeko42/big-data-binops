1",{className:"cms-page-title",children:"Laporan Polisi"}),(0,t.jsx)("p",{className:"cms-page-sub",children:"LP dari DORS yang sudah termapping ke satker — siap untuk aktivitas berikutnya."})]}),eBulkAllowed&&(0,t.jsxs)("div",{style:{display:"flex",gap:"0.5rem",alignItems:"center",marginTop:"0.25rem",flexWrap:"wrap"},children:[(0,t.jsx)(o.Button,{label:"Update Status Massal",icon:"pi pi-pencil",onClick:bulkShow,className:"att-btn"}),eG.isSuperadmin&&(0,t.jsxs)(o.Button,{onClick:e0,loading:el,className:"att-btn",outlined:!0,children:[(0,t.jsx)(h.RefreshCw,{size:16,style:{marginRight:"0.4rem"}})," ",el?"Memetakan…":"Petakan LP Terbaru"]})]})]}),(0,t.jsxs)("div",{className:"lp-status-cards",children:[(0,t.jsxs)("button",{type:"button",className:`lp-stat total${""===eu?" active":""}`,onClick:()=>{ec(""),ex(0),eSetAP({level:eo,status:"",model:ed,from:em,to:eg,search:eh.trim(),functionDomain:eFD,jenisKejahatanIds:eCrime||"",targetSatkerId:eTargetSatker?.id?String(eTargetSatker.id):""})},children:[(0,t.jsx)("div",{className:"n",children:(ea?.total??0).toLocaleString("id-ID")}),(0,t.jsx)("div",{className:"l",children:"Semua LP"})]}),(ea?.per_status||[]).map(e=>{let n;return(0,t.jsxs)("button",{type:"button",className:`lp-stat ${"CC"===e.kategori?"cc":"ct"}${eu===e.code?" active":""}`,onClick:()=>{let t=eu===e.code?"":e.code;ec(t),ex(0),eSetAP({level:eo,status:t,model:ed,from:em,to:eg,search:eh.trim(),functionDomain:eFD,jenisKejahatanIds:eCrime||"",targetSatkerId:eTargetSatker?.id?String(eTargetSatker.id):""})},title:e.nama,children:[(0,t.jsx)("div",{className:"n",children:e.jumlah.toLocaleString("id-ID")}),(0,t.jsx)("div",{className:"l",children:"PERMA"===e.code?"PERMA":G[n=e.code]||n.replace(/_/g," ")})]},e.code)})]}),(0,t.jsxs)("div",{className:"cms-card",style:{padding:0,overflow:(mainPeriodOpen||satkerOpen||crimeOpen)?"visible":"hidden"},children:[(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.6rem",flexWrap:"wrap",padding:"0.75rem 1rem"},children:[(0,t.jsx)(i.Dropdown,{value:ed,options:[{label:"Semua model",value:""},{label:"LP Model A",value:"lp_model_a"},{label:"LP Model B",value:"lp_model_b"}],onChange:e=>{ep(e.value)},placeholder:"Semua model",style:{minWidth:"11rem"}}),(0,t.jsx)(i.Dropdown,{value:eFD,options:[{label:"Semua cakupan",value:""},{label:"Internal Reserse",value:"INTERNAL_RESERSE"},{label:"Eksternal Reserse / Non-Reserse",value:"EKSTERNAL_RESERSE"},{label:"Eksternal Polri",value:"EKSTERNAL_POLRI"}],onChange:e=>{eSetFD(e.value)},placeholder:"Semua cakupan",style:{minWidth:"14rem"}}),
(0,t.jsx)(i.Dropdown,{value:eu,options:e4,onChange:e=>{ec(e.value)},placeholder:"Semua status",style:{minWidth:"11rem"}}),
(()=>{let u=(0,E.getUser)();let r=String(u?.role_bdb||u?.role_name||"").toLowerCase();return !eV&&r==="operator"})()?(0,t.jsx)("div",{style:{position:"relative",flex:"0 0 auto"},children:(0,t.jsx)(o.Button,{label:(()=>{let u=(0,E.getUser)();let sName=u?.satker_nama||u?.satker?.deskripsi||u?.organisasi?.deskripsi||"Satker Anda";return "Satker: "+(sName.length>22?sName.slice(0,20)+"…":sName)})(),icon:"pi pi-building",outlined:!0,disabled:!0,style:{minWidth:"12rem",justifyContent:"flex-start",whiteSpace:"nowrap",background:"#f8fafc",borderColor:"#cbd5e1",color:"#334155",cursor:"default",opacity:0.95}})}):(0,t.jsxs)("div",{
    style:{position:"relative",flex:"0 0 auto"},
    children:[
        (0,t.jsx)(o.Button,{
            label:(()=>{
                if(eTargetSatker){let d=eTargetSatker.deskripsi||eTargetSatker.name||"";return "Supervisi: "+(d.length>22?d.slice(0,20)+"…":d);}
                if(eo)return "Satker: "+eo;let u=(0,E.getUser)();let sName=u?.satker_nama||u?.satker?.deskripsi||u?.organisasi?.deskripsi;if(sName&&!eV)return "Satker: "+(sName.length>22?sName.slice(0,20)+"…":sName);
                return "Semua Satker";
            })(),
            icon:"pi pi-building",
            outlined:!0,
            onClick:openSatkerModal,
            style:{minWidth:"12rem",justifyContent:"flex-start",whiteSpace:"nowrap"}
        }),
        satkerOpen&&(0,t.jsx)("div",{style:{position:"fixed",inset:0,zIndex:99},onClick:()=>setSatkerOpen(!1)}),
        satkerOpen&&(0,t.jsxs)("div",{
            className:"lp-satker-popover",
            style:{
                position:"absolute",
                left:0,
                top:"calc(100% + 0.45rem)",
                zIndex:100,
                width:"32rem",
                maxWidth:"calc(100vw - 2rem)",
                background:"#fff",
                border:"1px solid #dbe3ee",
                borderRadius:10,
                boxShadow:"0 14px 36px rgba(15,23,42,.16)",
                padding:"0.85rem"
            },
            children:[
                (0,t.jsxs)("div",{
                    style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.6rem"},
                    children:[
                        (0,t.jsx)("div",{style:{fontWeight:800,color:"#0f172a",fontSize:"0.95rem"},children:"Pilih Satker / Tingkat"}),
                        (0,t.jsx)("button",{type:"button",onClick:()=>setSatkerOpen(!1),style:{background:"none",border:"none",cursor:"pointer",color:"#64748b",fontSize:"1.1rem",lineHeight:1,padding:"0.2rem"},children:"×"})
                    ]
                }),
                (0,t.jsxs)("div",{
                    style:{marginBottom:"0.75rem",background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:8,padding:"0.6rem"},
                    children:[
                        (0,t.jsxs)("div",{
                            style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.4rem"},
                            children:[
                                (0,t.jsx)("span",{style:{fontSize:"0.75rem",fontWeight:700,color:"#475569",textTransform:"uppercase",letterSpacing:"0.03em"},children:"Tingkat Penanganan"}),
                                (0,t.jsxs)("div",{style:{display:"flex",gap:"0.4rem"},children:[
                                    (0,t.jsx)("button",{type:"button",onClick:()=>setSatkerLevels(["Mabes","Polda","Polres","Polsek"]),style:{background:"none",border:"none",color:"#2563eb",fontSize:"0.7rem",cursor:"pointer",padding:0,textDecoration:"underline"},children:"Pilih Semua"}),
                                    (0,t.jsx)("span",{style:{color:"#cbd5e1",fontSize:"0.7rem"},children:"|"}),
                                    (0,t.jsx)("button",{type:"button",onClick:()=>setSatkerLevels([]),style:{background:"none",border:"none",color:"#64748b",fontSize:"0.7rem",cursor:"pointer",padding:0,textDecoration:"underline"},children:"Kosongkan"})
                                ]})
                            ]
                        }),
                        (0,t.jsx)("div",{
                            style:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"0.4rem"},
                            children:[
                                {name:"Mabes",count:e1.Mabes??0},
              