import fs from 'fs';

const filePath = 'd:/Prototype CAS/EDIT MASTER MASAL/live-kinerja-chunk.js';
let content = fs.readFileSync(filePath, 'utf8');

// Target 1: In the print / PDF HTML template
const target1 = '<th style="width:65px;">SISA (BU)</th>';
const replacement1 = '<th style="width:75px;">SISA (BLM UPDATE)</th>';

// Target 2: In the React on-screen modal preview
const target2 = `(0, a.jsx)("th", { style: { width: "65px", border: "1px solid #94a3b8", padding: "5px 4px", textAlign: "center", fontWeight: "bold", fontSize: "10pt", color: "#0f172a" }, children: "SISA (BU)" })`;
const replacement2 = `(0, a.jsx)("th", { style: { width: "75px", border: "1px solid #94a3b8", padding: "5px 3px", textAlign: "center", fontWeight: "bold", fontSize: "10pt", color: "#0f172a" }, children: "SISA (BLM UPDATE)" })`;

if (!content.includes(target1)) {
    console.error('Error: target1 not found in live-kinerja-chunk.js!');
    process.exit(1);
}

if (!content.includes(target2)) {
    console.error('Error: target2 not found in live-kinerja-chunk.js!');
    process.exit(1);
}

content = content.replace(target1, replacement1);
content = content.replace(target2, replacement2);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully replaced "SISA (BU)" with "SISA (BLM UPDATE)" in live-kinerja-chunk.js!');

// Also update the copy in kinerja-unified-filter-export-20260925 if it contains target1
const unifiedPath = 'd:/Prototype CAS/EDIT MASTER MASAL/kinerja-unified-filter-export-20260925/kinerja-perma-external-a42edc88f706.js';
if (fs.existsSync(unifiedPath)) {
    let uContent = fs.readFileSync(unifiedPath, 'utf8');
    if (uContent.includes(target1)) {
        uContent = uContent.replaceAll(target1, replacement1);
    }
    if (uContent.includes('children: "SISA (BU)"')) {
        uContent = uContent.replaceAll('children: "SISA (BU)"', 'children: "SISA (BLM UPDATE)"');
    }
    fs.writeFileSync(unifiedPath, uContent, 'utf8');
    console.log('Successfully updated kinerja-unified-filter-export-20260925 copy as well.');
}
