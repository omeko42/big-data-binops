import fs from 'fs';
import { getToolbarAndSheets, getAllNineSheets } from './build_full_word_sheets.mjs';

console.log('Building full Word official patch...');

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

// 3. Insert helper functions & context menu useEffect
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
      document.addEventListener('contextmenu', onCtxMenu);
      document.addEventListener('click', onDocClick);
      return () => {
        document.removeEventListener('contextmenu', onCtxMenu);
        document.removeEventListener('click', onDocClick);
      };
    }, []);

    function handleAddTableRow(isAbove) {`;
code = code.replace(fnTarget, newFns);
console.log('Helper functions and useEffect inserted!');

// 4. Update resolveAutoTags auto trigger
const reportDataTarget = 'setReportData(data);';
if (!code.includes(reportDataTarget)) {
  throw new Error('reportDataTarget not found');
}
code = code.replace(reportDataTarget, `setReportData(data);\n        setTimeout(resolveAutoTags, 250);`);
console.log('resolveAutoTags auto trigger added!');

// 5. Replace <style> block with True A4 1:1 & Google Docs CSS
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

// 6. Replace Toolbar and 9 Sheets
const tbStartMarker = '// Baris 3: MS Word / Google Docs Toolbar';
const arStartMarker = '// TAB 2: ARSIP DOKUMEN';
const tbIdx = code.indexOf(tbStartMarker);
const arIdx = code.indexOf(arStartMarker);

if (tbIdx === -1 || arIdx === -1) {
  throw new Error('tbIdx or arIdx not found: tb=' + tbIdx + ' ar=' + arIdx);
}

// Assemble full JSX: Context Menu + Toolbar + Workspace + 9 Sheets
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
const allSheets = getAllNineSheets();

const fullSection = contextMenuJsx + '\n' + toolbarAndWorkspace + '\n' + allSheets + '\n      ]})' + '\n    ]}),\n\n      ';

code = code.slice(0, tbIdx) + fullSection + code.slice(arIdx);

fs.writeFileSync('1s8uqnrz-0f75.patched.js', code, 'utf8');
console.log('Successfully generated 1s8uqnrz-0f75.patched.js! Size:', code.length);
