(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,38644,e=>{"use strict";var t=e.i(71645),n=e.i(48264),r=e.i(43456),i=e.i(29168),s=e.i(40623),o=e.i(73193),a=e.i(64952);function l(){return(l=Object.assign.bind()).apply(null,arguments)}function u(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function c(e,t){if(e){if("string"==typeof e)return u(e,t);var n=({}).toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?u(e,t):void 0}}function d(e){return function(e){if(Array.isArray(e))return u(e)}(e)||function(e){if("u">typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||c(e)||function(){throw TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function p(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"u">typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var r,i,s,o,a=[],l=!0,u=!1;try{if(s=(n=n.call(e)).next,0===t){if(Object(n)!==n)return;l=!1}else for(;!(l=(r=s.call(n)).done)&&(a.push(r.value),a.length!==t);l=!0);}catch(e){u=!0,i=e}finally{try{if(!l&&null!=n.return&&(o=n.return(),Object(o)!==o))return}finally{if(u)throw i}}return a}}(e,t)||c(e,t)||function(){throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var h=r.ComponentBase.extend({defaultProps:{__TYPE:"SelectButton",id:null,value:null,options:null,optionLabel:null,optionValue:null,optionDisabled:null,tabIndex:null,multiple:!1,invalid:!1,unselectable:!0,allowEmpty:!0,disabled:!1,style:null,className:null,dataKey:null,tooltip:null,tooltipOptions:null,itemTemplate:null,onChange:null,children:void 0},css:{classes:{root:function(e){var t=e.props;return(0,o.classNames)("p-selectbutton p-button-group p-component",{"p-invalid":t.invalid})},button:function(e){var t=e.itemProps,n=e.focusedState;return(0,o.classNames)("p-button p-component",{"p-highlight":t.selected,"p-disabled":t.disabled,"p-focus":n})},label:"p-button-label p-c"}}}),f=t.memo(function(e){var n,r=p(t.useState(!1),2),s=r[0],l=r[1],u=(0,i.useMergeProps)(),c=e.ptm,d=e.cx,h=function(t){return c(t,{hostName:e.hostName,context:{selected:e.selected,disabled:e.disabled,option:e.option}})},f=function(t,n){e.setFocusedIndex(n),e.onClick&&e.onClick({originalEvent:t,option:e.option})},m=function(e,t){switch(e.code){case"Space":f(e,t),e.preventDefault();break;case"ArrowDown":case"ArrowRight":v(e,"next"),e.preventDefault();break;case"ArrowUp":case"ArrowLeft":v(e,"prev"),e.preventDefault()}},v=function(t,n){for(var r,i,s=0;s<=e.elementRef.current.children.length-1;s++)"0"===e.elementRef.current.children[s].getAttribute("tabindex")&&(r={elem:e.elementRef.current.children[s],index:s});i="prev"===n?0===r.index?e.elementRef.current.children.length-1:r.index-1:r.index===e.elementRef.current.children.length-1?0:r.index+1,e.setFocusedIndex(i),e.elementRef.current.children[i].focus()},y=(n=u({className:d("label")},h("label")),e.template?o.ObjectUtils.getJSXElement(e.template,e.option):t.createElement("span",n,e.label)),b=u({className:(0,o.classNames)(e.className,d("button",{itemProps:e,focusedState:s})),role:"button","aria-label":e.label,"aria-pressed":e.selected,onClick:function(t){return f(t,e.index)},onKeyDown:function(t){return m(t,e.index)},tabIndex:e.tabIndex,"aria-disabled":e.disabled,onFocus:function(){l(!0)},onBlur:function(){l(!1)}},h("button"));return t.createElement("div",b,y,!e.disabled&&t.createElement(a.Ripple,null))});f.displayName="SelectButtonItem";var m=t.memo(t.forwardRef(function(e,a){var u=(0,i.useMergeProps)(),c=t.useContext(n.PrimeReactContext),m=h.getProps(e,c),v=p(t.useState(0),2),y=v[0],b=v[1],S=t.useRef(null),g=h.setMetaData({props:m}),_=g.ptm,x=g.cx,j=g.isUnstyled;(0,r.useHandleStyle)(h.css.styles,j,{name:"selectbutton",styled:!0});var w=function(e){if(!(m.disabled||C(e.option))){var t,n=A(e.option);if(!n||m.unselectable&&m.allowEmpty){var r=R(e.option);if(m.multiple){var i=m.value?d(m.value):[];t=n?i.filter(function(e){return!o.ObjectUtils.equals(e,r,m.dataKey)}):[].concat(d(i),[r])}else t=n?null:r;m.onChange&&m.onChange({originalEvent:e.originalEvent,value:t,stopPropagation:function(){e.originalEvent.stopPropagation()},preventDefault:function(){e.originalEvent.preventDefault()},target:{name:m.name,id:m.id,value:t}})}}},R=function(e){return m.optionValue?o.ObjectUtils.resolveFieldData(e,m.optionValue):e&&void 0!==e.value?e.value:e},C=function(e){return m.optionDisabled?o.ObjectUtils.isFunction(m.optionDisabled)?m.optionDisabled(e):o.ObjectUtils.resolveFieldData(e,m.optionDisabled):!!e&&void 0!==e.disabled&&e.disabled},A=function(e){var t=R(e);return m.multiple?!!m.value&&!!m.value.length&&m.value.some(function(e){return o.ObjectUtils.equals(e,t,m.dataKey)}):o.ObjectUtils.equals(m.value,t,m.dataKey)};t.useImperativeHandle(a,function(){return{props:m,focus:function(){return o.DomHandler.focusFirstElement(S.current)},getElement:function(){return S.current}}});var F=o.ObjectUtils.isNotEmpty(m.tooltip),k=m.options&&m.options.length?m.options.map(function(e,n){var r=m.disabled||C(e),i=m.optionLabel?o.ObjectUtils.resolveFieldData(e,m.optionLabel):e&&void 0!==e.label?e.label:e,s=m.disabled||n!==y?"-1":"0",a=A(e);return t.createElement(f,{hostName:"SelectButton",key:i+"_"+n,label:i,className:e.className,option:e,setFocusedIndex:b,onClick:w,template:m.itemTemplate,selected:a,tabIndex:s,index:n,disabled:r,ptm:_,cx:x,elementRef:S})}):null,O=u({ref:S,id:m.id,className:(0,o.classNames)(m.className,x("root")),style:m.style,role:"group"},h.getOtherProps(m),_("root"));return t.createElement(t.Fragment,null,t.createElement("div",O,k,m.children),F&&t.createElement(s.Tooltip,l({target:S,content:m.tooltip,pt:_("tooltip")},m.tooltipOptions)))}));m.displayName="SelectButton",e.s(["SelectButton",0,m])},16015,(e,t,n)=>{},98547,(e,t,n)=>{var r=e.i(47167);e.r(16015);var i=e.r(71645),s=i&&"object"==typeof i&&"default"in i?i:{default:i},o=void 0!==r.default&&r.default.env&&!0,a=function(e){return"[object String]"===Object.prototype.toString.call(e)},l=function(){function e(e){var t=void 0===e?{}:e,n=t.name,r=void 0===n?"stylesheet":n,i=t.optimizeForSpeed,s=void 0===i?o:i;u(a(r),"`name` must be a string"),this._name=r,this._deletedRulePlaceholder="#"+r+"-deleted-rule____{}",u("boolean"==typeof s,"`optimizeForSpeed` must be a boolean"),this._optimizeForSpeed=s,this._serverSheet=void 0,this._tags=[],this._injected=!1,this._rulesCount=0;var l="u">typeof window&&document.querySelector('meta[property="csp-nonce"]');this._nonce=l?l.getAttribute("content"):null}var t,n=e.prototype;return n.setOptimizeForSpeed=function(e){u("boolean"==typeof e,"`setOptimizeForSpeed` accepts a boolean"),u(0===this._rulesCount,"optimizeForSpeed cannot be when rules have already been inserted"),this.flush(),this._optimizeForSpeed=e,this.inject()},n.isOptimizeForSpeed=function(){return this._optimizeForSpeed},n.inject=function(){var e=this;if(u(!this._injected,"sheet already injected"),this._injected=!0,"u">typeof window&&this._optimizeForSpeed){this._tags[0]=this.makeStyleTag(this._name),this._optimizeForSpeed="insertRule"in this.getSheet(),this._optimizeForSpeed||(o||console.warn("StyleSheet: optimizeForSpeed mode not supported falling back to standard mode."),this.flush(),this._injected=!0);return}this._serverSheet={cssRules:[],insertRule:function(t,n){return"number"==typeof n?e._serverSheet.cssRules[n]={cssText:t}:e._serverSheet.cssRules.push({cssText:t}),n},deleteRule:function(t){e._serverSheet.cssRules[t]=null}}},n.getSheetForTag=function(e){if(e.sheet)return e.sheet;for(var t=0;t<document.styleSheets.length;t++)if(document.styleSheets[t].ownerNode===e)return document.styleSheets[t]},n.getSheet=function(){return this.getSheetForTag(this._tags[this._tags.length-1])},n.insertRule=function(e,t){if(u(a(e),"`insertRule` accepts only strings"),"u"<typeof window)return"number"!=typeof t&&(t=this._serverSheet.cssRules.length),this._serverSheet.insertRule(e,t),this._rulesCount++;if(this._optimizeForSpeed){var n=this.getSheet();"number"!=typeof t&&(t=n.cssRules.length);try{n.insertRule(e,t)}catch(t){return o||console.warn("StyleSheet: illegal rule: \n\n"+e+"\n\nSee https://stackoverflow.com/q/20007992 for more info"),-1}}else{var r=this._tags[t];this._tags.push(this.makeStyleTag(this._name,e,r))}return this._rulesCount++},n.replaceRule=function(e,t){if(this._optimizeForSpeed||"u"<typeof window){var n="u">typeof window?this.getSheet():this._serverSheet;if(t.trim()||(t=this._deletedRulePlaceholder),!n.cssRules[e])return e;n.deleteRule(e);try{n.insertRule(t,e)}catch(r){o||console.warn("StyleSheet: illegal rule: \n\n"+t+"\n\nSee https://stackoverflow.com/q/20007992 for more info"),n.insertRule(this._deletedRulePlaceholder,e)}}else{var r=this._tags[e];u(r,"old rule at index `"+e+"` not found"),r.textContent=t}return e},n.deleteRule=function(e){if("u"<typeof window)return void this._serverSheet.deleteRule(e);if(this._optimizeForSpeed)this.replaceRule(e,"");else{var t=this._tags[e];u(t,"rule at index `"+e+"` not found"),t.parentNode.removeChild(t),this._tags[e]=null}},n.flush=function(){this._injected=!1,this._rulesCount=0,"u">typeof window?(this._tags.forEach(function(e){return e&&e.parentNode.removeChild(e)}),this._tags=[]):this._serverSheet.cssRules=[]},n.cssRules=function(){var e=this;return"u"<typeof window?this._serverSheet.cssRules:this._tags.reduce(function(t,n){return n?t=t.concat(Array.prototype.map.call(e.getSheetForTag(n).cssRules,function(t){return t.cssText===e._deletedRulePlaceholder?null:t})):t.push(null),t},[])},n.makeStyleTag=function(e,t,n){t&&u(a(t),"makeStyleTag accepts only strings as second parameter");var r=document.createElement("style");this._nonce&&r.setAttribute("nonce",this._nonce),r.type="text/css",r.setAttribute("data-"+e,""),t&&r.appendChild(document.createTextNode(t));var i=document.head||document.getElementsByTagName("head")[0];return n?i.insertBefore(r,n):i.appendChild(r),r},t=[{key:"length",get:function(){return this._rulesCount}}],function(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}(e.prototype,t),e}();function u(e,t){if(!e)throw Error("StyleSheet: "+t+".")}var c=function(e){for(var t=5381,n=e.length;n;)t=33*t^e.charCodeAt(--n);return t>>>0},d={};function p(e,t){if(!t)return"jsx-"+e;var n=String(t),r=e+n;return d[r]||(d[r]="jsx-"+c(e+"-"+n)),d[r]}function h(e,t){"u"<typeof window&&(t=t.replace(/\/style/gi,"\\/style"));var n=e+t;return d[n]||(d[n]=t.replace(/__jsx-style-dynamic-selector/g,e)),d[n]}var f=function(){function e(e){var t=void 0===e?{}:e,n=t.styleSheet,r=void 0===n?null:n,i=t.optimizeForSpeed,s=void 0!==i&&i;this._sheet=r||new l({name:"styled-jsx",optimizeForSpeed:s}),this._sheet.inject(),r&&"boolean"==typeof s&&(this._sheet.setOptimizeForSpeed(s),this._optimizeForSpeed=this._sheet.isOptimizeForSpeed()),this._fromServer=void 0,this._indices={},this._instancesCounts={}}var t=e.prototype;return t.add=function(e){var t=this;void 0===this._optimizeForSpeed&&(this._optimizeForSpeed=Array.isArray(e.children),this._sheet.setOptimizeForSpeed(this._optimizeForSpeed),this._optimizeForSpeed=this._sheet.isOptimizeForSpeed()),"u">typeof window&&!this._fromServer&&(this._fromServer=this.selectFromServer(),this._instancesCounts=Object.keys(this._fromServer).reduce(function(e,t){return e[t]=0,e},{}));var n=this.getIdAndRules(e),r=n.styleId,i=n.rules;if(r in this._instancesCounts){this._instancesCounts[r]+=1;return}var s=i.map(function(e){return t._sheet.insertRule(e)}).filter(function(e){return -1!==e});this._indices[r]=s,this._instancesCounts[r]=1},t.remove=function(e){var t=this,n=this.getIdAndRules(e).styleId;if(function(e,t){if(!e)throw Error("StyleSheetRegistry: "+t+".")}(n in this._instancesCounts,"styleId: `"+n+"` not found"),this._instancesCounts[n]-=1,this._instancesCounts[n]<1){var r=this._fromServer&&this._fromServer[n];r?(r.parentNode.removeChild(r),delete this._fromServer[n]):(this._indices[n].forEach(function(e){return t._sheet.deleteRule(e)}),delete this._indices[n]),delete this._instancesCounts[n]}},t.update=function(e,t){this.add(t),this.remove(e)},t.flush=function(){this._sheet.flush(),this._sheet.inject(),this._fromServer=void 0,this._indices={},this._instancesCounts={}},t.cssRules=function(){var e=this,t=this._fromServer?Object.keys(this._fromServer).map(function(t){return[t,e._fromServer[t]]}):[],n=this._sheet.cssRules();return t.concat(Object.keys(this._indices).map(function(t){return[t,e._indices[t].map(function(e){return n[e].cssText}).join(e._optimizeForSpeed?"":"\n")]}).filter(function(e){return!!e[1]}))},t.styles=function(e){var t,n;return t=this.cssRules(),void 0===(n=e)&&(n={}),t.map(function(e){var t=e[0],r=e[1];return s.default.createElement("style",{id:"__"+t,key:"__"+t,nonce:n.nonce?n.nonce:void 0,dangerouslySetInnerHTML:{__html:r}})})},t.getIdAndRules=function(e){var t=e.children,n=e.dynamic,r=e.id;if(n){var i=p(r,n);return{styleId:i,rules:Array.isArray(t)?t.map(function(e){return h(i,e)}):[h(i,t)]}}return{styleId:p(r),rules:Array.isArray(t)?t:[t]}},t.selectFromServer=function(){return Array.prototype.slice.call(document.querySelectorAll('[id^="__jsx-"]')).reduce(function(e,t){return e[t.id.slice(2)]=t,e},{})},e}(),m=i.createContext(null);function v(){return new f}function y(){return i.useContext(m)}m.displayName="StyleSheetContext";var b=s.default.useInsertionEffect||s.default.useLayoutEffect,S="u">typeof window?v():void 0;function g(e){var t=S||y();return t&&("u"<typeof window?t.add(e):b(function(){return t.add(e),function(){t.remove(e)}},[e.id,String(e.dynamic)])),null}g.dynamic=function(e){return e.map(function(e){return p(e[0],e[1])}).join(" ")},n.StyleRegistry=function(e){var t=e.registry,n=e.children,r=i.useContext(m),o=i.useState(function(){return r||t||v()})[0];return s.default.createElement(m.Provider,{value:o},n)},n.createStyleRegistry=v,n.style=g,n.useStyleRegistry=y},37902,(e,t,n)=>{t.exports=e.r(98547).style},32115,e=>{"use strict";var a=e.i(43476),i=e.i(71645),t=e.i(44080),l=e.i(53729),m=e.i(54858);e.s(["default",0,function SusopsgasRekapUnifiedPage() {
    var jsx = a.jsx, jsxs = a.jsxs, Fragment = a.Fragment;
    var useState = i.useState, useEffect = i.useEffect, useCallback = i.useCallback, useMemo = i.useMemo;
    var InputText = t.InputText;
    var Tag = l.Tag;
    var apiAuth = m.apiAuth;

    var initTab = (function() {
      try {
        var sp = new URLSearchParams(window.location.search);
        var qTab = String(sp.get("tab") || "").toUpperCase();
        if (["SUSJOL", "SUSATENSI", "OPS_SATGAS", "GABUNGAN"].includes(qTab)) return qTab;
      } catch (e) {}
      return "OPS_SATGAS";
    })();

    var _tab = useState(initTab), activeTab = _tab[0], setActiveTab = _tab[1];

    // Per-tab preserved filters
    var _filters = useState({
      SUSJOL: { search: "", satker: "", from: "", to: "", skala: "ALL", rilis: "ALL", kpi: "semua", viewMode: "table", page: 1, rows: 25 },
      SUSATENSI: { search: "", satker: "", from: "", to: "", level: "ALL", status: "ALL", kpi: "semua", viewMode: "table", page: 1, rows: 25 },
      OPS_SATGAS: { search: "", satker: "", from: "", to: "", jenis: "ALL", status: "ALL", subMode: "KEGIATAN", kpi: "semua", viewMode: "table", page: 1, rows: 25 },
      GABUNGAN: { search: "", satker: "", from: "", to: "", kategori: "ALL", kpi: "semua", viewMode: "table", page: 1, rows: 25 }
    }), tabFilters = _filters[0], setTabFilters = _filters[1];

    function updateFilter(tabKey, patch) {
      setTabFilters(function(prev) {
        var cur = prev[tabKey] || {};
        return Object.assign({}, prev, { [tabKey]: Object.assign({}, cur, patch) });
      });
    }

    // Data states per tab
    var _susjolData = useState([]), susjolData = _susjolData[0], setSusjolData = _susjolData[1];
    var _susjolTotal = useState(0), susjolTotal = _susjolTotal[0], setSusjolTotal = _susjolTotal[1];
    var _susjolSummary = useState(null), susjolSummary = _susjolSummary[0], setSusjolSummary = _susjolSummary[1];
    var _susjolLoading = useState(false), susjolLoading = _susjolLoading[0], setSusjolLoading = _susjolLoading[1];

    var _atensiData = useState([]), atensiData = _atensiData[0], setAtensiData = _atensiData[1];
    var _atensiTotal = useState(0), atensiTotal = _atensiTotal[0], setAtensiTotal = _atensiTotal[1];
    var _atensiSummary = useState(null), atensiSummary = _atensiSummary[0], setAtensiSummary = _atensiSummary[1];
    var _atensiLoading = useState(false), atensiLoading = _atensiLoading[0], setAtensiLoading = _atensiLoading[1];

    var _opsData = useState([]), opsData = _opsData[0], setOpsData = _opsData[1];
    var _opsTotal = useState(0), opsTotal = _opsTotal[0], setOpsTotal = _opsTotal[1];
    var _opsLpRows = useState([]), opsLpRows = _opsLpRows[0], setOpsLpRows = _opsLpRows[1];
    var _opsLpTotal = useState(0), opsLpTotal = _opsLpTotal[0], setOpsLpTotal = _opsLpTotal[1];
    var _opsLoading = useState(false), opsLoading = _opsLoading[0], setOpsLoading = _opsLoading[1];

    var _gabLoading = useState(false), gabLoading = _gabLoading[0], setGabLoading = _gabLoading[1];
    var _gabRows = useState([]), gabRows = _gabRows[0], setGabRows = _gabRows[1];

    // Drilldown Modal State (Kinerja-Perkara-Style LP & Lampiran Drilldown)
    var _drillRow = useState(null), drillRow = _drillRow[0], setDrillRow = _drillRow[1];
    var _drillTab = useState("LP"), drillTab = _drillTab[0], setDrillTab = _drillTab[1];
    var _drillLps = useState([]), drillLps = _drillLps[0], setDrillLps = _drillLps[1];
    var _drillAtts = useState([]), drillAtts = _drillAtts[0], setDrillAtts = _drillAtts[1];
    var _drillLoading = useState(false), drillLoading = _drillLoading[0], setDrillLoading = _drillLoading[1];
    var _drillStatusFilter = useState("ALL"), drillStatusFilter = _drillStatusFilter[0], setDrillStatusFilter = _drillStatusFilter[1];
    var _drillSatkerFilter = useState("ALL"), drillSatkerFilter = _drillSatkerFilter[0], setDrillSatkerFilter = _drillSatkerFilter[1];
    var _drillSearch = useState(""), drillSearch = _drillSearch[0], setDrillSearch = _drillSearch[1];
    var _drillFull = useState(false), drillFull = _drillFull[0], setDrillFull = _drillFull[1];

    // Quick LP Status / Timeline Modal inside Drilldown
    var _lpTimelineModal = useState(null), lpTimelineModal = _lpTimelineModal[0], setLpTimelineModal = _lpTimelineModal[1];
    var _lpTimelineData = useState(null), lpTimelineData = _lpTimelineData[0], setLpTimelineData = _lpTimelineData[1];
    var _lpTimelineLoading = useState(false), lpTimelineLoading = _lpTimelineLoading[0], setLpTimelineLoading = _lpTimelineLoading[1];

    // Quick Sprin Upload Modal inside Drilldown
    var _sprinQuickRow = useState(null), sprinQuickRow = _sprinQuickRow[0], setSprinQuickRow = _sprinQuickRow[1];
    var _sprinNomor = useState(""), sprinNomor = _sprinNomor[0], setSprinNomor = _sprinNomor[1];
    var _sprinTgl = useState(""), sprinTgl = _sprinTgl[0], setSprinTgl = _sprinTgl[1];
    var _sprinCatatan = useState(""), sprinCatatan = _sprinCatatan[0], setSprinCatatan = _sprinCatatan[1];
    var _sprinFiles = useState([]), sprinFiles = _sprinFiles[0], setSprinFiles = _sprinFiles[1];
    var _sprinSaving = useState(false), sprinSaving = _sprinSaving[0], setSprinSaving = _sprinSaving[1];

    // File Preview Modal
    var _previewFile = useState(null), previewFile = _previewFile[0], setPreviewFile = _previewFile[1];

    // Helpers
    function fmtDateId(val) {
      if (!val) return "—";
      var s = String(val).trim().slice(0, 10);
      var m = s.match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/);
      var dt = new Date(m ? (m[3] + "-" + m[2] + "-" + m[1]) : s);
      return isNaN(dt.getTime()) ? s : dt.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
    }

    function inferSatker(row) {
      var st = String(row?.satker_nama || row?.satker_penyelenggara || row?.satker_terkait || row?.unit_nama || "").trim();
      if (st && st !== "-" && st !== "—") return st;
      var lp = String(row?.first_no_laporan || "").toUpperCase();
      if (lp.includes("BARESKRIM")) return "Bareskrim Polri";
      var mPolda = lp.match(/POLDA\s+[A-Z.\s]+?(?=\/|$)/i) || lp.match(/SPKT\/([A-Z0-9.\s]+?)(?=\/|$)/i);
      if (mPolda) return mPolda[0].replace(/^SPKT\//i, "").trim();
      return "Satker Jajaran Polri";
    }

    function classifyLpStatusBucket(lp) {
      var code = String(lp?.status_code || "").toUpperCase().trim();
      var nama = String(lp?.status_nama || "").toUpperCase().trim();
      if (code === "SPDP" || nama.includes("SPDP")) return "SPDP";
      if (code === "TAHAP1" || code === "TAHAP_I" || nama.includes("TAHAP I ") || nama === "TAHAP I" || nama.includes("TAHAP 1") || code === "BERKAS") return "TAHAP1";
      if (code === "P19" || code === "P-19" || nama.includes("P-19") || nama.includes("P19")) return "P19";
      if (code === "P21" || code === "P-21" || nama.includes("P-21") || nama.includes("P21")) return "P21";
      if (code === "TAHAP2" || code === "TAHAP_II" || nama.includes("TAHAP II") || nama.includes("TAHAP 2")) return "TAHAP2";
      if (["SP2LP", "SP2_LIDIK", "SP3", "RJ", "PERMA", "SELESAI", "HENTI"].includes(code) || nama.includes("SP3") || nama.includes("SP2") || nama.includes("RESTORATIVE") || nama.includes("RJ") || nama.includes("HENTI")) return "HENTI_RJ";
      if (code.includes("SIDIK") || nama.includes("SIDIK") || nama.includes("PENYIDIKAN")) return "SIDIK";
      return "LIDIK";
    }

    function getStatusBadgeStyle(bucket) {
      if (bucket === "TAHAP2" || bucket === "P21") return { bg: "rgba(16,185,129,0.14)", border: "rgba(16,185,129,0.4)", color: "#059669" };
      if (bucket === "HENTI_RJ") return { bg: "rgba(139,92,246,0.14)", border: "rgba(139,92,246,0.4)", color: "#6d28d9" };
      if (bucket === "SPDP" || bucket === "TAHAP1" || bucket === "P19") return { bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.4)", color: "#d97706" };
      if (bucket === "SIDIK") return { bg: "rgba(2,132,199,0.14)", border: "rgba(2,132,199,0.38)", color: "#0284c7" };
      return { bg: "rgba(100,116,139,0.14)", border: "rgba(100,116,139,0.35)", color: "#475569" };
    }

    function endpointForRow(row) {
      var kat = String(row?._source_type || row?.kategori || "").toUpperCase();
      if (kat === "ATENSI" || kat === "SUSATENSI") return "/bdb/kasus-atensi";
      if (kat === "OPERASI" || kat === "SATGAS" || kat === "OPS_SATGAS") return "/bdb/operasi-satgas";
      return "/bdb/kasus-menonjol";
    }

    // Fetchers
    var fetchSusjol = useCallback(async function() {
      var f = tabFilters.SUSJOL;
      setSusjolLoading(true);
      try {
        var res = await apiAuth.get("/bdb/kasus-menonjol", {
          params: Object.assign(
            { kategori: "MENONJOL", page: f.page, row: f.rows },
            f.search ? { search: f.search } : {},
            f.satker ? { satker: f.satker } : {},
            f.from ? { from: f.from } : {},
            f.to ? { to: f.to } : {},
            f.skala !== "ALL" ? { skala_viral: f.skala } : {},
            f.rilis !== "ALL" ? { rilis: f.rilis === "YA" ? "1" : "0" } : {}
          )
        });
        var rows = (res.data?.data || []).map(function(r) { return Object.assign({}, r, { _source_type: "SUSJOL", kategori: "MENONJOL" }); });
        setSusjolData(rows);
        setSusjolTotal(Number(res.data?.meta?.total || rows.length));
        if (res.data?.meta?.summary) setSusjolSummary(res.data.meta.summary);
      } catch (e) {
        setSusjolData([]);
        setSusjolTotal(0);
      } finally {
        setSusjolLoading(false);
      }
    }, [tabFilters.SUSJOL]);

    var fetchAtensi = useCallback(async function() {
      var f = tabFilters.SUSATENSI;
      setAtensiLoading(true);
      try {
        var res = await apiAuth.get("/bdb/kasus-atensi", {
          params: Object.assign(
            { page: f.page, row: f.rows },
            f.search ? { search: f.search } : {},
            f.satker ? { satker: f.satker } : {},
            f.from ? { from: f.from } : {},
            f.to ? { to: f.to } : {},
            f.level !== "ALL" ? { level_atensi: f.level } : {},
            f.status !== "ALL" ? { status_atensi: f.status } : {}
          )
        });
        var rows = (res.data?.data || []).map(function(r) { return Object.assign({}, r, { _source_type: "SUSATENSI", kategori: "ATENSI" }); });
        setAtensiData(rows);
        setAtensiTotal(Number(res.data?.meta?.total || rows.length));
        if (res.data?.meta?.summary) setAtensiSummary(res.data.meta.summary);
      } catch (e) {
        setAtensiData([]);
        setAtensiTotal(0);
      } finally {
        setAtensiLoading(false);
      }
    }, [tabFilters.SUSATENSI]);

    var fetchOps = useCallback(async function() {
      var f = tabFilters.OPS_SATGAS;
      setOpsLoading(true);
      try {
        var pCommon = Object.assign(
          { page: f.page, row: f.rows },
          f.search ? { search: f.search } : {},
          f.satker ? { satker: f.satker } : {},
          f.from ? { from: f.from } : {},
          f.to ? { to: f.to } : {},
          f.jenis !== "ALL" ? { jenis: f.jenis } : {},
          f.status !== "ALL" ? { status: f.status } : {}
        );
        var results = await Promise.all([
          apiAuth.get("/bdb/operasi-satgas", { params: pCommon }),
          apiAuth.get("/bdb/operasi-satgas/rekap-lp", { params: pCommon })
        ]);
        var masterRows = (results[0].data?.data || []).map(function(r) {
          return Object.assign({}, r, { _source_type: "OPS_SATGAS", judul: r.nama || r.judul, kategori: r.jenis || "OPERASI" });
        });
        setOpsData(masterRows);
        setOpsTotal(Number(results[0].data?.meta?.total || masterRows.length));
        var lpList = results[1].data?.data || [];
        setOpsLpRows(lpList);
        setOpsLpTotal(Number(results[1].data?.meta?.total || lpList.length));
      } catch (e) {
        setOpsData([]);
        setOpsLpRows([]);
      } finally {
        setOpsLoading(false);
      }
    }, [tabFilters.OPS_SATGAS]);

    var fetchGabungan = useCallback(async function() {
      var f = tabFilters.GABUNGAN;
      setGabLoading(true);
      try {
        var commonParams = Object.assign(
          { page: 1, row: 100 },
          f.search ? { search: f.search } : {},
          f.satker ? { satker: f.satker } : {},
          f.from ? { from: f.from } : {},
          f.to ? { to: f.to } : {}
        );
        var resArr = await Promise.all([
          apiAuth.get("/bdb/kasus-menonjol", { params: Object.assign({ kategori: "MENONJOL" }, commonParams) }),
          apiAuth.get("/bdb/kasus-atensi", { params: commonParams }),
          apiAuth.get("/bdb/operasi-satgas", { params: commonParams })
        ]);
        var sRows = (resArr[0].data?.data || []).map(function(r) {
          return Object.assign({}, r, { _source_type: "SUSJOL", _kat_label: "SUSJOL", kategori: "MENONJOL" });
        });
        if (resArr[0].data?.meta?.summary) setSusjolSummary(resArr[0].data.meta.summary);
        setSusjolTotal(Number(resArr[0].data?.meta?.total || sRows.length));

        var aRows = (resArr[1].data?.data || []).map(function(r) {
          return Object.assign({}, r, { _source_type: "SUSATENSI", _kat_label: "SUSATENSI", kategori: "ATENSI" });
        });
        if (resArr[1].data?.meta?.summary) setAtensiSummary(resArr[1].data.meta.summary);
        setAtensiTotal(Number(resArr[1].data?.meta?.total || aRows.length));

        var oRows = (resArr[2].data?.data || []).map(function(r) {
          return Object.assign({}, r, {
            _source_type: "OPS_SATGAS",
            _kat_label: r.jenis === "SATGAS" ? "SATGAS" : "OPERASI",
            judul: r.nama || r.judul,
            kategori: r.jenis || "OPERASI"
          });
        });
        setOpsTotal(Number(resArr[2].data?.meta?.total || oRows.length));

        var combined = [].concat(sRows, aRows, oRows);
        combined.sort(function(x, y) {
          if (Boolean(x.is_pinned) !== Boolean(y.is_pinned)) return x.is_pinned ? -1 : 1;
          var dx = String(x.effective_date || x.tanggal_rilis || x.tanggal_atensi || x.tanggal_mulai || x.created_at || "");
          var dy = String(y.effective_date || y.tanggal_rilis || y.tanggal_atensi || y.tanggal_mulai || y.created_at || "");
          if (dx !== dy) return dy.localeCompare(dx);
          return Number(y.jumlah_lp || 0) - Number(x.jumlah_lp || 0);
        });
        setGabRows(combined);
      } catch (e) {
        setGabRows([]);
      } finally {
        setGabLoading(false);
      }
    }, [tabFilters.GABUNGAN]);

    useEffect(function() {
      if (activeTab === "SUSJOL") fetchSusjol();
      else if (activeTab === "SUSATENSI") fetchAtensi();
      else if (activeTab === "OPS_SATGAS") fetchOps();
      else if (activeTab === "GABUNGAN") fetchGabungan();
    }, [activeTab, fetchSusjol, fetchAtensi, fetchOps, fetchGabungan]);

    // Preload counts on initial mount so tab badges show live counts
    useEffect(function() {
      fetchSusjol();
      fetchAtensi();
      fetchOps();
    }, []);

    // Open Drilldown Modal
    async function openDrilldownModal(row, initialTab) {
      setDrillRow(row);
      setDrillTab(initialTab || "LP");
      setDrillStatusFilter("ALL");
      setDrillSatkerFilter("ALL");
      setDrillSearch("");
      setDrillLps([]);
      setDrillAtts([]);
      setDrillLoading(true);
      var baseEp = endpointForRow(row);
      try {
        var res = await Promise.all([
          apiAuth.get(baseEp + "/" + row.id + "/lp"),
          apiAuth.get(baseEp + "/" + row.id + "/attachments")
        ]);
        var lps = res[0].data?.data || res[0].data || [];
        var atts = res[1].data?.data || res[1].data || [];
        setDrillLps(Array.isArray(lps) ? lps : []);
        setDrillAtts(Array.isArray(atts) ? atts : []);
      } catch (e) {
        setDrillLps([]);
        setDrillAtts([]);
      } finally {
        setDrillLoading(false);
      }
    }

    async function openLpTimelineModal(lp) {
      var lpId = lp.lp_id || lp.id;
      if (!lpId) return;
      setLpTimelineModal(lp);
      setLpTimelineData(null);
      setLpTimelineLoading(true);
      try {
        var res = await apiAuth.get("/bdb/wf/lp/" + lpId + "/timeline");
        setLpTimelineData(res.data?.data || res.data || null);
      } catch (e) {
        setLpTimelineData(null);
      } finally {
        setLpTimelineLoading(false);
      }
    }

    async function handleQuickSprinUpload() {
      if (!sprinQuickRow) return;
      if (!sprinNomor.trim() && !sprinFiles.length) {
        alert("Harap isi Nomor Sprin atau pilih file PDF Sprin.");
        return;
      }
      setSprinSaving(true);
      try {
        var baseEp = endpointForRow(sprinQuickRow);
        var fd = new FormData();
        fd.append("kategori_lampiran", "SPRIN");
        if (sprinNomor.trim()) fd.append("nomor_sprin", sprinNomor.trim());
        if (sprinTgl) fd.append("tanggal_sprin", sprinTgl);
        if (sprinCatatan.trim()) fd.append("catatan_perubahan", sprinCatatan.trim());
        sprinFiles.forEach(function(f) { fd.append("files", f); });
        await apiAuth.post(baseEp + "/" + sprinQuickRow.id + "/lampiran", fd, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        setSprinNomor("");
        setSprinTgl("");
        setSprinCatatan("");
        setSprinFiles([]);
        var targetRow = sprinQuickRow;
        setSprinQuickRow(null);
        if (drillRow && drillRow.id === targetRow.id) {
          var attRes = await apiAuth.get(baseEp + "/" + targetRow.id + "/attachments");
          setDrillAtts(attRes.data?.data || []);
        }
        if (activeTab === "SUSJOL") fetchSusjol();
        else if (activeTab === "SUSATENSI") fetchAtensi();
        else if (activeTab === "OPS_SATGAS") fetchOps();
        else fetchGabungan();
      } catch (e) {
        alert(e?.response?.data?.message || "Gagal mengunggah pembaruan Sprin.");
      } finally {
        setSprinSaving(false);
      }
    }

    // Clickable LP & Lampiran Badges for any row
    function renderClickableLpBadge(row) {
      var lpCount = Number(row.jumlah_lp || 0);
      var satkers = String(row.satker_terkait || "").split(",").map(function(s) { return s.trim(); }).filter(Boolean);
      var satkerCount = Number(row.jumlah_satker || satkers.length || 0);
      return jsxs("button", {
        type: "button",
        onClick: function(ev) { ev.stopPropagation(); openDrilldownModal(row, "LP"); },
        title: "Klik untuk membuka Daftar Laporan Polisi (LP), Status Penyidikan & Detail Lampiran",
        style: {
          display: "inline-flex",
          alignItems: "center",
          gap: "0.38rem",
          padding: "0.28rem 0.65rem",
          borderRadius: "999px",
          border: lpCount > 0 ? "1px solid rgba(2,132,199,0.4)" : "1px solid #cbd5e1",
          background: lpCount > 0 ? "linear-gradient(135deg, rgba(2,132,199,0.14), rgba(37,99,235,0.1))" : "#f1f5f9",
          color: lpCount > 0 ? "#0369a1" : "#64748b",
          fontWeight: 800,
          fontSize: "0.75rem",
          cursor: "pointer",
          whiteSpace: "nowrap",
          boxShadow: lpCount > 0 ? "0 1px 2px rgba(2,132,199,0.12)" : "none"
        },
        children: [
          jsx("i", { className: "pi pi-folder-open", style: { fontSize: "0.73rem" } }),
          jsxs("span", { children: [lpCount.toLocaleString("id-ID"), " LP"] }),
          satkerCount > 0 && jsxs("span", {
            style: {
              paddingLeft: "0.3rem",
              borderLeft: "1px solid rgba(2,132,199,0.3)",
              fontSize: "0.7rem",
              color: "#0284c7"
            },
            children: [satkerCount, " Satker"]
          })
        ]
      });
    }

    function renderSeparatedLampiranBadges(row) {
      var sprinCnt = Number(row.jumlah_lampiran_sprin || 0);
      var dokCnt = Number(row.jumlah_lampiran_dokumentasi || 0);
      var totalAtt = Number(row.jumlah_lampiran || 0);
      if (sprinCnt === 0 && dokCnt === 0 && totalAtt > 0) dokCnt = totalAtt;
      return jsxs("div", {
        style: { display: "inline-flex", alignItems: "center", gap: "0.32rem", flexWrap: "wrap", justifyContent: "center" },
        children: [
          jsxs("button", {
            type: "button",
            onClick: function(ev) { ev.stopPropagation(); openDrilldownModal(row, "SPRIN"); },
            title: row.latest_nomor_sprin ? ("Sprin Terakhir: " + row.latest_nomor_sprin + " — Klik untuk riwayat revisi Sprin") : "Klik untuk lihat / tambah Lampiran Sprin",
            style: {
              display: "inline-flex",
              alignItems: "center",
              gap: "0.25rem",
              padding: "0.2rem 0.5rem",
              borderRadius: "6px",
              border: sprinCnt > 0 ? "1px solid rgba(217,119,6,0.4)" : "1px dashed #cbd5e1",
              background: sprinCnt > 0 ? "rgba(245,158,11,0.13)" : "transparent",
              color: sprinCnt > 0 ? "#b45309" : "#64748b",
              fontSize: "0.71rem",
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap"
            },
            children: ["📜 ", sprinCnt, " Sprin"]
          }),
          jsxs("button", {
            type: "button",
            onClick: function(ev) { ev.stopPropagation(); openDrilldownModal(row, "DOKUMENTASI"); },
            title: "Klik untuk lihat Lampiran Dokumentasi Judul Kasus",
            style: {
              display: "inline-flex",
              alignItems: "center",
              gap: "0.25rem",
              padding: "0.2rem 0.5rem",
              borderRadius: "6px",
              border: dokCnt > 0 ? "1px solid rgba(16,185,129,0.4)" : "1px dashed #cbd5e1",
              background: dokCnt > 0 ? "rgba(16,185,129,0.12)" : "transparent",
              color: dokCnt > 0 ? "#047857" : "#64748b",
              fontSize: "0.71rem",
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap"
            },
            children: ["📸 ", dokCnt, " Dok"]
          })
        ]
      });
    }

    // Drilldown Modal Computed Data
    var drillStatusCounts = useMemo(function() {
      var counts = { ALL: drillLps.length, LIDIK: 0, SIDIK: 0, SPDP: 0, TAHAP1: 0, P19: 0, P21: 0, TAHAP2: 0, HENTI_RJ: 0 };
      drillLps.forEach(function(lp) {
        var b = classifyLpStatusBucket(lp);
        counts[b] = (counts[b] || 0) + 1;
      });
      return counts;
    }, [drillLps]);

    var drillSatkerList = useMemo(function() {
      var map = {};
      drillLps.forEach(function(lp) {
        var st = String(lp.satker_nama || lp.unit_nama || "Satker Lainnya").trim();
        map[st] = (map[st] || 0) + 1;
      });
      return Object.entries(map).sort(function(a, b) { return b[1] - a[1]; });
    }, [drillLps]);

    var filteredDrillLps = useMemo(function() {
      var q = drillSearch.trim().toLowerCase();
      return drillLps.filter(function(lp) {
        if (drillStatusFilter !== "ALL" && classifyLpStatusBucket(lp) !== drillStatusFilter) return false;
        var st = String(lp.satker_nama || lp.unit_nama || "Satker Lainnya").trim();
        if (drillSatkerFilter !== "ALL" && st !== drillSatkerFilter) return false;
        if (q) {
          var hay = [lp.no_laporan, lp.satker_nama, lp.unit_nama, lp.kejahatan, lp.status_nama, lp.status_code].filter(Boolean).join(" ").toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      });
    }, [drillLps, drillStatusFilter, drillSatkerFilter, drillSearch]);

    var drillSprinList = useMemo(function() {
      return drillAtts.filter(function(x) { return String(x.kategori_lampiran || "").toUpperCase() === "SPRIN"; });
    }, [drillAtts]);

    var drillDokList = useMemo(function() {
      return drillAtts.filter(function(x) { return String(x.kategori_lampiran || "DOKUMENTASI").toUpperCase() !== "SPRIN"; });
    }, [drillAtts]);

    var curFilter = tabFilters[activeTab] || tabFilters.SUSJOL;

    // Render Unified 4-Tab Switcher Bar
    var moduleTabs = [
      { key: "SUSJOL", icon: "🔥", label: "Susjol (Kasus Menonjol)", count: susjolTotal, color: "#0284c7", bgActive: "linear-gradient(135deg, #0284c7, #0369a1)" },
      { key: "SUSATENSI", icon: "🚨", label: "Susatensi (Kasus Atensi)", count: atensiTotal, color: "#7c3aed", bgActive: "linear-gradient(135deg, #7c3aed, #6d28d9)" },
      { key: "OPS_SATGAS", icon: "🚩", label: "Rekap LP Ops & Satgas", count: opsTotal, color: "#d97706", bgActive: "linear-gradient(135deg, #d97706, #b45309)" },
      { key: "GABUNGAN", icon: "📊", label: "Semua Gabungan (Susopsgas)", count: (susjolTotal + atensiTotal + opsTotal), color: "#059669", bgActive: "linear-gradient(135deg, #059669, #047857)" }
    ];

    function renderTableRows(rows, tabMode) {
      if (!rows.length) {
        return jsx("div", {
          className: "cms-card",
          style: { padding: "2.5rem", textAlign: "center", color: "#64748b", fontWeight: 600 },
          children: "Belum ada data pada filter ini."
        });
      }
      if (curFilter.viewMode === "card") {
        return jsx("div", {
          style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(24rem, 1fr))", gap: "0.85rem" },
          children: rows.map(function(row) {
            var kat = String(row._source_type || row.kategori || "").toUpperCase();
            var isAtensi = kat === "ATENSI" || kat === "SUSATENSI";
            var isOps = kat === "OPS_SATGAS" || kat === "OPERASI" || kat === "SATGAS";
            var accent = row.is_pinned ? "#f59e0b" : isAtensi ? "#7c3aed" : isOps ? "#d97706" : "#0284c7";
            var dateStr = fmtDateId(row.tanggal_rilis || row.tanggal_atensi || row.tanggal_mulai || row.tanggal_dibentuk || row.first_tgl_laporan || row.created_at);
            var satkerStr = inferSatker(row);
            return jsxs("div", {
              className: "cms-card",
              style: { borderTop: "4px solid " + accent, padding: "1rem 1.15rem", display: "flex", flexDirection: "column", gap: "0.6rem", justifyContent: "space-between" },
              children: [
                jsxs("div", {
                  style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.4rem", flexWrap: "wrap" },
                  children: [
                    jsxs("div", {
                      style: { display: "flex", alignItems: "center", gap: "0.35rem", flexWrap: "wrap" },
                      children: [
                        row.is_pinned && jsx(Tag, { value: "📌 Disematkan", severity: "warning" }),
                        jsx(Tag, {
                          value: isAtensi ? "🚨 SUSATENSI" : isOps ? ("🚩 " + (row.jenis || "OPERASI")) : "🔥 SUSJOL",
                          severity: isAtensi ? "danger" : isOps ? "warning" : "info"
                        }),
                        row.skala_viral && jsx(Tag, { value: "Skala " + row.skala_viral, severity: row.skala_viral === "nasional" ? "danger" : "warning" }),
                        row.level_atensi && jsx(Tag, { value: "Level " + row.level_atensi, severity: row.level_atensi === "tinggi" ? "danger" : "warning" }),
                        row.status_tampil && jsx(Tag, { value: row.status_tampil, severity: row.status_tampil === "AKTIF" ? "success" : "secondary" })
                      ]
                    }),
                    jsx("span", { style: { fontSize: "0.74rem", color: "#64748b", fontWeight: 700 }, children: dateStr })
                  ]
                }),
                jsx("div", {
                  onClick: function() { openDrilldownModal(row, "LP"); },
                  style: { fontWeight: 800, fontSize: "0.96rem", color: "#0f172a", cursor: "pointer", lineHeight: 1.38 },
                  children: row.judul || row.nama || "—"
                }),
                jsxs("div", {
                  style: { fontSize: "0.77rem", color: "#475569", display: "grid", gap: "0.25rem", padding: "0.55rem 0.7rem", borderRadius: "8px", background: "#f8fafc", border: "1px solid #e2e8f0" },
                  children: [
                    jsxs("div", { children: [jsx("strong", { children: "Satker: " }), satkerStr] }),
                    (row.latest_nomor_sprin || row.nomor_dasar) && jsxs("div", { children: [jsx("strong", { children: "No. Sprin Terakhir: " }), row.latest_nomor_sprin || row.nomor_dasar] }),
                    row.pimpinan && jsxs("div", { children: [jsx("strong", { children: "Pimpinan: " }), row.pimpinan] })
                  ]
                }),
                row.keterangan && jsx("div", {
                  style: { fontSize: "0.8rem", color: "#475569", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" },
                  children: row.keterangan
                }),
                jsxs("div", {
                  style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", flexWrap: "wrap", paddingTop: "0.45rem", borderTop: "1px solid #e2e8f0" },
                  children: [
                    renderClickableLpBadge(row),
                    renderSeparatedLampiranBadges(row)
                  ]
                })
              ]
            }, (row._source_type || "R") + "-" + row.id);
          })
        });
      }

      return jsx("div", {
        className: "cms-card",
        style: { padding: 0, overflow: "hidden" },
        children: jsx("div", {
          style: { overflowX: "auto" },
          children: jsxs("table", {
            style: { width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" },
            children: [
              jsx("thead", {
                children: jsxs("tr", {
                  style: { background: "#16324f", color: "#ffffff", textAlign: "left", fontSize: "0.73rem", textTransform: "uppercase", letterSpacing: "0.04em" },
                  children: [
                    jsx("th", { style: { padding: "0.75rem 0.85rem", width: "3.2rem" }, children: "No" }),
                    tabMode === "GABUNGAN" && jsx("th", { style: { padding: "0.75rem 0.85rem", width: "8.5rem" }, children: "Kategori" }),
                    jsx("th", { style: { padding: "0.75rem 0.85rem" }, children: tabMode === "OPS_SATGAS" ? "Nama Operasi / Satgas & Dasar Sprin" : "Judul Kasus / Kegiatan" }),
                    jsx("th", { style: { padding: "0.75rem 0.85rem", width: "11rem" }, children: tabMode === "SUSJOL" ? "Skala & Rilis" : tabMode === "SUSATENSI" ? "Level & Sumber" : "Klasifikasi & Sprin" }),
                    jsx("th", { style: { padding: "0.75rem 0.85rem", width: "13rem" }, children: "Satker & LP Utama" }),
                    jsx("th", { style: { padding: "0.75rem 0.85rem", width: "9rem" }, children: "Tanggal / Periode" }),
                    jsx("th", { style: { padding: "0.75rem 0.85rem", width: "9.5rem", textAlign: "center" }, children: "Jumlah LP (Drilldown)" }),
                    jsx("th", { style: { padding: "0.75rem 0.85rem", width: "10.5rem", textAlign: "center" }, children: "Lampiran (Sprin vs Dok)" }),
                    jsx("th", { style: { padding: "0.75rem 0.85rem", width: "6.5rem", textAlign: "center" }, children: "Detail" })
                  ]
                })
              }),
              jsx("tbody", {
                children: rows.map(function(row, idx) {
                  var kat = String(row._source_type || row.kategori || "").toUpperCase();
                  var isAtensi = kat === "ATENSI" || kat === "SUSATENSI";
                  var isOps = kat === "OPS_SATGAS" || kat === "OPERASI" || kat === "SATGAS";
                  var dateStr = fmtDateId(row.tanggal_rilis || row.tanggal_atensi || row.tanggal_mulai || row.tanggal_dibentuk || row.first_tgl_laporan || row.created_at);
                  var satkerStr = inferSatker(row);
                  return jsxs("tr", {
                    style: { borderBottom: "1px solid #e2e8f0", background: idx % 2 === 1 ? "rgba(148,163,184,0.05)" : "transparent" },
                    children: [
                      jsx("td", { style: { padding: "0.7rem 0.85rem", fontWeight: 700, color: "#64748b" }, children: idx + 1 }),
                      tabMode === "GABUNGAN" && jsx("td", {
                        style: { padding: "0.7rem 0.85rem" },
                        children: jsx(Tag, {
                          value: isAtensi ? "🚨 SUSATENSI" : isOps ? ("🚩 " + (row.jenis || "OPERASI")) : "🔥 SUSJOL",
                          severity: isAtensi ? "danger" : isOps ? "warning" : "info"
                        })
                      }),
                      jsxs("td", {
                        style: { padding: "0.7rem 0.85rem" },
                        children: [
                          jsxs("div", {
                            onClick: function() { openDrilldownModal(row, "LP"); },
                            style: { fontWeight: 800, color: "#0f172a", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap", lineHeight: 1.35 },
                            children: [
                              row.is_pinned && jsx(Tag, { value: "📌 Disematkan", severity: "warning" }),
                              jsx("span", { children: row.judul || row.nama || "—" })
                            ]
                          }),
                          (row.keterangan || row.deskripsi) && jsx("div", {
                            style: { fontSize: "0.74rem", color: "#64748b", marginTop: "0.2rem", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" },
                            children: row.keterangan || row.deskripsi
                          })
                        ]
                      }),
                      jsxs("td", {
                        style: { padding: "0.7rem 0.85rem" },
                        children: [
                          isAtensi ? jsxs(Fragment, {
                            children: [
                              row.level_atensi && jsx(Tag, { value: "Level " + row.level_atensi, severity: row.level_atensi === "tinggi" ? "danger" : row.level_atensi === "sedang" ? "warning" : "info" }),
                              row.sumber_atensi && jsx("div", { style: { fontSize: "0.72rem", color: "#64748b", marginTop: "0.2rem", fontWeight: 600 }, children: "Sumber: " + row.sumber_atensi })
                            ]
                          }) : isOps ? jsxs(Fragment, {
                            children: [
                              jsx(Tag, { value: (row.jenis || "OPERASI") + (row.status_tampil ? " • " + row.status_tampil : ""), severity: row.status_tampil === "AKTIF" ? "success" : "info" }),
                              (row.latest_nomor_sprin || row.nomor_dasar) && jsx("div", { style: { fontSize: "0.72rem", color: "#b45309", marginTop: "0.2rem", fontWeight: 700 }, children: "Sprin: " + (row.latest_nomor_sprin || row.nomor_dasar) })
                            ]
                          }) : jsxs(Fragment, {
                            children: [
                              row.skala_viral && jsx(Tag, { value: String(row.skala_viral).toUpperCase(), severity: row.skala_viral === "nasional" ? "danger" : row.skala_viral === "regional" ? "warning" : "info" }),
                              jsx("div", { style: { fontSize: "0.72rem", color: "#64748b", marginTop: "0.2rem", fontWeight: 600 }, children: row.rilis ? "✅ Sudah Rilis" : "🔒 Internal" })
                            ]
                          }),
                          !isOps && row.latest_nomor_sprin && jsx("div", { style: { fontSize: "0.7rem", color: "#b45309", marginTop: "0.15rem", fontWeight: 700 }, children: "Sprin: " + row.latest_nomor_sprin })
                        ]
                      }),
                      jsxs("td", {
                        style: { padding: "0.7rem 0.85rem" },
                        children: [
                          jsx("div", { style: { fontWeight: 700, fontSize: "0.76rem", color: "#0f172a" }, children: satkerStr }),
                          jsx("div", { style: { fontSize: "0.72rem", color: "#64748b", marginTop: "0.1rem" }, children: row.first_no_laporan || (row.pimpinan ? ("Pimpinan: " + row.pimpinan) : "—") })
                        ]
                      }),
                      jsxs("td", {
                        style: { padding: "0.7rem 0.85rem", fontSize: "0.75rem", color: "#475569", fontWeight: 600 },
                        children: [
                          jsx("div", { children: dateStr }),
                          isOps && row.tanggal_selesai && jsx("div", { style: { fontSize: "0.7rem", color: "#64748b" }, children: "s.d. " + fmtDateId(row.tanggal_selesai) })
                        ]
                      }),
                      jsx("td", {
                        style: { padding: "0.7rem 0.85rem", textAlign: "center" },
                        children: renderClickableLpBadge(row)
                      }),
                      jsx("td", {
                        style: { padding: "0.7rem 0.85rem", textAlign: "center" },
                        children: renderSeparatedLampiranBadges(row)
                      }),
                      jsx("td", {
                        style: { padding: "0.7rem 0.85rem", textAlign: "center" },
                        children: jsxs("button", {
                          type: "button",
                          onClick: function() { openDrilldownModal(row, "LP"); },
                          className: "att-btn primary",
                          style: { padding: "0.3rem 0.65rem", fontSize: "0.74rem", display: "inline-flex", alignItems: "center", gap: "0.3rem", cursor: "pointer" },
                          children: [jsx("i", { className: "pi pi-eye", style: { fontSize: "0.72rem" } }), " Rincian"]
                        })
                      })
                    ]
                  }, (row._source_type || "T") + "-" + row.id);
                })
              })
            ]
          })
        })
      });
    }

    // Active rows & KPI cards per tab
    var activeKpiCards = useMemo(function() {
      if (activeTab === "SUSJOL") {
        var totalLp = susjolSummary?.total_lp_terkait ?? susjolData.reduce(function(acc, r) { return acc + Number(r.jumlah_lp || 0); }, 0);
        return [
          { key: "semua", label: "Semua Kasus Menonjol", val: susjolSummary?.total_all ?? susjolTotal, onClick: function() { updateFilter("SUSJOL", { skala: "ALL", rilis: "ALL", kpi: "semua", page: 1 }); } },
          { key: "nasional", label: "Skala Nasional", val: susjolSummary?.nasional ?? susjolData.filter(function(r) { return r.skala_viral === "nasional"; }).length, onClick: function() { updateFilter("SUSJOL", { skala: "nasional", rilis: "ALL", kpi: "nasional", page: 1 }); } },
          { key: "regional", label: "Skala Regional", val: susjolSummary?.regional ?? susjolData.filter(function(r) { return r.skala_viral === "regional"; }).length, onClick: function() { updateFilter("SUSJOL", { skala: "regional", rilis: "ALL", kpi: "regional", page: 1 }); } },
          { key: "rilis", label: "Sudah Dirilis", val: susjolSummary?.sudah_rilis ?? susjolData.filter(function(r) { return Boolean(r.rilis); }).length, onClick: function() { updateFilter("SUSJOL", { skala: "ALL", rilis: "YA", kpi: "rilis", page: 1 }); } },
          { key: "lp", label: "Total LP Terkait", val: totalLp, onClick: function() { updateFilter("SUSJOL", { kpi: "lp", page: 1 }); } }
        ];
      }
      if (activeTab === "SUSATENSI") {
        var totalLpA = atensiSummary?.total_lp_terkait ?? atensiData.reduce(function(acc, r) { return acc + Number(r.jumlah_lp || 0); }, 0);
        return [
          { key: "semua", label: "Semua Kasus Atensi", val: atensiSummary?.total_all ?? atensiTotal, onClick: function() { updateFilter("SUSATENSI", { level: "ALL", status: "ALL", kpi: "semua", page: 1 }); } },
          { key: "tinggi", label: "Level Tinggi", val: atensiSummary?.tinggi ?? atensiData.filter(function(r) { return r.level_atensi === "tinggi"; }).length, onClick: function() { updateFilter("SUSATENSI", { level: "tinggi", status: "ALL", kpi: "tinggi", page: 1 }); } },
          { key: "sedang", label: "Level Sedang", val: atensiSummary?.sedang ?? atensiData.filter(function(r) { return r.level_atensi === "sedang"; }).length, onClick: function() { updateFilter("SUSATENSI", { level: "sedang", status: "ALL", kpi: "sedang", page: 1 }); } },
          { key: "aktif", label: "Status Aktif", val: atensiSummary?.aktif ?? atensiData.filter(function(r) { return r.status_atensi !== "selesai"; }).length, onClick: function() { updateFilter("SUSATENSI", { level: "ALL", status: "aktif", kpi: "aktif", page: 1 }); } },
          { key: "lp", label: "Total LP Terkait", val: totalLpA, onClick: function() { updateFilter("SUSATENSI", { kpi: "lp", page: 1 }); } }
        ];
      }
      if (activeTab === "OPS_SATGAS") {
        var totalLpO = opsData.reduce(function(acc, r) { return acc + Number(r.jumlah_lp || 0); }, 0) || opsLpTotal;
        return [
          { key: "semua", label: "Semua Ops & Satgas", val: opsTotal, onClick: function() { updateFilter("OPS_SATGAS", { jenis: "ALL", status: "ALL", kpi: "semua", page: 1 }); } },
          { key: "OPERASI", label: "Operasi Kepolisian", val: opsData.filter(function(r) { return r.jenis !== "SATGAS"; }).length, onClick: function() { updateFilter("OPS_SATGAS", { jenis: "OPERASI", kpi: "OPERASI", page: 1 }); } },
          { key: "SATGAS", label: "Satgas Khusus", val: opsData.filter(function(r) { return r.jenis === "SATGAS"; }).length, onClick: function() { updateFilter("OPS_SATGAS", { jenis: "SATGAS", kpi: "SATGAS", page: 1 }); } },
          { key: "AKTIF", label: "Status Aktif", val: opsData.filter(function(r) { return r.status_tampil === "AKTIF"; }).length, onClick: function() { updateFilter("OPS_SATGAS", { status: "AKTIF", kpi: "AKTIF", page: 1 }); } },
          { key: "lp", label: "Total LP Ops/Satgas", val: totalLpO, onClick: function() { updateFilter("OPS_SATGAS", { kpi: "lp", page: 1 }); } }
        ];
      }
      var gabLpTotal = gabRows.reduce(function(acc, r) { return acc + Number(r.jumlah_lp || 0); }, 0);
      var gabSprinTotal = gabRows.reduce(function(acc, r) { return acc + Number(r.jumlah_lampiran_sprin || 0); }, 0);
      return [
        { key: "semua", label: "Total Judul Susopsgas", val: susjolTotal + atensiTotal + opsTotal, onClick: function() { updateFilter("GABUNGAN", { kategori: "ALL", kpi: "semua" }); } },
        { key: "SUSJOL", label: "🔥 Susjol (Menonjol)", val: susjolTotal, onClick: function() { updateFilter("GABUNGAN", { kategori: "SUSJOL", kpi: "SUSJOL" }); } },
        { key: "SUSATENSI", label: "🚨 Susatensi (Atensi)", val: atensiTotal, onClick: function() { updateFilter("GABUNGAN", { kategori: "SUSATENSI", kpi: "SUSATENSI" }); } },
        { key: "OPS_SATGAS", label: "🚩 Operasi & Satgas", val: opsTotal, onClick: function() { updateFilter("GABUNGAN", { kategori: "OPS_SATGAS", kpi: "OPS_SATGAS" }); } },
        { key: "lp", label: "📋 Total LP Terkait", val: gabLpTotal, onClick: function() { updateFilter("GABUNGAN", { kpi: "lp" }); } },
        { key: "sprin", label: "📜 Total Revisi Sprin", val: gabSprinTotal, onClick: function() { updateFilter("GABUNGAN", { kpi: "sprin" }); } }
      ];
    }, [activeTab, susjolSummary, susjolTotal, susjolData, atensiSummary, atensiTotal, atensiData, opsTotal, opsData, opsLpTotal, gabRows]);

    var displayedGabunganRows = useMemo(function() {
      var kat = tabFilters.GABUNGAN.kategori;
      if (!kat || kat === "ALL") return gabRows;
      return gabRows.filter(function(r) { return r._source_type === kat; });
    }, [gabRows, tabFilters.GABUNGAN.kategori]);

    return jsxs("div", {
      children: [
        // Page Header
        jsxs("div", {
          style: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginBottom: "0.85rem" },
          children: [
            jsxs("div", {
              children: [
                jsx("h1", { className: "cms-page-title", children: "Susopsgas — Rekapitulasi Kasus Menonjol, Kasus Atensi & Operasi/Satgas" }),
                jsx("p", { className: "cms-page-sub", children: "Pemantauan eksekutif terpadu Kasus Menonjol (Susjol), Kasus Atensi (Susatensi), serta Operasi Kepolisian & Satgas Khusus beserta drilldown Laporan Polisi, riwayat multi-revisi Lampiran Sprin, dan Lampiran Dokumentasi." })
              ]
            })
          ]
        }),

        // Prominent 4-Tab Unified Module Switcher Bar
        jsx("div", {
          className: "cms-card",
          style: { padding: "0.55rem", marginBottom: "0.9rem", background: "var(--cas-bg-surface, #ffffff)", border: "1px solid var(--cas-border, #cbd5e1)", borderRadius: "12px" },
          children: jsx("div", {
            style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(14rem, 1fr))", gap: "0.5rem" },
            children: moduleTabs.map(function(tab) {
              var isAct = activeTab === tab.key;
              return jsxs("button", {
                type: "button",
                onClick: function() { setActiveTab(tab.key); },
                style: {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "0.6rem",
                  padding: "0.7rem 1rem",
                  borderRadius: "9px",
                  border: isAct ? ("1px solid " + tab.color) : "1px solid transparent",
                  background: isAct ? tab.bgActive : "var(--cas-bg-subtle, #f8fafc)",
                  color: isAct ? "#ffffff" : "var(--cas-text-primary, #1e293b)",
                  fontWeight: 800,
                  fontSize: "0.84rem",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  boxShadow: isAct ? "0 4px 12px rgba(15,23,42,0.14)" : "none"
                },
                children: [
                  jsxs("span", {
                    style: { display: "inline-flex", alignItems: "center", gap: "0.45rem", textAlign: "left" },
                    children: [
                      jsx("span", { style: { fontSize: "1.05rem" }, children: tab.icon }),
                      jsx("span", { children: tab.label })
                    ]
                  }),
                  jsx("span", {
                    style: {
                      padding: "0.15rem 0.55rem",
                      borderRadius: "999px",
                      background: isAct ? "rgba(255,255,255,0.24)" : "rgba(15,23,42,0.08)",
                      color: isAct ? "#ffffff" : tab.color,
                      fontSize: "0.74rem",
                      fontWeight: 800
                    },
                    children: Number(tab.count || 0).toLocaleString("id-ID")
                  })
                ]
              }, tab.key);
            })
          })
        }),

        // KPI Cards Row
        jsx("div", {
          className: "lp-status-cards",
          style: { margin: "0 0 0.85rem", gridTemplateColumns: "repeat(auto-fit, minmax(9.5rem, 1fr))" },
          children: activeKpiCards.map(function(item) {
            var isAct = curFilter.kpi === item.key;
            return jsxs("button", {
              type: "button",
              onClick: item.onClick,
              className: "lp-stat " + (item.key === "semua" ? "total" : "ct") + (isAct ? " active" : ""),
              children: [
                jsx("div", { className: "n", children: Number(item.val || 0).toLocaleString("id-ID") }),
                jsx("div", { className: "l", children: item.label })
              ]
            }, item.key);
          })
        }),

        // Per-Tab Unified Filter Bar (Preserves Periode, Satker, Pencarian, Mode Tabel/Kartu)
        jsx("div", {
          className: "cms-card",
          style: { padding: "0.75rem 1rem", marginBottom: "0.9rem" },
          children: jsxs("div", {
            className: "cas-unified-filter-bar",
            style: { display: "flex", alignItems: "center", gap: "0.55rem", flexWrap: "wrap", width: "100%" },
            children: [
              jsx(InputText, {
                value: curFilter.search || "",
                onChange: function(ev) { updateFilter(activeTab, { search: ev.target.value, page: 1 }); },
                placeholder: "Cari judul kasus, nama operasi/satgas, nomor sprin, atau nomor LP…",
                style: { flex: "1.4 1 14rem", minWidth: "13rem", height: "38px", boxSizing: "border-box" }
              }),
              jsx(InputText, {
                value: curFilter.satker || "",
                onChange: function(ev) { updateFilter(activeTab, { satker: ev.target.value, page: 1 }); },
                placeholder: "Filter Satker (mis. Polda Jatim)…",
                style: { flex: "0.8 1 10rem", minWidth: "9.5rem", height: "38px", boxSizing: "border-box" }
              }),
              jsx("input", {
                type: "date",
                value: curFilter.from || "",
                onChange: function(ev) { updateFilter(activeTab, { from: ev.target.value, page: 1 }); },
                title: "Periode Mulai",
                className: "p-inputtext p-component",
                style: { height: "38px", padding: "0 0.6rem", borderRadius: "8px", fontSize: "0.8rem", boxSizing: "border-box" }
              }),
              jsx("input", {
                type: "date",
                value: curFilter.to || "",
                onChange: function(ev) { updateFilter(activeTab, { to: ev.target.value, page: 1 }); },
                title: "Periode Selesai",
                className: "p-inputtext p-component",
                style: { height: "38px", padding: "0 0.6rem", borderRadius: "8px", fontSize: "0.8rem", boxSizing: "border-box" }
              }),
              activeTab === "SUSJOL" && jsxs("select", {
                value: curFilter.skala || "ALL",
                onChange: function(ev) { updateFilter("SUSJOL", { skala: ev.target.value, page: 1 }); },
                className: "p-inputtext p-component",
                style: { height: "38px", padding: "0 0.7rem", borderRadius: "8px", fontSize: "0.82rem", fontWeight: 600 },
                children: [
                  jsx("option", { value: "ALL", children: "Semua Skala Viral" }),
                  jsx("option", { value: "nasional", children: "Skala Nasional" }),
                  jsx("option", { value: "regional", children: "Skala Regional" }),
                  jsx("option", { value: "tidak viral", children: "Tidak Viral" })
                ]
              }),
              activeTab === "SUSATENSI" && jsxs("select", {
                value: curFilter.level || "ALL",
                onChange: function(ev) { updateFilter("SUSATENSI", { level: ev.target.value, page: 1 }); },
                className: "p-inputtext p-component",
                style: { height: "38px", padding: "0 0.7rem", borderRadius: "8px", fontSize: "0.82rem", fontWeight: 600 },
                children: [
                  jsx("option", { value: "ALL", children: "Semua Level Atensi" }),
                  jsx("option", { value: "tinggi", children: "Level Tinggi" }),
                  jsx("option", { value: "sedang", children: "Level Sedang" }),
                  jsx("option", { value: "biasa", children: "Level Biasa" })
                ]
              }),
              activeTab === "OPS_SATGAS" && jsxs("select", {
                value: curFilter.jenis || "ALL",
                onChange: function(ev) { updateFilter("OPS_SATGAS", { jenis: ev.target.value, page: 1 }); },
                className: "p-inputtext p-component",
                style: { height: "38px", padding: "0 0.7rem", borderRadius: "8px", fontSize: "0.82rem", fontWeight: 600 },
                children: [
                  jsx("option", { value: "ALL", children: "Semua Jenis (Ops & Satgas)" }),
                  jsx("option", { value: "OPERASI", children: "Operasi Kepolisian" }),
                  jsx("option", { value: "SATGAS", children: "Satgas Khusus" })
                ]
              }),
              activeTab === "GABUNGAN" && jsxs("select", {
                value: curFilter.kategori || "ALL",
                onChange: function(ev) { updateFilter("GABUNGAN", { kategori: ev.target.value, page: 1 }); },
                className: "p-inputtext p-component",
                style: { height: "38px", padding: "0 0.7rem", borderRadius: "8px", fontSize: "0.82rem", fontWeight: 600 },
                children: [
                  jsx("option", { value: "ALL", children: "Semua Kategori Susopsgas" }),
                  jsx("option", { value: "SUSJOL", children: "🔥 Susjol (Kasus Menonjol)" }),
                  jsx("option", { value: "SUSATENSI", children: "🚨 Susatensi (Kasus Atensi)" }),
                  jsx("option", { value: "OPS_SATGAS", children: "🚩 Operasi & Satgas" })
                ]
              }),
              jsxs("div", {
                style: { display: "inline-flex", alignItems: "stretch", height: "38px", borderRadius: "8px", border: "1px solid #cbd5e1", overflow: "hidden", background: "#f8fafc" },
                children: [
                  jsxs("button", {
                    type: "button",
                    onClick: function() { updateFilter(activeTab, { viewMode: "table" }); },
                    style: { padding: "0 0.75rem", border: "none", background: curFilter.viewMode === "table" ? "#0284c7" : "transparent", color: curFilter.viewMode === "table" ? "#fff" : "#475569", fontWeight: 700, fontSize: "0.76rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.35rem" },
                    children: [jsx("i", { className: "pi pi-list", style: { fontSize: "0.76rem" } }), "Tabel"]
                  }),
                  jsxs("button", {
                    type: "button",
                    onClick: function() { updateFilter(activeTab, { viewMode: "card" }); },
                    style: { padding: "0 0.75rem", border: "none", borderLeft: "1px solid #cbd5e1", background: curFilter.viewMode === "card" ? "#0284c7" : "transparent", color: curFilter.viewMode === "card" ? "#fff" : "#475569", fontWeight: 700, fontSize: "0.76rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.35rem" },
                    children: [jsx("i", { className: "pi pi-th-large", style: { fontSize: "0.75rem" } }), "Kartu"]
                  })
                ]
              }),
              jsx("button", {
                type: "button",
                onClick: function() {
                  updateFilter(activeTab, { search: "", satker: "", from: "", to: "", skala: "ALL", rilis: "ALL", level: "ALL", status: "ALL", jenis: "ALL", kategori: "ALL", kpi: "semua", page: 1 });
                },
                className: "att-btn",
                style: { height: "38px", padding: "0 0.9rem", fontWeight: 700, cursor: "pointer" },
                children: "Reset"
              })
            ]
          })
        }),

        // Tab Content Area
        activeTab === "SUSJOL" && (susjolLoading ? jsx("div", { className: "cms-card", style: { padding: "2rem", textAlign: "center", color: "#64748b", fontWeight: 600 }, children: "Memuat Rekap Susjol (Kasus Menonjol)…" }) : renderTableRows(susjolData, "SUSJOL")),
        activeTab === "SUSATENSI" && (atensiLoading ? jsx("div", { className: "cms-card", style: { padding: "2rem", textAlign: "center", color: "#64748b", fontWeight: 600 }, children: "Memuat Rekap Susatensi (Kasus Atensi)…" }) : renderTableRows(atensiData, "SUSATENSI")),
        activeTab === "OPS_SATGAS" && (opsLoading ? jsx("div", { className: "cms-card", style: { padding: "2rem", textAlign: "center", color: "#64748b", fontWeight: 600 }, children: "Memuat Rekap Operasi & Satgas…" }) : renderTableRows(opsData, "OPS_SATGAS")),
        activeTab === "GABUNGAN" && (gabLoading ? jsx("div", { className: "cms-card", style: { padding: "2rem", textAlign: "center", color: "#64748b", fontWeight: 600 }, children: "Memuat Rekapitulasi Gabungan Susopsgas…" }) : renderTableRows(displayedGabunganRows, "GABUNGAN")),

        // KINERJA-PERKARA-STYLE LP & LAMPIRAN DRILLDOWN MODAL
        drillRow && jsx("div", {
          role: "dialog",
          "aria-modal": true,
          onClick: function() { setDrillRow(null); },
          style: {
            position: "fixed",
            inset: 0,
            zIndex: 9990,
            background: "rgba(15, 23, 42, 0.72)",
            backdropFilter: "blur(3px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: drillFull ? "0.4rem" : "1.25rem"
          },
          children: jsxs("div", {
            className: "cas-modal cas-modal-wide",
            onClick: function(ev) { ev.stopPropagation(); },
            style: {
              width: drillFull ? "99vw" : "92vw",
              maxWidth: drillFull ? "99vw" : "86rem",
              height: drillFull ? "97vh" : "auto",
              maxHeight: drillFull ? "97vh" : "92vh",
              background: "var(--cas-bg-surface, #ffffff)",
              borderRadius: "14px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.38)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              border: "1px solid var(--cas-border, #cbd5e1)"
            },
            children: [
              // Modal Header
              jsxs("div", {
                style: {
                  padding: "0.95rem 1.35rem",
                  background: "linear-gradient(135deg, #0f172a, #1e3a5f)",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                  flexWrap: "wrap"
                },
                children: [
                  jsxs("div", {
                    style: { display: "flex", alignItems: "center", gap: "0.65rem", flexWrap: "wrap" },
                    children: [
                      jsx("span", { style: { fontSize: "1.15rem" }, children: "📋" }),
                      jsx("span", { style: { fontWeight: 800, fontSize: "1rem", letterSpacing: "0.01em" }, children: "Daftar Laporan Polisi (LP) & Detail Lampiran — Susopsgas" }),
                      jsx(Tag, {
                        value: String(drillRow._source_type || drillRow.kategori || "SUSJOL").toUpperCase().replace("OPS_SATGAS", "OPERASI & SATGAS").replace("SUSATENSI", "KASUS ATENSI").replace("SUSJOL", "KASUS MENONJOL"),
                        severity: "info"
                      })
                    ]
                  }),
                  jsxs("div", {
                    style: { display: "flex", alignItems: "center", gap: "0.45rem" },
                    children: [
                      jsx("button", {
                        type: "button",
                        onClick: function() { setDrillFull(!drillFull); },
                        style: { background: "rgba(255,255,255,0.14)", border: "none", color: "#fff", borderRadius: "7px", padding: "0.35rem 0.65rem", cursor: "pointer", fontSize: "0.76rem", fontWeight: 700 },
                        children: drillFull ? "🗗 Ukuran Normal" : "🗖 Layar Penuh"
                      }),
                      jsx("button", {
                        type: "button",
                        onClick: function() { setDrillRow(null); },
                        style: { background: "rgba(239,68,68,0.85)", border: "none", color: "#fff", borderRadius: "7px", padding: "0.35rem 0.75rem", cursor: "pointer", fontSize: "0.78rem", fontWeight: 800 },
                        children: "✕ Tutup"
                      })
                    ]
                  })
                ]
              }),

              // Modal Scrollable Content
              jsxs("div", {
                style: { padding: "1.1rem 1.35rem", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "0.95rem" },
                children: [
                  // 1. Top Summary Strip + Mini Status Cards (Kinerja-Perkara-Style)
                  jsxs("div", {
                    style: { padding: "0.9rem 1.1rem", borderRadius: "10px", background: "#f8fafc", border: "1px solid #e2e8f0", display: "grid", gap: "0.75rem" },
                    children: [
                      jsxs("div", {
                        style: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" },
                        children: [
                          jsxs("div", {
                            children: [
                              jsx("div", { style: { fontWeight: 800, fontSize: "1.02rem", color: "#0f172a" }, children: drillRow.judul || drillRow.nama || "—" }),
                              jsxs("div", {
                                style: { fontSize: "0.78rem", color: "#475569", marginTop: "0.25rem", display: "flex", gap: "0.9rem", flexWrap: "wrap" },
                                children: [
                                  jsxs("span", { children: ["🏢 Satker: ", jsx("strong", { children: inferSatker(drillRow) })] }),
                                  (drillRow.latest_nomor_sprin || drillRow.nomor_dasar) && jsxs("span", { children: ["📜 No. Sprin: ", jsx("strong", { style: { color: "#b45309" }, children: drillRow.latest_nomor_sprin || drillRow.nomor_dasar })] }),
                                  jsxs("span", { children: ["📊 Total LP: ", jsx("strong", { style: { color: "#0284c7" }, children: drillLps.length + " LP" }), " pada ", jsx("strong", { children: drillSatkerList.length + " Satker" })] })
                                ]
                              })
                            ]
                          }),
                          jsxs("button", {
                            type: "button",
                            onClick: function() {
                              setSprinQuickRow(drillRow);
                              setSprinNomor(drillRow.latest_nomor_sprin || drillRow.nomor_dasar || "");
                              setSprinTgl("");
                              setSprinCatatan("");
                              setSprinFiles([]);
                            },
                            style: {
                              padding: "0.42rem 0.85rem",
                              borderRadius: "8px",
                              border: "1px solid #d97706",
                              background: "rgba(245,158,11,0.14)",
                              color: "#b45309",
                              fontWeight: 800,
                              fontSize: "0.76rem",
                              cursor: "pointer"
                            },
                            children: ["📜 + Update / Revisi Sprin Baru"]
                          })
                        ]
                      }),

                      // Mini Status Cards (Kinerja Perkara Style)
                      jsx("div", {
                        style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(6.8rem, 1fr))", gap: "0.45rem" },
                        children: [
                          { key: "ALL", label: "Total LP", val: drillStatusCounts.ALL, color: "#0284c7" },
                          { key: "LIDIK", label: "Lidik", val: drillStatusCounts.LIDIK, color: "#475569" },
                          { key: "SIDIK", label: "Sidik", val: drillStatusCounts.SIDIK, color: "#0369a1" },
                          { key: "SPDP", label: "SPDP", val: drillStatusCounts.SPDP, color: "#d97706" },
                          { key: "TAHAP1", label: "Tahap I", val: drillStatusCounts.TAHAP1, color: "#b45309" },
                          { key: "P19", label: "P-19", val: drillStatusCounts.P19, color: "#dc2626" },
                          { key: "P21", label: "P-21", val: drillStatusCounts.P21, color: "#059669" },
                          { key: "TAHAP2", label: "Tahap II", val: drillStatusCounts.TAHAP2, color: "#047857" },
                          { key: "HENTI_RJ", label: "SP2 Lidik / SP3 / RJ", val: drillStatusCounts.HENTI_RJ, color: "#7c3aed" }
                        ].map(function(card) {
                          var isSel = drillStatusFilter === card.key;
                          return jsxs("button", {
                            type: "button",
                            onClick: function() { setDrillStatusFilter(card.key); setDrillTab("LP"); },
                            style: {
                              padding: "0.45rem 0.55rem",
                              borderRadius: "8px",
                              border: isSel ? ("2px solid " + card.color) : "1px solid #cbd5e1",
                              background: isSel ? "rgba(2,132,199,0.08)" : "#ffffff",
                              cursor: "pointer",
                              textAlign: "center"
                            },
                            children: [
                              jsx("div", { style: { fontWeight: 800, fontSize: "0.98rem", color: card.color }, children: Number(card.val || 0).toLocaleString("id-ID") }),
                              jsx("div", { style: { fontSize: "0.68rem", fontWeight: 700, color: "#475569", marginTop: "0.1rem" }, children: card.label })
                            ]
                          }, card.key);
                        })
                      })
                    ]
                  }),

                  // 2. Satker Chips & Search Bar
                  jsxs("div", {
                    style: { display: "grid", gap: "0.55rem" },
                    children: [
                      drillSatkerList.length > 0 && jsxs("div", {
                        style: { display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap" },
                        children: [
                          jsxs("button", {
                            type: "button",
                            onClick: function() { setDrillSatkerFilter("ALL"); },
                            style: {
                              padding: "0.25rem 0.65rem",
                              borderRadius: "999px",
                              border: drillSatkerFilter === "ALL" ? "1px solid #0284c7" : "1px solid #cbd5e1",
                              background: drillSatkerFilter === "ALL" ? "#0284c7" : "#f1f5f9",
                              color: drillSatkerFilter === "ALL" ? "#fff" : "#334155",
                              fontSize: "0.73rem",
                              fontWeight: 700,
                              cursor: "pointer"
                            },
                            children: ["Semua Satker (", drillLps.length, ")"]
                          }),
                          drillSatkerList.map(function(entry) {
                            var stName = entry[0], cnt = entry[1];
                            var active = drillSatkerFilter === stName;
                            return jsxs("button", {
                              type: "button",
                              onClick: function() { setDrillSatkerFilter(active ? "ALL" : stName); setDrillTab("LP"); },
                              style: {
                                padding: "0.25rem 0.65rem",
                                borderRadius: "999px",
                                border: active ? "1px solid #0284c7" : "1px solid #cbd5e1",
                                background: active ? "#0284c7" : "#f8fafc",
                                color: active ? "#fff" : "#1e293b",
                                fontSize: "0.73rem",
                                fontWeight: 700,
                                cursor: "pointer"
                              },
                              children: [stName, " (", cnt, ")"]
                            }, stName);
                          })
                        ]
                      }),
                      jsxs("div", {
                        style: { display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" },
                        children: [
                          jsx(InputText, {
                            value: drillSearch,
                            onChange: function(ev) { setDrillSearch(ev.target.value); },
                            placeholder: "Cari Nomor LP, Satker, Pasal, atau Status...",
                            style: { flex: 1, minWidth: "14rem", height: "36px", boxSizing: "border-box" }
                          }),
                          (drillStatusFilter !== "ALL" || drillSatkerFilter !== "ALL" || drillSearch) && jsx("button", {
                            type: "button",
                            onClick: function() { setDrillStatusFilter("ALL"); setDrillSatkerFilter("ALL"); setDrillSearch(""); },
                            className: "att-btn",
                            style: { height: "36px", padding: "0 0.75rem", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" },
                            children: "Reset Filter LP"
                          })
                        ]
                      })
                    ]
                  }),

                  // 3. Dedicated 3 Tabs inside the Drilldown Modal
                  jsxs("div", {
                    style: { display: "flex", gap: "0.5rem", borderBottom: "2px solid #e2e8f0", paddingBottom: "0.4rem", flexWrap: "wrap" },
                    children: [
                      { key: "LP", label: "📋 Daftar LP & Lampiran Penyidikan LP (" + filteredDrillLps.length + " LP)" },
                      { key: "SPRIN", label: "📜 Riwayat Lampiran Sprin (Multi-Revisi) (" + drillSprinList.length + ")" },
                      { key: "DOKUMENTASI", label: "📸 Lampiran Dokumentasi Judul Kasus (" + drillDokList.length + ")" }
                    ].map(function(tItem) {
                      var isAct = drillTab === tItem.key;
                      return jsx("button", {
                        type: "button",
                        onClick: function() { setDrillTab(tItem.key); },
                        style: {
                          padding: "0.5rem 0.95rem",
                          borderRadius: "8px",
                          border: isAct ? "1px solid #0284c7" : "1px solid transparent",
                          background: isAct ? "#0284c7" : "#f1f5f9",
                          color: isAct ? "#ffffff" : "#334155",
                          fontWeight: 800,
                          fontSize: "0.78rem",
                          cursor: "pointer"
                        },
                        children: tItem.label
                      }, tItem.key);
                    })
                  }),

                  // Drilldown Tab Content
                  drillLoading ? jsx("div", { style: { padding: "2rem", textAlign: "center", color: "#64748b", fontWeight: 600 }, children: "Memuat rincian LP dan berkas lampiran…" }) :
                  drillTab === "LP" ? (
                    filteredDrillLps.length === 0 ? jsx("div", { style: { padding: "2rem", textAlign: "center", color: "#94a3b8" }, children: "Tidak ada Laporan Polisi yang cocok dengan filter." }) :
                    jsx("div", {
                      style: { overflowX: "auto", border: "1px solid #e2e8f0", borderRadius: "10px" },
                      children: jsxs("table", {
                        style: { width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" },
                        children: [
                          jsx("thead", {
                            children: jsxs("tr", {
                              style: { background: "#f1f5f9", color: "#1e293b", textAlign: "left", fontSize: "0.72rem", textTransform: "uppercase" },
                              children: [
                                jsx("th", { style: { padding: "0.65rem 0.75rem", width: "2.8rem" }, children: "No" }),
                                jsx("th", { style: { padding: "0.65rem 0.75rem", width: "13rem" }, children: "Nomor LP" }),
                                jsx("th", { style: { padding: "0.65rem 0.75rem", width: "7.5rem" }, children: "Tgl LP" }),
                                jsx("th", { style: { padding: "0.65rem 0.75rem", width: "12rem" }, children: "Satker" }),
                                jsx("th", { style: { padding: "0.65rem 0.75rem", width: "13rem" }, children: "Tindak Pidana / Pasal" }),
                                jsx("th", { style: { padding: "0.65rem 0.75rem", width: "8.5rem", textAlign: "center" }, children: "Status LP" }),
                                jsx("th", { style: { padding: "0.65rem 0.75rem" }, children: "Detail Dokumen & Lampiran Penyidikan LP" })
                              ]
                            })
                          }),
                          jsx("tbody", {
                            children: filteredDrillLps.map(function(lp, idx) {
                              var bucket = classifyLpStatusBucket(lp);
                              var stStyle = getStatusBadgeStyle(bucket);
                              var docs = Array.isArray(lp.dokumen_list) ? lp.dokumen_list : [];
                              return jsxs("tr", {
                                style: { borderTop: "1px solid #e2e8f0", background: idx % 2 === 1 ? "#f8fafc" : "#ffffff" },
                                children: [
                                  jsx("td", { style: { padding: "0.6rem 0.75rem", fontWeight: 700, color: "#64748b" }, children: idx + 1 }),
                                  jsxs("td", {
                                    style: { padding: "0.6rem 0.75rem" },
                                    children: [
                                      jsx("div", { style: { fontWeight: 800, color: "#0f172a" }, children: lp.no_laporan || "—" }),
                                      lp.pid && jsx("a", {
                                        href: "/cms/laporan-polisi/" + lp.pid,
                                        target: "_blank",
                                        rel: "noreferrer",
                                        style: { fontSize: "0.7rem", color: "#0284c7", fontWeight: 700, textDecoration: "none" },
                                        children: "🔗 Buka Halaman Detail LP ↗"
                                      })
                                    ]
                                  }),
                                  jsx("td", { style: { padding: "0.6rem 0.75rem", color: "#475569", fontWeight: 600 }, children: fmtDateId(lp.tgl_laporan) }),
                                  jsxs("td", {
                                    style: { padding: "0.6rem 0.75rem" },
                                    children: [
                                      jsx("div", { style: { fontWeight: 700, color: "#1e293b" }, children: lp.satker_nama || "—" }),
                                      lp.unit_nama && lp.unit_nama !== lp.satker_nama && jsx("div", { style: { fontSize: "0.7rem", color: "#64748b" }, children: lp.unit_nama })
                                    ]
                                  }),
                                  jsx("td", { style: { padding: "0.6rem 0.75rem", color: "#334155" }, children: lp.kejahatan || "—" }),
                                  jsx("td", {
                                    style: { padding: "0.6rem 0.75rem", textAlign: "center" },
                                    children: jsxs("button", {
                                      type: "button",
                                      onClick: function() { openLpTimelineModal(lp); },
                                      title: "Klik untuk melihat alur dokumen penyidikan LP",
                                      style: {
                                        padding: "0.24rem 0.55rem",
                                        borderRadius: "999px",
                                        border: "1px solid " + stStyle.border,
                                        background: stStyle.bg,
                                        color: stStyle.color,
                                        fontWeight: 800,
                                        fontSize: "0.72rem",
                                        cursor: "pointer",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "0.28rem"
                                      },
                                      children: [lp.status_nama || lp.status_code || "Lidik", " 🔍"]
                                    })
                                  }),
                                  jsxs("td", {
                                    style: { padding: "0.6rem 0.75rem" },
                                    children: [
                                      docs.length === 0 ? jsxs("div", {
                                        style: { display: "flex", alignItems: "center", gap: "0.45rem", flexWrap: "wrap" },
                                        children: [
                                          jsx("span", { style: { fontSize: "0.74rem", color: "#94a3b8" }, children: "Belum ada surat penyidikan diunggah." }),
                                          jsx("button", {
                                            type: "button",
                                            onClick: function() { openLpTimelineModal(lp); },
                                            className: "att-btn",
                                            style: { padding: "0.18rem 0.5rem", fontSize: "0.7rem", cursor: "pointer" },
                                            children: "🔄 Cek Alur LP"
                                          })
                                        ]
                                      }) : jsxs("div", {
                                        style: { display: "grid", gap: "0.32rem" },
                                        children: docs.map(function(doc) {
                                          var files = Array.isArray(doc.lampiran) ? doc.lampiran : [];
                                          return jsxs("div", {
                                            style: {
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "space-between",
                                              gap: "0.5rem",
                                              padding: "0.3rem 0.55rem",
                                              borderRadius: "6px",
                                              background: "#f8fafc",
                                              border: "1px solid #e2e8f0",
                                              flexWrap: "wrap"
                                            },
                                            children: [
                                              jsxs("div", {
                                                style: { fontSize: "0.73rem" },
                                                children: [
                                                  jsx("strong", { style: { color: "#0f172a" }, children: doc.type_nama || doc.type_code }),
                                                  doc.nomor_dokumen && jsx("span", { style: { color: "#475569" }, children: " • No: " + doc.nomor_dokumen }),
                                                  doc.tanggal_dokumen && jsx("span", { style: { color: "#64748b" }, children: " (" + fmtDateId(doc.tanggal_dokumen) + ")" })
                                                ]
                                              }),
                                              jsxs("div", {
                                                style: { display: "flex", gap: "0.3rem", flexWrap: "wrap" },
                                                children: files.map(function(fl, fIdx) {
                                                  return jsx("button", {
                                                    type: "button",
                                                    onClick: function() { setPreviewFile({ name: fl.name || (doc.type_nama + ".pdf"), url: fl.url }); },
                                                    style: {
                                                      padding: "0.15rem 0.45rem",
                                                      borderRadius: "5px",
                                                      border: "1px solid #0284c7",
                                                      background: "rgba(2,132,199,0.1)",
                                                      color: "#0284c7",
                                                      fontSize: "0.69rem",
                                                      fontWeight: 700,
                                                      cursor: "pointer"
                                                    },
                                                    children: "📄 Lihat / Unduh PDF"
                                                  }, fIdx);
                                                })
                                              })
                                            ]
                                          }, doc.id);
                                        })
                                      })
                                    ]
                                  })
                                ]
                              }, lp.lp_id || lp.id || idx);
                            })
                          })
                        ]
                      })
                    })
                  ) : drillTab === "SPRIN" ? (
                    jsxs("div", {
                      style: { display: "grid", gap: "0.75rem" },
                      children: [
                        jsxs("div", {
                          style: { padding: "0.75rem 1rem", borderRadius: "8px", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.35)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap" },
                          children: [
                            jsxs("div", {
                              children: [
                                jsx("div", { style: { fontWeight: 800, fontSize: "0.84rem", color: "#92400e" }, children: "📜 Riwayat Lampiran Surat Perintah (Sprin) — Multi-Revisi" }),
                                jsx("div", { style: { fontSize: "0.75rem", color: "#b45309" }, children: "Setiap perubahan / perpanjangan Sprin tercatat berurutan lengkap dengan Nomor Sprin, Tanggal Sprin, dan Catatan Perubahan." })
                              ]
                            }),
                            jsx("button", {
                              type: "button",
                              onClick: function() {
                                setSprinQuickRow(drillRow);
                                setSprinNomor("");
                                setSprinTgl("");
                                setSprinCatatan("");
                                setSprinFiles([]);
                              },
                              style: { padding: "0.4rem 0.85rem", borderRadius: "8px", border: "none", background: "#d97706", color: "#fff", fontWeight: 800, fontSize: "0.76rem", cursor: "pointer" },
                              children: "📜 + Tambah Revisi Sprin Baru"
                            })
                          ]
                        }),
                        drillSprinList.length === 0 ? jsx("div", {
                          style: { padding: "1.8rem", textAlign: "center", color: "#94a3b8", border: "1px dashed #cbd5e1", borderRadius: "10px" },
                          children: "Belum ada berkas Lampiran Sprin yang diunggah pada judul ini."
                        }) : jsx("div", {
                          style: { display: "grid", gap: "0.55rem" },
                          children: drillSprinList.map(function(att, idx) {
                            var revNo = att.revisi_ke || (drillSprinList.length - idx);
                            return jsxs("div", {
                              style: { padding: "0.8rem 1rem", borderRadius: "10px", background: "#fffbeb", border: "1px solid #fde68a", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.8rem", flexWrap: "wrap" },
                              children: [
                                jsxs("div", {
                                  style: { display: "grid", gap: "0.22rem" },
                                  children: [
                                    jsxs("div", {
                                      style: { display: "flex", alignItems: "center", gap: "0.45rem", flexWrap: "wrap" },
                                      children: [
                                        jsx("span", { style: { padding: "0.14rem 0.5rem", borderRadius: "999px", background: "#d97706", color: "#fff", fontSize: "0.7rem", fontWeight: 800 }, children: "Revisi #" + revNo + (revNo === 1 ? " (Sprin Awal)" : " (Pembaruan)") }),
                                        jsx("strong", { style: { fontSize: "0.85rem", color: "#0f172a" }, children: att.nomor_sprin || att.file_name || "—" }),
                                        att.tanggal_sprin && jsx("span", { style: { fontSize: "0.75rem", color: "#475569", fontWeight: 600 }, children: "• Tgl Sprin: " + fmtDateId(att.tanggal_sprin) })
                                      ]
                                    }),
                                    att.catatan_perubahan && jsx("div", { style: { fontSize: "0.77rem", color: "#78350f" }, children: "Catatan: " + att.catatan_perubahan }),
                                    jsxs("div", { style: { fontSize: "0.71rem", color: "#64748b" }, children: ["Berkas: ", att.file_name, " • Diunggah: ", fmtDateId(att.created_at)] })
                                  ]
                                }),
                                jsxs("div", {
                                  style: { display: "flex", gap: "0.4rem" },
                                  children: [
                                    att.url && jsx("button", {
                                      type: "button",
                                      onClick: function() { setPreviewFile({ name: att.file_name, url: att.url }); },
                                      className: "att-btn primary",
                                      style: { padding: "0.3rem 0.65rem", fontSize: "0.74rem", cursor: "pointer" },
                                      children: "📄 Pratinjau PDF"
                                    }),
                                    att.url && jsx("a", {
                                      href: att.url,
                                      target: "_blank",
                                      rel: "noreferrer",
                                      className: "att-btn",
                                      style: { padding: "0.3rem 0.65rem", fontSize: "0.74rem", textDecoration: "none" },
                                      children: "⬇️ Unduh"
                                    })
                                  ]
                                })
                              ]
                            }, att.id || idx);
                          })
                        })
                      ]
                    })
                  ) : (
                    jsxs("div", {
                      style: { display: "grid", gap: "0.75rem" },
                      children: [
                        jsxs("div", {
                          style: { padding: "0.75rem 1rem", borderRadius: "8px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.3)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap" },
                          children: [
                            jsxs("div", {
                              children: [
                                jsx("div", { style: { fontWeight: 800, fontSize: "0.84rem", color: "#065f46" }, children: "📸 Lampiran Dokumentasi Judul Kasus / Kegiatan" }),
                                jsx("div", { style: { fontSize: "0.75rem", color: "#047857" }, children: "Dokumentasi foto kegiatan, rilis pers, barang bukti, atau paparan yang melekat pada judul ini." })
                              ]
                            })
                          ]
                        }),
                        drillDokList.length === 0 ? jsx("div", {
                          style: { padding: "1.8rem", textAlign: "center", color: "#94a3b8", border: "1px dashed #cbd5e1", borderRadius: "10px" },
                          children: "Belum ada Lampiran Dokumentasi pada judul ini."
                        }) : jsx("div", {
                          style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(18rem, 1fr))", gap: "0.65rem" },
                          children: drillDokList.map(function(att, idx) {
                            return jsxs("div", {
                              style: { padding: "0.75rem 0.9rem", borderRadius: "10px", background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "0.5rem" },
                              children: [
                                jsxs("div", {
                                  children: [
                                    jsx("div", { style: { fontWeight: 800, fontSize: "0.82rem", color: "#0f172a" }, children: att.judul_dokumentasi || att.file_name }),
                                    jsx("div", { style: { fontSize: "0.72rem", color: "#64748b", marginTop: "0.15rem" }, children: att.file_name + (att.size ? (" (" + Math.round(Number(att.size) / 1024) + " KB)") : "") }),
                                    jsx("div", { style: { fontSize: "0.7rem", color: "#94a3b8", marginTop: "0.1rem" }, children: "Diunggah: " + fmtDateId(att.created_at) })
                                  ]
                                }),
                                jsxs("div", {
                                  style: { display: "flex", gap: "0.4rem" },
                                  children: [
                                    att.url && jsx("button", {
                                      type: "button",
                                      onClick: function() { setPreviewFile({ name: att.file_name, url: att.url }); },
                                      className: "att-btn primary",
                                      style: { padding: "0.28rem 0.6rem", fontSize: "0.73rem", cursor: "pointer" },
                                      children: "👁️ Pratinjau"
                                    }),
                                    att.url && jsx("a", {
                                      href: att.url,
                                      target: "_blank",
                                      rel: "noreferrer",
                                      className: "att-btn",
                                      style: { padding: "0.28rem 0.6rem", fontSize: "0.73rem", textDecoration: "none" },
                                      children: "⬇️ Unduh"
                                    })
                                  ]
                                })
                              ]
                            }, att.id || idx);
                          })
                        })
                      ]
                    })
                  )
                ]
              })
            ]
          })
        }),

        // QUICK UPDATE SPRIN MODAL
        sprinQuickRow && jsx("div", {
          role: "dialog",
          "aria-modal": true,
          onClick: function() { setSprinQuickRow(null); },
          style: { position: "fixed", inset: 0, zIndex: 9995, background: "rgba(15,23,42,0.7)", backdropFilter: "blur(3px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" },
          children: jsxs("div", {
            className: "cas-modal",
            onClick: function(ev) { ev.stopPropagation(); },
            style: { width: "36rem", maxWidth: "min(94vw, 680px)", background: "var(--cas-bg-surface, #ffffff)", color: "var(--cas-text-primary, #0f172a)", border: "1px solid var(--cas-border, #cbd5e1)", borderRadius: "14px", padding: "1.25rem 1.35rem", boxShadow: "0 20px 50px rgba(2,6,23,0.35)", display: "grid", gap: "0.85rem" },
            children: [
              jsxs("div", {
                style: { display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "0.65rem", borderBottom: "1px solid var(--cas-border, #e2e8f0)" },
                children: [
                  jsx("div", { style: { fontWeight: 800, fontSize: "0.95rem", color: "#d97706" }, children: "📜 Tambah / Update Revisi Lampiran Sprin" }),
                  jsx("button", { type: "button", onClick: function() { setSprinQuickRow(null); }, style: { border: "none", background: "transparent", color: "var(--cas-text-secondary, #475569)", fontSize: "1rem", cursor: "pointer" }, children: "✕" })
                ]
              }),
              jsx("div", { style: { fontSize: "0.8rem", fontWeight: 700, color: "var(--cas-text-secondary, #334155)" }, children: sprinQuickRow.judul || sprinQuickRow.nama }),
              jsxs("div", {
                style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(14rem, 1fr))", gap: "0.65rem" },
                children: [
                  jsxs("div", {
                    children: [
                      jsx("label", { style: { display: "block", fontSize: "0.75rem", fontWeight: 700, marginBottom: "0.25rem" }, children: "Nomor Sprin / Revisi" }),
                      jsx(InputText, { value: sprinNomor, onChange: function(e) { setSprinNomor(e.target.value); }, placeholder: "Sprin/124/III/OPS.1.3./2026", style: { width: "100%", height: "38px", boxSizing: "border-box" } })
                    ]
                  }),
                  jsxs("div", {
                    children: [
                      jsx("label", { style: { display: "block", fontSize: "0.75rem", fontWeight: 700, marginBottom: "0.25rem" }, children: "Tanggal Sprin" }),
                      jsx("input", { type: "date", value: sprinTgl, onChange: function(e) { setSprinTgl(e.target.value); }, className: "p-inputtext p-component", style: { width: "100%", height: "38px", boxSizing: "border-box", padding: "0 0.5rem" } })
                    ]
                  })
                ]
              }),
              jsxs("div", {
                children: [
                  jsx("label", { style: { display: "block", fontSize: "0.75rem", fontWeight: 700, marginBottom: "0.25rem" }, children: "Catatan Perubahan / Perpanjangan Sprin" }),
                  jsx(InputText, { value: sprinCatatan, onChange: function(e) { setSprinCatatan(e.target.value); }, placeholder: "Mis: Sprin Awal / Perpanjangan Tahap II / Penambahan Satgas...", style: { width: "100%", height: "38px", boxSizing: "border-box" } })
                ]
              }),
              jsxs("div", {
                children: [
                  jsx("label", { style: { display: "block", fontSize: "0.75rem", fontWeight: 700, marginBottom: "0.25rem" }, children: "Pilih Berkas PDF Sprin" }),
                  jsx("input", { type: "file", accept: ".pdf,image/*", multiple: true, onChange: function(e) { setSprinFiles(Array.from(e.target.files || [])); } })
                ]
              }),
              jsxs("div", {
                style: { display: "flex", justifyContent: "flex-end", gap: "0.6rem", flexWrap: "wrap", marginTop: "0.4rem", paddingTop: "0.75rem", borderTop: "1px solid var(--cas-border, #e2e8f0)" },
                children: [
                  jsx("button", { type: "button", onClick: function() { setSprinQuickRow(null); }, className: "att-btn", style: { padding: "0.45rem 0.9rem", cursor: "pointer" }, children: "Batal" }),
                  jsx("button", { type: "button", disabled: sprinSaving, onClick: handleQuickSprinUpload, className: "att-btn primary", style: { padding: "0.45rem 1rem", cursor: "pointer", fontWeight: 800 }, children: sprinSaving ? "Menyimpan…" : "☁️ Simpan Revisi Sprin" })
                ]
              })
            ]
          })
        }),

        // LP TIMELINE MODAL
        lpTimelineModal && jsx("div", {
          role: "dialog",
          "aria-modal": true,
          onClick: function() { setLpTimelineModal(null); },
          style: { position: "fixed", inset: 0, zIndex: 9996, background: "rgba(15,23,42,0.7)", backdropFilter: "blur(3px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" },
          children: jsxs("div", {
            className: "cas-modal",
            onClick: function(ev) { ev.stopPropagation(); },
            style: { width: "48rem", maxWidth: "min(94vw, 680px)", maxHeight: "86vh", overflowY: "auto", background: "var(--cas-bg-surface, #ffffff)", color: "var(--cas-text-primary, #0f172a)", border: "1px solid var(--cas-border, #cbd5e1)", borderRadius: "14px", padding: "1.2rem 1.35rem", boxShadow: "0 20px 50px rgba(2,6,23,0.35)", display: "grid", gap: "0.75rem" },
            children: [
              jsxs("div", {
                style: { display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "0.65rem", borderBottom: "1px solid var(--cas-border, #e2e8f0)" },
                children: [
                  jsx("div", { style: { fontWeight: 800, fontSize: "0.95rem", color: "var(--cas-text-primary, #0f172a)" }, children: "🔍 Rincian Alur & Dokumen Penyidikan LP: " + (lpTimelineModal.no_laporan || "") }),
                  jsx("button", { type: "button", onClick: function() { setLpTimelineModal(null); }, style: { border: "none", background: "transparent", color: "var(--cas-text-secondary, #475569)", fontSize: "1rem", cursor: "pointer" }, children: "✕" })
                ]
              }),
              lpTimelineLoading ? jsx("div", { style: { padding: "1.5rem", textAlign: "center", color: "#64748b" }, children: "Memuat timeline dokumen LP…" }) :
              !lpTimelineData ? jsx("div", { style: { padding: "1rem", color: "#64748b" }, children: "Data timeline LP belum tersedia." }) :
              jsxs("div", {
                style: { display: "grid", gap: "0.5rem" },
                children: (lpTimelineData.dokumen || []).length === 0 ? jsx("div", { style: { color: "#94a3b8", fontSize: "0.82rem" }, children: "Belum ada dokumen surat pada LP ini." }) :
                (lpTimelineData.dokumen || []).map(function(d) {
                  return jsxs("div", {
                    style: { padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid #e2e8f0", background: "#f8fafc", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" },
                    children: [
                      jsxs("div", {
                        children: [
                          jsx("div", { style: { fontWeight: 800, fontSize: "0.82rem", color: "#0f172a" }, children: d.type_nama || d.type_code }),
                          jsx("div", { style: { fontSize: "0.74rem", color: "#475569" }, children: "No: " + (d.nomor_dokumen || "—") + " • Tgl: " + fmtDateId(d.tanggal_dokumen) })
                        ]
                      }),
                      jsxs("div", {
                        style: { display: "flex", gap: "0.35rem" },
                        children: (d.lampiran || []).map(function(att, k) {
                          return jsx("button", {
                            type: "button",
                            onClick: function() { setPreviewFile({ name: att.name || "Dokumen.pdf", url: att.url }); },
                            className: "att-btn primary",
                            style: { padding: "0.25rem 0.55rem", fontSize: "0.72rem", cursor: "pointer" },
                            children: "📄 Lihat PDF"
                          }, k);
                        })
                      })
                    ]
                  }, d.id);
                })
              })
            ]
          })
        }),

        // INLINE FILE PREVIEW MODAL
        previewFile && jsx("div", {
          onClick: function() { setPreviewFile(null); },
          style: { position: "fixed", inset: 0, zIndex: 9999, background: "rgba(15,23,42,0.8)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" },
          children: jsxs("div", {
            onClick: function(ev) { ev.stopPropagation(); },
            style: { width: "74rem", maxWidth: "96vw", background: "#ffffff", borderRadius: "12px", overflow: "hidden", display: "flex", flexDirection: "column" },
            children: [
              jsxs("div", {
                style: { padding: "0.75rem 1.1rem", background: "#0f172a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between" },
                children: [
                  jsx("span", { style: { fontWeight: 800, fontSize: "0.88rem" }, children: "📎 " + (previewFile.name || "Pratinjau Berkas") }),
                  jsxs("div", {
                    style: { display: "flex", gap: "0.5rem", alignItems: "center" },
                    children: [
                      previewFile.url && jsx("a", { href: previewFile.url, target: "_blank", rel: "noreferrer", style: { color: "#38bdf8", fontSize: "0.78rem", fontWeight: 700, textDecoration: "none" }, children: "⬇️ Buka / Unduh Tab Baru" }),
                      jsx("button", { type: "button", onClick: function() { setPreviewFile(null); }, style: { background: "#ef4444", border: "none", color: "#fff", borderRadius: "6px", padding: "0.25rem 0.6rem", cursor: "pointer", fontWeight: 800 }, children: "✕" })
                    ]
                  })
                ]
              }),
              jsx("div", {
                style: { padding: "0.75rem", height: "80vh", background: "#f1f5f9" },
                children: previewFile.url ? (
                  /\.(png|jpe?g|gif|webp|bmp|svg)(\?|$)/i.test(previewFile.name || previewFile.url) ?
                    jsx("img", { src: previewFile.url, alt: previewFile.name, style: { maxWidth: "100%", maxHeight: "100%", display: "block", margin: "0 auto", borderRadius: "8px" } }) :
                    jsx("iframe", { src: previewFile.url + "#toolbar=1", title: previewFile.name, style: { width: "100%", height: "100%", border: "none", borderRadius: "8px", background: "#fff" } })
                ) : jsx("div", { style: { padding: "2rem", textAlign: "center", color: "#64748b" }, children: "URL pratinjau berkas tidak tersedia." })
              })
            ]
          })
        })
      ]
    });
  }])}]);
