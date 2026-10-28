(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,71326,97778,e=>{"use strict";var a=e.i(71645),t=e.i(48264),n=e.i(1743),r=e.i(43456),i=e.i(71144),l=e.i(29168),s=e.i(28797),o=e.i(27259),d=e.i(73193);function c(){return(c=Object.assign.bind()).apply(null,arguments)}function u(e,a){(null==a||a>e.length)&&(a=e.length);for(var t=0,n=Array(a);t<a;t++)n[t]=e[t];return n}function m(e,a){return function(e){if(Array.isArray(e))return e}(e)||function(e,a){var t=null==e?null:"u">typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=t){var n,r,i,l,s=[],o=!0,d=!1;try{if(i=(t=t.call(e)).next,0===a){if(Object(t)!==t)return;o=!1}else for(;!(o=(n=i.call(t)).done)&&(s.push(n.value),s.length!==a);o=!0);}catch(e){d=!0,r=e}finally{try{if(!o&&null!=t.return&&(l=t.return(),Object(l)!==l))return}finally{if(d)throw r}}return s}}(e,a)||function(e,a){if(e){if("string"==typeof e)return u(e,a);var t=({}).toString.call(e).slice(8,-1);return"Object"===t&&e.constructor&&(t=e.constructor.name),"Map"===t||"Set"===t?Array.from(e):"Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?u(e,a):void 0}}(e,a)||function(){throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function p(e){return(p="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}var g=r.ComponentBase.extend({defaultProps:{__TYPE:"ConfirmDialog",accept:null,acceptClassName:null,acceptIcon:null,acceptLabel:null,appendTo:null,breakpoints:null,children:void 0,className:null,content:null,defaultFocus:"accept",footer:null,icon:null,message:null,onHide:null,reject:null,rejectClassName:null,rejectIcon:null,rejectLabel:null,tagKey:void 0,visible:void 0},css:{classes:{root:"p-confirm-dialog",message:"p-confirm-dialog-message",icon:"p-confirm-dialog-icon",acceptButton:"p-confirm-dialog-accept",rejectButton:function(e){var a=e.getPropValue;return(0,d.classNames)("p-confirm-dialog-reject",{"p-button-text":!a("rejectClassName")})}}}});function h(e,a){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);a&&(n=n.filter(function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable})),t.push.apply(t,n)}return t}function y(e){for(var a=1;a<arguments.length;a++){var t=null!=arguments[a]?arguments[a]:{};a%2?h(Object(t),!0).forEach(function(a){!function(e,a,t){var n;(n=function(e,a){if("object"!=p(e)||!e)return e;var t=e[Symbol.toPrimitive];if(void 0!==t){var n=t.call(e,a||"default");if("object"!=p(n))return n;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===a?String:Number)(e)}(a,"string"),(a="symbol"==p(n)?n:n+"")in e)?Object.defineProperty(e,a,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[a]=t}(e,a,t[a])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):h(Object(t)).forEach(function(a){Object.defineProperty(e,a,Object.getOwnPropertyDescriptor(t,a))})}return e}var f=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return(e=y(y({},e),{visible:void 0===e.visible||e.visible})).visible&&s.OverlayService.emit("confirm-dialog",e),{show:function(){var a=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};s.OverlayService.emit("confirm-dialog",y(y(y({},e),a),{visible:!0}))},hide:function(){s.OverlayService.emit("confirm-dialog",{visible:!1})}}},j=a.memo(a.forwardRef(function(e,u){var p,h,f,j,b,k,x,C=(0,l.useMergeProps)(),v=a.useContext(t.PrimeReactContext),S=g.getProps(e,v),T=m(a.useState(S.visible),2),w=T[0],P=T[1],R=m(a.useState(!1),2),_=R[0],L=R[1],I=a.useRef(null),W=a.useRef(!1),z=a.useRef(null),D=function(){var e=S.group;return I.current&&(e=I.current.group),Object.assign({},S,I.current,{group:e})},N=function(e){return D()[e]},A=function(e){for(var a=arguments.length,t=Array(a>1?a-1:0),n=1;n<a;n++)t[n-1]=arguments[n];return d.ObjectUtils.getPropValue(N(e),t)},M=N("acceptLabel")||(0,t.localeOption)("accept"),B=N("rejectLabel")||(0,t.localeOption)("reject"),O={props:S,state:{visible:w}},K=g.setMetaData(O),E=K.ptm,F=K.cx,$=K.isUnstyled;(0,r.useHandleStyle)(g.css.styles,$,{name:"confirmdialog"});var U=function(){W.current||(W.current=!0,A("accept"),J("accept"))},H=function(){W.current||(W.current=!0,A("reject"),J("reject"))},G=function(){D().group===S.group&&(P(!0),W.current=!1,z.current=document.activeElement)},J=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"cancel";w&&("string"!=typeof e&&(e="cancel"),P(!1),A("onHide",e),d.DomHandler.focus(z.current),z.current=null)},V=function(e){if(e.tagKey===S.tagKey&&(void 0===e.group||e.group===S.group)){var a=w!==e.visible;N("target")===e.target||S.target?a&&(I.current=e,e.visible?G():J()):(J(),I.current=e,L(!0))}};a.useEffect(function(){S.visible?G():J()},[S.visible]),a.useEffect(function(){return S.target||S.message||s.OverlayService.on("confirm-dialog",V),function(){s.OverlayService.off("confirm-dialog",V)}},[S.target]),(0,l.useUpdateEffect)(function(){_&&G()},[_]),(0,l.useUnmountEffect)(function(){s.OverlayService.off("confirm-dialog",V)}),a.useImperativeHandle(u,function(){return{props:S,confirm:V}});var Y=(p=D(),h=d.ObjectUtils.getJSXElement(N("message"),p),f=C({className:F("icon")},E("icon")),j=d.IconUtils.getJSXIcon(N("icon"),y({},f),{props:p}),b=function(){var e=N("defaultFocus"),t=(0,d.classNames)("p-confirm-dialog-accept",N("acceptClassName")),r=(0,d.classNames)("p-confirm-dialog-reject",{"p-button-text":!N("rejectClassName")},N("rejectClassName")),i=C({label:B,autoFocus:"reject"===e,icon:N("rejectIcon"),className:(0,d.classNames)(N("rejectClassName"),F("rejectButton",{getPropValue:N})),onClick:H,pt:E("rejectButton"),unstyled:S.unstyled,__parentMetadata:{parent:O}},E("rejectButton")),l=C({label:M,autoFocus:void 0===e||"accept"===e,icon:N("acceptIcon"),className:(0,d.classNames)(N("acceptClassName"),F("acceptButton")),onClick:U,pt:E("acceptButton"),unstyled:S.unstyled,__parentMetadata:{parent:O}},E("acceptButton")),s=a.createElement(a.Fragment,null,a.createElement(n.Button,i),a.createElement(n.Button,l));if(N("footer")){var o={accept:U,reject:H,acceptClassName:t,rejectClassName:r,acceptLabel:M,rejectLabel:B,element:s,props:D()};return d.ObjectUtils.getJSXElement(N("footer"),o)}return s}(),k=C({className:F("message")},E("message")),x=C({visible:w,className:(0,d.classNames)(N("className"),F("root")),footer:b,onHide:J,breakpoints:N("breakpoints"),pt:p.pt,unstyled:S.unstyled,appendTo:N("appendTo"),__parentMetadata:{parent:O}},g.getOtherProps(p)),a.createElement(i.Dialog,c({},x,{content:null==e?void 0:e.content}),j,a.createElement("span",k,h)));return a.createElement(o.Portal,{element:Y,appendTo:N("appendTo")})}));j.displayName="ConfirmDialog",e.s(["ConfirmDialog",0,j,"confirmDialog",0,f],97778),e.s(["confirmAction",0,function(e,a){return new Promise(t=>{let n=!1,r=e=>{n||(n=!0,t(e))};f({message:e,header:a?.header||"Konfirmasi",icon:a?.danger?"pi pi-exclamation-triangle":"pi pi-question-circle",acceptLabel:a?.acceptLabel||"Ya, lanjutkan",rejectLabel:"Batal",acceptClassName:a?.danger?"p-button-danger":void 0,accept:()=>r(!0),reject:()=>r(!1),onHide:()=>r(!1)})})}],71326)},26091,e=>{"use strict";let a=(0,e.i(56420).default)("file-text",[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]);e.s(["FileText",0,a],26091)},53138,e=>{"use strict";let a=(0,e.i(56420).default)("triangle-alert",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);e.s(["AlertTriangle",0,a],53138)},93819,e=>{"use strict";let a=(0,e.i(56420).default)("file-spreadsheet",[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M8 13h2",key:"yr2amv"}],["path",{d:"M14 13h2",key:"un5t4a"}],["path",{d:"M8 17h2",key:"2yhykz"}],["path",{d:"M14 17h2",key:"10kma7"}]]);e.s(["FileSpreadsheet",0,a],93819)},71407,e=>{"use strict";var a=e.i(71645),t=e.i(44506);function n(){return(n=Object.assign.bind()).apply(null,arguments)}var r=a.memo(a.forwardRef(function(e,r){var i=t.IconBase.getPTI(e);return a.createElement("svg",n({ref:r,width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",xmlns:"http://www.w3.org/2000/svg"},i),a.createElement("path",{d:"M13.2222 7.77778H0.777778C0.571498 7.77778 0.373667 7.69584 0.227806 7.54998C0.0819442 7.40412 0 7.20629 0 7.00001C0 6.79373 0.0819442 6.5959 0.227806 6.45003C0.373667 6.30417 0.571498 6.22223 0.777778 6.22223H13.2222C13.4285 6.22223 13.6263 6.30417 13.7722 6.45003C13.9181 6.5959 14 6.79373 14 7.00001C14 7.20629 13.9181 7.40412 13.7722 7.54998C13.6263 7.69584 13.4285 7.77778 13.2222 7.77778Z",fill:"currentColor"}))}));r.displayName="MinusIcon",e.s(["MinusIcon",0,r])},64873,e=>{"use strict";function eMatchG(k,g){return g==="REVIEW"?!k:(g===k||(g==="KRIMUM"&&(k==="TIPIDUM"||k==="TIPIDPPAPPO"||k==="KRIMUM"))||(g==="KRIMSUS"&&(k==="TIPIDEKSUS"||k==="TIPIDKOR"||k==="TIPIDTER"||k==="TIPIDSIBER"||k==="KRIMSUS"))||(g==="NARKOBA"&&(k==="TIPIDNARKOBA"||k==="NARKOBA")));}var a=e.i(43476),t=e.i(71645),n=e.i(55050),r=e.i(24718),i=function(){};i.displayName="ColumnGroup";var l=e.i(48264),s=e.i(29168),o=e.i(43456),d=e.i(73193),c=o.ComponentBase.extend({defaultProps:{__TYPE:"Row",style:null,className:null,children:void 0},getCProp:function(e,a){return d.ObjectUtils.getComponentProp(e,a,c.defaultProps)}}),u=function(e){var a=(0,s.useMergeProps)(),n=t.useContext(l.PrimeReactContext),r=c.getProps(e,n),i=c.setMetaData({props:r}).ptm,o=a({className:r.className,style:r.style},c.getOtherProps(r),i("root"));return t.createElement("tr",o,r.children)};u.displayName="Row";var m=e.i(44080),p=e.i(1743),g=e.i(53729),h=e.i(71144),y=e.i(85118),f=e.i(97778),j=e.i(68242),b=e.i(48314),k=e.i(71028),x=e.i(56420);let C=(0,x.default)("info",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]]);var v=e.i(41120),S=e.i(53138),T=e.i(93819),w=e.i(26091);let P=(0,x.default)("list-filter",[["path",{d:"M2 5h20",key:"1fs1ex"}],["path",{d:"M6 12h12",key:"8npq4p"}],["path",{d:"M9 19h6",key:"456am0"}]]);var R=e.i(54858),_=e.i(71326),kAuth=e.i(38036);let L={ct:0,ct_model_a:0,ct_model_b:0,cp_berjalan:0,cp_tunggakan:0,cc_aktual:0,cc_tunggakan:0,belum_kesulitan:0,cp_berjalan_rincian:{},cp_tunggakan_rincian:{},cc_aktual_rincian:{},cc_tunggakan_rincian:{}},I=[{key:"lidik",label:"LIDIK"},{key:"sidik",label:"SIDIK"},{key:"spdp",label:"KIRIM SPDP"},{key:"thp1",label:"THP-1"},{key:"p19",label:"P-19"},{key:"p21",label:"P-21"}],W=[{key:"sp2lid",label:"SP2LID"},{key:"perma",label:"PERMA"},{key:"sp3",label:"SP3"},{key:"thp2",label:"THP-2"}],z={background:"#16324f",color:"#f8fafc",fontWeight:800,fontSize:"0.74rem",textAlign:"center",whiteSpace:"nowrap"},D={background:"#1e3f63",color:"#f1f5f9",fontWeight:700,fontSize:"0.7rem",textAlign:"center",whiteSpace:"nowrap"},N={background:"#244b75",color:"#e2e8f0",fontWeight:700,fontSize:"0.68rem",textAlign:"center",whiteSpace:"nowrap"},A={minWidth:"3.6rem",background:"#eff6ff"};function M(e){return(0,a.jsx)("span",{style:{color:e?"#92400e":"#e2e8f0",fontWeight:e?700:400},children:e||"·"})}let B=[{label:"Keduanya (CT saat mulai, CC saat selesai)",value:"both"},{label:"Tanggal Mulai Penanganan (LP)",value:"mulai"},{label:"Tanggal Selesai (CC)",value:"selesai"}],O={both:"Sesuai ketentuan resmi: CT dihitung dari tanggal mulai penanganan, CC dari tanggal selesai — dua tanggal berbeda bisa dipakai bersamaan dalam satu periode.",mulai:"Kohort berdasar tanggal mulai penanganan: hanya LP yang MULAI ditangani pada periode ini yang dihitung, lalu dipilah apakah sudah CC (Aktual/Tunggakan) atau masih CP (Berjalan/Tunggakan).",selesai:"Kohort berdasar tanggal selesai (CC): hanya LP yang SELESAI (CC) pada periode ini yang dihitung — CT di sini = total LP yang selesai pada periode, dipilah CC Aktual/Tunggakan. CP selalu 0 pada mode ini."};function K(e){let a=e?.data??e,t=a?.data??a;return Array.isArray(t)?t:[]}function E(e){return{key:e.kode,data:e,leaf:!e.has_children}}function F(e,a,t){return e.map(e=>e.key===a?{...e,children:t}:e.children&&e.children.length?{...e,children:F(e.children,a,t)}:e)}function $(e){return e<=1?"danger":2===e?"warning":3===e?"info":"success"}function U(e){return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}`}e.s(["default",0,function(){let e,kRole=(0,kAuth.deriveRoles)((0,kAuth.getUser)()),kCanRefresh=kRole.isSuperadmin||kRole.isAdminBinops,l=(0,t.useRef)(null),[s,o]=(0,t.useState)([]),[d,c]=(0,t.useState)(L),[x,H]=(0,t.useState)(null),[G,J]=(0,t.useState)(!0),[V,Y]=(0,t.useState)(!1),[X,q]=(0,t.useState)({}),[Z,Q]=(0,t.useState)(!1),[ee,ea]=(0,t.useState)(!1),[et,en]=(0,t.useState)(!1),[er,ei]=(0,t.useState)(!1),[el,es]=(0,t.useState)(()=>{let e=new Date;return U(new Date(e.getFullYear(),0,1))}),[eo,ed]=(0,t.useState)(()=>{let e=new Date;return U(new Date(e.getFullYear(),11,31))}),[ec,eu]=(0,t.useState)("both"),[em,ep]=(0,t.useState)([]),[eg,eh]=(0,t.useState)([]),[ey,ef]=(0,t.useState)([]),[ej,eb]=(0,t.useState)([]),[ek,ex]=(0,t.useState)([]),[eC,ev]=(0,t.useState)([]),[eKG,eSetKG]=(0,t.useState)([]),[eScope,eSetScope]=(0,t.useState)("scoped"),[eScopeOpts,eSetScopeOpts]=(0,t.useState)([]),[eScopeSatkerId,eSetScopeSatkerId]=(0,t.useState)(13),[eFD,eSetFD]=(0,t.useState)("INTERNAL_RESERSE"),[eModel,eSetModel]=(0,t.useState)(""),[eClosure,eSetClosure]=(0,t.useState)(""),[eBucket,eSetBucket]=(0,t.useState)("age"),[satkerPopOpen,setSatkerPopOpen]=(0,t.useState)(!1),[crimePopOpen,setCrimePopOpen]=(0,t.useState)(!1),[paramPopOpen,setParamPopOpen]=(0,t.useState)(!1),
[unifiedFilterOpen,setUnifiedFilterOpen]=(0,t.useState)(!1),
[unifiedFilterTab,setUnifiedFilterTab]=(0,t.useState)(0),
[exportMenuOpen,setExportMenuOpen]=(0,t.useState)(!1),
[pdfModalOpen,setPdfModalOpen]=(0,t.useState)(!1),
[pdfExpanded,setPdfExpanded]=(0,t.useState)(!1),
[pdfOrientation,setPdfOrientation]=(0,t.useState)("landscape"),
[pdfSatkerName,setPdfSatkerName]=(0,t.useState)("BARESKRIM POLRI DAN POLDA JAJARAN"),
[pdfPeriode,setPdfPeriode]=(0,t.useState)("TAHUN 2026"),
[pdfCrimeFilter,setPdfCrimeFilter]=(0,t.useState)(""),
[pdfWaktuCetak,setPdfWaktuCetak]=(0,t.useState)(""),
[pdfDataPer,setPdfDataPer]=(0,t.useState)(""),[kpTip,setKpTip]=(0,t.useState)(null),[kpExpandedPills,setKpExpandedPills]=(0,t.useState)({}),[kpExpandAllPills,setKpExpandAllPills]=(0,t.useState)(!1),[lpModalOpen,setLpModalOpen]=(0,t.useState)(!1),[lpModalExpanded,setLpModalExpanded]=(0,t.useState)(!1),[lpModalTarget,setLpModalTarget]=(0,t.useState)(null),[lpModalItems,setLpModalItems]=(0,t.useState)([]),[lpModalLoading,setLpModalLoading]=(0,t.useState)(!1),[lpModalPage,setLpModalPage]=(0,t.useState)(1),[lpModalTotal,setLpModalTotal]=(0,t.useState)(0),[lpModalTotalPages,setLpModalTotalPages]=(0,t.useState)(0),[lpModalSearchInput,setLpModalSearchInput]=(0,t.useState)(""),[activeKelompokCrime,setActiveKelompokCrime]=(0,t.useState)("ALL"),[activeTipidCrime,setActiveTipidCrime]=(0,t.useState)("ALL"),[kpPeriodOpen,setKpPeriodOpen]=(0,t.useState)(!1),
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
[kpPeriodLabel,setKpPeriodLabel]=(0,t.useState)(()=>"Tahun "+new Date().getFullYear()),[eAP,eSetAP]=(0,t.useState)(()=>({from:el,to:eo,mode:ec,jenis:[],golongan:[],iccs:[],kelompok:[],scope:"scoped",scopeSatkerId:13,functionDomain:"INTERNAL_RESERSE",modelLp:"",closureReason:"",bucketMode:"age"})),eS=(0,t.useMemo)(()=>({visibility:eAP.scope,scope_satker_id:"scoped"===eAP.scope&&eAP.scopeSatkerId?eAP.scopeSatkerId:void 0,from:eAP.from,to:eAP.to,mode:eAP.mode,jenis_kejahatan_id:eAP.jenis.length?eAP.jenis.join(","):void 0,golongan_id:eAP.golongan.length?eAP.golongan.join(","):void 0,iccs_kategori_id:eAP.iccs.length?eAP.iccs.join(","):void 0,kelompok_hitung:eAP.kelompok.length?eAP.kelompok.join(","):void 0,functionDomain:eAP.functionDomain,organizationDomain:"INTERNAL_POLRI",modelLp:eAP.modelLp||void 0,closureReason:eAP.closureReason||void 0,bucketMode:eAP.bucketMode}),[eAP]),eJenisOptions=(0,t.useMemo)(()=>eg.filter(e=>(!ey.length||ey.some(a=>e.golonganIds.includes(a)))&&(!ek.length||ek.includes(e.iccsId))&&(!eKG.length||eKG.some(g=>eMatchG(e.kelompok,g)))),[eg,ey,ek,eKG]),eGolOptions=(0,t.useMemo)(()=>ej.filter(e=>eg.some(a=>(!em.length||em.includes(a.value))&&(!ek.length||ek.includes(a.iccsId))&&(!eKG.length||eKG.some(g=>eMatchG(a.kelompok,g)))&&a.golonganIds.includes(e.value))),[ej,eg,em,ek,eKG]),eIccsOptions=(0,t.useMemo)(()=>eC.filter(e=>eg.some(a=>(!em.length||em.includes(a.value))&&(!ey.length||ey.some(e=>a.golonganIds.includes(e)))&&(!eKG.length||eKG.some(g=>eMatchG(a.kelompok,g)))&&a.iccsId===e.value)),[eC,eg,em,ey,eKG]),eGroupOptions=(0,t.useMemo)(()=>[{label:"KRIMUM (Tipidum, Tipidppappo)",value:"KRIMUM"},{label:"KRIMSUS (Tipideksus, Tipidkor, Tipidter, Tipidsiber)",value:"KRIMSUS"},{label:"NARKOBA (Tipidnarkoba)",value:"NARKOBA"},{label:"TIPIDUM",value:"TIPIDUM"},{label:"TIPIDPPAPPO",value:"TIPIDPPAPPO"},{label:"TIPIDEKSUS",value:"TIPIDEKSUS"},{label:"TIPIDKOR",value:"TIPIDKOR"},{label:"TIPIDTER",value:"TIPIDTER"},{label:"TIPIDSIBER",value:"TIPIDSIBER"},{label:"TIPIDNARKOBA",value:"TIPIDNARKOBA"},{label:"Review Manual",value:"REVIEW"}].filter(e=>eg.some(a=>(!em.length||em.includes(a.value))&&(!ey.length||ey.some(e=>a.golonganIds.includes(e)))&&(!ek.length||ek.includes(a.iccsId))&&eMatchG(a.kelompok,e.value))),[eg,em,ey,ek]);(0,t.useEffect)(()=>{R.apiAuth.get("/bdb/kinerja-perkara/meta/jenis-kejahatan").then(e=>{eh((e.data?.data||[]).map(e=>{let a=String(e.keterangan||""),t=a.trim().split(/\s+/);return{label:t.slice(0,5).join(" ")+(t.length>5?"…":""),fullLabel:a,value:Number(e.id),golonganId:Number(e.golongan_id),golonganIds:e.is_ppappo?[Number(e.golongan_id),5]:[Number(e.golongan_id)],iccsId:Number(e.iccs_kategori_id),kelompok:e.kelompok?String(e.kelompok):null}}))}).catch(()=>{}),R.apiAuth.get("/master/golongan-kejahatan",{params:{row:20,page:1}}).then(e=>{let a=K(e.data);a.sort((e,a)=>e.id-a.id),eb(a.map(e=>({label:e.name,value:Number(e.id)})))}).catch(()=>{}),R.apiAuth.get("/master/iccs-kategori",{params:{row:50,page:1}}).then(e=>{let a=K(e.data);a.sort((e,a)=>e.kode-a.kode),ev(a.map(e=>({label:`${e.kode}. ${e.nama}`,value:Number(e.id)})))}).catch(()=>{}),R.apiAuth.get("/bdb/kinerja-perkara/meta/scope-options").then(e=>{let a=e.data?.data||{},n=Array.isArray(a.options)?a.options:[],defVis=a.defaultVisibility||"scoped",r=a.defaultRegionId!=null?Number(a.defaultRegionId):(n.length?Number(n[0].value):null);eSetScopeOpts(n),eSetScopeSatkerId(r),eSetScope(defVis),eSetAP(prev=>({...prev,scope:defVis,scopeSatkerId:"scoped"===defVis?r:null}))}).catch(()=>{})},[]);
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
  setSatkerPopOpen(!1);
  setCrimePopOpen(!1);
  setParamPopOpen(!1);
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

  es(from);
  ed(to);
  setKpPeriodLabel(label);
  setKpPeriodOpen(!1);
  kpCacheInvalidateAll();
  eSetAP({from:from,to:to,mode:ec,jenis:[...em],golongan:[...ey],iccs:[...ek],kelompok:[...eKG],scope:eScope,scopeSatkerId:"scoped"===eScope?eScopeSatkerId:null,functionDomain:eFD,modelLp:eModel,closureReason:eClosure,bucketMode:eBucket})
}


const KP_CACHE_TTL_MS=24e4;
const KP_CACHE_PREFIX="bdb-kinerja-v4:";

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

async function ew(e){let a=e.node;if(!a.children&&!a.leaf)try{let e=await R.apiAuth.get("/bdb/kinerja-perkara/rekap",{params:{...eS,parent:a.key}}),t=(e.data?.data?.nodes||[]).map(E);o(e=>F(e,a.key,t))}catch{l.current?.show({severity:"error",summary:"Gagal",detail:"Gagal memuat sub-satker."})}}async function eP(){if(await (0,_.confirmAction)("Menghitung ulang data kinerja perkara dari seluruh LP sekarang akan membebani proses lain di server untuk beberapa saat. Lanjutkan?",{header:"Refresh Sekarang",danger:!0,acceptLabel:"Ya, Refresh"})){Y(!0);try{await R.apiAuth.post("/bdb/kinerja-perkara/refresh"),l.current?.show({severity:"success",summary:"Diperbarui",detail:"Data kinerja perkara terkini sudah tersedia."}),kpCacheInvalidateAll(),await kpForceReload()}catch(e){l.current?.show({severity:"error",summary:"Gagal",detail:e.response?.data?.message||"Gagal me-refresh data"})}finally{Y(!1)}}}async function eExportXlsx(){en(!0);try{let a=await R.apiAuth.get("/bdb/kinerja-perkara/rekap/export.xlsx",{params:eS,responseType:"blob"}),t=URL.createObjectURL(a.data),n=document.createElement("a");n.href=t,n.download=generateCasHashFilename("xlsx"),n.click(),URL.revokeObjectURL(t)}catch{l.current?.show({severity:"warn",summary:"Info",detail:"Gagal mengunduh Excel (.xlsx). Mengunduh versi CSV mentah..."}),await eR()}finally{en(!1)}}async function eR(){en(!0);try{let a=await R.apiAuth.get("/bdb/kinerja-perkara/rekap/export.csv",{params:eS,responseType:"blob"}),t=URL.createObjectURL(a.data),n=document.createElement("a");n.href=t,n.download=generateCasHashFilename("csv"),n.click(),URL.revokeObjectURL(t)}catch{l.current?.show({severity:"error",summary:"Gagal",detail:"Gagal mengunduh CSV."})}finally{en(!1)}}







function generateCasHashFilename(ext){
  let arr = new Uint8Array(8);
  if (typeof window !== "undefined" && window.crypto && window.crypto.getRandomValues) {
    window.crypto.getRandomValues(arr);
  } else {
    for (let i = 0; i < 8; i++) arr[i] = Math.floor(Math.random() * 256);
  }
  let hex = Array.from(arr, b => b.toString(16).padStart(2, "0")).join("");
  return "cas_" + hex + (ext ? "." + ext : "");
}

const KP_INDO_MONTHS = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

function formatIndoDateTime(dt){
  if(!dt) return "—";
  let d = typeof dt === "string" ? new Date(dt) : dt;
  if(isNaN(d.getTime())) return String(dt);
  let dd = d.getDate();
  let mm = KP_INDO_MONTHS[d.getMonth()];
  let yy = d.getFullYear();
  let hh = String(d.getHours()).padStart(2, "0");
  let mi = String(d.getMinutes()).padStart(2, "0");
  return `${dd} ${mm} ${yy} pukul ${hh}.${mi} WIB`;
}

function getPdfTitleLines(orientation, satker, periode, crime){
  let sUpper = (satker || "BARESKRIM POLRI DAN POLDA JAJARAN").toUpperCase().trim();
  if(sUpper.includes("SEMUA JAJARAN") || sUpper.includes("MABES & SELURUH POLDA") || sUpper === "NASIONAL" || sUpper === "BARESKRIM POLRI DAN JAJARAN" || sUpper === "BARESKRIM POLRI"){
    sUpper = "BARESKRIM POLRI DAN POLDA JAJARAN";
  }
  let pUpper = (periode || "TAHUN 2026").toUpperCase().trim();
  if(!pUpper.startsWith("PERIODE")){
    pUpper = "PERIODE " + pUpper;
  }
  let cUpper = (crime || "").toUpperCase().trim();

  let lines = [];
  if(orientation === "landscape"){
    lines.push(`LAMPIRAN KINERJA PERKARA SATKER ${sUpper}`);
    if(cUpper){
      let combined = `${pUpper} • ${cUpper}`;
      if(combined.length <= 65){
        lines.push(combined);
      } else {
        lines.push(pUpper);
        lines.push(cUpper);
      }
    } else {
      lines.push(pUpper);
    }
  } else {
    lines.push("LAMPIRAN KINERJA PERKARA SATKER");
    lines.push(sUpper);
    lines.push(pUpper);
    if(cUpper){
      lines.push(cUpper);
    }
  }
  return lines;
}

function openPdfModal(){
  setExportMenuOpen(!1);
  let satker = "BARESKRIM POLRI DAN POLDA JAJARAN";
  if(eScope==="scoped"&&eScopeSatkerId){
    let sObj=eScopeOpts.find(x=>x.value===eScopeSatkerId);
    if(sObj&&sObj.label){
      let lbl = sObj.label.toUpperCase().trim();
      if(lbl === "BARESKRIM POLRI" || eScopeSatkerId === 13 || lbl.includes("SEMUA JAJARAN") || lbl.includes("MABES & SELURUH POLDA") || lbl === "NASIONAL"){
        satker = "BARESKRIM POLRI DAN POLDA JAJARAN";
      } else {
        satker = lbl + (lbl.includes("POLDA") && !lbl.includes("JAJARAN") ? " DAN JAJARAN" : "");
      }
    }
  } else {
    satker = "BARESKRIM POLRI DAN POLDA JAJARAN";
  }
  if(satker.includes("SEMUA JAJARAN") || satker.includes("MABES & SELURUH POLDA") || satker === "NASIONAL" || satker === "BARESKRIM POLRI DAN JAJARAN"){
    satker = "BARESKRIM POLRI DAN POLDA JAJARAN";
  }

  let crime = "";
  let curAP = eAP || {};
  let curJenis = (curAP.jenis && curAP.jenis.length > 0) ? curAP.jenis : (em || []);
  let curGol = (curAP.golongan && curAP.golongan.length > 0) ? curAP.golongan : (ey || []);
  let curKel = (curAP.kelompok && curAP.kelompok.length > 0) ? curAP.kelompok : (eKG || []);
  let curIccs = (curAP.iccs && curAP.iccs.length > 0) ? curAP.iccs : (ek || []);

  if(curJenis.length > 0){
    let names = curJenis.map(id => {
      let item = (eg || []).find(x => x.value === id);
      return item ? (item.fullLabel || item.label) : id;
    });
    crime = "KEJAHATAN SPESIFIK: " + names.join(", ").toUpperCase();
  } else if(curGol.length > 0){
    let names = curGol.map(id => {
      let item = (ej || []).find(x => x.value === id);
      return item ? item.label : id;
    });
    let gStr = names.join(", ").toUpperCase();
    crime = gStr.startsWith("GOLONGAN") ? gStr : ("GOLONGAN " + gStr);
  } else if(curKel.length > 0){
    crime = "KELOMPOK: " + curKel.join(", ").toUpperCase();
  } else if(curIccs.length > 0){
    let names = curIccs.map(id => {
      let item = (eC || []).find(x => x.value === id);
      return item ? item.label : id;
    });
    crime = "ICCS: " + names.join(", ").toUpperCase();
  }

  let per = (kpPeriodLabel || "Tahun 2026").trim();
  let waktu = formatIndoDateTime(new Date());
  let dPer = x?.last_refreshed_at ? formatIndoDateTime(x.last_refreshed_at) : waktu;

  setPdfSatkerName(satker);
  setPdfPeriode(per);
  setPdfCrimeFilter(crime);
  setPdfWaktuCetak(waktu);
  setPdfDataPer(dPer);
  setPdfOrientation("landscape");
  setPdfExpanded(!1);
  setPdfModalOpen(!0);
}

function kpFlattenNodes(arr, depth=0){
  let out=[];
  if(!Array.isArray(arr)) return out;
  for(let it of arr){
    if(!it||!it.data) continue;
    out.push({...it.data, depth});
    if(Array.isArray(it.children)&&it.children.length>0){
      out.push(...kpFlattenNodes(it.children, depth+1));
    }
  }
  return out;
}

function getTableDataForPrint(arr, d){
  let rows = [];
  let totalData = null;
  if(Array.isArray(arr) && arr.length === 1 && Array.isArray(arr[0].children) && arr[0].children.length > 0){
    totalData = arr[0].data;
    function flatten(list, depth=0, prefix=""){
      let out=[];
      for(let i=0; i<list.length; i++){
        let it = list[i];
        if(!it || !it.data) continue;
        let numStr = depth===0 ? (i+1)+"." : (prefix+(i+1)+".");
        out.push({...it.data, nomor: numStr, depth});
        if(Array.isArray(it.children) && it.children.length > 0){
          out.push(...flatten(it.children, depth+1, numStr));
        }
      }
      return out;
    }
    rows = flatten(arr[0].children);
  } else {
    rows = kpFlattenNodes(arr);
    let rootRows = rows.filter(r => r.depth === 0);
    let sumCt = rootRows.reduce((a, r) => a + (r.ct || 0), 0);
    let sumBu = rootRows.reduce((a, r) => a + ((r.cp_berjalan_belum_update || 0) + (r.cp_tunggakan_belum_update || 0)), 0);
    let sumLim = rootRows.reduce((a, r) => a + (r.limpah_eksternal || 0), 0);
    let sumCp = rootRows.reduce((a, r) => a + ((r.cp_berjalan || 0) + (r.cp_tunggakan || 0)), 0);
    let sumCc = rootRows.reduce((a, r) => a + ((r.cc_aktual || 0) + (r.cc_tunggakan || 0)), 0);
    let calcPr = sumCt > 0 ? (sumCp / sumCt * 100) : 0;
    let calcCr = sumCp > 0 ? (sumCc / sumCp * 100) : 0;
    totalData = {
      ct: sumCt || d?.ct || 0,
      cp_berjalan_belum_update: sumBu || (d?.cp_berjalan_belum_update ?? 0),
      cp_tunggakan_belum_update: 0,
      limpah_eksternal: sumLim || (d?.limpah_eksternal ?? 0),
      cp_berjalan: sumCp || (d?.cp_berjalan ?? 0),
      cp_tunggakan: 0,
      pr: d?.pr != null && d.pr > 0 ? d.pr : calcPr,
      cc_aktual: sumCc || (d?.cc_aktual ?? 0),
      cc_tunggakan: 0,
      cr: d?.cr != null && d.cr > 0 ? d.cr : calcCr,
      indeks: d?.indeks ?? 0,
      level: d?.level || null
    };
  }
  return { rows, totalData };
}

function kpPrintPdf(){
  let { rows, totalData } = getTableDataForPrint(s, d);
  let rowsHtml = rows.map((r, rIdx)=>{
    let ind = r.depth > 0 ? `padding-left:${r.depth * 14 + 6}px;font-style:italic;` : "font-weight:500;";
    let noStr = r.nomor || "";
    let ctV = (r.ct??0).toLocaleString("id-ID");
    let buV = ((r.cp_berjalan_belum_update??0)+(r.cp_tunggakan_belum_update??0)).toLocaleString("id-ID");
    let limV = (r.limpah_eksternal??0).toLocaleString("id-ID");
    let cpV = ((r.cp_berjalan??0)+(r.cp_tunggakan??0)).toLocaleString("id-ID");
    let prV = ((r.pr??0)).toFixed(2)+"%";
    let ccV = ((r.cc_aktual??0)+(r.cc_tunggakan??0)).toLocaleString("id-ID");
    let crV = ((r.cr??0)).toFixed(2)+"%";
    let idxV = (r.indeks??0).toLocaleString("id-ID",{minimumFractionDigits:2,maximumFractionDigits:2});
    let lvlV = r.level ? `LV ${r.level}` : "-";
    let bgRow = rIdx % 2 === 1 ? "background:#f8fafc;" : "background:#ffffff;";
    return `<tr style="${bgRow}"><td style="text-align:center;width:30px;color:#0f172a;">${noStr}</td><td style="text-align:left;color:#0f172a;${ind}">${r.nama||"-"}</td><td style="text-align:right;font-weight:bold;color:#1d4ed8;">${ctV}</td><td style="text-align:right;color:#0f172a;">${buV}</td><td style="text-align:right;color:#0f172a;">${limV}</td><td style="text-align:right;color:#0f172a;">${cpV}</td><td style="text-align:center;color:#0f172a;">${prV}</td><td style="text-align:right;font-weight:bold;color:#15803d;">${ccV}</td><td style="text-align:center;font-weight:bold;color:#0f172a;">${crV}</td><td style="text-align:center;white-space:nowrap;color:#0f172a;"><strong>${idxV}</strong> (${lvlV})</td></tr>`;
  }).join("");

  let totCt = (totalData?.ct??0).toLocaleString("id-ID");
  let totBu = ((totalData?.cp_berjalan_belum_update??0)+(totalData?.cp_tunggakan_belum_update??0)).toLocaleString("id-ID");
  let totLim = (totalData?.limpah_eksternal??0).toLocaleString("id-ID");
  let totCp = ((totalData?.cp_berjalan??0)+(totalData?.cp_tunggakan??0)).toLocaleString("id-ID");
  let totPr = ((totalData?.pr??0)).toFixed(2)+"%";
  let totCc = ((totalData?.cc_aktual??0)+(totalData?.cc_tunggakan??0)).toLocaleString("id-ID");
  let totCr = ((totalData?.cr??0)).toFixed(2)+"%";
  let totIdx = (totalData?.indeks??0).toLocaleString("id-ID",{minimumFractionDigits:2,maximumFractionDigits:2});
  let totLvl = totalData?.level ? `LV ${totalData.level}` : "-";

  let tLines = getPdfTitleLines(pdfOrientation, pdfSatkerName, pdfPeriode, pdfCrimeFilter);
  let titleLinesHtml = tLines.map(line => `<div class="sheet-title-line">${line}</div>`).join("");

  let footerDataPer = pdfDataPer || "—";
  let footerWaktuCetak = pdfWaktuCetak || "—";
  let footerFontSize = pdfOrientation === "portrait" ? "6.8pt" : "8.5pt";

  let pdfDocTitle = generateCasHashFilename();
  let html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${pdfDocTitle}</title><style>@page{size:A4 ${pdfOrientation||"landscape"};margin-top:2cm;margin-right:2cm;margin-bottom:2cm;margin-left:3cm;@bottom-left{content:"Sumber Data: CAS Bareskrim Polri \\2022  Data per: ${footerDataPer} \\2022  Diambil: ${footerWaktuCetak}";font-size:${footerFontSize};font-family:Arial,sans-serif;color:#475569;}@bottom-right{content:"Halaman " counter(page) " dari " counter(pages);font-size:${footerFontSize};font-family:Arial,sans-serif;color:#64748b;}}*{box-sizing:border-box;}html,body{margin:0;padding:0;font-family:Arial,sans-serif;font-size:10pt;color:#0f172a;background:#ffffff;line-height:1.25;-webkit-print-color-adjust:exact !important;print-color-adjust:exact !important;}.sheet-title-box{text-align:center;margin-bottom:28px;padding-bottom:2px;}.sheet-title-line{font-family:Arial,sans-serif;font-size:12pt;font-weight:bold;color:#0f172a;text-transform:uppercase;letter-spacing:0.5px;margin:2px 0;line-height:1.35;}table.sheet-table{width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:10pt;}thead{display:table-header-group;}tr{page-break-inside:avoid;break-inside:avoid;}th{font-family:Arial,sans-serif;font-size:10pt;font-weight:bold;background-color:#f1f5f9 !important;color:#0f172a !important;border:1px solid #94a3b8;padding:5px 4px;text-align:center;vertical-align:middle;}td{border:1px solid #cbd5e1;padding:4.5px 5px;vertical-align:middle;font-size:10pt;}.total-row td{background-color:#e2e8f0 !important;color:#0f172a !important;font-weight:bold;font-size:10pt;border:1px solid #94a3b8 !important;border-top:2px solid #0f172a !important;border-bottom:2px solid #0f172a !important;}</style></head><body><div class="sheet-title-box">${titleLinesHtml}</div><table class="sheet-table"><thead><tr><th style="width:30px;">NO</th><th>SATKER / KESATUAN</th><th style="width:65px;">CT</th><th style="width:65px;">CA</th><th style="width:65px;">LE</th><th style="width:65px;">CP</th><th style="width:55px;">PR</th><th style="width:65px;">CC</th><th style="width:55px;">CR</th><th style="width:95px;">INDEKS KINERJA</th></tr></thead><tbody>${rowsHtml}<tr class="total-row" style="page-break-inside:avoid;break-inside:avoid;"><td colspan="2" style="text-align:center;font-weight:bold;">TOTAL KESELURUHAN</td><td style="text-align:right;font-weight:bold;color:#1d4ed8;">${totCt}</td><td style="text-align:right;font-weight:bold;">${totBu}</td><td style="text-align:right;font-weight:bold;">${totLim}</td><td style="text-align:right;font-weight:bold;">${totCp}</td><td style="text-align:center;font-weight:bold;">${totPr}</td><td style="text-align:right;font-weight:bold;color:#15803d;">${totCc}</td><td style="text-align:center;font-weight:bold;">${totCr}</td><td style="text-align:center;font-weight:bold;">${totIdx} (${totLvl})</td></tr></tbody></table></body></html>`;

  let origTitle = document.title;
  try {
    if (window.top && window.top.document) {
      origTitle = window.top.document.title || origTitle;
      window.top.document.title = pdfDocTitle;
    }
  } catch (e) {}
  document.title = pdfDocTitle;

  let restored = false;
  let restoreTitle = () => {
    if (!restored) {
      restored = true;
      try {
        if (window.top && window.top.document) window.top.document.title = origTitle;
      } catch (e) {}
      document.title = origTitle;
    }
  };

  window.addEventListener("afterprint", restoreTitle, { once: true });

  try {
    let iframe = document.getElementById("kp-print-iframe");
    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.id = "kp-print-iframe";
      iframe.style.position = "fixed";
      iframe.style.top = "0";
      iframe.style.left = "0";
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.style.border = "none";
      iframe.style.opacity = "0";
      iframe.style.pointerEvents = "none";
      iframe.style.zIndex = "-9999";
      document.body.appendChild(iframe);
    }
    let doc = iframe.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close();
    try {
      doc.title = pdfDocTitle;
      iframe.contentWindow.addEventListener("afterprint", restoreTitle, { once: true });
    } catch(e){}
    setTimeout(restoreTitle, 25000);
    iframe.contentWindow.focus();
    setTimeout(() => {
      iframe.contentWindow.print();
    }, 350);
  } catch (err) {
    let w = window.open("", "_blank");
    if (w) {
      w.document.open();
      w.document.write(html);
      w.document.close();
      w.document.title = pdfDocTitle;
      w.focus();
      setTimeout(() => { w.print(); }, 350);
    } else {
      alert("Pop-up diblokir. Harap izinkan pop-up di browser Anda.");
    }
    setTimeout(restoreTitle, 5000);
  }
}

function applyUnifiedFilter(){
  let from="", to="", label="";
  if("month"===kpPeriodMode){
    let p=kpMonthRange(kpPeriodYear, kpPeriodMonth);
    from=p.from; to=p.to; label=p.label;
  }else if("year"===kpPeriodMode){
    let p=kpYearRange(kpPeriodYear);
    from=p.from; to=p.to; label=p.label;
  }else{
    from=kpCustomFrom; to=kpCustomTo;
    if(!from||!to){
      l.current?.show({severity:"warn",summary:"Periode belum lengkap",detail:"Tanggal awal dan akhir wajib dipilih."});
      return;
    }
    if(from>to){
      l.current?.show({severity:"warn",summary:"Periode tidak valid",detail:"Tanggal awal tidak boleh melewati tanggal akhir."});
      return;
    }
    label=from+" s.d. "+to;
  }
  es(from);
  ed(to);
  setKpPeriodLabel(label);
  setUnifiedFilterOpen(!1);
  kpCacheInvalidateAll();
  eSetAP({
    from:from,
    to:to,
    mode:ec,
    jenis:[...em],
    golongan:[...ey],
    iccs:[...ek],
    kelompok:[...eKG],
    scope:eScope,
    scopeSatkerId:"scoped"===eScope?eScopeSatkerId:null,
    functionDomain:eFD,
    modelLp:eModel,
    closureReason:eClosure,
    bucketMode:eBucket
  });
}

function resetUnifiedFilter(){
  setKpPeriodMode("year");
  setKpPeriodYear(2026);
  let p=kpYearRange(2026);
  es(p.from); ed(p.to); setKpPeriodLabel(p.label);
  eSetScope("national"); eSetScopeSatkerId(13); eSetFD("INTERNAL_RESERSE");
  ep([]); ef([]); ex([]); eSetKG([]);
  setActiveKelompokCrime("ALL"); setActiveTipidCrime("ALL");
  eu("both"); eSetModel(""); eSetClosure(""); eSetBucket("age");
}async function fetchLpDrilldown(target, pageNum=1, searchQuery=""){if(!target)return;setLpModalLoading(!0);try{let res=await R.apiAuth.get("/bdb/kinerja-perkara/lp-list",{params:{...eS,satker_id:target.satkerId||void 0,satker_kode:target.satkerKode||void 0,bucket:target.bucket,search:searchQuery&&searchQuery.trim()?searchQuery.trim():void 0,page:pageNum,limit:20}}),payload=res.data?.data||{};setLpModalItems(Array.isArray(payload.items)?payload.items:[]);let pag=payload.pagination||{};setLpModalPage(Number(pag.page||pageNum||1)),setLpModalTotal(Number(pag.total??target.expectedCount??0)),setLpModalTotalPages(Number(pag.total_pages||0))}catch(err){l.current?.show({severity:"error",summary:"Gagal",detail:err?.response?.data?.message||"Gagal memuat daftar Laporan Polisi."}),setLpModalItems([])}finally{setLpModalLoading(!1)}}function openLpDrilldown(nodeData,bucket,bucketLabel,countVal){let numVal=Number(countVal??0);if(numVal<=0)return;let fallbackSatkerId="scoped"===eAP.scope&&eAP.scopeSatkerId?eAP.scopeSatkerId:null,fallbackNama="Mabes Polri & Seluruh Polda";if("scoped"===eAP.scope&&eAP.scopeSatkerId){let sObj=eScopeOpts.find(x=>x.value===eAP.scopeSatkerId);if(sObj?.label)fallbackNama=sObj.label}let target={satkerId:nodeData?.id??fallbackSatkerId,satkerKode:nodeData?.kode??null,satkerNama:nodeData?.nama||fallbackNama,bucket,bucketLabel,expectedCount:numVal};setLpModalTarget(target),setLpModalSearchInput(""),setLpModalPage(1),setLpModalTotal(numVal),setLpModalTotalPages(Math.ceil(numVal/20)),setLpModalItems([]),setLpModalOpen(!0),fetchLpDrilldown(target,1,"")}function toggleTreeNode(node){if(!node||!node.data?.has_children)return;let k=node.key,isExp=!!(X&&X[k]);isExp?q(prev=>{let next={...(prev||{})};return delete next[k],next}):(q(prev=>({...(prev||{}),[k]:!0})),ew({node}))}function renderMetricLink(val,nodeData,bucket,bucketLabel,styleObj={},isBold=!1){let numVal=Number(val??0),color=styleObj?.color,bStr=String(bucket||""),isSubCol=bStr.startsWith("cp_akt_")||bStr.startsWith("cp_tgk_")||bStr.startsWith("cc_akt_")||bStr.startsWith("cc_tgk_");return numVal<=0?isSubCol?(0,a.jsx)("span",{style:{color:"#cbd5e1",fontWeight:400},children:"·"}):(0,a.jsx)("span",{style:{color:color||"inherit",fontWeight:isBold?700:400,opacity:0.65},children:"0"}):(0,a.jsx)("button",{type:"button",className:"kp-metric-link",onClick:e=>{e.stopPropagation(),openLpDrilldown(nodeData,bucket,bucketLabel,numVal)},title:`Klik untuk lihat daftar ${numVal.toLocaleString("id-ID")} LP (${bucketLabel} — ${nodeData?.nama||"Satker"})`,style:{...styleObj,color:color||"inherit",fontWeight:isBold?700:600},children:numVal.toLocaleString("id-ID")})}const KP_TIPS={ct:{title:"CT (Crime Total)",desc:"Jumlah Laporan Polisi (LP) yang mulai ditangani satker pada periode laporan. Klik angka untuk melihat daftar LP."},ca:{title:"CA (Crime Arrears / Sisa Belum Update)",desc:"Total perkara yang belum pernah mencapai status selesai (CC) dan belum memiliki pembaruan dokumen penanganan pada periode ini (gabungan CA Aktual + CA Tunggakan)."},ca_akt:{title:"CA Aktual (Belum Update Periode Ini)",desc:"Perkara dari periode berjalan yang belum memiliki pembaruan progres dokumen penanganan."},ca_tgk:{title:"CA Tunggakan (Belum Update Lintas Periode)",desc:"Tunggakan perkara dari periode sebelumnya yang belum pernah selesai (CC) dan belum diperbarui."},le:{title:"LE (Limpah Eksternal)",desc:"Perkara yang dilimpahkan keluar ke instansi atau satker eksternal di luar kewenangan satker asal."},cp:{title:"CP (Crime Processed)",desc:"Total perkara yang aktif diproses penyidikannya (Lidik, Sidik, SPDP, THP-1, P-19, P-21) namun belum selesai (CC). Terdiri dari CP Aktual + CP Tunggakan."},cp_akt:{title:"CP Aktual (Berjalan)",desc:"Perkara yang sedang diproses dan masih berada dalam batas waktu jatuh tempo tingkat kesulitan."},cp_tgk:{title:"CP Tunggakan",desc:"Perkara yang sedang diproses namun telah melewati batas waktu jatuh tempo tingkat kesulitan."},pr:{title:"PR (Processed Rate)",desc:"Persentase perkara yang sedang diproses (CP) terhadap beban perkara (CT)."},pr_lama:{title:"PR (Processed Rate) — Rumus Lama",formula:"PR Lama = CP / CT × 100%",desc:"Persentase perkara diproses terhadap Crime Total murni (rumus pembanding)."},pr_baru:{title:"PR (Processed Rate) — Rumus Baru",formula:"PR Baru = (CP Akt + CP Tgk) / (CT + CP Tgk) × 100%",desc:"Persentase perkara diproses dengan memperhitungkan beban CP Tunggakan."},cc:{title:"CC (Crime Clearance)",desc:"Total perkara yang telah diselesaikan pada periode laporan (SP2LID, PERMA/RJ, SP3, atau THP-2). Terdiri dari CC Aktual + CC Tunggakan."},cc_akt:{title:"CC Aktual",desc:"Perkara yang berhasil diselesaikan tepat waktu (sebelum/tepat batas jatuh tempo)."},cc_tgk:{title:"CC Tunggakan",desc:"Perkara yang diselesaikan setelah melewati batas waktu jatuh tempo."},cr:{title:"CR (Clearance Rate)",desc:"Persentase penyelesaian perkara (CC) terhadap beban perkara (CT)."},cr_lama:{title:"CR (Clearance Rate) — Rumus Lama",formula:"CR Lama = CC / CT × 100%",desc:"Persentase penyelesaian perkara model Anev lama (sebagai pembanding)."},cr_baru:{title:"CR (Clearance Rate) — Rumus Baru (Resmi)",formula:"CR Baru = (CC Akt + CC Tgk) / (CT + CC Tgk) × 100%",desc:"Persentase penyelesaian perkara resmi yang menjadi dasar penentuan Level & Indeks Kinerja."},indeks:{title:"Indeks & Level Kinerja (LV 1 – LV 5)",formula:"Indeks = Interpolasi Linear CR Baru (1,00 s.d. 5,00)",desc:"LV 1 (<30%), LV 2 (30–<55%), LV 3 (55–<85%), LV 4 (85–<95%), LV 5 (≥95%)."},penduduk:{title:"Jumlah Penduduk",desc:"Data populasi wilayah hukum satker sebagai pembagi perhitungan Crime Rate."},crime_rate:{title:"Crime Rate (Risiko Kejahatan)",formula:"Crime Rate = (CT / Jumlah Penduduk) × 100.000",desc:"Jumlah tindak pidana per 100.000 penduduk pada wilayah & periode terpilih."},crime_clock:{title:"Crime Clock (Waktu Kejahatan)",formula:"Crime Clock = Total Detik Periode / CT",desc:"Rata-rata selang waktu terjadinya 1 tindak pidana pada periode terpilih."}};function openKpTip(ev,tipKey,pinned=!1){let info=KP_TIPS[tipKey];if(!info||!ev?.currentTarget)return;let rect=ev.currentTarget.getBoundingClientRect(),vw="undefined"!=typeof window?window.innerWidth:1280,vh="undefined"!=typeof window?window.innerHeight:800,w=288,left=Math.max(12,Math.min(rect.left+rect.width/2-w/2,vw-w-12)),top=rect.bottom+8;if(top+135>vh)top=Math.max(12,rect.top-125);setKpTip({key:tipKey,...info,left,top,pinned})}function renderKpLabelWithTip(labelText,tipKey,variant="kpi"){return(0,a.jsxs)("span",{className:`kp-label-with-tip is-${variant}`,children:[(0,a.jsx)("span",{children:labelText}),(0,a.jsx)("span",{role:"button",tabIndex:0,className:`kp-info-badge is-${variant}`,"aria-label":`Info ${labelText}`,onMouseEnter:e=>{if(!kpTip?.pinned)openKpTip(e,tipKey,!1)},onMouseLeave:()=>{if(!kpTip?.pinned)setKpTip(null)},onClick:e=>{e.stopPropagation();e.preventDefault();if(kpTip&&kpTip.key===tipKey&&kpTip.pinned)setKpTip(null);else openKpTip(e,tipKey,!0)},children:"i"})]})}function formatKpSatkerMobile(raw){if(!raw)return"";let s=String(raw).trim().toUpperCase().replace(/\s+/g," ");if(s==="POLRI (MABES POLRI)"||s==="MABES POLRI")return"MABES POLRI";if(s==="BARESKRIM POLRI")return"BARESKRIM";const prov=[[/\bDAERAH ISTIMEWA YOGYAKARTA\b/gi,"DIY"],[/\bD\.?\s*I\.?\s*YOGYAKARTA\b/gi,"DIY"],[/\bNUSA TENGGARA TIMUR\b/gi,"NTT"],[/\bNUSA TENGGARA BARAT\b/gi,"NTB"],[/\bKEPULAUAN BANGKA BELITUNG\b/gi,"BABEL"],[/\bBANGKA BELITUNG\b/gi,"BABEL"],[/\bKEPULAUAN RIAU\b/gi,"KEPRI"],[/\bJAWA TIMUR\b/gi,"JATIM"],[/\bJAWA BARAT\b/gi,"JABAR"],[/\bJAWA TENGAH\b/gi,"JATENG"],[/\bSUMATERA UTARA\b/gi,"SUMUT"],[/\bSUMATERA BARAT\b/gi,"SUMBAR"],[/\bSUMATERA SELATAN\b/gi,"SUMSEL"],[/\bKALIMANTAN BARAT\b/gi,"KALBAR"],[/\bKALIMANTAN TENGAH\b/gi,"KALTENG"],[/\bKALIMANTAN SELATAN\b/gi,"KALSEL"],[/\bKALIMANTAN TIMUR\b/gi,"KALTIM"],[/\bKALIMANTAN UTARA\b/gi,"KALTARA"],[/\bSULAWESI UTARA\b/gi,"SULUT"],[/\bSULAWESI TENGAH\b/gi,"SULTENG"],[/\bSULAWESI SELATAN\b/gi,"SULSEL"],[/\bSULAWESI TENGGARA\b/gi,"SULTRA"],[/\bSULAWESI BARAT\b/gi,"SULBAR"],[/\bMALUKU UTARA\b/gi,"MALUT"],[/\bPAPUA BARAT DAYA\b/gi,"PABD"],[/\bPAPUA BARAT\b/gi,"PABAR"],[/\bPAPUA TENGAH\b/gi,"PATENG"],[/\bPAPUA PEGUNUNGAN\b/gi,"PAPEG"],[/\bPAPUA SELATAN\b/gi,"PASEL"]];for(let[rx,rep]of prov)s=s.replace(rx,rep);if(/^POLDA\s+/i.test(s))return s.replace(/^POLDA\s+/i,"").trim();const tok=[[/\bDIT\s*RESKRIMUM\b/gi,"KRIMUM"],[/\bDIT\s*KRIMUM\b/gi,"KRIMUM"],[/\bDIT\s*RESKRIMSUS\b/gi,"KRIMSUS"],[/\bDIT\s*KRIMSUS\b/gi,"KRIMSUS"],[/\bDIT\s*RESNARKOBA\b/gi,"NARKOBA"],[/\bDIT\s*NARKOBA\b/gi,"NARKOBA"],[/\bDIT\s*RES\s*PPA\s+DAN\s+PPO\b/gi,"PPA-PPO"],[/\bDIT\s*PPA\s+DAN\s+PPO\b/gi,"PPA-PPO"],[/\bDIT\s*RESSIBER\b/gi,"SIBER"],[/\bDIT\s*SIBER\b/gi,"SIBER"],[/\bDIT\s*POLAIRUD\b/gi,"POLAIR"],[/\bDIT\s*POLAIR\b/gi,"POLAIR"],[/\bDIT\s*TAHTI\b/gi,"TAHTI"],[/\bSAT\s*RESKRIM\b/gi,"SATRESKRIM"],[/\bSAT\s*RESNARKOBA\b/gi,"SATNARKOBA"],[/\bSAT\s*NARKOBA\b/gi,"SATNARKOBA"],[/\bPOLRESTABES\b/gi,"RESTABES"],[/\bPOLRESTA\b/gi,"RESTA"],[/\bPOLRES\s+METRO\b/gi,"RES METRO"],[/\bPOLRES\b/gi,"RES"],[/\bPOLSEKTA\b/gi,"SEKTA"],[/\bPOLSEKPEL\b/gi,"SEKPEL"],[/\bPOLSEK\b/gi,"SEK"],[/\bKABUPATEN\b/gi,"KAB."],[/\bKEPULAUAN\b/gi,"KEP."]];for(let[rx,rep]of tok)s=s.replace(rx,rep);return s.replace(/\bPOLDA\s+/gi,"").replace(/\s+/g," ").trim()}function toggleKpPill(k){setKpExpandedPills(prev=>({...prev,[k]:!prev?.[k]}))}function renderKpSummaryCard({key,label,valNode,color,borderLeft,drillBucket,drillLabel,drillCount,extraNode}){let isExp=!!(kpExpandAllPills||kpExpandedPills?.[key]),hasDrill=!!drillBucket&&Number(drillCount??0)>0,shortDesc=KP_TIPS[key]?.title||label;return(0,a.jsxs)("div",{key,className:`cms-card kp-kpi-card${hasDrill?" kp-kpi-clickable":""}${isExp?" is-pill-expanded":" is-pill-collapsed"}`,onClick:e=>{if("undefined"!=typeof window&&window.innerWidth<=768&&!isExp){e.stopPropagation();toggleKpPill(key);return}if(hasDrill)openLpDrilldown(null,drillBucket,drillLabel,drillCount);else if("undefined"!=typeof window&&window.innerWidth<=768)toggleKpPill(key)},style:{borderLeft:borderLeft||void 0,padding:"0.42rem 0.6rem",minHeight:"auto",minWidth:0,cursor:hasDrill||("undefined"!=typeof window&&window.innerWidth<=768)?"pointer":"default"},children:[(0,a.jsx)("div",{className:"kp-kpi-label",children:renderKpLabelWithTip(label,key,"kpi")}),(0,a.jsxs)("div",{className:"kp-kpi-body",children:[extraNode||(0,a.jsx)("div",{className:"kp-kpi-val",style:color?{color}:void 0,children:valNode}),(0,a.jsx)("div",{className:"kp-kpi-mobile-sub",children:shortDesc}),hasDrill&&(0,a.jsx)("button",{type:"button",className:"kp-kpi-mobile-drill-btn",onClick:e=>{e.stopPropagation();openLpDrilldown(null,drillBucket,drillLabel,drillCount)},children:"Lihat LP →"})]})]})}return(0,t.useEffect)(()=>{eT()},[eT]),(0,a.jsxs)("div",{children:[(0,a.jsx)(y.Toast,{ref:l}),(0,a.jsx)(f.ConfirmDialog,{}),kpTip?.pinned&&(0,a.jsx)("div",{style:{position:"fixed",inset:0,zIndex:9998,background:"transparent"},onClick:()=>setKpTip(null)}),kpTip&&(0,a.jsxs)("div",{className:"kp-floating-tip",style:{position:"fixed",left:`${kpTip.left}px`,top:`${kpTip.top}px`,zIndex:9999,width:"18rem",maxWidth:"calc(100vw - 24px)",pointerEvents:kpTip.pinned?"auto":"none"},children:[(0,a.jsxs)("div",{className:"kp-floating-tip-head",children:[(0,a.jsx)("span",{className:"kp-floating-tip-title",children:kpTip.title}),kpTip.pinned&&(0,a.jsx)("button",{type:"button",className:"kp-floating-tip-close",onClick:e=>{e.stopPropagation();setKpTip(null);},children:"×"})]}),kpTip.formula&&(0,a.jsx)("div",{className:"kp-floating-tip-formula",children:kpTip.formula}),(0,a.jsx)("div",{className:"kp-floating-tip-desc",children:kpTip.desc})]}),(0,a.jsxs)("div",{className:"cms-sticky-top",children:[(0,a.jsxs)("div",{className:"kp-page-head",style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.5rem",flexWrap:"nowrap"},children:[(0,a.jsxs)("div",{className:"kp-page-head-titles",style:{minWidth:0,flex:"1 1 auto"},children:[(0,a.jsxs)("h1",{className:"cms-page-title",style:{display:"inline-flex",alignItems:"center",gap:"0.4rem",fontSize:"1.25rem",marginBottom:0,whiteSpace:"nowrap"},children:[(0,a.jsx)(k.Gauge,{size:20})," Kinerja Perkara"]}),(0,a.jsx)("p",{className:"cms-page-sub kp-page-sub-desc",style:{marginBottom:"0.25rem",fontSize:"0.78rem"},children:"Penghitungan kinerja penanganan perkara per satker sesuai Ketentuan Penghitungan CT, CP, CC, CR, dan Indeks Kinerja (CT/CP/CC/CR/Indeks)"})]}),(0,a.jsxs)("div",{className:"kp-head-actions",style:{display:"flex",alignItems:"center",gap:"0.4rem",flexWrap:"nowrap",flexShrink:0},children:[(0,a.jsxs)("span",{className:"kp-data-per-badge",style:{fontSize:"0.75rem",color:"#94a3b8",whiteSpace:"nowrap"},children:["Data per: ",function(e){if(!e)return"—";let a=new Date(e);return isNaN(a.getTime())?e:a.toLocaleString("id-ID",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}(x?.last_refreshed_at)]}),(0,a.jsxs)(p.Button,{onClick:()=>Q(!0),outlined:!0,className:"att-btn kp-head-btn",title:"Cara Perhitungan",style:{padding:"0.35rem 0.7rem",fontSize:"0.76rem"},children:[(0,a.jsx)(C,{size:14,className:"kp-head-btn-icon",style:{marginRight:"0.35rem"}}),(0,a.jsx)("span",{className:"kp-btn-text-desktop",children:"Cara Perhitungan"})]}),null,kCanRefresh&&(0,a.jsxs)(p.Button,{onClick:eP,loading:V,severity:"warning",outlined:!0,className:"att-btn kp-head-btn",title:"Refresh Sekarang",style:{padding:"0.35rem 0.7rem",fontSize:"0.76rem"},children:[(0,a.jsx)(v.RefreshCw,{size:14,className:"kp-head-btn-icon",style:{marginRight:"0.35rem"}}),(0,a.jsx)("span",{className:"kp-btn-text-desktop",children:"Refresh Sekarang"})]})]})]}),"difficulty"===eAP.bucketMode&&!!x?.belum_kesulitan&&(0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem",background:"#fffbeb",border:"1px solid #fde68a",color:"#92400e",borderRadius:8,padding:"0.45rem 0.75rem",margin:"0.4rem 0",fontSize:"0.78rem"},children:[(0,a.jsx)(S.AlertTriangle,{size:15,style:{flex:"0 0 auto"}}),(0,a.jsxs)("span",{children:[(0,a.jsx)("strong",{children:x.belum_kesulitan})," LP belum memilih tingkat kesulitan — dihitung pakai default ",(0,a.jsx)("strong",{children:"Mudah (30 hari)"})," sampai dipilih."]})]}),(0,a.jsx)("div",{style:{margin:"0.45rem 0"},children:(0,a.jsxs)("div",{id:"kp-summary-strip",className:ee?"kp-summary-grid-detail":"kp-summary-grid-default",style:{display:"grid",gridTemplateColumns:ee?"repeat(auto-fit, minmax(8.5rem, 1fr))":"repeat(9, minmax(0, 1fr))",gap:"0.4rem",width:"100%"},children:[renderKpSummaryCard({key:"ct",label:"CT",valNode:d.ct.toLocaleString("id-ID"),color:"#1d4ed8",borderLeft:"3px solid #1d4ed8",drillBucket:"ct",drillLabel:"CT (Crime Total)",drillCount:d.ct}),renderKpSummaryCard({key:"ca",label:"CA",valNode:((x?.cp_berjalan_belum_update??0)+(x?.cp_tunggakan_belum_update??0)).toLocaleString("id-ID"),color:"#b45309",borderLeft:"3px solid #f59e0b",drillBucket:"sisa",drillLabel:"CA (Crime Arrears / Sisa Belum Update)",drillCount:(x?.cp_berjalan_belum_update??0)+(x?.cp_tunggakan_belum_update??0)}),...ee?[renderKpSummaryCard({key:"ca_akt",label:"CA Akt",valNode:(x?.cp_berjalan_belum_update??0).toLocaleString("id-ID"),color:"#b45309",borderLeft:"3px solid #fbbf24",drillBucket:"sisa_akt",drillLabel:"CA Aktual (Belum Update)",drillCount:x?.cp_berjalan_belum_update??0}),renderKpSummaryCard({key:"ca_tgk",label:"CA Tgk",valNode:(x?.cp_tunggakan_belum_update??0).toLocaleString("id-ID"),color:"#c2410c",borderLeft:"3px solid #f97316",drillBucket:"sisa_tgk",drillLabel:"CA Tunggakan (Belum Update)",drillCount:x?.cp_tunggakan_belum_update??0})]:[],renderKpSummaryCard({key:"cp",label:"CP",valNode:(d.cp_berjalan+d.cp_tunggakan).toLocaleString("id-ID"),color:"#0e7490",borderLeft:"3px solid #0e7490",drillBucket:"cp",drillLabel:"CP (Crime Processed) Total",drillCount:d.cp_berjalan+d.cp_tunggakan}),...ee?[renderKpSummaryCard({key:"cp_akt",label:"CP Akt",valNode:d.cp_berjalan.toLocaleString("id-ID"),color:"#0891b2",borderLeft:"3px solid #0891b2",drillBucket:"cp_akt",drillLabel:"CP Aktual",drillCount:d.cp_berjalan}),renderKpSummaryCard({key:"cp_tgk",label:"CP Tgk",valNode:d.cp_tunggakan.toLocaleString("id-ID"),color:"#dc2626",borderLeft:"3px solid #dc2626",drillBucket:"cp_tgk",drillLabel:"CP Tunggakan",drillCount:d.cp_tunggakan})]:[],renderKpSummaryCard({key:"pr_lama",label:"PR Lama",valNode:`${(x?.pr_lama??0).toFixed(2)}%`,color:"#64748b"}),renderKpSummaryCard({key:"pr_baru",label:"PR Baru",valNode:`${(x?.pr??0).toFixed(2)}%`,color:"#0e7490"}),renderKpSummaryCard({key:"cc",label:"CC",valNode:(d.cc_aktual+d.cc_tunggakan).toLocaleString("id-ID"),color:"#15803d",borderLeft:"3px solid #15803d",drillBucket:"cc",drillLabel:"CC (Crime Clearance) Total",drillCount:d.cc_aktual+d.cc_tunggakan}),...ee?[renderKpSummaryCard({key:"cc_akt",label:"CC Akt",valNode:d.cc_aktual.toLocaleString("id-ID"),color:"#16a34a",borderLeft:"3px solid #16a34a",drillBucket:"cc_akt",drillLabel:"CC Aktual",drillCount:d.cc_aktual}),renderKpSummaryCard({key:"cc_tgk",label:"CC Tgk",valNode:d.cc_tunggakan.toLocaleString("id-ID"),color:"#b45309",borderLeft:"3px solid #b45309",drillBucket:"cc_tgk",drillLabel:"CC Tunggakan",drillCount:d.cc_tunggakan})]:[],renderKpSummaryCard({key:"cr_lama",label:"CR Lama",valNode:`${(x?.cr_lama??0).toFixed(2)}%`,color:"#64748b"}),renderKpSummaryCard({key:"cr_baru",label:"CR Baru",valNode:`${(x?.cr??0).toFixed(2)}%`}),renderKpSummaryCard({key:"indeks",label:"Indeks",extraNode:(0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.35rem",flexWrap:"wrap"},children:[(0,a.jsx)("div",{className:"kp-kpi-val",children:(x?.indeks??0).toLocaleString("id-ID",{minimumFractionDigits:2,maximumFractionDigits:2})}),(0,a.jsx)(g.Tag,{value:`LV ${x?.level??1}`,severity:$(x?.level??1),style:{fontSize:"0.64rem",padding:"0.1rem 0.42rem"}})]})}),...ee?[renderKpSummaryCard({key:"crime_rate",label:`Crime Rate${x?.jumlah_penduduk?` (${(x.jumlah_penduduk/1e6).toFixed(1)}Jt)`:""}`,valNode:x?.crime_rate!=null?`${x.crime_rate.toLocaleString("id-ID")} Org`:"-",color:"#7c3aed"}),renderKpSummaryCard({key:"crime_clock",label:"Crime Clock",valNode:d.ct>0&&x?.crime_clock?x.crime_clock.label.replace("Selang ",""):"-",color:"#0891b2"})]:[],(0,a.jsx)("button",{type:"button",className:"kp-pill-toggle-all-btn",onClick:()=>setKpExpandAllPills(v=>!v),title:kpExpandAllPills?"Ringkas kartu KPI":"Tampilkan semua angka KPI",children:kpExpandAllPills?"Ringkas":"Semua Angka"})]})}),(() => {
  let activeList = [];
  activeList.push({
    key: "periode",
    icon: "pi pi-calendar",
    label: kpPeriodLabel || "Tahun 2026",
    cls: "",
    remove: () => {
      setKpPeriodMode("year");
      setKpPeriodYear(2026);
      let p = kpYearRange(2026);
      es(p.from);
      ed(p.to);
      setKpPeriodLabel(p.label);
      kpCacheInvalidateAll();
      eSetAP({
        from: p.from,
        to: p.to,
        mode: ec,
        jenis: [...em],
        golongan: [...ey],
        iccs: [...ek],
        kelompok: [...eKG],
        scope: eScope,
        scopeSatkerId: "scoped" === eScope ? eScopeSatkerId : null,
        functionDomain: eFD,
        modelLp: eModel,
        closureReason: eClosure,
        bucketMode: eBucket
      });
    }
  });

  let sLab = "Mabes Polri";
  if (eScope === "scoped" && eScopeSatkerId) {
    let sObj = eScopeOpts.find(x => x.value === eScopeSatkerId);
    sLab = sObj ? sObj.label : ("Satker #" + eScopeSatkerId);
  } else if (eScope === "national") {
    sLab = "Mabes Polri";
  }
  if (eFD === "EKSTERNAL_RESERSE") {
    sLab += " [Eksternal]";
  }
  activeList.push({
    key: "satker",
    icon: "pi pi-building",
    label: sLab,
    cls: "satker",
    remove: () => {
      eSetScope("national");
      eSetScopeSatkerId(13);
      eSetFD("INTERNAL_RESERSE");
      kpCacheInvalidateAll();
      eSetAP({
        from: el,
        to: eo,
        mode: ec,
        jenis: [...em],
        golongan: [...ey],
        iccs: [...ek],
        kelompok: [...eKG],
        scope: "national",
        scopeSatkerId: null,
        functionDomain: "INTERNAL_RESERSE",
        modelLp: eModel,
        closureReason: eClosure,
        bucketMode: eBucket
      });
    }
  });

  if (eKG.length > 0) {
    activeList.push({
      key: "crime-kg",
      icon: "pi pi-shield",
      label: eKG.join(", "),
      cls: "crime",
      remove: () => {
        eSetKG([]);
        setActiveKelompokCrime("ALL");
        setActiveTipidCrime("ALL");
        kpCacheInvalidateAll();
        eSetAP({
          from: el,
          to: eo,
          mode: ec,
          jenis: [...em],
          golongan: [...ey],
          iccs: [...ek],
          kelompok: [],
          scope: eScope,
          scopeSatkerId: "scoped" === eScope ? eScopeSatkerId : null,
          functionDomain: eFD,
          modelLp: eModel,
          closureReason: eClosure,
          bucketMode: eBucket
        });
      }
    });
  }
  if (ey.length > 0) {
    activeList.push({
      key: "crime-gol",
      icon: "pi pi-shield",
      label: ey.length + " Golongan",
      cls: "crime",
      remove: () => {
        ef([]);
        kpCacheInvalidateAll();
        eSetAP({
          from: el,
          to: eo,
          mode: ec,
          jenis: [...em],
          golongan: [],
          iccs: [...ek],
          kelompok: [...eKG],
          scope: eScope,
          scopeSatkerId: "scoped" === eScope ? eScopeSatkerId : null,
          functionDomain: eFD,
          modelLp: eModel,
          closureReason: eClosure,
          bucketMode: eBucket
        });
      }
    });
  }
  if (ek.length > 0) {
    activeList.push({
      key: "crime-iccs",
      icon: "pi pi-shield",
      label: ek.length + " ICCS",
      cls: "crime",
      remove: () => {
        ex([]);
        kpCacheInvalidateAll();
        eSetAP({
          from: el,
          to: eo,
          mode: ec,
          jenis: [...em],
          golongan: [...ey],
          iccs: [],
          kelompok: [...eKG],
          scope: eScope,
          scopeSatkerId: "scoped" === eScope ? eScopeSatkerId : null,
          functionDomain: eFD,
          modelLp: eModel,
          closureReason: eClosure,
          bucketMode: eBucket
        });
      }
    });
  }
  if (em.length > 0) {
    activeList.push({
      key: "crime-jenis",
      icon: "pi pi-shield",
      label: em.length + " Jenis Perkara",
      cls: "crime",
      remove: () => {
        ep([]);
        kpCacheInvalidateAll();
        eSetAP({
          from: el,
          to: eo,
          mode: ec,
          jenis: [],
          golongan: [...ey],
          iccs: [...ek],
          kelompok: [...eKG],
          scope: eScope,
          scopeSatkerId: "scoped" === eScope ? eScopeSatkerId : null,
          functionDomain: eFD,
          modelLp: eModel,
          closureReason: eClosure,
          bucketMode: eBucket
        });
      }
    });
  }

  if (ec !== "both") {
    activeList.push({
      key: "param-mode",
      icon: "pi pi-sliders-h",
      label: ec === "reported" ? "Tgl Lapor" : "Tgl Kejadian",
      cls: "",
      remove: () => {
        eu("both");
        kpCacheInvalidateAll();
        eSetAP({
          from: el,
          to: eo,
          mode: "both",
          jenis: [...em],
          golongan: [...ey],
          iccs: [...ek],
          kelompok: [...eKG],
          scope: eScope,
          scopeSatkerId: "scoped" === eScope ? eScopeSatkerId : null,
          functionDomain: eFD,
          modelLp: eModel,
          closureReason: eClosure,
          bucketMode: eBucket
        });
      }
    });
  }
  if (eModel) {
    activeList.push({
      key: "param-model",
      icon: "pi pi-sliders-h",
      label: "Model " + eModel,
      cls: "",
      remove: () => {
        eSetModel("");
        kpCacheInvalidateAll();
        eSetAP({
          from: el,
          to: eo,
          mode: ec,
          jenis: [...em],
          golongan: [...ey],
          iccs: [...ek],
          kelompok: [...eKG],
          scope: eScope,
          scopeSatkerId: "scoped" === eScope ? eScopeSatkerId : null,
          functionDomain: eFD,
          modelLp: "",
          closureReason: eClosure,
          bucketMode: eBucket
        });
      }
    });
  }
  if (eClosure) {
    activeList.push({
      key: "param-closure",
      icon: "pi pi-sliders-h",
      label: eClosure === "RJ" ? "Penyelesaian RJ" : "Selain RJ",
      cls: "",
      remove: () => {
        eSetClosure("");
        kpCacheInvalidateAll();
        eSetAP({
          from: el,
          to: eo,
          mode: ec,
          jenis: [...em],
          golongan: [...ey],
          iccs: [...ek],
          kelompok: [...eKG],
          scope: eScope,
          scopeSatkerId: "scoped" === eScope ? eScopeSatkerId : null,
          functionDomain: eFD,
          modelLp: eModel,
          closureReason: "",
          bucketMode: eBucket
        });
      }
    });
  }
  if (eBucket !== "age") {
    activeList.push({
      key: "param-bucket",
      icon: "pi pi-sliders-h",
      label: "Tingkat Kesulitan",
      cls: "",
      remove: () => {
        eSetBucket("age");
        kpCacheInvalidateAll();
        eSetAP({
          from: el,
          to: eo,
          mode: ec,
          jenis: [...em],
          golongan: [...ey],
          iccs: [...ek],
          kelompok: [...eKG],
          scope: eScope,
          scopeSatkerId: "scoped" === eScope ? eScopeSatkerId : null,
          functionDomain: eFD,
          modelLp: eModel,
          closureReason: eClosure,
          bucketMode: "age"
        });
      }
    });
  }

  let activeCount = activeList.length;

  return (0, a.jsxs)("div", {
    className: "cms-card",
    style: { padding: 0, overflow: "visible" },
    children: [
      (0, a.jsxs)("div", {
        className: "kp-toolbar-row",
        children: [
          (0, a.jsxs)("div", {
            className: "kp-filter-wrapper",
            style: { position: "relative" },
            children: [
              (0, a.jsxs)(p.Button, {
                outlined: !0,
                onClick: () => setUnifiedFilterOpen(v => !v),
                className: "att-btn kp-filter-trigger-btn" + (unifiedFilterOpen ? " active" : ""),
                children: [
                  (0, a.jsx)("i", { className: "pi pi-sliders-h", style: { marginRight: "0.35rem", fontSize: "0.78rem" } }),
                  (0, a.jsx)("span", { children: "Filter" }),
                  (0, a.jsx)("span", { className: "kp-btn-text-desktop", children: "\u00A0Perkara" }),
                  (0, a.jsx)("span", { children: "\u00A0(" + activeCount + ") ▾" })
                ]
              }),
              unifiedFilterOpen &&
                (0, a.jsx)("div", {
                  style: { position: "fixed", inset: 0, zIndex: 2490 },
                  onClick: () => setUnifiedFilterOpen(!1)
                }),
              unifiedFilterOpen &&
                (0, a.jsxs)("div", {
            className: "kp-modal-card kp-filter-popover",
            children: [
              (0, a.jsxs)("div", {
                className: "kp-modal-header",
                children: [
                  (0, a.jsxs)("div", {
                    children: [
                      (0, a.jsx)("div", {
                        className: "kp-modal-title",
                        children: "🎛️ Filter & Parameter Kinerja Perkara"
                      }),
                      (0, a.jsx)("div", {
                        className: "kp-modal-sub",
                        children:
                          "Atur periode, satker kewilayahan, klasifikasi kejahatan, dan parameter analisis"
                      })
                    ]
                  }),
                  (0, a.jsx)("button", {
                    type: "button",
                    onClick: () => setUnifiedFilterOpen(!1),
                    className: "kp-modal-close-btn",
                    children: "×"
                  })
                ]
              }),
              (0, a.jsx)("div", {
                className: "kp-tab-bar",
                children: [
                  { idx: 0, label: "📅 Periode" },
                  { idx: 1, label: "🏛️ Satker & Wilayah" },
                  { idx: 2, label: "⚖️ Kejahatan" },
                  { idx: 3, label: "⚙️ Parameter & Model" }
                ].map(tb =>
                  (0, a.jsx)(
                    "button",
                    {
                      type: "button",
                      onClick: () => setUnifiedFilterTab(tb.idx),
                      className:
                        "kp-tab-btn" +
                        (unifiedFilterTab === tb.idx ? " active" : ""),
                      children: tb.label
                    },
                    tb.idx
                  )
                )
              }),
              (0, a.jsxs)("div", {
                className: "kp-modal-body",
                children: [
                  unifiedFilterTab === 0 &&
                    (0, a.jsxs)("div", {
                      style: { display: "grid", gap: "1rem" },
                      children: [
                        (0, a.jsxs)("div", {
                          style: {
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: "0.5rem"
                          },
                          children: [
                            (0, a.jsx)(p.Button, {
                              label: "Bulan",
                              outlined: "month" !== kpPeriodMode,
                              onClick: () => setKpPeriodMode("month")
                            }),
                            (0, a.jsx)(p.Button, {
                              label: "Tahun",
                              outlined: "year" !== kpPeriodMode,
                              onClick: () => setKpPeriodMode("year")
                            }),
                            (0, a.jsx)(p.Button, {
                              label: "Custom",
                              outlined: "custom" !== kpPeriodMode,
                              onClick: () => setKpPeriodMode("custom")
                            })
                          ]
                        }),
                        "month" === kpPeriodMode &&
                          (0, a.jsxs)("div", {
                            style: {
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr",
                              gap: "0.75rem"
                            },
                            children: [
                              (0, a.jsx)(j.Dropdown, {
                                appendTo: "self",
                                value: kpPeriodMonth,
                                options: kpMonthOptions(),
                                onChange: e => setKpPeriodMonth(e.value),
                                placeholder: "Bulan",
                                style: { width: "100%" }
                              }),
                              (0, a.jsx)(j.Dropdown, {
                                appendTo: "self",
                                value: kpPeriodYear,
                                options: kpYearOptions(),
                                onChange: e => setKpPeriodYear(e.value),
                                placeholder: "Tahun",
                                style: { width: "100%" }
                              })
                            ]
                          }),
                        "year" === kpPeriodMode &&
                          (0, a.jsx)(j.Dropdown, {
                            appendTo: "self",
                            value: kpPeriodYear,
                            options: kpYearOptions(),
                            onChange: e => setKpPeriodYear(e.value),
                            placeholder: "Pilih Tahun",
                            style: { width: "100%" }
                          }),
                        "custom" === kpPeriodMode &&
                          (0, a.jsxs)("div", {
                            style: {
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr",
                              gap: "0.75rem"
                            },
                            children: [
                              (0, a.jsxs)("div", {
                                children: [
                                  (0, a.jsx)("label", {
                                    style: {
                                      display: "block",
                                      fontSize: "0.75rem",
                                      fontWeight: 700,
                                      marginBottom: "0.25rem"
                                    },
                                    children: "Dari Tanggal"
                                  }),
                                  (0, a.jsx)(m.InputText, {
                                    type: "date",
                                    value: kpCustomFrom,
                                    onChange: e =>
                                      setKpCustomFrom(e.target.value),
                                    style: { width: "100%" }
                                  })
                                ]
                              }),
                              (0, a.jsxs)("div", {
                                children: [
                                  (0, a.jsx)("label", {
                                    style: {
                                      display: "block",
                                      fontSize: "0.75rem",
                                      fontWeight: 700,
                                      marginBottom: "0.25rem"
                                    },
                                    children: "Sampai Tanggal"
                                  }),
                                  (0, a.jsx)(m.InputText, {
                                    type: "date",
                                    value: kpCustomTo,
                                    onChange: e =>
                                      setKpCustomTo(e.target.value),
                                    style: { width: "100%" }
                                  })
                                ]
                              })
                            ]
                          }),
                        (0, a.jsx)("div", {
                          className: "kp-modal-tip",
                          children:
                            "💡 Periode menentukan rentang tanggal pelaporan atau kejadian perkara yang akan dievaluasi kinerjanya."
                        })
                      ]
                    }),
                  unifiedFilterTab === 1 &&
                    (0, a.jsxs)("div", {
                      style: { display: "grid", gap: "1rem" },
                      children: [
                        (0, a.jsxs)("div", {
                          className: "kp-modal-section",
                          children: [
                            (0, a.jsx)("div", {
                              className: "kp-modal-sec-title",
                              children: "1. Kelompok Data"
                            }),
                            (0, a.jsx)(j.Dropdown, {
                              appendTo: "self",
                              value: eScope,
                              options: [
                                {
                                  label: "Kelompok Nasional",
                                  value: "national"
                                },
                                {
                                  label: "Kelompok Regional",
                                  value: "scoped"
                                }
                              ],
                              onChange: e => eSetScope(e.value),
                              style: { width: "100%" }
                            })
                          ]
                        }),
                        "scoped" === eScope &&
                          (0, a.jsxs)("div", {
                            className: "kp-modal-section",
                            children: [
                              (0, a.jsx)("div", {
                                className: "kp-modal-sec-title",
                                children: "2. Wilayah Regional"
                              }),
                              (0, a.jsx)(j.Dropdown, {
                                appendTo: "self",
                                value: eScopeSatkerId,
                                options: eScopeOpts,
                                onChange: e => eSetScopeSatkerId(e.value),
                                placeholder: "Pilih Wilayah",
                                filter: !0,
                                style: { width: "100%" }
                              })
                            ]
                          }),
                        (0, a.jsxs)("div", {
                          className: "kp-modal-section",
                          children: [
                            (0, a.jsx)("div", {
                              className: "kp-modal-sec-title",
                              children: "3. Cakupan Satker"
                            }),
                            (0, a.jsx)(j.Dropdown, {
                              appendTo: "self",
                              value: eFD,
                              options: [
                                {
                                  label: "Internal Reserse",
                                  value: "INTERNAL_RESERSE"
                                },
                                {
                                  label: "Eksternal Reserse / Non-Reserse",
                                  value: "EKSTERNAL_RESERSE"
                                }
                              ],
                              onChange: e => eSetFD(e.value),
                              style: { width: "100%" }
                            })
                          ]
                        })
                      ]
                    }),
                  unifiedFilterTab === 2 &&
                    (0, a.jsxs)("div", {
                      style: { display: "grid", gap: "0.75rem" },
                      children: [
                        (0, a.jsxs)("div", {
                          className: "kp-modal-section",
                          children: [
                            (0, a.jsx)("div", {
                              className: "kp-modal-sec-title",
                              children: "1. Kelompok Induk Kejahatan"
                            }),
                            (0, a.jsx)(j.Dropdown, {
                              appendTo: "self",
                              value: activeKelompokCrime,
                              options: [
                                { label: "Semua Kelompok", value: "ALL" },
                                { label: "KRIMUM (Kriminal Umum)", value: "KRIMUM" },
                                { label: "KRIMSUS (Kriminal Khusus)", value: "KRIMSUS" },
                                { label: "NARKOBA (Narkotika)", value: "NARKOBA" }
                              ],
                              onChange: e => {
                                let kVal = e.value;
                                setActiveKelompokCrime(kVal);
                                setActiveTipidCrime("ALL");
                                if (kVal === "ALL") {
                                  eSetKG([]);
                                } else {
                                  eSetKG([kVal]);
                                }
                              },
                              style: { width: "100%", fontSize: "0.82rem" }
                            })
                          ]
                        }),
                        (() => {
                          let tipids = [];
                          if (activeKelompokCrime === "KRIMSUS") {
                            tipids = [
                              { key: "ALL", label: "Semua Krimsus" },
                              { key: "TIPIDSIBER", label: "TIPIDSIBER" },
                              { key: "TIPIDEKSUS", label: "TIPIDEKSUS" },
                              { key: "TIPIDKOR", label: "TIPIDKOR" },
                              { key: "TIPIDTER", label: "TIPIDTER" }
                            ];
                          } else if (activeKelompokCrime === "KRIMUM") {
                            tipids = [
                              { key: "ALL", label: "Semua Krimum" },
                              { key: "TIPIDUM", label: "TIPIDUM" },
                              { key: "TIPIDPPAPPO", label: "TIPIDPPAPPO" }
                            ];
                          } else if (activeKelompokCrime === "NARKOBA") {
                            tipids = [
                              { key: "ALL", label: "Semua Narkoba" },
                              { key: "TIPIDNARKOBA", label: "TIPIDNARKOBA" }
                            ];
                          } else {
                            tipids = [
                              { key: "ALL", label: "Semua TIPID" },
                              { key: "TIPIDUM", label: "TIPIDUM" },
                              { key: "TIPIDPPAPPO", label: "TIPIDPPAPPO" },
                              { key: "TIPIDEKSUS", label: "TIPIDEKSUS" },
                              { key: "TIPIDKOR", label: "TIPIDKOR" },
                              { key: "TIPIDTER", label: "TIPIDTER" },
                              { key: "TIPIDSIBER", label: "TIPIDSIBER" },
                              { key: "TIPIDNARKOBA", label: "TIPIDNARKOBA" }
                            ];
                          }
                          let cols = Math.min(tipids.length, 5);
                          return (0, a.jsxs)("div", {
                            className: "kp-modal-section",
                            children: [
                              (0, a.jsx)("div", {
                                className: "kp-modal-sec-title",
                                children: "2. Sub-Kelompok TIPID"
                              }),
                              (0, a.jsx)(j.Dropdown, {
                                appendTo: "self",
                                value: activeTipidCrime,
                                options: tipids.map(t => ({ label: t.label, value: t.key })),
                                onChange: e => {
                                  let tVal = e.value;
                                  setActiveTipidCrime(tVal);
                                  if (tVal === "ALL") {
                                    if (activeKelompokCrime !== "ALL") eSetKG([activeKelompokCrime]);
                                    else eSetKG([]);
                                  } else {
                                    eSetKG([tVal]);
                                  }
                                },
                                style: { width: "100%", fontSize: "0.82rem" }
                              })
                            ]
                          });
                        })(),
                        (0, a.jsxs)("div", {
                          style: {
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "0.6rem"
                          },
                          children: [
                            (0, a.jsxs)("div", {
                              children: [
                                (0, a.jsx)("label", {
                                  style: {
                                    display: "block",
                                    fontSize: "0.72rem",
                                    fontWeight: 700,
                                    marginBottom: "0.2rem"
                                  },
                                  children: "Golongan"
                                }),
                                (0, a.jsx)(b.MultiSelect, {
                                  appendTo: "self",
                                  value: ey,
                                  options: eGolOptions,
                                  onChange: e => {
                                    let v = e.value;
                                    ef(v);
                                    if (v.length) {
                                      let t = eg.filter(x =>
                                        v.includes(x.golonganId)
                                      );
                                      ep(c =>
                                        c.filter(id =>
                                          t.some(x => x.value === id)
                                        )
                                      );
                                      ex(c =>
                                        c.filter(id =>
                                          t.some(x => x.iccsId === id)
                                        )
                                      );
                                    }
                                  },
                                  placeholder: "Semua Golongan",
                                  display: "chip",
                                  filter: !0,
                                  showClear: !0,
                                  maxSelectedLabels: 1,
                                  style: { width: "100%", fontSize: "0.78rem" },
                                  panelClassName: "kp-filter-dropup kp-filter-dropup-left",
                                  panelStyle: { maxHeight: "210px" }
                                })
                              ]
                            }),
                            (0, a.jsxs)("div", {
                              children: [
                                (0, a.jsx)("label", {
                                  style: {
                                    display: "block",
                                    fontSize: "0.72rem",
                                    fontWeight: 700,
                                    marginBottom: "0.2rem"
                                  },
                                  children: "ICCS"
                                }),
                                (0, a.jsx)(b.MultiSelect, {
                                  appendTo: "self",
                                  value: ek,
                                  options: eIccsOptions,
                                  onChange: e => {
                                    let v = e.value;
                                    ex(v);
                                    if (v.length) {
                                      let t = eg.filter(x =>
                                        v.includes(x.iccsId)
                                      );
                                      ep(c =>
                                        c.filter(id =>
                                          t.some(x => x.value === id)
                                        )
                                      );
                                      ef(c =>
                                        c.filter(id =>
                                          t.some(x => x.golonganId === id)
                                        )
                                      );
                                    }
                                  },
                                  placeholder: "Semua ICCS",
                                  display: "chip",
                                  filter: !0,
                                  showClear: !0,
                                  maxSelectedLabels: 1,
                                  style: { width: "100%", fontSize: "0.78rem" },
                                  panelClassName: "kp-filter-dropup kp-filter-dropup-right",
                                  panelStyle: { maxHeight: "210px" }
                                })
                              ]
                            })
                          ]
                        }),
                        (0, a.jsxs)("div", {
                          children: [
                            (0, a.jsxs)("div", {
                              style: {
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "0.25rem"
                              },
                              children: [
                                (0, a.jsx)("label", {
                                  style: {
                                    fontSize: "0.72rem",
                                    fontWeight: 700
                                  },
                                  children: "3. Daftar Jenis Kejahatan"
                                }),
                                (0, a.jsxs)("div", {
                                  style: {
                                    display: "flex",
                                    gap: "0.5rem",
                                    fontSize: "0.72rem"
                                  },
                                  children: [
                                    (0, a.jsx)("a", {
                                      className: "kp-link-select-all",
                                      onClick: () => {
                                        ep(eJenisOptions.map(x => x.value));
                                      },
                                      children: "Pilih Semua"
                                    }),
                                    (0, a.jsx)("span", {
                                      style: { color: "#cbd5e1" },
                                      children: "|"
                                    }),
                                    (0, a.jsx)("a", {
                                      className: "kp-link-clear-all",
                                      onClick: () => {
                                        ep([]);
                                      },
                                      children: "Hapus Pilihan"
                                    })
                                  ]
                                })
                              ]
                            }),
                            (0, a.jsx)(b.MultiSelect, {
                              appendTo: "self",
                              value: em,
                              options: eJenisOptions,
                              onChange: e => {
                                let v = e.value;
                                ep(v);
                                if (v.length) {
                                  let t = eg.filter(x => v.includes(x.value));
                                  ef(c =>
                                    c.filter(id =>
                                      t.some(x => x.golonganId === id)
                                    )
                                  );
                                  ex(c =>
                                    c.filter(id => t.some(x => x.iccsId === id))
                                  );
                                }
                              },
                              placeholder: "Cari & pilih jenis kejahatan…",
                              display: "chip",
                              filter: !0,
                              showClear: !0,
                              maxSelectedLabels: 3,
                              style: { width: "100%", fontSize: "0.8rem" },
                              panelClassName: "kp-filter-dropup kp-filter-dropup-full",
                              panelStyle: { maxHeight: "210px", maxWidth: "100%" },
                              filterBy: "label,fullLabel",
                              itemTemplate: e =>
                                (0, a.jsx)("span", {
                                  title: e.fullLabel || e.label,
                                  style: {
                                    display: "block",
                                    maxWidth: "26rem",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap"
                                  },
                                  children: e.label
                                }),
                              virtualScrollerOptions: { itemSize: 36 }
                            })
                          ]
                        })
                      ]
                    }),
                  unifiedFilterTab === 3 &&
                    (0, a.jsxs)("div", {
                      style: { display: "grid", gap: "0.85rem" },
                      children: [
                        (0, a.jsxs)("div", {
                          className: "kp-modal-section",
                          children: [
                            (0, a.jsx)("div", {
                              className: "kp-modal-sec-title",
                              children: "Acuan Tanggal Perhitungan"
                            }),
                            (0, a.jsx)(j.Dropdown, {
                              appendTo: "self",
                              value: ec,
                              options: B,
                              onChange: e => eu(e.value),
                              style: { width: "100%" }
                            })
                          ]
                        }),
                        (0, a.jsxs)("div", {
                          className: "kp-modal-section",
                          children: [
                            (0, a.jsx)("div", {
                              className: "kp-modal-sec-title",
                              children: "Model Laporan Polisi"
                            }),
                            (0, a.jsx)(j.Dropdown, {
                              appendTo: "self",
                              value: eModel,
                              options: [
                                { label: "Semua Model", value: "" },
                                { label: "Model A", value: "A" },
                                { label: "Model B", value: "B" }
                              ],
                              placeholder: "Semua Model",
                              onChange: e => eSetModel(e.value),
                              style: { width: "100%" }
                            })
                          ]
                        }),
                        (0, a.jsxs)("div", {
                          className: "kp-modal-section",
                          children: [
                            (0, a.jsx)("div", {
                              className: "kp-modal-sec-title",
                              children: "Penyelesaian Perkara"
                            }),
                            (0, a.jsx)(j.Dropdown, {
                              appendTo: "self",
                              value: eClosure,
                              options: [
                                { label: "Semua Penyelesaian", value: "" },
                                {
                                  label: "Restorative Justice (RJ)",
                                  value: "RJ"
                                },
                                { label: "Selain RJ", value: "NON_RJ" }
                              ],
                              placeholder: "Semua Penyelesaian",
                              onChange: e => eSetClosure(e.value),
                              style: { width: "100%" }
                            })
                          ]
                        }),
                        (0, a.jsxs)("div", {
                          className: "kp-modal-section",
                          children: [
                            (0, a.jsx)("div", {
                              className: "kp-modal-sec-title",
                              children: "Mode Kinerja (Bucket)"
                            }),
                            (0, a.jsx)(j.Dropdown, {
                              appendTo: "self",
                              value: eBucket,
                              options: [
                                {
                                  label: "Usia Perkara (Default)",
                                  value: "age"
                                },
                                {
                                  label: "Tingkat Kesulitan",
                                  value: "difficulty"
                                }
                              ],
                              onChange: e => eSetBucket(e.value),
                              style: { width: "100%" }
                            })
                          ]
                        })
                      ]
                    })
                ]
              }),
              (0, a.jsxs)("div", {
                className: "kp-modal-footer",
                children: [
                  (0, a.jsx)(p.Button, {
                    label: "Reset Default",
                    icon: "pi pi-refresh",
                    text: !0,
                    severity: "secondary",
                    onClick: resetUnifiedFilter
                  }),
                  (0, a.jsxs)("div", {
                    style: { display: "flex", gap: "0.5rem" },
                    children: [
                      (0, a.jsx)(p.Button, {
                        label: "Batal",
                        text: !0,
                        onClick: () => setUnifiedFilterOpen(!1)
                      }),
                      (0, a.jsx)(p.Button, {
                        label: "Terapkan Filter",
                        icon: "pi pi-check",
                        onClick: applyUnifiedFilter
                      })
                    ]
                  })
                ]
              })
            ]
          })
            ]
          }),
          (0, a.jsx)("div", { className: "kp-toolbar-divider" }),
          (0, a.jsxs)(p.Button, {
            onClick: () => ea(e => !e),
            outlined: !ee,
            className: "att-btn kp-detail-toggle-btn",
            style: {
              background: ee ? "#fef9c3" : void 0,
              borderColor: ee ? "#facc15" : void 0,
              color: ee ? "#854d0e" : void 0
            },
            children: [
              (0, a.jsx)(P, { size: 14, style: { marginRight: "0.35rem" } }),
              (0, a.jsx)("span", { className: "kp-btn-text-desktop", children: ee ? "Sembunyikan\u00A0" : "Tampilkan\u00A0" }),
              (0, a.jsx)("span", { children: "Detail" })
            ]
          }),
          (0, a.jsx)("div", { className: "kp-toolbar-divider" }),
          (0, a.jsxs)("div", {
            className: "kp-chips-inline",
            children: [
              (0, a.jsx)("span", {
                className: "kp-chips-label",
                children: "Filter Aktif:"
              }),
              activeList.map(item =>
                (0, a.jsxs)(
                  "span",
                  {
                    className: "kp-chip " + (item.cls || ""),
                    children: [
                      (0, a.jsx)("i", {
                        className: item.icon,
                        style: { fontSize: "0.72rem" }
                      }),
                      (0, a.jsx)("span", { children: item.label }),
                      (0, a.jsx)("button", {
                        type: "button",
                        className: "kp-chip-remove",
                        title: "Hapus filter",
                        onClick: e => {
                          e.stopPropagation();
                          item.remove();
                        },
                        children: "×"
                      })
                    ]
                  },
                  item.key
                )
              )
            ]
          }),
          (0, a.jsxs)("div", {
            className: "kp-toolbar-actions",
            style: {
              marginLeft: "auto",
              display: "flex",
              gap: "0.45rem",
              alignItems: "center",
              flexShrink: 0
            },
            children: [
              (0, a.jsxs)("div", {
                style: { position: "relative" },
                children: [
                  (0, a.jsxs)(p.Button, {
                    outlined: !0,
                    className: "att-btn kp-export-trigger-btn",
                    loading: et,
                    title: "Ekspor Data (Excel / CSV / PDF)",
                    "aria-label": "Ekspor Data",
                    onClick: () => setExportMenuOpen(v => !v),
                    children: [
                      (0, a.jsx)("i", { className: "pi pi-download kp-export-icon", style: { fontSize: "0.82rem" } }),
                      (0, a.jsx)("span", { className: "kp-btn-text-desktop", style: { marginLeft: "0.38rem" }, children: "Ekspor ▾" })
                    ]
                  }),
                  exportMenuOpen &&
                    (0, a.jsx)("div", {
                      style: { position: "fixed", inset: 0, zIndex: 2499 },
                      onClick: () => setExportMenuOpen(!1)
                    }),
                  exportMenuOpen &&
                    (0, a.jsxs)("div", {
                      className: "kp-export-pop",
                      children: [
                        (0, a.jsxs)("button", {
                          type: "button",
                          className: "kp-export-btn",
                          onClick: () => {
                            setExportMenuOpen(!1);
                            eExportXlsx();
                          },
                          children: [
                            (0, a.jsx)("div", {
                              style: {
                                width: "2rem",
                                height: "2rem",
                                borderRadius: "8px",
                                background: "rgba(22, 163, 74, 0.15)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0
                              },
                              children: (0, a.jsx)("i", {
                                className: "pi pi-file-excel",
                                style: { fontSize: "1.2rem", color: "#16a34a" }
                              })
                            }),
                            (0, a.jsxs)("div", {
                              children: [
                                (0, a.jsx)("div", {
                                  className: "kp-export-title",
                                  children: "Ekspor Excel (.xlsx)"
                                }),
                                (0, a.jsx)("div", {
                                  className: "kp-export-sub",
                                  children: "Unduh spreadsheet format Excel"
                                })
                              ]
                            })
                          ]
                        }),
                        (0, a.jsx)("div", { className: "kp-export-divider" }),
                        (0, a.jsxs)("button", {
                          type: "button",
                          className: "kp-export-btn",
                          onClick: () => {
                            setExportMenuOpen(!1);
                            eR();
                          },
                          children: [
                            (0, a.jsx)("div", {
                              style: {
                                width: "2rem",
                                height: "2rem",
                                borderRadius: "8px",
                                background: "rgba(37, 99, 235, 0.15)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0
                              },
                              children: (0, a.jsx)("i", {
                                className: "pi pi-table",
                                style: { fontSize: "1.2rem", color: "#2563eb" }
                              })
                            }),
                            (0, a.jsxs)("div", {
                              children: [
                                (0, a.jsx)("div", {
                                  className: "kp-export-title",
                                  children: "Ekspor CSV (.csv)"
                                }),
                                (0, a.jsx)("div", {
                                  className: "kp-export-sub",
                                  children: "Unduh data tabular mentah"
                                })
                              ]
                            })
                          ]
                        }),
                        (0, a.jsx)("div", { className: "kp-export-divider" }),
                        (0, a.jsxs)("button", {
                          type: "button",
                          className: "kp-export-btn",
                          onClick: openPdfModal,
                          children: [
                            (0, a.jsx)("div", {
                              style: {
                                width: "2rem",
                                height: "2rem",
                                borderRadius: "8px",
                                background: "rgba(220, 38, 38, 0.15)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0
                              },
                              children: (0, a.jsx)("i", {
                                className: "pi pi-file-pdf",
                                style: { fontSize: "1.2rem", color: "#dc2626" }
                              })
                            }),
                            (0, a.jsxs)("div", {
                              children: [
                                (0, a.jsx)("div", {
                                  className: "kp-export-title",
                                  children: "Cetak / Ekspor PDF Resmi"
                                }),
                                (0, a.jsx)("div", {
                                  className: "kp-export-sub",
                                  children: "Format surat dinas KOP Presisi & TTD"
                                })
                              ]
                            })
                          ]
                        })
                      ]
                    })
                ]
              }),
              (0, a.jsx)(p.Button, {
                icon: "pi pi-refresh",
                outlined: !0,
                className: "att-btn",
                onClick: kpForceReload,
                loading: G,
                "aria-label": "Muat ulang"
              })
            ]
          })
        ]
      }),
      
      (0, a.jsx)(h.Dialog, {
  className: "kp-print-dialog",
  contentClassName: "kp-dialog-canvas",
  header: (0, a.jsxs)("div", {
    style: { display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", gap: "1rem", paddingRight: "0.5rem" },
    children: [
      (0, a.jsxs)("div", {
        style: { display: "flex", alignItems: "center", gap: "0.6rem" },
        children: [
          (0, a.jsx)("i", { className: "pi pi-file-pdf", style: { color: "#dc2626", fontSize: "1.3rem" } }),
          (0, a.jsxs)("div", {
            children: [
              (0, a.jsx)("div", { className: "kp-modal-header-title", children: "Cetak Lampiran Kinerja Perkara" }),
              (0, a.jsx)("div", { className: "kp-modal-header-sub", children: "Kertas A4 • Margin: Kiri 3cm, Atas 2cm, Kanan 2cm, Bawah 2cm • Font Tabel: 10pt" })
            ]
          })
        ]
      }),
      (0, a.jsxs)("div", {
        style: { display: "flex", gap: "0.5rem", alignItems: "center" },
        children: [
          (0, a.jsxs)("button", {
            type: "button",
            className: "kp-modal-btn",
            onClick: () => setPdfOrientation(v => v === "portrait" ? "landscape" : "portrait"),
            title: "Ubah orientasi kertas cetak",
            children: [
              (0, a.jsx)("i", { className: pdfOrientation === "landscape" ? "pi pi-file-o" : "pi pi-file", style: { fontSize: "0.85rem" } }),
              pdfOrientation === "landscape" ? "Mendatar (Landscape)" : "Tegak (Portrait)"
            ]
          }),
          (0, a.jsxs)("button", {
            type: "button",
            className: "kp-modal-btn",
            onClick: () => setPdfExpanded(v => !v),
            title: "Perbesar atau perkecil modal",
            children: [
              (0, a.jsx)("i", { className: pdfExpanded ? "pi pi-window-minimize" : "pi pi-window-maximize", style: { fontSize: "0.85rem" } }),
              pdfExpanded ? "Perkecil Tampilan" : "Perbesar Layar"
            ]
          }),
          (0, a.jsxs)("button", {
            type: "button",
            className: "p-button p-button-sm",
            onClick: kpPrintPdf,
            style: { background: "#dc2626", borderColor: "#dc2626", color: "#ffffff", fontWeight: 700, borderRadius: "8px", padding: "0.4rem 0.85rem", display: "inline-flex", alignItems: "center", gap: "0.4rem", cursor: "pointer" },
            children: [
              (0, a.jsx)("i", { className: "pi pi-print", style: { fontSize: "0.9rem" } }),
              "Cetak / Simpan PDF"
            ]
          })
        ]
      })
    ]
  }),
  visible: pdfModalOpen,
  onHide: () => setPdfModalOpen(!1),
  maximized: pdfExpanded,
  maximizable: !0,
  onMaximize: e => setPdfExpanded(e.maximized),
  style: pdfExpanded
    ? { width: "100vw", height: "100vh", maxWidth: "100vw", maxHeight: "100vh", margin: 0, top: 0, left: 0, borderRadius: 0 }
    : { width: "84rem", maxWidth: "96vw" },
  contentStyle: {
    overflow: "auto",
    height: pdfExpanded ? "calc(100vh - 125px)" : "auto",
    maxHeight: pdfExpanded ? "calc(100vh - 125px)" : "75vh",
    padding: "1.5rem"
  },
  footer: (0, a.jsxs)("div", {
    style: { display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" },
    children: [
      (0, a.jsxs)("div", {
        className: "kp-dialog-footer-text",
        children: [
          (0, a.jsx)("i", { className: "pi pi-info-circle", style: { color: "#3b82f6" } }),
          (0, a.jsx)("span", { children: "Kertas A4 default dengan margin: Kiri 3cm, Atas 2cm, Kanan 2cm, Bawah 2cm. Total Keseluruhan hanya di halaman terakhir." })
        ]
      }),
      (0, a.jsxs)("div", {
        style: { display: "flex", gap: "0.5rem" },
        children: [
          (0, a.jsx)("button", {
            type: "button",
            className: "kp-modal-btn",
            onClick: () => setPdfModalOpen(!1),
            children: "Tutup"
          }),
          (0, a.jsxs)("button", {
            type: "button",
            className: "p-button p-button-sm",
            onClick: kpPrintPdf,
            style: { background: "#dc2626", borderColor: "#dc2626", color: "#ffffff", fontWeight: 700, borderRadius: "8px", padding: "0.4rem 0.85rem", display: "inline-flex", alignItems: "center", gap: "0.4rem", cursor: "pointer" },
            children: [
              (0, a.jsx)("i", { className: "pi pi-print", style: { fontSize: "0.9rem" } }),
              "Cetak / Simpan PDF"
            ]
          })
        ]
      })
    ]
  }),
  modal: !0,
  dismissableMask: !1,
  children: (() => {
    let { rows: pRows, totalData: pTotal } = getTableDataForPrint(s, d);
    let tLines = getPdfTitleLines(pdfOrientation, pdfSatkerName, pdfPeriode, pdfCrimeFilter);
    return (0, a.jsxs)("div", {
      className: "kp-paper-canvas-wrap",
      children: [
        (0, a.jsx)("style", { children: "\n/* Light Mode Defaults */\n.kp-modal-header-title { font-weight: 800; font-size: 1.05rem; color: #0f172a; }\n.kp-modal-header-sub { font-size: 0.75rem; color: #64748b; margin-top: 1px; }\n.kp-modal-btn { background: #f8fafc; border: 1px solid #cbd5e1; color: #334155; border-radius: 8px; font-size: 0.8rem; font-weight: 700; padding: 0.4rem 0.75rem; cursor: pointer; display: inline-flex; align-items: center; gap: 0.45rem; transition: all 0.15s ease; font-family: inherit; }\n.kp-modal-btn:hover { background: #f1f5f9; color: #0f172a; border-color: #94a3b8; }\n.kp-dialog-canvas { background: #e2e8f0 !important; }\n.kp-dialog-footer-text { font-size: 0.78rem; color: #64748b; display: flex; align-items: center; gap: 0.4rem; }\n\n/* Dark Theme Overrides */\n:root[data-theme=\"dark\"] .kp-print-dialog .p-dialog-header { background: #111a2e !important; border-bottom: 1px solid #1f2b45 !important; }\n:root[data-theme=\"dark\"] .kp-modal-header-title { color: #f8fafc !important; }\n:root[data-theme=\"dark\"] .kp-modal-header-sub { color: #94a3b8 !important; }\n:root[data-theme=\"dark\"] .kp-modal-btn { background: #1e293b !important; border: 1px solid #334155 !important; color: #f1f5f9 !important; }\n:root[data-theme=\"dark\"] .kp-modal-btn:hover { background: #27354f !important; color: #ffffff !important; border-color: #475569 !important; }\n:root[data-theme=\"dark\"] .kp-dialog-canvas { background: #070d18 !important; }\n:root[data-theme=\"dark\"] .kp-print-dialog .p-dialog-footer { background: #111a2e !important; border-top: 1px solid #1f2b45 !important; }\n:root[data-theme=\"dark\"] .kp-dialog-footer-text { color: #94a3b8 !important; }\n\n/* Protected Authentic White A4 Paper Sheet */\n.kp-paper-sheet,\n:root[data-theme=\"dark\"] .p-dialog .kp-paper-sheet,\n:root[data-theme=\"dark\"] .kp-paper-sheet {\n  background-color: #ffffff !important;\n  color: #0f172a !important;\n  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.45) !important;\n  border: 1px solid #cbd5e1 !important;\n}\n.kp-paper-sheet .sheet-title-box,\n:root[data-theme=\"dark\"] .p-dialog .kp-paper-sheet .sheet-title-box {\n  text-align: center !important;\n  margin-bottom: 28px !important;\n}\n.kp-paper-sheet .kp-sheet-title-line,\n:root[data-theme=\"dark\"] .p-dialog .kp-paper-sheet .kp-sheet-title-line {\n  font-family: Arial, sans-serif !important;\n  font-size: 12pt !important;\n  font-weight: bold !important;\n  color: #0f172a !important;\n  text-transform: uppercase !important;\n  letter-spacing: 0.5px !important;\n  line-height: 1.35 !important;\n  margin: 2px 0 !important;\n  text-align: center !important;\n}\n.kp-paper-sheet table,\n:root[data-theme=\"dark\"] .p-dialog .kp-paper-sheet table {\n  width: 100% !important;\n  border-collapse: collapse !important;\n  background-color: #ffffff !important;\n  font-family: Arial, sans-serif !important;\n  font-size: 10pt !important;\n}\n.kp-paper-sheet th,\n:root[data-theme=\"dark\"] .p-dialog .kp-paper-sheet th {\n  background-color: #f1f5f9 !important;\n  color: #0f172a !important;\n  border: 1px solid #94a3b8 !important;\n  padding: 5px 4px !important;\n  font-family: Arial, sans-serif !important;\n  font-size: 10pt !important;\n  font-weight: bold !important;\n  text-align: center !important;\n}\n.kp-paper-sheet td,\n:root[data-theme=\"dark\"] .p-dialog .kp-paper-sheet td {\n  border: 1px solid #cbd5e1 !important;\n  padding: 4.5px 5px !important;\n  font-family: Arial, sans-serif !important;\n  font-size: 10pt !important;\n  color: #0f172a !important;\n}\n.kp-paper-sheet tr.kp-row-white td,\n:root[data-theme=\"dark\"] .p-dialog .kp-paper-sheet tr.kp-row-white td {\n  background-color: #ffffff !important;\n}\n.kp-paper-sheet tr.kp-row-zebra td,\n:root[data-theme=\"dark\"] .p-dialog .kp-paper-sheet tr.kp-row-zebra td {\n  background-color: #f8fafc !important;\n}\n.kp-paper-sheet tr.total-row td,\n:root[data-theme=\"dark\"] .p-dialog .kp-paper-sheet tr.total-row td {\n  background-color: #e2e8f0 !important;\n  color: #0f172a !important;\n  border: 1px solid #94a3b8 !important;\n  border-top: 2px solid #0f172a !important;\n  border-bottom: 2px solid #0f172a !important;\n  font-weight: bold !important;\n}\n.kp-paper-sheet .kp-sheet-footer,\n:root[data-theme=\"dark\"] .p-dialog .kp-paper-sheet .kp-sheet-footer {\n  margin-top: 24px !important;\n  padding-top: 6px !important;\n  border-top: 1px dashed #cbd5e1 !important;\n  display: flex !important;\n  justify-content: space-between !important;\n  align-items: flex-end !important;\n  font-size: 9pt !important;\n  color: #475569 !important;\n}\n.kp-paper-sheet .kp-sheet-footer strong,\n:root[data-theme=\"dark\"] .p-dialog .kp-paper-sheet .kp-sheet-footer strong {\n  color: #0f172a !important;\n}\n" }),
        (0, a.jsxs)("div", {
          className: "kp-paper-sheet",
          style: {
            backgroundColor: "#ffffff",
            color: "#0f172a",
            borderRadius: "6px",
            border: "1px solid #cbd5e1",
            boxShadow: "0 12px 36px rgba(0, 0, 0, 0.45)",
            padding: "20mm 20mm 15mm 30mm",
            margin: "0 auto",
            width: "100%",
            maxWidth: pdfExpanded ? "100%" : (pdfOrientation === "landscape" ? "1250px" : "850px"),
            minHeight: pdfOrientation === "landscape" ? "560px" : "750px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            fontFamily: "Arial, sans-serif"
          },
          children: [
            (0, a.jsxs)("div", {
              children: [
                (0, a.jsx)("div", {
                  className: "sheet-title-box",
                  style: {
                    textAlign: "center",
                    marginBottom: "28px",
                    paddingBottom: "2px"
                  },
                  children: tLines.map((line, idx) => (0, a.jsx)("div", {
                    key: idx,
                    className: "kp-sheet-title-line",
                    style: {
                      fontSize: "12pt",
                      fontWeight: "bold",
                      color: "#0f172a",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      margin: "2px 0",
                      lineHeight: 1.35
                    },
                    children: line
                  }))
                }),
                (0, a.jsx)("div", {
                  style: { overflowX: "auto" },
                  children: (0, a.jsxs)("table", {
                    style: {
                      width: "100%",
                      borderCollapse: "collapse",
                      fontFamily: "Arial, sans-serif",
                      fontSize: "10pt"
                    },
                    children: [
                      (0, a.jsx)("thead", {
                        children: (0, a.jsxs)("tr", {
                          style: { background: "#f1f5f9" },
                          children: [
                            (0, a.jsx)("th", { style: { width: "30px", border: "1px solid #94a3b8", padding: "5px 4px", textAlign: "center", fontWeight: "bold", fontSize: "10pt", color: "#0f172a" }, children: "NO" }),
                            (0, a.jsx)("th", { style: { border: "1px solid #94a3b8", padding: "5px 4px", textAlign: "left", fontWeight: "bold", fontSize: "10pt", color: "#0f172a" }, children: "SATKER / KESATUAN" }),
                            (0, a.jsx)("th", { style: { width: "65px", border: "1px solid #94a3b8", padding: "5px 4px", textAlign: "center", fontWeight: "bold", fontSize: "10pt", color: "#0f172a" }, children: "CT" }),
                            (0, a.jsx)("th", { style: { width: "65px", border: "1px solid #94a3b8", padding: "5px 4px", textAlign: "center", fontWeight: "bold", fontSize: "10pt", color: "#0f172a" }, children: "CA" }),
                            (0, a.jsx)("th", { style: { width: "65px", border: "1px solid #94a3b8", padding: "5px 4px", textAlign: "center", fontWeight: "bold", fontSize: "10pt", color: "#0f172a" }, children: "LE" }),
                            (0, a.jsx)("th", { style: { width: "65px", border: "1px solid #94a3b8", padding: "5px 4px", textAlign: "center", fontWeight: "bold", fontSize: "10pt", color: "#0f172a" }, children: "CP" }),
                            (0, a.jsx)("th", { style: { width: "55px", border: "1px solid #94a3b8", padding: "5px 4px", textAlign: "center", fontWeight: "bold", fontSize: "10pt", color: "#0f172a" }, children: "PR" }),
                            (0, a.jsx)("th", { style: { width: "65px", border: "1px solid #94a3b8", padding: "5px 4px", textAlign: "center", fontWeight: "bold", fontSize: "10pt", color: "#0f172a" }, children: "CC" }),
                            (0, a.jsx)("th", { style: { width: "55px", border: "1px solid #94a3b8", padding: "5px 4px", textAlign: "center", fontWeight: "bold", fontSize: "10pt", color: "#0f172a" }, children: "CR" }),
                            (0, a.jsx)("th", { style: { width: "95px", border: "1px solid #94a3b8", padding: "5px 4px", textAlign: "center", fontWeight: "bold", fontSize: "10pt", color: "#0f172a" }, children: "INDEKS KINERJA" })
                          ]
                        })
                      }),
                      (0, a.jsxs)("tbody", {
                        children: [
                          pRows.map((r, rIdx) => {
                            let ind = r.depth > 0 ? (r.depth * 14 + 6) + "px" : "6px";
                            let isAlt = rIdx % 2 === 1;
                            return (0, a.jsxs)("tr", {
                              key: r.id || rIdx,
                              className: isAlt ? "kp-row-zebra" : "kp-row-white",
                              style: { background: isAlt ? "#f8fafc" : "#ffffff" },
                              children: [
                                (0, a.jsx)("td", { style: { border: "1px solid #cbd5e1", padding: "4.5px 5px", textAlign: "center", fontSize: "10pt", color: "#0f172a" }, children: r.nomor || "" }),
                                (0, a.jsx)("td", { style: { border: "1px solid #cbd5e1", padding: "4.5px 5px", paddingLeft: ind, fontStyle: r.depth > 0 ? "italic" : "normal", fontWeight: r.depth > 0 ? 500 : 500, fontSize: "10pt", color: "#0f172a" }, children: r.nama || "-" }),
                                (0, a.jsx)("td", { style: { border: "1px solid #cbd5e1", padding: "4.5px 5px", textAlign: "right", fontWeight: "bold", fontSize: "10pt", color: "#1d4ed8" }, children: (r.ct ?? 0).toLocaleString("id-ID") }),
                                (0, a.jsx)("td", { style: { border: "1px solid #cbd5e1", padding: "4.5px 5px", textAlign: "right", fontSize: "10pt", color: "#0f172a" }, children: ((r.cp_berjalan_belum_update ?? 0) + (r.cp_tunggakan_belum_update ?? 0)).toLocaleString("id-ID") }),
                                (0, a.jsx)("td", { style: { border: "1px solid #cbd5e1", padding: "4.5px 5px", textAlign: "right", fontSize: "10pt", color: "#0f172a" }, children: (r.limpah_eksternal ?? 0).toLocaleString("id-ID") }),
                                (0, a.jsx)("td", { style: { border: "1px solid #cbd5e1", padding: "4.5px 5px", textAlign: "right", fontSize: "10pt", color: "#0f172a" }, children: ((r.cp_berjalan ?? 0) + (r.cp_tunggakan ?? 0)).toLocaleString("id-ID") }),
                                (0, a.jsx)("td", { style: { border: "1px solid #cbd5e1", padding: "4.5px 5px", textAlign: "center", fontSize: "10pt", color: "#0f172a" }, children: (r.pr ?? 0).toFixed(2) + "%" }),
                                (0, a.jsx)("td", { style: { border: "1px solid #cbd5e1", padding: "4.5px 5px", textAlign: "right", fontWeight: "bold", fontSize: "10pt", color: "#15803d" }, children: ((r.cc_aktual ?? 0) + (r.cc_tunggakan ?? 0)).toLocaleString("id-ID") }),
                                (0, a.jsx)("td", { style: { border: "1px solid #cbd5e1", padding: "4.5px 5px", textAlign: "center", fontWeight: "bold", fontSize: "10pt", color: "#0f172a" }, children: (r.cr ?? 0).toFixed(2) + "%" }),
                                (0, a.jsx)("td", { style: { border: "1px solid #cbd5e1", padding: "4.5px 5px", textAlign: "center", whiteSpace: "nowrap", fontSize: "10pt", color: "#0f172a" }, children: (r.indeks ?? 0).toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + (r.level ? " (LV " + r.level + ")" : " (-)") })
                              ]
                            });
                          }),
                          (0, a.jsxs)("tr", {
                            className: "total-row",
                            style: {
                              background: "#e2e8f0",
                              fontWeight: "bold",
                              borderTop: "2px solid #0f172a",
                              borderBottom: "2px solid #0f172a"
                            },
                            children: [
                              (0, a.jsx)("td", { colSpan: 2, style: { border: "1px solid #94a3b8", padding: "5px 8px", textAlign: "center", fontSize: "10pt", color: "#0f172a", fontWeight: "bold" }, children: "TOTAL KESELURUHAN" }),
                              (0, a.jsx)("td", { style: { border: "1px solid #94a3b8", padding: "5px 8px", textAlign: "right", fontSize: "10pt", color: "#1d4ed8", fontWeight: "bold" }, children: (pTotal?.ct ?? 0).toLocaleString("id-ID") }),
                              (0, a.jsx)("td", { style: { border: "1px solid #94a3b8", padding: "5px 8px", textAlign: "right", fontSize: "10pt", color: "#0f172a", fontWeight: "bold" }, children: ((pTotal?.cp_berjalan_belum_update ?? 0) + (pTotal?.cp_tunggakan_belum_update ?? 0)).toLocaleString("id-ID") }),
                              (0, a.jsx)("td", { style: { border: "1px solid #94a3b8", padding: "5px 8px", textAlign: "right", fontSize: "10pt", color: "#0f172a", fontWeight: "bold" }, children: (pTotal?.limpah_eksternal ?? 0).toLocaleString("id-ID") }),
                              (0, a.jsx)("td", { style: { border: "1px solid #94a3b8", padding: "5px 8px", textAlign: "right", fontSize: "10pt", color: "#0f172a", fontWeight: "bold" }, children: ((pTotal?.cp_berjalan ?? 0) + (pTotal?.cp_tunggakan ?? 0)).toLocaleString("id-ID") }),
                              (0, a.jsx)("td", { style: { border: "1px solid #94a3b8", padding: "5px 8px", textAlign: "center", fontSize: "10pt", color: "#0f172a", fontWeight: "bold" }, children: (pTotal?.pr ?? 0).toFixed(2) + "%" }),
                              (0, a.jsx)("td", { style: { border: "1px solid #94a3b8", padding: "5px 8px", textAlign: "right", fontSize: "10pt", color: "#15803d", fontWeight: "bold" }, children: ((pTotal?.cc_aktual ?? 0) + (pTotal?.cc_tunggakan ?? 0)).toLocaleString("id-ID") }),
                              (0, a.jsx)("td", { style: { border: "1px solid #94a3b8", padding: "5px 8px", textAlign: "center", fontSize: "10pt", color: "#0f172a", fontWeight: "bold" }, children: (pTotal?.cr ?? 0).toFixed(2) + "%" }),
                              (0, a.jsx)("td", { style: { border: "1px solid #94a3b8", padding: "5px 8px", textAlign: "center", fontSize: "10pt", color: "#0f172a", fontWeight: "bold" }, children: (pTotal?.indeks ?? 0).toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + (pTotal?.level ? " (LV " + pTotal.level + ")" : " (-)") })
                            ]
                          })
                        ]
                      })
                    ]
                  })
                })
              ]
            }),
            (0, a.jsxs)("div", {
              className: "kp-sheet-footer",
              style: {
                marginTop: "24px",
                paddingTop: "6px",
                borderTop: "1px dashed #cbd5e1",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "8.5pt",
                color: "#475569"
              },
              children: [
                (0, a.jsxs)("div", {
                  style: { display: "flex", alignItems: "center", flexWrap: "wrap" },
                  children: [
                    (0, a.jsx)("strong", { style: { color: "#0f172a" }, children: "Sumber Data: " }),
                    "CAS Bareskrim Polri",
                    (0, a.jsx)("span", { style: { margin: "0 6px", color: "#94a3b8" }, children: "•" }),
                    (0, a.jsx)("strong", { style: { color: "#0f172a" }, children: "Data per: " }),
                    pdfDataPer || "—",
                    (0, a.jsx)("span", { style: { margin: "0 6px", color: "#94a3b8" }, children: "•" }),
                    (0, a.jsx)("strong", { style: { color: "#0f172a" }, children: "Diambil: " }),
                    pdfWaktuCetak || "—"
                  ]
                }),
                (0, a.jsx)("div", {
                  style: { color: "#64748b", fontSize: "8.5pt", whiteSpace: "nowrap" },
                  children: "Halaman 1 dari N (otomatis saat dicetak)"
                })
              ]
            })
          ]
        })
      ]
    });
  })()
})
    ]
  });
})(),
(0,a.jsx)("div",{className:"kp-table-outer-wrap",style:{width:"100%",maxWidth:"100%",minWidth:0},children:(0,a.jsx)(n.TreeTable,{value:s,lazy:!0,loading:G,onExpand:ew,expandedKeys:X,onToggle:e=>q(e.value),emptyMessage:"Tidak ada data untuk periode ini.",showGridlines:!0,className:ee?"kp-tt kp-tt-detail":"kp-tt kp-tt-default",tableStyle:{width:"100%",minWidth:ee?"118rem":"76rem",fontSize:"0.78rem",tableLayout:"auto"},headerColumnGroup:(0,a.jsxs)(i,{children:[(0,a.jsxs)(u,{children:[(0,a.jsx)(r.Column,{header:"NO",rowSpan:2,className:"cas-sticky-col-1 kp-col-no",style:{...z,width:"2.8rem",minWidth:"2.8rem"}}),(0,a.jsx)(r.Column,{header:"SATKER",rowSpan:2,className:"cas-sticky-col-2 kp-col-satker",style:{...z,width:ee?"18rem":"17rem",minWidth:"14rem"}}),(0,a.jsx)(r.Column,{header:renderKpLabelWithTip("CT","ct","hdr1"),colSpan:1,style:{...z,minWidth:"4.5rem",whiteSpace:"nowrap"}}),(0,a.jsx)(r.Column,{header:renderKpLabelWithTip("CA","ca","hdr1"),colSpan:ee?3:1,style:{...z,minWidth:"4.6rem",whiteSpace:"nowrap"}}),(0,a.jsx)(r.Column,{header:renderKpLabelWithTip("LE","le","hdr1"),rowSpan:2,style:{...z,width:"4.4rem",minWidth:"4.4rem",whiteSpace:"nowrap"}}),(0,a.jsx)(r.Column,{header:renderKpLabelWithTip("CP","cp","hdr1"),colSpan:ee?3+2*I.length:3,style:{...z,whiteSpace:"nowrap"}}),(0,a.jsx)(r.Column,{header:renderKpLabelWithTip("PR","pr","hdr1"),colSpan:2,style:{...z,whiteSpace:"nowrap"}}),(0,a.jsx)(r.Column,{header:renderKpLabelWithTip("CC","cc","hdr1"),colSpan:ee?3+2*W.length:3,style:{...z,whiteSpace:"nowrap"}}),(0,a.jsx)(r.Column,{header:renderKpLabelWithTip("CR","cr","hdr1"),colSpan:2,style:{...z,whiteSpace:"nowrap"}}),(0,a.jsx)(r.Column,{header:renderKpLabelWithTip("INDEKS","indeks","hdr1"),rowSpan:2,style:{...z,width:"7.2rem",minWidth:"7.2rem",whiteSpace:"nowrap"}}),...ee?[(0,a.jsx)(r.Column,{header:renderKpLabelWithTip("PENDUDUK","penduduk","hdr1"),rowSpan:2,style:{...z,whiteSpace:"nowrap"}}),(0,a.jsx)(r.Column,{header:renderKpLabelWithTip("CRIME RATE","crime_rate","hdr1"),rowSpan:2,style:{...z,whiteSpace:"nowrap"}}),(0,a.jsx)(r.Column,{header:renderKpLabelWithTip("CRIME CLOCK","crime_clock","hdr1"),rowSpan:2,style:{...z,whiteSpace:"nowrap"}})]:[]]}),(0,a.jsx)(u,{children:[(0,a.jsx)(r.Column,{header:"TOTAL",style:{...D,minWidth:"4.5rem",whiteSpace:"nowrap"}},"ct-total"),(0,a.jsx)(r.Column,{header:"TOTAL",style:{...D,minWidth:"4.6rem",whiteSpace:"nowrap"}},"bu-total"),...ee?[(0,a.jsx)(r.Column,{header:renderKpLabelWithTip("AKT","ca_akt","hdr2"),style:{...N,minWidth:"4.6rem",whiteSpace:"nowrap"}},"bu-aktual"),(0,a.jsx)(r.Column,{header:renderKpLabelWithTip("TGK","ca_tgk","hdr2"),style:{...N,minWidth:"4.6rem",whiteSpace:"nowrap"}},"bu-tunggakan")]:[],(0,a.jsx)(r.Column,{header:"TOTAL",style:{...D,minWidth:"4.4rem",whiteSpace:"nowrap"}},"cp-gab"),(0,a.jsx)(r.Column,{header:renderKpLabelWithTip("AKT","cp_akt","hdr2"),style:{...D,minWidth:"4.5rem",whiteSpace:"nowrap"}},"cpa-total"),...ee?I.map(e=>(0,a.jsx)(r.Column,{header:e.label,style:N},`cpa-h-${e.key}`)):[],(0,a.jsx)(r.Column,{header:renderKpLabelWithTip("TGK","cp_tgk","hdr2"),style:{...D,minWidth:"4.5rem",whiteSpace:"nowrap"}},"cpt-total"),...ee?I.map(e=>(0,a.jsx)(r.Column,{header:e.label,style:N},`cpt-h-${e.key}`)):[],(0,a.jsx)(r.Column,{header:renderKpLabelWithTip("LAMA","pr_lama","hdr2"),style:{...D,minWidth:"4.8rem",whiteSpace:"nowrap"}},"pr-lama"),(0,a.jsx)(r.Column,{header:renderKpLabelWithTip("BARU","pr_baru","hdr2"),style:{...D,minWidth:"4.8rem",whiteSpace:"nowrap"}},"pr-baru"),(0,a.jsx)(r.Column,{header:"TOTAL",style:{...D,minWidth:"4.4rem",whiteSpace:"nowrap"}},"cc-gab"),(0,a.jsx)(r.Column,{header:renderKpLabelWithTip("AKT","cc_akt","hdr2"),style:{...D,minWidth:"4.5rem",whiteSpace:"nowrap"}},"cca-total"),...ee?W.map(e=>(0,a.jsx)(r.Column,{header:e.label,style:N},`cca-h-${e.key}`)):[],(0,a.jsx)(r.Column,{header:renderKpLabelWithTip("TGK","cc_tgk","hdr2"),style:{...D,minWidth:"4.5rem",whiteSpace:"nowrap"}},"cct-total"),...ee?W.map(e=>(0,a.jsx)(r.Column,{header:e.label,style:N},`cct-h-${e.key}`)):[],(0,a.jsx)(r.Column,{header:renderKpLabelWithTip("LAMA","cr_lama","hdr2"),style:{...D,minWidth:"4.8rem",whiteSpace:"nowrap"}},"cr-lama"),(0,a.jsx)(r.Column,{header:renderKpLabelWithTip("BARU","cr_baru","hdr2"),style:{...D,minWidth:"4.8rem",whiteSpace:"nowrap"}},"cr-baru")]})]}),children:[(0,a.jsx)(r.Column,{body:e=>e.data.nomor||"",className:"cas-sticky-col-1 kp-col-no",style:{width:"2.8rem",minWidth:"2.8rem",whiteSpace:"nowrap"},align:"center"},"no"),(0,a.jsx)(r.Column,{field:"nama",expander:!1,className:"cas-sticky-col-2 kp-col-satker",body:e=>{let isExp=!!X?.[e.key];return(0,a.jsxs)("div",{style:{display:"flex",alignItems:"flex-start",gap:"0.4rem",paddingLeft:"0px",width:"100%"},children:[e.data.has_children?(0,a.jsx)("button",{type:"button",className:`kp-plusminus-btn ${isExp?"is-expanded":""}`,onClick:t=>{t.stopPropagation();toggleTreeNode(e);},title:isExp?"Tutup sub-satker":"Buka sub-satker",children:isExp?"−":"+"}):(0,a.jsx)("span",{style:{display:"inline-block",width:"1.18rem",flexShrink:0}}),(0,a.jsxs)("span",{style:{fontWeight:e.data.has_children?700:500,whiteSpace:"normal",wordBreak:"break-word",overflowWrap:"anywhere",lineHeight:1.25,textAlign:"left"},title:e.data.nama,children:[(0,a.jsx)("span",{className:"kp-satker-name-full",children:e.data.nama}),(0,a.jsx)("span",{className:"kp-satker-name-short",children:e.data.singkatan||formatKpSatkerMobile(e.data.nama)})]})]});},style:{width:ee?"18rem":"17rem",minWidth:"14rem",maxWidth:ee?"22rem":"20rem",whiteSpace:"normal"}},"nama"),(0,a.jsx)(r.Column,{body:e=>renderMetricLink(e.data.ct??0,e.data,"ct","CT (Crime Total)",{color:"#1d4ed8"},!0),style:{minWidth:"4.5rem",background:"#eff6ff",whiteSpace:"nowrap"},align:"center"},"ct-total"),(0,a.jsx)(r.Column,{body:e=>renderMetricLink((e.data.cp_berjalan_belum_update??0)+(e.data.cp_tunggakan_belum_update??0),e.data,"sisa","CA (Crime Arrears / Sisa Belum Update)",{color:"#b45309"},!0),style:{minWidth:"4.6rem",background:"#fffbeb",whiteSpace:"nowrap"},align:"center"},"bu-total"),...ee?[(0,a.jsx)(r.Column,{body:e=>renderMetricLink(e.data.cp_berjalan_belum_update??0,e.data,"sisa_akt","CA Aktual (Belum Update)",{},!1),style:{minWidth:"4.6rem",background:"#fffbeb",whiteSpace:"nowrap"},align:"center"},"bu-aktual"),(0,a.jsx)(r.Column,{body:e=>renderMetricLink(e.data.cp_tunggakan_belum_update??0,e.data,"sisa_tgk","CA Tunggakan (Belum Update)",{},!1),style:{minWidth:"4.6rem",background:"#fffbeb",whiteSpace:"nowrap"},align:"center"},"bu-tunggakan")]:[],(0,a.jsx)(r.Column,{body:e=>renderMetricLink(e.data.limpah_eksternal??0,e.data,"limpah_eksternal","LE (Limpah Eksternal)",{color:"#7c3aed"},!0),style:{minWidth:"4.4rem",background:"#f5f3ff",whiteSpace:"nowrap"},align:"center"},"limpah-eksternal"),(0,a.jsx)(r.Column,{body:e=>renderMetricLink((e.data.cp_berjalan??0)+(e.data.cp_tunggakan??0),e.data,"cp","CP Total",{},!1),style:{minWidth:"4.4rem",whiteSpace:"nowrap"},align:"center"},"cp-gab"),(0,a.jsx)(r.Column,{body:e=>renderMetricLink(e.data.cp_berjalan??0,e.data,"cp_akt","CP Aktual (Berjalan)",{color:"#0891b2"},!1),style:{minWidth:"4.5rem",whiteSpace:"nowrap"},align:"center"},"cpa-total"),...ee?I.map(e=>(0,a.jsx)(r.Column,{body:t=>renderMetricLink(t.data.cp_berjalan_rincian?.[e.key]??0,t.data,`cp_akt_${e.key}`,`CP Aktual — ${e.label}`,{},!1),style:A,align:"center"},`cpa-${e.key}`)):[],(0,a.jsx)(r.Column,{body:e=>renderMetricLink(e.data.cp_tunggakan??0,e.data,"cp_tgk","CP Tunggakan",{color:"#dc2626"},!1),style:{minWidth:"4.5rem",whiteSpace:"nowrap"},align:"center"},"cpt-total"),...ee?I.map(e=>(0,a.jsx)(r.Column,{body:t=>renderMetricLink(t.data.cp_tunggakan_rincian?.[e.key]??0,t.data,`cp_tgk_${e.key}`,`CP Tunggakan — ${e.label}`,{},!1),style:A,align:"center"},`cpt-${e.key}`)):[],(0,a.jsx)(r.Column,{body:e=>(0,a.jsxs)("span",{style:{color:"#64748b"},children:[(e.data.pr_lama??0).toFixed(2),"%"]}),style:{minWidth:"4.8rem",whiteSpace:"nowrap"},align:"center"},"pr-lama"),(0,a.jsx)(r.Column,{body:e=>(0,a.jsxs)("span",{style:{color:"#0e7490"},children:[(e.data.pr??0).toFixed(2),"%"]}),style:{minWidth:"4.8rem",whiteSpace:"nowrap"},align:"center"},"pr-baru"),(0,a.jsx)(r.Column,{body:e=>renderMetricLink((e.data.cc_aktual??0)+(e.data.cc_tunggakan??0),e.data,"cc","CC Total",{},!1),style:{minWidth:"4.4rem",whiteSpace:"nowrap"},align:"center"},"cc-gab"),(0,a.jsx)(r.Column,{body:e=>renderMetricLink(e.data.cc_aktual??0,e.data,"cc_akt","CC Aktual",{color:"#16a34a"},!0),style:{minWidth:"4.5rem",whiteSpace:"nowrap"},align:"center"},"cca-total"),...ee?W.map(e=>(0,a.jsx)(r.Column,{body:t=>renderMetricLink(t.data.cc_aktual_rincian?.[e.key]??0,t.data,`cc_akt_${e.key}`,`CC Aktual — ${e.label}`,{},!1),style:A,align:"center"},`cca-${e.key}`)):[],(0,a.jsx)(r.Column,{body:e=>renderMetricLink(e.data.cc_tunggakan??0,e.data,"cc_tgk","CC Tunggakan",{color:"#b45309"},!0),style:{minWidth:"4.5rem",whiteSpace:"nowrap"},align:"center"},"cct-total"),...ee?W.map(e=>(0,a.jsx)(r.Column,{body:t=>renderMetricLink(t.data.cc_tunggakan_rincian?.[e.key]??0,t.data,`cc_tgk_${e.key}`,`CC Tunggakan — ${e.label}`,{},!1),style:A,align:"center"},`cct-${e.key}`)):[],(0,a.jsx)(r.Column,{body:e=>(0,a.jsxs)("span",{style:{color:"#64748b"},children:[(e.data.cr_lama??0).toFixed(2),"%"]}),style:{minWidth:"4.8rem",whiteSpace:"nowrap"},align:"center"},"cr-lama"),(0,a.jsx)(r.Column,{body:e=>(0,a.jsxs)("strong",{children:[(e.data.cr??0).toFixed(2),"%"]}),style:{minWidth:"4.8rem",whiteSpace:"nowrap"},align:"center"},"cr-baru"),(0,a.jsx)(r.Column,{body:e=>(0,a.jsxs)("div",{style:{display:"inline-flex",alignItems:"center",justifyContent:"center",gap:"0.35rem",flexWrap:"nowrap",whiteSpace:"nowrap"},children:[(0,a.jsx)("strong",{children:(e.data.indeks??0).toLocaleString("id-ID",{minimumFractionDigits:2,maximumFractionDigits:2})}),(0,a.jsx)(g.Tag,{value:`LV ${e.data.level??"-"}`,severity:$(e.data.level),style:{borderRadius:"6px",padding:"0.12rem 0.4rem",fontSize:"0.68rem",whiteSpace:"nowrap"}})]}),style:{width:"7.2rem",minWidth:"7.2rem",whiteSpace:"nowrap"},align:"center"},"indeks"),...ee?[(0,a.jsx)(r.Column,{body:e=>{let t=e.data;return t.jumlah_penduduk>0?(0,a.jsx)("span",{children:t.jumlah_penduduk.toLocaleString("id-ID")}):(0,a.jsx)("span",{style:{color:"var(--cas-text-muted, #64748b)"},title:"Data penduduk belum tersedia",children:"-"})},style:{minWidth:"8rem"},align:"center"},"jumlah-penduduk"),(0,a.jsx)(r.Column,{body:e=>{let t=e.data;return null!=t.crime_rate?(0,a.jsx)("span",{style:{color:"#7c3aed"},children:t.crime_rate.toLocaleString("id-ID")}):(0,a.jsx)("span",{style:{color:"var(--cas-text-muted, #64748b)"},title:"Data penduduk belum tersedia",children:"-"})},style:{minWidth:"6rem"},align:"center"},"crime-rate"),(0,a.jsx)(r.Column,{body:e=>{let t=e.data;return t.crime_clock?(0,a.jsx)("span",{style:{color:"#0891b2",whiteSpace:"nowrap"},children:t.crime_clock.label.replace("Selang ","")}):(0,a.jsx)("span",{style:{color:"var(--cas-text-muted, #64748b)"},children:"-"})},style:{minWidth:"9rem"},align:"center"},"crime-clock")]:[]]})})]}),(0,a.jsx)("p",{className:"kp-table-footnote",style:{fontSize:"0.72rem",color:"#94a3b8",margin:"0.25rem 0 0"},children:'Klik angka jumlah perkara untuk menampilkan daftar Laporan Polisi (LP). Sentuh/hover ikon (i) untuk melihat keterangan istilah & rumus. Klik tombol [+] / [−] untuk membuka/menutup sub-satker.'}),
(0,a.jsx)(h.Dialog,{className:"kp-lp-drill-dialog"+(lpModalExpanded?" is-expanded":""),header:(0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",gap:"0.6rem",paddingRight:"0.4rem"},children:[(0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.55rem",minWidth:0},children:[(0,a.jsx)("span",{style:{width:"2rem",height:"2rem",borderRadius:"8px",background:"rgba(37,99,235,0.12)",display:"inline-flex",alignItems:"center",justifyContent:"center",color:"#2563eb",flexShrink:0},children:(0,a.jsx)("i",{className:"pi pi-list",style:{fontSize:"1rem"}})}),(0,a.jsxs)("div",{style:{minWidth:0},children:[(0,a.jsx)("div",{style:{fontWeight:800,fontSize:"0.92rem",lineHeight:1.2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:`Daftar LP — ${lpModalTarget?.bucketLabel||lpModalTarget?.label||""}`}),(0,a.jsxs)("div",{style:{fontSize:"0.73rem",color:"#64748b",fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:[lpModalTarget?.satkerNama||""," • Total: ",(lpModalTotal||0).toLocaleString("id-ID")," LP"]})]})]}),(0,a.jsxs)("button",{type:"button",className:"kp-modal-btn kp-lp-expand-btn",onClick:()=>setLpModalExpanded(v=>!v),title:lpModalExpanded?"Kembalikan ukuran normal":"Perbesar tampilan layar penuh (Full Page)",style:{flexShrink:0,padding:"0.35rem 0.65rem",fontSize:"0.75rem"},children:[(0,a.jsx)("i",{className:lpModalExpanded?"pi pi-window-minimize":"pi pi-window-maximize",style:{fontSize:"0.8rem"}}),(0,a.jsx)("span",{className:"kp-btn-text-desktop",children:lpModalExpanded?"Perkecil":"Perbesar Full Page"})]})]}),visible:lpModalOpen,onHide:()=>{setLpModalOpen(!1);setLpModalExpanded(!1);},maximized:lpModalExpanded,style:lpModalExpanded?{width:"100vw",height:"100vh",maxWidth:"100vw",maxHeight:"100vh",margin:0,top:0,left:0,borderRadius:0}:{width:"74rem",maxWidth:"96vw"},modal:!0,dismissableMask:!0,children:(0,a.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.65rem",height:lpModalExpanded?"calc(100vh - 5.2rem)":"auto"},children:[(0,a.jsxs)("div",{style:{display:"flex",gap:"0.45rem",alignItems:"center",flexWrap:" nowrap"},children:[(0,a.jsxs)("div",{style:{position:"relative",flex:"1 1 auto",minWidth:0},children:[(0,a.jsx)("i",{className:"pi pi-search",style:{position:"absolute",left:"0.7rem",top:"50%",transform:"translateY(-50%)",color:"#64748b",fontSize:"0.82rem"}}),(0,a.jsx)("input",{type:"text",value:lpModalSearchInput,onChange:e=>setLpModalSearchInput(e.target.value),onKeyDown:e=>{if("Enter"===e.key&&lpModalTarget){fetchLpDrilldown(lpModalTarget,1,lpModalSearchInput);}},placeholder:"Cari Nomor LP, Satker, Jenis Kejahatan...",className:"p-inputtext p-component",style:{width:"100%",paddingLeft:"2.1rem",fontSize:"0.8rem",height:"2.15rem",borderRadius:"8px"}})]}),(0,a.jsx)(p.Button,{label:"Cari",icon:"pi pi-search",size:"small",className:"att-btn",onClick:()=>lpModalTarget&&fetchLpDrilldown(lpModalTarget,1,lpModalSearchInput),loading:lpModalLoading}),lpModalSearchInput&&(0,a.jsx)(p.Button,{icon:"pi pi-times",size:"small",outlined:!0,severity:"secondary",className:"att-btn",title:"Reset pencarian",onClick:()=>{setLpModalSearchInput("");lpModalTarget&&fetchLpDrilldown(lpModalTarget,1,"");}})]}),(0,a.jsx)("div",{className:"kp-lp-desktop-table-wrap",style:{border:"1px solid var(--cas-border-card, #e2e8f0)",borderRadius:"10px",overflow:"auto",flex:lpModalExpanded?"1 1 auto":void 0,maxHeight:lpModalExpanded?"calc(100vh - 11.5rem)":"62vh"},children:(0,a.jsxs)("table",{className:"kp-lp-drill-table",style:{width:"100%",borderCollapse:"collapse",fontSize:"0.8rem"},children:[(0,a.jsx)("thead",{children:(0,a.jsxs)("tr",{style:{background:"#16324f",color:"#ffffff",borderBottom:"1px solid #0f2438",position:"sticky",top:0,zIndex:2},children:[(0,a.jsx)("th",{style:{padding:"0.55rem 0.65rem",textAlign:"center",width:"3.2rem",color:"#ffffff",background:"#16324f"},children:"NO"}),(0,a.jsx)("th",{style:{padding:"0.55rem 0.65rem",textAlign:"left",minWidth:"13rem",color:"#ffffff",background:"#16324f"},children:"NOMOR LP"}),(0,a.jsx)("th",{style:{padding:"0.55rem 0.65rem",textAlign:"center",width:"7rem",color:"#ffffff",background:"#16324f"},children:"TANGGAL LP"}),(0,a.jsx)("th",{style:{padding:"0.55rem 0.65rem",textAlign:"left",minWidth:"12rem",color:"#ffffff",background:"#16324f"},children:"SATKER"}),(0,a.jsx)("th",{style:{padding:"0.55rem 0.65rem",textAlign:"left",minWidth:"11rem",color:"#ffffff",background:"#16324f"},children:"JENIS KEJAHATAN"}),(0,a.jsx)("th",{style:{padding:"0.55rem 0.65rem",textAlign:"center",width:"7.5rem",color:"#ffffff",background:"#16324f"},children:"STATUS"}),(0,a.jsx)("th",{style:{padding:"0.55rem 0.65rem",textAlign:"center",width:"6.5rem",color:"#ffffff",background:"#16324f"},children:"KESULITAN"}),(0,a.jsx)("th",{style:{padding:"0.55rem 0.65rem",textAlign:"center",width:"5.5rem",color:"#ffffff",background:"#16324f"},children:"AKSI"})]})}),(0,a.jsx)("tbody",{children:lpModalLoading?(0,a.jsx)("tr",{children:(0,a.jsx)("td",{colSpan:8,style:{padding:"2rem",textAlign:"center",color:"#64748b"},children:"Memuat daftar Laporan Polisi..."})}):0===lpModalItems.length?(0,a.jsx)("tr",{children:(0,a.jsx)("td",{colSpan:8,style:{padding:"2rem",textAlign:"center",color:"#64748b"},children:"Tidak ada data Laporan Polisi yang cocok."})}):lpModalItems.map((item,idx)=>{let rowNo=(lpModalPage-1)*20+idx+1,rawTgl=item.tanggal_lp||item.tgl_laporan,tglStr=rawTgl?String(rawTgl).slice(0,10):"-",noLp=item.nomor_lp||item.no_laporan||"-",satkerStr=item.nama_satker||item.satker_nama||"-",statusStr=item.status||item.status_nama||item.status_code||"-";return(0,a.jsxs)("tr",{style:{borderBottom:"1px solid var(--cas-border-card, #e2e8f0)"},children:[(0,a.jsx)("td",{style:{padding:"0.5rem 0.65rem",textAlign:"center",color:"#64748b"},children:rowNo}),(0,a.jsx)("td",{style:{padding:"0.5rem 0.65rem",fontWeight:700},children:item.pid?(0,a.jsx)("a",{href:`/cms/laporan-polisi/${item.pid}`,target:"_blank",rel:"noreferrer",style:{color:"#2563eb",textDecoration:"none"},children:noLp}):noLp}),(0,a.jsx)("td",{style:{padding:"0.5rem 0.65rem",textAlign:"center",whiteSpace:"nowrap"},children:tglStr}),(0,a.jsx)("td",{style:{padding:"0.5rem 0.65rem"},children:satkerStr}),(0,a.jsx)("td",{style:{padding:"0.5rem 0.65rem"},children:item.jenis_kejahatan||"-"}),(0,a.jsx)("td",{style:{padding:"0.5rem 0.65rem",textAlign:"center"},children:(0,a.jsx)("span",{style:{display:"inline-block",padding:"0.15rem 0.45rem",borderRadius:"6px",fontSize:"0.72rem",fontWeight:700,background:"rgba(37,99,235,0.1)",color:"#2563eb"},children:statusStr})}),(0,a.jsx)("td",{style:{padding:"0.5rem 0.65rem",textAlign:"center",fontSize:"0.75rem"},children:item.tingkat_kesulitan||"-"}),(0,a.jsx)("td",{style:{padding:"0.5rem 0.65rem",textAlign:"center"},children:item.pid?(0,a.jsxs)("a",{href:`/cms/laporan-polisi/${item.pid}`,target:"_blank",rel:"noreferrer",style:{display:"inline-flex",alignItems:"center",gap:"0.25rem",fontSize:"0.75rem",fontWeight:700,color:"#2563eb",textDecoration:"none"},children:["Detail ",(0,a.jsx)("i",{className:"pi pi-external-link",style:{fontSize:"0.7rem"}})]}):"-"})]},item.id||idx);})})]})}),(0,a.jsx)("div",{className:"kp-lp-mobile-list",style:{overflowY:"auto",flex:lpModalExpanded?"1 1 auto":void 0,maxHeight:lpModalExpanded?"calc(100vh - 11.5rem)":"64vh"},children:lpModalLoading?(0,a.jsx)("div",{style:{padding:"1.5rem",textAlign:"center",color:"#64748b",fontSize:"0.8rem"},children:"Memuat daftar Laporan Polisi..."}):0===lpModalItems.length?(0,a.jsx)("div",{style:{padding:"1.5rem",textAlign:"center",color:"#64748b",fontSize:"0.8rem"},children:"Tidak ada data Laporan Polisi yang cocok."}):lpModalItems.map((item,idx)=>{let rowNo=(lpModalPage-1)*20+idx+1,rawTgl=item.tanggal_lp||item.tgl_laporan,tglStr=rawTgl?String(rawTgl).slice(0,10):"-",noLp=item.nomor_lp||item.no_laporan||"-",satkerStr=item.nama_satker||item.satker_nama||"-",statusStr=item.status||item.status_nama||item.status_code||"-";return(0,a.jsxs)("div",{className:"kp-lp-mobile-card",children:[(0,a.jsxs)("div",{className:"kp-lp-mobile-card-top",children:[(0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.4rem",minWidth:0},children:[(0,a.jsxs)("span",{className:"kp-lp-mobile-no",children:["#",rowNo]}),item.pid?(0,a.jsx)("a",{href:`/cms/laporan-polisi/${item.pid}`,target:"_blank",rel:"noreferrer",className:"kp-lp-mobile-nolp",children:noLp}):(0,a.jsx)("span",{className:"kp-lp-mobile-nolp",children:noLp})]}),(0,a.jsx)("span",{className:"kp-lp-mobile-tgl",children:tglStr})]}),(0,a.jsxs)("div",{className:"kp-lp-mobile-card-mid",children:[(0,a.jsx)("span",{className:"kp-lp-mobile-satker",children:satkerStr}),(0,a.jsxs)("div",{style:{display:"inline-flex",gap:"0.3rem",alignItems:"center",flexShrink:0},children:[(0,a.jsx)("span",{className:"kp-lp-mobile-badge is-status",children:statusStr}),item.tingkat_kesulitan&&(0,a.jsx)("span",{className:"kp-lp-mobile-badge is-diff",children:item.tingkat_kesulitan})]})]}),(0,a.jsxs)("div",{className:"kp-lp-mobile-card-bot",children:[(0,a.jsx)("span",{className:"kp-lp-mobile-crime",children:item.jenis_kejahatan||"-"}),item.pid&&(0,a.jsxs)("a",{href:`/cms/laporan-polisi/${item.pid}`,target:"_blank",rel:"noreferrer",className:"kp-lp-mobile-link",children:["Detail ",(0,a.jsx)("i",{className:"pi pi-external-link",style:{fontSize:"0.65rem"}})]})]})]},item.id||idx);})}),(0,a.jsxs)("div",{className:"kp-lp-modal-footer",style:{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:"0.2rem",fontSize:"0.76rem",color:"#64748b",gap:"0.5rem",flexWrap:"wrap"},children:[(0,a.jsxs)("span",{children:["Hal ",lpModalPage,"/",lpModalTotalPages||1," • ",(lpModalTotal||0).toLocaleString("id-ID")," LP"]}),(0,a.jsxs)("div",{style:{display:"flex",gap:"0.35rem"},children:[(0,a.jsx)(p.Button,{label:"Prev",icon:"pi pi-chevron-left",size:"small",outlined:!0,className:"att-btn",disabled:lpModalPage<=1||lpModalLoading,onClick:()=>lpModalTarget&&fetchLpDrilldown(lpModalTarget,lpModalPage-1,lpModalSearchInput)}),(0,a.jsx)(p.Button,{label:"Next",icon:"pi pi-chevron-right",iconPos:"right",size:"small",outlined:!0,className:"att-btn",disabled:lpModalPage>=lpModalTotalPages||lpModalLoading,onClick:()=>lpModalTarget&&fetchLpDrilldown(lpModalTarget,lpModalPage+1,lpModalSearchInput)})]})]})]})}),
(0,a.jsx)(h.Dialog,{header:"Cara Perhitungan Kinerja Perkara",visible:Z,onHide:()=>Q(!1),style:{width:"42rem",maxWidth:"96vw"},modal:!0,children:(0,a.jsxs)("div",{style:{display:"grid",gap:"0.9rem",fontSize:"0.85rem",color:"#334155"},children:[(0,a.jsxs)("div",{className:"box",style:{background:"var(--cas-bg-subtle, #f8fafc)",border:"1px solid var(--cas-border-card, #e2e8f0)",borderRadius:8,padding:"0.6rem 0.8rem"},children:[(0,a.jsx)("strong",{children:"Acuan tanggal periode"}),'— filter "Acuan" di atas tabel menentukan tanggal mana yang dipakai untuk memilih LP masuk periode [from, to]:',(0,a.jsxs)("ul",{style:{margin:"0.35rem 0 0",paddingLeft:"1.1rem"},children:[(0,a.jsxs)("li",{children:[(0,a.jsx)("strong",{children:"Keduanya (default)"})," — sesuai ketentuan resmi: CT pakai tanggal mulai penanganan, CC pakai tanggal selesai (dua tanggal berbeda, bisa tumpang tindih)."]}),(0,a.jsxs)("li",{children:[(0,a.jsx)("strong",{children:"Tanggal Mulai Penanganan (LP)"})," — kohort: hanya LP yang mulai ditangani pada periode ini, lalu dipilah masih CP atau sudah CC."]}),(0,a.jsxs)("li",{children:[(0,a.jsx)("strong",{children:"Tanggal Selesai (CC)"})," — kohort: hanya LP yang selesai (CC) pada periode ini; CT = total kohort tsb, CP selalu 0."]})]})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("strong",{children:"CT (Crime Total)"})," — jumlah perkara yang mulai ditangani satker pada periode laporan, ditambah seluruh perkara yang belum pernah mencapai status CC (tetap dihitung CT di periode manapun sampai benar-benar selesai). ",(0,a.jsx)("em",{children:'(definisi ini berlaku pada mode acuan "Keduanya"; pada mode "Tanggal Mulai"/"Tanggal Selesai" CT mengikuti kohort sesuai acuan yang dipilih, lihat kotak di atas.)'})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("strong",{children:"CP (Crime Processed)"})," — perkara yang masih diproses pada akhir periode. ",(0,a.jsx)("strong",{children:"CP Berjalan"})," = belum lewat jatuh tempo; ",(0,a.jsx)("strong",{children:"CP Tunggakan"})," = sudah lewat jatuh tempo. CP tidak masuk langsung ke rumus CR, murni informasi kesehatan jatuh-tempo."]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("strong",{children:"CC (Crime Clearance)"})," — perkara yang selesai pada periode laporan (tanggal selesai mengikuti tanggal dokumen penetapan CC, bukan tanggal sistem memproses). ",(0,a.jsx)("strong",{children:"CC Aktual"})," = selesai sebelum/tepat jatuh tempo; ",(0,a.jsx)("strong",{children:"CC Tunggakan"})," = selesai setelah lewat jatuh tempo."]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("strong",{children:"PR (Processed Rate)"})," — pasangan CP thd CR: indikator persentase yang berasal dari CP, sedangkan CR berasal dari CC. PR tidak masuk ke rumus CR maupun dasar Level/Indeks.",(0,a.jsx)("div",{style:{background:"var(--cas-bg-subtle, #f8fafc)",border:"1px solid var(--cas-border-card, #e2e8f0)",borderRadius:6,padding:"0.4rem 0.7rem",margin:"0.3rem 0",fontFamily:"monospace"},children:"PR Lama = CP / CT × 100%"}),(0,a.jsx)("div",{style:{background:"#f0fdff",border:"1px solid #a5f3fc",borderRadius:6,padding:"0.4rem 0.7rem",margin:"0.3rem 0",fontFamily:"monospace"},children:"PR Baru = (CP Aktual + CP Tunggakan) / (CT + CP Tunggakan) × 100%"}),(0,a.jsx)("span",{style:{fontSize:"0.8rem",color:"#64748b"},children:"Kalau CT + CP Tunggakan = 0, PR ditetapkan 0."})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("strong",{children:"Batas waktu per tingkat kesulitan"})," (jatuh tempo = tanggal mulai penanganan + batas hari):",(0,a.jsx)("table",{style:{width:"100%",marginTop:"0.4rem",borderCollapse:"collapse",fontSize:"0.82rem"},children:(0,a.jsx)("tbody",{children:[["Mudah (default)","30 hari"],["Sedang","60 hari"],["Sulit","90 hari"],["Sangat Sulit","120 hari"]].map(([e,t])=>(0,a.jsxs)("tr",{children:[(0,a.jsx)("td",{style:{padding:"0.25rem 0.5rem",border:"1px solid #e2e8f0"},children:e}),(0,a.jsx)("td",{style:{padding:"0.25rem 0.5rem",border:"1px solid #e2e8f0"},children:t})]},e))})})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("strong",{children:"Rumus CR Lama"})," (rekap status LP saat ini dari modul Anev CT/CC — dasar hitungnya beda dari CT/CC Kinerja Perkara di atas, ditampilkan sbg pembanding saja, tidak dipakai utk Level/Indeks):",(0,a.jsx)("div",{style:{background:"var(--cas-bg-subtle, #f8fafc)",border:"1px solid var(--cas-border-card, #e2e8f0)",borderRadius:6,padding:"0.4rem 0.7rem",margin:"0.3rem 0",fontFamily:"monospace"},children:"CR Lama = CC / CT × 100%"})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("strong",{children:"Rumus CR Baru"}),"(resmi TW IV 2025, dipakai jg utk Level & Indeks):",(0,a.jsx)("div",{style:{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:6,padding:"0.4rem 0.7rem",margin:"0.3rem 0",fontFamily:"monospace"},children:"CR Baru = (CC Aktual + CC Tunggakan) / (CT + CC Tunggakan) × 100%"}),(0,a.jsx)("span",{style:{fontSize:"0.8rem",color:"#64748b"},children:"CR boleh melebihi 100% (tidak dipotong utk tampilan, hanya dibatasi maks 100 khusus utk perhitungan Indeks)."})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("strong",{children:"Contoh CR Baru"})," (CC Aktual=80, CC Tunggakan=20, CT=100):",(0,a.jsxs)("div",{style:{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:6,padding:"0.4rem 0.7rem",margin:"0.3rem 0",fontFamily:"monospace"},children:["(80+20) / (100+20) = 0,8333 atau ",(0,a.jsx)("strong",{children:"83,33%"})]}),(0,a.jsx)("span",{style:{fontSize:"0.8rem",color:"#64748b"},children:"CR Baru dan CR Lama berasal dari data yang berbeda (lihat rumus masing-masing di atas), jadi tidak diperbandingkan langsung dengan angka yang sama."})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("strong",{children:"Level & Indeks"})," (interpolasi linear ",(0,a.jsx)("code",{children:"Indeks = A×CR + B"}),", dihitung dari CR Baru, CR dibatasi maks 100 khusus utk indeks):",(0,a.jsxs)("table",{style:{width:"100%",marginTop:"0.4rem",borderCollapse:"collapse",fontSize:"0.82rem"},children:[(0,a.jsx)("thead",{children:(0,a.jsxs)("tr",{children:[(0,a.jsx)("th",{style:{padding:"0.25rem 0.5rem",border:"1px solid #e2e8f0",textAlign:"left"},children:"Level"}),(0,a.jsx)("th",{style:{padding:"0.25rem 0.5rem",border:"1px solid #e2e8f0",textAlign:"left"},children:"Rentang CR"}),(0,a.jsx)("th",{style:{padding:"0.25rem 0.5rem",border:"1px solid #e2e8f0",textAlign:"left"},children:"Rentang Indeks"})]})}),(0,a.jsx)("tbody",{children:[["1","CR < 30%","1,00 – <2,00"],["2","30% – <55%","2,00 – <3,00"],["3","55% – <85%","3,00 – <4,25"],["4","85% – <95%","4,25 – <4,75"],["5","CR ≥ 95%","4,75 – 5,00"]].map(e=>(0,a.jsx)("tr",{children:e.map((e,t)=>(0,a.jsx)("td",{style:{padding:"0.25rem 0.5rem",border:"1px solid #e2e8f0"},children:e},t))},e[0]))})]})]}),(0,a.jsxs)("div",{style:{background:"var(--cas-bg-subtle, #f8fafc)",border:"1px solid var(--cas-border-card, #e2e8f0)",borderRadius:8,padding:"0.6rem 0.8rem",fontSize:"0.8rem",color:"#64748b"},children:[(0,a.jsx)("strong",{children:"Catatan penyesuaian:"}),'berbeda dari dokumen ketentuan aslinya, perkara yang belum pernah mencapai status CC tetap dihitung sebagai CT di periode manapun sedang dilihat (bukan cuma sekali di periode ia mulai lalu berpindah jadi CP Tunggakan). Data diperbarui otomatis tiap 30 menit dari tabel snapshot terpisah (tidak membebani transaksi Laporan Polisi); gunakan tombol "Refresh Sekarang" untuk data real-time.']}),(0,a.jsxs)("div",{children:[(0,a.jsx)("strong",{children:"Crime Rate"}),'— indikator jumlah kejahatan per 100.000 penduduk pada wilayah & periode yang dipilih (kartu "Tingkat Risiko Kejahatan"):',(0,a.jsx)("div",{style:{background:"var(--cas-bg-subtle, #f8fafc)",border:"1px solid var(--cas-border-card, #e2e8f0)",borderRadius:6,padding:"0.4rem 0.7rem",margin:"0.3rem 0",fontFamily:"monospace"},children:"Crime Rate = (CT / Jumlah Penduduk) × 100.000"}),(0,a.jsxs)("ul",{style:{margin:"0.35rem 0 0",paddingLeft:"1.1rem"},children:[(0,a.jsx)("li",{children:"CT memakai nilai CT pada scope/filter yang sama dengan tabel di atas."}),(0,a.jsx)("li",{children:"Jumlah penduduk dijumlah dari data yang diisi manual per satker (menu Struktur Satker) — isi hanya di SATU level per wilayah (biasanya Polres/Polsek), jangan diisi lagi di induk/anaknya untuk wilayah yang sama supaya tidak dobel-hitung."}),(0,a.jsx)("li",{children:"Dihitung presisi penuh, ditampilkan dibulatkan ke bilangan bulat terdekat (satuan Orang)."}),(0,a.jsx)("li",{children:'Kalau data penduduk kosong/0, tidak dibagi — kartu menampilkan "-" dan keterangan "Data penduduk belum tersedia".'})]})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("strong",{children:"Crime Clock"}),'— rata-rata selang waktu terjadinya satu kejahatan dalam periode yang dipilih (kartu "Indeks Waktu Kejahatan"):',(0,a.jsx)("div",{style:{background:"var(--cas-bg-subtle, #f8fafc)",border:"1px solid var(--cas-border-card, #e2e8f0)",borderRadius:6,padding:"0.4rem 0.7rem",margin:"0.3rem 0",fontFamily:"monospace"},children:"Crime Clock = Total Detik dalam Periode / CT"}),(0,a.jsxs)("ul",{style:{margin:"0.35rem 0 0",paddingLeft:"1.1rem"},children:[(0,a.jsxs)("li",{children:["Total detik periode dihitung inklusif kedua tanggal: jumlah hari × 86.400.",x?.periode_hari_inklusif?` Periode saat ini = ${x.periode_hari_inklusif} hari.`:""]}),(0,a.jsx)("li",{children:"Hasil dikonversi ke hari/jam/menit/detik; bagian bernilai 0 tidak ditampilkan, detik dibulatkan di tahap akhir."}),(0,a.jsx)("li",{children:'Kalau CT = 0, kartu menampilkan "Belum Ada Data Kejahatan".'})]})]})]})})]})}],64873)}]);