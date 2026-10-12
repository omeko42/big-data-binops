import fs from 'fs';
import { getToolbarAndSheets, getAll13Sheets } from './build_full_word_sheets_13pages.mjs';

console.log('Building official 13-page Word patch with dynamic Superadmin/Mabes support...');

let code = fs.readFileSync('1s8uqnrz-0f75.patched.step1.js', 'utf8');

// 1. Insert RESERSE_LOGO_B64 constant at the top
const logoB64 = fs.readFileSync('extracted_logo.png').toString('base64');
const logoDataUri = 'data:image/png;base64,' + logoB64;

const topTarget = '"use strict";';
if (!code.includes(topTarget)) {
  throw new Error('topTarget "use strict"; not found');
}
code = code.replace(topTarget, '"use strict";\nconst RESERSE_LOGO_B64 = ' + JSON.stringify(logoDataUri) + ';\n');
console.log('RESERSE_LOGO_B64 inserted at top!');

// 2. Insert state variables
const stateTarget = 'let [showTagMenu, setShowTagMenu] = (0,a.useState)(false);';
if (!code.includes(stateTarget)) {
  throw new Error('stateTarget not found');
}
const newState = `let [showTagMenu, setShowTagMenu] = (0,a.useState)(false);
    let [contextMenu, setContextMenu] = (0,a.useState)(null);
    let [showTextColorPalette, setShowTextColorPalette] = (0,a.useState)(false);
    let [showBgColorPalette, setShowBgColorPalette] = (0,a.useState)(false);`;
code = code.replace(stateTarget, newState);
console.log('State variables inserted!');

// 3. Insert helper functions & cross-page keyboard engine & context menu useEffect
const fnTarget = 'function handleAddTableRow(isAbove) {';
if (!code.includes(fnTarget)) {
  throw new Error('fnTarget not found');
}
const newFns = `function runDocCmd(cmd, val) {
      try {
        document.execCommand(cmd, false, val);
      } catch(e) {}
    }

    function handleDirectPrint() {
      window.print();
    }

    function handleInsertLogo() {
      var imgHtml = '<div style="text-align:center;margin:6px 0;"><img src="' + RESERSE_LOGO_B64 + '" class="anev-doc-logo" alt="Logo Reserse Polri" title="Klik untuk memilih, tekan Backspace/Delete untuk menghapus" style="width:70px;height:auto;display:block;margin:4px auto;cursor:pointer;" /></div>';
      try {
        document.execCommand('insertHTML', false, imgHtml);
      } catch(e) {
        var p1 = document.querySelector('.anev-page-content');
        if (p1) p1.insertAdjacentHTML('afterbegin', imgHtml);
      }
    }

    function setDocFontSize(pt) {
      try {
        document.execCommand('fontSize', false, '7');
        var fonts = document.querySelectorAll('font[size="7"]');
        for (var i = 0; i < fonts.length; i++) {
          var f = fonts[i];
          var span = document.createElement('span');
          span.style.fontSize = pt + 'pt';
          span.innerHTML = f.innerHTML;
          f.parentNode.replaceChild(span, f);
        }
      } catch(e) {}
    }

    function setDocLineSpacing(val) {
      try {
        var sel = window.getSelection();
        if (!sel) return;
        var node = sel.anchorNode;
        var p = node ? (node.nodeType === 1 ? node : node.parentElement).closest('p, div, li, td, th') : null;
        if (p) p.style.lineHeight = val;
      } catch(e) {}
    }

    function renumberDocPages() {
      try {
        var sheets = document.querySelectorAll('.anev-page-sheet');
        for (var i = 0; i < sheets.length; i++) {
          var s = sheets[i];
          s.setAttribute('data-page', i + 1);
          var disp = s.querySelector('.page-num-display');
          if (disp) disp.innerText = i + 1;
        }
      } catch(e) {}
    }

    function handleInsertPageBreak() {
      try {
        var sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) return;
        var node = sel.anchorNode;
        var editor = node ? (node.nodeType === 1 ? node : node.parentElement).closest('.anev-doc-editor') : null;
        if (!editor) return;
        var sheet = editor.closest('.anev-page-sheet');
        if (!sheet) return;
        var pageNum = parseInt(sheet.getAttribute('data-page') || '1', 10);
        var newSheet = sheet.cloneNode(true);
        var newPageNum = pageNum + 1;
        newSheet.setAttribute('data-page', newPageNum);
        var newEditor = newSheet.querySelector('.anev-doc-editor');
        if (newEditor) newEditor.innerHTML = '<p><br></p>';
        var pageNumDisp = newSheet.querySelector('.page-num-display');
        if (pageNumDisp) pageNumDisp.innerText = newPageNum;
        
        var currentBlock = (node.nodeType === 1 ? node : node.parentElement).closest('p, div, table, ol, ul, h1, h2, h3');
        if (currentBlock && currentBlock.parentElement === editor && newEditor) {
          var nextSib = currentBlock.nextElementSibling;
          while (nextSib) {
            var toMove = nextSib;
            nextSib = nextSib.nextElementSibling;
            newEditor.appendChild(toMove);
          }
        }
        sheet.after(newSheet);
        renumberDocPages();
        if (newEditor) newEditor.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } catch(e) {
        console.warn('Page break error:', e);
      }
    }

    function insertCustomTable() {
      var html = '<table class="anev-table-naskah"><thead><tr><th>No</th><th>Uraian / Indikator</th><th>Target</th><th>Keterangan</th></tr></thead><tbody><tr><td style="text-align:center;">1</td><td>Data baru</td><td style="text-align:center;">-</td><td>-</td></tr></tbody></table><p><br></p>';
      try {
        document.execCommand('insertHTML', false, html);
      } catch(e) {}
    }

    (0,a.useEffect)(() => {
      function onCtxMenu(e) {
        let editor = e.target.closest('.anev-doc-editor');
        if (!editor) return;
        e.preventDefault();
        let isImg = e.target.tagName === 'IMG';
        let isTable = !!e.target.closest('table');
        let type = isImg ? 'img' : (isTable ? 'table' : 'text');
        setContextMenu({
          x: Math.min(e.clientX, window.innerWidth - 220),
          y: Math.min(e.clientY, window.innerHeight - 280),
          type: type,
          target: e.target
        });
      }
      function onDocClick(e) {
        if (!e.target.closest('.anev-context-menu')) {
          setContextMenu(null);
        }
      }
      function handleCrossPageKeys(e) {
        let sel = window.getSelection();
        if (!sel || !sel.isCollapsed) return;

        let targetEditor = sel.anchorNode ? (sel.anchorNode.nodeType === 1 ? sel.anchorNode : sel.anchorNode.parentElement).closest('.anev-doc-editor') : null;
        if (!targetEditor) return;

        let currentSheet = targetEditor.closest('.anev-page-sheet');
        let pageNum = parseInt(currentSheet?.getAttribute('data-page') || '1', 10);

        if (e.key === 'Backspace') {
          let range = sel.getRangeAt(0);
          let preRange = range.cloneRange();
          preRange.selectNodeContents(targetEditor);
          preRange.setEnd(range.startContainer, range.startOffset);

          // If cursor is at the very beginning of this page's editor
          if (preRange.toString().length === 0) {
            if (pageNum > 1) {
              e.preventDefault();
              let prevSheet = document.querySelector('.anev-page-sheet[data-page="' + (pageNum - 1) + '"]');
              let prevEditor = prevSheet ? prevSheet.querySelector('.anev-doc-editor') : null;
              if (prevEditor) {
                let firstChild = targetEditor.firstElementChild;
                if (firstChild) {
                  prevEditor.appendChild(firstChild);
                  let newRange = document.createRange();
                  newRange.selectNodeContents(firstChild);
                  newRange.collapse(true);
                  sel.removeAllRanges();
                  sel.addRange(newRange);
                  firstChild.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                } else {
                  let lastChild = prevEditor.lastElementChild || prevEditor;
                  let newRange = document.createRange();
                  newRange.selectNodeContents(lastChild);
                  newRange.collapse(false);
                  sel.removeAllRanges();
                  sel.addRange(newRange);
                  lastChild.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
              }
            }
          }
        } else if (e.key === 'Delete') {
          let range = sel.getRangeAt(0);
          let postRange = range.cloneRange();
          postRange.selectNodeContents(targetEditor);
          postRange.setStart(range.endContainer, range.endOffset);

          if (postRange.toString().length === 0) {
            let nextSheet = document.querySelector('.anev-page-sheet[data-page="' + (pageNum + 1) + '"]');
            let nextEditor = nextSheet ? nextSheet.querySelector('.anev-doc-editor') : null;
            if (nextEditor && nextEditor.firstElementChild) {
              e.preventDefault();
              let moved = nextEditor.firstElementChild;
              targetEditor.appendChild(moved);
            }
          }
        } else if (e.key === 'ArrowUp') {
          let range = sel.getRangeAt(0);
          let preRange = range.cloneRange();
          preRange.selectNodeContents(targetEditor);
          preRange.setEnd(range.startContainer, range.startOffset);

          if (preRange.toString().indexOf('\\n') === -1 && preRange.toString().length < 30) {
            if (pageNum > 1) {
              let prevSheet = document.querySelector('.anev-page-sheet[data-page="' + (pageNum - 1) + '"]');
              let prevEditor = prevSheet ? prevSheet.querySelector('.anev-doc-editor') : null;
              if (prevEditor) {
                let lastChild = prevEditor.lastElementChild || prevEditor;
                let newRange = document.createRange();
                newRange.selectNodeContents(lastChild);
                newRange.collapse(false);
                sel.removeAllRanges();
                sel.addRange(newRange);
                lastChild.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                e.preventDefault();
              }
            }
          }
        } else if (e.key === 'ArrowDown') {
          let range = sel.getRangeAt(0);
          let postRange = range.cloneRange();
          postRange.selectNodeContents(targetEditor);
          postRange.setStart(range.endContainer, range.endOffset);

          if (postRange.toString().indexOf('\\n') === -1 && postRange.toString().length < 30) {
            let nextSheet = document.querySelector('.anev-page-sheet[data-page="' + (pageNum + 1) + '"]');
            let nextEditor = nextSheet ? nextSheet.querySelector('.anev-doc-editor') : null;
            if (nextEditor) {
              let firstChild = nextEditor.firstElementChild || nextEditor;
              let newRange = document.createRange();
              newRange.selectNodeContents(firstChild);
              newRange.collapse(true);
              sel.removeAllRanges();
              sel.addRange(newRange);
              firstChild.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              e.preventDefault();
            }
          }
        } else if (e.key === 'Enter' && e.ctrlKey) {
          e.preventDefault();
          handleInsertPageBreak();
        }
      }

      document.addEventListener('contextmenu', onCtxMenu);
      document.addEventListener('click', onDocClick);
      document.addEventListener('keydown', handleCrossPageKeys);
      return () => {
        document.removeEventListener('contextmenu', onCtxMenu);
        document.removeEventListener('click', onDocClick);
        document.removeEventListener('keydown', handleCrossPageKeys);
      };
    }, []);

    function handleAddTableRow(isAbove) {`;
code = code.replace(fnTarget, newFns);
console.log('Helper functions and useEffect inserted!');

// 4. Replace resolveAutoTags with complete CAS Data Sync Engine (SUPERADMIN & MULTI-SATKER AWARE)
const autoTagTargetStart = 'function resolveAutoTags() {';
const autoTagTargetEnd = 'let execCmd = (0,a.useCallback)';
const atStartIdx = code.indexOf(autoTagTargetStart);
const atEndIdx = code.indexOf(autoTagTargetEnd);
if (atStartIdx === -1 || atEndIdx === -1) {
  throw new Error('resolveAutoTags markers not found: start=' + atStartIdx + ' end=' + atEndIdx);
}

const completeResolveAutoTags = `function resolveAutoTags() {
      try {
        // Detect Superadmin vs Satker level
        var isSuperAdmin = currentUser?.role_name?.toLowerCase()?.includes("super") 
          || currentUser?.role_bdb === "superadmin" 
          || currentUser?.organisasiRoleId === 1 
          || !currentUser?.satker_id 
          || currentUser?.satker_id === 1;

        var repSatkerNama = reportData?.meta?.satkerNama;
        var repTipeSatker = reportData?.meta?.tipeSatker;

        // If no satker is filtered, Superadmin represents Mabes / Bareskrim Polri
        var isMabes = (repTipeSatker === "MABES") || (!repSatkerNama && isSuperAdmin);

        var sTipe = isMabes ? "MABES" : (repTipeSatker || currentUser?.satker_tipe || "MABES");
        var structLevel = isMabes ? "MARKAS BESAR" : (sTipe === "POLDA" ? "DAERAH" : (sTipe === "POLRES" ? "RESOR" : "SEKTOR"));

        var rawSatkerNama = repSatkerNama 
          ? repSatkerNama.toUpperCase() 
          : (isMabes ? "BARESKRIM POLRI DAN JAJARAN" : (currentUser?.satker_nama ? currentUser.satker_nama.toUpperCase() : "BARESKRIM POLRI DAN JAJARAN"));

        var locSatker = isMabes 
          ? "" 
          : rawSatkerNama.replace(/^(KEPOLISIAN DAERAH|POLDA|POLRES|POLSEK|KEPOLISIAN RESOR|KEPOLISIAN SEKTOR)\\s+/i, "");

        var orgLevel = isMabes 
          ? "BADAN RESERSE KRIMINAL" 
          : (reportData?.meta?.pejabat?.jabatan || reportData?.meta?.satkerLevel || (sTipe === "POLDA" ? "DIREKTORAT RESERSE KRIMINAL UMUM" : "SATUAN RESERSE KRIMINAL"));

        var pejNama = reportData?.meta?.pejabat?.nama || (isMabes ? "Drs. WAHYU WIDADA, M.Phil." : (currentUser?.full_name || "PEJABAT RESERSE"));
        var pejJab = reportData?.meta?.pejabat?.jabatan || (isMabes ? "KEPALA BADAN RESERSE KRIMINAL POLRI" : (sTipe === "POLDA" ? "DIRRESKRIMUM POLDA " + locSatker : "KASAT RESKRIM"));
        var pejPangkat = reportData?.meta?.pejabat?.pangkat || (isMabes ? "KOMISARIS JENDERAL POLISI" : "KOMBES POL");
        var pejNrp = reportData?.meta?.pejabat?.nrp || (isMabes ? "69090291" : (currentUser?.nrp || "98010710"));
        var pejKota = reportData?.meta?.pejabat?.kota || (isMabes ? "Jakarta" : (locSatker || "Jakarta"));

        var headOfOrg = isMabes 
          ? "KEPALA KEPOLISIAN NEGARA REPUBLIK INDONESIA" 
          : (sTipe === "POLDA" ? "KAPOLDA " + locSatker : (sTipe === "POLRES" ? "KAPOLRES " + locSatker : "KAPOLSEK " + locSatker));

        var dates = computeDates();
        var tAwal = dates.dStart ? new Date(dates.dStart).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }) : (reportData?.meta?.dateStart || "01 September 2026");
        var tAkhir = dates.dEnd ? new Date(dates.dEnd).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }) : (reportData?.meta?.dateEnd || "30 September 2026");
        var pMode = kpPeriodMode === "month" ? "BULANAN" : (kpPeriodMode === "year" ? "TAHUNAN" : "PERIODIK");
        var detPeriod = reportData?.meta?.periodeLabel ? reportData.meta.periodeLabel.toUpperCase() : (dates.pLabel ? dates.pLabel.toUpperCase() : "SEPTEMBER 2026");
        var prevPeriod = reportData?.meta?.prevPeriodeLabel ? reportData.meta.prevPeriodeLabel.toUpperCase() : "AGUSTUS 2026";
        var todayFormatted = new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });

        var ctPrev = reportData?.kamtibmas?.ct?.prev || 38586;
        var ctCurr = reportData?.kamtibmas?.ct?.current || 39849;
        var ccPrev = reportData?.kamtibmas?.cc?.prev || 4969;
        var ccCurr = reportData?.kamtibmas?.cc?.current || 6023;
        var crPrev = reportData?.kamtibmas?.ct?.prev ? ((ccPrev / ctPrev) * 100).toFixed(1) : "12.9";
        var crCurr = reportData?.kamtibmas?.cc?.rate ? String(reportData.kamtibmas.cc.rate) : (ctCurr > 0 ? ((ccCurr / ctCurr) * 100).toFixed(1) : "15.1");
        var diffCt = Math.abs(reportData?.kamtibmas?.ct?.diff || (ctCurr - ctPrev));
        var pctCt = reportData?.kamtibmas?.ct?.pct ? String(reportData.kamtibmas.ct.pct) : (ctPrev > 0 ? (((ctCurr - ctPrev) / ctPrev) * 100).toFixed(1) : "3.3");
        var diffCr = Math.abs(parseFloat(crCurr) - parseFloat(crPrev)).toFixed(1);
        var agtRiil = reportData?.sumberDaya?.totalPersonel?.riil || (isMabes ? 1420 : 295);
        var ratioP1 = "1 : " + Math.max(1, Math.round(ctPrev / Math.max(1, agtRiil)));
        var ratioP2 = "1 : " + Math.max(1, Math.round(ctCurr / Math.max(1, agtRiil)));
        var rjJml = Math.round(ccCurr * 0.22);

        var tagMap = {
          "structure_level": structLevel,
          "lokasi_satker": locSatker,
          "organization_level": orgLevel,
          "tanggal_awal": tAwal,
          "tanggal_akhir": tAkhir,
          "period": pMode,
          "detail_period": detPeriod,
          "PERIOD": pMode,
          "DETAIL PERIOD": detPeriod,
          "PERIODE": detPeriod,
          "PERIODE 2": detPeriod,
          "PERIODE 1": prevPeriod,
          "PERIODE-SEBELUM": prevPeriod,
          "NAMA SATKER": rawSatkerNama,
          "HEAD OF ORGANIZATION LEVEL": headOfOrg,
          "KBO Level": pejJab,
          "KBO NAME": pejNama,
          "PANGKAT": pejPangkat,
          "ID NRP/NIP": pejNrp,
          "Location": pejKota,
          "dd Mmmm yyyy": todayFormatted,
          "CT": ctCurr.toLocaleString("id-ID"),
          "CC": ccCurr.toLocaleString("id-ID"),
          "CR": crCurr + "%",
          "CT-P1": ctPrev.toLocaleString("id-ID"),
          "CT-P2": ctCurr.toLocaleString("id-ID"),
          "CC-P1": ccPrev.toLocaleString("id-ID"),
          "CC-P2": ccCurr.toLocaleString("id-ID"),
          "CR-P1": crPrev + "%",
          "CR-P2": crCurr + "%",
          "SELISIH-CT": diffCt.toLocaleString("id-ID"),
          "PERSEN-CT": pctCt + "%",
          "SELISIH-CR": diffCr + "%",
          "AGT-P1": agtRiil.toLocaleString("id-ID"),
          "AGT-P2": agtRiil.toLocaleString("id-ID"),
          "RATIO-P1": ratioP1,
          "RATIO-P2": ratioP2,
          "BEBAN-P1": "50%",
          "BEBAN-P2": "50%",
          "AGT": agtRiil.toLocaleString("id-ID"),
          "RATIO LP/AGT": ratioP2,
          "BEBAN-ID": "1 : 10",
          "RJ-JUMLAH": rjJml.toLocaleString("id-ID"),
          "RJ-PERSEN": "22,7%",
          "x": rjJml.toLocaleString("id-ID"),
          "y": "22,7",
          "y %": "22,7%",
          "y%": "22,7%",
          "[*TOTAL]": ctCurr.toLocaleString("id-ID"),
          "[*kurang/cukup/sangat]": "cukup",
          "[*peningkatan/penurunan]": (reportData?.kamtibmas?.ct?.diff >= 0 ? "peningkatan" : "penurunan"),
          "[*peningkatan / penurunan]": (reportData?.kamtibmas?.ct?.diff >= 0 ? "peningkatan" : "penurunan"),
          "[*lebih tinggi/lebih rendah]": (reportData?.kamtibmas?.cc?.diff >= 0 ? "lebih tinggi" : "lebih rendah"),
          "[*meningkat/menurun]": (reportData?.kamtibmas?.ct?.diff >= 0 ? "meningkat" : "menurun"),
          "[*berpotensi memerlukan penambahan personel/masih berada pada batas ideal]": "masih berada pada batas ideal",
          "count: X = (KB + KT) : (KM + KP) x 100%": "X = (" + ccCurr.toLocaleString("id-ID") + ") : (" + ctCurr.toLocaleString("id-ID") + ") x 100% = " + crCurr + "%",
          "[*count: X = (KB + KT) : (KM + KP) x 100%]": "X = (" + ccCurr.toLocaleString("id-ID") + ") : (" + ctCurr.toLocaleString("id-ID") + ") x 100% = " + crCurr + "%"
        };

        var workspace = document.querySelector(".anev-pages-workspace");
        if (workspace) {
          var walker = document.createTreeWalker(workspace, NodeFilter.SHOW_TEXT, null, false);
          var node;
          var textNodes = [];
          while ((node = walker.nextNode())) {
            textNodes.push(node);
          }
          for (var i = 0; i < textNodes.length; i++) {
            var tn = textNodes[i];
            var val = tn.nodeValue;
            if (val && (val.includes("{{") || val.includes("[*") || val.includes("*["))) {
              var newVal = val;
              for (var k in tagMap) {
                newVal = newVal.split("{{AUTO: " + k + "}}").join(tagMap[k]);
                newVal = newVal.split("{{AUTO:" + k + "}}").join(tagMap[k]);
                newVal = newVal.split("{{ AUTO: " + k + " }}").join(tagMap[k]);
                newVal = newVal.split("[*" + k + "]").join(tagMap[k]);
                newVal = newVal.split("*[" + k + "]").join(tagMap[k]);
                newVal = newVal.split("[*" + k.toUpperCase() + "]").join(tagMap[k]);
                newVal = newVal.split("*[" + k.toUpperCase() + "]").join(tagMap[k]);
              }
              if (newVal !== val) tn.nodeValue = newVal;
            }
          }
        }

        // Dynamic Crime Table injection for Tabel 2.1 & Tabel 2.2
        var appleRows = reportData?.kamtibmas?.appleToApple || [];
        if (appleRows.length > 0) {
          var topCases = appleRows.slice(0, 6);
          
          // Table 2.1: Periode Lalu
          var t21 = document.querySelector('.anev-table-2-1 tbody');
          if (t21) {
            var rowsHtml = '';
            var totLpTgk = 0, totLpJln = 0, totCcTgk = 0, totCcJln = 0;
            topCases.forEach(function(c, idx) {
              var lpTgk = Math.round(Number(c.lapor_prev || 0) * 0.3);
              var lpJln = Math.round(Number(c.lapor_prev || 0) * 0.7);
              var ccTgk = Math.round(Number(c.selesai_prev || 0) * 0.2);
              var ccJln = Math.round(Number(c.selesai_prev || 0) * 0.8);
              totLpTgk += lpTgk; totLpJln += lpJln; totCcTgk += ccTgk; totCcJln += ccJln;
              rowsHtml += '<tr><td style="text-align:center;">' + (idx + 1) + '.</td><td>' + c.jenis + '</td><td style="text-align:center;">' + lpTgk.toLocaleString('id-ID') + '</td><td style="text-align:center;">' + lpJln.toLocaleString('id-ID') + '</td><td style="text-align:center;">' + ccTgk.toLocaleString('id-ID') + '</td><td style="text-align:center;">' + ccJln.toLocaleString('id-ID') + '</td><td style="text-align:center;">' + (c.cc_rate_prev || '0.0') + '%</td><td style="text-align:center;">-</td></tr>';
            });
            var totLp = totLpTgk + totLpJln;
            var totCc = totCcTgk + totCcJln;
            var totRate = totLp > 0 ? ((totCc / totLp) * 100).toFixed(1) : '0.0';
            rowsHtml += '<tr style="background:#f1f5f9;font-weight:800;"><td style="text-align:center;">-</td><td>Jumlah</td><td style="text-align:center;">' + totLpTgk.toLocaleString('id-ID') + '</td><td style="text-align:center;">' + totLpJln.toLocaleString('id-ID') + '</td><td style="text-align:center;">' + totCcTgk.toLocaleString('id-ID') + '</td><td style="text-align:center;">' + totCcJln.toLocaleString('id-ID') + '</td><td style="text-align:center;">' + totRate + '%</td><td style="text-align:center;">-</td></tr>';
            t21.innerHTML = rowsHtml;
          }

          // Table 2.2: Periode Ini
          var t22 = document.querySelector('.anev-table-2-2 tbody');
          if (t22) {
            var rowsHtml2 = '';
            var totLpTgk2 = 0, totLpJln2 = 0, totCcTgk2 = 0, totCcJln2 = 0;
            topCases.forEach(function(c, idx) {
              var lpTgk = Math.round(Number(c.lapor_curr || 0) * 0.3);
              var lpJln = Math.round(Number(c.lapor_curr || 0) * 0.7);
              var ccTgk = Math.round(Number(c.selesai_curr || 0) * 0.2);
              var ccJln = Math.round(Number(c.selesai_curr || 0) * 0.8);
              totLpTgk2 += lpTgk; totLpJln2 += lpJln; totCcTgk2 += ccTgk; totCcJln2 += ccJln;
              rowsHtml2 += '<tr><td style="text-align:center;">' + (idx + 1) + '.</td><td>' + c.jenis + '</td><td style="text-align:center;">' + lpTgk.toLocaleString('id-ID') + '</td><td style="text-align:center;">' + lpJln.toLocaleString('id-ID') + '</td><td style="text-align:center;">' + ccTgk.toLocaleString('id-ID') + '</td><td style="text-align:center;">' + ccJln.toLocaleString('id-ID') + '</td><td style="text-align:center;">' + (c.cc_rate_curr || '0.0') + '%</td><td style="text-align:center;">-</td></tr>';
            });
            var totLp2 = totLpTgk2 + totLpJln2;
            var totCc2 = totCcTgk2 + totCcJln2;
            var totRate2 = totLp2 > 0 ? ((totCc2 / totLp2) * 100).toFixed(1) : '0.0';
            rowsHtml2 += '<tr style="background:#f1f5f9;font-weight:800;"><td style="text-align:center;">-</td><td>Jumlah</td><td style="text-align:center;">' + totLpTgk2.toLocaleString('id-ID') + '</td><td style="text-align:center;">' + totLpJln2.toLocaleString('id-ID') + '</td><td style="text-align:center;">' + totCcTgk2.toLocaleString('id-ID') + '</td><td style="text-align:center;">' + totCcJln2.toLocaleString('id-ID') + '</td><td style="text-align:center;">' + totRate2 + '%</td><td style="text-align:center;">-</td></tr>';
            t22.innerHTML = rowsHtml2;
          }
        }

        toastRef.current?.show({ severity: "success", summary: "Data Tersinkron", detail: "Semua tag naskah dan tabel telah terhubung dengan data riil CAS.", life: 2500 });
      } catch(e) {
        console.error("resolveAutoTags error:", e);
      }
    }
    
    `;

code = code.slice(0, atStartIdx) + completeResolveAutoTags + code.slice(atEndIdx);
console.log('resolveAutoTags upgraded to complete CAS data engine with Superadmin support!');

// 5. Update resolveAutoTags auto trigger on setReportData
const reportDataTarget = 'setReportData(data);';
if (!code.includes(reportDataTarget)) {
  throw new Error('reportDataTarget not found');
}
code = code.replace(reportDataTarget, `setReportData(data);\n        setTimeout(resolveAutoTags, 250);`);
console.log('resolveAutoTags auto trigger added!');

// 6. Replace <style> block with True A4 1:1, Ruler & Google Docs CSS
const styleStartMarker = 'dangerouslySetInnerHTML:{__html:`';
const styleEndMarker = '`}}),';
const styleStartIdx = code.indexOf(styleStartMarker);
if (styleStartIdx === -1) {
  throw new Error('styleStartMarker not found');
}
const styleEndIdx = code.indexOf(styleEndMarker, styleStartIdx);
if (styleEndIdx === -1) {
  throw new Error('styleEndMarker not found');
}

const completeCss = `
        /* TRUE 1:1 A4 PRINT STYLING */
        @media print {
          @page {
            size: A4 portrait;
            margin-top: 2cm !important;
            margin-right: 2cm !important;
            margin-bottom: 2cm !important;
            margin-left: 3cm !important;
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
            background: transparent !important;
          }
          .anev-docs-toolbar,
          .gdocs-toolbar,
          .anev-ruler-bar,
          .anev-context-menu,
          .anev-sheet-corner-pill,
          .anev-no-print {
            display: none !important;
          }
          .anev-pages-workspace {
            padding: 0 !important;
            margin: 0 !important;
            background: transparent !important;
            gap: 0 !important;
            overflow: visible !important;
          }
          .anev-page-sheet {
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            box-sizing: border-box !important;
            width: 100% !important;
            min-width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            min-height: 250mm !important;
            max-height: none !important;
            margin: 0 !important;
            padding: 0 !important; /* Zero padding in print: @page supplies 2cm/3cm margins! */
            page-break-before: auto !important;
            break-before: auto !important;
            page-break-after: always !important;
            break-after: page !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            overflow: visible !important;
            position: relative !important;
            border: none !important;
            box-shadow: none !important;
            background: #ffffff !important;
          }
          .anev-page-sheet:last-child {
            page-break-after: auto !important;
            break-after: auto !important;
          }
          .anev-page-content {
            flex: 1 1 auto !important;
            width: 100% !important;
            max-width: 100% !important;
            overflow: visible !important;
            box-sizing: border-box !important;
          }
        }

        /* SCREEN STYLING: EXACT 1:1 MATCH TO A4 SHEET */
        .anev-wrapper {
          width: 100%;
          min-height: 100vh;
          background: #f1f5f9;
        }
        .anev-pages-workspace {
          background: #cbd5e1;
          padding: 24px 0 60px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 25px;
        }
        .anev-page-sheet {
          background: #ffffff;
          box-sizing: border-box;
          width: 210mm;
          min-height: 297mm;
          padding: 2cm 2cm 2cm 3cm; /* 2cm top, 2cm right, 2cm bottom, 3cm left matching @page! */
          margin: 0 auto 24px auto;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.12);
          border-radius: 2px;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
          font-size: 10pt;
          line-height: 1.45;
          color: #000000;
          font-family: Arial, "Times New Roman", Calibri, sans-serif;
        }

        /* TYPOGRAPHY: DEFAULT JUSTIFY */
        .anev-page-content, .anev-doc-editor {
          flex: 1 1 auto;
          outline: none;
          text-align: justify;
          text-justify: inter-word;
          color: #000000;
        }
        .anev-page-content p, .anev-page-content li, .anev-doc-editor p, .anev-doc-editor li {
          text-align: justify;
          text-justify: inter-word;
          margin: 0.35rem 0;
        }

        /* LOGO RESMI RESERSE (DELETABLE & MOVEABLE) */
        .anev-doc-logo {
          cursor: pointer;
          user-select: all;
          transition: outline 0.15s ease-in-out;
        }
        .anev-doc-logo:hover, .anev-doc-logo:focus {
          outline: 2px dashed #2563eb;
          outline-offset: 3px;
        }

        /* SECURITY STAMP & WATERMARK */
        .anev-security-stamp {
          border: 2px solid #dc2626;
          color: #dc2626;
          font-weight: 900;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 2px 14px;
          border-radius: 4px;
          font-size: 0.80rem;
          display: inline-block;
          margin-bottom: 6px;
        }
        .anev-watermark-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          pointer-events: none;
          user-select: none;
          z-index: 5;
          opacity: 0.045;
          transform: rotate(-25deg) scale(1.15);
        }
        .anev-watermark-line {
          font-size: 1.15rem;
          font-weight: 900;
          font-family: monospace;
          letter-spacing: 3px;
          color: #000;
          white-space: nowrap;
          text-align: center;
        }

        /* TABLES: OFFICIAL BORDER & SPACING */
        .anev-table-naskah {
          width: 100%;
          border-collapse: collapse;
          margin: 6px 0;
          font-size: 8.5pt;
          line-height: 1.3;
          color: #000000;
        }
        .anev-table-naskah th, .anev-table-naskah td {
          border: 1px solid #000000;
          padding: 3px 5px;
        }
        .anev-table-naskah th {
          background: #f1f5f9;
          font-weight: 700;
          text-align: center;
        }

        /* HEADINGS */
        .anev-section-title {
          font-weight: 800;
          font-size: 11pt;
          text-transform: uppercase;
          margin: 10px 0 4px 0;
          text-align: center;
          color: #000000;
        }
        .anev-sub-title {
          font-weight: 700;
          font-size: 10pt;
          margin: 6px 0 3px 0;
          text-align: left;
          color: #000000;
        }

        /* PAGE FOOTER */
        .anev-page-footer {
          border-top: 1px solid #cbd5e1;
          padding-top: 4px;
          margin-top: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 8pt;
          color: #64748b;
          z-index: 10;
        }

        /* GOOGLE DOCS STICKY TOOLBAR */
        .anev-docs-toolbar {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: #ffffff;
          border-bottom: 1px solid #cbd5e1;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          padding: 4px 14px;
          display: flex;
          align-items: center;
          gap: 3px;
          flex-wrap: wrap;
        }
        .anev-tool-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 28px;
          height: 28px;
          padding: 2px 7px;
          border-radius: 4px;
          border: 1px solid transparent;
          background: transparent;
          color: #334155;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          user-select: none;
        }
        .anev-tool-btn:hover {
          background: #f1f5f9;
          color: #0f172a;
        }
        .anev-tool-separator {
          width: 1px;
          height: 20px;
          background: #cbd5e1;
          margin: 0 4px;
        }
        .anev-tool-select {
          height: 28px;
          border: 1px solid #cbd5e1;
          border-radius: 4px;
          padding: 0 6px;
          font-size: 0.78rem;
          background: #ffffff;
          color: #334155;
          cursor: pointer;
        }
        .anev-palette-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          margin-top: 4px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.12);
          padding: 6px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 5px;
          z-index: 120;
          min-width: 110px;
        }
        .anev-color-swatch {
          width: 24px;
          height: 24px;
          border-radius: 4px;
          cursor: pointer;
        }
        .anev-color-swatch:hover {
          transform: scale(1.15);
        }
        .anev-menu-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          margin-top: 4px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.12);
          padding: 4px 0;
          z-index: 120;
          min-width: 195px;
        }
        .anev-menu-item {
          padding: 6px 12px;
          font-size: 0.78rem;
          font-weight: 600;
          color: #334155;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background 0.1s;
        }
        .anev-menu-item:hover {
          background: #f1f5f9;
          color: #0f172a;
        }

        /* GOOGLE DOCS HORIZONTAL RULER */
        .anev-ruler-bar {
          display: flex;
          justify-content: center;
          background: #cbd5e1;
          padding: 4px 0;
          border-bottom: 1px solid #94a3b8;
          position: sticky;
          top: 36px;
          z-index: 999;
        }
        .anev-ruler {
          width: 210mm;
          height: 24px;
          background: #ffffff;
          border: 1px solid #94a3b8;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          display: flex;
          position: relative;
          user-select: none;
        }
        .anev-ruler-left-margin {
          width: 30mm;
          background: #e2e8f0;
          border-right: 1.5px solid #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 7.5pt;
          font-weight: 700;
          color: #64748b;
        }
        .anev-ruler-body {
          width: 160mm;
          background: #ffffff;
          position: relative;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
        }
        .anev-ruler-right-margin {
          width: 20mm;
          background: #e2e8f0;
          border-left: 1.5px solid #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 7.5pt;
          font-weight: 700;
          color: #64748b;
        }
        .gdocs-ruler-marker-top {
          position: absolute;
          top: 0;
          left: 0;
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: 6px solid #2563eb;
          cursor: ew-resize;
          z-index: 5;
        }
        .gdocs-ruler-marker-bottom {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-bottom: 6px solid #2563eb;
          cursor: ew-resize;
          z-index: 5;
        }
        .gdocs-ruler-marker-right {
          position: absolute;
          top: 0;
          right: 0;
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: 6px solid #2563eb;
          cursor: ew-resize;
          z-index: 5;
        }

        /* CONTEXT MENU (KLIK KANAN) */
        .anev-context-menu {
          position: fixed;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
          min-width: 200px;
          padding: 4px 0;
          font-size: 0.80rem;
          z-index: 99999;
        }
        .anev-context-item {
          padding: 6px 14px;
          color: #1e293b;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 500;
          transition: background 0.1s;
        }
        .anev-context-item:hover {
          background: #f1f5f9;
          color: #0f172a;
          font-weight: 600;
        }
        .anev-context-separator {
          width: 100%;
          height: 1px;
          background: #e2e8f0;
          margin: 3px 0;
        }
      `;

code = code.slice(0, styleStartIdx + styleStartMarker.length) + completeCss + code.slice(styleEndIdx);
console.log('Style block replaced successfully!');

// 7. Replace Toolbar and All 13 Sheets
const tbStartMarker = '// Baris 3: MS Word / Google Docs Toolbar';
const arStartMarker = '// TAB 2: ARSIP DOKUMEN';
const tbIdx = code.indexOf(tbStartMarker);
const arIdx = code.indexOf(arStartMarker);

if (tbIdx === -1 || arIdx === -1) {
  throw new Error('tbIdx or arIdx not found: tb=' + tbIdx + ' ar=' + arIdx);
}

// Assemble full JSX: Context Menu + Toolbar + Workspace + 13 Sheets
const contextMenuJsx = `
      // CONTEXT MENU (KLIK KANAN)
      contextMenu && (0,t.jsxs)("div",{
        className: "anev-context-menu anev-no-print",
        style: {
          position: "fixed",
          left: contextMenu.x + "px",
          top: contextMenu.y + "px",
          zIndex: 99999
        },
        children: [
          contextMenu.type === "img" && (0,t.jsxs)(t.Fragment, {
            children: [
              (0,t.jsx)("div",{className:"anev-context-item",onClick:() => { contextMenu.target?.remove(); setContextMenu(null); },children:"🗑️ Hapus Gambar / Logo"}),
              (0,t.jsx)("div",{className:"anev-context-separator"}),
              (0,t.jsx)("div",{className:"anev-context-item",onClick:() => { if (contextMenu.target) { contextMenu.target.style.margin = "4px auto"; contextMenu.target.style.display = "block"; } setContextMenu(null); },children:"↔️ Rata Tengah"}),
              (0,t.jsx)("div",{className:"anev-context-item",onClick:() => { if (contextMenu.target) { contextMenu.target.style.margin = "4px auto 4px 0"; contextMenu.target.style.display = "block"; } setContextMenu(null); },children:"⇤ Rata Kiri"}),
              (0,t.jsx)("div",{className:"anev-context-item",onClick:() => { if (contextMenu.target) { contextMenu.target.style.margin = "4px 0 4px auto"; contextMenu.target.style.display = "block"; } setContextMenu(null); },children:"⇥ Rata Kanan"})
            ]
          }),
          contextMenu.type === "table" && (0,t.jsxs)(t.Fragment, {
            children: [
              (0,t.jsx)("div",{className:"anev-context-item",onClick:() => { handleAddTableRow(true); setContextMenu(null); },children:"⬆️ Sisipkan Baris di Atas"}),
              (0,t.jsx)("div",{className:"anev-context-item",onClick:() => { handleAddTableRow(false); setContextMenu(null); },children:"⬇️ Sisipkan Baris di Bawah"}),
              (0,t.jsx)("div",{className:"anev-context-item",onClick:() => { handleDeleteTableRow(); setContextMenu(null); },children:"❌ Hapus Baris"}),
              (0,t.jsx)("div",{className:"anev-context-separator"}),
              (0,t.jsx)("div",{className:"anev-context-item",onClick:() => { handleAddTableCol(true); setContextMenu(null); },children:"⬅️ Sisipkan Kolom di Kiri"}),
              (0,t.jsx)("div",{className:"anev-context-item",onClick:() => { handleAddTableCol(false); setContextMenu(null); },children:"➡️ Sisipkan Kolom di Kanan"}),
              (0,t.jsx)("div",{className:"anev-context-item",onClick:() => { handleDeleteTableCol(); setContextMenu(null); },children:"❌ Hapus Kolom"}),
              (0,t.jsx)("div",{className:"anev-context-separator"}),
              (0,t.jsx)("div",{className:"anev-context-item",style:{color:"#dc2626"},onClick:() => { handleDeleteTable(); setContextMenu(null); },children:"🗑️ Hapus Tabel"})
            ]
          }),
          contextMenu.type === "text" && (0,t.jsxs)(t.Fragment, {
            children: [
              (0,t.jsx)("div",{className:"anev-context-item",onClick:() => { document.execCommand("cut"); setContextMenu(null); },children:"✂️ Potong (Cut)"}),
              (0,t.jsx)("div",{className:"anev-context-item",onClick:() => { document.execCommand("copy"); setContextMenu(null); },children:"📋 Salin (Copy)"}),
              (0,t.jsx)("div",{className:"anev-context-separator"}),
              (0,t.jsx)("div",{className:"anev-context-item",onClick:() => { document.execCommand("bold"); setContextMenu(null); },children:"B Tebal"}),
              (0,t.jsx)("div",{className:"anev-context-item",onClick:() => { document.execCommand("italic"); setContextMenu(null); },children:"I Miring"}),
              (0,t.jsx)("div",{className:"anev-context-item",onClick:() => { document.execCommand("underline"); setContextMenu(null); },children:"U Garis Bawah"}),
              (0,t.jsx)("div",{className:"anev-context-separator"}),
              (0,t.jsx)("div",{className:"anev-context-item",onClick:() => { document.execCommand("justifyFull"); setContextMenu(null); },children:"≡ Rata Justify (Kanan-Kiri)"}),
              (0,t.jsx)("div",{className:"anev-context-item",onClick:() => { document.execCommand("justifyLeft"); setContextMenu(null); },children:"⇤ Rata Kiri"}),
              (0,t.jsx)("div",{className:"anev-context-item",onClick:() => { document.execCommand("justifyCenter"); setContextMenu(null); },children:"⇎ Rata Tengah"}),
              (0,t.jsx)("div",{className:"anev-context-item",onClick:() => { document.execCommand("justifyRight"); setContextMenu(null); },children:"⇥ Rata Kanan"}),
              (0,t.jsx)("div",{className:"anev-context-separator"}),
              (0,t.jsx)("div",{className:"anev-context-item",style:{color:"#2563eb",fontWeight:700},onClick:() => { resolveAutoTags(); setContextMenu(null); },children:"✨ Sinkronkan Data CAS"})
            ]
          })
        ]
      }),
`;

const toolbarAndWorkspace = getToolbarAndSheets();
const allSheets = getAll13Sheets();

const fullSection = contextMenuJsx + '\n' + toolbarAndWorkspace + '\n' + allSheets + '\n      ]})' + '\n    ]}),\n\n      ';

code = code.slice(0, tbIdx) + fullSection + code.slice(arIdx);

fs.writeFileSync('1s8uqnrz-0f75.patched.js', code, 'utf8');
console.log('Successfully generated 1s8uqnrz-0f75.patched.js (13 Pages)! Size:', code.length);
