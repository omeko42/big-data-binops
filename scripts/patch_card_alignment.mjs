import { runFE } from './fe_inspect.mjs';

const patchScript = `
docker exec bdb-web node -e '
const fs = require("fs");
const p = "/usr/src/app/.next/static/chunks/dashboard-perma-318125d33290.js";
let s = fs.readFileSync(p, "utf8");

// 1. Locate the 3 cards section
const startMarker = "dash-section dash-grid\\",children:[";
const endMarker = "(0,t.jsxs)(\\"div\\",{className:\\"dash-section\\",children:[";

const start = s.indexOf(startMarker);
const end = s.indexOf(endMarker, start);

if (start === -1 || end === -1) {
    console.error("Section bounds not found!");
    process.exit(1);
}

const replacement = "dash-section dash-grid\\",style:{alignItems:\\"stretch\\"},children:[(0,t.jsxs)(\\"div\\",{className:\\"cms-card\\",style:{minWidth:0,display:\\"flex\\",flexDirection:\\"column\\",height:\\"100%\\"},children:[(0,t.jsx)(\\"div\\",{className:\\"cms-card-label\\",style:{marginBottom:\\"0.85rem\\",minHeight:\\"1.5rem\\",display:\\"flex\\",alignItems:\\"center\\",whiteSpace:\\"nowrap\\",overflow:\\"hidden\\",textOverflow:\\"ellipsis\\"},title:l?.scoped?\\"10 Kejahatan Regional · Tertinggi\\":\\"10 Kejahatan Tertinggi\\",children:l?.scoped?\\"10 Kejahatan Regional · Tertinggi\\":\\"10 Kejahatan Tertinggi\\"}),(0,t.jsx)(E,{rows:(l?.top_kejahatan||[]).map(e=>({nama:e.nama,value:e.jml,totalOverride:(l?.scoped&&l?.regional_ct)?l.regional_ct:(l?.ct||0)})),loading:J,total:(l?.scoped&&l?.regional_ct)?l.regional_ct:(l?.ct||0)})]}),(0,t.jsxs)(\\"div\\",{className:\\"cms-card\\",style:{minWidth:0,display:\\"flex\\",flexDirection:\\"column\\",height:\\"100%\\"},children:[(0,t.jsx)(\\"div\\",{className:\\"cms-card-label\\",style:{marginBottom:\\"0.85rem\\",minHeight:\\"1.5rem\\",display:\\"flex\\",alignItems:\\"center\\",whiteSpace:\\"nowrap\\",overflow:\\"hidden\\",textOverflow:\\"ellipsis\\"},title:l?.scoped?\\"10 Satker Regional · CT Tertinggi\\":\\"10 Satker · CT Tertinggi\\",children:l?.scoped?\\"10 Satker Regional · CT Tertinggi\\":\\"10 Satker · CT Tertinggi\\"}),(0,t.jsx)(L,{rows:(l?.top_satker_ct||[]).map(e=>({nama:e.nama,value:e.ct})),loading:J,color:\\"#ef4444\\",suffix:\\"LP\\"})]}),(0,t.jsxs)(\\"div\\",{className:\\"cms-card\\",style:{minWidth:0,display:\\"flex\\",flexDirection:\\"column\\",height:\\"100%\\"},children:[(0,t.jsx)(\\"div\\",{className:\\"cms-card-label\\",style:{marginBottom:\\"0.85rem\\",minHeight:\\"1.5rem\\",display:\\"flex\\",alignItems:\\"center\\",whiteSpace:\\"nowrap\\",overflow:\\"hidden\\",textOverflow:\\"ellipsis\\"},title:l?.scoped?\\"10 Satker Regional · CC Tertinggi\\":\\"10 Satker · CC Tertinggi\\",children:l?.scoped?\\"10 Satker Regional · CC Tertinggi\\":\\"10 Satker · CC Tertinggi\\"}),(0,t.jsx)(L,{rows:(l?.top_satker_cc||[]).map(e=>({nama:e.nama,value:e.cc})),loading:J,color:\\"#16a34a\\",suffix:\\"LP\\",empty:\\"Belum ada perkara selesai (CC).\\"})]})]}),";

s = s.slice(0, start) + replacement + s.slice(end);
console.log("3 cards section patched!");

// 2. Bump cache key to v7
if (!s.includes("bdb-dashboard-v6")) {
    console.error("Cache key bdb-dashboard-v6 not found!");
    process.exit(1);
}
s = s.replace("bdb-dashboard-v6", "bdb-dashboard-v7");
console.log("Cache key bumped to bdb-dashboard-v7!");

fs.writeFileSync(p, s, "utf8");
console.log("Chunk written successfully!");
'
`;

try {
    console.log('Applying card alignment patch inside bdb-web...');
    console.log(runFE(patchScript));

    console.log('Restarting bdb-web...');
    console.log(runFE('docker restart bdb-web'));

    console.log('Checking container status...');
    console.log(runFE('docker ps | grep bdb-web'));
} catch (e) {
    console.error('Error:', e.message);
    if (e.stderr) console.error('STDERR:', e.stderr);
    if (e.stdout) console.log('STDOUT:', e.stdout);
}
