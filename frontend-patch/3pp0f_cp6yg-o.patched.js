(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,72382,e=>{"use strict";let t=(0,e.i(56420).default)("eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);e.s(["Eye",0,t],72382)},89269,e=>{"use strict";var t=e.i(71645),n=e.i(48264),a=e.i(43456),r=e.i(29168),i=e.i(83128),l=e.i(40623),o=e.i(73193);function s(){return(s=Object.assign.bind()).apply(null,arguments)}function c(e){return(c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}var u=a.ComponentBase.extend({defaultProps:{__TYPE:"InputTextarea",__parentMetadata:null,autoResize:!1,invalid:!1,variant:null,keyfilter:null,onBlur:null,onFocus:null,onBeforeInput:null,onInput:null,onKeyDown:null,onKeyUp:null,onPaste:null,tooltip:null,tooltipOptions:null,validateOnly:!1,children:void 0,className:null},css:{classes:{root:function(e){var t=e.props,n=e.context,a=e.isFilled;return(0,o.classNames)("p-inputtextarea p-inputtext p-component",{"p-disabled":t.disabled,"p-filled":a,"p-inputtextarea-resizable":t.autoResize,"p-invalid":t.invalid,"p-variant-filled":t.variant?"filled"===t.variant:n&&"filled"===n.inputStyle})}},styles:"\n@layer primereact {\n    .p-inputtextarea-resizable {\n        overflow: hidden;\n        resize: none;\n    }\n    \n    .p-fluid .p-inputtextarea {\n        width: 100%;\n    }\n}\n"}});function p(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,a)}return n}function d(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?p(Object(n),!0).forEach(function(t){!function(e,t,n){var a;(a=function(e,t){if("object"!=c(e)||!e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var a=n.call(e,t||"default");if("object"!=c(a))return a;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(t,"string"),(t="symbol"==c(a)?a:a+"")in e)?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n}(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):p(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}var m=t.memo(t.forwardRef(function(e,c){var p=(0,r.useMergeProps)(),m=t.useContext(n.PrimeReactContext),f=u.getProps(e,m),y=t.useRef(c),g=t.useRef(0),b=u.setMetaData(d(d({props:f},f.__parentMetadata),{},{context:{disabled:f.disabled}})),h=b.ptm,v=b.cx,j=b.isUnstyled;(0,a.useHandleStyle)(u.css.styles,j,{name:"inputtextarea"});var x=function(e){var t=y.current;t&&k()&&(g.current||(g.current=t.scrollHeight,t.style.overflow="hidden"),(g.current!==t.scrollHeight||e)&&(t.style.height="",t.style.height=t.scrollHeight+"px",parseFloat(t.style.height)>=parseFloat(t.style.maxHeight)?(t.style.overflowY="scroll",t.style.height=t.style.maxHeight):t.style.overflow="hidden",g.current=t.scrollHeight))},k=function(){if(o.DomHandler.isVisible(y.current)){var e=y.current.getBoundingClientRect();return e.width>0&&e.height>0}return!1};t.useEffect(function(){o.ObjectUtils.combinedRefs(y,c)},[y,c]),t.useEffect(function(){f.autoResize&&x(!0)},[f.autoResize,f.value]);var w=t.useMemo(function(){return o.ObjectUtils.isNotEmpty(f.value)||o.ObjectUtils.isNotEmpty(f.defaultValue)},[f.value,f.defaultValue]),O=o.ObjectUtils.isNotEmpty(f.tooltip),P=p({ref:y,className:(0,o.classNames)(f.className,v("root",{context:m,isFilled:w})),autoComplete:f.autoComplete,onFocus:function(e){f.autoResize&&x(),f.onFocus&&f.onFocus(e)},onBlur:function(e){f.autoResize&&x(),f.onBlur&&f.onBlur(e)},onKeyUp:function(e){f.autoResize&&x(),f.onKeyUp&&f.onKeyUp(e)},onKeyDown:function(e){f.onKeyDown&&f.onKeyDown(e),f.keyfilter&&i.KeyFilter.onKeyPress(e,f.keyfilter,f.validateOnly)},onBeforeInput:function(e){f.onBeforeInput&&f.onBeforeInput(e),f.keyfilter&&i.KeyFilter.onBeforeInput(e,f.keyfilter,f.validateOnly)},onInput:function(e){var t=e.target;f.autoResize&&x(o.ObjectUtils.isEmpty(t.value)),f.onInput&&f.onInput(e),o.ObjectUtils.isNotEmpty(t.value)?o.DomHandler.addClass(t,"p-filled"):o.DomHandler.removeClass(t,"p-filled")},onPaste:function(e){f.onPaste&&f.onPaste(e),f.keyfilter&&i.KeyFilter.onPaste(e,f.keyfilter,f.validateOnly)}},u.getOtherProps(f),h("root"));return t.createElement(t.Fragment,null,t.createElement("textarea",P),O&&t.createElement(l.Tooltip,s({target:y,content:f.tooltip,pt:h("tooltip")},f.tooltipOptions)))}));m.displayName="InputTextarea",e.s(["InputTextarea",0,m])},71326,97778,e=>{"use strict";var t=e.i(71645),n=e.i(48264),a=e.i(1743),r=e.i(43456),i=e.i(71144),l=e.i(29168),o=e.i(28797),s=e.i(27259),c=e.i(73193);function u(){return(u=Object.assign.bind()).apply(null,arguments)}function p(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,a=Array(t);n<t;n++)a[n]=e[n];return a}function d(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"u">typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var a,r,i,l,o=[],s=!0,c=!1;try{if(i=(n=n.call(e)).next,0===t){if(Object(n)!==n)return;s=!1}else for(;!(s=(a=i.call(n)).done)&&(o.push(a.value),o.length!==t);s=!0);}catch(e){c=!0,r=e}finally{try{if(!s&&null!=n.return&&(l=n.return(),Object(l)!==l))return}finally{if(c)throw r}}return o}}(e,t)||function(e,t){if(e){if("string"==typeof e)return p(e,t);var n=({}).toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?p(e,t):void 0}}(e,t)||function(){throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function m(e){return(m="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}var f=r.ComponentBase.extend({defaultProps:{__TYPE:"ConfirmDialog",accept:null,acceptClassName:null,acceptIcon:null,acceptLabel:null,appendTo:null,breakpoints:null,children:void 0,className:null,content:null,defaultFocus:"accept",footer:null,icon:null,message:null,onHide:null,reject:null,rejectClassName:null,rejectIcon:null,rejectLabel:null,tagKey:void 0,visible:void 0},css:{classes:{root:"p-confirm-dialog",message:"p-confirm-dialog-message",icon:"p-confirm-dialog-icon",acceptButton:"p-confirm-dialog-accept",rejectButton:function(e){var t=e.getPropValue;return(0,c.classNames)("p-confirm-dialog-reject",{"p-button-text":!t("rejectClassName")})}}}});function y(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,a)}return n}function g(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?y(Object(n),!0).forEach(function(t){!function(e,t,n){var a;(a=function(e,t){if("object"!=m(e)||!e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var a=n.call(e,t||"default");if("object"!=m(a))return a;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(t,"string"),(t="symbol"==m(a)?a:a+"")in e)?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n}(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):y(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}var b=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return(e=g(g({},e),{visible:void 0===e.visible||e.visible})).visible&&o.OverlayService.emit("confirm-dialog",e),{show:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};o.OverlayService.emit("confirm-dialog",g(g(g({},e),t),{visible:!0}))},hide:function(){o.OverlayService.emit("confirm-dialog",{visible:!1})}}},h=t.memo(t.forwardRef(function(e,p){var m,y,b,h,v,j,x,k=(0,l.useMergeProps)(),w=t.useContext(n.PrimeReactContext),O=f.getProps(e,w),P=d(t.useState(O.visible),2),S=P[0],C=P[1],N=d(t.useState(!1),2),D=N[0],I=N[1],E=t.useRef(null),T=t.useRef(!1),B=t.useRef(null),z=function(){var e=O.group;return E.current&&(e=E.current.group),Object.assign({},O,E.current,{group:e})},R=function(e){return z()[e]},F=function(e){for(var t=arguments.length,n=Array(t>1?t-1:0),a=1;a<t;a++)n[a-1]=arguments[a];return c.ObjectUtils.getPropValue(R(e),n)},M=R("acceptLabel")||(0,n.localeOption)("accept"),H=R("rejectLabel")||(0,n.localeOption)("reject"),_={props:O,state:{visible:S}},U=f.setMetaData(_),A=U.ptm,K=U.cx,L=U.isUnstyled;(0,r.useHandleStyle)(f.css.styles,L,{name:"confirmdialog"});var V=function(){T.current||(T.current=!0,F("accept"),J("accept"))},W=function(){T.current||(T.current=!0,F("reject"),J("reject"))},$=function(){z().group===O.group&&(C(!0),T.current=!1,B.current=document.activeElement)},J=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"cancel";S&&("string"!=typeof e&&(e="cancel"),C(!1),F("onHide",e),c.DomHandler.focus(B.current),B.current=null)},Y=function(e){if(e.tagKey===O.tagKey&&(void 0===e.group||e.group===O.group)){var t=S!==e.visible;R("target")===e.target||O.target?t&&(E.current=e,e.visible?$():J()):(J(),E.current=e,I(!0))}};t.useEffect(function(){O.visible?$():J()},[O.visible]),t.useEffect(function(){return O.target||O.message||o.OverlayService.on("confirm-dialog",Y),function(){o.OverlayService.off("confirm-dialog",Y)}},[O.target]),(0,l.useUpdateEffect)(function(){D&&$()},[D]),(0,l.useUnmountEffect)(function(){o.OverlayService.off("confirm-dialog",Y)}),t.useImperativeHandle(p,function(){return{props:O,confirm:Y}});var G=(m=z(),y=c.ObjectUtils.getJSXElement(R("message"),m),b=k({className:K("icon")},A("icon")),h=c.IconUtils.getJSXIcon(R("icon"),g({},b),{props:m}),v=function(){var e=R("defaultFocus"),n=(0,c.classNames)("p-confirm-dialog-accept",R("acceptClassName")),r=(0,c.classNames)("p-confirm-dialog-reject",{"p-button-text":!R("rejectClassName")},R("rejectClassName")),i=k({label:H,autoFocus:"reject"===e,icon:R("rejectIcon"),className:(0,c.classNames)(R("rejectClassName"),K("rejectButton",{getPropValue:R})),onClick:W,pt:A("rejectButton"),unstyled:O.unstyled,__parentMetadata:{parent:_}},A("rejectButton")),l=k({label:M,autoFocus:void 0===e||"accept"===e,icon:R("acceptIcon"),className:(0,c.classNames)(R("acceptClassName"),K("acceptButton")),onClick:V,pt:A("acceptButton"),unstyled:O.unstyled,__parentMetadata:{parent:_}},A("acceptButton")),o=t.createElement(t.Fragment,null,t.createElement(a.Button,i),t.createElement(a.Button,l));if(R("footer")){var s={accept:V,reject:W,acceptClassName:n,rejectClassName:r,acceptLabel:M,rejectLabel:H,element:o,props:z()};return c.ObjectUtils.getJSXElement(R("footer"),s)}return o}(),j=k({className:K("message")},A("message")),x=k({visible:S,className:(0,c.classNames)(R("className"),K("root")),footer:v,onHide:J,breakpoints:R("breakpoints"),pt:m.pt,unstyled:O.unstyled,appendTo:R("appendTo"),__parentMetadata:{parent:_}},f.getOtherProps(m)),t.createElement(i.Dialog,u({},x,{content:null==e?void 0:e.content}),h,t.createElement("span",j,y)));return t.createElement(s.Portal,{element:G,appendTo:R("appendTo")})}));h.displayName="ConfirmDialog",e.s(["ConfirmDialog",0,h,"confirmDialog",0,b],97778),e.s(["confirmAction",0,function(e,t){return new Promise(n=>{let a=!1,r=e=>{a||(a=!0,n(e))};b({message:e,header:t?.header||"Konfirmasi",icon:t?.danger?"pi pi-exclamation-triangle":"pi pi-question-circle",acceptLabel:t?.acceptLabel||"Ya, lanjutkan",rejectLabel:"Batal",acceptClassName:t?.danger?"p-button-danger":void 0,accept:()=>r(!0),reject:()=>r(!1),onHide:()=>r(!1)})})}],71326)},73474,e=>{"use strict";let t=(0,e.i(56420).default)("trash-2",[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]]);e.s(["Trash2",0,t],73474)},26091,e=>{"use strict";let t=(0,e.i(56420).default)("file-text",[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]);e.s(["FileText",0,t],26091)},64801,e=>{"use strict";let t=(0,e.i(56420).default)("paperclip",[["path",{d:"m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551",key:"1miecu"}]]);e.s(["Paperclip",0,t],64801)},63676,e=>{"use strict";let t=(0,e.i(56420).default)("x",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);e.s(["X",0,t],63676)},15281,e=>{"use strict";let t=(0,e.i(56420).default)("pencil",[["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",key:"1a8usu"}],["path",{d:"m15 5 4 4",key:"1mk7zo"}]]);e.s(["Pencil",0,t],15281)},77071,e=>{"use strict";let t=(0,e.i(56420).default)("plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);e.s(["Plus",0,t],77071)},94779,e=>{"use strict";var t=e.i(43476),n=e.i(71144),a=e.i(64801),r=e.i(26091);e.s(["default",0,function({file:e,onHide:i}){var l;let o,s=(l=e?.name,"pdf"===(o=(l||"").split(".").pop()?.toLowerCase()||"")?"pdf":["png","jpg","jpeg","gif","webp","bmp","svg","avif"].includes(o)?"image":"other");return(0,t.jsx)(n.Dialog,{header:(0,t.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.5rem",maxWidth:"80%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:[(0,t.jsx)(a.Paperclip,{size:16})," ",e?.name]}),visible:!!e,onHide:i,style:{width:"72rem",maxWidth:"96vw"},modal:!0,dismissableMask:!0,children:e?.url?"pdf"===s?(0,t.jsx)("iframe",{src:`${e.url}#toolbar=1`,title:e.name,style:{width:"100%",height:"80vh",border:"1px solid #e2e8f0",borderRadius:8}}):"image"===s?(0,t.jsx)("img",{src:e.url,alt:e.name,style:{maxWidth:"100%",maxHeight:"80vh",display:"block",margin:"0 auto",borderRadius:8}}):(0,t.jsxs)("div",{style:{padding:"2rem",textAlign:"center",color:"#64748b"},children:[(0,t.jsx)(r.FileText,{size:40,style:{color:"#94a3b8",marginBottom:"0.5rem"}}),(0,t.jsx)("div",{children:"Pratinjau inline tidak tersedia untuk tipe berkas ini."})]}):(0,t.jsx)("div",{style:{color:"#94a3b8"},children:"Berkas tidak tersedia."})})}])},70454,e=>{"use strict";var t=e.i(71645),n=e.i(48264),a=e.i(43456),r=e.i(29168),i=e.i(40623),l=e.i(73193);function o(){return(o=Object.assign.bind()).apply(null,arguments)}function s(e){return(s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}var c=a.ComponentBase.extend({defaultProps:{__TYPE:"InputSwitch",autoFocus:!1,checked:!1,className:null,disabled:!1,falseValue:!1,id:null,inputId:null,inputRef:null,invalid:!1,name:null,onBlur:null,onChange:null,onFocus:null,style:null,tabIndex:null,tooltip:null,tooltipOptions:null,trueValue:!0,children:void 0},css:{classes:{root:function(e){var t=e.props,n=e.checked;return(0,l.classNames)("p-inputswitch p-component",{"p-highlight":n,"p-disabled":t.disabled,"p-invalid":t.invalid})},input:"p-inputswitch-input",slider:"p-inputswitch-slider"}}});function u(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,a)}return n}var p=t.memo(t.forwardRef(function(e,p){var d=(0,r.useMergeProps)(),m=t.useContext(n.PrimeReactContext),f=c.getProps(e,m),y=c.setMetaData({props:f}),g=y.ptm,b=y.cx,h=y.isUnstyled;(0,a.useHandleStyle)(c.css.styles,h,{name:"inputswitch"});var v=t.useRef(null),j=t.useRef(f.inputRef),x=f.checked===f.trueValue;t.useImperativeHandle(p,function(){return{props:f,focus:function(){return l.DomHandler.focus(j.current)},getElement:function(){return v.current},getInput:function(){return j.current}}}),t.useEffect(function(){l.ObjectUtils.combinedRefs(j,f.inputRef)},[j,f.inputRef]),(0,r.useMountEffect)(function(){f.autoFocus&&l.DomHandler.focus(j.current,f.autoFocus)});var k=l.ObjectUtils.isNotEmpty(f.tooltip),w=c.getOtherProps(f),O=l.ObjectUtils.reduceKeys(w,l.DomHandler.ARIA_PROPS),P=d({className:(0,l.classNames)(f.className,b("root",{checked:x})),style:f.style,role:"checkbox","aria-checked":x,"data-p-highlight":x,"data-p-disabled":f.disabled},w,g("root")),S=d(function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?u(Object(n),!0).forEach(function(t){!function(e,t,n){var a;(a=function(e,t){if("object"!=s(e)||!e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var a=n.call(e,t||"default");if("object"!=s(a))return a;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(t,"string"),(t="symbol"==s(a)?a:a+"")in e)?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n}(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):u(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}({type:"checkbox",id:f.inputId,name:f.name,checked:x,onChange:function(e){if(f.onChange){var t=x?f.falseValue:f.trueValue;f.onChange({originalEvent:e,value:t,stopPropagation:function(){null==e||e.stopPropagation()},preventDefault:function(){null==e||e.preventDefault()},target:{name:f.name,id:f.id,value:t}})}},onFocus:function(e){var t;null==f||null==(t=f.onFocus)||t.call(f,e)},onBlur:function(e){var t;null==f||null==(t=f.onBlur)||t.call(f,e)},disabled:f.disabled,role:"switch",tabIndex:f.tabIndex,"aria-checked":x,className:b("input")},O),g("input")),C=d({className:b("slider")},g("slider"));return t.createElement(t.Fragment,null,t.createElement("div",o({id:f.id,ref:v},P),t.createElement("input",o({ref:j},S)),t.createElement("span",C)),k&&t.createElement(i.Tooltip,o({target:v,content:f.tooltip,pt:g("tooltip")},f.tooltipOptions)))}));p.displayName="InputSwitch",e.s(["InputSwitch",0,p])},94158,e=>{"use strict";
var t=e.i(43476),n=e.i(71645),i=e.i(44080),l=e.i(89269),o=e.i(68242),s=e.i(70454),c=e.i(1743),u=e.i(71144),p=e.i(53729),d=e.i(85118),m=e.i(97778),f=e.i(65489),y=e.i(77071),g=e.i(15281),b=e.i(73474),h=e.i(64801),v=e.i(26091),j=e.i(63676),x=e.i(72382),k=e.i(54858),w=e.i(71326),O=e.i(94779);
var iconF=e.i(56420).default;

var IconThumbsUp=iconF("thumbs-up",[["path",{d:"M7 10v12",key:"15g0md"}],["path",{d:"M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h3",key:"1k9o6c"}]]);
var IconMessageSquare=iconF("message-square",[["path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",key:"18vll8"}]]);
var IconRepeat=iconF("repeat",[["path",{d:"m17 2 4 4-4 4",key:"15tewc"}],["path",{d:"M3 11v-1a4 4 0 0 1 4-4h14",key:"84vlhf"}],["path",{d:"m7 22-4-4 4-4",key:"1wqimy"}],["path",{d:"M21 13v1a4 4 0 0 1-4 4H3",key:"1vljha"}]]);
var IconSend=iconF("send",[["path",{d:"m22 2-7 20-4-9-9-4Z",key:"1pi3w2"}],["path",{d:"M22 2 11 13",key:"524b9z"}]]);
var IconGlobe=iconF("globe",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",key:"13o1zl"}],["path",{d:"M2 12h20",key:"9i4pu4"}]]);
var IconLock=iconF("lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]);
var IconMoreVert=iconF("more-vertical",[["circle",{cx:"12",cy:"12",r:"1",key:"41luer"}],["circle",{cx:"12",cy:"5",r:"1",key:"gxeob9"}],["circle",{cx:"12",cy:"19",r:"1",key:"lyex9k"}]]);
var IconShieldCheck=iconF("shield-check",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);
var IconBookmark=iconF("bookmark",[["path",{d:"m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z",key:"1ed56d"}]]);
var IconEdit=iconF("edit",[["path",{d:"M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",key:"10e17c"}],["path",{d:"M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",key:"1k3h2b"}]]);
var IconImage=iconF("image",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m30uf"}],["circle",{cx:"9",cy:"9",r:"2",key:"af0m0g"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",key:"1xmnt7"}]]);
var IconVideo=iconF("video",[["path",{d:"m22 8-6 4 6 4V8Z",key:"5p941m"}],["rect",{width:"14",height:"12",x:"2",y:"6",rx:"2",ry:"2",key:"11as6f"}]]);
var IconUsers=iconF("users",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["path",{d:"M16 3.128a4 4 0 0 1 0 7.744",key:"16gr8j"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}]]);
var IconAlertTriangle=iconF("alert-triangle",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z",key:"14838j"}],["path",{d:"M12 9v4",key:"jvpvic"}],["path",{d:"M12 17h.01",key:"1g4y7l"}]]);
var IconMegaphone=iconF("megaphone",[["path",{d:"m3 11 18-5v12L3 14v-3z",key:"17omf3"}],["path",{d:"M11.6 16.8a3 3 0 1 1-5.8-1.6",key:"9lcfvg"}]]);

const REACTIONS = [
  { type: 'like', label: 'Suka', emoji: '👍', color: '#3b82f6' },
  { type: 'respect', label: 'Hormat', emoji: '🫡', color: '#6366f1' },
  { type: 'insightful', label: 'Wawasan', emoji: '💡', color: '#eab308' },
  { type: 'applause', label: 'Apresiasi', emoji: '👏', color: '#10b981' },
  { type: 'fire', label: 'Taktis', emoji: '🔥', color: '#ef4444' }
];

const HASHTAG_SHORTCUTS = ['#ModusOperandi', '#Curat', '#Curas', '#Narkoba', '#Siber', '#RestorativeJustice', '#DPO', '#Sindikat'];

function timeAgo(dateStr) {
  if (!dateStr) return 'baru saja';
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (diff < 1) return 'baru saja';
  if (diff < 60) return diff + ' menit lalu';
  const h = Math.floor(diff / 60);
  if (h < 24) return h + ' jam lalu';
  const d = Math.floor(h / 24);
  return d + ' hari lalu';
}

function getVerificationBadge(role, isUserOne) {
  if (isUserOne) return { color: '#f59e0b', label: 'Superadmin Terverifikasi', role: 'superadmin' };
  var r = String(role || '').toLowerCase().trim();
  if (r === 'superadmin') return { color: '#f59e0b', label: 'Superadmin Terverifikasi', role: 'superadmin' };
  if (r === 'admin_binops' || r === 'admin binops' || r === 'binops') return { color: '#10b981', label: 'Admin Binops Terverifikasi', role: 'admin_binops' };
  if (r === 'operator') return { color: '#3b82f6', label: 'Operator Terverifikasi', role: 'operator' };
  if (r === 'viewer') return { color: '#3b82f6', label: 'Viewer Terverifikasi', role: 'viewer' };
  return null;
}

function formatCallsign(rawCallsign, authorId, username) {
  var idStr = String(authorId || '');
  if (idStr === '1' || username === 'omeko11' || rawCallsign === 'omeko11') return '@omeko11';
  var c = String(rawCallsign || '').trim().replace(/^@/, '');
  if (c.startsWith('pers_') || c.startsWith('user_')) c = '';
  var invalidPlaceholders = ['personil', 'null', 'undefined', 'admin', 'user', 'none', '-'];
  if (c && /^[a-zA-Z0-9_.]{3,20}$/.test(c) && !invalidPlaceholders.includes(c.toLowerCase())) {
    return '@' + c.toLowerCase();
  }
  var seed = idStr || username || 'polri';
  var num = 0;
  for (var i = 0; i < seed.length; i++) num = (num * 31 + seed.charCodeAt(i)) % 100000;
  var code = Math.abs((num * 9301 + 49297) % 65536).toString(16).padStart(4, '0');
  return '@user_' + code;
}

function toTitleCase(str) {
  if (!str) return '';
  return String(str).toLowerCase().replace(/(?:^|\s|-|\/)[a-z]/g, function(c) {
    return c.toUpperCase();
  });
}

function renderCornerAvatar(avatarUrl, initials, badge, sizeRem, badgePx, svgPx) {
  return (0,t.jsxs)("div",{
    style:{
      position:"relative",
      width:sizeRem + "rem",
      height:sizeRem + "rem",
      flexShrink:0
    },
    children:[
      (0,t.jsx)("div",{
        style:{
          width:"100%",
          height:"100%",
          borderRadius:"999px",
          overflow:"hidden",
          background:"#1e293b",
          display:"flex",
          alignItems:"center",
          justifyContent:"center",
          fontWeight:700,
          fontSize:(sizeRem * 0.38) + "rem",
          color:"#38bdf8",
          border:"1px solid rgba(255,255,255,0.12)"
        },
        children:avatarUrl ? (0,t.jsx)("img",{src:avatarUrl,alt:"Avatar",style:{width:"100%",height:"100%",objectFit:"cover"}}) : initials
      }),
      badge && (0,t.jsx)("div",{
        title:badge.label,
        style:{
          position:"absolute",
          bottom:"-2px",
          right:"-2px",
          width:badgePx + "px",
          height:badgePx + "px",
          borderRadius:"999px",
          background:badge.color,
          border:"2px solid #0f172a",
          display:"flex",
          alignItems:"center",
          justifyContent:"center",
          boxShadow:"0 0 6px " + badge.color + "99"
        },
        children:(0,t.jsx)("svg",{
          viewBox:"0 0 12 12",
          width:svgPx + "px",
          height:svgPx + "px",
          fill:"none",
          stroke:"#ffffff",
          strokeWidth:"2.4",
          strokeLinecap:"round",
          strokeLinejoin:"round",
          children:(0,t.jsx)("path",{d:"m2.5 6 2.5 2.5 5-5"})
        })
      })
    ]
  });
}

function renderPostContent(text, onHashtagClick) {
  if (!text) return null;
  var parts = String(text).split(/(#[a-zA-Z0-9_]+)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('#') && part.length > 1) {
      return (0,t.jsx)("span",{
        key:idx,
        onClick:(e) => {
          e.stopPropagation();
          if (onHashtagClick) onHashtagClick(part);
        },
        style:{
          color:"#60a5fa",
          fontWeight:600,
          cursor:"pointer",
          borderRadius:"4px",
          padding:"0.1rem 0.3rem",
          transition:"all 0.15s ease",
          background:"rgba(59,130,246,0.12)"
        },
        onMouseEnter:(e) => {
          e.currentTarget.style.color = '#93c5fd';
          e.currentTarget.style.textDecoration = 'underline';
          e.currentTarget.style.background = 'rgba(59,130,246,0.25)';
        },
        onMouseLeave:(e) => {
          e.currentTarget.style.color = '#60a5fa';
          e.currentTarget.style.textDecoration = 'none';
          e.currentTarget.style.background = 'rgba(59,130,246,0.12)';
        },
        title:"Klik untuk melihat postingan terkait " + part,
        children:part
      });
    }
    return part;
  });
}

e.s(["default",0,function() {
  var toastRef = (0,n.useRef)(null);
  var fileInputRef = (0,n.useRef)(null);

  // Current user state (strictly resolve username/callsign to omeko11 for EKO)
  var [currentUser, setCurrentUser] = (0,n.useState)(() => {
    try {
      var u = JSON.parse(localStorage.getItem('user') || '{}');
      if (u.username === 'omeko11' || u.id === 1 || u.id === '1' || u.id === 'usr_superadmin') {
        u.callsign = 'omeko11';
        u.username = 'omeko11';
        u.name = 'EKO';
        u.role_bdb = 'superadmin';
      }
      return u;
    } catch { return {}; }
  });

  // Feed & filter states
  var [feedType, setFeedType] = (0,n.useState)('all');
  var [posts, setPosts] = (0,n.useState)([]);
  var [loading, setLoading] = (0,n.useState)(!0);
  var [searchQuery, setSearchQuery] = (0,n.useState)('');

  // Composer states
  var [content, setContent] = (0,n.useState)('');
  var [audienceType, setAudienceType] = (0,n.useState)('public');
  var [isOfficialJukrah, setIsOfficialJukrah] = (0,n.useState)(!1);
  var [attachedFiles, setAttachedFiles] = (0,n.useState)([]);
  var [submitting, setSubmitting] = (0,n.useState)(!1);

  // Active hover/reaction states & comment drawer states
  var [hoverReactionPostId, setHoverReactionPostId] = (0,n.useState)(null);
  var [activeCommentsPostId, setActiveCommentsPostId] = (0,n.useState)(null);
  var [postComments, setPostComments] = (0,n.useState)({});
  var [loadingComments, setLoadingComments] = (0,n.useState)(!1);
  var [commentInputs, setCommentInputs] = (0,n.useState)({});
  var [submittingComment, setSubmittingComment] = (0,n.useState)(!1);

  // Modals: Reactions List ("Siapa saja yg ngelike"), Edit Post, Report, PDF
  var [reactionsPostId, setReactionsPostId] = (0,n.useState)(null);
  var [reactionsList, setReactionsList] = (0,n.useState)([]);
  var [loadingReactions, setLoadingReactions] = (0,n.useState)(!1);

  var [editingPost, setEditingPost] = (0,n.useState)(null);
  var [editContent, setEditContent] = (0,n.useState)('');
  var [editAudience, setEditAudience] = (0,n.useState)('public');
  var [savingEdit, setSavingEdit] = (0,n.useState)(!1);

  var [previewPdf, setPreviewPdf] = (0,n.useState)(null);
  var [reportDialogPost, setReportDialogPost] = (0,n.useState)(null);
  var [reportReason, setReportReason] = (0,n.useState)('');
  var [submittingReport, setSubmittingReport] = (0,n.useState)(!1);

  var [previewUser, setPreviewUser] = (0,n.useState)(null);
  var [profileModalOpen, setProfileModalOpen] = (0,n.useState)(!1);
  var [loadingProfile, setLoadingProfile] = (0,n.useState)(!1);

  var handleOpenUserProfile = async (authorId, postContext) => {
    if (!authorId && !postContext) return;
    var targetId = authorId || postContext?.author_id || postContext?.id;
    var isTargetSuperadmin = String(targetId) === '1' || postContext?.author_username === 'omeko11' || postContext?.username === 'omeko11' || postContext?.callsign === 'omeko11';
    var initialUser = {
      id: targetId,
      name: isTargetSuperadmin ? 'EKO' : (postContext?.author_name || postContext?.name || 'Personil Polri'),
      username: isTargetSuperadmin ? 'omeko11' : (postContext?.author_username || postContext?.username || 'personil'),
      callsign: isTargetSuperadmin ? 'omeko11' : (postContext?.author_callsign || postContext?.callsign || postContext?.author_username || postContext?.username || 'personil'),
      role_bdb: isTargetSuperadmin ? 'superadmin' : (postContext?.author_role || postContext?.role_bdb || 'operator'),
      satker_nama: postContext?.author_satker || postContext?.satker_nama || postContext?.satker || 'Mabes Bareskrim',
      photo_url: postContext?.author_photo_url || postContext?.author_photo || postContext?.photo_url || null,
      pangkat: isTargetSuperadmin ? 'Superadmin' : (postContext?.pangkat || 'Penyidik Reserse Polri'),
      jabatan: isTargetSuperadmin ? 'Superadministrator Sistem' : (postContext?.jabatan || 'Penyidik Tindak Pidana'),
      nrp: postContext?.author_nrp || postContext?.nrp || null,
      email: postContext?.author_email || postContext?.email || null,
      email_polri: postContext?.author_email_polri || postContext?.email_polri || null,
      no_hp: postContext?.author_hp || postContext?.no_hp || null,
      bio: postContext?.author_bio || postContext?.bio || null
    };
    setPreviewUser(initialUser);
    setProfileModalOpen(!0);
    setLoadingProfile(!0);

    try {
      var res = await k.apiAuth.get('/bdb/jukrah/network/profile/' + targetId);
      if (res.data?.data) {
        setPreviewUser(res.data.data);
      }
    } catch (err) {
      // keep initialUser
    } finally {
      setLoadingProfile(!1);
    }
  };

  var isOfficialRole = ['superadmin', 'admin_binops', 'viewer'].includes(String(currentUser?.role_bdb || '').toLowerCase());
  var canBroadcastOfficial = ['superadmin', 'admin_binops'].includes(String(currentUser?.role_bdb || '').toLowerCase());

  // Fetch feed
  var fetchFeed = (0,n.useCallback)(async () => {
    setLoading(!0);
    try {
      var res = await k.apiAuth.get('/bdb/jukrah/feed', {
        params: {
          type: feedType,
          search: searchQuery || void 0
        }
      });
      setPosts(res.data?.data || []);
    } catch (err) {
      setPosts([]);
    } finally {
      setLoading(!1);
    }
  }, [feedType, searchQuery]);

  (0,n.useEffect)(() => {
    fetchFeed();
  }, [fetchFeed]);

  // Handle file select with validation (Image 5MB, Video 15MB, PDF 1MB)
  var handleFileSelect = (ev) => {
    var files = Array.from(ev.target.files || []);
    if (!files.length) return;
    var newFiles = [...attachedFiles];
    for (var f of files) {
      if (f.type.startsWith('image/') && f.size > 5 * 1024 * 1024) {
        toastRef.current?.show({ severity: 'warn', summary: 'Ukuran Terlalu Besar', detail: 'Foto maksimal 5 MB (' + f.name + ')' });
        continue;
      }
      if (f.type.startsWith('video/') && f.size > 15 * 1024 * 1024) {
        toastRef.current?.show({ severity: 'warn', summary: 'Ukuran Terlalu Besar', detail: 'Video maksimal 15 MB (' + f.name + ')' });
        continue;
      }
      if (f.type === 'application/pdf' && f.size > 1 * 1024 * 1024) {
        toastRef.current?.show({ severity: 'warn', summary: 'Ukuran Terlalu Besar', detail: 'PDF maksimal 1 MB (' + f.name + ')' });
        continue;
      }
      if (newFiles.length >= 5) {
        toastRef.current?.show({ severity: 'warn', summary: 'Maksimal Berkas', detail: 'Maksimal 5 lampiran berkas per postingan.' });
        break;
      }
      newFiles.push(f);
    }
    setAttachedFiles(newFiles);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Submit Post
  var handleSubmitPost = async () => {
    if (!content.trim() && !attachedFiles.length) {
      toastRef.current?.show({ severity: 'warn', summary: 'Lengkapi Konten', detail: 'Tuliskan informasi atau lampirkan berkas taktis.' });
      return;
    }
    if (content.length > 3000) {
      toastRef.current?.show({ severity: 'warn', summary: 'Karakter Melebihi Batas', detail: 'Panjang teks maksimal 3.000 karakter.' });
      return;
    }
    setSubmitting(!0);
    try {
      var formData = new FormData();
      formData.append('content', content);
      formData.append('audience_type', audienceType);
      formData.append('is_official_jukrah', String(isOfficialJukrah));
      for (var f of attachedFiles) {
        formData.append('files', f);
      }
      var res = await k.apiAuth.post('/bdb/jukrah/post', formData, {
        headers: { 'Content-Type': void 0 }
      });
      var createdPost = res.data?.data;
      if (createdPost) {
        setPosts(prev => [createdPost, ...prev]);
      }
      toastRef.current?.show({ severity: 'success', summary: 'Dipublikasikan', detail: 'Informasi berhasil dipublikasikan ke Ruang Kolaborasi.' });
      setContent('');
      setAttachedFiles([]);
      setIsOfficialJukrah(!1);
      await fetchFeed();
    } catch (err) {
      toastRef.current?.show({ severity: 'error', summary: 'Gagal', detail: err.response?.data?.message || 'Gagal mempublikasikan informasi.' });
    } finally {
      setSubmitting(!1);
    }
  };

  // Reaction toggle (Click to Like / Un-like, or pick emoji)
  var handleReact = async (postId, reactionType) => {
    setHoverReactionPostId(null);
    var post = posts.find(p => p.id === postId);
    var currentReact = post?.user_reaction || post?.my_reaction;
    var nextReact = currentReact === reactionType ? null : reactionType;

    // Optimistic update
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        var oldCounts = { ...(p.reaction_counts || {}) };
        var total = (p.total_reactions != null && p.total_reactions > 0)
          ? p.total_reactions
          : Object.values(oldCounts).reduce((acc, v) => acc + Number(v || 0), 0);
        if (currentReact && oldCounts[currentReact] > 0) {
          oldCounts[currentReact]--;
          total = Math.max(0, total - 1);
        }
        if (nextReact) {
          oldCounts[nextReact] = (oldCounts[nextReact] || 0) + 1;
          total++;
        }
        return {
          ...p,
          user_reaction: nextReact,
          my_reaction: nextReact,
          reaction_counts: oldCounts,
          total_reactions: total
        };
      }
      return p;
    }));

    try {
      var res = await k.apiAuth.post('/bdb/jukrah/post/' + postId + '/reaction', {
        reaction_type: reactionType
      });
      var updated = res.data?.data;
      if (updated) {
        setPosts(prev => prev.map(p => p.id === postId ? {
          ...p,
          user_reaction: updated.user_reaction,
          my_reaction: updated.user_reaction,
          reaction_counts: updated.reaction_counts || p.reaction_counts,
          total_reactions: updated.total_reactions ?? p.total_reactions
        } : p));
      }
    } catch (err) {
      // Revert if error
      fetchFeed();
    }
  };

  // Open "Siapa saja yg ngelike" modal
  var handleOpenReactionsList = async (postId) => {
    setReactionsPostId(postId);
    setLoadingReactions(!0);
    setReactionsList([]);
    try {
      var res = await k.apiAuth.get('/bdb/jukrah/post/' + postId + '/reactions');
      setReactionsList(res.data?.data || []);
    } catch (err) {
      setReactionsList([]);
    } finally {
      setLoadingReactions(!1);
    }
  };

  // Toggle Bookmark / Simpan
  var handleToggleBookmark = async (post) => {
    var prevBookmarked = Boolean(post.is_bookmarked);
    var nextBookmarked = !prevBookmarked;

    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, is_bookmarked: nextBookmarked } : p));
    toastRef.current?.show({
      severity: nextBookmarked ? 'success' : 'info',
      summary: nextBookmarked ? 'Disimpan' : 'Dihapus',
      detail: nextBookmarked ? 'Postingan disimpan ke daftar catatan tersimpan.' : 'Postingan dihapus dari catatan tersimpan.'
    });

    try {
      await k.apiAuth.post('/bdb/jukrah/post/' + post.id + '/bookmark', {});
    } catch (err) {
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, is_bookmarked: prevBookmarked } : p));
      toastRef.current?.show({ severity: 'error', summary: 'Gagal', detail: 'Gagal mengubah status simpanan.' });
    }
  };

  // Open Edit Post dialog
  var handleOpenEdit = (post) => {
    setEditingPost(post);
    setEditContent(post.content || '');
    setEditAudience(post.audience_type || 'public');
  };

  // Save edited post
  var handleSaveEdit = async () => {
    if (!editContent.trim()) {
      toastRef.current?.show({ severity: 'warn', summary: 'Lengkapi Konten', detail: 'Konten tidak boleh kosong.' });
      return;
    }
    setSavingEdit(!0);
    try {
      await k.apiAuth.post('/bdb/jukrah/post/' + editingPost.id + '/edit', {
        content: editContent.trim(),
        audience_type: editAudience
      });
      setPosts(prev => prev.map(p => p.id === editingPost.id ? {
        ...p,
        content: editContent.trim(),
        audience_type: editAudience,
        is_edited: !0
      } : p));
      toastRef.current?.show({ severity: 'success', summary: 'Diperbarui', detail: 'Postingan berhasil diperbarui.' });
      setEditingPost(null);
    } catch (err) {
      toastRef.current?.show({ severity: 'error', summary: 'Gagal', detail: err.response?.data?.message || 'Gagal menyimpan perubahan.' });
    } finally {
      setSavingEdit(!1);
    }
  };

  // Official Jukrah Acknowledgment
  var handleAcknowledge = async (postId) => {
    try {
      await k.apiAuth.post('/bdb/jukrah/post/' + postId + '/acknowledge', {});
      toastRef.current?.show({ severity: 'success', summary: 'Terkonfirmasi', detail: 'Pernyataan "Paham & Siap Laksanakan" berhasil dicatat.' });
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            has_acknowledged: !0,
            my_acknowledged: !0,
            acknowledged_count: (p.acknowledged_count || 0) + 1
          };
        }
        return p;
      }));
    } catch (err) {
      toastRef.current?.show({ severity: 'error', summary: 'Gagal', detail: err.response?.data?.message || 'Gagal mengonfirmasi.' });
    }
  };

  // Fetch comments
  var toggleComments = async (postId) => {
    if (activeCommentsPostId === postId) {
      setActiveCommentsPostId(null);
      return;
    }
    setActiveCommentsPostId(postId);
    if (!postComments[postId]) {
      setLoadingComments(!0);
      try {
        var res = await k.apiAuth.get('/bdb/jukrah/post/' + postId + '/comments');
        setPostComments(prev => ({ ...prev, [postId]: res.data?.data || [] }));
      } catch (err) {
        setPostComments(prev => ({ ...prev, [postId]: [] }));
      } finally {
        setLoadingComments(!1);
      }
    }
  };

  // Submit comment
  var handleAddComment = async (postId) => {
    var text = (commentInputs[postId] || '').trim();
    if (!text) return;
    if (text.length > 1000) {
      toastRef.current?.show({ severity: 'warn', summary: 'Karakter Melebihi Batas', detail: 'Komentar maksimal 1.000 karakter.' });
      return;
    }
    setSubmittingComment(!0);
    try {
      var res = await k.apiAuth.post('/bdb/jukrah/post/' + postId + '/comment', { content: text });
      var newComment = res.data?.data;
      setPostComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newComment]
      }));
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments_count: (p.comments_count || 0) + 1 } : p));
      toastRef.current?.show({ severity: 'success', summary: 'Terkirim', detail: 'Tanggapan berhasil ditambahkan.' });
    } catch (err) {
      toastRef.current?.show({ severity: 'error', summary: 'Gagal', detail: err.response?.data?.message || 'Gagal menambahkan komentar.' });
    } finally {
      setSubmittingComment(!1);
    }
  };

  // Delete comment
  var handleDeleteComment = async (postId, commentId) => {
    if (await (0,w.confirmAction)('Hapus tanggapan ini?', { danger: !0, acceptLabel: 'Hapus' })) {
      try {
        await k.apiAuth.delete('/bdb/jukrah/comment/' + commentId);
        setPostComments(prev => ({
          ...prev,
          [postId]: (prev[postId] || []).filter(c => c.id !== commentId)
        }));
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments_count: Math.max(0, (p.comments_count || 0) - 1) } : p));
        toastRef.current?.show({ severity: 'success', summary: 'Dihapus', detail: 'Tanggapan telah dihapus.' });
      } catch (err) {
        toastRef.current?.show({ severity: 'error', summary: 'Gagal', detail: 'Gagal menghapus tanggapan.' });
      }
    }
  };

  // Delete post
  var handleDeletePost = async (post) => {
    if (await (0,w.confirmAction)('Hapus informasi ini secara permanen dari Ruang Kolaborasi?', { danger: !0, acceptLabel: 'Hapus' })) {
      try {
        await k.apiAuth.post('/bdb/jukrah/post/' + post.id + '/delete', {});
        toastRef.current?.show({ severity: 'success', summary: 'Dihapus', detail: 'Postingan telah dihapus.' });
        setPosts(prev => prev.filter(p => p.id !== post.id));
      } catch (err) {
        toastRef.current?.show({ severity: 'error', summary: 'Gagal', detail: err.response?.data?.message || 'Gagal menghapus postingan.' });
      }
    }
  };

  // Change post visibility
  var handleToggleVisibility = async (post) => {
    var newAud = post.audience_type === 'private' ? 'public' : 'private';
    try {
      await k.apiAuth.post('/bdb/jukrah/post/' + post.id + '/visibility', { audience_type: newAud });
      toastRef.current?.show({ severity: 'success', summary: 'Diperbarui', detail: 'Visibilitas diubah menjadi ' + (newAud === 'private' ? 'Privat' : 'Publik') + '.' });
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, audience_type: newAud } : p));
    } catch (err) {
      toastRef.current?.show({ severity: 'error', summary: 'Gagal', detail: 'Gagal mengubah visibilitas.' });
    }
  };

  // Submit report
  var handleSendReport = async () => {
    if (!reportReason.trim()) {
      toastRef.current?.show({ severity: 'warn', summary: 'Lengkapi Alasan', detail: 'Berikan alasan laporan pengawasan konten.' });
      return;
    }
    setSubmittingReport(!0);
    try {
      await k.apiAuth.post('/bdb/jukrah/post/' + reportDialogPost.id + '/report', { reason: reportReason });
      toastRef.current?.show({ severity: 'success', summary: 'Laporan Terkirim', detail: 'Laporan telah diteruskan ke Pengawas Internal & Robinops Bareskrim Polri.' });
      setReportDialogPost(null);
      setReportReason('');
    } catch (err) {
      toastRef.current?.show({ severity: 'error', summary: 'Gagal', detail: err.response?.data?.message || 'Gagal mengirim laporan.' });
    } finally {
      setSubmittingReport(!1);
    }
  };

  var isSuperadmin = currentUser?.username === 'omeko11' || currentUser?.id === 1 || currentUser?.id === '1' || currentUser?.id === 'usr_superadmin' || currentUser?.role_bdb === 'superadmin';
  var myBadge = getVerificationBadge(currentUser?.role_bdb, isSuperadmin);
  var userAvatar = currentUser?.photo_url || currentUser?.foto;
  var userInitials = String(currentUser?.name || currentUser?.username || 'P').charAt(0).toUpperCase();
  var myHandle = formatCallsign(currentUser?.callsign, currentUser?.id, currentUser?.username);

  return (0,t.jsxs)("div",{style:{maxWidth:"54rem",margin:"0 auto",paddingBottom:"3rem"},children:[
    (0,t.jsx)(d.Toast,{ref:toastRef}),
    (0,t.jsx)(m.ConfirmDialog,{}),

    // Header Hero Banner (Clean, Formal, Dignified Bareskrim Polri)
    (0,t.jsxs)("div",{style:{background:"linear-gradient(135deg, rgba(30,58,138,0.22) 0%, rgba(15,23,42,0.65) 100%)",border:"1px solid var(--cas-border, rgba(255,255,255,0.12))",borderRadius:"12px",padding:"1.25rem 1.5rem",marginBottom:"1.25rem",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"1rem"},children:[
      (0,t.jsxs)("div",{children:[
        (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[
          (0,t.jsx)("h1",{style:{fontSize:"1.35rem",fontWeight:800,margin:0,color:"var(--cas-text-primary, #f8fafc)",letterSpacing:"-0.02em"},children:"Ruang Kolaborasi"}),
          (0,t.jsx)("span",{style:{fontSize:"0.65rem",background:"#2563eb",color:"#fff",padding:"0.15rem 0.55rem",borderRadius:"999px",fontWeight:800,letterSpacing:"0.03em"},children:"BARESKRIM POLRI"})
        ]}),
        (0,t.jsx)("p",{style:{margin:"0.35rem 0 0",fontSize:"0.82rem",color:"var(--cas-text-secondary, #94a3b8)"},children:"Forum koordinasi taktis, berbagi pengalaman lapangan, dan penguatan penyidikan Reserse Kriminal"})
      ]}),
      (0,t.jsxs)("div",{
        onClick:() => { window.location.href = '/cms/profile'; },
        style:{display:"flex",alignItems:"center",gap:"0.6rem",background:"rgba(255,255,255,0.06)",padding:"0.4rem 0.8rem",borderRadius:"8px",border:"1px solid rgba(255,255,255,0.1)",cursor:"pointer",transition:"all 0.15s ease"},
        onMouseEnter:e => e.currentTarget.style.borderColor = 'rgba(56,189,248,0.4)',
        onMouseLeave:e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)',
        title:"Buka Halaman Profil Saya",
        children:[
          renderCornerAvatar(userAvatar, userInitials, myBadge, 2.2, 14, 8),
          (0,t.jsxs)("div",{children:[
            (0,t.jsx)("div",{style:{fontSize:"0.72rem",color:"#94a3b8"},children:"Akun Aktif"}),
            (0,t.jsx)("div",{style:{fontSize:"0.85rem",fontWeight:800,color:"#38bdf8"},children:myHandle})
          ]})
        ]
      })
    ]}),

    // Interactive Quick Composer Card
    (0,t.jsxs)("div",{className:"cms-card",style:{padding:"1.1rem",borderRadius:"12px",marginBottom:"1.25rem",border:"1px solid var(--cas-border, rgba(255,255,255,0.12))"},children:[
      (0,t.jsxs)("div",{style:{display:"flex",gap:"0.75rem",alignItems:"flex-start"},children:[
        (0,t.jsx)("div",{
          onClick:() => handleOpenUserProfile(currentUser?.id, currentUser),
          style:{cursor:"pointer",display:"inline-flex",transition:"transform 0.15s ease"},
          onMouseEnter:e => e.currentTarget.style.transform = 'scale(1.05)',
          onMouseLeave:e => e.currentTarget.style.transform = 'scale(1)',
          title:"Klik untuk melihat profil akun",
          children:renderCornerAvatar(userAvatar, userInitials, myBadge, 2.5, 15, 8.5)
        }),
        (0,t.jsxs)("div",{style:{flex:1},children:[
          (0,t.jsx)(l.InputTextarea,{
            value:content,
            onChange:e=>setContent(e.target.value),
            placeholder:"Bagikan pengalaman lapangan, koordinasi taktis, atau cerita penanganan perkara...",
            rows:3,
            maxLength:3000,
            style:{width:"100%",borderRadius:"8px",resize:"vertical",fontSize:"0.88rem",lineHeight:"1.5",padding:"0.65rem 0.85rem"}
          }),
          // Live character count & shortcut hashtags
          (0,t.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"0.4rem",flexWrap:"wrap",gap:"0.5rem"},children:[
            (0,t.jsxs)("div",{style:{display:"flex",gap:"0.3rem",flexWrap:"wrap"},children:
              HASHTAG_SHORTCUTS.map(tag => (0,t.jsx)("button",{
                key:tag,
                type:"button",
                onClick:() => setContent(c => (c ? (c + ' ' + tag) : tag)),
                style:{background:"rgba(59,130,246,0.12)",border:"1px solid rgba(59,130,246,0.25)",color:"#60a5fa",borderRadius:"4px",fontSize:"0.7rem",padding:"0.15rem 0.45rem",cursor:"pointer",fontWeight:600},
                children:tag
              }))
            }),
            (0,t.jsxs)("span",{style:{fontSize:"0.72rem",color:content.length >= 2800 ? '#ef4444' : '#94a3b8',fontWeight:600},children:[
              content.length," / 3.000 karakter"
            ]})
          ]})
        ]})
      ]}),

      // Attached Files Preview Pills
      attachedFiles.length > 0 && (0,t.jsx)("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap",margin:"0.75rem 0 0.25rem 3.25rem"},children:
        attachedFiles.map((f, idx) => (0,t.jsxs)("div",{key:idx,style:{display:"inline-flex",alignItems:"center",gap:"0.4rem",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:"6px",padding:"0.25rem 0.55rem",fontSize:"0.75rem"},children:[
          f.type.startsWith('image/') ? (0,t.jsx)(IconImage,{size:13,style:{color:"#38bdf8"}}) : f.type.startsWith('video/') ? (0,t.jsx)(IconVideo,{size:13,style:{color:"#f43f5e"}}) : (0,t.jsx)(v.FileText,{size:13,style:{color:"#eab308"}}),
          (0,t.jsx)("span",{style:{maxWidth:"10rem",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:f.name}),
          (0,t.jsx)("span",{style:{color:"#94a3b8",fontSize:"0.65rem"},children:"(" + Math.round(f.size/1024) + " KB)"}),
          (0,t.jsx)("button",{type:"button",onClick:() => setAttachedFiles(attachedFiles.filter((_, i) => i !== idx)),style:{background:"none",border:"none",color:"#ef4444",cursor:"pointer",padding:0,marginLeft:"0.2rem"},children:(0,t.jsx)(j.X,{size:13})})
        ]}))
      }),

      // Action toolbar: attachment buttons, audience selector, official broadcast toggle, submit button
      (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:"0.85rem",paddingTop:"0.75rem",borderTop:"1px solid var(--cas-border, rgba(255,255,255,0.08))",flexWrap:"wrap",gap:"0.75rem"},children:[
        (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[
          (0,t.jsx)("input",{ref:fileInputRef,type:"file",multiple:!0,accept:"image/png,image/jpeg,image/webp,video/mp4,application/pdf",style:{display:"none"},onChange:handleFileSelect}),
          (0,t.jsxs)("button",{type:"button",onClick:() => fileInputRef.current?.click(),style:{display:"inline-flex",alignItems:"center",gap:"0.35rem",background:"transparent",border:"1px solid var(--cas-border, rgba(255,255,255,0.15))",borderRadius:"6px",padding:"0.35rem 0.65rem",fontSize:"0.78rem",color:"var(--cas-text-primary, #e2e8f0)",cursor:"pointer"},children:[
            (0,t.jsx)(h.Paperclip,{size:14})," Lampirkan Berkas"
          ]}),
          // Audience selector
          (0,t.jsx)(o.Dropdown,{
            value:audienceType,
            options:[
              { label: '🌐 Publik / Nasional', value: 'public' },
              { label: '🏛️ Regional Satker', value: 'regional' },
              { label: '👥 Rekan Penyidik', value: 'friends' },
              { label: '🔒 Hanya Saya (Privat)', value: 'private' }
            ],
            onChange:e => setAudienceType(e.value),
            style:{fontSize:"0.78rem"}
          }),
          // Official Jukrah checkbox (superadmin/admin only)
          canBroadcastOfficial && (0,t.jsxs)("label",{style:{display:"inline-flex",alignItems:"center",gap:"0.4rem",fontSize:"0.75rem",color:"#f59e0b",cursor:"pointer",fontWeight:600},children:[
            (0,t.jsx)("input",{type:"checkbox",checked:isOfficialJukrah,onChange:e => setIsOfficialJukrah(e.target.checked)}),
            "📢 Jukrah Resmi"
          ]})
        ]}),

        (0,t.jsxs)(c.Button,{
          onClick:handleSubmitPost,
          loading:submitting,
          style:{display:"inline-flex",alignItems:"center",gap:"0.4rem",borderRadius:"6px",fontWeight:700,fontSize:"0.82rem"},
          children:[
            (0,t.jsx)(IconSend,{size:14})," Publikasikan"
          ]
        })
      ]})
    ]}),

    // Feed Navigation Filter Tabs & Search Bar (With Saved & Mine filters!)
    (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1.1rem",flexWrap:"wrap",gap:"0.75rem"},children:[
      (0,t.jsxs)("div",{style:{display:"inline-flex",background:"var(--cas-bg-surface, rgba(255,255,255,0.05))",border:"1px solid var(--cas-border, rgba(255,255,255,0.1))",borderRadius:"8px",padding:"0.25rem",gap:"0.25rem",flexWrap:"wrap"},children:[
        [
          { id: 'all', label: '🌐 Semua' },
          { id: 'saved', label: '🔖 Tersimpan' },
          { id: 'mine', label: '📝 Postingan Saya' },
          { id: 'regional', label: '🏛️ Regional' },
          { id: 'official', label: '📢 Jukrah Kedinasan' }
        ].map(tab => (0,t.jsx)("button",{
          key:tab.id,
          type:"button",
          onClick:() => setFeedType(tab.id),
          style:{
            background:feedType === tab.id ? '#2563eb' : 'transparent',
            color:feedType === tab.id ? '#fff' : 'var(--cas-text-secondary, #94a3b8)',
            border:"none",
            borderRadius:"6px",
            padding:"0.35rem 0.75rem",
            fontSize:"0.78rem",
            fontWeight:700,
            cursor:"pointer"
          },
          children:tab.label
        }))
      ]}),

      (0,t.jsxs)("div",{style:{display:"flex",gap:"0.4rem",alignItems:"center"},children:[
        (0,t.jsx)(i.InputText,{
          value:searchQuery,
          onChange:e => setSearchQuery(e.target.value),
          onKeyDown:e => e.key === 'Enter' && fetchFeed(),
          placeholder:"Cari postingan / #tagar...",
          style:{width:"14rem",fontSize:"0.8rem",padding:"0.35rem 0.6rem"}
        }),
        searchQuery && (0,t.jsx)("button",{
          type:"button",
          onClick:() => setSearchQuery(''),
          title:"Hapus filter pencarian",
          style:{background:"rgba(239,68,68,0.15)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:"6px",color:"#f87171",padding:"0.35rem 0.55rem",fontSize:"0.75rem",fontWeight:700,cursor:"pointer"},
          children:"✕ Reset"
        }),
        (0,t.jsx)(c.Button,{
          icon:"pi pi-refresh",
          outlined:!0,
          onClick:fetchFeed,
          loading:loading,
          style:{padding:"0.35rem 0.6rem"}
        })
      ]})
    ]}),

    // Feed Posts List
    loading ? (
      (0,t.jsx)("div",{style:{textAlign:"center",padding:"3rem",color:"#94a3b8"},children:"Memuat ruang kolaborasi…"})
    ) : posts.length === 0 ? (
      (0,t.jsxs)("div",{className:"cms-card",style:{textAlign:"center",padding:"3rem",borderRadius:"12px"},children:[
        (0,t.jsx)(IconMessageSquare,{size:36,style:{color:"#64748b",marginBottom:"0.6rem",opacity:0.7}}),
        (0,t.jsx)("div",{style:{fontWeight:700,fontSize:"1rem",color:"var(--cas-text-primary, #f1f5f9)"},children:feedType === 'saved' ? "Belum ada postingan yang disimpan." : "Belum ada informasi pada kategori ini."}),
        (0,t.jsx)("div",{style:{fontSize:"0.8rem",color:"#94a3b8",marginTop:"0.25rem"},children:feedType === 'saved' ? "Simpan postingan penting dengan menekan tombol simpan agar mudah diakses kembali." : "Mulai bagikan catatan taktis, modus operandi, atau koordinasi kedinasan."})
      ]})
    ) : (
      (0,t.jsx)("div",{style:{display:"grid",gap:"1.1rem"},children:
        posts.map(post => {
          var postReactions = post.reaction_counts || {};
          var currentReact = post.user_reaction || post.my_reaction;
          var isAuthor = String(post.author_id) === String(currentUser?.id || currentUser?.user_id) || post.author_username === 'omeko11';
          var canEdit = isAuthor || isOfficialRole || post.can_edit;
          var authorAvatar = post.author_photo_url || post.author_photo || null;
          
          var isUserOne = String(post.author_id) === '1' || post.author_username === 'omeko11' || post.author_callsign === 'omeko11';
          var authorHandle = formatCallsign(post.author_callsign, post.author_id, post.author_username);
          var authorBadge = getVerificationBadge(post.author_role, isUserOne);
          var totalReactions = (post.total_reactions != null && post.total_reactions > 0)
            ? post.total_reactions
            : Object.values(post.reaction_counts || {}).reduce((acc, val) => acc + Number(val || 0), 0);
          var authorNameDisplay = isUserOne ? 'EKO' : post.author_name;
          var authorInitials = String(authorNameDisplay || authorHandle || 'P').charAt(0).toUpperCase();

          return (0,t.jsxs)("div",{
            key:post.id,
            className:"cms-card",
            style:{
              padding:"1.25rem",
              borderRadius:"12px",
              border:post.is_official_jukrah ? '1.5px solid #f59e0b' : '1px solid var(--cas-border, rgba(255,255,255,0.1))',
              boxShadow:post.is_official_jukrah ? '0 0 14px rgba(245,158,11,0.15)' : 'none',
              position:"relative"
            },
            children:[
              // Post Header
              (0,t.jsxs)("div",{style:{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:"0.75rem",marginBottom:"0.85rem"},children:[
                (0,t.jsxs)("div",{style:{display:"flex",gap:"0.75rem",alignItems:"center"},children:[
                  (0,t.jsx)("div",{
                    onClick:() => handleOpenUserProfile(post.author_id, post),
                    style:{cursor:"pointer",display:"inline-flex",transition:"transform 0.15s ease"},
                    onMouseEnter:e => e.currentTarget.style.transform = 'scale(1.05)',
                    onMouseLeave:e => e.currentTarget.style.transform = 'scale(1)',
                    title:"Klik untuk melihat profil personil",
                    children:renderCornerAvatar(authorAvatar, authorInitials, authorBadge, 2.5, 15, 8.5)
                  }),
                  (0,t.jsxs)("div",{children:[
                    (0,t.jsx)("div",{style:{display:"flex",alignItems:"center",gap:"0.45rem"},children:[
                      (0,t.jsx)("span",{
                        onClick:() => handleOpenUserProfile(post.author_id, post),
                        style:{fontWeight:800,fontSize:"0.92rem",color:"#38bdf8",letterSpacing:"-0.01em",cursor:"pointer",transition:"all 0.15s ease"},
                        onMouseEnter:e => { e.currentTarget.style.color = '#93c5fd'; e.currentTarget.style.textDecoration = 'underline'; },
                        onMouseLeave:e => { e.currentTarget.style.color = '#38bdf8'; e.currentTarget.style.textDecoration = 'none'; },
                        title:"Klik untuk melihat profil personil",
                        children:authorHandle
                      })
                    ]}),
                    (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.45rem",fontSize:"0.74rem",color:"#94a3b8",marginTop:"0.15rem"},children:[
                      (0,t.jsx)("span",{children:post.audience_type === 'private' ? '🔒 Privat' : post.audience_type === 'regional' ? '🏛️ Regional' : '🌐 Publik'}),
                      (0,t.jsx)("span",{style:{opacity:0.6},children:"•"}),
                      (0,t.jsx)("span",{children:timeAgo(post.created_at)}),
                      post.is_edited && (0,t.jsx)("span",{style:{color:"#64748b",fontStyle:"italic"},children:"(Diedit)"})
                    ]})
                  ]})
                ]}),

                // Post Context Menu: Edit, Save, Visibility, Delete, Report
                (0,t.jsxs)("div",{style:{display:"flex",gap:"0.3rem",alignItems:"center"},children:[
                  // Bookmark / Simpan button
                  (0,t.jsx)("button",{
                    type:"button",
                    onClick:() => handleToggleBookmark(post),
                    title:post.is_bookmarked ? 'Hapus dari Tersimpan' : 'Simpan Postingan',
                    style:{background:"transparent",border:"none",color:post.is_bookmarked ? '#38bdf8' : '#94a3b8',cursor:"pointer",padding:"0.3rem"},
                    children:(0,t.jsx)(IconBookmark,{size:16,style:{fill:post.is_bookmarked ? '#38bdf8' : 'none'}})
                  }),

                  // Edit button (for author / superadmin)
                  canEdit && (0,t.jsx)("button",{
                    type:"button",
                    onClick:() => handleOpenEdit(post),
                    title:"Edit Postingan",
                    style:{background:"transparent",border:"none",color:"#94a3b8",cursor:"pointer",padding:"0.3rem"},
                    children:(0,t.jsx)(IconEdit,{size:15})
                  }),

                  // Visibility toggle
                  isAuthor && (0,t.jsx)("button",{
                    type:"button",
                    onClick:() => handleToggleVisibility(post),
                    title:post.audience_type === 'private' ? 'Ubah ke Publik' : 'Ubah ke Privat',
                    style:{background:"transparent",border:"none",color:"#94a3b8",cursor:"pointer",padding:"0.3rem"},
                    children:post.audience_type === 'private' ? (0,t.jsx)(IconLock,{size:15,style:{color:"#eab308"}}) : (0,t.jsx)(IconGlobe,{size:15})
                  }),

                  // Delete post
                  (isAuthor || canBroadcastOfficial) && (0,t.jsx)("button",{
                    type:"button",
                    onClick:() => handleDeletePost(post),
                    title:"Hapus Postingan",
                    style:{background:"transparent",border:"none",color:"#ef4444",cursor:"pointer",padding:"0.3rem"},
                    children:(0,t.jsx)(b.Trash2,{size:15})
                  }),

                  // Report post
                  !isAuthor && (0,t.jsx)("button",{
                    type:"button",
                    onClick:() => { setReportDialogPost(post); setReportReason(''); },
                    title:"Laporkan Postingan",
                    style:{background:"transparent",border:"none",color:"#f59e0b",cursor:"pointer",padding:"0.3rem"},
                    children:(0,t.jsx)(IconAlertTriangle,{size:15})
                  })
                ]})
              ]}),

              // Official Jukrah Banner & Read Receipt Action
              post.is_official_jukrah && (0,t.jsxs)("div",{style:{background:"rgba(245,158,11,0.12)",border:"1px solid rgba(245,158,11,0.35)",borderRadius:"8px",padding:"0.65rem 0.85rem",marginBottom:"0.85rem",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"0.5rem"},children:[
                (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.4rem"},children:[
                  (0,t.jsx)(IconMegaphone,{size:16,style:{color:"#f59e0b"}}),
                  (0,t.jsx)("span",{style:{fontWeight:800,fontSize:"0.82rem",color:"#fbbf24"},children:"JUKRAH RESMI KEDINASAN"}),
                  (0,t.jsxs)("span",{style:{fontSize:"0.72rem",color:"#cbd5e1"},children:[
                    "(",post.acknowledged_count || 0," personil telah konfirmasi)"
                  ]})
                ]}),
                post.has_acknowledged || post.my_acknowledged ? (
                  (0,t.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.3rem",color:"#10b981",fontWeight:700,fontSize:"0.78rem"},children:[
                    "✅ Paham & Siap Laksanakan"
                  ]})
                ) : (
                  (0,t.jsxs)(c.Button,{
                    size:"small",
                    onClick:() => handleAcknowledge(post.id),
                    style:{fontSize:"0.75rem",fontWeight:700,background:"#f59e0b",borderColor:"#f59e0b",color:"#000",padding:"0.25rem 0.65rem"},
                    children:["🫡 Paham & Siap Laksanakan"]
                  })
                )
              ]}),

              // Post Body Content
              (0,t.jsx)("div",{style:{fontSize:"0.9rem",color:"var(--cas-text-primary, #e2e8f0)",lineHeight:"1.6",whiteSpace:"pre-wrap",wordBreak:"break-word",marginBottom:"0.85rem"},children:
                renderPostContent(post.content, (tag) => {
                  setFeedType('all');
                  setSearchQuery(tag);
                  window.scrollTo({ top: 220, behavior: 'smooth' });
                  toastRef.current?.show({ severity: 'info', summary: 'Filter Tagar', detail: 'Menampilkan postingan dengan tagar ' + tag });
                })
              }),

              // Media Attachments Viewer (Stream tokenized)
              post.media_urls && post.media_urls.length > 0 && (0,t.jsx)("div",{style:{display:"grid",gap:"0.5rem",marginBottom:"0.85rem",gridTemplateColumns:post.media_urls.length > 1 ? 'repeat(auto-fit, minmax(14rem, 1fr))' : '1fr'},children:
                post.media_urls.map((m, mIdx) => {
                  var mUrl = m.stream_url || (m.token ? ('/api/bdb/jukrah/stream/' + m.token) : m.url);
                  var isImage = m.type?.startsWith('image/') || m.name?.match(/\.(png|jpe?g|webp|gif)$/i);
                  var isVideo = m.type?.startsWith('video/') || m.name?.match(/\.(mp4|webm|mkv)$/i);
                  var isPdf = m.type === 'application/pdf' || m.name?.match(/\.pdf$/i);

                  if (isImage) {
                    return (0,t.jsx)("div",{key:mIdx,style:{borderRadius:"8px",overflow:"hidden",maxHeight:"22rem",background:"#0f172a",display:"flex",justifyContent:"center"},children:
                      (0,t.jsx)("img",{src:mUrl,alt:m.name||'Foto',style:{maxWidth:"100%",maxHeight:"22rem",objectFit:"contain"}})
                    });
                  }
                  if (isVideo) {
                    return (0,t.jsx)("div",{key:mIdx,style:{borderRadius:"8px",overflow:"hidden",maxHeight:"22rem",background:"#000"},children:
                      (0,t.jsx)("video",{src:mUrl,controls:!0,style:{width:"100%",maxHeight:"22rem"}})
                    });
                  }
                  return (0,t.jsxs)("button",{
                    key:mIdx,
                    type:"button",
                    onClick:() => setPreviewPdf({ url: mUrl, name: m.name || 'Dokumen PDF' }),
                    style:{display:"flex",alignItems:"center",gap:"0.6rem",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:"8px",padding:"0.65rem 0.85rem",color:"#38bdf8",cursor:"pointer",textAlign:"left"},
                    children:[
                      (0,t.jsx)(v.FileText,{size:20,style:{color:"#eab308"}}),
                      (0,t.jsxs)("div",{children:[
                        (0,t.jsx)("div",{style:{fontWeight:700,fontSize:"0.82rem"},children:m.name || 'Dokumen Terlampir'}),
                        (0,t.jsx)("div",{style:{fontSize:"0.7rem",color:"#94a3b8"},children:"Klik untuk pratinjau aman"})
                      ]})
                    ]
                  });
                })
              }),

              // Metrics stats row (Clickable reactions to open "Siapa saja yg ngelike" modal)
              (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",fontSize:"0.74rem",color:"#94a3b8",paddingBottom:"0.6rem",borderBottom:"1px solid var(--cas-border, rgba(255,255,255,0.08))"},children:[
                (totalReactions > 0) ? (
                  (0,t.jsxs)("button",{
                    type:"button",
                    onClick:() => handleOpenReactionsList(post.id),
                    style:{background:"transparent",border:"none",cursor:"pointer",padding:0,color:"#38bdf8",fontWeight:700,display:"inline-flex",alignItems:"center",gap:"0.35rem"},
                    title:"Lihat siapa saja yang memberi reaksi",
                    children:[
                      "👍 ",totalReactions," reaksi"
                    ]
                  })
                ) : (
                  (0,t.jsx)("span",{style:{color:"#64748b"},children:"Belum ada reaksi"})
                ),
                (0,t.jsxs)("div",{style:{display:"flex",gap:"0.8rem"},children:[
                  (0,t.jsxs)("span",{children:[post.comments_count || 0," komentar"]}),
                  (post.repost_count > 0) && (0,t.jsxs)("span",{children:[post.repost_count," diteruskan"]})
                ]})
              ]}),

              // Post Interaction Action Bar (Reactions with hover popup, Comment, Repost, Bookmark)
              (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-around",paddingTop:"0.4rem",position:"relative"},children:[
                // Long-Press / Hover Reaction Bar Trigger
                (0,t.jsxs)("div",{
                  style:{position:"relative"},
                  onMouseEnter:() => setHoverReactionPostId(post.id),
                  onMouseLeave:() => setTimeout(() => setHoverReactionPostId(id => (id === post.id ? null : id)), 400),
                  children:[
                    (0,t.jsxs)("button",{
                      type:"button",
                      onClick:() => handleReact(post.id, currentReact ? currentReact : 'like'),
                      style:{
                        display:"inline-flex",
                        alignItems:"center",
                        gap:"0.4rem",
                        background:"transparent",
                        border:"none",
                        color:currentReact ? '#38bdf8' : 'var(--cas-text-secondary, #94a3b8)',
                        cursor:"pointer",
                        padding:"0.45rem 0.8rem",
                        borderRadius:"6px",
                        fontWeight:700,
                        fontSize:"0.8rem"
                      },
                      children:[
                        currentReact ? (
                          (0,t.jsx)("span",{style:{fontSize:"1rem"},children:
                            REACTIONS.find(r => r.type === currentReact)?.emoji || '👍'
                          })
                        ) : (
                          (0,t.jsx)(IconThumbsUp,{size:15})
                        ),
                        currentReact ? (REACTIONS.find(r => r.type === currentReact)?.label || 'Suka') : 'Suka'
                      ]
                    }),

                    // Floating Reaction Palette (Ala FB/LinkedIn)
                    hoverReactionPostId === post.id && (0,t.jsx)("div",{
                      style:{
                        position:"absolute",
                        bottom:"100%",
                        left:"0",
                        transform:"translateY(-8px)",
                        background:"rgba(15,23,42,0.95)",
                        backdropFilter:"blur(12px)",
                        border:"1px solid rgba(255,255,255,0.18)",
                        boxShadow:"0 8px 24px rgba(0,0,0,0.45)",
                        borderRadius:"999px",
                        padding:"0.35rem 0.6rem",
                        display:"flex",
                        alignItems:"center",
                        gap:"0.45rem",
                        zIndex:100
                      },
                      children:REACTIONS.map(r => (0,t.jsx)("button",{
                        key:r.type,
                        type:"button",
                        onClick:() => handleReact(post.id, r.type),
                        title:r.label,
                        style:{
                          background:"transparent",
                          border:"none",
                          fontSize:"1.3rem",
                          cursor:"pointer",
                          padding:"0.2rem",
                          transition:"transform 0.15s ease",
                          display:"flex",
                          alignItems:"center",
                          justifyContent:"center"
                        },
                        onMouseEnter:e => e.currentTarget.style.transform = 'scale(1.35)',
                        onMouseLeave:e => e.currentTarget.style.transform = 'scale(1)',
                        children:r.emoji
                      }))
                    })
                  ]
                }),

                // Comment Button
                (0,t.jsxs)("button",{
                  type:"button",
                  onClick:() => toggleComments(post.id),
                  style:{
                    display:"inline-flex",
                    alignItems:"center",
                    gap:"0.4rem",
                    background:"transparent",
                    border:"none",
                    color:activeCommentsPostId === post.id ? '#38bdf8' : 'var(--cas-text-secondary, #94a3b8)',
                    cursor:"pointer",
                    padding:"0.45rem 0.8rem",
                    borderRadius:"6px",
                    fontWeight:700,
                    fontSize:"0.8rem"
                  },
                  children:[
                    (0,t.jsx)(IconMessageSquare,{size:15})," Tanggapan"
                  ]
                }),

                // Repost Button
                (0,t.jsxs)("button",{
                  type:"button",
                  onClick:() => {
                    var authorRef = formatCallsign(post.author_callsign, post.author_id, post.author_username);
                    setContent('🔁 Diteruskan dari ' + authorRef + ':\n\"' + post.content.substring(0, 100) + '...\"');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    toastRef.current?.show({ severity: 'info', summary: 'Siap Dibagikan', detail: 'Teks kutipan dimuat ke formulir di atas.' });
                  },
                  style:{
                    display:"inline-flex",
                    alignItems:"center",
                    gap:"0.4rem",
                    background:"transparent",
                    border:"none",
                    color:'var(--cas-text-secondary, #94a3b8)',
                    cursor:"pointer",
                    padding:"0.45rem 0.8rem",
                    borderRadius:"6px",
                    fontWeight:700,
                    fontSize:"0.8rem"
                  },
                  children:[
                    (0,t.jsx)(IconRepeat,{size:15})," Diteruskan"
                  ]
                }),

                // Bookmark / Simpan Button
                (0,t.jsxs)("button",{
                  type:"button",
                  onClick:() => handleToggleBookmark(post),
                  style:{
                    display:"inline-flex",
                    alignItems:"center",
                    gap:"0.4rem",
                    background:"transparent",
                    border:"none",
                    color:post.is_bookmarked ? '#38bdf8' : 'var(--cas-text-secondary, #94a3b8)',
                    cursor:"pointer",
                    padding:"0.45rem 0.8rem",
                    borderRadius:"6px",
                    fontWeight:700,
                    fontSize:"0.8rem"
                  },
                  children:[
                    (0,t.jsx)(IconBookmark,{size:15,style:{fill:post.is_bookmarked ? '#38bdf8' : 'none'}}),
                    post.is_bookmarked ? "Tersimpan" : "Simpan"
                  ]
                })
              ]}),

              // Expandable Comment Thread Section
              activeCommentsPostId === post.id && (0,t.jsxs)("div",{style:{marginTop:"0.85rem",paddingTop:"0.85rem",borderTop:"1px solid var(--cas-border, rgba(255,255,255,0.08))"},children:[
                // Comment input with 1,000 char limit
                (0,t.jsxs)("div",{style:{display:"flex",gap:"0.5rem",marginBottom:"0.85rem"},children:[
                  (0,t.jsx)(i.InputText,{
                    value:commentInputs[post.id] || '',
                    onChange:e => setCommentInputs({ ...commentInputs, [post.id]: e.target.value }),
                    onKeyDown:e => e.key === 'Enter' && handleAddComment(post.id),
                    placeholder:"Tulis tanggapan taktis... (maks 1.000 karakter)",
                    maxLength:1000,
                    style:{flex:1,fontSize:"0.82rem"}
                  }),
                  (0,t.jsx)(c.Button,{
                    icon:"pi pi-send",
                    size:"small",
                    onClick:() => handleAddComment(post.id),
                    loading:submittingComment
                  })
                ]}),

                // Comments list
                loadingComments ? (
                  (0,t.jsx)("div",{style:{fontSize:"0.78rem",color:"#94a3b8",textAlign:"center",padding:"0.5rem"},children:"Memuat tanggapan…"})
                ) : (postComments[post.id] || []).length === 0 ? (
                  (0,t.jsx)("div",{style:{fontSize:"0.78rem",color:"#94a3b8",textAlign:"center",padding:"0.5rem"},children:"Belum ada tanggapan. Berikan tanggapan pertama!"})
                ) : (
                  (0,t.jsx)("div",{style:{display:"grid",gap:"0.5rem"},children:
                    (postComments[post.id] || []).map(cm => {
                      var isCmAuthor = String(cm.user_id || cm.author_id) === String(currentUser?.id || currentUser?.user_id);
                      var isCmOne = String(cm.author_id) === '1' || cm.author_username === 'omeko11';
                      var cmBadge = getVerificationBadge(cm.author_role || cm.role_bdb, isCmOne);
                      var cmHandle = formatCallsign(cm.author_callsign, cm.author_id || cm.user_id, cm.author_username);
                      var cmInitials = String(cm.author_name || cmHandle || 'P').charAt(0).toUpperCase();
                      var cmAvatar = cm.author_photo_url || cm.author_photo || null;

                      return (0,t.jsxs)("div",{key:cm.id,style:{background:"var(--surface-50, rgba(0,0,0,0.02))",border:"1px solid var(--surface-border, rgba(0,0,0,0.06))",borderRadius:"8px",padding:"0.6rem 0.8rem",fontSize:"0.82rem",display:"flex",gap:"0.65rem",alignItems:"flex-start"},children:[
                        (0,t.jsx)("div",{
                          onClick:() => handleOpenUserProfile(cm.author_id || cm.user_id, cm),
                          style:{cursor:"pointer",display:"inline-flex",transition:"transform 0.15s ease"},
                          onMouseEnter:e => e.currentTarget.style.transform = 'scale(1.05)',
                          onMouseLeave:e => e.currentTarget.style.transform = 'scale(1)',
                          title:"Klik untuk melihat profil personil",
                          children:renderCornerAvatar(cmAvatar, cmInitials, cmBadge, 1.9, 12, 6.5)
                        }),
                        (0,t.jsxs)("div",{style:{flex:1},children:[
                          (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.2rem"},children:[
                            (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.4rem"},children:[
                              (0,t.jsx)("span",{
                                onClick:() => handleOpenUserProfile(cm.author_id || cm.user_id, cm),
                                style:{fontWeight:700,color:"#38bdf8",fontSize:"0.78rem",cursor:"pointer",transition:"all 0.15s ease"},
                                onMouseEnter:e => { e.currentTarget.style.color = '#93c5fd'; e.currentTarget.style.textDecoration = 'underline'; },
                                onMouseLeave:e => { e.currentTarget.style.color = '#38bdf8'; e.currentTarget.style.textDecoration = 'none'; },
                                title:"Klik untuk melihat profil personil",
                                children:cmHandle
                              }),
                              (0,t.jsx)("span",{style:{color:"#64748b",fontSize:"0.7rem"},children:timeAgo(cm.created_at)})
                            ]}),
                            isCmAuthor && (0,t.jsx)("button",{
                              type:"button",
                              onClick:() => handleDeleteComment(post.id, cm.id),
                              title:"Hapus komentar ini",
                              style:{background:"transparent",border:"none",color:"#ef4444",cursor:"pointer",padding:"0.1rem 0.3rem",fontSize:"0.75rem"},
                              children:"✕"
                            })
                          ]}),
                          (0,t.jsx)("div",{style:{color:"var(--text-color, #1e293b)",lineHeight:"1.4",whiteSpace:"pre-wrap"},children:
                            renderPostContent(cm.content, (tag) => {
                              setFeedType('all');
                              setSearchQuery(tag);
                              window.scrollTo({ top: 220, behavior: 'smooth' });
                            })
                          })
                        ]})
                      ]});
                    })
                  })
                )
              ]})
            ]
          });
        })
      })
    ),

    // Modal: Siapa Saja yang Ngelike ("Reaksi Personil")
    (0,t.jsx)(u.Dialog,{
      header:(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[
        (0,t.jsx)("span",{style:{fontSize:"1.2rem"},children:"👍"}),
        (0,t.jsx)("span",{style:{fontWeight:800},children:"Reaksi Personil (" + reactionsList.length + ")"})
      ]}),
      visible:!!reactionsPostId,
      onHide:() => setReactionsPostId(null),
      style:{width:"30rem",maxWidth:"95vw"},
      modal:!0,
      dismissableMask:!0,
      children:loadingReactions ? (
        (0,t.jsx)("div",{style:{padding:"2rem",textAlign:"center",color:"#94a3b8",fontSize:"0.85rem"},children:"Memuat daftar personil…"})
      ) : reactionsList.length === 0 ? (
        (0,t.jsx)("div",{style:{padding:"2rem",textAlign:"center",color:"#94a3b8",fontSize:"0.85rem"},children:"Belum ada personil yang memberikan reaksi."})
      ) : (
        (0,t.jsx)("div",{style:{display:"grid",gap:"0.6rem",padding:"0.5rem 0",maxHeight:"24rem",overflowY:"auto"},children:
          reactionsList.map(rx => {
            var usr = rx.user || {};
            var reactObj = REACTIONS.find(r => r.type === rx.reaction_type) || { emoji: '👍', label: 'Suka' };
            var isUsrOne = String(usr.id) === '1' || usr.username === 'omeko11';
            var usrBadge = getVerificationBadge(usr.role_bdb, isUsrOne);
            var usrHandle = formatCallsign(usr.callsign, usr.id, usr.username);
            var initials = String(usr.name || usr.username || 'P').charAt(0).toUpperCase();

            return (0,t.jsxs)("div",{key:rx.id,style:{display:"flex",alignItems:"center",justifyContent:"space-between",background:"var(--surface-50, rgba(0,0,0,0.02))",border:"1px solid var(--surface-border, rgba(0,0,0,0.06))",borderRadius:"8px",padding:"0.6rem 0.8rem"},children:[
              (0,t.jsxs)("div",{
                onClick:() => { setReactionsPostId(null); handleOpenUserProfile(usr.id, usr); },
                style:{display:"flex",alignItems:"center",gap:"0.65rem",cursor:"pointer"},
                title:"Klik untuk melihat profil personil",
                children:[
                  renderCornerAvatar(usr.photo_url, initials, usrBadge, 2.2, 14, 8),
                  (0,t.jsxs)("div",{children:[
                    (0,t.jsxs)("div",{style:{fontWeight:700,fontSize:"0.84rem",color:"var(--text-color, #0f172a)",display:"flex",alignItems:"center",gap:"0.35rem"},children:[
                      usr.pangkat && usr.pangkat !== '-' ? usr.pangkat + ' ' : '',
                      usr.name || usr.username
                    ]}),
                    (0,t.jsxs)("div",{style:{fontSize:"0.72rem",color:"#94a3b8"},children:[
                      usrHandle,
                      usr.satker ? ' • ' + toTitleCase(usr.satker) : ''
                    ]})
                  ]})
                ]
              }),
              (0,t.jsx)("div",{style:{fontSize:"1.3rem"},title:reactObj.label,children:reactObj.emoji})
            ]});
          })
        })
      )
    }),

    // Modal: Edit Postingan
    (0,t.jsx)(u.Dialog,{
      header:"✏️ Edit Informasi Postingan",
      visible:!!editingPost,
      onHide:() => setEditingPost(null),
      style:{width:"36rem",maxWidth:"95vw"},
      modal:!0,
      dismissableMask:!0,
      footer:(0,t.jsxs)("div",{style:{display:"flex",justifyContent:"flex-end",gap:"0.5rem"},children:[
        (0,t.jsx)(c.Button,{label:"Batal",text:!0,onClick:() => setEditingPost(null),disabled:savingEdit}),
        (0,t.jsx)(c.Button,{label:"Simpan Perubahan",onClick:handleSaveEdit,loading:savingEdit})
      ]}),
      children:(0,t.jsxs)("div",{style:{display:"grid",gap:"0.85rem",padding:"0.5rem 0"},children:[
        (0,t.jsx)(l.InputTextarea,{
          value:editContent,
          onChange:e => setEditContent(e.target.value),
          rows:5,
          maxLength:3000,
          style:{width:"100%",fontSize:"0.88rem",lineHeight:"1.5"}
        }),
        (0,t.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[
          (0,t.jsx)(o.Dropdown,{
            value:editAudience,
            options:[
              { label: '🌐 Publik / Nasional', value: 'public' },
              { label: '🏛️ Regional Satker', value: 'regional' },
              { label: '👥 Rekan Penyidik', value: 'friends' },
              { label: '🔒 Hanya Saya (Privat)', value: 'private' }
            ],
            onChange:e => setEditAudience(e.value),
            style:{fontSize:"0.8rem"}
          }),
          (0,t.jsxs)("span",{style:{fontSize:"0.72rem",color:editContent.length >= 2800 ? '#ef4444' : '#94a3b8'},children:[
            editContent.length," / 3.000 karakter"
          ]})
        ]})
      ]})
    }),

    // Dialog for reporting post
    (0,t.jsx)(u.Dialog,{
      header:"🚨 Laporkan Konten",
      visible:!!reportDialogPost,
      onHide:() => setReportDialogPost(null),
      style:{width:"28rem",maxWidth:"95vw"},
      modal:!0,
      footer:(0,t.jsxs)("div",{style:{display:"flex",justifyContent:"flex-end",gap:"0.5rem"},children:[
        (0,t.jsx)(c.Button,{label:"Batal",text:!0,onClick:() => setReportDialogPost(null),disabled:submittingReport}),
        (0,t.jsx)(c.Button,{label:"Kirim Laporan",severity:"danger",onClick:handleSendReport,loading:submittingReport})
      ]}),
      children:(0,t.jsxs)("div",{style:{display:"grid",gap:"0.75rem",padding:"0.5rem 0"},children:[
        (0,t.jsx)("p",{style:{margin:0,fontSize:"0.82rem",color:"#94a3b8"},children:"Laporan ini akan langsung diteruskan ke Pengawas Internal & Robinops Bareskrim Polri untuk penelaahan kedinasan."}),
        (0,t.jsx)(l.InputTextarea,{
          value:reportReason,
          onChange:e => setReportReason(e.target.value),
          placeholder:"Jelaskan indikasi pelanggaran (mis. pembocoran operasi rahasia, data sensitif, bahasa tidak pantas)...",
          rows:4,
          style:{width:"100%"}
        })
      ]})
    }),

    // PDF Preview modal
    (0,t.jsx)(O.default,{file:previewPdf,onHide:() => setPreviewPdf(null)}),

    // Modal: Tactical Profile Preview Dialog
    (0,t.jsx)(u.Dialog,{
      header:"Profil Personil CAS",
      visible:profileModalOpen,
      onHide:() => setProfileModalOpen(!1),
      style:{width:"36rem",maxWidth:"95vw"},
      modal:!0,
      dismissableMask:!0,
      children:loadingProfile && !previewUser?.name ? (
        (0,t.jsx)("div",{style:{padding:"3rem 1rem",textAlign:"center",color:"#94a3b8",fontSize:"0.85rem"},children:"Memuat profil personil…"})
      ) : previewUser ? (
        (0,t.jsxs)("div",{style:{display:"grid",gap:"1rem",padding:"0 0 0.5rem 0"},children:[
          // Mini Cover & Avatar Header
          (0,t.jsxs)("div",{style:{position:"relative",height:"105px",borderRadius:"10px",background:"linear-gradient(135deg, #090d16 0%, #0f172a 50%, #0369a1 100%)",overflow:"hidden",display:"flex",alignItems:"flex-end",padding:"0.75rem 1rem"},children:[
            (0,t.jsx)("div",{style:{position:"absolute",inset:0,opacity:0.25,backgroundImage:"radial-gradient(rgba(56,189,248,0.5) 1px, transparent 1px)",backgroundSize:"18px 18px",pointerEvents:"none"}}),
            (0,t.jsxs)("div",{style:{position:"absolute",bottom:"-25px",left:"1.25rem",display:"flex",alignItems:"flex-end",gap:"0.75rem"},children:[
              renderCornerAvatar(
                previewUser.photo_url || previewUser.foto,
                String(previewUser.name || 'P').charAt(0).toUpperCase(),
                getVerificationBadge(previewUser.role_bdb, String(previewUser.id) === '1' || previewUser.username === 'omeko11'),
                4.2,
                22,
                12
              )
            ]})
          ]}),

          // Identity Meta
          (0,t.jsxs)("div",{style:{marginTop:"1.8rem",padding:"0 0.5rem"},children:[
            (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem",flexWrap:"wrap"},children:[
              (0,t.jsx)("span",{style:{fontSize:"1.2rem",fontWeight:800,color:"var(--text-color, #0f172a)"},children:previewUser.name}),
              (0,t.jsx)("span",{style:{fontSize:"0.74rem",fontWeight:700,padding:"0.15rem 0.55rem",borderRadius:"999px",background:"rgba(34,197,94,0.15)",color:"#16a34a",border:"1px solid rgba(34,197,94,0.3)"},children:"● Online / Aktif"})
            ]}),
            (0,t.jsx)("div",{style:{fontSize:"0.84rem",color:"#0284c7",fontWeight:700,marginTop:"0.2rem"},children:formatCallsign(previewUser.callsign, previewUser.id, previewUser.username)}),
            (0,t.jsxs)("div",{style:{fontSize:"0.86rem",color:"var(--text-color, #334155)",marginTop:"0.25rem",fontWeight:600},children:[
              previewUser.pangkat && previewUser.pangkat !== '-' ? previewUser.pangkat + " • " : "",
              previewUser.jabatan || previewUser.role || "Penyidik Reserse Polri"
            ]}),
            (0,t.jsx)("div",{style:{fontSize:"0.78rem",color:"var(--text-color-secondary, #64748b)",marginTop:"0.15rem"},children:toTitleCase(previewUser.satker_nama || previewUser.satker || previewUser.satuan || "Badan Reserse Kriminal Polri")})
          ]}),

          // Details Grid (NRP, Status Kedinasan, Email Dinas, Bio)
          (0,t.jsxs)("div",{style:{display:"grid",gap:"0.6rem",padding:"0 0.5rem"},children:[
            (0,t.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.6rem"},children:[
              (0,t.jsxs)("div",{style:{background:"var(--surface-50, rgba(0,0,0,0.02))",padding:"0.6rem 0.75rem",borderRadius:"8px",border:"1px solid var(--surface-border, rgba(0,0,0,0.08))"},children:[
                (0,t.jsx)("div",{style:{fontSize:"0.68rem",color:"#94a3b8",fontWeight:700},children:"NRP / IDENTITAS"}),
                (0,t.jsx)("div",{style:{fontSize:"0.82rem",color:"var(--text-color, #0f172a)",fontWeight:700,marginTop:"0.15rem"},children:previewUser.nrp || "-"})
              ]}),
              (0,t.jsxs)("div",{style:{background:"var(--surface-50, rgba(0,0,0,0.02))",padding:"0.6rem 0.75rem",borderRadius:"8px",border:"1px solid var(--surface-border, rgba(0,0,0,0.08))"},children:[
                (0,t.jsx)("div",{style:{fontSize:"0.68rem",color:"#94a3b8",fontWeight:700},children:"STATUS KEDINASAN"}),
                (0,t.jsx)("div",{style:{fontSize:"0.82rem",color:"#4ade80",fontWeight:700,marginTop:"0.15rem"},children:"Polri Aktif"})
              ]})
            ]}),
            (0,t.jsxs)("div",{style:{background:"var(--surface-50, rgba(0,0,0,0.02))",padding:"0.6rem 0.75rem",borderRadius:"8px",border:"1px solid var(--surface-border, rgba(0,0,0,0.08))"},children:[
              (0,t.jsx)("div",{style:{fontSize:"0.68rem",color:"#94a3b8",fontWeight:700},children:"EMAIL DINAS POLRI"}),
              (0,t.jsx)("div",{style:{fontSize:"0.82rem",color:"var(--text-color, #0f172a)",fontWeight:600,marginTop:"0.15rem"},children:previewUser.email_polri || previewUser.email || "reskrim.ops@polri.go.id"})
            ]}),
            previewUser.bio && (0,t.jsxs)("div",{style:{background:"var(--surface-50, rgba(0,0,0,0.02))",padding:"0.6rem 0.75rem",borderRadius:"8px",border:"1px solid var(--surface-border, rgba(0,0,0,0.08))"},children:[
              (0,t.jsx)("div",{style:{fontSize:"0.68rem",color:"#94a3b8",fontWeight:700},children:"TENTANG PERSONIL"}),
              (0,t.jsx)("div",{style:{fontSize:"0.8rem",color:"#cbd5e1",marginTop:"0.2rem",lineHeight:1.45},children:previewUser.bio})
            ]})
          ]}),

          // Action Footer
          (0,t.jsxs)("div",{style:{display:"flex",gap:"0.5rem",justifyContent:"flex-end",padding:"0.5rem",borderTop:"1px solid rgba(255,255,255,0.08)",alignItems:"center"},children:[
            (0,t.jsx)("button",{
              type:"button",
              onClick:() => setProfileModalOpen(!1),
              style:{background:"transparent",color:"#94a3b8",border:"1px solid rgba(255,255,255,0.15)",borderRadius:"8px",padding:"0.45rem 1rem",fontSize:"0.8rem",fontWeight:700,cursor:"pointer"},
              children:"Tutup"
            }),
            (String(previewUser.id) === String(currentUser?.id || currentUser?.user_id) || previewUser.username === 'omeko11') ? (
              (0,t.jsx)("button",{
                type:"button",
                onClick:() => { window.location.href = '/cms/profile'; },
                style:{background:"#2563eb",color:"#fff",border:"none",borderRadius:"8px",padding:"0.45rem 1.15rem",fontSize:"0.8rem",fontWeight:700,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"0.35rem"},
                children:"👤 Buka Halaman Profil Saya"
              })
            ) : (
              (0,t.jsx)("button",{
                type:"button",
                onClick:() => {
                  setProfileModalOpen(!1);
                  toastRef.current?.show({severity:'info',summary:'Ruang Koordinasi',detail:'Jalur koordinasi taktis perkara dibuka dengan ' + previewUser.name});
                },
                style:{background:"#2563eb",color:"#fff",border:"none",borderRadius:"8px",padding:"0.45rem 1.15rem",fontSize:"0.8rem",fontWeight:700,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"0.35rem"},
                children:"💬 Kirim Pesan Taktis"
              })
            )
          ]})
        ]})
      ) : null
    })
  ]});
}])}]);
