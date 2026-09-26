import fs from 'fs';

function main() {
    let code = fs.readFileSync('user-page-pagination-v9-dfbc949b.patched.js', 'utf8');

    // 1. Email column in DataTable
    const colTarget = '(0,a.jsx)(i.Column,{field:"email",header:"Email",sortable:!0})';
    const colReplacement = '(0,a.jsx)(i.Column,{header:"Email",sortable:!0,sortField:"email_polri",body:e=>{let p=(e.email_polri||"").trim(),s=(e.email||"").trim();if(!p&&s.toLowerCase().endsWith("@polri.go.id")){p=s;s=""}if(p&&s.toLowerCase()===p.toLowerCase()){s=""}return(0,a.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.15rem",lineHeight:1.25},children:[p?(0,a.jsxs)("div",{style:{display:"inline-flex",alignItems:"center",gap:"0.35rem"},children:[(0,a.jsx)("span",{style:{fontWeight:600,color:"#0f172a"},children:p}),(0,a.jsx)("span",{style:{fontSize:"0.62rem",background:"#eff6ff",color:"#2563eb",padding:"0.05rem 0.35rem",borderRadius:"3px",fontWeight:700,border:"1px solid #bfdbfe"},children:"Polri"})]}):(0,a.jsx)("span",{style:{color:"#94a3b8",fontStyle:"italic"},children:"Belum ada email dinas"}),s?(0,a.jsxs)("div",{style:{display:"inline-flex",alignItems:"center",gap:"0.35rem",fontSize:"0.76rem",color:"#64748b"},children:[(0,a.jsx)("span",{children:s}),(0,a.jsx)("span",{style:{fontSize:"0.6rem",background:"#f1f5f9",color:"#64748b",padding:"0.05rem 0.25rem",borderRadius:"3px"},children:"Sekunder"})]}):null]})}})';
    if (!code.includes(colTarget)) throw new Error("colTarget not found");
    code = code.replace(colTarget, colReplacement);
    console.log("Patched 1: DataTable Email column");

    // 2. Edit user onClick population
    const editClickTarget = 'onClick:()=>{er({id:e.id,name:e.name||"",nrp:e.nrp||"",email:e.email||"",email_polri:e.email_polri||"",username:e.username||"",';
    const editClickReplacement = 'onClick:()=>{let p=(e.email_polri||"").trim(),s=(e.email||"").trim();if(!p&&s.toLowerCase().endsWith("@polri.go.id")){p=s;s=""}if(p&&s.toLowerCase()===p.toLowerCase()){s=""}er({id:e.id,name:e.name||"",nrp:e.nrp||"",email:s,email_polri:p,username:e.username||"",';
    if (!code.includes(editClickTarget)) throw new Error("editClickTarget not found");
    code = code.replace(editClickTarget, editClickReplacement);
    console.log("Patched 2: Edit user modal state loader");

    // 3. Form fields in Dialog (swap Email & Email Dinas Polri)
    const formFieldsTarget = '(0,a.jsxs)(ee,{label:"Email",hint:"email sekunder / bebas",children:[(0,a.jsx)(W.default,{id:"user-form-email",name:"email",autoComplete:"email",value:es.email,onChange:e=>{ak("email",e),el.onChangeDebounced("email",e)},onBlur:e=>el.onBlurNow("email",e),status:el.status.email,placeholder:"mis. nama@gmail.com"}),el.message.email&&(0,a.jsx)("small",{className:"bdb-error",children:el.message.email})]}),(0,a.jsxs)(ee,{id:"fld-user-page-paginati-13",name:"field_user_page_paginati_13",label:"Email Dinas Polri",hint:"dipakai untuk login & pengiriman OTP",children:[(0,a.jsx)(W.default,{id:"user-form-email-polri",name:"email_polri",autoComplete:"email",value:es.email_polri,onChange:e=>{ak("email_polri",e),el.onChangeDebounced("email_polri",e)},onBlur:e=>el.onBlurNow("email_polri",e),status:el.status.email_polri,placeholder:"nrp@polri.go.id atau nip@polri.go.id"}),el.message.email_polri&&(0,a.jsx)("small",{className:"bdb-error",children:el.message.email_polri})]}),';
    const formFieldsReplacement = '(0,a.jsxs)(ee,{id:"fld-user-page-paginati-13",name:"field_user_page_paginati_13",label:"Email Dinas Polri (Utama)",hint:"wajib @polri.go.id, login & OTP",children:[(0,a.jsx)(W.default,{id:"user-form-email-polri",name:"email_polri",autoComplete:"email",value:es.email_polri,onChange:e=>{ak("email_polri",e),el.onChangeDebounced("email_polri",e)},onBlur:e=>el.onBlurNow("email_polri",e),status:el.status.email_polri,placeholder:"nrp@polri.go.id atau nip@polri.go.id"}),el.message.email_polri&&(0,a.jsx)("small",{className:"bdb-error",children:el.message.email_polri})]}),(0,a.jsxs)(ee,{label:"Email Sekunder",hint:"opsional / bebas (mis. Gmail, Yahoo)",children:[(0,a.jsx)(W.default,{id:"user-form-email",name:"email",autoComplete:"email",value:es.email,onChange:e=>{ak("email",e),el.onChangeDebounced("email",e)},onBlur:e=>el.onBlurNow("email",e),status:el.status.email,placeholder:"mis. nama@gmail.com"}),el.message.email&&(0,a.jsx)("small",{className:"bdb-error",children:el.message.email})]}),';
    if (!code.includes(formFieldsTarget)) throw new Error("formFieldsTarget not found");
    code = code.replace(formFieldsTarget, formFieldsReplacement);
    console.log("Patched 3: Swapped form field order");

    // 4. Validation in ay()
    const ayStart = 'async function ay(){let a=es.name&&es.email?';
    const ayEnd = 'let s={name:(es.name||"").trim(),nrp:(es.nrp||"").trim(),email:(es.email||"").trim().toLowerCase(),email_polri:(es.email_polri||"").trim().toLowerCase()||null,';
    const startIdx = code.indexOf(ayStart);
    const endIdx = code.indexOf(ayEnd, startIdx);
    if (startIdx === -1 || endIdx === -1) throw new Error("ay start or end not found");
    
    const ayTargetChunk = code.substring(startIdx, endIdx + ayEnd.length);
    const ayReplacementChunk = 'async function ay(){let polriMail=(es.email_polri||"").trim().toLowerCase(),secMail=(es.email||"").trim().toLowerCase();let a=!es.name||!es.name.trim()?"Nama wajib diisi":!polriMail?"Email dinas Polri (Utama) wajib diisi":!polriMail.endsWith("@polri.go.id")?"Email dinas Polri wajib menggunakan domain @polri.go.id":!e9&&!es.nrp?"NRP/NIP wajib diisi untuk tambah pengguna":(!e9&&(!es.password||es.password.length<8||!/^(?=.*[A-Za-z])(?=.*\\d).+$/.test(es.password)))?"Password awal min. 8 karakter kombinasi huruf & angka":(e9&&es.password&&(es.password.length<8||!/^(?=.*[A-Za-z])(?=.*\\d).+$/.test(es.password)))?"Password minimal 8 karakter kombinasi huruf & angka":(!e9&&es.password!==es.password_confirmation)?"Konfirmasi password belum sama":(e9&&es.password&&es.password!==es.password_confirmation)?"Konfirmasi password belum sama":(ae&&!(ed.isSuperadmin&&"viewer"===es.role_bdb)&&(!es.scope_satker_key&&!es.scope_satker_id))?"Satker melekat wajib dipilih untuk role ini":null;if(a)return void e.current?.show({severity:"warn",summary:"Periksa lagi",detail:a});if(secMail&&secMail===polriMail)return void e.current?.show({severity:"warn",summary:"Periksa lagi",detail:"Email sekunder tidak boleh sama dengan Email dinas Polri."});if(el.hasBlockingIssue)return void e.current?.show({severity:"warn",summary:"Periksa lagi",detail:"Email dinas Polri atau Username sudah dipakai akun lain. Perbaiki dulu sebelum menyimpan."});if(ed.isOperator&&!e9&&!eConscious)return void e.current?.show({severity:"warn",summary:"Pernyataan Tanggung Jawab",detail:"Centang pernyataan sadar dan bertanggung jawab sebelum menambahkan akun."});if(!await (0,K.confirmAction)(e9?"Simpan perubahan pengguna?":"Tambah pengguna baru?"))return;et(!0);let s={name:(es.name||"").trim(),nrp:(es.nrp||"").trim(),email:secMail||polriMail,email_polri:polriMail,';
    
    code = code.replace(ayTargetChunk, ayReplacementChunk);
    console.log("Patched 4: ay() validation & payload");

    fs.writeFileSync('user-page-pagination-v9-dfbc949b.patched.js', code, 'utf8');
    console.log("user-page-pagination-v9-dfbc949b.patched.js written successfully.");
}

main();
