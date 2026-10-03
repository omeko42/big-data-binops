import fs from 'fs';
import cp from 'child_process';

const chunkPath = 'frontend-patch/laporan-filter-perma-a15e28ec2e81.patched.js';
let content = fs.readFileSync(chunkPath, 'utf8');

// 1. Update State Hooks
const oldStateMarker = `let[importModalVisible,setImportModalVisible]=(0,n.useState)(!1),
[importYear,setImportYear]=(0,n.useState)("2026"),
[importDownloading,setImportDownloading]=(0,n.useState)(!1),
[importUploading,setImportUploading]=(0,n.useState)(!1),
[importPreviewData,setImportPreviewData]=(0,n.useState)(null),
[importStep,setImportStep]=(0,n.useState)(1),
[importCommitting,setImportCommitting]=(0,n.useState)(!1);`;

const newState = `let[importModalVisible,setImportModalVisible]=(0,n.useState)(!1),
[importYear,setImportYear]=(0,n.useState)("2026"),
[importFromDate,setImportFromDate]=(0,n.useState)(""),
[importToDate,setImportToDate]=(0,n.useState)(""),
[importPeriodPreset,setImportPeriodPreset]=(0,n.useState)("month_current"),
[importSatker,setImportSatker]=(0,n.useState)(null),
[importSatkerQuery,setImportSatkerQuery]=(0,n.useState)(""),
[importSatkerResults,setImportSatkerResults]=(0,n.useState)([]),
[importSatkerLoading,setImportSatkerLoading]=(0,n.useState)(!1),
[importSatkerDropdownOpen,setImportSatkerDropdownOpen]=(0,n.useState)(!1),
[importDownloading,setImportDownloading]=(0,n.useState)(!1),
[importUploading,setImportUploading]=(0,n.useState)(!1),
[importPreviewData,setImportPreviewData]=(0,n.useState)(null),
[importStep,setImportStep]=(0,n.useState)(1),
[importCommitting,setImportCommitting]=(0,n.useState)(!1);`;

if (!content.includes(oldStateMarker)) {
    console.error('oldStateMarker not found in chunk!');
    process.exit(1);
}
content = content.replace(oldStateMarker, newState);

// 2. Replace downloadImportTemplate and inject helper functions
const oldDownloadMarker = `async function downloadImportTemplate(){`;
const endDownloadMarker = `async function handleImportFileUpload(event){`;

const downloadIdx = content.indexOf(oldDownloadMarker);
const endDownloadIdx = content.indexOf(endDownloadMarker);

if (downloadIdx === -1 || endDownloadIdx === -1) {
    console.error('Download function markers not found!');
    process.exit(1);
}

const newHelpersAndDownload = `function applyImportPeriodPreset(preset){
    setImportPeriodPreset(preset);
    let now=new Date();
    let y=now.getFullYear();
    let m=now.getMonth()+1;
    if(preset==="month_current"){
        let mStr=String(m).padStart(2,"0");
        let lastDay=new Date(y,m,0).getDate();
        setImportFromDate(y+"-"+mStr+"-01");
        setImportToDate(y+"-"+mStr+"-"+String(lastDay).padStart(2,"0"));
        setImportYear(String(y));
    }else if(preset==="month_prev"){
        let prevM=m-1,prevY=y;
        if(prevM===0){prevM=12;prevY=y-1;}
        let mStr=String(prevM).padStart(2,"0");
        let lastDay=new Date(prevY,prevM,0).getDate();
        setImportFromDate(prevY+"-"+mStr+"-01");
        setImportToDate(prevY+"-"+mStr+"-"+String(lastDay).padStart(2,"0"));
        setImportYear(String(prevY));
    }else if(preset==="year_2026"){
        setImportFromDate("2026-01-01");
        setImportToDate("2026-12-31");
        setImportYear("2026");
    }else if(preset==="year_2025"){
        setImportFromDate("2025-01-01");
        setImportToDate("2025-12-31");
        setImportYear("2025");
    }else if(preset==="year_2024"){
        setImportFromDate("2024-01-01");
        setImportToDate("2024-12-31");
        setImportYear("2024");
    }else if(preset==="all"){
        setImportFromDate("");
        setImportToDate("");
        setImportYear("all");
    }
}

async function searchImportSatker(q){
    let query=String(q||"").trim();
    if(!query||query.length<2){
        setImportSatkerResults([]);
        return;
    }
    setImportSatkerLoading(!0);
    try{
        let res=await L.apiAuth.get("/bdb/satker/search",{params:{q:query,limit:15}});
        setImportSatkerResults(res.data?.data||[]);
        setImportSatkerDropdownOpen(!0);
    }catch(e){
        setImportSatkerResults([]);
    }finally{
        setImportSatkerLoading(!1);
    }
}

function selectImportSatker(item){
    setImportSatker(item);
    setImportSatkerQuery("");
    setImportSatkerResults([]);
    setImportSatkerDropdownOpen(!1);
}

function clearImportSatker(){
    setImportSatker(null);
    setImportSatkerQuery("");
    setImportSatkerResults([]);
    setImportSatkerDropdownOpen(!1);
}

function openImportModal(){
    setImportModalVisible(!0);
    setImportStep(1);
    setImportPreviewData(null);
    setImportSatker(eTargetSatker||null);
    setImportSatkerQuery("");
    setImportSatkerResults([]);
    setImportSatkerDropdownOpen(!1);
    applyImportPeriodPreset("month_current");
}

async function downloadImportTemplate(){
    if(importFromDate&&importToDate&&importFromDate>importToDate){
        return void e.current?.show({severity:"warn",summary:"Periode Tidak Valid",detail:"Tanggal awal tidak boleh melebihi tanggal akhir."});
    }
    setImportDownloading(!0);
    try {
        let params={};
        if(importFromDate) params.from=importFromDate;
        if(importToDate) params.to=importToDate;
        if(!importFromDate&&!importToDate&&importYear) params.year=importYear;
        
        let targetId=importSatker?.id||eTargetSatker?.id;
        if(targetId) params.target_satker_id=targetId;

        let res = await L.apiAuth.get("/bdb/laporan-polisi/bulk-import/template", {
            params: params,
            responseType: "blob"
        });
        let fname = "";
        let disp = res.headers ? (res.headers["content-disposition"] || res.headers["Content-Disposition"]) : null;
        if (disp) {
            let m = disp.match(/filename\\*?=['"]?(?:UTF-\\d['"]*)?([^;\\r\\n"']*)['"]?/i);
            if (m && m[1]) fname = decodeURIComponent(m[1].trim());
        }
        if (!fname && res.headers && (res.headers["x-suggested-filename"] || res.headers["X-Suggested-Filename"])) {
            fname = String(res.headers["x-suggested-filename"] || res.headers["X-Suggested-Filename"]).trim();
        }
        if (!fname || fname.includes("template_status") || !fname.startsWith("cas_")) {
            let uId = String(targetId || 1) + "_" + String(importFromDate || importYear || "all");
            let rand = Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
            let rawStr = uId + ":" + rand;
            let enc = "";
            try {
                enc = btoa(rawStr).replace(/=/g, "").replace(/\\+/g, "-").replace(/\\//g, "_");
            } catch(e) {
                enc = Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
            }
            fname = "cas_" + enc + ".xlsx";
        }
        let blob = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        a.download = fname;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        e.current?.show({ severity: "success", summary: "Unduh Berhasil", detail: "File " + fname + " berhasil diunduh.", life: 4e3 });
    } catch(err) {
        e.current?.show({ severity: "error", summary: "Gagal Mengunduh", detail: err.response?.data?.message || "Gagal mengunduh template.", life: 5e3 });
    } finally {
        setImportDownloading(!1);
    }
}

`;

content = content.slice(0, downloadIdx) + newHelpersAndDownload + content.slice(endDownloadIdx);

// 3. Update the Top Button onClick to call openImportModal
const oldBtnClick = `label:"Impor Status Massal",icon:"pi pi-file-excel",onClick:()=>{setImportModalVisible(!0);setImportStep(1);setImportPreviewData(null);}`;
const newBtnClick = `label:"Impor Status Massal",icon:"pi pi-file-excel",onClick:openImportModal`;

if (!content.includes(oldBtnClick)) {
    console.error('oldBtnClick not found!');
    process.exit(1);
}
content = content.replace(oldBtnClick, newBtnClick);

// 4. Update Modal Dialog UI (Banner + Step 1 with Satker Search & Custom Date Range)
const oldModalUIStart = `style:{width:importStep===2?"76rem":"44rem",maxWidth:"96vw"},`;
const newModalUIStart = `style:{width:importStep===2?"76rem":"48rem",maxWidth:"96vw"},`;
content = content.replace(oldModalUIStart, newModalUIStart);

const oldModalChildren = `(0,t.jsxs)("div",{style:{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:8,padding:"0.75rem 1rem",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"1rem"},children:[
            (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.6rem"},children:[
                (0,t.jsx)("i",{className:"pi pi-shield",style:{color:"#16a34a",fontSize:"1.2rem"}}),
                (0,t.jsxs)("div",{children:[
                    (0,t.jsxs)("div",{style:{fontWeight:700,fontSize:"0.88rem",color:"#166534"},children:["Satuan Kerja: ",eTargetSatker?.deskripsi||eTargetSatker?.name||"Satker Kewenangan Anda"]}),
                    (0,t.jsx)("div",{style:{fontSize:"0.78rem",color:"#15803d"},children:"File Excel terenkripsi dengan identitas digital dan watermark forensik kedinasan."})
                ]})
            ]})
        ]}),
        importStep===1?(0,t.jsxs)("div",{style:{display:"grid",gap:"1.25rem"},children:[
            (0,t.jsxs)("div",{style:{border:"1px solid #e2e8f0",borderRadius:8,padding:"1rem",background:"#ffffff"},children:[
                (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.6rem"},children:[
                    (0,t.jsx)("span",{style:{display:"inline-flex",alignItems:"center",justifyContent:"center",width:"22px",height:"22px",borderRadius:"50%",background:"#059669",color:"#fff",fontSize:"0.75rem",fontWeight:700},children:"1"}),
                    (0,t.jsx)("strong",{style:{fontSize:"0.9rem",color:"#1e293b"},children:"Unduh Template Data LP Satker"})
                ]}),
                (0,t.jsx)("p",{style:{fontSize:"0.82rem",color:"#64748b",marginBottom:"0.75rem",lineHeight:1.45},children:"Unduh file Excel resmi yang sudah otomatis terisi nomor LP satker Anda. Buka file, pilih Status Baru pada dropdown, dan simpan."}),
                (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.75rem",flexWrap:"wrap"},children:[
                    (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.4rem"},children:[
                        (0,t.jsx)("label",{style:{fontSize:"0.8rem",fontWeight:600,color:"#475569"},children:"Periode LP:"}),
                        (0,t.jsxs)("select",{value:importYear,onChange:e=>setImportYear(e.target.value),style:{padding:"0.35rem 0.6rem",borderRadius:6,border:"1px solid #cbd5e1",fontSize:"0.82rem",fontWeight:600,color:"#334155",outline:"none"},children:[
                            (0,t.jsx)("option",{value:"2026",children:"Tahun Berjalan (2026)"}),
                            (0,t.jsx)("option",{value:"2025",children:"Tahun 2025"}),
                            (0,t.jsx)("option",{value:"2024",children:"Tahun 2024"}),
                            (0,t.jsx)("option",{value:"all",children:"Semua Periode (Keseluruhan)"})
                        ]})
                    ]}),
                    (0,t.jsx)(o.Button,{label:"Unduh Template Excel (.xlsx)",icon:"pi pi-download",onClick:downloadImportTemplate,loading:importDownloading,size:"small",style:{background:"#059669",borderColor:"#059669",color:"#ffffff"}})
                ]})
            ]}),`;

const newModalChildren = `(0,t.jsxs)("div",{style:{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:8,padding:"0.75rem 1rem",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"1rem"},children:[
            (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.6rem"},children:[
                (0,t.jsx)("i",{className:"pi pi-shield",style:{color:"#16a34a",fontSize:"1.3rem"}}),
                (0,t.jsxs)("div",{children:[
                    (0,t.jsxs)("div",{style:{fontWeight:700,fontSize:"0.88rem",color:"#166534"},children:[
                        "Satuan Kerja: ",
                        importSatker ? importSatker.deskripsi : (eTargetSatker?.deskripsi || eTargetSatker?.name || (eG?.isSuperadmin ? "Seluruh Satker (Nasional)" : "Satker Kewenangan Anda"))
                    ]}),
                    (0,t.jsx)("div",{style:{fontSize:"0.76rem",color:"#15803d"},children:"Mencakup seluruh satuan kerja / unit bawahan secara otomatis (hirarkis). File Excel terenkripsi forensik."})
                ]})
            ]})
        ]}),
        importStep===1?(0,t.jsxs)("div",{style:{display:"grid",gap:"1.25rem"},children:[
            (0,t.jsxs)("div",{style:{border:"1px solid #e2e8f0",borderRadius:8,padding:"1rem",background:"#ffffff"},children:[
                (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.6rem"},children:[
                    (0,t.jsx)("span",{style:{display:"inline-flex",alignItems:"center",justifyContent:"center",width:"22px",height:"22px",borderRadius:"50%",background:"#059669",color:"#fff",fontSize:"0.75rem",fontWeight:700},children:"1"}),
                    (0,t.jsx)("strong",{style:{fontSize:"0.9rem",color:"#1e293b"},children:"Unduh Template Data LP Satker"})
                ]}),
                (0,t.jsx)("p",{style:{fontSize:"0.82rem",color:"#64748b",marginBottom:"0.85rem",lineHeight:1.45},children:"Unduh file Excel resmi berisikan data LP. Kolom Tindak Pidana terisi otomatis dari klasifikasi kejahatan. Buka file, pilih Status Baru pada dropdown, isi data dokumen, dan simpan."}),
                (0,t.jsxs)("div",{style:{marginBottom:"0.85rem",position:"relative"},children:[
                    (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.3rem"},children:[
                        (0,t.jsx)("label",{style:{fontSize:"0.8rem",fontWeight:600,color:"#334155"},children:"Filter Satker (Hirarkis):"}),
                        importSatker&&(0,t.jsxs)("span",{style:{fontSize:"0.72rem",color:"#059669",background:"#ecfdf5",border:"1px solid #a7f3d0",borderRadius:4,padding:"0.1rem 0.4rem",display:"inline-flex",alignItems:"center",gap:"0.35rem"},children:[
                            (0,t.jsx)("strong",{children:importSatker.deskripsi}),
                            (0,t.jsx)("button",{type:"button",onClick:clearImportSatker,style:{background:"none",border:"none",color:"#059669",cursor:"pointer",fontWeight:700,fontSize:"0.85rem",padding:0,lineHeight:1},children:"×"})
                        ]})
                    ]}),
                    (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.4rem"},children:[
                        (0,t.jsxs)("div",{style:{position:"relative",flex:1},children:[
                            (0,t.jsx)(l.InputText,{
                                value:importSatker ? importSatker.deskripsi : importSatkerQuery,
                                placeholder:"Ketik nama satker / polda / polres (cth: Metro Jaya, Jakpus, Medan, Siber)...",
                                onChange:e=>{
                                    if(importSatker) setImportSatker(null);
                                    let v = e.target.value;
                                    setImportSatkerQuery(v);
                                    if(window._impStkTimer) clearTimeout(window._impStkTimer);
                                    window._impStkTimer = setTimeout(()=>searchImportSatker(v), 260);
                                },
                                onFocus:()=>{ if(importSatkerResults.length>0) setImportSatkerDropdownOpen(!0); },
                                style:{width:"100%",fontSize:"0.82rem"}
                            }),
                            (importSatker || importSatkerQuery)&&(0,t.jsx)("button",{
                                type:"button",
                                onClick:clearImportSatker,
                                style:{position:"absolute",right:"0.6rem",top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#94a3b8",cursor:"pointer",fontSize:"1rem"},
                                children:"×"
                            })
                        ]}),
                        (0,t.jsx)(o.Button,{
                            icon:importSatkerLoading?"pi pi-spin pi-spinner":"pi pi-search",
                            size:"small",
                            onClick:()=>searchImportSatker(importSatkerQuery),
                            style:{padding:"0.45rem 0.75rem",fontSize:"0.8rem"}
                        })
                    ]}),
                    importSatkerDropdownOpen&&importSatkerResults.length>0&&(0,t.jsx)("div",{
                        style:{position:"absolute",top:"100%",left:0,right:0,zIndex:999,background:"#fff",border:"1px solid #cbd5e1",borderRadius:6,boxShadow:"0 10px 15px -3px rgba(0,0,0,0.1)",maxHeight:"14rem",overflowY:"auto",marginTop:"0.25rem"},
                        children:importSatkerResults.map(item=>(0,t.jsxs)("div",{
                            key:item.id,
                            onClick:()=>selectImportSatker(item),
                            style:{padding:"0.45rem 0.75rem",borderBottom:"1px solid #f1f5f9",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.5rem"},
                            onMouseEnter:e=>e.currentTarget.style.background="#f0fdf4",
                            onMouseLeave:e=>e.currentTarget.style.background="#fff",
                            children:[
                                (0,t.jsxs)("div",{style:{minWidth:0},children:[
                                    (0,t.jsx)("div",{style:{fontSize:"0.82rem",fontWeight:600,color:"#1e293b",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:item.deskripsi}),
                                    item.jalur&&(0,t.jsx)("div",{style:{fontSize:"0.7rem",color:"#64748b",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:item.jalur})
                                ]}),
                                (0,t.jsx)("span",{style:{fontSize:"0.65rem",fontWeight:700,color:"#047857",background:"#ecfdf5",border:"1px solid #a7f3d0",borderRadius:4,padding:"0.1rem 0.35rem",flexShrink:0},children:item.tipe_satker||"SATKER"})
                            ]
                        }))
                    })
                ]}),
                (0,t.jsxs)("div",{style:{display:"grid",gap:"0.45rem",marginBottom:"1rem"},children:[
                    (0,t.jsx)("label",{style:{fontSize:"0.8rem",fontWeight:600,color:"#334155"},children:"Periode LP (Rentang Tanggal Laporan):"}),
                    (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.6rem",flexWrap:"wrap"},children:[
                        (0,t.jsxs)("select",{
                            value:importPeriodPreset,
                            onChange:e=>applyImportPeriodPreset(e.target.value),
                            style:{padding:"0.4rem 0.65rem",borderRadius:6,border:"1px solid #cbd5e1",fontSize:"0.82rem",fontWeight:600,color:"#334155",outline:"none",minWidth:"13rem"},
                            children:[
                                (0,t.jsx)("option",{value:"month_current",children:"Bulan Berjalan Ini (Bulan Ini)"}),
                                (0,t.jsx)("option",{value:"month_prev",children:"Bulan Sebelumnya"}),
                                (0,t.jsx)("option",{value:"year_2026",children:"Sepanjang Tahun 2026"}),
                                (0,t.jsx)("option",{value:"year_2025",children:"Sepanjang Tahun 2025"}),
                                (0,t.jsx)("option",{value:"year_2024",children:"Sepanjang Tahun 2024"}),
                                (0,t.jsx)("option",{value:"custom",children:"Rentang Tanggal Custom (Pilih Sendiri)"}),
                                (0,t.jsx)("option",{value:"all",children:"Semua Periode (Tanpa Batasan Tanggal)"})
                            ]
                        }),
                        (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.4rem"},children:[
                            (0,t.jsx)("span",{style:{fontSize:"0.78rem",color:"#64748b"},children:"Dari:"}),
                            (0,t.jsx)("input",{
                                type:"date",
                                value:importFromDate,
                                onChange:e=>{ setImportFromDate(e.target.value); setImportPeriodPreset("custom"); },
                                style:{padding:"0.35rem 0.5rem",borderRadius:6,border:"1px solid #cbd5e1",fontSize:"0.82rem",color:"#334155"}
                            }),
                            (0,t.jsx)("span",{style:{fontSize:"0.78rem",color:"#64748b"},children:"s/d"}),
                            (0,t.jsx)("input",{
                                type:"date",
                                value:importToDate,
                                onChange:e=>{ setImportToDate(e.target.value); setImportPeriodPreset("custom"); },
                                style:{padding:"0.35rem 0.5rem",borderRadius:6,border:"1px solid #cbd5e1",fontSize:"0.82rem",color:"#334155"}
                            })
                        ]})
                    ]})
                ]}),
                (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.75rem",flexWrap:"wrap"},children:[
                    (0,t.jsx)("div",{style:{fontSize:"0.76rem",color:"#64748b"},children:"Tanpa batasan 5.000 LP. Volume besar akan terunduh lengkap sesuai rentang periode."}),
                    (0,t.jsx)(o.Button,{
                        label:"Unduh Template Excel (.xlsx)",
                        icon:"pi pi-download",
                        onClick:downloadImportTemplate,
                        loading:importDownloading,
                        size:"small",
                        style:{background:"#059669",borderColor:"#059669",color:"#ffffff",fontWeight:600}
                    })
                ]})
            ]}),`;

if (!content.includes(oldModalChildren)) {
    console.error('oldModalChildren not found!');
    process.exit(1);
}

content = content.replace(oldModalChildren, newModalChildren);

fs.writeFileSync(chunkPath, content, 'utf8');
console.log('Successfully patched chunk with hierarchy satker and custom period selection!');

// Verify Syntax with node -c
try {
    cp.execSync(`node -c "${chunkPath}"`);
    console.log('Syntax check PASSED! 100% valid JavaScript.');
} catch (err) {
    console.error('Syntax error in patched chunk:', err.message);
    process.exit(1);
}
