(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,71326,97778,e=>{"use strict";var a=e.i(71645),t=e.i(48264),n=e.i(1743),r=e.i(43456),i=e.i(71144),l=e.i(29168),s=e.i(28797),o=e.i(27259),d=e.i(73193);function c(){return(c=Object.assign.bind()).apply(null,arguments)}function u(e,a){(null==a||a>e.length)&&(a=e.length);for(var t=0,n=Array(a);t<a;t++)n[t]=e[t];return n}function m(e,a){return function(e){if(Array.isArray(e))return e}(e)||function(e,a){var t=null==e?null:"u">typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=t){var n,r,i,l,s=[],o=!0,d=!1;try{if(i=(t=t.call(e)).next,0===a){if(Object(t)!==t)return;o=!1}else for(;!(o=(n=i.call(t)).done)&&(s.push(n.value),s.length!==a);o=!0);}catch(e){d=!0,r=e}finally{try{if(!o&&null!=t.return&&(l=t.return(),Object(l)!==l))return}finally{if(d)throw r}}return s}}(e,a)||function(e,a){if(e){if("string"==typeof e)return u(e,a);var t=({}).toString.call(e).slice(8,-1);return"Object"===t&&e.constructor&&(t=e.constructor.name),"Map"===t||"Set"===t?Array.from(e):"Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?u(e,a):void 0}}(e,a)||function(){throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function p(e){return(p="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}var g=r.ComponentBase.extend({defaultProps:{__TYPE:"ConfirmDialog",accept:null,acceptClassName:null,acceptIcon:null,acceptLabel:null,appendTo:null,breakpoints:null,children:void 0,className:null,content:null,defaultFocus:"accept",footer:null,icon:null,message:null,onHide:null,reject:null,rejectClassName:null,rejectIcon:null,rejectLabel:null,tagKey:void 0,visible:void 0},css:{classes:{root:"p-confirm-dialog",message:"p-confirm-dialog-message",icon:"p-confirm-dialog-icon",acceptButton:"p-confirm-dialog-accept",rejectButton:function(e){var a=e.getPropValue;return(0,d.classNames)("p-confirm-dialog-reject",{"p-button-text":!a("rejectClassName")})}}}});function h(e,a){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);a&&(n=n.filter(function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable})),t.push.apply(t,n)}return t}function y(e){for(var a=1;a<arguments.length;a++){var t=null!=arguments[a]?arguments[a]:{};a%2?h(Object(t),!0).forEach(function(a){!function(e,a,t){var n;(n=function(e,a){if("object"!=p(e)||!e)return e;var t=e[Symbol.toPrimitive];if(void 0!==t){var n=t.call(e,a||"default");if("object"!=p(n))return n;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===a?String:Number)(e)}(a,"string"),(a="symbol"==p(n)?n:n+"")in e)?Object.defineProperty(e,a,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[a]=t}(e,a,t[a])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):h(Object(t)).forEach(function(a){Object.defineProperty(e,a,Object.getOwnPropertyDescriptor(t,a))})}return e}var f=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return(e=y(y({},e),{visible:void 0===e.visible||e.visible})).visible&&s.OverlayService.emit("confirm-dialog",e),{show:function(){var a=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};s.OverlayService.emit("confirm-dialog",y(y(y({},e),a),{visible:!0}))},hide:function(){s.OverlayService.emit("confirm-dialog",{visible:!1})}}},j=a.memo(a.forwardRef(function(e,u){var p,h,f,j,b,k,x,C=(0,l.useMergeProps)(),v=a.useContext(t.PrimeReactContext),S=g.getProps(e,v),T=m(a.useState(S.visible),2),w=T[0],P=T[1],R=m(a.useState(!1),2),_=R[0],L=R[1],I=a.useRef(null),W=a.useRef(!1),z=a.useRef(null),D=function(){var e=S.group;return I.current&&(e=I.current.group),Object.assign({},S,I.current,{group:e})},N=function(e){return D()[e]},A=function(e){for(var a=arguments.length,t=Array(a>1?a-1:0),n=1;n<a;n++)t[n-1]=arguments[n];return d.ObjectUtils.getPropValue(N(e),t)},M=N("acceptLabel")||(0,t.localeOption)("accept"),B=N("rejectLabel")||(0,t.localeOption)("reject"),O={props:S,state:{visible:w}},K=g.setMetaData(O),E=K.ptm,F=K.cx,$=K.isUnstyled;(0,r.useHandleStyle)(g.css.styles,$,{name:"confirmdialog"});var U=function(){W.current||(W.current=!0,A("accept"),J("accept"))},H=function(){W.current||(W.current=!0,A("reject"),J("reject"))},G=function(){D().group===S.group&&(P(!0),W.current=!1,z.current=document.activeElement)},J=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"cancel";w&&("string"!=typeof e&&(e="cancel"),P(!1),A("onHide",e),d.DomHandler.focus(z.current),z.current=null)},V=function(e){if(e.tagKey===S.tagKey&&(void 0===e.group||e.group===S.group)){var a=w!==e.visible;N("target")===e.target||S.target?a&&(I.current=e,e.visible?G():J()):(J(),I.current=e,L(!0))}};a.useEffect(function(){S.visible?G():J()},[S.visible]),a.useEffect(function(){return S.target||S.message||s.OverlayService.on("confirm-dialog",V),function(){s.OverlayService.off("confirm-dialog",V)}},[S.target]),(0,l.useUpdateEffect)(function(){_&&G()},[_]),(0,l.useUnmountEffect)(function(){s.OverlayService.off("confirm-dialog",V)}),a.useImperativeHandle(u,function(){return{props:S,confirm:V}});var Y=(p=D(),h=d.ObjectUtils.getJSXElement(N("message"),p),f=C({className:F("icon")},E("icon")),j=d.IconUtils.getJSXIcon(N("icon"),y({},f),{props:p}),b=function(){var e=N("defaultFocus"),t=(0,d.classNames)("p-confirm-dialog-accept",N("acceptClassName")),r=(0,d.classNames)("p-confirm-dialog-reject",{"p-button-text":!N("rejectClassName")},N("rejectClassName")),i=C({label:B,autoFocus:"reject"===e,icon:N("rejectIcon"),className:(0,d.classNames)(N("rejectClassName"),F("rejectButton",{getPropValue:N})),onClick:H,pt:E("rejectButton"),unstyled:S.unstyled,__parentMetadata:{parent:O}},E("rejectButton")),l=C({label:M,autoFocus:void 0===e||"accept"===e,icon:N("acceptIcon"),className:(0,d.classNames)(N("acceptClassName"),F("acceptButton")),onClick:U,pt:E("acceptButton"),unstyled:S.unstyled,__parentMetadata:{parent:O}},E("acceptButton")),s=a.createElement(a.Fragment,null,a.createElement(n.Button,i),a.createElement(n.Button,l));if(N("footer")){var o={accept:U,reject:H,acceptClassName:t,rejectClassName:r,acceptLabel:M,rejectLabel:B,element:s,props:D()};return d.ObjectUtils.getJSXElement(N("footer"),o)}return s}(),k=C({className:F("message")},E("message")),x=C({visible:w,className:(0,d.classNames)(N("className"),F("root")),footer:b,onHide:J,breakpoints:N("breakpoints"),pt:p.pt,unstyled:S.unstyled,appendTo:N("appendTo"),__parentMetadata:{parent:O}},g.getOtherProps(p)),a.createElement(i.Dialog,c({},x,{content:null==e?void 0:e.content}),j,a.createElement("span",k,h)));return a.createElement(o.Portal,{element:Y,appendTo:N("appendTo")})}));j.displayName="ConfirmDialog",e.s(["ConfirmDialog",0,j,"confirmDialog",0,f],97778),e.s(["confirmAction",0,function(e,a){return new Promise(t=>{let n=!1,r=e=>{n||(n=!0,t(e))};f({message:e,header:a?.header||"Konfirmasi",icon:a?.danger?"pi pi-exclamation-triangle":"pi pi-question-circle",acceptLabel:a?.acceptLabel||"Ya, lanjutkan",rejectLabel:"Batal",acceptClassName:a?.danger?"p-button-danger":void 0,accept:()=>r(!0),reject:()=>r(!1),onHide:()=>r(!1)})})}],71326)},26091,e=>{"use strict";let a=(0,e.i(56420).default)("file-text",[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]);e.s(["FileText",0,a],26091)},53138,e=>{"use strict";let a=(0,e.i(56420).default)("triangle-alert",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);e.s(["AlertTriangle",0,a],53138)},93819,e=>{"use strict";let a=(0,e.i(56420).default)("file-spreadsheet",[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M8 13h2",key:"yr2amv"}],["path",{d:"M14 13h2",key:"un5t4a"}],["path",{d:"M8 17h2",key:"2yhykz"}],["path",{d:"M14 17h2",key:"10kma7"}]]);e.s(["FileSpreadsheet",0,a],93819)},71407,e=>{"use strict";var a=e.i(71645),t=e.i(44506);function n(){return(n=Object.assign.bind()).apply(null,arguments)}var r=a.memo(a.forwardRef(function(e,r){var i=t.IconBase.getPTI(e);return a.createElement("svg",n({ref:r,width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",xmlns:"http://www.w3.org/2000/svg"},i),a.createElement("path",{d:"M13.2222 7.77778H0.777778C0.571498 7.77778 0.373667 7.69584 0.227806 7.54998C0.0819442 7.40412 0 7.20629 0 7.00001C0 6.79373 0.0819442 6.5959 0.227806 6.45003C0.373667 6.30417 0.571498 6.22223 0.777778 6.22223H13.2222C13.4285 6.22223 13.6263 6.30417 13.7722 6.45003C13.9181 6.5959 14 6.79373 14 7.00001C14 7.20629 13.9181 7.40412 13.7722 7.54998C13.6263 7.69584 13.4285 7.77778 13.2222 7.77778Z",fill:"currentColor"}))}));r.displayName="MinusIcon",e.s(["MinusIcon",0,r])},64873,e=>{"use strict";function eMatchG(k,g){return g==="REVIEW"?!k:(g===k||(g==="KRIMUM"&&(k==="TIPIDUM"||k==="TIPIDPPAPPO"||k==="KRIMUM"))||(g==="KRIMSUS"&&(k==="TIPIDEKSUS"||k==="TIPIDKOR"||k==="TIPIDTER"||k==="TIPIDSIBER"||k==="KRIMSUS"))||(g==="NARKOBA"&&(k==="TIPIDNARKOBA"||k==="NARKOBA")));}var a=e.i(43476),t=e.i(71645),n=e.i(55050),r=e.i(24718),i=function(){};i.displayName="ColumnGroup";var l=e.i(48264),s=e.i(29168),o=e.i(43456),d=e.i(73193),c=o.ComponentBase.extend({defaultProps:{__TYPE:"Row",style:null,className:null,children:void 0},getCProp:function(e,a){return d.ObjectUtils.getComponentProp(e,a,c.defaultProps)}}),u=function(e){var a=(0,s.useMergeProps)(),n=t.useContext(l.PrimeReactContext),r=c.getProps(e,n),i=c.setMetaData({props:r}).ptm,o=a({className:r.className,style:r.style},c.getOtherProps(r),i("root"));return t.createElement("tr",o,r.children)};u.displayName="Row";var m=e.i(44080),p=e.i(1743),g=e.i(53729),h=e.i(71144),y=e.i(85118),f=e.i(97778),j=e.i(68242),b=e.i(48314),k=e.i(71028),x=e.i(56420);let C=(0,x.default)("info",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]]);var v=e.i(41120),S=e.i(53138),T=e.i(93819),w=e.i(26091);let P=(0,x.default)("list-filter",[["path",{d:"M2 5h20",key:"1fs1ex"}],["path",{d:"M6 12h12",key:"8npq4p"}],["path",{d:"M9 19h6",key:"456am0"}]]);var R=e.i(54858),_=e.i(71326),kAuth=e.i(38036);let L={ct:0,ct_model_a:0,ct_model_b:0,cp_berjalan:0,cp_tunggakan:0,cc_aktual:0,cc_tunggakan:0,belum_kesulitan:0,cp_berjalan_rincian:{},cp_tunggakan_rincian:{},cc_aktual_rincian:{},cc_tunggakan_rincian:{}},I=[{key:"lidik",label:"LIDIK"},{key:"sidik",label:"SIDIK"},{key:"spdp",label:"KIRIM SPDP"},{key:"thp1",label:"THP-1"},{key:"p19",label:"P-19"},{key:"p21",label:"P-21"}],W=[{key:"sp2lid",label:"SP2LID"},{key:"perma",label:"PERMA"},{key:"sp3",label:"SP3"},{key:"thp2",label:"THP-2"}],z={background:"#16324f",color:"#f8fafc",fontWeight:800,fontSize:"0.72rem",textAlign:"center",whiteSpace:"nowrap"},D={background:"#eaf2fb",color:"#16324f",fontWeight:700,fontSize:"0.68rem",textAlign:"center",whiteSpace:"nowrap"},N={background:"#dbeafe",color:"#1e40af",fontWeight:700,fontSize:"0.68rem",textAlign:"center",whiteSpace:"nowrap"},A={minWidth:"3.6rem",background:"#eff6ff"};function M(e){return(0,a.jsx)("span",{style:{color:e?"#92400e":"#e2e8f0",fontWeight:e?700:400},children:e||"·"})}let B=[{label:"Keduanya (CT saat mulai, CC saat selesai)",value:"both"},{label:"Tanggal Mulai Penanganan (LP)",value:"mulai"},{label:"Tanggal Selesai (CC)",value:"selesai"}],O={both:"Sesuai ketentuan resmi: CT dihitung dari tanggal mulai penanganan, CC dari tanggal selesai — dua tanggal berbeda bisa dipakai bersamaan dalam satu periode.",mulai:"Kohort berdasar tanggal mulai penanganan: hanya LP yang MULAI ditangani pada periode ini yang dihitung, lalu dipilah apakah sudah CC (Aktual/Tunggakan) atau masih CP (Berjalan/Tunggakan).",selesai:"Kohort berdasar tanggal selesai (CC): hanya LP yang SELESAI (CC) pada periode ini yang dihitung — CT di sini = total LP yang selesai pada periode, dipilah CC Aktual/Tunggakan. CP selalu 0 pada mode ini."};function K(e){let a=e?.data??e,t=a?.data??a;return Array.isArray(t)?t:[]}function E(e){return{key:e.kode,data:e,leaf:!e.has_children}}function F(e,a,t){return e.map(e=>e.key===a?{...e,children:t}:e.children&&e.children.length?{...e,children:F(e.children,a,t)}:e)}function $(e){return e<=1?"danger":2===e?"warning":3===e?"info":"success"}function U(e){return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}`}e.s(["default",0,function(){let e,kRole=(0,kAuth.deriveRoles)((0,kAuth.getUser)()),kCanRefresh=kRole.isSuperadmin||kRole.isAdminBinops,l=(0,t.useRef)(null),[s,o]=(0,t.useState)([]),[d,c]=(0,t.useState)(L),[x,H]=(0,t.useState)(null),[G,J]=(0,t.useState)(!0),[V,Y]=(0,t.useState)(!1),[X,q]=(0,t.useState)({}),[Z,Q]=(0,t.useState)(!1),[ee,ea]=(0,t.useState)(!1),[et,en]=(0,t.useState)(!1),[er,ei]=(0,t.useState)(!1),[el,es]=(0,t.useState)(()=>{let e=new Date;return U(new Date(e.getFullYear(),0,1))}),[eo,ed]=(0,t.useState)(()=>{let e=new Date;return U(new Date(e.getFullYear(),11,31))}),[ec,eu]=(0,t.useState)("both"),[em,ep]=(0,t.useState)([]),[eg,eh]=(0,t.useState)([]),[ey,ef]=(0,t.useState)([]),[ej,eb]=(0,t.useState)([]),[ek,ex]=(0,t.useState)([]),[eC,ev]=(0,t.useState)([]),[eKG,eSetKG]=(0,t.useState)([]),[eScope,eSetScope]=(0,t.useState)("scoped"),[eScopeOpts,eSetScopeOpts]=(0,t.useState)([]),[eScopeSatkerId,eSetScopeSatkerId]=(0,t.useState)(null),[eFD,eSetFD]=(0,t.useState)("INTERNAL_RESERSE"),[eModel,eSetModel]=(0,t.useState)(""),[eClosure,eSetClosure]=(0,t.useState)(""),[eBucket,eSetBucket]=(0,t.useState)("age"),[satkerPopOpen,setSatkerPopOpen]=(0,t.useState)(!1),[crimePopOpen,setCrimePopOpen]=(0,t.useState)(!1),[paramPopOpen,setParamPopOpen]=(0,t.useState)(!1),[activeKelompokCrime,setActiveKelompokCrime]=(0,t.useState)("ALL"),[activeTipidCrime,setActiveTipidCrime]=(0,t.useState)("ALL"),[kpPeriodOpen,setKpPeriodOpen]=(0,t.useState)(!1),
[kpPeriodMode,setKpPeriodMode]=(0,t.useState)("year"),
[kpPeriodMonth,setKpPeriodMonth]=(0,t.useState)(()=>{
  let d=new Date(),
      p=new Date(d.getFullYear(),d.getMonth()-1,1);

  return String(
    p.getMonth()+1
  ).padStart(2,"0")
}),
[kpPeriodYear,setKpPeriodYear]=(0,t.useState)(()=>{
  let d=new Date(),
      p=new Date(d.getFullYear(),d.getMonth()-1,1);

  return String(
    p.getFullYear()
  )
}),
[kpCustomFrom,setKpCustomFrom]=(0,t.useState)(el),
[kpCustomTo,setKpCustomTo]=(0,t.useState)(eo),
[kpPeriodLabel,setKpPeriodLabel]=(0,t.useState)(()=>"Tahun "+new Date().getFullYear()),[eAP,eSetAP]=(0,t.useState)(()=>({from:el,to:eo,mode:ec,jenis:[],golongan:[],iccs:[],kelompok:[],scope:"scoped",scopeSatkerId:null,functionDomain:"INTERNAL_RESERSE",modelLp:"",closureReason:"",bucketMode:"age"})),eS=(0,t.useMemo)(()=>({visibility:eAP.scope,scope_satker_id:"scoped"===eAP.scope&&eAP.scopeSatkerId?eAP.scopeSatkerId:void 0,from:eAP.from,to:eAP.to,mode:eAP.mode,jenis_kejahatan_id:eAP.jenis.length?eAP.jenis.join(","):void 0,golongan_id:eAP.golongan.length?eAP.golongan.join(","):void 0,iccs_kategori_id:eAP.iccs.length?eAP.iccs.join(","):void 0,kelompok_hitung:eAP.kelompok.length?eAP.kelompok.join(","):void 0,functionDomain:eAP.functionDomain,organizationDomain:"INTERNAL_POLRI",modelLp:eAP.modelLp||void 0,closureReason:eAP.closureReason||void 0,bucketMode:eAP.bucketMode}),[eAP]),eJenisOptions=(0,t.useMemo)(()=>eg.filter(e=>(!ey.length||ey.some(a=>e.golonganIds.includes(a)))&&(!ek.length||ek.includes(e.iccsId))&&(!eKG.length||eKG.some(g=>eMatchG(e.kelompok,g)))),[eg,ey,ek,eKG]),eGolOptions=(0,t.useMemo)(()=>ej.filter(e=>eg.some(a=>(!em.length||em.includes(a.value))&&(!ek.length||ek.includes(a.iccsId))&&(!eKG.length||eKG.some(g=>eMatchG(a.kelompok,g)))&&a.golonganIds.includes(e.value))),[ej,eg,em,ek,eKG]),eIccsOptions=(0,t.useMemo)(()=>eC.filter(e=>eg.some(a=>(!em.length||em.includes(a.value))&&(!ey.length||ey.some(e=>a.golonganIds.includes(e)))&&(!eKG.length||eKG.some(g=>eMatchG(a.kelompok,g)))&&a.iccsId===e.value)),[eC,eg,em,ey,eKG]),eGroupOptions=(0,t.useMemo)(()=>[{label:"KRIMUM (Tipidum, Tipidppappo)",value:"KRIMUM"},{label:"KRIMSUS (Tipideksus, Tipidkor, Tipidter, Tipidsiber)",value:"KRIMSUS"},{label:"NARKOBA (Tipidnarkoba)",value:"NARKOBA"},{label:"TIPIDUM",value:"TIPIDUM"},{label:"TIPIDPPAPPO",value:"TIPIDPPAPPO"},{label:"TIPIDEKSUS",value:"TIPIDEKSUS"},{label:"TIPIDKOR",value:"TIPIDKOR"},{label:"TIPIDTER",value:"TIPIDTER"},{label:"TIPIDSIBER",value:"TIPIDSIBER"},{label:"TIPIDNARKOBA",value:"TIPIDNARKOBA"},{label:"Review Manual",value:"REVIEW"}].filter(e=>eg.some(a=>(!em.length||em.includes(a.value))&&(!ey.length||ey.some(e=>a.golonganIds.includes(e)))&&(!ek.length||ek.includes(a.iccsId))&&eMatchG(a.kelompok,e.value))),[eg,em,ey,ek]);(0,t.useEffect)(()=>{R.apiAuth.get("/bdb/kinerja-perkara/meta/jenis-kejahatan").then(e=>{eh((e.data?.data||[]).map(e=>{let a=String(e.keterangan||""),t=a.trim().split(/\s+/);return{label:t.slice(0,5).join(" ")+(t.length>5?"…":""),fullLabel:a,value:Number(e.id),golonganId:Number(e.golongan_id),golonganIds:e.is_ppappo?[Number(e.golongan_id),5]:[Number(e.golongan_id)],iccsId:Number(e.iccs_kategori_id),kelompok:e.kelompok?String(e.kelompok):null}}))}).catch(()=>{}),R.apiAuth.get("/master/golongan-kejahatan",{params:{row:20,page:1}}).then(e=>{let a=K(e.data);a.sort((e,a)=>e.id-a.id),eb(a.map(e=>({label:e.name,value:Number(e.id)})))}).catch(()=>{}),R.apiAuth.get("/master/iccs-kategori",{params:{row:50,page:1}}).then(e=>{let a=K(e.data);a.sort((e,a)=>e.kode-a.kode),ev(a.map(e=>({label:`${e.kode}. ${e.nama}`,value:Number(e.id)})))}).catch(()=>{}),R.apiAuth.get("/bdb/kinerja-perkara/meta/scope-options").then(e=>{let a=e.data?.data||{},n=Array.isArray(a.options)?a.options:[],defVis=a.defaultVisibility||"scoped",r=a.defaultRegionId!=null?Number(a.defaultRegionId):(n.length?Number(n[0].value):null);eSetScopeOpts(n),eSetScopeSatkerId(r),eSetScope(defVis),eSetAP(prev=>({...prev,scope:defVis,scopeSatkerId:"scoped"===defVis?r:null}))}).catch(()=>{})},[]);
function kpMonthNames(){
  return[
    "Januari","Februari","Maret","April",
    "Mei","Juni","Juli","Agustus",
    "September","Oktober","November","Desember"
  ]
}

function kpMonthOptions(){
  return kpMonthNames().map(
    (x,i)=>({
      label:x,
      value:String(i+1).padStart(2,"0")
    })
  )
}

function kpYearOptions(){
  let y=new Date().getFullYear(),
      out=[];

  for(let x=y;x>=2000;x--){
    out.push({
      label:String(x),
      value:String(x)
    })
  }

  return out
}

function kpDaysInMonth(year,month){
  return new Date(
    Number(year),
    Number(month),
    0
  ).getDate()
}

function kpMonthRange(year,month){
  let y=String(year),
      m=String(month).padStart(2,"0"),
      last=String(
        kpDaysInMonth(y,m)
      ).padStart(2,"0");

  return{
    from:y+"-"+m+"-01",
    to:y+"-"+m+"-"+last,
    label:
      kpMonthNames()[Number(m)-1]+
      " "+
      y
  }
}

function kpYearRange(year){
  let y=String(year);

  return{
    from:y+"-01-01",
    to:y+"-12-31",
    label:"Tahun "+y
  }
}

function kpDescribePeriod(from,to){
  let now=new Date(),
      cy=String(now.getFullYear()),
      cm=String(
        now.getMonth()+1
      ).padStart(2,"0");

  let fy=String(from||"").slice(0,4),
      fm=String(from||"").slice(5,7),
      ty=String(to||"").slice(0,4),
      tm=String(to||"").slice(5,7);

  if(
    fy &&
    fy===ty &&
    from===fy+"-01-01" &&
    to===fy+"-12-31"
  ){
    return{
      mode:"year",
      month:fm||cm,
      year:fy,
      customFrom:from,
      customTo:to,
      label:"Tahun "+fy
    }
  }

  if(
    fy &&
    fy===ty &&
    fm &&
    fm===tm &&
    from===fy+"-"+fm+"-01" &&
    to===
      fy+"-"+fm+"-"+
      String(
        kpDaysInMonth(fy,fm)
      ).padStart(2,"0")
  ){
    return{
      mode:"month",
      month:fm,
      year:fy,
      customFrom:from,
      customTo:to,
      label:
        kpMonthNames()[Number(fm)-1]+
        " "+
        fy
    }
  }

  return{
    mode:"custom",
    month:fm||cm,
    year:fy||cy,
    customFrom:from||"",
    customTo:to||"",
    label:
      (from||"…")+
      " s.d. "+
      (to||"…")
  }
}

function kpOpenPeriod(){
  let p=kpDescribePeriod(el,eo);

  setKpPeriodMode(p.mode);
  setKpPeriodMonth(p.month);
  setKpPeriodYear(p.year);
  setKpCustomFrom(p.customFrom);
  setKpCustomTo(p.customTo);
  setKpPeriodLabel(p.label);

  setKpPeriodOpen(!0)
}

function kpApplyPeriod(){
  let from="",
      to="",
      label="";

  if("month"===kpPeriodMode){
    let p=kpMonthRange(
      kpPeriodYear,
      kpPeriodMonth
    );

    from=p.from;
    to=p.to;
    label=p.label;
  }
  else if("year"===kpPeriodMode){
    let p=kpYearRange(
      kpPeriodYear
    );

    from=p.from;
    to=p.to;
    label=p.label;
  }
  else{
    from=kpCustomFrom;
    to=kpCustomTo;

    if(!from||!to){
      return void l.current?.show({
        severity:"warn",
        summary:"Periode belum lengkap",
        detail:
          "Tanggal awal dan akhir wajib dipilih."
      })
    }

    if(from>to){
      return void l.current?.show({
        severity:"warn",
        summary:"Periode tidak valid",
        detail:
          "Tanggal awal tidak boleh melewati tanggal akhir."
      })
    }

    label=
      from+
      " s.d. "+
      to;
  }

  /* DRAFT ONLY — BELUM FETCH */
  es(from);
  ed(to);
  setKpPeriodLabel(label);
  setKpPeriodOpen(!1)
}


const KP_CACHE_TTL_MS=24e4;
const KP_CACHE_PREFIX="bdb-kinerja-v3:";

function kpCacheKey(){
  try{
    let user=(0,kAuth.getUser)();

    /*
      Safety:
      kalau identity tidak jelas,
      jangan pernah pakai cache.
    */
    if(!user?.email)
      return null;

    let role=String(
      (0,kAuth.deriveRoles)(user)?.label||
      "viewer"
    ).toLowerCase();

    return KP_CACHE_PREFIX+
      encodeURIComponent(
        String(user.email).toLowerCase()
      )+":"+
      encodeURIComponent(role)+":"+
      encodeURIComponent(
        JSON.stringify(eS)
      )
  }catch{
    return null
  }
}

function kpCacheRead(){
  try{
    let key=kpCacheKey();

    if(!key)
      return null;

    let raw=sessionStorage.getItem(key);

    if(!raw)
      return null;

    let cached=JSON.parse(raw),
        savedAt=Number(cached?.savedAt||0);

    if(
      !savedAt ||
      Date.now()-savedAt>=KP_CACHE_TTL_MS ||
      !cached?.data
    ){
      sessionStorage.removeItem(key);
      return null
    }

    return cached.data
  }catch{
    return null
  }
}

function kpCacheWrite(data){
  try{
    let key=kpCacheKey();

    if(!key)
      return;

    sessionStorage.setItem(
      key,
      JSON.stringify({
        savedAt:Date.now(),
        data
      })
    )
  }catch{}
}

function kpCacheApply(data){
  c(data?.totals||L);
  H(data?.summary??null);

  o(
    Array.isArray(data?.nodes)
      ?data.nodes
      :[]
  );

  q(
    data?.expandedKeys &&
    "object"===typeof data.expandedKeys
      ?data.expandedKeys
      :{}
  )
}

function kpCacheInvalidateAll(){
  try{
    let keys=[];

    for(let i=0;i<sessionStorage.length;i++){
      let k=sessionStorage.key(i);

      if(
        k &&
        k.startsWith(KP_CACHE_PREFIX)
      ){
        keys.push(k)
      }
    }

    for(let k of keys)
      sessionStorage.removeItem(k)
  }catch{}
}

let eT=(0,t.useCallback)(async(force=!1)=>{
  if(!force){
    let cached=kpCacheRead();

    if(cached){
      kpCacheApply(cached);
      J(!1);
      return
    }
  }

  J(!0);
  q({});

  try{
    let[
      e,
      a
    ]=await Promise.all([
      R.apiAuth.get(
        "/bdb/kinerja-perkara/rekap",
        {params:eS}
      ),
      R.apiAuth.get(
        "/bdb/kinerja-perkara/summary",
        {params:eS}
      )
    ]);

    let data=e.data?.data,
        nodes=(data?.nodes||[]).map(E),
        expandedKeys={};

    c(data?.totals||L);
    H(a.data?.data||null);

    /*
      Existing behavior:
      jika hanya satu root dan punya child,
      auto-expand sekali.
    */
    if(
      1===nodes.length &&
      !nodes[0].leaf
    ){
      let root=nodes[0];

      try{
        let childResponse=
          await R.apiAuth.get(
            "/bdb/kinerja-perkara/rekap",
            {
              params:{
                ...eS,
                parent:root.key
              }
            }
          );

        let children=
          (
            childResponse.data?.data?.nodes||
            []
          ).map(E);

        nodes=F(
          nodes,
          root.key,
          children
        );

        expandedKeys={
          [root.key]:!0
        };

        q(expandedKeys)
      }catch{}
    }

    o(nodes);

    kpCacheWrite({
      totals:data?.totals||L,
      summary:a.data?.data||null,
      nodes,
      expandedKeys
    })

  }catch(e){
    l.current?.show({
      severity:"error",
      summary:"Gagal",
      detail:
        e.response?.data?.message||
        "Gagal memuat laporan"
    })
  }finally{
    J(!1)
  }
},[eS]);

function kpForceReload(){
  return eT(!0)
}

async function ew(e){let a=e.node;if(!a.children&&!a.leaf)try{let e=await R.apiAuth.get("/bdb/kinerja-perkara/rekap",{params:{...eS,parent:a.key}}),t=(e.data?.data?.nodes||[]).map(E);o(e=>F(e,a.key,t))}catch{l.current?.show({severity:"error",summary:"Gagal",detail:"Gagal memuat sub-satker."})}}async function eP(){if(await (0,_.confirmAction)("Menghitung ulang data kinerja perkara dari seluruh LP sekarang akan membebani proses lain di server untuk beberapa saat. Lanjutkan?",{header:"Refresh Sekarang",danger:!0,acceptLabel:"Ya, Refresh"})){Y(!0);try{await R.apiAuth.post("/bdb/kinerja-perkara/refresh"),l.current?.show({severity:"success",summary:"Diperbarui",detail:"Data kinerja perkara terkini sudah tersedia."}),kpCacheInvalidateAll(),await kpForceReload()}catch(e){l.current?.show({severity:"error",summary:"Gagal",detail:e.response?.data?.message||"Gagal me-refresh data"})}finally{Y(!1)}}}async function eR(){en(!0);try{let a=await R.apiAuth.get("/bdb/kinerja-perkara/rekap/export.csv",{params:eS,responseType:"blob"}),t=URL.createObjectURL(a.data),n=document.createElement("a");n.href=t,n.download=`kinerja-perkara-${eAP.from}_${eAP.to}.csv`,n.click(),URL.revokeObjectURL(t)}catch{l.current?.show({severity:"error",summary:"Gagal",detail:"Gagal mengunduh CSV."})}finally{en(!1)}}return(0,t.useEffect)(()=>{eT()},[eT]),(0,a.jsxs)("div",{children:[(0,a.jsx)(y.Toast,{ref:l}),(0,a.jsx)(f.ConfirmDialog,{}),(0,a.jsxs)("div",{style:{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:"1rem",flexWrap:"wrap"},children:[(0,a.jsxs)("div",{children:[(0,a.jsxs)("h1",{className:"cms-page-title",style:{display:"inline-flex",alignItems:"center",gap:"0.5rem"},children:[(0,a.jsx)(k.Gauge,{size:22})," Kinerja Perkara (CT/CP/CC/CR/Indeks)"]}),(0,a.jsx)("p",{className:"cms-page-sub",children:"Penghitungan kinerja penanganan perkara per satker sesuai Ketentuan Penghitungan CT, CP, CC, CR, dan Indeks Kinerja"})]}),(0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.6rem",flexWrap:"wrap",marginTop:"0.25rem"},children:[(0,a.jsxs)("span",{style:{fontSize:"0.78rem",color:"#94a3b8"},children:["Data per: ",function(e){if(!e)return"—";let a=new Date(e);return isNaN(a.getTime())?e:a.toLocaleString("id-ID",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}(x?.last_refreshed_at)]}),(0,a.jsxs)(p.Button,{onClick:()=>Q(!0),outlined:!0,className:"att-btn",children:[(0,a.jsx)(C,{size:15,style:{marginRight:"0.4rem"}})," Cara Perhitungan"]}),(0,a.jsxs)(p.Button,{onClick:eR,loading:et,outlined:!0,className:"att-btn",children:[(0,a.jsx)(T.FileSpreadsheet,{size:15,style:{marginRight:"0.4rem"}})," CSV"]}),kCanRefresh&&(0,a.jsxs)(p.Button,{onClick:eP,loading:V,severity:"warning",outlined:!0,className:"att-btn",children:[(0,a.jsx)(v.RefreshCw,{size:15,style:{marginRight:"0.4rem"}})," Refresh Sekarang"]})]})]}),"difficulty"===eAP.bucketMode&&!!x?.belum_kesulitan&&(0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem",background:"#fffbeb",border:"1px solid #fde68a",color:"#92400e",borderRadius:10,padding:"0.6rem 0.9rem",margin:"0.85rem 0",fontSize:"0.85rem"},children:[(0,a.jsx)(S.AlertTriangle,{size:16,style:{flex:"0 0 auto"}}),(0,a.jsxs)("span",{children:[(0,a.jsx)("strong",{children:x.belum_kesulitan})," LP belum memilih tingkat kesulitan — dihitung pakai default ",(0,a.jsx)("strong",{children:"Mudah (30 hari)"})," sampai dipilih."]})]}),(0,a.jsxs)("div",{style:{display:"flex",alignItems:"stretch",gap:"0.55rem",margin:"1rem 0"},children:[(0,a.jsxs)("div",{id:"kp-summary-strip",style:{display:"flex",gap:"1rem",overflowX:"auto",scrollBehavior:"smooth",flex:"1 1 auto",paddingBottom:"0.3rem"},children:[(0,a.jsxs)("div",{className:"cms-card",style:{borderLeft:"4px solid #1d4ed8",flex:"0 0 250px",minHeight:"112px"},children:[(0,a.jsx)("div",{style:{fontSize:"0.72rem",color:"#94a3b8",fontWeight:700,textTransform:"uppercase"},children:"CT — Crime Total"}),(0,a.jsx)("div",{style:{fontSize:"1.5rem",fontWeight:800,color:"#1d4ed8"},children:d.ct.toLocaleString("id-ID")})]}),(0,a.jsxs)("div",{className:"cms-card",title:`Aktual ${(x?.cp_berjalan_belum_update??0).toLocaleString("id-ID")} • Tunggakan ${(x?.cp_tunggakan_belum_update??0).toLocaleString("id-ID")}`,style:{borderLeft:"4px solid #f59e0b",flex:"0 0 250px",minHeight:"112px"},children:[(0,a.jsx)("div",{style:{fontSize:"0.72rem",color:"#94a3b8",fontWeight:700,textTransform:"uppercase"},children:"Sisa Total"}),(0,a.jsx)("div",{style:{fontSize:"1.5rem",fontWeight:800,color:"#b45309"},children:((x?.cp_berjalan_belum_update??0)+(x?.cp_tunggakan_belum_update??0)).toLocaleString("id-ID")})]}),...ee?[(0,a.jsxs)("div",{className:"cms-card",style:{borderLeft:"4px solid #fbbf24",flex:"0 0 250px",minHeight:"112px"},children:[(0,a.jsx)("div",{style:{fontSize:"0.72rem",color:"#94a3b8",fontWeight:700,textTransform:"uppercase"},children:"Sisa Aktual"}),(0,a.jsx)("div",{style:{fontSize:"1.5rem",fontWeight:800,color:"#b45309"},children:(x?.cp_berjalan_belum_update??0).toLocaleString("id-ID")})]}),(0,a.jsxs)("div",{className:"cms-card",style:{borderLeft:"4px solid #f97316",flex:"0 0 250px",minHeight:"112px"},children:[(0,a.jsx)("div",{style:{fontSize:"0.72rem",color:"#94a3b8",fontWeight:700,textTransform:"uppercase"},children:"Sisa Tunggakan"}),(0,a.jsx)("div",{style:{fontSize:"1.5rem",fontWeight:800,color:"#c2410c"},children:(x?.cp_tunggakan_belum_update??0).toLocaleString("id-ID")})]})]:[],(0,a.jsxs)("div",{className:"cms-card",style:{borderLeft:"4px solid #0e7490",flex:"0 0 250px",minHeight:"112px"},children:[(0,a.jsx)("div",{style:{fontSize:"0.72rem",color:"#94a3b8",fontWeight:700,textTransform:"uppercase"},children:"CP Total"}),(0,a.jsx)("div",{style:{fontSize:"1.5rem",fontWeight:800,color:"#0e7490"},children:(d.cp_berjalan+d.cp_tunggakan).toLocaleString("id-ID")})]}),...ee?[(0,a.jsxs)("div",{className:"cms-card",style:{borderLeft:"4px solid #0891b2",flex:"0 0 250px",minHeight:"112px"},children:[(0,a.jsx)("div",{style:{fontSize:"0.72rem",color:"#94a3b8",fontWeight:700,textTransform:"uppercase"},children:"CP Aktual"}),(0,a.jsx)("div",{style:{fontSize:"1.5rem",fontWeight:800,color:"#0891b2"},children:d.cp_berjalan.toLocaleString("id-ID")})]}),(0,a.jsxs)("div",{className:"cms-card",style:{borderLeft:"4px solid #dc2626",flex:"0 0 250px",minHeight:"112px"},children:[(0,a.jsx)("div",{style:{fontSize:"0.72rem",color:"#94a3b8",fontWeight:700,textTransform:"uppercase"},children:"CP Tunggakan"}),(0,a.jsx)("div",{style:{fontSize:"1.5rem",fontWeight:800,color:"#dc2626"},children:d.cp_tunggakan.toLocaleString("id-ID")})]})]:[],(0,a.jsxs)("div",{className:"cms-card",title:"PR Lama = CP / CT × 100%",style:{flex:"0 0 250px",minHeight:"112px"},children:[(0,a.jsx)("div",{style:{fontSize:"0.72rem",color:"#94a3b8",fontWeight:700,textTransform:"uppercase"},children:"PR (Rumus Lama)"}),(0,a.jsxs)("div",{style:{fontSize:"1.5rem",fontWeight:800,color:"#64748b"},children:[(x?.pr_lama??0).toFixed(2),"%"]})]}),(0,a.jsxs)("div",{className:"cms-card",title:"PR Baru = (CP Aktual + CP Tunggakan) / (CT + CP Tunggakan) × 100%",style:{flex:"0 0 250px",minHeight:"112px"},children:[(0,a.jsx)("div",{style:{fontSize:"0.72rem",color:"#94a3b8",fontWeight:700,textTransform:"uppercase"},children:"PR (Rumus Baru)"}),(0,a.jsxs)("div",{style:{fontSize:"1.5rem",fontWeight:800,color:"#0e7490"},children:[(x?.pr??0).toFixed(2),"%"]})]}),(0,a.jsxs)("div",{className:"cms-card",style:{borderLeft:"4px solid #15803d",flex:"0 0 250px",minHeight:"112px"},children:[(0,a.jsx)("div",{style:{fontSize:"0.72rem",color:"#94a3b8",fontWeight:700,textTransform:"uppercase"},children:"CC Total"}),(0,a.jsx)("div",{style:{fontSize:"1.5rem",fontWeight:800,color:"#15803d"},children:(d.cc_aktual+d.cc_tunggakan).toLocaleString("id-ID")})]}),...ee?[(0,a.jsxs)("div",{className:"cms-card",style:{borderLeft:"4px solid #16a34a",flex:"0 0 250px",minHeight:"112px"},children:[(0,a.jsx)("div",{style:{fontSize:"0.72rem",color:"#94a3b8",fontWeight:700,textTransform:"uppercase"},children:"CC Aktual"}),(0,a.jsx)("div",{style:{fontSize:"1.5rem",fontWeight:800,color:"#16a34a"},children:d.cc_aktual.toLocaleString("id-ID")})]}),(0,a.jsxs)("div",{className:"cms-card",style:{borderLeft:"4px solid #b45309",flex:"0 0 250px",minHeight:"112px"},children:[(0,a.jsx)("div",{style:{fontSize:"0.72rem",color:"#94a3b8",fontWeight:700,textTransform:"uppercase"},children:"CC Tunggakan"}),(0,a.jsx)("div",{style:{fontSize:"1.5rem",fontWeight:800,color:"#b45309"},children:d.cc_tunggakan.toLocaleString("id-ID")})]})]:[],(0,a.jsxs)("div",{className:"cms-card",title:"CR Lama = CC / CT × 100%",style:{flex:"0 0 250px",minHeight:"112px"},children:[(0,a.jsx)("div",{style:{fontSize:"0.72rem",color:"#94a3b8",fontWeight:700,textTransform:"uppercase"},children:"CR (Rumus Lama)"}),(0,a.jsxs)("div",{style:{fontSize:"1.5rem",fontWeight:800,color:"#64748b"},children:[(x?.cr_lama??0).toFixed(2),"%"]})]}),(0,a.jsxs)("div",{className:"cms-card",title:"Rumus resmi: (CC Aktual + CC Tunggakan) / (CT + CC Tunggakan)",style:{flex:"0 0 250px",minHeight:"112px"},children:[(0,a.jsx)("div",{style:{fontSize:"0.72rem",color:"#94a3b8",fontWeight:700,textTransform:"uppercase"},children:"CR (Rumus Baru)"}),(0,a.jsxs)("div",{style:{fontSize:"1.5rem",fontWeight:800},children:[(x?.cr??0).toFixed(2),"%"]})]}),(0,a.jsxs)("div",{className:"cms-card",style:{flex:"0 0 250px",minHeight:"112px"},children:[(0,a.jsx)("div",{style:{fontSize:"0.72rem",color:"#94a3b8",fontWeight:700,textTransform:"uppercase"},children:"Indeks Kinerja"}),(0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[(0,a.jsx)("div",{style:{fontSize:"1.5rem",fontWeight:800},children:(x?.indeks??0).toLocaleString("id-ID",{minimumFractionDigits:2,maximumFractionDigits:2})}),(0,a.jsx)(g.Tag,{value:`Level ${x?.level??1}`,severity:$(x?.level??1)})]})]}),...ee?[(0,a.jsxs)("div",{className:"cms-card",title:"Crime Rate = (CT / Jumlah Penduduk) × 100.000",style:{flex:"0 0 250px",minHeight:"112px"},children:[(0,a.jsxs)("div",{style:{fontSize:"0.72rem",color:"#94a3b8",fontWeight:700,textTransform:"uppercase"},children:["Tingkat Risiko Kejahatan",x?.jumlah_penduduk?` | ${x.jumlah_penduduk.toLocaleString("id-ID")} Penduduk`:""]}),(0,a.jsx)("div",{style:{fontSize:"1.5rem",fontWeight:800,color:"#7c3aed"},children:x?.crime_rate!=null?`${x.crime_rate.toLocaleString("id-ID")} Orang`:"-"}),(0,a.jsx)("div",{style:{fontSize:"0.72rem",color:"#94a3b8",marginTop:"0.15rem"},children:x?.crime_rate!=null?"Berisiko Menjadi Korban Kejahatan":"Data penduduk belum tersedia"})]}),(0,a.jsxs)("div",{className:"cms-card",title:"Crime Clock = Total Detik dalam Periode / CT",style:{flex:"0 0 250px",minHeight:"112px"},children:[(0,a.jsx)("div",{style:{fontSize:"0.72rem",color:"#94a3b8",fontWeight:700,textTransform:"uppercase"},children:"Indeks Waktu Kejahatan"}),(0,a.jsx)("div",{style:{fontSize:"1.25rem",fontWeight:800,color:"#0891b2"},children:d.ct>0&&x?.crime_clock?x.crime_clock.label:"Belum Ada Data Kejahatan"}),(0,a.jsx)("div",{style:{fontSize:"0.72rem",color:"#94a3b8",marginTop:"0.15rem"},children:d.ct>0?"Terjadi Kejahatan":"Tidak Ada Kejahatan"})]})]:[]]})]}),(0,a.jsxs)("div",{className:"cms-card",style:{padding:0,overflow:(kpPeriodOpen||satkerPopOpen||crimePopOpen||paramPopOpen)?"visible":"hidden"},children:[(0,a.jsxs)("div",{style:{padding:"0.7rem 1rem",display:"flex",gap:"1rem",flexWrap:"wrap",alignItems:"center",borderBottom:"1px solid #f1f5f9"},children:[(0,a.jsxs)("div",{
style:{
  display:"flex",
  alignItems:"center",
  gap:"0.6rem",
  flexWrap:"nowrap"
},
children:[
  (0,a.jsx)("span",{
    style:{
      fontWeight:700,
      color:"#64748b",
      fontSize:"0.82rem",
      whiteSpace:"nowrap"
    },
    children:"Periode:"
  }),

  (0,a.jsxs)("div",{
style:{position:"relative"},
children:[
(0,a.jsx)(p.Button,{
label:kpPeriodLabel,
icon:"pi pi-calendar",
outlined:!0,
onClick:()=>{
  kpPeriodOpen
    ? setKpPeriodOpen(!1)
    : kpOpenPeriod()
},
className:"att-btn",
style:{
  minWidth:"13rem",
  justifyContent:"flex-start",
  whiteSpace:"nowrap"
}
}),
kpPeriodOpen&&(0,a.jsxs)("div",{
className:"kp-period-popover-v2",
style:{
  position:"absolute",
  left:0,
  top:"calc(100% + 0.45rem)",
  zIndex:100,
  width:"34rem",
  maxWidth:"calc(100vw - 2rem)",
  background:"#fff",
  border:"1px solid #dbe3ee",
  borderRadius:10,
  boxShadow:"0 14px 36px rgba(15,23,42,.16)",
  padding:"0.85rem"
},
children:[
(0,a.jsx)("div",{
style:{
  fontWeight:800,
  color:"#0f172a",
  marginBottom:"0.7rem"
},
children:"Pilih Periode"
}),
(0,a.jsxs)("div",{
style:{display:"grid",gap:"0.85rem"},
children:[

(0,a.jsxs)("div",{
style:{
  display:"grid",
  gridTemplateColumns:"repeat(3,1fr)",
  gap:"0.4rem"
},
children:[
(0,a.jsx)(p.Button,{
  label:"Bulan",
  outlined:"month"!==kpPeriodMode,
  onClick:()=>setKpPeriodMode("month")
}),
(0,a.jsx)(p.Button,{
  label:"Tahun",
  outlined:"year"!==kpPeriodMode,
  onClick:()=>setKpPeriodMode("year")
}),
(0,a.jsx)(p.Button,{
  label:"Custom",
  outlined:"custom"!==kpPeriodMode,
  onClick:()=>setKpPeriodMode("custom")
})
]
}),

"month"===kpPeriodMode&&(0,a.jsxs)("div",{
style:{
  display:"grid",
  gridTemplateColumns:"1fr 1fr",
  gap:"0.6rem"
},
children:[
(0,a.jsx)(j.Dropdown,{
  value:kpPeriodMonth,
  options:kpMonthOptions(),
  onChange:e=>setKpPeriodMonth(e.value),
  placeholder:"Bulan",
  style:{width:"100%"}
}),
(0,a.jsx)(j.Dropdown,{
  value:kpPeriodYear,
  options:kpYearOptions(),
  onChange:e=>setKpPeriodYear(e.value),
  placeholder:"Tahun",
  style:{width:"100%"}
})
]
}),

"year"===kpPeriodMode&&(0,a.jsx)(j.Dropdown,{
  value:kpPeriodYear,
  options:kpYearOptions(),
  onChange:e=>setKpPeriodYear(e.value),
  placeholder:"Pilih tahun",
  style:{width:"100%"}
}),

"custom"===kpPeriodMode&&(0,a.jsxs)("div",{
style:{
  display:"grid",
  gridTemplateColumns:"1fr 1fr",
  gap:"0.6rem"
},
children:[
(0,a.jsxs)("div",{
children:[
(0,a.jsx)("label",{
  style:{
    display:"block",
    fontSize:"0.72rem",
    marginBottom:"0.25rem"
  },
  children:"Dari"
}),
(0,a.jsx)(m.InputText,{
  type:"date",
  value:kpCustomFrom,
  onChange:e=>setKpCustomFrom(e.target.value),
  style:{width:"100%"}
})
]
}),
(0,a.jsxs)("div",{
children:[
(0,a.jsx)("label",{
  style:{
    display:"block",
    fontSize:"0.72rem",
    marginBottom:"0.25rem"
  },
  children:"Sampai"
}),
(0,a.jsx)(m.InputText,{
  type:"date",
  value:kpCustomTo,
  onChange:e=>setKpCustomTo(e.target.value),
  style:{width:"100%"}
})
]
})
]
}),

(0,a.jsx)("div",{
style:{
  fontSize:"0.72rem",
  color:"#64748b",
  background:"#f8fafc",
  border:"1px solid #e2e8f0",
  borderRadius:7,
  padding:"0.55rem 0.65rem"
},
children:"Terapkan di sini hanya memilih periode. Klik Terapkan pada filter utama untuk memuat data."
}),

(0,a.jsxs)("div",{
style:{
  display:"flex",
  justifyContent:"flex-end",
  gap:"0.45rem"
},
children:[
(0,a.jsx)(p.Button,{
  label:"Batal",
  text:!0,
  onClick:()=>setKpPeriodOpen(!1)
}),
(0,a.jsx)(p.Button,{
  label:"Terapkan",
  icon:"pi pi-check",
  onClick:kpApplyPeriod
})
]
})

]
})
]
})
]
})
]
}),(0,a.jsxs)("div",{style:{position:"relative"},children:[
  (0,a.jsx)(p.Button,{
    label:eScope==="national"?"Satker: Nasional":(eScopeOpts.find(x=>x.value===eScopeSatkerId)?.label?("Satker: "+eScopeOpts.find(x=>x.value===eScopeSatkerId).label):"Filter Satker"),
    icon:"pi pi-building",
    outlined:!0,
    onClick:()=>setSatkerPopOpen(o=>!o),
    className:"att-btn",
    style:{minWidth:"13rem",justifyContent:"flex-start",whiteSpace:"nowrap",fontWeight:eScopeSatkerId?700:500,borderColor:eScopeSatkerId?"#3b82f6":"#cbd5e1",color:eScopeSatkerId?"#1d4ed8":void 0,backgroundColor:eScopeSatkerId?"#eff6ff":void 0}
  }),
  satkerPopOpen&&(0,a.jsx)("div",{style:{position:"fixed",inset:0,zIndex:99},onClick:()=>setSatkerPopOpen(!1)}),
  satkerPopOpen&&(0,a.jsxs)("div",{
    style:{position:"absolute",left:0,top:"calc(100% + 0.45rem)",zIndex:100,width:"30rem",maxWidth:"calc(100vw - 2rem)",background:"#fff",border:"1px solid #dbe3ee",borderRadius:10,boxShadow:"0 14px 36px rgba(15,23,42,.16)",padding:"0.85rem"},
    children:[
      (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.6rem"},children:[
        (0,a.jsx)("div",{style:{fontWeight:800,color:"#0f172a",fontSize:"0.95rem"},children:"Filter Satker & Wilayah"}),
        (0,a.jsx)("button",{type:"button",onClick:()=>setSatkerPopOpen(!1),style:{background:"none",border:"none",cursor:"pointer",color:"#64748b",fontSize:"1.1rem",lineHeight:1,padding:"0.2rem"},children:"×"})
      ]}),
      (0,a.jsxs)("div",{style:{display:"grid",gap:"0.75rem"},children:[
        (0,a.jsxs)("div",{style:{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:8,padding:"0.55rem"},children:[
          (0,a.jsx)("div",{style:{fontSize:"0.72rem",fontWeight:700,color:"#475569",textTransform:"uppercase",marginBottom:"0.35rem"},children:"1. Kelompok Data"}),
          (0,a.jsx)(j.Dropdown,{value:eScope,options:[{label:"Kelompok Nasional",value:"national"},{label:"Kelompok Regional",value:"scoped"}],onChange:e=>eSetScope(e.value),style:{width:"100%",fontSize:"0.82rem"}})
        ]}),
        "scoped"===eScope&&(0,a.jsxs)("div",{style:{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:8,padding:"0.55rem"},children:[
          (0,a.jsx)("div",{style:{fontSize:"0.72rem",fontWeight:700,color:"#475569",textTransform:"uppercase",marginBottom:"0.35rem"},children:"2. Wilayah Regional"}),
          (0,a.jsx)(j.Dropdown,{value:eScopeSatkerId,options:eScopeOpts,onChange:e=>eSetScopeSatkerId(e.value),placeholder:"Pilih Wilayah",filter:!0,style:{width:"100%",fontSize:"0.82rem"}})
        ]}),
        (0,a.jsxs)("div",{style:{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:8,padding:"0.55rem"},children:[
          (0,a.jsx)("div",{style:{fontSize:"0.72rem",fontWeight:700,color:"#475569",textTransform:"uppercase",marginBottom:"0.35rem"},children:"3. Cakupan Satker"}),
          (0,a.jsx)(j.Dropdown,{value:eFD,options:[{label:"Internal Reserse",value:"INTERNAL_RESERSE"},{label:"Eksternal Reserse / Non-Reserse",value:"EKSTERNAL_RESERSE"}],onChange:e=>eSetFD(e.value),style:{width:"100%",fontSize:"0.82rem"}})
        ]}),
        (0,a.jsxs)("div",{style:{display:"flex",justifyContent:"flex-end",gap:"0.45rem",marginTop:"0.2rem"},children:[
          (0,a.jsx)(p.Button,{label:"Selesai",icon:"pi pi-check",onClick:()=>setSatkerPopOpen(!1)})
        ]})
      ]})
    ]
  })
]}),
(0,a.jsxs)("div",{style:{position:"relative"},children:[
  (0,a.jsx)(p.Button,{
    label:em.length?("Kejahatan ("+em.length+")"):(ey.length?("Golongan ("+ey.length+")"):(ek.length?("ICCS ("+ek.length+")"):(eKG.length?("Kelompok: "+eKG.join(",")):"Filter Kejahatan"))),
    icon:"pi pi-shield",
    outlined:!0,
    onClick:()=>setCrimePopOpen(o=>!o),
    className:"att-btn",
    style:{minWidth:"13rem",justifyContent:"flex-start",whiteSpace:"nowrap",fontWeight:(em.length||ey.length||ek.length||eKG.length)?700:500,borderColor:(em.length||ey.length||ek.length||eKG.length)?"#3b82f6":"#cbd5e1",color:(em.length||ey.length||ek.length||eKG.length)?"#1d4ed8":void 0,backgroundColor:(em.length||ey.length||ek.length||eKG.length)?"#eff6ff":void 0}
  }),
  crimePopOpen&&(0,a.jsx)("div",{style:{position:"fixed",inset:0,zIndex:99},onClick:()=>setCrimePopOpen(!1)}),
  crimePopOpen&&(0,a.jsxs)("div",{
    style:{position:"absolute",left:0,top:"calc(100% + 0.45rem)",zIndex:100,width:"35rem",maxWidth:"calc(100vw - 2rem)",background:"#fff",border:"1px solid #dbe3ee",borderRadius:10,boxShadow:"0 14px 36px rgba(15,23,42,.16)",padding:"0.85rem"},
    children:[
      (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.6rem"},children:[
        (0,a.jsxs)("div",{children:[
          (0,a.jsx)("div",{style:{fontWeight:800,color:"#0f172a",fontSize:"0.95rem"},children:"Filter Jenis Kejahatan"}),
          (0,a.jsxs)("div",{style:{fontSize:"0.72rem",color:"#64748b"},children:[em.length," jenis dipilih • ",ey.length," golongan • ",ek.length," ICCS"]})
        ]}),
        (0,a.jsx)("button",{type:"button",onClick:()=>setCrimePopOpen(!1),style:{background:"none",border:"none",cursor:"pointer",color:"#64748b",fontSize:"1.1rem",lineHeight:1,padding:"0.2rem"},children:"×"})
      ]}),
      (0,a.jsxs)("div",{style:{marginBottom:"0.55rem",background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:8,padding:"0.5rem 0.6rem"},children:[
        (0,a.jsx)("div",{style:{fontSize:"0.72rem",fontWeight:700,color:"#475569",textTransform:"uppercase",marginBottom:"0.35rem"},children:"1. Kelompok Induk Kejahatan"}),
        (0,a.jsx)("div",{style:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"0.35rem"},children:[
          {key:"ALL",label:"Semua"},
          {key:"KRIMUM",label:"KRIMUM"},
          {key:"KRIMSUS",label:"KRIMSUS"},
          {key:"NARKOBA",label:"NARKOBA"}
        ].map(kItem=>{
          let checked = activeKelompokCrime === kItem.key;
          return (0,a.jsx)("div",{
            key:kItem.key,
            onClick:()=>{
              setActiveKelompokCrime(kItem.key);
              setActiveTipidCrime("ALL");
              if(kItem.key === "ALL") { eSetKG([]); }
              else { eSetKG([kItem.key]); }
            },
            style:{
              textAlign:"center",padding:"0.35rem 0.2rem",fontSize:"0.74rem",
              fontWeight:checked?700:500,color:checked?"#1d4ed8":"#334155",
              background:checked?"#eff6ff":"#fff",
              border:"1px solid "+(checked?"#3b82f6":"#cbd5e1"),
              borderRadius:6,cursor:"pointer",userSelect:"none"
            },
            children:kItem.label
          });
        })})
      ]}),
      (()=>{
        let tipids = [];
        if(activeKelompokCrime === "KRIMSUS"){
          tipids = [{key:"ALL",label:"Semua Krimsus"},{key:"TIPIDSIBER",label:"TIPIDSIBER"},{key:"TIPIDEKSUS",label:"TIPIDEKSUS"},{key:"TIPIDKOR",label:"TIPIDKOR"},{key:"TIPIDTER",label:"TIPIDTER"}];
        } else if(activeKelompokCrime === "KRIMUM"){
          tipids = [{key:"ALL",label:"Semua Krimum"},{key:"TIPIDUM",label:"TIPIDUM"},{key:"TIPIDPPAPPO",label:"TIPIDPPAPPO"}];
        } else if(activeKelompokCrime === "NARKOBA"){
          tipids = [{key:"ALL",label:"Semua Narkoba"},{key:"TIPIDNARKOBA",label:"TIPIDNARKOBA"}];
        } else {
          tipids = [{key:"ALL",label:"Semua TIPID"},{key:"TIPIDUM",label:"TIPIDUM"},{key:"TIPIDPPAPPO",label:"TIPIDPPAPPO"},{key:"TIPIDEKSUS",label:"TIPIDEKSUS"},{key:"TIPIDKOR",label:"TIPIDKOR"},{key:"TIPIDTER",label:"TIPIDTER"},{key:"TIPIDSIBER",label:"TIPIDSIBER"},{key:"TIPIDNARKOBA",label:"TIPIDNARKOBA"}];
        }
        let cols = Math.min(tipids.length, 5);
        return (0,a.jsxs)("div",{style:{marginBottom:"0.55rem",background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:8,padding:"0.5rem 0.6rem"},children:[
          (0,a.jsx)("div",{style:{fontSize:"0.72rem",fontWeight:700,color:"#475569",textTransform:"uppercase",marginBottom:"0.35rem"},children:"2. Sub-Kelompok TIPID"}),
          (0,a.jsx)("div",{style:{display:"grid",gridTemplateColumns:"repeat(" + cols + ",1fr)",gap:"0.35rem"},children:tipids.map(tItem=>{
            let checked = activeTipidCrime === tItem.key;
            return (0,a.jsx)("div",{
              key:tItem.key,
              onClick:()=>{
                setActiveTipidCrime(tItem.key);
                if(tItem.key === "ALL") {
                  if(activeKelompokCrime !== "ALL") eSetKG([activeKelompokCrime]);
                  else eSetKG([]);
                } else {
                  eSetKG([tItem.key]);
                }
              },
              style:{
                textAlign:"center",padding:"0.35rem 0.2rem",fontSize:"0.72rem",
                fontWeight:checked?700:500,color:checked?"#1d4ed8":"#334155",
                background:checked?"#eff6ff":"#fff",
                border:"1px solid "+(checked?"#3b82f6":"#cbd5e1"),
                borderRadius:6,cursor:"pointer",userSelect:"none",
                whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"
              },
              children:tItem.label
            });
          })})
        ]});
      })(),
      (0,a.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.5rem",marginBottom:"0.55rem"},children:[
        (0,a.jsxs)("div",{children:[
          (0,a.jsx)("label",{style:{display:"block",fontSize:"0.72rem",fontWeight:700,color:"#475569",marginBottom:"0.2rem"},children:"Golongan"}),
          (0,a.jsx)(b.MultiSelect,{value:ey,options:eGolOptions,onChange:e=>{let v=e.value;ef(v);if(v.length){let t=eg.filter(x=>v.includes(x.golonganId));ep(c=>c.filter(id=>t.some(x=>x.value===id)));ex(c=>c.filter(id=>t.some(x=>x.iccsId===id)));}},placeholder:"Semua Golongan",display:"chip",filter:!0,showClear:!0,maxSelectedLabels:1,style:{width:"100%",fontSize:"0.78rem"}})
        ]}),
        (0,a.jsxs)("div",{children:[
          (0,a.jsx)("label",{style:{display:"block",fontSize:"0.72rem",fontWeight:700,color:"#475569",marginBottom:"0.2rem"},children:"ICCS"}),
          (0,a.jsx)(b.MultiSelect,{value:ek,options:eIccsOptions,onChange:e=>{let v=e.value;ex(v);if(v.length){let t=eg.filter(x=>v.includes(x.iccsId));ep(c=>c.filter(id=>t.some(x=>x.value===id)));ef(c=>c.filter(id=>t.some(x=>x.golonganId===id)));}},placeholder:"Semua ICCS",display:"chip",filter:!0,showClear:!0,maxSelectedLabels:1,style:{width:"100%",fontSize:"0.78rem"}})
        ]})
      ]}),
      (0,a.jsxs)("div",{children:[
        (0,a.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.25rem"},children:[
          (0,a.jsx)("label",{style:{fontSize:"0.72rem",fontWeight:700,color:"#475569"},children:"3. Daftar Jenis Kejahatan"}),
          (0,a.jsxs)("div",{style:{display:"flex",gap:"0.5rem",fontSize:"0.72rem"},children:[
            (0,a.jsx)("a",{style:{color:"#2563eb",cursor:"pointer"},onClick:()=>{ep(eJenisOptions.map(x=>x.value))},children:"Pilih Semua"}),
            (0,a.jsx)("span",{style:{color:"#cbd5e1"},children:"|"}),
            (0,a.jsx)("a",{style:{color:"#ef4444",cursor:"pointer"},onClick:()=>{ep([])},children:"Hapus Pilihan"})
          ]})
        ]}),
        (0,a.jsx)(b.MultiSelect,{
          value:em,
          options:eJenisOptions,
          onChange:e=>{let v=e.value;ep(v);if(v.length){let t=eg.filter(x=>v.includes(x.value));ef(c=>c.filter(id=>t.some(x=>x.golonganId===id)));ex(c=>c.filter(id=>t.some(x=>x.iccsId===id)));}},
          placeholder:"Cari & pilih jenis kejahatan…",
          display:"chip",
          filter:!0,
          showClear:!0,
          maxSelectedLabels:3,
          style:{width:"100%",fontSize:"0.8rem"},
          panelStyle:{maxWidth:"33rem"},
          filterBy:"label,fullLabel",
          itemTemplate:e=>(0,a.jsx)("span",{title:e.fullLabel||e.label,style:{display:"block",maxWidth:"26rem",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:e.label}),
          virtualScrollerOptions:{itemSize:36}
        })
      ]}),
      (0,a.jsxs)("div",{style:{display:"flex",justifyContent:"flex-end",gap:"0.45rem",marginTop:"0.8rem"},children:[
        (0,a.jsx)(p.Button,{label:"Selesai",icon:"pi pi-check",onClick:()=>setCrimePopOpen(!1)})
      ]})
    ]
  })
]}),
(0,a.jsxs)("div",{style:{position:"relative"},children:[
  (0,a.jsx)(p.Button,{
    label:"Parameter & Model",
    icon:"pi pi-sliders-h",
    outlined:!0,
    onClick:()=>setParamPopOpen(o=>!o),
    className:"att-btn",
    style:{minWidth:"12rem",justifyContent:"flex-start",whiteSpace:"nowrap",fontWeight:(eModel||eClosure||eBucket!=="age"||ec!=="both")?700:500,borderColor:(eModel||eClosure||eBucket!=="age"||ec!=="both")?"#3b82f6":"#cbd5e1",color:(eModel||eClosure||eBucket!=="age"||ec!=="both")?"#1d4ed8":void 0,backgroundColor:(eModel||eClosure||eBucket!=="age"||ec!=="both")?"#eff6ff":void 0}
  }),
  paramPopOpen&&(0,a.jsx)("div",{style:{position:"fixed",inset:0,zIndex:99},onClick:()=>setParamPopOpen(!1)}),
  paramPopOpen&&(0,a.jsxs)("div",{
    style:{position:"absolute",left:0,top:"calc(100% + 0.45rem)",zIndex:100,width:"28rem",maxWidth:"calc(100vw - 2rem)",background:"#fff",border:"1px solid #dbe3ee",borderRadius:10,boxShadow:"0 14px 36px rgba(15,23,42,.16)",padding:"0.85rem"},
    children:[
      (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.6rem"},children:[
        (0,a.jsx)("div",{style:{fontWeight:800,color:"#0f172a",fontSize:"0.95rem"},children:"Parameter & Model Perkara"}),
        (0,a.jsx)("button",{type:"button",onClick:()=>setParamPopOpen(!1),style:{background:"none",border:"none",cursor:"pointer",color:"#64748b",fontSize:"1.1rem",lineHeight:1,padding:"0.2rem"},children:"×"})
      ]}),
      (0,a.jsxs)("div",{style:{display:"grid",gap:"0.75rem"},children:[
        (0,a.jsxs)("div",{style:{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:8,padding:"0.55rem"},children:[
          (0,a.jsx)("div",{style:{fontSize:"0.72rem",fontWeight:700,color:"#475569",textTransform:"uppercase",marginBottom:"0.35rem"},children:"Acuan Tanggal Perhitungan"}),
          (0,a.jsx)(j.Dropdown,{value:ec,options:B,onChange:e=>eu(e.value),style:{width:"100%",fontSize:"0.82rem"}})
        ]}),
        (0,a.jsxs)("div",{style:{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:8,padding:"0.55rem"},children:[
          (0,a.jsx)("div",{style:{fontSize:"0.72rem",fontWeight:700,color:"#475569",textTransform:"uppercase",marginBottom:"0.35rem"},children:"Model Laporan Polisi"}),
          (0,a.jsx)(j.Dropdown,{value:eModel,options:[{label:"Semua Model",value:""},{label:"Model A",value:"A"},{label:"Model B",value:"B"}],placeholder:"Semua Model",onChange:e=>eSetModel(e.value),style:{width:"100%",fontSize:"0.82rem"}})
        ]}),
        (0,a.jsxs)("div",{style:{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:8,padding:"0.55rem"},children:[
          (0,a.jsx)("div",{style:{fontSize:"0.72rem",fontWeight:700,color:"#475569",textTransform:"uppercase",marginBottom:"0.35rem"},children:"Penyelesaian Perkara"}),
          (0,a.jsx)(j.Dropdown,{value:eClosure,options:[{label:"Semua Penyelesaian",value:""},{label:"Restorative Justice (RJ)",value:"RJ"},{label:"Selain RJ",value:"NON_RJ"}],placeholder:"Semua Penyelesaian",onChange:e=>eSetClosure(e.value),style:{width:"100%",fontSize:"0.82rem"}})
        ]}),
        (0,a.jsxs)("div",{style:{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:8,padding:"0.55rem"},children:[
          (0,a.jsx)("div",{style:{fontSize:"0.72rem",fontWeight:700,color:"#475569",textTransform:"uppercase",marginBottom:"0.35rem"},children:"Mode Kinerja (Bucket)"}),
          (0,a.jsx)(j.Dropdown,{value:eBucket,options:[{label:"Usia Perkara (Default)",value:"age"},{label:"Tingkat Kesulitan",value:"difficulty"}],onChange:e=>eSetBucket(e.value),style:{width:"100%",fontSize:"0.82rem"}})
        ]}),
        (0,a.jsxs)("div",{style:{display:"flex",justifyContent:"flex-end",gap:"0.45rem",marginTop:"0.2rem"},children:[
          (0,a.jsx)(p.Button,{label:"Selesai",icon:"pi pi-check",onClick:()=>setParamPopOpen(!1)})
        ]})
      ]})
    ]
  })
]}),
(0,a.jsxs)(p.Button,{
  label:"Terapkan",
  icon:"pi pi-search",
  onClick:()=>{
    kpCacheInvalidateAll();
    eSetAP({
      from:el,to:eo,mode:ec,
      jenis:[...em],golongan:[...ey],iccs:[...ek],
      kelompok:[...eKG],
      scope:eScope,scopeSatkerId:"scoped"===eScope?eScopeSatkerId:null,
      functionDomain:eFD,modelLp:eModel,closureReason:eClosure,bucketMode:eBucket
    });
  },
  className:"att-btn",
  children:[]
}),
(0,a.jsxs)(p.Button,{
  onClick:()=>ea(e=>!e),
  outlined:!ee,
  className:"att-btn",
  style:{background:ee?"#fef9c3":void 0,borderColor:ee?"#facc15":void 0,color:ee?"#854d0e":void 0},
  children:[(0,a.jsx)(P,{size:15,style:{marginRight:"0.4rem"}})," ",ee?"Sembunyikan Detail":"Tampilkan Detail"]
}),
(0,a.jsx)(p.Button,{
  icon:"pi pi-refresh",
  outlined:!0,
  onClick:kpForceReload,
  loading:G,
  "aria-label":"Muat ulang",
  style:{marginLeft:"auto"}
})]}),(0,a.jsx)("div",{style:{padding:"0.3rem 1rem 0.7rem",fontSize:"0.76rem",color:"#94a3b8",borderBottom:"1px solid #f1f5f9"},children:O[ec]}),(em.length>0||ey.length>0||ek.length>0||eKG.length>0)&&(0,a.jsxs)("div",{style:{padding:"0 1rem 0.7rem",display:"flex",alignItems:"center",gap:"0.4rem",flexWrap:"wrap",borderBottom:"1px solid #f1f5f9"},children:[(0,a.jsx)("span",{style:{fontSize:"0.76rem",color:"#94a3b8",fontWeight:700},children:"Filter aktif:"}),em.map(e=>{let t=eg.find(a=>a.value===e);return t?(0,a.jsx)(g.Tag,{value:t.label,style:{cursor:"pointer"},onClick:()=>ep(a=>a.filter(a=>a!==e)),icon:"pi pi-times"},`jk-${e}`):null}),ey.map(e=>{let t=ej.find(a=>a.value===e);return t?(0,a.jsx)(g.Tag,{value:t.label,severity:"warning",style:{cursor:"pointer"},onClick:()=>ef(a=>a.filter(a=>a!==e)),icon:"pi pi-times"},`gol-${e}`):null}),ek.map(e=>{let t=eC.find(a=>a.value===e);return t?(0,a.jsx)(g.Tag,{value:t.label,severity:"info",style:{cursor:"pointer"},onClick:()=>ex(a=>a.filter(a=>a!==e)),icon:"pi pi-times"},`iccs-${e}`):null}),eKG.map(e=>{let t=[...eGroupOptions,{label:e,value:e}].find(a=>a.value===e);return(0,a.jsx)(g.Tag,{value:t.label,severity:"success",style:{cursor:"pointer"},onClick:()=>eSetKG(a=>a.filter(a=>a!==e)),icon:"pi pi-times"},`kg-${e}`)})]}),(0,a.jsx)("div",{style:{overflowX:"auto"},children:(0,a.jsx)(n.TreeTable,{value:s,lazy:!0,loading:G,onExpand:ew,expandedKeys:X,onToggle:e=>q(e.value),emptyMessage:"Tidak ada data untuk periode ini.",showGridlines:!0,className:"kp-tt",tableStyle:{minWidth:`${80+46*!!ee}rem`,fontSize:"0.8rem",tableLayout:"auto"},headerColumnGroup:(0,a.jsxs)(i,{children:[(0,a.jsxs)(u,{children:[(0,a.jsx)(r.Column,{header:"NO",rowSpan:2,style:z}),(0,a.jsx)(r.Column,{header:"SATKER",rowSpan:2,style:z}),(0,a.jsx)(r.Column,{header:"CT (CRIME TOTAL)",colSpan:1,style:z}),(0,a.jsx)(r.Column,{header:"SISA",colSpan:ee?3:1,style:z}),(0,a.jsx)(r.Column,{header:(0,a.jsxs)("span",{style:{display:"inline-block",lineHeight:1.05},children:["LIMPAH",(0,a.jsx)("br",{}),"EKSTERNAL"]}),rowSpan:2,style:{...z,minWidth:"6rem",whiteSpace:"normal"}}),(0,a.jsx)(r.Column,{header:"CP (CRIME PROCESSED)",colSpan:ee?3+2*I.length:3,style:z}),(0,a.jsx)(r.Column,{header:"PR (PROCESSED RATE)",colSpan:2,style:z}),(0,a.jsx)(r.Column,{header:"CC (CRIME CLEARANCE)",colSpan:ee?3+2*W.length:3,style:z}),(0,a.jsx)(r.Column,{header:"CR (CLEARANCE RATE)",colSpan:2,style:z}),(0,a.jsx)(r.Column,{header:"INDEKS KINERJA",rowSpan:2,style:z}),...ee?[(0,a.jsx)(r.Column,{header:"JUMLAH PENDUDUK",rowSpan:2,style:z}),(0,a.jsx)(r.Column,{header:"CRIME RATE",rowSpan:2,style:z}),(0,a.jsx)(r.Column,{header:"CRIME CLOCK",rowSpan:2,style:z})]:[]]}),(0,a.jsx)(u,{children:[(0,a.jsx)(r.Column,{header:"TOTAL",style:D},"ct-total"),(0,a.jsx)(r.Column,{header:"TOTAL",style:D},"bu-total"),...ee?[(0,a.jsx)(r.Column,{header:"AKT",style:N},"bu-aktual"),(0,a.jsx)(r.Column,{header:"TGK",style:N},"bu-tunggakan")]:[],(0,a.jsx)(r.Column,{header:"TOTAL",style:D},"cp-gab"),(0,a.jsx)(r.Column,{header:"AKT",style:D},"cpa-total"),...ee?I.map(e=>(0,a.jsx)(r.Column,{header:e.label,style:N},`cpa-h-${e.key}`)):[],(0,a.jsx)(r.Column,{header:"TGK",style:D},"cpt-total"),...ee?I.map(e=>(0,a.jsx)(r.Column,{header:e.label,style:N},`cpt-h-${e.key}`)):[],(0,a.jsx)(r.Column,{header:"RMS LAMA",style:D},"pr-lama"),(0,a.jsx)(r.Column,{header:"RMS BARU",style:D},"pr-baru"),(0,a.jsx)(r.Column,{header:"TOTAL",style:D},"cc-gab"),(0,a.jsx)(r.Column,{header:"AKT",style:D},"cca-total"),...ee?W.map(e=>(0,a.jsx)(r.Column,{header:e.label,style:N},`cca-h-${e.key}`)):[],(0,a.jsx)(r.Column,{header:"TGK",style:D},"cct-total"),...ee?W.map(e=>(0,a.jsx)(r.Column,{header:e.label,style:N},`cct-h-${e.key}`)):[],(0,a.jsx)(r.Column,{header:"RMS LAMA",style:D},"cr-lama"),(0,a.jsx)(r.Column,{header:"RMS BARU",style:D},"cr-baru")]})]}),children:[(0,a.jsx)(r.Column,{body:e=>e.data.nomor||"",style:{minWidth:"2.6rem"},align:"center"},"no"),(0,a.jsx)(r.Column,{field:"nama",expander:!0,body:e=>(0,a.jsx)("span",{style:{fontWeight:e.data.has_children?700:500,whiteSpace:"nowrap"},children:e.data.nama}),style:{minWidth:"20rem",width:"auto",whiteSpace:"nowrap"}},"nama"),(0,a.jsx)(r.Column,{body:e=>(0,a.jsx)("strong",{style:{color:"#1d4ed8"},children:(e.data.ct??0).toLocaleString("id-ID")}),style:{minWidth:"4.5rem",background:"#eff6ff"},align:"center"},"ct-total"),(0,a.jsx)(r.Column,{body:e=>(0,a.jsx)("strong",{style:{color:"#b45309"},children:((e.data.cp_berjalan_belum_update??0)+(e.data.cp_tunggakan_belum_update??0)).toLocaleString("id-ID")}),style:{minWidth:"5rem",background:"#fffbeb"},align:"center"},"bu-total"),...ee?[(0,a.jsx)(r.Column,{body:e=>(0,a.jsx)("span",{children:(e.data.cp_berjalan_belum_update??0).toLocaleString("id-ID")}),style:{minWidth:"7.5rem",background:"#fffbeb"},align:"center"},"bu-aktual"),(0,a.jsx)(r.Column,{body:e=>(0,a.jsx)("span",{children:(e.data.cp_tunggakan_belum_update??0).toLocaleString("id-ID")}),style:{minWidth:"8.5rem",background:"#fffbeb"},align:"center"},"bu-tunggakan")]:[],(0,a.jsx)(r.Column,{body:e=>(0,a.jsx)("strong",{style:{color:"#7c3aed"},children:(e.data.limpah_eksternal??0).toLocaleString("id-ID")}),style:{minWidth:"6rem",background:"#f5f3ff"},align:"center"},"limpah-eksternal"),(0,a.jsx)(r.Column,{body:e=>(0,a.jsx)("span",{children:((e.data.cp_berjalan??0)+(e.data.cp_tunggakan??0)).toLocaleString("id-ID")}),style:{minWidth:"4.5rem"},align:"center"},"cp-gab"),(0,a.jsx)(r.Column,{body:e=>(0,a.jsx)("span",{style:{color:"#0891b2"},children:(e.data.cp_berjalan??0).toLocaleString("id-ID")}),style:{minWidth:"5.5rem"},align:"center"},"cpa-total"),...ee?I.map(e=>(0,a.jsx)(r.Column,{body:a=>M(a.data.cp_berjalan_rincian[e.key]),style:A,align:"center"},`cpa-${e.key}`)):[],(0,a.jsx)(r.Column,{body:e=>(0,a.jsx)("span",{style:{color:"#dc2626"},children:(e.data.cp_tunggakan??0).toLocaleString("id-ID")}),style:{minWidth:"5.5rem"},align:"center"},"cpt-total"),...ee?I.map(e=>(0,a.jsx)(r.Column,{body:a=>M(a.data.cp_tunggakan_rincian[e.key]),style:A,align:"center"},`cpt-${e.key}`)):[],(0,a.jsx)(r.Column,{body:e=>(0,a.jsxs)("span",{style:{color:"#64748b"},children:[(e.data.pr_lama??0).toFixed(2),"%"]}),style:{minWidth:"5rem"},align:"center"},"pr-lama"),(0,a.jsx)(r.Column,{body:e=>(0,a.jsxs)("span",{style:{color:"#0e7490"},children:[(e.data.pr??0).toFixed(2),"%"]}),style:{minWidth:"5rem"},align:"center"},"pr-baru"),(0,a.jsx)(r.Column,{body:e=>(0,a.jsx)("span",{children:((e.data.cc_aktual??0)+(e.data.cc_tunggakan??0)).toLocaleString("id-ID")}),style:{minWidth:"4.5rem"},align:"center"},"cc-gab"),(0,a.jsx)(r.Column,{body:e=>(0,a.jsx)("strong",{style:{color:"#16a34a"},children:(e.data.cc_aktual??0).toLocaleString("id-ID")}),style:{minWidth:"5.5rem"},align:"center"},"cca-total"),...ee?W.map(e=>(0,a.jsx)(r.Column,{body:a=>M(a.data.cc_aktual_rincian[e.key]),style:A,align:"center"},`cca-${e.key}`)):[],(0,a.jsx)(r.Column,{body:e=>(0,a.jsx)("strong",{style:{color:"#b45309"},children:(e.data.cc_tunggakan??0).toLocaleString("id-ID")}),style:{minWidth:"5.5rem"},align:"center"},"cct-total"),...ee?W.map(e=>(0,a.jsx)(r.Column,{body:a=>M(a.data.cc_tunggakan_rincian[e.key]),style:A,align:"center"},`cct-${e.key}`)):[],(0,a.jsx)(r.Column,{body:e=>(0,a.jsxs)("span",{style:{color:"#64748b"},children:[(e.data.cr_lama??0).toFixed(2),"%"]}),style:{minWidth:"5.5rem"},align:"center"},"cr-lama"),(0,a.jsx)(r.Column,{body:e=>(0,a.jsxs)("strong",{children:[(e.data.cr??0).toFixed(2),"%"]}),style:{minWidth:"5.5rem"},align:"center"},"cr-baru"),(0,a.jsx)(r.Column,{body:e=>(0,a.jsxs)("div",{style:{display:"inline-flex",alignItems:"center",gap:"0.45rem",whiteSpace:"nowrap"},children:[(0,a.jsx)("strong",{children:(e.data.indeks??0).toLocaleString("id-ID",{minimumFractionDigits:2,maximumFractionDigits:2})}),(0,a.jsx)(g.Tag,{value:`LEVEL ${e.data.level??"-"}`,severity:$(e.data.level),style:{borderRadius:"8px",padding:"0.15rem 0.45rem"}})]}),style:{minWidth:"9rem"},align:"center"},"indeks"),...ee?[(0,a.jsx)(r.Column,{body:e=>{let t=e.data;return t.jumlah_penduduk>0?(0,a.jsx)("span",{children:t.jumlah_penduduk.toLocaleString("id-ID")}):(0,a.jsx)("span",{style:{color:"#cbd5e1"},title:"Data penduduk belum tersedia",children:"-"})},style:{minWidth:"8rem"},align:"center"},"jumlah-penduduk"),(0,a.jsx)(r.Column,{body:e=>{let t=e.data;return null!=t.crime_rate?(0,a.jsx)("span",{style:{color:"#7c3aed"},children:t.crime_rate.toLocaleString("id-ID")}):(0,a.jsx)("span",{style:{color:"#cbd5e1"},title:"Data penduduk belum tersedia",children:"-"})},style:{minWidth:"6rem"},align:"center"},"crime-rate"),(0,a.jsx)(r.Column,{body:e=>{let t=e.data;return t.crime_clock?(0,a.jsx)("span",{style:{color:"#0891b2",whiteSpace:"nowrap"},children:t.crime_clock.label.replace("Selang ","")}):(0,a.jsx)("span",{style:{color:"#cbd5e1"},children:"-"})},style:{minWidth:"9rem"},align:"center"},"crime-clock")]:[]]})})]}),(0,a.jsx)("p",{style:{fontSize:"0.75rem",color:"#94a3b8",marginTop:"0.6rem"},children:'Tiap satker menampilkan rekap akumulatif (rollup seluruh sub-satker di bawahnya). Kolom kuning adalah rincian tambahan (per status penanganan & rumus lama) — klik "Tampilkan Detail" untuk menampilkan/menyembunyikan. Sub-satker dimuat saat baris dibuka.'}),
null,
(0,a.jsx)(h.Dialog,{header:"Cara Perhitungan Kinerja Perkara",visible:Z,onHide:()=>Q(!1),style:{width:"42rem",maxWidth:"96vw"},modal:!0,children:(0,a.jsxs)("div",{style:{display:"grid",gap:"0.9rem",fontSize:"0.85rem",color:"#334155"},children:[(0,a.jsxs)("div",{className:"box",style:{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:8,padding:"0.6rem 0.8rem"},children:[(0,a.jsx)("strong",{children:"Acuan tanggal periode"}),'— filter "Acuan" di atas tabel menentukan tanggal mana yang dipakai untuk memilih LP masuk periode [from, to]:',(0,a.jsxs)("ul",{style:{margin:"0.35rem 0 0",paddingLeft:"1.1rem"},children:[(0,a.jsxs)("li",{children:[(0,a.jsx)("strong",{children:"Keduanya (default)"})," — sesuai ketentuan resmi: CT pakai tanggal mulai penanganan, CC pakai tanggal selesai (dua tanggal berbeda, bisa tumpang tindih)."]}),(0,a.jsxs)("li",{children:[(0,a.jsx)("strong",{children:"Tanggal Mulai Penanganan (LP)"})," — kohort: hanya LP yang mulai ditangani pada periode ini, lalu dipilah masih CP atau sudah CC."]}),(0,a.jsxs)("li",{children:[(0,a.jsx)("strong",{children:"Tanggal Selesai (CC)"})," — kohort: hanya LP yang selesai (CC) pada periode ini; CT = total kohort tsb, CP selalu 0."]})]})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("strong",{children:"CT (Crime Total)"})," — jumlah perkara yang mulai ditangani satker pada periode laporan, ditambah seluruh perkara yang belum pernah mencapai status CC (tetap dihitung CT di periode manapun sampai benar-benar selesai). ",(0,a.jsx)("em",{children:'(definisi ini berlaku pada mode acuan "Keduanya"; pada mode "Tanggal Mulai"/"Tanggal Selesai" CT mengikuti kohort sesuai acuan yang dipilih, lihat kotak di atas.)'})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("strong",{children:"CP (Crime Processed)"})," — perkara yang masih diproses pada akhir periode. ",(0,a.jsx)("strong",{children:"CP Berjalan"})," = belum lewat jatuh tempo; ",(0,a.jsx)("strong",{children:"CP Tunggakan"})," = sudah lewat jatuh tempo. CP tidak masuk langsung ke rumus CR, murni informasi kesehatan jatuh-tempo."]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("strong",{children:"CC (Crime Clearance)"})," — perkara yang selesai pada periode laporan (tanggal selesai mengikuti tanggal dokumen penetapan CC, bukan tanggal sistem memproses). ",(0,a.jsx)("strong",{children:"CC Aktual"})," = selesai sebelum/tepat jatuh tempo; ",(0,a.jsx)("strong",{children:"CC Tunggakan"})," = selesai setelah lewat jatuh tempo."]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("strong",{children:"PR (Processed Rate)"})," — pasangan CP thd CR: indikator persentase yang berasal dari CP, sedangkan CR berasal dari CC. PR tidak masuk ke rumus CR maupun dasar Level/Indeks.",(0,a.jsx)("div",{style:{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:6,padding:"0.4rem 0.7rem",margin:"0.3rem 0",fontFamily:"monospace"},children:"PR Lama = CP / CT × 100%"}),(0,a.jsx)("div",{style:{background:"#f0fdff",border:"1px solid #a5f3fc",borderRadius:6,padding:"0.4rem 0.7rem",margin:"0.3rem 0",fontFamily:"monospace"},children:"PR Baru = (CP Aktual + CP Tunggakan) / (CT + CP Tunggakan) × 100%"}),(0,a.jsx)("span",{style:{fontSize:"0.8rem",color:"#64748b"},children:"Kalau CT + CP Tunggakan = 0, PR ditetapkan 0."})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("strong",{children:"Batas waktu per tingkat kesulitan"})," (jatuh tempo = tanggal mulai penanganan + batas hari):",(0,a.jsx)("table",{style:{width:"100%",marginTop:"0.4rem",borderCollapse:"collapse",fontSize:"0.82rem"},children:(0,a.jsx)("tbody",{children:[["Mudah (default)","30 hari"],["Sedang","60 hari"],["Sulit","90 hari"],["Sangat Sulit","120 hari"]].map(([e,t])=>(0,a.jsxs)("tr",{children:[(0,a.jsx)("td",{style:{padding:"0.25rem 0.5rem",border:"1px solid #e2e8f0"},children:e}),(0,a.jsx)("td",{style:{padding:"0.25rem 0.5rem",border:"1px solid #e2e8f0"},children:t})]},e))})})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("strong",{children:"Rumus CR Lama"})," (rekap status LP saat ini dari modul Anev CT/CC — dasar hitungnya beda dari CT/CC Kinerja Perkara di atas, ditampilkan sbg pembanding saja, tidak dipakai utk Level/Indeks):",(0,a.jsx)("div",{style:{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:6,padding:"0.4rem 0.7rem",margin:"0.3rem 0",fontFamily:"monospace"},children:"CR Lama = CC / CT × 100%"})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("strong",{children:"Rumus CR Baru"}),"(resmi TW IV 2025, dipakai jg utk Level & Indeks):",(0,a.jsx)("div",{style:{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:6,padding:"0.4rem 0.7rem",margin:"0.3rem 0",fontFamily:"monospace"},children:"CR Baru = (CC Aktual + CC Tunggakan) / (CT + CC Tunggakan) × 100%"}),(0,a.jsx)("span",{style:{fontSize:"0.8rem",color:"#64748b"},children:"CR boleh melebihi 100% (tidak dipotong utk tampilan, hanya dibatasi maks 100 khusus utk perhitungan Indeks)."})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("strong",{children:"Contoh CR Baru"})," (CC Aktual=80, CC Tunggakan=20, CT=100):",(0,a.jsxs)("div",{style:{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:6,padding:"0.4rem 0.7rem",margin:"0.3rem 0",fontFamily:"monospace"},children:["(80+20) / (100+20) = 0,8333 atau ",(0,a.jsx)("strong",{children:"83,33%"})]}),(0,a.jsx)("span",{style:{fontSize:"0.8rem",color:"#64748b"},children:"CR Baru dan CR Lama berasal dari data yang berbeda (lihat rumus masing-masing di atas), jadi tidak diperbandingkan langsung dengan angka yang sama."})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("strong",{children:"Level & Indeks"})," (interpolasi linear ",(0,a.jsx)("code",{children:"Indeks = A×CR + B"}),", dihitung dari CR Baru, CR dibatasi maks 100 khusus utk indeks):",(0,a.jsxs)("table",{style:{width:"100%",marginTop:"0.4rem",borderCollapse:"collapse",fontSize:"0.82rem"},children:[(0,a.jsx)("thead",{children:(0,a.jsxs)("tr",{children:[(0,a.jsx)("th",{style:{padding:"0.25rem 0.5rem",border:"1px solid #e2e8f0",textAlign:"left"},children:"Level"}),(0,a.jsx)("th",{style:{padding:"0.25rem 0.5rem",border:"1px solid #e2e8f0",textAlign:"left"},children:"Rentang CR"}),(0,a.jsx)("th",{style:{padding:"0.25rem 0.5rem",border:"1px solid #e2e8f0",textAlign:"left"},children:"Rentang Indeks"})]})}),(0,a.jsx)("tbody",{children:[["1","CR < 30%","1,00 – <2,00"],["2","30% – <55%","2,00 – <3,00"],["3","55% – <85%","3,00 – <4,25"],["4","85% – <95%","4,25 – <4,75"],["5","CR ≥ 95%","4,75 – 5,00"]].map(e=>(0,a.jsx)("tr",{children:e.map((e,t)=>(0,a.jsx)("td",{style:{padding:"0.25rem 0.5rem",border:"1px solid #e2e8f0"},children:e},t))},e[0]))})]})]}),(0,a.jsxs)("div",{style:{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:8,padding:"0.6rem 0.8rem",fontSize:"0.8rem",color:"#64748b"},children:[(0,a.jsx)("strong",{children:"Catatan penyesuaian:"}),'berbeda dari dokumen ketentuan aslinya, perkara yang belum pernah mencapai status CC tetap dihitung sebagai CT di periode manapun sedang dilihat (bukan cuma sekali di periode ia mulai lalu berpindah jadi CP Tunggakan). Data diperbarui otomatis tiap 30 menit dari tabel snapshot terpisah (tidak membebani transaksi Laporan Polisi); gunakan tombol "Refresh Sekarang" untuk data real-time.']}),(0,a.jsxs)("div",{children:[(0,a.jsx)("strong",{children:"Crime Rate"}),'— indikator jumlah kejahatan per 100.000 penduduk pada wilayah & periode yang dipilih (kartu "Tingkat Risiko Kejahatan"):',(0,a.jsx)("div",{style:{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:6,padding:"0.4rem 0.7rem",margin:"0.3rem 0",fontFamily:"monospace"},children:"Crime Rate = (CT / Jumlah Penduduk) × 100.000"}),(0,a.jsxs)("ul",{style:{margin:"0.35rem 0 0",paddingLeft:"1.1rem"},children:[(0,a.jsx)("li",{children:"CT memakai nilai CT pada scope/filter yang sama dengan tabel di atas."}),(0,a.jsx)("li",{children:"Jumlah penduduk dijumlah dari data yang diisi manual per satker (menu Struktur Satker) — isi hanya di SATU level per wilayah (biasanya Polres/Polsek), jangan diisi lagi di induk/anaknya untuk wilayah yang sama supaya tidak dobel-hitung."}),(0,a.jsx)("li",{children:"Dihitung presisi penuh, ditampilkan dibulatkan ke bilangan bulat terdekat (satuan Orang)."}),(0,a.jsx)("li",{children:'Kalau data penduduk kosong/0, tidak dibagi — kartu menampilkan "-" dan keterangan "Data penduduk belum tersedia".'})]})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("strong",{children:"Crime Clock"}),'— rata-rata selang waktu terjadinya satu kejahatan dalam periode yang dipilih (kartu "Indeks Waktu Kejahatan"):',(0,a.jsx)("div",{style:{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:6,padding:"0.4rem 0.7rem",margin:"0.3rem 0",fontFamily:"monospace"},children:"Crime Clock = Total Detik dalam Periode / CT"}),(0,a.jsxs)("ul",{style:{margin:"0.35rem 0 0",paddingLeft:"1.1rem"},children:[(0,a.jsxs)("li",{children:["Total detik periode dihitung inklusif kedua tanggal: jumlah hari × 86.400.",x?.periode_hari_inklusif?` Periode saat ini = ${x.periode_hari_inklusif} hari.`:""]}),(0,a.jsx)("li",{children:"Hasil dikonversi ke hari/jam/menit/detik; bagian bernilai 0 tidak ditampilkan, detik dibulatkan di tahap akhir."}),(0,a.jsx)("li",{children:'Kalau CT = 0, kartu menampilkan "Belum Ada Data Kejahatan".'})]})]})]})})]})}],64873)}]);