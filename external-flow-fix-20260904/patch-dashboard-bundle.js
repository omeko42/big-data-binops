const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, 'dashboard-live.js');
const outputPath = path.join(__dirname, 'dashboard-data-responsive-20260904.js');
let source = fs.readFileSync(sourcePath, 'utf8');

function replaceOnce(from, to, label) {
  const first = source.indexOf(from);
  if (first < 0) throw new Error(`Anchor not found: ${label}`);
  if (source.indexOf(from, first + from.length) >= 0) {
    throw new Error(`Anchor is not unique: ${label}`);
  }
  source = source.slice(0, first) + to + source.slice(first + from.length);
}

const commonParams = 'from:e,to:t,functionDomain:"INTERNAL_RESERSE",organizationDomain:"INTERNAL_POLRI"';
const scopedCommonParams = 'from:e,to:t,visibility:(()=>{let e=(0,h.deriveRoles)((0,h.getUser)());return e.isSuperadmin||e.isAdminBinops?"national":"scoped"})(),functionDomain:"INTERNAL_RESERSE",organizationDomain:"INTERNAL_POLRI"';
const commonCount = source.split(commonParams).length - 1;
if (commonCount !== 2) throw new Error(`Expected 2 ranking request anchors, found ${commonCount}`);
source = source.split(commonParams).join(scopedCommonParams);

replaceOnce(
  'from:ee,to:et,functionDomain:"INTERNAL_RESERSE",organizationDomain:"INTERNAL_POLRI"}}).catch(()=>null)',
  'from:ee,to:et,visibility:(()=>{let e=(0,h.deriveRoles)((0,h.getUser)());return e.isSuperadmin||e.isAdminBinops?"national":"scoped"})(),functionDomain:"INTERNAL_RESERSE",organizationDomain:"INTERNAL_POLRI"}}).catch(()=>null)',
  'dashboard summary visibility'
);

replaceOnce(
  'style:{minWidth:0,overflow:"hidden",border:"1px solid #e2e8f0",borderRadius:12,boxShadow:"0 8px 24px rgba(15,23,42,0.05)"}',
  'style:{minWidth:0,height:"100%",overflow:"hidden",border:"1px solid #e2e8f0",borderRadius:12,boxShadow:"0 8px 24px rgba(15,23,42,0.05)"}',
  'sorotan card equal height'
);

replaceOnce(
  'className:"dash-grid",style:{marginTop:0,gridTemplateColumns:"repeat(3,minmax(0,1fr))"}',
  'className:"dash-grid",style:{marginTop:0}',
  'responsive sorotan grid'
);

const roleScopeMarker = 'e.isSuperadmin||e.isAdminBinops?"national":"scoped"';
const roleScopeCount = source.split(roleScopeMarker).length - 1;
if (roleScopeCount !== 3) throw new Error(`Expected 3 role-scoped Kinerja calls, found ${roleScopeCount}`);
if (source.includes('gridTemplateColumns:"repeat(3,minmax(0,1fr))"')) {
  throw new Error('Forced three-column Sorotan grid still present');
}
if (!source.includes('.sort((e,t)=>') || !source.includes('.slice(0,5)')) {
  throw new Error('Sorotan max-five behavior was lost');
}

fs.writeFileSync(outputPath, source);
console.log(JSON.stringify({
  outputPath,
  bytes: Buffer.byteLength(source),
  roleScopedCalls: roleScopeCount,
  responsiveSorotan: true,
  maxFivePreserved: true
}, null, 2));
