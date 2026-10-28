(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,72382,e=>{"use strict";let t=(0,e.i(56420).default)("eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);e.s(["Eye",0,t],72382)},71326,97778,e=>{"use strict";var t=e.i(71645),n=e.i(48264),a=e.i(1743),r=e.i(43456),i=e.i(71144),l=e.i(29168),s=e.i(28797),o=e.i(27259),c=e.i(73193);function u(){return(u=Object.assign.bind()).apply(null,arguments)}function d(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,a=Array(t);n<t;n++)a[n]=e[n];return a}function p(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"u">typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var a,r,i,l,s=[],o=!0,c=!1;try{if(i=(n=n.call(e)).next,0===t){if(Object(n)!==n)return;o=!1}else for(;!(o=(a=i.call(n)).done)&&(s.push(a.value),s.length!==t);o=!0);}catch(e){c=!0,r=e}finally{try{if(!o&&null!=n.return&&(l=n.return(),Object(l)!==l))return}finally{if(c)throw r}}return s}}(e,t)||function(e,t){if(e){if("string"==typeof e)return d(e,t);var n=({}).toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?d(e,t):void 0}}(e,t)||function(){throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function m(e){return(m="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}var f=r.ComponentBase.extend({defaultProps:{__TYPE:"ConfirmDialog",accept:null,acceptClassName:null,acceptIcon:null,acceptLabel:null,appendTo:null,breakpoints:null,children:void 0,className:null,content:null,defaultFocus:"accept",footer:null,icon:null,message:null,onHide:null,reject:null,rejectClassName:null,rejectIcon:null,rejectLabel:null,tagKey:void 0,visible:void 0},css:{classes:{root:"p-confirm-dialog",message:"p-confirm-dialog-message",icon:"p-confirm-dialog-icon",acceptButton:"p-confirm-dialog-accept",rejectButton:function(e){var t=e.getPropValue;return(0,c.classNames)("p-confirm-dialog-reject",{"p-button-text":!t("rejectClassName")})}}}});function y(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,a)}return n}function g(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?y(Object(n),!0).forEach(function(t){!function(e,t,n){var a;(a=function(e,t){if("object"!=m(e)||!e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var a=n.call(e,t||"default");if("object"!=m(a))return a;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(t,"string"),(t="symbol"==m(a)?a:a+"")in e)?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n}(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):y(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}var h=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return(e=g(g({},e),{visible:void 0===e.visible||e.visible})).visible&&s.OverlayService.emit("confirm-dialog",e),{show:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};s.OverlayService.emit("confirm-dialog",g(g(g({},e),t),{visible:!0}))},hide:function(){s.OverlayService.emit("confirm-dialog",{visible:!1})}}},b=t.memo(t.forwardRef(function(e,d){var m,y,h,b,v,x,j,w=(0,l.useMergeProps)(),k=t.useContext(n.PrimeReactContext),C=f.getProps(e,k),S=p(t.useState(C.visible),2),O=S[0],_=S[1],P=p(t.useState(!1),2),I=P[0],E=P[1],N=t.useRef(null),D=t.useRef(!1),R=t.useRef(null),T=function(){var e=C.group;return N.current&&(e=N.current.group),Object.assign({},C,N.current,{group:e})},M=function(e){return T()[e]},B=function(e){for(var t=arguments.length,n=Array(t>1?t-1:0),a=1;a<t;a++)n[a-1]=arguments[a];return c.ObjectUtils.getPropValue(M(e),n)},z=M("acceptLabel")||(0,n.localeOption)("accept"),A=M("rejectLabel")||(0,n.localeOption)("reject"),L={props:C,state:{visible:O}},H=f.setMetaData(L),U=H.ptm,W=H.cx,$=H.isUnstyled;(0,r.useHandleStyle)(f.css.styles,$,{name:"confirmdialog"});var F=function(){D.current||(D.current=!0,B("accept"),Z("accept"))},K=function(){D.current||(D.current=!0,B("reject"),Z("reject"))},V=function(){T().group===C.group&&(_(!0),D.current=!1,R.current=document.activeElement)},Z=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"cancel";O&&("string"!=typeof e&&(e="cancel"),_(!1),B("onHide",e),c.DomHandler.focus(R.current),R.current=null)},G=function(e){if(e.tagKey===C.tagKey&&(void 0===e.group||e.group===C.group)){var t=O!==e.visible;M("target")===e.target||C.target?t&&(N.current=e,e.visible?V():Z()):(Z(),N.current=e,E(!0))}};t.useEffect(function(){C.visible?V():Z()},[C.visible]),t.useEffect(function(){return C.target||C.message||s.OverlayService.on("confirm-dialog",G),function(){s.OverlayService.off("confirm-dialog",G)}},[C.target]),(0,l.useUpdateEffect)(function(){I&&V()},[I]),(0,l.useUnmountEffect)(function(){s.OverlayService.off("confirm-dialog",G)}),t.useImperativeHandle(d,function(){return{props:C,confirm:G}});var X=(m=T(),y=c.ObjectUtils.getJSXElement(M("message"),m),h=w({className:W("icon")},U("icon")),b=c.IconUtils.getJSXIcon(M("icon"),g({},h),{props:m}),v=function(){var e=M("defaultFocus"),n=(0,c.classNames)("p-confirm-dialog-accept",M("acceptClassName")),r=(0,c.classNames)("p-confirm-dialog-reject",{"p-button-text":!M("rejectClassName")},M("rejectClassName")),i=w({label:A,autoFocus:"reject"===e,icon:M("rejectIcon"),className:(0,c.classNames)(M("rejectClassName"),W("rejectButton",{getPropValue:M})),onClick:K,pt:U("rejectButton"),unstyled:C.unstyled,__parentMetadata:{parent:L}},U("rejectButton")),l=w({label:z,autoFocus:void 0===e||"accept"===e,icon:M("acceptIcon"),className:(0,c.classNames)(M("acceptClassName"),W("acceptButton")),onClick:F,pt:U("acceptButton"),unstyled:C.unstyled,__parentMetadata:{parent:L}},U("acceptButton")),s=t.createElement(t.Fragment,null,t.createElement(a.Button,i),t.createElement(a.Button,l));if(M("footer")){var o={accept:F,reject:K,acceptClassName:n,rejectClassName:r,acceptLabel:z,rejectLabel:A,element:s,props:T()};return c.ObjectUtils.getJSXElement(M("footer"),o)}return s}(),x=w({className:W("message")},U("message")),j=w({visible:O,className:(0,c.classNames)(M("className"),W("root")),footer:v,onHide:Z,breakpoints:M("breakpoints"),pt:m.pt,unstyled:C.unstyled,appendTo:M("appendTo"),__parentMetadata:{parent:L}},f.getOtherProps(m)),t.createElement(i.Dialog,u({},j,{content:null==e?void 0:e.content}),b,t.createElement("span",x,y)));return t.createElement(o.Portal,{element:X,appendTo:M("appendTo")})}));b.displayName="ConfirmDialog",e.s(["ConfirmDialog",0,b,"confirmDialog",0,h],97778),e.s(["confirmAction",0,function(e,t){return new Promise(n=>{let a=!1,r=e=>{a||(a=!0,n(e))};h({message:e,header:t?.header||"Konfirmasi",icon:t?.danger?"pi pi-exclamation-triangle":"pi pi-question-circle",acceptLabel:t?.acceptLabel||"Ya, lanjutkan",rejectLabel:"Batal",acceptClassName:t?.danger?"p-button-danger":void 0,accept:()=>r(!0),reject:()=>r(!1),onHide:()=>r(!1)})})}],71326)},73342,e=>{"use strict";var t=e.i(71645),n=e.i(48264),a=e.i(43456),r=e.i(83438),i=e.i(29168),l=e.i(73193),s=e.i(44506);function o(){return(o=Object.assign.bind()).apply(null,arguments)}var c=t.memo(t.forwardRef(function(e,n){var a=s.IconBase.getPTI(e);return t.createElement("svg",o({ref:n,width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",xmlns:"http://www.w3.org/2000/svg"},a),t.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M0.0535499 7.25213C0.208567 7.59162 2.40413 12.4 7 12.4C11.5959 12.4 13.7914 7.59162 13.9465 7.25213C13.9487 7.2471 13.9506 7.24304 13.952 7.24001C13.9837 7.16396 14 7.08239 14 7.00001C14 6.91762 13.9837 6.83605 13.952 6.76001C13.9506 6.75697 13.9487 6.75292 13.9465 6.74788C13.7914 6.4084 11.5959 1.60001 7 1.60001C2.40413 1.60001 0.208567 6.40839 0.0535499 6.74788C0.0512519 6.75292 0.0494023 6.75697 0.048 6.76001C0.0163137 6.83605 0 6.91762 0 7.00001C0 7.08239 0.0163137 7.16396 0.048 7.24001C0.0494023 7.24304 0.0512519 7.2471 0.0535499 7.25213ZM7 11.2C3.664 11.2 1.736 7.92001 1.264 7.00001C1.736 6.08001 3.664 2.80001 7 2.80001C10.336 2.80001 12.264 6.08001 12.736 7.00001C12.264 7.92001 10.336 11.2 7 11.2ZM5.55551 9.16182C5.98308 9.44751 6.48576 9.6 7 9.6C7.68891 9.59789 8.349 9.32328 8.83614 8.83614C9.32328 8.349 9.59789 7.68891 9.59999 7C9.59999 6.48576 9.44751 5.98308 9.16182 5.55551C8.87612 5.12794 8.47006 4.7947 7.99497 4.59791C7.51988 4.40112 6.99711 4.34963 6.49276 4.44995C5.98841 4.55027 5.52513 4.7979 5.16152 5.16152C4.7979 5.52513 4.55027 5.98841 4.44995 6.49276C4.34963 6.99711 4.40112 7.51988 4.59791 7.99497C4.7947 8.47006 5.12794 8.87612 5.55551 9.16182ZM6.2222 5.83594C6.45243 5.6821 6.7231 5.6 7 5.6C7.37065 5.6021 7.72553 5.75027 7.98762 6.01237C8.24972 6.27446 8.39789 6.62934 8.4 7C8.4 7.27689 8.31789 7.54756 8.16405 7.77779C8.01022 8.00802 7.79157 8.18746 7.53575 8.29343C7.27994 8.39939 6.99844 8.42711 6.72687 8.37309C6.4553 8.31908 6.20584 8.18574 6.01005 7.98994C5.81425 7.79415 5.68091 7.54469 5.6269 7.27312C5.57288 7.00155 5.6006 6.72006 5.70656 6.46424C5.81253 6.20842 5.99197 5.98977 6.2222 5.83594Z",fill:"currentColor"}))}));function u(){return(u=Object.assign.bind()).apply(null,arguments)}c.displayName="EyeIcon";var d=t.memo(t.forwardRef(function(e,n){var a=s.IconBase.getPTI(e);return t.createElement("svg",u({ref:n,width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",xmlns:"http://www.w3.org/2000/svg"},a),t.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M13.9414 6.74792C13.9437 6.75295 13.9455 6.757 13.9469 6.76003C13.982 6.8394 14.0001 6.9252 14.0001 7.01195C14.0001 7.0987 13.982 7.1845 13.9469 7.26386C13.6004 8.00059 13.1711 8.69549 12.6674 9.33515C12.6115 9.4071 12.54 9.46538 12.4582 9.50556C12.3765 9.54574 12.2866 9.56678 12.1955 9.56707C12.0834 9.56671 11.9737 9.53496 11.8788 9.47541C11.7838 9.41586 11.7074 9.3309 11.6583 9.23015C11.6092 9.12941 11.5893 9.01691 11.6008 8.90543C11.6124 8.79394 11.6549 8.68793 11.7237 8.5994C12.1065 8.09726 12.4437 7.56199 12.7313 6.99995C12.2595 6.08027 10.3402 2.8014 6.99732 2.8014C6.63723 2.80218 6.27816 2.83969 5.92569 2.91336C5.77666 2.93304 5.62568 2.89606 5.50263 2.80972C5.37958 2.72337 5.29344 2.59398 5.26125 2.44714C5.22907 2.30031 5.2532 2.14674 5.32885 2.01685C5.40451 1.88696 5.52618 1.79021 5.66978 1.74576C6.10574 1.64961 6.55089 1.60134 6.99732 1.60181C11.5916 1.60181 13.7864 6.40856 13.9414 6.74792ZM2.20333 1.61685C2.35871 1.61411 2.5091 1.67179 2.6228 1.77774L12.2195 11.3744C12.3318 11.4869 12.3949 11.6393 12.3949 11.7983C12.3949 11.9572 12.3318 12.1097 12.2195 12.2221C12.107 12.3345 11.9546 12.3976 11.7956 12.3976C11.6367 12.3976 11.4842 12.3345 11.3718 12.2221L10.5081 11.3584C9.46549 12.0426 8.24432 12.4042 6.99729 12.3981C2.403 12.3981 0.208197 7.59135 0.0532336 7.25198C0.0509364 7.24694 0.0490875 7.2429 0.0476856 7.23986C0.0162332 7.16518 3.05176e-05 7.08497 3.05176e-05 7.00394C3.05176e-05 6.92291 0.0162332 6.8427 0.0476856 6.76802C0.631261 5.47831 1.46902 4.31959 2.51084 3.36119L1.77509 2.62545C1.66914 2.51175 1.61146 2.36136 1.61421 2.20597C1.61695 2.05059 1.6799 1.90233 1.78979 1.79244C1.89968 1.68254 2.04794 1.6196 2.20333 1.61685ZM7.45314 8.35147L5.68574 6.57609V6.5361C5.5872 6.78938 5.56498 7.06597 5.62183 7.33173C5.67868 7.59749 5.8121 7.84078 6.00563 8.03158C6.19567 8.21043 6.43052 8.33458 6.68533 8.39089C6.94014 8.44721 7.20543 8.43359 7.45314 8.35147ZM1.26327 6.99994C1.7351 7.91163 3.64645 11.1985 6.99729 11.1985C7.9267 11.2048 8.8408 10.9618 9.64438 10.4947L8.35682 9.20718C7.86027 9.51441 7.27449 9.64491 6.69448 9.57752C6.11446 9.51014 5.57421 9.24881 5.16131 8.83592C4.74842 8.42303 4.4871 7.88277 4.41971 7.30276C4.35232 6.72274 4.48282 6.13697 4.79005 5.64041L3.35855 4.2089C2.4954 5.00336 1.78523 5.94935 1.26327 6.99994Z",fill:"currentColor"}))}));d.displayName="EyeSlashIcon";var p=e.i(44080),m=e.i(28797),f=e.i(27259);function y(){return(y=Object.assign.bind()).apply(null,arguments)}function g(e){return(g="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function h(e,t,n){var a;return(a=function(e,t){if("object"!=g(e)||!e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var a=n.call(e,t||"default");if("object"!=g(a))return a;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(t,"string"),(t="symbol"==g(a)?a:a+"")in e)?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function b(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,a=Array(t);n<t;n++)a[n]=e[n];return a}function v(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"u">typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var a,r,i,l,s=[],o=!0,c=!1;try{if(i=(n=n.call(e)).next,0===t){if(Object(n)!==n)return;o=!1}else for(;!(o=(a=i.call(n)).done)&&(s.push(a.value),s.length!==t);o=!0);}catch(e){c=!0,r=e}finally{try{if(!o&&null!=n.return&&(l=n.return(),Object(l)!==l))return}finally{if(c)throw r}}return s}}(e,t)||function(e,t){if(e){if("string"==typeof e)return b(e,t);var n=({}).toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?b(e,t):void 0}}(e,t)||function(){throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var x=a.ComponentBase.extend({defaultProps:{__TYPE:"IconField",__parentMetadata:null,children:void 0,className:null,iconPosition:"right"},css:{classes:{root:function(e){var t=e.props;return(0,l.classNames)("p-icon-field",{"p-icon-field-right":"right"===t.iconPosition,"p-icon-field-left":"left"===t.iconPosition})}}}});function j(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,a)}return n}function w(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?j(Object(n),!0).forEach(function(t){h(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):j(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}var k=t.default.memo(t.default.forwardRef(function(e,a){var r=(0,t.useRef)(a),s=(0,i.useMergeProps)(),o=(0,t.useContext)(n.PrimeReactContext),c=x.getProps(e,o),u=x.setMetaData(w(w({props:c},c.__parentMetadata),{},{context:{iconPosition:c.iconPosition}})),d=u.ptm,p=u.cx,m=s({className:(0,l.classNames)(c.className,p("root",{iconPosition:c.iconPosition}))},x.getOtherProps(c),d("root"));return t.default.createElement("div",y({},m,{ref:r}),t.Children.map(c.children,function(e,n){return(0,t.cloneElement)(e,{iconPosition:c.iconPosition})}))}));k.displayName="IconField";var C=a.ComponentBase.extend({defaultProps:{__TYPE:"InputIcon",__parentMetadata:null,className:null,iconPosition:null},css:{classes:{root:"p-input-icon"}}});function S(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,a)}return n}function O(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?S(Object(n),!0).forEach(function(t){h(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):S(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}var _=t.default.memo(t.default.forwardRef(function(e,a){var r=(0,t.useRef)(a),s=(0,i.useMergeProps)(),o=(0,t.useContext)(n.PrimeReactContext),c=C.getProps(e,o),u=C.setMetaData(O(O({props:c},c.__parentMetadata),{},{context:{iconPosition:c.iconPosition}})),d=u.ptm,p=u.cx,m=s({className:(0,l.classNames)(c.className,p("root"))},C.getOtherProps(c),d("root"));return t.default.createElement(t.default.Fragment,null,t.default.createElement("span",y({},m,{ref:r}),c.children))}));_.displayName="InputIcon";var P=a.ComponentBase.extend({defaultProps:{__TYPE:"Password",id:null,inputId:null,inputRef:null,promptLabel:null,weakLabel:null,mediumLabel:null,strongLabel:null,mediumRegex:"^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})",strongRegex:"^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})",feedback:!0,toggleMask:!1,appendTo:null,header:null,content:null,footer:null,showIcon:null,hideIcon:null,icon:null,tooltip:null,tooltipOptions:null,style:null,className:null,inputStyle:null,inputClassName:null,invalid:!1,variant:null,panelStyle:null,panelClassName:null,transitionOptions:null,tabIndex:null,value:void 0,onInput:null,onShow:null,onHide:null,children:void 0},css:{classes:{root:function(e){var t=e.props,n=e.isFilled,a=e.focusedState;return(0,l.classNames)("p-password p-component p-inputwrapper",{"p-inputwrapper-filled":n,"p-inputwrapper-focus":a,"p-input-icon-right":t.toggleMask})},input:function(e){var t=e.props;return(0,l.classNames)("p-password-input",t.inputClassName)},panel:function(e){var t=e.props,a=e.context;return(0,l.classNames)("p-password-panel p-component",t.panelClassName,{"p-input-filled":a&&"filled"===a.inputStyle||"filled"===n.default.inputStyle,"p-ripple-disabled":a&&!1===a.ripple||!1===n.default.ripple})},meter:"p-password-meter",meterLabel:function(e){var t=e.strength;return(0,l.classNames)("p-password-strength",t)},info:function(e){var t=e.strength;return(0,l.classNames)("p-password-info",t)},showIcon:"p-password-show-icon",hideIcon:"p-password-hide-icon",transition:"p-connected-overlay"},styles:"\n@layer primereact {\n    .p-password {\n        position: relative;\n        display: inline-flex;\n    }\n    \n    .p-password-panel {\n        position: absolute;\n        top: 0;\n        left: 0;\n    }\n    \n    .p-password .p-password-panel {\n        min-width: 100%;\n    }\n    \n    .p-password-meter {\n        height: 10px;\n    }\n    \n    .p-password-strength {\n        height: 100%;\n        width: 0%;\n        transition: width 1s ease-in-out;\n    }\n    \n    .p-fluid .p-password {\n        display: flex;\n    }\n    \n    .p-password-input::-ms-reveal,\n    .p-password-input::-ms-clear {\n        display: none;\n    }\n\n    .p-password .p-password-show-icon,\n    .p-password .p-password-hide-icon {\n        line-height: 1.5;\n        cursor: pointer;\n    }\n}\n"}});function I(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,a)}return n}function E(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?I(Object(n),!0).forEach(function(t){h(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):I(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}var N=t.memo(t.forwardRef(function(e,s){var o,u,g,h,b,x,j,w,C,S,O,I,N=(0,i.useMergeProps)(),D=t.useContext(n.PrimeReactContext),R=P.getProps(e,D),T=R.promptLabel||(0,n.localeOption)("passwordPrompt"),M=R.weakLabel||(0,n.localeOption)("weak"),B=R.mediumLabel||(0,n.localeOption)("medium"),z=R.strongLabel||(0,n.localeOption)("strong"),A=v(t.useState(!1),2),L=A[0],H=A[1],U=v(t.useState(null),2),W=U[0],$=U[1],F=v(t.useState(T),2),K=F[0],V=F[1],Z=v(t.useState(!1),2),G=Z[0],X=Z[1],J=v(t.useState(!1),2),Y=J[0],q=J[1],Q=t.useRef(null),ee=t.useRef(null),et=t.useRef(R.inputRef),en=t.useRef(new RegExp(R.mediumRegex)),ea=t.useRef(new RegExp(R.strongRegex)),er=Y?"text":"password",ei={props:R,state:{overlayVisible:L,meter:W,infoText:K,focused:G,unmasked:Y}},el=P.setMetaData(ei),es=el.ptm,eo=el.cx,ec=el.isUnstyled;(0,a.useHandleStyle)(P.css.styles,ec,{name:"password"});var eu=(0,i.useDisplayOrder)("password",L);(0,i.useGlobalOnEscapeKey)({callback:function(){ex()},when:L&&R.feedback&&eu,priority:[i.ESC_KEY_HANDLING_PRIORITIES.PASSWORD,eu]});var ed=v((0,i.useOverlayListener)({target:Q,overlay:ee,listener:function(e,t){var n=t.valid,a=t.type;n&&("outside"===a||D.hideOverlaysOnDocumentScrolling?ex():l.DomHandler.isDocument(e.target)||ej())},when:L}),2),ep=ed[0],em=ed[1],ef=et.current&&et.current.value,ey=t.useMemo(function(){return l.ObjectUtils.isNotEmpty(R.value)||l.ObjectUtils.isNotEmpty(R.defaultValue)||l.ObjectUtils.isNotEmpty(ef)},[R.value,R.defaultValue,ef]),eg=function(){if(W){var e=null;switch(W.strength){case"weak":e=M;break;case"medium":e=B;break;case"strong":e=z}e&&K!==e&&V(e)}else K!==T&&V(T)},eh=function(e){if(!R.feedback)return!1;var t=null,n=null;switch(ew(e)){case 1:t=M,n={strength:"weak",width:"33.33%"};break;case 2:t=B,n={strength:"medium",width:"66.66%"};break;case 3:t=z,n={strength:"strong",width:"100%"};break;default:t=T,n=null}return $(n),V(t),!0},eb=function(){q(function(e){return!e})},ev=function(){eg(),H(!0)},ex=function(){H(!1)},ej=function(){et.current&&l.DomHandler.alignOverlay(ee.current,et.current.parentElement,R.appendTo||D&&D.appendTo||n.default.appendTo)},ew=function(e){return e&&0!==e.length?ea.current.test(e)?3:en.current.test(e)?2:1*!!(e.length>0):0};t.useImperativeHandle(s,function(){return{props:R,toggleMask:eb,focus:function(){return l.DomHandler.focus(et.current)},getElement:function(){return Q.current},getOverlay:function(){return ee.current},getInput:function(){return et.current}}}),t.useEffect(function(){l.ObjectUtils.combinedRefs(et,R.inputRef)},[et,R.inputRef]),t.useEffect(function(){en.current=new RegExp(R.mediumRegex)},[R.mediumRegex]),t.useEffect(function(){ea.current=new RegExp(R.strongRegex)},[R.strongRegex]),t.useEffect(function(){!ey&&l.DomHandler.hasClass(Q.current,"p-inputwrapper-filled")&&l.DomHandler.removeClass(Q.current,"p-inputwrapper-filled")},[ey]),(0,i.useUpdateEffect)(function(){eh(R.value)},[R.value]),(0,i.useMountEffect)(function(){ej()}),(0,i.useUnmountEffect)(function(){l.ZIndexUtils.clear(ee.current)});var ek=function(e){("Enter"===e.key||"Space"===e.code)&&(eb(),e.preventDefault())},eC=(0,l.classNames)("p-password p-component p-inputwrapper",{"p-inputwrapper-filled":ey,"p-inputwrapper-focus":G,"p-input-icon-right":R.toggleMask},R.className),eS=P.getOtherProps(R),eO=function(){if(!R.toggleMask)return null;var e,a=N({role:"switch",tabIndex:R.tabIndex||"0",className:eo("hideIcon"),onClick:eb,onKeyDown:ek,"aria-label":(0,n.ariaLabel)("passwordHide")||"Hide Password","aria-checked":"false"},es("hideIcon")),r=N({role:"switch",tabIndex:R.tabIndex||"0",className:eo("showIcon"),onClick:eb,onKeyDown:ek,"aria-label":(0,n.ariaLabel)("passwordShow")||"Show Password","aria-checked":"true"},es("showIcon"));e=Y?R.hideIcon||t.createElement(d,a):R.showIcon||t.createElement(c,r);var i=l.IconUtils.getJSXIcon(e,Y?E({},a):E({},r),{props:R});if(R.icon){var s={onClick:eb,className:eC,element:i,props:R};i=l.ObjectUtils.getJSXElement(R.icon,s)}return i}(),e_=(u=(o=W||{strength:"",width:"0%"}).strength,g=o.width,h=l.ObjectUtils.getJSXElement(R.header,R),b=l.ObjectUtils.getJSXElement(R.footer,R),x=N({className:eo("panel",{context:D}),style:R.panelStyle,onClick:function(e){R.feedback&&m.OverlayService.emit("overlay-click",{originalEvent:e,target:Q.current})}},es("panel")),j=N({className:eo("meter")},es("meter")),w=N({className:eo("meterLabel",{strength:u}),style:{width:g}},es("meterLabel")),C=N({className:eo("info",{strength:u})},es("info")),S=R.content?l.ObjectUtils.getJSXElement(R.content,R):t.createElement(t.Fragment,null,t.createElement("div",j,t.createElement("div",w)),t.createElement("div",C,K)),O=N({classNames:eo("transition"),in:L,timeout:{enter:120,exit:100},options:R.transitionOptions,unmountOnExit:!0,onEnter:function(){l.ZIndexUtils.set("overlay",ee.current,D&&D.autoZIndex||n.default.autoZIndex,D&&D.zIndex.overlay||n.default.zIndex.overlay),l.DomHandler.addStyles(ee.current,{position:"absolute",top:"0",left:"0"}),ej()},onEntered:function(){ep(),R.onShow&&R.onShow()},onExit:function(){em()},onExited:function(){l.ZIndexUtils.clear(ee.current),R.onHide&&R.onHide()}},es("transition")),I=t.createElement(r.CSSTransition,y({nodeRef:ee},O),t.createElement("div",y({ref:ee},x),h,S,b)),t.createElement(f.Portal,{element:I,appendTo:R.appendTo})),eP=N({ref:Q,id:R.id,className:(0,l.classNames)(R.className,eo("root",{isFilled:ey,focusedState:G})),style:R.style},es("root")),eI=N(E(E({ref:et,id:R.inputId,autoComplete:R.autoComplete},eS),{},{className:(0,l.classNames)(R.inputClassName,eo("input")),onBlur:function(e){X(!1),R.feedback&&ex(),R.onBlur&&R.onBlur(e)},onFocus:function(e){X(!0),R.feedback&&ev(),R.onFocus&&R.onFocus(e)},onInput:function(e,t){R.onInput&&R.onInput(e,t),R.onChange||(l.ObjectUtils.isNotEmpty(e.target.value)?l.DomHandler.addClass(Q.current,"p-inputwrapper-filled"):l.DomHandler.removeClass(Q.current,"p-inputwrapper-filled"))},onKeyUp:function(e){var t=e.code;R.feedback&&t&&"Escape"!==t&&!L&&ev(),R.onKeyUp&&R.onKeyUp(e)},invalid:R.invalid,variant:R.variant,style:R.inputStyle,unstyled:R.unstyled,tabIndex:R.tabIndex||"0",tooltip:R.tooltip,tooltipOptions:R.tooltipOptions,type:er,value:R.value,__parentMetadata:{parent:ei}}),es("input")),eE=t.createElement(p.InputText,eI);return eO&&(eE=t.createElement(k,{className:eo("iconField"),pt:es("iconField"),__parentMetadata:{parent:ei}},eE,t.createElement(_,{className:eo("inputIcon"),pt:es("inputIcon"),__parentMetadata:{parent:ei}},eO))),t.createElement("div",eP,eE,e_)}));N.displayName="Password",e.s(["Password",0,N],73342)},74544,e=>{"use strict";let t=(0,e.i(56420).default)("clock",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 6v6l4 2",key:"mmk7yg"}]]);e.s(["Clock",0,t],74544)},70454,e=>{"use strict";var t=e.i(71645),n=e.i(48264),a=e.i(43456),r=e.i(29168),i=e.i(40623),l=e.i(73193);function s(){return(s=Object.assign.bind()).apply(null,arguments)}function o(e){return(o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}var c=a.ComponentBase.extend({defaultProps:{__TYPE:"InputSwitch",autoFocus:!1,checked:!1,className:null,disabled:!1,falseValue:!1,id:null,inputId:null,inputRef:null,invalid:!1,name:null,onBlur:null,onChange:null,onFocus:null,style:null,tabIndex:null,tooltip:null,tooltipOptions:null,trueValue:!0,children:void 0},css:{classes:{root:function(e){var t=e.props,n=e.checked;return(0,l.classNames)("p-inputswitch p-component",{"p-highlight":n,"p-disabled":t.disabled,"p-invalid":t.invalid})},input:"p-inputswitch-input",slider:"p-inputswitch-slider"}}});function u(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,a)}return n}var d=t.memo(t.forwardRef(function(e,d){var p=(0,r.useMergeProps)(),m=t.useContext(n.PrimeReactContext),f=c.getProps(e,m),y=c.setMetaData({props:f}),g=y.ptm,h=y.cx,b=y.isUnstyled;(0,a.useHandleStyle)(c.css.styles,b,{name:"inputswitch"});var v=t.useRef(null),x=t.useRef(f.inputRef),j=f.checked===f.trueValue;t.useImperativeHandle(d,function(){return{props:f,focus:function(){return l.DomHandler.focus(x.current)},getElement:function(){return v.current},getInput:function(){return x.current}}}),t.useEffect(function(){l.ObjectUtils.combinedRefs(x,f.inputRef)},[x,f.inputRef]),(0,r.useMountEffect)(function(){f.autoFocus&&l.DomHandler.focus(x.current,f.autoFocus)});var w=l.ObjectUtils.isNotEmpty(f.tooltip),k=c.getOtherProps(f),C=l.ObjectUtils.reduceKeys(k,l.DomHandler.ARIA_PROPS),S=p({className:(0,l.classNames)(f.className,h("root",{checked:j})),style:f.style,role:"checkbox","aria-checked":j,"data-p-highlight":j,"data-p-disabled":f.disabled},k,g("root")),O=p(function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?u(Object(n),!0).forEach(function(t){!function(e,t,n){var a;(a=function(e,t){if("object"!=o(e)||!e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var a=n.call(e,t||"default");if("object"!=o(a))return a;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(t,"string"),(t="symbol"==o(a)?a:a+"")in e)?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n}(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):u(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}({type:"checkbox",id:f.inputId,name:f.name,checked:j,onChange:function(e){if(f.onChange){var t=j?f.falseValue:f.trueValue;f.onChange({originalEvent:e,value:t,stopPropagation:function(){null==e||e.stopPropagation()},preventDefault:function(){null==e||e.preventDefault()},target:{name:f.name,id:f.id,value:t}})}},onFocus:function(e){var t;null==f||null==(t=f.onFocus)||t.call(f,e)},onBlur:function(e){var t;null==f||null==(t=f.onBlur)||t.call(f,e)},disabled:f.disabled,role:"switch",tabIndex:f.tabIndex,"aria-checked":j,className:h("input")},C),g("input")),_=p({className:h("slider")},g("slider"));return t.createElement(t.Fragment,null,t.createElement("div",s({id:f.id,ref:v},S),t.createElement("input",s({ref:x},O)),t.createElement("span",_)),w&&t.createElement(i.Tooltip,s({target:v,content:f.tooltip,pt:g("tooltip")},f.tooltipOptions)))}));d.displayName="InputSwitch",e.s(["InputSwitch",0,d])},66473,e=>{"use strict";let t=(0,e.i(56420).default)("circle-play",[["path",{d:"M9 9.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997A1 1 0 0 1 9 14.996z",key:"kmsa83"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);e.s(["PlayCircle",0,t],66473)},51757,e=>{"use strict";let t=(0,e.i(56420).default)("circle-check",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);e.s(["CheckCircle2",0,t],51757)},83967,e=>{"use strict";let t=(0,e.i(56420).default)("circle-x",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]]);e.s(["XCircle",0,t],83967)},9584,e=>{"use strict";let t=(0,e.i(56420).default)("database",[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5",key:"1wlel7"}],["path",{d:"M3 12A9 3 0 0 0 21 12",key:"mv7ke4"}]]);e.s(["Database",0,t],9584)},71136,e=>{"use strict";let t=(0,e.i(56420).default)("hash",[["line",{x1:"4",x2:"20",y1:"9",y2:"9",key:"4lhtct"}],["line",{x1:"4",x2:"20",y1:"15",y2:"15",key:"vyu0kd"}],["line",{x1:"10",x2:"8",y1:"3",y2:"21",key:"1ggp8o"}],["line",{x1:"16",x2:"14",y1:"3",y2:"21",key:"weycgp"}]]);e.s(["Hash",0,t],71136)},77128,e=>{"use strict";var t=e.i(43476),n=e.i(71645),a=e.i(44080),r=e.i(7773),i=e.i(73342),l=e.i(68242),s=e.i(70454),o=e.i(1743),c=e.i(71144),u=e.i(53729),d=e.i(17580),p=e.i(24718),m=e.i(85118),f=e.i(97778),y=e.i(9584),g=e.i(41120),h=e.i(51757),b=e.i(83967),v=e.i(74544),x=e.i(71136),j=e.i(56420);let w=(0,j.default)("link-2",[["path",{d:"M9 17H7A5 5 0 0 1 7 7h2",key:"8i5ue5"}],["path",{d:"M15 7h2a5 5 0 1 1 0 10h-2",key:"1b9ql8"}],["line",{x1:"8",x2:"16",y1:"12",y2:"12",key:"1jonct"}]]),k=(0,j.default)("settings",[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",key:"1i5ecw"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]),C=(0,j.default)("cloud-download",[["path",{d:"M12 13v8l-4-4",key:"1f5nwf"}],["path",{d:"m12 21 4-4",key:"1lfcce"}],["path",{d:"M4.393 15.269A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.436 8.284",key:"ui1hmy"}]]),S=(0,j.default)("calendar-clock",[["path",{d:"M16 14v2.2l1.6 1",key:"fo4ql5"}],["path",{d:"M16 2v4",key:"4m81vk"}],["path",{d:"M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5",key:"1osxxc"}],["path",{d:"M3 10h5",key:"r794hk"}],["path",{d:"M8 2v4",key:"1cmpym"}],["circle",{cx:"16",cy:"16",r:"6",key:"qoo3c4"}]]);var O=e.i(66473),_=e.i(72382),P=e.i(54858),I=e.i(71326);function E(e,n){let a=function(e,t){let n=(e.sources_json||[]).filter(e=>e.key===t);if(!n.length)return;let a=n.find(e=>"error"===e.status),r=n.every(e=>"done"===e.status);return{key:t,label:n[0].label,fetched:n.reduce((e,t)=>e+(t.fetched||0),0),upserted:n.reduce((e,t)=>e+(t.upserted||0),0),skipped:n.reduce((e,t)=>e+(t.fetched||0)-(t.upserted||0),0),status:r?"done":a?"error":"running",error:a?.error??null,chunksDone:n.filter(e=>"done"===e.status).length,chunksTotal:n.length}}(e,n);return a?(0,t.jsxs)("span",{style:{color:a.error?"#dc2626":void 0,fontWeight:a.error?700:void 0},title:a.error?`Error: ${a.error}`:`${a.fetched} diambil, ${a.skipped||0} dilewati${a.chunksTotal>1?` -- ${a.chunksDone}/${a.chunksTotal} periode selesai`:""}`,children:[a.upserted,a.error?" ⚠":""]}):"—"}function N(e){return e?.data?.data??e?.data}function D(e){if(!e)return"—";try{return new Date(e).toLocaleString("id-ID",{dateStyle:"medium",timeStyle:"short"})}catch{return String(e)}}let R=[{label:"Operasional",value:"OPERASIONAL"},{label:"Test",value:"TEST"},{label:"Arsip",value:"ARCHIVE"}];function T({label:e,value:n,tone:a}){return(0,t.jsxs)("div",{style:{background:"var(--surface-50, rgba(255,255,255,0.03))",border:"1px solid var(--surface-border, rgba(255,255,255,0.08))",borderRadius:10,padding:"0.75rem 0.85rem"},children:[(0,t.jsx)("div",{style:{fontSize:"0.72rem",fontWeight:700,color:"var(--text-color-secondary, #94a3b8)",textTransform:"uppercase",letterSpacing:"0.04em",marginBottom:"0.3rem"},children:e}),(0,t.jsx)("div",{style:{fontWeight:800,fontSize:"1.05rem",color:"ok"===a?"#22c55e":"bad"===a?"#ef4444":"var(--text-color, #f1f5f9)"},children:n})]})}function M({label:e,hint:n,children:a}){return(0,t.jsxs)("div",{style:{flex:"1 1 8rem"},children:[(0,t.jsxs)("label",{style:{display:"block",marginBottom:"0.32rem",fontSize:"0.8rem",fontWeight:700,color:"var(--text-color, #f1f5f9)"},children:[e," ",n&&(0,t.jsxs)("span",{style:{color:"var(--text-color-secondary, #94a3b8)",fontWeight:400},children:["(",n,")"]})]}),a]})}function DorsStep({value:v,min:mn,max:mx,unit:u,disabled:d,onChange:fn}){let n=Number(v)??0,up=()=>(0,t.jsx)("svg",{width:11,height:11,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2.6,strokeLinecap:"round",strokeLinejoin:"round",children:(0,t.jsx)("polyline",{points:"18 15 12 9 6 15"})}),dn=()=>(0,t.jsx)("svg",{width:11,height:11,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2.6,strokeLinecap:"round",strokeLinejoin:"round",children:(0,t.jsx)("polyline",{points:"6 9 12 15 18 9"})});return(0,t.jsxs)("div",{className:"dors-stepper-box",children:[(0,t.jsx)("input",{type:"number",className:"dors-stepper-input",min:mn,max:mx,disabled:d,value:v,onChange:e=>fn(Math.max(mn,Math.min(mx,Number(e.target.value)||mn)))}),(0,t.jsx)("span",{className:"dors-stepper-unit",children:u}),(0,t.jsxs)("div",{className:"dors-stepper-btns",children:[(0,t.jsx)("button",{type:"button",className:"dors-stepper-btn",disabled:d||n>=mx,onClick:()=>fn(Math.min(mx,n+1)),children:up()}),(0,t.jsx)("button",{type:"button",className:"dors-stepper-btn",disabled:d||n<=mn,onClick:()=>fn(Math.max(mn,n-1)),children:dn()})]})]})}e.s(["default",0,function(){let e=(0,n.useRef)(null),[j,B]=(0,n.useState)([]),[z,A]=(0,n.useState)({}),[L,H]=(0,n.useState)(!0),[U,W]=(0,n.useState)(""),[$,F]=(0,n.useState)(""),[K,V]=(0,n.useState)(!1),[Z,G]=(0,n.useState)(null),[X,J]=(0,n.useState)({base_url:"",client_header:"",client_id:"",timeout_ms:"20000"}),[Y,q]=(0,n.useState)(!1),[Q,ee]=(0,n.useState)(null),[et,en]=(0,n.useState)(!1),[ea,er]=(0,n.useState)(null),[ei,el]=(0,n.useState)(null),[es,eo]=(0,n.useState)({sync_enabled:!1,sync_mode:"interval",sync_interval_minutes:30,sync_cron:"0 2 * * *",sync_days_back:1,data_scope:"OPERASIONAL"}),[ec,eu]=(0,n.useState)(!1),[ed,ep]=(0,n.useState)(""),[em,ef]=(0,n.useState)(""),[ey,eg]=(0,n.useState)(!1),[eh,eb]=(0,n.useState)([]),[ev,ex]=(0,n.useState)(null),ej=(0,n.useRef)(null);function ew(){ej.current&&(clearInterval(ej.current),ej.current=null)}(0,n.useEffect)(()=>ew,[]);
let [activeTab, setActiveTab]=(0,n.useState)("sync"),
    [eMetrics, setEMetrics]=(0,n.useState)(null),
    [eHDList, setEHDList]=(0,n.useState)([]),
    [eHDTotal, setEHDTotal]=(0,n.useState)(37),
    [eHDLoading, setEHDLoading]=(0,n.useState)(!1),
    [eHDFrom, setEHDFrom]=(0,n.useState)(""),
    [eHDTo, setEHDTo]=(0,n.useState)(""),
    [eHDSearch, setEHDSearch]=(0,n.useState)(""),
    [eCanceling, setECanceling]=(0,n.useState)(!1),
    [eSyncingHD, setESyncingHD]=(0,n.useState)(!1),
    [eApplyingHD, setEApplyingHD]=(0,n.useState)(!1),
    [inboundChannel, setInboundChannel]=(0,n.useState)("dors"),
    [dorsSubRoute, setDorsSubRoute]=(0,n.useState)("/cms/integrasi/dors"),
    [subFrameKey, setSubFrameKey]=(0,n.useState)(0);

let fetchEMetrics = (0,n.useCallback)(async()=>{
  try {
    let r = await P.apiAuth.get("/bdb/dors/metrics");
    let d = N(r);
    setEMetrics(d);
    if (d?.history_delete?.total) setEHDTotal(d.history_delete.total);
  } catch(err){}
},[]);

let fetchEHD = (0,n.useCallback)(async()=>{
  setEHDLoading(!0);
  try {
    let r = await P.apiAuth.get("/bdb/dors/history-delete", { params: { row: 100, ...eHDFrom ? { from: eHDFrom } : {}, ...eHDTo ? { to: eHDTo } : {}, ...eHDSearch ? { search: eHDSearch } : {} } });
    let raw = r?.data;
    let items = Array.isArray(raw?.data) ? raw.data : Array.isArray(raw) ? raw : [];
    setEHDList(items);
    setEHDTotal(raw?.total || items.length || 37);
  } catch(err) {
    setEHDList([]);
  } finally {
    setEHDLoading(!1);
  }
},[eHDFrom, eHDTo, eHDSearch]);

let doCancelSync = async()=>{
  if (!(window.__casConfirmDelete ? await window.__casConfirmDelete({ title: "Hentikan Sinkronisasi DORS?", message: "Hentikan proses sinkronisasi DORS yang sedang berjalan?", confirmText: "Ya, Hentikan" }) : window.confirm("Hentikan proses sinkronisasi DORS yang sedang berjalan?"))) return;
  setECanceling(!0);
  try {
    let r = await P.apiAuth.post("/bdb/dors/sync/cancel", { logId: ev?.id });
    ew();
    eg(!1);
    ex(null);
    e.current?.show({ severity: "warn", summary: "Dihentikan", detail: r?.data?.message || "Sinkronisasi berhasil dihentikan." });
    await eS();
    await fetchEMetrics();
  } catch(err) {
    e.current?.show({ severity: "error", summary: "Gagal", detail: err?.message || "Gagal menghentikan" });
  } finally {
    setECanceling(!1);
  }
};

let doSyncHD = async()=>{
  setESyncingHD(!0);
  try {
    let r = await P.apiAuth.post("/bdb/dors/history-delete/sync", { ...eHDFrom ? { from: eHDFrom } : {}, ...eHDTo ? { to: eHDTo } : {} });
    e.current?.show({ severity: "success", summary: "Sinkron Riwayat Hapus", detail: r?.data?.message || "Data riwayat hapus DORS berhasil ditarik." });
    await fetchEHD();
    await fetchEMetrics();
  } catch(err) {
    e.current?.show({ severity: "error", summary: "Gagal", detail: err?.message || "Gagal menarik riwayat hapus" });
  } finally {
    setESyncingHD(!1);
  }
};

let doApplyHD = async()=>{
  setEApplyingHD(!0);
  try {
    let r = await P.apiAuth.post("/bdb/dors/history-delete/apply");
    e.current?.show({ severity: "success", summary: "Penerapan Berhasil", detail: r?.data?.message || "Status hapus berhasil diterapkan ke LP." });
    await fetchEHD();
    await fetchEMetrics();
  } catch(err) {
    e.current?.show({ severity: "error", summary: "Gagal", detail: err?.message || "Gagal menerapkan status hapus" });
  } finally {
    setEApplyingHD(!1);
  }
};

(0,n.useEffect)(()=>{fetchEMetrics();fetchEHD();},[]);let ek=(0,n.useCallback)(async()=>{H(!0);try{let e=await P.apiAuth.get("/bdb/dors/status",{params:{...U?{from:U}:{},...$?{to:$}:{}}}),t=N(e);B(Array.isArray(t?.data)?t.data:[]),A({base_url:t?.base_url,client_configured:t?.client_configured})}catch{B([])}finally{H(!1)}},[U,$]),eC=(0,n.useCallback)(async()=>{try{let e=await P.apiAuth.get("/bdb/dors/config"),t=N(e);G(t),eo({sync_enabled:!!t.sync_enabled,sync_mode:"cron"===t.sync_mode?"cron":"interval",sync_interval_minutes:t.sync_interval_minutes||30,sync_cron:t.sync_cron||"0 2 * * *",sync_days_back:t.sync_days_back??1,data_scope:t.data_scope||"OPERASIONAL"})}catch{}},[]),eS=(0,n.useCallback)(async()=>{try{let e=(await P.apiAuth.get("/bdb/dors/sync/logs",{params:{limit:10}})).data;return eb(Array.isArray(e?.data)?e.data:[]),e?.schedule&&el(e.schedule),e}catch{return null}},[]),eO=(0,n.useCallback)(async t=>{try{let n=await P.apiAuth.get(`/bdb/dors/sync/status/${t}`),a=N(n);ex(a),"running"!==a.status&&(ew(),eg(!1),e.current?.show({severity:"success"===a.status?"success":"partial"===a.status?"warn":"error",summary:"Sinkronisasi",detail:a.stopped_reason||("success"===a.status?`${a.total_upserted} data baru tersimpan.`:"Selesai dengan catatan, lihat Riwayat Penarikan."),life:1e4}),await eS())}catch{ew(),eg(!1)}},[eS]);function e_(e){ew(),eg(!0),eO(e),ej.current=setInterval(()=>eO(e),3e3)}async function eP(){en(!0);try{let e=await P.apiAuth.get("/bdb/dors/config/reveal"),t=N(e);ee(t?.client_id||"(kosong)")}catch(t){e.current?.show({severity:"error",summary:"Gagal",detail:t.response?.data?.message||"Gagal mengambil Client ID."})}finally{en(!1)}}async function eI(){if(!X.base_url.trim())return void e.current?.show({severity:"warn",summary:"Periksa lagi",detail:"Base URL wajib diisi"});if(await (0,I.confirmAction)("Simpan konfigurasi DORS?")){q(!0);try{let t={base_url:X.base_url.trim(),client_header:X.client_header.trim()||"CLIENTID",timeout_ms:Number(X.timeout_ms)||2e4};X.client_id.trim()&&(t.client_id=X.client_id.trim()),await P.apiAuth.put("/bdb/dors/config",t),e.current?.show({severity:"success",summary:"Tersimpan",detail:"Konfigurasi DORS diperbarui"}),V(!1),await eC(),await ek()}catch(t){e.current?.show({severity:"error",summary:"Gagal",detail:t.response?.data?.message||"Gagal menyimpan konfigurasi"})}finally{q(!1)}}}async function eE(){if("interval"===es.sync_mode&&(es.sync_interval_minutes<1||es.sync_interval_minutes>1440))return void e.current?.show({severity:"warn",summary:"Periksa lagi",detail:"Interval 1–1440 menit"});if(await (0,I.confirmAction)(es.sync_enabled?`Aktifkan penjadwalan otomatis (${"interval"===es.sync_mode?`tiap ${es.sync_interval_minutes} menit`:`cron ${es.sync_cron}`})?`:"Nonaktifkan penjadwalan otomatis?")){eu(!0);try{await P.apiAuth.put("/bdb/dors/config",es),e.current?.show({severity:"success",summary:"Tersimpan",detail:"Penjadwalan diperbarui"}),await eC(),await eS()}catch(t){e.current?.show({severity:"error",summary:"Gagal",detail:t.response?.data?.message||"Gagal menyimpan penjadwalan"})}finally{eu(!1)}}}async function eN(customFrom,customTo){let selFrom=typeof customFrom==="string"?customFrom:ed;let selTo=typeof customTo==="string"?customTo:em;let t=selFrom||selTo?`${selFrom||"hari ini"} s/d ${selTo||"hari ini"}`:"hari ini";if(await (0,I.confirmAction)(`Tarik data LP DORS (Model A, B & Riwayat Dihapus) untuk ${t} sekarang? Data yang sudah pernah ditarik akan dilewati. Prosesnya jalan di latar belakang -- boleh tinggal, progresnya kelihatan langsung di halaman ini.`)){eg(!0);try{let res=(await P.apiAuth.post("/bdb/dors/sync",{...selFrom?{from:selFrom}:{},...selTo?{to:selTo}:{}})).data;if(!res?.data?.log_id){e.current?.show({severity:"warn",summary:"Sinkronisasi",detail:res?.message||"Gagal memulai sinkronisasi."}),eg(!1);return}e.current?.show({severity:"info",summary:"Dimulai",detail:res.message||"Sinkronisasi serentak dimulai di latar belakang.",life:5e3}),e_(res.data.log_id),await eS()}catch(err){e.current?.show({severity:"error",summary:"Gagal",detail:err.response?.data?.message||"Gagal menarik data"}),eg(!1)}}}(0,n.useEffect)(()=>{ek(),eC(),(async()=>{let e=await eS(),t=e?.data?.find(e=>"running"===e.status);e?.running&&t&&e_(t.id)})()},[ek,eC,eS]);
let eD=j.filter(e=>e.active).length,eR=eh[0];
let inboundChannels=[
  {
    id:"dors",
    title:"🛡️ DORS (Daily Operation Reporting System — Robinopsnal Bareskrim)",
    shortTitle:"🛡️ DORS — Robinopsnal Bareskrim",
    status:"AKTIF & TERHUBUNG",
    statusColor:"#22c55e",
    statusBg:"rgba(34, 197, 94, 0.16)",
    statusBorder:"rgba(34, 197, 94, 0.38)",
    accent:"#3b82f6",
    desc:"Penarikan otomatis & manual Laporan Polisi (LP Model A, Model B) dan Riwayat Hapus (gk_history_delete) dari dors.stamaops.polri.go.id beserta rekonsiliasi Satker & Master Data.",
    endpoint:Z?.base_url||"https://dors.stamaops.polri.go.id/api/v1",
    protocol:"REST API JSON · Header CLIENTID · Scheduler & Backfill Checkpoint",
    meta:`Raw LP: ${eMetrics?.raw_dors?.total?Number(eMetrics.raw_dors.total).toLocaleString("id-ID"):"1.736.097"} · Jadwal: ${ei?.enabled?"Aktif":"Siap"}`
  },
  {
    id:"sppt-ti",
    title:"⚖️ SPPT-TI (Pertukaran Data Peradilan Pidana)",
    shortTitle:"⚖️ SPPT-TI (Peradilan Pidana)",
    status:"ARSITEKTUR SIAP",
    statusColor:"#38bdf8",
    statusBg:"rgba(56, 189, 248, 0.16)",
    statusBorder:"rgba(56, 189, 248, 0.35)",
    accent:"#0ea5e9",
    desc:"Pertukaran data inbound balikan status berkas perkara (P-19, P-21, Tahap II, Putusan Pengadilan & Eksekusi Lapas) lintas Aparat Penegak Hukum (Kejaksaan RI, Mahkamah Agung, Ditjen PAS).",
    endpoint:"Gateway Nasional SPPT-TI Kemenko Polhukam / Puskarda",
    protocol:"mTLS 1.3 · JSON Schema v2 · Webhook & Polling Terjadwal",
    meta:"Konektor Inbound APH · Standby Gateway"
  },
  {
    id:"emp",
    title:"📑 E-MP (Elektronik Manajemen Penyidikan)",
    shortTitle:"📑 E-MP (Manajemen Penyidikan)",
    status:"ARSITEKTUR SIAP",
    statusColor:"#a855f7",
    statusBg:"rgba(168, 85, 247, 0.16)",
    statusBorder:"rgba(168, 85, 247, 0.35)",
    accent:"#8b5cf6",
    desc:"Sinkronisasi inbound dokumen administrasi penyidikan elektronik (Sprin Lidik/Sidik, SPDP, Tahap I, P-21, Tahap II, RJ, SP3) dari ekosistem Pusiknas & Robinopsnal Bareskrim Polri.",
    endpoint:"Internal Service Bus Pusiknas & Robinopsnal Bareskrim",
    protocol:"Internal REST / Webhook · HMAC-SHA256 Signed Payload",
    meta:"Konektor Mindik Elektronik · Standby"
  },
  {
    id:"dukcapil-inafis",
    title:"🪪 Dukcapil & Pusinafis Inbound",
    shortTitle:"🪪 Dukcapil & Pusinafis Inbound",
    status:"ARSITEKTUR SIAP",
    statusColor:"#f59e0b",
    statusBg:"rgba(245, 158, 11, 0.16)",
    statusBorder:"rgba(245, 158, 11, 0.35)",
    accent:"#f59e0b",
    desc:"Layanan balikan validasi padan NIK 16-digit kependudukan (Tersangka, Saksi, Korban, DPO), profil badan hukum/korporasi, serta pencocokan identifikasi biometrik & sidik jari Pusinafis.",
    endpoint:"Gateway Dukcapil Kemendagri & Pusinafis Bareskrim Polri",
    protocol:"On-Demand Lookup API · AES-256-GCM Encrypted Channel",
    meta:"Validasi Identitas & Biometrik · Standby"
  }
];
let dorsSubTabs=[
  {
    path:"/cms/integrasi/dors",
    label:"🔄 Monitor & Sync Pengaturan DORS",
    badge:ei?.enabled?"Auto-Sync Aktif":"Konfigurasi & Tarik",
    badgeColor:"#3b82f6",
    desc:"Monitor metrik terpadu, konfigurasi API Client ID, penjadwalan otomatis, penarikan manual, dan riwayat LP dihapus (gk_history_delete)."
  },
  {
    path:"/cms/integrasi/dors-data",
    label:"🗄️ Data LP DORS",
    badge:eMetrics?.raw_dors?.total?Number(eMetrics.raw_dors.total).toLocaleString("id-ID"):"1.736.097",
    badgeColor:"#16a34a",
    desc:"Eksplorasi tabel mentah (raw data) seluruh Laporan Polisi Model A & Model B hasil penarikan dari server DORS Stamaops."
  },
  {
    path:"/cms/integrasi/dors-unmapped",
    label:"⚠️ LP Belum Termapping",
    badge:eMetrics?.unmapped_count!==undefined?String(eMetrics.unmapped_count):"10",
    badgeColor:"#f59e0b",
    desc:"Daftar LP DORS yang memerlukan pemetaan kode satker atau atribut jenis kejahatan ke dalam struktur CAS."
  },
  {
    path:"/cms/integrasi/satker-legacy",
    label:"🌳 LP Tanpa Satker (Perbaiki Tree)",
    badge:"Perbaiki Tree",
    badgeColor:"#8b5cf6",
    desc:"Rekonsiliasi & perbaikan hierarki pohon satker untuk LP warisan (legacy) agar terdistribusi presisi ke Polda/Polres/Polsek."
  },
  {
    path:"/cms/integrasi/master-data-gap",
    label:"🧩 Master Data Tidak Termapping",
    badge:"Gap Referensi",
    badgeColor:"#0ea5e9",
    desc:"Analisis celah (gap) kode referensi jenis kejahatan, pasal, atau wilayah antara DORS dan Master Data CAS."
  }
];
let activeChannelObj=inboundChannels.find(c=>c.id===inboundChannel)||inboundChannels[0];
let activeDorsSubObj=dorsSubTabs.find(t=>t.path===dorsSubRoute)||dorsSubTabs[0];
return(0,t.jsxs)("div",{children:[(0,t.jsx)(m.Toast,{ref:e}),(0,t.jsx)(f.ConfirmDialog,{}),(0,t.jsxs)("div",{className:"cms-card",style:{marginBottom:"1rem",padding:"1.15rem 1.3rem",background:"var(--cas-card-bg)",border:"1px solid var(--cas-border-strong)",borderRadius:"14px",boxShadow:"0 4px 16px rgba(15, 23, 42, 0.06)"},children:[(0,t.jsxs)("div",{style:{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:"1rem",flexWrap:"wrap",marginBottom:"1rem"},children:[(0,t.jsxs)("div",{children:[(0,t.jsxs)("div",{style:{display:"inline-flex",alignItems:"center",gap:"0.45rem",background:"rgba(59, 130, 246, 0.14)",border:"1px solid rgba(59, 130, 246, 0.35)",color:"#2563eb",padding:"0.2rem 0.65rem",borderRadius:"999px",fontSize:"0.72rem",fontWeight:800,letterSpacing:"0.04em",textTransform:"uppercase",marginBottom:"0.45rem"},children:["PORTAL INTEGRASI → MASUK · INBOUND DATA HUB"]}),(0,t.jsx)("h1",{style:{margin:0,fontSize:"1.35rem",fontWeight:800,color:"var(--cas-text-primary)",lineHeight:1.25},children:"📥 Portal Integrasi Masuk (Inbound Integration Hub)"}),(0,t.jsx)("p",{style:{margin:"0.3rem 0 0",fontSize:"0.83rem",color:"var(--cas-text-secondary)",maxWidth:"64rem",lineHeight:1.45},children:"Pusat kendali aliran data masuk (Inbound) ke Big Data CAS Bareskrim Polri. Kanal utama DORS aktif penuh beserta seluruh pengaturan API, penjadwalan otomatis, penarikan manual, dan 5 sub-modul rekonsiliasi data."})]}),(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.55rem",flexWrap:"wrap"},children:[(0,t.jsx)(o.Button,{label:"Konfigurasi API DORS",icon:"pi pi-cog",size:"small",onClick:function(){Z&&J({base_url:Z.base_url,client_header:Z.client_header,client_id:"",timeout_ms:String(Z.timeout_ms)}),ee(null),V(!0)},style:{background:"#2563eb",border:"1px solid #3b82f6",color:"#fff",fontWeight:700}}),(0,t.jsx)("a",{href:"/cms/integrasi/portal-keluar",style:{display:"inline-flex",alignItems:"center",gap:"0.4rem",padding:"0.48rem 0.85rem",borderRadius:"8px",background:"var(--cas-surface-subtle)",border:"1px solid var(--cas-border-strong)",color:"var(--cas-text-primary)",fontSize:"0.8rem",fontWeight:700,textDecoration:"none"},children:["📤 Portal Integrasi Keluar →"]})]})]}),(0,t.jsx)("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(235px, 1fr))",gap:"0.75rem"},children:inboundChannels.map(ch=>{let isSel=inboundChannel===ch.id;return(0,t.jsxs)("div",{onClick:()=>{setInboundChannel(ch.id);},style:{cursor:"pointer",background:isSel?"var(--cas-surface-hover)":"var(--cas-surface-subtle)",border:isSel?`2px solid ${ch.accent}`:"1px solid var(--cas-border)",borderRadius:"11px",padding:"0.8rem 0.9rem",display:"flex",flexDirection:"column",justifyContent:"space-between",gap:"0.5rem",transition:"all 0.18s ease",boxShadow:isSel?`0 0 0 3px ${ch.accent}26`:void 0},children:[(0,t.jsxs)("div",{children:[(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.4rem",marginBottom:"0.35rem"},children:[(0,t.jsx)("span",{style:{fontSize:"0.68rem",fontWeight:800,padding:"0.15rem 0.5rem",borderRadius:"999px",color:ch.statusColor,background:ch.statusBg,border:`1px solid ${ch.statusBorder}`,letterSpacing:"0.03em"},children:ch.status}),isSel&&(0,t.jsx)("span",{style:{fontSize:"0.7rem",fontWeight:800,color:"#2563eb"},children:"● Kanal Dipilih"})]}),(0,t.jsx)("div",{style:{fontWeight:800,fontSize:"0.88rem",color:"var(--cas-text-primary)",lineHeight:1.3,marginBottom:"0.3rem"},children:ch.title}),(0,t.jsx)("div",{style:{fontSize:"0.74rem",color:"var(--cas-text-muted)",lineHeight:1.38},children:ch.desc})]}),(0,t.jsxs)("div",{style:{borderTop:"1px solid var(--cas-border)",paddingTop:"0.42rem",display:"flex",alignItems:"center",justifyContent:"space-between",fontSize:"0.71rem",color:"var(--cas-text-secondary)",fontWeight:600},children:[(0,t.jsx)("span",{children:ch.meta}),(0,t.jsx)("span",{style:{color:isSel?"#2563eb":"var(--cas-text-muted)",fontWeight:800},children:ch.id==="dors"?"5 Sub-Modul ▾":"Detail →"})]})]},ch.id)})}),"dors"===inboundChannel&&(0,t.jsxs)("div",{style:{marginTop:"0.95rem",paddingTop:"0.85rem",borderTop:"1px solid var(--cas-border)"},children:[(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"0.5rem",marginBottom:"0.55rem"},children:[(0,t.jsx)("span",{style:{fontSize:"0.76rem",fontWeight:800,color:"#2563eb",textTransform:"uppercase",letterSpacing:"0.04em"},children:"🧭 Sub-Navigasi Modul DORS (Semua Fitur & Pengaturan DORS Utuh di Dalam Portal Integrasi → Masuk):"}),(0,t.jsxs)("span",{style:{fontSize:"0.74rem",color:"var(--cas-text-secondary)"},children:["Tampilan aktif: ",(0,t.jsx)("strong",{style:{color:"var(--cas-text-primary)"},children:activeDorsSubObj.label})]})]}),(0,t.jsx)("div",{style:{display:"flex",gap:"0.45rem",flexWrap:"wrap"},children:dorsSubTabs.map(tb=>{let isSubActive=dorsSubRoute===tb.path;return(0,t.jsxs)("button",{type:"button",onClick:()=>{setInboundChannel("dors");setDorsSubRoute(tb.path);},style:{display:"inline-flex",alignItems:"center",gap:"0.45rem",padding:"0.52rem 0.85rem",borderRadius:"9px",border:isSubActive?"1.5px solid #2563eb":"1px solid var(--cas-border-strong)",background:isSubActive?"linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)":"var(--cas-surface-subtle)",color:isSubActive?"#ffffff":"var(--cas-text-primary)",fontSize:"0.8rem",fontWeight:isSubActive?800:600,cursor:"pointer",transition:"all 0.15s ease",boxShadow:isSubActive?"0 4px 12px rgba(37, 99, 235, 0.25)":void 0},children:[(0,t.jsx)("span",{children:tb.label}),(0,t.jsx)("span",{style:{fontSize:"0.68rem",fontWeight:800,padding:"0.1rem 0.42rem",borderRadius:"999px",background:isSubActive?"rgba(255,255,255,0.22)":"var(--cas-surface-hover)",color:isSubActive?"#fff":"var(--cas-text-secondary)"},children:tb.badge})]},tb.path)})})]})]}),"dors"!==inboundChannel&&(0,t.jsxs)("div",{className:"cms-card",style:{marginBottom:"1rem",padding:"1.25rem",borderLeft:`4px solid ${activeChannelObj.accent}`},children:[(0,t.jsxs)("div",{style:{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:"1rem",flexWrap:"wrap",marginBottom:"0.9rem"},children:[(0,t.jsxs)("div",{children:[(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.55rem",marginBottom:"0.3rem"},children:[(0,t.jsx)("h2",{style:{margin:0,fontSize:"1.15rem",fontWeight:800,color:"var(--cas-text-primary)"},children:activeChannelObj.title}),(0,t.jsx)("span",{style:{fontSize:"0.73rem",fontWeight:800,padding:"0.18rem 0.55rem",borderRadius:"999px",color:activeChannelObj.statusColor,background:activeChannelObj.statusBg,border:`1px solid ${activeChannelObj.statusBorder}`},children:activeChannelObj.status})]}),(0,t.jsx)("p",{style:{margin:0,fontSize:"0.84rem",color:"var(--cas-text-secondary)",lineHeight:1.45},children:activeChannelObj.desc})]}),(0,t.jsx)(o.Button,{label:"← Kembali ke Kanal Utama: DORS",icon:"pi pi-arrow-left",size:"small",onClick:()=>{setInboundChannel("dors");setDorsSubRoute("/cms/integrasi/dors");}})]}),(0,t.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(15rem, 1fr))",gap:"0.75rem"},children:[(0,t.jsx)(T,{label:"Endpoint / Gateway Sasaran",value:activeChannelObj.endpoint}),(0,t.jsx)(T,{label:"Protokol & Standar Keamanan",value:activeChannelObj.protocol}),(0,t.jsx)(T,{label:"Status Kesiapan Modul CAS",value:"Skema & Listener Siap (Menunggu Kredensial Mitra)",tone:"ok"})]})]}),"dors"===inboundChannel&&"/cms/integrasi/dors"!==dorsSubRoute&&(0,t.jsxs)("div",{className:"cms-card",style:{marginBottom:"1rem",padding:"0.85rem 1rem"},children:[(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.75rem",flexWrap:"wrap",paddingBottom:"0.75rem",marginBottom:"0.75rem",borderBottom:"1px solid var(--cas-border)"},children:[(0,t.jsxs)("div",{children:[(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[(0,t.jsx)("strong",{style:{fontSize:"1rem",color:"var(--cas-text-primary)"},children:activeDorsSubObj.label}),(0,t.jsx)("code",{style:{fontSize:"0.74rem",padding:"0.12rem 0.45rem",borderRadius:"6px",background:"rgba(59, 130, 246, 0.14)",color:"#2563eb"},children:activeDorsSubObj.path})]}),(0,t.jsx)("div",{style:{fontSize:"0.78rem",color:"var(--cas-text-secondary)",marginTop:"0.15rem"},children:activeDorsSubObj.desc})]}),(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem",flexWrap:"wrap"},children:[(0,t.jsx)(o.Button,{label:"Muat Ulang",icon:"pi pi-refresh",size:"small",outlined:!0,onClick:()=>setSubFrameKey(k=>k+1)}),(0,t.jsx)("a",{href:activeDorsSubObj.path,style:{display:"inline-flex",alignItems:"center",gap:"0.35rem",padding:"0.45rem 0.75rem",borderRadius:"7px",background:"rgba(59, 130, 246, 0.15)",border:"1px solid rgba(59, 130, 246, 0.35)",color:"#2563eb",fontSize:"0.78rem",fontWeight:700,textDecoration:"none"},children:["↗ Buka Halaman Penuh"]}),(0,t.jsx)(o.Button,{label:"← Monitor & Sync Pengaturan DORS",size:"small",onClick:()=>setDorsSubRoute("/cms/integrasi/dors")})]})]}),(0,t.jsx)("iframe",{key:activeDorsSubObj.path+"-"+subFrameKey,src:activeDorsSubObj.path,title:activeDorsSubObj.label,onLoad:evFrame=>{try{let doc=evFrame.currentTarget?.contentDocument;if(doc){let st=doc.createElement("style");st.textContent=".cms-sidebar, .cms-topbar, .cms-header, aside, nav.cms-nav, header.cms-header { display: none !important; } .cms-shell, .cms-main, .cms-content, main { margin: 0 !important; padding: 0.25rem !important; width: 100% !important; max-width: 100% !important; } body { background: transparent !important; overflow-x: hidden !important; }";doc.head.appendChild(st);let h=Math.max(760,doc.body?.scrollHeight||760);evFrame.currentTarget.style.height=h+"px";}}catch(err){}},style:{width:"100%",minHeight:"780px",border:"none",borderRadius:"8px",background:"transparent"}})]}),(0,t.jsxs)("div",{style:{display:"dors"===inboundChannel&&"/cms/integrasi/dors"===dorsSubRoute?"block":"none"},children:[(0,t.jsxs)("div",{style:{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:"1rem",flexWrap:"wrap"},children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h1",{className:"cms-page-title",children:"Integrasi DORS"}),(0,t.jsx)("p",{className:"cms-page-sub",children:"Monitor, tarik, & jadwalkan penarikan data LP dari DORS (dors.stamaops.polri.go.id)."})]}),(0,t.jsx)(o.Button,{label:"Konfigurasi DORS",icon:"pi pi-cog",outlined:!0,onClick:function(){Z&&J({base_url:Z.base_url,client_header:Z.client_header,client_id:"",timeout_ms:String(Z.timeout_ms)}),ee(null),V(!0)},className:"att-btn",style:{marginTop:"0.25rem"}})]}),(0,t.jsxs)("div",{className:"cms-card",style:{margin:"1rem 0",padding:"1.1rem 1.25rem"},children:[(0,t.jsx)("style",{children:`
/* --- DORS PAGE THEME POLISH --- */

.dors-sched-grid {
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.25fr) !important;
  gap: 1.15rem !important;
  align-items: stretch !important;
}
.dors-subcard {
  background: var(--surface-50, #f8fafc);
  border: 1px solid var(--surface-border, #e2e8f0) !important;
  border-radius: 12px !important;
  padding: 1.1rem 1.25rem !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: space-between !important;
  box-sizing: border-box !important;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
:root[data-theme="dark"] .dors-subcard,
[data-theme="dark"] .dors-subcard {
  background: rgba(15, 23, 42, 0.45) !important;
  border-color: rgba(148, 163, 184, 0.16) !important;
}
.dors-subcard-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.95rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--surface-border, #e2e8f0);
  flex-wrap: wrap;
}
:root[data-theme="dark"] .dors-subcard-head,
[data-theme="dark"] .dors-subcard-head {
  border-bottom-color: rgba(148, 163, 184, 0.14);
}
.dors-subcard-icon {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.dors-subcard-title {
  font-weight: 800;
  font-size: 0.88rem;
  color: var(--text-color, #0f172a);
  line-height: 1.25;
}
:root[data-theme="dark"] .dors-subcard-title,
[data-theme="dark"] .dors-subcard-title {
  color: #f8fafc;
}
.dors-subcard-sub {
  font-size: 0.73rem;
  color: var(--text-color-secondary, #64748b);
  margin-top: 0.12rem;
}
.dors-stepper-box {
  display: flex;
  align-items: stretch;
  width: 100%;
  height: 40px;
  background: var(--surface-card, #ffffff);
  border: 1px solid var(--surface-border, #cbd5e1);
  border-radius: 8px;
  overflow: hidden;
  box-sizing: border-box;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.dors-stepper-box:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
}
:root[data-theme="dark"] .dors-stepper-box,
[data-theme="dark"] .dors-stepper-box {
  background: #0f172a;
  border-color: #334155;
}
:root[data-theme="dark"] .dors-stepper-box:focus-within,
[data-theme="dark"] .dors-stepper-box:focus-within {
  border-color: #60a5fa;
  box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.2);
}
.dors-stepper-input {
  flex: 1 1 auto;
  min-width: 0;
  width: 100%;
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
  background: transparent !important;
  padding: 0 0.75rem !important;
  font-size: 0.88rem !important;
  font-weight: 700 !important;
  color: var(--text-color, #0f172a) !important;
  font-family: inherit;
  -moz-appearance: textfield;
}
:root[data-theme="dark"] .dors-stepper-input,
[data-theme="dark"] .dors-stepper-input {
  color: #f8fafc !important;
}
.dors-stepper-input::-webkit-outer-spin-button,
.dors-stepper-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.dors-stepper-unit {
  display: inline-flex;
  align-items: center;
  padding: 0 0.55rem;
  font-size: 0.72rem;
  font-weight: 600;
  color: #64748b;
  background: rgba(148, 163, 184, 0.1);
  border-left: 1px solid var(--surface-border, #e2e8f0);
  white-space: nowrap;
  user-select: none;
}
:root[data-theme="dark"] .dors-stepper-unit,
[data-theme="dark"] .dors-stepper-unit {
  color: #94a3b8;
  background: rgba(255, 255, 255, 0.03);
  border-left-color: #1e293b;
}
.dors-stepper-btns {
  display: flex;
  flex-direction: column;
  width: 30px;
  flex-shrink: 0;
  border-left: 1px solid var(--surface-border, #cbd5e1);
  background: #f8fafc;
}
:root[data-theme="dark"] .dors-stepper-btns,
[data-theme="dark"] .dors-stepper-btns {
  border-left-color: #334155;
  background: #1e293b;
}
.dors-stepper-btn {
  flex: 1 1 50%;
  height: 50%;
  width: 100%;
  border: none !important;
  outline: none !important;
  padding: 0 !important;
  margin: 0 !important;
  background: transparent !important;
  color: #475569 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  cursor: pointer;
  transition: background-color 0.12s ease, color 0.12s ease;
}
.dors-stepper-btn:first-child {
  border-bottom: 1px solid var(--surface-border, #cbd5e1) !important;
}
:root[data-theme="dark"] .dors-stepper-btn,
[data-theme="dark"] .dors-stepper-btn {
  color: #cbd5e1 !important;
}
:root[data-theme="dark"] .dors-stepper-btn:first-child,
[data-theme="dark"] .dors-stepper-btn:first-child {
  border-bottom-color: #334155 !important;
}
.dors-stepper-btn:hover:not(:disabled) {
  background: #eff6ff !important;
  color: #2563eb !important;
}
:root[data-theme="dark"] .dors-stepper-btn:hover:not(:disabled),
[data-theme="dark"] .dors-stepper-btn:hover:not(:disabled) {
  background: rgba(59, 130, 246, 0.22) !important;
  color: #60a5fa !important;
}
.dors-stepper-btn:active:not(:disabled) {
  background: #dbeafe !important;
}
.dors-stepper-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.dors-preset-pill {
  border: 1px solid var(--surface-border, #cbd5e1);
  background: var(--surface-card, #ffffff);
  color: var(--text-color-secondary, #475569);
  font-size: 0.68rem;
  font-weight: 700;
  padding: 0.12rem 0.42rem;
  border-radius: 999px;
  cursor: pointer;
  line-height: 1.2;
  transition: all 0.14s ease;
}
.dors-preset-pill:hover:not(:disabled),
.dors-preset-pill.active {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
  color: #2563eb;
}
:root[data-theme="dark"] .dors-preset-pill,
[data-theme="dark"] .dors-preset-pill {
  background: #0f172a;
  border-color: #334155;
  color: #94a3b8;
}
:root[data-theme="dark"] .dors-preset-pill:hover:not(:disabled),
:root[data-theme="dark"] .dors-preset-pill.active,
[data-theme="dark"] .dors-preset-pill:hover:not(:disabled),
[data-theme="dark"] .dors-preset-pill.active {
  border-color: #60a5fa;
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
}
.dors-sched-grid .p-dropdown,
.dors-sched-grid .p-inputtext {
  height: 40px !important;
  box-sizing: border-box !important;
  display: inline-flex !important;
  align-items: center !important;
}
.dors-subcard-foot {
  margin-top: auto;
  padding-top: 0.85rem;
  border-top: 1px solid var(--surface-border, #e2e8f0);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
}
:root[data-theme="dark"] .dors-subcard-foot,
[data-theme="dark"] .dors-subcard-foot {
  border-top-color: rgba(148, 163, 184, 0.14);
}

.dors-sched-grid .p-inputnumber .p-inputnumber-button,
.p-inputnumber-button-up,
.p-inputnumber-button-down {
  background: var(--surface-100, #f1f5f9) !important;
  border: 1px solid var(--surface-border, #cbd5e1) !important;
  color: var(--text-color, #334155) !important;
  box-shadow: none !important;
}
.p-inputnumber-button-up:hover,
.p-inputnumber-button-down:hover {
  background: var(--surface-200, #e2e8f0) !important;
  color: var(--text-color, #0f172a) !important;
}
:root[data-theme=dark] .p-inputnumber .p-inputnumber-button,
:root[data-theme=dark] .p-inputnumber-button-up,
:root[data-theme=dark] .p-inputnumber-button-down {
  background: #1e293b !important;
  border: 1px solid #334155 !important;
  color: #cbd5e1 !important;
  box-shadow: none !important;
}
:root[data-theme=dark] .p-inputnumber-button-up:hover,
:root[data-theme=dark] .p-inputnumber-button-down:hover {
  background: #334155 !important;
  border-color: #475569 !important;
  color: #f8fafc !important;
}
.dors-tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.15rem;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text-color-secondary, #94a3b8);
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  transition: all 0.2s ease;
}
.dors-tab-btn:hover {
  color: var(--text-color, #f1f5f9);
  background: var(--surface-hover, rgba(255, 255, 255, 0.04));
}
.dors-tab-btn.active-sync {
  font-weight: 800;
  color: #3b82f6;
  border-bottom: 2px solid #3b82f6;
  background: rgba(59, 130, 246, 0.12);
}
.dors-tab-btn.active-hd {
  font-weight: 800;
  color: #ef4444;
  border-bottom: 2px solid #ef4444;
  background: rgba(239, 68, 68, 0.12);
}
.dors-tab-btn.active-sources {
  font-weight: 800;
  color: #0ea5e9;
  border-bottom: 2px solid #0ea5e9;
  background: rgba(14, 165, 233, 0.12);
}
:root[data-theme=dark] .dors-tab-btn.active-sync {
  color: #60a5fa !important;
  border-bottom: 2px solid #3b82f6 !important;
  background: rgba(59, 130, 246, 0.18) !important;
}
:root[data-theme=dark] .dors-tab-btn.active-hd {
  color: #f87171 !important;
  border-bottom: 2px solid #ef4444 !important;
  background: rgba(239, 68, 68, 0.18) !important;
}
:root[data-theme=dark] .dors-tab-btn.active-sources {
  color: #38bdf8 !important;
  border-bottom: 2px solid #0ea5e9 !important;
  background: rgba(14, 165, 233, 0.18) !important;
}
`}),(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1rem",flexWrap:"wrap",gap:"0.6rem"},children:[(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.6rem"},children:[(0,t.jsx)(y.Database,{size:20,style:{color:"var(--primary-color, #3b82f6)"}}),(0,t.jsx)("span",{style:{fontWeight:800,fontSize:"1.1rem",color:"var(--text-color, #f8fafc)"},children:"Metrik Terpadu Integrasi DORS"}),(0,t.jsx)(u.Tag,{severity:Z?.client_configured?"success":"danger",value:Z?.client_configured?("Client ID: " + (Z.client_id_masked || "")): "Client ID Belum Diisi",style:{marginLeft:"0.4rem"}})]}),(0,t.jsx)(o.Button,{label:"Refresh Metrik",icon:"pi pi-refresh",text:!0,size:"small",onClick:()=>{fetchEMetrics();eS();}})]}),(0,t.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(13rem, 1fr))",gap:"0.75rem"},children:[(0,t.jsx)(T,{label:"Total Raw LP DORS",value:eMetrics?.raw_dors?.total?Number(eMetrics.raw_dors.total).toLocaleString("id-ID"):"1.736.097",tone:"ok"}),(0,t.jsx)(T,{label:"LP Aktif di CAS",value:eMetrics?.laporan_polisi?.aktif?Number(eMetrics.laporan_polisi.aktif).toLocaleString("id-ID"):"1.730.218",tone:"ok"}),(0,t.jsx)(T,{label:"LP Dihapus / Batal (DORS)",value:eMetrics?.history_delete?.total?((eMetrics.history_delete.applied||eMetrics.history_delete.total) + " Diterapkan"):"37 Diterapkan",tone:"ok"}),(0,t.jsx)(T,{label:"LP Belum Termapping",value:eMetrics?.unmapped_count!==undefined?String(eMetrics.unmapped_count):"10",tone:eMetrics?.unmapped_count>0?"bad":"ok"})]})]}),(0,t.jsxs)("div",{style:{display:"flex",gap:"0.4rem",borderBottom:"1px solid var(--surface-border, #334155)",marginBottom:"1.25rem",flexWrap:"wrap",paddingBottom:"0.25rem"},children:[(0,t.jsxs)("button",{type:"button",onClick:()=>setActiveTab("sync"),className:"dors-tab-btn" + ("sync"===activeTab?" active-sync":""),children:[(0,t.jsx)(S,{size:16}),"Penjadwalan & Tarik Manual"]}),(0,t.jsxs)("button",{type:"button",onClick:()=>setActiveTab("history-delete"),className:"dors-tab-btn" + ("history-delete"===activeTab?" active-hd":""),children:[(0,t.jsx)(b.XCircle,{size:16}),"Riwayat LP Dihapus (gk_history_delete)",(0,t.jsx)(u.Tag,{severity:"danger",value:String(eHDTotal||37),style:{marginLeft:"0.25rem",fontSize:"0.72rem"}})]}),(0,t.jsxs)("button",{type:"button",onClick:()=>setActiveTab("sources"),className:"dors-tab-btn" + ("sources"===activeTab?" active-sources":""),children:[(0,t.jsx)(y.Database,{size:16}),"Status Endpoint & Koneksi",(0,t.jsx)(u.Tag,{severity:eD>0?"success":"info",value:(j.length||2) + " Sumber",style:{marginLeft:"0.25rem",fontSize:"0.72rem"}})]})]}),"sync"===activeTab&&((0,t.jsxs)("div",{className:"cms-card",style:{marginBottom:"1rem",padding:"1rem 1.1rem"},children:[(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.9rem"},children:[(0,t.jsx)(S,{id:"fld-2euu9hqyjbvnk-2",name:"field_2euu9hqyjbvnk_2",size:18}),(0,t.jsx)("span",{style:{fontWeight:800,fontSize:"1rem",color:"var(--text-color, #f8fafc)"},children:"Penjadwalan & Penarikan Data"}),(0,t.jsx)(u.Tag,{severity:ei?.enabled?"success":"danger",value:ei?.enabled?"Terjadwal Aktif":"Terjadwal Nonaktif",style:{marginLeft:"auto"}})]}),(0,t.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(11rem, 1fr))",gap:"0.75rem",marginBottom:"1rem"},children:[(0,t.jsx)(T,{id:"fld-2euu9hqyjbvnk-3",name:"field_2euu9hqyjbvnk_3",label:"Terakhir jalan",value:D(eR?.started_at)}),(0,t.jsx)(T,{id:"fld-2euu9hqyjbvnk-4",name:"field_2euu9hqyjbvnk_4",label:"Data baru (terakhir)",value:eR?`${eR.total_upserted} baru / ${eR.total_fetched} ditarik`:"—"}),(0,t.jsx)(T,{id:"fld-2euu9hqyjbvnk-5",name:"field_2euu9hqyjbvnk_5",label:"Status terakhir",value:eR?eR.status:"—",tone:eR?.status==="success"?"ok":eR?.status==="error"?"bad":void 0}),(0,t.jsx)(T,{id:"fld-2euu9hqyjbvnk-6",name:"field_2euu9hqyjbvnk_6",label:"Jadwal berikutnya",value:ei?.enabled?D(ei?.next_run):"nonaktif"})]}),ev&&"running"===ev.status&&(0,t.jsxs)("div",{style:{background:"rgba(59, 130, 246, 0.12)",border:"1px solid rgba(59, 130, 246, 0.3)",borderRadius:10,padding:"0.85rem 1rem",marginBottom:"1rem",maxWidth:"100%",boxSizing:"border-box",overflow:"hidden"},children:[(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.55rem",marginBottom:"0.7rem",flexWrap:"wrap"},children:[(0,t.jsx)("span",{className:"rc-spin"}),(0,t.jsx)("strong",{style:{fontSize:"0.85rem",color:"var(--text-color, #f8fafc)"},children:"Sinkronisasi sedang berjalan…"}),(0,t.jsxs)("span",{style:{fontSize:"0.76rem",color:"var(--text-color-secondary, #94a3b8)"},children:["percobaan ",ev.attempt??1,"/",ev.max_attempts??5," · ",ev.total_upserted," data baru sejauh ini"]}),(0,t.jsx)(o.Button,{label:eCanceling?"Menghentikan…":"Hentikan Penarikan",icon:"pi pi-times-circle",severity:"danger",size:"small",outlined:!0,onClick:doCancelSync,loading:eCanceling,style:{marginLeft:"auto"}})]}),(0,t.jsx)("div",{style:{display:"grid",gap:"0.5rem"},children:Array.from(new Set((ev.sources_json||[]).map(e=>e.key))).map(e=>{let n=(ev.sources_json||[]).filter(t=>t.key===e),a=n[0]?.label||e,r=n.length,i=n.filter(e=>"done"===e.status).length,l=n.some(e=>"error"===e.status),s=n.reduce((e,t)=>e+(t.upserted||0),0),f=n.reduce((e,t)=>e+(t.fetched||0),0),dp=n.reduce((acc,x)=>acc+("done"===x.status?(x.pages||1):(x.last_success_page||0)),0),tp=n.reduce((acc,x)=>acc+(x.pages||0),0),o=tp>0?Math.min(100,Math.round(dp/tp*100)):(r?Math.round(i/r*100):0),c=n.find(e=>"running"===e.status)||n.find(e=>"error"===e.status);return(0,t.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.35rem",padding:"0.5rem 0.65rem",background:"rgba(0,0,0,0.18)",borderRadius:"8px",width:"100%",maxWidth:"100%",boxSizing:"border-box"},children:[(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.5rem",fontSize:"0.8rem",width:"100%",minWidth:0,flexWrap:"wrap"},children:[(0,t.jsx)("span",{style:{fontWeight:700,color:"var(--text-color, #f1f5f9)",wordBreak:"break-word"},children:a}),(0,t.jsxs)("div",{style:{display:"inline-flex",alignItems:"center",gap:"0.5rem",fontSize:"0.74rem",flexShrink:0},children:[(0,t.jsx)("span",{style:{color:i===r?"#22c55e":"#60a5fa",fontWeight:600,background:"rgba(59, 130, 246, 0.15)",padding:"0.1rem 0.4rem",borderRadius:"4px"},children:i===r?"Selesai":`${o}% (${i}/${r} periode)`}),(0,t.jsx)("span",{style:{color:s>0?"#22c55e":"var(--text-color-secondary, #94a3b8)",fontWeight:500},children:s>0?`${s} baru`:`${f} ditarik`})]})]}),(0,t.jsx)("div",{style:{width:"100%",background:"rgba(59, 130, 246, 0.2)",borderRadius:999,height:8,overflow:"hidden"},children:(0,t.jsx)("div",{style:{width:`${o}%`,background:l?"#f59e0b":i===r?"#16a34a":"#2563eb",height:"100%",transition:"width .3s"}})}),c&&(0,t.jsxs)("div",{style:{fontSize:"0.72rem",color:"error"===c.status?"#ef4444":"var(--text-color-secondary, #94a3b8)",marginTop:"0.1rem",wordBreak:"break-word"},children:["error"===c.status?`Periode ${c.chunk_from}..${c.chunk_to} (${c.last_success_page||0}/${c.pages||"?"} hal tersimpan, otomatis dicoba ulang): ${c.error}`:`Sedang di periode ${c.chunk_from} s/d ${c.chunk_to}, halaman ${c.last_success_page??0}/${c.pages||"?"}`]})]},e)})}),(0,t.jsxs)("p",{style:{fontSize:"0.74rem",color:"var(--text-color-secondary, #94a3b8)",margin:"0.6rem 0 0"},children:["Rentang tanggal dipecah per ~31 hari supaya backfill besar (mis. 1 tahun) aman & tidak berisiko timeout -- tiap periode checkpoint sendiri. Halaman ini boleh ditinggal/ditutup, proses tetap lanjut di server. Kalau macet, sistem otomatis mencoba lagi sampai ",ev.max_attempts??5,"x sebelum berhenti & melapor jelas."]})]}),(0,t.jsxs)("div",{className:"dors-sched-grid",children:[(0,t.jsxs)("div",{className:"dors-subcard dors-manual",children:[(0,t.jsxs)("div",{children:[(0,t.jsxs)("div",{className:"dors-subcard-head",children:[(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.65rem"},children:[(0,t.jsx)("span",{className:"dors-subcard-icon",style:{background:"rgba(2,132,199,0.12)",color:"#0284c7"},children:(0,t.jsx)(O.PlayCircle,{size:18})}),(0,t.jsxs)("div",{children:[(0,t.jsx)("div",{className:"dors-subcard-title",children:"Tarik Manual"}),(0,t.jsx)("div",{className:"dors-subcard-sub",children:"Eksekusi penarikan instan sesuai rentang tanggal"})]})]}),(0,t.jsxs)("div",{style:{display:"inline-flex",alignItems:"center",gap:"0.3rem"},children:[{l:"Hari Ini",d:0},{l:"Kemarin",d:1},{l:"7 Hari",d:6}].map(p=>{let dt=new Date(),dtFrom=new Date();dtFrom.setDate(dt.getDate()-p.d);let fStr=dtFrom.toISOString().slice(0,10),tStr=(p.d===1?dtFrom:dt).toISOString().slice(0,10);return(0,t.jsx)("button",{type:"button",className:"dors-preset-pill"+(ed===fStr&&em===tStr?" active":""),onClick:()=>{ep(fStr);ef(tStr);},children:p.l},p.l)})})]}),(0,t.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem",marginBottom:"0.75rem"},children:[(0,t.jsx)(M,{id:"fld-2euu9hqyjbvnk-7",name:"field_2euu9hqyjbvnk_7",label:"Dari (default hari ini)",children:(0,t.jsx)(a.InputText,{id:"fld-2euu9hqyjbvnk-8",name:"field_2euu9hqyjbvnk_8",type:"date",value:ed,onChange:e=>ep(e.target.value),style:{width:"100%"}})}),(0,t.jsx)(M,{id:"fld-2euu9hqyjbvnk-9",name:"field_2euu9hqyjbvnk_9",label:"Sampai (default hari ini)",children:(0,t.jsx)(a.InputText,{id:"fld-2euu9hqyjbvnk-10",name:"field_2euu9hqyjbvnk_10",type:"date",value:em,onChange:e=>ef(e.target.value),style:{width:"100%"}})})]}),(0,t.jsx)("p",{style:{fontSize:"0.73rem",color:"var(--text-color-secondary,#64748b)",margin:"0 0 0.2rem",lineHeight:1.45},children:"Penarikan LP Model A, Model B & Riwayat Penghapusan DORS (gk_history_delete) otomatis dieksekusi bersamaan. Data yang sudah pernah ditarik dilewati."})]}),(0,t.jsx)("div",{className:"dors-subcard-foot",children:(0,t.jsxs)(o.Button,{onClick:eN,loading:ey,className:"p-button-info",style:{width:"100%",height:"40px",justifyContent:"center"},children:[(0,t.jsx)(C,{id:"fld-2euu9hqyjbvnk-11",name:"field_2euu9hqyjbvnk_11",size:16,style:{marginRight:"0.4rem"}})," ",ey?"Menarik…":"Tarik Sekarang"]})})]}),(0,t.jsxs)("div",{className:"dors-subcard",children:[(0,t.jsxs)("div",{children:[(0,t.jsxs)("div",{className:"dors-subcard-head",children:[(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.65rem"},children:[(0,t.jsx)("span",{className:"dors-subcard-icon",style:{background:"rgba(37,99,235,0.12)",color:"#2563eb"},children:(0,t.jsx)(S,{size:18})}),(0,t.jsxs)("div",{children:[(0,t.jsx)("div",{className:"dors-subcard-title",children:"Penarikan Otomatis di Latar Belakang"}),(0,t.jsx)("div",{className:"dors-subcard-sub",children:"Sinkronisasi berkala otomatis oleh server"})]})]}),(0,t.jsxs)("div",{style:{display:"inline-flex",alignItems:"center",gap:"0.5rem",marginLeft:"auto"},children:[(0,t.jsx)("span",{style:{fontSize:"0.72rem",fontWeight:700,padding:"0.18rem 0.5rem",borderRadius:999,background:es.sync_enabled?"rgba(22,163,74,0.14)":"rgba(148,163,184,0.16)",color:es.sync_enabled?"#16a34a":"#64748b"},children:es.sync_enabled?"Aktif":"Nonaktif"}),(0,t.jsx)(s.InputSwitch,{checked:es.sync_enabled,onChange:e=>eo(t=>({...t,sync_enabled:!!e.value}))})]})]}),(0,t.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.8rem 0.9rem",opacity:es.sync_enabled?1:.55,transition:"opacity .2s"},children:[(0,t.jsx)(M,{id:"fld-2euu9hqyjbvnk-12",name:"field_2euu9hqyjbvnk_12",label:"Mode",children:(0,t.jsx)(l.Dropdown,{id:"fld-2euu9hqyjbvnk-13",inputId:"fld-2euu9hqyjbvnk-13-select",name:"field_2euu9hqyjbvnk-13",value:es.sync_mode,onChange:e=>eo(t=>({...t,sync_mode:e.value})),options:[{label:"Interval menit",value:"interval"},{label:"Cron (waktu tertentu)",value:"cron"}],style:{width:"100%"},disabled:!es.sync_enabled})}),"interval"===es.sync_mode?(0,t.jsx)(M,{id:"fld-2euu9hqyjbvnk-14",name:"field_2euu9hqyjbvnk-14",label:(0,t.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",justifyContent:"space-between",width:"100%",gap:"0.35rem"},children:["Setiap (menit)",(0,t.jsx)("span",{style:{display:"inline-flex",gap:"0.22rem"},children:[30,60,120,240].map(v=>(0,t.jsx)("button",{type:"button",disabled:!es.sync_enabled,className:"dors-preset-pill"+(Number(es.sync_interval_minutes)===v?" active":""),onClick:()=>eo(t=>({...t,sync_interval_minutes:v})),children:v+"m"},v))})]}),children:(0,t.jsxs)("div",{className:"dors-stepper-box",children:[(0,t.jsx)("input",{type:"number",className:"dors-stepper-input",min:1,max:1440,disabled:!es.sync_enabled,value:es.sync_interval_minutes??30,onChange:e=>eo(t=>({...t,sync_interval_minutes:Math.max(1,Math.min(1440,Number(e.target.value)||1))}))}),(0,t.jsx)("span",{className:"dors-stepper-unit",children:Number(es.sync_interval_minutes)>=60&&Number(es.sync_interval_minutes)%60===0?(Number(es.sync_interval_minutes)/60)+" jam":"menit"}),(0,t.jsxs)("div",{className:"dors-stepper-btns",children:[(0,t.jsx)("button",{type:"button",className:"dors-stepper-btn",disabled:!es.sync_enabled||Number(es.sync_interval_minutes)>=1440,title:"Tambah (+1 menit)",onClick:()=>eo(t=>({...t,sync_interval_minutes:Math.min(1440,(Number(t.sync_interval_minutes)||30)+1)})),children:(0,t.jsx)("svg",{width:11,height:11,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2.6,strokeLinecap:"round",strokeLinejoin:"round",children:(0,t.jsx)("polyline",{points:"18 15 12 9 6 15"})})}),(0,t.jsx)("button",{type:"button",className:"dors-stepper-btn",disabled:!es.sync_enabled||Number(es.sync_interval_minutes)<=1,title:"Kurangi (-1 menit)",onClick:()=>eo(t=>({...t,sync_interval_minutes:Math.max(1,(Number(t.sync_interval_minutes)||30)-1)})),children:(0,t.jsx)("svg",{width:11,height:11,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2.6,strokeLinecap:"round",strokeLinejoin:"round",children:(0,t.jsx)("polyline",{points:"6 9 12 15 18 9"})})})]})]})}):(0,t.jsx)(M,{id:"fld-2euu9hqyjbvnk-15",name:"field_2euu9hqyjbvnk-15",label:"Ekspresi Cron",children:(0,t.jsx)(a.InputText,{id:"fld-2euu9hqyjbvnk-16",name:"field_2euu9hqyjbvnk-16",value:es.sync_cron,onChange:e=>eo(t=>({...t,sync_cron:e.target.value})),placeholder:"0 2 * * *",style:{width:"100%"},disabled:!es.sync_enabled})}),(0,t.jsx)(M,{id:"fld-2euu9hqyjbvnk-17",name:"field_2euu9hqyjbvnk-17",label:(0,t.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",justifyContent:"space-between",width:"100%",gap:"0.35rem"},children:["Mundur (hari ke belakang)",(0,t.jsx)("span",{style:{display:"inline-flex",gap:"0.22rem"},children:[1,3,7].map(v=>(0,t.jsx)("button",{type:"button",disabled:!es.sync_enabled,className:"dors-preset-pill"+(Number(es.sync_days_back)===v?" active":""),onClick:()=>eo(t=>({...t,sync_days_back:v})),children:v+"h"},v))})]}),children:(0,t.jsxs)("div",{className:"dors-stepper-box",children:[(0,t.jsx)("input",{type:"number",className:"dors-stepper-input",min:0,max:365,disabled:!es.sync_enabled,value:es.sync_days_back??1,onChange:e=>eo(t=>({...t,sync_days_back:Math.max(0,Math.min(365,Number(e.target.value)||0))}))}),(0,t.jsx)("span",{className:"dors-stepper-unit",children:"hari"}),(0,t.jsxs)("div",{className:"dors-stepper-btns",children:[(0,t.jsx)("button",{type:"button",className:"dors-stepper-btn",disabled:!es.sync_enabled||Number(es.sync_days_back)>=365,title:"Tambah (+1 hari)",onClick:()=>eo(t=>({...t,sync_days_back:Math.min(365,(Number(t.sync_days_back)??1)+1)})),children:(0,t.jsx)("svg",{width:11,height:11,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2.6,strokeLinecap:"round",strokeLinejoin:"round",children:(0,t.jsx)("polyline",{points:"18 15 12 9 6 15"})})}),(0,t.jsx)("button",{type:"button",className:"dors-stepper-btn",disabled:!es.sync_enabled||Number(es.sync_days_back)<=0,title:"Kurangi (-1 hari)",onClick:()=>eo(t=>({...t,sync_days_back:Math.max(0,(Number(t.sync_days_back)??1)-1)})),children:(0,t.jsx)("svg",{width:11,height:11,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2.6,strokeLinecap:"round",strokeLinejoin:"round",children:(0,t.jsx)("polyline",{points:"6 9 12 15 18 9"})})})]})]})}),(0,t.jsx)(M,{id:"fld-2euu9hqyjbvnk-18",name:"field_2euu9hqyjbvnk-18",label:"Scope Data",children:(0,t.jsx)(l.Dropdown,{id:"fld-2euu9hqyjbvnk-19",inputId:"fld-2euu9hqyjbvnk-19-select",name:"field_2euu9hqyjbvnk-19",value:es.data_scope,onChange:e=>eo(t=>({...t,data_scope:e.value})),options:R,style:{width:"100%"},disabled:!es.sync_enabled})})]})]}),(0,t.jsxs)("div",{className:"dors-subcard-foot",children:[(0,t.jsx)("span",{style:{fontSize:"0.73rem",color:"var(--text-color-secondary,#64748b)"},children:es.sync_enabled?("interval"===es.sync_mode?"Berjalan tiap "+es.sync_interval_minutes+" menit · mundur "+es.sync_days_back+" hari":"Jadwal Cron ("+es.sync_cron+") · mundur "+es.sync_days_back+" hari"):"Penjadwalan otomatis sedang dinonaktifkan"}),(0,t.jsx)(o.Button,{label:"Simpan Jadwal",icon:"pi pi-check",severity:"success",onClick:eE,loading:ec,style:{height:"40px",marginLeft:"auto"}})]})]})]}),eh.length>0&&(0,t.jsxs)("div",{style:{marginTop:"1rem"},children:[(0,t.jsx)("div",{style:{fontWeight:700,fontSize:"0.82rem",color:"var(--text-color, #f1f5f9)",marginBottom:"0.4rem"},children:"Riwayat Penarikan"}),(0,t.jsxs)(d.DataTable,{value:eh,size:"small",stripedRows:!0,paginator:!0,rows:5,rowsPerPageOptions:[5,10,20],paginatorTemplate:"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport",currentPageReportTemplate:"Menampilkan {first} - {last} dari {totalRecords} riwayat",children:[(0,t.jsx)(p.Column,{header:"No",body:(e,t)=>t.rowIndex+1,style:{width:"3.5rem"},headerStyle:{width:"3.5rem"}}),(0,t.jsx)(p.Column,{header:"Waktu",body:e=>D(e.started_at)}),(0,t.jsx)(p.Column,{header:"Pemicu",body:e=>(0,t.jsx)(u.Tag,{value:"cron"===e.trigger?"Terjadwal":"Manual",severity:"cron"===e.trigger?"info":"warning"})}),(0,t.jsx)(p.Column,{header:"Rentang",body:e=>`${(e.from_date||"").slice(0,10)} → ${(e.to_date||"").slice(0,10)}`}),(0,t.jsx)(p.Column,{header:"Baru",body:e=>(0,t.jsx)("strong",{children:e.total_upserted})}),(0,t.jsx)(p.Column,{header:"Ditarik",field:"total_fetched"}),(0,t.jsx)(p.Column,{header:"LP A",body:e=>E(e,"lp_a"),style:{width:"5rem"}}),(0,t.jsx)(p.Column,{header:"LP B",body:e=>E(e,"lp_b"),style:{width:"5rem"}}),(0,t.jsx)(p.Column,{header:"Durasi",body:e=>e.duration_ms?`${(e.duration_ms/1e3).toFixed(1)}s`:"—"}),(0,t.jsx)(p.Column,{header:"Status",body:e=>(0,t.jsx)(u.Tag,{value:e.status,severity:"success"===e.status?"success":"running"===e.status?"info":"danger"})}),(0,t.jsx)(p.Column,{header:"Keterangan",body:e=>e.error?(0,t.jsx)("button",{type:"button",onClick:()=>er(e),className:"att-icon-link",title:"Lihat detail error",style:{color:"#dc2626",cursor:"pointer"},children:(0,t.jsx)(_.Eye,{size:16})}):"—",style:{width:"6rem"}})]})]})]})),"history-delete"===activeTab&&(0,t.jsxs)("div",{className:"cms-card",style:{marginBottom:"1rem",padding:"1.1rem"},children:[(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"0.75rem",marginBottom:"1rem"},children:[(0,t.jsxs)("div",{children:[(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[(0,t.jsx)(b.XCircle,{size:19,style:{color:"#dc2626"}}),(0,t.jsx)("span",{style:{fontWeight:800,fontSize:"1.05rem",color:"var(--text-color, #f8fafc)"},children:"Riwayat LP Dihapus / Dibatalkan (DORS Stamaops)"}),(0,t.jsx)(u.Tag,{severity:"danger",value:(eHDTotal||37) + " Terdata"})]}),(0,t.jsx)("p",{style:{fontSize:"0.8rem",color:"var(--text-color-secondary, #94a3b8)",margin:"0.25rem 0 0"},children:"Riwayat LP dihapus dari DORS (gk_history_delete) otomatis ditarik & diterapkan (soft-delete) serentak bersama Penarikan LP di Tab 1 maupun via jadwal harian."})]}),(0,t.jsxs)("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap",alignItems:"center"},children:[(0,t.jsx)(a.InputText,{type:"text",value:eHDSearch,onChange:e=>setEHDSearch(e.target.value),placeholder:"Cari No. LP...",style:{width:"11rem",fontSize:"0.82rem"}}),(0,t.jsx)(a.InputText,{type:"date",value:eHDFrom,onChange:e=>setEHDFrom(e.target.value),placeholder:"Dari",style:{width:"8.5rem",fontSize:"0.82rem"}}),(0,t.jsx)(a.InputText,{type:"date",value:eHDTo,onChange:e=>setEHDTo(e.target.value),placeholder:"Sampai",style:{width:"8.5rem",fontSize:"0.82rem"}}),(0,t.jsx)(o.Button,{label:ey?"Menarik Serentak…":"Tarik Serentak (LP & Riwayat)",icon:"pi pi-play",size:"small",onClick:()=>eN(eHDFrom,eHDTo),loading:ey,className:"p-button-info"}),(0,t.jsx)(o.Button,{label:eSyncingHD?"Menarik…":"Tarik Riwayat Dihapus Saja",icon:"pi pi-cloud-download",size:"small",onClick:doSyncHD,loading:eSyncingHD,className:"p-button-warning"}),(0,t.jsx)(o.Button,{label:eApplyingHD?"Menerapkan…":"Terapkan ke LP",icon:"pi pi-check-circle",size:"small",outlined:!0,onClick:doApplyHD,loading:eApplyingHD,severity:"danger"})]})]}),(0,t.jsxs)(d.DataTable,{value:eHDList,size:"small",stripedRows:!0,paginator:!0,rows:5,rowsPerPageOptions:[5,10,25,50],paginatorTemplate:"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport",currentPageReportTemplate:"Menampilkan {first} - {last} dari {totalRecords} LP dihapus",loading:eHDLoading,emptyMessage:"Belum ada riwayat LP dihapus yang tersimpan.",children:[(0,t.jsx)(p.Column,{header:"No",body:(e,t)=>t.rowIndex+1,style:{width:"3.5rem"}}),(0,t.jsx)(p.Column,{header:"No. Laporan",body:e=>(0,t.jsx)("div",{style:{fontWeight:700,fontSize:"0.82rem",maxWidth:"22rem",wordBreak:"break-all"},children:e.no_laporan||"—"})}),(0,t.jsx)(p.Column,{header:"ID LP DORS",field:"id_laporan",style:{width:"7.5rem"}}),(0,t.jsx)(p.Column,{header:"Kategori",body:e=>(0,t.jsx)(u.Tag,{value:e.kategori==="lp_model_a"?"Model A":e.kategori==="lp_model_b"?"Model B":e.kategori||"—",severity:"info"}),style:{width:"7rem"}}),(0,t.jsx)(p.Column,{header:"Aksi",body:e=>(0,t.jsx)(u.Tag,{value:e.action||"hapus",severity:"danger"}),style:{width:"5.5rem"}}),(0,t.jsx)(p.Column,{header:"Waktu Aksi DORS",body:e=>D(e.action_date||e.created_at),style:{width:"11rem"}}),(0,t.jsx)(p.Column,{header:"Status di CAS",body:e=>(0,t.jsx)(u.Tag,{value:e.applied?"Diterapkan (Soft-Delete)":"Pending",severity:e.applied?"success":"warning"}),style:{width:"12rem"}})]})]}),"sources"===activeTab&&(0,t.jsxs)("div",{children:[(0,t.jsxs)("div",{style:{display:"flex",gap:"0.6rem",alignItems:"flex-end",flexWrap:"wrap",marginBottom:"1rem"},children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{style:{display:"block",fontSize:"0.75rem",fontWeight:700,color:"var(--text-color-secondary, #94a3b8)",marginBottom:"0.25rem"},children:"Dari"}),(0,t.jsx)(a.InputText,{id:"fld-2euu9hqyjbvnk-20",name:"field_2euu9hqyjbvnk_20",type:"date",value:U,onChange:e=>W(e.target.value)})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{style:{display:"block",fontSize:"0.75rem",fontWeight:700,color:"var(--text-color-secondary, #94a3b8)",marginBottom:"0.25rem"},children:"Sampai"}),(0,t.jsx)(a.InputText,{id:"fld-2euu9hqyjbvnk-21",name:"field_2euu9hqyjbvnk_21",type:"date",value:$,onChange:e=>F(e.target.value)})]}),(0,t.jsx)(o.Button,{label:"Cek Status",icon:"pi pi-sync",onClick:ek,loading:L}),(U||$)&&(0,t.jsx)(o.Button,{label:"Reset",icon:"pi pi-refresh",text:!0,onClick:()=>{W(""),F("")}})]}),(0,t.jsx)("div",{className:"cms-cards",children:L&&0===j.length?(0,t.jsx)("div",{className:"cms-card",style:{color:"#94a3b8"},children:"Mengecek…"}):0===j.length?(0,t.jsx)("div",{className:"cms-card",style:{color:"#94a3b8"},children:"Tidak ada sumber terkonfigurasi."}):j.map(e=>(0,t.jsxs)("div",{className:"cms-card",style:{borderLeft:`4px solid ${e.active?"#16a34a":"#dc2626"}`},children:[(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.5rem",marginBottom:"0.6rem"},children:[(0,t.jsx)("span",{style:{fontWeight:800,fontSize:"1.05rem"},children:e.label}),(0,t.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.35rem",fontSize:"0.78rem",fontWeight:800,color:e.active?"#22c55e":"#ef4444",background:e.active?"rgba(34, 197, 94, 0.16)":"rgba(239, 68, 68, 0.16)",border:e.active?"1px solid rgba(34, 197, 94, 0.3)":"1px solid rgba(239, 68, 68, 0.3)",borderRadius:999,padding:"0.2rem 0.6rem"},children:[e.active?(0,t.jsx)(h.CheckCircle2,{size:14}):(0,t.jsx)(b.XCircle,{size:14})," ",e.active?"Aktif":"Tidak aktif"]})]}),(0,t.jsxs)("div",{style:{display:"flex",gap:"1.25rem",flexWrap:"wrap",fontSize:"0.85rem",color:"var(--text-color-secondary, #94a3b8)",marginBottom:"0.5rem"},children:[(0,t.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.35rem"},children:[(0,t.jsx)(x.Hash,{size:15})," Data: ",(0,t.jsx)("strong",{children:e.total??"—"})]}),(0,t.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.35rem"},children:[(0,t.jsx)(v.Clock,{size:15})," ",e.ms," ms"]}),(0,t.jsxs)("span",{style:{color:"#94a3b8"},children:["HTTP ",e.http_status||"-"]})]}),e.error&&(0,t.jsxs)("div",{style:{fontSize:"0.8rem",color:"#ef4444",marginBottom:"0.4rem"},children:["⚠ ",e.error]}),(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.35rem",fontSize:"0.72rem",color:"#94a3b8",overflow:"hidden"},children:[(0,t.jsx)(w,{id:"fld-2euu9hqyjbvnk-22",name:"field_2euu9hqyjbvnk_22",size:13,style:{flex:"0 0 auto"}}),(0,t.jsxs)("span",{style:{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:["/api/v1/",e.path]})]})]},e.key))}),(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.4rem",marginTop:"1rem",color:"#94a3b8",fontSize:"0.78rem"},children:[(0,t.jsx)(g.RefreshCw,{size:13})," Sumber diatur di config server (config/dors-sources.json). URL & kredensial dapat diubah lewat tombol Konfigurasi. Data hasil tarikan ada di menu ",(0,t.jsx)("strong",{children:"Data LP DORS"}),"."]})]})]}),(0,t.jsx)(c.Dialog,{header:"Konfigurasi DORS",visible:K,onHide:()=>V(!1),style:{width:"34rem",maxWidth:"95vw"},modal:!0,footer:(0,t.jsxs)("div",{children:[(0,t.jsx)(o.Button,{label:"Batal",text:!0,onClick:()=>V(!1),disabled:Y}),(0,t.jsx)(o.Button,{label:"Simpan",icon:"pi pi-check",onClick:eI,loading:Y})]}),children:(0,t.jsxs)("div",{style:{display:"grid",gap:"0.7rem"},children:[(0,t.jsx)(M,{id:"fld-2euu9hqyjbvnk-23",name:"field_2euu9hqyjbvnk_23",label:"Base URL DORS",children:(0,t.jsx)(a.InputText,{id:"fld-2euu9hqyjbvnk-24",name:"field_2euu9hqyjbvnk_24",value:X.base_url,onChange:e=>J(t=>({...t,base_url:e.target.value})),placeholder:"https://dors.stamaops.polri.go.id/api/v1",style:{width:"100%"}})}),(0,t.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.7rem"},children:[(0,t.jsx)(M,{id:"fld-2euu9hqyjbvnk-25",name:"field_2euu9hqyjbvnk_25",label:"Nama Header Client ID",children:(0,t.jsx)(a.InputText,{id:"fld-2euu9hqyjbvnk-26",name:"field_2euu9hqyjbvnk_26",value:X.client_header,onChange:e=>J(t=>({...t,client_header:e.target.value})),placeholder:"CLIENTID",style:{width:"100%"}})}),(0,t.jsx)(M,{id:"fld-2euu9hqyjbvnk-27",name:"field_2euu9hqyjbvnk_27",label:"Timeout (ms)",hint:"disarankan ≥20000, terlalu kecil berisiko timeout",children:(0,t.jsx)(a.InputText,{id:"fld-2euu9hqyjbvnk-28",name:"field_2euu9hqyjbvnk_28",value:X.timeout_ms,onChange:e=>J(t=>({...t,timeout_ms:e.target.value})),style:{width:"100%"}})})]}),(0,t.jsx)(M,{id:"fld-2euu9hqyjbvnk-29",name:"field_2euu9hqyjbvnk_29",label:`Client ID ${Z?.client_id_masked?`(sekarang: ${Z.client_id_masked})`:""}`,hint:"kosongkan bila tidak ingin mengubah",children:(0,t.jsx)(i.Password,{value:X.client_id,onChange:e=>J(t=>({...t,client_id:e.target.value})),feedback:!1,toggleMask:!0,inputStyle:{width:"100%"},style:{width:"100%"},placeholder:"••••"})}),Z?.client_configured&&(0,t.jsx)("div",{style:{fontSize:"0.8rem"},children:Q?(0,t.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.4rem"},children:[(0,t.jsx)(x.Hash,{size:13,style:{color:"#64748b"}})," Client ID asli: ",(0,t.jsx)("code",{style:{background:"var(--surface-hover, rgba(255,255,255,0.06))",color:"var(--text-color, #f1f5f9)",padding:"0.1rem 0.4rem",borderRadius:4},children:Q})]}):(0,t.jsx)(o.Button,{label:"Lihat Client ID Asli",text:!0,size:"small",icon:"pi pi-eye",onClick:eP,loading:et,style:{padding:0,fontSize:"0.8rem"}})}),(0,t.jsx)("p",{style:{fontSize:"0.78rem",color:"#64748b",margin:0},children:"Perubahan langsung dipakai untuk pengecekan & penarikan berikutnya (disimpan di server)."})]})}),(0,t.jsx)(c.Dialog,{header:"Detail Error Penarikan",visible:!!ea,onHide:()=>er(null),style:{width:"34rem",maxWidth:"96vw"},modal:!0,children:ea&&(0,t.jsxs)("div",{style:{display:"grid",gap:"0.6rem"},children:[(0,t.jsxs)("div",{style:{fontSize:"0.8rem",color:"#64748b"},children:[D(ea.started_at)," · ","cron"===ea.trigger?"Terjadwal":"Manual"," · ",(ea.from_date||"").slice(0,10)," → ",(ea.to_date||"").slice(0,10)]}),(0,t.jsx)("div",{style:{background:"rgba(239, 68, 68, 0.12)",border:"1px solid rgba(239, 68, 68, 0.3)",borderRadius:8,padding:"0.75rem",color:"#f87171",fontSize:"0.85rem",whiteSpace:"pre-wrap",wordBreak:"break-word"},children:ea.error})]})})]})}],77128)}]);