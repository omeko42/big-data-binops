import fs from 'fs';
import vm from 'vm';

let code = fs.readFileSync('user-page-pagination-v9-dfbc949b.patched.js', 'utf8');

// 1. Add toggleUserStatus function right before openMutateDialog
const mutateStart = 'async function openMutateDialog(user){';
if (!code.includes(mutateStart)) throw new Error("openMutateDialog not found");

const toggleUserStatusFn = `async function toggleUserStatus(targetUser){
    if(!targetUser||!targetUser.id)return;
    if(targetUser.id===em)return void e.current?.show({severity:"warn",summary:"Aksi Dibatasi",detail:"Anda tidak dapat mengubah status akun Anda sendiri."});
    let isAktif=(targetUser.status||"").toUpperCase()==="AKTIF";
    let nextStatus=isAktif?"NONAKTIF":"AKTIF";
    let actionLabel=isAktif?"Nonaktifkan":"Aktifkan";
    let confirmMsg=isAktif
        ?\`Nonaktifkan akun pengguna "\${targetUser.name}" (\${targetUser.nrp||targetUser.email_polri||targetUser.email})? Pengguna tidak akan dapat login sampai diaktifkan kembali.\`
        :\`Aktifkan kembali akun pengguna "\${targetUser.name}" (\${targetUser.nrp||targetUser.email_polri||targetUser.email})?\`;
    let ok=await (0,K.confirmAction)(confirmMsg,{
        header:\`Konfirmasi \${actionLabel} Pengguna\`,
        acceptLabel:\`Ya, \${actionLabel}\`,
        rejectLabel:"Batal",
        acceptClassName:isAktif?"p-button-danger":"p-button-success"
    });
    if(!ok)return;
    try{
        let res=await L.apiAuth.patch(\`/user/\${targetUser.id}\`,{status:nextStatus});
        (0,L.assertOk)(res);
        e.current?.show({severity:"success",summary:"Berhasil",detail:\`Status pengguna "\${targetUser.name}" berhasil diubah menjadi \${nextStatus}.\`});
        await aa();
    }catch(err){
        let msg=err.response?.data?.errors?.status?.[0]||err.response?.data?.message||"Gagal mengubah status pengguna.";
        e.current?.show({severity:"error",summary:"Gagal",detail:msg});
    }
}
`;

code = code.replace(mutateStart, toggleUserStatusFn + mutateStart);
console.log("Step 1: Added toggleUserStatus function");

// 2. Replace the Status Column with the interactive status pill button
const oldStatusCol = '(0,a.jsx)(i.Column,{header:"Status",body:e=>{let s=q(e.locked_until);let reqD="REQUEST_DELETE"===e.approval_status,reqN="REQUEST_DEACTIVATE"===e.approval_status,reqM="REQUEST_MUTASI"===e.approval_status||"REQUEST_MUTASI_KELUAR"===e.approval_status,isMK="MUTASI_KELUAR_RESERSE"===e.approval_status;return(0,a.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.35rem",flexWrap:"wrap"},children:[reqD?(0,a.jsx)(t.Tag,{value:"Mohon Hapus",severity:"danger",title:e.deactivation_reason||"Permohonan penghapusan diajukan"}):reqN?(0,a.jsx)(t.Tag,{value:"Mohon Nonaktif",severity:"warning",title:e.deactivation_reason||"Permohonan penonaktifan diajukan"}):reqM?(0,a.jsx)(t.Tag,{value:"Req Mutasi",severity:"info",title:e.deactivation_reason||"Menunggu persetujuan mutasi oleh Superadmin"}):isMK?(0,a.jsx)(t.Tag,{value:"Dinas Luar Reskrim",severity:"secondary",title:e.deactivation_reason||"Mutasi keluar fungsi Reserse/Reskrim"}):(0,a.jsx)(t.Tag,{value:e.status||"-",severity:"AKTIF"===(e.status||"").toUpperCase()?"success":"danger"}),s>0&&(0,a.jsxs)("span",{title:`Terkunci ${s} menit lagi`,style:{display:"inline-flex",alignItems:"center",gap:"0.2rem",fontSize:"0.7rem",fontWeight:700,color:"#dc2626",background:"#fef2f2",borderRadius:999,padding:"0.1rem 0.4rem"},children:[(0,a.jsx)(_.Lock,{size:11})," ",s,"m"]})]})},sortable:!0,sortField:"status"})';

const newStatusCol = `(0,a.jsx)(i.Column,{header:"Status",body:e=>{
    let s=q(e.locked_until);
    let reqD="REQUEST_DELETE"===e.approval_status,
        reqN="REQUEST_DEACTIVATE"===e.approval_status,
        reqM="REQUEST_MUTASI"===e.approval_status||"REQUEST_MUTASI_KELUAR"===e.approval_status,
        isMK="MUTASI_KELUAR_RESERSE"===e.approval_status;
    let isAktif=(e.status||"").toUpperCase()==="AKTIF";
    let canToggle=ed.isSuperadmin||(ed.isOperator&&["operator","viewer"].includes(e.role_bdb));
    let isSelf=e.id===em;
    return(0,a.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.35rem",flexWrap:"wrap"},children:[
        reqD?(0,a.jsx)(t.Tag,{value:"Mohon Hapus",severity:"danger",title:e.deactivation_reason||"Permohonan penghapusan diajukan"})
        :reqN?(0,a.jsx)(t.Tag,{value:"Mohon Nonaktif",severity:"warning",title:e.deactivation_reason||"Permohonan penonaktifan diajukan"})
        :reqM?(0,a.jsx)(t.Tag,{value:"Req Mutasi",severity:"info",title:e.deactivation_reason||"Menunggu persetujuan mutasi oleh Superadmin"})
        :isMK?(0,a.jsx)(t.Tag,{value:"Dinas Luar Reskrim",severity:"secondary",title:e.deactivation_reason||"Mutasi keluar fungsi Reserse/Reskrim"})
        :(0,a.jsxs)("button",{
            type:"button",
            onClick:()=>(canToggle&&!isSelf)?toggleUserStatus(e):void 0,
            title:isSelf?"Akun sendiri (tidak dapat diubah)":canToggle?(isAktif?"Status: AKTIF (Klik untuk menonaktifkan)":"Status: NONAKTIF (Klik untuk mengaktifkan)"):"Status pengguna",
            style:{
                background:isAktif?"rgba(22,163,74,0.12)":"rgba(220,38,38,0.12)",
                color:isAktif?"#16a34a":"#dc2626",
                border:\`1px solid \${isAktif?"rgba(22,163,74,0.3)":"rgba(220,38,38,0.3)"}\`,
                borderRadius:"9999px",
                padding:"0.22rem 0.65rem",
                fontWeight:700,
                fontSize:"0.76rem",
                cursor:(canToggle&&!isSelf)?"pointer":"default",
                display:"inline-flex",
                alignItems:"center",
                gap:"0.35rem",
                transition:"all 0.15s ease",
                boxShadow:"0 1px 2px rgba(0,0,0,0.05)"
            },
            children:[
                (0,a.jsx)("span",{style:{width:"6px",height:"6px",borderRadius:"50%",backgroundColor:isAktif?"#16a34a":"#dc2626",display:"inline-block"}}),
                isAktif?"AKTIF":"NONAKTIF",
                (canToggle&&!isSelf)?(0,a.jsx)("i",{className:isAktif?"pi pi-pencil":"pi pi-power-off",style:{fontSize:"0.65rem",opacity:0.7,marginLeft:"0.15rem"}}):null
            ]
        }),
        s>0&&(0,a.jsxs)("span",{title:\`Terkunci \${s} menit lagi\`,style:{display:"inline-flex",alignItems:"center",gap:"0.2rem",fontSize:"0.7rem",fontWeight:700,color:"#dc2626",background:"#fef2f2",borderRadius:999,padding:"0.1rem 0.4rem"},children:[(0,a.jsx)(_.Lock,{size:11})," ",s,"m"]})
    ]});
},sortable:!0,sortField:"status"})`;

if (!code.includes(oldStatusCol)) throw new Error("oldStatusCol not found");
code = code.replace(oldStatusCol, newStatusCol);
console.log("Step 2: Replaced Status Column with interactive toggle");

// 3. Update ay() validation for username != email_polri
const ayTarget = 'if(secMail&&secMail===polriMail)return void e.current?.show({severity:"warn",summary:"Periksa lagi",detail:"Email sekunder tidak boleh sama dengan Email dinas Polri."});';
const ayReplacement = `let uName=(es.username||"").trim().toLowerCase();
if(uName&&polriMail&&uName===polriMail)return void e.current?.show({severity:"warn",summary:"Periksa lagi",detail:"Username tidak boleh sama dengan Email Dinas Polri (gunakan username unik/alias)."});
if(secMail&&secMail===polriMail)return void e.current?.show({severity:"warn",summary:"Periksa lagi",detail:"Email sekunder tidak boleh sama dengan Email dinas Polri."});`;

if (!code.includes(ayTarget)) throw new Error("ayTarget not found");
code = code.replace(ayTarget, ayReplacement);
console.log("Step 3: Added username !== polriMail validation in ay()");

// 4. Rombak Edit Pengguna Dialog Layout:
// 2 Columns, 52rem width, clean headers, no Status dropdown!
const oldDialogStart = '(0,a.jsx)(d.Dialog,{header:e9?"Edit Pengguna":"Tambah Pengguna",visible:j,onHide:()=>v(!1),style:{width:"32rem",maxWidth:"95vw"},footer:aj,modal:!0,children:(0,a.jsxs)("div",{className:"p-fluid",style:{display:"grid",gap:"0.7rem"},children:[(0,a.jsx)(ee,{label:"Nama",children:(0,a.jsx)(l.InputText,{id:"user-form-name",name:"name",autoComplete:"name",value:es.name,onChange:e=>ak("name",e.target.value)})}),(0,a.jsx)(ee,{label:"NRP / NIP",children:(0,a.jsx)(l.InputText,{id:"user-form-nrp",name:"nrp",autoComplete:"off",value:es.nrp,onChange:e=>ak("nrp",e.target.value)})}),(0,a.jsxs)(ee,{id:"fld-user-page-paginati-13",name:"field_user_page_paginati_13",label:"Email Dinas Polri (Utama)",required:!0,hint:"wajib @polri.go.id, login & OTP",children:[(0,a.jsx)(W.default,{id:"user-form-email-polri",name:"email_polri",autoComplete:"email",value:es.email_polri,onChange:e=>{ak("email_polri",e),el.onChangeDebounced("email_polri",e)},onBlur:e=>el.onBlurNow("email_polri",e),status:el.status.email_polri,placeholder:"nrp@polri.go.id atau nip@polri.go.id"}),el.message.email_polri&&(0,a.jsx)("small",{className:"bdb-error",children:el.message.email_polri})]}),(0,a.jsxs)(ee,{label:"Email Sekunder (Opsional)",hint:"bebas (mis. Gmail, Yahoo) - boleh dikosongkan",children:[(0,a.jsx)(W.default,{id:"user-form-email",name:"email",autoComplete:"email",value:es.email,onChange:e=>{ak("email",e),el.onChangeDebounced("email",e)},onBlur:e=>el.onBlurNow("email",e),status:el.status.email,placeholder:"mis. nama@gmail.com"}),el.message.email&&(0,a.jsx)("small",{className:"bdb-error",children:el.message.email})]}),(0,a.jsxs)(ee,{id:"fld-user-page-paginati-14",name:"field_user_page_paginati_14",label:"Username",hint:"alternatif login selain email dinas Polri",children:[(0,a.jsx)(W.default,{id:"user-form-username",name:"username",autoComplete:"username",value:es.username,onChange:e=>{ak("username",e),el.onChangeDebounced("username",e)},onBlur:e=>el.onBlurNow("username",e),status:el.status.username,placeholder:"Contoh: omeko11"}),el.message.username&&(0,a.jsx)("small",{className:"bdb-error",children:el.message.username})]}),(0,a.jsx)(ee,{label:"Role",hint:ed.isOperator?"Pilih role Operator atau Viewer":void 0,children:(0,a.jsx)(u.Dropdown,{id:"user-form-role",inputId:"user-form-role-select",name:"role_bdb",value:es.role_bdb,options:ed.isSuperadmin?X:X.filter(e=>["operator","viewer"].includes(e.value)),onChange:e=>ak("role_bdb",e.value),disabled:!1})}),ae?(0,a.jsx)(ee,{id:"fld-user-page-paginati-15",name:"field_user_page_paginati_15",htmlFor:"fld-user-satker-0-select",label:"Satker Melekat",hint:ed.isOperator?"pilih satker sendiri atau subordinat regional":"pilih berjenjang",children:(0,a.jsx)(F.default,{key:es.id?`user-satker-${es.id}`:"user-satker-new",initialId:es.scope_satker_id?Number(es.scope_satker_id):null,onSelect:e=>{er(a=>({...a,scope_satker_id:e?Number(e.id):null,scope_satker_key:e?(e.kode||a.scope_satker_key):(a.scope_satker_key||""),scope_satker_name:e?(e.deskripsi||a.scope_satker_name):(a.scope_satker_name||"")}))}})}):(0,a.jsx)("p",{style:{fontSize:"0.8rem",color:"#94a3b8",margin:0},children:"Superadmin: akses nasional (tanpa satker melekat)."}),(0,a.jsx)(ee,{label:"Status",children:(0,a.jsx)(u.Dropdown,{id:"user-form-status",inputId:"user-form-status-select",name:"status",value:es.status,options:J,onChange:e=>ak("status",e.value)})}),!e9&&(0,a.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.7rem"},children:[(0,a.jsx)(ee,{id:"fld-user-page-paginati-16",name:"field_user_page_paginati_16",label:"Password",children:(0,a.jsx)(m.Password,{id:"user-form-password",inputId:"user-form-password-input",name:"password",autoComplete:"new-password",value:es.password,onChange:e=>ak("password",e.target.value),feedback:!1,toggleMask:!0})}),(0,a.jsx)(ee,{id:"fld-user-page-paginati-17",name:"field_user_page_paginati_17",label:"Konfirmasi Password",children:(0,a.jsx)(m.Password,{id:"user-form-password-confirmation",inputId:"user-form-password-confirmation-input",name:"password_confirmation",autoComplete:"new-password",value:es.password_confirmation,onChange:e=>ak("password_confirmation",e.target.value),feedback:!1,toggleMask:!0})})]}),(0,a.jsxs)("div",{style:{display:"flex",gap:"1.5rem",marginTop:"0.2rem"},children:[(0,a.jsxs)("label",{htmlFor:"user-form-local-password-input",style:{display:"flex",alignItems:"center",gap:"0.5rem",fontSize:"0.85rem",cursor:"pointer"},children:[(0,a.jsx)(c.Checkbox,{id:"user-form-local-password",inputId:"user-form-local-password-input",name:"local_password_enabled",checked:es.local_password_enabled,onChange:e=>ak("local_password_enabled",!!e.checked)}),"Login password lokal"]}),(0,a.jsxs)("label",{htmlFor:"user-form-two-factor-input",style:{display:"flex",alignItems:"center",gap:"0.5rem",fontSize:"0.85rem",cursor:"pointer"},children:[(0,a.jsx)(c.Checkbox,{id:"user-form-two-factor",inputId:"user-form-two-factor-input",name:"two_factor_required",checked:es.two_factor_required,onChange:e=>ak("two_factor_required",!!e.checked)}),"Wajib 2FA"]})]}),ed.isOperator&&!e9&&(0,a.jsx)("div",{style:{marginTop:"0.8rem",padding:"0.75rem 0.9rem",background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:8},children:(0,a.jsxs)("label",{htmlFor:"user-form-conscious-input",style:{display:"flex",alignItems:"flex-start",gap:"0.6rem",fontSize:"0.82rem",color:"#1e40af",cursor:"pointer"},children:[(0,a.jsx)(c.Checkbox,{id:"user-form-conscious",inputId:"user-form-conscious-input",checked:eConscious,onChange:e=>eConsciousSet(!!e.checked),style:{marginTop:"0.15rem"}}),(0,a.jsx)("span",{children:"Saya menyatakan secara sadar dan bertanggung jawab bahwa akun ini ditambahkan ke satuan kerja saya sendiri atau satuan kerja di bawah hirarki penugasan saya yang sah."})]})})]})})';

const newDialog = `(0,a.jsx)(d.Dialog,{header:e9?"Edit Pengguna":"Tambah Pengguna",visible:j,onHide:()=>v(!1),style:{width:"52rem",maxWidth:"96vw"},footer:aj,modal:!0,children:(0,a.jsxs)("div",{className:"p-fluid",style:{display:"flex",flexDirection:"column",gap:"0.85rem"},children:[
    (0,a.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(23rem, 1fr))",gap:"1.25rem",alignItems:"start"},children:[
        // --- KOLOM KIRI: IDENTITAS & PENUGASAN ---
        (0,a.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.75rem",background:"rgba(255,255,255,0.03)",padding:"0.9rem",borderRadius:"10px",border:"1px solid rgba(255,255,255,0.08)"},children:[
            (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.45rem",borderBottom:"1px solid rgba(255,255,255,0.08)",paddingBottom:"0.4rem",marginBottom:"0.15rem"},children:[
                (0,a.jsx)("i",{className:"pi pi-id-card",style:{color:"#38bdf8",fontSize:"0.95rem"}}),
                (0,a.jsx)("span",{style:{fontWeight:700,fontSize:"0.8rem",color:"#e2e8f0",letterSpacing:"0.5px",textTransform:"uppercase"},children:"Identitas & Penugasan"})
            ]}),
            (0,a.jsx)(ee,{label:"Nama Lengkap",required:!0,children:(0,a.jsx)(l.InputText,{id:"user-form-name",name:"name",autoComplete:"name",value:es.name,onChange:e=>ak("name",e.target.value)})}),
            (0,a.jsx)(ee,{label:"NRP / NIP",required:!e9,hint:e9?void 0:"wajib diisi saat tambah pengguna",children:(0,a.jsx)(l.InputText,{id:"user-form-nrp",name:"nrp",autoComplete:"off",value:es.nrp,onChange:e=>ak("nrp",e.target.value)})}),
            (0,a.jsx)(ee,{label:"Role Akses",hint:ed.isOperator?"Pilih role Operator atau Viewer":void 0,children:(0,a.jsx)(u.Dropdown,{id:"user-form-role",inputId:"user-form-role-select",name:"role_bdb",value:es.role_bdb,options:ed.isSuperadmin?X:X.filter(e=>["operator","viewer"].includes(e.value)),onChange:e=>ak("role_bdb",e.value),disabled:!1})}),
            ae?(0,a.jsx)(ee,{id:"fld-user-page-paginati-15",name:"field_user_page_paginati_15",htmlFor:"fld-user-satker-0-select",label:"Satker Melekat",hint:ed.isOperator?"pilih satker sendiri atau subordinat regional":"pilih berjenjang",children:(0,a.jsx)(F.default,{key:es.id?\`user-satker-\${es.id}\`:"user-satker-new",initialId:es.scope_satker_id?Number(es.scope_satker_id):null,onSelect:e=>{er(a=>({...a,scope_satker_id:e?Number(e.id):null,scope_satker_key:e?(e.kode||a.scope_satker_key):(a.scope_satker_key||""),scope_satker_name:e?(e.deskripsi||a.scope_satker_name):(a.scope_satker_name||"")}))}})}):(0,a.jsx)("p",{style:{fontSize:"0.78rem",color:"#94a3b8",margin:0},children:"Superadmin: akses nasional (tanpa satker melekat)."})
        ]}),

        // --- KOLOM KANAN: KREDENSIAL & KEAMANAN ---
        (0,a.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.75rem",background:"rgba(255,255,255,0.03)",padding:"0.9rem",borderRadius:"10px",border:"1px solid rgba(255,255,255,0.08)"},children:[
            (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.45rem",borderBottom:"1px solid rgba(255,255,255,0.08)",paddingBottom:"0.4rem",marginBottom:"0.15rem"},children:[
                (0,a.jsx)("i",{className:"pi pi-shield",style:{color:"#38bdf8",fontSize:"0.95rem"}}),
                (0,a.jsx)("span",{style:{fontWeight:700,fontSize:"0.8rem",color:"#e2e8f0",letterSpacing:"0.5px",textTransform:"uppercase"},children:"Kredensial & Akses"})
            ]}),
            (0,a.jsxs)(ee,{id:"fld-user-page-paginati-13",name:"field_user_page_paginati_13",label:"Email Dinas Polri (Utama)",required:!0,hint:"wajib @polri.go.id, login & OTP",children:[(0,a.jsx)(W.default,{id:"user-form-email-polri",name:"email_polri",autoComplete:"email",value:es.email_polri,onChange:e=>{ak("email_polri",e),el.onChangeDebounced("email_polri",e)},onBlur:e=>el.onBlurNow("email_polri",e),status:el.status.email_polri,placeholder:"nrp@polri.go.id atau nip@polri.go.id"}),el.message.email_polri&&(0,a.jsx)("small",{className:"bdb-error",children:el.message.email_polri})]}),
            (0,a.jsxs)(ee,{label:"Email Sekunder (Opsional)",hint:"bebas (mis. Gmail, Yahoo) - boleh dikosongkan",children:[(0,a.jsx)(W.default,{id:"user-form-email",name:"email",autoComplete:"email",value:es.email,onChange:e=>{ak("email",e),el.onChangeDebounced("email",e)},onBlur:e=>el.onBlurNow("email",e),status:el.status.email,placeholder:"mis. nama@gmail.com"}),el.message.email&&(0,a.jsx)("small",{className:"bdb-error",children:el.message.email})]}),
            (0,a.jsxs)(ee,{id:"fld-user-page-paginati-14",name:"field_user_page_paginati_14",label:"Username (Alternatif Login)",hint:"harus beda dengan Email Dinas Polri",children:[(0,a.jsx)(W.default,{id:"user-form-username",name:"username",autoComplete:"username",value:es.username,onChange:e=>{ak("username",e),el.onChangeDebounced("username",e)},onBlur:e=>el.onBlurNow("username",e),status:(es.username&&es.email_polri&&es.username.trim().toLowerCase()===es.email_polri.trim().toLowerCase())?"error":el.status.username,placeholder:"Contoh: omeko11"}),(es.username&&es.email_polri&&es.username.trim().toLowerCase()===es.email_polri.trim().toLowerCase())?(0,a.jsx)("small",{className:"bdb-error",style:{color:"#ef4444",fontWeight:600},children:"Username tidak boleh sama dengan Email Dinas Polri!"}):el.message.username&&(0,a.jsx)("small",{className:"bdb-error",children:el.message.username})]}),
            !e9&&(0,a.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.7rem"},children:[(0,a.jsx)(ee,{id:"fld-user-page-paginati-16",name:"field_user_page_paginati_16",label:"Password",children:(0,a.jsx)(m.Password,{id:"user-form-password",inputId:"user-form-password-input",name:"password",autoComplete:"new-password",value:es.password,onChange:e=>ak("password",e.target.value),feedback:!1,toggleMask:!0})}),(0,a.jsx)(ee,{id:"fld-user-page-paginati-17",name:"field_user_page_paginati_17",label:"Konfirmasi Password",children:(0,a.jsx)(m.Password,{id:"user-form-password-confirmation",inputId:"user-form-password-confirmation-input",name:"password_confirmation",autoComplete:"new-password",value:es.password_confirmation,onChange:e=>ak("password_confirmation",e.target.value),feedback:!1,toggleMask:!0})})]}),
            (0,a.jsxs)("div",{style:{display:"flex",gap:"1.25rem",marginTop:"0.4rem",background:"rgba(255,255,255,0.02)",padding:"0.55rem 0.75rem",borderRadius:"6px",border:"1px solid rgba(255,255,255,0.06)"},children:[
                (0,a.jsxs)("label",{htmlFor:"user-form-local-password-input",style:{display:"flex",alignItems:"center",gap:"0.4rem",fontSize:"0.82rem",cursor:"pointer"},children:[(0,a.jsx)(c.Checkbox,{id:"user-form-local-password",inputId:"user-form-local-password-input",name:"local_password_enabled",checked:es.local_password_enabled,onChange:e=>ak("local_password_enabled",!!e.checked)}),"Login password lokal"]}),
                (0,a.jsxs)("label",{htmlFor:"user-form-two-factor-input",style:{display:"flex",alignItems:"center",gap:"0.4rem",fontSize:"0.82rem",cursor:"pointer"},children:[(0,a.jsx)(c.Checkbox,{id:"user-form-two-factor",inputId:"user-form-two-factor-input",name:"two_factor_required",checked:es.two_factor_required,onChange:e=>ak("two_factor_required",!!e.checked)}),"Wajib 2FA"]})
            ]})
        ]})
    ]}),
    ed.isOperator&&!e9&&(0,a.jsx)("div",{style:{padding:"0.75rem 0.9rem",background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:8},children:(0,a.jsxs)("label",{htmlFor:"user-form-conscious-input",style:{display:"flex",alignItems:"flex-start",gap:"0.6rem",fontSize:"0.82rem",color:"#1e40af",cursor:"pointer"},children:[(0,a.jsx)(c.Checkbox,{id:"user-form-conscious",inputId:"user-form-conscious-input",checked:eConscious,onChange:e=>eConsciousSet(!!e.checked),style:{marginTop:"0.15rem"}}),(0,a.jsx)("span",{children:"Saya menyatakan secara sadar dan bertanggung jawab bahwa akun ini ditambahkan ke satuan kerja saya sendiri atau satuan kerja di bawah hirarki penugasan saya yang sah."})]})})
]})})`;

if (!code.includes(oldDialogStart)) throw new Error("oldDialogStart not found");
code = code.replace(oldDialogStart, newDialog);
console.log("Step 4: Redesigned Edit Pengguna Dialog into 2 columns without Status dropdown");

// 5. Test syntax with vm.Script!
new vm.Script(code);
console.log("100% VALID SYNTAX FOR USER PAGE CHUNK!");

fs.writeFileSync('user-page-pagination-v9-dfbc949b.patched.js', code, 'utf8');
console.log("Successfully wrote user-page-pagination-v9-dfbc949b.patched.js!");
