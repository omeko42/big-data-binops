(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,21663,e=>{"use strict";var t=e.i(71645),a=e.i(48264),n=e.i(43456),r=e.i(29168),l=e.i(8630),i=e.i(40623),s=e.i(73193);function o(){return(o=Object.assign.bind()).apply(null,arguments)}function c(e){return(c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function u(e,t){(null==t||t>e.length)&&(t=e.length);for(var a=0,n=Array(t);a<t;a++)n[a]=e[a];return n}var d=n.ComponentBase.extend({defaultProps:{__TYPE:"Checkbox",autoFocus:!1,checked:!1,className:null,disabled:!1,falseValue:!1,icon:null,id:null,inputId:null,inputRef:null,invalid:!1,variant:null,name:null,onChange:null,onContextMenu:null,onMouseDown:null,readOnly:!1,required:!1,style:null,tabIndex:null,tooltip:null,tooltipOptions:null,trueValue:!0,value:null,children:void 0},css:{classes:{box:"p-checkbox-box",input:"p-checkbox-input",icon:"p-checkbox-icon",root:function(e){var t=e.props,a=e.checked,n=e.context;return(0,s.classNames)("p-checkbox p-component",{"p-highlight":a,"p-disabled":t.disabled,"p-invalid":t.invalid,"p-variant-filled":t.variant?"filled"===t.variant:n&&"filled"===n.inputStyle})}}}});function p(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),a.push.apply(a,n)}return a}function m(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?p(Object(a),!0).forEach(function(t){!function(e,t,a){var n;(n=function(e,t){if("object"!=c(e)||!e)return e;var a=e[Symbol.toPrimitive];if(void 0!==a){var n=a.call(e,t||"default");if("object"!=c(n))return n;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(t,"string"),(t="symbol"==c(n)?n:n+"")in e)?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a}(e,t,a[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):p(Object(a)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))})}return e}var h=t.memo(t.forwardRef(function(e,c){var p,h,f,b,y,g,x,v=(0,r.useMergeProps)(),j=t.useContext(a.PrimeReactContext),k=d.getProps(e,j),C=function(e){if(Array.isArray(e))return e}(p=t.useState(!1))||function(e){var t=null==e?null:"u">typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=t){var a,n,r,l,i=[],s=!0,o=!1;try{r=(t=t.call(e)).next,!1;for(;!(s=(a=r.call(t)).done)&&(i.push(a.value),2!==i.length);s=!0);}catch(e){o=!0,n=e}finally{try{if(!s&&null!=t.return&&(l=t.return(),Object(l)!==l))return}finally{if(o)throw n}}return i}}(p)||function(e){if(e){if("string"==typeof e)return u(e,2);var t=({}).toString.call(e).slice(8,-1);return"Object"===t&&e.constructor&&(t=e.constructor.name),"Map"===t||"Set"===t?Array.from(e):"Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?u(e,2):void 0}}(p)||function(){throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}(),S=C[0],w=C[1],I=d.setMetaData({props:k,state:{focused:S},context:{checked:k.checked===k.trueValue,disabled:k.disabled}}),O=I.ptm,T=I.cx,P=I.isUnstyled;(0,n.useHandleStyle)(d.css.styles,P,{name:"checkbox"});var D=t.useRef(null),N=t.useRef(k.inputRef),R=function(){return k.checked===k.trueValue},E=function(e){if(!k.disabled&&!k.readOnly&&k.onChange){var t,a=R()?k.falseValue:k.trueValue,n={originalEvent:e,value:k.value,checked:a,stopPropagation:function(){null==e||e.stopPropagation()},preventDefault:function(){null==e||e.preventDefault()},target:{type:"checkbox",name:k.name,id:k.id,value:k.value,checked:a}};null==k||null==(t=k.onChange)||t.call(k,n),e.defaultPrevented||s.DomHandler.focus(N.current)}},M=function(e){var t;w(!0),null==k||null==(t=k.onFocus)||t.call(k,e)},W=function(e){var t;w(!1),null==k||null==(t=k.onBlur)||t.call(k,e)};t.useImperativeHandle(c,function(){return{props:k,focus:function(){return s.DomHandler.focus(N.current)},getElement:function(){return D.current},getInput:function(){return N.current}}}),t.useEffect(function(){s.ObjectUtils.combinedRefs(N,k.inputRef)},[N,k.inputRef]),(0,r.useUpdateEffect)(function(){N.current.checked=R()},[k.checked,k.trueValue]),(0,r.useMountEffect)(function(){k.autoFocus&&s.DomHandler.focus(N.current,k.autoFocus)});var A=R(),L=s.ObjectUtils.isNotEmpty(k.tooltip),z=d.getOtherProps(k),U=v({id:k.id,className:(0,s.classNames)(k.className,T("root",{checked:A,context:j})),style:k.style,"data-p-highlight":A,"data-p-disabled":k.disabled,onContextMenu:k.onContextMenu,onMouseDown:k.onMouseDown},z,O("root"));return t.createElement(t.Fragment,null,t.createElement("div",o({ref:D},U),(h=s.ObjectUtils.reduceKeys(z,s.DomHandler.ARIA_PROPS),f=v(m({id:k.inputId,type:"checkbox",className:T("input"),name:k.name,tabIndex:k.tabIndex,onFocus:function(e){return M(e)},onBlur:function(e){return W(e)},onChange:function(e){return E(e)},disabled:k.disabled,readOnly:k.readOnly,required:k.required,"aria-invalid":k.invalid,checked:A},h),O("input")),t.createElement("input",o({ref:N},f))),(b=v({className:T("icon")},O("icon")),y=v({className:T("box",{checked:A}),"data-p-highlight":A,"data-p-disabled":k.disabled},O("box")),g=A?k.icon||t.createElement(l.CheckIcon,b):null,x=s.IconUtils.getJSXIcon(g,m({},b),{props:k,checked:A}),t.createElement("div",y,x))),L&&t.createElement(i.Tooltip,o({target:D,content:k.tooltip,pt:O("tooltip")},k.tooltipOptions)))}));h.displayName="Checkbox",e.s(["Checkbox",0,h])},62368,e=>{"use strict";let t=(0,e.i(56420).default)("download",[["path",{d:"M12 15V3",key:"m9g1x1"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["path",{d:"m7 10 5 5 5-5",key:"brsn70"}]]);e.s(["Download",0,t],62368)},71407,e=>{"use strict";var t=e.i(71645),a=e.i(44506);function n(){return(n=Object.assign.bind()).apply(null,arguments)}var r=t.memo(t.forwardRef(function(e,r){var l=a.IconBase.getPTI(e);return t.createElement("svg",n({ref:r,width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",xmlns:"http://www.w3.org/2000/svg"},l),t.createElement("path",{d:"M13.2222 7.77778H0.777778C0.571498 7.77778 0.373667 7.69584 0.227806 7.54998C0.0819442 7.40412 0 7.20629 0 7.00001C0 6.79373 0.0819442 6.5959 0.227806 6.45003C0.373667 6.30417 0.571498 6.22223 0.777778 6.22223H13.2222C13.4285 6.22223 13.6263 6.30417 13.7722 6.45003C13.9181 6.5959 14 6.79373 14 7.00001C14 7.20629 13.9181 7.40412 13.7722 7.54998C13.6263 7.69584 13.4285 7.77778 13.2222 7.77778Z",fill:"currentColor"}))}));r.displayName="MinusIcon",e.s(["MinusIcon",0,r])},74660,e=>{"use strict";var t=e.i(43476),a=e.i(9573);e.s(["default",0,function({refreshing:e,updatedAt:n,onRefresh:r}){return(0,t.jsxs)("div",{className:"dash-refresh",children:[(0,t.jsxs)("span",{className:"dash-refresh-time",children:[(0,t.jsx)("span",{className:`dash-dot${e?" live":""}`}),"Diperbarui ",(0,a.fmtUpdated)(n)]}),(0,t.jsxs)("button",{type:"button",className:"dash-refresh-btn",onClick:r,disabled:e,title:"Perbarui data sekarang",children:[(0,t.jsx)("i",{className:`pi pi-refresh${e?" pi-spin":""}`})," ",e?"MemuatΓÇª":"Refresh"]})]})}])},38266,e=>{
"use strict";
var t = e.i(43476), // jsx-runtime
    a = e.i(71645), // React
    n = e.i(55050), // TreeTable
    r = e.i(24718), // Column
    l = e.i(68242), // Dropdown
    i = e.i(48314), // MultiSelect
    s = e.i(44080), // InputText
    o = e.i(21663), // Checkbox
    c = e.i(1743),  // Button
    u = e.i(85118); // Toast

var p = e.i(62368), // Download
    m = e.i(54858), // apiAuth
    h = e.i(9573),  // utils
    f = e.i(74660); // AutoRefresh

let b = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
let y = { PENYELIDIKAN: "LIDIK", PENYIDIKAN: "SIDIK" };

function g(e) {
    return { key: e.kode, data: e, leaf: !e.has_children };
}

e.s(["default", 0, function() {
    let toastRef = (0, a.useRef)(null);
    let editorMountRef = (0, a.useRef)(null);
    let docEditorInstance = (0, a.useRef)(null);
    let getDocToken = () => {
        try {
            return localStorage.getItem("auth.access_token") || (JSON.parse(localStorage.getItem("auth") || "{}").access_token || "");
        } catch (e) { return ""; }
    };
    let docFetch = async (url, opts = {}) => {
        let tok = getDocToken();
        if (!tok) {
            try { localStorage.clear(); sessionStorage.clear(); } catch (e) {}
            window.location.replace("/login");
            throw new Error("Unauthorized");
        }
        let headers = Object.assign({}, opts.headers || {}, { Authorization: "Bearer " + tok });
        let res = await fetch(url, Object.assign({}, opts, { headers }));
        if (res.status === 401) {
            try {
                await m.apiAuth.get("/bdb/menu-access");
                tok = getDocToken();
                if (tok) {
                    headers.Authorization = "Bearer " + tok;
                    res = await fetch(url, Object.assign({}, opts, { headers }));
                }
            } catch (e) {
                try { localStorage.clear(); sessionStorage.clear(); } catch (err) {}
                window.location.replace("/login?expired=1");
                throw e;
            }
            if (res.status === 401) {
                try { localStorage.clear(); sessionStorage.clear(); } catch (err) {}
                window.location.replace("/login?expired=1");
                throw new Error("Unauthorized");
            }
        }
        return res;
    };

    // Active Navigation Tab
    let [activeTab, setActiveTab] = (0, a.useState)("editor"); // 'editor' | 'arsip' | 'stamp' | 'rekap'

    // Document State
    let [docList, setDocList] = (0, a.useState)([]);
    let [activeDocId, setActiveDocId] = (0, a.useState)("anev-master-default");
    let [currentDoc, setCurrentDoc] = (0, a.useState)(null);
    let [loadingDoc, setLoadingDoc] = (0, a.useState)(false);
    let [savingDoc, setSavingDoc] = (0, a.useState)(false);
    let [exportingPdf, setExportingPdf] = (0, a.useState)(false);

    // Editor Settings / Toggles
    let [kopTipe, setKopTipe] = (0, a.useState)("MABES"); // 'MABES' | 'POLDA'
    let [opsiTtd, setOpsiTtd] = (0, a.useState)("POLRI"); // 'POLRI' | 'PNS'

    // Filter Terpadu
    let [filterPeriodeTipe, setFilterPeriodeTipe] = (0, a.useState)("BULANAN");
    let [filterDateStart, setFilterDateStart] = (0, a.useState)("2026-08-01");
    let [filterDateEnd, setFilterDateEnd] = (0, a.useState)("2026-08-31");
    let [filterSatkerId, setFilterSatkerId] = (0, a.useState)(null);
    let [filterSatkerNama, setFilterSatkerNama] = (0, a.useState)("BARESKRIM POLRI");
    let [syncingData, setSyncingData] = (0, a.useState)(false);

    // Stamp Modal / State
    let [stampData, setStampData] = (0, a.useState)(null);
    let [showStampModal, setShowStampModal] = (0, a.useState)(false);

    // New Document Modal State
    let [showNewModal, setShowNewModal] = (0, a.useState)(false);
    // Unified Filter Kinerja Perkara states
    let [unifiedFilterOpen, setUnifiedFilterOpen] = (0, a.useState)(false);
    let [unifiedFilterTab, setUnifiedFilterTab] = (0, a.useState)(0);
    let [activeFilterCount, setActiveFilterCount] = (0, a.useState)(2);
    let [kpPeriodMode, setKpPeriodMode] = (0, a.useState)("year");
    let [kpPeriodYear, setKpPeriodYear] = (0, a.useState)("2026");
    let [kpPeriodMonth, setKpPeriodMonth] = (0, a.useState)("08");
    let [kpCustomFrom, setKpCustomFrom] = (0, a.useState)("2026-08-01");
    let [kpCustomTo, setKpCustomTo] = (0, a.useState)("2026-08-31");
    let [kpKelompokData, setKpKelompokData] = (0, a.useState)("kewilayahan");
    let [kpCakupanSatker, setKpCakupanSatker] = (0, a.useState)("INTERNAL_RESERSE");
    let [activeKelompokCrime, setActiveKelompokCrime] = (0, a.useState)("ALL");
    let [activeTipidCrime, setActiveTipidCrime] = (0, a.useState)("ALL");
    let [activeGolonganCrime, setActiveGolonganCrime] = (0, a.useState)("ALL");
    let [kpModelCalc, setKpModelCalc] = (0, a.useState)("new");
    let [kpKelompokHitung, setKpKelompokHitung] = (0, a.useState)("ALL");
    let [syncedKinerja, setSyncedKinerja] = (0, a.useState)(null);
    let [filterPeriodeLabel, setFilterPeriodeLabel] = (0, a.useState)("Agustus 2026");
    let [newTitle, setNewTitle] = (0, a.useState)("");

    // Rekap CT/CC State
    let [rekapNodes, setRekapNodes] = (0, a.useState)([]);
    let [rekapTotals, setRekapTotals] = (0, a.useState)({ ct: 0, cc: 0, total: 0 });
    let [rekapLoading, setRekapLoading] = (0, a.useState)(false);
    let [rekapExpanded, setRekapExpanded] = (0, a.useState)({});
    let [metaYears, setMetaYears] = (0, a.useState)([]);
    let [metaStatuses, setMetaStatuses] = (0, a.useState)([]);
    let [filterYear, setFilterYear] = (0, a.useState)(null);
    let [filterMonth, setFilterMonth] = (0, a.useState)(null);
    let [filterStatusArr, setFilterStatusArr] = (0, a.useState)([]);
    let [checkboxFilters, setCheckboxFilters] = (0, a.useState)({ tahun: false, bulan: false, periode: false, status: false });

    // Satker Options
    let [satkerOptions, setSatkerOptions] = (0, a.useState)([
        { label: "MABES BARESKRIM POLRI (Nasional)", value: null },
        { label: "DITIPIDUM BARESKRIM POLRI", value: 1 },
        { label: "DITIPIDEKSUS BARESKRIM POLRI", value: 2 },
        { label: "DITIPIDKOR BARESKRIM POLRI", value: 3 },
        { label: "DITIPIDSIBER BARESKRIM POLRI", value: 4 },
        { label: "DITIPIDNARKOBA BARESKRIM POLRI", value: 5 },
        { label: "POLDA JAWA TIMUR", value: 35 },
        { label: "POLDA METRO JAYA", value: 31 },
        { label: "POLDA JAWA BARAT", value: 32 },
        { label: "POLDA JAWA TENGAH", value: 33 },
        { label: "POLDA SUMATERA UTARA", value: 12 }
    ]);

    // 1. Fetch document list from /doc-api/list
    let fetchDocList = (0, a.useCallback)(async () => {
        try {
            let res = await docFetch("/doc-api/list");
            let json = await res.json();
            if (json.status === 1) {
                setDocList(json.data || []);
            }
        } catch (err) {
            console.error("Failed to fetch doc list:", err);
        }
    }, []);

    // 2. Load single document into ONLYOFFICE
    let loadDocumentIntoEditor = (0, a.useCallback)(async (docId) => {
        setLoadingDoc(true);
        try {
            let res = await docFetch("/doc-api/get?id=" + encodeURIComponent(docId));
            let json = await res.json();
            if (json.status === 1 && json.data) {
                let doc = json.data.document;
                setCurrentDoc(doc);
                setActiveDocId(doc.id);
                setKopTipe(doc.kop_tipe || "MABES");
                setOpsiTtd(doc.opsi_ttd || "POLRI");
                if (doc.satker_nama) setFilterSatkerNama(doc.satker_nama);
                if (doc.date_start) setFilterDateStart(doc.date_start);
                if (doc.date_end) setFilterDateEnd(doc.date_end);

                let config = json.data.editorConfig;

                // Ensure DocsAPI is loaded
                let initDocEditor = () => {
                    if (window.DocsAPI && window.DocsAPI.DocEditor) {
                        if (docEditorInstance.current) {
                            try {
                                docEditorInstance.current.destroyEditor();
                            } catch (e) {
                                console.warn("destroyEditor error:", e);
                            }
                            docEditorInstance.current = null;
                        }

                        // Clear container placeholder
                        let container = document.getElementById("onlyoffice-iframe-container");
                        if (container) {
                            container.innerHTML = "<div id='onlyoffice-mount-point' style='width:100%;height:100%;'></div>";
                        }

                        config.events = {
                            onAppReady: () => {
                                console.log("ONLYOFFICE Ready for doc:", doc.id);
                            },
                            onDocumentStateChange: (event) => {
                                console.log("Doc state change:", event.data);
                            },
                            onRequestSave: () => {
                                console.log("ONLYOFFICE onRequestSave triggered");
                                handleSaveArchive();
                            },
                            onError: (event) => {
                                console.error("ONLYOFFICE Error event:", event.data);
                            }
                        };

                        docEditorInstance.current = new window.DocsAPI.DocEditor("onlyoffice-mount-point", config);
                    }
                };

                if (!window.DocsAPI) {
                    let script = document.createElement("script");
                    script.src = "/onlyoffice/web-apps/apps/api/documents/api.js";
                    script.onload = () => {
                        initDocEditor();
                    };
                    document.head.appendChild(script);
                } else {
                    setTimeout(initDocEditor, 50);
                }
            } else {
                toastRef.current?.show({ severity: "error", summary: "Gagal", detail: json.message || "Gagal memuat dokumen" });
            }
        } catch (err) {
            console.error("Error loading document:", err);
            toastRef.current?.show({ severity: "error", summary: "Error", detail: "Gagal memuat editor ONLYOFFICE" });
        } finally {
            setLoadingDoc(false);
        }
    }, []);

    // Load initial doc list and default document on mount
    (0, a.useEffect)(() => {
        fetchDocList();
        loadDocumentIntoEditor(activeDocId);
        // Load dynamic 37 satkers from CAS backend
        docFetch("/doc-api/satkers")
            .then(r => r.json())
            .then(j => {
                if (j.status === 1 && j.data && j.data.length > 0) {
                    setSatkerOptions(j.data);
                }
            })
            .catch(err => console.error("Error loading satkers:", err));

        return () => {
            if (docEditorInstance.current) {
                try { docEditorInstance.current.destroyEditor(); } catch (e) {}
                docEditorInstance.current = null;
            }
        };
    }, []);

    // Helper: Normalize Periode Tipe & Dates
    let handlePeriodeTipeChange = (tipe) => {
        setFilterPeriodeTipe(tipe);
        let start = "2026-08-01";
        let end = "2026-08-31";
        let lbl = "Bulan Agustus 2026";
        if (tipe === "BULANAN") {
            start = "2026-08-01"; end = "2026-08-31"; lbl = "Bulan Agustus 2026";
        } else if (tipe === "TRIWULAN") {
            start = "2026-07-01"; end = "2026-09-30"; lbl = "Triwulan III Tahun 2026";
        } else if (tipe === "SEMESTER") {
            start = "2026-07-01"; end = "2026-12-31"; lbl = "Semester II Tahun 2026";
        } else if (tipe === "TAHUNAN") {
            start = "2026-01-01"; end = "2026-12-31"; lbl = "Tahun 2026";
        } else if (tipe === "HARIAN") {
            start = "2026-10-12"; end = "2026-10-12"; lbl = "12 Oktober 2026";
        } else if (tipe === "MINGGUAN") {
            start = "2026-10-05"; end = "2026-10-12"; lbl = "Minggu II Oktober 2026";
        }
        setFilterDateStart(start);
        setFilterDateEnd(end);
        setFilterPeriodeLabel(lbl);
    };

    // Helper: Normalize Satker Change & Kop Surat
    let handleSatkerChange = (val) => {
        setFilterSatkerId(val);
        let sObj = satkerOptions.find(o => o.value === val);
        let sNama = sObj ? sObj.label : "BARESKRIM POLRI";
        setFilterSatkerNama(sNama);
        if (sNama.toUpperCase().includes("BARESKRIM") || val === 13 || (sObj && sObj.tipe === "MABES")) {
            setKopTipe("MABES");
        } else {
            setKopTipe("SATWIL");
        }
    };

    // Helper: Kop Surat Toggle with metadata update
    let handleKopChange = async (newKop) => {
        setKopTipe(newKop);
        toastRef.current?.show({ severity: "info", summary: "Format Kop Surat", detail: "Kop surat disesuaikan ke " + (newKop === "MABES" ? "Mabes Polri" : "Satwil / Polda") + ".", life: 2000 });
        try {
            await docFetch("/doc-api/update-meta", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: activeDocId, kop_tipe: newKop })
            });
            fetchDocList();
        } catch (e) {}
    };

    // Helper: TTD Toggle with metadata update
    let handleTtdChange = async (newTtd) => {
        setOpsiTtd(newTtd);
        toastRef.current?.show({ severity: "info", summary: "Opsi Penandatangan", detail: "Format TTD disesuaikan untuk " + (newTtd === "POLRI" ? "Anggota POLRI (NRP)" : "PNS POLRI (NIP)") + ".", life: 2000 });
        try {
            await docFetch("/doc-api/update-meta", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: activeDocId, opsi_ttd: newTtd })
            });
            fetchDocList();
        } catch (e) {}
    };

    // Helper: Reset Unified Filter
    let handleResetFilter = () => {
        setKpPeriodMode("year");
        setKpPeriodYear("2026");
        setKpPeriodMonth("08");
        setKpCustomFrom("2026-08-01");
        setKpCustomTo("2026-08-31");
        setFilterSatkerId(13);
        setFilterSatkerNama("BARESKRIM POLRI");
        setActiveKelompokCrime("ALL");
        setActiveTipidCrime("ALL");
        setActiveGolonganCrime("ALL");
        setKpModelCalc("new");
        setKpKelompokHitung("ALL");
        setActiveFilterCount(1);
    };

    // Helper: Apply Unified Filter & Sync CAS DB
    let handleApplyFilter = async () => {
        setUnifiedFilterOpen(false);
        let start = "2026-08-01";
        let end = "2026-08-31";
        let lbl = "Tahun 2026";

        if (kpPeriodMode === "year") {
            start = kpPeriodYear + "-01-01";
            end = kpPeriodYear + "-12-31";
            lbl = "Tahun " + kpPeriodYear;
        } else if (kpPeriodMode === "month") {
            let m = kpPeriodMonth || "08";
            let y = kpPeriodYear || "2026";
            let lastDay = new Date(Number(y), Number(m), 0).getDate();
            start = y + "-" + m + "-01";
            end = y + "-" + m + "-" + String(lastDay).padStart(2, "0");
            let mNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
            lbl = mNames[Number(m) - 1] + " " + y;
        } else if (kpPeriodMode === "custom") {
            start = kpCustomFrom || "2026-08-01";
            end = kpCustomTo || "2026-08-31";
            lbl = start + " s.d. " + end;
        }

        setFilterDateStart(start);
        setFilterDateEnd(end);
        setFilterPeriodeLabel(lbl);
        setFilterPeriodeTipe(kpPeriodMode === "year" ? "TAHUNAN" : (kpPeriodMode === "month" ? "BULANAN" : "CUSTOM"));

        // Calculate active filter count
        let count = 0;
        if (kpPeriodMode !== "year" || kpPeriodYear !== "2026") count++;
        if (filterSatkerId && filterSatkerId !== 13) count++;
        if (activeKelompokCrime !== "ALL") count++;
        if (activeTipidCrime !== "ALL") count++;
        if (activeGolonganCrime !== "ALL") count++;
        setActiveFilterCount(Math.max(1, count));

        // Auto-adjust kop surat
        if (filterSatkerNama && (filterSatkerNama.toUpperCase().includes("BARESKRIM") || filterSatkerId === 13)) {
            setKopTipe("MABES");
        } else {
            setKopTipe("SATWIL");
        }

        // Trigger live CAS DB Sync
        setSyncingData(true);
        toastRef.current?.show({
            severity: "info",
            summary: "Menerapkan Filter Terpadu...",
            detail: "Menghubungkan Database CAS untuk " + filterSatkerNama + " (" + lbl + ")...",
            life: 2500
        });

        try {
            let sf = (activeKelompokCrime === "NARKOBA" || activeTipidCrime === "TIPIDNARKOBA") ? "NARKOBA" :
                     (activeKelompokCrime === "KRIMSUS" || ["TIPIDEKSUS","TIPIDKOR","TIPIDTER","TIPIDSIBER"].includes(activeTipidCrime)) ? "KRIMSUS" : "KRIMUM";

            let res = await docFetch("/doc-api/sync-cas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    docId: activeDocId,
                    satkerId: filterSatkerId,
                    satkerNama: filterSatkerNama,
                    satuanFungsi: sf,
                    from: start,
                    to: end,
                    periodeTipe: kpPeriodMode === "year" ? "TAHUNAN" : (kpPeriodMode === "month" ? "BULANAN" : "CUSTOM")
                })
            });
            let json = await res.json();
            if (json.status === 1) {
                setSyncedKinerja(json.data);
                toastRef.current?.show({
                    severity: "success",
                    summary: "Filter Berhasil Diterapkan",
                    detail: "Data Terhubung: CT " + Number(json.data.ct).toLocaleString('id-ID') + " | CC " + Number(json.data.cc).toLocaleString('id-ID') + " (" + json.data.cr + "%) | Clock: " + json.data.crimeClock,
                    life: 4500
                });
                await fetchDocList();
                loadDocumentIntoEditor(activeDocId);
            }
        } catch (err) {
            console.error("Filter sync error:", err);
        } finally {
            setSyncingData(false);
        }
    };

    // 3. Save / Update Document to Archive
    let handleSaveArchive = async () => {
        setSavingDoc(true);
        toastRef.current?.show({ severity: "info", summary: "Menyimpan Dokumen...", detail: "Menyinkronkan perubahan ke arsip CAS & mengenkripsi nama berkas...", life: 2500 });
        try {
            try {
                await docFetch("/doc-api/forcesave?id=" + encodeURIComponent(activeDocId));
            } catch (e) {}

            await docFetch("/doc-api/update-meta", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: activeDocId,
                    kop_tipe: kopTipe,
                    opsi_ttd: opsiTtd,
                    satker_nama: filterSatkerNama,
                    satker_id: filterSatkerId,
                    date_start: filterDateStart,
                    date_end: filterDateEnd,
                    periode_tipe: filterPeriodeTipe,
                    periode_label: filterPeriodeLabel
                })
            });

            setTimeout(async () => {
                try {
                    let stampRes = await docFetch("/doc-api/stamp?id=" + encodeURIComponent(activeDocId));
                    let stampJson = await stampRes.json();
                    if (stampJson.status === 1) {
                        setStampData(stampJson.data);
                        let fn = stampJson.data.encryptedFilename || "SEC-ANEV-...";
                        let sc = stampJson.data.stampCode || "CAS-SEC-...";
                        toastRef.current?.show({
                            severity: "success",
                            summary: "Tersimpan & Terenkripsi",
                            detail: "Dokumen laporan telah tersimpan aman di arsip CAS.",
                            life: 4500
                        });
                    }
                } catch (e) {}
                await fetchDocList();
                setSavingDoc(false);
            }, 800);
        } catch (err) {
            toastRef.current?.show({ severity: "error", summary: "Gagal", detail: "Gagal menyimpan dokumen." });
            setSavingDoc(false);
        }
    };

    // 4. Export PDF
    let handleExportPdf = () => {
        setExportingPdf(true);
        toastRef.current?.show({ severity: "info", summary: "Mengonversi Dokumen...", detail: "ONLYOFFICE Document Converter sedang merender PDF resmi...", life: 3000 });
        let url = "/doc-api/export-pdf?id=" + encodeURIComponent(activeDocId) + "&token=" + encodeURIComponent(getDocToken());
        let link = document.createElement("a");
        link.href = url;
        link.download = currentDoc?.filename ? currentDoc.filename.replace(".docx", ".pdf") : "";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => setExportingPdf(false), 2000);
    };

    // 5. Download DOCX
    let handleDownloadDocx = () => {
        if (!activeDocId) return;
        let url = "/doc-api/download?id=" + encodeURIComponent(activeDocId) + "&token=" + encodeURIComponent(getDocToken());
        let link = document.createElement("a");
        link.href = url;
        link.download = currentDoc?.filename || "";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // 6. Create New Report Draft
    let handleCreateNewReport = async () => {
        if (!newTitle.trim()) {
            toastRef.current?.show({ severity: "warn", summary: "Perhatian", detail: "Judul laporan wajib diisi." });
            return;
        }
        try {
            let res = await docFetch("/doc-api/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: newTitle.trim(),
                    satkerNama: filterSatkerNama,
                    satkerId: filterSatkerId,
                    periodeTipe: filterPeriodeTipe,
                    periodeLabel: filterDateStart + " s.d. " + filterDateEnd,
                    dateStart: filterDateStart,
                    dateEnd: filterDateEnd,
                    opsiTtd: opsiTtd,
                    kopTipe: kopTipe
                })
            });
            let json = await res.json();
            if (json.status === 1) {
                toastRef.current?.show({ severity: "success", summary: "Sukses", detail: "Laporan baru berhasil dibuat." });
                setShowNewModal(false);
                setNewTitle("");
                await fetchDocList();
                setActiveTab("editor");
                loadDocumentIntoEditor(json.data.id);
            }
        } catch (err) {
            toastRef.current?.show({ severity: "error", summary: "Gagal", detail: "Gagal membuat laporan baru." });
        }
    };

    // 7. Sync Data from CAS Backend
    let handleSyncCASData = async () => {
        setSyncingData(true);
        toastRef.current?.show({ severity: "info", summary: "Sinkronisasi CAS...", detail: "Menghubungkan Database Kinerja Perkara untuk " + filterSatkerNama + "...", life: 2500 });
        try {
            let res = await docFetch("/doc-api/sync-cas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    docId: activeDocId,
                    satkerId: filterSatkerId,
                    satkerNama: filterSatkerNama,
                    from: filterDateStart,
                    to: filterDateEnd,
                    periodeTipe: filterPeriodeTipe
                })
            });
            let json = await res.json();
            if (json.status === 1) {
                setSyncedKinerja(json.data);
                toastRef.current?.show({
                    severity: "success",
                    summary: "Sinkronisasi Berhasil",
                    detail: "Data CAS Terhubung: CT " + Number(json.data.ct).toLocaleString('id-ID') + " | CC " + Number(json.data.cc).toLocaleString('id-ID') + " (" + json.data.cr + "%) | Clock: " + json.data.crimeClock,
                    life: 4500
                });
                fetchDocList();
            } else {
                toastRef.current?.show({ severity: "error", summary: "Gagal", detail: json.message || "Gagal sinkron data" });
            }
        } catch (err) {
            console.error("Sync CAS error:", err);
            toastRef.current?.show({ severity: "error", summary: "Gagal Sinkronisasi", detail: "Koneksi ke backend CAS terganggu." });
        } finally {
            setSyncingData(false);
        }
    };

    // 8. View Stamp
    let handleOpenStamp = async (docId) => {
        try {
            let res = await docFetch("/doc-api/stamp?id=" + encodeURIComponent(docId || activeDocId));
            let json = await res.json();
            if (json.status === 1) {
                setStampData(json.data);
                setShowStampModal(true);
            }
        } catch (err) {
            toastRef.current?.show({ severity: "error", summary: "Gagal", detail: "Gagal memuat data stamp keamanan." });
        }
    };

    // 9. Delete Doc
    let handleDeleteDoc = async (docId) => {
        if (!(window.__casConfirmDelete ? await window.__casConfirmDelete({ title: "Konfirmasi Hapus Dokumen", message: "Apakah Anda yakin ingin menghapus dokumen ini dari arsip? Tindakan ini tidak dapat dibatalkan.", confirmText: "Ya, Hapus" }) : window.confirm("Apakah Anda yakin ingin menghapus dokumen ini dari arsip?"))) return;
        try {
            await docFetch("/doc-api/delete?id=" + encodeURIComponent(docId), { method: "POST" });
            toastRef.current?.show({ severity: "success", summary: "Terhapus", detail: "Dokumen telah dihapus dari arsip." });
            await fetchDocList();
            if (activeDocId === docId) {
                loadDocumentIntoEditor("anev-master-default");
            }
        } catch (err) {
            toastRef.current?.show({ severity: "error", summary: "Gagal", detail: "Gagal menghapus dokumen." });
        }
    };

    // 10. Rekap TreeTable logic
    (0, a.useEffect)(() => {
        m.apiAuth.get("/bdb/anev/meta").then(res => {
            let d = res.data?.data;
            setMetaYears(d?.years || []);
            setMetaStatuses(d?.statuses || []);
        }).catch(() => {});
    }, []);

    let rekapParams = (0, a.useMemo)(() => ({
        ...(checkboxFilters.tahun && filterYear ? { year: filterYear } : {}),
        ...(checkboxFilters.bulan && filterMonth ? { month: filterMonth } : {}),
        ...(checkboxFilters.periode && filterDateStart ? { date_from: filterDateStart } : {}),
        ...(checkboxFilters.periode && filterDateEnd ? { date_to: filterDateEnd } : {}),
        ...(checkboxFilters.status && filterStatusArr.length ? { status: filterStatusArr.join(",") } : {})
    }), [checkboxFilters, filterYear, filterMonth, filterDateStart, filterDateEnd, filterStatusArr]);

    let loadRekap = (0, a.useCallback)(async () => {
        setRekapLoading(true);
        setRekapExpanded({});
        try {
            let res = await m.apiAuth.get("/bdb/anev/rekap", { params: rekapParams });
            let d = res.data?.data;
            setRekapNodes((d?.nodes || []).map(g));
            setRekapTotals(d?.totals || { ct: 0, cc: 0, total: 0 });
        } catch (err) {
            console.error("Gagal rekap:", err);
        } finally {
            setRekapLoading(false);
        }
    }, [rekapParams]);

    let onExpandRekap = async (event) => {
        let node = event.node;
        if (!node.children && !node.leaf) {
            try {
                let res = await m.apiAuth.get("/bdb/anev/rekap", { params: { ...rekapParams, parent: node.key } });
                let children = (res.data?.data?.nodes || []).map(g);
                setRekapNodes(prev => (function update(list, targetKey, newChildren) {
                    return list.map(item => item.key === targetKey ? { ...item, children: newChildren } : item.children ? { ...item, children: update(item.children, targetKey, newChildren) } : item);
                })(prev, node.key, children));
            } catch (e) {
                console.error(e);
            }
        }
    };

    (0, a.useEffect)(() => {
        if (activeTab === "rekap") {
            loadRekap();
        }
    }, [activeTab, loadRekap]);

    let statusColumns = (0, a.useMemo)(() => [
        ...metaStatuses.filter(e => e.kategori === "CT"),
        ...metaStatuses.filter(e => e.kategori === "CC")
    ], [metaStatuses]);

    let yearOptions = [{ label: "Semua tahun", value: null }, ...metaYears.map(e => ({ label: String(e), value: e }))];
    let monthOptions = [{ label: "Semua bulan", value: null }, ...b.map((m, i) => ({ label: m, value: i + 1 }))];
    let statusFilterOptions = metaStatuses.map(e => ({ label: e.nama + " (" + e.kategori + ")", value: e.code }));

    return (0, t.jsxs)("div", {
        className: "cms-anev-container",
        style: { padding: "0 0.5rem" },
        children: [
            (0, t.jsx)(u.Toast, { ref: toastRef }),

            // Top Header & Page Navigation
            (0, t.jsxs)("div", {
                style: {
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "1rem",
                    marginBottom: "1rem",
                    borderBottom: "1px solid #e2e8f0",
                    paddingBottom: "0.75rem"
                },
                children: [
                    (0, t.jsxs)("div", {
                        children: [
                            (0, t.jsxs)("h1", {
                                className: "cms-page-title",
                                style: { display: "flex", alignItems: "center", gap: "0.6rem", margin: 0, fontSize: "1.35rem", fontWeight: 800, color: "var(--cas-text-primary, #0f172a)" },
                                children: [
                                    (0, t.jsx)("i", { className: "pi pi-file-edit", style: { fontSize: "1.4rem", color: "#2563eb" } }),
                                    "Penyusunan & Analisis Laporan Anev CT/CC"
                                ]
                            }),
                            (0, t.jsx)("p", {
                                className: "cms-page-sub",
                                style: { margin: "0.2rem 0 0", color: "#64748b", fontSize: "0.82rem" },
                                children: "Sistem Dokumentasi Resmi Polri berbasis ONLYOFFICE Document Engine terintegrasi Database Kinerja Perkara CAS."
                            })
                        ]
                    }),

                    // Top Action Tabs (Clean 2-tab design)
                    (0, t.jsxs)("div", {
                        style: { display: "flex", gap: "0.4rem", background: "var(--cas-surface-hover, #f1f5f9)", padding: "0.3rem", borderRadius: "8px", border: "1px solid var(--cas-border, #e2e8f0)" },
                        children: [
                            (0, t.jsxs)(c.Button, {
                                size: "small",
                                severity: activeTab === "editor" ? "primary" : "secondary",
                                text: activeTab !== "editor",
                                onClick: () => {
                                    setActiveTab("editor");
                                    setTimeout(() => loadDocumentIntoEditor(activeDocId), 100);
                                },
                                style: { fontWeight: 700, fontSize: "0.82rem" },
                                children: [
                                    (0, t.jsx)("i", { className: "pi pi-file-edit", style: { marginRight: "0.4rem" } }),
                                    "Editor Laporan (ONLYOFFICE)"
                                ]
                            }),
                            (0, t.jsxs)(c.Button, {
                                size: "small",
                                severity: activeTab === "arsip" ? "primary" : "secondary",
                                text: activeTab !== "arsip",
                                onClick: () => {
                                    if (docEditorInstance.current) {
                                        try { docEditorInstance.current.destroyEditor(); } catch (e) {}
                                        docEditorInstance.current = null;
                                    }
                                    setActiveTab("arsip");
                                    fetchDocList();
                                },
                                style: { fontWeight: 700, fontSize: "0.82rem" },
                                children: [
                                    (0, t.jsx)("i", { className: "pi pi-folder", style: { marginRight: "0.4rem" } }),
                                    "Arsip Dokumen (" + docList.length + ")"
                                ]
                            })
                        ]
                    })
                ]
            }),

            // TAB 1: ONLYOFFICE EDITOR
            activeTab === "editor" && (0, t.jsxs)("div", {
                children: [
                    // Toolbar & Integrated Filter Bar (Clean Single Row)
                    (0, t.jsxs)("div", {
                        style: {
                            background: "var(--cas-card-bg, #ffffff)",
                            border: "1px solid var(--cas-border-strong, #cbd5e1)",
                            borderRadius: "8px",
                            padding: "0.6rem 0.85rem",
                            marginBottom: "0.75rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: "0.6rem",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                        },
                        children: [
                            // Left: Filter Perkara Trigger & Active Filter Badge
                            (0, t.jsxs)("div", {
                                style: { display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" },
                                children: [
                                    (0, t.jsxs)("div", {
                                        className: "kp-filter-wrapper",
                                                style: { position: "relative" },
                                                children: [
                                                    (0, t.jsx)(c.Button, {
                                                        label: "Filter Perkara (" + activeFilterCount + ") \u25BC",
                                                        icon: "pi pi-sliders-h",
                                                        outlined: true,
                                                        onClick: () => setUnifiedFilterOpen(!unifiedFilterOpen),
                                                        className: "att-btn kp-filter-trigger-btn" + (unifiedFilterOpen ? " active" : ""),
                                                        style: {
                                                            fontWeight: 700,
                                                            color: "#dc2626",
                                                            borderColor: "#dc2626",
                                                            backgroundColor: "rgba(220, 38, 38, 0.08)",
                                                            fontSize: "0.82rem"
                                                        }
                                                    }),

                                                    // Backdrop Overlay
                                                    unifiedFilterOpen && (0, t.jsx)("div", {
                                                        style: {
                                                            position: "fixed",
                                                            inset: 0,
                                                            zIndex: 2490,
                                                            background: "rgba(15, 23, 42, 0.4)",
                                                            backdropFilter: "blur(2px)"
                                                        },
                                                        onClick: () => setUnifiedFilterOpen(false)
                                                    }),

                                                    // Modal Popover Card (Matching Kinerja Perkara 100%)
                                                    unifiedFilterOpen && (0, t.jsx)("div", {
                                                        style: {
                                                            position: "fixed",
                                                            top: "50%",
                                                            left: "50%",
                                                            transform: "translate(-50%, -50%)",
                                                            zIndex: 2500,
                                                            width: "95%",
                                                            maxWidth: "38rem",
                                                            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
                                                            borderRadius: "14px",
                                                            overflow: "hidden",
                                                            background: "var(--cas-card-bg, #ffffff)"
                                                        },
                                                        children: (0, t.jsxs)("div", {
                                                            className: "kp-modal-card",
                                                            style: { width: "100%", maxWidth: "100%", margin: 0, borderRadius: "14px", background: "var(--cas-card-bg, #ffffff)" },
                                                            children: [
                                                                // Header
                                                                (0, t.jsxs)("div", {
                                                                    className: "kp-modal-header",
                                                                    style: { padding: "1rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--cas-border, #e2e8f0)", background: "var(--cas-surface-subtle, #f8fafc)" },
                                                                    children: [
                                                                        (0, t.jsxs)("div", {
                                                                            children: [
                                                                                (0, t.jsx)("div", {
                                                                                    className: "kp-modal-title",
                                                                                    style: { fontWeight: 800, fontSize: "1.05rem", color: "var(--cas-text-primary, #0f172a)" },
                                                                                    children: "\uD83C\uDF9B\uFE0F Filter & Parameter Kinerja Perkara"
                                                                                }),
                                                                                (0, t.jsx)("div", {
                                                                                    className: "kp-modal-sub",
                                                                                    style: { fontSize: "0.78rem", color: "#64748b", marginTop: "0.2rem" },
                                                                                    children: "Atur periode, satker kewilayahan, klasifikasi kejahatan, dan parameter analisis"
                                                                                })
                                                                            ]
                                                                        }),
                                                                        (0, t.jsx)("button", {
                                                                            type: "button",
                                                                            onClick: () => setUnifiedFilterOpen(false),
                                                                            style: { background: "transparent", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#94a3b8" },
                                                                            children: "\u2715"
                                                                        })
                                                                    ]
                                                                }),

                                                                // Tab Bar (4 Tabs)
                                                                (0, t.jsx)("div", {
                                                                    className: "kp-tab-bar",
                                                                    style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderBottom: "1px solid var(--cas-border, #e2e8f0)", background: "var(--cas-surface-hover, #f1f5f9)" },
                                                                    children: [
                                                                        { idx: 0, label: "\uD83D\uDCC5 Periode" },
                                                                        { idx: 1, label: "\uD83C\uDFDB\uFE0F Satker & Wilayah" },
                                                                        { idx: 2, label: "\u2696\uFE0F Kejahatan" },
                                                                        { idx: 3, label: "\u2699\uFE0F Parameter & Model" }
                                                                    ].map(tb =>
                                                                        (0, t.jsx)("button", {
                                                                            key: tb.idx,
                                                                            type: "button",
                                                                            onClick: () => setUnifiedFilterTab(tb.idx),
                                                                            className: "kp-tab-btn" + (unifiedFilterTab === tb.idx ? " active" : ""),
                                                                            style: {
                                                                                padding: "0.75rem 0.4rem",
                                                                                fontSize: "0.8rem",
                                                                                fontWeight: unifiedFilterTab === tb.idx ? 800 : 600,
                                                                                color: unifiedFilterTab === tb.idx ? "#dc2626" : "#64748b",
                                                                                background: unifiedFilterTab === tb.idx ? "var(--cas-card-bg, #ffffff)" : "transparent",
                                                                                border: "none",
                                                                                borderBottom: unifiedFilterTab === tb.idx ? "2px solid #dc2626" : "2px solid transparent",
                                                                                cursor: "pointer"
                                                                            },
                                                                            children: tb.label
                                                                        })
                                                                    )
                                                                }),

                                                                // Modal Body
                                                                (0, t.jsxs)("div", {
                                                                    className: "kp-modal-body",
                                                                    style: { padding: "1.25rem", minHeight: "210px", maxHeight: "60vh", overflowY: "auto" },
                                                                    children: [
                                                                        // Tab 0: Periode
                                                                        unifiedFilterTab === 0 && (0, t.jsxs)("div", {
                                                                            style: { display: "grid", gap: "1rem" },
                                                                            children: [
                                                                                // 3-way toggle
                                                                                (0, t.jsxs)("div", {
                                                                                    style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" },
                                                                                    children: [
                                                                                        (0, t.jsx)(c.Button, {
                                                                                            label: "Bulan",
                                                                                            outlined: kpPeriodMode !== "month",
                                                                                            onClick: () => setKpPeriodMode("month"),
                                                                                            style: kpPeriodMode === "month" ? { background: "#dc2626", borderColor: "#dc2626", color: "#fff", fontWeight: 700 } : { fontWeight: 600 }
                                                                                        }),
                                                                                        (0, t.jsx)(c.Button, {
                                                                                            label: "Tahun",
                                                                                            outlined: kpPeriodMode !== "year",
                                                                                            onClick: () => setKpPeriodMode("year"),
                                                                                            style: kpPeriodMode === "year" ? { background: "#dc2626", borderColor: "#dc2626", color: "#fff", fontWeight: 700 } : { fontWeight: 600 }
                                                                                        }),
                                                                                        (0, t.jsx)(c.Button, {
                                                                                            label: "Custom",
                                                                                            outlined: kpPeriodMode !== "custom",
                                                                                            onClick: () => setKpPeriodMode("custom"),
                                                                                            style: kpPeriodMode === "custom" ? { background: "#dc2626", borderColor: "#dc2626", color: "#fff", fontWeight: 700 } : { fontWeight: 600 }
                                                                                        })
                                                                                    ]
                                                                                }),

                                                                                // Year Dropdown
                                                                                kpPeriodMode === "year" && (0, t.jsx)(l.Dropdown, {
                                                                                    value: kpPeriodYear,
                                                                                    options: ["2026", "2025", "2024", "2023", "2022", "2021", "2020"].map(y => ({ label: y, value: y })),
                                                                                    onChange: (e) => setKpPeriodYear(e.value),
                                                                                    placeholder: "Pilih Tahun",
                                                                                    style: { width: "100%" }
                                                                                }),

                                                                                // Month Dropdowns
                                                                                kpPeriodMode === "month" && (0, t.jsxs)("div", {
                                                                                    style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" },
                                                                                    children: [
                                                                                        (0, t.jsx)(l.Dropdown, {
                                                                                            value: kpPeriodMonth,
                                                                                            options: [
                                                                                                { label: "Januari", value: "01" }, { label: "Februari", value: "02" },
                                                                                                { label: "Maret", value: "03" }, { label: "April", value: "04" },
                                                                                                { label: "Mei", value: "05" }, { label: "Juni", value: "06" },
                                                                                                { label: "Juli", value: "07" }, { label: "Agustus", value: "08" },
                                                                                                { label: "September", value: "09" }, { label: "Oktober", value: "10" },
                                                                                                { label: "November", value: "11" }, { label: "Desember", value: "12" }
                                                                                            ],
                                                                                            onChange: (e) => setKpPeriodMonth(e.value),
                                                                                            placeholder: "Pilih Bulan",
                                                                                            style: { width: "100%" }
                                                                                        }),
                                                                                        (0, t.jsx)(l.Dropdown, {
                                                                                            value: kpPeriodYear,
                                                                                            options: ["2026", "2025", "2024", "2023"].map(y => ({ label: y, value: y })),
                                                                                            onChange: (e) => setKpPeriodYear(e.value),
                                                                                            placeholder: "Pilih Tahun",
                                                                                            style: { width: "100%" }
                                                                                        })
                                                                                    ]
                                                                                }),

                                                                                // Custom Date Range
                                                                                kpPeriodMode === "custom" && (0, t.jsxs)("div", {
                                                                                    style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" },
                                                                                    children: [
                                                                                        (0, t.jsxs)("div", {
                                                                                            children: [
                                                                                                (0, t.jsx)("label", { style: { display: "block", fontSize: "0.75rem", fontWeight: 700, marginBottom: "0.25rem", color: "#475569" }, children: "Dari Tanggal" }),
                                                                                                (0, t.jsx)(s.InputText, {
                                                                                                    type: "date",
                                                                                                    value: kpCustomFrom,
                                                                                                    onChange: (e) => setKpCustomFrom(e.target.value),
                                                                                                    style: { width: "100%" }
                                                                                                })
                                                                                            ]
                                                                                        }),
                                                                                        (0, t.jsxs)("div", {
                                                                                            children: [
                                                                                                (0, t.jsx)("label", { style: { display: "block", fontSize: "0.75rem", fontWeight: 700, marginBottom: "0.25rem", color: "#475569" }, children: "Sampai Tanggal" }),
                                                                                                (0, t.jsx)(s.InputText, {
                                                                                                    type: "date",
                                                                                                    value: kpCustomTo,
                                                                                                    onChange: (e) => setKpCustomTo(e.target.value),
                                                                                                    style: { width: "100%" }
                                                                                                })
                                                                                            ]
                                                                                        })
                                                                                    ]
                                                                                }),

                                                                                // Info Banner
                                                                                (0, t.jsx)("div", {
                                                                                    className: "kp-modal-tip",
                                                                                    style: { fontSize: "0.75rem", color: "#2563eb", background: "rgba(37, 99, 235, 0.1)", border: "1px solid rgba(37, 99, 235, 0.3)", borderRadius: "8px", padding: "0.65rem 0.85rem", lineHeight: 1.4 },
                                                                                    children: "\u26A1 Periode menentukan rentang tanggal pelaporan atau kejadian perkara yang akan dievaluasi kinerjanya."
                                                                                })
                                                                            ]
                                                                        }),

                                                                        // Tab 1: Satker & Wilayah
                                                                        unifiedFilterTab === 1 && (0, t.jsxs)("div", {
                                                                            style: { display: "grid", gap: "1rem" },
                                                                            children: [
                                                                                (0, t.jsxs)("div", {
                                                                                    children: [
                                                                                        (0, t.jsx)("div", { style: { fontSize: "0.75rem", fontWeight: 700, color: "#475569", marginBottom: "0.3rem" }, children: "1. Kelompok Data" }),
                                                                                        (0, t.jsx)(l.Dropdown, {
                                                                                            value: kpKelompokData,
                                                                                            options: [
                                                                                                { label: "Kewilayahan (Polda / Satwil)", value: "kewilayahan" },
                                                                                                { label: "Fungsi Teknis Reserse", value: "fungsi_teknis" }
                                                                                            ],
                                                                                            onChange: (e) => setKpKelompokData(e.value),
                                                                                            style: { width: "100%" }
                                                                                        })
                                                                                    ]
                                                                                }),
                                                                                (0, t.jsxs)("div", {
                                                                                    children: [
                                                                                        (0, t.jsx)("div", { style: { fontSize: "0.75rem", fontWeight: 700, color: "#475569", marginBottom: "0.3rem" }, children: "2. Satker Kewilayahan (Polda / Bareskrim)" }),
                                                                                        (0, t.jsx)(l.Dropdown, {
                                                                                            value: filterSatkerId,
                                                                                            options: satkerOptions,
                                                                                            filter: true,
                                                                                            onChange: (e) => {
                                                                                                setFilterSatkerId(e.value);
                                                                                                let sObj = satkerOptions.find(o => o.value === e.value);
                                                                                                if (sObj) {
                                                                                                    setFilterSatkerNama(sObj.label);
                                                                                                    if (sObj.label.includes("BARESKRIM") || e.value === 13 || sObj.tipe === "MABES") {
                                                                                                        setKopTipe("MABES");
                                                                                                    } else {
                                                                                                        setKopTipe("SATWIL");
                                                                                                    }
                                                                                                }
                                                                                            },
                                                                                            placeholder: "Pilih Satker Kewilayahan",
                                                                                            style: { width: "100%" }
                                                                                        })
                                                                                    ]
                                                                                }),
                                                                                (0, t.jsxs)("div", {
                                                                                    children: [
                                                                                        (0, t.jsx)("div", { style: { fontSize: "0.75rem", fontWeight: 700, color: "#475569", marginBottom: "0.3rem" }, children: "3. Cakupan Satker" }),
                                                                                        (0, t.jsx)(l.Dropdown, {
                                                                                            value: kpCakupanSatker,
                                                                                            options: [
                                                                                                { label: "Internal Reserse", value: "INTERNAL_RESERSE" },
                                                                                                { label: "Eksternal Reserse / Non-Reserse", value: "EKSTERNAL_RESERSE" }
                                                                                            ],
                                                                                            onChange: (e) => setKpCakupanSatker(e.value),
                                                                                            style: { width: "100%" }
                                                                                        })
                                                                                    ]
                                                                                })
                                                                            ]
                                                                        }),

                                                                        // Tab 2: Kejahatan
                                                                        unifiedFilterTab === 2 && (0, t.jsxs)("div", {
                                                                            style: { display: "grid", gap: "1rem" },
                                                                            children: [
                                                                                (0, t.jsxs)("div", {
                                                                                    children: [
                                                                                        (0, t.jsx)("div", { style: { fontSize: "0.75rem", fontWeight: 700, color: "#475569", marginBottom: "0.3rem" }, children: "1. Kelompok Induk Kejahatan" }),
                                                                                        (0, t.jsx)(l.Dropdown, {
                                                                                            value: activeKelompokCrime,
                                                                                            options: [
                                                                                                { label: "Semua Kelompok", value: "ALL" },
                                                                                                { label: "KRIMUM (Kriminal Umum)", value: "KRIMUM" },
                                                                                                { label: "KRIMSUS (Kriminal Khusus)", value: "KRIMSUS" },
                                                                                                { label: "NARKOBA (Narkotika)", value: "NARKOBA" }
                                                                                            ],
                                                                                            onChange: (e) => setActiveKelompokCrime(e.value),
                                                                                            style: { width: "100%" }
                                                                                        })
                                                                                    ]
                                                                                }),
                                                                                (0, t.jsxs)("div", {
                                                                                    children: [
                                                                                        (0, t.jsx)("div", { style: { fontSize: "0.75rem", fontWeight: 700, color: "#475569", marginBottom: "0.3rem" }, children: "2. Sub-Kelompok TIPID" }),
                                                                                        (0, t.jsx)(l.Dropdown, {
                                                                                            value: activeTipidCrime,
                                                                                            options: [
                                                                                                { label: "Semua TIPID", value: "ALL" },
                                                                                                { label: "TIPIDUM (Tindak Pidana Umum)", value: "TIPIDUM" },
                                                                                                { label: "TIPIDPPAPPO (PPA & PPO)", value: "TIPIDPPAPPO" },
                                                                                                { label: "TIPIDEKSUS (Ekonomi Khusus)", value: "TIPIDEKSUS" },
                                                                                                { label: "TIPIDKOR (Korupsi)", value: "TIPIDKOR" },
                                                                                                { label: "TIPIDTER (Tertentu)", value: "TIPIDTER" },
                                                                                                { label: "TIPIDSIBER (Siber)", value: "TIPIDSIBER" },
                                                                                                { label: "TIPIDNARKOBA (Narkoba)", value: "TIPIDNARKOBA" }
                                                                                            ],
                                                                                            onChange: (e) => setActiveTipidCrime(e.value),
                                                                                            style: { width: "100%" }
                                                                                        })
                                                                                    ]
                                                                                }),
                                                                                (0, t.jsxs)("div", {
                                                                                    children: [
                                                                                        (0, t.jsx)("div", { style: { fontSize: "0.75rem", fontWeight: 700, color: "#475569", marginBottom: "0.3rem" }, children: "3. Klasifikasi 4 Golongan Kejahatan" }),
                                                                                        (0, t.jsx)(l.Dropdown, {
                                                                                            value: activeGolonganCrime,
                                                                                            options: [
                                                                                                { label: "Semua Golongan (I s.d. IV)", value: "ALL" },
                                                                                                { label: "Golongan I: Kejahatan Konvensional", value: "1" },
                                                                                                { label: "Golongan II: Kejahatan Transnasional", value: "2" },
                                                                                                { label: "Golongan III: Kejahatan Terhadap Kekayaan Negara", value: "3" },
                                                                                                { label: "Golongan IV: Kejahatan Berimplikasi Kontinjensi", value: "4" }
                                                                                            ],
                                                                                            onChange: (e) => setActiveGolonganCrime(e.value),
                                                                                            style: { width: "100%" }
                                                                                        })
                                                                                    ]
                                                                                })
                                                                            ]
                                                                        }),

                                                                        // Tab 3: Parameter & Model
                                                                        unifiedFilterTab === 3 && (0, t.jsxs)("div", {
                                                                            style: { display: "grid", gap: "1rem" },
                                                                            children: [
                                                                                (0, t.jsxs)("div", {
                                                                                    children: [
                                                                                        (0, t.jsx)("div", { style: { fontSize: "0.75rem", fontWeight: 700, color: "#475569", marginBottom: "0.3rem" }, children: "1. Model Perhitungan Kinerja" }),
                                                                                        (0, t.jsx)(l.Dropdown, {
                                                                                            value: kpModelCalc,
                                                                                            options: [
                                                                                                { label: "Rumus Baru (Perkap 6/2019 - CT/CP/CC/CR/Indeks)", value: "new" },
                                                                                                { label: "Rumus Lama (Perkap 14/2012)", value: "old" }
                                                                                            ],
                                                                                            onChange: (e) => setKpModelCalc(e.value),
                                                                                            style: { width: "100%" }
                                                                                        })
                                                                                    ]
                                                                                }),
                                                                                (0, t.jsxs)("div", {
                                                                                    children: [
                                                                                        (0, t.jsx)("div", { style: { fontSize: "0.75rem", fontWeight: 700, color: "#475569", marginBottom: "0.3rem" }, children: "2. Kelompok Hitung Khusus" }),
                                                                                        (0, t.jsx)(l.Dropdown, {
                                                                                            value: kpKelompokHitung,
                                                                                            options: [
                                                                                                { label: "Semua Fungsi Reserse (Default)", value: "ALL" },
                                                                                                { label: "KRIMUM, KRIMSUS, NARKOBA", value: "KRIMUM,KRIMSUS,NARKOBA" }
                                                                                            ],
                                                                                            onChange: (e) => setKpKelompokHitung(e.value),
                                                                                            style: { width: "100%" }
                                                                                        })
                                                                                    ]
                                                                                })
                                                                            ]
                                                                        })
                                                                    ]
                                                                }),

                                                                // Footer
                                                                (0, t.jsxs)("div", {
                                                                    className: "kp-modal-footer",
                                                                    style: { padding: "0.85rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--cas-border, #e2e8f0)", background: "var(--cas-surface-subtle, #f8fafc)" },
                                                                    children: [
                                                                        (0, t.jsx)(c.Button, {
                                                                            label: "Reset Default",
                                                                            icon: "pi pi-refresh",
                                                                            text: true,
                                                                            onClick: handleResetFilter,
                                                                            style: { color: "#64748b", fontWeight: 600, fontSize: "0.82rem" }
                                                                        }),
                                                                        (0, t.jsxs)("div", {
                                                                            style: { display: "flex", gap: "0.5rem" },
                                                                            children: [
                                                                                (0, t.jsx)(c.Button, {
                                                                                    label: "Batal",
                                                                                    text: true,
                                                                                    onClick: () => setUnifiedFilterOpen(false),
                                                                                    style: { color: "#64748b", fontWeight: 600, fontSize: "0.82rem" }
                                                                                }),
                                                                                (0, t.jsx)(c.Button, {
                                                                                    label: "Terapkan Filter",
                                                                                    icon: "pi pi-check",
                                                                                    onClick: handleApplyFilter,
                                                                                    style: { background: "#dc2626", borderColor: "#dc2626", color: "#ffffff", fontWeight: 700, fontSize: "0.82rem" }
                                                                                })
                                                                            ]
                                                                        })
                                                                    ]
                                                                })
                                                            ]
                                                        })
                                                    })
                                                ]
                                            }),

                                            // Active Filter Badge Summary
                                            (0, t.jsxs)("div", {
                                                style: {
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: "0.4rem",
                                                    background: "var(--cas-surface-subtle, #f8fafc)",
                                                    border: "1px solid var(--cas-border, #e2e8f0)",
                                                    padding: "0.35rem 0.65rem",
                                                    borderRadius: "6px",
                                                    fontSize: "0.8rem",
                                                    color: "var(--cas-text-secondary, #334155)"
                                                },
                                                children: [
                                                    (0, t.jsx)("span", { style: { color: "#64748b" }, children: "\uD83D\uDCC5" }),
                                                    (0, t.jsx)("b", { children: filterPeriodeLabel }),
                                                    (0, t.jsx)("span", { style: { color: "#cbd5e1" }, children: "|" }),
                                                    (0, t.jsx)("span", { style: { color: "#64748b" }, children: "\uD83C\uDFDB\uFE0F" }),
                                                    (0, t.jsx)("b", { children: filterSatkerNama })
                                                ]
                                            })
                                ]
                            }),

                            // Right: Clean Working Action Buttons
                            (0, t.jsxs)("div", {
                                style: { display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" },
                                children: [
                                    (0, t.jsxs)(c.Button, {
                                        size: "small",
                                        icon: "pi pi-save",
                                        label: "Simpan Dokumen",
                                        loading: savingDoc,
                                        onClick: handleSaveArchive,
                                        style: { background: "#059669", borderColor: "#059669", fontSize: "0.8rem", fontWeight: 700 }
                                    }),
                                    (0, t.jsxs)(c.Button, {
                                        size: "small",
                                        icon: "pi pi-download",
                                        label: "Unduh DOCX",
                                        onClick: handleDownloadDocx,
                                        className: "p-button-outlined p-button-secondary",
                                        style: { fontSize: "0.8rem", fontWeight: 600 }
                                    }),
                                    (0, t.jsxs)(c.Button, {
                                        size: "small",
                                        icon: "pi pi-file-pdf",
                                        label: "Export PDF",
                                        loading: exportingPdf,
                                        onClick: handleExportPdf,
                                        className: "p-button-outlined p-button-danger",
                                        style: { fontSize: "0.8rem", fontWeight: 600 }
                                    }),
                                    (0, t.jsxs)(c.Button, {
                                        size: "small",
                                        icon: "pi pi-plus",
                                        label: "Buat Laporan Baru",
                                        onClick: () => setShowNewModal(true),
                                        className: "p-button-outlined p-button-info",
                                        style: { fontSize: "0.8rem", fontWeight: 600 }
                                    })
                                ]
                            })
                        ]
                    }),

                    // Editor Main Canvas (ONLYOFFICE Container)
                    (0, t.jsxs)("div", {
                        style: {
                            position: "relative",
                            width: "100%",
                            height: "calc(100vh - 230px)",
                            minHeight: "750px",
                            background: "#333333",
                            borderRadius: "8px",
                            overflow: "hidden",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                            border: "1px solid #475569"
                        },
                        children: [
                            loadingDoc && (0, t.jsxs)("div", {
                                style: {
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: "rgba(15,23,42,0.75)",
                                    zIndex: 50,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#ffffff"
                                },
                                children: [
                                    (0, t.jsx)("i", { className: "pi pi-spin pi-spinner", style: { fontSize: "2.5rem", marginBottom: "1rem", color: "#38bdf8" } }),
                                    (0, t.jsx)("span", { style: { fontSize: "1.1rem", fontWeight: 700 }, children: "Memuat Dokumen & Mesin ONLYOFFICE..." }),
                                    (0, t.jsx)("span", { style: { fontSize: "0.85rem", color: "#94a3b8", marginTop: "0.3rem" }, children: "Menyinkronkan format Perkap Polri, tata letak A4, dan toolbar interaktif." })
                                ]
                            }),
                            (0, t.jsx)("div", {
                                id: "onlyoffice-iframe-container",
                                style: { width: "100%", height: "100%" },
                                children: (0, t.jsx)("div", { id: "onlyoffice-mount-point", style: { width: "100%", height: "100%" } })
                            })
                        ]
                    })
                ]
            }),

            // TAB 2: ARSIP DOKUMEN
            activeTab === "arsip" && (0, t.jsxs)("div", {
                className: "cms-card",
                style: { padding: "1.25rem", borderRadius: "8px" },
                children: [
                    (0, t.jsxs)("div", {
                        style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.6rem" },
                        children: [
                            (0, t.jsxs)("div", {
                                children: [
                                    (0, t.jsx)("h2", { style: { margin: 0, fontSize: "1.15rem", fontWeight: 800, color: "var(--cas-text-primary, #0f172a)" }, children: "Daftar Arsip & Riwayat Laporan Anev" }),
                                    (0, t.jsx)("p", { style: { margin: "0.2rem 0 0", color: "#64748b", fontSize: "0.8rem" }, children: "Dokumen-dokumen laporan anev resmi yang telah disusun, tersimpan aman di sistem penyimpanan CAS." })
                                ]
                            }),
                            (0, t.jsxs)(c.Button, {
                                size: "small",
                                icon: "pi pi-plus",
                                label: "Buat Laporan Baru",
                                onClick: () => setShowNewModal(true),
                                style: { fontSize: "0.82rem" }
                            })
                        ]
                    }),

                    (0, t.jsx)("div", {
                        style: { overflowX: "auto" },
                        children: (0, t.jsxs)("table", {
                            style: { width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" },
                            children: [
                                (0, t.jsx)("thead", {
                                    style: { background: "var(--cas-surface-subtle, #f8fafc)", borderBottom: "2px solid var(--cas-border, #e2e8f0)", textAlign: "left", color: "var(--cas-text-secondary, #334155)" },
                                    children: (0, t.jsxs)("tr", {
                                        children: [
                                            (0, t.jsx)("th", { style: { padding: "0.75rem" }, children: "Judul Dokumen" }),
                                            (0, t.jsx)("th", { style: { padding: "0.75rem" }, children: "Satker & Periode" }),
                                            (0, t.jsx)("th", { style: { padding: "0.75rem" }, children: "Pembuat" }),
                                            (0, t.jsx)("th", { style: { padding: "0.75rem" }, children: "Terakhir Disimpan" }),
                                            (0, t.jsx)("th", { style: { padding: "0.75rem" }, children: "Ukuran & Hash" }),
                                            (0, t.jsx)("th", { style: { padding: "0.75rem" }, children: "Status" }),
                                            (0, t.jsx)("th", { style: { padding: "0.75rem", textAlign: "center" }, children: "Aksi" })
                                        ]
                                    })
                                }),
                                (0, t.jsx)("tbody", {
                                    children: docList.length === 0 ? (
                                        (0, t.jsx)("tr", {
                                            children: (0, t.jsx)("td", { colSpan: 7, style: { padding: "2rem", textAlign: "center", color: "#94a3b8" }, children: "Belum ada dokumen yang tersimpan di arsip." })
                                        })
                                    ) : docList.map(doc => (
                                        (0, t.jsxs)("tr", {
                                            key: doc.id,
                                            style: { borderBottom: "1px solid var(--cas-border, #e2e8f0)" },
                                            children: [
                                                (0, t.jsxs)("td", {
                                                    style: { padding: "0.75rem", fontWeight: 700, color: "var(--cas-text-primary, #0f172a)" },
                                                    children: [
                                                        (0, t.jsx)("i", { className: "pi pi-file-word", style: { color: "#2563eb", marginRight: "0.5rem" } }),
                                                        doc.title
                                                    ]
                                                }),
                                                (0, t.jsxs)("td", {
                                                    style: { padding: "0.75rem" },
                                                    children: [
                                                        (0, t.jsx)("div", { style: { fontWeight: 600, color: "var(--cas-text-secondary, #334155)" }, children: doc.satker_nama || "BARESKRIM POLRI" }),
                                                        (0, t.jsx)("div", { style: { fontSize: "0.74rem", color: "#64748b" }, children: doc.periode_label || "-" })
                                                    ]
                                                }),
                                                (0, t.jsxs)("td", {
                                                    style: { padding: "0.75rem" },
                                                    children: [
                                                        (0, t.jsx)("div", { style: { fontWeight: 600 }, children: doc.creator_nama || "OPERATOR" }),
                                                        (0, t.jsxs)("div", { style: { fontSize: "0.74rem", color: "#64748b" }, children: [doc.opsi_ttd === "PNS" ? "NIP " : "NRP ", doc.creator_nrp || "-"] })
                                                    ]
                                                }),
                                                (0, t.jsx)("td", {
                                                    style: { padding: "0.75rem", color: "#475569" },
                                                    children: doc.updated_at ? doc.updated_at.slice(0, 19).replace("T", " ") : "-"
                                                }),
                                                (0, t.jsxs)("td", {
                                                    style: { padding: "0.75rem" },
                                                    children: [
                                                        (0, t.jsxs)("div", { style: { fontWeight: 600 }, children: [(doc.file_size / 1024).toFixed(1), " KB"] }),
                                                        (0, t.jsx)("div", {
                                                            style: { fontSize: "0.68rem", fontFamily: "monospace", color: "#64748b" },
                                                            title: doc.sha256,
                                                            children: doc.sha256 ? doc.sha256.slice(0, 14) + "..." : "-"
                                                        })
                                                    ]
                                                }),
                                                (0, t.jsx)("td", {
                                                    style: { padding: "0.75rem" },
                                                    children: (0, t.jsx)("span", {
                                                        style: {
                                                            display: "inline-block",
                                                            padding: "0.2rem 0.5rem",
                                                            borderRadius: "4px",
                                                            fontSize: "0.7rem",
                                                            fontWeight: 700,
                                                            background: doc.status === "FINAL" ? "#dcfce7" : "#eff6ff",
                                                            color: doc.status === "FINAL" ? "#166534" : "#1d4ed8"
                                                        },
                                                        children: doc.status || "DRAFT"
                                                    })
                                                }),
                                                (0, t.jsx)("td", {
                                                    style: { padding: "0.75rem", textAlign: "center" },
                                                    children: (0, t.jsxs)("div", {
                                                        style: { display: "inline-flex", gap: "0.3rem" },
                                                        children: [
                                                            (0, t.jsx)(c.Button, {
                                                                size: "small",
                                                                icon: "pi pi-pencil",
                                                                title: "Buka di ONLYOFFICE",
                                                                onClick: () => {
                                                                    setActiveTab("editor");
                                                                    loadDocumentIntoEditor(doc.id);
                                                                }
                                                            }),
                                                            (0, t.jsx)(c.Button, {
                                                                size: "small",
                                                                icon: "pi pi-file-pdf",
                                                                severity: "danger",
                                                                outlined: true,
                                                                title: "Unduh PDF Resmi",
                                                                onClick: () => {
                                                                    let url = "/doc-api/export-pdf?id=" + encodeURIComponent(doc.id) + "&token=" + encodeURIComponent(getDocToken());
                                                                    window.open(url, "_blank");
                                                                }
                                                            }),
                                                            (0, t.jsx)(c.Button, {
                                                                size: "small",
                                                                icon: "pi pi-download",
                                                                severity: "secondary",
                                                                outlined: true,
                                                                title: "Unduh File DOCX",
                                                                onClick: () => {
                                                                    let url = "/doc-api/download?id=" + encodeURIComponent(doc.id) + "&token=" + encodeURIComponent(getDocToken());
                                                                    window.open(url, "_blank");
                                                                }
                                                            }),
                                                            (0, t.jsx)(c.Button, {
                                                                size: "small",
                                                                icon: "pi pi-shield",
                                                                severity: "warning",
                                                                outlined: true,
                                                                title: "Cek Stamp Keamanan",
                                                                onClick: () => handleOpenStamp(doc.id)
                                                            }),
                                                            (0, t.jsx)(c.Button, {
                                                                size: "small",
                                                                icon: "pi pi-trash",
                                                                severity: "danger",
                                                                text: true,
                                                                title: "Hapus dari Arsip",
                                                                onClick: () => handleDeleteDoc(doc.id)
                                                            })
                                                        ]
                                                    })
                                                })
                                            ]
                                        })
                                    ))
                                })
                            ]
                        })
                    })
                ]
            }),

            // MODAL: BUAT LAPORAN BARU
            showNewModal && (0, t.jsx)("div", {
                style: {
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(15,23,42,0.6)",
                    backdropFilter: "blur(4px)",
                    zIndex: 9999,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "1rem"
                },
                children: (0, t.jsxs)("div", {
                    style: {
                        background: "var(--cas-card-bg, #ffffff)",
                        borderRadius: "12px",
                        maxWidth: "500px",
                        width: "100%",
                        padding: "1.5rem",
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)"
                    },
                    children: [
                        (0, t.jsx)("h3", { style: { margin: "0 0 1rem", fontSize: "1.15rem", fontWeight: 800, color: "var(--cas-text-primary, #0f172a)" }, children: "Buat Draf Laporan Anev Baru" }),
                        (0, t.jsxs)("div", {
                            style: { display: "grid", gap: "0.8rem" },
                            children: [
                                (0, t.jsxs)("div", {
                                    children: [
                                        (0, t.jsx)("label", { style: { display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#475569", marginBottom: "0.25rem" }, children: "Judul Laporan:" }),
                                        (0, t.jsx)(s.InputText, {
                                            value: newTitle,
                                            onChange: (e) => setNewTitle(e.target.value),
                                            placeholder: "Contoh: Laporan Anev Bulanan Oktober 2026",
                                            style: { width: "100%" }
                                        })
                                    ]
                                }),
                                (0, t.jsxs)("div", {
                                    children: [
                                        (0, t.jsx)("label", { style: { display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#475569", marginBottom: "0.25rem" }, children: "Satker Pelapor:" }),
                                        (0, t.jsx)(l.Dropdown, {
                                            value: filterSatkerId,
                                            options: satkerOptions,
                                            onChange: (e) => {
                                                setFilterSatkerId(e.value);
                                                let sObj = satkerOptions.find(o => o.value === e.value);
                                                if (sObj) setFilterSatkerNama(sObj.label);
                                            },
                                            style: { width: "100%" }
                                        })
                                    ]
                                }),
                                (0, t.jsxs)("div", {
                                    style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" },
                                    children: [
                                        (0, t.jsxs)("div", {
                                            children: [
                                                (0, t.jsx)("label", { style: { display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#475569", marginBottom: "0.25rem" }, children: "Periode Dari:" }),
                                                (0, t.jsx)(s.InputText, {
                                                    type: "date",
                                                    value: filterDateStart,
                                                    onChange: (e) => setFilterDateStart(e.target.value),
                                                    style: { width: "100%" }
                                                })
                                            ]
                                        }),
                                        (0, t.jsxs)("div", {
                                            children: [
                                                (0, t.jsx)("label", { style: { display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#475569", marginBottom: "0.25rem" }, children: "Periode Sampai:" }),
                                                (0, t.jsx)(s.InputText, {
                                                    type: "date",
                                                    value: filterDateEnd,
                                                    onChange: (e) => setFilterDateEnd(e.target.value),
                                                    style: { width: "100%" }
                                                })
                                            ]
                                        })
                                    ]
                                })
                            ]
                        }),
                        (0, t.jsxs)("div", {
                            style: { display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1.25rem" },
                            children: [
                                (0, t.jsx)(c.Button, {
                                    label: "Batal",
                                    size: "small",
                                    severity: "secondary",
                                    onClick: () => setShowNewModal(false)
                                }),
                                (0, t.jsx)(c.Button, {
                                    label: "Buat Dokumen",
                                    icon: "pi pi-check",
                                    size: "small",
                                    onClick: handleCreateNewReport
                                })
                            ]
                        })
                    ]
                })
            })
        ]
    });
}], 38266)}]);
