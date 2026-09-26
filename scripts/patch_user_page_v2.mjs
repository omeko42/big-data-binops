import fs from 'fs';

function patchUserPage() {
    let code = fs.readFileSync('user-page-pagination-v9-dfbc949b.patched.js', 'utf8');

    // 1. Column Email: Add masking with tooltip title
    const colTarget = '(0,a.jsx)(i.Column,{header:"Email",sortable:!0,sortField:"email_polri",body:e=>{let p=(e.email_polri||"").trim(),s=(e.email||"").trim();if(!p&&s.toLowerCase().endsWith("@polri.go.id")){p=s;s=""}if(p&&s.toLowerCase()===p.toLowerCase()){s=""}return(0,a.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.15rem",lineHeight:1.25},children:[p?(0,a.jsxs)("div",{style:{display:"inline-flex",alignItems:"center",gap:"0.35rem"},children:[(0,a.jsx)("span",{style:{fontWeight:600,color:"#0f172a"},children:p}),(0,a.jsx)("span",{style:{fontSize:"0.62rem",background:"#eff6ff",color:"#2563eb",padding:"0.05rem 0.35rem",borderRadius:"3px",fontWeight:700,border:"1px solid #bfdbfe"},children:"Polri"})]}):(0,a.jsx)("span",{style:{color:"#94a3b8",fontStyle:"italic"},children:"Belum ada email dinas"}),s?(0,a.jsxs)("div",{style:{display:"inline-flex",alignItems:"center",gap:"0.35rem",fontSize:"0.76rem",color:"#64748b"},children:[(0,a.jsx)("span",{children:s}),(0,a.jsx)("span",{style:{fontSize:"0.6rem",background:"#f1f5f9",color:"#64748b",padding:"0.05rem 0.25rem",borderRadius:"3px"},children:"Sekunder"})]}):null]})}})';

    const colReplacement = '(0,a.jsx)(i.Column,{header:"Email",sortable:!0,sortField:"email_polri",body:e=>{let p=(e.email_polri||"").trim(),s=(e.email||"").trim();if(!p&&s.toLowerCase().endsWith("@polri.go.id")){p=s;s=""}if(p&&s.toLowerCase()===p.toLowerCase()){s=""}function m(t){if(!t)return"";let v=t.split("@");if(2!==v.length)return t;let n=v[0],d=v[1];return n.length<=4?n[0]+"***@"+d:n.slice(0,4)+"****@"+d}let mp=m(p),ms=m(s);return(0,a.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.15rem",lineHeight:1.25},children:[p?(0,a.jsxs)("div",{style:{display:"inline-flex",alignItems:"center",gap:"0.35rem"},title:p,children:[(0,a.jsx)("span",{style:{fontWeight:600,color:"#0f172a"},children:mp}),(0,a.jsx)("span",{style:{fontSize:"0.62rem",background:"#eff6ff",color:"#2563eb",padding:"0.05rem 0.35rem",borderRadius:"3px",fontWeight:700,border:"1px solid #bfdbfe"},children:"Polri"})]}):(0,a.jsx)("span",{style:{color:"#94a3b8",fontStyle:"italic"},children:"Belum ada email dinas"}),s?(0,a.jsxs)("div",{style:{display:"inline-flex",alignItems:"center",gap:"0.35rem",fontSize:"0.76rem",color:"#64748b"},title:s,children:[(0,a.jsx)("span",{children:ms}),(0,a.jsx)("span",{style:{fontSize:"0.6rem",background:"#f1f5f9",color:"#64748b",padding:"0.05rem 0.25rem",borderRadius:"3px"},children:"Sekunder"})]}):null]})}})';

    if (!code.includes(colTarget)) throw new Error("colTarget not found");
    code = code.replace(colTarget, colReplacement);
    console.log("Patched 1: DataTable Email column masked with tooltip title");

    // 2. Field labels and hints in dialog
    const oldPolriField = '(0,a.jsxs)(ee,{id:"fld-user-page-paginati-13",name:"field_user_page_paginati_13",label:"Email Dinas Polri (Utama)",hint:"wajib @polri.go.id, login & OTP",children:';
    const newPolriField = '(0,a.jsxs)(ee,{id:"fld-user-page-paginati-13",name:"field_user_page_paginati_13",label:"Email Dinas Polri (Utama)",required:!0,hint:"wajib @polri.go.id, login & OTP",children:';
    if (code.includes(oldPolriField)) {
        code = code.replace(oldPolriField, newPolriField);
        console.log("Patched 2: Email Dinas Polri required: !0");
    }

    const oldSecField = '(0,a.jsxs)(ee,{label:"Email Sekunder",hint:"opsional / bebas (mis. Gmail, Yahoo)",children:';
    const newSecField = '(0,a.jsxs)(ee,{label:"Email Sekunder (Opsional)",hint:"bebas (mis. Gmail, Yahoo) - boleh dikosongkan",children:';
    if (code.includes(oldSecField)) {
        code = code.replace(oldSecField, newSecField);
        console.log("Patched 3: Email Sekunder explicitly labeled (Opsional)");
    }

    const oldNameField = '(0,a.jsxs)(ee,{label:"Nama",children:';
    const newNameField = '(0,a.jsxs)(ee,{label:"Nama Lengkap",required:!0,children:';
    if (code.includes(oldNameField)) {
        code = code.replace(oldNameField, newNameField);
        console.log("Patched 4: Nama Lengkap required: !0");
    }

    const oldNrpField = '(0,a.jsxs)(ee,{id:"fld-user-page-paginati-12",name:"field_user_page_paginati_12",label:"NRP/NIP",hint:"hanya angka (min. 4 digit)",children:';
    const newNrpField = '(0,a.jsxs)(ee,{id:"fld-user-page-paginati-12",name:"field_user_page_paginati_12",label:"NRP/NIP",required:!e9,hint:"wajib diisi saat tambah pengguna",children:';
    if (code.includes(oldNrpField)) {
        code = code.replace(oldNrpField, newNrpField);
        console.log("Patched 5: NRP/NIP required: !e9");
    }

    fs.writeFileSync('user-page-pagination-v9-dfbc949b.patched.js', code, 'utf8');
    console.log("user-page-pagination-v9-dfbc949b.patched.js updated successfully.");
}

patchUserPage();
