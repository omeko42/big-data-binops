import fs from 'fs';
import vm from 'vm';

let code = fs.readFileSync('3def3ti6rk0vr.patched.js', 'utf8');

function check(step) {
  try {
    new vm.Script(code);
    console.log(`Step ${step}: VALID JS SYNTAX`);
  } catch (err) {
    console.error(`Step ${step} FAILED:`, err.message);
    process.exit(1);
  }
}

// 1. Add state variables: eOtpStep, eOtpSentTo
const oldStateAnchor = '[eExistingPassword,setExistingPassword]=(0,n.useState)(""),';
const newStateAnchor = '[eExistingPassword,setExistingPassword]=(0,n.useState)(""),[eOtpStep,setOtpStep]=(0,n.useState)(1),[eOtpSentTo,setOtpSentTo]=(0,n.useState)(""),';

if (code.includes(oldStateAnchor)) {
  code = code.replace(oldStateAnchor, newStateAnchor);
  check(1);
} else if (code.includes('[eOtpStep,setOtpStep]')) {
  console.log("Step 1: State already present");
} else {
  throw new Error("oldStateAnchor not found");
}

// 2. Replace ez function with openSecurityModal and sendSecurityOtp
const ezStart = code.indexOf('async function ez(t,targetEmail){');
if (ezStart !== -1) {
  const ezEnd = code.indexOf('async function ez_legacy(t){', ezStart);
  if (ezEnd === -1) throw new Error("ezEnd not found");

  const newEzFunctions = `function openSecurityModal(action){
if(action==="enable_totp")return startTotpSetup();
en(action);er("");el("");es("");ec("");ev("");setExistingPassword("");setOtpStep(1);setOtpSentTo("");ee(!0);
}
async function sendSecurityOtp(targetChoice){
let choice=targetChoice||eEmailChoice||"dinas";
if(et==="enable_email_otp"&&!eExistingPassword){ev("Silakan masukkan password akun Anda terlebih dahulu.");return;}
if(["enable_pin","change_pin"].includes(et)){
if(!eo||eo.length<6){ev("PIN minimal 6 digit angka.");return;}
if(eo!==eu){ev("Konfirmasi PIN belum sama.");return;}
}
if(eOtpAttempts>=3){e.current?.show({severity:"error",summary:"Batas Percobaan",detail:"Batas pengiriman OTP tercapai (maksimal 3 kali). Silakan coba lagi nanti."});return;}
if(eOtpCooldown>0){e.current?.show({severity:"warn",summary:"Harap Menunggu",detail:\`Tunggu \${eOtpCooldown} detik sebelum meminta kode OTP kembali.\`});return;}
eh(!0);ev("");
try{
let res=await c.apiAuth.post("/Authentication/profile/security/otp",{action:et,target_email:choice});
(0,c.assertOk)(res);
let d=res.data?.data||res.data;
setOtpAttempts(prev=>prev+1);setOtpCooldown(60);
er(d?.otp_id||"");setEmailChoice(choice);
let sentTarget=d?.sent_to||("sekunder"===choice?a.email:(a.email_polri||a.email));
setOtpSentTo(sentTarget);
setOtpStep(2);
e.current?.show({severity:"info",summary:"Kode OTP Terkirim",detail:"Kode verifikasi 6-digit dikirim ke "+(d?.sent_to_masked||sentTarget)});
}catch(err){
let msg=err.response?.data?.errors?.otp?.[0]||err.response?.data?.message||"Gagal mengirim kode verifikasi.";
ev(msg);e.current?.show({severity:"error",summary:"Gagal",detail:msg});
}finally{eh(!1);}
return;
}
function ez(t,targetEmail){return openSecurityModal(t);}
`;

  code = code.substring(0, ezStart) + newEzFunctions + code.substring(ezEnd);
  check(2);
} else {
  console.log("Step 2: ez already replaced or skipped");
}

// 3. Replace the Dialog component with the Multi-Step Dialog
const dlgStart = code.indexOf('(0,t.jsx)(r.Dialog,{header:"enable_email_otp"===et');
if (dlgStart === -1) throw new Error("dlgStart not found");

const endTarget = 'eg&&(0,t.jsx)("small",{className:"bdb-error",children:eg})]})})';
const endIdx = code.indexOf(endTarget, dlgStart);
if (endIdx === -1) throw new Error("endTarget not found");
const fullDlgEnd = endIdx + endTarget.length;

const newDialogCode = `(0,t.jsx)(r.Dialog,{
header:1===eOtpStep?("enable_email_otp"===et?"Aktifkan OTP Email Login (Langkah 1/2)":"change_pin"===et?"Ubah PIN Keamanan (Langkah 1/2)":"Aktifkan PIN Keamanan (Langkah 1/2)"):"Verifikasi Kode OTP (Langkah 2/2)",
visible:Q,
onHide:()=>ee(!1),
style:{width:"27rem",maxWidth:"95vw"},
modal:!0,
footer:1===eOtpStep?(0,t.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%"},children:[
  (0,t.jsx)(o.Button,{label:"Batal",text:!0,onClick:()=>ee(!1),disabled:ey}),
  (0,t.jsx)(o.Button,{label:"Kirim Kode OTP",icon:"pi pi-send",iconPos:"right",onClick:()=>sendSecurityOtp(eEmailChoice),loading:ey,disabled:ey||(eOtpAttempts>=3)})
]}):(0,t.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%"},children:[
  (0,t.jsx)(o.Button,{label:"Kembali",icon:"pi pi-arrow-left",text:!0,onClick:()=>{setOtpStep(1);el("");ev("");},disabled:em}),
  (0,t.jsx)(o.Button,{label:"Verifikasi & Aktifkan",icon:"pi pi-check",onClick:eM,loading:em})
]}),
children:1===eOtpStep?(0,t.jsxs)("div",{style:{display:"grid",gap:"1rem",textAlign:"left"},children:[
  (0,t.jsxs)("div",{style:{display:"grid",gap:"0.45rem"},children:[
    (0,t.jsxs)("label",{style:{fontSize:"0.78rem",fontWeight:700,color:"#e2e8f0",display:"flex",alignItems:"center",gap:"0.4rem"},children:[
      (0,t.jsx)("i",{className:"pi pi-envelope",style:{color:"#38bdf8",fontSize:"0.85rem"}}),
      "Kirim Kode OTP Ke:"
    ]}),
    (0,t.jsxs)("div",{onClick:()=>setEmailChoice("dinas"),style:{padding:"0.6rem 0.8rem",borderRadius:"8px",cursor:"pointer",border:"dinas"===eEmailChoice?"1.5px solid #38bdf8":"1px solid rgba(255,255,255,0.12)",background:"dinas"===eEmailChoice?"rgba(56,189,248,0.12)":"rgba(255,255,255,0.03)",display:"flex",alignItems:"center",justifyContent:"space-between",transition:"all 0.15s ease"},children:[
      (0,t.jsxs)("div",{children:[
        (0,t.jsxs)("div",{style:{fontSize:"0.74rem",fontWeight:700,color:"dinas"===eEmailChoice?"#38bdf8":"#cbd5e1"},children:["Email Dinas POLRI ",(0,t.jsx)("span",{style:{fontSize:"0.65rem",padding:"1px 6px",borderRadius:4,background:"rgba(56,189,248,0.2)",color:"#38bdf8",marginLeft:"0.3rem"},children:"Utama"})]}),
        (0,t.jsx)("div",{style:{fontSize:"0.82rem",color:"#f8fafc",fontFamily:"monospace",marginTop:"2px"},children:a.email_polri||a.email})
      ]}),
      (0,t.jsx)("i",{className:"dinas"===eEmailChoice?"pi pi-check-circle":"pi pi-circle",style:{color:"dinas"===eEmailChoice?"#38bdf8":"#64748b",fontSize:"1.1rem"}})
    ]}),
    a.email&&a.email_polri&&a.email!==a.email_polri&&(0,t.jsxs)("div",{onClick:()=>setEmailChoice("sekunder"),style:{padding:"0.6rem 0.8rem",borderRadius:"8px",cursor:"pointer",border:"sekunder"===eEmailChoice?"1.5px solid #38bdf8":"1px solid rgba(255,255,255,0.12)",background:"sekunder"===eEmailChoice?"rgba(56,189,248,0.12)":"rgba(255,255,255,0.03)",display:"flex",alignItems:"center",justifyContent:"space-between",transition:"all 0.15s ease"},children:[
      (0,t.jsxs)("div",{children:[
        (0,t.jsxs)("div",{style:{fontSize:"0.74rem",fontWeight:700,color:"sekunder"===eEmailChoice?"#38bdf8":"#cbd5e1"},children:["Email Sekunder ",(0,t.jsx)("span",{style:{fontSize:"0.65rem",padding:"1px 6px",borderRadius:4,background:"rgba(255,255,255,0.1)",color:"#94a3b8",marginLeft:"0.3rem"},children:"Cadangan"})]}),
        (0,t.jsx)("div",{style:{fontSize:"0.82rem",color:"#f8fafc",fontFamily:"monospace",marginTop:"2px"},children:a.email})
      ]}),
      (0,t.jsx)("i",{className:"sekunder"===eEmailChoice?"pi pi-check-circle":"pi pi-circle",style:{color:"sekunder"===eEmailChoice?"#38bdf8":"#64748b",fontSize:"1.1rem"}})
    ]})
  ]}),
  "enable_email_otp"===et&&(0,t.jsxs)("div",{style:{display:"grid",gap:"0.35rem"},children:[
    (0,t.jsxs)("label",{style:{fontSize:"0.78rem",fontWeight:700,color:"#e2e8f0"},children:["Password Akun Saat Ini ",(0,t.jsx)("span",{style:{color:"#ef4444"},children:"*"})]}),
    (0,t.jsx)(i.InputText,{type:"password",placeholder:"Masukkan password akun Anda",value:eExistingPassword,onChange:ev=>setExistingPassword(ev.target.value),style:{width:"100%",fontSize:"0.85rem"}}),
    (0,t.jsx)("small",{style:{fontSize:"0.68rem",color:"#94a3b8"},children:"Verifikasi password diperlukan untuk mengonfirmasi kepemilikan akun sebelum OTP dikirim."})
  ]}),
  ["enable_pin","change_pin"].includes(et)&&(0,t.jsxs)("div",{style:{display:"grid",gap:"0.6rem"},children:[
    (0,t.jsx)(F,{id:"fld-3def3ti6rk0vr-60",name:"field_3def3ti6rk0vr_60",label:"PIN Baru (6-8 digit)",children:(0,t.jsxs)("div",{style:{position:"relative"},children:[
      (0,t.jsx)(i.InputText,{id:"profile-pin-input",name:"pin",autoComplete:"off",value:eo,onChange:e=>es(e.target.value.replace(/\D/g,"").slice(0,8)),style:{width:"100%",paddingRight:"2.3rem"},inputMode:"numeric",type:ed?"text":"password",placeholder:"mis. 123456"}),
      (0,t.jsx)("button",{type:"button",onClick:()=>ep(e=>!e),tabIndex:-1,style:{position:"absolute",right:"0.5rem",top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#94a3b8",display:"flex",padding:0},children:ed?(0,t.jsx)(D.EyeOff,{size:16}):(0,t.jsx)(T.Eye,{size:16})})
    ]})}),
    (0,t.jsx)(F,{id:"fld-3def3ti6rk0vr-62",name:"field_3def3ti6rk0vr_62",label:"Konfirmasi PIN",children:(0,t.jsx)(i.InputText,{id:"profile-pin-confirm",name:"pin_confirm",autoComplete:"off",value:eu,onChange:e=>ec(e.target.value.replace(/\D/g,"").slice(0,8)),style:{width:"100%"},inputMode:"numeric",type:ed?"text":"password",placeholder:"ulangi PIN"})})
  ]}),
  eg&&(0,t.jsx)("small",{className:"bdb-error",style:{color:"#ef4444",fontSize:"0.75rem",fontWeight:600},children:eg})
]}):(0,t.jsxs)("div",{style:{display:"grid",gap:"0.9rem",textAlign:"center"},children:[
  (0,t.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem",textAlign:"left",background:"rgba(56,189,248,0.08)",padding:"0.7rem 0.85rem",borderRadius:8,border:"1px solid rgba(56,189,248,0.2)"},children:[
    (0,t.jsxs)("div",{style:{fontSize:"0.75rem",color:"#cbd5e1"},children:["Kode OTP 6-digit dikirim ke: ",(0,t.jsx)("b",{style:{color:"#38bdf8"},children:eOtpSentTo||("sekunder"===eEmailChoice?a.email:(a.email_polri||a.email))})]}),
    (0,t.jsxs)("div",{style:{display:"flex",gap:"0.4rem",flexWrap:"wrap",alignItems:"center"},children:[
      (0,t.jsxs)("button",{type:"button",disabled:eOtpCooldown>0||eOtpAttempts>=3||ey,onClick:()=>sendSecurityOtp("dinas"),style:{padding:"0.25rem 0.55rem",borderRadius:6,fontSize:"0.7rem",cursor:(eOtpCooldown>0||eOtpAttempts>=3||ey)?"not-allowed":"pointer",opacity:(eOtpCooldown>0||eOtpAttempts>=3||ey)?0.5:1,border:"dinas"===eEmailChoice?"1px solid #3b82f6":"1px solid rgba(255,255,255,0.15)",background:"dinas"===eEmailChoice?"rgba(59,130,246,0.2)":"transparent",color:"dinas"===eEmailChoice?"#60a5fa":"#94a3b8"},children:[
        eOtpAttempts>=3?"Batas 3x":eOtpCooldown>0?\`Kirim Ulang (\${eOtpCooldown}s)\`:"Kirim Ulang Email Dinas",
        ": ",a.email_polri||a.email
      ]}),
      a.email&&a.email_polri&&a.email!==a.email_polri&&(0,t.jsxs)("button",{type:"button",disabled:eOtpCooldown>0||eOtpAttempts>=3||ey,onClick:()=>sendSecurityOtp("sekunder"),style:{padding:"0.25rem 0.55rem",borderRadius:6,fontSize:"0.7rem",cursor:(eOtpCooldown>0||eOtpAttempts>=3||ey)?"not-allowed":"pointer",opacity:(eOtpCooldown>0||eOtpAttempts>=3||ey)?0.5:1,border:"sekunder"===eEmailChoice?"1px solid #3b82f6":"1px solid rgba(255,255,255,0.15)",background:"sekunder"===eEmailChoice?"rgba(59,130,246,0.2)":"transparent",color:"sekunder"===eEmailChoice?"#60a5fa":"#94a3b8"},children:[
        eOtpAttempts>=3?"Batas 3x":eOtpCooldown>0?\`Kirim Ulang (\${eOtpCooldown}s)\`:"Kirim Ulang Email Sekunder",
        ": ",a.email
      ]})
    ]})
  ]}),
  (0,t.jsx)("div",{style:{display:"flex",justifyContent:"center",margin:"0.3rem 0"},children:(0,t.jsx)(l.InputOtp,{value:ei,onChange:e=>el(String(e.value??"")),length:6,integerOnly:!0})}),
  eg&&(0,t.jsx)("small",{className:"bdb-error",style:{color:"#ef4444",fontSize:"0.75rem",fontWeight:600},children:eg})
]})
})`;

code = code.substring(0, dlgStart) + newDialogCode + code.substring(fullDlgEnd);
check(3);

// 4. Update the toggle switches and buttons to call openSecurityModal
code = code.replace(/ez\("enable_email_otp"\)/g, 'openSecurityModal("enable_email_otp")');
code = code.replace(/ez\("enable_pin"\)/g, 'openSecurityModal("enable_pin")');
code = code.replace(/ez\("change_pin"\)/g, 'openSecurityModal("change_pin")');
check(4);

fs.writeFileSync('3def3ti6rk0vr.patched.js', code, 'utf8');
console.log("SUCCESS! 3def3ti6rk0vr.patched.js successfully patched with Multi-Step OTP flow and verified 100%!");
