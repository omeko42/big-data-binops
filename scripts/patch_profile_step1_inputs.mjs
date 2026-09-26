import fs from 'fs';
import vm from 'vm';

let code = fs.readFileSync('3def3ti6rk0vr.patched.js', 'utf8');

// Ensure password field is shown for enable_email_otp, enable_pin, AND change_pin
const oldPwBlock = `"enable_email_otp"===et&&(0,t.jsxs)("div",{style:{display:"grid",gap:"0.35rem"},children:[
    (0,t.jsxs)("label",{style:{fontSize:"0.78rem",fontWeight:700,color:"#e2e8f0"},children:["Password Akun Saat Ini ",(0,t.jsx)("span",{style:{color:"#ef4444"},children:"*"})]}),
    (0,t.jsx)(i.InputText,{type:"password",placeholder:"Masukkan password akun Anda",value:eExistingPassword,onChange:ev=>setExistingPassword(ev.target.value),style:{width:"100%",fontSize:"0.85rem"}}),
    (0,t.jsx)("small",{style:{fontSize:"0.68rem",color:"#94a3b8"},children:"Verifikasi password diperlukan untuk mengonfirmasi kepemilikan akun sebelum OTP dikirim."})
  ]}),`;

const newPwBlock = `["enable_email_otp","enable_pin","change_pin"].includes(et)&&(0,t.jsxs)("div",{style:{display:"grid",gap:"0.35rem"},children:[
    (0,t.jsxs)("label",{style:{fontSize:"0.78rem",fontWeight:700,color:"#e2e8f0"},children:["Password Akun Saat Ini ",(0,t.jsx)("span",{style:{color:"#ef4444"},children:"*"})]}),
    (0,t.jsxs)("div",{style:{position:"relative",display:"flex",alignItems:"center"},children:[
      (0,t.jsx)(i.InputText,{type:eShowPassword?"text":"password",placeholder:"Masukkan password akun Anda",value:eExistingPassword,onChange:ev=>{setExistingPassword(ev.target.value);ev("");},style:{width:"100%",fontSize:"0.85rem",paddingRight:"2.5rem"}}),
      (0,t.jsx)("i",{className:eShowPassword?"pi pi-eye-slash":"pi pi-eye",style:{position:"absolute",right:"0.75rem",color:"#94a3b8",cursor:"pointer",fontSize:"0.95rem"},onClick:()=>setShowPassword(!eShowPassword)})
    ]}),
    (0,t.jsx)("small",{style:{fontSize:"0.68rem",color:"#94a3b8"},children:"Verifikasi password diperlukan untuk mengonfirmasi kepemilikan akun sebelum OTP dikirim."})
  ]}),`;

if (code.includes(oldPwBlock)) {
  code = code.replace(oldPwBlock, newPwBlock);
  console.log('Password block updated for PIN and OTP!');
} else {
  console.error('oldPwBlock not found');
  process.exit(1);
}

// Fix /D/g to /\D/g
code = code.replace(/replace\(\/D\/g,""\)/g, 'replace(/\\D/g,"")');

try {
  new vm.Script(code);
  console.log('Script is 100% syntactically valid!');
  fs.writeFileSync('3def3ti6rk0vr.patched.js', code, 'utf8');
  console.log('3def3ti6rk0vr.patched.js saved successfully!');
} catch (err) {
  console.error('Syntax error:', err.message);
  process.exit(1);
}
