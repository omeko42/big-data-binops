(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,72382,e=>{"use strict";let t=(0,e.i(56420).default)("eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);e.s(["Eye",0,t],72382)},73225,e=>{"use strict";let t=(0,e.i(56420).default)("file-search",[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["circle",{cx:"11.5",cy:"14.5",r:"2.5",key:"1bq0ko"}],["path",{d:"M13.3 16.3 15 18",key:"2quom7"}]]);e.s(["FileSearch",0,t],73225)},94779,e=>{"use strict";var t=e.i(43476),a=e.i(71144),i=e.i(64801),n=e.i(26091);e.s(["default",0,function({file:e,onHide:l}){var r;let s,o=(r=e?.name,"pdf"===(s=(r||"").split(".").pop()?.toLowerCase()||"")?"pdf":["png","jpg","jpeg","gif","webp","bmp","svg","avif"].includes(s)?"image":"other");return(0,t.jsx)(a.Dialog,{header:(0,t.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.5rem",maxWidth:"80%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:[(0,t.jsx)(i.Paperclip,{size:16})," ",e?.name]}),visible:!!e,onHide:l,style:{width:"72rem",maxWidth:"96vw"},modal:!0,dismissableMask:!0,children:e?.url?"pdf"===o?(0,t.jsx)("iframe",{src:`${e.url}#toolbar=1`,title:e.name,style:{width:"100%",height:"80vh",border:"1px solid #e2e8f0",borderRadius:8}}):"image"===o?(0,t.jsx)("img",{src:e.url,alt:e.name,style:{maxWidth:"100%",maxHeight:"80vh",display:"block",margin:"0 auto",borderRadius:8}}):(0,t.jsxs)("div",{style:{padding:"2rem",textAlign:"center",color:"#64748b"},children:[(0,t.jsx)(n.FileText,{size:40,style:{color:"#94a3b8",marginBottom:"0.5rem"}}),(0,t.jsx)("div",{children:"Pratinjau inline tidak tersedia untuk tipe berkas ini."})]}):(0,t.jsx)("div",{style:{color:"#94a3b8"},children:"Berkas tidak tersedia."})})}])},70454,e=>{"use strict";var t=e.i(71645),a=e.i(48264),i=e.i(43456),n=e.i(29168),l=e.i(40623),r=e.i(73193);function s(){return(s=Object.assign.bind()).apply(null,arguments)}function o(e){return(o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}var u=i.ComponentBase.extend({defaultProps:{__TYPE:"InputSwitch",autoFocus:!1,checked:!1,className:null,disabled:!1,falseValue:!1,id:null,inputId:null,inputRef:null,invalid:!1,name:null,onBlur:null,onChange:null,onFocus:null,style:null,tabIndex:null,tooltip:null,tooltipOptions:null,trueValue:!0,children:void 0},css:{classes:{root:function(e){var t=e.props,a=e.checked;return(0,r.classNames)("p-inputswitch p-component",{"p-highlight":a,"p-disabled":t.disabled,"p-invalid":t.invalid})},input:"p-inputswitch-input",slider:"p-inputswitch-slider"}}});function c(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),a.push.apply(a,i)}return a}var d=t.memo(t.forwardRef(function(e,d){var p=(0,n.useMergeProps)(),m=t.useContext(a.PrimeReactContext),f=u.getProps(e,m),y=u.setMetaData({props:f}),g=y.ptm,h=y.cx,b=y.isUnstyled;(0,i.useHandleStyle)(u.css.styles,b,{name:"inputswitch"});var v=t.useRef(null),j=t.useRef(f.inputRef),x=f.checked===f.trueValue;t.useImperativeHandle(d,function(){return{props:f,focus:function(){return r.DomHandler.focus(j.current)},getElement:function(){return v.current},getInput:function(){return j.current}}}),t.useEffect(function(){r.ObjectUtils.combinedRefs(j,f.inputRef)},[j,f.inputRef]),(0,n.useMountEffect)(function(){f.autoFocus&&r.DomHandler.focus(j.current,f.autoFocus)});var w=r.ObjectUtils.isNotEmpty(f.tooltip),k=u.getOtherProps(f),S=r.ObjectUtils.reduceKeys(k,r.DomHandler.ARIA_PROPS),O=p({className:(0,r.classNames)(f.className,h("root",{checked:x})),style:f.style,role:"checkbox","aria-checked":x,"data-p-highlight":x,"data-p-disabled":f.disabled},k,g("root")),C=p(function(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?c(Object(a),!0).forEach(function(t){!function(e,t,a){var i;(i=function(e,t){if("object"!=o(e)||!e)return e;var a=e[Symbol.toPrimitive];if(void 0!==a){var i=a.call(e,t||"default");if("object"!=o(i))return i;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(t,"string"),(t="symbol"==o(i)?i:i+"")in e)?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a}(e,t,a[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):c(Object(a)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))})}return e}({type:"checkbox",id:f.inputId,name:f.name,checked:x,onChange:function(e){if(f.onChange){var t=x?f.falseValue:f.trueValue;f.onChange({originalEvent:e,value:t,stopPropagation:function(){null==e||e.stopPropagation()},preventDefault:function(){null==e||e.preventDefault()},target:{name:f.name,id:f.id,value:t}})}},onFocus:function(e){var t;null==f||null==(t=f.onFocus)||t.call(f,e)},onBlur:function(e){var t;null==f||null==(t=f.onBlur)||t.call(f,e)},disabled:f.disabled,role:"switch",tabIndex:f.tabIndex,"aria-checked":x,className:h("input")},S),g("input")),P=p({className:h("slider")},g("slider"));return t.createElement(t.Fragment,null,t.createElement("div",s({id:f.id,ref:v},O),t.createElement("input",s({ref:j},C)),t.createElement("span",P)),w&&t.createElement(l.Tooltip,s({target:v,content:f.tooltip,pt:g("tooltip")},f.tooltipOptions)))}));d.displayName="InputSwitch",e.s(["InputSwitch",0,d])},89269,e=>{"use strict";var t=e.i(71645),a=e.i(48264),i=e.i(43456),n=e.i(29168),l=e.i(83128),r=e.i(40623),s=e.i(73193);function o(){return(o=Object.assign.bind()).apply(null,arguments)}function u(e){return(u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}var c=i.ComponentBase.extend({defaultProps:{__TYPE:"InputTextarea",__parentMetadata:null,autoResize:!1,invalid:!1,variant:null,keyfilter:null,onBlur:null,onFocus:null,onBeforeInput:null,onInput:null,onKeyDown:null,onKeyUp:null,onPaste:null,tooltip:null,tooltipOptions:null,validateOnly:!1,children:void 0,className:null},css:{classes:{root:function(e){var t=e.props,a=e.context,i=e.isFilled;return(0,s.classNames)("p-inputtextarea p-inputtext p-component",{"p-disabled":t.disabled,"p-filled":i,"p-inputtextarea-resizable":t.autoResize,"p-invalid":t.invalid,"p-variant-filled":t.variant?"filled"===t.variant:a&&"filled"===a.inputStyle})}},styles:"\n@layer primereact {\n    .p-inputtextarea-resizable {\n        overflow: hidden;\n        resize: none;\n    }\n    \n    .p-fluid .p-inputtextarea {\n        width: 100%;\n    }\n}\n"}});function d(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),a.push.apply(a,i)}return a}function p(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?d(Object(a),!0).forEach(function(t){!function(e,t,a){var i;(i=function(e,t){if("object"!=u(e)||!e)return e;var a=e[Symbol.toPrimitive];if(void 0!==a){var i=a.call(e,t||"default");if("object"!=u(i))return i;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(t,"string"),(t="symbol"==u(i)?i:i+"")in e)?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a}(e,t,a[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):d(Object(a)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))})}return e}var m=t.memo(t.forwardRef(function(e,u){var d=(0,n.useMergeProps)(),m=t.useContext(a.PrimeReactContext),f=c.getProps(e,m),y=t.useRef(u),g=t.useRef(0),h=c.setMetaData(p(p({props:f},f.__parentMetadata),{},{context:{disabled:f.disabled}})),b=h.ptm,v=h.cx,j=h.isUnstyled;(0,i.useHandleStyle)(c.css.styles,j,{name:"inputtextarea"});var x=function(e){var t=y.current;t&&w()&&(g.current||(g.current=t.scrollHeight,t.style.overflow="hidden"),(g.current!==t.scrollHeight||e)&&(t.style.height="",t.style.height=t.scrollHeight+"px",parseFloat(t.style.height)>=parseFloat(t.style.maxHeight)?(t.style.overflowY="scroll",t.style.height=t.style.maxHeight):t.style.overflow="hidden",g.current=t.scrollHeight))},w=function(){if(s.DomHandler.isVisible(y.current)){var e=y.current.getBoundingClientRect();return e.width>0&&e.height>0}return!1};t.useEffect(function(){s.ObjectUtils.combinedRefs(y,u)},[y,u]),t.useEffect(function(){f.autoResize&&x(!0)},[f.autoResize,f.value]);var k=t.useMemo(function(){return s.ObjectUtils.isNotEmpty(f.value)||s.ObjectUtils.isNotEmpty(f.defaultValue)},[f.value,f.defaultValue]),S=s.ObjectUtils.isNotEmpty(f.tooltip),O=d({ref:y,className:(0,s.classNames)(f.className,v("root",{context:m,isFilled:k})),autoComplete:f.autoComplete,onFocus:function(e){f.autoResize&&x(),f.onFocus&&f.onFocus(e)},onBlur:function(e){f.autoResize&&x(),f.onBlur&&f.onBlur(e)},onKeyUp:function(e){f.autoResize&&x(),f.onKeyUp&&f.onKeyUp(e)},onKeyDown:function(e){f.onKeyDown&&f.onKeyDown(e),f.keyfilter&&l.KeyFilter.onKeyPress(e,f.keyfilter,f.validateOnly)},onBeforeInput:function(e){f.onBeforeInput&&f.onBeforeInput(e),f.keyfilter&&l.KeyFilter.onBeforeInput(e,f.keyfilter,f.validateOnly)},onInput:function(e){var t=e.target;f.autoResize&&x(s.ObjectUtils.isEmpty(t.value)),f.onInput&&f.onInput(e),s.ObjectUtils.isNotEmpty(t.value)?s.DomHandler.addClass(t,"p-filled"):s.DomHandler.removeClass(t,"p-filled")},onPaste:function(e){f.onPaste&&f.onPaste(e),f.keyfilter&&l.KeyFilter.onPaste(e,f.keyfilter,f.validateOnly)}},c.getOtherProps(f),b("root"));return t.createElement(t.Fragment,null,t.createElement("textarea",O),S&&t.createElement(r.Tooltip,o({target:y,content:f.tooltip,pt:b("tooltip")},f.tooltipOptions)))}));m.displayName="InputTextarea",e.s(["InputTextarea",0,m])},71326,97778,e=>{"use strict";var t=e.i(71645),a=e.i(48264),i=e.i(1743),n=e.i(43456),l=e.i(71144),r=e.i(29168),s=e.i(28797),o=e.i(27259),u=e.i(73193);function c(){return(c=Object.assign.bind()).apply(null,arguments)}function d(e,t){(null==t||t>e.length)&&(t=e.length);for(var a=0,i=Array(t);a<t;a++)i[a]=e[a];return i}function p(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var a=null==e?null:"u">typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=a){var i,n,l,r,s=[],o=!0,u=!1;try{if(l=(a=a.call(e)).next,0===t){if(Object(a)!==a)return;o=!1}else for(;!(o=(i=l.call(a)).done)&&(s.push(i.value),s.length!==t);o=!0);}catch(e){u=!0,n=e}finally{try{if(!o&&null!=a.return&&(r=a.return(),Object(r)!==r))return}finally{if(u)throw n}}return s}}(e,t)||function(e,t){if(e){if("string"==typeof e)return d(e,t);var a=({}).toString.call(e).slice(8,-1);return"Object"===a&&e.constructor&&(a=e.constructor.name),"Map"===a||"Set"===a?Array.from(e):"Arguments"===a||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a)?d(e,t):void 0}}(e,t)||function(){throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function m(e){return(m="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}var f=n.ComponentBase.extend({defaultProps:{__TYPE:"ConfirmDialog",accept:null,acceptClassName:null,acceptIcon:null,acceptLabel:null,appendTo:null,breakpoints:null,children:void 0,className:null,content:null,defaultFocus:"accept",footer:null,icon:null,message:null,onHide:null,reject:null,rejectClassName:null,rejectIcon:null,rejectLabel:null,tagKey:void 0,visible:void 0},css:{classes:{root:"p-confirm-dialog",message:"p-confirm-dialog-message",icon:"p-confirm-dialog-icon",acceptButton:"p-confirm-dialog-accept",rejectButton:function(e){var t=e.getPropValue;return(0,u.classNames)("p-confirm-dialog-reject",{"p-button-text":!t("rejectClassName")})}}}});function y(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),a.push.apply(a,i)}return a}function g(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?y(Object(a),!0).forEach(function(t){!function(e,t,a){var i;(i=function(e,t){if("object"!=m(e)||!e)return e;var a=e[Symbol.toPrimitive];if(void 0!==a){var i=a.call(e,t||"default");if("object"!=m(i))return i;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(t,"string"),(t="symbol"==m(i)?i:i+"")in e)?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a}(e,t,a[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):y(Object(a)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))})}return e}var h=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return(e=g(g({},e),{visible:void 0===e.visible||e.visible})).visible&&s.OverlayService.emit("confirm-dialog",e),{show:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};s.OverlayService.emit("confirm-dialog",g(g(g({},e),t),{visible:!0}))},hide:function(){s.OverlayService.emit("confirm-dialog",{visible:!1})}}},b=t.memo(t.forwardRef(function(e,d){var m,y,h,b,v,j,x,w=(0,r.useMergeProps)(),k=t.useContext(a.PrimeReactContext),S=f.getProps(e,k),O=p(t.useState(S.visible),2),C=O[0],P=O[1],_=p(t.useState(!1),2),N=_[0],T=_[1],B=t.useRef(null),E=t.useRef(!1),I=t.useRef(null),z=function(){var e=S.group;return B.current&&(e=B.current.group),Object.assign({},S,B.current,{group:e})},D=function(e){return z()[e]},M=function(e){for(var t=arguments.length,a=Array(t>1?t-1:0),i=1;i<t;i++)a[i-1]=arguments[i];return u.ObjectUtils.getPropValue(D(e),a)},R=D("acceptLabel")||(0,a.localeOption)("accept"),H=D("rejectLabel")||(0,a.localeOption)("reject"),A={props:S,state:{visible:C}},F=f.setMetaData(A),U=F.ptm,K=F.cx,L=F.isUnstyled;(0,n.useHandleStyle)(f.css.styles,L,{name:"confirmdialog"});var W=function(){E.current||(E.current=!0,M("accept"),G("accept"))},V=function(){E.current||(E.current=!0,M("reject"),G("reject"))},$=function(){z().group===S.group&&(P(!0),E.current=!1,I.current=document.activeElement)},G=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"cancel";C&&("string"!=typeof e&&(e="cancel"),P(!1),M("onHide",e),u.DomHandler.focus(I.current),I.current=null)},J=function(e){if(e.tagKey===S.tagKey&&(void 0===e.group||e.group===S.group)){var t=C!==e.visible;D("target")===e.target||S.target?t&&(B.current=e,e.visible?$():G()):(G(),B.current=e,T(!0))}};t.useEffect(function(){S.visible?$():G()},[S.visible]),t.useEffect(function(){return S.target||S.message||s.OverlayService.on("confirm-dialog",J),function(){s.OverlayService.off("confirm-dialog",J)}},[S.target]),(0,r.useUpdateEffect)(function(){N&&$()},[N]),(0,r.useUnmountEffect)(function(){s.OverlayService.off("confirm-dialog",J)}),t.useImperativeHandle(d,function(){return{props:S,confirm:J}});var X=(m=z(),y=u.ObjectUtils.getJSXElement(D("message"),m),h=w({className:K("icon")},U("icon")),b=u.IconUtils.getJSXIcon(D("icon"),g({},h),{props:m}),v=function(){var e=D("defaultFocus"),a=(0,u.classNames)("p-confirm-dialog-accept",D("acceptClassName")),n=(0,u.classNames)("p-confirm-dialog-reject",{"p-button-text":!D("rejectClassName")},D("rejectClassName")),l=w({label:H,autoFocus:"reject"===e,icon:D("rejectIcon"),className:(0,u.classNames)(D("rejectClassName"),K("rejectButton",{getPropValue:D})),onClick:V,pt:U("rejectButton"),unstyled:S.unstyled,__parentMetadata:{parent:A}},U("rejectButton")),r=w({label:R,autoFocus:void 0===e||"accept"===e,icon:D("acceptIcon"),className:(0,u.classNames)(D("acceptClassName"),K("acceptButton")),onClick:W,pt:U("acceptButton"),unstyled:S.unstyled,__parentMetadata:{parent:A}},U("acceptButton")),s=t.createElement(t.Fragment,null,t.createElement(i.Button,l),t.createElement(i.Button,r));if(D("footer")){var o={accept:W,reject:V,acceptClassName:a,rejectClassName:n,acceptLabel:R,rejectLabel:H,element:s,props:z()};return u.ObjectUtils.getJSXElement(D("footer"),o)}return s}(),j=w({className:K("message")},U("message")),x=w({visible:C,className:(0,u.classNames)(D("className"),K("root")),footer:v,onHide:G,breakpoints:D("breakpoints"),pt:m.pt,unstyled:S.unstyled,appendTo:D("appendTo"),__parentMetadata:{parent:A}},f.getOtherProps(m)),t.createElement(l.Dialog,c({},x,{content:null==e?void 0:e.content}),b,t.createElement("span",j,y)));return t.createElement(o.Portal,{element:X,appendTo:D("appendTo")})}));b.displayName="ConfirmDialog",e.s(["ConfirmDialog",0,b,"confirmDialog",0,h],97778),e.s(["confirmAction",0,function(e,t){return new Promise(a=>{let i=!1,n=e=>{i||(i=!0,a(e))};h({message:e,header:t?.header||"Konfirmasi",icon:t?.danger?"pi pi-exclamation-triangle":"pi pi-question-circle",acceptLabel:t?.acceptLabel||"Ya, lanjutkan",rejectLabel:"Batal",acceptClassName:t?.danger?"p-button-danger":void 0,accept:()=>n(!0),reject:()=>n(!1),onHide:()=>n(!1)})})}],71326)},73474,e=>{"use strict";let t=(0,e.i(56420).default)("trash-2",[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]]);e.s(["Trash2",0,t],73474)},26091,e=>{"use strict";let t=(0,e.i(56420).default)("file-text",[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]);e.s(["FileText",0,t],26091)},64801,e=>{"use strict";let t=(0,e.i(56420).default)("paperclip",[["path",{d:"m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551",key:"1miecu"}]]);e.s(["Paperclip",0,t],64801)},63676,e=>{"use strict";let t=(0,e.i(56420).default)("x",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);e.s(["X",0,t],63676)},35610,e=>{"use strict";let t=(0,e.i(56420).default)("cloud-upload",[["path",{d:"M12 13v8",key:"1l5pq0"}],["path",{d:"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242",key:"1pljnt"}],["path",{d:"m8 17 4-4 4 4",key:"1quai1"}]]);e.s(["UploadCloud",0,t],35610)},84761,e=>{"use strict";var t=e.i(43476),a=e.i(71645),i=e.i(71144),n=e.i(17580),l=e.i(24718),r=e.i(44080),s=e.i(53729),o=e.i(1743),u=e.i(54858);e.s(["default",0,function({visible:e,onHide:c,initialSelected:d,onConfirm:p}){let[m,f]=(0,a.useState)([]),[y,g]=(0,a.useState)(0),[h,b]=(0,a.useState)(!1),[v,j]=(0,a.useState)(1),[x,w]=(0,a.useState)(5),[k,S]=(0,a.useState)(""),[O,C]=(0,a.useState)(""),[P,_]=(0,a.useState)({});(0,a.useEffect)(()=>{if(!e)return;let t={};(d||[]).forEach(e=>{t[e.id]=e}),_(t),S(""),C(""),j(1)},[e,d]);let N=(0,a.useCallback)(async()=>{if(e){b(!0);try{let e=(await u.apiAuth.get("/bdb/laporan-polisi",{params:{search:k,page:v,row:x}})).data;f(e?.data||[]),g(e?.total||0)}catch{f([]),g(0)}finally{b(!1)}}},[e,k,v,x]);(0,a.useEffect)(()=>{N()},[N]),(0,a.useEffect)(()=>{if(!e)return;let t=setTimeout(()=>{j(1),S(O)},400);return()=>clearTimeout(t)},[O,e]);let T=Object.keys(P).length,B=m.filter(e=>P[e.id]),E=(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between"},children:[(0,t.jsxs)("span",{style:{fontSize:"0.85rem",color:"#64748b",fontWeight:600},children:["Dipilih: ",T]}),(0,t.jsxs)("div",{children:[(0,t.jsx)(o.Button,{label:"Batal",text:!0,onClick:c}),(0,t.jsx)(o.Button,{label:"Gunakan Pilihan",icon:"pi pi-check",onClick:function(){p(Object.values(P)),c()}})]})]});return(0,t.jsxs)(i.Dialog,{header:"Pilih Laporan Polisi",visible:e,onHide:c,style:{width:"56rem",maxWidth:"96vw"},footer:E,modal:!0,children:[(0,t.jsx)(r.InputText,{id:"susjol-search-lp",name:"search_lp",value:O,onChange:e=>C(e.target.value),placeholder:"Cari nomor LP…",style:{width:"100%",marginBottom:"0.75rem"}}),(0,t.jsxs)(n.DataTable,{value:m,loading:h,lazy:!0,paginator:!0,first:(v-1)*x,rows:x,rowsPerPageOptions:[5,10,25],totalRecords:y,onPage:function(e){j(Math.floor((e.first||0)/(e.rows||x))+1),w(e.rows||x)},selectionMode:"multiple",selection:B,onSelectionChange:function(e){let t=e.value||[];_(e=>{let a={...e};for(let e of m)t.find(t=>t.id===e.id)||delete a[e.id];for(let e of t)a[e.id]=e;return a})},dataKey:"id",size:"small",stripedRows:!0,emptyMessage:"Tidak ada LP ditemukan.",children:[(0,t.jsx)(l.Column,{selectionMode:"multiple",headerStyle:{width:"3rem"}}),(0,t.jsx)(l.Column,{header:"No",body:(e,t)=>t.rowIndex+1,style:{width:"3rem"}}),(0,t.jsx)(l.Column,{header:"Nomor LP",body:e=>(0,t.jsxs)("div",{children:[(0,t.jsx)("div",{style:{fontWeight:700},children:e.no_laporan}),(0,t.jsx)("div",{style:{fontSize:"0.72rem",color:"#94a3b8"},children:function(e){if(!e)return"—";let t=String(e).slice(0,10),a=new Date(t);return isNaN(a.getTime())?t:a.toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric"})}(e.tgl_laporan)})]})}),(0,t.jsx)(l.Column,{header:"Kejahatan",body:e=>e.dugaan_tindak_pidana||"—"}),(0,t.jsx)(l.Column,{header:"Satker",body:e=>[e.unit_nama,e.satker_nama].filter(Boolean).join(" ")||"—"}),(0,t.jsx)(l.Column,{header:"Status",body:e=>(0,t.jsx)(s.Tag,{value:e.status_nama||"-"})})]})]})}])},48047,e=>{"use strict";var a=e.i(43476),i=e.i(71645),t=e.i(44080),s=e.i(89269),l=e.i(53729),m=e.i(54858),k=e.i(84761),w=e.i(71326),cd=e.i(97778),ts=e.i(85118);e.s(["default",0,function SusopsgasKelolaUnifiedPage() {
    var jsx = a.jsx, jsxs = a.jsxs, Fragment = a.Fragment;
    var useState = i.useState, useEffect = i.useEffect, useCallback = i.useCallback, useMemo = i.useMemo, useRef = i.useRef;
    var InputText = t.InputText;
    var InputTextarea = s.InputTextarea;
    var Tag = l.Tag;
    var apiAuth = m.apiAuth;
    var LpPickerModal = k.default;
    var confirmAction = w.confirmAction;
    var ConfirmDialog = cd.ConfirmDialog;
    var Toast = ts.Toast;
    var toastRef = useRef(null);

    var initTab = (function() {
      try {
        var sp = new URLSearchParams(window.location.search);
        var qTab = String(sp.get("tab") || "").toUpperCase();
        if (["SUSJOL", "SUSATENSI", "OPS_SATGAS"].includes(qTab)) return qTab;
      } catch (e) {}
      return "SUSJOL";
    })();

    var _tab = useState(initTab), activeTab = _tab[0], setActiveTab = _tab[1];

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


    // CRUD Form Modal State
    var _formOpen = useState(false), formOpen = _formOpen[0], setFormOpen = _formOpen[1];
    var _formMode = useState("create"), formMode = _formMode[0], setFormMode = _formMode[1]; // create | edit | view
    var _formTargetTab = useState("SUSJOL"), formTargetTab = _formTargetTab[0], setFormTargetTab = _formTargetTab[1];
    var _formData = useState({}), formData = _formData[0], setFormData = _formData[1];
    var _formLps = useState([]), formLps = _formLps[0], setFormLps = _formLps[1];
    var _lpPickerOpen = useState(false), lpPickerOpen = _lpPickerOpen[0], setLpPickerOpen = _lpPickerOpen[1];
    var _formAtts = useState([]), formAtts = _formAtts[0], setFormAtts = _formAtts[1];
    var _formSaving = useState(false), formSaving = _formSaving[0], setFormSaving = _formSaving[1];

    // Separated Lampiran Pending Inputs inside Create/Edit Form
    var _pendSprinNomor = useState(""), pendSprinNomor = _pendSprinNomor[0], setPendSprinNomor = _pendSprinNomor[1];
    var _pendSprinTgl = useState(""), pendSprinTgl = _pendSprinTgl[0], setPendSprinTgl = _pendSprinTgl[1];
    var _pendSprinCatatan = useState(""), pendSprinCatatan = _pendSprinCatatan[0], setPendSprinCatatan = _pendSprinCatatan[1];
    var _pendSprinFiles = useState([]), pendSprinFiles = _pendSprinFiles[0], setPendSprinFiles = _pendSprinFiles[1];

    var _pendDokJudul = useState(""), pendDokJudul = _pendDokJudul[0], setPendDokJudul = _pendDokJudul[1];
    var _pendDokFiles = useState([]), pendDokFiles = _pendDokFiles[0], setPendDokFiles = _pendDokFiles[1];

    function setField(k, v) {
      setFormData(function(prev) { return Object.assign({}, prev, { [k]: v }); });
    }

    function refreshCurrentTab() {
      if (activeTab === "SUSJOL") fetchSusjol();
      else if (activeTab === "SUSATENSI") fetchAtensi();
      else fetchOps();
    }

    async function openCrudModal(mode, tabType, row) {
      setFormMode(mode);
      setFormTargetTab(tabType);
      setPendSprinNomor("");
      setPendSprinTgl("");
      setPendSprinCatatan("");
      setPendSprinFiles([]);
      setPendDokJudul("");
      setPendDokFiles([]);
      if (mode === "create") {
        if (tabType === "SUSJOL") setFormData({ judul: "", skala_viral: "regional", tanggal_rilis: "", rilis: false, is_pinned: false, keterangan: "" });
        else if (tabType === "SUSATENSI") setFormData({ judul: "", sumber_atensi: "pimpinan", level_atensi: "tinggi", tanggal_atensi: "", status_atensi: "aktif", is_pinned: false, keterangan: "" });
        else setFormData({ jenis: "OPERASI", nama: "", jenis_kategori: "", nomor_dasar: "", tanggal_dibentuk: "", tanggal_mulai: "", tanggal_selesai: "", satker_penyelenggara: "", pimpinan: "", deskripsi: "", is_aktif: true, is_pinned: false });
        setFormLps([]);
        setFormAtts([]);
        setFormOpen(true);
        return;
      }
      var r = row || {};
      setFormData(Object.assign({}, r, {
        judul: r.judul || r.nama || "",
        nama: r.nama || r.judul || "",
        tanggal_rilis: String(r.tanggal_rilis || "").slice(0, 10),
        tanggal_atensi: String(r.tanggal_atensi || "").slice(0, 10),
        tanggal_dibentuk: String(r.tanggal_dibentuk || "").slice(0, 10),
        tanggal_mulai: String(r.tanggal_mulai || "").slice(0, 10),
        tanggal_selesai: String(r.tanggal_selesai || "").slice(0, 10),
        is_aktif: r.is_aktif !== false
      }));
      setFormLps([]);
      setFormAtts([]);
      setFormOpen(true);
      var baseEp = tabType === "SUSATENSI" ? "/bdb/kasus-atensi" : tabType === "OPS_SATGAS" ? "/bdb/operasi-satgas" : "/bdb/kasus-menonjol";
      try {
        var res = await Promise.all([
          apiAuth.get(baseEp + "/" + r.id + "/lp"),
          apiAuth.get(baseEp + "/" + r.id + "/attachments")
        ]);
        var lpArr = res[0].data?.data || res[0].data || [];
        setFormLps((Array.isArray(lpArr) ? lpArr : []).map(function(x) {
          return { id: Number(x.lp_id || x.id), no_laporan: x.no_laporan, satker_nama: x.satker_nama, unit_nama: x.unit_nama, status_nama: x.status_nama };
        }));
        var attArr = res[1].data?.data || res[1].data || [];
        setFormAtts(Array.isArray(attArr) ? attArr : []);
      } catch (e) {}
    }

    async function uploadSeparatedFiles(baseEp, recordId) {
      if (pendSprinFiles.length > 0) {
        var fdS = new FormData();
        fdS.append("kategori_lampiran", "SPRIN");
        if (pendSprinNomor.trim()) fdS.append("nomor_sprin", pendSprinNomor.trim());
        if (pendSprinTgl) fdS.append("tanggal_sprin", pendSprinTgl);
        if (pendSprinCatatan.trim()) fdS.append("catatan_perubahan", pendSprinCatatan.trim());
        pendSprinFiles.forEach(function(f) { fdS.append("files", f); });
        await apiAuth.post(baseEp + "/" + recordId + "/lampiran", fdS, { headers: { "Content-Type": "multipart/form-data" } });
      }
      if (pendDokFiles.length > 0) {
        var fdD = new FormData();
        fdD.append("kategori_lampiran", "DOKUMENTASI");
        if (pendDokJudul.trim()) fdD.append("judul_dokumentasi", pendDokJudul.trim());
        pendDokFiles.forEach(function(f) { fdD.append("files", f); });
        await apiAuth.post(baseEp + "/" + recordId + "/lampiran", fdD, { headers: { "Content-Type": "multipart/form-data" } });
      }
    }

    async function handleSaveCrud() {
      var tabType = formTargetTab;
      var baseEp = tabType === "SUSATENSI" ? "/bdb/kasus-atensi" : tabType === "OPS_SATGAS" ? "/bdb/operasi-satgas" : "/bdb/kasus-menonjol";
      var titleVal = String(tabType === "OPS_SATGAS" ? (formData.nama || formData.judul || "") : (formData.judul || "")).trim();
      if (!titleVal) {
        toastRef.current?.show({ severity: "warn", summary: "Periksa Input", detail: "Judul / Nama wajib diisi." });
        return;
      }
      var isEdit = formMode === "edit";
      var ok = await confirmAction(isEdit ? "Simpan perubahan data ini?" : "Tambahkan data baru ini?");
      if (!ok) return;
      setFormSaving(true);
      try {
        var recId = formData.id;
        var lpIds = formLps.map(function(x) { return Number(x.id || x.lp_id); }).filter(Boolean);
        if (tabType === "SUSJOL") {
          var payloadS = {
            judul: titleVal,
            skala_viral: formData.skala_viral || "regional",
            tanggal_rilis: formData.tanggal_rilis || null,
            rilis: Boolean(formData.rilis),
            is_pinned: Boolean(formData.is_pinned),
            keterangan: formData.keterangan || "",
            lp_ids: lpIds
          };
          if (isEdit && recId) await apiAuth.patch(baseEp + "/" + recId, payloadS);
          else {
            var rS = (await apiAuth.post(baseEp, payloadS)).data;
            recId = rS?.data?.id ?? rS?.id;
          }
        } else if (tabType === "SUSATENSI") {
          var payloadA = {
            judul: titleVal,
            sumber_atensi: formData.sumber_atensi || null,
            level_atensi: formData.level_atensi || null,
            tanggal_atensi: formData.tanggal_atensi || null,
            status_atensi: formData.status_atensi || "aktif",
            is_pinned: Boolean(formData.is_pinned),
            keterangan: formData.keterangan || "",
            lp_ids: lpIds
          };
          if (isEdit && recId) await apiAuth.patch(baseEp + "/" + recId, payloadA);
          else {
            var rA = (await apiAuth.post(baseEp, payloadA)).data;
            recId = rA?.data?.id ?? rA?.id;
          }
        } else {
          var payloadO = {
            jenis: formData.jenis || "OPERASI",
            nama: titleVal,
            jenis_kategori: formData.jenis_kategori || null,
            nomor_dasar: formData.nomor_dasar || null,
            tanggal_dibentuk: formData.tanggal_dibentuk || null,
            tanggal_mulai: formData.tanggal_mulai || null,
            tanggal_selesai: formData.tanggal_selesai || null,
            satker_penyelenggara: formData.satker_penyelenggara || null,
            pimpinan: formData.pimpinan || null,
            deskripsi: formData.deskripsi || null,
            is_aktif: formData.is_aktif !== false,
            is_pinned: Boolean(formData.is_pinned)
          };
          if (isEdit && recId) await apiAuth.patch(baseEp + "/" + recId, payloadO);
          else {
            var rO = (await apiAuth.post(baseEp, payloadO)).data;
            recId = rO?.data?.id ?? rO?.id;
          }
          if (recId) await apiAuth.post(baseEp + "/" + recId + "/lp", { lp_ids: lpIds });
        }
        if (recId) await uploadSeparatedFiles(baseEp, recId);
        toastRef.current?.show({ severity: "success", summary: "Tersimpan", detail: "Data berhasil disimpan beserta lampiran." });
        setFormOpen(false);
        refreshCurrentTab();
      } catch (err) {
        toastRef.current?.show({ severity: "error", summary: "Gagal Menyimpan", detail: err?.response?.data?.message || "Terjadi kesalahan saat menyimpan." });
      } finally {
        setFormSaving(false);
      }
    }

    async function handleDeleteAttachment(att) {
      var ok = await confirmAction('Hapus berkas lampiran "' + (att.file_name || "") + '"?', { danger: true });
      if (!ok) return;
      var baseEp = formTargetTab === "SUSATENSI" ? "/bdb/kasus-atensi" : formTargetTab === "OPS_SATGAS" ? "/bdb/operasi-satgas" : "/bdb/kasus-menonjol";
      try {
        await apiAuth.delete(baseEp + "/attachments/" + att.id);
        setFormAtts(function(prev) { return prev.filter(function(x) { return x.id !== att.id; }); });
        refreshCurrentTab();
      } catch (e) {
        toastRef.current?.show({ severity: "error", summary: "Gagal", detail: "Gagal menghapus berkas lampiran." });
      }
    }

    async function handleTogglePinRow(row, tabType) {
      var baseEp = tabType === "SUSATENSI" ? "/bdb/kasus-atensi" : tabType === "OPS_SATGAS" ? "/bdb/operasi-satgas" : "/bdb/kasus-menonjol";
      try {
        var next = !row.is_pinned;
        await apiAuth.post(baseEp + "/" + row.id + "/pin", { is_pinned: next });
        toastRef.current?.show({ severity: "success", summary: next ? "Disematkan (Rank #1)" : "Sematan Dilepas", detail: (row.judul || row.nama) });
        refreshCurrentTab();
      } catch (e) {}
    }

    async function handleDeleteRow(row, tabType) {
      var ok = await confirmAction('Hapus "' + (row.judul || row.nama || "") + '"?', { danger: true, header: "Konfirmasi Hapus" });
      if (!ok) return;
      var baseEp = tabType === "SUSATENSI" ? "/bdb/kasus-atensi" : tabType === "OPS_SATGAS" ? "/bdb/operasi-satgas" : "/bdb/kasus-menonjol";
      try {
        await apiAuth.delete(baseEp + "/" + row.id, { data: { alasan: "Penghapusan melalui menu Susopsgas Kelola" } });
        toastRef.current?.show({ severity: "success", summary: "Terhapus", detail: "Data berhasil dihapus." });
        refreshCurrentTab();
      } catch (e) {
        toastRef.current?.show({ severity: "error", summary: "Gagal", detail: e?.response?.data?.message || "Gagal menghapus data." });
      }
    }

    var curFilter = tabFilters[activeTab] || tabFilters.SUSJOL;
    var moduleTabs = [
      { key: "SUSJOL", icon: "🔥", label: "Kelola Susjol (Kasus Menonjol)", count: susjolTotal, color: "#0284c7", bgActive: "linear-gradient(135deg, #0284c7, #0369a1)" },
      { key: "SUSATENSI", icon: "🚨", label: "Kelola Susatensi (Kasus Atensi)", count: atensiTotal, color: "#7c3aed", bgActive: "linear-gradient(135deg, #7c3aed, #6d28d9)" },
      { key: "OPS_SATGAS", icon: "🚩", label: "Kelola Operasi / Satgas", count: opsTotal, color: "#d97706", bgActive: "linear-gradient(135deg, #d97706, #b45309)" }
    ];

    var activeRows = activeTab === "SUSJOL" ? susjolData : activeTab === "SUSATENSI" ? atensiData : opsData;
    var activeLoading = activeTab === "SUSJOL" ? susjolLoading : activeTab === "SUSATENSI" ? atensiLoading : opsLoading;
    var formSprinAtts = formAtts.filter(function(x) { return String(x.kategori_lampiran || "").toUpperCase() === "SPRIN"; });
    var formDokAtts = formAtts.filter(function(x) { return String(x.kategori_lampiran || "DOKUMENTASI").toUpperCase() !== "SPRIN"; });
    var isViewOnly = formMode === "view";

    return jsxs("div", {
      children: [
        jsx(Toast, { ref: toastRef }),
        jsx(ConfirmDialog, {}),

        // Header + Add Action Button
        jsxs("div", {
          style: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginBottom: "0.85rem" },
          children: [
            jsxs("div", {
              children: [
                jsx("h1", { className: "cms-page-title", children: "Susopsgas — Kelola Susjol, Susatensi & Operasi/Satgas" }),
                jsx("p", { className: "cms-page-sub", children: "Manajemen terpadu Kasus Menonjol (Susjol), Kasus Atensi (Susatensi), serta Operasi & Satgas beserta penautan LP, multi-revisi Lampiran Sprin, dan Lampiran Dokumentasi per judul." })
              ]
            }),
            jsxs("div", {
              style: { display: "flex", gap: "0.5rem", flexWrap: "wrap" },
              children: [
                jsxs("button", {
                  type: "button",
                  onClick: function() { openCrudModal("create", activeTab, null); },
                  className: "att-btn primary",
                  style: { height: "40px", padding: "0 1.1rem", fontWeight: 800, fontSize: "0.83rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.45rem" },
                  children: [
                    jsx("i", { className: "pi pi-plus", style: { fontSize: "0.8rem" } }),
                    activeTab === "SUSJOL" ? "Tambah Kasus Menonjol (Susjol)" : activeTab === "SUSATENSI" ? "Tambah Kasus Atensi (Susatensi)" : "Tambah Operasi / Satgas"
                  ]
                }),
                jsxs("button", {
                  type: "button",
                  onClick: refreshCurrentTab,
                  className: "att-btn",
                  style: { height: "40px", padding: "0 0.9rem", fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.35rem" },
                  children: [jsx("i", { className: "pi pi-refresh", style: { fontSize: "0.78rem" } }), "Muat Ulang"]
                })
              ]
            })
          ]
        }),

        // 3-Tab Switcher Bar
        jsx("div", {
          className: "cms-card",
          style: { padding: "0.55rem", marginBottom: "0.9rem", borderRadius: "12px" },
          children: jsx("div", {
            style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(15rem, 1fr))", gap: "0.5rem" },
            children: moduleTabs.map(function(tab) {
              var isAct = activeTab === tab.key;
              return jsxs("button", {
                type: "button",
                onClick: function() { setActiveTab(tab.key); },
                style: {
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.6rem",
                  padding: "0.72rem 1rem", borderRadius: "9px",
                  border: isAct ? ("1px solid " + tab.color) : "1px solid transparent",
                  background: isAct ? tab.bgActive : "var(--cas-bg-subtle, #f8fafc)",
                  color: isAct ? "#ffffff" : "var(--cas-text-primary, #1e293b)",
                  fontWeight: 800, fontSize: "0.84rem", cursor: "pointer"
                },
                children: [
                  jsxs("span", { style: { display: "inline-flex", alignItems: "center", gap: "0.45rem" }, children: [jsx("span", { children: tab.icon }), jsx("span", { children: tab.label })] }),
                  jsx("span", {
                    style: { padding: "0.15rem 0.55rem", borderRadius: "999px", background: isAct ? "rgba(255,255,255,0.24)" : "rgba(15,23,42,0.08)", color: isAct ? "#ffffff" : tab.color, fontSize: "0.74rem", fontWeight: 800 },
                    children: Number(tab.count || 0).toLocaleString("id-ID")
                  })
                ]
              }, tab.key);
            })
          })
        }),

        // Filter Bar
        jsx("div", {
          className: "cms-card",
          style: { padding: "0.75rem 1rem", marginBottom: "0.9rem" },
          children: jsxs("div", {
            style: { display: "flex", alignItems: "center", gap: "0.55rem", flexWrap: "wrap" },
            children: [
              jsx(InputText, {
                value: curFilter.search || "",
                onChange: function(ev) { updateFilter(activeTab, { search: ev.target.value, page: 1 }); },
                placeholder: "Cari judul kasus, nama operasi/satgas, nomor sprin, atau nomor LP…",
                style: { flex: "1.4 1 15rem", height: "38px", boxSizing: "border-box" }
              }),
              jsx(InputText, {
                value: curFilter.satker || "",
                onChange: function(ev) { updateFilter(activeTab, { satker: ev.target.value, page: 1 }); },
                placeholder: "Filter Satker…",
                style: { flex: "0.8 1 10rem", height: "38px", boxSizing: "border-box" }
              }),
              jsx("button", {
                type: "button",
                onClick: function() { updateFilter(activeTab, { search: "", satker: "", page: 1 }); },
                className: "att-btn",
                style: { height: "38px", padding: "0 0.85rem", fontWeight: 700, cursor: "pointer" },
                children: "Reset"
              })
            ]
          })
        }),

        // Kelola Table
        activeLoading ? jsx("div", { className: "cms-card", style: { padding: "2rem", textAlign: "center", color: "#64748b", fontWeight: 600 }, children: "Memuat data…" }) :
        jsx("div", {
          className: "cms-card",
          style: { padding: 0, overflow: "hidden" },
          children: jsx("div", {
            style: { overflowX: "auto" },
            children: jsxs("table", {
              style: { width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" },
              children: [
                jsx("thead", {
                  children: jsxs("tr", {
                    style: { background: "#16324f", color: "#ffffff", textAlign: "left", fontSize: "0.73rem", textTransform: "uppercase" },
                    children: [
                      jsx("th", { style: { padding: "0.75rem 0.85rem", width: "3rem" }, children: "No" }),
                      jsx("th", { style: { padding: "0.75rem 0.85rem" }, children: activeTab === "OPS_SATGAS" ? "Nama Operasi / Satgas & Dasar Sprin" : "Judul Kasus & Keterangan" }),
                      jsx("th", { style: { padding: "0.75rem 0.85rem", width: "11rem" }, children: "Klasifikasi & Status" }),
                      jsx("th", { style: { padding: "0.75rem 0.85rem", width: "12rem" }, children: "Satker & Tanggal" }),
                      jsx("th", { style: { padding: "0.75rem 0.85rem", width: "9.5rem", textAlign: "center" }, children: "LP Terkait (Drilldown)" }),
                      jsx("th", { style: { padding: "0.75rem 0.85rem", width: "10.5rem", textAlign: "center" }, children: "Lampiran (Sprin vs Dok)" }),
                      jsx("th", { style: { padding: "0.75rem 0.85rem", width: "12.5rem", textAlign: "center" }, children: "Aksi Kelola" })
                    ]
                  })
                }),
                jsx("tbody", {
                  children: activeRows.length === 0 ? jsx("tr", {
                    children: jsx("td", { colSpan: 7, style: { padding: "2rem", textAlign: "center", color: "#64748b" }, children: "Belum ada data pada tab ini." })
                  }) : activeRows.map(function(row, idx) {
                    var dateStr = fmtDateId(row.tanggal_rilis || row.tanggal_atensi || row.tanggal_mulai || row.tanggal_dibentuk || row.first_tgl_laporan || row.created_at);
                    return jsxs("tr", {
                      style: { borderBottom: "1px solid #e2e8f0" },
                      children: [
                        jsx("td", { style: { padding: "0.7rem 0.85rem", fontWeight: 700, color: "#64748b" }, children: idx + 1 }),
                        jsxs("td", {
                          style: { padding: "0.7rem 0.85rem" },
                          children: [
                            jsxs("div", {
                              onClick: function() { openDrilldownModal(row, "LP"); },
                              style: { fontWeight: 800, color: "#0f172a", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap" },
                              children: [
                                row.is_pinned && jsx(Tag, { value: "📌 Disematkan", severity: "warning" }),
                                jsx("span", { children: row.judul || row.nama || "—" })
                              ]
                            }),
                            (row.latest_nomor_sprin || row.nomor_dasar) && jsx("div", { style: { fontSize: "0.72rem", color: "#b45309", fontWeight: 700, marginTop: "0.18rem" }, children: "📜 Sprin: " + (row.latest_nomor_sprin || row.nomor_dasar) }),
                            (row.keterangan || row.deskripsi) && jsx("div", { style: { fontSize: "0.74rem", color: "#64748b", marginTop: "0.15rem", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }, children: row.keterangan || row.deskripsi })
                          ]
                        }),
                        jsxs("td", {
                          style: { padding: "0.7rem 0.85rem" },
                          children: [
                            activeTab === "SUSJOL" && jsxs(Fragment, {
                              children: [
                                row.skala_viral && jsx(Tag, { value: String(row.skala_viral).toUpperCase(), severity: row.skala_viral === "nasional" ? "danger" : "warning" }),
                                jsx("div", { style: { fontSize: "0.72rem", color: "#64748b", marginTop: "0.2rem", fontWeight: 600 }, children: row.rilis ? "✅ Sudah Rilis" : "🔒 Internal" })
                              ]
                            }),
                            activeTab === "SUSATENSI" && jsxs(Fragment, {
                              children: [
                                row.level_atensi && jsx(Tag, { value: "Level " + row.level_atensi, severity: row.level_atensi === "tinggi" ? "danger" : "warning" }),
                                jsx("div", { style: { fontSize: "0.72rem", color: "#64748b", marginTop: "0.2rem", fontWeight: 600 }, children: "Status: " + (row.status_atensi || "aktif") })
                              ]
                            }),
                            activeTab === "OPS_SATGAS" && jsxs(Fragment, {
                              children: [
                                jsx(Tag, { value: (row.jenis || "OPERASI") + " • " + (row.status_tampil || "AKTIF"), severity: row.status_tampil === "AKTIF" ? "success" : "secondary" })
                              ]
                            })
                          ]
                        }),
                        jsxs("td", {
                          style: { padding: "0.7rem 0.85rem" },
                          children: [
                            jsx("div", { style: { fontWeight: 700, fontSize: "0.76rem", color: "#0f172a" }, children: inferSatker(row) }),
                            jsx("div", { style: { fontSize: "0.72rem", color: "#64748b", marginTop: "0.1rem" }, children: dateStr })
                          ]
                        }),
                        jsx("td", { style: { padding: "0.7rem 0.85rem", textAlign: "center" }, children: renderClickableLpBadge(row) }),
                        jsx("td", { style: { padding: "0.7rem 0.85rem", textAlign: "center" }, children: renderSeparatedLampiranBadges(row) }),
                        jsxs("td", {
                          style: { padding: "0.7rem 0.85rem", textAlign: "center" },
                          children: [
                            jsxs("div", {
                              style: { display: "inline-flex", gap: "0.3rem", flexWrap: "wrap", justifyContent: "center" },
                              children: [
                                jsx("button", {
                                  type: "button",
                                  onClick: function() { handleTogglePinRow(row, activeTab); },
                                  className: "att-btn",
                                  title: row.is_pinned ? "Lepas Sematan" : "Sematkan di Urutan Atas",
                                  style: { padding: "0.26rem 0.5rem", fontSize: "0.73rem", cursor: "pointer", background: row.is_pinned ? "#fef3c7" : "#f8fafc", borderColor: row.is_pinned ? "#f59e0b" : "#cbd5e1" },
                                  children: "📌"
                                }),
                                jsx("button", {
                                  type: "button",
                                  onClick: function() { openCrudModal("view", activeTab, row); },
                                  className: "att-btn",
                                  title: "Lihat Detail",
                                  style: { padding: "0.26rem 0.55rem", fontSize: "0.73rem", cursor: "pointer" },
                                  children: "👁️"
                                }),
                                jsx("button", {
                                  type: "button",
                                  onClick: function() { openCrudModal("edit", activeTab, row); },
                                  className: "att-btn primary",
                                  title: "Edit Data, LP & Lampiran Sprin/Dokumentasi",
                                  style: { padding: "0.26rem 0.6rem", fontSize: "0.73rem", cursor: "pointer", fontWeight: 700 },
                                  children: "✏️ Edit"
                                }),
                                jsx("button", {
                                  type: "button",
                                  onClick: function() { handleDeleteRow(row, activeTab); },
                                  className: "att-btn",
                                  title: "Hapus",
                                  style: { padding: "0.26rem 0.5rem", fontSize: "0.73rem", cursor: "pointer", color: "#dc2626", borderColor: "#fecaca", background: "#fef2f2" },
                                  children: "🗑️"
                                })
                              ]
                            })
                          ]
                        })
                      ]
                    }, row.id);
                  })
                })
              ]
            })
          })
        }),

        // CREATE / EDIT / VIEW MODAL WITH SEPARATED LAMPIRAN SPRIN (MULTI-REVISI) & LAMPIRAN DOKUMENTASI (PER JUDUL)
        formOpen && jsx("div", {
          onClick: function() { setFormOpen(false); },
          style: { position: "fixed", inset: 0, zIndex: 9985, background: "rgba(15,23,42,0.72)", backdropFilter: "blur(2px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" },
          children: jsxs("div", {
            onClick: function(ev) { ev.stopPropagation(); },
            style: { width: "62rem", maxWidth: "96vw", maxHeight: "92vh", background: "#ffffff", borderRadius: "14px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.38)", display: "flex", flexDirection: "column", overflow: "hidden" },
            children: [
              jsxs("div", {
                style: { padding: "0.95rem 1.3rem", background: "linear-gradient(135deg, #0f172a, #1e3a5f)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between" },
                children: [
                  jsx("div", {
                    style: { fontWeight: 800, fontSize: "0.98rem" },
                    children: (formMode === "create" ? "➕ Tambah " : formMode === "edit" ? "✏️ Edit " : "👁️ Detail ") +
                      (formTargetTab === "SUSJOL" ? "Kasus Menonjol (Susjol)" : formTargetTab === "SUSATENSI" ? "Kasus Atensi (Susatensi)" : "Operasi / Satgas")
                  }),
                  jsx("button", { type: "button", onClick: function() { setFormOpen(false); }, style: { background: "rgba(239,68,68,0.85)", border: "none", color: "#fff", borderRadius: "6px", padding: "0.3rem 0.7rem", cursor: "pointer", fontWeight: 800 }, children: "✕ Tutup" })
                ]
              }),
              jsxs("div", {
                style: { padding: "1.1rem 1.3rem", overflowY: "auto", flex: 1, display: "grid", gap: "1rem" },
                children: [
                  // 1. Informasi Utama Judul Kasus / Kegiatan
                  jsxs("div", {
                    style: { padding: "1rem", borderRadius: "10px", border: "1px solid #e2e8f0", background: "#f8fafc", display: "grid", gap: "0.75rem" },
                    children: [
                      jsx("div", { style: { fontWeight: 800, fontSize: "0.86rem", color: "#1e293b" }, children: "1. Informasi Utama Judul Kasus / Operasi / Satgas" }),
                      formTargetTab !== "OPS_SATGAS" ? jsxs("div", {
                        children: [
                          jsx("label", { style: { display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "0.25rem" }, children: "Judul Kasus" }),
                          jsx(InputText, { value: formData.judul || "", onChange: function(e) { setField("judul", e.target.value); }, disabled: isViewOnly, style: { width: "100%", height: "38px", boxSizing: "border-box" } })
                        ]
                      }) : jsxs("div", {
                        style: { display: "grid", gridTemplateColumns: "1fr 2fr", gap: "0.75rem" },
                        children: [
                          jsxs("div", {
                            children: [
                              jsx("label", { style: { display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "0.25rem" }, children: "Jenis" }),
                              jsxs("select", {
                                value: formData.jenis || "OPERASI",
                                onChange: function(e) { setField("jenis", e.target.value); },
                                disabled: isViewOnly,
                                className: "p-inputtext p-component",
                                style: { width: "100%", height: "38px", boxSizing: "border-box" },
                                children: [jsx("option", { value: "OPERASI", children: "OPERASI" }), jsx("option", { value: "SATGAS", children: "SATGAS" })]
                              })
                            ]
                          }),
                          jsxs("div", {
                            children: [
                              jsx("label", { style: { display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "0.25rem" }, children: "Nama Operasi / Satgas" }),
                              jsx(InputText, { value: formData.nama || "", onChange: function(e) { setField("nama", e.target.value); }, disabled: isViewOnly, style: { width: "100%", height: "38px", boxSizing: "border-box" } })
                            ]
                          })
                        ]
                      }),

                      formTargetTab === "SUSJOL" && jsxs("div", {
                        style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" },
                        children: [
                          jsxs("div", {
                            children: [
                              jsx("label", { style: { display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "0.25rem" }, children: "Skala Viral" }),
                              jsxs("select", {
                                value: formData.skala_viral || "regional",
                                onChange: function(e) { setField("skala_viral", e.target.value); },
                                disabled: isViewOnly,
                                className: "p-inputtext p-component",
                                style: { width: "100%", height: "38px", boxSizing: "border-box" },
                                children: [
                                  jsx("option", { value: "nasional", children: "Nasional" }),
                                  jsx("option", { value: "regional", children: "Regional" }),
                                  jsx("option", { value: "tidak viral", children: "Tidak Viral" })
                                ]
                              })
                            ]
                          }),
                          jsxs("div", {
                            children: [
                              jsx("label", { style: { display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "0.25rem" }, children: "Tanggal Rilis" }),
                              jsx("input", { type: "date", value: formData.tanggal_rilis || "", onChange: function(e) { setField("tanggal_rilis", e.target.value); }, disabled: isViewOnly, className: "p-inputtext p-component", style: { width: "100%", height: "38px", boxSizing: "border-box" } })
                            ]
                          })
                        ]
                      }),

                      formTargetTab === "SUSATENSI" && jsxs("div", {
                        style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" },
                        children: [
                          jsxs("div", {
                            children: [
                              jsx("label", { style: { display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "0.25rem" }, children: "Sumber Atensi" }),
                              jsxs("select", {
                                value: formData.sumber_atensi || "pimpinan",
                                onChange: function(e) { setField("sumber_atensi", e.target.value); },
                                disabled: isViewOnly,
                                className: "p-inputtext p-component",
                                style: { width: "100%", height: "38px", boxSizing: "border-box" },
                                children: ["pimpinan", "internal", "media", "masyarakat", "instansi lain"].map(function(o) { return jsx("option", { value: o, children: o.toUpperCase() }, o); })
                              })
                            ]
                          }),
                          jsxs("div", {
                            children: [
                              jsx("label", { style: { display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "0.25rem" }, children: "Level Atensi" }),
                              jsxs("select", {
                                value: formData.level_atensi || "tinggi",
                                onChange: function(e) { setField("level_atensi", e.target.value); },
                                disabled: isViewOnly,
                                className: "p-inputtext p-component",
                                style: { width: "100%", height: "38px", boxSizing: "border-box" },
                                children: ["tinggi", "sedang", "biasa"].map(function(o) { return jsx("option", { value: o, children: o.toUpperCase() }, o); })
                              })
                            ]
                          }),
                          jsxs("div", {
                            children: [
                              jsx("label", { style: { display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "0.25rem" }, children: "Tanggal Atensi" }),
                              jsx("input", { type: "date", value: formData.tanggal_atensi || "", onChange: function(e) { setField("tanggal_atensi", e.target.value); }, disabled: isViewOnly, className: "p-inputtext p-component", style: { width: "100%", height: "38px", boxSizing: "border-box" } })
                            ]
                          })
                        ]
                      }),

                      formTargetTab === "OPS_SATGAS" && jsxs("div", {
                        style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" },
                        children: [
                          jsxs("div", {
                            children: [
                              jsx("label", { style: { display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "0.25rem" }, children: "Nomor Dasar (Sprin Awal)" }),
                              jsx(InputText, { value: formData.nomor_dasar || "", onChange: function(e) { setField("nomor_dasar", e.target.value); }, disabled: isViewOnly, style: { width: "100%", height: "38px", boxSizing: "border-box" } })
                            ]
                          }),
                          jsxs("div", {
                            children: [
                              jsx("label", { style: { display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "0.25rem" }, children: "Satker Penyelenggara" }),
                              jsx(InputText, { value: formData.satker_penyelenggara || "", onChange: function(e) { setField("satker_penyelenggara", e.target.value); }, disabled: isViewOnly, style: { width: "100%", height: "38px", boxSizing: "border-box" } })
                            ]
                          }),
                          jsxs("div", {
                            children: [
                              jsx("label", { style: { display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "0.25rem" }, children: "Periode Mulai" }),
                              jsx("input", { type: "date", value: formData.tanggal_mulai || "", onChange: function(e) { setField("tanggal_mulai", e.target.value); }, disabled: isViewOnly, className: "p-inputtext p-component", style: { width: "100%", height: "38px", boxSizing: "border-box" } })
                            ]
                          }),
                          jsxs("div", {
                            children: [
                              jsx("label", { style: { display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "0.25rem" }, children: "Periode Selesai" }),
                              jsx("input", { type: "date", value: formData.tanggal_selesai || "", onChange: function(e) { setField("tanggal_selesai", e.target.value); }, disabled: isViewOnly, className: "p-inputtext p-component", style: { width: "100%", height: "38px", boxSizing: "border-box" } })
                            ]
                          })
                        ]
                      }),

                      jsxs("div", {
                        style: { display: "flex", gap: "1.25rem", flexWrap: "wrap", alignItems: "center" },
                        children: [
                          formTargetTab === "SUSJOL" && jsxs("label", {
                            style: { display: "inline-flex", alignItems: "center", gap: "0.45rem", fontSize: "0.82rem", fontWeight: 700 },
                            children: [jsx("input", { type: "checkbox", checked: Boolean(formData.rilis), onChange: function(e) { setField("rilis", e.target.checked); }, disabled: isViewOnly }), "✅ Sudah Dirilis ke Publik"]
                          }),
                          jsxs("label", {
                            style: { display: "inline-flex", alignItems: "center", gap: "0.45rem", fontSize: "0.82rem", fontWeight: 700, color: "#b45309" },
                            children: [jsx("input", { type: "checkbox", checked: Boolean(formData.is_pinned), onChange: function(e) { setField("is_pinned", e.target.checked); }, disabled: isViewOnly }), "📌 Sematkan di Urutan Paling Atas (Rank #1)"]
                          })
                        ]
                      }),

                      jsxs("div", {
                        children: [
                          jsx("label", { style: { display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "0.25rem" }, children: "Keterangan / Deskripsi Singkat" }),
                          jsx(InputTextarea, {
                            rows: 3,
                            value: (formTargetTab === "OPS_SATGAS" ? formData.deskripsi : formData.keterangan) || "",
                            onChange: function(e) { setField(formTargetTab === "OPS_SATGAS" ? "deskripsi" : "keterangan", e.target.value); },
                            disabled: isViewOnly,
                            style: { width: "100%", boxSizing: "border-box" }
                          })
                        ]
                      })
                    ]
                  }),

                  // 2. LP Terkait Picker
                  jsxs("div", {
                    style: { padding: "1rem", borderRadius: "10px", border: "1px solid #cbd5e1", background: "#ffffff", display: "grid", gap: "0.6rem" },
                    children: [
                      jsxs("div", {
                        style: { display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" },
                        children: [
                          jsx("div", { style: { fontWeight: 800, fontSize: "0.86rem", color: "#0369a1" }, children: "2. Daftar Laporan Polisi (LP) Terkait (" + formLps.length + " LP)" }),
                          !isViewOnly && jsx("button", {
                            type: "button",
                            onClick: function() { setLpPickerOpen(true); },
                            className: "att-btn primary",
                            style: { padding: "0.35rem 0.75rem", fontSize: "0.76rem", cursor: "pointer", fontWeight: 700 },
                            children: "🔍 Pilih / Tambah LP Terkait"
                          })
                        ]
                      }),
                      formLps.length === 0 ? jsx("div", { style: { fontSize: "0.8rem", color: "#94a3b8" }, children: "Belum ada LP yang ditautkan." }) :
                      jsx("div", {
                        style: { display: "flex", flexWrap: "wrap", gap: "0.4rem", maxHeight: "9rem", overflowY: "auto" },
                        children: formLps.map(function(lp) {
                          return jsxs("span", {
                            className: "att-chip",
                            style: { display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.25rem 0.6rem", fontSize: "0.76rem" },
                            children: [
                              jsx("strong", { children: lp.no_laporan }),
                              !isViewOnly && jsx("button", {
                                type: "button",
                                onClick: function() { setFormLps(function(prev) { return prev.filter(function(x) { return x.id !== lp.id; }); }); },
                                style: { border: "none", background: "transparent", color: "#dc2626", cursor: "pointer", fontWeight: 800 },
                                children: "✕"
                              })
                            ]
                          }, lp.id);
                        })
                      })
                    ]
                  }),

                  // 3A. SEPARATED SECTION A: LAMPIRAN SPRIN (MULTI-REVISI)
                  jsxs("div", {
                    style: { padding: "1rem", borderRadius: "10px", border: "1px solid #f59e0b", background: "#fffbeb", display: "grid", gap: "0.65rem" },
                    children: [
                      jsxs("div", {
                        children: [
                          jsx("div", { style: { fontWeight: 800, fontSize: "0.86rem", color: "#92400e" }, children: "3A. 📜 Lampiran Surat Perintah (Sprin) — Bisa Diperbaharui Beberapa Kali (Multi-Revisi)" }),
                          jsx("div", { style: { fontSize: "0.75rem", color: "#b45309" }, children: "Gunakan bagian ini khusus untuk mengunggah dokumen Sprin awal maupun revisi/perpanjangan Sprin berikutnya." })
                        ]
                      }),
                      !isViewOnly && jsxs("div", {
                        style: { display: "grid", gridTemplateColumns: "1fr 1fr 1.2fr", gap: "0.6rem" },
                        children: [
                          jsx(InputText, { value: pendSprinNomor, onChange: function(e) { setPendSprinNomor(e.target.value); }, placeholder: "Nomor Sprin (mis. Sprin/120/III/2026)", style: { width: "100%", height: "36px", boxSizing: "border-box" } }),
                          jsx("input", { type: "date", value: pendSprinTgl, onChange: function(e) { setPendSprinTgl(e.target.value); }, className: "p-inputtext p-component", style: { width: "100%", height: "36px", boxSizing: "border-box" } }),
                          jsx(InputText, { value: pendSprinCatatan, onChange: function(e) { setPendSprinCatatan(e.target.value); }, placeholder: "Catatan Revisi / Perpanjangan Sprin…", style: { width: "100%", height: "36px", boxSizing: "border-box" } })
                        ]
                      }),
                      !isViewOnly && jsxs("div", {
                        style: { display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" },
                        children: [
                          jsx("input", { type: "file", accept: ".pdf,image/*", multiple: true, onChange: function(e) { setPendSprinFiles(Array.from(e.target.files || [])); } }),
                          pendSprinFiles.length > 0 && jsx("span", { style: { fontSize: "0.76rem", fontWeight: 700, color: "#92400e" }, children: pendSprinFiles.length + " berkas Sprin siap diunggah saat Simpan" })
                        ]
                      }),
                      formSprinAtts.length > 0 && jsx("div", {
                        style: { display: "grid", gap: "0.4rem" },
                        children: formSprinAtts.map(function(att, idx) {
                          var revNo = att.revisi_ke || (formSprinAtts.length - idx);
                          return jsxs("div", {
                            style: { padding: "0.5rem 0.75rem", borderRadius: "8px", background: "#ffffff", border: "1px solid #fde68a", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", flexWrap: "wrap" },
                            children: [
                              jsxs("div", {
                                style: { fontSize: "0.77rem" },
                                children: [
                                  jsx("strong", { style: { color: "#b45309" }, children: "[Revisi #" + revNo + "] " }),
                                  jsx("strong", { children: att.nomor_sprin || att.file_name }),
                                  att.catatan_perubahan ? (" — " + att.catatan_perubahan) : ""
                                ]
                              }),
                              jsxs("div", {
                                style: { display: "flex", gap: "0.35rem" },
                                children: [
                                  att.url && jsx("button", { type: "button", onClick: function() { setPreviewFile({ name: att.file_name, url: att.url }); }, className: "att-btn", style: { padding: "0.2rem 0.5rem", fontSize: "0.72rem", cursor: "pointer" }, children: "👁️ Lihat" }),
                                  !isViewOnly && jsx("button", { type: "button", onClick: function() { handleDeleteAttachment(att); }, className: "att-btn", style: { padding: "0.2rem 0.5rem", fontSize: "0.72rem", color: "#dc2626", cursor: "pointer" }, children: "🗑️" })
                                ]
                              })
                            ]
                          }, att.id || idx);
                        })
                      })
                    ]
                  }),

                  // 3B. SEPARATED SECTION B: LAMPIRAN DOKUMENTASI (PER JUDUL KASUS)
                  jsxs("div", {
                    style: { padding: "1rem", borderRadius: "10px", border: "1px solid #10b981", background: "#ecfdf5", display: "grid", gap: "0.65rem" },
                    children: [
                      jsxs("div", {
                        children: [
                          jsx("div", { style: { fontWeight: 800, fontSize: "0.86rem", color: "#065f46" }, children: "3B. 📸 Lampiran Dokumentasi — Melekat pada Setiap Judul yang Diinput" }),
                          jsx("div", { style: { fontSize: "0.75rem", color: "#047857" }, children: "Unggah foto konferensi pers, barang bukti, infografis, atau paparan kasus yang melekat pada judul kasus ini." })
                        ]
                      }),
                      !isViewOnly && jsxs("div", {
                        style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", alignItems: "center" },
                        children: [
                          jsx(InputText, { value: pendDokJudul, onChange: function(e) { setPendDokJudul(e.target.value); }, placeholder: "Keterangan / Judul Dokumentasi (mis. Foto Barang Bukti & Rilis)…", style: { width: "100%", height: "36px", boxSizing: "border-box" } }),
                          jsx("input", { type: "file", multiple: true, onChange: function(e) { setPendDokFiles(Array.from(e.target.files || [])); } })
                        ]
                      }),
                      formDokAtts.length > 0 && jsx("div", {
                        style: { display: "grid", gap: "0.4rem" },
                        children: formDokAtts.map(function(att, idx) {
                          return jsxs("div", {
                            style: { padding: "0.5rem 0.75rem", borderRadius: "8px", background: "#ffffff", border: "1px solid #a7f3d0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", flexWrap: "wrap" },
                            children: [
                              jsxs("div", {
                                style: { fontSize: "0.77rem" },
                                children: [
                                  jsx("strong", { style: { color: "#047857" }, children: "[Dokumentasi] " }),
                                  jsx("strong", { children: att.judul_dokumentasi || att.file_name }),
                                  " (" + att.file_name + ")"
                                ]
                              }),
                              jsxs("div", {
                                style: { display: "flex", gap: "0.35rem" },
                                children: [
                                  att.url && jsx("button", { type: "button", onClick: function() { setPreviewFile({ name: att.file_name, url: att.url }); }, className: "att-btn", style: { padding: "0.2rem 0.5rem", fontSize: "0.72rem", cursor: "pointer" }, children: "👁️ Lihat" }),
                                  !isViewOnly && jsx("button", { type: "button", onClick: function() { handleDeleteAttachment(att); }, className: "att-btn", style: { padding: "0.2rem 0.5rem", fontSize: "0.72rem", color: "#dc2626", cursor: "pointer" }, children: "🗑️" })
                                ]
                              })
                            ]
                          }, att.id || idx);
                        })
                      })
                    ]
                  })
                ]
              }),
              jsxs("div", {
                style: { padding: "0.85rem 1.3rem", background: "#f8fafc", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "flex-end", gap: "0.5rem" },
                children: [
                  jsx("button", { type: "button", onClick: function() { setFormOpen(false); }, className: "att-btn", style: { padding: "0.45rem 1rem", cursor: "pointer", fontWeight: 700 }, children: isViewOnly ? "Tutup" : "Batal" }),
                  !isViewOnly && jsx("button", {
                    type: "button",
                    disabled: formSaving,
                    onClick: handleSaveCrud,
                    className: "att-btn primary",
                    style: { padding: "0.45rem 1.2rem", cursor: "pointer", fontWeight: 800 },
                    children: formSaving ? "Menyimpan…" : "💾 Simpan Data & Lampiran"
                  })
                ]
              })
            ]
          })
        }),

        // LP Picker Modal (Module 84761)
        jsx(LpPickerModal, {
          visible: lpPickerOpen,
          onHide: function() { setLpPickerOpen(false); },
          initialSelected: formLps,
          onConfirm: function(selected) { setFormLps(selected || []); }
        }),

        // KINERJA-PERKARA-STYLE LP & LAMPIRAN DRILLDOWN MODAL
        drillRow && jsx("div", {
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
              border: "1px solid #cbd5e1"
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
                  gap: "1rem"
                },
                children: [
                  jsxs("div", {
                    style: { display: "flex", alignItems: "center", gap: "0.65rem", flexWrap: "wrap" },
                    children: [
                      jsx("span", { style: { fontSize: "1.15rem" }, children: "📋" }),
                      jsx("span", { style: { fontWeight: 800, fontSize: "1rem", letterSpacing: "0.01em" }, children: "Daftar Laporan Polisi (LP) & Detail Lampiran — Susopsgas" }),
                      jsx(Tag, {
                        value: String(drillRow._source_type || drillRow.kategori || "SUSJOL").toUpperCase(),
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
          onClick: function() { setSprinQuickRow(null); },
          style: { position: "fixed", inset: 0, zIndex: 9995, background: "rgba(15,23,42,0.7)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" },
          children: jsxs("div", {
            onClick: function(ev) { ev.stopPropagation(); },
            style: { width: "36rem", maxWidth: "95vw", background: "#ffffff", borderRadius: "12px", padding: "1.2rem 1.35rem", boxShadow: "0 20px 40px rgba(0,0,0,0.35)", display: "grid", gap: "0.8rem" },
            children: [
              jsxs("div", {
                style: { display: "flex", alignItems: "center", justifyContent: "space-between" },
                children: [
                  jsx("div", { style: { fontWeight: 800, fontSize: "0.95rem", color: "#92400e" }, children: "📜 Tambah / Update Revisi Lampiran Sprin" }),
                  jsx("button", { type: "button", onClick: function() { setSprinQuickRow(null); }, style: { border: "none", background: "transparent", fontSize: "1rem", cursor: "pointer" }, children: "✕" })
                ]
              }),
              jsx("div", { style: { fontSize: "0.8rem", fontWeight: 700, color: "#334155" }, children: sprinQuickRow.judul || sprinQuickRow.nama }),
              jsxs("div", {
                style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" },
                children: [
                  jsxs("div", {
                    children: [
                      jsx("label", { style: { display: "block", fontSize: "0.75rem", fontWeight: 700, marginBottom: "0.25rem" }, children: "Nomor Sprin / Revisi" }),
                      jsx(InputText, { value: sprinNomor, onChange: function(e) { setSprinNomor(e.target.value); }, placeholder: "Sprin/124/III/OPS.1.3./2026", style: { width: "100%", height: "36px", boxSizing: "border-box" } })
                    ]
                  }),
                  jsxs("div", {
                    children: [
                      jsx("label", { style: { display: "block", fontSize: "0.75rem", fontWeight: 700, marginBottom: "0.25rem" }, children: "Tanggal Sprin" }),
                      jsx("input", { type: "date", value: sprinTgl, onChange: function(e) { setSprinTgl(e.target.value); }, className: "p-inputtext p-component", style: { width: "100%", height: "36px", boxSizing: "border-box", padding: "0 0.5rem" } })
                    ]
                  })
                ]
              }),
              jsxs("div", {
                children: [
                  jsx("label", { style: { display: "block", fontSize: "0.75rem", fontWeight: 700, marginBottom: "0.25rem" }, children: "Catatan Perubahan / Perpanjangan Sprin" }),
                  jsx(InputText, { value: sprinCatatan, onChange: function(e) { setSprinCatatan(e.target.value); }, placeholder: "Mis: Sprin Awal / Perpanjangan Tahap II / Penambahan Satgas...", style: { width: "100%", height: "36px", boxSizing: "border-box" } })
                ]
              }),
              jsxs("div", {
                children: [
                  jsx("label", { style: { display: "block", fontSize: "0.75rem", fontWeight: 700, marginBottom: "0.25rem" }, children: "Pilih Berkas PDF Sprin" }),
                  jsx("input", { type: "file", accept: ".pdf,image/*", multiple: true, onChange: function(e) { setSprinFiles(Array.from(e.target.files || [])); } })
                ]
              }),
              jsxs("div", {
                style: { display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "0.4rem" },
                children: [
                  jsx("button", { type: "button", onClick: function() { setSprinQuickRow(null); }, className: "att-btn", style: { padding: "0.4rem 0.85rem", cursor: "pointer" }, children: "Batal" }),
                  jsx("button", { type: "button", disabled: sprinSaving, onClick: handleQuickSprinUpload, className: "att-btn primary", style: { padding: "0.4rem 0.95rem", cursor: "pointer", fontWeight: 800 }, children: sprinSaving ? "Menyimpan…" : "☁️ Simpan Revisi Sprin" })
                ]
              })
            ]
          })
        }),

        // LP TIMELINE MODAL
        lpTimelineModal && jsx("div", {
          onClick: function() { setLpTimelineModal(null); },
          style: { position: "fixed", inset: 0, zIndex: 9996, background: "rgba(15,23,42,0.7)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" },
          children: jsxs("div", {
            onClick: function(ev) { ev.stopPropagation(); },
            style: { width: "48rem", maxWidth: "96vw", maxHeight: "86vh", overflowY: "auto", background: "#ffffff", borderRadius: "12px", padding: "1.2rem 1.35rem", boxShadow: "0 20px 40px rgba(0,0,0,0.35)", display: "grid", gap: "0.75rem" },
            children: [
              jsxs("div", {
                style: { display: "flex", alignItems: "center", justifyContent: "space-between" },
                children: [
                  jsx("div", { style: { fontWeight: 800, fontSize: "0.95rem", color: "#0f172a" }, children: "🔍 Rincian Alur & Dokumen Penyidikan LP: " + (lpTimelineModal.no_laporan || "") }),
                  jsx("button", { type: "button", onClick: function() { setLpTimelineModal(null); }, style: { border: "none", background: "transparent", fontSize: "1rem", cursor: "pointer" }, children: "✕" })
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
