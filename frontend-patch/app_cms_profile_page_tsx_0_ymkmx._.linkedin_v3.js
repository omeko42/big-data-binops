module.exports=[20291,a=>{"use strict";var b=a.i(87924),c=a.i(72131),d=a.i(61803),e=a.i(12834),f=a.i(24701),g=a.i(42047),h=a.i(94964),i=a.i(65951),j=a.i(51133),k=a.i(53250),l=a.i(43357),m=a.i(23177),n=a.i(86726),o=a.i(66491),p=a.i(64831);let q=(0,p.default)("id-card",[["path",{d:"M16 10h2",key:"8sgtl7"}],["path",{d:"M16 14h2",key:"epxaof"}],["path",{d:"M6.17 15a3 3 0 0 1 5.66 0",key:"n6f512"}],["circle",{cx:"9",cy:"11",r:"2",key:"yxgjnd"}],["rect",{x:"2",y:"5",width:"20",height:"14",rx:"2",key:"qneu4z"}]]),r=(0,p.default)("award",[["path",{d:"m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526",key:"1yiouv"}],["circle",{cx:"12",cy:"8",r:"6",key:"1vp47v"}]]);var s=a.i(16131),t=a.i(27377),u=a.i(62591);let v=(0,p.default)("log-in",[["path",{d:"m10 17 5-5-5-5",key:"1bsop3"}],["path",{d:"M15 12H3",key:"6jk70r"}],["path",{d:"M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4",key:"u53s6r"}]]);var w=a.i(54098),x=a.i(26766),y=a.i(37149),z=a.i(36273),A=a.i(2657),B=a.i(89778);let C=(0,p.default)("lock-open",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 9.9-1",key:"1mm8w8"}]]),D=(0,p.default)("badge-check",[["path",{d:"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",key:"3c2336"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);var E=a.i(90629),F=a.i(55681),G=a.i(77064),H=a.i(85888);let I=(0,p.default)("globe",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",key:"13o1zl"}],["path",{d:"M2 12h20",key:"9i4pu4"}]]),J=(0,p.default)("compass",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z",key:"9ktpf1"}]]);var K=a.i(52397);let L={superadmin:"#dc2626",admin_binops:"#b45309",operator:"#1d4ed8",viewer:"#0f766e"},M={superadmin:"Superadmin",admin_binops:"Admin/Binops",operator:"Operator",viewer:"Viewer"};function N(a){let b=(a||"").trim();return b&&"-"!==b?b:void 0}let O={name:"",nrp:"",pangkat:"",jabatan:"",satuan:"",no_hp:"",email_polri:"",username:""},P={alamat:"",provinsi:"",kabupaten_kota:"",kecamatan:"",desa:"",kode_pos:"",longitude:"",latitude:"",jumlah_penduduk:""},Q=["operator","admin_binops"];function R({label:a,required:c,hint:d,children:e}){return(0,b.jsxs)("div",{children:[(0,b.jsxs)("label",{style:{display:"block",marginBottom:"0.25rem",fontSize:"0.8rem",fontWeight:700,color:"#334155"},children:[a," ",c&&(0,b.jsx)("span",{style:{color:"#dc2626"},children:"*"})," ",d&&(0,b.jsxs)("span",{style:{color:"#94a3b8",fontWeight:400},children:["(",d,")"]})]}),e]})}function S({icon:a,label:c,value:d,last:e}){return(0,b.jsxs)("div",{className:"profile-row",style:{borderBottom:e?"none":void 0},children:[(0,b.jsx)("span",{className:"profile-row-icon",children:a}),(0,b.jsxs)("div",{style:{minWidth:0,flex:1},children:[(0,b.jsx)("div",{className:"profile-row-label",children:c}),(0,b.jsx)("div",{className:`profile-row-value${d?"":" is-empty"}`,children:d||"Belum diisi"})]})]})}function T({icon:a,label:c,active:e,last:f,hint:g,action:h}){return(0,b.jsxs)("div",{className:"profile-row",style:{borderBottom:f?"none":void 0},children:[(0,b.jsx)("span",{className:`profile-row-icon${e?" is-active":""}`,children:a}),(0,b.jsxs)("span",{className:"profile-row-value",style:{flex:1},children:[c,g&&(0,b.jsxs)("span",{style:{marginLeft:"0.5rem",fontSize:"0.7rem",fontWeight:600,color:"#94a3b8"},children:["(",g,")"]})]}),(0,b.jsx)(d.Tag,{value:e?"Aktif":"Nonaktif",severity:e?"success":"danger",icon:e?(0,b.jsx)(C,{size:11,style:{marginRight:4}}):(0,b.jsx)(B.Lock,{size:11,style:{marginRight:4}})}),h]})}a.s(["default",0,function(){let a=(0,c.useRef)(null),[d,p]=(0,c.useState)(null),[B,C]=(0,c.useState)(!0),[U,V]=(0,c.useState)(!1),[W,X]=(0,c.useState)(O),[Y,Z]=(0,c.useState)(!1),$=(0,n.useAvailabilityCheck)(d?.id),[_,aa]=(0,c.useState)(!1),[ab,ac]=(0,c.useState)("enable_pin"),[ad,ae]=(0,c.useState)(""),[af,ag]=(0,c.useState)(""),[ah,ai]=(0,c.useState)(""),[aj,ak]=(0,c.useState)(""),[al,am]=(0,c.useState)(!1),[an,ao]=(0,c.useState)(!1),[ap,aq]=(0,c.useState)(!1),[ar,as]=(0,c.useState)(""),[at,au]=(0,c.useState)(null),[av,aw]=(0,c.useState)(!1),[ax,ay]=(0,c.useState)(""),[az,aA]=(0,c.useState)(!1),[aB,aC]=(0,c.useState)(P),[aD,aE]=(0,c.useState)(!1);async function aF(){let a=await k.apiAuth.get("/Authentication/user");return p(a.data?.data||null),a.data?.data}async function aG(){aw(!0),ay("");try{let a=(0,k.assertOk)(await k.apiAuth.get("/bdb/satker/me/profile"));au(a)}catch(a){ay(a.response?.data?.message||"Gagal memuat data wilayah satker.")}finally{aw(!1)}}async function aH(){if(aB.jumlah_penduduk.trim()&&!/^\d+$/.test(aB.jumlah_penduduk.trim()))return void a.current?.show({severity:"warn",summary:"Periksa lagi",detail:"Jumlah penduduk harus berupa angka bulat."});if(aB.longitude.trim()){let b=Number(aB.longitude);if(!Number.isFinite(b)||b<-180||b>180)return void a.current?.show({severity:"warn",summary:"Periksa lagi",detail:"Longitude harus angka antara -180 s/d 180."})}if(aB.latitude.trim()){let b=Number(aB.latitude);if(!Number.isFinite(b)||b<-90||b>90)return void a.current?.show({severity:"warn",summary:"Periksa lagi",detail:"Latitude harus angka antara -90 s/d 90."})}if(await (0,l.confirmAction)("Simpan perubahan data wilayah satker?")){aE(!0);try{(0,k.assertOk)(await k.apiAuth.patch("/bdb/satker/me/profile",aB)),a.current?.show({severity:"success",summary:"Tersimpan",detail:"Data wilayah satker diperbarui."}),aA(!1),await aG()}catch(b){a.current?.show({severity:"error",summary:"Gagal",detail:b.response?.data?.message||"Gagal menyimpan data wilayah satker.",life:8e3})}finally{aE(!1)}}}async function aI(){if(!W.name.trim())return void a.current?.show({severity:"warn",summary:"Lengkapi",detail:"Nama wajib diisi."});if($.hasBlockingIssue)return void a.current?.show({severity:"warn",summary:"Periksa lagi",detail:"Email dinas Polri atau username sudah dipakai akun lain. Perbaiki dulu sebelum menyimpan."});if(await (0,l.confirmAction)("Simpan perubahan profil?")){Z(!0);try{(0,k.assertOk)(await k.apiAuth.patch("/user/me/profile",W)),a.current?.show({severity:"success",summary:"Tersimpan",detail:"Profil berhasil diperbarui."}),V(!1),await aF()}catch(d){let b=d.response?.data?.errors,c=b?Object.values(b).flat().join(", "):d.response?.data?.message||"Gagal menyimpan profil.";a.current?.show({severity:"error",summary:"Gagal",detail:c,life:8e3})}finally{Z(!1)}}}async function aJ(b){let c="disable_pin"===b?"Nonaktifkan PIN keamanan? Kode verifikasi akan dikirim ke email Anda.":"change_pin"===b?"Ubah PIN keamanan? Kode verifikasi akan dikirim ke email Anda.":"Aktifkan PIN keamanan? Kode verifikasi akan dikirim ke email Anda.";if(await (0,l.confirmAction)(c)){aq(!0);try{let a=await k.apiAuth.post("/Authentication/profile/security/otp",{action:b});(0,k.assertOk)(a),ae(a.data?.data?.otp_id||""),ac(b),ag(""),ai(""),ak(""),as(""),aa(!0)}catch(b){a.current?.show({severity:"error",summary:"Gagal",detail:b.response?.data?.message||"Gagal mengirim kode verifikasi."})}finally{aq(!1)}}}async function aK(){if(af.length<6)return void as("Masukkan 6 digit kode dari email.");let b="disable_pin"!==ab;if(b){if(!/^\d{6,8}$/.test(ah))return void as("PIN wajib 6-8 digit angka.");if(ah!==aj)return void as("Konfirmasi PIN belum sama.")}ao(!0),as("");try{let c={enabled:b,action:ab,otp_id:ad,otp_token:af};b&&(c.pin=ah,c.pin_confirmation=aj),(0,k.assertOk)(await k.apiAuth.patch("/Authentication/profile/security/pin",c)),a.current?.show({severity:"success",summary:"Tersimpan",detail:`PIN keamanan berhasil ${"disable_pin"===ab?"dinonaktifkan":"change_pin"===ab?"diubah":"diaktifkan"}.`}),aa(!1),await aF()}catch(b){let a=b.response?.data?.errors;as(a&&Object.values(a)[0]?.[0]||b.response?.data?.message||"Kode salah atau kedaluwarsa.")}finally{ao(!1)}}if((0,c.useEffect)(()=>{(async()=>{try{let a=await aF(),b=String(a?.role_bdb||"").toLowerCase();Q.includes(b)&&await aG()}finally{C(!1)}})()},[]),B)return(0,b.jsxs)("div",{children:[(0,b.jsx)("h1",{className:"cms-page-title",children:"Profil Saya"}),(0,b.jsx)("p",{className:"cms-page-sub",children:"Memuat profil…"}),(0,b.jsx)("div",{className:"cms-card",style:{height:"9rem"}})]});if(!d)return(0,b.jsx)("p",{className:"cms-page-sub",children:"Profil tidak tersedia."});let aL=String(d.name||d.email||"?").charAt(0).toUpperCase(),aM=String(d.role_bdb||"viewer").toLowerCase(),aN=L[aM]||"#64748b",aO="AKTIF"===String(d.status||"").toUpperCase(),aP=[d.local_password_enabled,d.email_otp_required,d.pin_required].filter(Boolean).length;return(0,b.jsxs)("div",{children:[(0,b.jsx)(i.Toast,{ref:a}),(0,b.jsx)(j.ConfirmDialog,{}),(0,b.jsxs)("div",{children:[(0,b.jsx)("h1",{className:"cms-page-title",children:"Profil Saya"}),(0,b.jsx)("p",{className:"cms-page-sub",children:"Informasi akun, data personil, dan keamanan."})]}),
// HERO CARD (Pure LinkedIn Replica for SSR)
(0,b.jsxs)("div",{className:"cms-card",style:{padding:0,overflow:"hidden",marginBottom:"1.25rem",borderRadius:"16px",border:"1px solid var(--cas-border, rgba(255,255,255,0.1))",background:"var(--cas-bg-surface, #1e293b)",boxShadow:"0 8px 30px rgba(0,0,0,0.25)"},children:[
  // 1. Cover Banner
  (0,b.jsxs)("div",{style:{position:"relative",height:"200px",background:"linear-gradient(135deg, #090d16 0%, #0f172a 45%, #1e293b 85%, #0369a1 100%)",overflow:"hidden",display:"flex",alignItems:"flex-end",justifyContent:"space-between",padding:"1rem 1.5rem"},children:[
    (0,b.jsx)("div",{style:{position:"absolute",inset:0,opacity:0.25,backgroundImage:"radial-gradient(rgba(56,189,248,0.5) 1px, transparent 1px)",backgroundSize:"22px 22px",pointerEvents:"none"}}),
    (0,b.jsxs)("div",{style:{position:"absolute",top:"1.25rem",left:"1.75rem",pointerEvents:"none",opacity:0.6},children:[
      (0,b.jsx)("div",{style:{fontSize:"1.15rem",fontWeight:900,color:"#38bdf8",letterSpacing:"0.15em",textTransform:"uppercase",fontFamily:"monospace"},children:"READY TO WORK"}),
      (0,b.jsx)("div",{style:{fontSize:"0.72rem",fontWeight:600,color:"#94a3b8",letterSpacing:"0.08em",fontFamily:"monospace"},children:"KEPOLISIAN NEGARA REPUBLIK INDONESIA • BARESKRIM POLRI"})
    ]}),
    (0,b.jsx)("button",{
      type:"button",
      "aria-label":"Edit gambar latar belakang",
      style:{position:"absolute",top:"14px",right:"16px",background:"rgba(15,23,42,0.75)",backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,0.25)",borderRadius:"50%",width:"36px",height:"36px",display:"inline-flex",alignItems:"center",justifyContent:"center",color:"var(--text-color, #0f172a)",fontSize:"1rem",cursor:"pointer"},
      children:"✏️"
    })
  ]}),

  // 2. Hero Body
  (0,b.jsxs)("div",{style:{padding:"0 1.75rem 1.5rem 1.75rem"},children:[
    (0,b.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:"1rem"},children:[
      // Avatar
      (0,b.jsxs)("div",{style:{position:"relative",marginTop:"-70px",width:"135px",height:"135px",flex:"0 0 135px"},children:[
        (0,b.jsx)("div",{style:{width:"100%",height:"100%",borderRadius:"50%",background:"var(--cas-bg-surface, #0f172a)",border:"4px solid var(--cas-card-bg, #1e293b)",boxShadow:"0 8px 24px rgba(0,0,0,0.45)",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"3rem",fontWeight:800,color:"var(--text-color, #0f172a)"},children:
          (d?.photo_url||d?.foto)?(0,b.jsx)("img",{src:d.photo_url||d.foto,alt:d?.name||"Foto Profil",style:{width:"100%",height:"100%",objectFit:"cover"}}):aL
        }),
        (0,b.jsx)("button",{
          type:"button",
          "aria-label":"Edit foto profil",
          style:{position:"absolute",bottom:"4px",right:"4px",width:"34px",height:"34px",borderRadius:"50%",background:"#2563eb",border:"2px solid #fff",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--text-color, #0f172a)",fontSize:"0.95rem",boxShadow:"0 2px 6px rgba(0,0,0,0.35)",cursor:"pointer"},
          children:"✏️"
        })
      ]}),

      // Institutions & Edit button
      (0,b.jsxs)("div",{style:{display:"flex",alignItems:"flex-start",gap:"1.25rem",marginTop:"0.75rem"},children:[
        (0,b.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.6rem",maxWidth:"340px"},children:[
          (0,b.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.65rem"},children:[
            (0,b.jsx)("div",{style:{width:"34px",height:"34px",borderRadius:"8px",background:"rgba(56,189,248,0.12)",border:"1px solid rgba(56,189,248,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem",flexShrink:0},children:"🏢"}),
            (0,b.jsxs)("div",{children:[
              (0,b.jsx)("div",{style:{fontWeight:800,fontSize:"0.84rem",color:"var(--text-color, #0f172a)",lineHeight:1.2},children:d?.satker || d?.satuan || "Kepolisian Negara Republik Indonesia"}),
              (0,b.jsx)("div",{style:{fontSize:"0.72rem",color:"#94a3b8"},children:d?.jabatan || "Bareskrim Polri"})
            ]})
          ]}),
          (d?.social_media?.education && d.social_media.education.length > 0) ? (0,b.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.65rem"},children:[
            (0,b.jsx)("div",{style:{width:"34px",height:"34px",borderRadius:"8px",background:"rgba(168,85,247,0.12)",border:"1px solid rgba(168,85,247,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem",flexShrink:0},children:"🎓"}),
            (0,b.jsxs)("div",{children:[
              (0,b.jsx)("div",{style:{fontWeight:800,fontSize:"0.84rem",color:"var(--text-color, #0f172a)",lineHeight:1.2},children:d.social_media.education[0].school}),
              (0,b.jsx)("div",{style:{fontSize:"0.72rem",color:"#94a3b8"},children:d.social_media.education[0].degree || d.social_media.education[0].field || "Pendidikan Formal"})
            ]})
          ]}) : null
        ]}),

        (0,b.jsx)("button",{
          type:"button",
          "aria-label":"Edit profil",
          style:{background:"transparent",border:"none",fontSize:"1.25rem",cursor:"pointer",padding:"0.35rem",color:"#94a3b8"},
          children:"✏️"
        })
      ]})
    ]}),

    // Identity, Headline, Location & Action Bar
    (0,b.jsxs)("div",{style:{marginTop:"0.85rem"},children:[
      (0,b.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.65rem",flexWrap:"wrap"},children:[
        (0,b.jsx)("span",{style:{fontSize:"1.55rem",fontWeight:800,color:"var(--text-color, #0f172a)",lineHeight:1.2},children:(d?.callsign||d?.username||d?.name||"omeko11")}),
        (0,b.jsxs)("svg",{viewBox:"0 0 24 24",width:20,height:20,style:{verticalAlign:"middle",flexShrink:0},children:[
          (0,b.jsx)("circle",{cx:12,cy:12,r:11,fill:"#0284c7"}),
          (0,b.jsx)("path",{d:"m7.5 12 3 3 6-6",stroke:"#ffffff",strokeWidth:2.6,strokeLinecap:"round",strokeLinejoin:"round",fill:"none"})
        ]}),
        (0,b.jsxs)("span",{style:{fontSize:"0.76rem",fontWeight:700,padding:"0.2rem 0.65rem",borderRadius:"999px",background:"rgba(34,197,94,0.15)",color:"#4ade80",border:"1px solid rgba(34,197,94,0.35)",display:"inline-flex",alignItems:"center",gap:"0.35rem"},children:[
          "● Online"
        ]})
      ]}),

      (0,b.jsx)("div",{style:{fontSize:"0.95rem",color:"var(--text-color, #1e293b)",marginTop:"0.35rem",fontWeight:500,lineHeight:1.4},children:
        (d?.social_media?.headline || d?.jabatan || "Personil Polri • Mabes Bareskrim")
      }),

      (0,b.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.55rem",flexWrap:"wrap",marginTop:"0.45rem",fontSize:"0.82rem",color:"var(--text-color-secondary, #64748b)"},children:[
        (0,b.jsx)("span",{children:(d?.scope_satker_name || d?.satker || d?.satuan || "Mabes Bareskrim Polri")}),
        (0,b.jsx)("span",{style:{color:"#64748b"},children:"•"}),
        (0,b.jsx)("span",{style:{color:"#0284c7",fontWeight:700,cursor:"pointer",textDecoration:"underline"},children:"Info Kontak"}),
        (0,b.jsx)("span",{style:{color:"#64748b"},children:"•"}),
        (0,b.jsx)("span",{style:{fontWeight:700,color:"#0284c7",cursor:"pointer",textDecoration:"underline"},children:"👮 Jaringan Personil CAS"})
      ]}),

      (0,b.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.65rem",flexWrap:"wrap",marginTop:"1.1rem"},children:[
        (0,b.jsx)("button",{type:"button",style:{background:"#2563eb",color:"var(--text-color, #0f172a)",border:"none",borderRadius:"999px",padding:"0.45rem 1.15rem",fontSize:"0.84rem",fontWeight:700,cursor:"pointer"},children:"✏️ Edit Biodata"}),
        (0,b.jsx)("button",{type:"button",style:{background:"transparent",color:"#0284c7",border:"1px solid #0284c7",borderRadius:"999px",padding:"0.45rem 1.15rem",fontSize:"0.84rem",fontWeight:700,cursor:"pointer"},children:"🔐 Keamanan Akun"}),
        (0,b.jsxs)("button",{type:"button",style:{background:"var(--surface-50, rgba(0,0,0,0.04))",color:"var(--text-color, #1e293b)",border:"1px solid var(--surface-border, #cbd5e1)",borderRadius:"999px",padding:"0.45rem 1.1rem",fontSize:"0.84rem",fontWeight:700,cursor:"pointer"},children:[
          "👮 Direktori Personil"
        ]})
      ]})
    ]})
  ]})
]}),

// 2-Column Grid
(0,b.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"minmax(0, 1fr) 330px",gap:"1.25rem",alignItems:"start"},children:[
  // Left Column
  (0,b.jsxs)("div",{style:{display:"grid",gap:"1.25rem"},children:[
    // Tentang
    (0,b.jsxs)("div",{className:"cms-card",style:{padding:"1.25rem",borderRadius:"14px",border:"1px solid var(--cas-border, rgba(255,255,255,0.1))"},children:[
      (0,b.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.75rem"},children:[
        (0,b.jsx)("h3",{style:{margin:0,fontSize:"1.1rem",fontWeight:800,color:"var(--text-color, #0f172a)"},children:"Tentang"}),
        (0,b.jsx)("button",{type:"button","aria-label":"Edit ringkasan tentang",style:{background:"transparent",border:"none",fontSize:"1.15rem",color:"#94a3b8"},children:"✏️"})
      ]}),
      d?.social_media?.bio ? (0,b.jsx)("div",{style:{fontSize:"0.88rem",lineHeight:1.6,color:"var(--cas-text-primary, #cbd5e1)",whiteSpace:"pre-wrap"},children:d.social_media.bio}) : (0,b.jsx)("div",{style:{color:"#94a3b8",fontSize:"0.85rem"},children:"Belum ada ringkasan Tentang Saya yang ditambahkan."})
    ]}),

    // Aktivitas
    (0,b.jsxs)("div",{className:"cms-card",style:{padding:"1.25rem",borderRadius:"14px",border:"1px solid var(--cas-border, rgba(255,255,255,0.1))"},children:[
      (0,b.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1rem"},children:[
        (0,b.jsxs)("div",{children:[
          (0,b.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.45rem"},children:[
            (0,b.jsx)("span",{style:{fontSize:"1.25rem"},children:"📝"}),
            (0,b.jsx)("h3",{style:{margin:0,fontSize:"1.1rem",fontWeight:800,color:"var(--text-color, #0f172a)"},children:"Aktivitas"})
          ]}),
          (0,b.jsx)("p",{style:{margin:"0.15rem 0 0",fontSize:"0.78rem",color:"#94a3b8"},children:"Postingan dan catatan kedinasan"})
        ]}),
        (0,b.jsxs)("div",{style:{display:"inline-flex",gap:"0.25rem"},children:[
          (0,b.jsx)("button",{type:"button",style:{background:"#2563eb",color:"var(--text-color, #0f172a)",border:"none",borderRadius:"6px",padding:"0.35rem 0.75rem",fontSize:"0.76rem",fontWeight:700},children:"Postingan Saya"})
        ]})
      ]}),
      (0,b.jsxs)("div",{style:{textAlign:"center",padding:"1.5rem",color:"#94a3b8",fontSize:"0.85rem"},children:[
        (0,b.jsx)("div",{style:{fontSize:"2rem",marginBottom:"0.3rem"},children:"📭"}),
        (0,b.jsx)("div",{children:"Memuat linimasa aktivitas..."})
      ]})
    ]}),

    // Pengalaman (Clean SSR - No fake Bareskrim/CAS dummy)
    (0,b.jsxs)("div",{className:"cms-card",style:{padding:"1.25rem",borderRadius:"14px",border:"1px solid var(--cas-border, rgba(255,255,255,0.1))"},children:[
      (0,b.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1rem"},children:[
        (0,b.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[
          (0,b.jsx)("span",{style:{fontSize:"1.25rem"},children:"💼"}),
          (0,b.jsx)("h3",{style:{margin:0,fontSize:"1.1rem",fontWeight:800,color:"var(--text-color, #0f172a)"},children:"Pengalaman"})
        ]}),
        (0,b.jsxs)("div",{style:{display:"flex",gap:"0.5rem"},children:[
          (0,b.jsx)("button",{type:"button","aria-label":"Tambahkan pengalaman",style:{background:"transparent",border:"none",fontSize:"1.15rem",color:"#94a3b8"},children:"➕"}),
          (0,b.jsx)("button",{type:"button","aria-label":"Edit pengalaman",style:{background:"transparent",border:"none",fontSize:"1.15rem",color:"#94a3b8"},children:"✏️"})
        ]})
      ]}),
      (d?.social_media?.experiences && Array.isArray(d.social_media.experiences) && d.social_media.experiences.length > 0) ? (
        d.social_media.experiences.map((exp, idx) => (
          (0,b.jsxs)("div",{key:idx,style:{display:"flex",gap:"0.85rem",paddingTop:idx>0?"1rem":0},children:[
            (0,b.jsx)("div",{style:{width:"44px",height:"44px",borderRadius:"8px",background:"rgba(56,189,248,0.12)",border:"1px solid rgba(56,189,248,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.3rem",flexShrink:0},children:"🏢"}),
            (0,b.jsxs)("div",{children:[
              (0,b.jsx)("div",{style:{fontWeight:800,fontSize:"0.92rem",color:"var(--text-color, #0f172a)"},children:exp.title || "Posisi Kedinasan"}),
              (0,b.jsx)("div",{style:{fontSize:"0.8rem",color:"#38bdf8",fontWeight:600},children:exp.company || "Satker"}),
              (0,b.jsx)("div",{style:{fontSize:"0.74rem",color:"#94a3b8",marginTop:"0.15rem"},children:exp.period || ""})
            ]})
          ]})
        ))
      ) : (
        (0,b.jsxs)("div",{style:{padding:"1.25rem 0.5rem",textAlign:"center",color:"#94a3b8",fontSize:"0.84rem"},children:[
          (0,b.jsx)("div",{style:{fontSize:"1.6rem",marginBottom:"0.35rem"},children:"💼"}),
          (0,b.jsx)("div",{style:{fontWeight:600,color:"#cbd5e1"},children:"Belum ada riwayat pengalaman kerja yang ditambahkan."}),
          (0,b.jsx)("div",{style:{fontSize:"0.75rem",marginTop:"0.2rem",color:"#64748b"},children:"Tambahkan rekam jejak kedinasan atau penugasan Anda untuk melengkapi profil."})
        ]})
      )
    ]}),

    // Pendidikan (Clean SSR - No fake Nusa Mandiri dummy)
    (0,b.jsxs)("div",{className:"cms-card",style:{padding:"1.25rem",borderRadius:"14px",border:"1px solid var(--cas-border, rgba(255,255,255,0.1))"},children:[
      (0,b.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1rem"},children:[
        (0,b.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[
          (0,b.jsx)("span",{style:{fontSize:"1.25rem"},children:"🎓"}),
          (0,b.jsx)("h3",{style:{margin:0,fontSize:"1.1rem",fontWeight:800,color:"var(--text-color, #0f172a)"},children:"Pendidikan"})
        ]}),
        (0,b.jsxs)("div",{style:{display:"flex",gap:"0.5rem"},children:[
          (0,b.jsx)("button",{type:"button","aria-label":"Tambahkan pendidikan",style:{background:"transparent",border:"none",fontSize:"1.15rem",color:"#94a3b8"},children:"➕"}),
          (0,b.jsx)("button",{type:"button","aria-label":"Edit pendidikan",style:{background:"transparent",border:"none",fontSize:"1.15rem",color:"#94a3b8"},children:"✏️"})
        ]})
      ]}),
      (d?.social_media?.education && Array.isArray(d.social_media.education) && d.social_media.education.length > 0) ? (
        d.social_media.education.map((edu, idx) => (
          (0,b.jsxs)("div",{key:idx,style:{display:"flex",gap:"0.85rem",paddingTop:idx>0?"1rem":0},children:[
            (0,b.jsx)("div",{style:{width:"44px",height:"44px",borderRadius:"8px",background:"rgba(168,85,247,0.12)",border:"1px solid rgba(168,85,247,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.3rem",flexShrink:0},children:"🎓"}),
            (0,b.jsxs)("div",{children:[
              (0,b.jsx)("div",{style:{fontWeight:800,fontSize:"0.92rem",color:"var(--text-color, #0f172a)"},children:edu.school || "Institusi Pendidikan"}),
              (0,b.jsx)("div",{style:{fontSize:"0.8rem",color:"#c084fc",fontWeight:600},children:edu.degree || ""})
            ]})
          ]})
        ))
      ) : (
        (0,b.jsxs)("div",{style:{padding:"1.25rem 0.5rem",textAlign:"center",color:"#94a3b8",fontSize:"0.84rem"},children:[
          (0,b.jsx)("div",{style:{fontSize:"1.6rem",marginBottom:"0.35rem"},children:"🎓"}),
          (0,b.jsx)("div",{style:{fontWeight:600,color:"#cbd5e1"},children:"Belum ada riwayat pendidikan yang ditambahkan."}),
          (0,b.jsx)("div",{style:{fontSize:"0.75rem",marginTop:"0.2rem",color:"#64748b"},children:"Tambahkan riwayat pendidikan formal, Akpol, PTIK, atau Dikjur Pusdik Lemdiklat Polri."})
        ]})
      )
    ]})
  ]}),

  // Right Column
  (0,b.jsxs)("div",{style:{display:"grid",gap:"1.25rem"},children:[
    // Keamanan Widget
    (0,b.jsxs)("div",{className:"cms-card",style:{padding:"1.25rem",borderRadius:"14px",border:"1px solid var(--cas-border, rgba(255,255,255,0.1))"},children:[
      (0,b.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.5rem"},children:[
        (0,b.jsx)("h4",{style:{margin:0,fontSize:"0.92rem",fontWeight:800,color:"var(--text-color, #0f172a)"},children:"Keamanan Mandiri"}),
        (0,b.jsx)("span",{style:{fontSize:"1rem"},children:"🛡️"})
      ]}),
      (0,b.jsx)("div",{style:{fontSize:"0.78rem",color:"#94a3b8",marginBottom:"0.6rem"},children:"Status proteksi autentikasi akun kedinasan Anda:"}),
      (0,b.jsx)("button",{type:"button",style:{width:"100%",display:"block",padding:"0.45rem",borderRadius:"8px",background:"transparent",border:"1px solid rgba(56,189,248,0.4)",color:"#38bdf8",fontSize:"0.78rem",fontWeight:700,cursor:"pointer",textAlign:"center"},children:"Kelola Keamanan"})
    ]}),

    // Bahasa profil
    (0,b.jsxs)("div",{className:"cms-card",style:{padding:"1.25rem",borderRadius:"14px",border:"1px solid var(--cas-border, rgba(255,255,255,0.1))"},children:[
      (0,b.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.5rem"},children:[
        (0,b.jsx)("h4",{style:{margin:0,fontSize:"0.92rem",fontWeight:800,color:"var(--text-color, #0f172a)"},children:"Bahasa profil"}),
        (0,b.jsx)("button",{type:"button","aria-label":"Edit bahasa profil",style:{background:"transparent",border:"none",fontSize:"1rem",color:"#94a3b8"},children:"✏️"})
      ]}),
      (0,b.jsx)("div",{style:{fontSize:"0.82rem",color:"#94a3b8"},children:"Bahasa Indonesia"})
    ]}),

    // Profil publik dan URL
    (0,b.jsxs)("div",{className:"cms-card",style:{padding:"1.25rem",borderRadius:"14px",border:"1px solid var(--cas-border, rgba(255,255,255,0.1))"},children:[
      (0,b.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.5rem"},children:[
        (0,b.jsx)("h4",{style:{margin:0,fontSize:"0.92rem",fontWeight:800,color:"var(--text-color, #0f172a)"},children:"Profil publik dan URL"}),
        (0,b.jsx)("button",{type:"button","aria-label":"Edit Profil publik dan URL",style:{background:"transparent",border:"none",fontSize:"1rem",color:"#94a3b8"},children:"✏️"})
      ]}),
      (0,b.jsx)("div",{style:{fontSize:"0.78rem",color:"#94a3b8",marginBottom:"0.6rem"},children:"Identitas Callsign terverifikasi:"}),
      (0,b.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(0,0,0,0.25)",padding:"0.5rem 0.75rem",borderRadius:"8px",border:"1px solid rgba(255,255,255,0.08)"},children:[
        (0,b.jsxs)("span",{style:{fontSize:"0.84rem",fontWeight:800,color:"#38bdf8",fontFamily:"monospace"},children:[
          "@", d?.callsign || d?.username || d?.nrp || "omeko11"
        ]}),
        (0,b.jsx)("span",{style:{fontSize:"0.7rem",color:"#4ade80",fontWeight:700},children:"✓ Terverifikasi"})
      ]})
    ]}),

    // Rekan Personil Terkait (SSR Placeholder - hydrated on client from real DB)
    (0,b.jsxs)("div",{className:"cms-card",style:{padding:"1.25rem",borderRadius:"14px",border:"1px solid var(--cas-border, rgba(255,255,255,0.1))"},children:[
      (0,b.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.85rem"},children:[
        (0,b.jsx)("h4",{style:{margin:0,fontSize:"0.9rem",fontWeight:800,color:"var(--text-color, #0f172a)"},children:"Rekan Personil Terkait"}),
        (0,b.jsx)("span",{style:{fontSize:"0.72rem",color:"#38bdf8",fontWeight:700},children:"Direktori"})
      ]}),
      (0,b.jsx)("div",{style:{fontSize:"0.78rem",color:"#94a3b8",padding:"0.5rem 0",textAlign:"center"},children:"Memuat direktori personil…"})
    ]})
  ]})
]}),
(0,b.jsx)(e.Dialog,{header:"Edit Profil",visible:U,onHide:()=>V(!1),style:{width:"32rem",maxWidth:"95vw"},modal:!0,footer:(0,b.jsxs)("div",{children:[(0,b.jsx)(h.Button,{label:"Batal",text:!0,onClick:()=>V(!1),disabled:Y}),(0,b.jsx)(h.Button,{label:"Simpan",icon:"pi pi-check",onClick:aI,loading:Y})]}),children:(0,b.jsxs)("div",{style:{display:"grid",gap:"0.7rem"},children:[(0,b.jsx)("p",{style:{margin:0,fontSize:"0.8rem",color:"#94a3b8"},children:"Data personil ini dipakai untuk melengkapi Profil Saya. Kosongkan field yang tidak ingin diubah."}),(0,b.jsx)(R,{label:"Nama",required:!0,children:(0,b.jsx)(f.InputText,{value:W.name,onChange:a=>X(b=>({...b,name:a.target.value})),style:{width:"100%"}})}),(0,b.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.7rem"},children:[(0,b.jsx)(R,{label:"NRP / NIP",children:(0,b.jsx)(f.InputText,{value:W.nrp,onChange:a=>X(b=>({...b,nrp:a.target.value})),style:{width:"100%"}})}),(0,b.jsx)(R,{label:"No. HP",children:(0,b.jsx)(f.InputText,{value:W.no_hp,onChange:a=>X(b=>({...b,no_hp:a.target.value})),style:{width:"100%"},placeholder:"08xxxxxxxxxx"})}),(0,b.jsx)(R,{label:"Pangkat",children:(0,b.jsx)(f.InputText,{value:W.pangkat,onChange:a=>X(b=>({...b,pangkat:a.target.value})),style:{width:"100%"},placeholder:"mis. AKP"})}),(0,b.jsx)(R,{label:"Jabatan",children:(0,b.jsx)(f.InputText,{value:W.jabatan,onChange:a=>X(b=>({...b,jabatan:a.target.value})),style:{width:"100%"},placeholder:"mis. Kanit Reskrim"})})]}),(0,b.jsx)(R,{label:"Satuan",children:(0,b.jsx)(f.InputText,{value:W.satuan,onChange:a=>X(b=>({...b,satuan:a.target.value})),style:{width:"100%"}})}),(0,b.jsxs)(R,{label:"Email Dinas Polri",hint:"dipakai untuk login & pengiriman OTP",children:[(0,b.jsx)(m.default,{value:W.email_polri,onChange:a=>{X(b=>({...b,email_polri:a})),$.onChangeDebounced("email_polri",a)},onBlur:a=>$.onBlurNow("email_polri",a),status:$.status.email_polri,placeholder:"nama@polri.go.id"}),$.message.email_polri&&(0,b.jsx)("small",{className:"bdb-error",children:$.message.email_polri})]}),(0,b.jsxs)(R,{label:"Callsign / Username",hint:"alternatif login dan identitas Callsign kedinasan",children:[(0,b.jsx)(m.default,{value:W.username,onChange:a=>{X(b=>({...b,username:a})),$.onChangeDebounced("username",a)},onBlur:a=>$.onBlurNow("username",a),status:$.status.username,placeholder:"mis. bripka.andi"}),$.message.username&&(0,b.jsx)("small",{className:"bdb-error",children:$.message.username})]})]})}),(0,b.jsx)(e.Dialog,{header:"Edit Data Wilayah Satker",visible:az,onHide:()=>aA(!1),style:{width:"32rem",maxWidth:"95vw"},modal:!0,footer:(0,b.jsxs)("div",{children:[(0,b.jsx)(h.Button,{label:"Batal",text:!0,onClick:()=>aA(!1),disabled:aD}),(0,b.jsx)(h.Button,{label:"Simpan",icon:"pi pi-check",onClick:aH,loading:aD})]}),children:(0,b.jsxs)("div",{style:{display:"grid",gap:"0.7rem"},children:[(0,b.jsxs)("p",{style:{margin:0,fontSize:"0.8rem",color:"#94a3b8"},children:["Data wilayah untuk ",(0,b.jsx)("strong",{children:at?.deskripsi})," (",at?.kode,"). Dipakai a.l. utk perhitungan Crime Rate — isi jumlah penduduk terbaru wilayah hukum satker Anda."]}),(0,b.jsx)(R,{label:"Alamat",children:(0,b.jsx)(f.InputText,{value:aB.alamat,onChange:a=>aC(b=>({...b,alamat:a.target.value})),style:{width:"100%"}})}),(0,b.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.7rem"},children:[(0,b.jsx)(R,{label:"Provinsi",children:(0,b.jsx)(f.InputText,{value:aB.provinsi,onChange:a=>aC(b=>({...b,provinsi:a.target.value})),style:{width:"100%"}})}),(0,b.jsx)(R,{label:"Kabupaten/Kota",children:(0,b.jsx)(f.InputText,{value:aB.kabupaten_kota,onChange:a=>aC(b=>({...b,kabupaten_kota:a.target.value})),style:{width:"100%"}})}),(0,b.jsx)(R,{label:"Kecamatan",children:(0,b.jsx)(f.InputText,{value:aB.kecamatan,onChange:a=>aC(b=>({...b,kecamatan:a.target.value})),style:{width:"100%"}})}),(0,b.jsx)(R,{label:"Desa/Kelurahan",children:(0,b.jsx)(f.InputText,{value:aB.desa,onChange:a=>aC(b=>({...b,desa:a.target.value})),style:{width:"100%"}})}),(0,b.jsx)(R,{label:"Kode Pos",children:(0,b.jsx)(f.InputText,{value:aB.kode_pos,onChange:a=>aC(b=>({...b,kode_pos:a.target.value})),style:{width:"100%"}})}),(0,b.jsx)(R,{label:"Jumlah Penduduk",hint:"angka bulat",children:(0,b.jsx)(f.InputText,{value:aB.jumlah_penduduk,onChange:a=>aC(b=>({...b,jumlah_penduduk:a.target.value.replace(/[^\d]/g,"")})),style:{width:"100%"},placeholder:"mis. 125000"})}),(0,b.jsx)(R,{label:"Longitude",hint:"-180 s/d 180",children:(0,b.jsx)(f.InputText,{value:aB.longitude,onChange:a=>aC(b=>({...b,longitude:a.target.value})),style:{width:"100%"},placeholder:"mis. 106.827153"})}),(0,b.jsx)(R,{label:"Latitude",hint:"-90 s/d 90",children:(0,b.jsx)(f.InputText,{value:aB.latitude,onChange:a=>aC(b=>({...b,latitude:a.target.value})),style:{width:"100%"},placeholder:"mis. -6.175392"})})]})]})}),(0,b.jsx)(e.Dialog,{header:"disable_pin"===ab?"Nonaktifkan PIN":"change_pin"===ab?"Ubah PIN Keamanan":"Aktifkan PIN Keamanan",visible:_,onHide:()=>aa(!1),style:{width:"26rem",maxWidth:"95vw"},modal:!0,footer:(0,b.jsxs)("div",{children:[(0,b.jsx)(h.Button,{label:"Batal",text:!0,onClick:()=>aa(!1),disabled:an}),(0,b.jsx)(h.Button,{label:"Verifikasi",icon:"pi pi-check",onClick:aK,loading:an})]}),children:(0,b.jsxs)("div",{style:{display:"grid",gap:"0.9rem",textAlign:"center"},children:[(0,b.jsxs)("p",{style:{margin:0,fontSize:"0.82rem",color:"#64748b"},children:["Kode 6 digit sudah dikirim ke ",(0,b.jsx)("b",{children:N(d.email)}),"."]}),(0,b.jsx)("div",{style:{display:"flex",justifyContent:"center"},children:(0,b.jsx)(g.InputOtp,{value:af,onChange:a=>ag(String(a.value??"")),length:6,integerOnly:!0})}),"disable_pin"!==ab&&(0,b.jsxs)("div",{style:{display:"grid",gap:"0.6rem",textAlign:"left"},children:[(0,b.jsx)(R,{label:"PIN Baru (6-8 digit)",children:(0,b.jsxs)("div",{style:{position:"relative"},children:[(0,b.jsx)(f.InputText,{value:ah,onChange:a=>ai(a.target.value.replace(/\D/g,"").slice(0,8)),style:{width:"100%",paddingRight:"2.3rem"},inputMode:"numeric",type:al?"text":"password",placeholder:"mis. 123456"}),(0,b.jsx)("button",{type:"button",onClick:()=>am(a=>!a),tabIndex:-1,"aria-label":al?"Sembunyikan PIN":"Lihat PIN",style:{position:"absolute",right:"0.5rem",top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#94a3b8",display:"flex",padding:0},children:al?(0,b.jsx)(G.EyeOff,{size:16}):(0,b.jsx)(F.Eye,{size:16})})]})}),(0,b.jsx)(R,{label:"Konfirmasi PIN",children:(0,b.jsx)(f.InputText,{value:aj,onChange:a=>ak(a.target.value.replace(/\D/g,"").slice(0,8)),style:{width:"100%"},inputMode:"numeric",type:al?"text":"password",placeholder:"ulangi PIN"})})]}),ar&&(0,b.jsx)("small",{className:"bdb-error",children:ar})]})})]})}],20291)}];

//# sourceMappingURL=app_cms_profile_page_tsx_0_ymkmx._.js.map