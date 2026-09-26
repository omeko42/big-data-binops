import fs from 'fs';
import vm from 'vm';

console.log('=== 1. PATCHING FRONTEND (3def3ti6rk0vr.patched.js) ===');
let feCode = fs.readFileSync('3def3ti6rk0vr.patched.js', 'utf8');

// A. Reset cooldown and attempts on open and on success
// Check eM()
const oldEmSuccess = 'e.current?.show({severity:"success",summary:"Berhasil",detail:t?"OTP Email Login berhasil diaktifkan.":"OTP Email Login dinonaktifkan."});ee(!1);await eT()}';
const newEmSuccess = 'setOtpCooldown(0);setOtpAttempts(0);setOtpVerifyFails(0);e.current?.show({severity:"success",summary:"Berhasil",detail:t?"OTP Email Login berhasil diaktifkan.":"OTP Email Login dinonaktifkan."});ee(!1);await eT()}';

if (feCode.includes(oldEmSuccess)) {
  feCode = feCode.replace(oldEmSuccess, newEmSuccess);
  console.log('Reset on eM Email OTP success: APPLIED');
} else {
  console.log('oldEmSuccess not found or already patched');
}

const oldPinSuccess = 'e.current?.show({severity:"success",summary:"Berhasil",detail:"PIN keamanan berhasil disimpan."});ee(!1);await eT()}';
const newPinSuccess = 'setOtpCooldown(0);setOtpAttempts(0);setOtpVerifyFails(0);e.current?.show({severity:"success",summary:"Berhasil",detail:"PIN keamanan berhasil disimpan."});ee(!1);await eT()}';

if (feCode.includes(oldPinSuccess)) {
  feCode = feCode.replace(oldPinSuccess, newPinSuccess);
  console.log('Reset on eM PIN success: APPLIED');
} else {
  console.log('oldPinSuccess not found or already patched');
}

const oldTotpSuccess = 'e.current?.show({severity:"success",summary:"Berhasil",detail:"Google Authenticator (TOTP) berhasil diaktifkan!"});setTotpModal(!1);await eT()}';
const newTotpSuccess = 'setOtpCooldown(0);setOtpAttempts(0);setOtpVerifyFails(0);e.current?.show({severity:"success",summary:"Berhasil",detail:"Google Authenticator (TOTP) berhasil diaktifkan!"});setTotpModal(!1);await eT()}';

if (feCode.includes(oldTotpSuccess)) {
  feCode = feCode.replace(oldTotpSuccess, newTotpSuccess);
  console.log('Reset on TOTP success: APPLIED');
} else {
  console.log('oldTotpSuccess not found or already patched');
}

// B. In openSecurityModal, also reset cooldown and attempts
const oldOpenSec = 'function openSecurityModal(action){\nif(action==="enable_totp")return startTotpSetup();\nen(action);er("");el("");es("");ec("");ev("");setExistingPassword("");setOtpStep(1);setOtpSentTo("");ee(!0);\n}';
const newOpenSec = 'function openSecurityModal(action){\nif(action==="enable_totp")return startTotpSetup();\nsetOtpCooldown(0);setOtpAttempts(0);setOtpVerifyFails(0);\nen(action);er("");el("");es("");ec("");ev("");setExistingPassword("");setOtpStep(1);setOtpSentTo("");ee(!0);\n}';

if (feCode.includes(oldOpenSec)) {
  feCode = feCode.replace(oldOpenSec, newOpenSec);
  console.log('Reset in openSecurityModal: APPLIED');
} else {
  console.log('oldOpenSec not found or already patched');
}

// C. Replace Card Header & 2FA List
let sIdx = feCode.indexOf('(0,t.jsx)("div",{className:"cms-card-label",children:"Keamanan Akun"})');
let eIdx = feCode.indexOf('Siap Didaftarkan"})]})})', sIdx) + 'Siap Didaftarkan"})]})})'.length;

if (sIdx === -1 || eIdx === -1) {
  console.error('Security card boundaries not found');
  process.exit(1);
}

const newCardContent = `(0,t.jsx)("div",{className:"cms-card-label",children:"Keamanan Akun"}),(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.35rem",background:([a.email_otp_required,a.pin_required,a.totp_enabled].filter(Boolean).length>=2)?"rgba(34,197,94,0.12)":([a.email_otp_required,a.pin_required,a.totp_enabled].filter(Boolean).length===1)?"rgba(56,189,248,0.12)":"rgba(245,158,11,0.12)",border:"1px solid "+(([a.email_otp_required,a.pin_required,a.totp_enabled].filter(Boolean).length>=2)?"rgba(34,197,94,0.3)":([a.email_otp_required,a.pin_required,a.totp_enabled].filter(Boolean).length===1)?"rgba(56,189,248,0.3)":"rgba(245,158,11,0.3)"),padding:"0.2rem 0.55rem",borderRadius:"999px"},children:[(0,t.jsx)("span",{style:{display:"inline-block",width:6,height:6,borderRadius:"999px",background:([a.email_otp_required,a.pin_required,a.totp_enabled].filter(Boolean).length>=2)?"#22c55e":([a.email_otp_required,a.pin_required,a.totp_enabled].filter(Boolean).length===1)?"#38bdf8":"#f59e0b"}}),(0,t.jsx)("span",{style:{fontSize:"0.68rem",fontWeight:700,color:([a.email_otp_required,a.pin_required,a.totp_enabled].filter(Boolean).length>=2)?"#4ade80":([a.email_otp_required,a.pin_required,a.totp_enabled].filter(Boolean).length===1)?"#38bdf8":"#fbbf24"},children:([a.email_otp_required,a.pin_required,a.totp_enabled].filter(Boolean).length>=2)?"Keamanan Sangat Kuat":([a.email_otp_required,a.pin_required,a.totp_enabled].filter(Boolean).length===1)?"Keamanan Kuat (1 Metode Aktif)":"Keamanan Standar"})]})]}),(0,t.jsx)(V,{id:"fld-3def3ti6rk0vr-15",name:"field_3def3ti6rk0vr_15",icon:(0,t.jsx)(w.KeyRound,{size:15}),label:"Password",active:!!a.local_password_enabled,action:(0,t.jsx)("a",{href:"/cms/profile/reset-password",style:{fontSize:"0.75rem",fontWeight:700,color:"#16a34a",padding:"0.3rem 0.6rem",textDecoration:"none",display:"inline-flex",alignItems:"center"},children:"Ubah Password"})}),(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.4rem",marginTop:"1.1rem",marginBottom:"0.5rem",paddingBottom:"0.35rem",borderBottom:"1px solid rgba(255,255,255,0.08)"},children:[(0,t.jsx)(O.ShieldCheck,{size:14,style:{color:"#38bdf8"}}),(0,t.jsx)("span",{style:{fontSize:"0.76rem",fontWeight:700,color:"#e2e8f0",letterSpacing:"0.5px",textTransform:"uppercase"},children:"Otentikasi Dua Langkah (2FA)"}),(0,t.jsx)("span",{style:{fontSize:"0.65rem",color:([a.email_otp_required,a.pin_required,a.totp_enabled].filter(Boolean).length>=2)?"#f59e0b":"#94a3b8",marginLeft:"auto"},children:([a.email_otp_required,a.pin_required,a.totp_enabled].filter(Boolean).length>=2)?"Maksimal 2 metode aktif":"Pilih maksimal 2 metode aktif"})]}),(0,t.jsx)(V,{id:"fld-3def3ti6rk0vr-16",name:"field_3def3ti6rk0vr_16",icon:(0,t.jsx)(x.Mail,{size:15}),label:"OTP Email Kedinasan",hint:a.email_otp_required?"Aktif sebagai metode otentikasi verifikasi saat login":"Verifikasi kode OTP 6-digit ke email dinas saat login",active:!!a.email_otp_required,action:(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.6rem"},children:[renderSwitch(!!a.email_otp_required,()=>a.email_otp_required?promptDisable("email_otp"):openSecurityModal("enable_email_otp"),ey,!a.email_otp_required&&([a.email_otp_required,a.pin_required,a.totp_enabled].filter(Boolean).length>=2),"Maksimal 2 metode keamanan aktif"),a.email_otp_required?(0,t.jsx)(o.Button,{text:!0,size:"small",onClick:()=>promptDisable("email_otp"),loading:ey,style:{fontSize:"0.72rem",fontWeight:700,color:"#dc2626",padding:"0.2rem 0.4rem"},children:"Nonaktifkan"}):(0,t.jsx)(o.Button,{text:!0,size:"small",onClick:()=>openSecurityModal("enable_email_otp"),disabled:([a.email_otp_required,a.pin_required,a.totp_enabled].filter(Boolean).length>=2),loading:ey,style:{fontSize:"0.72rem",fontWeight:700,color:([a.email_otp_required,a.pin_required,a.totp_enabled].filter(Boolean).length>=2)?"#64748b":"#16a34a",padding:"0.2rem 0.4rem"},children:"Aktifkan"})]})}),(0,t.jsx)(V,{id:"fld-3def3ti6rk0vr-17",name:"field_3def3ti6rk0vr_17",icon:(0,t.jsx)(S.Hash,{size:15}),label:"PIN Keamanan",hint:a.pin_required?"Aktif sebagai lapisan otorisasi tindakan sensitif & login":"PIN 6-8 digit angka untuk keamanan akses & otorisasi sensitif",active:!!a.pin_required,action:(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[renderSwitch(!!a.pin_required,()=>a.pin_required?promptDisable("pin"):openSecurityModal("enable_pin"),ey,!a.pin_required&&([a.email_otp_required,a.pin_required,a.totp_enabled].filter(Boolean).length>=2),"Maksimal 2 metode keamanan aktif"),a.pin_required?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(o.Button,{text:!0,size:"small",onClick:()=>openSecurityModal("change_pin"),loading:ey,style:{fontSize:"0.72rem",fontWeight:700,padding:"0.2rem 0.4rem"},children:"Ubah"}),(0,t.jsx)(o.Button,{text:!0,size:"small",onClick:()=>promptDisable("pin"),loading:ey,style:{fontSize:"0.72rem",fontWeight:700,color:"#dc2626",padding:"0.2rem 0.4rem"},children:"Nonaktifkan"})]}):(0,t.jsx)(o.Button,{text:!0,size:"small",onClick:()=>openSecurityModal("enable_pin"),disabled:([a.email_otp_required,a.pin_required,a.totp_enabled].filter(Boolean).length>=2),loading:ey,style:{fontSize:"0.72rem",fontWeight:700,color:([a.email_otp_required,a.pin_required,a.totp_enabled].filter(Boolean).length>=2)?"#64748b":"#16a34a",padding:"0.2rem 0.4rem"},children:"Aktifkan"})]})}),(0,t.jsx)(V,{id:"fld-3def3ti6rk0vr-totp",name:"field_3def3ti6rk0vr_totp",icon:(0,t.jsx)(O.ShieldCheck,{size:15}),label:"Google Authenticator (TOTP)",hint:a.totp_enabled?"Aktif sebagai kode verifikasi login instan dari aplikasi (RFC 6238)":"Kode otentikasi 6-digit dari aplikasi ponsel (Google/MS Authenticator)",active:!!a.totp_enabled,action:(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.6rem"},children:[renderSwitch(!!a.totp_enabled,()=>a.totp_enabled?promptDisable("totp"):startTotpSetup(),eTotpLoading,!a.totp_enabled&&([a.email_otp_required,a.pin_required,a.totp_enabled].filter(Boolean).length>=2),"Maksimal 2 metode keamanan aktif"),a.totp_enabled?(0,t.jsx)(o.Button,{text:!0,size:"small",onClick:()=>promptDisable("totp"),loading:ey,style:{fontSize:"0.72rem",fontWeight:700,color:"#dc2626",padding:"0.2rem 0.4rem"},children:"Nonaktifkan"}):(0,t.jsx)(o.Button,{text:!0,size:"small",onClick:()=>startTotpSetup(),disabled:([a.email_otp_required,a.pin_required,a.totp_enabled].filter(Boolean).length>=2),loading:eTotpLoading,style:{fontSize:"0.72rem",fontWeight:700,color:([a.email_otp_required,a.pin_required,a.totp_enabled].filter(Boolean).length>=2)?"#64748b":"#16a34a",padding:"0.2rem 0.4rem"},children:"Aktifkan"})]})}),(0,t.jsx)(V,{id:"fld-3def3ti6rk0vr-biometric",name:"field_3def3ti6rk0vr_biometric",icon:(0,t.jsx)(w.KeyRound,{size:15}),label:"Biometrik Perangkat (Passkey)",hint:"Login cepat menggunakan sidik jari atau pengenalan wajah perangkat",active:!1,last:!0,action:(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[renderSwitch(!1,void 0,!1,!0,"Siap Didaftarkan"),(0,t.jsx)(o.Button,{text:!0,size:"small",disabled:!0,style:{fontSize:"0.72rem",color:"#94a3b8",padding:"0.2rem 0.4rem"},children:"Siap Didaftarkan"})]})})`;

feCode = feCode.substring(0, sIdx) + newCardContent + feCode.substring(eIdx);

try {
  new vm.Script(feCode);
  console.log('Frontend code is 100% syntactically valid!');
  fs.writeFileSync('3def3ti6rk0vr.patched.js', feCode, 'utf8');
  console.log('3def3ti6rk0vr.patched.js saved successfully!');
} catch (err) {
  console.error('Frontend syntax error:', err.message);
  process.exit(1);
}
