import fs from 'fs';
import vm from 'vm';

let code = fs.readFileSync('3def3ti6rk0vr.patched.js', 'utf8');

function check(step) {
  try {
    new vm.Script(code);
    console.log(`Step ${step}: VALID`);
  } catch (err) {
    console.error(`Step ${step} FAILED:`, err.message);
    process.exit(1);
  }
}

// 1. Replace TOTP states with expanded 2FA states
const oldStates = '[ePhotoLoading,setPhotoLoading]=(0,n.useState)(!1),[eTotpModal,setTotpModal]=(0,n.useState)(!1),[eTotpData,setTotpData]=(0,n.useState)(null),[eTotpInputCode,setTotpInputCode]=(0,n.useState)(""),[eTotpEmailOtp,setTotpEmailOtp]=(0,n.useState)(""),[eTotpLoading,setTotpLoading]=(0,n.useState)(!1),[eTotpError,setTotpError]=(0,n.useState)(""),';
const newStates = '[ePhotoLoading,setPhotoLoading]=(0,n.useState)(!1),[eTotpModal,setTotpModal]=(0,n.useState)(!1),[eTotpData,setTotpData]=(0,n.useState)(null),[eTotpInputCode,setTotpInputCode]=(0,n.useState)(""),[eTotpEmailOtp,setTotpEmailOtp]=(0,n.useState)(""),[eTotpLoading,setTotpLoading]=(0,n.useState)(!1),[eTotpError,setTotpError]=(0,n.useState)(""),[eEmailChoice,setEmailChoice]=(0,n.useState)("dinas"),[eExistingPassword,setExistingPassword]=(0,n.useState)(""),[eDisableModal,setDisableModal]=(0,n.useState)(!1),[eDisableTarget,setDisableTarget]=(0,n.useState)(""),[eDisableCode,setDisableCode]=(0,n.useState)(""),[eDisableLoading,setDisableLoading]=(0,n.useState)(!1),[eDisableError,setDisableError]=(0,n.useState)(""),';

code = code.replace(oldStates, newStates);
check(1);

// 2. Replace startTotpSetup, renderSwitch, and ez(t)
const oldStartTotp = 'async function startTotpSetup(){setTotpLoading(!0);setTotpError("");try{let res=await c.apiAuth.post("/Authentication/profile/security/totp-setup",{mode:"setup"});(0,c.assertOk)(res);let d=res.data?.data||res.data;setTotpData(d);setTotpInputCode("");setTotpEmailOtp("");setTotpModal(!0);e.current?.show({severity:"info",summary:"Kode OTP Terkirim",detail:"Kode verifikasi telah dikirim ke Email Dinas Polri Anda."})}catch(err){e.current?.show({severity:"error",summary:"Gagal",detail:err.response?.data?.message||"Gagal memulai setup Authenticator."})}finally{setTotpLoading(!1)}}function renderSwitch(act,onClk,ld){return(0,t.jsx)("div",{role:"switch","aria-checked":act,onClick:ld?void 0:onClk,style:{width:"2.75rem",height:"1.5rem",borderRadius:"999px",background:act?"#16a34a":"rgba(255,255,255,0.22)",padding:"2px",cursor:ld?"wait":"pointer",transition:"all 0.2s ease",display:"inline-flex",alignItems:"center",boxShadow:"inset 0 1px 3px rgba(0,0,0,0.3)",flexShrink:0},title:act?"Aktif (klik untuk menonaktifkan)":"Nonaktif (klik untuk mengaktifkan)",children:(0,t.jsx)("div",{style:{width:"1.25rem",height:"1.25rem",borderRadius:"999px",background:"#fff",transform:act?"translateX(1.25rem)":"translateX(0)",transition:"transform 0.2s ease",boxShadow:"0 1px 4px rgba(0,0,0,0.35)",display:"flex",alignItems:"center",justifyContent:"center"},children:ld?(0,t.jsx)("i",{className:"pi pi-spin pi-spinner",style:{fontSize:"0.65rem",color:"#16a34a"}}):null})})}async function ez(t){if("enable_totp"===t)return startTotpSetup();let n="disable_totp"===t?"Nonaktifkan Google Authenticator (TOTP)? Kode verifikasi akan dikirim ke email Anda.":"disable_email_otp"===t?"Nonaktifkan OTP email saat login? Kode verifikasi akan dikirim ke email Anda.":';

const newStartTotp = `async function startTotpSetup(tEmail){
let choice=tEmail||eEmailChoice||"dinas";
setTotpLoading(!0);setTotpError("");
try{
let res=await c.apiAuth.post("/Authentication/profile/security/totp/setup",{mode:"setup",target_email:choice});
(0,c.assertOk)(res);
let d=res.data?.data||res.data;
setTotpData(d);setTotpInputCode("");setTotpEmailOtp("");setExistingPassword("");setTotpModal(!0);
e.current?.show({severity:"info",summary:"Kode OTP Terkirim",detail:"Kode verifikasi telah dikirim ke "+(d?.sent_to_masked||"Email Dinas Polri Anda.")});
}catch(err){
e.current?.show({severity:"error",summary:"Gagal",detail:err.response?.data?.message||"Gagal memulai setup Authenticator."});
}finally{setTotpLoading(!1);}}
function promptDisable(target){
setDisableTarget(target);setDisableCode("");setDisableError("");setDisableModal(!0);
}
function renderSwitch(act,onClk,ld,dis,hint){
return(0,t.jsx)("div",{role:"switch","aria-checked":act,onClick:(ld||dis)?void 0:onClk,style:{width:"2.75rem",height:"1.5rem",borderRadius:"999px",background:dis?"rgba(255,255,255,0.08)":act?"#16a34a":"rgba(255,255,255,0.22)",opacity:dis?0.4:1,padding:"2px",cursor:dis?"not-allowed":ld?"wait":"pointer",transition:"all 0.2s ease",display:"inline-flex",alignItems:"center",boxShadow:"inset 0 1px 3px rgba(0,0,0,0.3)",flexShrink:0},title:dis?(hint||"Maksimal 2 metode aktif"):act?"Aktif (klik untuk menonaktifkan)":"Nonaktif (klik untuk mengaktifkan)",children:(0,t.jsx)("div",{style:{width:"1.25rem",height:"1.25rem",borderRadius:"999px",background:dis?"#94a3b8":"#fff",transform:act?"translateX(1.25rem)":"translateX(0)",transition:"transform 0.2s ease",boxShadow:"0 1px 4px rgba(0,0,0,0.35)",display:"flex",alignItems:"center",justifyContent:"center"},children:ld?(0,t.jsx)("i",{className:"pi pi-spin pi-spinner",style:"0.65rem",color:"#16a34a"}):null})});}
async function ez(t,targetEmail){
if("enable_totp"===t)return startTotpSetup(targetEmail);
let choice=targetEmail||eEmailChoice||"dinas";
eh(!0);
try{
let res=await c.apiAuth.post("/Authentication/profile/security/otp",{action:t,target_email:choice});
(0,c.assertOk)(res);
let d=res.data?.data||res.data;
er(d?.otp_id||"");en(t);el("");es("");ec("");ev("");setExistingPassword("");ee(!0);
e.current?.show({severity:"info",summary:"Kode OTP Terkirim",detail:"Kode verifikasi dikirim ke "+(d?.sent_to_masked||"Email Dinas Polri Anda.")});
}catch(err){
e.current?.show({severity:"error",summary:"Gagal",detail:err.response?.data?.message||"Gagal mengirim kode verifikasi."});
}finally{eh(!1);}
return;
}
async function ez_legacy(t){
let n="disable_email_otp"===t?"Nonaktifkan OTP email saat login? Kode verifikasi akan dikirim ke email Anda.":`;

code = code.replace(oldStartTotp, newStartTotp);
check(2);

// 3. Update eM()
const oldEm = 'if("enable_email_otp"===et||"disable_email_otp"===et){let t="enable_email_otp"===et;ef(!0),ev("");try{let n={enabled:t,action:et,otp_id:ea,otp_token:ei};(0,c.assertOk)(await c.apiAuth.patch("/Authentication/profile/security/email-o';
const newEm = `if("enable_email_otp"===et||"disable_email_otp"===et){let t="enable_email_otp"===et;ef(!0),ev("");try{let n={enabled:t,action:et,otp_id:ea,otp_token:ei,password:eExistingPassword,apply_global:!0};(0,c.assertOk)(await c.apiAuth.patch("/Authentication/profile/security/email-otp",n));e.current?.show({severity:"success",summary:"Berhasil",detail:t?"OTP Email Login berhasil diaktifkan.":"OTP Email Login dinonaktifkan."});ee(!1);await eT()}catch(t){let err=t.response?.data?.errors;ev(err&&Object.values(err)[0]?.[0]||t.response?.data?.message||"Gagal memperbarui pengaturan OTP.")}finally{ef(!1)}return}
if("enable_pin"===et||"change_pin"===et){if(eo.length<6)return void ev("PIN minimal 6 digit angka.");if(eo!==eu)return void ev("Konfirmasi PIN belum sesuai.");ef(!0),ev("");try{let payload={enabled:!0,action:et,otp_id:ea,otp_token:ei,pin:eo,pin_confirmation:eu,password:eExistingPassword};(0,c.assertOk)(await c.apiAuth.patch("/Authentication/profile/security/pin",payload));e.current?.show({severity:"success",summary:"Berhasil",detail:"PIN keamanan berhasil disimpan."});ee(!1);await eT()}catch(t){let err=t.response?.data?.errors;ev(err&&Object.values(err)[0]?.[0]||t.response?.data?.message||"Kode OTP salah atau kedaluwarsa.")}finally{ef(!1)}return}
if("enable_email_otp_legacy"===et){let t="enable_email_otp"===et;ef(!0),ev("");try{let n={enabled:t,action:et,otp_id:ea,otp_token:ei};(0,c.assertOk)(await c.apiAuth.patch("/Authentication/profile/security/email-o`;

code = code.replace(oldEm, newEm);
check(3);

// 4. Update the Security Card Section with proper closing
const oldSecCard = code.substring(
    code.indexOf('(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.4rem",marginTop:"1.1rem",marginBottom:"0.5rem"'),
    code.indexOf('Siap Didaftarkan"})]})})') + 'Siap Didaftarkan"})]})})'.length
);

const newSecCard = `(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.4rem",marginTop:"1.1rem",marginBottom:"0.5rem",paddingBottom:"0.35rem",borderBottom:"1px solid rgba(255,255,255,0.08)"},children:[(0,t.jsx)(O.ShieldCheck,{size:14,style:{color:"#38bdf8"}}),(0,t.jsx)("span",{style:{fontSize:"0.76rem",fontWeight:700,color:"#e2e8f0",letterSpacing:"0.5px",textTransform:"uppercase"},children:"Otentikasi Dua Langkah (2FA)"}),(0,t.jsx)("span",{style:{fontSize:"0.65rem",color:([a.email_otp_required,a.pin_required,a.totp_enabled].filter(Boolean).length>=2)?"#f59e0b":"#94a3b8",marginLeft:"auto"},children:([a.email_otp_required,a.pin_required,a.totp_enabled].filter(Boolean).length>=2)?"Maksimal 2 aktif":"Pilih maksimal 2 metode aktif"})]}),(0,t.jsx)(V,{id:"fld-3def3ti6rk0vr-16",name:"field_3def3ti6rk0vr_16",icon:(0,t.jsx)(x.Mail,{size:15}),label:"1. OTP Email Kedinasan",hint:"Kode 6-digit dikirim ke email dinas saat login (Superadmin & Personal)",active:!!a.email_otp_required,action:(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.6rem"},children:[renderSwitch(!!a.email_otp_required,()=>a.email_otp_required?promptDisable("email_otp"):ez("enable_email_otp"),ey,!a.email_otp_required&&([a.email_otp_required,a.pin_required,a.totp_enabled].filter(Boolean).length>=2),"Maksimal 2 metode keamanan aktif"),a.email_otp_required?(0,t.jsx)(o.Button,{text:!0,size:"small",onClick:()=>promptDisable("email_otp"),loading:ey,style:{fontSize:"0.72rem",fontWeight:700,color:"#dc2626",padding:"0.2rem 0.4rem"},children:"Nonaktifkan"}):(0,t.jsx)(o.Button,{text:!0,size:"small",onClick:()=>ez("enable_email_otp"),disabled:([a.email_otp_required,a.pin_required,a.totp_enabled].filter(Boolean).length>=2),loading:ey,style:{fontSize:"0.72rem",fontWeight:700,color:([a.email_otp_required,a.pin_required,a.totp_enabled].filter(Boolean).length>=2)?"#64748b":"#16a34a",padding:"0.2rem 0.4rem"},children:"Aktifkan"})]})}),(0,t.jsx)(V,{id:"fld-3def3ti6rk0vr-17",name:"field_3def3ti6rk0vr_17",icon:(0,t.jsx)(S.Hash,{size:15}),label:"2. PIN Keamanan (6 Digit)",hint:"PIN sekunder untuk akses kedinasan",active:!!a.pin_required,action:(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[renderSwitch(!!a.pin_required,()=>a.pin_required?promptDisable("pin"):ez("enable_pin"),ey,!a.pin_required&&([a.email_otp_required,a.pin_required,a.totp_enabled].filter(Boolean).length>=2),"Maksimal 2 metode keamanan aktif"),a.pin_required?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(o.Button,{text:!0,size:"small",onClick:()=>ez("change_pin"),loading:ey,style:{fontSize:"0.72rem",fontWeight:700,padding:"0.2rem 0.4rem"},children:"Ubah"}),(0,t.jsx)(o.Button,{text:!0,size:"small",onClick:()=>promptDisable("pin"),loading:ey,style:{fontSize:"0.72rem",fontWeight:700,color:"#dc2626",padding:"0.2rem 0.4rem"},children:"Nonaktifkan"})]}):(0,t.jsx)(o.Button,{text:!0,size:"small",onClick:()=>ez("enable_pin"),disabled:([a.email_otp_required,a.pin_required,a.totp_enabled].filter(Boolean).length>=2),loading:ey,style:{fontSize:"0.72rem",fontWeight:700,color:([a.email_otp_required,a.pin_required,a.totp_enabled].filter(Boolean).length>=2)?"#64748b":"#16a34a",padding:"0.2rem 0.4rem"},children:"Aktifkan"})]})}),(0,t.jsx)(V,{id:"fld-3def3ti6rk0vr-totp",name:"field_3def3ti6rk0vr_totp",icon:(0,t.jsx)(O.ShieldCheck,{size:15}),label:"3. Google Authenticator (TOTP)",hint:"Aplikasi di ponsel (Google/MS Authenticator)",active:!!a.totp_enabled,action:(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.6rem"},children:[renderSwitch(!!a.totp_enabled,()=>a.totp_enabled?promptDisable("totp"):startTotpSetup(),eTotpLoading,!a.totp_enabled&&([a.email_otp_required,a.pin_required,a.totp_enabled].filter(Boolean).length>=2),"Maksimal 2 metode keamanan aktif"),a.totp_enabled?(0,t.jsx)(o.Button,{text:!0,size:"small",onClick:()=>promptDisable("totp"),loading:ey,style:{fontSize:"0.72rem",fontWeight:700,color:"#dc2626",padding:"0.2rem 0.4rem"},children:"Nonaktifkan"}):(0,t.jsx)(o.Button,{text:!0,size:"small",onClick:()=>startTotpSetup(),disabled:([a.email_otp_required,a.pin_required,a.totp_enabled].filter(Boolean).length>=2),loading:eTotpLoading,style:{fontSize:"0.72rem",fontWeight:700,color:([a.email_otp_required,a.pin_required,a.totp_enabled].filter(Boolean).length>=2)?"#64748b":"#16a34a",padding:"0.2rem 0.4rem"},children:"Aktifkan"})]})}),(0,t.jsx)(V,{id:"fld-3def3ti6rk0vr-biometric",name:"field_3def3ti6rk0vr_biometric",icon:(0,t.jsx)(w.KeyRound,{size:15}),label:"4. Biometrik Perangkat (Passkey)",hint:"Windows Hello / Touch ID / Face ID",active:!1,last:!0,action:(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[renderSwitch(!1,void 0,!1,!0,"Siap Didaftarkan"),(0,t.jsx)(o.Button,{text:!0,size:"small",disabled:!0,style:{fontSize:"0.72rem",color:"#94a3b8",padding:"0.2rem 0.4rem"},children:"Siap Didaftarkan"})]})})`;

code = code.replace(oldSecCard, newSecCard);
check(4);

// 5. Append Disable Modal Dialog right before the satker dialog
const disableModalJSX = `,(0,t.jsx)(r.Dialog,{header:"Konfirmasi Nonaktifkan Metode Keamanan",visible:eDisableModal,onHide:()=>setDisableModal(!1),style:{width:"27rem",maxWidth:"95vw"},modal:!0,footer:(0,t.jsxs)("div",{style:{display:"flex",justifyContent:"flex-end",gap:"0.5rem"},children:[(0,t.jsx)(o.Button,{label:"Batal",text:!0,disabled:eDisableLoading,onClick:()=>setDisableModal(!1)}),(0,t.jsx)(o.Button,{label:"Konfirmasi & Nonaktifkan",severity:"danger",loading:eDisableLoading,onClick:async function(){
if(!eDisableCode||eDisableCode.length<6)return void setDisableError("Masukkan 6 digit kode verifikasi.");
setDisableLoading(!0);setDisableError("");
try{
if("totp"===eDisableTarget){
let payload={enabled:!1,totp_token:eDisableCode.trim(),pin:eDisableCode.trim()};
(0,c.assertOk)(await c.apiAuth.patch("/Authentication/profile/security/totp",payload));
}else if("pin"===eDisableTarget){
let payload={enabled:!1,pin:eDisableCode.trim(),totp_token:eDisableCode.trim()};
(0,c.assertOk)(await c.apiAuth.patch("/Authentication/profile/security/pin",payload));
}else if("email_otp"===eDisableTarget){
let payload={enabled:!1,totp_token:eDisableCode.trim(),pin:eDisableCode.trim(),apply_global:!0};
(0,c.assertOk)(await c.apiAuth.patch("/Authentication/profile/security/email-otp",payload));
}
e.current?.show({severity:"success",summary:"Berhasil",detail:"Metode keamanan berhasil dinonaktifkan."});
setDisableModal(!1);await eT();
}catch(err){
let msg=err.response?.data?.errors?.totp_token?.[0]||err.response?.data?.errors?.pin?.[0]||err.response?.data?.message||"Kode verifikasi salah.";
setDisableError(msg);
}finally{setDisableLoading(!1);}
}})]}),children:(0,t.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.85rem",padding:"0.5rem 0"},children:[(0,t.jsxs)("div",{style:{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.25)",borderRadius:8,padding:"0.65rem 0.8rem",display:"flex",gap:"0.6rem",alignItems:"flex-start"},children:[(0,t.jsx)("i",{className:"pi pi-exclamation-triangle",style:{color:"#ef4444",fontSize:"1.1rem",marginTop:"0.15rem"}}),(0,t.jsxs)("div",{children:[(0,t.jsx)("div",{style:{fontWeight:700,fontSize:"0.82rem",color:"#f87171"},children:"Peringatan Penonaktifan"}),(0,t.jsx)("div",{style:{fontSize:"0.76rem",color:"#cbd5e1",marginTop:"0.15rem"},children:"Apakah Anda yakin ingin menonaktifkan "+("totp"===eDisableTarget?"Google Authenticator (TOTP)":"pin"===eDisableTarget?"PIN Keamanan":"OTP Email Kedinasan")+"? Akun Anda akan kehilangan proteksi keamanan ini."})]})]}),(0,t.jsxs)("div",{style:{textAlign:"center",display:"grid",gap:"0.5rem"},children:[(0,t.jsx)("label",{style:{fontSize:"0.78rem",fontWeight:600,color:"#e2e8f0"},children:"Masukkan 6-Digit Kode Verifikasi ("+("totp"===eDisableTarget?"Google Authenticator / PIN":(a.totp_enabled?"Aplikasi Authenticator":"PIN Keamanan / OTP"))+"):"}),(0,t.jsx)("div",{style:{display:"flex",justifyContent:"center"},children:(0,t.jsx)(l.InputOtp,{value:eDisableCode,onChange:ev=>setDisableCode(String(ev.value??"")),length:6,integerOnly:!0})})]}),eDisableError&&(0,t.jsx)("div",{style:{color:"#f87171",fontSize:"0.75rem",background:"rgba(239,68,68,0.1)",padding:"0.4rem 0.6rem",borderRadius:6,textAlign:"center"},children:eDisableError})]})})`;

const satkerDialog = ',(0,t.jsx)(r.Dialog,{header:"Edit Data Wilayah Satker"';
const sdIdx = code.indexOf(satkerDialog);
if (sdIdx === -1) throw new Error("satkerDialog not found");

code = code.substring(0, sdIdx) + disableModalJSX + code.substring(sdIdx);
check(5);

// 6. Update the PIN / OTP Dialog with correct closing
const oldOtpEmailText = '(0,t.jsxs)("p",{style:{margin:0,fontSize:"0.82rem",color:"#64748b"},children:["Kode 6 digit sudah dikirim ke ",(0,t.jsx)("b",{children:K(a.email)}),"."]}),';
const fixedOtpEmailText = `(0,t.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem",textAlign:"left",background:"rgba(255,255,255,0.04)",padding:"0.6rem 0.8rem",borderRadius:8,border:"1px solid rgba(255,255,255,0.08)"},children:[(0,t.jsxs)("div",{style:{fontSize:"0.75rem",color:"#94a3b8"},children:["Kode OTP dikirim ke: ",(0,t.jsx)("b",{style:{color:"#38bdf8"},children:K("sekunder"===eEmailChoice?a.email:(a.email_polri||a.email))})]}),(0,t.jsxs)("div",{style:{display:"flex",gap:"0.4rem",flexWrap:"wrap"},children:[(0,t.jsxs)("button",{type:"button",onClick:()=>ez(et,"dinas"),style:{padding:"0.2rem 0.5rem",borderRadius:6,fontSize:"0.7rem",cursor:"pointer",border:"dinas"===eEmailChoice?"1px solid #3b82f6":"1px solid rgba(255,255,255,0.15)",background:"dinas"===eEmailChoice?"rgba(59,130,246,0.2)":"transparent",color:"dinas"===eEmailChoice?"#60a5fa":"#94a3b8"},children:["Email Dinas (Utama): ",K(a.email_polri||a.email)]}),a.email&&a.email_polri&&(0,t.jsxs)("button",{type:"button",onClick:()=>ez(et,"sekunder"),style:{padding:"0.2rem 0.5rem",borderRadius:6,fontSize:"0.7rem",cursor:"pointer",border:"sekunder"===eEmailChoice?"1px solid #3b82f6":"1px solid rgba(255,255,255,0.15)",background:"sekunder"===eEmailChoice?"rgba(59,130,246,0.2)":"transparent",color:"sekunder"===eEmailChoice?"#60a5fa":"#94a3b8"},children:["Email Sekunder: ",K(a.email)]})]})]}),(([a.email_otp_required,a.pin_required,a.totp_enabled].filter(Boolean).length===0)&&(0,t.jsxs)("div",{style:{textAlign:"left",display:"grid",gap:"0.3rem"},children:[(0,t.jsx)("label",{style:{fontSize:"0.76rem",fontWeight:600,color:"#e2e8f0"},children:"Password Akun Saat Ini:"}),(0,t.jsx)(i.InputText,{type:"password",placeholder:"Masukkan password Anda",value:eExistingPassword,onChange:ev=>setExistingPassword(ev.target.value),style:{width:"100%",fontSize:"0.85rem"}}),(0,t.jsx)("small",{style:{fontSize:"0.68rem",color:"#94a3b8"},children:"Verifikasi password diperlukan untuk mengaktifkan 2FA pertama kali."})]})),`;

code = code.replace(oldOtpEmailText, fixedOtpEmailText);
check(6);

// 7. TOTP Modal
const oldTotpSecretBox = 'eTotpData?.secret&&(0,t.jsxs)("div",{style:{background:"rgba(255,255,255,0.05)",padding:"0.5rem 0.75rem",borderRadius:"6px",display:"flex",alignItems:"center",justifyContent:"space-between"},children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("span",{style:{display:"block",fontSize:"0.68rem",color:"#64748b"},children:"Kunci Rahasia Manual:"}),(0,t.jsx)("span",{style:{fontFamily:"monospace",fontSize:"0.85rem",fontWeight:700,color:"#38bdf8",letterSpacing:"1px"},children:eTotpData.secret})]}),(0,t.jsx)(o.Button,{type:"button",icon:"pi pi-copy",className:"p-button-text p-button-sm",tooltip:"Salin Kunci",onClick:()=>{if(navigator.clipboard)navigator.clipboard.writeText(eTotpData.secret);e.current?.show({severity:"info",summary:"Disalin",detail:"Kunci rahasia berhasil disalin."})}})]}),';

const newTotpSecretBox = `eTotpData?.secret&&(0,t.jsxs)("div",{style:{background:"rgba(255,255,255,0.05)",padding:"0.5rem 0.75rem",borderRadius:"6px",display:"flex",alignItems:"center",justifyContent:"space-between"},children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("span",{style:{display:"block",fontSize:"0.68rem",color:"#64748b"},children:"Kunci Rahasia Manual:"}),(0,t.jsx)("span",{style:{fontFamily:"monospace",fontSize:"0.85rem",fontWeight:700,color:"#38bdf8",letterSpacing:"1px"},children:eTotpData.secret})]}),(0,t.jsx)(o.Button,{type:"button",icon:"pi pi-copy",className:"p-button-text p-button-sm",tooltip:"Salin Kunci",onClick:()=>{if(navigator.clipboard)navigator.clipboard.writeText(eTotpData.secret);e.current?.show({severity:"info",summary:"Disalin",detail:"Kunci rahasia berhasil disalin."})}})]}),
(0,t.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.4rem",background:"rgba(255,255,255,0.03)",padding:"0.5rem 0.7rem",borderRadius:6,border:"1px solid rgba(255,255,255,0.08)"},children:[(0,t.jsxs)("div",{style:{fontSize:"0.72rem",color:"#94a3b8"},children:["OTP verifikasi dikirim ke: ",(0,t.jsx)("b",{style:{color:"#38bdf8"},children:K("sekunder"===eEmailChoice?a.email:(a.email_polri||a.email))})]}),(0,t.jsxs)("div",{style:{display:"flex",gap:"0.4rem"},children:[(0,t.jsxs)("button",{type:"button",onClick:()=>startTotpSetup("dinas"),style:{padding:"0.2rem 0.45rem",borderRadius:6,fontSize:"0.68rem",cursor:"pointer",border:"dinas"===eEmailChoice?"1px solid #3b82f6":"1px solid rgba(255,255,255,0.15)",background:"dinas"===eEmailChoice?"rgba(59,130,246,0.2)":"transparent",color:"dinas"===eEmailChoice?"#60a5fa":"#94a3b8"},children:["Email Dinas (Utama): ",K(a.email_polri||a.email)]}),a.email&&a.email_polri&&(0,t.jsxs)("button",{type:"button",onClick:()=>startTotpSetup("sekunder"),style:{padding:"0.2rem 0.45rem",borderRadius:6,fontSize:"0.68rem",cursor:"pointer",border:"sekunder"===eEmailChoice?"1px solid #3b82f6":"1px solid rgba(255,255,255,0.15)",background:"sekunder"===eEmailChoice?"rgba(59,130,246,0.2)":"transparent",color:"sekunder"===eEmailChoice?"#60a5fa":"#94a3b8"},children:["Email Sekunder: ",K(a.email)]})]})]}),
(([a.email_otp_required,a.pin_required,a.totp_enabled].filter(Boolean).length===0)&&(0,t.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.3rem"},children:[(0,t.jsx)("label",{style:{fontSize:"0.78rem",fontWeight:600,color:"#e2e8f0"},children:"Password Akun Saat Ini:"}),(0,t.jsx)(i.InputText,{type:"password",placeholder:"Masukkan password akun Anda",value:eExistingPassword,onChange:ev=>setExistingPassword(ev.target.value),style:{width:"100%",fontSize:"0.85rem"}})]})),`;

code = code.replace(oldTotpSecretBox, newTotpSecretBox);
check(7);

// 8.
const oldTotpPayload = 'let payload={enabled:!0,setup_id:eTotpData?.setup_id,totp_token:eTotpInputCode.trim(),otp_id:eTotpData?.otp_id,otp_token:eTotpEmailOtp.trim()};';
const newTotpPayload = 'let payload={enabled:!0,setup_id:eTotpData?.setup_id,totp_token:eTotpInputCode.trim(),otp_id:eTotpData?.otp_id,otp_token:eTotpEmailOtp.trim(),password:eExistingPassword};';

code = code.replace(oldTotpPayload, newTotpPayload);
check(8);

fs.writeFileSync('3def3ti6rk0vr.patched.js', code, 'utf8');
console.log("SUCCESSFULLY BUILT AND SAVED 3def3ti6rk0vr.patched.js (100% VALID)!");
