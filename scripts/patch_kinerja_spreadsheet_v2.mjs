import fs from 'fs';
import vm from 'vm';

console.log('Reading kinerja-perma-external-a42edc88f706.patched.js...');
const original = fs.readFileSync('kinerja-perma-external-a42edc88f706.patched.js', 'utf8');

// 1. Update State block
const stateStart = original.indexOf('[exportMenuOpen,setExportMenuOpen]=(0,t.useState)(!1),');
if (stateStart === -1) throw new Error('State start not found');

const stateSearchEnd = '[pdfDataPer,setPdfDataPer]=(0,t.useState)(""),';
const stateEndIdx = original.indexOf(stateSearchEnd, stateStart);
if (stateEndIdx === -1) throw new Error('State end not found');
const fullStateEnd = stateEndIdx + stateSearchEnd.length;

const newStateBlock = `[exportMenuOpen,setExportMenuOpen]=(0,t.useState)(!1),
[pdfModalOpen,setPdfModalOpen]=(0,t.useState)(!1),
[pdfExpanded,setPdfExpanded]=(0,t.useState)(!1),
[pdfOrientation,setPdfOrientation]=(0,t.useState)("portrait"),
[pdfSatkerName,setPdfSatkerName]=(0,t.useState)("Nasional"),
[pdfPeriode,setPdfPeriode]=(0,t.useState)("Tahun 2026"),
[pdfWaktuCetak,setPdfWaktuCetak]=(0,t.useState)(""),
[pdfDataPer,setPdfDataPer]=(0,t.useState)(""),`;

// 2. Update openPdfModal block & getTableDataForPrint
const openPdfStart = original.indexOf('function openPdfModal(){');
if (openPdfStart === -1) throw new Error('openPdfModal not found');
const openPdfEnd = original.indexOf('function kpPrintPdf(){', openPdfStart);
if (openPdfEnd === -1) throw new Error('kpPrintPdf not found');

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
  setPdfOrientation("portrait");
  setPdfExpanded(!1);
  setPdfModalOpen(!0);
}

function kpFlattenNodes(arr, depth=0){
  let out=[];
  if(!Array.isArray(arr)) return out;
  for(let it of arr){
    if(!it||!it.data) continue;
    out.push({...it.data, depth});
    if(Array.isArray(it.children)&&it.children.length>0){
      out.push(...kpFlattenNodes(it.children, depth+1));
    }
  }
  return out;
}

function getTableDataForPrint(arr, d){
  let rows = [];
  let totalData = null;
  if(Array.isArray(arr) && arr.length === 1 && Array.isArray(arr[0].children) && arr[0].children.length > 0){
    totalData = arr[0].data;
    function flatten(list, depth=0, prefix=""){
      let out=[];
      for(let i=0; i<list.length; i++){
        let it = list[i];
        if(!it || !it.data) continue;
        let numStr = depth===0 ? (i+1)+"." : (prefix+(i+1)+".");
        out.push({...it.data, nomor: numStr, depth});
        if(Array.isArray(it.children) && it.children.length > 0){
          out.push(...flatten(it.children, depth+1, numStr));
        }
      }
      return out;
    }
    rows = flatten(arr[0].children);
  } else {
    rows = kpFlattenNodes(arr);
    let rootRows = rows.filter(r => r.depth === 0);
    let sumCt = rootRows.reduce((a, r) => a + (r.ct || 0), 0);
    let sumBu = rootRows.reduce((a, r) => a + ((r.cp_berjalan_belum_update || 0) + (r.cp_tunggakan_belum_update || 0)), 0);
    let sumLim = rootRows.reduce((a, r) => a + (r.limpah_eksternal || 0), 0);
    let sumCp = rootRows.reduce((a, r) => a + ((r.cp_berjalan || 0) + (r.cp_tunggakan || 0)), 0);
    let sumCc = rootRows.reduce((a, r) => a + ((r.cc_aktual || 0) + (r.cc_tunggakan || 0)), 0);
    let calcPr = sumCt > 0 ? (sumCp / sumCt * 100) : 0;
    let calcCr = sumCp > 0 ? (sumCc / sumCp * 100) : 0;
    totalData = {
      ct: sumCt || d?.ct || 0,
      cp_berjalan_belum_update: sumBu || (d?.cp_berjalan_belum_update ?? 0),
      cp_tunggakan_belum_update: 0,
      limpah_eksternal: sumLim || (d?.limpah_eksternal ?? 0),
      cp_berjalan: sumCp || (d?.cp_berjalan ?? 0),
      cp_tunggakan: 0,
      pr: d?.pr != null && d.pr > 0 ? d.pr : calcPr,
      cc_aktual: sumCc || (d?.cc_aktual ?? 0),
      cc_tunggakan: 0,
      cr: d?.cr != null && d.cr > 0 ? d.cr : calcCr,
      indeks: d?.indeks ?? 0,
      level: d?.level || null
    };
  }
  return { rows, totalData };
}

`;

// 3. Update kpPrintPdf block
const printStart = original.indexOf('function kpPrintPdf(){');
if (printStart === -1) throw new Error('kpPrintPdf not found');
const printEnd = original.indexOf('function applyUnifiedFilter(){', printStart);
if (printEnd === -1) throw new Error('applyUnifiedFilter not found');

const newPrintPdf = `function kpPrintPdf(){
  let { rows, totalData } = getTableDataForPrint(s, d);
  let rowsHtml = rows.map((r, rIdx)=>{
    let ind = r.depth > 0 ? \`padding-left:\${r.depth * 14 + 6}px;font-style:italic;\` : "font-weight:500;";
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
    return \`<tr style="\${bgRow}"><td style="text-align:center;width:30px;color:#0f172a;">\${noStr}</td><td style="text-align:left;color:#0f172a;\${ind}">\${r.nama||"-"}</td><td style="text-align:right;font-weight:bold;color:#1d4ed8;">\${ctV}</td><td style="text-align:right;color:#0f172a;">\${buV}</td><td style="text-align:right;color:#0f172a;">\${limV}</td><td style="text-align:right;color:#0f172a;">\${cpV}</td><td style="text-align:center;color:#0f172a;">\${prV}</td><td style="text-align:right;font-weight:bold;color:#15803d;">\${ccV}</td><td style="text-align:center;font-weight:bold;color:#0f172a;">\${crV}</td><td style="text-align:center;white-space:nowrap;color:#0f172a;"><strong>\${idxV}</strong> (\${lvlV})</td></tr>\`;
  }).join("");

  let totCt = (totalData?.ct??0).toLocaleString("id-ID");
  let totBu = ((totalData?.cp_berjalan_belum_update??0)+(totalData?.cp_tunggakan_belum_update??0)).toLocaleString("id-ID");
  let totLim = (totalData?.limpah_eksternal??0).toLocaleString("id-ID");
  let totCp = ((totalData?.cp_berjalan??0)+(totalData?.cp_tunggakan??0)).toLocaleString("id-ID");
  let totPr = ((totalData?.pr??0)).toFixed(2)+"%";
  let totCc = ((totalData?.cc_aktual??0)+(totalData?.cc_tunggakan??0)).toLocaleString("id-ID");
  let totCr = ((totalData?.cr??0)).toFixed(2)+"%";
  let totIdx = (totalData?.indeks??0).toLocaleString("id-ID",{minimumFractionDigits:2,maximumFractionDigits:2});
  let totLvl = totalData?.level ? \`LEVEL \${totalData.level}\` : "-";

  let docTitle = \`Lampiran Kinerja Perkara Satker \${pdfSatkerName||"Nasional"} Periode \${pdfPeriode||"Tahun 2026"}\`;

  let html = \`<!DOCTYPE html><html><head><meta charset="utf-8"><title>\${docTitle}</title><style>@page{size:A4 \${pdfOrientation||"portrait"};margin-top:2cm;margin-right:2cm;margin-bottom:2cm;margin-left:3cm;@bottom-left{content:"Sumber Data: CAS Bareskrim Polri";font-size:8.5pt;font-family:Arial,sans-serif;color:#64748b;}@bottom-right{content:"Halaman " counter(page) " dari " counter(pages);font-size:9pt;font-family:Arial,sans-serif;color:#64748b;}}*{box-sizing:border-box;}body{font-family:Arial,sans-serif;font-size:12pt;color:#0f172a;background:#ffffff;margin:0;padding:0;line-height:1.25;-webkit-print-color-adjust:exact !important;print-color-adjust:exact !important;}.sheet-title-box{text-align:center;margin-bottom:14px;padding-bottom:4px;}.sheet-title{font-family:Arial,sans-serif;font-size:12pt;font-weight:bold;color:#0f172a;text-transform:uppercase;letter-spacing:0.5px;margin:0;line-height:1.35;}table.sheet-table{width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:12pt;}thead{display:table-header-group;}tfoot{display:table-footer-group;}tr{page-break-inside:avoid;}th{font-family:Arial,sans-serif;font-size:11pt;font-weight:bold;background-color:#f1f5f9 !important;color:#0f172a !important;border:1px solid #94a3b8;padding:6px 4px;text-align:center;vertical-align:middle;}td{border:1px solid #cbd5e1;padding:5px 5px;vertical-align:middle;font-size:12pt;}.total-row td{font-family:Arial,sans-serif;font-size:12pt;font-weight:bold;background-color:#e2e8f0 !important;color:#0f172a !important;border-top:2px solid #0f172a;border-bottom:2px solid #0f172a;}.sheet-footer-meta{margin-top:14px;padding-top:6px;font-size:9.5pt;color:#475569;display:flex;justify-content:space-between;align-items:flex-end;}</style></head><body><div class="sheet-title-box"><div class="sheet-title">\${docTitle}</div></div><table class="sheet-table"><thead><tr><th style="width:30px;">NO</th><th>SATKER / KESATUAN</th><th style="width:65px;">CT</th><th style="width:65px;">SISA (BU)</th><th style="width:65px;">LIMPAH EKS.</th><th style="width:65px;">CP</th><th style="width:55px;">PR</th><th style="width:65px;">CC</th><th style="width:55px;">CR</th><th style="width:95px;">INDEKS KINERJA</th></tr></thead><tbody>\${rowsHtml}</tbody><tfoot><tr class="total-row"><td colspan="2" style="text-align:center;font-weight:bold;">TOTAL KESELURUHAN</td><td style="text-align:right;font-weight:bold;color:#1d4ed8;">\${totCt}</td><td style="text-align:right;font-weight:bold;">\${totBu}</td><td style="text-align:right;font-weight:bold;">\${totLim}</td><td style="text-align:right;font-weight:bold;">\${totCp}</td><td style="text-align:center;font-weight:bold;">\${totPr}</td><td style="text-align:right;font-weight:bold;color:#15803d;">\${totCc}</td><td style="text-align:center;font-weight:bold;">\${totCr}</td><td style="text-align:center;font-weight:bold;">\${totIdx} (\${totLvl})</td></tr></tfoot></table><div class="sheet-footer-meta"><div><strong>Sumber Data:</strong> CAS Bareskrim Polri &nbsp;&bull;&nbsp; <strong>Data per:</strong> \${pdfDataPer||"—"} &nbsp;&bull;&nbsp; <strong>Diambil:</strong> \${pdfWaktuCetak||"—"}</div></div></body></html>\`;

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

// 4. Update Dialog JSX
const dialogStart = original.indexOf('(0, a.jsx)(h.Dialog, {');
if (dialogStart === -1) throw new Error('h.Dialog start not found');

// Exact paren scanner for Dialog JSX
let firstParen = original.indexOf('(', dialogStart + 9);
let p = 1;
let dialogEnd = -1;
for (let i = firstParen + 1; i < original.length; i++) {
  if (original[i] === '(') p++;
  else if (original[i] === ')') {
    p--;
    if (p === 0) {
      dialogEnd = i + 1;
      break;
    }
  }
}
if (dialogEnd === -1) throw new Error('Dialog end not found via paren scanner');
console.log('Dialog from', dialogStart, 'to', dialogEnd);

const newDialogJsx = `(0, a.jsx)(h.Dialog, {
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
              (0, a.jsx)("div", { style: { fontSize: "0.75rem", color: "#64748b" }, children: "Kertas A4 • Margin: Kiri 3cm, Atas 2cm, Kanan 2cm, Bawah 2cm • Font: Arial 12" })
            ]
          })
        ]
      }),
      (0, a.jsxs)("div", {
        style: { display: "flex", gap: "0.5rem", alignItems: "center" },
        children: [
          (0, a.jsx)(p.Button, {
            label: pdfOrientation === "landscape" ? "Mendatar (Landscape)" : "Tegak (Portrait)",
            icon: pdfOrientation === "landscape" ? "pi pi-file-o" : "pi pi-file",
            text: !0,
            size: "small",
            onClick: () => setPdfOrientation(v => v === "portrait" ? "landscape" : "portrait"),
            title: "Ubah orientasi kertas cetak"
          }),
          (0, a.jsx)(p.Button, {
            label: pdfExpanded ? "Perkecil Tampilan" : "Perbesar Layar",
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
    background: "#0b1220",
    padding: "1.5rem"
  },
  footer: (0, a.jsxs)("div", {
    style: { display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" },
    children: [
      (0, a.jsxs)("div", {
        style: { fontSize: "0.78rem", color: "#64748b", display: "flex", alignItems: "center", gap: "0.4rem" },
        children: [
          (0, a.jsx)("i", { className: "pi pi-info-circle", style: { color: "#3b82f6" } }),
          (0, a.jsx)("span", { children: "Kertas A4 default dengan margin: Kiri 3cm, Atas 2cm, Kanan 2cm, Bawah 2cm. Nomor halaman tercetak otomatis." })
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
  children: (() => {
    let { rows: pRows, totalData: pTotal } = getTableDataForPrint(s, d);
    return (0, a.jsx)("div", {
      style: {
        background: "#ffffff",
        color: "#0f172a",
        borderRadius: "8px",
        border: "1px solid #cbd5e1",
        boxShadow: "0 6px 24px rgba(0, 0, 0, 0.25)",
        padding: "20mm 20mm 20mm 30mm",
        margin: "0 auto",
        maxWidth: pdfOrientation === "landscape" ? "1250px" : "850px",
        fontFamily: "Arial, sans-serif",
        fontSize: "12pt"
      },
      children: [
        (0, a.jsx)("div", {
          style: {
            textAlign: "center",
            marginBottom: "14px",
            paddingBottom: "4px"
          },
          children: (0, a.jsx)("div", {
            style: {
              fontSize: "12pt",
              fontWeight: "bold",
              color: "#0f172a",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              margin: 0,
              lineHeight: 1.35
            },
            children: "Lampiran Kinerja Perkara Satker " + (pdfSatkerName || "Nasional") + " Periode " + (pdfPeriode || "Tahun 2026")
          })
        }),
        (0, a.jsx)("div", {
          style: { overflowX: "auto" },
          children: (0, a.jsxs)("table", {
            style: {
              width: "100%",
              borderCollapse: "collapse",
              fontFamily: "Arial, sans-serif",
              fontSize: "12pt"
            },
            children: [
              (0, a.jsx)("thead", {
                children: (0, a.jsxs)("tr", {
                  style: { background: "#f1f5f9" },
                  children: [
                    (0, a.jsx)("th", { style: { width: "30px", border: "1px solid #94a3b8", padding: "6px 4px", textAlign: "center", fontWeight: "bold", fontSize: "11pt", color: "#0f172a" }, children: "NO" }),
                    (0, a.jsx)("th", { style: { border: "1px solid #94a3b8", padding: "6px 4px", textAlign: "left", fontWeight: "bold", fontSize: "11pt", color: "#0f172a" }, children: "SATKER / KESATUAN" }),
                    (0, a.jsx)("th", { style: { width: "65px", border: "1px solid #94a3b8", padding: "6px 4px", textAlign: "center", fontWeight: "bold", fontSize: "11pt", color: "#0f172a" }, children: "CT" }),
                    (0, a.jsx)("th", { style: { width: "65px", border: "1px solid #94a3b8", padding: "6px 4px", textAlign: "center", fontWeight: "bold", fontSize: "11pt", color: "#0f172a" }, children: "SISA (BU)" }),
                    (0, a.jsx)("th", { style: { width: "65px", border: "1px solid #94a3b8", padding: "6px 4px", textAlign: "center", fontWeight: "bold", fontSize: "11pt", color: "#0f172a" }, children: "LIMPAH EKS." }),
                    (0, a.jsx)("th", { style: { width: "65px", border: "1px solid #94a3b8", padding: "6px 4px", textAlign: "center", fontWeight: "bold", fontSize: "11pt", color: "#0f172a" }, children: "CP" }),
                    (0, a.jsx)("th", { style: { width: "55px", border: "1px solid #94a3b8", padding: "6px 4px", textAlign: "center", fontWeight: "bold", fontSize: "11pt", color: "#0f172a" }, children: "PR" }),
                    (0, a.jsx)("th", { style: { width: "65px", border: "1px solid #94a3b8", padding: "6px 4px", textAlign: "center", fontWeight: "bold", fontSize: "11pt", color: "#0f172a" }, children: "CC" }),
                    (0, a.jsx)("th", { style: { width: "55px", border: "1px solid #94a3b8", padding: "6px 4px", textAlign: "center", fontWeight: "bold", fontSize: "11pt", color: "#0f172a" }, children: "CR" }),
                    (0, a.jsx)("th", { style: { width: "95px", border: "1px solid #94a3b8", padding: "6px 4px", textAlign: "center", fontWeight: "bold", fontSize: "11pt", color: "#0f172a" }, children: "INDEKS KINERJA" })
                  ]
                })
              }),
              (0, a.jsx)("tbody", {
                children: pRows.map((r, rIdx) => {
                  let ind = r.depth > 0 ? (r.depth * 14 + 6) + "px" : "6px";
                  let isAlt = rIdx % 2 === 1;
                  return (0, a.jsxs)("tr", {
                    key: r.id || rIdx,
                    style: { background: isAlt ? "#f8fafc" : "#ffffff" },
                    children: [
                      (0, a.jsx)("td", { style: { border: "1px solid #cbd5e1", padding: "5px 5px", textAlign: "center", fontSize: "12pt", color: "#0f172a" }, children: r.nomor || "" }),
                      (0, a.jsx)("td", { style: { border: "1px solid #cbd5e1", padding: "5px 5px", paddingLeft: ind, fontStyle: r.depth > 0 ? "italic" : "normal", fontWeight: r.depth > 0 ? 500 : 500, fontSize: "12pt", color: "#0f172a" }, children: r.nama || "-" }),
                      (0, a.jsx)("td", { style: { border: "1px solid #cbd5e1", padding: "5px 5px", textAlign: "right", fontWeight: "bold", fontSize: "12pt", color: "#1d4ed8" }, children: (r.ct ?? 0).toLocaleString("id-ID") }),
                      (0, a.jsx)("td", { style: { border: "1px solid #cbd5e1", padding: "5px 5px", textAlign: "right", fontSize: "12pt", color: "#0f172a" }, children: ((r.cp_berjalan_belum_update ?? 0) + (r.cp_tunggakan_belum_update ?? 0)).toLocaleString("id-ID") }),
                      (0, a.jsx)("td", { style: { border: "1px solid #cbd5e1", padding: "5px 5px", textAlign: "right", fontSize: "12pt", color: "#0f172a" }, children: (r.limpah_eksternal ?? 0).toLocaleString("id-ID") }),
                      (0, a.jsx)("td", { style: { border: "1px solid #cbd5e1", padding: "5px 5px", textAlign: "right", fontSize: "12pt", color: "#0f172a" }, children: ((r.cp_berjalan ?? 0) + (r.cp_tunggakan ?? 0)).toLocaleString("id-ID") }),
                      (0, a.jsx)("td", { style: { border: "1px solid #cbd5e1", padding: "5px 5px", textAlign: "center", fontSize: "12pt", color: "#0f172a" }, children: (r.pr ?? 0).toFixed(2) + "%" }),
                      (0, a.jsx)("td", { style: { border: "1px solid #cbd5e1", padding: "5px 5px", textAlign: "right", fontWeight: "bold", fontSize: "12pt", color: "#15803d" }, children: ((r.cc_aktual ?? 0) + (r.cc_tunggakan ?? 0)).toLocaleString("id-ID") }),
                      (0, a.jsx)("td", { style: { border: "1px solid #cbd5e1", padding: "5px 5px", textAlign: "center", fontWeight: "bold", fontSize: "12pt", color: "#0f172a" }, children: (r.cr ?? 0).toFixed(2) + "%" }),
                      (0, a.jsx)("td", { style: { border: "1px solid #cbd5e1", padding: "5px 5px", textAlign: "center", whiteSpace: "nowrap", fontSize: "12pt", color: "#0f172a" }, children: (r.indeks ?? 0).toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + (r.level ? " (LEVEL " + r.level + ")" : " (-)") })
                    ]
                  });
                })
              }),
              (0, a.jsx)("tfoot", {
                children: (0, a.jsxs)("tr", {
                  style: {
                    background: "#e2e8f0",
                    fontWeight: "bold",
                    borderTop: "2px solid #0f172a",
                    borderBottom: "2px solid #0f172a"
                  },
                  children: [
                    (0, a.jsx)("td", { colSpan: 2, style: { border: "1px solid #94a3b8", padding: "6px 8px", textAlign: "center", fontSize: "12pt", color: "#0f172a", fontWeight: "bold" }, children: "TOTAL KESELURUHAN" }),
                    (0, a.jsx)("td", { style: { border: "1px solid #94a3b8", padding: "6px 8px", textAlign: "right", fontSize: "12pt", color: "#1d4ed8", fontWeight: "bold" }, children: (pTotal?.ct ?? 0).toLocaleString("id-ID") }),
                    (0, a.jsx)("td", { style: { border: "1px solid #94a3b8", padding: "6px 8px", textAlign: "right", fontSize: "12pt", color: "#0f172a", fontWeight: "bold" }, children: ((pTotal?.cp_berjalan_belum_update ?? 0) + (pTotal?.cp_tunggakan_belum_update ?? 0)).toLocaleString("id-ID") }),
                    (0, a.jsx)("td", { style: { border: "1px solid #94a3b8", padding: "6px 8px", textAlign: "right", fontSize: "12pt", color: "#0f172a", fontWeight: "bold" }, children: (pTotal?.limpah_eksternal ?? 0).toLocaleString("id-ID") }),
                    (0, a.jsx)("td", { style: { border: "1px solid #94a3b8", padding: "6px 8px", textAlign: "right", fontSize: "12pt", color: "#0f172a", fontWeight: "bold" }, children: ((pTotal?.cp_berjalan ?? 0) + (pTotal?.cp_tunggakan ?? 0)).toLocaleString("id-ID") }),
                    (0, a.jsx)("td", { style: { border: "1px solid #94a3b8", padding: "6px 8px", textAlign: "center", fontSize: "12pt", color: "#0f172a", fontWeight: "bold" }, children: (pTotal?.pr ?? 0).toFixed(2) + "%" }),
                    (0, a.jsx)("td", { style: { border: "1px solid #94a3b8", padding: "6px 8px", textAlign: "right", fontSize: "12pt", color: "#15803d", fontWeight: "bold" }, children: ((pTotal?.cc_aktual ?? 0) + (pTotal?.cc_tunggakan ?? 0)).toLocaleString("id-ID") }),
                    (0, a.jsx)("td", { style: { border: "1px solid #94a3b8", padding: "6px 8px", textAlign: "center", fontSize: "12pt", color: "#0f172a", fontWeight: "bold" }, children: (pTotal?.cr ?? 0).toFixed(2) + "%" }),
                    (0, a.jsx)("td", { style: { border: "1px solid #94a3b8", padding: "6px 8px", textAlign: "center", fontSize: "12pt", color: "#0f172a", fontWeight: "bold" }, children: (pTotal?.indeks ?? 0).toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + (pTotal?.level ? " (LEVEL " + pTotal.level + ")" : " (-)") })
                  ]
                })
              })
            ]
          })
        }),
        (0, a.jsxs)("div", {
          style: {
            marginTop: "14px",
            paddingTop: "6px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: "9.5pt",
            color: "#475569"
          },
          children: [
            (0, a.jsxs)("div", {
              children: [
                (0, a.jsx)("strong", { style: { color: "#0f172a" }, children: "Sumber Data: " }),
                "CAS Bareskrim Polri",
                (0, a.jsx)("span", { style: { margin: "0 6px", color: "#cbd5e1" }, children: "•" }),
                (0, a.jsx)("strong", { style: { color: "#0f172a" }, children: "Data per: " }),
                pdfDataPer || "—",
                (0, a.jsx)("span", { style: { margin: "0 6px", color: "#cbd5e1" }, children: "•" }),
                (0, a.jsx)("strong", { style: { color: "#0f172a" }, children: "Diambil: " }),
                pdfWaktuCetak || "—"
              ]
            }),
            (0, a.jsx)("div", {
              style: { color: "#94a3b8", fontSize: "8.5pt" },
              children: "Halaman 1 dari N (otomatis saat dicetak)"
            })
          ]
        })
      ]
    });
  })()
})`;

// Assemble in reverse order:
let patched = original;

// 1. Replace Dialog JSX
patched = patched.slice(0, dialogStart) + newDialogJsx + patched.slice(dialogEnd);
console.log('Replaced Dialog JSX');

// 2. Replace kpPrintPdf
const pStart = patched.indexOf('function kpPrintPdf(){');
const pEnd = patched.indexOf('function applyUnifiedFilter(){', pStart);
patched = patched.slice(0, pStart) + newPrintPdf + patched.slice(pEnd);
console.log('Replaced kpPrintPdf');

// 3. Replace openPdfModal
const opStart = patched.indexOf('function openPdfModal(){');
const opEnd = patched.indexOf('function kpPrintPdf(){', opStart);
patched = patched.slice(0, opStart) + newOpenPdf + patched.slice(opEnd);
console.log('Replaced openPdfModal & added getTableDataForPrint');

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
