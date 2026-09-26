import fs from 'fs';
import vm from 'vm';

const file = 'user-page-pagination-v9-dfbc949b.patched.js';
let content = fs.readFileSync(file, 'utf8');

// 1. Trash icon size 15 -> 17
const oldTrash = '(0,a.jsx)(T.Trash2,{size:15})';
const newTrash = '(0,a.jsx)(T.Trash2,{size:17})';
if (!content.includes(oldTrash)) {
    console.error('Target 1 (Trash size) not found!');
} else {
    content = content.replace(oldTrash, newTrash);
    console.log('Target 1 patched: Trash size 17');
}

// 2. Modal Dialog width 32rem -> 38rem for approval / delete review
const oldDialogHeader = 'header:ed.isOperator?"Ajukan Penghapusan / Penonaktifan Akun":(eb?.approval_status?.startsWith("REQUEST_")?"Tinjau Permohonan Hapus / Nonaktif":"Hapus Paksa Akun Pengguna"),visible:!!eb,onHide:()=>eh(null),style:{width:"32rem",maxWidth:"96vw"}';
const newDialogHeader = 'header:ed.isOperator?"Ajukan Penghapusan / Penonaktifan Akun":(eb?.approval_status?.startsWith("REQUEST_")?"Tinjau Permohonan Hapus / Nonaktif":"Hapus Paksa Akun Pengguna"),visible:!!eb,onHide:()=>eh(null),style:{width:"38rem",maxWidth:"96vw"}';
if (!content.includes(oldDialogHeader)) {
    console.error('Target 2 (Dialog width) not found!');
} else {
    content = content.replace(oldDialogHeader, newDialogHeader);
    console.log('Target 2 patched: Dialog width 38rem');
}

// 3. Squeezed Alihkan ke Mutasi button container
const oldMutBox = 'eb.deactivation_reason?.toLowerCase().includes("mutasi")?(0,a.jsxs)("div",{style:{marginTop:"0.6rem",padding:"0.6rem 0.8rem",background:"#eff6ff",borderRadius:6,border:"1px solid #bfdbfe",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.5rem"},children:[(0,a.jsxs)("div",{style:{fontSize:"0.78rem",color:"#1e40af"},children:[(0,a.jsx)("strong",{children:"💡 Alasan Terkait Mutasi: "}),"Permohonan ini beralasan mutasi dinas. Anda dapat langsung mengalihkan ke proses Mutasi Satker agar rekam jejak personil tetap terjaga."]}),(0,a.jsx)(o.Button,{label:"Alihkan ke Mutasi",icon:"pi pi-sync",size:"small",severity:"info",onClick:()=>{let target=eb;eh(null);openMutateDialog(target)}})]}):null';
const newMutBox = 'eb.deactivation_reason?.toLowerCase().includes("mutasi")?(0,a.jsxs)("div",{style:{marginTop:"0.6rem",padding:"0.65rem 0.85rem",background:"var(--cas-info-subtle, #eff6ff)",borderRadius:8,border:"1px solid var(--cas-info-border, #bfdbfe)",display:"flex",flexDirection:"column",gap:"0.45rem"},children:[(0,a.jsxs)("div",{style:{fontSize:"0.78rem",color:"var(--cas-info-text, #1e40af)",lineHeight:1.45},children:[(0,a.jsx)("strong",{children:"💡 Alasan Terkait Mutasi: "}),"Permohonan ini beralasan mutasi dinas. Anda dapat langsung mengalihkan ke proses Mutasi Satker agar rekam jejak personil tetap terjaga."]}),(0,a.jsx)(o.Button,{label:"Alihkan ke Mutasi",icon:"pi pi-sync",size:"small",severity:"info",style:{alignSelf:"flex-start",whiteSpace:"nowrap"},onClick:()=>{let target=eb;eh(null);openMutateDialog(target)}})]}):null';
if (!content.includes(oldMutBox)) {
    console.error('Target 3 (MutBox) not found!');
} else {
    content = content.replace(oldMutBox, newMutBox);
    console.log('Target 3 patched: MutBox layout & variables');
}

// 4. Modal footer layout
const oldFooter = 'footer:eb&&(0,a.jsxs)("div",{style:{display:"flex",justifyContent:"flex-end",gap:"0.5rem",flexWrap:"wrap"},children:[(0,a.jsx)(o.Button,{label:"Batal",text:!0,onClick:()=>eh(null),disabled:ey}),ed.isOperator?(0,a.jsx)(o.Button,{label:"Kirim Permohonan",icon:"pi pi-send",severity:"danger",onClick:asOperatorRequest,loading:ey,disabled:!eDelReason.trim()}):(eb.approval_status?.startsWith("REQUEST_")?(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(o.Button,{label:"Tolak (Aktifkan)",severity:"secondary",onClick:()=>asSuperadminReview("REJECT"),loading:ey}),eb.deactivation_reason?.toLowerCase().includes("mutasi")?(0,a.jsx)(o.Button,{label:"Proses Sebagai Mutasi",icon:"pi pi-sync",severity:"info",onClick:()=>{let target=eb;eh(null);openMutateDialog(target)}}):null,(0,a.jsx)(o.Button,{label:eb.approval_status==="REQUEST_DELETE"?"Setujui Hapus Permanen":eb.approval_status?.includes("MUTASI")?"Setujui Mutasi":"Setujui Nonaktifkan",severity:eb.approval_status?.includes("MUTASI")?"primary":"danger",icon:"pi pi-check",onClick:()=>asSuperadminReview(eb.approval_status==="REQUEST_DELETE"?"APPROVE_DELETE":eb.approval_status?.includes("MUTASI")?"APPROVE_MUTASI":"APPROVE_DEACTIVATE"),loading:ey})]}):(0,a.jsx)(o.Button,{label:"Hapus Permanen",icon:"pi pi-trash",severity:"danger",onClick:as,loading:ey,disabled:ef.trim().toLowerCase()!==(eb.email||"").trim().toLowerCase()}))]}),';
const newFooter = 'footer:eb&&(0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",gap:"0.5rem",flexWrap:"wrap"},children:[(0,a.jsx)(o.Button,{label:"Batal",text:!0,onClick:()=>eh(null),disabled:ey}),(0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem",flexWrap:"wrap"},children:[ed.isOperator?(0,a.jsx)(o.Button,{label:"Kirim Permohonan",icon:"pi pi-send",severity:"danger",onClick:asOperatorRequest,loading:ey,disabled:!eDelReason.trim()}):(eb.approval_status?.startsWith("REQUEST_")?(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(o.Button,{label:"Tolak (Aktifkan)",severity:"secondary",onClick:()=>asSuperadminReview("REJECT"),loading:ey}),eb.deactivation_reason?.toLowerCase().includes("mutasi")?(0,a.jsx)(o.Button,{label:"Proses Sebagai Mutasi",icon:"pi pi-sync",severity:"info",onClick:()=>{let target=eb;eh(null);openMutateDialog(target)}}):null,(0,a.jsx)(o.Button,{label:eb.approval_status==="REQUEST_DELETE"?"Setujui Hapus Permanen":eb.approval_status?.includes("MUTASI")?"Setujui Mutasi":"Setujui Nonaktifkan",severity:eb.approval_status?.includes("MUTASI")?"primary":"danger",icon:"pi pi-check",onClick:()=>asSuperadminReview(eb.approval_status==="REQUEST_DELETE"?"APPROVE_DELETE":eb.approval_status?.includes("MUTASI")?"APPROVE_MUTASI":"APPROVE_DEACTIVATE"),loading:ey})]}):(0,a.jsx)(o.Button,{label:"Hapus Permanen",icon:"pi pi-trash",severity:"danger",onClick:as,loading:ey,disabled:ef.trim().toLowerCase()!==(eb.email||"").trim().toLowerCase()}))]})]}),';
if (!content.includes(oldFooter)) {
    console.error('Target 4 (Footer layout) not found!');
} else {
    content = content.replace(oldFooter, newFooter);
    console.log('Target 4 patched: Footer layout');
}

// 5. Verify syntax with vm.Script
new vm.Script(content);
console.log('Syntax check passed!');

fs.writeFileSync(file, content, 'utf8');
console.log('File successfully updated:', file);
