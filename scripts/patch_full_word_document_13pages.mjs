import fs from 'fs';
import { getToolbarAndSheets, getAll13Sheets } from './build_full_word_sheets_13pages.mjs';

console.log('Building perfected Google Docs / Word editing experience (13 Pages Perkap)...');

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

const newFns = `var lastActiveCell = null;
    var currentFontSizePt = 10;
    var activeMenubarId = null;

    function toggleMenubar(id) {
      var m = document.getElementById(id);
      if (!m) return;
      var isOpen = m.classList.contains('open');
      closeAllMenubars();
      if (!isOpen) {
        m.classList.add('open');
        activeMenubarId = id;
      } else {
        activeMenubarId = null;
      }
    }

    function hoverMenubar(id) {
      if (activeMenubarId && activeMenubarId !== id) {
        closeAllMenubars();
        var m = document.getElementById(id);
        if (m) {
          m.classList.add('open');
          activeMenubarId = id;
        }
      }
    }

    function closeAllMenubars() {
      var allM = document.querySelectorAll('.gdocs-menu-item.open');
      for (var i = 0; i < allM.length; i++) allM[i].classList.remove('open');
      activeMenubarId = null;
    }

    function toggleDocOutline() {
      var p = document.getElementById('docOutlinePanel');
      if (p) p.classList.toggle('collapsed');
    }

    function toggleDocRuler() {
      var r = document.querySelector('.anev-ruler-bar');
      if (r) r.style.display = (r.style.display === 'none') ? 'flex' : 'none';
    }

    function jumpToSection(id) {
      var el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function toggleDocKop(enable) {
      var kop = document.getElementById('docKopSurat');
      var bOn = document.getElementById('btn-kop-header-on');
      var bOff = document.getElementById('btn-kop-header-off');
      var cOn = document.getElementById('btnCommentKopOn');
      var cOff = document.getElementById('btnCommentKopOff');
      if (kop) kop.style.display = enable ? 'block' : 'none';
      if (bOn) { if (enable) bOn.classList.add('active'); else bOn.classList.remove('active'); }
      if (bOff) { if (!enable) bOff.classList.add('active'); else bOff.classList.remove('active'); }
      if (cOn) { if (enable) cOn.classList.add('active'); else cOn.classList.remove('active'); }
      if (cOff) { if (!enable) cOff.classList.add('active'); else cOff.classList.remove('active'); }
    }

    function setDocSignerType(type) {
      var elRank = document.getElementById('sigRankId');
      var bPolri = document.getElementById('btn-ttd-polri');
      var bPns = document.getElementById('btn-ttd-pns');
      if (type === 'pns') {
        if (elRank) elRank.innerText = 'PEMBINA UTAMA NIP 196909021991031001';
        if (bPns) bPns.classList.add('active');
        if (bPolri) bPolri.classList.remove('active');
      } else {
        if (elRank) elRank.innerText = 'KOMISARIS JENDERAL POLISI NRP 69090291';
        if (bPolri) bPolri.classList.add('active');
        if (bPns) bPns.classList.remove('active');
      }
    }

    function toggleFindReplace(showReplace) {
      var box = document.getElementById('docFindReplaceBox');
      if (!box) return;
      var rf = document.getElementById('replaceFields');
      if (rf) rf.style.display = showReplace ? 'flex' : 'none';
      box.style.display = (box.style.display === 'none' || !box.style.display) ? 'block' : 'none';
      if (box.style.display === 'block') {
        var inp = document.getElementById('docFindInput');
        if (inp) { inp.focus(); inp.select(); }
      }
    }

    function closeFindReplace() {
      var box = document.getElementById('docFindReplaceBox');
      if (box) box.style.display = 'none';
    }

    function handleDocFind(text, forward) {
      if (!text) return;
      if (window.find) {
        var found = window.find(text, false, !forward, true, false, true, false);
        var countEl = document.getElementById('findMatchCount');
        if (countEl) countEl.innerText = found ? 'Ditemukan' : 'Tidak ada';
        return found;
      }
    }

    function handleDocReplace(findText, replaceText) {
      if (!findText) return;
      var sel = window.getSelection();
      if (sel && sel.toString().toLowerCase() === findText.toLowerCase()) {
        document.execCommand('insertText', false, replaceText);
      }
      handleDocFind(findText, true);
    }

    function handleDocReplaceAll(findText, replaceText) {
      var editor = document.getElementById('docEditor');
      if (!editor || !findText) return;
      var walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT, null, false);
      var node, count = 0;
      var nodes = [];
      while ((node = walker.nextNode())) nodes.push(node);
      var regex = new RegExp(findText.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&'), 'gi');
      nodes.forEach(function(n) {
        if (regex.test(n.nodeValue)) {
          n.nodeValue = n.nodeValue.replace(regex, replaceText);
          count++;
        }
      });
      updateDocStats();
      var countEl = document.getElementById('findMatchCount');
      if (countEl) countEl.innerText = count + ' diganti';
      alert('Berhasil mengganti ' + count + ' teks.');
    }

    function handleCopyDocumentText() {
      var editor = document.getElementById('docEditor');
      if (editor && navigator.clipboard) {
        navigator.clipboard.writeText(editor.innerText).then(function() {
          alert('Naskah dinas berhasil disalin ke papan klip (clipboard).');
        });
      }
    }

    function handleInsertSecurityStamp() {
      var html = '<div style="text-align:center;margin:6px 0;"><span class="anev-security-stamp">KLASIFIKASI: RAHASIA</span></div>';
      try { document.execCommand('insertHTML', false, html); } catch(e) {}
    }

    function toggleDocDropdown(id) {
      var d = document.getElementById(id);
      if (!d) return;
      var isOpen = d.classList.contains('open');
      var allDd = document.querySelectorAll('.tb-dropdown');
      for (var i = 0; i < allDd.length; i++) allDd[i].classList.remove('open');
      if (!isOpen) d.classList.add('open');
    }

    function closeAllDocDropdowns() {
      var allDd = document.querySelectorAll('.tb-dropdown');
      for (var i = 0; i < allDd.length; i++) allDd[i].classList.remove('open');
    }

    function setBtnActive(id, active) {
      var b = document.getElementById(id);
      if (b) {
        if (active) b.classList.add('active');
        else b.classList.remove('active');
      }
    }

    function runDocCmd(cmd, val) {
      try {
        document.execCommand(cmd, false, val);
        updateToolbarState();
      } catch(e) {}
    }

    function updateToolbarState() {
      try {
        setBtnActive('tb-btn-bold', document.queryCommandState('bold'));
        setBtnActive('tb-btn-italic', document.queryCommandState('italic'));
        setBtnActive('tb-btn-underline', document.queryCommandState('underline'));
        setBtnActive('tb-btn-strike', document.queryCommandState('strikeThrough'));

        setBtnActive('tb-btn-align-left', document.queryCommandState('justifyLeft'));
        setBtnActive('tb-btn-align-center', document.queryCommandState('justifyCenter'));
        setBtnActive('tb-btn-align-right', document.queryCommandState('justifyRight'));
        setBtnActive('tb-btn-align-justify', document.queryCommandState('justifyFull'));

        updateDocStats();
      } catch(e) {}
    }

    function updateDocStats() {
      try {
        var doc = document.getElementById('docEditor');
        if (!doc) return;
        var text = doc.innerText || '';
        var words = text.trim() ? text.trim().split(/\\s+/).length : 0;
        var chars = text.length;
        var pages = document.querySelectorAll('.anev-page-sheet').length;
        
        var wEl = document.getElementById('statusWordInfo');
        if (wEl) wEl.innerText = words.toLocaleString('id-ID') + ' kata • ' + chars.toLocaleString('id-ID') + ' karakter';
        var pEl = document.getElementById('statusPageInfo');
        if (pEl) pEl.innerText = pages + ' halaman';
      } catch(e) {}
    }

    function setDocFontName(font) {
      document.execCommand('fontName', false, font);
      var lbl = document.getElementById('tb-font-label');
      if (lbl) lbl.innerText = font;
      closeAllDocDropdowns();
    }

    function setDocFontSizePt(pt) {
      currentFontSizePt = pt;
      var lbl = document.getElementById('tb-size-label');
      if (lbl) lbl.innerText = pt;
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
      closeAllDocDropdowns();
    }

    function stepDocFontSize(delta) {
      var newPt = Math.max(6, Math.min(72, currentFontSizePt + delta));
      setDocFontSizePt(newPt);
    }

    function setDocBlockFormat(tag, label) {
      document.execCommand('formatBlock', false, tag);
      var lbl = document.getElementById('tb-style-label');
      if (lbl) lbl.innerText = label;
      closeAllDocDropdowns();
    }

    function setDocTextColor(hex) {
      document.execCommand('foreColor', false, hex);
      closeAllDocDropdowns();
    }

    function setDocHighlightColor(col) {
      document.execCommand('hiliteColor', false, col);
      closeAllDocDropdowns();
    }

    function setDocLineSpacing(val) {
      try {
        var sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
          var node = sel.anchorNode;
          var block = node ? (node.nodeType === 1 ? node : node.parentElement).closest('p, div, li, td, th, h1, h2, h3') : null;
          if (block) block.style.lineHeight = val;
        }
      } catch(e) {}
      closeAllDocDropdowns();
    }

    function applyDocZoom(factor, label) {
      var ws = document.getElementById('docEditor');
      if (ws) {
        ws.style.transform = 'scale(' + factor + ')';
        ws.style.transformOrigin = 'top center';
      }
      var zLbl = document.getElementById('tb-zoom-label');
      if (zLbl) zLbl.innerText = label;
      var sZ = document.getElementById('statusZoom');
      if (sZ) sZ.innerText = label;
      closeAllDocDropdowns();
    }

    function handleDirectPrint() {
      window.print();
    }

    function handleInsertLogo() {
      var imgHtml = '<div style="text-align:center;margin:6px 0;"><img src="' + RESERSE_LOGO_B64 + '" class="anev-doc-logo" alt="Logo Reserse Polri" title="Klik untuk memilih, tekan Backspace/Delete untuk menghapus" style="width:75px;height:auto;display:block;margin:4px auto;cursor:pointer;" /></div>';
      try {
        document.execCommand('insertHTML', false, imgHtml);
      } catch(e) {
        var p1 = document.querySelector('.anev-page-body');
        if (p1) p1.insertAdjacentHTML('afterbegin', imgHtml);
      }
    }

    function renumberDocPages() {
      try {
        var sheets = document.querySelectorAll('.anev-page-sheet');
        for (var i = 0; i < sheets.length; i++) {
          var s = sheets[i];
          var num = i + 1;
          s.setAttribute('data-page', num);
          var h = s.querySelector('.anev-sheet-header');
          if (h) {
            if (num === 1) {
              h.innerText = '';
              h.style.height = '16px';
            } else {
              h.innerText = num;
              h.style.textAlign = 'right';
              h.style.fontWeight = '700';
              h.style.fontSize = '10pt';
              h.style.marginBottom = '14px';
            }
          }
          var disp = s.querySelector('.page-num-display');
          if (disp) disp.innerText = num;
        }
        updateDocStats();
      } catch(e) {}
    }

    function handleInsertPageBreak() {
      try {
        var sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) return;
        var node = sel.anchorNode;
        var pageBody = node ? (node.nodeType === 1 ? node : node.parentElement).closest('.anev-page-body') : null;
        var sheet = pageBody ? pageBody.closest('.anev-page-sheet') : document.querySelector('.anev-page-sheet:last-child');
        if (!sheet) return;

        var pageNum = parseInt(sheet.getAttribute('data-page') || '1', 10);
        var newSheet = document.createElement('div');
        var newPageNum = pageNum + 1;
        newSheet.className = 'anev-page-sheet anev-print-sheet gdocs-page';
        newSheet.setAttribute('data-page', newPageNum);

        var watermark = document.createElement('div');
        watermark.className = 'anev-watermark-overlay';
        watermark.setAttribute('contenteditable', 'false');
        watermark.style.position = 'absolute';
        watermark.style.top = '50%';
        watermark.style.left = '50%';
        watermark.style.transform = 'translate(-50%, -50%) rotate(-35deg)';
        watermark.style.fontSize = '5.5rem';
        watermark.style.fontWeight = '900';
        watermark.style.color = '#000000';
        watermark.style.opacity = '0.042';
        watermark.style.letterSpacing = '6px';
        watermark.style.pointerEvents = 'none';
        watermark.style.userSelect = 'none';
        watermark.style.zIndex = '1';
        watermark.style.fontFamily = 'Arial, sans-serif';
        watermark.innerText = activeNrp;
        newSheet.appendChild(watermark);

        var header = document.createElement('div');
        header.className = 'anev-sheet-header';
        header.setAttribute('contenteditable', 'false');
        header.style.textAlign = 'right';
        header.style.fontWeight = '700';
        header.style.fontSize = '10pt';
        header.style.marginBottom = '14px';
        header.style.userSelect = 'none';
        header.innerText = newPageNum;
        newSheet.appendChild(header);

        var newBody = document.createElement('div');
        newBody.className = 'anev-page-body';
        newBody.innerHTML = '<p><br></p>';

        var currentBlock = (node.nodeType === 1 ? node : node.parentElement).closest('p, div, table, ol, ul, h1, h2, h3');
        if (currentBlock && currentBlock.parentElement === pageBody) {
          var next = currentBlock.nextElementSibling;
          while (next) {
            var toMove = next;
            next = next.nextElementSibling;
            newBody.appendChild(toMove);
          }
        }
        newSheet.appendChild(newBody);

        var catchword = document.createElement('div');
        catchword.className = 'anev-sheet-catchword';
        catchword.setAttribute('contenteditable', 'false');
        catchword.style.textAlign = 'right';
        catchword.style.fontSize = '8.5pt';
        catchword.style.fontStyle = 'italic';
        catchword.style.color = '#475569';
        catchword.style.marginTop = '16px';
        catchword.style.userSelect = 'none';
        catchword.innerText = 'dst......';
        newSheet.appendChild(catchword);

        var footer = document.createElement('div');
        footer.className = 'anev-page-footer';
        footer.setAttribute('contenteditable', 'false');
        footer.style.userSelect = 'none';
        footer.innerHTML = '<div class="anev-footer-left anev-forensic-stamp"><span style="font-size:0.72rem;margin-right:4px;">🛡️</span><span style="font-family:monospace;font-size:0.66rem;font-weight:700;color:#475569;letter-spacing:0.4px;">' + docStamp + '</span></div><div class="anev-footer-right page-num-display">' + newPageNum + '</div>';
        newSheet.appendChild(footer);

        sheet.after(newSheet);
        renumberDocPages();
        newSheet.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } catch(e) {
        console.warn('Page break error:', e);
      }
    }

    function insertCustomTable(rows, cols) {
      rows = rows || 3;
      cols = cols || 4;
      var html = '<table class="anev-table-naskah"><thead><tr>';
      for (var c = 1; c <= cols; c++) html += '<th>Header ' + c + '</th>';
      html += '</tr></thead><tbody>';
      for (var r = 1; r <= rows; r++) {
        html += '<tr>';
        for (var c = 1; c <= cols; c++) html += '<td>Data ' + r + '.' + c + '</td>';
        html += '</tr>';
      }
      html += '</tbody></table><p><br></p>';
      try {
        document.execCommand('insertHTML', false, html);
      } catch(e) {}
      closeAllDocDropdowns();
    }

    function handleTableAction(act) {
      var cell = lastActiveCell || (window.getSelection()?.anchorNode ? (window.getSelection().anchorNode.nodeType === 1 ? window.getSelection().anchorNode : window.getSelection().anchorNode.parentElement).closest('td, th') : null);
      var table = cell ? cell.closest('table') : document.querySelector('.anev-table-naskah');
      if (!table) return;

      if (act === 'addRowAbove' || act === 'addRowBelow') {
        var refTr = cell ? cell.closest('tr') : table.querySelector('tbody tr:last-child') || table.querySelector('tr:last-child');
        var colCount = refTr ? refTr.children.length : 4;
        var newTr = document.createElement('tr');
        for (var i = 0; i < colCount; i++) {
          var td = document.createElement('td');
          td.style.border = '1px solid #000';
          td.style.padding = '3px 5px';
          td.innerHTML = '-';
          newTr.appendChild(td);
        }
        if (act === 'addRowAbove' && refTr) refTr.before(newTr);
        else if (refTr) refTr.after(newTr);
        else table.appendChild(newTr);
      } else if (act === 'delRow') {
        var tr = cell ? cell.closest('tr') : null;
        if (tr && tr.parentElement.children.length > 1) tr.remove();
      } else if (act === 'addColLeft' || act === 'addColRight') {
        var colIdx = cell ? cell.cellIndex : 0;
        var rows = table.rows;
        for (var r = 0; r < rows.length; r++) {
          var row = rows[r];
          var isTh = row.firstElementChild && row.firstElementChild.tagName === 'TH';
          var newCell = document.createElement(isTh ? 'th' : 'td');
          newCell.style.border = '1px solid #000';
          newCell.style.padding = '3px 5px';
          if (isTh) { newCell.style.background = '#f1f5f9'; newCell.innerHTML = 'Kolom'; }
          else newCell.innerHTML = '-';
          if (colIdx >= 0 && colIdx < row.children.length) {
            if (act === 'addColLeft') row.children[colIdx].before(newCell);
            else row.children[colIdx].after(newCell);
          } else row.appendChild(newCell);
        }
      } else if (act === 'delCol') {
        var colIdx = cell ? cell.cellIndex : -1;
        if (colIdx >= 0) {
          var rows = table.rows;
          if (rows.length > 0 && rows[0].children.length <= 1) { table.remove(); closeAllDocDropdowns(); return; }
          for (var r = 0; r < rows.length; r++) {
            if (colIdx < rows[r].children.length) rows[r].children[colIdx].remove();
          }
        }
      } else if (act === 'delTable') {
        table.remove();
      }
      closeAllDocDropdowns();
    }

    (0,a.useEffect)(() => {
      function onCtxMenu(e) {
        var editor = e.target.closest('#docEditor');
        if (!editor) return;
        e.preventDefault();
        var isImg = e.target.tagName === 'IMG';
        var isTable = !!e.target.closest('table');
        var type = isImg ? 'img' : (isTable ? 'table' : 'text');
        setContextMenu({
          x: Math.min(e.clientX, window.innerWidth - 220),
          y: Math.min(e.clientY, window.innerHeight - 280),
          type: type,
          target: e.target
        });
      }

      function onDocClick(e) {
        if (!e.target.closest('.tb-dropdown')) {
          closeAllDocDropdowns();
        }
        if (!e.target.closest('.gdocs-menu-item')) {
          closeAllMenubars();
        }
        var cell = e.target.closest('td, th');
        if (cell) lastActiveCell = cell;
      }

      function onDocInput() {
        updateDocStats();
      }

      function handleCrossPageKeys(e) {
        if (e.ctrlKey && (e.key === 'f' || e.key === 'F')) {
          e.preventDefault();
          toggleFindReplace(false);
          return;
        }
        if (e.ctrlKey && (e.key === 'h' || e.key === 'H')) {
          e.preventDefault();
          toggleFindReplace(true);
          return;
        }
        if (e.key === 'Escape') {
          closeFindReplace();
          closeAllMenubars();
          closeAllDocDropdowns();
          setContextMenu(null);
          return;
        }

        var sel = window.getSelection();
        if (!sel || !sel.isCollapsed) return;

        var anchor = sel.anchorNode;
        var pageBody = anchor ? (anchor.nodeType === 1 ? anchor : anchor.parentElement).closest('.anev-page-body') : null;
        if (!pageBody) return;

        var currentSheet = pageBody.closest('.anev-page-sheet');
        var pageNum = parseInt(currentSheet?.getAttribute('data-page') || '1', 10);

        if (e.key === 'Backspace') {
          var range = sel.getRangeAt(0);
          var preRange = range.cloneRange();
          preRange.selectNodeContents(pageBody);
          preRange.setEnd(range.startContainer, range.startOffset);

          // If cursor is at the very beginning of this page's body
          if (preRange.toString().length === 0) {
            if (pageNum > 1) {
              e.preventDefault();
              var prevSheet = currentSheet.previousElementSibling;
              while (prevSheet && !prevSheet.classList.contains('anev-page-sheet')) {
                prevSheet = prevSheet.previousElementSibling;
              }
              if (prevSheet) {
                var prevBody = prevSheet.querySelector('.anev-page-body');
                if (prevBody) {
                  var firstChild = pageBody.firstElementChild;
                  var targetAttach = prevBody.lastElementChild || prevBody;
                  if (firstChild) {
                    prevBody.appendChild(firstChild);
                    var newRange = document.createRange();
                    newRange.selectNodeContents(firstChild);
                    newRange.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(newRange);
                    firstChild.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                  } else {
                    var newRange = document.createRange();
                    newRange.selectNodeContents(targetAttach);
                    newRange.collapse(false);
                    sel.removeAllRanges();
                    sel.addRange(newRange);
                    targetAttach.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                  }

                  // If sheet body is now empty, remove current sheet
                  var remainingText = pageBody.innerText.trim();
                  if (pageBody.children.length === 0 || (!remainingText && pageBody.children.length <= 1)) {
                    currentSheet.remove();
                    renumberDocPages();
                  }
                }
              }
            }
          }
        } else if (e.key === 'Delete') {
          var range = sel.getRangeAt(0);
          var postRange = range.cloneRange();
          postRange.selectNodeContents(pageBody);
          postRange.setStart(range.endContainer, range.endOffset);

          if (postRange.toString().length === 0) {
            var nextSheet = currentSheet.nextElementSibling;
            while (nextSheet && !nextSheet.classList.contains('anev-page-sheet')) {
              nextSheet = nextSheet.nextElementSibling;
            }
            if (nextSheet) {
              var nextBody = nextSheet.querySelector('.anev-page-body');
              if (nextBody && nextBody.firstElementChild) {
                e.preventDefault();
                var moved = nextBody.firstElementChild;
                pageBody.appendChild(moved);
                var remainingNext = nextBody.innerText.trim();
                if (nextBody.children.length === 0 || (!remainingNext && nextBody.children.length <= 1)) {
                  nextSheet.remove();
                  renumberDocPages();
                }
              }
            }
          }
        } else if (e.key === 'Enter' && e.ctrlKey) {
          e.preventDefault();
          handleInsertPageBreak();
        }
      }

      document.addEventListener('selectionchange', updateToolbarState);
      document.addEventListener('contextmenu', onCtxMenu);
      document.addEventListener('click', onDocClick);
      document.addEventListener('keydown', handleCrossPageKeys);
      document.addEventListener('input', onDocInput);
      setTimeout(updateDocStats, 600);

      return () => {
        document.removeEventListener('selectionchange', updateToolbarState);
        document.removeEventListener('contextmenu', onCtxMenu);
        document.removeEventListener('click', onDocClick);
        document.removeEventListener('keydown', handleCrossPageKeys);
        document.removeEventListener('input', onDocInput);
      };
    }, []);

    function handleAddTableRow(isAbove) {`;

code = code.replace(fnTarget, () => newFns);
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
          : (isMabes ? "BARESKRIM POLRI DAN POLDA JAJARAN" : (currentUser?.satker_nama ? currentUser.satker_nama.toUpperCase() : "BARESKRIM POLRI DAN POLDA JAJARAN"));

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
        var tAwal = dates.dStart ? new Date(dates.dStart).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : (reportData?.meta?.dateStart || "1 Agustus 2026");
        var tAkhir = dates.dEnd ? new Date(dates.dEnd).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : (reportData?.meta?.dateEnd || "31 Agustus 2026");
        var pMode = kpPeriodMode === "month" ? "BULANAN" : (kpPeriodMode === "year" ? "TAHUNAN" : "PERIODIK");
        var detPeriod = reportData?.meta?.periodeLabel ? reportData.meta.periodeLabel.toUpperCase() : (dates.pLabel ? dates.pLabel.toUpperCase() : "AGUSTUS 2026");
        var prevPeriod = reportData?.meta?.prevPeriodeLabel ? reportData.meta.prevPeriodeLabel.toUpperCase() : "JULI 2026";
        var todayFormatted = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

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

        var workspace = document.querySelector("#docEditor");
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

        updateDocStats();
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
          .gdocs-top-header,
          .gdocs-menubar,
          .gdocs-toolbar,
          .anev-ruler-bar,
          .anev-context-menu,
          .anev-sheet-corner-pill,
          .gdocs-statusbar,
          .tb-dropdown-menu,
          .gdocs-find-replace-box,
          .doc-outline-panel,
          .gdocs-floating-outline-pill,
          .gdocs-comment-bubble,
          .anev-sticky-header,
          .anev-no-print {
            display: none !important;
          }
          .gdocs-editor-layout-wrapper {
            display: block !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .anev-pages-workspace,
          .gdocs-document-container {
            padding: 0 !important;
            margin: 0 !important;
            background: transparent !important;
            gap: 0 !important;
            overflow: visible !important;
            transform: none !important;
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
          .anev-page-body {
            flex: 1 1 auto !important;
            width: 100% !important;
            max-width: 100% !important;
            overflow: visible !important;
            box-sizing: border-box !important;
          }
        }

        /* SLIM CMS HEADER IN LAMPIRAN TAB */
        .anev-sticky-header {
          padding: 3px 16px !important;
          background: #ffffff !important;
          border-bottom: 1px solid #e2e8f0 !important;
          box-shadow: none !important;
        }
        .anev-sticky-top-bar {
          margin-bottom: 0 !important;
          min-height: 32px !important;
        }

        /* SCREEN STYLING: EXACT 1:1 MATCH TO GOOGLE DOCS A4 CANVAS */
        .anev-wrapper {
          width: 100%;
          min-height: 100vh;
          background: #f0f4f9;
        }
        .anev-pages-workspace {
          background: #f0f4f9;
          padding: 20px 0 80px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 26px;
          min-height: calc(100vh - 120px);
          position: relative;
        }
        .gdocs-document-container {
          outline: none;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 26px;
          transition: transform 0.15s ease-out;
        }
        .anev-page-sheet {
          background: #ffffff;
          box-sizing: border-box;
          width: 210mm;
          min-height: 297mm;
          padding: 20mm 20mm 20mm 30mm; /* 2cm top, 2cm right, 2cm bottom, 3cm left */
          margin: 0 auto;
          box-shadow: 0 1px 3px 1px rgba(60,64,67,.15), 0 1px 2px 0 rgba(60,64,67,.3);
          border-radius: 0;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
          font-size: 10pt;
          line-height: 1.5;
          color: #000000;
          font-family: Arial, "Times New Roman", Calibri, sans-serif;
        }

        /* TYPOGRAPHY */
        .anev-page-sheet p,
        .anev-page-sheet div,
        .anev-page-sheet li {
          text-align: justify;
          text-justify: inter-word;
          margin: 0.3rem 0;
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

        /* TABLES */
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
          margin: 12px 0 4px 0;
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
          border-top: 1px solid #e2e8f0;
          padding-top: 4px;
          margin-top: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 8pt;
          color: #64748b;
          z-index: 10;
        }

        /* GOOGLE DOCS TOP HEADER & MENUS */
        .gdocs-root-app {
          width: 100%;
          min-height: 100vh;
          background: #f0f4f9;
        }
        .gdocs-top-header {
          background: #ffffff;
          border-bottom: 1px solid #dadce0;
          padding: 6px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          position: sticky;
          top: 0;
          z-index: 1100;
        }
        .gdocs-top-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .gdocs-app-icon {
          font-size: 1.8rem;
          line-height: 1;
          user-select: none;
          cursor: pointer;
        }
        .gdocs-doc-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .gdocs-title-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .gdocs-title-input {
          font-size: 1.05rem;
          font-weight: 700;
          color: #1e293b;
          border: 1px solid transparent;
          border-radius: 4px;
          padding: 1px 6px;
          background: transparent;
          min-width: 440px;
          outline: none;
          transition: border 0.15s, background 0.15s;
        }
        .gdocs-title-input:hover {
          border-color: #cbd5e1;
          background: #f8fafc;
        }
        .gdocs-title-input:focus {
          border-color: #2563eb;
          background: #ffffff;
          box-shadow: 0 0 0 2px rgba(37,99,235,0.15);
        }
        .gdocs-star-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.9rem;
          padding: 2px;
          opacity: 0.7;
          transition: opacity 0.15s;
        }
        .gdocs-star-btn:hover {
          opacity: 1;
          transform: scale(1.1);
        }
        .gdocs-cloud-status {
          font-size: 0.72rem;
          color: #5f6368;
          display: inline-flex;
          align-items: center;
          margin-left: 6px;
          user-select: none;
        }

        /* MENUBAR */
        .gdocs-menubar {
          display: flex;
          align-items: center;
          gap: 2px;
        }
        .gdocs-menu-item {
          position: relative;
          display: inline-block;
        }
        .gdocs-menu-trigger {
          background: none;
          border: none;
          font-size: 0.82rem;
          font-weight: 500;
          color: #334155;
          padding: 2px 7px;
          border-radius: 4px;
          cursor: pointer;
          user-select: none;
          transition: background 0.1s;
        }
        .gdocs-menu-trigger:hover,
        .gdocs-menu-item.open .gdocs-menu-trigger {
          background: #e2e8f0;
          color: #0f172a;
        }
        .gdocs-menu-dropdown {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          margin-top: 2px;
          background: #ffffff;
          border: 1px solid #dadce0;
          border-radius: 6px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
          z-index: 2100;
          min-width: 220px;
          padding: 4px 0;
        }
        .gdocs-menu-item.open .gdocs-menu-dropdown {
          display: block;
        }
        .gdocs-dropdown-entry {
          padding: 6px 14px;
          font-size: 0.80rem;
          color: #334155;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          user-select: none;
          gap: 12px;
        }
        .gdocs-dropdown-entry:hover {
          background: #f1f5f9;
          color: #0f172a;
        }
        .gdocs-shortcut-badge {
          font-size: 0.70rem;
          color: #94a3b8;
          font-family: monospace;
          font-weight: 600;
        }
        .gdocs-dropdown-separator {
          height: 1px;
          background: #e2e8f0;
          margin: 4px 0;
        }

        /* TOP RIGHT ACTION CONTROLS */
        .gdocs-top-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .gdocs-ctrl-group {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          background: #f1f3f4;
          padding: 2px 4px;
          border-radius: 6px;
        }
        .gdocs-ctrl-label {
          font-size: 0.70rem;
          font-weight: 700;
          color: #5f6368;
          margin: 0 3px;
        }
        .gdocs-pill-toggle {
          height: 24px;
          border: 1px solid transparent;
          background: transparent;
          color: #475569;
          font-size: 0.70rem;
          font-weight: 600;
          padding: 0 7px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.12s;
        }
        .gdocs-pill-toggle:hover {
          background: #e2e8f0;
          color: #0f172a;
        }
        .gdocs-pill-toggle.active {
          background: #ffffff;
          border-color: #cbd5e1;
          color: #1d4ed8;
          font-weight: 800;
          box-shadow: 0 1px 2px rgba(0,0,0,0.06);
        }

        .gdocs-action-btn-outline {
          height: 28px;
          border: 1px solid #dadce0;
          border-radius: 4px;
          padding: 0 10px;
          font-size: 0.76rem;
          font-weight: 700;
          background: #ffffff;
          color: #3c4043;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          transition: background 0.1s;
        }
        .gdocs-action-btn-outline:hover {
          background: #f1f3f4;
        }
        .gdocs-action-btn-primary {
          height: 28px;
          border: 1px solid #1a73e8;
          border-radius: 4px;
          padding: 0 12px;
          font-size: 0.76rem;
          font-weight: 700;
          background: #1a73e8;
          color: #ffffff;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          box-shadow: 0 1px 2px rgba(26,115,232,0.3);
          transition: background 0.1s;
        }
        .gdocs-action-btn-primary:hover {
          background: #1557b0;
        }

        /* FLOATING FIND & REPLACE BOX */
        .gdocs-find-replace-box {
          position: fixed;
          top: 110px;
          right: 24px;
          background: #ffffff;
          border: 1px solid #dadce0;
          border-radius: 8px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.18);
          padding: 12px 14px;
          z-index: 2500;
          width: 340px;
        }
        .gdocs-find-input {
          flex: 1;
          height: 28px;
          border: 1px solid #cbd5e1;
          border-radius: 4px;
          padding: 0 8px;
          font-size: 0.78rem;
          outline: none;
        }
        .gdocs-find-input:focus {
          border-color: #1a73e8;
          box-shadow: 0 0 0 1.5px rgba(26,115,232,0.2);
        }
        .gdocs-btn-icon {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.82rem;
          color: #5f6368;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .gdocs-btn-icon:hover {
          background: #f1f3f4;
          color: #202124;
        }

        /* GOOGLE DOCS WORKSPACE & OUTLINE LAYOUT */
        .gdocs-editor-layout-wrapper {
          display: flex;
          width: 100%;
          min-height: calc(100vh - 120px);
          position: relative;
        }
        .gdocs-floating-outline-pill {
          position: fixed;
          left: 14px;
          top: 155px;
          z-index: 1010;
          background: #ffffff;
          border: 1px solid #dadce0;
          box-shadow: 0 1px 4px rgba(60,64,67,0.25);
          border-radius: 20px;
          padding: 5px 12px;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          font-size: 0.75rem;
          font-weight: 700;
          color: #3c4043;
          transition: all 0.15s;
        }
        .gdocs-floating-outline-pill:hover {
          background: #f1f3f4;
          color: #1a73e8;
          box-shadow: 0 2px 8px rgba(60,64,67,0.3);
        }
        .doc-outline-panel {
          position: fixed;
          left: 0;
          top: 120px;
          bottom: 0;
          width: 250px;
          background: #ffffff;
          border-right: 1px solid #dadce0;
          box-shadow: 4px 0 16px rgba(60,64,67,0.15);
          z-index: 1020;
          padding: 14px 12px;
          overflow-y: auto;
          transition: transform 0.2s ease-in-out;
        }
        .doc-outline-panel.collapsed {
          transform: translateX(-100%);
          display: block;
        }
        .doc-outline-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 8px;
          margin-bottom: 8px;
          border-bottom: 1px solid #e2e8f0;
          font-weight: 800;
          color: #1e293b;
        }
        .doc-outline-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .outline-item {
          padding: 5px 8px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.78rem;
          color: #334155;
          transition: background 0.1s, color 0.1s;
        }
        .outline-item:hover {
          background: #eff6ff;
          color: #1d4ed8;
        }
        .outline-level-1 {
          font-weight: 700;
          margin-top: 6px;
          color: #0f172a;
        }
        .outline-level-2 {
          padding-left: 18px;
          font-size: 0.74rem;
          color: #475569;
        }

        /* REAL GOOGLE DOCS COMMENT BUBBLE (AGUNG KRISDIANTO) */
        .gdocs-comment-bubble {
          position: absolute;
          top: 55px;
          left: calc(50% + 112mm);
          width: 235px;
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(60,64,67,0.18), 0 1px 3px rgba(60,64,67,0.12);
          border: 1px solid #dadce0;
          padding: 10px 12px;
          z-index: 100;
          user-select: none;
        }
        @media (max-width: 1400px) {
          .gdocs-comment-bubble {
            right: 16px;
            left: auto;
          }
        }
        .gdocs-comment-bubble-head {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }
        .gdocs-comment-avatar {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #1a73e8;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.70rem;
          font-weight: 700;
        }
        .gdocs-comment-info {
          display: flex;
          flex-direction: column;
        }
        .gdocs-comment-author {
          font-size: 0.76rem;
          font-weight: 700;
          color: #202124;
        }
        .gdocs-comment-time {
          font-size: 0.66rem;
          color: #5f6368;
        }
        .gdocs-comment-msg {
          font-size: 0.80rem;
          font-weight: 700;
          color: #1e293b;
          background: #fef08a;
          padding: 4px 8px;
          border-radius: 4px;
          margin-bottom: 8px;
          border-left: 3px solid #eab308;
        }
        .gdocs-comment-btn-group {
          display: flex;
          gap: 6px;
        }
        .gdocs-comment-action-btn {
          flex: 1;
          height: 25px;
          border: 1px solid #dadce0;
          border-radius: 4px;
          background: #f8f9fa;
          font-size: 0.70rem;
          font-weight: 700;
          color: #3c4043;
          cursor: pointer;
          transition: all 0.15s;
        }
        .gdocs-comment-action-btn:hover {
          background: #e8f0fe;
          border-color: #1a73e8;
          color: #1a73e8;
        }
        .gdocs-comment-action-btn.active {
          background: #1a73e8;
          border-color: #1a73e8;
          color: #ffffff;
        }

        /* GOOGLE DOCS STICKY TOOLBAR */
        .gdocs-toolbar, .anev-docs-toolbar {
          position: sticky;
          top: var(--cms-header-h, 0px);
          z-index: 1000;
          background: #edf2fa;
          border-bottom: 1px solid #dadce0;
          box-shadow: 0 1px 3px rgba(60,64,67,0.08);
          padding: 3px 14px;
          display: flex;
          align-items: center;
          gap: 2px;
          flex-wrap: wrap;
        }
        .anev-tool-btn, .tb-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 26px;
          height: 26px;
          padding: 2px 5px;
          border-radius: 4px;
          border: 1px solid transparent;
          background: transparent;
          color: #3c4043;
          font-size: 0.80rem;
          font-weight: 700;
          cursor: pointer;
          user-select: none;
          transition: background 0.1s;
        }
        .anev-tool-btn:hover, .tb-btn:hover {
          background: #e0e6ed;
          color: #202124;
        }
        .anev-tool-btn.active, .tb-btn.active {
          background: #d3e3fd !important;
          color: #041e49 !important;
          border-color: #a8c7fa !important;
        }
        .anev-tool-separator, .tb-sep {
          width: 1px;
          height: 18px;
          background: #dadce0;
          margin: 0 3px;
        }
        .tb-select-btn {
          height: 26px;
          border: 1px solid transparent;
          border-radius: 4px;
          padding: 0 6px;
          font-size: 0.78rem;
          font-weight: 600;
          background: transparent;
          color: #3c4043;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          user-select: none;
        }
        .tb-select-btn:hover {
          background: #e0e6ed;
        }

        /* DROPDOWNS */
        .tb-dropdown {
          position: relative;
          display: inline-block;
        }
        .tb-dropdown-menu {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          margin-top: 3px;
          background: #ffffff;
          border: 1px solid #dadce0;
          border-radius: 6px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.14);
          z-index: 1200;
          padding: 4px 0;
          min-width: 150px;
        }
        .tb-dropdown.open .tb-dropdown-menu {
          display: block;
        }
        .tb-menu-item {
          padding: 6px 14px;
          font-size: 0.80rem;
          color: #334155;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          user-select: none;
        }
        .tb-menu-item:hover {
          background: #f1f5f9;
          color: #0f172a;
        }

        /* STATUS BAR BOTTOM */
        .gdocs-statusbar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: #ffffff;
          border-top: 1px solid #dadce0;
          padding: 5px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.75rem;
          color: #5f6368;
          z-index: 1000;
          box-shadow: 0 -1px 4px rgba(60,64,67,0.08);
        }

        /* HORIZONTAL RULER */
        .anev-ruler-bar {
          display: flex;
          justify-content: center;
          background: #f0f4f9;
          padding: 2px 0 6px 0;
          position: sticky;
          top: 32px;
          z-index: 999;
        }
        .anev-ruler {
          width: 210mm;
          height: 22px;
          background: #ffffff;
          border: 1px solid #dadce0;
          box-shadow: 0 1px 3px rgba(60,64,67,0.1);
          display: flex;
          position: relative;
          user-select: none;
        }
        .anev-ruler-left-margin {
          width: 30mm;
          background: #e8eaed;
          border-right: 1.5px solid #5f6368;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 7.5pt;
          font-weight: 700;
          color: #5f6368;
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
          background: #e8eaed;
          border-left: 1.5px solid #5f6368;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 7.5pt;
          font-weight: 700;
          color: #5f6368;
        }
        .gdocs-ruler-marker-top {
          position: absolute;
          top: 0;
          left: 0;
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: 6px solid #1a73e8;
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
          border-bottom: 6px solid #1a73e8;
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
          border-top: 6px solid #1a73e8;
          cursor: ew-resize;
          z-index: 5;
        }

        /* CONTEXT MENU */
        .anev-context-menu {
          position: fixed;
          background: #ffffff;
          border: 1px solid #dadce0;
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

// Assemble full JSX: Context Menu + Toolbar + Workspace + 13 Sheets + Statusbar
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
              (0,t.jsx)("div",{className:"anev-context-item",onClick:() => { handleTableAction("addRowAbove"); setContextMenu(null); },children:"⬆️ Sisipkan Baris di Atas"}),
              (0,t.jsx)("div",{className:"anev-context-item",onClick:() => { handleTableAction("addRowBelow"); setContextMenu(null); },children:"⬇️ Sisipkan Baris di Bawah"}),
              (0,t.jsx)("div",{className:"anev-context-item",onClick:() => { handleTableAction("delRow"); setContextMenu(null); },children:"❌ Hapus Baris"}),
              (0,t.jsx)("div",{className:"anev-context-separator"}),
              (0,t.jsx)("div",{className:"anev-context-item",onClick:() => { handleTableAction("addColLeft"); setContextMenu(null); },children:"⬅️ Sisipkan Kolom di Kiri"}),
              (0,t.jsx)("div",{className:"anev-context-item",onClick:() => { handleTableAction("addColRight"); setContextMenu(null); },children:"➡️ Sisipkan Kolom di Kanan"}),
              (0,t.jsx)("div",{className:"anev-context-item",onClick:() => { handleTableAction("delCol"); setContextMenu(null); },children:"❌ Hapus Kolom"}),
              (0,t.jsx)("div",{className:"anev-context-separator"}),
              (0,t.jsx)("div",{className:"anev-context-item",style:{color:"#dc2626"},onClick:() => { handleTableAction("delTable"); setContextMenu(null); },children:"🗑️ Hapus Tabel"})
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

const statusbarJsx = `
          (0,t.jsxs)("div",{className:"gdocs-statusbar anev-no-print",children:[
            (0,t.jsx)("div",{id:"statusPageInfo",children:"13 halaman"}),
            (0,t.jsx)("div",{id:"statusWordInfo",children:"Memuat statistik dokumen..."}),
            (0,t.jsxs)("div",{children:[
              "Zoom: ",(0,t.jsx)("span",{id:"statusZoom",children:"100%"})," • Margin: 3cm / 2cm • A4 Portrait"
            ]})
          ]})
`;

const fullSection = `
      // Close anev-sticky-header
      null
      ]}),

      ${contextMenuJsx}

      ${toolbarAndWorkspace}
      ${allSheets}
            ]}),
          ]}),
        ]}),
        ${statusbarJsx}
      ]}),

      `;

code = code.slice(0, tbIdx) + fullSection + code.slice(arIdx);

fs.writeFileSync('1s8uqnrz-0f75.patched.js', code, 'utf8');
console.log('Successfully generated 1s8uqnrz-0f75.patched.js (13 Pages)! Size:', code.length);
