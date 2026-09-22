ue)},placeholder:"Semua cakupan",style:{minWidth:"14rem"}}),
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
                                {name:"Polda",count:e1.Polda??0},
                                {name:"Polres",count:e1.Polres??0},
                                {name:"Polsek",count:e1.Polsek??0}
                            ].map(lvl=>{
                                let checked = satkerLevels.includes(lvl.name);
                                return (0,t.jsxs)("label",{
                                    key:lvl.name,
                                    style:{display:"flex",alignItems:"center",gap:"0.35rem",background:checked?"#eff6ff":"#fff",border:"1px solid "+(checked?"#3b82f6":"#cbd5e1"),borderRadius:6,padding:"0.35rem 0.45rem",cursor:"pointer",userSelect:"none"},
                                    children:[
                                        (0,t.jsx)("input",{type:"checkbox",checked:checked,onChange:()=>toggleSatkerLevel(lvl.name),style:{cursor:"pointer"}}),
                                        (0,t.jsxs)("div",{style:{lineHeight:1.15},children:[
                                            (0,t.jsx)("div",{style:{fontSize:"0.78rem",fontWeight:checked?700:500,color:checked?"#1d4ed8":"#1e293b"},children:lvl.name}),
                                            (0,t.jsx)("div",{style:{fontSize:"0.65rem",color:checked?"#3b82f6":"#64748b"},children:(lvl.count).toLocaleString("id-ID")})
                                        ]})
                                    ]
                                });
                            })
                        })
                    ]
                }),
                (0,t.jsxs)("div",{
                    style:{marginBottom:"0.75rem"},
                    children:[
                        (0,t.jsxs)("div",{
                            style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.35rem"},
                            children:[
                                (0,t.jsx)("span",{style:{fontSize:"0.75rem",fontWeight:700,color:"#475569",textTransform:"uppercase",letterSpacing:"0.03em"},children:"Satker Spesifik"}),
                                satkerDraftTarget&&(0,t.jsxs)("span",{style:{fontSize:"0.7rem",color:"#059669",background:"#ecfdf5",border:"1px solid #a7f3d0",borderRadius:4,padding:"0.1rem 0.35rem",display:"inline-flex",alignItems:"center",gap:"0.3rem"},children:[
                                    (0,t.jsx)("strong",{children:satkerDraftTarget.deskripsi}),
                                    (0,t.jsx)("button",{type:"button",onClick:()=>setSatkerDraftTarget(null),style:{background:"none",border:"none",color:"#059669",cursor:"pointer",fontWeight:700,padding:0,lineHeight:1},children:"×"})
                                ]})
                            ]
                        }),
                        (0,t.jsxs)("div",{
                            style:{position:"relative",marginBottom:"0.45rem"},
                            children:[
                                (0,t.jsx)(l.InputText,{
                                    value:satkerSearchQuery,
                                    onChange:e=>handleSatkerSearchInput(e.target.value),
                                    placeholder:"Ketik nama satker penanganan (contoh: METRO JAYA, TABANAN)…",
                                    style:{width:"100%",paddingRight:"2rem",fontSize:"0.82rem"}
                                }),
                                satkerSearchQuery&&(0,t.jsx)("button",{type:"button",onClick:()=>handleSatkerSearchInput(""),style:{position:"absolute",right:"0.5rem",top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#94a3b8",cursor:"pointer",fontSize:"1rem"},children:"×"})
                            ]
                        }),
                        (()=>{
                            let pool = satkerResults;
                            if (satkerLevels.length > 0 && satkerLevels.length < 4) {
                                let filtered = pool.filter(item => {
                                    let tipe = String(