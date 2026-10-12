import fs from 'fs';
import { getToolbarAndSheets, getAllNineSheets } from './generate_sheets_jsx.mjs';

console.log('Starting final application of Anev Google Docs report patch...');

let code = fs.readFileSync('1s8uqnrz-0f75.patched.step1.js', 'utf8');

// 1. Add CSS rules
const cssTarget = '.anev-palette-dropdown {';
const newCss = `.anev-menu-dropdown {
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
        .anev-auto-tag {
          background: #eff6ff;
          color: #1d4ed8;
          border: 1px solid #bfdbfe;
          border-radius: 4px;
          padding: 1px 5px;
          font-family: monospace;
          font-size: 0.82rem;
          font-weight: 700;
          display: inline-block;
        }
        .anev-security-stamp {
          border: 2px solid #dc2626;
          color: #dc2626;
          font-weight: 900;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 3px 14px;
          border-radius: 4px;
          font-size: 0.82rem;
          display: inline-block;
          margin-bottom: 8px;
        }
        .anev-palette-dropdown {`;

if (!code.includes(cssTarget)) {
  throw new Error('cssTarget not found');
}
code = code.replace(cssTarget, newCss);
console.log('CSS rules injected successfully!');

// 2. Add automatic resolveAutoTags trigger on data load
const reportDataTarget = 'setReportData(data);';
const reportDataReplacement = `setReportData(data);
        setTimeout(resolveAutoTags, 250);`;
code = code.replace(reportDataTarget, reportDataReplacement);
console.log('resolveAutoTags auto trigger added!');

// 3. Find toolbar and sheets section
// From toolbar start: activeTab === "lampiran" && (0,t.jsxs)("div",{className:"anev-docs-toolbar"
// To archive tab start: activeTab === "arsip" &&
const tbMarker = 'activeTab === "lampiran" && (0,t.jsxs)("div",{className:"anev-docs-toolbar"';
const arMarker = 'activeTab === "arsip" &&';

let tbIdx = code.indexOf(tbMarker);
let arIdx = code.indexOf(arMarker);

if (tbIdx === -1 || arIdx === -1) {
  throw new Error('Toolbar or Archive marker not found: tbIdx=' + tbIdx + ' arIdx=' + arIdx);
}

// Assemble full toolbar + workspace + 9 sheets
const toolbarHeader = getToolbarAndSheets();
const allSheets = getAllNineSheets();

const fullSection = toolbarHeader + '\n' + allSheets + '\n      ]})' + '\n    ]}),\n\n    // TAB 2: ';

// Notice in existing code, right before activeTab === "arsip", there is:
// ])}), (closing workspace and lampiran tab), then comment, then activeTab === "arsip"
// Let's inspect the exact chars before activeTab === "arsip"
let beforeAr = code.slice(arIdx - 80, arIdx);
console.log('Before arMarker:', beforeAr);

// We replace from tbIdx to arIdx
code = code.slice(0, tbIdx) + fullSection + code.slice(arIdx);

fs.writeFileSync('1s8uqnrz-0f75.patched.js', code, 'utf8');
console.log('Patched file written successfully! File length:', code.length);
