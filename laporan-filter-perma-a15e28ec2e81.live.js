(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,72382,e=>{"use strict";let t=(0,e.i(56420).default)("eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);e.s(["Eye",0,t],72382)},45184,e=>{"use strict";var t=e.i(43476),n=e.i(68242);e.s(["ALL_ROWS_CLIENT",0,1e6,"ALL_ROWS_LAZY",0,1e3,"DEFAULT_PAGINATOR_LAYOUT",0,"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown","rowsPerPageTemplate",0,function(e,a=1e3){let r=[...e.map(e=>({label:String(e),value:e})),{label:"Semua",value:a}];return e=>(0,t.jsx)(n.Dropdown,{id:"rpp-dropdown",inputId:"rpp-select",name:"rowsPerPage",value:e.value,options:r,onChange:e.onChange})}])},89269,e=>{"use strict";var t=e.i(71645),n=e.i(48264),a=e.i(43456),r=e.i(29168),l=e.i(83128),i=e.i(40623),o=e.i(73193);function s(){return(s=Object.assign.bind()).apply(null,arguments)}function u(e){return(u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}var c=a.ComponentBase.extend({defaultProps:{__TYPE:"InputTextarea",__parentMetadata:null,autoResize:!1,invalid:!1,variant:null,keyfilter:null,onBlur:null,onFocus:null,onBeforeInput:null,onInput:null,onKeyDown:null,onKeyUp:null,onPaste:null,tooltip:null,tooltipOptions:null,validateOnly:!1,children:void 0,className:null},css:{classes:{root:function(e){var t=e.props,n=e.context,a=e.isFilled;return(0,o.classNames)("p-inputtextarea p-inputtext p-component",{"p-disabled":t.disabled,"p-filled":a,"p-inputtextarea-resizable":t.autoResize,"p-invalid":t.invalid,"p-variant-filled":t.variant?"filled"===t.variant:n&&"filled"===n.inputStyle})}},styles:"\n@layer primereact {\n    .p-inputtextarea-resizable {\n        overflow: hidden;\n        resize: none;\n    }\n    \n    .p-fluid .p-inputtextarea {\n        width: 100%;\n    }\n}\n"}});function d(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,a)}return n}function p(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?d(Object(n),!0).forEach(function(t){!function(e,t,n){var a;(a=function(e,t){if("object"!=u(e)||!e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var a=n.call(e,t||"default");if("object"!=u(a))return a;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(t,"string"),(t="symbol"==u(a)?a:a+"")in e)?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n}(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):d(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}var m=t.memo(t.forwardRef(function(e,u){var d=(0,r.useMergeProps)(),m=t.useContext(n.PrimeReactContext),f=c.getProps(e,m),g=t.useRef(u),y=t.useRef(0),h=c.setMetaData(p(p({props:f},f.__parentMetadata),{},{context:{disabled:f.disabled}})),b=h.ptm,v=h.cx,x=h.isUnstyled;(0,a.useHandleStyle)(c.css.styles,x,{name:"inputtextarea"});var j=function(e){var t=g.current;t&&k()&&(y.current||(y.current=t.scrollHeight,t.style.overflow="hidden"),(y.current!==t.scrollHeight||e)&&(t.style.height="",t.style.height=t.scrollHeight+"px",parseFloat(t.style.height)>=parseFloat(t.style.maxHeight)?(t.style.overflowY="scroll",t.style.height=t.style.maxHeight):t.style.overflow="hidden",y.current=t.scrollHeight))},k=function(){if(o.DomHandler.isVisible(g.current)){var e=g.current.getBoundingClientRect();return e.width>0&&e.height>0}return!1};t.useEffect(function(){o.ObjectUtils.combinedRefs(g,u)},[g,u]),t.useEffect(function(){f.autoResize&&j(!0)},[f.autoResize,f.value]);var S=t.useMemo(function(){return o.ObjectUtils.isNotEmpty(f.value)||o.ObjectUtils.isNotEmpty(f.defaultValue)},[f.value,f.defaultValue]),w=o.ObjectUtils.isNotEmpty(f.tooltip),P=d({ref:g,className:(0,o.classNames)(f.className,v("root",{context:m,isFilled:S})),autoComplete:f.autoComplete,onFocus:function(e){f.autoResize&&j(),f.onFocus&&f.onFocus(e)},onBlur:function(e){f.autoResize&&j(),f.onBlur&&f.onBlur(e)},onKeyUp:function(e){f.autoResize&&j(),f.onKeyUp&&f.onKeyUp(e)},onKeyDown:function(e){f.onKeyDown&&f.onKeyDown(e),f.keyfilter&&l.KeyFilter.onKeyPress(e,f.keyfilter,f.validateOnly)},onBeforeInput:function(e){f.onBeforeInput&&f.onBeforeInput(e),f.keyfilter&&l.KeyFilter.onBeforeInput(e,f.keyfilter,f.validateOnly)},onInput:function(e){var t=e.target;f.autoResize&&j(o.ObjectUtils.isEmpty(t.value)),f.onInput&&f.onInput(e),o.ObjectUtils.isNotEmpty(t.value)?o.DomHandler.addClass(t,"p-filled"):o.DomHandler.removeClass(t,"p-filled")},onPaste:function(e){f.onPaste&&f.onPaste(e),f.keyfilter&&l.KeyFilter.onPaste(e,f.keyfilter,f.validateOnly)}},c.getOtherProps(f),b("root"));return t.createElement(t.Fragment,null,t.createElement("textarea",P),w&&t.createElement(i.Tooltip,s({target:g,content:f.tooltip,pt:b("tooltip")},f.tooltipOptions)))}));m.displayName="InputTextarea",e.s(["InputTextarea",0,m])},71326,97778,e=>{"use strict";var t=e.i(71645),n=e.i(48264),a=e.i(1743),r=e.i(43456),l=e.i(71144),i=e.i(29168),o=e.i(28797),s=e.i(27259),u=e.i(73193);function c(){return(c=Object.assign.bind()).apply(null,arguments)}function d(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,a=Array(t);n<t;n++)a[n]=e[n];return a}function p(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"u">typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var a,r,l,i,o=[],s=!0,u=!1;try{if(l=(n=n.call(e)).next,0===t){if(Object(n)!==n)return;s=!1}else for(;!(s=(a=l.call(n)).done)&&(o.push(a.value),o.length!==t);s=!0);}catch(e){u=!0,r=e}finally{try{if(!s&&null!=n.return&&(i=n.return(),Object(i)!==i))return}finally{if(u)throw r}}return o}}(e,t)||function(e,t){if(e){if("string"==typeof e)return d(e,t);var n=({}).toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?d(e,t):void 0}}(e,t)||function(){throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function m(e){return(m="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}var f=r.ComponentBase.extend({defaultProps:{__TYPE:"ConfirmDialog",accept:null,acceptClassName:null,acceptIcon:null,acceptLabel:null,appendTo:null,breakpoints:null,children:void 0,className:null,content:null,defaultFocus:"accept",footer:null,icon:null,message:null,onHide:null,reject:null,rejectClassName:null,rejectIcon:null,rejectLabel:null,tagKey:void 0,visible:void 0},css:{classes:{root:"p-confirm-dialog",message:"p-confirm-dialog-message",icon:"p-confirm-dialog-icon",acceptButton:"p-confirm-dialog-accept",rejectButton:function(e){var t=e.getPropValue;return(0,u.classNames)("p-confirm-dialog-reject",{"p-button-text":!t("rejectClassName")})}}}});function g(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,a)}return n}function y(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?g(Object(n),!0).forEach(function(t){!function(e,t,n){var a;(a=function(e,t){if("object"!=m(e)||!e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var a=n.call(e,t||"default");if("object"!=m(a))return a;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(t,"string"),(t="symbol"==m(a)?a:a+"")in e)?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n}(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):g(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}var h=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return(e=y(y({},e),{visible:void 0===e.visible||e.visible})).visible&&o.OverlayService.emit("confirm-dialog",e),{show:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};o.OverlayService.emit("confirm-dialog",y(y(y({},e),t),{visible:!0}))},hide:function(){o.OverlayService.emit("confirm-dialog",{visible:!1})}}},b=t.memo(t.forwardRef(function(e,d){var m,g,h,b,v,x,j,k=(0,i.useMergeProps)(),S=t.useContext(n.PrimeReactContext),w=f.getProps(e,S),P=p(t.useState(w.visible),2),O=P[0],C=P[1],I=p(t.useState(!1),2),D=I[0],E=I[1],_=t.useRef(null),N=t.useRef(!1),L=t.useRef(null),T=function(){var e=w.group;return _.current&&(e=_.current.group),Object.assign({},w,_.current,{group:e})},A=function(e){return T()[e]},M=function(e){for(var t=arguments.length,n=Array(t>1?t-1:0),a=1;a<t;a++)n[a-1]=arguments[a];return u.ObjectUtils.getPropValue(A(e),n)},U=A("acceptLabel")||(0,n.localeOption)("accept"),R=A("rejectLabel")||(0,n.localeOption)("reject"),B={props:w,state:{visible:O}},z=f.setMetaData(B),H=z.ptm,K=z.cx,F=z.isUnstyled;(0,r.useHandleStyle)(f.css.styles,F,{name:"confirmdialog"});var W=function(){N.current||(N.current=!0,M("accept"),V("accept"))},G=function(){N.current||(N.current=!0,M("reject"),V("reject"))},$=function(){T().group===w.group&&(C(!0),N.current=!1,L.current=document.activeElement)},V=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"cancel";O&&("string"!=typeof e&&(e="cancel"),C(!1),M("onHide",e),u.DomHandler.focus(L.current),L.current=null)},q=function(e){if(e.tagKey===w.tagKey&&(void 0===e.group||e.group===w.group)){var t=O!==e.visible;A("target")===e.target||w.target?t&&(_.current=e,e.visible?$():V()):(V(),_.current=e,E(!0))}};t.useEffect(function(){w.visible?$():V()},[w.visible]),t.useEffect(function(){return w.target||w.message||o.OverlayService.on("confirm-dialog",q),function(){o.OverlayService.off("confirm-dialog",q)}},[w.target]),(0,i.useUpdateEffect)(function(){D&&$()},[D]),(0,i.useUnmountEffect)(function(){o.OverlayService.off("confirm-dialog",q)}),t.useImperativeHandle(d,function(){return{props:w,confirm:q}});var Y=(m=T(),g=u.ObjectUtils.getJSXElement(A("message"),m),h=k({className:K("icon")},H("icon")),b=u.IconUtils.getJSXIcon(A("icon"),y({},h),{props:m}),v=function(){var e=A("defaultFocus"),n=(0,u.classNames)("p-confirm-dialog-accept",A("acceptClassName")),r=(0,u.classNames)("p-confirm-dialog-reject",{"p-button-text":!A("rejectClassName")},A("rejectClassName")),l=k({label:R,autoFocus:"reject"===e,icon:A("rejectIcon"),className:(0,u.classNames)(A("rejectClassName"),K("rejectButton",{getPropValue:A})),onClick:G,pt:H("rejectButton"),unstyled:w.unstyled,__parentMetadata:{parent:B}},H("rejectButton")),i=k({label:U,autoFocus:void 0===e||"accept"===e,icon:A("acceptIcon"),className:(0,u.classNames)(A("acceptClassName"),K("acceptButton")),onClick:W,pt:H("acceptButton"),unstyled:w.unstyled,__parentMetadata:{parent:B}},H("acceptButton")),o=t.createElement(t.Fragment,null,t.createElement(a.Button,l),t.createElement(a.Button,i));if(A("footer")){var s={accept:W,reject:G,acceptClassName:n,rejectClassName:r,acceptLabel:U,rejectLabel:R,element:o,props:T()};return u.ObjectUtils.getJSXElement(A("footer"),s)}return o}(),x=k({className:K("message")},H("message")),j=k({visible:O,className:(0,u.classNames)(A("className"),K("root")),footer:v,onHide:V,breakpoints:A("breakpoints"),pt:m.pt,unstyled:w.unstyled,appendTo:A("appendTo"),__parentMetadata:{parent:B}},f.getOtherProps(m)),t.createElement(l.Dialog,c({},j,{content:null==e?void 0:e.content}),b,t.createElement("span",x,g)));return t.createElement(s.Portal,{element:Y,appendTo:A("appendTo")})}));b.displayName="ConfirmDialog",e.s(["ConfirmDialog",0,b,"confirmDialog",0,h],97778),e.s(["confirmAction",0,function(e,t){return new Promise(n=>{let a=!1,r=e=>{a||(a=!0,n(e))};h({message:e,header:t?.header||"Konfirmasi",icon:t?.danger?"pi pi-exclamation-triangle":"pi pi-question-circle",acceptLabel:t?.acceptLabel||"Ya, lanjutkan",rejectLabel:"Batal",acceptClassName:t?.danger?"p-button-danger":void 0,accept:()=>r(!0),reject:()=>r(!1),onHide:()=>r(!1)})})}],71326)},73474,e=>{"use strict";let t=(0,e.i(56420).default)("trash-2",[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]]);e.s(["Trash2",0,t],73474)},2114,e=>{"use strict";let t=(0,e.i(56420).default)("gavel",[["path",{d:"m14 13-8.381 8.38a1 1 0 0 1-3.001-3l8.384-8.381",key:"pgg06f"}],["path",{d:"m16 16 6-6",key:"vzrcl6"}],["path",{d:"m21.5 10.5-8-8",key:"a17d9x"}],["path",{d:"m8 8 6-6",key:"18bi4p"}],["path",{d:"m8.5 7.5 8 8",key:"1oyaui"}]]);e.s(["Gavel",0,t],2114)},22769,e=>{"use strict";var t=e.i(71645),n=e.i(48264),a=e.i(1743),r=e.i(43456),l=e.i(29168),i=e.i(62004),o=e.i(78954),s=e.i(58602),u=e.i(44080),c=e.i(28797),d=e.i(40623),p=e.i(73193),m=e.i(83438),f=e.i(27259),g=e.i(64952),y=e.i(1311);function h(e){return(h="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function b(e,t,n){var a;return(a=function(e,t){if("object"!=h(e)||!e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var a=n.call(e,t||"default");if("object"!=h(a))return a;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(t,"string"),(t="symbol"==h(a)?a:a+"")in e)?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function v(){return(v=Object.assign.bind()).apply(null,arguments)}function x(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,a=Array(t);n<t;n++)a[n]=e[n];return a}function j(e,t){if(e){if("string"==typeof e)return x(e,t);var n=({}).toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?x(e,t):void 0}}function k(e){return function(e){if(Array.isArray(e))return x(e)}(e)||function(e){if("u">typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||j(e)||function(){throw TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function S(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"u">typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var a,r,l,i,o=[],s=!0,u=!1;try{if(l=(n=n.call(e)).next,0===t){if(Object(n)!==n)return;s=!1}else for(;!(s=(a=l.call(n)).done)&&(o.push(a.value),o.length!==t);s=!0);}catch(e){u=!0,r=e}finally{try{if(!s&&null!=n.return&&(i=n.return(),Object(i)!==i))return}finally{if(u)throw r}}return o}}(e,t)||j(e,t)||function(){throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var w=r.ComponentBase.extend({defaultProps:{__TYPE:"AutoComplete",id:null,appendTo:null,autoFocus:!1,autoHighlight:!1,className:null,completeMethod:null,delay:300,disabled:!1,dropdown:!1,dropdownAriaLabel:null,dropdownAutoFocus:!0,dropdownIcon:null,dropdownMode:"blank",emptyMessage:null,field:null,forceSelection:!1,inputClassName:null,inputId:null,inputRef:null,inputStyle:null,variant:null,invalid:!1,itemTemplate:null,loadingIcon:null,maxLength:null,minLength:1,multiple:!1,name:null,onBlur:null,onChange:null,onClear:null,onClick:null,onContextMenu:null,onDblClick:null,onDropdownClick:null,onFocus:null,onHide:null,onKeyPress:null,onKeyUp:null,onMouseDown:null,onSelect:null,onShow:null,onUnselect:null,optionGroupChildren:null,optionGroupLabel:null,optionGroupTemplate:null,panelClassName:null,panelFooterTemplate:null,panelStyle:null,placeholder:null,readOnly:!1,removeTokenIcon:null,scrollHeight:"200px",selectedItemTemplate:null,selectionLimit:null,showEmptyMessage:!1,size:null,style:null,suggestions:null,tabIndex:null,tooltip:null,tooltipOptions:null,transitionOptions:null,type:"text",value:null,virtualScrollerOptions:null,children:void 0},css:{classes:{root:function(e){var t=e.props,n=e.focusedState;return(0,p.classNames)("p-autocomplete p-component p-inputwrapper",{"p-autocomplete-dd":t.dropdown,"p-autocomplete-multiple":t.multiple,"p-inputwrapper-filled":t.value,"p-invalid":t.invalid,"p-inputwrapper-focus":n})},container:function(e){var t=e.props,n=e.context;return(0,p.classNames)("p-autocomplete-multiple-container p-component p-inputtext",{"p-disabled":t.disabled,"p-variant-filled":t.variant?"filled"===t.variant:n&&"filled"===n.inputStyle})},loadingIcon:"p-autocomplete-loader",dropdownButton:"p-autocomplete-dropdown",removeTokenIcon:"p-autocomplete-token-icon",token:"p-autocomplete-token p-highlight",tokenLabel:"p-autocomplete-token-label",inputToken:"p-autocomplete-input-token",input:function(e){var t=e.props,n=e.context;return(0,p.classNames)("p-autocomplete-input",{"p-autocomplete-dd-input":t.dropdown,"p-variant-filled":t.variant?"filled"===t.variant:n&&"filled"===n.inputStyle})},panel:function(e){var t=e.context;return(0,p.classNames)("p-autocomplete-panel p-component",{"p-ripple-disabled":t&&!1===t.ripple||!1===n.default.ripple})},listWrapper:"p-autocomplete-items-wrapper",list:function(e){var t=e.virtualScrollerOptions,n=e.options;return t?(0,p.classNames)("p-autocomplete-items",n.className):"p-autocomplete-items"},emptyMessage:"p-autocomplete-item",item:function(e){var t=e.suggestion,n=e.optionGroupLabel,a=e.selected;return n?(0,p.classNames)("p-autocomplete-item",{"p-disabled":t.disabled},{selected:a}):(0,p.classNames)("p-autocomplete-item",{"p-disabled":t.disabled},{"p-highlight":a})},itemGroup:"p-autocomplete-item-group",footer:"p-autocomplete-footer",transition:"p-connected-overlay"},styles:"\n@layer primereact {\n    .p-autocomplete {\n        display: inline-flex;\n        position: relative;\n    }\n    \n    .p-autocomplete-loader {\n        position: absolute;\n        top: 50%;\n        margin-top: -.5rem;\n    }\n    \n    .p-autocomplete-dd .p-autocomplete-input {\n        flex: 1 1 auto;\n        width: 1%;\n    }\n    \n    .p-autocomplete-dd .p-autocomplete-input,\n    .p-autocomplete-dd .p-autocomplete-multiple-container {\n         border-top-right-radius: 0;\n         border-bottom-right-radius: 0;\n     }\n    \n    .p-autocomplete-dd .p-autocomplete-dropdown {\n         border-top-left-radius: 0;\n         border-bottom-left-radius: 0px;\n    }\n    \n    .p-autocomplete .p-autocomplete-panel {\n        min-width: 100%;\n    }\n    \n    .p-autocomplete-panel {\n        position: absolute;\n        top: 0;\n        left: 0;\n    }\n    \n    .p-autocomplete-items {\n        margin: 0;\n        padding: 0;\n        list-style-type: none;\n    }\n    \n    .p-autocomplete-item {\n        cursor: pointer;\n        white-space: nowrap;\n        position: relative;\n        overflow: hidden;\n    }\n    \n    .p-autocomplete-multiple-container {\n        margin: 0;\n        padding: 0;\n        list-style-type: none;\n        cursor: text;\n        overflow: hidden;\n        display: flex;\n        align-items: center;\n        flex-wrap: wrap;\n    }\n    \n    .p-autocomplete-token {\n        cursor: default;\n        display: inline-flex;\n        align-items: center;\n        flex: 0 0 auto;\n    }\n    \n    .p-autocomplete-token-icon {\n        cursor: pointer;\n    }\n    \n    .p-autocomplete-input-token {\n        flex: 1 1 auto;\n        display: inline-flex;\n    }\n    \n    .p-autocomplete-input-token input {\n        border: 0 none;\n        outline: 0 none;\n        background-color: transparent;\n        margin: 0;\n        padding: 0;\n        box-shadow: none;\n        border-radius: 0;\n        width: 100%;\n    }\n    \n    .p-fluid .p-autocomplete {\n        display: flex;\n    }\n    \n    .p-fluid .p-autocomplete-dd .p-autocomplete-input {\n        width: 1%;\n    }\n    \n    .p-autocomplete-items-wrapper {\n        overflow: auto;\n    } \n}\n"}});function P(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,a)}return n}function O(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?P(Object(n),!0).forEach(function(t){b(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):P(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}var C=t.memo(t.forwardRef(function(e,a){var r,i,o,s,u,c=(0,l.useMergeProps)(),d=e.ptm,h=e.cx,b=t.useContext(n.PrimeReactContext),x=function(t,n){return d(t,O({hostName:e.hostName},n))},j=function(t,n){return x(n,{context:{selected:e.selectedItem.current===t,disabled:t.disabled}})},S=function(t){return p.ObjectUtils.resolveFieldData(t,e.optionGroupLabel)},w=t.useRef({key:null,index:0,keyIndex:0}),P=function(n,a,r,l){var i=e.optionGroupTemplate?p.ObjectUtils.getJSXElement(e.optionGroupTemplate,n,r):e.getOptionGroupLabel(n)||n,o=c(O({index:r,className:h("itemGroup"),"data-p-highlight":!1},l),x("itemGroup"));return t.createElement("li",v({},o,{key:a||null}),i)},C=function(n,a,r,l){var i=e.selectedItem&&e.selectedItem.current&&Array.isArray(e.selectedItem.current)?e.selectedItem.current.some(function(e){return p.ObjectUtils.deepEquals(e,n)}):p.ObjectUtils.deepEquals(e.selectedItem.current,n),o=e.itemTemplate?p.ObjectUtils.getJSXElement(e.itemTemplate,n,r):e.field?p.ObjectUtils.resolveFieldData(n,e.field):n,s=c(O({index:r,role:"option",className:h("item",{optionGroupLabel:e.optionGroupLabel,suggestion:n,selected:i}),onClick:function(t){return e.onItemClick(t,n)},"aria-selected":i},l),j(n,"item"));return t.createElement("li",v({key:a},s),o,t.createElement(g.Ripple,null))},I=function(n,a){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},l={height:r.props?r.props.itemSize:void 0};if(e.optionGroupLabel){if(e.virtualScrollerOptions){var i,o,s=(i=e.suggestions,o=e.optionGroupLabel,i.findIndex(function(e){return e[o]===n}));if(-1!==s){w.current={key:n,index:a,keyIndex:s};var u=a+"_"+S(n);return P(n,u,a,{style:l})}var d=a+"_"+w.current.keyIndex,m=c({style:l,"data-group":w.current.keyIndex,"data-index":a-w.current.index-1,"data-p-disabled":n.disabled});return C(n,d,a,m)}var f=e.getOptionGroupChildren(n).map(function(e,t){var n=a+"_"+t,r=c({"data-group":a,"data-index":t,"data-p-disabled":e.disabled});return C(e,n,t,r)}),g=a+"_"+S(n);return t.createElement(t.Fragment,{key:g},P(n,void 0,a,{style:l}),f)}var y="".concat(a,"_").concat(p.ObjectUtils.isObject(n)?p.ObjectUtils.resolveFieldData(n,e.field):n),h=c({style:l,"data-p-disabled":n.disabled},j(n,"item"));return C(n,y,a,h)},D=function(t){try{return null==t?void 0:t.map(function(t){return[null==t?void 0:t[null==e?void 0:e.optionGroupLabel]].concat(k(null==t?void 0:t[null==e?void 0:e.optionGroupChildren]))}).flat()}catch(e){}},E=(r=O({},e.panelStyle||{}),i=function(){if(e.showEmptyMessage&&p.ObjectUtils.isEmpty(e.suggestions)){var a=e.emptyMessage||(0,n.localeOption)("emptyMessage"),r=c({className:h("emptyMessage")},x("emptyMessage")),l=c({className:h("list")},x("list"));return t.createElement("ul",l,t.createElement("li",r,a))}if(e.virtualScrollerOptions){var i=e.suggestions?e.optionGroupLabel?D(null==e?void 0:e.suggestions):e.suggestions:null,o=O(O({},e.virtualScrollerOptions),{style:O(O({},e.virtualScrollerOptions.style),{height:e.scrollHeight}),autoSize:!0,items:i,itemTemplate:function(e,t){return e&&I(e,t.index,t)},contentTemplate:function(n){var a=c({id:e.listId,ref:n.contentRef,style:n.style,className:h("list",{virtualScrollerProps:o,options:n}),role:"listbox"},x("list"));return t.createElement("ul",a,n.children)}});return t.createElement(y.VirtualScroller,v({ref:e.virtualScrollerRef},o,{pt:x("virtualScroller"),__parentMetadata:{parent:e.metaData}}))}var s=e.suggestions?e.suggestions.map(I):null,u=c({id:e.listId,className:h("list"),role:"listbox"},x("list")),d=c({className:h("listWrapper"),style:{maxHeight:e.scrollHeight||"auto"}},x("listWrapper"));return t.createElement("div",d,t.createElement("ul",u,s))}(),o=function(){if(e.panelFooterTemplate){var n=p.ObjectUtils.getJSXElement(e.panelFooterTemplate,e,e.onOverlayHide),a=c({className:h("footer")},x("footer"));return t.createElement("div",a,n)}return null}(),s=c({className:(0,p.classNames)(e.panelClassName,h("panel",{context:b})),style:r,onClick:function(t){return e.onClick(t)},"data-pr-is-overlay":!0},x("panel")),u=c({classNames:h("transition"),in:e.in,timeout:{enter:120,exit:100},options:e.transitionOptions,unmountOnExit:!0,onEnter:e.onEnter,onEntering:e.onEntering,onEntered:e.onEntered,onExit:e.onExit,onExited:e.onExited},x("transition")),t.createElement(m.CSSTransition,v({nodeRef:a},u),t.createElement("div",v({ref:a},s),i,o)));return t.createElement(f.Portal,{element:E,appendTo:e.appendTo})}));function I(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,a)}return n}function D(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?I(Object(n),!0).forEach(function(t){b(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):I(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}C.displayName="AutoCompletePanel";var E=t.memo(t.forwardRef(function(e,m){var f,g,y,h,b,x,j=(0,l.useMergeProps)(),P=t.useContext(n.PrimeReactContext),O=w.getProps(e,P),I=S(t.useState(O.id),2),E=I[0],_=I[1],N=S(t.useState(!1),2),L=N[0],T=N[1],A=S(t.useState(!1),2),M=A[0],U=A[1],R=S(t.useState(!1),2),B=R[0],z=R[1],H={props:O,state:{id:E,searching:L,focused:M,overlayVisible:B}},K=w.setMetaData(H),F=K.ptm,W=K.cx,G=K.sx,$=K.isUnstyled;(0,r.useHandleStyle)(w.css.styles,$,{name:"autocomplete"});var V=t.useRef(null),q=t.useRef(null),Y=t.useRef(O.inputRef),J=t.useRef(null),X=t.useRef(null),Z=t.useRef(null),Q=t.useRef(null),ee=S((0,l.useOverlayListener)({target:V,overlay:q,listener:function(e,t){var n=t.type;t.valid&&("outside"===n?ea(e)||ed():P.hideOverlaysOnDocumentScrolling?ed():p.DomHandler.isDocument(e.target)||em())},when:B}),2),et=ee[0],en=ee[1],ea=function(e){return O.multiple?e.target===J.current||J.current.contains(e.target):e.target===Y.current},er=function(e){Z.current&&clearTimeout(Z.current);var t=e.target.value;O.multiple||eo(e,t),p.ObjectUtils.isEmpty(t)?(ed(),O.onClear&&O.onClear(e)):t.length>=O.minLength?Z.current=setTimeout(function(){el(e,t,"input")},O.delay):ed()},el=function(e,t,n){null==t||("input"!==n||0!==t.trim().length)&&O.completeMethod&&(T(!0),O.completeMethod({originalEvent:e,query:t}))},ei=function(e,t,n){O.multiple?(Y.current.value="",!eO(t)&&eD()&&eo(e,O.value?[].concat(k(O.value),[t]):[t])):(eu(t),eo(e,t)),O.onSelect&&O.onSelect({originalEvent:e,value:t}),n||(p.DomHandler.focus(Y.current),ed())},eo=function(e,t){O.onChange&&O.onChange({originalEvent:e,value:t,stopPropagation:function(){e.stopPropagation()},preventDefault:function(){e.preventDefault()},target:{name:O.name,id:E,value:t}}),Q.current=p.ObjectUtils.isNotEmpty(t)?t:null},es=function(e){if(p.ObjectUtils.isEmpty(e))return"";if("string"==typeof e)return e;if(O.selectedItemTemplate){var t,n=p.ObjectUtils.getJSXElement(O.selectedItemTemplate,e);return O.multiple||"string"==typeof n?n:e}return O.field&&null!=(t=p.ObjectUtils.resolveFieldData(e,O.field))?t:e},eu=function(e){Y.current.value=es(e)},ec=function(){z(!0)},ed=function(){z(!1),T(!1)},ep=function(){var e,t=null==(e=eC())||null==(e=e.firstChild)?void 0:e.firstChild;t&&($()||p.DomHandler.addClass(t,"p-highlight"),t.setAttribute("data-p-highlight",!0))},em=function(){var e=O.multiple?J.current:Y.current;p.DomHandler.alignOverlay(q.current,e,O.appendTo||P&&P.appendTo||n.default.appendTo)},ef=function(e){O.dropdownAutoFocus&&p.DomHandler.focus(Y.current,O.dropdownAutoFocus),"blank"===O.dropdownMode?el(e,"","dropdown"):"current"===O.dropdownMode&&el(e,Y.current.value,"dropdown"),O.onDropdownClick&&O.onDropdownClick({originalEvent:e,query:Y.current.value})},eg=function(e,t){if(!O.disabled&&!O.readOnly){var n=O.value[t];eo(e,O.value.filter(function(e,n){return t!==n})),O.onUnselect&&O.onUnselect({originalEvent:e,value:n})}},ey=function(e){if(B){var t=p.DomHandler.findSingle(q.current,'li[data-p-highlight="true"]');switch(e.which){case 40:if(t){var n=eb(t);n&&($()||p.DomHandler.addClass(n,"p-highlight"),n.setAttribute("data-p-highlight",!0),$()||p.DomHandler.removeClass(t,"p-highlight"),t.setAttribute("data-p-highlight",!1),p.DomHandler.scrollInView(eC(),n))}else t=p.DomHandler.findSingle(q.current,"li"),"itemgroup"===p.DomHandler.getAttribute(t,"data-pc-section")&&(t=eb(t)),t&&($()||p.DomHandler.addClass(t,"p-highlight"),t.setAttribute("data-p-highlight",!0));e.preventDefault();break;case 38:if(t){var a=ev(t);a&&($()||p.DomHandler.addClass(a,"p-highlight"),a.setAttribute("data-p-highlight",!0),$()||p.DomHandler.removeClass(t,"p-highlight"),t.setAttribute("data-p-highlight",!1),p.DomHandler.scrollInView(eC(),a))}e.preventDefault();break;case 13:t&&(eh(e,t),ed(),e.preventDefault());break;case 27:ed(),e.preventDefault();break;case 9:t&&eh(e,t),ed()}}if(O.multiple&&8===e.which&&O.value&&O.value.length&&!Y.current.value){var r=O.value[O.value.length-1];eo(e,O.value.slice(0,-1)),O.onUnselect&&O.onUnselect({originalEvent:e,value:r})}},eh=function(e,t){O.optionGroupLabel?ei(e,eI(O.suggestions[t.dataset.group])[t.dataset.index]):ei(e,O.suggestions[t.getAttribute("index")])},eb=function(e){var t=e.nextElementSibling;return t?"itemgroup"===p.DomHandler.getAttribute(t,"data-pc-section")?eb(t):t:null},ev=function(e){var t=e.previousElementSibling;return t?"itemgroup"===p.DomHandler.getAttribute(t,"data-pc-section")?ev(t):t:null},ex=function(e){U(!0),O.onFocus&&O.onFocus(e)},ej=function(e){if(O.multiple){Y.current.value="";return}var t=p.ObjectUtils.trim(e.target.value).toLowerCase(),n=(O.suggestions||[]).flatMap(function(e){return e.items?e.items:[e]}).find(function(e){var n=O.field?p.ObjectUtils.resolveFieldData(e,O.field):e,a=n?p.ObjectUtils.trim(n).toLowerCase():"";return a&&t===a});n?ei(e,n,!0):(Y.current.value="",eo(e,null),O.onClear&&O.onClear(e))},ek=function(e){U(!1),O.forceSelection&&ej(e),O.onBlur&&O.onBlur(e)},eS=function(e){p.DomHandler.focus(Y.current),O.onClick&&O.onClick(e)},ew=function(e){ex(e),$()||p.DomHandler.addClass(J.current,"p-focus"),J.current.setAttribute("data-p-focus",!0)},eP=function(e){ek(e),$()||p.DomHandler.removeClass(J.current,"p-focus"),J.current.setAttribute("data-p-focus",!1)},eO=function(e){return!!O.value&&O.value.some(function(t){return p.ObjectUtils.equals(t,e)})},eC=function(){var e;return null==q||null==(e=q.current)?void 0:e.firstChild},eI=function(e){return p.ObjectUtils.resolveFieldData(e,O.optionGroupChildren)},eD=function(){return!O.value||!O.selectionLimit||O.value.length<O.selectionLimit};t.useEffect(function(){p.ObjectUtils.combinedRefs(Y,O.inputRef)},[Y,O.inputRef]),t.useEffect(function(){p.ObjectUtils.isNotEmpty(O.value)&&(Q.current=O.value)},[O.value]),(0,l.useMountEffect)(function(){E||_((0,p.UniqueComponentId)()),O.autoFocus&&p.DomHandler.focus(Y.current,O.autoFocus),em()}),(0,l.useUpdateEffect)(function(){L&&O.autoHighlight&&O.suggestions&&O.suggestions.length&&ep()},[L]),(0,l.useUpdateEffect)(function(){L&&(p.ObjectUtils.isNotEmpty(O.suggestions)||O.showEmptyMessage?ec():ed(),T(!1))},[O.suggestions]),(0,l.useUpdateEffect)(function(){Y.current&&!O.multiple&&eu(O.value),B&&em()}),(0,l.useUnmountEffect)(function(){Z.current&&clearTimeout(Z.current),p.ZIndexUtils.clear(q.current)}),t.useImperativeHandle(m,function(){return{props:O,search:el,show:ec,hide:ed,focus:function(){return p.DomHandler.focus(Y.current)},getElement:function(){return V.current},getOverlay:function(){return q.current},getInput:function(){return Y.current},getVirtualScroller:function(){return X.current}}});var eE=function(e,t){switch(e.code){case"Space":case"NumpadEnter":case"Enter":eg(e,t),e.preventDefault(),e.stopPropagation()}},e_=function(e){var n=B?E+"_list":null,a=j({className:W("inputToken")},F("inputToken")),r=j(D({id:O.inputId,ref:Y,"aria-autocomplete":"list","aria-controls":n,"aria-expanded":B,"aria-haspopup":"listbox",autoComplete:"off",className:O.inputClassName,disabled:O.disabled,maxLength:O.maxLength,name:O.name,onBlur:eP,onChange:e?er:void 0,onFocus:ew,onKeyDown:e?ey:void 0,onKeyPress:O.onKeyPress,onKeyUp:O.onKeyUp,placeholder:e?O.placeholder:void 0,readOnly:O.readOnly||!e,required:O.required,role:"combobox",style:O.inputStyle,tabIndex:O.tabIndex,type:O.type},eA),F("input"));return t.createElement("li",a,t.createElement("input",r))},eN=E+"_list",eL=p.ObjectUtils.isNotEmpty(O.tooltip),eT=w.getOtherProps(O),eA=p.ObjectUtils.reduceKeys(eT,p.DomHandler.ARIA_PROPS),eM=function(){if(L){var e=j({className:W("loadingIcon")},F("loadingIcon")),n=O.loadingIcon||t.createElement(o.SpinnerIcon,v({},e,{spin:!0}));return p.IconUtils.getJSXIcon(n,D({},e),{props:O})}return null}(),eU=O.multiple?(f=eD(),g=p.ObjectUtils.isNotEmpty(O.value)?O.value.map(function(e,a){var r=j({className:W("removeTokenIcon"),onClick:function(e){return eg(e,a)},tabIndex:O.tabIndex||"0","aria-label":(0,n.localeOption)("clear"),onKeyDown:function(e){return eE(e,a)}},F("removeTokenIcon")),l=O.removeTokenIcon||t.createElement(s.TimesCircleIcon,r),i=!O.disabled&&p.IconUtils.getJSXIcon(l,D({},r),{props:O}),o=j({className:W("token")},F("token")),u=j({className:W("tokenLabel")},F("tokenLabel"));return t.createElement("li",v({key:a+"multi-item"},o),t.createElement("span",u,es(e)),i)}):(Q.current=null,null),y=e_(f),h=j({ref:J,className:W("container",{context:P}),onClick:f?eS:void 0,onContextMenu:O.onContextMenu,onMouseDown:O.onMouseDown,onDoubleClick:O.onDblClick,"data-p-focus":M,"data-p-disabled":O.disabled},F("container")),t.createElement("ul",h,g,y)):(b=es(O.value),x=B?E+"_list":null,t.createElement(u.InputText,v({ref:Y,id:O.inputId,type:O.type,name:O.name,defaultValue:b,role:"combobox","aria-autocomplete":"list","aria-controls":x,"aria-haspopup":"listbox","aria-expanded":B,className:(0,p.classNames)(O.inputClassName,W("input",{context:P})),style:O.inputStyle,autoComplete:"off",readOnly:O.readOnly,required:O.required,disabled:O.disabled,placeholder:O.placeholder,size:O.size,maxLength:O.maxLength,tabIndex:O.tabIndex,onBlur:ek,onFocus:ex,onChange:er,onMouseDown:O.onMouseDown,onKeyUp:O.onKeyUp,onKeyDown:ey,onKeyPress:O.onKeyPress,onContextMenu:O.onContextMenu,onClick:O.onClick,onDoubleClick:O.onDblClick,pt:F("input"),unstyled:O.unstyled},eA,{__parentMetadata:{parent:H}}))),eR=function(){if(O.dropdown){var e=O.dropdownAriaLabel||O.placeholder||(0,n.localeOption)("choose");return t.createElement(a.Button,{type:"button",icon:O.dropdownIcon||t.createElement(i.ChevronDownIcon,null),className:W("dropdownButton"),disabled:O.disabled,onClick:ef,"aria-label":e,pt:F("dropdownButton"),__parentMetadata:{parent:H}})}return null}(),eB=j({id:E,ref:V,style:O.style,className:(0,p.classNames)(O.className,W("root",{focusedState:M}))},eT,F("root"));return t.createElement(t.Fragment,null,t.createElement("span",eB,eU,eM,eR,t.createElement(C,v({hostName:"AutoComplete",ref:q,virtualScrollerRef:X},O,{listId:eN,onItemClick:ei,selectedItem:Q,onOverlayHide:ed,onClick:function(e){c.OverlayService.emit("overlay-click",{originalEvent:e,target:V.current})},getOptionGroupLabel:function(e){return O.optionGroupLabel?p.ObjectUtils.resolveFieldData(e,O.optionGroupLabel):e},getOptionGroupChildren:eI,in:B,onEnter:function(){p.ZIndexUtils.set("overlay",q.current,P&&P.autoZIndex||n.default.autoZIndex,P&&P.zIndex.overlay||n.default.zIndex.overlay),p.DomHandler.addStyles(q.current,{position:"absolute",top:"0",left:"0"}),em()},onEntering:function(){O.autoHighlight&&O.suggestions&&O.suggestions.length&&ep()},onEntered:function(){et(),O.onShow&&O.onShow()},onExit:function(){en()},onExited:function(){p.ZIndexUtils.clear(q.current),O.onHide&&O.onHide()},ptm:F,cx:W,sx:G}))),eL&&t.createElement(d.Tooltip,v({target:V,content:O.tooltip,pt:F("tooltip")},O.tooltipOptions)))}));E.displayName="AutoComplete",e.s(["AutoComplete",0,E])},66595,e=>{"use strict";let t=(0,e.i(56420).default)("search",[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]]);e.s(["Search",0,t],66595)},67927,e=>{"use strict";let t=(0,e.i(56420).default)("chevron-right",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);e.s(["ChevronRight",0,t],67927)},59008,e=>{"use strict";var t=e.i(43476),n=e.i(71645),a=e.i(68242),r=e.i(67927),l=e.i(54858);let i=["Mabes / Polda","Polres / Direktorat","Polsek / Satuan","Sub-unit","Sub-unit","Sub-unit","Sub-unit"];e.s(["default",0,function({initialId:e,onSelect:o,disabled:s}){let[u,c]=(0,n.useState)(null),[d,p]=(0,n.useState)([]),[m,f]=(0,n.useState)([]),g=(0,n.useRef)(o);g.current=o;let y=(0,n.useCallback)(async e=>{let t=await l.apiAuth.get("/bdb/satker/children",{params:{parentId:e}});return t.data?.data||[]},[]);async function h(e,t){let n=m.slice(0,e),a=d.slice(0,e+1);t&&(n[e]=t,t.has_children&&(a[e+1]=await y(t.id))),f(n),p(a)}return(0,n.useEffect)(()=>{let t=!0;return(async()=>{try{let n=await l.apiAuth.get("/bdb/satker/roots"),a=(n.data?.data||[])[0]||null;if(!t||(c(a),!a))return;let r=await y(a.id);if(!t)return;if(e){let n=await l.apiAuth.get("/bdb/satker/path",{params:{id:e}}),a=(n.data?.data||[]).map(Number).slice(1),i=[r],o=[];for(let e of a){let t=r.find(t=>Number(t.id)===e);if(!t)break;o.push(t),t.has_children?(r=await y(t.id),i.push(r)):r=[]}if(!t)return;p(i),f(o)}else p([r]),f([])}catch{}})(),()=>{t=!1}},[e]),(0,n.useEffect)(()=>{g.current(m.length?m[m.length-1]:null)},[m]),(0,t.jsxs)("div",{children:[(0,t.jsx)("div",{style:{display:"grid",gap:"0.4rem"},children:d.map((e,n)=>(0,t.jsx)(a.Dropdown,{id:"satker-level-dd-"+n,inputId:"satker-level-dd-"+n+"-select",name:"satker_level_"+n,value:m[n]?.id??null,onChange:t=>h(n,e.find(e=>e.id===t.value)||null),options:e,optionLabel:"deskripsi",optionValue:"id",filter:!0,showClear:!0,disabled:s,placeholder:`— ${i[n]||"Sub-unit"} —`,emptyMessage:"Tidak ada sub-satker",style:{width:"100%"},itemTemplate:e=>(0,t.jsxs)("span",{style:{display:"inline-flex",alignItems:"baseline",gap:"0.5rem"},children:[(0,t.jsx)("span",{children:e.deskripsi}),(0,t.jsx)("span",{style:{fontSize:"0.7rem",color:"#94a3b8",fontFamily:"monospace"},children:e.kode})]})},n))}),(0,t.jsxs)("div",{style:{fontSize:"0.75rem",color:"#475569",marginTop:"0.4rem",display:"flex",alignItems:"center",gap:"0.25rem",flexWrap:"wrap"},children:[(0,t.jsx)("span",{style:{color:"#94a3b8"},children:"Satker:"}),(0,t.jsx)("strong",{children:"POLRI"}),m.map(e=>(0,t.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.25rem"},children:[(0,t.jsx)(r.ChevronRight,{size:12,style:{color:"#cbd5e1"}}),(0,t.jsx)("strong",{children:e.deskripsi})]},e.id))]})]})}])},16306,e=>{"use strict";let t=(0,e.i(56420).default)("shield-alert",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"M12 8v4",key:"1got3b"}],["path",{d:"M12 16h.01",key:"1drbdi"}]]);e.s(["ShieldAlert",0,t],16306)},29210,e=>{"use strict";let t=(0,e.i(56420).default)("landmark",[["path",{d:"M10 18v-7",key:"wt116b"}],["path",{d:"M11.119 2.205a2 2 0 0 1 1.762 0l7.84 3.846A.5.5 0 0 1 20.5 7h-17a.5.5 0 0 1-.22-.949z",key:"yxxwt6"}],["path",{d:"M14 18v-7",key:"vav6t3"}],["path",{d:"M18 18v-7",key:"aexdmj"}],["path",{d:"M3 22h18",key:"8prr45"}],["path",{d:"M6 18v-7",key:"1ivflk"}]]);e.s(["Landmark",0,t],29210)},82303,e=>{"use strict";let t=(0,e.i(56420).default)("users",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["path",{d:"M16 3.128a4 4 0 0 1 0 7.744",key:"16gr8j"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}]]);e.s(["Users",0,t],82303)},46387,e=>{"use strict";let t=(0,e.i(56420).default)("building-2",[["path",{d:"M10 12h4",key:"a56b0p"}],["path",{d:"M10 8h4",key:"1sr2af"}],["path",{d:"M14 21v-3a2 2 0 0 0-4 0v3",key:"1rgiei"}],["path",{d:"M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2",key:"secmi2"}],["path",{d:"M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16",key:"16ra0t"}]]);e.s(["Building2",0,t],46387)},20865,e=>{"use strict";let t=(0,e.i(56420).default)("map-pin",[["path",{d:"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",key:"1r0f0z"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]]);e.s(["MapPin",0,t],20865)},13817,e=>{"use strict";let t=(0,e.i(56420).default)("corner-down-right",[["path",{d:"m15 10 5 5-5 5",key:"qqa56n"}],["path",{d:"M4 4v7a4 4 0 0 0 4 4h12",key:"z08zvw"}]]);e.s(["CornerDownRight",0,t],13817)},79258,e=>{"use strict";let t=(0,e.i(56420).default)("package",[["path",{d:"M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z",key:"1a0edw"}],["path",{d:"M12 22V12",key:"d0xqtd"}],["polyline",{points:"3.29 7 12 12 20.71 7",key:"ousv84"}],["path",{d:"m7.5 4.27 9 5.15",key:"1c824w"}]]);e.s(["Package",0,t],79258)},86366,e=>{"use strict";let t=(0,e.i(56420).default)("workflow",[["rect",{width:"8",height:"8",x:"3",y:"3",rx:"2",key:"by2w9f"}],["path",{d:"M7 11v4a2 2 0 0 0 2 2h4",key:"xkn7yn"}],["rect",{width:"8",height:"8",x:"13",y:"13",rx:"2",key:"1cgmvn"}]]);e.s(["Workflow",0,t],86366)},95785,e=>{"use strict";var t=e.i(43476),n=e.i(71645),a=e.i(17580),r=e.i(24718),l=e.i(44080),i=e.i(68242),o=e.i(1743),s=e.i(53729),u=e.i(71144),c=e.i(85118),d=e.i(97778),p=e.i(89269),m=e.i(22769),f=e.i(29210),g=e.i(82303),y=e.i(72382),h=e.i(41120),b=e.i(13817),v=e.i(2114),x=e.i(20865),j=e.i(79258),k=e.i(86366),S=e.i(46387),w=e.i(67927),P=e.i(66595);let O=(0,e.i(56420).default)("pencil-line",[["path",{d:"M13 21h8",key:"1jsn5i"}],["path",{d:"m15 5 4 4",key:"1mk7zo"}],["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",key:"1a8usu"}]]);var C=e.i(73474),I=e.i(16306),D=e.i(18566),E=e.i(38036),_=e.i(59008),N=e.i(45184),L=e.i(54858),T=e.i(71326);let A={LP:void 0,PENYELIDIKAN:"info",PENYIDIKAN:"warning",SP2_LIDIK:"danger",SP3:"danger",TAHAP_I:"success",TAHAP_II:"success"},M={textAlign:"left",fontWeight:700,color:"#64748b",background:"#eef2f7",padding:"0.35rem 0.6rem",borderBottom:"1px solid #e2e8f0",whiteSpace:"nowrap",fontSize:"0.72rem",textTransform:"uppercase",letterSpacing:"0.02em"},U={padding:"0.35rem 0.6rem",borderBottom:"1px solid #eef2f7",color:"#334155",verticalAlign:"top",fontSize:"0.8rem"};function R({children:e}){return(0,t.jsx)("div",{style:{overflowX:"auto",border:"1px solid #e2e8f0",borderRadius:8},children:(0,t.jsx)("table",{style:{borderCollapse:"collapse",width:"100%",minWidth:"20rem",background:"#fff"},children:e})})}function B(e){if(null==e)return null;let t=String(e).trim();return""===t||"-"===t?null:t}function z(e,t){return e&&"object"==typeof e?B(e[t]):null}function H(e,t){let n=e?.[t];return Array.isArray(n)?n:[]}function K({icon:e,children:n}){return(0,t.jsxs)("div",{style:{fontSize:"0.68rem",fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.03em",marginBottom:"0.3rem",display:"flex",alignItems:"center",gap:"0.3rem"},children:[e,n]})}function F({title:e,icon:n,count:a,children:r}){return(0,t.jsxs)("div",{children:[(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.4rem",marginBottom:"0.4rem"},children:[n,(0,t.jsx)("span",{style:{fontWeight:700,fontSize:"0.9rem"},children:e}),(0,t.jsx)("span",{style:{fontSize:"0.72rem",fontWeight:700,color:"#64748b",background:"#eef2f7",borderRadius:999,padding:"0.05rem 0.5rem"},children:a})]}),0===a?(0,t.jsx)("div",{style:{color:"#cbd5e1",fontSize:"0.82rem"},children:"Tidak ada data."}):(0,t.jsx)("div",{style:{display:"grid",gap:"0.4rem"},children:r})]})}function W(e){return e.dugaan_tindak_pidana?(0,t.jsx)("div",{style:{display:"flex",flexDirection:"column",gap:"0.15rem"},children:e.dugaan_tindak_pidana.split("; ").map((e,n)=>{let[a,r]=e.split(" — ");return(0,t.jsxs)("span",{style:{display:"inline-flex",alignItems:"baseline",gap:"0.35rem",flexWrap:"wrap"},children:[(0,t.jsx)(v.Gavel,{size:12,style:{color:"#b45309",flex:"0 0 auto",alignSelf:"center"}}),(0,t.jsx)("span",{style:{fontWeight:600},children:a}),r&&(0,t.jsxs)("span",{style:{fontSize:"0.72rem",color:"#b45309",background:"#fffbeb",borderRadius:6,padding:"0.02rem 0.35rem"},children:["Pasal ",r]})]},n)})}):(0,t.jsx)("span",{style:{color:"#cbd5e1"},children:"—"})}let G={LP:"Belum Update",PENYELIDIKAN:"LIDIK",PENYIDIKAN:"SIDIK",SP2_LIDIK:"SP2 Lidik",SP3:"SP3",SPDP:"SPDP",TAHAP_I:"Tahap I",TAHAP_II:"Tahap II",P19:"P19",P21:"P21"},$={Polda:"danger",Polres:"warning",Polsek:"info",Mabes:"danger"};function V({label:e,v:n}){return(0,t.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"11rem 1fr",gap:"0.5rem",borderBottom:"1px solid #f1f5f9",paddingBottom:"0.4rem"},children:[(0,t.jsx)("span",{style:{fontSize:"0.78rem",fontWeight:700,color:"#64748b"},children:e}),(0,t.jsx)("span",{style:{fontSize:"0.85rem",wordBreak:"break-word"},children:n||"—"})]})}e.s(["default",0,function(){let e=(0,n.useRef)(null),q=(0,D.useRouter)(),Y=e=>q.push(`/cms/laporan-polisi/${e.pid||e.id}`),[J,X]=(0,n.useState)([]),[Z,Q]=(0,n.useState)(0),[ee,et]=(0,n.useState)(!0),en=(0,n.useRef)(0),[ea,er]=(0,n.useState)(null),[el,ei]=(0,n.useState)(!1),[eo,es]=(0,n.useState)(""),[eu,ec]=(0,n.useState)(""),[ed,ep]=(0,n.useState)(""),[em,ef]=(0,n.useState)(()=>(()=>{let y=new Date().getFullYear();return `${y}-01-01`})()),[eg,ey]=(0,n.useState)(()=>(()=>{let y=new Date().getFullYear();return `${y}-12-31`})()),[eh,eb]=(0,n.useState)(""),[ev,ex]=(0,n.useState)(0),[ej,ek]=(0,n.useState)(25),[eS,ew]=(0,n.useState)(null),[eP,eO]=(0,n.useState)(null),[eC,eI]=(0,n.useState)(null),[eD,eE]=(0,n.useState)(""),[e_,eN]=(0,n.useState)([]),[eL,eT]=(0,n.useState)(null),[eA,eM]=(0,n.useState)(""),[eU,eR]=(0,n.useState)(!1),[eB,ez]=(0,n.useState)(null),[eH,eK]=(0,n.useState)(""),[eF,eW]=(0,n.useState)(!1),[eFD,eSetFD]=(0,n.useState)("INTERNAL_RESERSE"),[eAP,eSetAP]=(0,n.useState)(()=>({level:"",status:"",model:"",from:(()=>{let y=new Date().getFullYear();return `${y}-01-01`})(),to:(()=>{let y=new Date().getFullYear();return `${y}-12-31`})(),search:"",functionDomain:"INTERNAL_RESERSE",jenisKejahatanIds:"",targetSatkerId:""})),[eCrime,setECrime]=(0,n.useState)(""),[crimeOpts,setCrimeOpts]=(0,n.useState)([]),
[kelompokDataOpen,setKelompokDataOpen]=(0,n.useState)(!1),
[draftModel,setDraftModel]=(0,n.useState)(""),
[draftStatus,setDraftStatus]=(0,n.useState)(""),
[allCrimes,setAllCrimes]=(0,n.useState)([]),
[actorKelompok,setActorKelompok]=(0,n.useState)("ALL"),
[actorPrimaryDomain,setActorPrimaryDomain]=(0,n.useState)(null),
[activeKelompokCrime,setActiveKelompokCrime]=(0,n.useState)("ALL"),
[activeTipidCrime,setActiveTipidCrime]=(0,n.useState)("ALL"),
[selectedCrimeIds,setSelectedCrimeIds]=(0,n.useState)([]),[satkerSuggestions,setSatkerSuggestions]=(0,n.useState)([]),[satkerSearchText,setSatkerSearchText]=(0,n.useState)(""),[eTargetSatker,setETargetSatker]=(0,n.useState)(null),[satkerOpen,setSatkerOpen]=(0,n.useState)(!1),[satkerLevels,setSatkerLevels]=(0,n.useState)([]),[satkerSearchQuery,setSatkerSearchQuery]=(0,n.useState)(""),[satkerResults,setSatkerResults]=(0,n.useState)([]),[satkerLoading,setSatkerLoading]=(0,n.useState)(!1),[satkerPage,setSatkerPage]=(0,n.useState)(1),[satkerTotal,setSatkerTotal]=(0,n.useState)(0),[satkerDraftTarget,setSatkerDraftTarget]=(0,n.useState)(null),[satkerDraftFD,setSatkerDraftFD]=(0,n.useState)("INTERNAL_RESERSE"),[ackModalOpen,setAckModalOpen]=(0,n.useState)(!1),[ackTarget,setAckTarget]=(0,n.useState)(null),[ackChecked,setAckChecked]=(0,n.useState)(!1),[ackAlasan,setAckAlasan]=(0,n.useState)(""),[ackSubmitting,setAckSubmitting]=(0,n.useState)(!1),[crimeOpen,setCrimeOpen]=(0,n.useState)(!1),[crimeSearch,setCrimeSearch]=(0,n.useState)(""),[selectedCrimeLabels,setSelectedCrimeLabels]=(0,n.useState)([]),[mainPeriodOpen,setMainPeriodOpen]=(0,n.useState)(!1),
[mainPeriodMode,setMainPeriodMode]=(0,n.useState)("year"),
[mainPeriodMonth,setMainPeriodMonth]=(0,n.useState)(()=>{
  let d=new Date(),
      p=new Date(d.getFullYear(),d.getMonth()-1,1);
  return String(p.getMonth()+1).padStart(2,"0")
}),
[mainPeriodYear,setMainPeriodYear]=(0,n.useState)(()=>{
  let d=new Date(),
      p=new Date(d.getFullYear(),d.getMonth()-1,1);
  return String(p.getFullYear())
}),
[mainCustomFrom,setMainCustomFrom]=(0,n.useState)(em),
[mainCustomTo,setMainCustomTo]=(0,n.useState)(eg),
[mainPeriodLabel,setMainPeriodLabel]=(0,n.useState)(()=>{let y=new Date().getFullYear();return "Tahun "+y}),[eG,e$]=(0,n.useState)({isSuperadmin:!1,isAdminBinops:!1});(0,n.useEffect)(()=>{let e=(0,E.deriveRoles)((0,E.getUser)());e$({isSuperadmin:e.isSuperadmin,isAdminBinops:e.isAdminBinops})},[]);(0,n.useEffect)(()=>{
    L.apiAuth.get("/bdb/laporan-polisi/monitoring-options").then(res=>{
        let d = res.data?.data || {};
        let crimes = Array.isArray(d.crimes) ? d.crimes : [];
        setAllCrimes(crimes);
        if (d.actor_kelompok && d.actor_kelompok !== "ALL") {
            setActorKelompok(d.actor_kelompok);
            setActiveKelompokCrime(d.actor_kelompok);
        }
        if (d.primary_domain) {
            setActorPrimaryDomain(d.primary_domain);
            if (d.primary_domain !== "KRIMSUS" && d.primary_domain !== "KRIMUM" && d.primary_domain !== "RESKRIM" && d.primary_domain !== "MABES_ALL") {
                setActiveTipidCrime(d.primary_domain);
            } else {
                setActiveTipidCrime("ALL");
            }
        }
        let map = new Map();
        for (let c of crimes) {
            let name = String(c.nama || "").trim();
            if (!name) continue;
            if (!map.has(name)) map.set(name, []);
            map.get(name).push(c.id);
        }
        let opts = Array.from(map.entries()).map(([label, ids]) => ({
            label,
            value: ids.join(","),
            domain: crimes.find(x => x.nama === label)?.domain,
            kelompok: crimes.find(x => x.nama === label)?.kelompok
        })).sort((a, b) => a.label.localeCompare(b.label));
        setCrimeOpts(opts);
    }).catch(()=>{
        L.apiAuth.get("/bdb/kinerja-perkara/meta/jenis-kejahatan").then(e=>{
            let rows = Array.isArray(e.data?.data)?e.data.data:[];
            let map = new Map();
            for(let item of rows){
                let name = String(item.keterangan||"").trim();
                if(!name)continue;
                if(!map.has(name))map.set(name,[]);
                map.get(name).push(item.id);
            }
            let opts = Array.from(map.entries()).map(([label,ids])=>({label,value:ids.join(",")})).sort((a,b)=>a.label.localeCompare(b.label));
            setCrimeOpts(opts);
        }).catch(()=>setCrimeOpts([]));
    });
},[]);async function searchSatkerSpesifik(evt){let q=(evt.query||"").trim();try{let res=await L.apiAuth.get("/bdb/satker/search",{params:{q:q||"POLDA",limit:30}});setSatkerSuggestions(res.data?.data||[])}catch{setSatkerSuggestions([])}}let eV=eG.isSuperadmin||eG.isAdminBinops;

let eBulkRole=(0,E.deriveRoles)((0,E.getUser)()),eBulkAllowed=eV||"operator"===String(eBulkRole?.label||"").toLowerCase();
let[bulkVisible,setBulkVisible]=(0,n.useState)(!1),[bulkStep,setBulkStep]=(0,n.useState)(1),[bulkSelected,setBulkSelected]=(0,n.useState)([]),[bulkTypes,setBulkTypes]=(0,n.useState)([]),[bulkStatuses,setBulkStatuses]=(0,n.useState)([]),[bulkType,setBulkType]=(0,n.useState)(null),[bulkData,setBulkData]=(0,n.useState)({}),[bulkBusy,setBulkBusy]=(0,n.useState)(!1),[bulkLoading,setBulkLoading]=(0,n.useState)(!1),[bulkLpRows,setBulkLpRows]=(0,n.useState)([]),[bulkLpTotal,setBulkLpTotal]=(0,n.useState)(0),[bulkLpPage,setBulkLpPage]=(0,n.useState)(1),[bulkLpLoading,setBulkLpLoading]=(0,n.useState)(!1),[bulkSearch,setBulkSearch]=(0,n.useState)(""),[bulkModel,setBulkModel]=(0,n.useState)(""),[bulkFunctionDomain,setBulkFunctionDomain]=(0,n.useState)("INTERNAL_RESERSE"),[bulkLevel,setBulkLevel]=(0,n.useState)(""),[bulkStatusFilter,setBulkStatusFilter]=(0,n.useState)(""),[bulkFrom,setBulkFrom]=(0,n.useState)(""),[bulkTo,setBulkTo]=(0,n.useState)(""),[bulkApplied,setBulkApplied]=(0,n.useState)({level:"",model:"",status:"",from:"",to:"",search:"",functionDomain:"INTERNAL_RESERSE"}),[bulkPeriodOpen,setBulkPeriodOpen]=(0,n.useState)(!1),[bulkPeriodMode,setBulkPeriodMode]=(0,n.useState)("month"),[bulkPeriodMonth,setBulkPeriodMonth]=(0,n.useState)(String(new Date().getMonth()+1).padStart(2,"0")),[bulkPeriodYear,setBulkPeriodYear]=(0,n.useState)(String(new Date().getFullYear())),[bulkCustomFrom,setBulkCustomFrom]=(0,n.useState)(""),[bulkCustomTo,setBulkCustomTo]=(0,n.useState)(""),[bulkPeriodLabel,setBulkPeriodLabel]=(0,n.useState)("Semua Periode"),[bulkExpanded,setBulkExpanded]=(0,n.useState)(!1),[bulkPageSize,setBulkPageSize]=(0,n.useState)(25),[bulkEditPage,setBulkEditPage]=(0,n.useState)(1);
let[quickVisible,setQuickVisible]=(0,n.useState)(!1),[quickRow,setQuickRow]=(0,n.useState)(null),[quickTypes,setQuickTypes]=(0,n.useState)([]),[quickType,setQuickType]=(0,n.useState)(null),[quickData,setQuickData]=(0,n.useState)({}),[quickBusy,setQuickBusy]=(0,n.useState)(!1),[quickLoading,setQuickLoading]=(0,n.useState)(!1);
let bulkCache=(0,n.useRef)(new Map),bulkLoadSeq=(0,n.useRef)(0),quickLoadSeq=(0,n.useRef)(0);



let satkerSearchTimer = (0,n.useRef)(null);

async function doSearchSatker(q, fd, lvls, pageNum) {
    let pNum = pageNum !== undefined ? pageNum : 1;
    setSatkerLoading(true);
    setSatkerPage(pNum);
    try {
        let domain = fd !== undefined ? fd : satkerDraftFD;
        let curLvls = lvls !== undefined ? lvls : satkerLevels;
        let queryStr = q !== undefined ? q : satkerSearchQuery;
        let params = {
            q: (queryStr || "").trim(),
            page: pNum,
            limit: 5,
            functionDomain: domain,
            level: (curLvls && curLvls.length > 0 && curLvls.length < 4) ? curLvls.join(",") : ""
        };
        let res = await L.apiAuth.get("/bdb/satker/search", { params });
        let raw = res.data;
        setSatkerResults(Array.isArray(raw?.data) ? raw.data : []);
        setSatkerTotal(Number(raw?.total ?? (raw?.data?.length || 0)));
    } catch {
        setSatkerResults([]);
        setSatkerTotal(0);
    } finally {
        setSatkerLoading(false);
    }
}

function openSatkerModal() {
    if (satkerOpen) {
        setSatkerOpen(false);
        return;
    }
    let lvls = eo ? eo.split(",").map(s => s.trim()).filter(Boolean) : [];
    setSatkerLevels(lvls);
    setSatkerDraftTarget(eTargetSatker);
    setSatkerDraftFD(eFD || "");
    setSatkerPage(1);
    setSatkerOpen(true);
    setCrimeOpen(false);
    setMainPeriodOpen(false);
    doSearchSatker(satkerSearchQuery || "", eFD || "", lvls, 1);
}

function handleSatkerSearchInput(val) {
    setSatkerSearchQuery(val);
}

function toggleSatkerLevel(lvlName) {
    let next;
    if (satkerLevels.includes(lvlName)) {
        next = satkerLevels.filter(l => l !== lvlName);
    } else {
        next = [...satkerLevels, lvlName];
    }
    setSatkerLevels(next);
    doSearchSatker(satkerSearchQuery, satkerDraftFD, next, 1);
}

function handleApplySatker() {
    let u = (0, E.getUser)();
    let curSatkerId = Number(u?.satker_id || u?.organisasiId || u?.organisasi_id || u?.scope_satker_id || 0);
    let targetId = satkerDraftTarget?.id ? Number(satkerDraftTarget.id) : null;
    let chosenFD = satkerDraftFD !== undefined ? satkerDraftFD : eFD;
    if (!eV && targetId && targetId !== curSatkerId) {
        setSatkerOpen(false);
        setAckTarget(satkerDraftTarget);
        setAckChecked(false);
        setAckAlasan("");
        setAckModalOpen(true);
        return;
    }
    let newLevel = (satkerLevels.length === 0 || satkerLevels.length === 4) ? "" : satkerLevels.join(",");
    let newSatkerId = targetId ? String(targetId) : "";
    eSetFD(chosenFD);
    es(newLevel);
    setETargetSatker(satkerDraftTarget);
    setSatkerOpen(false);
    ex(0);
    eSetAP({
        level: newLevel,
        status: eu,
        model: ed,
        from: em,
        to: eg,
        search: eh.trim(),
        functionDomain: chosenFD,
        jenisKejahatanIds: eCrime || "",
        targetSatkerId: newSatkerId
    });
}

async function handleConfirmAck() {
    if (!ackTarget || !ackChecked || !ackAlasan.trim()) return;
    setAckSubmitting(true);
    try {
        let tName = ackTarget.deskripsi || ackTarget.name || ("Satker #" + ackTarget.id);
        let pTxt = "Saya yakin untuk masuk ke daftar LP milik si satker " + tName + " di bawah regionalnya dia.";
        await L.apiAuth.post("/bdb/laporan-polisi/acknowledge-satker-access", {
            target_satker_id: Number(ackTarget.id),
            pernyataan: pTxt,
            alasan: ackAlasan.trim()
        });
        setAckModalOpen(false);
        setETargetSatker(ackTarget);
        let chosenFD = satkerDraftFD !== undefined ? satkerDraftFD : eFD;
        eSetFD(chosenFD);
        let newSatkerId = String(ackTarget.id);
        let newLevel = (satkerLevels.length === 0 || satkerLevels.length === 4) ? "" : satkerLevels.join(",");
        es(newLevel);
        ex(0);
        eSetAP({
            level: newLevel,
            status: eu,
            model: ed,
            from: em,
            to: eg,
            search: eh.trim(),
            functionDomain: chosenFD,
            jenisKejahatanIds: eCrime || "",
            targetSatkerId: newSatkerId
        });
        e.current?.show({
            severity: "success",
            summary: "Akses Supervisi Dicatat",
            detail: "Menampilkan daftar LP milik " + tName,
            life: 3000
        });
    } catch (err) {
        let msg = err.response?.data?.message || "Gagal mencatat pernyataan akses supervisi.";
        e.current?.show({ severity: "error", summary: "Akses Ditolak", detail: msg, life: 5000 });
    } finally {
        setAckSubmitting(false);
    }
}
function handleResetSatker() {
    setSatkerLevels([]);
    setSatkerDraftTarget(null);
    setSatkerDraftFD("INTERNAL_RESERSE");
    setSatkerSearchQuery("");
    setSatkerPage(1);
    eSetFD("INTERNAL_RESERSE");
    es("");
    setETargetSatker(null);
    setSatkerOpen(false);
    ex(0);
    eSetAP({
        level: "",
        status: eu,
        model: ed,
        from: em,
        to: eg,
        search: eh.trim(),
        functionDomain: "INTERNAL_RESERSE",
        jenisKejahatanIds: eCrime || "",
        targetSatkerId: ""
    });
}
function openCrimeModal() {
    if (crimeOpen) {
        setCrimeOpen(false);
        return;
    }
    if (eCrime) {
        let curIds = eCrime.split(",").map(strVal => Number(strVal.trim())).filter(Boolean);
        setSelectedCrimeIds(curIds);
        if (allCrimes.length > 0 && curIds.length > 0) {
            let matched = allCrimes.filter(c => curIds.includes(Number(c.id)));
            let groups = new Set(matched.map(c => c.kelompok).filter(Boolean));
            let domains = new Set(matched.map(c => c.domain).filter(Boolean));
            if (groups.size === 1) {
                setActiveKelompokCrime(Array.from(groups)[0]);
            }
            if (domains.size === 1) {
                setActiveTipidCrime(Array.from(domains)[0]);
            }
        }
    } else {
        if (actorKelompok && actorKelompok !== "ALL") {
            setActiveKelompokCrime(actorKelompok);
            if (actorPrimaryDomain && actorPrimaryDomain !== "ALL" && actorPrimaryDomain !== "KRIMSUS" && actorPrimaryDomain !== "KRIMUM" && actorPrimaryDomain !== "RESKRIM" && actorPrimaryDomain !== "MABES_ALL") {
                setActiveTipidCrime(actorPrimaryDomain);
                let domainCrimes = allCrimes.filter(c => c.domain === actorPrimaryDomain);
                if (domainCrimes.length > 0) {
                    setSelectedCrimeIds(domainCrimes.map(c => Number(c.id)));
                } else {
                    let kelCrimes = allCrimes.filter(c => c.kelompok === actorKelompok);
                    setSelectedCrimeIds(kelCrimes.map(c => Number(c.id)));
                }
            } else {
                setActiveTipidCrime("ALL");
                let kelCrimes = allCrimes.filter(c => c.kelompok === actorKelompok);
                setSelectedCrimeIds(kelCrimes.map(c => Number(c.id)));
            }
        } else {
            setSelectedCrimeIds([]);
            setActiveKelompokCrime("ALL");
            setActiveTipidCrime("ALL");
        }
    }
    setCrimeSearch("");
    setCrimeOpen(true);
    setSatkerOpen(false);
    setKelompokDataOpen(false);
    setMainPeriodOpen(false);
}

function handleSelectKelompok(kKey) {
    setActiveKelompokCrime(kKey);
    setActiveTipidCrime("ALL");
    if (kKey === "ALL") {
        setSelectedCrimeIds([]);
    } else {
        let targetCrimes = allCrimes.filter(c => c.kelompok === kKey);
        setSelectedCrimeIds(targetCrimes.map(c => Number(c.id)));
    }
}

function handleSelectTipid(tKey) {
    setActiveTipidCrime(tKey);
    if (tKey === "ALL") {
        if (activeKelompokCrime === "ALL") {
            setSelectedCrimeIds([]);
        } else {
            let targetCrimes = allCrimes.filter(c => c.kelompok === activeKelompokCrime);
            setSelectedCrimeIds(targetCrimes.map(c => Number(c.id)));
        }
    } else {
        let targetCrimes = allCrimes.filter(c => c.domain === tKey);
        setSelectedCrimeIds(targetCrimes.map(c => Number(c.id)));
    }
}

function toggleCrimeId(id) {
    let numId = Number(id);
    if (selectedCrimeIds.includes(numId)) {
        setSelectedCrimeIds(selectedCrimeIds.filter(idVal => idVal !== numId));
    } else {
        setSelectedCrimeIds([...selectedCrimeIds, numId]);
    }
}

function handleApplyCrime() {
    let combined = selectedCrimeIds.join(",");
    setECrime(combined);
    setCrimeOpen(false);
    ex(0);
    eSetAP({
        level: eo,
        status: eu,
        model: ed,
        from: em,
        to: eg,
        search: eh.trim(),
        functionDomain: eFD,
        jenisKejahatanIds: combined,
        targetSatkerId: eTargetSatker?.id ? String(eTargetSatker.id) : ""
    });
}

function handleResetCrime() {
    setSelectedCrimeIds([]);
    setECrime("");
    if (actorKelompok && actorKelompok !== "ALL") {
        setActiveKelompokCrime(actorKelompok);
        if (actorPrimaryDomain && actorPrimaryDomain !== "ALL" && actorPrimaryDomain !== "KRIMSUS" && actorPrimaryDomain !== "KRIMUM" && actorPrimaryDomain !== "RESKRIM" && actorPrimaryDomain !== "MABES_ALL") {
            setActiveTipidCrime(actorPrimaryDomain);
        } else {
            setActiveTipidCrime("ALL");
        }
    } else {
        setActiveKelompokCrime("ALL");
        setActiveTipidCrime("ALL");
    }
    setCrimeSearch("");
    setCrimeOpen(false);
    ex(0);
    eSetAP({
        level: eo,
        status: eu,
        model: ed,
        from: em,
        to: eg,
        search: eh.trim(),
        functionDomain: eFD,
        jenisKejahatanIds: "",
        targetSatkerId: eTargetSatker?.id ? String(eTargetSatker.id) : ""
    });
}
function mainOpenPeriodDialog(){
    setSatkerOpen(false);
    setCrimeOpen(false);

  let p=bulkDescribePeriod(em,eg);

  setMainPeriodMode(p.mode);
  setMainPeriodMonth(p.month);
  setMainPeriodYear(p.year);
  setMainCustomFrom(p.customFrom);
  setMainCustomTo(p.customTo);
  setMainPeriodLabel(p.label);
  setMainPeriodOpen(!0)
}

function mainApplyPeriod(){
  let from="",
      to="",
      label="";

  if("month"===mainPeriodMode){
    let p=bulkMonthRange(
      mainPeriodYear,
      mainPeriodMonth
    );

    from=p.from;
    to=p.to;
    label=p.label;
  }
  else if("year"===mainPeriodMode){
    let p=bulkYearRange(mainPeriodYear);

    from=p.from;
    to=p.to;
    label=p.label;
  }
  else{
    from=mainCustomFrom;
    to=mainCustomTo;

    if(!from||!to)
      return void e.current?.show({
        severity:"warn",
        summary:"Periode belum lengkap",
        detail:"Tanggal awal dan akhir wajib dipilih."
      });

    if(from>to)
      return void e.current?.show({
        severity:"warn",
        summary:"Periode tidak valid",
        detail:"Tanggal awal tidak boleh melewati tanggal akhir."
      });

    label=from+" s.d. "+to;
  }

  ef(from);
  ey(to);
  setMainPeriodLabel(label);
  setMainPeriodOpen(!1);
  ex(0);
  eSetAP({level:eo,status:eu,model:ed,from:from,to:to,search:eh.trim(),functionDomain:eFD,jenisKejahatanIds:eCrime||"",targetSatkerId:eTargetSatker?.id?String(eTargetSatker.id):""})
}

function mainResetPeriod(){
  ef("");
  ey("");
  setMainPeriodLabel("Semua Periode");
  setMainPeriodOpen(!1);
  ex(0);
  eSetAP({level:eo,status:eu,model:ed,from:"",to:"",search:eh.trim(),functionDomain:eFD,jenisKejahatanIds:eCrime||"",targetSatkerId:eTargetSatker?.id?String(eTargetSatker.id):""})
}

function bulkLpId(row){return Number(row?.id)}
function bulkOptions(field){if(Array.isArray(field?.options))return field.options;if(Array.isArray(field?.option_groups))return field.option_groups.flatMap(g=>Array.isArray(g?.items)?g.items:[]);return[]}
function bulkUnsupported(doc){return(doc?.form_schema?.fields||[]).some(f=>{if(!f?.required)return!1;if(f?.lampiran||!["text","date","select","textarea"].includes(f?.type))return!0;if("select"===f.type&&0===bulkOptions(f).length)return!0;return!1})}
function bulkTypeOptions(){return bulkTypes.filter(doc=>doc?.status_target_id&&!bulkUnsupported(doc)).map(doc=>({label:doc.nama,value:Number(doc.id)}))}
function bulkTypeDoc(){return bulkTypes.find(x=>Number(x.id)===Number(bulkType))}
function bulkFields(doc){let all=doc?.form_schema?.fields||[],base=[{field_key:"nomor_dokumen",label:"No. Dokumen",type:"text",required:!0},{field_key:"tanggal_dokumen",label:"Tgl. Dokumen",type:"date",required:!0}],required=all.filter(f=>f?.required&&!f?.lampiran&&["text","date","select","textarea"].includes(f?.type)),out=[];for(let b of base){let real=all.find(f=>f?.field_key===b.field_key);out.push(real?{...real,label:b.label,required:!0}:b)}for(let f of required)out.some(x=>x.field_key===f.field_key)||out.push(f);return out}
function bulkVisibleField(field,data){return!field?.visible_if||data?.[field.visible_if.field]===field.visible_if.value}
function bulkEmpty(v){return void 0===v||null===v||""===v||Array.isArray(v)&&0===v.length}
function bulkToday(){let d=new Date;return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}

function quickTypeDoc(){return quickTypes.find(x=>Number(x.id)===Number(quickType))}
function quickTypeOptions(){return quickTypes.map(doc=>({label:doc.nama,value:Number(doc.id)}))}
function quickSetField(key,value){setQuickData(prev=>({...prev,[key]:value}))}

function quickPickType(value){
  let v=null==value?null:Number(value);
  setQuickType(v);
  setQuickData(v?{nomor_dokumen:"PREMEMORY",tanggal_dokumen:bulkToday()}:{});
}

function quickClose(){
  if(quickBusy)return;
  quickLoadSeq.current++;
  setQuickVisible(!1);
  setQuickRow(null);
  setQuickTypes([]);
  setQuickType(null);
  setQuickData({});
  setQuickLoading(!1);
}

async function quickOpen(row){
  if(!eBulkAllowed)return;

  let id=bulkLpId(row);
  if(!Number.isInteger(id)||id<=0)
    return void e.current?.show({
      severity:"error",
      summary:"LP tidak valid",
      detail:"ID Laporan Polisi tidak valid."
    });

  let seq=++quickLoadSeq.current;

  setQuickRow(row);
  setQuickVisible(!0);
  setQuickTypes([]);
  setQuickType(null);
  setQuickData({});
  setQuickLoading(!0);

  try{
    let[docs,actions]=await Promise.all([
      L.apiAuth.get("/bdb/wf/document-types"),
      L.apiAuth.get("/bdb/wf/lp/"+id+"/available-actions")
    ]);

    if(seq!==quickLoadSeq.current)return;

    let all=Array.isArray(docs.data?.data)?docs.data.data:[],
        acts=Array.isArray(actions.data?.data)?actions.data.data:[],
        allowed=new Set(
          acts.filter(x=>x?.allowed).map(x=>Number(x.id))
        ),
        usable=all.filter(doc=>
          doc?.status_target_id &&
          !bulkUnsupported(doc) &&
          allowed.has(Number(doc.id))
        );

    setQuickTypes(usable);
  }catch(err){
    if(seq!==quickLoadSeq.current)return;

    setQuickTypes([]);

    e.current?.show({
      severity:"error",
      summary:"Gagal memuat update status",
      detail:err.response?.data?.message||"Gagal memeriksa alur dokumen."
    });
  }finally{
    seq===quickLoadSeq.current&&setQuickLoading(!1);
  }
}

function quickRenderInput(field){
  if(!bulkVisibleField(field,quickData))return null;

  let value=quickData[field.field_key];

  if("select"===field.type)
    return(0,t.jsx)(i.Dropdown,{
      id:"quick-dd-"+field.field_key,
      inputId:"quick-dd-"+field.field_key+"-select",
      name:field.field_key,
      value:value??null,
      options:bulkOptions(field).map(v=>({label:String(v),value:v})),
      onChange:evt=>quickSetField(field.field_key,evt.value),
      placeholder:"Pilih…",
      style:{width:"100%"},
      showClear:!0
    });

  if("date"===field.type)
    return(0,t.jsx)(l.InputText,{
      id:"quick-"+field.field_key,
      name:field.field_key,
      type:"date",
      value:value||"",
      onChange:evt=>quickSetField(field.field_key,evt.target.value),
      style:{width:"100%"}
    });

  if("textarea"===field.type)
    return(0,t.jsx)("textarea",{
      id:"quick-"+field.field_key,
      name:field.field_key,
      value:value||"",
      onChange:evt=>quickSetField(field.field_key,evt.target.value),
      rows:3,
      style:{
        width:"100%",
        padding:"0.55rem",
        border:"1px solid #cbd5e1",
        borderRadius:6,
        resize:"vertical"
      }
    });

  return(0,t.jsx)(l.InputText,{
    id:"quick-"+field.field_key,
    name:field.field_key,
    value:value||"",
    onChange:evt=>quickSetField(field.field_key,evt.target.value),
    style:{width:"100%"}
  });
}

function quickEditor(){
  let doc=quickTypeDoc();
  if(!doc)return null;

  let fields=bulkFields(doc).filter(f=>bulkVisibleField(f,quickData));

  return(0,t.jsx)("div",{
    style:{
      display:"grid",
      gridTemplateColumns:"repeat(auto-fit,minmax(15rem,1fr))",
      gap:"0.75rem"
    },
    children:fields.map(f=>
      (0,t.jsxs)("div",{
        children:[
          (0,t.jsxs)("label",{
            style:{
              display:"block",
              fontSize:"0.76rem",
              fontWeight:700,
              color:"#334155",
              marginBottom:"0.3rem"
            },
            children:[
              f.label||f.field_key,
              (0,t.jsx)("span",{
                style:{color:"#dc2626",marginLeft:"0.2rem"},
                children:"*"
              })
            ]
          }),
          quickRenderInput(f)
        ]
      },f.field_key)
    )
  });
}

async function quickSave(){
  let row=quickRow,
      doc=quickTypeDoc();

  if(!row||!doc)return;

  let id=bulkLpId(row),
      data={...quickData};

  bulkEmpty(data.nomor_dokumen)&&(data.nomor_dokumen="PREMEMORY");
  bulkEmpty(data.tanggal_dokumen)&&(data.tanggal_dokumen=bulkToday());

  let fields=bulkFields(doc),
      missing=fields.filter(
        f=>bulkVisibleField(f,data)&&bulkEmpty(data[f.field_key])
      );

  if(missing.length)
    return void e.current?.show({
      severity:"warn",
      summary:"Data wajib belum lengkap",
      detail:missing.map(f=>f.label||f.field_key).join(", ")
    });

  setQuickBusy(!0);

  try{
    let form=new FormData;

    form.append("document_type_id",String(doc.id));
    form.append("data",JSON.stringify(data));

    await L.apiAuth.post(
      "/bdb/wf/lp/"+id+"/dokumen",
      form,
      {headers:{"Content-Type":void 0}}
    );

    bulkCache.current.clear();

    await Promise.all([eZ(),eQ()]);

    e.current?.show({
      severity:"success",
      summary:"Status LP diperbarui",
      detail:(row.no_laporan||("LP #"+id))+" berhasil diperbarui.",
      life:5e3
    });

    quickLoadSeq.current++;
    setQuickVisible(!1);
    setQuickRow(null);
    setQuickTypes([]);
    setQuickType(null);
    setQuickData({});
  }catch(err){
    e.current?.show({
      severity:"error",
      summary:"Gagal menyimpan",
      detail:Array.isArray(err.response?.data?.message)
        ?err.response.data.message.join(", ")
        :err.response?.data?.message||"Gagal memperbarui status LP."
    });
  }finally{
    setQuickBusy(!1);
  }
}

function bulkSetField(id,key,value){setBulkData(prev=>({...prev,[id]:{...(prev[id]||{}),[key]:value}}))}
function bulkSelectedHas(row){let id=bulkLpId(row);return bulkSelected.some(x=>bulkLpId(x)===id)}
function bulkToggleRow(row,checked){let id=bulkLpId(row);setBulkSelected(prev=>checked?(prev.some(x=>bulkLpId(x)===id)?prev:[...prev,row]):prev.filter(x=>bulkLpId(x)!==id))}
function bulkPageAllSelected(){return bulkLpRows.length>0&&bulkLpRows.every(row=>bulkSelectedHas(row))}
function bulkTogglePage(checked){let ids=new Set(bulkLpRows.map(bulkLpId));setBulkSelected(prev=>checked?[...prev.filter(x=>!ids.has(bulkLpId(x))),...bulkLpRows]:prev.filter(x=>!ids.has(bulkLpId(x))))}

function bulkPageNumbers(page,total,rows){let pages=Math.max(1,Math.ceil(Number(total||0)/rows)),start=Math.max(1,page-2),end=Math.min(pages,start+4);start=Math.max(1,end-4);let out=[];for(let p=start;p<=end;p++)out.push(p);return{pages,numbers:out}}
function bulkPager(page,total,rows,onGo,onRowsChange){let totalNum=Number(total||0),p=bulkPageNumbers(page,totalNum,rows),pages=p.pages,fromIdx=totalNum===0?0:(page-1)*rows+1,toIdx=Math.min(page*rows,totalNum);return(0,t.jsxs)("div",{className:"p-paginator p-component p-paginator-bottom",style:{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"0.5rem",padding:"0.6rem 0.8rem",background:"var(--surface-50,#f8fafc)",borderTop:"1px solid var(--surface-border,#e2e8f0)",borderRadius:"0 0 8px 8px"},children:[(0,t.jsxs)("span",{className:"p-paginator-current",style:{fontSize:"0.8rem",color:"#64748b",fontWeight:500},children:["Menampilkan ",(0,t.jsx)("strong",{children:`${fromIdx} - ${toIdx}`})," dari ",(0,t.jsx)("strong",{children:`${totalNum}`})," LP"]}),(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.2rem"},children:[(0,t.jsx)("button",{type:"button",className:"p-paginator-first p-paginator-element p-link"+(page<=1?" p-disabled":""),disabled:page<=1,onClick:()=>onGo(1),children:(0,t.jsx)("span",{className:"p-paginator-icon pi pi-angle-double-left"})}),(0,t.jsx)("button",{type:"button",className:"p-paginator-prev p-paginator-element p-link"+(page<=1?" p-disabled":""),disabled:page<=1,onClick:()=>onGo(page-1),children:(0,t.jsx)("span",{className:"p-paginator-icon pi pi-angle-left"})}),(0,t.jsx)("span",{className:"p-paginator-pages",children:p.numbers.map(n=>(0,t.jsx)("button",{type:"button",className:"p-paginator-page p-paginator-element p-link"+(n===page?" p-highlight":""),onClick:()=>onGo(n),children:n},n))}),(0,t.jsx)("button",{type:"button",className:"p-paginator-next p-paginator-element p-link"+(page>=pages?" p-disabled":""),disabled:page>=pages,onClick:()=>onGo(page+1),children:(0,t.jsx)("span",{className:"p-paginator-icon pi pi-angle-right"})}),(0,t.jsx)("button",{type:"button",className:"p-paginator-last p-paginator-element p-link"+(page>=pages?" p-disabled":""),disabled:page>=pages,onClick:()=>onGo(pages),children:(0,t.jsx)("span",{className:"p-paginator-icon pi pi-angle-double-right"})})]}),onRowsChange?(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.4rem",fontSize:"0.8rem",color:"#64748b"},children:[(0,t.jsx)("span",{children:"Baris per halaman:"}),(0,t.jsx)(i.Dropdown,{id:"bulk-rpp-dropdown",inputId:"bulk-rpp-select",name:"bulkRowsPerPage",value:rows,options:[{label:"25",value:25},{label:"50",value:50},{label:"100",value:100}],onChange:e=>{if(e.value)onRowsChange(e.value)},className:"p-paginator-rpp-options",style:{height:"2.2rem",minWidth:"5.5rem"}})]}):(0,t.jsx)("div",{style:{minWidth:"5.5rem"}})]})};

function bulkQueryParams(filter,page,pageSize){let r=pageSize||bulkPageSize||25,p={page:page,row:r};filter&&filter.status&&(p.status=filter.status);return p}
function bulkCacheKey(filter,page,pageSize){let r=pageSize||bulkPageSize||25;return JSON.stringify([page,r,filter?.status||""])}
function bulkCurrentFilter(extra){return{status:Object.prototype.hasOwnProperty.call(extra||{},"status")?extra.status:bulkStatusFilter||""}}

async function bulkLoadLp(page,filter,pageSize){let r=pageSize||bulkPageSize||25,useFilter=filter||bulkApplied,key=bulkCacheKey(useFilter,page,r),seq=++bulkLoadSeq.current,cached=bulkCache.current.get(key);if(cached){setBulkLpRows(cached.rows),setBulkLpTotal(cached.total),setBulkLpPage(page),setBulkLpLoading(!1);return}setBulkLpLoading(!0);try{let res=await L.apiAuth.get("/bdb/laporan-polisi",{params:bulkQueryParams(useFilter,page,r)});if(seq!==bulkLoadSeq.current)return;let body=res.data,rows=Array.isArray(body?.data)?body.data:[],total=Number(body?.total||0);bulkCache.current.set(key,{rows:rows,total:total}),setBulkLpRows(rows),setBulkLpTotal(total),setBulkLpPage(page)}catch(err){if(seq!==bulkLoadSeq.current)return;setBulkLpRows([]),setBulkLpTotal(0),e.current?.show({severity:"error",summary:"Gagal memuat LP",detail:err.response?.data?.message||"Daftar LP tidak dapat dimuat."})}finally{seq===bulkLoadSeq.current&&setBulkLpLoading(!1)}}
function bulkApplyFilters(extra){let next=bulkCurrentFilter(extra||{});setBulkApplied(next),bulkCache.current.clear(),bulkLoadLp(1,next,bulkPageSize||25)}
function bulkSearchGo(){bulkApplyFilters({})}
function bulkGoLp(page){bulkLoadLp(page,bulkApplied,bulkPageSize||25)}

function bulkMonthNames(){return["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"]}
function bulkMonthOptions(){return bulkMonthNames().map((x,i)=>({label:x,value:String(i+1).padStart(2,"0")}))}
function bulkYearOptions(){let y=new Date().getFullYear(),out=[];for(let x=y;x>=2000;x--)out.push({label:String(x),value:String(x)});return out}
function bulkDaysInMonth(year,month){return new Date(Number(year),Number(month),0).getDate()}
function bulkMonthRange(year,month){let y=String(year),m=String(month).padStart(2,"0"),last=String(bulkDaysInMonth(y,m)).padStart(2,"0");return{from:y+"-"+m+"-01",to:y+"-"+m+"-"+last,label:bulkMonthNames()[Number(m)-1]+" "+y}}
function bulkYearRange(year){let y=String(year);return{from:y+"-01-01",to:y+"-12-31",label:"Tahun "+y}}

function bulkDescribePeriod(from,to){let now=new Date(),cy=String(now.getFullYear()),cm=String(now.getMonth()+1).padStart(2,"0");if(!from&&!to)return{mode:"month",month:cm,year:cy,customFrom:"",customTo:"",label:"Semua Periode"};let fy=String(from||"").slice(0,4),fm=String(from||"").slice(5,7),ty=String(to||"").slice(0,4),tm=String(to||"").slice(5,7);if(fy&&fy===ty&&from===fy+"-01-01"&&to===fy+"-12-31")return{mode:"year",month:fm||cm,year:fy,customFrom:from,customTo:to,label:"Tahun "+fy};if(fy&&fy===ty&&fm&&fm===tm&&from===fy+"-"+fm+"-01"&&to===fy+"-"+fm+"-"+String(bulkDaysInMonth(fy,fm)).padStart(2,"0"))return{mode:"month",month:fm,year:fy,customFrom:from,customTo:to,label:bulkMonthNames()[Number(fm)-1]+" "+fy};return{mode:"custom",month:fm||cm,year:fy||cy,customFrom:from||"",customTo:to||"",label:(from||"…")+" s.d. "+(to||"…")}}
function bulkSeedPeriod(from,to){let p=bulkDescribePeriod(from,to);setBulkPeriodMode(p.mode),setBulkPeriodMonth(p.month),setBulkPeriodYear(p.year),setBulkCustomFrom(p.customFrom),setBulkCustomTo(p.customTo),setBulkPeriodLabel(p.label)}
function bulkOpenPeriodDialog(){bulkSeedPeriod(bulkFrom,bulkTo),setBulkPeriodOpen(!0)}
function bulkApplyPeriod(){let from="",to="",label="";if("month"===bulkPeriodMode){let p=bulkMonthRange(bulkPeriodYear,bulkPeriodMonth);from=p.from,to=p.to,label=p.label}else if("year"===bulkPeriodMode){let p=bulkYearRange(bulkPeriodYear);from=p.from,to=p.to,label=p.label}else{from=bulkCustomFrom,to=bulkCustomTo;if(!from||!to)return void e.current?.show({severity:"warn",summary:"Periode belum lengkap",detail:"Tanggal awal dan akhir wajib dipilih."});if(from>to)return void e.current?.show({severity:"warn",summary:"Periode tidak valid",detail:"Tanggal awal tidak boleh melewati tanggal akhir."});label=from+" s.d. "+to}setBulkFrom(from),setBulkTo(to),setBulkPeriodLabel(label),setBulkPeriodOpen(!1)}
function bulkResetPeriod(){setBulkFrom(""),setBulkTo(""),setBulkPeriodLabel("Semua Periode"),setBulkPeriodOpen(!1)}

async function bulkShow(){let initial={status:""};setBulkVisible(!0),setBulkStep(1),setBulkSelected([]),setBulkType(null),setBulkData({}),setBulkStatusFilter(""),setBulkApplied(initial),setBulkLpPage(1),setBulkExpanded(!1),setBulkEditPage(1),setBulkPeriodOpen(!1),bulkCache.current.clear(),setBulkLoading(!0),setBulkLpLoading(!0);let seq=++bulkLoadSeq.current;try{let[docs,stats,lps]=await Promise.all([L.apiAuth.get("/bdb/wf/document-types"),L.apiAuth.get("/bdb/wf/status"),L.apiAuth.get("/bdb/laporan-polisi",{params:bulkQueryParams(initial,1,bulkPageSize||25)})]);if(seq!==bulkLoadSeq.current)return;let body=lps.data,rows=Array.isArray(body?.data)?body.data:[],total=Number(body?.total||0);setBulkTypes(Array.isArray(docs.data?.data)?docs.data.data:[]),setBulkStatuses(Array.isArray(stats.data?.data)?stats.data.data:[]),setBulkLpRows(rows),setBulkLpTotal(total),bulkCache.current.set(bulkCacheKey(initial,1,bulkPageSize||25),{rows:rows,total:total})}catch(err){if(seq!==bulkLoadSeq.current)return;e.current?.show({severity:"error",summary:"Gagal",detail:err.response?.data?.message||"Gagal memuat data update massal."})}finally{seq===bulkLoadSeq.current&&(setBulkLoading(!1),setBulkLpLoading(!1))}}

function bulkClose(){if(bulkBusy)return;bulkLoadSeq.current++,bulkCache.current.clear(),setBulkVisible(!1),setBulkStep(1),setBulkSelected([]),setBulkType(null),setBulkData({}),setBulkSearch(""),setBulkLpRows([]),setBulkLpTotal(0),setBulkLpPage(1),setBulkPeriodOpen(!1),setBulkExpanded(!1),setBulkEditPage(1)}
function bulkPickType(value){setBulkType(null==value?null:Number(value)),setBulkEditPage(1)}

async function bulkNext(){if(!bulkType)return void e.current?.show({severity:"warn",summary:"Pilih dokumen",detail:"Pilih dokumen yang akan diupdate."});if(!bulkSelected.length)return void e.current?.show({severity:"warn",summary:"Pilih LP",detail:"Pilih minimal satu LP."});let doc=bulkTypeDoc();if(!doc)return void e.current?.show({severity:"error",summary:"Dokumen tidak valid",detail:"Jenis dokumen tidak ditemukan."});setBulkPeriodOpen(!1),setBulkBusy(!0);try{let blocked=[];for(let row of bulkSelected){let id=bulkLpId(row);try{let res=await L.apiAuth.get("/bdb/wf/lp/"+id+"/available-actions"),action=(res.data?.data||[]).find(x=>Number(x.id)===Number(doc.id));action?.allowed||blocked.push((row.no_laporan||("LP #"+id))+": "+(action?.block_reason||"Prasyarat belum terpenuhi."))}catch(err){blocked.push((row.no_laporan||("LP #"+id))+": "+(err.response?.data?.message||"Gagal memeriksa alur."))}}if(blocked.length)return void e.current?.show({severity:"warn",summary:"Ada LP yang belum memenuhi alur",detail:blocked.slice(0,3).join(" | ")+(blocked.length>3?" | +"+(blocked.length-3)+" lainnya":""),life:8e3});let initial={...bulkData},tday=bulkToday();for(let row of bulkSelected){let id=bulkLpId(row);initial[id]=initial[id]||{nomor_dokumen:"PREMEMORY",tanggal_dokumen:tday}}setBulkData(initial),setBulkStep(2),setBulkEditPage(1)}finally{setBulkBusy(!1)}}

function bulkRenderInput(row,field){let id=bulkLpId(row),data=bulkData[id]||{};if(!bulkVisibleField(field,data))return(0,t.jsx)("span",{style:{color:"#94a3b8"},children:"—"});let value=data[field.field_key];if("select"===field.type)return(0,t.jsx)(i.Dropdown,{id:"bulk-dd-"+id+"-"+field.field_key,inputId:"bulk-dd-"+id+"-"+field.field_key+"-select",name:field.field_key,value:value??null,options:bulkOptions(field).map(v=>({label:String(v),value:v})),onChange:evt=>bulkSetField(id,field.field_key,evt.value),placeholder:"Pilih…",style:{width:"100%",minWidth:"11rem"},showClear:!0});if("date"===field.type)return(0,t.jsx)(l.InputText,{id:"bulk-"+id+"-"+field.field_key,name:field.field_key,type:"date",value:value||"",onChange:evt=>bulkSetField(id,field.field_key,evt.target.value),style:{width:"100%",minWidth:"9.5rem"}});if("textarea"===field.type)return(0,t.jsx)("textarea",{id:"bulk-"+id+"-"+field.field_key,name:field.field_key,value:value||"",onChange:evt=>bulkSetField(id,field.field_key,evt.target.value),rows:2,style:{width:"100%",minWidth:"13rem",padding:"0.5rem",border:"1px solid #cbd5e1",borderRadius:6,resize:"vertical"}});return(0,t.jsx)(l.InputText,{id:"bulk-"+id+"-"+field.field_key,name:field.field_key,value:value||"",onChange:evt=>bulkSetField(id,field.field_key,evt.target.value),style:{width:"100%",minWidth:"11rem"}})}

function bulkEditor(){let doc=bulkTypeDoc(),fields=bulkFields(doc),rows=bulkPageSize||25,pages=Math.max(1,Math.ceil(bulkSelected.length/rows)),page=Math.min(bulkEditPage,pages),start=(page-1)*rows,pageRows=bulkSelected.slice(start,start+rows),th={padding:"0.5rem",textAlign:"left",fontSize:"0.72rem",background:"#f8fafc",borderBottom:"1px solid #e2e8f0",whiteSpace:"nowrap",position:"sticky",top:0,zIndex:2},td={padding:"0.45rem",borderBottom:"1px solid #e2e8f0",verticalAlign:"top",fontSize:"0.78rem"};return(0,t.jsxs)("div",{style:{display:"grid",gap:"0.6rem"},children:[(0,t.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",gap:"0.7rem",flexWrap:"wrap",fontSize:"0.78rem",background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:8,padding:"0.55rem 0.7rem"},children:[(0,t.jsxs)("span",{children:["Dokumen: ",(0,t.jsx)("strong",{children:doc?.nama||"—"})," · ",bulkSelected.length," LP"]}),(0,t.jsx)("span",{style:{color:"#64748b"},children:"No. Dokumen kosong = PREMEMORY · Tanggal kosong = hari ini"})]}),(0,t.jsx)("div",{style:{overflow:"auto",border:"1px solid #e2e8f0",borderRadius:8,maxHeight:bulkExpanded?"calc(100vh - 250px)":"50vh"},children:(0,t.jsxs)("table",{style:{borderCollapse:"collapse",width:"100%",minWidth:Math.max(850,430+210*fields.length)+"px"},children:[(0,t.jsx)("thead",{children:(0,t.jsxs)("tr",{children:[(0,t.jsx)("th",{style:{...th,left:0,zIndex:4,width:"3.5rem"},children:"No"}),(0,t.jsx)("th",{style:{...th,left:"3.5rem",zIndex:4,minWidth:"19rem"},children:"No. LP"}),...fields.map(f=>(0,t.jsx)("th",{style:th,children:"nomor_dokumen"===f.field_key?"No. Dokumen":"tanggal_dokumen"===f.field_key?"Tgl. Dokumen":f.label||f.field_key},f.field_key))]})}),(0,t.jsx)("tbody",{children:pageRows.map((row,idx)=>(0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{...td,position:"sticky",left:0,background:"#fff",zIndex:1,fontWeight:700},children:start+idx+1}),(0,t.jsx)("td",{style:{...td,position:"sticky",left:"3.5rem",background:"#fff",zIndex:1,minWidth:"19rem",fontWeight:600},children:row.no_laporan||("LP #"+bulkLpId(row))}),...fields.map(f=>(0,t.jsx)("td",{style:td,children:bulkRenderInput(row,f)},f.field_key))]},bulkLpId(row)))})]})}),bulkPager(page,bulkSelected.length,rows,p=>setBulkEditPage(p),newSize=>{setBulkPageSize(newSize);setBulkEditPage(1)})]})}

async function bulkSubmit(){let doc=bulkTypeDoc();if(!doc)return;let fields=bulkFields(doc),today=bulkToday(),prepared=[],invalid=[];for(let row of bulkSelected){let id=bulkLpId(row),data={...(bulkData[id]||{})};bulkEmpty(data.nomor_dokumen)&&(data.nomor_dokumen="PREMEMORY"),bulkEmpty(data.tanggal_dokumen)&&(data.tanggal_dokumen=today);let missing=fields.filter(f=>bulkVisibleField(f,data)&&"nomor_dokumen"!==f.field_key&&"tanggal_dokumen"!==f.field_key&&bulkEmpty(data[f.field_key]));if(missing.length)invalid.push((row.no_laporan||("LP #"+id))+": "+missing.map(f=>f.label||f.field_key).join(", "));else prepared.push({row,id,data})}if(invalid.length)return void e.current?.show({severity:"warn",summary:"Data wajib belum lengkap",detail:invalid.slice(0,3).join(" | ")+(invalid.length>3?" | +"+(invalid.length-3)+" lainnya":""),life:8e3});if(!await (0,T.confirmAction)("Update "+prepared.length+" LP menggunakan "+doc.nama+"?",{header:"Konfirmasi Update Status Massal",acceptLabel:"Proses Update"}))return;setBulkBusy(!0);let failed=[];try{for(let item of prepared){try{let form=new FormData;form.append("document_type_id",String(doc.id)),form.append("data",JSON.stringify(item.data)),await L.apiAuth.post("/bdb/wf/lp/"+item.id+"/dokumen",form,{headers:{"Content-Type":void 0}})}catch(err){failed.push({row:item.row,message:Array.isArray(err.response?.data?.message)?err.response.data.message.join(", "):err.response?.data?.message||"Gagal menyimpan."})}}await Promise.all([eZ(),eQ()]);if(failed.length){setBulkSelected(failed.map(x=>x.row)),setBulkEditPage(1),e.current?.show({severity:"warn",summary:"Update massal sebagian berhasil",detail:(prepared.length-failed.length)+" berhasil · "+failed.length+" gagal. "+failed.slice(0,2).map(x=>(x.row.no_laporan||("LP #"+bulkLpId(x.row)))+": "+x.message).join(" | "),life:1e4})}else{bulkCache.current.clear(),e.current?.show({severity:"success",summary:"Update status massal selesai",detail:prepared.length+" LP berhasil diperbarui.",life:6e3}),setBulkVisible(!1),setBulkStep(1),setBulkSelected([]),setBulkType(null),setBulkData({}),setBulkExpanded(!1),setBulkEditPage(1)}}finally{setBulkBusy(!1)}}
async function eq(e){ew(e),eO(null);try{let t=await L.apiAuth.get(`/bdb/laporan-polisi/${e.id}`),n=t.data?.data;eO(n?.payload_json||null)}catch{eO(null)}}async function eY(e){let t=e.query?.trim();if(!t||t.length<2)return void eN([]);try{let e=await L.apiAuth.get("/bdb/satker/search",{params:{q:t,limit:25}});eN(e.data?.data||[])}catch{eN([])}}async function eJ(){if(!eC||!eL)return void e.current?.show({severity:"warn",summary:"Pilih satker",detail:"Pilih satker tujuan dulu."});if(await (0,T.confirmAction)(`Ubah satker penanganan LP "${eC.no_laporan}" dari "${eC.satker_nama||"—"}" ke "${eL.deskripsi}"? Ini koreksi mapping langsung (bukan pelimpahan) dan tercatat di log audit.`,{danger:!0,acceptLabel:"Ubah Satker"})){eR(!0);try{(0,L.assertOk)(await L.apiAuth.post(`/bdb/laporan-polisi/${eC.id}/correct-satker`,{satker_id:eL.id,keterangan:eA||void 0})),e.current?.show({severity:"success",summary:"Diperbarui",detail:`Satker penanganan diubah ke ${eL.deskripsi}.`}),eI(null),await Promise.all([eZ(),eQ()])}catch(t){e.current?.show({severity:"error",summary:"Gagal",detail:t.response?.data?.message||"Gagal mengubah satker."})}finally{eR(!1)}}}async function eX(){if(eB){if(!eH.trim())return void e.current?.show({severity:"warn",summary:"Lengkapi",detail:"Keterangan/alasan hapus wajib diisi."});if(await (0,T.confirmAction)(`Hapus LP "${eB.no_laporan}"? LP akan disembunyikan dari daftar (masih tersimpan di database, bisa ditelusuri lewat log audit).`,{danger:!0,acceptLabel:"Ya, Hapus"})){eW(!0);try{(0,L.assertOk)(await L.apiAuth.post(`/bdb/laporan-polisi/${eB.id}/soft-delete`,{keterangan:eH})),e.current?.show({severity:"success",summary:"Dihapus",detail:`LP "${eB.no_laporan}" dihapus.`}),ez(null),await Promise.all([eZ(),eQ()])}catch(t){e.current?.show({severity:"error",summary:"Gagal",detail:t.response?.data?.message||"Gagal menghapus LP."})}finally{eW(!1)}}}}let eZ=(0,n.useCallback)(async()=>{try{let e=await L.apiAuth.get("/bdb/laporan-polisi/stats",{params:{...eAP.level?{level:eAP.level}:{},...eAP.model?{model:eAP.model}:{},...eAP.from?{from:eAP.from}:{},...eAP.to?{to:eAP.to}:{},...eAP.search?{search:eAP.search}:{},...eAP.functionDomain?{functionDomain:eAP.functionDomain,organizationDomain:"INTERNAL_POLRI"}:{},...eAP.jenisKejahatanIds?{jenis_kejahatan_ids:eAP.jenisKejahatanIds}:{},...eAP.targetSatkerId?{target_satker_id:eAP.targetSatkerId}:{}}});er(e.data?.data||null)}catch{}},[eAP]),eQ=(0,n.useCallback)(async()=>{let t=++en.current;et(!0);try{let e=Math.floor(ev/ej)+1,n=await L.apiAuth.get("/bdb/laporan-polisi",{params:{...eAP.level?{level:eAP.level}:{},...eAP.model?{model:eAP.model}:{},...eAP.status?{status:eAP.status}:{},...eAP.from?{from:eAP.from}:{},...eAP.to?{to:eAP.to}:{},...eAP.search?{search:eAP.search}:{},...eAP.functionDomain?{functionDomain:eAP.functionDomain,organizationDomain:"INTERNAL_POLRI"}:{},...eAP.jenisKejahatanIds?{jenis_kejahatan_ids:eAP.jenisKejahatanIds}:{},...eAP.targetSatkerId?{target_satker_id:eAP.targetSatkerId}:{},page:e,row:ej}});if(t!==en.current)return;let a=n.data;X(Array.isArray(a?.data)?a.data:[]),Q(a?.total||0)}catch(n){if(t!==en.current)return;e.current?.show({severity:"error",summary:"Gagal memuat ulang",detail:n?.response?.data?.message||"Data sebelumnya tetap ditampilkan. Coba lagi.",life:6e3})}finally{t===en.current&&et(!1)}},[ev,ej,eAP]);async function e0(){if(await (0,T.confirmAction)("Petakan LP DORS terbaru ke Laporan Polisi? Hanya LP yang kode Pusiknas-nya cocok dengan satker yang disalin.")){ei(!0);try{let t=await L.apiAuth.post("/bdb/laporan-polisi/map",{}),n=t.data?.data;e.current?.show({severity:"success",summary:"Pemetaan selesai",detail:`${n?.mapped_baru??0} LP baru dipetakan \xb7 ${n?.belum_termapping??0} belum termapping`,life:6e3}),await Promise.all([eZ(),eQ()])}catch(t){e.current?.show({severity:"error",summary:"Gagal",detail:t.response?.data?.message||"Gagal memetakan"})}finally{ei(!1)}}}(0,n.useEffect)(()=>{eZ()},[eZ]),(0,n.useEffect)(()=>{eQ()},[eQ]);let e1=ea?.per_level||{},e2=[{label:"Semua satker",value:""},{label:`Mabes (${e1.Mabes??0})`,value:"Mabes"},{label:`Polda (${e1.Polda??0})`,value:"Polda"},{label:`Polres (${e1.Polres??0})`,value:"Polres"},{label:`Polsek (${e1.Polsek??0})`,value:"Polsek"}],e4=[{label:"Semua status",value:""},...(ea?.per_status||[]).map(e=>({label:`${e.nama} (${e.jumlah})`,value:e.code}))];return(0,t.jsxs)("div",{children:[(0,t.jsx)(c.Toast,{ref:e}),(0,t.jsx)(d.ConfirmDialog,{}),eTargetSatker&&(0,t.jsxs)("div",{style:{marginBottom:"1rem",padding:"0.75rem 1.25rem",background:"linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",border:"1px solid #93c5fd",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"space-between",gap:"1rem"},children:[(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.75rem"},children:[(0,t.jsx)("i",{className:"pi pi-shield",style:{fontSize:"1.4rem",color:"#1d4ed8",flex:"0 0 auto"}}),(0,t.jsxs)("div",{children:[(0,t.jsxs)("div",{style:{fontWeight:700,fontSize:"0.92rem",color:"#1e3a8a"},children:["Mode Supervisi / Monitoring Satker Regional: ",eTargetSatker.deskripsi||eTargetSatker.name]}),(0,t.jsx)("div",{style:{fontSize:"0.8rem",color:"#3b82f6"},children:"Anda sedang memantau Daftar LP satker bawahan. Seluruh akses dan tindakan terikat pernyataan pertanggungjawaban kedinasan."})]})]}),(0,t.jsx)(o.Button,{label:"Kembali ke Satker Saya",icon:"pi pi-refresh",size:"small",severity:"secondary",onClick:handleResetSatker,style:{whiteSpace:"nowrap"}})]}),(0,t.jsxs)("div",{style:{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:"1rem",flexWrap:"wrap"},children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h1",{className:"cms-page-title",children:"Laporan Polisi"}),(0,t.jsx)("p",{className:"cms-page-sub",children:"LP dari DORS yang sudah termapping ke satker — siap untuk aktivitas berikutnya."})]}),eBulkAllowed&&(0,t.jsxs)("div",{style:{display:"flex",gap:"0.5rem",alignItems:"center",marginTop:"0.25rem",flexWrap:"wrap"},children:[(0,t.jsx)(o.Button,{label:"Update Status Massal",icon:"pi pi-pencil",onClick:bulkShow,className:"att-btn"}),eG.isSuperadmin&&(0,t.jsxs)(o.Button,{onClick:e0,loading:el,className:"att-btn",outlined:!0,children:[(0,t.jsx)(h.RefreshCw,{size:16,style:{marginRight:"0.4rem"}})," ",el?"Memetakan…":"Petakan LP Terbaru"]})]})]}),(0,t.jsxs)("div",{className:"lp-status-cards",children:[(0,t.jsxs)("button",{type:"button",className:`lp-stat total${""===eu?" active":""}`,onClick:()=>{ec(""),ex(0),eSetAP({level:eo,status:"",model:ed,from:em,to:eg,search:eh.trim(),functionDomain:eFD,jenisKejahatanIds:eCrime||"",targetSatkerId:eTargetSatker?.id?String(eTargetSatker.id):""})},children:[(0,t.jsx)("div",{className:"n",children:(ea?.total??0).toLocaleString("id-ID")}),(0,t.jsx)("div",{className:"l",children:"Semua LP"})]}),(ea?.per_status||[]).map(e=>{let n;return(0,t.jsxs)("button",{type:"button",className:`lp-stat ${"CC"===e.kategori?"cc":"ct"}${eu===e.code?" active":""}`,onClick:()=>{let t=eu===e.code?"":e.code;ec(t),ex(0),eSetAP({level:eo,status:t,model:ed,from:em,to:eg,search:eh.trim(),functionDomain:eFD,jenisKejahatanIds:eCrime||"",targetSatkerId:eTargetSatker?.id?String(eTargetSatker.id):""})},title:e.nama,children:[(0,t.jsx)("div",{className:"n",children:e.jumlah.toLocaleString("id-ID")}),(0,t.jsx)("div",{className:"l",children:"PERMA"===e.code?"PERMA":G[n=e.code]||n.replace(/_/g," ")})]},e.code)})]}),(0,t.jsxs)("div",{className:"cms-card",style:{padding:0,overflow:(mainPeriodOpen||satkerOpen||crimeOpen)?"visible":"hidden"},children:[(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.6rem",flexWrap:"wrap",padding:"0.75rem 1rem"},children:[(0,t.jsxs)("div",{
    style:{position:"relative",flex:"0 0 auto"},
    children:[
        (0,t.jsx)(o.Button,{
            label:(()=>{
                let mLabel = ed === "lp_model_a" ? "Model A" : ed === "lp_model_b" ? "Model B" : "";
                let sObj = (ea?.per_status || []).find(s => s.code === eu);
                let sLabel = sObj ? sObj.nama : (eu ? eu.replace(/_/g, " ") : "");
                if (mLabel && sLabel) return "Kelompok: " + mLabel + " · " + sLabel;
                if (mLabel) return "Model: " + mLabel;
                if (sLabel) return "Status: " + sLabel;
                return "Kelompok Data";
            })(),
            icon:"pi pi-sliders-h",
            outlined:!0,
            onClick:()=>{
                if(kelompokDataOpen){
                    setKelompokDataOpen(!1);
                } else {
                    setDraftModel(ed||"");
                    setDraftStatus(eu||"");
                    setKelompokDataOpen(!0);
                    setSatkerOpen(!1);
                    setCrimeOpen(!1);
                    setMainPeriodOpen(!1);
                }
            },
            style:{
                minWidth:"13rem",
                justifyContent:"flex-start",
                whiteSpace:"nowrap",
                fontWeight:(ed||eu)?700:500,
                borderColor:(ed||eu)?"#3b82f6":"#cbd5e1",
                color:(ed||eu)?"#1d4ed8":undefined
            }
        }),
        kelompokDataOpen&&(0,t.jsx)("div",{style:{position:"fixed",inset:0,zIndex:99},onClick:()=>setKelompokDataOpen(!1)}),
        kelompokDataOpen&&(0,t.jsxs)("div",{
            className:"lp-kelompok-popover",
            style:{
                position:"absolute",
                left:0,
                top:"calc(100% + 0.45rem)",
                zIndex:100,
                width:"26rem",
                maxWidth:"calc(100vw - 2rem)",
                background:"#fff",
                border:"1px solid #dbe3ee",
                borderRadius:10,
                boxShadow:"0 14px 36px rgba(15,23,42,.16)",
                padding:"0.85rem"
            },
            children:[
                (0,t.jsxs)("div",{
                    style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.65rem"},
                    children:[
                        (0,t.jsx)("div",{style:{fontWeight:800,color:"#0f172a",fontSize:"0.95rem"},children:"Kelompok Data Laporan"}),
                        (0,t.jsx)("button",{type:"button",onClick:()=>setKelompokDataOpen(!1),style:{background:"none",border:"none",cursor:"pointer",color:"#64748b",fontSize:"1.1rem",lineHeight:1,padding:"0.2rem"},children:"×"})
                    ]
                }),
                // Subcard 1: Model LP
                (0,t.jsxs)("div",{
                    style:{marginBottom:"0.65rem",background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:8,padding:"0.55rem 0.65rem"},
                    children:[
                        (0,t.jsx)("div",{
                            style:{fontSize:"0.72rem",fontWeight:700,color:"#475569",textTransform:"uppercase",letterSpacing:"0.03em",marginBottom:"0.35rem"},
                            children:"1. Model LP"
                        }),
                        (0,t.jsx)("div",{
                            style:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"0.35rem"},
                            children:[
                                {value:"",label:"Semua Model"},
                                {value:"lp_model_a",label:"LP Model A"},
                                {value:"lp_model_b",label:"LP Model B"}
                            ].map(m=>{
                                let checked = draftModel === m.value;
                                return (0,t.jsx)("div",{
                                    key:m.value,
                                    onClick:()=>setDraftModel(m.value),
                                    style:{
                                        textAlign:"center",
                                        padding:"0.4rem 0.25rem",
                                        fontSize:"0.75rem",
                                        fontWeight:checked?700:500,
                                        color:checked?"#1d4ed8":"#334155",
                                        background:checked?"#eff6ff":"#fff",
                                        border:"1px solid "+(checked?"#3b82f6":"#cbd5e1"),
                                        borderRadius:6,
                                        cursor:"pointer",
                                        userSelect:"none"
                                    },
                                    children:m.label
                                });
                            })
                        })
                    ]
                }),
                // Subcard 2: Status LP
                (0,t.jsxs)("div",{
                    style:{marginBottom:"0.75rem",background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:8,padding:"0.55rem 0.65rem"},
                    children:[
                        (0,t.jsxs)("div",{
                            style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.35rem"},
                            children:[
                                (0,t.jsx)("span",{
                                    style:{fontSize:"0.72rem",fontWeight:700,color:"#475569",textTransform:"uppercase",letterSpacing:"0.03em"},
                                    children:"2. Status LP"
                                }),
                                (0,t.jsx)("span",{
                                    style:{fontSize:"0.7rem",color:"#64748b"},
                                    children:ea?.total ? ea.total + " Perkara" : ""
                                })
                            ]
                        }),
                        (0,t.jsx)("div",{
                            style:{maxHeight:"14rem",overflowY:"auto",display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"0.3rem",paddingRight:"0.2rem"},
                            children:[
                                {code:"",nama:"Semua Status",count:ea?.total||0},
                                ...(ea?.per_status||[]).map(s=>({code:s.code,nama:s.nama,count:s.count||0}))
                            ].map(s=>{
                                let checked = draftStatus === s.code;
                                return (0,t.jsxs)("div",{
                                    key:s.code,
                                    onClick:()=>setDraftStatus(s.code),
                                    style:{
                                        display:"flex",
                                        alignItems:"center",
                                        justifyContent:"space-between",
                                        padding:"0.35rem 0.5rem",
                                        fontSize:"0.74rem",
                                        fontWeight:checked?700:500,
                                        color:checked?"#1d4ed8":"#334155",
                                        background:checked?"#eff6ff":"#fff",
                                        border:"1px solid "+(checked?"#3b82f6":"#cbd5e1"),
                                        borderRadius:6,
                                        cursor:"pointer",
                                        userSelect:"none"
                                    },
                                    children:[
                                        (0,t.jsx)("span",{style:{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:s.nama}),
                                        s.count > 0 ? (0,t.jsx)("span",{style:{marginLeft:"0.3rem",fontSize:"0.68rem",background:checked?"#dbeafe":"#f1f5f9",color:checked?"#1e40af":"#64748b",borderRadius:4,padding:"0.05rem 0.35rem"},children:s.count}) : null
                                    ]
                                });
                            })
                        })
                    ]
                }),
                // Footer
                (0,t.jsxs)("div",{
                    style:{display:"flex",justifyContent:"space-between",alignItems:"center",borderTop:"1px solid #e2e8f0",paddingTop:"0.55rem"},
                    children:[
                        (0,t.jsx)("button",{
                            type:"button",
                            onClick:()=>{
                                setDraftModel("");
                                setDraftStatus("");
                                ep("");
                                ec("");
                                setKelompokDataOpen(!1);
                                ex(0);
                                eSetAP({
                                    level:eo,
                                    status:"",
                                    model:"",
                                    from:em,
                                    to:eg,
                                    search:eh.trim(),
                                    functionDomain:eFD,
                                    jenisKejahatanIds:eCrime||"",
                                    targetSatkerId:eTargetSatker?.id?String(eTargetSatker.id):""
                                });
                            },
                            style:{background:"none",border:"none",color:"#64748b",fontSize:"0.78rem",cursor:"pointer",padding:"0.2rem"},
                            children:"Reset"
                        }),
                        (0,t.jsxs)("div",{
                            style:{display:"flex",gap:"0.4rem"},
                            children:[
                                (0,t.jsx)("button",{
                                    type:"button",
                                    onClick:()=>setKelompokDataOpen(!1),
                                    style:{background:"#f1f5f9",border:"1px solid #cbd5e1",borderRadius:6,padding:"0.35rem 0.8rem",fontSize:"0.78rem",cursor:"pointer"},
                                    children:"Batal"
                                }),
                                (0,t.jsx)("button",{
                                    type:"button",
                                    onClick:()=>{
                                        ep(draftModel);
                                        ec(draftStatus);
                                        setKelompokDataOpen(!1);
                                        ex(0);
                                        eSetAP({
                                            level:eo,
                                            status:draftStatus,
                                            model:draftModel,
                                            from:em,
                                            to:eg,
                                            search:eh.trim(),
                                            functionDomain:eFD,
                                            jenisKejahatanIds:eCrime||"",
                                            targetSatkerId:eTargetSatker?.id?String(eTargetSatker.id):""
                                        });
                                    },
                                    style:{background:"#2563eb",color:"#fff",border:"none",borderRadius:6,padding:"0.35rem 1rem",fontSize:"0.78rem",fontWeight:600,cursor:"pointer"},
                                    children:"Terapkan"
                                })
                            ]
                        })
                    ]
                })
            ]
        })
    ]
}),
(0,t.jsxs)("div",{
    style:{position:"relative",flex:"0 0 auto"},
    children:[
        (0,t.jsx)(o.Button,{
            label:(()=>{
                if(eTargetSatker){let d=eTargetSatker.deskripsi||eTargetSatker.name||"";return "Supervisi: "+(d.length>22?d.slice(0,20)+"…":d);}
                if(eo)return "Satker: "+eo;let u=(0,E.getUser)();let sName=u?.satker_nama||u?.satker?.deskripsi||u?.organisasi?.deskripsi;if(sName&&!eV)return "Satker: "+(sName.length>22?sName.slice(0,20)+"…":sName);
                return "Semua Satker";
            })(),
            icon:"pi pi-building",
            outlined:!0,
            onClick:openSatkerModal,
            style:{minWidth:"12rem",justifyContent:"flex-start",whiteSpace:"nowrap"}
        }),
        satkerOpen&&(0,t.jsx)("div",{style:{position:"fixed",inset:0,zIndex:99},onClick:()=>setSatkerOpen(!1)}),
        satkerOpen&&(0,t.jsxs)("div",{
            className:"lp-satker-popover",
            style:{
                position:"absolute",
                left:0,
                top:"calc(100% + 0.45rem)",
                zIndex:100,
                width:"32rem",
                maxWidth:"calc(100vw - 2rem)",
                background:"#fff",
                border:"1px solid #dbe3ee",
                borderRadius:10,
                boxShadow:"0 14px 36px rgba(15,23,42,.16)",
                padding:"0.85rem"
            },
            children:[
                (0,t.jsxs)("div",{
                    style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.6rem"},
                    children:[
                        (0,t.jsx)("div",{style:{fontWeight:800,color:"#0f172a",fontSize:"0.95rem"},children:"Pilih Satker / Cakupan & Tingkat"}),
                        (0,t.jsx)("button",{type:"button",onClick:()=>setSatkerOpen(!1),style:{background:"none",border:"none",cursor:"pointer",color:"#64748b",fontSize:"1.1rem",lineHeight:1,padding:"0.2rem"},children:"×"})
                    ]
                }),
                (0,t.jsxs)("div",{
                    style:{marginBottom:"0.65rem",background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:8,padding:"0.55rem"},
                    children:[
                        (0,t.jsx)("div",{style:{fontSize:"0.72rem",fontWeight:700,color:"#475569",textTransform:"uppercase",letterSpacing:"0.03em",marginBottom:"0.35rem"},children:"Cakupan Satker"}),
                        (0,t.jsx)(i.Dropdown,{
                            id:"lp-satker-scope",
                            inputId:"lp-satker-scope-select",
                            name:"satker_scope",
                            value:satkerDraftFD,
                            options:[
                                {label:"Semua Cakupan",value:""},
                                {label:"Internal Reserse",value:"INTERNAL_RESERSE"},
                                {label:"Eksternal Reserse / Non-Reserse",value:"EKSTERNAL_RESERSE"},
                                {label:"Eksternal Polri",value:"EKSTERNAL_POLRI"}
                            ],
                            onChange:e=>{
                                let val = e.value;
                                setSatkerDraftFD(val);
                                doSearchSatker(satkerSearchQuery, val, satkerLevels, 1);
                            },
                            placeholder:"Pilih Cakupan Satker",
                            style:{width:"100%"}
                        })
                    ]
                }),
                (0,t.jsxs)("div",{
                    style:{marginBottom:"0.75rem",background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:8,padding:"0.6rem"},
                    children:[
                        (0,t.jsxs)("div",{
                            style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.4rem"},
                            children:[
                                (0,t.jsx)("span",{style:{fontSize:"0.72rem",fontWeight:700,color:"#475569",textTransform:"uppercase",letterSpacing:"0.03em"},children:"Tingkat Penanganan"}),
                                (0,t.jsxs)("div",{style:{display:"flex",gap:"0.4rem"},children:[
                                    (0,t.jsx)("button",{
                                        type:"button",
                                        onClick:()=>{
                                            let allLevels=["Mabes","Polda","Polres","Polsek"];
                                            setSatkerLevels(allLevels);
                                            doSearchSatker(satkerSearchQuery,satkerDraftFD,allLevels,1);
                                        },
                                        style:{background:"none",border:"none",color:"#2563eb",fontSize:"0.7rem",cursor:"pointer",padding:0,textDecoration:"underline"},
                                        children:"Pilih Semua"
                                    }),
                                    (0,t.jsx)("span",{style:{color:"#cbd5e1",fontSize:"0.7rem"},children:"|"}),
                                    (0,t.jsx)("button",{
                                        type:"button",
                                        onClick:()=>{
                                            setSatkerLevels([]);
                                            doSearchSatker(satkerSearchQuery,satkerDraftFD,[],1);
                                        },
                                        style:{background:"none",border:"none",color:"#64748b",fontSize:"0.7rem",cursor:"pointer",padding:0,textDecoration:"underline"},
                                        children:"Kosongkan"
                                    })
                                ]})
                            ]
                        }),
                        (0,t.jsx)("div",{
                            style:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"0.4rem"},
                            children:[
                                {name:"Mabes",count:e1.Mabes??0},
                                {name:"Polda",count:e1.Polda??0},
                                {name:"Polres",count:e1.Polres??0},
                                {name:"Polsek",count:e1.Polsek??0}
                            ].map(lvl=>{
                                let checked=satkerLevels.includes(lvl.name);
                                return (0,t.jsxs)("label",{
                                    key:lvl.name,
                                    style:{display:"flex",alignItems:"center",gap:"0.35rem",background:checked?"#eff6ff":"#fff",border:"1px solid "+(checked?"#3b82f6":"#cbd5e1"),borderRadius:6,padding:"0.35rem 0.45rem",cursor:"pointer",userSelect:"none"},
                                    children:[
                                        (0,t.jsx)("input",{id:"satker-lvl-"+lvl.name,name:"satker_level",type:"checkbox",checked:checked,onChange:()=>toggleSatkerLevel(lvl.name),style:{cursor:"pointer"}}),
                                        (0,t.jsxs)("div",{style:{lineHeight:1.15},children:[
                                            (0,t.jsx)("div",{style:{fontSize:"0.78rem",fontWeight:checked?700:500,color:checked?"#1d4ed8":"#1e293b"},children:lvl.name}),
                                            (0,t.jsx)("div",{style:{fontSize:"0.65rem",color:checked?"#3b82f6":"#64748b"},children:(lvl.count).toLocaleString("id-ID")})
                                        ]})
                                    ]
                                });
                            })
                        })
                    ]
                }),
                (0,t.jsxs)("div",{
                    style:{marginBottom:"0.75rem"},
                    children:[
                        (0,t.jsxs)("div",{
                            style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.35rem"},
                            children:[
                                (0,t.jsx)("span",{style:{fontSize:"0.75rem",fontWeight:700,color:"#475569",textTransform:"uppercase",letterSpacing:"0.03em"},children:"Satker Spesifik"}),
                                satkerDraftTarget&&(0,t.jsxs)("span",{style:{fontSize:"0.7rem",color:"#059669",background:"#ecfdf5",border:"1px solid #a7f3d0",borderRadius:4,padding:"0.1rem 0.35rem",display:"inline-flex",alignItems:"center",gap:"0.3rem"},children:[
                                    (0,t.jsx)("strong",{children:satkerDraftTarget.deskripsi}),
                                    (0,t.jsx)("button",{type:"button",onClick:()=>setSatkerDraftTarget(null),style:{background:"none",border:"none",color:"#059669",cursor:"pointer",fontWeight:700,padding:0,lineHeight:1},children:"×"})
                                ]})
                            ]
                        }),
                        (0,t.jsxs)("div",{
                            style:{display:"flex",alignItems:"center",gap:"0.4rem",marginBottom:"0.45rem"},
                            children:[
                                (0,t.jsxs)("div",{
                                    style:{position:"relative",flex:1},
                                    children:[
                                        (0,t.jsx)(l.InputText,{
                                            id:"lp-satker-search",
                                            name:"satker_search",
                                            value:satkerSearchQuery,
                                            onChange:e=>setSatkerSearchQuery(e.target.value),
                                            onKeyDown:e=>{
                                                if(e.key==="Enter"){
                                                    e.preventDefault();
                                                    doSearchSatker(satkerSearchQuery,satkerDraftFD,satkerLevels,1);
                                                }
                                            },
                                            placeholder:"Ketik nama satker, lalu tekan Enter…",
                                            style:{width:"100%",paddingRight:"2rem",fontSize:"0.82rem"}
                                        }),
                                        satkerSearchQuery&&(0,t.jsx)("button",{
                                            type:"button",
                                            onClick:()=>{
                                                setSatkerSearchQuery("");
                                                doSearchSatker("",satkerDraftFD,satkerLevels,1);
                                            },
                                            style:{position:"absolute",right:"0.5rem",top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#94a3b8",cursor:"pointer",fontSize:"1rem"},
                                            children:"×"
                                        })
                                    ]
                                }),
                                (0,t.jsx)(o.Button,{
                                    icon:"pi pi-search",
                                    tooltip:"Cari (Enter)",
                                    size:"small",
                                    onClick:()=>doSearchSatker(satkerSearchQuery,satkerDraftFD,satkerLevels,1),
                                    style:{padding:"0.45rem 0.75rem",fontSize:"0.8rem"}
                                })
                            ]
                        }),
                        (()=>{
                            let pageSize = 5;
                            let total = satkerTotal;
                            let totalPages = Math.max(1, Math.ceil(total / pageSize));
                            let curPage = satkerPage;
                            let paged = satkerResults;

                            return (0,t.jsxs)("div",{
                                children:[
                                    (0,t.jsx)("div",{
                                        style:{border:"1px solid #e2e8f0",borderRadius:8,overflow:"hidden",background:"#fff",minHeight:"8.5rem"},
                                        children:satkerLoading?(0,t.jsx)("div",{style:{padding:"1.5rem",textAlign:"center",color:"#64748b",fontSize:"0.8rem"},children:"Mencari satker…"}):paged.length===0?(0,t.jsx)("div",{style:{padding:"1.5rem",textAlign:"center",color:"#94a3b8",fontSize:"0.8rem"},children:"Tidak ada satker ditemukan. Coba ketik kata kunci lain."}):(0,t.jsx)("div",{
                                            style:{display:"grid"},
                                            children:paged.map(item=>{
                                                let isSelected = satkerDraftTarget?.id === item.id;
                                                return (0,t.jsxs)("div",{
                                                    key:item.id,
                                                    onClick:()=>setSatkerDraftTarget(isSelected ? null : item),
                                                    style:{
                                                        display:"flex",
                                                        alignItems:"center",
                                                        justifyContent:"space-between",
                                                        gap:"0.5rem",
                                                        padding:"0.4rem 0.65rem",
                                                        borderBottom:"1px solid #f1f5f9",
                                                        cursor:"pointer",
                                                        background:isSelected?"#f0fdf4":"transparent",
                                                        transition:"background 0.15s"
                                                    },
                                                    children:[
                                                        (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.45rem",minWidth:0},children:[
                                                            (0,t.jsx)("input",{id:"satker-radio-"+item.id,name:"satker_radio",type:"radio",checked:isSelected,readOnly:!0,style:{cursor:"pointer"}}),
                                                            (0,t.jsx)("label",{htmlFor:"satker-radio-"+item.id,style:{fontSize:"0.8rem",fontWeight:isSelected?700:400,color:isSelected?"#15803d":"#1e293b",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",cursor:"pointer"},children:item.deskripsi})
                                                        ]}),
                                                        (()=>{let isR=item.deskripsi&&(item.deskripsi.includes("SAT RESKRIM")||item.deskripsi.includes("SATRESKRIM"));let isN=item.deskripsi&&(item.deskripsi.includes("SAT NARKOBA")||item.deskripsi.includes("SATRESNARKOBA"));let bText=isR?"SATRESKRIM":isN?"SATNARKOBA":item.tipe_satker;let bBg=isR?"#eff6ff":isN?"#fdf2f8":"#f1f5f9";let bClr=isR?"#1d4ed8":isN?"#be185d":"#64748b";let bBdr=isR?"#bfdbfe":isN?"#fbcfe8":"#e2e8f0";return bText?(0,t.jsx)("span",{style:{fontSize:"0.65rem",fontWeight:isR||isN?700:500,color:bClr,background:bBg,border:"1px solid "+bBdr,borderRadius:4,padding:"0.05rem 0.35rem",flexShrink:0},children:bText}):null;})()
                                                    ]
                                                });
                                            })
                                        })
                                    }),
                                    total > pageSize && (0,t.jsxs)("div",{
                                        style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:"0.4rem",fontSize:"0.72rem",color:"#64748b"},
                                        children:[
                                            (0,t.jsxs)("span",{children:["Menampilkan ",total === 0 ? 0 : (curPage-1)*pageSize+1,"-",Math.min(curPage*pageSize,total)," dari ",total.toLocaleString("id-ID")]}),
                                            (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.3rem"},children:[
                                                (0,t.jsx)(o.Button,{icon:"pi pi-chevron-left",label:"Prev",disabled:curPage<=1||satkerLoading,onClick:()=>doSearchSatker(satkerSearchQuery,satkerDraftFD,satkerLevels,curPage-1),size:"small",text:!0,style:{padding:"0.15rem 0.4rem",fontSize:"0.72rem"}}),
                                                (0,t.jsxs)("span",{style:{fontWeight:600},children:[curPage," / ",totalPages]}),
                                                (0,t.jsx)(o.Button,{icon:"pi pi-chevron-right",iconPos:"right",label:"Next",disabled:curPage>=totalPages||satkerLoading,onClick:()=>doSearchSatker(satkerSearchQuery,satkerDraftFD,satkerLevels,curPage+1),size:"small",text:!0,style:{padding:"0.15rem 0.4rem",fontSize:"0.72rem"}})
                                            ]})
                                        ]
                                    })
                                ]
                            });
                        })()
                    ]
                }),
                (0,t.jsxs)("div",{
                    style:{display:"flex",justifyContent:"flex-end",gap:"0.45rem",borderTop:"1px solid #e2e8f0",paddingTop:"0.6rem"},
                    children:[
                        (0,t.jsx)(o.Button,{label:"Reset",icon:"pi pi-refresh",text:!0,onClick:handleResetSatker}),
                        (0,t.jsx)(o.Button,{label:"Terapkan",icon:"pi pi-check",onClick:handleApplySatker})
                    ]
                })
            ]
        })
    ]
}),
(0,t.jsxs)("div",{
    style:{position:"relative",flex:"0 0 auto"},
    children:[
        (0,t.jsx)(o.Button,{
            label:(()=>{
                if(!eCrime) return "Semua Jenis Kejahatan";
                let curIds = eCrime.split(",").map(strVal => Number(strVal.trim())).filter(Boolean);
                let count = curIds.length;
                if(count === 0) return "Semua Jenis Kejahatan";
                if(allCrimes.length > 0){
                    let firstCrime = allCrimes.find(c => Number(c.id) === curIds[0]);
                    if(firstCrime && firstCrime.domain){
                        let tipidCrimes = allCrimes.filter(c => c.domain === firstCrime.domain);
                        if(tipidCrimes.length > 0 && tipidCrimes.length === count && tipidCrimes.every(c => curIds.includes(Number(c.id)))){
                            return "TIPID: " + firstCrime.domain + " (" + count + ")";
                        }
                    }
                    if(firstCrime && firstCrime.kelompok){
                        let kelCrimes = allCrimes.filter(c => c.kelompok === firstCrime.kelompok);
                        if(kelCrimes.length > 0 && kelCrimes.length === count && kelCrimes.every(c => curIds.includes(Number(c.id)))){
                            return "Kelompok: " + firstCrime.kelompok + " (" + count + ")";
                        }
                    }
                }
                let matched = allCrimes.find(c => Number(c.id) === curIds[0]);
                let firstName = matched ? matched.nama : "Kejahatan (" + count + ")";
                if(count === 1) return "Kejahatan: " + (firstName.length > 20 ? firstName.slice(0, 18) + "…" : firstName);
                return "Kejahatan: " + (firstName.length > 15 ? firstName.slice(0, 13) + "…" : firstName) + " (+" + (count - 1) + ")";
            })(),
            icon:"pi pi-shield",
            outlined:!0,
            onClick:openCrimeModal,
            style:{
                minWidth:"14rem",
                justifyContent:"flex-start",
                whiteSpace:"nowrap",
                fontWeight:eCrime?700:500,
                borderColor:eCrime?"#3b82f6":"#cbd5e1",
                color:eCrime?"#1d4ed8":undefined,
                backgroundColor:eCrime?"#eff6ff":undefined
            }
        }),
        crimeOpen&&(0,t.jsx)("div",{style:{position:"fixed",inset:0,zIndex:99},onClick:()=>setCrimeOpen(!1)}),
        crimeOpen&&(0,t.jsxs)("div",{
            className:"lp-crime-popover",
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
                // Header
                (0,t.jsxs)("div",{
                    style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.6rem"},
                    children:[
                        (0,t.jsxs)("div",{children:[
                            (0,t.jsx)("div",{style:{fontWeight:800,color:"#0f172a",fontSize:"0.95rem"},children:"Pilih Jenis Kejahatan"}),
                            (0,t.jsxs)("div",{style:{fontSize:"0.72rem",color:"#64748b"},children:[
                                selectedCrimeIds.length," jenis kejahatan dipilih",
                                actorPrimaryDomain ? " · Terikat fungsi: " + actorPrimaryDomain : ""
                            ]})
                        ]}),
                        (0,t.jsx)("button",{type:"button",onClick:()=>setCrimeOpen(!1),style:{background:"none",border:"none",cursor:"pointer",color:"#64748b",fontSize:"1.1rem",lineHeight:1,padding:"0.2rem"},children:"×"})
                    ]
                }),

                // 1. Subcard Kelompok Induk
                (0,t.jsxs)("div",{
                    style:{marginBottom:"0.55rem",background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:8,padding:"0.5rem 0.6rem"},
                    children:[
                        (0,t.jsx)("div",{
                            style:{fontSize:"0.72rem",fontWeight:700,color:"#475569",textTransform:"uppercase",letterSpacing:"0.03em",marginBottom:"0.35rem"},
                            children:"1. Kelompok Induk Kejahatan"
                        }),
                        (0,t.jsx)("div",{
                            style:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"0.35rem"},
                            children:[
                                {key:"ALL",label:"Semua Kelompok",allowed:actorKelompok==="ALL"},
                                {key:"KRIMSUS",label:"KRIMSUS",allowed:actorKelompok==="ALL"||actorKelompok==="KRIMSUS"},
                                {key:"KRIMUM",label:"KRIMUM",allowed:actorKelompok==="ALL"||actorKelompok==="KRIMUM"},
                                {key:"NARKOBA",label:"NARKOBA",allowed:actorKelompok==="ALL"||actorKelompok==="NARKOBA"}
                            ].map(kItem=>{
                                let checked = activeKelompokCrime === kItem.key;
                                let allowed = kItem.allowed;
                                return (0,t.jsx)("div",{
                                    key:kItem.key,
                                    onClick:allowed ? ()=>handleSelectKelompok(kItem.key) : undefined,
                                    title:allowed ? undefined : "Tidak tersedia untuk fungsi satker Anda",
                                    style:{
                                        textAlign:"center",
                                        padding:"0.35rem 0.2rem",
                                        fontSize:"0.74rem",
                                        fontWeight:checked?700:500,
                                        color:!allowed ? "#94a3b8" : (checked?"#1d4ed8":"#334155"),
                                        background:!allowed ? "#f1f5f9" : (checked?"#eff6ff":"#fff"),
                                        border:!allowed ? "1px dashed #cbd5e1" : ("1px solid "+(checked?"#3b82f6":"#cbd5e1")),
                                        borderRadius:6,
                                        cursor:allowed ? "pointer" : "not-allowed",
                                        opacity:allowed ? 1 : 0.5,
                                        userSelect:"none"
                                    },
                                    children:kItem.label
                                });
                            })
                        })
                    ]
                }),

                // 2. Subcard Sub-Kelompok TIPID
                (()=>{
                    let tipidList = [];
                    if(activeKelompokCrime === "KRIMSUS"){
                        tipidList = [
                            {key:"ALL",label:"Semua Krimsus",allowed:true},
                            {key:"TIPIDSIBER",label:"TIPIDSIBER",allowed:true},
                            {key:"TIPIDEKSUS",label:"TIPIDEKSUS",allowed:!actorPrimaryDomain || actorPrimaryDomain==="KRIMSUS" || actorPrimaryDomain==="TIPIDEKSUS"},
                            {key:"TIPIDKOR",label:"TIPIDKOR",allowed:!actorPrimaryDomain || actorPrimaryDomain==="KRIMSUS" || actorPrimaryDomain==="TIPIDKOR"},
                            {key:"TIPIDTER",label:"TIPIDTER",allowed:!actorPrimaryDomain || actorPrimaryDomain==="KRIMSUS" || actorPrimaryDomain==="TIPIDTER"}
                        ];
                    } else if(activeKelompokCrime === "KRIMUM"){
                        tipidList = [
                            {key:"ALL",label:"Semua Krimum",allowed:true},
                            {key:"TIPIDUM",label:"TIPIDUM",allowed:!actorPrimaryDomain || actorPrimaryDomain==="KRIMUM" || actorPrimaryDomain==="TIPIDUM"},
                            {key:"TIPIDPPAPPO",label:"TIPIDPPAPPO",allowed:!actorPrimaryDomain || actorPrimaryDomain==="KRIMUM" || actorPrimaryDomain==="TIPIDPPAPPO"}
                        ];
                    } else if(activeKelompokCrime === "NARKOBA"){
                        tipidList = [
                            {key:"ALL",label:"Semua Narkoba",allowed:true},
                            {key:"TIPIDNARKOBA",label:"TIPIDNARKOBA",allowed:true}
                        ];
                    } else {
                        tipidList = [
                            {key:"ALL",label:"Semua TIPID",allowed:true},
                            {key:"TIPIDSIBER",label:"TIPIDSIBER",allowed:true},
                            {key:"TIPIDEKSUS",label:"TIPIDEKSUS",allowed:true},
                            {key:"TIPIDKOR",label:"TIPIDKOR",allowed:true},
                            {key:"TIPIDTER",label:"TIPIDTER",allowed:true},
                            {key:"TIPIDUM",label:"TIPIDUM",allowed:true},
                            {key:"TIPIDPPAPPO",label:"TIPIDPPAPPO",allowed:true},
                            {key:"TIPIDNARKOBA",label:"TIPIDNARKOBA",allowed:true}
                        ];
                    }

                    let cols = Math.min(tipidList.length, 5);
                    return (0,t.jsxs)("div",{
                        style:{marginBottom:"0.55rem",background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:8,padding:"0.5rem 0.6rem"},
                        children:[
                            (0,t.jsx)("div",{
                                style:{fontSize:"0.72rem",fontWeight:700,color:"#475569",textTransform:"uppercase",letterSpacing:"0.03em",marginBottom:"0.35rem"},
                                children:"2. Sub-Kelompok TIPID"
                            }),
                            (0,t.jsx)("div",{
                                style:{display:"grid",gridTemplateColumns:"repeat("+cols+",1fr)",gap:"0.35rem"},
                                children:tipidList.map(item=>{
                                    let checked = activeTipidCrime === item.key;
                                    let allowed = item.allowed !== false;
                                    return (0,t.jsx)("div",{
                                        key:item.key,
                                        onClick:allowed ? ()=>handleSelectTipid(item.key) : undefined,
                                        title:allowed ? undefined : "Tidak tersedia untuk fungsi satker Anda",
                                        style:{
                                            textAlign:"center",
                                            padding:"0.35rem 0.2rem",
                                            fontSize:"0.72rem",
                                            fontWeight:checked?700:500,
                                            color:!allowed ? "#94a3b8" : (checked?"#1d4ed8":"#334155"),
                                            background:!allowed ? "#f1f5f9" : (checked?"#eff6ff":"#fff"),
                                            border:!allowed ? "1px dashed #cbd5e1" : ("1px solid "+(checked?"#3b82f6":"#cbd5e1")),
                                            borderRadius:6,
                                            cursor:allowed ? "pointer" : "not-allowed",
                                            opacity:allowed ? 1 : 0.5,
                                            userSelect:"none",
                                            whiteSpace:"nowrap",
                                            overflow:"hidden",
                                            textOverflow:"ellipsis"
                                        },
                                        children:item.label
                                    });
                                })
                            })
                        ]
                    });
                })(),

                // 3. Search Box
                (0,t.jsxs)("div",{
                    style:{position:"relative",marginBottom:"0.45rem"},
                    children:[
                        (0,t.jsx)(l.InputText,{
                            id:"lp-crime-search",
                            name:"crime_search",
                            value:crimeSearch,
                            onChange:evt=>setCrimeSearch(evt.target.value),
                            placeholder:"Cari jenis kejahatan (contoh: ITE, Penipuan, Judi, Narkoba)…",
                            style:{width:"100%",paddingRight:"2rem",fontSize:"0.8rem",height:"2.2rem"}
                        }),
                        crimeSearch&&(0,t.jsx)("button",{type:"button",onClick:()=>setCrimeSearch(""),style:{position:"absolute",right:"0.5rem",top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#94a3b8",cursor:"pointer",fontSize:"1rem"},children:"×"})
                    ]
                }),

                // 4. Multiselection List
                (()=>{
                    let list = allCrimes;
                    if(activeKelompokCrime !== "ALL"){ list = list.filter(c => c.kelompok === activeKelompokCrime); }
                    if(activeTipidCrime !== "ALL"){ list = list.filter(c => c.domain === activeTipidCrime); }
                    let q = crimeSearch.trim().toLowerCase();
                    if(q){ list = list.filter(c => String(c.nama || "").toLowerCase().includes(q) || String(c.domain || "").toLowerCase().includes(q)); }

                    return (0,t.jsxs)("div",{
                        children:[
                            (0,t.jsxs)("div",{
                                style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.35rem"},
                                children:[
                                    (0,t.jsxs)("span",{style:{fontSize:"0.72rem",color:"#64748b"},children:["Menampilkan ",list.length," jenis kejahatan"]}),
                                    (0,t.jsxs)("div",{
                                        style:{display:"flex",gap:"0.4rem"},
                                        children:[
                                            (0,t.jsx)("button",{
                                                type:"button",
                                                onClick:()=>{
                                                    let set = new Set(selectedCrimeIds);
                                                    list.forEach(c => set.add(Number(c.id)));
                                                    setSelectedCrimeIds(Array.from(set));
                                                },
                                                style:{background:"none",border:"none",color:"#2563eb",fontSize:"0.7rem",cursor:"pointer",padding:0,textDecoration:"underline"},
                                                children:"Pilih Semua (" + list.length + ")"
                                            }),
                                            (0,t.jsx)("span",{style:{color:"#cbd5e1",fontSize:"0.7rem"},children:"|"}),
                                            (0,t.jsx)("button",{
                                                type:"button",
                                                onClick:()=>{
                                                    let removeSet = new Set(list.map(c => Number(c.id)));
                                                    setSelectedCrimeIds(selectedCrimeIds.filter(idVal => !removeSet.has(idVal)));
                                                },
                                                style:{background:"none",border:"none",color:"#64748b",fontSize:"0.7rem",cursor:"pointer",padding:0,textDecoration:"underline"},
                                                children:"Kosongkan"
                                            })
                                        ]
                                    })
                                ]
                            }),
                            (0,t.jsx)("div",{
                                style:{maxHeight:"13rem",overflowY:"auto",border:"1px solid #e2e8f0",borderRadius:8,padding:"0.35rem 0.5rem",background:"#fafafa",display:"flex",flexDirection:"column",gap:"0.25rem"},
                                children:list.length === 0 ? (0,t.jsx)("div",{style:{padding:"1rem",textAlign:"center",color:"#94a3b8",fontSize:"0.78rem"},children:"Tidak ada jenis kejahatan yang sesuai."}) : list.map(c=>{
                                    let checked = selectedCrimeIds.includes(Number(c.id));
                                    return (0,t.jsxs)("label",{
                                        key:c.id,
                                        style:{display:"flex",alignItems:"center",gap:"0.45rem",padding:"0.3rem 0.4rem",borderRadius:6,background:checked?"#eff6ff":"#fff",border:"1px solid "+(checked?"#93c5fd":"#e2e8f0"),cursor:"pointer",userSelect:"none"},
                                        children:[
                                            (0,t.jsx)("input",{
                                                id:"crime-id-"+c.id,
                                                name:"crime_id",
                                                type:"checkbox",
                                                checked:checked,
                                                onChange:()=>toggleCrimeId(c.id),
                                                style:{cursor:"pointer",accentColor:"#2563eb"}
                                            }),
                                            (0,t.jsxs)("div",{
                                                style:{flex:1,display:"flex",justifyContent:"space-between",alignItems:"center",gap:"0.5rem",fontSize:"0.77rem",lineHeight:1.2},
                                                children:[
                                                    (0,t.jsx)("span",{style:{color:checked?"#1e40af":"#1e293b",fontWeight:checked?600:400},children:c.nama}),
                                                    c.domain ? (0,t.jsx)("span",{style:{fontSize:"0.65rem",background:checked?"#dbeafe":"#f1f5f9",color:checked?"#1d4ed8":"#64748b",borderRadius:4,padding:"0.1rem 0.35rem",whiteSpace:"nowrap"},children:c.domain}) : null
                                                ]
                                            })
                                        ]
                                    });
                                })
                            })
                        ]
                    });
                })(),

                // 5. Footer
                (0,t.jsxs)("div",{
                    style:{display:"flex",justifyContent:"space-between",alignItems:"center",borderTop:"1px solid #e2e8f0",paddingTop:"0.6rem",marginTop:"0.6rem"},
                    children:[
                        (0,t.jsx)("button",{
                            type:"button",
                            onClick:handleResetCrime,
                            style:{background:"none",border:"none",color:"#64748b",fontSize:"0.78rem",cursor:"pointer",padding:"0.2rem"},
                            children:"Reset"
                        }),
                        (0,t.jsxs)("div",{
                            style:{display:"flex",alignItems:"center",gap:"0.6rem"},
                            children:[
                                (0,t.jsxs)("span",{style:{fontSize:"0.74rem",color:"#475569"},children:[selectedCrimeIds.length," dipilih"]}),
                                (0,t.jsx)("button",{
                                    type:"button",
                                    onClick:handleApplyCrime,
                                    style:{background:"#2563eb",color:"#fff",border:"none",borderRadius:6,padding:"0.4rem 1.1rem",fontSize:"0.78rem",fontWeight:600,cursor:"pointer"},
                                    children:"Terapkan"
                                })
                            ]
                        })
                    ]
                })
            ]
        })
    ]
}),(0,t.jsxs)("div",{
style:{position:"relative",flex:"0 0 auto"},
children:[
(0,t.jsx)(o.Button,{
label:"Periode: "+mainPeriodLabel,
icon:"pi pi-calendar",
outlined:!0,
onClick:()=>{
  mainPeriodOpen
    ? setMainPeriodOpen(!1)
    : mainOpenPeriodDialog()
},
style:{
  minWidth:"13rem",
  justifyContent:"flex-start",
  whiteSpace:"nowrap"
}
}),
mainPeriodOpen&&(0,t.jsx)("div",{style:{position:"fixed",inset:0,zIndex:99},onClick:()=>setMainPeriodOpen(!1)}),
mainPeriodOpen&&(0,t.jsxs)("div",{
className:"lp-period-popover-v2",
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
(0,t.jsx)("div",{
  style:{
    fontWeight:800,
    color:"#0f172a",
    marginBottom:"0.7rem"
  },
  children:"Pilih Periode"
}),
(0,t.jsxs)("div",{
style:{display:"grid",gap:"0.85rem"},
children:[

(0,t.jsxs)("div",{
style:{
  display:"grid",
  gridTemplateColumns:"repeat(3,1fr)",
  gap:"0.4rem"
},
children:[
(0,t.jsx)(o.Button,{
  label:"Bulan",
  outlined:"month"!==mainPeriodMode,
  onClick:()=>setMainPeriodMode("month")
}),
(0,t.jsx)(o.Button,{
  label:"Tahun",
  outlined:"year"!==mainPeriodMode,
  onClick:()=>setMainPeriodMode("year")
}),
(0,t.jsx)(o.Button,{
  label:"Custom",
  outlined:"custom"!==mainPeriodMode,
  onClick:()=>setMainPeriodMode("custom")
})
]
}),

"month"===mainPeriodMode&&(0,t.jsxs)("div",{
style:{
  display:"grid",
  gridTemplateColumns:"1fr 1fr",
  gap:"0.6rem"
},
children:[
(0,t.jsx)(i.Dropdown,{
  id:"lp-period-month",
  inputId:"lp-period-month-select",
  name:"period_month",
  value:mainPeriodMonth,
  options:bulkMonthOptions(),
  onChange:x=>setMainPeriodMonth(x.value),
  placeholder:"Bulan",
  style:{width:"100%"}
}),
(0,t.jsx)(i.Dropdown,{
  id:"lp-period-year",
  inputId:"lp-period-year-select",
  name:"period_year",
  value:mainPeriodYear,
  options:bulkYearOptions(),
  onChange:x=>setMainPeriodYear(x.value),
  placeholder:"Tahun",
  style:{width:"100%"}
})
]
}),

"year"===mainPeriodMode&&(0,t.jsx)(i.Dropdown,{
  id:"lp-period-year-single",
  inputId:"lp-period-year-single-select",
  name:"period_year_single",
  value:mainPeriodYear,
  options:bulkYearOptions(),
  onChange:x=>setMainPeriodYear(x.value),
  placeholder:"Pilih tahun",
  style:{width:"100%"}
}),

"custom"===mainPeriodMode&&(0,t.jsxs)("div",{
style:{
  display:"grid",
  gridTemplateColumns:"1fr 1fr",
  gap:"0.6rem"
},
children:[
(0,t.jsxs)("div",{
children:[
(0,t.jsx)("label",{
  style:{
    display:"block",
    fontSize:"0.72rem",
    marginBottom:"0.25rem"
  },
  children:"Dari"
}),
(0,t.jsx)(l.InputText,{
  id:"filter-date-from",
  name:"date_from",
  type:"date",
  value:mainCustomFrom,
  onChange:x=>setMainCustomFrom(x.target.value),
  style:{width:"100%"}
})
]
}),
(0,t.jsxs)("div",{
children:[
(0,t.jsx)("label",{
  style:{
    display:"block",
    fontSize:"0.72rem",
    marginBottom:"0.25rem"
  },
  children:"Sampai"
}),
(0,t.jsx)(l.InputText,{
  id:"filter-date-to",
  name:"date_to",
  type:"date",
  value:mainCustomTo,
  onChange:x=>setMainCustomTo(x.target.value),
  style:{width:"100%"}
})
]
})
]
}),

(0,t.jsx)("div",{
style:{
  fontSize:"0.72rem",
  color:"#64748b",
  background:"#f8fafc",
  border:"1px solid #e2e8f0",
  borderRadius:7,
  padding:"0.55rem 0.65rem"
},
children:"Terapkan hanya memilih periode. Klik Cari pada filter utama untuk memuat data."
}),

(0,t.jsxs)("div",{
style:{
  display:"flex",
  justifyContent:"flex-end",
  gap:"0.45rem"
},
children:[
(0,t.jsx)(o.Button,{label:"Reset",icon:"pi pi-refresh",text:!0,onClick:mainResetPeriod}),
(0,t.jsx)(o.Button,{
  label:"Terapkan",
  icon:"pi pi-check",
  onClick:mainApplyPeriod
})
]
})

]
})
]
})
]
}),(0,t.jsx)("span",{style:{flex:"1 1 14rem"},children:(0,t.jsx)(l.InputText,{id:"lp-search-filter",name:"search",value:eh,onChange:e=>eb(e.target.value),onKeyDown:e=>{if(e.key==="Enter"){ex(0);eSetAP({level:eo,status:eu,model:ed,from:em,to:eg,search:eh.trim(),functionDomain:eFD,jenisKejahatanIds:eCrime||"",targetSatkerId:eTargetSatker?.id?String(eTargetSatker.id):""})}},placeholder:"Cari no. laporan / satker…",style:{width:"100%"}})}),(0,t.jsx)(o.Button,{label:"Cari",icon:"pi pi-search",onClick:()=>{ex(0),eSetAP({level:eo,status:eu,model:ed,from:em,to:eg,search:eh.trim(),functionDomain:eFD,jenisKejahatanIds:eCrime||"",targetSatkerId:eTargetSatker?.id?String(eTargetSatker.id):""})}}),(0,t.jsx)(o.Button,{icon:"pi pi-refresh",outlined:!0,onClick:()=>{eZ(),eQ()},loading:ee,"aria-label":"Muat ulang"})]}),(0,t.jsxs)(a.DataTable,{value:J,loading:ee,lazy:!0,paginator:!0,first:ev,rows:ej,totalRecords:Z,onPage:e=>{ex(e.first),ek(e.rows)},rowsPerPageOptions:[25,50,100,N.ALL_ROWS_LAZY],paginatorTemplate:{layout:N.DEFAULT_PAGINATOR_LAYOUT,RowsPerPageDropdown:(0,N.rowsPerPageTemplate)([25,50,100])},emptyMessage:(0,t.jsxs)("div",{style:{padding:"2rem 1rem",textAlign:"center",color:"#64748b"},children:[(0,t.jsx)("p",{style:{marginBottom:"0.5rem",fontWeight:500},children:(em||eg)?"Belum ada LP pada periode terpilih ("+mainPeriodLabel+").":"Belum ada LP termapping."}),(em||eg)?(0,t.jsx)(o.Button,{label:"Tampilkan Semua Periode",icon:"pi pi-calendar",outlined:!0,size:"small",onClick:mainResetPeriod}):(0,t.jsx)("span",{style:{fontSize:"0.8rem"},children:"Klik 'Petakan LP Terbaru' untuk menarik data dari DORS."})]}),stripedRows:!0,size:"small",onRowDoubleClick:e=>Y(e.data),rowClassName:()=>"cms-row-clickable",children:[(0,t.jsx)(r.Column,{header:"No",body:(e,t)=>t.rowIndex+1,style:{width:"3.5rem"},headerStyle:{width:"3.5rem"}}),(0,t.jsx)(r.Column,{header:"No. Laporan",body:e=>(0,t.jsx)("span",{style:{fontWeight:600,color:e.no_laporan?"inherit":"#94a3b8",fontStyle:e.no_laporan?"normal":"italic"},children:e.no_laporan||"(Tanpa No. LP)"})}),(0,t.jsx)(r.Column,{header:"Tanggal LP",body:e=>(0,t.jsx)("span",{style:{whiteSpace:"nowrap"},children:function(e){if(!e)return"—";let t=String(e).match(/^(\d{2})-(\d{2})-(\d{4})/);if(t)return new Date(Number(t[3]),Number(t[2])-1,Number(t[1])).toLocaleDateString("id-ID",{dateStyle:"medium"});let n=new Date(e);return isNaN(n.getTime())?String(e):n.toLocaleDateString("id-ID",{dateStyle:"medium"})}(e.tgl_laporan)}),style:{minWidth:"8rem"}}),(0,t.jsx)(r.Column,{header:"Model",body:e=>(0,t.jsx)(s.Tag,{value:"lp_model_a"===e.model_lp?"A":"B",severity:"lp_model_a"===e.model_lp?"info":"warning"})}),(0,t.jsx)(r.Column,{header:"Satker Penanganan",body:e=>{let n=e.unit_satker_nama;if(!n){let u=(e.unit_nama||"").trim(),s=(e.satker_nama||"").trim();if(!u)n=s;else if(!s)n=u;else{let nu=u.toLowerCase().replace(/[^a-z0-9]/g,""),ns=s.toLowerCase().replace(/[^a-z0-9]/g,"");n=nu.includes(ns)?u:ns.includes(nu)?s:`${u} ${s}`}}return(0,t.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.4rem",fontWeight:600},children:[(0,t.jsx)(f.Landmark,{size:14,style:{color:"#2563eb",flex:"0 0 auto"}}),n||"—"]})},style:{minWidth:"16rem"}}),(0,t.jsx)(r.Column,{header:"Dugaan Tindak Pidana",body:W,style:{minWidth:"15rem"}}),(0,t.jsx)(r.Column,{header:"Status LP",body:e=>eBulkAllowed?(0,t.jsx)("button",{
type:"button",
onClick:n=>{n.stopPropagation(),quickOpen(e)},
onDoubleClick:n=>n.stopPropagation(),
onMouseEnter:n=>{
  n.currentTarget.style.background="#eff6ff";
  n.currentTarget.style.borderColor="#93c5fd"
},
onMouseLeave:n=>{
  n.currentTarget.style.background="transparent";
  n.currentTarget.style.borderColor="transparent"
},
title:"Klik untuk update status LP",
"aria-label":"Update status "+(e.no_laporan||"LP"),
style:{
  border:"1px solid transparent",
  background:"transparent",
  borderRadius:8,
  padding:"0.2rem 0.28rem",
  cursor:"pointer",
  transition:"background .15s,border-color .15s"
},
children:(0,t.jsx)(s.Tag,{
  value:e.status_nama||"Laporan Polisi",
  severity:A[e.status_code||"LP"]
})
}):(0,t.jsx)(s.Tag,{
  value:e.status_nama||"Laporan Polisi",
  severity:A[e.status_code||"LP"]
}),sortable:!0,sortField:"status_code",style:{minWidth:"9rem"}}),(0,t.jsx)(r.Column,{header:"Ditarik",body:e=>(function(e){if(!e)return"—";try{return new Date(e).toLocaleString("id-ID",{dateStyle:"medium",timeStyle:"short"})}catch{return String(e)}})(e.synced_at)}),(0,t.jsx)(r.Column,{header:"",style:{width:eG.isSuperadmin?"13rem":"7.5rem"},body:row=>(0,t.jsxs)("div",{style:{display:"flex",gap:"0.15rem"},children:[(0,t.jsx)("button",{type:"button",className:"att-icon-link",onClick:()=>Y(row),"aria-label":"Alur Dokumen",title:"Buka Alur Dokumen",style:{color:"#2563eb"},children:(0,t.jsx)(k.Workflow,{size:17})}),(0,t.jsx)("button",{type:"button",className:"att-icon-link",onClick:()=>eq(row),"aria-label":"Detail",title:"Lihat ringkas",children:(0,t.jsx)(y.Eye,{size:17})}),row.dilimpahkan_eksternal&&(0,t.jsx)("button",{type:"button",className:"att-icon-link",onClick:async()=>{if(await (0,T.confirmAction)(`Batalkan pelimpahan eksternal untuk LP "${row.no_laporan}"? Penanganan akan dikembalikan ke satker internal Polri.`,{header:"Batalkan Pelimpahan Eksternal",acceptLabel:"Ya, Batalkan",danger:!0})){try{let res=(await L.apiAuth.post(`/bdb/lp-pelimpahan/${row.id}/batal-eksternal`)).data;e.current?.show({severity:"success",summary:"Berhasil",detail:res?.message||"Pelimpahan eksternal berhasil dibatalkan."});await Promise.all([eZ(),eQ()])}catch(err){e.current?.show({severity:"error",summary:"Gagal",detail:err.response?.data?.message||err.message||"Gagal membatalkan pelimpahan eksternal."})}}},"aria-label":"Batal Limpah Eksternal",title:"Batalkan Pelimpahan Eksternal (Kembalikan LP ke Satker Polri)",style:{color:"#dc2626"},children:(0,t.jsx)("i",{className:"pi pi-undo",style:{fontSize:"1.05rem"}})}),eG.isSuperadmin&&(0,t.jsx)("button",{type:"button",className:"att-icon-link",onClick:()=>{eI(row),eE(""),eN([]),eT(null),eM("")},"aria-label":"Update Satker",title:"Update Satker (perbaiki kesalahan mapping — bukan pelimpahan)",style:{color:"#b45309"},children:(0,t.jsx)(O,{id:"fld-laporan-filter-per-1",name:"field_laporan_filter_per_1",size:17})}),eG.isSuperadmin&&(0,t.jsx)("button",{type:"button",className:"att-icon-link",onClick:()=>{ez(row),eK("")},"aria-label":"Hapus",title:"Hapus LP (wajib keterangan)",style:{color:"#dc2626"},children:(0,t.jsx)(C.Trash2,{size:17})})]})})]})]}),
null,

(0,t.jsx)(u.Dialog,{
header:"Update Status LP",
visible:quickVisible,
onHide:quickClose,
style:{width:"40rem",maxWidth:"94vw"},
contentStyle:{overflow:"visible"},
modal:!0,
dismissableMask:!1,
footer:(0,t.jsxs)("div",{children:[
  (0,t.jsx)(o.Button,{
    label:"Batal",
    text:!0,
    onClick:quickClose,
    disabled:quickBusy
  }),
  (0,t.jsx)(o.Button,{
    label:"Simpan",
    icon:"pi pi-save",
    onClick:quickSave,
    loading:quickBusy,
    disabled:quickLoading||!quickType
  })
]}),
children:(0,t.jsxs)("div",{
style:{display:"grid",gap:"0.85rem"},
children:[
  (0,t.jsxs)("div",{
    style:{
      background:"#f8fafc",
      border:"1px solid #e2e8f0",
      borderRadius:8,
      padding:"0.65rem 0.75rem"
    },
    children:[
      (0,t.jsx)("div",{
        style:{
          fontSize:"0.7rem",
          color:"#64748b",
          marginBottom:"0.2rem"
        },
        children:"Laporan Polisi"
      }),
      (0,t.jsx)("div",{
        style:{
          fontWeight:700,
          color:"#0f172a",
          wordBreak:"break-word"
        },
        children:quickRow?.no_laporan||"—"
      })
    ]
  }),

  (0,t.jsxs)("div",{
    children:[
      (0,t.jsx)("label",{
        style:{
          display:"block",
          fontSize:"0.78rem",
          fontWeight:700,
          color:"#334155",
          marginBottom:"0.3rem"
        },
        children:"Dokumen yang akan diupdate"
      }),
      (0,t.jsx)(i.Dropdown,{
        id:"lp-quick-doc-type",
        inputId:"lp-quick-doc-type-select",
        name:"quick_doc_type",
        value:quickType,
        options:quickTypeOptions(),
        onChange:evt=>quickPickType(evt.value),
        placeholder:quickLoading?"Memuat dokumen…":"Pilih dokumen",
        loading:quickLoading,
        disabled:quickLoading,
        filter:!0,
        filterPlaceholder:"Cari dokumen…",
        style:{width:"100%"}
      })
    ]
  }),

  !quickLoading&&0===quickTypes.length&&(0,t.jsx)("div",{
    style:{
      padding:"0.7rem",
      borderRadius:8,
      background:"#f8fafc",
      border:"1px solid #e2e8f0",
      color:"#64748b",
      fontSize:"0.78rem"
    },
    children:"Tidak ada dokumen lanjutan yang dapat diupdate cepat untuk LP ini."
  }),

  quickType&&quickEditor()
]
})
}),
(0,t.jsx)(u.Dialog,{header:(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"1rem",width:"100%",paddingRight:"0.5rem"},children:[(0,t.jsx)("span",{children:"Update Status Massal"}),(0,t.jsx)(o.Button,{label:bulkExpanded?"Perkecil":"Perbesar",icon:bulkExpanded?"pi pi-window-minimize":"pi pi-window-maximize",text:!0,size:"small",onClick:()=>setBulkExpanded(v=>!v),disabled:bulkBusy})]}),visible:bulkVisible&&1===bulkStep,onHide:bulkClose,maximized:bulkExpanded,style:bulkExpanded?{width:"100vw",height:"100vh",maxWidth:"100vw",maxHeight:"100vh",margin:0,top:0,left:0,borderRadius:0}:{width:"72rem",maxWidth:"96vw"},contentStyle:{overflow:"auto",height:bulkExpanded?"calc(100vh - 125px)":"auto",maxHeight:bulkExpanded?"calc(100vh - 125px)":"65vh"},modal:!0,dismissableMask:!1,footer:(0,t.jsxs)("div",{children:[(0,t.jsx)(o.Button,{label:"Batal",text:!0,onClick:bulkClose,disabled:bulkBusy}),(0,t.jsx)(o.Button,{label:"Berikutnya",icon:"pi pi-arrow-right",onClick:bulkNext,loading:bulkBusy,disabled:bulkLoading||bulkLpLoading||!bulkSelected.length||!bulkType})]}),children:(0,t.jsxs)("div",{style:{display:"grid",gap:"0.75rem"},children:[

(0,t.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(18rem,1fr))",gap:"0.75rem",background:"#f8fafc",padding:"0.85rem",borderRadius:8,border:"1px solid #e2e8f0"},children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{style:{display:"block",fontSize:"0.78rem",fontWeight:700,color:"#334155",marginBottom:"0.3rem"},children:"Dokumen yang akan diupdate *"}),(0,t.jsx)(i.Dropdown,{id:"lp-bulk-doc-type",inputId:"lp-bulk-doc-type-select",name:"bulk_doc_type",value:bulkType,options:bulkTypeOptions(),onChange:evt=>bulkPickType(evt.value),placeholder:"Pilih dokumen target…",loading:bulkLoading,filter:!0,filterPlaceholder:"Cari dokumen…",style:{width:"100%"}})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{style:{display:"block",fontSize:"0.78rem",fontWeight:700,color:"#334155",marginBottom:"0.3rem"},children:"Filter Status LP Saat Ini"}),(0,t.jsx)(i.Dropdown,{id:"lp-bulk-status-filter",inputId:"lp-bulk-status-filter-select",name:"bulk_status_filter",value:bulkStatusFilter,options:[{label:"Semua Status Saat Ini",value:""},...bulkStatuses.map(x=>({label:x.nama||x.code,value:x.code}))],onChange:x=>{setBulkStatusFilter(x.value),bulkApplyFilters({status:x.value})},placeholder:"Semua Status Saat Ini",style:{width:"100%"},showClear:!0})]})]}),

(0,t.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:"0.75rem",color:"#64748b"},children:[(0,t.jsx)("span",{children:(bulkPageSize||25)+" LP per halaman"+(bulkApplied.status?" (Filter Status: "+(bulkStatuses.find(s=>s.code===bulkApplied.status)?.nama||bulkApplied.status)+")":"")}),(0,t.jsx)("strong",{children:bulkSelected.length+" LP dipilih"})]}),

(0,t.jsx)("div",{style:{border:"1px solid #e2e8f0",borderRadius:8,overflow:"auto",minHeight:"14rem",maxHeight:bulkExpanded?"calc(100vh - 310px)":"48vh"},children:(0,t.jsxs)("table",{style:{width:"100%",borderCollapse:"collapse"},children:[
(0,t.jsx)("thead",{children:(0,t.jsxs)("tr",{style:{background:"#f8fafc"},children:[
(0,t.jsx)("th",{style:{width:"3rem",padding:"0.55rem",borderBottom:"1px solid #e2e8f0"},children:(0,t.jsx)("input",{id:"bulk-select-page-all",name:"select_all",type:"checkbox",checked:bulkPageAllSelected(),onChange:x=>bulkTogglePage(x.target.checked),"aria-label":"Pilih semua LP halaman ini"})}),
(0,t.jsx)("th",{style:{textAlign:"left",padding:"0.55rem",fontSize:"0.72rem",borderBottom:"1px solid #e2e8f0"},children:"NO. LAPORAN"}),
(0,t.jsx)("th",{style:{textAlign:"left",padding:"0.55rem",fontSize:"0.72rem",borderBottom:"1px solid #e2e8f0",width:"10rem"},children:"STATUS"}),
(0,t.jsx)("th",{style:{textAlign:"left",padding:"0.55rem",fontSize:"0.72rem",borderBottom:"1px solid #e2e8f0"},children:"SATKER"})
]})}),
(0,t.jsx)("tbody",{children:bulkLpLoading?(0,t.jsx)("tr",{children:(0,t.jsx)("td",{colSpan:4,style:{padding:"2rem",textAlign:"center",color:"#64748b"},children:"Memuat LP…"})}):bulkLpRows.length?bulkLpRows.map(row=>(0,t.jsxs)("tr",{style:{background:bulkSelectedHas(row)?"#eff6ff":"#fff"},children:[
(0,t.jsx)("td",{style:{textAlign:"center",padding:"0.55rem",borderBottom:"1px solid #eef2f7"},children:(0,t.jsx)("input",{id:"bulk-select-row-"+row.id,name:"select_row",type:"checkbox",checked:bulkSelectedHas(row),onChange:x=>bulkToggleRow(row,x.target.checked),"aria-label":"Pilih LP"})}),
(0,t.jsx)("td",{style:{padding:"0.55rem",borderBottom:"1px solid #eef2f7",fontWeight:600,fontSize:"0.78rem"},children:row.no_laporan||"—"}),
(0,t.jsx)("td",{style:{padding:"0.55rem",borderBottom:"1px solid #eef2f7"},children:(0,t.jsx)(s.Tag,{value:row.status_nama||row.status_code||"Belum Update",severity:A[row.status_code||"LP"]})}),
(0,t.jsx)("td",{style:{padding:"0.55rem",borderBottom:"1px solid #eef2f7",fontSize:"0.76rem"},children:row.unit_satker_nama||row.satker_nama||"—"})
]},bulkLpId(row))):(0,t.jsx)("tr",{children:(0,t.jsx)("td",{colSpan:4,style:{padding:"2rem",textAlign:"center",color:"#64748b"},children:"LP tidak ditemukan."})})})
]})}),
bulkPager(bulkLpPage,bulkLpTotal,bulkPageSize||25,bulkGoLp,newSize=>{setBulkPageSize(newSize);setBulkLpPage(1);bulkCache.current.clear();bulkLoadLp(1,bulkApplied,newSize)})
]})}),

(0,t.jsx)(u.Dialog,{header:"Pilih Periode",visible:bulkVisible&&1===bulkStep&&bulkPeriodOpen,onHide:()=>setBulkPeriodOpen(!1),style:{width:"34rem",maxWidth:"94vw"},modal:!0,dismissableMask:!1,footer:(0,t.jsxs)("div",{children:[
(0,t.jsx)(o.Button,{label:"Reset",icon:"pi pi-refresh",text:!0,onClick:bulkResetPeriod}),
(0,t.jsx)(o.Button,{label:"Terapkan",icon:"pi pi-check",onClick:bulkApplyPeriod})
]}),children:(0,t.jsxs)("div",{style:{display:"grid",gap:"0.85rem"},children:[

(0,t.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"0.4rem"},children:[
(0,t.jsx)(o.Button,{label:"Bulan",outlined:"month"!==bulkPeriodMode,onClick:()=>setBulkPeriodMode("month")}),
(0,t.jsx)(o.Button,{label:"Tahun",outlined:"year"!==bulkPeriodMode,onClick:()=>setBulkPeriodMode("year")}),
(0,t.jsx)(o.Button,{label:"Custom",outlined:"custom"!==bulkPeriodMode,onClick:()=>setBulkPeriodMode("custom")})
]}),

"month"===bulkPeriodMode&&(0,t.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.6rem"},children:[
(0,t.jsx)(i.Dropdown,{id:"lp-bulk-period-month",inputId:"lp-bulk-period-month-select",name:"bulk_period_month",value:bulkPeriodMonth,options:bulkMonthOptions(),onChange:x=>setBulkPeriodMonth(x.value),placeholder:"Bulan",style:{width:"100%"}}),
(0,t.jsx)(i.Dropdown,{id:"lp-bulk-period-year",inputId:"lp-bulk-period-year-select",name:"bulk_period_year",value:bulkPeriodYear,options:bulkYearOptions(),onChange:x=>setBulkPeriodYear(x.value),placeholder:"Tahun",style:{width:"100%"}})
]}),

"year"===bulkPeriodMode&&(0,t.jsx)(i.Dropdown,{id:"lp-bulk-period-year-single",inputId:"lp-bulk-period-year-single-select",name:"bulk_period_year_single",value:bulkPeriodYear,options:bulkYearOptions(),onChange:x=>setBulkPeriodYear(x.value),placeholder:"Pilih tahun",style:{width:"100%"}}),

"custom"===bulkPeriodMode&&(0,t.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.6rem"},children:[
(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{style:{display:"block",fontSize:"0.72rem",marginBottom:"0.25rem"},children:"Dari"}),(0,t.jsx)(l.InputText,{id:"bulk-custom-from",name:"date_from",type:"date",value:bulkCustomFrom,onChange:x=>setBulkCustomFrom(x.target.value),style:{width:"100%"}})]}),
(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{style:{display:"block",fontSize:"0.72rem",marginBottom:"0.25rem"},children:"Sampai"}),(0,t.jsx)(l.InputText,{id:"bulk-custom-to",name:"date_to",type:"date",value:bulkCustomTo,onChange:x=>setBulkCustomTo(x.target.value),style:{width:"100%"}})]})
]})

]})}),
(0,t.jsx)(u.Dialog,{header:(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"1rem",width:"100%",paddingRight:"0.5rem"},children:[(0,t.jsx)("span",{children:"Update Status Massal — Pengisian Cepat"}),(0,t.jsx)(o.Button,{label:bulkExpanded?"Perkecil":"Perbesar",icon:bulkExpanded?"pi pi-window-minimize":"pi pi-window-maximize",text:!0,size:"small",onClick:()=>{setBulkExpanded(v=>!v),setBulkEditPage(1)},disabled:bulkBusy})]}),visible:bulkVisible&&2===bulkStep,onHide:bulkClose,maximized:bulkExpanded,style:bulkExpanded?{width:"100vw",height:"100vh",maxWidth:"100vw",maxHeight:"100vh",margin:0,top:0,left:0,borderRadius:0}:{width:"72rem",maxWidth:"96vw"},contentStyle:{overflow:"auto",height:bulkExpanded?"calc(100vh - 125px)":"auto",maxHeight:bulkExpanded?"calc(100vh - 125px)":"65vh"},modal:!0,dismissableMask:!1,footer:(0,t.jsxs)("div",{children:[(0,t.jsx)(o.Button,{label:"Kembali",icon:"pi pi-arrow-left",text:!0,onClick:()=>setBulkStep(1),disabled:bulkBusy}),(0,t.jsx)(o.Button,{label:"Proses Update",icon:"pi pi-check",onClick:bulkSubmit,loading:bulkBusy})]}),children:bulkEditor()}),(0,t.jsx)(u.Dialog,{header:eS?.no_laporan||"Detail Laporan Polisi",visible:!!eS,onHide:()=>{ew(null),eO(null)},style:{width:"52rem",maxWidth:"97vw"},modal:!0,dismissableMask:!0,children:eS&&(0,t.jsxs)("div",{style:{display:"grid",gap:"0.9rem"},children:[(0,t.jsxs)("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:[(0,t.jsx)(s.Tag,{value:"lp_model_a"===eS.model_lp?"Model A":"Model B",severity:"lp_model_a"===eS.model_lp?"info":"warning"}),(0,E.deriveRoles)((0,E.getUser)()).isSuperadmin&&(0,t.jsx)(s.Tag,{value:`DORS ID ${eS.dors_lp_id}`}),(0,t.jsx)(s.Tag,{value:eS.status||"BARU",severity:"success"})]}),(0,t.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(13rem, 1fr))",gap:"0.75rem",padding:"0.85rem",background:"var(--surface-hover, #f8fafc)",borderRadius:10,border:"1px solid var(--surface-border, #e5e7eb)"},children:[(0,t.jsxs)("div",{children:[(0,t.jsx)(K,{id:"fld-laporan-filter-per-2",name:"field_laporan_filter_per_2",icon:(0,t.jsx)(f.Landmark,{size:13}),children:"Satker Penanganan"}),(0,t.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.4rem"},children:[(0,t.jsx)(s.Tag,{value:eS.penanganan_level||"-",severity:$[eS.penanganan_level||""]||void 0}),(0,t.jsx)("strong",{children:eS.satker_nama})]}),eS.unit_satker_nama&&(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.3rem",marginTop:"0.35rem",color:"#0f766e",fontSize:"0.82rem"},children:[(0,t.jsx)(b.CornerDownRight,{size:14,style:{color:"#14b8a6"}})," ",(0,t.jsx)("strong",{children:eS.unit_satker_nama})]})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)(K,{id:"fld-laporan-filter-per-3",name:"field_laporan_filter_per_3",icon:(0,t.jsx)(g.Users,{size:13}),children:"Unit"}),(0,t.jsx)("strong",{children:eS.unit_nama||"—"})," ",eS.unit_level&&(0,t.jsxs)("span",{style:{fontSize:"0.75rem",color:"#94a3b8"},children:["(",eS.unit_level,")"]})]})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)(K,{id:"fld-laporan-filter-per-4",name:"field_laporan_filter_per_4",icon:(0,t.jsx)(x.MapPin,{size:13}),children:"Kejadian"}),(0,t.jsxs)("div",{style:{display:"grid",gap:"0.35rem"},children:[(0,t.jsx)(V,{id:"fld-laporan-filter-per-5",name:"field_laporan_filter_per_5",label:"Waktu Kejadian",v:z(eP,"waktu_kejadian")}),(0,t.jsx)(V,{id:"fld-laporan-filter-per-6",name:"field_laporan_filter_per_6",label:"Tanggal Laporan",v:eS.tgl_laporan}),(0,t.jsx)(V,{id:"fld-laporan-filter-per-7",name:"field_laporan_filter_per_7",label:"Lokasi (Kategori)",v:z(eP?.kategori_lokasi,"lokasi")}),(0,t.jsx)(V,{id:"fld-laporan-filter-per-8",name:"field_laporan_filter_per_8",label:"Tempat Kejadian",v:eS.tempat_kejadian}),(0,t.jsx)(V,{id:"fld-laporan-filter-per-9",name:"field_laporan_filter_per_9",label:"Provinsi",v:z(eP?.tkp_provinsi,"provinsi")}),(0,t.jsx)(V,{id:"fld-laporan-filter-per-10",name:"field_laporan_filter_per_10",label:"Kabupaten / Kota",v:z(eP?.tkp_kota,"kabupaten")}),(0,t.jsx)(V,{id:"fld-laporan-filter-per-11",name:"field_laporan_filter_per_11",label:"Kecamatan",v:z(eP?.tkp_kecamatan,"kecamatan")}),(0,t.jsx)(V,{id:"fld-laporan-filter-per-12",name:"field_laporan_filter_per_12",label:"Desa / Kelurahan",v:z(eP?.tkp_desa,"desa")}),(0,t.jsx)(V,{id:"fld-laporan-filter-per-13",name:"field_laporan_filter_per_13",label:"Motif (id)",v:z(eP,"id_emp_motif_kejahatan")}),(0,t.jsx)(V,{id:"fld-laporan-filter-per-14",name:"field_laporan_filter_per_14",label:"Modus (id)",v:z(eP,"id_emp_modus_operandi")}),(0,t.jsx)(V,{id:"fld-laporan-filter-per-15",name:"field_laporan_filter_per_15",label:"Uraian Singkat",v:eS.uraian_singkat})]})]}),(0,t.jsx)(F,{id:"fld-laporan-filter-per-16",name:"field_laporan_filter_per_16",title:"Dugaan Tindak Pidana",icon:(0,t.jsx)(v.Gavel,{size:14,style:{color:"#b45309"}}),count:H(eP,"tindak_pidana").length,children:(0,t.jsxs)(R,{id:"fld-laporan-filter-per-17",name:"field_laporan_filter_per_17",children:[(0,t.jsx)("thead",{children:(0,t.jsxs)("tr",{children:[(0,t.jsx)("th",{style:M,children:"Kategori"}),(0,t.jsx)("th",{style:M,children:"Pasal"}),(0,t.jsx)("th",{style:M,children:"UU / Referensi"}),(0,t.jsx)("th",{style:M,children:"Jo. / Subsider"})]})}),(0,t.jsx)("tbody",{children:H(eP,"tindak_pidana").map((e,n)=>(0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{...U,fontWeight:600},children:B(e.nama_kategori_kejahatan)||"(tanpa kategori)"}),(0,t.jsx)("td",{style:U,children:B(e.pasal_mapping)||B(e.pasal)||"—"}),(0,t.jsx)("td",{style:U,children:B(e.nama_uu)||"—"}),(0,t.jsx)("td",{style:U,children:[B(e.juncto)?`Jo. ${B(e.juncto)}`:null,B(e.subsider)?`Sub. ${B(e.subsider)}`:null].filter(Boolean).join(" · ")||"—"})]},n))})]})}),(0,t.jsx)(F,{id:"fld-laporan-filter-per-18",name:"field_laporan_filter_per_18",title:"Pihak Terlibat",icon:(0,t.jsx)(g.Users,{size:14,style:{color:"#2563eb"}}),count:H(eP,"terlibat").length,children:(0,t.jsxs)(R,{id:"fld-laporan-filter-per-19",name:"field_laporan_filter_per_19",children:[(0,t.jsx)("thead",{children:(0,t.jsxs)("tr",{children:[(0,t.jsx)("th",{style:M,children:"Peran"}),(0,t.jsx)("th",{style:M,children:"Nama"}),(0,t.jsx)("th",{style:M,children:"L/P"}),(0,t.jsx)("th",{style:M,children:"Umur"}),(0,t.jsx)("th",{style:M,children:"Pekerjaan"}),(0,t.jsx)("th",{style:M,children:"NIK"}),(0,t.jsx)("th",{style:M,children:"Alamat"})]})}),(0,t.jsx)("tbody",{children:H(eP,"terlibat").map((e,n)=>{let a;return(0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:U,children:B(e.keterlibatan)?(0,t.jsx)(s.Tag,{value:B(e.keterlibatan),severity:(a=B(e.keterlibatan)||"",/pelapor/i.test(a)?"info":/korban/i.test(a)?"success":/terlapor|pelaku|tersangka/i.test(a)?"danger":"warning")}):"—"}),(0,t.jsx)("td",{style:{...U,fontWeight:600},children:B(e.nama)||"—"}),(0,t.jsx)("td",{style:U,children:B(e.jenis_kelamin)||B(e.gender)||"—"}),(0,t.jsx)("td",{style:U,children:B(e.umur)&&"-"!==B(e.umur)?`${B(e.umur)} th`:"—"}),(0,t.jsx)("td",{style:U,children:B(e.pekerjaan)||"—"}),(0,t.jsx)("td",{style:{...U,fontFamily:"monospace"},children:B(e.nik)||"—"}),(0,t.jsx)("td",{style:{...U,minWidth:"12rem"},children:B(e.alamat)||"—"})]},n)})})]})}),(0,t.jsx)(F,{id:"fld-laporan-filter-per-20",name:"field_laporan_filter_per_20",title:"Barang Bukti",icon:(0,t.jsx)(j.Package,{size:14,style:{color:"#0f766e"}}),count:H(eP,"barang_bukti").length,children:(0,t.jsxs)(R,{id:"fld-laporan-filter-per-21",name:"field_laporan_filter_per_21",children:[(0,t.jsx)("thead",{children:(0,t.jsxs)("tr",{children:[(0,t.jsx)("th",{style:M,children:"Jenis"}),(0,t.jsx)("th",{style:M,children:"Jumlah"}),(0,t.jsx)("th",{style:M,children:"Keterangan"}),(0,t.jsx)("th",{style:M,children:"Detail Ranmor"})]})}),(0,t.jsx)("tbody",{children:H(eP,"barang_bukti").map((e,n)=>(0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{style:{...U,fontWeight:600},children:B(e.jenis_bb)||B(e.kode_bb)||"Barang bukti"}),(0,t.jsx)("td",{style:U,children:B(e.jumlah)&&"0"!==B(e.jumlah)?B(e.jumlah):"—"}),(0,t.jsx)("td",{style:{...U,minWidth:"12rem"},children:B(e.keterangan)||"—"}),(0,t.jsx)("td",{style:U,children:[B(e.ran_jenis),B(e.ran_merk),B(e.ran_type),B(e.ran_no_registrasi)].filter(Boolean).join(" · ")||"—"})]},n))})]})})]})}),(0,t.jsx)(u.Dialog,{header:"Update Satker Penanganan",visible:!!eC,onHide:()=>eI(null),style:{width:"40rem",maxWidth:"96vw"},modal:!0,footer:(0,t.jsxs)("div",{children:[(0,t.jsx)(o.Button,{label:"Batal",text:!0,onClick:()=>eI(null),disabled:eU}),(0,t.jsx)(o.Button,{label:"Ubah Satker",icon:"pi pi-check",onClick:eJ,loading:eU,disabled:!eL})]}),children:eC&&(0,t.jsxs)("div",{style:{display:"grid",gap:"0.85rem"},children:[(0,t.jsxs)("div",{style:{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:8,padding:"0.6rem 0.8rem",fontSize:"0.8rem",color:"#92400e"},children:["Ini koreksi mapping langsung untuk memperbaiki kesalahan sistem — ",(0,t.jsx)("strong",{children:"bukan pelimpahan/serah-terima LP"}),". Hanya superadmin, dan setiap perubahan tercatat di log audit."]}),(0,t.jsxs)("div",{style:{background:"var(--surface-hover, #f8fafc)",borderRadius:10,padding:"0.75rem 0.9rem"},children:[(0,t.jsx)("div",{style:{fontSize:"0.72rem",color:"#94a3b8",fontWeight:700,textTransform:"uppercase"},children:"Nomor Laporan"}),(0,t.jsx)("div",{style:{fontWeight:700,marginBottom:"0.4rem"},children:eC.no_laporan}),(0,t.jsxs)("div",{style:{fontSize:"0.82rem",color:"#475569"},children:["Satker saat ini: ",(0,t.jsx)("strong",{children:eC.satker_nama||"—"})]})]}),(0,t.jsxs)("div",{children:[(0,t.jsxs)("label",{style:{marginBottom:"0.3rem",fontSize:"0.8rem",fontWeight:700,color:"#334155",display:"flex",alignItems:"center",gap:"0.35rem"},children:[(0,t.jsx)(P.Search,{size:14})," Cari satker tujuan"]}),(0,t.jsx)(m.AutoComplete,{value:eD,suggestions:e_,completeMethod:eY,field:"deskripsi",onChange:e=>eE("string"==typeof e.value?e.value:e.value.deskripsi),onSelect:e=>{eT(e.value),eE(e.value.deskripsi)},placeholder:"Ketik nama satker (mis. POLSEK MESUJI, POLRES NABIRE)…",delay:300,minLength:2,style:{width:"100%"},inputStyle:{width:"100%"},itemTemplate:e=>(0,t.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.1rem"},children:[(0,t.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.35rem",fontWeight:600},children:[(0,t.jsx)(S.Building2,{size:13,style:{color:"#2563eb"}})," ",e.deskripsi," ",(0,t.jsx)("span",{style:{fontSize:"0.7rem",color:"#94a3b8",fontFamily:"monospace"},children:e.kode})]}),e.jalur&&(0,t.jsx)("span",{style:{fontSize:"0.72rem",color:"#94a3b8",display:"flex",alignItems:"center",gap:"0.2rem",flexWrap:"wrap"},children:e.jalur.split(" > ").map((e,n)=>(0,t.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.2rem"},children:[n>0&&(0,t.jsx)(w.ChevronRight,{size:10,style:{color:"#cbd5e1"}}),e]},n))})]})})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{style:{display:"block",marginBottom:"0.3rem",fontSize:"0.8rem",fontWeight:700,color:"#334155"},children:"… atau telusuri Struktur Satker (Mabes → Polda → Polres → Polsek)"}),(0,t.jsx)(_.default,{onSelect:e=>{e&&(eT({id:Number(e.id),kode:e.kode,deskripsi:e.deskripsi,jalur:""}),eE(e.deskripsi))}})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{style:{display:"block",marginBottom:"0.3rem",fontSize:"0.8rem",fontWeight:700,color:"#334155"},children:"Keterangan / alasan koreksi (opsional, tersimpan di audit log)"}),(0,t.jsx)(p.InputTextarea,{id:"lp-alasan-satker",name:"alasan_satker",value:eA,onChange:e=>eM(e.target.value),rows:2,style:{width:"100%"},placeholder:"mis. kode Pusiknas salah kaprah, LP seharusnya di POLRES X bukan POLRES Y"})]}),eL&&(0,t.jsxs)("div",{style:{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:8,padding:"0.6rem 0.8rem",fontSize:"0.82rem",color:"#1d4ed8"},children:["Satker tujuan terpilih: ",(0,t.jsx)("strong",{children:eL.deskripsi})]})]})}),(0,t.jsx)(u.Dialog,{header:"Hapus Laporan Polisi",visible:!!eB,onHide:()=>ez(null),style:{width:"30rem",maxWidth:"96vw"},modal:!0,footer:(0,t.jsxs)("div",{children:[(0,t.jsx)(o.Button,{label:"Batal",text:!0,onClick:()=>ez(null),disabled:eF}),(0,t.jsx)(o.Button,{label:"Hapus",icon:"pi pi-trash",severity:"danger",onClick:eX,loading:eF,disabled:!eH.trim()})]}),children:eB&&(0,t.jsxs)("div",{style:{display:"grid",gap:"0.75rem"},children:[(0,t.jsxs)("div",{style:{display:"flex",gap:"0.6rem",alignItems:"flex-start",background:"#fef2f2",border:"1px solid #fecaca",borderRadius:8,padding:"0.7rem 0.9rem"},children:[(0,t.jsx)(I.ShieldAlert,{size:20,style:{color:"#dc2626",flex:"0 0 auto",marginTop:"0.1rem"}}),(0,t.jsxs)("div",{style:{fontSize:"0.82rem",color:"#991b1b"},children:["LP ",(0,t.jsx)("strong",{children:eB.no_laporan}),"akan disembunyikan dari daftar & statistik. Data tetap tersimpan di database (bukan hapus permanen) dan tercatat di log audit."]})]}),(0,t.jsxs)("div",{children:[(0,t.jsxs)("label",{style:{display:"block",marginBottom:"0.3rem",fontSize:"0.8rem",fontWeight:700,color:"#334155"},children:["Keterangan / alasan hapus ",(0,t.jsx)("span",{style:{color:"#dc2626"},children:"*"})]}),(0,t.jsx)(p.InputTextarea,{id:"lp-alasan-hapus",name:"alasan_hapus",value:eH,onChange:e=>eK(e.target.value),rows:3,style:{width:"100%"},placeholder:"mis. LP duplikat dari sinkronisasi DORS, data uji yang salah masuk, dll.",autoFocus:!0})]})]})}),(0,t.jsx)(u.Dialog,{header:"Pernyataan Akses Supervisi Satker Regional",visible:!!ackModalOpen,onHide:()=>{if(!ackSubmitting)setAckModalOpen(!1)},style:{width:"36rem",maxWidth:"96vw"},modal:!0,footer:(0,t.jsxs)("div",{style:{display:"flex",justifyContent:"flex-end",gap:"0.5rem"},children:[(0,t.jsx)(o.Button,{label:"Batal",text:!0,onClick:()=>setAckModalOpen(!1),disabled:ackSubmitting}),(0,t.jsx)(o.Button,{label:"Konfirmasi & Masuk",icon:"pi pi-check-circle",severity:"warning",onClick:handleConfirmAck,loading:ackSubmitting,disabled:!ackChecked||!ackAlasan.trim()})]}),children:ackTarget?(0,t.jsxs)("div",{style:{display:"grid",gap:"1rem"},children:[(0,t.jsxs)("div",{style:{display:"flex",gap:"0.75rem",alignItems:"flex-start",background:"#fffbeb",border:"1px solid #fde68a",borderRadius:8,padding:"0.85rem 1rem"},children:[(0,t.jsx)("i",{className:"pi pi-shield",style:{color:"#d97706",fontSize:"1.4rem",marginTop:"0.15rem",flex:"0 0 auto"}}),(0,t.jsxs)("div",{style:{fontSize:"0.84rem",color:"#92400e",lineHeight:1.5},children:[(0,t.jsx)("div",{style:{fontWeight:700,marginBottom:"0.25rem"},children:"Perhatian: Akses Monitoring Satker Regional"}),"Anda akan memasuki dan memantau Daftar Laporan Polisi milik ",(0,t.jsx)("strong",{children:ackTarget.deskripsi||ackTarget.name}),". Sistem hanya akan menampilkan perkara sesuai kewenangan fungsi penanganan Anda. Akses ini dicatat dalam log monitoring kedinasan."]})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{style:{display:"block",marginBottom:"0.35rem",fontSize:"0.82rem",fontWeight:700,color:"#334155"},children:"Tujuan / Alasan Supervisi Kedinasan *"}),(0,t.jsx)(p.InputTextarea,{id:"lp-ack-alasan",name:"alasan_ack",value:ackAlasan,onChange:e=>setAckAlasan(e.target.value),placeholder:"Contoh: Supervisi penanganan perkara kewilayahan / asistensi teknis satker jajaran...",rows:3,style:{width:"100%"}})]}),(0,t.jsxs)("label",{style:{display:"flex",alignItems:"flex-start",gap:"0.6rem",cursor:"pointer",background:"#f8fafc",padding:"0.75rem",borderRadius:6,border:"1px solid #e2e8f0"},children:[(0,t.jsx)("input",{id:"ack-checkbox",name:"ack_checkbox",type:"checkbox",checked:ackChecked,onChange:e=>setAckChecked(e.target.checked),style:{marginTop:"0.2rem",width:"16px",height:"16px",cursor:"pointer"}}),(0,t.jsxs)("span",{style:{fontSize:"0.84rem",color:"#1e293b",lineHeight:1.45,fontWeight:500},children:["Saya yakin untuk masuk ke daftar LP milik si satker ",(0,t.jsx)("strong",{children:ackTarget.deskripsi||ackTarget.name})," di bawah regionalnya dia."]})]})]}):null})]})}],95785)}]);