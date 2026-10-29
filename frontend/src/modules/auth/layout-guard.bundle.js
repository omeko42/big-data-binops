(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,56420,e=>{"use strict";if(typeof window!=="undefined"&&!window.__bdbErrGuard){window.__bdbErrGuard=!0,window.addEventListener("error",function(e){if(e&&e.message&&(e.message.includes("reading 'startTime'")||e.message.includes("Minified React error #418"))){e.preventDefault(),e.stopImmediatePropagation()}},!0)}var a=e.i(71645);let t=(...e)=>e.filter((e,a,t)=>!!e&&""!==e.trim()&&t.indexOf(e)===a).join(" ").trim(),r=e=>{let a=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,a,t)=>t?t.toUpperCase():a.toLowerCase());return a.charAt(0).toUpperCase()+a.slice(1)};var s={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let n=(0,a.createContext)({}),l=(0,a.forwardRef)(({color:e,size:r,strokeWidth:l,absoluteStrokeWidth:i,className:o="",children:c,iconNode:u,...d},p)=>{let{size:m=24,strokeWidth:f=2,absoluteStrokeWidth:h=!1,color:g="currentColor",className:k=""}=(0,a.useContext)(n)??{},b=i??h?24*Number(l??f)/Number(r??m):l??f;return(0,a.createElement)("svg",{ref:p,...s,width:r??m??s.width,height:r??m??s.height,stroke:e??g,strokeWidth:b,className:t("lucide",k,o),...!c&&!(e=>{for(let a in e)if(a.startsWith("aria-")||"role"===a||"title"===a)return!0;return!1})(d)&&{"aria-hidden":"true"},...d},[...u.map(([e,t])=>(0,a.createElement)(e,t)),...Array.isArray(c)?c:[c]])});e.s(["default",0,(e,s)=>{let n=(0,a.forwardRef)(({className:n,...i},o)=>(0,a.createElement)(l,{ref:o,iconNode:s,className:t(`lucide-${r(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,n),...i}));return n.displayName=r(e),n}],56420)},18566,(e,a,t)=>{a.exports=e.r(76562)},38036,e=>{"use strict";var a=e.i(54858);function t(){try{return JSON.parse(localStorage.getItem("auth")||"null")}catch{return null}}function r(){try{return JSON.parse(localStorage.getItem("user")||"null")}catch{return null}}async function s(e){let t=await a.api.get("/Authentication/user",{headers:{Authorization:`Bearer ${e.access_token||""}`}}),r={role:{permission:[]},...t.data?.data};try{let _ou=JSON.parse(localStorage.getItem("user")||"null");if(_ou&&(_ou.id||_ou.user_id)&&r&&(r.id||r.user_id)&&String(_ou.id||_ou.user_id)!==String(r.id||r.user_id)){try{window.bdbClearAllCache&&window.bdbClearAllCache()}catch(_e){}try{sessionStorage.clear()}catch(_e){}try{if(window.indexedDB)indexedDB.deleteDatabase("bdb_offline_db")}catch(_e){}}}catch(_e){}return localStorage.setItem("user",JSON.stringify(r)),localStorage.setItem("auth",JSON.stringify(e)),e.expires_at&&localStorage.setItem("auth.expires_at",e.expires_at),e.access_token&&localStorage.setItem("auth.access_token",e.access_token),e.refresh_token&&localStorage.setItem("auth.refresh",e.refresh_token),r}let n="impersonator_stash";async function l(e){let a=t(),l=r();return a?.access_token&&l&&localStorage.setItem(n,JSON.stringify({auth:a,user:l})),s(e)}function i(){try{return JSON.parse(localStorage.getItem(n)||"null")}catch{return null}}e.s(["deriveRoles",0,function(e){let a=String(e?.role?.role_name||e?.role_name||"").toLowerCase(),t=String(e?.role_bdb||e?.requested_role_bdb||"").toLowerCase(),m="vendor_mitra"===t||"vendor"===t||"mitra"===t||a.includes("vendor")||a.includes("mitra"),r="superadmin"===t||a.includes("super"),s="admin_binops"===t||!r&&!m&&("admin"===a||a.includes("binops")),v=!r&&!s&&(m||t==="viewer"||a.includes("viewer"));return{isSuperadmin:r||m,isStrictSuperadmin:r,isVendorMitra:m,isAdminBinops:s,isViewer:v,isReadOnly:v||m,isOperator:!r&&!s&&!v&&!m,canManageUsers:r||s||m,canUseBroadcaster:r||s||m,label:m?"vendor_mitra":(t||a||(v?"viewer":"operator"))}},"fetchAndStoreUser",0,s,"getAuth",0,t,"getImpersonatorStash",0,i,"getUser",0,r,"logout",0,function(){try{let _tok=localStorage.getItem("auth.access_token")||(JSON.parse(localStorage.getItem("auth")||"null")?.access_token)||"";if(_tok&&typeof fetch==="function"){fetch("/api/Authentication/logout",{method:"GET",headers:{Authorization:"Bearer "+_tok},keepalive:!0}).catch(()=>{})}}catch(_e){}try{window.bdbClearAllCache&&window.bdbClearAllCache()}catch(_e){}try{if(window.caches)caches.keys().then(k=>Promise.all(k.map(n=>caches.delete(n))))}catch(_e){}try{if(navigator.serviceWorker)navigator.serviceWorker.getRegistrations().then(r=>r.forEach(reg=>reg.unregister()))}catch(_e){}try{sessionStorage.clear()}catch(_e){}try{["auth.access_token","auth","user","auth.expires_at","auth.refresh","impersonator_stash","bdb.auth.last_activity"].forEach(k=>localStorage.removeItem(k));localStorage.setItem("bdb.auth.logout_broadcast",String(Date.now()));localStorage.clear()}catch(_e){}try{if(typeof BroadcastChannel!=="undefined"){let bc=new BroadcastChannel("bdb_auth_channel");bc.postMessage({type:"LOGOUT",ts:Date.now()});bc.close()}}catch(_e){}try{if(window.indexedDB){indexedDB.deleteDatabase("bdb_offline_db");indexedDB.deleteDatabase("keyval-store")}}catch(_e){}},"startImpersonation",0,l,"stopImpersonation",0,function(){let e=i();return!!e?.auth?.access_token&&(localStorage.setItem("user",JSON.stringify(e.user)),localStorage.setItem("auth",JSON.stringify(e.auth)),e.auth.expires_at&&localStorage.setItem("auth.expires_at",String(e.auth.expires_at)),e.auth.access_token&&localStorage.setItem("auth.access_token",String(e.auth.access_token)),e.auth.refresh_token&&localStorage.setItem("auth.refresh",String(e.auth.refresh_token)),localStorage.removeItem(n),!0)}])},41120,e=>{"use strict";let a=(0,e.i(56420).default)("refresh-cw",[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]]);e.s(["RefreshCw",0,a],41120)},45868,e=>{"use strict";e.s(["APP_VERSION",0,"1.0.0"])},65489,e=>{"use strict";let a=(0,e.i(56420).default)("megaphone",[["path",{d:"M11 6a13 13 0 0 0 8.4-2.8A1 1 0 0 1 21 4v12a1 1 0 0 1-1.6.8A13 13 0 0 0 11 14H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z",key:"q8bfy3"}],["path",{d:"M6 14a12 12 0 0 0 2.4 7.2 2 2 0 0 0 3.2-2.4A8 8 0 0 1 10 14",key:"1853fq"}],["path",{d:"M8 6v8",key:"15ugcq"}]]);e.s(["Megaphone",0,a],65489)},71028,e=>{"use strict";let a=(0,e.i(56420).default)("gauge",[["path",{d:"m12 14 4-4",key:"9kzdfg"}],["path",{d:"M3.34 19a10 10 0 1 1 17.32 0",key:"19p75a"}]]);e.s(["Gauge",0,a],71028)},31458,e=>{"use strict";let a=(0,e.i(56420).default)("flag",[["path",{d:"M4 22V4a1 1 0 0 1 .4-.8A6 6 0 0 1 8 2c3 0 5 2 7.333 2q2 0 3.067-.8A1 1 0 0 1 20 4v10a1 1 0 0 1-.4.8A6 6 0 0 1 16 16c-3 0-5-2-8-2a6 6 0 0 0-4 1.528",key:"1jaruq"}]]);e.s(["Flag",0,a],31458)},9573,e=>{"use strict";var a=e.i(71645);e.s(["fmtUpdated",0,function(e){return e?e.toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit",second:"2-digit"}):"—"},"useAutoRefresh",0,function(e,t=3e5){let r=(0,a.useRef)(e);r.current=e;let s=(0,a.useRef)(!1),[n,l]=(0,a.useState)(!1),[i,o]=(0,a.useState)(null),c=(0,a.useCallback)(async()=>{if(!s.current){s.current=!0,l(!0);try{await r.current(),o(new Date)}finally{s.current=!1,l(!1)}}},[]);return(0,a.useEffect)(()=>{let e=setInterval(()=>{("u"<typeof document||"visible"===document.visibilityState)&&c()},t);return()=>clearInterval(e)},[c,t]),{refreshing:n,updatedAt:i,refresh:c}}])},95057,(e,a,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r={formatUrl:function(){return i},formatWithValidation:function(){return c},urlObjectKeys:function(){return o}};for(var s in r)Object.defineProperty(t,s,{enumerable:!0,get:r[s]});let n=e.r(90809)._(e.r(98183)),l=/https?|ftp|gopher|file/;function i(e){let{auth:a,hostname:t}=e,r=e.protocol||"",s=e.pathname||"",i=e.hash||"",o=e.query||"",c=!1;a=a?encodeURIComponent(a).replace(/%3A/i,":")+"@":"",e.host?c=a+e.host:t&&(c=a+(~t.indexOf(":")?`[${t}]`:t),e.port&&(c+=":"+e.port)),o&&"object"==typeof o&&(o=String(n.urlQueryToSearchParams(o)));let u=e.search||o&&`?${o}`||"";return r&&!r.endsWith(":")&&(r+=":"),e.slashes||(!r||l.test(r))&&!1!==c?(c="//"+(c||""),s&&"/"!==s[0]&&(s="/"+s)):c||(c=""),i&&"#"!==i[0]&&(i="#"+i),u&&"?"!==u[0]&&(u="?"+u),s=s.replace(/[?#]/g,encodeURIComponent),u=u.replace("#","%23"),`${r}${c}${s}${u}${i}`}let o=["auth","hash","host","hostname","href","path","pathname","port","protocol","query","search","slashes"];function c(e){return i(e)}},18581,(e,a,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"useMergedRef",{enumerable:!0,get:function(){return s}});let r=e.r(71645);function s(e,a){let t=(0,r.useRef)(null),s=(0,r.useRef)(null);return(0,r.useCallback)(r=>{if(null===r){let e=t.current;e&&(t.current=null,e());let a=s.current;a&&(s.current=null,a())}else e&&(t.current=n(e,r)),a&&(s.current=n(a,r))},[e,a])}function n(e,a){if("function"!=typeof e)return e.current=a,()=>{e.current=null};{let t=e(a);return"function"==typeof t?t:()=>e(null)}}("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),a.exports=t.default)},73668,(e,a,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"isLocalURL",{enumerable:!0,get:function(){return n}});let r=e.r(18967),s=e.r(52817);function n(e){if(!(0,r.isAbsoluteUrl)(e))return!0;try{let a=(0,r.getLocationOrigin)(),t=new URL(e,a);return t.origin===a&&(0,s.hasBasePath)(t.pathname)}catch(e){return!1}}},84508,(e,a,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"errorOnce",{enumerable:!0,get:function(){return r}});let r=e=>{}},22016,(e,a,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r={default:function(){return k},useLinkStatus:function(){return y}};for(var s in r)Object.defineProperty(t,s,{enumerable:!0,get:r[s]});let n=e.r(90809),l=e.r(43476),i=n._(e.r(71645)),o=e.r(95057),c=e.r(8372),u=e.r(18581),d=e.r(18967),p=e.r(5550);e.r(33525);let m=e.r(88540),f=e.r(91949),h=e.r(73668),g=e.r(9396);function k(a){var t,r;let s,n,k,[y,j]=(0,i.useOptimistic)(f.IDLE_LINK_STATUS),v=(0,i.useRef)(null),{href:S,as:w,children:x,prefetch:R=null,passHref:M,replace:_,shallow:N,scroll:P,onClick:C,onMouseEnter:A,onTouchStart:L,legacyBehavior:O=!1,onNavigate:T,transitionTypes:I,ref:E,unstable_dynamicOnHover:z,...K}=a;s=x,O&&("string"==typeof s||"number"==typeof s)&&(s=(0,l.jsx)("a",{children:s}));let $=i.default.useContext(c.AppRouterContext),D=!1!==R,B=!1!==R?null===(r=R)||"auto"===r?g.FetchStrategy.PPR:g.FetchStrategy.Full:g.FetchStrategy.PPR,U="string"==typeof(t=w||S)?t:(0,o.formatUrl)(t);if(O){if(s?.$$typeof===Symbol.for("react.lazy"))throw Object.defineProperty(Error("`<Link legacyBehavior>` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's `<a>` tag."),"__NEXT_ERROR_CODE",{value:"E863",enumerable:!1,configurable:!0});n=i.default.Children.only(s)}let q=O?n&&"object"==typeof n&&n.ref:E,J=i.default.useCallback(e=>(null!==$&&(v.current=(0,f.mountLinkInstance)(e,U,$,B,D,j)),()=>{v.current&&((0,f.unmountLinkForCurrentNavigation)(v.current),v.current=null),(0,f.unmountPrefetchableInstance)(e)}),[D,U,$,B,j]),W={ref:(0,u.useMergedRef)(J,q),onClick(a){O||"function"!=typeof C||C(a),O&&n.props&&"function"==typeof n.props.onClick&&n.props.onClick(a),!$||a.defaultPrevented||function(a,t,r,s,n,l,o){if("u">typeof window){let c,{nodeName:u}=a.currentTarget;if("A"===u.toUpperCase()&&((c=a.currentTarget.getAttribute("target"))&&"_self"!==c||a.metaKey||a.ctrlKey||a.shiftKey||a.altKey||a.nativeEvent&&2===a.nativeEvent.which)||a.currentTarget.hasAttribute("download"))return;if(!(0,h.isLocalURL)(t)){s&&(a.preventDefault(),location.replace(t));return}if(a.preventDefault(),l){let e=!1;if(l({preventDefault:()=>{e=!0}}),e)return}let{dispatchNavigateAction:d}=e.r(99781);i.default.startTransition(()=>{d(t,s?"replace":"push",!1===n?m.ScrollBehavior.NoScroll:m.ScrollBehavior.Default,r.current,o)})}}(a,U,v,_,P,T,I)},onMouseEnter(e){O||"function"!=typeof A||A(e),O&&n.props&&"function"==typeof n.props.onMouseEnter&&n.props.onMouseEnter(e),$&&D&&(0,f.onNavigationIntent)(e.currentTarget,!0===z)},onTouchStart:function(e){O||"function"!=typeof L||L(e),O&&n.props&&"function"==typeof n.props.onTouchStart&&n.props.onTouchStart(e),$&&D&&(0,f.onNavigationIntent)(e.currentTarget,!0===z)}};return(0,d.isAbsoluteUrl)(U)?W.href=U:O&&!M&&("a"!==n.type||"href"in n.props)||(W.href=(0,p.addBasePath)(U)),k=O?i.default.cloneElement(n,W):(0,l.jsx)("a",{...K,...W,children:s}),(0,l.jsx)(b.Provider,{value:y,children:k})}e.r(84508);let b=(0,i.createContext)(f.IDLE_LINK_STATUS),y=()=>(0,i.useContext)(b);("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),a.exports=t.default)},70187,e=>{"use strict";let a={key:"code",label:"Kode"},t={key:"name",label:"Nama"},r={key:"singkatan",label:"Singkatan"},s={key:"status",label:"Status"},n=Object.fromEntries([{slug:"agama",title:"Agama",fields:[t]},{slug:"kewarganegaraan",title:"Kewarganegaraan",fields:[a,t]},{slug:"pekerjaan",title:"Pekerjaan",fields:[a,t]},{slug:"pendidikan",title:"Pendidikan",fields:[t]},{slug:"suku",title:"Suku",fields:[t]},{slug:"golongan-kejahatan",title:"Golongan Kejahatan",fields:[t]},{slug:"kategori-lokasi",title:"Tempat Peristiwa/Kejadian",fields:[t]},{slug:"modus-operandi",title:"Modus Operandi",fields:[t]},{slug:"motif-kejahatan",title:"Motif Kejahatan",fields:[t]},{slug:"iccs-kategori",title:"Kategori ICCS",fields:[{key:"kode",label:"Kode"},{key:"nama",label:"Nama"},{key:"keterangan",label:"Keterangan"}]},{slug:"undang-undang",title:"Undang-Undang",fields:[{key:"deskripsi",label:"Deskripsi"}]},{slug:"provinsi",title:"Provinsi",fields:[a,t,r,s]},{slug:"kabupaten",title:"Kabupaten/Kota",fields:[a,t,r,s]},{slug:"kecamatan",title:"Kecamatan",fields:[a,t,r,s]},{slug:"desa",title:"Desa/Kelurahan",fields:[a,t,r,s]}].map(e=>[e.slug,{...e,endpoint:`/master/${e.slug}`}])),l=["jenis-kejahatan","golongan-kejahatan","kategori-lokasi","modus-operandi","motif-kejahatan","iccs-kategori","undang-undang"],i=Object.values(n).filter(e=>!l.includes(e.slug));e.s(["MASTERS",0,n,"MASTER_LIST",0,i])},73670,e=>{"use strict";let a=(0,e.i(56420).default)("user-cog",[["path",{d:"M10 15H6a4 4 0 0 0-4 4v2",key:"1nfge6"}],["path",{d:"m14.305 16.53.923-.382",key:"1itpsq"}],["path",{d:"m15.228 13.852-.923-.383",key:"eplpkm"}],["path",{d:"m16.852 12.228-.383-.923",key:"13v3q0"}],["path",{d:"m16.852 17.772-.383.924",key:"1i8mnm"}],["path",{d:"m19.148 12.228.383-.923",key:"1q8j1v"}],["path",{d:"m19.53 18.696-.382-.924",key:"vk1qj3"}],["path",{d:"m20.772 13.852.924-.383",key:"n880s0"}],["path",{d:"m20.772 16.148.924.383",key:"1g6xey"}],["circle",{cx:"18",cy:"15",r:"3",key:"gjjjvw"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}]]);e.s(["UserCog",0,a],73670)},81539,e=>{"use strict";let a=["superadmin","admin_binops","operator","viewer","sharese"],t=["superadmin","admin_binops"],r=["superadmin"],s=[{label:"Dashboard",items:[{key:"ringkasan",label:"Ringkasan",icon:"pi pi-fw pi-home",to:"/cms/dashboard/main",defaultRoles:a},{key:"peta-kejahatan",label:"Peta Kejahatan",icon:"pi pi-fw pi-map",to:"/cms/dashboard/main?view=peta-kejahatan",defaultRoles:a}]},{label:"Sharese",items:[{key:"profil",label:"Profile",icon:"pi pi-fw pi-user",to:"/cms/profile",defaultRoles:a},{key:"jukrahcaster",label:"Feed",icon:"pi pi-fw pi-globe",to:"/cms/broadcaster",defaultRoles:a},{key:"sharese-obrolan",label:"Obrolan",icon:"pi pi-fw pi-comments",to:"/cms/broadcaster?view=obrolan",defaultRoles:a},{key:"sharese-koneksi",label:"Koneksi",icon:"pi pi-fw pi-users",to:"/cms/broadcaster?view=koneksi",defaultRoles:a},{key:"sharese-notifikasi",label:"Notifikasi",icon:"pi pi-fw pi-bell",to:"/cms/broadcaster?view=notifikasi",defaultRoles:a},{key:"sharese-insight",label:"Insight",icon:"pi pi-fw pi-chart-line",to:"/cms/broadcaster?view=insight",defaultRoles:a},{key:"kelola-jukrahcaster",label:"Moderasi",icon:"pi pi-fw pi-megaphone",to:"/cms/pengumuman",defaultRoles:t},{key:"sharese-keamanan",label:"Keamanan",icon:"pi pi-fw pi-shield",to:"/cms/profile?view=keamanan",defaultRoles:a}]},{label:"Laporan",items:[{key:"laporan-polisi",label:"Laporan Polisi",icon:"pi pi-fw pi-file-check",to:"/cms/laporan-polisi",defaultRoles:a,children:[{key:"laporan-polisi-list",label:"Daftar LP",icon:"pi pi-fw pi-list",to:"/cms/laporan-polisi",defaultRoles:a},{key:"arsip-lp-pelimpahan",label:"Arsip Limpah",icon:"pi pi-fw pi-history",to:"/cms/laporan-polisi/arsip-pelimpahan",defaultRoles:a}]},{key:"kinerja-perkara",label:"Kinerja Perkara",icon:"pi pi-fw pi-gauge",to:"/cms/report/kinerja-perkara",defaultRoles:a},{key:"anev-ctcc",label:"Lamp. Anev Periodik",icon:"pi pi-fw pi-file-edit",to:"/cms/report/anev-ctcc",defaultRoles:a}]},{label:"Register",items:[{key:"rekap-pihak",label:"Pihak Terlibat",icon:"pi pi-fw pi-users",to:"/cms/laporan/rekap-pihak-terlibat",defaultRoles:a},{key:"pihak-sering",label:"Pihak Sering Terlibat",icon:"pi pi-fw pi-sitemap",to:"/cms/laporan/pihak-sering-terlibat",defaultRoles:a},{key:"rekap-bb",label:"Barang Bukti",icon:"pi pi-fw pi-box",to:"/cms/laporan/rekap-barang-bukti",defaultRoles:a}]},{label:"Susopsgas",items:[{key:"kasus-menonjol-lihat",label:"Rekap",icon:"pi pi-fw pi-flag",to:"/cms/laporan/kasus-menonjol/lihat",defaultRoles:a},{key:"kasus-menonjol",label:"Kelola",icon:"pi pi-fw pi-cog",to:"/cms/laporan/kasus-menonjol",defaultRoles:a}]},{label:"Portal Integrasi",items:[{key:"dors",label:"Masuk",icon:"pi pi-fw pi-sign-in",to:"/cms/integrasi/dors",defaultRoles:t,children:[{key:"dors-monitor",label:"Tarik Data",icon:"pi pi-fw pi-sync",to:"/cms/integrasi/dors",defaultRoles:t},{key:"dors-data",label:"Staging",icon:"pi pi-fw pi-database",to:"/cms/integrasi/dors-data",defaultRoles:t},{key:"dors-unmapped",label:"Import ke Database",icon:"pi pi-fw pi-exclamation-triangle",to:"/cms/integrasi/dors-unmapped",defaultRoles:t},{key:"satker-legacy",label:"Cek Duplikat",icon:"pi pi-fw pi-sitemap",to:"/cms/integrasi/satker-legacy",defaultRoles:t},{key:"master-data-gap",label:"Master Tidak Termapping",icon:"pi pi-fw pi-exclamation-circle",to:"/cms/integrasi/master-data-gap",defaultRoles:t}]},{key:"integrasi-portal-keluar",label:"Keluar",icon:"pi pi-fw pi-key",to:"/cms/integrasi/portal-keluar",defaultRoles:r}]},{label:"Audit",items:[{key:"audit-log",label:"Log Audit",icon:"pi pi-fw pi-history",to:"/cms/audit-log",defaultRoles:t},{key:"uji-beban",label:"Uji Beban (Server Prod)",icon:"pi pi-fw pi-bolt",to:"/cms/audit-log/uji-beban",defaultRoles:r}]},{label:"Master Data",items:[{key:"master-pengguna",label:"Pengguna",icon:"pi pi-fw pi-users",to:"/cms/master/user",defaultRoles:[...t,"operator"]},{key:"master-satker",label:"Satker",icon:"pi pi-fw pi-sitemap",to:"/cms/master/satker-tree",defaultRoles:t,children:[{key:"master-satker-tree",label:"Struktur Satker (Puskarda)",icon:"pi pi-fw pi-share-alt",to:"/cms/master/satker-tree",defaultRoles:t},{key:"master-satker-eksternal",label:"Satker Eksternal",icon:"pi pi-fw pi-building",to:"/cms/master/satker-eksternal",defaultRoles:t}]},{key:"master-referensi",label:"Master Referensi",icon:"pi pi-fw pi-database",to:"/cms/master-ref",defaultRoles:t}]},{label:"Kerja Sama",items:[{key:"kerma-lihat",label:"Rekap",icon:"pi pi-fw pi-briefcase",to:"/cms/kerma/lihat",defaultRoles:a},{key:"kerma-kelola",label:"Kelola",icon:"pi pi-fw pi-cog",to:"/cms/kerma",defaultRoles:t}]},{label:"Panduan Pengguna",items:[{key:"panduan-lihat",label:"Rekap",icon:"pi pi-fw pi-book",to:"/cms/panduan",defaultRoles:a},{key:"panduan-kelola",label:"Kelola",icon:"pi pi-fw pi-cog",to:"/cms/panduan?mode=kelola",defaultRoles:t}]},{label:"Sistem",items:[{key:"pusat-bantuan",label:"Pusat Bantuan",icon:"pi pi-fw pi-question-circle",to:"/cms/broadcaster?view=pusat-bantuan",defaultRoles:a},{key:"kelola-pengaturan",label:"Kelola Pengaturan",icon:"pi pi-fw pi-sliders-h",to:"/cms/pengaturan/email",defaultRoles:t}]}];e.s(["MENU_CATALOG",0,s,"isMenuAllowed",0,function(e,a,t,r){if(r||a==="vendor_mitra"||a==="vendor"||a==="mitra")return!0;if(e.key==="pusat-bantuan"||e.key==="peta-kejahatan"||e.key&&e.key.startsWith("sharese-"))return e.defaultRoles.includes(a);if(e.key==="kelola-pengaturan"){let k=t.get(`${a}|kelola-pengaturan`);if(void 0!==k)return k;let em=t.get(`${a}|email-smtp`);return void 0!==em?em:e.defaultRoles.includes(a)}let s=t.get(`${a}|${e.key}`);return void 0!==s?s:e.defaultRoles.includes(a)}])},93989,e=>{"use strict";var a=e.i(43476),t=e.i(71645),r=e.i(18566),s=e.i(22016),n=e.i(45868);function useCasLocationSearch(){let[q,setQ]=(0,t.useState)(()=>"undefined"!=typeof window?window.location.search||"":"");return(0,t.useEffect)(()=>{if("undefined"==typeof window)return;if(!window.__casHistPatched){window.__casHistPatched=!0;let origPush=history.pushState,origReplace=history.replaceState;history.pushState=function(){let res=origPush.apply(this,arguments);try{window.dispatchEvent(new Event("cas-url-change"))}catch{}return res};history.replaceState=function(){let res=origReplace.apply(this,arguments);try{window.dispatchEvent(new Event("cas-url-change"))}catch{}return res}}let sync=()=>setQ(window.location.search||""),onSideNav=ev=>{let h=ev?.detail?.href;if(typeof h==="string"){let idx=h.indexOf("?");setQ(idx>=0?h.slice(idx):"")}sync()},delayed=()=>{setTimeout(sync,15);setTimeout(sync,60);setTimeout(sync,150);setTimeout(sync,300)};sync();window.addEventListener("cas-url-change",sync);window.addEventListener("cas:sidebar-navigate",onSideNav);window.addEventListener("popstate",sync);document.addEventListener("click",delayed,!0);return()=>{window.removeEventListener("cas-url-change",sync);window.removeEventListener("cas:sidebar-navigate",onSideNav);window.removeEventListener("popstate",sync);document.removeEventListener("click",delayed,!0)}},[]),q}function casNav(router,href){if("undefined"!=typeof window&&router){try{window.dispatchEvent(new CustomEvent("cas:sidebar-navigate",{detail:{href}}))}catch{}router.push(href);[15,60,150,300].forEach(ms=>setTimeout(()=>{try{window.dispatchEvent(new Event("cas-url-change"))}catch{}},ms))}}function l({sections:e,open:t,onNavigate:o}){let c=(0,r.usePathname)(),q=useCasLocationSearch(),sp=new URLSearchParams(q||""),sysSettingPaths=["/cms/pengaturan/email","/cms/pengaturan/login-otp","/cms/pengaturan/maintenance","/cms/pengaturan/pusat-bantuan","/cms/master/alur-dokumen","/cms/master/organisasi-role","/cms/master/menu"],u=itemTo=>{if(!itemTo)return!1;if(itemTo.includes("?")){let[p,qs]=itemTo.split("?");if(c!==p&&!(p==="/cms/dashboard/main"&&(c==="/cms/dashboard"||c==="/cms/dashboard/heatmap")))return!1;if(c==="/cms/dashboard/heatmap"&&itemTo==="/cms/dashboard/main?view=peta-kejahatan")return!0;let isp=new URLSearchParams(qs);for(let[k,v]of isp.entries())if(sp.get(k)!==v)return!1;return!0}if(itemTo==="/cms/pengaturan/email"&&sysSettingPaths.some(p=>c===p||c.startsWith(p+"/")))return!0;if(itemTo==="/cms/laporan/kasus-menonjol/lihat"&&(c==="/cms/laporan/kasus-menonjol/lihat"||c==="/cms/laporan/kasus-atensi/lihat"||c==="/cms/laporan/rekap-operasi-satgas"))return!0;if(itemTo==="/cms/laporan/kasus-menonjol"){return c==="/cms/laporan/kasus-menonjol"||c==="/cms/laporan/kasus-atensi"||c==="/cms/master/operasi-satgas"}if(itemTo==="/cms/laporan-polisi"&&c==="/cms/laporan-polisi/arsip-pelimpahan")return!1;if(itemTo==="/cms/panduan"&&c==="/cms/panduan/kelola")return!1;if(itemTo==="/cms/panduan?mode=kelola"&&c==="/cms/panduan/kelola")return!0;if((itemTo==="/cms/broadcaster"||itemTo==="/cms/profile"||itemTo==="/cms/dashboard/main"||itemTo==="/cms/dashboard")&&sp.get("view"))return!1;if(itemTo==="/cms/panduan"&&sp.get("mode")==="kelola")return!1;return c===itemTo||c.startsWith(itemTo+"/")},d=(()=>{let a=null;for(let t of e)for(let e of t.items){if(u(e.to)&&(!a||e.to.includes("?")&&!a.includes("?")||e.to.length>a.length))a=e.to;for(let t of e.children||[])if(u(t.to)&&(!a||t.to.includes("?")&&!a.includes("?")||t.to.length>a.length))a=t.to}return a})(),p=e=>(e.children||[]).some(e=>e.to===d);return(0,a.jsxs)("aside",{className:`cms-sidebar${t?" cms-sidebar-open":""}`,children:[(0,a.jsxs)("div",{className:"cms-brand",children:[(0,a.jsx)("img",{src:"/bdb-mark.svg",alt:"BDB",className:"cms-brand-logo-img"}),(0,a.jsx)("div",{children:(0,a.jsx)("div",{className:"cms-brand-name",children:"BIG DATA BINOPS"})})]}),(0,a.jsx)("nav",{className:"cms-menu",children:e.map(e=>(0,a.jsxs)("div",{className:"cms-menu-section",children:[(0,a.jsx)("div",{className:"cms-menu-title",children:e.label}),e.items.map(e=>e.children&&e.children.length?(0,a.jsx)(i,{id:"fld-0-gigr76s0g8t-1",name:"field_0_gigr76s0g8t_1",item:e,childActive:p,activeChildTo:d,onNavigate:o},e.label):(0,a.jsxs)(s.default,{href:e.to,prefetch:!1,className:`cms-menu-item${e.to===d?" active":""}`,onClick:()=>{o&&o();try{window.dispatchEvent(new CustomEvent("cas:sidebar-navigate",{detail:{href:e.to}}))}catch{}[15,60,150,300].forEach(ms=>setTimeout(()=>{try{window.dispatchEvent(new Event("cas-url-change"))}catch{}},ms))},children:[(0,a.jsx)("i",{className:e.icon}),(0,a.jsx)("span",{children:e.label})]},e.to))]},e.label))}),(0,a.jsxs)("div",{className:"cms-sidebar-version",children:["BDB v",n.APP_VERSION]})]})}function i({item:e,childActive:r,activeChildTo:n,onNavigate:l}){let o=r(e),[c,u]=(0,t.useState)(o),d=c||o;return(0,a.jsxs)("div",{className:"cms-menu-group",children:[(0,a.jsxs)("button",{type:"button",className:`cms-menu-item cms-menu-parent${o?" active-parent":""}`,onClick:()=>u(e=>!e),"aria-expanded":d,children:[(0,a.jsx)("i",{className:e.icon}),(0,a.jsx)("span",{children:e.label}),(0,a.jsx)("i",{className:`pi pi-angle-${d?"down":"right"} cms-menu-caret`})]}),d&&(0,a.jsx)("div",{className:"cms-submenu",children:(e.children||[]).map(e=>(0,a.jsxs)(s.default,{href:e.to,prefetch:!1,className:`cms-menu-item cms-submenu-item${e.to===n?" active":""}`,onClick:l,children:[(0,a.jsx)("i",{className:e.icon}),(0,a.jsx)("span",{children:e.label})]},e.to))})]})}var o=e.i(56420);let c=(0,o.default)("menu",[["path",{d:"M4 5h16",key:"1tepv9"}],["path",{d:"M4 12h16",key:"1lakjw"}],["path",{d:"M4 19h16",key:"1djgab"}]]),u=(0,o.default)("sun",[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]]),d=(0,o.default)("moon",[["path",{d:"M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",key:"kfwtm"}]]),p=(0,o.default)("wifi",[["path",{d:"M12 20h.01",key:"zekei9"}],["path",{d:"M2 8.82a15 15 0 0 1 20 0",key:"dnpr2z"}],["path",{d:"M5 12.859a10 10 0 0 1 14 0",key:"1x1e6c"}],["path",{d:"M8.5 16.429a5 5 0 0 1 7 0",key:"1bycff"}]]),m=(0,o.default)("wifi-off",[["path",{d:"M12 20h.01",key:"zekei9"}],["path",{d:"M8.5 16.429a5 5 0 0 1 7 0",key:"1bycff"}],["path",{d:"M5 12.859a10 10 0 0 1 5.17-2.69",key:"1dl1wf"}],["path",{d:"M19 12.859a10 10 0 0 0-2.007-1.523",key:"4k23kn"}],["path",{d:"M2 8.82a15 15 0 0 1 4.177-2.643",key:"1grhjp"}],["path",{d:"M22 8.82a15 15 0 0 0-11.288-3.764",key:"z3jwby"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]]),f=(0,o.default)("wifi-low",[["path",{d:"M12 20h.01",key:"zekei9"}],["path",{d:"M8.5 16.429a5 5 0 0 1 7 0",key:"1bycff"}]]),h=(0,o.default)("log-out",[["path",{d:"m16 17 5-5-5-5",key:"1bji2h"}],["path",{d:"M21 12H9",key:"dn1m92"}],["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}]]),g=(0,o.default)("panel-left",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M9 3v18",key:"fh3hqa"}]]),k=(0,o.default)("arrow-down",[["path",{d:"M12 5v14",key:"s699le"}],["path",{d:"m19 12-7 7-7-7",key:"1idqje"}]]),b=(0,o.default)("arrow-up",[["path",{d:"m5 12 7-7 7 7",key:"hav0vg"}],["path",{d:"M12 19V5",key:"x0mq9r"}]]);var y=e.i(71028);let j=(0,o.default)("bell",[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}]]);var v=e.i(65489),S=e.i(31458);let w=(0,o.default)("shield",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}]]);var x=e.i(41120),R=e.i(38036),M=e.i(54858),_=e.i(9573);let N={jukrah:(0,a.jsx)(j,{size:15}),satgas:(0,a.jsx)(w,{id:"fld-0-gigr76s0g8t-2",name:"field_0_gigr76s0g8t_2",size:15}),operasi:(0,a.jsx)(j,{size:15})},P={excellent:"Sangat Baik",good:"Baik",weak:"Lemah",poor:"Sangat Lemah",offline:"Offline"};async function C(){if(!navigator.onLine)return null;try{if(navigator.connection&&typeof navigator.connection.rtt==="number"&&navigator.connection.rtt>0)return Math.max(12,Math.round(navigator.connection.rtt));let e=new AbortController,a=setTimeout(()=>e.abort(),3500),t=performance.now();return await fetch(`/bdb-mark.svg?_=${Date.now()}`,{method:"HEAD",signal:e.signal,cache:"no-store"}),clearTimeout(a),Math.max(8,Math.round(performance.now()-t))}catch{return 28}}async function A(e){try{if(navigator.connection&&typeof navigator.connection.downlink==="number"&&navigator.connection.downlink>0){let dl=navigator.connection.downlink;return"down"===e?Math.round(dl*10)/10:Math.round(dl*0.65*10)/10}let a=new AbortController,t=setTimeout(()=>a.abort(),4e3),r=performance.now();let res=await fetch(`/bdb-mark.svg?_=${Date.now()}`,{signal:a.signal,cache:"no-store"});let s=(await res.arrayBuffer()).byteLength||4096;clearTimeout(t);let n=Math.max(0.005,(performance.now()-r)/1e3);let mbps=Math.min(100,Math.max(5,Math.round(8*s/n/1e6*10)/10));return"down"===e?mbps:Math.round(mbps*0.7*10)/10}catch{return"down"===e?24.5:12.4}}
function formatCallsign(rawCallsign, authorId, username) {
  var idStr = String(authorId || '');
  /* dynamic handle */
  var c = String(rawCallsign || '').trim().replace(/^@/, '');
  var invalid = ['personil', 'null', 'undefined', 'admin', 'user', 'none', '-', 'anak_serse'];
  if (c && !invalid.includes(c.toLowerCase()) && !/^\d{6,10}$/.test(c)) {
    return '@' + c;
  }
  var u = String(username || '').trim().replace(/^@/, '');
  if (u && !invalid.includes(u.toLowerCase()) && !/^\d{6,10}$/.test(u)) {
    return '@' + u;
  }
  if (!idStr && !rawCallsign && !username) {
    try {
      var lu = JSON.parse(localStorage.getItem('user') || '{}');
      /* dynamic handle */
      if (lu.callsign && !String(lu.callsign).startsWith('user_')) return '@' + String(lu.callsign).replace(/^@/, '');
      if (lu.name && String(lu.name).trim()) return lu.name;
      if (lu.username && !String(lu.username).startsWith('user_')) return '@' + String(lu.username).replace(/^@/, '');
    } catch(e) {}
    return '@personil';
  }
  var seed = idStr || 'polri';
  var num = 0;
  for (var i = 0; i < seed.length; i++) num = (num * 31 + seed.charCodeAt(i)) % 100000;
  var code = Math.abs((num * 9301 + 49297) % 65536).toString(16).padStart(4, '0');
  return '@user_' + (idStr || '0') + code;
}

function formatUserCallsign(u) {
  const raw = String(u?.username || u?.callsign || '').trim().replace(/^@/, '');
  if (raw && !['personil', 'null', 'undefined', '-'].includes(raw.toLowerCase())) return '@' + raw;
  if (!u?.id && !u?.user_id) return '';
  const seed = String(u.id || u.user_id);
  let num = 0;
  for (let i = 0; i < seed.length; i++) num = (num * 31 + seed.charCodeAt(i)) % 100000;
  const code = Math.abs((num * 9301 + 49297) % 65536).toString(16).padStart(4, '0');
  return '@user_' + seed + code;
}

function toTitleCase(str) {
  if (!str) return '';
  return String(str)
    .replace(/\bPAPUA\s+BARAT\s+DAYA\b/gi, 'Pabardaya')
    .replace(/\bPABD\b/gi, 'Pabardaya')
    .replace(/\bPAPUA\s+TENGAH\b/gi, 'Papteng')
    .replace(/\bPATENG\b/gi, 'Papteng')
    .replace(/\bKAWASAN\s+PELABUHAN\b/gi, 'K.P.')
    .replace(/\bKP3\b/gi, 'K.P.')
    .replace(/\bKAWASAN\s+BANDARA\b/gi, 'K.B.')
    .replace(/\bTANJUNG\b/gi, 'Tj.')
    .replace(/\bKEPULAUAN\b/gi, 'Kep.')
    .replace(/\bPULAU\b/gi, 'P.')
    .toLowerCase()
    .replace(/(?:^|\s|-|\/)[a-z]/g, function(c) {
      return c.toUpperCase();
    })
    .replace(/\bS\.h\b/gi, 'S.H')
    .replace(/\bM\.h\b/gi, 'M.H')
    .replace(/\bS\.i\.k\b/gi, 'S.I.K')
    .replace(/\bK\.p\./gi, 'K.P.')
    .replace(/\bK\.b\./gi, 'K.B.')
    .replace(/\bTj\./gi, 'Tj.')
    .replace(/\bKep\./gi, 'Kep.')
    .replace(/\bP\./gi, 'P.')
    .replace(/\bPolri\b/gi, 'Polri')
    .replace(/\bPolda\b/gi, 'Polda')
    .replace(/\bPolres\b/gi, 'Res')
    .replace(/\bPolsek\b/gi, 'Sek')
    .replace(/\bSat\b/gi, 'Sat')
    .replace(/\bDit\b/gi, 'Dit')
    .replace(/\bRes\b/gi, 'Res')
    .replace(/\bReskrim\b/gi, 'Reskrim')
    .replace(/\bNarkoba\b/gi, 'Narkoba');
}

function decodeCasShareHash(raw) {
  var s = String(raw || "").trim();
  if (!s) return { raw: "", postId: null, isSpToken: false };
  if (/^\d+$/.test(s)) return { raw: s, postId: parseInt(s, 10), isSpToken: false };
  try {
    var b64 = s.replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4 !== 0) b64 += "=";
    var dec = atob(b64);
    if (dec.indexOf("sp.") === 0) {
      var parts = dec.split(".");
      var pid = parseInt(parts[1], 10);
      if (!isNaN(pid) && pid > 0) return { raw: s, postId: pid, isSpToken: true };
    }
    var mPref = dec.match(/^(?:sharese|post|jukrah)[:._-](\d+)/i);
    if (mPref && mPref[1]) return { raw: s, postId: parseInt(mPref[1], 10), isSpToken: false };
    if (/^\d+$/.test(dec.trim())) return { raw: s, postId: parseInt(dec.trim(), 10), isSpToken: false };
  } catch (_e) {}
  if (/^[0-9a-f]+$/i.test(s) && s.length <= 12) {
    var hexId = parseInt(s, 16);
    if (!isNaN(hexId) && hexId > 0) return { raw: s, postId: hexId, isSpToken: false };
  }
  return { raw: s, postId: null, isSpToken: false };
}

function encodeCasShareHash(postOrId) {
  if (!postOrId) return "";
  if (typeof postOrId === "object") {
    if (postOrId.share_hash) return String(postOrId.share_hash);
    if (postOrId.share_token) return String(postOrId.share_token);
  }
  var idVal = typeof postOrId === "object" ? postOrId.id : postOrId;
  if (!idVal) return "";
  try {
    return btoa("sharese:" + String(idVal)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  } catch (_e) {
    return Number(idVal) ? Number(idVal).toString(16) : String(idVal);
  }
}

if (typeof window !== "undefined") {
  window.__decodeCasShareHash = decodeCasShareHash;
  window.__encodeCasShareHash = encodeCasShareHash;
}

function initCasExpensivePcHpStandards() {
  if (typeof document === "undefined" || !document.head) return;
  if (!document.getElementById("cas-expensive-pc-hp-styles")) {
    var st = document.createElement("style");
    st.id = "cas-expensive-pc-hp-styles";
    st.textContent = [
      "/* 1EfVEH9N4A: Non-Wrapping Tabular KPI Numbers */",
      ".tabular-nums, td, th, [class*=\"kpi\"], [class*=\"stat\"], .cms-sidebar-sublink span {",
      "  font-variant-numeric: tabular-nums;",
      "}",
      "/* 1FPJYD3q6p, 1JPffo7BwR: Expensive Micro-Interactions */",
      "button {",
      "  transition: transform 120ms cubic-bezier(0.22, 1, 0.36, 1), background-color 150ms ease, border-color 150ms ease, box-shadow 150ms ease;",
      "}",
      "button:not(:disabled):active {",
      "  transform: scale(0.98);",
      "}",
      "/* Tab Panels & Card Content Anti-Mepet */",
      ".p-tabview .p-tabview-panels, .cas-tab-panel-body {",
      "  padding: 1.15rem 1.25rem !important;",
      "}",
      "button + table, .flex + table, .flex + .overflow-x-auto, .flex + .p-datatable, .cas-unified-filter-bar + .p-datatable, .cas-unified-filter-bar + table, .cas-unified-filter-bar + .overflow-x-auto {",
      "  margin-top: 0.75rem !important;",
      "}",
      ".p-datatable .p-datatable-header {",
      "  padding: 0.85rem 1.1rem !important;",
      "}",
      "/* Floating Chat Button Clearance (Prevent Overlapping Bottom-Right Table Action Icons) */",
      ".layout-main, .cms-main, .cms-content, main.cms-content {",
      "  padding-bottom: 5rem !important;",
      "}",
      "/* Anti-Offside Icons, Avatars & Brand Logos Across All Devices */",
      ".layout-sidebar img, .layout-topbar img, .cms-sidebar img, .cms-topbar img, .cas-avatar, .cms-user-avatar img, svg {",
      "  flex-shrink: 0;",
      "  max-width: 100%;",
      "}",
      "button, .p-button, .p-tag, .att-btn, .cms-icon-btn, .cms-status-btn {",
      "  box-sizing: border-box;",
      "  max-width: 100%;",
      "}",
      ".cms-brand, .layout-sidebar .cms-brand {",
      "  display: flex !important;",
      "  align-items: center !important;",
      "  gap: 0.65rem !important;",
      "  overflow: hidden !important;",
      "  box-sizing: border-box !important;",
      "}",
      ".cms-brand-logo-img, .layout-sidebar .cms-brand img, .cms-sidebar .cms-brand img {",
      "  width: 2.25rem !important;",
      "  height: 2.25rem !important;",
      "  min-width: 2.25rem !important;",
      "  max-width: 2.25rem !important;",
      "  object-fit: contain !important;",
      "  object-position: center !important;",
      "  flex-shrink: 0 !important;",
      "  display: block !important;",
      "}",
      ".cms-collapsed .cms-brand {",
      "  justify-content: center !important;",
      "  padding-left: 0.35rem !important;",
      "  padding-right: 0.35rem !important;",
      "}",
      ".cms-user-avatar, .cas-avatar {",
      "  flex-shrink: 0 !important;",
      "  overflow: hidden !important;",
      "  border-radius: 999px !important;",
      "}",
      ".cms-user-avatar img, .cas-avatar img {",
      "  width: 100% !important;",
      "  height: 100% !important;",
      "  object-fit: cover !important;",
      "  display: block !important;",
      "}",
      "/* Global Modal Popup & Form Input Uniformity */",
      ".p-dialog, .cas-modal {",
      "  max-width: min(94vw, 680px) !important;",
      "  margin: 12px auto !important;",
      "  border-radius: 14px !important;",
      "  overflow: hidden !important;",
      "  box-shadow: 0 20px 50px rgba(2, 6, 23, 0.35) !important;",
      "}",
      ".p-dialog.cas-dialog-wide, .cas-modal.cas-modal-wide {",
      "  max-width: min(95vw, 1180px) !important;",
      "}",
      ".p-dialog.p-dialog-maximized, .cas-modal.cas-modal-maximized {",
      "  max-width: 100vw !important;",
      "  width: 100vw !important;",
      "  margin: 0 !important;",
      "  border-radius: 0 !important;",
      "}",
      ".p-dialog .p-dialog-header {",
      "  padding: 1.1rem 1.35rem !important;",
      "  border-bottom: 1px solid var(--cas-border, rgba(148,163,184,0.2)) !important;",
      "}",
      ".p-dialog .p-dialog-content {",
      "  padding: 1.25rem 1.35rem !important;",
      "}",
      ".p-dialog .p-dialog-footer {",
      "  padding: 0.9rem 1.35rem !important;",
      "  border-top: 1px solid var(--cas-border, rgba(148,163,184,0.2)) !important;",
      "  display: flex;",
      "  justify-content: flex-end;",
      "  gap: 0.6rem;",
      "  flex-wrap: wrap;",
      "}",
      ".p-dialog input:not([type=\"checkbox\"]):not([type=\"radio\"]), .p-dialog select, .p-dialog textarea, .p-inputtext, .p-dropdown {",
      "  border-radius: 8px !important;",
      "  padding: 0.55rem 0.75rem;",
      "  border: 1px solid var(--cas-border-strong, rgba(148, 163, 184, 0.38)) !important;",
      "  box-sizing: border-box !important;",
      "  transition: border-color 150ms ease, box-shadow 150ms ease !important;",
      "}",
      ".p-dropdown .p-dropdown-label.p-inputtext {",
      "  border: none !important;",
      "  box-shadow: none !important;",
      "  background: transparent !important;",
      "  padding: 0.35rem 0.65rem !important;",
      "}",
      ".p-dialog input:not([type=\"checkbox\"]):not([type=\"radio\"]):focus, .p-dialog select:focus, .p-dialog textarea:focus, .p-inputtext:focus, .p-dropdown:focus, .p-dropdown.p-focus, .p-inputwrapper-focus {",
      "  border-color: #2563eb !important;",
      "  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15) !important;",
      "  outline: none !important;",
      "}",
      "/* Tablet (640px - 1024px) Specific Rules */",
      "@media (min-width: 640px) and (max-width: 1024px) {",
      "  .cms-topbar, .layout-topbar {",
      "    padding: 0 0.85rem !important;",
      "    gap: 0.45rem !important;",
      "  }",
      "  .cms-user-role {",
      "    max-width: 140px !important;",
      "    overflow: hidden !important;",
      "    text-overflow: ellipsis !important;",
      "    white-space: nowrap !important;",
      "  }",
      "  .p-dialog, .cas-modal {",
      "    max-width: min(92vw, 660px) !important;",
      "  }",
      "}",
      "/* 1EfVEH9N4A, 19ywQ9Mrju, 1K8hKD3gAB: PC vs HP Responsive Standards */",
      "@media (max-width: 640px) {",
      "  input:not([type=\"checkbox\"]):not([type=\"radio\"]), select, textarea {",
      "    font-size: 16px !important;",
      "  }",
      "  .cms-content table, .cms-main table, .p-datatable-wrapper {",
      "    -webkit-overflow-scrolling: touch;",
      "    overscroll-behavior-x: contain;",
      "  }",
      "  .cms-topbar, .layout-topbar {",
      "    max-width: 100vw !important;",
      "    box-sizing: border-box !important;",
      "  }",
      "  .cms-collapse-btn, .cms-status-btn span {",
      "    display: none !important;",
      "  }",
      "  .cms-status-btn {",
      "    padding: 0.35rem !important;",
      "    min-width: 32px !important;",
      "    justify-content: center !important;",
      "  }",
      "  .cms-icon-btn {",
      "    width: 32px !important;",
      "    height: 32px !important;",
      "    min-width: 32px !important;",
      "    padding: 0 !important;",
      "    flex-shrink: 0 !important;",
      "  }",
      "  .cms-user {",
      "    gap: 0.35rem !important;",
      "    flex-shrink: 0 !important;",
      "    min-width: 0 !important;",
      "  }",
      "  .cms-logout {",
      "    padding: 0.32rem 0.5rem !important;",
      "    font-size: 0.72rem !important;",
      "    flex-shrink: 0 !important;",
      "  }",
      "  .cms-status-pop {",
      "    position: fixed !important;",
      "    left: 0.5rem !important;",
      "    right: 0.5rem !important;",
      "    top: 3.6rem !important;",
      "    width: auto !important;",
      "    max-width: calc(100vw - 1rem) !important;",
      "    box-sizing: border-box !important;",
      "  }",
      "  .p-dialog, [role=\"dialog\"], .cas-confirm-modal-card, .cas-sharese-gate-card {",
      "    padding-bottom: max(16px, env(safe-area-inset-bottom));",
      "  }",
      "  .cas-sharese-gate-card {",
      "    padding: 1.1rem 0.9rem !important;",
      "    border-radius: 14px !important;",
      "  }",
      "}",
      "/* Flip Phones & Folded Screens (280px - 370px) */",
      "@media (max-width: 370px) {",
      "  .cms-topbar, .layout-topbar {",
      "    padding: 0 0.35rem !important;",
      "    gap: 0.2rem !important;",
      "    height: 3.15rem !important;",
      "    max-width: 100vw !important;",
      "    overflow: hidden !important;",
      "  }",
      "  .cms-hamburger, .cms-icon-btn, .cms-status-btn {",
      "    width: 28px !important;",
      "    height: 28px !important;",
      "    min-width: 28px !important;",
      "    min-height: 28px !important;",
      "    padding: 0 !important;",
      "    flex-shrink: 0 !important;",
      "  }",
      "  .cms-user-avatar {",
      "    width: 1.65rem !important;",
      "    height: 1.65rem !important;",
      "    min-width: 1.65rem !important;",
      "  }",
      "  .cms-user {",
      "    gap: 0.22rem !important;",
      "  }",
      "  .cms-logout {",
      "    padding: 0.24rem 0.4rem !important;",
      "    font-size: 0.68rem !important;",
      "    gap: 0.2rem !important;",
      "    min-height: 28px !important;",
      "    flex-shrink: 0 !important;",
      "  }",
      "  .cms-logout .cas-logout-icon {",
      "    width: 13px !important;",
      "    height: 13px !important;",
      "  }",
      "  .cms-content, .layout-main {",
      "    padding-left: 0.45rem !important;",
      "    padding-right: 0.45rem !important;",
      "    padding-bottom: 5rem !important;",
      "    overflow-x: hidden !important;",
      "  }",
      "  .cms-page-title {",
      "    font-size: 0.95rem !important;",
      "    line-height: 1.25 !important;",
      "    word-break: break-word !important;",
      "  }",
      "  .p-dialog, [role=\"dialog\"], .cas-modal, .cas-confirm-modal-card, .cas-sharese-gate-card {",
      "    max-width: calc(100vw - 12px) !important;",
      "    padding: 0.85rem !important;",
      "    margin: 6px auto !important;",
      "    box-sizing: border-box !important;",
      "    border-radius: 12px !important;",
      "  }",
      "  .p-dialog .p-dialog-header, .p-dialog .p-dialog-content, .p-dialog .p-dialog-footer {",
      "    padding: 0.85rem !important;",
      "  }",
      "  .p-dialog .p-dialog-footer > button, .p-dialog .p-dialog-footer .p-button {",
      "    width: 100% !important;",
      "    justify-content: center !important;",
      "  }",
      "  .cas-sharese-gate-grid, .cas-sharese-captcha-row, .cas-sharese-header-row {",
      "    flex-direction: column !important;",
      "    align-items: stretch !important;",
      "    grid-template-columns: 1fr !important;",
      "  }",
      "  .cas-sharese-captcha-img {",
      "    width: 100% !important;",
      "    max-width: 190px !important;",
      "    margin: 0 auto !important;",
      "  }",
      "  .cas-sharese-viewer-wrap {",
      "    padding: 0.6rem 0.35rem 2rem !important;",
      "  }",
      "}",
      "@media (pointer: coarse) {",
      "  button:not(.cms-NotifItem), .cms-sidebar-link, .cms-sidebar-sublink {",
      "    min-height: 38px;",
      "  }",
      "}",
      "/* 1D9M28ZPyu: Animated Log Out Button + Anti-Offside Topbar & Brand Alignment */",
      ".cms-topbar .cms-logout, button.cms-logout, .cms-logout {",
      "  width: auto !important;",
      "  min-width: max-content !important;",
      "  height: 2.2rem !important;",
      "  padding: 0 0.8rem !important;",
      "  display: inline-flex !important;",
      "  align-items: center !important;",
      "  justify-content: center !important;",
      "  gap: 0.38rem !important;",
      "  white-space: nowrap !important;",
      "  flex-shrink: 0 !important;",
      "  overflow: visible !important;",
      "  border-radius: 0.5rem !important;",
      "  box-sizing: border-box !important;",
      "  transition: transform 120ms cubic-bezier(0.22, 1, 0.36, 1), background-color 180ms ease, border-color 180ms ease, box-shadow 180ms ease, color 180ms ease;",
      "}",
      ".cms-logout .cas-logout-label {",
      "  display: inline-block !important;",
      "  white-space: nowrap !important;",
      "  overflow: visible !important;",
      "  line-height: 1.2 !important;",
      "}",
      "@media (max-width: 768px) {",
      "  .cms-topbar .cms-logout, button.cms-logout, .cms-logout {",
      "    width: auto !important;",
      "    min-width: max-content !important;",
      "    height: 2.05rem !important;",
      "    padding: 0 0.65rem !important;",
      "    font-size: 0.74rem !important;",
      "  }",
      "}",
      "@media (max-width: 640px) {",
      "  .cms-topbar .cms-logout, button.cms-logout, .cms-logout {",
      "    width: auto !important;",
      "    min-width: max-content !important;",
      "    height: 2rem !important;",
      "    padding: 0 0.58rem !important;",
      "  }",
      "}",
      ".cms-sidebar .cms-brand, .cms-topbar {",
      "  height: 3.75rem !important;",
      "  min-height: 3.75rem !important;",
      "  max-height: 3.75rem !important;",
      "  box-sizing: border-box !important;",
      "  border-bottom: 1px solid var(--cas-border, #e2e8f0) !important;",
      "}",
      "@media (max-width: 768px) {",
      "  .cms-sidebar .cms-brand, .cms-topbar {",
      "    height: 3.5rem !important;",
      "    min-height: 3.5rem !important;",
      "    max-height: 3.5rem !important;",
      "  }",
      "}",
      ".cms-main > .cms-content, main.cms-content, .cms-content {",
      "  padding-top: calc(var(--cms-header-h, 6.85rem) + 1.15rem) !important;",
      "}",
      "@media (max-width: 768px) {",
      "  .cms-main > .cms-content, main.cms-content, .cms-content {",
      "    padding-top: calc(var(--cms-header-h, 6.35rem) + 0.85rem) !important;",
      "  }",
      "}",
      ".cas-koneksi-bento-grid {",
      "  display: grid !important;",
      "  grid-template-columns: repeat(4, minmax(0, 1fr)) !important;",
      "  gap: 0.9rem !important;",
      "  align-items: stretch !important;",
      "}",
      "@media (max-width: 1199px) {",
      "  .cas-koneksi-bento-grid {",
      "    grid-template-columns: repeat(3, minmax(0, 1fr)) !important;",
      "  }",
      "}",
      "@media (max-width: 899px) {",
      "  .cas-koneksi-bento-grid {",
      "    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;",
      "  }",
      "}",
      "@media (max-width: 599px) {",
      "  .cas-koneksi-bento-grid {",
      "    grid-template-columns: minmax(0, 1fr) !important;",
      "  }",
      "}",
      ".cas-keamanan-bento-grid {",
      "  display: grid !important;",
      "  grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr) !important;",
      "  gap: 20px !important;",
      "  align-items: stretch !important;",
      "}",
      "@media (max-width: 900px) {",
      "  .cas-keamanan-bento-grid {",
      "    grid-template-columns: minmax(0, 1fr) !important;",
      "  }",
      "}",
      ".cms-logout .cas-logout-icon, .cms-logout .cas-logout-arrow {",
      "  transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1), opacity 220ms ease;",
      "}",
      ".cms-logout:hover .cas-logout-icon {",
      "  transform: translateX(2px);",
      "}",
      ".cms-logout.cas-logging-out {",
      "  background-color: rgba(239, 68, 68, 0.16) !important;",
      "  border-color: rgba(239, 68, 68, 0.55) !important;",
      "  color: #ef4444 !important;",
      "  box-shadow: 0 0 16px rgba(239, 68, 68, 0.42) !important;",
      "  transform: scale(0.97);",
      "}",
      ".cms-logout.cas-logging-out .cas-logout-icon {",
      "  transform: translateX(4px);",
      "}",
      ".cms-logout.cas-logging-out .cas-logout-arrow {",
      "  transform: translateX(6px);",
      "  opacity: 0.72;",
      "}",
      "/* 1F51AFQinZ: Sleek Animated Delete Confirmation Modal */",
      "@keyframes casTrashLid {",
      "  0% { transform: rotate(0deg); }",
      "  40% { transform: rotate(-18deg) translateY(-2px); }",
      "  100% { transform: rotate(0deg); }",
      "}",
      "@keyframes casConfirmIn {",
      "  0% { opacity: 0; transform: scale(0.94) translateY(6px); }",
      "  100% { opacity: 1; transform: scale(1) translateY(0); }",
      "}",
      ".cas-trash-lid-anim {",
      "  transform-origin: 6px 6px;",
      "  animation: casTrashLid 1.15s cubic-bezier(0.22, 1, 0.36, 1) infinite;",
      "}",
      ".cas-confirm-modal-card {",
      "  animation: casConfirmIn 180ms cubic-bezier(0.22, 1, 0.36, 1) forwards;",
      "  transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1), opacity 200ms ease;",
      "}",
      ".cas-confirm-modal-card.cas-deleting-shrink {",
      "  transform: scale(0.86) translateY(8px) !important;",
      "  opacity: 0 !important;",
      "}",
      "/* === GLOBAL THEME HARMONY (ANTI-BELANG-BELANG) & LEAFLET CLEANUP === */",
      ":root, html:not([data-theme=\"dark\"]):not(.dark) {",
      "  --cas-bg: #f8fafc;",
      "  --cas-card-bg: #ffffff;",
      "  --cas-surface-subtle: #f8fafc;",
      "  --cas-surface-hover: #f1f5f9;",
      "  --cas-border: #e2e8f0;",
      "  --cas-border-strong: #cbd5e1;",
      "  --cas-text-primary: #0f172a;",
      "  --cas-text-secondary: #334155;",
      "  --cas-text-muted: #64748b;",
      "  --cas-bg-card: #ffffff;",
      "  --cas-bg-surface: #ffffff;",
      "  --cas-bg-subtle: #f8fafc;",
      "  --cas-border-card: #e2e8f0;",
      "  --surface-card: #ffffff;",
      "  --surface-ground: #f8fafc;",
      "  --surface-50: #f8fafc;",
      "  --surface-100: #f1f5f9;",
      "  --surface-200: #e2e8f0;",
      "  --surface-border: #e2e8f0;",
      "  --surface-hover: #f1f5f9;",
      "  --text-color: #0f172a;",
      "  --text-color-secondary: #475569;",
      "}",
      "html[data-theme=\"dark\"], html.dark, body.cms-dark {",
      "  --cas-bg: #0b1120;",
      "  --cas-card-bg: #111c35;",
      "  --cas-surface-subtle: #16223f;",
      "  --cas-surface-hover: #1e293b;",
      "  --cas-border: rgba(148, 163, 184, 0.16);",
      "  --cas-border-strong: rgba(148, 163, 184, 0.28);",
      "  --cas-text-primary: #f8fafc;",
      "  --cas-text-secondary: #cbd5e1;",
      "  --cas-text-muted: #94a3b8;",
      "  --cas-bg-card: #111c35;",
      "  --cas-bg-surface: #111c35;",
      "  --cas-bg-subtle: #16223f;",
      "  --cas-border-card: rgba(148, 163, 184, 0.16);",
      "  --surface-card: #111c35;",
      "  --surface-ground: #0b1120;",
      "  --surface-50: #16223f;",
      "  --surface-100: #1e293b;",
      "  --surface-200: #334155;",
      "  --surface-border: rgba(148, 163, 184, 0.16);",
      "  --surface-hover: #1e293b;",
      "  --text-color: #f8fafc;",
      "  --text-color-secondary: #94a3b8;",
      "}",
      ".leaflet-control-attribution {",
      "  display: none !important;",
      "}",
      "/* Light Mode Anti-Belang-Belang Table Header & Sub-Card Harmonization */",
      "html:not([data-theme=\"dark\"]):not(.dark) .p-datatable .p-datatable-thead > tr > th,",
      "html:not([data-theme=\"dark\"]):not(.dark) .kp-tt .p-treetable-thead > tr:first-child > th,",
      "html:not([data-theme=\"dark\"]):not(.dark) .anev-tt .p-treetable-thead > tr:first-child > th,",
      "html:not([data-theme=\"dark\"]):not(.dark) .p-datatable .p-datatable-thead > tr > th.cas-freeze-col-1,",
      "html:not([data-theme=\"dark\"]):not(.dark) .p-datatable .p-datatable-thead > tr > th.cas-freeze-col-2,",
      "html:not([data-theme=\"dark\"]):not(.dark) .p-datatable .p-datatable-thead > tr > th.cas-sticky-col-1,",
      "html:not([data-theme=\"dark\"]):not(.dark) .p-datatable .p-datatable-thead > tr > th.cas-sticky-col-2,",
      "html:not([data-theme=\"dark\"]):not(.dark) .p-treetable .p-treetable-thead > tr > th.cas-freeze-col-1,",
      "html:not([data-theme=\"dark\"]):not(.dark) .p-treetable .p-treetable-thead > tr > th.cas-freeze-col-2,",
      "html:not([data-theme=\"dark\"]):not(.dark) .p-treetable .p-treetable-thead > tr > th.cas-sticky-col-1,",
      "html:not([data-theme=\"dark\"]):not(.dark) .p-treetable .p-treetable-thead > tr > th.cas-sticky-col-2,",
      "html:not([data-theme=\"dark\"]):not(.dark) .kp-tt.p-treetable .p-treetable-thead > tr:first-child > th:nth-child(1),",
      "html:not([data-theme=\"dark\"]):not(.dark) .kp-tt.p-treetable .p-treetable-thead > tr:first-child > th:nth-child(2),",
      "html:not([data-theme=\"dark\"]):not(.dark) .anev-tt.p-treetable .p-treetable-thead > tr:first-child > th:nth-child(1),",
      "html:not([data-theme=\"dark\"]):not(.dark) .anev-tt.p-treetable .p-treetable-thead > tr:first-child > th:nth-child(2),",
      "html:not([data-theme=\"dark\"]):not(.dark) .p-datatable table thead th.cas-sticky-col-1,",
      "html:not([data-theme=\"dark\"]):not(.dark) .p-datatable table thead th.cas-sticky-col-2,",
      "html:not([data-theme=\"dark\"]):not(.dark) .p-treetable table thead th.cas-sticky-col-1,",
      "html:not([data-theme=\"dark\"]):not(.dark) .p-treetable table thead th.cas-sticky-col-2 {",
      "  background-color: #f1f5f9 !important;",
      "  color: #0f172a !important;",
      "  border-color: #cbd5e1 !important;",
      "}",
      "html:not([data-theme=\"dark\"]):not(.dark) .kp-tt .p-treetable-thead > tr:nth-child(2) > th,",
      "html:not([data-theme=\"dark\"]):not(.dark) .anev-tt .p-treetable-thead > tr:nth-child(2) > th {",
      "  background-color: #f8fafc !important;",
      "  color: #334155 !important;",
      "  border-color: #cbd5e1 !important;",
      "}",
      "html:not([data-theme=\"dark\"]):not(.dark) .p-datatable .p-datatable-thead > tr > th .p-column-title,",
      "html:not([data-theme=\"dark\"]):not(.dark) .kp-tt .p-treetable-thead > tr > th .p-column-title,",
      "html:not([data-theme=\"dark\"]):not(.dark) .kp-tt .p-treetable-thead > tr > th .kp-label-with-tip > span:first-child {",
      "  color: #0f172a !important;",
      "}",
      "html:not([data-theme=\"dark\"]):not(.dark) .p-datatable .p-datatable-thead > tr > th .p-sortable-column-icon {",
      "  color: #64748b !important;",
      "}",
      "html:not([data-theme=\"dark\"]):not(.dark) .kp-info-badge.is-hdr1,",
      "html:not([data-theme=\"dark\"]):not(.dark) .kp-info-badge.is-hdr2 {",
      "  color: #2563eb !important;",
      "}",
      "html:not([data-theme=\"dark\"]):not(.dark) .cms-content div:not([style*=\"position: fixed\"]):not([style*=\"position:fixed\"]):not([style*=\"position: absolute\"]):not([style*=\"position:absolute\"]):not(.leaflet-container):not(#onlyoffice-iframe-container)[style*=\"rgba(15, 23, 42\"],",
      "html:not([data-theme=\"dark\"]):not(.dark) .cms-content div:not([style*=\"position: fixed\"]):not([style*=\"position:fixed\"]):not([style*=\"position: absolute\"]):not([style*=\"position:absolute\"]):not(.leaflet-container):not(#onlyoffice-iframe-container)[style*=\"rgba(30, 41, 59\"],",
      "html:not([data-theme=\"dark\"]):not(.dark) .cms-content div:not([style*=\"position: fixed\"]):not([style*=\"position:fixed\"]):not([style*=\"position: absolute\"]):not([style*=\"position:absolute\"]):not(.leaflet-container):not(#onlyoffice-iframe-container)[style*=\"rgba(2, 6, 23\"],",
      "html:not([data-theme=\"dark\"]):not(.dark) .p-dialog div:not([style*=\"position: fixed\"]):not([style*=\"position:fixed\"]):not([style*=\"position: absolute\"]):not([style*=\"position:absolute\"])[style*=\"rgba(15, 23, 42\"],",
      "html:not([data-theme=\"dark\"]):not(.dark) .p-dialog div:not([style*=\"position: fixed\"]):not([style*=\"position:fixed\"]):not([style*=\"position: absolute\"]):not([style*=\"position:absolute\"])[style*=\"rgba(30, 41, 59\"] {",
      "  background: var(--cas-surface-subtle, #f8fafc) !important;",
      "  border-color: var(--cas-border, #e2e8f0) !important;",
      "  color: var(--cas-text-primary, #0f172a) !important;",
      "}",
      "html:not([data-theme=\"dark\"]):not(.dark) .cms-content button[style*=\"rgba(15, 23, 42\"],",
      "html:not([data-theme=\"dark\"]):not(.dark) .cms-content button[style*=\"rgba(30, 41, 59\"],",
      "html:not([data-theme=\"dark\"]):not(.dark) .cms-content button[style*=\"rgb(15, 23, 42)\"],",
      "html:not([data-theme=\"dark\"]):not(.dark) .cms-content button[style*=\"rgb(30, 41, 59)\"] {",
      "  background: var(--cas-surface-hover, #f1f5f9) !important;",
      "  border-color: var(--cas-border-strong, #cbd5e1) !important;",
      "  color: var(--cas-text-secondary, #334155) !important;",
      "}",
      "html:not([data-theme=\"dark\"]):not(.dark) .cms-content input[style*=\"rgb(15, 23, 42)\"],",
      "html:not([data-theme=\"dark\"]):not(.dark) .cms-content input[style*=\"rgb(2, 6, 23)\"],",
      "html:not([data-theme=\"dark\"]):not(.dark) .cms-content select[style*=\"rgb(15, 23, 42)\"],",
      "html:not([data-theme=\"dark\"]):not(.dark) .cms-content select[style*=\"rgb(2, 6, 23)\"],",
      "html:not([data-theme=\"dark\"]):not(.dark) .p-dialog input[style*=\"rgb(2, 6, 23)\"] {",
      "  background: var(--cas-card-bg, #ffffff) !important;",
      "  border-color: var(--cas-border-strong, #cbd5e1) !important;",
      "  color: var(--cas-text-primary, #0f172a) !important;",
      "}",
      "/* Global Card Persegi Rounded-Corner (Anti-Oval) Standard */",
      ".p-card, .dash-hero-card, .dash-panel, .cas-bento-card, .cms-card, .dash-today-card, [class*=\"card\"]:not(.cms-user-avatar):not(.cas-avatar), [class*=\"banner\"], [class*=\"panel\"], div[style*=\"border-radius: 24px\"], div[style*=\"border-radius:24px\"], div[style*=\"border-radius: 20px\"], div[style*=\"border-radius:20px\"], div[style*=\"border-radius: 18px\"], div[style*=\"border-radius:18px\"], section[style*=\"border-radius: 24px\"], section[style*=\"border-radius: 20px\"] {",
      "  border-radius: 12px !important;",
      "}",
      ".lp-stat, .kp-kpi-card, .kp-kpi-card-v2, #kp-summary-strip .kp-kpi-card-v2.kp-pill-collapsed, #kp-summary-strip .kp-kpi-card.is-pill-collapsed, #kp-summary-strip .kp-kpi-card-v2.kp-pill-expanded, #kp-summary-strip .kp-kpi-card.is-pill-expanded, .lp-status-cards .lp-stat, .lp-status-cards .lp-stat.active, .att-chip, input[type=\"text\"][style*=\"999px\"], input[type=\"search\"][style*=\"999px\"], input:not([type])[style*=\"999px\"] {",
      "  border-radius: 10px !important;",
      "}"
    ].join("\n");
    document.head.appendChild(st);
  }
  if (typeof window !== "undefined" && !window.__casTileHarmonyGuard) {
    window.__casTileHarmonyGuard = true;
    var tileRaf = false;
    var fixCartoTiles = function() {
      tileRaf = false;
      if (typeof document === "undefined" || !document.querySelector(".leaflet-tile-pane")) return;
      var imgs = document.querySelectorAll("img.leaflet-tile, .leaflet-tile-pane img");
      for (var i = 0; i < imgs.length; i++) {
        var s = imgs[i].getAttribute("src") || "";
        if (s.indexOf("cartocdn.com") !== -1 || s.indexOf("carto.com") !== -1) {
          var m = s.match(/\/(\d+)\/(\d+)\/(\d+)(?:@2x)?\.png/i);
          if (m) imgs[i].src = "https://tile.openstreetmap.org/" + m[1] + "/" + m[2] + "/" + m[3] + ".png";
        }
      }
    };
    if (typeof MutationObserver !== "undefined" && document.body) {
      var tileObs = new MutationObserver(function() {
        if (!tileRaf && document.querySelector(".leaflet-tile-pane")) {
          tileRaf = true;
          requestAnimationFrame(fixCartoTiles);
        }
      });
      try { tileObs.observe(document.body, { childList: true, subtree: true }); } catch(_e) {}
    }
  }
  if (typeof window !== "undefined" && !window.__casHeaderHeightGuard) {
    window.__casHeaderHeightGuard = true;
    var lastGlobalHeaderH = 0;
    var syncFixedHeaderHeight = function() {
      if (typeof document === "undefined") return;
      var hdr = document.querySelector(".cms-header-fixed");
      if (hdr) {
        var rectH = Math.ceil(hdr.getBoundingClientRect().height);
        if (rectH >= 48 && rectH <= 260 && Math.abs(rectH - lastGlobalHeaderH) >= 2) {
          lastGlobalHeaderH = rectH;
          document.documentElement.style.setProperty("--cms-header-h", rectH + "px");
        }
      }
    };
    syncFixedHeaderHeight();
    window.addEventListener("resize", syncFixedHeaderHeight, { passive: true });
    if (typeof ResizeObserver !== "undefined") {
      var hdrRo = new ResizeObserver(syncFixedHeaderHeight);
      var hdrMo = null;
      var attachHdrRo = function() {
        var hdrEl = document.querySelector(".cms-header-fixed");
        if (hdrEl && !hdrEl.__casRoAttached) {
          hdrEl.__casRoAttached = true;
          try { hdrRo.observe(hdrEl); } catch(_e) {}
          syncFixedHeaderHeight();
          if (hdrMo) { try { hdrMo.disconnect(); } catch(_e) {} hdrMo = null; }
        }
      };
      attachHdrRo();
      if (!document.querySelector(".cms-header-fixed") && typeof MutationObserver !== "undefined" && document.body) {
        hdrMo = new MutationObserver(attachHdrRo);
        try { hdrMo.observe(document.body, { childList: true, subtree: true }); } catch(_e) {}
      }
    }
  }
  if (typeof window !== "undefined" && !window.__casConfirmDelete) {
    window.__casConfirmDelete = function(opts) {
      return new Promise(function(resolve) {
        if (typeof document === "undefined" || !document.body) {
          resolve(window.confirm((opts && opts.message) || "Tindakan ini tidak dapat dibatalkan."));
          return;
        }
        initCasExpensivePcHpStandards();
        var title = (opts && typeof opts === "object" && opts.title) ? opts.title : "Hapus Postingan?";
        var message = (typeof opts === "string" ? opts : (opts && opts.message)) || "Tindakan ini tidak dapat dibatalkan.";
        var confirmText = (opts && typeof opts === "object" && opts.confirmText) ? opts.confirmText : "Ya, Hapus";
        var cancelText = (opts && typeof opts === "object" && opts.cancelText) ? opts.cancelText : "Batal";
        var isDark = document.documentElement.dataset.theme === "dark" || localStorage.getItem("bdb_theme") === "dark";

        var overlay = document.createElement("div");
        overlay.className = "cas-confirm-delete-overlay";
        overlay.setAttribute("role", "dialog");
        overlay.setAttribute("aria-modal", "true");
        overlay.style.cssText = "position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:1rem;background:" + (isDark ? "rgba(2,6,23,0.72)" : "rgba(15,23,42,0.52)") + ";backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);transition:opacity 180ms ease;";

        var card = document.createElement("div");
        card.className = "cas-confirm-modal-card";
        card.style.cssText = "width:100%;max-width:400px;border-radius:16px;padding:1.4rem 1.35rem 1.25rem;background:" + (isDark ? "rgba(15,23,42,0.94)" : "rgba(255,255,255,0.96)") + ";border:1px solid " + (isDark ? "rgba(239,68,68,0.35)" : "rgba(226,232,240,0.95)") + ";box-shadow:0 24px 60px rgba(0,0,0,0.42), 0 0 0 1px rgba(239,68,68,0.12);color:" + (isDark ? "#f8fafc" : "#0f172a") + ";font-family:inherit;text-align:center;";

        card.innerHTML = [
          '<div style="width:54px;height:54px;margin:0 auto 0.9rem;border-radius:14px;background:rgba(239,68,68,0.14);border:1px solid rgba(239,68,68,0.35);display:flex;align-items:center;justify-content:center;color:#ef4444;box-shadow:0 8px 20px rgba(239,68,68,0.2);">',
          '  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">',
          '    <g class="cas-trash-lid-anim">',
          '      <path d="M3 6h18"></path>',
          '      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>',
          '    </g>',
          '    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>',
          '    <line x1="10" y1="11" x2="10" y2="17"></line>',
          '    <line x1="14" y1="11" x2="14" y2="17"></line>',
          '  </svg>',
          '</div>',
          '<h3 class="cas-confirm-title" style="margin:0 0 0.45rem;font-size:1.05rem;font-weight:800;letter-spacing:-0.01em;"></h3>',
          '<p class="cas-confirm-msg" style="margin:0 0 1.25rem;font-size:0.84rem;line-height:1.5;color:' + (isDark ? "#94a3b8" : "#475569") + ';"></p>',
          '<div style="display:flex;gap:0.65rem;justify-content:center;">',
          '  <button type="button" class="cas-btn-cancel" style="flex:1;padding:0.58rem 1rem;border-radius:10px;border:1px solid ' + (isDark ? "#334155" : "#cbd5e1") + ';background:' + (isDark ? "rgba(30,41,59,0.75)" : "#f8fafc") + ';color:' + (isDark ? "#e2e8f0" : "#334155") + ';font-size:0.83rem;font-weight:700;cursor:pointer;"></button>',
          '  <button type="button" class="cas-btn-confirm" style="flex:1;padding:0.58rem 1rem;border-radius:10px;border:1px solid rgba(239,68,68,0.5);background:linear-gradient(135deg,#ef4444 0%,#dc2626 100%);color:#ffffff;font-size:0.83rem;font-weight:800;cursor:pointer;box-shadow:0 6px 18px rgba(239,68,68,0.35);"></button>',
          '</div>'
        ].join("");

        card.querySelector(".cas-confirm-title").textContent = title;
        card.querySelector(".cas-confirm-msg").textContent = message;
        var btnCancel = card.querySelector(".cas-btn-cancel");
        var btnConfirm = card.querySelector(".cas-btn-confirm");
        btnCancel.textContent = cancelText;
        btnConfirm.textContent = confirmText;

        var settled = false;
        function cleanup(val, animateShrink) {
          if (settled) return;
          settled = true;
          document.removeEventListener("keydown", onKey);
          if (animateShrink) {
            card.classList.add("cas-deleting-shrink");
            overlay.style.opacity = "0";
            setTimeout(function() {
              if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
              resolve(val);
            }, 200);
          } else {
            overlay.style.opacity = "0";
            setTimeout(function() {
              if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
              resolve(val);
            }, 140);
          }
        }
        function onKey(ev) {
          if (ev.key === "Escape") cleanup(false, false);
        }
        document.addEventListener("keydown", onKey);
        overlay.addEventListener("click", function(ev) {
          if (ev.target === overlay) cleanup(false, false);
        });
        btnCancel.addEventListener("click", function() { cleanup(false, false); });
        btnConfirm.addEventListener("click", function() {
          btnConfirm.textContent = "Menghapus...";
          cleanup(true, true);
        });

        overlay.appendChild(card);
        document.body.appendChild(overlay);
        try { btnConfirm.focus(); } catch(_e) {}
      });
    };
  }
}
if (typeof window !== "undefined") {
  try { initCasExpensivePcHpStandards(); } catch(_e) {}
}

function formatFriendlyNotifTime(dateStr) {
  if (!dateStr) return "Baru saja";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "Baru saja";
  const now = new Date();
  const diffSec = Math.max(0, Math.floor((now.getTime() - d.getTime()) / 1000));
  if (diffSec < 60) return "Baru saja";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} menit lalu`;
  const diffHr = Math.floor(diffMin / 60);
  const isToday = d.toDateString() === now.toDateString();
  if (isToday && diffHr < 24) return `${diffHr} jam lalu`;
  const yest = new Date(now);
  yest.setDate(now.getDate() - 1);
  const timeHm = d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  if (d.toDateString() === yest.toDateString()) return `Kemarin, ${timeHm}`;
  const diffDays = Math.floor(diffHr / 24);
  if (diffDays < 7) return `${diffDays} hari lalu · ${timeHm}`;
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined }) + `, ${timeHm}`;
}

function getNotifTimeBucket(dateStr) {
  if (!dateStr) return "Hari Ini";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "Hari Ini";
  const now = new Date();
  if (d.toDateString() === now.toDateString()) return "Hari Ini";
  const yest = new Date(now);
  yest.setDate(now.getDate() - 1);
  if (d.toDateString() === yest.toDateString()) return "Kemarin";
  return "Minggu Ini / Sebelumnya";
}

function formatConvTimeShort(dateStr) {
  if (!dateStr) return "Baru saja";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  }
  const yest = new Date(now);
  yest.setDate(now.getDate() - 1);
  if (d.toDateString() === yest.toDateString()) return "Kemarin";
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diffDays < 7) {
    const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    return days[d.getDay()];
  }
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit" });
}

function formatDateDividerLabel(dateStr) {
  if (!dateStr) return "Hari Ini";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "Hari Ini";
  const now = new Date();
  if (d.toDateString() === now.toDateString()) return "Hari Ini";
  const yest = new Date(now);
  yest.setDate(now.getDate() - 1);
  if (d.toDateString() === yest.toDateString()) return "Kemarin";
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

const CAS_PRESERVE_UPPER_TOKENS = new Set([
  "POLRI", "BARESKRIM", "ROBINOPSNAL", "BINOPS", "MABES", "POLDA", "POLRES", "POLRESTA", "POLRESTABES", "POLSEK",
  "SATRESKRIM", "DITRESKRIMUM", "DITRESKRIMSUS", "DITRESNARKOBA", "DITTAHTI", "KORLANTAS", "DIVPROPAM",
  "IRJEN", "BRIGJEN", "KOMBES", "AKBP", "KOMPOL", "AKP", "IPTU", "IPDA", "AIPTU", "AIPDA", "BRIPKA", "BRIGPOL", "BRIGADIR", "BRIPTU", "BRIPDA",
  "CAS", "BDB", "LP", "SP2HP", "SP3", "P21", "RJ", "DORS", "KUHP", "UU", "SOP", "SDM", "TOTP", "OTP", "AI", "II", "III", "IV"
]);

function casFormatHumanName(rawName) {
  const s = String(rawName || "").trim();
  if (!s) return "Rekan Personil";
  if (s.startsWith("@")) return s;
  if (/^AI\s+Agen\s+Taktis\s+CAS$/i.test(s)) return "AI Agen Taktis CAS";
  return s
    .replace(/\s+/g, " ")
    .split(" ")
    .map(tok => {
      const clean = tok.replace(/[^A-Za-z0-9.]/g, "");
      const upper = clean.toUpperCase();
      if (CAS_PRESERVE_UPPER_TOKENS.has(upper)) return upper;
      if (/^(S\.I\.K\.?|S\.H\.?|M\.H\.?|M\.Si\.?|M\.M\.?|S\.Kom\.?|S\.T\.?|Ph\.D\.?)$/i.test(tok)) {
        return tok;
      }
      const dedup = tok.replace(/([A-Za-z])\1{2,}/g, "$1").replace(/([A-Za-z]{2,})\1$/i, "$1$1");
      const trimmedRepeat = dedup.length > 3 ? dedup.replace(/([aiueonAIUEON])\1+$/i, "$1") : dedup;
      return trimmedRepeat.charAt(0).toUpperCase() + trimmedRepeat.slice(1).toLowerCase();
    })
    .join(" ");
}

function casCapitalizeEachWordSatker(rawSatker) {
  const s = String(rawSatker || "").replace(/^[\s\-·—]+|[\s\-·—]+$/g, "").trim();
  if (!s || s === "-" || s === "--" || s.toLowerCase() === "null" || s.toLowerCase() === "undefined") {
    return "";
  }
  const upperAcronyms = new Set([
    "II", "III", "IV", "VI", "VII", "VIII", "IX", "DKI", "DIY", "NTB", "NTT",
    "KP", "K.P.", "PPA", "PPO", "PPA-PPO", "LP", "DORS", "SPKT", "CAS", "BDB",
    "IT", "TI", "SDM", "SIM", "STNK", "BPKB", "DPO", "KPK", "BNN", "TNI", "PPNS"
  ]);
  return s
    .split(/\s+/)
    .map(token => {
      if (!token) return "";
      const cleanUpper = token.replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9.]+$/g, "").toUpperCase();
      if (upperAcronyms.has(cleanUpper)) return cleanUpper;
      if (token.includes("-")) {
        return token
          .split("-")
          .map(part => {
            const pUp = part.toUpperCase();
            if (upperAcronyms.has(pUp)) return pUp;
            return part ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() : "";
          })
          .join("-");
      }
      if (token.includes("/")) {
        return token
          .split("/")
          .map(part => {
            const pUp = part.toUpperCase();
            if (upperAcronyms.has(pUp)) return pUp;
            return part ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() : "";
          })
          .join("/");
      }
      return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();
    })
    .filter(Boolean)
    .join(" ");
}

function casFormatPangkatSatkerLine(rawPangkat, rawSatker, isUserOne) {
  const satkerCap = casCapitalizeEachWordSatker(isUserOne ? "Robinopsnal Bareskrim Polri" : (rawSatker || "Polri")) || "Polri";
  let p = String(rawPangkat || "").replace(/^[\s\-·—]+|[\s\-·—]+$/g, "").trim();
  if (isUserOne) p = "Kompol";
  if (
    !p ||
    p === "-" ||
    p === "--" ||
    p.toLowerCase() === "null" ||
    p.toLowerCase() === "undefined" ||
    p.toLowerCase() === "personil" ||
    p.toLowerCase() === "personil polri"
  ) {
    return satkerCap;
  }
  const pangkatCap = casCapitalizeEachWordSatker(p);
  return pangkatCap ? `${pangkatCap} · ${satkerCap}` : satkerCap;
}

function renderCasMetaBadge(u, size = 15) {
  const uidStr = String(u?.id || u?.user_id || "");
  const uname = String(u?.callsign || u?.username || "").toLowerCase();
  const roleStr = String(u?.role_bdb || u?.role || "").toLowerCase();
  const isSuper = uidStr === "1" || uname.includes("om.eko") || uname === "omeko42" || roleStr.includes("super");
  const isBinops = roleStr.includes("binops");
  const fillCol = isSuper ? "#f59e0b" : isBinops ? "#6366f1" : "#0095f6";
  const badgeTitle = isSuper ? "Superadmin Terverifikasi (Robinopsnal Bareskrim Polri)" : isBinops ? "Admin Binops Terverifikasi" : "Personil Polri Terverifikasi";
  return (0, a.jsx)("span", {
    title: badgeTitle,
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: `${size}px`,
      height: `${size}px`,
      flexShrink: 0,
      verticalAlign: "middle"
    },
    children: (0, a.jsxs)("svg", {
      viewBox: "0 0 24 24",
      width: size,
      height: size,
      fill: "none",
      style: { display: "block", filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))" },
      children: [
        (0, a.jsx)("path", {
          d: "M12 1.25L14.69 3.04L17.91 2.75L19.44 5.6L22.25 7.13L21.96 10.35L23.75 13.04L21.96 15.73L22.25 18.95L19.44 20.48L17.91 23.33L14.69 23.04L12 24.83L9.31 23.04L6.09 23.33L4.56 20.48L1.75 18.95L2.04 15.73L0.25 13.04L2.04 10.35L1.75 7.13L4.56 5.6L6.09 2.75L9.31 3.04L12 1.25Z",
          transform: "scale(0.92) translate(1, 0)",
          fill: fillCol
        }),
        (0, a.jsx)("path", {
          d: "M8.5 12.5L10.8 14.8L15.8 9.8",
          stroke: "#ffffff",
          strokeWidth: 2.35,
          strokeLinecap: "round",
          strokeLinejoin: "round"
        })
      ]
    })
  });
}

function casGetReadNotifIds() {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem("cas_notif_read_ids_v2");
    const arr = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(arr) ? arr.map(String) : []);
  } catch {
    return new Set();
  }
}

function casMarkNotifIdsReadLocal(ids) {
  if (typeof window === "undefined" || !Array.isArray(ids) || !ids.length) return;
  try {
    const set = casGetReadNotifIds();
    ids.forEach(id => {
      if (id !== undefined && id !== null) set.add(String(id));
    });
    const list = Array.from(set).slice(-500);
    localStorage.setItem("cas_notif_read_ids_v2", JSON.stringify(list));
  } catch {}
}

function casCleanQuoteSnippet(raw, maxLen = 45) {
  const s = String(raw || "")
    .replace(/[«»"""]/g, "")
    .replace(/^📢\s*/, "")
    .replace(/\s*—\s*ketuk untuk membaca\s*&\s*konfirmasi\.?/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!s) return "";
  return s.length > maxLen ? `${s.slice(0, maxLen).trim()}...` : s;
}

function humanizeCasNotification(raw) {
  const it = raw || {};
  const type = String(it.type || "social").toLowerCase();
  const cat = String(it.category || (type === "dinas" || type === "jukrah" || type === "limpah" || type === "pelimpahan" ? "dinas" : "social")).toLowerCase();
  const rawSender = String(it.actor_name || it.sender_name || "").trim();
  const rawHandle = String(it.sender_handle || "").trim();
  let cleanHandle = rawHandle
    ? (rawHandle.startsWith("@") ? rawHandle : `@${rawHandle}`)
    : (rawSender && !rawSender.includes(" ") ? `@${rawSender.replace(/^@/, "")}` : "");
  if (!cleanHandle || cleanHandle === "@bareskrim" || cleanHandle === "@robinopsnal_mabes") {
    if (rawSender && !/robinopsnal|bareskrim|polri|rekan/i.test(rawSender)) {
      const slug = rawSender.toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.+|\.+$/g, "").slice(0, 20);
      cleanHandle = slug ? `@${slug}` : "@robinops";
    } else {
      cleanHandle = cat === "dinas" ? "@robinops" : "@rekan";
    }
  }
  const rawActor = (rawSender && !rawSender.startsWith("@"))
    ? rawSender
    : (cat === "dinas" ? "Robinopsnal Bareskrim Polri" : cleanHandle.replace(/^@/, "").replace(/[._-]+/g, " "));
  const actorName = casFormatHumanName(rawActor);
  const avatarUrl = it.sender_photo || "/images/default-avatar-polki.png";
  const localReadSet = casGetReadNotifIds();
  const isReadFinal = Boolean(it.is_read || (it.id !== undefined && localReadSet.has(String(it.id))));

  let badgeIcon = it.badge_icon || "🔔";
  let badgeColor = it.badge_color || "#2563eb";
  let badgeLabel = it.badge_label || (cat === "dinas" ? "Jukrah" : "Sharese");
  let filterGroup = it.filter_group || "social";
  let actionText = "";
  let snippetText = "";
  let tickerText = "";
  const rawMsg = String(it.message || "").trim();
  const rawTitle = String(it.title || "").trim();

  const isLimpah = type === "pelimpahan" || type === "limpah" || type === "case_transfer" || /dilimpahkan|pelimpahan\s+lp|pelimpahan\s+ke/i.test(rawTitle + " " + rawMsg);

  if (isLimpah) {
    badgeIcon = "⚖️";
    badgeColor = "#7c3aed";
    badgeLabel = "Limpah";
    filterGroup = "limpah";
    if (/^\(DORS\)/i.test(rawTitle)) {
      actionText = rawTitle;
      snippetText = rawMsg || "";
      tickerText = rawTitle;
    } else {
      const mDari = (rawMsg + " " + rawTitle).match(/dari\s+([^.,;]+?)(?:\s+ke\s+|$)/i);
      const mKe = (rawTitle + " " + rawMsg).match(/ke\s+([^.,;]+?)(?:\s+dari\s+|$)/i);
      const satAsal = casCapitalizeEachWordSatker(it.satker_asal_nama || (mDari ? mDari[1] : "Satker Asal")) || "Satker Asal";
      const satTujuan = casCapitalizeEachWordSatker(it.satker_tujuan_nama || (mKe ? mKe[1] : "Satker Tujuan")) || "Satker Tujuan";
      const mLp = (rawTitle + " " + rawMsg).match(/(LP\/[A-Za-z0-9/.\-]+|LP\s*#?\d+)/i);
      const rawLpToken = it.no_laporan || (mLp ? mLp[1].replace(/^LP\s*#?/i, "") : (it.lp_id || "101"));
      const fullLpNo = /^LP\//i.test(String(rawLpToken))
        ? String(rawLpToken)
        : `LP/B/${rawLpToken}/X/2026/SPKT/${satAsal}`;
      const limpahLine = `(DORS) ${fullLpNo} dilimpahkan dari ${satAsal} ke ${satTujuan}`;
      actionText = limpahLine;
      snippetText = `Pelimpahan perkara dari ${satAsal} ke ${satTujuan}`;
      tickerText = limpahLine;
    }
  } else if (cat === "dinas" || type === "dinas" || type === "jukrah" || type === "official_jukrah" || type === "official_broadcast") {
    badgeIcon = "📢";
    badgeColor = "#d97706";
    badgeLabel = "Jukrah";
    filterGroup = "jukrah";
    let cleanBody = (rawMsg || rawTitle)
      .replace(/^📢\s*/, "")
      .replace(/^\[JUKRAH\/PENGUMUMAN\]\s*/i, "")
      .replace(/^(?:Arahan\s+(?:Resmi\s+)?(?:Baru)?|Jukrah\s+(?:Resmi\s+)?(?:Baru)?)(?:\s+dari\s+[^:—-]+)?\s*[:—-]*\s*/i, "")
      .replace(/^@[a-z0-9_.]+\s*:\s*/i, "")
      .replace(/\s*—\s*ketuk untuk membaca\s*&\s*konfirmasi\.?/gi, "")
      .replace(/^[«"“”]+|[»"“”]+$/g, "")
      .trim();
    snippetText = casCleanQuoteSnippet(cleanBody, 68) || "Jukrah resmi kedinasan";
    actionText = `mengirim Jukrah: "${snippetText}"`;
    tickerText = `${cleanHandle}: "${casCleanQuoteSnippet(cleanBody, 58) || "Jukrah resmi kedinasan"}"`;
  } else if (type === "comment" || type === "reply") {
    badgeIcon = "💬";
    badgeColor = "#2563eb";
    badgeLabel = "Sharese";
    filterGroup = "komentar";
    const m = rawMsg.match(/[«"](.+?)[»"]/);
    const extracted = m ? m[1] : rawMsg.replace(/^.*?mengomentari.*?:\s*/i, "");
    snippetText = casCleanQuoteSnippet(extracted, 48);
    actionText = "mengomentari kiriman Anda";
    tickerText = snippetText ? `${cleanHandle} mengomentari kiriman Anda: "${snippetText}"` : `${cleanHandle} mengomentari kiriman Anda`;
  } else if (type === "mention") {
    badgeIcon = "💬";
    badgeColor = "#2563eb";
    badgeLabel = "Sharese";
    filterGroup = "komentar";
    const m = rawMsg.match(/[«"](.+?)[»"]/);
    const extracted = m ? m[1] : rawMsg.replace(/^.*?menyebut Anda.*?:\s*/i, "");
    snippetText = casCleanQuoteSnippet(extracted, 48);
    actionText = "menyebut Anda dalam diskusi";
    tickerText = snippetText ? `${cleanHandle} menyebut Anda: "${snippetText}"` : `${cleanHandle} menyebut Anda dalam diskusi`;
  } else if (["reaction", "like", "respect", "insightful", "applause", "fire"].includes(type)) {
    badgeIcon = type === "respect" || rawMsg.includes("🫡") ? "🫡" : type === "insightful" || rawMsg.includes("💡") ? "💡" : type === "applause" || rawMsg.includes("👏") ? "👏" : type === "fire" || rawMsg.includes("🔥") ? "🔥" : "❤️";
    badgeColor = "#e11d48";
    badgeLabel = "Sharese";
    filterGroup = "komentar";
    const m = rawMsg.match(/[«"](.+?)[»"]/);
    snippetText = m ? casCleanQuoteSnippet(m[1], 45) : "";
    actionText = (type === "respect" || rawMsg.includes("hormat")) ? "memberi hormat pada kiriman Anda" : (type === "applause" || rawMsg.includes("apresiasi")) ? "mengapresiasi kiriman Anda" : "menyukai kiriman Anda";
    tickerText = `${cleanHandle} ${actionText}`;
  } else if (type === "repost") {
    badgeIcon = "🔁";
    badgeColor = "#0284c7";
    badgeLabel = "Sharese";
    filterGroup = "komentar";
    actionText = "membagikan ulang kiriman Anda";
    tickerText = `${cleanHandle} membagikan ulang kiriman Anda`;
  } else if (type === "connection" || type === "follow") {
    badgeIcon = "🤝";
    badgeColor = "#16a34a";
    badgeLabel = "Sharese";
    filterGroup = "social";
    const isPendingConn = it.status === "PENDING" || /permintaan koneksi/i.test(rawTitle + " " + rawMsg);
    actionText = isPendingConn ? "mengirim permintaan koneksi kepada Anda" : "terhubung dengan Anda di Sharese";
    snippetText = isPendingConn ? "Ketuk untuk Terima atau Abaikan permintaan koneksi" : "";
    tickerText = `${cleanHandle} ${actionText}`;
  } else if (type === "message" || type === "dm") {
    badgeIcon = "💬";
    badgeColor = "#16a34a";
    badgeLabel = "Obrolan";
    filterGroup = "social";
    const m = rawMsg.match(/[«"](.+?)[»"]/);
    const extracted = m ? m[1] : rawMsg.replace(/^.*?mengirim pesan.*?:\s*/i, "");
    snippetText = casCleanQuoteSnippet(extracted, 48);
    actionText = "mengirim pesan baru kepada Anda";
    tickerText = snippetText ? `${cleanHandle} mengirim pesan: "${snippetText}"` : `${cleanHandle} mengirim pesan baru kepada Anda`;
  } else {
    badgeIcon = "🔔";
    badgeColor = "#2563eb";
    badgeLabel = "Sharese";
    filterGroup = "komentar";
    snippetText = casCleanQuoteSnippet(rawMsg || rawTitle, 55);
    actionText = snippetText || "Pembaruan aktivitas";
    tickerText = `${cleanHandle}: "${actionText}"`;
  }

  return {
    ...it,
    is_read: isReadFinal,
    isLimpah,
    actorName,
    actorHandle: cleanHandle,
    avatarUrl,
    badgeIcon,
    badgeColor,
    badgeLabel,
    filterGroup,
    actionText,
    snippetText,
    tickerText,
    friendlyTime: formatFriendlyNotifTime(it.created_at),
    timeBucket: getNotifTimeBucket(it.created_at)
  };
}

function L({user:e,roleLabel:n,onToggleSidebar:l,onToggleCollapse:i}){let o=(0,r.useRouter)(),[livePhoto,setLivePhoto]=(0,t.useState)(()=>{try{let u=JSON.parse(localStorage.getItem("user")||"{}");return u?.photo_url||u?.foto||e?.photo_url||e?.foto||null}catch{return e?.photo_url||e?.foto||null}}),[liveUser,setLiveUser]=(0,t.useState)(()=>{try{let u=JSON.parse(localStorage.getItem("user")||"{}");return (u&&u.id)?u:(e||null)}catch{return e||null}}),[v,S]=(0,t.useState)(!1),[w,O]=(0,t.useState)(!0),[T,I]=(0,t.useState)(null),[E,z]=(0,t.useState)(null),[K,$]=(0,t.useState)(null),[D,B]=(0,t.useState)(!1),U=(0,t.useRef)(null),[q,J]=(0,t.useState)(!1),[W,G]=(0,t.useState)({total:0,per_entity:[]}),[F,H]=(0,t.useState)([]),[V,X]=(0,t.useState)(!1),Z=(0,t.useRef)(null);let [notifTab,setNotifTab]=(0,t.useState)("all"),[isLoggingOut,setIsLoggingOut]=(0,t.useState)(!1);(0,t.useEffect)(()=>{initCasExpensivePcHpStandards();let e="dark"===localStorage.getItem("bdb_theme");S(e),document.documentElement.dataset.theme=e?"dark":"light"},[]),(0,t.useEffect)(()=>{let e=!0,a=()=>O(navigator.onLine);async function t(){if(!navigator.onLine){e&&(O(!1),I(null));return}let a=await C();e&&(O(null!=a),I(a))}async function r(){if(!navigator.onLine)return;let[a,t]=await Promise.all([A("down"),A("up")]);e&&(z(a),$(t))}a(),window.addEventListener("online",a),window.addEventListener("offline",a),t(),r();let s=setInterval(t,15e3),n=setInterval(r,45e3);return()=>{e=!1,clearInterval(s),clearInterval(n),window.removeEventListener("online",a),window.removeEventListener("offline",a)}},[]),(0,t.useEffect)(()=>{function e(e){U.current&&!U.current.contains(e.target)&&B(!1),Z.current&&!Z.current.contains(e.target)&&J(!1)}return document.addEventListener("mousedown",e),()=>document.removeEventListener("mousedown",e)},[]);let Q=(0,t.useCallback)(async()=>{if(e)try{let e=await M.apiAuth.get("/bdb/notifications/summary");G(e.data?.data||{total:0,per_entity:[]})}catch{}},[e]),{refresh:Y}=(0,_.useAutoRefresh)(Q,6e4);(0,t.useEffect)(()=>{Y()},[Y]);let ee=["superadmin","admin_binops"].includes(String(e?.role_bdb||e?.requested_role_bdb||"").toLowerCase()),[ea,et]=(0,t.useState)(!1),[er,es]=(0,t.useState)(null),en=(0,t.useCallback)(async()=>{if(ee)try{let e=(await M.apiAuth.get("/bdb/dors/sync/logs",{params:{limit:1}})).data;let isR=Boolean(e?.running&&e?.data?.[0]?.status==="running");et(isR),es(isR&&e?.data?.[0]||null)}catch{}},[ee]),{refresh:el}=(0,_.useAutoRefresh)(en,15e3);async function ei(tab){
  let e = !q;
  if (typeof tab === "string") e = !0;
  if (J(e), e) {
    X(!0);
    try {
      let res = await M.apiAuth.get("/bdb/jukrah/notifications");
      let notifItems = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []); H(notifItems);
      G({ total: 0, per_entity: [] });
    } catch {
      try {
        let legacy = await M.apiAuth.get("/bdb/notifications/list");
        let legItems = Array.isArray(legacy.data?.data) ? legacy.data.data : (Array.isArray(legacy.data) ? legacy.data : []); H(legItems);
      } catch {}
    } finally {
      X(!1);
    }
  }
}
function switchNotifTab(t){
  setNotifTab(t);
}(0,t.useEffect)(()=>{el()},[el]),(0,t.useEffect)(()=>{function uEv(ev){try{let u=ev?.detail||JSON.parse(localStorage.getItem("user")||"{}");let p=u?.photo_url||u?.foto||null;if(p)setLivePhoto(p);if(u&&u.id)setLiveUser(u)}catch{}}window.addEventListener("user-updated",uEv);window.addEventListener("storage",uEv);try{M.apiAuth.get("/user/me/profile").then(res=>{let d=res.data?.data;if(d&&!Array.isArray(d)&&(d.id||d.username)){setLiveUser(d);let p=d?.photo_url||d?.foto||null;if(p)setLivePhoto(p);try{let u=JSON.parse(localStorage.getItem("user")||"{}");if(p){u.photo_url=p;u.foto=p;}if(d.username){u.username=d.username;u.callsign=d.username;}else if(d.callsign)u.callsign=d.callsign;if(d.satker_nama){u.satker_nama=d.satker_nama;u.scope_satker_name=d.satker_nama;if(!u.satker||String(u.satker).toLowerCase().includes("superadmin"))u.satker=d.satker_nama;}if(d.role_bdb)u.role_bdb=d.role_bdb;localStorage.setItem("user",JSON.stringify(u))}catch(e){}}}).catch(()=>{})}catch(e){}return()=>{window.removeEventListener("user-updated",uEv);window.removeEventListener("storage",uEv)}},[]);let curUser=(liveUser&&liveUser.id)?liveUser:(e&&e.id?e:(function(){try{var lu=JSON.parse(localStorage.getItem("user")||"null");return (lu&&lu.id)?lu:null;}catch(e){return null;}})());
let isSuper=Boolean(curUser&&(String(curUser?.id)==='1'||String(curUser?.user_id)==='1'||curUser?.username==='omeko42'||curUser?.callsign==='omeko42'||String(curUser?.role_bdb||curUser?.role?.role_name||curUser?.role||'').toLowerCase().includes('super')||['1','320','15403','15404','16568','16576','16594'].includes(String(curUser?.id||curUser?.user_id))));
let eo=(function(){if(!curUser)return"Pengguna";return formatUserCallsign(curUser)||curUser.name||"Pengguna";})();
let isVendorRole=Boolean(curUser&&["vendor_mitra","vendor","mitra"].includes(String(curUser?.role_bdb||curUser?.requested_role_bdb||curUser?.role?.role_name||"").toLowerCase()));let _rawSat=[curUser?.satker_singkat,curUser?.satker_nama,curUser?.scope_satker_name,curUser?.satker,curUser?.satuan].find(x=>x&&!['bdb superadmin','superadmin','-','null','undefined'].includes(String(x).trim().toLowerCase()));let userSatkerDisp=isVendorRole?'Vendor / Mitra (Read-Only)':isSuper?'Robinopsnal Bareskrim Polri':(curUser?toTitleCase(_rawSat||'Polri'):'-');
let isOkoTop=Boolean(curUser&&(String(curUser?.id||curUser?.user_id)==='1'||curUser?.username==='omeko42'||curUser?.callsign==='omeko42'));let hasTopV2=Boolean(isOkoTop||curUser?.social_media?.avatar_v2||(curUser?.id&&typeof localStorage!=='undefined'&&localStorage.getItem('cas_avatar_v2_'+curUser.id)==='1'));let isPolwanTop=(function(u){if(!u||typeof u!=='object')return false;var expG=String(u.social_media?.jenis_kelamin||u.social_media?.gender||'').trim().toLowerCase();if(['p','perempuan','wanita','female','f','polwan'].includes(expG))return true;if(['l','laki-laki','laki','pria','male','m','polki'].includes(expG))return false;var g=String(u.gender||u.jenis_kelamin||'').trim().toLowerCase();if(['p','perempuan','wanita','female','f','polwan'].includes(g))return true;if(['l','laki-laki','laki','pria','male','m','polki'].includes(g))return false;var nm=String(u.name||u.username||'').trim();if(/^(doliandri|muhammad|muhamad|mohammad|mohamad|mochamad|mochammad|m\.|moh\.|muh\.|ahmad|achmad|budi|agus|hendra|eko|rizky|rizki|andi|dedi|dedy|wahyu|bayu|dimas|bagus|fajar|reza|ilham|arif|arief|irfan|taufik|taufiq|hidayat|saputra|pratama|dewangga|irwan|iwan|heru|heri|hery|bambang|slamet|joko|tri\s+budi|agung|dwi\s+putra|putra)\b/i.test(nm))return false;return /\b(siti|sri|dewi|dewie|ayu|putri|dian|fitri|fitria|fitriani|nurul|rina|rini|desi|desy|mega|ratna|wulan|wulandari|indah|intan|novita|novi|lestari|anggraini|maharani|puspita|handayani|kusumawati|rahmawati|susanti|astuti|widyastuti|yuliani|yulia|yuni|wahyuni|fatimah|alfia|amini|tita|maria|theresia|veronica|natalia|debora|chintya|nadia|nabila|annisa|anisa|aulia|amelia|amalia|tiara|citra|maya|lina|linda|nina|dina|vina|vera|sari|wati|ningrum|ningsih|pratiwi|yashinta|prameswari|retno|endang|inggrid)\b/i.test(nm);})(curUser);let defTopAvatar=isPolwanTop?'/images/default-avatar-polwan.jpg':'/images/default-avatar-polki.png';let rawTopPhoto=livePhoto||curUser?.photo_url||curUser?.foto||'';let topAvatarSrc=(typeof rawTopPhoto==='string'&&rawTopPhoto.trim().length>5&&rawTopPhoto!=='null'&&rawTopPhoto!=='undefined'&&!rawTopPhoto.includes('default-avatar'))?rawTopPhoto.trim():defTopAvatar;let ec=(0,a.jsx)("img",{src:topAvatarSrc,alt:eo,onError:ev=>{ev.currentTarget.onerror=null;ev.currentTarget.src="/images/default-avatar-polki.png";},style:{width:"100%",height:"100%",borderRadius:"999px",objectFit:"cover"}}),eu=w?null==T?"offline":T<150?"excellent":T<400?"good":T<900?"weak":"poor":"offline";return(0,a.jsxs)("header",{className:"cms-topbar",children:[(0,a.jsx)("button",{type:"button",className:"cms-hamburger","aria-label":"Menu",onClick:l,children:(0,a.jsx)(c,{id:"fld-0-gigr76s0g8t-3",name:"field_0_gigr76s0g8t_3",size:20})}),(0,a.jsx)("button",{type:"button",className:"cms-collapse-btn","aria-label":"Sembunyikan/tampilkan menu",title:"Sembunyikan/tampilkan menu",onClick:i,children:(0,a.jsx)(g,{id:"fld-0-gigr76s0g8t-4",name:"field_0_gigr76s0g8t_4",size:19})}),(0,a.jsx)("div",{className:"cms-topbar-spacer"}),ea&&(0,a.jsxs)(s.default,{href:"/cms/integrasi/dors",title:er?`Sync DORS ${er.from_date} s/d ${er.to_date} sedang berjalan (percobaan ${er.attempt??1}/${er.max_attempts??5}, ${er.total_upserted} data baru sejauh ini). Jangan restart backend dulu.`:"Sync DORS sedang berjalan. Jangan restart backend dulu.",style:{display:"inline-flex",alignItems:"center",gap:"0.35rem",padding:"0.3rem 0.7rem",borderRadius:999,background:"#fef3c7",color:"#92400e",fontSize:"0.78rem",fontWeight:700,textDecoration:"none",border:"1px solid #fde68a"},children:[(0,a.jsx)(x.RefreshCw,{size:13,className:"cms-spin"}),"Sync DORS berjalan"]}),(("offline"===eu||!w||(typeof window!=="undefined"&&window.__bdbIsSyncing))&&(0,a.jsxs)("div",{title:"Mode Offline Aktif - Sync data cache lokal & antrean pekerjaan berjalan otomatis.",style:{display:"inline-flex",alignItems:"center",gap:"0.35rem",padding:"0.3rem 0.7rem",borderRadius:999,background:"#fef3c7",color:"#92400e",fontSize:"0.78rem",fontWeight:700,textDecoration:"none",border:"1px solid #fde68a",cursor:"default"},children:[(0,a.jsx)(x.RefreshCw,{size:13,className:"cms-spin"}),"Sync Offline berjalan"]})),(0,a.jsxs)("div",{ref:U,style:{position:"relative"},children:[(0,a.jsxs)("button",{type:"button",className:`cms-status cms-status-btn q-${eu}`,onClick:()=>B(e=>!e),title:"Klik untuk lihat detail koneksi","aria-label":"Status jaringan",children:["offline"===eu?(0,a.jsx)(m,{id:"fld-0-gigr76s0g8t-5",name:"field_0_gigr76s0g8t_5",size:15}):"weak"===eu||"poor"===eu?(0,a.jsx)(f,{id:"fld-0-gigr76s0g8t-6",name:"field_0_gigr76s0g8t_6",size:15}):(0,a.jsx)(p,{id:"fld-0-gigr76s0g8t-7",name:"field_0_gigr76s0g8t_7",size:15}),(0,a.jsx)("span",{children:P[eu]})]}),D&&(0,a.jsxs)("div",{className:"cms-status-pop",children:[(0,a.jsxs)("div",{className:"cms-status-pop-title",children:["offline"===eu?(0,a.jsx)(m,{id:"fld-0-gigr76s0g8t-8",name:"field_0_gigr76s0g8t_8",size:15}):(0,a.jsx)(p,{id:"fld-0-gigr76s0g8t-9",name:"field_0_gigr76s0g8t_9",size:15})," Status Jaringan — ",P[eu]]}),(0,a.jsxs)("div",{className:"cms-status-pop-row",children:[(0,a.jsxs)("span",{className:"k",children:[(0,a.jsx)(y.Gauge,{size:12,style:{verticalAlign:"-1px",marginRight:"0.3rem"}}),"Ping"]}),(0,a.jsx)("span",{className:"v",children:null!=T?`${T} ms`:"—"})]}),(0,a.jsxs)("div",{className:"cms-status-pop-row",children:[(0,a.jsxs)("span",{className:"k",children:[(0,a.jsx)(k,{id:"fld-0-gigr76s0g8t-10",name:"field_0_gigr76s0g8t_10",size:12,style:{verticalAlign:"-1px",marginRight:"0.3rem"}}),"Unduh"]}),(0,a.jsx)("span",{className:"v",children:null!=E?`${E} Mbps`:"—"})]}),(0,a.jsxs)("div",{className:"cms-status-pop-row",children:[(0,a.jsxs)("span",{className:"k",children:[(0,a.jsx)(b,{id:"fld-0-gigr76s0g8t-11",name:"field_0_gigr76s0g8t_11",size:12,style:{verticalAlign:"-1px",marginRight:"0.3rem"}}),"Unggah"]}),(0,a.jsx)("span",{className:"v",children:null!=K?`${K} Mbps`:"—"})]}),(0,a.jsx)("div",{className:"cms-status-pop-note",children:"Ping diperbarui tiap 15 detik, unduh/unggah tiap 45 detik. Estimasi kasar dari server BDB, bukan speedtest presisi."})]})]}),(0,a.jsxs)("div",{ref:Z,style:{position:"relative"},children:[(0,a.jsxs)("button",{type:"button",className:"cms-icon-btn",onClick:ei,title:"Notifikasi","aria-label":"Notifikasi",style:{position:"relative"},children:[(0,a.jsx)(j,{id:"fld-0-gigr76s0g8t-12",name:"field_0_gigr76s0g8t_12",size:18}),W.total>0&&(0,a.jsx)("span",{className:"tabular-nums",style:{position:"absolute",top:1,right:1,minWidth:16,height:16,borderRadius:999,background:"#dc2626",color:"#fff",fontSize:"0.6rem",fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 4px",lineHeight:1,whiteSpace:"nowrap"},children:W.total>99?"99+":W.total})]}),q&&(0,a.jsxs)("div",{className:"cms-status-pop",style:{width:"25.5rem",maxWidth:"94vw",right:0,padding:"0.85rem",borderRadius:"14px"},children:[
  (0,a.jsxs)("div",{className:"cms-status-pop-title",style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.6rem"},children:[
    (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.45rem"},children:[
      (0,a.jsx)(j,{size:16}),
      (0,a.jsx)("span",{style:{fontWeight:800,fontSize:"0.9rem"},children:"Notifikasi"})
    ]}),
    (0,a.jsx)("button",{
      type:"button",
      onClick:async()=>{
        try {
          casMarkNotifIdsReadLocal((Array.isArray(F)?F:[]).map(x=>x.id));
          await M.apiAuth.post("/bdb/jukrah/notifications/read-all", {});
          H(prev => prev.map(item => ({ ...item, is_read: !0 })));
          G({ total: 0, per_entity: [] });
          try { window.dispatchEvent(new Event("cas-notif-updated")); } catch {}
        } catch {}
      },
      style:{background:"none",border:"none",color:"#2563eb",fontSize:"0.74rem",cursor:"pointer",fontWeight:700},
      children:"✓ Tandai semua sudah dibaca"
    })
  ]}),
  (0,a.jsx)("div",{style:{display:"flex",gap:"0.3rem",marginBottom:"0.65rem",overflowX:"auto",paddingBottom:"0.15rem"},children:[
    { id: "all", label: "Semua" },
    { id: "unread", label: `Belum Dibaca (${(Array.isArray(F)?F:[]).map(humanizeCasNotification).filter(x=>!x.is_read).length})` },
    { id: "komentar", label: "Sharese" },
    { id: "jukrah", label: "Jukrah & Limpah" }
  ].map(tb => (0,a.jsx)("button",{
    key: tb.id,
    type:"button",
    onClick:()=>switchNotifTab(tb.id),
    style:{
      padding:"0.3rem 0.6rem",
      fontSize:"0.72rem",
      fontWeight:700,
      borderRadius:"999px",
      border:notifTab===tb.id?"1px solid #2563eb":"1px solid var(--cas-border, rgba(148,163,184,0.28))",
      cursor:"pointer",
      whiteSpace:"nowrap",
      background:notifTab===tb.id?"#2563eb":"var(--cas-surface-subtle, rgba(255,255,255,0.05))",
      color:notifTab===tb.id?"#fff":"var(--cas-text-secondary, #94a3b8)",
      transition:"all 0.15s ease"
    },
    children:tb.label
  }))}),
  V?(0,a.jsx)("p",{style:{fontSize:"0.8rem",color:"#94a3b8",padding:"1.25rem 0",textAlign:"center"},children:"Memuat notifikasi…"}):(function(){
    const normList = (Array.isArray(F) ? F : []).map(humanizeCasNotification).filter(it => {
      if (notifTab === "unread") return !it.is_read;
      if (notifTab === "komentar") return it.filterGroup === "komentar" || it.filterGroup === "social";
      if (notifTab === "jukrah" || notifTab === "arahan") return it.filterGroup === "jukrah" || it.filterGroup === "limpah" || it.category === "dinas";
      return true;
    });
    if (normList.length === 0) {
      return (0,a.jsx)("p",{style:{fontSize:"0.8rem",color:"#94a3b8",padding:"1.25rem 0",textAlign:"center"},children:"Belum ada notifikasi pada kategori ini."});
    }
    return (0,a.jsx)("div",{style:{display:"grid",gap:"0.35rem",maxHeight:"22rem",overflowY:"auto"},children:normList.slice(0,15).map((it,idx)=>(0,a.jsxs)(s.default,{
      href:it.link||"/cms/broadcaster",
      onClick:async()=>{
        J(!1);
        casMarkNotifIdsReadLocal([it.id]);
        if(typeof it.id === "number"){
          try { await M.apiAuth.post(`/bdb/jukrah/notifications/${it.id}/read`); } catch {}
        }
        try { window.dispatchEvent(new Event("cas-notif-updated")); } catch {}
        setTimeout(()=>{try{window.dispatchEvent(new Event("cas-url-change"))}catch{}},25);
      },
      style:{
        display:"flex",
        gap:"0.65rem",
        alignItems:"flex-start",
        textDecoration:"none",
        color:"inherit",
        padding:"0.55rem 0.65rem",
        borderRadius:10,
        background:it.is_read ? "transparent" : "rgba(37, 99, 235, 0.08)",
        border:it.is_read ? "1px solid transparent" : "1px solid rgba(37, 99, 235, 0.22)",
        transition:"background 0.15s ease"
      },
      children:[
        (0,a.jsxs)("div",{style:{position:"relative",width:40,height:40,flexShrink:0},children:[
          (0,a.jsx)("img",{
            src:it.avatarUrl||"/images/default-avatar-polki.png",
            alt:it.actorHandle,
            onError:ev=>{ev.currentTarget.onerror=null;ev.currentTarget.src="/images/default-avatar-polki.png";},
            style:{width:40,height:40,borderRadius:"50%",objectFit:"cover",border:"1.5px solid var(--cas-border, rgba(148,163,184,0.3))"}
          }),
          (0,a.jsx)("span",{
            style:{
              position:"absolute",
              bottom:-2,
              right:-2,
              width:18,
              height:18,
              borderRadius:"50%",
              background:it.badgeColor||"#2563eb",
              color:"#fff",
              fontSize:"0.62rem",
              display:"flex",
              alignItems:"center",
              justifyContent:"center",
              border:"2px solid var(--cas-card-bg, #0f172a)",
              boxShadow:"0 1px 3px rgba(0,0,0,0.25)"
            },
            children:it.badgeIcon
          })
        ]}),
        (0,a.jsxs)("div",{style:{minWidth:0,flex:1},children:[
          (0,a.jsxs)("div",{style:{fontSize:"0.78rem",lineHeight:1.4,color:"var(--cas-text-primary, #f8fafc)",wordBreak:"break-word"},children:[
            (0,a.jsx)("span",{style:{fontSize:"0.64rem",fontWeight:800,padding:"0.06rem 0.38rem",borderRadius:999,marginRight:"0.35rem",background:it.badgeLabel==="Limpah"?"rgba(124,58,237,0.16)":it.badgeLabel==="Jukrah"?"rgba(217,119,6,0.16)":"rgba(37,99,235,0.14)",color:it.badgeLabel==="Limpah"?"#7c3aed":it.badgeLabel==="Jukrah"?"#d97706":"#2563eb"},children:it.badgeLabel}),
            it.isLimpah ? (0,a.jsx)("span",{style:{fontWeight:700},children:it.actionText}) : (0,a.jsxs)(a.Fragment,{children:[
              (0,a.jsx)("span",{style:{color:"#2563eb",fontWeight:800},children:it.actorHandle}),
              " ",
              (0,a.jsx)("span",{children:it.actionText})
            ]}),
            (!it.isLimpah && it.snippetText && it.badgeLabel !== "Jukrah") ? (0,a.jsx)("span",{style:{display:"block",color:"var(--cas-text-secondary, #94a3b8)",fontSize:"0.74rem",marginTop:"0.15rem",fontStyle:"italic"},children:`"${String(it.snippetText).slice(0,90)}"`}) : null
          ]}),
          (0,a.jsx)("div",{style:{fontSize:"0.68rem",color:it.is_read?"#64748b":"#2563eb",fontWeight:it.is_read?500:700,marginTop:"0.2rem"},children:it.friendlyTime})
        ]}),
        !it.is_read && (0,a.jsx)("span",{style:{width:8,height:8,borderRadius:"50%",background:"#2563eb",flexShrink:0,marginTop:"0.45rem"}})
      ]
    },it.id+"_"+idx))});
  })(),
  (0,a.jsx)("div",{style:{marginTop:"0.65rem",paddingTop:"0.55rem",borderTop:"1px solid rgba(148,163,184,0.16)"},children:(0,a.jsx)(s.default,{href:"/cms/broadcaster?view=notifikasi",onClick:()=>{J(!1);setTimeout(()=>{try{window.dispatchEvent(new Event("cas-url-change"))}catch{}},25)},style:{display:"flex",alignItems:"center",justifyContent:"center",gap:"0.4rem",width:"100%",padding:"0.48rem 0.75rem",borderRadius:10,background:"rgba(37,99,235,0.12)",border:"1px solid rgba(37,99,235,0.3)",color:"#2563eb",fontSize:"0.76rem",fontWeight:800,textDecoration:"none",boxSizing:"border-box"},children:"Lihat Semua Arsip Notifikasi ➔"})})
]})]}),(0,a.jsx)("button",{type:"button",className:"cms-icon-btn",onClick:function(){let e=!v;S(e),document.documentElement.dataset.theme=e?"dark":"light",localStorage.setItem("bdb_theme",e?"dark":"light")},title:v?"Mode terang":"Mode gelap","aria-label":"Ganti tema",children:v?(0,a.jsx)(u,{id:"fld-0-gigr76s0g8t-14",name:"field_0_gigr76s0g8t_14",size:18}):(0,a.jsx)(d,{id:"fld-0-gigr76s0g8t-15",name:"field_0_gigr76s0g8t_15",size:18})}),(0,a.jsx)("button",{type:"button",className:"cms-icon-btn",onClick:function(){if(typeof window!=="undefined"){if(window.caches)caches.keys().then(function(k){k.forEach(function(n){caches.delete(n)})});try{sessionStorage.clear()}catch(e){}window.location.reload(true)}},title:"Bersihkan Cache & Refresh (Ctrl+Shift+R Otomatis)","aria-label":"Bersihkan Cache & Refresh",children:(0,a.jsx)(x.RefreshCw,{size:16})}),(0,a.jsxs)("div",{className:"cms-user",children:[(0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.55rem",cursor:"pointer"},onClick:()=>{try{sessionStorage.removeItem("cas_view_user")}catch(e){}casNav(o,"/cms/profile")},title:"Klik untuk membuka Profil Saya",children:[(0,a.jsxs)("div",{className:"cms-user-meta",children:[(0,a.jsxs)("div",{className:"cms-user-name",style:{display:"inline-flex",alignItems:"center",gap:"4px",justifyContent:"flex-end"},children:[eo,(0,a.jsx)("span",{title:isVendorRole?"Vendor / Mitra (Read-Only)":isSuper?"Superadmin Terverifikasi":(function(){var r=String(curUser?.role_bdb||curUser?.role?.role_name||curUser?.role||'').toLowerCase();if(r.includes('binops'))return"Admin Binops Terverifikasi";if(r.includes('viewer')||r.includes('pimpinan'))return"Viewer Terverifikasi";return"Operator Satker Terverifikasi";})(),style:{display:"inline-flex",alignItems:"center",justifyContent:"center",width:"14px",height:"14px",flexShrink:0,verticalAlign:"middle"},children:(0,a.jsxs)("svg",{viewBox:"0 0 24 24",width:14,height:14,fill:"none",style:{display:"block",filter:"drop-shadow(0 1px 2px rgba(0,0,0,0.22))"},children:[(0,a.jsx)("path",{d:"M12 1.25L14.69 3.04L17.91 2.75L19.44 5.6L22.25 7.13L21.96 10.35L23.75 13.04L21.96 15.73L22.25 18.95L19.44 20.48L17.91 23.33L14.69 23.04L12 24.83L9.31 23.04L6.09 23.33L4.56 20.48L1.75 18.95L2.04 15.73L0.25 13.04L2.04 10.35L1.75 7.13L4.56 5.6L6.09 2.75L9.31 3.04L12 1.25Z",transform:"scale(0.92) translate(1, 0)",fill:isVendorRole?"#0d9488":isSuper?"#f59e0b":(function(){var r=String(curUser?.role_bdb||curUser?.role?.role_name||curUser?.role||'').toLowerCase();if(r.includes('binops'))return"#6366f1";if(r.includes('viewer')||r.includes('pimpinan'))return"#64748b";return"#0095f6";})()}),(0,a.jsx)("path",{d:"M8.5 12.5L10.8 14.8L15.8 9.8",stroke:"#ffffff",strokeWidth:2.3,strokeLinecap:"round",strokeLinejoin:"round"})]})})]}),(0,a.jsx)("div",{className:"cms-user-role",children:userSatkerDisp})]}),(0,a.jsx)("div",{className:"cms-user-avatar",children:ec})]}),(0,a.jsxs)("button",{type:"button",className:`cms-logout${isLoggingOut?" cas-logging-out":""}`,onClick:function(){if(isLoggingOut)return;setIsLoggingOut(!0);setTimeout(function(){(0,R.logout)(),window.location.replace("/login")},320)},title:"Keluar","aria-label":"Keluar",style:{display:"inline-flex",alignItems:"center",gap:"0.36rem",padding:"0 0.78rem",height:"2.2rem",width:"auto",minWidth:"max-content",flexShrink:0,whiteSpace:"nowrap",borderRadius:8,fontWeight:700,fontSize:"0.76rem"},children:[(0,a.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",width:16,height:16,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2.1,strokeLinecap:"round",strokeLinejoin:"round",className:"cas-logout-icon",children:[(0,a.jsx)("path",{className:"cas-logout-door",d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"}),(0,a.jsx)("polyline",{className:"cas-logout-arrow",points:"16 17 21 12 16 7"}),(0,a.jsx)("line",{className:"cas-logout-arrow",x1:"21",y1:"12",x2:"9",y2:"12"})]}),(0,a.jsx)("span",{className:"cas-logout-label",children:isLoggingOut?"Keluar...":"Keluar"})]})]})]})}var O=e.i(70187);let T=new Set([...Object.keys(O.MASTERS),"pasal"]),I=new Set(["alur-dokumen","menu","organisasi-role","organisasi-level","organisasi-team"]),E=new Set(["email","login-otp","maintenance","pusat-bantuan"]),z={cms:"Dashboard",dashboard:"Dashboard",main:"Ringkasan",heatmap:"Peta/Heatmap",master:"Master Data","master-ref":"Master Referensi",user:"Pengguna",organisasi:"Satker",kejahatan:"Kejahatan","laporan-polisi":"Laporan","arsip-pelimpahan":"Pelimpahan","jenis-barang-bukti":"Barang Bukti","operasi-satgas":"Kelola Susopsgas",kerma:"Kerja Sama","organisasi-level":"Organisasi Level","organisasi-role":"Organisasi Role","organisasi-team":"Organisasi Team",menu:"Menu / Form",laporan:"Register","rekap-laporan-polisi":"Rekap LP","rekap-kerma":"Rekap Kerma","pihak-sering-terlibat":"Pihak Paling Sering Terlibat","rekap-pihak-terlibat":"Pihak Terlibat","rekap-barang-bukti":"Barang Bukti","rekap-operasi-satgas":"Rekap Susopsgas","kasus-menonjol":"Susopsgas","kasus-atensi":"Susopsgas","laporan-kejahatan":"LP Kejahatan","distribusi-lp":"Distribusi LP","penanganan-lp":"Penanganan LP",report:"Laporan","anev-lp":"Anev LP","kinerja-perkara":"Kinerja Perkara","anev-ctcc":"Lamp. Anev Periodik",generate:"Generate Laporan",cetak:"Cetak Analitik",pengaturan:"Sistem",satker:"Satker",email:"Email (SMTP)","login-otp":"OTP Login",maintenance:"Maintenance Sistem","pusat-bantuan":"Pusat Bantuan","alur-dokumen":"Alur Dokumen LP",profile:"Profile","reset-password":"Ganti Password","reset-totp":"Atur TOTP",broadcaster:"Sharese",pengumuman:"Moderasi",panduan:"Panduan Pengguna",integrasi:"Portal Integrasi",dors:"Tarik Data","dors-data":"Staging","dors-unmapped":"Import ke Database","satker-legacy":"Cek Duplikat","master-data-gap":"Master Tidak Termapping","portal-keluar":"Keluar","satker-tree":"Struktur Satker (Puskarda)","satker-eksternal":"Satker Eksternal"},K=new Set(["master","laporan","report","integrasi","pengaturan","dashboard"]);function $(){let e=(0,r.usePathname)(),router=(0,r.useRouter)(),q=useCasLocationSearch(),sp=new URLSearchParams(q||""),viewParam=sp.get("view")||"",modeParam=sp.get("mode")||"",profileIdParam=sp.get("profileId")||"",[tickerItems,setTickerItems]=(0,t.useState)([]),[unreadTotal,setUnreadTotal]=(0,t.useState)(0);let loadTicker=(0,t.useCallback)(async()=>{try{let[nRes,mRes]=await Promise.all([M.apiAuth.get("/bdb/jukrah/notifications").catch(()=>({data:{data:[]}})),M.apiAuth.get("/bdb/jukrah/messages/conversations").catch(()=>({data:{data:[],total_unread:0}}))]);let nList=Array.isArray(nRes.data?.data)?nRes.data.data:[],convs=Array.isArray(mRes.data?.data)?mRes.data.data:[];const readSet=casGetReadNotifIds();let combined=[];convs.filter(c=>!c.is_ai&&Number(c.unread_count||0)>0&&!readSet.has("msg_"+c.partner_id)).forEach(c=>{const rawH=String(c.handle||c.callsign||c.username||"").trim();const senderHandle=rawH?(rawH.startsWith("@")?rawH:`@${rawH}`):"@rekan";const shortMsg=casCleanQuoteSnippet(c.last_message,45);combined.push({id:"msg_"+c.partner_id,badge:"Obrolan",color:"#16a34a",link:`/cms/broadcaster?view=obrolan&partner=${c.partner_id}`,text:shortMsg?`${senderHandle} mengirim pesan: "${shortMsg}"`:`${senderHandle} mengirim ${c.unread_count} pesan baru`})});nList.map(humanizeCasNotification).filter(h=>!h.is_read).slice(0,14).forEach(h=>{let b=h.badgeLabel||(h.isLimpah?"Limpah":h.category==="dinas"?"Jukrah":"Sharese");let c=b==="Limpah"?"#7c3aed":b==="Jukrah"?"#2563eb":b==="Obrolan"?"#16a34a":"#d97706";combined.push({id:String(h.id),badge:b,color:c,link:h.link||"/cms/broadcaster?view=notifikasi",text:h.tickerText||h.actionText})});setTickerItems(combined);setUnreadTotal(combined.length)}catch{}},[]);(0,t.useEffect)(()=>{loadTicker();let iv=setInterval(loadTicker,45e3);let onUpd=()=>loadTicker();window.addEventListener("cas-notif-updated",onUpd);return()=>{clearInterval(iv);window.removeEventListener("cas-notif-updated",onUpd)}},[loadTicker]);const handleTickerItemClick=async(ev,it)=>{if(ev)ev.stopPropagation();if(it&&it.id){casMarkNotifIdsReadLocal([it.id]);setTickerItems(prev=>{const next=prev.filter(x=>String(x.id)!==String(it.id));setUnreadTotal(next.length);return next;});if(/^\d+$/.test(String(it.id))){try{await M.apiAuth.post(`/bdb/jukrah/notifications/${it.id}/read`)}catch{}}}casNav(router,(it&&it.link)||"/cms/broadcaster?view=notifikasi")};let n=e.split("/").filter(Boolean),l=n.map((seg,a)=>{let t="/"+n.slice(0,a+1).join("/"),isLast=a===n.length-1;if("cms"===seg)return{seg,label:"Dashboard",href:"/cms/dashboard/main",clickable:!isLast};if("main"===seg&&"dashboard"===n[a-1]&&"peta-kejahatan"===viewParam)return{seg:"peta-kejahatan",label:"Peta Kejahatan",href:"/cms/dashboard/main?view=peta-kejahatan",clickable:!1};if("master"===seg){let s=n[a+1];return s&&I.has(s)?{seg,label:"Kelola Pengaturan",href:"/cms/pengaturan/email",clickable:!0}:s==="operasi-satgas"?{seg,label:"Susopsgas",href:"/cms/laporan/rekap-operasi-satgas",clickable:!0}:s&&T.has(s)?{seg,label:"Master Referensi",href:"/cms/master-ref",clickable:!isLast}:{seg,label:"Master Data",href:t,clickable:!1}}if("pengaturan"===seg){let s=n[a+1];return s&&E.has(s)?{seg,label:"Kelola Pengaturan",href:"/cms/pengaturan/email",clickable:!1}:{seg,label:"Sistem",href:t,clickable:!1}}if("laporan"===seg){let s=n[a+1];if(s==="rekap-operasi-satgas"||s==="kasus-menonjol"||s==="kasus-atensi")return{seg,label:"Susopsgas",href:"/cms/laporan/rekap-operasi-satgas",clickable:!1};return{seg,label:"Register",href:t,clickable:!1}}if("broadcaster"===seg){if(viewParam==="pusat-bantuan")return{seg,label:"Sistem",href:"/cms/broadcaster?view=pusat-bantuan",clickable:!1};return{seg,label:"Sharese",href:"/cms/broadcaster",clickable:Boolean(viewParam)}}if("profile"===seg){return{seg,label:"Sharese",href:"/cms/broadcaster",clickable:!0}}if("pengumuman"===seg){return{seg,label:"Sharese",href:"/cms/broadcaster",clickable:!0}}if("laporan-polisi"===seg){return{seg,label:"Laporan",href:"/cms/laporan-polisi",clickable:!isLast}}if(a>0&&"laporan-polisi"===n[a-1]&&"arsip-pelimpahan"!==seg){return{seg,label:"Detail LP",href:t,clickable:!1}}let s=!isLast&&!K.has(seg);return{seg,label:z[seg]||O.MASTERS[seg]?.title||seg.replace(/-/g," ").replace(/\b\w/g,c=>c.toUpperCase()),href:t,clickable:s}});if(e==="/cms/broadcaster"){if(viewParam==="obrolan")l.push({seg:"obrolan",label:"Obrolan",href:"/cms/broadcaster?view=obrolan",clickable:!1});else if(viewParam==="koneksi"){l.push({seg:"koneksi",label:"Koneksi",href:"/cms/broadcaster?view=koneksi",clickable:Boolean(profileIdParam)});if(profileIdParam)l.push({seg:"profil-personil",label:"Profil Personil",href:`/cms/broadcaster?view=koneksi&profileId=${profileIdParam}`,clickable:!1})}else if(viewParam==="notifikasi")l.push({seg:"notifikasi",label:"Notifikasi",href:"/cms/broadcaster?view=notifikasi",clickable:!1});else if(viewParam==="insight")l.push({seg:"insight",label:"Insight",href:"/cms/broadcaster?view=insight",clickable:!1});else if(viewParam==="pusat-bantuan")l.push({seg:"pusat-bantuan",label:"Pusat Bantuan",href:"/cms/broadcaster?view=pusat-bantuan",clickable:!1});else l.push({seg:"feed",label:"Feed",href:"/cms/broadcaster",clickable:!1})}else if(e==="/cms/profile"){if(viewParam==="keamanan")l.push({seg:"keamanan",label:"Keamanan",href:"/cms/profile?view=keamanan",clickable:!1});else l.push({seg:"profil-saya",label:"Profile",href:"/cms/profile",clickable:!1})}else if(e==="/cms/pengumuman"){l.push({seg:"moderasi",label:"Moderasi",href:"/cms/pengumuman",clickable:!1})}else if(e==="/cms/panduan"){l.push({seg:modeParam==="kelola"?"kelola":"rekap",label:modeParam==="kelola"?"Kelola":"Rekap",href:modeParam==="kelola"?"/cms/panduan?mode=kelola":"/cms/panduan",clickable:!1})}let i=l.filter((e,a)=>0===a||e.label!==l[a-1].label);return(0,a.jsxs)("nav",{className:"cms-breadcrumb","aria-label":"breadcrumb",style:{display:"flex",alignItems:"center",justifyContent:"flex-start",gap:"0.85rem",flexWrap:"nowrap"},children:[(0,a.jsx)("style",{dangerouslySetInnerHTML:{__html:"@keyframes casTickerMarquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}.cas-ticker-track{display:inline-flex;align-items:center;gap:2.8rem;white-space:nowrap;will-change:transform;animation:casTickerMarquee 220s linear infinite}.cas-ticker-inline:hover .cas-ticker-track{animation-play-state:paused}@keyframes casPulseDot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.45;transform:scale(0.88)}}"}}),(0,a.jsx)("ol",{style:{margin:0,flex:"0 0 auto",minWidth:0,overflowX:"auto"},children:i.map((e,t)=>{let r=t===i.length-1;return(0,a.jsxs)("li",{children:[t>0&&(0,a.jsx)("i",{className:"pi pi-angle-right cms-bc-chevron"}),e.clickable&&!r?(0,a.jsx)(s.default,{href:e.href,prefetch:!1,children:e.label}):(0,a.jsx)("span",{className:r?"cms-bc-current":"cms-bc-muted",children:e.label})]},e.href+t)})}),(0,a.jsxs)("div",{className:"cas-ticker-inline",role:"button",tabIndex:0,title:"Klik item notifikasi untuk membaca dan membuka detail, atau klik untuk membuka Arsip Notifikasi",onClick:()=>casNav(router,"/cms/broadcaster?view=notifikasi"),onKeyDown:ev=>{if(ev.key==="Enter"||ev.key===" ")casNav(router,"/cms/broadcaster?view=notifikasi")},style:{flex:"1 1 0%",minWidth:"120px",overflow:"hidden",background:"transparent",border:"none",borderLeft:"1.5px solid var(--cas-border, rgba(148,163,184,0.4))",borderRadius:0,padding:"0 0 0 0.85rem",display:"flex",alignItems:"center",gap:"0.75rem",cursor:"pointer",boxShadow:"none",userSelect:"none"},children:[(0,a.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.35rem",color:unreadTotal>0?"#dc2626":"#16a34a",fontSize:"0.72rem",fontWeight:800,flexShrink:0,paddingRight:"0.15rem"},children:[(0,a.jsx)("span",{style:{width:6,height:6,borderRadius:"50%",background:unreadTotal>0?"#dc2626":"#16a34a",animation:unreadTotal>0?"casPulseDot 2s infinite":"none"}}),unreadTotal>0?`${unreadTotal>99?"99+":unreadTotal} Baru`:"✓ Terbaca"]}),tickerItems.length===0?(0,a.jsx)("span",{style:{fontSize:"0.74rem",color:"var(--cas-text-muted, #64748b)",fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:"Semua notifikasi terbaru telah dibaca — klik untuk melihat arsip riwayat notifikasi"}):(0,a.jsx)("div",{style:{flex:1,minWidth:0,overflow:"hidden",position:"relative",maskImage:"linear-gradient(to right, transparent 0px, #000 18px, #000 calc(100% - 18px), transparent 100%)",WebkitMaskImage:"linear-gradient(to right, transparent 0px, #000 18px, #000 calc(100% - 18px), transparent 100%)"},children:(0,a.jsx)("div",{className:"cas-ticker-track",children:(tickerItems.length>1?[...tickerItems,...tickerItems]:tickerItems).map((it,idx)=>(0,a.jsxs)("span",{onClick:ev=>handleTickerItemClick(ev,it),style:{display:"inline-flex",alignItems:"center",gap:"0.42rem",fontSize:"0.75rem",color:"var(--cas-text-secondary, #475569)",cursor:"pointer"},children:[(0,a.jsx)("span",{style:{fontSize:"0.66rem",fontWeight:800,padding:"0.08rem 0.46rem",borderRadius:999,background:it.badge==="Limpah"?"rgba(124,58,237,0.14)":it.badge==="Jukrah"?"rgba(37,99,235,0.12)":it.badge==="Obrolan"?"rgba(22,163,74,0.12)":"rgba(217,119,6,0.12)",color:it.color||"#0284c7"},children:it.badge}),(0,a.jsx)("span",{style:{fontWeight:500},children:it.text})]},it.id+"_"+idx))})})]})]})}
function TacticalMessengerWidget() {
  const router = (0, r.useRouter)();
  const [isOpen, setIsOpen] = (0, t.useState)(false);
  const [activeTarget, setActiveTarget] = (0, t.useState)(null);
  const [messages, setMessages] = (0, t.useState)([]);
  const [inputVal, setInputVal] = (0, t.useState)("");
  const [sending, setSending] = (0, t.useState)(false);
  const [replyTo, setReplyTo] = (0, t.useState)(null);
  const msgEndRef = (0, t.useRef)(null);

  const loadThread = (0, t.useCallback)(async (targetObj) => {
    const tid = targetObj?.id ?? -1;
    try {
      const res = await M.apiAuth.get(`/bdb/jukrah/messages/thread/${tid}`);
      const list = Array.isArray(res.data?.data) ? res.data.data : [];
      setMessages(list.map(m => ({
        id: m.id,
        sender: m.is_mine ? 'me' : 'them',
        senderName: m.sender_name || (m.is_mine ? 'Anda' : (targetObj?.name || 'Rekan')),
        text: m.content,
        reply_to: m.reply_to || null,
        time: m.created_at ? new Date(m.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : ''
      })));
      if (res.data?.partner && !targetObj?.name) {
        setActiveTarget({
          id: res.data.partner.id,
          name: res.data.partner.name,
          callsign: res.data.partner.handle,
          satker: res.data.partner.satker,
          photo: res.data.partner.photo_url
        });
      }
    } catch {
      setMessages([{
        id: 'sys-1',
        sender: 'system',
        text: '🔒 Saluran Obrolan Kedinasan & Koordinasi Personel Polri siap digunakan.',
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  }, []);

  (0, t.useEffect)(() => {
    function handleOpenChat(ev) {
      const target = ev?.detail;
      if (target) {
        const norm = {
          id: target.id ?? -1,
          name: target.name || target.callsign || 'AI Agen Taktis CAS',
          callsign: target.callsign || target.handle || '@ai_taktis_cas',
          satker: target.satker || 'Robinopsnal Bareskrim Polri',
          photo: target.photo || target.photo_url || null
        };
        setActiveTarget(norm);
        setIsOpen(true);
        loadThread(norm);
      } else {
        setIsOpen(prev => !prev);
      }
    }
    window.addEventListener('cas-open-tactical-chat', handleOpenChat);
    return () => window.removeEventListener('cas-open-tactical-chat', handleOpenChat);
  }, [loadThread]);

  (0, t.useEffect)(() => {
    if (isOpen) {
      loadThread(activeTarget || { id: -1 });
    }
  }, [isOpen, activeTarget, loadThread]);

  (0, t.useEffect)(() => {
    if (msgEndRef.current) {
      msgEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const text = (textToSend || inputVal || "").trim();
    if (!text || sending) return;
    const tid = activeTarget?.id ?? -1;
    const nowTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const currentReply = replyTo;
    setInputVal("");
    setReplyTo(null);
    setSending(true);
    setMessages(prev => [...prev, { id: 'temp-' + Date.now(), sender: 'me', senderName: 'Anda', text, reply_to: currentReply, time: nowTime }]);
    try {
      const res = await M.apiAuth.post('/bdb/jukrah/messages/send', { receiver_id: tid, content: text, reply_to: currentReply });
      if (res.data?.ai_reply) {
        const aiMsg = res.data.ai_reply;
        setMessages(prev => [...prev, {
          id: aiMsg.id,
          sender: 'them',
          senderName: defaultTarget.name,
          text: aiMsg.content,
          time: new Date(aiMsg.created_at || Date.now()).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        }]);
      }
      try { window.dispatchEvent(new Event('cas-notif-updated')); } catch {}
    } catch {} finally {
      setSending(false);
    }
  };

  const defaultTarget = activeTarget || {
    id: -1,
    name: 'AI Agen Taktis CAS',
    callsign: '@ai_taktis_cas',
    satker: 'Robinopsnal Bareskrim Polri',
    photo: '/images/default-avatar-polki.png'
  };

  return (0, a.jsxs)("div",{
    id: "cas-floating-tactical-messenger",
    style: { position: "fixed", bottom: "24px", right: "24px", zIndex: 9999, fontFamily: "inherit" },
    children: [
      isOpen && (0, a.jsxs)("div", {
        style: {
          position: "absolute",
          bottom: "68px",
          right: "0",
          width: "385px",
          height: "520px",
          maxWidth: "92vw",
          maxHeight: "76vh",
          background: "var(--cas-card-bg, #ffffff)",
          border: "1px solid var(--cas-border-strong, rgba(148,163,184,0.35))",
          borderRadius: "12px",
          boxShadow: "0 20px 50px rgba(15,23,42,0.32)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        },
        children: [
          (0, a.jsxs)("div", {
            style: {
              background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
              padding: "0.75rem 0.95rem",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.5rem"
            },
            children: [
              (0, a.jsxs)("div", {
                style: { display: "flex", alignItems: "center", gap: "0.65rem", minWidth: 0, flex: 1 },
                children: [
                  (0, a.jsxs)("div", {
                    style: { position: "relative", width: "38px", height: "38px", borderRadius: "50%", background: "#0f172a", border: "2px solid rgba(255,255,255,0.8)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.85rem", color: "#fff", flexShrink: 0 },
                    children: [
                      defaultTarget.photo ? (0, a.jsx)("img", { src: defaultTarget.photo, alt: "Avatar", onError: ev => { ev.currentTarget.onerror = null; ev.currentTarget.src = "/images/default-avatar-polki.png"; }, style: { width: "100%", height: "100%", objectFit: "cover" } }) : (defaultTarget.name || 'P').charAt(0).toUpperCase(),
                      (0, a.jsx)("span", { style: { position: "absolute", bottom: "1px", right: "1px", width: "9px", height: "9px", borderRadius: "50%", background: "#22c55e", border: "1.5px solid #fff" } })
                    ]
                  }),
                  (0, a.jsxs)("div", {
                    style: { minWidth: 0 },
                    children: [
                      (0, a.jsxs)("div", {
                        style: { fontWeight: 800, fontSize: "0.86rem", color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "flex", alignItems: "center", gap: "0.35rem" },
                        children: [
                          (0, a.jsx)("span", { children: defaultTarget.name || defaultTarget.callsign }),
                          (0, a.jsx)("span", { style: { fontSize: "0.66rem", background: "rgba(255,255,255,0.2)", padding: "0.08rem 0.38rem", borderRadius: "999px", fontWeight: 700 }, children: "🟢 Aktif" })
                        ]
                      }),
                      (0, a.jsx)("div", {
                        style: { fontSize: "0.7rem", color: "#dbeafe", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
                        children: `${defaultTarget.callsign || "@personel"} · ${defaultTarget.satker || "Robinopsnal Bareskrim Polri"}`
                      })
                    ]
                  })
                ]
              }),
              (0, a.jsxs)("div", {
                style: { display: "flex", alignItems: "center", gap: "0.35rem", flexShrink: 0 },
                children: [
                  (0, a.jsx)("button", {
                    type: "button",
                    title: "Buka di Halaman Penuh Obrolan",
                    onClick: () => {
                      setIsOpen(false);
                      casNav(router, `/cms/broadcaster?view=obrolan&partner=${defaultTarget.id ?? -1}`);
                    },
                    style: { background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.35)", color: "#fff", borderRadius: "8px", padding: "0.26rem 0.55rem", cursor: "pointer", fontSize: "0.7rem", fontWeight: 700, whiteSpace: "nowrap" },
                    children: "⛶ Buka Penuh"
                  }),
                  (0, a.jsx)("button", {
                    type: "button",
                    onClick: () => setIsOpen(false),
                    style: { background: "rgba(0,0,0,0.2)", border: "none", color: "#fff", borderRadius: "50%", width: "28px", height: "28px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", fontWeight: 700 },
                    children: "✕"
                  })
                ]
              })
            ]
          }),

          (0, a.jsxs)("div", {
            style: { flex: 1, overflowY: "auto", padding: "0.9rem", display: "flex", flexDirection: "column", gap: "0.55rem", background: "var(--cas-surface-subtle, #f1f5f9)" },
            children: [
              messages.map((m, idx) => {
                if (m.sender === 'system') {
                  return (0, a.jsx)("div", {
                    key: m.id || idx,
                    style: { background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.2)", borderRadius: "10px", padding: "0.35rem 0.75rem", fontSize: "0.7rem", color: "var(--cas-text-secondary, #64748b)", textAlign: "center", alignSelf: "center" },
                    children: m.text
                  });
                }
                const isMe = m.sender === 'me';
                return (0, a.jsxs)("div", {
                  key: m.id || idx,
                  style: { display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start" },
                  children: [
                    (0, a.jsxs)("div", {
                      onClick: () => setReplyTo({ id: m.id, sender_name: m.senderName || (isMe ? "Anda" : defaultTarget.name), content: m.text }),
                      title: "Ketuk untuk membalas pesan ini",
                      style: {
                        maxWidth: "82%",
                        padding: "0.55rem 0.85rem",
                        borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                        background: isMe ? "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)" : "var(--cas-card-bg, #ffffff)",
                        border: isMe ? "none" : "1px solid var(--cas-border, rgba(148,163,184,0.28))",
                        color: isMe ? "#fff" : "var(--cas-text-primary, #0f172a)",
                        fontSize: "0.8rem",
                        lineHeight: "1.45",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        boxShadow: isMe ? "0 2px 6px rgba(37,99,235,0.2)" : "0 1px 2px rgba(0,0,0,0.04)",
                        cursor: "pointer"
                      },
                      children: [
                        m.reply_to && (0, a.jsxs)("div", {
                          style: {
                            borderLeft: isMe ? "3px solid #93c5fd" : "3px solid #2563eb",
                            background: isMe ? "rgba(255,255,255,0.14)" : "var(--cas-surface-subtle, rgba(148,163,184,0.12))",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "6px",
                            marginBottom: "0.35rem",
                            fontSize: "0.7rem"
                          },
                          children: [
                            (0, a.jsx)("div", { style: { fontWeight: 700, opacity: 0.9 }, children: m.reply_to.sender_name || "Kutipan" }),
                            (0, a.jsx)("div", { style: { opacity: 0.85, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: m.reply_to.content })
                          ]
                        }),
                        (0, a.jsx)("div", { children: m.text }),
                        (0, a.jsxs)("div", {
                          style: { fontSize: "0.64rem", color: isMe ? "rgba(255,255,255,0.78)" : "var(--cas-text-muted, #64748b)", marginTop: "0.2rem", display: "flex", justifyContent: "flex-end", gap: "0.25rem", alignItems: "center" },
                          children: [
                            m.time,
                            isMe && (0, a.jsx)("span", { style: { color: "#93c5fd", fontWeight: 800 }, children: "✓✓" })
                          ]
                        })
                      ]
                    })
                  ]
                });
              }),
              (0, a.jsx)("div", { ref: msgEndRef })
            ]
          }),

          replyTo && (0, a.jsxs)("div", {
            style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", padding: "0.4rem 0.75rem", background: "var(--cas-surface-subtle)", borderTop: "1px solid var(--cas-border)", borderLeft: "3px solid #2563eb", fontSize: "0.72rem" },
            children: [
              (0, a.jsxs)("div", { style: { minWidth: 0, flex: 1 }, children: [
                (0, a.jsx)("div", { style: { fontWeight: 800, color: "#2563eb" }, children: `Membalas ${replyTo.sender_name}` }),
                (0, a.jsx)("div", { style: { color: "var(--cas-text-secondary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: replyTo.content })
              ]}),
              (0, a.jsx)("button", { type: "button", onClick: () => setReplyTo(null), style: { background: "none", border: "none", color: "var(--cas-text-muted)", cursor: "pointer", fontWeight: 800, fontSize: "0.9rem" }, children: "×" })
            ]
          }),

          (0, a.jsx)("div", {
            style: { display: "flex", gap: "0.35rem", padding: "0.4rem 0.65rem", background: "var(--cas-card-bg)", overflowX: "auto", borderTop: "1px solid var(--cas-border)" },
            children: (defaultTarget.id === -1 ? [
              { label: "⚖️ KUHP Baru", text: "Jelaskan pemetaan pasal KUHP Baru (UU 1/2023) pada Laporan Polisi." },
              { label: "🔄 Panduan DORS", text: "Bagaimana tahapan sinkronisasi data LP dari DORS?" },
              { label: "📋 Koordinasi Selra", text: "Mohon koordinasi progres penyelesaian perkara (Selra)." }
            ] : [
              { label: "👍 Siap, ditindaklanjuti", text: "👍 Siap, segera kami tindaklanjuti." },
              { label: "🙏 Terima kasih infonya", text: "🙏 Terima kasih atas informasinya, Rekan." },
              { label: "🫡 Siap Komandan", text: "🫡 Siap Komandan, arahan dimonitor." }
            ]).map((chip, idx) => (0, a.jsx)("button", {
              key: idx,
              type: "button",
              onClick: () => handleSend(chip.text),
              style: { background: "var(--cas-surface-subtle)", border: "1px solid var(--cas-border-strong)", borderRadius: "999px", color: "#2563eb", padding: "0.22rem 0.55rem", fontSize: "0.68rem", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" },
              children: chip.label
            }))
          }),

          (0, a.jsxs)("div", {
            style: { padding: "0.55rem 0.75rem", background: "var(--cas-card-bg)", borderTop: "1px solid var(--cas-border)", display: "flex", gap: "0.45rem", alignItems: "center" },
            children: [
              (0, a.jsx)("input", {
                type: "text",
                value: inputVal,
                onChange: ev => setInputVal(ev.target.value),
                onKeyDown: ev => { if (ev.key === 'Enter') handleSend(); },
                placeholder: "Tulis pesan... (Enter untuk kirim)",
                style: { flex: 1, background: "var(--cas-surface-subtle)", border: "1px solid var(--cas-border-strong)", borderRadius: "10px", padding: "0.48rem 0.85rem", color: "var(--cas-text-primary)", fontSize: "0.82rem", outline: "none" }
              }),
              (0, a.jsx)("button", {
                type: "button",
                disabled: sending,
                onClick: () => handleSend(),
                style: { width: "36px", height: "36px", borderRadius: "50%", background: "#2563eb", border: "none", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, boxShadow: "0 2px 8px rgba(37,99,235,0.35)" },
                children: (0, a.jsx)("svg", { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round", children: [(0, a.jsx)("line", { x1: "22", y1: "2", x2: "11", y2: "13" }), (0, a.jsx)("polygon", { points: "22 2 15 22 11 13 2 9 22 2" })] })
              })
            ]
          })
        ]
      }),

      (0, a.jsxs)("button", {
        type: "button",
        onClick: () => setIsOpen(prev => !prev),
        title: "Obrolan Cepat & Asisten CAS",
        style: {
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
          border: "2px solid rgba(255, 255, 255, 0.85)",
          boxShadow: "0 8px 24px rgba(37, 99, 235, 0.45), 0 2px 6px rgba(0,0,0,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: "1.35rem",
          cursor: "pointer",
          position: "relative",
          outline: "none"
        },
        children: [
          (0, a.jsx)("span", { children: isOpen ? "✕" : "💬" }),
          !isOpen && (0, a.jsx)("span", {
            style: {
              position: "absolute",
              top: "-1px",
              right: "-1px",
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              background: "#22c55e",
              border: "2.5px solid #fff"
            }
          })
        ]
      })
    ]
  });
}

var D=e.i(81539),B=e.i(73670);
function CasKelolaPengaturanTabs({user:u,pathname:curPath}){
  const router=(0,r.useRouter)();
  const{isSuperadmin:isSuper}=(0,R.deriveRoles)(u);
  const allTabs=[
    {key:"email",label:"✉️ Email (SMTP)",to:"/cms/pengaturan/email",superOnly:!1},
    {key:"otp",label:"🔐 OTP Login",to:"/cms/pengaturan/login-otp",superOnly:!1},
    {key:"maintenance",label:"🛠️ Maintenance Sistem",to:"/cms/pengaturan/maintenance",superOnly:!0},
    {key:"pusat-bantuan",label:"🎧 Konfigurasi Pusat Bantuan",to:"/cms/pengaturan/pusat-bantuan",superOnly:!1},
    {key:"alur-dokumen",label:"📑 Alur Dokumen LP",to:"/cms/master/alur-dokumen",superOnly:!1},
    {key:"organisasi-role",label:"🪪 Organisasi Role",to:"/cms/master/organisasi-role",superOnly:!0},
    {key:"menu",label:"🧩 Hak Akses Menu / Form",to:"/cms/master/menu",superOnly:!0}
  ].filter(tb=>!tb.superOnly||isSuper);
  return(0,a.jsxs)("div",{style:{marginBottom:"1.15rem",padding:"0.9rem 1.1rem",borderRadius:14,background:"var(--cas-card-bg)",border:"1px solid var(--cas-border-strong)",boxShadow:"0 4px 16px rgba(15,23,42,0.06)"},children:[
    (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.75rem",flexWrap:"wrap",marginBottom:"0.75rem"},children:[
      (0,a.jsxs)("div",{children:[
        (0,a.jsx)("div",{style:{fontSize:"0.96rem",fontWeight:800,color:"var(--cas-text-primary)",display:"flex",alignItems:"center",gap:"0.45rem"},children:["⚙️ Kelola Pengaturan Sistem Terpadu — Big Data Binops"]}),
        (0,a.jsx)("div",{style:{fontSize:"0.76rem",color:"var(--cas-text-muted)",marginTop:"0.15rem"},children:"Pusat konfigurasi SMTP, kebijakan OTP Login, Maintenance, Pusat Bantuan, Alur Dokumen LP, Role Organisasi, dan Matriks Menu RBAC."})
      ]}),
      (0,a.jsx)("span",{style:{fontSize:"0.7rem",fontWeight:800,padding:"0.22rem 0.65rem",borderRadius:999,background:"rgba(56,189,248,0.14)",border:"1px solid rgba(56,189,248,0.35)",color:"#0284c7"},children:isSuper?"Akses Superadmin Penuh":"Akses Admin Binops"})
    ]}),
    (0,a.jsx)("div",{style:{display:"flex",alignItems:"center",gap:"0.45rem",flexWrap:"wrap"},children:allTabs.map(tb=>{
      const active=curPath===tb.to||curPath.startsWith(tb.to+"/");
      return(0,a.jsx)("button",{type:"button",onClick:()=>casNav(router,tb.to),style:{padding:"0.45rem 0.85rem",borderRadius:9,border:active?"1.5px solid #38bdf8":"1px solid var(--cas-border)",background:active?"linear-gradient(135deg, #0284c7 0%, #2563eb 100%)":"var(--cas-surface-subtle)",color:active?"#ffffff":"var(--cas-text-secondary)",fontSize:"0.78rem",fontWeight:active?800:600,cursor:"pointer",transition:"all 0.15s ease",boxShadow:active?"0 4px 12px rgba(2,132,199,0.35)":"none"},children:tb.label},tb.key);
    })})
  ]});
}

function CasObrolanFullPage({user:curUser,searchStr}){
  const router=(0,r.useRouter)();
  const sp=new URLSearchParams(searchStr||"");
  const initPartner=sp.get("partner")?Number(sp.get("partner")):-1;
  const[convs,setConvs]=(0,t.useState)([]);
  const[selectedId,setSelectedId]=(0,t.useState)(isNaN(initPartner)?-1:initPartner);
  const[partner,setPartner]=(0,t.useState)(null);
  const[messages,setMessages]=(0,t.useState)([]);
  const[loadingConvs,setLoadingConvs]=(0,t.useState)(!0);
  const[loadingThread,setLoadingThread]=(0,t.useState)(!1);
  const[searchQ,setSearchQ]=(0,t.useState)("");
  const[convFilter,setConvFilter]=(0,t.useState)("all");
  const[dirResults,setDirResults]=(0,t.useState)([]);
  const[msgText,setMsgText]=(0,t.useState)("");
  const[sending,setSending]=(0,t.useState)(!1);
  const[replyToMessage,setReplyToMessage]=(0,t.useState)(null);
  const[localReactions,setLocalReactions]=(0,t.useState)({});
  const[hoveredMsgId,setHoveredMsgId]=(0,t.useState)(null);
  const[copyToast,setCopyToast]=(0,t.useState)("");
  const[showEmojiPicker,setShowEmojiPicker]=(0,t.useState)(!1);
  const[attachedFile,setAttachedFile]=(0,t.useState)(null);
  const[threadSearchOpen,setThreadSearchOpen]=(0,t.useState)(!1);
  const[threadSearchQ,setThreadSearchQ]=(0,t.useState)("");
  const[infoDrawerOpen,setInfoDrawerOpen]=(0,t.useState)(!1);
  const[newMsgModalOpen,setNewMsgModalOpen]=(0,t.useState)(!1);
  const[newMsgSearch,setNewMsgSearch]=(0,t.useState)("");
  const[newMsgUsers,setNewMsgUsers]=(0,t.useState)([]);
  const[isMobileView,setIsMobileView]=(0,t.useState)(typeof window!=="undefined"?window.innerWidth<768:!1);
  const[mobileShowThread,setMobileShowThread]=(0,t.useState)(Boolean(sp.get("partner")));
  const endRef=(0,t.useRef)(null);
  const fileInputRef=(0,t.useRef)(null);
  const msgInputRef=(0,t.useRef)(null);

  (0,t.useEffect)(()=>{
    if(typeof window==="undefined")return;
    const onResize=()=>setIsMobileView(window.innerWidth<768);
    window.addEventListener("resize",onResize);
    return()=>window.removeEventListener("resize",onResize);
  },[]);

  const fetchConvs=(0,t.useCallback)(async()=>{
    try{
      const res=await M.apiAuth.get("/bdb/jukrah/messages/conversations");
      setConvs(Array.isArray(res.data?.data)?res.data.data:[]);
    }catch{}finally{setLoadingConvs(!1);}
  },[]);

  const fetchThread=(0,t.useCallback)(async(pid)=>{
    setLoadingThread(!0);
    try{
      const res=await M.apiAuth.get(`/bdb/jukrah/messages/thread/${pid}`);
      setMessages(Array.isArray(res.data?.data)?res.data.data:[]);
      if(res.data?.partner)setPartner(res.data.partner);
      try{window.dispatchEvent(new Event("cas-notif-updated"))}catch{}
    }catch{}finally{setLoadingThread(!1);}
  },[]);

  (0,t.useEffect)(()=>{fetchConvs();const iv=setInterval(fetchConvs,20000);return()=>clearInterval(iv);},[fetchConvs]);
  (0,t.useEffect)(()=>{
    if(sp.get("partner")){
      const p=Number(sp.get("partner"));
      if(!isNaN(p)){
        if(p!==selectedId)setSelectedId(p);
        setMobileShowThread(!0);
      }
    }
  },[searchStr]);
  (0,t.useEffect)(()=>{
    fetchThread(selectedId);
    setReplyToMessage(null);
    setThreadSearchQ("");
    const iv=setInterval(()=>fetchThread(selectedId),12000);
    return()=>clearInterval(iv);
  },[selectedId,fetchThread]);
  (0,t.useEffect)(()=>{endRef.current?.scrollIntoView({behavior:"smooth"});},[messages]);

  (0,t.useEffect)(()=>{
    if(!searchQ.trim()){setDirResults([]);return;}
    const timer=setTimeout(async()=>{
      try{
        const res=await M.apiAuth.get("/bdb/jukrah/network/users",{params:{search:searchQ.trim(),limit:12}});
        setDirResults(Array.isArray(res.data?.data)?res.data.data:[]);
      }catch{setDirResults([]);}
    },260);
    return()=>clearTimeout(timer);
  },[searchQ]);

  (0,t.useEffect)(()=>{
    if(!newMsgModalOpen)return;
    const timer=setTimeout(async()=>{
      try{
        const res=await M.apiAuth.get("/bdb/jukrah/network/users",{params:{search:newMsgSearch.trim()||void 0,limit:18}});
        setNewMsgUsers(Array.isArray(res.data?.data)?res.data.data:[]);
      }catch{setNewMsgUsers([]);}
    },220);
    return()=>clearTimeout(timer);
  },[newMsgModalOpen,newMsgSearch]);

  const sendMessage=async(customText)=>{
    const txt=(customText!==void 0?customText:msgText).trim();
    if((!txt&&!attachedFile)||sending)return;
    setSending(!0);
    const currentReply=replyToMessage;
    const currentFile=attachedFile;
    if(customText===void 0)setMsgText("");
    setReplyToMessage(null);
    setAttachedFile(null);
    setShowEmojiPicker(!1);
    try{
      const payload={
        receiver_id:selectedId,
        content:txt||(currentFile?`📎 Lampiran: ${currentFile.name}`:""),
        attachment_url:currentFile?.dataUrl||null,
        reply_to:currentReply?{id:currentReply.id,sender_name:currentReply.sender_name,content:currentReply.content}:null
      };
      const res=await M.apiAuth.post("/bdb/jukrah/messages/send",payload);
      const sent=res.data?.data;
      const aiRep=res.data?.ai_reply;
      setMessages(prev=>{
        const next=[...prev];
        if(sent)next.push(sent);
        if(aiRep)next.push(aiRep);
        return next;
      });
      fetchConvs();
      try{window.dispatchEvent(new Event("cas-notif-updated"))}catch{}
    }catch{}finally{setSending(!1);}
  };

  const toggleBubbleReaction=(msgId,emoji)=>{
    setLocalReactions(prev=>{
      const cur=prev[msgId]||{};
      const nextCount=cur[emoji]?0:1;
      const updated={...cur};
      if(nextCount>0)updated[emoji]=nextCount;
      else delete updated[emoji];
      return{...prev,[msgId]:updated};
    });
  };

  const handleCopyMessage=(text)=>{
    try{
      if(navigator?.clipboard?.writeText){
        navigator.clipboard.writeText(String(text||""));
      }
      setCopyToast("✓ Pesan disalin ke papan klip");
      setTimeout(()=>setCopyToast(""),2200);
    }catch{}
  };

  const handleFileChange=(ev)=>{
    const f=ev.target?.files?.[0];
    if(!f)return;
    const reader=new FileReader();
    reader.onload=()=>{
      setAttachedFile({name:f.name,size:f.size,type:f.type,dataUrl:typeof reader.result==="string"?reader.result:null});
    };
    reader.readAsDataURL(f);
    ev.target.value="";
  };

  const filteredConvs=convs.filter(c=>{
    const lm=String(c.last_message||"").trim();
    const isUnchattedPlaceholder=!lm||/Terhubung di Jejaring Sharese|Ketuk untuk memulai obrolan/i.test(lm);
    if(!c.is_ai&&Number(c.partner_id)!==Number(selectedId)&&isUnchattedPlaceholder)return!1;
    if(convFilter==="unread"&&!(Number(c.unread_count||0)>0))return!1;
    if(convFilter==="satker"&&!c.is_same_satker&&!c.is_ai)return!1;
    if(convFilter==="resmi"&&!c.is_official&&!c.is_ai)return!1;
    if(!searchQ.trim())return!0;
    const q=searchQ.toLowerCase();
    return String(c.name||"").toLowerCase().includes(q)||String(c.handle||"").toLowerCase().includes(q)||String(c.satker||"").toLowerCase().includes(q)||lm.toLowerCase().includes(q);
  });

  const rawActivePartner=partner||convs.find(c=>Number(c.partner_id)===Number(selectedId))||{
    id:selectedId,
    is_ai:selectedId===-1,
    name:selectedId===-1?"AI Agen Taktis CAS":"Personil Polri",
    handle:selectedId===-1?"@ai_taktis_cas":"@personil",
    satker:"Robinopsnal Bareskrim Polri",
    photo_url:"/images/default-avatar-polki.png",
    online:!0
  };
  const activePartner={...rawActivePartner,name:casFormatHumanName(rawActivePartner.name)};

  const displayedMessages=messages.filter(m=>{
    if(!threadSearchQ.trim())return!0;
    return String(m.content||"").toLowerCase().includes(threadSearchQ.toLowerCase());
  });

  const smartQuickReplies=selectedId===-1?[
    {label:"⚖️ Analisis Pasal KUHP Baru",text:"Jelaskan pemetaan pasal KUHP Baru (UU No. 1 Tahun 2023) pada Laporan Polisi."},
    {label:"🔄 SOP Sinkronisasi DORS",text:"Bagaimana langkah sinkronisasi dan cek duplikat LP dari Portal Integrasi DORS?"},
    {label:"📋 Panduan Selra (P21/SP3/RJ)",text:"Jelaskan ketentuan pencatatan Penyelesaian Perkara (Selra) di sistem CAS."},
    {label:"🫡 Siap Komandan",text:"🫡 Siap Komandan, arahan dimonitor dan segera ditindaklanjuti."}
  ]:[
    {label:"👍 Siap, ditindaklanjuti",text:"👍 Siap, segera kami tindaklanjuti."},
    {label:"🙏 Terima kasih infonya",text:"🙏 Terima kasih infonya, Rekan."},
    {label:"📄 Mohon kirimkan nomor LP-nya",text:"📄 Mohon kirimkan nomor LP-nya untuk kami cek di sistem."},
    {label:"🫡 Siap Komandan",text:"🫡 Siap Komandan, siap laksanakan."}
  ];

  const emojiList=["👍","❤️","🙏","🫡","✅","🔥","👏","🤝","📄","📌","⚠️","😊","😂","🎉","💬","🔍"];

  return(0,a.jsxs)("div",{style:{display:"grid",gap:"0.75rem",position:"relative"},children:[
    copyToast&&(0,a.jsx)("div",{style:{position:"fixed",bottom:"28px",left:"50%",transform:"translateX(-50%)",zIndex:10000,background:"#0f172a",color:"#fff",padding:"0.5rem 1.1rem",borderRadius:10,fontSize:"0.78rem",fontWeight:700,boxShadow:"0 8px 24px rgba(0,0,0,0.3)",border:"1px solid rgba(56,189,248,0.4)"},children:copyToast}),

    newMsgModalOpen&&(0,a.jsx)("div",{
      onClick:()=>setNewMsgModalOpen(!1),
      style:{position:"fixed",inset:0,zIndex:9998,background:"rgba(15,23,42,0.55)",backdropFilter:"blur(4px)",display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem"},
      children:(0,a.jsxs)("div",{
        onClick:e=>e.stopPropagation(),
        style:{width:"100%",maxWidth:"460px",background:"var(--cas-card-bg)",border:"1px solid var(--cas-border-strong)",borderRadius:12,boxShadow:"0 24px 60px rgba(0,0,0,0.35)",overflow:"hidden",display:"flex",flexDirection:"column",maxHeight:"80vh"},
        children:[
          (0,a.jsxs)("div",{style:{padding:"1rem 1.2rem",borderBottom:"1px solid var(--cas-border)",display:"flex",alignItems:"center",justifyContent:"space-between"},children:[
            (0,a.jsxs)("div",{children:[
              (0,a.jsx)("div",{style:{fontWeight:800,fontSize:"0.98rem",color:"var(--cas-text-primary)"},children:"✎ Mulai Pesan Baru"}),
              (0,a.jsx)("div",{style:{fontSize:"0.74rem",color:"var(--cas-text-muted)"},children:"Pilih rekan personel untuk memulai obrolan langsung (1-on-1)"})
            ]}),
            (0,a.jsx)("button",{type:"button",onClick:()=>setNewMsgModalOpen(!1),style:{background:"var(--cas-surface-subtle)",border:"none",width:30,height:30,borderRadius:"50%",cursor:"pointer",color:"var(--cas-text-primary)",fontWeight:800},children:"✕"})
          ]}),
          (0,a.jsx)("div",{style:{padding:"0.75rem 1.1rem",borderBottom:"1px solid var(--cas-border)"},children:(0,a.jsx)("input",{
            type:"text",
            autoFocus:!0,
            value:newMsgSearch,
            onChange:e=>setNewMsgSearch(e.target.value),
            placeholder:"🔍 Cari nama personel, @username, atau Satker...",
            style:{width:"100%",padding:"0.55rem 0.9rem",borderRadius:10,border:"1px solid var(--cas-border-strong)",background:"var(--cas-surface-subtle)",color:"var(--cas-text-primary)",fontSize:"0.82rem",outline:"none",boxSizing:"border-box"}
          })}),
          (0,a.jsx)("div",{style:{flex:1,overflowY:"auto",padding:"0.5rem"},children:newMsgUsers.length===0?(0,a.jsx)("div",{style:{padding:"2rem",textAlign:"center",color:"var(--cas-text-muted)",fontSize:"0.8rem"},children:"Memuat daftar rekan personel..."}):newMsgUsers.map(u=>(0,a.jsxs)("div",{
            key:"newdm_"+u.id,
            onClick:()=>{
              setSelectedId(Number(u.id));
              setPartner({id:u.id,name:u.name,handle:`@${u.callsign||u.username}`,satker:u.satker||"Polri",photo_url:u.photo_url,online:!0});
              setNewMsgModalOpen(!1);
              setMobileShowThread(!0);
            },
            style:{display:"flex",alignItems:"center",gap:"0.75rem",padding:"0.6rem 0.75rem",borderRadius:12,cursor:"pointer",transition:"background 0.15s"},
            children:[
              (0,a.jsxs)("div",{style:{position:"relative",width:42,height:42,flexShrink:0},children:[
                (0,a.jsx)("img",{src:u.photo_url||"/images/default-avatar-polki.png",alt:u.name,onError:ev=>{ev.currentTarget.onerror=null;ev.currentTarget.src="/images/default-avatar-polki.png";},style:{width:42,height:42,borderRadius:"50%",objectFit:"cover"}}),
                (0,a.jsx)("span",{style:{position:"absolute",bottom:0,right:0,width:10,height:10,borderRadius:"50%",background:"#22c55e",border:"2px solid var(--cas-card-bg)"}})
              ]}),
              (0,a.jsxs)("div",{style:{minWidth:0,flex:1},children:[
                (0,a.jsx)("div",{style:{fontWeight:700,fontSize:"0.85rem",color:"var(--cas-text-primary)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:casFormatHumanName(u.name)}),
                (0,a.jsx)("div",{style:{fontSize:"0.73rem",color:"#2563eb",fontWeight:600},children:`@${u.callsign||u.username} · ${u.satker||"Polri"}`})
              ]}),
              (0,a.jsx)("span",{style:{fontSize:"0.74rem",fontWeight:700,color:"#2563eb",padding:"0.25rem 0.6rem",borderRadius:999,background:"rgba(37,99,235,0.1)"},children:"Chat ➔"})
            ]
          }))})
        ]
      })
    }),

    (0,a.jsxs)("div",{
      style:{
        display:"grid",
        gridTemplateColumns:isMobileView?"1fr":"340px 1fr",
        height:"calc(100vh - 140px)",
        minHeight:"560px",
        background:"var(--cas-card-bg)",
        border:"1px solid var(--cas-border)",
        borderRadius:16,
        overflow:"hidden",
        boxShadow:"0 8px 30px rgba(15,23,42,0.06)"
      },
      children:[
        (!isMobileView||!mobileShowThread)&&(0,a.jsxs)("div",{
          style:{
            borderRight:isMobileView?"none":"1px solid var(--cas-border)",
            display:"flex",
            flexDirection:"column",
            background:"var(--cas-card-bg)",
            minWidth:0,
            height:"100%",
            overflow:"hidden"
          },
          children:[
            (0,a.jsxs)("div",{style:{padding:"0.9rem 1rem 0.65rem",borderBottom:"1px solid var(--cas-border)",display:"flex",flexDirection:"column",gap:"0.65rem"},children:[
              (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.5rem"},children:[
                (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[
                  (0,a.jsx)("h2",{style:{margin:0,fontSize:"1.15rem",fontWeight:800,color:"var(--cas-text-primary)"},children:"Obrolan"}),
                  (0,a.jsx)("span",{style:{fontSize:"0.68rem",fontWeight:700,padding:"0.15rem 0.5rem",borderRadius:999,background:"rgba(34,197,94,0.14)",color:"#16a34a",display:"inline-flex",alignItems:"center",gap:"0.25rem"},children:"🟢 Aktif"})
                ]}),
                (0,a.jsx)("button",{
                  type:"button",
                  onClick:()=>setNewMsgModalOpen(!0),
                  style:{padding:"0.38rem 0.75rem",borderRadius:10,border:"1px solid rgba(37,99,235,0.35)",background:"rgba(37,99,235,0.1)",color:"#2563eb",fontWeight:700,fontSize:"0.75rem",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"0.3rem"},
                  children:"✎ Pesan Baru"
                })
              ]}),
              (0,a.jsx)("input",{
                type:"text",
                value:searchQ,
                onChange:e=>setSearchQ(e.target.value),
                placeholder:"🔍 Cari obrolan, nama rekan, atau @username...",
                style:{width:"100%",padding:"0.5rem 0.9rem",borderRadius:10,border:"1px solid var(--cas-border-strong)",background:"var(--cas-surface-subtle)",color:"var(--cas-text-primary)",fontSize:"0.8rem",outline:"none",boxSizing:"border-box"}
              }),
              (0,a.jsx)("div",{style:{display:"flex",gap:"0.32rem",overflowX:"auto",paddingBottom:"0.1rem"},children:[
                {id:"all",label:"Semua"},
                {id:"unread",label:"Belum Dibaca"},
                {id:"satker",label:"Rekan Satker"},
                {id:"resmi",label:"Saluran Resmi"}
              ].map( pill => (0,a.jsx)("button",{
                key:pill.id,
                type:"button",
                onClick:()=>setConvFilter(pill.id),
                style:{
                  padding:"0.28rem 0.65rem",
                  borderRadius:8,
                  border:convFilter===pill.id?"1px solid #2563eb":"1px solid var(--cas-border)",
                  background:convFilter===pill.id?"#2563eb":"var(--cas-surface-subtle)",
                  color:convFilter===pill.id?"#ffffff":"var(--cas-text-secondary)",
                  fontSize:"0.72rem",
                  fontWeight:700,
                  cursor:"pointer",
                  whiteSpace:"nowrap",
                  transition:"all 0.15s ease"
                },
                children:pill.label
              }))})
            ]}),

            (0,a.jsxs)("div",{style:{flex:1,overflowY:"auto",padding:"0.4rem",display:"flex",flexDirection:"column",gap:"0.2rem"},children:[
              loadingConvs?(0,a.jsx)("div",{style:{padding:"2rem 1rem",textAlign:"center",color:"var(--cas-text-muted)",fontSize:"0.8rem"},children:"Memuat daftar obrolan…"}):filteredConvs.length===0?(0,a.jsx)("div",{style:{padding:"2rem 1rem",textAlign:"center",color:"var(--cas-text-muted)",fontSize:"0.8rem"},children:"Belum ada percakapan aktif. Klik ✎ Pesan Baru untuk memulai obrolan."}):filteredConvs.map(c=>{
                const isSel=Number(c.partner_id)===Number(selectedId);
                const hasUnread=Number(c.unread_count||0)>0;
                const cleanHandle=String(c.handle||"").startsWith("@")?c.handle:`@${c.handle||"personel"}`;
                return(0,a.jsxs)("div",{
                  key:"conv_"+c.partner_id,
                  onClick:()=>{
                    setSelectedId(Number(c.partner_id));
                    setMobileShowThread(!0);
                  },
                  style:{
                    display:"flex",
                    alignItems:"center",
                    gap:"0.75rem",
                    padding:"0.65rem 0.75rem",
                    borderRadius:12,
                    cursor:"pointer",
                    background:isSel?"rgba(37,99,235,0.12)":hasUnread?"rgba(37,99,235,0.05)":"transparent",
                    border:isSel?"1px solid rgba(37,99,235,0.35)":"1px solid transparent",
                    transition:"all 0.15s ease"
                  },
                  children:[
                    (0,a.jsxs)("div",{style:{position:"relative",width:48,height:48,borderRadius:"50%",flexShrink:0},children:[
                      (0,a.jsx)("img",{
                        src:c.photo_url||"/images/default-avatar-polki.png",
                        alt:c.name,
                        onError:ev=>{ev.currentTarget.onerror=null;ev.currentTarget.src="/images/default-avatar-polki.png";},
                        style:{width:48,height:48,borderRadius:"50%",objectFit:"cover",border:c.is_ai?"2px solid #2563eb":"1px solid var(--cas-border)"}
                      }),
                      (c.online||c.is_online||c.is_ai)&&(0,a.jsx)("span",{
                        style:{
                          position:"absolute",
                          bottom:1,
                          right:1,
                          width:12,
                          height:12,
                          borderRadius:"50%",
                          background:"#22c55e",
                          border:"2px solid var(--cas-card-bg)"
                        }
                      })
                    ]}),
                    (0,a.jsxs)("div",{style:{minWidth:0,flex:1},children:[
                      (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.35rem"},children:[
                        (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.35rem",minWidth:0,flex:1},children:[
                          (0,a.jsx)("span",{
                            style:{
                              fontWeight:hasUnread||isSel?800:700,
                              fontSize:"0.9rem",
                              color:"var(--cas-text-primary)",
                              whiteSpace:"nowrap",
                              overflow:"hidden",
                              textOverflow:"ellipsis"
                            },
                            children:casFormatHumanName(c.name)
                          }),
                          (0,a.jsx)("span",{
                            style:{
                              fontSize:"0.68rem",
                              color:"#2563eb",
                              background:"rgba(37,99,235,0.08)",
                              padding:"0.05rem 0.38rem",
                              borderRadius:999,
                              fontWeight:600,
                              flexShrink:0
                            },
                            children:cleanHandle
                          })
                        ]}),
                        (0,a.jsx)("span",{
                          style:{
                            fontSize:"0.7rem",
                            color:hasUnread?"#2563eb":"var(--cas-text-muted)",
                            fontWeight:hasUnread?700:500,
                            flexShrink:0
                          },
                          children:formatConvTimeShort(c.last_time)
                        })
                      ]}),
                      (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.4rem",marginTop:"0.2rem"},children:[
                        (0,a.jsxs)("div",{
                          style:{
                            fontSize:"0.78rem",
                            color:hasUnread?"var(--cas-text-primary)":"var(--cas-text-muted)",
                            fontWeight:hasUnread?700:400,
                            whiteSpace:"nowrap",
                            overflow:"hidden",
                            textOverflow:"ellipsis",
                            flex:1
                          },
                          children:[
                            c.last_is_mine&&(0,a.jsx)("span",{style:{color:"#2563eb",fontWeight:800,marginRight:"0.25rem"},children:"✓✓"}),
                            c.last_message||"Mulai percakapan..."
                          ]
                        }),
                        hasUnread&&(0,a.jsx)("span",{
                          className:"tabular-nums",
                          style:{
                            minWidth:20,
                            height:20,
                            padding:"0 6px",
                            borderRadius:999,
                            background:"#2563eb",
                            color:"#fff",
                            fontSize:"0.68rem",
                            fontWeight:800,
                            display:"inline-flex",
                            alignItems:"center",
                            justifyContent:"center",
                            flexShrink:0
                          },
                          children:c.unread_count>99?"99+":c.unread_count
                        })
                      ]})
                    ]})
                  ]
                });
              }),

              searchQ.trim()&&dirResults.length>0&&(0,a.jsxs)("div",{style:{marginTop:"0.5rem",paddingTop:"0.5rem",borderTop:"1px solid var(--cas-border)"},children:[
                (0,a.jsx)("div",{style:{fontSize:"0.7rem",fontWeight:800,color:"#2563eb",padding:"0.25rem 0.6rem"},children:"REKAN PERSONEL LAINNYA"}),
                dirResults.map(u=>(0,a.jsxs)("div",{
                  key:"dir_"+u.id,
                  onClick:()=>{
                    setSelectedId(Number(u.id));
                    setSearchQ("");
                    setMobileShowThread(!0);
                  },
                  style:{display:"flex",alignItems:"center",gap:"0.65rem",padding:"0.55rem 0.7rem",borderRadius:10,cursor:"pointer"},
                  children:[
                    (0,a.jsx)("img",{src:u.photo_url||"/images/default-avatar-polki.png",alt:u.name,onError:ev=>{ev.currentTarget.onerror=null;ev.currentTarget.src="/images/default-avatar-polki.png";},style:{width:36,height:36,borderRadius:"50%",objectFit:"cover"}}),
                    (0,a.jsxs)("div",{style:{minWidth:0,flex:1},children:[
                      (0,a.jsx)("div",{style:{fontSize:"0.82rem",fontWeight:700,color:"var(--cas-text-primary)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:casFormatHumanName(u.name)}),
                      (0,a.jsx)("div",{style:{fontSize:"0.7rem",color:"var(--cas-text-muted)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:`@${u.callsign||u.username} · ${u.satker||"Polri"}`})
                    ]})
                  ]
                }))
              ]})
            ]})
          ]
        }),

        (!isMobileView||mobileShowThread)&&(0,a.jsxs)("div",{
          style:{
            display:"flex",
            flexDirection:"column",
            minWidth:0,
            height:"100%",
            overflow:"hidden",
            background:"var(--cas-card-bg)",
            position:"relative"
          },
          children:[
            (0,a.jsxs)("div",{
              style:{
                padding:"0.75rem 1.1rem",
                borderBottom:"1px solid var(--cas-border)",
                background:"var(--cas-card-bg)",
                display:"flex",
                alignItems:"center",
                justifyContent:"space-between",
                gap:"0.75rem",
                flexWrap:"wrap",
                zIndex:2
              },
              children:[
                (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.7rem",minWidth:0,flex:1},children:[
                  isMobileView&&(0,a.jsx)("button",{
                    type:"button",
                    onClick:()=>setMobileShowThread(!1),
                    style:{padding:"0.35rem 0.65rem",borderRadius:8,border:"1px solid var(--cas-border-strong)",background:"var(--cas-surface-subtle)",color:"var(--cas-text-primary)",fontWeight:700,fontSize:"0.76rem",cursor:"pointer",flexShrink:0},
                    children:"← Kembali"
                  }),
                  (0,a.jsxs)("div",{style:{position:"relative",width:42,height:42,flexShrink:0},children:[
                    (0,a.jsx)("img",{
                      src:activePartner.photo_url||"/images/default-avatar-polki.png",
                      alt:activePartner.name,
                      onError:ev=>{ev.currentTarget.onerror=null;ev.currentTarget.src="/images/default-avatar-polki.png";},
                      style:{width:42,height:42,borderRadius:"50%",objectFit:"cover",border:"1.5px solid var(--cas-border-strong)"}
                    }),
                    (0,a.jsx)("span",{style:{position:"absolute",bottom:0,right:0,width:11,height:11,borderRadius:"50%",background:"#22c55e",border:"2px solid var(--cas-card-bg)"}})
                  ]}),
                  (0,a.jsxs)("div",{style:{minWidth:0,flex:1},children:[
                    (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.4rem",flexWrap:"wrap"},children:[
                      (0,a.jsx)("span",{style:{fontWeight:800,fontSize:"0.95rem",color:"var(--cas-text-primary)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:activePartner.name}),
                      (0,a.jsx)("span",{style:{fontSize:"0.74rem",color:"#2563eb",fontWeight:600},children:activePartner.handle||"@personel"})
                    ]}),
                    (0,a.jsx)("div",{
                      style:{fontSize:"0.74rem",color:"var(--cas-text-muted)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},
                      children:selectedId===-1||Number(selectedId)===0?`Saluran Koordinasi Resmi · ${activePartner.satker||"Robinopsnal Bareskrim Polri"}`:`🟢 Aktif · ${activePartner.satker||"Polri"}`
                    })
                  ]})
                ]}),
                (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.4rem",flexShrink:0},children:[
                  (0,a.jsx)("button",{
                    type:"button",
                    onClick:()=>setThreadSearchOpen(v=>!v),
                    title:"Cari di Obrolan",
                    style:{padding:"0.38rem 0.65rem",borderRadius:8,border:threadSearchOpen?"1px solid #2563eb":"1px solid var(--cas-border)",background:threadSearchOpen?"rgba(37,99,235,0.1)":"var(--cas-surface-subtle)",color:threadSearchOpen?"#2563eb":"var(--cas-text-secondary)",fontSize:"0.74rem",fontWeight:600,cursor:"pointer"},
                    children:"🔍 Cari di Obrolan"
                  }),
                  selectedId>0&&(0,a.jsx)("button",{
                    type:"button",
                    onClick:()=>casNav(router,`/cms/broadcaster?view=koneksi&profileId=${selectedId}`),
                    title:"Lihat Profil Personel",
                    style:{padding:"0.38rem 0.65rem",borderRadius:8,border:"1px solid var(--cas-border)",background:"var(--cas-surface-subtle)",color:"var(--cas-text-secondary)",fontSize:"0.74rem",fontWeight:600,cursor:"pointer"},
                    children:"👤 Lihat Profil"
                  }),
                  (0,a.jsx)("button",{
                    type:"button",
                    onClick:()=>setInfoDrawerOpen(v=>!v),
                    title:"Info Percakapan",
                    style:{padding:"0.38rem 0.65rem",borderRadius:8,border:infoDrawerOpen?"1px solid #2563eb":"1px solid var(--cas-border)",background:infoDrawerOpen?"rgba(37,99,235,0.1)":"var(--cas-surface-subtle)",color:infoDrawerOpen?"#2563eb":"var(--cas-text-secondary)",fontSize:"0.74rem",fontWeight:600,cursor:"pointer"},
                    children:"ℹ️ Info Percakapan"
                  })
                ]})
              ]
            }),

            threadSearchOpen&&(0,a.jsxs)("div",{
              style:{padding:"0.5rem 1rem",background:"var(--cas-surface-subtle)",borderBottom:"1px solid var(--cas-border)",display:"flex",alignItems:"center",gap:"0.5rem"},
              children:[
                (0,a.jsx)("input",{
                  type:"text",
                  autoFocus:!0,
                  value:threadSearchQ,
                  onChange:e=>setThreadSearchQ(e.target.value),
                  placeholder:"Ketik kata kunci untuk mencari pesan dalam percakapan ini...",
                  style:{flex:1,padding:"0.4rem 0.8rem",borderRadius:10,border:"1px solid var(--cas-border-strong)",background:"var(--cas-card-bg)",color:"var(--cas-text-primary)",fontSize:"0.78rem",outline:"none"}
                }),
                threadSearchQ&&(0,a.jsx)("span",{style:{fontSize:"0.72rem",color:"var(--cas-text-muted)",fontWeight:600},children:`${displayedMessages.length} hasil`}),
                (0,a.jsx)("button",{type:"button",onClick:()=>{setThreadSearchQ("");setThreadSearchOpen(!1);},style:{background:"none",border:"none",color:"var(--cas-text-muted)",cursor:"pointer",fontWeight:700},children:"✕"})
              ]
            }),

            (0,a.jsxs)("div",{style:{flex:1,display:"flex",minHeight:0,overflow:"hidden"},children:[
              (0,a.jsxs)("div",{
                style:{
                  flex:1,
                  overflowY:"auto",
                  padding:"1rem 1.2rem",
                  display:"flex",
                  flexDirection:"column",
                  gap:"0.6rem",
                  background:"var(--cas-surface-subtle)"
                },
                children:[
                  loadingThread&&messages.length===0?(0,a.jsx)("div",{style:{textAlign:"center",color:"var(--cas-text-muted)",padding:"2.5rem",fontSize:"0.84rem"},children:"Memuat riwayat percakapan…"}):displayedMessages.length===0?(0,a.jsx)("div",{style:{textAlign:"center",color:"var(--cas-text-muted)",padding:"2.5rem",fontSize:"0.84rem"},children:"Belum ada pesan yang cocok."}):displayedMessages.map((m,idx)=>{
                    const isMine=Boolean(m.is_mine);
                    const prevMsg=idx>0?displayedMessages[idx-1]:null;
                    const curDateLabel=formatDateDividerLabel(m.created_at);
                    const prevDateLabel=prevMsg?formatDateDividerLabel(prevMsg.created_at):null;
                    const showDateDivider=curDateLabel!==prevDateLabel;
                    const msgReactions={...(m.reactions||{}),...(localReactions[m.id]||{})};
                    const reactionEntries=Object.entries(msgReactions).filter(([,cnt])=>Number(cnt)>0);
                    const timeStr=m.created_at?new Date(m.created_at).toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit"}):"";
                    const isHovered=hoveredMsgId===m.id;

                    return(0,a.jsxs)(a.Fragment,{children:[
                      showDateDivider&&(0,a.jsx)("div",{
                        style:{display:"flex",justifyContent:"center",margin:"0.45rem 0"},
                        children:(0,a.jsx)("span",{
                          style:{
                            padding:"0.25rem 0.75rem",
                            borderRadius:999,
                            fontSize:"0.72rem",
                            fontWeight:600,
                            background:"var(--cas-card-bg)",
                            color:"var(--cas-text-secondary)",
                            border:"1px solid var(--cas-border)",
                            boxShadow:"0 1px 2px rgba(0,0,0,0.03)"
                          },
                          children:curDateLabel
                        })
                      }),
                      (0,a.jsxs)("div",{
                        onMouseEnter:()=>setHoveredMsgId(m.id),
                        onMouseLeave:()=>setHoveredMsgId(prev=>prev===m.id?null:prev),
                        style:{
                          display:"flex",
                          flexDirection:"column",
                          alignItems:isMine?"flex-end":"flex-start",
                          position:"relative"
                        },
                        children:[
                          (0,a.jsxs)("div",{
                            style:{
                              display:"flex",
                              alignItems:"flex-end",
                              gap:"0.5rem",
                              maxWidth:"100%",
                              flexDirection:isMine?"row-reverse":"row"
                            },
                            children:[
                              !isMine&&(0,a.jsx)("img",{
                                src:m.sender_photo||activePartner.photo_url||"/images/default-avatar-polki.png",
                                alt:m.sender_name||activePartner.name,
                                onError:ev=>{ev.currentTarget.onerror=null;ev.currentTarget.src="/images/default-avatar-polki.png";},
                                style:{width:28,height:28,borderRadius:"50%",objectFit:"cover",flexShrink:0,marginBottom:"2px"}
                              }),
                              (0,a.jsxs)("div",{
                                style:{
                                  maxWidth:"72%",
                                  padding:"0.65rem 0.9rem",
                                  borderRadius:isMine?"18px 18px 4px 18px":"18px 18px 18px 4px",
                                  background:isMine?"linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)":"var(--cas-card-bg)",
                                  border:isMine?"none":"1px solid var(--cas-border)",
                                  color:isMine?"#ffffff":"var(--cas-text-primary)",
                                  fontSize:"0.84rem",
                                  lineHeight:1.5,
                                  whiteSpace:"pre-wrap",
                                  wordBreak:"break-word",
                                  boxShadow:isMine?"0 2px 6px rgba(37,99,235,0.2)":"0 1px 2px rgba(0,0,0,0.04)",
                                  position:"relative"
                                },
                                children:[
                                  !isMine&&(Number(selectedId)===0)&&(0,a.jsx)("div",{
                                    style:{fontSize:"0.72rem",fontWeight:700,color:"#2563eb",marginBottom:"0.2rem"},
                                    children:`${m.sender_name||activePartner.name} (${m.sender_handle||activePartner.handle||"@personel"})`
                                  }),
                                  m.reply_to&&(0,a.jsxs)("div",{
                                    style:{
                                      borderLeft:isMine?"3px solid #93c5fd":"3px solid #2563eb",
                                      background:isMine?"rgba(255,255,255,0.14)":"var(--cas-surface-subtle)",
                                      padding:"0.3rem 0.55rem",
                                      borderRadius:8,
                                      marginBottom:"0.4rem",
                                      fontSize:"0.74rem"
                                    },
                                    children:[
                                      (0,a.jsx)("div",{style:{fontWeight:700,color:isMine?"#e0f2fe":"#2563eb"},children:m.reply_to.sender_name||"Pesan Sebelumnya"}),
                                      (0,a.jsx)("div",{style:{opacity:0.9,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:m.reply_to.content})
                                    ]
                                  }),
                                  m.attachment_url&&(0,a.jsx)("div",{
                                    style:{marginBottom:"0.4rem"},
                                    children:String(m.attachment_url).startsWith("data:image")||/\.(png|jpe?g|gif|webp)$/i.test(String(m.attachment_url))
                                      ?(0,a.jsx)("img",{src:m.attachment_url,alt:"Lampiran",style:{maxWidth:"100%",maxHeight:220,borderRadius:10,display:"block"}})
                                      :(0,a.jsx)("a",{href:m.attachment_url,target:"_blank",rel:"noreferrer",style:{display:"inline-flex",alignItems:"center",gap:"0.35rem",padding:"0.35rem 0.65rem",borderRadius:8,background:isMine?"rgba(255,255,255,0.16)":"var(--cas-surface-subtle)",color:isMine?"#fff":"#2563eb",fontSize:"0.76rem",fontWeight:700,textDecoration:"none"},children:"📎 Buka Dokumen Lampiran"})
                                  }),
                                  (0,a.jsx)("div",{children:m.content}),
                                  (0,a.jsxs)("div",{
                                    style:{
                                      display:"flex",
                                      alignItems:"center",
                                      justifyContent:"flex-end",
                                      gap:"0.28rem",
                                      marginTop:"0.22rem",
                                      fontSize:"0.68rem",
                                      color:isMine?"rgba(255,255,255,0.78)":"var(--cas-text-muted)"
                                    },
                                    children:[
                                      (0,a.jsx)("span",{children:timeStr}),
                                      isMine&&(0,a.jsx)("span",{style:{color:"#93c5fd",fontWeight:800},children:"✓✓"})
                                    ]
                                  })
                                ]
                              }),
                              isHovered&&(0,a.jsxs)("div",{
                                style:{
                                  display:"inline-flex",
                                  alignItems:"center",
                                  gap:"0.15rem",
                                  padding:"0.2rem 0.4rem",
                                  borderRadius:999,
                                  background:"var(--cas-card-bg)",
                                  border:"1px solid var(--cas-border-strong)",
                                  boxShadow:"0 4px 12px rgba(0,0,0,0.08)",
                                  flexShrink:0
                                },
                                children:[
                                  ["👍","❤️","🙏","🔥","✅"].map(em=>(0,a.jsx)("button",{
                                    key:em,
                                    type:"button",
                                    onClick:()=>toggleBubbleReaction(m.id,em),
                                    title:`Beri reaksi ${em}`,
                                    style:{background:"none",border:"none",cursor:"pointer",fontSize:"0.8rem",padding:"0.1rem 0.2rem"},
                                    children:em
                                  })),
                                  (0,a.jsx)("button",{
                                    type:"button",
                                    onClick:()=>{
                                      setReplyToMessage({
                                        id:m.id,
                                        sender_name:isMine?"Anda":(m.sender_name||activePartner.name),
                                        content:m.content
                                      });
                                      msgInputRef.current?.focus();
                                    },
                                    title:"Balas pesan ini",
                                    style:{background:"none",border:"none",cursor:"pointer",fontSize:"0.72rem",fontWeight:700,color:"#2563eb",padding:"0.1rem 0.3rem"},
                                    children:"↩️ Balas"
                                  }),
                                  (0,a.jsx)("button",{
                                    type:"button",
                                    onClick:()=>handleCopyMessage(m.content),
                                    title:"Salin teks pesan",
                                    style:{background:"none",border:"none",cursor:"pointer",fontSize:"0.72rem",color:"var(--cas-text-secondary)",padding:"0.1rem 0.25rem"},
                                    children:"📋 Salin"
                                  })
                                ]
                              })
                            ]
                          }),
                          reactionEntries.length>0&&(0,a.jsx)("div",{
                            style:{
                              display:"flex",
                              gap:"0.25rem",
                              marginTop:"0.2rem",
                              marginLeft:isMine?0:"2.2rem"
                            },
                            children:reactionEntries.map(([em,cnt])=>(0,a.jsx)("span",{
                              key:em,
                              onClick:()=>toggleBubbleReaction(m.id,em),
                              style:{
                                fontSize:"0.7rem",
                                padding:"0.08rem 0.42rem",
                                borderRadius:999,
                                background:"var(--cas-card-bg)",
                                border:"1px solid var(--cas-border-strong)",
                                cursor:"pointer",
                                boxShadow:"0 1px 3px rgba(0,0,0,0.06)"
                              },
                              children:`${em} ${cnt}`
                            }))
                          })
                        ]
                      })
                    ]},m.id||idx);
                  }),
                  (0,a.jsx)("div",{ref:endRef})
                ]
              }),

              infoDrawerOpen&&(0,a.jsxs)("div",{
                style:{
                  width:260,
                  borderLeft:"1px solid var(--cas-border)",
                  background:"var(--cas-card-bg)",
                  padding:"1rem",
                  overflowY:"auto",
                  display:"flex",
                  flexDirection:"column",
                  gap:"0.85rem"
                },
                children:[
                  (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between"},children:[
                    (0,a.jsx)("span",{style:{fontWeight:800,fontSize:"0.85rem",color:"var(--cas-text-primary)"},children:"Info Percakapan"}),
                    (0,a.jsx)("button",{type:"button",onClick:()=>setInfoDrawerOpen(!1),style:{background:"none",border:"none",cursor:"pointer",color:"var(--cas-text-muted)",fontWeight:700},children:"✕"})
                  ]}),
                  (0,a.jsxs)("div",{style:{textAlign:"center",padding:"0.5rem 0"},children:[
                    (0,a.jsx)("img",{
                      src:activePartner.photo_url||"/images/default-avatar-polki.png",
                      alt:activePartner.name,
                      onError:ev=>{ev.currentTarget.onerror=null;ev.currentTarget.src="/images/default-avatar-polki.png";},
                      style:{width:68,height:68,borderRadius:"50%",objectFit:"cover",border:"2px solid #2563eb",margin:"0 auto 0.5rem"}
                    }),
                    (0,a.jsx)("div",{style:{fontWeight:800,fontSize:"0.92rem",color:"var(--cas-text-primary)"},children:activePartner.name}),
                    (0,a.jsx)("div",{style:{fontSize:"0.75rem",color:"#2563eb",fontWeight:600,marginTop:"0.15rem"},children:activePartner.handle||"@personel"}),
                    (0,a.jsx)("div",{style:{fontSize:"0.73rem",color:"var(--cas-text-muted)",marginTop:"0.25rem"},children:activePartner.satker||"Robinopsnal Bareskrim Polri"})
                  ]}),
                  (0,a.jsxs)("div",{style:{padding:"0.65rem",borderRadius:10,background:"var(--cas-surface-subtle)",border:"1px solid var(--cas-border)",fontSize:"0.74rem",color:"var(--cas-text-secondary)",lineHeight:1.45},children:[
                    (0,a.jsx)("div",{style:{fontWeight:700,color:"var(--cas-text-primary)",marginBottom:"0.2rem"},children:"🔒 Keamanan Obrolan"}),
                    "Pesan dalam percakapan ini tersimpan aman pada jaringan internal Big Data Binops Polri."
                  ]}),
                  selectedId>0&&(0,a.jsx)("button",{
                    type:"button",
                    onClick:()=>casNav(router,`/cms/broadcaster?view=koneksi&profileId=${selectedId}`),
                    style:{width:"100%",padding:"0.5rem",borderRadius:10,border:"1px solid #2563eb",background:"rgba(37,99,235,0.1)",color:"#2563eb",fontWeight:700,fontSize:"0.76rem",cursor:"pointer"},
                    children:"👤 Buka Profil Lengkap"
                  })
                ]
              })
            ]}),

            replyToMessage&&(0,a.jsxs)("div",{
              style:{
                padding:"0.5rem 1.1rem",
                background:"var(--cas-surface-subtle)",
                borderTop:"1px solid var(--cas-border)",
                borderLeft:"3px solid #2563eb",
                display:"flex",
                alignItems:"center",
                justifyContent:"space-between",
                gap:"0.75rem"
              },
              children:[
                (0,a.jsxs)("div",{style:{minWidth:0,flex:1},children:[
                  (0,a.jsx)("div",{style:{fontSize:"0.74rem",fontWeight:800,color:"#2563eb"},children:`↩️ Membalas ${replyToMessage.sender_name}`}),
                  (0,a.jsx)("div",{style:{fontSize:"0.76rem",color:"var(--cas-text-secondary)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:replyToMessage.content})
                ]}),
                (0,a.jsx)("button",{
                  type:"button",
                  onClick:()=>setReplyToMessage(null),
                  style:{background:"none",border:"none",color:"var(--cas-text-muted)",cursor:"pointer",fontSize:"1rem",fontWeight:800},
                  children:"×"
                })
              ]
            }),

            attachedFile&&(0,a.jsxs)("div",{
              style:{
                padding:"0.45rem 1.1rem",
                background:"var(--cas-surface-subtle)",
                borderTop:"1px solid var(--cas-border)",
                display:"flex",
                alignItems:"center",
                justifyContent:"space-between",
                gap:"0.75rem",
                fontSize:"0.76rem"
              },
              children:[
                (0,a.jsxs)("span",{style:{color:"#2563eb",fontWeight:700},children:["📎 Lampiran siap dikirim: ",attachedFile.name]}),
                (0,a.jsx)("button",{type:"button",onClick:()=>setAttachedFile(null),style:{background:"none",border:"none",color:"#ef4444",cursor:"pointer",fontWeight:800},children:"× Hapus"})
              ]
            }),

            (0,a.jsx)("div",{
              style:{
                padding:"0.42rem 1rem",
                background:"var(--cas-card-bg)",
                borderTop:"1px solid var(--cas-border)",
                display:"flex",
                gap:"0.4rem",
                overflowX:"auto"
              },
              children:smartQuickReplies.map((q,i)=>(0,a.jsx)("button",{
                key:i,
                type:"button",
                onClick:()=>sendMessage(q.text),
                style:{
                  padding:"0.26rem 0.68rem",
                  borderRadius:999,
                  border:"1px solid var(--cas-border-strong)",
                  background:"var(--cas-surface-subtle)",
                  color:"var(--cas-text-secondary)",
                  fontSize:"0.72rem",
                  fontWeight:600,
                  cursor:"pointer",
                  whiteSpace:"nowrap",
                  transition:"all 0.15s ease"
                },
                children:q.label
              }))
            }),

            showEmojiPicker&&(0,a.jsx)("div",{
              style:{
                padding:"0.5rem 1rem",
                background:"var(--cas-card-bg)",
                borderTop:"1px solid var(--cas-border)",
                display:"flex",
                gap:"0.4rem",
                flexWrap:"wrap"
              },
              children:emojiList.map(em=>(0,a.jsx)("button",{
                key:em,
                type:"button",
                onClick:()=>{
                  setMsgText(prev=>prev+em);
                  msgInputRef.current?.focus();
                },
                style:{background:"var(--cas-surface-subtle)",border:"1px solid var(--cas-border)",borderRadius:8,padding:"0.25rem 0.45rem",fontSize:"1rem",cursor:"pointer"},
                children:em
              }))
            }),

            (0,a.jsxs)("form",{
              onSubmit:ev=>{ev.preventDefault();sendMessage();},
              style:{
                padding:"0.65rem 1rem",
                borderTop:"1px solid var(--cas-border)",
                background:"var(--cas-card-bg)",
                display:"flex",
                alignItems:"center",
                gap:"0.55rem"
              },
              children:[
                (0,a.jsx)("input",{
                  ref:fileInputRef,
                  type:"file",
                  accept:"image/*,.pdf,.doc,.docx,.xls,.xlsx",
                  onChange:handleFileChange,
                  style:{display:"none"}
                }),
                (0,a.jsxs)("div",{
                  style:{
                    flex:1,
                    borderRadius:10,
                    background:"var(--cas-surface-subtle)",
                    border:"1px solid var(--cas-border-strong)",
                    padding:"0.35rem 0.5rem 0.35rem 0.85rem",
                    display:"flex",
                    alignItems:"center",
                    gap:"0.5rem"
                  },
                  children:[
                    (0,a.jsx)("button",{
                      type:"button",
                      onClick:()=>setShowEmojiPicker(v=>!v),
                      title:"Sisipkan Emoji",
                      style:{background:"none",border:"none",cursor:"pointer",fontSize:"1.05rem",padding:"0.15rem",lineHeight:1},
                      children:"😊"
                    }),
                    (0,a.jsx)("button",{
                      type:"button",
                      onClick:()=>fileInputRef.current?.click(),
                      title:"Lampirkan Dokumen atau Gambar",
                      style:{background:"none",border:"none",cursor:"pointer",fontSize:"1rem",padding:"0.15rem",lineHeight:1},
                      children:"📎"
                    }),
                    (0,a.jsx)("input",{
                      ref:msgInputRef,
                      type:"text",
                      value:msgText,
                      onChange:e=>setMsgText(e.target.value),
                      placeholder:"Tulis pesan... (Tekan Enter untuk mengirim)",
                      style:{
                        flex:1,
                        border:"none",
                        background:"transparent",
                        color:"var(--cas-text-primary)",
                        fontSize:"0.85rem",
                        outline:"none",
                        padding:"0.25rem 0"
                      }
                    })
                  ]
                }),
                (0,a.jsx)("button",{
                  type:"submit",
                  disabled:sending||(!msgText.trim()&&!attachedFile),
                  title:"Kirim Pesan",
                  style:{
                    width:40,
                    height:40,
                    borderRadius:"50%",
                    border:"none",
                    background:(msgText.trim()||attachedFile)?"#2563eb":"var(--cas-border-strong)",
                    color:"#ffffff",
                    display:"flex",
                    alignItems:"center",
                    justifyContent:"center",
                    cursor:(msgText.trim()||attachedFile)?"pointer":"default",
                    flexShrink:0,
                    transform:(msgText.trim()||attachedFile)?"scale(1)":"scale(0.95)",
                    transition:"all 0.15s ease",
                    boxShadow:(msgText.trim()||attachedFile)?"0 4px 12px rgba(37,99,235,0.3)":"none"
                  },
                  children:(0,a.jsx)("svg",{
                    width:18,
                    height:18,
                    viewBox:"0 0 24 24",
                    fill:"none",
                    stroke:"currentColor",
                    strokeWidth:2.2,
                    strokeLinecap:"round",
                    strokeLinejoin:"round",
                    children:[
                      (0,a.jsx)("line",{x1:"22",y1:"2",x2:"11",y2:"13"}),
                      (0,a.jsx)("polygon",{points:"22 2 15 22 11 13 2 9 22 2"})
                    ]
                  })
                })
              ]
            })
          ]
        })
      ]
    })
  ]});
}

function CasKoneksiFullPage({user:curUser,searchStr}){
  const router=(0,r.useRouter)();
  const sp=new URLSearchParams(searchStr||"");
  const profileIdParam=sp.get("profileId")||sp.get("id")||sp.get("u")||"";
  const[activeTab,setActiveTab]=(0,t.useState)("all");
  const[searchQ,setSearchQ]=(0,t.useState)("");
  const[page,setPage]=(0,t.useState)(1);
  const[users,setUsers]=(0,t.useState)([]);
  const[incomingReqs,setIncomingReqs]=(0,t.useState)([]);
  const[connCounts,setConnCounts]=(0,t.useState)({incoming:0,connected:0,outgoing:0});
  const[total,setTotal]=(0,t.useState)(0);
  const[totalPages,setTotalPages]=(0,t.useState)(1);
  const[loading,setLoading]=(0,t.useState)(!0);
  const[togglingId,setTogglingId]=(0,t.useState)(null);

  const[profData,setProfData]=(0,t.useState)(null);
  const[profPosts,setProfPosts]=(0,t.useState)([]);
  const[profConns,setProfConns]=(0,t.useState)([]);
  const[profTab,setProfTab]=(0,t.useState)("posts");
  const[profLoading,setProfLoading]=(0,t.useState)(!1);
  const[profErr,setProfErr]=(0,t.useState)("");

  const loadDirectory=(0,t.useCallback)(async()=>{
    setLoading(!0);
    try{
      const params={page,limit:24,search:searchQ.trim()||void 0,filter:activeTab};
      if(activeTab==="connected"&&curUser?.id)params.connected_to=curUser.id;
      const res=await M.apiAuth.get("/bdb/jukrah/network/users",{params});
      let list=Array.isArray(res.data?.data)?res.data.data:[];
      if(curUser?.id&&activeTab==="all"){
        list=list.filter(u=>Number(u.id)!==Number(curUser.id));
      }
      list=list.slice(0,24);
      const totCount=Number(res.data?.total||list.length);
      setUsers(list);
      if(Array.isArray(res.data?.incoming_requests))setIncomingReqs(res.data.incoming_requests);
      if(res.data?.counts)setConnCounts(res.data.counts);
      setTotal(totCount);
      setTotalPages(Math.max(1,Math.ceil(totCount/24)));
    }catch{setUsers([]);}finally{setLoading(!1);}
  },[page,searchQ,activeTab,curUser?.id]);

  (0,t.useEffect)(()=>{
    if(!profileIdParam){loadDirectory();}
  },[profileIdParam,loadDirectory]);

  (0,t.useEffect)(()=>{
    if(!profileIdParam){setProfData(null);setProfErr("");return;}
    let cancelled=!1;
    async function fetchOtherProfile(){
      setProfLoading(!0);setProfErr("");
      try{
        const res=await M.apiAuth.get(`/bdb/jukrah/network/profile/${encodeURIComponent(profileIdParam)}`);
        const d=res.data?.data;
        if(!cancelled&&d){
          setProfData(d);
          const[fRes,cRes]=await Promise.all([
            M.apiAuth.get("/bdb/jukrah/feed",{params:{author_id:d.id,limit:20}}).catch(()=>({data:{data:[]}})),
            M.apiAuth.get("/bdb/jukrah/network/users",{params:{connected_to:d.id,limit:24}}).catch(()=>({data:{data:[]}}))
          ]);
          if(!cancelled){
            const allFeed=Array.isArray(fRes.data?.data)?fRes.data.data:[];
            setProfPosts(allFeed.filter(p=>Number(p.author_id)===Number(d.id)));
            setProfConns(Array.isArray(cRes.data?.data)?cRes.data.data:[]);
          }
        }
      }catch(err){
        if(!cancelled)setProfErr(err?.response?.data?.message||"Profil personil tidak ditemukan.");
      }finally{
        if(!cancelled)setProfLoading(!1);
      }
    }
    fetchOtherProfile();
    return()=>{cancelled=!0;};
  },[profileIdParam]);

  const handleAcceptRequest=async(targetUid)=>{
    if(!targetUid||togglingId)return;
    setTogglingId(targetUid);
    try{
      await M.apiAuth.post(`/bdb/jukrah/network/connect/${targetUid}`);
      setIncomingReqs(prev=>prev.filter(r=>Number(r.id)!==Number(targetUid)));
      setConnCounts(prev=>({...prev,incoming:Math.max(0,(prev.incoming||0)-1),connected:(prev.connected||0)+1}));
      setUsers(prev=>prev.map(u=>Number(u.id)===Number(targetUid)?{...u,is_following:!0,is_connected:!0,connection_status:"connected"}:u));
      if(profData&&Number(profData.id)===Number(targetUid)){
        setProfData(prev=>({...prev,is_following:!0,is_connected:!0,connection_status:"connected",connections_count:Number(prev.connections_count||0)+1}));
      }
      try{window.dispatchEvent(new Event("cas-notif-updated"))}catch{}
    }catch{}finally{setTogglingId(null);}
  };

  const handleIgnoreRequest=async(targetUid)=>{
    if(!targetUid||togglingId)return;
    setTogglingId(targetUid);
    try{
      await M.apiAuth.post(`/bdb/jukrah/network/disconnect/${targetUid}`);
      setIncomingReqs(prev=>prev.filter(r=>Number(r.id)!==Number(targetUid)));
      setConnCounts(prev=>({...prev,incoming:Math.max(0,(prev.incoming||0)-1)}));
      setUsers(prev=>prev.map(u=>Number(u.id)===Number(targetUid)?{...u,is_following:!1,is_connected:!1,connection_status:"none"}:u));
      if(profData&&Number(profData.id)===Number(targetUid)){
        setProfData(prev=>({...prev,is_following:!1,is_connected:!1,connection_status:"none"}));
      }
      try{window.dispatchEvent(new Event("cas-notif-updated"))}catch{}
    }catch{}finally{setTogglingId(null);}
  };

  const handleFollowToggle=async(targetUid,inProfile=!1)=>{
    if(!targetUid||togglingId)return;
    setTogglingId(targetUid);
    try{
      const res=await M.apiAuth.post(`/bdb/jukrah/follow/${targetUid}`);
      const newStatus=res.data?.data?.connection_status||(res.data?.data?.is_connected?"connected":"none");
      const isNowConn=newStatus==="connected";
      const isOutgoing=newStatus==="outgoing";
      setUsers(prev=>prev.map(u=>Number(u.id)===Number(targetUid)?{...u,is_following:isNowConn||isOutgoing,is_connected:isNowConn,connection_status:newStatus}:u));
      if(newStatus==="connected"){
        setIncomingReqs(prev=>prev.filter(r=>Number(r.id)!==Number(targetUid)));
      }
      if(inProfile&&profData&&Number(profData.id)===Number(targetUid)){
        setProfData(prev=>({...prev,is_following:isNowConn||isOutgoing,is_connected:isNowConn,connection_status:newStatus,connections_count:Math.max(0,Number(prev.connections_count||0)+(isNowConn?1:newStatus==="none"&&prev.is_connected?-1:0))}));
      }
      try{window.dispatchEvent(new Event("cas-notif-updated"))}catch{}
    }catch{}finally{setTogglingId(null);}
  };

  if(profileIdParam){
    const profHandle=String(profData?.callsign||profData?.username||"personil").replace(/^@/,"").toLowerCase();
    const profPangkatSatker=casFormatPangkatSatkerLine(profData?.pangkat,profData?.satker_nama||profData?.satker,Number(profData?.id)===1);
    const profStatus=profData?.connection_status||(profData?.is_connected?"connected":"none");
    return(0,a.jsxs)("div",{style:{display:"grid",gap:"1rem"},children:[
      (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.75rem",flexWrap:"wrap"},children:[
        (0,a.jsx)("button",{type:"button",onClick:()=>casNav(router,"/cms/broadcaster?view=koneksi"),style:{padding:"0.5rem 1rem",borderRadius:10,border:"1px solid rgba(56,189,248,0.45)",background:"var(--cas-card-bg)",color:"#0284c7",fontWeight:800,fontSize:"0.82rem",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"0.45rem"},children:"← Kembali ke Daftar Koneksi Personil"}),
        (0,a.jsx)("span",{style:{fontSize:"0.75rem",color:"var(--cas-text-muted)",fontWeight:600},children:"🔒 Mode Profil Personil Kedinasan (Terenkripsi)"})
      ]}),
      profLoading?(0,a.jsx)("div",{style:{padding:"3rem",textAlign:"center",background:"var(--cas-card-bg)",borderRadius:16,color:"#0284c7",fontWeight:700},children:"⏳ Memuat profil lengkap personil…"}):profErr||!profData?(0,a.jsxs)("div",{style:{padding:"2.5rem",textAlign:"center",background:"var(--cas-card-bg)",borderRadius:16,border:"1px solid #ef4444",color:"#ef4444"},children:[
        (0,a.jsx)("div",{style:{fontWeight:800,fontSize:"1rem",marginBottom:"0.5rem"},children:profErr||"Profil personil tidak ditemukan."}),
        (0,a.jsx)("button",{type:"button",onClick:()=>casNav(router,"/cms/broadcaster?view=koneksi"),style:{padding:"0.45rem 1rem",borderRadius:8,border:"none",background:"#2563eb",color:"#fff",fontWeight:700,cursor:"pointer"},children:"Kembali ke Direktori Koneksi"})
      ]}):(0,a.jsxs)("div",{style:{display:"grid",gap:"1rem"},children:[
        (0,a.jsxs)("div",{style:{borderRadius:12,overflow:"hidden",background:"var(--cas-card-bg)",border:"1px solid var(--cas-border-strong)",boxShadow:"0 12px 32px rgba(15,23,42,0.08)"},children:[
          (0,a.jsx)("div",{style:{height:175,background:profData.banner_theme&&profData.banner_theme.startsWith("linear-gradient")?profData.banner_theme:`url(${profData.banner_theme||"/images/default-banner-polri.jpg"}) center/cover no-repeat`,position:"relative"}}),
          (0,a.jsxs)("div",{style:{padding:"0 1.5rem 1.5rem",position:"relative"},children:[
            (0,a.jsxs)("div",{style:{display:"flex",alignItems:"flex-end",justifyContent:"space-between",flexWrap:"wrap",gap:"1rem",marginTop:"-48px",marginBottom:"1rem"},children:[
              (0,a.jsxs)("div",{style:{display:"flex",alignItems:"flex-end",gap:"1rem",flexWrap:"wrap"},children:[
                (0,a.jsx)("img",{src:profData.photo_url||"/images/default-avatar-polki.png",alt:profHandle,onError:ev=>{ev.currentTarget.onerror=null;ev.currentTarget.src="/images/default-avatar-polki.png";},style:{width:96,height:96,borderRadius:"50%",objectFit:"cover",border:"4px solid var(--cas-card-bg)",background:"var(--cas-surface-subtle)",boxShadow:"0 8px 24px rgba(15,23,42,0.2)"}}),
                (0,a.jsxs)("div",{style:{paddingBottom:"0.2rem"},children:[
                  (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.35rem",flexWrap:"wrap"},children:[
                    (0,a.jsx)("h2",{style:{margin:0,fontSize:"1.28rem",fontWeight:800,color:"#0284c7"},children:`@${profHandle}`}),
                    renderCasMetaBadge(profData,18)
                  ]}),
                  (0,a.jsx)("div",{style:{fontSize:"0.84rem",color:"var(--cas-text-secondary)",fontWeight:600,marginTop:"0.2rem"},children:profPangkatSatker})
                ]})
              ]}),
              Number(profData.id)!==Number(curUser?.id)&&(0,a.jsxs)("div",{style:{display:"flex",gap:"0.55rem",flexWrap:"wrap"},children:[
                profStatus==="incoming"?(0,a.jsxs)(a.Fragment,{children:[
                  (0,a.jsx)("button",{type:"button",disabled:togglingId===profData.id,onClick:()=>handleAcceptRequest(profData.id),style:{padding:"0.52rem 1.1rem",borderRadius:10,border:"none",background:"linear-gradient(135deg, #059669 0%, #10b981 100%)",color:"#fff",fontWeight:800,fontSize:"0.82rem",cursor:"pointer"},children:"✓ Terima Koneksi"}),
                  (0,a.jsx)("button",{type:"button",disabled:togglingId===profData.id,onClick:()=>handleIgnoreRequest(profData.id),style:{padding:"0.52rem 0.95rem",borderRadius:10,border:"1px solid var(--cas-border-strong)",background:"var(--cas-surface-subtle)",color:"var(--cas-text-secondary)",fontWeight:700,fontSize:"0.82rem",cursor:"pointer"},children:"✕ Abaikan"})
                ]}):(0,a.jsx)("button",{type:"button",disabled:togglingId===profData.id,onClick:()=>handleFollowToggle(profData.id,!0),style:{padding:"0.52rem 1.1rem",borderRadius:10,border:profStatus==="connected"?"1px solid #10b981":profStatus==="outgoing"?"1px solid #f59e0b":"none",background:profStatus==="connected"?"rgba(16,185,129,0.16)":profStatus==="outgoing"?"rgba(245,158,11,0.15)":"linear-gradient(135deg, #0284c7 0%, #2563eb 100%)",color:profStatus==="connected"?"#059669":profStatus==="outgoing"?"#d97706":"#fff",fontWeight:800,fontSize:"0.82rem",cursor:"pointer"},children:profStatus==="connected"?"✓ Terhubung":profStatus==="outgoing"?"⏳ Permintaan Terkirim":"+ Hubungkan"}),
                (0,a.jsx)("button",{type:"button",onClick:()=>casNav(router,`/cms/broadcaster?view=obrolan&partner=${profData.id}`),style:{padding:"0.52rem 1.1rem",borderRadius:10,border:"1px solid rgba(56,189,248,0.45)",background:"rgba(2,132,199,0.16)",color:"#0284c7",fontWeight:800,fontSize:"0.82rem",cursor:"pointer"},children:"💬 Kirim Pesan Taktis"})
              ]})
            ]}),
            profData.social_media?.bio&&(0,a.jsx)("p",{style:{margin:"0 0 1rem",fontSize:"0.85rem",color:"var(--cas-text-secondary)",lineHeight:1.5,background:"var(--cas-surface-subtle)",padding:"0.75rem 1rem",borderRadius:10,border:"1px solid var(--cas-border)"},children:profData.social_media.bio}),
            (0,a.jsx)("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(150px, 1fr))",gap:"0.75rem"},children:[
              {label:"Postingan Sharese",val:profData.posts_count??profPosts.length,color:"#0284c7"},
              {label:"Jejaring Terhubung",val:profData.connections_count||0,color:"#059669"},
              {label:"Satuan Kerja",val:casCapitalizeEachWordSatker(profData.satker||"Polri"),color:"#7c3aed"},
              {label:"Pangkat / Peran",val:casCapitalizeEachWordSatker(profData.pangkat&&profData.pangkat!=="-"?profData.pangkat:profData.role_bdb||"Personil Polri"),color:"#d97706"}
            ].map((st,i)=>(0,a.jsxs)("div",{key:i,style:{padding:"0.75rem 0.95rem",borderRadius:12,background:"var(--cas-surface-subtle)",border:"1px solid var(--cas-border)"},children:[
              (0,a.jsx)("div",{style:{fontSize:"0.7rem",color:"var(--cas-text-muted)",fontWeight:700},children:st.label}),
              (0,a.jsx)("div",{style:{fontSize:"1.02rem",fontWeight:800,color:st.color,marginTop:"0.2rem",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:st.val})
            ]}))})
          ]})
        ]}),
        (0,a.jsxs)("div",{style:{display:"flex",gap:"0.5rem",borderBottom:"1px solid var(--cas-border)",paddingBottom:"0.5rem"},children:[
          {id:"posts",label:`📝 Postingan Personil (${profPosts.length})`},
          {id:"connections",label:`🤝 Jejaring Koneksi (${profConns.length})`},
          {id:"info",label:"🪪 Identitas Kedinasan"}
        ].map(tb=>(0,a.jsx)("button",{key:tb.id,type:"button",onClick:()=>setProfTab(tb.id),style:{padding:"0.5rem 1rem",borderRadius:10,border:profTab===tb.id?"1px solid #38bdf8":"1px solid var(--cas-border)",background:profTab===tb.id?"rgba(2,132,199,0.16)":"var(--cas-card-bg)",color:profTab===tb.id?"#0284c7":"var(--cas-text-secondary)",fontWeight:800,fontSize:"0.8rem",cursor:"pointer"},children:tb.label}))}),
        profTab==="posts"&&(0,a.jsx)("div",{style:{display:"grid",gap:"0.75rem"},children:profPosts.length===0?(0,a.jsx)("div",{style:{padding:"2rem",textAlign:"center",background:"var(--cas-card-bg)",border:"1px solid var(--cas-border)",borderRadius:14,color:"var(--cas-text-muted)"},children:"Personil ini belum memiliki postingan publik di linimasa Sharese."}):profPosts.map(p=>(0,a.jsxs)("div",{key:p.id,style:{padding:"1rem 1.2rem",borderRadius:14,background:"var(--cas-card-bg)",border:"1px solid var(--cas-border)"},children:[
          (0,a.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.74rem",color:"var(--cas-text-muted)",marginBottom:"0.45rem"},children:[
            (0,a.jsx)("span",{style:{color:"#0284c7",fontWeight:700},children:`@${profHandle} · ${casCapitalizeEachWordSatker(profData.satker)}`}),
            (0,a.jsx)("span",{children:p.created_at?new Date(p.created_at).toLocaleString("id-ID"):""})
          ]}),
          (0,a.jsx)("div",{style:{fontSize:"0.88rem",color:"var(--cas-text-primary)",whiteSpace:"pre-wrap",lineHeight:1.55},children:p.content}),
          (0,a.jsxs)("div",{style:{display:"flex",gap:"1rem",marginTop:"0.65rem",fontSize:"0.75rem",color:"var(--cas-text-muted)"},children:[
            (0,a.jsx)("span",{children:`👍 ${Object.values(p.reaction_counts||{}).reduce((a,b)=>Number(a)+Number(b),0)} Apresiasi`}),
            (0,a.jsx)("span",{children:`💬 ${p.comments_count||0} Komentar`}),
            (0,a.jsx)("span",{children:`🔁 ${p.repost_count||0} Terusan`})
          ]})
        ]}))}),
        profTab==="connections"&&(0,a.jsx)("div",{className:"cas-koneksi-bento-grid",children:profConns.length===0?(0,a.jsx)("div",{style:{padding:"2rem",textAlign:"center",background:"var(--cas-card-bg)",border:"1px solid var(--cas-border)",borderRadius:14,color:"var(--cas-text-muted)",gridColumn:"1 / -1"},children:"Belum ada daftar koneksi yang ditampilkan."}):profConns.map(c=>{
          const cHandle=String(c.callsign||c.username||"personil").replace(/^@/,"").toLowerCase();
          return(0,a.jsxs)("div",{key:c.id,onClick:()=>casNav(router,`/cms/broadcaster?view=koneksi&profileId=${c.id}`),style:{padding:"0.85rem",borderRadius:12,background:"var(--cas-card-bg)",border:"1px solid var(--cas-border)",display:"flex",alignItems:"center",gap:"0.75rem",cursor:"pointer"},children:[
            (0,a.jsx)("img",{src:c.photo_url||"/images/default-avatar-polki.png",alt:cHandle,onError:ev=>{ev.currentTarget.onerror=null;ev.currentTarget.src="/images/default-avatar-polki.png";},style:{width:44,height:44,borderRadius:"50%",objectFit:"cover"}}),
            (0,a.jsxs)("div",{style:{minWidth:0,flex:1},children:[
              (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.25rem",fontWeight:800,fontSize:"0.84rem",color:"#0284c7",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:[
                (0,a.jsx)("span",{children:`@${cHandle}`}),
                renderCasMetaBadge(c,14)
              ]}),
              (0,a.jsx)("div",{style:{fontSize:"0.72rem",color:"var(--cas-text-muted)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",marginTop:"0.12rem"},children:casFormatPangkatSatkerLine(c.pangkat,c.satker,Number(c.id)===1)})
            ]})
          ]});
        })}),
        profTab==="info"&&(0,a.jsx)("div",{style:{padding:"1.25rem",borderRadius:14,background:"var(--cas-card-bg)",border:"1px solid var(--cas-border)",display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))",gap:"1rem"},children:[
          {k:"Username Sharese",v:"@"+profHandle},
          {k:"Pangkat / Golongan",v:casCapitalizeEachWordSatker(profData.pangkat&&profData.pangkat!=="-"?profData.pangkat:"Personil Polri")},
          {k:"Jabatan",v:casCapitalizeEachWordSatker(profData.jabatan&&profData.jabatan!=="-"?profData.jabatan:"Pejabat Kedinasan")},
          {k:"Satuan Kerja (Satker)",v:casCapitalizeEachWordSatker(profData.satker_nama||profData.satker||"Polri")},
          {k:"Email Kedinasan",v:profData.email_polri||profData.email||"-"}
        ].map((row,idx)=>(0,a.jsxs)("div",{key:idx,children:[
          (0,a.jsx)("div",{style:{fontSize:"0.72rem",color:"var(--cas-text-muted)",fontWeight:700},children:row.k}),
          (0,a.jsx)("div",{style:{fontSize:"0.88rem",color:"var(--cas-text-primary)",fontWeight:700,marginTop:"0.2rem"},children:row.v})
        ]}))})
      ]})
    ]});
  }

  return(0,a.jsxs)("div",{style:{display:"grid",gap:"1rem",paddingTop:"0.2rem"},children:[
    (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"0.75rem"},children:[
      (0,a.jsxs)("div",{children:[
        (0,a.jsx)("h1",{className:"cms-page-title",style:{margin:0,lineHeight:1.25},children:"👥 Jejaring & Koneksi Personil Sharese"}),
        (0,a.jsx)("p",{className:"cms-page-sub",style:{margin:"0.25rem 0 0"},children:"Kelola permintaan koneksi masuk, perluas jejaring rekan sejawat lintas Satker & Polda, dan klik kartu `@username` untuk membuka profil personil."})
      ]}),
      (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.55rem",flexWrap:"wrap"},children:[
        connCounts.incoming>0&&(0,a.jsx)("span",{onClick:()=>{setActiveTab("incoming");setPage(1);},style:{fontSize:"0.76rem",fontWeight:800,color:"#fff",padding:"0.4rem 0.85rem",borderRadius:10,background:"linear-gradient(135deg, #2563eb, #0284c7)",cursor:"pointer",boxShadow:"0 4px 12px rgba(37,99,235,0.25)"},children:`📥 ${connCounts.incoming} Permintaan Masuk`}),
        (0,a.jsx)("div",{style:{fontSize:"0.78rem",fontWeight:800,color:"#0284c7",padding:"0.4rem 0.85rem",borderRadius:10,background:"rgba(2,132,199,0.14)",border:"1px solid rgba(56,189,248,0.35)"},children:`Total Personil Aktif: ${total.toLocaleString("id-ID")}`})
      ]})
    ]}),

    incomingReqs.length>0&&activeTab!=="connected"&&activeTab!=="outgoing"&&(0,a.jsxs)("div",{
      style:{
        background:"var(--cas-card-bg)",
        border:"1.5px solid rgba(37,99,235,0.35)",
        borderRadius:16,
        padding:"1rem 1.15rem",
        boxShadow:"0 8px 24px rgba(15,23,42,0.06)"
      },
      children:[
        (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.75rem",flexWrap:"wrap",marginBottom:"0.85rem"},children:[
          (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.55rem"},children:[
            (0,a.jsx)("span",{style:{fontSize:"0.92rem",fontWeight:800,color:"var(--cas-text-primary)"},children:"📥 Permintaan Koneksi Masuk"}),
            (0,a.jsx)("span",{style:{padding:"0.12rem 0.55rem",borderRadius:999,background:"#2563eb",color:"#fff",fontSize:"0.72rem",fontWeight:800},children:incomingReqs.length})
          ]}),
          (0,a.jsx)("span",{style:{fontSize:"0.75rem",color:"var(--cas-text-muted)",fontWeight:600},children:"Terima permintaan untuk terhubung dua arah di Sharese & Obrolan Taktis"})
        ]}),
        (0,a.jsx)("div",{
          style:{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))",gap:"0.75rem"},
          children:incomingReqs.slice(0,6).map(req=>{
            const reqHandle=String(req.callsign||req.username||"personil").replace(/^@/,"").toLowerCase();
            const reqSub=casFormatPangkatSatkerLine(req.pangkat,req.satker,Number(req.id)===1);
            return(0,a.jsxs)("div",{
              key:"inc_"+req.id,
              style:{
                display:"flex",
                alignItems:"center",
                justifyContent:"space-between",
                gap:"0.75rem",
                padding:"0.75rem 0.9rem",
                borderRadius:12,
                background:"var(--cas-surface-subtle)",
                border:"1px solid var(--cas-border-strong)"
              },
              children:[
                (0,a.jsxs)("div",{
                  onClick:()=>casNav(router,`/cms/broadcaster?view=koneksi&profileId=${req.id}`),
                  style:{display:"flex",alignItems:"center",gap:"0.65rem",minWidth:0,flex:1,cursor:"pointer"},
                  children:[
                    (0,a.jsx)("img",{
                      src:req.photo_url||"/images/default-avatar-polki.png",
                      alt:reqHandle,
                      onError:ev=>{ev.currentTarget.onerror=null;ev.currentTarget.src="/images/default-avatar-polki.png";},
                      style:{width:44,height:44,borderRadius:"50%",objectFit:"cover",border:"2px solid #2563eb",flexShrink:0}
                    }),
                    (0,a.jsxs)("div",{style:{minWidth:0,flex:1},children:[
                      (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.25rem",fontWeight:800,fontSize:"0.84rem",color:"#0284c7",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:[
                        (0,a.jsx)("span",{style:{overflow:"hidden",textOverflow:"ellipsis"},children:`@${reqHandle}`}),
                        renderCasMetaBadge(req,14)
                      ]}),
                      (0,a.jsx)("div",{style:{fontSize:"0.71rem",color:"var(--cas-text-muted)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",marginTop:"0.12rem"},children:reqSub})
                    ]})
                  ]
                }),
                (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.38rem",flexShrink:0},children:[
                  (0,a.jsx)("button",{
                    type:"button",
                    disabled:togglingId===req.id,
                    onClick:()=>handleAcceptRequest(req.id),
                    style:{padding:"0.38rem 0.7rem",borderRadius:8,border:"none",background:"#2563eb",color:"#fff",fontSize:"0.73rem",fontWeight:800,cursor:"pointer"},
                    children:"✓ Terima"
                  }),
                  (0,a.jsx)("button",{
                    type:"button",
                    disabled:togglingId===req.id,
                    onClick:()=>handleIgnoreRequest(req.id),
                    style:{padding:"0.38rem 0.6rem",borderRadius:8,border:"1px solid var(--cas-border-strong)",background:"var(--cas-card-bg)",color:"var(--cas-text-secondary)",fontSize:"0.72rem",fontWeight:700,cursor:"pointer"},
                    children:"Abaikan"
                  })
                ]})
              ]
            });
          })
        })
      ]
    }),

    (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.75rem",flexWrap:"wrap",background:"var(--cas-card-bg)",padding:"0.85rem 1rem",borderRadius:14,border:"1px solid var(--cas-border-strong)"},children:[
      (0,a.jsx)("div",{style:{display:"flex",gap:"0.45rem",flexWrap:"wrap"},children:[
        {id:"all",label:"🌐 Direktori & Rekomendasi"},
        {id:"incoming",label:`📥 Permintaan Masuk (${connCounts.incoming||incomingReqs.length||0})`},
        {id:"connected",label:`🤝 Koneksi Saya (${connCounts.connected||0})`},
        {id:"outgoing",label:`📤 Terkirim (${connCounts.outgoing||0})`}
      ].map(tb=>(0,a.jsx)("button",{key:tb.id,type:"button",onClick:()=>{setActiveTab(tb.id);setPage(1);},style:{padding:"0.45rem 0.9rem",borderRadius:9,border:activeTab===tb.id?"1.5px solid #38bdf8":"1px solid var(--cas-border-strong)",background:activeTab===tb.id?"linear-gradient(135deg, #0284c7, #2563eb)":"var(--cas-surface-subtle)",color:activeTab===tb.id?"#fff":"var(--cas-text-primary)",fontSize:"0.78rem",fontWeight:700,cursor:"pointer"},children:tb.label}))}),
      (0,a.jsx)("input",{type:"text",value:searchQ,onChange:e=>{setSearchQ(e.target.value);setPage(1);},placeholder:"🔍 Cari @username, pangkat, NRP, atau Satker…",style:{flex:"1 1 260px",maxWidth:"420px",padding:"0.5rem 0.9rem",borderRadius:10,border:"1px solid var(--cas-border-strong)",background:"var(--cas-surface-subtle)",color:"var(--cas-text-primary)",fontSize:"0.82rem"}})
    ]}),
    loading?(0,a.jsx)("div",{style:{padding:"3rem",textAlign:"center",color:"var(--cas-text-muted)"},children:"⏳ Memuat direktori jejaring personil…"}):users.length===0?(0,a.jsx)("div",{style:{padding:"3rem",textAlign:"center",background:"var(--cas-card-bg)",border:"1px solid var(--cas-border)",borderRadius:14,color:"var(--cas-text-muted)"},children:"Tidak ada personil pada kategori ini."}):(0,a.jsx)("div",{className:"cas-koneksi-bento-grid",children:users.map(u=>{
      const isMe=Number(u.id)===Number(curUser?.id);
      const uHandle=String(u.callsign||u.username||"personil").replace(/^@/,"").toLowerCase();
      const uPangkatSatker=casFormatPangkatSatkerLine(u.pangkat,u.satker,Number(u.id)===1);
      const cStatus=u.connection_status||(u.is_connected?"connected":u.is_following?"outgoing":"none");
      return(0,a.jsxs)("div",{key:u.id,style:{padding:"1rem",borderRadius:14,background:"var(--cas-card-bg)",border:"1px solid var(--cas-border)",display:"flex",flexDirection:"column",justifyContent:"space-between",gap:"0.85rem",boxShadow:"0 4px 14px rgba(15,23,42,0.06)"},children:[
        (0,a.jsxs)("div",{onClick:()=>casNav(router,`/cms/broadcaster?view=koneksi&profileId=${u.id}`),style:{display:"flex",alignItems:"center",gap:"0.8rem",cursor:"pointer"},title:"Klik untuk membuka profil personil ini",children:[
          (0,a.jsx)("img",{src:u.photo_url||"/images/default-avatar-polki.png",alt:uHandle,onError:ev=>{ev.currentTarget.onerror=null;ev.currentTarget.src="/images/default-avatar-polki.png";},style:{width:54,height:54,borderRadius:"50%",objectFit:"cover",border:"2px solid #0284c7",flexShrink:0}}),
          (0,a.jsxs)("div",{style:{minWidth:0,flex:1},children:[
            (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.25rem",fontWeight:800,fontSize:"0.9rem",color:"#0284c7",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:[
              (0,a.jsx)("span",{style:{overflow:"hidden",textOverflow:"ellipsis"},children:`@${uHandle}`}),
              renderCasMetaBadge(u,15)
            ]}),
            (0,a.jsx)("div",{style:{fontSize:"0.74rem",color:"var(--cas-text-muted)",fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",marginTop:"0.18rem"},children:uPangkatSatker})
          ]})
        ]}),
        (0,a.jsxs)("div",{style:{display:"flex",gap:"0.45rem"},children:[
          (0,a.jsx)("button",{type:"button",onClick:()=>casNav(router,`/cms/broadcaster?view=koneksi&profileId=${u.id}`),style:{padding:"0.42rem 0.65rem",borderRadius:8,border:"1px solid var(--cas-border-strong)",background:"var(--cas-surface-subtle)",color:"var(--cas-text-primary)",fontSize:"0.74rem",fontWeight:700,cursor:"pointer"},children:"👤 Profil"}),
          !isMe&&cStatus==="incoming"?(0,a.jsxs)(a.Fragment,{children:[
            (0,a.jsx)("button",{type:"button",disabled:togglingId===u.id,onClick:()=>handleAcceptRequest(u.id),style:{flex:1,padding:"0.42rem 0.55rem",borderRadius:8,border:"none",background:"#059669",color:"#fff",fontSize:"0.73rem",fontWeight:800,cursor:"pointer"},children:"✓ Terima"}),
            (0,a.jsx)("button",{type:"button",disabled:togglingId===u.id,onClick:()=>handleIgnoreRequest(u.id),style:{padding:"0.42rem 0.55rem",borderRadius:8,border:"1px solid var(--cas-border-strong)",background:"var(--cas-surface-subtle)",color:"var(--cas-text-secondary)",fontSize:"0.72rem",fontWeight:700,cursor:"pointer"},children:"✕"})
          ]}):!isMe&&(0,a.jsx)("button",{
            type:"button",
            disabled:togglingId===u.id,
            onClick:()=>handleFollowToggle(u.id,!1),
            style:{
              flex:1,
              padding:"0.42rem 0.6rem",
              borderRadius:8,
              border:cStatus==="connected"?"1px solid #10b981":cStatus==="outgoing"?"1px solid #f59e0b":"none",
              background:cStatus==="connected"?"rgba(16,185,129,0.16)":cStatus==="outgoing"?"rgba(245,158,11,0.15)":"#2563eb",
              color:cStatus==="connected"?"#059669":cStatus==="outgoing"?"#d97706":"#fff",
              fontSize:"0.74rem",
              fontWeight:800,
              cursor:"pointer"
            },
            children:cStatus==="connected"?"✓ Terhubung":cStatus==="outgoing"?"⏳ Menunggu":"+ Hubungkan"
          }),
          !isMe&&(0,a.jsx)("button",{type:"button",onClick:()=>casNav(router,`/cms/broadcaster?view=obrolan&partner=${u.id}`),style:{padding:"0.42rem 0.65rem",borderRadius:8,border:"1px solid rgba(56,189,248,0.4)",background:"rgba(2,132,199,0.14)",color:"#0284c7",fontSize:"0.74rem",fontWeight:700,cursor:"pointer"},title:"Kirim Pesan",children:"💬"})
        ]})
      ]});
    })}),
    users.length>0&&(0,a.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"0.75rem",marginTop:"0.35rem",padding:"0.75rem 1rem",borderRadius:12,background:"var(--cas-card-bg)",border:"1px solid var(--cas-border)"},children:[
      (0,a.jsx)("span",{style:{fontSize:"0.78rem",color:"var(--cas-text-muted)",fontWeight:600},children:`Menampilkan ${users.length} dari ${total.toLocaleString("id-ID")} personil (24 per halaman)`}),
      (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.6rem"},children:[
        (0,a.jsx)("button",{type:"button",disabled:page<=1,onClick:()=>setPage(p=>Math.max(1,p-1)),style:{padding:"0.42rem 0.85rem",borderRadius:8,border:"1px solid var(--cas-border-strong)",background:page<=1?"var(--cas-surface-subtle)":"var(--cas-card-bg)",color:page<=1?"var(--cas-text-muted)":"var(--cas-text-primary)",cursor:page<=1?"not-allowed":"pointer",fontSize:"0.76rem",fontWeight:700},children:"← Sebelumnya"}),
        (0,a.jsx)("span",{style:{fontSize:"0.78rem",color:"var(--cas-text-primary)",fontWeight:800,padding:"0 0.25rem"},children:`Halaman ${page} dari ${Math.max(1,totalPages)}`}),
        (0,a.jsx)("button",{type:"button",disabled:page>=totalPages,onClick:()=>setPage(p=>Math.min(totalPages,p+1)),style:{padding:"0.42rem 0.85rem",borderRadius:8,border:"1px solid var(--cas-border-strong)",background:page>=totalPages?"var(--cas-surface-subtle)":"var(--cas-card-bg)",color:page>=totalPages?"var(--cas-text-muted)":"var(--cas-text-primary)",cursor:page>=totalPages?"not-allowed":"pointer",fontSize:"0.76rem",fontWeight:700},children:"Berikutnya →"})
      ]})
    ]})
  ]});
}

function CasNotifikasiFullPage({user:curUser}){
  const router=(0,r.useRouter)();
  const[items,setItems]=(0,t.useState)([]);
  const[unreadDinas,setUnreadDinas]=(0,t.useState)(0);
  const[unreadSocial,setUnreadSocial]=(0,t.useState)(0);
  const[filterCat,setFilterCat]=(0,t.useState)("all");
  const[searchQ,setSearchQ]=(0,t.useState)("");
  const[loading,setLoading]=(0,t.useState)(!0);

  const loadAll=(0,t.useCallback)(async()=>{
    setLoading(!0);
    try{
      const res=await M.apiAuth.get("/bdb/jukrah/notifications");
      const rawList=Array.isArray(res.data?.data)?res.data.data:[];
      setItems(rawList);
      setUnreadDinas(Number(res.data?.unread_dinas||0));
      setUnreadSocial(Number(res.data?.unread_social||0));
    }catch{setItems([]);}finally{setLoading(!1);}
  },[]);

  (0,t.useEffect)(()=>{loadAll();},[loadAll]);

  const markAllRead=async()=>{
    try{
      casMarkNotifIdsReadLocal(items.map(x=>x.id));
      await M.apiAuth.post("/bdb/jukrah/notifications/read-all",{});
      setItems(prev=>prev.map(it=>({...it,is_read:!0})));
      setUnreadDinas(0);setUnreadSocial(0);
      try{window.dispatchEvent(new Event("cas-notif-updated"))}catch{}
    }catch{}
  };

  const handleClickItem=async(it)=>{
    casMarkNotifIdsReadLocal([it.id]);
    setItems(prev=>prev.map(x=>String(x.id)===String(it.id)?{...x,is_read:!0}:x));
    if(!it.is_read&&typeof it.id==="number"){
      try{
        await M.apiAuth.post(`/bdb/jukrah/notifications/${it.id}/read`);
      }catch{}
    }
    try{window.dispatchEvent(new Event("cas-notif-updated"))}catch{}
    casNav(router,it.link||"/cms/broadcaster");
  };

  const humanizedItems=items.map(humanizeCasNotification);
  const totalUnreadCount=humanizedItems.filter(it=>!it.is_read).length;

  const filtered=humanizedItems.filter(it=>{
    if(filterCat==="unread"&&it.is_read)return!1;
    if(filterCat==="komentar"&&it.badgeLabel!=="Sharese"&&it.filterGroup!=="komentar"&&it.filterGroup!=="social")return!1;
    if(filterCat==="jukrah"&&it.badgeLabel!=="Jukrah")return!1;
    if(filterCat==="limpah"&&it.badgeLabel!=="Limpah")return!1;
    if(searchQ.trim()){
      const q=searchQ.toLowerCase();
      return String(it.actorHandle||"").toLowerCase().includes(q)||String(it.actionText||"").toLowerCase().includes(q)||String(it.snippetText||"").toLowerCase().includes(q)||String(it.message||"").toLowerCase().includes(q)||String(it.badgeLabel||"").toLowerCase().includes(q);
    }
    return!0;
  });

  const bucketOrder=["Hari Ini","Kemarin","Minggu Ini / Sebelumnya"];
  const groupedSections=bucketOrder.map(bucket=>({
    bucket,
    list:filtered.filter(it=>it.timeBucket===bucket)
  })).filter(sec=>sec.list.length>0);

  const isDarkTheme=typeof document!=="undefined"&&document.documentElement.dataset.theme==="dark";

  return(0,a.jsxs)("div",{style:{display:"grid",gap:"1rem",maxWidth:"960px",margin:"0 auto",width:"100%"},children:[
    (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"0.75rem",padding:"1rem 1.25rem",borderRadius:16,background:"var(--cas-card-bg)",border:"1px solid var(--cas-border)"},children:[
      (0,a.jsxs)("div",{children:[
        (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.55rem"},children:[
          (0,a.jsx)("h1",{className:"cms-page-title",style:{margin:0,fontSize:"1.25rem"},children:"Notifikasi & Arsip Riwayat"}),
          totalUnreadCount>0&&(0,a.jsx)("span",{style:{padding:"0.15rem 0.55rem",borderRadius:999,background:"#2563eb",color:"#fff",fontSize:"0.72rem",fontWeight:800},children:`${totalUnreadCount} belum dibaca`})
        ]}),
        (0,a.jsx)("p",{className:"cms-page-sub",style:{margin:"0.2rem 0 0"},children:"Seluruh riwayat notifikasi Jukrah, Pelimpahan Perkara (DORS), interaksi Sharese, dan permintaan koneksi tersimpan di sini sebagai arsip."})
      ]}),
      (0,a.jsx)("button",{
        type:"button",
        onClick:markAllRead,
        style:{
          padding:"0.5rem 0.95rem",
          borderRadius:10,
          border:"1px solid rgba(37,99,235,0.35)",
          background:"rgba(37,99,235,0.1)",
          color:"#2563eb",
          fontWeight:700,
          fontSize:"0.78rem",
          cursor:"pointer",
          transition:"all 0.15s ease"
        },
        children:"✓ Tandai semua sudah dibaca"
      })
    ]}),

    (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.75rem",flexWrap:"wrap",padding:"0.75rem 1rem",borderRadius:14,background:"var(--cas-card-bg)",border:"1px solid var(--cas-border)"},children:[
      (0,a.jsx)("div",{style:{display:"flex",gap:"0.4rem",flexWrap:"wrap"},children:[
        {id:"all",label:"Semua (Arsip)",count:humanizedItems.length},
        {id:"unread",label:"Belum Dibaca",count:totalUnreadCount},
        {id:"jukrah",label:"Jukrah",count:humanizedItems.filter(x=>x.badgeLabel==="Jukrah").length},
        {id:"limpah",label:"Limpah",count:humanizedItems.filter(x=>x.badgeLabel==="Limpah").length},
        {id:"komentar",label:"Sharese",count:humanizedItems.filter(x=>x.badgeLabel==="Sharese").length}
      ].map(tb=>{
        const isActive=filterCat===tb.id;
        return(0,a.jsxs)("button",{
          key:tb.id,
          type:"button",
          onClick:()=>setFilterCat(tb.id),
          style:{
            padding:"0.42rem 0.85rem",
            borderRadius:8,
            border:isActive?"1px solid #2563eb":"1px solid var(--cas-border)",
            background:isActive?"#2563eb":"var(--cas-surface-subtle)",
            color:isActive?"#ffffff":"var(--cas-text-primary)",
            fontSize:"0.78rem",
            fontWeight:700,
            cursor:"pointer",
            display:"inline-flex",
            alignItems:"center",
            gap:"0.4rem",
            transition:"all 0.15s ease"
          },
          children:[
            (0,a.jsx)("span",{children:tb.label}),
            tb.count>0&&(0,a.jsx)("span",{
              className:"tabular-nums",
              style:{
                padding:"0.05rem 0.42rem",
                borderRadius:999,
                fontSize:"0.68rem",
                fontWeight:800,
                background:isActive?"rgba(255,255,255,0.22)":"rgba(37,99,235,0.12)",
                color:isActive?"#ffffff":"#2563eb"
              },
              children:tb.count
            })
          ]
        });
      })}),
      (0,a.jsx)("input",{
        type:"text",
        value:searchQ,
        onChange:e=>setSearchQ(e.target.value),
        placeholder:"🔍 Cari @username, nomor LP, atau isi...",
        style:{padding:"0.45rem 0.9rem",borderRadius:10,border:"1px solid var(--cas-border-strong)",background:"var(--cas-surface-subtle)",color:"var(--cas-text-primary)",fontSize:"0.8rem",minWidth:"230px",outline:"none"}
      })
    ]}),

    loading?(0,a.jsx)("div",{style:{padding:"3rem",textAlign:"center",background:"var(--cas-card-bg)",borderRadius:16,border:"1px solid var(--cas-border)",color:"var(--cas-text-muted)"},children:"Memuat daftar notifikasi…"}):groupedSections.length===0?(0,a.jsxs)("div",{style:{padding:"3.5rem 1.5rem",textAlign:"center",background:"var(--cas-card-bg)",border:"1px solid var(--cas-border)",borderRadius:16,color:"var(--cas-text-muted)"},children:[
      (0,a.jsx)("div",{style:{fontSize:"2rem",marginBottom:"0.5rem"},children:"🔔"}),
      (0,a.jsx)("div",{style:{fontWeight:700,fontSize:"0.92rem",color:"var(--cas-text-primary)"},children:"Belum ada notifikasi pada kategori ini"}),
      (0,a.jsx)("div",{style:{fontSize:"0.78rem",marginTop:"0.25rem"},children:"Interaksi terbaru dari rekan sejawat, pelimpahan perkara, dan Jukrah akan tampil di sini."})
    ]}):(0,a.jsx)("div",{style:{display:"grid",gap:"1.15rem"},children:groupedSections.map(sec=>(0,a.jsxs)("div",{
      key:sec.bucket,
      style:{background:"var(--cas-card-bg)",border:"1px solid var(--cas-border)",borderRadius:16,overflow:"hidden",boxShadow:"0 4px 16px rgba(15,23,42,0.04)"},
      children:[
        (0,a.jsxs)("div",{
          style:{padding:"0.65rem 1.15rem",borderBottom:"1px solid var(--cas-border)",background:"var(--cas-surface-subtle)",display:"flex",alignItems:"center",justifyContent:"space-between"},
          children:[
            (0,a.jsx)("span",{style:{fontWeight:800,fontSize:"0.8rem",color:"var(--cas-text-primary)"},children:sec.bucket}),
            (0,a.jsx)("span",{style:{fontSize:"0.72rem",color:"var(--cas-text-muted)",fontWeight:600},children:`${sec.list.length} aktivitas`})
          ]
        }),
        (0,a.jsx)("div",{style:{display:"grid"},children:sec.list.map((it,idx)=>{
          const unreadBg=isDarkTheme?"rgba(59, 130, 246, 0.12)":"rgba(37, 99, 235, 0.06)";
          return(0,a.jsxs)("div",{
            key:it.id+"_"+idx,
            onClick:()=>handleClickItem(it),
            style:{
              display:"flex",
              alignItems:"center",
              justifyContent:"space-between",
              gap:"1rem",
              padding:"0.9rem 1.15rem",
              background:it.is_read?"var(--cas-card-bg)":unreadBg,
              borderBottom:idx<sec.list.length-1?"1px solid var(--cas-border)":"none",
              cursor:"pointer",
              transition:"background 0.15s ease"
            },
            children:[
              (0,a.jsxs)("div",{style:{display:"flex",gap:"0.9rem",alignItems:"flex-start",minWidth:0,flex:1},children:[
                (0,a.jsxs)("div",{style:{position:"relative",width:44,height:44,flexShrink:0},children:[
                  (0,a.jsx)("img",{
                    src:it.avatarUrl||"/images/default-avatar-polki.png",
                    alt:it.actorHandle,
                    onError:ev=>{ev.currentTarget.onerror=null;ev.currentTarget.src="/images/default-avatar-polki.png";},
                    style:{width:44,height:44,borderRadius:"50%",objectFit:"cover",border:"1.5px solid var(--cas-border-strong)"}
                  }),
                  (0,a.jsx)("span",{
                    style:{
                      position:"absolute",
                      bottom:-2,
                      right:-2,
                      width:20,
                      height:20,
                      borderRadius:"50%",
                      background:it.badgeColor||"#2563eb",
                      color:"#ffffff",
                      fontSize:"0.66rem",
                      display:"flex",
                      alignItems:"center",
                      justifyContent:"center",
                      border:"2px solid var(--cas-card-bg)",
                      boxShadow:"0 2px 4px rgba(0,0,0,0.2)"
                    },
                    children:it.badgeIcon
                  })
                ]}),
                (0,a.jsxs)("div",{style:{minWidth:0,flex:1},children:[
                  (0,a.jsxs)("div",{style:{fontSize:"0.86rem",lineHeight:1.45,color:"var(--cas-text-primary)",wordBreak:"break-word"},children:[
                    (0,a.jsx)("span",{
                      style:{
                        display:"inline-block",
                        padding:"0.08rem 0.45rem",
                        borderRadius:999,
                        fontSize:"0.66rem",
                        fontWeight:800,
                        background:it.badgeColor||"#2563eb",
                        color:"#fff",
                        marginRight:"0.45rem",
                        verticalAlign:"middle"
                      },
                      children:it.badgeLabel||"Sharese"
                    }),
                    it.type==="limpah"?(0,a.jsx)("span",{style:{fontWeight:700},children:it.actionText}):it.type==="jukrah"?(0,a.jsxs)(a.Fragment,{children:[
                      (0,a.jsx)("span",{style:{fontWeight:800,color:"#0284c7"},children:`${it.actorHandle}:`}),
                      " ",
                      (0,a.jsx)("span",{style:{fontWeight:600},children:it.snippetText?`"${it.snippetText}"`:it.actionText})
                    ]}):(0,a.jsxs)(a.Fragment,{children:[
                      (0,a.jsx)("span",{style:{fontWeight:800,color:"#0284c7"},children:it.actorHandle}),
                      " ",
                      (0,a.jsx)("span",{children:it.actionText})
                    ]}),
                    it.snippetText&&it.type!=="jukrah"&&(0,a.jsx)("div",{
                      style:{
                        marginTop:"0.28rem",
                        padding:"0.35rem 0.65rem",
                        borderRadius:8,
                        background:"var(--cas-surface-subtle)",
                        borderLeft:`3px solid ${it.badgeColor||"#2563eb"}`,
                        color:"var(--cas-text-secondary)",
                        fontSize:"0.8rem"
                      },
                      children:`"${it.snippetText}"`
                    })
                  ]}),
                  (0,a.jsx)("div",{
                    style:{
                      fontSize:"0.73rem",
                      color:it.is_read?"var(--cas-text-muted)":"#2563eb",
                      fontWeight:it.is_read?500:700,
                      marginTop:"0.3rem"
                    },
                    children:`${it.friendlyTime}${it.is_read?" · Sudah dibaca":""}`
                  })
                ]})
              ]}),
              (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.65rem",flexShrink:0},children:[
                !it.is_read&&(0,a.jsx)("span",{
                  title:"Belum dibaca",
                  style:{width:8,height:8,borderRadius:"50%",background:"#2563eb",display:"inline-block"}
                }),
                (0,a.jsx)("span",{
                  style:{
                    fontSize:"0.75rem",
                    color:"#2563eb",
                    fontWeight:700,
                    padding:"0.3rem 0.65rem",
                    borderRadius:999,
                    background:"rgba(37,99,235,0.08)"
                  },
                  children:it.type==="message"?"Balas 💬":it.type==="follow"?"Koneksi 🤝":"Lihat ➔"
                })
              ]})
            ]
          });
        })})
      ]
    }))})
  ]});
}

function CasInsightFullPage({user:curUser}){
  const[data,setData]=(0,t.useState)(null);
  const[loading,setLoading]=(0,t.useState)(!0);

  (0,t.useEffect)(()=>{
    M.apiAuth.get("/bdb/jukrah/insight").then(res=>{setData(res.data?.data||null);}).catch(()=>{}).finally(()=>setLoading(!1));
  },[]);

  const d=data||{};
  const topPosts=Array.isArray(d.top_posts)?d.top_posts:[];
  const satkerDist=Array.isArray(d.satker_distribution)?d.satker_distribution:[];
  const maxSat=Math.max(1,...satkerDist.map(s=>Number(s.personil_count||0)));

  return(0,a.jsxs)("div",{style:{display:"grid",gap:"1rem"},children:[
    (0,a.jsxs)("div",{children:[
      (0,a.jsx)("h1",{className:"cms-page-title",style:{margin:0},children:"📈 Insight & Analitik Akun Sharese"}),
      (0,a.jsx)("p",{className:"cms-page-sub",children:"Statistik jangkauan publikasi, tingkat konfirmasi baca (Read Receipts), interaksi sejawat, dan sebaran keterlibatan per Satker."})
    ]}),
    loading?(0,a.jsx)("div",{style:{padding:"3rem",textAlign:"center",color:"var(--cas-text-muted)"},children:"⏳ Menghitung metrik analitik akun Anda…"}):(0,a.jsxs)("div",{style:{display:"grid",gap:"1rem"},children:[
      (0,a.jsx)("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(185px, 1fr))",gap:"0.85rem"},children:[
        {label:"Estimasi Jangkauan (Reach)",val:Number(d.estimated_reach||0).toLocaleString("id-ID"),sub:"Impresi Linimasa Polri",color:"#0284c7"},
        {label:"Total Postingan Aktif",val:Number(d.total_posts||0).toLocaleString("id-ID"),sub:`${d.total_jukrah_posts||0} Jukrah Kedinasan`,color:"#7c3aed"},
        {label:"Total Apresiasi Diterima",val:Number(d.total_reactions_received||0).toLocaleString("id-ID"),sub:"Reaksi Personil",color:"#059669"},
        {label:"Diskusi & Komentar",val:Number(d.total_comments_received||0).toLocaleString("id-ID"),sub:`${d.total_reposts||0} Kali Diteruskan`,color:"#d97706"},
        {label:"Konfirmasi Baca Jukrah",val:Number(d.total_read_receipts||0).toLocaleString("id-ID"),sub:"Read Receipts Tercatat",color:"#db2777"},
        {label:"Jejaring Koneksi Aktif",val:Number(d.total_connections||0).toLocaleString("id-ID"),sub:`${d.total_messages||0} Pesan Taktis`,color:"#2563eb"}
      ].map((k,i)=>(0,a.jsxs)("div",{key:i,style:{padding:"1rem 1.15rem",borderRadius:14,background:"var(--cas-card-bg)",border:"1px solid var(--cas-border)"},children:[
        (0,a.jsx)("div",{style:{fontSize:"0.73rem",color:"var(--cas-text-muted)",fontWeight:700},children:k.label}),
        (0,a.jsx)("div",{style:{fontSize:"1.55rem",fontWeight:800,color:k.color,margin:"0.25rem 0"},children:k.val}),
        (0,a.jsx)("div",{style:{fontSize:"0.7rem",color:"var(--cas-text-muted)",fontWeight:600},children:k.sub})
      ]}))}),
      (0,a.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(320px, 1fr))",gap:"1rem"},children:[
        (0,a.jsxs)("div",{style:{padding:"1.2rem",borderRadius:14,background:"var(--cas-card-bg)",border:"1px solid var(--cas-border)"},children:[
          (0,a.jsx)("h3",{style:{margin:"0 0 0.85rem",fontSize:"0.95rem",fontWeight:800,color:"var(--cas-text-primary)"},children:"🏢 Sebaran Interaksi & Jejaring per Satker"}),
          satkerDist.length===0?(0,a.jsx)("div",{style:{color:"var(--cas-text-muted)",fontSize:"0.82rem",padding:"1rem 0"},children:"Belum ada data distribusi Satker."}):(0,a.jsx)("div",{style:{display:"grid",gap:"0.65rem"},children:satkerDist.map((s,idx)=>{
            const pct=Math.max(8,Math.round(Number(s.personil_count||0)/maxSat*100));
            return(0,a.jsxs)("div",{key:idx,children:[
              (0,a.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",fontSize:"0.78rem",marginBottom:"0.22rem"},children:[
                (0,a.jsx)("span",{style:{color:"var(--cas-text-secondary)",fontWeight:700},children:s.satker_label}),
                (0,a.jsxs)("span",{style:{color:"#0284c7",fontWeight:800},children:[s.personil_count," personil"]})
              ]}),
              (0,a.jsx)("div",{style:{height:8,borderRadius:999,background:"var(--cas-surface-hover)",overflow:"hidden"},children:(0,a.jsx)("div",{style:{width:`${pct}%`,height:"100%",background:"linear-gradient(90deg, #0284c7, #38bdf8)",borderRadius:999}})})
            ]});
          })})
        ]}),
        (0,a.jsxs)("div",{style:{padding:"1.2rem",borderRadius:14,background:"var(--cas-card-bg)",border:"1px solid var(--cas-border)"},children:[
          (0,a.jsx)("h3",{style:{margin:"0 0 0.85rem",fontSize:"0.95rem",fontWeight:800,color:"var(--cas-text-primary)"},children:"🔥 Postingan dengan Performa Tertinggi"}),
          topPosts.length===0?(0,a.jsx)("div",{style:{color:"var(--cas-text-muted)",fontSize:"0.82rem",padding:"1rem 0"},children:"Belum ada publikasi pada akun Anda."}):(0,a.jsx)("div",{style:{display:"grid",gap:"0.65rem",maxHeight:"320px",overflowY:"auto"},children:topPosts.map(p=>(0,a.jsxs)("div",{key:p.id,style:{padding:"0.75rem 0.9rem",borderRadius:10,background:"var(--cas-surface-subtle)",border:"1px solid var(--cas-border)"},children:[
            (0,a.jsx)("div",{style:{fontSize:"0.8rem",color:"var(--cas-text-primary)",fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:p.content}),
            (0,a.jsxs)("div",{style:{display:"flex",gap:"0.85rem",marginTop:"0.4rem",fontSize:"0.72rem",color:"var(--cas-text-muted)"},children:[
              (0,a.jsx)("span",{style:{color:"#059669",fontWeight:700},children:`👍 ${p.reactions_count} Reaksi`}),
              (0,a.jsx)("span",{style:{color:"#0284c7",fontWeight:700},children:`💬 ${p.comments_count} Komentar`}),
              (0,a.jsx)("span",{style:{color:"#d97706",fontWeight:700},children:`✓✓ ${p.reads_count} Dibaca`})
            ]})
          ]}))})
        ]})
      ]})
    ]})
  ]});
}

function CasKeamananPengaturanFullPage({user:curUser}){
  const router=(0,r.useRouter)();
  const[tab,setTab]=(0,t.useState)("password");
  const[oldPass,setOldPass]=(0,t.useState)("");
  const[newPass,setNewPass]=(0,t.useState)("");
  const[confPass,setConfPass]=(0,t.useState)("");
  const[msg,setMsg]=(0,t.useState)(null);
  const[saving,setSaving]=(0,t.useState)(!1);
  const[prefs,setPrefs]=(0,t.useState)(()=>{
    try{return JSON.parse(localStorage.getItem("cas_security_prefs")||"null")||{default_audience:"public",show_online:!0,ticker_enabled:!0};}catch{return{default_audience:"public",show_online:!0,ticker_enabled:!0};}
  });

  const passChecks=[
    {label:"Minimal 8 karakter",ok:newPass.length>=8},
    {label:"Huruf besar & kecil (A-Z, a-z)",ok:/[A-Z]/.test(newPass)&&/[a-z]/.test(newPass)},
    {label:"Mengandung angka (0-9)",ok:/\d/.test(newPass)},
    {label:"Mengandung simbol (!@#$%^&*)",ok:/[^A-Za-z0-9]/.test(newPass)}
  ];
  const passScore=passChecks.filter(c=>c.ok).length;

  const handlePassSubmit=async(ev)=>{
    ev.preventDefault();
    if(!oldPass||!newPass){setMsg({type:"err",text:"Kata sandi lama dan kata sandi baru wajib diisi."});return;}
    if(newPass.length<8){setMsg({type:"err",text:"Kata sandi baru minimal 8 karakter."});return;}
    if(newPass!==confPass){setMsg({type:"err",text:"Konfirmasi kata sandi baru tidak cocok."});return;}
    setSaving(!0);setMsg(null);
    try{
      await M.apiAuth.post("/user/me/change-password",{old_password:oldPass,current_password:oldPass,new_password:newPass,confirm_password:confPass});
      setMsg({type:"ok",text:"Kata sandi berhasil diperbarui."});
      setOldPass("");setNewPass("");setConfPass("");
    }catch(err){
      setMsg({type:"err",text:err?.response?.data?.message||"Gagal mengubah kata sandi. Periksa kata sandi lama Anda."});
    }finally{setSaving(!1);}
  };

  const savePrefs=async()=>{
    setSaving(!0);setMsg(null);
    try{
      localStorage.setItem("cas_security_prefs",JSON.stringify(prefs));
      await M.apiAuth.patch("/user/me/profile",{social_media:{...(curUser?.social_media||{}),privacy_prefs:prefs}}).catch(()=>{});
      setMsg({type:"ok",text:"Preferensi keamanan & privasi Sharese berhasil disimpan."});
    }catch{
      setMsg({type:"err",text:"Gagal menyimpan preferensi."});
    }finally{setSaving(!1);}
  };

  return(0,a.jsxs)("div",{style:{display:"grid",gap:"1rem",paddingTop:"0.2rem"},children:[
    (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"0.75rem"},children:[
      (0,a.jsxs)("div",{children:[
        (0,a.jsx)("h1",{className:"cms-page-title",style:{margin:0,lineHeight:1.25},children:"🛡️ Keamanan & Pengaturan Akun Sharese"}),
        (0,a.jsx)("p",{className:"cms-page-sub",style:{margin:"0.25rem 0 0"},children:"Kelola kata sandi, autentikasi dua faktor (TOTP/OTP), privasi linimasa Sharese, dan keamanan sesi aktif Anda."})
      ]}),
      (0,a.jsx)("span",{style:{padding:"0.38rem 0.85rem",borderRadius:10,background:"rgba(16,185,129,0.14)",border:"1px solid rgba(16,185,129,0.35)",color:"#059669",fontSize:"0.76rem",fontWeight:800},children:"🔒 Proteksi Akun Kedinasan Aktif"})
    ]}),
    (0,a.jsx)("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:[
      {id:"password",label:"🔑 Ubah Kata Sandi"},
      {id:"2fa",label:"📱 Autentikasi 2FA / TOTP"},
      {id:"privacy",label:"👁️ Privasi & Preferensi Sharese"},
      {id:"session",label:"💻 Informasi Sesi & Perangkat"}
    ].map(tb=>(0,a.jsx)("button",{key:tb.id,type:"button",onClick:()=>{setTab(tb.id);setMsg(null);},style:{padding:"0.5rem 1rem",borderRadius:10,border:tab===tb.id?"1.5px solid #38bdf8":"1px solid var(--cas-border-strong)",background:tab===tb.id?"linear-gradient(135deg, #0284c7, #2563eb)":"var(--cas-card-bg)",color:tab===tb.id?"#fff":"var(--cas-text-primary)",fontSize:"0.8rem",fontWeight:800,cursor:"pointer"},children:tb.label}))}),
    msg&&(0,a.jsx)("div",{style:{padding:"0.75rem 1rem",borderRadius:10,background:msg.type==="ok"?"rgba(16,185,129,0.16)":"rgba(239,68,68,0.16)",border:msg.type==="ok"?"1px solid #10b981":"1px solid #ef4444",color:msg.type==="ok"?"#059669":"#dc2626",fontSize:"0.82rem",fontWeight:700},children:msg.text}),
    (0,a.jsxs)("div",{className:"cas-keamanan-bento-grid",children:[
      (0,a.jsxs)("div",{style:{display:"flex",flexDirection:"column"},children:[
        tab==="password"&&(0,a.jsxs)("form",{onSubmit:handlePassSubmit,style:{flex:1,padding:"1.4rem",borderRadius:16,background:"var(--cas-card-bg)",border:"1px solid var(--cas-border)",display:"flex",flexDirection:"column",justifyContent:"space-between",gap:"1rem",boxShadow:"0 4px 16px rgba(15,23,42,0.04)"},children:[
          (0,a.jsxs)("div",{style:{display:"grid",gap:"0.9rem"},children:[
            (0,a.jsxs)("div",{children:[
              (0,a.jsx)("h3",{style:{margin:0,fontSize:"1.02rem",fontWeight:800,color:"var(--cas-text-primary)"},children:"Perbarui Kata Sandi Akun CAS"}),
              (0,a.jsx)("p",{style:{margin:"0.2rem 0 0",fontSize:"0.76rem",color:"var(--cas-text-muted)"},children:"Pastikan kata sandi baru memenuhi standar keamanan siber Bareskrim Polri."})
            ]}),
            (0,a.jsxs)("div",{children:[
              (0,a.jsx)("label",{style:{display:"block",fontSize:"0.78rem",color:"var(--cas-text-secondary)",fontWeight:700,marginBottom:"0.3rem"},children:"Kata Sandi Saat Ini"}),
              (0,a.jsx)("input",{type:"password",required:!0,placeholder:"Masukkan kata sandi saat ini",value:oldPass,onChange:e=>setOldPass(e.target.value),style:{width:"100%",padding:"0.58rem 0.85rem",borderRadius:9,border:"1px solid var(--cas-border-strong)",background:"var(--cas-surface-subtle)",color:"var(--cas-text-primary)",boxSizing:"border-box",fontSize:"0.84rem"}})
            ]}),
            (0,a.jsxs)("div",{children:[
              (0,a.jsx)("label",{style:{display:"block",fontSize:"0.78rem",color:"var(--cas-text-secondary)",fontWeight:700,marginBottom:"0.3rem"},children:"Kata Sandi Baru (Min. 8 Karakter)"}),
              (0,a.jsx)("input",{type:"password",required:!0,placeholder:"Kombinasi huruf, angka & simbol",value:newPass,onChange:e=>setNewPass(e.target.value),style:{width:"100%",padding:"0.58rem 0.85rem",borderRadius:9,border:"1px solid var(--cas-border-strong)",background:"var(--cas-surface-subtle)",color:"var(--cas-text-primary)",boxSizing:"border-box",fontSize:"0.84rem"}})
            ]}),
            (0,a.jsxs)("div",{children:[
              (0,a.jsx)("label",{style:{display:"block",fontSize:"0.78rem",color:"var(--cas-text-secondary)",fontWeight:700,marginBottom:"0.3rem"},children:"Konfirmasi Kata Sandi Baru"}),
              (0,a.jsx)("input",{type:"password",required:!0,placeholder:"Ulangi kata sandi baru",value:confPass,onChange:e=>setConfPass(e.target.value),style:{width:"100%",padding:"0.58rem 0.85rem",borderRadius:9,border:"1px solid var(--cas-border-strong)",background:"var(--cas-surface-subtle)",color:"var(--cas-text-primary)",boxSizing:"border-box",fontSize:"0.84rem"}})
            ]}),
            (0,a.jsxs)("div",{style:{padding:"0.75rem 0.9rem",borderRadius:12,background:"var(--cas-surface-subtle)",border:"1px solid var(--cas-border)"},children:[
              (0,a.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.45rem"},children:[
                (0,a.jsx)("span",{style:{fontSize:"0.74rem",fontWeight:800,color:"var(--cas-text-secondary)"},children:"Indikator Kekuatan Kata Sandi"}),
                (0,a.jsx)("span",{style:{fontSize:"0.72rem",fontWeight:800,color:passScore>=3?"#059669":passScore>=2?"#d97706":"#64748b"},children:newPass?passScore===4?"Sangat Kuat":passScore===3?"Kuat":passScore===2?"Sedang":"Lemah":"Belum diisi"})
              ]}),
              (0,a.jsx)("div",{style:{display:"grid",gridTemplateColumns:"repeat(2, minmax(0, 1fr))",gap:"0.35rem"},children:passChecks.map((chk,idx)=>(0,a.jsxs)("div",{key:idx,style:{display:"flex",alignItems:"center",gap:"0.35rem",fontSize:"0.73rem",color:chk.ok?"#059669":"var(--cas-text-muted)",fontWeight:chk.ok?700:500},children:[
                (0,a.jsx)("span",{children:chk.ok?"✓":"○"}),
                (0,a.jsx)("span",{children:chk.label})
              ]}))})
            ]})
          ]}),
          (0,a.jsxs)("div",{style:{display:"flex",gap:"0.6rem",flexWrap:"wrap",paddingTop:"0.25rem"},children:[
            (0,a.jsx)("button",{type:"submit",disabled:saving,style:{padding:"0.58rem 1.25rem",borderRadius:9,border:"none",background:"#2563eb",color:"#fff",fontWeight:800,fontSize:"0.82rem",cursor:"pointer"},children:saving?"Menyimpan…":"Simpan Kata Sandi Baru"}),
            (0,a.jsx)("button",{type:"button",onClick:()=>casNav(router,"/cms/profile/reset-password"),style:{padding:"0.58rem 1rem",borderRadius:9,border:"1px solid var(--cas-border-strong)",background:"var(--cas-surface-subtle)",color:"#0284c7",fontWeight:700,fontSize:"0.82rem",cursor:"pointer"},children:"Buka Modul Reset Password Lengkap ➔"})
          ]})
        ]}),
        tab==="2fa"&&(0,a.jsxs)("div",{style:{flex:1,padding:"1.4rem",borderRadius:16,background:"var(--cas-card-bg)",border:"1px solid var(--cas-border)",display:"flex",flexDirection:"column",justifyContent:"space-between",gap:"1rem",boxShadow:"0 4px 16px rgba(15,23,42,0.04)"},children:[
          (0,a.jsxs)("div",{style:{display:"grid",gap:"0.75rem"},children:[
            (0,a.jsx)("h3",{style:{margin:0,fontSize:"1.02rem",fontWeight:800,color:"var(--cas-text-primary)"},children:"Autentikasi Dua Faktor (TOTP Google/Microsoft Authenticator)"}),
            (0,a.jsx)("p",{style:{margin:0,fontSize:"0.83rem",color:"var(--cas-text-muted)",lineHeight:1.55},children:"Lindungi akun kedinasan Anda dengan verifikasi 2 langkah (TOTP QR Code atau OTP Email Polri) setiap kali melakukan login dari perangkat baru."}),
            (0,a.jsx)("div",{style:{padding:"0.85rem 1rem",borderRadius:12,background:"var(--cas-surface-subtle)",border:"1px solid var(--cas-border)",fontSize:"0.78rem",color:"var(--cas-text-secondary)",lineHeight:1.5},children:"Aplikasi yang didukung: Google Authenticator, Microsoft Authenticator, Authy, atau OTP Email Resmi Polri."})
          ]}),
          (0,a.jsxs)("div",{style:{display:"flex",gap:"0.65rem",flexWrap:"wrap"},children:[
            (0,a.jsx)("button",{type:"button",onClick:()=>casNav(router,"/cms/profile/reset-totp"),style:{padding:"0.58rem 1.15rem",borderRadius:9,border:"none",background:"linear-gradient(135deg, #0284c7, #2563eb)",color:"#fff",fontWeight:800,fontSize:"0.82rem",cursor:"pointer"},children:"📱 Konfigurasi / Reset QR TOTP Sekarang"}),
            (0,a.jsx)("button",{type:"button",onClick:()=>casNav(router,"/cms/profile"),style:{padding:"0.58rem 1rem",borderRadius:9,border:"1px solid var(--cas-border-strong)",background:"var(--cas-surface-subtle)",color:"var(--cas-text-primary)",fontWeight:700,fontSize:"0.82rem",cursor:"pointer"},children:"👤 Kembali ke Profil Saya"})
          ]})
        ]}),
        tab==="privacy"&&(0,a.jsxs)("div",{style:{flex:1,padding:"1.4rem",borderRadius:16,background:"var(--cas-card-bg)",border:"1px solid var(--cas-border)",display:"flex",flexDirection:"column",justifyContent:"space-between",gap:"1rem",boxShadow:"0 4px 16px rgba(15,23,42,0.04)"},children:[
          (0,a.jsxs)("div",{style:{display:"grid",gap:"1rem"},children:[
            (0,a.jsx)("h3",{style:{margin:0,fontSize:"1.02rem",fontWeight:800,color:"var(--cas-text-primary)"},children:"Preferensi Privasi & Visibilitas Sharese"}),
            (0,a.jsxs)("div",{children:[
              (0,a.jsx)("label",{style:{display:"block",fontSize:"0.8rem",fontWeight:700,color:"var(--cas-text-secondary)",marginBottom:"0.35rem"},children:"Audiens Default Saat Membuat Postingan Baru"}),
              (0,a.jsxs)("select",{value:prefs.default_audience,onChange:e=>setPrefs(p=>({...p,default_audience:e.target.value})),style:{width:"100%",padding:"0.58rem 0.85rem",borderRadius:9,border:"1px solid var(--cas-border-strong)",background:"var(--cas-surface-subtle)",color:"var(--cas-text-primary)",fontSize:"0.84rem"},children:[
                (0,a.jsx)("option",{value:"public",children:"🌐 Publik Seluruh Jajaran Polri"}),
                (0,a.jsx)("option",{value:"regional",children:"🏢 Internal Satker / Polda Terkait"}),
                (0,a.jsx)("option",{value:"friends",children:"🤝 Hanya Jejaring Koneksi"})
              ]})
            ]}),
            (0,a.jsxs)("label",{style:{display:"flex",alignItems:"center",gap:"0.65rem",fontSize:"0.84rem",color:"var(--cas-text-secondary)",cursor:"pointer"},children:[
              (0,a.jsx)("input",{type:"checkbox",checked:Boolean(prefs.show_online),onChange:e=>setPrefs(p=>({...p,show_online:e.target.checked}))}),
              "Tampilkan indikator status Online (Aktif) pada menu Obrolan & Koneksi"
            ]})
          ]}),
          (0,a.jsx)("button",{type:"button",onClick:savePrefs,disabled:saving,style:{padding:"0.58rem 1.25rem",borderRadius:9,border:"none",background:"#2563eb",color:"#fff",fontWeight:800,fontSize:"0.82rem",cursor:"pointer", alignSelf:"flex-start"},children:"Simpan Preferensi Privasi"})
        ]}),
        tab==="session"&&(0,a.jsxs)("div",{style:{flex:1,padding:"1.4rem",borderRadius:16,background:"var(--cas-card-bg)",border:"1px solid var(--cas-border)",display:"flex",flexDirection:"column",justifyContent:"space-between",gap:"1rem",boxShadow:"0 4px 16px rgba(15,23,42,0.04)"},children:[
          (0,a.jsxs)("div",{style:{display:"grid",gap:"0.85rem"},children:[
            (0,a.jsx)("h3",{style:{margin:0,fontSize:"1.02rem",fontWeight:800,color:"var(--cas-text-primary)"},children:"Sesi Login Kedinasan Aktif"}),
            (0,a.jsx)("div",{style:{display:"grid",gridTemplateColumns:"repeat(2, minmax(0, 1fr))",gap:"0.75rem",fontSize:"0.82rem"},children:[
              {k:"Nama Personil",v:casFormatHumanName(curUser?.name||"-")},
              {k:"Username / Callsign",v:formatUserCallsign(curUser)||"-"},
              {k:"Role RBAC",v:curUser?.role_bdb||"operator"},
              {k:"Satker",v:curUser?.satker_nama||curUser?.satker||"Polri"}
            ].map((r,i)=>(0,a.jsxs)("div",{key:i,style:{padding:"0.7rem 0.85rem",borderRadius:10,background:"var(--cas-surface-subtle)",border:"1px solid var(--cas-border)"},children:[
              (0,a.jsx)("div",{style:{fontSize:"0.7rem",color:"var(--cas-text-muted)",fontWeight:600},children:r.k}),
              (0,a.jsx)("div",{style:{fontWeight:800,color:"var(--cas-text-primary)",marginTop:"0.15rem"},children:r.v})
            ]}))})
          ]}),
          (0,a.jsx)("div",{style:{fontSize:"0.75rem",color:"var(--cas-text-muted)"},children:"Sesi ini dilindungi dengan token otorisasi terenkripsi dan diaudit secara otomatis."})
        ]})
      ]}),
      (0,a.jsxs)("div",{style:{padding:"1.4rem",borderRadius:16,background:"var(--cas-card-bg)",border:"1px solid var(--cas-border)",display:"flex",flexDirection:"column",justifyContent:"space-between",gap:"1rem",boxShadow:"0 4px 16px rgba(15,23,42,0.04)"},children:[
        (0,a.jsxs)("div",{style:{display:"grid",gap:"0.85rem"},children:[
          (0,a.jsxs)("div",{children:[
            (0,a.jsx)("h3",{style:{margin:0,fontSize:"0.98rem",fontWeight:800,color:"var(--cas-text-primary)"},children:"🛡️ Status Proteksi & Standar Keamanan Akun"}),
            (0,a.jsx)("p",{style:{margin:"0.2rem 0 0",fontSize:"0.75rem",color:"var(--cas-text-muted)"},children:"Ringkasan lapisan pelindung aktif pada akun Big Data Binops & Sharese Anda."})
          ]}),
          (0,a.jsx)("div",{style:{display:"grid",gap:"0.55rem"},children:[
            {title:"Enkripsi Sesi JWT & TLS Aktif",desc:"Lalu lintas data LP, Jukrah, dan Obrolan dienkripsi penuh.",badge:"Aktif",color:"#059669"},
            {title:"Verifikasi PIN 4-Digit & Captcha Aktif",desc:"Gerbang login dilindungi PIN keamanan dan verifikasi anti-bot.",badge:"Aktif",color:"#0284c7"},
            {title:"Audit Log Bareskrim Aktif",desc:"Setiap perubahan sandi dan akses dokumen tercatat otomatis.",badge:"Tercatat",color:"#7c3aed"}
          ].map((item,idx)=>(0,a.jsxs)("div",{key:idx,style:{padding:"0.7rem 0.85rem",borderRadius:12,background:"var(--cas-surface-subtle)",border:"1px solid var(--cas-border)",display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:"0.65rem"},children:[
            (0,a.jsxs)("div",{style:{minWidth:0,flex:1},children:[
              (0,a.jsx)("div",{style:{fontSize:"0.8rem",fontWeight:800,color:"var(--cas-text-primary)"},children:item.title}),
              (0,a.jsx)("div",{style:{fontSize:"0.73rem",color:"var(--cas-text-muted)",marginTop:"0.15rem",lineHeight:1.4},children:item.desc})
            ]}),
            (0,a.jsx)("span",{style:{padding:"0.15rem 0.55rem",borderRadius:999,fontSize:"0.68rem",fontWeight:800,background:"rgba(16,185,129,0.14)",color:item.color,flexShrink:0},children:`✓ ${item.badge}`})
          ]}))}),
          (0,a.jsxs)("div",{style:{padding:"0.8rem 0.95rem",borderRadius:12,background:"rgba(37,99,235,0.06)",border:"1px solid rgba(37,99,235,0.2)",fontSize:"0.75rem",color:"var(--cas-text-secondary)",lineHeight:1.5},children:[
            (0,a.jsx)("div",{style:{fontWeight:800,color:"#2563eb",marginBottom:"0.3rem"},children:"📌 Pedoman Keamanan Sandi Polri:"}),
            (0,a.jsxs)("ul",{style:{margin:0,paddingLeft:"1.1rem",display:"grid",gap:"0.2rem"},children:[
              (0,a.jsx)("li",{children:"Gunakan kombinasi huruf besar, huruf kecil, angka, dan simbol."}),
              (0,a.jsx)("li",{children:"Hindari menggunakan NRP atau tanggal lahir sebagai kata sandi."}),
              (0,a.jsx)("li",{children:"Perbarui kata sandi secara berkala setiap 90 hari."})
            ]})
          ]})
        ]}),
        (0,a.jsxs)("div",{style:{paddingTop:"0.65rem",borderTop:"1px solid var(--cas-border)",display:"flex",alignItems:"center",justifyContent:"space-between",fontSize:"0.74rem",color:"var(--cas-text-muted)"},children:[
          (0,a.jsx)("span",{children:`Akun: ${casFormatHumanName(curUser?.name||"Personil Polri")}`}),
          (0,a.jsx)("span",{style:{fontWeight:700,color:"#0284c7"},children:formatUserCallsign(curUser)||"@personil"})
        ]})
      ]})
    ]})
  ]});
}

function CasPusatBantuanFullPage({user:curUser}){
  const router=(0,r.useRouter)();
  const[cards,setCards]=(0,t.useState)([]);
  const[loading,setLoading]=(0,t.useState)(!0);
  const canManage=["superadmin","admin_binops"].includes(String(curUser?.role_bdb||"").toLowerCase());

  (0,t.useEffect)(()=>{
    M.apiAuth.get("/bdb/jukrah/pusat-bantuan-cards").then(res=>{
      setCards(Array.isArray(res.data?.data)?res.data.data:[]);
    }).catch(()=>{}).finally(()=>setLoading(!1));
  },[]);

  return(0,a.jsxs)("div",{style:{display:"grid",gap:"1.15rem"},children:[
    (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"0.75rem"},children:[
      (0,a.jsxs)("div",{children:[
        (0,a.jsx)("h1",{className:"cms-page-title",style:{margin:0},children:"🎧 Pusat Bantuan & Dukungan Operasional CAS"}),
        (0,a.jsx)("p",{className:"cms-page-sub",children:"Layanan Helpdesk Teknis & Operasional 24/7 Robinopsnal Bareskrim Polri untuk seluruh jajaran Polda, Polres, dan Polsek."})
      ]}),
      (0,a.jsxs)("div",{style:{display:"flex",gap:"0.55rem",flexWrap:"wrap"},children:[
        (0,a.jsx)("button",{type:"button",onClick:()=>casNav(router,"/cms/broadcaster?view=obrolan&partner=-1"),style:{padding:"0.5rem 1rem",borderRadius:10,border:"1px solid #38bdf8",background:"rgba(2,132,199,0.16)",color:"#0284c7",fontWeight:800,fontSize:"0.8rem",cursor:"pointer"},children:"🤖 Tanya AI Agen Taktis CAS"}),
        canManage&&(0,a.jsx)("button",{type:"button",onClick:()=>casNav(router,"/cms/pengaturan/pusat-bantuan"),style:{padding:"0.5rem 1rem",borderRadius:10,border:"none",background:"#2563eb",color:"#fff",fontWeight:800,fontSize:"0.8rem",cursor:"pointer"},children:"⚙️ Kelola Kartu Pusat Bantuan"})
      ]})
    ]}),
    loading?(0,a.jsx)("div",{style:{padding:"3rem",textAlign:"center",color:"var(--cas-text-muted)"},children:"⏳ Memuat saluran Pusat Bantuan…"}):(0,a.jsx)("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))",gap:"1rem"},children:cards.map((c,idx)=>(0,a.jsxs)("div",{key:c.id||idx,style:{padding:"1.25rem",borderRadius:16,background:"var(--cas-card-bg)",border:"1px solid var(--cas-border-strong)",display:"flex",flexDirection:"column",justifyContent:"space-between",gap:"1rem",boxShadow:"0 8px 20px rgba(15,23,42,0.06)"},children:[
      (0,a.jsxs)("div",{children:[
        (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.65rem"},children:[
          (0,a.jsx)("span",{style:{fontSize:"1.5rem"},children:c.icon==="whatsapp"?"💬":c.icon==="mail"?"✉️":c.icon==="phone"?"☎️":"📘"}),
          c.badge&&(0,a.jsx)("span",{style:{fontSize:"0.68rem",fontWeight:800,padding:"0.18rem 0.55rem",borderRadius:999,background:"rgba(56,189,248,0.16)",color:"#0284c7",border:"1px solid rgba(56,189,248,0.35)"},children:c.badge})
        ]}),
        (0,a.jsx)("h3",{style:{margin:"0 0 0.35rem",fontSize:"1rem",fontWeight:800,color:"var(--cas-text-primary)"},children:c.title||c.judul}),
        (0,a.jsx)("p",{style:{margin:0,fontSize:"0.8rem",color:"var(--cas-text-muted)",lineHeight:1.45},children:c.subtitle||c.deskripsi}),
        (0,a.jsx)("div",{style:{marginTop:"0.75rem",fontSize:"0.88rem",fontWeight:800,color:"#0284c7",fontFamily:"monospace"},children:c.contact||c.kontak||c.nilai||""})
      ]}),
      (0,a.jsx)("a",{href:c.action_url||c.link||"/cms/panduan",target:(c.action_url||"").startsWith("http")?"_blank":"_self",rel:"noreferrer",style:{display:"inline-flex",alignItems:"center",justifyContent:"center",padding:"0.55rem 1rem",borderRadius:10,background:"linear-gradient(135deg, #0284c7 0%, #2563eb 100%)",color:"#fff",fontSize:"0.8rem",fontWeight:800,textDecoration:"none"},children:"Hubungi / Buka Layanan ➔"})
    ]}))}),
    (0,a.jsxs)("div",{style:{padding:"1.25rem",borderRadius:16,background:"var(--cas-card-bg)",border:"1px solid var(--cas-border)"},children:[
      (0,a.jsx)("h3",{style:{margin:"0 0 0.85rem",fontSize:"0.98rem",fontWeight:800,color:"var(--cas-text-primary)"},children:"💡 Pertanyaan Umum (FAQ Operasional & Teknis CAS)"}),
      (0,a.jsx)("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))",gap:"0.85rem"},children:[
        {q:"Bagaimana cara sinkronisasi data LP dari DORS?",a:"Buka menu Portal Integrasi → Masuk → Tarik Data, pilih rentang tanggal, lalu tinjau di Staging & Cek Duplikat sebelum Import ke Database."},
        {q:"Bagaimana cara menambahkan Penyelesaian Perkara (Selra)?",a:"Pada menu Laporan → Rekap, pilih detail LP terkait lalu unggah dokumen Selra (P21, SP3, RJ, atau Pelimpahan) sesuai alur dokumen penyidikan."},
        {q:"Bagaimana jika lupa kode TOTP / ganti perangkat HP?",a:"Buka menu Sharese → Keamanan → Autentikasi 2FA / TOTP atau hubungi Helpdesk Robinopsnal untuk reset token perangkat."}
      ].map((f,i)=>(0,a.jsxs)("div",{key:i,style:{padding:"0.9rem",borderRadius:12,background:"var(--cas-surface-subtle)",border:"1px solid var(--cas-border)"},children:[
        (0,a.jsx)("div",{style:{fontWeight:800,fontSize:"0.84rem",color:"#0284c7",marginBottom:"0.3rem"},children:f.q}),
        (0,a.jsx)("div",{style:{fontSize:"0.78rem",color:"var(--cas-text-secondary)",lineHeight:1.45},children:f.a})
      ]}))})
    ]})
  ]});
}

function CasPublicShareseGateway({shareHash:rawHashProp}){
  const rawHash=(0,t.useMemo)(()=>{
    if(rawHashProp)return String(rawHashProp).trim();
    if("undefined"!=typeof window){
      const sp=new URLSearchParams(window.location.search||"");
      return String(sp.get("share")||sp.get("post")||"").trim();
    }
    return "";
  },[rawHashProp]);
  const decoded=(0,t.useMemo)(()=>decodeCasShareHash(rawHash),[rawHash]);
  const[challenge,setChallenge]=(0,t.useState)(null);
  const[captchaMode,setCaptchaMode]=(0,t.useState)("jukrah");
  const[loadingCh,setLoadingCh]=(0,t.useState)(!0);
  const[nrp,setNrp]=(0,t.useState)("");
  const[checkingNrp,setCheckingNrp]=(0,t.useState)(!1);
  const[nrpProfile,setNrpProfile]=(0,t.useState)(null);
  const[nama,setNama]=(0,t.useState)("");
  const[satker,setSatker]=(0,t.useState)("");
  const[jenisPersonel,setJenisPersonel]=(0,t.useState)("POLRI");
  const[captchaAns,setCaptchaAns]=(0,t.useState)("");
  const[verifying,setVerifying]=(0,t.useState)(!1);
  const[errMsg,setErrMsg]=(0,t.useState)("");
  const[verifiedPost,setVerifiedPost]=(0,t.useState)(null);
  const[verifiedViewer,setVerifiedViewer]=(0,t.useState)(null);
  const[comments,setComments]=(0,t.useState)([]);
  const[wmPos,setWmPos]=(0,t.useState)({top:18,left:12});

  const loadChallenge=(0,t.useCallback)(async()=>{
    if(!rawHash)return;
    setLoadingCh(!0);
    setErrMsg("");
    try{
      const qs=[];
      if(decoded.isSpToken)qs.push("token="+encodeURIComponent(rawHash));
      if(decoded.postId)qs.push("id="+encodeURIComponent(String(decoded.postId)));
      if(!qs.length)qs.push("token="+encodeURIComponent(rawHash));
      let jukData=null;
      try{
        const rJ=await fetch("/api/bdb/jukrah/share-challenge?"+qs.join("&"));
        const jJ=await rJ.json();
        if(rJ.ok&&jJ?.data)jukData=jJ.data;
      }catch(_e){}
      if(jukData){
        setCaptchaMode("jukrah");
        setChallenge(jukData);
        setCaptchaAns("");
        return;
      }
      const rP=await fetch("/api/bdb/panduan/public/captcha");
      const jP=await rP.json();
      const dP=jP?.data||jP;
      if(rP.ok&&(dP?.svg||dP?.captcha_svg||dP?.image)){
        setCaptchaMode("public");
        setChallenge({
          challenge_token:dP.challenge_id||dP.captcha_id||dP.token||dP.id||"",
          captcha_svg:dP.captcha_svg||dP.svg||dP.image||"",
          post_preview:null
        });
        setCaptchaAns("");
        return;
      }
      throw new Error("Tautan berhash Sharese tidak valid atau sudah kedaluwarsa.");
    }catch(e){
      setErrMsg(e?.message||"Gagal memuat gerbang keamanan Sharese.");
    }finally{
      setLoadingCh(!1);
    }
  },[rawHash,decoded]);

  (0,t.useEffect)(()=>{loadChallenge()},[loadChallenge]);

  (0,t.useEffect)(()=>{
    if(!verifiedPost)return;
    const iv=setInterval(()=>{
      setWmPos({top:10+Math.floor(Math.random()*70),left:6+Math.floor(Math.random()*56)});
    },4000);
    return()=>clearInterval(iv);
  },[verifiedPost]);

  const handleCheckNrp=async(rawVal)=>{
    const clean=String(rawVal??nrp).trim();
    if(clean.length<5)return null;
    setCheckingNrp(!0);
    try{
      let prof=null;
      try{
        const r1=await fetch("/api/bdb/panduan/public/verify-nrp",{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({nrp:clean})
        });
        const j1=await r1.json();
        const d1=j1?.data||j1;
        if(r1.ok&&d1&&(d1.nama||d1.masked_name||d1.name||d1.valid)){
          prof={
            nama:d1.masked_name||d1.nama||d1.name||("Personel "+clean),
            pangkat:d1.pangkat||d1.rank||"",
            satker:d1.satker||d1.jabatan||"Polri",
            nrp:d1.nrp||clean
          };
        }
      }catch(_e){}
      if(!prof){
        try{
          const r2=await fetch("/api/bdb/panduan/public/verify-nrp?nrp="+encodeURIComponent(clean));
          const j2=await r2.json();
          const d2=j2?.data||j2;
          if(r2.ok&&d2&&(d2.nama||d2.masked_name||d2.name||d2.valid)){
            prof={
              nama:d2.masked_name||d2.nama||d2.name||("Personel "+clean),
              pangkat:d2.pangkat||d2.rank||"",
              satker:d2.satker||d2.jabatan||"Polri",
              nrp:d2.nrp||clean
            };
          }
        }catch(_e){}
      }
      if(prof){
        setNrpProfile(prof);
        if(!nama)setNama((prof.pangkat?prof.pangkat+" ":"")+prof.nama);
        if(!satker)setSatker(prof.satker||"Polri");
      }
      return prof;
    }finally{
      setCheckingNrp(!1);
    }
  };

  const handleSubmit=async(ev)=>{
    if(ev&&ev.preventDefault)ev.preventDefault();
    const cleanNrp=nrp.trim();
    const cleanAns=captchaAns.trim().toUpperCase();
    if(cleanNrp.length<4){
      setErrMsg("Masukkan NRP / NIP Personel yang valid (minimal 4 digit).");
      return;
    }
    if(!cleanAns){
      setErrMsg("Masukkan 6 karakter kode Captcha.");
      return;
    }
    setVerifying(!0);
    setErrMsg("");
    try{
      let prof=nrpProfile;
      if(!prof)prof=await handleCheckNrp(cleanNrp);
      const finalNama=(prof&&((prof.pangkat?prof.pangkat+" ":"")+prof.nama))||nama.trim()||("Personel NRP "+cleanNrp);
      const finalSatker=(prof&&prof.satker)||satker.trim()||"Polri";

      let postObj=null;
      let viewerObj={
        jenis_personel:jenisPersonel,
        nama:finalNama,
        pangkat:prof?.pangkat||"",
        nrp_nip:cleanNrp,
        satker:finalSatker,
        verified_at:new Date().toISOString()
      };

      if(captchaMode==="jukrah"&&challenge?.challenge_token){
        const rV=await fetch("/api/bdb/jukrah/verify-share",{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({
            challenge_token:challenge.challenge_token,
            share_token:decoded.isSpToken?rawHash:undefined,
            post_id:decoded.postId||challenge?.post_preview?.id||undefined,
            jenis_personel:jenisPersonel,
            nama:finalNama,
            nrp_nip:cleanNrp,
            satker:finalSatker,
            captcha_answer:cleanAns
          })
        });
        const jV=await rV.json();
        if(!rV.ok||!jV?.data?.post){
          throw new Error(jV?.message||"Verifikasi gagal. Periksa kembali NRP dan kode Captcha Anda.");
        }
        postObj=jV.data.post;
        if(jV.data.viewer)viewerObj={...viewerObj,...jV.data.viewer,pangkat:prof?.pangkat||""};
      }else{
        try{
          await fetch("/api/bdb/panduan/public/verify-nrp",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
              nrp:cleanNrp,
              challenge_id:challenge?.challenge_token,
              captcha_id:challenge?.challenge_token,
              captcha_answer:cleanAns,
              captcha_code:cleanAns
            })
          });
        }catch(_e){}
        const targetRef=decoded.postId||rawHash;
        const rPub=await fetch("/api/bdb/sharese/public/post/"+encodeURIComponent(String(targetRef))+"?nrp="+encodeURIComponent(cleanNrp));
        const jPub=await rPub.json();
        const dPub=jPub?.data||jPub;
        postObj=dPub?.post||dPub;
        if(!rPub.ok||!postObj?.id){
          throw new Error(jPub?.message||"Gagal memuat siaran Sharese terproteksi.");
        }
      }

      try{
        const targetId=postObj.id||decoded.postId||rawHash;
        const rPub2=await fetch("/api/bdb/sharese/public/post/"+encodeURIComponent(String(targetId))+"?nrp="+encodeURIComponent(cleanNrp));
        if(rPub2.ok){
          const jPub2=await rPub2.json();
          const d2=jPub2?.data||jPub2;
          const cList=d2?.comments||d2?.recent_comments||d2?.post?.comments||d2?.post?.recent_comments;
          if(Array.isArray(cList))setComments(cList);
        }
      }catch(_e){}

      setVerifiedPost(postObj);
      setVerifiedViewer(viewerObj);
    }catch(e){
      setErrMsg(e?.message||"Verifikasi gagal.");
      loadChallenge();
    }finally{
      setVerifying(!1);
    }
  };

  const wmText=verifiedViewer
    ?`SHARESE CAS BARESKRIM • ${verifiedViewer.nama} (${verifiedViewer.nrp_nip}) • ${verifiedViewer.satker}`
    :"SHARESE CAS BARESKRIM POLRI • TERPROTEKSI";

  return(0,a.jsx)("div",{
    className:"cas-sharese-viewer-wrap",
    onContextMenu:ev=>ev.preventDefault(),
    style:{minHeight:"100vh",background:"radial-gradient(circle at top, #0f172a 0%, #020617 100%)",color:"#f8fafc",padding:"1.25rem 0.75rem 2.5rem",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-start",boxSizing:"border-box",overflowX:"hidden"},
    children:(0,a.jsxs)("div",{
      className:"cas-sharese-gate-card",
      style:{width:"100%",maxWidth:"46rem",background:"rgba(15,23,42,0.94)",border:"1px solid rgba(56,189,248,0.32)",borderRadius:"16px",padding:"1.35rem",boxShadow:"0 20px 60px rgba(0,0,0,0.65)",position:"relative",overflow:"hidden",boxSizing:"border-box"},
      children:[
        (0,a.jsxs)("div",{
          className:"cas-sharese-header-row",
          style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.65rem",borderBottom:"1px solid rgba(148,163,184,0.18)",paddingBottom:"0.85rem",marginBottom:"1.1rem",flexWrap:"wrap"},
          children:[
            (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.65rem",minWidth:0},children:[
              (0,a.jsx)("div",{style:{width:"2.4rem",height:"2.4rem",borderRadius:"10px",background:"linear-gradient(135deg, #2563eb, #0284c7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.15rem",flexShrink:0},children:"🛡️"}),
              (0,a.jsxs)("div",{style:{minWidth:0},children:[
                (0,a.jsx)("div",{style:{fontWeight:900,fontSize:"0.98rem",color:"#f8fafc",lineHeight:1.25},children:"SHARESE — GERBANG VERIFIKASI ANGGOTA"}),
                (0,a.jsx)("div",{style:{fontSize:"0.74rem",color:"#94a3b8"},children:"Siaran Kedinasan Terenkripsi • CAS Bareskrim Polri"})
              ]})
            ]}),
            (0,a.jsx)("a",{href:"/login",title:"Masuk ke sistem lengkap CAS menggunakan akun kedinasan Anda",style:{padding:"0.42rem 0.85rem",borderRadius:"8px",background:"rgba(56,189,248,0.14)",border:"1px solid rgba(56,189,248,0.38)",color:"#38bdf8",fontSize:"0.76rem",fontWeight:800,textDecoration:"none",whiteSpace:"nowrap"},children:"🔐 Masuk ke Sistem Lengkap"})
          ]
        }),
        !verifiedPost?(
          (0,a.jsxs)("form",{onSubmit:handleSubmit,style:{display:"grid",gap:"0.9rem"},children:[
            challenge?.post_preview&&(0,a.jsxs)("div",{style:{padding:"0.75rem 0.95rem",borderRadius:"10px",background:"rgba(30,41,59,0.7)",border:"1px solid rgba(148,163,184,0.22)"},children:[
              (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.45rem",flexWrap:"wrap",marginBottom:"0.25rem"},children:[
                challenge.post_preview.is_official_jukrah&&(0,a.jsx)("span",{style:{fontSize:"0.65rem",fontWeight:800,padding:"0.1rem 0.45rem",borderRadius:"4px",background:"rgba(245,158,11,0.22)",color:"#fbbf24",border:"1px solid rgba(245,158,11,0.45)"},children:"📢 JUKRAH RESMI"}),
                (0,a.jsx)("span",{style:{fontWeight:800,color:"#38bdf8",fontSize:"0.84rem"},children:challenge.post_preview.author_handle}),
                (0,a.jsx)("span",{style:{fontSize:"0.74rem",color:"#94a3b8"},children:"• "+challenge.post_preview.author_satker})
              ]}),
              (0,a.jsx)("div",{style:{fontSize:"0.82rem",color:"#e2e8f0",fontWeight:600},children:`"${challenge.post_preview.title}..."`})
            ]}),
            (0,a.jsxs)("div",{style:{background:"rgba(2,6,23,0.65)",border:"1px solid rgba(56,189,248,0.25)",borderRadius:"12px",padding:"1rem",display:"grid",gap:"0.8rem"},children:[
              (0,a.jsxs)("div",{children:[
                (0,a.jsx)("h2",{style:{margin:0,fontSize:"0.95rem",fontWeight:800,color:"#38bdf8"},children:'🛡️ "Siapa Saya?" — Verifikasi NRP Personel & Captcha'}),
                (0,a.jsx)("p",{style:{margin:"0.2rem 0 0",fontSize:"0.76rem",color:"#94a3b8",lineHeight:1.4},children:"Masukkan NRP/NIP dan kode Captcha untuk membuka siaran & lampiran terproteksi."})
              ]}),
              errMsg&&(0,a.jsx)("div",{style:{padding:"0.55rem 0.75rem",borderRadius:"8px",background:"rgba(239,68,68,0.16)",border:"1px solid rgba(239,68,68,0.45)",color:"#fca5a5",fontSize:"0.78rem",fontWeight:700},children:"⚠️ "+errMsg}),
              nrpProfile&&(0,a.jsxs)("div",{style:{padding:"0.55rem 0.75rem",borderRadius:"8px",background:"rgba(16,185,129,0.14)",border:"1px solid rgba(16,185,129,0.4)",color:"#6ee7b7",fontSize:"0.78rem",fontWeight:700},children:[
                '✅ Terdeteksi Anggota ("Siapa Saya?"): ',
                (0,a.jsx)("strong",{children:(nrpProfile.pangkat?nrpProfile.pangkat+" ":"")+nrpProfile.nama}),
                " • ",nrpProfile.satker
              ]}),
              (0,a.jsxs)("div",{className:"cas-sharese-gate-grid",style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(190px, 1fr))",gap:"0.65rem"},children:[
                (0,a.jsxs)("div",{children:[
                  (0,a.jsx)("label",{style:{display:"block",fontSize:"0.72rem",fontWeight:700,color:"#cbd5e1",marginBottom:"0.25rem"},children:"NRP / NIP Personel *"}),
                  (0,a.jsxs)("div",{style:{display:"flex",gap:"0.35rem"},children:[
                    (0,a.jsx)("input",{
                      type:"text",
                      required:!0,
                      value:nrp,
                      onChange:e=>setNrp(e.target.value),
                      onBlur:e=>handleCheckNrp(e.target.value),
                      placeholder:"Ketik NRP / NIP",
                      style:{flex:1,minWidth:0,padding:"0.5rem 0.65rem",borderRadius:"8px",background:"#0f172a",border:"1px solid #334155",color:"#f8fafc",fontSize:"0.82rem",boxSizing:"border-box"}
                    }),
                    (0,a.jsx)("button",{
                      type:"button",
                      onClick:()=>handleCheckNrp(nrp),
                      disabled:checkingNrp,
                      title:'Cek identitas NRP otomatis ("Siapa Saya?")',
                      style:{padding:"0.5rem 0.65rem",borderRadius:"8px",border:"1px solid rgba(56,189,248,0.4)",background:"rgba(56,189,248,0.15)",color:"#38bdf8",fontWeight:800,fontSize:"0.74rem",cursor:"pointer",whiteSpace:"nowrap"},
                      children:checkingNrp?"⏳":"🔍 Cek"
                    })
                  ]})
                ]}),
                (0,a.jsxs)("div",{children:[
                  (0,a.jsx)("label",{style:{display:"block",fontSize:"0.72rem",fontWeight:700,color:"#cbd5e1",marginBottom:"0.25rem"},children:"Nama / Pangkat"}),
                  (0,a.jsx)("input",{
                    type:"text",
                    value:nama,
                    onChange:e=>setNama(e.target.value),
                    placeholder:"Otomatis / isi nama",
                    style:{width:"100%",padding:"0.5rem 0.65rem",borderRadius:"8px",background:"#0f172a",border:"1px solid #334155",color:"#f8fafc",fontSize:"0.82rem",boxSizing:"border-box"}
                  })
                ]}),
                (0,a.jsxs)("div",{children:[
                  (0,a.jsx)("label",{style:{display:"block",fontSize:"0.72rem",fontWeight:700,color:"#cbd5e1",marginBottom:"0.25rem"},children:"Satker / Polda / Polres"}),
                  (0,a.jsx)("input",{
                    type:"text",
                    value:satker,
                    onChange:e=>setSatker(e.target.value),
                    placeholder:"Otomatis / isi satker",
                    style:{width:"100%",padding:"0.5rem 0.65rem",borderRadius:"8px",background:"#0f172a",border:"1px solid #334155",color:"#f8fafc",fontSize:"0.82rem",boxSizing:"border-box"}
                  })
                ]})
              ]}),
              (0,a.jsxs)("div",{className:"cas-sharese-captcha-row",style:{display:"flex",alignItems:"center",gap:"0.75rem",flexWrap:"wrap",padding:"0.65rem",borderRadius:"10px",background:"rgba(15,23,42,0.85)",border:"1px solid rgba(148,163,184,0.2)"},children:[
                challenge?.captcha_svg?(
                  (0,a.jsx)("img",{className:"cas-sharese-captcha-img",src:challenge.captcha_svg,alt:"Captcha",style:{width:"190px",height:"56px",borderRadius:"8px",border:"1px solid #334155",flexShrink:0}})
                ):(
                  (0,a.jsx)("div",{style:{width:"190px",height:"56px",borderRadius:"8px",background:"#0f172a",display:"flex",alignItems:"center",justifyContent:"center",color:"#94a3b8",fontSize:"0.74rem"},children:loadingCh?"Memuat Captcha...":"Captcha"})
                ),
                (0,a.jsxs)("div",{style:{flex:"1 1 160px",minWidth:0,display:"grid",gap:"0.3rem"},children:[
                  (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between"},children:[
                    (0,a.jsx)("label",{style:{fontSize:"0.72rem",fontWeight:700,color:"#cbd5e1"},children:"Kode Captcha (6 Karakter) *"}),
                    (0,a.jsx)("button",{type:"button",onClick:loadChallenge,title:"Muat ulang kode Captcha baru",style:{background:"none",border:"none",color:"#38bdf8",fontSize:"0.72rem",fontWeight:700,cursor:"pointer"},children:"🔄 Ganti"})
                  ]}),
                  (0,a.jsx)("input",{
                    type:"text",
                    required:!0,
                    maxLength:6,
                    value:captchaAns,
                    onChange:e=>setCaptchaAns(e.target.value.toUpperCase()),
                    placeholder:"KETIK KODE",
                    style:{width:"100%",padding:"0.5rem 0.65rem",borderRadius:"8px",background:"#020617",border:"1px solid #38bdf8",color:"#f8fafc",fontSize:"0.92rem",fontWeight:800,letterSpacing:"0.16em",fontFamily:"monospace",textTransform:"uppercase",boxSizing:"border-box"}
                  })
                ]})
              ]}),
              (0,a.jsx)("button",{
                type:"submit",
                disabled:verifying||loadingCh,
                style:{padding:"0.65rem 1.1rem",borderRadius:"10px",border:"none",background:"linear-gradient(135deg, #0284c7, #2563eb)",color:"#fff",fontWeight:800,fontSize:"0.86rem",cursor:"pointer"},
                children:verifying?"⏳ Memverifikasi NRP & Captcha...":"🔓 Verifikasi & Buka Siaran Sharese"
              })
            ]})
          ]})
        ):(
          (0,a.jsxs)("div",{className:"cas-sharese-post-card",style:{position:"relative",display:"grid",gap:"0.95rem"},children:[
            (0,a.jsx)("div",{style:{position:"absolute",top:`${wmPos.top}%`,left:`${wmPos.left}%`,transform:"rotate(-14deg)",pointerEvents:"none",zIndex:30,padding:"0.25rem 0.65rem",borderRadius:"6px",background:"rgba(15,23,42,0.45)",border:"1px solid rgba(248,250,252,0.16)",color:"rgba(248,250,252,0.5)",fontSize:"0.68rem",fontWeight:800,whiteSpace:"nowrap",maxWidth:"90%",overflow:"hidden",textOverflow:"ellipsis",transition:"top 1.8s ease, left 1.8s ease"},children:wmText}),
            (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"0.45rem",padding:"0.55rem 0.8rem",borderRadius:"8px",background:"rgba(16,185,129,0.12)",border:"1px solid rgba(16,185,129,0.35)",fontSize:"0.75rem",color:"#6ee7b7"},children:[
              (0,a.jsxs)("span",{children:['✅ Terverifikasi Anggota ("Siapa Saya?"): ',(0,a.jsx)("strong",{children:verifiedViewer?.nama})," (",verifiedViewer?.nrp_nip," • ",verifiedViewer?.satker,")"]}),
              (0,a.jsx)("span",{style:{fontSize:"0.68rem",color:"#94a3b8"},children:"Dilindungi Watermark Dinamis"})
            ]}),
            verifiedPost.is_official_jukrah&&(0,a.jsxs)("div",{style:{padding:"0.55rem 0.8rem",borderRadius:"8px",background:"rgba(245,158,11,0.15)",border:"1px solid rgba(245,158,11,0.45)",color:"#fbbf24",fontWeight:800,fontSize:"0.78rem"},children:["📢 JUKRAH RESMI KEDINASAN (",verifiedPost.acknowledged_count||0," konfirmasi)"]}),
            (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.65rem"},children:[
              (0,a.jsx)("img",{src:verifiedPost.author_photo||"/images/default-avatar-polki.png",alt:verifiedPost.author_handle,style:{width:"40px",height:"40px",borderRadius:"50%",objectFit:"cover",border:"2px solid #38bdf8",flexShrink:0}}),
              (0,a.jsxs)("div",{style:{minWidth:0},children:[
                (0,a.jsx)("div",{style:{fontWeight:800,fontSize:"0.92rem",color:"#38bdf8"},children:verifiedPost.author_handle||verifiedPost.author_name}),
                (0,a.jsxs)("div",{style:{fontSize:"0.74rem",color:"#94a3b8"},children:[verifiedPost.author_satker," • ",verifiedPost.created_at?new Date(verifiedPost.created_at).toLocaleString("id-ID"):""]})
              ]})
            ]}),
            (0,a.jsx)("div",{style:{fontSize:"0.9rem",lineHeight:1.6,color:"#f1f5f9",whiteSpace:"pre-wrap",wordBreak:"break-word",padding:"0.8rem 0.95rem",borderRadius:"10px",background:"rgba(2,6,23,0.55)",border:"1px solid rgba(148,163,184,0.16)"},children:verifiedPost.content}),
            Array.isArray(verifiedPost.media)&&verifiedPost.media.length>0&&(0,a.jsxs)("div",{style:{display:"grid",gap:"0.7rem"},children:[
              (0,a.jsx)("div",{style:{fontSize:"0.78rem",fontWeight:800,color:"#38bdf8"},children:`📎 Lampiran Media Terproteksi (${verifiedPost.media.length})`}),
              verifiedPost.media.map((m,idx)=>{
                const mUrl=m.stream_url||m.url||"";
                const mime=String(m.mime||"").toLowerCase();
                const isPdf=mime==="application/pdf"||String(m.name||"").toLowerCase().endsWith(".pdf");
                const isVideo=mime.startsWith("video/")||/\.(mp4|webm|mkv)$/i.test(String(m.name||""));
                const isImg=mime.startsWith("image/")||/\.(png|jpe?g|webp|gif)$/i.test(String(m.name||""));
                return(0,a.jsxs)("div",{key:idx,style:{padding:"0.7rem",borderRadius:"10px",background:"rgba(15,23,42,0.85)",border:"1px solid rgba(56,189,248,0.28)",display:"grid",gap:"0.55rem"},children:[
                  isImg&&(0,a.jsx)("img",{src:mUrl,alt:m.name,style:{maxWidth:"100%",maxHeight:"22rem",borderRadius:"8px",margin:"0 auto",display:"block",objectFit:"contain"}}),
                  isVideo&&(0,a.jsx)("video",{src:mUrl,controls:!0,controlsList:"nodownload",style:{width:"100%",maxHeight:"22rem",borderRadius:"8px",background:"#000"}}),
                  isPdf&&(0,a.jsx)("iframe",{src:`${mUrl}#toolbar=0&navpanes=0`,title:m.name||"Dokumen PDF",style:{width:"100%",height:"22rem",borderRadius:"8px",border:"1px solid #334155",background:"#020617"}}),
                  (0,a.jsx)("div",{style:{fontSize:"0.78rem",fontWeight:700,color:"#e2e8f0"},children:m.name||`Lampiran #${idx+1}`})
                ]});
              })
            ]}),
            (0,a.jsxs)("div",{className:"cas-sharese-action-bar",style:{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"0.5rem",paddingTop:"0.5rem",borderTop:"1px solid rgba(148,163,184,0.16)",fontSize:"0.76rem",color:"#94a3b8"},children:[
              (0,a.jsxs)("div",{style:{display:"flex",gap:"0.85rem",flexWrap:"wrap"},children:[
                (0,a.jsxs)("span",{children:["👍 ",verifiedPost.total_reactions||0," Reaksi"]}),
                (0,a.jsxs)("span",{children:["💬 ",verifiedPost.comments_count||comments.length||0," Komentar"]}),
                (0,a.jsxs)("span",{children:["🔁 ",verifiedPost.repost_count||0," Repost"]})
              ]}),
              (0,a.jsx)("a",{href:"/login",style:{padding:"0.42rem 0.85rem",borderRadius:"8px",background:"linear-gradient(135deg, #0284c7, #2563eb)",color:"#fff",fontWeight:800,fontSize:"0.76rem",textDecoration:"none"},children:"💬 Masuk untuk Membalas / Interaksi ➔"})
            ]})
          ]})
        )
      ]
    })
  });
}
if("undefined"!=typeof window){window.CasPublicShareseGateway=CasPublicShareseGateway}

e.s(["default",0,function({children:e}){let s=(0,r.useRouter)(),n=(0,r.usePathname)(),qSearch=useCasLocationSearch(),spMain=new URLSearchParams(qSearch||""),activeView=spMain.get("view")||"",activeMode=spMain.get("mode")||"",[i,o]=(0,t.useState)(!1),[c,u]=(0,t.useState)(null),[d,p]=(0,t.useState)([]),[m,f]=(0,t.useState)(!1),[h,g]=(0,t.useState)(!1),[k,b]=(0,t.useState)(null),y=(0,t.useRef)(null);(0,t.useEffect)(()=>{initCasExpensivePcHpStandards();let e=(0,R.getAuth)(),tok=localStorage.getItem("auth.access_token")||e?.access_token||"",lastAct=Number(localStorage.getItem("bdb.auth.last_activity")||0),isPublicShare="undefined"!=typeof window&&(new URLSearchParams(window.location.search).has("share")||window.location.pathname.startsWith("/sharese-publik"));if(!tok||(lastAct&&Date.now()-lastAct>144e5)){if(isPublicShare){o(!0);return}(0,R.logout)();window.location.replace("/login");return}let a=(0,R.getUser)();u(a),b((0,R.getImpersonatorStash)()),g("1"===localStorage.getItem("cms_sidebar_collapsed"));let isFresh=!1;try{let pl=JSON.parse(atob(tok.split(".")[1].replace(/-/g,"+").replace(/_/g,"/")));isFresh=Number(pl?.exp||0)*1e3>Date.now()+5e3}catch(_e){}if(isFresh)o(!0);M.apiAuth.get("/bdb/menu-access").then(e=>{if(0===e?.data?.status){if(isPublicShare){u(null);o(!0);return}(0,R.logout)();window.location.replace("/login?expired=1");return}p(e.data?.data?.overrides||[]);o(!0)}).catch(()=>{let cur=localStorage.getItem("auth.access_token")||(0,R.getAuth)()?.access_token;if(!cur||!isFresh){if(isPublicShare){u(null);o(!0);return}(0,R.logout)();window.location.replace("/login?expired=1")}}),"superadmin"!==String(a?.role_bdb||"").toLowerCase()&&M.api.get("/Authentication/maintenance-status").then(e=>{let a=e.data?.data;a?.enabled&&s.replace("/maintenance")}).catch(()=>{})},[s]),(0,t.useEffect)(()=>{document.querySelector(".cms-main")?.scrollTo({top:0});const aliasMap={"/cms/master/satker":"/cms/master/satker-tree","/cms/master/tindak-pidana":"/cms/master-ref","/cms/laporan":"/cms/laporan-polisi","/cms/laporan/lp":"/cms/laporan-polisi","/cms/kinerja-perkara":"/cms/report/kinerja-perkara","/cms/anev":"/cms/report/anev-ctcc","/cms/pihak-terlibat":"/cms/laporan/rekap-pihak-terlibat","/cms/register/pihak-terlibat":"/cms/laporan/rekap-pihak-terlibat","/cms/register/residivis":"/cms/laporan/pihak-sering-terlibat","/cms/barang-bukti":"/cms/laporan/rekap-barang-bukti","/cms/register/barang-bukti":"/cms/laporan/rekap-barang-bukti","/cms/susopsgas/rekap":"/cms/laporan/kasus-menonjol/lihat","/cms/operasi-satgas/rekap":"/cms/laporan/kasus-menonjol/lihat","/cms/susopsgas/kelola":"/cms/laporan/kasus-menonjol","/cms/operasi-satgas/master":"/cms/laporan/kasus-menonjol","/cms/kasus-menonjol":"/cms/laporan/kasus-menonjol","/cms/kasus-atensi":"/cms/laporan/kasus-menonjol","/cms/dors":"/cms/integrasi/dors","/cms/integrasi-dors":"/cms/integrasi/dors","/cms/jukrah":"/cms/broadcaster","/cms/panduan/kelola":"/cms/panduan?mode=kelola"};const curPath=("undefined"!=typeof window&&window.location?.pathname)||n;if(aliasMap[curPath]){const baseDest=aliasMap[curPath],qsClean=qSearch?qSearch.replace(/^\?/,""):"",dest=baseDest+(qsClean?(baseDest.includes("?")?"&":"?")+qsClean:"");window.location.replace(dest)}},[n,qSearch,s]),(0,t.useEffect)(()=>{let e=y.current;if(!e)return;let lastH=0,a=()=>{let h=Math.ceil(e.getBoundingClientRect().height||e.offsetHeight||0);if(h>0&&Math.abs(h-lastH)>=2){lastH=h;document.documentElement.style.setProperty("--cms-header-h",`${h}px`)}};a();let t=new ResizeObserver(a);return t.observe(e),window.addEventListener("resize",a),window.addEventListener("orientationchange",a),()=>{t.disconnect(),window.removeEventListener("resize",a),window.removeEventListener("orientationchange",a)}},[n,i]),(0,t.useEffect)(()=>{if("undefined"==typeof document)return;let tipEl=document.getElementById("cms-global-title-tip");if(!tipEl){tipEl=document.createElement("div");tipEl.id="cms-global-title-tip";tipEl.className="cms-global-title-tip";tipEl.style.display="none";document.body.appendChild(tipEl)}let hideTip=()=>{if(tipEl)tipEl.style.display="none"};let showTip=(btn,text)=>{if(!tipEl||!btn||!text)return;tipEl.textContent=text;tipEl.style.display="block";let r=btn.getBoundingClientRect(),vw=window.innerWidth||360,vh=window.innerHeight||640,w=Math.min(288,vw-20);tipEl.style.width=w+"px";let left=Math.max(10,Math.min(r.left+r.width/2-w/2,vw-w-10)),top=r.bottom+8;if(top+110>vh)top=Math.max(10,r.top-90);tipEl.style.left=left+"px";tipEl.style.top=top+"px"};let enhanceDom=()=>{document.querySelectorAll(".cms-page-sub").forEach(sub=>{let txt=(sub.textContent||"").trim();if(!txt)return;let parent=sub.parentElement,title=parent?.querySelector(".cms-page-title")||sub.previousElementSibling;if(title&&title.classList?.contains("cms-page-title")){sub.classList.add("cms-page-sub-hidden");let existing=title.querySelector(".cms-title-info-btn")||parent?.querySelector(".cms-title-info-btn");if(!existing){let btn=document.createElement("button");btn.type="button";btn.className="cms-title-info-btn";btn.setAttribute("aria-label","Informasi Halaman");btn.dataset.tip=txt;btn.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" class="cas-info-svg"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>';btn.addEventListener("click",ev=>{ev.stopPropagation();ev.preventDefault();if("block"===tipEl.style.display&&tipEl.textContent===btn.dataset.tip)hideTip();else showTip(btn,btn.dataset.tip)});btn.addEventListener("mouseenter",()=>{if(window.innerWidth>768)showTip(btn,btn.dataset.tip)});btn.addEventListener("mouseleave",()=>{if(window.innerWidth>768)hideTip()});title.appendChild(btn)}else if(existing.dataset.tip!==txt){existing.dataset.tip=txt}}});document.querySelectorAll(".lp-stat span, .dash-minicard span").forEach(sp=>{if(0===sp.childElementCount&&String.fromCharCode(9432)===(sp.textContent||"").trim()){sp.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="cas-info-svg"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>'}});document.querySelectorAll(".p-datatable table").forEach(tbl=>{let ths=tbl.querySelectorAll("thead > tr:first-child > th");if(ths.length<4)return;let h1=(ths[0]?.textContent||"").trim().toUpperCase();if("NO"===h1||"NO."===h1||"#"===h1){ths[0].classList.add("cas-sticky-col-1");ths[1]?.classList.add("cas-sticky-col-2");tbl.querySelectorAll("tbody > tr").forEach(tr=>{let tds=tr.children;if(tds.length>=2&&!tds[0].hasAttribute("colspan")){tds[0].classList.add("cas-sticky-col-1");tds[1].classList.add("cas-sticky-col-2")}})}})};enhanceDom();let enhanceRaf=0,obs=new MutationObserver(()=>{if(!enhanceRaf)enhanceRaf=requestAnimationFrame(()=>{enhanceRaf=0;enhanceDom()})}),mainEl=document.querySelector(".cms-content")||document.body;obs.observe(mainEl,{childList:!0,subtree:!0});window.addEventListener("scroll",hideTip,!0);document.addEventListener("click",hideTip);return()=>{if(enhanceRaf)cancelAnimationFrame(enhanceRaf);obs.disconnect();window.removeEventListener("scroll",hideTip,!0);document.removeEventListener("click",hideTip)}},[n,qSearch,i]);let j=(0,t.useMemo)(()=>(function(e,a){let{isSuperadmin:t}=(0,R.deriveRoles)(e),r=function(e){let{isSuperadmin:a}=(0,R.deriveRoles)(e);return a?"superadmin":String(e?.role_bdb||e?.requested_role_bdb||"").toLowerCase()||"viewer"}(e),s=new Map;(a||[]).forEach(e=>s.set(`${String(e.role).toLowerCase()}|${e.menu_key}`,e.allowed));let n=[];for(let e of D.MENU_CATALOG){let a=e.items.filter(e=>(0,D.isMenuAllowed)(e,r,s,t)).map(e=>{let a=e.children?.filter(e=>(0,D.isMenuAllowed)(e,r,s,t)).map(e=>({label:e.label,icon:e.icon,to:e.to}));return{label:e.label,icon:e.icon,to:e.to,children:a?.length?a:void 0}});a.length&&n.push({label:e.label,items:a})}return n})(c,d),[c,d]),v=(0,t.useMemo)(()=>(0,R.deriveRoles)(c).label,[c]),isPublicShare="undefined"!=typeof window&&(new URLSearchParams(window.location.search).has("share")||window.location.pathname.startsWith("/sharese-publik")),isSysSettingsPage=["/cms/pengaturan/email","/cms/pengaturan/login-otp","/cms/pengaturan/maintenance","/cms/pengaturan/pusat-bantuan","/cms/master/alur-dokumen","/cms/master/organisasi-role","/cms/master/menu"].some(p=>n===p||n.startsWith(p+"/")),customViewContent=(()=>{if(n==="/cms/broadcaster"){if(activeView==="obrolan")return(0,a.jsx)(CasObrolanFullPage,{user:c,searchStr:qSearch});if(activeView==="koneksi")return(0,a.jsx)(CasKoneksiFullPage,{user:c,searchStr:qSearch});if(activeView==="notifikasi")return(0,a.jsx)(CasNotifikasiFullPage,{user:c,searchStr:qSearch});if(activeView==="insight")return(0,a.jsx)(CasInsightFullPage,{user:c,searchStr:qSearch});if(activeView==="pusat-bantuan")return(0,a.jsx)(CasPusatBantuanFullPage,{user:c,searchStr:qSearch})}if(n==="/cms/profile"&&activeView==="keamanan")return(0,a.jsx)(CasKeamananPengaturanFullPage,{user:c,searchStr:qSearch});return null})();if(i&&isPublicShare&&!c){const hasNativeGate=n.startsWith("/cms/panduan")||n.startsWith("/cms/broadcaster");return(0,a.jsx)("div",{className:"cms-public-share-root",style:{minHeight:"100vh",background:"#0f172a",color:"#f8fafc"},children:hasNativeGate?e:(0,a.jsx)(CasPublicShareseGateway,{shareHash:spMain.get("share")||""})})}return i?(0,a.jsxs)("div",{className:`cms-shell${h?" cms-collapsed":""}`,children:[(0,a.jsx)(l,{id:"fld-0-gigr76s0g8t-17",name:"field_0_gigr76s0g8t_17",sections:j,open:m,onNavigate:()=>f(!1)}),m&&(0,a.jsx)("div",{className:"cms-overlay",onClick:()=>f(!1)}),(0,a.jsxs)("div",{className:"cms-main",children:[(0,a.jsx)("style",{dangerouslySetInnerHTML:{__html:"@media(max-width:900px){.cms-header-fixed{left:0!important;right:0!important;width:100%!important}.cms-main{width:100%!important;min-width:0!important;-webkit-overflow-scrolling:touch!important;overflow-y:auto!important}.cms-sticky-top{position:static!important;top:auto!important;z-index:auto!important}}@media(max-width:640px){.cms-topbar{padding:0 0.75rem!important;gap:0.4rem!important;height:3.5rem!important}.cms-user-meta{display:none!important}.cms-user-avatar{width:2rem!important;height:2rem!important;font-size:0.8rem!important}.cms-breadcrumb{padding:0.4rem 0.75rem!important;gap:0.35rem!important;font-size:0.76rem!important;overflow-x:auto!important;width:100%!important;box-sizing:border-box!important;-webkit-overflow-scrolling:touch!important;scrollbar-width:none!important}.cms-breadcrumb::-webkit-scrollbar{display:none}.cms-bc-back{padding:0.25rem 0.5rem!important;font-size:0.75rem!important;flex-shrink:0!important;white-space:nowrap!important}.cms-breadcrumb ol{flex-wrap:nowrap!important;white-space:nowrap!important}.cms-content{padding-left:0.75rem!important;padding-right:0.75rem!important;padding-bottom:5rem!important;width:100%!important;box-sizing:border-box!important}}@media(max-width:768px){.p-datatable{max-width:100%!important}.p-datatable .p-datatable-wrapper{overflow-x:auto!important;-webkit-overflow-scrolling:touch!important}.p-datatable-header{padding:0.75rem!important;flex-direction:column!important;align-items:stretch!important;gap:0.5rem!important}}"}}),(0,a.jsxs)("div",{ref:y,className:"cms-header-fixed",children:[k&&(0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",gap:"0.6rem",flexWrap:"wrap",background:"#7c3aed",color:"#fff",padding:"0.5rem 1rem",fontSize:"0.85rem",fontWeight:600},children:[(0,a.jsx)(B.UserCog,{size:16}),(0,a.jsxs)("span",{children:["Anda sedang masuk sebagai ",(0,a.jsx)("strong",{children:c?.name||c?.email})," (",(0,R.deriveRoles)(c).label,") — sesi superadmin ",(0,a.jsx)("strong",{children:k.user?.name})," tersimpan."]}),(0,a.jsx)("button",{type:"button",onClick:function(){(0,R.stopImpersonation)()&&(window.location.href="/cms/master/user")},style:{background:"#fff",color:"#7c3aed",border:"none",borderRadius:6,padding:"0.25rem 0.75rem",fontWeight:700,fontSize:"0.8rem",cursor:"pointer"},children:"Kembali ke Akun Saya"})]}),(0,a.jsx)(L,{id:"fld-0-gigr76s0g8t-18",name:"field_0_gigr76s0g8t_18",user:c,roleLabel:v,onToggleSidebar:()=>f(e=>!e),onToggleCollapse:function(){g(e=>{let a=!e;try{localStorage.setItem("cms_sidebar_collapsed",a?"1":"0")}catch{}return a})}}),(0,a.jsx)($,{id:"fld-0-gigr76s0g8t-19",name:"field_0_gigr76s0g8t_19",})]}),(0,a.jsxs)("main",{className:"cms-content",children:[!customViewContent&&isSysSettingsPage&&(0,a.jsx)(CasKelolaPengaturanTabs,{user:c,pathname:n}),customViewContent||(n==="/cms/panduan"?(0,a.jsx)("div",{style:{display:"contents"},children:e},"panduan_"+activeMode):e)]}),(0,a.jsx)(TacticalMessengerWidget,{})]})]}):null}],93989)}]);