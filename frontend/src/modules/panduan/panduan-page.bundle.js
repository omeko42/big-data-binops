(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,53729,e=>{"use strict";var t=e.i(71645),r=e.i(48264),a=e.i(43456),i=e.i(29168),n=e.i(73193);function l(e){return(l="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function s(e,t,r){var a;return(a=function(e,t){if("object"!=l(e)||!e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var a=r.call(e,t||"default");if("object"!=l(a))return a;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(t,"string"),(t="symbol"==l(a)?a:a+"")in e)?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}var o=a.ComponentBase.extend({defaultProps:{__TYPE:"Tag",value:null,severity:null,rounded:!1,icon:null,style:null,className:null,children:void 0},css:{classes:{value:"p-tag-value",icon:"p-tag-icon",root:function(e){var t=e.props;return(0,n.classNames)("p-tag p-component",s(s({},"p-tag-".concat(t.severity),null!==t.severity),"p-tag-rounded",t.rounded))}},styles:"\n@layer primereact {\n    .p-tag {\n        display: inline-flex;\n        align-items: center;\n        justify-content: center;\n    }\n    \n    .p-tag-icon,\n    .p-tag-value,\n    .p-tag-icon.pi {\n        line-height: 1.5;\n    }\n    \n    .p-tag.p-tag-rounded {\n        border-radius: 10rem;\n    }\n}\n"}});function c(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,a)}return r}var d=t.forwardRef(function(e,l){var d=(0,i.useMergeProps)(),u=t.useContext(r.PrimeReactContext),p=o.getProps(e,u),m=o.setMetaData({props:p}),y=m.ptm,f=m.cx,g=m.isUnstyled;(0,a.useHandleStyle)(o.css.styles,g,{name:"tag"});var h=t.useRef(null),b=d({className:f("icon")},y("icon")),v=n.IconUtils.getJSXIcon(p.icon,function(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?c(Object(r),!0).forEach(function(t){s(e,t,r[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):c(Object(r)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))})}return e}({},b),{props:p});t.useImperativeHandle(l,function(){return{props:p,getElement:function(){return h.current}}});var x=d({ref:h,className:(0,n.classNames)(p.className,f("root")),style:p.style},o.getOtherProps(p),y("root")),j=d({className:f("value")},y("value"));return t.createElement("span",x,v,t.createElement("span",j,p.value),t.createElement("span",null,p.children))});d.displayName="Tag",e.s(["Tag",0,d])},26091,e=>{"use strict";let t=(0,e.i(56420).default)("file-text",[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]);e.s(["FileText",0,t],26091)},62368,e=>{"use strict";let t=(0,e.i(56420).default)("download",[["path",{d:"M12 15V3",key:"m9g1x1"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["path",{d:"m7 10 5 5 5-5",key:"brsn70"}]]);e.s(["Download",0,t],62368)},74544,e=>{"use strict";let t=(0,e.i(56420).default)("clock",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 6v6l4 2",key:"mmk7yg"}]]);e.s(["Clock",0,t],74544)},66473,e=>{"use strict";let t=(0,e.i(56420).default)("circle-play",[["path",{d:"M9 9.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997A1 1 0 0 1 9 14.996z",key:"kmsa83"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);e.s(["PlayCircle",0,t],66473)},41464,e=>{"use strict";let t=(0,e.i(56420).default)("file-play",[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M15.033 13.44a.647.647 0 0 1 0 1.12l-4.065 2.352a.645.645 0 0 1-.968-.56v-4.704a.645.645 0 0 1 .967-.56z",key:"1tzo1f"}]]);e.s(["FileVideo",0,t],41464)},99424,e=>{"use strict";
var t=e.i(43476),r=e.i(71645),a=e.i(71144),i=e.i(53729),n=e.i(41464),l=e.i(26091),s=e.i(66473),o=e.i(62368),c=e.i(74544),d=e.i(54858);

function u(e){
  if(!e)return null;
  let t=e/1048576;
  return t>=1?`${t.toFixed(1)} MB`:`${Math.max(1,Math.round(e/1024))} KB`;
}
function fmtMbId(bytes){
  let n=Number(bytes||0);
  if(n<=0)return"0,0 MB";
  let mb=n/1048576;
  return mb>=0.1?`${mb.toFixed(1).replace(".",",")} MB`:`${Math.max(1,Math.round(n/1024))} KB`;
}
function fmtSpeedId(bps){
  let n=Number(bps||0);
  if(n<=0)return"Menghitung kecepatan...";
  let mbps=n/1048576;
  return mbps>=0.1?`${mbps.toFixed(1).replace(".",",")} MB/dtk`:`${Math.max(1,Math.round(n/1024))} KB/dtk`;
}
function fmtEtaId(sec){
  if(null===sec||!Number.isFinite(sec)||sec<0)return"Menghitung estimasi...";
  if(0===sec)return"Hampir selesai...";
  if(sec<60)return`Estimasi selesai ~${sec} detik lagi`;
  let m=Math.floor(sec/60),s=sec%60;
  return s>0?`Estimasi selesai ~${m} menit ${s} detik lagi`:`Estimasi selesai ~${m} menit lagi`;
}
function fmtVideoTime(sec){
  if(!Number.isFinite(sec)||sec<0)return"00:00";
  let total=Math.floor(sec),hrs=Math.floor(total/3600),mins=Math.floor((total%3600)/60),secs=total%60;
  return hrs>0?`${String(hrs).padStart(2,"0")}:${String(mins).padStart(2,"0")}:${String(secs).padStart(2,"0")}`:`${String(mins).padStart(2,"0")}:${String(secs).padStart(2,"0")}`;
}
function getLoggedInUserInfo(){
  try{
    let u=JSON.parse(localStorage.getItem("user")||"null"),
      tok=localStorage.getItem("auth.access_token")||function(){try{return JSON.parse(localStorage.getItem("auth")||"null")?.access_token}catch{return""}}(),
      jwt={};
    if(tok){try{jwt=JSON.parse(atob(tok.split(".")[1].replace(/-/g,"+").replace(/_/g,"/")))}catch{}}
    if(!u&&!tok)return null;
    let role=String(u?.role_bdb||u?.role?.role_name||u?.role_name||jwt?.role_bdb||jwt?.role||"").toLowerCase(),
      isVendorReadOnly="vendor_mitra"===role||role.includes("vendor")||role.includes("mitra")||Boolean(u?.is_read_only),
      isSuper="superadmin"===role||"admin_binops"===role||"admin_mabes"===role||"admin"===role||role.includes("super")||role.includes("admin")||isVendorReadOnly,
      canMutate=isSuper&&!isVendorReadOnly,
      nama=String(u?.name||u?.username||jwt?.name||jwt?.username||"PERSONEL POLRI").trim(),
      ident=String(u?.nrp||u?.nip||u?.username||u?.email_polri||u?.email||jwt?.nrp||jwt?.username||"-").trim(),
      satker=String(u?.satker_nama||u?.organisasi_nama||"").trim(),
      ts=new Date().toLocaleString("id-ID",{dateStyle:"short",timeStyle:"short"});
    return{raw:u||jwt,role,isSuper,isVendorReadOnly,canMutate,nama,nrp_nip:ident,satker,ts,watermark:`${nama} (${ident})${satker?` - ${satker}`:""} - ${ts}`}
  }catch{return null}
}

const DEFAULT_VIDEO_CHAPTERS=[
  {sec:0,time:"00:00",label:"1. Pengenalan & Login Keamanan"},
  {sec:45,time:"00:45",label:"2. Navigasi Beranda & Filter Data"},
  {sec:110,time:"01:50",label:"3. Input & Alur Dokumen Penyidikan"},
  {sec:175,time:"02:55",label:"4. Monitoring Kinerja & Ekspor Laporan"}
];

const EBOOK_WEBTOON_EPISODES=[
  {
    ep:1,
    badge:"BAB 1 - RBAC & OTORISASI",
    title:"Matriks 8 Role Akun RBAC & Mode Evaluasi Vendor/Mitra",
    roleTag:"Seluruh Personel & Admin",
    readTime:"4 Menit Baca",
    summary:"Panduan lengkap struktur 8 Role Akun di ekosistem Criminal Analytics System (CAS) Bareskrim Polri beserta pembatasan hak akses mutasi data.",
    steps:[
      {step:"01",title:"Struktur 8 Role Akun Terpadu",desc:"Sistem CAS mendukung 8 Role Akun terstruktur: (1) superadmin, (2) vendor_mitra (Vendor / Mitra Read-Only), (3) admin_MABES / admin_binops, (4) admin_POLDA, (5) admin_POLRES, (6) operator (Satker Operasional), (7) viewer / puskarda (Analis & Pimpinan), serta (8) sharese (Jejaring Komunitas Reserse)."},
      {step:"02",title:"Mode Evaluasi Vendor / Mitra (100% Read-Only)",desc:"Role vendor_mitra memiliki visibilitas seluruh modul setara Superadmin untuk pendampingan teknis, namun bersifat 100% Read-Only: seluruh tombol tambah/ubah/hapus/simpan serta aksi mutasi API POST/PUT/PATCH/DELETE dikunci otomatis di tingkat UI dan server."},
      {step:"03",title:"Hierarki Satker Mabes - Polda - Polres - Polsek",desc:"Setiap personel otomatis terikat pada yurisdiksi Satker masing-masing. Admin Mabes/Binops memantau nasional, Admin Polda memantau jajaran Polda/Polres/Polsek di wilayahnya, dan Operator mengelola perkara pada Satker tempat bertugas."}
    ]
  },
  {
    ep:2,
    badge:"BAB 2 - LAPORAN POLISI & WORKFLOW",
    title:"Operasional Laporan Polisi, Sinkronisasi DORS & Alur Dokumen Penyidikan",
    roleTag:"Operator Satker & Penyidik",
    readTime:"6 Menit Baca",
    summary:"Alur kerja end-to-end penanganan perkara mulai dari registrasi Laporan Polisi (LP), sinkronisasi DORS, unggah dokumen 1 MB, hingga pelimpahan internal/eksternal.",
    steps:[
      {step:"01",title:"Pencarian & Filter Multi-Dimensi Laporan Polisi",desc:"Gunakan halaman Daftar Laporan Polisi (/cms/laporan-polisi) untuk memfilter berdasarkan rentang tanggal, Satker Polda/Polres, Golongan Kejahatan, Status Penyidikan, maupun pencarian cepat Nomor LP dan Nama Pihak."},
      {step:"02",title:"Alur Dokumen Penyidikan (Workflow) & Batas Berkas",desc:"Pada detail LP, penyidik mengunggah dokumen tahapan penyidikan (Mindik, SPDP, Tahap I, P-21, Tahap II, SP3, RJ) dalam format PDF terverifikasi untuk memperbarui status penyelesaian perkara secara otomatis."},
      {step:"03",title:"Pelimpahan Perkara Internal & Eksternal",desc:"Gunakan fitur Pelimpahan LP untuk melimpahkan penanganan perkara antar-Satker Polri (Internal) maupun ke instansi luar/PPNS (Eksternal) lengkap dengan jejak rekam Arsip Pelimpahan."}
    ]
  },
  {
    ep:3,
    badge:"BAB 3 - KINERJA PERKARA & ANEV",
    title:"Perhitungan Kinerja Perkara (CT, CC Aktual, CC Tunggakan, CR% & PERMA)",
    roleTag:"Analis Binops & Pimpinan",
    readTime:"5 Menit Baca",
    summary:"Standar perhitungan Crime Total (CT), Crime Cleared (CC), Clearance Rate (CR%), Tunggakan (CP), serta penyusunan dokumen ANEV Jukminu Polri.",
    steps:[
      {step:"01",title:"Rumus Indikator CT, CC Aktual, CC Tunggakan & CR%",desc:"Crime Total (CT) menghitung jumlah LP pada periode berjalan. Crime Cleared (CC) mencakup penyelesaian perkara periode berjalan (CC Aktual) dan penyelesaian tunggakan periode sebelumnya (CC Tunggakan) untuk menghasilkan persentase Clearance Rate (CR%)."},
      {step:"02",title:"Klasifikasi PERMA & Ekspor Rekapitulasi",desc:"Tabel hierarki Kinerja Perkara (/cms/report/kinerja-perkara) mendukung drill-down dari tingkat Nasional, Polda, Polres, hingga Polsek serta ekspor instan ke format Excel (.xlsx) dan dokumen cetak PDF."},
      {step:"03",title:"Editor Dokumen ANEV CT/CC Terintegrasi ONLYOFFICE",desc:"Melalui menu Laporan ANEV CT/CC (/cms/report/anev-ctcc), personel dapat menyusun naskah laporan analisis dan evaluasi sesuai standar Jukminu Polri lengkap dengan 16 Tabel Lampiran otomatis."}
    ]
  },
  {
    ep:4,
    badge:"BAB 4 - PETA KEJAHATAN WILKUM",
    title:"Peta Kerawanan Kejahatan & Kalibrasi 1:1 Wilayah Hukum (Wilkum) Polri",
    roleTag:"Puskarda, Binops & Komando",
    readTime:"4 Menit Baca",
    summary:"Pemetaan geospasial poligon Wilayah Hukum (Wilkum) Polri di atas Google Maps Indonesia hingga tingkat Kecamatan/Polsek.",
    steps:[
      {step:"01",title:"Yurisdiksi Wilkum Polri vs Batas Administrasi Provinsi",desc:"Pada /cms/dashboard/main?view=peta-kejahatan, batas peta mengikuti yurisdiksi Wilkum Polri. Contoh: Wilkum Polda Metro Jaya mencakup 13 Polres lintas DKI Jakarta, Bekasi, Depok & Tangerang; Wilkum Polda Papua mencakup 21 Polres lintas provinsi."},
      {step:"02",title:"Drill-Down Nasional - Polda - Polres - Polsek",desc:"Klik poligon Polda untuk meninjau Wilkum Polres (Kab/Kota) hingga Wilkum Polsek (Kecamatan), dilengkapi indikator warna heatmap kerawanan serta popup metrik CT, CC, CR%, dan Tunggakan."},
      {step:"03",title:"Titik Koordinat Kantor Mabes / Bareskrim Polri",desc:"Khusus satuan kerja tingkat Mabes Polri / Bareskrim Polri ditampilkan menggunakan titik koordinat presisi Jl. Trunojoyo No. 3 Jakarta Selatan beserta 6 Direktorat Tindak Pidana, Puslabfor, Pusinafis, dan Pusiknas."}
    ]
  },
  {
    ep:5,
    badge:"BAB 5 - SHARESE, BROADCASTER & KEAMANAN",
    title:"Jejaring Sosial Taktis Sharese, Running Ticker 3-Badge & Keamanan Akun",
    roleTag:"Seluruh Personel Reserse",
    readTime:"5 Menit Baca",
    summary:"Kolaborasi lintas penyidik melalui lini masa Jukrah Sharese, Koneksi ala LinkedIn, Obrolan Taktis, serta proteksi berlapis TOTP/Passkey/PIN.",
    steps:[
      {step:"01",title:"Running Ticker 3-Badge (Jukrah, Limpah & Sharese)",desc:"Running Ticker di bagian atas layar menampilkan informasi real-time dengan jeda otomatis saat kursor diarahkan (hover), terbagi atas badge Jukrah pimpinan, notifikasi Limpah LP, dan interaksi sosial Sharese."},
      {step:"02",title:"Jejaring Koneksi Reserse & Obrolan Taktis",desc:"Menu Broadcaster Sharese (/cms/broadcaster) menyediakan direktori koneksi lintas Satker (24 personel per halaman), pengiriman pesan langsung, serta asisten pintar AI Agen Taktis CAS."},
      {step:"03",title:"Keamanan Berlapis: Sandi, PIN 6-Digit, TOTP & Email OTP",desc:"Pada menu Profil & Keamanan (/cms/profile), personel dapat memperbarui kata sandi dengan indikator kekuatan real-time, mengaktifkan PIN keamanan, Google Authenticator (TOTP), serta WebAuthn Passkey."}
    ]
  }
];

function CasSecureVideoPlayer({src:videoSrc,title:videoTitle,watermarkText,maxHeight="68vh",chapters=DEFAULT_VIDEO_CHAPTERS,autoPlay=!1,onClose}){
  let videoRef=(0,r.useRef)(null),
    wrapRef=(0,r.useRef)(null),
    [playing,setPlaying]=(0,r.useState)(!1),
    [curTime,setCurTime]=(0,r.useState)(0),
    [dur,setDur]=(0,r.useState)(0),
    [bufEnd,setBufEnd]=(0,r.useState)(0),
    [vol,setVol]=(0,r.useState)(1),
    [muted,setMuted]=(0,r.useState)(!1),
    [speed,setSpeed]=(0,r.useState)(1),
    [isFs,setIsFs]=(0,r.useState)(!1),
    [isFullViewport,setIsFullViewport]=(0,r.useState)(!1),
    [loading,setLoading]=(0,r.useState)(!0),
    [vErr,setVErr]=(0,r.useState)(""),
    [wmPos,setWmPos]=(0,r.useState)(0);

  (0,r.useEffect)(()=>{
    let timer=setInterval(()=>setWmPos(p=>(p+1)%4),12e3);
    function onFsChange(){setIsFs(!!document.fullscreenElement)}
    document.addEventListener("fullscreenchange",onFsChange);
    return()=>{clearInterval(timer),document.removeEventListener("fullscreenchange",onFsChange)}
  },[]);

  let togglePlay=(0,r.useCallback)(()=>{
    let v=videoRef.current;
    if(!v)return;
    v.paused?v.play().catch(()=>{}):v.pause();
  },[]),
  skipBy=(0,r.useCallback)(delta=>{
    let v=videoRef.current;
    if(!v)return;
    v.currentTime=Math.max(0,Math.min(v.duration||300,(v.currentTime||0)+delta));
  },[]),
  seekToSec=(0,r.useCallback)(sec=>{
    let v=videoRef.current;
    if(!v)return;
    v.currentTime=Math.max(0,sec);
    setCurTime(sec);
    v.play().catch(()=>{});
  },[]),
  handleSeek=ev=>{
    let val=Number(ev.target.value),v=videoRef.current;
    if(v&&Number.isFinite(val)){v.currentTime=val;setCurTime(val)}
  },
  handleVol=ev=>{
    let val=Number(ev.target.value),v=videoRef.current;
    setVol(val);setMuted(0===val);
    if(v){v.volume=val;v.muted=0===val}
  },
  toggleMute=()=>{
    let v=videoRef.current;
    if(!v)return;
    let next=!muted;
    setMuted(next);v.muted=next;
  },
  changeSpeed=sp=>{
    let v=videoRef.current;
    setSpeed(sp);
    if(v)v.playbackRate=sp;
  },
  togglePiP=async()=>{
    try{
      let v=videoRef.current;
      if(!v)return;
      if(document.pictureInPictureElement)await document.exitPictureInPicture();
      else if(v.requestPictureInPicture)await v.requestPictureInPicture();
    }catch{}
  },
  toggleFs=async()=>{
    try{
      let el=wrapRef.current;
      if(!el)return;
      if(document.fullscreenElement)await document.exitFullscreen();
      else if(el.requestFullscreen)await el.requestFullscreen();
      else setIsFullViewport(v=>!v);
    }catch{
      setIsFullViewport(v=>!v);
    }
  },
  wmPositions=[{top:"3.2rem",right:"1.2rem"},{bottom:"4.8rem",right:"1.4rem"},{top:"3.2rem",left:"1.2rem"},{bottom:"4.8rem",left:"1.4rem"}],
  curWmStyle=wmPositions[wmPos]||wmPositions[0],
  playedPct=dur>0?Math.min(100,curTime/dur*100):0,
  bufPct=dur>0?Math.min(100,bufEnd/dur*100):0,
  expanded=isFs||isFullViewport;

  return(0,t.jsxs)("div",{
    ref:wrapRef,
    onContextMenu:e=>e.preventDefault(),
    style:expanded?{
      position:"fixed",inset:0,top:0,left:0,width:"100vw",height:"100vh",zIndex:3500,
      background:"#020617",display:"flex",flexDirection:"column",userSelect:"none"
    }:{
      position:"relative",width:"100%",background:"#020617",borderRadius:12,overflow:"hidden",
      border:"1px solid rgba(56,189,248,0.28)",boxShadow:"0 20px 50px rgba(0,0,0,0.45)",userSelect:"none"
    },
    children:[
      (0,t.jsxs)("div",{
        style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.5rem",padding:"0.55rem 0.95rem",background:"linear-gradient(90deg,#0f172a 0%,#1e293b 100%)",borderBottom:"1px solid rgba(148,163,184,0.16)",fontSize:"0.74rem",color:"#cbd5e1",flexWrap:"wrap"},
        children:[
          (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem",fontWeight:700,color:"#38bdf8"},children:[
            (0,t.jsx)("i",{className:"pi pi-play-circle",style:{fontSize:"0.92rem",color:"#ef4444"}}),
            (0,t.jsx)("span",{children:"CAS THEATER STREAM PLAYER"}),
            (0,t.jsx)("span",{style:{color:"#64748b"},children:"|"}),
            (0,t.jsx)("span",{style:{color:"#f8fafc",fontWeight:700},children:videoTitle||"Video Panduan Operasional"})
          ]}),
          (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.45rem",flexWrap:"wrap"},children:[
            (0,t.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.3rem",fontSize:"0.68rem",color:"#34d399",fontWeight:700,background:"rgba(16,185,129,0.12)",border:"1px solid rgba(16,185,129,0.3)",padding:"0.15rem 0.55rem",borderRadius:6},children:[
              (0,t.jsx)("i",{className:"pi pi-lock",style:{fontSize:"0.66rem"}}),
              "1080p HD - HTTP 206 STREAM"
            ]}),
            onClose&&(0,t.jsxs)("button",{type:"button",onClick:onClose,style:{display:"inline-flex",alignItems:"center",gap:"0.3rem",padding:"0.2rem 0.6rem",borderRadius:6,border:"1px solid rgba(248,113,113,0.4)",background:"rgba(239,68,68,0.15)",color:"#fca5a5",fontSize:"0.7rem",fontWeight:700,cursor:"pointer"},children:[
              (0,t.jsx)("i",{className:"pi pi-times",style:{fontSize:"0.68rem"}}),
              "Tutup Theater"
            ]})
          ]})
        ]
      }),
      (0,t.jsxs)("div",{
        style:{position:"relative",width:"100%",flex:expanded?"1 1 auto":void 0,background:"#000",display:"flex",alignItems:"center",justifyContent:"center",minHeight:"280px"},
        children:[
          (0,t.jsx)("video",{
            ref:videoRef,
            src:videoSrc,
            autoPlay:autoPlay,
            preload:"metadata",
            playsInline:!0,
            controlsList:"nodownload noplaybackrate",
            onContextMenu:e=>e.preventDefault(),
            onClick:togglePlay,
            onDoubleClick:toggleFs,
            onPlay:()=>setPlaying(!0),
            onPause:()=>setPlaying(!1),
            onLoadedMetadata:e=>{setDur(e.currentTarget.duration||0),setLoading(!1),setVErr("")},
            onCanPlay:()=>setLoading(!1),
            onWaiting:()=>setLoading(!0),
            onPlaying:()=>setLoading(!1),
            onTimeUpdate:e=>{
              let v=e.currentTarget;
              setCurTime(v.currentTime||0);
              if(v.buffered&&v.buffered.length>0)setBufEnd(v.buffered.end(v.buffered.length-1));
            },
            onError:()=>{setLoading(!1),setVErr("Aliran video sedang disiapkan atau format membutuhkan pemutaran langsung.")},
            style:{width:"100%",maxHeight:expanded?"calc(100vh - 10.5rem)":maxHeight,display:"block",cursor:"pointer",background:"#000"}
          }),
          watermarkText&&(0,t.jsxs)("div",{
            style:{position:"absolute",...curWmStyle,pointerEvents:"none",zIndex:4,padding:"0.28rem 0.65rem",borderRadius:6,background:"rgba(15,23,42,0.62)",border:"1px solid rgba(255,255,255,0.16)",color:"rgba(248,250,252,0.78)",fontSize:"0.68rem",fontWeight:700,fontFamily:"monospace",letterSpacing:"0.03em",backdropFilter:"blur(3px)",transition:"all 0.6s ease",display:"inline-flex",alignItems:"center",gap:"0.35rem"},
            children:[(0,t.jsx)("i",{className:"pi pi-shield",style:{fontSize:"0.68rem",color:"#38bdf8"}}),"INTERNAL POLRI - ",watermarkText]
          }),
          loading&&!vErr&&(0,t.jsx)("div",{
            style:{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(2,6,23,0.45)",pointerEvents:"none",zIndex:3},
            children:(0,t.jsxs)("div",{style:{display:"inline-flex",alignItems:"center",gap:"0.45rem",padding:"0.6rem 1.1rem",borderRadius:8,background:"rgba(15,23,42,0.88)",border:"1px solid rgba(56,189,248,0.4)",color:"#38bdf8",fontSize:"0.8rem",fontWeight:700},children:[
              (0,t.jsx)("i",{className:"pi pi-spin pi-spinner",style:{fontSize:"0.85rem"}}),
              "Memuat aliran stream video..."
            ]})
          }),
          !playing&&!loading&&!vErr&&(0,t.jsx)("button",{
            type:"button",
            onClick:togglePlay,
            "aria-label":"Putar Video",
            style:{position:"absolute",zIndex:3,width:"4.5rem",height:"4.5rem",borderRadius:"50%",border:"2px solid rgba(255,255,255,0.85)",background:"rgba(220,38,38,0.92)",color:"#ffffff",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",boxShadow:"0 12px 32px rgba(220,38,38,0.55)"},
            children:(0,t.jsx)("i",{className:"pi pi-play",style:{fontSize:"1.5rem",marginLeft:"0.15rem"}})
          }),
          vErr&&(0,t.jsxs)("div",{
            style:{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"0.6rem",background:"rgba(15,23,42,0.92)",padding:"1.5rem",textAlign:"center",zIndex:5},
            children:[
              (0,t.jsx)("div",{style:{color:"#f87171",fontWeight:800,fontSize:"0.9rem"},children:vErr}),
              (0,t.jsxs)("button",{
                type:"button",
                onClick:()=>{let v=videoRef.current;if(v){setVErr("");setLoading(!0);v.load();v.play().catch(()=>{})}},
                style:{display:"inline-flex",alignItems:"center",gap:"0.4rem",padding:"0.45rem 1rem",borderRadius:8,border:"1px solid #38bdf8",background:"#0284c7",color:"#fff",fontSize:"0.78rem",fontWeight:700,cursor:"pointer"},
                children:[(0,t.jsx)("i",{className:"pi pi-refresh",style:{fontSize:"0.78rem"}}),"Muat Ulang Stream"]
              })
            ]
          })
        ]
      }),
      (0,t.jsxs)("div",{
        style:{padding:"0.65rem 0.95rem 0.8rem",background:"linear-gradient(180deg,#0f172a 0%,#020617 100%)",borderTop:"1px solid rgba(148,163,184,0.16)",display:"grid",gap:"0.6rem"},
        children:[
          (0,t.jsxs)("div",{
            style:{position:"relative",height:"8px",borderRadius:6,background:"#1e293b",overflow:"hidden",display:"flex",alignItems:"center"},
            children:[
              (0,t.jsx)("div",{style:{position:"absolute",left:0,top:0,bottom:0,width:`${bufPct}%`,background:"rgba(148,163,184,0.35)",borderRadius:6}}),
              (0,t.jsx)("div",{style:{position:"absolute",left:0,top:0,bottom:0,width:`${playedPct}%`,background:"linear-gradient(90deg,#ef4444,#38bdf8)",borderRadius:6}}),
              (0,t.jsx)("input",{type:"range",min:0,max:dur||100,step:0.1,value:curTime,onChange:handleSeek,"aria-label":"Posisi waktu video",style:{position:"absolute",inset:0,width:"100%",height:"100%",opacity:0,cursor:"pointer",margin:0}})
            ]
          }),
          (0,t.jsxs)("div",{
            style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.6rem",flexWrap:"wrap"},
            children:[
              (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.4rem",flexWrap:"wrap"},children:[
                (0,t.jsxs)("button",{type:"button",onClick:togglePlay,style:{display:"inline-flex",alignItems:"center",gap:"0.35rem",padding:"0.34rem 0.8rem",borderRadius:6,border:"1px solid rgba(56,189,248,0.45)",background:playing?"#1e293b":"#dc2626",color:"#fff",fontWeight:700,fontSize:"0.76rem",cursor:"pointer"},children:[
                  (0,t.jsx)("i",{className:playing?"pi pi-pause":"pi pi-play",style:{fontSize:"0.74rem"}}),
                  playing?"Jeda":"Putar"
                ]}),
                (0,t.jsxs)("button",{type:"button",onClick:()=>skipBy(-10),title:"Mundur 10 detik",style:{display:"inline-flex",alignItems:"center",gap:"0.28rem",padding:"0.32rem 0.58rem",borderRadius:6,border:"1px solid #334155",background:"#0f172a",color:"#cbd5e1",fontWeight:700,fontSize:"0.72rem",cursor:"pointer"},children:[
                  (0,t.jsx)("i",{className:"pi pi-step-backward",style:{fontSize:"0.68rem"}}),"-10d"
                ]}),
                (0,t.jsxs)("button",{type:"button",onClick:()=>skipBy(10),title:"Maju 10 detik",style:{display:"inline-flex",alignItems:"center",gap:"0.28rem",padding:"0.32rem 0.58rem",borderRadius:6,border:"1px solid #334155",background:"#0f172a",color:"#cbd5e1",fontWeight:700,fontSize:"0.72rem",cursor:"pointer"},children:[
                  "+10d",(0,t.jsx)("i",{className:"pi pi-step-forward",style:{fontSize:"0.68rem"}})
                ]}),
                (0,t.jsxs)("div",{style:{display:"inline-flex",alignItems:"center",gap:"0.35rem",padding:"0.18rem 0.5rem",borderRadius:6,background:"#0f172a",border:"1px solid #1e293b"},children:[
                  (0,t.jsx)("button",{type:"button",onClick:toggleMute,style:{border:"none",background:"transparent",color:"#cbd5e1",cursor:"pointer",fontSize:"0.82rem",padding:0,display:"inline-flex",alignItems:"center"},children:(0,t.jsx)("i",{className:muted||0===vol?"pi pi-volume-off":"pi pi-volume-up",style:{fontSize:"0.82rem"}})}),
                  (0,t.jsx)("input",{type:"range",min:0,max:1,step:0.05,value:muted?0:vol,onChange:handleVol,"aria-label":"Volume",style:{width:"60px",cursor:"pointer",accentColor:"#38bdf8"}})
                ]}),
                (0,t.jsxs)("span",{style:{fontFamily:"monospace",fontSize:"0.75rem",color:"#94a3b8",fontWeight:700,marginLeft:"0.2rem"},children:[fmtVideoTime(curTime)," / ",fmtVideoTime(dur)]})
              ]}),
              (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.35rem",flexWrap:"wrap"},children:[
                [0.75,1,1.25,1.5,2].map(sp=>(0,t.jsxs)("button",{type:"button",onClick:()=>changeSpeed(sp),style:{padding:"0.26rem 0.48rem",borderRadius:5,border:speed===sp?"1px solid #38bdf8":"1px solid #334155",background:speed===sp?"rgba(2,132,199,0.28)":"#0f172a",color:speed===sp?"#38bdf8":"#94a3b8",fontSize:"0.68rem",fontWeight:700,cursor:"pointer"},children:[sp,"x"]},sp)),
                (0,t.jsxs)("button",{type:"button",onClick:togglePiP,title:"Picture-in-Picture",style:{display:"inline-flex",alignItems:"center",gap:"0.3rem",padding:"0.28rem 0.58rem",borderRadius:6,border:"1px solid #334155",background:"#0f172a",color:"#cbd5e1",fontSize:"0.72rem",fontWeight:700,cursor:"pointer"},children:[
                  (0,t.jsx)("i",{className:"pi pi-clone",style:{fontSize:"0.7rem"}}),"PiP"
                ]}),
                (0,t.jsxs)("button",{type:"button",onClick:toggleFs,title:"Layar Penuh",style:{display:"inline-flex",alignItems:"center",gap:"0.35rem",padding:"0.28rem 0.68rem",borderRadius:6,border:"1px solid #38bdf8",background:"#0284c7",color:"#f8fafc",fontSize:"0.72rem",fontWeight:700,cursor:"pointer"},children:[
                  (0,t.jsx)("i",{className:expanded?"pi pi-window-minimize":"pi pi-window-maximize",style:{fontSize:"0.72rem"}}),
                  expanded?"Keluar Layar Penuh":"Layar Penuh"
                ]})
              ]})
            ]
          }),
          Array.isArray(chapters)&&chapters.length>0&&(0,t.jsxs)("div",{
            style:{display:"flex",alignItems:"center",gap:"0.4rem",flexWrap:"wrap",paddingTop:"0.35rem",borderTop:"1px solid rgba(148,163,184,0.12)"},
            children:[
              (0,t.jsxs)("span",{style:{fontSize:"0.68rem",fontWeight:800,color:"#94a3b8",display:"inline-flex",alignItems:"center",gap:"0.25rem",marginRight:"0.2rem"},children:[
                (0,t.jsx)("i",{className:"pi pi-list",style:{fontSize:"0.68rem",color:"#38bdf8"}}),"Chapter Video:"
              ]}),
              chapters.map((ch,idx)=>{
                let isCurrent=curTime>=ch.sec&&(idx===chapters.length-1||curTime<chapters[idx+1].sec);
                return(0,t.jsxs)("button",{
                  type:"button",
                  onClick:()=>seekToSec(ch.sec),
                  style:{display:"inline-flex",alignItems:"center",gap:"0.3rem",padding:"0.22rem 0.55rem",borderRadius:6,border:isCurrent?"1px solid #38bdf8":"1px solid #1e293b",background:isCurrent?"rgba(2,132,199,0.25)":"#0f172a",color:isCurrent?"#38bdf8":"#cbd5e1",fontSize:"0.68rem",fontWeight:700,cursor:"pointer"},
                  children:[
                    (0,t.jsx)("span",{style:{fontFamily:"monospace",color:"#38bdf8",fontWeight:800},children:ch.time}),
                    (0,t.jsx)("span",{children:ch.label})
                  ]
                },ch.time);
              })
            ]
          })
        ]
      })
    ]
  });
}

function CasSecurePdfViewer({src:pdfSrc,title:pdfTitle,fileName,watermarkText,maxHeight="76vh"}){
  let wrapRef=(0,r.useRef)(null),
    [zoomPct,setZoomPct]=(0,r.useState)(100),
    [reloadKey,setReloadKey]=(0,r.useState)(0),
    [isFs,setIsFs]=(0,r.useState)(!1),
    [isFullViewport,setIsFullViewport]=(0,r.useState)(!1),
    [readMode,setReadMode]=(0,r.useState)("webtoon"),
    [readTheme,setReadTheme]=(0,r.useState)("light"),
    [curEpisodeIdx,setCurEpisodeIdx]=(0,r.useState)(0),
    [loading,setLoading]=(0,r.useState)(!0),
    [wmPos,setWmPos]=(0,r.useState)(0);

  (0,r.useEffect)(()=>{
    let timer=setInterval(()=>setWmPos(p=>(p+1)%4),12e3);
    function onFsChange(){setIsFs(!!document.fullscreenElement)}
    document.addEventListener("fullscreenchange",onFsChange);
    return()=>{clearInterval(timer),document.removeEventListener("fullscreenchange",onFsChange)}
  },[]);

  let toggleFs=async()=>{
    try{
      let el=wrapRef.current;
      if(!el)return;
      if(document.fullscreenElement)await document.exitFullscreen();
      else if(el.requestFullscreen)await el.requestFullscreen();
      else setIsFullViewport(v=>!v);
    }catch{
      setIsFullViewport(v=>!v);
    }
  },
  wmPositions=[{top:"1.2rem",right:"1.4rem"},{bottom:"1.4rem",right:"1.4rem"},{top:"1.2rem",left:"1.4rem"},{bottom:"1.4rem",left:"1.4rem"}],
  curWmStyle=wmPositions[wmPos]||wmPositions[0],
  baseSrc=String(pdfSrc||"/panduan/buku-panduan-cas-multirole.pdf").split("#")[0],
  iframeSrc=baseSrc?`${baseSrc}#toolbar=1&navpanes=0&scrollbar=1&view=FitH&zoom=${zoomPct}`:"",
  expanded=isFs||isFullViewport,
  themeCfg="sepia"===readTheme?{
    bg:"#f8f1e5",card:"#fdf8ef",text:"#3e2723",sub:"#5d4037",border:"#d7ccc8",accent:"#b45309"
  }:"dark"===readTheme?{
    bg:"#090d16",card:"#111827",text:"#f8fafc",sub:"#cbd5e1",border:"#1e293b",accent:"#38bdf8"
  }:{
    bg:"#f8fafc",card:"#ffffff",text:"#0f172a",sub:"#334155",border:"#e2e8f0",accent:"#2563eb"
  },
  episodesToShow="webtoon"===readMode?EBOOK_WEBTOON_EPISODES:[EBOOK_WEBTOON_EPISODES[curEpisodeIdx]||EBOOK_WEBTOON_EPISODES[0]];

  return(0,t.jsxs)("div",{
    ref:wrapRef,
    onContextMenu:e=>e.preventDefault(),
    style:expanded?{
      position:"fixed",inset:0,top:0,left:0,width:"100vw",height:"100vh",zIndex:3500,
      background:themeCfg.bg,display:"flex",flexDirection:"column",overflow:"hidden",userSelect:"none"
    }:{
      position:"relative",width:"100%",background:themeCfg.bg,borderRadius:12,overflow:"hidden",
      border:"1px solid var(--cas-border-strong, #cbd5e1)",boxShadow:"0 12px 34px rgba(15,23,42,0.12)",userSelect:"none"
    },
    children:[
      (0,t.jsxs)("div",{
        style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.65rem",padding:"0.65rem 1rem",background:"linear-gradient(90deg,#0f172a 0%,#1e293b 100%)",borderBottom:"1px solid rgba(148,163,184,0.2)",color:"#f8fafc",flexWrap:"wrap"},
        children:[
          (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem",minWidth:0},children:[
            (0,t.jsx)("i",{className:"pi pi-book",style:{fontSize:"1rem",color:"#38bdf8"}}),
            (0,t.jsx)("span",{style:{fontWeight:800,fontSize:"0.84rem",color:"#38bdf8"},children:"E-BOOK & WEBTOON READER"}),
            (0,t.jsx)("span",{style:{color:"#64748b"},children:"|"}),
            (0,t.jsx)("span",{style:{fontWeight:700,fontSize:"0.84rem",color:"#f8fafc",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:pdfTitle||fileName||"Buku Panduan Operasional CAS Bareskrim Polri"})
          ]}),
          (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.4rem",flexWrap:"wrap"},children:[
            (0,t.jsxs)("div",{style:{display:"inline-flex",borderRadius:7,background:"#0f172a",padding:"0.14rem",border:"1px solid #334155",gap:"0.15rem"},children:[
              (0,t.jsxs)("button",{type:"button",onClick:()=>setReadMode("webtoon"),style:{display:"inline-flex",alignItems:"center",gap:"0.3rem",padding:"0.26rem 0.6rem",borderRadius:5,border:"none",background:"webtoon"===readMode?"#0284c7":"transparent",color:"webtoon"===readMode?"#fff":"#94a3b8",fontSize:"0.71rem",fontWeight:700,cursor:"pointer"},children:[
                (0,t.jsx)("i",{className:"pi pi-arrows-v",style:{fontSize:"0.68rem"}}),"Scroll Vertikal Webtoon"
              ]}),
              (0,t.jsxs)("button",{type:"button",onClick:()=>setReadMode("ebook"),style:{display:"inline-flex",alignItems:"center",gap:"0.3rem",padding:"0.26rem 0.6rem",borderRadius:5,border:"none",background:"ebook"===readMode?"#0284c7":"transparent",color:"ebook"===readMode?"#fff":"#94a3b8",fontSize:"0.71rem",fontWeight:700,cursor:"pointer"},children:[
                (0,t.jsx)("i",{className:"pi pi-book",style:{fontSize:"0.68rem"}}),"Halaman per Halaman E-Book"
              ]})
            ]}),
            (0,t.jsxs)("div",{style:{display:"inline-flex",borderRadius:7,background:"#0f172a",padding:"0.14rem",border:"1px solid #334155",gap:"0.15rem"},children:[
              [{id:"light",label:"Terang",icon:"pi pi-sun"},{id:"sepia",label:"Sepia Nyaman Mata",icon:"pi pi-eye"},{id:"dark",label:"Gelap",icon:"pi pi-moon"}].map(th=>(0,t.jsxs)("button",{
                type:"button",
                onClick:()=>setReadTheme(th.id),
                style:{display:"inline-flex",alignItems:"center",gap:"0.25rem",padding:"0.26rem 0.55rem",borderRadius:5,border:"none",background:readTheme===th.id?"#2563eb":"transparent",color:readTheme===th.id?"#fff":"#cbd5e1",fontSize:"0.7rem",fontWeight:700,cursor:"pointer"},
                children:[(0,t.jsx)("i",{className:th.icon,style:{fontSize:"0.66rem"}}),th.label]
              },th.id))
            ]}),
            (0,t.jsxs)("div",{style:{display:"inline-flex",alignItems:"center",gap:"0.2rem",background:"#0f172a",padding:"0.14rem 0.3rem",borderRadius:7,border:"1px solid #334155"},children:[
              (0,t.jsx)("button",{type:"button",onClick:()=>setZoomPct(z=>Math.max(70,z-10)),title:"Perkecil Huruf / Zoom",style:{border:"none",background:"transparent",color:"#cbd5e1",cursor:"pointer",padding:"0.2rem 0.35rem",fontSize:"0.72rem",fontWeight:800},children:(0,t.jsx)("i",{className:"pi pi-minus",style:{fontSize:"0.66rem"}})}),
              (0,t.jsxs)("button",{type:"button",onClick:()=>setZoomPct(100),title:"Reset 100%",style:{border:"none",background:"#1e293b",color:"#38bdf8",borderRadius:4,padding:"0.16rem 0.45rem",fontSize:"0.71rem",fontFamily:"monospace",fontWeight:800,cursor:"pointer"},children:[zoomPct,"%"]}),
              (0,t.jsx)("button",{type:"button",onClick:()=>setZoomPct(z=>Math.min(160,z+10)),title:"Perbesar Huruf / Zoom",style:{border:"none",background:"transparent",color:"#cbd5e1",cursor:"pointer",padding:"0.2rem 0.35rem",fontSize:"0.72rem",fontWeight:800},children:(0,t.jsx)("i",{className:"pi pi-plus",style:{fontSize:"0.66rem"}})})
            ]}),
            baseSrc&&(0,t.jsxs)("a",{
              href:baseSrc,
              download:fileName||"buku-panduan-cas.pdf",
              target:"_blank",
              rel:"noreferrer",
              style:{display:"inline-flex",alignItems:"center",gap:"0.32rem",padding:"0.3rem 0.65rem",borderRadius:6,border:"1px solid rgba(52,211,153,0.45)",background:"rgba(16,185,129,0.16)",color:"#34d399",fontSize:"0.71rem",fontWeight:700,textDecoration:"none"},
              children:[(0,t.jsx)("i",{className:"pi pi-download",style:{fontSize:"0.7rem"}}),"Unduh PDF"]
            }),
            (0,t.jsxs)("button",{
              type:"button",
              onClick:toggleFs,
              style:{display:"inline-flex",alignItems:"center",gap:"0.32rem",padding:"0.3rem 0.7rem",borderRadius:6,border:"1px solid #38bdf8",background:expanded?"#dc2626":"#0284c7",color:"#fff",fontSize:"0.71rem",fontWeight:800,cursor:"pointer"},
              children:[
                (0,t.jsx)("i",{className:expanded?"pi pi-window-minimize":"pi pi-window-maximize",style:{fontSize:"0.7rem"}}),
                expanded?"Kecilkan Layar":"Layar Penuh"
              ]
            })
          ]})
        ]
      }),
      "ebook"===readMode&&(0,t.jsxs)("div",{
        style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.5rem",padding:"0.55rem 1rem",background:themeCfg.card,borderBottom:`1px solid ${themeCfg.border}`,flexWrap:"wrap"},
        children:[
          (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.35rem",flexWrap:"wrap"},children:EBOOK_WEBTOON_EPISODES.map((ep,idx)=>(0,t.jsxs)("button",{
            type:"button",
            onClick:()=>setCurEpisodeIdx(idx),
            style:{padding:"0.28rem 0.65rem",borderRadius:6,border:curEpisodeIdx===idx?`1.5px solid ${themeCfg.accent}`:`1px solid ${themeCfg.border}`,background:curEpisodeIdx===idx?themeCfg.accent:"transparent",color:curEpisodeIdx===idx?"#fff":themeCfg.text,fontSize:"0.72rem",fontWeight:700,cursor:"pointer"},
            children:["Bab ",ep.ep]
          },ep.ep))}),
          (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.4rem"},children:[
            (0,t.jsxs)("button",{type:"button",disabled:0===curEpisodeIdx,onClick:()=>setCurEpisodeIdx(i=>Math.max(0,i-1)),style:{display:"inline-flex",alignItems:"center",gap:"0.3rem",padding:"0.28rem 0.65rem",borderRadius:6,border:`1px solid ${themeCfg.border}`,background:themeCfg.bg,color:themeCfg.text,fontSize:"0.72rem",fontWeight:700,cursor:0===curEpisodeIdx?"not-allowed":"pointer",opacity:0===curEpisodeIdx?0.45:1},children:[(0,t.jsx)("i",{className:"pi pi-chevron-left",style:{fontSize:"0.68rem"}}),"Bab Sebelumnya"]}),
            (0,t.jsxs)("span",{style:{fontSize:"0.74rem",fontWeight:700,color:themeCfg.sub},children:["Halaman Bab ",curEpisodeIdx+1," / ",EBOOK_WEBTOON_EPISODES.length]}),
            (0,t.jsxs)("button",{type:"button",disabled:curEpisodeIdx>=EBOOK_WEBTOON_EPISODES.length-1,onClick:()=>setCurEpisodeIdx(i=>Math.min(EBOOK_WEBTOON_EPISODES.length-1,i+1)),style:{display:"inline-flex",alignItems:"center",gap:"0.3rem",padding:"0.28rem 0.65rem",borderRadius:6,border:`1px solid ${themeCfg.border}`,background:themeCfg.bg,color:themeCfg.text,fontSize:"0.72rem",fontWeight:700,cursor:curEpisodeIdx>=EBOOK_WEBTOON_EPISODES.length-1?"not-allowed":"pointer",opacity:curEpisodeIdx>=EBOOK_WEBTOON_EPISODES.length-1?0.45:1},children:["Bab Berikutnya",(0,t.jsx)("i",{className:"pi pi-chevron-right",style:{fontSize:"0.68rem"}})]})
          ]})
        ]
      }),
      (0,t.jsxs)("div",{
        style:{flex:expanded?"1 1 auto":void 0,maxHeight:expanded?"calc(100vh - 3.8rem)":maxHeight,overflowY:"auto",padding:"1.1rem",display:"grid",gap:"1.15rem",background:themeCfg.bg},
        children:[
          (0,t.jsx)("div",{
            style:{maxWidth:"58rem",width:"100%",margin:"0 auto",display:"grid",gap:"1rem",fontSize:`${Math.round(zoomPct)}%`},
            children:episodesToShow.map(ep=>(0,t.jsxs)("article",{
              style:{background:themeCfg.card,border:`1px solid ${themeCfg.border}`,borderRadius:12,padding:"1.15rem 1.3rem",boxShadow:"0 4px 16px rgba(15,23,42,0.05)",display:"grid",gap:"0.85rem"},
              children:[
                (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.5rem",flexWrap:"wrap",borderBottom:`1px solid ${themeCfg.border}`,paddingBottom:"0.65rem"},children:[
                  (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.45rem",flexWrap:"wrap"},children:[
                    (0,t.jsx)("span",{style:{padding:"0.18rem 0.6rem",borderRadius:6,background:themeCfg.accent,color:"#ffffff",fontSize:"0.68rem",fontWeight:800,letterSpacing:"0.03em"},children:ep.badge}),
                    (0,t.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.25rem",padding:"0.16rem 0.55rem",borderRadius:6,border:`1px solid ${themeCfg.border}`,color:themeCfg.sub,fontSize:"0.68rem",fontWeight:700},children:[(0,t.jsx)("i",{className:"pi pi-users",style:{fontSize:"0.66rem"}}),ep.roleTag]})
                  ]}),
                  (0,t.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.28rem",fontSize:"0.7rem",fontWeight:700,color:themeCfg.sub},children:[(0,t.jsx)("i",{className:"pi pi-clock",style:{fontSize:"0.68rem"}}),ep.readTime]})
                ]}),
                (0,t.jsx)("h3",{style:{margin:0,fontSize:"1.08em",fontWeight:800,color:themeCfg.text,lineHeight:1.35},children:ep.title}),
                (0,t.jsx)("p",{style:{margin:0,fontSize:"0.86em",color:themeCfg.sub,lineHeight:1.55},children:ep.summary}),
                (0,t.jsx)("div",{style:{display:"grid",gap:"0.65rem"},children:ep.steps.map(st=>(0,t.jsxs)("div",{
                  style:{display:"flex",alignItems:"flex-start",gap:"0.75rem",padding:"0.75rem 0.9rem",borderRadius:10,background:themeCfg.bg,border:`1px solid ${themeCfg.border}`},
                  children:[
                    (0,t.jsx)("div",{style:{width:"2rem",height:"2rem",borderRadius:8,background:themeCfg.accent,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:"0.78rem",flex:"0 0 auto"},children:st.step}),
                    (0,t.jsxs)("div",{style:{minWidth:0,flex:1},children:[
                      (0,t.jsx)("div",{style:{fontWeight:800,fontSize:"0.88em",color:themeCfg.text,marginBottom:"0.2rem"},children:st.title}),
                      (0,t.jsx)("div",{style:{fontSize:"0.82em",color:themeCfg.sub,lineHeight:1.55},children:st.desc})
                    ]})
                  ]
                },st.step))})
              ]
            },ep.ep))
          }),
          iframeSrc&&(0,t.jsxs)("div",{
            style:{maxWidth:"58rem",width:"100%",margin:"0 auto",borderRadius:12,overflow:"hidden",border:`1px solid ${themeCfg.border}`,background:"#0f172a"},
            children:[
              (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.5rem",padding:"0.55rem 0.9rem",background:"#1e293b",color:"#e2e8f0",fontSize:"0.75rem",fontWeight:700,flexWrap:"wrap"},children:[
                (0,t.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.4rem"},children:[
                  (0,t.jsx)("i",{className:"pi pi-file-pdf",style:{color:"#f87171",fontSize:"0.88rem"}}),
                  "Lembar Dokumen PDF Asli (Scroll Kontinu di Dalam Halaman)"
                ]}),
                (0,t.jsxs)("button",{type:"button",onClick:()=>{setLoading(!0);setReloadKey(k=>k+1)},style:{display:"inline-flex",alignItems:"center",gap:"0.3rem",padding:"0.22rem 0.55rem",borderRadius:5,border:"1px solid #475569",background:"#0f172a",color:"#cbd5e1",fontSize:"0.7rem",fontWeight:700,cursor:"pointer"},children:[
                  (0,t.jsx)("i",{className:"pi pi-refresh",style:{fontSize:"0.66rem"}}),"Muat Ulang PDF"
                ]})
              ]}),
              (0,t.jsxs)("div",{style:{position:"relative",width:"100%",minHeight:"540px",background:"#1e293b"},children:[
                (0,t.jsx)("iframe",{
                  key:`${reloadKey}-${zoomPct}-${baseSrc}`,
                  src:iframeSrc,
                  title:pdfTitle||"Dokumen Panduan PDF",
                  onLoad:()=>setLoading(!1),
                  style:{width:"100%",height:expanded?"calc(100vh - 8rem)":"640px",border:"none",display:"block",background:"#1e293b"}
                }),
                watermarkText&&(0,t.jsxs)("div",{
                  style:{position:"absolute",...curWmStyle,pointerEvents:"none",zIndex:5,padding:"0.26rem 0.65rem",borderRadius:6,background:"rgba(15,23,42,0.68)",border:"1px solid rgba(56,189,248,0.28)",color:"rgba(248,250,252,0.85)",fontSize:"0.66rem",fontWeight:700,fontFamily:"monospace",display:"inline-flex",alignItems:"center",gap:"0.3rem"},
                  children:[(0,t.jsx)("i",{className:"pi pi-shield",style:{fontSize:"0.66rem",color:"#38bdf8"}}),"INTERNAL POLRI - ",watermarkText]
                }),
                loading&&(0,t.jsx)("div",{
                  style:{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(2,6,23,0.45)",pointerEvents:"none",zIndex:3},
                  children:(0,t.jsxs)("div",{style:{display:"inline-flex",alignItems:"center",gap:"0.4rem",padding:"0.55rem 1rem",borderRadius:6,background:"rgba(15,23,42,0.88)",border:"1px solid rgba(56,189,248,0.4)",color:"#38bdf8",fontSize:"0.78rem",fontWeight:700},children:[
                    (0,t.jsx)("i",{className:"pi pi-spin pi-spinner",style:{fontSize:"0.8rem"}}),"Memuat dokumen PDF..."
                  ]})
                })
              ]})
            ]
          })
        ]
      })
    ]
  });
}

function getInitialPersonnelPrefill(){
  try{
    let u=JSON.parse(localStorage.getItem("user")||"null");
    if(!u)return{jenis_personel:"ANGGOTA_POLRI",nama:"",nrp_nip:"",captcha_answer:""};
    let rawNo=String(u.nrp||u.nip||"").replace(/\D/g,""),
      jenis=rawNo.length>=14?"PNS_POLRI":"ANGGOTA_POLRI";
    return{jenis_personel:jenis,nama:String(u.name||"").trim(),nrp_nip:rawNo,captcha_answer:""};
  }catch{
    return{jenis_personel:"ANGGOTA_POLRI",nama:"",nrp_nip:"",captcha_answer:""};
  }
}

const BUILTIN_DEFAULT_GUIDES=[
  {
    id:"builtin-ebook-multirole",
    judul:"Buku Panduan Resmi CAS Bareskrim Polri — Edisi Lengkap Multi-Role (8 Role RBAC)",
    deskripsi:"Panduan operasional lengkap mencakup 8 Role RBAC, Laporan Polisi, Sinkronisasi DORS, Kinerja Perkara CT/CC/CR, Peta Kejahatan Wilkum 1:1, Sharese Broadcaster, dan ANEV.",
    kategori:"E-Book Utama & RBAC",
    tipe:"PDF",
    url:"/panduan/buku-panduan-cas-multirole.pdf",
    stream_url:"/panduan/buku-panduan-cas-multirole.pdf",
    file_name:"buku-panduan-cas-multirole.pdf",
    size:4823450,
    status:"AKTIF",
    urutan:1,
    role_badge:"8 Role RBAC",
    steps_count:15
  },
  {
    id:"builtin-ebook-operator",
    judul:"Modul Bacaan Operasional Satker — Panduan Teknis Operator & Penyidik",
    deskripsi:"Panduan langkah demi langkah untuk Operator Satker & Penyidik: input Laporan Polisi, unggah dokumen workflow penyidikan, pelimpahan LP, dan register pihak terlibat.",
    kategori:"Laporan Polisi & Penyidikan",
    tipe:"PDF",
    url:"/panduan/buku-panduan-cas-operator.pdf",
    stream_url:"/panduan/buku-panduan-cas-operator.pdf",
    file_name:"buku-panduan-cas-operator.pdf",
    size:3612000,
    status:"AKTIF",
    urutan:2,
    role_badge:"Operator & Penyidik",
    steps_count:12
  }
];

e.s(["default",0,function(){
  let[e,p]=(0,r.useState)([]),
    [m,y]=(0,r.useState)(!0),
    [f,g]=(0,r.useState)(null),
    [h,b]=(0,r.useState)(!1),
    [w,k]=(0,r.useState)(!1),
    [inlinePlayingId,setInlinePlayingId]=(0,r.useState)(null),
    [theaterVideo,setTheaterVideo]=(0,r.useState)(null),
    [activeEbook,setActiveEbook]=(0,r.useState)(BUILTIN_DEFAULT_GUIDES[0]),
    [searchQuery,setSearchQuery]=(0,r.useState)(""),
    [filterTipe,setFilterTipe]=(0,r.useState)("ALL"),
    [filterKat,setFilterKat]=(0,r.useState)("ALL"),
    [viewMode,setViewMode]=(0,r.useState)(()=>{
      if("undefined"==typeof window)return"rekap";
      let sp=new URLSearchParams(window.location.search);
      return window.location.pathname.endsWith("/kelola")||"kelola"===sp.get("mode")?"kelola":"rekap";
    }),
    [shareToken,setShareToken]=(0,r.useState)(()=>"undefined"!=typeof window?new URLSearchParams(window.location.search).get("share")||"":""),
    [targetPanduanId,setTargetPanduanId]=(0,r.useState)(null),
    [isStandaloneShareMode,setIsStandaloneShareMode]=(0,r.useState)(()=>"undefined"!=typeof window&&new URLSearchParams(window.location.search).has("share")),
    [challengeData,setChallengeData]=(0,r.useState)(null),
    [challengeLoading,setChallengeLoading]=(0,r.useState)(!1),
    [gateForm,setGateForm]=(0,r.useState)(()=>getInitialPersonnelPrefill()),
    [gateErr,setGateErr]=(0,r.useState)(""),
    [gateSubmitting,setGateSubmitting]=(0,r.useState)(!1),
    [copyFeedback,setCopyFeedback]=(0,r.useState)(""),
    [formOpen,setFormOpen]=(0,r.useState)(!1),
    [formData,setFormData]=(0,r.useState)({id:null,judul:"",deskripsi:"",kategori:"Umum",tipe:"PDF",urutan:0}),
    [formFile,setFormFile]=(0,r.useState)(null),
    [formSaving,setFormSaving]=(0,r.useState)(!1),
    [formErr,setFormErr]=(0,r.useState)(""),
    [uploadProgress,setUploadProgress]=(0,r.useState)(0),
    [uploadedBytes,setUploadedBytes]=(0,r.useState)(0),
    [totalBytes,setTotalBytes]=(0,r.useState)(0),
    [uploadSpeedBps,setUploadSpeedBps]=(0,r.useState)(0),
    [uploadEtaSec,setUploadEtaSec]=(0,r.useState)(null),
    uploadStartRef=(0,r.useRef)(0),
    hasAuthToken="undefined"!=typeof window&&function(){
      try{
        let a=JSON.parse(localStorage.getItem("auth")||"null")||{},
          t=localStorage.getItem("auth.access_token")||a.access_token||"",
          l=Number(localStorage.getItem("bdb.auth.last_activity")||0);
        if(!t||(l&&Date.now()-l>144e5))return!1;
        let p=JSON.parse(atob(t.split(".")[1].replace(/-/g,"+").replace(/_/g,"/")));
        return Number(p.exp||0)*1e3>Date.now();
      }catch{return!1}
    }(),
    loggedUser=getLoggedInUserInfo(),
    isSuperAdmin=!!loggedUser?.isSuper,
    isVendorReadOnly=!!loggedUser?.isVendorReadOnly,
    canMutatePanduan=!!loggedUser?.canMutate,
    v=(0,r.useCallback)(async(forceAll=!1)=>{
      if("undefined"!=typeof window){
        let hasTok=!!(localStorage.getItem("auth.access_token")||function(){try{return JSON.parse(localStorage.getItem("auth")||"null")?.access_token}catch{return""}}());
        if(!hasTok){p([]),y(!1);return}
      }
      y(!0);
      try{
        let params=forceAll||"kelola"===viewMode||isSuperAdmin?{all:"true"}:{},
          res=await d.apiAuth.get("/bdb/panduan",{params}),
          rows=res.data?.data||[];
        p(rows);
        let firstPdf=rows.find(x=>"PDF"===x.tipe);
        if(firstPdf)setActiveEbook(firstPdf);
      }catch{p([])}finally{y(!1)}
    },[viewMode,isSuperAdmin]),
    loadShareChallenge=(0,r.useCallback)(async(tok,pid)=>{
      if(!tok&&!pid)return;
      setChallengeLoading(!0),setGateErr("");
      try{
        let params={};
        if(tok)params.token=tok;
        if(pid)params.id=pid;
        let res=await d.api.get("/bdb/panduan/share-challenge",{params});
        if(0===res.data?.status){
          setGateErr(res.data?.message||"Link panduan terenkripsi tidak valid atau kedaluwarsa.");
          setChallengeData(null);
          return;
        }
        setChallengeData(res.data?.data||null);
      }catch(err){
        setGateErr(err?.response?.data?.message||"Link panduan terenkripsi tidak valid atau kedaluwarsa.");
      }finally{setChallengeLoading(!1)}
    },[]);

  async function resolveGuideStream(item){
    if(!item)return null;
    let directUrl=item.stream_url||item.url||null;
    if(directUrl)return{...item,url:directUrl,stream_url:directUrl};
    try{
      let t=await d.apiAuth.get(`/bdb/panduan/${item.id}`),det=t.data?.data;
      if(det){
        let resolvedUrl=det.stream_url||det.url;
        return{...item,...det,url:resolvedUrl,stream_url:resolvedUrl};
      }
    }catch{}
    return item;
  }

  async function openInternalGuideDirect(item,preferInline=!0){
    if(!item)return;
    let uInfo=getLoggedInUserInfo(),
      nowStr=new Date().toLocaleString("id-ID",{dateStyle:"short",timeStyle:"short"}),
      verifiedBy=uInfo?{jenis:"INTERNAL",nama:uInfo.nama,nrp_nip:uInfo.nrp_nip,satker:uInfo.satker,ts:nowStr}:{jenis:"INTERNAL",nama:"PERSONEL POLRI",nrp_nip:"-",ts:nowStr};
    b(!0);
    try{
      let resolved=await resolveGuideStream(item);
      if(!resolved)return;
      let withVer={...resolved,verified_by:verifiedBy};
      if(preferInline&&"rekap"===viewMode){
        if("VIDEO"===withVer.tipe){
          setTheaterVideo(withVer);
          setInlinePlayingId(withVer.id);
        }else{
          setActiveEbook(withVer);
          let el=document.getElementById("cas-ebook-webtoon-stage");
          if(el)el.scrollIntoView({behavior:"smooth",block:"start"});
        }
      }else{
        k(!1);
        g(withVer);
      }
    }finally{b(!1)}
  }

  async function playVideoInlineInCard(item,ev){
    ev&&ev.stopPropagation();
    let resolved=await resolveGuideStream(item);
    if(resolved){
      if(resolved.stream_url||resolved.url){
        p(prev=>prev.map(x=>x.id===resolved.id?{...x,url:resolved.url,stream_url:resolved.stream_url}:x));
      }
      setInlinePlayingId(resolved.id);
    }
  }

  async function copyEncryptedShareLink(item,ev){
    ev&&ev.stopPropagation();
    try{
      let tok=item?.share_token||challengeData?.panduan?.share_token||shareToken;
      if(!tok&&item?.id&&!String(item.id).startsWith("builtin-")&&hasAuthToken){
        let detail=(await d.apiAuth.get(`/bdb/panduan/${item.id}`))?.data?.data;
        tok=detail?.share_token;
      }
      let fullUrl=tok?`${window.location.origin}/cms/panduan?share=${encodeURIComponent(tok)}`:`${window.location.origin}/cms/panduan`;
      await navigator.clipboard.writeText(fullUrl);
      setCopyFeedback(`Tautan berbagi "${item?.judul||challengeData?.panduan?.judul||"Panduan CAS"}" berhasil disalin ke clipboard.`);
      setTimeout(()=>setCopyFeedback(""),5e3);
    }catch{}
  }

  async function submitViewerGate(ev){
    ev&&ev.preventDefault();
    let cTok=challengeData?.challenge_token||challengeData?.captcha_token;
    if((!shareToken&&!targetPanduanId)||!cTok){
      setGateErr("Sesi Captcha belum siap. Silakan klik Ganti Kode.");
      return;
    }
    let jenis=gateForm.jenis_personel,
      nama=(gateForm.nama||"").trim(),
      nomor=(gateForm.nrp_nip||"").replace(/\s+/g,""),
      digits=nomor.replace(/\D/g,"");
    if("ANGGOTA_POLRI"===jenis&&(digits.length<6||digits.length>10||!/^\d+$/.test(digits))){
      setGateErr("NRP Anggota Polri wajib berupa angka 6 s.d. 10 digit.");
      return;
    }
    if("PNS_POLRI"===jenis&&(digits.length<14||digits.length>18||!/^\d+$/.test(digits))){
      setGateErr("NIP PNS Polri wajib berupa angka 14 s.d. 18 digit.");
      return;
    }
    if(!gateForm.captcha_answer?.trim()){
      setGateErr("Kode Captcha 6 karakter wajib diisi.");
      return;
    }
    setGateSubmitting(!0),setGateErr("");
    try{
      let res=await d.api.post("/bdb/panduan/verify-viewer",{
        share_token:shareToken||void 0,
        panduan_id:targetPanduanId||challengeData?.panduan?.id||void 0,
        jenis_personel:jenis,
        nama:nama||void 0,
        nrp:digits,
        nrp_nip:digits,
        challenge_token:cTok,
        captcha_token:cTok,
        captcha_answer:gateForm.captcha_answer.trim()
      });
      if(0===res.data?.status){
        setGateErr(res.data?.message||"Verifikasi gagal, silakan periksa kembali NRP/NIP dan kode Captcha Anda.");
        setGateForm(s=>({...s,captcha_answer:""}));
        loadShareChallenge(shareToken,targetPanduanId);
        return;
      }
      let verified=res.data?.data;
      if(verified&&(verified.stream_url||verified.url)){
        let nowStr=new Date().toLocaleString("id-ID",{dateStyle:"short",timeStyle:"short"}),
          sUrl=verified.stream_url||verified.url,
          resolvedNama=verified.viewer?.nama||nama||"PERSONEL POLRI";
        k(!1);
        g({...verified,url:sUrl,stream_url:sUrl,verified_by:{jenis,nama:resolvedNama,nrp_nip:digits,ts:nowStr}});
      }
    }catch(err){
      setGateErr(err?.response?.data?.message||"Verifikasi gagal, silakan periksa kembali NRP/NIP dan kode Captcha Anda.");
      setGateForm(s=>({...s,captcha_answer:""}));
      loadShareChallenge(shareToken,targetPanduanId);
    }finally{setGateSubmitting(!1)}
  }

  async function handleSavePanduan(ev){
    ev&&ev.preventDefault();
    if(!canMutatePanduan){
      setFormErr("Role Vendor / Mitra (Read-Only): Aksi tambah/ubah panduan dikunci otomatis.");
      return;
    }
    let isEdit=null!==formData.id;
    if(!formData.judul.trim()){setFormErr("Judul panduan wajib diisi.");return}
    if(!isEdit&&!formFile){setFormErr("Berkas panduan (Video/PDF) wajib dipilih.");return}
    let initTotal=formFile?.size||0;
    setFormSaving(!0),setFormErr(""),setUploadProgress(0),setUploadedBytes(0),setTotalBytes(initTotal),setUploadSpeedBps(0),setUploadEtaSec(null),uploadStartRef.current=Date.now();
    try{
      let fd=new FormData;
      fd.append("judul",formData.judul.trim());
      fd.append("deskripsi",(formData.deskripsi||"").trim());
      fd.append("kategori",(formData.kategori||"Umum").trim());
      fd.append("urutan",String(formData.urutan||0));
      isEdit||fd.append("tipe",formData.tipe);
      formFile&&fd.append("file",formFile);
      let uploadCfg={
        headers:{"Content-Type":"multipart/form-data"},
        timeout:3600000,
        onUploadProgress:progressEvent=>{
          let loaded=Number(progressEvent?.loaded||0),
            total=Number(progressEvent?.total||formFile?.size||loaded||0),
            pct=total>0?Math.min(100,Math.round(loaded/total*100)):0,
            elapsedSec=Math.max(0.15,(Date.now()-(uploadStartRef.current||Date.now()))/1e3),
            speed=loaded>0?loaded/elapsedSec:0,
            remBytes=Math.max(0,total-loaded),
            eta=speed>0&&remBytes>0?Math.max(1,Math.ceil(remBytes/speed)):0;
          setUploadedBytes(loaded),setTotalBytes(total),setUploadProgress(pct),setUploadSpeedBps(speed),setUploadEtaSec(pct>=100?0:eta);
        }
      };
      if(isEdit)await d.apiAuth.patch(`/bdb/panduan/${formData.id}`,fd,uploadCfg);
      else await d.apiAuth.post("/bdb/panduan/upload",fd,uploadCfg);
      setFormOpen(!1);
      setCopyFeedback(isEdit?"Panduan berhasil diperbarui.":"Panduan baru berhasil diunggah.");
      setTimeout(()=>setCopyFeedback(""),4e3);
      await v(!0);
    }catch(err){
      setFormErr(err?.response?.data?.message||"Gagal menyimpan panduan.");
    }finally{
      setFormSaving(!1),setUploadProgress(0),setUploadedBytes(0),setTotalBytes(0),setUploadSpeedBps(0),setUploadEtaSec(null);
    }
  }

  async function handleToggleStatus(item,ev){
    ev&&ev.stopPropagation();
    if(!canMutatePanduan)return;
    let nextStatus="AKTIF"===item.status?"NONAKTIF":"AKTIF";
    if(!(window.__casConfirmDelete?await window.__casConfirmDelete({title:`${"AKTIF"===nextStatus?"Aktifkan":"Nonaktifkan"} Panduan?`,message:`${"AKTIF"===nextStatus?"Aktifkan":"Nonaktifkan"} panduan "${item.judul}"?`,confirmText:`Ya, ${"AKTIF"===nextStatus?"Aktifkan":"Nonaktifkan"}`}):window.confirm(`${"AKTIF"===nextStatus?"Aktifkan":"Nonaktifkan"} panduan "${item.judul}"?`)))return;
    try{
      await d.apiAuth.patch(`/bdb/panduan/${item.id}/status`,{status:nextStatus});
      await v(!0);
    }catch(err){window.alert(err?.response?.data?.message||"Gagal mengubah status panduan.")}
  }

  async function handleDeletePanduan(item,ev){
    ev&&ev.stopPropagation();
    if(!canMutatePanduan)return;
    if(!(window.__casConfirmDelete?await window.__casConfirmDelete({title:"Konfirmasi Hapus Panduan",message:`Hapus panduan "${item.judul}" secara permanen? Tindakan ini tidak dapat dibatalkan.`,confirmText:"Ya, Hapus"}):window.confirm(`Hapus panduan "${item.judul}" secara permanen?`)))return;
    try{
      await d.apiAuth.delete(`/bdb/panduan/${item.id}`);
      await v(!0);
    }catch(err){window.alert(err?.response?.data?.message||"Gagal menghapus panduan.")}
  }

  (0,r.useEffect)(()=>{
    if("undefined"==typeof window||!formSaving)return;
    let onBeforeUnload=ev=>{ev.preventDefault();ev.returnValue="Proses unggah berkas panduan sedang berlangsung.";return ev.returnValue};
    window.addEventListener("beforeunload",onBeforeUnload);
    return()=>window.removeEventListener("beforeunload",onBeforeUnload);
  },[formSaving]);

  (0,r.useEffect)(()=>{v("kelola"===viewMode||isSuperAdmin)},[v,viewMode,isSuperAdmin]);

  (0,r.useEffect)(()=>{
    if("undefined"==typeof window)return;
    let syncFromUrl=()=>{
      let sp=new URLSearchParams(window.location.search),
        st=sp.get("share"),
        md=sp.get("mode"),
        isKelolaPath=window.location.pathname.endsWith("/kelola")||"kelola"===md;
      setViewMode(isKelolaPath?"kelola":"rekap");
      if(st){
        if(hasAuthToken){
          setIsStandaloneShareMode(!1);
          d.api.get("/bdb/panduan/share-challenge",{params:{token:st}}).then(res=>{
            let pInfo=res.data?.data?.panduan;
            if(pInfo?.id)openInternalGuideDirect(pInfo,!1);
          }).catch(()=>{});
        }else{
          setIsStandaloneShareMode(!0);
          setShareToken(st);
          loadShareChallenge(st,null);
        }
      }else{
        setIsStandaloneShareMode(!1);
      }
    },
    onSideNav=ev=>{
      let href=String(ev?.detail?.href||"");
      if(href.includes("/cms/panduan")){
        if(href.includes("mode=kelola")||href.endsWith("/kelola"))setViewMode("kelola");
        else if(!href.includes("share="))setViewMode("rekap");
      }
      [15,60,150,300].forEach(ms=>setTimeout(syncFromUrl,ms));
    },
    delayed=()=>{setTimeout(syncFromUrl,20);setTimeout(syncFromUrl,100);setTimeout(syncFromUrl,250)};
    syncFromUrl();
    window.addEventListener("cas-url-change",syncFromUrl);
    window.addEventListener("cas:sidebar-navigate",onSideNav);
    window.addEventListener("popstate",syncFromUrl);
    document.addEventListener("click",delayed,!0);
    return()=>{
      window.removeEventListener("cas-url-change",syncFromUrl);
      window.removeEventListener("cas:sidebar-navigate",onSideNav);
      window.removeEventListener("popstate",syncFromUrl);
      document.removeEventListener("click",delayed,!0);
    };
  },[loadShareChallenge,hasAuthToken]);

  let renderGateFormContent=(isDarkPortal=!0)=>{
    let pInfo=challengeData?.panduan,
      svgUrl=challengeData?.captcha_svg||challengeData?.svg_data_url,
      digitsCount=(gateForm.nrp_nip||"").replace(/\D/g,"").length,
      isDigitsValid="ANGGOTA_POLRI"===gateForm.jenis_personel?digitsCount>=6&&digitsCount<=10:digitsCount>=14&&digitsCount<=18;
    return(0,t.jsxs)("form",{
      onSubmit:submitViewerGate,
      style:{display:"grid",gap:"0.95rem"},
      children:[
        (0,t.jsxs)("div",{
          style:{padding:"0.9rem 1rem",borderRadius:10,background:isDarkPortal?"rgba(15,23,42,0.85)":"#f8fafc",border:isDarkPortal?"1px solid rgba(56,189,248,0.28)":"1px solid #e2e8f0",color:isDarkPortal?"#cbd5e1":"#334155",fontSize:"0.82rem",lineHeight:1.5},
          children:[
            (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.5rem",flexWrap:"wrap",marginBottom:"0.35rem"},children:[
              (0,t.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.35rem",fontSize:"0.7rem",fontWeight:800,padding:"0.15rem 0.55rem",borderRadius:6,background:pInfo?.tipe==="VIDEO"?"rgba(220,38,38,0.18)":"rgba(37,99,235,0.18)",color:pInfo?.tipe==="VIDEO"?"#f87171":"#60a5fa",border:pInfo?.tipe==="VIDEO"?"1px solid rgba(248,113,113,0.35)":"1px solid rgba(96,165,250,0.35)"},children:[
                (0,t.jsx)("i",{className:pInfo?.tipe==="VIDEO"?"pi pi-video":"pi pi-book",style:{fontSize:"0.72rem"}}),
                pInfo?.tipe==="VIDEO"?"VIDEO TUTORIAL TERENKRIPSI":"DOKUMEN PANDUAN TERENKRIPSI"
              ]}),
              pInfo?.kategori&&(0,t.jsx)("span",{style:{fontSize:"0.7rem",fontWeight:700,color:isDarkPortal?"#94a3b8":"#64748b"},children:`Kategori: ${pInfo.kategori}${u(pInfo.size)?` - ${u(pInfo.size)}`:""}`})
            ]}),
            (0,t.jsx)("div",{style:{fontWeight:800,fontSize:"0.98rem",color:isDarkPortal?"#f8fafc":"#0f172a",marginBottom:"0.25rem"},children:pInfo?.judul||"Materi Panduan Operasional CAS Bareskrim Polri"}),
            pInfo?.deskripsi&&(0,t.jsx)("div",{style:{fontSize:"0.78rem",color:isDarkPortal?"#94a3b8":"#475569",marginBottom:"0.35rem"},children:pInfo.deskripsi}),
            (0,t.jsxs)("div",{style:{display:"inline-flex",alignItems:"center",gap:"0.35rem",fontSize:"0.76rem",color:isDarkPortal?"#38bdf8":"#1d4ed8",fontWeight:600},children:[
              (0,t.jsx)("i",{className:"pi pi-lock",style:{fontSize:"0.75rem"}}),
              "Akses Eksternal: Wajib verifikasi NRP/NIP & Captcha sebelum membuka materi panduan."
            ]})
          ]
        }),
        gateErr&&(0,t.jsx)("div",{style:{padding:"0.7rem 0.9rem",borderRadius:8,background:isDarkPortal?"rgba(127,29,29,0.45)":"#fef2f2",border:"1px solid #f87171",color:isDarkPortal?"#fecaca":"#b91c1c",fontSize:"0.8rem",fontWeight:700},children:gateErr}),
        (0,t.jsxs)("div",{children:[
          (0,t.jsx)("label",{style:{display:"block",fontSize:"0.78rem",fontWeight:700,color:isDarkPortal?"#e2e8f0":"#334155",marginBottom:"0.38rem"},children:"1. Pilih Jenis Personel *"}),
          (0,t.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.55rem"},children:[
            (0,t.jsxs)("button",{type:"button",onClick:()=>setGateForm(s=>({...s,jenis_personel:"ANGGOTA_POLRI",nrp_nip:""})),style:{display:"inline-flex",alignItems:"center",justifyContent:"center",gap:"0.4rem",padding:"0.6rem 0.75rem",borderRadius:8,border:gateForm.jenis_personel==="ANGGOTA_POLRI"?"2px solid #38bdf8":isDarkPortal?"1px solid #334155":"1px solid #cbd5e1",background:gateForm.jenis_personel==="ANGGOTA_POLRI"?isDarkPortal?"rgba(2,132,199,0.28)":"#eff6ff":isDarkPortal?"#0f172a":"#fff",color:gateForm.jenis_personel==="ANGGOTA_POLRI"?isDarkPortal?"#38bdf8":"#1d4ed8":isDarkPortal?"#94a3b8":"#475569",fontWeight:700,fontSize:"0.82rem",cursor:"pointer"},children:[(0,t.jsx)("i",{className:"pi pi-id-card"}),"Anggota Polri (NRP)"]}),
            (0,t.jsxs)("button",{type:"button",onClick:()=>setGateForm(s=>({...s,jenis_personel:"PNS_POLRI",nrp_nip:""})),style:{display:"inline-flex",alignItems:"center",justifyContent:"center",gap:"0.4rem",padding:"0.6rem 0.75rem",borderRadius:8,border:gateForm.jenis_personel==="PNS_POLRI"?"2px solid #38bdf8":isDarkPortal?"1px solid #334155":"1px solid #cbd5e1",background:gateForm.jenis_personel==="PNS_POLRI"?isDarkPortal?"rgba(2,132,199,0.28)":"#eff6ff":isDarkPortal?"#0f172a":"#fff",color:gateForm.jenis_personel==="PNS_POLRI"?isDarkPortal?"#38bdf8":"#1d4ed8":isDarkPortal?"#94a3b8":"#475569",fontWeight:700,fontSize:"0.82rem",cursor:"pointer"},children:[(0,t.jsx)("i",{className:"pi pi-user"}),"PNS Polri (NIP)"]})
          ]})
        ]}),
        (0,t.jsxs)("div",{children:[
          (0,t.jsx)("label",{style:{display:"block",fontSize:"0.78rem",fontWeight:700,color:isDarkPortal?"#e2e8f0":"#334155",marginBottom:"0.32rem"},children:"2. Nama Lengkap & Pangkat Personel (Opsional)"}),
          (0,t.jsx)("input",{type:"text",required:!1,value:gateForm.nama,onChange:e=>setGateForm(s=>({...s,nama:e.target.value})),placeholder:"Kosongkan untuk tarik otomatis dari NRP/NIP, atau isi manual",style:{width:"100%",height:"40px",padding:"0 0.8rem",borderRadius:8,border:isDarkPortal?"1px solid #334155":"1px solid #cbd5e1",background:isDarkPortal?"#0f172a":"#fff",color:isDarkPortal?"#f8fafc":"#0f172a",fontSize:"0.86rem",boxSizing:"border-box"}})
        ]}),
        (0,t.jsxs)("div",{children:[
          (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.32rem"},children:[
            (0,t.jsx)("label",{style:{fontSize:"0.78rem",fontWeight:700,color:isDarkPortal?"#e2e8f0":"#334155"},children:gateForm.jenis_personel==="ANGGOTA_POLRI"?"3. NRP Anggota Polri (6-10 digit) *":"3. NIP PNS Polri (14-18 digit) *"}),
            (0,t.jsxs)("span",{style:{fontSize:"0.7rem",fontWeight:700,color:0===digitsCount?"#64748b":isDigitsValid?"#10b981":"#f59e0b"},children:[digitsCount," digit"]})
          ]}),
          (0,t.jsx)("input",{type:"text",required:!0,inputMode:"numeric",maxLength:gateForm.jenis_personel==="ANGGOTA_POLRI"?10:18,value:gateForm.nrp_nip,onChange:e=>setGateForm(s=>({...s,nrp_nip:e.target.value.replace(/\D/g,"")})),placeholder:gateForm.jenis_personel==="ANGGOTA_POLRI"?"Contoh: 98040123":"Contoh: 198504122010121002",style:{width:"100%",height:"40px",padding:"0 0.8rem",borderRadius:8,border:isDarkPortal?"1px solid #334155":"1px solid #cbd5e1",background:isDarkPortal?"#0f172a":"#fff",color:isDarkPortal?"#f8fafc":"#0f172a",fontSize:"0.88rem",fontFamily:"monospace",letterSpacing:"0.05em",boxSizing:"border-box"}})
        ]}),
        (0,t.jsxs)("div",{children:[
          (0,t.jsx)("label",{style:{display:"block",fontSize:"0.78rem",fontWeight:700,color:isDarkPortal?"#e2e8f0":"#334155",marginBottom:"0.35rem"},children:"4. Kode Keamanan Captcha *"}),
          (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.6rem",flexWrap:"wrap"},children:[
            challengeLoading?(0,t.jsx)("div",{style:{width:"200px",height:"60px",borderRadius:8,background:"#0f172a",border:"1px solid #334155",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.76rem",color:"#94a3b8"},children:"Memuat Captcha..."}):svgUrl&&(0,t.jsx)("img",{src:svgUrl,alt:"Captcha 6 Karakter",style:{width:"200px",height:"60px",borderRadius:8,border:"1px solid #334155",display:"block"}}),
            (0,t.jsxs)("button",{type:"button",onClick:()=>{setGateForm(s=>({...s,captcha_answer:""})),loadShareChallenge(shareToken,targetPanduanId)},title:"Muat ulang kode Captcha",style:{display:"inline-flex",alignItems:"center",gap:"0.35rem",height:"42px",padding:"0 0.8rem",borderRadius:8,border:isDarkPortal?"1px solid #334155":"1px solid #cbd5e1",background:isDarkPortal?"#0f172a":"#f8fafc",color:isDarkPortal?"#e2e8f0":"#334155",cursor:"pointer",fontSize:"0.76rem",fontWeight:700},children:[(0,t.jsx)("i",{className:"pi pi-refresh"}),"Ganti"]}),
            (0,t.jsx)("input",{type:"text",required:!0,maxLength:6,value:gateForm.captcha_answer,onChange:e=>setGateForm(s=>({...s,captcha_answer:e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,"")})),placeholder:"Ketik 6 karakter kode",style:{flex:"1 1 12rem",height:"42px",padding:"0 0.85rem",borderRadius:8,border:isDarkPortal?"1px solid #334155":"1px solid #cbd5e1",background:isDarkPortal?"#0f172a":"#fff",color:isDarkPortal?"#f8fafc":"#0f172a",fontSize:"0.92rem",fontWeight:700,fontFamily:"monospace",letterSpacing:"0.12em",boxSizing:"border-box"}})
          ]})
        ]}),
        (0,t.jsx)("div",{style:{display:"flex",justifyContent:"flex-end",gap:"0.55rem",marginTop:"0.35rem",paddingTop:"0.75rem",borderTop:isDarkPortal?"1px solid rgba(148,163,184,0.16)":"1px solid #e2e8f0"},children:(0,t.jsxs)("button",{type:"submit",disabled:gateSubmitting||challengeLoading,style:{display:"inline-flex",alignItems:"center",justifyContent:"center",gap:"0.45rem",width:"100%",padding:"0.68rem 1.25rem",borderRadius:8,border:"none",background:"linear-gradient(135deg,#0284c7 0%,#2563eb 100%)",color:"#fff",fontWeight:800,fontSize:"0.86rem",cursor:"pointer"},children:[(0,t.jsx)("i",{className:gateSubmitting?"pi pi-spin pi-spinner":"pi pi-unlock"}),gateSubmitting?"Memverifikasi Identitas...":"Verifikasi Identitas & Buka Panduan"]})})
      ]
    });
  };

  if(isStandaloneShareMode&&!hasAuthToken){
    let wmText=f?`${f.verified_by?.nama||"PERSONEL POLRI"} (${f.verified_by?.nrp_nip||"-"}) - ${f.verified_by?.ts||""}`:"";
    return(0,t.jsxs)("div",{
      style:{minHeight:"100vh",background:"radial-gradient(circle at top,#1e293b 0%,#090d16 70%)",color:"#f8fafc",padding:"1.25rem 1rem 3rem",boxSizing:"border-box"},
      children:[
        (0,t.jsxs)("div",{style:{maxWidth:"74rem",margin:"0 auto 1.5rem",padding:"0.9rem 1.25rem",borderRadius:12,background:"rgba(15,23,42,0.88)",border:"1px solid rgba(56,189,248,0.28)",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"1rem",flexWrap:"wrap"},children:[
          (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.85rem"},children:[
            (0,t.jsx)("div",{style:{width:"2.75rem",height:"2.75rem",borderRadius:10,background:"linear-gradient(135deg,#0284c7,#1e3a8a)",display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid rgba(56,189,248,0.5)"},children:(0,t.jsx)("i",{className:"pi pi-shield",style:{fontSize:"1.25rem",color:"#fff"}})}),
            (0,t.jsxs)("div",{children:[
              (0,t.jsx)("div",{style:{fontSize:"0.98rem",fontWeight:800,letterSpacing:"0.02em",color:"#f8fafc"},children:"PORTAL AKSES EKSTERNAL PANDUAN TERENKRIPSI"}),
              (0,t.jsx)("div",{style:{fontSize:"0.74rem",color:"#94a3b8",fontWeight:600},children:"CRIMINAL ANALYTICS SYSTEM (CAS) — ROBINOPSNAL BARESKRIM POLRI"})
            ]})
          ]}),
          (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.6rem",flexWrap:"wrap"},children:[
            (0,t.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.35rem",padding:"0.35rem 0.75rem",borderRadius:6,background:"rgba(16,185,129,0.12)",border:"1px solid rgba(16,185,129,0.35)",color:"#34d399",fontSize:"0.72rem",fontWeight:700},children:[(0,t.jsx)("i",{className:"pi pi-lock"}),"AES-256-GCM Protected Stream"]}),
            (0,t.jsxs)("a",{href:"/login",style:{display:"inline-flex",alignItems:"center",gap:"0.35rem",padding:"0.4rem 0.85rem",borderRadius:8,border:"1px solid #334155",background:"#1e293b",color:"#cbd5e1",fontSize:"0.75rem",fontWeight:700,textDecoration:"none"},children:[(0,t.jsx)("i",{className:"pi pi-sign-in"}),"Masuk Aplikasi CAS"]})
          ]})
        ]}),
        !f||!f.url?(0,t.jsxs)("div",{style:{maxWidth:"38rem",margin:"1.5rem auto",padding:"1.5rem",borderRadius:12,background:"rgba(15,23,42,0.92)",border:"1px solid rgba(56,189,248,0.32)"},children:[
          (0,t.jsxs)("div",{style:{marginBottom:"1rem",paddingBottom:"0.75rem",borderBottom:"1px solid rgba(148,163,184,0.16)"},children:[
            (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.45rem",fontSize:"1.05rem",fontWeight:800,color:"#f8fafc"},children:[(0,t.jsx)("i",{className:"pi pi-shield",style:{color:"#38bdf8"}}),"Verifikasi Identitas Akses Panduan CAS"]}),
            (0,t.jsx)("div",{style:{fontSize:"0.78rem",color:"#94a3b8",marginTop:"0.2rem"},children:"Verifikasi NRP/NIP & Captcha diperlukan untuk membuka proteksi dokumen PDF maupun video tutorial."})
          ]}),
          renderGateFormContent(!0)
        ]}):(0,t.jsxs)("div",{style:{maxWidth:"74rem",margin:"0 auto",display:"grid",gap:"1rem"},children:[
          "VIDEO"===f.tipe?(0,t.jsx)(CasSecureVideoPlayer,{src:f.stream_url||f.url,title:f.judul,watermarkText:wmText,maxHeight:"74vh"}):(0,t.jsx)(CasSecurePdfViewer,{src:f.stream_url||f.url,title:f.judul,fileName:f.file_name,watermarkText:wmText,maxHeight:"76vh"})
        ]})
      ]
    });
  }

  let allGuides=(0,r.useMemo)(()=>{
    let apiIds=new Set(e.map(x=>String(x.file_name||"").toLowerCase()));
    let extras=BUILTIN_DEFAULT_GUIDES.filter(b=>!apiIds.has(String(b.file_name||"").toLowerCase()));
    return[...e,...extras];
  },[e]),
  categories=Array.from(new Set(allGuides.map(x=>(x.kategori||"Umum").trim()).filter(Boolean))),
  filteredItems=allGuides.filter(item=>{
    if("ALL"!==filterTipe&&item.tipe!==filterTipe)return!1;
    let kat=(item.kategori||"Umum").trim();
    if("ALL"!==filterKat&&kat!==filterKat)return!1;
    if(searchQuery.trim()){
      let q=searchQuery.trim().toLowerCase(),
        hay=`${item.judul||""} ${item.deskripsi||""} ${kat} ${item.file_name||""}`.toLowerCase();
      if(!hay.includes(q))return!1;
    }
    return!0;
  }),
  videoItems=filteredItems.filter(x=>"VIDEO"===x.tipe),
  pdfItems=filteredItems.filter(x=>"PDF"===x.tipe),
  totalVideo=allGuides.filter(x=>"VIDEO"===x.tipe).length,
  totalPdf=allGuides.filter(x=>"PDF"===x.tipe).length,
  internalWmText=f?.verified_by?`${f.verified_by.nama} (${f.verified_by.nrp_nip})${f.verified_by.satker?` - ${f.verified_by.satker}`:""} - ${f.verified_by.ts}`:loggedUser?.watermark||"PERSONEL POLRI",
  currentEbook=activeEbook||pdfItems[0]||BUILTIN_DEFAULT_GUIDES[0];

  return(0,t.jsxs)("div",{
    children:[
      /* HEADER */
      (0,t.jsxs)("div",{
        style:{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:"1rem",flexWrap:"wrap",marginBottom:"0.9rem"},
        children:[
          (0,t.jsxs)("div",{children:[
            (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.55rem",flexWrap:"wrap"},children:[
              (0,t.jsx)("h1",{className:"cms-page-title",style:{margin:0},children:"kelola"===viewMode?"Kelola Panduan Pengguna":"Beranda Media Panduan Pengguna"}),
              (0,t.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.35rem",padding:"0.2rem 0.65rem",borderRadius:999,background:"rgba(220,38,38,0.12)",border:"1px solid rgba(220,38,38,0.35)",color:"#dc2626",fontSize:"0.71rem",fontWeight:800},children:[
                (0,t.jsx)("i",{className:"pi pi-play-circle",style:{fontSize:"0.72rem"}}),"Video Hub & E-Book Webtoon Reader"
              ]})
            ]}),
            (0,t.jsx)("p",{className:"cms-page-sub",style:{marginTop:"0.22rem"},children:"kelola"===viewMode?"Unggah, perbarui, atur urutan, atau nonaktifkan materi video tutorial & e-book panduan operasional CAS.":"Tonton langsung video tutorial bergaya beranda YouTube atau baca modul panduan interaktif secara vertikal ala E-Book / Webtoon tanpa perlu mengunduh berkas."})
          ]}),
          (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem",flexWrap:"wrap"},children:[
            (isSuperAdmin||"kelola"===viewMode)&&(0,t.jsxs)("div",{
              style:{display:"inline-flex",borderRadius:8,border:"1px solid var(--cas-border-strong)",background:"var(--cas-surface-subtle)",padding:"0.18rem",gap:"0.2rem"},
              children:[
                (0,t.jsxs)("button",{type:"button",onClick:()=>{setViewMode("rekap");if("undefined"!=typeof window&&window.history?.replaceState)window.history.replaceState({},"","/cms/panduan")},style:{display:"inline-flex",alignItems:"center",gap:"0.35rem",padding:"0.36rem 0.78rem",borderRadius:6,border:"none",background:"rekap"===viewMode?"#1e40af":"transparent",color:"rekap"===viewMode?"#fff":"var(--cas-text-secondary)",fontSize:"0.76rem",fontWeight:700,cursor:"pointer"},children:[
                  (0,t.jsx)("i",{className:"pi pi-th-large",style:{fontSize:"0.74rem"}}),"Beranda Panduan"
                ]}),
                (0,t.jsxs)("button",{type:"button",onClick:()=>{setViewMode("kelola");if("undefined"!=typeof window&&window.history?.replaceState)window.history.replaceState({},"","/cms/panduan?mode=kelola")},style:{display:"inline-flex",alignItems:"center",gap:"0.35rem",padding:"0.36rem 0.78rem",borderRadius:6,border:"none",background:"kelola"===viewMode?"#1e40af":"transparent",color:"kelola"===viewMode?"#fff":"var(--cas-text-secondary)",fontSize:"0.76rem",fontWeight:700,cursor:"pointer"},children:[
                  (0,t.jsx)("i",{className:"pi pi-cog",style:{fontSize:"0.74rem"}}),"Kelola Panduan"
                ]})
              ]
            }),
            canMutatePanduan&&(0,t.jsxs)("button",{
              type:"button",
              onClick:()=>{setFormData({id:null,judul:"",deskripsi:"",kategori:"Umum",tipe:"PDF",urutan:0});setFormFile(null);setFormErr("");setFormOpen(!0)},
              style:{display:"inline-flex",alignItems:"center",gap:"0.4rem",padding:"0.46rem 0.92rem",borderRadius:8,border:"none",background:"linear-gradient(135deg,#0284c7 0%,#1d4ed8 100%)",color:"#fff",fontSize:"0.78rem",fontWeight:800,cursor:"pointer",boxShadow:"0 4px 12px rgba(29,78,216,0.25)"},
              children:[(0,t.jsx)("i",{className:"pi pi-plus",style:{fontSize:"0.75rem"}}),"Unggah Materi Baru"]
            })
          ]})
        ]
      }),

      /* TOP NAVIGATION BAR (CLEAN PRIMEICONS, ZERO EMOJIS) */
      (0,t.jsxs)("div",{
        className:"cms-card",
        style:{borderRadius:12,padding:"0.75rem 1rem",marginBottom:"1rem",display:"grid",gap:"0.65rem"},
        children:[
          (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.65rem",flexWrap:"wrap"},children:[
            (0,t.jsxs)("div",{style:{display:"inline-flex",gap:"0.4rem",flexWrap:"wrap"},children:[
              (0,t.jsxs)("button",{
                type:"button",
                onClick:()=>setFilterTipe("ALL"),
                style:{display:"inline-flex",alignItems:"center",gap:"0.4rem",padding:"0.44rem 0.85rem",borderRadius:999,border:"ALL"===filterTipe?"1px solid #2563eb":"1px solid var(--cas-border-strong)",background:"ALL"===filterTipe?"#2563eb":"var(--cas-surface-subtle)",color:"ALL"===filterTipe?"#fff":"var(--cas-text-secondary)",fontSize:"0.78rem",fontWeight:800,cursor:"pointer"},
                children:[(0,t.jsx)("i",{className:"pi pi-th-large",style:{fontSize:"0.78rem"}}),"Semua Konten (",allGuides.length,")"]
              }),
              (0,t.jsxs)("button",{
                type:"button",
                onClick:()=>setFilterTipe("VIDEO"),
                style:{display:"inline-flex",alignItems:"center",gap:"0.4rem",padding:"0.44rem 0.85rem",borderRadius:999,border:"VIDEO"===filterTipe?"1px solid #dc2626":"1px solid rgba(220,38,38,0.35)",background:"VIDEO"===filterTipe?"#dc2626":"rgba(239,68,68,0.08)",color:"VIDEO"===filterTipe?"#fff":"#dc2626",fontSize:"0.78rem",fontWeight:800,cursor:"pointer"},
                children:[(0,t.jsx)("i",{className:"pi pi-play-circle",style:{fontSize:"0.82rem"}}),"Video Tutorial (",totalVideo,")"]
              }),
              (0,t.jsxs)("button",{
                type:"button",
                onClick:()=>setFilterTipe("PDF"),
                style:{display:"inline-flex",alignItems:"center",gap:"0.4rem",padding:"0.44rem 0.85rem",borderRadius:999,border:"PDF"===filterTipe?"1px solid #0284c7":"1px solid rgba(2,132,199,0.35)",background:"PDF"===filterTipe?"#0284c7":"rgba(2,132,199,0.08)",color:"PDF"===filterTipe?"#fff":"#0284c7",fontSize:"0.78rem",fontWeight:800,cursor:"pointer"},
                children:[(0,t.jsx)("i",{className:"pi pi-book",style:{fontSize:"0.8rem"}}),"E-Book & Modul Bacaan (",totalPdf,")"]
              })
            ]}),
            (0,t.jsxs)("div",{style:{position:"relative",flex:"1 1 16rem",maxWidth:"26rem"},children:[
              (0,t.jsx)("i",{className:"pi pi-search",style:{position:"absolute",left:"0.75rem",top:"50%",transform:"translateY(-50%)",color:"var(--cas-text-muted)",fontSize:"0.8rem",pointerEvents:"none"}}),
              (0,t.jsx)("input",{
                type:"text",
                value:searchQuery,
                onChange:ev=>setSearchQuery(ev.target.value),
                placeholder:"Cari judul video tutorial, modul e-book, atau topik...",
                style:{width:"100%",height:"38px",padding:"0 0.75rem 0 2.15rem",borderRadius:999,border:"1px solid var(--cas-border-strong)",background:"var(--cas-card-bg)",color:"var(--cas-text-primary)",fontSize:"0.82rem",boxSizing:"border-box"}
              })
            ]})
          ]}),
          /* TOPIC / CATEGORY PILLS */
          (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.35rem",flexWrap:"wrap",paddingTop:"0.35rem",borderTop:"1px solid var(--cas-border)"},children:[
            (0,t.jsxs)("span",{style:{fontSize:"0.72rem",fontWeight:700,color:"var(--cas-text-muted)",display:"inline-flex",alignItems:"center",gap:"0.28rem",marginRight:"0.2rem"},children:[
              (0,t.jsx)("i",{className:"pi pi-filter",style:{fontSize:"0.68rem"}}),"Topik:"
            ]}),
            (0,t.jsx)("button",{
              type:"button",
              onClick:()=>setFilterKat("ALL"),
              style:{padding:"0.26rem 0.65rem",borderRadius:999,border:"ALL"===filterKat?"1px solid #2563eb":"1px solid var(--cas-border)",background:"ALL"===filterKat?"rgba(37,99,235,0.14)":"var(--cas-surface-subtle)",color:"ALL"===filterKat?"#2563eb":"var(--cas-text-secondary)",fontSize:"0.72rem",fontWeight:700,cursor:"pointer"},
              children:"Semua Topik"
            }),
            categories.map(kat=>(0,t.jsx)("button",{
              type:"button",
              onClick:()=>setFilterKat(kat),
              style:{padding:"0.26rem 0.65rem",borderRadius:999,border:filterKat===kat?"1px solid #2563eb":"1px solid var(--cas-border)",background:filterKat===kat?"rgba(37,99,235,0.14)":"var(--cas-surface-subtle)",color:filterKat===kat?"#2563eb":"var(--cas-text-secondary)",fontSize:"0.72rem",fontWeight:700,cursor:"pointer"},
              children:kat
            },kat))
          ]})
        ]
      }),

      copyFeedback&&(0,t.jsxs)("div",{
        style:{marginBottom:"0.9rem",padding:"0.7rem 1rem",borderRadius:8,background:"rgba(16,185,129,0.14)",border:"1px solid #10b981",color:"#059669",fontSize:"0.82rem",fontWeight:700,display:"flex",alignItems:"center",gap:"0.45rem"},
        children:[(0,t.jsx)("i",{className:"pi pi-check-circle"}),copyFeedback]
      }),

      /* KELOLA TABLE MODE */
      "kelola"===viewMode?(0,t.jsx)("div",{
        className:"cms-card",
        style:{borderRadius:12,padding:0,overflowX:"auto"},
        children:(0,t.jsxs)("table",{
          style:{width:"100%",borderCollapse:"collapse",fontSize:"0.82rem"},
          children:[
            (0,t.jsx)("thead",{children:(0,t.jsxs)("tr",{style:{background:"var(--cas-surface-subtle)",borderBottom:"1px solid var(--cas-border)",textAlign:"left",color:"var(--cas-text-secondary)"},children:[
              (0,t.jsx)("th",{style:{padding:"0.7rem 0.85rem",width:"3rem"},children:"No"}),
              (0,t.jsx)("th",{style:{padding:"0.7rem 0.85rem"},children:"Judul & Berkas"}),
              (0,t.jsx)("th",{style:{padding:"0.7rem 0.85rem"},children:"Kategori"}),
              (0,t.jsx)("th",{style:{padding:"0.7rem 0.85rem"},children:"Tipe"}),
              (0,t.jsx)("th",{style:{padding:"0.7rem 0.85rem"},children:"Ukuran"}),
              (0,t.jsx)("th",{style:{padding:"0.7rem 0.85rem"},children:"Status"}),
              (0,t.jsx)("th",{style:{padding:"0.7rem 0.85rem"},children:"Urutan"}),
              (0,t.jsx)("th",{style:{padding:"0.7rem 0.85rem",textAlign:"right"},children:"Aksi"})
            ]})}),
            (0,t.jsx)("tbody",{children:filteredItems.map((item,idx)=>{
              let isBuiltin=String(item.id).startsWith("builtin-");
              return(0,t.jsxs)("tr",{style:{borderBottom:"1px solid var(--cas-border)"},children:[
                (0,t.jsx)("td",{style:{padding:"0.55rem 0.85rem",color:"var(--cas-text-muted)"},children:idx+1}),
                (0,t.jsxs)("td",{style:{padding:"0.55rem 0.85rem",maxWidth:"24rem"},children:[
                  (0,t.jsx)("div",{style:{fontWeight:700,color:"var(--cas-text-primary)",fontSize:"0.82rem"},children:item.judul}),
                  item.deskripsi&&(0,t.jsx)("div",{style:{fontSize:"0.72rem",color:"var(--cas-text-muted)",marginTop:"0.1rem"},children:item.deskripsi}),
                  (0,t.jsx)("div",{style:{fontSize:"0.68rem",color:"#2563eb",fontFamily:"monospace",marginTop:"0.1rem"},children:item.file_name})
                ]}),
                (0,t.jsx)("td",{style:{padding:"0.55rem 0.85rem",fontWeight:600,fontSize:"0.76rem"},children:item.kategori||"Umum"}),
                (0,t.jsx)("td",{style:{padding:"0.55rem 0.85rem"},children:(0,t.jsx)(i.Tag,{value:item.tipe,severity:"VIDEO"===item.tipe?"danger":"info",style:{fontSize:"0.66rem"}})}),
                (0,t.jsx)("td",{style:{padding:"0.55rem 0.85rem",color:"var(--cas-text-muted)",fontSize:"0.75rem"},children:u(item.size)||"-"}),
                (0,t.jsx)("td",{style:{padding:"0.55rem 0.85rem"},children:(0,t.jsx)(i.Tag,{value:"AKTIF"===item.status?"Aktif":"Nonaktif",severity:"AKTIF"===item.status?"success":"danger",style:{fontSize:"0.66rem"}})}),
                (0,t.jsx)("td",{style:{padding:"0.55rem 0.85rem",textAlign:"center",fontSize:"0.76rem"},children:item.urutan||0}),
                (0,t.jsx)("td",{style:{padding:"0.55rem 0.85rem",textAlign:"right",whiteSpace:"nowrap"},children:(0,t.jsxs)("div",{style:{display:"inline-flex",gap:"0.3rem",alignItems:"center"},children:[
                  (0,t.jsxs)("button",{type:"button",onClick:()=>openInternalGuideDirect(item,!1),style:{display:"inline-flex",alignItems:"center",gap:"0.3rem",padding:"0.26rem 0.55rem",borderRadius:6,border:"1px solid rgba(59,130,246,0.35)",background:"rgba(37,99,235,0.12)",color:"#2563eb",fontSize:"0.72rem",fontWeight:700,cursor:"pointer"},children:[
                    (0,t.jsx)("i",{className:"VIDEO"===item.tipe?"pi pi-play":"pi pi-eye",style:{fontSize:"0.7rem"}}),
                    "VIDEO"===item.tipe?"Putar":"Buka"
                  ]}),
                  (0,t.jsxs)("button",{type:"button",onClick:ev=>copyEncryptedShareLink(item,ev),style:{display:"inline-flex",alignItems:"center",gap:"0.3rem",padding:"0.26rem 0.55rem",borderRadius:6,border:"1px solid var(--cas-border-strong)",background:"var(--cas-surface-subtle)",color:"var(--cas-text-secondary)",fontSize:"0.72rem",fontWeight:700,cursor:"pointer"},children:[
                    (0,t.jsx)("i",{className:"pi pi-share-alt",style:{fontSize:"0.7rem"}}),"Share"
                  ]}),
                  !isBuiltin&&(0,t.jsxs)("button",{type:"button",disabled:!canMutatePanduan,onClick:()=>{if(!canMutatePanduan)return;setFormData({id:item.id,judul:item.judul||"",deskripsi:item.deskripsi||"",kategori:item.kategori||"Umum",tipe:item.tipe||"PDF",urutan:item.urutan||0});setFormFile(null);setFormErr("");setFormOpen(!0)},style:{display:"inline-flex",alignItems:"center",gap:"0.3rem",padding:"0.26rem 0.55rem",borderRadius:6,border:"1px solid var(--cas-border-strong)",background:"var(--cas-card-bg)",color:"var(--cas-text-primary)",fontSize:"0.72rem",fontWeight:700,cursor:canMutatePanduan?"pointer":"not-allowed",opacity:canMutatePanduan?1:0.5},children:[
                    (0,t.jsx)("i",{className:"pi pi-pencil",style:{fontSize:"0.7rem"}}),"Ubah"
                  ]}),
                  !isBuiltin&&(0,t.jsxs)("button",{type:"button",disabled:!canMutatePanduan,onClick:ev=>handleToggleStatus(item,ev),style:{display:"inline-flex",alignItems:"center",gap:"0.3rem",padding:"0.26rem 0.55rem",borderRadius:6,border:"1px solid rgba(245,158,11,0.4)",background:"rgba(245,158,11,0.12)",color:"#d97706",fontSize:"0.72rem",fontWeight:700,cursor:canMutatePanduan?"pointer":"not-allowed",opacity:canMutatePanduan?1:0.5},children:[
                    (0,t.jsx)("i",{className:"AKTIF"===item.status?"pi pi-ban":"pi pi-check",style:{fontSize:"0.7rem"}}),
                    "AKTIF"===item.status?"Nonaktifkan":"Aktifkan"
                  ]}),
                  !isBuiltin&&(0,t.jsxs)("button",{type:"button",disabled:!canMutatePanduan,onClick:ev=>handleDeletePanduan(item,ev),style:{display:"inline-flex",alignItems:"center",gap:"0.3rem",padding:"0.26rem 0.55rem",borderRadius:6,border:"1px solid #dc2626",background:"rgba(239,68,68,0.15)",color:"#dc2626",fontSize:"0.72rem",fontWeight:800,cursor:canMutatePanduan?"pointer":"not-allowed",opacity:canMutatePanduan?1:0.5},children:[
                    (0,t.jsx)("i",{className:"pi pi-trash",style:{fontSize:"0.7rem"}}),"Hapus"
                  ]})
                ]})})
              ]},item.id);
            })})
          ]
        })
      }):(0,t.jsxs)("div",{
        style:{display:"grid",gap:"1.5rem"},
        children:[
          /* 1. YOUTUBE THEATER PLAYER STAGE (WHEN A VIDEO IS SELECTED FOR THEATER PLAYBACK) */
          theaterVideo&&(0,t.jsxs)("div",{
            className:"cms-card",
            style:{borderRadius:14,padding:"1rem",background:"#090d16",border:"1px solid rgba(56,189,248,0.35)"},
            children:[
              (0,t.jsx)(CasSecureVideoPlayer,{
                src:theaterVideo.stream_url||theaterVideo.url,
                title:theaterVideo.judul,
                watermarkText:internalWmText,
                autoPlay:!0,
                maxHeight:"68vh",
                onClose:()=>setTheaterVideo(null)
              })
            ]
          }),

          /* 2. BERANDA VIDEO TUTORIAL (YOUTUBE-STYLE RESPONSIVE VIDEO GRID) */
          ("ALL"===filterTipe||"VIDEO"===filterTipe)&&(0,t.jsxs)("section",{
            style:{display:"grid",gap:"0.9rem"},
            children:[
              (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.75rem",flexWrap:"wrap"},children:[
                (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.55rem"},children:[
                  (0,t.jsx)("span",{style:{width:"2.2rem",height:"2.2rem",borderRadius:9,background:"rgba(220,38,38,0.14)",color:"#dc2626",display:"inline-flex",alignItems:"center",justifyContent:"center"},children:(0,t.jsx)("i",{className:"pi pi-play-circle",style:{fontSize:"1.1rem"}})}),
                  (0,t.jsxs)("div",{children:[
                    (0,t.jsx)("div",{style:{fontWeight:800,fontSize:"1rem",color:"var(--cas-text-primary)"},children:"Beranda Video Tutorial (Klik Play Langsung di Kartu)"}),
                    (0,t.jsx)("div",{style:{fontSize:"0.76rem",color:"var(--cas-text-muted)"},children:"Klik tombol Play pada thumbnail 16:9 untuk memutar video langsung di tempat, atau buka Mode Bioskop (Theater Player)."})
                  ]})
                ]}),
                (0,t.jsxs)("span",{style:{fontSize:"0.75rem",fontWeight:700,color:"var(--cas-text-muted)"},children:[videoItems.length," Video Tersedia"]})
              ]}),
              m?(0,t.jsx)("div",{className:"cms-card",children:"Memuat daftar video tutorial..."}):0===videoItems.length?(0,t.jsxs)("div",{className:"cms-card",style:{textAlign:"center",padding:"2rem",color:"var(--cas-text-muted)"},children:[
                (0,t.jsx)("i",{className:"pi pi-video",style:{fontSize:"1.8rem",marginBottom:"0.4rem",display:"block"}}),
                "Belum ada video tutorial pada filter ini."
              ]}):(0,t.jsx)("div",{
                style:{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(290px, 1fr))",gap:"1.1rem"},
                children:videoItems.map((item,idx)=>{
                  let isPlayingInline=inlinePlayingId===item.id&&(item.stream_url||item.url),
                    durBadge=item.duration_label||["03:45","04:20","05:15","06:10","03:30"][idx%5],
                    stepBadge=item.steps_count||4+(idx%4);
                  return(0,t.jsxs)("div",{
                    className:"cms-card",
                    style:{borderRadius:12,padding:0,overflow:"hidden",border:isPlayingInline?"2px solid #dc2626":"1px solid var(--cas-border)",display:"flex",flexDirection:"column",background:"var(--cas-card-bg)",boxShadow:"0 6px 20px rgba(15,23,42,0.06)"},
                    children:[
                      /* 16:9 YOUTUBE THUMBNAIL / INLINE VIDEO STAGE */
                      (0,t.jsxs)("div",{
                        style:{position:"relative",width:"100%",aspectRatio:"16 / 9",background:"linear-gradient(135deg,#0f172a 0%,#1e293b 55%,#090d16 100%)",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center"},
                        children:[
                          isPlayingInline?(0,t.jsx)("video",{
                            src:item.stream_url||item.url,
                            controls:!0,
                            autoPlay:!0,
                            playsInline:!0,
                            style:{width:"100%",height:"100%",objectFit:"contain",background:"#000"}
                          }):(0,t.jsxs)(r.Fragment,{children:[
                            (item.stream_url||item.url)&&(0,t.jsx)("video",{
                              src:`${item.stream_url||item.url}#t=1`,
                              preload:"metadata",
                              muted:!0,
                              playsInline:!0,
                              style:{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",opacity:0.55,pointerEvents:"none"}
                            }),
                            /* Top-left HD + Category Badge */
                            (0,t.jsxs)("div",{style:{position:"absolute",top:"0.6rem",left:"0.65rem",display:"flex",alignItems:"center",gap:"0.35rem",zIndex:2},children:[
                              (0,t.jsx)("span",{style:{padding:"0.15rem 0.45rem",borderRadius:5,background:"#dc2626",color:"#fff",fontSize:"0.64rem",fontWeight:800,letterSpacing:"0.04em"},children:"HD 1080p"}),
                              (0,t.jsx)("span",{style:{padding:"0.15rem 0.5rem",borderRadius:5,background:"rgba(15,23,42,0.78)",color:"#38bdf8",fontSize:"0.65rem",fontWeight:700,border:"1px solid rgba(56,189,248,0.3)"},children:item.kategori||"Tutorial CAS"})
                            ]}),
                            /* Top-right Theater Mode button */
                            (0,t.jsx)("button",{
                              type:"button",
                              onClick:ev=>{ev.stopPropagation();openInternalGuideDirect(item,!0)},
                              title:"Buka di Mode Bioskop (Theater Player)",
                              style:{position:"absolute",top:"0.6rem",right:"0.65rem",zIndex:2,padding:"0.25rem 0.5rem",borderRadius:6,border:"1px solid rgba(255,255,255,0.25)",background:"rgba(15,23,42,0.78)",color:"#f8fafc",fontSize:"0.68rem",fontWeight:700,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"0.25rem"},
                              children:[(0,t.jsx)("i",{className:"pi pi-window-maximize",style:{fontSize:"0.66rem"}}),"Theater"]
                            }),
                            /* Big Centered YouTube Play Button */
                            (0,t.jsx)("button",{
                              type:"button",
                              onClick:ev=>playVideoInlineInCard(item,ev),
                              title:"Putar Langsung di Kartu Ini",
                              style:{position:"relative",zIndex:2,width:"3.8rem",height:"2.7rem",borderRadius:12,border:"2px solid rgba(255,255,255,0.9)",background:"rgba(220,38,38,0.94)",color:"#ffffff",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",boxShadow:"0 10px 25px rgba(220,38,38,0.55)"},
                              children:(0,t.jsx)("i",{className:"pi pi-play",style:{fontSize:"1.2rem",marginLeft:"0.12rem"}})
                            }),
                            /* Bottom-right Duration Badge */
                            (0,t.jsx)("span",{
                              style:{position:"absolute",bottom:"0.55rem",right:"0.65rem",zIndex:2,padding:"0.14rem 0.45rem",borderRadius:5,background:"rgba(2,6,23,0.88)",color:"#f8fafc",fontFamily:"monospace",fontSize:"0.7rem",fontWeight:800,border:"1px solid rgba(255,255,255,0.15)"},
                              children:durBadge
                            }),
                            /* Bottom-left Step Count Badge */
                            (0,t.jsxs)("span",{
                              style:{position:"absolute",bottom:"0.55rem",left:"0.65rem",zIndex:2,padding:"0.14rem 0.48rem",borderRadius:5,background:"rgba(15,23,42,0.82)",color:"#cbd5e1",fontSize:"0.66rem",fontWeight:700,display:"inline-flex",alignItems:"center",gap:"0.25rem"},
                              children:[(0,t.jsx)("i",{className:"pi pi-list",style:{fontSize:"0.62rem",color:"#38bdf8"}}),stepBadge," Langkah"]
                            })
                          ]})
                        ]
                      }),
                      /* CARD METADATA & ACTIONS */
                      (0,t.jsxs)("div",{
                        style:{padding:"0.85rem 0.95rem",display:"flex",flexDirection:"column",gap:"0.55rem",flex:1},
                        children:[
                          (0,t.jsxs)("div",{style:{display:"flex",alignItems:"flex-start",gap:"0.65rem"},children:[
                            (0,t.jsx)("span",{style:{width:"2.15rem",height:"2.15rem",borderRadius:"50%",background:"rgba(220,38,38,0.12)",color:"#dc2626",display:"inline-flex",alignItems:"center",justifyContent:"center",flex:"0 0 auto",marginTop:"0.1rem"},children:(0,t.jsx)("i",{className:"pi pi-video",style:{fontSize:"0.92rem"}})}),
                            (0,t.jsxs)("div",{style:{minWidth:0,flex:1},children:[
                              (0,t.jsx)("div",{style:{fontWeight:800,fontSize:"0.9rem",color:"var(--cas-text-primary)",lineHeight:1.35,wordBreak:"break-word"},children:item.judul}),
                              (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.4rem",flexWrap:"wrap",marginTop:"0.25rem",fontSize:"0.7rem",color:"var(--cas-text-muted)"},children:[
                                (0,t.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.22rem",color:"#2563eb",fontWeight:700},children:[(0,t.jsx)("i",{className:"pi pi-verified",style:{fontSize:"0.66rem"}}),item.role_badge||"Semua Role RBAC"]}),
                                u(item.size)&&(0,t.jsxs)("span",{children:["- ",u(item.size)]})
                              ]})
                            ]})
                          ]}),
                          item.deskripsi&&(0,t.jsx)("div",{style:{fontSize:"0.76rem",color:"var(--cas-text-muted)",lineHeight:1.45,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"},children:item.deskripsi}),
                          (0,t.jsxs)("div",{
                            style:{marginTop:"auto",paddingTop:"0.55rem",borderTop:"1px solid var(--cas-border)",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.4rem",flexWrap:"wrap"},
                            children:[
                              (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.35rem"},children:[
                                (0,t.jsxs)("button",{
                                  type:"button",
                                  onClick:ev=>playVideoInlineInCard(item,ev),
                                  style:{display:"inline-flex",alignItems:"center",gap:"0.3rem",padding:"0.28rem 0.62rem",borderRadius:6,border:"1px solid #dc2626",background:isPlayingInline?"#dc2626":"rgba(220,38,38,0.1)",color:isPlayingInline?"#fff":"#dc2626",fontSize:"0.72rem",fontWeight:800,cursor:"pointer"},
                                  children:[(0,t.jsx)("i",{className:"pi pi-play",style:{fontSize:"0.68rem"}}),isPlayingInline?"Sedang Diputar":"Putar Langsung"]
                                }),
                                (0,t.jsxs)("button",{
                                  type:"button",
                                  onClick:()=>openInternalGuideDirect(item,!1),
                                  style:{display:"inline-flex",alignItems:"center",gap:"0.3rem",padding:"0.28rem 0.58rem",borderRadius:6,border:"1px solid var(--cas-border-strong)",background:"var(--cas-surface-subtle)",color:"var(--cas-text-primary)",fontSize:"0.71rem",fontWeight:700,cursor:"pointer"},
                                  children:[(0,t.jsx)("i",{className:"pi pi-window-maximize",style:{fontSize:"0.68rem"}}),"Layar Lebar"]
                                })
                              ]}),
                              (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.3rem"},children:[
                                (0,t.jsx)("button",{
                                  type:"button",
                                  onClick:ev=>copyEncryptedShareLink(item,ev),
                                  title:"Salin tautan berbagi",
                                  style:{padding:"0.28rem 0.5rem",borderRadius:6,border:"1px solid rgba(59,130,246,0.35)",background:"rgba(37,99,235,0.1)",color:"#2563eb",fontSize:"0.7rem",fontWeight:700,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"0.25rem"},
                                  children:[(0,t.jsx)("i",{className:"pi pi-share-alt",style:{fontSize:"0.68rem"}})]
                                }),
                                isSuperAdmin&&canMutatePanduan&&!String(item.id).startsWith("builtin-")&&(0,t.jsx)("button",{
                                  type:"button",
                                  onClick:ev=>{ev.stopPropagation();setFormData({id:item.id,judul:item.judul||"",deskripsi:item.deskripsi||"",kategori:item.kategori||"Umum",tipe:item.tipe||"VIDEO",urutan:item.urutan||0});setFormFile(null);setFormErr("");setFormOpen(!0)},
                                  title:"Ubah video",
                                  style:{padding:"0.28rem 0.5rem",borderRadius:6,border:"1px solid var(--cas-border-strong)",background:"var(--cas-surface-subtle)",color:"var(--cas-text-primary)",fontSize:"0.7rem",cursor:"pointer"},
                                  children:(0,t.jsx)("i",{className:"pi pi-pencil",style:{fontSize:"0.68rem"}})
                                })
                              ]})
                            ]
                          })
                        ]
                      })
                    ]
                  },item.id);
                })
              })
            ]
          }),

          /* 3. E-BOOK & WEBTOON CONTINUOUS VERTICAL DOCUMENT READER SECTION */
          ("ALL"===filterTipe||"PDF"===filterTipe)&&(0,t.jsxs)("section",{
            id:"cas-ebook-webtoon-stage",
            style:{display:"grid",gap:"0.95rem"},
            children:[
              (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.75rem",flexWrap:"wrap"},children:[
                (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.55rem"},children:[
                  (0,t.jsx)("span",{style:{width:"2.2rem",height:"2.2rem",borderRadius:9,background:"rgba(2,132,199,0.14)",color:"#0284c7",display:"inline-flex",alignItems:"center",justifyContent:"center"},children:(0,t.jsx)("i",{className:"pi pi-book",style:{fontSize:"1.1rem"}})}),
                  (0,t.jsxs)("div",{children:[
                    (0,t.jsx)("div",{style:{fontWeight:800,fontSize:"1rem",color:"var(--cas-text-primary)"},children:"E-Book & Modul Bacaan Interaktif (Mode Baca Kontinu ala E-Book / Webtoon)"}),
                    (0,t.jsx)("div",{style:{fontSize:"0.76rem",color:"var(--cas-text-muted)"},children:"Pilih modul di bawah untuk langsung membaca dari atas ke bawah secara mulus tanpa mengunduh berkas PDF."})
                  ]})
                ]}),
                (0,t.jsxs)("span",{style:{fontSize:"0.75rem",fontWeight:700,color:"var(--cas-text-muted)"},children:[pdfItems.length," Modul Bacaan Tersedia"]})
              ]}),

              /* E-BOOK MODULE CARDS SHELF */
              pdfItems.length>0&&(0,t.jsx)("div",{
                style:{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))",gap:"0.85rem"},
                children:pdfItems.map(doc=>{
                  let isSelected=currentEbook?.id===doc.id;
                  return(0,t.jsxs)("div",{
                    onClick:()=>openInternalGuideDirect(doc,!0),
                    className:"cms-card",
                    style:{borderRadius:12,padding:"0.85rem 1rem",cursor:"pointer",border:isSelected?"2px solid #0284c7":"1px solid var(--cas-border)",background:isSelected?"rgba(2,132,199,0.06)":"var(--cas-card-bg)",display:"flex",flexDirection:"column",gap:"0.55rem"},
                    children:[
                      (0,t.jsxs)("div",{style:{display:"flex",alignItems:"flex-start",gap:"0.6rem"},children:[
                        (0,t.jsx)("span",{style:{width:"2.4rem",height:"2.4rem",borderRadius:10,background:isSelected?"#0284c7":"rgba(2,132,199,0.12)",color:isSelected?"#fff":"#0284c7",display:"inline-flex",alignItems:"center",justifyContent:"center",flex:"0 0 auto"},children:(0,t.jsx)("i",{className:"pi pi-book",style:{fontSize:"1rem"}})}),
                        (0,t.jsxs)("div",{style:{minWidth:0,flex:1},children:[
                          (0,t.jsx)("div",{style:{fontWeight:800,fontSize:"0.86rem",color:"var(--cas-text-primary)",lineHeight:1.35},children:doc.judul}),
                          (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.35rem",flexWrap:"wrap",marginTop:"0.2rem",fontSize:"0.68rem",color:"var(--cas-text-muted)"},children:[
                            (0,t.jsx)("span",{style:{fontWeight:700,color:"#0284c7"},children:doc.kategori||"Modul E-Book"}),
                            u(doc.size)&&(0,t.jsxs)("span",{children:["- ",u(doc.size)]})
                          ]})
                        ]})
                      ]}),
                      doc.deskripsi&&(0,t.jsx)("div",{style:{fontSize:"0.75rem",color:"var(--cas-text-muted)",lineHeight:1.4,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"},children:doc.deskripsi}),
                      (0,t.jsxs)("div",{style:{marginTop:"auto",paddingTop:"0.45rem",borderTop:"1px solid var(--cas-border)",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.4rem"},children:[
                        (0,t.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.3rem",fontSize:"0.72rem",fontWeight:800,color:isSelected?"#0284c7":"#2563eb"},children:[
                          (0,t.jsx)("i",{className:isSelected?"pi pi-check-circle":"pi pi-book",style:{fontSize:"0.72rem"}}),
                          isSelected?"Sedang Dibaca di Bawah":"Baca di Reader Bawah"
                        ]}),
                        (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.25rem"},children:[
                          (0,t.jsx)("button",{
                            type:"button",
                            onClick:ev=>{ev.stopPropagation();openInternalGuideDirect(doc,!1)},
                            title:"Buka di Jendela Dialog Penuh",
                            style:{padding:"0.24rem 0.5rem",borderRadius:6,border:"1px solid var(--cas-border-strong)",background:"var(--cas-surface-subtle)",color:"var(--cas-text-primary)",fontSize:"0.68rem",fontWeight:700,cursor:"pointer"},
                            children:(0,t.jsx)("i",{className:"pi pi-window-maximize",style:{fontSize:"0.66rem"}})
                          }),
                          (0,t.jsx)("button",{
                            type:"button",
                            onClick:ev=>copyEncryptedShareLink(doc,ev),
                            title:"Salin tautan berbagi",
                            style:{padding:"0.24rem 0.5rem",borderRadius:6,border:"1px solid rgba(59,130,246,0.35)",background:"rgba(37,99,235,0.1)",color:"#2563eb",fontSize:"0.68rem",fontWeight:700,cursor:"pointer"},
                            children:(0,t.jsx)("i",{className:"pi pi-share-alt",style:{fontSize:"0.66rem"}})
                          })
                        ]})
                      ]})
                    ]
                  },doc.id);
                })
              }),

              /* INLINE CONTINUOUS E-BOOK / WEBTOON READER */
              currentEbook&&(0,t.jsx)(CasSecurePdfViewer,{
                src:currentEbook.stream_url||currentEbook.url||"/panduan/buku-panduan-cas-multirole.pdf",
                title:currentEbook.judul,
                fileName:currentEbook.file_name,
                watermarkText:internalWmText,
                maxHeight:"78vh"
              })
            ]
          })
        ]
      }),

      /* MODAL DIALOG VIEWER (WHEN EXPLICITLY OPENED IN DIALOG/LAYAR LEBAR) */
      (0,t.jsx)(a.Dialog,{
        header:f?.judul||"Panduan Operasional CAS",
        visible:!!f,
        onHide:()=>{k(!1),g(null)},
        maximizable:!0,
        maximized:w,
        onMaximize:ev=>k(ev.maximized),
        style:w?{position:"fixed",inset:0,top:0,left:0,width:"100vw",height:"100vh",maxWidth:"100vw",maxHeight:"100vh",margin:0,borderRadius:0}:{width:f?.tipe==="VIDEO"?"64rem":"70rem",maxWidth:"96vw"},
        modal:!0,
        children:f&&(0,t.jsxs)("div",{
          style:{display:"grid",gap:"0.85rem"},
          children:[
            (0,t.jsxs)("div",{
              style:{padding:"0.55rem 0.85rem",borderRadius:8,background:"rgba(16,185,129,0.12)",border:"1px solid rgba(16,185,129,0.35)",color:"#059669",fontSize:"0.78rem",fontWeight:700,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"0.5rem"},
              children:[
                (0,t.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.35rem"},children:[(0,t.jsx)("i",{className:"pi pi-shield"}),"Sesi Internal Terproteksi: ",internalWmText]}),
                (0,t.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.3rem",fontSize:"0.7rem",color:"#059669"},children:[(0,t.jsx)("i",{className:"pi pi-lock"}),"Watermark Anti-Leak Aktif"]})
              ]
            }),
            f.deskripsi&&(0,t.jsx)("p",{style:{margin:0,color:"var(--cas-text-secondary)",fontSize:"0.86rem"},children:f.deskripsi}),
            h||!(f.stream_url||f.url)?(0,t.jsx)("div",{style:{padding:"3rem 0",textAlign:"center",color:"var(--cas-text-muted)"},children:"Memuat berkas terenkripsi..."}):"VIDEO"===f.tipe?(0,t.jsx)(CasSecureVideoPlayer,{src:f.stream_url||f.url,title:f.judul,watermarkText:internalWmText,maxHeight:w?"calc(100vh - 12rem)":"68vh",autoPlay:!0}):(0,t.jsx)(CasSecurePdfViewer,{src:f.stream_url||f.url,title:f.judul,fileName:f.file_name,watermarkText:internalWmText,maxHeight:w?"calc(100vh - 12rem)":"72vh"})
          ]
        })
      }),

      /* UPLOAD / EDIT MODAL DIALOG */
      (0,t.jsx)(a.Dialog,{
        header:null!==formData.id?"Ubah Panduan Pengguna":"Unggah Panduan Pengguna Baru",
        visible:formOpen,
        onHide:()=>{if(!formSaving)setFormOpen(!1)},
        closable:!formSaving,
        modal:!0,
        style:{width:"36rem",maxWidth:"95vw"},
        children:(0,t.jsxs)("form",{
          onSubmit:handleSavePanduan,
          style:{display:"grid",gap:"0.8rem"},
          children:[
            formErr&&(0,t.jsx)("div",{style:{padding:"0.65rem 0.85rem",borderRadius:8,background:"rgba(239,68,68,0.14)",border:"1px solid #f87171",color:"#dc2626",fontSize:"0.78rem",fontWeight:700},children:formErr}),
            (0,t.jsxs)("div",{children:[
              (0,t.jsx)("label",{style:{display:"block",fontSize:"0.78rem",fontWeight:700,color:"var(--cas-text-secondary)",marginBottom:"0.25rem"},children:"Judul Panduan *"}),
              (0,t.jsx)("input",{type:"text",required:!0,disabled:formSaving,value:formData.judul,onChange:ev=>setFormData(s=>({...s,judul:ev.target.value})),placeholder:"Contoh: Panduan Operasional Modul DORS & Laporan Polisi",style:{width:"100%",height:"38px",padding:"0 0.75rem",borderRadius:8,border:"1px solid var(--cas-border-strong)",background:"var(--cas-card-bg)",color:"var(--cas-text-primary)",fontSize:"0.84rem",boxSizing:"border-box"}})
            ]}),
            (0,t.jsxs)("div",{children:[
              (0,t.jsx)("label",{style:{display:"block",fontSize:"0.78rem",fontWeight:700,color:"var(--cas-text-secondary)",marginBottom:"0.25rem"},children:"Deskripsi Singkat"}),
              (0,t.jsx)("textarea",{rows:2,disabled:formSaving,value:formData.deskripsi,onChange:ev=>setFormData(s=>({...s,deskripsi:ev.target.value})),placeholder:"Penjelasan singkat isi materi panduan...",style:{width:"100%",padding:"0.55rem 0.75rem",borderRadius:8,border:"1px solid var(--cas-border-strong)",background:"var(--cas-card-bg)",color:"var(--cas-text-primary)",fontSize:"0.82rem",boxSizing:"border-box"}})
            ]}),
            (0,t.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(min(100%, 13rem), 1fr))",gap:"0.65rem"},children:[
              (0,t.jsxs)("div",{children:[
                (0,t.jsx)("label",{style:{display:"block",fontSize:"0.78rem",fontWeight:700,color:"var(--cas-text-secondary)",marginBottom:"0.25rem"},children:"Kategori"}),
                (0,t.jsx)("input",{type:"text",disabled:formSaving,value:formData.kategori,onChange:ev=>setFormData(s=>({...s,kategori:ev.target.value})),placeholder:"Umum / Penyidikan / Admin",style:{width:"100%",height:"38px",padding:"0 0.75rem",borderRadius:8,border:"1px solid var(--cas-border-strong)",background:"var(--cas-card-bg)",color:"var(--cas-text-primary)",fontSize:"0.84rem",boxSizing:"border-box"}})
              ]}),
              (0,t.jsxs)("div",{children:[
                (0,t.jsx)("label",{style:{display:"block",fontSize:"0.78rem",fontWeight:700,color:"var(--cas-text-secondary)",marginBottom:"0.25rem"},children:"Urutan Tampil"}),
                (0,t.jsx)("input",{type:"number",disabled:formSaving,value:formData.urutan,onChange:ev=>setFormData(s=>({...s,urutan:Number(ev.target.value)||0})),style:{width:"100%",height:"38px",padding:"0 0.75rem",borderRadius:8,border:"1px solid var(--cas-border-strong)",background:"var(--cas-card-bg)",color:"var(--cas-text-primary)",fontSize:"0.84rem",boxSizing:"border-box"}})
              ]})
            ]}),
            (0,t.jsxs)("div",{children:[
              (0,t.jsx)("label",{style:{display:"block",fontSize:"0.78rem",fontWeight:700,color:"var(--cas-text-secondary)",marginBottom:"0.25rem"},children:"Tipe Berkas *"}),
              (0,t.jsxs)("select",{disabled:null!==formData.id||formSaving,value:formData.tipe,onChange:ev=>setFormData(s=>({...s,tipe:ev.target.value})),style:{width:"100%",height:"38px",padding:"0 0.75rem",borderRadius:8,border:"1px solid var(--cas-border-strong)",fontSize:"0.84rem",background:null!==formData.id?"var(--cas-surface-subtle)":"var(--cas-card-bg)",color:"var(--cas-text-primary)"},children:[
                (0,t.jsx)("option",{value:"PDF",children:"Dokumen E-Book Panduan (PDF)"}),
                (0,t.jsx)("option",{value:"VIDEO",children:"Video Tutorial (MP4/WebM)"})
              ]})
            ]}),
            (0,t.jsxs)("div",{children:[
              (0,t.jsx)("label",{style:{display:"block",fontSize:"0.78rem",fontWeight:700,color:"var(--cas-text-secondary)",marginBottom:"0.25rem"},children:null!==formData.id?"Ganti Berkas (Opsional — Maks 1 GB)":"Pilih Berkas Panduan (Maks 1 GB) *"}),
              (0,t.jsx)("input",{type:"file",disabled:formSaving,accept:"VIDEO"===formData.tipe?"video/*":"application/pdf",onChange:ev=>{let fObj=ev.target.files?.[0]||null;setFormFile(fObj);if(fObj){setTotalBytes(fObj.size||0),setUploadedBytes(0),setUploadProgress(0)}},style:{width:"100%",fontSize:"0.8rem"}}),
              formFile&&!formSaving&&(0,t.jsxs)("div",{style:{marginTop:"0.38rem",padding:"0.42rem 0.68rem",borderRadius:8,background:"rgba(37,99,235,0.08)",border:"1px solid rgba(59,130,246,0.28)",fontSize:"0.75rem",color:"var(--cas-text-secondary)",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.5rem",flexWrap:"wrap"},children:[
                (0,t.jsxs)("span",{style:{fontWeight:700,color:"var(--cas-text-primary)",wordBreak:"break-all",display:"inline-flex",alignItems:"center",gap:"0.35rem"},children:[(0,t.jsx)("i",{className:"pi pi-paperclip"}),formFile.name]}),
                (0,t.jsx)("span",{style:{fontWeight:800,color:"#2563eb",fontFamily:"monospace"},children:fmtMbId(formFile.size)})
              ]})
            ]}),
            formSaving&&formFile&&(0,t.jsxs)("div",{style:{padding:"0.85rem 1rem",borderRadius:12,background:"rgba(37,99,235,0.06)",border:"1px solid rgba(37,99,235,0.35)",display:"grid",gap:"0.55rem"},children:[
              (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.5rem"},children:[
                (0,t.jsxs)("span",{style:{fontSize:"0.8rem",fontWeight:800,color:"#1d4ed8",display:"inline-flex",alignItems:"center",gap:"0.35rem"},children:[(0,t.jsx)("i",{className:"pi pi-spin pi-spinner"}),uploadProgress<100?"Mengunggah berkas ke server CAS...":"Menyimpan ke storage MinIO..."]}),
                (0,t.jsxs)("span",{style:{fontFamily:"monospace",fontSize:"0.78rem",fontWeight:800,color:"#1d4ed8"},children:[uploadProgress,"%"]})
              ]}),
              (0,t.jsx)("div",{style:{width:"100%",height:"10px",borderRadius:999,background:"#e2e8f0",overflow:"hidden"},children:(0,t.jsx)("div",{style:{width:`${Math.max(4,uploadProgress)}%`,height:"100%",background:"#2563eb"}})}),
              (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",fontSize:"0.74rem",fontFamily:"monospace"},children:[
                (0,t.jsxs)("span",{children:[fmtMbId(uploadedBytes)," / ",fmtMbId(totalBytes||formFile.size)]}),
                (0,t.jsxs)("span",{children:[fmtSpeedId(uploadSpeedBps)," - ",fmtEtaId(uploadEtaSec)]})
              ]})
            ]}),
            (0,t.jsxs)("div",{style:{display:"flex",justifyContent:"flex-end",gap:"0.5rem",marginTop:"0.4rem"},children:[
              (0,t.jsx)("button",{type:"button",disabled:formSaving,onClick:()=>setFormOpen(!1),style:{padding:"0.5rem 0.9rem",borderRadius:8,border:"1px solid var(--cas-border-strong)",background:"var(--cas-card-bg)",color:"var(--cas-text-secondary)",fontWeight:700,fontSize:"0.8rem",cursor:formSaving?"not-allowed":"pointer"},children:"Batal"}),
              (0,t.jsxs)("button",{type:"submit",disabled:formSaving,style:{display:"inline-flex",alignItems:"center",gap:"0.4rem",padding:"0.5rem 1.1rem",borderRadius:8,border:"none",background:"#1d4ed8",color:"#fff",fontWeight:700,fontSize:"0.8rem",cursor:formSaving?"wait":"pointer"},children:[
                (0,t.jsx)("i",{className:formSaving?"pi pi-spin pi-spinner":"pi pi-save"}),
                formSaving?formFile?`Mengunggah (${uploadProgress}%)...`:"Menyimpan...":"Simpan Panduan"
              ]})
            ]})
          ]
        })
      })
    ]
  });
}])}]);
