const fs = require('fs');

console.log('=== Applying Cover Banner WYSIWYG & Anti-Zoom Fix ===');
let code = fs.readFileSync('3def3ti6rk0vr.patched.js', 'utf8');

// 1. Target 1: handleSaveBanner
const oldSaveBanner = `let handleSaveBanner = async () => {
  if (isReadOnlyMode) return;
  setCustomBannerLoading(!0);
  try {
    let finalBanner = eBannerTheme;
    if (eRawBanner) {
      finalBanner = await new Promise(res => {
        let box = document.getElementById("cas-banner-crop-box");
        let img = new Image();
        img.onload = function() {
          let bw = box ? box.getBoundingClientRect().width : 500;
          let bh = box ? box.getBoundingClientRect().height : 105;
          let nw = img.naturalWidth || 1200;
          let nh = img.naturalHeight || 250;
          let cssScale = Math.max(bw / nw, bh / nh);
          let renW = nw * cssScale;
          let renH = nh * cssScale;
          let zm = Math.max(1, eBannerZoom || 1);
          let px = eBannerPanX || 0;
          let py = eBannerPanY || 0;
          let visLeft = (renW * zm) / 2 - bw / 2 - (px * zm);
          let visTop = (renH * zm) / 2 - bh / 2 - (py * zm);
          let b2n = 1 / (cssScale * zm);
          let sx = visLeft * b2n;
          let sy = visTop * b2n;
          let sw = bw * b2n;
          let sh = bh * b2n;
          let cv = document.createElement("canvas");
          cv.width = 1200;
          cv.height = 250;
          let cx = cv.getContext("2d");
          cx.drawImage(img, sx, sy, sw, sh, 0, 0, cv.width, cv.height);
          res(cv.toDataURL("image/jpeg", 0.82));
        };
        img.onerror = () => res(eBannerTheme);
        img.src = eRawBanner;
      });
      setBannerTheme(finalBanner);
    }
    let ok = await persistSocialMedia({ banner_theme: finalBanner });
    if (ok) {
      e.current?.show({ severity: 'success', summary: 'Sampul Diterapkan', detail: 'Tema foto sampul berhasil diperbarui.' });
      setBannerModal(!1);
    }
  } catch (err) {
    e.current?.show({ severity: 'error', summary: 'Gagal', detail: err.response?.data?.message || 'Gagal menerapkan foto sampul.' });
  } finally {
    setCustomBannerLoading(!1);
  }
};`;

const newSaveBanner = `let handleSaveBanner = async () => {
  if (isReadOnlyMode) return;
  setCustomBannerLoading(!0);
  try {
    let finalBanner = eBannerTheme;
    if (eRawBanner) {
      finalBanner = await new Promise(res => {
        let box = document.getElementById("cas-banner-crop-box");
        let imgEl = document.getElementById("cas-banner-crop-img");
        if (!box || !imgEl) return res(eBannerTheme);

        let boxRect = box.getBoundingClientRect();
        let imgRect = imgEl.getBoundingClientRect();

        let cvWidth = 1600;
        let cvHeight = Math.max(120, Math.round(cvWidth * (boxRect.height / boxRect.width)));
        let cv = document.createElement("canvas");
        cv.width = cvWidth;
        cv.height = cvHeight;
        let cx = cv.getContext("2d");

        cx.fillStyle = "#090d16";
        cx.fillRect(0, 0, cvWidth, cvHeight);

        let scaleToCv = cvWidth / boxRect.width;
        let dx = (imgRect.left - boxRect.left) * scaleToCv;
        let dy = (imgRect.top - boxRect.top) * scaleToCv;
        let dw = imgRect.width * scaleToCv;
        let dh = imgRect.height * scaleToCv;

        let img = new Image();
        img.onload = function() {
          try {
            cx.drawImage(img, dx, dy, dw, dh);
            res(cv.toDataURL("image/jpeg", 0.88));
          } catch(eDraw) {
            res(eBannerTheme);
          }
        };
        img.onerror = () => res(eBannerTheme);
        img.src = eRawBanner;
      });
      setBannerTheme(finalBanner);
    }
    let ok = await persistSocialMedia({ banner_theme: finalBanner });
    if (ok) {
      e.current?.show({ severity: 'success', summary: 'Sampul Diterapkan', detail: 'Tema foto sampul berhasil diperbarui.' });
      setBannerModal(!1);
    }
  } catch (err) {
    e.current?.show({ severity: 'error', summary: 'Gagal', detail: err.response?.data?.message || 'Gagal menerapkan foto sampul.' });
  } finally {
    setCustomBannerLoading(!1);
  }
};`;

if (!code.includes(oldSaveBanner)) {
  console.error('ERROR: oldSaveBanner not found!');
  process.exit(1);
}
code = code.replace(oldSaveBanner, newSaveBanner);
console.log('1. handleSaveBanner replaced successfully.');


// 2. Target 2: Modal dialog width
const oldDialogHeader = `// 7. Banner Theme Modal
(0,t.jsx)(r.Dialog,{
  header:"Kustomisasi Banner Sampul Taktis",
  visible:Boolean(eBannerModal && !isReadOnlyMode),
  onHide:()=>setBannerModal(!1),
  style:{width:"32rem",maxWidth:"95vw"},`;

const newDialogHeader = `// 7. Banner Theme Modal
(0,t.jsx)(r.Dialog,{
  header:"Kustomisasi Banner Sampul Taktis",
  visible:Boolean(eBannerModal && !isReadOnlyMode),
  onHide:()=>setBannerModal(!1),
  style:{width:"38rem",maxWidth:"96vw"},`;

if (!code.includes(oldDialogHeader)) {
  console.error('ERROR: oldDialogHeader not found!');
  process.exit(1);
}
code = code.replace(oldDialogHeader, newDialogHeader);
console.log('2. Banner dialog width updated to 38rem.');


// 3. Target 3: Modal Crop Box & Sliders
const oldCropBox = `((eRawBanner || (eBannerTheme && (eBannerTheme.startsWith('data:') || eBannerTheme.startsWith('http')))) && (0,t.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.55rem"},children:[
        (0,t.jsxs)("div",{id:"cas-banner-crop-box",style:{position:"relative",borderRadius:"8px",overflow:"hidden",height:"105px",width:"100%",border:"1.5px solid #38bdf8",background:"#0f172a",display:"flex",alignItems:"center",justifyContent:"center"},children:[
          (0,t.jsx)("img",{id:"cas-banner-crop-img",src:eRawBanner || eBannerTheme,alt:"Pratinjau Sampul",style:{width:"100%",height:"100%",objectFit:"cover",transform:\`scale(\${eBannerZoom}) translate(\${eBannerPanX}px, \${eBannerPanY}px)\`,transformOrigin:"center center",pointerEvents:"none"}}),
          (0,t.jsx)("div",{style:{position:"absolute",bottom:"4px",right:"6px",background:"rgba(0,0,0,0.75)",color:"#38bdf8",padding:"2px 8px",borderRadius:"4px",fontSize:"0.68rem",fontWeight:700},children:"Pratinjau Sampul Kustom"})
        ]}),
        (0,t.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.4rem",background:"rgba(255,255,255,0.05)",padding:"0.6rem 0.8rem",borderRadius:"8px",fontSize:"0.74rem"},children:[
          (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between"},children:[
            (0,t.jsx)("span",{children:"Perbesar (Zoom)"}),
            (0,t.jsx)("span",{style:{fontWeight:700,color:"#38bdf8"},children:\`\${Math.round(eBannerZoom*100)}%\`})
          ]}),
          (0,t.jsx)("input",{type:"range",min:"1",max:"3",step:"0.05",value:eBannerZoom,onChange:e=>setBannerZoom(parseFloat(e.target.value)),style:{width:"100%",accentColor:"#38bdf8",cursor:"pointer"}}),
          (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:"0.2rem"},children:[
            (0,t.jsx)("span",{children:"Geser Kiri / Kanan"}),
            (0,t.jsx)("span",{style:{fontWeight:600,color:"#94a3b8"},children:\`\${eBannerPanX}px\`})
          ]}),
          (0,t.jsx)("input",{type:"range",min:"-80",max:"80",step:"1",value:eBannerPanX,onChange:e=>setBannerPanX(parseInt(e.target.value)),style:{width:"100%",accentColor:"#38bdf8",cursor:"pointer"}}),
          (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:"0.2rem"},children:[
            (0,t.jsx)("span",{children:"Geser Atas / Bawah"}),
            (0,t.jsx)("span",{style:{fontWeight:600,color:"#94a3b8"},children:\`\${eBannerPanY}px\`})
          ]}),
          (0,t.jsx)("input",{type:"range",min:"-80",max:"80",step:"1",value:eBannerPanY,onChange:e=>setBannerPanY(parseInt(e.target.value)),style:{width:"100%",accentColor:"#38bdf8",cursor:"pointer"}}),
          (0,t.jsx)("button",{type:"button",style:{fontSize:"0.68rem",color:"#94a3b8",background:"none",border:"none",cursor:"pointer",textDecoration:"underline",alignSelf:"center",marginTop:"0.2rem"},onClick:()=>{setBannerZoom(1);setBannerPanX(0);setBannerPanY(0);},children:"Reset Posisi & Zoom"})
        ]})
      ]}))`;

const newCropBox = `((eRawBanner || (eBannerTheme && (eBannerTheme.startsWith('data:') || eBannerTheme.startsWith('http')))) && (0,t.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.55rem"},children:[
        (0,t.jsxs)("div",{id:"cas-banner-crop-box",style:{position:"relative",borderRadius:"8px",overflow:"hidden",width:"100%",aspectRatio:\`\${(typeof document !== 'undefined' && document.getElementById("cas-profile-hero-banner") && document.getElementById("cas-profile-hero-banner").offsetHeight) ? (document.getElementById("cas-profile-hero-banner").offsetWidth / document.getElementById("cas-profile-hero-banner").offsetHeight).toFixed(3) : 6.2} / 1\`,minHeight:"85px",border:"1.5px solid #38bdf8",background:"#090d16",display:"flex",alignItems:"center",justifyContent:"center"},children:[
          (0,t.jsx)("img",{id:"cas-banner-crop-img",src:eRawBanner || eBannerTheme,alt:"Pratinjau Sampul",style:{position:"absolute",left:"50%",top:"50%",maxWidth:"100%",maxHeight:"100%",objectFit:"contain",transform:\`translate(-50%, -50%) translate(\${eBannerPanX}px, \${eBannerPanY}px) scale(\${eBannerZoom})\`,transformOrigin:"center center",pointerEvents:"none"}}),
          (0,t.jsx)("div",{style:{position:"absolute",bottom:"4px",right:"6px",background:"rgba(0,0,0,0.75)",color:"#38bdf8",padding:"2px 8px",borderRadius:"4px",fontSize:"0.68rem",fontWeight:700},children:"Pratinjau Sampul (100% Sesuai Hasil)"})
        ]}),
        (0,t.jsxs)("div",{style:{display:"flex",gap:"0.4rem",justifyContent:"center",marginTop:"0.2rem"},children:[
          (0,t.jsx)("button",{type:"button",onClick:()=>{setBannerZoom(1);setBannerPanX(0);setBannerPanY(0);},style:{flex:1,padding:"0.35rem 0.6rem",fontSize:"0.74rem",fontWeight:600,borderRadius:"6px",border:"1px solid rgba(255,255,255,0.15)",background:"rgba(255,255,255,0.06)",color:"#e2e8f0",cursor:"pointer"},children:"Muat Semua (Fit)"}),
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
          },style:{flex:1,padding:"0.35rem 0.6rem",fontSize:"0.74rem",fontWeight:600,borderRadius:"6px",border:"1px solid rgba(56,189,248,0.3)",background:"rgba(56,189,248,0.12)",color:"#38bdf8",cursor:"pointer"},children:"Isi Penuh (Fill)"}),
          (0,t.jsx)("button",{type:"button",onClick:()=>{setBannerZoom(1);setBannerPanX(0);setBannerPanY(0);},style:{padding:"0.35rem 0.75rem",fontSize:"0.74rem",fontWeight:600,borderRadius:"6px",border:"1px solid rgba(255,255,255,0.15)",background:"rgba(255,255,255,0.06)",color:"#94a3b8",cursor:"pointer"},children:"Reset (100%)"})
        ]}),
        (0,t.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.4rem",background:"rgba(255,255,255,0.05)",padding:"0.6rem 0.8rem",borderRadius:"8px",fontSize:"0.74rem"},children:[
          (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between"},children:[
            (0,t.jsx)("span",{children:"Ukuran Gambar (Zoom)"}),
            (0,t.jsx)("span",{style:{fontWeight:700,color:"#38bdf8"},children:\`\${Math.round(eBannerZoom*100)}%\`})
          ]}),
          (0,t.jsx)("input",{type:"range",min:"0.3",max:"3",step:"0.05",value:eBannerZoom,onChange:e=>setBannerZoom(parseFloat(e.target.value)),style:{width:"100%",accentColor:"#38bdf8",cursor:"pointer"}}),
          (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:"0.2rem"},children:[
            (0,t.jsx)("span",{children:"Geser Kiri / Kanan"}),
            (0,t.jsx)("span",{style:{fontWeight:600,color:"#94a3b8"},children:\`\${eBannerPanX}px\`})
          ]}),
          (0,t.jsx)("input",{type:"range",min:"-200",max:"200",step:"1",value:eBannerPanX,onChange:e=>setBannerPanX(parseInt(e.target.value)),style:{width:"100%",accentColor:"#38bdf8",cursor:"pointer"}}),
          (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:"0.2rem"},children:[
            (0,t.jsx)("span",{children:"Geser Atas / Bawah"}),
            (0,t.jsx)("span",{style:{fontWeight:600,color:"#94a3b8"},children:\`\${eBannerPanY}px\`})
          ]}),
          (0,t.jsx)("input",{type:"range",min:"-160",max:"160",step:"1",value:eBannerPanY,onChange:e=>setBannerPanY(parseInt(e.target.value)),style:{width:"100%",accentColor:"#38bdf8",cursor:"pointer"}})
        ]})
      ]}))`;

if (!code.includes(oldCropBox)) {
  console.error('ERROR: oldCropBox not found!');
  process.exit(1);
}
code = code.replace(oldCropBox, newCropBox);
console.log('3. Modal Crop Box & Sliders updated.');


// 4. Target 4: Hero Banner on profile page & Edit Button
const oldHeroBanner = `// 1. Cover Banner (Height: 200px)
  (0,t.jsxs)("div",{style:{position:"relative",height:"200px",borderTopLeftRadius:"15px",borderTopRightRadius:"15px",background:(eBannerTheme && (eBannerTheme.startsWith("data:") || eBannerTheme.startsWith("http"))) ? ("url(\\"" + eBannerTheme + "\\") center/cover no-repeat") : (eBannerTheme || "linear-gradient(135deg, #090d16 0%, #0f172a 45%, #1e293b 85%, #0369a1 100%)"),overflow:"hidden",display:"flex",alignItems:"flex-end",justifyContent:"space-between",padding:"1rem 1.5rem"},children:[


    // Edit cover button (Top right of banner, coral/orange pencil icon)
    !isReadOnlyMode && (0,t.jsx)("button",{
      type:"button",
      title:"Edit tema foto sampul",
      onClick:()=>{
        if(!isReadOnlyMode){
          if(eBannerTheme && (eBannerTheme.startsWith('data:') || eBannerTheme.startsWith('http'))){
            setRawBanner(eBannerTheme);
          }
          setBannerZoom(1);
          setBannerPanX(0);
          setBannerPanY(0);
          setBannerModal(!0);
        }
      },
      style:{position:"absolute",top:"14px",right:"16px",background:"rgba(15,23,42,0.75)",backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,0.25)",borderRadius:"50%",width:"36px",height:"36px",display:"inline-flex",alignItems:"center",justifyContent:"center",color:"#f97316",fontSize:"1rem",cursor:"pointer",boxShadow:"0 2px 6px rgba(0,0,0,0.3)"},
      children:"✏️"
    })
  ]}),`;

const newHeroBanner = `// 1. Cover Banner (Height: 220px, WYSIWYG matching modal)
  (0,t.jsxs)("div",{id:"cas-profile-hero-banner",style:{position:"relative",height:"220px",borderTopLeftRadius:"15px",borderTopRightRadius:"15px",background:(eBannerTheme && (eBannerTheme.startsWith("data:") || eBannerTheme.startsWith("http"))) ? ("url(\\"" + eBannerTheme + "\\") center/cover no-repeat") : (eBannerTheme || "linear-gradient(135deg, #090d16 0%, #0f172a 45%, #1e293b 85%, #0369a1 100%)"),overflow:"hidden",display:"flex",alignItems:"flex-end",justifyContent:"space-between",padding:"1rem 1.5rem"},children:[


    // Edit cover button (Top right of banner, coral/orange pencil icon)
    !isReadOnlyMode && (0,t.jsx)("button",{
      type:"button",
      title:"Edit tema foto sampul",
      onClick:()=>{
        if(!isReadOnlyMode){
          if(!eRawBanner && eBannerTheme && (eBannerTheme.startsWith('data:') || eBannerTheme.startsWith('http'))){
            setRawBanner(eBannerTheme);
          }
          setBannerZoom(1);
          setBannerPanX(0);
          setBannerPanY(0);
          setBannerModal(!0);
        }
      },
      style:{position:"absolute",top:"14px",right:"16px",background:"rgba(15,23,42,0.75)",backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,0.25)",borderRadius:"50%",width:"36px",height:"36px",display:"inline-flex",alignItems:"center",justifyContent:"center",color:"#f97316",fontSize:"1rem",cursor:"pointer",boxShadow:"0 2px 6px rgba(0,0,0,0.3)"},
      children:"✏️"
    })
  ]}),`;

if (!code.includes(oldHeroBanner)) {
  console.error('ERROR: oldHeroBanner not found!');
  process.exit(1);
}
code = code.replace(oldHeroBanner, newHeroBanner);
console.log('4. Hero banner & Edit Button updated.');

fs.writeFileSync('3def3ti6rk0vr.patched.js', code, 'utf8');
console.log('Saved 3def3ti6rk0vr.patched.js successfully! Length:', code.length);
