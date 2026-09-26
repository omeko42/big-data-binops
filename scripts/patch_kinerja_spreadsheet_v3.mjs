import fs from 'fs';
import vm from 'vm';

console.log('Reading kinerja-perma-external-a42edc88f706.patched.js...');
const original = fs.readFileSync('kinerja-perma-external-a42edc88f706.patched.js', 'utf8');

// 1. Update State block (added pdfCrimeFilter)
const stateStart = original.indexOf('[exportMenuOpen,setExportMenuOpen]=(0,t.useState)(!1),');
if (stateStart === -1) throw new Error('State start not found');

const stateSearchEnd = '[pdfDataPer,setPdfDataPer]=(0,t.useState)(""),';
const stateEndIdx = original.indexOf(stateSearchEnd, stateStart);
if (stateEndIdx === -1) throw new Error('State end not found');
const fullStateEnd = stateEndIdx + stateSearchEnd.length;

const newStateBlock = `[exportMenuOpen,setExportMenuOpen]=(0,t.useState)(!1),
[pdfModalOpen,setPdfModalOpen]=(0,t.useState)(!1),
[pdfExpanded,setPdfExpanded]=(0,t.useState)(!1),
[pdfOrientation,setPdfOrientation]=(0,t.useState)("landscape"),
[pdfSatkerName,setPdfSatkerName]=(0,t.useState)("BARESKRIM POLRI DAN POLDA JAJARAN"),
[pdfPeriode,setPdfPeriode]=(0,t.useState)("TAHUN 2026"),
[pdfCrimeFilter,setPdfCrimeFilter]=(0,t.useState)(""),
[pdfWaktuCetak,setPdfWaktuCetak]=(0,t.useState)(""),
[pdfDataPer,setPdfDataPer]=(0,t.useState)(""),`;

// Helper code for title lines & date formatting
const helperFunctions = `
function generateCasHashFilename(ext){
  let arr = new Uint8Array(8);
  if (typeof window !== "undefined" && window.crypto && window.crypto.getRandomValues) {
    window.crypto.getRandomValues(arr);
  } else {
    for (let i = 0; i < 8; i++) arr[i] = Math.floor(Math.random() * 256);
  }
  let hex = Array.from(arr, b => b.toString(16).padStart(2, "0")).join("");
  return "cas_" + hex + (ext ? "." + ext : "");
}

const KP_INDO_MONTHS = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

function formatIndoDateTime(dt){
  if(!dt) return "—";
  let d = typeof dt === "string" ? new Date(dt) : dt;
  if(isNaN(d.getTime())) return String(dt);
  let dd = d.getDate();
  let mm = KP_INDO_MONTHS[d.getMonth()];
  let yy = d.getFullYear();
  let hh = String(d.getHours()).padStart(2, "0");
  let mi = String(d.getMinutes()).padStart(2, "0");
  return \`\${dd} \${mm} \${yy} pukul \${hh}.\${mi} WIB\`;
}

function getPdfTitleLines(orientation, satker, periode, crime){
  let sUpper = (satker || "BARESKRIM POLRI DAN POLDA JAJARAN").toUpperCase().trim();
  if(sUpper.includes("SEMUA JAJARAN") || sUpper.includes("MABES & SELURUH POLDA") || sUpper === "NASIONAL" || sUpper === "BARESKRIM POLRI DAN JAJARAN" || sUpper === "BARESKRIM POLRI"){
    sUpper = "BARESKRIM POLRI DAN POLDA JAJARAN";
  }
  let pUpper = (periode || "TAHUN 2026").toUpperCase().trim();
  if(!pUpper.startsWith("PERIODE")){
    pUpper = "PERIODE " + pUpper;
  }
  let cUpper = (crime || "").toUpperCase().trim();

  let lines = [];
  if(orientation === "landscape"){
    lines.push(\`LAMPIRAN KINERJA PERKARA SATKER \${sUpper}\`);
    if(cUpper){
      let combined = \`\${pUpper} • \${cUpper}\`;
      if(combined.length <= 65){
        lines.push(combined);
      } else {
        lines.push(pUpper);
        lines.push(cUpper);
      }
    } else {
      lines.push(pUpper);
    }
  } else {
    lines.push("LAMPIRAN KINERJA PERKARA SATKER");
    lines.push(sUpper);
    lines.push(pUpper);
    if(cUpper){
      lines.push(cUpper);
    }
  }
  return lines;
}
`;

// 2. Update openPdfModal block & getTableDataForPrint
let openPdfStart = original.indexOf('const KP_INDO_MONTHS =');
if (openPdfStart === -1) {
  openPdfStart = original.indexOf('function openPdfModal(){');
}
if (openPdfStart === -1) throw new Error('openPdfModal not found');
const openPdfEnd = original.indexOf('function kpPrintPdf(){', openPdfStart);
if (openPdfEnd === -1) throw new Error('kpPrintPdf not found');

const newOpenPdf = helperFunctions + `
function openPdfModal(){
  setExportMenuOpen(!1);
  let satker = "BARESKRIM POLRI DAN POLDA JAJARAN";
  if(eScope==="scoped"&&eScopeSatkerId){
    let sObj=eScopeOpts.find(x=>x.value===eScopeSatkerId);
    if(sObj&&sObj.label){
      let lbl = sObj.label.toUpperCase().trim();
      if(lbl === "BARESKRIM POLRI" || eScopeSatkerId === 13 || lbl.includes("SEMUA JAJARAN") || lbl.includes("MABES & SELURUH POLDA") || lbl === "NASIONAL"){
        satker = "BARESKRIM POLRI DAN POLDA JAJARAN";
      } else {
        satker = lbl + (lbl.includes("POLDA") && !lbl.includes("JAJARAN") ? " DAN JAJARAN" : "");
      }
    }
  } else {
    satker = "BARESKRIM POLRI DAN POLDA JAJARAN";
  }
  if(satker.includes("SEMUA JAJARAN") || satker.includes("MABES & SELURUH POLDA") || satker === "NASIONAL" || satker === "BARESKRIM POLRI DAN JAJARAN"){
    satker = "BARESKRIM POLRI DAN POLDA JAJARAN";
  }

  let crime = "";
  let curAP = eAP || {};
  let curJenis = (curAP.jenis && curAP.jenis.length > 0) ? curAP.jenis : (em || []);
  let curGol = (curAP.golongan && curAP.golongan.length > 0) ? curAP.golongan : (ey || []);
  let curKel = (curAP.kelompok && curAP.kelompok.length > 0) ? curAP.kelompok : (eKG || []);
  let curIccs = (curAP.iccs && curAP.iccs.length > 0) ? curAP.iccs : (ek || []);

  if(curJenis.length > 0){
    let names = curJenis.map(id => {
      let item = (eg || []).find(x => x.value === id);
      return item ? (item.fullLabel || item.label) : id;
    });
    crime = "KEJAHATAN SPESIFIK: " + names.join(", ").toUpperCase();
  } else if(curGol.length > 0){
    let names = curGol.map(id => {
      let item = (ej || []).find(x => x.value === id);
      return item ? item.label : id;
    });
    let gStr = names.join(", ").toUpperCase();
    crime = gStr.startsWith("GOLONGAN") ? gStr : ("GOLONGAN " + gStr);
  } else if(curKel.length > 0){
    crime = "KELOMPOK: " + curKel.join(", ").toUpperCase();
  } else if(curIccs.length > 0){
    let names = curIccs.map(id => {
      let item = (eC || []).find(x => x.value === id);
      return item ? item.label : id;
    });
    crime = "ICCS: " + names.join(", ").toUpperCase();
  }

  let per = (kpPeriodLabel || "Tahun 2026").trim();
  let waktu = formatIndoDateTime(new Date());
  let dPer = x?.last_refreshed_at ? formatIndoDateTime(x.last_refreshed_at) : waktu;

  setPdfSatkerName(satker);
  setPdfPeriode(per);
  setPdfCrimeFilter(crime);
  setPdfWaktuCetak(waktu);
  setPdfDataPer(dPer);
  setPdfOrientation("landscape");
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
    let lvlV = r.level ? \`LV \${r.level}\` : "-";
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
  let totLvl = totalData?.level ? \`LV \${totalData.level}\` : "-";

  let tLines = getPdfTitleLines(pdfOrientation, pdfSatkerName, pdfPeriode, pdfCrimeFilter);
  let titleLinesHtml = tLines.map(line => \`<div class="sheet-title-line">\${line}</div>\`).join("");

  let footerDataPer = pdfDataPer || "—";
  let footerWaktuCetak = pdfWaktuCetak || "—";
  let footerFontSize = pdfOrientation === "portrait" ? "6.8pt" : "8.5pt";

  let pdfDocTitle = generateCasHashFilename();
  let html = \`<!DOCTYPE html><html><head><meta charset="utf-8"><title>\${pdfDocTitle}</title><style>@page{size:A4 \${pdfOrientation||"landscape"};margin-top:2cm;margin-right:2cm;margin-bottom:2cm;margin-left:3cm;@bottom-left{content:"Sumber Data: CAS Bareskrim Polri \\\\2022  Data per: \${footerDataPer} \\\\2022  Diambil: \${footerWaktuCetak}";font-size:\${footerFontSize};font-family:Arial,sans-serif;color:#475569;}@bottom-right{content:"Halaman " counter(page) " dari " counter(pages);font-size:\${footerFontSize};font-family:Arial,sans-serif;color:#64748b;}}*{box-sizing:border-box;}html,body{margin:0;padding:0;font-family:Arial,sans-serif;font-size:10pt;color:#0f172a;background:#ffffff;line-height:1.25;-webkit-print-color-adjust:exact !important;print-color-adjust:exact !important;}.sheet-title-box{text-align:center;margin-bottom:28px;padding-bottom:2px;}.sheet-title-line{font-family:Arial,sans-serif;font-size:12pt;font-weight:bold;color:#0f172a;text-transform:uppercase;letter-spacing:0.5px;margin:2px 0;line-height:1.35;}table.sheet-table{width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:10pt;}thead{display:table-header-group;}tr{page-break-inside:avoid;break-inside:avoid;}th{font-family:Arial,sans-serif;font-size:10pt;font-weight:bold;background-color:#f1f5f9 !important;color:#0f172a !important;border:1px solid #94a3b8;padding:5px 4px;text-align:center;vertical-align:middle;}td{border:1px solid #cbd5e1;padding:4.5px 5px;vertical-align:middle;font-size:10pt;}.total-row td{background-color:#e2e8f0 !important;color:#0f172a !important;font-weight:bold;font-size:10pt;border:1px solid #94a3b8 !important;border-top:2px solid #0f172a !important;border-bottom:2px solid #0f172a !important;}</style></head><body><div class="sheet-title-box">\${titleLinesHtml}</div><table class="sheet-table"><thead><tr><th style="width:30px;">NO</th><th>SATKER / KESATUAN</th><th style="width:65px;">CT</th><th style="width:65px;">SISA (BU)</th><th style="width:65px;">LIMPAH EKS.</th><th style="width:65px;">CP</th><th style="width:55px;">PR</th><th style="width:65px;">CC</th><th style="width:55px;">CR</th><th style="width:95px;">INDEKS KINERJA</th></tr></thead><tbody>\${rowsHtml}<tr class="total-row" style="page-break-inside:avoid;break-inside:avoid;"><td colspan="2" style="text-align:center;font-weight:bold;">TOTAL KESELURUHAN</td><td style="text-align:right;font-weight:bold;color:#1d4ed8;">\${totCt}</td><td style="text-align:right;font-weight:bold;">\${totBu}</td><td style="text-align:right;font-weight:bold;">\${totLim}</td><td style="text-align:right;font-weight:bold;">\${totCp}</td><td style="text-align:center;font-weight:bold;">\${totPr}</td><td style="text-align:right;font-weight:bold;color:#15803d;">\${totCc}</td><td style="text-align:center;font-weight:bold;">\${totCr}</td><td style="text-align:center;font-weight:bold;">\${totIdx} (\${totLvl})</td></tr></tbody></table></body></html>\`;

  let origTitle = document.title;
  try {
    if (window.top && window.top.document) {
      origTitle = window.top.document.title || origTitle;
      window.top.document.title = pdfDocTitle;
    }
  } catch (e) {}
  document.title = pdfDocTitle;

  let restored = false;
  let restoreTitle = () => {
    if (!restored) {
      restored = true;
      try {
        if (window.top && window.top.document) window.top.document.title = origTitle;
      } catch (e) {}
      document.title = origTitle;
    }
  };

  window.addEventListener("afterprint", restoreTitle, { once: true });

  try {
    let iframe = document.getElementById("kp-print-iframe");
    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.id = "kp-print-iframe";
      iframe.style.position = "fixed";
      iframe.style.top = "0";
      iframe.style.left = "0";
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.style.border = "none";
      iframe.style.opacity = "0";
      iframe.style.pointerEvents = "none";
      iframe.style.zIndex = "-9999";
      document.body.appendChild(iframe);
    }
    let doc = iframe.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close();
    try {
      doc.title = pdfDocTitle;
      iframe.contentWindow.addEventListener("afterprint", restoreTitle, { once: true });
    } catch(e){}
    setTimeout(restoreTitle, 25000);
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
      w.document.title = pdfDocTitle;
      w.focus();
      setTimeout(() => { w.print(); }, 350);
    } else {
      alert("Pop-up diblokir. Harap izinkan pop-up di browser Anda.");
    }
    setTimeout(restoreTitle, 5000);
  }
}

`;

// 4. Update Dialog JSX
const dialogStart = original.indexOf('(0, a.jsx)(h.Dialog, {');
if (dialogStart === -1) throw new Error('h.Dialog start not found');

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

const modalCssTag = `
/* Light Mode Defaults */
.kp-modal-header-title { font-weight: 800; font-size: 1.05rem; color: #0f172a; }
.kp-modal-header-sub { font-size: 0.75rem; color: #64748b; margin-top: 1px; }
.kp-modal-btn { background: #f8fafc; border: 1px solid #cbd5e1; color: #334155; border-radius: 8px; font-size: 0.8rem; font-weight: 700; padding: 0.4rem 0.75rem; cursor: pointer; display: inline-flex; align-items: center; gap: 0.45rem; transition: all 0.15s ease; font-family: inherit; }
.kp-modal-btn:hover { background: #f1f5f9; color: #0f172a; border-color: #94a3b8; }
.kp-dialog-canvas { background: #e2e8f0 !important; }
.kp-dialog-footer-text { font-size: 0.78rem; color: #64748b; display: flex; align-items: center; gap: 0.4rem; }

/* Dark Theme Overrides */
:root[data-theme="dark"] .kp-print-dialog .p-dialog-header { background: #111a2e !important; border-bottom: 1px solid #1f2b45 !important; }
:root[data-theme="dark"] .kp-modal-header-title { color: #f8fafc !important; }
:root[data-theme="dark"] .kp-modal-header-sub { color: #94a3b8 !important; }
:root[data-theme="dark"] .kp-modal-btn { background: #1e293b !important; border: 1px solid #334155 !important; color: #f1f5f9 !important; }
:root[data-theme="dark"] .kp-modal-btn:hover { background: #27354f !important; color: #ffffff !important; border-color: #475569 !important; }
:root[data-theme="dark"] .kp-dialog-canvas { background: #070d18 !important; }
:root[data-theme="dark"] .kp-print-dialog .p-dialog-footer { background: #111a2e !important; border-top: 1px solid #1f2b45 !important; }
:root[data-theme="dark"] .kp-dialog-footer-text { color: #94a3b8 !important; }

/* Protected Authentic White A4 Paper Sheet */
.kp-paper-sheet,
:root[data-theme="dark"] .p-dialog .kp-paper-sheet,
:root[data-theme="dark"] .kp-paper-sheet {
  background-color: #ffffff !important;
  color: #0f172a !important;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.45) !important;
  border: 1px solid #cbd5e1 !important;
}
.kp-paper-sheet .sheet-title-box,
:root[data-theme="dark"] .p-dialog .kp-paper-sheet .sheet-title-box {
  text-align: center !important;
  margin-bottom: 28px !important;
}
.kp-paper-sheet .kp-sheet-title-line,
:root[data-theme="dark"] .p-dialog .kp-paper-sheet .kp-sheet-title-line {
  font-family: Arial, sans-serif !important;
  font-size: 12pt !important;
  font-weight: bold !important;
  color: #0f172a !important;
  text-transform: uppercase !important;
  letter-spacing: 0.5px !important;
  line-height: 1.35 !important;
  margin: 2px 0 !important;
  text-align: center !important;
}
.kp-paper-sheet table,
:root[data-theme="dark"] .p-dialog .kp-paper-sheet table {
  width: 100% !important;
  border-collapse: collapse !important;
  background-color: #ffffff !important;
  font-family: Arial, sans-serif !important;
  font-size: 10pt !important;
}
.kp-paper-sheet th,
:root[data-theme="dark"] .p-dialog .kp-paper-sheet th {
  background-color: #f1f5f9 !important;
  color: #0f172a !important;
  border: 1px solid #94a3b8 !important;
  padding: 5px 4px !important;
  font-family: Arial, sans-serif !important;
  font-size: 10pt !important;
  font-weight: bold !important;
  text-align: center !important;
}
.kp-paper-sheet td,
:root[data-theme="dark"] .p-dialog .kp-paper-sheet td {
  border: 1px solid #cbd5e1 !important;
  padding: 4.5px 5px !important;
  font-family: Arial, sans-serif !important;
  font-size: 10pt !important;
  color: #0f172a !important;
}
.kp-paper-sheet tr.kp-row-white td,
:root[data-theme="dark"] .p-dialog .kp-paper-sheet tr.kp-row-white td {
  background-color: #ffffff !important;
}
.kp-paper-sheet tr.kp-row-zebra td,
:root[data-theme="dark"] .p-dialog .kp-paper-sheet tr.kp-row-zebra td {
  background-color: #f8fafc !important;
}
.kp-paper-sheet tr.total-row td,
:root[data-theme="dark"] .p-dialog .kp-paper-sheet tr.total-row td {
  background-color: #e2e8f0 !important;
  color: #0f172a !important;
  border: 1px solid #94a3b8 !important;
  border-top: 2px solid #0f172a !important;
  border-bottom: 2px solid #0f172a !important;
  font-weight: bold !important;
}
.kp-paper-sheet .kp-sheet-footer,
:root[data-theme="dark"] .p-dialog .kp-paper-sheet .kp-sheet-footer {
  margin-top: 24px !important;
  padding-top: 6px !important;
  border-top: 1px dashed #cbd5e1 !important;
  display: flex !important;
  justify-content: space-between !important;
  align-items: flex-end !important;
  font-size: 9pt !important;
  color: #475569 !important;
}
.kp-paper-sheet .kp-sheet-footer strong,
:root[data-theme="dark"] .p-dialog .kp-paper-sheet .kp-sheet-footer strong {
  color: #0f172a !important;
}
`;

const newDialogJsx = `(0, a.jsx)(h.Dialog, {
  className: "kp-print-dialog",
  contentClassName: "kp-dialog-canvas",
  header: (0, a.jsxs)("div", {
    style: { display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", gap: "1rem", paddingRight: "0.5rem" },
    children: [
      (0, a.jsxs)("div", {
        style: { display: "flex", alignItems: "center", gap: "0.6rem" },
        children: [
          (0, a.jsx)("i", { className: "pi pi-file-pdf", style: { color: "#dc2626", fontSize: "1.3rem" } }),
          (0, a.jsxs)("div", {
            children: [
              (0, a.jsx)("div", { className: "kp-modal-header-title", children: "Cetak Lampiran Kinerja Perkara" }),
              (0, a.jsx)("div", { className: "kp-modal-header-sub", children: "Kertas A4 • Margin: Kiri 3cm, Atas 2cm, Kanan 2cm, Bawah 2cm • Font Tabel: 10pt" })
            ]
          })
        ]
      }),
      (0, a.jsxs)("div", {
        style: { display: "flex", gap: "0.5rem", alignItems: "center" },
        children: [
          (0, a.jsxs)("button", {
            type: "button",
            className: "kp-modal-btn",
            onClick: () => setPdfOrientation(v => v === "portrait" ? "landscape" : "portrait"),
            title: "Ubah orientasi kertas cetak",
            children: [
              (0, a.jsx)("i", { className: pdfOrientation === "landscape" ? "pi pi-file-o" : "pi pi-file", style: { fontSize: "0.85rem" } }),
              pdfOrientation === "landscape" ? "Mendatar (Landscape)" : "Tegak (Portrait)"
            ]
          }),
          (0, a.jsxs)("button", {
            type: "button",
            className: "kp-modal-btn",
            onClick: () => setPdfExpanded(v => !v),
            title: "Perbesar atau perkecil modal",
            children: [
              (0, a.jsx)("i", { className: pdfExpanded ? "pi pi-window-minimize" : "pi pi-window-maximize", style: { fontSize: "0.85rem" } }),
              pdfExpanded ? "Perkecil Tampilan" : "Perbesar Layar"
            ]
          }),
          (0, a.jsxs)("button", {
            type: "button",
            className: "p-button p-button-sm",
            onClick: kpPrintPdf,
            style: { background: "#dc2626", borderColor: "#dc2626", color: "#ffffff", fontWeight: 700, borderRadius: "8px", padding: "0.4rem 0.85rem", display: "inline-flex", alignItems: "center", gap: "0.4rem", cursor: "pointer" },
            children: [
              (0, a.jsx)("i", { className: "pi pi-print", style: { fontSize: "0.9rem" } }),
              "Cetak / Simpan PDF"
            ]
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
    : { width: "84rem", maxWidth: "96vw" },
  contentStyle: {
    overflow: "auto",
    height: pdfExpanded ? "calc(100vh - 125px)" : "auto",
    maxHeight: pdfExpanded ? "calc(100vh - 125px)" : "75vh",
    padding: "1.5rem"
  },
  footer: (0, a.jsxs)("div", {
    style: { display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" },
    children: [
      (0, a.jsxs)("div", {
        className: "kp-dialog-footer-text",
        children: [
          (0, a.jsx)("i", { className: "pi pi-info-circle", style: { color: "#3b82f6" } }),
          (0, a.jsx)("span", { children: "Kertas A4 default dengan margin: Kiri 3cm, Atas 2cm, Kanan 2cm, Bawah 2cm. Total Keseluruhan hanya di halaman terakhir." })
        ]
      }),
      (0, a.jsxs)("div", {
        style: { display: "flex", gap: "0.5rem" },
        children: [
          (0, a.jsx)("button", {
            type: "button",
            className: "kp-modal-btn",
            onClick: () => setPdfModalOpen(!1),
            children: "Tutup"
          }),
          (0, a.jsxs)("button", {
            type: "button",
            className: "p-button p-button-sm",
            onClick: kpPrintPdf,
            style: { background: "#dc2626", borderColor: "#dc2626", color: "#ffffff", fontWeight: 700, borderRadius: "8px", padding: "0.4rem 0.85rem", display: "inline-flex", alignItems: "center", gap: "0.4rem", cursor: "pointer" },
            children: [
              (0, a.jsx)("i", { className: "pi pi-print", style: { fontSize: "0.9rem" } }),
              "Cetak / Simpan PDF"
            ]
          })
        ]
      })
    ]
  }),
  modal: !0,
  dismissableMask: !1,
  children: (() => {
    let { rows: pRows, totalData: pTotal } = getTableDataForPrint(s, d);
    let tLines = getPdfTitleLines(pdfOrientation, pdfSatkerName, pdfPeriode, pdfCrimeFilter);
    return (0, a.jsxs)("div", {
      className: "kp-paper-canvas-wrap",
      children: [
        (0, a.jsx)("style", { children: ${JSON.stringify(modalCssTag)} }),
        (0, a.jsxs)("div", {
          className: "kp-paper-sheet",
          style: {
            backgroundColor: "#ffffff",
            color: "#0f172a",
            borderRadius: "6px",
            border: "1px solid #cbd5e1",
            boxShadow: "0 12px 36px rgba(0, 0, 0, 0.45)",
            padding: "20mm 20mm 15mm 30mm",
            margin: "0 auto",
            maxWidth: pdfOrientation === "landscape" ? "1250px" : "850px",
            minHeight: pdfOrientation === "landscape" ? "560px" : "750px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            fontFamily: "Arial, sans-serif"
          },
          children: [
            (0, a.jsxs)("div", {
              children: [
                (0, a.jsx)("div", {
                  className: "sheet-title-box",
                  style: {
                    textAlign: "center",
                    marginBottom: "28px",
                    paddingBottom: "2px"
                  },
                  children: tLines.map((line, idx) => (0, a.jsx)("div", {
                    key: idx,
                    className: "kp-sheet-title-line",
                    style: {
                      fontSize: "12pt",
                      fontWeight: "bold",
                      color: "#0f172a",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      margin: "2px 0",
                      lineHeight: 1.35
                    },
                    children: line
                  }))
                }),
                (0, a.jsx)("div", {
                  style: { overflowX: "auto" },
                  children: (0, a.jsxs)("table", {
                    style: {
                      width: "100%",
                      borderCollapse: "collapse",
                      fontFamily: "Arial, sans-serif",
                      fontSize: "10pt"
                    },
                    children: [
                      (0, a.jsx)("thead", {
                        children: (0, a.jsxs)("tr", {
                          style: { background: "#f1f5f9" },
                          children: [
                            (0, a.jsx)("th", { style: { width: "30px", border: "1px solid #94a3b8", padding: "5px 4px", textAlign: "center", fontWeight: "bold", fontSize: "10pt", color: "#0f172a" }, children: "NO" }),
                            (0, a.jsx)("th", { style: { border: "1px solid #94a3b8", padding: "5px 4px", textAlign: "left", fontWeight: "bold", fontSize: "10pt", color: "#0f172a" }, children: "SATKER / KESATUAN" }),
                            (0, a.jsx)("th", { style: { width: "65px", border: "1px solid #94a3b8", padding: "5px 4px", textAlign: "center", fontWeight: "bold", fontSize: "10pt", color: "#0f172a" }, children: "CT" }),
                            (0, a.jsx)("th", { style: { width: "65px", border: "1px solid #94a3b8", padding: "5px 4px", textAlign: "center", fontWeight: "bold", fontSize: "10pt", color: "#0f172a" }, children: "SISA (BU)" }),
                            (0, a.jsx)("th", { style: { width: "65px", border: "1px solid #94a3b8", padding: "5px 4px", textAlign: "center", fontWeight: "bold", fontSize: "10pt", color: "#0f172a" }, children: "LIMPAH EKS." }),
                            (0, a.jsx)("th", { style: { width: "65px", border: "1px solid #94a3b8", padding: "5px 4px", textAlign: "center", fontWeight: "bold", fontSize: "10pt", color: "#0f172a" }, children: "CP" }),
                            (0, a.jsx)("th", { style: { width: "55px", border: "1px solid #94a3b8", padding: "5px 4px", textAlign: "center", fontWeight: "bold", fontSize: "10pt", color: "#0f172a" }, children: "PR" }),
                            (0, a.jsx)("th", { style: { width: "65px", border: "1px solid #94a3b8", padding: "5px 4px", textAlign: "center", fontWeight: "bold", fontSize: "10pt", color: "#0f172a" }, children: "CC" }),
                            (0, a.jsx)("th", { style: { width: "55px", border: "1px solid #94a3b8", padding: "5px 4px", textAlign: "center", fontWeight: "bold", fontSize: "10pt", color: "#0f172a" }, children: "CR" }),
                            (0, a.jsx)("th", { style: { width: "95px", border: "1px solid #94a3b8", padding: "5px 4px", textAlign: "center", fontWeight: "bold", fontSize: "10pt", color: "#0f172a" }, children: "INDEKS KINERJA" })
                          ]
                        })
                      }),
                      (0, a.jsxs)("tbody", {
                        children: [
                          pRows.map((r, rIdx) => {
                            let ind = r.depth > 0 ? (r.depth * 14 + 6) + "px" : "6px";
                            let isAlt = rIdx % 2 === 1;
                            return (0, a.jsxs)("tr", {
                              key: r.id || rIdx,
                              className: isAlt ? "kp-row-zebra" : "kp-row-white",
                              style: { background: isAlt ? "#f8fafc" : "#ffffff" },
                              children: [
                                (0, a.jsx)("td", { style: { border: "1px solid #cbd5e1", padding: "4.5px 5px", textAlign: "center", fontSize: "10pt", color: "#0f172a" }, children: r.nomor || "" }),
                                (0, a.jsx)("td", { style: { border: "1px solid #cbd5e1", padding: "4.5px 5px", paddingLeft: ind, fontStyle: r.depth > 0 ? "italic" : "normal", fontWeight: r.depth > 0 ? 500 : 500, fontSize: "10pt", color: "#0f172a" }, children: r.nama || "-" }),
                                (0, a.jsx)("td", { style: { border: "1px solid #cbd5e1", padding: "4.5px 5px", textAlign: "right", fontWeight: "bold", fontSize: "10pt", color: "#1d4ed8" }, children: (r.ct ?? 0).toLocaleString("id-ID") }),
                                (0, a.jsx)("td", { style: { border: "1px solid #cbd5e1", padding: "4.5px 5px", textAlign: "right", fontSize: "10pt", color: "#0f172a" }, children: ((r.cp_berjalan_belum_update ?? 0) + (r.cp_tunggakan_belum_update ?? 0)).toLocaleString("id-ID") }),
                                (0, a.jsx)("td", { style: { border: "1px solid #cbd5e1", padding: "4.5px 5px", textAlign: "right", fontSize: "10pt", color: "#0f172a" }, children: (r.limpah_eksternal ?? 0).toLocaleString("id-ID") }),
                                (0, a.jsx)("td", { style: { border: "1px solid #cbd5e1", padding: "4.5px 5px", textAlign: "right", fontSize: "10pt", color: "#0f172a" }, children: ((r.cp_berjalan ?? 0) + (r.cp_tunggakan ?? 0)).toLocaleString("id-ID") }),
                                (0, a.jsx)("td", { style: { border: "1px solid #cbd5e1", padding: "4.5px 5px", textAlign: "center", fontSize: "10pt", color: "#0f172a" }, children: (r.pr ?? 0).toFixed(2) + "%" }),
                                (0, a.jsx)("td", { style: { border: "1px solid #cbd5e1", padding: "4.5px 5px", textAlign: "right", fontWeight: "bold", fontSize: "10pt", color: "#15803d" }, children: ((r.cc_aktual ?? 0) + (r.cc_tunggakan ?? 0)).toLocaleString("id-ID") }),
                                (0, a.jsx)("td", { style: { border: "1px solid #cbd5e1", padding: "4.5px 5px", textAlign: "center", fontWeight: "bold", fontSize: "10pt", color: "#0f172a" }, children: (r.cr ?? 0).toFixed(2) + "%" }),
                                (0, a.jsx)("td", { style: { border: "1px solid #cbd5e1", padding: "4.5px 5px", textAlign: "center", whiteSpace: "nowrap", fontSize: "10pt", color: "#0f172a" }, children: (r.indeks ?? 0).toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + (r.level ? " (LV " + r.level + ")" : " (-)") })
                              ]
                            });
                          }),
                          (0, a.jsxs)("tr", {
                            className: "total-row",
                            style: {
                              background: "#e2e8f0",
                              fontWeight: "bold",
                              borderTop: "2px solid #0f172a",
                              borderBottom: "2px solid #0f172a"
                            },
                            children: [
                              (0, a.jsx)("td", { colSpan: 2, style: { border: "1px solid #94a3b8", padding: "5px 8px", textAlign: "center", fontSize: "10pt", color: "#0f172a", fontWeight: "bold" }, children: "TOTAL KESELURUHAN" }),
                              (0, a.jsx)("td", { style: { border: "1px solid #94a3b8", padding: "5px 8px", textAlign: "right", fontSize: "10pt", color: "#1d4ed8", fontWeight: "bold" }, children: (pTotal?.ct ?? 0).toLocaleString("id-ID") }),
                              (0, a.jsx)("td", { style: { border: "1px solid #94a3b8", padding: "5px 8px", textAlign: "right", fontSize: "10pt", color: "#0f172a", fontWeight: "bold" }, children: ((pTotal?.cp_berjalan_belum_update ?? 0) + (pTotal?.cp_tunggakan_belum_update ?? 0)).toLocaleString("id-ID") }),
                              (0, a.jsx)("td", { style: { border: "1px solid #94a3b8", padding: "5px 8px", textAlign: "right", fontSize: "10pt", color: "#0f172a", fontWeight: "bold" }, children: (pTotal?.limpah_eksternal ?? 0).toLocaleString("id-ID") }),
                              (0, a.jsx)("td", { style: { border: "1px solid #94a3b8", padding: "5px 8px", textAlign: "right", fontSize: "10pt", color: "#0f172a", fontWeight: "bold" }, children: ((pTotal?.cp_berjalan ?? 0) + (pTotal?.cp_tunggakan ?? 0)).toLocaleString("id-ID") }),
                              (0, a.jsx)("td", { style: { border: "1px solid #94a3b8", padding: "5px 8px", textAlign: "center", fontSize: "10pt", color: "#0f172a", fontWeight: "bold" }, children: (pTotal?.pr ?? 0).toFixed(2) + "%" }),
                              (0, a.jsx)("td", { style: { border: "1px solid #94a3b8", padding: "5px 8px", textAlign: "right", fontSize: "10pt", color: "#15803d", fontWeight: "bold" }, children: ((pTotal?.cc_aktual ?? 0) + (pTotal?.cc_tunggakan ?? 0)).toLocaleString("id-ID") }),
                              (0, a.jsx)("td", { style: { border: "1px solid #94a3b8", padding: "5px 8px", textAlign: "center", fontSize: "10pt", color: "#0f172a", fontWeight: "bold" }, children: (pTotal?.cr ?? 0).toFixed(2) + "%" }),
                              (0, a.jsx)("td", { style: { border: "1px solid #94a3b8", padding: "5px 8px", textAlign: "center", fontSize: "10pt", color: "#0f172a", fontWeight: "bold" }, children: (pTotal?.indeks ?? 0).toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + (pTotal?.level ? " (LV " + pTotal.level + ")" : " (-)") })
                            ]
                          })
                        ]
                      })
                    ]
                  })
                })
              ]
            }),
            (0, a.jsxs)("div", {
              className: "kp-sheet-footer",
              style: {
                marginTop: "24px",
                paddingTop: "6px",
                borderTop: "1px dashed #cbd5e1",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "8.5pt",
                color: "#475569"
              },
              children: [
                (0, a.jsxs)("div", {
                  style: { display: "flex", alignItems: "center", flexWrap: "wrap" },
                  children: [
                    (0, a.jsx)("strong", { style: { color: "#0f172a" }, children: "Sumber Data: " }),
                    "CAS Bareskrim Polri",
                    (0, a.jsx)("span", { style: { margin: "0 6px", color: "#94a3b8" }, children: "•" }),
                    (0, a.jsx)("strong", { style: { color: "#0f172a" }, children: "Data per: " }),
                    pdfDataPer || "—",
                    (0, a.jsx)("span", { style: { margin: "0 6px", color: "#94a3b8" }, children: "•" }),
                    (0, a.jsx)("strong", { style: { color: "#0f172a" }, children: "Diambil: " }),
                    pdfWaktuCetak || "—"
                  ]
                }),
                (0, a.jsx)("div", {
                  style: { color: "#64748b", fontSize: "8.5pt", whiteSpace: "nowrap" },
                  children: "Halaman 1 dari N (otomatis saat dicetak)"
                })
              ]
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
let opStart = patched.indexOf('function generateCasHashFilename(');
if (opStart === -1) {
  opStart = patched.indexOf('const KP_INDO_MONTHS =');
}
if (opStart === -1) {
  opStart = patched.indexOf('function openPdfModal(){');
}
const opEnd = patched.indexOf('function kpPrintPdf(){', opStart);
patched = patched.slice(0, opStart) + newOpenPdf + patched.slice(opEnd);
console.log('Replaced openPdfModal & added getTableDataForPrint');

// 4. Replace State
const stStart = patched.indexOf('[exportMenuOpen,setExportMenuOpen]=(0,t.useState)(!1),');
const stEnd = patched.indexOf(stateSearchEnd, stStart) + stateSearchEnd.length;
patched = patched.slice(0, stStart) + newStateBlock + patched.slice(stEnd);
console.log('Replaced state block');

// 5. Replace XLSX and CSV download filenames with hash
if (patched.includes('n.download=`kinerja-perkara-${eAP.from}_${eAP.to}.xlsx`')) {
  patched = patched.replace(
    'n.download=`kinerja-perkara-${eAP.from}_${eAP.to}.xlsx`',
    'n.download=generateCasHashFilename("xlsx")'
  );
  console.log('Replaced XLSX download filename with hash');
}
if (patched.includes('n.download=`kinerja-perkara-${eAP.from}_${eAP.to}.csv`')) {
  patched = patched.replace(
    'n.download=`kinerja-perkara-${eAP.from}_${eAP.to}.csv`',
    'n.download=generateCasHashFilename("csv")'
  );
  console.log('Replaced CSV download filename with hash');
}

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
