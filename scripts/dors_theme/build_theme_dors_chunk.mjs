import fs from 'fs';
import cp from 'child_process';

let content = fs.readFileSync('scratch/2euu9hqyjbvnk.final.js', 'utf8');
console.log('Original chunk length:', content.length);

// 1. Scoped CSS for DORS page
const cssOverride = `
/* --- DORS PAGE THEME POLISH --- */
.dors-sched-grid .p-inputnumber .p-inputnumber-button,
.p-inputnumber-button-up,
.p-inputnumber-button-down {
  background: var(--surface-100, #f1f5f9) !important;
  border: 1px solid var(--surface-border, #cbd5e1) !important;
  color: var(--text-color, #334155) !important;
  box-shadow: none !important;
}
.p-inputnumber-button-up:hover,
.p-inputnumber-button-down:hover {
  background: var(--surface-200, #e2e8f0) !important;
  color: var(--text-color, #0f172a) !important;
}
:root[data-theme=dark] .p-inputnumber .p-inputnumber-button,
:root[data-theme=dark] .p-inputnumber-button-up,
:root[data-theme=dark] .p-inputnumber-button-down {
  background: #1e293b !important;
  border: 1px solid #334155 !important;
  color: #cbd5e1 !important;
  box-shadow: none !important;
}
:root[data-theme=dark] .p-inputnumber-button-up:hover,
:root[data-theme=dark] .p-inputnumber-button-down:hover {
  background: #334155 !important;
  border-color: #475569 !important;
  color: #f8fafc !important;
}
.dors-tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.15rem;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text-color-secondary, #94a3b8);
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  transition: all 0.2s ease;
}
.dors-tab-btn:hover {
  color: var(--text-color, #f1f5f9);
  background: var(--surface-hover, rgba(255, 255, 255, 0.04));
}
.dors-tab-btn.active-sync {
  font-weight: 800;
  color: #3b82f6;
  border-bottom: 2px solid #3b82f6;
  background: rgba(59, 130, 246, 0.12);
}
.dors-tab-btn.active-hd {
  font-weight: 800;
  color: #ef4444;
  border-bottom: 2px solid #ef4444;
  background: rgba(239, 68, 68, 0.12);
}
.dors-tab-btn.active-sources {
  font-weight: 800;
  color: #0ea5e9;
  border-bottom: 2px solid #0ea5e9;
  background: rgba(14, 165, 233, 0.12);
}
:root[data-theme=dark] .dors-tab-btn.active-sync {
  color: #60a5fa !important;
  border-bottom: 2px solid #3b82f6 !important;
  background: rgba(59, 130, 246, 0.18) !important;
}
:root[data-theme=dark] .dors-tab-btn.active-hd {
  color: #f87171 !important;
  border-bottom: 2px solid #ef4444 !important;
  background: rgba(239, 68, 68, 0.18) !important;
}
:root[data-theme=dark] .dors-tab-btn.active-sources {
  color: #38bdf8 !important;
  border-bottom: 2px solid #0ea5e9 !important;
  background: rgba(14, 165, 233, 0.18) !important;
}
`;

// 2. Replace function T
const oldT = 'function T({label:e,value:n,tone:a}){return(0,t.jsxs)("div",{style:{background:"var(--surface-hover, #f8fafc)",borderRadius:10,padding:"0.6rem 0.75rem"},children:[(0,t.jsx)("div",{style:{fontSize:"0.7rem",fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.03em",marginBottom:"0.2rem"},children:e}),(0,t.jsx)("div",{style:{fontWeight:700,fontSize:"0.9rem",color:"ok"===a?"#16a34a":"bad"===a?"#dc2626":"#0f172a"},children:n})]})}';

const newT = 'function T({label:e,value:n,tone:a}){return(0,t.jsxs)("div",{style:{background:"var(--surface-50, rgba(255,255,255,0.03))",border:"1px solid var(--surface-border, rgba(255,255,255,0.08))",borderRadius:10,padding:"0.75rem 0.85rem"},children:[(0,t.jsx)("div",{style:{fontSize:"0.72rem",fontWeight:700,color:"var(--text-color-secondary, #94a3b8)",textTransform:"uppercase",letterSpacing:"0.04em",marginBottom:"0.3rem"},children:e}),(0,t.jsx)("div",{style:{fontWeight:800,fontSize:"1.05rem",color:"ok"===a?"#22c55e":"bad"===a?"#ef4444":"var(--text-color, #f1f5f9)"},children:n})]})}';

if (!content.includes(oldT)) throw new Error('Target oldT not found!');
content = content.replace(oldT, newT);

// 3. Replace function M
const oldM = 'function M({label:e,hint:n,children:a}){return(0,t.jsxs)("div",{style:{flex:"1 1 8rem"},children:[(0,t.jsxs)("label",{style:{display:"block",marginBottom:"0.28rem",fontSize:"0.8rem",fontWeight:700,color:"#334155"},children:[e," ",n&&(0,t.jsxs)("span",{style:{color:"#94a3b8",fontWeight:400},children:["(",n,")"]})]}),a]})}';

const newM = 'function M({label:e,hint:n,children:a}){return(0,t.jsxs)("div",{style:{flex:"1 1 8rem"},children:[(0,t.jsxs)("label",{style:{display:"block",marginBottom:"0.32rem",fontSize:"0.8rem",fontWeight:700,color:"var(--text-color, #f1f5f9)"},children:[e," ",n&&(0,t.jsxs)("span",{style:{color:"var(--text-color-secondary, #94a3b8)",fontWeight:400},children:["(",n,")"]})]}),a]})}';

if (!content.includes(oldM)) throw new Error('Target oldM not found!');
content = content.replace(oldM, newM);

// 4. Replace Top section and Tabs
const oldTopSection = `(0,t.jsxs)("div",{className:"cms-card",style:{margin:"1rem 0",padding:"1rem 1.15rem"},children:[(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.85rem",flexWrap:"wrap",gap:"0.5rem"},children:[(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[(0,t.jsx)(y.Database,{size:19,style:{color:"#2563eb"}}),(0,t.jsx)("span",{style:{fontWeight:800,fontSize:"1.05rem",color:"#1e293b"},children:"Metrik Terpadu Integrasi DORS"}),(0,t.jsx)(u.Tag,{severity:Z?.client_configured?"success":"danger",value:Z?.client_configured?("Client ID: " + (Z.client_id_masked || "")): "Client ID Belum Diisi",style:{marginLeft:"0.5rem"}})]}),(0,t.jsx)(o.Button,{label:"Refresh Metrik",icon:"pi pi-refresh",text:!0,size:"small",onClick:()=>{fetchEMetrics();eS();}})]}),(0,t.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(13rem, 1fr))",gap:"0.75rem"},children:[(0,t.jsx)(T,{label:"Total Raw LP DORS",value:eMetrics?.raw_dors?.total?Number(eMetrics.raw_dors.total).toLocaleString("id-ID"):"1.736.097",tone:"ok"}),(0,t.jsx)(T,{label:"LP Aktif di CAS",value:eMetrics?.laporan_polisi?.aktif?Number(eMetrics.laporan_polisi.aktif).toLocaleString("id-ID"):"1.730.218",tone:"ok"}),(0,t.jsx)(T,{label:"LP Dihapus / Batal (DORS)",value:eMetrics?.history_delete?.total?((eMetrics.history_delete.applied||eMetrics.history_delete.total) + " Diterapkan"):"37 Diterapkan",tone:"ok"}),(0,t.jsx)(T,{label:"LP Belum Termapping",value:eMetrics?.unmapped_count!==undefined?String(eMetrics.unmapped_count):"10",tone:eMetrics?.unmapped_count>0?"bad":"ok"})]})]}),(0,t.jsxs)("div",{style:{display:"flex",gap:"0.5rem",borderBottom:"2px solid #e2e8f0",marginBottom:"1.25rem",flexWrap:"wrap",paddingBottom:"0.25rem"},children:[(0,t.jsxs)("button",{type:"button",onClick:()=>setActiveTab("sync"),style:{display:"inline-flex",alignItems:"center",gap:"0.5rem",padding:"0.65rem 1.15rem",fontWeight:"sync"===activeTab?800:600,fontSize:"0.88rem",color:"sync"===activeTab?"#2563eb":"#64748b",borderBottom:"sync"===activeTab?"3px solid #2563eb":"3px solid transparent",background:"sync"===activeTab?"#eff6ff":"transparent",borderRadius:"8px 8px 0 0",border:"none",cursor:"pointer",transition:"all 0.2s ease"},children:[(0,t.jsx)(S,{size:16}),"Penjadwalan & Tarik Manual"]}),(0,t.jsxs)("button",{type:"button",onClick:()=>setActiveTab("history-delete"),style:{display:"inline-flex",alignItems:"center",gap:"0.5rem",padding:"0.65rem 1.15rem",fontWeight:"history-delete"===activeTab?800:600,fontSize:"0.88rem",color:"history-delete"===activeTab?"#dc2626":"#64748b",borderBottom:"history-delete"===activeTab?"3px solid #dc2626":"3px solid transparent",background:"history-delete"===activeTab?"#fef2f2":"transparent",borderRadius:"8px 8px 0 0",border:"none",cursor:"pointer",transition:"all 0.2s ease"},children:[(0,t.jsx)(b.XCircle,{size:16}),"Riwayat LP Dihapus (gk_history_delete)",(0,t.jsx)(u.Tag,{severity:"danger",value:String(eHDTotal||37),style:{marginLeft:"0.25rem",fontSize:"0.72rem"}})]}),(0,t.jsxs)("button",{type:"button",onClick:()=>setActiveTab("sources"),style:{display:"inline-flex",alignItems:"center",gap:"0.5rem",padding:"0.65rem 1.15rem",fontWeight:"sources"===activeTab?800:600,fontSize:"0.88rem",color:"sources"===activeTab?"#0284c7":"#64748b",borderBottom:"sources"===activeTab?"3px solid #0284c7":"3px solid transparent",background:"sources"===activeTab?"#f0f9ff":"transparent",borderRadius:"8px 8px 0 0",border:"none",cursor:"pointer",transition:"all 0.2s ease"},children:[(0,t.jsx)(y.Database,{size:16}),"Status Endpoint & Koneksi",(0,t.jsx)(u.Tag,{severity:eD>0?"success":"info",value:(j.length||2) + " Sumber",style:{marginLeft:"0.25rem",fontSize:"0.72rem"}})]})]}),`;

const newTopSection = `(0,t.jsxs)("div",{className:"cms-card",style:{margin:"1rem 0",padding:"1.1rem 1.25rem"},children:[(0,t.jsx)("style",{children:\`${cssOverride}\`}),(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1rem",flexWrap:"wrap",gap:"0.6rem"},children:[(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.6rem"},children:[(0,t.jsx)(y.Database,{size:20,style:{color:"var(--primary-color, #3b82f6)"}}),(0,t.jsx)("span",{style:{fontWeight:800,fontSize:"1.1rem",color:"var(--text-color, #f8fafc)"},children:"Metrik Terpadu Integrasi DORS"}),(0,t.jsx)(u.Tag,{severity:Z?.client_configured?"success":"danger",value:Z?.client_configured?("Client ID: " + (Z.client_id_masked || "")): "Client ID Belum Diisi",style:{marginLeft:"0.4rem"}})]}),(0,t.jsx)(o.Button,{label:"Refresh Metrik",icon:"pi pi-refresh",text:!0,size:"small",onClick:()=>{fetchEMetrics();eS();}})]}),(0,t.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(13rem, 1fr))",gap:"0.75rem"},children:[(0,t.jsx)(T,{label:"Total Raw LP DORS",value:eMetrics?.raw_dors?.total?Number(eMetrics.raw_dors.total).toLocaleString("id-ID"):"1.736.097",tone:"ok"}),(0,t.jsx)(T,{label:"LP Aktif di CAS",value:eMetrics?.laporan_polisi?.aktif?Number(eMetrics.laporan_polisi.aktif).toLocaleString("id-ID"):"1.730.218",tone:"ok"}),(0,t.jsx)(T,{label:"LP Dihapus / Batal (DORS)",value:eMetrics?.history_delete?.total?((eMetrics.history_delete.applied||eMetrics.history_delete.total) + " Diterapkan"):"37 Diterapkan",tone:"ok"}),(0,t.jsx)(T,{label:"LP Belum Termapping",value:eMetrics?.unmapped_count!==undefined?String(eMetrics.unmapped_count):"10",tone:eMetrics?.unmapped_count>0?"bad":"ok"})]})]}),(0,t.jsxs)("div",{style:{display:"flex",gap:"0.4rem",borderBottom:"1px solid var(--surface-border, #334155)",marginBottom:"1.25rem",flexWrap:"wrap",paddingBottom:"0.25rem"},children:[(0,t.jsxs)("button",{type:"button",onClick:()=>setActiveTab("sync"),className:"dors-tab-btn" + ("sync"===activeTab?" active-sync":""),children:[(0,t.jsx)(S,{size:16}),"Penjadwalan & Tarik Manual"]}),(0,t.jsxs)("button",{type:"button",onClick:()=>setActiveTab("history-delete"),className:"dors-tab-btn" + ("history-delete"===activeTab?" active-hd":""),children:[(0,t.jsx)(b.XCircle,{size:16}),"Riwayat LP Dihapus (gk_history_delete)",(0,t.jsx)(u.Tag,{severity:"danger",value:String(eHDTotal||37),style:{marginLeft:"0.25rem",fontSize:"0.72rem"}})]}),(0,t.jsxs)("button",{type:"button",onClick:()=>setActiveTab("sources"),className:"dors-tab-btn" + ("sources"===activeTab?" active-sources":""),children:[(0,t.jsx)(y.Database,{size:16}),"Status Endpoint & Koneksi",(0,t.jsx)(u.Tag,{severity:eD>0?"success":"info",value:(j.length||2) + " Sumber",style:{marginLeft:"0.25rem",fontSize:"0.72rem"}})]})]}),`;

if (!content.includes(oldTopSection)) throw new Error('Target oldTopSection not found!');
content = content.replace(oldTopSection, newTopSection);

// 5. Replace running sync box styling
const oldRunningBox = 'ev&&"running"===ev.status&&(0,t.jsxs)("div",{style:{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:10,padding:"0.85rem 1rem",marginBottom:"1rem"},children:[(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.55rem",marginBottom:"0.7rem",flexWrap:"wrap"},children:[(0,t.jsx)("span",{className:"rc-spin"}),(0,t.jsx)("strong",{style:{fontSize:"0.85rem"},children:"Sinkronisasi sedang berjalan…"}),(0,t.jsxs)("span",{style:{fontSize:"0.76rem",color:"#64748b"},children:["percobaan ",ev.attempt??1,"/",ev.max_attempts??5," · ",ev.total_upserted," data baru sejauh ini"]}),(0,t.jsx)(o.Button,{label:eCanceling?"Menghentikan…":"Hentikan Penarikan",icon:"pi pi-times-circle",severity:"danger",size:"small",outlined:!0,onClick:doCancelSync,loading:eCanceling,style:{marginLeft:"auto"}})]}),';

const newRunningBox = 'ev&&"running"===ev.status&&(0,t.jsxs)("div",{style:{background:"rgba(59, 130, 246, 0.12)",border:"1px solid rgba(59, 130, 246, 0.3)",borderRadius:10,padding:"0.85rem 1rem",marginBottom:"1rem"},children:[(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.55rem",marginBottom:"0.7rem",flexWrap:"wrap"},children:[(0,t.jsx)("span",{className:"rc-spin"}),(0,t.jsx)("strong",{style:{fontSize:"0.85rem",color:"var(--text-color, #f8fafc)"},children:"Sinkronisasi sedang berjalan…"}),(0,t.jsxs)("span",{style:{fontSize:"0.76rem",color:"var(--text-color-secondary, #94a3b8)"},children:["percobaan ",ev.attempt??1,"/",ev.max_attempts??5," · ",ev.total_upserted," data baru sejauh ini"]}),(0,t.jsx)(o.Button,{label:eCanceling?"Menghentikan…":"Hentikan Penarikan",icon:"pi pi-times-circle",severity:"danger",size:"small",outlined:!0,onClick:doCancelSync,loading:eCanceling,style:{marginLeft:"auto"}})]}),';

if (!content.includes(oldRunningBox)) throw new Error('Target oldRunningBox not found!');
content = content.replace(oldRunningBox, newRunningBox);

// 6. Running sync sources progress items
content = content.replace(
  'minWidth:"8rem",fontWeight:700,color:"#334155"',
  'minWidth:"8rem",fontWeight:700,color:"var(--text-color, #f1f5f9)"'
);
content = content.replace(
  'flex:1,background:"#dbeafe",borderRadius:999,height:8,overflow:"hidden"',
  'flex:1,background:"rgba(59, 130, 246, 0.2)",borderRadius:999,height:8,overflow:"hidden"'
);
content = content.replace(
  'fontSize:"0.74rem",color:s>0?"#16a34a":"#475569",minWidth:"5.5rem",textAlign:"right"',
  'fontSize:"0.74rem",color:s>0?"#22c55e":"var(--text-color-secondary, #94a3b8)",minWidth:"5.5rem",textAlign:"right"'
);
content = content.replace(
  'fontSize:"0.72rem",color:"error"===c.status?"#dc2626":"#64748b",marginLeft:"8.6rem"',
  'fontSize:"0.72rem",color:"error"===c.status?"#ef4444":"var(--text-color-secondary, #94a3b8)",marginLeft:"8.6rem"'
);
content = content.replace(
  'style:{fontSize:"0.74rem",color:"#64748b",margin:"0.6rem 0 0"}',
  'style:{fontSize:"0.74rem",color:"var(--text-color-secondary, #94a3b8)",margin:"0.6rem 0 0"}'
);

// 7. Card titles and text in Penjadwalan
content = content.replace(
  '(0,t.jsx)("span",{style:{fontWeight:800,fontSize:"1rem"},children:"Penjadwalan & Penarikan Data"})',
  '(0,t.jsx)("span",{style:{fontWeight:800,fontSize:"1rem",color:"var(--text-color, #f8fafc)"},children:"Penjadwalan & Penarikan Data"})'
);
content = content.replace(
  'style:{fontWeight:700,fontSize:"0.85rem",color:"#334155",marginBottom:"0.5rem",display:"flex",alignItems:"center",gap:"0.4rem"}',
  'style:{fontWeight:700,fontSize:"0.85rem",color:"var(--text-color, #f1f5f9)",marginBottom:"0.5rem",display:"flex",alignItems:"center",gap:"0.4rem"}'
);
content = content.replace(
  'style:{fontWeight:700,fontSize:"0.85rem",color:"#334155"}',
  'style:{fontWeight:700,fontSize:"0.85rem",color:"var(--text-color, #f1f5f9)"}'
);
content = content.replace(
  'style:{fontWeight:700,fontSize:"0.82rem",color:"#334155",marginBottom:"0.4rem"}',
  'style:{fontWeight:700,fontSize:"0.82rem",color:"var(--text-color, #f1f5f9)",marginBottom:"0.4rem"}'
);

// 8. Buttons
content = content.replace(
  '(0,t.jsxs)(o.Button,{onClick:eN,loading:ey,className:"att-btn",style:{width:"100%"},children:[(0,t.jsx)(C,{id:"fld-2euu9hqyjbvnk-11",name:"field_2euu9hqyjbvnk_11",size:16,style:{marginRight:"0.4rem"}})," ",ey?"Menarik…":"Tarik Sekarang"]})',
  '(0,t.jsxs)(o.Button,{onClick:eN,loading:ey,className:"p-button-info",style:{width:"100%"},children:[(0,t.jsx)(C,{id:"fld-2euu9hqyjbvnk-11",name:"field_2euu9hqyjbvnk_11",size:16,style:{marginRight:"0.4rem"}})," ",ey?"Menarik…":"Tarik Sekarang"]})'
);
content = content.replace(
  '(0,t.jsx)(o.Button,{label:"Simpan Jadwal",icon:"pi pi-check",onClick:eE,loading:ec})',
  '(0,t.jsx)(o.Button,{label:"Simpan Jadwal",icon:"pi pi-check",severity:"success",onClick:eE,loading:ec})'
);

// 9. Riwayat LP Dihapus Tab titles and text
content = content.replace(
  '(0,t.jsx)("span",{style:{fontWeight:800,fontSize:"1.05rem",color:"#1e293b"},children:"Riwayat LP Dihapus / Dibatalkan (DORS Stamaops)"})',
  '(0,t.jsx)("span",{style:{fontWeight:800,fontSize:"1.05rem",color:"var(--text-color, #f8fafc)"},children:"Riwayat LP Dihapus / Dibatalkan (DORS Stamaops)"})'
);
content = content.replace(
  '(0,t.jsx)("p",{style:{fontSize:"0.8rem",color:"#64748b",margin:"0.25rem 0 0"},children:"Data LP yang dihapus dari endpoint gk_history_delete Stamaops. Otomatis diterapkan soft-delete pada Laporan Polisi CAS."})',
  '(0,t.jsx)("p",{style:{fontSize:"0.8rem",color:"var(--text-color-secondary, #94a3b8)",margin:"0.25rem 0 0"},children:"Data LP yang dihapus dari endpoint gk_history_delete Stamaops. Otomatis diterapkan soft-delete pada Laporan Polisi CAS."})'
);

// 10. Status Endpoint & Koneksi Tab
content = content.replace(
  '(0,t.jsx)("label",{style:{display:"block",fontSize:"0.75rem",fontWeight:700,color:"#64748b",marginBottom:"0.25rem"},children:"Dari"})',
  '(0,t.jsx)("label",{style:{display:"block",fontSize:"0.75rem",fontWeight:700,color:"var(--text-color-secondary, #94a3b8)",marginBottom:"0.25rem"},children:"Dari"})'
);
content = content.replace(
  '(0,t.jsx)("label",{style:{display:"block",fontSize:"0.75rem",fontWeight:700,color:"#64748b",marginBottom:"0.25rem"},children:"Sampai"})',
  '(0,t.jsx)("label",{style:{display:"block",fontSize:"0.75rem",fontWeight:700,color:"var(--text-color-secondary, #94a3b8)",marginBottom:"0.25rem"},children:"Sampai"})'
);
content = content.replace(
  'color:e.active?"#16a34a":"#dc2626",background:e.active?"#ecfdf5":"#fef2f2",borderRadius:999,padding:"0.2rem 0.6rem"',
  'color:e.active?"#22c55e":"#ef4444",background:e.active?"rgba(34, 197, 94, 0.16)":"rgba(239, 68, 68, 0.16)",border:e.active?"1px solid rgba(34, 197, 94, 0.3)":"1px solid rgba(239, 68, 68, 0.3)",borderRadius:999,padding:"0.2rem 0.6rem"'
);
content = content.replace(
  'style:{display:"flex",gap:"1.25rem",flexWrap:"wrap",fontSize:"0.85rem",color:"#475569",marginBottom:"0.5rem"}',
  'style:{display:"flex",gap:"1.25rem",flexWrap:"wrap",fontSize:"0.85rem",color:"var(--text-color-secondary, #94a3b8)",marginBottom:"0.5rem"}'
);
content = content.replace(
  'style:{fontSize:"0.8rem",color:"#dc2626",marginBottom:"0.4rem"}',
  'style:{fontSize:"0.8rem",color:"#ef4444",marginBottom:"0.4rem"}'
);
content = content.replace(
  'background:"#f1f5f9",padding:"0.1rem 0.4rem",borderRadius:4',
  'background:"var(--surface-hover, rgba(255,255,255,0.06))",color:"var(--text-color, #f1f5f9)",padding:"0.1rem 0.4rem",borderRadius:4'
);
content = content.replace(
  'style:{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:8,padding:"0.75rem",color:"#b91c1c",fontSize:"0.85rem",whiteSpace:"pre-wrap",wordBreak:"break-word"}',
  'style:{background:"rgba(239, 68, 68, 0.12)",border:"1px solid rgba(239, 68, 68, 0.3)",borderRadius:8,padding:"0.75rem",color:"#f87171",fontSize:"0.85rem",whiteSpace:"pre-wrap",wordBreak:"break-word"}'
);

fs.writeFileSync('scratch/2euu9hqyjbvnk.themed.js', content, 'utf8');
console.log('Saved scratch/2euu9hqyjbvnk.themed.js, length:', content.length);

try {
  cp.execSync('node --check scratch/2euu9hqyjbvnk.themed.js');
  console.log('SYNTAX CHECK PASSED!');
} catch (e) {
  console.error('SYNTAX CHECK FAILED:', e.message);
  process.exit(1);
}
