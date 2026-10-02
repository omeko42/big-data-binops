import fs from 'fs';
import { execSync } from 'child_process';

let content = fs.readFileSync('frontend-patch/3def3ti6rk0vr.patched.js', 'utf8');

// 1. Page Header Title "Profil Saya"
const targetTitle = '(0,t.jsx)("h1",{className:"cms-page-title",style:{margin:0,fontSize:"1.6rem",fontWeight:800,letterSpacing:"-0.02em",color:"#f8fafc"},children:"Profil Saya"})';
const replaceTitle = '(0,t.jsx)("h1",{className:"cms-page-title",style:{margin:0,fontSize:"1.6rem",fontWeight:800,letterSpacing:"-0.02em",color:"var(--cas-text-primary, #0f172a)"},children:"Profil Saya"})';

if (!content.includes(targetTitle)) {
  console.error('ERROR: targetTitle not found!');
  process.exit(1);
}
content = content.replace(targetTitle, replaceTitle);
console.log('✓ Fixed Profil Saya title color');

// 2. Hero User Name
const targetHeroName = '(0,t.jsx)("span",{\n          style:{fontSize:"1.65rem",fontWeight:800,color:"#ffffff",lineHeight:1.2},\n          children:(function(){';
const targetHeroNameCompact = '(0,t.jsx)("span",{style:{fontSize:"1.65rem",fontWeight:800,color:"#ffffff",lineHeight:1.2},children:(function(){';

let replacedHero = false;
if (content.includes(targetHeroName)) {
  content = content.replace(targetHeroName, targetHeroName.replace('color:"#ffffff"', 'color:"var(--cas-text-primary, #ffffff)"'));
  replacedHero = true;
} else if (content.includes(targetHeroNameCompact)) {
  content = content.replace(targetHeroNameCompact, targetHeroNameCompact.replace('color:"#ffffff"', 'color:"var(--cas-text-primary, #ffffff)"'));
  replacedHero = true;
} else {
  // Regex search
  const regexHero = /style:\{fontSize:"1\.65rem",fontWeight:800,color:"#ffffff",lineHeight:1\.2\}/;
  if (regexHero.test(content)) {
    content = content.replace(regexHero, 'style:{fontSize:"1.65rem",fontWeight:800,color:"var(--cas-text-primary, #ffffff)",lineHeight:1.2}');
    replacedHero = true;
  }
}
if (!replacedHero) {
  console.error('ERROR: targetHeroName not found!');
  process.exit(1);
}
console.log('✓ Fixed Hero User Name color');

// 3. Settings dropdown button
const targetDropdownBtn = 'background:"rgba(15,23,42,0.8)",\n            color:"#f8fafc",\n            border:"1px solid rgba(56,189,248,0.3)",';
const targetDropdownBtnCompact = 'background:"rgba(15,23,42,0.8)",color:"#f8fafc",border:"1px solid rgba(56,189,248,0.3)",';
let replacedDropdown = false;
if (content.includes(targetDropdownBtn)) {
  content = content.replace(targetDropdownBtn, 'background:"var(--cas-card-bg, rgba(15,23,42,0.8))",\n            color:"var(--cas-text-primary, #f8fafc)",\n            border:"1px solid var(--cas-border, rgba(56,189,248,0.3))",');
  replacedDropdown = true;
} else if (content.includes(targetDropdownBtnCompact)) {
  content = content.replace(targetDropdownBtnCompact, 'background:"var(--cas-card-bg, rgba(15,23,42,0.8))",color:"var(--cas-text-primary, #f8fafc)",border:"1px solid var(--cas-border, rgba(56,189,248,0.3))",');
  replacedDropdown = true;
} else {
  const regexDropdown = /background:"rgba\(15,23,42,0\.8\)",\s*color:"#f8fafc",\s*border:"1px solid rgba\(56,189,248,0\.3\)",/;
  if (regexDropdown.test(content)) {
    content = content.replace(regexDropdown, 'background:"var(--cas-card-bg, rgba(15,23,42,0.8))",color:"var(--cas-text-primary, #f8fafc)",border:"1px solid var(--cas-border, rgba(56,189,248,0.3))",');
    replacedDropdown = true;
  }
}
if (!replacedDropdown) {
  console.warn('WARN: targetDropdownBtn not found, skipping');
} else {
  console.log('✓ Fixed Settings dropdown button styles');
}

// 4. Sidebar Card 1 "Bahasa profil"
const targetCard1 = '(0,t.jsx)("h4",{style:{margin:0,fontSize:"0.95rem",fontWeight:800,color:"#fff"},children:"Bahasa profil"})';
const replaceCard1 = '(0,t.jsx)("h4",{style:{margin:0,fontSize:"0.95rem",fontWeight:800,color:"var(--cas-text-primary, #0f172a)"},children:"Bahasa profil"})';
if (content.includes(targetCard1)) {
  content = content.replace(targetCard1, replaceCard1);
  console.log('✓ Fixed Bahasa profil title color');
} else {
  console.error('ERROR: targetCard1 not found!');
  process.exit(1);
}

// 5. Sidebar Card 2 "Profil publik dan URL"
const targetCard2 = '(0,t.jsx)("h4",{style:{margin:0,fontSize:"0.95rem",fontWeight:800,color:"#fff"},children:"Profil publik dan URL"})';
const replaceCard2 = '(0,t.jsx)("h4",{style:{margin:0,fontSize:"0.95rem",fontWeight:800,color:"var(--cas-text-primary, #0f172a)"},children:"Profil publik dan URL"})';
if (content.includes(targetCard2)) {
  content = content.replace(targetCard2, replaceCard2);
  console.log('✓ Fixed Profil publik dan URL title color');
} else {
  console.error('ERROR: targetCard2 not found!');
  process.exit(1);
}

// 6. Sidebar Card 2 Callsign box and copy button
const targetBox = 'background:"rgba(0,0,0,0.3)",padding:"0.55rem 0.85rem",borderRadius:"8px",border:"1px solid rgba(255,255,255,0.08)"';
const replaceBox = 'background:"var(--cas-bg-surface-2, rgba(0,0,0,0.06))",padding:"0.55rem 0.85rem",borderRadius:"8px",border:"1px solid var(--cas-border, rgba(255,255,255,0.08))"';
if (content.includes(targetBox)) {
  content = content.replace(targetBox, replaceBox);
  console.log('✓ Fixed Callsign pill box background');
}

const targetSalinBtn = 'style:{width:"100%",marginTop:"0.65rem",padding:"0.45rem",borderRadius:"8px",background:"transparent",border:"1px solid rgba(255,255,255,0.15)",color:"#cbd5e1",fontSize:"0.76rem",fontWeight:700,cursor:"pointer",textAlign:"center"}';
const replaceSalinBtn = 'style:{width:"100%",marginTop:"0.65rem",padding:"0.45rem",borderRadius:"8px",background:"transparent",border:"1px solid var(--cas-border, rgba(255,255,255,0.15))",color:"var(--cas-text-primary, #cbd5e1)",fontSize:"0.76rem",fontWeight:700,cursor:"pointer",textAlign:"center"}';
if (content.includes(targetSalinBtn)) {
  content = content.replace(targetSalinBtn, replaceSalinBtn);
  console.log('✓ Fixed Salin Callsign button styles');
}

// 7. Sidebar Card 3 "Orang yang Mungkin Anda Kenal"
const targetCard3 = '(0,t.jsx)("h4",{style:{margin:0,fontSize:"0.95rem",fontWeight:800,color:"#fff"},children:"Orang yang Mungkin Anda Kenal"})';
const replaceCard3 = '(0,t.jsx)("h4",{style:{margin:0,fontSize:"0.95rem",fontWeight:800,color:"var(--cas-text-primary, #0f172a)"},children:"Orang yang Mungkin Anda Kenal"})';
if (content.includes(targetCard3)) {
  content = content.replace(targetCard3, replaceCard3);
  console.log('✓ Fixed Orang yang Mungkin Anda Kenal title color');
} else {
  console.error('ERROR: targetCard3 not found!');
  process.exit(1);
}

// 8. Sidebar Card 3 personnel name
const targetPersName = '(0,t.jsx)("div",{style:{fontWeight:800,fontSize:"0.82rem",color:"#fff",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:pers.name})';
const replacePersName = '(0,t.jsx)("div",{style:{fontWeight:800,fontSize:"0.82rem",color:"var(--cas-text-primary, #0f172a)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:pers.name})';
if (content.includes(targetPersName)) {
  content = content.replace(targetPersName, replacePersName);
  console.log('✓ Fixed Personnel item name color in Card 3');
}

// 9. Quick composer select background
const targetSelect = 'style:{fontSize:"0.76rem",padding:"0.35rem 0.6rem",borderRadius:"6px",border:"1px solid var(--cas-border, rgba(255,255,255,0.15))",background:"rgba(0,0,0,0.3)",color:"var(--cas-text-primary, #f8fafc)"}';
const replaceSelect = 'style:{fontSize:"0.76rem",padding:"0.35rem 0.6rem",borderRadius:"6px",border:"1px solid var(--cas-border, rgba(255,255,255,0.15))",background:"var(--cas-bg-surface-2, rgba(0,0,0,0.06))",color:"var(--cas-text-primary, #f8fafc)"}';
if (content.includes(targetSelect)) {
  content = content.replace(targetSelect, replaceSelect);
  console.log('✓ Fixed Quick composer audience selector background');
}

// 10. Contact Modal fields
const targetEmailPolri = '(0,t.jsx)("div",{style:{fontSize:"0.9rem",color:"#f8fafc",marginTop:"0.2rem",fontWeight:600},children:a?.email_polri||(typeof window!=="undefined"&&window.__bdbUserEmail)||"eko.mabes@polri.go.id"})';
const replaceEmailPolri = '(0,t.jsx)("div",{style:{fontSize:"0.9rem",color:"var(--cas-text-primary, #f8fafc)",marginTop:"0.2rem",fontWeight:600},children:a?.email_polri||(typeof window!=="undefined"&&window.__bdbUserEmail)||"eko.mabes@polri.go.id"})';
if (content.includes(targetEmailPolri)) {
  content = content.replace(targetEmailPolri, replaceEmailPolri);
  console.log('✓ Fixed Contact Modal email color');
}

const targetHp = '(0,t.jsx)("div",{style:{fontSize:"0.9rem",color:"#f8fafc",marginTop:"0.2rem",fontWeight:600},children:a?.no_hp||"Belum diatur"})';
const replaceHp = '(0,t.jsx)("div",{style:{fontSize:"0.9rem",color:"var(--cas-text-primary, #f8fafc)",marginTop:"0.2rem",fontWeight:600},children:a?.no_hp||"Belum diatur"})';
if (content.includes(targetHp)) {
  content = content.replace(targetHp, replaceHp);
  console.log('✓ Fixed Contact Modal no_hp color');
}

const targetSatker = '(0,t.jsx)("div",{style:{fontSize:"0.9rem",color:"#f8fafc",marginTop:"0.2rem",fontWeight:600},children:K(a?.scope_satker_name)||"Mabes Polri"})';
const replaceSatker = '(0,t.jsx)("div",{style:{fontSize:"0.9rem",color:"var(--cas-text-primary, #f8fafc)",marginTop:"0.2rem",fontWeight:600},children:K(a?.scope_satker_name)||"Mabes Polri"})';
if (content.includes(targetSatker)) {
  content = content.replace(targetSatker, replaceSatker);
  console.log('✓ Fixed Contact Modal satker color');
}

fs.writeFileSync('frontend-patch/3def3ti6rk0vr.patched.js', content);
fs.writeFileSync('frontend-patch/3def3ti6rk0vr.pilihan_b.js', content);

try {
  execSync('node -c frontend-patch/3def3ti6rk0vr.patched.js');
  console.log('✓ Syntax check passed on 3def3ti6rk0vr.patched.js');
} catch (e) {
  console.error('Syntax error:', e);
  process.exit(1);
}
