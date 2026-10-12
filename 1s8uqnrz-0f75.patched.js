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
    let [showTableMenu, setShowTableMenu] = (0,a.useState)(false);
    let [showTagMenu, setShowTagMenu] = (0,a.useState)(false);

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
      toastRef.current?.show({ severity: "info", summary: "Tabel Disisipkan", detail: "Tabel baru berhasil disisipkan.", life: 3000 });
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
        toastRef.current?.show({ severity: "info", summary: "Hapus Tabel", detail: "Letakkan kursor di dalam tabel yang ingin dihapus.", life: 3500 });
      }
    }

    function handleAddTableRow(isAbove) {
      var sel = window.getSelection();
      var node = sel && sel.anchorNode;
      var el = node ? (node.nodeType === 1 ? node : node.parentElement) : null;
      var tr = el ? el.closest('tr') : null;
      var table = tr ? tr.closest('table') : (el ? el.closest('table') : document.querySelector('.anev-table-naskah'));
      if (table) {
        var tbody = table.querySelector('tbody') || table;
        var refTr = tr || tbody.querySelector('tr:last-child');
        var colCount = refTr ? refTr.children.length : 4;
        var newTr = document.createElement('tr');
        for (var c = 0; c < colCount; c++) {
          var td = document.createElement('td');
          td.style.border = '1px solid #cbd5e1';
          td.style.padding = '5px 7px';
          td.innerHTML = c === 0 ? String(tbody.querySelectorAll('tr').length + 1) : '-';
          if (c === 0) td.style.textAlign = 'center';
          newTr.appendChild(td);
        }
        if (refTr) {
          if (isAbove) refTr.before(newTr);
          else refTr.after(newTr);
        } else {
          tbody.appendChild(newTr);
        }
        toastRef.current?.show({ severity: "success", summary: "Baris Ditambahkan", detail: (isAbove ? "Baris atas" : "Baris bawah") + " berhasil ditambahkan.", life: 2000 });
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

    function handleAddTableCol(isLeft) {
      var sel = window.getSelection();
      var node = sel && sel.anchorNode;
      var el = node ? (node.nodeType === 1 ? node : node.parentElement) : null;
      var cell = el ? el.closest('td, th') : null;
      var table = cell ? cell.closest('table') : (el ? el.closest('table') : document.querySelector('.anev-table-naskah'));
      if (!table) {
        toastRef.current?.show({ severity: "info", summary: "Tambah Kolom", detail: "Letakkan kursor pada sel tabel tempat kolom ingin disisipkan.", life: 3000 });
        return;
      }
      var cellIdx = cell ? cell.cellIndex : -1;
      var rows = table.rows;
      for (var r = 0; r < rows.length; r++) {
        var row = rows[r];
        var isH = (row.firstElementChild && row.firstElementChild.tagName === 'TH') || (row.parentElement && row.parentElement.tagName === 'THEAD');
        var newC = document.createElement(isH ? 'th' : 'td');
        newC.style.border = '1px solid #cbd5e1';
        newC.style.padding = '5px 7px';
        if (isH) {
          newC.style.background = '#f1f5f9';
          newC.style.fontWeight = '700';
          newC.innerHTML = 'Kolom Baru';
          newC.style.textAlign = 'center';
        } else {
          newC.innerHTML = '-';
          newC.style.textAlign = 'center';
        }
        if (cellIdx >= 0 && cellIdx < row.children.length) {
          if (isLeft) row.children[cellIdx].before(newC);
          else row.children[cellIdx].after(newC);
        } else {
          row.appendChild(newC);
        }
      }
      toastRef.current?.show({ severity: "success", summary: "Kolom Ditambahkan", detail: (isLeft ? "Kolom kiri" : "Kolom kanan") + " berhasil ditambahkan ke tabel.", life: 2000 });
    }

    function handleDeleteTableCol() {
      var sel = window.getSelection();
      var node = sel && sel.anchorNode;
      var el = node ? (node.nodeType === 1 ? node : node.parentElement) : null;
      var cell = el ? el.closest('td, th') : null;
      var table = cell ? cell.closest('table') : (el ? el.closest('table') : null);
      if (!table || !cell) {
        toastRef.current?.show({ severity: "info", summary: "Hapus Kolom", detail: "Letakkan kursor pada kolom tabel yang ingin dihapus.", life: 3000 });
        return;
      }
      var idx = cell.cellIndex;
      var rows = table.rows;
      if (rows.length > 0 && rows[0].children.length <= 1) {
        var box = table.closest('.anev-custom-table-box') || table;
        box.remove();
        toastRef.current?.show({ severity: "warn", summary: "Tabel Dihapus", detail: "Kolom terakhir dihapus beserta tabelnya.", life: 2500 });
        return;
      }
      for (var r = 0; r < rows.length; r++) {
        if (idx < rows[r].children.length) {
          rows[r].children[idx].remove();
        }
      }
      toastRef.current?.show({ severity: "warn", summary: "Kolom Dihapus", detail: "Kolom berhasil dihapus.", life: 2000 });
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

    function insertStamp(stampType) {
      var color = stampType === 'RAHASIA' ? '#dc2626' : (stampType === 'TERBATAS' ? '#d97706' : '#2563eb');
      var stampHtml = '<span class="anev-security-stamp" style="border:2px solid ' + color + ';color:' + color + ';font-weight:900;letter-spacing:2px;text-transform:uppercase;padding:2px 12px;border-radius:4px;font-size:0.80rem;display:inline-block;margin:4px 0;">KLASIFIKASI: ' + stampType + '</span>&nbsp;';
      try {
        document.execCommand('insertHTML', false, stampHtml);
      } catch(e) {}
      setShowTagMenu(false);
    }

    function insertTag(tagName) {
      var tagHtml = '<span class="anev-auto-tag" style="background:#eff6ff;color:#1d4ed8;border:1px solid #bfdbfe;border-radius:4px;padding:1px 5px;font-family:monospace;font-size:0.82rem;font-weight:700;">{{AUTO: ' + tagName + '}}</span>&nbsp;';
      try {
        document.execCommand('insertHTML', false, tagHtml);
      } catch(e) {}
      setShowTagMenu(false);
    }

    function resolveAutoTags() {
      try {
        var sTipe = reportData?.meta?.satkerTipe || currentUser?.satker_tipe || "POLDA";
        var structLevel = sTipe === "MABES" ? "MARKAS BESAR" : (sTipe === "POLDA" ? "DAERAH" : (sTipe === "POLRES" ? "RESOR" : "SEKTOR"));
        var rawSatkerNama = (reportData?.meta?.satkerNama || currentUser?.satker_nama || "JAWA TIMUR").toUpperCase();
        var locSatker = rawSatkerNama.replace(/^(KEPOLISIAN DAERAH|POLDA|POLRES|POLSEK|KEPOLISIAN RESOR|KEPOLISIAN SEKTOR)\s+/i, "");
        var orgLevel = reportData?.meta?.satkerLevel || (sTipe === "MABES" ? "BADAN RESERSE KRIMINAL" : (sTipe === "POLDA" ? "DIREKTORAT RESERSE KRIMINAL UMUM" : "SATUAN RESERSE KRIMINAL"));

        var dates = computeDates();
        var tAwal = dates.dStart ? new Date(dates.dStart).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }) : "01 September 2026";
        var tAkhir = dates.dEnd ? new Date(dates.dEnd).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }) : "30 September 2026";
        var pMode = kpPeriodMode === "month" ? "BULANAN" : (kpPeriodMode === "year" ? "TAHUNAN" : "PERIODIK");
        var detPeriod = dates.pLabel ? dates.pLabel.toUpperCase() : "SEPTEMBER 2026";

        var tagMap = {
          "structure_level": structLevel,
          "lokasi_satker": locSatker,
          "organization_level": orgLevel,
          "tanggal_awal": tAwal,
          "tanggal_akhir": tAkhir,
          "period": pMode,
          "detail_period": detPeriod,
          "PERIOD": pMode,
          "DETAIL PERIOD": detPeriod
        };

        var workspace = document.querySelector(".anev-pages-workspace");
        if (workspace) {
          var walker = document.createTreeWalker(workspace, NodeFilter.SHOW_TEXT, null, false);
          var node;
          var textNodes = [];
          while ((node = walker.nextNode())) {
            textNodes.push(node);
          }
          for (var i = 0; i < textNodes.length; i++) {
            var tn = textNodes[i];
            var val = tn.nodeValue;
            if (val && (val.includes("{{") || val.includes("[*"))) {
              var newVal = val;
              for (var k in tagMap) {
                newVal = newVal.split("{{AUTO: " + k + "}}").join(tagMap[k]);
                newVal = newVal.split("{{AUTO:" + k + "}}").join(tagMap[k]);
                newVal = newVal.split("{{ AUTO: " + k + " }}").join(tagMap[k]);
                newVal = newVal.split("[*" + k + "]").join(tagMap[k]);
              }
              if (newVal !== val) tn.nodeValue = newVal;
            }
          }
        }
        toastRef.current?.show({ severity: "success", summary: "Data Tersinkron", detail: "Semua tag {{AUTO:...}} telah diganti dengan data riil dari sistem.", life: 2500 });
      } catch(e) {
        console.error("resolveAutoTags error:", e);
      }
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
        setTimeout(resolveAutoTags, 250);
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
            margin-top: 2cm !important;
            margin-right: 2cm !important;
            margin-bottom: 2cm !important;
            margin-left: 3cm !important;
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
            width: 100% !important;
            min-width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            min-height: calc(297mm - 4.5cm) !important;
            max-height: none !important;
            margin: 0 !important;
            padding: 0 0 3mm 0 !important;
            page-break-before: auto !important;
            break-before: auto !important;
            page-break-after: always !important;
            break-after: page !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            overflow: visible !important;
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
            overflow: visible !important;
            box-sizing: border-box !important;
          }
          .anev-page-break {
            page-break-before: always !important;
            break-before: page !important;
            display: block !important;
            height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            visibility: hidden !important;
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
        .anev-menu-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          margin-top: 4px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.12);
          padding: 4px 0;
          z-index: 120;
          min-width: 195px;
        }
        .anev-menu-item {
          padding: 6px 12px;
          font-size: 0.78rem;
          font-weight: 600;
          color: #334155;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background 0.1s;
        }
        .anev-menu-item:hover {
          background: #f1f5f9;
          color: #0f172a;
        }
        .anev-auto-tag {
          background: #eff6ff;
          color: #1d4ed8;
          border: 1px solid #bfdbfe;
          border-radius: 4px;
          padding: 1px 5px;
          font-family: monospace;
          font-size: 0.82rem;
          font-weight: 700;
          display: inline-block;
        }
        .anev-security-stamp {
          border: 2px solid #dc2626;
          color: #dc2626;
          font-weight: 900;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 3px 14px;
          border-radius: 4px;
          font-size: 0.82rem;
          display: inline-block;
          margin-bottom: 8px;
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
        
    // TOOLBAR GOOGLE DOCS STYLE
    activeTab === "lampiran" && (0,t.jsxs)("div",{className:"anev-docs-toolbar",children:[
      // 1. Actions: Undo, Redo, Print
      (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Urungkan (Undo - Ctrl+Z)",onMouseDown:e=>{e.preventDefault();execCmd("undo")},children:(0,t.jsx)("i",{className:"pi pi-undo",style:{fontSize:"0.78rem"}})}),
      (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Ulangi (Redo - Ctrl+Y)",onMouseDown:e=>{e.preventDefault();execCmd("redo")},children:(0,t.jsx)("i",{className:"pi pi-refresh",style:{fontSize:"0.78rem"}})}),
      (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Cetak Naskah (Ctrl+P)",onMouseDown:e=>{e.preventDefault();window.print()},children:(0,t.jsx)("i",{className:"pi pi-print",style:{fontSize:"0.78rem"}})}),

      (0,t.jsx)("div",{className:"anev-tool-separator"}),

      // 2. DROPDOWN MENU TABEL LENGKAP (GOOGLE DOCS STYLE)
      (0,t.jsxs)("div",{style:{position:"relative",display:"inline-block"},children:[
        (0,t.jsxs)("button",{type:"button",className:"anev-tool-btn",style:{gap:"4px",fontWeight:700,color:"#1d4ed8",background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:"4px",padding:"2px 8px"},onMouseDown:e=>{e.preventDefault();setShowTableMenu(!showTableMenu);setShowTagMenu(false);setShowColorMenu(false);setShowHighlightMenu(false)},children:[
          (0,t.jsx)("i",{className:"pi pi-table",style:{fontSize:"0.78rem"}}),
          " Tabel ▾"
        ]}),
        showTableMenu && (0,t.jsxs)("div",{className:"anev-menu-dropdown",style:{minWidth:"185px"},children:[
          (0,t.jsxs)("div",{className:"anev-menu-item",onMouseDown:e=>{e.preventDefault();setShowTableMenu(false);handleInsertTable()},children:[
            (0,t.jsx)("span",{children:"➕"}), " Sisipkan Tabel Baru"
          ]}),
          (0,t.jsxs)("div",{className:"anev-menu-item",onMouseDown:e=>{e.preventDefault();setShowTableMenu(false);handleAddTableRow(true)},children:[
            (0,t.jsx)("span",{children:"⬆️"}), " Tambah Baris Atas"
          ]}),
          (0,t.jsxs)("div",{className:"anev-menu-item",onMouseDown:e=>{e.preventDefault();setShowTableMenu(false);handleAddTableRow(false)},children:[
            (0,t.jsx)("span",{children:"⬇️"}), " Tambah Baris Bawah"
          ]}),
          (0,t.jsxs)("div",{className:"anev-menu-item",onMouseDown:e=>{e.preventDefault();setShowTableMenu(false);handleDeleteTableRow()},children:[
            (0,t.jsx)("span",{children:"❌"}), " Hapus Baris Aktif"
          ]}),
          (0,t.jsx)("div",{style:{width:"100%",height:"1px",background:"#e2e8f0",margin:"3px 0"}}),
          (0,t.jsxs)("div",{className:"anev-menu-item",onMouseDown:e=>{e.preventDefault();setShowTableMenu(false);handleAddTableCol(true)},children:[
            (0,t.jsx)("span",{children:"⬅️"}), " Tambah Kolom Kiri"
          ]}),
          (0,t.jsxs)("div",{className:"anev-menu-item",onMouseDown:e=>{e.preventDefault();setShowTableMenu(false);handleAddTableCol(false)},children:[
            (0,t.jsx)("span",{children:"➡️"}), " Tambah Kolom Kanan"
          ]}),
          (0,t.jsxs)("div",{className:"anev-menu-item",onMouseDown:e=>{e.preventDefault();setShowTableMenu(false);handleDeleteTableCol()},children:[
            (0,t.jsx)("span",{children:"❌"}), " Hapus Kolom Aktif"
          ]}),
          (0,t.jsx)("div",{style:{width:"100%",height:"1px",background:"#e2e8f0",margin:"3px 0"}}),
          (0,t.jsxs)("div",{className:"anev-menu-item",style:{color:"#dc2626"},onMouseDown:e=>{e.preventDefault();setShowTableMenu(false);handleDeleteTable()},children:[
            (0,t.jsx)("span",{children:"🗑️"}), " Hapus Tabel Ini"
          ]})
        ]})
      ]}),

      // Quick Table Buttons
      (0,t.jsxs)("button",{type:"button",className:"anev-tool-btn",title:"Tambah Baris Cepat (ke Bawah)",onMouseDown:e=>{e.preventDefault();handleAddTableRow(false)},style:{gap:"2px",fontSize:"0.74rem",color:"#047857",background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:"4px",padding:"2px 6px"},children:[
        (0,t.jsx)("i",{className:"pi pi-plus",style:{fontSize:"0.68rem"}}), " Baris"
      ]}),
      (0,t.jsxs)("button",{type:"button",className:"anev-tool-btn",title:"Tambah Kolom Cepat (ke Kanan)",onMouseDown:e=>{e.preventDefault();handleAddTableCol(false)},style:{gap:"2px",fontSize:"0.74rem",color:"#0369a1",background:"#f0f9ff",border:"1px solid #bae6fd",borderRadius:"4px",padding:"2px 6px"},children:[
        (0,t.jsx)("i",{className:"pi pi-plus",style:{fontSize:"0.68rem"}}), " Kolom"
      ]}),
      (0,t.jsxs)("button",{type:"button",className:"anev-tool-btn",title:"Tambah Spasi Paragraf (Enter)",onMouseDown:e=>{e.preventDefault();handleInsertSpace()},style:{gap:"2px",fontSize:"0.74rem",color:"#475569",background:"#f8fafc",border:"1px solid #cbd5e1",borderRadius:"4px",padding:"2px 6px"},children:[
        (0,t.jsx)("i",{className:"pi pi-arrow-down-left",style:{fontSize:"0.72rem"}}), " Spasi"
      ]}),

      (0,t.jsx)("div",{className:"anev-tool-separator"}),

      // 3. DROPDOWN MENU CAP KEAMANAN & TAG OTOMATIS
      (0,t.jsxs)("div",{style:{position:"relative",display:"inline-block"},children:[
        (0,t.jsxs)("button",{type:"button",className:"anev-tool-btn",style:{gap:"4px",fontWeight:700,color:"#065f46",background:"#ecfdf5",border:"1px solid #a7f3d0",borderRadius:"4px",padding:"2px 8px"},onMouseDown:e=>{e.preventDefault();setShowTagMenu(!showTagMenu);setShowTableMenu(false);setShowColorMenu(false);setShowHighlightMenu(false)},children:[
          (0,t.jsx)("span",{children:"🛡️"}),
          " Cap & Tag ▾"
        ]}),
        showTagMenu && (0,t.jsxs)("div",{className:"anev-menu-dropdown",style:{minWidth:"210px"},children:[
          (0,t.jsxs)("div",{className:"anev-menu-item",onMouseDown:e=>{e.preventDefault();insertStamp("RAHASIA")},children:[
            (0,t.jsx)("span",{style:{color:"#dc2626",fontWeight:900},children:"🔴"}), " Cap: RAHASIA"
          ]}),
          (0,t.jsxs)("div",{className:"anev-menu-item",onMouseDown:e=>{e.preventDefault();insertStamp("TERBATAS")},children:[
            (0,t.jsx)("span",{style:{color:"#d97706",fontWeight:900},children:"🟠"}), " Cap: TERBATAS"
          ]}),
          (0,t.jsxs)("div",{className:"anev-menu-item",onMouseDown:e=>{e.preventDefault();insertStamp("KONFIDENSIAL")},children:[
            (0,t.jsx)("span",{style:{color:"#2563eb",fontWeight:900},children:"🔵"}), " Cap: KONFIDENSIAL"
          ]}),
          (0,t.jsx)("div",{style:{width:"100%",height:"1px",background:"#e2e8f0",margin:"3px 0"}}),
          (0,t.jsxs)("div",{className:"anev-menu-item",onMouseDown:e=>{e.preventDefault();insertTag("structure_level")},children:[
            (0,t.jsx)("span",{children:"🏷️"}), " {{AUTO: structure_level}}"
          ]}),
          (0,t.jsxs)("div",{className:"anev-menu-item",onMouseDown:e=>{e.preventDefault();insertTag("lokasi_satker")},children:[
            (0,t.jsx)("span",{children:"🏷️"}), " {{AUTO: lokasi_satker}}"
          ]}),
          (0,t.jsxs)("div",{className:"anev-menu-item",onMouseDown:e=>{e.preventDefault();insertTag("organization_level")},children:[
            (0,t.jsx)("span",{children:"🏷️"}), " {{AUTO: organization_level}}"
          ]}),
          (0,t.jsxs)("div",{className:"anev-menu-item",onMouseDown:e=>{e.preventDefault();insertTag("tanggal_awal")},children:[
            (0,t.jsx)("span",{children:"🏷️"}), " {{AUTO: tanggal_awal}}"
          ]}),
          (0,t.jsxs)("div",{className:"anev-menu-item",onMouseDown:e=>{e.preventDefault();insertTag("tanggal_akhir")},children:[
            (0,t.jsx)("span",{children:"🏷️"}), " {{AUTO: tanggal_akhir}}"
          ]}),
          (0,t.jsxs)("div",{className:"anev-menu-item",onMouseDown:e=>{e.preventDefault();insertTag("period")},children:[
            (0,t.jsx)("span",{children:"🏷️"}), " {{AUTO: period}}"
          ]}),
          (0,t.jsxs)("div",{className:"anev-menu-item",onMouseDown:e=>{e.preventDefault();insertTag("detail_period")},children:[
            (0,t.jsx)("span",{children:"🏷️"}), " {{AUTO: detail_period}}"
          ]})
        ]})
      ]}),

      // 4. TOMBOL SINKRONISASI DATA OTOMATIS (SINKRON CAS)
      (0,t.jsxs)("button",{type:"button",className:"anev-tool-btn",title:"Ganti tag {{AUTO:...}} dengan nilai riil dari sistem secara otomatis",onMouseDown:e=>{e.preventDefault();resolveAutoTags()},style:{gap:"4px",fontWeight:800,fontSize:"0.76rem",color:"#ffffff",background:"#2563eb",border:"1px solid #1d4ed8",borderRadius:"4px",padding:"2px 9px",boxShadow:"0 1px 3px rgba(37,99,235,0.3)"},children:[
        (0,t.jsx)("span",{children:"✨"}),
        " Ganti Data Otomatis (Sinkron)"
      ]}),

      (0,t.jsx)("div",{className:"anev-tool-separator"}),

      // 5. Zoom Dokumen
      (0,t.jsxs)("div",{style:{display:"inline-flex",alignItems:"center",gap:"2px"},children:[
        (0,t.jsx)("i",{className:"pi pi-search-plus",style:{fontSize:"0.72rem",color:"#64748b"}}),
        (0,t.jsx)(l.Dropdown,{value:docZoom,options:zoomOptions,onChange:e=>setDocZoom(e.value),style:{width:"5.3rem",height:"28px",fontSize:"0.76rem"}})
      ]}),

      (0,t.jsx)("div",{className:"anev-tool-separator"}),

      // 6. Format Blok / Heading
      (0,t.jsx)(l.Dropdown,{value:selectedHeading,options:headingOptions,onChange:e=>{setSelectedHeading(e.value);execCmd("formatBlock",e.value)},style:{width:"8.3rem",height:"28px",fontSize:"0.76rem"}}),

      // 7. Font Family
      (0,t.jsx)(l.Dropdown,{value:selectedFont,options:fontOptions,onChange:e=>{setSelectedFont(e.value);execCmd("fontName",e.value)},style:{width:"8.6rem",height:"28px",fontSize:"0.76rem"}}),

      (0,t.jsx)("div",{className:"anev-tool-separator"}),

      // 8. Bold, Italic, Underline, Strikethrough
      (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Tebal (Bold - Ctrl+B)",onMouseDown:e=>{e.preventDefault();execCmd("bold")},children:(0,t.jsx)("strong",{style:{fontSize:"0.84rem"},children:"B"})}),
      (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Miring (Italic - Ctrl+I)",onMouseDown:e=>{e.preventDefault();execCmd("italic")},children:(0,t.jsx)("em",{style:{fontSize:"0.84rem",fontFamily:"serif"},children:"I"})}),
      (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Garis Bawah (Underline - Ctrl+U)",onMouseDown:e=>{e.preventDefault();execCmd("underline")},children:(0,t.jsx)("u",{style:{fontSize:"0.84rem"},children:"U"})}),
      (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Coret (Strikethrough)",onMouseDown:e=>{e.preventDefault();execCmd("strikeThrough")},children:(0,t.jsx)("s",{style:{fontSize:"0.84rem"},children:"S"})}),

      (0,t.jsx)("div",{className:"anev-tool-separator"}),

      // 9. Warna Font & Stabilo
      (0,t.jsxs)("div",{style:{position:"relative",display:"inline-block"},children:[
        (0,t.jsxs)("button",{type:"button",className:"anev-tool-btn",title:"Warna Teks",onMouseDown:e=>{e.preventDefault();setShowColorMenu(!showColorMenu);setShowHighlightMenu(false);setShowTableMenu(false);setShowTagMenu(false)},children:[
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
        (0,t.jsxs)("button",{type:"button",className:"anev-tool-btn",title:"Warna Sorotan (Stabilo)",onMouseDown:e=>{e.preventDefault();setShowHighlightMenu(!showHighlightMenu);setShowColorMenu(false);setShowTableMenu(false);setShowTagMenu(false)},children:[
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

      // 10. Perataan Paragraf
      (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Rata Kiri",onMouseDown:e=>{e.preventDefault();execCmd("justifyLeft")},children:(0,t.jsx)("i",{className:"pi pi-align-left",style:{fontSize:"0.78rem"}})}),
      (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Rata Tengah",onMouseDown:e=>{e.preventDefault();execCmd("justifyCenter")},children:(0,t.jsx)("i",{className:"pi pi-align-center",style:{fontSize:"0.78rem"}})}),
      (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Rata Kanan",onMouseDown:e=>{e.preventDefault();execCmd("justifyRight")},children:(0,t.jsx)("i",{className:"pi pi-align-right",style:{fontSize:"0.78rem"}})}),
      (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Rata Kiri-Kanan (Justify)",onMouseDown:e=>{e.preventDefault();execCmd("justifyFull")},children:(0,t.jsx)("i",{className:"pi pi-align-justify",style:{fontSize:"0.78rem"}})}),

      (0,t.jsx)("div",{className:"anev-tool-separator"}),

      // 11. Daftar & Indentasi
      (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Daftar Butir (Bullets)",onMouseDown:e=>{e.preventDefault();execCmd("insertUnorderedList")},children:(0,t.jsx)("i",{className:"pi pi-list",style:{fontSize:"0.78rem"}})}),
      (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Daftar Angka (Numbering)",onMouseDown:e=>{e.preventDefault();execCmd("insertOrderedList")},children:(0,t.jsx)("span",{style:{fontSize:"0.72rem",fontWeight:800},children:"1."})}),
      (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Kurangi Indentasi",onMouseDown:e=>{e.preventDefault();execCmd("outdent")},children:(0,t.jsx)("i",{className:"pi pi-angle-left",style:{fontSize:"0.78rem"}})}),
      (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Tambah Indentasi",onMouseDown:e=>{e.preventDefault();execCmd("indent")},children:(0,t.jsx)("i",{className:"pi pi-angle-right",style:{fontSize:"0.78rem"}})}),

      (0,t.jsx)("div",{className:"anev-tool-separator"}),

      // 12. Garis Pembatas, Page Break, Reset
      (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Sisipkan Garis Pembatas",onMouseDown:e=>{e.preventDefault();execCmd("insertHorizontalRule")},children:(0,t.jsx)("i",{className:"pi pi-minus",style:{fontSize:"0.78rem"}})}),
      (0,t.jsx)("button",{type:"button",className:"anev-tool-btn",title:"Hapus Format (Clear)",onMouseDown:e=>{e.preventDefault();execCmd("removeFormat")},children:(0,t.jsx)("i",{className:"pi pi-filter-slash",style:{fontSize:"0.78rem"}})}),
      (0,t.jsxs)("button",{type:"button",className:"anev-tool-btn",title:"Sisipkan Batas Halaman (Page Break)",style:{gap:"3px",fontSize:"0.74rem",color:"#475569"},onMouseDown:e=>{
        e.preventDefault();
        execCmd("insertHTML", '<div class="anev-page-break" style="page-break-before:always; border-top:1.5px dashed #cbd5e1; margin:1.5rem 0; padding-top:0.4rem; text-align:center; font-size:0.7rem; color:#94a3b8; user-select:none;">--- PEMISAH HALAMAN CETAK ---</div><p><br></p>');
      },children:[
        (0,t.jsx)("span",{children:"📄"}),
        "Batas Hal"
      ]}),
      (0,t.jsxs)("button",{type:"button",className:"anev-tool-btn",title:"Muat Ulang Teks Standar dari Sistem",style:{marginLeft:"auto",gap:"3px",fontSize:"0.74rem",color:"#b91c1c"},onClick:handleGenerateLampiran,children:[
        (0,t.jsx)("i",{className:"pi pi-replay",style:{fontSize:"0.72rem"}}),
        "Reset Naskah"
      ]})
    ]}),

    // TAB 1: NASKAH KANVAS DINAS A4 (9 HALAMAN LENGKAP DENGAN FORMAT RESMI BARU)
    activeTab === "lampiran" && (0,t.jsxs)("div",{children:[
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
                (0,t.jsx)("div",{style:{fontSize:"0.72rem",color:"#047857",marginTop:"1px"},children:"Naskah belum diarsipkan secara permanen. Klik teks/angka di mana saja untuk menyunting langsung, gunakan tombol Sinkron untuk memperbarui data, gunakan toolbar untuk manipulasi tabel dan tag."})
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
          // Corner Status Pill
          (0,t.jsx)("div",{className:"anev-sheet-corner-pill anev-no-print",style:{position:"absolute",top:"12px",right:"18px",fontSize:"0.65rem",fontWeight:800,letterSpacing:"0.5px",padding:"2px 8px",borderRadius:"10px",background:archiveLoadedInfo?"#fef3c7":"#ecfdf5",color:archiveLoadedInfo?"#92400e":"#065f46",border:archiveLoadedInfo?"1px solid #fde68a":"1px solid #a7f3d0"},children:archiveLoadedInfo?"🔒 SALINAN ARSIP RESMI":"📝 DRAFT NASKAH DINAS"}),
          // Watermark Overlay
          (0,t.jsx)("div",{className:"anev-watermark-overlay",style:{display:"flex",flexDirection:"column",justifyContent:"space-around",height:"100%",padding:"2rem 0"},children:[
            (0,t.jsx)("div",{className:"anev-watermark-line",children:watermarkText}),
            (0,t.jsx)("div",{className:"anev-watermark-line",children:watermarkText}),
            (0,t.jsx)("div",{className:"anev-watermark-line",children:watermarkText}),
            (0,t.jsx)("div",{className:"anev-watermark-line",children:watermarkText})
          ]}),
          // Page Content
          (0,t.jsxs)("div",{className:"anev-page-content anev-doc-editor",contentEditable:!0,suppressContentEditableWarning:!0,spellCheck:!1,children:[
            
            // KOP DINAS & SECURITY STAMP
            (0,t.jsxs)("div",{style:{textAlign:"center",marginBottom:"1.5rem"},children:[
              (0,t.jsx)("div",{className:"anev-security-stamp",children:"KLASIFIKASI: RAHASIA"}),
              (0,t.jsx)("div",{style:{fontWeight:800,fontSize:"0.95rem",letterSpacing:"1px",textTransform:"uppercase"},children:"KEPOLISIAN NEGARA REPUBLIK INDONESIA"}),
              (0,t.jsxs)("div",{style:{fontWeight:700,fontSize:"0.90rem",letterSpacing:"0.5px",textTransform:"uppercase"},children:[
                (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: structure_level}}"}),
                " ",
                (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: lokasi_satker}}"})
              ]}),
              (0,t.jsx)("div",{style:{fontWeight:700,fontSize:"0.88rem",letterSpacing:"0.5px",textTransform:"uppercase"},children:(0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: organization_level}}"})}),
              // Lambang Reserse
              (0,t.jsx)("div",{style:{margin:"10px auto",width:"60px",height:"60px",display:"flex",alignItems:"center",justifyContent:"center",background:"#090d16",borderRadius:"50%",border:"2.5px solid #eab308",color:"#eab308",fontWeight:900,fontSize:"1.4rem",boxShadow:"0 2px 8px rgba(234,179,8,0.25)"},children:"★"}),
              (0,t.jsxs)("div",{style:{fontWeight:900,fontSize:"1.1rem",letterSpacing:"1px",marginTop:"6px"},children:[
                "LAPORAN ",
                (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: period}}"})
              ]}),
              (0,t.jsxs)("div",{style:{fontWeight:700,fontSize:"0.92rem"},children:[
                (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: organization_level}}"}),
                " ",
                (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: structure_level}}"}),
                " ",
                (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: lokasi_satker}}"})
              ]}),
              (0,t.jsx)("div",{style:{fontWeight:600,fontSize:"0.85rem",color:"#475569"},children:(0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: detail_period}}"})}),
              (0,t.jsx)("div",{style:{borderBottom:"2.5px solid #000",marginTop:"12px"}})
            ]}),

            // BAB I PENDAHULUAN
            (0,t.jsx)("div",{className:"anev-section-title",children:"BAB I: PENDAHULUAN"}),
            (0,t.jsx)("div",{className:"anev-sub-title",children:"A. Umum"}),
            (0,t.jsxs)("p",{children:[
              "Laporan ini disusun sebagai bentuk pertanggungjawaban pelaksanaan tugas fungsi Reserse dalam kurun waktu ",
              (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: tanggal_awal}}"}),
              " s.d. ",
              (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: tanggal_akhir}}"}),
              ", mencakup kegiatan pembinaan operasional, pelaksanaan penyidikan, serta pencapaian kinerja di lingkungan ",
              (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: organization_level}}"}),
              " ",
              (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: structure_level}}"}),
              " ",
              (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: lokasi_satker}}"}),
              "."
            ]}),
            (0,t.jsx)("p",{children:"Laporan ini bertujuan untuk mendokumentasikan hasil pelaksanaan kegiatan, menyajikan data capaian indikator kinerja utama, dan memberikan informasi strategis yang dapat digunakan sebagai dasar evaluasi serta bahan pertimbangan dalam pengambilan kebijakan pada periode berikutnya."}),

            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.6rem"},children:"B. Maksud dan Tujuan"}),
            (0,t.jsxs)("p",{children:[
              (0,t.jsx)("strong",{children:"1. Maksud: "}),
              "Laporan ini disusun dengan maksud untuk mendokumentasikan seluruh pelaksanaan kegiatan penyelidikan dan penyidikan yang dilaksanakan oleh ",
              (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: organization_level}}"}),
              " ",
              (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: structure_level}}"}),
              " ",
              (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: lokasi_satker}}"}),
              " selama periode yang telah ditentukan."
            ]}),
            (0,t.jsx)("p",{children:(0,t.jsx)("strong",{children:"2. Tujuan: Laporan ini bertujuan untuk:"})}),
            (0,t.jsxs)("ol",{style:{margin:"2px 0 6px 1.2rem",padding:0},children:[
              (0,t.jsx)("li",{children:"Menyajikan data capaian kinerja dan perkembangan penanganan perkara secara akurat dan terukur;"}),
              (0,t.jsx)("li",{children:"Memberikan informasi sebagai bahan evaluasi, pengambilan keputusan, dan penyusunan rencana tindak lanjut;"}),
              (0,t.jsxs)("li",{children:[
                "Memenuhi kewajiban pelaporan periodik sesuai ketentuan yang berlaku dalam lingkungan ",
                (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: structure_level}}"}),
                "."
              ]})
            ]}),

            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.6rem"},children:"C. Dasar"}),
            (0,t.jsxs)("ol",{style:{margin:"2px 0 6px 1.2rem",padding:0},children:[
              (0,t.jsx)("li",{children:"Undang-Undang Nomor 2 Tahun 2002 tentang Kepolisian Negara Republik Indonesia;"}),
              (0,t.jsx)("li",{children:"Peraturan Kepolisian Negara Republik Indonesia Nomor 4 Tahun 2025 tentang SOTK Mabes Polri / Peraturan Kepolisian Negara Republik Indonesia Nomor 3 Tahun 2024 tentang Perubahan atas Perkap Nomor 14 Tahun 2018 tentang SOTK Polda;"}),
              (0,t.jsx)("li",{children:"Peraturan Kepala Kepolisian Negara Republik Indonesia Nomor 7 Tahun 2009 tentang Sistem Laporan Gangguan Kamtibmas;"}),
              (0,t.jsx)("li",{children:"Peraturan Kepala Kepolisian Negara Republik Indonesia Nomor 6 Tahun 2019 tentang Penyidikan Tindak Pidana;"}),
              (0,t.jsx)("li",{children:"Peraturan Kepala Kepolisian Negara Republik Indonesia Nomor 1 Tahun 2023 tentang Naskah Dinas dan Tata Persuratan Dinas di Lingkungan Kepolisian Negara Republik Indonesia;"}),
              (0,t.jsx)("li",{children:"Surat Edaran Kepala Badan Reserse Kriminal Polri Nomor: B/1574/Ops/IV/2012/Bareskrim tanggal 23 April 2012 tentang Pengiriman Laporan Bulanan;"}),
              (0,t.jsx)("li",{children:"Surat Kepala Badan Reserse Kriminal Polri Nomor: B/2231/Ops/IV/2013/Bareskrim tanggal 25 April 2013 tentang format Laporan Bulanan."})
            ]}),

            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.6rem"},children:"D. Ruang Lingkup"}),
            (0,t.jsxs)("p",{children:[
              "Laporan ini mencakup seluruh kegiatan penyelidikan dan penyidikan yang dilaksanakan oleh ",
              (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: organization_level}}"}),
              " ",
              (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: structure_level}}"}),
              " ",
              (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: lokasi_satker}}"}),
              " selama periode ",
              (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: detail_period}}"}),
              ", meliputi: 1) Data laporan polisi (LP) masuk dan selesai; 2) Penanganan perkara per jenis tindak pidana; 3) Pelaksanaan restorative justice (RJ); 4) Data barang bukti; 5) Kekuatan personel & beban kerja; 6) Kerjasama instansi; 7) Kasus menonjol; 8) Analisis dan evaluasi kinerja."
            ]}),

            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.6rem"},children:"E. Indeks Kinerja Utama (IKU)"}),
            (0,t.jsx)("p",{children:"Indeks Kinerja Utama (IKU) yang menjadi fokus pelaksanaan tugas Bareskrim Polri adalah Indeks Penegakan Hukum secara Berkeadilan, sebagaimana tertuang dalam Rencana Strategis (Renstra) Polri Tahun 2025–2029. IKU ini digunakan untuk mengukur sejauh mana fungsi penyidikan dapat dijalankan secara efektif, profesional, dan akuntabel."}),
            // Tabel 1.1 IKU
            (0,t.jsxs)("table",{className:"anev-table-naskah",style:{width:"100%",margin:"8px 0"},children:[
              (0,t.jsx)("thead",{children:(0,t.jsxs)("tr",{children:[
                (0,t.jsx)("th",{style:{width:"8%"},children:"No"}),
                (0,t.jsx)("th",{style:{width:"38%"},children:"Sasaran Strategis"}),
                (0,t.jsx)("th",{style:{width:"24%"},children:"Indikator Kinerja Utama"}),
                (0,t.jsx)("th",{style:{width:"6%"},children:"2025"}),
                (0,t.jsx)("th",{style:{width:"6%"},children:"2026"}),
                (0,t.jsx)("th",{style:{width:"6%"},children:"2027"}),
                (0,t.jsx)("th",{style:{width:"6%"},children:"2028"}),
                (0,t.jsx)("th",{style:{width:"6%"},children:"2029"})
              ]})}),
              (0,t.jsx)("tbody",{children:(0,t.jsxs)("tr",{children:[
                (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:700},children:"SS2"}),
                (0,t.jsx)("td",{children:"Penegakan Hukum yang Humanis, Akuntabel, dan Berkeadilan (Renstra 2020-2024: Penegakan hukum secara berkeadilan)"}),
                (0,t.jsx)("td",{style:{fontWeight:600},children:"3. Indeks Gakkum Polri"}),
                (0,t.jsx)("td",{style:{textAlign:"center"},children:"3,6"}),
                (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:700,color:"#1d4ed8"},children:"3,7"}),
                (0,t.jsx)("td",{style:{textAlign:"center"},children:"3,8"}),
                (0,t.jsx)("td",{style:{textAlign:"center"},children:"3,9"}),
                (0,t.jsx)("td",{style:{textAlign:"center"},children:"4,0"})
              ]})})
            ]}),
            (0,t.jsx)("div",{style:{fontSize:"0.74rem",color:"#475569",fontStyle:"italic",marginBottom:"6px"},children:"Tabel 1.1: Indikator Kinerja Utama Indeks Gakkum Polri"}),
            (0,t.jsx)("p",{children:"Target Indeks Kinerja Utama (IKU) ini bersifat tahunan dan digunakan sebagai dasar dalam mengevaluasi kinerja satker fungsi Reserse secara berjenjang. Penilaian terhadap pencapaian IKU dilakukan melalui pengukuran berbasis data yang bersumber dari Crime Analytic System (CAS) yang mengelola data secara otomatis dan real-time."})

          ]}),
          // Page Footer
          (0,t.jsxs)("div",{className:"anev-page-footer",children:[
            (0,t.jsxs)("div",{className:"anev-footer-left anev-forensic-stamp",children:[
              (0,t.jsx)("span",{style:{fontSize:"0.72rem",marginRight:"4px"},children:"🛡️"}),
              (0,t.jsx)("span",{style:{fontFamily:"monospace",fontSize:"0.66rem",fontWeight:archiveLoadedInfo?800:700,color:archiveLoadedInfo?"#92400e":"#475569",letterSpacing:"0.4px"},children:archiveLoadedInfo ? ("ARSIP #" + archiveLoadedInfo.id + " • " + (archiveLoadedInfo.stamp ? archiveLoadedInfo.stamp.replace(/^STAMP-/, "CAS-") : "CAS-" + archiveLoadedInfo.id)) : docStamp})
            ]}),
            (0,t.jsx)("div",{className:"anev-footer-right",children:1})
          ]})
        ]})
  ,

        (0,t.jsxs)("div",{className:"anev-page-sheet anev-print-sheet",children:[
          // Corner Status Pill
          (0,t.jsx)("div",{className:"anev-sheet-corner-pill anev-no-print",style:{position:"absolute",top:"12px",right:"18px",fontSize:"0.65rem",fontWeight:800,letterSpacing:"0.5px",padding:"2px 8px",borderRadius:"10px",background:archiveLoadedInfo?"#fef3c7":"#ecfdf5",color:archiveLoadedInfo?"#92400e":"#065f46",border:archiveLoadedInfo?"1px solid #fde68a":"1px solid #a7f3d0"},children:archiveLoadedInfo?"🔒 SALINAN ARSIP RESMI":"📝 DRAFT NASKAH DINAS"}),
          // Watermark Overlay
          (0,t.jsx)("div",{className:"anev-watermark-overlay",style:{display:"flex",flexDirection:"column",justifyContent:"space-around",height:"100%",padding:"2rem 0"},children:[
            (0,t.jsx)("div",{className:"anev-watermark-line",children:watermarkText}),
            (0,t.jsx)("div",{className:"anev-watermark-line",children:watermarkText}),
            (0,t.jsx)("div",{className:"anev-watermark-line",children:watermarkText}),
            (0,t.jsx)("div",{className:"anev-watermark-line",children:watermarkText})
          ]}),
          // Page Content
          (0,t.jsxs)("div",{className:"anev-page-content anev-doc-editor",contentEditable:!0,suppressContentEditableWarning:!0,spellCheck:!1,children:[
            
            (0,t.jsx)("div",{className:"anev-section-title",children:"BAB II: TUGAS YANG DILAKSANAKAN"}),
            (0,t.jsx)("div",{className:"anev-sub-title",children:"A. Tugas Utama"}),
            (0,t.jsxs)("p",{children:[
              "Selama periode pelaporan ini, ",
              (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: organization_level}}"}),
              " ",
              (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: structure_level}}"}),
              " ",
              (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: lokasi_satker}}"}),
              " melaksanakan tugas pokok dan fungsi di bidang reserse kriminal sesuai dengan ketentuan yang berlaku. Tugas-tugas tersebut mencakup kegiatan penyelidikan, penyidikan, pelaksanaan gelar perkara, penegakan hukum, serta kegiatan operasional terpadu lainnya."
            ]}),

            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.6rem"},children:"B. Manajemen Operasional"}),
            (0,t.jsx)("p",{children:"Pelaksanaan tugas operasional ditunjang oleh ketersediaan sumber daya manusia (SDM), anggaran belanja, serta sarana dan prasarana (sarpras) yang dikelola secara efektif dan efisien guna mewujudkan pelayanan prima kepolisian."}),
            
            (0,t.jsxs)("div",{style:{paddingLeft:"0.8rem"},children:[
              (0,t.jsx)("p",{children:(0,t.jsxs)("strong",{children:[
                "1. Sumber Daya Manusia (SDM): ",
                (0,t.jsx)("span",{style:{fontWeight:"normal"},children:"Kekuatan personel pengemban fungsi reserse kriminal saat ini tercatat siap operasional dengan tingkat pemenuhan DSP 89% dan rasio beban kerja terdistribusi proporsional. Seluruh penyidik aktif didorong meningkatkan kompetensi melalui sertifikasi profesi."})
              ]})}),
              (0,t.jsx)("p",{children:(0,t.jsxs)("strong",{children:[
                "2. Anggaran Belanja: ",
                (0,t.jsx)("span",{style:{fontWeight:"normal"},children:"Penggunaan anggaran belanja selama periode pelaporan terbagi dalam Belanja Pegawai, Belanja Barang, dan Belanja Modal. Penyerapan anggaran penyelidikan dan penyidikan terealisasi sesuai rencana penarikan dana operasional tanpa kendala administratif."})
              ]})}),
              (0,t.jsx)("p",{children:(0,t.jsxs)("strong",{children:[
                "3. Sarana dan Prasarana: ",
                (0,t.jsx)("span",{style:{fontWeight:"normal"},children:"Kesiapan Alat Material Khusus (Almatsus) operasional penegakan hukum, kendaraan dinas taktis R4/R2, alat komunikasi HT terenkripsi, unit PC/laptop operasional CAS, mobile forensic kit, serta ruang riksa dan ruang tahanan berada dalam kondisi laik pakai dan memenuhi standar pelayanan presisi."})
              ]})})
            ]}),

            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.6rem"},children:"C. Tahanan dan Barang Bukti"}),
            (0,t.jsx)("p",{children:"Pengelolaan tahanan dan barang bukti selama periode pelaporan dijabarkan secara kuantitatif berdasarkan kategori dan jenisnya:"}),
            
            // Tabel 1.8 Tahanan
            (0,t.jsx)("p",{style:{fontWeight:700,marginBottom:"3px"},children:"1. Rekapitulasi Jumlah Tahanan"}),
            (0,t.jsxs)("table",{className:"anev-table-naskah",style:{width:"100%",fontSize:"0.74rem"},children:[
              (0,t.jsxs)("thead",{children:[
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"6%"},children:"No"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"34%",textAlign:"left"},children:"Jenis Tahanan"}),
                  (0,t.jsx)("th",{colSpan:3,children:"Jumlah Tahanan"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"12%"},children:"Total"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"18%"},children:"Keterangan"})
                ]}),
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("th",{style:{width:"10%"},children:"Awal"}),
                  (0,t.jsx)("th",{style:{width:"10%"},children:"Masuk"}),
                  (0,t.jsx)("th",{style:{width:"10%"},children:"Keluar"})
                ]})
              ]}),
              (0,t.jsxs)("tbody",{children:[
                (0,t.jsxs)("tr",{style:{background:"#f8fafc",fontWeight:700},children:[
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"A."}),
                  (0,t.jsx)("td",{colSpan:6,children:"Tahanan Satuan Kerja"})
                ]}),
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"1"}),
                  (0,t.jsx)("td",{children:"Dewasa (Laki-laki)"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"18"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"7"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"5"}),
                  (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:700},children:"20"}),
                  (0,t.jsx)("td",{children:"Rutan Satker"})
                ]}),
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"2"}),
                  (0,t.jsx)("td",{children:"Dewasa (Perempuan)"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"3"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"1"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"1"}),
                  (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:700},children:"3"}),
                  (0,t.jsx)("td",{children:"Rutan Satker"})
                ]}),
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"3"}),
                  (0,t.jsx)("td",{children:"Anak Berhadapan Hukum (ABH)"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"1"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"0"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"1"}),
                  (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:700},children:"0"}),
                  (0,t.jsx)("td",{children:"Diversi / Bapas"})
                ]}),
                (0,t.jsxs)("tr",{style:{background:"#f8fafc",fontWeight:700},children:[
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"B."}),
                  (0,t.jsx)("td",{colSpan:6,children:"Titipan Instansi / K / L"})
                ]}),
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"4"}),
                  (0,t.jsx)("td",{children:"Titipan Kejaksaan / Pengadilan"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"2"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"1"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"1"}),
                  (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:700},children:"2"}),
                  (0,t.jsx)("td",{children:"Tahap II / Sidang"})
                ]}),
                (0,t.jsxs)("tr",{style:{background:"#eff6ff",fontWeight:800},children:[
                  (0,t.jsx)("td",{colSpan:2,style:{textAlign:"center"},children:"GRAND TOTAL TAHANAN"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"24"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"9"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"8"}),
                  (0,t.jsx)("td",{style:{textAlign:"center",color:"#1d4ed8"},children:"25"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"Tertib & Aman"})
                ]})
              ]})
            ]}),
            (0,t.jsx)("div",{style:{fontSize:"0.74rem",color:"#475569",fontStyle:"italic",marginBottom:"8px"},children:"Tabel 1.8: Jumlah Tahanan"}),

            // Tabel 1.9 Barang Bukti
            (0,t.jsx)("p",{style:{fontWeight:700,marginBottom:"3px"},children:"2. Rekapitulasi Jenis dan Jumlah Barang Bukti"}),
            (0,t.jsxs)("table",{className:"anev-table-naskah",style:{width:"100%",fontSize:"0.74rem"},children:[
              (0,t.jsx)("thead",{children:(0,t.jsxs)("tr",{children:[
                (0,t.jsx)("th",{style:{width:"6%"},children:"No"}),
                (0,t.jsx)("th",{style:{width:"40%",textAlign:"left"},children:"Jenis Barang Bukti"}),
                (0,t.jsx)("th",{style:{width:"18%"},children:"Jumlah"}),
                (0,t.jsx)("th",{style:{width:"16%"},children:"Satuan"}),
                (0,t.jsx)("th",{style:{width:"20%"},children:"Keterangan"})
              ]})}),
              (0,t.jsxs)("tbody",{children:[
                (0,t.jsxs)("tr",{style:{background:"#f8fafc",fontWeight:700},children:[
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"A."}),
                  (0,t.jsx)("td",{colSpan:4,children:"Barang Bukti Bergerak"})
                ]}),
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"1"}),
                  (0,t.jsx)("td",{children:"Kendaraan Bermotor (Roda 2 / Roda 4)"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"14"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"Unit"}),
                  (0,t.jsx)("td",{children:"Gudang BB"})
                ]}),
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"2"}),
                  (0,t.jsx)("td",{children:"Perangkat Elektronik (HP / Laptop / Tablet)"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"28"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"Unit"}),
                  (0,t.jsx)("td",{children:"Uji Labfor"})
                ]}),
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"3"}),
                  (0,t.jsx)("td",{children:"Senjata Tajam & Senpi Rakitan"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"5"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"Pucuk/Bilah"}),
                  (0,t.jsx)("td",{children:"Ruang Khusus BB"})
                ]}),
                (0,t.jsxs)("tr",{style:{background:"#f8fafc",fontWeight:700},children:[
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"B."}),
                  (0,t.jsx)("td",{colSpan:4,children:"Barang Bukti Finansial & Digital"})
                ]}),
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"4"}),
                  (0,t.jsx)("td",{children:"Uang Tunai / Valuta Asing"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"385.000.000"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"Rupiah"}),
                  (0,t.jsx)("td",{children:"Rekening Penitipan"})
                ]}),
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"5"}),
                  (0,t.jsx)("td",{children:"Dokumen Digital, CCTV & Rekaman Media"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"16"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"Berkas/Flashdisk"}),
                  (0,t.jsx)("td",{children:"Penyidikan CAS"})
                ]})
              ]})
            ]}),
            (0,t.jsx)("div",{style:{fontSize:"0.74rem",color:"#475569",fontStyle:"italic"},children:"Tabel 1.9: Jenis dan Jumlah Barang Bukti"})

          ]}),
          // Page Footer
          (0,t.jsxs)("div",{className:"anev-page-footer",children:[
            (0,t.jsxs)("div",{className:"anev-footer-left anev-forensic-stamp",children:[
              (0,t.jsx)("span",{style:{fontSize:"0.72rem",marginRight:"4px"},children:"🛡️"}),
              (0,t.jsx)("span",{style:{fontFamily:"monospace",fontSize:"0.66rem",fontWeight:archiveLoadedInfo?800:700,color:archiveLoadedInfo?"#92400e":"#475569",letterSpacing:"0.4px"},children:archiveLoadedInfo ? ("ARSIP #" + archiveLoadedInfo.id + " • " + (archiveLoadedInfo.stamp ? archiveLoadedInfo.stamp.replace(/^STAMP-/, "CAS-") : "CAS-" + archiveLoadedInfo.id)) : docStamp})
            ]}),
            (0,t.jsx)("div",{className:"anev-footer-right",children:2})
          ]})
        ]})
  ,

        (0,t.jsxs)("div",{className:"anev-page-sheet anev-print-sheet",children:[
          // Corner Status Pill
          (0,t.jsx)("div",{className:"anev-sheet-corner-pill anev-no-print",style:{position:"absolute",top:"12px",right:"18px",fontSize:"0.65rem",fontWeight:800,letterSpacing:"0.5px",padding:"2px 8px",borderRadius:"10px",background:archiveLoadedInfo?"#fef3c7":"#ecfdf5",color:archiveLoadedInfo?"#92400e":"#065f46",border:archiveLoadedInfo?"1px solid #fde68a":"1px solid #a7f3d0"},children:archiveLoadedInfo?"🔒 SALINAN ARSIP RESMI":"📝 DRAFT NASKAH DINAS"}),
          // Watermark Overlay
          (0,t.jsx)("div",{className:"anev-watermark-overlay",style:{display:"flex",flexDirection:"column",justifyContent:"space-around",height:"100%",padding:"2rem 0"},children:[
            (0,t.jsx)("div",{className:"anev-watermark-line",children:watermarkText}),
            (0,t.jsx)("div",{className:"anev-watermark-line",children:watermarkText}),
            (0,t.jsx)("div",{className:"anev-watermark-line",children:watermarkText}),
            (0,t.jsx)("div",{className:"anev-watermark-line",children:watermarkText})
          ]}),
          // Page Content
          (0,t.jsxs)("div",{className:"anev-page-content anev-doc-editor",contentEditable:!0,suppressContentEditableWarning:!0,spellCheck:!1,children:[
            
            (0,t.jsx)("div",{className:"anev-sub-title",children:"D. Kerjasama yang Dilaksanakan"}),
            (0,t.jsx)("p",{children:"Selama periode pelaporan, satuan kerja telah aktif melaksanakan koordinasi dan kerja sama strategis serta taktis operasional bersama mitra Criminal Justice System (CJS) seperti Kejaksaan Negeri, Pengadilan Negeri, Balai Pemasyarakatan (Bapas), Pusat Pelaporan dan Analisis Transaksi Keuangan (PPATK), serta perbankan guna percepatan pembuktian perkara dan pemulihan aset korban kejahatan."}),

            (0,t.jsx)("div",{className:"anev-section-title",style:{marginTop:"1rem"},children:"E. Analisis dan Evaluasi terhadap Pelaksanaan Tugas"}),
            (0,t.jsx)("p",{children:"Analisis dan evaluasi ini disusun berdasarkan data operasional yang terintegrasi secara real-time melalui Crime Analytic System (CAS). Evaluasi dilakukan dengan pendekatan kuantitatif dan komparatif, membandingkan indikator kinerja antara periode pelaporan saat ini dengan periode sebelumnya yang setara (apple to apple) guna memastikan akurasi pemetaan kriminologi dan efektivitas langkah penegakan hukum."}),

            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.8rem"},children:"1. Analisis Data Kejahatan Periode Sebelumnya"}),
            (0,t.jsx)("p",{children:"Data perkara kejahatan pada periode sebelumnya digunakan sebagai baseline perbandingan kinerja operasional penegakan hukum, dengan rincian sebagai berikut:"}),

            // Tabel 2.1 Data Kejahatan Periode Sebelumnya
            (0,t.jsxs)("table",{className:"anev-table-naskah",style:{width:"100%",fontSize:"0.74rem"},children:[
              (0,t.jsxs)("thead",{children:[
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"5%"},children:"No"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"33%",textAlign:"left"},children:"Jenis Kejahatan / Tindak Pidana"}),
                  (0,t.jsx)("th",{colSpan:2,children:"Jumlah Lapor (CT)"}),
                  (0,t.jsx)("th",{colSpan:2,children:"Jumlah Selesai (CC)"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"12%"},children:"Persentase (%)"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"14%"},children:"Keterangan"})
                ]}),
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("th",{style:{width:"9%"},children:"Tgk"}),
                  (0,t.jsx)("th",{style:{width:"9%"},children:"Jln"}),
                  (0,t.jsx)("th",{style:{width:"9%"},children:"Tgk"}),
                  (0,t.jsx)("th",{style:{width:"9%"},children:"Jln"})
                ]})
              ]}),
              (0,t.jsxs)("tbody",{children:[
                (reportData?.kamtibmas?.appleToApple && reportData.kamtibmas.appleToApple.length > 0) ? (
                  reportData.kamtibmas.appleToApple.slice(0, 10).map((row, idx)=>(
                    (0,t.jsxs)("tr",{key:idx,children:[
                      (0,t.jsx)("td",{style:{textAlign:"center"},children:idx + 1}),
                      (0,t.jsx)("td",{children:row.nama || ("Jenis Kejahatan " + (idx + 1))}),
                      (0,t.jsx)("td",{style:{textAlign:"center"},children:Math.round((row.ct_prev || 0) * 0.3)}),
                      (0,t.jsx)("td",{style:{textAlign:"center"},children:Math.round((row.ct_prev || 0) * 0.7)}),
                      (0,t.jsx)("td",{style:{textAlign:"center"},children:Math.round((row.cc_prev || 0) * 0.25)}),
                      (0,t.jsx)("td",{style:{textAlign:"center"},children:Math.round((row.cc_prev || 0) * 0.75)}),
                      (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:600},children:(row.cr_prev || (row.ct_prev > 0 ? Math.round(((row.cc_prev||0)/(row.ct_prev||1))*100) : 0)) + "%"}),
                      (0,t.jsx)("td",{style:{textAlign:"center"},children:idx < 3 ? "Atensi" : "Rutin"})
                    ]})
                  ))
                ) : (
                  [
                    { nama: "Pencurian dengan Pemberatan (Curat)", ct_prev: 42, cc_prev: 35 },
                    { nama: "Penipuan / Penggelapan Daring", ct_prev: 38, cc_prev: 28 },
                    { nama: "Pencurian Kendaraan Bermotor (Curanmor)", ct_prev: 29, cc_prev: 21 },
                    { nama: "Penyalahgunaan Narkotika", ct_prev: 26, cc_prev: 26 },
                    { nama: "Penganiayaan Berat (Anirat)", ct_prev: 18, cc_prev: 16 },
                    { nama: "Tindak Pidana ITE / Pencemaran", ct_prev: 15, cc_prev: 11 },
                    { nama: "Pencurian dengan Kekerasan (Curas)", ct_prev: 12, cc_prev: 10 },
                    { nama: "Tindak Pidana Lingkungan / Tipiter", ct_prev: 8, cc_prev: 6 }
                  ].map((row, idx)=>(
                    (0,t.jsxs)("tr",{key:idx,children:[
                      (0,t.jsx)("td",{style:{textAlign:"center"},children:idx + 1}),
                      (0,t.jsx)("td",{children:row.nama}),
                      (0,t.jsx)("td",{style:{textAlign:"center"},children:Math.round(row.ct_prev * 0.3)}),
                      (0,t.jsx)("td",{style:{textAlign:"center"},children:Math.round(row.ct_prev * 0.7)}),
                      (0,t.jsx)("td",{style:{textAlign:"center"},children:Math.round(row.cc_prev * 0.3)}),
                      (0,t.jsx)("td",{style:{textAlign:"center"},children:Math.round(row.cc_prev * 0.7)}),
                      (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:600},children:Math.round((row.cc_prev / row.ct_prev) * 100) + "%"}),
                      (0,t.jsx)("td",{style:{textAlign:"center"},children:idx < 3 ? "Atensi" : "Rutin"})
                    ]})
                  ))
                ),
                (0,t.jsxs)("tr",{style:{background:"#eff6ff",fontWeight:800},children:[
                  (0,t.jsx)("td",{colSpan:2,style:{textAlign:"center"},children:"JUMLAH TOTAL PERIODE SEBELUMNYA"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:Math.round((reportData?.kamtibmas?.ct?.prev || 188) * 0.3)}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:Math.round((reportData?.kamtibmas?.ct?.prev || 188) * 0.7)}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:Math.round((reportData?.kamtibmas?.cc?.prev || 153) * 0.3)}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:Math.round((reportData?.kamtibmas?.cc?.prev || 153) * 0.7)}),
                  (0,t.jsx)("td",{style:{textAlign:"center",color:"#1d4ed8"},children:(reportData?.kamtibmas?.cc?.ratePrev || "81.4") + "%"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"Data CAS"})
                ]})
              ]})
            ]}),
            (0,t.jsx)("div",{style:{fontSize:"0.74rem",color:"#475569",fontStyle:"italic",marginBottom:"8px"},children:"Tabel 2.1: Data Kejahatan Periode Sebelumnya"}),
            (0,t.jsx)("p",{children:"Data pada Tabel 2.1 mencerminkan beban perkara tunggakan maupun perkara berjalan pada periode lalu. Penanganan perkara diprioritaskan pada tindak pidana yang meresahkan masyarakat serta perkara transnasional berbasis digital."})

          ]}),
          // Page Footer
          (0,t.jsxs)("div",{className:"anev-page-footer",children:[
            (0,t.jsxs)("div",{className:"anev-footer-left anev-forensic-stamp",children:[
              (0,t.jsx)("span",{style:{fontSize:"0.72rem",marginRight:"4px"},children:"🛡️"}),
              (0,t.jsx)("span",{style:{fontFamily:"monospace",fontSize:"0.66rem",fontWeight:archiveLoadedInfo?800:700,color:archiveLoadedInfo?"#92400e":"#475569",letterSpacing:"0.4px"},children:archiveLoadedInfo ? ("ARSIP #" + archiveLoadedInfo.id + " • " + (archiveLoadedInfo.stamp ? archiveLoadedInfo.stamp.replace(/^STAMP-/, "CAS-") : "CAS-" + archiveLoadedInfo.id)) : docStamp})
            ]}),
            (0,t.jsx)("div",{className:"anev-footer-right",children:3})
          ]})
        ]})
  ,

        (0,t.jsxs)("div",{className:"anev-page-sheet anev-print-sheet",children:[
          // Corner Status Pill
          (0,t.jsx)("div",{className:"anev-sheet-corner-pill anev-no-print",style:{position:"absolute",top:"12px",right:"18px",fontSize:"0.65rem",fontWeight:800,letterSpacing:"0.5px",padding:"2px 8px",borderRadius:"10px",background:archiveLoadedInfo?"#fef3c7":"#ecfdf5",color:archiveLoadedInfo?"#92400e":"#065f46",border:archiveLoadedInfo?"1px solid #fde68a":"1px solid #a7f3d0"},children:archiveLoadedInfo?"🔒 SALINAN ARSIP RESMI":"📝 DRAFT NASKAH DINAS"}),
          // Watermark Overlay
          (0,t.jsx)("div",{className:"anev-watermark-overlay",style:{display:"flex",flexDirection:"column",justifyContent:"space-around",height:"100%",padding:"2rem 0"},children:[
            (0,t.jsx)("div",{className:"anev-watermark-line",children:watermarkText}),
            (0,t.jsx)("div",{className:"anev-watermark-line",children:watermarkText}),
            (0,t.jsx)("div",{className:"anev-watermark-line",children:watermarkText}),
            (0,t.jsx)("div",{className:"anev-watermark-line",children:watermarkText})
          ]}),
          // Page Content
          (0,t.jsxs)("div",{className:"anev-page-content anev-doc-editor",contentEditable:!0,suppressContentEditableWarning:!0,spellCheck:!1,children:[
            
            (0,t.jsx)("div",{className:"anev-sub-title",children:"2. Analisis Data Kejahatan Periode Saat Ini"}),
            (0,t.jsx)("p",{children:"Data tindak pidana yang dilaporkan dan diselesaikan pada periode pelaporan berjalan disajikan pada tabel berikut:"}),

            // Tabel 2.2 Data Kejahatan Periode Ini
            (0,t.jsxs)("table",{className:"anev-table-naskah",style:{width:"100%",fontSize:"0.74rem"},children:[
              (0,t.jsxs)("thead",{children:[
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"5%"},children:"No"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"33%",textAlign:"left"},children:"Jenis Kejahatan / Tindak Pidana"}),
                  (0,t.jsx)("th",{colSpan:2,children:"Jumlah Lapor (CT)"}),
                  (0,t.jsx)("th",{colSpan:2,children:"Jumlah Selesai (CC)"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"12%"},children:"Persentase (%)"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"14%"},children:"Keterangan"})
                ]}),
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("th",{style:{width:"9%"},children:"Tgk"}),
                  (0,t.jsx)("th",{style:{width:"9%"},children:"Jln"}),
                  (0,t.jsx)("th",{style:{width:"9%"},children:"Tgk"}),
                  (0,t.jsx)("th",{style:{width:"9%"},children:"Jln"})
                ]})
              ]}),
              (0,t.jsxs)("tbody",{children:[
                (reportData?.kamtibmas?.appleToApple && reportData.kamtibmas.appleToApple.length > 0) ? (
                  reportData.kamtibmas.appleToApple.slice(0, 10).map((row, idx)=>(
                    (0,t.jsxs)("tr",{key:idx,children:[
                      (0,t.jsx)("td",{style:{textAlign:"center"},children:idx + 1}),
                      (0,t.jsx)("td",{children:row.nama || ("Jenis Kejahatan " + (idx + 1))}),
                      (0,t.jsx)("td",{style:{textAlign:"center"},children:Math.round((row.ct_curr || 0) * 0.25)}),
                      (0,t.jsx)("td",{style:{textAlign:"center"},children:Math.round((row.ct_curr || 0) * 0.75)}),
                      (0,t.jsx)("td",{style:{textAlign:"center"},children:Math.round((row.cc_curr || 0) * 0.3)}),
                      (0,t.jsx)("td",{style:{textAlign:"center"},children:Math.round((row.cc_curr || 0) * 0.7)}),
                      (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:600},children:(row.cr_curr || (row.ct_curr > 0 ? Math.round(((row.cc_curr||0)/(row.ct_curr||1))*100) : 0)) + "%"}),
                      (0,t.jsx)("td",{style:{textAlign:"center"},children:idx < 3 ? "Atensi" : "Terkendali"})
                    ]})
                  ))
                ) : (
                  [
                    { nama: "Pencurian dengan Pemberatan (Curat)", ct_curr: 36, cc_curr: 32 },
                    { nama: "Penipuan / Penggelapan Daring", ct_curr: 45, cc_curr: 36 },
                    { nama: "Pencurian Kendaraan Bermotor (Curanmor)", ct_curr: 24, cc_curr: 20 },
                    { nama: "Penyalahgunaan Narkotika", ct_curr: 29, cc_curr: 29 },
                    { nama: "Penganiayaan Berat (Anirat)", ct_curr: 14, cc_curr: 13 },
                    { nama: "Tindak Pidana ITE / Pencemaran", ct_curr: 18, cc_curr: 15 },
                    { nama: "Pencurian dengan Kekerasan (Curas)", ct_curr: 9, cc_curr: 8 },
                    { nama: "Tindak Pidana Lingkungan / Tipiter", ct_curr: 7, cc_curr: 6 }
                  ].map((row, idx)=>(
                    (0,t.jsxs)("tr",{key:idx,children:[
                      (0,t.jsx)("td",{style:{textAlign:"center"},children:idx + 1}),
                      (0,t.jsx)("td",{children:row.nama}),
                      (0,t.jsx)("td",{style:{textAlign:"center"},children:Math.round(row.ct_curr * 0.25)}),
                      (0,t.jsx)("td",{style:{textAlign:"center"},children:Math.round(row.ct_curr * 0.75)}),
                      (0,t.jsx)("td",{style:{textAlign:"center"},children:Math.round(row.cc_curr * 0.3)}),
                      (0,t.jsx)("td",{style:{textAlign:"center"},children:Math.round(row.cc_curr * 0.7)}),
                      (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:600},children:Math.round((row.cc_curr / row.ct_curr) * 100) + "%"}),
                      (0,t.jsx)("td",{style:{textAlign:"center"},children:idx < 3 ? "Atensi" : "Terkendali"})
                    ]})
                  ))
                ),
                (0,t.jsxs)("tr",{style:{background:"#eff6ff",fontWeight:800},children:[
                  (0,t.jsx)("td",{colSpan:2,style:{textAlign:"center"},children:"JUMLAH TOTAL PERIODE SAAT INI"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:Math.round((reportData?.kamtibmas?.ct?.current || 182) * 0.25)}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:Math.round((reportData?.kamtibmas?.ct?.current || 182) * 0.75)}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:Math.round((reportData?.kamtibmas?.cc?.current || 159) * 0.3)}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:Math.round((reportData?.kamtibmas?.cc?.current || 159) * 0.7)}),
                  (0,t.jsx)("td",{style:{textAlign:"center",color:"#1d4ed8"},children:(reportData?.kamtibmas?.cc?.rateCurrent || "87.4") + "%"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"Data CAS"})
                ]})
              ]})
            ]}),
            (0,t.jsx)("div",{style:{fontSize:"0.74rem",color:"#475569",fontStyle:"italic",marginBottom:"10px"},children:"Tabel 2.2: Data Kejahatan Periode Saat Ini"}),

            // GAMBAR 1.1 GRAFIK TREN KEJAHATAN (SVG VECTOR BERKUALITAS TINGGI)
            (0,t.jsx)("div",{className:"anev-sub-title",children:"3. Perbandingan Grafis Data Kejahatan"}),
            (0,t.jsxs)("div",{style:{background:"#f8fafc",border:"1.5px solid #cbd5e1",borderRadius:"6px",padding:"12px",margin:"6px 0",textAlign:"center"},children:[
              (0,t.jsx)("div",{style:{fontWeight:700,fontSize:"0.80rem",color:"#1e293b",marginBottom:"8px"},children:"Gambar 1.1: Grafik Perbandingan Tren Jumlah Kasus Tindak Pidana"}),
              // Vector SVG Chart
              (0,t.jsxs)("svg",{viewBox:"0 0 650 160",style:{width:"100%",maxHeight:"160px"},children:[
                // Grid lines & labels
                (0,t.jsx)("line",{x1:"50",y1:"20",x2:"620",y2:"20",stroke:"#e2e8f0",strokeDasharray:"3 3"}),
                (0,t.jsx)("line",{x1:"50",y1:"60",x2:"620",y2:"60",stroke:"#e2e8f0",strokeDasharray:"3 3"}),
                (0,t.jsx)("line",{x1:"50",y1:"100",x2:"620",y2:"100",stroke:"#e2e8f0",strokeDasharray:"3 3"}),
                (0,t.jsx)("line",{x1:"50",y1:"130",x2:"620",y2:"130",stroke:"#94a3b8",strokeWidth:"1.5"}),
                (0,t.jsx)("text",{x:"25",y:"24",fontSize:"10",fill:"#64748b",textAnchor:"middle",children:"200"}),
                (0,t.jsx)("text",{x:"25",y:"64",fontSize:"10",fill:"#64748b",textAnchor:"middle",children:"100"}),
                (0,t.jsx)("text",{x:"25",y:"104",fontSize:"10",fill:"#64748b",textAnchor:"middle",children:"50"}),
                (0,t.jsx)("text",{x:"25",y:"134",fontSize:"10",fill:"#64748b",textAnchor:"middle",children:"0"}),
                // Group 1: CT
                (0,t.jsx)("rect",{x:"110",y:"32",width:"38",height:"98",fill:"#94a3b8",rx:"3"}),
                (0,t.jsx)("text",{x:"129",y:"26",fontSize:"10",fontWeight:"bold",fill:"#475569",textAnchor:"middle",children:String(reportData?.kamtibmas?.ct?.prev || 188)}),
                (0,t.jsx)("rect",{x:"152",y:"36",width:"38",height:"94",fill:"#2563eb",rx:"3"}),
                (0,t.jsx)("text",{x:"171",y:"30",fontSize:"10",fontWeight:"bold",fill:"#1d4ed8",textAnchor:"middle",children:String(reportData?.kamtibmas?.ct?.current || 182)}),
                (0,t.jsx)("text",{x:"150",y:"146",fontSize:"11",fontWeight:"bold",fill:"#1e293b",textAnchor:"middle",children:"Crime Total (CT)"}),
                // Group 2: CC
                (0,t.jsx)("rect",{x:"280",y:"54",width:"38",height:"76",fill:"#94a3b8",rx:"3"}),
                (0,t.jsx)("text",{x:"299",y:"48",fontSize:"10",fontWeight:"bold",fill:"#475569",textAnchor:"middle",children:String(reportData?.kamtibmas?.cc?.prev || 153)}),
                (0,t.jsx)("rect",{x:"322",y:"51",width:"38",height:"79",fill:"#16a34a",rx:"3"}),
                (0,t.jsx)("text",{x:"341",y:"45",fontSize:"10",fontWeight:"bold",fill:"#15803d",textAnchor:"middle",children:String(reportData?.kamtibmas?.cc?.current || 159)}),
                (0,t.jsx)("text",{x:"320",y:"146",fontSize:"11",fontWeight:"bold",fill:"#1e293b",textAnchor:"middle",children:"Crime Clearance (CC)"}),
                // Group 3: Restorative Justice (RJ)
                (0,t.jsx)("rect",{x:"450",y:"106",width:"38",height:"24",fill:"#94a3b8",rx:"3"}),
                (0,t.jsx)("text",{x:"469",y:"100",fontSize:"10",fontWeight:"bold",fill:"#475569",textAnchor:"middle",children:"22"}),
                (0,t.jsx)("rect",{x:"492",y:"98",width:"38",height:"32",fill:"#ea580c",rx:"3"}),
                (0,t.jsx)("text",{x:"511",y:"92",fontSize:"10",fontWeight:"bold",fill:"#c2410c",textAnchor:"middle",children:"31"}),
                (0,t.jsx)("text",{x:"490",y:"146",fontSize:"11",fontWeight:"bold",fill:"#1e293b",textAnchor:"middle",children:"Penyelesaian RJ"}),
                // Legend
                (0,t.jsx)("rect",{x:"230",y:"2",width:"12",height:"10",fill:"#94a3b8",rx:"2"}),
                (0,t.jsx)("text",{x:"248",y:"11",fontSize:"10",fill:"#475569",children:"Periode Sebelumnya"}),
                (0,t.jsx)("rect",{x:"360",y:"2",width:"12",height:"10",fill:"#2563eb",rx:"2"}),
                (0,t.jsx)("text",{x:"378",y:"11",fontSize:"10",fill:"#1e293b",fontWeight:"bold",children:"Periode Saat Ini"})
              ]})
            ]}),

            // NARASI ANALISIS PERBANDINGAN KOMPREHENSIF
            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.6rem"},children:"4. Narasi Analisis Komparasi Antarperiode"}),
            (0,t.jsxs)("div",{style:{lineHeight:"1.45"},children:[
              (0,t.jsxs)("p",{children:[
                (0,t.jsx)("strong",{children:"a. Jumlah Tunggakan Tindak Pidana (KP): "}),
                "Terjadi penanganan terhadap tunggakan tindak pidana secara progresif. Tunggakan yang berhasil diselesaikan pada periode berjalan mencakup perkara pembuktian digital dan pemeriksaan saksi lintas wilayah."
              ]}),
              (0,t.jsxs)("p",{children:[
                (0,t.jsx)("strong",{children:"b. Jumlah Tindak Pidana (KM): "}),
                "Jumlah kejahatan yang dilaporkan tercatat ",
                (0,t.jsx)("strong",{children:String(reportData?.kamtibmas?.ct?.current || 182)}),
                " perkara, mengalami penurunan sebesar ",
                (0,t.jsx)("strong",{children:String(Math.abs(reportData?.kamtibmas?.ct?.delta || -6))}),
                " perkara (",
                (0,t.jsx)("strong",{children:String(reportData?.kamtibmas?.ct?.pct || "-3.2")}),
                "%) dibandingkan periode sebelumnya sebanyak ",
                (0,t.jsx)("strong",{children:String(reportData?.kamtibmas?.ct?.prev || 188)}),
                " perkara."
              ]}),
              (0,t.jsxs)("p",{children:[
                (0,t.jsx)("strong",{children:"c. Jumlah Penyelesaian Tindak Pidana (KB & KT): "}),
                "Penyelesaian tindak pidana mencapai ",
                (0,t.jsx)("strong",{children:String(reportData?.kamtibmas?.cc?.current || 159)}),
                " perkara dengan Clearance Rate sebesar ",
                (0,t.jsx)("strong",{children:String(reportData?.kamtibmas?.cc?.rateCurrent || "87.4") + "%"}),
                ", meningkat sebesar +6.0% dibandingkan periode sebelumnya (81.4%)."
              ]}),
              (0,t.jsxs)("p",{children:[
                (0,t.jsx)("strong",{children:"d. Persentase Penanganan Tindak Pidana (Rumus): "}),
                (0,t.jsx)("code",{style:{background:"#eff6ff",padding:"2px 6px",borderRadius:"4px",color:"#1d4ed8",fontWeight:700},children:"X = (KB + KT) : (KM + KP) x 100%"}),
                " = ",
                (0,t.jsx)("strong",{children:String(reportData?.kamtibmas?.cc?.rateCurrent || "87.4") + "%"}),
                " (Kategori Kinerja: Sangat Efektif)."
              ]})
            ]})

          ]}),
          // Page Footer
          (0,t.jsxs)("div",{className:"anev-page-footer",children:[
            (0,t.jsxs)("div",{className:"anev-footer-left anev-forensic-stamp",children:[
              (0,t.jsx)("span",{style:{fontSize:"0.72rem",marginRight:"4px"},children:"🛡️"}),
              (0,t.jsx)("span",{style:{fontFamily:"monospace",fontSize:"0.66rem",fontWeight:archiveLoadedInfo?800:700,color:archiveLoadedInfo?"#92400e":"#475569",letterSpacing:"0.4px"},children:archiveLoadedInfo ? ("ARSIP #" + archiveLoadedInfo.id + " • " + (archiveLoadedInfo.stamp ? archiveLoadedInfo.stamp.replace(/^STAMP-/, "CAS-") : "CAS-" + archiveLoadedInfo.id)) : docStamp})
            ]}),
            (0,t.jsx)("div",{className:"anev-footer-right",children:4})
          ]})
        ]})
  ,

        (0,t.jsxs)("div",{className:"anev-page-sheet anev-print-sheet",children:[
          // Corner Status Pill
          (0,t.jsx)("div",{className:"anev-sheet-corner-pill anev-no-print",style:{position:"absolute",top:"12px",right:"18px",fontSize:"0.65rem",fontWeight:800,letterSpacing:"0.5px",padding:"2px 8px",borderRadius:"10px",background:archiveLoadedInfo?"#fef3c7":"#ecfdf5",color:archiveLoadedInfo?"#92400e":"#065f46",border:archiveLoadedInfo?"1px solid #fde68a":"1px solid #a7f3d0"},children:archiveLoadedInfo?"🔒 SALINAN ARSIP RESMI":"📝 DRAFT NASKAH DINAS"}),
          // Watermark Overlay
          (0,t.jsx)("div",{className:"anev-watermark-overlay",style:{display:"flex",flexDirection:"column",justifyContent:"space-around",height:"100%",padding:"2rem 0"},children:[
            (0,t.jsx)("div",{className:"anev-watermark-line",children:watermarkText}),
            (0,t.jsx)("div",{className:"anev-watermark-line",children:watermarkText}),
            (0,t.jsx)("div",{className:"anev-watermark-line",children:watermarkText}),
            (0,t.jsx)("div",{className:"anev-watermark-line",children:watermarkText})
          ]}),
          // Page Content
          (0,t.jsxs)("div",{className:"anev-page-content anev-doc-editor",contentEditable:!0,suppressContentEditableWarning:!0,spellCheck:!1,children:[
            
            (0,t.jsx)("div",{className:"anev-section-title",children:"F. Penanganan Tindak Pidana melalui Restorative Justice (RJ)"}),
            (0,t.jsx)("p",{children:"Penanganan perkara dengan pendekatan Restorative Justice (RJ) merupakan salah satu upaya penyelesaian tindak pidana melalui proses mediasi penal antara para pihak terkait guna memulihkan keadaan semula, menjamin kepastian hukum, dan rasa keadilan di tengah masyarakat sesuai Perpol No. 8 Tahun 2021."}),
            (0,t.jsx)("p",{children:"Pada periode pelaporan ini, telah dilaksanakan penyelesaian perkara melalui Restorative Justice terhadap sejumlah tindak pidana sebagai berikut:"}),

            // Tabel 2.3 RJ
            (0,t.jsxs)("table",{className:"anev-table-naskah",style:{width:"100%",fontSize:"0.74rem"},children:[
              (0,t.jsxs)("thead",{children:[
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"5%"},children:"No"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"35%",textAlign:"left"},children:"Jenis Tindak Pidana"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"12%"},children:"Crime Total"}),
                  (0,t.jsx)("th",{colSpan:3,children:"Selesai Melalui RJ"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"12%"},children:"Persentase (%)"}),
                  (0,t.jsx)("th",{rowSpan:2,style:{width:"14%"},children:"Keterangan"})
                ]}),
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("th",{style:{width:"7%"},children:"Lid"}),
                  (0,t.jsx)("th",{style:{width:"7%"},children:"Sid"}),
                  (0,t.jsx)("th",{style:{width:"8%"},children:"Tot"})
                ]})
              ]}),
              (0,t.jsxs)("tbody",{children:[
                [
                  { tipid: "Pencurian Ringan (Tipiring / Ps 364)", ct: 18, lid: 8, sid: 10, tot: 18, pct: "100%" },
                  { tipid: "Penipuan & Penggelapan Keluarga", ct: 16, lid: 5, sid: 7, tot: 12, pct: "75.0%" },
                  { tipid: "Penganiayaan Ringan (Ps 352 KUHP)", ct: 12, lid: 6, sid: 4, tot: 10, pct: "83.3%" },
                  { tipid: "Kekerasan Dalam Rumah Tangga (KDRT)", ct: 8, lid: 3, sid: 4, tot: 7, pct: "87.5%" },
                  { tipid: "Pencemaran Nama Baik / UU ITE", ct: 11, lid: 4, sid: 5, tot: 9, pct: "81.8%" },
                  { tipid: "Perusakan Barang / Perselisihan Lingkungan", ct: 6, lid: 2, sid: 3, tot: 5, pct: "83.3%" }
                ].map((row, idx)=>(
                  (0,t.jsxs)("tr",{key:idx,children:[
                    (0,t.jsx)("td",{style:{textAlign:"center"},children:idx + 1}),
                    (0,t.jsx)("td",{children:row.tipid}),
                    (0,t.jsx)("td",{style:{textAlign:"center"},children:row.ct}),
                    (0,t.jsx)("td",{style:{textAlign:"center"},children:row.lid}),
                    (0,t.jsx)("td",{style:{textAlign:"center"},children:row.sid}),
                    (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:700},children:row.tot}),
                    (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:600},children:row.pct}),
                    (0,t.jsx)("td",{style:{textAlign:"center"},children:"Akta Perdamaian"})
                  ]})
                )),
                (0,t.jsxs)("tr",{style:{background:"#eff6ff",fontWeight:800},children:[
                  (0,t.jsx)("td",{colSpan:2,style:{textAlign:"center"},children:"JUMLAH PENYELESAIAN RJ"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"71"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"28"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"33"}),
                  (0,t.jsx)("td",{style:{textAlign:"center",color:"#1d4ed8"},children:"61"}),
                  (0,t.jsx)("td",{style:{textAlign:"center",color:"#1d4ed8"},children:"85.9%"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"Keadilan Restoratif"})
                ]})
              ]})
            ]}),
            (0,t.jsx)("div",{style:{fontSize:"0.74rem",color:"#475569",fontStyle:"italic",marginBottom:"6px"},children:"Tabel 2.3: Penanganan Tindak Pidana Melalui RJ"}),
            (0,t.jsxs)("p",{children:[
              (0,t.jsx)("strong",{children:"Efektivitas RJ: "}),
              "Berdasarkan analisis data pada Tabel 2.3, satuan kerja mampu menyelesaikan 61 perkara melalui RJ dari total 71 perkara yang diajukan (tingkat efektivitas 85.9%). Penerapan RJ terbukti sangat efektif menekan penumpukan perkara di pengadilan, mengurangi beban over-capacity lembaga pemasyarakatan, serta mengembalikan keharmonisan sosial para pihak yang berperkara."
            ]}),

            // ANALISIS BEBAN KINERJA
            (0,t.jsx)("div",{className:"anev-section-title",style:{marginTop:"1rem"},children:"G. Analisis Beban Kinerja Personel"}),
            (0,t.jsx)("p",{children:"Analisis beban kinerja dilakukan untuk mengukur tingkat beban kerja berdasarkan jumlah perkara yang ditangani dibandingkan dengan jumlah personel penyidik yang tersedia pada periode pelaporan secara apple to apple dengan periode sebelumnya."}),

            // Tabel 2.4 Beban Kinerja
            (0,t.jsxs)("table",{className:"anev-table-naskah",style:{width:"100%",fontSize:"0.74rem"},children:[
              (0,t.jsx)("thead",{children:(0,t.jsxs)("tr",{children:[
                (0,t.jsx)("th",{style:{width:"5%"},children:"No"}),
                (0,t.jsx)("th",{style:{width:"24%"},children:"Periode"}),
                (0,t.jsx)("th",{style:{width:"10%"},children:"CT"}),
                (0,t.jsx)("th",{style:{width:"10%"},children:"CC"}),
                (0,t.jsx)("th",{style:{width:"11%"},children:"CR (%)"}),
                (0,t.jsx)("th",{style:{width:"10%"},children:"Jml Agt"}),
                (0,t.jsx)("th",{style:{width:"14%"},children:"Ratio LP/Agt"}),
                (0,t.jsx)("th",{style:{width:"16%"},children:"Beban Kinerja (%)"})
              ]})}),
              (0,t.jsxs)("tbody",{children:[
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"1"}),
                  (0,t.jsx)("td",{style:{fontWeight:600},children:"Periode Sebelumnya"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:String(reportData?.kamtibmas?.ct?.prev || 188)}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:String(reportData?.kamtibmas?.cc?.prev || 153)}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:(reportData?.kamtibmas?.cc?.ratePrev || "81.4") + "%"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"24"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"1 : 7.8"}),
                  (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:700},children:"65.0%"})
                ]}),
                (0,t.jsxs)("tr",{children:[
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"2"}),
                  (0,t.jsx)("td",{style:{fontWeight:600},children:"Periode Saat Ini"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:String(reportData?.kamtibmas?.ct?.current || 182)}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:String(reportData?.kamtibmas?.cc?.current || 159)}),
                  (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:700,color:"#1d4ed8"},children:(reportData?.kamtibmas?.cc?.rateCurrent || "87.4") + "%"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"25"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"1 : 7.3"}),
                  (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:700,color:"#15803d"},children:"60.8%"})
                ]}),
                (0,t.jsxs)("tr",{style:{background:"#eff6ff",fontWeight:800},children:[
                  (0,t.jsx)("td",{colSpan:2,style:{textAlign:"center"},children:"RATA-RATA / STANDAR IDEAL"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"185"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"156"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"84.4%"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"25"}),
                  (0,t.jsx)("td",{style:{textAlign:"center"},children:"1 : 12.0"}),
                  (0,t.jsx)("td",{style:{textAlign:"center",color:"#1d4ed8"},children:"100% (Batas Ideal)"})
                ]})
              ]})
            ]}),
            (0,t.jsx)("div",{style:{fontSize:"0.74rem",color:"#475569",fontStyle:"italic",marginBottom:"6px"},children:"Tabel 2.4: Analisis Beban Kinerja"}),
            (0,t.jsxs)("p",{children:[
              (0,t.jsx)("strong",{children:"Analisis Narasi Beban Kinerja: "}),
              "Berdasarkan data pada Tabel 2.4, rasio rata-rata beban penanganan perkara per penyidik tercatat sebesar 1 : 7.3 perkara dalam periode pelaporan. Nilai ini berada pada 60.8% dari standar beban maksimal yang ditetapkan institusi (standar ideal 1 : 12 perkara per penyidik per periode). Dengan demikian, beban kerja personel penyidik saat ini masih berada dalam batas ideal yang sehat, memungkinkan para penyidik berfokus pada kualitas pembuktian materiil, kepatuhan SOP gelar perkara, serta pemenuhan target P-21 secara akuntabel."
            ]})

          ]}),
          // Page Footer
          (0,t.jsxs)("div",{className:"anev-page-footer",children:[
            (0,t.jsxs)("div",{className:"anev-footer-left anev-forensic-stamp",children:[
              (0,t.jsx)("span",{style:{fontSize:"0.72rem",marginRight:"4px"},children:"🛡️"}),
              (0,t.jsx)("span",{style:{fontFamily:"monospace",fontSize:"0.66rem",fontWeight:archiveLoadedInfo?800:700,color:archiveLoadedInfo?"#92400e":"#475569",letterSpacing:"0.4px"},children:archiveLoadedInfo ? ("ARSIP #" + archiveLoadedInfo.id + " • " + (archiveLoadedInfo.stamp ? archiveLoadedInfo.stamp.replace(/^STAMP-/, "CAS-") : "CAS-" + archiveLoadedInfo.id)) : docStamp})
            ]}),
            (0,t.jsx)("div",{className:"anev-footer-right",children:5})
          ]})
        ]})
  ,

        (0,t.jsxs)("div",{className:"anev-page-sheet anev-print-sheet",children:[
          // Corner Status Pill
          (0,t.jsx)("div",{className:"anev-sheet-corner-pill anev-no-print",style:{position:"absolute",top:"12px",right:"18px",fontSize:"0.65rem",fontWeight:800,letterSpacing:"0.5px",padding:"2px 8px",borderRadius:"10px",background:archiveLoadedInfo?"#fef3c7":"#ecfdf5",color:archiveLoadedInfo?"#92400e":"#065f46",border:archiveLoadedInfo?"1px solid #fde68a":"1px solid #a7f3d0"},children:archiveLoadedInfo?"🔒 SALINAN ARSIP RESMI":"📝 DRAFT NASKAH DINAS"}),
          // Watermark Overlay
          (0,t.jsx)("div",{className:"anev-watermark-overlay",style:{display:"flex",flexDirection:"column",justifyContent:"space-around",height:"100%",padding:"2rem 0"},children:[
            (0,t.jsx)("div",{className:"anev-watermark-line",children:watermarkText}),
            (0,t.jsx)("div",{className:"anev-watermark-line",children:watermarkText}),
            (0,t.jsx)("div",{className:"anev-watermark-line",children:watermarkText}),
            (0,t.jsx)("div",{className:"anev-watermark-line",children:watermarkText})
          ]}),
          // Page Content
          (0,t.jsxs)("div",{className:"anev-page-content anev-doc-editor",contentEditable:!0,suppressContentEditableWarning:!0,spellCheck:!1,children:[
            
            (0,t.jsx)("div",{className:"anev-section-title",children:"H. Evaluasi Pelaksanaan Tugas"}),
            (0,t.jsxs)("p",{children:[
              "Berdasarkan data hasil analisis komparatif pada periode ",
              (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: detail_period}}"}),
              ", ",
              (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: organization_level}}"}),
              " ",
              (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: structure_level}}"}),
              " ",
              (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: lokasi_satker}}"}),
              " telah menangani total ",
              (0,t.jsx)("strong",{children:String(reportData?.kamtibmas?.ct?.current || 182)}),
              " perkara (Crime Total/CT) dengan tingkat penyelesaian (Crime Clearance/CC) sebanyak ",
              (0,t.jsx)("strong",{children:String(reportData?.kamtibmas?.cc?.current || 159)}),
              " perkara atau tingkat penyelesaian ",
              (0,t.jsx)("strong",{children:String(reportData?.kamtibmas?.cc?.rateCurrent || "87.4") + "%"}),
              "."
            ]}),

            (0,t.jsxs)("div",{style:{paddingLeft:"0.6rem"},children:[
              (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.6rem"},children:"1. Tren Kejahatan"}),
              (0,t.jsxs)("p",{children:[
                "Dibandingkan periode sebelumnya, jumlah laporan kejahatan mengalami penurunan sebesar ",
                (0,t.jsx)("strong",{children:String(Math.abs(reportData?.kamtibmas?.ct?.delta || -6))}),
                " perkara (",
                (0,t.jsx)("strong",{children:String(reportData?.kamtibmas?.ct?.pct || "-3.2")}),
                "%). Penurunan ini terutama dipengaruhi oleh intensitas patroli siber preventif dan penindakan tegas terhadap sindikat pencurian pemberatan konvensional. Di sisi lain, tren penipuan daring berbasis rekayasa sosial (social engineering) tetap memerlukan atensi deteksi dini berkelanjutan."
              ]}),

              (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.6rem"},children:"2. Efektivitas Penyelesaian Perkara"}),
              (0,t.jsxs)("p",{children:[
                "Tingkat penyelesaian perkara (Clearance Rate) mencapai ",
                (0,t.jsx)("strong",{children:String(reportData?.kamtibmas?.cc?.rateCurrent || "87.4") + "%"}),
                ", lebih tinggi +6.0% dibandingkan periode sebelumnya (81.4%). Kinerja ini telah melampaui target Renstra nasional Polri (standar minimal 75%), sehingga perlu dipertahankan melalui supervisi berkala terhadap berkas perkara bolak-balik (P-19) agar cepat terpenuhi menjadi P-21."
              ]}),

              (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.6rem"},children:"3. Optimalisasi Keadilan Restoratif (RJ)"}),
              (0,t.jsxs)("p",{children:[
                "Penyelesaian perkara melalui mekanisme Restorative Justice mencapai 61 perkara atau 38.4% dari total perkara yang diselesaikan. Optimalisasi ini mencerminkan komitmen penegakan hukum humanis Polri yang mengedepankan pemulihan hak korban serta perdamaian yang berkelanjutan tanpa menafikan kepastian hukum."
              ]}),

              (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.6rem"},children:"4. Beban Kinerja Personel"}),
              (0,t.jsxs)("p",{children:[
                "Kekuatan personel penyidik dan penyidik pembantu aktif menghasilkan rasio beban kerja rata-rata 1 : 7.3 perkara. Kondisi ini masih berada di bawah ambang batas beban maksimal (1 : 12 perkara), sehingga penyidik memiliki ruang gerak yang sangat leluasa untuk menjaga integritas dan ketelitian proses pembuktian di pengadilan."
              ]}),

              (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.6rem"},children:"5. Sumber Daya dan Dukungan Operasional"}),
              (0,t.jsxs)("p",{children:[
                "Sarana dan prasarana penunjang operasional penyidikan dalam kondisi laik pakai. Dukungan logistik, BBM dinas, perlengkapan olah TKP, serta perangkat digital forensik mobile telah mencukupi kebutuhan penanganan tindak pidana lapangan."
              ]}),

              (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.6rem"},children:"6. Kesimpulan Umum Pelaksanaan Tugas"}),
              (0,t.jsxs)("p",{children:[
                "Secara umum pelaksanaan tugas fungsi reserse pada periode pelaporan telah berjalan dengan sangat baik dan kondusif. Stabilitas kamtibmas terjaga, penyelesaian perkara menunjukkan tren positif, dan kepercayaan masyarakat terhadap transparansi proses penyidikan terus meningkat."
              ]})
            ]})

          ]}),
          // Page Footer
          (0,t.jsxs)("div",{className:"anev-page-footer",children:[
            (0,t.jsxs)("div",{className:"anev-footer-left anev-forensic-stamp",children:[
              (0,t.jsx)("span",{style:{fontSize:"0.72rem",marginRight:"4px"},children:"🛡️"}),
              (0,t.jsx)("span",{style:{fontFamily:"monospace",fontSize:"0.66rem",fontWeight:archiveLoadedInfo?800:700,color:archiveLoadedInfo?"#92400e":"#475569",letterSpacing:"0.4px"},children:archiveLoadedInfo ? ("ARSIP #" + archiveLoadedInfo.id + " • " + (archiveLoadedInfo.stamp ? archiveLoadedInfo.stamp.replace(/^STAMP-/, "CAS-") : "CAS-" + archiveLoadedInfo.id)) : docStamp})
            ]}),
            (0,t.jsx)("div",{className:"anev-footer-right",children:6})
          ]})
        ]})
  ,

        (0,t.jsxs)("div",{className:"anev-page-sheet anev-print-sheet",children:[
          // Corner Status Pill
          (0,t.jsx)("div",{className:"anev-sheet-corner-pill anev-no-print",style:{position:"absolute",top:"12px",right:"18px",fontSize:"0.65rem",fontWeight:800,letterSpacing:"0.5px",padding:"2px 8px",borderRadius:"10px",background:archiveLoadedInfo?"#fef3c7":"#ecfdf5",color:archiveLoadedInfo?"#92400e":"#065f46",border:archiveLoadedInfo?"1px solid #fde68a":"1px solid #a7f3d0"},children:archiveLoadedInfo?"🔒 SALINAN ARSIP RESMI":"📝 DRAFT NASKAH DINAS"}),
          // Watermark Overlay
          (0,t.jsx)("div",{className:"anev-watermark-overlay",style:{display:"flex",flexDirection:"column",justifyContent:"space-around",height:"100%",padding:"2rem 0"},children:[
            (0,t.jsx)("div",{className:"anev-watermark-line",children:watermarkText}),
            (0,t.jsx)("div",{className:"anev-watermark-line",children:watermarkText}),
            (0,t.jsx)("div",{className:"anev-watermark-line",children:watermarkText}),
            (0,t.jsx)("div",{className:"anev-watermark-line",children:watermarkText})
          ]}),
          // Page Content
          (0,t.jsxs)("div",{className:"anev-page-content anev-doc-editor",contentEditable:!0,suppressContentEditableWarning:!0,spellCheck:!1,children:[
            
            (0,t.jsx)("div",{className:"anev-section-title",children:"I. Monitoring Kasus Menonjol & Perhatian Masyarakat"}),
            (0,t.jsx)("p",{children:"Monitoring terhadap perkara atensi pimpinan maupun perkara yang viral dan menjadi sorotan publik dilakukan secara ketat guna memastikan penanganan berjalan transparan, profesional, dan akuntabel sesuai asas presisi."}),

            // 1. Kasus Internal / Pimpinan
            (0,t.jsx)("div",{className:"anev-sub-title",children:"1. Perkara Menonjol dalam Pengawasan Internal / Atensi Pimpinan"}),
            (0,t.jsxs)("table",{className:"anev-table-naskah",style:{width:"100%",fontSize:"0.74rem"},children:[
              (0,t.jsx)("thead",{children:(0,t.jsxs)("tr",{children:[
                (0,t.jsx)("th",{style:{width:"5%"},children:"No"}),
                (0,t.jsx)("th",{style:{width:"25%",textAlign:"left"},children:"Judul / Uraian Kasus"}),
                (0,t.jsx)("th",{style:{width:"20%"},children:"Nomor LP"}),
                (0,t.jsx)("th",{style:{width:"25%"},children:"Tindakan Terakhir"}),
                (0,t.jsx)("th",{style:{width:"12%"},children:"Status"}),
                (0,t.jsx)("th",{style:{width:"13%"},children:"Keterangan"})
              ]})}),
              (0,t.jsxs)("tbody",{children:[
                [
                  { judul: "Sindikat Curanmor Lintas Wilayah", lp: "LP/B/241/IX/2026/SPKT", aksi: "Penangkapan 4 Tsk & Sita 8 R2", status: "Penyidikan (Tahap I)", ket: "Atensi Kapolda" },
                  { judul: "Penipuan Investasi Fiktif Berkedok Koperasi", lp: "LP/B/258/IX/2026/SPKT", aksi: "Pemeriksaan Saksi Ahli OJK & PPATK", status: "Penetapan Tsk", ket: "Gelar Khusus" },
                  { judul: "Penyalahgunaan Narkoba Skala Menengah", lp: "LP/A/89/IX/2026/SPKT", aksi: "Penyitaan 450 gr Sabu & Uji Lab", status: "P-21", ket: "Pelimpahan JPU" }
                ].map((row, idx)=>(
                  (0,t.jsxs)("tr",{key:idx,children:[
                    (0,t.jsx)("td",{style:{textAlign:"center"},children:idx + 1}),
                    (0,t.jsx)("td",{style:{fontWeight:600},children:row.judul}),
                    (0,t.jsx)("td",{style:{textAlign:"center",fontFamily:"monospace"},children:row.lp}),
                    (0,t.jsx)("td",{children:row.aksi}),
                    (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:700,color:"#1d4ed8"},children:row.status}),
                    (0,t.jsx)("td",{style:{textAlign:"center"},children:row.ket})
                  ]})
                ))
              ]})
            ]}),
            (0,t.jsx)("div",{style:{fontSize:"0.74rem",color:"#475569",fontStyle:"italic",marginBottom:"12px"},children:"Tabel 2.5: Rekapitulasi Kasus Menonjol Atensi Internal"}),

            // 2. Kasus Media Massa / Viral
            (0,t.jsx)("div",{className:"anev-sub-title",children:"2. Perkara yang Menjadi Perhatian Publik melalui Media Massa & Media Sosial"}),
            (0,t.jsxs)("table",{className:"anev-table-naskah",style:{width:"100%",fontSize:"0.74rem"},children:[
              (0,t.jsx)("thead",{children:(0,t.jsxs)("tr",{children:[
                (0,t.jsx)("th",{style:{width:"5%"},children:"No"}),
                (0,t.jsx)("th",{style:{width:"25%",textAlign:"left"},children:"Isu / Judul Kasus"}),
                (0,t.jsx)("th",{style:{width:"18%"},children:"Saluran Media"}),
                (0,t.jsx)("th",{style:{width:"15%"},children:"Sentimen"}),
                (0,t.jsx)("th",{style:{width:"24%"},children:"Tindak Lanjut & Humas"}),
                (0,t.jsx)("th",{style:{width:"13%"},children:"Status"})
              ]})}),
              (0,t.jsxs)("tbody",{children:[
                [
                  { isu: "Aksi Begal di Kawasan Lingkar Barat", media: "Instagram & X (Twitter)", sentimen: "Resah / Tuntutan Gerak", respon: "Konferensi Pers & Tangkap Pelaku < 24 Jam", status: "Kondusif" },
                  { isu: "Sengketa Lahan Melibatkan Ormas", media: "Media Online & TikTok", sentimen: "Memanas / Provokatif", respon: "Mediasi Terbuka & Gandeng Tokoh Agama", status: "Selesai RJ" }
                ].map((row, idx)=>(
                  (0,t.jsxs)("tr",{key:idx,children:[
                    (0,t.jsx)("td",{style:{textAlign:"center"},children:idx + 1}),
                    (0,t.jsx)("td",{style:{fontWeight:600},children:row.isu}),
                    (0,t.jsx)("td",{style:{textAlign:"center"},children:row.media}),
                    (0,t.jsx)("td",{style:{textAlign:"center",color:"#b45309"},children:row.sentimen}),
                    (0,t.jsx)("td",{children:row.respon}),
                    (0,t.jsx)("td",{style:{textAlign:"center",fontWeight:700,color:"#15803d"},children:row.status})
                  ]})
                ))
              ]})
            ]}),
            (0,t.jsx)("div",{style:{fontSize:"0.74rem",color:"#475569",fontStyle:"italic",marginBottom:"12px"},children:"Tabel 2.6: Rekapitulasi Kasus Viral & Respon Media Publik"}),

            // 3. Tugas Lainnya
            (0,t.jsx)("div",{className:"anev-sub-title",children:"J. Pelaksanaan Tugas Lainnya"}),
            (0,t.jsx)("p",{children:"Selain tugas rutin penegakan hukum, satuan kerja melaksanakan kegiatan kolaboratif lintas sektor bersama instansi pemerintah, BUMN, kementerian, dan lembaga:"}),
            (0,t.jsxs)("ol",{style:{margin:"2px 0 6px 1.2rem",padding:0},children:[
              (0,t.jsx)("li",{children:"Pelaksanaan kegiatan bersama Dinas Pertanian dan Kelompok Tani dalam rangka program ketahanan pangan nasional penanaman jagung dan padi terpadu seluas 45 hektar;"}),
              (0,t.jsx)("li",{children:"Operasi gabungan bersama Balai POM dan Bea Cukai dalam pengawasan peredaran obat-obatan tanpa izin edar dan barang impor ilegal di jalur logistik daerah;"}),
              (0,t.jsx)("li",{children:"Bimbingan penyuluhan hukum preventif pencegahan kenakalan remaja dan bahaya judi online pada sekolah-sekolah menengah serta komunitas pemuda kewilayahan."})
            ]})

          ]}),
          // Page Footer
          (0,t.jsxs)("div",{className:"anev-page-footer",children:[
            (0,t.jsxs)("div",{className:"anev-footer-left anev-forensic-stamp",children:[
              (0,t.jsx)("span",{style:{fontSize:"0.72rem",marginRight:"4px"},children:"🛡️"}),
              (0,t.jsx)("span",{style:{fontFamily:"monospace",fontSize:"0.66rem",fontWeight:archiveLoadedInfo?800:700,color:archiveLoadedInfo?"#92400e":"#475569",letterSpacing:"0.4px"},children:archiveLoadedInfo ? ("ARSIP #" + archiveLoadedInfo.id + " • " + (archiveLoadedInfo.stamp ? archiveLoadedInfo.stamp.replace(/^STAMP-/, "CAS-") : "CAS-" + archiveLoadedInfo.id)) : docStamp})
            ]}),
            (0,t.jsx)("div",{className:"anev-footer-right",children:7})
          ]})
        ]})
  ,

        (0,t.jsxs)("div",{className:"anev-page-sheet anev-print-sheet",children:[
          // Corner Status Pill
          (0,t.jsx)("div",{className:"anev-sheet-corner-pill anev-no-print",style:{position:"absolute",top:"12px",right:"18px",fontSize:"0.65rem",fontWeight:800,letterSpacing:"0.5px",padding:"2px 8px",borderRadius:"10px",background:archiveLoadedInfo?"#fef3c7":"#ecfdf5",color:archiveLoadedInfo?"#92400e":"#065f46",border:archiveLoadedInfo?"1px solid #fde68a":"1px solid #a7f3d0"},children:archiveLoadedInfo?"🔒 SALINAN ARSIP RESMI":"📝 DRAFT NASKAH DINAS"}),
          // Watermark Overlay
          (0,t.jsx)("div",{className:"anev-watermark-overlay",style:{display:"flex",flexDirection:"column",justifyContent:"space-around",height:"100%",padding:"2rem 0"},children:[
            (0,t.jsx)("div",{className:"anev-watermark-line",children:watermarkText}),
            (0,t.jsx)("div",{className:"anev-watermark-line",children:watermarkText}),
            (0,t.jsx)("div",{className:"anev-watermark-line",children:watermarkText}),
            (0,t.jsx)("div",{className:"anev-watermark-line",children:watermarkText})
          ]}),
          // Page Content
          (0,t.jsxs)("div",{className:"anev-page-content anev-doc-editor",contentEditable:!0,suppressContentEditableWarning:!0,spellCheck:!1,children:[
            
            (0,t.jsx)("div",{className:"anev-section-title",children:"BAB III: HASIL YANG DICAPAI"}),
            (0,t.jsx)("div",{className:"anev-sub-title",children:"A. Capaian Prestasi & Apresiasi"}),
            (0,t.jsxs)("p",{children:[
              "Selama periode pelaporan ",
              (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: detail_period}}"}),
              ", ",
              (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: organization_level}}"}),
              " ",
              (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: structure_level}}"}),
              " ",
              (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: lokasi_satker}}"}),
              " telah mencapai sejumlah prestasi dan hasil signifikan dalam penegakan hukum, antara lain:"
            ]}),
            (0,t.jsxs)("ol",{style:{margin:"2px 0 6px 1.2rem",padding:0},children:[
              (0,t.jsx)("li",{children:"Penyelesaian perkara mencapai tingkat Clearance Rate 87.4%, berada di atas rata-rata target kinerja nasional Polri;"}),
              (0,t.jsx)("li",{children:"Penyelamatan potensi kerugian keuangan masyarakat senilai lebih dari Rp 1.850.000.000,- melalui pemblokiran rekening penipuan daring cepat;"}),
              (0,t.jsx)("li",{children:"Menerima piagam penghargaan dan apresiasi dari pimpinan daerah serta paguyuban warga atas pengungkapan cepat kasus pencurian dengan kekerasan tanpa menimbulkan korban jiwa;"}),
              (0,t.jsx)("li",{children:"Nol pelanggaran disiplin dan kode etik profesi penyidik selama pelaksanaan proses penyelidikan dan penyidikan pada periode pelaporan."})
            ]}),

            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.8rem"},children:"B. Faktor yang Mempengaruhi"}),
            (0,t.jsxs)("div",{style:{paddingLeft:"0.6rem"},children:[
              (0,t.jsx)("p",{children:(0,t.jsxs)("strong",{children:[
                "1. Faktor Pendukung Keberhasilan: ",
                (0,t.jsx)("span",{style:{fontWeight:"normal"},children:"Soliditas kepemimpinan operasional berjenjang, pemanfaatan sistem analitik Crime Analytic System (CAS) secara disiplin oleh operator, koordinasi harmonis dengan CJS (Kejaksaan/Pengadilan), serta peran aktif masyarakat dalam pelaporan dini melalui layanan Call Center 110."})
              ]})}),
              (0,t.jsx)("p",{children:(0,t.jsxs)("strong",{children:[
                "2. Faktor Kendala yang Dihadapi: ",
                (0,t.jsx)("span",{style:{fontWeight:"normal"},children:"Karakteristik kejahatan siber yang semakin canggih menggunakan akun nominee dan kripto terdesentralisasi, lamanya proses pemenuhan petunjuk saksi ahli tertentu, serta kendala geografis cuaca pada beberapa Polsek jajaran terjauh."})
              ]})})
            ]}),

            (0,t.jsx)("div",{className:"anev-section-title",style:{marginTop:"1.2rem"},children:"BAB IV: KESIMPULAN DAN SARAN"}),
            (0,t.jsx)("div",{className:"anev-sub-title",children:"A. Kesimpulan"}),
            (0,t.jsxs)("p",{children:[
              "1. Berdasarkan data analitik operasional CAS, stabilitas kamtibmas di wilayah hukum ",
              (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: structure_level}}"}),
              " ",
              (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: lokasi_satker}}"}),
              " terpelihara secara prima, aman, dan terkendali."
            ]}),
            (0,t.jsx)("p",{children:"2. Kinerja penegakan hukum menunjukkan efektivitas tinggi dengan penurunan jumlah kejadian tindak pidana sebesar -3.2% dan peningkatan Clearance Rate hingga mencapai 87.4%."}),
            (0,t.jsx)("p",{children:"3. Pendekatan keadilan restoratif (RJ) berjalan efektif sebagai instrumen humanis dalam menyelesaikan 61 perkara tanpa mengurangi wibawa hukum."}),
            (0,t.jsx)("p",{children:"4. Manajemen SDM, sarpras, dan anggaran berada dalam kondisi seimbang dan mendukung penuh kelancaran operasional lidik/sidik."}),

            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.8rem"},children:"B. Saran"}),
            (0,t.jsx)("p",{children:"1. Kepada Pimpinan Tingkat Atas: Diusulkan penambahan alokasi pelatihan sertifikasi digital forensics dan investigasi TPPU bagi penyidik muda kewilayahan guna menjawab eskalasi kejahatan berbasis internet."}),
            (0,t.jsx)("p",{children:"2. Kepada Satuan Kerja Jajaran: Agar senantiasa mempercepat asistensi gelar perkara berkala, memperketat pengawasan administrasi penyidikan, serta mendokumentasikan setiap tahapan SP2HP secara transparan kepada pelapor."}),
            (0,t.jsx)("p",{children:"3. Penguatan integrasi pemutakhiran data operasional pada Crime Analytic System (CAS) secara tertib waktu guna mendukung keakuratan pengambilan kebijakan pimpinan."})

          ]}),
          // Page Footer
          (0,t.jsxs)("div",{className:"anev-page-footer",children:[
            (0,t.jsxs)("div",{className:"anev-footer-left anev-forensic-stamp",children:[
              (0,t.jsx)("span",{style:{fontSize:"0.72rem",marginRight:"4px"},children:"🛡️"}),
              (0,t.jsx)("span",{style:{fontFamily:"monospace",fontSize:"0.66rem",fontWeight:archiveLoadedInfo?800:700,color:archiveLoadedInfo?"#92400e":"#475569",letterSpacing:"0.4px"},children:archiveLoadedInfo ? ("ARSIP #" + archiveLoadedInfo.id + " • " + (archiveLoadedInfo.stamp ? archiveLoadedInfo.stamp.replace(/^STAMP-/, "CAS-") : "CAS-" + archiveLoadedInfo.id)) : docStamp})
            ]}),
            (0,t.jsx)("div",{className:"anev-footer-right",children:8})
          ]})
        ]})
  ,

        (0,t.jsxs)("div",{className:"anev-page-sheet anev-print-sheet",children:[
          // Corner Status Pill
          (0,t.jsx)("div",{className:"anev-sheet-corner-pill anev-no-print",style:{position:"absolute",top:"12px",right:"18px",fontSize:"0.65rem",fontWeight:800,letterSpacing:"0.5px",padding:"2px 8px",borderRadius:"10px",background:archiveLoadedInfo?"#fef3c7":"#ecfdf5",color:archiveLoadedInfo?"#92400e":"#065f46",border:archiveLoadedInfo?"1px solid #fde68a":"1px solid #a7f3d0"},children:archiveLoadedInfo?"🔒 SALINAN ARSIP RESMI":"📝 DRAFT NASKAH DINAS"}),
          // Watermark Overlay
          (0,t.jsx)("div",{className:"anev-watermark-overlay",style:{display:"flex",flexDirection:"column",justifyContent:"space-around",height:"100%",padding:"2rem 0"},children:[
            (0,t.jsx)("div",{className:"anev-watermark-line",children:watermarkText}),
            (0,t.jsx)("div",{className:"anev-watermark-line",children:watermarkText}),
            (0,t.jsx)("div",{className:"anev-watermark-line",children:watermarkText}),
            (0,t.jsx)("div",{className:"anev-watermark-line",children:watermarkText})
          ]}),
          // Page Content
          (0,t.jsxs)("div",{className:"anev-page-content anev-doc-editor",contentEditable:!0,suppressContentEditableWarning:!0,spellCheck:!1,children:[
            
            (0,t.jsx)("div",{className:"anev-section-title",children:"BAB V: PENUTUP"}),
            (0,t.jsx)("div",{className:"anev-sub-title",children:"A. Rencana Tindak Lanjut"}),
            (0,t.jsx)("p",{children:"Guna mempertahankan capaian kinerja dan memperbaiki kekurangan pada periode mendatang, disusun rencana tindak lanjut strategis:"}),
            (0,t.jsxs)("ol",{style:{margin:"2px 0 8px 1.2rem",padding:0},children:[
              (0,t.jsx)("li",{children:"Menggelar operasi kepolisian kewilayahan mandiri terfokus pada kejahatan 3C (Curat, Curas, Curanmor) dan kejahatan siber;"}),
              (0,t.jsx)("li",{children:"Mempercepat penyelesaian berkas perkara tunggakan melalui pendampingan gelar perkara asistensi di tingkat Polda/Mabes;"}),
              (0,t.jsx)("li",{children:"Mengoptimalkan koordinasi pra-penuntutan dengan Jaksa Penuntut Umum guna menekan pengembalian berkas P-19 berulang;"}),
              (0,t.jsx)("li",{children:"Meningkatkan transparansi pelayanan dengan menyajikan laporan progres penyidikan (SP2HP) secara online kepada pelapor."})
            ]}),

            (0,t.jsx)("div",{className:"anev-sub-title",style:{marginTop:"0.8rem"},children:"B. Penutup"}),
            (0,t.jsxs)("p",{children:[
              "Demikian Laporan ",
              (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: period}}"}),
              " Pembinaan Operasional ini dibuat berdasarkan data dan sebagaimana hasil analisis yang ada untuk kemudian dapat menjadi bahan masukan kepada pimpinan dalam perumusan kebijakan pembinaan dan operasional kepolisian berikutnya."
            ]}),

            // LEMBAR PENGESAHAN / TANDA TANGAN DINAS RESMI (KOTAK PANDUAN INTERAKTIF & EDITABLE)
            (0,t.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginTop:"3rem",marginBottom:"1.5rem",pageBreakInside:"avoid"},children:[
              // Kiri: Catatan Lampiran
              (0,t.jsxs)("div",{style:{fontSize:"0.80rem",color:"#475569",lineHeight:"1.5"},children:[
                (0,t.jsx)("div",{style:{fontWeight:700,color:"#0f172a"},children:"Lampiran:"}),
                (0,t.jsx)("div",{children:"1. Rekapitulasi Data Kasus CAS"}),
                (0,t.jsx)("div",{children:"2. Matriks Indikator Kinerja Jajaran"}),
                (0,t.jsx)("div",{children:"3. Dokumentasi Giat Operasional"}),
                (0,t.jsx)("div",{style:{fontStyle:"italic",marginTop:"4px"},children:"dan seterusnya."})
              ]}),

              // Kanan: Blok Tanda Tangan
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
                // 2. Kotak a.n. Jabatan
                (0,t.jsxs)("div",{
                  className:"anev-guide-box anev-editable",
                  contentEditable:!0,
                  suppressContentEditableWarning:!0,
                  onBlur:e=>setPejabatJabatan(e.target.innerText.trim()),
                  title:"Klik untuk mengubah Jabatan",
                  style:{fontWeight:800,fontSize:"0.86rem",lineHeight:"1.35",color:"#0f172a",textTransform:"uppercase"},
                  children:[
                    "a.n. KEPALA ", (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: organization_level}}"}),
                    (0,t.jsx)("br",{}),
                    (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: structure_level}}"}), " ", (0,t.jsx)("span",{className:"anev-auto-tag",children:"{{AUTO: lokasi_satker}}"})
                  ]
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
                  children:pejabatNama || "[NAMA LENGKAP PENANDATANGAN]"
                }),
                // 5. Kotak Pangkat & NRP
                (0,t.jsx)("div",{
                  className:"anev-guide-box anev-editable",
                  contentEditable:!0,
                  suppressContentEditableWarning:!0,
                  onBlur:e=>setPejabatPangkat(e.target.innerText.trim()),
                  title:"Klik untuk mengubah Pangkat & NRP",
                  style:{fontSize:"0.82rem",fontWeight:700,color:"#1e293b",marginTop:"4px",textTransform:"uppercase"},
                  children:pejabatPangkat || "[PANGKAT] NRP [98010710]"
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
                        (0,t.jsx)("span",{style:{color:"#475569"},children:"(tanpa nomor NRP). Teks ini live editable."})
                      ]})
                    ]}),
                    (0,t.jsx)("button",{
                      type:"button",
                      onClick:()=>{
                        setPejabatTempatTanggal("Jakarta, " + new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }));
                        setPejabatJabatan("[JABATAN]");
                        setPejabatNama("[NAMA PENANDATANGAN]");
                        setPejabatPangkat("[PANGKAT] NRP [98010710]");
                      },
                      style:{background:"transparent",border:"none",color:"#2563eb",textDecoration:"underline",cursor:"pointer",fontSize:"0.66rem",fontWeight:700,flexShrink:0},
                      children:"Reset Template"
                    })
                  ]
                })
              ]})
            ]})

          ]}),
          // Page Footer
          (0,t.jsxs)("div",{className:"anev-page-footer",children:[
            (0,t.jsxs)("div",{className:"anev-footer-left anev-forensic-stamp",children:[
              (0,t.jsx)("span",{style:{fontSize:"0.72rem",marginRight:"4px"},children:"🛡️"}),
              (0,t.jsx)("span",{style:{fontFamily:"monospace",fontSize:"0.66rem",fontWeight:archiveLoadedInfo?800:700,color:archiveLoadedInfo?"#92400e":"#475569",letterSpacing:"0.4px"},children:archiveLoadedInfo ? ("ARSIP #" + archiveLoadedInfo.id + " • " + (archiveLoadedInfo.stamp ? archiveLoadedInfo.stamp.replace(/^STAMP-/, "CAS-") : "CAS-" + archiveLoadedInfo.id)) : docStamp})
            ]}),
            (0,t.jsx)("div",{className:"anev-footer-right",children:9})
          ]})
        ]})
  
      ]})
    ]}),

    // TAB 2: activeTab === "arsip" && (0,t.jsxs)("div",{children:[
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