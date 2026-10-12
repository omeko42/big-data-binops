const fs = require('fs');

console.log('=== Patching File Preview Modal with Maximizable Feature in 3pp0f_cp6yg-o.patched.js ===');
let code = fs.readFileSync('3pp0f_cp6yg-o.patched.js', 'utf8');

// 1. Target module 94779
const oldMod = `94779,e=>{"use strict";var t=e.i(43476),n=e.i(71144),a=e.i(64801),r=e.i(26091);e.s(["default",0,function({file:e,onHide:i}){var l;let o,s=(l=e?.name,"pdf"===(o=(l||"").split(".").pop()?.toLowerCase()||"")?"pdf":["png","jpg","jpeg","gif","webp","bmp","svg","avif"].includes(o)?"image":"other");return(0,t.jsx)(n.Dialog,{header:(0,t.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.5rem",maxWidth:"80%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:[(0,t.jsx)(a.Paperclip,{size:16})," ",e?.name]}),visible:!!e,onHide:i,style:{width:"72rem",maxWidth:"96vw"},modal:!0,dismissableMask:!0,children:e?.url?"pdf"===s?(0,t.jsx)("iframe",{src:\`\${e.url}#toolbar=1\`,title:e.name,style:{width:"100%",height:"80vh",border:"1px solid #e2e8f0",borderRadius:8}}):"image"===s?(0,t.jsx)("img",{src:e.url,alt:e.name,style:{maxWidth:"100%",maxHeight:"80vh",display:"block",margin:"0 auto",borderRadius:8}}):(0,t.jsxs)("div",{style:{padding:"2rem",textAlign:"center",color:"#64748b"},children:[(0,t.jsx)(r.FileText,{size:40,style:{color:"#94a3b8",marginBottom:"0.5rem"}}),(0,t.jsx)("div",{children:"Pratinjau inline tidak tersedia untuk tipe berkas ini."})]}):(0,t.jsx)("div",{style:{color:"#94a3b8"},children:"Berkas tidak tersedia."})})}])}`;

const newMod = `94779,e=>{"use strict";var t=e.i(43476),n=e.i(71144),a=e.i(64801),r=e.i(26091),u=e.i(71645);e.s(["default",0,function({file:e,onHide:i}){var l;let o,s=(l=e?.name,"pdf"===(o=(l||"").split(".").pop()?.toLowerCase()||"")?"pdf":["png","jpg","jpeg","gif","webp","bmp","svg","avif"].includes(o)?"image":"other");var [isMax,setIsMax]=(0,u.useState)(!1);return(0,t.jsx)(n.Dialog,{header:(0,t.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.5rem",maxWidth:"80%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:[(0,t.jsx)(a.Paperclip,{size:16})," ",e?.name]}),visible:!!e,onHide:()=>{setIsMax(!1);if(typeof i==="function")i();},maximized:isMax,maximizable:!0,onMaximize:ev=>setIsMax(ev&&typeof ev.maximized==="boolean"?ev.maximized:!isMax),style:isMax?{width:"100vw",height:"100vh",maxWidth:"100vw",maxHeight:"100vh",margin:0,top:0,left:0,borderRadius:0}:{width:"72rem",maxWidth:"96vw"},contentStyle:{height:isMax?"calc(100vh - 65px)":"auto",maxHeight:isMax?"calc(100vh - 65px)":"85vh",padding:isMax?"0.25rem 0.5rem":"0.5rem 1rem",overflow:"hidden"},modal:!0,dismissableMask:!0,children:e?.url?"pdf"===s?(0,t.jsx)("iframe",{src:\`\${e.url}#toolbar=1\`,title:e.name,style:{width:"100%",height:isMax?"calc(100vh - 75px)":"80vh",border:"1px solid #e2e8f0",borderRadius:isMax?0:8}}):"image"===s?(0,t.jsx)("img",{src:e.url,alt:e.name,style:{maxWidth:"100%",maxHeight:isMax?"calc(100vh - 75px)":"80vh",display:"block",margin:"0 auto",borderRadius:isMax?0:8,objectFit:"contain"}}):(0,t.jsxs)("div",{style:{padding:"2rem",textAlign:"center",color:"#64748b"},children:[(0,t.jsx)(r.FileText,{size:40,style:{color:"#94a3b8",marginBottom:"0.5rem"}}),(0,t.jsx)("div",{children:"Pratinjau inline tidak tersedia untuk tipe berkas ini."})]}):(0,t.jsx)("div",{style:{color:"#94a3b8"},children:"Berkas tidak tersedia."})})}])}`;

if (!code.includes(oldMod)) {
  console.error('ERROR: oldMod not found in 3pp0f_cp6yg-o.patched.js!');
  process.exit(1);
}

code = code.replace(oldMod, newMod);
console.log('1. Module 94779 replaced successfully.');

// 2. Also add maximizable:!0 to lightboxImage dialog
const oldLightbox = `header:lightboxImage?.name || "Pratinjau Foto CAS",
      visible:Boolean(lightboxImage),
      onHide:() => setLightboxImage(null),
      style:{width:"48rem",maxWidth:"95vw"},
      modal:!0,`;

const newLightbox = `header:lightboxImage?.name || "Pratinjau Foto CAS",
      visible:Boolean(lightboxImage),
      onHide:() => setLightboxImage(null),
      style:{width:"48rem",maxWidth:"95vw"},
      maximizable:!0,
      modal:!0,`;

if (code.includes(oldLightbox)) {
  code = code.replace(oldLightbox, newLightbox);
  console.log('2. lightboxImage dialog updated with maximizable:!0.');
}

fs.writeFileSync('3pp0f_cp6yg-o.patched.js', code, 'utf8');
console.log('Saved 3pp0f_cp6yg-o.patched.js successfully! New length:', code.length);
