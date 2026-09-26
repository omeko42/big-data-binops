import fs from 'fs';
import vm from 'vm';

console.log('Testing patch script...');
const original = fs.readFileSync('kinerja-perma-external-a42edc88f706.patched.js', 'utf8');

// 1. Identify state block
const stateStart = original.indexOf('[exportMenuOpen,setExportMenuOpen]=(0,t.useState)(!1),');
if (stateStart === -1) throw new Error('State start not found');

const stateSearchEnd = '[pdfPangkat,setPdfPangkat]=(0,t.useState)("BRIGADIR JENDERAL POLISI"),';
const stateEndIdx = original.indexOf(stateSearchEnd, stateStart);
if (stateEndIdx === -1) throw new Error('State end not found');
const fullStateEnd = stateEndIdx + stateSearchEnd.length;

console.log('Found state block from', stateStart, 'to', fullStateEnd);

const newStateBlock = `[exportMenuOpen,setExportMenuOpen]=(0,t.useState)(!1),
[pdfModalOpen,setPdfModalOpen]=(0,t.useState)(!1),
[pdfExpanded,setPdfExpanded]=(0,t.useState)(!1),
[pdfSatkerName,setPdfSatkerName]=(0,t.useState)("Nasional"),
[pdfPeriode,setPdfPeriode]=(0,t.useState)("Tahun 2026"),
[pdfWaktuCetak,setPdfWaktuCetak]=(0,t.useState)(""),
[pdfDataPer,setPdfDataPer]=(0,t.useState)(""),`;

// 2. Identify openPdfModal block
const openPdfStart = original.indexOf('function openPdfModal(){');
if (openPdfStart === -1) throw new Error('openPdfModal not found');
const openPdfEnd = original.indexOf('function kpFlattenNodes(arr, depth=0){', openPdfStart);
if (openPdfEnd === -1) throw new Error('kpFlattenNodes not found');

const newOpenPdf = `function openPdfModal(){
  setExportMenuOpen(!1);
  let satker = "Semua Jajaran (Mabes & Seluruh Polda)";
  if(eScope==="scoped"&&eScopeSatkerId){
    let sObj=eScopeOpts.find(x=>x.value===eScopeSatkerId);
    if(sObj&&sObj.label){
      satker=sObj.label;
    }
  } else if(eScope==="all"){
    satker="Nasional";
  }
  let per = (kpPeriodLabel || "Tahun 2026").trim();
  let waktu = new Date().toLocaleString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }) + " WIB";
  let dPer = "—";
  if(x?.last_refreshed_at){
    let a=new Date(x.last_refreshed_at);
    dPer = isNaN(a.getTime()) ? x.last_refreshed_at : a.toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }) + " WIB";
  }
  setPdfSatkerName(satker);
  setPdfPeriode(per);
  setPdfWaktuCetak(waktu);
  setPdfDataPer(dPer);
  setPdfExpanded(!1);
  setPdfModalOpen(!0);
}

`;

// 3. Identify kpPrintPdf block
const printStart = original.indexOf('function kpPrintPdf(){');
if (printStart === -1) throw new Error('kpPrintPdf not found');
const printEnd = original.indexOf('function applyUnifiedFilter(){', printStart);
if (printEnd === -1) throw new Error('applyUnifiedFilter not found');

const newPrintPdf = `function kpPrintPdf(){
  let rows = kpFlattenNodes(s);
  let rowsHtml = rows.map((r, rIdx)=>{
    let ind = r.depth > 0 ? \`padding-left:\${r.depth * 14 + 6}px;font-style:italic;\` : "font-weight:700;";
    let noStr = r.nomor || "";
    let ctV = (r.ct??0).toLocaleString("id-ID");
    let buV = ((r.cp_berjalan_belum_update??0)+(r.cp_tunggakan_belum_update??0)).toLocaleString("id-ID");
    let limV = (r.limpah_eksternal??0).toLocaleString("id-ID");
    let cpV = ((r.cp_berjalan??0)+(r.cp_tunggakan??0)).toLocaleString("id-ID");
    let prV = ((r.pr??0)).toFixed(2)+"%";
    let ccV = ((r.cc_aktual??0)+(r.cc_tunggakan??0)).toLocaleString("id-ID");
    let crV = ((r.cr??0)).toFixed(2)+"%";
    let idxV = (r.indeks??0).toLocaleString("id-ID",{minimumFractionDigits:2,maximumFractionDigits:2});
    let lvlV = r.level ? \`LEVEL \${r.level}\` : "-";
    let bgRow = rIdx % 2 === 1 ? "background:#f8fafc;" : "background:#ffffff;";
    return \`<tr style="\${bgRow}"><td style="text-align:center;width:28px;color:#0f172a;">\${noStr}</td><td style="text-align:left;color:#0f172a;\${ind}">\${r.nama||"-"}</td><td style="text-align:right;font-weight:700;color:#1d4ed8;">\${ctV}</td><td style="text-align:right;color:#0f172a;">\${buV}</td><td style="text-align:right;color:#0f172a;">\${limV}</td><td style="text-align:right;color:#0f172a;">\${cpV}</td><td style="text-align:center;color:#0f172a;">\${prV}</td><td style="text-align:right;font-weight:700;color:#15803d;">\${ccV}</td><td style="text-align:center;font-weight:700;color:#0f172a;">\${crV}</td><td style="text-align:center;white-space:nowrap;color:#0f172a;"><strong>\${idxV}</strong> (\${lvlV})</td></tr>\`;
  }).join("");

  let totCt = (d.ct??0).toLocaleString("id-ID");
  let totBu = ((d.cp_berjalan_belum_update??0)+(d.cp_tunggakan_belum_update??0)).toLocaleString("id-ID");
  let totLim = (d.limpah_eksternal??0).toLocaleString("id-ID");
  let totCp = ((d.cp_berjalan??0)+(d.cp_tunggakan??0)).toLocaleString("id-ID");
  let totPr = ((d.pr??0)).toFixed(2)+"%";
  let totCc = ((d.cc_aktual??0)+(d.cc_tunggakan??0)).toLocaleString("id-ID");
  let totCr = ((d.cr??0)).toFixed(2)+"%";
  let totIdx = (d.indeks??0).toLocaleString("id-ID",{minimumFractionDigits:2,maximumFractionDigits:2});
  let totLvl = d.level ? \`LEVEL \${d.level}\` : "-";

  let docTitle = \`Lampiran Kinerja Perkara Satker \${pdfSatkerName||"Nasional"} Periode \${pdfPeriode||"Tahun 2026"}\`;

  let html = \`<!DOCTYPE html><html><head><meta charset="utf-8"><title>\${docTitle}</title><style>@page{size:A4 landscape;margin:8mm 10mm 10mm 10mm;@bottom-right{content:"Halaman " counter(page) " dari " counter(pages);font-size:7.5pt;font-family:Arial,Roboto,'Segoe UI',sans-serif;color:#64748b;}@bottom-left{content:"Lampiran Kinerja Perkara \\\\2022 DORS Bareskrim Polri";font-size:7.5pt;font-family:Arial,Roboto,'Segoe UI',sans-serif;color:#94a3b8;}}*{box-sizing:border-box;}body{font-family:Arial,Roboto,'Segoe UI',sans-serif;font-size:7.5pt;color:#0f172a;background:#ffffff;margin:0;padding:0;line-height:1.25;-webkit-print-color-adjust:exact !important;print-color-adjust:exact !important;}.sheet-header{margin-bottom:8px;padding-bottom:5px;border-bottom:2px solid #0f172a;}.sheet-title{font-size:10.5pt;font-weight:800;color:#0f172a;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 3px 0;}.sheet-meta{font-size:7.5pt;color:#475569;display:flex;justify-content:space-between;align-items:center;}.sheet-meta-left{display:flex;gap:12px;}.sheet-meta-item strong{color:#0f172a;}table.sheet-table{width:100%;border-collapse:collapse;font-size:7.5pt;}thead{display:table-header-group;}tfoot{display:table-footer-group;}tr{page-break-inside:avoid;}th{background-color:#f1f5f9 !important;color:#0f172a !important;font-weight:700;border:1px solid #94a3b8;padding:4px 5px;text-align:center;vertical-align:middle;}td{border:1px solid #cbd5e1;padding:3.5px 5px;vertical-align:middle;}.total-row td{background-color:#e2e8f0 !important;color:#0f172a !important;font-weight:800;border-top:2px solid #0f172a;border-bottom:2px solid #0f172a;}</style></head><body><div class="sheet-header"><div class="sheet-title">\${docTitle}</div><div class="sheet-meta"><div class="sheet-meta-left"><span class="sheet-meta-item"><strong>Sumber Data:</strong> DORS Bareskrim Polri</span><span>&bull;</span><span class="sheet-meta-item"><strong>Data per:</strong> \${pdfDataPer||"—"}</span><span>&bull;</span><span class="sheet-meta-item"><strong>Waktu Cetak:</strong> \${pdfWaktuCetak||"—"}</span></div><div><span>Format Lampiran Ringkas</span></div></div></div><table class="sheet-table"><thead><tr><th style="width:28px;">NO</th><th>SATKER / KESATUAN</th><th style="width:60px;">CT</th><th style="width:60px;">SISA (BU)</th><th style="width:60px;">LIMPAH EKS.</th><th style="width:60px;">CP</th><th style="width:50px;">PR</th><th style="width:60px;">CC</th><th style="width:50px;">CR</th><th style="width:85px;">INDEKS KINERJA</th></tr></thead><tbody>\${rowsHtml}</tbody><tfoot><tr class="total-row"><td colspan="2" style="text-align:center;font-weight:800;">TOTAL KESELURUHAN</td><td style="text-align:right;font-weight:800;">\${totCt}</td><td style="text-align:right;font-weight:800;">\${totBu}</td><td style="text-align:right;font-weight:800;">\${totLim}</td><td style="text-align:right;font-weight:800;">\${totCp}</td><td style="text-align:center;font-weight:800;">\${totPr}</td><td style="text-align:right;font-weight:800;">\${totCc}</td><td style="text-align:center;font-weight:800;">\${totCr}</td><td style="text-align:center;font-weight:800;">\${totIdx} (\${totLvl})</td></tr></tfoot></table></body></html>\`;

  try {
    let iframe = document.getElementById("kp-print-iframe");
    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.id = "kp-print-iframe";
      iframe.style.position = "fixed";
      iframe.style.right = "0";
      iframe.style.bottom = "0";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "none";
      iframe.style.zIndex = "-9999";
      document.body.appendChild(iframe);
    }
    let doc = iframe.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close();
    iframe.contentWindow.focus();
    setTimeout(() => {
      iframe.contentWindow.print();
    }, 350);
  } catch (err) {
    let w = window.open("", "_blank");
    if (w) {
      w.document.open();
      w.document.write(html);
      w.document.close();
      w.focus();
      setTimeout(() => { w.print(); }, 350);
    } else {
      alert("Pop-up diblokir. Harap izinkan pop-up di browser Anda.");
    }
  }
}

`;

// 4. Identify old modal JSX block
const modalJsxStart = original.indexOf('pdfModalOpen &&');
if (modalJsxStart === -1) throw new Error('pdfModalOpen && not found');
const modalJsxEnd = 143977;

console.log('Old modal JSX from', modalJsxStart, 'to', modalJsxEnd);

const newModalJsx = `(0, a.jsx)(h.Dialog, {
  header: (0, a.jsxs)("div", {
    style: { display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", gap: "1rem", paddingRight: "0.5rem" },
    children: [
      (0, a.jsxs)("div", {
        style: { display: "flex", alignItems: "center", gap: "0.6rem" },
        children: [
          (0, a.jsx)("i", { className: "pi pi-file-pdf", style: { color: "#dc2626", fontSize: "1.3rem" } }),
          (0, a.jsxs)("div", {
            children: [
              (0, a.jsx)("div", { style: { fontWeight: 800, fontSize: "1.05rem", color: "#0f172a" }, children: "Cetak Lampiran Kinerja Perkara" }),
              (0, a.jsx)("div", { style: { fontSize: "0.75rem", color: "#64748b" }, children: "Format tabel ringkas Google Spreadsheet (tanpa kop surat & ttd)" })
            ]
          })
        ]
      }),
      (0, a.jsxs)("div", {
        style: { display: "flex", gap: "0.5rem", alignItems: "center" },
        children: [
          (0, a.jsx)(p.Button, {
            label: pdfExpanded ? "Perkecil Tampilan" : "Perbesar Penuh",
            icon: pdfExpanded ? "pi pi-window-minimize" : "pi pi-window-maximize",
            text: !0,
            size: "small",
            onClick: () => setPdfExpanded(v => !v)
          }),
          (0, a.jsx)(p.Button, {
            label: "Cetak / Simpan PDF",
            icon: "pi pi-print",
            size: "small",
            onClick: kpPrintPdf,
            style: { background: "#dc2626", borderColor: "#dc2626", color: "#ffffff", fontWeight: 700 }
          })
        ]
      })
    ]
  }),
  visible: pdfModalOpen,
  onHide: () => setPdfModalOpen(!1),
  maximized: pdfExpanded,
  maximizable: !0,
  onMaximize: e => setPdfExpanded(e.maximized),
  style: pdfExpanded
    ? { width: "100vw", height: "100vh", maxWidth: "100vw", maxHeight: "100vh", margin: 0, top: 0, left: 0, borderRadius: 0 }
    : { width: "82rem", maxWidth: "96vw" },
  contentStyle: {
    overflow: "auto",
    height: pdfExpanded ? "calc(100vh - 125px)" : "auto",
    maxHeight: pdfExpanded ? "calc(100vh - 125px)" : "75vh",
    background: "#f1f5f9",
    padding: "1.2rem"
  },
  footer: (0, a.jsxs)("div", {
    style: { display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" },
    children: [
      (0, a.jsxs)("div", {
        style: { fontSize: "0.78rem", color: "#64748b", display: "flex", alignItems: "center", gap: "0.4rem" },
        children: [
          (0, a.jsx)("i", { className: "pi pi-info-circle", style: { color: "#3b82f6" } }),
          (0, a.jsx)("span", { children: "Nomor halaman tercetak otomatis di pojok kanan bawah jika lampiran melebihi 1 halaman." })
        ]
      }),
      (0, a.jsxs)("div", {
        style: { display: "flex", gap: "0.5rem" },
        children: [
          (0, a.jsx)(p.Button, {
            label: "Tutup",
            text: !0,
            size: "small",
            onClick: () => setPdfModalOpen(!1)
          }),
          (0, a.jsx)(p.Button, {
            label: "Cetak / Simpan PDF",
            icon: "pi pi-print",
            size: "small",
            onClick: kpPrintPdf,
            style: { background: "#dc2626", borderColor: "#dc2626", color: "#ffffff", fontWeight: 700 }
          })
        ]
      })
    ]
  }),
  modal: !0,
  dismissableMask: !1,
  children: (0, a.jsx)("div", {
    style: {
      background: "#ffffff",
      borderRadius: "8px",
      border: "1px solid #cbd5e1",
      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
      padding: "1.5rem 1.8rem",
      margin: "0 auto",
      maxWidth: "1350px",
      color: "#0f172a",
      fontFamily: "Arial, Roboto, 'Segoe UI', sans-serif"
    },
    children: [
      (0, a.jsxs)("div", {
        style: {
          borderBottom: "2px solid #0f172a",
          paddingBottom: "0.6rem",
          marginBottom: "0.9rem"
        },
        children: [
          (0, a.jsx)("div", {
            style: {
              fontSize: "1.1rem",
              fontWeight: 800,
              color: "#0f172a",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "0.35rem"
            },
            children: "Lampiran Kinerja Perkara Satker " + (pdfSatkerName || "Nasional") + " Periode " + (pdfPeriode || "Tahun 2026")
          }),
          (0, a.jsxs)("div", {
            style: {
              fontSize: "0.78rem",
              color: "#475569",
              display: "flex",
              flexWrap: "wrap",
              gap: "0.75rem",
              alignItems: "center"
            },
            children: [
              (0, a.jsxs)("span", {
                children: [
                  (0, a.jsx)("strong", { style: { color: "#0f172a" }, children: "Sumber Data: " }),
                  "DORS Bareskrim Polri"
                ]
              }),
              (0, a.jsx)("span", { style: { color: "#cbd5e1" }, children: "•" }),
              (0, a.jsxs)("span", {
                children: [
                  (0, a.jsx)("strong", { style: { color: "#0f172a" }, children: "Data per: " }),
                  pdfDataPer || "—"
                ]
              }),
              (0, a.jsx)("span", { style: { color: "#cbd5e1" }, children: "•" }),
              (0, a.jsxs)("span", {
                children: [
                  (0, a.jsx)("strong", { style: { color: "#0f172a" }, children: "Waktu Cetak: " }),
                  pdfWaktuCetak || "—"
                ]
              })
            ]
          })
        ]
      }),
      (0, a.jsx)("div", {
        style: { overflowX: "auto" },
        children: (0, a.jsxs)("table", {
          style: {
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "0.75rem",
            fontFamily: "Arial, Roboto, 'Segoe UI', sans-serif"
          },
          children: [
            (0, a.jsx)("thead", {
              children: (0, a.jsxs)("tr", {
                style: { background: "#f1f5f9" },
                children: [
                  (0, a.jsx)("th", { style: { width: "30px", border: "1px solid #94a3b8", padding: "5px 6px", textAlign: "center", fontWeight: 700, color: "#0f172a" }, children: "NO" }),
                  (0, a.jsx)("th", { style: { border: "1px solid #94a3b8", padding: "5px 6px", textAlign: "left", fontWeight: 700, color: "#0f172a" }, children: "SATKER / KESATUAN" }),
                  (0, a.jsx)("th", { style: { width: "65px", border: "1px solid #94a3b8", padding: "5px 6px", textAlign: "center", fontWeight: 700, color: "#0f172a" }, children: "CT" }),
                  (0, a.jsx)("th", { style: { width: "65px", border: "1px solid #94a3b8", padding: "5px 6px", textAlign: "center", fontWeight: 700, color: "#0f172a" }, children: "SISA (BU)" }),
                  (0, a.jsx)("th", { style: { width: "65px", border: "1px solid #94a3b8", padding: "5px 6px", textAlign: "center", fontWeight: 700, color: "#0f172a" }, children: "LIMPAH EKS." }),
                  (0, a.jsx)("th", { style: { width: "65px", border: "1px solid #94a3b8", padding: "5px 6px", textAlign: "center", fontWeight: 700, color: "#0f172a" }, children: "CP" }),
                  (0, a.jsx)("th", { style: { width: "55px", border: "1px solid #94a3b8", padding: "5px 6px", textAlign: "center", fontWeight: 700, color: "#0f172a" }, children: "PR" }),
                  (0, a.jsx)("th", { style: { width: "65px", border: "1px solid #94a3b8", padding: "5px 6px", textAlign: "center", fontWeight: 700, color: "#0f172a" }, children: "CC" }),
                  (0, a.jsx)("th", { style: { width: "55px", border: "1px solid #94a3b8", padding: "5px 6px", textAlign: "center", fontWeight: 700, color: "#0f172a" }, children: "CR" }),
                  (0, a.jsx)("th", { style: { width: "95px", border: "1px solid #94a3b8", padding: "5px 6px", textAlign: "center", fontWeight: 700, color: "#0f172a" }, children: "INDEKS KINERJA" })
                ]
              })
            }),
            (0, a.jsx)("tbody", {
              children: kpFlattenNodes(s).map((r, rIdx) => {
                let ind = r.depth > 0 ? (r.depth * 14 + 6) + "px" : "6px";
                let isAlt = rIdx % 2 === 1;
                return (0, a.jsxs)("tr", {
                  key: r.id || rIdx,
                  style: { background: isAlt ? "#f8fafc" : "#ffffff" },
                  children: [
                    (0, a.jsx)("td", { style: { border: "1px solid #cbd5e1", padding: "4px 6px", textAlign: "center", color: "#0f172a" }, children: r.nomor || "" }),
                    (0, a.jsx)("td", { style: { border: "1px solid #cbd5e1", padding: "4px 6px", paddingLeft: ind, fontStyle: r.depth > 0 ? "italic" : "normal", fontWeight: r.depth > 0 ? 500 : 700, color: "#0f172a" }, children: r.nama || "-" }),
                    (0, a.jsx)("td", { style: { border: "1px solid #cbd5e1", padding: "4px 6px", textAlign: "right", fontWeight: 700, color: "#1d4ed8" }, children: (r.ct ?? 0).toLocaleString("id-ID") }),
                    (0, a.jsx)("td", { style: { border: "1px solid #cbd5e1", padding: "4px 6px", textAlign: "right", color: "#0f172a" }, children: ((r.cp_berjalan_belum_update ?? 0) + (r.cp_tunggakan_belum_update ?? 0)).toLocaleString("id-ID") }),
                    (0, a.jsx)("td", { style: { border: "1px solid #cbd5e1", padding: "4px 6px", textAlign: "right", color: "#0f172a" }, children: (r.limpah_eksternal ?? 0).toLocaleString("id-ID") }),
                    (0, a.jsx)("td", { style: { border: "1px solid #cbd5e1", padding: "4px 6px", textAlign: "right", color: "#0f172a" }, children: ((r.cp_berjalan ?? 0) + (r.cp_tunggakan ?? 0)).toLocaleString("id-ID") }),
                    (0, a.jsx)("td", { style: { border: "1px solid #cbd5e1", padding: "4px 6px", textAlign: "center", color: "#0f172a" }, children: (r.pr ?? 0).toFixed(2) + "%" }),
                    (0, a.jsx)("td", { style: { border: "1px solid #cbd5e1", padding: "4px 6px", textAlign: "right", fontWeight: 700, color: "#15803d" }, children: ((r.cc_aktual ?? 0) + (r.cc_tunggakan ?? 0)).toLocaleString("id-ID") }),
                    (0, a.jsx)("td", { style: { border: "1px solid #cbd5e1", padding: "4px 6px", textAlign: "center", fontWeight: 700, color: "#0f172a" }, children: (r.cr ?? 0).toFixed(2) + "%" }),
                    (0, a.jsx)("td", { style: { border: "1px solid #cbd5e1", padding: "4px 6px", textAlign: "center", whiteSpace: "nowrap", color: "#0f172a" }, children: (r.indeks ?? 0).toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + (r.level ? " (LEVEL " + r.level + ")" : " (-)") })
                  ]
                });
              })
            }),
            (0, a.jsx)("tfoot", {
              children: (0, a.jsxs)("tr", {
                style: {
                  background: "#e2e8f0",
                  fontWeight: 800,
                  borderTop: "2px solid #0f172a",
                  borderBottom: "2px solid #0f172a"
                },
                children: [
                  (0, a.jsx)("td", { colSpan: 2, style: { border: "1px solid #94a3b8", padding: "6px 8px", textAlign: "center", color: "#0f172a" }, children: "TOTAL KESELURUHAN" }),
                  (0, a.jsx)("td", { style: { border: "1px solid #94a3b8", padding: "6px 8px", textAlign: "right", color: "#1d4ed8" }, children: (d.ct ?? 0).toLocaleString("id-ID") }),
                  (0, a.jsx)("td", { style: { border: "1px solid #94a3b8", padding: "6px 8px", textAlign: "right", color: "#0f172a" }, children: ((d.cp_berjalan_belum_update ?? 0) + (d.cp_tunggakan_belum_update ?? 0)).toLocaleString("id-ID") }),
                  (0, a.jsx)("td", { style: { border: "1px solid #94a3b8", padding: "6px 8px", textAlign: "right", color: "#0f172a" }, children: (d.limpah_eksternal ?? 0).toLocaleString("id-ID") }),
                  (0, a.jsx)("td", { style: { border: "1px solid #94a3b8", padding: "6px 8px", textAlign: "right", color: "#0f172a" }, children: ((d.cp_berjalan ?? 0) + (d.cp_tunggakan ?? 0)).toLocaleString("id-ID") }),
                  (0, a.jsx)("td", { style: { border: "1px solid #94a3b8", padding: "6px 8px", textAlign: "center", color: "#0f172a" }, children: (d.pr ?? 0).toFixed(2) + "%" }),
                  (0, a.jsx)("td", { style: { border: "1px solid #94a3b8", padding: "6px 8px", textAlign: "right", color: "#15803d" }, children: ((d.cc_aktual ?? 0) + (d.cc_tunggakan ?? 0)).toLocaleString("id-ID") }),
                  (0, a.jsx)("td", { style: { border: "1px solid #94a3b8", padding: "6px 8px", textAlign: "center", color: "#0f172a" }, children: (d.cr ?? 0).toFixed(2) + "%" }),
                  (0, a.jsx)("td", { style: { border: "1px solid #94a3b8", padding: "6px 8px", textAlign: "center", color: "#0f172a" }, children: (d.indeks ?? 0).toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + (d.level ? " (LEVEL " + d.level + ")" : " (-)") })
                ]
              })
            })
          ]
        })
      }),
      (0, a.jsxs)("div", {
        style: {
          marginTop: "1rem",
          paddingTop: "0.6rem",
          borderTop: "1px dashed #cbd5e1",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "0.75rem",
          color: "#94a3b8"
        },
        children: [
          (0, a.jsx)("span", { children: "Lampiran Kinerja Perkara • DORS Bareskrim Polri" }),
          (0, a.jsx)("span", { children: "Halaman 1 dari N (otomatis saat dicetak)" })
        ]
      })
    ]
  })
})`;

// Assemble in order: from bottom to top so indices don't shift!
let patched = original;

// 1. Replace modal JSX (modalJsxStart to modalJsxEnd)
patched = patched.slice(0, modalJsxStart) + newModalJsx + patched.slice(modalJsxEnd);
console.log('Replaced modal JSX');

// 2. Replace kpPrintPdf
const pStart = patched.indexOf('function kpPrintPdf(){');
const pEnd = patched.indexOf('function applyUnifiedFilter(){', pStart);
patched = patched.slice(0, pStart) + newPrintPdf + patched.slice(pEnd);
console.log('Replaced kpPrintPdf');

// 3. Replace openPdfModal
const opStart = patched.indexOf('function openPdfModal(){');
const opEnd = patched.indexOf('function kpFlattenNodes(arr, depth=0){', opStart);
patched = patched.slice(0, opStart) + newOpenPdf + patched.slice(opEnd);
console.log('Replaced openPdfModal');

// 4. Replace State
const stStart = patched.indexOf('[exportMenuOpen,setExportMenuOpen]=(0,t.useState)(!1),');
const stEnd = patched.indexOf(stateSearchEnd, stStart) + stateSearchEnd.length;
patched = patched.slice(0, stStart) + newStateBlock + patched.slice(stEnd);
console.log('Replaced state block');

// Validate syntax
console.log('Testing syntax of patched file...');
try {
  new vm.Script(patched);
  console.log('SYNTAX VALIDATION PASSED!');
  fs.writeFileSync('kinerja-perma-external-a42edc88f706.patched.js', patched, 'utf8');
  console.log('Successfully wrote to kinerja-perma-external-a42edc88f706.patched.js!');
} catch (e) {
  console.error('SYNTAX VALIDATION FAILED:', e);
  process.exit(1);
}
