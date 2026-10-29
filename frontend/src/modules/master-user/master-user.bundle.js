(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,72382,e=>{"use strict";let t=(0,e.i(56420).default)("eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);e.s(["Eye",0,t],72382)},45184,e=>{"use strict";var t=e.i(43476),n=e.i(68242);e.s(["ALL_ROWS_CLIENT",0,1e6,"ALL_ROWS_LAZY",0,1e3,"DEFAULT_PAGINATOR_LAYOUT",0,"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown","rowsPerPageTemplate",0,function(e,r=1e3){let a=[...e.map(e=>({label:String(e),value:e})),{label:"Semua",value:r}];return e=>(0,t.jsx)(n.Dropdown,{id:"fld-00l7wgk9jmf2--user-1",inputId:"fld-00l7wgk9jmf2--user-1-select",name:"field_00l7wgk9jmf2__user_1",value:e.value,options:a,onChange:e.onChange})}])},26091,e=>{"use strict";let t=(0,e.i(56420).default)("file-text",[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]);e.s(["FileText",0,t],26091)},89269,e=>{"use strict";var t=e.i(71645),n=e.i(48264),r=e.i(43456),a=e.i(29168),o=e.i(83128),l=e.i(40623),i=e.i(73193);function s(){return(s=Object.assign.bind()).apply(null,arguments)}function c(e){return(c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}var u=r.ComponentBase.extend({defaultProps:{__TYPE:"InputTextarea",__parentMetadata:null,autoResize:!1,invalid:!1,variant:null,keyfilter:null,onBlur:null,onFocus:null,onBeforeInput:null,onInput:null,onKeyDown:null,onKeyUp:null,onPaste:null,tooltip:null,tooltipOptions:null,validateOnly:!1,children:void 0,className:null},css:{classes:{root:function(e){var t=e.props,n=e.context,r=e.isFilled;return(0,i.classNames)("p-inputtextarea p-inputtext p-component",{"p-disabled":t.disabled,"p-filled":r,"p-inputtextarea-resizable":t.autoResize,"p-invalid":t.invalid,"p-variant-filled":t.variant?"filled"===t.variant:n&&"filled"===n.inputStyle})}},styles:"\n@layer primereact {\n    .p-inputtextarea-resizable {\n        overflow: hidden;\n        resize: none;\n    }\n    \n    .p-fluid .p-inputtextarea {\n        width: 100%;\n    }\n}\n"}});function p(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function d(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?p(Object(n),!0).forEach(function(t){!function(e,t,n){var r;(r=function(e,t){if("object"!=c(e)||!e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var r=n.call(e,t||"default");if("object"!=c(r))return r;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(t,"string"),(t="symbol"==c(r)?r:r+"")in e)?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n}(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):p(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}var f=t.memo(t.forwardRef(function(e,c){var p=(0,a.useMergeProps)(),f=t.useContext(n.PrimeReactContext),m=u.getProps(e,f),y=t.useRef(c),b=t.useRef(0),h=u.setMetaData(d(d({props:m},m.__parentMetadata),{},{context:{disabled:m.disabled}})),v=h.ptm,g=h.cx,O=h.isUnstyled;(0,r.useHandleStyle)(u.css.styles,O,{name:"inputtextarea"});var w=function(e){var t=y.current;t&&C()&&(b.current||(b.current=t.scrollHeight,t.style.overflow="hidden"),(b.current!==t.scrollHeight||e)&&(t.style.height="",t.style.height=t.scrollHeight+"px",parseFloat(t.style.height)>=parseFloat(t.style.maxHeight)?(t.style.overflowY="scroll",t.style.height=t.style.maxHeight):t.style.overflow="hidden",b.current=t.scrollHeight))},C=function(){if(i.DomHandler.isVisible(y.current)){var e=y.current.getBoundingClientRect();return e.width>0&&e.height>0}return!1};t.useEffect(function(){i.ObjectUtils.combinedRefs(y,c)},[y,c]),t.useEffect(function(){m.autoResize&&w(!0)},[m.autoResize,m.value]);var k=t.useMemo(function(){return i.ObjectUtils.isNotEmpty(m.value)||i.ObjectUtils.isNotEmpty(m.defaultValue)},[m.value,m.defaultValue]),j=i.ObjectUtils.isNotEmpty(m.tooltip),x=p({ref:y,className:(0,i.classNames)(m.className,g("root",{context:f,isFilled:k})),autoComplete:m.autoComplete,onFocus:function(e){m.autoResize&&w(),m.onFocus&&m.onFocus(e)},onBlur:function(e){m.autoResize&&w(),m.onBlur&&m.onBlur(e)},onKeyUp:function(e){m.autoResize&&w(),m.onKeyUp&&m.onKeyUp(e)},onKeyDown:function(e){m.onKeyDown&&m.onKeyDown(e),m.keyfilter&&o.KeyFilter.onKeyPress(e,m.keyfilter,m.validateOnly)},onBeforeInput:function(e){m.onBeforeInput&&m.onBeforeInput(e),m.keyfilter&&o.KeyFilter.onBeforeInput(e,m.keyfilter,m.validateOnly)},onInput:function(e){var t=e.target;m.autoResize&&w(i.ObjectUtils.isEmpty(t.value)),m.onInput&&m.onInput(e),i.ObjectUtils.isNotEmpty(t.value)?i.DomHandler.addClass(t,"p-filled"):i.DomHandler.removeClass(t,"p-filled")},onPaste:function(e){m.onPaste&&m.onPaste(e),m.keyfilter&&o.KeyFilter.onPaste(e,m.keyfilter,m.validateOnly)}},u.getOtherProps(m),v("root"));return t.createElement(t.Fragment,null,t.createElement("textarea",x),j&&t.createElement(l.Tooltip,s({target:y,content:m.tooltip,pt:v("tooltip")},m.tooltipOptions)))}));f.displayName="InputTextarea",e.s(["InputTextarea",0,f])},71326,97778,e=>{"use strict";var t=e.i(71645),n=e.i(48264),r=e.i(1743),a=e.i(43456),o=e.i(71144),l=e.i(29168),i=e.i(28797),s=e.i(27259),c=e.i(73193);function u(){return(u=Object.assign.bind()).apply(null,arguments)}function p(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function d(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"u">typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var r,a,o,l,i=[],s=!0,c=!1;try{if(o=(n=n.call(e)).next,0===t){if(Object(n)!==n)return;s=!1}else for(;!(s=(r=o.call(n)).done)&&(i.push(r.value),i.length!==t);s=!0);}catch(e){c=!0,a=e}finally{try{if(!s&&null!=n.return&&(l=n.return(),Object(l)!==l))return}finally{if(c)throw a}}return i}}(e,t)||function(e,t){if(e){if("string"==typeof e)return p(e,t);var n=({}).toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?p(e,t):void 0}}(e,t)||function(){throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function f(e){return(f="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}var m=a.ComponentBase.extend({defaultProps:{__TYPE:"ConfirmDialog",accept:null,acceptClassName:null,acceptIcon:null,acceptLabel:null,appendTo:null,breakpoints:null,children:void 0,className:null,content:null,defaultFocus:"accept",footer:null,icon:null,message:null,onHide:null,reject:null,rejectClassName:null,rejectIcon:null,rejectLabel:null,tagKey:void 0,visible:void 0},css:{classes:{root:"p-confirm-dialog",message:"p-confirm-dialog-message",icon:"p-confirm-dialog-icon",acceptButton:"p-confirm-dialog-accept",rejectButton:function(e){var t=e.getPropValue;return(0,c.classNames)("p-confirm-dialog-reject",{"p-button-text":!t("rejectClassName")})}}}});function y(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function b(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?y(Object(n),!0).forEach(function(t){!function(e,t,n){var r;(r=function(e,t){if("object"!=f(e)||!e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var r=n.call(e,t||"default");if("object"!=f(r))return r;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(t,"string"),(t="symbol"==f(r)?r:r+"")in e)?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n}(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):y(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}var h=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return(e=b(b({},e),{visible:void 0===e.visible||e.visible})).visible&&i.OverlayService.emit("confirm-dialog",e),{show:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};i.OverlayService.emit("confirm-dialog",b(b(b({},e),t),{visible:!0}))},hide:function(){i.OverlayService.emit("confirm-dialog",{visible:!1})}}},v=t.memo(t.forwardRef(function(e,p){var f,y,h,v,g,O,w,C=(0,l.useMergeProps)(),k=t.useContext(n.PrimeReactContext),j=m.getProps(e,k),x=d(t.useState(j.visible),2),P=x[0],S=x[1],E=d(t.useState(!1),2),N=E[0],I=E[1],M=t.useRef(null),R=t.useRef(!1),D=t.useRef(null),T=function(){var e=j.group;return M.current&&(e=M.current.group),Object.assign({},j,M.current,{group:e})},U=function(e){return T()[e]},_=function(e){for(var t=arguments.length,n=Array(t>1?t-1:0),r=1;r<t;r++)n[r-1]=arguments[r];return c.ObjectUtils.getPropValue(U(e),n)},A=U("acceptLabel")||(0,n.localeOption)("accept"),L=U("rejectLabel")||(0,n.localeOption)("reject"),H={props:j,state:{visible:P}},B=m.setMetaData(H),F=B.ptm,z=B.cx,V=B.isUnstyled;(0,a.useHandleStyle)(m.css.styles,V,{name:"confirmdialog"});var K=function(){R.current||(R.current=!0,_("accept"),q("accept"))},Z=function(){R.current||(R.current=!0,_("reject"),q("reject"))},Y=function(){T().group===j.group&&(S(!0),R.current=!1,D.current=document.activeElement)},q=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"cancel";P&&("string"!=typeof e&&(e="cancel"),S(!1),_("onHide",e),c.DomHandler.focus(D.current),D.current=null)},X=function(e){if(e.tagKey===j.tagKey&&(void 0===e.group||e.group===j.group)){var t=P!==e.visible;U("target")===e.target||j.target?t&&(M.current=e,e.visible?Y():q()):(q(),M.current=e,I(!0))}};t.useEffect(function(){j.visible?Y():q()},[j.visible]),t.useEffect(function(){return j.target||j.message||i.OverlayService.on("confirm-dialog",X),function(){i.OverlayService.off("confirm-dialog",X)}},[j.target]),(0,l.useUpdateEffect)(function(){N&&Y()},[N]),(0,l.useUnmountEffect)(function(){i.OverlayService.off("confirm-dialog",X)}),t.useImperativeHandle(p,function(){return{props:j,confirm:X}});var J=(f=T(),y=c.ObjectUtils.getJSXElement(U("message"),f),h=C({className:z("icon")},F("icon")),v=c.IconUtils.getJSXIcon(U("icon"),b({},h),{props:f}),g=function(){var e=U("defaultFocus"),n=(0,c.classNames)("p-confirm-dialog-accept",U("acceptClassName")),a=(0,c.classNames)("p-confirm-dialog-reject",{"p-button-text":!U("rejectClassName")},U("rejectClassName")),o=C({label:L,autoFocus:"reject"===e,icon:U("rejectIcon"),className:(0,c.classNames)(U("rejectClassName"),z("rejectButton",{getPropValue:U})),onClick:Z,pt:F("rejectButton"),unstyled:j.unstyled,__parentMetadata:{parent:H}},F("rejectButton")),l=C({label:A,autoFocus:void 0===e||"accept"===e,icon:U("acceptIcon"),className:(0,c.classNames)(U("acceptClassName"),z("acceptButton")),onClick:K,pt:F("acceptButton"),unstyled:j.unstyled,__parentMetadata:{parent:H}},F("acceptButton")),i=t.createElement(t.Fragment,null,t.createElement(r.Button,o),t.createElement(r.Button,l));if(U("footer")){var s={accept:K,reject:Z,acceptClassName:n,rejectClassName:a,acceptLabel:A,rejectLabel:L,element:i,props:T()};return c.ObjectUtils.getJSXElement(U("footer"),s)}return i}(),O=C({className:z("message")},F("message")),w=C({visible:P,className:(0,c.classNames)(U("className"),z("root")),footer:g,onHide:q,breakpoints:U("breakpoints"),pt:f.pt,unstyled:j.unstyled,appendTo:U("appendTo"),__parentMetadata:{parent:H}},m.getOtherProps(f)),t.createElement(o.Dialog,u({},w,{content:null==e?void 0:e.content}),v,t.createElement("span",O,y)));return t.createElement(s.Portal,{element:J,appendTo:U("appendTo")})}));v.displayName="ConfirmDialog",e.s(["ConfirmDialog",0,v,"confirmDialog",0,h],97778),e.s(["confirmAction",0,function(e,t){return new Promise(n=>{let r=!1,a=e=>{r||(r=!0,n(e))};h({message:e,header:t?.header||"Konfirmasi",icon:t?.danger?"pi pi-exclamation-triangle":"pi pi-question-circle",acceptLabel:t?.acceptLabel||"Ya, lanjutkan",rejectLabel:"Batal",acceptClassName:t?.danger?"p-button-danger":void 0,accept:()=>a(!0),reject:()=>a(!1),onHide:()=>a(!1)})})}],71326)},73474,e=>{"use strict";let t=(0,e.i(56420).default)("trash-2",[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]]);e.s(["Trash2",0,t],73474)},96315,e=>{"use strict";let t=(0,e.i(56420).default)("mail",[["path",{d:"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7",key:"132q7q"}],["rect",{x:"2",y:"4",width:"20",height:"16",rx:"2",key:"izxlao"}]]);e.s(["Mail",0,t],96315)},53138,e=>{"use strict";let t=(0,e.i(56420).default)("triangle-alert",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);e.s(["AlertTriangle",0,t],53138)},46387,e=>{"use strict";let t=(0,e.i(56420).default)("building-2",[["path",{d:"M10 12h4",key:"a56b0p"}],["path",{d:"M10 8h4",key:"1sr2af"}],["path",{d:"M14 21v-3a2 2 0 0 0-4 0v3",key:"1rgiei"}],["path",{d:"M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2",key:"secmi2"}],["path",{d:"M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16",key:"16ra0t"}]]);e.s(["Building2",0,t],46387)},21663,e=>{"use strict";var t=e.i(71645),n=e.i(48264),r=e.i(43456),a=e.i(29168),o=e.i(8630),l=e.i(40623),i=e.i(73193);function s(){return(s=Object.assign.bind()).apply(null,arguments)}function c(e){return(c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function u(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}var p=r.ComponentBase.extend({defaultProps:{__TYPE:"Checkbox",autoFocus:!1,checked:!1,className:null,disabled:!1,falseValue:!1,icon:null,id:null,inputId:null,inputRef:null,invalid:!1,variant:null,name:null,onChange:null,onContextMenu:null,onMouseDown:null,readOnly:!1,required:!1,style:null,tabIndex:null,tooltip:null,tooltipOptions:null,trueValue:!0,value:null,children:void 0},css:{classes:{box:"p-checkbox-box",input:"p-checkbox-input",icon:"p-checkbox-icon",root:function(e){var t=e.props,n=e.checked,r=e.context;return(0,i.classNames)("p-checkbox p-component",{"p-highlight":n,"p-disabled":t.disabled,"p-invalid":t.invalid,"p-variant-filled":t.variant?"filled"===t.variant:r&&"filled"===r.inputStyle})}}}});function d(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function f(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?d(Object(n),!0).forEach(function(t){!function(e,t,n){var r;(r=function(e,t){if("object"!=c(e)||!e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var r=n.call(e,t||"default");if("object"!=c(r))return r;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(t,"string"),(t="symbol"==c(r)?r:r+"")in e)?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n}(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):d(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}var m=t.memo(t.forwardRef(function(e,c){var d,m,y,b,h,v,g,O=(0,a.useMergeProps)(),w=t.useContext(n.PrimeReactContext),C=p.getProps(e,w),k=function(e){if(Array.isArray(e))return e}(d=t.useState(!1))||function(e){var t=null==e?null:"u">typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=t){var n,r,a,o,l=[],i=!0,s=!1;try{a=(t=t.call(e)).next,!1;for(;!(i=(n=a.call(t)).done)&&(l.push(n.value),2!==l.length);i=!0);}catch(e){s=!0,r=e}finally{try{if(!i&&null!=t.return&&(o=t.return(),Object(o)!==o))return}finally{if(s)throw r}}return l}}(d)||function(e){if(e){if("string"==typeof e)return u(e,2);var t=({}).toString.call(e).slice(8,-1);return"Object"===t&&e.constructor&&(t=e.constructor.name),"Map"===t||"Set"===t?Array.from(e):"Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?u(e,2):void 0}}(d)||function(){throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}(),j=k[0],x=k[1],P=p.setMetaData({props:C,state:{focused:j},context:{checked:C.checked===C.trueValue,disabled:C.disabled}}),S=P.ptm,E=P.cx,N=P.isUnstyled;(0,r.useHandleStyle)(p.css.styles,N,{name:"checkbox"});var I=t.useRef(null),M=t.useRef(C.inputRef),R=function(){return C.checked===C.trueValue},D=function(e){if(!C.disabled&&!C.readOnly&&C.onChange){var t,n=R()?C.falseValue:C.trueValue,r={originalEvent:e,value:C.value,checked:n,stopPropagation:function(){null==e||e.stopPropagation()},preventDefault:function(){null==e||e.preventDefault()},target:{type:"checkbox",name:C.name,id:C.id,value:C.value,checked:n}};null==C||null==(t=C.onChange)||t.call(C,r),e.defaultPrevented||i.DomHandler.focus(M.current)}},T=function(e){var t;x(!0),null==C||null==(t=C.onFocus)||t.call(C,e)},U=function(e){var t;x(!1),null==C||null==(t=C.onBlur)||t.call(C,e)};t.useImperativeHandle(c,function(){return{props:C,focus:function(){return i.DomHandler.focus(M.current)},getElement:function(){return I.current},getInput:function(){return M.current}}}),t.useEffect(function(){i.ObjectUtils.combinedRefs(M,C.inputRef)},[M,C.inputRef]),(0,a.useUpdateEffect)(function(){M.current.checked=R()},[C.checked,C.trueValue]),(0,a.useMountEffect)(function(){C.autoFocus&&i.DomHandler.focus(M.current,C.autoFocus)});var _=R(),A=i.ObjectUtils.isNotEmpty(C.tooltip),L=p.getOtherProps(C),H=O({id:C.id,className:(0,i.classNames)(C.className,E("root",{checked:_,context:w})),style:C.style,"data-p-highlight":_,"data-p-disabled":C.disabled,onContextMenu:C.onContextMenu,onMouseDown:C.onMouseDown},L,S("root"));return t.createElement(t.Fragment,null,t.createElement("div",s({ref:I},H),(m=i.ObjectUtils.reduceKeys(L,i.DomHandler.ARIA_PROPS),y=O(f({id:C.inputId,type:"checkbox",className:E("input"),name:C.name,tabIndex:C.tabIndex,onFocus:function(e){return T(e)},onBlur:function(e){return U(e)},onChange:function(e){return D(e)},disabled:C.disabled,readOnly:C.readOnly,required:C.required,"aria-invalid":C.invalid,checked:_},m),S("input")),t.createElement("input",s({ref:M},y))),(b=O({className:E("icon")},S("icon")),h=O({className:E("box",{checked:_}),"data-p-highlight":_,"data-p-disabled":C.disabled},S("box")),v=_?C.icon||t.createElement(o.CheckIcon,b):null,g=i.IconUtils.getJSXIcon(v,f({},b),{props:C,checked:_}),t.createElement("div",h,g))),A&&t.createElement(l.Tooltip,s({target:I,content:C.tooltip,pt:S("tooltip")},C.tooltipOptions)))}));m.displayName="Checkbox",e.s(["Checkbox",0,m])},73342,e=>{"use strict";var t=e.i(71645),n=e.i(48264),r=e.i(43456),a=e.i(83438),o=e.i(29168),l=e.i(73193),i=e.i(44506);function s(){return(s=Object.assign.bind()).apply(null,arguments)}var c=t.memo(t.forwardRef(function(e,n){var r=i.IconBase.getPTI(e);return t.createElement("svg",s({ref:n,width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",xmlns:"http://www.w3.org/2000/svg"},r),t.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M0.0535499 7.25213C0.208567 7.59162 2.40413 12.4 7 12.4C11.5959 12.4 13.7914 7.59162 13.9465 7.25213C13.9487 7.2471 13.9506 7.24304 13.952 7.24001C13.9837 7.16396 14 7.08239 14 7.00001C14 6.91762 13.9837 6.83605 13.952 6.76001C13.9506 6.75697 13.9487 6.75292 13.9465 6.74788C13.7914 6.4084 11.5959 1.60001 7 1.60001C2.40413 1.60001 0.208567 6.40839 0.0535499 6.74788C0.0512519 6.75292 0.0494023 6.75697 0.048 6.76001C0.0163137 6.83605 0 6.91762 0 7.00001C0 7.08239 0.0163137 7.16396 0.048 7.24001C0.0494023 7.24304 0.0512519 7.2471 0.0535499 7.25213ZM7 11.2C3.664 11.2 1.736 7.92001 1.264 7.00001C1.736 6.08001 3.664 2.80001 7 2.80001C10.336 2.80001 12.264 6.08001 12.736 7.00001C12.264 7.92001 10.336 11.2 7 11.2ZM5.55551 9.16182C5.98308 9.44751 6.48576 9.6 7 9.6C7.68891 9.59789 8.349 9.32328 8.83614 8.83614C9.32328 8.349 9.59789 7.68891 9.59999 7C9.59999 6.48576 9.44751 5.98308 9.16182 5.55551C8.87612 5.12794 8.47006 4.7947 7.99497 4.59791C7.51988 4.40112 6.99711 4.34963 6.49276 4.44995C5.98841 4.55027 5.52513 4.7979 5.16152 5.16152C4.7979 5.52513 4.55027 5.98841 4.44995 6.49276C4.34963 6.99711 4.40112 7.51988 4.59791 7.99497C4.7947 8.47006 5.12794 8.87612 5.55551 9.16182ZM6.2222 5.83594C6.45243 5.6821 6.7231 5.6 7 5.6C7.37065 5.6021 7.72553 5.75027 7.98762 6.01237C8.24972 6.27446 8.39789 6.62934 8.4 7C8.4 7.27689 8.31789 7.54756 8.16405 7.77779C8.01022 8.00802 7.79157 8.18746 7.53575 8.29343C7.27994 8.39939 6.99844 8.42711 6.72687 8.37309C6.4553 8.31908 6.20584 8.18574 6.01005 7.98994C5.81425 7.79415 5.68091 7.54469 5.6269 7.27312C5.57288 7.00155 5.6006 6.72006 5.70656 6.46424C5.81253 6.20842 5.99197 5.98977 6.2222 5.83594Z",fill:"currentColor"}))}));function u(){return(u=Object.assign.bind()).apply(null,arguments)}c.displayName="EyeIcon";var p=t.memo(t.forwardRef(function(e,n){var r=i.IconBase.getPTI(e);return t.createElement("svg",u({ref:n,width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",xmlns:"http://www.w3.org/2000/svg"},r),t.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M13.9414 6.74792C13.9437 6.75295 13.9455 6.757 13.9469 6.76003C13.982 6.8394 14.0001 6.9252 14.0001 7.01195C14.0001 7.0987 13.982 7.1845 13.9469 7.26386C13.6004 8.00059 13.1711 8.69549 12.6674 9.33515C12.6115 9.4071 12.54 9.46538 12.4582 9.50556C12.3765 9.54574 12.2866 9.56678 12.1955 9.56707C12.0834 9.56671 11.9737 9.53496 11.8788 9.47541C11.7838 9.41586 11.7074 9.3309 11.6583 9.23015C11.6092 9.12941 11.5893 9.01691 11.6008 8.90543C11.6124 8.79394 11.6549 8.68793 11.7237 8.5994C12.1065 8.09726 12.4437 7.56199 12.7313 6.99995C12.2595 6.08027 10.3402 2.8014 6.99732 2.8014C6.63723 2.80218 6.27816 2.83969 5.92569 2.91336C5.77666 2.93304 5.62568 2.89606 5.50263 2.80972C5.37958 2.72337 5.29344 2.59398 5.26125 2.44714C5.22907 2.30031 5.2532 2.14674 5.32885 2.01685C5.40451 1.88696 5.52618 1.79021 5.66978 1.74576C6.10574 1.64961 6.55089 1.60134 6.99732 1.60181C11.5916 1.60181 13.7864 6.40856 13.9414 6.74792ZM2.20333 1.61685C2.35871 1.61411 2.5091 1.67179 2.6228 1.77774L12.2195 11.3744C12.3318 11.4869 12.3949 11.6393 12.3949 11.7983C12.3949 11.9572 12.3318 12.1097 12.2195 12.2221C12.107 12.3345 11.9546 12.3976 11.7956 12.3976C11.6367 12.3976 11.4842 12.3345 11.3718 12.2221L10.5081 11.3584C9.46549 12.0426 8.24432 12.4042 6.99729 12.3981C2.403 12.3981 0.208197 7.59135 0.0532336 7.25198C0.0509364 7.24694 0.0490875 7.2429 0.0476856 7.23986C0.0162332 7.16518 3.05176e-05 7.08497 3.05176e-05 7.00394C3.05176e-05 6.92291 0.0162332 6.8427 0.0476856 6.76802C0.631261 5.47831 1.46902 4.31959 2.51084 3.36119L1.77509 2.62545C1.66914 2.51175 1.61146 2.36136 1.61421 2.20597C1.61695 2.05059 1.6799 1.90233 1.78979 1.79244C1.89968 1.68254 2.04794 1.6196 2.20333 1.61685ZM7.45314 8.35147L5.68574 6.57609V6.5361C5.5872 6.78938 5.56498 7.06597 5.62183 7.33173C5.67868 7.59749 5.8121 7.84078 6.00563 8.03158C6.19567 8.21043 6.43052 8.33458 6.68533 8.39089C6.94014 8.44721 7.20543 8.43359 7.45314 8.35147ZM1.26327 6.99994C1.7351 7.91163 3.64645 11.1985 6.99729 11.1985C7.9267 11.2048 8.8408 10.9618 9.64438 10.4947L8.35682 9.20718C7.86027 9.51441 7.27449 9.64491 6.69448 9.57752C6.11446 9.51014 5.57421 9.24881 5.16131 8.83592C4.74842 8.42303 4.4871 7.88277 4.41971 7.30276C4.35232 6.72274 4.48282 6.13697 4.79005 5.64041L3.35855 4.2089C2.4954 5.00336 1.78523 5.94935 1.26327 6.99994Z",fill:"currentColor"}))}));p.displayName="EyeSlashIcon";var d=e.i(44080),f=e.i(28797),m=e.i(27259);function y(){return(y=Object.assign.bind()).apply(null,arguments)}function b(e){return(b="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function h(e,t,n){var r;return(r=function(e,t){if("object"!=b(e)||!e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var r=n.call(e,t||"default");if("object"!=b(r))return r;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(t,"string"),(t="symbol"==b(r)?r:r+"")in e)?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function v(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function g(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"u">typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var r,a,o,l,i=[],s=!0,c=!1;try{if(o=(n=n.call(e)).next,0===t){if(Object(n)!==n)return;s=!1}else for(;!(s=(r=o.call(n)).done)&&(i.push(r.value),i.length!==t);s=!0);}catch(e){c=!0,a=e}finally{try{if(!s&&null!=n.return&&(l=n.return(),Object(l)!==l))return}finally{if(c)throw a}}return i}}(e,t)||function(e,t){if(e){if("string"==typeof e)return v(e,t);var n=({}).toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?v(e,t):void 0}}(e,t)||function(){throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var O=r.ComponentBase.extend({defaultProps:{__TYPE:"IconField",__parentMetadata:null,children:void 0,className:null,iconPosition:"right"},css:{classes:{root:function(e){var t=e.props;return(0,l.classNames)("p-icon-field",{"p-icon-field-right":"right"===t.iconPosition,"p-icon-field-left":"left"===t.iconPosition})}}}});function w(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function C(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?w(Object(n),!0).forEach(function(t){h(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):w(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}var k=t.default.memo(t.default.forwardRef(function(e,r){var a=(0,t.useRef)(r),i=(0,o.useMergeProps)(),s=(0,t.useContext)(n.PrimeReactContext),c=O.getProps(e,s),u=O.setMetaData(C(C({props:c},c.__parentMetadata),{},{context:{iconPosition:c.iconPosition}})),p=u.ptm,d=u.cx,f=i({className:(0,l.classNames)(c.className,d("root",{iconPosition:c.iconPosition}))},O.getOtherProps(c),p("root"));return t.default.createElement("div",y({},f,{ref:a}),t.Children.map(c.children,function(e,n){return(0,t.cloneElement)(e,{iconPosition:c.iconPosition})}))}));k.displayName="IconField";var j=r.ComponentBase.extend({defaultProps:{__TYPE:"InputIcon",__parentMetadata:null,className:null,iconPosition:null},css:{classes:{root:"p-input-icon"}}});function x(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function P(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?x(Object(n),!0).forEach(function(t){h(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):x(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}var S=t.default.memo(t.default.forwardRef(function(e,r){var a=(0,t.useRef)(r),i=(0,o.useMergeProps)(),s=(0,t.useContext)(n.PrimeReactContext),c=j.getProps(e,s),u=j.setMetaData(P(P({props:c},c.__parentMetadata),{},{context:{iconPosition:c.iconPosition}})),p=u.ptm,d=u.cx,f=i({className:(0,l.classNames)(c.className,d("root"))},j.getOtherProps(c),p("root"));return t.default.createElement(t.default.Fragment,null,t.default.createElement("span",y({},f,{ref:a}),c.children))}));S.displayName="InputIcon";var E=r.ComponentBase.extend({defaultProps:{__TYPE:"Password",id:null,inputId:null,inputRef:null,promptLabel:null,weakLabel:null,mediumLabel:null,strongLabel:null,mediumRegex:"^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})",strongRegex:"^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})",feedback:!0,toggleMask:!1,appendTo:null,header:null,content:null,footer:null,showIcon:null,hideIcon:null,icon:null,tooltip:null,tooltipOptions:null,style:null,className:null,inputStyle:null,inputClassName:null,invalid:!1,variant:null,panelStyle:null,panelClassName:null,transitionOptions:null,tabIndex:null,value:void 0,onInput:null,onShow:null,onHide:null,children:void 0},css:{classes:{root:function(e){var t=e.props,n=e.isFilled,r=e.focusedState;return(0,l.classNames)("p-password p-component p-inputwrapper",{"p-inputwrapper-filled":n,"p-inputwrapper-focus":r,"p-input-icon-right":t.toggleMask})},input:function(e){var t=e.props;return(0,l.classNames)("p-password-input",t.inputClassName)},panel:function(e){var t=e.props,r=e.context;return(0,l.classNames)("p-password-panel p-component",t.panelClassName,{"p-input-filled":r&&"filled"===r.inputStyle||"filled"===n.default.inputStyle,"p-ripple-disabled":r&&!1===r.ripple||!1===n.default.ripple})},meter:"p-password-meter",meterLabel:function(e){var t=e.strength;return(0,l.classNames)("p-password-strength",t)},info:function(e){var t=e.strength;return(0,l.classNames)("p-password-info",t)},showIcon:"p-password-show-icon",hideIcon:"p-password-hide-icon",transition:"p-connected-overlay"},styles:"\n@layer primereact {\n    .p-password {\n        position: relative;\n        display: inline-flex;\n    }\n    \n    .p-password-panel {\n        position: absolute;\n        top: 0;\n        left: 0;\n    }\n    \n    .p-password .p-password-panel {\n        min-width: 100%;\n    }\n    \n    .p-password-meter {\n        height: 10px;\n    }\n    \n    .p-password-strength {\n        height: 100%;\n        width: 0%;\n        transition: width 1s ease-in-out;\n    }\n    \n    .p-fluid .p-password {\n        display: flex;\n    }\n    \n    .p-password-input::-ms-reveal,\n    .p-password-input::-ms-clear {\n        display: none;\n    }\n\n    .p-password .p-password-show-icon,\n    .p-password .p-password-hide-icon {\n        line-height: 1.5;\n        cursor: pointer;\n    }\n}\n"}});function N(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function I(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?N(Object(n),!0).forEach(function(t){h(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):N(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}var M=t.memo(t.forwardRef(function(e,i){var s,u,b,h,v,O,w,C,j,x,P,N,M=(0,o.useMergeProps)(),R=t.useContext(n.PrimeReactContext),D=E.getProps(e,R),T=D.promptLabel||(0,n.localeOption)("passwordPrompt"),U=D.weakLabel||(0,n.localeOption)("weak"),_=D.mediumLabel||(0,n.localeOption)("medium"),A=D.strongLabel||(0,n.localeOption)("strong"),L=g(t.useState(!1),2),H=L[0],B=L[1],F=g(t.useState(null),2),z=F[0],V=F[1],K=g(t.useState(T),2),Z=K[0],Y=K[1],q=g(t.useState(!1),2),X=q[0],J=q[1],$=g(t.useState(!1),2),W=$[0],G=$[1],Q=t.useRef(null),ee=t.useRef(null),et=t.useRef(D.inputRef),en=t.useRef(new RegExp(D.mediumRegex)),er=t.useRef(new RegExp(D.strongRegex)),ea=W?"text":"password",eo={props:D,state:{overlayVisible:H,meter:z,infoText:Z,focused:X,unmasked:W}},el=E.setMetaData(eo),ei=el.ptm,es=el.cx,ec=el.isUnstyled;(0,r.useHandleStyle)(E.css.styles,ec,{name:"password"});var eu=(0,o.useDisplayOrder)("password",H);(0,o.useGlobalOnEscapeKey)({callback:function(){eO()},when:H&&D.feedback&&eu,priority:[o.ESC_KEY_HANDLING_PRIORITIES.PASSWORD,eu]});var ep=g((0,o.useOverlayListener)({target:Q,overlay:ee,listener:function(e,t){var n=t.valid,r=t.type;n&&("outside"===r||R.hideOverlaysOnDocumentScrolling?eO():l.DomHandler.isDocument(e.target)||ew())},when:H}),2),ed=ep[0],ef=ep[1],em=et.current&&et.current.value,ey=t.useMemo(function(){return l.ObjectUtils.isNotEmpty(D.value)||l.ObjectUtils.isNotEmpty(D.defaultValue)||l.ObjectUtils.isNotEmpty(em)},[D.value,D.defaultValue,em]),eb=function(){if(z){var e=null;switch(z.strength){case"weak":e=U;break;case"medium":e=_;break;case"strong":e=A}e&&Z!==e&&Y(e)}else Z!==T&&Y(T)},eh=function(e){if(!D.feedback)return!1;var t=null,n=null;switch(eC(e)){case 1:t=U,n={strength:"weak",width:"33.33%"};break;case 2:t=_,n={strength:"medium",width:"66.66%"};break;case 3:t=A,n={strength:"strong",width:"100%"};break;default:t=T,n=null}return V(n),Y(t),!0},ev=function(){G(function(e){return!e})},eg=function(){eb(),B(!0)},eO=function(){B(!1)},ew=function(){et.current&&l.DomHandler.alignOverlay(ee.current,et.current.parentElement,D.appendTo||R&&R.appendTo||n.default.appendTo)},eC=function(e){return e&&0!==e.length?er.current.test(e)?3:en.current.test(e)?2:1*!!(e.length>0):0};t.useImperativeHandle(i,function(){return{props:D,toggleMask:ev,focus:function(){return l.DomHandler.focus(et.current)},getElement:function(){return Q.current},getOverlay:function(){return ee.current},getInput:function(){return et.current}}}),t.useEffect(function(){l.ObjectUtils.combinedRefs(et,D.inputRef)},[et,D.inputRef]),t.useEffect(function(){en.current=new RegExp(D.mediumRegex)},[D.mediumRegex]),t.useEffect(function(){er.current=new RegExp(D.strongRegex)},[D.strongRegex]),t.useEffect(function(){!ey&&l.DomHandler.hasClass(Q.current,"p-inputwrapper-filled")&&l.DomHandler.removeClass(Q.current,"p-inputwrapper-filled")},[ey]),(0,o.useUpdateEffect)(function(){eh(D.value)},[D.value]),(0,o.useMountEffect)(function(){ew()}),(0,o.useUnmountEffect)(function(){l.ZIndexUtils.clear(ee.current)});var ek=function(e){("Enter"===e.key||"Space"===e.code)&&(ev(),e.preventDefault())},ej=(0,l.classNames)("p-password p-component p-inputwrapper",{"p-inputwrapper-filled":ey,"p-inputwrapper-focus":X,"p-input-icon-right":D.toggleMask},D.className),ex=E.getOtherProps(D),eP=function(){if(!D.toggleMask)return null;var e,r=M({role:"switch",tabIndex:D.tabIndex||"0",className:es("hideIcon"),onClick:ev,onKeyDown:ek,"aria-label":(0,n.ariaLabel)("passwordHide")||"Hide Password","aria-checked":"false"},ei("hideIcon")),a=M({role:"switch",tabIndex:D.tabIndex||"0",className:es("showIcon"),onClick:ev,onKeyDown:ek,"aria-label":(0,n.ariaLabel)("passwordShow")||"Show Password","aria-checked":"true"},ei("showIcon"));e=W?D.hideIcon||t.createElement(p,r):D.showIcon||t.createElement(c,a);var o=l.IconUtils.getJSXIcon(e,W?I({},r):I({},a),{props:D});if(D.icon){var i={onClick:ev,className:ej,element:o,props:D};o=l.ObjectUtils.getJSXElement(D.icon,i)}return o}(),eS=(u=(s=z||{strength:"",width:"0%"}).strength,b=s.width,h=l.ObjectUtils.getJSXElement(D.header,D),v=l.ObjectUtils.getJSXElement(D.footer,D),O=M({className:es("panel",{context:R}),style:D.panelStyle,onClick:function(e){D.feedback&&f.OverlayService.emit("overlay-click",{originalEvent:e,target:Q.current})}},ei("panel")),w=M({className:es("meter")},ei("meter")),C=M({className:es("meterLabel",{strength:u}),style:{width:b}},ei("meterLabel")),j=M({className:es("info",{strength:u})},ei("info")),x=D.content?l.ObjectUtils.getJSXElement(D.content,D):t.createElement(t.Fragment,null,t.createElement("div",w,t.createElement("div",C)),t.createElement("div",j,Z)),P=M({classNames:es("transition"),in:H,timeout:{enter:120,exit:100},options:D.transitionOptions,unmountOnExit:!0,onEnter:function(){l.ZIndexUtils.set("overlay",ee.current,R&&R.autoZIndex||n.default.autoZIndex,R&&R.zIndex.overlay||n.default.zIndex.overlay),l.DomHandler.addStyles(ee.current,{position:"absolute",top:"0",left:"0"}),ew()},onEntered:function(){ed(),D.onShow&&D.onShow()},onExit:function(){ef()},onExited:function(){l.ZIndexUtils.clear(ee.current),D.onHide&&D.onHide()}},ei("transition")),N=t.createElement(a.CSSTransition,y({nodeRef:ee},P),t.createElement("div",y({ref:ee},O),h,x,v)),t.createElement(m.Portal,{element:N,appendTo:D.appendTo})),eE=M({ref:Q,id:D.id,className:(0,l.classNames)(D.className,es("root",{isFilled:ey,focusedState:X})),style:D.style},ei("root")),eN=M(I(I({ref:et,id:D.inputId,autoComplete:D.autoComplete},ex),{},{className:(0,l.classNames)(D.inputClassName,es("input")),onBlur:function(e){J(!1),D.feedback&&eO(),D.onBlur&&D.onBlur(e)},onFocus:function(e){J(!0),D.feedback&&eg(),D.onFocus&&D.onFocus(e)},onInput:function(e,t){D.onInput&&D.onInput(e,t),D.onChange||(l.ObjectUtils.isNotEmpty(e.target.value)?l.DomHandler.addClass(Q.current,"p-inputwrapper-filled"):l.DomHandler.removeClass(Q.current,"p-inputwrapper-filled"))},onKeyUp:function(e){var t=e.code;D.feedback&&t&&"Escape"!==t&&!H&&eg(),D.onKeyUp&&D.onKeyUp(e)},invalid:D.invalid,variant:D.variant,style:D.inputStyle,unstyled:D.unstyled,tabIndex:D.tabIndex||"0",tooltip:D.tooltip,tooltipOptions:D.tooltipOptions,type:ea,value:D.value,__parentMetadata:{parent:eo}}),ei("input")),eI=t.createElement(d.InputText,eN);return eP&&(eI=t.createElement(k,{className:es("iconField"),pt:ei("iconField"),__parentMetadata:{parent:eo}},eI,t.createElement(S,{className:es("inputIcon"),pt:ei("inputIcon"),__parentMetadata:{parent:eo}},eP))),t.createElement("div",eE,eI,eS)}));M.displayName="Password",e.s(["Password",0,M],73342)},74544,e=>{"use strict";let t=(0,e.i(56420).default)("clock",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 6v6l4 2",key:"mmk7yg"}]]);e.s(["Clock",0,t],74544)},67927,e=>{"use strict";let t=(0,e.i(56420).default)("chevron-right",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);e.s(["ChevronRight",0,t],67927)},59008,e=>{"use strict";var t=e.i(43476),n=e.i(71645),r=e.i(68242),a=e.i(67927),o=e.i(54858);let l=["Mabes / Polda","Polres / Direktorat","Polsek / Satuan","Sub-unit","Sub-unit","Sub-unit","Sub-unit"];e.s(["default",0,function({initialId:e,onSelect:i,disabled:s}){let[c,u]=(0,n.useState)(null),[p,d]=(0,n.useState)([]),[f,m]=(0,n.useState)([]),[vLoading,setVLoading]=(0,n.useState)(!!e),y=(0,n.useRef)(i);y.current=i;let b=(0,n.useCallback)(async e=>{let t=await o.apiAuth.get("/bdb/satker/children",{params:{parentId:e}});return t.data?.data||[]},[]);async function h(e,t){let n=f.slice(0,e),r=p.slice(0,e+1);t&&(n[e]=t,t.has_children&&(r[e+1]=await b(t.id))),m(n),d(r),y.current(n.length?n[n.length-1]:null)}return(0,n.useEffect)(()=>{let isAlive=!0;(async()=>{try{if(e)setVLoading(!0);let n=await o.apiAuth.get("/bdb/satker/roots"),r=(n.data?.data||[])[0]||null;if(!isAlive||(u(r),!r))return;let a=await b(r.id);if(!isAlive)return;if(e){let n=await o.apiAuth.get("/bdb/satker/path",{params:{id:e}}),pathIds=(n.data?.data||[]).map(Number).slice(1),levelOptions=[a],chosen=[];for(let stepId of pathIds){let found=a.find(item=>Number(item.id)===stepId);if(!found)break;chosen.push(found),found.has_children?(a=await b(found.id),levelOptions.push(a)):a=[]}if(!isAlive)return;d(levelOptions),m(chosen),chosen.length&&y.current&&y.current(chosen[chosen.length-1])}else d([a]),m([])}catch(err){console.error("[SatkerPicker] Error resolving path:",err)}finally{isAlive&&setVLoading(!1)}})();return()=>{isAlive=!1}},[e]),(0,t.jsxs)("div",{children:[vLoading&&(0,t.jsx)("div",{style:{fontSize:"0.78rem",color:"#3b82f6",display:"flex",alignItems:"center",gap:"0.35rem",marginBottom:"0.3rem"},children:[(0,t.jsx)("i",{className:"pi pi-spin pi-spinner",style:{fontSize:"0.8rem"}}),"Memuat struktur satker melekat..."]}),(0,t.jsx)("div",{style:{display:"grid",gap:"0.4rem"},children:p.map((e,n)=>(0,t.jsx)(r.Dropdown,{id:"fld-user-satker-"+n,inputId:"fld-user-satker-"+n+"-select",name:"field_user_satker_"+n,value:f[n]?.id??null,onChange:t=>h(n,e.find(e=>e.id===t.value)||null),options:e,optionLabel:"deskripsi",optionValue:"id",filter:!0,showClear:!0,disabled:s||vLoading,placeholder:`— ${l[n]||"Sub-unit"} —`,emptyMessage:"Tidak ada sub-satker",style:{width:"100%"},itemTemplate:e=>(0,t.jsxs)("span",{style:{display:"inline-flex",alignItems:"baseline",gap:"0.5rem"},children:[(0,t.jsx)("span",{children:e.deskripsi}),(0,t.jsx)("span",{style:{fontSize:"0.7rem",color:"#94a3b8",fontFamily:"monospace"},children:e.kode})]})},n))}),(0,t.jsxs)("div",{style:{fontSize:"0.75rem",color:"#475569",marginTop:"0.4rem",display:"flex",alignItems:"center",gap:"0.25rem",flexWrap:"wrap"},children:[(0,t.jsx)("span",{style:{color:"#94a3b8"},children:"Satker:"}),(0,t.jsx)("strong",{children:"POLRI"}),f.map(e=>(0,t.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.25rem"},children:[(0,t.jsx)(a.ChevronRight,{size:12,style:{color:"#cbd5e1"}}),(0,t.jsx)("strong",{children:e.deskripsi})]},e.id))]})]})}])},16306,e=>{"use strict";let t=(0,e.i(56420).default)("shield-alert",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"M12 8v4",key:"1got3b"}],["path",{d:"M12 16h.01",key:"1drbdi"}]]);e.s(["ShieldAlert",0,t],16306)},62368,e=>{"use strict";let t=(0,e.i(56420).default)("download",[["path",{d:"M12 15V3",key:"m9g1x1"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["path",{d:"m7 10 5 5 5-5",key:"brsn70"}]]);e.s(["Download",0,t],62368)},51757,e=>{"use strict";let t=(0,e.i(56420).default)("circle-check",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);e.s(["CheckCircle2",0,t],51757)},83967,e=>{"use strict";let t=(0,e.i(56420).default)("circle-x",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]]);e.s(["XCircle",0,t],83967)},93819,e=>{"use strict";let t=(0,e.i(56420).default)("file-spreadsheet",[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M8 13h2",key:"yr2amv"}],["path",{d:"M14 13h2",key:"un5t4a"}],["path",{d:"M8 17h2",key:"2yhykz"}],["path",{d:"M14 17h2",key:"10kma7"}]]);e.s(["FileSpreadsheet",0,t],93819)},25981,e=>{"use strict";let t=(0,e.i(56420).default)("upload",[["path",{d:"M12 3v12",key:"1x0j5s"}],["path",{d:"m17 8-5-5-5 5",key:"7q97r8"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}]]);e.s(["Upload",0,t],25981)},6537,e=>{"use strict";let t=(0,e.i(56420).default)("lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]);e.s(["Lock",0,t],6537)},58925,e=>{"use strict";let t=(0,e.i(56420).default)("key-round",[["path",{d:"M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z",key:"1s6t7t"}],["circle",{cx:"16.5",cy:"7.5",r:".5",fill:"currentColor",key:"w0ekpg"}]]);e.s(["KeyRound",0,t],58925)},4384,2879,e=>{"use strict";var t=e.i(43476),n=e.i(44080),r=e.i(51757),a=e.i(53138);e.s(["default",0,function({value:e,onChange:o,onBlur:l,status:i,placeholder:s,id:c,name:u,autoComplete:m}){return(0,t.jsxs)("div",{style:{position:"relative"},children:[(0,t.jsx)(n.InputText,{id:c||("fld-avail-"+(n.InputText._k=(n.InputText._k||0)+1)),name:u||("field_avail_"+(n.InputText._k)),autoComplete:m||"off",value:e,onChange:e=>o(e.target.value),onBlur:e=>l(e.target.value),placeholder:s,className:"taken"===i?"p-invalid":void 0,style:{width:"100%",paddingRight:"2.2rem"}}),(0,t.jsxs)("span",{style:{position:"absolute",right:"0.6rem",top:"50%",transform:"translateY(-50%)",display:"flex",pointerEvents:"none"},children:["checking"===i&&(0,t.jsx)("i",{className:"pi pi-spin pi-spinner",style:{color:"#94a3b8",fontSize:"0.95rem"}}),"available"===i&&(0,t.jsx)(r.CheckCircle2,{size:16,style:{color:"#16a34a"}}),"taken"===i&&(0,t.jsx)(a.AlertTriangle,{size:16,style:{color:"#dc2626"}})]})]})}],4384);var o=e.i(71645),l=e.i(54858);e.s(["useAvailabilityCheck",0,function(e){let[t,n]=(0,o.useState)({}),[r,a]=(0,o.useState)({}),i=(0,o.useRef)({}),s=(0,o.useRef)({}),c=(0,o.useCallback)(e=>{i.current[e]&&clearTimeout(i.current[e]),n(t=>({...t,[e]:"idle"})),a(t=>({...t,[e]:void 0}))},[]),u=(0,o.useCallback)(()=>{Object.keys(i.current).forEach(e=>i.current[e]&&clearTimeout(i.current[e])),n({}),a({})},[]),p=(0,o.useCallback)(async(t,r)=>{let o=(s.current[t]||0)+1;s.current[t]=o,n(e=>({...e,[t]:"checking"}));try{let i=await l.apiAuth.get("/user/check-availability",{params:{field:t,value:r,exclude:e||void 0}});if(s.current[t]!==o)return;let c=i.data?.data;c?.available===!1?(n(e=>({...e,[t]:"taken"})),a(e=>({...e,[t]:"Sudah terdaftar / digunakan akun lain. Silakan gunakan yang lain."}))):(n(e=>({...e,[t]:"available"})),a(e=>({...e,[t]:void 0})))}catch{s.current[t]===o&&n(e=>({...e,[t]:"idle"}))}},[e]),d=(0,o.useCallback)((e,t)=>{(i.current[e]&&clearTimeout(i.current[e]),t.trim())?i.current[e]=setTimeout(()=>p(e,t),600):c(e)},[c,p]),f=(0,o.useCallback)((e,t)=>{(i.current[e]&&clearTimeout(i.current[e]),t.trim())?p(e,t):c(e)},[c,p]),m=Object.values(t).some(e=>"taken"===e);return{status:t,message:r,onChangeDebounced:d,onBlurNow:f,reset:c,resetAll:u,hasBlockingIssue:m}}],2879)},98769,e=>{"use strict";var a=e.i(43476),s=e.i(71645),r=e.i(17580),i=e.i(24718),t=e.i(53729),l=e.i(44080),n=e.i(89269),o=e.i(1743),d=e.i(71144),u=e.i(68242),m=e.i(73342),c=e.i(21663),p=e.i(85118),g=e.i(97778),b=e.i(48264),h=e.i(43456),f=e.i(29168),k=e.i(73193);function y(){return(y=Object.assign.bind()).apply(null,arguments)}function x(e){return(x="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}var j=h.ComponentBase.extend({defaultProps:{__TYPE:"ProgressBar",__parentMetadata:null,id:null,value:null,showValue:!0,unit:"%",style:null,className:null,mode:"determinate",displayValueTemplate:null,color:null,children:void 0},css:{classes:{root:function(e){return"indeterminate"===e.props.mode?(0,k.classNames)("p-progressbar p-component p-progressbar-indeterminate"):(0,k.classNames)("p-progressbar p-component p-progressbar-determinate")},value:"p-progressbar-value p-progressbar-value-animate",label:"p-progressbar-label",container:"p-progressbar-indeterminate-container"},styles:"\n@layer primereact {\n  .p-progressbar {\n      position: relative;\n      overflow: hidden;\n  }\n  \n  .p-progressbar-determinate .p-progressbar-value {\n      height: 100%;\n      width: 0%;\n      position: absolute;\n      display: none;\n      border: 0 none;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      overflow: hidden;\n  }\n  \n  .p-progressbar-determinate .p-progressbar-label {\n      display: inline-flex;\n  }\n  \n  .p-progressbar-determinate .p-progressbar-value-animate {\n      transition: width 1s ease-in-out;\n  }\n  \n  .p-progressbar-indeterminate .p-progressbar-value::before {\n        content: '';\n        position: absolute;\n        background-color: inherit;\n        top: 0;\n        left: 0;\n        bottom: 0;\n        will-change: left, right;\n        -webkit-animation: p-progressbar-indeterminate-anim 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;\n                animation: p-progressbar-indeterminate-anim 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;\n  }\n  \n  .p-progressbar-indeterminate .p-progressbar-value::after {\n      content: '';\n      position: absolute;\n      background-color: inherit;\n      top: 0;\n      left: 0;\n      bottom: 0;\n      will-change: left, right;\n      -webkit-animation: p-progressbar-indeterminate-anim-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;\n              animation: p-progressbar-indeterminate-anim-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;\n      -webkit-animation-delay: 1.15s;\n              animation-delay: 1.15s;\n  }\n}\n\n@-webkit-keyframes p-progressbar-indeterminate-anim {\n  0% {\n    left: -35%;\n    right: 100%; }\n  60% {\n    left: 100%;\n    right: -90%; }\n  100% {\n    left: 100%;\n    right: -90%; }\n}\n@keyframes p-progressbar-indeterminate-anim {\n  0% {\n    left: -35%;\n    right: 100%; }\n  60% {\n    left: 100%;\n    right: -90%; }\n  100% {\n    left: 100%;\n    right: -90%; }\n}\n\n@-webkit-keyframes p-progressbar-indeterminate-anim-short {\n  0% {\n    left: -200%;\n    right: 100%; }\n  60% {\n    left: 107%;\n    right: -8%; }\n  100% {\n    left: 107%;\n    right: -8%; }\n}\n@keyframes p-progressbar-indeterminate-anim-short {\n  0% {\n    left: -200%;\n    right: 100%; }\n  60% {\n    left: 107%;\n    right: -8%; }\n  100% {\n    left: 107%;\n    right: -8%; }\n}\n",inlineStyles:{value:function(e){var a=e.props,s=Math.max(a.value,2),r=a.value?a.color:"transparent";return"indeterminate"===a.mode?{backgroundColor:a.color}:{width:s+"%",display:"flex",backgroundColor:r}}}}});function v(e,a){var s=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);a&&(r=r.filter(function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable})),s.push.apply(s,r)}return s}var w=s.memo(s.forwardRef(function(e,a){var r,i,t,l,n,o,d,u=(0,f.useMergeProps)(),m=s.useContext(b.PrimeReactContext),c=j.getProps(e,m),p=j.setMetaData(function(e){for(var a=1;a<arguments.length;a++){var s=null!=arguments[a]?arguments[a]:{};a%2?v(Object(s),!0).forEach(function(a){!function(e,a,s){var r;(r=function(e,a){if("object"!=x(e)||!e)return e;var s=e[Symbol.toPrimitive];if(void 0!==s){var r=s.call(e,a||"default");if("object"!=x(r))return r;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===a?String:Number)(e)}(a,"string"),(a="symbol"==x(r)?r:r+"")in e)?Object.defineProperty(e,a,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[a]=s}(e,a,s[a])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(s)):v(Object(s)).forEach(function(a){Object.defineProperty(e,a,Object.getOwnPropertyDescriptor(s,a))})}return e}({props:c},c.__parentMetadata)),g=p.ptm,w=p.cx,_=p.isUnstyled;(0,h.useHandleStyle)(j.css.styles,_,{name:"progressbar"});var S=s.useRef(null);if(s.useImperativeHandle(a,function(){return{props:c,getElement:function(){return S.current}}}),"determinate"===c.mode)return r=c.showValue&&null!=c.value?c.displayValueTemplate?c.displayValueTemplate(c.value):c.value+c.unit:null,i=u({className:(0,k.classNames)(c.className,w("root")),style:c.style,role:"progressbar","aria-valuemin":"0","aria-valuenow":c.value,"aria-valuemax":"100"},j.getOtherProps(c),g("root")),t=u({className:w("value"),style:{width:c.value+"%",display:"flex",backgroundColor:c.color}},g("value")),l=u({className:w("label")},g("label")),s.createElement("div",y({id:c.id,ref:S},i),s.createElement("div",t,null!=r&&s.createElement("div",l,r)));if("indeterminate"===c.mode)return n=u({className:(0,k.classNames)(c.className,w("root")),style:c.style,role:"progressbar","aria-valuemin":"0","aria-valuenow":c.value,"aria-valuemax":"100"},j.getOtherProps(c),g("root")),o=u({className:w("container")},g("container")),d=u({className:w("value"),style:{backgroundColor:c.color}},g("value")),s.createElement("div",y({id:c.id,ref:S},n),s.createElement("div",o,s.createElement("div",d)));throw Error(c.mode+" is not a valid mode for the ProgressBar. Valid values are 'determinate' and 'indeterminate'")}));w.displayName="ProgressBar";var _=e.i(6537),S=e.i(72382),C=e.i(74544),P=e.i(46387),T=e.i(73474),A=e.i(16306),R=e.i(73670),B=e.i(25981),I=e.i(62368),z=e.i(93819),O=e.i(26091),E=e.i(51757),N=e.i(83967),D=e.i(58925),M=e.i(53138),$=e.i(96315),L=e.i(54858),U=e.i(45184),K=e.i(71326),F=e.i(59008),W=e.i(4384),G=e.i(2879),H=e.i(38036);function V(e){if(!e)return null;try{return new Date(e).toLocaleString("id-ID",{dateStyle:"medium",timeStyle:"short"})}catch{return String(e)}}function q(e){if(!e)return 0;let a=new Date(e).getTime()-Date.now();return a>0?Math.ceil(a/6e4):0}let Y={id:null,name:"",nrp:"",email:"",email_polri:"",username:"",role_bdb:"viewer",approval_status:"APPROVED",status:"AKTIF",scope_satker_id:null,scope_satker_key:"",scope_satker_name:"",local_password_enabled:!0,two_factor_required:!1,password:"",password_confirmation:""},X=[{label:"Superadmin",value:"superadmin"},{label:"Admin/Binops",value:"admin_binops"},{label:"Operator",value:"operator"},{label:"Viewer",value:"viewer"},{label:"Vendor / Mitra (Read-Only)",value:"vendor_mitra"}],J=[{label:"Aktif",value:"AKTIF"},{label:"Nonaktif",value:"NONAKTIF"}],Q={superadmin:"danger",admin_binops:"warning",operator:"info",viewer:void 0,vendor_mitra:"help"},Z="RESET SEMUA PASSWORD";function ee({label:e,hint:s,htmlFor:h,children:r}){let fId=h||(Array.isArray(r)?(r[0]?.props?.inputId||r[0]?.props?.id):(r?.props?.inputId||r?.props?.id));return(0,a.jsxs)("div",{children:[(0,a.jsxs)("label",{htmlFor:fId,style:{display:"block",marginBottom:"0.28rem",fontSize:"0.8rem",fontWeight:700,color:"#334155"},children:[e," ",s&&(0,a.jsxs)("span",{style:{color:"#94a3b8",fontWeight:400},children:["(",s,")"]})]}),r]})}function ea({label:e,value:s,tone:r}){return(0,a.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"11rem 1fr",gap:"0.5rem",borderBottom:"1px solid #f1f5f9",paddingBottom:"0.4rem"},children:[(0,a.jsx)("span",{style:{fontSize:"0.78rem",fontWeight:700,color:"#64748b"},children:e}),(0,a.jsx)("span",{style:{fontSize:"0.85rem",fontWeight:600,color:"ok"===r?"#16a34a":"bad"===r?"#dc2626":"#0f172a",wordBreak:"break-word"},children:s||"—"})]})}e.s(["default",0,function(){let e=(0,s.useRef)(null),userRequestSeq=(0,s.useRef)(0),[actUser,setActUser]=(0,s.useState)(null),[actLoading,setActLoading]=(0,s.useState)(!1),[actDetail,setActDetail]=(0,s.useState)(null),[mutUser,setMutUser]=(0,s.useState)(null),[mutData,setMutData]=(0,s.useState)({to_satker_id:null,to_satker_key:"",to_satker_name:"",to_role:"operator",nomor_surat:"",tanggal_efektif:new Date().toISOString().slice(0,10),keterangan:""}),[mutLoading,setMutLoading]=(0,s.useState)(!1),[mutHistory,setMutHistory]=(0,s.useState)([]),[mutHistoryLoading,setMutHistoryLoading]=(0,s.useState)(!1),[b,h]=(0,s.useState)([]),[f,k]=(0,s.useState)(!0),[y,x]=(0,s.useState)(""),[userSearchTerm,setUserSearchTerm]=(0,s.useState)(""),[userRoleFilter,setUserRoleFilter]=(0,s.useState)(""),[userFirst,setUserFirst]=(0,s.useState)(0),[userRows,setUserRows]=(0,s.useState)(10),[userTotal,setUserTotal]=(0,s.useState)(0),[userSortField,setUserSortField]=(0,s.useState)("id"),[userSortOrder,setUserSortOrder]=(0,s.useState)(1),[j,v]=(0,s.useState)(!1),[es,er]=(0,s.useState)(Y),[showSatkerModal,setShowSatkerModal]=(0,s.useState)(!1),[satkerModalTarget,setSatkerModalTarget]=(0,s.useState)("user"),[satkerLevelOptions,setSatkerLevelOptions]=(0,s.useState)([]),[satkerLevelSelected,setSatkerLevelSelected]=(0,s.useState)([]),[satkerLoading,setSatkerLoading]=(0,s.useState)(!1),[satkerFetchError,setSatkerFetchError]=(0,s.useState)(""),[satkerSearchTerm,setSatkerSearchTerm]=(0,s.useState)(""),[satkerSearchResults,setSatkerSearchResults]=(0,s.useState)([]),[satkerSearching,setSatkerSearching]=(0,s.useState)(!1),[ei,et]=(0,s.useState)(!1),el=(0,G.useAvailabilityCheck)(es.id),[en,eo]=(0,s.useState)(null),[ed,eu]=(0,s.useState)({isSuperadmin:!1,isOperator:!1}),[em,ec]=(0,s.useState)(null),[ep,eg]=(0,s.useState)({id:null,key:"",name:""}),[eb,eh]=(0,s.useState)(null),[ef,ek]=(0,s.useState)(""),[ey,ex]=(0,s.useState)(!1),[eDelType,eDelTypeSet]=(0,s.useState)("HAPUS"),[eDelReason,eDelReasonSet]=(0,s.useState)(""),[eConscious,eConsciousSet]=(0,s.useState)(!1),[ej,ev]=(0,s.useState)(null),[ew,e_]=(0,s.useState)(""),[eS,eC]=(0,s.useState)(!1),[eP,eT]=(0,s.useState)(!1),[eA,eR]=(0,s.useState)("upload"),[eB,eI]=(0,s.useState)(null),[ez,eO]=(0,s.useState)(!1),[eE,eN]=(0,s.useState)(!1),[eD,eM]=(0,s.useState)([]),[e$,eL]=(0,s.useState)(!1),[eU,eK]=(0,s.useState)([]),eF=(0,s.useRef)(null),[eW,eG]=(0,s.useState)(null),[eH,eV]=(0,s.useState)(!1),[eq,eY]=(0,s.useState)("loading"),[eX,eJ]=(0,s.useState)(0),[eQ,eZ]=(0,s.useState)(""),[e0,e1]=(0,s.useState)(!1),[e5,e8]=(0,s.useState)(null),[e2,e3]=(0,s.useState)([]),[e6,e4]=(0,s.useState)(!1),e7=(0,s.useRef)(null);(0,s.useEffect)(()=>{let e=(0,H.getUser)(),a="operator"===String(e?.role_bdb||"").toLowerCase();eu({isSuperadmin:(0,H.deriveRoles)(e).isSuperadmin,isOperator:a}),ec(e?.id??null),a&&eg({id:e?.scope_satker_id??null,key:e?.scope_satker_key||"",name:e?.scope_satker_name||""})},[]);let e9=null!==es.id,ae="superadmin"!==es.role_bdb&&"vendor_mitra"!==es.role_bdb,aa=(0,s.useCallback)(async()=>{let requestSeq=++userRequestSeq.current;k(!0);try{let a=(await L.apiAuth.get("/user",{params:{...(userSearchTerm?{searchAll:userSearchTerm}:{}),...(userRoleFilter?{roleFilter:userRoleFilter}:{}),row:userRows,page:Math.floor(userFirst/userRows)+1,sortBy:[userSortField],sort:[userSortOrder===1?"asc":"desc"],_ts:Date.now()}})).data,r=a?.data??a,i=r?.data??r,p=Array.isArray(i)?i:[];if(requestSeq!==userRequestSeq.current)return;h(p),setUserTotal(Number(r?.paginationInfo?.total_data??p.length)),0===p.length&&0===userFirst&&e.current?.show({severity:"info",summary:"Kosong",detail:"Server mengembalikan 0 pengguna."})}catch(s){if(requestSeq!==userRequestSeq.current)return;let a=s.response?s.response?.data?.message||`HTTP ${s.response?.status}`:`Tidak terhubung ke server: ${s.message||"network error"}`;e.current?.show({severity:"error",summary:"Gagal memuat",detail:a,life:8e3})}finally{requestSeq===userRequestSeq.current&&k(!1)}},[userFirst,userRows,userSortField,userSortOrder,userSearchTerm,userRoleFilter]);
async function openActivityDetail(user){
    setActUser(user);
    setActLoading(!0);
    setActDetail(null);
    try{
        let res=await L.apiAuth.get(`/user/${user.id}/activity-detail`);
        let data=res.data?.data||res.data;
        setActDetail(data);
    }catch(err){
        console.error("Gagal mengambil detail keaktifan:",err);
    }finally{
        setActLoading(!1);
    }
}
async function toggleUserStatus(targetUser){
    if(!targetUser||!targetUser.id)return;
    if(targetUser.id===em)return void e.current?.show({severity:"warn",summary:"Aksi Dibatasi",detail:"Anda tidak dapat mengubah status akun Anda sendiri."});
    let isAktif=(targetUser.status||"").toUpperCase()==="AKTIF";
    let nextStatus=isAktif?"NONAKTIF":"AKTIF";
    let actionLabel=isAktif?"Nonaktifkan":"Aktifkan";
    let confirmMsg=isAktif
        ?`Nonaktifkan akun pengguna "${targetUser.name}" (${targetUser.nrp||targetUser.email_polri||targetUser.email})? Pengguna tidak akan dapat login sampai diaktifkan kembali.`
        :`Aktifkan kembali akun pengguna "${targetUser.name}" (${targetUser.nrp||targetUser.email_polri||targetUser.email})?`;
    let ok=await (0,K.confirmAction)(confirmMsg,{
        header:`Konfirmasi ${actionLabel} Pengguna`,
        acceptLabel:`Ya, ${actionLabel}`,
        rejectLabel:"Batal",
        acceptClassName:isAktif?"p-button-danger":"p-button-success"
    });
    if(!ok)return;
    try{
        let res=await L.apiAuth.patch(`/user/${targetUser.id}`,{status:nextStatus});
        (0,L.assertOk)(res);
        e.current?.show({severity:"success",summary:"Berhasil",detail:`Status pengguna "${targetUser.name}" berhasil diubah menjadi ${nextStatus}.`});
        await aa();
    }catch(err){
        let msg=err.response?.data?.errors?.status?.[0]||err.response?.data?.message||"Gagal mengubah status pengguna.";
        e.current?.show({severity:"error",summary:"Gagal",detail:msg});
    }
}
function formatIndoDateStr(d) {
    if (!d) return "-";
    try {
        const dt = new Date(d);
        if (isNaN(dt.getTime())) return String(d);
        return dt.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    } catch(e) {
        return String(d);
    }
}
function formatIndoTimeStr(d) {
    if (!d) return "";
    try {
        const dt = new Date(d);
        if (isNaN(dt.getTime())) return "";
        return dt.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";
    } catch(e) {
        return "";
    }
}
function renderUserMiniCard(u) {
    if (!u) return null;
    const initial = (u.name || "?").trim().charAt(0).toUpperCase();
    const isAktif = (u.status || "").toUpperCase() === "AKTIF";
    const roleColor = Q[u.role_bdb] || "secondary";
    return (0,a.jsxs)("div", {
        style: {
            display: "flex",
            alignItems: "center",
            gap: "0.85rem",
            padding: "0.75rem 0.9rem",
            background: "var(--cas-bg-subtle, #f8fafc)",
            border: "1px solid var(--cas-border, #e2e8f0)",
            borderRadius: "10px"
        },
        children: [
            (0,a.jsxs)("div", {
                style: { position: "relative", flexShrink: 0 },
                children: [
                    u.photo_url ? (0,a.jsx)("img", {
                        src: u.photo_url,
                        alt: u.name,
                        style: { width: "46px", height: "46px", borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(255, 255, 255, 0.15)" }
                    }) : (0,a.jsx)("div", {
                        style: {
                            width: "46px",
                            height: "46px",
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)",
                            color: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            fontSize: "1.15rem",
                            boxShadow: "0 2px 8px rgba(2, 132, 199, 0.3)"
                        },
                        children: initial
                    }),
                    (0,a.jsx)("span", {
                        style: {
                            position: "absolute",
                            bottom: "0px",
                            right: "0px",
                            width: "12px",
                            height: "12px",
                            borderRadius: "50%",
                            background: isAktif ? "#16a34a" : "#dc2626",
                            border: "2px solid #0f172a"
                        },
                        title: isAktif ? "Status: AKTIF" : "Status: NONAKTIF"
                    })
                ]
            }),
            (0,a.jsxs)("div", {
                style: { display: "flex", flexDirection: "column", gap: "0.25rem", minWidth: 0, flex: 1 },
                children: [
                    (0,a.jsxs)("div", {
                        style: { display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" },
                        children: [
                            (0,a.jsx)("span", { style: { fontWeight: 700, fontSize: "0.95rem", color: "var(--cas-text, #f8fafc)" }, children: u.name }),
                            "vendor_mitra"===u.role_bdb?(0,a.jsx)(t.Tag, { value: "Vendor / Mitra (Read-Only)", severity: "help", style: { fontSize: "0.7rem", padding: "0.1rem 0.45rem", background: "linear-gradient(135deg, #7c3aed 0%, #0891b2 100%)", color: "#ffffff" } }):(0,a.jsx)(t.Tag, { value: u.role_bdb || "viewer", severity: roleColor, style: { fontSize: "0.7rem", padding: "0.1rem 0.45rem" } })
                        ]
                    }),
                    (0,a.jsxs)("div", {
                        style: { display: "flex", alignItems: "center", gap: "0.85rem", flexWrap: "wrap", fontSize: "0.76rem", color: "var(--cas-subtle, #94a3b8)" },
                        children: [
                            (0,a.jsxs)("span", { style: { display: "inline-flex", alignItems: "center", gap: "0.25rem" }, children: [(0,a.jsx)("i", { className: "pi pi-building", style: { fontSize: "0.72rem", color: "#38bdf8" } }), u.scope_satker_name || "Nasional"] }),
                            (u.nrp || u.username) ? (0,a.jsxs)("span", { style: { display: "inline-flex", alignItems: "center", gap: "0.25rem" }, children: [(0,a.jsx)("i", { className: "pi pi-id-card", style: { fontSize: "0.72rem", color: "#a855f7" } }), "NRP/ID: " + (u.nrp || u.username)] }) : null,
                            (0,a.jsxs)("span", { style: { display: "inline-flex", alignItems: "center", gap: "0.25rem" }, children: [(0,a.jsx)("i", { className: "pi pi-envelope", style: { fontSize: "0.72rem", color: "#f59e0b" } }), u.email_polri || u.email] })
                        ]
                    })
                ]
            })
        ]
    });
}
async function openMutateDialog(user){
    setMutUser(user);
    const rawReason = (user.deactivation_reason || "").trim();
    let effDate = new Date().toISOString().slice(0, 10);
    if (user.deactivated_at) {
        try {
            const dt = new Date(user.deactivated_at);
            if (!isNaN(dt.getTime())) effDate = dt.toISOString().slice(0, 10);
        } catch(e){}
    }
    const isOutOfRes = user.approval_status === "REQUEST_MUTASI_KELUAR" ||
        /keluar.*reserse|non.*reskrim|luar.*reskrim|sabhara|lantas|binmas|propam|polsek|samapta/i.test(rawReason);
    let sprin = "";
    const sprinMatch = rawReason.match(/(?:ST|Sprint|Sprin|SK|Kep|No.?|Nomor)[\s/:]*([A-Za-z0-9\/\.\-]+)/i);
    if (sprinMatch && sprinMatch[1]) {
        sprin = sprinMatch[0].trim();
    }
    let nonReserseName = "";
    if (isOutOfRes) {
        const destMatch = rawReason.match(/(?:ke|tujuan|di)\s+([A-Za-z0-9\s\.\/\(\)]+?)(?:\s*\(|;|\.|\$)/i);
        if (destMatch && destMatch[1]) {
            nonReserseName = destMatch[1].trim();
        }
    }
    setMutData({
        to_satker_id: user.requested_scope_satker_id ? Number(user.requested_scope_satker_id) : (user.scope_satker_id ? Number(user.scope_satker_id) : null),
        to_satker_key: user.requested_scope_satker_key || user.scope_satker_key || "",
        to_satker_name: user.scope_satker_name || "",
        to_role: user.requested_role_bdb || user.role_bdb || "operator",
        nomor_surat: sprin,
        tanggal_efektif: effDate,
        keterangan: rawReason,
        is_keluar_reserse: isOutOfRes,
        satker_non_reserse: nonReserseName
    });
    setMutHistory([]);
    setMutHistoryLoading(!0);
    try {
        let res = await L.apiAuth.get('/user/' + user.id + '/mutations');
        let list = res.data?.data || res.data || [];
        setMutHistory(Array.isArray(list) ? list : []);
        const pending = Array.isArray(list) ? list.find(m => m.status === 'PENDING') : null;
        if (pending) {
            setMutData(prev => ({
                ...prev,
                to_satker_id: pending.to_satker_id ? Number(pending.to_satker_id) : prev.to_satker_id,
                to_satker_key: pending.to_satker_key || prev.to_satker_key,
                to_satker_name: pending.to_satker_name || prev.to_satker_name,
                to_role: pending.to_role || prev.to_role,
                nomor_surat: pending.nomor_surat || prev.nomor_surat,
                tanggal_efektif: pending.tanggal_efektif ? new Date(pending.tanggal_efektif).toISOString().slice(0, 10) : prev.tanggal_efektif,
                keterangan: pending.keterangan || prev.keterangan,
                is_keluar_reserse: Boolean(pending.is_keluar_reserse),
                satker_non_reserse: pending.is_keluar_reserse ? (pending.to_satker_name || prev.satker_non_reserse) : prev.satker_non_reserse
            }));
        }
    } catch(err) {
        console.error("Gagal mengambil histori mutasi:", err);
    } finally {
        setMutHistoryLoading(!1);
    }
}
async function handleMutateSubmit(){
    if(!mutUser)return;
    if(mutData.is_keluar_reserse){
        if(!mutData.satker_non_reserse||!mutData.satker_non_reserse.trim()){
            return void e.current?.show({severity:"warn",summary:"Satker / Fungsi Wajib",detail:"Isi nama kesatuan kerja atau fungsi baru luar Reskrim."});
        }
    }else{
        if(!mutData.to_satker_id){
            return void e.current?.show({severity:"warn",summary:"Satker Wajib",detail:"Pilih Satker Tujuan mutasi penugasan."});
        }
    }
    if(!mutData.nomor_surat||!mutData.nomor_surat.trim()){
        return void e.current?.show({severity:"warn",summary:"Nomor Surat Wajib",detail:"Isi nomor surat telegram/keputusan mutasi."});
    }
    let destDesc=mutData.is_keluar_reserse?mutData.satker_non_reserse.trim():(mutData.to_satker_name||"Satker Baru");
    let confirmMsg=ed.isOperator
        ?`Kirimkan permohonan mutasi personil "${mutUser.name}" ke ${destDesc} ke Superadmin untuk diverifikasi dan disetujui?`
        :`Mutasikan personil "${mutUser.name}" ke ${destDesc} sesuai ${mutData.nomor_surat.trim()}? Histori LP lama personil tetap tersimpan utuh.`;
    if(await (0,K.confirmAction)(confirmMsg,{acceptLabel:ed.isOperator?"Ya, Kirim Permohonan":"Ya, Proses Mutasi"})){
        setMutLoading(!0);
        try{
            let payload={
                is_keluar_reserse:Boolean(mutData.is_keluar_reserse),
                satker_non_reserse:(mutData.satker_non_reserse||"").trim(),
                to_satker_id:mutData.is_keluar_reserse?null:Number(mutData.to_satker_id),
                to_satker_key:mutData.is_keluar_reserse?"":(mutData.to_satker_key||""),
                to_satker_name:destDesc,
                to_role:mutData.is_keluar_reserse?"nonaktif":(mutData.to_role||"operator"),
                nomor_surat:mutData.nomor_surat.trim(),
                tanggal_efektif:mutData.tanggal_efektif||new Date().toISOString().slice(0,10),
                keterangan:(mutData.keterangan||"").trim()
            };
            let res=await L.apiAuth.post(`/user/${mutUser.id}/mutate`,payload);
            (0,L.assertOk)(res);
            let msg=res.data?.message||(ed.isOperator?"Permohonan mutasi berhasil diajukan ke Superadmin.":`Personil ${mutUser.name} berhasil dimutasi ke ${destDesc}.`);
            e.current?.show({severity:"success",summary:ed.isOperator?"Permohonan Terkirim":"Mutasi Berhasil",detail:msg});
            setMutUser(null);
            await aa();
        }catch(err){
            e.current?.show({severity:"error",summary:"Gagal Mutasi",detail:err.response?.data?.message||"Gagal memproses mutasi.",life:8e3});
        }finally{
            setMutLoading(!1);
        }
    }
}
async function asOperatorRequest(){if(eb){if(!eDelReason.trim())return void e.current?.show({severity:"warn",summary:"Alasan Wajib",detail:"Tuliskan alasan pengajuan ke Superadmin."});if(await (0,K.confirmAction)(`Kirim pengajuan ${eDelType==="NONAKTIF"?"penonaktifan":"penghapusan"} akun "${eb.name}" ke Superadmin? Akun akan langsung dibekukan sementara.`,{danger:!0,acceptLabel:"Ya, Kirim Pengajuan"})){ex(!0);try{(0,L.assertOk)(await L.apiAuth.post(`/user/${eb.id}/request-deletion`,{type:eDelType,reason:eDelReason.trim()}));e.current?.show({severity:"success",summary:"Diajukan",detail:`Pengajuan akun "${eb.name}" terkirim ke Superadmin. Akun telah dibekukan sementara.`});eh(null);await aa()}catch(a){e.current?.show({severity:"error",summary:"Gagal mengajukan",detail:a.response?.data?.message||"Gagal mengirimkan pengajuan.",life:8e3})}finally{ex(!1)}}}}async function asSuperadminReview(action){if(eb){if(await (0,K.confirmAction)(`Proses permohonan ${action==="REJECT"?"penolakan":action==="APPROVE_DELETE"?"penghapusan permanen":"penonaktifan"} untuk akun "${eb.name}"?`,{danger:action!=="REJECT",acceptLabel:"Ya, Proses"})){ex(!0);try{(0,L.assertOk)(await L.apiAuth.post(`/user/${eb.id}/review-deletion`,{action}));e.current?.show({severity:"success",summary:"Berhasil",detail:`Permohonan untuk akun "${eb.name}" berhasil diproses.`});eh(null);await aa()}catch(a){e.current?.show({severity:"error",summary:"Gagal",detail:a.response?.data?.message||"Gagal memproses permohonan.",life:8e3})}finally{ex(!1)}}}}async function as(){if(eb){if(ef.trim().toLowerCase()!==(eb.email||"").trim().toLowerCase())return void e.current?.show({severity:"warn",summary:"Belum cocok",detail:"Ketik ulang email akun ini persis untuk konfirmasi."});if(await (0,K.confirmAction)(`Hapus PERMANEN akun "${eb.name}" (${eb.email})? Tidak bisa dibatalkan.`,{danger:!0,acceptLabel:"Ya, Hapus Permanen"})){ex(!0);try{(0,L.assertOk)(await L.apiAuth.delete(`/user/${eb.id}`)),e.current?.show({severity:"success",summary:"Dihapus",detail:`Akun "${eb.name}" dihapus permanen.`}),eh(null),await aa()}catch(a){e.current?.show({severity:"error",summary:"Gagal menghapus",detail:a.response?.data?.message||"Gagal menghapus akun.",life:8e3})}finally{ex(!1)}}}}function ar(e){return e.trim().split(/\s+/).filter(Boolean).length}async function ai(){if(ej){if(10>ar(ew))return void e.current?.show({severity:"warn",summary:"Belum cukup",detail:"Keterangan/alasan impersonate wajib diisi, minimal 10 kata."});if(await (0,K.confirmAction)(`Masuk sebagai "${ej.name}" (${ej.email})? Sesi Anda sebagai superadmin akan disimpan dan bisa dikembalikan kapan saja.`,{danger:!0,acceptLabel:"Ya, Masuk Sebagai User Ini"})){eC(!0);try{let e=(0,L.assertOk)(await L.apiAuth.post(`/Authentication/impersonate/${ej.id}`,{keterangan:ew}));await (0,H.startImpersonation)(e),ev(null),window.location.href="/cms/dashboard/main"}catch(a){e.current?.show({severity:"error",summary:"Gagal",detail:a.response?.data?.message||"Gagal impersonate.",life:8e3})}finally{eC(!1)}}}}function at(){eE||e$||eT(!1)}async function al(){eO(!0);try{let e=await L.apiAuth.get("/user/bulk-import/template",{responseType:"blob"}),a=URL.createObjectURL(e.data),s=document.createElement("a");s.href=a,s.download="template-import-pengguna.xlsx",s.click(),URL.revokeObjectURL(a)}catch{e.current?.show({severity:"error",summary:"Gagal",detail:"Gagal mengunduh template."})}finally{eO(!1)}}async function an(a){eN(!0);try{let e=new FormData;e.append("file",a);let s=await L.apiAuth.post("/user/bulk-import/preview",e,{headers:{"Content-Type":"multipart/form-data"}}),r=(0,L.assertOk)(s);eM(r.rows||[]),eR("review")}catch(a){e.current?.show({severity:"error",summary:"Gagal",detail:a.response?.data?.message||"Gagal memvalidasi file. Pastikan formatnya sesuai template.",life:8e3}),eI(null)}finally{eN(!1)}}function runUserSearch(){let term=y.trim();0===userFirst&&term===userSearchTerm?aa():(setUserFirst(0),setUserSearchTerm(term))}
(0,s.useEffect)(()=>{aa()},[aa]);let ao=eD.filter(e=>e.ok).length;async function ad(){let a=eD.filter(e=>e.ok);if(0!==a.length&&await (0,K.confirmAction)(`Import ${a.length} pengguna baru sekarang? Password acak akan dibuat otomatis untuk tiap akun dan hanya ditampilkan sekali.`,{acceptLabel:"Ya, Import Sekarang"})){eL(!0);try{let s=await L.apiAuth.post("/user/bulk-import/commit",{rows:a}),r=(0,L.assertOk)(s);eK(r.results||[]),eR("result");let i=(r.results||[]).filter(e=>e.ok).length;e.current?.show({severity:"success",summary:"Selesai",detail:`${i} akun berhasil dibuat.`}),await aa()}catch(a){e.current?.show({severity:"error",summary:"Gagal",detail:a.response?.data?.message||"Gagal mengimpor.",life:8e3})}finally{eL(!1)}}}async function au(a){let s=a.email_polri||a.email||"";if(await (0,K.confirmAction)(`Reset password akun "${a.name}" dan kirim password baru ke ${s||"email terdaftar"}? Password lama tidak berlaku lagi.`,{danger:!0,acceptLabel:"Ya, Reset & Kirim"})){eG(a.id);try{let s=(0,L.assertOk)(await L.apiAuth.post(`/user/${a.id}/reset-password-email`));e.current?.show({severity:"success",summary:"Terkirim",detail:`Password baru dikirim ke ${s.email}.`})}catch(a){e.current?.show({severity:"error",summary:"Gagal",detail:a.response?.data?.message||"Gagal reset & kirim email.",life:8e3})}finally{eG(null)}}}function am(){e7.current&&(clearInterval(e7.current),e7.current=null)}async function ac(e){try{let a=(0,L.assertOk)(await L.apiAuth.get(`/user/bulk-reset-password/status/${e}`));e8(a),"running"!==a.status&&(am(),eY("done"),ag(e))}catch{am()}}function ap(e){am(),e7.current=setInterval(()=>ac(e),4e3)}async function ag(e){e4(!0);try{let a=(0,L.assertOk)(await L.apiAuth.get(`/user/bulk-reset-password/status/${e}/items`,{params:{onlyFailed:"true",row:200}}));e3(a.data||[])}catch{}finally{e4(!1)}}async function ab(){eV(!0),eY("loading"),eZ(""),e3([]);try{let e=(0,L.assertOk)(await L.apiAuth.get("/user/bulk-reset-password/status/latest"));if(e&&"running"===e.status){e8(e),eY("progress"),ap(e.id);return}let a=(0,L.assertOk)(await L.apiAuth.get("/user/bulk-reset-password/preview"));eJ(a.total),eY("confirm")}catch(a){e.current?.show({severity:"error",summary:"Gagal",detail:a.response?.data?.message||"Gagal memuat status reset massal.",life:8e3}),eV(!1)}}function ah(){am(),eV(!1)}async function af(){if(eQ.trim()===Z&&await (0,K.confirmAction)(`Reset password ${eX} akun sekaligus dan kirim password baru ke email masing-masing? Password lama SEMUA akun itu langsung tidak berlaku. Tindakan ini tidak bisa dibatalkan.`,{danger:!0,acceptLabel:"Ya, Mulai Reset Massal"})){e1(!0);try{let e=(0,L.assertOk)(await L.apiAuth.post("/user/bulk-reset-password/start"));e8({id:e.jobId,status:"running",total:e.total,done:0,success:0,failed:0,started_at:new Date().toISOString()}),eY("progress"),ap(e.jobId)}catch(a){e.current?.show({severity:"error",summary:"Gagal",detail:a.response?.data?.message||"Gagal memulai reset massal.",life:8e3})}finally{e1(!1)}}}function ak(e,a){er(s=>({...s,[e]:a}))}
const fetchSatkerChildren=async(parentId)=>{
  try{
    let res=await L.apiAuth.get("/bdb/satker/children",{params:{parentId:String(parentId)}});
    return res.data?.data||[];
  }catch(err){
    console.error("fetchSatkerChildren err:",err);
    return[];
  }
};
const openSatkerPicker=async(target)=>{
  setSatkerModalTarget(target);
  setShowSatkerModal(!0);
  setSatkerLoading(!0);
  setSatkerFetchError("");
  setSatkerSearchTerm("");
  setSatkerSearchResults([]);
  setSatkerLevelOptions([]);
  setSatkerLevelSelected([]);
  try{
    let rootsRes=await L.apiAuth.get("/bdb/satker/roots");
    let rootItem=(rootsRes.data?.data||[])[0]||null;
    if(!rootItem){
      setSatkerFetchError("Gagal memuat data satker induk (root).");
      setSatkerLoading(!1);
      return;
    }
    let lvl0Children=await fetchSatkerChildren(rootItem.id);
    let curId=target==="user"?es.scope_satker_id:mutData.to_satker_id;
    if(curId){
      try{
        let pathRes=await L.apiAuth.get("/bdb/satker/path",{params:{id:curId}});
        let pathIds=(pathRes.data?.data||[]).map(Number).slice(1);
        let curOpts=[lvl0Children];
        let curSel=[];
        let running=lvl0Children;
        for(let stepId of pathIds){
          let match=running.find(c=>Number(c.id)===stepId);
          if(!match)break;
          curSel.push(match);
          if(match.has_children){
            running=await fetchSatkerChildren(match.id);
            if(running.length>0)curOpts.push(running);
          }else{
            running=[];
          }
        }
        setSatkerLevelOptions(curOpts.length?curOpts:[lvl0Children]);
        setSatkerLevelSelected(curSel);
      }catch{
        setSatkerLevelOptions([lvl0Children]);
        setSatkerLevelSelected([]);
      }
    }else{
      setSatkerLevelOptions([lvl0Children]);
      setSatkerLevelSelected([]);
    }
  }catch(err){
    setSatkerFetchError("Gagal memuat hierarki satker dari server.");
  }finally{
    setSatkerLoading(!1);
  }
};
const onSatkerLevelChange=async(lvlIdx,selectedId)=>{
  if(!selectedId){
    setSatkerLevelSelected(prev=>prev.slice(0,lvlIdx));
    setSatkerLevelOptions(prev=>prev.slice(0,lvlIdx+1));
    return;
  }
  let curOpts=satkerLevelOptions[lvlIdx]||[];
  let chosen=curOpts.find(item=>String(item.id)===String(selectedId))||null;
  if(!chosen)return;
  let nextSel=[...satkerLevelSelected.slice(0,lvlIdx),chosen];
  let nextOpts=[...satkerLevelOptions.slice(0,lvlIdx+1)];
  setSatkerLevelSelected(nextSel);
  if(chosen.has_children){
    setSatkerLoading(!0);
    let ch=await fetchSatkerChildren(chosen.id);
    setSatkerLoading(!1);
    if(ch.length>0)nextOpts.push(ch);
  }
  setSatkerLevelOptions(nextOpts);
};
const onSatkerQuickSearch=async(term)=>{
  setSatkerSearchTerm(term);
  if(!term||term.trim().length<2){
    setSatkerSearchResults([]);
    return;
  }
  setSatkerSearching(!0);
  try{
    let res=await L.apiAuth.get("/bdb/satker/search",{params:{q:term.trim(),limit:10}});
    setSatkerSearchResults(res.data?.data||[]);
  }catch(err){
    console.error("searchSatker err:",err);
  }finally{
    setSatkerSearching(!1);
  }
};
const onSelectSearchResult=async(satker)=>{
  setSatkerLoading(!0);
  try{
    let pathRes=await L.apiAuth.get("/bdb/satker/path",{params:{id:satker.id}});
    let pathIds=(pathRes.data?.data||[]).map(Number).slice(1);
    let rootsRes=await L.apiAuth.get("/bdb/satker/roots");
    let rootItem=(rootsRes.data?.data||[])[0]||null;
    let running=await fetchSatkerChildren(rootItem.id);
    let curOpts=[running];
    let curSel=[];
    for(let stepId of pathIds){
      let match=running.find(c=>Number(c.id)===stepId);
      if(!match)break;
      curSel.push(match);
      if(match.has_children){
        running=await fetchSatkerChildren(match.id);
        if(running.length>0)curOpts.push(running);
      }else{
        running=[];
      }
    }
    setSatkerLevelOptions(curOpts.length?curOpts:[running]);
    setSatkerLevelSelected(curSel.length?curSel:[satker]);
  }catch{
    setSatkerLevelSelected([satker]);
  }finally{
    setSatkerLoading(!1);
    setSatkerSearchTerm("");
    setSatkerSearchResults([]);
  }
};
const applySelectedSatker=()=>{
  if(satkerLevelSelected.length===0)return;
  let deepest=satkerLevelSelected[satkerLevelSelected.length-1];
  if(satkerModalTarget==="user"){
    er(prev=>({
      ...prev,
      scope_satker_id:Number(deepest.id),
      scope_satker_name:deepest.deskripsi||prev.scope_satker_name,
      scope_satker_key:deepest.kode||prev.scope_satker_key||""
    }));
  }else if(satkerModalTarget==="mutasi"){
    setMutData(prev=>({
      ...prev,
      to_satker_id:Number(deepest.id),
      to_satker_name:deepest.deskripsi||prev.to_satker_name,
      to_satker_key:deepest.kode||prev.to_satker_key||""
    }));
  }
  setShowSatkerModal(!1);
};async function ay(){let polriMail=(es.email_polri||"").trim().toLowerCase(),secMail=(es.email||"").trim().toLowerCase();let a=!es.name||!es.name.trim()?"Nama wajib diisi":!polriMail?"Email dinas Polri (Utama) wajib diisi":!polriMail.endsWith("@polri.go.id")?"Email dinas Polri wajib menggunakan domain @polri.go.id":!e9&&!es.nrp?"NRP/NIP wajib diisi untuk tambah pengguna":(!e9&&(!es.password||es.password.length<8||!/^(?=.*[A-Za-z])(?=.*\d).+$/.test(es.password)))?"Password awal min. 8 karakter kombinasi huruf & angka":(e9&&es.password&&(es.password.length<8||!/^(?=.*[A-Za-z])(?=.*\d).+$/.test(es.password)))?"Password minimal 8 karakter kombinasi huruf & angka":(!e9&&es.password!==es.password_confirmation)?"Konfirmasi password belum sama":(e9&&es.password&&es.password!==es.password_confirmation)?"Konfirmasi password belum sama":(ae&&!(ed.isSuperadmin&&"viewer"===es.role_bdb)&&(!es.scope_satker_key&&!es.scope_satker_id))?"Satker melekat wajib dipilih untuk role ini":null;if(a)return void e.current?.show({severity:"warn",summary:"Periksa lagi",detail:a});let uName=(es.username||"").trim().toLowerCase();
if(uName&&polriMail&&uName===polriMail)return void e.current?.show({severity:"warn",summary:"Periksa lagi",detail:"Username tidak boleh sama dengan Email Dinas Polri (gunakan username unik/alias)."});if(uName&&uName.includes("@"))return void e.current?.show({severity:"warn",summary:"Format Username Salah",detail:`Username (Alternatif Login) tidak boleh menggunakan @domain/email. Cukup isi "${uName.split("@")[0].replace(/[^a-z0-9_.]/g,"").slice(0,30)}" (tanpa @${uName.split("@")[1]}) atau kosongkan.`});if(uName&&!/^[a-z0-9_.]{3,30}$/.test(uName))return void e.current?.show({severity:"warn",summary:"Format Username Salah",detail:"Username hanya boleh 3-30 karakter huruf kecil, angka, titik (.), atau underscore (_) tanpa spasi."});
if(secMail&&secMail===polriMail)return void e.current?.show({severity:"warn",summary:"Periksa lagi",detail:"Email sekunder tidak boleh sama dengan Email dinas Polri."});if(el.hasBlockingIssue)return void e.current?.show({severity:"warn",summary:"Periksa lagi",detail:"Email dinas Polri atau Username sudah dipakai akun lain. Perbaiki dulu sebelum menyimpan."});if(ed.isOperator&&!e9&&!eConscious)return void e.current?.show({severity:"warn",summary:"Pernyataan Tanggung Jawab",detail:"Centang pernyataan sadar dan bertanggung jawab sebelum menambahkan akun."});if(!await (0,K.confirmAction)(e9?"Simpan perubahan pengguna?":"Tambah pengguna baru?"))return;et(!0);let s={name:(es.name||"").trim(),nrp:(es.nrp||"").trim(),email:secMail||polriMail,email_polri:polriMail,username:(es.username||"").trim()||null,role_bdb:es.role_bdb,status:es.status,approval_status:"AKTIF"===es.status?"APPROVED":es.approval_status,scope_satker_key:"superadmin"===es.role_bdb||"vendor_mitra"===es.role_bdb||(ed.isSuperadmin&&"viewer"===es.role_bdb&&!es.scope_satker_key)?"":es.scope_satker_key,scope_satker_id:"superadmin"===es.role_bdb||"vendor_mitra"===es.role_bdb||(ed.isSuperadmin&&"viewer"===es.role_bdb&&!es.scope_satker_id)?null:es.scope_satker_id,local_password_enabled:es.local_password_enabled,two_factor_required:es.two_factor_required,is_declared_conscious:!!eConscious};if(es.password&&es.password.trim().length>0){s.password=es.password.trim();s.password_confirmation=es.password_confirmation?es.password_confirmation.trim():s.password;}try{let res=e9?await L.apiAuth.patch(`/user/${es.id}`,s):await L.apiAuth.post("/user",s);(0,L.assertOk)(res);e.current?.show({severity:"success",summary:"Tersimpan",detail:e9?"Pengguna diperbarui":"Pengguna ditambahkan"});v(!1);await aa();}catch(r){let a=r.response?.data?.errors,s=(a&&Object.keys(a).length>0)?Object.values(a).flat().join(", "):r.response?.data?.message||r.message||"Gagal menyimpan";e.current?.show({severity:"error",summary:"Gagal",detail:s,life:8000});}finally{et(!1);}}(0,s.useEffect)(()=>am,[]);let ax=(0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.75rem",flexWrap:"wrap"},children:[(0,a.jsxs)("div",{style:{display:"flex",gap:"0.5rem",alignItems:"center",flexWrap:"wrap"},children:[(0,a.jsx)(l.InputText,{id:"user-search-filter",name:"search_user",value:y,onChange:e=>x(e.target.value),onKeyDown:e=>{"Enter"===e.key&&(e.preventDefault(),runUserSearch())},placeholder:"Cari nama / email / satker…"}),(0,a.jsx)(u.Dropdown,{id:"user-role-filter",value:userRoleFilter,options:[{label:"Semua Role",value:""},...X],onChange:e=>{setUserFirst(0),setUserRoleFilter(e.value||"")},placeholder:"Filter Role",style:{minWidth:"14rem"}}),(0,a.jsx)(o.Button,{label:"Cari",icon:"pi pi-search",onClick:runUserSearch,loading:f})]}),(0,a.jsxs)("div",{style:{display:"flex",gap:"0.5rem"},children:[(0,a.jsx)(o.Button,{label:"Muat ulang",icon:"pi pi-refresh",outlined:!0,onClick:()=>aa(),loading:f}),ed.isSuperadmin&&(0,a.jsx)(o.Button,{label:"Import Massal",icon:(0,a.jsx)(B.Upload,{size:15,style:{marginRight:"0.4rem"}}),outlined:!0,onClick:function(){eT(!0),eR("upload"),eI(null),eM([]),eK([])}}),ed.isSuperadmin&&(0,a.jsx)(o.Button,{label:"Reset Massal & Kirim Email",icon:(0,a.jsx)($.Mail,{size:15,style:{marginRight:"0.4rem"}}),outlined:!0,severity:"danger",onClick:ab}),(0,a.jsx)(o.Button,{label:"Tambah",icon:"pi pi-plus",onClick:function(){ed.isOperator?er({...Y,role_bdb:"operator",scope_satker_id:ep.id,scope_satker_key:ep.key,scope_satker_name:ep.name}):er(Y),el.resetAll(),eConsciousSet(!1),v(!0)}})]})]}),aj=(0,a.jsxs)("div",{children:[(0,a.jsx)(o.Button,{label:"Batal",text:!0,onClick:()=>v(!1),disabled:ei}),(0,a.jsx)(o.Button,{label:e9?"Simpan":"Tambah",icon:"pi pi-check",onClick:ay,loading:ei,disabled:ei||(es.username&&es.email_polri&&es.username.trim().toLowerCase()===es.email_polri.trim().toLowerCase())})]});return(0,a.jsxs)("div",{children:[(0,a.jsx)(p.Toast,{ref:e}),(0,a.jsx)(g.ConfirmDialog,{}),(0,a.jsx)("h1",{className:"cms-page-title",children:"Data Pengguna"}),(0,a.jsx)("p",{className:"cms-page-sub",children:"Kelola akun dan akses pengguna BDB."}),(0,a.jsx)("div",{className:"cms-card",style:{padding:0,overflow:"hidden"},children:(0,a.jsxs)(r.DataTable,{value:b,loading:f,lazy:!0,paginator:!0,first:userFirst,rows:userRows,totalRecords:userTotal,onPage:e=>{setUserFirst(e.first),setUserRows(e.rows)},rowsPerPageOptions:[10,25,50,100],paginatorTemplate:U.DEFAULT_PAGINATOR_LAYOUT,sortField:userSortField,sortOrder:userSortOrder,onSort:e=>{setUserSortField(e.sortField),setUserSortOrder(e.sortOrder),setUserFirst(0)},header:ax,emptyMessage:"Tidak ada data pengguna.",stripedRows:!0,size:"small",children:[(0,a.jsx)(i.Column,{header:"No",body:(e,a)=>a.rowIndex+1,style:{width:"3.5rem"},headerStyle:{width:"3.5rem"}}),!ed.isOperator&&(0,a.jsx)(i.Column,{field:"id",header:"ID",style:{width:"4rem"},sortable:!0}),(0,a.jsx)(i.Column,{field:"name",header:"Nama",sortable:!0}),(0,a.jsx)(i.Column,{header:"Email",sortable:!0,sortField:"email_polri",body:e=>{let p=(e.email_polri||"").trim(),s=(e.email||"").trim();if(!p&&s.toLowerCase().endsWith("@polri.go.id")){p=s;s=""}if(p&&s.toLowerCase()===p.toLowerCase()){s=""}function m(t){if(!t)return"";let v=t.split("@");if(2!==v.length)return t;let n=v[0],d=v[1];return n.length<=4?n[0]+"***@"+d:n.slice(0,4)+"****@"+d}let mp=m(p),ms=m(s);return(0,a.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.15rem",lineHeight:1.25},children:[p?(0,a.jsxs)("div",{style:{display:"inline-flex",alignItems:"center",gap:"0.35rem"},title:p,children:[(0,a.jsx)("span",{style:{fontWeight:600,color:"var(--cas-text-primary, #0f172a)"},children:mp}),(0,a.jsx)("span",{style:{fontSize:"0.62rem",background:"var(--cas-info-subtle, #eff6ff)",color:"var(--cas-info, #2563eb)",padding:"0.05rem 0.35rem",borderRadius:"3px",fontWeight:700,border:"1px solid var(--cas-border-subtle, #bfdbfe)"},children:"Polri"})]}):(0,a.jsx)("span",{style:{color:"#94a3b8",fontStyle:"italic"},children:"Belum ada email dinas"}),s?(0,a.jsxs)("div",{style:{display:"inline-flex",alignItems:"center",gap:"0.35rem",fontSize:"0.76rem",color:"var(--cas-text-muted, #64748b)"},title:s,children:[(0,a.jsx)("span",{children:ms}),(0,a.jsx)("span",{style:{fontSize:"0.6rem",background:"var(--cas-bg-hover, #f1f5f9)",color:"var(--cas-text-muted, #64748b)",padding:"0.05rem 0.25rem",borderRadius:"3px"},children:"Sekunder"})]}):null]})}}),(0,a.jsx)(i.Column,{header:"Role",body:e=>"vendor_mitra"===e.role_bdb?(0,a.jsx)(t.Tag,{value:"Vendor / Mitra (Read-Only)",severity:"help",style:{background:"linear-gradient(135deg, #7c3aed 0%, #0891b2 100%)",color:"#ffffff",fontWeight:700}}):(0,a.jsx)(t.Tag,{value:e.role_bdb||"viewer",severity:Q[e.role_bdb||"viewer"]}),sortable:!0,sortField:"role_bdb"}),(0,a.jsx)(i.Column,{header:"Satker Melekat",sortable:!0,sortField:"scope_satker_key",body:e=>"superadmin"===e.role_bdb?(0,a.jsx)("span",{style:{color:"var(--cas-text-muted, #94a3b8)",fontWeight:600},children:"Nasional"}):"vendor_mitra"===e.role_bdb?(0,a.jsx)("span",{style:{color:"#7c3aed",fontWeight:600},children:"Nasional (Read-Only)"}):e.scope_satker_name?(0,a.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.3rem",color:"var(--cas-text-secondary, #334155)"},children:[(0,a.jsx)(P.Building2,{size:14,style:{color:"var(--cas-info, #2563eb)"}}),e.scope_satker_name]}):(0,a.jsx)("span",{style:{color:"var(--cas-text-muted, #cbd5e1)"},children:"—"})}),(0,a.jsx)(i.Column,{header:"Skor keaktifan",sortable:!0,field:"activity_score",sortField:"activity_score",body:e=>{
    let sc=Number(e.activity_score??0);
    let st=e.activity_status||(sc>=80?"SANGAT_AKTIF":sc>=50?"CUKUP_AKTIF":sc>0?"KURANG_AKTIF":"INAKTIF");
    let bg=sc>=80?"#dcfce7":sc>=50?"#fef9c3":sc>0?"#ffedd5":"#fee2e2";
    let fg=sc>=80?"#15803d":sc>=50?"#a16207":sc>0?"#c2410c":"#b91c1c";
    let border=sc>=80?"#86efac":sc>=50?"#fde047":sc>0?"#fdba74":"#fca5a5";
    return(0,a.jsxs)("button",{
        type:"button",
        onClick:()=>openActivityDetail(e),
        title:`Skor ${sc}% (${st.replace(/_/g," ")}). Klik untuk rincian keaktifan 30 hari`,
        style:{
            background:bg,
            color:fg,
            border:`1px solid ${border}`,
            borderRadius:"9999px",
            padding:"0.22rem 0.65rem",
            fontWeight:700,
            fontSize:"0.8rem",
            cursor:"pointer",
            display:"inline-flex",
            alignItems:"center",
            gap:"0.35rem",
            transition:"all 0.15s ease",
            boxShadow:"0 1px 2px rgba(0,0,0,0.05)"
        },
        children:[
            (0,a.jsx)("span",{style:{width:"7px",height:"7px",borderRadius:"50%",backgroundColor:fg,display:"inline-block"}}),
            sc+"%"
        ]
    });
}}),(0,a.jsx)(i.Column,{header:"Login Terakhir",body:e=>{let s=V(e.last_login_at);return s?(0,a.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.35rem",fontSize:"0.82rem",color:"var(--cas-text-secondary, #334155)"},children:[(0,a.jsx)(C.Clock,{size:13,style:{color:"var(--cas-text-muted, #94a3b8)"}}),s]}):(0,a.jsx)("span",{style:{color:"var(--cas-text-muted, #cbd5e1)"},children:"Belum pernah"})},sortable:!0,sortField:"last_login_at"}),(0,a.jsx)(i.Column,{header:"Status",body:e=>{
    let s=q(e.locked_until);
    let reqD="REQUEST_DELETE"===e.approval_status,
        reqN="REQUEST_DEACTIVATE"===e.approval_status,
        reqM="REQUEST_MUTASI"===e.approval_status||"REQUEST_MUTASI_KELUAR"===e.approval_status,
        isMK="MUTASI_KELUAR_RESERSE"===e.approval_status;
    let isAktif=(e.status||"").toUpperCase()==="AKTIF";
    let canToggle=ed.isSuperadmin||(ed.isOperator&&["operator","viewer"].includes(e.role_bdb));
    let isSelf=e.id===em;
    return(0,a.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.35rem",flexWrap:"wrap"},children:[
        reqD?(0,a.jsx)(t.Tag,{value:"Mohon Hapus",severity:"danger",title:e.deactivation_reason||"Permohonan penghapusan diajukan"})
        :reqN?(0,a.jsx)(t.Tag,{value:"Mohon Nonaktif",severity:"warning",title:e.deactivation_reason||"Permohonan penonaktifan diajukan"})
        :reqM?(0,a.jsx)(t.Tag,{value:"Req Mutasi",severity:"info",title:e.deactivation_reason||"Menunggu persetujuan mutasi oleh Superadmin"})
        :isMK?(0,a.jsx)(t.Tag,{value:"Dinas Luar Reskrim",severity:"secondary",title:e.deactivation_reason||"Mutasi keluar fungsi Reserse/Reskrim"})
        :(0,a.jsxs)("button",{
            type:"button",
            onClick:()=>(canToggle&&!isSelf)?toggleUserStatus(e):void 0,
            title:isSelf?"Akun sendiri (tidak dapat diubah)":canToggle?(isAktif?"Status: AKTIF (Klik untuk menonaktifkan)":"Status: NONAKTIF (Klik untuk mengaktifkan)"):"Status pengguna",
            style:{
                background:isAktif?"rgba(22,163,74,0.12)":"rgba(220,38,38,0.12)",
                color:isAktif?"#16a34a":"#dc2626",
                border:`1px solid ${isAktif?"rgba(22,163,74,0.3)":"rgba(220,38,38,0.3)"}`,
                borderRadius:"9999px",
                padding:"0.22rem 0.65rem",
                fontWeight:700,
                fontSize:"0.76rem",
                cursor:(canToggle&&!isSelf)?"pointer":"default",
                display:"inline-flex",
                alignItems:"center",
                gap:"0.35rem",
                transition:"all 0.15s ease",
                boxShadow:"0 1px 2px rgba(0,0,0,0.05)"
            },
            children:[
                (0,a.jsx)("span",{style:{width:"6px",height:"6px",borderRadius:"50%",backgroundColor:isAktif?"#16a34a":"#dc2626",display:"inline-block"}}),
                isAktif?"AKTIF":"NONAKTIF",
                (canToggle&&!isSelf)?(0,a.jsx)("i",{className:isAktif?"pi pi-pencil":"pi pi-power-off",style:{fontSize:"0.65rem",opacity:0.7,marginLeft:"0.15rem"}}):null
            ]
        }),
        s>0&&(0,a.jsxs)("span",{title:`Terkunci ${s} menit lagi`,style:{display:"inline-flex",alignItems:"center",gap:"0.2rem",fontSize:"0.7rem",fontWeight:700,color:"#dc2626",background:"#fef2f2",borderRadius:999,padding:"0.1rem 0.4rem"},children:[(0,a.jsx)(_.Lock,{size:11})," ",s,"m"]})
    ]});
},sortable:!0,sortField:"status"}),(0,a.jsx)(i.Column,{header:"",body:e=>(0,a.jsxs)("div",{style:{display:"flex",gap:"0.15rem"},children:[(0,a.jsx)("button",{type:"button",className:"att-icon-link",onClick:()=>eo(e),title:"Detail","aria-label":"Detail",children:(0,a.jsx)(S.Eye,{size:17})}),(0,a.jsx)(o.Button,{icon:"pi pi-pencil",rounded:!0,text:!0,severity:"secondary",onClick:()=>{let p=(e.email_polri||"").trim(),s=(e.email||"").trim();if(!p&&s.toLowerCase().endsWith("@polri.go.id")){p=s;s=""}if(p&&s.toLowerCase()===p.toLowerCase()){s=""}er({id:e.id,name:e.name||"",nrp:e.nrp||"",email:s,email_polri:p,username:e.username||"",role_bdb:e.role_bdb||"viewer",approval_status:e.approval_status||"APPROVED",status:e.status||"AKTIF",scope_satker_id:e.scope_satker_id?Number(e.scope_satker_id):null,scope_satker_key:e.scope_satker_key||"",scope_satker_name:e.scope_satker_name||"",local_password_enabled:e.local_password_enabled??!0,two_factor_required:e.two_factor_required??!1,password:"",password_confirmation:""}),el.resetAll(),v(!0)},"aria-label":"Edit"}),"superadmin"!==e.role_bdb&&"admin_binops"!==e.role_bdb&&"vendor_mitra"!==e.role_bdb&&(0,a.jsx)(o.Button,{icon:"pi pi-sync",rounded:!0,text:!0,onClick:()=>openMutateDialog(e),"aria-label":"Mutasi Satker",title:ed.isOperator?"Ajukan Mutasi Personil ke Superadmin":"Mutasi Satker Personil",style:{color:"#0284c7"}}),ed.isSuperadmin&&e.id!==em&&"superadmin"!==e.role_bdb&&(0,a.jsx)(o.Button,{icon:(0,a.jsx)(R.UserCog,{size:17}),rounded:!0,text:!0,onClick:()=>{ev(e),e_("")},"aria-label":"Impersonate",title:"Masuk sebagai user ini",style:{color:"#7c3aed"}}),(ed.isSuperadmin||(ed.isOperator&&["operator","viewer"].includes(e.role_bdb)))&&e.id!==em&&(0,a.jsx)(o.Button,{icon:(0,a.jsx)(D.KeyRound,{size:17}),rounded:!0,text:!0,loading:eW===e.id,onClick:()=>au(e),"aria-label":"Reset Password & Kirim Email",title:"Reset password & kirim email kredensial baru",style:{color:"#0891b2"}}),(ed.isSuperadmin||(ed.isOperator&&["operator","viewer"].includes(e.role_bdb)))&&e.id!==em&&(0,a.jsx)(o.Button,{icon:(0,a.jsx)(T.Trash2,{size:17}),rounded:!0,text:!0,severity:"danger",onClick:()=>{eh(e),ek(""),eDelTypeSet("HAPUS"),eDelReasonSet("")},"aria-label":"Hapus",title:ed.isOperator?"Ajukan hapus / nonaktifkan ke Superadmin":e.approval_status?.startsWith("REQUEST_")?"Tinjau permohonan pengajuan hapus/nonaktif":"Hapus akun permanen"})]}),style:{width:"10rem",minWidth:"10rem"}})]})}),(0,a.jsx)(d.Dialog,{header:"Detail Pengguna",visible:!!en,onHide:()=>eo(null),style:{width:"34rem",maxWidth:"95vw"},modal:!0,dismissableMask:!0,children:en&&(0,a.jsxs)("div",{style:{display:"grid",gap:"0.55rem"},children:[(0,a.jsx)(ea,{id:"fld-user-page-paginati-1",name:"field_user_page_paginati_1",label:"Nama",value:en.name}),(0,a.jsx)(ea,{id:"fld-user-page-paginati-2",name:"field_user_page_paginati_2",label:"Email",value:en.email}),(0,a.jsx)(ea,{id:"fld-user-page-paginati-3",name:"field_user_page_paginati_3",label:"NRP / NIP",value:en.nrp}),(0,a.jsx)(ea,{id:"fld-user-page-paginati-4",name:"field_user_page_paginati_4",label:"Role",value:"vendor_mitra"===en.role_bdb?"Vendor / Mitra (Read-Only)":en.role_bdb}),(0,a.jsx)(ea,{id:"fld-user-page-paginati-5",name:"field_user_page_paginati_5",label:"Satker Melekat",value:"superadmin"===en.role_bdb?"Nasional (semua satker)":"vendor_mitra"===en.role_bdb?"Nasional (Read-Only — Semua Satker)":en.scope_satker_name||"—"}),(0,a.jsx)(ea,{id:"fld-user-page-paginati-6",name:"field_user_page_paginati_6",label:"Kode Satker",value:"superadmin"===en.role_bdb||"vendor_mitra"===en.role_bdb?"—":en.scope_satker_key||"—"}),(0,a.jsx)(ea,{id:"fld-user-page-paginati-7",name:"field_user_page_paginati_7",label:"Cakupan Akses",value:en.scope_access_display||"—"}),(0,a.jsx)(ea,{id:"fld-user-page-paginati-8",name:"field_user_page_paginati_8",label:"Status",value:en.status}),(0,a.jsx)(ea,{id:"fld-user-page-paginati-9",name:"field_user_page_paginati_9",label:"Login Terakhir",value:V(en.last_login_at)||"Belum pernah"}),(0,a.jsx)(ea,{id:"fld-user-page-paginati-10",name:"field_user_page_paginati_10",label:"Metode Login Terakhir",value:en.last_login_method||"—"}),(0,a.jsx)(ea,{id:"fld-user-page-paginati-11",name:"field_user_page_paginati_11",label:"Percobaan Gagal",value:String(en.failed_login_attempts??0)}),(0,a.jsx)(ea,{id:"fld-user-page-paginati-12",name:"field_user_page_paginati_12",label:"Status Kunci",value:q(en.locked_until)>0?`Terkunci ${q(en.locked_until)} menit lagi`:"Tidak terkunci",tone:q(en.locked_until)>0?"bad":"ok"}),(0,a.jsx)(ea,{id:"fld-user-keaktifan",name:"field_user_keaktifan",label:"Skor Keaktifan (30 Hari)",value:en.activity_score!=null?`${en.activity_score}% (${(en.activity_status||"INAKTIF").replace(/_/g," ")})`:"0% (INAKTIF)",tone:en.activity_score>=80?"ok":en.activity_score>=50?"neutral":"bad"})]})}),(0,a.jsx)(d.Dialog,{
    header:actUser?`Rincian Keaktifan — ${actUser.name}`:"Rincian Keaktifan Pengguna",
    visible:!!actUser,
    onHide:()=>setActUser(null),
    style:{width:"46rem",maxWidth:"96vw"},
    modal:!0,
    dismissableMask:!0,
    footer:(0,a.jsx)("div",{style:{display:"flex",justifyContent:"flex-end"},children:(0,a.jsx)(o.Button,{label:"Tutup",onClick:()=>setActUser(null),severity:"secondary",text:!0})}),
    children:actUser&&(()=>{
        let summary=actDetail?.summary||{
            score:actUser.activity_score??0,
            status_keaktifan:actUser.activity_status||"INAKTIF",
            login_days_count:actUser.activity_login_days??0,
            lp_created_count:actUser.activity_lp_created??0,
            lp_updated_count:actUser.activity_lp_updated??0,
            docs_uploaded_count:actUser.activity_docs_uploaded??0,
            last_active_at:actUser.activity_last_active
        };
        let sc=Number(summary.score??0);
        let st=summary.status_keaktifan||(sc>=80?"SANGAT_AKTIF":sc>=50?"CUKUP_AKTIF":sc>0?"KURANG_AKTIF":"INAKTIF");
        let bg=sc>=80?"#dcfce7":sc>=50?"#fef9c3":sc>0?"#ffedd5":"#fee2e2";
        let fg=sc>=80?"#15803d":sc>=50?"#a16207":sc>0?"#c2410c":"#b91c1c";
        let border=sc>=80?"#86efac":sc>=50?"#fde047":sc>0?"#fdba74":"#fca5a5";
        let isDorman=sc===0||!summary.last_active_at;

        return(0,a.jsxs)("div",{
            style:{display:"flex",flexDirection:"column",gap:"1rem"},
            children:[
                (0,a.jsxs)("div",{
                    style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"1rem 1.2rem",background:"var(--cas-bg-subtle, #f8fafc)",borderRadius:"10px",border:"1px solid var(--cas-border-card, #e2e8f0)"},
                    children:[
                        (0,a.jsxs)("div",{
                            children:[
                                (0,a.jsx)("div",{style:{fontSize:"1.05rem",fontWeight:700,color:"var(--cas-text-primary, #0f172a)"},children:actUser.name}),
                                (0,a.jsxs)("div",{style:{fontSize:"0.82rem",color:"var(--cas-text-muted, #64748b)",marginTop:"0.2rem"},children:[actUser.email,actUser.nrp?` • NRP: ${actUser.nrp}`:null]}),
                                (0,a.jsxs)("div",{style:{fontSize:"0.82rem",color:"#2563eb",marginTop:"0.2rem",display:"inline-flex",alignItems:"center",gap:"0.3rem"},children:[(0,a.jsx)(P.Building2,{size:13}),actUser.scope_satker_name||"Nasional",` (${actUser.role_bdb||"viewer"})`]})
                            ]
                        }),
                        (0,a.jsxs)("div",{
                            style:{textAlign:"center",padding:"0.6rem 1.2rem",borderRadius:"12px",background:bg,border:`1.5px solid ${border}`},
                            children:[
                                (0,a.jsx)("div",{style:{fontSize:"1.7rem",fontWeight:800,color:fg,lineHeight:1},children:`${sc}%`}),
                                (0,a.jsx)("div",{style:{fontSize:"0.72rem",fontWeight:700,color:fg,textTransform:"uppercase",marginTop:"0.25rem",letterSpacing:"0.03em"},children:st.replace(/_/g," ")})
                            ]
                        })
                    ]
                }),
                isDorman&&(0,a.jsxs)("div",{
                    style:{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:"8px",padding:"0.7rem 0.9rem",display:"flex",alignItems:"center",gap:"0.6rem",color:"#b91c1c",fontSize:"0.82rem"},
                    children:[
                        (0,a.jsx)("i",{className:"pi pi-exclamation-triangle",style:{fontSize:"1.2rem",flexShrink:0}}),
                        (0,a.jsx)("span",{children:"Status Akun Dorman: Personil tidak aktif selama ≥ 15 hari berturut-turut tanpa rekam jejak operasional. Nilai keaktifan dinilai 0% sesuai standard operasional CAS."})
                    ]
                }),
                (0,a.jsx)("div",{style:{fontSize:"0.78rem",color:"#64748b",fontStyle:"italic"},children:"* Dihitung otomatis secara rolling 30 hari terakhir. Data induk LP disinkronkan dari DORS SPKT, skor mengukur kepatuhan administrasi penyidikan (mindik) dan aktivitas personil."}),
                (0,a.jsxs)("div",{
                    style:{display:"grid",gridTemplateColumns:"repeat(4, minmax(0, 1fr))",gap:"0.55rem"},
                    children:[
                        (0,a.jsxs)("div",{
                            style:{background:"var(--cas-bg-surface, #ffffff)",border:"1px solid var(--cas-border-card, #e2e8f0)",borderRadius:"8px",padding:"0.65rem 0.6rem"},
                            children:[
                                (0,a.jsx)("div",{style:{fontSize:"0.74rem",color:"var(--cas-text-muted, #64748b)",fontWeight:700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:"📅 Hari Login"}),
                                (0,a.jsxs)("div",{style:{fontSize:"1.2rem",fontWeight:800,color:"var(--cas-text-primary, #0f172a)",marginTop:"0.25rem"},children:[summary.login_days_count||0," ",(0,a.jsx)("span",{style:{fontSize:"0.75rem",fontWeight:400,color:"#64748b"},children:"/ 30 hr"})]}),
                                (0,a.jsx)("div",{style:{fontSize:"0.68rem",color:"#16a34a",marginTop:"0.15rem",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:"Akses login aktif"})
                            ]
                        }),
                        (0,a.jsxs)("div",{
                            style:{background:"var(--cas-bg-surface, #ffffff)",border:"1px solid var(--cas-border-card, #e2e8f0)",borderRadius:"8px",padding:"0.65rem 0.6rem"},
                            children:[
                                (0,a.jsx)("div",{style:{fontSize:"0.74rem",color:"var(--cas-text-muted, #64748b)",fontWeight:700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:"📑 Dokumen Mindik"}),
                                (0,a.jsxs)("div",{style:{fontSize:"1.2rem",fontWeight:800,color:"var(--cas-text-primary, #0f172a)",marginTop:"0.25rem"},children:[summary.lp_created_count||0," ",(0,a.jsx)("span",{style:{fontSize:"0.75rem",fontWeight:400,color:"#64748b"},children:"dok"})]}),
                                (0,a.jsx)("div",{style:{fontSize:"0.68rem",color:"#2563eb",marginTop:"0.15rem",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:"SPDP, Sidik, Tahap 2"})
                            ]
                        }),
                        (0,a.jsxs)("div",{
                            style:{background:"var(--cas-bg-surface, #ffffff)",border:"1px solid var(--cas-border-card, #e2e8f0)",borderRadius:"8px",padding:"0.65rem 0.6rem"},
                            children:[
                                (0,a.jsx)("div",{style:{fontSize:"0.74rem",color:"var(--cas-text-muted, #64748b)",fontWeight:700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:"🔄 Update Perkara"}),
                                (0,a.jsxs)("div",{style:{fontSize:"1.2rem",fontWeight:800,color:"var(--cas-text-primary, #0f172a)",marginTop:"0.25rem"},children:[summary.lp_updated_count||0," ",(0,a.jsx)("span",{style:{fontSize:"0.75rem",fontWeight:400,color:"#64748b"},children:"kali"})]}),
                                (0,a.jsx)("div",{style:{fontSize:"0.68rem",color:"#7c3aed",marginTop:"0.15rem",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:"Tindakan status LP"})
                            ]
                        }),
                        (0,a.jsxs)("div",{
                            style:{background:"var(--cas-bg-surface, #ffffff)",border:"1px solid var(--cas-border-card, #e2e8f0)",borderRadius:"8px",padding:"0.65rem 0.6rem"},
                            children:[
                                (0,a.jsx)("div",{style:{fontSize:"0.74rem",color:"var(--cas-text-muted, #64748b)",fontWeight:700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:"📎 Berkas Diunggah"}),
                                (0,a.jsxs)("div",{style:{fontSize:"1.2rem",fontWeight:800,color:"var(--cas-text-primary, #0f172a)",marginTop:"0.25rem"},children:[summary.docs_uploaded_count||0," ",(0,a.jsx)("span",{style:{fontSize:"0.75rem",fontWeight:400,color:"#64748b"},children:"berkas"})]}),
                                (0,a.jsx)("div",{style:{fontSize:"0.68rem",color:"#0891b2",marginTop:"0.15rem",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:"Digitalisasi PDF"})
                            ]
                        })
                    ]
                }),
                (0,a.jsxs)("div",{
                    style:{fontSize:"0.82rem",color:"#475569",background:"#f1f5f9",padding:"0.55rem 0.85rem",borderRadius:"6px",display:"flex",justifyContent:"space-between",alignItems:"center"},
                    children:[
                        (0,a.jsx)("span",{children:"Aktivitas Terakhir Tercatat:"}),
                        (0,a.jsx)("strong",{children:V(summary.last_active_at)||"Belum ada dalam 30 hari"})
                    ]
                })
            ]
        });
    })()
}),(0,a.jsx)(d.Dialog,{
    header:mutUser ? (ed.isOperator ? "Ajukan Usulan Mutasi Personil" : (mutUser.approval_status?.startsWith("REQUEST_") ? "Tinjau & Proses Usulan Mutasi Personil" : ("Mutasi Satker Personil — " + mutUser.name))) : "Mutasi Satker",
    visible:!!mutUser,
    onHide:()=>setMutUser(null),
    style:{width:"46rem",maxWidth:"96vw"},
    modal:!0,
    dismissableMask:!0,
    footer:(0,a.jsxs)("div",{
        style:{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",gap:"0.5rem",flexWrap:"wrap"},
        children:[
            (0,a.jsx)(o.Button,{label:"Batal",text:!0,disabled:mutLoading,onClick:()=>setMutUser(null)}),
            (0,a.jsxs)("div",{
                style:{display:"flex",alignItems:"center",gap:"0.5rem"},
                children:[
                    (!ed.isOperator && mutUser?.approval_status?.startsWith("REQUEST_")) ? (0,a.jsx)(o.Button,{
                        label:"Tolak Usulan",
                        severity:"secondary",
                        icon:"pi pi-times",
                        disabled:mutLoading,
                        onClick:async ()=>{
                            let target = mutUser;
                            setMutUser(null);
                            eh(target);
                            await asSuperadminReview("REJECT");
                        }
                    }) : null,
                    (0,a.jsx)(o.Button,{
                        label:ed.isOperator ? "Kirim Usulan Mutasi ke Superadmin" : "Eksekusi Mutasi Personil",
                        icon:ed.isOperator ? "pi pi-send" : "pi pi-check",
                        severity:"info",
                        loading:mutLoading,
                        onClick:handleMutateSubmit
                    })
                ]
            })
        ]
    }),
    children:mutUser && (0,a.jsxs)("div",{
        style:{display:"flex",flexDirection:"column",gap:"0.9rem"},
        children:[
            /* Proposal Banner if any proposal note or requested */
            ((mutUser.deactivation_reason || "").trim() || mutUser.approval_status?.startsWith("REQUEST_") || mutHistory.some(m => m.status === 'PENDING')) ? (0,a.jsxs)("div",{
                style:{
                    background:"linear-gradient(135deg, rgba(2, 132, 199, 0.12) 0%, rgba(14, 165, 233, 0.05) 100%)",
                    border:"1px solid rgba(56, 189, 248, 0.35)",
                    borderRadius:"10px",
                    padding:"0.85rem 1rem",
                    display:"flex",
                    flexDirection:"column",
                    gap:"0.45rem"
                },
                children:[
                    (0,a.jsxs)("div",{
                        style:{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"0.4rem"},
                        children:[
                            (0,a.jsxs)("div",{
                                style:{display:"flex",alignItems:"center",gap:"0.5rem"},
                                children:[
                                    (0,a.jsx)("span",{
                                        style:{
                                            background:"#0284c7",
                                            color:"#ffffff",
                                            borderRadius:"6px",
                                            padding:"0.2rem 0.55rem",
                                            fontSize:"0.72rem",
                                            fontWeight:700,
                                            textTransform:"uppercase",
                                            letterSpacing:"0.03em"
                                        },
                                        children:"📋 Usulan Mutasi Operator"
                                    }),
                                    mutUser.deactivated_at ? (0,a.jsxs)("span",{
                                        style:{fontSize:"0.75rem",color:"var(--cas-subtle, #94a3b8)",display:"inline-flex",alignItems:"center",gap:"0.3rem"},
                                        children:[
                                            (0,a.jsx)("i",{className:"pi pi-calendar",style:{fontSize:"0.7rem",color:"#38bdf8"}}),
                                            "Diajukan: " + formatIndoDateStr(mutUser.deactivated_at) + (formatIndoTimeStr(mutUser.deactivated_at) ? " " + formatIndoTimeStr(mutUser.deactivated_at) : "")
                                        ]
                                    }) : null
                                ]
                            }),
                            (0,a.jsx)("span",{
                                style:{fontSize:"0.72rem",color:"#38bdf8",fontWeight:600},
                                children:"✓ Data usulan otomatis dimuat ke formulir"
                            })
                        ]
                    }),
                    ((mutUser.deactivation_reason || "").trim() || mutHistory.find(m => m.status === 'PENDING')?.keterangan) ? (0,a.jsxs)("div",{
                        style:{
                            background:"var(--cas-surface-subtle, rgba(0, 0, 0, 0.06))",
                            borderLeft:"3px solid #38bdf8",
                            padding:"0.5rem 0.75rem",
                            borderRadius:"0 6px 6px 0",
                            fontSize:"0.82rem",
                            color:"var(--cas-text, #f1f5f9)",
                            lineHeight:1.5,
                            fontStyle:"italic"
                        },
                        children:[
                            (0,a.jsx)("span",{style:{fontWeight:600,fontStyle:"normal",color:"#93c5fd",marginRight:"0.35rem"},children:"Alasan/Catatan Operator:"}),
                            mutUser.deactivation_reason || mutHistory.find(m => m.status === 'PENDING')?.keterangan
                        ]
                    }) : null
                ]
            }) : null,

            /* Rich Personnel Card */
            renderUserMiniCard(mutUser),

            /* Policy notice */
            (0,a.jsxs)("div",{
                style:{
                    background:"rgba(2, 132, 199, 0.08)",
                    border:"1px dashed rgba(56, 189, 248, 0.3)",
                    borderRadius:"8px",
                    padding:"0.5rem 0.75rem",
                    display:"flex",
                    alignItems:"center",
                    gap:"0.45rem",
                    fontSize:"0.75rem",
                    color:"#38bdf8"
                },
                children:[
                    (0,a.jsx)("i",{className:"pi pi-shield",style:{fontSize:"0.85rem",flexShrink:0}}),
                    "Ketentuan CAS Bareskrim: Seluruh histori dan administrasi LP personil di satker asal tetap tersimpan aman dan terarsip."
                ]
            }),

            /* Mutasi Type Selector (Cards) */
            (0,a.jsxs)("div",{
                style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.6rem"},
                children:[
                    (0,a.jsxs)("div",{
                        onClick:()=>setMutData(prev=>({...prev,is_keluar_reserse:false})),
                        style:{
                            cursor:"pointer",
                            padding:"0.75rem 0.85rem",
                            borderRadius:"8px",
                            border:!mutData.is_keluar_reserse?"2px solid #0284c7":"1px solid rgba(255, 255, 255, 0.1)",
                            background:!mutData.is_keluar_reserse?"rgba(2, 132, 199, 0.12)":"rgba(255, 255, 255, 0.02)",
                            transition:"all 0.15s ease"
                        },
                        children:[
                            (0,a.jsxs)("div",{
                                style:{display:"flex",alignItems:"center",gap:"0.45rem",fontWeight:700,fontSize:"0.84rem",color:!mutData.is_keluar_reserse?"#38bdf8":"var(--cas-text, #f8fafc)"},
                                children:[
                                    (0,a.jsx)("i",{className:"pi pi-building",style:{fontSize:"0.9rem"}}),
                                    "Mutasi Internal Reskrim"
                                ]
                            }),
                            (0,a.jsx)("div",{
                                style:{fontSize:"0.72rem",color:"var(--cas-subtle, #94a3b8)",marginTop:"0.25rem"},
                                children:"Pindah satker / unit lain di jajaran Reserse POLRI."
                            })
                        ]
                    }),
                    (0,a.jsxs)("div",{
                        onClick:()=>setMutData(prev=>({...prev,is_keluar_reserse:true})),
                        style:{
                            cursor:"pointer",
                            padding:"0.75rem 0.85rem",
                            borderRadius:"8px",
                            border:mutData.is_keluar_reserse?"2px solid #f59e0b":"1px solid rgba(255, 255, 255, 0.1)",
                            background:mutData.is_keluar_reserse?"rgba(245, 158, 11, 0.12)":"rgba(255, 255, 255, 0.02)",
                            transition:"all 0.15s ease"
                        },
                        children:[
                            (0,a.jsxs)("div",{
                                style:{display:"flex",alignItems:"center",gap:"0.45rem",fontWeight:700,fontSize:"0.84rem",color:mutData.is_keluar_reserse?"#fbbf24":"var(--cas-text, #f8fafc)"},
                                children:[
                                    (0,a.jsx)("i",{className:"pi pi-sign-out",style:{fontSize:"0.9rem"}}),
                                    "Mutasi Keluar Reserse"
                                ]
                            }),
                            (0,a.jsx)("div",{
                                style:{fontSize:"0.72rem",color:"var(--cas-subtle, #94a3b8)",marginTop:"0.25rem"},
                                children:"Dinas luar fungsi Reskrim (Sabhara, Lantas, dll)."
                            })
                        ]
                    })
                ]
            }),

            mutData.is_keluar_reserse ? (0,a.jsxs)(a.Fragment,{
                children:[
                    (0,a.jsxs)("div",{
                        style:{background:"rgba(245, 158, 11, 0.1)",border:"1px solid rgba(245, 158, 11, 0.3)",borderRadius:"8px",padding:"0.65rem 0.85rem",display:"flex",flexDirection:"column",gap:"0.25rem"},
                        children:[
                            (0,a.jsxs)("div",{style:{fontWeight:600,fontSize:"0.82rem",color:"#d97706",display:"flex",alignItems:"center",gap:"0.35rem"},children:[(0,a.jsx)("i",{className:"pi pi-info-circle"}),"Penonaktifan Akses Sementara"]}),
                            (0,a.jsx)("div",{style:{fontSize:"0.75rem",color:"var(--cas-text-secondary, #334155)",lineHeight:1.45},children:"Personil yang mutasi keluar fungsi Reserse akan dinonaktifkan dari akses CAS Reskrim, namun SELURUH REKAM JEJAK & HISTORI LP TETAP TERSIMPAN UTUH. Jika kelak personil kembali ke jajaran Reserse, akun dapat dimutasikan kembali dan langsung tersambung."})
                        ]
                    }),
                    (0,a.jsx)(ee,{
                        label:"Satuan Kerja / Fungsi Baru (Luar Reskrim) *",
                        hint:"Nama kesatuan baru dinas luar Reskrim",
                        children:(0,a.jsx)(l.InputText,{
                            value:mutData.satker_non_reserse || "",
                            placeholder:"Contoh: Sat Sabhara Polres Bone / Ditlantas Polda Sulsel / Bagops",
                            onChange:e=>setMutData(prev=>({...prev,satker_non_reserse:e.target.value})),
                            style:{width:"100%"}
                        })
                    })
                ]
            }) : (0,a.jsxs)(a.Fragment,{
                children:[
                    (0,a.jsx)(ee,{
                        label:"Satker Tujuan Mutasi *",
                        hint:mutData.to_satker_name ? mutData.to_satker_name : "Pilih satuan kerja baru",
                        children:(0,a.jsxs)("div",{
                            style:{display:"flex",flexDirection:"column",gap:"0.45rem",background:"var(--cas-bg-subtle, #f8fafc)",padding:"0.65rem 0.8rem",borderRadius:"8px",border:"1px solid var(--cas-border, #e2e8f0)"},
                            children:[
                                (0,a.jsxs)("div",{
                                    style:{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"0.5rem"},
                                    children:[
                                        (0,a.jsxs)("div",{
                                            style:{display:"flex",alignItems:"center",gap:"0.45rem",minWidth:0,flex:1},
                                            children:[
                                                (0,a.jsx)(P.Building2,{size:16,style:{color:"#38bdf8",flexShrink:0}}),
                                                (0,a.jsx)("div",{style:{fontSize:"0.84rem",fontWeight:600,color:mutData.to_satker_name?"var(--cas-text-primary, #0f172a)":"#94a3b8",wordBreak:"break-word"},children:mutData.to_satker_name||"— Belum Memilih Satker Tujuan —"})
                                            ]
                                        }),
                                        (0,a.jsx)(o.Button,{
                                            type:"button",
                                            label:mutData.to_satker_id?"Ubah Satker":"Pilih Satker Berjenjang",
                                            icon:"pi pi-sitemap",
                                            className:"p-button-sm p-button-outlined",
                                            onClick:()=>openSatkerPicker("mutasi"),
                                            style:{fontSize:"0.75rem",padding:"0.3rem 0.6rem"}
                                        })
                                    ]
                                }),
                                mutData.to_satker_key ? (0,a.jsxs)("div",{style:{fontSize:"0.72rem",color:"#64748b",fontFamily:"monospace"},children:["Kode: ",mutData.to_satker_key]}) : null
                            ]
                        })
                    }),
                    (0,a.jsx)(ee,{
                        label:"Role Penugasan Baru *",
                        children:(0,a.jsx)(u.Dropdown,{
                            value:mutData.to_role,
                            options:[
                                {label:"Operator (Input & Kelola LP)",value:"operator"},
                                {label:"Viewer (Hanya Lihat Laporan)",value:"viewer"}
                            ],
                            onChange:e=>setMutData(prev=>({...prev,to_role:e.value})),
                            style:{width:"100%"}
                        })
                    })
                ]
            }),

            /* Sprint and Effective Date */
            (0,a.jsxs)("div",{
                style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem"},
                children:[
                    (0,a.jsx)(ee,{
                        label:"Nomor Surat Keputusan / Sprint *",
                        hint:"Dasar hukum telegram mutasi",
                        children:(0,a.jsx)(l.InputText,{
                            value:mutData.nomor_surat,
                            placeholder:"Contoh: ST/01/IX/KEP./2026/RO-SDM",
                            onChange:e=>setMutData(prev=>({...prev,nomor_surat:e.target.value})),
                            style:{width:"100%"}
                        })
                    }),
                    (0,a.jsx)(ee,{
                        label:"Tanggal Efektif Mutasi *",
                        hint:mutUser.deactivated_at ? ("Tgl diajukan: " + formatIndoDateStr(mutUser.deactivated_at)) : "Tanggal mulai penugasan",
                        children:(0,a.jsx)("input",{
                            type:"date",
                            className:"p-inputtext p-component",
                            style:{width:"100%",padding:"0.45rem 0.6rem"},
                            value:mutData.tanggal_efektif,
                            onChange:e=>setMutData(prev=>({...prev,tanggal_efektif:e.target.value}))
                        })
                    })
                ]
            }),

            (0,a.jsx)(ee,{
                label:"Keterangan / Catatan Penugasan",
                hint:"Opsional (bisa disesuaikan dari usulan operator)",
                children:(0,a.jsx)(l.InputText,{
                    value:mutData.keterangan,
                    placeholder:"Contoh: Mutasi rotasi dinas sesuai sprin kapolda",
                    onChange:e=>setMutData(prev=>({...prev,keterangan:e.target.value})),
                    style:{width:"100%"}
                })
            }),

            /* Riwayat Mutasi Terdahulu */
            mutHistory && mutHistory.length > 0 ? (0,a.jsxs)("div",{
                style:{marginTop:"0.4rem"},
                children:[
                    (0,a.jsx)("div",{style:{fontSize:"0.82rem",fontWeight:700,color:"#94a3b8",marginBottom:"0.35rem"},children:"Riwayat Mutasi Personil Terdahulu"}),
                    (0,a.jsx)("div",{
                        style:{maxHeight:"8.5rem",overflowY:"auto",border:"1px solid var(--cas-border, #e2e8f0)",borderRadius:"6px"},
                        children:(0,a.jsxs)("table",{
                            style:{width:"100%",borderCollapse:"collapse",fontSize:"0.75rem"},
                            children:[
                                (0,a.jsx)("thead",{
                                    style:{background:"var(--cas-bg-subtle, #f8fafc)",borderBottom:"1px solid var(--cas-border, #e2e8f0)"},
                                    children:(0,a.jsxs)("tr",{
                                        children:[
                                            (0,a.jsx)("th",{style:{padding:"0.4rem 0.5rem",textAlign:"left"},children:"Tgl Efektif"}),
                                            (0,a.jsx)("th",{style:{padding:"0.4rem 0.5rem",textAlign:"left"},children:"Dari Satker"}),
                                            (0,a.jsx)("th",{style:{padding:"0.4rem 0.5rem",textAlign:"left"},children:"Ke Satker"}),
                                            (0,a.jsx)("th",{style:{padding:"0.4rem 0.5rem",textAlign:"left"},children:"No. Surat"}),
                                            (0,a.jsx)("th",{style:{padding:"0.4rem 0.5rem",textAlign:"left"},children:"Dimutasi Oleh"})
                                        ]
                                    })
                                }),
                                (0,a.jsx)("tbody",{
                                    children:mutHistory.map((m,idx)=>(0,a.jsxs)("tr",{
                                        key:m.id||idx,
                                        style:{borderBottom:"1px solid var(--cas-border, #e2e8f0)"},
                                        children:[
                                            (0,a.jsx)("td",{style:{padding:"0.4rem 0.5rem"},children:m.tanggal_efektif ? new Date(m.tanggal_efektif).toLocaleDateString("id-ID") : "-"}),
                                            (0,a.jsx)("td",{style:{padding:"0.4rem 0.5rem",color:"#94a3b8"},children:m.from_satker_name || "-"}),
                                            (0,a.jsx)("td",{style:{padding:"0.4rem 0.5rem",fontWeight:600,color:"#38bdf8"},children:m.to_satker_name || "-"}),
                                            (0,a.jsx)("td",{style:{padding:"0.4rem 0.5rem"},children:m.nomor_surat || "-"}),
                                            (0,a.jsx)("td",{style:{padding:"0.4rem 0.5rem",color:"#94a3b8"},children:m.mutated_by_name || m.mutated_by || "-"})
                                        ]
                                    }))
                                })
                            ]
                        })
                    })
                ]
            }) : null
        ]
    })
}),(0,a.jsx)(d.Dialog,{
  header:"Pilih Satker Berjenjang",
  visible:showSatkerModal,
  onHide:()=>setShowSatkerModal(!1),
  style:{width:"34rem",maxWidth:"96vw"},
  contentStyle:{maxHeight:"78vh",overflowY:"auto"},
  modal:!0,
  footer:(0,a.jsxs)("div",{style:{display:"flex",justifyContent:"flex-end",gap:"0.5rem"},children:[
    (0,a.jsx)(o.Button,{label:"Batal",text:!0,onClick:()=>setShowSatkerModal(!1),disabled:satkerLoading}),
    (0,a.jsx)(o.Button,{label:"Terapkan Satker",icon:"pi pi-check",onClick:applySelectedSatker,disabled:satkerLevelSelected.length===0||satkerLoading})
  ]}),
  children:(0,a.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.85rem",padding:"0.2rem 0"},children:[
    (0,a.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.3rem"},children:[
      (0,a.jsx)("label",{style:{fontSize:"0.72rem",fontWeight:700,color:"#38bdf8",textTransform:"uppercase",letterSpacing:"0.5px"},children:"Pencarian Cepat Satker"}),
      (0,a.jsx)(l.InputText,{
        value:satkerSearchTerm,
        onChange:e=>onSatkerQuickSearch(e.target.value),
        placeholder:"Ketik nama Polda / Polres / Dit / Polsek (misal: Siber Aceh, Pidie, Renakta)...",
        style:{width:"100%",fontSize:"0.82rem"}
      }),
      satkerSearching&&(0,a.jsxs)("div",{style:{fontSize:"0.72rem",color:"#38bdf8",display:"flex",alignItems:"center",gap:"0.35rem",marginTop:"0.2rem"},children:[(0,a.jsx)("i",{className:"pi pi-spin pi-spinner"}),"Mencari satker..."]}),
      satkerSearchResults.length>0&&(0,a.jsx)("div",{style:{maxHeight:"140px",overflowY:"auto",background:"var(--cas-bg-surface, #ffffff)",border:"1px solid rgba(56,189,248,0.45)",boxShadow:"0 8px 24px rgba(15,23,42,0.15)",borderRadius:"6px",padding:"0.3rem",display:"flex",flexDirection:"column",gap:"0.25rem",marginTop:"0.2rem"},children:satkerSearchResults.map(res=>(0,a.jsxs)("div",{
        key:`search-res-${res.id}`,
        onClick:()=>onSelectSearchResult(res),
        style:{padding:"0.35rem 0.5rem",borderRadius:"4px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",gap:"0.5rem",background:"var(--cas-bg-subtle, #f8fafc)",transition:"background 0.15s"},
        children:[
          (0,a.jsxs)("div",{style:{minWidth:0},children:[
            (0,a.jsx)("div",{style:{fontSize:"0.8rem",fontWeight:600,color:"var(--cas-text-primary, #0f172a)"},children:res.deskripsi}),
            res.jalur&&(0,a.jsx)("div",{style:{fontSize:"0.68rem",color:"#94a3b8"},children:res.jalur})
          ]}),
          (0,a.jsx)("span",{style:{fontSize:"0.68rem",color:"#38bdf8",fontFamily:"monospace",flexShrink:0},children:res.kode||""})
        ]
      }))})
    ]}),
    (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem",margin:"0.1rem 0"},children:[
      (0,a.jsx)("div",{style:{flex:1,height:"1px",background:"var(--cas-border, #e2e8f0)"}}),
      (0,a.jsx)("span",{style:{fontSize:"0.66rem",color:"var(--cas-text-muted, #64748b)",fontWeight:700,letterSpacing:"0.5px"},children:"ATAU PILIH BERJENJANG"}),
      (0,a.jsx)("div",{style:{flex:1,height:"1px",background:"var(--cas-border, #e2e8f0)"}})
    ]}),
    satkerFetchError&&(0,a.jsx)("div",{style:{color:"#ef4444",fontSize:"0.78rem",background:"rgba(239,68,68,0.1)",padding:"0.4rem 0.6rem",borderRadius:6,border:"1px solid rgba(239,68,68,0.25)"},children:satkerFetchError}),
    satkerLoading&&(0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem",fontSize:"0.78rem",color:"#38bdf8"},children:[(0,a.jsx)("i",{className:"pi pi-spin pi-spinner"}),"Memuat daftar satuan kerja..."]}),
    satkerLevelOptions.map((opts,idx)=>{
      let lvlLabels=["Tingkat 1: Mabes / Polda","Tingkat 2: Direktorat / Satuan / Polres","Tingkat 3: Sub-satker / Polsek / Bagian","Tingkat 4: Sub-unit"];
      let curVal=satkerLevelSelected[idx]?.id!=null?String(satkerLevelSelected[idx].id):null;
      let mappedOpts=opts.map(item=>({...item,id:String(item.id)}));
      return (0,a.jsxs)("div",{key:`satker-lvl-${idx}`,style:{display:"flex",flexDirection:"column",gap:"0.25rem"},children:[
        (0,a.jsx)("label",{style:{fontSize:"0.75rem",fontWeight:600,color:"var(--cas-text-secondary, #334155)"},children:lvlLabels[idx]||lvlLabels[3]}),
        (0,a.jsx)(u.Dropdown,{
          value:curVal,
          onChange:e=>onSatkerLevelChange(idx,e.value),
          options:mappedOpts,
          optionLabel:"deskripsi",
          optionValue:"id",
          filter:!0,
          showClear:!0,
          appendTo:"self",
          placeholder:`— Pilih ${lvlLabels[idx]||"Satker"} —`,
          emptyMessage:"Tidak ada pilihan satuan kerja",
          style:{width:"100%"},
          itemTemplate:e=>(0,a.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",gap:"0.5rem",width:"100%"},children:[
            (0,a.jsx)("span",{children:e.deskripsi}),
            e.kode&&(0,a.jsx)("span",{style:{fontSize:"0.68rem",color:"#64748b",fontFamily:"monospace"},children:e.kode})
          ]})
        })
      ]});
    }),
    satkerLevelSelected.length>0&&(0,a.jsxs)("div",{style:{background:"rgba(37,99,235,0.08)",border:"1px solid rgba(59,130,246,0.25)",borderRadius:6,padding:"0.55rem 0.75rem",marginTop:"0.2rem"},children:[
      (0,a.jsx)("span",{style:{fontSize:"0.68rem",color:"#60a5fa",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px",display:"block",marginBottom:"0.25rem"},children:"Satker Terpilih (Jenjang Terakhir):"}),
      (0,a.jsx)("span",{style:{fontSize:"0.85rem",fontWeight:700,color:"var(--cas-text-primary, #0f172a)"},children:satkerLevelSelected[satkerLevelSelected.length-1].deskripsi}),
      (0,a.jsxs)("div",{style:{fontSize:"0.72rem",color:"#94a3b8",marginTop:"0.25rem"},children:["Jalur: POLRI ",satkerLevelSelected.map(s=>" > "+s.deskripsi).join("")]})
    ]})
  ]})
}),(0,a.jsx)(d.Dialog,{header:e9?"Edit Pengguna":"Tambah Pengguna",visible:j,onHide:()=>v(!1),style:{width:"52rem",maxWidth:"96vw"},footer:aj,modal:!0,children:(0,a.jsxs)("div",{className:"p-fluid",style:{display:"flex",flexDirection:"column",gap:"0.85rem"},children:[
    (0,a.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(23rem, 1fr))",gap:"1.25rem",alignItems:"start"},children:[
        // --- KOLOM KIRI: IDENTITAS & PENUGASAN ---
        (0,a.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.75rem",background:"var(--cas-bg-subtle, #f8fafc)",padding:"0.9rem",borderRadius:"10px",border:"1px solid var(--cas-border, #e2e8f0)"},children:[
            (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.45rem",borderBottom:"1px solid var(--cas-border, #e2e8f0)",paddingBottom:"0.4rem",marginBottom:"0.15rem"},children:[
                (0,a.jsx)("i",{className:"pi pi-id-card",style:{color:"#38bdf8",fontSize:"0.95rem"}}),
                (0,a.jsx)("span",{style:{fontWeight:700,fontSize:"0.8rem",color:"var(--cas-text-primary, #0f172a)",letterSpacing:"0.5px",textTransform:"uppercase"},children:"Identitas & Penugasan"})
            ]}),
            (0,a.jsx)(ee,{label:"Nama Lengkap",required:!0,children:(0,a.jsx)(l.InputText,{id:"user-form-name",name:"name",autoComplete:"name",value:es.name,onChange:e=>ak("name",e.target.value)})}),
            (0,a.jsx)(ee,{label:"NRP / NIP",required:!e9,hint:e9?void 0:"wajib diisi saat tambah pengguna",children:(0,a.jsx)(l.InputText,{id:"user-form-nrp",name:"nrp",autoComplete:"off",value:es.nrp,onChange:e=>ak("nrp",e.target.value)})}),
            (0,a.jsx)(ee,{label:"Role Akses",hint:ed.isOperator?"Pilih role Operator atau Viewer":void 0,children:(0,a.jsx)(u.Dropdown,{id:"user-form-role",inputId:"user-form-role-select",name:"role_bdb",value:es.role_bdb,options:ed.isSuperadmin?X:X.filter(e=>["operator","viewer"].includes(e.value)),onChange:e=>ak("role_bdb",e.value),disabled:!1})}),
            ae?(0,a.jsxs)(ee,{id:"fld-user-page-paginati-15",name:"field_user_page_paginati_15",label:"Satker Melekat",hint:ed.isOperator?"pilih satker sendiri atau subordinat regional":"pilih berjenjang",children:[
  (0,a.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.45rem",background:"var(--cas-bg-subtle, #f8fafc)",padding:"0.65rem 0.8rem",borderRadius:"8px",border:"1px solid var(--cas-border, #e2e8f0)"},children:[
    (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"0.5rem"},children:[
      (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.45rem",minWidth:0,flex:1},children:[
        (0,a.jsx)(P.Building2,{size:16,style:{color:"#38bdf8",flexShrink:0}}),
        (0,a.jsx)("div",{style:{fontSize:"0.84rem",fontWeight:600,color:es.scope_satker_name?"var(--cas-text-primary, #0f172a)":"#94a3b8",wordBreak:"break-word"},children:es.scope_satker_name||"— Belum Memilih Satker —"})
      ]}),
      (0,a.jsxs)("div",{style:{display:"flex",gap:"0.35rem",flexShrink:0},children:[
        (0,a.jsx)(o.Button,{type:"button",label:es.scope_satker_id?"Ubah Satker":"Pilih Satker Berjenjang",icon:"pi pi-sitemap",className:"p-button-sm p-button-outlined",onClick:()=>openSatkerPicker("user"),style:{fontSize:"0.75rem",padding:"0.3rem 0.6rem"}}),
        es.scope_satker_id&&(0,a.jsx)(o.Button,{type:"button",icon:"pi pi-times",className:"p-button-sm p-button-text p-button-danger",onClick:()=>er(a=>({...a,scope_satker_id:null,scope_satker_name:"",scope_satker_key:""})),tooltip:"Hapus Satker",style:{padding:"0.3rem"}})
      ]})
    ]}),
    es.scope_satker_key&&(0,a.jsxs)("div",{style:{fontSize:"0.72rem",color:"#64748b",fontFamily:"monospace"},children:["Kode: ",es.scope_satker_key]})
  ]})
]}):(0,a.jsx)("p",{style:{fontSize:"0.78rem",color:"vendor_mitra"===es.role_bdb?"#7c3aed":"#94a3b8",margin:0,fontWeight:"vendor_mitra"===es.role_bdb?600:400},children:"vendor_mitra"===es.role_bdb?"Vendor / Mitra: akses nasional Read-Only (tanpa satker melekat — dapat melihat seluruh menu & data nasional, namun tidak dapat mengubah/menghapus data).":"Superadmin: akses nasional (tanpa satker melekat)."})
        ]}),

        // --- KOLOM KANAN: KREDENSIAL & KEAMANAN ---
        (0,a.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.75rem",background:"var(--cas-bg-subtle, #f8fafc)",padding:"0.9rem",borderRadius:"10px",border:"1px solid var(--cas-border, #e2e8f0)"},children:[
            (0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.45rem",borderBottom:"1px solid var(--cas-border, #e2e8f0)",paddingBottom:"0.4rem",marginBottom:"0.15rem"},children:[
                (0,a.jsx)("i",{className:"pi pi-shield",style:{color:"#38bdf8",fontSize:"0.95rem"}}),
                (0,a.jsx)("span",{style:{fontWeight:700,fontSize:"0.8rem",color:"var(--cas-text-primary, #0f172a)",letterSpacing:"0.5px",textTransform:"uppercase"},children:"Kredensial & Akses"})
            ]}),
            (0,a.jsxs)(ee,{id:"fld-user-page-paginati-13",name:"field_user_page_paginati_13",label:"Email Dinas Polri (Utama)",required:!0,hint:"wajib @polri.go.id, login & OTP",children:[(0,a.jsx)(W.default,{id:"user-form-email-polri",name:"email_polri",autoComplete:"email",value:es.email_polri,onChange:e=>{ak("email_polri",e),el.onChangeDebounced("email_polri",e)},onBlur:e=>el.onBlurNow("email_polri",e),status:(es.username&&es.email_polri&&es.username.trim().toLowerCase()===es.email_polri.trim().toLowerCase())?"error":el.status.email_polri,placeholder:"nrp@polri.go.id atau nip@polri.go.id"}),(es.username&&es.email_polri&&es.username.trim().toLowerCase()===es.email_polri.trim().toLowerCase())?(0,a.jsx)("small",{className:"bdb-error",style:{color:"#ef4444",fontWeight:600},children:"Email Dinas Polri tidak boleh sama dengan Username!"}):el.message.email_polri&&(0,a.jsx)("small",{className:"bdb-error",children:el.message.email_polri})]}),
            (0,a.jsxs)(ee,{label:"Email Sekunder (Opsional)",hint:"bebas (mis. Gmail, Yahoo) - boleh dikosongkan",children:[(0,a.jsx)(W.default,{id:"user-form-email",name:"email",autoComplete:"email",value:es.email,onChange:e=>{ak("email",e),el.onChangeDebounced("email",e)},onBlur:e=>el.onBlurNow("email",e),status:el.status.email,placeholder:"mis. nama@gmail.com"}),el.message.email&&(0,a.jsx)("small",{className:"bdb-error",children:el.message.email})]}),
            (0,a.jsxs)(ee,{id:"fld-user-page-paginati-14",name:"field_user_page_paginati_14",label:"Username (Alternatif Login)",hint:"3-30 karakter huruf/angka/titik/underscore, tanpa @domain",children:[(0,a.jsx)(W.default,{id:"user-form-username",name:"username",autoComplete:"username",value:es.username,onChange:e=>{ak("username",e),el.onChangeDebounced("username",e)},onBlur:e=>el.onBlurNow("username",e),status:(es.username&&es.username.trim()&&((es.email_polri&&es.username.trim().toLowerCase()===es.email_polri.trim().toLowerCase())||!/^[a-z0-9_.]{3,30}$/i.test(es.username.trim())))?"error":el.status.username,placeholder:"Contoh: greacedaniel03120463 (tanpa @polri.go.id)"}),(es.username&&es.email_polri&&es.username.trim().toLowerCase()===es.email_polri.trim().toLowerCase())?(0,a.jsx)("small",{className:"bdb-error",style:{color:"#ef4444",fontWeight:600},children:"Username tidak boleh sama dengan Email Dinas Polri!"}):(es.username&&es.username.trim()&&es.username.includes("@"))?(0,a.jsx)("small",{className:"bdb-error",style:{color:"#ef4444",fontWeight:600},children:`Format salah: Username tidak boleh memakai @domain/email! Cukup ketik "${es.username.trim().split("@")[0].toLowerCase().replace(/[^a-z0-9_.]/g,"").slice(0,30)}" saja.`}):(es.username&&es.username.trim()&&!/^[a-z0-9_.]{3,30}$/i.test(es.username.trim()))?(0,a.jsx)("small",{className:"bdb-error",style:{color:"#ef4444",fontWeight:600},children:"Format salah: Gunakan 3-30 karakter huruf kecil, angka, titik (.), atau underscore (_) tanpa spasi."}):el.message.username&&(0,a.jsx)("small",{className:"bdb-error",children:el.message.username})]}),
            !e9&&(0,a.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.7rem"},children:[(0,a.jsx)(ee,{id:"fld-user-page-paginati-16",name:"field_user_page_paginati_16",label:"Password",children:(0,a.jsx)(m.Password,{id:"user-form-password",inputId:"user-form-password-input",name:"password",autoComplete:"new-password",value:es.password,onChange:e=>ak("password",e.target.value),feedback:!1,toggleMask:!0})}),(0,a.jsx)(ee,{id:"fld-user-page-paginati-17",name:"field_user_page_paginati_17",label:"Konfirmasi Password",children:(0,a.jsx)(m.Password,{id:"user-form-password-confirmation",inputId:"user-form-password-confirmation-input",name:"password_confirmation",autoComplete:"new-password",value:es.password_confirmation,onChange:e=>ak("password_confirmation",e.target.value),feedback:!1,toggleMask:!0})})]}),
            (0,a.jsxs)("div",{style:{display:"flex",gap:"1.25rem",marginTop:"0.4rem",background:"var(--cas-bg-subtle, #f8fafc)",padding:"0.55rem 0.75rem",borderRadius:"6px",border:"1px solid var(--cas-border, #e2e8f0)"},children:[
                (0,a.jsxs)("label",{htmlFor:"user-form-local-password-input",style:{display:"flex",alignItems:"center",gap:"0.4rem",fontSize:"0.82rem",cursor:"pointer"},children:[(0,a.jsx)(c.Checkbox,{id:"user-form-local-password",inputId:"user-form-local-password-input",name:"local_password_enabled",checked:es.local_password_enabled,onChange:e=>ak("local_password_enabled",!!e.checked)}),"Login password lokal"]}),
                (0,a.jsxs)("label",{htmlFor:"user-form-two-factor-input",style:{display:"flex",alignItems:"center",gap:"0.4rem",fontSize:"0.82rem",cursor:"pointer"},children:[(0,a.jsx)(c.Checkbox,{id:"user-form-two-factor",inputId:"user-form-two-factor-input",name:"two_factor_required",checked:es.two_factor_required,onChange:e=>ak("two_factor_required",!!e.checked)}),"Wajib 2FA"]})
            ]})
        ]})
    ]}),
    ed.isOperator&&!e9&&(0,a.jsx)("div",{style:{padding:"0.75rem 0.9rem",background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:8},children:(0,a.jsxs)("label",{htmlFor:"user-form-conscious-input",style:{display:"flex",alignItems:"flex-start",gap:"0.6rem",fontSize:"0.82rem",color:"#1e40af",cursor:"pointer"},children:[(0,a.jsx)(c.Checkbox,{id:"user-form-conscious",inputId:"user-form-conscious-input",checked:eConscious,onChange:e=>eConsciousSet(!!e.checked),style:{marginTop:"0.15rem"}}),(0,a.jsx)("span",{children:"Saya menyatakan secara sadar dan bertanggung jawab bahwa akun ini ditambahkan ke satuan kerja saya sendiri atau satuan kerja di bawah hirarki penugasan saya yang sah."})]})})
]})}),(0,a.jsx)(d.Dialog,{
    header:ed.isOperator ? "Ajukan Penonaktifan / Penghapusan Akun" : (
        eb?.approval_status === "REQUEST_DEACTIVATE" ? "Tinjau Permohonan Penonaktifan Akun" :
        eb?.approval_status === "REQUEST_DELETE" ? "Tinjau Permohonan Hapus Permanen" :
        eb?.approval_status?.startsWith("REQUEST_") ? "Tinjau Permohonan Akun Pengguna" :
        "Hapus Paksa Akun Pengguna"
    ),
    visible:!!eb,
    onHide:()=>eh(null),
    style:{width:"40rem",maxWidth:"96vw"},
    modal:!0,
    footer:eb && (0,a.jsxs)("div",{
        style:{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",gap:"0.5rem",flexWrap:"wrap"},
        children:[
            (0,a.jsx)(o.Button,{label:"Batal",text:!0,onClick:()=>eh(null),disabled:ey}),
            (0,a.jsxs)("div",{
                style:{display:"flex",alignItems:"center",gap:"0.5rem",flexWrap:"wrap"},
                children:[
                    ed.isOperator ? (0,a.jsx)(o.Button,{
                        label:"Kirim Permohonan",
                        icon:"pi pi-send",
                        severity:eDelType==="HAPUS"?"danger":"warning",
                        onClick:asOperatorRequest,
                        loading:ey,
                        disabled:!eDelReason.trim()
                    }) : (eb.approval_status?.startsWith("REQUEST_") ? (0,a.jsxs)(a.Fragment,{
                        children:[
                            (0,a.jsx)(o.Button,{label:"Tolak (Aktifkan)",severity:"secondary",onClick:()=>asSuperadminReview("REJECT"),loading:ey}),
                            (0,a.jsx)(o.Button,{
                                label:"Alihkan ke Mutasi",
                                icon:"pi pi-sync",
                                severity:"info",
                                onClick:()=>{
                                    let target = eb;
                                    eh(null);
                                    openMutateDialog(target);
                                }
                            }),
                            (0,a.jsx)(o.Button,{
                                label:eb.approval_status === "REQUEST_DELETE" ? "Setujui Hapus Permanen" : "Setujui Nonaktifkan",
                                severity:eb.approval_status === "REQUEST_DELETE" ? "danger" : "warning",
                                icon:eb.approval_status === "REQUEST_DELETE" ? "pi pi-trash" : "pi pi-power-off",
                                onClick:()=>asSuperadminReview(eb.approval_status === "REQUEST_DELETE" ? "APPROVE_DELETE" : "APPROVE_DEACTIVATE"),
                                loading:ey
                            })
                        ]
                    }) : (0,a.jsx)(o.Button,{
                        label:"Hapus Permanen",
                        icon:"pi pi-trash",
                        severity:"danger",
                        onClick:as,
                        loading:ey,
                        disabled:ef.trim().toLowerCase() !== (eb.email || "").trim().toLowerCase()
                    }))
                ]
            })
        ]
    }),
    children:eb && (0,a.jsxs)("div",{
        style:{display:"flex",flexDirection:"column",gap:"0.85rem"},
        children:[
            /* Render Personnel Mini Card */
            renderUserMiniCard(eb),

            /* Content based on Mode */
            ed.isOperator ? (0,a.jsxs)(a.Fragment,{
                children:[
                    (0,a.jsxs)("div",{
                        style:{
                            display:"flex",
                            gap:"0.6rem",
                            alignItems:"flex-start",
                            background:"rgba(239, 68, 68, 0.1)",
                            border:"1px solid rgba(239, 68, 68, 0.3)",
                            borderRadius:8,
                            padding:"0.75rem 0.9rem"
                        },
                        children:[
                            (0,a.jsx)(A.ShieldAlert,{size:20,style:{color:"#ef4444",flex:"0 0 auto",marginTop:"0.1rem"}}),
                            (0,a.jsxs)("div",{
                                style:{fontSize:"0.82rem",color:"#fca5a5",lineHeight:1.45},
                                children:[
                                    "Sebagai Operator, tindakan ini akan mengajukan permohonan ke Superadmin untuk akun ",
                                    (0,a.jsx)("strong",{style:{color:"var(--cas-text-primary, #0f172a)"},children:eb.name}),
                                    ". ",
                                    (0,a.jsx)("strong",{style:{color:"var(--cas-text-primary, #0f172a)"},children:"Akun akan langsung dibekukan (nonaktif) sementara"}),
                                    " demi keamanan."
                                ]
                            })
                        ]
                    }),
                    (0,a.jsx)(ee,{
                        label:"Jenis Permohonan",
                        children:(0,a.jsx)(u.Dropdown,{
                            value:eDelType,
                            options:[
                                {label:"Ajukan Penonaktifan Akun (Disarankan jika mutasi luar reskrim, cuti, dinas lain)",value:"NONAKTIF"},
                                {label:"Ajukan Penghapusan Permanen (Hanya jika salah buat akun / duplikat)",value:"HAPUS"}
                            ],
                            onChange:e=>eDelTypeSet(e.value),
                            style:{width:"100%"}
                        })
                    }),
                    (0,a.jsx)(ee,{
                        label:"Alasan / Keterangan Pengajuan (wajib) *",
                        children:(0,a.jsx)(n.InputTextarea,{
                            value:eDelReason,
                            onChange:e=>eDelReasonSet(e.target.value),
                            rows:3,
                            style:{width:"100%"},
                            placeholder:"Tuliskan alasan lengkap, misal: personil mutasi dinas keluar jajaran Reserse, pensiun, dsb.",
                            autoFocus:!0
                        })
                    }),
                    eDelReason.toLowerCase().includes("mutasi") ? (0,a.jsxs)("div",{
                        style:{
                            background:"rgba(2, 132, 199, 0.12)",
                            border:"1px solid rgba(56, 189, 248, 0.35)",
                            borderRadius:8,
                            padding:"0.65rem 0.85rem",
                            fontSize:"0.78rem",
                            color:"#38bdf8",
                            display:"flex",
                            flexDirection:"column",
                            gap:"0.35rem"
                        },
                        children:[
                            (0,a.jsx)("div",{style:{fontWeight:700},children:"💡 Terdeteksi Alasan Mutasi Penugasan"}),
                            (0,a.jsx)("div",{children:"Jika personil berpindah satker atau keluar fungsi Reskrim, disarankan menggunakan fitur Mutasi Satker agar historical LP personil tetap aman dan akun tidak terhapus."}),
                            (0,a.jsx)(o.Button,{
                                label:"Beralih ke Form Mutasi Satker",
                                icon:"pi pi-sync",
                                size:"small",
                                severity:"info",
                                style:{alignSelf:"flex-start"},
                                onClick:()=>{
                                    let target = eb;
                                    eh(null);
                                    openMutateDialog(target);
                                }
                            })
                        ]
                    }) : null
                ]
            }) : (eb.approval_status === "REQUEST_DEACTIVATE" ? (0,a.jsxs)(a.Fragment,{
                children:[
                    (0,a.jsxs)("div",{
                        style:{
                            display:"flex",
                            gap:"0.6rem",
                            alignItems:"flex-start",
                            background:"rgba(245, 158, 11, 0.12)",
                            border:"1px solid rgba(245, 158, 11, 0.35)",
                            borderRadius:8,
                            padding:"0.75rem 0.9rem"
                        },
                        children:[
                            (0,a.jsx)("i",{className:"pi pi-power-off",style:{fontSize:"1.1rem",color:"#f59e0b",flex:"0 0 auto",marginTop:"0.15rem"}}),
                            (0,a.jsxs)("div",{
                                style:{fontSize:"0.82rem",color:"#fef3c7",lineHeight:1.45},
                                children:[
                                    "Operator telah mengajukan permohonan ",
                                    (0,a.jsx)("strong",{style:{color:"#fbbf24"},children:"PENONAKTIFAN AKUN"}),
                                    " untuk ",
                                    (0,a.jsx)("strong",{style:{color:"var(--cas-text-primary, #0f172a)"},children:eb.name}),
                                    ". Akun telah dibekukan sementara menunggu persetujuan Anda."
                                ]
                            })
                        ]
                    }),
                    (0,a.jsxs)("div",{
                        style:{
                            padding:"0.75rem 0.9rem",
                            background:"var(--cas-bg-subtle, #f8fafc)",
                            borderRadius:8,
                            border:"1px solid var(--cas-border, #e2e8f0)",
                            fontSize:"0.82rem"
                        },
                        children:[
                            (0,a.jsxs)("div",{
                                style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.35rem"},
                                children:[
                                    (0,a.jsx)("div",{style:{fontWeight:700,color:"var(--cas-text-primary, #0f172a)"},children:"Catatan / Alasan dari Pengaju:"}),
                                    eb.deactivated_at ? (0,a.jsxs)("div",{style:{fontSize:"0.74rem",color:"#94a3b8",display:"inline-flex",alignItems:"center",gap:"0.25rem"},children:[(0,a.jsx)("i",{className:"pi pi-calendar",style:{fontSize:"0.7rem"}}),formatIndoDateStr(eb.deactivated_at)]}) : null
                                ]
                            }),
                            (0,a.jsx)("div",{
                                style:{
                                    color:"var(--cas-text, #f8fafc)",
                                    background:"rgba(0, 0, 0, 0.15)",
                                    borderLeft:"3px solid #f59e0b",
                                    padding:"0.5rem 0.75rem",
                                    borderRadius:"0 6px 6px 0",
                                    lineHeight:1.5,
                                    whiteSpace:"pre-wrap"
                                },
                                children:eb.deactivation_reason || "Tidak ada keterangan tertulis."
                            }),
                            (0,a.jsxs)("div",{
                                style:{
                                    marginTop:"0.65rem",
                                    padding:"0.65rem 0.85rem",
                                    background:"rgba(2, 132, 199, 0.1)",
                                    borderRadius:8,
                                    border:"1px solid rgba(56, 189, 248, 0.3)",
                                    display:"flex",
                                    flexDirection:"column",
                                    gap:"0.45rem"
                                },
                                children:[
                                    (0,a.jsxs)("div",{
                                        style:{fontSize:"0.78rem",color:"#38bdf8",lineHeight:1.45},
                                        children:[
                                            (0,a.jsx)("strong",{children:"💡 Opsi Alihkan ke Mutasi: "}),
                                            "Jika personil ini pindah tugas atau mutasi kesatuan kerja, alihkan langsung ke proses Mutasi Satker agar data usulan terisi otomatis dan historical LP tetap terjaga."
                                        ]
                                    }),
                                    (0,a.jsx)(o.Button,{
                                        label:"Alihkan ke Form Mutasi Satker",
                                        icon:"pi pi-sync",
                                        size:"small",
                                        severity:"info",
                                        style:{alignSelf:"flex-start",whiteSpace:"nowrap"},
                                        onClick:()=>{
                                            let target = eb;
                                            eh(null);
                                            openMutateDialog(target);
                                        }
                                    })
                                ]
                            })
                        ]
                    })
                ]
            }) : (eb.approval_status === "REQUEST_DELETE" ? (0,a.jsxs)(a.Fragment,{
                children:[
                    (0,a.jsxs)("div",{
                        style:{
                            display:"flex",
                            gap:"0.6rem",
                            alignItems:"flex-start",
                            background:"rgba(239, 68, 68, 0.12)",
                            border:"1px solid rgba(239, 68, 68, 0.4)",
                            borderRadius:8,
                            padding:"0.75rem 0.9rem"
                        },
                        children:[
                            (0,a.jsx)(A.ShieldAlert,{size:22,style:{color:"#ef4444",flex:"0 0 auto",marginTop:"0.1rem"}}),
                            (0,a.jsxs)("div",{
                                style:{fontSize:"0.82rem",color:"#fca5a5",lineHeight:1.45},
                                children:[
                                    "Operator telah mengajukan ",
                                    (0,a.jsx)("strong",{style:{color:"#ef4444"},children:"PENGHAPUSAN PERMANEN"}),
                                    " untuk akun ",
                                    (0,a.jsx)("strong",{style:{color:"var(--cas-text-primary, #0f172a)"},children:eb.name}),
                                    ". Jika disetujui, akun ini akan dihapus permanen dari sistem dan seluruh datanya tidak dapat dikembalikan."
                                ]
                            })
                        ]
                    }),
                    (0,a.jsxs)("div",{
                        style:{
                            padding:"0.75rem 0.9rem",
                            background:"var(--cas-bg-subtle, #f8fafc)",
                            borderRadius:8,
                            border:"1px solid var(--cas-border, #e2e8f0)",
                            fontSize:"0.82rem"
                        },
                        children:[
                            (0,a.jsxs)("div",{
                                style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.35rem"},
                                children:[
                                    (0,a.jsx)("div",{style:{fontWeight:700,color:"var(--cas-text-primary, #0f172a)"},children:"Alasan Pengajuan Hapus:"}),
                                    eb.deactivated_at ? (0,a.jsxs)("div",{style:{fontSize:"0.74rem",color:"#94a3b8",display:"inline-flex",alignItems:"center",gap:"0.25rem"},children:[(0,a.jsx)("i",{className:"pi pi-calendar",style:{fontSize:"0.7rem"}}),formatIndoDateStr(eb.deactivated_at)]}) : null
                                ]
                            }),
                            (0,a.jsx)("div",{
                                style:{
                                    color:"var(--cas-text, #f8fafc)",
                                    background:"rgba(0, 0, 0, 0.15)",
                                    borderLeft:"3px solid #ef4444",
                                    padding:"0.5rem 0.75rem",
                                    borderRadius:"0 6px 6px 0",
                                    lineHeight:1.5,
                                    whiteSpace:"pre-wrap"
                                },
                                children:eb.deactivation_reason || "Tidak ada keterangan tertulis."
                            }),
                            (0,a.jsxs)("div",{
                                style:{
                                    marginTop:"0.65rem",
                                    padding:"0.65rem 0.85rem",
                                    background:"rgba(2, 132, 199, 0.1)",
                                    borderRadius:8,
                                    border:"1px solid rgba(56, 189, 248, 0.3)",
                                    display:"flex",
                                    flexDirection:"column",
                                    gap:"0.45rem"
                                },
                                children:[
                                    (0,a.jsxs)("div",{
                                        style:{fontSize:"0.78rem",color:"#38bdf8",lineHeight:1.45},
                                        children:[
                                            (0,a.jsx)("strong",{children:"💡 Alasan Terkait Mutasi / Alih Tugas? "}),
                                            "Jika personil hanya pindah dinas atau rotasi, jangan dihapus permanen! Alihkan ke Mutasi Satker agar arsip LP personil tetap aman."
                                        ]
                                    }),
                                    (0,a.jsx)(o.Button,{
                                        label:"Alihkan ke Form Mutasi Satker",
                                        icon:"pi pi-sync",
                                        size:"small",
                                        severity:"info",
                                        style:{alignSelf:"flex-start",whiteSpace:"nowrap"},
                                        onClick:()=>{
                                            let target = eb;
                                            eh(null);
                                            openMutateDialog(target);
                                        }
                                    })
                                ]
                            })
                        ]
                    })
                ]
            }) : (0,a.jsxs)(a.Fragment,{
                children:[
                    (0,a.jsxs)("div",{
                        style:{
                            display:"flex",
                            gap:"0.6rem",
                            alignItems:"flex-start",
                            background:"rgba(239, 68, 68, 0.12)",
                            border:"1px solid rgba(239, 68, 68, 0.35)",
                            borderRadius:8,
                            padding:"0.75rem 0.9rem"
                        },
                        children:[
                            (0,a.jsx)(A.ShieldAlert,{size:20,style:{color:"#ef4444",flex:"0 0 auto",marginTop:"0.1rem"}}),
                            (0,a.jsxs)("div",{
                                style:{fontSize:"0.82rem",color:"#fca5a5"},
                                children:[
                                    "Akun ",
                                    (0,a.jsx)("strong",{style:{color:"var(--cas-text-primary, #0f172a)"},children:eb.name}),
                                    " (",
                                    eb.email,
                                    ") akan ",
                                    (0,a.jsx)("strong",{style:{color:"var(--cas-text-primary, #0f172a)"},children:"dihapus permanen"}),
                                    " dari database sistem. Tindakan ini tidak dapat dibatalkan atau dipulihkan."
                                ]
                            })
                        ]
                    }),
                    (0,a.jsx)(ee,{
                        label:("Ketik email akun untuk konfirmasi: " + eb.email),
                        children:(0,a.jsx)(l.InputText,{
                            id:"user-edit-email",
                            name:"edit_email",
                            value:ef,
                            onChange:e=>ek(e.target.value),
                            style:{width:"100%"},
                            placeholder:eb.email,
                            autoFocus:!0
                        })
                    })
                ]
            })))
        ]
    })
}),(0,a.jsx)(d.Dialog,{header:"Impersonate — Masuk Sebagai User Lain",visible:!!ej,onHide:()=>ev(null),style:{width:"32rem",maxWidth:"96vw"},modal:!0,footer:(0,a.jsxs)("div",{children:[(0,a.jsx)(o.Button,{label:"Batal",text:!0,onClick:()=>ev(null),disabled:eS}),(0,a.jsx)(o.Button,{label:"Masuk Sebagai User Ini",icon:"pi pi-sign-in",onClick:ai,loading:eS,disabled:10>ar(ew)})]}),children:ej&&(0,a.jsxs)("div",{style:{display:"grid",gap:"0.75rem"},children:[(0,a.jsxs)("div",{style:{display:"flex",gap:"0.6rem",alignItems:"flex-start",background:"#f5f3ff",border:"1px solid #ddd6fe",borderRadius:8,padding:"0.7rem 0.9rem"},children:[(0,a.jsx)(A.ShieldAlert,{size:20,style:{color:"#7c3aed",flex:"0 0 auto",marginTop:"0.1rem"}}),(0,a.jsxs)("div",{style:{fontSize:"0.82rem",color:"#5b21b6"},children:["Anda akan masuk sebagai ",(0,a.jsx)("strong",{children:ej.name})," (",ej.email,", role ",(0,a.jsx)("strong",{children:ej.role_bdb}),") tanpa perlu password akun itu. Sesi impersonate berlaku 30 menit dan tercatat penuh di log audit. Sesi superadmin Anda tersimpan — bisa kembali kapan saja lewat banner di atas layar."]})]}),(0,a.jsx)(ee,{label:`Keterangan / alasan impersonate (wajib, minimal 10 kata — saat ini ${ar(ew)} kata)`,children:(0,a.jsx)(n.InputTextarea,{id:"user-impersonate-reason",name:"reason",value:ew,onChange:e=>e_(e.target.value),rows:3,style:{width:"100%"},placeholder:"mis. menyelidiki laporan operator bahwa menu Rekap LP tidak menampilkan data satkernya, perlu dicek langsung dari sudut pandang akun operator tersebut",autoFocus:!0})})]})}),(0,a.jsxs)(d.Dialog,{header:"Import Massal Pengguna",visible:eP,onHide:at,style:{width:"upload"===eA?"32rem":"52rem",maxWidth:"96vw"},modal:!0,footer:"upload"===eA?(0,a.jsx)("div",{children:(0,a.jsx)(o.Button,{label:"Tutup",text:!0,onClick:at,disabled:eE})}):"review"===eA?(0,a.jsxs)("div",{children:[(0,a.jsx)(o.Button,{label:"Pilih Ulang File",text:!0,onClick:()=>{eR("upload"),eI(null),eM([])},disabled:e$}),(0,a.jsx)(o.Button,{label:`Import Sekarang (${ao})`,icon:"pi pi-check",onClick:ad,loading:e$,disabled:0===ao})]}):(0,a.jsx)("div",{children:(0,a.jsx)(o.Button,{label:"Selesai",onClick:at})}),children:["upload"===eA&&(0,a.jsxs)("div",{style:{display:"grid",gap:"1rem"},children:[(0,a.jsxs)("div",{style:{display:"flex",gap:"0.6rem",alignItems:"flex-start",background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:8,padding:"0.7rem 0.9rem"},children:[(0,a.jsx)(z.FileSpreadsheet,{size:20,style:{color:"#2563eb",flex:"0 0 auto",marginTop:"0.1rem"}}),(0,a.jsxs)("div",{style:{fontSize:"0.82rem",color:"#1e3a8a"},children:["Unduh template Excel, isi data pengguna (Nama, Email, Role, Satker, dst — kolom Role/Status sudah ada dropdown pilihan). Tidak perlu hafal kode satker: buka sheet ",(0,a.jsx)("b",{children:'"Daftar Satker"'})," di file yang sama, cari nama Polda/Polres/Polsek/Satuan-nya, lalu copy kode-nya ke kolom Satker. Lalu unggah kembali di sini — setiap baris akan divalidasi dulu sebelum benar-benar dibuat. Password akun dibuat otomatis dan hanya ditampilkan sekali setelah proses import selesai."]})]}),(0,a.jsx)(o.Button,{label:"Unduh Template Excel",icon:(0,a.jsx)(I.Download,{size:15,style:{marginRight:"0.4rem"}}),outlined:!0,onClick:al,loading:ez}),(0,a.jsxs)("div",{children:[(0,a.jsx)("label",{style:{display:"block",marginBottom:"0.4rem",fontSize:"0.8rem",fontWeight:700,color:"#334155"},children:"Unggah File Excel Terisi"}),(0,a.jsx)("input",{id:"user-import-file",name:"import_file",ref:eF,type:"file",accept:".xlsx",style:{display:"none"},onChange:e=>{var a;eI(a=e.target.files?.[0]||null),eF.current&&(eF.current.value=""),a&&an(a)}}),eB?(0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem",fontSize:"0.82rem",background:"#f8fafc",borderRadius:8,padding:"0.5rem 0.7rem"},children:[(0,a.jsx)(O.FileText,{size:15,style:{color:"#2563eb",flex:"0 0 auto"}}),(0,a.jsxs)("span",{style:{flex:1,wordBreak:"break-all"},children:[eB.name," ",(0,a.jsxs)("span",{style:{color:"#94a3b8"},children:["(",function(e){if(!e)return"—";let a=e/1048576;return a>=1?`${a.toFixed(1)} MB`:`${Math.max(1,Math.round(e/1024))} KB`}(eB.size),")"]})]}),eE&&(0,a.jsx)("span",{style:{fontSize:"0.75rem",color:"#2563eb"},children:"Memvalidasi…"})]}):(0,a.jsxs)("button",{type:"button",className:"att-btn",onClick:()=>eF.current?.click(),disabled:eE,style:{display:"inline-flex",alignItems:"center",gap:"0.4rem"},children:[(0,a.jsx)(B.Upload,{size:15})," Pilih File Excel (.xlsx)"]})]})]}),"review"===eA&&(0,a.jsxs)("div",{style:{display:"grid",gap:"0.75rem"},children:[(0,a.jsxs)("div",{style:{display:"flex",gap:"0.75rem",flexWrap:"wrap"},children:[(0,a.jsx)(t.Tag,{severity:"success",value:`${ao} baris valid`}),(0,a.jsx)(t.Tag,{severity:"danger",value:`${eD.length-ao} baris bermasalah`}),(0,a.jsx)(t.Tag,{severity:"info",value:`${eD.length} total baris`})]}),(0,a.jsxs)(r.DataTable,{value:eD,size:"small",scrollable:!0,scrollHeight:"24rem",emptyMessage:"Tidak ada baris terbaca dari file.",stripedRows:!0,children:[(0,a.jsx)(i.Column,{field:"row",header:"Baris",style:{width:"4rem"}}),(0,a.jsx)(i.Column,{header:"Status",style:{width:"6rem"},body:e=>e.ok?(0,a.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.3rem",color:"#16a34a",fontSize:"0.8rem",fontWeight:700},children:[(0,a.jsx)(E.CheckCircle2,{size:14})," Valid"]}):(0,a.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.3rem",color:"#dc2626",fontSize:"0.8rem",fontWeight:700},children:[(0,a.jsx)(N.XCircle,{size:14})," Error"]})}),(0,a.jsx)(i.Column,{field:"name",header:"Nama"}),(0,a.jsx)(i.Column,{field:"email",header:"Email"}),(0,a.jsx)(i.Column,{header:"Role",body:e=>e.role_bdb||"-"}),(0,a.jsx)(i.Column,{header:"Satker",body:e=>e.scope_satker_name||"—"}),(0,a.jsx)(i.Column,{header:"Keterangan",body:e=>e.ok?(0,a.jsx)("span",{style:{color:"#94a3b8"},children:"—"}):(0,a.jsx)("span",{style:{color:"#dc2626"},children:e.message})})]})]}),"result"===eA&&(0,a.jsxs)("div",{style:{display:"grid",gap:"0.75rem"},children:[(0,a.jsxs)("div",{style:{display:"flex",gap:"0.6rem",alignItems:"flex-start",background:"#fffbeb",border:"1px solid #fde68a",borderRadius:8,padding:"0.7rem 0.9rem"},children:[(0,a.jsx)(M.AlertTriangle,{size:20,style:{color:"#d97706",flex:"0 0 auto",marginTop:"0.1rem"}}),(0,a.jsxs)("div",{style:{fontSize:"0.82rem",color:"#92400e"},children:["Password akun baru hanya ditampilkan ",(0,a.jsx)("strong",{children:"satu kali"})," di bawah ini. Segera unduh atau salin dan sampaikan ke masing-masing pengguna sebelum menutup dialog ini."]})]}),(0,a.jsx)(o.Button,{label:"Unduh CSV Email + Password",icon:(0,a.jsx)(D.KeyRound,{size:15,style:{marginRight:"0.4rem"}}),outlined:!0,onClick:function(){let e=eU.filter(e=>e.ok&&e.password);if(0===e.length)return;let a=new Blob(["Email,Password\n"+e.map(e=>`${e.email},${e.password}`).join("\n")],{type:"text/csv;charset=utf-8;"}),s=URL.createObjectURL(a),r=document.createElement("a");r.href=s,r.download=`password-akun-baru-${Date.now()}.csv`,r.click(),URL.revokeObjectURL(s)},disabled:0===eU.filter(e=>e.ok).length}),(0,a.jsxs)(r.DataTable,{value:eU,size:"small",scrollable:!0,scrollHeight:"22rem",stripedRows:!0,children:[(0,a.jsx)(i.Column,{field:"row",header:"Baris",style:{width:"4rem"}}),(0,a.jsx)(i.Column,{header:"Status",style:{width:"6rem"},body:e=>e.ok?(0,a.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.3rem",color:"#16a34a",fontSize:"0.8rem",fontWeight:700},children:[(0,a.jsx)(E.CheckCircle2,{size:14})," Berhasil"]}):(0,a.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.3rem",color:"#dc2626",fontSize:"0.8rem",fontWeight:700},children:[(0,a.jsx)(N.XCircle,{size:14})," Gagal"]})}),(0,a.jsx)(i.Column,{field:"email",header:"Email"}),(0,a.jsx)(i.Column,{header:"Password",body:e=>e.password?(0,a.jsx)("code",{style:{fontSize:"0.82rem",background:"#f1f5f9",padding:"0.15rem 0.4rem",borderRadius:4},children:e.password}):(0,a.jsx)("span",{style:{color:"#94a3b8"},children:"—"})}),(0,a.jsx)(i.Column,{header:"Keterangan",body:e=>e.ok?(0,a.jsx)("span",{style:{color:"#94a3b8"},children:"—"}):(0,a.jsx)("span",{style:{color:"#dc2626"},children:e.message})})]})]})]}),(0,a.jsxs)(d.Dialog,{header:"Reset Password Massal + Kirim Email",visible:eH,onHide:ah,style:{width:"done"===eq?"46rem":"32rem",maxWidth:"96vw"},modal:!0,closable:"loading"!==eq,footer:"confirm"===eq?(0,a.jsxs)("div",{children:[(0,a.jsx)(o.Button,{label:"Batal",text:!0,onClick:ah}),(0,a.jsx)(o.Button,{label:"Mulai Proses",severity:"danger",icon:"pi pi-send",onClick:af,loading:e0,disabled:eQ.trim()!==Z})]}):"progress"===eq?(0,a.jsx)("div",{children:(0,a.jsx)(o.Button,{label:"Tutup (proses tetap lanjut di server)",text:!0,onClick:ah})}):"done"===eq?(0,a.jsx)("div",{children:(0,a.jsx)(o.Button,{label:"Tutup",onClick:ah})}):void 0,children:["loading"===eq&&(0,a.jsx)("p",{style:{fontSize:"0.85rem",color:"#64748b"},children:"Memuat status…"}),"confirm"===eq&&(0,a.jsxs)("div",{style:{display:"grid",gap:"1rem"},children:[(0,a.jsxs)("div",{style:{display:"flex",gap:"0.6rem",alignItems:"flex-start",background:"#fef2f2",border:"1px solid #fecaca",borderRadius:8,padding:"0.7rem 0.9rem"},children:[(0,a.jsx)(A.ShieldAlert,{size:20,style:{color:"#dc2626",flex:"0 0 auto",marginTop:"0.1rem"}}),(0,a.jsxs)("div",{style:{fontSize:"0.82rem",color:"#991b1b"},children:["Ini akan me-reset password ",(0,a.jsxs)("strong",{children:[eX," akun"]})," (semua role selain superadmin, tak termasuk akun Anda) menjadi password acak baru, lalu mengirimkannya via email ke masing-masing akun. Password lama mereka ",(0,a.jsx)("strong",{children:"langsung tidak berlaku"}),". Tidak bisa dibatalkan setelah dimulai, dan berjalan di latar belakang server (bisa makan waktu cukup lama untuk ",eX," email)."]})]}),(0,a.jsx)(ee,{label:`Ketik "${Z}" untuk konfirmasi`,children:(0,a.jsx)(l.InputText,{id:"user-confirm-input",name:"confirm_input",value:eQ,onChange:e=>eZ(e.target.value),placeholder:Z,autoFocus:!0})})]}),("progress"===eq||"done"===eq)&&e5&&(0,a.jsxs)("div",{style:{display:"grid",gap:"0.9rem"},children:["progress"===eq&&(0,a.jsx)("div",{style:{display:"flex",gap:"0.6rem",alignItems:"center",background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:8,padding:"0.6rem 0.9rem",fontSize:"0.82rem",color:"#1e3a8a"},children:"Sedang berjalan… halaman ini boleh ditutup, proses tetap lanjut di server. Status diperbarui otomatis tiap 4 detik."}),"done"===eq&&(0,a.jsxs)("div",{style:{display:"flex",gap:"0.6rem",alignItems:"center",background:"completed"===e5.status?"#f0fdf4":"#fef2f2",border:`1px solid ${"completed"===e5.status?"#bbf7d0":"#fecaca"}`,borderRadius:8,padding:"0.6rem 0.9rem",fontSize:"0.82rem",color:"completed"===e5.status?"#166534":"#991b1b"},children:["completed"===e5.status?(0,a.jsx)(E.CheckCircle2,{size:18}):(0,a.jsx)(N.XCircle,{size:18}),"completed"===e5.status?"Proses selesai.":`Proses berhenti karena error: ${e5.last_error||"tidak diketahui"}`]}),(0,a.jsx)(w,{id:"fld-user-page-paginati-18",name:"field_user_page_paginati_18",value:e5.total?Math.round(e5.done/e5.total*100):0}),(0,a.jsxs)("div",{style:{display:"flex",gap:"0.75rem",flexWrap:"wrap"},children:[(0,a.jsx)(t.Tag,{value:`${e5.done}/${e5.total} diproses`}),(0,a.jsx)(t.Tag,{severity:"success",value:`${e5.success} berhasil`}),(0,a.jsx)(t.Tag,{severity:"danger",value:`${e5.failed} gagal`})]}),"done"===eq&&e5.failed>0&&(0,a.jsxs)("div",{children:[(0,a.jsxs)("label",{style:{display:"block",marginBottom:"0.4rem",fontSize:"0.8rem",fontWeight:700,color:"#334155"},children:["Baris Gagal (",e5.failed,")"]}),(0,a.jsxs)(r.DataTable,{value:e2,size:"small",loading:e6,scrollable:!0,scrollHeight:"16rem",stripedRows:!0,emptyMessage:"Tidak ada.",children:[(0,a.jsx)(i.Column,{field:"user_id",header:"ID User",style:{width:"6rem"}}),(0,a.jsx)(i.Column,{field:"email",header:"Email"}),(0,a.jsx)(i.Column,{field:"message",header:"Keterangan"})]})]})]})]})]})}],98769)}]);