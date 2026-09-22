import { runFE } from './fe_inspect.mjs';

const patchScript = `
docker exec bdb-web node -e '
const fs = require("fs");
const p = "/usr/src/app/.next/static/chunks/dashboard-perma-318125d33290.js";
let s = fs.readFileSync(p, "utf8");

// 1. Patch Card 1
const c1Start = s.indexOf("children:[(0,t.jsx)(\\"span\\",{children:\\"10 Kejahatan Tertinggi\\"})");
const c1EndMarker = "loading:J,total:l?.ct||0})";
const c1End = s.indexOf(c1EndMarker, c1Start) + c1EndMarker.length;

if (c1Start === -1 || c1End < c1Start) {
    console.error("Card 1 indices not found!");
    process.exit(1);
}

const c1Rep = "children:[(0,t.jsx)(\\"span\\",{children:l?.scoped?\\"10 Kejahatan Tertinggi (Regional)\\":\\"10 Kejahatan Tertinggi\\"}),(0,t.jsx)(\\"span\\",{style:{fontSize:\\"0.65rem\\",fontWeight:700,color:\\"#94a3b8\\",textTransform:\\"none\\",letterSpacing:0},children:\\"% dari Total LP\\\"})]}),(0,t.jsx)(E,{rows:(l?.top_kejahatan||[]).map(e=>({nama:e.nama,value:e.jml,totalOverride:(l?.scoped&&l?.regional_ct)?l.regional_ct:(l?.ct||0)})),loading:J,total:(l?.scoped&&l?.regional_ct)?l.regional_ct:(l?.ct||0)})";

s = s.slice(0, c1Start) + c1Rep + s.slice(c1End);
console.log("Card 1 patched!");

// 2. Patch Bar Chart
const chartStart = s.indexOf("if(\\"ct_cc\\"===F)");
const chartEnd = s.indexOf("let e=[...$];", chartStart);

if (chartStart === -1 || chartEnd === -1) {
    console.error("Bar Chart indices not found!");
    process.exit(1);
}

const chartRep = "if(\\"ct_cc\\"===F){let list=(l?.scoped&&Array.isArray(l?.top_satker_ct)&&l.top_satker_ct.length>0)?l.top_satker_ct.filter(x=>x.ct>0):(l?.polda||[]);return{labels:list.map(e=>(e.nama||\\"\\").replace(/^POLDA\\\\s+/i,\\"\\")),datasets:[{label:\\"CT\\",data:list.map(e=>e.ct),backgroundColor:\\"#ef4444\\",borderRadius:4},{label:\\"CC\\",data:list.map(e=>((e.cc_aktual||0)+(e.cc_tunggakan||0))||e.cc||0),backgroundColor:\\"#16a34a\\",borderRadius:4}]}};";

s = s.slice(0, chartStart) + chartRep + s.slice(chartEnd);
console.log("Bar Chart patched!");

// 3. Patch Cache key
if (!s.includes("bdb-dashboard-v5")) {
    console.error("Cache key bdb-dashboard-v5 not found!");
    process.exit(1);
}
s = s.replace("bdb-dashboard-v5", "bdb-dashboard-v6");
console.log("Cache key bumped to bdb-dashboard-v6!");

fs.writeFileSync(p, s, "utf8");
console.log("Successfully wrote patched chunk to disk!");
'
`;

try {
    console.log('Backing up frontend chunk...');
    runFE('docker exec bdb-web cp /usr/src/app/.next/static/chunks/dashboard-perma-318125d33290.js /usr/src/app/.next/static/chunks/dashboard-perma-318125d33290.js.bak-20260913');

    console.log('Applying patch inside bdb-web container...');
    console.log(runFE(patchScript));

    console.log('Restarting bdb-web...');
    console.log(runFE('docker restart bdb-web'));

    console.log('Checking status...');
    console.log(runFE('docker ps | grep bdb-web'));
} catch (e) {
    console.error('Error patching frontend:', e.message);
    if (e.stderr) console.error('STDERR:', e.stderr);
    if (e.stdout) console.log('STDOUT:', e.stdout);
}
