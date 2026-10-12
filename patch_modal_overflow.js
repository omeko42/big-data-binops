const fs = require('fs');

console.log('=== Patching Modal Popup Overflow & Contrast in 3def3ti6rk0vr.patched.js ===');
let code = fs.readFileSync('3def3ti6rk0vr.patched.js', 'utf8');

const targetStart = '// 7. Banner Theme Modal';
const targetEnd = '// 8. Add Section Modal';

let idx = code.indexOf(targetStart);
let endIdx = code.indexOf(targetEnd, idx);

if (idx === -1 || endIdx === -1) {
  console.error('ERROR: Could not find banner modal block!');
  process.exit(1);
}

const newModalCode = `// 7. Banner Theme Modal
(0,t.jsx)(r.Dialog,{
  header:"Kustomisasi Banner Sampul Taktis",
  visible:Boolean(eBannerModal && !isReadOnlyMode),
  onHide:()=>setBannerModal(!1),
  style:{width:"34rem",maxWidth:"95vw"},
  contentStyle:{overflowX:"hidden",padding:"1rem 1.25rem"},
  modal:!0,
  dismissableMask:!0,
  footer:(0,t.jsxs)("div",{style:{display:"flex",justifyContent:"flex-end",gap:"0.5rem"},children:[
    (0,t.jsx)("button",{
      type:"button",
      onClick:()=>setBannerModal(!1),
      style:{background:"transparent",color:"#64748b",border:"1px solid #cbd5e1",borderRadius:"8px",padding:"0.5rem 1rem",fontSize:"0.82rem",fontWeight:700,cursor:"pointer"},
      children:"Batal"
    }),
    (0,t.jsx)("button",{
      type:"button",
      onClick:handleSaveBanner,
      style:{background:"#2563eb",color:"#fff",border:"none",borderRadius:"8px",padding:"0.5rem 1.25rem",fontSize:"0.82rem",fontWeight:700,cursor:"pointer"},
      children:"Terapkan Sampul"
    })
  ]}),
  children:(0,t.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.85rem",width:"100%",boxSizing:"border-box",overflowX:"hidden"},children:[
    (0,t.jsx)("label",{style:{fontSize:"0.8rem",color:"#334155",fontWeight:700},children:"Pilih Tema Taktis CAS:"}),
    (0,t.jsx)("div",{
      style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.6rem",width:"100%",boxSizing:"border-box"},
      children:[
        { id: "cyber_blue", name: "Cyber Ops Blue", grad: "linear-gradient(135deg, #090d16 0%, #0f172a 45%, #1e293b 85%, #0369a1 100%)" },
        { id: "stealth_dark", name: "Stealth Reskrim", grad: "linear-gradient(135deg, #020617 0%, #0f172a 60%, #1e1b4b 100%)" },
        { id: "emerald_shield", name: "Tactical Emerald", grad: "linear-gradient(135deg, #022c22 0%, #064e3b 50%, #0f172a 100%)" },
        { id: "gold_command", name: "Gold Command", grad: "linear-gradient(135deg, #1c1917 0%, #292524 50%, #78350f 100%)" }
      ].map(thm => (0,t.jsx)("button",{
        key:thm.id,
        type:"button",
        onClick:()=>{setBannerTheme(thm.grad);setRawBanner(null);},
        style:{
          height:"50px",
          borderRadius:"8px",
          background:thm.grad,
          border:eBannerTheme===thm.grad?"2px solid #0284c7":"1px solid rgba(255,255,255,0.2)",
          color:"#fff",
          fontSize:"0.78rem",
          fontWeight:700,
          cursor:"pointer",
          display:"flex",
          alignItems:"center",
          justifyContent:"center",
          boxShadow:eBannerTheme===thm.grad?"0 0 10px rgba(2,132,199,0.5)":"none"
        },
        children:thm.name
      }))
    }),
    (0,t.jsx)("div",{style:{borderTop:"1px solid #e2e8f0",margin:"0.2rem 0"}}),
    (0,t.jsx)("label",{style:{fontSize:"0.8rem",color:"#334155",fontWeight:700},children:"Atau Unggah Foto Sampul Kustom Sendiri:"}),
    (0,t.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.6rem",width:"100%",boxSizing:"border-box"},children:[
      (0,t.jsx)("input",{
        id:"custom-banner-file-input",
        type:"file",
        style:{display:"none"},
        accept:"image/png,image/jpeg,image/webp",
        onChange:function(ev){
          let f = ev.target.files?.[0];
          if (!f) return;
          setCustomBannerLoading(!0);
          let r = new FileReader();
          r.onload = function(e2){
            let img = new Image();
            img.onload = function(){
              let maxDim = 1400;
              let w = img.width, h = img.height;
              let scale = Math.min(1, maxDim / Math.max(w, h));
              let cv = document.createElement("canvas");
              cv.width = Math.round(w * scale);
              cv.height = Math.round(h * scale);
              let cx = cv.getContext("2d");
              cx.drawImage(img, 0, 0, cv.width, cv.height);
              let compressed = cv.toDataURL("image/jpeg", 0.85);
              setRawBanner(compressed);
              setBannerTheme(compressed);
              setBannerZoom(1);
              setBannerPanX(0);
              setBannerPanY(0);
              setCustomBannerLoading(!1);
            };
            img.onerror = function(){
              setCustomBannerLoading(!1);
              e.current?.show({ severity: 'error', summary: 'Gagal', detail: 'Format gambar tidak didukung.' });
            };
            img.src = e2.target.result;
          };
          r.onerror = function(){
            setCustomBannerLoading(!1);
            e.current?.show({ severity: 'error', summary: 'Gagal', detail: 'Gagal membaca file gambar.' });
          };
          r.readAsDataURL(f);
        }
      }),
      (0,t.jsxs)("button",{
        type:"button",
        disabled:eCustomBannerLoading,
        onClick:() => document.getElementById('custom-banner-file-input')?.click(),
        style:{background:"#eff6ff",border:"1px dashed #3b82f6",borderRadius:"8px",padding:"0.65rem",color:"#2563eb",fontSize:"0.8rem",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem",width:"100%",boxSizing:"border-box"},
        children:[
          (0,t.jsx)("span",{children:"📷"}),
          (0,t.jsx)("span",{children:eCustomBannerLoading ? "Mengompresi gambar..." : "Pilih Foto Sampul dari Perangkat"})
        ]
      }),
      ((eRawBanner || (eBannerTheme && (eBannerTheme.startsWith('data:') || eBannerTheme.startsWith('http')))) && (0,t.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.55rem",width:"100%",boxSizing:"border-box"},children:[
        (0,t.jsxs)("div",{id:"cas-banner-crop-box",style:{position:"relative",borderRadius:"8px",overflow:"hidden",width:"100%",maxWidth:"100%",aspectRatio:\`\${(typeof document !== 'undefined' && document.getElementById("cas-profile-hero-banner") && document.getElementById("cas-profile-hero-banner").offsetHeight) ? (document.getElementById("cas-profile-hero-banner").offsetWidth / document.getElementById("cas-profile-hero-banner").offsetHeight).toFixed(3) : 6.2} / 1\`,border:"1.5px solid #0284c7",background:"#090d16",display:"flex",alignItems:"center",justifyContent:"center",boxSizing:"border-box"},children:[
          (0,t.jsx)("img",{id:"cas-banner-crop-img",src:eRawBanner || eBannerTheme,alt:"Pratinjau Sampul",style:{position:"absolute",left:"50%",top:"50%",maxWidth:"100%",maxHeight:"100%",objectFit:"contain",transform:\`translate(-50%, -50%) translate(\${eBannerPanX}px, \${eBannerPanY}px) scale(\${eBannerZoom})\`,transformOrigin:"center center",pointerEvents:"none"}}),
          (0,t.jsx)("div",{style:{position:"absolute",bottom:"4px",right:"6px",background:"rgba(0,0,0,0.75)",color:"#38bdf8",padding:"2px 8px",borderRadius:"4px",fontSize:"0.68rem",fontWeight:700},children:"Pratinjau Sampul (100% Sesuai Hasil)"})
        ]}),
        (0,t.jsxs)("div",{style:{display:"flex",gap:"0.4rem",justifyContent:"center",width:"100%",boxSizing:"border-box"},children:[
          (0,t.jsx)("button",{type:"button",onClick:()=>{setBannerZoom(1);setBannerPanX(0);setBannerPanY(0);},style:{flex:1,padding:"0.4rem 0.6rem",fontSize:"0.75rem",fontWeight:600,borderRadius:"6px",border:"1px solid #cbd5e1",background:"#f1f5f9",color:"#1e293b",cursor:"pointer"},children:"Muat Semua (Fit)"}),
          (0,t.jsx)("button",{type:"button",onClick:()=>{
            let box = document.getElementById("cas-banner-crop-box");
            let img = document.getElementById("cas-banner-crop-img");
            if (box && img && img.offsetWidth > 0 && img.offsetHeight > 0) {
              let fz = Math.min(3, Math.max(1, Math.max(box.offsetWidth / img.offsetWidth, box.offsetHeight / img.offsetHeight)));
              setBannerZoom(parseFloat(fz.toFixed(2)));
            } else {
              setBannerZoom(1.5);
            }
            setBannerPanX(0);
            setBannerPanY(0);
          },style:{flex:1,padding:"0.4rem 0.6rem",fontSize:"0.75rem",fontWeight:600,borderRadius:"6px",border:"1px solid #38bdf8",background:"#e0f2fe",color:"#0284c7",cursor:"pointer"},children:"Isi Penuh (Fill)"}),
          (0,t.jsx)("button",{type:"button",onClick:()=>{setBannerZoom(1);setBannerPanX(0);setBannerPanY(0);},style:{padding:"0.4rem 0.8rem",fontSize:"0.75rem",fontWeight:600,borderRadius:"6px",border:"1px solid #cbd5e1",background:"#f8fafc",color:"#64748b",cursor:"pointer"},children:"Reset (100%)"})
        ]}),
        (0,t.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.45rem",background:"#f8fafc",border:"1px solid #e2e8f0",padding:"0.7rem 0.85rem",borderRadius:"8px",fontSize:"0.75rem",width:"100%",boxSizing:"border-box"},children:[
          (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between"},children:[
            (0,t.jsx)("span",{style:{color:"#334155",fontWeight:600},children:"Ukuran Gambar (Zoom)"}),
            (0,t.jsx)("span",{style:{fontWeight:700,color:"#0284c7"},children:\`\${Math.round(eBannerZoom*100)}%\`})
          ]}),
          (0,t.jsx)("input",{type:"range",min:"0.3",max:"3",step:"0.05",value:eBannerZoom,onChange:e=>setBannerZoom(parseFloat(e.target.value)),style:{width:"100%",accentColor:"#0284c7",cursor:"pointer",margin:0}}),
          (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:"0.2rem"},children:[
            (0,t.jsx)("span",{style:{color:"#334155",fontWeight:600},children:"Geser Kiri / Kanan"}),
            (0,t.jsx)("span",{style:{fontWeight:600,color:"#64748b"},children:\`\${eBannerPanX}px\`})
          ]}),
          (0,t.jsx)("input",{type:"range",min:"-200",max:"200",step:"1",value:eBannerPanX,onChange:e=>setBannerPanX(parseInt(e.target.value)),style:{width:"100%",accentColor:"#0284c7",cursor:"pointer",margin:0}}),
          (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:"0.2rem"},children:[
            (0,t.jsx)("span",{style:{color:"#334155",fontWeight:600},children:"Geser Atas / Bawah"}),
            (0,t.jsx)("span",{style:{fontWeight:600,color:"#64748b"},children:\`\${eBannerPanY}px\`})
          ]}),
          (0,t.jsx)("input",{type:"range",min:"-160",max:"160",step:"1",value:eBannerPanY,onChange:e=>setBannerPanY(parseInt(e.target.value)),style:{width:"100%",accentColor:"#0284c7",cursor:"pointer",margin:0}})
        ]})
      ]}))
    ]})
  ]})
}),

`;

code = code.slice(0, idx) + newModalCode + code.slice(endIdx);

fs.writeFileSync('3def3ti6rk0vr.patched.js', code, 'utf8');
console.log('Saved 3def3ti6rk0vr.patched.js cleanly! New length:', code.length);
