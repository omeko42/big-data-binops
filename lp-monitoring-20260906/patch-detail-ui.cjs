const fs=require('fs');
const src=process.argv[2],dst=process.argv[3];
let s=fs.readFileSync(src,'utf8');
function once(from,to,label){const i=s.indexOf(from);if(i<0)throw new Error('anchor missing: '+label);if(s.indexOf(from,i+1)>=0)throw new Error('anchor not unique: '+label);s=s.slice(0,i)+to+s.slice(i+from.length);}
once(
  '(0,a.jsxs)(l.Button,{severity:"warning",onClick:ty,disabled:!E||H?.dilimpahkan_eksternal,className:"att-btn",children:[(0,a.jsx)(C,{size:15,style:{marginRight:"0.4rem"}})," Pelimpahan"]}),(0,a.jsxs)(l.Button,{severity:"help",onClick:tf,disabled:!E||H?.dilimpahkan_eksternal,className:"att-btn",children:[(0,a.jsx)(W.Building2,{size:15,style:{marginRight:"0.4rem"}})," Limpahkan ke Instansi Eksternal"]})',
  'H?.monitoring_mode&&(0,a.jsx)("span",{style:{fontSize:"0.76rem",fontWeight:700,color:"#1e40af",background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:8,padding:"0.45rem 0.65rem"},children:"Mode monitoring: bantu update diperbolehkan, pelimpahan dilakukan satker pemilik."}),(0,a.jsxs)(l.Button,{severity:"warning",onClick:ty,disabled:!E||H?.dilimpahkan_eksternal||H?.monitoring_mode,title:H?.monitoring_mode?"Pelimpahan dinonaktifkan dalam mode monitoring":void 0,className:"att-btn",children:[(0,a.jsx)(C,{size:15,style:{marginRight:"0.4rem"}})," Pelimpahan"]}),(0,a.jsxs)(l.Button,{severity:"help",onClick:tf,disabled:!E||H?.dilimpahkan_eksternal||H?.monitoring_mode,title:H?.monitoring_mode?"Pelimpahan dinonaktifkan dalam mode monitoring":void 0,className:"att-btn",children:[(0,a.jsx)(W.Building2,{size:15,style:{marginRight:"0.4rem"}})," Limpahkan ke Instansi Eksternal"]})',
  'disable transfer buttons'
);
fs.writeFileSync(dst,s);
console.log(JSON.stringify({ok:true,bytes:s.length,target:dst}));
