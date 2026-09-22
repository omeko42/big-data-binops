background:"none",border:"none",color:"#64748b",fontSize:"0.7rem",cursor:"pointer",padding:0,textDecoration:"underline"},children:"Kosongkan"})
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
                                    let tipe = String(item.tipe_satker || "").toUpperCase();
                                    let desk = String(item.deskripsi || "").toUpperCase();
                                    return satkerLevels.some(lvl => {
                                        let l = lvl.toUpperCase();
                                        if (l === "MABES") return tipe.includes("MABES") || desk.includes("MABES") || desk.includes("BARESKRIM");
                                        if (l === "POLDA") return tipe.includes("POLDA") || desk.startsWith("POLDA");
                                        if (l === "POLRES") return tipe.includes("POLRES") || desk.startsWith("POLRES") || desk.startsWith("POLRESTA") || desk.startsWith("POLRESTABES");
                                        if (l === "POLSEK") return tipe.includes("POLSEK") || desk.startsWith("POLSEK");
                                        return false;
                                    });
                                });
                                if (filtered.length > 0) pool = filtered;
                            }
                            let pageSize = 5;
                            let total = pool.length;
                            let totalPages = Math.max(1, Math.ceil(total / pageSize));
                            let curPage = Math.min(satkerPage, totalPages);
                            let paged = pool.slice((curPage - 1) * pageSize, curPage * pageSize);

                            return (0,t.jsxs)("div",{
                                children:[
                                    (0,t.jsx)("div",{
                                        style:{border:"1px solid #e2e8f0",borderRadius:8,overflow:"hidden",background:"#fff",minHeight:"8.5rem"},
                                        children:satkerLoading?(0,t.jsx)("div",{style:{padding:"1.5rem",textAlign:"center",color:"#64748b",fontSize:"0.8rem"},children:"Mencari satker…"}):paged.length===0?(0,t.jsx)("div",{style:{padding:"1.5rem",textAlign:"center",color:"#94a3b8",fontSize:"0.8rem"},children:"Tidak ada satker ditemukan. Coba ketik kata kunci lain."}):(0,t.jsx)("div",{
                                            style:{display:"grid"},
                                            children:paged.map(item=>{
                                                let isSelected = satkerDraftTarget?.id === item.id;
                                                return (0,t.jsxs)("div",{
                                                    key:item.id,
                                                    onClick:()=>setSatkerDraftTarget(isSelected ? null : item),
                                                    style:{
                                                        display:"flex",
                                                        alignItems:"center",
                                                        justifyContent:"space-between",
                                                        gap:"0.5rem",
                           