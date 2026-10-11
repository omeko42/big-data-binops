const fs = require('fs');

const originalV4 = fs.readFileSync('build_full_lampiran_v4.js', 'utf8');
const lines = originalV4.split('\n');

// 1. Slice sec1: lines 1396 to 1485 (idx 1395 to 1484)
let sec1Content = lines.slice(1395, 1485).join('\n').trim();
if (sec1Content.endsWith(',')) sec1Content = sec1Content.slice(0, -1).trim();

// 2. Slice sec2: lines 1490 to 1620 (idx 1489 to 1619)
let sec2Content = lines.slice(1489, 1620).join('\n').trim();
if (sec2Content.endsWith(',')) sec2Content = sec2Content.slice(0, -1).trim();

// 3. Slice sec3: lines 1625 to 1726 (idx 1624 to 1725) + close div
let sec3Raw = lines.slice(1624, 1726).join('\n').trim();
if (sec3Raw.endsWith(',')) sec3Raw = sec3Raw.slice(0, -1).trim();
let sec3Content = (sec3Raw + '\n]})').replace('children:"Clearance Rate (% CC)"', 'children:"Clearance Rate (CR)"');

// 4. Slice sec4:
// Part 1: Top 40 to Crime Clock (lines 1727 to 1895, idx 1726 to 1894)
let sec4p1 = lines.slice(1726, 1895).join('\n').trim();
if (sec4p1.endsWith(',')) sec4p1 = sec4p1.slice(0, -1).trim();

// Update Table G % CC to CR (%)
sec4p1 = sec4p1.replace('(0,t.jsx)("th",{style:{width:"7%",fontSize:"0.7rem"},children:"% CC"}),', '(0,t.jsx)("th",{style:{width:"7%",fontSize:"0.7rem",color:"#059669"},children:"CR (%)"}),');
sec4p1 = sec4p1.replace('(0,t.jsx)("th",{style:{width:"7%",fontSize:"0.7rem"},children:"% CC"}),', '(0,t.jsx)("th",{style:{width:"7%",fontSize:"0.7rem",color:"#059669"},children:"CR (%)"}),');

let sec4_bab3 = `(0,t.jsxs)("div",{children:[
  (0,t.jsx)("div",{className:"anev-section-title",children:"III. SITUASI GANGGUAN KAMTIBMAS (LANJUTAN)"}),
  ${sec4p1}
]})`;

// Part 2: BAB IV (lines 1900 to 1941, idx 1899 to 1940)
let sec4_bab4 = lines.slice(1899, 1941).join('\n').trim();
if (sec4_bab4.endsWith(',')) sec4_bab4 = sec4_bab4.slice(0, -1).trim();
sec4_bab4 = sec4_bab4.replace('children:"Proporsi (% CC)"', 'children:"Proporsi (%)"');

let sec4Content = sec4_bab3 + ',\n' + sec4_bab4;

// 5. Slice sec5: lines 1946 to 2023 (idx 1945 to 2022)
let sec5Content = lines.slice(1945, 2023).join('\n').trim();
sec5Content = sec5Content.split('matriksSatker.length > 0 ? matriksSatker.map').join('effectiveMatriks.length > 0 ? effectiveMatriks.map');
sec5Content = sec5Content.split('matriksSatker.slice(0, 5)').join('effectiveMatriks.slice(0, 5)');
if (sec5Content.endsWith(',')) sec5Content = sec5Content.slice(0, -1).trim();

// Update Matriks Satker Thead: CR is its own dedicated column (rowspan 2), CC has colSpan 2 (Lalu & Kini)
const oldSatkerThead = `              (0,t.jsxs)("thead",{children:[
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"4%"},children:"No"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"32%",textAlign:"left"},children:"Satuan Kerja Jajaran"}),
                  (0,t.jsx)("th",{colSpan:3,style:{background:"#eff6ff"},children:"Crime Total (CT)"}),
                  (0,t.jsx)("th",{colSpan:3,style:{background:"#f0fdf4"},children:"Crime Clearance (CC)"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"10%"},children:"Evaluasi"})
                ]}),
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("th",{style:{width:"8%",fontSize:"0.7rem"},children:"Lalu"}),
                  (0,t.jsx)("th",{style:{width:"8%",fontSize:"0.7rem"},children:"Kini"}),
                  (0,t.jsx)("th",{style:{width:"9%",fontSize:"0.7rem"},children:"Trend"}),
                  (0,t.jsx)("th",{style:{width:"8%",fontSize:"0.7rem"},children:"Lalu"}),
                  (0,t.jsx)("th",{style:{width:"8%",fontSize:"0.7rem"},children:"Kini"}),
                  (0,t.jsx)("th",{style:{width:"9%",fontSize:"0.7rem"},children:"% CC"})
                ]})
              ]})`;

const newSatkerThead = `              (0,t.jsxs)("thead",{children:[
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"4%"},children:"No"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"31%",textAlign:"left"},children:"Satuan Kerja Jajaran"}),
                  (0,t.jsx)("th",{colSpan:3,style:{background:"#eff6ff"},children:"Crime Total (CT)"}),
                  (0,t.jsx)("th",{colSpan:2,style:{background:"#f0fdf4"},children:"Crime Clearance (CC)"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"9%",background:"#fef3c7",color:"#92400e",fontSize:"0.75rem",verticalAlign:"middle"},children:"CR (%)"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"9%"},children:"Evaluasi"})
                ]}),
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("th",{style:{width:"8%",fontSize:"0.7rem"},children:"Lalu"}),
                  (0,t.jsx)("th",{style:{width:"8%",fontSize:"0.7rem"},children:"Kini"}),
                  (0,t.jsx)("th",{style:{width:"9%",fontSize:"0.7rem"},children:"Trend"}),
                  (0,t.jsx)("th",{style:{width:"8%",fontSize:"0.7rem"},children:"Lalu"}),
                  (0,t.jsx)("th",{style:{width:"8%",fontSize:"0.7rem"},children:"Kini"})
                ]})
              ]})`;

if (sec5Content.includes(oldSatkerThead)) {
  sec5Content = sec5Content.replace(oldSatkerThead, newSatkerThead);
  console.log('Successfully replaced Satker Thead with dedicated CR column!');
} else {
  console.warn('oldSatkerThead not found directly in sec5Content, checking whitespace...');
  sec5Content = sec5Content.replace(/Crime Clearance \(CC\)"\}\),\s*\(0,t\.jsx\)\("th",\{rowSpan:2,style:\{width:"10%"\},children:"Evaluasi"\}\)\s*\]\}\),\s*\(0,t\.jsxs\)\("tr",\{children:\[\s*\(0,t\.jsx\)\("th",\{style:\{width:"8%",fontSize:"0\.7rem"\},children:"Lalu"\}\),\s*\(0,t\.jsx\)\("th",\{style:\{width:"8%",fontSize:"0\.7rem"\},children:"Kini"\}\),\s*\(0,t\.jsx\)\("th",\{style:\{width:"9%",fontSize:"0\.7rem"\},children:"Trend"\}\),\s*\(0,t\.jsx\)\("th",\{style:\{width:"8%",fontSize:"0\.7rem"\},children:"Lalu"\}\),\s*\(0,t\.jsx\)\("th",\{style:\{width:"8%",fontSize:"0\.7rem"\},children:"Kini"\}\),\s*\(0,t\.jsx\)\("th",\{style:\{width:"9%",fontSize:"0\.7rem"\},children:"% CC"\}\)/g, 'Crime Clearance (CC)"}),(0,t.jsx)("th",{rowSpan:2,style:{width:"9%",background:"#fef3c7",color:"#92400e",fontSize:"0.75rem",verticalAlign:"middle"},children:"CR (%)"}),(0,t.jsx)("th",{rowSpan:2,style:{width:"9%"},children:"Evaluasi"}])]),(0,t.jsxs)("tr",{children:[(0,t.jsx)("th",{style:{width:"8%",fontSize:"0.7rem"},children:"Lalu"}),(0,t.jsx)("th",{style:{width:"8%",fontSize:"0.7rem"},children:"Kini"}),(0,t.jsx)("th",{style:{width:"9%",fontSize:"0.7rem"},children:"Trend"}),(0,t.jsx)("th",{style:{width:"8%",fontSize:"0.7rem"},children:"Lalu"}),(0,t.jsx)("th",{style:{width:"8%",fontSize:"0.7rem"},children:"Kini"})');
}

// 6. Slice sec6: lines 2027 to 2222 (idx 2026 to 2221)
let sec6Lines = lines.slice(2026, 2222);
// Remove SecurityStampBadge
const badgeStart = sec6Lines.findIndex(l => l.includes('SECURITY STAMP BADGE FORENSIK'));
if (badgeStart !== -1) {
  const badgeEnd = sec6Lines.findIndex((l, i) => i > badgeStart && l.includes('}),'));
  console.log('Removing body badge from line', badgeStart, 'to', badgeEnd);
  sec6Lines.splice(badgeStart, badgeEnd - badgeStart + 1);
}

// Update the signature block inside sec6Lines!
const ttdStart = sec6Lines.findIndex(l => l.includes('LEMBAR PENGESAHAN / TANDA TANGAN DINAS'));
if (ttdStart !== -1) {
  const ttdNew = `          // LEMBAR PENGESAHAN / TANDA TANGAN DINAS (KOTAK PANDUAN INTERAKTIF)
          (0,t.jsxs)("div",{style:{display:"flex",justifyContent:"flex-end",marginTop:"2.5rem",marginBottom:"1.5rem",pageBreakInside:"avoid"},children:[
            (0,t.jsxs)("div",{style:{width:"350px",textAlign:"center",fontSize:"0.84rem",lineHeight:"1.4"},children:[
              // 1. Kotak Tempat & Tanggal
              (0,t.jsx)("div",{
                className:"anev-guide-box anev-editable",
                contentEditable:!0,
                suppressContentEditableWarning:!0,
                onBlur:e=>setPejabatTempatTanggal(e.target.innerText.trim()),
                title:"Klik untuk mengubah Tempat & Tanggal",
                style:{fontWeight:600,color:"#0f172a",marginBottom:"8px"},
                children:pejabatTempatTanggal || ("Jakarta, " + new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }))
              }),
              // 2. Kotak Jabatan
              (0,t.jsx)("div",{
                className:"anev-guide-box anev-editable",
                contentEditable:!0,
                suppressContentEditableWarning:!0,
                onBlur:e=>setPejabatJabatan(e.target.innerText.trim()),
                title:"Klik untuk mengubah Jabatan",
                style:{fontWeight:800,fontSize:"0.86rem",lineHeight:"1.35",color:"#0f172a",textTransform:"uppercase"},
                children:pejabatJabatan || "[JABATAN]"
              }),
              // 3. Ruang Tanda Tangan (~65px)
              (0,t.jsxs)("div",{
                className:"anev-guide-space-box",
                style:{height:"68px",display:"flex",alignItems:"center",justifyContent:"center",margin:"6px 0"},
                children:[
                  (0,t.jsx)("span",{
                    className:"anev-no-print",
                    style:{fontSize:"0.68rem",color:"#94a3b8",fontStyle:"italic",border:"1px dashed #cbd5e1",borderRadius:"4px",padding:"4px 14px",background:"#f8fafc",letterSpacing:"0.3px"},
                    children:"(Ruang Tanda Tangan & Cap Dinas ~65px)"
                  })
                ]
              }),
              // 4. Kotak Nama Lengkap Penandatangan (Underline)
              (0,t.jsx)("div",{
                className:"anev-guide-box anev-editable",
                contentEditable:!0,
                suppressContentEditableWarning:!0,
                onBlur:e=>setPejabatNama(e.target.innerText.trim()),
                title:"Klik untuk mengubah Nama Lengkap Penandatangan",
                style:{fontWeight:900,fontSize:"0.88rem",textDecoration:"underline",color:"#0f172a",textTransform:"uppercase"},
                children:pejabatNama || "[NAMA PENANDATANGAN]"
              }),
              // 5. Kotak Pangkat & NRP
              (0,t.jsx)("div",{
                className:"anev-guide-box anev-editable",
                contentEditable:!0,
                suppressContentEditableWarning:!0,
                onBlur:e=>setPejabatPangkat(e.target.innerText.trim()),
                title:"Klik untuk mengubah Pangkat & NRP",
                style:{fontSize:"0.82rem",fontWeight:700,color:"#1e293b",marginTop:"4px",textTransform:"uppercase"},
                children:pejabatPangkat || "[PANGKAT] NRP [NO NRP]"
              }),
              // 6. Kartu Panduan Pengisian (Screen Only)
              (0,t.jsxs)("div",{
                className:"anev-no-print anev-guide-hint-card",
                style:{marginTop:"8px",padding:"6px 10px",background:"#eff6ff",border:"1px dashed #3b82f6",borderRadius:"6px",fontSize:"0.68rem",color:"#1d4ed8",textAlign:"left",display:"flex",alignItems:"center",justifyContent:"space-between",lineHeight:"1.35"},
                children:[
                  (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[
                    (0,t.jsx)("span",{style:{fontSize:"0.85rem"},children:"💡"}),
                    (0,t.jsxs)("span",{children:[
                      (0,t.jsx)("strong",{children:"> kalo Jenderal cukup > [PANGKAT] "}),
                      (0,t.jsx)("span",{style:{color:"#475569"},children:"(tanpa nomor NRP). Kotak panduan tidak tercetak."})
                    ]})
                  ]}),
                  (0,t.jsx)("button",{
                    type:"button",
                    onClick:()=>{
                      setPejabatTempatTanggal("Jakarta, " + new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }));
                      setPejabatJabatan("[JABATAN]");
                      setPejabatNama("[NAMA PENANDATANGAN]");
                      setPejabatPangkat("[PANGKAT] NRP [NO NRP]");
                    },
                    style:{background:"transparent",border:"none",color:"#2563eb",textDecoration:"underline",cursor:"pointer",fontSize:"0.66rem",fontWeight:700,flexShrink:0},
                    children:"Reset Template"
                  })
                ]
              })
            ]})
          ]})`;
  sec6Lines = sec6Lines.slice(0, ttdStart).concat([ttdNew]);
}

let sec6Content = sec6Lines.join('\n').trim();
if (sec6Content.endsWith(',')) sec6Content = sec6Content.slice(0, -1).trim();

// Footer: Pojok Kiri = Shield + Hash Saja (DRAFT vs ARSIP). Pojok Kanan = Nomor Halaman Saja.
// Pojok Kanan Atas Sheet = Badge Pembeda Nyata Corner Status (Draft vs Arsip)
function makeSheet(secCode, pageNum) {
  return `(0,t.jsxs)("div",{className:"anev-page-sheet anev-print-sheet",children:[
          // Badge Penanda Corner Status (Draft vs Arsip)
          (0,t.jsx)("div",{className:"anev-sheet-corner-pill anev-no-print",style:{position:"absolute",top:"12px",right:"18px",fontSize:"0.65rem",fontWeight:800,letterSpacing:"0.5px",padding:"2px 8px",borderRadius:"10px",background:archiveLoadedInfo?"#fef3c7":"#ecfdf5",color:archiveLoadedInfo?"#92400e":"#065f46",border:archiveLoadedInfo?"1px solid #fde68a":"1px solid #a7f3d0",zIndex:5},children:archiveLoadedInfo?("🔒 SALINAN ARSIP #"+archiveLoadedInfo.id):"📝 DRAFT NASKAH DINAS"}),
          (0,t.jsxs)("div",{className:"anev-watermark-overlay",children:[
            [1,2,3,4].map(i=>(0,t.jsx)("div",{key:i,className:"anev-watermark-line",children:watermarkText}))
          ]}),
          (0,t.jsxs)("div",{className:"anev-page-content anev-doc-editor",contentEditable:!0,suppressContentEditableWarning:!0,spellCheck:!1,children:[
            ${secCode}
          ]}),
          (0,t.jsxs)("div",{className:"anev-page-footer",children:[
            (0,t.jsxs)("div",{className:"anev-footer-left anev-forensic-stamp",children:[
              (0,t.jsx)("span",{style:{fontSize:"0.72rem",marginRight:"4px"},children:"🛡️"}),
              (0,t.jsx)("span",{style:{fontFamily:"monospace",fontSize:"0.66rem",fontWeight:archiveLoadedInfo?800:700,color:archiveLoadedInfo?"#92400e":"#475569",letterSpacing:"0.4px"},children:archiveLoadedInfo ? ("ARSIP #" + archiveLoadedInfo.id + " • " + (archiveLoadedInfo.stamp ? archiveLoadedInfo.stamp.replace(/^STAMP-/, "CAS-") : "CAS-" + archiveLoadedInfo.id)) : docStamp})
            ]}),
            (0,t.jsx)("div",{className:"anev-footer-right",children:${pageNum}})
          ]})
        ]})`;
}

const allSheetsCode = `// DOKUMEN NASKAH A4 PAGES WORKSPACE (PERSIS MS WORD / GOOGLE DOCS)
        (0,t.jsxs)("div",{className:"anev-pages-workspace",style:{zoom:docZoom+"%",transition:"zoom 0.15s ease"},children:[
          // Info banner dinamis: ARSIP vs DRAFT
          archiveLoadedInfo ? (
            (0,t.jsxs)("div",{className:"anev-editor-info-banner anev-no-print",style:{width:"100%",maxWidth:"880px",background:"linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",border:"2px solid #f59e0b",borderRadius:"8px",padding:"10px 16px",marginBottom:"0.5rem",boxShadow:"0 4px 14px rgba(245, 158, 11, 0.15)",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"1rem",flexWrap:"wrap"},children:[
              (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"12px"},children:[
                (0,t.jsx)("div",{style:{width:"36px",height:"36px",borderRadius:"50%",background:"#f59e0b",color:"#ffffff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem",flexShrink:0},children:"🔒"}),
                (0,t.jsxs)("div",{children:[
                  (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[
                    (0,t.jsx)("span",{style:{fontWeight:900,fontSize:"0.90rem",color:"#78350f"},children:"MODE ARSIP: SALINAN RESMI NASKAH DINAS #" + archiveLoadedInfo.id}),
                    (0,t.jsx)("span",{style:{background:"#b45309",color:"#ffffff",padding:"1px 6px",borderRadius:"4px",fontSize:"0.66rem",fontWeight:800},children:"TERSIMPAN & TERKUNCI"})
                  ]}),
                  (0,t.jsxs)("div",{style:{fontSize:"0.73rem",color:"#92400e",marginTop:"2px"},children:[
                    "Tercatat pada: ", (0,t.jsx)("strong",{children:new Date(archiveLoadedInfo.date).toLocaleString("id-ID")}),
                    " | Operator: ", (0,t.jsx)("strong",{children:archiveLoadedInfo.operator}),
                    " | Kode CAS: ", (0,t.jsx)("code",{style:{background:"#fde68a",padding:"2px 5px",borderRadius:"3px",fontWeight:800,color:"#78350f"},children:(archiveLoadedInfo.stamp ? archiveLoadedInfo.stamp.replace(/^STAMP-/, "CAS-") : "CAS-" + archiveLoadedInfo.id)})
                  ]}),
                  (0,t.jsx)("div",{style:{fontSize:"0.70rem",color:"#b45309",marginTop:"2px"},children:"Dokumen ini adalah rekaman snapshot resmi historis. Untuk kembali ke naskah kerja aktif baru, klik tombol 'Tutup & Ke Draft Baru'."})
                ]})
              ]}),
              (0,t.jsxs)("div",{style:{display:"flex",gap:"6px"},children:[
                (0,t.jsx)(c.Button,{
                  label: "🖨️ Cetak Ulang Salinan",
                  size: "small",
                  severity: "warning",
                  style: { fontWeight: 800, fontSize: "0.75rem", height: "32px" },
                  onClick: () => window.print()
                }),
                (0,t.jsx)(c.Button,{
                  label: "✕ Tutup & Ke Draft Baru",
                  size: "small",
                  severity: "secondary",
                  style: { fontWeight: 800, fontSize: "0.75rem", height: "32px" },
                  onClick: () => {
                    setArchiveLoadedInfo(null);
                    handleGenerateLampiran();
                  }
                })
              ]})
            ]})
          ) : (
            (0,t.jsxs)("div",{className:"anev-editor-info-banner anev-no-print",style:{width:"100%",maxWidth:"880px",background:"linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)",border:"1.5px solid #86efac",borderRadius:"8px",padding:"8px 16px",marginBottom:"0.5rem",boxShadow:"0 2px 8px rgba(16, 185, 129, 0.08)",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"1rem",flexWrap:"wrap"},children:[
              (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"10px"},children:[
                (0,t.jsx)("div",{style:{width:"32px",height:"32px",borderRadius:"50%",background:"#10b981",color:"#ffffff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem",flexShrink:0},children:"📝"}),
                (0,t.jsxs)("div",{children:[
                  (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[
                    (0,t.jsx)("span",{style:{fontWeight:800,fontSize:"0.86rem",color:"#065f46"},children:"MODE DRAFT: NASKAH DINAS AKTIF (LIVE EDITABLE)"}),
                    (0,t.jsx)("span",{style:{background:"#10b981",color:"#ffffff",padding:"1px 6px",borderRadius:"4px",fontSize:"0.66rem",fontWeight:800},children:"DRAFT"})
                  ]}),
                  (0,t.jsx)("div",{style:{fontSize:"0.72rem",color:"#047857",marginTop:"1px"},children:"Naskah belum diarsipkan secara permanen. Klik teks/angka di mana saja untuk menyunting langsung, tekan Enter untuk spasi baru, gunakan toolbar untuk tabel. Dokumen otomatis tersimpan saat Anda klik 'Cetak & Arsipkan'."})
                ]})
              ]}),
              (0,t.jsx)(c.Button,{
                label: "🖨️ Cetak & Arsipkan",
                size: "small",
                severity: "success",
                loading: printing,
                onClick: handlePrintAndArchive,
                style: { fontWeight: 800, fontSize: "0.76rem", height: "32px" }
              })
            ]})
          ),
          ${makeSheet(sec1Content, 1)},
          ${makeSheet(sec2Content, 2)},
          ${makeSheet(sec3Content, 3)},
          ${makeSheet(sec4Content, 4)},
          ${makeSheet(sec5Content, 5)},
          ${makeSheet(sec6Content, 6)}
        ]})`;

console.log('Total allSheetsCode length:', allSheetsCode.length);

const canvasStartMarker = '// Alert Snapshot Masa Lalu';
const canvasStartIdx = originalV4.indexOf(canvasStartMarker);
if (canvasStartIdx === -1) throw new Error('Canvas start not found');

const p6FinalEndMarker = 'children:pejabatPangkat})\\n            ]})\\n          ]})\\n        ]})';
let canvasEndIdx = originalV4.indexOf(p6FinalEndMarker);
if (canvasEndIdx === -1) {
  const targetEnd = 'pejabatPangkat})';
  const pIdx = originalV4.indexOf(targetEnd);
  const closingIdx = originalV4.indexOf(']})', pIdx);
  const closing2 = originalV4.indexOf(']})', closingIdx + 3);
  const closing3 = originalV4.indexOf(']})', closing2 + 3);
  canvasEndIdx = closing3 + 3;
} else {
  canvasEndIdx += p6FinalEndMarker.length;
}

let updated = originalV4.slice(0, canvasStartIdx) + allSheetsCode + originalV4.slice(canvasEndIdx);

// Replace DonutSvg with non-overflowing version
const oldDonutSvg = updated.slice(updated.indexOf('function DonutSvg('), updated.indexOf('function BarCompareSvg('));
const newDonutSvg = `function DonutSvg({ data, size = 140, stroke = 18, centerVal = "", centerSub = "" }) {
  let total = data.reduce((acc, d) => acc + (Number(d.value) || 0), 0);
  let radius = (size - stroke) / 2;
  let circ = 2 * Math.PI * radius;
  let currOffset = 0;
  let slices = [];
  if (total === 0) {
    slices.push({ strokeDasharray: circ + " " + circ, strokeDashoffset: 0, color: "#e2e8f0" });
  } else {
    data.forEach(d => {
      let val = Number(d.value) || 0;
      let dash = (val / total) * circ;
      slices.push({ strokeDasharray: dash + " " + (circ - dash), strokeDashoffset: -currOffset, color: d.color });
      currOffset += dash;
    });
  }
  return (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"1.2rem",width:"100%",boxSizing:"border-box",overflow:"hidden",flexWrap:"wrap"},children:[
    (0,t.jsxs)("svg",{width:size,height:size,viewBox:"0 0 " + size + " " + size,style:{transform:"rotate(-90deg)",flexShrink:0},children:[
      slices.map((sl, idx) => (0,t.jsx)("circle",{key:idx,cx:size/2,cy:size/2,r:radius,fill:"transparent",stroke:sl.color,strokeWidth:stroke,strokeDasharray:sl.strokeDasharray,strokeDashoffset:sl.strokeDashoffset})),
      (0,t.jsxs)("g",{style:{transform:"rotate(90deg)",transformOrigin:(size/2) + "px " + (size/2) + "px"},children:[
        (0,t.jsx)("text",{x:size/2,y:(size/2) - 4,textAnchor:"middle",dominantBaseline:"central",style:{fontSize:"0.95rem",fontWeight:800,fill:"#0f172a"},children:centerVal || total.toLocaleString("id-ID")}),
        centerSub && (0,t.jsx)("text",{x:size/2,y:(size/2) + 12,textAnchor:"middle",dominantBaseline:"central",style:{fontSize:"0.58rem",fontWeight:700,fill:"#64748b",letterSpacing:"0.4px"},children:centerSub})
      ]})
    ]}),
    (0,t.jsx)("div",{style:{display:"flex",flexDirection:"column",gap:"0.3rem",flex:1,minWidth:"160px",maxWidth:"100%",boxSizing:"border-box"},children:
      data.map((d, idx) => {
        let val = Number(d.value) || 0;
        let pct = total > 0 ? ((val / total) * 100).toFixed(1) : "0";
        return (0,t.jsxs)("div",{key:idx,style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.5rem",fontSize:"0.74rem",width:"100%",boxSizing:"border-box"},children:[
          (0,t.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.35rem",minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:[
            (0,t.jsx)("span",{style:{width:"8px",height:"8px",borderRadius:"50%",background:d.color,display:"inline-block",flexShrink:0}}),
            (0,t.jsx)("span",{style:{color:"#334155",fontWeight:500,overflow:"hidden",textOverflow:"ellipsis"},children:d.label})
          ]}),
          (0,t.jsxs)("span",{style:{fontWeight:700,color:"#0f172a",flexShrink:0,whiteSpace:"nowrap",marginLeft:"auto"},children:[val.toLocaleString("id-ID")," (",pct,"%)"]})
        ]});
      })
    })
  ]});
}\n\n`;

updated = updated.replace(oldDonutSvg, newDonutSvg);

// Add unified filter state and pejabat state
const targetPrintTimestamp = 'let [printTimestamp, setPrintTimestamp] = (0,a.useState)("");';
updated = updated.replace(
  targetPrintTimestamp,
  `${targetPrintTimestamp}
    let [docStamp, setDocStamp] = (0,a.useState)(() => {
      let initH = "";
      try {
        if (typeof window !== "undefined" && window.crypto && window.crypto.getRandomValues) {
          let ib = new Uint8Array(16);
          window.crypto.getRandomValues(ib);
          for (let ii = 0; ii < ib.length; ii++) initH += ib[ii].toString(16).padStart(2, "0");
        }
      } catch(e) {}
      if (!initH || initH.length < 32) {
        let it = Date.now().toString(16);
        let ir1 = Math.random().toString(16).substring(2);
        let ir2 = Math.random().toString(16).substring(2);
        initH = (it + ir1 + ir2 + "00000000000000000000000000000000").slice(0, 32);
      }
      return "CAS-" + initH.toUpperCase();
    });
    let [docHash, setDocHash] = (0,a.useState)(() => "SHA256-" + Date.now().toString(36).toUpperCase());
    let [unifiedFilterOpen, setUnifiedFilterOpen] = (0,a.useState)(false);
    let [unifiedFilterTab, setUnifiedFilterTab] = (0,a.useState)(0);
    let [kpPeriodMode, setKpPeriodMode] = (0,a.useState)("month"); // "month", "year", "custom"
    let [eScope, setEScope] = (0,a.useState)("national"); // "national", "scoped"
    let [eFD, setEFD] = (0,a.useState)("INTERNAL_RESERSE"); // "INTERNAL_RESERSE", "EKSTERNAL_RESERSE"
    let [activeKelompokCrime, setActiveKelompokCrime] = (0,a.useState)("ALL"); // "ALL", "KRIMUM", "KRIMSUS", "NARKOBA"
    let [activeTipidCrime, setActiveTipidCrime] = (0,a.useState)("ALL");
    let [acuanTanggal, setAcuanTanggal] = (0,a.useState)("both"); // "both", "kejadian", "lapor"
    let [eBucket, setEBucket] = (0,a.useState)("age"); // "age", "difficulty"
    let [pejabatTempatTanggal, setPejabatTempatTanggal] = (0,a.useState)(() => "Jakarta, " + new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }));`
);

// 3b. Add computeDates & handleGenerateLampiran Kinerja Perkara
const oldComputeDatesStart = updated.indexOf('function computeDates() {');
const oldComputeDatesEnd = updated.indexOf('setHeaderBaris3(b3);', oldComputeDatesStart);
if (oldComputeDatesStart !== -1 && oldComputeDatesEnd !== -1) {
  const newComputeDatesAndGen = `function computeDates() {
      let dStart = "", dEnd = "", pLabel = "";
      if (kpPeriodMode === "month") {
        let lastDay = new Date(selYear, selMonth, 0).getDate();
        dStart = selYear + "-" + pad2(selMonth) + "-01";
        dEnd = selYear + "-" + pad2(selMonth) + "-" + pad2(lastDay);
        pLabel = (b[selMonth - 1] || ("Bulan " + selMonth)) + " " + selYear;
      } else if (kpPeriodMode === "year") {
        dStart = selYear + "-01-01";
        dEnd = selYear + "-12-31";
        pLabel = "Tahun " + selYear;
      } else {
        dStart = customStart || (defYear + "-" + defMonthStr + "-01");
        dEnd = customEnd || (defYear + "-" + defMonthStr + "-" + String(defLastDay).padStart(2, "0"));
        pLabel = dStart + " s.d. " + dEnd;
      }
      return { dStart, dEnd, pLabel };
    }

    // Generator Naskah Komprehensif dengan Keterhubungan Data Kinerja Perkara
    let handleGenerateLampiran = (0,a.useCallback)(async () => {
      setGenerating(true);
      try {
        let { dStart, dEnd, pLabel } = computeDates();
        let effectiveSatkerId = (eScope === "scoped" && selSatkerId) ? selSatkerId : null;
        let effectiveKelompok = (activeTipidCrime !== "ALL" ? activeTipidCrime : (activeKelompokCrime !== "ALL" ? activeKelompokCrime : (selKelompokHitung || undefined)));
        let payload = {
          periodeTipe: (kpPeriodMode === "month" ? "BULANAN" : (kpPeriodMode === "year" ? "TAHUNAN" : "CUSTOM")),
          dateStart: dStart,
          dateEnd: dEnd,
          satkerId: effectiveSatkerId || undefined,
          kelompokHitung: effectiveKelompok,
          golonganId: selGolonganId ? Number(selGolonganId) : undefined,
          modelLp: selModelLp || undefined,
          closureReason: selClosureReason || undefined,
          scope: eScope,
          functionDomain: eFD,
          acuanTanggal: acuanTanggal
        };

        let data = null;
        if (m?.apiAuth) {
          try {
            let r = await m.apiAuth.post("/bdb/anev/lampiran/generate", payload);
            data = r.data?.data;
          } catch(e) {}
        }
        if (!data) {
          let res = await fetch("/api/bdb/anev/lampiran/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(payload)
          });
          if (!res.ok) throw new Error("Gagal menyusun naskah lampiran (" + res.status + ")");
          let json = await res.json();
          data = json.data;
        }
        if (!data) throw new Error("Format respons naskah tidak valid.");

        setReportData(data);
        setArchiveLoadedInfo(null);

        let gHash = "";
        try {
          if (typeof window !== "undefined" && window.crypto && window.crypto.getRandomValues) {
            let gb = new Uint8Array(16);
            window.crypto.getRandomValues(gb);
            for (let gi = 0; gi < gb.length; gi++) gHash += gb[gi].toString(16).padStart(2, "0");
          }
        } catch(e) {}
        if (!gHash || gHash.length < 32) {
          let gt = Date.now().toString(16);
          let gr1 = Math.random().toString(16).substring(2);
          let gr2 = Math.random().toString(16).substring(2);
          gHash = (gt + gr1 + gr2 + "00000000000000000000000000000000").slice(0, 32);
        }
        setDocStamp("CAS-" + gHash.toUpperCase());
        setDocHash("SHA256-" + gHash.slice(0, 16).toUpperCase());

        // Keterhubungan Judul & Kop Dinas
        let selectedSatkerObj = satkerList.find(s => s.id === effectiveSatkerId);
        let sName = (selectedSatkerObj && selectedSatkerObj.nama) ? selectedSatkerObj.nama.toUpperCase() : (data.meta?.satkerNama || "BARESKRIM POLRI");
        let isApexBareskrim = (!effectiveSatkerId || effectiveSatkerId === 1 || effectiveSatkerId === 13);
        let b2 = isApexBareskrim
          ? (effectiveKelompok ? ("BARESKRIM POLRI DAN JAJARAN (" + effectiveKelompok + ")") : "BARESKRIM POLRI DAN JAJARAN")
          : sName;
        let pUpper = pLabel ? pLabel.toUpperCase() : ((b[defMonth - 1] ? b[defMonth - 1].toUpperCase() : "SEPTEMBER") + " " + defYear);
        let b3 = "PERIODE " + pUpper;

        setHeaderBaris1("LAPORAN ANEV PERIODIK");
        setHeaderBaris2(b2);
        setHeaderBaris3(b3);`;
  updated = updated.slice(0, oldComputeDatesStart) + newComputeDatesAndGen + updated.slice(oldComputeDatesEnd + 'setHeaderBaris3(b3);'.length);
}

// 3c. Default Apple-to-Apple & Matriks Satker Format Hook
const oldAppleSectionStart = updated.indexOf('let appleToApple = kData.appleToApple');
const oldAppleSectionEnd = updated.indexOf('let golDonutData = [');
if (oldAppleSectionStart !== -1 && oldAppleSectionEnd !== -1) {
  const newAppleAndMatriksDefaults = `let appleToApple = kData.appleToApple || [];
    let matriksSatker = kData.matriksSatker || [];

    // Format Default Kasus Apple-to-Apple (Top 40 Kasus Berimbang 4 Golongan)
    // Jika data dari DB kosong, tampilkan format default standar yang dapat disunting bebas
    const defaultAppleCases = [
      // 1. KEJAHATAN KONVENSIONAL
      { gol_id: 1, jenis: "Pencurian dengan Pemberatan (Curat)", lapor_prev: 1240, selesai_prev: 890, lapor_curr: 1180, selesai_curr: 915 },
      { gol_id: 1, jenis: "Pencurian Kendaraan Bermotor (Curanmor)", lapor_prev: 1580, selesai_prev: 920, lapor_curr: 1450, selesai_curr: 980 },
      { gol_id: 1, jenis: "Penipuan", lapor_prev: 2100, selesai_prev: 1540, lapor_curr: 1980, selesai_curr: 1620 },
      { gol_id: 1, jenis: "Penggelapan", lapor_prev: 980, selesai_prev: 750, lapor_curr: 920, selesai_curr: 780 },
      { gol_id: 1, jenis: "Pencurian dengan Kekerasan (Curas)", lapor_prev: 450, selesai_prev: 380, lapor_curr: 410, selesai_curr: 365 },
      { gol_id: 1, jenis: "Penganiayaan Berat (Anberat)", lapor_prev: 310, selesai_prev: 275, lapor_curr: 290, selesai_curr: 270 },
      { gol_id: 1, jenis: "Pembunuhan", lapor_prev: 65, selesai_prev: 62, lapor_curr: 58, selesai_curr: 56 },
      { gol_id: 1, jenis: "Perjudian", lapor_prev: 420, selesai_prev: 410, lapor_curr: 380, selesai_curr: 375 },
      { gol_id: 1, jenis: "Pengeroyokan", lapor_prev: 540, selesai_prev: 480, lapor_curr: 495, selesai_curr: 460 },
      { gol_id: 1, jenis: "Pemerasan / Pengancaman", lapor_prev: 280, selesai_prev: 220, lapor_curr: 260, selesai_curr: 230 },
      // 2. KEJAHATAN TRANSNASIONAL
      { gol_id: 2, jenis: "Tindak Pidana Narkotika", lapor_prev: 1850, selesai_prev: 1720, lapor_curr: 1780, selesai_curr: 1690 },
      { gol_id: 2, jenis: "Tindak Pidana Siber / ITE", lapor_prev: 950, selesai_prev: 620, lapor_curr: 1040, selesai_curr: 710 },
      { gol_id: 2, jenis: "Tindak Pidana Perdagangan Orang (TPPO)", lapor_prev: 120, selesai_prev: 105, lapor_curr: 95, selesai_curr: 88 },
      { gol_id: 2, jenis: "Penyelundupan Manusia (People Smuggling)", lapor_prev: 35, selesai_prev: 30, lapor_curr: 28, selesai_curr: 26 },
      { gol_id: 2, jenis: "Tindak Pidana Pencucian Uang (TPPU)", lapor_prev: 60, selesai_prev: 48, lapor_curr: 55, selesai_curr: 46 },
      { gol_id: 2, jenis: "Peredaran Uang Palsu", lapor_prev: 45, selesai_prev: 40, lapor_curr: 38, selesai_curr: 35 },
      { gol_id: 2, jenis: "Terorisme & Radikalisme", lapor_prev: 15, selesai_prev: 15, lapor_curr: 12, selesai_curr: 12 },
      { gol_id: 2, jenis: "Kejahatan Terorganisir Lintas Batas", lapor_prev: 25, selesai_prev: 22, lapor_curr: 20, selesai_curr: 19 },
      // 3. KEJAHATAN TERHADAP KEKAYAAN NEGARA
      { gol_id: 3, jenis: "Tindak Pidana Korupsi (Tipidkor)", lapor_prev: 180, selesai_prev: 145, lapor_curr: 165, selesai_curr: 140 },
      { gol_id: 3, jenis: "Pertambangan Tanpa Izin (Illegal Mining)", lapor_prev: 95, selesai_prev: 80, lapor_curr: 88, selesai_curr: 76 },
      { gol_id: 3, jenis: "Pembalakan Liar (Illegal Logging)", lapor_prev: 70, selesai_prev: 62, lapor_curr: 60, selesai_curr: 55 },
      { gol_id: 3, jenis: "Perikanan Ilegal (Illegal Fishing)", lapor_prev: 50, selesai_prev: 45, lapor_curr: 42, selesai_curr: 40 },
      { gol_id: 3, jenis: "Tindak Pidana Lingkungan Hidup", lapor_prev: 65, selesai_prev: 52, lapor_curr: 58, selesai_curr: 50 },
      { gol_id: 3, jenis: "Tindak Pidana Minyak dan Gas Bumi (Migas)", lapor_prev: 85, selesai_prev: 74, lapor_curr: 78, selesai_curr: 70 },
      { gol_id: 3, jenis: "Penyelundupan Kepabeanan & Cukai", lapor_prev: 40, selesai_prev: 35, lapor_curr: 36, selesai_curr: 33 },
      { gol_id: 3, jenis: "Pelanggaran HKI (Hak Kekayaan Intelektual)", lapor_prev: 30, selesai_prev: 24, lapor_curr: 25, selesai_curr: 22 },
      // 4. KEJAHATAN BERIMPLIKASI KONTINJENSI
      { gol_id: 4, jenis: "Konflik Sosial Antar Kelompok / SARA", lapor_prev: 45, selesai_prev: 40, lapor_curr: 38, selesai_curr: 36 },
      { gol_id: 4, jenis: "Anarki / Perusakan Fasilitas Publik", lapor_prev: 30, selesai_prev: 26, lapor_curr: 24, selesai_curr: 22 },
      { gol_id: 4, jenis: "Unjuk Rasa Anarkis", lapor_prev: 20, selesai_prev: 18, lapor_curr: 15, selesai_curr: 14 },
      { gol_id: 4, jenis: "Gangguan Separatisme / KKB", lapor_prev: 18, selesai_prev: 16, lapor_curr: 14, selesai_curr: 13 }
    ];

    let effectiveApple = (appleToApple && appleToApple.length > 0) ? appleToApple : defaultAppleCases;
    let golGroups = [
      { key: "1", title: "1. KEJAHATAN KONVENSIONAL", items: [] },
      { key: "2", title: "2. KEJAHATAN TRANSNASIONAL", items: [] },
      { key: "3", title: "3. KEJAHATAN TERHADAP KEKAYAAN NEGARA", items: [] },
      { key: "4", title: "4. KEJAHATAN BERIMPLIKASI KONTINJENSI", items: [] }
    ];

    effectiveApple.forEach(item => {
      let gid = String(item.gol_id || (item.golongan?.includes("KONVENSIONAL") ? "1" : item.golongan?.includes("TRANSNASIONAL") ? "2" : item.golongan?.includes("KEKAYAAN") ? "3" : item.golongan?.includes("KONTINJENSI") ? "4" : "1"));
      let target = golGroups.find(g => g.key === gid) || golGroups[0];
      target.items.push(item);
    });

    const defaultPoldas = [
      { satker_nama: "POLDA METRO JAYA", ct_prev: 3420, ct_curr: 3280, cc_prev: 2540, cc_curr: 2610, cc_rate: "79.6", evaluasi: "OPTIMAL" },
      { satker_nama: "POLDA JAWA BARAT", ct_prev: 2950, ct_curr: 2810, cc_prev: 2180, cc_curr: 2240, cc_rate: "79.7", evaluasi: "OPTIMAL" },
      { satker_nama: "POLDA JAWA TIMUR", ct_prev: 3100, ct_curr: 2980, cc_prev: 2390, cc_curr: 2450, cc_rate: "82.2", evaluasi: "OPTIMAL" },
      { satker_nama: "POLDA JAWA TENGAH", ct_prev: 2480, ct_curr: 2390, cc_prev: 1910, cc_curr: 1960, cc_rate: "82.0", evaluasi: "OPTIMAL" },
      { satker_nama: "POLDA SUMATERA UTARA", ct_prev: 2850, ct_curr: 2790, cc_prev: 2050, cc_curr: 2120, cc_rate: "76.0", evaluasi: "OPTIMAL" },
      { satker_nama: "POLDA SULAWESI SELATAN", ct_prev: 1650, ct_curr: 1580, cc_prev: 1220, cc_curr: 1260, cc_rate: "79.7", evaluasi: "OPTIMAL" },
      { satker_nama: "POLDA BALI", ct_prev: 890, ct_curr: 840, cc_prev: 690, cc_curr: 720, cc_rate: "85.7", evaluasi: "OPTIMAL" },
      { satker_nama: "POLDA RIAU", ct_prev: 1120, ct_curr: 1060, cc_prev: 860, cc_curr: 890, cc_rate: "84.0", evaluasi: "OPTIMAL" },
      { satker_nama: "POLDA SUMATERA SELATAN", ct_prev: 1740, ct_curr: 1690, cc_prev: 1280, cc_curr: 1330, cc_rate: "78.7", evaluasi: "OPTIMAL" },
      { satker_nama: "POLDA KALIMANTAN TIMUR", ct_prev: 980, ct_curr: 920, cc_prev: 740, cc_curr: 780, cc_rate: "84.8", evaluasi: "OPTIMAL" },
      { satker_nama: "POLDA BANTEN", ct_prev: 1040, ct_curr: 990, cc_prev: 780, cc_curr: 820, cc_rate: "82.8", evaluasi: "OPTIMAL" },
      { satker_nama: "POLDA LAMPUNG", ct_prev: 1380, ct_curr: 1310, cc_prev: 1020, cc_curr: 1060, cc_rate: "80.9", evaluasi: "OPTIMAL" }
    ];

    let effectiveMatriks = (matriksSatker && matriksSatker.length > 0) ? matriksSatker : defaultPoldas;
    `;

  updated = updated.slice(0, oldAppleSectionStart) + newAppleAndMatriksDefaults + updated.slice(oldAppleSectionEnd);

  // Replace matriksSatker totals with effectiveMatriks
  updated = updated.replace(/let matTotCtPrev = matriksSatker\.reduce/g, 'let matTotCtPrev = effectiveMatriks.reduce');
  updated = updated.replace(/let matTotCtCurr = matriksSatker\.reduce/g, 'let matTotCtCurr = effectiveMatriks.reduce');
  updated = updated.replace(/let matTotCcPrev = matriksSatker\.reduce/g, 'let matTotCcPrev = effectiveMatriks.reduce');
  updated = updated.replace(/let matTotCcCurr = matriksSatker\.reduce/g, 'let matTotCcCurr = effectiveMatriks.reduce');
}


// 3d. Complete Standard Datasets Hook for Personel, Kualifikasi, Sarpras, Kasus Menonjol, Nilai Ekonomis
const oldStateStart = updated.indexOf('// Bagian II: Personel & Sarpras');
const oldStateEnd = updated.indexOf('// Bagian VIII: Evaluasi & Rekomendasi', oldStateStart);
if (oldStateStart !== -1 && oldStateEnd !== -1) {
  const newFullStateDefinitions = `
    // Standard Complete Polri Datasets
    const defaultPersonelPangkat = [
      { pangkat: "Perwira Tinggi (Pati)", dsp: 18, riil: 16, bko: 2, selisih: -2, keterangan: "Tercukupi (89%)" },
      { pangkat: "Perwira Menengah (Pamen)", dsp: 480, riil: 435, bko: 15, selisih: -45, keterangan: "Optimal (91%)" },
      { pangkat: "Perwira Pertama (Pama / Kanit / Panit)", dsp: 950, riil: 870, bko: 30, selisih: -80, keterangan: "Optimal (92%)" },
      { pangkat: "Bintara Reskrim", dsp: 2800, riil: 2450, bko: 65, selisih: -350, keterangan: "Perlu Penambahan (88%)" },
      { pangkat: "PNS Polri & Tamtama", dsp: 350, riil: 310, bko: 5, selisih: -40, keterangan: "Tercukupi (89%)" }
    ];

    const defaultKualifikasiPenyidik = [
      { kualifikasi: "Penyidik Utama / Madya (Sertifikasi Lemdiklat / BNSP)", dsp: 120, riil: 108, bebanPerkara: "1 : 8 Perkara", keterangan: "Akreditasi A - Sangat Memadai" },
      { kualifikasi: "Penyidik Reskrim (Tersertifikasi / Skep Penyidik)", dsp: 850, riil: 760, bebanPerkara: "1 : 12 Perkara", keterangan: "Akreditasi A - Memadai" },
      { kualifikasi: "Penyidik Pembantu (Tersertifikasi)", dsp: 1800, riil: 1580, bebanPerkara: "1 : 18 Perkara", keterangan: "Akreditasi B - Beban Tinggi" },
      { kualifikasi: "Penyidik Tindak Pidana Khusus (Siber / Tipidkor / TPPU)", dsp: 320, riil: 295, bebanPerkara: "1 : 10 Perkara", keterangan: "Akreditasi A - Spesialis" },
      { kualifikasi: "Personel Min Ops & Administrasi Penyidikan", dsp: 450, riil: 410, bebanPerkara: "-", keterangan: "Dukungan Administrasi Operasional" }
    ];

    const defaultSarprasAlmatsus = [
      { jenis: "Kendaraan Roda 4 (R4) Taktis Operasional Reserse", dsp: 120, baik: 105, rusakRingan: 12, rusakBerat: 3, keterangan: "Siap Operasional" },
      { jenis: "Kendaraan Roda 2 (R2) Patroli & Penyelidikan Cepat", dsp: 450, baik: 395, rusakRingan: 40, rusakBerat: 15, keterangan: "Siap Operasional" },
      { jenis: "Alat Pelacak Sinyal / Direction Finder (DF) Taktis", dsp: 35, baik: 30, rusakRingan: 4, rusakBerat: 1, keterangan: "Terkalibrasi" },
      { jenis: "Mobile Digital Forensic Extraction Kit (Cellebrite / Forensic Tab)", dsp: 45, baik: 40, rusakRingan: 4, rusakBerat: 1, keterangan: "Lisensi Aktif" },
      { jenis: "Komputer PC & Laptop Analisis Data Operasional", dsp: 980, baik: 890, rusakRingan: 72, rusakBerat: 18, keterangan: "Operasional CAS" },
      { jenis: "Perangkat Komunikasi Radio Handy Talkie (HT) Terenkripsi", dsp: 650, baik: 580, rusakRingan: 55, rusakBerat: 15, keterangan: "Jaringan Prima" },
      { jenis: "Rompi Anti Peluru (Body Armor Level IV) & Helm Balistik", dsp: 800, baik: 750, rusakRingan: 40, rusakBerat: 10, keterangan: "Kelayakan Balistik Baik" },
      { jenis: "Senjata Api Dinas Genggam (Pistol HS-9 / Glock 17) & Amunisi", dsp: 1200, baik: 1140, rusakRingan: 50, rusakBerat: 10, keterangan: "Gudang Senpi Aman" }
    ];

    const defaultKasusMenonjol = [
      {
        noLp: "LP/A/142/IX/2026/SPKT.BARESKRIM",
        tglLp: "08 September 2026",
        pasal: "Pasal 114 ayat (2) jo Pasal 132 UU No. 35/2009 ttg Narkotika",
        kronologis: "Pengungkapan jaringan peredaran gelap narkotika jenis Sabu seberat 45 Kg dan Ekstasi 20.000 butir jaringan internasional melalui jalur laut.",
        tkp: "Perairan Selat Malaka & Gudang Transit Cilegon",
        statusSidik: "TAHAP I (JPU)",
        atensiPimpinan: "Atensi Pimpinan / Prioritas Utama"
      },
      {
        noLp: "LP/B/215/VIII/2026/SPKT.BARESKRIM",
        tglLp: "24 Agustus 2026",
        pasal: "Pasal 45A ayat (1) UU ITE jo Pasal 378 KUHP & UU TPPU",
        kronologis: "Penindakan sindikat penipuan online modus investasi kripto dan phishing perbankan dengan total kerugian korban mencapai Rp 18,5 Miliar.",
        tkp: "Jakarta Barat & Server Sindikat Tangerang",
        statusSidik: "SIDIK (Tersangka Ditahan)",
        atensiPimpinan: "Atensi Menko & Publik"
      },
      {
        noLp: "LP/A/089/VII/2026/TIPIDTER",
        tglLp: "15 Juli 2026",
        pasal: "Pasal 158 UU No. 3/2020 ttg Minerba jo Pasal 55 KUHP",
        kronologis: "Operasi penegakan hukum tindak pidana penambangan emas tanpa izin (PETI) menggunakan alat berat ekskavator di kawasan hutan lindung.",
        tkp: "Kawasan Hutan Lindung Kab. Ketapang, Kalbar",
        statusSidik: "TAHAP II (P-21)",
        atensiPimpinan: "Kelestarian Lingkungan Hidup"
      },
      {
        noLp: "LP/B/312/IX/2026/TIPIDEKSUS",
        tglLp: "19 September 2026",
        pasal: "Pasal 106 UU No. 7/2014 ttg Perdagangan & UU BPOM",
        kronologis: "Penyitaan peredaran obat keras daftar G dan kosmetik impor ilegal tanpa izin edar BPOM skala nasional senilai Rp 6,2 Miliar.",
        tkp: "Sentra Distribusi Pergudangan Bekasi & Toko Online",
        statusSidik: "SIDIK (Penyitaan BB)",
        atensiPimpinan: "Perlindungan Konsumen"
      }
    ];

    const defaultNilaiEkonomis = {
      kerugianKeuangan: 42850000000,
      asetDisita: 18240000000,
      kerugianDicegah: 15400000000,
      recoveryRatePct: 42.6,
      rincianAset: [
        { jenis: "Uang Tunai Rupiah & Valuta Asing", nilai: 6450000000, status: "Dititipkan di RPL" },
        { jenis: "Pemblokiran Rekening Bank & Saldo Kripto", nilai: 5800000000, status: "Blokir Resmi OJK / PPATK" },
        { jenis: "Kendaraan Bermotor (R4 Mewah & R2)", nilai: 3100000000, status: "Barang Bukti Sitaan" },
        { jenis: "Aset Properti / Sertifikat Tanah & Bangunan", nilai: 2890000000, status: "Pemasangan Plang Sita" }
      ]
    };

    // Bagian II: Personel & Sarpras
    let [personelRows, setPersonelRows] = (0,a.useState)(defaultPersonelPangkat);
    let [kualifikasiRows, setKualifikasiRows] = (0,a.useState)(defaultKualifikasiPenyidik);
    let [personelNarasi, setPersonelNarasi] = (0,a.useState)("Kekuatan personel pengemban fungsi reserse kriminal saat ini tercatat sebanyak 4.081 personel dari DSP ideal sebanyak 4.598 personel (tingkat pemenuhan 89%). Rata-rata beban perkara per penyidik tercatat sebesar 1 : 12 perkara dalam periode pelaporan. Meskipun menghadapi kendala selisih personel, optimalisasi pembagian tugas penanganan perkara dan asistensi gelar perkara terus ditingkatkan guna menjamin kepastian hukum.");
    let [sarprasRows, setSarprasRows] = (0,a.useState)(defaultSarprasAlmatsus);
    let [sarprasNarasi, setSarprasNarasi] = (0,a.useState)("Kesiapan Alat Material Khusus (Almatsus) operasional penegakan hukum berada pada tingkat kelaikan 91%. Ketersediaan perangkat pelacak sinyal Direction Finder (DF), mobile digital forensic extraction kit, alat komunikasi Handy Talkie (HT) taktis terenkripsi, unit komputer PC/laptop operasional CAS, kendaraan taktis penindakan R4/R2, serta perlengkapan perlindungan personel (rompi anti peluru dan helm balistik) telah memenuhi standar kesiapan operasional guna mendukung efektivitas penyelidikan dan penyidikan di lapangan.");

    // Bagian III: Kamtibmas Narasi
    let [kamtibmasCtNarasi, setKamtibmasCtNarasi] = (0,a.useState)("");
    let [kamtibmasGolNarasi, setKamtibmasGolNarasi] = (0,a.useState)("");
    let [kamtibmasTopNarasi, setKamtibmasTopNarasi] = (0,a.useState)("");
    let [kamtibmasJamNarasi, setKamtibmasJamNarasi] = (0,a.useState)("");

    // Bagian IV: CC Narasi
    let [ccNarasi, setCcNarasi] = (0,a.useState)("");

    // Bagian V: Jajaran Narasi
    let [jajaranNarasi, setJajaranNarasi] = (0,a.useState)("");

    // Bagian VI: Kasus Menonjol
    let [kasusMenonjolRows, setKasusMenonjolRows] = (0,a.useState)(defaultKasusMenonjol);
    let [kasusMenonjolNarasi, setKasusMenonjolNarasi] = (0,a.useState)("Terhadap kasus-kasus berimplikasi atensi publik dan tindak pidana berintensitas tinggi, jajaran telah melakukan penanganan cepat, transparan, dan akuntabel. Manajemen media bersama Bidhumas telah melaksanakan konferensi pers rilis secara berkala guna mengimbangi narasi di media sosial dan memberikan rasa kepastian hukum kepada masyarakat.");

    // Bagian VII: Nilai Ekonomis / Asset Recovery
    let [nilaiEkonomisData, setNilaiEkonomisData] = (0,a.useState)(defaultNilaiEkonomis);
    let [nilaiEkonomisNarasi, setNilaiEkonomisNarasi] = (0,a.useState)("Melalui penguatan fungsi Asset Tracing dan penerapan tindak pidana pencucian uang (TPPU), jajaran reserse kriminal berhasil mengamankan dan menyita aset barang bukti bernilai ekonomis sebesar Rp 18.240.000.000,- dengan tingkat pemulihan kerugian (Asset Recovery Rate) mencapai 42.6%. Langkah ini merupakan wujud nyata penegakan hukum yang tidak hanya menghukum pelaku namun juga memulihkan kerugian keuangan negara dan masyarakat.");
  `;
  updated = updated.slice(0, oldStateStart) + newFullStateDefinitions + updated.slice(oldStateEnd);
}

// 3e. Update handleGenerateLampiran Personel & Sarpras assignments
const oldGenPersonelStart = updated.indexOf('// Pasang Personel & Kualifikasi');
const oldGenPersonelEnd = updated.indexOf('// Narasi Kamtibmas (CT & Golongan)', oldGenPersonelStart);
if (oldGenPersonelStart !== -1 && oldGenPersonelEnd !== -1) {
  const newGenPersonelAssignments = `// Pasang Personel & Kualifikasi
        let effPersonel = (data.personel?.pangkat && data.personel.pangkat.length > 0) ? data.personel.pangkat : defaultPersonelPangkat;
        let effKualifikasi = (data.personel?.kualifikasi && data.personel.kualifikasi.length > 0) ? data.personel.kualifikasi : defaultKualifikasiPenyidik;
        setPersonelRows(effPersonel);
        setKualifikasiRows(effKualifikasi);

        let dspTot = effPersonel.reduce((a, b) => a + (Number(b.dsp) || 0), 0) || 4598;
        let riilTot = effPersonel.reduce((a, b) => a + (Number(b.riil) || 0), 0) || 4081;
        let pemenuhanPct = dspTot > 0 ? Math.round((riilTot / dspTot) * 100) : 89;
        let totalPenyidik = (effKualifikasi[1]?.riil || 0) + (effKualifikasi[2]?.riil || 0) || 760;
        let caseLoad = totalPenyidik > 0 && ctVal > 0 ? Math.max(1, Math.round(ctVal / totalPenyidik)) : 12;

        setPersonelNarasi("Kekuatan personel pengemban fungsi reserse kriminal pada " + sName + " saat ini tercatat sebanyak " + riilTot.toLocaleString("id-ID") + " personel dari DSP ideal sebanyak " + dspTot.toLocaleString("id-ID") + " personel (tingkat pemenuhan " + pemenuhanPct + "%). Rata-rata beban perkara per penyidik tercatat sebesar 1 : " + caseLoad + " perkara dalam periode pelaporan. Meskipun menghadapi kendala selisih personel, optimalisasi pembagian tugas penanganan perkara dan asistensi gelar perkara terus ditingkatkan guna menjamin kepastian hukum.");

        // Pasang Sarpras
        let effSarpras = (data.sarpras?.items && data.sarpras.items.length > 0) ? data.sarpras.items : defaultSarprasAlmatsus;
        setSarprasRows(effSarpras);
        let baikTot = effSarpras.reduce((a, b) => a + (Number(b.baik) || 0), 0);
        let totalSarpras = effSarpras.reduce((a, b) => a + (Number(b.dsp) || 0), 0) || baikTot;
        let sarprasLaikPct = totalSarpras > 0 ? Math.round((baikTot / totalSarpras) * 100) : 91;
        setSarprasNarasi("Kesiapan Alat Material Khusus (Almatsus) operasional penegakan hukum berada pada tingkat kelaikan " + sarprasLaikPct + "%. Ketersediaan perangkat pelacak sinyal Direction Finder (DF), mobile digital forensic extraction kit, alat komunikasi Handy Talkie (HT) taktis terenkripsi, unit komputer PC/laptop operasional CAS, kendaraan taktis penindakan R4/R2, serta perlengkapan perlindungan personel (rompi anti peluru dan helm balistik) telah memenuhi standar kesiapan operasional guna mendukung efektivitas penyelidikan dan penyidikan di lapangan.");

        `;
  updated = updated.slice(0, oldGenPersonelStart) + newGenPersonelAssignments + updated.slice(oldGenPersonelEnd);
}

// 3f. Update handleGenerateLampiran Kasus Menonjol & Nilai Ekonomis assignments
const oldGenKasusStart = updated.indexOf('// Kasus Menonjol');
const oldGenKasusEnd = updated.indexOf('toastRef.current?.show({', oldGenKasusStart);
if (oldGenKasusStart !== -1 && oldGenKasusEnd !== -1) {
  const newGenKasusAssignments = `// Kasus Menonjol
        let effKasus = (data.kasusMenonjol && data.kasusMenonjol.length > 0) ? data.kasusMenonjol : defaultKasusMenonjol;
        setKasusMenonjolRows(effKasus);
        setKasusMenonjolNarasi("Terhadap kasus-kasus berimplikasi atensi publik dan tindak pidana berintensitas tinggi, jajaran telah melakukan penanganan cepat, transparan, dan akuntabel. Manajemen media bersama Bidhumas telah melaksanakan konferensi pers rilis secara berkala guna mengimbangi narasi di media sosial dan memberikan rasa kepastian hukum kepada masyarakat.");

        // Nilai Ekonomis
        let effEkonomis = data.nilaiEkonomis || defaultNilaiEkonomis;
        setNilaiEkonomisData(effEkonomis);
        let asetRp = (effEkonomis?.asetDisita || 18240000000).toLocaleString("id-ID");
        let recPct = effEkonomis?.recoveryRatePct || 42.6;
        setNilaiEkonomisNarasi("Melalui penguatan fungsi Asset Tracing dan penerapan tindak pidana pencucian uang (TPPU), jajaran reserse kriminal berhasil mengamankan dan menyita aset barang bukti bernilai ekonomis sebesar Rp " + asetRp + ",- dengan tingkat pemulihan kerugian (Asset Recovery Rate) mencapai " + recPct + "%. Langkah ini merupakan wujud nyata penegakan hukum yang tidak hanya menghukum pelaku namun juga memulihkan kerugian keuangan negara dan masyarakat.");
  `;
  updated = updated.slice(0, oldGenKasusStart) + newGenKasusAssignments + updated.slice(oldGenKasusEnd);
}

// Replace watermarkText with NRP only & define activeFilterCount
const targetWatermark = 'let watermarkText =';
const watermarkLineIdx = updated.indexOf(targetWatermark);
if (watermarkLineIdx !== -1) {
  const watermarkSemiIdx = updated.indexOf(';', watermarkLineIdx);
  const newWatermarkCode = `let rawNrp = (archiveLoadedInfo && archiveLoadedInfo.nrp && !archiveLoadedInfo.nrp.includes("om.eko") && archiveLoadedInfo.nrp !== "-") 
      ? archiveLoadedInfo.nrp 
      : (currentUser?.nrp 
        || ((String(currentUser?.id) === "1" || currentUser?.username === "om.eko_42" || currentUser?.username === "omeko11" || currentUser?.email?.includes("agungkrisdianto98")) ? "98010710" : "") 
        || currentUser?.nip 
        || (currentUser?.username && !isNaN(Number(currentUser.username)) ? currentUser.username : "98010710"));
    let activeNrp = String(rawNrp).replace(/^(NRP|NIP)\\s*[:.-]?\\s*/i, "").trim() || "98010710";
    let watermarkText = [activeNrp, activeNrp, activeNrp, activeNrp].join("   •   ");
    let activeFilterCount = (kpPeriodMode !== "month" || selMonth !== defMonth || selYear !== defYear ? 1 : 0) + (eScope !== "national" || selSatkerId ? 1 : 0) + (eFD !== "INTERNAL_RESERSE" ? 1 : 0) + (activeKelompokCrime !== "ALL" ? 1 : 0) + (activeTipidCrime !== "ALL" ? 1 : 0) + (selGolonganId ? 1 : 0) + (acuanTanggal !== "both" ? 1 : 0) + (selModelLp ? 1 : 0) + (selClosureReason ? 1 : 0);`;
  updated = updated.slice(0, watermarkLineIdx) + newWatermarkCode + updated.slice(watermarkSemiIdx + 1);
}

// Pass NRP to archiveLoadedInfo in handleOpenArchive
const oldArchInfo = `setArchiveLoadedInfo({
          id: detail.id,
          stamp: detail.security_stamp,
          date: detail.created_at,
          operator: detail.user_nama || "Petugas"
        });`;
const newArchInfo = `setArchiveLoadedInfo({
          id: detail.id,
          stamp: detail.security_stamp,
          date: detail.created_at,
          operator: detail.user_nama || "Petugas",
          nrp: (snap && snap.printedByNrp) || detail.user_nrp || ""
        });`;
updated = updated.replace(oldArchInfo, newArchInfo);

// Add table insertion & editing helper functions inside component
const targetExecCmd = 'let execCmd = (0,a.useCallback)((cmd, val = null) => {';
const newTableHelper = `function handleInsertTable() {
      var tableHtml = '<div class="anev-custom-table-box" style="margin:1rem 0;width:100%;box-sizing:border-box;"><div style="font-weight:700;font-size:0.83rem;margin-bottom:6px;color:#1e40af;" contenteditable="true">Tabel Tambahan: [Ketik Judul Tabel]</div><table class="anev-table-naskah" style="width:100%;border-collapse:collapse;font-size:0.76rem;" contenteditable="true"><thead><tr><th style="width:8%;background:#f1f5f9;border:1px solid #94a3b8;padding:5px;text-align:center;">No</th><th style="width:42%;background:#f1f5f9;border:1px solid #94a3b8;padding:5px;text-align:left;">Uraian / Indikator</th><th style="width:25%;background:#f1f5f9;border:1px solid #94a3b8;padding:5px;text-align:center;">Target / Baseline</th><th style="width:25%;background:#f1f5f9;border:1px solid #94a3b8;padding:5px;text-align:center;">Realisasi / Keterangan</th></tr></thead><tbody><tr><td style="border:1px solid #cbd5e1;padding:5px;text-align:center;">1</td><td style="border:1px solid #cbd5e1;padding:5px;">Data indikator lapangan</td><td style="border:1px solid #cbd5e1;padding:5px;text-align:center;">100%</td><td style="border:1px solid #cbd5e1;padding:5px;text-align:center;">Selesai</td></tr><tr><td style="border:1px solid #cbd5e1;padding:5px;text-align:center;">2</td><td style="border:1px solid #cbd5e1;padding:5px;">Data indikator operasional</td><td style="border:1px solid #cbd5e1;padding:5px;text-align:center;">-</td><td style="border:1px solid #cbd5e1;padding:5px;text-align:center;">Proses</td></tr></tbody></table></div><p><br></p>';
      var sel = window.getSelection();
      var ok = false;
      if (sel && sel.rangeCount > 0) {
        var node = sel.anchorNode;
        var inEditor = node ? (node.nodeType === 1 ? node : node.parentElement).closest('.anev-page-content') : null;
        if (inEditor) {
          try {
            document.execCommand('insertHTML', false, tableHtml);
            ok = true;
          } catch(e) {}
        }
      }
      if (!ok) {
        var pages = document.querySelectorAll('.anev-page-content');
        if (pages.length > 0) {
          var temp = document.createElement('div');
          temp.innerHTML = tableHtml;
          while (temp.firstChild) {
            pages[0].appendChild(temp.firstChild);
          }
          ok = true;
        }
      }
      toastRef.current?.show({ severity: "info", summary: "Tabel Disisipkan", detail: "Tabel baru berhasil disisipkan. Anda dapat mengubah isi, menambah baris, atau menghapusnya.", life: 3000 });
    }

    function handleDeleteTable() {
      var sel = window.getSelection();
      var node = sel && sel.anchorNode;
      var el = node ? (node.nodeType === 1 ? node : node.parentElement) : null;
      var target = el ? el.closest('table, .anev-custom-table-box') : null;
      if (target) {
        var box = target.closest('.anev-custom-table-box') || target;
        box.remove();
        toastRef.current?.show({ severity: "warn", summary: "Tabel Dihapus", detail: "Tabel berhasil dihapus dari naskah.", life: 2500 });
      } else {
        toastRef.current?.show({ severity: "info", summary: "Hapus Tabel", detail: "Letakkan kursor di dalam tabel yang ingin dihapus, lalu klik tombol Hapus Tabel.", life: 3500 });
      }
    }

    function handleAddTableRow() {
      var sel = window.getSelection();
      var node = sel && sel.anchorNode;
      var el = node ? (node.nodeType === 1 ? node : node.parentElement) : null;
      var tr = el ? el.closest('tr') : null;
      var table = tr ? tr.closest('table') : (el ? el.closest('table') : null);
      if (table) {
        var tbody = table.querySelector('tbody') || table;
        var colCount = 0;
        var headerRow = table.querySelector('thead tr') || tbody.querySelector('tr');
        if (headerRow) {
          Array.from(headerRow.children).forEach(function(th) {
            colCount += parseInt(th.getAttribute('colspan') || '1', 10);
          });
        }
        if (colCount <= 0) colCount = 4;
        var newTr = document.createElement('tr');
        for (var c = 0; c < colCount; c++) {
          var td = document.createElement('td');
          td.style.border = '1px solid #cbd5e1';
          td.style.padding = '4.5px 6px';
          td.innerHTML = c === 0 ? String(tbody.querySelectorAll('tr').length + 1) : '-';
          if (c === 0) td.style.textAlign = 'center';
          newTr.appendChild(td);
        }
        if (tr && tr.parentElement === tbody) {
          tr.after(newTr);
        } else {
          tbody.appendChild(newTr);
        }
        toastRef.current?.show({ severity: "success", summary: "Baris Ditambahkan", detail: "Baris baru berhasil ditambahkan ke tabel.", life: 2000 });
      } else {
        toastRef.current?.show({ severity: "info", summary: "Tambah Baris", detail: "Letakkan kursor di dalam tabel tempat Anda ingin menambah baris.", life: 3500 });
      }
    }

    function handleDeleteTableRow() {
      var sel = window.getSelection();
      var node = sel && sel.anchorNode;
      var el = node ? (node.nodeType === 1 ? node : node.parentElement) : null;
      var tr = el ? el.closest('tr') : null;
      if (tr) {
        var tbody = tr.parentElement;
        if (tbody && tbody.children.length > 1) {
          tr.remove();
          toastRef.current?.show({ severity: "warn", summary: "Baris Dihapus", detail: "Baris berhasil dihapus.", life: 2000 });
        } else {
          var table = tr.closest('table');
          var box = table ? (table.closest('.anev-custom-table-box') || table) : null;
          if (box) box.remove();
          toastRef.current?.show({ severity: "warn", summary: "Tabel Dihapus", detail: "Baris terakhir dihapus beserta tabelnya.", life: 2500 });
        }
      } else {
        toastRef.current?.show({ severity: "info", summary: "Hapus Baris", detail: "Letakkan kursor di baris tabel yang ingin dihapus.", life: 3500 });
      }
    }

    function handleInsertSpace() {
      var sel = window.getSelection();
      var ok = false;
      if (sel && sel.rangeCount > 0) {
        var node = sel.anchorNode;
        var inEditor = node ? (node.nodeType === 1 ? node : node.parentElement).closest('.anev-page-content') : null;
        if (inEditor) {
          try {
            document.execCommand('insertHTML', false, '<p style="margin:0.8rem 0;"><br></p>');
            ok = true;
          } catch(e) {}
        }
      }
      if (!ok) {
        var pages = document.querySelectorAll('.anev-page-content');
        if (pages.length > 0) {
          var p = document.createElement('p');
          p.style.margin = '0.8rem 0';
          p.innerHTML = '<br>';
          pages[0].appendChild(p);
        }
      }
      toastRef.current?.show({ severity: "info", summary: "Spasi Ditambahkan", detail: "Ruang paragraf baru telah disisipkan.", life: 2000 });
    }
`;

updated = updated.replace(targetExecCmd, newTableHelper + '\n    ' + targetExecCmd);

// In handlePrintAndArchive, use docStamp and docHash
updated = updated.replace(
  'let secStamp = "STAMP-" + Date.now().toString(16).toUpperCase();',
  'let secStamp = docStamp;'
);
updated = updated.replace(
  'contentHash: "SHA256-" + Date.now().toString(36).toUpperCase()',
  'contentHash: docHash'
);
updated = updated.replace(
  'detail: "Security Stamp: " + secStamp + ". Membuka jendela cetak dinas..."',
  'detail: "Kode CAS: " + secStamp + ". Membuka jendela cetak dinas..."'
);

// Replace the entire Pejabat Penandatangan calculation with interactive guide defaults (let user change it themselves)
const oldPejabatStart = updated.indexOf('// Setting Pejabat Penandatangan');
const oldPejabatEnd = updated.indexOf('// Susun Narasi Situasi Umum / Pendahuluan');
if (oldPejabatStart === -1 || oldPejabatEnd === -1) {
  throw new Error('Pejabat Penandatangan section not found in source!');
}
const newPejabatBlock = `// Setting Pejabat Penandatangan (Kotak Panduan Interaktif - Dibiarkan diganti sendiri oleh operator)
        setArchiveLoadedInfo(null);
        setPejabatTempatTanggal(prev => prev || ("Jakarta, " + new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })));
        setPejabatJabatan(prev => prev || "[JABATAN]");
        setPejabatNama(prev => prev || "[NAMA PENANDATANGAN]");
        setPejabatPangkat(prev => prev || "[PANGKAT] NRP [NO NRP]");

        `;
updated = updated.slice(0, oldPejabatStart) + newPejabatBlock + updated.slice(oldPejabatEnd);

// Replace default period with previous month (bulan kemarin) because current month is ongoing
const oldDateState = `    let now = new Date();
    let [selYear, setSelYear] = (0,a.useState)(now.getFullYear());
    let [selMonth, setSelMonth] = (0,a.useState)(now.getMonth() + 1);
    let [selDate, setSelDate] = (0,a.useState)(now.toISOString().slice(0, 10));
    let [selWeek, setSelWeek] = (0,a.useState)(Math.ceil(now.getDate() / 7));
    let [selQuarter, setSelQuarter] = (0,a.useState)(Math.floor(now.getMonth() / 3) + 1);
    let [selSemester, setSelSemester] = (0,a.useState)(now.getMonth() < 6 ? 1 : 2);
    let [customStart, setCustomStart] = (0,a.useState)(now.toISOString().slice(0, 10));
    let [customEnd, setCustomEnd] = (0,a.useState)(now.toISOString().slice(0, 10));`;

const newDateState = `    let now = new Date();
    // Default periode adalah bulan kemarin karena bulan berjalan datanya belum lengkap 100%
    let prevMDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    let defYear = prevMDate.getFullYear();
    let defMonth = prevMDate.getMonth() + 1; // 1-12
    let defQuarter = Math.floor((defMonth - 1) / 3) + 1;
    let defSemester = defMonth <= 6 ? 1 : 2;
    let defLastDay = new Date(defYear, defMonth, 0).getDate();
    let defMonthStr = String(defMonth).padStart(2, "0");
    let [selYear, setSelYear] = (0,a.useState)(defYear);
    let [selMonth, setSelMonth] = (0,a.useState)(defMonth);
    let [selDate, setSelDate] = (0,a.useState)(now.toISOString().slice(0, 10));
    let [selWeek, setSelWeek] = (0,a.useState)(Math.ceil(now.getDate() / 7));
    let [selQuarter, setSelQuarter] = (0,a.useState)(defQuarter);
    let [selSemester, setSelSemester] = (0,a.useState)(defSemester);
    let [customStart, setCustomStart] = (0,a.useState)(defYear + "-" + defMonthStr + "-01");
    let [customEnd, setCustomEnd] = (0,a.useState)(defYear + "-" + defMonthStr + "-" + String(defLastDay).padStart(2, "0"));`;

updated = updated.replace(oldDateState, newDateState);

// Replace default header baris 3 with default previous month
updated = updated.replace(
  'let [headerBaris3, setHeaderBaris3] = (0,a.useState)("PERIODE OKTOBER 2026");',
  'let [headerBaris3, setHeaderBaris3] = (0,a.useState)(() => "PERIODE " + (b[defMonth - 1] ? b[defMonth - 1].toUpperCase() : "SEPTEMBER") + " " + defYear);'
);

updated = updated.replace(
  'let pUpper = pLabel ? pLabel.toUpperCase() : "OKTOBER 2026";',
  'let pUpper = pLabel ? pLabel.toUpperCase() : ((b[defMonth - 1] ? b[defMonth - 1].toUpperCase() : "SEPTEMBER") + " " + defYear);'
);

// Replace initial state with template placeholders
updated = updated.replace(
  'let [pejabatJabatan, setPejabatJabatan] = (0,a.useState)("KEPALA BADAN RESERSE KRIMINAL POLRI");',
  'let [pejabatJabatan, setPejabatJabatan] = (0,a.useState)("[JABATAN]");'
);
updated = updated.replace(
  'let [pejabatNama, setPejabatNama] = (0,a.useState)("WAHYU WIDADA, M.Phil.");',
  'let [pejabatNama, setPejabatNama] = (0,a.useState)("[NAMA PENANDATANGAN]");'
);
updated = updated.replace(
  'let [pejabatPangkat, setPejabatPangkat] = (0,a.useState)("KOMISARIS JENDERAL POLISI");',
  'let [pejabatPangkat, setPejabatPangkat] = (0,a.useState)("[PANGKAT] NRP [NO NRP]");'
);

// Save and restore tempatTanggal in snapshot
updated = updated.replace(
  'pejabat: { kota: pejabatKota, jabatan: pejabatJabatan, nama: pejabatNama, pangkat: pejabatPangkat },',
  'pejabat: { tempatTanggal: pejabatTempatTanggal, kota: pejabatKota, jabatan: pejabatJabatan, nama: pejabatNama, pangkat: pejabatPangkat },'
);
const oldSnapPejabat = `if (snap.pejabat) {
          setPejabatKota(snap.pejabat.kota || "Jakarta");
          setPejabatJabatan(snap.pejabat.jabatan || "KEPALA BADAN RESERSE KRIMINAL POLRI");
          setPejabatNama(snap.pejabat.nama || "-");
          setPejabatPangkat(snap.pejabat.pangkat || "-");
        }`;
const newSnapPejabat = `if (snap.pejabat) {
          if (snap.pejabat.tempatTanggal) setPejabatTempatTanggal(snap.pejabat.tempatTanggal);
          if (snap.pejabat.kota) setPejabatKota(snap.pejabat.kota);
          if (snap.pejabat.jabatan) setPejabatJabatan(snap.pejabat.jabatan);
          if (snap.pejabat.nama) setPejabatNama(snap.pejabat.nama);
          if (snap.pejabat.pangkat) setPejabatPangkat(snap.pejabat.pangkat);
        }`;
updated = updated.replace(oldSnapPejabat, newSnapPejabat);

// Replace the sticky header filter section with the Unified Filter Button from Kinerja Perkara
const oldHeaderStart = '// STICKY HEADER DINAS & TOOLBAR WYSIWYG (MS WORD / GOOGLE DOCS)';
const oldHeaderEnd = '// Baris 3: MS Word / Google Docs Toolbar';

const headerStartIdx = updated.indexOf(oldHeaderStart);
const headerEndIdx = updated.indexOf(oldHeaderEnd);

const newUnifiedFilterHeader = `// STICKY HEADER DINAS & TOOLBAR WYSIWYG (MS WORD / GOOGLE DOCS)
      (0,t.jsxs)("div",{className:"anev-sticky-header anev-no-print",children:[
        // Baris 1: Brand, Mode Status Badge & Action / Tab Switcher
        (0,t.jsxs)("div",{className:"anev-sticky-top-bar",children:[
          (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.6rem"},children:[
            (0,t.jsx)("div",{style:{width:"30px",height:"30px",borderRadius:"6px",background:"#2563eb",color:"#ffffff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:"1rem"},children:"📋"}),
            (0,t.jsxs)("div",{children:[
              (0,t.jsx)("h1",{style:{fontSize:"0.98rem",fontWeight:800,margin:0,color:"#0f172a"},children:"Anev Periodik Komprehensif Dinas"}),
              (0,t.jsxs)("div",{style:{fontSize:"0.7rem",color:"#64748b",display:"flex",alignItems:"center",gap:"0.4rem"},children:[
                (0,t.jsx)("span",{style:{fontWeight:700,color:"#2563eb"},children:headerBaris2}),
                (0,t.jsx)("span",{children:"•"}),
                (0,t.jsx)("span",{children:headerBaris3})
              ]})
            ]}),
            // Dynamic Status Badge (Pembeda Nyata Draft vs Arsip)
            activeTab === "arsip" ? (
              (0,t.jsxs)("span",{style:{marginLeft:"0.6rem",background:"#fef3c7",color:"#92400e",border:"1px solid #fde68a",padding:"3px 8px",borderRadius:"12px",fontSize:"0.7rem",fontWeight:800,display:"inline-flex",alignItems:"center",gap:"4px"},children:[
                (0,t.jsx)("i",{className:"pi pi-folder-open",style:{fontSize:"0.7rem"}}),
                "RUANG ARSIP"
              ]})
            ) : archiveLoadedInfo ? (
              (0,t.jsxs)("span",{style:{marginLeft:"0.6rem",background:"#fffbeb",color:"#b45309",border:"1.5px solid #f59e0b",padding:"3px 8px",borderRadius:"12px",fontSize:"0.7rem",fontWeight:800,display:"inline-flex",alignItems:"center",gap:"4px"},children:[
                (0,t.jsx)("i",{className:"pi pi-lock",style:{fontSize:"0.7rem"}}),
                "ARSIP #" + archiveLoadedInfo.id
              ]})
            ) : (
              (0,t.jsxs)("span",{style:{marginLeft:"0.6rem",background:"#ecfdf5",color:"#065f46",border:"1.5px solid #a7f3d0",padding:"3px 8px",borderRadius:"12px",fontSize:"0.7rem",fontWeight:800,display:"inline-flex",alignItems:"center",gap:"4px"},children:[
                (0,t.jsx)("span",{style:{width:"6px",height:"6px",borderRadius:"50%",background:"#10b981",display:"inline-block"}}),
                "DRAFT AKTIF"
              ]})
            )
          ]}),

          // Button Group Kinerja Perkara & Tab Switcher
          (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.45rem",flexWrap:"wrap",position:"relative"},children:[
            // TAB SWITCHER: [ 📄 Naskah / Draft ] vs [ 📁 Arsip Dokumen ]
            (0,t.jsxs)("div",{style:{display:"inline-flex",background:"#e2e8f0",padding:"2px",borderRadius:"6px",marginRight:"2px"},children:[
              (0,t.jsxs)(c.Button,{
                label: "📄 Naskah / Draft",
                size: "small",
                text: activeTab !== "lampiran",
                severity: activeTab === "lampiran" ? "primary" : "secondary",
                onClick: () => setActiveTab("lampiran"),
                style: { fontWeight: 700, borderRadius: "5px", padding: "4px 10px", fontSize: "0.76rem", height: "30px" }
              }),
              (0,t.jsxs)(c.Button,{
                label: "📁 Arsip Dokumen",
                size: "small",
                text: activeTab !== "arsip",
                severity: activeTab === "arsip" ? "primary" : "secondary",
                onClick: () => setActiveTab("arsip"),
                style: { fontWeight: 700, borderRadius: "5px", padding: "4px 10px", fontSize: "0.76rem", height: "30px" }
              })
            ]}),



            // If in Lampiran mode:
            activeTab === "lampiran" && (0,t.jsxs)(t.Fragment,{children:[
              // UNIFIED FILTER BUTTON PERSIS KINERJA PERKARA
              (0,t.jsx)(c.Button,{
                label: "Filter Perkara (" + activeFilterCount + ") ▾",
                icon: "pi pi-sliders-h",
                outlined: !unifiedFilterOpen,
                onClick: () => setUnifiedFilterOpen(v => !v),
                className: "att-btn kp-filter-trigger-btn" + (unifiedFilterOpen ? " active" : ""),
                style: { fontWeight: 700, height: "32px", fontSize: "0.78rem" }
              }),

              // Backdrop click to close
              unifiedFilterOpen && (0,t.jsx)("div",{
                style: { position: "fixed", inset: 0, zIndex: 2490 },
                onClick: () => setUnifiedFilterOpen(false)
              }),

              // UNIFIED FILTER POPOVER CARD PERSIS KINERJA PERKARA
              unifiedFilterOpen && (0,t.jsxs)("div",{
                className: "kp-modal-card kp-filter-popover",
                style: { position: "absolute", top: "42px", right: 0, zIndex: 2500, width: "560px", maxWidth: "92vw", background: "#ffffff", borderRadius: "8px", boxShadow: "0 14px 40px rgba(0,0,0,0.22)", border: "1px solid #cbd5e1" },
                children: [
                  (0,t.jsxs)("div",{className:"kp-modal-header",style:{padding:"0.85rem 1.1rem",borderBottom:"1px solid #e2e8f0",display:"flex",alignItems:"center",justifyContent:"space-between"},children:[
                    (0,t.jsxs)("div",{children:[
                      (0,t.jsx)("div",{className:"kp-modal-title",style:{fontSize:"0.95rem",fontWeight:800,color:"#0f172a"},children:"🎛️ Filter & Parameter Kinerja Perkara & Anev"}),
                      (0,t.jsx)("div",{className:"kp-modal-sub",style:{fontSize:"0.72rem",color:"#64748b"},children:"Atur periode, satker kewilayahan, klasifikasi kejahatan, dan parameter analisis"})
                    ]}),
                    (0,t.jsx)("button",{type:"button",onClick:()=>setUnifiedFilterOpen(false),style:{background:"transparent",border:"none",fontSize:"1.2rem",cursor:"pointer",color:"#94a3b8",fontWeight:700},children:"×"})
                  ]}),
                  // Tab Bar (Persis Kinerja Perkara)
                  (0,t.jsx)("div",{className:"kp-tab-bar",style:{display:"flex",borderBottom:"1px solid #e2e8f0",background:"#f8fafc"},children:[
                    { idx: 0, label: "📅 Periode" },
                    { idx: 1, label: "🏛️ Satker & Wilayah" },
                    { idx: 2, label: "⚖️ Kejahatan" },
                    { idx: 3, label: "⚙️ Parameter & Model" }
                  ].map(tb => (0,t.jsx)("button",{
                    key: tb.idx,
                    type: "button",
                    onClick: () => setUnifiedFilterTab(tb.idx),
                    style: { flex: 1, padding: "8px 10px", fontSize: "0.76rem", fontWeight: 700, border: "none", borderBottom: unifiedFilterTab === tb.idx ? "2.5px solid #2563eb" : "2.5px solid transparent", background: unifiedFilterTab === tb.idx ? "#ffffff" : "transparent", color: unifiedFilterTab === tb.idx ? "#1d4ed8" : "#64748b", cursor: "pointer" },
                    children: tb.label
                  }))}),
                  // Tab Content Body
                  (0,t.jsxs)("div",{className:"kp-modal-body",style:{padding:"1rem 1.1rem",display:"grid",gap:"0.8rem",maxHeight:"60vh",overflowY:"auto"},children:[
                    // TAB 0: PERIODE (Persis KP: Bulan | Tahun | Custom)
                    unifiedFilterTab === 0 && (0,t.jsxs)("div",{style:{display:"grid",gap:"0.75rem"},children:[
                      (0,t.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:"0.4rem"},children:[
                        ["month","Bulan"],["year","Tahun"],["custom","Custom"]
                      ].map(([pVal, pText]) => (0,t.jsx)(c.Button,{
                        key: pVal,
                        label: pText,
                        size: "small",
                        outlined: kpPeriodMode !== pVal,
                        onClick: () => setKpPeriodMode(pVal),
                        style: { fontSize: "0.75rem", height: "30px", fontWeight: 700 }
                      }))}),
                      kpPeriodMode === "month" && (0,t.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.6rem"},children:[
                        (0,t.jsx)(l.Dropdown,{value:selMonth,options:b.map((nm,i)=>({label:nm,value:i+1})),onChange:e=>setSelMonth(e.value),placeholder:"Pilih Bulan",style:{width:"100%",fontSize:"0.76rem"}}),
                        (0,t.jsx)(l.Dropdown,{value:selYear,options:[2024,2025,2026].map(y=>({label:String(y),value:y})),onChange:e=>setSelYear(e.value),placeholder:"Pilih Tahun",style:{width:"100%",fontSize:"0.76rem"}})
                      ]}),
                      kpPeriodMode === "year" && (0,t.jsx)(l.Dropdown,{
                        value: selYear,
                        options: [2024,2025,2026].map(y=>({label:"Tahun " + y, value:y})),
                        onChange: e => setSelYear(e.value),
                        placeholder: "Pilih Tahun",
                        style: { width: "100%", fontSize: "0.76rem" }
                      }),
                      kpPeriodMode === "custom" && (0,t.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.6rem"},children:[
                        (0,t.jsxs)("div",{children:[
                          (0,t.jsx)("label",{style:{display:"block",fontSize:"0.72rem",fontWeight:700,marginBottom:"0.2rem",color:"#475569"},children:"Dari Tanggal"}),
                          (0,t.jsx)(s.InputText,{type:"date",value:customStart,onChange:e=>setCustomStart(e.target.value),style:{width:"100%",fontSize:"0.78rem"}})
                        ]}),
                        (0,t.jsxs)("div",{children:[
                          (0,t.jsx)("label",{style:{display:"block",fontSize:"0.72rem",fontWeight:700,marginBottom:"0.2rem",color:"#475569"},children:"Sampai Tanggal"}),
                          (0,t.jsx)(s.InputText,{type:"date",value:customEnd,onChange:e=>setCustomEnd(e.target.value),style:{width:"100%",fontSize:"0.78rem"}})
                        ]})
                      ]}),
                      (0,t.jsx)("div",{style:{fontSize:"0.70rem",color:"#059669",background:"#ecfdf5",padding:"6px 10px",borderRadius:"5px",border:"1px solid #a7f3d0"},children:"💡 Catatan: Default laporan mengacu pada bulan kemarin karena data bulan berjalan masih bergerak belum 100%."})
                    ]}),

                    // TAB 1: SATKER & WILAYAH (Persis KP: Nasional/Regional, Wilayah, Cakupan Satker)
                    unifiedFilterTab === 1 && (0,t.jsxs)("div",{style:{display:"grid",gap:"0.7rem"},children:[
                      (0,t.jsxs)("div",{children:[
                        (0,t.jsx)("label",{style:{display:"block",fontSize:"0.72rem",fontWeight:700,color:"#334155",marginBottom:"0.2rem"},children:"1. Kelompok Data"}),
                        (0,t.jsx)(l.Dropdown,{
                          value: eScope,
                          options: [
                            { label: "Kelompok Nasional (Mabes & Seluruh Polda)", value: "national" },
                            { label: "Kelompok Regional (Polda / Satker)", value: "scoped" }
                          ],
                          onChange: e => eSetScope(e.value),
                          style: { width: "100%", fontSize: "0.78rem" }
                        })
                      ]}),
                      eScope === "scoped" && (0,t.jsxs)("div",{children:[
                        (0,t.jsx)("label",{style:{display:"block",fontSize:"0.72rem",fontWeight:700,color:"#334155",marginBottom:"0.2rem"},children:"2. Wilayah Regional"}),
                        (0,t.jsx)(l.Dropdown,{
                          value: selSatkerId,
                          options: satkerList.map(s => ({ label: s.nama, value: s.id })),
                          onChange: e => setSelSatkerId(e.value),
                          placeholder: "Pilih Polda / Satuan Kerja...",
                          filter: !0,
                          style: { width: "100%", fontSize: "0.78rem" }
                        })
                      ]}),
                      (0,t.jsxs)("div",{children:[
                        (0,t.jsx)("label",{style:{display:"block",fontSize:"0.72rem",fontWeight:700,color:"#334155",marginBottom:"0.2rem"},children:"3. Cakupan Satker"}),
                        (0,t.jsx)(l.Dropdown,{
                          value: eFD,
                          options: [
                            { label: "Internal Reserse (Bareskrim, Ditreskrim, Satreskrim)", value: "INTERNAL_RESERSE" },
                            { label: "Eksternal Reserse / Non-Reserse (Lantas, Sabhara, Polsek)", value: "EKSTERNAL_RESERSE" }
                          ],
                          onChange: e => setEFD(e.value),
                          style: { width: "100%", fontSize: "0.78rem" }
                        })
                      ]})
                    ]}),

                    // TAB 2: KEJAHATAN (Persis KP: Kelompok Induk, Sub-TIPID, Golongan, Jenis)
                    unifiedFilterTab === 2 && (0,t.jsxs)("div",{style:{display:"grid",gap:"0.7rem"},children:[
                      (0,t.jsxs)("div",{children:[
                        (0,t.jsx)("label",{style:{display:"block",fontSize:"0.72rem",fontWeight:700,color:"#334155",marginBottom:"0.2rem"},children:"1. Kelompok Induk Kejahatan"}),
                        (0,t.jsx)(l.Dropdown,{
                          value: activeKelompokCrime,
                          options: [
                            { label: "Semua Kelompok", value: "ALL" },
                            { label: "KRIMUM (Kriminal Umum)", value: "KRIMUM" },
                            { label: "KRIMSUS (Kriminal Khusus)", value: "KRIMSUS" },
                            { label: "NARKOBA (Narkotika)", value: "NARKOBA" }
                          ],
                          onChange: e => {
                            let kVal = e.value;
                            setActiveKelompokCrime(kVal);
                            setActiveTipidCrime("ALL");
                          },
                          style: { width: "100%", fontSize: "0.78rem" }
                        })
                      ]}),
                      (0,t.jsxs)("div",{children:[
                        (0,t.jsx)("label",{style:{display:"block",fontSize:"0.72rem",fontWeight:700,color:"#334155",marginBottom:"0.2rem"},children:"2. Sub-Kelompok TIPID"}),
                        (0,t.jsx)(l.Dropdown,{
                          value: activeTipidCrime,
                          options: (activeKelompokCrime === "KRIMSUS" ? [
                            { label: "Semua Krimsus", value: "ALL" },
                            { label: "TIPIDSIBER (Siber & ITE)", value: "TIPIDSIBER" },
                            { label: "TIPIDEKSUS (Ekonomi Khusus)", value: "TIPIDEKSUS" },
                            { label: "TIPIDKOR (Korupsi)", value: "TIPIDKOR" },
                            { label: "TIPIDTER (Tertentu)", value: "TIPIDTER" }
                          ] : activeKelompokCrime === "KRIMUM" ? [
                            { label: "Semua Krimum", value: "ALL" },
                            { label: "TIPIDUM (Pidana Umum)", value: "TIPIDUM" },
                            { label: "TIPIDPPAPPO (PPA & PPO)", value: "TIPIDPPAPPO" }
                          ] : activeKelompokCrime === "NARKOBA" ? [
                            { label: "Semua Narkoba", value: "ALL" },
                            { label: "TIPIDNARKOBA (Narkotika)", value: "TIPIDNARKOBA" }
                          ] : [
                            { label: "Semua TIPID", value: "ALL" },
                            { label: "TIPIDUM (Pidana Umum)", value: "TIPIDUM" },
                            { label: "TIPIDPPAPPO (PPA & PPO)", value: "TIPIDPPAPPO" },
                            { label: "TIPIDEKSUS (Ekonomi Khusus)", value: "TIPIDEKSUS" },
                            { label: "TIPIDKOR (Korupsi)", value: "TIPIDKOR" },
                            { label: "TIPIDTER (Tertentu)", value: "TIPIDTER" },
                            { label: "TIPIDSIBER (Siber & ITE)", value: "TIPIDSIBER" },
                            { label: "TIPIDNARKOBA (Narkotika)", value: "TIPIDNARKOBA" }
                          ]),
                          onChange: e => setActiveTipidCrime(e.value),
                          style: { width: "100%", fontSize: "0.78rem" }
                        })
                      ]}),
                      (0,t.jsxs)("div",{children:[
                        (0,t.jsx)("label",{style:{display:"block",fontSize:"0.72rem",fontWeight:700,color:"#334155",marginBottom:"0.2rem"},children:"3. Golongan Kejahatan"}),
                        (0,t.jsx)(l.Dropdown,{
                          value: selGolonganId,
                          options: [
                            { label: "Semua Golongan (I s.d. IV)", value: "" },
                            { label: "Golongan I - Kejahatan Konvensional", value: "1" },
                            { label: "Golongan II - Kejahatan Transnasional", value: "2" },
                            { label: "Golongan III - Kejahatan Terhadap Kekayaan Negara", value: "3" },
                            { label: "Golongan IV - Kejahatan Berimplikasi Kontinjensi", value: "4" }
                          ],
                          onChange: e => setSelGolonganId(e.value),
                          style: { width: "100%", fontSize: "0.78rem" }
                        })
                      ]})
                    ]}),

                    // TAB 3: PARAMETER & MODEL (Persis KP: Acuan Tanggal, Model LP, RJ, Bucket)
                    unifiedFilterTab === 3 && (0,t.jsxs)("div",{style:{display:"grid",gap:"0.7rem"},children:[
                      (0,t.jsxs)("div",{children:[
                        (0,t.jsx)("label",{style:{display:"block",fontSize:"0.72rem",fontWeight:700,color:"#334155",marginBottom:"0.2rem"},children:"1. Acuan Tanggal Perhitungan"}),
                        (0,t.jsx)(l.Dropdown,{
                          value: acuanTanggal,
                          options: [
                            { label: "Kombinasi Tanggal Kejadian & Lapor (Standar KP)", value: "both" },
                            { label: "Berdasarkan Tanggal Kejadian Perkara", value: "kejadian" },
                            { label: "Berdasarkan Tanggal Laporan Polisi", value: "lapor" }
                          ],
                          onChange: e => setAcuanTanggal(e.value),
                          style: { width: "100%", fontSize: "0.78rem" }
                        })
                      ]}),
                      (0,t.jsxs)("div",{children:[
                        (0,t.jsx)("label",{style:{display:"block",fontSize:"0.72rem",fontWeight:700,color:"#334155",marginBottom:"0.2rem"},children:"2. Model Laporan Polisi (LP)"}),
                        (0,t.jsx)(l.Dropdown,{
                          value: selModelLp,
                          options: [
                            { label: "Semua Model (Model A & B)", value: "" },
                            { label: "Model A (Temuan / Inisiatif Polri)", value: "A" },
                            { label: "Model B (Laporan Masyarakat)", value: "B" }
                          ],
                          onChange: e => setSelModelLp(e.value),
                          style: { width: "100%", fontSize: "0.78rem" }
                        })
                      ]}),
                      (0,t.jsxs)("div",{children:[
                        (0,t.jsx)("label",{style:{display:"block",fontSize:"0.72rem",fontWeight:700,color:"#334155",marginBottom:"0.2rem"},children:"3. Jalur Penyelesaian / Closure Reason"}),
                        (0,t.jsx)(l.Dropdown,{
                          value: selClosureReason,
                          options: [
                            { label: "Semua Penyelesaian Perkara", value: "" },
                            { label: "Restorative Justice (Keadilan Restoratif)", value: "RJ" },
                            { label: "Selain Restorative Justice (P21, SP3, SP2Lid)", value: "NON_RJ" }
                          ],
                          onChange: e => setSelClosureReason(e.value),
                          style: { width: "100%", fontSize: "0.78rem" }
                        })
                      ]}),
                      (0,t.jsxs)("div",{children:[
                        (0,t.jsx)("label",{style:{display:"block",fontSize:"0.72rem",fontWeight:700,color:"#334155",marginBottom:"0.2rem"},children:"4. Mode Kinerja (Bucket)"}),
                        (0,t.jsx)(l.Dropdown,{
                          value: eBucket,
                          options: [
                            { label: "Usia Perkara (Age Bucket - Default)", value: "age" },
                            { label: "Tingkat Kesulitan Penanganan", value: "difficulty" }
                          ],
                          onChange: e => setEBucket(e.value),
                          style: { width: "100%", fontSize: "0.78rem" }
                        })
                      ]})
                    ]})
                  ]}),
                  // Footer Popover: Reset, Batal, Terapkan
                  (0,t.jsxs)("div",{className:"kp-modal-footer",style:{padding:"0.75rem 1.1rem",background:"#f8fafc",borderTop:"1px solid #e2e8f0",display:"flex",alignItems:"center",justifyContent:"space-between"},children:[
                    (0,t.jsx)(c.Button,{
                      label: "Reset Default",
                      icon: "pi pi-refresh",
                      text: !0,
                      size: "small",
                      severity: "secondary",
                      onClick: () => {
                        setKpPeriodMode("month");
                        setSelMonth(defMonth);
                        setSelYear(defYear);
                        setPeriodeTipe("BULANAN");
                        setCustomStart(defYear + "-" + defMonthStr + "-01");
                        setCustomEnd(defYear + "-" + defMonthStr + "-" + String(defLastDay).padStart(2, "0"));
                        setEScope("national");
                        setSelSatkerId(null);
                        setEFD("INTERNAL_RESERSE");
                        setActiveKelompokCrime("ALL");
                        setActiveTipidCrime("ALL");
                        setSelGolonganId("");
                        setAcuanTanggal("both");
                        setSelModelLp("");
                        setSelClosureReason("");
                        setEBucket("age");
                      },
                      style: { fontSize: "0.75rem" }
                    }),
                    (0,t.jsxs)("div",{style:{display:"flex",gap:"0.4rem"},children:[
                      (0,t.jsx)(c.Button,{label:"Batal",text:!0,size:"small",onClick:()=>setUnifiedFilterOpen(false),style:{fontSize:"0.75rem"}}),
                      (0,t.jsx)(c.Button,{
                        label: "Terapkan Filter",
                        icon: "pi pi-check",
                        size: "small",
                        onClick: () => {
                          setUnifiedFilterOpen(false);
                          handleGenerateLampiran();
                        },
                        style: { fontWeight: 700, fontSize: "0.75rem" }
                      })
                    ]})
                  ]})
                ]
              }),

              archiveLoadedInfo ? (
                // In Archive View: Button to return to fresh Draft
                (0,t.jsx)(c.Button,{
                  label: "➕ Ke Naskah Baru (Draft)",
                  icon: "pi pi-plus-circle",
                  size: "small",
                  severity: "info",
                  onClick: () => {
                    setArchiveLoadedInfo(null);
                    handleGenerateLampiran();
                  },
                  title: "Tutup arsip ini dan buat naskah dinas baru",
                  style: { fontWeight: 800, height: "32px", fontSize: "0.78rem" }
                })
              ) : (
                // In Draft View: Susun Naskah & Refresh
                (0,t.jsxs)(t.Fragment,{children:[
                  (0,t.jsx)(c.Button,{
                    label: "⚡ Susun Naskah",
                    size: "small",
                    onClick: handleGenerateLampiran,
                    loading: generating,
                    style: { fontWeight: 700, height: "32px", fontSize: "0.78rem" }
                  }),
                  (0,t.jsx)(c.Button,{
                    icon: "pi pi-refresh",
                    size: "small",
                    outlined: !0,
                    onClick: handleGenerateLampiran,
                    title: "Muat ulang data dari database",
                    style: { height: "32px" }
                  })
                ]})
              )
            ]})
          ]})
        ]}),

        // Active Badges Row (Chips Persis Kinerja Perkara)
        activeFilterCount > 0 && (0,t.jsxs)("div",{style:{fontSize:"0.71rem",color:"#475569",display:"flex",alignItems:"center",gap:"0.4rem",background:"#f8fafc",padding:"0.3rem 0.75rem",borderRadius:"4px",borderTop:"1px solid #f1f5f9",flexWrap:"wrap"},children:[
          (0,t.jsx)("i",{className:"pi pi-sliders-h",style:{color:"#2563eb",fontSize:"0.72rem"}}),
          (0,t.jsx)("strong",{style:{color:"#0f172a"},children:"Filter Aktif:"}),
          (kpPeriodMode !== "month" || selMonth !== defMonth || selYear !== defYear) && (0,t.jsxs)("span",{style:{background:"#dbeafe",color:"#1e40af",padding:"1px 6px",borderRadius:"3px",fontWeight:700},children:["Periode: ",computeDates().pLabel]}),
          (eScope === "scoped" && selSatkerId) && (0,t.jsxs)("span",{style:{background:"#e0e7ff",color:"#3730a3",padding:"1px 6px",borderRadius:"3px",fontWeight:700},children:["Satker: ",satkerList.find(s=>s.id===selSatkerId)?.nama || selSatkerId]}),
          (eFD !== "INTERNAL_RESERSE") && (0,t.jsx)("span",{style:{background:"#f1f5f9",color:"#334155",padding:"1px 6px",borderRadius:"3px",fontWeight:700},children:"Eksternal Reserse"}),
          (activeKelompokCrime !== "ALL") && (0,t.jsxs)("span",{style:{background:"#dcfce7",color:"#166534",padding:"1px 6px",borderRadius:"3px",fontWeight:700},children:["Kelompok: ",activeKelompokCrime]}),
          (activeTipidCrime !== "ALL") && (0,t.jsxs)("span",{style:{background:"#ccfbf1",color:"#115e59",padding:"1px 6px",borderRadius:"3px",fontWeight:700},children:["TIPID: ",activeTipidCrime]}),
          (selGolonganId) && (0,t.jsxs)("span",{style:{background:"#fef3c7",color:"#92400e",padding:"1px 6px",borderRadius:"3px",fontWeight:700},children:["Golongan: ",selGolonganId]}),
          (acuanTanggal !== "both") && (0,t.jsxs)("span",{style:{background:"#ede9fe",color:"#5b21b6",padding:"1px 6px",borderRadius:"3px",fontWeight:700},children:["Acuan: Tgl ",acuanTanggal]}),
          (selModelLp) && (0,t.jsxs)("span",{style:{background:"#fce7f3",color:"#9d174d",padding:"1px 6px",borderRadius:"3px",fontWeight:700},children:["Model: ",selModelLp]}),
          (selClosureReason) && (0,t.jsxs)("span",{style:{background:"#e0e7ff",color:"#3730a3",padding:"1px 6px",borderRadius:"3px",fontWeight:700},children:["Penyelesaian: ",selClosureReason]}),
          (0,t.jsx)("button",{
            type:"button",
            onClick:()=>{
              setKpPeriodMode("month");
              setSelMonth(defMonth);
              setSelYear(defYear);
              setPeriodeTipe("BULANAN");
              setCustomStart(defYear + "-" + defMonthStr + "-01");
              setCustomEnd(defYear + "-" + defMonthStr + "-" + String(defLastDay).padStart(2, "0"));
              setEScope("national");
              setSelSatkerId(null);
              setEFD("INTERNAL_RESERSE");
              setActiveKelompokCrime("ALL");
              setActiveTipidCrime("ALL");
              setSelGolonganId("");
              setAcuanTanggal("both");
              setSelModelLp("");
              setSelClosureReason("");
              setEBucket("age");
            },
            style:{background:"transparent",border:"none",color:"#dc2626",fontSize:"0.71rem",cursor:"pointer",textDecoration:"underline",fontWeight:700,marginLeft:"auto"},
            children:"Reset Semua Filter"
          })
        ]}),
`;

updated = updated.slice(0, headerStartIdx) + newUnifiedFilterHeader + updated.slice(headerEndIdx);

// Add Table & Spacing buttons into the MS Word / Google Docs Toolbar
const targetToolbarButtons = '(0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Cetak Naskah (Ctrl+P)",onMouseDown:e=>{e.preventDefault();window.print()},children:(0,t.jsx)("i",{className:"pi pi-print",style:{fontSize:"0.78rem"}})}),';
const newTableButton = `${targetToolbarButtons}

          (0,t.jsx)("div",{className:"anev-tool-separator"}),

          // TOMBOL MENU TABEL & SPASI (MS WORD / GOOGLE DOCS STYLE)
          (0,t.jsxs)("button",{type:"button",className:"anev-tool-btn",title:"Sisipkan Tabel Baru ke Posisi Kursor",onMouseDown:e=>{e.preventDefault();handleInsertTable()},style:{gap:"3px",fontWeight:700,color:"#1e40af",background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:"4px",padding:"2px 8px"},children:[
            (0,t.jsx)("i",{className:"pi pi-table",style:{fontSize:"0.78rem"}}),
            " Tambah Tabel"
          ]}),
          (0,t.jsxs)("button",{type:"button",className:"anev-tool-btn",title:"Hapus Tabel Tempat Kursor Berada",onMouseDown:e=>{e.preventDefault();handleDeleteTable()},style:{gap:"3px",fontWeight:600,color:"#dc2626",background:"#fef2f2",border:"1px solid #fecaca",borderRadius:"4px",padding:"2px 7px"},children:[
            (0,t.jsx)("i",{className:"pi pi-trash",style:{fontSize:"0.75rem"}}),
            " Hapus Tabel"
          ]}),
          (0,t.jsxs)("button",{type:"button",className:"anev-tool-btn",title:"Tambah Baris ke Tabel",onMouseDown:e=>{e.preventDefault();handleAddTableRow()},style:{gap:"2px",fontSize:"0.74rem",color:"#047857",background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:"4px",padding:"2px 6px"},children:[
            (0,t.jsx)("i",{className:"pi pi-plus",style:{fontSize:"0.7rem"}}),
            " Baris"
          ]}),
          (0,t.jsxs)("button",{type:"button",className:"anev-tool-btn",title:"Hapus Baris dari Tabel",onMouseDown:e=>{e.preventDefault();handleDeleteTableRow()},style:{gap:"2px",fontSize:"0.74rem",color:"#b45309",background:"#fffbeb",border:"1px solid #fde68a",borderRadius:"4px",padding:"2px 6px"},children:[
            (0,t.jsx)("i",{className:"pi pi-minus",style:{fontSize:"0.7rem"}}),
            " Baris"
          ]}),
          (0,t.jsxs)("button",{type:"button",className:"anev-tool-btn",title:"Sisipkan Spasi / Paragraf Kosong ke Bawah (Enter)",onMouseDown:e=>{e.preventDefault();handleInsertSpace()},style:{gap:"3px",fontSize:"0.74rem",color:"#475569",background:"#f8fafc",border:"1px solid #cbd5e1",borderRadius:"4px",padding:"2px 7px"},children:[
            (0,t.jsx)("i",{className:"pi pi-arrow-down-left",style:{fontSize:"0.75rem"}}),
            " Nambah Spasi"
          ]}),`;

updated = updated.replace(targetToolbarButtons, newTableButton);

// REPLACE TAB 2: ARSIP DOKUMEN TERENKRIPSI WITH CLEAR RETURN BUTTONS & DRAFT/ARSIP DISTINCTION
const archStartMarker = '// TAB 2: ARSIP DOKUMEN TERENKRIPSI';
const archStartIdx = updated.indexOf(archStartMarker);
if (archStartIdx === -1) throw new Error('Archive start marker not found');

const archClosingMarker = '\n    ]});\n}])}`';
const archEndIdx = updated.indexOf(archClosingMarker, archStartIdx);
if (archEndIdx === -1) throw new Error('Archive closing marker not found');

const newArchiveTabCode = `// TAB 2: ARSIP DOKUMEN TERENKRIPSI DENGAN TOMBOL KEMBALI JELAS & PEMBEDA DRAFT
      activeTab === "arsip" && (0,t.jsxs)("div",{children:[
        // 1. Header Card with Big Prominent Return Button
        (0,t.jsxs)("div",{className:"cms-card",style:{padding:"1.1rem 1.4rem",marginBottom:"1rem",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"1rem",background:"#ffffff",border:"1px solid #cbd5e1",borderRadius:"8px",boxShadow:"0 2px 8px rgba(0,0,0,0.04)"},children:[
          (0,t.jsxs)("div",{children:[
            (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"8px",marginBottom:"4px"},children:[
              (0,t.jsx)("span",{style:{fontSize:"1.4rem"},children:"📁"}),
              (0,t.jsx)("h2",{style:{fontSize:"1.15rem",fontWeight:900,margin:0,color:"#0f172a"},children:"Ruang Penyimpanan & Arsip Naskah Dinas Lampiran Anev"}),
              (0,t.jsx)("span",{style:{background:"#fef3c7",color:"#92400e",border:"1px solid #fde68a",padding:"2px 8px",borderRadius:"12px",fontSize:"0.7rem",fontWeight:800},children:"TERENKRIPSI & ANTI-TAMPER"})
            ]}),
            (0,t.jsx)("p",{className:"cms-page-sub",style:{margin:0,fontSize:"0.76rem",color:"#64748b"},children:"Daftar naskah dinas resmi yang telah dicetak & tersimpan permanen di database dengan CAS Forensic Stamp. Klik 'Buka Arsip Ini' untuk memuat snapshot dokumen ke lembar kerja."})
          ]}),
          (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.6rem"},children:[
            (0,t.jsx)(c.Button,{
              label: "⬅ Kembali ke Lembar Naskah",
              icon: "pi pi-arrow-left",
              severity: "primary",
              onClick: () => setActiveTab("lampiran"),
              style: { fontWeight: 800, padding: "8px 16px", fontSize: "0.82rem", boxShadow: "0 2px 6px rgba(37,99,235,0.25)" }
            }),
            (0,t.jsx)(c.Button,{
              label: "Segarkan",
              icon: "pi pi-refresh",
              outlined: !0,
              size: "small",
              onClick: loadArchives,
              loading: archiveLoading,
              style: { fontSize: "0.8rem", height: "36px" }
            })
          ]})
        ]}),

        // 2. Edukasi / Penjelas Perbedaan DRAFT vs ARSIP
        (0,t.jsxs)("div",{style:{background:"linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",border:"1.5px solid #cbd5e1",borderRadius:"8px",padding:"0.8rem 1.2rem",marginBottom:"1rem",display:"flex",alignItems:"center",gap:"1.2rem",fontSize:"0.77rem",color:"#334155",boxShadow:"0 1px 3px rgba(0,0,0,0.03)"},children:[
          (0,t.jsx)("div",{style:{fontSize:"1.6rem"},children:"💡"}),
          (0,t.jsxs)("div",{style:{flex:1,display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"},children:[
            (0,t.jsxs)("div",{style:{background:"#ecfdf5",border:"1px solid #a7f3d0",borderRadius:"6px",padding:"0.55rem 0.85rem"},children:[
              (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"6px",fontWeight:800,color:"#065f46",marginBottom:"2px"},children:[
                (0,t.jsx)("span",{children:"📝"}),
                "DRAFT NASKAH DINAS (LEMBAR KERJA)"
              ]}),
              (0,t.jsx)("div",{style:{fontSize:"0.72rem",color:"#047857",lineHeight:1.45},children:"Lembar kerja aktif data dinamis. Anda bebas menyunting teks, menambah/menghapus tabel, dan mengatur tata letak naskah. Belum tersimpan resmi sampai Anda mencetaknya."})
            ]}),
            (0,t.jsxs)("div",{style:{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:"6px",padding:"0.55rem 0.85rem"},children:[
              (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"6px",fontWeight:800,color:"#92400e",marginBottom:"2px"},children:[
                (0,t.jsx)("span",{children:"🔒"}),
                "ARSIP DOKUMEN (SNAPSHOT RESMI)"
              ]}),
              (0,t.jsx)("div",{style:{fontSize:"0.72rem",color:"#b45309",lineHeight:1.45},children:"Salinan naskah dinas resmi yang telah dicetak & dikunci permanen. Memiliki CAS Forensic Stamp unik anti-tamper untuk keperluan audit dan pencatatan kepolisian."})
            ]})
          ]}),
        ]}),

        // 3. Tabel Daftar Arsip
        (0,t.jsx)("div",{className:"cms-card",style:{padding:0,overflow:"hidden",borderRadius:"8px",border:"1px solid #cbd5e1"},children:
          (0,t.jsxs)("table",{style:{width:"100%",borderCollapse:"collapse",fontSize:"0.82rem"},children:[
            (0,t.jsx)("thead",{children:(0,t.jsxs)("tr",{style:{background:"#f1f5f9",borderBottom:"1.5px solid #cbd5e1",textAlign:"left"},children:[
              (0,t.jsx)("th",{style:{padding:"12px 14px",width:"5%",fontWeight:800,color:"#334155"},children:"No"}),
              (0,t.jsx)("th",{style:{padding:"12px 14px",width:"28%",fontWeight:800,color:"#334155"},children:"Judul Dokumen Dinas"}),
              (0,t.jsx)("th",{style:{padding:"12px 14px",width:"18%",fontWeight:800,color:"#334155"},children:"Satuan Kerja"}),
              (0,t.jsx)("th",{style:{padding:"12px 14px",width:"16%",fontWeight:800,color:"#334155"},children:"Kode CAS"}),
              (0,t.jsx)("th",{style:{padding:"12px 14px",width:"16%",fontWeight:800,color:"#334155"},children:"Waktu Pencatatan"}),
              (0,t.jsx)("th",{style:{padding:"12px 14px",width:"17%",textAlign:"center",fontWeight:800,color:"#334155"},children:"Status & Aksi"})
            ]})}),
            (0,t.jsxs)("tbody",{children:[
              archiveList.length > 0 ? archiveList.map((item, idx) => {
                let isCurrent = archiveLoadedInfo && archiveLoadedInfo.id === item.id;
                return (0,t.jsxs)("tr",{key:idx,style:{borderBottom:"1px solid #e2e8f0",background:isCurrent?"#fffbeb":"#ffffff",transition:"background 0.15s ease"},children:[
                  (0,t.jsx)("td",{style:{padding:"11px 14px",fontWeight:600,color:"#64748b"},children:idx+1}),
                  (0,t.jsxs)("td",{style:{padding:"11px 14px"},children:[
                    (0,t.jsxs)("div",{style:{fontWeight:700,color:"#0f172a",display:"flex",alignItems:"center",gap:"6px"},children:[
                      item.document_title || "Laporan Anev",
                      isCurrent && (0,t.jsx)("span",{style:{background:"#fef3c7",color:"#92400e",border:"1px solid #f59e0b",padding:"1px 6px",borderRadius:"4px",fontSize:"0.65rem",fontWeight:800},children:"AKTIF DI KANVAS"})
                    ]}),
                    (0,t.jsxs)("div",{style:{fontSize:"0.72rem",color:"#64748b",marginTop:"2px"},children:["Periode: ", item.periode_label || "-"]})
                  ]}),
                  (0,t.jsx)("td",{style:{padding:"11px 14px",fontWeight:600,color:"#334155"},children:item.satker_nama || "BARESKRIM POLRI"}),
                  (0,t.jsx)("td",{style:{padding:"11px 14px"},children:
                    (0,t.jsx)("span",{style:{fontFamily:"monospace",background:"#eff6ff",color:"#1d4ed8",border:"1px solid #bfdbfe",padding:"2px 7px",borderRadius:"4px",fontSize:"0.74rem",fontWeight:800},children:(item.security_stamp ? item.security_stamp.replace(/^STAMP-/, "CAS-") : "-")})
                  }),
                  (0,t.jsxs)("td",{style:{padding:"11px 14px",fontSize:"0.74rem",color:"#475569"},children:[
                    (0,t.jsx)("div",{style:{fontWeight:600},children:new Date(item.created_at).toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}),
                    (0,t.jsxs)("div",{style:{color:"#64748b",fontSize:"0.7rem"},children:["Oleh: ", item.user_nama || "Petugas"]})
                  ]}),
                  (0,t.jsx)("td",{style:{padding:"11px 14px",textAlign:"center"},children:
                    isCurrent ? (
                      (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",gap:"5px"},children:[
                        (0,t.jsx)(c.Button,{label:"Lihat di Naskah",size:"small",severity:"warning",icon:"pi pi-eye",onClick:()=>setActiveTab("lampiran"),style:{fontSize:"0.74rem",fontWeight:700,height:"30px"}})
                      ]})
                    ) : (
                      (0,t.jsx)(c.Button,{label:"Buka Arsip Ini",size:"small",icon:"pi pi-folder-open",outlined:!0,onClick:()=>handleOpenArchive(item),style:{fontSize:"0.74rem",fontWeight:600,height:"30px"}})
                    )
                  })
                ]});
              }) : (0,t.jsx)("tr",{children:(0,t.jsx)("td",{colSpan:6,style:{padding:"2.5rem",textAlign:"center",color:"#94a3b8",fontStyle:"italic"},children:"Belum ada arsip dokumen tercetak."})})
            ]})
          ]})
        })
      ]})`;

updated = updated.slice(0, archStartIdx) + newArchiveTabCode + updated.slice(archEndIdx);

// CSS Updates for No Overflow & Custom Table
const oldCanvasCss = `.anev-sheet-canvas {
          background: #ffffff;
          box-shadow: 0 4px 25px rgba(0,0,0,0.08);
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          padding: 42px 48px;
          max-width: 880px;
          margin: 1.5rem auto;
          position: relative;
          font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
          color: #0f172a;
          line-height: 1.55;
        }`;

const newMultiPageCss = `.anev-pages-workspace {
          background: #cbd5e1;
          padding: 2rem 1rem 4rem 1rem;
          border-radius: 8px;
          border: 1px solid #94a3b8;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2.5rem;
          box-sizing: border-box;
        }
        .anev-page-sheet {
          background: #ffffff;
          width: 100%;
          max-width: 880px;
          min-height: 1180px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15), 0 2px 6px rgba(0, 0, 0, 0.08);
          border: 1px solid #cbd5e1;
          border-radius: 2px;
          padding: 48px 52px 36px 52px;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-sizing: border-box;
          font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
          color: #0f172a;
          line-height: 1.55;
        }
        .anev-page-content {
          flex: 1 0 auto;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          outline: none !important;
          cursor: text;
        }
        .anev-page-content:focus {
          outline: none !important;
        }
        .anev-page-content p:empty::before,
        .anev-page-content div:empty::before {
          content: " ";
          white-space: pre;
        }
        .anev-table-naskah td:focus,
        .anev-table-naskah th:focus {
          outline: 2px solid #2563eb !important;
          background-color: #eff6ff !important;
        }
        .anev-custom-table-box {
          position: relative;
        }
        .anev-custom-table-box:hover {
          outline: 1.5px dashed #93c5fd;
        }
        .anev-chart-container {
          margin: 0.4rem 0 1rem 0.8rem !important;
          width: calc(100% - 0.8rem) !important;
          max-width: calc(100% - 0.8rem) !important;
          box-sizing: border-box !important;
          padding: 0.9rem 1.1rem !important;
          background: #f8fafc !important;
          border: 1px solid #cbd5e1 !important;
          border-radius: 6px !important;
          overflow: hidden !important;
        }
        .anev-table-naskah {
          width: calc(100% - 0.8rem) !important;
          max-width: calc(100% - 0.8rem) !important;
          margin-left: 0.8rem !important;
          box-sizing: border-box !important;
        }
        .anev-narasi-box {
          width: calc(100% - 0.8rem) !important;
          max-width: calc(100% - 0.8rem) !important;
          margin-left: 0.8rem !important;
          box-sizing: border-box !important;
          word-break: break-word !important;
        }
        .anev-custom-table-box {
          margin: 0.8rem 0 1rem 0.8rem;
          width: calc(100% - 0.8rem);
          box-sizing: border-box;
        }
        .anev-page-footer {
          flex-shrink: 0;
          margin-top: 2rem;
          padding-top: 0.6rem;
          border-top: 1.5px solid #cbd5e1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.72rem;
          color: #64748b;
          user-select: none;
        }
        .anev-forensic-stamp {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .anev-footer-right {
          font-size: 0.88rem;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: 2px;
          text-align: right;
        }
        .anev-guide-box {
          border: 1.5px dashed #94a3b8;
          background: #f8fafc;
          border-radius: 4px;
          padding: 4px 8px;
          margin: 3px 0;
          cursor: text;
          transition: all 0.15s ease;
          min-height: 24px;
          box-sizing: border-box;
          word-break: break-word;
        }
        .anev-guide-box:hover {
          border-color: #2563eb;
          background: #eff6ff;
        }
        .anev-guide-box:focus {
          border-style: solid;
          border-color: #1d4ed8;
          background: #ffffff;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
          outline: none;
        }
        .anev-guide-space-box {
          height: 68px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 6px 0;
        }`;

updated = updated.replace(oldCanvasCss, newMultiPageCss);

// Print CSS
const oldPrintCss = `@media print {
          @page { size: A4 portrait; margin: 12mm 15mm 12mm 15mm; }
          body * { visibility: hidden !important; }
          .anev-print-sheet, .anev-print-sheet * { visibility: visible !important; }
          .anev-print-sheet {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            background: #ffffff !important;
          }
          .anev-no-print { display: none !important; }
          .anev-page-break { page-break-before: always; }
          .anev-sticky-header { display: none !important; }
        }`;

const newPrintCss = `@media print {
          @page {
            size: A4 portrait;
            margin: 0 !important;
          }
          html, body {
            width: 100% !important;
            height: auto !important;
            min-height: 100% !important;
            max-height: none !important;
            overflow: visible !important;
            overflow-x: visible !important;
            overflow-y: visible !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #__next,
          .cms-shell,
          .cms-main,
          .cms-content,
          main,
          .anev-wrapper {
            display: block !important;
            position: static !important;
            width: 100% !important;
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
            overflow: visible !important;
            overflow-x: visible !important;
            overflow-y: visible !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            background: #ffffff !important;
            transform: none !important;
            float: none !important;
          }
          .cms-sidebar,
          .cms-overlay,
          .cms-header-fixed,
          .cms-header,
          .cms-brand,
          .cms-topbar,
          .cms-breadcrumb,
          .dash-head,
          .anev-sticky-header,
          .anev-no-print,
          .anev-sheet-corner-pill,
          .anev-editor-info-banner,
          .anev-guide-hint-card,
          .p-toast,
          .p-confirm-dialog,
          .p-dialog,
          .p-dialog-mask,
          header,
          nav,
          aside,
          button {
            display: none !important;
          }
          .anev-pages-workspace {
            display: block !important;
            position: static !important;
            width: 100% !important;
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
            margin: 0 !important;
            padding: 0 !important;
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            zoom: 1 !important;
            transform: none !important;
            gap: 0 !important;
            overflow: visible !important;
          }
          .anev-page-sheet {
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            box-sizing: border-box !important;
            width: 210mm !important;
            min-width: 210mm !important;
            max-width: 210mm !important;
            height: 297mm !important;
            min-height: 297mm !important;
            max-height: 297mm !important;
            margin: 0 auto !important;
            padding: 10mm 14mm 12mm 14mm !important;
            page-break-before: auto !important;
            break-before: auto !important;
            page-break-after: always !important;
            break-after: page !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            overflow: hidden !important;
            position: relative !important;
            border: none !important;
            box-shadow: none !important;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .anev-page-sheet:last-child {
            page-break-after: auto !important;
            break-after: auto !important;
          }
          .anev-page-content {
            flex: 1 1 auto !important;
            width: 100% !important;
            max-width: 100% !important;
            overflow: hidden !important;
            box-sizing: border-box !important;
          }
          .anev-page-footer {
            flex-shrink: 0 !important;
            margin-top: auto !important;
            padding-top: 4mm !important;
            border-top: 1px solid #94a3b8 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .anev-forensic-stamp {
            display: flex !important;
            align-items: center !important;
            gap: 4px !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .anev-watermark-overlay {
            display: flex !important;
            opacity: 0.08 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .anev-guide-box {
            border: none !important;
            background: transparent !important;
            padding: 0 !important;
            margin: 2px 0 !important;
            box-shadow: none !important;
          }
          .anev-guide-space-box {
            height: 40px !important;
            border: none !important;
            background: transparent !important;
          }
        }`;

updated = updated.replace(oldPrintCss, newPrintCss);

// Clean string styles
updated = updated.split('style:"font-size:0.78rem"').join('style:{fontSize:"0.78rem"}');

fs.writeFileSync('build_full_lampiran_v13.js', updated, 'utf8');
console.log('Saved build_full_lampiran_v13.js! Total length:', updated.length);
