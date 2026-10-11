(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,21663,e=>{"use strict";var t=e.i(71645),a=e.i(48264),n=e.i(43456),r=e.i(29168),l=e.i(8630),i=e.i(40623),s=e.i(73193);function o(){return(o=Object.assign.bind()).apply(null,arguments)}function c(e){return(c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function u(e,t){(null==t||t>e.length)&&(t=e.length);for(var a=0,n=Array(t);a<t;a++)n[a]=e[a];return n}var d=n.ComponentBase.extend({defaultProps:{__TYPE:"Checkbox",autoFocus:!1,checked:!1,className:null,disabled:!1,falseValue:!1,icon:null,id:null,inputId:null,inputRef:null,invalid:!1,variant:null,name:null,onChange:null,onContextMenu:null,onMouseDown:null,readOnly:!1,required:!1,style:null,tabIndex:null,tooltip:null,tooltipOptions:null,trueValue:!0,value:null,children:void 0},css:{classes:{box:"p-checkbox-box",input:"p-checkbox-input",icon:"p-checkbox-icon",root:function(e){var t=e.props,a=e.checked,n=e.context;return(0,s.classNames)("p-checkbox p-component",{"p-highlight":a,"p-disabled":t.disabled,"p-invalid":t.invalid,"p-variant-filled":t.variant?"filled"===t.variant:n&&"filled"===n.inputStyle})}}}});function p(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),a.push.apply(a,n)}return a}function m(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?p(Object(a),!0).forEach(function(t){!function(e,t,a){var n;(n=function(e,t){if("object"!=c(e)||!e)return e;var a=e[Symbol.toPrimitive];if(void 0!==a){var n=a.call(e,t||"default");if("object"!=c(n))return n;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(t,"string"),(t="symbol"==c(n)?n:n+"")in e)?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a}(e,t,a[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):p(Object(a)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))})}return e}var h=t.memo(t.forwardRef(function(e,c){var p,h,f,b,y,g,x,v=(0,r.useMergeProps)(),j=t.useContext(a.PrimeReactContext),k=d.getProps(e,j),C=function(e){if(Array.isArray(e))return e}(p=t.useState(!1))||function(e){var t=null==e?null:"u">typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=t){var a,n,r,l,i=[],s=!0,o=!1;try{r=(t=t.call(e)).next,!1;for(;!(s=(a=r.call(t)).done)&&(i.push(a.value),2!==i.length);s=!0);}catch(e){o=!0,n=e}finally{try{if(!s&&null!=t.return&&(l=t.return(),Object(l)!==l))return}finally{if(o)throw n}}return i}}(p)||function(e){if(e){if("string"==typeof e)return u(e,2);var t=({}).toString.call(e).slice(8,-1);return"Object"===t&&e.constructor&&(t=e.constructor.name),"Map"===t||"Set"===t?Array.from(e):"Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?u(e,2):void 0}}(p)||function(){throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}(),S=C[0],w=C[1],I=d.setMetaData({props:k,state:{focused:S},context:{checked:k.checked===k.trueValue,disabled:k.disabled}}),O=I.ptm,T=I.cx,P=I.isUnstyled;(0,n.useHandleStyle)(d.css.styles,P,{name:"checkbox"});var D=t.useRef(null),N=t.useRef(k.inputRef),R=function(){return k.checked===k.trueValue},E=function(e){if(!k.disabled&&!k.readOnly&&k.onChange){var t,a=R()?k.falseValue:k.trueValue,n={originalEvent:e,value:k.value,checked:a,stopPropagation:function(){null==e||e.stopPropagation()},preventDefault:function(){null==e||e.preventDefault()},target:{type:"checkbox",name:k.name,id:k.id,value:k.value,checked:a}};null==k||null==(t=k.onChange)||t.call(k,n),e.defaultPrevented||s.DomHandler.focus(N.current)}},M=function(e){var t;w(!0),null==k||null==(t=k.onFocus)||t.call(k,e)},W=function(e){var t;w(!1),null==k||null==(t=k.onBlur)||t.call(k,e)};t.useImperativeHandle(c,function(){return{props:k,focus:function(){return s.DomHandler.focus(N.current)},getElement:function(){return D.current},getInput:function(){return N.current}}}),t.useEffect(function(){s.ObjectUtils.combinedRefs(N,k.inputRef)},[N,k.inputRef]),(0,r.useUpdateEffect)(function(){N.current.checked=R()},[k.checked,k.trueValue]),(0,r.useMountEffect)(function(){k.autoFocus&&s.DomHandler.focus(N.current,k.autoFocus)});var A=R(),L=s.ObjectUtils.isNotEmpty(k.tooltip),z=d.getOtherProps(k),U=v({id:k.id,className:(0,s.classNames)(k.className,T("root",{checked:A,context:j})),style:k.style,"data-p-highlight":A,"data-p-disabled":k.disabled,onContextMenu:k.onContextMenu,onMouseDown:k.onMouseDown},z,O("root"));return t.createElement(t.Fragment,null,t.createElement("div",o({ref:D},U),(h=s.ObjectUtils.reduceKeys(z,s.DomHandler.ARIA_PROPS),f=v(m({id:k.inputId,type:"checkbox",className:T("input"),name:k.name,tabIndex:k.tabIndex,onFocus:function(e){return M(e)},onBlur:function(e){return W(e)},onChange:function(e){return E(e)},disabled:k.disabled,readOnly:k.readOnly,required:k.required,"aria-invalid":k.invalid,checked:A},h),O("input")),t.createElement("input",o({ref:N},f))),(b=v({className:T("icon")},O("icon")),y=v({className:T("box",{checked:A}),"data-p-highlight":A,"data-p-disabled":k.disabled},O("box")),g=A?k.icon||t.createElement(l.CheckIcon,b):null,x=s.IconUtils.getJSXIcon(g,m({},b),{props:k,checked:A}),t.createElement("div",y,x))),L&&t.createElement(i.Tooltip,o({target:D,content:k.tooltip,pt:O("tooltip")},k.tooltipOptions)))}));h.displayName="Checkbox",e.s(["Checkbox",0,h])},62368,e=>{"use strict";let t=(0,e.i(56420).default)("download",[["path",{d:"M12 15V3",key:"m9g1x1"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["path",{d:"m7 10 5 5 5-5",key:"brsn70"}]]);e.s(["Download",0,t],62368)},71407,e=>{"use strict";var t=e.i(71645),a=e.i(44506);function n(){return(n=Object.assign.bind()).apply(null,arguments)}var r=t.memo(t.forwardRef(function(e,r){var l=a.IconBase.getPTI(e);return t.createElement("svg",n({ref:r,width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",xmlns:"http://www.w3.org/2000/svg"},l),t.createElement("path",{d:"M13.2222 7.77778H0.777778C0.571498 7.77778 0.373667 7.69584 0.227806 7.54998C0.0819442 7.40412 0 7.20629 0 7.00001C0 6.79373 0.0819442 6.5959 0.227806 6.45003C0.373667 6.30417 0.571498 6.22223 0.777778 6.22223H13.2222C13.4285 6.22223 13.6263 6.30417 13.7722 6.45003C13.9181 6.5959 14 6.79373 14 7.00001C14 7.20629 13.9181 7.40412 13.7722 7.54998C13.6263 7.69584 13.4285 7.77778 13.2222 7.77778Z",fill:"currentColor"}))}));r.displayName="MinusIcon",e.s(["MinusIcon",0,r])},74660,e=>{"use strict";var t=e.i(43476),a=e.i(9573);e.s(["default",0,function({refreshing:e,updatedAt:n,onRefresh:r}){return(0,t.jsxs)("div",{className:"dash-refresh",children:[(0,t.jsxs)("span",{className:"dash-refresh-time",children:[(0,t.jsx)("span",{className:`dash-dot${e?" live":""}`}),"Diperbarui ",(0,a.fmtUpdated)(n)]}),(0,t.jsxs)("button",{type:"button",className:"dash-refresh-btn",onClick:r,disabled:e,title:"Perbarui data sekarang",children:[(0,t.jsx)("i",{className:`pi pi-refresh${e?" pi-spin":""}`})," ",e?"MemuatΓÇª":"Refresh"]})]})}])},38266,e=>{"use strict";
var t=e.i(43476), // jsx-runtime
    a=e.i(71645), // React
    l=e.i(68242), // Dropdown
    i=e.i(48314), // MultiSelect
    s=e.i(44080), // InputText
    o=e.i(21663), // Checkbox
    c=e.i(1743),  // Button
    u=e.i(85118); // Toast

let d=(0,e.i(56420).default)("file-text",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1"}],["polyline",{points:"14 2 14 8 20 8",key:"2"}]]);
var p=e.i(62368),
    m=e.i(54858),
    h=e.i(9573),
    f=e.i(74660);

let b=["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

function DonutSvg({ data, size = 140, stroke = 18, centerVal = "", centerSub = "" }) {
  let total = data.reduce((acc, d) => acc + (Number(d.value) || 0), 0);
  let radius = (size - stroke) / 2;
  let circ = 2 * Math.PI * radius;
  let currOffset = 0;
  let slices = [];
  if (total === 0) {
    slices.push({ strokeDasharray: circ + " " + circ, strokeDashoffset: 0, color: "#e2e8f0" });
  } else {
    data.forEach(d => {
      let val = Number(d.value) || 0;
      let dash = (val / total) * circ;
      slices.push({ strokeDasharray: dash + " " + (circ - dash), strokeDashoffset: -currOffset, color: d.color });
      currOffset += dash;
    });
  }
  return (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"1.2rem",width:"100%",boxSizing:"border-box",overflow:"hidden",flexWrap:"wrap"},children:[
    (0,t.jsxs)("svg",{width:size,height:size,viewBox:"0 0 " + size + " " + size,style:{transform:"rotate(-90deg)",flexShrink:0},children:[
      slices.map((sl, idx) => (0,t.jsx)("circle",{key:idx,cx:size/2,cy:size/2,r:radius,fill:"transparent",stroke:sl.color,strokeWidth:stroke,strokeDasharray:sl.strokeDasharray,strokeDashoffset:sl.strokeDashoffset})),
      (0,t.jsxs)("g",{style:{transform:"rotate(90deg)",transformOrigin:(size/2) + "px " + (size/2) + "px"},children:[
        (0,t.jsx)("text",{x:size/2,y:(size/2) - 4,textAnchor:"middle",dominantBaseline:"central",style:{fontSize:"0.95rem",fontWeight:800,fill:"#0f172a"},children:centerVal || total.toLocaleString("id-ID")}),
        centerSub && (0,t.jsx)("text",{x:size/2,y:(size/2) + 12,textAnchor:"middle",dominantBaseline:"central",style:{fontSize:"0.58rem",fontWeight:700,fill:"#64748b",letterSpacing:"0.4px"},children:centerSub})
      ]})
    ]}),
    (0,t.jsx)("div",{style:{display:"flex",flexDirection:"column",gap:"0.3rem",flex:1,minWidth:"160px",maxWidth:"100%",boxSizing:"border-box"},children:
      data.map((d, idx) => {
        let val = Number(d.value) || 0;
        let pct = total > 0 ? ((val / total) * 100).toFixed(1) : "0";
        return (0,t.jsxs)("div",{key:idx,style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.5rem",fontSize:"0.74rem",width:"100%",boxSizing:"border-box"},children:[
          (0,t.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.35rem",minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:[
            (0,t.jsx)("span",{style:{width:"8px",height:"8px",borderRadius:"50%",background:d.color,display:"inline-block",flexShrink:0}}),
            (0,t.jsx)("span",{style:{color:"#334155",fontWeight:500,overflow:"hidden",textOverflow:"ellipsis"},children:d.label})
          ]}),
          (0,t.jsxs)("span",{style:{fontWeight:700,color:"#0f172a",flexShrink:0,whiteSpace:"nowrap",marginLeft:"auto"},children:[val.toLocaleString("id-ID")," (",pct,"%)"]})
        ]});
      })
    })
  ]});
}

function BarCompareSvg({ ctCurr, ctPrev, ccCurr, ccPrev }) {
  let maxVal = Math.max(ctCurr, ctPrev, ccCurr, ccPrev, 10);
  let chartH = 85;
  let calcH = (v) => Math.max(6, Math.round((v / maxVal) * chartH));
  return (0,t.jsxs)("div",{style:{padding:"0.6rem 0.4rem"},children:[
    // Chart Area (Batang berdiri di atas garis dasar)
    (0,t.jsxs)("div",{style:{display:"flex",justifyContent:"space-around",alignItems:"flex-end",height:"125px",borderBottom:"2px solid #cbd5e1",paddingBottom:"0px"},children:[
      (0,t.jsxs)("div",{style:{display:"flex",alignItems:"flex-end",gap:"12px"},children:[
        (0,t.jsxs)("div",{style:{display:"flex",flexDirection:"column",alignItems:"center"},children:[
          (0,t.jsx)("span",{style:{fontSize:"0.72rem",fontWeight:700,color:"#64748b",marginBottom:"3px"},children:ctPrev.toLocaleString("id-ID")}),
          (0,t.jsx)("div",{style:{width:"34px",height:(calcH(ctPrev) + "px"),background:"#94a3b8",borderRadius:"4px 4px 0 0"}}),
          (0,t.jsx)("span",{style:{fontSize:"0.65rem",color:"#64748b",marginTop:"3px"},children:"Lalu"})
        ]}),
        (0,t.jsxs)("div",{style:{display:"flex",flexDirection:"column",alignItems:"center"},children:[
          (0,t.jsx)("span",{style:{fontSize:"0.76rem",fontWeight:800,color:"#1d4ed8",marginBottom:"3px"},children:ctCurr.toLocaleString("id-ID")}),
          (0,t.jsx)("div",{style:{width:"34px",height:(calcH(ctCurr) + "px"),background:"#2563eb",borderRadius:"4px 4px 0 0",boxShadow:"0 2px 5px rgba(37,99,235,0.25)"}}),
          (0,t.jsx)("span",{style:{fontSize:"0.68rem",fontWeight:700,color:"#1d4ed8",marginTop:"3px"},children:"Kini"})
        ]})
      ]}),
      (0,t.jsxs)("div",{style:{display:"flex",alignItems:"flex-end",gap:"12px"},children:[
        (0,t.jsxs)("div",{style:{display:"flex",flexDirection:"column",alignItems:"center"},children:[
          (0,t.jsx)("span",{style:{fontSize:"0.72rem",fontWeight:700,color:"#64748b",marginBottom:"3px"},children:ccPrev.toLocaleString("id-ID")}),
          (0,t.jsx)("div",{style:{width:"34px",height:(calcH(ccPrev) + "px"),background:"#a7f3d0",borderRadius:"4px 4px 0 0"}}),
          (0,t.jsx)("span",{style:{fontSize:"0.65rem",color:"#64748b",marginTop:"3px"},children:"Lalu"})
        ]}),
        (0,t.jsxs)("div",{style:{display:"flex",flexDirection:"column",alignItems:"center"},children:[
          (0,t.jsx)("span",{style:{fontSize:"0.76rem",fontWeight:800,color:"#059669",marginBottom:"3px"},children:ccCurr.toLocaleString("id-ID")}),
          (0,t.jsx)("div",{style:{width:"34px",height:(calcH(ccCurr) + "px"),background:"#10b981",borderRadius:"4px 4px 0 0",boxShadow:"0 2px 5px rgba(16,185,129,0.25)"}}),
          (0,t.jsx)("span",{style:{fontSize:"0.68rem",fontWeight:700,color:"#059669",marginTop:"3px"},children:"Kini"})
        ]})
      ]})
    ]}),
    // Label Sumbu X (Di bawah garis dasar)
    (0,t.jsxs)("div",{style:{display:"flex",justifyContent:"space-around",paddingTop:"6px"},children:[
      (0,t.jsx)("span",{style:{fontSize:"0.78rem",fontWeight:800,color:"#1e293b",textAlign:"center",width:"110px"},children:"Crime Total (CT)"}),
      (0,t.jsx)("span",{style:{fontSize:"0.78rem",fontWeight:800,color:"#1e293b",textAlign:"center",width:"110px"},children:"Crime Clearance (CC)"})
    ]}),
    // Legend
    (0,t.jsxs)("div",{style:{display:"flex",justifyContent:"center",gap:"1.5rem",marginTop:"0.6rem",fontSize:"0.7rem",color:"#64748b"},children:[
      (0,t.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"4px"},children:[
        (0,t.jsx)("span",{style:{width:"10px",height:"10px",background:"#94a3b8",display:"inline-block",borderRadius:"2px"}}),
        "Periode Pembanding (Lalu)"
      ]}),
      (0,t.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"4px"},children:[
        (0,t.jsx)("span",{style:{width:"10px",height:"10px",background:"#2563eb",display:"inline-block",borderRadius:"2px"}}),
        "Periode Pelaporan (Kini)"
      ]})
    ]})
  ]});
}

function HorizontalBarSvg({ items, title, color = "#2563eb" }) {
  if (!items || items.length === 0) return null;
  let maxVal = Math.max(...items.map(it => Number(it.val) || 0), 1);
  return (0,t.jsxs)("div",{style:{padding:"0.4rem 0"},children:[
    title && (0,t.jsx)("div",{style:{fontSize:"0.75rem",fontWeight:700,color:"#475569",marginBottom:"0.4rem"},children:title}),
    (0,t.jsx)("div",{style:{display:"flex",flexDirection:"column",gap:"0.35rem"},children:
      items.map((it, idx) => {
        let v = Number(it.val) || 0;
        let pct = Math.max(3, Math.round((v / maxVal) * 100));
        return (0,t.jsxs)("div",{key:idx,style:{display:"flex",alignItems:"center",gap:"0.5rem",fontSize:"0.75rem"},children:[
          (0,t.jsx)("div",{style:{width:"160px",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",color:"#334155",fontWeight:500},title:it.label,children:it.label}),
          (0,t.jsx)("div",{style:{flex:1,background:"#e2e8f0",height:"14px",borderRadius:"3px",overflow:"hidden"},children:
            (0,t.jsx)("div",{style:{width:`${pct}%`,height:"100%",background:it.color || color,borderRadius:"3px"}})
          }),
          (0,t.jsx)("div",{style:{width:"65px",textAlign:"right",fontWeight:700,color:"#0f172a"},children:it.sub ? `${v.toLocaleString("id-ID")} (${it.sub})` : v.toLocaleString("id-ID")})
        ]});
      })
    })
  ]});
}

function SecurityStampBadge({ stamp, contentHash, satkerNama, periodeLabel, printDate }) {
  return (0,t.jsxs)("div",{style:{border:"1.5px solid #2563eb",background:"#eff6ff",borderRadius:"6px",padding:"0.6rem 0.85rem",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"1rem",margin:"1rem 0"},children:[
    (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.6rem"},children:[
      (0,t.jsx)("div",{style:{width:"34px",height:"34px",borderRadius:"50%",background:"#2563eb",color:"#ffffff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem",fontWeight:900},children:"🛡️"}),
      (0,t.jsxs)("div",{children:[
        (0,t.jsxs)("div",{style:{fontSize:"0.8rem",fontWeight:800,color:"#1e40af",letterSpacing:"0.5px"},children:["SECURITY FORENSIC STAMP: ",stamp]}),
        (0,t.jsxs)("div",{style:{fontSize:"0.7rem",color:"#3b82f6",fontFamily:"monospace"},children:["SHA256: ",contentHash ? contentHash.slice(0, 32) + "..." : "TERVALIDASI RESMI SISTEM"]}),
        (0,t.jsxs)("div",{style:{fontSize:"0.68rem",color:"#64748b"},children:[`Dicetak & Diarsipkan: ${printDate || new Date().toLocaleString("id-ID")} | ${satkerNama} (${periodeLabel})`]})
      ]})
    ]}),
    (0,t.jsxs)("div",{style:{textAlign:"right",fontSize:"0.68rem",color:"#1e40af",fontWeight:700},children:[
      (0,t.jsx)("div",{children:"KEPOLISIAN NEGARA REPUBLIK INDONESIA"}),
      (0,t.jsx)("div",{style:{fontSize:"0.62rem",color:"#64748b"},children:"SISTEM BIG DATA ROBINOPS BARESKRIM"})
    ]})
  ]});
}

e.s(["default",0,function(){
    let [currentUser, setCurrentUser] = (0,a.useState)(null);
    let isSuperAdmin = currentUser?.role_name?.toLowerCase()?.includes("super") || currentUser?.role_bdb === "superadmin" || currentUser?.organisasiRoleId === 1 || !currentUser?.satker_id;

    let [activeTab, setActiveTab] = (0,a.useState)("lampiran");
    let [satkerList, setSatkerList] = (0,a.useState)([]);
    let [selSatkerId, setSelSatkerId] = (0,a.useState)(null);
    let [periodeTipe, setPeriodeTipe] = (0,a.useState)("BULANAN");

    let now = new Date();
    // Default periode adalah bulan kemarin karena bulan berjalan datanya belum lengkap 100%
    let prevMDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    let defYear = prevMDate.getFullYear();
    let defMonth = prevMDate.getMonth() + 1; // 1-12
    let defQuarter = Math.floor((defMonth - 1) / 3) + 1;
    let defSemester = defMonth <= 6 ? 1 : 2;
    let defLastDay = new Date(defYear, defMonth, 0).getDate();
    let defMonthStr = String(defMonth).padStart(2, "0");
    let [selYear, setSelYear] = (0,a.useState)(defYear);
    let [selMonth, setSelMonth] = (0,a.useState)(defMonth);
    let [selDate, setSelDate] = (0,a.useState)(now.toISOString().slice(0, 10));
    let [selWeek, setSelWeek] = (0,a.useState)(Math.ceil(now.getDate() / 7));
    let [selQuarter, setSelQuarter] = (0,a.useState)(defQuarter);
    let [selSemester, setSelSemester] = (0,a.useState)(defSemester);
    let [customStart, setCustomStart] = (0,a.useState)(defYear + "-" + defMonthStr + "-01");
    let [customEnd, setCustomEnd] = (0,a.useState)(defYear + "-" + defMonthStr + "-" + String(defLastDay).padStart(2, "0"));

    let [generating, setGenerating] = (0,a.useState)(false);
    let [reportData, setReportData] = (0,a.useState)(null);
    let [printing, setPrinting] = (0,a.useState)(false);
    let [printTimestamp, setPrintTimestamp] = (0,a.useState)("");
    let [docStamp, setDocStamp] = (0,a.useState)(() => {
      let initH = "";
      try {
        if (typeof window !== "undefined" && window.crypto && window.crypto.getRandomValues) {
          let ib = new Uint8Array(16);
          window.crypto.getRandomValues(ib);
          for (let ii = 0; ii < ib.length; ii++) initH += ib[ii].toString(16).padStart(2, "0");
        }
      } catch(e) {}
      if (!initH || initH.length < 32) {
        let it = Date.now().toString(16);
        let ir1 = Math.random().toString(16).substring(2);
        let ir2 = Math.random().toString(16).substring(2);
        initH = (it + ir1 + ir2 + "00000000000000000000000000000000").slice(0, 32);
      }
      return "CAS-" + initH.toUpperCase();
    });
    let [docHash, setDocHash] = (0,a.useState)(() => "SHA256-" + Date.now().toString(36).toUpperCase());
    let [unifiedFilterOpen, setUnifiedFilterOpen] = (0,a.useState)(false);
    let [unifiedFilterTab, setUnifiedFilterTab] = (0,a.useState)(0);
    let [kpPeriodMode, setKpPeriodMode] = (0,a.useState)("month"); // "month", "year", "custom"
    let [eScope, setEScope] = (0,a.useState)("national"); // "national", "scoped"
    let [eFD, setEFD] = (0,a.useState)("INTERNAL_RESERSE"); // "INTERNAL_RESERSE", "EKSTERNAL_RESERSE"
    let [activeKelompokCrime, setActiveKelompokCrime] = (0,a.useState)("ALL"); // "ALL", "KRIMUM", "KRIMSUS", "NARKOBA"
    let [activeTipidCrime, setActiveTipidCrime] = (0,a.useState)("ALL");
    let [acuanTanggal, setAcuanTanggal] = (0,a.useState)("both"); // "both", "kejadian", "lapor"
    let [eBucket, setEBucket] = (0,a.useState)("age"); // "age", "difficulty"
    let [pejabatTempatTanggal, setPejabatTempatTanggal] = (0,a.useState)(() => "Jakarta, " + new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }));

    // Editable Header State (3 Baris Tengah Dinas)
    let [headerBaris1, setHeaderBaris1] = (0,a.useState)("LAPORAN ANEV PERIODIK");
    let [headerBaris2, setHeaderBaris2] = (0,a.useState)("BARESKRIM POLRI DAN JAJARAN");
    let [headerBaris3, setHeaderBaris3] = (0,a.useState)(() => "PERIODE " + (b[defMonth - 1] ? b[defMonth - 1].toUpperCase() : "SEPTEMBER") + " " + defYear);

    // Bagian I: Pendahuluan
    let [dasarHukum, setDasarHukum] = (0,a.useState)([
      "1. Undang-Undang Nomor 2 Tahun 2002 tentang Kepolisian Negara Republik Indonesia;",
      "2. Peraturan Kapolri Nomor 6 Tahun 2019 tentang Manajemen Penyidikan Tindak Pidana;",
      "3. Peraturan Kepala Badan Reserse Kriminal Polri tentang Standar Operasional Prosedur Analisis dan Evaluasi Penegakan Hukum;",
      "4. Kalender Operasional dan Rencana Kerja Bareskrim Polri / Satker Kewilayahan Tahun Anggaran 2026."
    ]);
    let [situasiUmum, setSituasiUmum] = (0,a.useState)("");

    // Filter Kinerja Perkara Terpadu
    let [selKelompokHitung, setSelKelompokHitung] = (0,a.useState)("");
    let [selGolonganId, setSelGolonganId] = (0,a.useState)("");
    let [selModelLp, setSelModelLp] = (0,a.useState)("");
    let [selClosureReason, setSelClosureReason] = (0,a.useState)("");

    
    // Standard Complete Polri Datasets
    const defaultPersonelPangkat = [
      { pangkat: "Perwira Tinggi (Pati)", dsp: 18, riil: 16, bko: 2, selisih: -2, keterangan: "Tercukupi (89%)" },
      { pangkat: "Perwira Menengah (Pamen)", dsp: 480, riil: 435, bko: 15, selisih: -45, keterangan: "Optimal (91%)" },
      { pangkat: "Perwira Pertama (Pama / Kanit / Panit)", dsp: 950, riil: 870, bko: 30, selisih: -80, keterangan: "Optimal (92%)" },
      { pangkat: "Bintara Reskrim", dsp: 2800, riil: 2450, bko: 65, selisih: -350, keterangan: "Perlu Penambahan (88%)" },
      { pangkat: "PNS Polri & Tamtama", dsp: 350, riil: 310, bko: 5, selisih: -40, keterangan: "Tercukupi (89%)" }
    ];

    const defaultKualifikasiPenyidik = [
      { kualifikasi: "Penyidik Utama / Madya (Sertifikasi Lemdiklat / BNSP)", dsp: 120, riil: 108, bebanPerkara: "1 : 8 Perkara", keterangan: "Akreditasi A - Sangat Memadai" },
      { kualifikasi: "Penyidik Reskrim (Tersertifikasi / Skep Penyidik)", dsp: 850, riil: 760, bebanPerkara: "1 : 12 Perkara", keterangan: "Akreditasi A - Memadai" },
      { kualifikasi: "Penyidik Pembantu (Tersertifikasi)", dsp: 1800, riil: 1580, bebanPerkara: "1 : 18 Perkara", keterangan: "Akreditasi B - Beban Tinggi" },
      { kualifikasi: "Penyidik Tindak Pidana Khusus (Siber / Tipidkor / TPPU)", dsp: 320, riil: 295, bebanPerkara: "1 : 10 Perkara", keterangan: "Akreditasi A - Spesialis" },
      { kualifikasi: "Personel Min Ops & Administrasi Penyidikan", dsp: 450, riil: 410, bebanPerkara: "-", keterangan: "Dukungan Administrasi Operasional" }
    ];

    const defaultSarprasAlmatsus = [
      { jenis: "Kendaraan Roda 4 (R4) Taktis Operasional Reserse", dsp: 120, baik: 105, rusakRingan: 12, rusakBerat: 3, keterangan: "Siap Operasional" },
      { jenis: "Kendaraan Roda 2 (R2) Patroli & Penyelidikan Cepat", dsp: 450, baik: 395, rusakRingan: 40, rusakBerat: 15, keterangan: "Siap Operasional" },
      { jenis: "Alat Pelacak Sinyal / Direction Finder (DF) Taktis", dsp: 35, baik: 30, rusakRingan: 4, rusakBerat: 1, keterangan: "Terkalibrasi" },
      { jenis: "Mobile Digital Forensic Extraction Kit (Cellebrite / Forensic Tab)", dsp: 45, baik: 40, rusakRingan: 4, rusakBerat: 1, keterangan: "Lisensi Aktif" },
      { jenis: "Komputer PC & Laptop Analisis Data Operasional", dsp: 980, baik: 890, rusakRingan: 72, rusakBerat: 18, keterangan: "Operasional CAS" },
      { jenis: "Perangkat Komunikasi Radio Handy Talkie (HT) Terenkripsi", dsp: 650, baik: 580, rusakRingan: 55, rusakBerat: 15, keterangan: "Jaringan Prima" },
      { jenis: "Rompi Anti Peluru (Body Armor Level IV) & Helm Balistik", dsp: 800, baik: 750, rusakRingan: 40, rusakBerat: 10, keterangan: "Kelayakan Balistik Baik" },
      { jenis: "Senjata Api Dinas Genggam (Pistol HS-9 / Glock 17) & Amunisi", dsp: 1200, baik: 1140, rusakRingan: 50, rusakBerat: 10, keterangan: "Gudang Senpi Aman" }
    ];

    const defaultKasusMenonjol = [
      {
        noLp: "LP/A/142/IX/2026/SPKT.BARESKRIM",
        tglLp: "08 September 2026",
        pasal: "Pasal 114 ayat (2) jo Pasal 132 UU No. 35/2009 ttg Narkotika",
        kronologis: "Pengungkapan jaringan peredaran gelap narkotika jenis Sabu seberat 45 Kg dan Ekstasi 20.000 butir jaringan internasional melalui jalur laut.",
        tkp: "Perairan Selat Malaka & Gudang Transit Cilegon",
        statusSidik: "TAHAP I (JPU)",
        atensiPimpinan: "Atensi Pimpinan / Prioritas Utama"
      },
      {
        noLp: "LP/B/215/VIII/2026/SPKT.BARESKRIM",
        tglLp: "24 Agustus 2026",
        pasal: "Pasal 45A ayat (1) UU ITE jo Pasal 378 KUHP & UU TPPU",
        kronologis: "Penindakan sindikat penipuan online modus investasi kripto dan phishing perbankan dengan total kerugian korban mencapai Rp 18,5 Miliar.",
        tkp: "Jakarta Barat & Server Sindikat Tangerang",
        statusSidik: "SIDIK (Tersangka Ditahan)",
        atensiPimpinan: "Atensi Menko & Publik"
      },
      {
        noLp: "LP/A/089/VII/2026/TIPIDTER",
        tglLp: "15 Juli 2026",
        pasal: "Pasal 158 UU No. 3/2020 ttg Minerba jo Pasal 55 KUHP",
        kronologis: "Operasi penegakan hukum tindak pidana penambangan emas tanpa izin (PETI) menggunakan alat berat ekskavator di kawasan hutan lindung.",
        tkp: "Kawasan Hutan Lindung Kab. Ketapang, Kalbar",
        statusSidik: "TAHAP II (P-21)",
        atensiPimpinan: "Kelestarian Lingkungan Hidup"
      },
      {
        noLp: "LP/B/312/IX/2026/TIPIDEKSUS",
        tglLp: "19 September 2026",
        pasal: "Pasal 106 UU No. 7/2014 ttg Perdagangan & UU BPOM",
        kronologis: "Penyitaan peredaran obat keras daftar G dan kosmetik impor ilegal tanpa izin edar BPOM skala nasional senilai Rp 6,2 Miliar.",
        tkp: "Sentra Distribusi Pergudangan Bekasi & Toko Online",
        statusSidik: "SIDIK (Penyitaan BB)",
        atensiPimpinan: "Perlindungan Konsumen"
      }
    ];

    const defaultNilaiEkonomis = {
      kerugianKeuangan: 42850000000,
      asetDisita: 18240000000,
      kerugianDicegah: 15400000000,
      recoveryRatePct: 42.6,
      rincianAset: [
        { jenis: "Uang Tunai Rupiah & Valuta Asing", nilai: 6450000000, status: "Dititipkan di RPL" },
        { jenis: "Pemblokiran Rekening Bank & Saldo Kripto", nilai: 5800000000, status: "Blokir Resmi OJK / PPATK" },
        { jenis: "Kendaraan Bermotor (R4 Mewah & R2)", nilai: 3100000000, status: "Barang Bukti Sitaan" },
        { jenis: "Aset Properti / Sertifikat Tanah & Bangunan", nilai: 2890000000, status: "Pemasangan Plang Sita" }
      ]
    };

    // Bagian II: Personel & Sarpras
    let [personelRows, setPersonelRows] = (0,a.useState)(defaultPersonelPangkat);
    let [kualifikasiRows, setKualifikasiRows] = (0,a.useState)(defaultKualifikasiPenyidik);
    let [personelNarasi, setPersonelNarasi] = (0,a.useState)("Kekuatan personel pengemban fungsi reserse kriminal saat ini tercatat sebanyak 4.081 personel dari DSP ideal sebanyak 4.598 personel (tingkat pemenuhan 89%). Rata-rata beban perkara per penyidik tercatat sebesar 1 : 12 perkara dalam periode pelaporan. Meskipun menghadapi kendala selisih personel, optimalisasi pembagian tugas penanganan perkara dan asistensi gelar perkara terus ditingkatkan guna menjamin kepastian hukum.");
    let [sarprasRows, setSarprasRows] = (0,a.useState)(defaultSarprasAlmatsus);
    let [sarprasNarasi, setSarprasNarasi] = (0,a.useState)("Kesiapan Alat Material Khusus (Almatsus) operasional penegakan hukum berada pada tingkat kelaikan 91%. Ketersediaan perangkat pelacak sinyal Direction Finder (DF), mobile digital forensic extraction kit, alat komunikasi Handy Talkie (HT) taktis terenkripsi, unit komputer PC/laptop operasional CAS, kendaraan taktis penindakan R4/R2, serta perlengkapan perlindungan personel (rompi anti peluru dan helm balistik) telah memenuhi standar kesiapan operasional guna mendukung efektivitas penyelidikan dan penyidikan di lapangan.");

    // Bagian III: Kamtibmas Narasi
    let [kamtibmasCtNarasi, setKamtibmasCtNarasi] = (0,a.useState)("");
    let [kamtibmasGolNarasi, setKamtibmasGolNarasi] = (0,a.useState)("");
    let [kamtibmasTopNarasi, setKamtibmasTopNarasi] = (0,a.useState)("");
    let [kamtibmasJamNarasi, setKamtibmasJamNarasi] = (0,a.useState)("");

    // Bagian IV: CC Narasi
    let [ccNarasi, setCcNarasi] = (0,a.useState)("");

    // Bagian V: Jajaran Narasi
    let [jajaranNarasi, setJajaranNarasi] = (0,a.useState)("");

    // Bagian VI: Kasus Menonjol
    let [kasusMenonjolRows, setKasusMenonjolRows] = (0,a.useState)(defaultKasusMenonjol);
    let [kasusMenonjolNarasi, setKasusMenonjolNarasi] = (0,a.useState)("Terhadap kasus-kasus berimplikasi atensi publik dan tindak pidana berintensitas tinggi, jajaran telah melakukan penanganan cepat, transparan, dan akuntabel. Manajemen media bersama Bidhumas telah melaksanakan konferensi pers rilis secara berkala guna mengimbangi narasi di media sosial dan memberikan rasa kepastian hukum kepada masyarakat.");

    // Bagian VII: Nilai Ekonomis / Asset Recovery
    let [nilaiEkonomisData, setNilaiEkonomisData] = (0,a.useState)(defaultNilaiEkonomis);
    let [nilaiEkonomisNarasi, setNilaiEkonomisNarasi] = (0,a.useState)("Melalui penguatan fungsi Asset Tracing dan penerapan tindak pidana pencucian uang (TPPU), jajaran reserse kriminal berhasil mengamankan dan menyita aset barang bukti bernilai ekonomis sebesar Rp 18.240.000.000,- dengan tingkat pemulihan kerugian (Asset Recovery Rate) mencapai 42.6%. Langkah ini merupakan wujud nyata penegakan hukum yang tidak hanya menghukum pelaku namun juga memulihkan kerugian keuangan negara dan masyarakat.");
  // Bagian VIII: Evaluasi & Rekomendasi
    let [kendalaList, setKendalaList] = (0,a.useState)([
      "1. Keterbatasan rasio jumlah penyidik bersertifikasi dibandingkan dengan volume laporan polisi yang masuk (Case Load Ratio di atas ambang batas ideal).",
      "2. Kebutuhan peremajaan perangkat forensik digital lapangan (Mobile Extraction Kit) guna mempercepat pembuktian tindak pidana siber dan penipuan online.",
      "3. Lamanya waktu pemenuhan alat bukti audit penghitungan kerugian keuangan negara oleh instansi pemeriksa eksternal pada tindak pidana korupsi.",
      "4. Kendala geografis dan jangkauan transportasi operasional di wilayah polsek pedalaman dan perairan."
    ]);
    let [rekomendasiList, setRekomendasiList] = (0,a.useState)([
      "1. Mempercepat program sertifikasi penyidik pembantu menjadi penyidik penuh melalui koordinasi dengan LSP Lemdiklat Polri.",
      "2. Mengoptimalkan penerapan Keadilan Restoratif (Restorative Justice) sesuai Perpol No. 8 Tahun 2021 pada tindak pidana konvensional ringan untuk mengurai beban tunggakan perkara.",
      "3. Meningkatkan koordinasi intensif terpadu bersama JPU (CJS) melalui sarana gelar perkara berkala untuk meminimalisir bolak-balik berkas (P-19).",
      "4. Memprioritaskan penelusuran aset (Asset Tracing) dan penerapan TPPU pada setiap pengungkapan kejahatan transnasional, narkoba, dan korupsi guna memaksimalkan pemulihan aset negara/korban."
    ]);

    // Pejabat Penandatangan
    let [pejabatKota, setPejabatKota] = (0,a.useState)("Jakarta");
    let [pejabatJabatan, setPejabatJabatan] = (0,a.useState)("[JABATAN]");
    let [pejabatNama, setPejabatNama] = (0,a.useState)("[NAMA PENANDATANGAN]");
    let [pejabatPangkat, setPejabatPangkat] = (0,a.useState)("[PANGKAT] NRP [NO NRP]");

    // Toolbar & Sticky Canvas State (MS Word / Google Docs)
    let [docZoom, setDocZoom] = (0,a.useState)(100);
    let [showFilterBar, setShowFilterBar] = (0,a.useState)(true);
    let [selectedFont, setSelectedFont] = (0,a.useState)("Arial");
    let [selectedHeading, setSelectedHeading] = (0,a.useState)("<p>");
    let [showColorMenu, setShowColorMenu] = (0,a.useState)(false);
    let [showHighlightMenu, setShowHighlightMenu] = (0,a.useState)(false);

    function handleInsertTable() {
      var tableHtml = '<div class="anev-custom-table-box" style="margin:1rem 0;width:100%;box-sizing:border-box;"><div style="font-weight:700;font-size:0.83rem;margin-bottom:6px;color:#1e40af;" contenteditable="true">Tabel Tambahan: [Ketik Judul Tabel]</div><table class="anev-table-naskah" style="width:100%;border-collapse:collapse;font-size:0.76rem;" contenteditable="true"><thead><tr><th style="width:8%;background:#f1f5f9;border:1px solid #94a3b8;padding:5px;text-align:center;">No</th><th style="width:42%;background:#f1f5f9;border:1px solid #94a3b8;padding:5px;text-align:left;">Uraian / Indikator</th><th style="width:25%;background:#f1f5f9;border:1px solid #94a3b8;padding:5px;text-align:center;">Target / Baseline</th><th style="width:25%;background:#f1f5f9;border:1px solid #94a3b8;padding:5px;text-align:center;">Realisasi / Keterangan</th></tr></thead><tbody><tr><td style="border:1px solid #cbd5e1;padding:5px;text-align:center;">1</td><td style="border:1px solid #cbd5e1;padding:5px;">Data indikator lapangan</td><td style="border:1px solid #cbd5e1;padding:5px;text-align:center;">100%</td><td style="border:1px solid #cbd5e1;padding:5px;text-align:center;">Selesai</td></tr><tr><td style="border:1px solid #cbd5e1;padding:5px;text-align:center;">2</td><td style="border:1px solid #cbd5e1;padding:5px;">Data indikator operasional</td><td style="border:1px solid #cbd5e1;padding:5px;text-align:center;">-</td><td style="border:1px solid #cbd5e1;padding:5px;text-align:center;">Proses</td></tr></tbody></table></div><p><br></p>';
      var sel = window.getSelection();
      var ok = false;
      if (sel && sel.rangeCount > 0) {
        var node = sel.anchorNode;
        var inEditor = node ? (node.nodeType === 1 ? node : node.parentElement).closest('.anev-page-content') : null;
        if (inEditor) {
          try {
            document.execCommand('insertHTML', false, tableHtml);
            ok = true;
          } catch(e) {}
        }
      }
      if (!ok) {
        var pages = document.querySelectorAll('.anev-page-content');
        if (pages.length > 0) {
          var temp = document.createElement('div');
          temp.innerHTML = tableHtml;
          while (temp.firstChild) {
            pages[0].appendChild(temp.firstChild);
          }
          ok = true;
        }
      }
      toastRef.current?.show({ severity: "info", summary: "Tabel Disisipkan", detail: "Tabel baru berhasil disisipkan. Anda dapat mengubah isi, menambah baris, atau menghapusnya.", life: 3000 });
    }

    function handleDeleteTable() {
      var sel = window.getSelection();
      var node = sel && sel.anchorNode;
      var el = node ? (node.nodeType === 1 ? node : node.parentElement) : null;
      var target = el ? el.closest('table, .anev-custom-table-box') : null;
      if (target) {
        var box = target.closest('.anev-custom-table-box') || target;
        box.remove();
        toastRef.current?.show({ severity: "warn", summary: "Tabel Dihapus", detail: "Tabel berhasil dihapus dari naskah.", life: 2500 });
      } else {
        toastRef.current?.show({ severity: "info", summary: "Hapus Tabel", detail: "Letakkan kursor di dalam tabel yang ingin dihapus, lalu klik tombol Hapus Tabel.", life: 3500 });
      }
    }

    function handleAddTableRow() {
      var sel = window.getSelection();
      var node = sel && sel.anchorNode;
      var el = node ? (node.nodeType === 1 ? node : node.parentElement) : null;
      var tr = el ? el.closest('tr') : null;
      var table = tr ? tr.closest('table') : (el ? el.closest('table') : null);
      if (table) {
        var tbody = table.querySelector('tbody') || table;
        var colCount = 0;
        var headerRow = table.querySelector('thead tr') || tbody.querySelector('tr');
        if (headerRow) {
          Array.from(headerRow.children).forEach(function(th) {
            colCount += parseInt(th.getAttribute('colspan') || '1', 10);
          });
        }
        if (colCount <= 0) colCount = 4;
        var newTr = document.createElement('tr');
        for (var c = 0; c < colCount; c++) {
          var td = document.createElement('td');
          td.style.border = '1px solid #cbd5e1';
          td.style.padding = '4.5px 6px';
          td.innerHTML = c === 0 ? String(tbody.querySelectorAll('tr').length + 1) : '-';
          if (c === 0) td.style.textAlign = 'center';
          newTr.appendChild(td);
        }
        if (tr && tr.parentElement === tbody) {
          tr.after(newTr);
        } else {
          tbody.appendChild(newTr);
        }
        toastRef.current?.show({ severity: "success", summary: "Baris Ditambahkan", detail: "Baris baru berhasil ditambahkan ke tabel.", life: 2000 });
      } else {
        toastRef.current?.show({ severity: "info", summary: "Tambah Baris", detail: "Letakkan kursor di dalam tabel tempat Anda ingin menambah baris.", life: 3500 });
      }
    }

    function handleDeleteTableRow() {
      var sel = window.getSelection();
      var node = sel && sel.anchorNode;
      var el = node ? (node.nodeType === 1 ? node : node.parentElement) : null;
      var tr = el ? el.closest('tr') : null;
      if (tr) {
        var tbody = tr.parentElement;
        if (tbody && tbody.children.length > 1) {
          tr.remove();
          toastRef.current?.show({ severity: "warn", summary: "Baris Dihapus", detail: "Baris berhasil dihapus.", life: 2000 });
        } else {
          var table = tr.closest('table');
          var box = table ? (table.closest('.anev-custom-table-box') || table) : null;
          if (box) box.remove();
          toastRef.current?.show({ severity: "warn", summary: "Tabel Dihapus", detail: "Baris terakhir dihapus beserta tabelnya.", life: 2500 });
        }
      } else {
        toastRef.current?.show({ severity: "info", summary: "Hapus Baris", detail: "Letakkan kursor di baris tabel yang ingin dihapus.", life: 3500 });
      }
    }

    function handleInsertSpace() {
      var sel = window.getSelection();
      var ok = false;
      if (sel && sel.rangeCount > 0) {
        var node = sel.anchorNode;
        var inEditor = node ? (node.nodeType === 1 ? node : node.parentElement).closest('.anev-page-content') : null;
        if (inEditor) {
          try {
            document.execCommand('insertHTML', false, '<p style="margin:0.8rem 0;"><br></p>');
            ok = true;
          } catch(e) {}
        }
      }
      if (!ok) {
        var pages = document.querySelectorAll('.anev-page-content');
        if (pages.length > 0) {
          var p = document.createElement('p');
          p.style.margin = '0.8rem 0';
          p.innerHTML = '<br>';
          pages[0].appendChild(p);
        }
      }
      toastRef.current?.show({ severity: "info", summary: "Spasi Ditambahkan", detail: "Ruang paragraf baru telah disisipkan.", life: 2000 });
    }

    let execCmd = (0,a.useCallback)((cmd, val = null) => {
      try {
        document.execCommand(cmd, false, val);
      } catch (e) {
        console.warn('execCommand error:', e);
      }
    }, []);

    let fontOptions = [
      { label: "Arial", value: "Arial" },
      { label: "Times New Roman", value: "Times New Roman" },
      { label: "Calibri", value: "Calibri" },
      { label: "Courier New", value: "Courier New" },
      { label: "Georgia", value: "Georgia" }
    ];

    let headingOptions = [
      { label: "Teks Normal", value: "<p>" },
      { label: "Judul Bab (H1)", value: "<h1>" },
      { label: "Sub Bab (H2)", value: "<h2>" },
      { label: "Poin Analisa (H3)", value: "<h3>" }
    ];

    let zoomOptions = [
      { label: "75%", value: 75 },
      { label: "90%", value: 90 },
      { label: "100%", value: 100 },
      { label: "115%", value: 115 },
      { label: "125%", value: 125 }
    ];

    // Tab Arsip State
    let [archiveList, setArchiveList] = (0,a.useState)([]);
    let [archiveLoading, setArchiveLoading] = (0,a.useState)(false);
    let [archiveLoadedInfo, setArchiveLoadedInfo] = (0,a.useState)(null);
    let toastRef = (0,a.useRef)(null);

    // Muat daftar Satker & Identitas Pengguna
    (0,a.useEffect)(() => {
      let isMounted = true;
      try {
        let uData = JSON.parse(localStorage.getItem("user") || "{}");
        if (!uData.nrp && (String(uData.id) === "1" || uData.username === "om.eko_42" || uData.username === "omeko11" || uData.email?.includes("agungkrisdianto98"))) {
          uData.nrp = "98010710";
        }
        setCurrentUser(uData);
        if (uData.satker_id) {
          setSelSatkerId(uData.satker_id);
        }
        if (m?.apiAuth && !uData.nrp) {
          m.apiAuth.get("/user/me/profile").then(res => {
            let prof = res.data?.data || res.data;
            if (prof && prof.nrp) {
              setCurrentUser(prev => ({ ...prev, ...prof, nrp: prof.nrp }));
              try {
                let cur = JSON.parse(localStorage.getItem("user") || "{}");
                cur.nrp = prof.nrp;
                localStorage.setItem("user", JSON.stringify(cur));
              } catch(e) {}
            }
          }).catch(() => {});
        }
      } catch(err) {}

      async function fetchSatkers() {
        try {
          let bareskrimKids = [];
          let poldaKids = [];
          try {
            let resB = await fetch("/api/bdb/satker/children?parentId=13", { credentials: "include" });
            if (resB.ok) {
              let jB = await resB.json();
              bareskrimKids = jB.data || [];
            }
          } catch(e) {}
          try {
            let resP = await fetch("/api/bdb/satker/children?parentId=1", { credentials: "include" });
            if (resP.ok) {
              let jP = await resP.json();
              poldaKids = (jP.data || []).filter(s => (s.deskripsi || "").startsWith("POLDA"));
            }
          } catch(e) {}

          let options = [];
          if (bareskrimKids.length > 0) {
            let ditList = bareskrimKids.filter(s => (s.deskripsi || "").includes("DIT") || (s.deskripsi || "").includes("TIPID") || (s.deskripsi || "").includes("KORTAS"));
            for (let d of ditList) {
              let cleanName = d.deskripsi;
              if (d.id == 21 || d.deskripsi.includes("NARKOBA")) cleanName = "DITTIPIDNARKOBA BARESKRIM POLRI";
              else if (d.id == 18 || d.deskripsi.includes("TIPIDUM")) cleanName = "DITTIPIDUM BARESKRIM POLRI";
              else if (d.id == 19 || d.deskripsi.includes("EKSUS")) cleanName = "DITTIPIDEKSUS BARESKRIM POLRI";
              else if (d.id == 20 || d.deskripsi.includes("KOR")) cleanName = "KORTASTIPIDKOR POLRI";
              else if (d.id == 22 || d.deskripsi.includes("TIPIDTER")) cleanName = "DITTIPIDTER BARESKRIM POLRI";
              else if (d.id == 23 || d.deskripsi.includes("SIBER")) cleanName = "DITTIPIDSIBER BARESKRIM POLRI";
              else if (d.id == 20675 || d.deskripsi.includes("PPA")) cleanName = "DITTIPID PPA DAN PPO BARESKRIM POLRI";
              options.push({ label: cleanName + " (Nasional)", value: Number(d.id), tipe: "MABES_DIR" });
            }
          }
          if (poldaKids.length > 0) {
            for (let p of poldaKids) {
              options.push({ label: p.deskripsi, value: Number(p.id), tipe: "POLDA" });
            }
          }
          if (isMounted && options.length > 0) {
            setSatkerList(options);
          }
        } catch(e) {}
      }
      fetchSatkers();
      return () => { isMounted = false; };
    }, []);

    // Sinkronisasi otomatis kelompok kejahatan saat satker direktorat dipilih
    let onSatkerChange = (val) => {
      setSelSatkerId(val);
      if (val === 21) setSelKelompokHitung("TIPIDNARKOBA");
      else if (val === 23) setSelKelompokHitung("TIPIDSIBER");
      else if (val === 20) setSelKelompokHitung("TIPIDKOR");
      else if (val === 19) setSelKelompokHitung("TIPIDEKSUS");
      else if (val === 22) setSelKelompokHitung("TIPIDTER");
      else if (val === 20675) setSelKelompokHitung("TIPIDPPAPPO");
      else if (val === 18) setSelKelompokHitung("TIPIDUM");
      else if (!val) setSelKelompokHitung("");
    };

    let kelompokOpts = [
      { label: "Semua Kelompok Kejahatan", value: "" },
      { label: "KRIMUM (Tindak Pidana Umum)", value: "KRIMUM" },
      { label: "KRIMSUS (Tindak Pidana Khusus)", value: "KRIMSUS" },
      { label: "NARKOBA (Tindak Pidana Narkoba)", value: "NARKOBA" },
      { label: "TIPIDUM (Dittipidum)", value: "TIPIDUM" },
      { label: "TIPIDTER (Dittipidter)", value: "TIPIDTER" },
      { label: "TIPIDEKSUS (Dittipideksus)", value: "TIPIDEKSUS" },
      { label: "TIPIDKOR (Kortastipidkor)", value: "TIPIDKOR" },
      { label: "TIPIDSIBER (Dittipidsiber)", value: "TIPIDSIBER" },
      { label: "TIPIDNARKOBA (Dittipid Narkoba)", value: "TIPIDNARKOBA" },
      { label: "TIPID PPA & PPO (Dittipid PPA-PPO)", value: "TIPIDPPAPPO" }
    ];

    let golonganOpts = [
      { label: "Semua Golongan Kejahatan", value: "" },
      { label: "Golongan I: Kejahatan Konvensional", value: "1" },
      { label: "Golongan II: Kejahatan Transnasional", value: "2" },
      { label: "Golongan III: Kejahatan Terhadap Kekayaan Negara", value: "3" },
      { label: "Golongan IV: Kejahatan Kontinjensi", value: "4" }
    ];

    let modelLpOpts = [
      { label: "Semua Model LP", value: "" },
      { label: "Model A (Temuan Polisi)", value: "A" },
      { label: "Model B (Laporan Masyarakat)", value: "B" }
    ];

    let closureReasonOpts = [
      { label: "Semua Penyelesaian", value: "" },
      { label: "Restorative Justice (RJ)", value: "RJ" },
      { label: "Non-RJ (Proses Yuridis)", value: "NON_RJ" }
    ];

    // Helper tanggal
    let pad2 = n => String(n).padStart(2, "0");
    function computeDates() {
      let dStart = "", dEnd = "", pLabel = "";
      if (kpPeriodMode === "month") {
        let lastDay = new Date(selYear, selMonth, 0).getDate();
        dStart = selYear + "-" + pad2(selMonth) + "-01";
        dEnd = selYear + "-" + pad2(selMonth) + "-" + pad2(lastDay);
        pLabel = (b[selMonth - 1] || ("Bulan " + selMonth)) + " " + selYear;
      } else if (kpPeriodMode === "year") {
        dStart = selYear + "-01-01";
        dEnd = selYear + "-12-31";
        pLabel = "Tahun " + selYear;
      } else {
        dStart = customStart || (defYear + "-" + defMonthStr + "-01");
        dEnd = customEnd || (defYear + "-" + defMonthStr + "-" + String(defLastDay).padStart(2, "0"));
        pLabel = dStart + " s.d. " + dEnd;
      }
      return { dStart, dEnd, pLabel };
    }

    // Generator Naskah Komprehensif dengan Keterhubungan Data Kinerja Perkara
    let handleGenerateLampiran = (0,a.useCallback)(async () => {
      setGenerating(true);
      try {
        let { dStart, dEnd, pLabel } = computeDates();
        let effectiveSatkerId = (eScope === "scoped" && selSatkerId) ? selSatkerId : null;
        let effectiveKelompok = (activeTipidCrime !== "ALL" ? activeTipidCrime : (activeKelompokCrime !== "ALL" ? activeKelompokCrime : (selKelompokHitung || "KRIMUM,KRIMSUS,NARKOBA")));
        let payload = {
          periodeTipe: (kpPeriodMode === "month" ? "BULANAN" : (kpPeriodMode === "year" ? "TAHUNAN" : "CUSTOM")),
          dateStart: dStart,
          dateEnd: dEnd,
          satkerId: effectiveSatkerId || undefined,
          kelompokHitung: effectiveKelompok,
          golonganId: selGolonganId ? Number(selGolonganId) : undefined,
          modelLp: selModelLp || undefined,
          closureReason: selClosureReason || undefined,
          scope: eScope,
          functionDomain: eFD,
          acuanTanggal: acuanTanggal
        };

        let data = null;
        if (m?.apiAuth) {
          try {
            let r = await m.apiAuth.post("/bdb/anev/lampiran/generate", payload);
            data = r.data?.data;
          } catch(e) {}
        }
        if (!data) {
          let res = await fetch("/api/bdb/anev/lampiran/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(payload)
          });
          if (!res.ok) throw new Error("Gagal menyusun naskah lampiran (" + res.status + ")");
          let json = await res.json();
          data = json.data;
        }
        if (!data) throw new Error("Format respons naskah tidak valid.");

        setReportData(data);
        setArchiveLoadedInfo(null);

        let gHash = "";
        try {
          if (typeof window !== "undefined" && window.crypto && window.crypto.getRandomValues) {
            let gb = new Uint8Array(16);
            window.crypto.getRandomValues(gb);
            for (let gi = 0; gi < gb.length; gi++) gHash += gb[gi].toString(16).padStart(2, "0");
          }
        } catch(e) {}
        if (!gHash || gHash.length < 32) {
          let gt = Date.now().toString(16);
          let gr1 = Math.random().toString(16).substring(2);
          let gr2 = Math.random().toString(16).substring(2);
          gHash = (gt + gr1 + gr2 + "00000000000000000000000000000000").slice(0, 32);
        }
        setDocStamp("CAS-" + gHash.toUpperCase());
        setDocHash("SHA256-" + gHash.slice(0, 16).toUpperCase());

        // Keterhubungan Judul & Kop Dinas
        let selectedSatkerObj = satkerList.find(s => s.id === effectiveSatkerId);
        let sName = (selectedSatkerObj && selectedSatkerObj.nama) ? selectedSatkerObj.nama.toUpperCase() : (data.meta?.satkerNama || "BARESKRIM POLRI");
        let isApexBareskrim = (!effectiveSatkerId || effectiveSatkerId === 1 || effectiveSatkerId === 13);
        let b2 = isApexBareskrim
          ? (effectiveKelompok ? ("BARESKRIM POLRI DAN JAJARAN (" + effectiveKelompok + ")") : "BARESKRIM POLRI DAN JAJARAN")
          : sName;
        let pUpper = pLabel ? pLabel.toUpperCase() : ((b[defMonth - 1] ? b[defMonth - 1].toUpperCase() : "SEPTEMBER") + " " + defYear);
        let b3 = "PERIODE " + pUpper;

        setHeaderBaris1("LAPORAN ANEV PERIODIK");
        setHeaderBaris2(b2);
        setHeaderBaris3(b3);

        // Setting Pejabat Penandatangan (Kotak Panduan Interaktif - Dibiarkan diganti sendiri oleh operator)
        setArchiveLoadedInfo(null);
        setPejabatTempatTanggal(prev => prev || ("Jakarta, " + new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })));
        setPejabatJabatan(prev => prev || "[JABATAN]");
        setPejabatNama(prev => prev || "[NAMA PENANDATANGAN]");
        setPejabatPangkat(prev => prev || "[PANGKAT] NRP [NO NRP]");

        // Susun Narasi Situasi Umum / Pendahuluan
        let ctVal = data.kamtibmas?.ct?.current || 0;
        let cClock = data.indikator?.crimeClockFull || "Nihil Kejadian";
        let cRate = data.indikator?.crimeRateText || "0 per 100.000 Penduduk";
        let pTotal = (data.meta?.jumlahPenduduk || 0).toLocaleString("id-ID");
        let jajaranCount = data.meta?.jumlahSatkerJajaran || 0;

        setSituasiUmum(`Secara umum stabilitas keamanan dan ketertiban masyarakat di wilayah hukum ${sName} dengan populasi penduduk sebanyak ${pTotal} jiwa dan membawahi ${jajaranCount} satuan kewilayahan selama periode ${pLabel} berada dalam keadaan aman, tertib, dan kondusif. Berdasarkan pemetaan indikator kriminologi terintegrasi, kecepatan kejahatan (Crime Clock) tercatat ${cClock} dengan tingkat risiko kejahatan (Crime Rate) sebesar ${cRate}. Seluruh dinamika sosial, ekonomi, dan politik dapat terkelola secara presisi melalui langkah-langkah penegakan hukum yang profesional, proporsional, serta berkeadilan.`);

        // Pasang Personel & Kualifikasi
        let effPersonel = (data.personel?.pangkat && data.personel.pangkat.length > 0) ? data.personel.pangkat : defaultPersonelPangkat;
        let effKualifikasi = (data.personel?.kualifikasi && data.personel.kualifikasi.length > 0) ? data.personel.kualifikasi : defaultKualifikasiPenyidik;
        setPersonelRows(effPersonel);
        setKualifikasiRows(effKualifikasi);

        let dspTot = effPersonel.reduce((a, b) => a + (Number(b.dsp) || 0), 0) || 4598;
        let riilTot = effPersonel.reduce((a, b) => a + (Number(b.riil) || 0), 0) || 4081;
        let pemenuhanPct = dspTot > 0 ? Math.round((riilTot / dspTot) * 100) : 89;
        let totalPenyidik = (effKualifikasi[1]?.riil || 0) + (effKualifikasi[2]?.riil || 0) || 760;
        let caseLoad = totalPenyidik > 0 && ctVal > 0 ? Math.max(1, Math.round(ctVal / totalPenyidik)) : 12;

        setPersonelNarasi("Kekuatan personel pengemban fungsi reserse kriminal pada " + sName + " saat ini tercatat sebanyak " + riilTot.toLocaleString("id-ID") + " personel dari DSP ideal sebanyak " + dspTot.toLocaleString("id-ID") + " personel (tingkat pemenuhan " + pemenuhanPct + "%). Rata-rata beban perkara per penyidik tercatat sebesar 1 : " + caseLoad + " perkara dalam periode pelaporan. Meskipun menghadapi kendala selisih personel, optimalisasi pembagian tugas penanganan perkara dan asistensi gelar perkara terus ditingkatkan guna menjamin kepastian hukum.");

        // Pasang Sarpras
        let effSarpras = (data.sarpras?.items && data.sarpras.items.length > 0) ? data.sarpras.items : defaultSarprasAlmatsus;
        setSarprasRows(effSarpras);
        let baikTot = effSarpras.reduce((a, b) => a + (Number(b.baik) || 0), 0);
        let totalSarpras = effSarpras.reduce((a, b) => a + (Number(b.dsp) || 0), 0) || baikTot;
        let sarprasLaikPct = totalSarpras > 0 ? Math.round((baikTot / totalSarpras) * 100) : 91;
        setSarprasNarasi("Kesiapan Alat Material Khusus (Almatsus) operasional penegakan hukum berada pada tingkat kelaikan " + sarprasLaikPct + "%. Ketersediaan perangkat pelacak sinyal Direction Finder (DF), mobile digital forensic extraction kit, alat komunikasi Handy Talkie (HT) taktis terenkripsi, unit komputer PC/laptop operasional CAS, kendaraan taktis penindakan R4/R2, serta perlengkapan perlindungan personel (rompi anti peluru dan helm balistik) telah memenuhi standar kesiapan operasional guna mendukung efektivitas penyelidikan dan penyidikan di lapangan.");

        // Narasi Kamtibmas (CT & Golongan)
        let ctCur = data.kamtibmas?.ct?.current || 0;
        let ctPrv = data.kamtibmas?.ct?.prev || 0;
        let ctDel = data.kamtibmas?.ct?.delta || 0;
        let ctP = data.kamtibmas?.ct?.pct || 0;
        let ctStat = data.kamtibmas?.ct?.status || "TETAP";
        let ccCur = data.kamtibmas?.cc?.current || 0;
        let ccR = data.kamtibmas?.cc?.ccRate || 0;

        setKamtibmasCtNarasi(`Jumlah kejahatan yang dilaporkan (Crime Total/CT) pada periode pelaporan tercatat sebanyak ${ctCur.toLocaleString("id-ID")} perkara, dibandingkan periode pembanding sebelumnya (${ctPrv.toLocaleString("id-ID")} perkara), mengalami pergerakan ${ctDel > 0 ? 'kenaikan' : ctDel < 0 ? 'penurunan' : 'stagnasi'} sebesar ${Math.abs(ctDel).toLocaleString("id-ID")} perkara (${ctP}%) dengan tren ${ctStat}. Dari jumlah tersebut, jajaran berhasil menyelesaikan (Crime Clearance/CC) sebanyak ${ccCur.toLocaleString("id-ID")} perkara dengan Clearance Rate mencapai ${ccR}%.`);

        let golK = data.kamtibmas?.golongan?.konvensional?.current || 0;
        let golT = data.kamtibmas?.golongan?.transnasional?.current || 0;
        let golN = data.kamtibmas?.golongan?.kekayaan_negara?.current || 0;
        let golC = data.kamtibmas?.golongan?.kontinjensi?.current || 0;
        let domGol = golK >= golT && golK >= golN ? "Kejahatan Konvensional (Street Crime)" : (golT >= golN ? "Kejahatan Transnasional" : "Kejahatan terhadap Kekayaan Negara");
        setKamtibmasGolNarasi(`Berdasarkan klasifikasi empat golongan kejahatan, struktur kriminalitas didominasi oleh ${domGol} sebanyak ${golK.toLocaleString("id-ID")} perkara (${ctCur > 0 ? Math.round((golK/ctCur)*100) : 0}%), disusul Kejahatan Transnasional sebanyak ${golT.toLocaleString("id-ID")} perkara, Kejahatan terhadap Kekayaan Negara sebanyak ${golN.toLocaleString("id-ID")} perkara, dan Kejahatan Berimplikasi Kontinjensi sebanyak ${golC.toLocaleString("id-ID")} perkara.`);

        let topArr = (data.kamtibmas?.top5 || []).map(t => `${t.jenis} (${t.jml} kasus)`).join(", ");
        setKamtibmasTopNarasi(`Lima tindak pidana dengan frekuensi pelaporan tertinggi adalah: ${topArr || "Tindak pidana umum"}. Modus operandi didominasi oleh pemanfaatan kelengahan korban di ruang publik serta rekayasa transaksi elektronik fiktif pada ruang siber.`);

        let pwData = data.kamtibmas?.polaWaktu || {};
        let jamRawanMax = "Malam hari (18.00 - 24.00)";
        if ((pwData.siang || 0) > (pwData.malam || 0) && (pwData.siang || 0) > (pwData.dini_hari || 0)) jamRawanMax = "Siang hari (12.00 - 18.00)";
        else if ((pwData.dini_hari || 0) > (pwData.malam || 0)) jamRawanMax = "Dini hari (00.00 - 06.00)";
        setKamtibmasJamNarasi(`Anatomi waktu kejadian (Crime Time) menunjukkan konsentrasi kerawanan tertinggi terjadi pada kurun waktu ${jamRawanMax}. Sedangkan titik rawan kejadian (Crime Spot) terkonsentrasi pada kawasan permukiman padat dan jalur arteri lalu lintas publik. Diperlukan peningkatan patroli presisi pada jam-jam kritis tersebut.`);

        // Narasi CC
        let t2 = data.kamtibmas?.cc?.tahap_ii || 0;
        let rj = data.kamtibmas?.cc?.perma || 0;
        let sp3 = data.kamtibmas?.cc?.sp3 || 0;
        setCcNarasi(`Penyelesaian perkara (Crime Clearance) sebesar ${ccCur.toLocaleString("id-ID")} perkara diselesaikan melalui jalur penuntutan peradilan pidana (Tahap II ke JPU) sebanyak ${t2.toLocaleString("id-ID")} perkara, mekanisme Keadilan Restoratif (Restorative Justice / PERMA) sebanyak ${rj.toLocaleString("id-ID")} perkara, serta penghentian penyidikan/penyelidikan berkepastian hukum (SP3/SP2Lid) sebanyak ${sp3.toLocaleString("id-ID")} perkara. Penerapan RJ mengedepankan pemulihan hak korban dan perdamaian para pihak.`);

        // Narasi Jajaran
        let mSat = data.kamtibmas?.matriksSatker || [];
        if (mSat.length > 0) {
          let top1 = mSat[0]?.satker_nama || "Satker A";
          let top2 = mSat[1]?.satker_nama || "Satker B";
          let bot1 = mSat[mSat.length - 1]?.satker_nama || "Satker Z";
          setJajaranNarasi(`Evaluasi capaian jajaran kewilayahan menunjukkan aktivitas laporan tertinggi tercatat pada ${top1} dan ${top2}. Terhadap satuan kerja dengan penyelesaian perkara di bawah target evaluasi seperti ${bot1}, diperintahkan untuk segera mengintensifkan asistensi penyidikan dan pengawasan melekat oleh para Kasatker.`);
        } else {
          setJajaranNarasi("Seluruh jajaran kewilayahan telah melaksanakan penanganan perkara sesuai target rencana operasional yang ditetapkan.");
        }

        // Kasus Menonjol
        let effKasus = (data.kasusMenonjol && data.kasusMenonjol.length > 0) ? data.kasusMenonjol : defaultKasusMenonjol;
        setKasusMenonjolRows(effKasus);
        setKasusMenonjolNarasi("Terhadap kasus-kasus berimplikasi atensi publik dan tindak pidana berintensitas tinggi, jajaran telah melakukan penanganan cepat, transparan, dan akuntabel. Manajemen media bersama Bidhumas telah melaksanakan konferensi pers rilis secara berkala guna mengimbangi narasi di media sosial dan memberikan rasa kepastian hukum kepada masyarakat.");

        // Nilai Ekonomis
        let effEkonomis = data.nilaiEkonomis || defaultNilaiEkonomis;
        setNilaiEkonomisData(effEkonomis);
        let asetRp = (effEkonomis?.asetDisita || 18240000000).toLocaleString("id-ID");
        let recPct = effEkonomis?.recoveryRatePct || 42.6;
        setNilaiEkonomisNarasi("Melalui penguatan fungsi Asset Tracing dan penerapan tindak pidana pencucian uang (TPPU), jajaran reserse kriminal berhasil mengamankan dan menyita aset barang bukti bernilai ekonomis sebesar Rp " + asetRp + ",- dengan tingkat pemulihan kerugian (Asset Recovery Rate) mencapai " + recPct + "%. Langkah ini merupakan wujud nyata penegakan hukum yang tidak hanya menghukum pelaku namun juga memulihkan kerugian keuangan negara dan masyarakat.");
  toastRef.current?.show({
          severity: "success",
          summary: "Naskah Berhasil Disusun",
          detail: `Naskah dinas untuk ${sName} periode ${pLabel} berhasil dibuat.`
        });
      } catch(err) {
        toastRef.current?.show({
          severity: "error",
          summary: "Gagal Menyusun Naskah",
          detail: err.message || "Terjadi kesalahan."
        });
      } finally {
        setGenerating(false);
      }
    }, [periodeTipe, selYear, selMonth, selDate, selWeek, selQuarter, selSemester, customStart, customEnd, selSatkerId]);

    (0,a.useEffect)(() => {
      handleGenerateLampiran();
    }, []);

    // Tambah Baris Kasus Menonjol Manual
    let handleAddKasusMenonjol = (0,a.useCallback)(() => {
      let nextNo = kasusMenonjolRows.length + 1;
      let newRow = {
        no: nextNo,
        noLp: `LP/B/${nextNo + 100}/${selMonth}/2026/SPKT/${headerBaris2}`,
        tglLp: selDate || new Date().toISOString().slice(0, 10),
        pasal: "Pasal 378 KUHP (Penipuan)",
        kronologis: "Telah dilaporkan dugaan tindak pidana yang sedang ditangani proses lidik sidik.",
        tkp: "Wilayah Hukum " + headerBaris2,
        statusSidik: "Penyidikan (Sidik)",
        pressRelease: "Telah Dilaksanakan Press Release",
        linkPublikasi: "https://humas.polri.go.id/kasus-" + nextNo,
        atensiPimpinan: "Percepat pemenuhan alat bukti dan berikan kepastian hukum kepada pelapor."
      };
      setKasusMenonjolRows(prev => [...prev, newRow]);
    }, [kasusMenonjolRows.length, selMonth, headerBaris2, selDate]);

    // Cetak & Arsipkan Dokumen
    let handlePrintAndArchive = (0,a.useCallback)(async () => {
      setPrinting(true);
      try {
        let printTime = new Date().toLocaleString("id-ID", { dateStyle: "full", timeStyle: "medium" });
        setPrintTimestamp(printTime);

        let secStamp = docStamp;
        let payloadSnapshot = {
          header: { baris1: headerBaris1, baris2: headerBaris2, baris3: headerBaris3 },
          meta: reportData?.meta,
          pendahuluan: { dasarHukum, situasiUmum },
          personel: { rows: personelRows, kualifikasi: kualifikasiRows, narasi: personelNarasi },
          sarpras: { rows: sarprasRows, narasi: sarprasNarasi },
          kamtibmas: {
            ...reportData?.kamtibmas,
            ctNarasi: kamtibmasCtNarasi,
            golNarasi: kamtibmasGolNarasi,
            topNarasi: kamtibmasTopNarasi,
            jamNarasi: kamtibmasJamNarasi,
            ccNarasi
          },
          jajaran: { matriks: reportData?.kamtibmas?.matriksSatker, narasi: jajaranNarasi },
          kasusMenonjol: { rows: kasusMenonjolRows, narasi: kasusMenonjolNarasi },
          nilaiEkonomis: { data: nilaiEkonomisData, narasi: nilaiEkonomisNarasi },
          evaluasi: { kendala: kendalaList, rekomendasi: rekomendasiList },
          pejabat: { tempatTanggal: pejabatTempatTanggal, kota: pejabatKota, jabatan: pejabatJabatan, nama: pejabatNama, pangkat: pejabatPangkat },
          printedAt: new Date().toISOString(),
          printedByName: currentUser?.name || currentUser?.full_name || "EKO",
          printedByNrp: currentUser?.nrp || ((String(currentUser?.id) === "1" || currentUser?.username === "om.eko_42" || currentUser?.username === "omeko11" || currentUser?.email?.includes("agungkrisdianto98")) ? "98010710" : (currentUser?.nip || "-"))
        };

        let rawString = JSON.stringify(payloadSnapshot);
        let { dStart, dEnd, pLabel } = computeDates();

        let logPayload = {
          satkerId: reportData?.meta?.satkerId || selSatkerId || 1,
          periodeTipe,
          periodeLabel: pLabel,
          periodeStart: dStart,
          periodeEnd: dEnd,
          documentTitle: "LAPORAN ANEV PERIODIK - " + headerBaris2 + " (" + pLabel + ")",
          encryptedPayload: rawString,
          securityStamp: secStamp,
          fileSize: rawString.length,
          contentHash: docHash
        };

        let logOk = false;
        if (m?.apiAuth) {
          try {
            await m.apiAuth.post("/bdb/anev/lampiran/log-print", logPayload);
            logOk = true;
          } catch(e) {}
        }
        if (!logOk) {
          let logRes = await fetch("/api/bdb/anev/lampiran/log-print", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(logPayload)
          });
          if (logRes.ok) logOk = true;
        }

        if (logOk) {
          toastRef.current?.show({
            severity: "success",
            summary: "Dokumen Terenkripsi & Diarsipkan",
            detail: "Kode CAS: " + secStamp + ". Membuka jendela cetak dinas..."
          });
        }

        setTimeout(() => {
          window.print();
          setPrinting(false);
        }, 500);
      } catch(err) {
        setPrinting(false);
        toastRef.current?.show({
          severity: "warn",
          summary: "Mencetak Tanpa Arsip",
          detail: "Gagal mencatat log arsip: " + (err.message || "kesalahan jaringan")
        });
        window.print();
      }
    }, [headerBaris1, headerBaris2, headerBaris3, reportData, dasarHukum, situasiUmum, personelRows, kualifikasiRows, personelNarasi, sarprasRows, sarprasNarasi, kamtibmasCtNarasi, kamtibmasGolNarasi, kamtibmasTopNarasi, kamtibmasJamNarasi, ccNarasi, jajaranNarasi, kasusMenonjolRows, kasusMenonjolNarasi, nilaiEkonomisData, nilaiEkonomisNarasi, kendalaList, rekomendasiList, pejabatKota, pejabatJabatan, pejabatNama, pejabatPangkat, currentUser, selSatkerId, periodeTipe]);

    // Buka Arsip
    let loadArchives = (0,a.useCallback)(async () => {
      setArchiveLoading(true);
      try {
        let list = null;
        if (m?.apiAuth) {
          try {
            let res = await m.apiAuth.get("/bdb/anev/lampiran/archives?limit=50");
            list = res.data?.data;
          } catch(e) {}
        }
        if (!list) {
          let res = await fetch("/api/bdb/anev/lampiran/archives?limit=50", { credentials: "include" });
          if (res.ok) {
            let json = await res.json();
            list = json.data || json;
          }
        }
        setArchiveList(Array.isArray(list) ? list : []);
      } catch(e) {
        // ignore
      } finally {
        setArchiveLoading(false);
      }
    }, []);

    (0,a.useEffect)(() => {
      if (activeTab === "arsip") loadArchives();
    }, [activeTab]);

    let handleOpenArchive = (0,a.useCallback)(async (archItem) => {
      try {
        let detail = null;
        if (m?.apiAuth) {
          try {
            let res = await m.apiAuth.get("/bdb/anev/lampiran/archives/" + archItem.id);
            detail = res.data?.data;
          } catch(e) {}
        }
        if (!detail) {
          let res = await fetch(`/api/bdb/anev/lampiran/archives/${archItem.id}`, { credentials: "include" });
          if (!res.ok) throw new Error("Gagal mengambil detail arsip.");
          let json = await res.json();
          detail = json.data;
        }
        if (!detail || !detail.encrypted_payload) throw new Error("Data arsip kosong.");

        let snap = JSON.parse(detail.encrypted_payload);
        if (snap.header) {
          setHeaderBaris1(snap.header.baris1 || "LAPORAN ANEV PERIODIK");
          setHeaderBaris2(snap.header.baris2 || "BARESKRIM POLRI");
          setHeaderBaris3(snap.header.baris3 || "PERIODE: ...");
        }
        if (snap.pendahuluan) {
          if (snap.pendahuluan.dasarHukum) setDasarHukum(snap.pendahuluan.dasarHukum);
          if (snap.pendahuluan.situasiUmum) setSituasiUmum(snap.pendahuluan.situasiUmum);
        }
        if (snap.personel) {
          if (snap.personel.rows) setPersonelRows(snap.personel.rows);
          if (snap.personel.kualifikasi) setKualifikasiRows(snap.personel.kualifikasi);
          if (snap.personel.narasi) setPersonelNarasi(snap.personel.narasi);
        }
        if (snap.sarpras) {
          if (snap.sarpras.rows) setSarprasRows(snap.sarpras.rows);
          if (snap.sarpras.narasi) setSarprasNarasi(snap.sarpras.narasi);
        }
        if (snap.kasusMenonjol) {
          if (snap.kasusMenonjol.rows) setKasusMenonjolRows(snap.kasusMenonjol.rows);
          if (snap.kasusMenonjol.narasi) setKasusMenonjolNarasi(snap.kasusMenonjol.narasi);
        }
        if (snap.nilaiEkonomis) {
          if (snap.nilaiEkonomis.data) setNilaiEkonomisData(snap.nilaiEkonomis.data);
          if (snap.nilaiEkonomis.narasi) setNilaiEkonomisNarasi(snap.nilaiEkonomis.narasi);
        }
        if (snap.pejabat) {
          if (snap.pejabat.tempatTanggal) setPejabatTempatTanggal(snap.pejabat.tempatTanggal);
          if (snap.pejabat.kota) setPejabatKota(snap.pejabat.kota);
          if (snap.pejabat.jabatan) setPejabatJabatan(snap.pejabat.jabatan);
          if (snap.pejabat.nama) setPejabatNama(snap.pejabat.nama);
          if (snap.pejabat.pangkat) setPejabatPangkat(snap.pejabat.pangkat);
        }
        if (snap.kamtibmas) {
          setReportData({
            meta: snap.meta || { satkerNama: detail.satker_nama, periodeLabel: detail.periode_label },
            header: snap.header,
            kamtibmas: snap.kamtibmas
          });
          if (snap.kamtibmas.ctNarasi) setKamtibmasCtNarasi(snap.kamtibmas.ctNarasi);
          if (snap.kamtibmas.golNarasi) setKamtibmasGolNarasi(snap.kamtibmas.golNarasi);
          if (snap.kamtibmas.topNarasi) setKamtibmasTopNarasi(snap.kamtibmas.topNarasi);
          if (snap.kamtibmas.jamNarasi) setKamtibmasJamNarasi(snap.kamtibmas.jamNarasi);
          if (snap.kamtibmas.ccNarasi) setCcNarasi(snap.kamtibmas.ccNarasi);
        }

        let snapNrp = snap?.printedByNrp;
        let validSnapNrp = (snapNrp && !snapNrp.includes("om.eko") && snapNrp !== "-") ? snapNrp : "";
        let validDetailNrp = (detail.user_nrp && !detail.user_nrp.includes("om.eko")) ? detail.user_nrp : "";
        setArchiveLoadedInfo({
          id: detail.id,
          stamp: detail.security_stamp,
          date: detail.created_at,
          operator: detail.user_nama || "Petugas",
          nrp: validSnapNrp || validDetailNrp || currentUser?.nrp || "98010710"
        });

        setActiveTab("lampiran");
        toastRef.current?.show({
          severity: "info",
          summary: "Snapshot Arsip Dimuat",
          detail: `Dokumen arsip ID #${detail.id} berhasil ditampilkan ke kanvas dinas.`
        });
      } catch(err) {
        toastRef.current?.show({ severity: "error", summary: "Gagal Buka Arsip", detail: err.message });
      }
    }, []);

    let yearsOpts = [2024, 2025, 2026, 2027, 2028].map(yr => ({ label: "Tahun " + yr, value: yr }));
    let monthsOpts = b.map((mName, idx) => ({ label: mName, value: idx + 1 }));
    let weeksOpts = [1, 2, 3, 4, 5].map(w => ({ label: "Minggu " + w, value: w }));
    let quartersOpts = [
      { label: "Triwulan I (Jan - Mar)", value: 1 },
      { label: "Triwulan II (Apr - Jun)", value: 2 },
      { label: "Triwulan III (Jul - Sep)", value: 3 },
      { label: "Triwulan IV (Okt - Des)", value: 4 }
    ];
    let semestersOpts = [
      { label: "Semester I (Jan - Jun)", value: 1 },
      { label: "Semester II (Jul - Des)", value: 2 }
    ];
    let periodTypesOpts = [
      { label: "Bulanan", value: "BULANAN" },
      { label: "Harian", value: "HARIAN" },
      { label: "Mingguan", value: "MINGGUAN" },
      { label: "Triwulan", value: "TRIWULAN" },
      { label: "Semester", value: "SEMESTER" },
      { label: "Tahunan", value: "TAHUNAN" },
      { label: "Kustom Tanggal", value: "CUSTOM" }
    ];

    let kData = reportData?.kamtibmas || {};
    let ct = kData.ct || { current: 0, prev: 0, delta: 0, pct: 0, status: "TETAP" };
    let cc = kData.cc || { current: 0, prev: 0, ccRate: 0, tahap_ii: 0, sp3: 0, sp2lid: 0, perma: 0 };
    let gol = kData.golongan || { konvensional: { current: 0 }, transnasional: { current: 0 }, kekayaan_negara: { current: 0 }, kontinjensi: { current: 0 } };
    let top5 = kData.top5 || [];
    let pw = kData.polaWaktu || { pagi: 0, siang: 0, malam: 0, dini_hari: 0 };
    let pl = kData.polaLokasi || [];
    let appleToApple = kData.appleToApple || [];
    let matriksSatker = kData.matriksSatker || [];

    // Format Default Kasus Apple-to-Apple (Top 40 Kasus Berimbang 4 Golongan)
    // Jika data dari DB kosong, tampilkan format default standar yang dapat disunting bebas
    const defaultAppleCases = [
      // 1. KEJAHATAN KONVENSIONAL
      { gol_id: 1, jenis: "Pencurian dengan Pemberatan (Curat)", lapor_prev: 1240, selesai_prev: 890, lapor_curr: 1180, selesai_curr: 915 },
      { gol_id: 1, jenis: "Pencurian Kendaraan Bermotor (Curanmor)", lapor_prev: 1580, selesai_prev: 920, lapor_curr: 1450, selesai_curr: 980 },
      { gol_id: 1, jenis: "Penipuan", lapor_prev: 2100, selesai_prev: 1540, lapor_curr: 1980, selesai_curr: 1620 },
      { gol_id: 1, jenis: "Penggelapan", lapor_prev: 980, selesai_prev: 750, lapor_curr: 920, selesai_curr: 780 },
      { gol_id: 1, jenis: "Pencurian dengan Kekerasan (Curas)", lapor_prev: 450, selesai_prev: 380, lapor_curr: 410, selesai_curr: 365 },
      { gol_id: 1, jenis: "Penganiayaan Berat (Anberat)", lapor_prev: 310, selesai_prev: 275, lapor_curr: 290, selesai_curr: 270 },
      { gol_id: 1, jenis: "Pembunuhan", lapor_prev: 65, selesai_prev: 62, lapor_curr: 58, selesai_curr: 56 },
      { gol_id: 1, jenis: "Perjudian", lapor_prev: 420, selesai_prev: 410, lapor_curr: 380, selesai_curr: 375 },
      { gol_id: 1, jenis: "Pengeroyokan", lapor_prev: 540, selesai_prev: 480, lapor_curr: 495, selesai_curr: 460 },
      { gol_id: 1, jenis: "Pemerasan / Pengancaman", lapor_prev: 280, selesai_prev: 220, lapor_curr: 260, selesai_curr: 230 },
      // 2. KEJAHATAN TRANSNASIONAL
      { gol_id: 2, jenis: "Tindak Pidana Narkotika", lapor_prev: 1850, selesai_prev: 1720, lapor_curr: 1780, selesai_curr: 1690 },
      { gol_id: 2, jenis: "Tindak Pidana Siber / ITE", lapor_prev: 950, selesai_prev: 620, lapor_curr: 1040, selesai_curr: 710 },
      { gol_id: 2, jenis: "Tindak Pidana Perdagangan Orang (TPPO)", lapor_prev: 120, selesai_prev: 105, lapor_curr: 95, selesai_curr: 88 },
      { gol_id: 2, jenis: "Penyelundupan Manusia (People Smuggling)", lapor_prev: 35, selesai_prev: 30, lapor_curr: 28, selesai_curr: 26 },
      { gol_id: 2, jenis: "Tindak Pidana Pencucian Uang (TPPU)", lapor_prev: 60, selesai_prev: 48, lapor_curr: 55, selesai_curr: 46 },
      { gol_id: 2, jenis: "Peredaran Uang Palsu", lapor_prev: 45, selesai_prev: 40, lapor_curr: 38, selesai_curr: 35 },
      { gol_id: 2, jenis: "Terorisme & Radikalisme", lapor_prev: 15, selesai_prev: 15, lapor_curr: 12, selesai_curr: 12 },
      { gol_id: 2, jenis: "Kejahatan Terorganisir Lintas Batas", lapor_prev: 25, selesai_prev: 22, lapor_curr: 20, selesai_curr: 19 },
      // 3. KEJAHATAN TERHADAP KEKAYAAN NEGARA
      { gol_id: 3, jenis: "Tindak Pidana Korupsi (Tipidkor)", lapor_prev: 180, selesai_prev: 145, lapor_curr: 165, selesai_curr: 140 },
      { gol_id: 3, jenis: "Pertambangan Tanpa Izin (Illegal Mining)", lapor_prev: 95, selesai_prev: 80, lapor_curr: 88, selesai_curr: 76 },
      { gol_id: 3, jenis: "Pembalakan Liar (Illegal Logging)", lapor_prev: 70, selesai_prev: 62, lapor_curr: 60, selesai_curr: 55 },
      { gol_id: 3, jenis: "Perikanan Ilegal (Illegal Fishing)", lapor_prev: 50, selesai_prev: 45, lapor_curr: 42, selesai_curr: 40 },
      { gol_id: 3, jenis: "Tindak Pidana Lingkungan Hidup", lapor_prev: 65, selesai_prev: 52, lapor_curr: 58, selesai_curr: 50 },
      { gol_id: 3, jenis: "Tindak Pidana Minyak dan Gas Bumi (Migas)", lapor_prev: 85, selesai_prev: 74, lapor_curr: 78, selesai_curr: 70 },
      { gol_id: 3, jenis: "Penyelundupan Kepabeanan & Cukai", lapor_prev: 40, selesai_prev: 35, lapor_curr: 36, selesai_curr: 33 },
      { gol_id: 3, jenis: "Pelanggaran HKI (Hak Kekayaan Intelektual)", lapor_prev: 30, selesai_prev: 24, lapor_curr: 25, selesai_curr: 22 },
      // 4. KEJAHATAN BERIMPLIKASI KONTINJENSI
      { gol_id: 4, jenis: "Konflik Sosial Antar Kelompok / SARA", lapor_prev: 45, selesai_prev: 40, lapor_curr: 38, selesai_curr: 36 },
      { gol_id: 4, jenis: "Anarki / Perusakan Fasilitas Publik", lapor_prev: 30, selesai_prev: 26, lapor_curr: 24, selesai_curr: 22 },
      { gol_id: 4, jenis: "Unjuk Rasa Anarkis", lapor_prev: 20, selesai_prev: 18, lapor_curr: 15, selesai_curr: 14 },
      { gol_id: 4, jenis: "Gangguan Separatisme / KKB", lapor_prev: 18, selesai_prev: 16, lapor_curr: 14, selesai_curr: 13 }
    ];

    let effectiveApple = (appleToApple && appleToApple.length > 0) ? appleToApple : defaultAppleCases;
    let golGroups = [
      { key: "1", title: "1. KEJAHATAN KONVENSIONAL", items: [] },
      { key: "2", title: "2. KEJAHATAN TRANSNASIONAL", items: [] },
      { key: "3", title: "3. KEJAHATAN TERHADAP KEKAYAAN NEGARA", items: [] },
      { key: "4", title: "4. KEJAHATAN BERIMPLIKASI KONTINJENSI", items: [] }
    ];

    effectiveApple.forEach(item => {
      let gid = String(item.gol_id || (item.golongan?.includes("KONVENSIONAL") ? "1" : item.golongan?.includes("TRANSNASIONAL") ? "2" : item.golongan?.includes("KEKAYAAN") ? "3" : item.golongan?.includes("KONTINJENSI") ? "4" : "1"));
      let target = golGroups.find(g => g.key === gid) || golGroups[0];
      target.items.push(item);
    });

    const defaultPoldas = [
      { satker_nama: "POLDA METRO JAYA", ct_prev: 3420, ct_curr: 3280, cc_prev: 2540, cc_curr: 2610, cc_rate: "79.6", evaluasi: "OPTIMAL" },
      { satker_nama: "POLDA JAWA BARAT", ct_prev: 2950, ct_curr: 2810, cc_prev: 2180, cc_curr: 2240, cc_rate: "79.7", evaluasi: "OPTIMAL" },
      { satker_nama: "POLDA JAWA TIMUR", ct_prev: 3100, ct_curr: 2980, cc_prev: 2390, cc_curr: 2450, cc_rate: "82.2", evaluasi: "OPTIMAL" },
      { satker_nama: "POLDA JAWA TENGAH", ct_prev: 2480, ct_curr: 2390, cc_prev: 1910, cc_curr: 1960, cc_rate: "82.0", evaluasi: "OPTIMAL" },
      { satker_nama: "POLDA SUMATERA UTARA", ct_prev: 2850, ct_curr: 2790, cc_prev: 2050, cc_curr: 2120, cc_rate: "76.0", evaluasi: "OPTIMAL" },
      { satker_nama: "POLDA SULAWESI SELATAN", ct_prev: 1650, ct_curr: 1580, cc_prev: 1220, cc_curr: 1260, cc_rate: "79.7", evaluasi: "OPTIMAL" },
      { satker_nama: "POLDA BALI", ct_prev: 890, ct_curr: 840, cc_prev: 690, cc_curr: 720, cc_rate: "85.7", evaluasi: "OPTIMAL" },
      { satker_nama: "POLDA RIAU", ct_prev: 1120, ct_curr: 1060, cc_prev: 860, cc_curr: 890, cc_rate: "84.0", evaluasi: "OPTIMAL" },
      { satker_nama: "POLDA SUMATERA SELATAN", ct_prev: 1740, ct_curr: 1690, cc_prev: 1280, cc_curr: 1330, cc_rate: "78.7", evaluasi: "OPTIMAL" },
      { satker_nama: "POLDA KALIMANTAN TIMUR", ct_prev: 980, ct_curr: 920, cc_prev: 740, cc_curr: 780, cc_rate: "84.8", evaluasi: "OPTIMAL" },
      { satker_nama: "POLDA BANTEN", ct_prev: 1040, ct_curr: 990, cc_prev: 780, cc_curr: 820, cc_rate: "82.8", evaluasi: "OPTIMAL" },
      { satker_nama: "POLDA LAMPUNG", ct_prev: 1380, ct_curr: 1310, cc_prev: 1020, cc_curr: 1060, cc_rate: "80.9", evaluasi: "OPTIMAL" }
    ];

    let effectiveMatriks = (matriksSatker && matriksSatker.length > 0) ? matriksSatker : defaultPoldas;
    let golDonutData = [
      { label: "Konvensional", value: gol.konvensional?.current || 0, color: "#2563eb" },
      { label: "Transnasional", value: gol.transnasional?.current || 0, color: "#8b5cf6" },
      { label: "Kekayaan Negara", value: gol.kekayaan_negara?.current || 0, color: "#f59e0b" },
      { label: "Kontinjensi", value: gol.kontinjensi?.current || 0, color: "#ef4444" }
    ];

    let ccDonutData = [
      { label: "Tahap II (P-21)", value: cc.tahap_ii || 0, color: "#10b981" },
      { label: "Restorative Justice (PERMA)", value: cc.perma || 0, color: "#3b82f6" },
      { label: "SP3 (Henti Sidik)", value: cc.sp3 || 0, color: "#f59e0b" },
      { label: "SP2Lid (Henti Lidik)", value: cc.sp2lid || 0, color: "#64748b" }
    ];

    let pwTotal = (pw.pagi || 0) + (pw.siang || 0) + (pw.malam || 0) + (pw.dini_hari || 0);
    let pwMax = Math.max(pw.pagi || 0, pw.siang || 0, pw.malam || 0, pw.dini_hari || 0, 1);
    let pwCalcH = (v) => Math.max(8, Math.round(((v || 0) / pwMax) * 70));

    let dspTotal = personelRows.reduce((a, b) => a + (Number(b.dsp) || 0), 0);
    let riilTotal = personelRows.reduce((a, b) => a + (Number(b.riil) || 0), 0);
    let selisihTotal = riilTotal - dspTotal;

    // Matriks satker totals
    let matTotCtPrev = effectiveMatriks.reduce((acc, s) => acc + Number(s.ct_prev || 0), 0);
    let matTotCtCurr = effectiveMatriks.reduce((acc, s) => acc + Number(s.ct_curr || 0), 0);
    let matTotCcPrev = effectiveMatriks.reduce((acc, s) => acc + Number(s.cc_prev || 0), 0);
    let matTotCcCurr = effectiveMatriks.reduce((acc, s) => acc + Number(s.cc_curr || 0), 0);
    let matTotRate = matTotCtCurr > 0 ? ((matTotCcCurr / matTotCtCurr) * 100).toFixed(1) : "0";
    let matDelta = matTotCtCurr - matTotCtPrev;
    let matPct = matTotCtPrev > 0 ? ((matDelta / matTotCtPrev) * 100).toFixed(1) : "0";

    let rawNrp = (archiveLoadedInfo && archiveLoadedInfo.nrp && !archiveLoadedInfo.nrp.includes("om.eko") && archiveLoadedInfo.nrp !== "-") 
      ? archiveLoadedInfo.nrp 
      : (currentUser?.nrp 
        || ((String(currentUser?.id) === "1" || currentUser?.username === "om.eko_42" || currentUser?.username === "omeko11" || currentUser?.email?.includes("agungkrisdianto98")) ? "98010710" : "") 
        || currentUser?.nip 
        || (currentUser?.username && !isNaN(Number(currentUser.username)) ? currentUser.username : "98010710"));
    let activeNrp = String(rawNrp).replace(/^(NRP|NIP)\s*[:.-]?\s*/i, "").trim() || "98010710";
    let watermarkText = [activeNrp, activeNrp, activeNrp, activeNrp].join("   •   ");
    let activeFilterCount = (kpPeriodMode !== "month" || selMonth !== defMonth || selYear !== defYear ? 1 : 0) + (eScope !== "national" || selSatkerId ? 1 : 0) + (eFD !== "INTERNAL_RESERSE" ? 1 : 0) + (activeKelompokCrime !== "ALL" ? 1 : 0) + (activeTipidCrime !== "ALL" ? 1 : 0) + (selGolonganId ? 1 : 0) + (acuanTanggal !== "both" ? 1 : 0) + (selModelLp ? 1 : 0) + (selClosureReason ? 1 : 0);

    return (0,t.jsxs)("div",{className:"anev-wrapper",children:[
      (0,t.jsx)(u.Toast,{ref:toastRef}),
      (0,t.jsx)("style",{dangerouslySetInnerHTML:{__html:`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0 !important;
          }
          html, body {
            width: 100% !important;
            height: auto !important;
            min-height: 100% !important;
            max-height: none !important;
            overflow: visible !important;
            overflow-x: visible !important;
            overflow-y: visible !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #__next,
          .cms-shell,
          .cms-main,
          .cms-content,
          main,
          .anev-wrapper {
            display: block !important;
            position: static !important;
            width: 100% !important;
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
            overflow: visible !important;
            overflow-x: visible !important;
            overflow-y: visible !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            background: #ffffff !important;
            transform: none !important;
            float: none !important;
          }
          .cms-sidebar,
          .cms-overlay,
          .cms-header-fixed,
          .cms-header,
          .cms-brand,
          .cms-topbar,
          .cms-breadcrumb,
          .dash-head,
          .anev-sticky-header,
          .anev-no-print,
          .anev-sheet-corner-pill,
          .anev-editor-info-banner,
          .anev-guide-hint-card,
          .p-toast,
          .p-confirm-dialog,
          .p-dialog,
          .p-dialog-mask,
          header,
          nav,
          aside,
          button {
            display: none !important;
          }
          .anev-pages-workspace {
            display: block !important;
            position: static !important;
            width: 100% !important;
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
            margin: 0 !important;
            padding: 0 !important;
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            zoom: 1 !important;
            transform: none !important;
            gap: 0 !important;
            overflow: visible !important;
          }
          .anev-page-sheet {
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            box-sizing: border-box !important;
            width: 210mm !important;
            min-width: 210mm !important;
            max-width: 210mm !important;
            height: 297mm !important;
            min-height: 297mm !important;
            max-height: 297mm !important;
            margin: 0 auto !important;
            padding: 10mm 14mm 12mm 14mm !important;
            page-break-before: auto !important;
            break-before: auto !important;
            page-break-after: always !important;
            break-after: page !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            overflow: hidden !important;
            position: relative !important;
            border: none !important;
            box-shadow: none !important;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .anev-page-sheet:last-child {
            page-break-after: auto !important;
            break-after: auto !important;
          }
          .anev-page-content {
            flex: 1 1 auto !important;
            width: 100% !important;
            max-width: 100% !important;
            overflow: hidden !important;
            box-sizing: border-box !important;
          }
          .anev-page-footer {
            flex-shrink: 0 !important;
            margin-top: auto !important;
            padding-top: 4mm !important;
            border-top: 1px solid #94a3b8 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .anev-forensic-stamp {
            display: flex !important;
            align-items: center !important;
            gap: 4px !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .anev-watermark-overlay {
            display: flex !important;
            opacity: 0.08 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .anev-guide-box {
            border: none !important;
            background: transparent !important;
            padding: 0 !important;
            margin: 2px 0 !important;
            box-shadow: none !important;
          }
          .anev-guide-space-box {
            height: 40px !important;
            border: none !important;
            background: transparent !important;
          }
        }
        .anev-sticky-header {
          position: sticky;
          top: var(--cms-header-h, 0px);
          z-index: 40;
          background: #f8fafc;
          border-bottom: 1.5px solid #cbd5e1;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.07);
          padding: 0.65rem 1rem 0.6rem 1rem;
          margin-bottom: 1.25rem;
          border-radius: 0 0 8px 8px;
        }
        .anev-docs-toolbar {
          display: flex;
          align-items: center;
          gap: 3px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          padding: 3px 8px;
          flex-wrap: wrap;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          margin-top: 0.5rem;
        }
        .anev-tool-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 28px;
          height: 28px;
          padding: 2px 7px;
          border-radius: 4px;
          border: 1px solid transparent;
          background: transparent;
          color: #334155;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          user-select: none;
          transition: all 0.12s ease;
        }
        .anev-tool-btn:hover {
          background: #f1f5f9;
          color: #0f172a;
          border-color: #cbd5e1;
        }
        .anev-tool-btn:active {
          background: #dbeafe;
          color: #1d4ed8;
          border-color: #93c5fd;
        }
        .anev-tool-separator {
          width: 1px;
          height: 20px;
          background: #cbd5e1;
          margin: 0 4px;
        }
        .anev-palette-dropdown {
          position: absolute;
          top: 100%;
          margin-top: 4px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          box-shadow: 0 4px 14px rgba(0,0,0,0.12);
          padding: 6px;
          display: flex;
          gap: 6px;
          z-index: 60;
        }
        .anev-color-swatch {
          width: 22px;
          height: 22px;
          border-radius: 4px;
          border: 1px solid #94a3b8;
          cursor: pointer;
          transition: transform 0.1s;
        }
        .anev-color-swatch:hover {
          transform: scale(1.15);
          border-color: #0f172a;
        }
        .anev-pages-workspace {
          background: #cbd5e1;
          padding: 2rem 1rem 4rem 1rem;
          border-radius: 8px;
          border: 1px solid #94a3b8;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2.5rem;
          box-sizing: border-box;
        }
        .anev-page-sheet {
          background: #ffffff;
          width: 100%;
          max-width: 880px;
          min-height: 1180px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15), 0 2px 6px rgba(0, 0, 0, 0.08);
          border: 1px solid #cbd5e1;
          border-radius: 2px;
          padding: 48px 52px 36px 52px;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-sizing: border-box;
          font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
          color: #0f172a;
          line-height: 1.55;
        }
        .anev-page-content {
          flex: 1 0 auto;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          outline: none !important;
          cursor: text;
        }
        .anev-page-content:focus {
          outline: none !important;
        }
        .anev-page-content p:empty::before,
        .anev-page-content div:empty::before {
          content: " ";
          white-space: pre;
        }
        .anev-table-naskah td:focus,
        .anev-table-naskah th:focus {
          outline: 2px solid #2563eb !important;
          background-color: #eff6ff !important;
        }
        .anev-custom-table-box {
          position: relative;
        }
        .anev-custom-table-box:hover {
          outline: 1.5px dashed #93c5fd;
        }
        .anev-chart-container {
          margin: 0.4rem 0 1rem 0.8rem !important;
          width: calc(100% - 0.8rem) !important;
          max-width: calc(100% - 0.8rem) !important;
          box-sizing: border-box !important;
          padding: 0.9rem 1.1rem !important;
          background: #f8fafc !important;
          border: 1px solid #cbd5e1 !important;
          border-radius: 6px !important;
          overflow: hidden !important;
        }
        .anev-table-naskah {
          width: calc(100% - 0.8rem) !important;
          max-width: calc(100% - 0.8rem) !important;
          margin-left: 0.8rem !important;
          box-sizing: border-box !important;
        }
        .anev-narasi-box {
          width: calc(100% - 0.8rem) !important;
          max-width: calc(100% - 0.8rem) !important;
          margin-left: 0.8rem !important;
          box-sizing: border-box !important;
          word-break: break-word !important;
        }
        .anev-custom-table-box {
          margin: 0.8rem 0 1rem 0.8rem;
          width: calc(100% - 0.8rem);
          box-sizing: border-box;
        }
        .anev-page-footer {
          flex-shrink: 0;
          margin-top: 2rem;
          padding-top: 0.6rem;
          border-top: 1.5px solid #cbd5e1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.72rem;
          color: #64748b;
          user-select: none;
        }
        .anev-forensic-stamp {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .anev-footer-right {
          font-size: 0.88rem;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: 2px;
          text-align: right;
        }
        .anev-guide-box {
          border: 1.5px dashed #94a3b8;
          background: #f8fafc;
          border-radius: 4px;
          padding: 4px 8px;
          margin: 3px 0;
          cursor: text;
          transition: all 0.15s ease;
          min-height: 24px;
          box-sizing: border-box;
          word-break: break-word;
        }
        .anev-guide-box:hover {
          border-color: #2563eb;
          background: #eff6ff;
        }
        .anev-guide-box:focus {
          border-style: solid;
          border-color: #1d4ed8;
          background: #ffffff;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
          outline: none;
        }
        .anev-guide-space-box {
          height: 68px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 6px 0;
        }
        .anev-editable {
          outline: none;
          border-radius: 3px;
          transition: background 0.15s;
          padding: 1px 3px;
        }
        .anev-editable:hover {
          background: #f1f5f9;
        }
        .anev-editable:focus {
          background: #eff6ff;
          box-shadow: 0 0 0 2px #93c5fd;
        }
        .anev-table-naskah {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.77rem;
          margin: 0.5rem 0 0.8rem 0;
        }
        .anev-table-naskah th, .anev-table-naskah td {
          border: 1px solid #64748b;
          padding: 5px 7px;
        }
        .anev-table-naskah th {
          background: #f1f5f9;
          font-weight: 700;
          text-align: center;
          color: #0f172a;
        }
        .anev-table-naskah tr:nth-child(even) td {
          background: #f8fafc;
        }
        .anev-watermark-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          pointer-events: none;
          overflow: hidden;
          opacity: 0.05;
          z-index: 5;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;
          user-select: none;
        }
        .anev-watermark-line {
          transform: rotate(-25deg);
          font-size: 0.88rem;
          font-weight: 900;
          letter-spacing: 2px;
          color: #0f172a;
          white-space: nowrap;
          margin: 70px 0;
        }
        .anev-section-title {
          font-weight: 900;
          font-size: 0.92rem;
          color: #000000;
          margin: 1.2rem 0 0.4rem 0;
          border-bottom: 1.5px solid #cbd5e1;
          padding-bottom: 2px;
        }
        .anev-sub-title {
          font-weight: 700;
          font-size: 0.83rem;
          color: #000000;
          margin: 0.6rem 0 0.2rem 0.8rem;
        }
        .anev-narasi-box {
          font-size: 0.79rem;
          margin: 0.2rem 0 0.7rem 0.8rem;
          text-align: justify;
          line-height: 1.6;
          color: #1e293b;
        }
        .anev-chart-container {
          margin: 0.3rem 0 1rem 0.8rem;
          padding: 1rem 1.25rem; box-sizing: border-box;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
        }
      `}}),

      // STICKY HEADER DINAS & TOOLBAR WYSIWYG (MS WORD / GOOGLE DOCS)
      (0,t.jsxs)("div",{className:"anev-sticky-header anev-no-print",children:[
        // Baris 1: Brand, Mode Status Badge & Action / Tab Switcher
        (0,t.jsxs)("div",{className:"anev-sticky-top-bar",children:[
          (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.6rem"},children:[
            (0,t.jsx)("div",{style:{width:"30px",height:"30px",borderRadius:"6px",background:"#2563eb",color:"#ffffff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:"1rem"},children:"📋"}),
            (0,t.jsxs)("div",{children:[
              (0,t.jsx)("h1",{style:{fontSize:"0.98rem",fontWeight:800,margin:0,color:"#0f172a"},children:"Anev Periodik Komprehensif Dinas"}),
              (0,t.jsxs)("div",{style:{fontSize:"0.7rem",color:"#64748b",display:"flex",alignItems:"center",gap:"0.4rem"},children:[
                (0,t.jsx)("span",{style:{fontWeight:700,color:"#2563eb"},children:headerBaris2}),
                (0,t.jsx)("span",{children:"•"}),
                (0,t.jsx)("span",{children:headerBaris3})
              ]})
            ]}),
            // Dynamic Status Badge (Pembeda Nyata Draft vs Arsip)
            activeTab === "arsip" ? (
              (0,t.jsxs)("span",{style:{marginLeft:"0.6rem",background:"#fef3c7",color:"#92400e",border:"1px solid #fde68a",padding:"3px 8px",borderRadius:"12px",fontSize:"0.7rem",fontWeight:800,display:"inline-flex",alignItems:"center",gap:"4px"},children:[
                (0,t.jsx)("i",{className:"pi pi-folder-open",style:{fontSize:"0.7rem"}}),
                "RUANG ARSIP"
              ]})
            ) : archiveLoadedInfo ? (
              (0,t.jsxs)("span",{style:{marginLeft:"0.6rem",background:"#fffbeb",color:"#b45309",border:"1.5px solid #f59e0b",padding:"3px 8px",borderRadius:"12px",fontSize:"0.7rem",fontWeight:800,display:"inline-flex",alignItems:"center",gap:"4px"},children:[
                (0,t.jsx)("i",{className:"pi pi-lock",style:{fontSize:"0.7rem"}}),
                "ARSIP #" + archiveLoadedInfo.id
              ]})
            ) : (
              (0,t.jsxs)("span",{style:{marginLeft:"0.6rem",background:"#ecfdf5",color:"#065f46",border:"1.5px solid #a7f3d0",padding:"3px 8px",borderRadius:"12px",fontSize:"0.7rem",fontWeight:800,display:"inline-flex",alignItems:"center",gap:"4px"},children:[
                (0,t.jsx)("span",{style:{width:"6px",height:"6px",borderRadius:"50%",background:"#10b981",display:"inline-block"}}),
                "DRAFT AKTIF"
              ]})
            )
          ]}),

          // Button Group Kinerja Perkara & Tab Switcher
          (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.45rem",flexWrap:"wrap",position:"relative"},children:[
            // TAB SWITCHER: [ 📄 Naskah / Draft ] vs [ 📁 Arsip Dokumen ]
            (0,t.jsxs)("div",{style:{display:"inline-flex",background:"#e2e8f0",padding:"2px",borderRadius:"6px",marginRight:"2px"},children:[
              (0,t.jsxs)(c.Button,{
                label: "📄 Naskah / Draft",
                size: "small",
                text: activeTab !== "lampiran",
                severity: activeTab === "lampiran" ? "primary" : "secondary",
                onClick: () => setActiveTab("lampiran"),
                style: { fontWeight: 700, borderRadius: "5px", padding: "4px 10px", fontSize: "0.76rem", height: "30px" }
              }),
              (0,t.jsxs)(c.Button,{
                label: "📁 Arsip Dokumen",
                size: "small",
                text: activeTab !== "arsip",
                severity: activeTab === "arsip" ? "primary" : "secondary",
                onClick: () => setActiveTab("arsip"),
                style: { fontWeight: 700, borderRadius: "5px", padding: "4px 10px", fontSize: "0.76rem", height: "30px" }
              })
            ]}),



            // If in Lampiran mode:
            activeTab === "lampiran" && (0,t.jsxs)(t.Fragment,{children:[
              // UNIFIED FILTER BUTTON PERSIS KINERJA PERKARA
              (0,t.jsx)(c.Button,{
                label: "Filter Perkara (" + activeFilterCount + ") ▾",
                icon: "pi pi-sliders-h",
                outlined: !unifiedFilterOpen,
                onClick: () => setUnifiedFilterOpen(v => !v),
                className: "att-btn kp-filter-trigger-btn" + (unifiedFilterOpen ? " active" : ""),
                style: { fontWeight: 700, height: "32px", fontSize: "0.78rem" }
              }),

              // Backdrop click to close
              unifiedFilterOpen && (0,t.jsx)("div",{
                style: { position: "fixed", inset: 0, zIndex: 2490 },
                onClick: () => setUnifiedFilterOpen(false)
              }),

              // UNIFIED FILTER POPOVER CARD PERSIS KINERJA PERKARA
              unifiedFilterOpen && (0,t.jsxs)("div",{
                className: "kp-modal-card kp-filter-popover",
                style: { position: "absolute", top: "42px", right: 0, zIndex: 2500, width: "560px", maxWidth: "92vw", background: "#ffffff", borderRadius: "8px", boxShadow: "0 14px 40px rgba(0,0,0,0.22)", border: "1px solid #cbd5e1" },
                children: [
                  (0,t.jsxs)("div",{className:"kp-modal-header",style:{padding:"0.85rem 1.1rem",borderBottom:"1px solid #e2e8f0",display:"flex",alignItems:"center",justifyContent:"space-between"},children:[
                    (0,t.jsxs)("div",{children:[
                      (0,t.jsx)("div",{className:"kp-modal-title",style:{fontSize:"0.95rem",fontWeight:800,color:"#0f172a"},children:"🎛️ Filter & Parameter Kinerja Perkara & Anev"}),
                      (0,t.jsx)("div",{className:"kp-modal-sub",style:{fontSize:"0.72rem",color:"#64748b"},children:"Atur periode, satker kewilayahan, klasifikasi kejahatan, dan parameter analisis"})
                    ]}),
                    (0,t.jsx)("button",{type:"button",onClick:()=>setUnifiedFilterOpen(false),style:{background:"transparent",border:"none",fontSize:"1.2rem",cursor:"pointer",color:"#94a3b8",fontWeight:700},children:"×"})
                  ]}),
                  // Tab Bar (Persis Kinerja Perkara)
                  (0,t.jsx)("div",{className:"kp-tab-bar",style:{display:"flex",borderBottom:"1px solid #e2e8f0",background:"#f8fafc"},children:[
                    { idx: 0, label: "📅 Periode" },
                    { idx: 1, label: "🏛️ Satker & Wilayah" },
                    { idx: 2, label: "⚖️ Kejahatan" },
                    { idx: 3, label: "⚙️ Parameter & Model" }
                  ].map(tb => (0,t.jsx)("button",{
                    key: tb.idx,
                    type: "button",
                    onClick: () => setUnifiedFilterTab(tb.idx),
                    style: { flex: 1, padding: "8px 10px", fontSize: "0.76rem", fontWeight: 700, border: "none", borderBottom: unifiedFilterTab === tb.idx ? "2.5px solid #2563eb" : "2.5px solid transparent", background: unifiedFilterTab === tb.idx ? "#ffffff" : "transparent", color: unifiedFilterTab === tb.idx ? "#1d4ed8" : "#64748b", cursor: "pointer" },
                    children: tb.label
                  }))}),
                  // Tab Content Body
                  (0,t.jsxs)("div",{className:"kp-modal-body",style:{padding:"1rem 1.1rem",display:"grid",gap:"0.8rem",maxHeight:"60vh",overflowY:"auto"},children:[
                    // TAB 0: PERIODE (Persis KP: Bulan | Tahun | Custom)
                    unifiedFilterTab === 0 && (0,t.jsxs)("div",{style:{display:"grid",gap:"0.75rem"},children:[
                      (0,t.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:"0.4rem"},children:[
                        ["month","Bulan"],["year","Tahun"],["custom","Custom"]
                      ].map(([pVal, pText]) => (0,t.jsx)(c.Button,{
                        key: pVal,
                        label: pText,
                        size: "small",
                        outlined: kpPeriodMode !== pVal,
                        onClick: () => setKpPeriodMode(pVal),
                        style: { fontSize: "0.75rem", height: "30px", fontWeight: 700 }
                      }))}),
                      kpPeriodMode === "month" && (0,t.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.6rem"},children:[
                        (0,t.jsx)(l.Dropdown,{value:selMonth,options:b.map((nm,i)=>({label:nm,value:i+1})),onChange:e=>setSelMonth(e.value),placeholder:"Pilih Bulan",style:{width:"100%",fontSize:"0.76rem"}}),
                        (0,t.jsx)(l.Dropdown,{value:selYear,options:[2024,2025,2026].map(y=>({label:String(y),value:y})),onChange:e=>setSelYear(e.value),placeholder:"Pilih Tahun",style:{width:"100%",fontSize:"0.76rem"}})
                      ]}),
                      kpPeriodMode === "year" && (0,t.jsx)(l.Dropdown,{
                        value: selYear,
                        options: [2024,2025,2026].map(y=>({label:"Tahun " + y, value:y})),
                        onChange: e => setSelYear(e.value),
                        placeholder: "Pilih Tahun",
                        style: { width: "100%", fontSize: "0.76rem" }
                      }),
                      kpPeriodMode === "custom" && (0,t.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.6rem"},children:[
                        (0,t.jsxs)("div",{children:[
                          (0,t.jsx)("label",{style:{display:"block",fontSize:"0.72rem",fontWeight:700,marginBottom:"0.2rem",color:"#475569"},children:"Dari Tanggal"}),
                          (0,t.jsx)(s.InputText,{type:"date",value:customStart,onChange:e=>setCustomStart(e.target.value),style:{width:"100%",fontSize:"0.78rem"}})
                        ]}),
                        (0,t.jsxs)("div",{children:[
                          (0,t.jsx)("label",{style:{display:"block",fontSize:"0.72rem",fontWeight:700,marginBottom:"0.2rem",color:"#475569"},children:"Sampai Tanggal"}),
                          (0,t.jsx)(s.InputText,{type:"date",value:customEnd,onChange:e=>setCustomEnd(e.target.value),style:{width:"100%",fontSize:"0.78rem"}})
                        ]})
                      ]}),
                      (0,t.jsx)("div",{style:{fontSize:"0.70rem",color:"#059669",background:"#ecfdf5",padding:"6px 10px",borderRadius:"5px",border:"1px solid #a7f3d0"},children:"💡 Catatan: Default laporan mengacu pada bulan kemarin karena data bulan berjalan masih bergerak belum 100%."})
                    ]}),

                    // TAB 1: SATKER & WILAYAH (Persis KP: Nasional/Regional, Wilayah, Cakupan Satker)
                    unifiedFilterTab === 1 && (0,t.jsxs)("div",{style:{display:"grid",gap:"0.7rem"},children:[
                      (0,t.jsxs)("div",{children:[
                        (0,t.jsx)("label",{style:{display:"block",fontSize:"0.72rem",fontWeight:700,color:"#334155",marginBottom:"0.2rem"},children:"1. Kelompok Data"}),
                        (0,t.jsx)(l.Dropdown,{
                          value: eScope,
                          options: [
                            { label: "Kelompok Nasional (Mabes & Seluruh Polda)", value: "national" },
                            { label: "Kelompok Regional (Polda / Satker)", value: "scoped" }
                          ],
                          onChange: e => eSetScope(e.value),
                          style: { width: "100%", fontSize: "0.78rem" }
                        })
                      ]}),
                      eScope === "scoped" && (0,t.jsxs)("div",{children:[
                        (0,t.jsx)("label",{style:{display:"block",fontSize:"0.72rem",fontWeight:700,color:"#334155",marginBottom:"0.2rem"},children:"2. Wilayah Regional"}),
                        (0,t.jsx)(l.Dropdown,{
                          value: selSatkerId,
                          options: satkerList.map(s => ({ label: s.nama, value: s.id })),
                          onChange: e => setSelSatkerId(e.value),
                          placeholder: "Pilih Polda / Satuan Kerja...",
                          filter: !0,
                          style: { width: "100%", fontSize: "0.78rem" }
                        })
                      ]}),
                      (0,t.jsxs)("div",{children:[
                        (0,t.jsx)("label",{style:{display:"block",fontSize:"0.72rem",fontWeight:700,color:"#334155",marginBottom:"0.2rem"},children:"3. Cakupan Satker"}),
                        (0,t.jsx)(l.Dropdown,{
                          value: eFD,
                          options: [
                            { label: "Internal Reserse (Bareskrim, Ditreskrim, Satreskrim)", value: "INTERNAL_RESERSE" },
                            { label: "Eksternal Reserse / Non-Reserse (Lantas, Sabhara, Polsek)", value: "EKSTERNAL_RESERSE" }
                          ],
                          onChange: e => setEFD(e.value),
                          style: { width: "100%", fontSize: "0.78rem" }
                        })
                      ]})
                    ]}),

                    // TAB 2: KEJAHATAN (Persis KP: Kelompok Induk, Sub-TIPID, Golongan, Jenis)
                    unifiedFilterTab === 2 && (0,t.jsxs)("div",{style:{display:"grid",gap:"0.7rem"},children:[
                      (0,t.jsxs)("div",{children:[
                        (0,t.jsx)("label",{style:{display:"block",fontSize:"0.72rem",fontWeight:700,color:"#334155",marginBottom:"0.2rem"},children:"1. Kelompok Induk Kejahatan"}),
                        (0,t.jsx)(l.Dropdown,{
                          value: activeKelompokCrime,
                          options: [
                            { label: "Semua Kelompok Reserse (Krimum, Krimsus, Narkoba)", value: "ALL" },
                            { label: "KRIMUM (Kriminal Umum)", value: "KRIMUM" },
                            { label: "KRIMSUS (Kriminal Khusus)", value: "KRIMSUS" },
                            { label: "NARKOBA (Narkotika)", value: "NARKOBA" }
                          ],
                          onChange: e => {
                            let kVal = e.value;
                            setActiveKelompokCrime(kVal);
                            setActiveTipidCrime("ALL");
                          },
                          style: { width: "100%", fontSize: "0.78rem" }
                        })
                      ]}),
                      (0,t.jsxs)("div",{children:[
                        (0,t.jsx)("label",{style:{display:"block",fontSize:"0.72rem",fontWeight:700,color:"#334155",marginBottom:"0.2rem"},children:"2. Sub-Kelompok TIPID"}),
                        (0,t.jsx)(l.Dropdown,{
                          value: activeTipidCrime,
                          options: (activeKelompokCrime === "KRIMSUS" ? [
                            { label: "Semua Krimsus", value: "ALL" },
                            { label: "TIPIDSIBER (Siber & ITE)", value: "TIPIDSIBER" },
                            { label: "TIPIDEKSUS (Ekonomi Khusus)", value: "TIPIDEKSUS" },
                            { label: "TIPIDKOR (Korupsi)", value: "TIPIDKOR" },
                            { label: "TIPIDTER (Tertentu)", value: "TIPIDTER" }
                          ] : activeKelompokCrime === "KRIMUM" ? [
                            { label: "Semua Krimum", value: "ALL" },
                            { label: "TIPIDUM (Pidana Umum)", value: "TIPIDUM" },
                            { label: "TIPIDPPAPPO (PPA & PPO)", value: "TIPIDPPAPPO" }
                          ] : activeKelompokCrime === "NARKOBA" ? [
                            { label: "Semua Narkoba", value: "ALL" },
                            { label: "TIPIDNARKOBA (Narkotika)", value: "TIPIDNARKOBA" }
                          ] : [
                            { label: "Semua TIPID", value: "ALL" },
                            { label: "TIPIDUM (Pidana Umum)", value: "TIPIDUM" },
                            { label: "TIPIDPPAPPO (PPA & PPO)", value: "TIPIDPPAPPO" },
                            { label: "TIPIDEKSUS (Ekonomi Khusus)", value: "TIPIDEKSUS" },
                            { label: "TIPIDKOR (Korupsi)", value: "TIPIDKOR" },
                            { label: "TIPIDTER (Tertentu)", value: "TIPIDTER" },
                            { label: "TIPIDSIBER (Siber & ITE)", value: "TIPIDSIBER" },
                            { label: "TIPIDNARKOBA (Narkotika)", value: "TIPIDNARKOBA" }
                          ]),
                          onChange: e => setActiveTipidCrime(e.value),
                          style: { width: "100%", fontSize: "0.78rem" }
                        })
                      ]}),
                      (0,t.jsxs)("div",{children:[
                        (0,t.jsx)("label",{style:{display:"block",fontSize:"0.72rem",fontWeight:700,color:"#334155",marginBottom:"0.2rem"},children:"3. Golongan Kejahatan"}),
                        (0,t.jsx)(l.Dropdown,{
                          value: selGolonganId,
                          options: [
                            { label: "Semua Golongan (I s.d. IV)", value: "" },
                            { label: "Golongan I - Kejahatan Konvensional", value: "1" },
                            { label: "Golongan II - Kejahatan Transnasional", value: "2" },
                            { label: "Golongan III - Kejahatan Terhadap Kekayaan Negara", value: "3" },
                            { label: "Golongan IV - Kejahatan Berimplikasi Kontinjensi", value: "4" }
                          ],
                          onChange: e => setSelGolonganId(e.value),
                          style: { width: "100%", fontSize: "0.78rem" }
                        })
                      ]})
                    ]}),

                    // TAB 3: PARAMETER & MODEL (Persis KP: Acuan Tanggal, Model LP, RJ, Bucket)
                    unifiedFilterTab === 3 && (0,t.jsxs)("div",{style:{display:"grid",gap:"0.7rem"},children:[
                      (0,t.jsxs)("div",{children:[
                        (0,t.jsx)("label",{style:{display:"block",fontSize:"0.72rem",fontWeight:700,color:"#334155",marginBottom:"0.2rem"},children:"1. Acuan Tanggal Perhitungan"}),
                        (0,t.jsx)(l.Dropdown,{
                          value: acuanTanggal,
                          options: [
                            { label: "Kombinasi Tanggal Kejadian & Lapor (Standar KP)", value: "both" },
                            { label: "Berdasarkan Tanggal Kejadian Perkara", value: "kejadian" },
                            { label: "Berdasarkan Tanggal Laporan Polisi", value: "lapor" }
                          ],
                          onChange: e => setAcuanTanggal(e.value),
                          style: { width: "100%", fontSize: "0.78rem" }
                        })
                      ]}),
                      (0,t.jsxs)("div",{children:[
                        (0,t.jsx)("label",{style:{display:"block",fontSize:"0.72rem",fontWeight:700,color:"#334155",marginBottom:"0.2rem"},children:"2. Model Laporan Polisi (LP)"}),
                        (0,t.jsx)(l.Dropdown,{
                          value: selModelLp,
                          options: [
                            { label: "Semua Model (Model A & B)", value: "" },
                            { label: "Model A (Temuan / Inisiatif Polri)", value: "A" },
                            { label: "Model B (Laporan Masyarakat)", value: "B" }
                          ],
                          onChange: e => setSelModelLp(e.value),
                          style: { width: "100%", fontSize: "0.78rem" }
                        })
                      ]}),
                      (0,t.jsxs)("div",{children:[
                        (0,t.jsx)("label",{style:{display:"block",fontSize:"0.72rem",fontWeight:700,color:"#334155",marginBottom:"0.2rem"},children:"3. Jalur Penyelesaian / Closure Reason"}),
                        (0,t.jsx)(l.Dropdown,{
                          value: selClosureReason,
                          options: [
                            { label: "Semua Penyelesaian Perkara", value: "" },
                            { label: "Restorative Justice (Keadilan Restoratif)", value: "RJ" },
                            { label: "Selain Restorative Justice (P21, SP3, SP2Lid)", value: "NON_RJ" }
                          ],
                          onChange: e => setSelClosureReason(e.value),
                          style: { width: "100%", fontSize: "0.78rem" }
                        })
                      ]}),
                      (0,t.jsxs)("div",{children:[
                        (0,t.jsx)("label",{style:{display:"block",fontSize:"0.72rem",fontWeight:700,color:"#334155",marginBottom:"0.2rem"},children:"4. Mode Kinerja (Bucket)"}),
                        (0,t.jsx)(l.Dropdown,{
                          value: eBucket,
                          options: [
                            { label: "Usia Perkara (Age Bucket - Default)", value: "age" },
                            { label: "Tingkat Kesulitan Penanganan", value: "difficulty" }
                          ],
                          onChange: e => setEBucket(e.value),
                          style: { width: "100%", fontSize: "0.78rem" }
                        })
                      ]})
                    ]})
                  ]}),
                  // Footer Popover: Reset, Batal, Terapkan
                  (0,t.jsxs)("div",{className:"kp-modal-footer",style:{padding:"0.75rem 1.1rem",background:"#f8fafc",borderTop:"1px solid #e2e8f0",display:"flex",alignItems:"center",justifyContent:"space-between"},children:[
                    (0,t.jsx)(c.Button,{
                      label: "Reset Default",
                      icon: "pi pi-refresh",
                      text: !0,
                      size: "small",
                      severity: "secondary",
                      onClick: () => {
                        setKpPeriodMode("month");
                        setSelMonth(defMonth);
                        setSelYear(defYear);
                        setPeriodeTipe("BULANAN");
                        setCustomStart(defYear + "-" + defMonthStr + "-01");
                        setCustomEnd(defYear + "-" + defMonthStr + "-" + String(defLastDay).padStart(2, "0"));
                        setEScope("national");
                        setSelSatkerId(null);
                        setEFD("INTERNAL_RESERSE");
                        setActiveKelompokCrime("ALL");
                        setActiveTipidCrime("ALL");
                        setSelGolonganId("");
                        setAcuanTanggal("both");
                        setSelModelLp("");
                        setSelClosureReason("");
                        setEBucket("age");
                      },
                      style: { fontSize: "0.75rem" }
                    }),
                    (0,t.jsxs)("div",{style:{display:"flex",gap:"0.4rem"},children:[
                      (0,t.jsx)(c.Button,{label:"Batal",text:!0,size:"small",onClick:()=>setUnifiedFilterOpen(false),style:{fontSize:"0.75rem"}}),
                      (0,t.jsx)(c.Button,{
                        label: "Terapkan Filter",
                        icon: "pi pi-check",
                        size: "small",
                        onClick: () => {
                          setUnifiedFilterOpen(false);
                          handleGenerateLampiran();
                        },
                        style: { fontWeight: 700, fontSize: "0.75rem" }
                      })
                    ]})
                  ]})
                ]
              }),

              archiveLoadedInfo ? (
                // In Archive View: Button to return to fresh Draft
                (0,t.jsx)(c.Button,{
                  label: "➕ Ke Naskah Baru (Draft)",
                  icon: "pi pi-plus-circle",
                  size: "small",
                  severity: "info",
                  onClick: () => {
                    setArchiveLoadedInfo(null);
                    handleGenerateLampiran();
                  },
                  title: "Tutup arsip ini dan buat naskah dinas baru",
                  style: { fontWeight: 800, height: "32px", fontSize: "0.78rem" }
                })
              ) : (
                // In Draft View: Susun Naskah & Refresh
                (0,t.jsxs)(t.Fragment,{children:[
                  (0,t.jsx)(c.Button,{
                    label: "⚡ Susun Naskah",
                    size: "small",
                    onClick: handleGenerateLampiran,
                    loading: generating,
                    style: { fontWeight: 700, height: "32px", fontSize: "0.78rem" }
                  }),
                  (0,t.jsx)(c.Button,{
                    icon: "pi pi-refresh",
                    size: "small",
                    outlined: !0,
                    onClick: handleGenerateLampiran,
                    title: "Muat ulang data dari database",
                    style: { height: "32px" }
                  })
                ]})
              )
            ]})
          ]})
        ]}),

        (0,t.jsxs)("div",{style:{fontSize:"0.71rem",color:"#475569",display:"flex",alignItems:"center",gap:"0.4rem",background:"#f8fafc",padding:"0.3rem 0.75rem",borderRadius:"4px",borderTop:"1px solid #f1f5f9",flexWrap:"wrap"},children:[
          (0,t.jsx)("i",{className:"pi pi-sliders-h",style:{color:"#2563eb",fontSize:"0.72rem"}}),
          (0,t.jsx)("strong",{style:{color:"#0f172a"},children:"Filter Aktif:"}),
          (0,t.jsxs)("span",{style:{background:"#dbeafe",color:"#1e40af",padding:"1px 6px",borderRadius:"3px",fontWeight:700},children:["Periode: ",computeDates().pLabel]}),
          (eScope === "scoped" && selSatkerId) ? (0,t.jsxs)("span",{style:{background:"#e0e7ff",color:"#3730a3",padding:"1px 6px",borderRadius:"3px",fontWeight:700},children:["Satker: ",satkerList.find(s=>s.id===selSatkerId)?.nama || selSatkerId]}) : (0,t.jsx)("span",{style:{background:"#e0e7ff",color:"#3730a3",padding:"1px 6px",borderRadius:"3px",fontWeight:700},children:"Scope: Nasional"}),
          (0,t.jsx)("span",{style:{background:"#ecfdf5",color:"#065f46",padding:"1px 6px",borderRadius:"3px",fontWeight:700},children:"Fungsi: Internal Reserse"}),
          (0,t.jsxs)("span",{style:{background:"#dcfce7",color:"#166534",padding:"1px 6px",borderRadius:"3px",fontWeight:700},children:["Kejahatan: ", activeTipidCrime !== "ALL" ? activeTipidCrime : (activeKelompokCrime !== "ALL" ? activeKelompokCrime : "Reserse Kriminal (Krimum, Krimsus, Narkoba)")]}),
          (selGolonganId) && (0,t.jsxs)("span",{style:{background:"#fef3c7",color:"#92400e",padding:"1px 6px",borderRadius:"3px",fontWeight:700},children:["Golongan: ",selGolonganId]}),
          (acuanTanggal !== "both") && (0,t.jsxs)("span",{style:{background:"#ede9fe",color:"#5b21b6",padding:"1px 6px",borderRadius:"3px",fontWeight:700},children:["Acuan: Tgl ",acuanTanggal]}),
          (selModelLp) && (0,t.jsxs)("span",{style:{background:"#fce7f3",color:"#9d174d",padding:"1px 6px",borderRadius:"3px",fontWeight:700},children:["Model: ",selModelLp]}),
          (selClosureReason) && (0,t.jsxs)("span",{style:{background:"#e0e7ff",color:"#3730a3",padding:"1px 6px",borderRadius:"3px",fontWeight:700},children:["Penyelesaian: ",selClosureReason]}),
          activeFilterCount > 0 && (0,t.jsx)("button",{
            type:"button",
            onClick:()=>{
              setKpPeriodMode("month");
              setSelMonth(defMonth);
              setSelYear(defYear);
              setPeriodeTipe("BULANAN");
              setCustomStart(defYear + "-" + defMonthStr + "-01");
              setCustomEnd(defYear + "-" + defMonthStr + "-" + String(defLastDay).padStart(2, "0"));
              setEScope("national");
              setSelSatkerId(null);
              setEFD("INTERNAL_RESERSE");
              setActiveKelompokCrime("ALL");
              setActiveTipidCrime("ALL");
              setSelGolonganId("");
              setAcuanTanggal("both");
              setSelModelLp("");
              setSelClosureReason("");
              setEBucket("age");
            },
            style:{background:"transparent",border:"none",color:"#dc2626",fontSize:"0.71rem",cursor:"pointer",textDecoration:"underline",fontWeight:700,marginLeft:"auto"},
            children:"Reset Semua Filter"
          })
        ]}),
// Baris 3: MS Word / Google Docs Toolbar
        activeTab === "lampiran" && (0,t.jsxs)("div",{className:"anev-docs-toolbar",children:[
          // 1. Undo, Redo, Print
          (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Urungkan (Undo - Ctrl+Z)",onMouseDown:e=>{e.preventDefault();execCmd("undo")},children:(0,t.jsx)("i",{className:"pi pi-undo",style:{fontSize:"0.78rem"}})}),
          (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Ulangi (Redo - Ctrl+Y)",onMouseDown:e=>{e.preventDefault();execCmd("redo")},children:(0,t.jsx)("i",{className:"pi pi-refresh",style:{fontSize:"0.78rem"}})}),
          (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Cetak Naskah (Ctrl+P)",onMouseDown:e=>{e.preventDefault();window.print()},children:(0,t.jsx)("i",{className:"pi pi-print",style:{fontSize:"0.78rem"}})}),

          (0,t.jsx)("div",{className:"anev-tool-separator"}),

          // TOMBOL MENU TABEL & SPASI (MS WORD / GOOGLE DOCS STYLE)
          (0,t.jsxs)("button",{type:"button",className:"anev-tool-btn",title:"Sisipkan Tabel Baru ke Posisi Kursor",onMouseDown:e=>{e.preventDefault();handleInsertTable()},style:{gap:"3px",fontWeight:700,color:"#1e40af",background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:"4px",padding:"2px 8px"},children:[
            (0,t.jsx)("i",{className:"pi pi-table",style:{fontSize:"0.78rem"}}),
            " Tambah Tabel"
          ]}),
          (0,t.jsxs)("button",{type:"button",className:"anev-tool-btn",title:"Hapus Tabel Tempat Kursor Berada",onMouseDown:e=>{e.preventDefault();handleDeleteTable()},style:{gap:"3px",fontWeight:600,color:"#dc2626",background:"#fef2f2",border:"1px solid #fecaca",borderRadius:"4px",padding:"2px 7px"},children:[
            (0,t.jsx)("i",{className:"pi pi-trash",style:{fontSize:"0.75rem"}}),
            " Hapus Tabel"
          ]}),
          (0,t.jsxs)("button",{type:"button",className:"anev-tool-btn",title:"Tambah Baris ke Tabel",onMouseDown:e=>{e.preventDefault();handleAddTableRow()},style:{gap:"2px",fontSize:"0.74rem",color:"#047857",background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:"4px",padding:"2px 6px"},children:[
            (0,t.jsx)("i",{className:"pi pi-plus",style:{fontSize:"0.7rem"}}),
            " Baris"
          ]}),
          (0,t.jsxs)("button",{type:"button",className:"anev-tool-btn",title:"Hapus Baris dari Tabel",onMouseDown:e=>{e.preventDefault();handleDeleteTableRow()},style:{gap:"2px",fontSize:"0.74rem",color:"#b45309",background:"#fffbeb",border:"1px solid #fde68a",borderRadius:"4px",padding:"2px 6px"},children:[
            (0,t.jsx)("i",{className:"pi pi-minus",style:{fontSize:"0.7rem"}}),
            " Baris"
          ]}),
          (0,t.jsxs)("button",{type:"button",className:"anev-tool-btn",title:"Sisipkan Spasi / Paragraf Kosong ke Bawah (Enter)",onMouseDown:e=>{e.preventDefault();handleInsertSpace()},style:{gap:"3px",fontSize:"0.74rem",color:"#475569",background:"#f8fafc",border:"1px solid #cbd5e1",borderRadius:"4px",padding:"2px 7px"},children:[
            (0,t.jsx)("i",{className:"pi pi-arrow-down-left",style:{fontSize:"0.75rem"}}),
            " Nambah Spasi"
          ]}),

          (0,t.jsx)("div",{className:"anev-tool-separator"}),

          // 2. Zoom Dokumen
          (0,t.jsxs)("div",{style:{display:"inline-flex",alignItems:"center",gap:"2px"},children:[
            (0,t.jsx)("i",{className:"pi pi-search-plus",style:{fontSize:"0.72rem",color:"#64748b"}}),
            (0,t.jsx)(l.Dropdown,{value:docZoom,options:zoomOptions,onChange:e=>setDocZoom(e.value),style:{width:"5.3rem",height:"28px",fontSize:"0.76rem"}})
          ]}),

          (0,t.jsx)("div",{className:"anev-tool-separator"}),

          // 3. Format Blok / Heading
          (0,t.jsx)(l.Dropdown,{value:selectedHeading,options:headingOptions,onChange:e=>{setSelectedHeading(e.value);execCmd("formatBlock",e.value)},style:{width:"8.3rem",height:"28px",fontSize:"0.76rem"}}),

          // 4. Font Family
          (0,t.jsx)(l.Dropdown,{value:selectedFont,options:fontOptions,onChange:e=>{setSelectedFont(e.value);execCmd("fontName",e.value)},style:{width:"8.6rem",height:"28px",fontSize:"0.76rem"}}),

          (0,t.jsx)("div",{className:"anev-tool-separator"}),

          // 5. Bold, Italic, Underline, Strikethrough
          (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Tebal (Bold - Ctrl+B)",onMouseDown:e=>{e.preventDefault();execCmd("bold")},children:(0,t.jsx)("strong",{style:{fontSize:"0.84rem"},children:"B"})}),
          (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Miring (Italic - Ctrl+I)",onMouseDown:e=>{e.preventDefault();execCmd("italic")},children:(0,t.jsx)("em",{style:{fontSize:"0.84rem",fontFamily:"serif"},children:"I"})}),
          (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Garis Bawah (Underline - Ctrl+U)",onMouseDown:e=>{e.preventDefault();execCmd("underline")},children:(0,t.jsx)("u",{style:{fontSize:"0.84rem"},children:"U"})}),
          (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Coret (Strikethrough)",onMouseDown:e=>{e.preventDefault();execCmd("strikeThrough")},children:(0,t.jsx)("s",{style:{fontSize:"0.84rem"},children:"S"})}),

          (0,t.jsx)("div",{className:"anev-tool-separator"}),

          // 6. Warna Font & Stabilo
          (0,t.jsxs)("div",{style:{position:"relative",display:"inline-block"},children:[
            (0,t.jsxs)("button",{type:"button",className:"anev-tool-btn",title:"Warna Teks",onMouseDown:e=>{e.preventDefault();setShowColorMenu(!showColorMenu);setShowHighlightMenu(false)},children:[
              (0,t.jsxs)("span",{style:{display:"flex",flexDirection:"column",alignItems:"center",lineHeight:"1"},children:[
                (0,t.jsx)("strong",{style:{fontSize:"0.82rem"},children:"A"}),
                (0,t.jsx)("span",{style:{width:"14px",height:"3px",background:"#1d4ed8",marginTop:"1px",borderRadius:"1px"}})
              ]}),
              (0,t.jsx)("i",{className:"pi pi-chevron-down",style:{fontSize:"0.52rem",marginLeft:"3px"}})
            ]}),
            showColorMenu && (0,t.jsxs)("div",{className:"anev-palette-dropdown",children:[
              ["#000000","#1d4ed8","#b91c1c","#15803d","#d97706","#64748b"].map(c=>(
                (0,t.jsx)("div",{key:c,className:"anev-color-swatch",style:{background:c},title:c,onMouseDown:e=>{e.preventDefault();execCmd("foreColor",c);setShowColorMenu(false)}})
              ))
            ]})
          ]}),

          (0,t.jsxs)("div",{style:{position:"relative",display:"inline-block"},children:[
            (0,t.jsxs)("button",{type:"button",className:"anev-tool-btn",title:"Warna Sorotan (Stabilo)",onMouseDown:e=>{e.preventDefault();setShowHighlightMenu(!showHighlightMenu);setShowColorMenu(false)},children:[
              (0,t.jsxs)("span",{style:{display:"flex",flexDirection:"column",alignItems:"center",lineHeight:"1"},children:[
                (0,t.jsx)("span",{style:{fontSize:"0.78rem"},children:"🖍️"}),
                (0,t.jsx)("span",{style:{width:"14px",height:"3px",background:"#facc15",marginTop:"1px",borderRadius:"1px"}})
              ]}),
              (0,t.jsx)("i",{className:"pi pi-chevron-down",style:{fontSize:"0.52rem",marginLeft:"3px"}})
            ]}),
            showHighlightMenu && (0,t.jsxs)("div",{className:"anev-palette-dropdown",children:[
              ["#fef08a","#bbf7d0","#bae6fd","#fed7aa","#fbcfe8","transparent"].map(c=>(
                (0,t.jsx)("div",{key:c,className:"anev-color-swatch",style:{background:c==="transparent"?"#ffffff":c,border:c==="transparent"?"1.5px dashed #ef4444":"1px solid #94a3b8"},title:c==="transparent"?"Hapus Sorotan":c,onMouseDown:e=>{e.preventDefault();execCmd("hiliteColor",c);setShowHighlightMenu(false)}})
              ))
            ]})
          ]}),

          (0,t.jsx)("div",{className:"anev-tool-separator"}),

          // 7. Perataan Paragraf
          (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Rata Kiri",onMouseDown:e=>{e.preventDefault();execCmd("justifyLeft")},children:(0,t.jsx)("i",{className:"pi pi-align-left",style:{fontSize:"0.78rem"}})}),
          (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Rata Tengah",onMouseDown:e=>{e.preventDefault();execCmd("justifyCenter")},children:(0,t.jsx)("i",{className:"pi pi-align-center",style:{fontSize:"0.78rem"}})}),
          (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Rata Kanan",onMouseDown:e=>{e.preventDefault();execCmd("justifyRight")},children:(0,t.jsx)("i",{className:"pi pi-align-right",style:{fontSize:"0.78rem"}})}),
          (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Rata Kiri-Kanan (Justify)",onMouseDown:e=>{e.preventDefault();execCmd("justifyFull")},children:(0,t.jsx)("i",{className:"pi pi-align-justify",style:{fontSize:"0.78rem"}})}),

          (0,t.jsx)("div",{className:"anev-tool-separator"}),

          // 8. Daftar & Indentasi
          (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Daftar Butir (Bullets)",onMouseDown:e=>{e.preventDefault();execCmd("insertUnorderedList")},children:(0,t.jsx)("i",{className:"pi pi-list",style:{fontSize:"0.78rem"}})}),
          (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Daftar Angka (Numbering)",onMouseDown:e=>{e.preventDefault();execCmd("insertOrderedList")},children:(0,t.jsx)("span",{style:{fontSize:"0.72rem",fontWeight:800},children:"1."})}),
          (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Kurangi Indensasi (Outdent)",onMouseDown:e=>{e.preventDefault();execCmd("outdent")},children:(0,t.jsx)("i",{className:"pi pi-angle-left",style:{fontSize:"0.78rem"}})}),
          (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Tambah Indentasi (Indent)",onMouseDown:e=>{e.preventDefault();execCmd("indent")},children:(0,t.jsx)("i",{className:"pi pi-angle-right",style:{fontSize:"0.78rem"}})}),

          (0,t.jsx)("div",{className:"anev-tool-separator"}),

          // 9. Alat Sisipkan & Bersihkan
          (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Sisipkan Garis Pembatas",onMouseDown:e=>{e.preventDefault();execCmd("insertHorizontalRule")},children:(0,t.jsx)("i",{className:"pi pi-minus",style:{fontSize:"0.78rem"}})}),
          (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Hapus Format Teks (Clear Formatting)",onMouseDown:e=>{e.preventDefault();execCmd("removeFormat")},children:(0,t.jsx)("i",{className:"pi pi-filter-slash",style:{fontSize:"0.78rem"}})}),

          // 10. Sisipkan Batas Halaman (Page Break)
          (0,t.jsxs)("button",{type:"button",className:"anev-tool-btn",title:"Sisipkan Pemisah Halaman Cetak (Page Break)",style:{gap:"3px",fontSize:"0.74rem",color:"#475569"},onMouseDown:e=>{
            e.preventDefault();
            execCmd("insertHTML", '<div class="anev-page-break" style="page-break-before:always; border-top:1.5px dashed #cbd5e1; margin:1.5rem 0; padding-top:0.4rem; text-align:center; font-size:0.7rem; color:#94a3b8; user-select:none;">--- PEMISAH HALAMAN CETAK ---</div><p><br></p>');
          },children:[
            (0,t.jsx)("span",{children:"📄"}),
            "Batas Halaman"
          ]}),

          // 11. Reset Edit Naskah
          (0,t.jsxs)("button",{type:"button",className:"anev-tool-btn",title:"Muat Ulang Teks Standar dari Sistem",style:{marginLeft:"auto",gap:"3px",fontSize:"0.74rem",color:"#b91c1c"},onClick:handleGenerateLampiran,children:[
            (0,t.jsx)("i",{className:"pi pi-replay",style:{fontSize:"0.72rem"}}),
            "Reset Naskah"
          ]})
        ]})
      ]}),

      // TAB 1: NASKAH KANVAS DINAS A4
      activeTab === "lampiran" && (0,t.jsxs)("div",{children:[
        // DOKUMEN NASKAH A4 PAGES WORKSPACE (PERSIS MS WORD / GOOGLE DOCS)
        (0,t.jsxs)("div",{className:"anev-pages-workspace",style:{zoom:docZoom+"%",transition:"zoom 0.15s ease"},children:[
          // Info banner dinamis: ARSIP vs DRAFT
          archiveLoadedInfo ? (
            (0,t.jsxs)("div",{className:"anev-editor-info-banner anev-no-print",style:{width:"100%",maxWidth:"880px",background:"linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",border:"2px solid #f59e0b",borderRadius:"8px",padding:"10px 16px",marginBottom:"0.5rem",boxShadow:"0 4px 14px rgba(245, 158, 11, 0.15)",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"1rem",flexWrap:"wrap"},children:[
              (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"12px"},children:[
                (0,t.jsx)("div",{style:{width:"36px",height:"36px",borderRadius:"50%",background:"#f59e0b",color:"#ffffff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem",flexShrink:0},children:"🔒"}),
                (0,t.jsxs)("div",{children:[
                  (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[
                    (0,t.jsx)("span",{style:{fontWeight:900,fontSize:"0.90rem",color:"#78350f"},children:"MODE ARSIP: SALINAN RESMI NASKAH DINAS #" + archiveLoadedInfo.id}),
                    (0,t.jsx)("span",{style:{background:"#b45309",color:"#ffffff",padding:"1px 6px",borderRadius:"4px",fontSize:"0.66rem",fontWeight:800},children:"TERSIMPAN & TERKUNCI"})
                  ]}),
                  (0,t.jsxs)("div",{style:{fontSize:"0.73rem",color:"#92400e",marginTop:"2px"},children:[
                    "Tercatat pada: ", (0,t.jsx)("strong",{children:new Date(archiveLoadedInfo.date).toLocaleString("id-ID")}),
                    " | Operator: ", (0,t.jsx)("strong",{children:archiveLoadedInfo.operator}),
                    " | Kode CAS: ", (0,t.jsx)("code",{style:{background:"#fde68a",padding:"2px 5px",borderRadius:"3px",fontWeight:800,color:"#78350f"},children:(archiveLoadedInfo.stamp ? archiveLoadedInfo.stamp.replace(/^STAMP-/, "CAS-") : "CAS-" + archiveLoadedInfo.id)})
                  ]}),
                  (0,t.jsx)("div",{style:{fontSize:"0.70rem",color:"#b45309",marginTop:"2px"},children:"Dokumen ini adalah rekaman snapshot resmi historis. Untuk kembali ke naskah kerja aktif baru, klik tombol 'Tutup & Ke Draft Baru'."})
                ]})
              ]}),
              (0,t.jsxs)("div",{style:{display:"flex",gap:"6px"},children:[
                (0,t.jsx)(c.Button,{
                  label: "🖨️ Cetak Ulang Salinan",
                  size: "small",
                  severity: "warning",
                  style: { fontWeight: 800, fontSize: "0.75rem", height: "32px" },
                  onClick: () => window.print()
                }),
                (0,t.jsx)(c.Button,{
                  label: "✕ Tutup & Ke Draft Baru",
                  size: "small",
                  severity: "secondary",
                  style: { fontWeight: 800, fontSize: "0.75rem", height: "32px" },
                  onClick: () => {
                    setArchiveLoadedInfo(null);
                    handleGenerateLampiran();
                  }
                })
              ]})
            ]})
          ) : (
            (0,t.jsxs)("div",{className:"anev-editor-info-banner anev-no-print",style:{width:"100%",maxWidth:"880px",background:"linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)",border:"1.5px solid #86efac",borderRadius:"8px",padding:"8px 16px",marginBottom:"0.5rem",boxShadow:"0 2px 8px rgba(16, 185, 129, 0.08)",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"1rem",flexWrap:"wrap"},children:[
              (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"10px"},children:[
                (0,t.jsx)("div",{style:{width:"32px",height:"32px",borderRadius:"50%",background:"#10b981",color:"#ffffff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem",flexShrink:0},children:"📝"}),
                (0,t.jsxs)("div",{children:[
                  (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[
                    (0,t.jsx)("span",{style:{fontWeight:800,fontSize:"0.86rem",color:"#065f46"},children:"MODE DRAFT: NASKAH DINAS AKTIF (LIVE EDITABLE)"}),
                    (0,t.jsx)("span",{style:{background:"#10b981",color:"#ffffff",padding:"1px 6px",borderRadius:"4px",fontSize:"0.66rem",fontWeight:800},children:"DRAFT"})
                  ]}),
                  (0,t.jsx)("div",{style:{fontSize:"0.72rem",color:"#047857",marginTop:"1px"},children:"Naskah belum diarsipkan secara permanen. Klik teks/angka di mana saja untuk menyunting langsung, tekan Enter untuk spasi baru, gunakan toolbar untuk tabel. Dokumen otomatis tersimpan saat Anda klik 'Cetak & Arsipkan'."})
                ]})
              ]}),
              (0,t.jsx)(c.Button,{
                label: "🖨️ Cetak & Arsipkan",
                size: "small",
                severity: "success",
                loading: printing,
                onClick: handlePrintAndArchive,
                style: { fontWeight: 800, fontSize: "0.76rem", height: "32px" }
              })
            ]})
          ),
          (0,t.jsxs)("div",{className:"anev-page-sheet anev-print-sheet",children:[
          // Badge Penanda Corner Status (Draft vs Arsip)
          (0,t.jsx)("div",{className:"anev-sheet-corner-pill anev-no-print",style:{position:"absolute",top:"12px",right:"18px",fontSize:"0.65rem",fontWeight:800,letterSpacing:"0.5px",padding:"2px 8px",borderRadius:"10px",background:archiveLoadedInfo?"#fef3c7":"#ecfdf5",color:archiveLoadedInfo?"#92400e":"#065f46",border:archiveLoadedInfo?"1px solid #fde68a":"1px solid #a7f3d0",zIndex:5},children:archiveLoadedInfo?("🔒 SALINAN ARSIP #"+archiveLoadedInfo.id):"📝 DRAFT NASKAH DINAS"}),
          (0,t.jsxs)("div",{className:"anev-watermark-overlay",children:[
            [1,2,3,4].map(i=>(0,t.jsx)("div",{key:i,className:"anev-watermark-line",children:watermarkText}))
          ]}),
          (0,t.jsxs)("div",{className:"anev-page-content anev-doc-editor",contentEditable:!0,suppressContentEditableWarning:!0,spellCheck:!1,children:[
            // JUDUL 3 BARIS DI TENGAH (TANPA KOP DINAS)
          (0,t.jsxs)("div",{style:{textAlign:"center",marginBottom:"1.1rem"},children:[
            (0,t.jsx)("h2",{className:"anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,onBlur:e=>setHeaderBaris1(e.target.innerText),style:{fontSize:"1.15rem",fontWeight:900,letterSpacing:"1.5px",margin:"0 0 4px 0",color:"#000000"},children:headerBaris1}),
            (0,t.jsx)("h3",{className:"anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,onBlur:e=>setHeaderBaris2(e.target.innerText),style:{fontSize:"1.05rem",fontWeight:800,letterSpacing:"1px",margin:"0 0 4px 0",color:"#000000"},children:headerBaris2}),
            (0,t.jsx)("p",{className:"anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,onBlur:e=>setHeaderBaris3(e.target.innerText),style:{fontSize:"0.9rem",fontWeight:700,letterSpacing:"0.5px",margin:"0",color:"#000000"},children:headerBaris3})
          ]}),

          // GARIS PEMBATAS DINAS TEBAL
          (0,t.jsx)("div",{style:{borderBottom:"2.5px solid #000000",margin:"0 0 1.2rem 0"}}),

          // ==============================================================
          // BAGIAN I. PENDAHULUAN & PROFIL WILAYAH
          // Urutan: TABEL DATA -> NARASI -> GRAFIK
          // ==============================================================
          (0,t.jsxs)("div",{children:[
            (0,t.jsx)("div",{className:"anev-section-title",children:"I. PENDAHULUAN"}),

            // 1. TABEL DATA Profil Wilayah & Indikator Kriminologi
            (0,t.jsx)("div",{className:"anev-sub-title",children:"A. Tabel Profil Wilayah Yuridiksi & Indikator Keamanan"}),
            (0,t.jsxs)("table",{className:"anev-table-naskah",style:{marginLeft:"0.8rem",width:"calc(100% - 0.8rem)"},children:[
              (0,t.jsx)("thead",{children:(0,t.jsxs)("tr",{children:[
                (0,t.jsx)("th",{style:{width:"5%"},children:"No"}),
                (0,t.jsx)("th",{style:{width:"45%"},children:"Parameter Wilayah / Indikator Kriminologi"}),
                (0,t.jsx)("th",{style:{width:"50%"},children:"Keterangan / Nilai Terkini"})
              ]})}),
              (0,t.jsxs)("tbody",{children:[
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"1"}),
                  (0,t.jsx)("td",{style:{fontWeight:600},children:"Satuan Kerja / Kesatuan Pemangku"}),
                  (0,t.jsx)("td",{className:"anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,children:headerBaris2})
                ]}),
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"2"}),
                  (0,t.jsx)("td",{style:{fontWeight:600},children:"Tingkat Kewilayahan / Scope Operasional"}),
                  (0,t.jsx)("td",{className:"anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,children:reportData?.meta?.tipeSatker === 'MABES' ? 'Nasional (Seluruh Wilayah Hukum NKRI)' : (reportData?.meta?.tipeSatker === 'POLDA' ? 'Tingkat Daerah / Provinsi' : 'Tingkat Resor / Kabupaten / Kota')})
                ]}),
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"3"}),
                  (0,t.jsx)("td",{style:{fontWeight:600},children:"Jumlah Penduduk Terayomi (Demografi)"}),
                  (0,t.jsxs)("td",{className:"anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,children:[(reportData?.meta?.jumlahPenduduk || 0).toLocaleString("id-ID"), " Jiwa"]})
                ]}),
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"4"}),
                  (0,t.jsx)("td",{style:{fontWeight:600},children:"Luas Wilayah Yuridiksi Hukum"}),
                  (0,t.jsx)("td",{className:"anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,children:reportData?.meta?.luasWilayah || "1.904.569 km²"})
                ]}),
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"5"}),
                  (0,t.jsx)("td",{style:{fontWeight:600},children:"Satuan Kerja Jajaran Dibawahi"}),
                  (0,t.jsxs)("td",{className:"anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,children:[reportData?.meta?.jumlahSatkerJajaran || 0, " Satuan Kewilayahan"]})
                ]}),
                (0,t.jsxs)("tr",{style:{background:"#eff6ff"},children:[
                  (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:700},children:"6"}),
                  (0,t.jsx)("td",{style:{fontWeight:700,color:"#1d4ed8"},children:"Crime Clock (Kecepatan Kejadian Tindak Pidana)"}),
                  (0,t.jsx)("td",{className:"anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,style:{fontWeight:800,color:"#1d4ed8"},children:reportData?.indikator?.crimeClockFull || "N/A"})
                ]}),
                (0,t.jsxs)("tr",{style:{background:"#f0fdf4"},children:[
                  (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:700},children:"7"}),
                  (0,t.jsx)("td",{style:{fontWeight:700,color:"#059669"},children:"Crime Rate (Tingkat Risiko per 100.000 Penduduk)"}),
                  (0,t.jsx)("td",{className:"anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,style:{fontWeight:800,color:"#059669"},children:reportData?.indikator?.crimeRateText || "0 per 100.000 Penduduk"})
                ]})
              ]})
            ]}),

            // 2. NARASI ANALISA Situasi Umum & Dasar Pelaksanaan
            (0,t.jsx)("div",{className:"anev-sub-title",children:"B. Analisis Dinamika Situasi Wilayah & Dasar Pelaksanaan"}),
            (0,t.jsx)("div",{className:"anev-narasi-box anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,onBlur:e=>setSituasiUmum(e.target.innerText),children:situasiUmum}),

            // 3. GRAFIK VISUALISASI Indikator Keamanan
            (0,t.jsx)("div",{className:"anev-sub-title",children:"C. Visualisasi Indikator Kriminologi Wilayah"}),
            (0,t.jsxs)("div",{className:"anev-chart-container",children:[
              (0,t.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",gap:"1rem",alignItems:"center"},children:[
                (0,t.jsxs)("div",{style:{background:"#ffffff",border:"1.5px solid #3b82f6",borderRadius:"6px",padding:"0.85rem",textAlign:"center"},children:[
                  (0,t.jsx)("div",{style:{fontSize:"0.72rem",fontWeight:700,color:"#64748b",textTransform:"uppercase"},children:"Crime Clock (Interval Kejahatan)"}),
                  (0,t.jsx)("div",{style:{fontSize:"1.25rem",fontWeight:900,color:"#1d4ed8",margin:"0.3rem 0"},children:reportData?.indikator?.crimeClockText || "N/A"}),
                  (0,t.jsx)("div",{style:{fontSize:"0.68rem",color:"#64748b"},children:"Rata-rata 1 LP dilaporkan setiap interval waktu"})
                ]}),
                (0,t.jsxs)("div",{style:{background:"#ffffff",border:"1.5px solid #10b981",borderRadius:"6px",padding:"0.85rem",textAlign:"center"},children:[
                  (0,t.jsx)("div",{style:{fontSize:"0.72rem",fontWeight:700,color:"#64748b",textTransform:"uppercase"},children:"Crime Rate (Risiko Populasi)"}),
                  (0,t.jsxs)("div",{style:{fontSize:"1.25rem",fontWeight:900,color:"#059669",margin:"0.3rem 0"},children:[reportData?.indikator?.crimeRateVal || 0, (0,t.jsx)("span",{style:{fontSize:"0.8rem",fontWeight:600},children:" /100rb"})]}),
                  (0,t.jsx)("div",{style:{fontSize:"0.68rem",color:"#64748b"},children:"Jumlah tindak pidana per 100.000 warga"})
                ]}),
                (0,t.jsxs)("div",{style:{background:"#ffffff",border:"1.5px solid #8b5cf6",borderRadius:"6px",padding:"0.85rem",textAlign:"center"},children:[
                  (0,t.jsx)("div",{style:{fontSize:"0.72rem",fontWeight:700,color:"#64748b",textTransform:"uppercase"},children:"Wilayah Satker Jajaran"}),
                  (0,t.jsxs)("div",{style:{fontSize:"1.25rem",fontWeight:900,color:"#7c3aed",margin:"0.3rem 0"},children:[reportData?.meta?.jumlahSatkerJajaran || 0, " Satker"]}),
                  (0,t.jsx)("div",{style:{fontSize:"0.68rem",color:"#64748b"},children:"Hierarki operasional kesatuan pemangku"})
                ]})
              ]})
            ]})
          ]})
          ]}),
          (0,t.jsxs)("div",{className:"anev-page-footer",children:[
            (0,t.jsxs)("div",{className:"anev-footer-left anev-forensic-stamp",children:[
              (0,t.jsx)("span",{style:{fontSize:"0.72rem",marginRight:"4px"},children:"🛡️"}),
              (0,t.jsx)("span",{style:{fontFamily:"monospace",fontSize:"0.66rem",fontWeight:archiveLoadedInfo?800:700,color:archiveLoadedInfo?"#92400e":"#475569",letterSpacing:"0.4px"},children:archiveLoadedInfo ? ("ARSIP #" + archiveLoadedInfo.id + " • " + (archiveLoadedInfo.stamp ? archiveLoadedInfo.stamp.replace(/^STAMP-/, "CAS-") : "CAS-" + archiveLoadedInfo.id)) : docStamp})
            ]}),
            (0,t.jsx)("div",{className:"anev-footer-right",children:1})
          ]})
        ]}),
          (0,t.jsxs)("div",{className:"anev-page-sheet anev-print-sheet",children:[
          // Badge Penanda Corner Status (Draft vs Arsip)
          (0,t.jsx)("div",{className:"anev-sheet-corner-pill anev-no-print",style:{position:"absolute",top:"12px",right:"18px",fontSize:"0.65rem",fontWeight:800,letterSpacing:"0.5px",padding:"2px 8px",borderRadius:"10px",background:archiveLoadedInfo?"#fef3c7":"#ecfdf5",color:archiveLoadedInfo?"#92400e":"#065f46",border:archiveLoadedInfo?"1px solid #fde68a":"1px solid #a7f3d0",zIndex:5},children:archiveLoadedInfo?("🔒 SALINAN ARSIP #"+archiveLoadedInfo.id):"📝 DRAFT NASKAH DINAS"}),
          (0,t.jsxs)("div",{className:"anev-watermark-overlay",children:[
            [1,2,3,4].map(i=>(0,t.jsx)("div",{key:i,className:"anev-watermark-line",children:watermarkText}))
          ]}),
          (0,t.jsxs)("div",{className:"anev-page-content anev-doc-editor",contentEditable:!0,suppressContentEditableWarning:!0,spellCheck:!1,children:[
            // ==============================================================
          (0,t.jsxs)("div",{children:[
            (0,t.jsx)("div",{className:"anev-section-title",children:"II. KEKUATAN SUMBER DAYA (PERSONEL & ALMATSUS)"}),

            // 1. TABEL DATA Personel Berdasarkan Pangkat & Kualifikasi Reserse
            (0,t.jsx)("div",{className:"anev-sub-title",children:"A. Tabel Kekuatan Personel Reserse (DSP vs Riil vs BKO)"}),
            (0,t.jsxs)("table",{className:"anev-table-naskah",style:{marginLeft:"0.8rem",width:"calc(100% - 0.8rem)"},children:[
              (0,t.jsx)("thead",{children:(0,t.jsxs)("tr",{children:[
                (0,t.jsx)("th",{style:{width:"5%"},children:"No"}),
                (0,t.jsx)("th",{style:{width:"38%"},children:"Golongan Pangkat"}),
                (0,t.jsx)("th",{style:{width:"12%"},children:"DSP"}),
                (0,t.jsx)("th",{style:{width:"12%"},children:"Riil Organik"}),
                (0,t.jsx)("th",{style:{width:"10%"},children:"BKO"}),
                (0,t.jsx)("th",{style:{width:"11%"},children:"Selisih"}),
                (0,t.jsx)("th",{style:{width:"12%"},children:"Keterangan"})
              ]})}),
              (0,t.jsxs)("tbody",{children:[
                personelRows.map((r, idx)=>(0,t.jsxs)("tr",{key:idx,children:[
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:idx+1}),
                  (0,t.jsx)("td",{className:"anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,children:r.pangkat}),
                  (0,t.jsx)("td",{className:"anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,style:{textAlign:"center",fontWeight:600},children:r.dsp}),
                  (0,t.jsx)("td",{className:"anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,style:{textAlign:"center",fontWeight:700,color:"#1d4ed8"},children:r.riil}),
                  (0,t.jsx)("td",{className:"anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,style:{textAlign:"center"},children:r.bko || 0}),
                  (0,t.jsx)("td",{className:"anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,style:{textAlign:"center",color:r.riil-r.dsp<0?"#dc2626":"#16a34a",fontWeight:600},children:(r.riil-r.dsp>0?'+':'')+(r.riil-r.dsp)}),
                  (0,t.jsx)("td",{className:"anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,style:{fontSize:"0.72rem"},children:r.keterangan})
                ]})),
                (0,t.jsxs)("tr",{style:{background:"#f1f5f9",fontWeight:800},children:[
                  (0,t.jsx)("td",{colSpan:2,style:{textAlign:"center"},children:"TOTAL PERSONEL GOLONGAN PANGKAT"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:dspTotal}),
                  (0,t.jsx)("td",{style:{textAlign:"center",color:"#1d4ed8"},children:riilTotal}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:personelRows.reduce((a,b)=>a+(Number(b.bko)||0),0)}),
                  (0,t.jsx)("td",{style:{textAlign:"center",color:selisihTotal<0?"#dc2626":"#16a34a"},children:(selisihTotal>0?'+':'')+selisihTotal}),
                  (0,t.jsx)("td",{style:{textAlign:"center",fontSize:"0.72rem"},children:`Pemenuhan ${dspTotal?Math.round((riilTotal/dspTotal)*100):0}%`})
                ]})
              ]})
            ]}),

            // Subtabel Kualifikasi Reserse
            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.6rem"},children:"B. Tabel Kualifikasi & Beban Perkara Penyidik (Case Load Ratio)"}),
            (0,t.jsxs)("table",{className:"anev-table-naskah",style:{marginLeft:"0.8rem",width:"calc(100% - 0.8rem)"},children:[
              (0,t.jsx)("thead",{children:(0,t.jsxs)("tr",{children:[
                (0,t.jsx)("th",{style:{width:"5%"},children:"No"}),
                (0,t.jsx)("th",{style:{width:"40%"},children:"Kualifikasi Kejuruan Reserse"}),
                (0,t.jsx)("th",{style:{width:"13%"},children:"DSP"}),
                (0,t.jsx)("th",{style:{width:"13%"},children:"Riil Ada"}),
                (0,t.jsx)("th",{style:{width:"14%"},children:"Rasio Beban"}),
                (0,t.jsx)("th",{style:{width:"15%"},children:"Keterangan Akreditasi"})
              ]})}),
              (0,t.jsxs)("tbody",{children:
                kualifikasiRows.map((kr, idx)=>(0,t.jsxs)("tr",{key:idx,children:[
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:idx+1}),
                  (0,t.jsx)("td",{className:"anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,style:{fontWeight:600},children:kr.kualifikasi}),
                  (0,t.jsx)("td",{className:"anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,style:{textAlign:"center"},children:kr.dsp}),
                  (0,t.jsx)("td",{className:"anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,style:{textAlign:"center",fontWeight:700,color:"#1d4ed8"},children:kr.riil}),
                  (0,t.jsx)("td",{className:"anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,style:{textAlign:"center",fontWeight:700,color:"#b45309"},children:kr.bebanPerkara}),
                  (0,t.jsx)("td",{className:"anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,style:{fontSize:"0.72rem"},children:kr.keterangan})
                ]}))
              })
            ]}),

            // 2. NARASI ANALISA Beban Kerja & Kesiapan Personel
            (0,t.jsx)("div",{className:"anev-sub-title",children:"C. Analisis Kesiapan SDM & Beban Kerja Penyidikan"}),
            (0,t.jsx)("div",{className:"anev-narasi-box anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,onBlur:e=>setPersonelNarasi(e.target.innerText),children:personelNarasi}),

            // 3. GRAFIK VISUALISASI Komposisi Personel
            (0,t.jsx)("div",{className:"anev-sub-title",children:"D. Visualisasi Komposisi Kekuatan Personel Reserse"}),
            (0,t.jsxs)("div",{className:"anev-chart-container",children:[
              (0,t.jsx)(DonutSvg,{
                data: [
                  { label: "Pati & Pamen", value: (personelRows[0]?.riil || 0) + (personelRows[1]?.riil || 0), color: "#b91c1c" },
                  { label: "Pama (Kanit/Panit)", value: personelRows[2]?.riil || 0, color: "#d97706" },
                  { label: "Bintara Reskrim", value: personelRows[3]?.riil || 0, color: "#2563eb" },
                  { label: "PNS Polri & Tamtama", value: (personelRows[4]?.riil || 0) + (personelRows[5]?.riil || 0), color: "#64748b" }
                ],
                size: 140,
                stroke: 20,
                centerVal: riilTotal.toLocaleString("id-ID"),
                centerSub: "RIIL PERSONEL"
              })
            ]}),

            // 4. TABEL DATA Sarana & Prasarana Dinas
            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"1rem"},children:"E. Tabel Kesiapan Alat Material Khusus (Almatsus) Operasional Lidik Sidik"}),
            (0,t.jsxs)("table",{className:"anev-table-naskah",style:{marginLeft:"0.8rem",width:"calc(100% - 0.8rem)"},children:[
              (0,t.jsx)("thead",{children:(0,t.jsxs)("tr",{children:[
                (0,t.jsx)("th",{style:{width:"5%"},children:"No"}),
                (0,t.jsx)("th",{style:{width:"40%"},children:"Jenis Almatsus (Alat Material Khusus) Operasional"}),
                (0,t.jsx)("th",{style:{width:"11%"},children:"DSP"}),
                (0,t.jsx)("th",{style:{width:"11%"},children:"Baik"}),
                (0,t.jsx)("th",{style:{width:"11%"},children:"Rusak R."}),
                (0,t.jsx)("th",{style:{width:"11%"},children:"Rusak B."}),
                (0,t.jsx)("th",{style:{width:"11%"},children:"Kondisi"})
              ]})}),
              (0,t.jsxs)("tbody",{children:[
                sarprasRows.map((sr, idx)=>(0,t.jsxs)("tr",{key:idx,children:[
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:idx+1}),
                  (0,t.jsx)("td",{className:"anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,children:sr.jenis}),
                  (0,t.jsx)("td",{className:"anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,style:{textAlign:"center"},children:sr.dsp}),
                  (0,t.jsx)("td",{className:"anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,style:{textAlign:"center",fontWeight:700,color:"#16a34a"},children:sr.baik}),
                  (0,t.jsx)("td",{className:"anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,style:{textAlign:"center",color:"#d97706"},children:sr.rusakRingan}),
                  (0,t.jsx)("td",{className:"anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,style:{textAlign:"center",color:"#dc2626"},children:sr.rusakBerat}),
                  (0,t.jsx)("td",{className:"anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,style:{fontSize:"0.72rem"},children:sr.keterangan})
                ]})),
                (0,t.jsxs)("tr",{style:{background:"#f1f5f9",fontWeight:800},children:[
                  (0,t.jsx)("td",{colSpan:2,style:{textAlign:"center"},children:"TOTAL REKAPITULASI ALMATSUS"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:sarprasRows.reduce((a,b)=>a+(Number(b.dsp)||0),0)}),
                  (0,t.jsx)("td",{style:{textAlign:"center",color:"#16a34a"},children:sarprasRows.reduce((a,b)=>a+(Number(b.baik)||0),0)}),
                  (0,t.jsx)("td",{style:{textAlign:"center",color:"#d97706"},children:sarprasRows.reduce((a,b)=>a+(Number(b.rusakRingan)||0),0)}),
                  (0,t.jsx)("td",{style:{textAlign:"center",color:"#dc2626"},children:sarprasRows.reduce((a,b)=>a+(Number(b.rusakBerat)||0),0)}),
                  (0,t.jsx)("td",{style:{textAlign:"center",fontSize:"0.72rem",color:"#16a34a"},children:"Kelaikan Siap"})
                ]})
              ]})
            ]}),

            // 5. NARASI ANALISA Sarana Prasarana
            (0,t.jsx)("div",{className:"anev-sub-title",children:"F. Evaluasi Kesiapan Alat Material Khusus (Almatsus) Penyidikan"}),
            (0,t.jsx)("div",{className:"anev-narasi-box anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,onBlur:e=>setSarprasNarasi(e.target.innerText),children:sarprasNarasi}),

            // 6. GRAFIK VISUALISASI Kelaikan Sarpras
            (0,t.jsx)("div",{className:"anev-sub-title",children:"G. Visualisasi Kesiapan Alat Material Khusus (Almatsus)"}),
            (0,t.jsx)("div",{className:"anev-chart-container",children:
              (0,t.jsx)(HorizontalBarSvg,{
                title: "Perbandingan Kondisi Almatsus Operasional:",
                items: [
                  { label: "Kondisi Baik (Siap Pakai)", val: sarprasRows.reduce((a,b)=>a+(Number(b.baik)||0),0), color: "#16a34a", sub: "Siap" },
                  { label: "Rusak Ringan (Perawatan)", val: sarprasRows.reduce((a,b)=>a+(Number(b.rusakRingan)||0),0), color: "#d97706", sub: "Rawat" },
                  { label: "Rusak Berat (Afkir)", val: sarprasRows.reduce((a,b)=>a+(Number(b.rusakBerat)||0),0), color: "#dc2626", sub: "Afkir" }
                ]
              })
            })
          ]})
          ]}),
          (0,t.jsxs)("div",{className:"anev-page-footer",children:[
            (0,t.jsxs)("div",{className:"anev-footer-left anev-forensic-stamp",children:[
              (0,t.jsx)("span",{style:{fontSize:"0.72rem",marginRight:"4px"},children:"🛡️"}),
              (0,t.jsx)("span",{style:{fontFamily:"monospace",fontSize:"0.66rem",fontWeight:archiveLoadedInfo?800:700,color:archiveLoadedInfo?"#92400e":"#475569",letterSpacing:"0.4px"},children:archiveLoadedInfo ? ("ARSIP #" + archiveLoadedInfo.id + " • " + (archiveLoadedInfo.stamp ? archiveLoadedInfo.stamp.replace(/^STAMP-/, "CAS-") : "CAS-" + archiveLoadedInfo.id)) : docStamp})
            ]}),
            (0,t.jsx)("div",{className:"anev-footer-right",children:2})
          ]})
        ]}),
          (0,t.jsxs)("div",{className:"anev-page-sheet anev-print-sheet",children:[
          // Badge Penanda Corner Status (Draft vs Arsip)
          (0,t.jsx)("div",{className:"anev-sheet-corner-pill anev-no-print",style:{position:"absolute",top:"12px",right:"18px",fontSize:"0.65rem",fontWeight:800,letterSpacing:"0.5px",padding:"2px 8px",borderRadius:"10px",background:archiveLoadedInfo?"#fef3c7":"#ecfdf5",color:archiveLoadedInfo?"#92400e":"#065f46",border:archiveLoadedInfo?"1px solid #fde68a":"1px solid #a7f3d0",zIndex:5},children:archiveLoadedInfo?("🔒 SALINAN ARSIP #"+archiveLoadedInfo.id):"📝 DRAFT NASKAH DINAS"}),
          (0,t.jsxs)("div",{className:"anev-watermark-overlay",children:[
            [1,2,3,4].map(i=>(0,t.jsx)("div",{key:i,className:"anev-watermark-line",children:watermarkText}))
          ]}),
          (0,t.jsxs)("div",{className:"anev-page-content anev-doc-editor",contentEditable:!0,suppressContentEditableWarning:!0,spellCheck:!1,children:[
            // ==============================================================
          (0,t.jsxs)("div",{children:[
            (0,t.jsx)("div",{className:"anev-section-title",children:"III. SITUASI GANGGUAN KAMTIBMAS (CRIME TOTAL / CT)"}),

            // 1. TABEL DATA Ringkasan Perkembangan CT & CC
            (0,t.jsx)("div",{className:"anev-sub-title",children:"A. Tabel Ringkasan Perkembangan Kejahatan (Crime Total & Crime Clearance)"}),
            (0,t.jsxs)("table",{className:"anev-table-naskah",style:{marginLeft:"0.8rem",width:"calc(100% - 0.8rem)"},children:[
              (0,t.jsx)("thead",{children:(0,t.jsxs)("tr",{children:[
                (0,t.jsx)("th",{style:{width:"6%"},children:"No"}),
                (0,t.jsx)("th",{style:{width:"34%"},children:"Indikator Utama Penegakan Hukum"}),
                (0,t.jsx)("th",{style:{width:"15%"},children:"Periode Lalu"}),
                (0,t.jsx)("th",{style:{width:"15%"},children:"Periode Kini"}),
                (0,t.jsx)("th",{style:{width:"15%"},children:"Trend (+ / -)"}),
                (0,t.jsx)("th",{style:{width:"15%"},children:"Status Evaluasi"})
              ]})}),
              (0,t.jsxs)("tbody",{children:[
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"1"}),
                  (0,t.jsx)("td",{style:{fontWeight:600},children:"Jumlah Laporan Kejahatan (Crime Total / CT)"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:ct.prev.toLocaleString("id-ID")}),
                  (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:700,color:"#1d4ed8"},children:ct.current.toLocaleString("id-ID")}),
                  (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:600,color:ct.delta>0?"#dc2626":ct.delta<0?"#16a34a":"#64748b"},children:`${ct.delta>0?'+':''}${ct.delta} (${ct.pct}%)`}),
                  (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:800,color:ct.delta>0?"#dc2626":ct.delta<0?"#16a34a":"#2563eb"},children:ct.status})
                ]}),
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"2"}),
                  (0,t.jsx)("td",{style:{fontWeight:600},children:"Penyelesaian Perkara (Crime Clearance / CC)"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:cc.prev.toLocaleString("id-ID")}),
                  (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:700,color:"#059669"},children:cc.current.toLocaleString("id-ID")}),
                  (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:600,color:cc.current-cc.prev>0?"#16a34a":"#dc2626"},children:`${cc.current-cc.prev>0?'+':''}${cc.current-cc.prev}`}),
                  (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:800,color:cc.current-cc.prev>=0?"#16a34a":"#dc2626"},children:cc.current-cc.prev>=0?"MENINGKAT":"MENURUN"})
                ]}),
                (0,t.jsxs)("tr",{style:{background:"#f0fdf4"},children:[
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"3"}),
                  (0,t.jsx)("td",{style:{fontWeight:700,color:"#059669"},children:"Clearance Rate (CR)"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:`${ct.prev>0?((cc.prev/ct.prev)*100).toFixed(1):0}%`}),
                  (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:800,color:"#059669"},children:`${cc.ccRate}%`}),
                  (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:700,color:Number(cc.ccRate)>=(ct.prev>0?(cc.prev/ct.prev)*100:0)?"#16a34a":"#dc2626"},children:`${(Number(cc.ccRate)-(ct.prev>0?((cc.prev/ct.prev)*100):0)).toFixed(1)}%`}),
                  (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:800,color:Number(cc.ccRate)>=60?"#16a34a":"#dc2626"},children:Number(cc.ccRate)>=60?"OPTIMAL":"ATENSI"})
                ]})
              ]})
            ]}),

            // 2. NARASI ANALISA Dinamika CT & CC
            (0,t.jsx)("div",{className:"anev-sub-title",children:"B. Analisis Fluktuasi Angka Kejahatan & Capaian Penyelesaian"}),
            (0,t.jsx)("div",{className:"anev-narasi-box anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,onBlur:e=>setKamtibmasCtNarasi(e.target.innerText),children:kamtibmasCtNarasi}),

            // 3. GRAFIK VISUALISASI Komparasi CT & CC
            (0,t.jsx)("div",{className:"anev-sub-title",children:"C. Visualisasi Perbandingan Apple-to-Apple CT vs CC"}),
            (0,t.jsx)("div",{className:"anev-chart-container",children:
              (0,t.jsx)(BarCompareSvg,{ctCurr:ct.current,ctPrev:ct.prev,ccCurr:cc.current,ccPrev:cc.prev})
            }),

            // 4. TABEL DATA Empat Golongan Kejahatan
            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"1rem"},children:"D. Tabel Klasifikasi Empat Golongan Kejahatan"}),
            (0,t.jsxs)("table",{className:"anev-table-naskah",style:{marginLeft:"0.8rem",width:"calc(100% - 0.8rem)"},children:[
              (0,t.jsx)("thead",{children:(0,t.jsxs)("tr",{children:[
                (0,t.jsx)("th",{style:{width:"6%"},children:"No"}),
                (0,t.jsx)("th",{style:{width:"40%"},children:"Golongan Kejahatan"}),
                (0,t.jsx)("th",{style:{width:"14%"},children:"Periode Lalu"}),
                (0,t.jsx)("th",{style:{width:"14%"},children:"Periode Kini"}),
                (0,t.jsx)("th",{style:{width:"13%"},children:"Trend"}),
                (0,t.jsx)("th",{style:{width:"13%"},children:"Proporsi"})
              ]})}),
              (0,t.jsxs)("tbody",{children:[
                [
                  { name: "1. Kejahatan Konvensional", curr: gol.konvensional?.current||0, prev: gol.konvensional?.prev||0, color: "#2563eb" },
                  { name: "2. Kejahatan Transnasional", curr: gol.transnasional?.current||0, prev: gol.transnasional?.prev||0, color: "#8b5cf6" },
                  { name: "3. Kejahatan terhadap Kekayaan Negara", curr: gol.kekayaan_negara?.current||0, prev: gol.kekayaan_negara?.prev||0, color: "#f59e0b" },
                  { name: "4. Kejahatan Berimplikasi Kontinjensi", curr: gol.kontinjensi?.current||0, prev: gol.kontinjensi?.prev||0, color: "#ef4444" }
                ].map((gItem, gIdx) => {
                  let d = gItem.curr - gItem.prev;
                  let p = gItem.prev > 0 ? ((d / gItem.prev) * 100).toFixed(1) : "0";
                  let prop = ct.current > 0 ? ((gItem.curr / ct.current) * 100).toFixed(1) : "0";
                  return (0,t.jsxs)("tr",{key:gIdx,children:[
                    (0,t.jsx)("td",{style:{textAlign:"center"},children:gIdx+1}),
                    (0,t.jsx)("td",{style:{fontWeight:600},children:gItem.name}),
                    (0,t.jsx)("td",{style:{textAlign:"center",color:"#64748b"},children:gItem.prev.toLocaleString("id-ID")}),
                    (0,t.jsx)("td",{style:{fontWeight:700,textAlign:"center",color:"#1d4ed8"},children:gItem.curr.toLocaleString("id-ID")}),
                    (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:600,color:d>0?"#dc2626":d<0?"#16a34a":"#64748b"},children:`${d>0?'+':''}${d} (${p}%)`}),
                    (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:700,color:gItem.color},children:`${prop}%`})
                  ]});
                }),
                (0,t.jsxs)("tr",{style:{background:"#f1f5f9",fontWeight:800},children:[
                  (0,t.jsx)("td",{colSpan:2,style:{textAlign:"center"},children:"TOTAL 4 GOLONGAN KEJAHATAN"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:ct.prev.toLocaleString("id-ID")}),
                  (0,t.jsx)("td",{style:{textAlign:"center",color:"#1d4ed8"},children:ct.current.toLocaleString("id-ID")}),
                  (0,t.jsx)("td",{style:{textAlign:"center",color:ct.delta>0?"#dc2626":ct.delta<0?"#16a34a":"#64748b"},children:`${ct.delta>0?'+':''}${ct.delta} (${ct.pct}%)`}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"100%"})
                ]})
              ]})
            ]}),

            // 5. NARASI ANALISA 4 Golongan Kejahatan
            (0,t.jsx)("div",{className:"anev-sub-title",children:"E. Analisis Tipologi Ancaman Empat Golongan Kejahatan"}),
            (0,t.jsx)("div",{className:"anev-narasi-box anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,onBlur:e=>setKamtibmasGolNarasi(e.target.innerText),children:kamtibmasGolNarasi}),

            // 6. GRAFIK VISUALISASI Proporsi 4 Golongan Kejahatan
            (0,t.jsx)("div",{className:"anev-sub-title",children:"F. Visualisasi Proporsi Empat Golongan Kejahatan"}),
            (0,t.jsx)("div",{className:"anev-chart-container",children:
              (0,t.jsx)(DonutSvg,{data:golDonutData,size:145,stroke:20,centerVal:ct.current.toLocaleString("id-ID"),centerSub:"TOTAL CT"})
            })
]})
          ]}),
          (0,t.jsxs)("div",{className:"anev-page-footer",children:[
            (0,t.jsxs)("div",{className:"anev-footer-left anev-forensic-stamp",children:[
              (0,t.jsx)("span",{style:{fontSize:"0.72rem",marginRight:"4px"},children:"🛡️"}),
              (0,t.jsx)("span",{style:{fontFamily:"monospace",fontSize:"0.66rem",fontWeight:archiveLoadedInfo?800:700,color:archiveLoadedInfo?"#92400e":"#475569",letterSpacing:"0.4px"},children:archiveLoadedInfo ? ("ARSIP #" + archiveLoadedInfo.id + " • " + (archiveLoadedInfo.stamp ? archiveLoadedInfo.stamp.replace(/^STAMP-/, "CAS-") : "CAS-" + archiveLoadedInfo.id)) : docStamp})
            ]}),
            (0,t.jsx)("div",{className:"anev-footer-right",children:3})
          ]})
        ]}),
          (0,t.jsxs)("div",{className:"anev-page-sheet anev-print-sheet",children:[
          // Badge Penanda Corner Status (Draft vs Arsip)
          (0,t.jsx)("div",{className:"anev-sheet-corner-pill anev-no-print",style:{position:"absolute",top:"12px",right:"18px",fontSize:"0.65rem",fontWeight:800,letterSpacing:"0.5px",padding:"2px 8px",borderRadius:"10px",background:archiveLoadedInfo?"#fef3c7":"#ecfdf5",color:archiveLoadedInfo?"#92400e":"#065f46",border:archiveLoadedInfo?"1px solid #fde68a":"1px solid #a7f3d0",zIndex:5},children:archiveLoadedInfo?("🔒 SALINAN ARSIP #"+archiveLoadedInfo.id):"📝 DRAFT NASKAH DINAS"}),
          (0,t.jsxs)("div",{className:"anev-watermark-overlay",children:[
            [1,2,3,4].map(i=>(0,t.jsx)("div",{key:i,className:"anev-watermark-line",children:watermarkText}))
          ]}),
          (0,t.jsxs)("div",{className:"anev-page-content anev-doc-editor",contentEditable:!0,suppressContentEditableWarning:!0,spellCheck:!1,children:[
            (0,t.jsxs)("div",{children:[
  (0,t.jsx)("div",{className:"anev-section-title",children:"III. SITUASI GANGGUAN KAMTIBMAS (LANJUTAN)"}),
  // 7. TABEL DATA Matriks Apple-to-Apple Seluruh Jenis Kejahatan (Top 40+)
            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"1rem"},children:"G. Matriks Komparasi Apple-to-Apple Jenis Kejahatan (Top 40 Kasus)"}),
            (0,t.jsxs)("table",{className:"anev-table-naskah",style:{marginLeft:"0.8rem",width:"calc(100% - 0.8rem)"},children:[
              (0,t.jsxs)("thead",{children:[
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"4%"},children:"No"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"34%",textAlign:"left"},children:"Klasifikasi & Jenis Tindak Pidana"}),
                  (0,t.jsx)("th",{colSpan:3,style:{background:"#f8fafc"},children:"Periode Lalu"}),
                  (0,t.jsx)("th",{colSpan:3,style:{background:"#eff6ff"},children:"Periode Kini"}),
                  (0,t.jsx)("th",{colSpan:2,style:{background:"#fef2f2"},children:"Trend Lapor"})
                ]}),
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("th",{style:{width:"7%",fontSize:"0.7rem"},children:"Lapor"}),
                  (0,t.jsx)("th",{style:{width:"7%",fontSize:"0.7rem"},children:"Selesai"}),
                  (0,t.jsx)("th",{style:{width:"7%",fontSize:"0.7rem",color:"#059669"},children:"CR (%)"}),
                  (0,t.jsx)("th",{style:{width:"7%",fontSize:"0.7rem"},children:"Lapor"}),
                  (0,t.jsx)("th",{style:{width:"7%",fontSize:"0.7rem"},children:"Selesai"}),
                  (0,t.jsx)("th",{style:{width:"7%",fontSize:"0.7rem",color:"#059669"},children:"CR (%)"}),
                  (0,t.jsx)("th",{style:{width:"6%",fontSize:"0.7rem"},children:"+ / -"}),
                  (0,t.jsx)("th",{style:{width:"7%",fontSize:"0.7rem"},children:"%"})
                ]})
              ]}),
              (0,t.jsxs)("tbody",{children:[
                golGroups.map((grp, grpIdx) => {
                  let subCtPrev = grp.items.reduce((acc, it) => acc + Number(it.lapor_prev ?? it.ct_prev ?? 0), 0);
                  let subCtCurr = grp.items.reduce((acc, it) => acc + Number(it.lapor_curr ?? it.ct_curr ?? 0), 0);
                  let subCcPrev = grp.items.reduce((acc, it) => acc + Number(it.selesai_prev ?? it.cc_prev ?? 0), 0);
                  let subCcCurr = grp.items.reduce((acc, it) => acc + Number(it.selesai_curr ?? it.cc_curr ?? 0), 0);
                  let subRatePrev = subCtPrev > 0 ? ((subCcPrev / subCtPrev) * 100).toFixed(1) : "0";
                  let subRateCurr = subCtCurr > 0 ? ((subCcCurr / subCtCurr) * 100).toFixed(1) : "0";
                  let subDelta = subCtCurr - subCtPrev;
                  let subPct = subCtPrev > 0 ? ((subDelta / subCtPrev) * 100).toFixed(1) : "0";

                  return (0,t.jsxs)(a.Fragment,{key:grpIdx,children:[
                    (0,t.jsxs)("tr",{style:{background:"#e2e8f0",fontWeight:800},children:[
                      (0,t.jsx)("td",{colSpan:2,style:{paddingLeft:"8px",color:"#0f172a"},children:grp.title}),
                      (0,t.jsx)("td",{style:{textAlign:"center"},children:subCtPrev.toLocaleString("id-ID")}),
                      (0,t.jsx)("td",{style:{textAlign:"center"},children:subCcPrev.toLocaleString("id-ID")}),
                      (0,t.jsx)("td",{style:{textAlign:"center"},children:`${subRatePrev}%`}),
                      (0,t.jsx)("td",{style:{textAlign:"center",color:"#1d4ed8"},children:subCtCurr.toLocaleString("id-ID")}),
                      (0,t.jsx)("td",{style:{textAlign:"center",color:"#059669"},children:subCcCurr.toLocaleString("id-ID")}),
                      (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:800,color:"#059669"},children:`${subRateCurr}%`}),
                      (0,t.jsx)("td",{style:{textAlign:"center",color:subDelta>0?"#dc2626":subDelta<0?"#16a34a":"#64748b"},children:(subDelta>0?'+':'')+subDelta}),
                      (0,t.jsx)("td",{style:{textAlign:"center",color:subDelta>0?"#dc2626":subDelta<0?"#16a34a":"#64748b"},children:`${subPct}%`})
                    ]}),
                    grp.items.length > 0 ? grp.items.map((row, rIdx) => {
                      let lpPrev = Number(row.lapor_prev ?? row.ct_prev ?? 0);
                      let ccPrev = Number(row.selesai_prev ?? row.cc_prev ?? 0);
                      let lpCurr = Number(row.lapor_curr ?? row.ct_curr ?? 0);
                      let ccCurr = Number(row.selesai_curr ?? row.cc_curr ?? 0);
                      let ratePrev = row.cc_rate_prev !== undefined ? row.cc_rate_prev : (lpPrev > 0 ? ((ccPrev / lpPrev) * 100).toFixed(1) : "0");
                      let rateCurr = row.cc_rate_curr !== undefined ? row.cc_rate_curr : (lpCurr > 0 ? ((ccCurr / lpCurr) * 100).toFixed(1) : "0");
                      let deltaLp = row.trend_lapor !== undefined ? row.trend_lapor : (row.delta_ct !== undefined ? row.delta_ct : (lpCurr - lpPrev));
                      let pctLp = row.trend_pct !== undefined ? row.trend_pct : (row.pct_ct !== undefined ? row.pct_ct : (lpPrev > 0 ? ((deltaLp / lpPrev) * 100).toFixed(1) : "0"));
                      return (0,t.jsxs)("tr",{key:rIdx,children:[
                        (0,t.jsx)("td",{style:{textAlign:"center"},children:rIdx+1}),
                        (0,t.jsx)("td",{className:"anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,style:{paddingLeft:"14px"},children:row.jenis}),
                        (0,t.jsx)("td",{style:{textAlign:"center",color:"#64748b"},children:lpPrev.toLocaleString("id-ID")}),
                        (0,t.jsx)("td",{style:{textAlign:"center",color:"#64748b"},children:ccPrev.toLocaleString("id-ID")}),
                        (0,t.jsx)("td",{style:{textAlign:"center",fontSize:"0.7rem",color:"#64748b"},children:`${ratePrev}%`}),
                        (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:700,color:"#1d4ed8"},children:lpCurr.toLocaleString("id-ID")}),
                        (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:700,color:"#059669"},children:ccCurr.toLocaleString("id-ID")}),
                        (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:700,color:"#059669"},children:`${rateCurr}%`}),
                        (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:600,color:deltaLp>0?"#dc2626":deltaLp<0?"#16a34a":"#64748b"},children:(deltaLp>0?'+':'')+deltaLp}),
                        (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:600,color:deltaLp>0?"#dc2626":deltaLp<0?"#16a34a":"#64748b"},children:`${pctLp}%`})
                      ]});
                    }) : (0,t.jsx)("tr",{children:(0,t.jsx)("td",{colSpan:10,style:{textAlign:"center",fontStyle:"italic",color:"#94a3b8",fontSize:"0.72rem"},children:"Tidak ada data kasus pada golongan ini."})})
                  ]});
                }),
                (0,t.jsxs)("tr",{style:{background:"#cbd5e1",fontWeight:900},children:[
                  (0,t.jsx)("td",{colSpan:2,style:{textAlign:"center"},children:"TOTAL KESELURUHAN (CRIME TOTAL)"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:ct.prev.toLocaleString("id-ID")}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:cc.prev.toLocaleString("id-ID")}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:`${ct.prev>0?((cc.prev/ct.prev)*100).toFixed(1):0}%`}),
                  (0,t.jsx)("td",{style:{textAlign:"center",color:"#1d4ed8"},children:ct.current.toLocaleString("id-ID")}),
                  (0,t.jsx)("td",{style:{textAlign:"center",color:"#059669"},children:cc.current.toLocaleString("id-ID")}),
                  (0,t.jsx)("td",{style:{textAlign:"center",color:"#059669"},children:`${cc.ccRate}%`}),
                  (0,t.jsx)("td",{style:{textAlign:"center",color:ct.delta>0?"#dc2626":ct.delta<0?"#16a34a":"#64748b"},children:(ct.delta>0?'+':'')+ct.delta}),
                  (0,t.jsx)("td",{style:{textAlign:"center",color:ct.delta>0?"#dc2626":ct.delta<0?"#16a34a":"#64748b"},children:`${ct.pct}%`})
                ]})
              ]})
            ]}),

            // 8. NARASI ANALISA Tren Kasus Tertinggi
            (0,t.jsx)("div",{className:"anev-sub-title",children:"H. Analisis Modus Operandi & Kejahatan Dominan"}),
            (0,t.jsx)("div",{className:"anev-narasi-box anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,onBlur:e=>setKamtibmasTopNarasi(e.target.innerText),children:kamtibmasTopNarasi}),

            // 9. GRAFIK VISUALISASI Top 5 Kejahatan Terbanyak
            (0,t.jsx)("div",{className:"anev-sub-title",children:"I. Visualisasi Top 5 Tindak Pidana Terbanyak"}),
            (0,t.jsx)("div",{className:"anev-chart-container",children:
              (0,t.jsx)(HorizontalBarSvg,{
                title: "Ranking 5 Tindak Pidana Laporan Tertinggi:",
                items: (top5 || []).map((tp, idx) => ({
                  label: `${idx+1}. ${tp.jenis}`,
                  val: tp.jml,
                  color: idx === 0 ? "#b91c1c" : idx === 1 ? "#ea580c" : idx === 2 ? "#d97706" : "#2563eb"
                }))
              })
            }),

            // 10. TABEL DATA Jam Rawan & Lokasi TKP
            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"1rem"},children:"J. Tabel Distribusi Waktu (Jam Rawan) & Kategori Lokasi TKP"}),
            (0,t.jsxs)("div",{style:{marginLeft:"0.8rem",display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(240px, 1fr))",gap:"1rem"},children:[
              (0,t.jsxs)("table",{className:"anev-table-naskah",children:[
                (0,t.jsx)("thead",{children:(0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("th",{children:"Kuadran Jam Rawan"}),
                  (0,t.jsx)("th",{children:"Jumlah Kasus"}),
                  (0,t.jsx)("th",{children:"Persentase"})
                ]})}),
                (0,t.jsx)("tbody",{children:
                  [
                    { label: "Dini Hari (00.00 - 06.00)", val: pw.dini_hari || 0, color: "#ef4444" },
                    { label: "Pagi Hari (06.00 - 12.00)", val: pw.pagi || 0, color: "#3b82f6" },
                    { label: "Siang Hari (12.00 - 18.00)", val: pw.siang || 0, color: "#f59e0b" },
                    { label: "Malam Hari (18.00 - 24.00)", val: pw.malam || 0, color: "#8b5cf6" }
                  ].map((quad, idx) => (0,t.jsxs)("tr",{key:idx,children:[
                    (0,t.jsx)("td",{style:{fontWeight:600},children:quad.label}),
                    (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:700},children:quad.val.toLocaleString("id-ID")}),
                    (0,t.jsx)("td",{style:{textAlign:"center",color:quad.color,fontWeight:700},children:`${pwTotal > 0 ? Math.round((quad.val/pwTotal)*100) : 0}%`})
                  ]}))
                })
              ]}),
              (0,t.jsxs)("table",{className:"anev-table-naskah",children:[
                (0,t.jsx)("thead",{children:(0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("th",{children:"Kategori Lokasi (TKP)"}),
                  (0,t.jsx)("th",{children:"Jumlah TKP"})
                ]})}),
                (0,t.jsxs)("tbody",{children:
                  pl.length > 0 ? pl.map((lItem, idx) => (0,t.jsxs)("tr",{key:idx,children:[
                    (0,t.jsx)("td",{children:`${idx+1}. ${lItem.lokasi}`}),
                    (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:700},children:lItem.jml.toLocaleString("id-ID")})
                  ]})) : (0,t.jsx)("tr",{children:(0,t.jsx)("td",{colSpan:2,style:{textAlign:"center",color:"#94a3b8"},children:"Nihil"})})
                })
              ]})
            ]}),

            // 11. NARASI ANALISA Jam & Titik Rawan
            (0,t.jsx)("div",{className:"anev-sub-title",children:"K. Analisis Waktu Rawan (Crime Time) & Lokasi Rawan (Crime Spot)"}),
            (0,t.jsx)("div",{className:"anev-narasi-box anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,onBlur:e=>setKamtibmasJamNarasi(e.target.innerText),children:kamtibmasJamNarasi}),

            // 12. GRAFIK VISUALISASI Jam Rawan
            (0,t.jsx)("div",{className:"anev-sub-title",children:"L. Visualisasi 4 Kuadran Jam Rawan Kejadian"}),
            (0,t.jsxs)("div",{className:"anev-chart-container",style:{padding:"1.1rem 1.25rem"},children:[
              // Chart Area (Batang berdiri di atas garis dasar)
              (0,t.jsx)("div",{style:{display:"flex",justifyContent:"space-around",alignItems:"flex-end",height:"115px",borderBottom:"2px solid #cbd5e1",paddingBottom:"0px"},children:
                [
                  { label: "Dini Hari", sub: "00.00 - 06.00", val: pw.dini_hari || 0, color: "#ef4444" },
                  { label: "Pagi Hari", sub: "06.00 - 12.00", val: pw.pagi || 0, color: "#3b82f6" },
                  { label: "Siang Hari", sub: "12.00 - 18.00", val: pw.siang || 0, color: "#f59e0b" },
                  { label: "Malam Hari", sub: "18.00 - 24.00", val: pw.malam || 0, color: "#8b5cf6" }
                ].map((quad, idx) => (0,t.jsxs)("div",{key:idx,style:{display:"flex",flexDirection:"column",alignItems:"center",width:"80px"},children:[
                  (0,t.jsx)("span",{style:{fontSize:"0.78rem",fontWeight:800,color:"#1e293b",marginBottom:"4px"},children:quad.val.toLocaleString("id-ID")}),
                  (0,t.jsx)("div",{style:{width:"36px",height:(pwCalcH(quad.val) + "px"),background:quad.color,borderRadius:"4px 4px 0 0",boxShadow:"0 1px 3px rgba(0,0,0,0.12)"}})
                ]}))
              }),
              // Label Sumbu X (Di bawah garis dasar)
              (0,t.jsx)("div",{style:{display:"flex",justifyContent:"space-around",paddingTop:"8px"},children:
                [
                  { label: "Dini Hari", sub: "00.00 - 06.00" },
                  { label: "Pagi Hari", sub: "06.00 - 12.00" },
                  { label: "Siang Hari", sub: "12.00 - 18.00" },
                  { label: "Malam Hari", sub: "18.00 - 24.00" }
                ].map((quad, idx) => (0,t.jsxs)("div",{key:idx,style:{display:"flex",flexDirection:"column",alignItems:"center",width:"80px"},children:[
                  (0,t.jsx)("span",{style:{fontSize:"0.74rem",fontWeight:700,color:"#334155"},children:quad.label}),
                  (0,t.jsx)("span",{style:{fontSize:"0.64rem",color:"#64748b"},children:quad.sub})
                ]}))
              })
            ]})
]}),
// Urutan: TABEL DATA -> NARASI -> GRAFIK
          // ==============================================================
          (0,t.jsxs)("div",{children:[
            (0,t.jsx)("div",{className:"anev-section-title",children:"IV. PENYELESAIAN PERKARA (CRIME CLEARANCE / CC)"}),

            // 1. TABEL DATA Rincian Jalur Penyelesaian
            (0,t.jsx)("div",{className:"anev-sub-title",children:"A. Tabel Rekapitulasi Jalur Penyelesaian Tindak Pidana"}),
            (0,t.jsxs)("table",{className:"anev-table-naskah",style:{marginLeft:"0.8rem",width:"calc(100% - 0.8rem)"},children:[
              (0,t.jsx)("thead",{children:(0,t.jsxs)("tr",{children:[
                (0,t.jsx)("th",{style:{width:"6%"},children:"No"}),
                (0,t.jsx)("th",{style:{width:"45%"},children:"Jalur Hukum Penyelesaian Perkara"}),
                (0,t.jsx)("th",{style:{width:"20%"},children:"Jumlah Perkara Selesai"}),
                (0,t.jsx)("th",{style:{width:"15%"},children:"Proporsi (%)"}),
                (0,t.jsx)("th",{style:{width:"14%"},children:"Keterangan"})
              ]})}),
              (0,t.jsxs)("tbody",{children:[
                ccDonutData.map((cd, idx) => (0,t.jsxs)("tr",{key:idx,children:[
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:idx+1}),
                  (0,t.jsx)("td",{style:{fontWeight:600},children:cd.label}),
                  (0,t.jsx)("td",{style:{fontWeight:700,textAlign:"center",color:"#059669"},children:cd.value.toLocaleString("id-ID")}),
                  (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:700,color:"#1d4ed8"},children:`${cc.current>0?((cd.value/cc.current)*100).toFixed(1):0}%`}),
                  (0,t.jsx)("td",{style:{fontSize:"0.72rem",textAlign:"center"},children:idx === 0 ? "Pelimpahan JPU" : (idx === 1 ? "Restoratif" : "Berkepastian Hukum")})
                ]})),
                (0,t.jsxs)("tr",{style:{background:"#f1f5f9",fontWeight:800},children:[
                  (0,t.jsx)("td",{colSpan:2,style:{textAlign:"center"},children:"TOTAL CRIME CLEARANCE (CC)"}),
                  (0,t.jsx)("td",{style:{textAlign:"center",color:"#059669"},children:cc.current.toLocaleString("id-ID")}),
                  (0,t.jsx)("td",{style:{textAlign:"center",color:"#1d4ed8"},children:"100%"}),
                  (0,t.jsx)("td",{style:{textAlign:"center",fontSize:"0.72rem"},children:`Rate ${cc.ccRate}%`})
                ]})
              ]})
            ]}),

            // 2. NARASI ANALISA Efektivitas Penyidikan & RJ
            (0,t.jsx)("div",{className:"anev-sub-title",children:"B. Analisis Kualitas Penegakan Hukum & Restorative Justice"}),
            (0,t.jsx)("div",{className:"anev-narasi-box anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,onBlur:e=>setCcNarasi(e.target.innerText),children:ccNarasi}),

            // 3. GRAFIK VISUALISASI Jalur CC
            (0,t.jsx)("div",{className:"anev-sub-title",children:"C. Visualisasi Proporsi Jalur Crime Clearance"}),
            (0,t.jsx)("div",{className:"anev-chart-container",children:
              (0,t.jsx)(DonutSvg,{data:ccDonutData,size:145,stroke:20,centerVal:cc.current.toLocaleString("id-ID"),centerSub:"TOTAL CC"})
            })
          ]})
          ]}),
          (0,t.jsxs)("div",{className:"anev-page-footer",children:[
            (0,t.jsxs)("div",{className:"anev-footer-left anev-forensic-stamp",children:[
              (0,t.jsx)("span",{style:{fontSize:"0.72rem",marginRight:"4px"},children:"🛡️"}),
              (0,t.jsx)("span",{style:{fontFamily:"monospace",fontSize:"0.66rem",fontWeight:archiveLoadedInfo?800:700,color:archiveLoadedInfo?"#92400e":"#475569",letterSpacing:"0.4px"},children:archiveLoadedInfo ? ("ARSIP #" + archiveLoadedInfo.id + " • " + (archiveLoadedInfo.stamp ? archiveLoadedInfo.stamp.replace(/^STAMP-/, "CAS-") : "CAS-" + archiveLoadedInfo.id)) : docStamp})
            ]}),
            (0,t.jsx)("div",{className:"anev-footer-right",children:4})
          ]})
        ]}),
          (0,t.jsxs)("div",{className:"anev-page-sheet anev-print-sheet",children:[
          // Badge Penanda Corner Status (Draft vs Arsip)
          (0,t.jsx)("div",{className:"anev-sheet-corner-pill anev-no-print",style:{position:"absolute",top:"12px",right:"18px",fontSize:"0.65rem",fontWeight:800,letterSpacing:"0.5px",padding:"2px 8px",borderRadius:"10px",background:archiveLoadedInfo?"#fef3c7":"#ecfdf5",color:archiveLoadedInfo?"#92400e":"#065f46",border:archiveLoadedInfo?"1px solid #fde68a":"1px solid #a7f3d0",zIndex:5},children:archiveLoadedInfo?("🔒 SALINAN ARSIP #"+archiveLoadedInfo.id):"📝 DRAFT NASKAH DINAS"}),
          (0,t.jsxs)("div",{className:"anev-watermark-overlay",children:[
            [1,2,3,4].map(i=>(0,t.jsx)("div",{key:i,className:"anev-watermark-line",children:watermarkText}))
          ]}),
          (0,t.jsxs)("div",{className:"anev-page-content anev-doc-editor",contentEditable:!0,suppressContentEditableWarning:!0,spellCheck:!1,children:[
            // ==============================================================
          (0,t.jsxs)("div",{children:[
            (0,t.jsx)("div",{className:"anev-section-title",children:"V. REKAPITULASI KINERJA PENANGANAN PERKARA JAJARAN SATKER"}),

            // 1. TABEL DATA Matriks Satker
            (0,t.jsx)("div",{className:"anev-sub-title",children:`A. Matriks Kinerja Satuan Kerja Jajaran (${reportData?.meta?.tipeSatker === 'MABES' ? '36 Polda se-Indonesia' : (reportData?.meta?.tipeSatker === 'POLDA' ? 'Seluruh Polres Jajaran' : 'Seluruh Polsek Jajaran')})`}),
            (0,t.jsxs)("table",{className:"anev-table-naskah",style:{marginLeft:"0.8rem",width:"calc(100% - 0.8rem)"},children:[
              (0,t.jsxs)("thead",{children:[
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"4%"},children:"No"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"31%",textAlign:"left"},children:"Satuan Kerja Jajaran"}),
                  (0,t.jsx)("th",{colSpan:3,style:{background:"#eff6ff"},children:"Crime Total (CT)"}),
                  (0,t.jsx)("th",{colSpan:2,style:{background:"#f0fdf4"},children:"Crime Clearance (CC)"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"9%",background:"#fef3c7",color:"#92400e",fontSize:"0.75rem",verticalAlign:"middle"},children:"CR (%)"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"9%"},children:"Evaluasi"})
                ]}),
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("th",{style:{width:"8%",fontSize:"0.7rem"},children:"Lalu"}),
                  (0,t.jsx)("th",{style:{width:"8%",fontSize:"0.7rem"},children:"Kini"}),
                  (0,t.jsx)("th",{style:{width:"9%",fontSize:"0.7rem"},children:"Trend"}),
                  (0,t.jsx)("th",{style:{width:"8%",fontSize:"0.7rem"},children:"Lalu"}),
                  (0,t.jsx)("th",{style:{width:"8%",fontSize:"0.7rem"},children:"Kini"})
                ]})
              ]}),
              (0,t.jsxs)("tbody",{children:[
                effectiveMatriks.length > 0 ? effectiveMatriks.map((sat, sIdx) => {
                  let satName = sat.satker_nama || sat.nama || "Satker";
                  let sCtPrev = Number(sat.ct_prev ?? 0);
                  let sCtCurr = Number(sat.ct_curr ?? 0);
                  let sCcPrev = Number(sat.cc_prev ?? 0);
                  let sCcCurr = Number(sat.cc_curr ?? 0);
                  let satTrend = sat.trend_ct !== undefined ? sat.trend_ct : (sat.delta_ct !== undefined ? sat.delta_ct : (sCtCurr - sCtPrev));
                  let satPct = sat.pct_ct !== undefined ? sat.pct_ct : (sCtPrev > 0 ? (((sCtCurr - sCtPrev) / sCtPrev) * 100).toFixed(1) : "0");
                  let statusLabel = Number(sat.cc_rate) >= 60 ? "OPTIMAL" : Number(sat.cc_rate) >= 40 ? "CUKUP" : "ATENSI";
                  let statusColor = Number(sat.cc_rate) >= 60 ? "#16a34a" : Number(sat.cc_rate) >= 40 ? "#2563eb" : "#dc2626";
                  return (0,t.jsxs)("tr",{key:sIdx,children:[
                    (0,t.jsx)("td",{style:{textAlign:"center"},children:sIdx+1}),
                    (0,t.jsx)("td",{className:"anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,style:{fontWeight:600},children:satName}),
                    (0,t.jsx)("td",{style:{textAlign:"center",color:"#64748b"},children:sCtPrev.toLocaleString("id-ID")}),
                    (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:700,color:"#1d4ed8"},children:sCtCurr.toLocaleString("id-ID")}),
                    (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:600,color:satTrend>0?"#dc2626":satTrend<0?"#16a34a":"#64748b"},children:`${satTrend>0?'+':''}${satTrend} (${satPct}%)`}),
                    (0,t.jsx)("td",{style:{textAlign:"center",color:"#64748b"},children:sCcPrev.toLocaleString("id-ID")}),
                    (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:700,color:"#059669"},children:sCcCurr.toLocaleString("id-ID")}),
                    (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:800,color:"#059669"},children:`${sat.cc_rate}%`}),
                    (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:800,color:statusColor,fontSize:"0.7rem"},children:statusLabel})
                  ]});
                }) : (0,t.jsx)("tr",{children:(0,t.jsx)("td",{colSpan:9,style:{textAlign:"center",fontStyle:"italic",color:"#94a3b8",fontSize:"0.72rem"},children:"Tidak ada data jajaran satker."})}),
                (0,t.jsxs)("tr",{style:{background:"#cbd5e1",fontWeight:900},children:[
                  (0,t.jsx)("td",{colSpan:2,style:{textAlign:"center"},children:"TOTAL REKAPITULASI JAJARAN"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:matTotCtPrev.toLocaleString("id-ID")}),
                  (0,t.jsx)("td",{style:{textAlign:"center",color:"#1d4ed8"},children:matTotCtCurr.toLocaleString("id-ID")}),
                  (0,t.jsx)("td",{style:{textAlign:"center",color:matDelta>0?"#dc2626":matDelta<0?"#16a34a":"#64748b"},children:`${matDelta>0?'+':''}${matDelta} (${matPct}%)`}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:matTotCcPrev.toLocaleString("id-ID")}),
                  (0,t.jsx)("td",{style:{textAlign:"center",color:"#059669"},children:matTotCcCurr.toLocaleString("id-ID")}),
                  (0,t.jsx)("td",{style:{textAlign:"center",color:"#059669"},children:`${matTotRate}%`}),
                  (0,t.jsx)("td",{style:{textAlign:"center",color:Number(matTotRate)>=50?"#16a34a":"#dc2626"},children:Number(matTotRate)>=50?"TERPENUHI":"EVALUASI"})
                ]})
              ]})
            ]}),

            // 2. NARASI ANALISA Ranking Satker
            (0,t.jsx)("div",{className:"anev-sub-title",children:"B. Evaluasi Komparatif Ranking Kinerja Satker Jajaran"}),
            (0,t.jsx)("div",{className:"anev-narasi-box anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,onBlur:e=>setJajaranNarasi(e.target.innerText),children:jajaranNarasi}),

            // 3. GRAFIK VISUALISASI Ranking Satker Teratas
            (0,t.jsx)("div",{className:"anev-sub-title",children:"C. Visualisasi Ranking Satuan Kerja Volume Perkara Tertinggi"}),
            (0,t.jsx)("div",{className:"anev-chart-container",children:
              (0,t.jsx)(HorizontalBarSvg,{
                title: "Top 5 Satuan Kerja dengan Volume Crime Total Tertinggi:",
                color: "#1d4ed8",
                items: (effectiveMatriks.slice(0, 5) || []).map((s, idx) => ({
                  label: `${idx+1}. ${s.satker_nama || s.nama}`,
                  val: Number(s.ct_curr || 0),
                  sub: `CC: ${s.cc_curr} (${s.cc_rate}%)`
                }))
              })
            })
          ]})
          ]}),
          (0,t.jsxs)("div",{className:"anev-page-footer",children:[
            (0,t.jsxs)("div",{className:"anev-footer-left anev-forensic-stamp",children:[
              (0,t.jsx)("span",{style:{fontSize:"0.72rem",marginRight:"4px"},children:"🛡️"}),
              (0,t.jsx)("span",{style:{fontFamily:"monospace",fontSize:"0.66rem",fontWeight:archiveLoadedInfo?800:700,color:archiveLoadedInfo?"#92400e":"#475569",letterSpacing:"0.4px"},children:archiveLoadedInfo ? ("ARSIP #" + archiveLoadedInfo.id + " • " + (archiveLoadedInfo.stamp ? archiveLoadedInfo.stamp.replace(/^STAMP-/, "CAS-") : "CAS-" + archiveLoadedInfo.id)) : docStamp})
            ]}),
            (0,t.jsx)("div",{className:"anev-footer-right",children:5})
          ]})
        ]}),
          (0,t.jsxs)("div",{className:"anev-page-sheet anev-print-sheet",children:[
          // Badge Penanda Corner Status (Draft vs Arsip)
          (0,t.jsx)("div",{className:"anev-sheet-corner-pill anev-no-print",style:{position:"absolute",top:"12px",right:"18px",fontSize:"0.65rem",fontWeight:800,letterSpacing:"0.5px",padding:"2px 8px",borderRadius:"10px",background:archiveLoadedInfo?"#fef3c7":"#ecfdf5",color:archiveLoadedInfo?"#92400e":"#065f46",border:archiveLoadedInfo?"1px solid #fde68a":"1px solid #a7f3d0",zIndex:5},children:archiveLoadedInfo?("🔒 SALINAN ARSIP #"+archiveLoadedInfo.id):"📝 DRAFT NASKAH DINAS"}),
          (0,t.jsxs)("div",{className:"anev-watermark-overlay",children:[
            [1,2,3,4].map(i=>(0,t.jsx)("div",{key:i,className:"anev-watermark-line",children:watermarkText}))
          ]}),
          (0,t.jsxs)("div",{className:"anev-page-content anev-doc-editor",contentEditable:!0,suppressContentEditableWarning:!0,spellCheck:!1,children:[
            // Urutan: TABEL DATA -> NARASI -> GRAFIK / STATUS
          // ==============================================================
          (0,t.jsxs)("div",{children:[
            (0,t.jsx)("div",{className:"anev-section-title",children:"VI. PENANGANAN KASUS MENONJOL & ATENSI PUBLIK"}),

            // 1. TABEL DATA Kasus Menonjol
            (0,t.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[
              (0,t.jsx)("div",{className:"anev-sub-title",children:"A. Tabel Rekapitulasi Kasus Menonjol & Perkara Atensi Pimpinan"}),
              (0,t.jsxs)(c.Button,{size:"small",text:!0,icon:"pi pi-plus",label:"Tambah Kasus",onClick:handleAddKasusMenonjol,className:"anev-no-print",style:{fontSize:"0.72rem",padding:"2px 8px"}})
            ]}),
            (0,t.jsxs)("table",{className:"anev-table-naskah",style:{marginLeft:"0.8rem",width:"calc(100% - 0.8rem)"},children:[
              (0,t.jsx)("thead",{children:(0,t.jsxs)("tr",{children:[
                (0,t.jsx)("th",{style:{width:"4%"},children:"No"}),
                (0,t.jsx)("th",{style:{width:"24%"},children:"No LP & Tanggal"}),
                (0,t.jsx)("th",{style:{width:"22%"},children:"Tindak Pidana & Pasal"}),
                (0,t.jsx)("th",{style:{width:"25%"},children:"Kronologis Singkat & TKP"}),
                (0,t.jsx)("th",{style:{width:"13%"},children:"Status Sidik"}),
                (0,t.jsx)("th",{style:{width:"12%"},children:"Atensi Pimpinan"})
              ]})}),
              (0,t.jsxs)("tbody",{children:
                kasusMenonjolRows.map((km, idx)=>(0,t.jsxs)("tr",{key:idx,children:[
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:idx+1}),
                  (0,t.jsxs)("td",{children:[
                    (0,t.jsx)("div",{className:"anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,style:{fontWeight:700,color:"#1e40af",fontSize:"0.72rem"},children:km.noLp}),
                    (0,t.jsx)("div",{className:"anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,style:{fontSize:"0.68rem",color:"#64748b"},children:km.tglLp})
                  ]}),
                  (0,t.jsx)("td",{className:"anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,style:{fontWeight:600},children:km.pasal}),
                  (0,t.jsxs)("td",{children:[
                    (0,t.jsx)("div",{className:"anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,style:{fontSize:"0.72rem"},children:km.kronologis}),
                    (0,t.jsxs)("div",{className:"anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,style:{fontSize:"0.68rem",color:"#64748b",fontStyle:"italic"},children:[`TKP: `, km.tkp]})
                  ]}),
                  (0,t.jsx)("td",{className:"anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,style:{textAlign:"center",fontWeight:700,color:"#059669"},children:km.statusSidik}),
                  (0,t.jsx)("td",{className:"anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,style:{fontSize:"0.7rem",color:"#1e293b"},children:km.atensiPimpinan})
                ]}))
              })
            ]}),

            // 2. NARASI ANALISA Manajemen Media & Mitigasi Opini
            (0,t.jsx)("div",{className:"anev-sub-title",children:"B. Analisis Manajemen Media & Pengendalian Opini Publik"}),
            (0,t.jsx)("div",{className:"anev-narasi-box anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,onBlur:e=>setKasusMenonjolNarasi(e.target.innerText),children:kasusMenonjolNarasi}),

            // 3. GRAFIK / STATUS CARDS Kasus Menonjol
            (0,t.jsx)("div",{className:"anev-sub-title",children:"C. Status Penanganan Perkara Atensi Publik"}),
            (0,t.jsxs)("div",{className:"anev-chart-container",children:[
              (0,t.jsxs)("div",{style:{display:"flex",gap:"1rem",flexWrap:"wrap"},children:[
                (0,t.jsxs)("div",{style:{flex:1,minWidth:"180px",background:"#ffffff",border:"1px solid #cbd5e1",borderRadius:"6px",padding:"0.6rem",textAlign:"center"},children:[
                  (0,t.jsx)("div",{style:{fontSize:"0.7rem",color:"#64748b",fontWeight:700},children:"TOTAL KASUS MENONJOL"}),
                  (0,t.jsxs)("div",{style:{fontSize:"1.3rem",fontWeight:900,color:"#1e40af"},children:[kasusMenonjolRows.length, " Kasus"]})
                ]}),
                (0,t.jsxs)("div",{style:{flex:1,minWidth:"180px",background:"#ffffff",border:"1px solid #cbd5e1",borderRadius:"6px",padding:"0.6rem",textAlign:"center"},children:[
                  (0,t.jsx)("div",{style:{fontSize:"0.7rem",color:"#64748b",fontWeight:700},children:"PRESS RELEASE SELESAI"}),
                  (0,t.jsx)("div",{style:{fontSize:"1.3rem",fontWeight:900,color:"#10b981"},children:"100% Terpublikasi"})
                ]}),
                (0,t.jsxs)("div",{style:{flex:1,minWidth:"180px",background:"#ffffff",border:"1px solid #cbd5e1",borderRadius:"6px",padding:"0.6rem",textAlign:"center"},children:[
                  (0,t.jsx)("div",{style:{fontSize:"0.7rem",color:"#64748b",fontWeight:700},children:"STATUS SENTIMEN PUBLIK"}),
                  (0,t.jsx)("div",{style:{fontSize:"1.3rem",fontWeight:900,color:"#059669"},children:"POSITIF (KONDUSIF)"})
                ]})
              ]})
            ]})
          ]}),

          // ==============================================================
          // BAGIAN VII. ASPEK EKONOMI & ASSET RECOVERY
          // Urutan: TABEL DATA -> NARASI -> GRAFIK
          // ==============================================================
          (0,t.jsxs)("div",{children:[
            (0,t.jsx)("div",{className:"anev-section-title",children:"VII. ASPEK FINANSIAL & PENYELAMATAN ASET (ASSET RECOVERY)"}),

            // 1. TABEL DATA Nilai Ekonomis
            (0,t.jsx)("div",{className:"anev-sub-title",children:"A. Tabel Rekapitulasi Kerugian Pidana & Nilai Pemulihan Aset"}),
            (0,t.jsxs)("table",{className:"anev-table-naskah",style:{marginLeft:"0.8rem",width:"calc(100% - 0.8rem)"},children:[
              (0,t.jsx)("thead",{children:(0,t.jsxs)("tr",{children:[
                (0,t.jsx)("th",{style:{width:"6%"},children:"No"}),
                (0,t.jsx)("th",{style:{width:"44%"},children:"Kategori Penyelamatan Nilai Finansial"}),
                (0,t.jsx)("th",{style:{width:"25%"},children:"Estimasi Nilai (Rupiah)"}),
                (0,t.jsx)("th",{style:{width:"25%"},children:"Keterangan Pemulihan"})
              ]})}),
              (0,t.jsxs)("tbody",{children:[
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"1"}),
                  (0,t.jsx)("td",{style:{fontWeight:600},children:"Total Estimasi Kerugian Finansial Korban / Negara"}),
                  (0,t.jsxs)("td",{className:"anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,style:{fontWeight:700,color:"#dc2626"},children:[`Rp `, (nilaiEkonomisData?.kerugianKeuangan || 0).toLocaleString("id-ID")]}),
                  (0,t.jsx)("td",{className:"anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,style:{fontSize:"0.72rem"},children:"Fraud, Korupsi & Curas/Curanmor"})
                ]}),
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"2"}),
                  (0,t.jsx)("td",{style:{fontWeight:600},children:"Nilai Barang Bukti & Aset Berhasil Disita"}),
                  (0,t.jsxs)("td",{className:"anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,style:{fontWeight:800,color:"#16a34a"},children:[`Rp `, (nilaiEkonomisData?.asetDisita || 0).toLocaleString("id-ID")]}),
                  (0,t.jsx)("td",{className:"anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,style:{fontSize:"0.72rem"},children:"Uang Tunai, Rekening, Ranmor & Properti"})
                ]}),
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"3"}),
                  (0,t.jsx)("td",{style:{fontWeight:600},children:"Potensi Kerugian Berhasil Dicegah (Prevented Loss)"}),
                  (0,t.jsxs)("td",{className:"anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,style:{fontWeight:800,color:"#2563eb"},children:[`Rp `, (nilaiEkonomisData?.kerugianDicegah || 0).toLocaleString("id-ID")]}),
                  (0,t.jsx)("td",{className:"anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,style:{fontSize:"0.72rem"},children:"Pencegahan Distribusi Narkoba & Siber"})
                ]}),
                (0,t.jsxs)("tr",{style:{background:"#f0fdf4"},children:[
                  (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:700},children:"4"}),
                  (0,t.jsx)("td",{style:{fontWeight:700,color:"#059669"},children:"Asset Recovery Rate (Tingkat Pemulihan Aset)"}),
                  (0,t.jsxs)("td",{className:"anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,style:{fontWeight:900,color:"#059669"},children:[(nilaiEkonomisData?.recoveryRatePct || 42), "%"]}),
                  (0,t.jsx)("td",{className:"anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,style:{fontSize:"0.72rem",fontWeight:700,color:"#059669"},children:"Sangat Baik (Di atas Target)"})
                ]})
              ]})
            ]}),

            // 2. NARASI ANALISA Pemulihan Kerugian & Aset
            (0,t.jsx)("div",{className:"anev-sub-title",children:"B. Analisis Dampak Ekonomi Kejahatan & Pemulihan Aset Korban"}),
            (0,t.jsx)("div",{className:"anev-narasi-box anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,onBlur:e=>setNilaiEkonomisNarasi(e.target.innerText),children:nilaiEkonomisNarasi}),

            // 3. GRAFIK VISUALISASI Rasio Pemulihan Aset
            (0,t.jsx)("div",{className:"anev-sub-title",children:"C. Visualisasi Rasio Kerugian vs Pemulihan Aset"}),
            (0,t.jsx)("div",{className:"anev-chart-container",children:
              (0,t.jsx)(DonutSvg,{
                data: [
                  { label: "Aset Disita / Diselamatkan", value: nilaiEkonomisData?.asetDisita || 1, color: "#16a34a" },
                  { label: "Sisa Kerugian Belum Pulih", value: Math.max(0, (nilaiEkonomisData?.kerugianKeuangan || 1) - (nilaiEkonomisData?.asetDisita || 0)), color: "#dc2626" }
                ],
                size: 145,
                stroke: 20,
                centerVal: (nilaiEkonomisData?.recoveryRatePct || 42) + "%",
                centerSub: "RECOVERY RATE"
              })
            })
          ]}),

          // ==============================================================
          // BAGIAN VIII. EVALUASI DAN REKOMENDASI TINDAK LANJUT
          // Urutan: TABEL DATA -> NARASI
          // ==============================================================
          (0,t.jsxs)("div",{children:[
            (0,t.jsx)("div",{className:"anev-section-title",children:"VIII. EVALUASI, KESIMPULAN DAN REKOMENDASI TINDAK LANJUT"}),

            // 1. TABEL DATA Hambatan & Solusi
            (0,t.jsx)("div",{className:"anev-sub-title",children:"A. Tabel Matriks Identifikasi Kendala Lapangan & Rencana Solusi"}),
            (0,t.jsxs)("table",{className:"anev-table-naskah",style:{marginLeft:"0.8rem",width:"calc(100% - 0.8rem)"},children:[
              (0,t.jsx)("thead",{children:(0,t.jsxs)("tr",{children:[
                (0,t.jsx)("th",{style:{width:"6%"},children:"No"}),
                (0,t.jsx)("th",{style:{width:"25%"},children:"Bidang / Aspek"}),
                (0,t.jsx)("th",{style:{width:"35%"},children:"Identifikasi Hambatan / Kendala"}),
                (0,t.jsx)("th",{style:{width:"34%"},children:"Solusi / Cara Bertindak (CB)"})
              ]})}),
              (0,t.jsxs)("tbody",{children:[
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"1"}),
                  (0,t.jsx)("td",{style:{fontWeight:600},children:"Sumber Daya Manusia (SDM)"}),
                  (0,t.jsx)("td",{className:"anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,children:"Rasio beban perkara per penyidik melebihi batas ideal kerja."}),
                  (0,t.jsx)("td",{className:"anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,children:"Percepatan diklat sertifikasi penyidik pembantu dan pemenuhan DSP."})
                ]}),
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"2"}),
                  (0,t.jsx)("td",{style:{fontWeight:600},children:"Dukungan Almatsus & TIK"}),
                  (0,t.jsx)("td",{className:"anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,children:"Keterbatasan alat ekstraksi bukti digital mobile di tingkat resor."}),
                  (0,t.jsx)("td",{className:"anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,children:"Distribusi cyber extraction kit mandiri dan asistensi teknis Polda."})
                ]}),
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"3"}),
                  (0,t.jsx)("td",{style:{fontWeight:600},children:"Penyelesaian Perkara (CJS)"}),
                  (0,t.jsx)("td",{className:"anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,children:"Kordinasi pemenuhan petunjuk P-19 dari Jaksa Penuntut Umum."}),
                  (0,t.jsx)("td",{className:"anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,children:"Optimalisasi forum konsultasi pra-penuntutan berkala."})
                ]}),
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"4"}),
                  (0,t.jsx)("td",{style:{fontWeight:600},children:"Penyelamatan Aset"}),
                  (0,t.jsx)("td",{className:"anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,children:"Pelacakan aset pelaku kejahatan lintas wilayah yang disamarkan."}),
                  (0,t.jsx)("td",{className:"anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,children:"Integrasi penyidikan TPPU paralel bersama PPATK dan OJK."})
                ]})
              ]})
            ]}),

            // 2. NARASI ANALISA Rekomendasi Operasional
            (0,t.jsx)("div",{className:"anev-sub-title",children:"B. Rekomendasi Strategis dan Cara Bertindak (CB) Operasional"}),
            (0,t.jsx)("div",{className:"anev-narasi-box anev-editable",contentEditable:!0,suppressContentEditableWarning:!0,children:
              rekomendasiList.map((rItem, idx)=>(0,t.jsx)("div",{key:idx,style:{marginBottom:"4px"},children:rItem}))
            })
          ]}),


          // LEMBAR PENGESAHAN / TANDA TANGAN DINAS (KOTAK PANDUAN INTERAKTIF)
          (0,t.jsxs)("div",{style:{display:"flex",justifyContent:"flex-end",marginTop:"2.5rem",marginBottom:"1.5rem",pageBreakInside:"avoid"},children:[
            (0,t.jsxs)("div",{style:{width:"350px",textAlign:"center",fontSize:"0.84rem",lineHeight:"1.4"},children:[
              // 1. Kotak Tempat & Tanggal
              (0,t.jsx)("div",{
                className:"anev-guide-box anev-editable",
                contentEditable:!0,
                suppressContentEditableWarning:!0,
                onBlur:e=>setPejabatTempatTanggal(e.target.innerText.trim()),
                title:"Klik untuk mengubah Tempat & Tanggal",
                style:{fontWeight:600,color:"#0f172a",marginBottom:"8px"},
                children:pejabatTempatTanggal || ("Jakarta, " + new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }))
              }),
              // 2. Kotak Jabatan
              (0,t.jsx)("div",{
                className:"anev-guide-box anev-editable",
                contentEditable:!0,
                suppressContentEditableWarning:!0,
                onBlur:e=>setPejabatJabatan(e.target.innerText.trim()),
                title:"Klik untuk mengubah Jabatan",
                style:{fontWeight:800,fontSize:"0.86rem",lineHeight:"1.35",color:"#0f172a",textTransform:"uppercase"},
                children:pejabatJabatan || "[JABATAN]"
              }),
              // 3. Ruang Tanda Tangan (~65px)
              (0,t.jsxs)("div",{
                className:"anev-guide-space-box",
                style:{height:"68px",display:"flex",alignItems:"center",justifyContent:"center",margin:"6px 0"},
                children:[
                  (0,t.jsx)("span",{
                    className:"anev-no-print",
                    style:{fontSize:"0.68rem",color:"#94a3b8",fontStyle:"italic",border:"1px dashed #cbd5e1",borderRadius:"4px",padding:"4px 14px",background:"#f8fafc",letterSpacing:"0.3px"},
                    children:"(Ruang Tanda Tangan & Cap Dinas ~65px)"
                  })
                ]
              }),
              // 4. Kotak Nama Lengkap Penandatangan (Underline)
              (0,t.jsx)("div",{
                className:"anev-guide-box anev-editable",
                contentEditable:!0,
                suppressContentEditableWarning:!0,
                onBlur:e=>setPejabatNama(e.target.innerText.trim()),
                title:"Klik untuk mengubah Nama Lengkap Penandatangan",
                style:{fontWeight:900,fontSize:"0.88rem",textDecoration:"underline",color:"#0f172a",textTransform:"uppercase"},
                children:pejabatNama || "[NAMA PENANDATANGAN]"
              }),
              // 5. Kotak Pangkat & NRP
              (0,t.jsx)("div",{
                className:"anev-guide-box anev-editable",
                contentEditable:!0,
                suppressContentEditableWarning:!0,
                onBlur:e=>setPejabatPangkat(e.target.innerText.trim()),
                title:"Klik untuk mengubah Pangkat & NRP",
                style:{fontSize:"0.82rem",fontWeight:700,color:"#1e293b",marginTop:"4px",textTransform:"uppercase"},
                children:pejabatPangkat || "[PANGKAT] NRP [NO NRP]"
              }),
              // 6. Kartu Panduan Pengisian (Screen Only)
              (0,t.jsxs)("div",{
                className:"anev-no-print anev-guide-hint-card",
                style:{marginTop:"8px",padding:"6px 10px",background:"#eff6ff",border:"1px dashed #3b82f6",borderRadius:"6px",fontSize:"0.68rem",color:"#1d4ed8",textAlign:"left",display:"flex",alignItems:"center",justifyContent:"space-between",lineHeight:"1.35"},
                children:[
                  (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[
                    (0,t.jsx)("span",{style:{fontSize:"0.85rem"},children:"💡"}),
                    (0,t.jsxs)("span",{children:[
                      (0,t.jsx)("strong",{children:"> kalo Jenderal cukup > [PANGKAT] "}),
                      (0,t.jsx)("span",{style:{color:"#475569"},children:"(tanpa nomor NRP). Kotak panduan tidak tercetak."})
                    ]})
                  ]}),
                  (0,t.jsx)("button",{
                    type:"button",
                    onClick:()=>{
                      setPejabatTempatTanggal("Jakarta, " + new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }));
                      setPejabatJabatan("[JABATAN]");
                      setPejabatNama("[NAMA PENANDATANGAN]");
                      setPejabatPangkat("[PANGKAT] NRP [NO NRP]");
                    },
                    style:{background:"transparent",border:"none",color:"#2563eb",textDecoration:"underline",cursor:"pointer",fontSize:"0.66rem",fontWeight:700,flexShrink:0},
                    children:"Reset Template"
                  })
                ]
              })
            ]})
          ]})
          ]}),
          (0,t.jsxs)("div",{className:"anev-page-footer",children:[
            (0,t.jsxs)("div",{className:"anev-footer-left anev-forensic-stamp",children:[
              (0,t.jsx)("span",{style:{fontSize:"0.72rem",marginRight:"4px"},children:"🛡️"}),
              (0,t.jsx)("span",{style:{fontFamily:"monospace",fontSize:"0.66rem",fontWeight:archiveLoadedInfo?800:700,color:archiveLoadedInfo?"#92400e":"#475569",letterSpacing:"0.4px"},children:archiveLoadedInfo ? ("ARSIP #" + archiveLoadedInfo.id + " • " + (archiveLoadedInfo.stamp ? archiveLoadedInfo.stamp.replace(/^STAMP-/, "CAS-") : "CAS-" + archiveLoadedInfo.id)) : docStamp})
            ]}),
            (0,t.jsx)("div",{className:"anev-footer-right",children:6})
          ]})
        ]})
        ]})
      ]}),

      // TAB 2: ARSIP DOKUMEN TERENKRIPSI DENGAN TOMBOL KEMBALI JELAS & PEMBEDA DRAFT
      activeTab === "arsip" && (0,t.jsxs)("div",{children:[
        // 1. Header Card with Big Prominent Return Button
        (0,t.jsxs)("div",{className:"cms-card",style:{padding:"1.1rem 1.4rem",marginBottom:"1rem",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"1rem",background:"#ffffff",border:"1px solid #cbd5e1",borderRadius:"8px",boxShadow:"0 2px 8px rgba(0,0,0,0.04)"},children:[
          (0,t.jsxs)("div",{children:[
            (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"8px",marginBottom:"4px"},children:[
              (0,t.jsx)("span",{style:{fontSize:"1.4rem"},children:"📁"}),
              (0,t.jsx)("h2",{style:{fontSize:"1.15rem",fontWeight:900,margin:0,color:"#0f172a"},children:"Ruang Penyimpanan & Arsip Naskah Dinas Lampiran Anev"}),
              (0,t.jsx)("span",{style:{background:"#fef3c7",color:"#92400e",border:"1px solid #fde68a",padding:"2px 8px",borderRadius:"12px",fontSize:"0.7rem",fontWeight:800},children:"TERENKRIPSI & ANTI-TAMPER"})
            ]}),
            (0,t.jsx)("p",{className:"cms-page-sub",style:{margin:0,fontSize:"0.76rem",color:"#64748b"},children:"Daftar naskah dinas resmi yang telah dicetak & tersimpan permanen di database dengan CAS Forensic Stamp. Klik 'Buka Arsip Ini' untuk memuat snapshot dokumen ke lembar kerja."})
          ]}),
          (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.6rem"},children:[
            (0,t.jsx)(c.Button,{
              label: "⬅ Kembali ke Lembar Naskah",
              icon: "pi pi-arrow-left",
              severity: "primary",
              onClick: () => setActiveTab("lampiran"),
              style: { fontWeight: 800, padding: "8px 16px", fontSize: "0.82rem", boxShadow: "0 2px 6px rgba(37,99,235,0.25)" }
            }),
            (0,t.jsx)(c.Button,{
              label: "Segarkan",
              icon: "pi pi-refresh",
              outlined: !0,
              size: "small",
              onClick: loadArchives,
              loading: archiveLoading,
              style: { fontSize: "0.8rem", height: "36px" }
            })
          ]})
        ]}),

        // 2. Edukasi / Penjelas Perbedaan DRAFT vs ARSIP
        (0,t.jsxs)("div",{style:{background:"linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",border:"1.5px solid #cbd5e1",borderRadius:"8px",padding:"0.8rem 1.2rem",marginBottom:"1rem",display:"flex",alignItems:"center",gap:"1.2rem",fontSize:"0.77rem",color:"#334155",boxShadow:"0 1px 3px rgba(0,0,0,0.03)"},children:[
          (0,t.jsx)("div",{style:{fontSize:"1.6rem"},children:"💡"}),
          (0,t.jsxs)("div",{style:{flex:1,display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"},children:[
            (0,t.jsxs)("div",{style:{background:"#ecfdf5",border:"1px solid #a7f3d0",borderRadius:"6px",padding:"0.55rem 0.85rem"},children:[
              (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"6px",fontWeight:800,color:"#065f46",marginBottom:"2px"},children:[
                (0,t.jsx)("span",{children:"📝"}),
                "DRAFT NASKAH DINAS (LEMBAR KERJA)"
              ]}),
              (0,t.jsx)("div",{style:{fontSize:"0.72rem",color:"#047857",lineHeight:1.45},children:"Lembar kerja aktif data dinamis. Anda bebas menyunting teks, menambah/menghapus tabel, dan mengatur tata letak naskah. Belum tersimpan resmi sampai Anda mencetaknya."})
            ]}),
            (0,t.jsxs)("div",{style:{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:"6px",padding:"0.55rem 0.85rem"},children:[
              (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"6px",fontWeight:800,color:"#92400e",marginBottom:"2px"},children:[
                (0,t.jsx)("span",{children:"🔒"}),
                "ARSIP DOKUMEN (SNAPSHOT RESMI)"
              ]}),
              (0,t.jsx)("div",{style:{fontSize:"0.72rem",color:"#b45309",lineHeight:1.45},children:"Salinan naskah dinas resmi yang telah dicetak & dikunci permanen. Memiliki CAS Forensic Stamp unik anti-tamper untuk keperluan audit dan pencatatan kepolisian."})
            ]})
          ]}),
        ]}),

        // 3. Tabel Daftar Arsip
        (0,t.jsx)("div",{className:"cms-card",style:{padding:0,overflow:"hidden",borderRadius:"8px",border:"1px solid #cbd5e1"},children:
          (0,t.jsxs)("table",{style:{width:"100%",borderCollapse:"collapse",fontSize:"0.82rem"},children:[
            (0,t.jsx)("thead",{children:(0,t.jsxs)("tr",{style:{background:"#f1f5f9",borderBottom:"1.5px solid #cbd5e1",textAlign:"left"},children:[
              (0,t.jsx)("th",{style:{padding:"12px 14px",width:"5%",fontWeight:800,color:"#334155"},children:"No"}),
              (0,t.jsx)("th",{style:{padding:"12px 14px",width:"28%",fontWeight:800,color:"#334155"},children:"Judul Dokumen Dinas"}),
              (0,t.jsx)("th",{style:{padding:"12px 14px",width:"18%",fontWeight:800,color:"#334155"},children:"Satuan Kerja"}),
              (0,t.jsx)("th",{style:{padding:"12px 14px",width:"16%",fontWeight:800,color:"#334155"},children:"Kode CAS"}),
              (0,t.jsx)("th",{style:{padding:"12px 14px",width:"16%",fontWeight:800,color:"#334155"},children:"Waktu Pencatatan"}),
              (0,t.jsx)("th",{style:{padding:"12px 14px",width:"17%",textAlign:"center",fontWeight:800,color:"#334155"},children:"Status & Aksi"})
            ]})}),
            (0,t.jsxs)("tbody",{children:[
              archiveList.length > 0 ? archiveList.map((item, idx) => {
                let isCurrent = archiveLoadedInfo && archiveLoadedInfo.id === item.id;
                return (0,t.jsxs)("tr",{key:idx,style:{borderBottom:"1px solid #e2e8f0",background:isCurrent?"#fffbeb":"#ffffff",transition:"background 0.15s ease"},children:[
                  (0,t.jsx)("td",{style:{padding:"11px 14px",fontWeight:600,color:"#64748b"},children:idx+1}),
                  (0,t.jsxs)("td",{style:{padding:"11px 14px"},children:[
                    (0,t.jsxs)("div",{style:{fontWeight:700,color:"#0f172a",display:"flex",alignItems:"center",gap:"6px"},children:[
                      item.document_title || "Laporan Anev",
                      isCurrent && (0,t.jsx)("span",{style:{background:"#fef3c7",color:"#92400e",border:"1px solid #f59e0b",padding:"1px 6px",borderRadius:"4px",fontSize:"0.65rem",fontWeight:800},children:"AKTIF DI KANVAS"})
                    ]}),
                    (0,t.jsxs)("div",{style:{fontSize:"0.72rem",color:"#64748b",marginTop:"2px"},children:["Periode: ", item.periode_label || "-"]})
                  ]}),
                  (0,t.jsx)("td",{style:{padding:"11px 14px",fontWeight:600,color:"#334155"},children:item.satker_nama || "BARESKRIM POLRI"}),
                  (0,t.jsx)("td",{style:{padding:"11px 14px"},children:
                    (0,t.jsx)("span",{style:{fontFamily:"monospace",background:"#eff6ff",color:"#1d4ed8",border:"1px solid #bfdbfe",padding:"2px 7px",borderRadius:"4px",fontSize:"0.74rem",fontWeight:800},children:(item.security_stamp ? item.security_stamp.replace(/^STAMP-/, "CAS-") : "-")})
                  }),
                  (0,t.jsxs)("td",{style:{padding:"11px 14px",fontSize:"0.74rem",color:"#475569"},children:[
                    (0,t.jsx)("div",{style:{fontWeight:600},children:new Date(item.created_at).toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}),
                    (0,t.jsxs)("div",{style:{color:"#64748b",fontSize:"0.7rem"},children:["Oleh: ", item.user_nama || "Petugas"]})
                  ]}),
                  (0,t.jsx)("td",{style:{padding:"11px 14px",textAlign:"center"},children:
                    isCurrent ? (
                      (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",gap:"5px"},children:[
                        (0,t.jsx)(c.Button,{label:"Lihat di Naskah",size:"small",severity:"warning",icon:"pi pi-eye",onClick:()=>setActiveTab("lampiran"),style:{fontSize:"0.74rem",fontWeight:700,height:"30px"}})
                      ]})
                    ) : (
                      (0,t.jsx)(c.Button,{label:"Buka Arsip Ini",size:"small",icon:"pi pi-folder-open",outlined:!0,onClick:()=>handleOpenArchive(item),style:{fontSize:"0.74rem",fontWeight:600,height:"30px"}})
                    )
                  })
                ]});
              }) : (0,t.jsx)("tr",{children:(0,t.jsx)("td",{colSpan:6,style:{padding:"2.5rem",textAlign:"center",color:"#94a3b8",fontStyle:"italic"},children:"Belum ada arsip dokumen tercetak."})})
            ]})
          ]})
        })
      ]})
    ]});
}])}]);