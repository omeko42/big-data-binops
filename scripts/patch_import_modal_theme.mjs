import fs from 'fs';
import cp from 'child_process';
import { runFE, copyFileToFE } from './fe_exec.mjs';

const targetFile = 'frontend-patch/laporan-filter-perma-a15e28ec2e81.patched.js';
const content = fs.readFileSync(targetFile, 'utf8');

const startTag = 'visible:importModalVisible';
const startIdx = content.lastIndexOf('(0,t.jsx)(u.Dialog,{', content.indexOf(startTag));
const endTag = 'Update Satker Penanganan';
const endDialogIdx = content.indexOf(endTag);
const actualEnd = content.lastIndexOf('(0,t.jsx)(u.Dialog,{', endDialogIdx);

if (startIdx === -1 || actualEnd === -1) {
    console.error('Boundaries not found!', { startIdx, actualEnd });
    process.exit(1);
}

console.log('Found boundaries: from', startIdx, 'to', actualEnd);

const replacement = `(0,t.jsx)(u.Dialog,{
    header:(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.75rem"},children:[
        (0,t.jsx)("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",width:"38px",height:"38px",borderRadius:"8px",background:"rgba(16, 185, 129, 0.15)",border:"1px solid rgba(16, 185, 129, 0.3)"},children:
            (0,t.jsx)("i",{className:"pi pi-file-excel",style:{color:"#34d399",fontSize:"1.3rem"}})
        }),
        (0,t.jsxs)("div",{children:[
            (0,t.jsx)("div",{style:{fontWeight:700,fontSize:"1.08rem",color:"#f8fafc",letterSpacing:"-0.01em"},children:"Impor Status Massal Laporan Polisi"}),
            (0,t.jsx)("div",{style:{fontSize:"0.78rem",color:"#94a3b8",fontWeight:400,marginTop:"2px"},children:"Pembaruan status perkara via file Excel resmi Satker terproteksi audit forensik"})
        ]})
    ]}),
    visible:importModalVisible,
    onHide:()=>{if(!importCommitting&&!importUploading){setImportModalVisible(!1);setImportStep(1);setImportPreviewData(null);}},
    style:{width:importStep===2?"78rem":"50rem",maxWidth:"96vw"},
    modal:!0,
    footer:(0,t.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%"},children:[
        (0,t.jsx)("div",{children:importStep===2&&(0,t.jsx)(o.Button,{label:"Unggah File Lain",icon:"pi pi-arrow-left",text:!0,size:"small",onClick:()=>{setImportStep(1);setImportPreviewData(null);},disabled:importCommitting,style:{color:"#38bdf8",fontWeight:600}})}),
        (0,t.jsxs)("div",{style:{display:"flex",gap:"0.6rem"},children:[
            (0,t.jsx)(o.Button,{label:"Tutup",text:!0,onClick:()=>{setImportModalVisible(!1);setImportStep(1);setImportPreviewData(null);},disabled:importCommitting,style:{color:"#94a3b8"}}),
            importStep===2&&(0,t.jsx)(o.Button,{label:\`Terapkan Update (\${importPreviewData?.summary?.ready||0} LP)\`,icon:"pi pi-check",onClick:handleCommitImport,loading:importCommitting,disabled:!importPreviewData?.summary?.ready||importPreviewData.summary.ready===0,style:{background:"linear-gradient(135deg, #10b981 0%, #059669 100%)",borderColor:"#10b981",color:"#ffffff",fontWeight:700,boxShadow:"0 2px 10px rgba(16, 185, 129, 0.35)",padding:"0.55rem 1.25rem"}})
        ]})
    ]}),
    children:(0,t.jsxs)("div",{style:{display:"grid",gap:"1rem",padding:"0.25rem 0"},children:[
        (0,t.jsxs)("div",{style:{background:"rgba(16, 185, 129, 0.08)",border:"1px solid rgba(16, 185, 129, 0.25)",borderRadius:8,padding:"0.75rem 1rem",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"1rem"},children:[
            (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.65rem"},children:[
                (0,t.jsx)("i",{className:"pi pi-shield",style:{color:"#34d399",fontSize:"1.3rem"}}),
                (0,t.jsxs)("div",{children:[
                    (0,t.jsxs)("div",{style:{fontWeight:700,fontSize:"0.88rem",color:"#ecfdf5"},children:[
                        "Satuan Kerja: ",
                        (0,t.jsx)("span",{style:{color:"#6ee7b7"},children:importSatker ? importSatker.deskripsi : (eTargetSatker?.deskripsi || eTargetSatker?.name || (eG?.isSuperadmin ? "Seluruh Satker (Nasional)" : "Satker Kewenangan Anda"))})
                    ]}),
                    (0,t.jsx)("div",{style:{fontSize:"0.76rem",color:"#94a3b8",marginTop:"2px"},children:"Mencakup seluruh satuan kerja / unit bawahan secara otomatis (hirarkis). File Excel terenkripsi forensik."})
                ]})
            ]})
        ]}),
        importStep===1?(0,t.jsxs)("div",{style:{display:"grid",gap:"1.25rem"},children:[
            (0,t.jsxs)("div",{style:{border:"1px solid rgba(255, 255, 255, 0.08)",borderRadius:10,padding:"1.25rem",background:"rgba(15, 23, 42, 0.6)",boxShadow:"0 4px 12px rgba(0, 0, 0, 0.2)"},children:[
                (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1rem",flexWrap:"wrap",gap:"0.5rem"},children:[
                    (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[
                        (0,t.jsx)("span",{style:{display:"inline-flex",alignItems:"center",justifyContent:"center",width:"24px",height:"24px",borderRadius:"50%",background:"linear-gradient(135deg, #10b981 0%, #059669 100%)",color:"#fff",fontSize:"0.8rem",fontWeight:700},children:"1"}),
                        (0,t.jsx)("strong",{style:{fontSize:"0.95rem",color:"#f8fafc"},children:"Unduh Template Data LP Sesuai Filter Halaman"})
                    ]}),
                    (0,t.jsxs)("div",{style:{display:"inline-flex",alignItems:"center",gap:"0.4rem",background:"rgba(16, 185, 129, 0.12)",border:"1px solid rgba(16, 185, 129, 0.3)",borderRadius:20,padding:"0.2rem 0.65rem",fontSize:"0.75rem",color:"#34d399",fontWeight:600},children:[
                        (0,t.jsx)("i",{className:"pi pi-check-circle"}),
                        (0,t.jsx)("span",{children:"Filter Tersinkronisasi"})
                    ]})
                ]}),
                (0,t.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",gap:"0.75rem",marginBottom:"1rem"},children:[
                    (0,t.jsxs)("div",{style:{background:"rgba(30, 41, 59, 0.4)",border:"1px solid rgba(255, 255, 255, 0.08)",borderRadius:8,padding:"0.75rem"},children:[
                        (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.4rem",marginBottom:"0.35rem",color:"#94a3b8",fontSize:"0.72rem",fontWeight:700,textTransform:"uppercase"},children:[
                            (0,t.jsx)("i",{className:"pi pi-building",style:{color:"#60a5fa"}}),
                            (0,t.jsx)("span",{children:"Satuan Kerja"})
                        ]}),
                        (0,t.jsx)("div",{style:{fontWeight:700,fontSize:"0.88rem",color:"#f1f5f9",lineHeight:1.3,marginBottom:"0.2rem"},children:eTargetSatker ? eTargetSatker.deskripsi : (eG?.isSuperadmin ? "Seluruh Satker (Tingkat Nasional)" : (u?.satker_nama || "Satker Kewenangan Anda"))}),
                        (0,t.jsx)("div",{style:{fontSize:"0.72rem",color:"#64748b"},children:eTargetSatker?.jalur || (eG?.isSuperadmin && !eTargetSatker ? "Seluruh Wilayah Hukum RI" : "Hirarki Tipid Unit Induk & Bawahan")})
                    ]}),
                    (0,t.jsxs)("div",{style:{background:"rgba(30, 41, 59, 0.4)",border:"1px solid rgba(255, 255, 255, 0.08)",borderRadius:8,padding:"0.75rem"},children:[
                        (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.4rem",marginBottom:"0.35rem",color:"#94a3b8",fontSize:"0.72rem",fontWeight:700,textTransform:"uppercase"},children:[
                            (0,t.jsx)("i",{className:"pi pi-calendar",style:{color:"#34d399"}}),
                            (0,t.jsx)("span",{children:"Periode Laporan"})
                        ]}),
                        (0,t.jsx)("div",{style:{fontWeight:700,fontSize:"0.88rem",color:"#f1f5f9",lineHeight:1.3,marginBottom:"0.2rem"},children:mainPeriodLabel || "Semua Periode"}),
                        (0,t.jsx)("div",{style:{fontSize:"0.72rem",color:"#64748b"},children:(eAP.from && eAP.to) ? (eAP.from + " s/d " + eAP.to) : "Rentang tanggal aktif"})
                    ]}),
                    (0,t.jsxs)("div",{style:{background:"rgba(30, 41, 59, 0.4)",border:"1px solid rgba(255, 255, 255, 0.08)",borderRadius:8,padding:"0.75rem"},children:[
                        (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.4rem",marginBottom:"0.35rem",color:"#94a3b8",fontSize:"0.72rem",fontWeight:700,textTransform:"uppercase"},children:[
                            (0,t.jsx)("i",{className:"pi pi-file-excel",style:{color:"#fbbf24"}}),
                            (0,t.jsx)("span",{children:"Estimasi Baris Data"})
                        ]}),
                        (0,t.jsx)("div",{style:{fontWeight:800,fontSize:"1.1rem",color:"#34d399",lineHeight:1.2,marginBottom:"0.2rem"},children:(Z || 0).toLocaleString('id-ID') + " LP"}),
                        (0,t.jsx)("div",{style:{fontSize:"0.72rem",color:"#64748b"},children:"Tanpa batasan 5.000 LP"})
                    ]})
                ]}),
                (0,t.jsxs)("div",{style:{background:"rgba(59, 130, 246, 0.08)",border:"1px solid rgba(59, 130, 246, 0.25)",borderRadius:8,padding:"0.75rem 1rem",marginBottom:"1.1rem",display:"flex",alignItems:"flex-start",gap:"0.65rem"},children:[
                    (0,t.jsx)("i",{className:"pi pi-info-circle",style:{color:"#60a5fa",fontSize:"1.1rem",marginTop:"0.15rem",flexShrink:0}}),
                    (0,t.jsxs)("div",{style:{fontSize:"0.78rem",color:"#cbd5e1",lineHeight:1.5},children:[
                        (0,t.jsx)("span",{style:{fontWeight:700,color:"#93c5fd"},children:"Petunjuk Sinkronisasi Filter: "}),
                        "Data template Excel ini otomatis mengikuti filter Satuan Kerja dan Periode yang sedang aktif pada toolbar halaman utama. Jika Anda ingin mengunduh cakupan data lain (misal: satker bawahan spesifik atau rentang bulan/tahun tertentu), silakan sesuaikan terlebih dahulu filter pada bilah menu halaman sebelum mengunduh template."
                    ]})
                ]}),
                (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.75rem",flexWrap:"wrap"},children:[
                    (0,t.jsxs)("div",{style:{fontSize:"0.75rem",color:"#94a3b8",display:"flex",alignItems:"center",gap:"0.4rem"},children:[
                        (0,t.jsx)("i",{className:"pi pi-lock",style:{color:"#34d399"}}),
                        (0,t.jsx)("span",{children:"Nama file terenkripsi cas_*.xlsx & berproteksi audit forensik."})
                    ]}),
                    (0,t.jsx)(o.Button,{
                        label:"Unduh Template Excel (" + (Z || 0).toLocaleString('id-ID') + " LP)",
                        icon:importDownloading ? "pi pi-spin pi-spinner" : "pi pi-download",
                        onClick:downloadImportTemplate,
                        loading:importDownloading,
                        style:{background:"linear-gradient(135deg, #10b981 0%, #059669 100%)",borderColor:"#10b981",color:"#ffffff",fontWeight:700,padding:"0.55rem 1.25rem",boxShadow:"0 2px 8px rgba(16, 185, 129, 0.3)"}
                    })
                ]})
            ]}),
            (0,t.jsxs)("div",{style:{border:"1px dashed rgba(255, 255, 255, 0.18)",borderRadius:8,padding:"1.5rem 1rem",background:"rgba(30, 41, 59, 0.3)",textAlign:"center"},children:[
                (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem",marginBottom:"0.5rem"},children:[
                    (0,t.jsx)("span",{style:{display:"inline-flex",alignItems:"center",justifyContent:"center",width:"22px",height:"22px",borderRadius:"50%",background:"linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",color:"#fff",fontSize:"0.75rem",fontWeight:700},children:"2"}),
                    (0,t.jsx)("strong",{style:{fontSize:"0.9rem",color:"#f8fafc"},children:"Unggah Kembali File Excel yang Telah Diperbarui"})
                ]}),
                (0,t.jsx)("p",{style:{fontSize:"0.8rem",color:"#94a3b8",marginBottom:"1rem"},children:"Pilih file template cas_*.xlsx yang sudah diisi status baru dan tanggal status."}),
                (0,t.jsxs)("label",{style:{display:"inline-flex",alignItems:"center",gap:"0.5rem",padding:"0.6rem 1.25rem",background:"linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",color:"#ffffff",borderRadius:6,cursor:importUploading?"not-allowed":"pointer",fontWeight:600,fontSize:"0.85rem",boxShadow:"0 2px 8px rgba(37, 99, 235, 0.35)"},children:[
                    (0,t.jsx)("i",{className:importUploading?"pi pi-spin pi-spinner":"pi pi-upload"}),
                    (0,t.jsx)("span",{children:importUploading?"Memverifikasi File...":"Pilih File Excel (.xlsx)"}),
                    (0,t.jsx)("input",{type:"file",accept:".xlsx",style:{display:"none"},onChange:handleImportFileUpload,disabled:importUploading})
                ]})
            ]})
        ]}):(0,t.jsxs)("div",{style:{display:"grid",gap:"0.75rem"},children:[
            (0,t.jsxs)("div",{style:{display:"flex",gap:"0.6rem",flexWrap:"wrap"},children:[
                (0,t.jsxs)("div",{style:{flex:1,minWidth:"120px",background:"rgba(30, 41, 59, 0.6)",border:"1px solid rgba(255, 255, 255, 0.1)",borderRadius:8,padding:"0.6rem 0.85rem"},children:[
                    (0,t.jsx)("div",{style:{fontSize:"0.72rem",color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.04em"},children:"Total Baris"}),
                    (0,t.jsx)("div",{style:{fontSize:"1.3rem",fontWeight:800,color:"#f8fafc"},children:importPreviewData?.summary?.total||0})
                ]}),
                (0,t.jsxs)("div",{style:{flex:1,minWidth:"120px",background:"rgba(16, 185, 129, 0.12)",border:"1px solid rgba(16, 185, 129, 0.35)",borderRadius:8,padding:"0.6rem 0.85rem"},children:[
                    (0,t.jsx)("div",{style:{fontSize:"0.72rem",color:"#34d399",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.04em"},children:"Siap Diperbarui"}),
                    (0,t.jsx)("div",{style:{fontSize:"1.3rem",fontWeight:800,color:"#10b981"},children:importPreviewData?.summary?.ready||0})
                ]}),
                (0,t.jsxs)("div",{style:{flex:1,minWidth:"120px",background:"rgba(30, 41, 59, 0.5)",border:"1px solid rgba(255, 255, 255, 0.08)",borderRadius:8,padding:"0.6rem 0.85rem"},children:[
                    (0,t.jsx)("div",{style:{fontSize:"0.72rem",color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.04em"},children:"Dilewati (Tanpa Ubahan / CC)"}),
                    (0,t.jsx)("div",{style:{fontSize:"1.3rem",fontWeight:800,color:"#cbd5e1"},children:importPreviewData?.summary?.skipped||0})
                ]}),
                (0,t.jsxs)("div",{style:{flex:1,minWidth:"120px",background:(importPreviewData?.summary?.error > 0) ? "rgba(239, 68, 68, 0.15)" : "rgba(30, 41, 59, 0.4)",border:(importPreviewData?.summary?.error > 0) ? "1px solid rgba(239, 68, 68, 0.4)" : "1px solid rgba(255, 255, 255, 0.06)",borderRadius:8,padding:"0.6rem 0.85rem"},children:[
                    (0,t.jsx)("div",{style:{fontSize:"0.72rem",color:(importPreviewData?.summary?.error > 0) ? "#f87171" : "#64748b",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.04em"},children:"Ditolak / Error"}),
                    (0,t.jsx)("div",{style:{fontSize:"1.3rem",fontWeight:800,color:(importPreviewData?.summary?.error > 0) ? "#ef4444" : "#64748b"},children:importPreviewData?.summary?.error||0})
                ]})
            ]}),
            (0,t.jsx)("div",{style:{maxHeight:"24rem",overflowY:"auto",border:"1px solid rgba(255, 255, 255, 0.1)",borderRadius:8,background:"rgba(15, 23, 42, 0.85)"},children:(0,t.jsxs)("table",{style:{width:"100%",borderCollapse:"collapse",fontSize:"0.78rem"},children:[
                    (0,t.jsx)("thead",{style:{position:"sticky",top:0,background:"#0f172a",borderBottom:"1px solid rgba(255, 255, 255, 0.12)",zIndex:2},children:
                        (0,t.jsxs)("tr",{children:[
                            (0,t.jsx)("th",{style:{padding:"0.65rem 0.75rem",textAlign:"left",color:"#cbd5e1",fontWeight:700,fontSize:"0.72rem",textTransform:"uppercase",letterSpacing:"0.05em"},children:"No. LP"}),
                            (0,t.jsx)("th",{style:{padding:"0.65rem 0.75rem",textAlign:"center",color:"#cbd5e1",fontWeight:700,fontSize:"0.72rem",textTransform:"uppercase",letterSpacing:"0.05em"},children:"Status Lama"}),
                            (0,t.jsx)("th",{style:{padding:"0.65rem 0.75rem",textAlign:"center",color:"#cbd5e1",fontWeight:700,fontSize:"0.72rem",textTransform:"uppercase",letterSpacing:"0.05em"},children:"Status Baru"}),
                            (0,t.jsx)("th",{style:{padding:"0.65rem 0.75rem",textAlign:"center",color:"#cbd5e1",fontWeight:700,fontSize:"0.72rem",textTransform:"uppercase",letterSpacing:"0.05em"},children:"Tgl Status"}),
                            (0,t.jsx)("th",{style:{padding:"0.65rem 0.75rem",textAlign:"left",color:"#cbd5e1",fontWeight:700,fontSize:"0.72rem",textTransform:"uppercase",letterSpacing:"0.05em"},children:"Alasan Henti / Kategori Perma / Dokumen"}),
                            (0,t.jsx)("th",{style:{padding:"0.65rem 0.75rem",textAlign:"left",color:"#cbd5e1",fontWeight:700,fontSize:"0.72rem",textTransform:"uppercase",letterSpacing:"0.05em"},children:"Status Verifikasi"})
                        ]})
                    }),
                    (0,t.jsx)("tbody",{children:(!importPreviewData?.rows || importPreviewData.rows.length === 0) ? (0,t.jsx)("tr",{children:(0,t.jsx)("td",{colSpan:6,style:{textAlign:"center",padding:"2.5rem 1rem",color:"#94a3b8",fontSize:"0.84rem"},children:"Tidak ada baris yang diubah pada file yang diunggah. Pastikan kolom STATUS BARU telah diisi pada baris LP yang ingin diperbarui."})}) : (importPreviewData?.rows||[]).map((row,rIdx)=>{
                        let isReady = row.status_verifikasi === 'READY';
                        let isError = row.status_verifikasi === 'ERROR';
                        let rowBg = isReady ? 'rgba(16, 185, 129, 0.05)' : isError ? 'rgba(239, 68, 68, 0.08)' : 'rgba(255, 255, 255, 0.02)';
                        return (0,t.jsxs)("tr",{key:rIdx,style:{background:rowBg,borderBottom:"1px solid rgba(255, 255, 255, 0.06)"},children:[
                            (0,t.jsx)("td",{style:{padding:"0.6rem 0.75rem",fontFamily:"ui-monospace, monospace",fontWeight:600,color:"#f8fafc",fontSize:"0.78rem",lineHeight:1.4},children:row.no_laporan}),
                            (0,t.jsx)("td",{style:{padding:"0.6rem 0.75rem",textAlign:"center",color:"#94a3b8",fontWeight:500,fontSize:"0.76rem"},children:row.status_saat_ini||"-"}),
                            (0,t.jsx)("td",{style:{padding:"0.6rem 0.75rem",textAlign:"center"},children:row.status_baru?(0,t.jsx)("span",{style:{display:"inline-block",padding:"0.2rem 0.6rem",borderRadius:4,background:"rgba(14, 165, 233, 0.15)",border:"1px solid rgba(14, 165, 233, 0.35)",color:"#38bdf8",fontWeight:700,fontSize:"0.76rem",letterSpacing:"0.02em"},children:row.status_baru}):"-"}),
                            (0,t.jsx)("td",{style:{padding:"0.6rem 0.75rem",textAlign:"center",color:"#e2e8f0",fontWeight:500,fontSize:"0.78rem"},children:row.tgl_status||"-"}),
                            (0,t.jsxs)("td",{style:{padding:"0.6rem 0.75rem"},children:[
                                row.alasan_penghentian?(0,t.jsx)("span",{style:{display:"inline-block",padding:"0.2rem 0.55rem",borderRadius:4,background:"rgba(245, 158, 11, 0.15)",border:"1px solid rgba(245, 158, 11, 0.35)",color:"#fbbf24",fontWeight:600,fontSize:"0.74rem",lineHeight:1.3},children:row.alasan_penghentian}):null,
                                row.kategori_perma?(0,t.jsx)("span",{style:{display:"inline-block",padding:"0.2rem 0.55rem",borderRadius:4,background:"rgba(16, 185, 129, 0.15)",border:"1px solid rgba(16, 185, 129, 0.35)",color:"#34d399",fontWeight:600,fontSize:"0.74rem",lineHeight:1.3},children:"Perma: "+row.kategori_perma}):null,
                                row.nomor_surat?(0,t.jsx)("div",{style:{color:"#94a3b8",fontSize:"0.72rem",marginTop:"0.25rem",fontFamily:"monospace"},children:"No: "+row.nomor_surat}):null,
                                !row.alasan_penghentian&&!row.kategori_perma&&!row.nomor_surat?(0,t.jsx)("span",{color:"#64748b",children:"—"}):null
                            ]}),
                            (0,t.jsxs)("td",{style:{padding:"0.6rem 0.75rem"},children:[
                                isReady ? (0,t.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.3rem",padding:"0.2rem 0.55rem",borderRadius:4,background:"rgba(16, 185, 129, 0.2)",border:"1px solid rgba(16, 185, 129, 0.45)",color:"#34d399",fontWeight:700,fontSize:"0.72rem"},children:[
                                    (0,t.jsx)("i",{className:"pi pi-check",style:{fontSize:"0.65rem"}}),
                                    "READY"
                                ]}) : isError ? (0,t.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.3rem",padding:"0.2rem 0.55rem",borderRadius:4,background:"rgba(239, 68, 68, 0.2)",border:"1px solid rgba(239, 68, 68, 0.45)",color:"#f87171",fontWeight:700,fontSize:"0.72rem"},children:[
                                    (0,t.jsx)("i",{className:"pi pi-times",style:{fontSize:"0.65rem"}}),
                                    "ERROR"
                                ]}) : (0,t.jsx)("span",{style:{display:"inline-block",padding:"0.2rem 0.55rem",borderRadius:4,background:"rgba(148, 163, 184, 0.15)",border:"1px solid rgba(148, 163, 184, 0.3)",color:"#94a3b8",fontWeight:700,fontSize:"0.72rem"},children:row.status_verifikasi}),
                                (0,t.jsx)("div",{style:{fontSize:"0.74rem",color:isError ? "#fca5a5" : isReady ? "#a7f3d0" : "#94a3b8",marginTop:"0.25rem",lineHeight:1.35},children:row.pesan})
                            ]})
                        ]});
                    })})
                ]})
            })
        ]})
    ]})
}),
`;

const newContent = content.substring(0, startIdx) + replacement + content.substring(actualEnd);
fs.writeFileSync(targetFile, newContent);
console.log('Successfully patched target file!');

// Verify syntax locally
try {
    cp.execSync('node -c ' + targetFile);
    console.log('Local syntax check: SYNTAX_OK');
} catch (e) {
    console.error('Syntax error after patch:', e.message);
    process.exit(1);
}
