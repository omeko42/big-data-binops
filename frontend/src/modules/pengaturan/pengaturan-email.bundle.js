(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,71326,97778,e=>{"use strict";var t=e.i(71645),n=e.i(48264),r=e.i(1743),a=e.i(43456),o=e.i(71144),i=e.i(29168),l=e.i(28797),s=e.i(27259),c=e.i(73193);function u(){return(u=Object.assign.bind()).apply(null,arguments)}function p(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function d(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"u">typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var r,a,o,i,l=[],s=!0,c=!1;try{if(o=(n=n.call(e)).next,0===t){if(Object(n)!==n)return;s=!1}else for(;!(s=(r=o.call(n)).done)&&(l.push(r.value),l.length!==t);s=!0);}catch(e){c=!0,a=e}finally{try{if(!s&&null!=n.return&&(i=n.return(),Object(i)!==i))return}finally{if(c)throw a}}return l}}(e,t)||function(e,t){if(e){if("string"==typeof e)return p(e,t);var n=({}).toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?p(e,t):void 0}}(e,t)||function(){throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function f(e){return(f="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}var m=a.ComponentBase.extend({defaultProps:{__TYPE:"ConfirmDialog",accept:null,acceptClassName:null,acceptIcon:null,acceptLabel:null,appendTo:null,breakpoints:null,children:void 0,className:null,content:null,defaultFocus:"accept",footer:null,icon:null,message:null,onHide:null,reject:null,rejectClassName:null,rejectIcon:null,rejectLabel:null,tagKey:void 0,visible:void 0},css:{classes:{root:"p-confirm-dialog",message:"p-confirm-dialog-message",icon:"p-confirm-dialog-icon",acceptButton:"p-confirm-dialog-accept",rejectButton:function(e){var t=e.getPropValue;return(0,c.classNames)("p-confirm-dialog-reject",{"p-button-text":!t("rejectClassName")})}}}});function b(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function g(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?b(Object(n),!0).forEach(function(t){!function(e,t,n){var r;(r=function(e,t){if("object"!=f(e)||!e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var r=n.call(e,t||"default");if("object"!=f(r))return r;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(t,"string"),(t="symbol"==f(r)?r:r+"")in e)?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n}(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):b(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}var y=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return(e=g(g({},e),{visible:void 0===e.visible||e.visible})).visible&&l.OverlayService.emit("confirm-dialog",e),{show:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};l.OverlayService.emit("confirm-dialog",g(g(g({},e),t),{visible:!0}))},hide:function(){l.OverlayService.emit("confirm-dialog",{visible:!1})}}},v=t.memo(t.forwardRef(function(e,p){var f,b,y,v,h,w,j,O=(0,i.useMergeProps)(),C=t.useContext(n.PrimeReactContext),k=m.getProps(e,C),x=d(t.useState(k.visible),2),S=x[0],P=x[1],E=d(t.useState(!1),2),I=E[0],N=E[1],R=t.useRef(null),T=t.useRef(!1),D=t.useRef(null),M=function(){var e=k.group;return R.current&&(e=R.current.group),Object.assign({},k,R.current,{group:e})},B=function(e){return M()[e]},_=function(e){for(var t=arguments.length,n=Array(t>1?t-1:0),r=1;r<t;r++)n[r-1]=arguments[r];return c.ObjectUtils.getPropValue(B(e),n)},A=B("acceptLabel")||(0,n.localeOption)("accept"),L=B("rejectLabel")||(0,n.localeOption)("reject"),U={props:k,state:{visible:S}},H=m.setMetaData(U),K=H.ptm,F=H.cx,Z=H.isUnstyled;(0,a.useHandleStyle)(m.css.styles,Z,{name:"confirmdialog"});var z=function(){T.current||(T.current=!0,_("accept"),J("accept"))},V=function(){T.current||(T.current=!0,_("reject"),J("reject"))},W=function(){M().group===k.group&&(P(!0),T.current=!1,D.current=document.activeElement)},J=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"cancel";S&&("string"!=typeof e&&(e="cancel"),P(!1),_("onHide",e),c.DomHandler.focus(D.current),D.current=null)},X=function(e){if(e.tagKey===k.tagKey&&(void 0===e.group||e.group===k.group)){var t=S!==e.visible;B("target")===e.target||k.target?t&&(R.current=e,e.visible?W():J()):(J(),R.current=e,N(!0))}};t.useEffect(function(){k.visible?W():J()},[k.visible]),t.useEffect(function(){return k.target||k.message||l.OverlayService.on("confirm-dialog",X),function(){l.OverlayService.off("confirm-dialog",X)}},[k.target]),(0,i.useUpdateEffect)(function(){I&&W()},[I]),(0,i.useUnmountEffect)(function(){l.OverlayService.off("confirm-dialog",X)}),t.useImperativeHandle(p,function(){return{props:k,confirm:X}});var Y=(f=M(),b=c.ObjectUtils.getJSXElement(B("message"),f),y=O({className:F("icon")},K("icon")),v=c.IconUtils.getJSXIcon(B("icon"),g({},y),{props:f}),h=function(){var e=B("defaultFocus"),n=(0,c.classNames)("p-confirm-dialog-accept",B("acceptClassName")),a=(0,c.classNames)("p-confirm-dialog-reject",{"p-button-text":!B("rejectClassName")},B("rejectClassName")),o=O({label:L,autoFocus:"reject"===e,icon:B("rejectIcon"),className:(0,c.classNames)(B("rejectClassName"),F("rejectButton",{getPropValue:B})),onClick:V,pt:K("rejectButton"),unstyled:k.unstyled,__parentMetadata:{parent:U}},K("rejectButton")),i=O({label:A,autoFocus:void 0===e||"accept"===e,icon:B("acceptIcon"),className:(0,c.classNames)(B("acceptClassName"),F("acceptButton")),onClick:z,pt:K("acceptButton"),unstyled:k.unstyled,__parentMetadata:{parent:U}},K("acceptButton")),l=t.createElement(t.Fragment,null,t.createElement(r.Button,o),t.createElement(r.Button,i));if(B("footer")){var s={accept:z,reject:V,acceptClassName:n,rejectClassName:a,acceptLabel:A,rejectLabel:L,element:l,props:M()};return c.ObjectUtils.getJSXElement(B("footer"),s)}return l}(),w=O({className:F("message")},K("message")),j=O({visible:S,className:(0,c.classNames)(B("className"),F("root")),footer:h,onHide:J,breakpoints:B("breakpoints"),pt:f.pt,unstyled:k.unstyled,appendTo:B("appendTo"),__parentMetadata:{parent:U}},m.getOtherProps(f)),t.createElement(o.Dialog,u({},j,{content:null==e?void 0:e.content}),v,t.createElement("span",w,b)));return t.createElement(s.Portal,{element:Y,appendTo:B("appendTo")})}));v.displayName="ConfirmDialog",e.s(["ConfirmDialog",0,v,"confirmDialog",0,y],97778),e.s(["confirmAction",0,function(e,t){return new Promise(n=>{let r=!1,a=e=>{r||(r=!0,n(e))};y({message:e,header:t?.header||"Konfirmasi",icon:t?.danger?"pi pi-exclamation-triangle":"pi pi-question-circle",acceptLabel:t?.acceptLabel||"Ya, lanjutkan",rejectLabel:"Batal",acceptClassName:t?.danger?"p-button-danger":void 0,accept:()=>a(!0),reject:()=>a(!1),onHide:()=>a(!1)})})}],71326)},73342,e=>{"use strict";var t=e.i(71645),n=e.i(48264),r=e.i(43456),a=e.i(83438),o=e.i(29168),i=e.i(73193),l=e.i(44506);function s(){return(s=Object.assign.bind()).apply(null,arguments)}var c=t.memo(t.forwardRef(function(e,n){var r=l.IconBase.getPTI(e);return t.createElement("svg",s({ref:n,width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",xmlns:"http://www.w3.org/2000/svg"},r),t.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M0.0535499 7.25213C0.208567 7.59162 2.40413 12.4 7 12.4C11.5959 12.4 13.7914 7.59162 13.9465 7.25213C13.9487 7.2471 13.9506 7.24304 13.952 7.24001C13.9837 7.16396 14 7.08239 14 7.00001C14 6.91762 13.9837 6.83605 13.952 6.76001C13.9506 6.75697 13.9487 6.75292 13.9465 6.74788C13.7914 6.4084 11.5959 1.60001 7 1.60001C2.40413 1.60001 0.208567 6.40839 0.0535499 6.74788C0.0512519 6.75292 0.0494023 6.75697 0.048 6.76001C0.0163137 6.83605 0 6.91762 0 7.00001C0 7.08239 0.0163137 7.16396 0.048 7.24001C0.0494023 7.24304 0.0512519 7.2471 0.0535499 7.25213ZM7 11.2C3.664 11.2 1.736 7.92001 1.264 7.00001C1.736 6.08001 3.664 2.80001 7 2.80001C10.336 2.80001 12.264 6.08001 12.736 7.00001C12.264 7.92001 10.336 11.2 7 11.2ZM5.55551 9.16182C5.98308 9.44751 6.48576 9.6 7 9.6C7.68891 9.59789 8.349 9.32328 8.83614 8.83614C9.32328 8.349 9.59789 7.68891 9.59999 7C9.59999 6.48576 9.44751 5.98308 9.16182 5.55551C8.87612 5.12794 8.47006 4.7947 7.99497 4.59791C7.51988 4.40112 6.99711 4.34963 6.49276 4.44995C5.98841 4.55027 5.52513 4.7979 5.16152 5.16152C4.7979 5.52513 4.55027 5.98841 4.44995 6.49276C4.34963 6.99711 4.40112 7.51988 4.59791 7.99497C4.7947 8.47006 5.12794 8.87612 5.55551 9.16182ZM6.2222 5.83594C6.45243 5.6821 6.7231 5.6 7 5.6C7.37065 5.6021 7.72553 5.75027 7.98762 6.01237C8.24972 6.27446 8.39789 6.62934 8.4 7C8.4 7.27689 8.31789 7.54756 8.16405 7.77779C8.01022 8.00802 7.79157 8.18746 7.53575 8.29343C7.27994 8.39939 6.99844 8.42711 6.72687 8.37309C6.4553 8.31908 6.20584 8.18574 6.01005 7.98994C5.81425 7.79415 5.68091 7.54469 5.6269 7.27312C5.57288 7.00155 5.6006 6.72006 5.70656 6.46424C5.81253 6.20842 5.99197 5.98977 6.2222 5.83594Z",fill:"currentColor"}))}));function u(){return(u=Object.assign.bind()).apply(null,arguments)}c.displayName="EyeIcon";var p=t.memo(t.forwardRef(function(e,n){var r=l.IconBase.getPTI(e);return t.createElement("svg",u({ref:n,width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",xmlns:"http://www.w3.org/2000/svg"},r),t.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M13.9414 6.74792C13.9437 6.75295 13.9455 6.757 13.9469 6.76003C13.982 6.8394 14.0001 6.9252 14.0001 7.01195C14.0001 7.0987 13.982 7.1845 13.9469 7.26386C13.6004 8.00059 13.1711 8.69549 12.6674 9.33515C12.6115 9.4071 12.54 9.46538 12.4582 9.50556C12.3765 9.54574 12.2866 9.56678 12.1955 9.56707C12.0834 9.56671 11.9737 9.53496 11.8788 9.47541C11.7838 9.41586 11.7074 9.3309 11.6583 9.23015C11.6092 9.12941 11.5893 9.01691 11.6008 8.90543C11.6124 8.79394 11.6549 8.68793 11.7237 8.5994C12.1065 8.09726 12.4437 7.56199 12.7313 6.99995C12.2595 6.08027 10.3402 2.8014 6.99732 2.8014C6.63723 2.80218 6.27816 2.83969 5.92569 2.91336C5.77666 2.93304 5.62568 2.89606 5.50263 2.80972C5.37958 2.72337 5.29344 2.59398 5.26125 2.44714C5.22907 2.30031 5.2532 2.14674 5.32885 2.01685C5.40451 1.88696 5.52618 1.79021 5.66978 1.74576C6.10574 1.64961 6.55089 1.60134 6.99732 1.60181C11.5916 1.60181 13.7864 6.40856 13.9414 6.74792ZM2.20333 1.61685C2.35871 1.61411 2.5091 1.67179 2.6228 1.77774L12.2195 11.3744C12.3318 11.4869 12.3949 11.6393 12.3949 11.7983C12.3949 11.9572 12.3318 12.1097 12.2195 12.2221C12.107 12.3345 11.9546 12.3976 11.7956 12.3976C11.6367 12.3976 11.4842 12.3345 11.3718 12.2221L10.5081 11.3584C9.46549 12.0426 8.24432 12.4042 6.99729 12.3981C2.403 12.3981 0.208197 7.59135 0.0532336 7.25198C0.0509364 7.24694 0.0490875 7.2429 0.0476856 7.23986C0.0162332 7.16518 3.05176e-05 7.08497 3.05176e-05 7.00394C3.05176e-05 6.92291 0.0162332 6.8427 0.0476856 6.76802C0.631261 5.47831 1.46902 4.31959 2.51084 3.36119L1.77509 2.62545C1.66914 2.51175 1.61146 2.36136 1.61421 2.20597C1.61695 2.05059 1.6799 1.90233 1.78979 1.79244C1.89968 1.68254 2.04794 1.6196 2.20333 1.61685ZM7.45314 8.35147L5.68574 6.57609V6.5361C5.5872 6.78938 5.56498 7.06597 5.62183 7.33173C5.67868 7.59749 5.8121 7.84078 6.00563 8.03158C6.19567 8.21043 6.43052 8.33458 6.68533 8.39089C6.94014 8.44721 7.20543 8.43359 7.45314 8.35147ZM1.26327 6.99994C1.7351 7.91163 3.64645 11.1985 6.99729 11.1985C7.9267 11.2048 8.8408 10.9618 9.64438 10.4947L8.35682 9.20718C7.86027 9.51441 7.27449 9.64491 6.69448 9.57752C6.11446 9.51014 5.57421 9.24881 5.16131 8.83592C4.74842 8.42303 4.4871 7.88277 4.41971 7.30276C4.35232 6.72274 4.48282 6.13697 4.79005 5.64041L3.35855 4.2089C2.4954 5.00336 1.78523 5.94935 1.26327 6.99994Z",fill:"currentColor"}))}));p.displayName="EyeSlashIcon";var d=e.i(44080),f=e.i(28797),m=e.i(27259);function b(){return(b=Object.assign.bind()).apply(null,arguments)}function g(e){return(g="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function y(e,t,n){var r;return(r=function(e,t){if("object"!=g(e)||!e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var r=n.call(e,t||"default");if("object"!=g(r))return r;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(t,"string"),(t="symbol"==g(r)?r:r+"")in e)?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function v(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function h(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"u">typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var r,a,o,i,l=[],s=!0,c=!1;try{if(o=(n=n.call(e)).next,0===t){if(Object(n)!==n)return;s=!1}else for(;!(s=(r=o.call(n)).done)&&(l.push(r.value),l.length!==t);s=!0);}catch(e){c=!0,a=e}finally{try{if(!s&&null!=n.return&&(i=n.return(),Object(i)!==i))return}finally{if(c)throw a}}return l}}(e,t)||function(e,t){if(e){if("string"==typeof e)return v(e,t);var n=({}).toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?v(e,t):void 0}}(e,t)||function(){throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var w=r.ComponentBase.extend({defaultProps:{__TYPE:"IconField",__parentMetadata:null,children:void 0,className:null,iconPosition:"right"},css:{classes:{root:function(e){var t=e.props;return(0,i.classNames)("p-icon-field",{"p-icon-field-right":"right"===t.iconPosition,"p-icon-field-left":"left"===t.iconPosition})}}}});function j(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function O(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?j(Object(n),!0).forEach(function(t){y(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):j(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}var C=t.default.memo(t.default.forwardRef(function(e,r){var a=(0,t.useRef)(r),l=(0,o.useMergeProps)(),s=(0,t.useContext)(n.PrimeReactContext),c=w.getProps(e,s),u=w.setMetaData(O(O({props:c},c.__parentMetadata),{},{context:{iconPosition:c.iconPosition}})),p=u.ptm,d=u.cx,f=l({className:(0,i.classNames)(c.className,d("root",{iconPosition:c.iconPosition}))},w.getOtherProps(c),p("root"));return t.default.createElement("div",b({},f,{ref:a}),t.Children.map(c.children,function(e,n){return(0,t.cloneElement)(e,{iconPosition:c.iconPosition})}))}));C.displayName="IconField";var k=r.ComponentBase.extend({defaultProps:{__TYPE:"InputIcon",__parentMetadata:null,className:null,iconPosition:null},css:{classes:{root:"p-input-icon"}}});function x(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function S(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?x(Object(n),!0).forEach(function(t){y(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):x(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}var P=t.default.memo(t.default.forwardRef(function(e,r){var a=(0,t.useRef)(r),l=(0,o.useMergeProps)(),s=(0,t.useContext)(n.PrimeReactContext),c=k.getProps(e,s),u=k.setMetaData(S(S({props:c},c.__parentMetadata),{},{context:{iconPosition:c.iconPosition}})),p=u.ptm,d=u.cx,f=l({className:(0,i.classNames)(c.className,d("root"))},k.getOtherProps(c),p("root"));return t.default.createElement(t.default.Fragment,null,t.default.createElement("span",b({},f,{ref:a}),c.children))}));P.displayName="InputIcon";var E=r.ComponentBase.extend({defaultProps:{__TYPE:"Password",id:null,inputId:null,inputRef:null,promptLabel:null,weakLabel:null,mediumLabel:null,strongLabel:null,mediumRegex:"^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})",strongRegex:"^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})",feedback:!0,toggleMask:!1,appendTo:null,header:null,content:null,footer:null,showIcon:null,hideIcon:null,icon:null,tooltip:null,tooltipOptions:null,style:null,className:null,inputStyle:null,inputClassName:null,invalid:!1,variant:null,panelStyle:null,panelClassName:null,transitionOptions:null,tabIndex:null,value:void 0,onInput:null,onShow:null,onHide:null,children:void 0},css:{classes:{root:function(e){var t=e.props,n=e.isFilled,r=e.focusedState;return(0,i.classNames)("p-password p-component p-inputwrapper",{"p-inputwrapper-filled":n,"p-inputwrapper-focus":r,"p-input-icon-right":t.toggleMask})},input:function(e){var t=e.props;return(0,i.classNames)("p-password-input",t.inputClassName)},panel:function(e){var t=e.props,r=e.context;return(0,i.classNames)("p-password-panel p-component",t.panelClassName,{"p-input-filled":r&&"filled"===r.inputStyle||"filled"===n.default.inputStyle,"p-ripple-disabled":r&&!1===r.ripple||!1===n.default.ripple})},meter:"p-password-meter",meterLabel:function(e){var t=e.strength;return(0,i.classNames)("p-password-strength",t)},info:function(e){var t=e.strength;return(0,i.classNames)("p-password-info",t)},showIcon:"p-password-show-icon",hideIcon:"p-password-hide-icon",transition:"p-connected-overlay"},styles:"\n@layer primereact {\n    .p-password {\n        position: relative;\n        display: inline-flex;\n    }\n    \n    .p-password-panel {\n        position: absolute;\n        top: 0;\n        left: 0;\n    }\n    \n    .p-password .p-password-panel {\n        min-width: 100%;\n    }\n    \n    .p-password-meter {\n        height: 10px;\n    }\n    \n    .p-password-strength {\n        height: 100%;\n        width: 0%;\n        transition: width 1s ease-in-out;\n    }\n    \n    .p-fluid .p-password {\n        display: flex;\n    }\n    \n    .p-password-input::-ms-reveal,\n    .p-password-input::-ms-clear {\n        display: none;\n    }\n\n    .p-password .p-password-show-icon,\n    .p-password .p-password-hide-icon {\n        line-height: 1.5;\n        cursor: pointer;\n    }\n}\n"}});function I(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function N(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?I(Object(n),!0).forEach(function(t){y(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):I(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}var R=t.memo(t.forwardRef(function(e,l){var s,u,g,y,v,w,j,O,k,x,S,I,R=(0,o.useMergeProps)(),T=t.useContext(n.PrimeReactContext),D=E.getProps(e,T),M=D.promptLabel||(0,n.localeOption)("passwordPrompt"),B=D.weakLabel||(0,n.localeOption)("weak"),_=D.mediumLabel||(0,n.localeOption)("medium"),A=D.strongLabel||(0,n.localeOption)("strong"),L=h(t.useState(!1),2),U=L[0],H=L[1],K=h(t.useState(null),2),F=K[0],Z=K[1],z=h(t.useState(M),2),V=z[0],W=z[1],J=h(t.useState(!1),2),X=J[0],Y=J[1],$=h(t.useState(!1),2),G=$[0],q=$[1],Q=t.useRef(null),ee=t.useRef(null),et=t.useRef(D.inputRef),en=t.useRef(new RegExp(D.mediumRegex)),er=t.useRef(new RegExp(D.strongRegex)),ea=G?"text":"password",eo={props:D,state:{overlayVisible:U,meter:F,infoText:V,focused:X,unmasked:G}},ei=E.setMetaData(eo),el=ei.ptm,es=ei.cx,ec=ei.isUnstyled;(0,r.useHandleStyle)(E.css.styles,ec,{name:"password"});var eu=(0,o.useDisplayOrder)("password",U);(0,o.useGlobalOnEscapeKey)({callback:function(){ew()},when:U&&D.feedback&&eu,priority:[o.ESC_KEY_HANDLING_PRIORITIES.PASSWORD,eu]});var ep=h((0,o.useOverlayListener)({target:Q,overlay:ee,listener:function(e,t){var n=t.valid,r=t.type;n&&("outside"===r||T.hideOverlaysOnDocumentScrolling?ew():i.DomHandler.isDocument(e.target)||ej())},when:U}),2),ed=ep[0],ef=ep[1],em=et.current&&et.current.value,eb=t.useMemo(function(){return i.ObjectUtils.isNotEmpty(D.value)||i.ObjectUtils.isNotEmpty(D.defaultValue)||i.ObjectUtils.isNotEmpty(em)},[D.value,D.defaultValue,em]),eg=function(){if(F){var e=null;switch(F.strength){case"weak":e=B;break;case"medium":e=_;break;case"strong":e=A}e&&V!==e&&W(e)}else V!==M&&W(M)},ey=function(e){if(!D.feedback)return!1;var t=null,n=null;switch(eO(e)){case 1:t=B,n={strength:"weak",width:"33.33%"};break;case 2:t=_,n={strength:"medium",width:"66.66%"};break;case 3:t=A,n={strength:"strong",width:"100%"};break;default:t=M,n=null}return Z(n),W(t),!0},ev=function(){q(function(e){return!e})},eh=function(){eg(),H(!0)},ew=function(){H(!1)},ej=function(){et.current&&i.DomHandler.alignOverlay(ee.current,et.current.parentElement,D.appendTo||T&&T.appendTo||n.default.appendTo)},eO=function(e){return e&&0!==e.length?er.current.test(e)?3:en.current.test(e)?2:1*!!(e.length>0):0};t.useImperativeHandle(l,function(){return{props:D,toggleMask:ev,focus:function(){return i.DomHandler.focus(et.current)},getElement:function(){return Q.current},getOverlay:function(){return ee.current},getInput:function(){return et.current}}}),t.useEffect(function(){i.ObjectUtils.combinedRefs(et,D.inputRef)},[et,D.inputRef]),t.useEffect(function(){en.current=new RegExp(D.mediumRegex)},[D.mediumRegex]),t.useEffect(function(){er.current=new RegExp(D.strongRegex)},[D.strongRegex]),t.useEffect(function(){!eb&&i.DomHandler.hasClass(Q.current,"p-inputwrapper-filled")&&i.DomHandler.removeClass(Q.current,"p-inputwrapper-filled")},[eb]),(0,o.useUpdateEffect)(function(){ey(D.value)},[D.value]),(0,o.useMountEffect)(function(){ej()}),(0,o.useUnmountEffect)(function(){i.ZIndexUtils.clear(ee.current)});var eC=function(e){("Enter"===e.key||"Space"===e.code)&&(ev(),e.preventDefault())},ek=(0,i.classNames)("p-password p-component p-inputwrapper",{"p-inputwrapper-filled":eb,"p-inputwrapper-focus":X,"p-input-icon-right":D.toggleMask},D.className),ex=E.getOtherProps(D),eS=function(){if(!D.toggleMask)return null;var e,r=R({role:"switch",tabIndex:D.tabIndex||"0",className:es("hideIcon"),onClick:ev,onKeyDown:eC,"aria-label":(0,n.ariaLabel)("passwordHide")||"Hide Password","aria-checked":"false"},el("hideIcon")),a=R({role:"switch",tabIndex:D.tabIndex||"0",className:es("showIcon"),onClick:ev,onKeyDown:eC,"aria-label":(0,n.ariaLabel)("passwordShow")||"Show Password","aria-checked":"true"},el("showIcon"));e=G?D.hideIcon||t.createElement(p,r):D.showIcon||t.createElement(c,a);var o=i.IconUtils.getJSXIcon(e,G?N({},r):N({},a),{props:D});if(D.icon){var l={onClick:ev,className:ek,element:o,props:D};o=i.ObjectUtils.getJSXElement(D.icon,l)}return o}(),eP=(u=(s=F||{strength:"",width:"0%"}).strength,g=s.width,y=i.ObjectUtils.getJSXElement(D.header,D),v=i.ObjectUtils.getJSXElement(D.footer,D),w=R({className:es("panel",{context:T}),style:D.panelStyle,onClick:function(e){D.feedback&&f.OverlayService.emit("overlay-click",{originalEvent:e,target:Q.current})}},el("panel")),j=R({className:es("meter")},el("meter")),O=R({className:es("meterLabel",{strength:u}),style:{width:g}},el("meterLabel")),k=R({className:es("info",{strength:u})},el("info")),x=D.content?i.ObjectUtils.getJSXElement(D.content,D):t.createElement(t.Fragment,null,t.createElement("div",j,t.createElement("div",O)),t.createElement("div",k,V)),S=R({classNames:es("transition"),in:U,timeout:{enter:120,exit:100},options:D.transitionOptions,unmountOnExit:!0,onEnter:function(){i.ZIndexUtils.set("overlay",ee.current,T&&T.autoZIndex||n.default.autoZIndex,T&&T.zIndex.overlay||n.default.zIndex.overlay),i.DomHandler.addStyles(ee.current,{position:"absolute",top:"0",left:"0"}),ej()},onEntered:function(){ed(),D.onShow&&D.onShow()},onExit:function(){ef()},onExited:function(){i.ZIndexUtils.clear(ee.current),D.onHide&&D.onHide()}},el("transition")),I=t.createElement(a.CSSTransition,b({nodeRef:ee},S),t.createElement("div",b({ref:ee},w),y,x,v)),t.createElement(m.Portal,{element:I,appendTo:D.appendTo})),eE=R({ref:Q,id:D.id,className:(0,i.classNames)(D.className,es("root",{isFilled:eb,focusedState:X})),style:D.style},el("root")),eI=R(N(N({ref:et,id:D.inputId,autoComplete:D.autoComplete},ex),{},{className:(0,i.classNames)(D.inputClassName,es("input")),onBlur:function(e){Y(!1),D.feedback&&ew(),D.onBlur&&D.onBlur(e)},onFocus:function(e){Y(!0),D.feedback&&eh(),D.onFocus&&D.onFocus(e)},onInput:function(e,t){D.onInput&&D.onInput(e,t),D.onChange||(i.ObjectUtils.isNotEmpty(e.target.value)?i.DomHandler.addClass(Q.current,"p-inputwrapper-filled"):i.DomHandler.removeClass(Q.current,"p-inputwrapper-filled"))},onKeyUp:function(e){var t=e.code;D.feedback&&t&&"Escape"!==t&&!U&&eh(),D.onKeyUp&&D.onKeyUp(e)},invalid:D.invalid,variant:D.variant,style:D.inputStyle,unstyled:D.unstyled,tabIndex:D.tabIndex||"0",tooltip:D.tooltip,tooltipOptions:D.tooltipOptions,type:ea,value:D.value,__parentMetadata:{parent:eo}}),el("input")),eN=t.createElement(d.InputText,eI);return eS&&(eN=t.createElement(C,{className:es("iconField"),pt:el("iconField"),__parentMetadata:{parent:eo}},eN,t.createElement(P,{className:es("inputIcon"),pt:el("inputIcon"),__parentMetadata:{parent:eo}},eS))),t.createElement("div",eE,eN,eP)}));R.displayName="Password",e.s(["Password",0,R],73342)},70454,e=>{"use strict";var t=e.i(71645),n=e.i(48264),r=e.i(43456),a=e.i(29168),o=e.i(40623),i=e.i(73193);function l(){return(l=Object.assign.bind()).apply(null,arguments)}function s(e){return(s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}var c=r.ComponentBase.extend({defaultProps:{__TYPE:"InputSwitch",autoFocus:!1,checked:!1,className:null,disabled:!1,falseValue:!1,id:null,inputId:null,inputRef:null,invalid:!1,name:null,onBlur:null,onChange:null,onFocus:null,style:null,tabIndex:null,tooltip:null,tooltipOptions:null,trueValue:!0,children:void 0},css:{classes:{root:function(e){var t=e.props,n=e.checked;return(0,i.classNames)("p-inputswitch p-component",{"p-highlight":n,"p-disabled":t.disabled,"p-invalid":t.invalid})},input:"p-inputswitch-input",slider:"p-inputswitch-slider"}}});function u(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}var p=t.memo(t.forwardRef(function(e,p){var d=(0,a.useMergeProps)(),f=t.useContext(n.PrimeReactContext),m=c.getProps(e,f),b=c.setMetaData({props:m}),g=b.ptm,y=b.cx,v=b.isUnstyled;(0,r.useHandleStyle)(c.css.styles,v,{name:"inputswitch"});var h=t.useRef(null),w=t.useRef(m.inputRef),j=m.checked===m.trueValue;t.useImperativeHandle(p,function(){return{props:m,focus:function(){return i.DomHandler.focus(w.current)},getElement:function(){return h.current},getInput:function(){return w.current}}}),t.useEffect(function(){i.ObjectUtils.combinedRefs(w,m.inputRef)},[w,m.inputRef]),(0,a.useMountEffect)(function(){m.autoFocus&&i.DomHandler.focus(w.current,m.autoFocus)});var O=i.ObjectUtils.isNotEmpty(m.tooltip),C=c.getOtherProps(m),k=i.ObjectUtils.reduceKeys(C,i.DomHandler.ARIA_PROPS),x=d({className:(0,i.classNames)(m.className,y("root",{checked:j})),style:m.style,role:"checkbox","aria-checked":j,"data-p-highlight":j,"data-p-disabled":m.disabled},C,g("root")),S=d(function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?u(Object(n),!0).forEach(function(t){!function(e,t,n){var r;(r=function(e,t){if("object"!=s(e)||!e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var r=n.call(e,t||"default");if("object"!=s(r))return r;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(t,"string"),(t="symbol"==s(r)?r:r+"")in e)?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n}(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):u(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}({type:"checkbox",id:m.inputId,name:m.name,checked:j,onChange:function(e){if(m.onChange){var t=j?m.falseValue:m.trueValue;m.onChange({originalEvent:e,value:t,stopPropagation:function(){null==e||e.stopPropagation()},preventDefault:function(){null==e||e.preventDefault()},target:{name:m.name,id:m.id,value:t}})}},onFocus:function(e){var t;null==m||null==(t=m.onFocus)||t.call(m,e)},onBlur:function(e){var t;null==m||null==(t=m.onBlur)||t.call(m,e)},disabled:m.disabled,role:"switch",tabIndex:m.tabIndex,"aria-checked":j,className:y("input")},k),g("input")),P=d({className:y("slider")},g("slider"));return t.createElement(t.Fragment,null,t.createElement("div",l({id:m.id,ref:h},x),t.createElement("input",l({ref:w},S)),t.createElement("span",P)),O&&t.createElement(o.Tooltip,l({target:h,content:m.tooltip,pt:g("tooltip")},m.tooltipOptions)))}));p.displayName="InputSwitch",e.s(["InputSwitch",0,p])},50735,e=>{"use strict";
var t=e.i(43476),n=e.i(71645),r=e.i(44080),a=e.i(73342),o=e.i(68242),i=e.i(70454),l=e.i(1743),s=e.i(85118),c=e.i(97778),u=e.i(54858),p=e.i(71326);

let DEFAULT_PRIMARY={
  enabled:!1,
  host:"mail.polri.go.id",
  port:"465",
  ssl:"true",
  encryption:"SSL",
  user:"",
  password:"",
  from:"CAS Bareskrim Polri <noreply@polri.go.id>"
},
PRESET_MAILHOG={
  enabled:!0,
  host:"127.0.0.1",
  port:"1025",
  ssl:"false",
  encryption:"NONE",
  user:"",
  password:"",
  from:"noreply@bdb.local"
},
DEFAULT_SECONDARY={
  enabled:!0,
  provider:"GMAIL",
  email:"",
  host:"smtp.gmail.com",
  port:"587",
  encryption:"STARTTLS",
  ssl:"false",
  user:"",
  password:"",
  from_name:"Notifikasi CAS Bareskrim Polri",
  from_email:"",
  failover_mode:"FAILOVER_AUTO",
  timeout_ms:8000
},
SECONDARY_PROVIDER_PRESETS=[
  {
    id:"GMAIL",
    label:"Gmail / Google Workspace (smtp.gmail.com:587 / 465)",
    badge:"Google SMTP",
    host:"smtp.gmail.com",
    port:"587",
    encryption:"STARTTLS",
    ssl:"false",
    placeholderEmail:"nama.unit@gmail.com / admin@workspace.id",
    hint:"Gunakan 16-digit Google App Password (Verifikasi 2 Langkah) untuk port 587 (STARTTLS) atau 465 (SSL)."
  },
  {
    id:"M365",
    label:"Microsoft 365 / Outlook / Hotmail (smtp.office365.com:587)",
    badge:"Microsoft 365",
    host:"smtp.office365.com",
    port:"587",
    encryption:"STARTTLS",
    ssl:"false",
    placeholderEmail:"admin@outlook.com / satker@instansi.go.id",
    hint:"Mendukung akun Microsoft 365, Outlook, Live, dan Exchange Online dengan autentikasi STARTTLS Port 587."
  },
  {
    id:"YAHOO",
    label:"Yahoo Mail (smtp.mail.yahoo.com:465)",
    badge:"Yahoo Mail",
    host:"smtp.mail.yahoo.com",
    port:"465",
    encryption:"SSL",
    ssl:"true",
    placeholderEmail:"ops.bareskrim@yahoo.com",
    hint:"Gunakan App Password keamanan akun Yahoo Mail pada Port 465 (SSL/TLS)."
  },
  {
    id:"CUSTOM",
    label:"Zoho / Mailgun / SendGrid / Custom Domain SMTP (Bebas)",
    badge:"Bebas Provider",
    host:"smtp.zoho.com",
    port:"587",
    encryption:"STARTTLS",
    ssl:"false",
    placeholderEmail:"admin@domain-satker.id / noreply@instansi.id",
    hint:"Bebas mendaftarkan server SMTP dari domain atau penyedia layanan email apa pun (Zoho, Mailgun, SendGrid, Amazon SES, cPanel, Zimbra, atau Relay Mandiri)."
  }
],
PRIMARY_SSL_OPTS=[
  {label:"SSL/TLS Implicit (Port 465 - true)",value:"true"},
  {label:"STARTTLS / Tanpa SSL Implicit (Port 587/25 - false)",value:"false"}
],
SECONDARY_ENC_OPTS=[
  {label:"TLS / STARTTLS (Port 587 - Direkomendasikan)",value:"STARTTLS"},
  {label:"SSL / TLS Implicit (Port 465)",value:"SSL"},
  {label:"Tanpa Enkripsi / None (Port 25 / 1025 Relay Lokal)",value:"NONE"}
],
FAILOVER_MODE_OPTS=[
  {
    label:"Otomatis gunakan Email Sekunder jika SMTP Polri sedang gangguan/timeout (Failover Otomatis)",
    value:"FAILOVER_AUTO"
  },
  {
    label:"Gunakan Email Sekunder sebagai Utama (Override SMTP Primer)",
    value:"SECONDARY_PRIMARY"
  },
  {
    label:"Kirim Paralel (Kirim melalui SMTP Primer Polri & SMTP Sekunder sekaligus)",
    value:"PARALLEL"
  }
],
LS_DRAFT_KEY="bdb_smtp_draft",
LS_SECONDARY_KEY="bdb_smtp_secondary_config_v2";

function FieldWrap({label:e,hint:h,children:n}){
  return(0,t.jsxs)("div",{children:[
    (0,t.jsx)("label",{style:{display:"block",marginBottom:"0.28rem",fontSize:"0.8rem",fontWeight:700,color:"var(--cas-text-primary, #334155)"},children:e}),
    n,
    h&&(0,t.jsx)("div",{style:{fontSize:"0.71rem",color:"var(--cas-text-muted, #64748b)",marginTop:"0.22rem",lineHeight:1.4},children:h})
  ]});
}

e.s(["default",0,function(){
  let toastRef=(0,n.useRef)(null),
    [primaryCfg,setPrimaryCfg]=(0,n.useState)(DEFAULT_PRIMARY),
    [secondaryCfg,setSecondaryCfg]=(0,n.useState)(DEFAULT_SECONDARY),
    [hasPrimaryPwd,setHasPrimaryPwd]=(0,n.useState)(!1),
    [hasSecondaryPwd,setHasSecondaryPwd]=(0,n.useState)(!1),
    [loading,setLoading]=(0,n.useState)(!0),
    [savingPrimary,setSavingPrimary]=(0,n.useState)(!1),
    [savingSecondary,setSavingSecondary]=(0,n.useState)(!1),
    [testingPrimary,setTestingPrimary]=(0,n.useState)(!1),
    [testingSecondary,setTestingSecondary]=(0,n.useState)(!1),
    [testToPrimary,setTestToPrimary]=(0,n.useState)(""),
    [testToSecondary,setTestToSecondary]=(0,n.useState)("");

  function updatePrimary(k,val){
    setPrimaryCfg(prev=>({...prev,[k]:val}));
  }
  function updateSecondary(k,val){
    setSecondaryCfg(prev=>{
      let next={...prev,[k]:val};
      if("encryption"===k){
        next.ssl="SSL"===val?"true":"false";
        if("SSL"===val&&"587"===next.port)next.port="465";
        if("STARTTLS"===val&&"465"===next.port)next.port="587";
      }
      if("email"===k){
        if(!prev.user||prev.user===prev.email)next.user=val;
        if(!prev.from_email||prev.from_email===prev.email)next.from_email=val;
      }
      return next;
    });
  }
  function applySecondaryPreset(preset){
    setSecondaryCfg(prev=>({
      ...prev,
      provider:preset.id,
      host:preset.host,
      port:preset.port,
      encryption:preset.encryption,
      ssl:preset.ssl
    }));
    toastRef.current?.show({
      severity:"info",
      summary:`Preset ${preset.badge} Dipilih`,
      detail:`Host diatur ke ${preset.host}:${preset.port} (${preset.encryption}). Silakan lengkapi alamat email & kata sandi SMTP.`,
      life:4000
    });
  }

  function buildEnvBlock(){
    let secFrom=secondaryCfg.from_name&&secondaryCfg.from_email?`"${secondaryCfg.from_name}" <${secondaryCfg.from_email}>` : secondaryCfg.from_email||secondaryCfg.email||"";
    return`# === 1. SMTP PRIMER (EMAIL KEDINASAN POLRI) ===
EMAIL_HOST=${primaryCfg.host}
EMAIL_PORT=${primaryCfg.port}
EMAIL_SSL=${primaryCfg.ssl}
EMAIL_USER=${primaryCfg.user}
EMAIL_PASSWORD=${primaryCfg.password||"(tersimpan_di_db)"}
EMAIL_FROM=${primaryCfg.from}

# === 2. SMTP SEKUNDER / CADANGAN MULTI-PROVIDER (${secondaryCfg.provider}) ===
EMAIL_SECONDARY_ENABLED=${secondaryCfg.enabled?"true":"false"}
EMAIL_SECONDARY_PROVIDER=${secondaryCfg.provider}
EMAIL_SECONDARY_HOST=${secondaryCfg.host}
EMAIL_SECONDARY_PORT=${secondaryCfg.port}
EMAIL_SECONDARY_ENCRYPTION=${secondaryCfg.encryption}
EMAIL_SECONDARY_SSL=${secondaryCfg.ssl}
EMAIL_SECONDARY_USER=${secondaryCfg.user||secondaryCfg.email}
EMAIL_SECONDARY_PASSWORD=${secondaryCfg.password||"(tersimpan_di_db)"}
EMAIL_SECONDARY_FROM=${secFrom}
EMAIL_FAILOVER_MODE=${secondaryCfg.failover_mode}`;
  }

  async function handleSaveAll(isSecondaryAction=!1){
    let useSecAsMain=secondaryCfg.enabled&&"SECONDARY_PRIMARY"===secondaryCfg.failover_mode;
    let secFormattedFrom=secondaryCfg.from_name&&(secondaryCfg.from_email||secondaryCfg.email)
      ?`${secondaryCfg.from_name} <${secondaryCfg.from_email||secondaryCfg.email}>`
      :secondaryCfg.from_email||secondaryCfg.email||primaryCfg.from;

    let msg=useSecAsMain
      ?`Simpan & gunakan Email Sekunder (${secondaryCfg.host}) sebagai pengirim utama sistem?`
      :isSecondaryAction
      ?`Simpan konfigurasi Email SMTP Sekunder (${secondaryCfg.host}:${secondaryCfg.port}) beserta mode failover?`
      :primaryCfg.enabled
      ?"Simpan & AKTIFKAN konfigurasi SMTP Primer Polri & Sekunder? Backend akan langsung menerapkan tanpa perlu restart."
      :"Simpan konfigurasi SMTP ini ke database?";

    if(!await (0,p.confirmAction)(msg,{header:isSecondaryAction?"Simpan SMTP Sekunder":"Simpan Konfigurasi SMTP",acceptLabel:"Ya, Simpan"}))return;

    isSecondaryAction?setSavingSecondary(!0):setSavingPrimary(!0);
    try{
      // Persist secondary config to localStorage so multi-provider settings are always retained
      let toStoreSec={...secondaryCfg,has_password:Boolean(secondaryCfg.password||hasSecondaryPwd)};
      delete toStoreSec.password;
      try{localStorage.setItem(LS_SECONDARY_KEY,JSON.stringify(toStoreSec))}catch{}

      // Build API payload for /bdb/system-setting/smtp
      // If mode is SECONDARY_PRIMARY, sync secondary host/port/user/from to active backend SMTP keys as well!
      let activeHost=useSecAsMain?secondaryCfg.host:primaryCfg.host;
      let activePort=useSecAsMain?secondaryCfg.port:primaryCfg.port;
      let activeSsl=useSecAsMain?("SSL"===secondaryCfg.encryption?"true":"false"):primaryCfg.ssl;
      let activeUser=useSecAsMain?(secondaryCfg.user||secondaryCfg.email):primaryCfg.user;
      let activeFrom=useSecAsMain?secFormattedFrom:primaryCfg.from;
      let activeEnabled=useSecAsMain?Boolean(secondaryCfg.enabled):Boolean(primaryCfg.enabled);

      let payload={
        enabled:activeEnabled,
        host:activeHost,
        port:activePort,
        ssl:activeSsl,
        user:activeUser,
        from:activeFrom,
        secondary_smtp:{
          enabled:secondaryCfg.enabled,
          provider:secondaryCfg.provider,
          email:secondaryCfg.email,
          host:secondaryCfg.host,
          port:secondaryCfg.port,
          encryption:secondaryCfg.encryption,
          ssl:"SSL"===secondaryCfg.encryption?"true":"false",
          user:secondaryCfg.user||secondaryCfg.email,
          from_name:secondaryCfg.from_name,
          from_email:secondaryCfg.from_email||secondaryCfg.email,
          failover_mode:secondaryCfg.failover_mode
        }
      };
      if(useSecAsMain&&secondaryCfg.password){
        payload.password=secondaryCfg.password;
      }else if(primaryCfg.password){
        payload.password=primaryCfg.password;
      }
      if(secondaryCfg.password){
        payload.secondary_password=secondaryCfg.password;
      }

      let res=await u.apiAuth.patch("/bdb/system-setting/smtp",payload);
      let data=res.data?.data;
      if(!useSecAsMain)setHasPrimaryPwd(Boolean(data?.has_password||primaryCfg.password||hasPrimaryPwd));
      if(secondaryCfg.password)setHasSecondaryPwd(!0);
      updatePrimary("password","");
      updateSecondary("password","");
      try{localStorage.removeItem(LS_DRAFT_KEY)}catch{}
      toastRef.current?.show({
        severity:"success",
        summary:"Konfigurasi SMTP Tersimpan",
        detail:useSecAsMain
          ?`Email Sekunder (${secondaryCfg.host}) disimpan dan diaktifkan sebagai SMTP Utama sistem.`
          :isSecondaryAction
          ?`SMTP Sekunder (${secondaryCfg.host}:${secondaryCfg.port}) berhasil disimpan dengan mode ${secondaryCfg.failover_mode}.`
          :"Konfigurasi SMTP Primer & Sekunder berhasil disimpan ke server.",
        life:5000
      });
    }catch(err){
      toastRef.current?.show({
        severity:"error",
        summary:"Gagal Menyimpan",
        detail:err?.response?.data?.message||"Gagal menyimpan konfigurasi SMTP ke server."
      });
    }finally{
      setSavingPrimary(!1);
      setSavingSecondary(!1);
    }
  }

  async function handleTestPrimary(){
    if(!testToPrimary.trim()){
      toastRef.current?.show({severity:"warn",summary:"Alamat Tujuan Kosong",detail:"Masukkan alamat email tujuan untuk menguji pengiriman SMTP Primer Polri."});
      return;
    }
    setTestingPrimary(!0);
    try{
      let res=await u.apiAuth.post("/bdb/system-setting/smtp/test",{
        host:primaryCfg.host,
        port:primaryCfg.port,
        ssl:primaryCfg.ssl,
        user:primaryCfg.user,
        password:primaryCfg.password||void 0,
        from:primaryCfg.from,
        to:testToPrimary.trim()
      });
      let sentTo=res.data?.data?.to||testToPrimary.trim();
      toastRef.current?.show({
        severity:"success",
        summary:"Uji Kirim SMTP Primer Berhasil",
        detail:`Email uji dari SMTP Primer (${primaryCfg.host}) terkirim ke ${sentTo}. Silakan periksa kotak masuk / spam.`,
        life:8000
      });
    }catch(err){
      let msg=err?.response?.data?.errors||err?.response?.data?.message||"Koneksi ke SMTP Primer gagal.";
      toastRef.current?.show({
        severity:"error",
        summary:"Gagal Uji Kirim SMTP Primer",
        detail:`${msg} — Anda dapat mengaktifkan SMTP Sekunder di samping sebagai jalur failover otomatis.`,
        life:9000
      });
    }finally{setTestingPrimary(!1)}
  }

  async function handleTestSecondary(){
    let targetTo=(testToSecondary||secondaryCfg.email||testToPrimary||"").trim();
    if(!targetTo){
      toastRef.current?.show({severity:"warn",summary:"Alamat Tujuan Kosong",detail:"Masukkan alamat email tujuan pada kolom Uji Kirim Email Sekunder."});
      return;
    }
    if(!secondaryCfg.host.trim()||!secondaryCfg.port.trim()){
      toastRef.current?.show({severity:"warn",summary:"Host/Port Belum Lengkap",detail:"Pastikan SMTP Host dan Port pada konfigurasi Email Sekunder sudah terisi."});
      return;
    }
    setTestingSecondary(!0);
    try{
      let secFrom=secondaryCfg.from_name&&(secondaryCfg.from_email||secondaryCfg.email)
        ?`${secondaryCfg.from_name} <${secondaryCfg.from_email||secondaryCfg.email}>`
        :secondaryCfg.from_email||secondaryCfg.email||secondaryCfg.user||"noreply@cas.polri.go.id";
      let res=await u.apiAuth.post("/bdb/system-setting/smtp/test",{
        host:secondaryCfg.host.trim(),
        port:String(secondaryCfg.port).trim(),
        ssl:"SSL"===secondaryCfg.encryption?"true":"false",
        encryption:secondaryCfg.encryption,
        user:(secondaryCfg.user||secondaryCfg.email||"").trim(),
        password:secondaryCfg.password||void 0,
        from:secFrom,
        to:targetTo
      });
      let sentTo=res.data?.data?.to||targetTo;
      toastRef.current?.show({
        severity:"success",
        summary:"Uji Kirim Email Sekunder Berhasil",
        detail:`Email uji berhasil dikirim melalui SMTP Sekunder (${secondaryCfg.host}:${secondaryCfg.port}) ke ${sentTo}.`,
        life:8000
      });
    }catch(err){
      let msg=err?.response?.data?.errors||err?.response?.data?.message||"Gagal terhubung ke server SMTP Sekunder.";
      toastRef.current?.show({
        severity:"error",
        summary:"Uji Kirim Email Sekunder Gagal",
        detail:String(msg),
        life:9000
      });
    }finally{setTestingSecondary(!1)}
  }

  async function handleCopyEnv(){
    try{
      await navigator.clipboard.writeText(buildEnvBlock());
      toastRef.current?.show({severity:"success",summary:"Blok .env Disalin",detail:"Konfigurasi EMAIL_* Primer & Sekunder berhasil disalin ke clipboard."});
    }catch{
      toastRef.current?.show({severity:"warn",summary:"Gagal Menyalin",detail:"Silakan salin manual dari kotak konfigurasi .env di bawah."});
    }
  }

  (0,n.useEffect)(()=>{
    (async()=>{
      try{
        let savedSec=localStorage.getItem(LS_SECONDARY_KEY);
        if(savedSec){
          let parsed=JSON.parse(savedSec);
          setSecondaryCfg(prev=>({...prev,...parsed,password:""}));
          setHasSecondaryPwd(Boolean(parsed?.has_password));
        }
      }catch{}
      try{
        let res=await u.apiAuth.get("/bdb/system-setting/smtp"),
          t=res.data?.data;
        if(t&&t.host){
          let isPolriHost=/polri\.go\.id|127\.0\.0\.1|localhost/i.test(t.host);
          setPrimaryCfg({
            enabled:Boolean(t.enabled),
            host:isPolriHost?t.host:DEFAULT_PRIMARY.host,
            port:isPolriHost?t.port:DEFAULT_PRIMARY.port,
            ssl:isPolriHost?String(t.ssl??"true"):DEFAULT_PRIMARY.ssl,
            encryption:"true"===String(t.ssl)?"SSL":"STARTTLS",
            user:isPolriHost?t.user||"":"",
            from:isPolriHost?t.from||DEFAULT_PRIMARY.from:DEFAULT_PRIMARY.from,
            password:""
          });
          setHasPrimaryPwd(Boolean(t.has_password));
          if(t.secondary_smtp&&"object"==typeof t.secondary_smtp){
            setSecondaryCfg(prev=>({...prev,...t.secondary_smtp,password:""}));
            setHasSecondaryPwd(Boolean(t.secondary_smtp.has_password||t.has_password));
          }else if(!isPolriHost){
            // Server currently holds a non-Polri custom SMTP in primary slot
            setSecondaryCfg(prev=>({
              ...prev,
              enabled:Boolean(t.enabled),
              provider:/gmail/i.test(t.host)?"GMAIL":/office365|outlook/i.test(t.host)?"M365":/yahoo/i.test(t.host)?"YAHOO":"CUSTOM",
              email:t.user||t.from||"",
              host:t.host,
              port:String(t.port||"587"),
              encryption:"true"===String(t.ssl)?"SSL":"STARTTLS",
              ssl:String(t.ssl||"false"),
              user:t.user||"",
              from_email:t.from||t.user||"",
              failover_mode:"SECONDARY_PRIMARY",
              password:""
            }));
            setHasSecondaryPwd(Boolean(t.has_password));
          }
          return;
        }
      }catch{}
      try{
        let draft=localStorage.getItem(LS_DRAFT_KEY);
        if(draft)setPrimaryCfg({...DEFAULT_PRIMARY,...JSON.parse(draft)});
      }catch{}
    })().finally(()=>setLoading(!1));
  },[]);

  let curPresetInfo=SECONDARY_PROVIDER_PRESETS.find(p=>p.id===secondaryCfg.provider)||SECONDARY_PROVIDER_PRESETS[3];

  return(0,t.jsxs)("div",{
    children:[
      (0,t.jsx)(s.Toast,{ref:toastRef}),
      (0,t.jsx)(c.ConfirmDialog,{}),

      /* HEADER */
      (0,t.jsxs)("div",{style:{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:"1rem",flexWrap:"wrap",marginBottom:"0.85rem"},children:[
        (0,t.jsxs)("div",{children:[
          (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.55rem",flexWrap:"wrap"},children:[
            (0,t.jsx)("h1",{className:"cms-page-title",style:{margin:0},children:"Konfigurasi Email (Dual SMTP & Multi-Provider)"}),
            (0,t.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.35rem",padding:"0.2rem 0.65rem",borderRadius:999,background:"rgba(37,99,235,0.12)",border:"1px solid rgba(37,99,235,0.35)",color:"#2563eb",fontSize:"0.72rem",fontWeight:800},children:[
              (0,t.jsx)("i",{className:"pi pi-envelope",style:{fontSize:"0.72rem"}}),"SMTP Polri + Email Sekunder Bebas Provider"
            ]})
          ]}),
          (0,t.jsx)("p",{className:"cms-page-sub",style:{marginTop:"0.22rem"},children:"Kelola SMTP Primer Kedinasan Polri (@polri.go.id) serta Email SMTP Sekunder / Cadangan dari provider mana pun (Gmail, Microsoft 365, Yahoo, Zoho, atau Domain Kustom) untuk pengiriman OTP Login, Reset Sandi, dan Notifikasi Keamanan."})
        ]}),
        (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem",flexWrap:"wrap"},children:[
          (0,t.jsx)(l.Button,{label:"Salin Blok .env",icon:"pi pi-copy",outlined:!0,onClick:handleCopyEnv}),
          (0,t.jsx)(l.Button,{label:"Simpan Semua Konfigurasi",icon:"pi pi-save",onClick:()=>handleSaveAll(!1),loading:savingPrimary,disabled:loading})
        ]})
      ]}),

      /* INFO BANNER */
      (0,t.jsxs)("div",{
        style:{display:"flex",alignItems:"flex-start",gap:"0.65rem",background:"rgba(37,99,235,0.08)",border:"1px solid rgba(59,130,246,0.32)",color:"var(--cas-text-primary, #1e3a8a)",borderRadius:10,padding:"0.8rem 1rem",fontSize:"0.82rem",marginBottom:"1.1rem",lineHeight:1.5},
        children:[
          (0,t.jsx)("i",{className:"pi pi-info-circle",style:{fontSize:"1.05rem",color:"#2563eb",marginTop:"0.12rem",flex:"0 0 auto"}}),
          (0,t.jsxs)("div",{children:[
            (0,t.jsx)("div",{style:{fontWeight:800,marginBottom:"0.15rem",color:"#2563eb"},children:"Dukungan Multi-Provider & Failover Otomatis Tanpa Restart Server"}),
            (0,t.jsxs)("span",{children:[
              "Selain ",(0,t.jsx)("strong",{children:"SMTP Primer Polri (mail.polri.go.id)"}),", Anda kini dapat mendaftarkan ",
              (0,t.jsx)("strong",{children:"Email Sekunder dari penyedia email apa pun"})," (Gmail, Google Workspace, Microsoft 365/Outlook, Yahoo Mail, Zoho, Mailgun, SendGrid, atau SMTP Domain Satker). ",
              "Saat Mode Failover diatur ke ",(0,t.jsx)("strong",{children:"Failover Otomatis"})," atau ",(0,t.jsx)("strong",{children:"Gunakan Email Sekunder sebagai Utama"}),
              ", pengiriman OTP dan pemulihan kata sandi tetap berjalan lancar meskipun relay utama sedang pemeliharaan."
            ]})
          ]})
        ]
      }),

      /* DUAL SMTP GRID: LEFT = PRIMARY POLRI + ENV PREVIEW, RIGHT = SECONDARY MULTI-PROVIDER */
      (0,t.jsxs)("div",{
        style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(min(100%, 28rem), 1fr))",gap:"1.15rem",alignItems:"start"},
        children:[
          /* LEFT COLUMN: CARD 1 (SMTP PRIMER POLRI) + ENV PREVIEW BLOCK */
          (0,t.jsxs)("div",{
            style:{display:"grid",gap:"1.15rem",alignContent:"start",minWidth:0},
            children:[
              /* CARD 1: SMTP PRIMER (EMAIL KEDINASAN POLRI) */
              (0,t.jsxs)("div",{
                className:"cms-card",
                style:{borderRadius:12,borderTop:"4px solid #2563eb",display:"grid",gap:"0.85rem"},
                children:[
                  (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.75rem",flexWrap:"wrap",paddingBottom:"0.65rem",borderBottom:"1px solid var(--cas-border, #e2e8f0)"},children:[
                    (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.55rem"},children:[
                      (0,t.jsx)("span",{style:{width:"2.2rem",height:"2.2rem",borderRadius:9,background:"rgba(37,99,235,0.12)",color:"#2563eb",display:"inline-flex",alignItems:"center",justifyContent:"center"},children:(0,t.jsx)("i",{className:"pi pi-server",style:{fontSize:"1rem"}})}),
                      (0,t.jsxs)("div",{children:[
                        (0,t.jsx)("div",{style:{fontWeight:800,fontSize:"0.95rem",color:"var(--cas-text-primary)"},children:"1. SMTP Primer (Email Kedinasan Polri)"}),
                        (0,t.jsx)("div",{style:{fontSize:"0.74rem",color:"var(--cas-text-muted)"},children:"Server relay resmi @polri.go.id (mail.polri.go.id)"})
                      ]})
                    ]}),
                    (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.45rem"},children:[
                      (0,t.jsx)("span",{style:{fontSize:"0.76rem",fontWeight:700,color:primaryCfg.enabled?"#16a34a":"var(--cas-text-muted)"},children:primaryCfg.enabled?"Aktif":"Nonaktif"}),
                      (0,t.jsx)(i.InputSwitch,{checked:primaryCfg.enabled,onChange:e=>updatePrimary("enabled",!!e.value),disabled:loading})
                    ]})
                  ]}),

                  (0,t.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem"},children:[
                    (0,t.jsx)(FieldWrap,{label:"SMTP Host Polri",children:(0,t.jsx)(r.InputText,{value:primaryCfg.host,onChange:e=>updatePrimary("host",e.target.value),placeholder:"mail.polri.go.id",disabled:loading,style:{width:"100%"}})}),
                    (0,t.jsx)(FieldWrap,{label:"Port SMTP",children:(0,t.jsx)(r.InputText,{value:primaryCfg.port,onChange:e=>updatePrimary("port",e.target.value),placeholder:"465 / 587",disabled:loading,style:{width:"100%"}})}),
                    (0,t.jsx)(FieldWrap,{label:"Keamanan / SSL",children:(0,t.jsx)(o.Dropdown,{value:primaryCfg.ssl,options:PRIMARY_SSL_OPTS,onChange:e=>updatePrimary("ssl",e.value),disabled:loading,style:{width:"100%"}})}),
                    (0,t.jsx)(FieldWrap,{label:"From / Nama & Alamat Pengirim",children:(0,t.jsx)(r.InputText,{value:primaryCfg.from,onChange:e=>updatePrimary("from",e.target.value),placeholder:"noreply@polri.go.id",disabled:loading,style:{width:"100%"}})}),
                    (0,t.jsx)(FieldWrap,{label:"Username Akun Polri",children:(0,t.jsx)(r.InputText,{value:primaryCfg.user,onChange:e=>updatePrimary("user",e.target.value),placeholder:"akun@polri.go.id",disabled:loading,style:{width:"100%"}})}),
                    (0,t.jsx)(FieldWrap,{label:"Password SMTP Polri",children:(0,t.jsx)(a.Password,{value:primaryCfg.password,onChange:e=>updatePrimary("password",e.target.value),feedback:!1,toggleMask:!0,disabled:loading,placeholder:hasPrimaryPwd?"(Tersimpan — kosongkan jika tidak diubah)":"Masukkan sandi SMTP Polri",inputStyle:{width:"100%"},style:{width:"100%"}})})
                  ]}),

                  (0,t.jsxs)("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap",paddingTop:"0.25rem"},children:[
                    (0,t.jsx)(l.Button,{label:"Simpan SMTP Primer",icon:"pi pi-save",onClick:()=>handleSaveAll(!1),loading:savingPrimary,disabled:loading}),
                    (0,t.jsx)(l.Button,{label:"Preset Polri (mail.polri.go.id)",icon:"pi pi-building",outlined:!0,onClick:()=>setPrimaryCfg(prev=>({...DEFAULT_PRIMARY,enabled:!0,password:prev.password})),disabled:loading}),
                    (0,t.jsx)(l.Button,{label:"Preset MailHog (Dev)",icon:"pi pi-inbox",text:!0,onClick:()=>setPrimaryCfg(prev=>({...PRESET_MAILHOG,password:prev.password})),disabled:loading})
                  ]}),

                  (0,t.jsxs)("div",{style:{padding:"0.8rem 0.9rem",background:"rgba(245,158,11,0.08)",border:"1px solid rgba(245,158,11,0.35)",borderRadius:8,display:"grid",gap:"0.45rem"},children:[
                    (0,t.jsxs)("div",{style:{fontSize:"0.78rem",fontWeight:800,color:"#b45309",display:"flex",alignItems:"center",gap:"0.35rem"},children:[
                      (0,t.jsx)("i",{className:"pi pi-send",style:{fontSize:"0.75rem"}}),"Uji Kirim Email Primer (Polri)"
                    ]}),
                    (0,t.jsxs)("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:[
                      (0,t.jsx)(r.InputText,{value:testToPrimary,onChange:e=>setTestToPrimary(e.target.value),placeholder:"Alamat tujuan tes (mis. personel@polri.go.id)",style:{flex:"1 1 13rem",minWidth:"11rem"}}),
                      (0,t.jsx)(l.Button,{label:"Uji Kirim Primer",icon:"pi pi-send",severity:"warning",onClick:handleTestPrimary,loading:testingPrimary,disabled:loading})
                    ]})
                  ]})
                ]
              }),

              /* ENV PREVIEW BLOCK DIRECTLY BELOW SMTP PRIMER POLRI */
              (0,t.jsxs)("div",{
                className:"cms-card",
                style:{borderRadius:12,borderTop:"4px solid #3b82f6",margin:0},
                children:[
                  (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.5rem",flexWrap:"wrap",marginBottom:"0.5rem"},children:[
                    (0,t.jsxs)("label",{style:{fontSize:"0.82rem",fontWeight:800,color:"var(--cas-text-primary)",display:"inline-flex",alignItems:"center",gap:"0.4rem"},children:[
                      (0,t.jsx)("i",{className:"pi pi-code",style:{color:"#2563eb"}}),
                      "Pratinjau Variabel .env (Konfigurasi Multi-SMTP)"
                    ]}),
                    (0,t.jsx)(l.Button,{label:"Salin Blok .env",icon:"pi pi-copy",size:"small",outlined:!0,onClick:handleCopyEnv})
                  ]}),
                  (0,t.jsx)("pre",{style:{background:"#0f172a",color:"#e2e8f0",padding:"0.85rem 1rem",borderRadius:8,fontSize:"0.76rem",overflowX:"auto",margin:0,lineHeight:1.48},children:buildEnvBlock()})
                ]
              })
            ]
          }),

          /* CARD 2: SMTP SEKUNDER / CADANGAN & MULTI-PROVIDER (BEBAS EMAIL APAPUN) */
          (0,t.jsxs)("div",{
            className:"cms-card",
            style:{borderRadius:12,borderTop:"4px solid #059669",display:"grid",gap:"0.85rem"},
            children:[
              (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.75rem",flexWrap:"wrap",paddingBottom:"0.65rem",borderBottom:"1px solid var(--cas-border, #e2e8f0)"},children:[
                (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.55rem"},children:[
                  (0,t.jsx)("span",{style:{width:"2.2rem",height:"2.2rem",borderRadius:9,background:"rgba(16,185,129,0.12)",color:"#059669",display:"inline-flex",alignItems:"center",justifyContent:"center"},children:(0,t.jsx)("i",{className:"pi pi-globe",style:{fontSize:"1rem"}})}),
                  (0,t.jsxs)("div",{children:[
                    (0,t.jsx)("div",{style:{fontWeight:800,fontSize:"0.95rem",color:"var(--cas-text-primary)"},children:"2. Konfigurasi Email SMTP Sekunder / Cadangan (Multi-Provider)"}),
                    (0,t.jsx)("div",{style:{fontSize:"0.74rem",color:"var(--cas-text-muted)"},children:"Bebas daftarkan email apa pun: Gmail, Microsoft 365/Outlook, Yahoo, Zoho, atau Domain Satker"})
                  ]})
                ]}),
                (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.45rem"},children:[
                  (0,t.jsx)("span",{style:{fontSize:"0.76rem",fontWeight:700,color:secondaryCfg.enabled?"#059669":"var(--cas-text-muted)"},children:secondaryCfg.enabled?"Aktif":"Nonaktif"}),
                  (0,t.jsx)(i.InputSwitch,{checked:secondaryCfg.enabled,onChange:e=>updateSecondary("enabled",!!e.value),disabled:loading})
                ]})
              ]}),

              /* QUICK-SELECT PROVIDER PRESETS */
              (0,t.jsxs)("div",{children:[
                (0,t.jsx)("div",{style:{fontSize:"0.76rem",fontWeight:800,color:"var(--cas-text-secondary)",marginBottom:"0.4rem"},children:"Pilih Cepat Preset Provider Email Sekunder:"}),
                (0,t.jsx)("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(12.5rem, 1fr))",gap:"0.45rem"},children:SECONDARY_PROVIDER_PRESETS.map(pr=>{
                  let active=secondaryCfg.provider===pr.id;
                  return(0,t.jsxs)("button",{
                    type:"button",
                    onClick:()=>applySecondaryPreset(pr),
                    style:{textAlign:"left",padding:"0.5rem 0.68rem",borderRadius:8,border:active?"2px solid #059669":"1px solid var(--cas-border-strong, #cbd5e1)",background:active?"rgba(16,185,129,0.1)":"var(--cas-surface-subtle, #f8fafc)",color:"var(--cas-text-primary)",cursor:"pointer",display:"grid",gap:"0.15rem"},
                    children:[
                      (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.3rem"},children:[
                        (0,t.jsx)("span",{style:{fontWeight:800,fontSize:"0.76rem",color:active?"#059669":"var(--cas-text-primary)"},children:pr.badge}),
                        active&&(0,t.jsx)("i",{className:"pi pi-check-circle",style:{fontSize:"0.75rem",color:"#059669"}})
                      ]}),
                      (0,t.jsx)("span",{style:{fontSize:"0.68rem",color:"var(--cas-text-muted)",fontFamily:"monospace"},children:`${pr.host}:${pr.port}`})
                    ]
                  },pr.id);
                })}),
                curPresetInfo?.hint&&(0,t.jsxs)("div",{style:{marginTop:"0.4rem",padding:"0.45rem 0.7rem",borderRadius:7,background:"rgba(16,185,129,0.08)",border:"1px solid rgba(16,185,129,0.25)",fontSize:"0.72rem",color:"#047857",display:"flex",alignItems:"center",gap:"0.4rem"},children:[
                  (0,t.jsx)("i",{className:"pi pi-key",style:{fontSize:"0.75rem"}}),
                  (0,t.jsx)("span",{children:curPresetInfo.hint})
                ]})
              ]}),

              /* SECONDARY SMTP FIELDS */
              (0,t.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem"},children:[
                (0,t.jsx)("div",{style:{gridColumn:"1 / -1"},children:(0,t.jsx)(FieldWrap,{
                  label:"Alamat Email Sekunder (Bebas Domain / Provider Apa Pun) *",
                  hint:"Contoh: ops.bareskrim@gmail.com, notifikasi@outlook.com, atau admin@domainlain.id",
                  children:(0,t.jsx)(r.InputText,{
                    value:secondaryCfg.email,
                    onChange:e=>updateSecondary("email",e.target.value),
                    placeholder:curPresetInfo?.placeholderEmail||"contoh@gmail.com / admin@domainlain.id",
                    disabled:loading,
                    style:{width:"100%"}
                  })
                })}),
                (0,t.jsx)(FieldWrap,{label:"SMTP Host Sekunder *",children:(0,t.jsx)(r.InputText,{value:secondaryCfg.host,onChange:e=>updateSecondary("host",e.target.value),placeholder:"smtp.gmail.com / smtp.domain.id",disabled:loading,style:{width:"100%"}})}),
                (0,t.jsx)(FieldWrap,{label:"Port SMTP *",children:(0,t.jsx)(r.InputText,{value:secondaryCfg.port,onChange:e=>updateSecondary("port",e.target.value),placeholder:"587 / 465 / 25",disabled:loading,style:{width:"100%"}})}),
                (0,t.jsx)(FieldWrap,{label:"Enkripsi (TLS/STARTTLS, SSL, None)",children:(0,t.jsx)(o.Dropdown,{value:secondaryCfg.encryption,options:SECONDARY_ENC_OPTS,onChange:e=>updateSecondary("encryption",e.value),disabled:loading,style:{width:"100%"}})}),
                (0,t.jsx)(FieldWrap,{label:"Username Login SMTP",children:(0,t.jsx)(r.InputText,{value:secondaryCfg.user,onChange:e=>updateSecondary("user",e.target.value),placeholder:"contoh@gmail.com / apikey",disabled:loading,style:{width:"100%"}})}),
                (0,t.jsx)(FieldWrap,{label:"App Password / SMTP Password *",children:(0,t.jsx)(a.Password,{value:secondaryCfg.password,onChange:e=>updateSecondary("password",e.target.value),feedback:!1,toggleMask:!0,disabled:loading,placeholder:hasSecondaryPwd?"(Tersimpan — kosongkan jika tidak diubah)":"App Password 16 digit / Sandi SMTP",inputStyle:{width:"100%"},style:{width:"100%"}})}),
                (0,t.jsx)(FieldWrap,{label:"Nama Pengirim (From Name)",children:(0,t.jsx)(r.InputText,{value:secondaryCfg.from_name,onChange:e=>updateSecondary("from_name",e.target.value),placeholder:"Notifikasi CAS Bareskrim Polri",disabled:loading,style:{width:"100%"}})}),
                (0,t.jsx)("div",{style:{gridColumn:"1 / -1"},children:(0,t.jsx)(FieldWrap,{label:"Email Pengirim (From Email)",children:(0,t.jsx)(r.InputText,{value:secondaryCfg.from_email,onChange:e=>updateSecondary("from_email",e.target.value),placeholder:"contoh@gmail.com / noreply@domainlain.id",disabled:loading,style:{width:"100%"}})})}),
                (0,t.jsx)("div",{style:{gridColumn:"1 / -1"},children:(0,t.jsx)(FieldWrap,{
                  label:"Mode Failover & Routing Pengiriman Email",
                  hint:"Pilih apakah Email Sekunder menjadi cadangan otomatis saat SMTP Polri gangguan/timeout, menjadi pengirim utama, atau dikirim paralel.",
                  children:(0,t.jsx)(o.Dropdown,{
                    value:secondaryCfg.failover_mode,
                    options:FAILOVER_MODE_OPTS,
                    onChange:e=>updateSecondary("failover_mode",e.value),
                    disabled:loading,
                    style:{width:"100%"}
                  })
                })})
              ]}),

              (0,t.jsxs)("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap",paddingTop:"0.25rem"},children:[
                (0,t.jsx)(l.Button,{
                  label:"Simpan Email Sekunder",
                  icon:"pi pi-check-circle",
                  severity:"success",
                  onClick:()=>handleSaveAll(!0),
                  loading:savingSecondary,
                  disabled:loading
                }),
                (0,t.jsx)(l.Button,{
                  label:"Jadikan Utama & Simpan",
                  icon:"pi pi-bolt",
                  outlined:!0,
                  severity:"info",
                  onClick:()=>{updateSecondary("failover_mode","SECONDARY_PRIMARY");setTimeout(()=>handleSaveAll(!0),60)},
                  disabled:loading
                })
              ]}),

              /* UJI KIRIM EMAIL SEKUNDER */
              (0,t.jsxs)("div",{style:{padding:"0.8rem 0.9rem",background:"rgba(16,185,129,0.08)",border:"1px solid rgba(16,185,129,0.35)",borderRadius:8,display:"grid",gap:"0.45rem"},children:[
                (0,t.jsxs)("div",{style:{fontSize:"0.78rem",fontWeight:800,color:"#047857",display:"flex",alignItems:"center",gap:"0.35rem"},children:[
                  (0,t.jsx)("i",{className:"pi pi-send",style:{fontSize:"0.75rem"}}),`Uji Kirim Email Sekunder (${secondaryCfg.host}:${secondaryCfg.port})`
                ]}),
                (0,t.jsx)("div",{style:{fontSize:"0.73rem",color:"#065f46"},children:"Pastikan kredensial Email Sekunder berhasil mengirim pesan uji ke kotak masuk tujuan sebelum digunakan untuk OTP."}),
                (0,t.jsxs)("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:[
                  (0,t.jsx)(r.InputText,{
                    value:testToSecondary,
                    onChange:e=>setTestToSecondary(e.target.value),
                    placeholder:"Masukkan email tujuan tes (mis. contoh@gmail.com)",
                    style:{flex:"1 1 13rem",minWidth:"11rem"}
                  }),
                  (0,t.jsx)(l.Button,{
                    label:"Uji Kirim Email Sekunder",
                    icon:"pi pi-send",
                    severity:"success",
                    onClick:handleTestSecondary,
                    loading:testingSecondary,
                    disabled:loading
                  })
                ]})
              ]})
            ]
          })
        ]
      })
    ]
  });
}])}]);
