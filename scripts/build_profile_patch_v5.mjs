import fs from 'fs';
import vm from 'vm';

let content = fs.readFileSync('clean_live_3def.js', 'utf8');

console.log('Original clean_live_3def length:', content.length);

// 0. FIX THE ROOT CAUSE OF REACT ERROR 62: style:"0.65rem" -> style:{fontSize:"0.65rem",color:"#16a34a"}
const badStyle = 'children:ld?(0,t.jsx)("i",{className:"pi pi-spin pi-spinner",style:"0.65rem",color:"#16a34a"}):null';
const fixedStyle = 'children:ld?(0,t.jsx)("i",{className:"pi pi-spin pi-spinner",style:{fontSize:"0.65rem",color:"#16a34a"}}):null';
if (!content.includes(badStyle)) {
  console.error('badStyle not found in clean_live_3def');
  process.exit(1);
}
content = content.replace(badStyle, fixedStyle);
console.log('Step 0: Fixed React Error #62 bad style string');

// 1. Add OTP states
const stateTarget = `[eEmailChoice,setEmailChoice]=(0,n.useState)("dinas"),`;
const stateAdd = `[eEmailChoice,setEmailChoice]=(0,n.useState)("dinas"),[eOtpCooldown,setOtpCooldown]=(0,n.useState)(0),[eOtpAttempts,setOtpAttempts]=(0,n.useState)(0),[eOtpVerifyFails,setOtpVerifyFails]=(0,n.useState)(0),`;

if (!content.includes(stateTarget)) {
  console.error('stateTarget not found in clean_live_3def');
  process.exit(1);
}
content = content.replace(stateTarget, stateAdd);
console.log('Step 1: Added OTP states');

// 2. Add countdown effect
const effectTarget = `finally{ef(!1)}}if((0,n.useEffect)(()=>{(async()=>{try{let e=await eT()`;
const effectAdd = `finally{ef(!1)}}(0,n.useEffect)(()=>{let timer;if(eOtpCooldown>0){timer=setInterval(()=>setOtpCooldown(c=>Math.max(0,c-1)),1000)}return()=>{if(timer)clearInterval(timer)}},[eOtpCooldown]);if((0,n.useEffect)(()=>{(async()=>{try{let e=await eT()`;

if (!content.includes(effectTarget)) {
  console.error('effectTarget not found in clean_live_3def');
  process.exit(1);
}
content = content.replace(effectTarget, effectAdd);
console.log('Step 2: Added countdown effect');

// 3. Add guards and cooldown in startTotpSetup
const startTotpOld = `async function startTotpSetup(tEmail){
let choice=tEmail||eEmailChoice||"dinas";
setTotpLoading(!0);setTotpError("");
try{
let res=await c.apiAuth.post("/Authentication/profile/security/totp/setup",{mode:"setup",target_email:choice});
(0,c.assertOk)(res);
let d=res.data?.data||res.data;
setTotpData(d);setTotpInputCode("");setTotpEmailOtp("");setExistingPassword("");setTotpModal(!0);
e.current?.show({severity:"info",summary:"Kode OTP Terkirim",detail:"Kode verifikasi telah dikirim ke "+(d?.sent_to_masked||"Email Dinas Polri Anda.")});
}catch(err){`;

const startTotpNew = `async function startTotpSetup(tEmail){
if(eOtpAttempts>=3){e.current?.show({severity:"error",summary:"Batas Percobaan",detail:"Batas pengiriman OTP tercapai (maksimal 3 kali). Silakan coba lagi nanti."});return;}
if(eOtpCooldown>0){e.current?.show({severity:"warn",summary:"Harap Menunggu",detail:\`Tunggu \${eOtpCooldown} detik sebelum meminta kode OTP kembali.\`});return;}
let choice=tEmail||eEmailChoice||"dinas";
setTotpLoading(!0);setTotpError("");
try{
let res=await c.apiAuth.post("/Authentication/profile/security/totp/setup",{mode:"setup",target_email:choice});
(0,c.assertOk)(res);
let d=res.data?.data||res.data;
setOtpAttempts(prev=>prev+1);setOtpCooldown(60);
setTotpData(d);setTotpInputCode("");setTotpEmailOtp("");setExistingPassword("");setTotpModal(!0);
e.current?.show({severity:"info",summary:"Kode OTP Terkirim",detail:"Kode verifikasi telah dikirim ke "+(d?.sent_to_masked||"Email Dinas Polri Anda.")});
}catch(err){`;

if (!content.includes(startTotpOld)) {
  console.error('startTotpOld not found in clean_live_3def');
  process.exit(1);
}
content = content.replace(startTotpOld, startTotpNew);
console.log('Step 3: Added guards in startTotpSetup');

// 4. Add guards and cooldown in ez (Security OTP)
const ezOld = `async function ez(t,targetEmail){
if("enable_totp"===t)return startTotpSetup(targetEmail);
let choice=targetEmail||eEmailChoice||"dinas";
eh(!0);
try{
let res=await c.apiAuth.post("/Authentication/profile/security/otp",{action:t,target_email:choice});
(0,c.assertOk)(res);
let d=res.data?.data||res.data;
er(d?.otp_id||"");en(t);el("");es("");ec("");ev("");setExistingPassword("");ee(!0);
e.current?.show({severity:"info",summary:"Kode OTP Terkirim",detail:"Kode verifikasi dikirim ke "+(d?.sent_to_masked||"Email Dinas Polri Anda.")});
}catch(err){`;

const ezNew = `async function ez(t,targetEmail){
if("enable_totp"===t)return startTotpSetup(targetEmail);
if(eOtpAttempts>=3){e.current?.show({severity:"error",summary:"Batas Percobaan",detail:"Batas pengiriman OTP tercapai (maksimal 3 kali). Silakan coba lagi nanti."});return;}
if(eOtpCooldown>0){e.current?.show({severity:"warn",summary:"Harap Menunggu",detail:\`Tunggu \${eOtpCooldown} detik sebelum meminta kode OTP kembali.\`});return;}
let choice=targetEmail||eEmailChoice||"dinas";
eh(!0);
try{
let res=await c.apiAuth.post("/Authentication/profile/security/otp",{action:t,target_email:choice});
(0,c.assertOk)(res);
let d=res.data?.data||res.data;
setOtpAttempts(prev=>prev+1);setOtpCooldown(60);
er(d?.otp_id||"");en(t);el("");es("");ec("");ev("");setExistingPassword("");ee(!0);
e.current?.show({severity:"info",summary:"Kode OTP Terkirim",detail:"Kode verifikasi dikirim ke "+(d?.sent_to_masked||"Email Dinas Polri Anda.")});
}catch(err){`;

if (!content.includes(ezOld)) {
  console.error('ezOld not found in clean_live_3def');
  process.exit(1);
}
content = content.replace(ezOld, ezNew);
console.log('Step 4: Added guards in ez');

// 5. In TOTP Modal UI, update target buttons with cooldown timer and max 3x notice:
const totpUiOld = `(0,t.jsxs)("div",{style:{display:"flex",gap:"0.4rem"},children:[(0,t.jsxs)("button",{type:"button",onClick:()=>startTotpSetup("dinas"),style:{padding:"0.2rem 0.45rem",borderRadius:6,fontSize:"0.68rem",cursor:"pointer",border:"dinas"===eEmailChoice?"1px solid #3b82f6":"1px solid rgba(255,255,255,0.15)",background:"dinas"===eEmailChoice?"rgba(59,130,246,0.2)":"transparent",color:"dinas"===eEmailChoice?"#60a5fa":"#94a3b8"},children:["Email Dinas (Utama): ",K(a.email_polri||a.email)]}),a.email&&a.email_polri&&(0,t.jsxs)("button",{type:"button",onClick:()=>startTotpSetup("sekunder"),style:{padding:"0.2rem 0.45rem",borderRadius:6,fontSize:"0.68rem",cursor:"pointer",border:"sekunder"===eEmailChoice?"1px solid #3b82f6":"1px solid rgba(255,255,255,0.15)",background:"sekunder"===eEmailChoice?"rgba(59,130,246,0.2)":"transparent",color:"sekunder"===eEmailChoice?"#60a5fa":"#94a3b8"},children:["Email Sekunder: ",K(a.email)]})]})]}),`;

const totpUiNew = `(0,t.jsxs)("div",{style:{display:"flex",gap:"0.4rem",flexWrap:"wrap",alignItems:"center"},children:[
  (0,t.jsxs)("button",{type:"button",disabled:eOtpCooldown>0||eOtpAttempts>=3,onClick:()=>startTotpSetup("dinas"),style:{padding:"0.2rem 0.45rem",borderRadius:6,fontSize:"0.68rem",cursor:(eOtpCooldown>0||eOtpAttempts>=3)?"not-allowed":"pointer",opacity:(eOtpCooldown>0||eOtpAttempts>=3)?0.5:1,border:"dinas"===eEmailChoice?"1px solid #3b82f6":"1px solid rgba(255,255,255,0.15)",background:"dinas"===eEmailChoice?"rgba(59,130,246,0.2)":"transparent",color:"dinas"===eEmailChoice?"#60a5fa":"#94a3b8"},children:[
    eOtpAttempts>=3?"Batas 3x Tercapai":eOtpCooldown>0?\`Kirim Ulang (\${eOtpCooldown}s)\`:"Kirim ke Email Dinas",
    " (",K(a.email_polri||a.email),")"
  ]}),
  a.email&&a.email_polri&&(0,t.jsxs)("button",{type:"button",disabled:eOtpCooldown>0||eOtpAttempts>=3,onClick:()=>startTotpSetup("sekunder"),style:{padding:"0.2rem 0.45rem",borderRadius:6,fontSize:"0.68rem",cursor:(eOtpCooldown>0||eOtpAttempts>=3)?"not-allowed":"pointer",opacity:(eOtpCooldown>0||eOtpAttempts>=3)?0.5:1,border:"sekunder"===eEmailChoice?"1px solid #3b82f6":"1px solid rgba(255,255,255,0.15)",background:"sekunder"===eEmailChoice?"rgba(59,130,246,0.2)":"transparent",color:"sekunder"===eEmailChoice?"#60a5fa":"#94a3b8"},children:[
    eOtpAttempts>=3?"Batas 3x Tercapai":eOtpCooldown>0?\`Kirim Ulang (\${eOtpCooldown}s)\`:"Kirim ke Email Sekunder",
    " (",K(a.email),")"
  ]}),
  eOtpAttempts>=3&&(0,t.jsx)("div",{style:{fontSize:"0.68rem",color:"#ef4444",fontWeight:600,width:"100%"},children:"Batas pengiriman OTP tercapai (maksimal 3 kali). Silakan coba lagi nanti."})
]})]}),`;

if (!content.includes(totpUiOld)) {
  console.error('totpUiOld not found in clean_live_3def');
  process.exit(1);
}
content = content.replace(totpUiOld, totpUiNew);
console.log('Step 5: Updated TOTP Modal UI');

// 6. In Security OTP Dialog UI, update target buttons with cooldown timer and max 3x notice:
const secUiOld = `(0,t.jsxs)("div",{style:{display:"flex",gap:"0.4rem",flexWrap:"wrap"},children:[(0,t.jsxs)("button",{type:"button",onClick:()=>ez(et,"dinas"),style:{padding:"0.2rem 0.5rem",borderRadius:6,fontSize:"0.7rem",cursor:"pointer",border:"dinas"===eEmailChoice?"1px solid #3b82f6":"1px solid rgba(255,255,255,0.15)",background:"dinas"===eEmailChoice?"rgba(59,130,246,0.2)":"transparent",color:"dinas"===eEmailChoice?"#60a5fa":"#94a3b8"},children:["Email Dinas (Utama): ",K(a.email_polri||a.email)]}),a.email&&a.email_polri&&(0,t.jsxs)("button",{type:"button",onClick:()=>ez(et,"sekunder"),style:{padding:"0.2rem 0.5rem",borderRadius:6,fontSize:"0.7rem",cursor:"pointer",border:"sekunder"===eEmailChoice?"1px solid #3b82f6":"1px solid rgba(255,255,255,0.15)",background:"sekunder"===eEmailChoice?"rgba(59,130,246,0.2)":"transparent",color:"sekunder"===eEmailChoice?"#60a5fa":"#94a3b8"},children:["Email Sekunder: ",K(a.email)]})]})]}),`;

const secUiNew = `(0,t.jsxs)("div",{style:{display:"flex",gap:"0.4rem",flexWrap:"wrap",alignItems:"center"},children:[
  (0,t.jsxs)("button",{type:"button",disabled:eOtpCooldown>0||eOtpAttempts>=3,onClick:()=>ez(et,"dinas"),style:{padding:"0.2rem 0.5rem",borderRadius:6,fontSize:"0.7rem",cursor:(eOtpCooldown>0||eOtpAttempts>=3)?"not-allowed":"pointer",opacity:(eOtpCooldown>0||eOtpAttempts>=3)?0.5:1,border:"dinas"===eEmailChoice?"1px solid #3b82f6":"1px solid rgba(255,255,255,0.15)",background:"dinas"===eEmailChoice?"rgba(59,130,246,0.2)":"transparent",color:"dinas"===eEmailChoice?"#60a5fa":"#94a3b8"},children:[
    eOtpAttempts>=3?"Batas 3x Tercapai":eOtpCooldown>0?\`Kirim Ulang (\${eOtpCooldown}s)\`:"Kirim ke Email Dinas",
    ": ",K(a.email_polri||a.email)
  ]}),
  a.email&&a.email_polri&&(0,t.jsxs)("button",{type:"button",disabled:eOtpCooldown>0||eOtpAttempts>=3,onClick:()=>ez(et,"sekunder"),style:{padding:"0.2rem 0.5rem",borderRadius:6,fontSize:"0.7rem",cursor:(eOtpCooldown>0||eOtpAttempts>=3)?"not-allowed":"pointer",opacity:(eOtpCooldown>0||eOtpAttempts>=3)?0.5:1,border:"sekunder"===eEmailChoice?"1px solid #3b82f6":"1px solid rgba(255,255,255,0.15)",background:"sekunder"===eEmailChoice?"rgba(59,130,246,0.2)":"transparent",color:"sekunder"===eEmailChoice?"#60a5fa":"#94a3b8"},children:[
    eOtpAttempts>=3?"Batas 3x Tercapai":eOtpCooldown>0?\`Kirim Ulang (\${eOtpCooldown}s)\`:"Kirim ke Email Sekunder",
    ": ",K(a.email)
  ]}),
  eOtpAttempts>=3&&(0,t.jsx)("div",{style:{fontSize:"0.7rem",color:"#ef4444",fontWeight:600,width:"100%"},children:"Batas pengiriman OTP tercapai (maksimal 3 kali). Silakan coba lagi nanti."})
]})]}),`;

if (!content.includes(secUiOld)) {
  console.error('secUiOld not found in clean_live_3def');
  process.exit(1);
}
content = content.replace(secUiOld, secUiNew);
console.log('Step 6: Updated Security OTP Modal UI');

// 7. Direct clean two-way validation on profile modal fields (NO IIFE):
const oldProfEmailPolri = `(0,t.jsxs)(F,{id:"fld-3def3ti6rk0vr-40",name:"field_3def3ti6rk0vr_40",label:"Email Dinas Polri (Utama)",hint:"wajib @polri.go.id, login & OTP",children:[(0,t.jsx)(p.default,{id:"profile-form-email-polri",name:"email_polri",autoComplete:"email",value:Z.email_polri,onChange:e=>{G(t=>({...t,email_polri:e})),X.onChangeDebounced("email_polri",e)},onBlur:e=>X.onBlurNow("email_polri",e),status:X.status.email_polri,placeholder:"nrp@polri.go.id atau nip@polri.go.id"}),X.message.email_polri&&(0,t.jsx)("small",{className:"bdb-error",children:X.message.email_polri})]}),`;

const newProfEmailPolri = `(0,t.jsxs)(F,{id:"fld-3def3ti6rk0vr-40",name:"field_3def3ti6rk0vr_40",label:"Email Dinas Polri (Utama)",hint:"wajib @polri.go.id, login & OTP",children:[(0,t.jsx)(p.default,{id:"profile-form-email-polri",name:"email_polri",autoComplete:"email",value:Z.email_polri,onChange:e=>{G(t=>({...t,email_polri:e})),X.onChangeDebounced("email_polri",e)},onBlur:e=>X.onBlurNow("email_polri",e),status:(Z.username&&Z.email_polri&&Z.username.trim().toLowerCase()===Z.email_polri.trim().toLowerCase())?"error":X.status.email_polri,placeholder:"nrp@polri.go.id atau nip@polri.go.id"}),(Z.username&&Z.email_polri&&Z.username.trim().toLowerCase()===Z.email_polri.trim().toLowerCase())?(0,t.jsx)("small",{className:"bdb-error",style:{color:"#ef4444",fontWeight:600},children:"Email Dinas Polri tidak boleh sama dengan Username!"}):X.message.email_polri&&(0,t.jsx)("small",{className:"bdb-error",children:X.message.email_polri})]}),`;

if (!content.includes(oldProfEmailPolri)) {
  console.error('oldProfEmailPolri not found in clean_live_3def');
  process.exit(1);
}
content = content.replace(oldProfEmailPolri, newProfEmailPolri);

const oldProfUsername = `(0,t.jsxs)(F,{id:"fld-3def3ti6rk0vr-41",name:"field_3def3ti6rk0vr_41",label:"Username",hint:"alternatif login selain email dinas Polri",children:[(0,t.jsx)(p.default,{id:"profile-form-username",name:"username",autoComplete:"username",value:Z.username,onChange:e=>{G(t=>({...t,username:e})),X.onChangeDebounced("username",e)},onBlur:e=>X.onBlurNow("username",e),status:X.status.username,placeholder:"Contoh: omeko11"}),X.message.username&&(0,t.jsx)("small",{className:"bdb-error",children:X.message.username})]}),`;

const newProfUsername = `(0,t.jsxs)(F,{id:"fld-3def3ti6rk0vr-41",name:"field_3def3ti6rk0vr_41",label:"Username",hint:"alternatif login selain email dinas Polri",children:[(0,t.jsx)(p.default,{id:"profile-form-username",name:"username",autoComplete:"username",value:Z.username,onChange:e=>{G(t=>({...t,username:e})),X.onChangeDebounced("username",e)},onBlur:e=>X.onBlurNow("username",e),status:(Z.username&&Z.email_polri&&Z.username.trim().toLowerCase()===Z.email_polri.trim().toLowerCase())?"error":X.status.username,placeholder:"Contoh: omeko11"}),(Z.username&&Z.email_polri&&Z.username.trim().toLowerCase()===Z.email_polri.trim().toLowerCase())?(0,t.jsx)("small",{className:"bdb-error",style:{color:"#ef4444",fontWeight:600},children:"Username tidak boleh sama dengan Email Dinas Polri!"}):X.message.username&&(0,t.jsx)("small",{className:"bdb-error",children:X.message.username})]}),`;

if (!content.includes(oldProfUsername)) {
  console.error('oldProfUsername not found in clean_live_3def');
  process.exit(1);
}
content = content.replace(oldProfUsername, newProfUsername);
console.log('Step 7: Direct two-way validation on profile modal fields');

// 8. Profile submit validation in eA:
const eaTarget = `if(!Z.name.trim())return void e.current?.show({severity:"warn",summary:"Lengkapi",detail:"Nama wajib diisi."});`;
const eaAdd = `let uName=(Z.username||"").trim().toLowerCase();if(uName&&polriMail&&uName===polriMail)return void e.current?.show({severity:"warn",summary:"Periksa lagi",detail:"Username dan Email Dinas Polri tidak boleh sama. Silakan ubah salah satunya."});if(!Z.name.trim())return void e.current?.show({severity:"warn",summary:"Lengkapi",detail:"Nama wajib diisi."});`;

if (!content.includes(eaTarget)) {
  console.error('eaTarget not found in clean_live_3def');
  process.exit(1);
}
content = content.replace(eaTarget, eaAdd);
console.log('Step 8: Profile submit validation in eA');

// Validate syntax
new vm.Script(content);
console.log('SYNTAX IS 100% VALID!');

fs.writeFileSync('3def3ti6rk0vr.patched.js', content, 'utf8');
console.log('3def3ti6rk0vr.patched.js successfully generated with ZERO errors!');
