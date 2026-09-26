import fs from 'fs';

function updateProfile() {
    let code = fs.readFileSync('3def3ti6rk0vr.patched.js', 'utf8');

    // 1. Add helper functions maskEmail & maskPhone at top of module
    const helperTarget = 'function c(){return(c=Object.assign.bind()).apply(null,arguments)}';
    const helperReplacement = 'function maskEmail(e){if(!e||"string"!=typeof e)return e||"";let t=e.split("@");if(2!==t.length)return e;let n=t[0],r=t[1];return n.length<=4?n[0]+"***@"+r:n.slice(0,4)+"****@"+r}function maskPhone(e){return!e||"string"!=typeof e||e.length<8?e:e.slice(0,4)+"****"+e.slice(-3)}function c(){return(c=Object.assign.bind()).apply(null,arguments)}';
    if (!code.includes(helperTarget)) throw new Error("helperTarget not found");
    code = code.replace(helperTarget, helperReplacement);
    console.log("Patched 1: Added maskEmail and maskPhone helpers");

    // 2. Add photo modal states & socUrls state near useState(R)
    const stateTarget = '[Z,G]=(0,n.useState)(R),';
    const stateReplacement = '[Z,G]=(0,n.useState)(R),[eSocUrls,setSocUrls]=(0,n.useState)([""]),[ePhotoModal,setPhotoModal]=(0,n.useState)(!1),[ePhotoPreview,setPhotoPreview]=(0,n.useState)(null),[ePhotoLoading,setPhotoLoading]=(0,n.useState)(!1),ePhotoRef=(0,n.useRef)(null),';
    if (!code.includes(stateTarget)) throw new Error("stateTarget not found");
    code = code.replace(stateTarget, stateReplacement);
    console.log("Patched 2: Added states for photo modal and dynamic socUrls");

    // 3. Edit Profile click handler - populate socUrls
    const editClickTarget = 'G({name:a.name||"",email:s,nrp:K(a.nrp)||"",pangkat:K(a.pangkat)||"",jabatan:K(a.jabatan)||"",satuan:K(a.satuan)||"",no_hp:K(a.no_hp)||"",email_polri:p,username:a.username||"",is_pns:Boolean(a.is_pns),social_media:a.social_media||{},photo_url:a.photo_url||a.foto||""}),X.resetAll(),q(!0)';
    const editClickReplacement = 'let initialUrls=[];if(a.social_media){if(Array.isArray(a.social_media.urls))initialUrls=a.social_media.urls;else if(Array.isArray(a.social_media))initialUrls=a.social_media;else Object.values(a.social_media).forEach(v=>{if("string"==typeof v&&v.trim())initialUrls.push(v.trim())})}if(!initialUrls.length)initialUrls=[""];setSocUrls(initialUrls);G({name:a.name||"",email:s,nrp:K(a.nrp)||"",pangkat:K(a.pangkat)||"",jabatan:K(a.jabatan)||"",satuan:K(a.satuan)||"",no_hp:K(a.no_hp)||"",email_polri:p,username:a.username||"",is_pns:Boolean(a.is_pns),social_media:a.social_media||{},photo_url:a.photo_url||a.foto||""}),X.resetAll(),q(!0)';
    if (!code.includes(editClickTarget)) throw new Error("editClickTarget not found");
    code = code.replace(editClickTarget, editClickReplacement);
    console.log("Patched 3: Edit Profile click handler populating socUrls");

    // 4. Header Avatar with Pen Icon badge & Click Handler
    const avatarTarget = '(0,t.jsx)("div",{style:{width:"4.4rem",height:"4.4rem",borderRadius:"999px",background:"rgba(255,255,255,0.16)",border:"2.5px solid rgba(255,255,255,0.7)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.7rem",fontWeight:800,flex:"0 0 auto",overflow:"hidden"},children:(a.photo_url||a.foto)?(0,t.jsx)("img",{src:a.photo_url||a.foto,alt:a.name||"Foto Profil",style:{width:"100%",height:"100%",objectFit:"cover"}}):eB})';
    const avatarReplacement = '(0,t.jsxs)("div",{style:{position:"relative",width:"4.4rem",height:"4.4rem",flex:"0 0 auto",cursor:"pointer"},onClick:()=>{setPhotoPreview(a.photo_url||a.foto||null);setPhotoModal(!0)},title:"Klik untuk melihat atau mengganti foto profil",children:[(0,t.jsx)("div",{style:{width:"100%",height:"100%",borderRadius:"999px",background:"rgba(255,255,255,0.16)",border:"2.5px solid rgba(255,255,255,0.7)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.7rem",fontWeight:800,overflow:"hidden"},children:(a.photo_url||a.foto)?(0,t.jsx)("img",{src:a.photo_url||a.foto,alt:a.name||"Foto Profil",style:{width:"100%",height:"100%",objectFit:"cover"}}):eB}),(0,t.jsx)("div",{style:{position:"absolute",bottom:"-2px",right:"-2px",width:"1.55rem",height:"1.55rem",borderRadius:"999px",background:"#2563eb",border:"2px solid #fff",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",boxShadow:"0 2px 5px rgba(0,0,0,0.25)"},children:(0,t.jsx)(I.Pencil,{size:11})})]})';
    if (!code.includes(avatarTarget)) throw new Error("avatarTarget not found");
    code = code.replace(avatarTarget, avatarReplacement);
    console.log("Patched 4: Header avatar with pen badge and photo modal trigger");

    // 5. Header Email Masking & Social Media clickable badges
    const headerEmailTarget = '(0,t.jsxs)("div",{style:{display:"inline-flex",alignItems:"center",gap:"0.4rem",color:"rgba(255,255,255,0.95)",fontSize:"0.85rem"},children:[(0,t.jsx)(x.Mail,{size:13}),(0,t.jsx)("span",{style:{fontWeight:600},children:a.email_polri||(a.email?.endsWith("@polri.go.id")?a.email:"-")}),(0,t.jsx)("span",{style:{fontSize:"0.62rem",background:"rgba(59,130,246,0.6)",color:"#fff",padding:"0.05rem 0.4rem",borderRadius:"3px",fontWeight:700},children:"Dinas Polri"})]}),(a.email&&(!a.email_polri||a.email.toLowerCase()!==a.email_polri.toLowerCase())&&!a.email.endsWith("@polri.go.id"))?(0,t.jsxs)("div",{style:{display:"inline-flex",alignItems:"center",gap:"0.35rem",color:"rgba(255,255,255,0.75)",fontSize:"0.76rem",marginLeft:"1.1rem"},children:[(0,t.jsx)("span",{children:a.email}),(0,t.jsx)("span",{style:{fontSize:"0.58rem",background:"rgba(255,255,255,0.2)",color:"#fff",padding:"0.03rem 0.3rem",borderRadius:"3px"},children:"Sekunder"})]}):null';
    const headerEmailReplacement = 'let polriRaw=a.email_polri||(a.email?.endsWith("@polri.go.id")?a.email:""),secRaw=(a.email&&(!a.email_polri||a.email.toLowerCase()!==a.email_polri.toLowerCase())&&!a.email.endsWith("@polri.go.id"))?a.email:"";return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("div",{style:{display:"inline-flex",alignItems:"center",gap:"0.4rem",color:"rgba(255,255,255,0.95)",fontSize:"0.85rem"},title:polriRaw,children:[(0,t.jsx)(x.Mail,{size:13}),(0,t.jsx)("span",{style:{fontWeight:600},children:maskEmail(polriRaw)||"-"}),(0,t.jsx)("span",{style:{fontSize:"0.62rem",background:"rgba(59,130,246,0.6)",color:"#fff",padding:"0.05rem 0.4rem",borderRadius:"3px",fontWeight:700},children:"Dinas Polri"})]}),secRaw?(0,t.jsxs)("div",{style:{display:"inline-flex",alignItems:"center",gap:"0.35rem",color:"rgba(255,255,255,0.75)",fontSize:"0.76rem",marginLeft:"1.1rem"},title:secRaw,children:[(0,t.jsx)("span",{children:maskEmail(secRaw)}),(0,t.jsx)("span",{style:{fontSize:"0.58rem",background:"rgba(255,255,255,0.2)",color:"#fff",padding:"0.03rem 0.3rem",borderRadius:"3px"},children:"Sekunder"})]}):null]})})()}';

    // Let's replace the whole header email block safely:
    const headerBlockStart = '(0,t.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.2rem",marginTop:"0.25rem"},children:[';
    const headerBlockEnd = '(a.social_media&&(';
    const hbIdx = code.indexOf(headerBlockStart);
    const heIdx = code.indexOf(headerBlockEnd, hbIdx);
    if (hbIdx === -1 || heIdx === -1) throw new Error("Header block range not found");

    const newHeaderBlock = '(0,t.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.2rem",marginTop:"0.25rem"},children:[(()=>{let polriRaw=a.email_polri||(a.email?.endsWith("@polri.go.id")?a.email:""),secRaw=(a.email&&(!a.email_polri||a.email.toLowerCase()!==a.email_polri.toLowerCase())&&!a.email.endsWith("@polri.go.id"))?a.email:"";return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("div",{style:{display:"inline-flex",alignItems:"center",gap:"0.4rem",color:"rgba(255,255,255,0.95)",fontSize:"0.85rem"},title:polriRaw,children:[(0,t.jsx)(x.Mail,{size:13}),(0,t.jsx)("span",{style:{fontWeight:600},children:maskEmail(polriRaw)||"-"}),(0,t.jsx)("span",{style:{fontSize:"0.62rem",background:"rgba(59,130,246,0.6)",color:"#fff",padding:"0.05rem 0.4rem",borderRadius:"3px",fontWeight:700},children:"Dinas Polri"})]}),secRaw?(0,t.jsxs)("div",{style:{display:"inline-flex",alignItems:"center",gap:"0.35rem",color:"rgba(255,255,255,0.75)",fontSize:"0.76rem",marginLeft:"1.1rem"},title:secRaw,children:[(0,t.jsx)("span",{children:maskEmail(secRaw)}),(0,t.jsx)("span",{style:{fontSize:"0.58rem",background:"rgba(255,255,255,0.2)",color:"#fff",padding:"0.03rem 0.3rem",borderRadius:"3px"},children:"Sekunder"})]}):null]})})()]}),';

    code = code.substring(0, hbIdx) + newHeaderBlock + code.substring(heIdx);
    console.log("Patched 5: Header masked emails");

    // 6. Header Social Media Badges (Dynamic list of URLs)
    const oldSocSectionStart = '(a.social_media&&(a.social_media.instagram||a.social_media.linkedin||a.social_media.twitter||a.social_media.facebook))?';
    const oldSocSectionEnd = ']}):null]})';
    const socSIdx = code.indexOf(oldSocSectionStart);
    const socEIdx = code.indexOf(oldSocSectionEnd, socSIdx);
    if (socSIdx === -1 || socEIdx === -1) throw new Error("oldSocSection range not found");

    const newSocDisplay = '(()=>{let urls=[];if(a.social_media){if(Array.isArray(a.social_media.urls))urls=a.social_media.urls;else if(Array.isArray(a.social_media))urls=a.social_media;else Object.values(a.social_media).forEach(v=>{if("string"==typeof v&&v.trim())urls.push(v.trim())})}urls=urls.filter(Boolean);if(!urls.length)return null;function getLabel(u){let low=u.toLowerCase();if(low.includes("instagram.com"))return"Instagram";if(low.includes("linkedin.com"))return"LinkedIn";if(low.includes("twitter.com")||low.includes("x.com"))return"X";if(low.includes("facebook.com"))return"Facebook";if(low.includes("tiktok.com"))return"TikTok";if(low.includes("youtube.com"))return"YouTube";return"Medsos"}return(0,t.jsx)("div",{style:{display:"flex",gap:"0.4rem",alignItems:"center",marginTop:"0.4rem",flexWrap:"wrap"},children:urls.map((u,i)=>(0,t.jsx)("a",{key:i,href:u.startsWith("http")?u:`https://${u}`,target:"_blank",rel:"noreferrer",style:{fontSize:"0.7rem",color:"#fff",background:"rgba(255,255,255,0.18)",padding:"0.15rem 0.55rem",borderRadius:"999px",textDecoration:"none",display:"inline-flex",alignItems:"center",gap:"0.25rem"},children:getLabel(u)}))})})()]})';

    code = code.substring(0, socSIdx) + newSocDisplay + code.substring(socEIdx + oldSocSectionEnd.length);
    console.log("Patched 6: Header dynamic social media badges");

    // 7. Remove "Metode Login HYBRID" & add masking in Data Personil card
    const oldPersonilRows = `(0,t.jsx)(W,{id:"fld-3def3ti6rk0vr-10",name:"field_3def3ti6rk0vr_10",icon:(0,t.jsx)(f.Phone,{size:15}),label:"No. HP",value:K(a.no_hp)}),(0,t.jsx)(W,{id:"fld-3def3ti6rk0vr-11",name:"field_3def3ti6rk0vr_11",icon:(0,t.jsx)(x.Mail,{size:15}),label:"Email Dinas (Polri)",value:K(a.email_polri||(a.email?.endsWith("@polri.go.id")?a.email:"-"))}),(a.email&&(!a.email_polri||a.email.toLowerCase()!==a.email_polri.toLowerCase())&&!a.email.endsWith("@polri.go.id"))&&(0,t.jsx)(W,{id:"fld-3def3ti6rk0vr-secmail",name:"field_3def3ti6rk0vr_secmail",icon:(0,t.jsx)(x.Mail,{size:15}),label:"Email Sekunder",value:K(a.email)}),(0,t.jsx)(W,{id:"fld-3def3ti6rk0vr-12",name:"field_3def3ti6rk0vr_12",icon:(0,t.jsx)(S.Hash,{size:15}),label:"Username",value:K(a.username)}),(0,t.jsx)(W,{id:"fld-3def3ti6rk0vr-13",name:"field_3def3ti6rk0vr_13",icon:(0,t.jsx)(j,{id:"fld-3def3ti6rk0vr-14",name:"field_3def3ti6rk0vr_14",size:15}),label:"Metode Login",value:K(a.login_method),last:!0})]`;

    const newPersonilRows = `(0,t.jsx)(W,{id:"fld-3def3ti6rk0vr-10",name:"field_3def3ti6rk0vr_10",icon:(0,t.jsx)(f.Phone,{size:15}),label:"No. HP",value:a.no_hp?maskPhone(a.no_hp):void 0}),(0,t.jsx)(W,{id:"fld-3def3ti6rk0vr-11",name:"field_3def3ti6rk0vr_11",icon:(0,t.jsx)(x.Mail,{size:15}),label:"Email Dinas (Polri)",value:maskEmail(a.email_polri||(a.email?.endsWith("@polri.go.id")?a.email:"-"))}),(a.email&&(!a.email_polri||a.email.toLowerCase()!==a.email_polri.toLowerCase())&&!a.email.endsWith("@polri.go.id"))&&(0,t.jsx)(W,{id:"fld-3def3ti6rk0vr-secmail",name:"field_3def3ti6rk0vr_secmail",icon:(0,t.jsx)(x.Mail,{size:15}),label:"Email Sekunder",value:maskEmail(a.email)}),(0,t.jsx)(W,{id:"fld-3def3ti6rk0vr-12",name:"field_3def3ti6rk0vr_12",icon:(0,t.jsx)(S.Hash,{size:15}),label:"Username",value:a.username?maskEmail(a.username):void 0,last:!0})]`;

    if (!code.includes(oldPersonilRows)) throw new Error("oldPersonilRows not found");
    code = code.replace(oldPersonilRows, newPersonilRows);
    console.log("Patched 7: Removed Metode Login HYBRID & masked personil rows");

    // 8. Style "Ubah Password" like "Aktifkan"
    const oldPwBtn = 'action:(0,t.jsx)("a",{href:"/cms/profile/reset-password",style:{fontSize:"0.72rem",fontWeight:700,padding:"0.28rem 0.6rem",color:"#2563eb",textDecoration:"none",display:"inline-flex",alignItems:"center",border:"1px solid #bfdbfe",borderRadius:"4px",background:"#eff6ff"},children:"Ubah Password"})';
    const newPwBtn = 'action:(0,t.jsx)("a",{href:"/cms/profile/reset-password",style:{fontSize:"0.75rem",fontWeight:700,color:"#16a34a",padding:"0.3rem 0.6rem",textDecoration:"none",display:"inline-flex",alignItems:"center"},children:"Ubah Password"})';
    if (!code.includes(oldPwBtn)) throw new Error("oldPwBtn not found");
    code = code.replace(oldPwBtn, newPwBtn);
    console.log("Patched 8: Styled Ubah Password like Aktifkan");

    // 9. Submit handler eA - collect socUrls
    const oldEaPayload = 'social_media:Z.social_media||{}';
    const newEaPayload = 'social_media:{urls:eSocUrls.map(u=>u.trim()).filter(Boolean)}';
    if (!code.includes(oldEaPayload)) throw new Error("oldEaPayload not found");
    code = code.replace(oldEaPayload, newEaPayload);
    console.log("Patched 9: eA() submit handler saving dynamic socUrls");

    // 10. Dialog form: Social media dynamic repeater
    const oldSocInput = `(0,t.jsxs)(F,{label:"Media Sosial Personil (Membangun Komunitas)",hint:"opsional",children:[(0,t.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.6rem"},children:[(0,t.jsx)(i.InputText,{id:"profile-soc-ig",name:"instagram",placeholder:"Instagram (mis. @nama)",value:Z.social_media?.instagram||"",onChange:e=>G(t=>({...t,social_media:{...(t.social_media||{}),instagram:e.target.value}})),style:{width:"100%"}}),(0,t.jsx)(i.InputText,{id:"profile-soc-li",name:"linkedin",placeholder:"LinkedIn (URL atau username)",value:Z.social_media?.linkedin||"",onChange:e=>G(t=>({...t,social_media:{...(t.social_media||{}),linkedin:e.target.value}})),style:{width:"100%"}}),(0,t.jsx)(i.InputText,{id:"profile-soc-tw",name:"twitter",placeholder:"X / Twitter (mis. @nama)",value:Z.social_media?.twitter||"",onChange:e=>G(t=>({...t,social_media:{...(t.social_media||{}),twitter:e.target.value}})),style:{width:"100%"}}),(0,t.jsx)(i.InputText,{id:"profile-soc-fb",name:"facebook",placeholder:"Facebook (URL atau nama)",value:Z.social_media?.facebook||"",onChange:e=>G(t=>({...t,social_media:{...(t.social_media||{}),facebook:e.target.value}})),style:{width:"100%"}})]})]})`;

    const newSocInput = `(0,t.jsxs)(F,{label:"Media Sosial Personil (Membangun Komunitas)",hint:"masukkan URL profil (Instagram, LinkedIn, X, TikTok, dll.) - opsional",children:[(0,t.jsx)("div",{style:{display:"flex",flexDirection:"column",gap:"0.45rem"},children:eSocUrls.map((u,idx)=>(0,t.jsxs)("div",{style:{display:"flex",gap:"0.4rem",alignItems:"center"},children:[(0,t.jsx)(i.InputText,{placeholder:"https://... (URL medsos)",value:u,onChange:e=>{let next=[...eSocUrls];next[idx]=e.target.value;setSocUrls(next)},style:{flex:1}}),(idx===eSocUrls.length-1)&&(0,t.jsx)(o.Button,{type:"button",icon:"pi pi-plus",className:"p-button-outlined p-button-sm",onClick:()=>setSocUrls([...eSocUrls,""]),tooltip:"Tambah link medsos lain",style:{width:"2.5rem",height:"2.5rem",flexShrink:0}}),(eSocUrls.length>1)&&(0,t.jsx)(o.Button,{type:"button",icon:"pi pi-trash",className:"p-button-outlined p-button-danger p-button-sm",onClick:()=>setSocUrls(eSocUrls.filter((_,i)=>i!==idx)),tooltip:"Hapus",style:{width:"2.5rem",height:"2.5rem",flexShrink:0}})]},idx))})]}),(0,t.jsx)("input",{type:"file",ref:ePhotoRef,style:{display:"none"},accept:"image/png,image/jpeg,image/webp",onChange:e=>{let f=e.target.files?.[0];if(!f)return;if(f.size>5*1024*1024)return void e.current?.show({severity:"warn",summary:"Ukuran Terlalu Besar",detail:"Maksimal ukuran foto adalah 5 MB."});let r=new FileReader;r.onload=ev=>{let img=new Image;img.onload=()=>{let maxDim=600,w=img.width,h=img.height;if(w>h&&w>maxDim){h=Math.round(h*maxDim/w);w=maxDim}else if(h>maxDim){w=Math.round(w*maxDim/h);h=maxDim}let canvas=document.createElement("canvas");canvas.width=w;canvas.height=h;let ctx=canvas.getContext("2d");ctx.drawImage(img,0,0,w,h);let base64=canvas.toDataURL("image/jpeg",0.85);setPhotoPreview(base64)};img.src=ev.target.result};r.readAsDataURL(f)}})`;

    if (!code.includes(oldSocInput)) throw new Error("oldSocInput not found");
    code = code.replace(oldSocInput, newSocInput);
    console.log("Patched 10: Dynamic social media repeater and hidden photo file input");

    // 11. Append Photo Modal Dialog
    const photoModalJSX = `,(0,t.jsx)(r.Dialog,{header:"Foto Profil Personel",visible:ePhotoModal,onHide:()=>setPhotoModal(!1),style:{width:"26rem",maxWidth:"95vw"},modal:!0,footer:(0,t.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%"},children:[ePhotoPreview?(0,t.jsx)(o.Button,{label:"Hapus",icon:"pi pi-trash",severity:"danger",text:!0,size:"small",disabled:ePhotoLoading,onClick:()=>setPhotoPreview(null)}):(0,t.jsx)("span",{}),(0,t.jsxs)("div",{style:{display:"flex",gap:"0.5rem"},children:[(0,t.jsx)(o.Button,{label:"Batal",text:!0,onClick:()=>setPhotoModal(!1),disabled:ePhotoLoading}),(0,t.jsx)(o.Button,{label:"Simpan Foto",icon:"pi pi-check",loading:ePhotoLoading,onClick:async function(){setPhotoLoading(!0);try{let payload={photo_url:ePhotoPreview||"",foto:ePhotoPreview||""};(0,c.assertOk)(await c.apiAuth.patch("/user/me/profile",payload)),y(t=>({...t,photo_url:ePhotoPreview||null,foto:ePhotoPreview||null})),e.current?.show({severity:"success",summary:"Tersimpan",detail:"Foto profil berhasil diperbarui."}),setPhotoModal(!1),await eT()}catch(t){e.current?.show({severity:"error",summary:"Gagal",detail:t.response?.data?.message||"Gagal menyimpan foto profil."})}finally{setPhotoLoading(!1)}}})]})]}),children:(0,t.jsxs)("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",padding:"0.75rem 0"},children:[(0,t.jsx)("div",{style:{width:"10.5rem",height:"10.5rem",borderRadius:"999px",border:"3.5px solid #3b82f6",overflow:"hidden",boxShadow:"0 4px 14px rgba(0,0,0,0.15)",display:"flex",alignItems:"center",justifyContent:"center",background:"#f1f5f9",marginBottom:"1.25rem"},children:ePhotoPreview?(0,t.jsx)("img",{src:ePhotoPreview,alt:"Preview",style:{width:"100%",height:"100%",objectFit:"cover"}}):(0,t.jsx)("div",{style:{fontSize:"3.5rem",fontWeight:800,color:"#94a3b8"},children:eB})}),(0,t.jsx)(o.Button,{label:ePhotoPreview?"Ganti Foto":"Pilih Foto dari Perangkat",icon:"pi pi-upload",size:"small",onClick:()=>ePhotoRef.current?.click(),disabled:ePhotoLoading,className:"p-button-outlined"}),(0,t.jsx)("p",{style:{fontSize:"0.75rem",color:"#64748b",marginTop:"0.75rem",marginBottom:0,textAlign:"center"},children:"Format yang didukung: JPG, PNG, WEBP. Maksimal 5 MB. Foto akan otomatis dioptimalkan."})]})})`;

    // Insert photoModalJSX right after the edit profile dialog closes:
    const dialogCloseTarget = 'header:"Edit Profil",visible:$,onHide:()=>q(!1)';
    const dcIdx = code.indexOf(dialogCloseTarget);
    if (dcIdx === -1) throw new Error("dialogCloseTarget not found");
    const dialogEndTarget = '}),(0,t.jsx)(r.Dialog,{header:"Edit Data Wilayah Satker"';
    const deIdx = code.indexOf(dialogEndTarget, dcIdx);
    if (deIdx === -1) throw new Error("dialogEndTarget not found");

    code = code.substring(0, deIdx) + '})' + photoModalJSX + ',(0,t.jsx)(r.Dialog,{header:"Edit Data Wilayah Satker"' + code.substring(deIdx + dialogEndTarget.length);
    console.log("Patched 11: Added Photo Modal Dialog");

    fs.writeFileSync('3def3ti6rk0vr.patched.js', code, 'utf8');
    console.log("3def3ti6rk0vr.patched.js updated successfully.");
}

updateProfile();
