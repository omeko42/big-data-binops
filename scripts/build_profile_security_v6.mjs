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

// 1. Expand States
const oldStates = '[eOtpSentTo,setOtpSentTo]=(0,n.useState)(""),[eDisableModal,setDisableModal]=(0,n.useState)(!1),';
const newStates = '[eOtpSentTo,setOtpSentTo]=(0,n.useState)(""),[eTotpStep,setTotpStep]=(0,n.useState)(1),[eShowPassword,setShowPassword]=(0,n.useState)(!1),[eDisableModal,setDisableModal]=(0,n.useState)(!1),';

if (code.includes(oldStates)) {
  code = code.replace(oldStates, newStates);
  check(1);
} else {
  console.log('Step 1 already applied or target not found');
}

// 2. Replace startTotpSetup and sendSecurityOtp
const oldFuncsStart = 'async function startTotpSetup(tEmail){';
const oldFuncsEnd = 'function ez(t,targetEmail){return openSecurityModal(t);}';

const sIdx = code.indexOf(oldFuncsStart);
const eIdx = code.indexOf(oldFuncsEnd);

if (sIdx === -1 || eIdx === -1) {
  console.error('Functions target not found:', { sIdx, eIdx });
  process.exit(1);
}

const newFuncs = `function startTotpSetup(){
setTotpData(null);setTotpInputCode("");setTotpError("");setExistingPassword("");setTotpStep(1);setTotpModal(!0);
}
async function fetchTotpSetup(){
if(!eExistingPassword){setTotpError("Silakan masukkan password akun Anda terlebih dahulu.");return;}
setTotpLoading(!0);setTotpError("");
try{
let res=await c.apiAuth.post("/Authentication/profile/security/totp/setup",{mode:"setup",password:eExistingPassword});
(0,c.assertOk)(res);
let d=res.data?.data||res.data;
setTotpData(d);setTotpInputCode("");setTotpStep(2);
}catch(err){
let msg=err.response?.data?.errors?.password?.[0]||err.response?.data?.message||"Password akun salah. Silakan periksa kembali password Anda.";
setTotpError(msg);
}finally{setTotpLoading(!1);}}
async function confirmTotpActivation(){
if(!eTotpInputCode||eTotpInputCode.length<6)return void setTotpError("Masukkan 6 digit kode dari aplikasi Google Authenticator.");
setTotpLoading(!0);setTotpError("");
try{
let payload={enabled:!0,setup_id:eTotpData?.setup_id,totp_token:eTotpInputCode.trim()};
(0,c.assertOk)(await c.apiAuth.patch("/Authentication/profile/security/totp",payload));
e.current?.show({severity:"success",summary:"Berhasil",detail:"Google Authenticator (TOTP) berhasil diaktifkan!"});
setTotpModal(!1);await eT();
}catch(err){
let msg=err.response?.data?.errors?.totp_token?.[0]||err.response?.data?.message||"Kode authenticator tidak valid.";
setTotpError(msg);
}finally{setTotpLoading(!1);}}
function promptDisable(target){
setDisableTarget(target);setDisableCode("");setDisableError("");setDisableModal(!0);
}
function renderSwitch(act,onClk,ld,dis,hint){
return(0,t.jsx)("div",{role:"switch","aria-checked":act,onClick:(ld||dis)?void 0:onClk,style:{width:"2.75rem",height:"1.5rem",borderRadius:"999px",background:dis?"rgba(255,255,255,0.08)":act?"#16a34a":"rgba(255,255,255,0.22)",opacity:dis?0.4:1,padding:"2px",cursor:dis?"not-allowed":ld?"wait":"pointer",transition:"all 0.2s ease",display:"inline-flex",alignItems:"center",boxShadow:"inset 0 1px 3px rgba(0,0,0,0.3)",flexShrink:0},title:dis?(hint||"Maksimal 2 metode aktif"):act?"Aktif (klik untuk menonaktifkan)":"Nonaktif (klik untuk mengaktifkan)",children:(0,t.jsx)("div",{style:{width:"1.25rem",height:"1.25rem",borderRadius:"999px",background:dis?"#94a3b8":"#fff",transform:act?"translateX(1.25rem)":"translateX(0)",transition:"transform 0.2s ease",boxShadow:"0 1px 4px rgba(0,0,0,0.35)",display:"flex",alignItems:"center",justifyContent:"center"},children:ld?(0,t.jsx)("i",{className:"pi pi-spin pi-spinner",style:{fontSize:"0.65rem",color:"#16a34a"}}):null})});}
function openSecurityModal(action){
if(action==="enable_totp")return startTotpSetup();
en(action);er("");el("");es("");ec("");ev("");setExistingPassword("");setOtpStep(1);setOtpSentTo("");ee(!0);
}
async function sendSecurityOtp(targetChoice){
let choice=targetChoice||eEmailChoice||"dinas";
if(!eExistingPassword){ev("Silakan masukkan password akun Anda terlebih dahulu.");return;}
if(["enable_pin","change_pin"].includes(et)){
if(!eo||eo.length<6){ev("PIN minimal 6 digit angka.");return;}
if(eo!==eu){ev("Konfirmasi PIN belum sama.");return;}
}
if(eOtpAttempts>=3){e.current?.show({severity:"error",summary:"Batas Percobaan",detail:"Batas pengiriman OTP tercapai (maksimal 3 kali). Silakan coba lagi nanti."});return;}
if(eOtpCooldown>0){e.current?.show({severity:"warn",summary:"Harap Menunggu",detail:\`Tunggu \${eOtpCooldown} detik sebelum meminta kode OTP kembali.\`});return;}
eh(!0);ev("");
try{
let res=await c.apiAuth.post("/Authentication/profile/security/otp",{action:et,target_email:choice,password:eExistingPassword});
(0,c.assertOk)(res);
let d=res.data?.data||res.data;
setOtpAttempts(prev=>prev+1);setOtpCooldown(60);
er(d?.otp_id||"");setEmailChoice(choice);
let sentTarget=d?.sent_to||("sekunder"===choice?a.email:(a.email_polri||a.email));
setOtpSentTo(sentTarget);
setOtpStep(2);
e.current?.show({severity:"info",summary:"Kode OTP Terkirim",detail:"Kode verifikasi 6-digit dikirim ke "+(d?.sent_to_masked||sentTarget)});
}catch(err){
let msg=err.response?.data?.errors?.password?.[0]||err.response?.data?.errors?.otp?.[0]||err.response?.data?.message||"Gagal mengirim kode verifikasi.";
ev(msg);e.current?.show({severity:"error",summary:"Gagal",detail:msg});
}finally{eh(!1);}
return;
}
`;

code = code.substring(0, sIdx) + newFuncs + code.substring(eIdx);
check(2);

// 3. Replace TOTP Dialog
const oldTotpDialogStart = code.indexOf('(0,t.jsx)(r.Dialog,{header:"Setup Google Authenticator (TOTP)"');
const oldTotpDialogEnd = code.indexOf('(0,t.jsx)(r.Dialog,{header:"Konfirmasi Nonaktifkan Metode Keamanan"');

if (oldTotpDialogStart === -1 || oldTotpDialogEnd === -1) {
  console.error('TOTP Dialog boundaries not found:', { oldTotpDialogStart, oldTotpDialogEnd });
  process.exit(1);
}

const newTotpDialog = `(0,t.jsx)(r.Dialog,{header:1===eTotpStep?"Setup Google Authenticator (TOTP) - Verifikasi":"Setup Google Authenticator (TOTP) - Pindai QR",visible:eTotpModal,onHide:()=>setTotpModal(!1),style:{width:"28rem",maxWidth:"95vw"},modal:!0,footer:1===eTotpStep?(0,t.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%"},children:[(0,t.jsx)(o.Button,{label:"Batal",text:!0,disabled:eTotpLoading,onClick:()=>setTotpModal(!1)}),(0,t.jsx)(o.Button,{label:"Lanjut: Tampilkan QR",icon:"pi pi-arrow-right",iconPos:"right",loading:eTotpLoading,onClick:fetchTotpSetup})]}):(0,t.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%"},children:[(0,t.jsx)(o.Button,{label:"Kembali",icon:"pi pi-arrow-left",text:!0,disabled:eTotpLoading,onClick:()=>setTotpStep(1)}),(0,t.jsx)(o.Button,{label:"Verifikasi & Aktifkan TOTP",icon:"pi pi-check",loading:eTotpLoading,onClick:confirmTotpActivation})]}),children:1===eTotpStep?(0,t.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"1rem",padding:"0.5rem 0"},children:[(0,t.jsxs)("div",{style:{background:"rgba(56,189,248,0.08)",border:"1px solid rgba(56,189,248,0.2)",borderRadius:8,padding:"0.65rem 0.8rem",display:"flex",gap:"0.6rem",alignItems:"flex-start"},children:[(0,t.jsx)("i",{className:"pi pi-shield",style:{color:"#38bdf8",fontSize:"1.1rem",marginTop:"0.15rem"}}),(0,t.jsxs)("div",{children:[(0,t.jsx)("div",{style:{fontWeight:700,fontSize:"0.82rem",color:"#38bdf8"},children:"Konfirmasi Keamanan"}),(0,t.jsx)("div",{style:{fontSize:"0.75rem",color:"#cbd5e1",marginTop:"0.15rem"},children:"Masukkan password akun Anda saat ini untuk mengonfirmasi kepemilikan akun sebelum mengaktifkan Google Authenticator."})]})]}),(0,t.jsxs)("div",{style:{display:"grid",gap:"0.35rem"},children:[(0,t.jsx)("label",{style:{fontSize:"0.78rem",fontWeight:700,color:"#e2e8f0"},children:"Password Akun Saat Ini:"}),(0,t.jsxs)("div",{style:{position:"relative",display:"flex",alignItems:"center"},children:[(0,t.jsx)(i.InputText,{type:eShowPassword?"text":"password",placeholder:"Masukkan password akun Anda",value:eExistingPassword,onChange:ev=>{setExistingPassword(ev.target.value);setTotpError("");},onKeyDown:ev=>{if(ev.key==="Enter")fetchTotpSetup();},style:{width:"100%",fontSize:"0.88rem",paddingRight:"2.5rem"}}),(0,t.jsx)("i",{className:eShowPassword?"pi pi-eye-slash":"pi pi-eye",style:{position:"absolute",right:"0.75rem",color:"#94a3b8",cursor:"pointer",fontSize:"0.95rem"},onClick:()=>setShowPassword(!eShowPassword)})]}),eTotpError&&(0,t.jsx)("small",{style:{color:"#ef4444",fontSize:"0.74rem",fontWeight:600},children:eTotpError})]})]}):(0,t.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.75rem",padding:"0.5rem 0"},children:[(0,t.jsx)("p",{style:{fontSize:"0.8rem",color:"#94a3b8",margin:0},children:"Buka aplikasi Google Authenticator, Microsoft Authenticator, atau FreeOTP di ponsel Anda, lalu pindai kode QR di bawah ini:"}),eTotpData?.totp_image&&(0,t.jsx)("div",{style:{display:"flex",justifyContent:"center",padding:"0.75rem",background:"#fff",borderRadius:"10px",width:"fit-content",margin:"0 auto",boxShadow:"0 2px 8px rgba(0,0,0,0.15)"},children:(0,t.jsx)("img",{src:eTotpData.totp_image,alt:"QR Code TOTP",style:{width:"160px",height:"160px",display:"block"}})}),eTotpData?.secret&&(0,t.jsxs)("div",{style:{background:"rgba(255,255,255,0.05)",padding:"0.5rem 0.75rem",borderRadius:"6px",display:"flex",alignItems:"center",justifyContent:"space-between"},children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("span",{style:{display:"block",fontSize:"0.68rem",color:"#64748b"},children:"Kunci Rahasia Manual:"}),(0,t.jsx)("span",{style:{fontFamily:"monospace",fontSize:"0.85rem",fontWeight:700,color:"#38bdf8",letterSpacing:"1px"},children:eTotpData.secret})]}),(0,t.jsx)(o.Button,{type:"button",icon:"pi pi-copy",className:"p-button-text p-button-sm",tooltip:"Salin Kunci",onClick:()=>{if(navigator.clipboard)navigator.clipboard.writeText(eTotpData.secret);e.current?.show({severity:"info",summary:"Disalin",detail:"Kunci rahasia berhasil disalin."});}})]}),(0,t.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.35rem"},children:[(0,t.jsx)("label",{style:{fontSize:"0.78rem",fontWeight:700,color:"#e2e8f0"},children:"Kode Authenticator (6 Digit dari Ponsel):"}),(0,t.jsx)(i.InputText,{placeholder:"000000",value:eTotpInputCode,onChange:ev=>setTotpInputCode(ev.target.value.replace(/\\D/g,"").slice(0,6)),onKeyDown:ev=>{if(ev.key==="Enter"&&eTotpInputCode.length===6)confirmTotpActivation();},style:{width:"100%",fontSize:"1.2rem",letterSpacing:"5px",textAlign:"center",fontWeight:700,fontFamily:"monospace"},maxLength:6}),eTotpError&&(0,t.jsx)("small",{style:{color:"#ef4444",fontSize:"0.74rem",fontWeight:600},children:eTotpError})]})]})}),`;

code = code.substring(0, oldTotpDialogStart) + newTotpDialog + code.substring(oldTotpDialogEnd);
check(3);

fs.writeFileSync('3def3ti6rk0vr.patched.js', code, 'utf8');
console.log('3def3ti6rk0vr.patched.js successfully updated and verified!');
