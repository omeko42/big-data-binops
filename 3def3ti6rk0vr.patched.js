(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,71326,97778,e=>{"use strict";var t=e.i(71645),n=e.i(48264),a=e.i(1743),r=e.i(43456),i=e.i(71144),l=e.i(29168),o=e.i(28797),s=e.i(27259),u=e.i(73193);function maskEmail(e){if(!e||"string"!=typeof e)return e||"";let t=e.split("@");if(2!==t.length)return e;let n=t[0],r=t[1];return n.length<=4?n[0]+"***@"+r:n.slice(0,4)+"****@"+r}function maskPhone(e){return!e||"string"!=typeof e||e.length<8?e:e.slice(0,4)+"****"+e.slice(-3)}function c(){return(c=Object.assign.bind()).apply(null,arguments)}function d(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,a=Array(t);n<t;n++)a[n]=e[n];return a}function p(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"u">typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var a,r,i,l,o=[],s=!0,u=!1;try{if(i=(n=n.call(e)).next,0===t){if(Object(n)!==n)return;s=!1}else for(;!(s=(a=i.call(n)).done)&&(o.push(a.value),o.length!==t);s=!0);}catch(e){u=!0,r=e}finally{try{if(!s&&null!=n.return&&(l=n.return(),Object(l)!==l))return}finally{if(u)throw r}}return o}}(e,t)||function(e,t){if(e){if("string"==typeof e)return d(e,t);var n=({}).toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?d(e,t):void 0}}(e,t)||function(){throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function m(e){return(m="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}var f=r.ComponentBase.extend({defaultProps:{__TYPE:"ConfirmDialog",accept:null,acceptClassName:null,acceptIcon:null,acceptLabel:null,appendTo:null,breakpoints:null,children:void 0,className:null,content:null,defaultFocus:"accept",footer:null,icon:null,message:null,onHide:null,reject:null,rejectClassName:null,rejectIcon:null,rejectLabel:null,tagKey:void 0,visible:void 0},css:{classes:{root:"p-confirm-dialog",message:"p-confirm-dialog-message",icon:"p-confirm-dialog-icon",acceptButton:"p-confirm-dialog-accept",rejectButton:function(e){var t=e.getPropValue;return(0,u.classNames)("p-confirm-dialog-reject",{"p-button-text":!t("rejectClassName")})}}}});function y(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,a)}return n}function h(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?y(Object(n),!0).forEach(function(t){!function(e,t,n){var a;(a=function(e,t){if("object"!=m(e)||!e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var a=n.call(e,t||"default");if("object"!=m(a))return a;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(t,"string"),(t="symbol"==m(a)?a:a+"")in e)?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n}(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):y(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}var g=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return(e=h(h({},e),{visible:void 0===e.visible||e.visible})).visible&&o.OverlayService.emit("confirm-dialog",e),{show:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};o.OverlayService.emit("confirm-dialog",h(h(h({},e),t),{visible:!0}))},hide:function(){o.OverlayService.emit("confirm-dialog",{visible:!1})}}},v=t.memo(t.forwardRef(function(e,d){var m,y,g,v,b,x,j,k=(0,l.useMergeProps)(),w=t.useContext(n.PrimeReactContext),S=f.getProps(e,w),O=p(t.useState(S.visible),2),P=O[0],N=O[1],E=p(t.useState(!1),2),C=E[0],I=E[1],T=t.useRef(null),D=t.useRef(!1),_=t.useRef(null),A=function(){var e=S.group;return T.current&&(e=T.current.group),Object.assign({},S,T.current,{group:e})},z=function(e){return A()[e]},M=function(e){for(var t=arguments.length,n=Array(t>1?t-1:0),a=1;a<t;a++)n[a-1]=arguments[a];return u.ObjectUtils.getPropValue(z(e),n)},B=z("acceptLabel")||(0,n.localeOption)("accept"),H=z("rejectLabel")||(0,n.localeOption)("reject"),K={props:S,state:{visible:P}},R=f.setMetaData(K),U=R.ptm,L=R.cx,F=R.isUnstyled;(0,r.useHandleStyle)(f.css.styles,F,{name:"confirmdialog"});var W=function(){D.current||(D.current=!0,M("accept"),q("accept"))},V=function(){D.current||(D.current=!0,M("reject"),q("reject"))},$=function(){A().group===S.group&&(N(!0),D.current=!1,_.current=document.activeElement)},q=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"cancel";P&&("string"!=typeof e&&(e="cancel"),N(!1),M("onHide",e),u.DomHandler.focus(_.current),_.current=null)},Z=function(e){if(e.tagKey===S.tagKey&&(void 0===e.group||e.group===S.group)){var t=P!==e.visible;z("target")===e.target||S.target?t&&(T.current=e,e.visible?$():q()):(q(),T.current=e,I(!0))}};t.useEffect(function(){S.visible?$():q()},[S.visible]),t.useEffect(function(){return S.target||S.message||o.OverlayService.on("confirm-dialog",Z),function(){o.OverlayService.off("confirm-dialog",Z)}},[S.target]),(0,l.useUpdateEffect)(function(){C&&$()},[C]),(0,l.useUnmountEffect)(function(){o.OverlayService.off("confirm-dialog",Z)}),t.useImperativeHandle(d,function(){return{props:S,confirm:Z}});var G=(m=A(),y=u.ObjectUtils.getJSXElement(z("message"),m),g=k({className:L("icon")},U("icon")),v=u.IconUtils.getJSXIcon(z("icon"),h({},g),{props:m}),b=function(){var e=z("defaultFocus"),n=(0,u.classNames)("p-confirm-dialog-accept",z("acceptClassName")),r=(0,u.classNames)("p-confirm-dialog-reject",{"p-button-text":!z("rejectClassName")},z("rejectClassName")),i=k({label:H,autoFocus:"reject"===e,icon:z("rejectIcon"),className:(0,u.classNames)(z("rejectClassName"),L("rejectButton",{getPropValue:z})),onClick:V,pt:U("rejectButton"),unstyled:S.unstyled,__parentMetadata:{parent:K}},U("rejectButton")),l=k({label:B,autoFocus:void 0===e||"accept"===e,icon:z("acceptIcon"),className:(0,u.classNames)(z("acceptClassName"),L("acceptButton")),onClick:W,pt:U("acceptButton"),unstyled:S.unstyled,__parentMetadata:{parent:K}},U("acceptButton")),o=t.createElement(t.Fragment,null,t.createElement(a.Button,i),t.createElement(a.Button,l));if(z("footer")){var s={accept:W,reject:V,acceptClassName:n,rejectClassName:r,acceptLabel:B,rejectLabel:H,element:o,props:A()};return u.ObjectUtils.getJSXElement(z("footer"),s)}return o}(),x=k({className:L("message")},U("message")),j=k({visible:P,className:(0,u.classNames)(z("className"),L("root")),footer:b,onHide:q,breakpoints:z("breakpoints"),pt:m.pt,unstyled:S.unstyled,appendTo:z("appendTo"),__parentMetadata:{parent:K}},f.getOtherProps(m)),t.createElement(i.Dialog,c({},j,{content:null==e?void 0:e.content}),v,t.createElement("span",x,y)));return t.createElement(s.Portal,{element:G,appendTo:z("appendTo")})}));v.displayName="ConfirmDialog",e.s(["ConfirmDialog",0,v,"confirmDialog",0,g],97778),e.s(["confirmAction",0,function(e,t){return new Promise(n=>{let a=!1,r=e=>{a||(a=!0,n(e))};g({message:e,header:t?.header||"Konfirmasi",icon:t?.danger?"pi pi-exclamation-triangle":"pi pi-question-circle",acceptLabel:t?.acceptLabel||"Ya, lanjutkan",rejectLabel:"Batal",acceptClassName:t?.danger?"p-button-danger":void 0,accept:()=>r(!0),reject:()=>r(!1),onHide:()=>r(!1)})})}],71326)},40623,e=>{"use strict";var t=e.i(71645),n=e.i(48264),a=e.i(43456),r=e.i(29168),i=e.i(27259),l=e.i(73193);function o(){return(o=Object.assign.bind()).apply(null,arguments)}function s(e){return(s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function u(e,t,n){var a;return(a=function(e,t){if("object"!=s(e)||!e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var a=n.call(e,t||"default");if("object"!=s(a))return a;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(t,"string"),(t="symbol"==s(a)?a:a+"")in e)?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function c(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,a=Array(t);n<t;n++)a[n]=e[n];return a}function d(e,t){if(e){if("string"==typeof e)return c(e,t);var n=({}).toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?c(e,t):void 0}}function p(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"u">typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var a,r,i,l,o=[],s=!0,u=!1;try{if(i=(n=n.call(e)).next,0===t){if(Object(n)!==n)return;s=!1}else for(;!(s=(a=i.call(n)).done)&&(o.push(a.value),o.length!==t);s=!0);}catch(e){u=!0,r=e}finally{try{if(!s&&null!=n.return&&(l=n.return(),Object(l)!==l))return}finally{if(u)throw r}}return o}}(e,t)||d(e,t)||function(){throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var m=a.ComponentBase.extend({defaultProps:{__TYPE:"Tooltip",appendTo:null,at:null,autoHide:!0,autoZIndex:!0,baseZIndex:0,className:null,closeOnEscape:!1,content:null,disabled:!1,event:null,hideDelay:0,hideEvent:"mouseleave",id:null,mouseTrack:!1,mouseTrackLeft:5,mouseTrackTop:5,my:null,onBeforeHide:null,onBeforeShow:null,onHide:null,onShow:null,position:"right",showDelay:0,showEvent:"mouseenter",showOnDisabled:!1,style:null,target:null,updateDelay:0,children:void 0},css:{classes:{root:function(e){var t=e.positionState,n=e.classNameState;return(0,l.classNames)("p-tooltip p-component",u({},"p-tooltip-".concat(t),!0),n)},arrow:"p-tooltip-arrow",text:"p-tooltip-text"},styles:"\n@layer primereact {\n    .p-tooltip {\n        position: absolute;\n        padding: .25em .5rem;\n        /* #3687: Tooltip prevent scrollbar flickering */\n        top: -9999px;\n        left: -9999px;\n    }\n    \n    .p-tooltip.p-tooltip-right,\n    .p-tooltip.p-tooltip-left {\n        padding: 0 .25rem;\n    }\n    \n    .p-tooltip.p-tooltip-top,\n    .p-tooltip.p-tooltip-bottom {\n        padding:.25em 0;\n    }\n    \n    .p-tooltip .p-tooltip-text {\n       white-space: pre-line;\n       word-break: break-word;\n    }\n    \n    .p-tooltip-arrow {\n        position: absolute;\n        width: 0;\n        height: 0;\n        border-color: transparent;\n        border-style: solid;\n    }\n    \n    .p-tooltip-right .p-tooltip-arrow {\n        top: 50%;\n        left: 0;\n        margin-top: -.25rem;\n        border-width: .25em .25em .25em 0;\n    }\n    \n    .p-tooltip-left .p-tooltip-arrow {\n        top: 50%;\n        right: 0;\n        margin-top: -.25rem;\n        border-width: .25em 0 .25em .25rem;\n    }\n    \n    .p-tooltip.p-tooltip-top {\n        padding: .25em 0;\n    }\n    \n    .p-tooltip-top .p-tooltip-arrow {\n        bottom: 0;\n        left: 50%;\n        margin-left: -.25rem;\n        border-width: .25em .25em 0;\n    }\n    \n    .p-tooltip-bottom .p-tooltip-arrow {\n        top: 0;\n        left: 50%;\n        margin-left: -.25rem;\n        border-width: 0 .25em .25rem;\n    }\n\n    .p-tooltip-target-wrapper {\n        display: inline-flex;\n    }\n}\n",inlineStyles:{arrow:function(e){var t=e.context;return{top:t.bottom?"0":!t.right&&!t.left&&(t.right||t.left||t.top||t.bottom)?null:"50%",bottom:t.top?"0":null,left:!t.right&&(t.right||t.left||t.top||t.bottom)?t.top||t.bottom?"50%":null:"0",right:t.left?"0":null}}}}});function f(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,a)}return n}var y=t.memo(t.forwardRef(function(e,s){var y=(0,r.useMergeProps)(),h=t.useContext(n.PrimeReactContext),g=m.getProps(e,h),v=p(t.useState(!1),2),b=v[0],x=v[1],j=p(t.useState(g.position||"right"),2),k=j[0],w=j[1],S=p(t.useState(""),2),O=S[0],P=S[1],N=p(t.useState(!1),2),E=N[0],C=N[1],I=b&&g.closeOnEscape,T=(0,r.useDisplayOrder)("tooltip",I),D={props:g,state:{visible:b,position:k,className:O},context:{right:"right"===k,left:"left"===k,top:"top"===k,bottom:"bottom"===k}},_=m.setMetaData(D),A=_.ptm,z=_.cx,M=_.sx,B=_.isUnstyled;(0,a.useHandleStyle)(m.css.styles,B,{name:"tooltip"}),(0,r.useGlobalOnEscapeKey)({callback:function(){es()},when:I,priority:[r.ESC_KEY_HANDLING_PRIORITIES.TOOLTIP,T]});var H=t.useRef(null),K=t.useRef(null),R=t.useRef(null),U=t.useRef(null),L=t.useRef(!0),F=t.useRef({}),W=t.useRef(null),V=p((0,r.useResizeListener)({listener:function(e){l.DomHandler.isTouchDevice()||es(e)}}),2),$=V[0],q=V[1],Z=p((0,r.useOverlayScrollListener)({target:R.current,listener:function(e){es(e)},when:b}),2),G=Z[0],J=Z[1],Y=function(e){return et(e,"mousetrack")||g.mouseTrack},X=function(e){return"true"===et(e,"disabled")||en(e,"disabled")||g.disabled},Q=function(e){return et(e,"showondisabled")||g.showOnDisabled},ee=function(){return et(R.current,"autohide")||g.autoHide},et=function(e,t){return en(e,"data-pr-".concat(t))?e.getAttribute("data-pr-".concat(t)):null},en=function(e,t){return e&&e.hasAttribute(t)},ea=function(e){var t=[et(e,"showevent")||g.showEvent],n=[et(e,"hideevent")||g.hideEvent];if(Y(e))t=["mousemove"],n=["mouseleave"];else{var a=et(e,"event")||g.event;"focus"===a&&(t=["focus"],n=["blur"]),"both"===a&&(t=["focus","mouseenter"],n=E?["blur"]:["mouseleave","blur"])}return{showEvents:t,hideEvents:n}},er=function(e){return et(e,"position")||k},ei=function(e,t){if(K.current){var n=et(e,"tooltip")||g.content;n?(K.current.innerHTML="",K.current.appendChild(document.createTextNode(n)),t()):g.children&&t()}},el=function(e){ei(R.current,function(){var t=W.current,a=t.pageX,r=t.pageY;g.autoZIndex&&!l.ZIndexUtils.get(H.current)&&l.ZIndexUtils.set("tooltip",H.current,h&&h.autoZIndex||n.default.autoZIndex,g.baseZIndex||h&&h.zIndex.tooltip||n.default.zIndex.tooltip),H.current.style.left="",H.current.style.top="",ee()&&(H.current.style.pointerEvents="none");var i=Y(R.current)||"mouse"===e;(i&&!U.current||i)&&(U.current={width:l.DomHandler.getOuterWidth(H.current),height:l.DomHandler.getOuterHeight(H.current)}),eu(R.current,{x:a,y:r},e)})},eo=function(e){e.type&&"focus"===e.type&&C(!0),R.current=e.currentTarget;var t,n=X(R.current);t=Q(R.current)&&n?R.current.firstChild:R.current,(g.content||et(t,"tooltip")||g.children)&&!n&&(W.current=e,b?eh("updateDelay",el):eg(g.onBeforeShow,{originalEvent:e,target:R.current})&&eh("showDelay",function(){x(!0),eg(g.onShow,{originalEvent:e,target:R.current})}))},es=function(e){e&&"blur"===e.type&&C(!1),ev(),b?eg(g.onBeforeHide,{originalEvent:e,target:R.current})&&eh("hideDelay",function(){(ee()||!1!==L.current)&&(l.ZIndexUtils.clear(H.current),l.DomHandler.removeClass(H.current,"p-tooltip-active"),x(!1),eg(g.onHide,{originalEvent:e,target:R.current}))}):g.onBeforeHide||ey("hideDelay")||x(!1)},eu=function(e,t,n){var a=0,r=0,i=n||k;if((Y(e)||"mouse"==i)&&t){var o={width:l.DomHandler.getOuterWidth(H.current),height:l.DomHandler.getOuterHeight(H.current)};a=t.x,r=t.y;var s={top:et(e,"mousetracktop")||g.mouseTrackTop,left:et(e,"mousetrackleft")||g.mouseTrackLeft},u=s.top,c=s.left;switch(i){case"left":a-=o.width+c,r-=o.height/2-u;break;case"right":case"mouse":a+=c,r-=o.height/2-u;break;case"top":a-=o.width/2-c,r-=o.height+u;break;case"bottom":a-=o.width/2-c,r+=u}a<=0||U.current.width>o.width?(H.current.style.left="0px",H.current.style.right=window.innerWidth-o.width-a+"px"):(H.current.style.right="",H.current.style.left=a+"px"),H.current.style.top=r+"px",l.DomHandler.addClass(H.current,"p-tooltip-active")}else{var d=l.DomHandler.findCollisionPosition(i),p=et(e,"my")||g.my||d.my,m=et(e,"at")||g.at||d.at;H.current.style.padding="0px",l.DomHandler.flipfitCollision(H.current,e,p,m,function(e){var t=e.at,n=t.x,a=t.y,r=e.my.x,i=g.at?"center"!==n&&n!==r?n:a:e.at["".concat(d.axis)];H.current.style.padding="",w(i),ec(i),l.DomHandler.addClass(H.current,"p-tooltip-active")})}},ec=function(e){if(H.current){var t=getComputedStyle(H.current);"left"===e?H.current.style.left=parseFloat(t.left)-2*parseFloat(t.paddingLeft)+"px":"top"===e&&(H.current.style.top=parseFloat(t.top)-2*parseFloat(t.paddingTop)+"px")}},ed=function(){ee()||(L.current=!1)},ep=function(e){ee()||(L.current=!0,es(e))},em=function(e){if(e){var t=ea(e),n=t.showEvents,a=t.hideEvents,r=eb(e);n.forEach(function(e){return null==r?void 0:r.addEventListener(e,eo)}),a.forEach(function(e){return null==r?void 0:r.addEventListener(e,es)})}},ef=function(e){if(e){var t=ea(e),n=t.showEvents,a=t.hideEvents,r=eb(e);n.forEach(function(e){return null==r?void 0:r.removeEventListener(e,eo)}),a.forEach(function(e){return null==r?void 0:r.removeEventListener(e,es)})}},ey=function(e){return et(R.current,e.toLowerCase())||g[e]},eh=function(e,t){ev();var n=ey(e);n?F.current["".concat(e)]=setTimeout(function(){return t()},n):t()},eg=function(e){if(e){for(var t=arguments.length,n=Array(t>1?t-1:0),a=1;a<t;a++)n[a-1]=arguments[a];var r=e.apply(void 0,n);return void 0===r&&(r=!0),r}return!0},ev=function(){Object.values(F.current).forEach(function(e){return clearTimeout(e)})},eb=function(e){if(e){if(Q(e)){if(!e.hasWrapper){var t,n,a=document.createElement("div");return"INPUT"===e.nodeName?l.DomHandler.addMultipleClasses(a,"p-tooltip-target-wrapper p-inputwrapper"):l.DomHandler.addClass(a,"p-tooltip-target-wrapper"),e.parentNode.insertBefore(a,e),a.appendChild(e),e.hasWrapper=!0,a}return e.parentElement}return e.hasWrapper&&((n=e.parentElement).replaceWith.apply(n,function(e){if(Array.isArray(e))return c(e)}(t=e.parentElement.childNodes)||function(e){if("u">typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(t)||d(t)||function(){throw TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()),delete e.hasWrapper),e}return null},ex=function(e){ek(e),ej(e)},ej=function(e){ew(e||g.target,em)},ek=function(e){ew(e||g.target,ef)},ew=function(e,t){if(e=l.ObjectUtils.getRefElement(e))if(l.DomHandler.isElement(e))t(e);else{var n=function(e){l.DomHandler.find(document,e).forEach(function(e){t(e)})};e instanceof Array?e.forEach(function(e){n(e)}):n(e)}};if((0,r.useMountEffect)(function(){b&&R.current&&X(R.current)&&es()}),(0,r.useUpdateEffect)(function(){return ej(),function(){ek()}},[eo,es,g.target]),(0,r.useUpdateEffect)(function(){if(b){var e=er(R.current),t=et(R.current,"classname");e!==k&&w(e),t!==O&&P(t),el(e),$(),G()}else w(g.position||"right"),P(""),R.current=null,U.current=null,L.current=!0;return function(){q(),J()}},[b]),(0,r.useUpdateEffect)(function(){var e=er(R.current);b&&"mouse"!==e&&eh("updateDelay",function(){ei(R.current,function(){eu(R.current)})})},[g.content]),(0,r.useUnmountEffect)(function(){es(),l.ZIndexUtils.clear(H.current)}),t.useImperativeHandle(s,function(){return{props:g,updateTargetEvents:ex,loadTargetEvents:ej,unloadTargetEvents:ek,show:eo,hide:es,getElement:function(){return H.current},getTarget:function(){return R.current}}}),b){var eS,eO,eP,eN,eE,eC=(eS=R.current,eO=!(g.content||et(eS,"tooltip")),eP=y({id:g.id,className:(0,l.classNames)(g.className,z("root",{positionState:k,classNameState:O})),style:g.style,role:"tooltip","aria-hidden":b,onMouseEnter:function(e){return ed()},onMouseLeave:function(e){return ep(e)}},m.getOtherProps(g),A("root")),eN=y({className:z("arrow"),style:M("arrow",function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?f(Object(n),!0).forEach(function(t){u(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):f(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}({},D))},A("arrow")),eE=y({className:z("text")},A("text")),t.createElement("div",o({ref:H},eP),t.createElement("div",eN),t.createElement("div",o({ref:K},eE),eO&&g.children)));return t.createElement(i.Portal,{element:eC,appendTo:g.appendTo,visible:!0})}return null}));y.displayName="Tooltip",e.s(["Tooltip",0,y])},83128,e=>{"use strict";var t=e.i(73193);function n(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,a=Array(t);n<t;n++)a[n]=e[n];return a}var a={DEFAULT_MASKS:{pint:/[\d]/,int:/[\d\-]/,pnum:/[\d\.]/,money:/[\d\.\s,]/,num:/[\d\-\.]/,hex:/[0-9a-f]/i,email:/[a-z0-9_\.\-@]/i,alpha:/[a-z_]/i,alphanum:/[a-z0-9_]/i},getRegex:function(e){return a.DEFAULT_MASKS[e]?a.DEFAULT_MASKS[e]:e},onBeforeInput:function(e,n,a){!a&&t.DomHandler.isAndroid()&&this.validateKey(e,e.data,n)},onKeyPress:function(e,n,a){a||t.DomHandler.isAndroid()||e.ctrlKey||e.altKey||e.metaKey||this.validateKey(e,e.key,n)},onPaste:function(e,t,a){if(!a){var r,i=this.getRegex(t);((function(e){if(Array.isArray(e))return n(e)})(r=e.clipboardData.getData("text"))||function(e){if("u">typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(r)||function(e){if(e){if("string"==typeof e)return n(e,void 0);var t=({}).toString.call(e).slice(8,-1);return"Object"===t&&e.constructor&&(t=e.constructor.name),"Map"===t||"Set"===t?Array.from(e):"Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?n(e,void 0):void 0}}(r)||function(){throw TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()).forEach(function(t){if(!i.test(t))return e.preventDefault(),!1})}},validateKey:function(e,t,n){null==t||t.length<=2&&(this.getRegex(n).test(t)||e.preventDefault())},validate:function(e,t){var n=e.target.value,a=!0,r=this.getRegex(t);return n&&!r.test(n)&&(a=!1),a}};e.s(["KeyFilter",0,a])},44080,e=>{"use strict";var t=e.i(71645),n=e.i(48264),a=e.i(43456),r=e.i(29168),i=e.i(83128),l=e.i(40623),o=e.i(73193);function s(){return(s=Object.assign.bind()).apply(null,arguments)}function u(e){return(u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}var c=a.ComponentBase.extend({defaultProps:{__TYPE:"InputText",__parentMetadata:null,children:void 0,className:null,invalid:!1,variant:null,keyfilter:null,onBeforeInput:null,onInput:null,onKeyDown:null,onPaste:null,tooltip:null,tooltipOptions:null,validateOnly:!1,iconPosition:null},css:{classes:{root:function(e){var t=e.props,n=e.isFilled,a=e.context;return(0,o.classNames)("p-inputtext p-component",{"p-disabled":t.disabled,"p-filled":n,"p-invalid":t.invalid,"p-variant-filled":t.variant?"filled"===t.variant:a&&"filled"===a.inputStyle})}}}});function d(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,a)}return n}function p(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?d(Object(n),!0).forEach(function(t){!function(e,t,n){var a;(a=function(e,t){if("object"!=u(e)||!e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var a=n.call(e,t||"default");if("object"!=u(a))return a;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(t,"string"),(t="symbol"==u(a)?a:a+"")in e)?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n}(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):d(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}var m=t.memo(t.forwardRef(function(e,u){var d=(0,r.useMergeProps)(),m=t.useContext(n.PrimeReactContext),f=c.getProps(e,m),y=c.setMetaData(p(p({props:f},f.__parentMetadata),{},{context:{disabled:f.disabled,iconPosition:f.iconPosition}})),h=y.ptm,g=y.cx,v=y.isUnstyled;(0,a.useHandleStyle)(c.css.styles,v,{name:"inputtext",styled:!0});var b=t.useRef(u);t.useEffect(function(){o.ObjectUtils.combinedRefs(b,u)},[b,u]);var x=t.useMemo(function(){return o.ObjectUtils.isNotEmpty(f.value)||o.ObjectUtils.isNotEmpty(f.defaultValue)},[f.value,f.defaultValue]),j=o.ObjectUtils.isNotEmpty(f.tooltip);t.useEffect(function(){var e;x||null!=(e=b.current)&&e.value?o.DomHandler.addClass(b.current,"p-filled"):o.DomHandler.removeClass(b.current,"p-filled")},[f.disabled,x]);var k=d({className:(0,o.classNames)(f.className,g("root",{context:m,isFilled:x})),autoComplete:f.autoComplete,onBeforeInput:function(e){f.onBeforeInput&&f.onBeforeInput(e),f.keyfilter&&i.KeyFilter.onBeforeInput(e,f.keyfilter,f.validateOnly)},onInput:function(e){var t=e.target,n=!0;f.keyfilter&&f.validateOnly&&(n=i.KeyFilter.validate(e,f.keyfilter)),f.onInput&&f.onInput(e,n),o.ObjectUtils.isNotEmpty(t.value)?o.DomHandler.addClass(t,"p-filled"):o.DomHandler.removeClass(t,"p-filled")},onKeyDown:function(e){f.onKeyDown&&f.onKeyDown(e),f.keyfilter&&i.KeyFilter.onKeyPress(e,f.keyfilter,f.validateOnly)},onPaste:function(e){f.onPaste&&f.onPaste(e),f.keyfilter&&i.KeyFilter.onPaste(e,f.keyfilter,f.validateOnly)}},c.getOtherProps(f),h("root"));return t.createElement(t.Fragment,null,t.createElement("input",s({ref:b},k)),j&&t.createElement(l.Tooltip,s({target:b,content:f.tooltip,pt:h("tooltip")},f.tooltipOptions)))}));m.displayName="InputText",e.s(["InputText",0,m])},28797,e=>{"use strict";var t=(0,e.i(73193).EventBus)();e.s(["OverlayService",0,t])},53729,e=>{"use strict";var t=e.i(71645),n=e.i(48264),a=e.i(43456),r=e.i(29168),i=e.i(73193);function l(e){return(l="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function o(e,t,n){var a;return(a=function(e,t){if("object"!=l(e)||!e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var a=n.call(e,t||"default");if("object"!=l(a))return a;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(t,"string"),(t="symbol"==l(a)?a:a+"")in e)?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var s=a.ComponentBase.extend({defaultProps:{__TYPE:"Tag",value:null,severity:null,rounded:!1,icon:null,style:null,className:null,children:void 0},css:{classes:{value:"p-tag-value",icon:"p-tag-icon",root:function(e){var t=e.props;return(0,i.classNames)("p-tag p-component",o(o({},"p-tag-".concat(t.severity),null!==t.severity),"p-tag-rounded",t.rounded))}},styles:"\n@layer primereact {\n    .p-tag {\n        display: inline-flex;\n        align-items: center;\n        justify-content: center;\n    }\n    \n    .p-tag-icon,\n    .p-tag-value,\n    .p-tag-icon.pi {\n        line-height: 1.5;\n    }\n    \n    .p-tag.p-tag-rounded {\n        border-radius: 10rem;\n    }\n}\n"}});function u(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,a)}return n}var c=t.forwardRef(function(e,l){var c=(0,r.useMergeProps)(),d=t.useContext(n.PrimeReactContext),p=s.getProps(e,d),m=s.setMetaData({props:p}),f=m.ptm,y=m.cx,h=m.isUnstyled;(0,a.useHandleStyle)(s.css.styles,h,{name:"tag"});var g=t.useRef(null),v=c({className:y("icon")},f("icon")),b=i.IconUtils.getJSXIcon(p.icon,function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?u(Object(n),!0).forEach(function(t){o(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):u(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}({},v),{props:p});t.useImperativeHandle(l,function(){return{props:p,getElement:function(){return g.current}}});var x=c({ref:g,className:(0,i.classNames)(p.className,y("root")),style:p.style},s.getOtherProps(p),f("root")),j=c({className:y("value")},f("value"));return t.createElement("span",x,b,t.createElement("span",j,p.value),t.createElement("span",null,p.children))});c.displayName="Tag",e.s(["Tag",0,c])},72382,e=>{"use strict";let t=(0,e.i(56420).default)("eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);e.s(["Eye",0,t],72382)},15281,e=>{"use strict";let t=(0,e.i(56420).default)("pencil",[["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",key:"1a8usu"}],["path",{d:"m15 5 4 4",key:"1mk7zo"}]]);e.s(["Pencil",0,t],15281)},53138,e=>{"use strict";let t=(0,e.i(56420).default)("triangle-alert",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);e.s(["AlertTriangle",0,t],53138)},51757,e=>{"use strict";let t=(0,e.i(56420).default)("circle-check",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);e.s(["CheckCircle2",0,t],51757)},84026,e=>{"use strict";let t=(0,e.i(56420).default)("shield-check",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);e.s(["ShieldCheck",0,t],84026)},74410,e=>{"use strict";let t=(0,e.i(56420).default)("shield-off",[["path",{d:"m2 2 20 20",key:"1ooewy"}],["path",{d:"M5 5a1 1 0 0 0-1 1v7c0 5 3.5 7.5 7.67 8.94a1 1 0 0 0 .67.01c2.35-.82 4.48-1.97 5.9-3.71",key:"1jlk70"}],["path",{d:"M9.309 3.652A12.252 12.252 0 0 0 11.24 2.28a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1v7a9.784 9.784 0 0 1-.08 1.264",key:"18rp1v"}]]);e.s(["ShieldOff",0,t],74410)},82303,e=>{"use strict";let t=(0,e.i(56420).default)("users",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["path",{d:"M16 3.128a4 4 0 0 1 0 7.744",key:"16gr8j"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}]]);e.s(["Users",0,t],82303)},29210,e=>{"use strict";let t=(0,e.i(56420).default)("landmark",[["path",{d:"M10 18v-7",key:"wt116b"}],["path",{d:"M11.119 2.205a2 2 0 0 1 1.762 0l7.84 3.846A.5.5 0 0 1 20.5 7h-17a.5.5 0 0 1-.22-.949z",key:"yxxwt6"}],["path",{d:"M14 18v-7",key:"vav6t3"}],["path",{d:"M18 18v-7",key:"aexdmj"}],["path",{d:"M3 22h18",key:"8prr45"}],["path",{d:"M6 18v-7",key:"1ivflk"}]]);e.s(["Landmark",0,t],29210)},46387,e=>{"use strict";let t=(0,e.i(56420).default)("building-2",[["path",{d:"M10 12h4",key:"a56b0p"}],["path",{d:"M10 8h4",key:"1sr2af"}],["path",{d:"M14 21v-3a2 2 0 0 0-4 0v3",key:"1rgiei"}],["path",{d:"M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2",key:"secmi2"}],["path",{d:"M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16",key:"16ra0t"}]]);e.s(["Building2",0,t],46387)},20865,e=>{"use strict";let t=(0,e.i(56420).default)("map-pin",[["path",{d:"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",key:"1r0f0z"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]]);e.s(["MapPin",0,t],20865)},49514,e=>{"use strict";var t=e.i(71645),n=e.i(48264),a=e.i(43456),r=e.i(29168),i=e.i(44080),l=e.i(73193);function o(){return(o=Object.assign.bind()).apply(null,arguments)}function s(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,a=Array(t);n<t;n++)a[n]=e[n];return a}function u(e,t){if(e){if("string"==typeof e)return s(e,t);var n=({}).toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?s(e,t):void 0}}function c(e){return function(e){if(Array.isArray(e))return s(e)}(e)||function(e){if("u">typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||u(e)||function(){throw TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function d(e){return(d="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}var p=a.ComponentBase.extend({defaultProps:{__TYPE:"InputOtp",__parentMetadata:null,className:null,modelValue:!1,invalid:!1,disabled:!1,readOnly:!1,variant:null,tabIndex:null,length:4,mask:!1,integerOnly:!1},css:{classes:{root:"p-inputotp p-component",input:"p-inputotp-input"}}});function m(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,a)}return n}function f(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?m(Object(n),!0).forEach(function(t){!function(e,t,n){var a;(a=function(e,t){if("object"!=d(e)||!e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var a=n.call(e,t||"default");if("object"!=d(a))return a;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(t,"string"),(t="symbol"==d(a)?a:a+"")in e)?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n}(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):m(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}var y=t.default.memo(t.default.forwardRef(function(e,s){var d,m,y,h=(0,t.useRef)(s),g=(0,r.useMergeProps)(),v=(0,t.useContext)(n.PrimeReactContext),b=p.getProps(e,v),x=p.setMetaData(f(f({props:b},b.__parentMetadata),{},{context:{disabled:b.disabled}})),j=x.ptm,k=x.cx,w=x.isUnstyled;(0,a.useHandleStyle)(p.css.styles,w,{name:"inputotp"});var S=b.value?null==(m=b.value)||null==(m=m.toString())||null==(y=m.split)?void 0:y.call(m,""):Array(b.length),O=function(e){if(Array.isArray(e))return e}(d=(0,t.useState)(S))||function(e){var t=null==e?null:"u">typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=t){var n,a,r,i,l=[],o=!0,s=!1;try{r=(t=t.call(e)).next,!1;for(;!(o=(n=r.call(t)).done)&&(l.push(n.value),2!==l.length);o=!0);}catch(e){s=!0,a=e}finally{try{if(!o&&null!=t.return&&(i=t.return(),Object(i)!==i))return}finally{if(s)throw a}}return l}}(d)||u(d,2)||function(){throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}(),P=O[0],N=O[1],E=function(e){var t=e.nextElementSibling;if(t)return"INPUT"===t.nodeName?t:E(t)},C=function(e){var t=e.previousElementSibling;if(t)return"INPUT"===t.nodeName?t:C(t)},I=function(e){var t=E(e.target);t&&(t.focus(),t.select())},T=function(e){var t=C(e.target);t&&(t.focus(),t.select())},D=function(e,t){var n;null==b||null==(n=b.onChange)||n.call(b,{originalEvent:e,value:t.join("")})},_=function(e,t){var n=e.target.value,a=c(P);a[t]=n,N(a=(a=a.join(""))?a.split(""):Array(b.length)),D(e,a)},A=function(e,t){b.disabled||b.readOnly||"insertFromPaste"!==e.nativeEvent.inputType&&(_(e,t),"deleteContentBackward"===e.nativeEvent.inputType?T(e):"insertText"===e.nativeEvent.inputType&&I(e))},z=function(e){if(!b.disabled&&!b.readOnly){var t=e.clipboardData.getData("text");if(t.length){var n=t.substring(0,b.length+1);if(!b.integerOnly||!isNaN(n)){var a=n.split("");N(a),D(e,a)}}}},M=function(e){var t;e.target.select(),null==b||null==(t=b.focus)||t.call(b,e)},B=function(e){var t;null==b||null==(t=b.blur)||t.call(b,e)},H=function(e){if(!b.disabled&&!b.readOnly&&!e.altKey&&!e.ctrlKey&&!e.metaKey)switch(e.code){case"ArrowLeft":T(e),e.preventDefault();break;case"ArrowRight":I(e),e.preventDefault();break;case"Delete":e.preventDefault();var t,n=Number(e.target.id);Number.isNaN(n)||K(P,b.length)||(_(f(f({},e),{},{target:f(f({},e.target),{},{value:""})}),n),I(e));break;case"Backspace":(null==(t=e.target)||null==(t=t.value)?void 0:t.length)===0&&(T(e),e.preventDefault());break;case"ArrowUp":case"ArrowDown":e.preventDefault();break;case"Tab":case"NumpadEnter":case"Enter":break;default:var a=e.target,r=a.selectionStart!==a.selectionEnd,i=P.join("").length>=b.length;(!b.integerOnly||/^[0-9]$/.test(e.key))&&(!i||"Delete"===e.code||r)||e.preventDefault()}},K=function(e,t){return e.length===t&&e.every(function(e){return""===e||null==e})};(0,r.useUpdateEffect)(function(){var e,t;N(b.value?null==(e=b.value)||null==(e=e.toString())||null==(t=e.split)?void 0:t.call(e,""):Array(b.length))},[b.value]);var R=function(e){if(e<=0)return[];var a=b.length-e,r={onInput:function(e){return A(e,a)},onKeyDown:H,onFocus:M,onBlur:B,onPaste:z},s={value:P[a]||"",type:null!=b&&b.mask?"password":"text",variant:null==b?void 0:b.variant,readOnly:null==b?void 0:b.readOnly,disabled:null==b?void 0:b.disabled,tabIndex:null==b?void 0:b.tabIndex,autoFocus:(null==b?void 0:b.autoFocus)&&0===a,"aria-label":(0,n.ariaLabel)("otpLabel",{0:a+1}),"data-index":a,className:k("input")};return[null!=b&&b.inputTemplate?l.ObjectUtils.getJSXElement(null==b?void 0:b.inputTemplate,{events:r,props:s}):t.default.createElement(i.InputText,o({},s,r,{invalid:null==b?void 0:b.invalid,unstyled:null==b?void 0:b.unstyled,pt:j("input"),inputMode:null!=b&&b.integerOnly?"numeric":"text",key:a}))].concat(c(R(e-1))).map(function(e,n){return t.default.createElement(t.default.Fragment,{key:n},e)})},U=g({className:k("root"),ref:h,style:null==b?void 0:b.style},j("root"));return t.default.createElement("div",U,R(b.length))}));y.displayName="InputOtp",e.s(["InputOtp",0,y])},96315,e=>{"use strict";let t=(0,e.i(56420).default)("mail",[["path",{d:"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7",key:"132q7q"}],["rect",{x:"2",y:"4",width:"20",height:"16",rx:"2",key:"izxlao"}]]);e.s(["Mail",0,t],96315)},75387,e=>{"use strict";let t=(0,e.i(56420).default)("phone",[["path",{d:"M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",key:"9njp5v"}]]);e.s(["Phone",0,t],75387)},80860,e=>{"use strict";let t=(0,e.i(56420).default)("eye-off",[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]]);e.s(["EyeOff",0,t],80860)},81193,e=>{"use strict";let t=(0,e.i(56420).default)("briefcase",[["path",{d:"M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16",key:"jecpp"}],["rect",{width:"20",height:"14",x:"2",y:"6",rx:"2",key:"i6l2r4"}]]);e.s(["Briefcase",0,t],81193)},71136,e=>{"use strict";let t=(0,e.i(56420).default)("hash",[["line",{x1:"4",x2:"20",y1:"9",y2:"9",key:"4lhtct"}],["line",{x1:"4",x2:"20",y1:"15",y2:"15",key:"vyu0kd"}],["line",{x1:"10",x2:"8",y1:"3",y2:"21",key:"1ggp8o"}],["line",{x1:"16",x2:"14",y1:"3",y2:"21",key:"weycgp"}]]);e.s(["Hash",0,t],71136)},58925,e=>{"use strict";let t=(0,e.i(56420).default)("key-round",[["path",{d:"M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z",key:"1s6t7t"}],["circle",{cx:"16.5",cy:"7.5",r:".5",fill:"currentColor",key:"w0ekpg"}]]);e.s(["KeyRound",0,t],58925)},6537,e=>{"use strict";let t=(0,e.i(56420).default)("lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]);e.s(["Lock",0,t],6537)},4384,2879,e=>{"use strict";var t=e.i(43476),n=e.i(44080),a=e.i(51757),r=e.i(53138);e.s(["default",0,function({value:e,onChange:i,onBlur:l,status:o,placeholder:s,id:c,name:u,autoComplete:m}){return(0,t.jsxs)("div",{style:{position:"relative"},children:[(0,t.jsx)(n.InputText,{id:c||("fld-profile-avail-"+(n.InputText._k=(n.InputText._k||0)+1)),name:u||("field_profile_avail_"+(n.InputText._k)),autoComplete:m||"off",value:e,onChange:e=>i(e.target.value),onBlur:e=>l(e.target.value),placeholder:s,className:"taken"===o?"p-invalid":void 0,style:{width:"100%",paddingRight:"2.2rem"}}),(0,t.jsxs)("span",{style:{position:"absolute",right:"0.6rem",top:"50%",transform:"translateY(-50%)",display:"flex",pointerEvents:"none"},children:["checking"===o&&(0,t.jsx)("i",{className:"pi pi-spin pi-spinner",style:{color:"#94a3b8",fontSize:"0.95rem"}}),"available"===o&&(0,t.jsx)(a.CheckCircle2,{size:16,style:{color:"#16a34a"}}),"taken"===o&&(0,t.jsx)(r.AlertTriangle,{size:16,style:{color:"#dc2626"}})]})]})}],4384);var i=e.i(71645),l=e.i(54858);e.s(["useAvailabilityCheck",0,function(e){let[t,n]=(0,i.useState)({}),[a,r]=(0,i.useState)({}),o=(0,i.useRef)({}),s=(0,i.useRef)({}),u=(0,i.useCallback)(e=>{o.current[e]&&clearTimeout(o.current[e]),n(t=>({...t,[e]:"idle"})),r(t=>({...t,[e]:void 0}))},[]),c=(0,i.useCallback)(()=>{Object.keys(o.current).forEach(e=>o.current[e]&&clearTimeout(o.current[e])),n({}),r({})},[]),d=(0,i.useCallback)(async(t,a)=>{let i=(s.current[t]||0)+1;s.current[t]=i,n(e=>({...e,[t]:"checking"}));try{let o=await l.apiAuth.get("/user/check-availability",{params:{field:t,value:a,exclude:e||void 0}});if(s.current[t]!==i)return;let u=o.data?.data;u?.available===!1?(n(e=>({...e,[t]:"taken"})),r(e=>({...e,[t]:`Sudah terdaftar${u.satker_nama?` oleh satker ${u.satker_nama}`:""}. Butuh bantuan? Hubungi Pusat Bantuan.`}))):(n(e=>({...e,[t]:"available"})),r(e=>({...e,[t]:void 0})))}catch{s.current[t]===i&&n(e=>({...e,[t]:"idle"}))}},[e]),p=(0,i.useCallback)((e,t)=>{(o.current[e]&&clearTimeout(o.current[e]),t.trim())?o.current[e]=setTimeout(()=>d(e,t),600):u(e)},[u,d]),m=(0,i.useCallback)((e,t)=>{(o.current[e]&&clearTimeout(o.current[e]),t.trim())?d(e,t):u(e)},[u,d]),f=Object.values(t).some(e=>"taken"===e);return{status:t,message:a,onChangeDebounced:p,onBlurNow:m,reset:u,resetAll:c,hasBlockingIssue:f}}],2879)},34850,e=>{"use strict";function maskEmail(e){if(!e||"string"!=typeof e)return e||"";let t=e.split("@");if(t.length<2){return e.length<=4?e[0]+"***":e.slice(0,2)+"****"+e.slice(-2)}let n=t[0],r=t.slice(1).join("@");return n.length<=4?n[0]+"***@"+r:n.slice(0,4)+"****@"+r}function maskPhone(e){return!e||"string"!=typeof e||e.length<8?e:e.slice(0,4)+"****"+e.slice(-3)}globalThis.maskEmail=maskEmail;globalThis.maskPhone=maskPhone;var t=e.i(43476),n=e.i(71645),a=e.i(53729),r=e.i(71144),i=e.i(44080),l=e.i(49514),o=e.i(1743),s=e.i(85118),u=e.i(97778),c=e.i(54858),d=e.i(71326),p=e.i(4384),m=e.i(2879),f=e.i(75387),y=e.i(56420);let h=(0,y.default)("id-card",[["path",{d:"M16 10h2",key:"8sgtl7"}],["path",{d:"M16 14h2",key:"epxaof"}],["path",{d:"M6.17 15a3 3 0 0 1 5.66 0",key:"n6f512"}],["circle",{cx:"9",cy:"11",r:"2",key:"yxgjnd"}],["rect",{x:"2",y:"5",width:"20",height:"14",rx:"2",key:"qneu4z"}]]),g=(0,y.default)("award",[["path",{d:"m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526",key:"1yiouv"}],["circle",{cx:"12",cy:"8",r:"6",key:"1vp47v"}]]);var v=e.i(81193),b=e.i(46387),x=e.i(96315);let j=(0,y.default)("log-in",[["path",{d:"m10 17 5-5-5-5",key:"1bsop3"}],["path",{d:"M15 12H3",key:"6jk70r"}],["path",{d:"M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4",key:"u53s6r"}]]);var k=e.i(20865),w=e.i(58925),S=e.i(71136),O=e.i(84026),P=e.i(74410),N=e.i(6537);let E=(0,y.default)("lock-open",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 9.9-1",key:"1mm8w8"}]]),C=(0,y.default)("badge-check",[["path",{d:"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",key:"3c2336"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);var I=e.i(15281),T=e.i(72382),D=e.i(80860),_=e.i(82303);let A=(0,y.default)("globe",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",key:"13o1zl"}],["path",{d:"M2 12h20",key:"9i4pu4"}]]),z=(0,y.default)("compass",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z",key:"9ktpf1"}]]);
let IconHeart=(0,y.default)("heart",[["path",{d:"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",key:"heart"}]]);
let IconMessageSquare=(0,y.default)("message-square",[["path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",key:"18vll8"}]]);
let IconRepeat=(0,y.default)("repeat",[["path",{d:"m17 2 4 4-4 4",key:"15tewc"}],["path",{d:"M3 11v-1a4 4 0 0 1 4-4h14",key:"84vlhf"}],["path",{d:"m7 22-4-4 4-4",key:"1wqimy"}],["path",{d:"M21 13v1a4 4 0 0 1-4 4H3",key:"1vljha"}]]);
let IconBookmark=(0,y.default)("bookmark",[["path",{d:"m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z",key:"1ed56d"}]]);
let IconTrash2=(0,y.default)("trash-2",[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]]);
let IconLock=(0,y.default)("lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]);
let IconGlobe=(0,y.default)("globe",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",key:"13o1zl"}],["path",{d:"M2 12h20",key:"9i4pu4"}]]);
let IconEdit=(0,y.default)("edit",[["path",{d:"M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",key:"10e17c"}],["path",{d:"M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",key:"1k3h2b"}]]);
var M=e.i(29210);let B={superadmin:"#dc2626",admin_binops:"#b45309",operator:"#1d4ed8",viewer:"#0f766e"},H={superadmin:"Superadmin",admin_binops:"Admin/Binops",operator:"Operator",viewer:"Viewer"};function K(e){let t=(e||"").trim();return t&&"-"!==t?t:void 0}let R={name:"",email:"",nrp:"",pangkat:"",jabatan:"",satuan:"",no_hp:"",email_polri:"",username:"",is_pns:!1,social_media:{},photo_url:""},U={alamat:"",provinsi:"",kabupaten_kota:"",kecamatan:"",desa:"",kode_pos:"",longitude:"",latitude:"",jumlah_penduduk:""},L=["operator","admin_binops"];function F({label:e,required:n,hint:a,htmlFor:h,children:r}){let fId=h||(Array.isArray(r)?(r[0]?.props?.inputId||r[0]?.props?.id):(r?.props?.inputId||r?.props?.id));return(0,t.jsxs)("div",{children:[(0,t.jsxs)("label",{htmlFor:fId,style:{display:"block",marginBottom:"0.25rem",fontSize:"0.8rem",fontWeight:700,color:"var(--cas-text-primary, #f1f5f9)"},children:[e," ",n&&(0,t.jsx)("span",{style:{color:"#dc2626"},children:"*"})," ",a&&(0,t.jsxs)("span",{style:{color:"#94a3b8",fontWeight:400},children:["(",a,")"]})]}),r]})}function W({icon:e,label:n,value:a,last:r}){return(0,t.jsxs)("div",{className:"profile-row",style:{borderBottom:r?"none":"1px solid var(--cas-border, rgba(255,255,255,0.08))"},children:[(0,t.jsx)("span",{className:"profile-row-icon",style:{background:"rgba(56,189,248,0.1)",color:"#38bdf8"},children:e}),(0,t.jsxs)("div",{style:{minWidth:0,flex:1},children:[(0,t.jsx)("div",{className:"profile-row-label",style:{color:"var(--cas-text-secondary, #94a3b8)",fontSize:"0.72rem",fontWeight:700},children:n}),(0,t.jsx)("div",{className:`profile-row-value${a?"":" is-empty"}`,style:{color:a?"var(--cas-text-primary, #f8fafc)":"var(--cas-text-secondary, #64748b)",fontSize:"0.88rem",fontWeight:600},children:a||"Belum diisi"})]})]})}function V({icon:e,label:n,active:r,last:i,hint:l,action:o}){return(0,t.jsxs)("div",{className:"profile-row",style:{borderBottom:i?"none":"1px solid var(--cas-border, rgba(255,255,255,0.08))"},children:[(0,t.jsx)("span",{className:`profile-row-icon${r?" is-active":""}`,style:{background:r?"rgba(34,197,94,0.15)":"rgba(255,255,255,0.06)",color:r?"#4ade80":"#94a3b8"},children:e}),(0,t.jsxs)("span",{className:"profile-row-value",style:{flex:1,color:"var(--cas-text-primary, #f8fafc)",fontWeight:600},children:[n,l&&(0,t.jsxs)("span",{style:{marginLeft:"0.5rem",fontSize:"0.72rem",fontWeight:500,color:"var(--cas-text-secondary, #94a3b8)"},children:["(",l,")"]})]}),(0,t.jsx)(a.Tag,{value:r?"Aktif":"Nonaktif",severity:r?"success":"danger",icon:r?(0,t.jsx)(E,{id:"fld-3def3ti6rk0vr-2",name:"field_3def3ti6rk0vr_2",size:11,style:{marginRight:4}}):(0,t.jsx)(N.Lock,{size:11,style:{marginRight:4}})}),o]})}e.s(["default",0,function(){let e=(0,n.useRef)(null),[a,y]=(0,n.useState)(null),[N,E]=(0,n.useState)(!0),[$,q]=(0,n.useState)(!1),[Z,G]=(0,n.useState)(R),
[isReadOnlyMode,setIsReadOnlyMode]=(0,n.useState)(!1),
[mySelf,setMySelf]=(0,n.useState)(null),
[eDropdownOpen,setDropdownOpen]=(0,n.useState)(!1),
[eContactModal,setContactModal]=(0,n.useState)(!1),
[eBioModal,setBioModal]=(0,n.useState)(!1),
[eBio,setBio]=(0,n.useState)(''),
[eSavingBio,setSavingBio]=(0,n.useState)(!1),

[eExpModal,setExpModal]=(0,n.useState)(!1),
[eEditingExpIndex,setEditingExpIndex]=(0,n.useState)(-1),
[eExpForm,setExpForm]=(0,n.useState)({title:'',company:'',period:'',location:'',description:''}),
[eSavingExp,setSavingExp]=(0,n.useState)(!1),

[eEduModal,setEduModal]=(0,n.useState)(!1),
[eEditingEduIndex,setEditingEduIndex]=(0,n.useState)(-1),
[eEduForm,setEduForm]=(0,n.useState)({school:'',degree:'',field:'',year:'',description:''}),
[eSavingEdu,setSavingEdu]=(0,n.useState)(!1),

[eAddSectionModal,setAddSectionModal]=(0,n.useState)(!1),
[eBannerModal,setBannerModal]=(0,n.useState)(!1),
[eBannerTheme,setBannerTheme]=(0,n.useState)('linear-gradient(135deg, #090d16 0%, #0f172a 45%, #1e293b 85%, #0369a1 100%)'),
[eLightboxMedia,setLightboxMedia]=(0,n.useState)(null),
[eCustomBannerLoading,setCustomBannerLoading]=(0,n.useState)(!1),
[eRawBanner,setRawBanner]=(0,n.useState)(null),
[eBannerZoom,setBannerZoom]=(0,n.useState)(1),
[eBannerPanX,setBannerPanX]=(0,n.useState)(0),
[eBannerPanY,setBannerPanY]=(0,n.useState)(0),

[eSettingsModal,setSettingsModal]=(0,n.useState)(!1),
[eSettingsTab,setSettingsTab]=(0,n.useState)('keamanan'),

[eNetworkModal,setNetworkModal]=(0,n.useState)(!1),
[eNetworkConnectedTarget,setNetworkConnectedTarget]=(0,n.useState)(null),
[eNetworkModalTitle,setNetworkModalTitle]=(0,n.useState)(''),
[eNetworkTab,setNetworkTab]=(0,n.useState)('connected'),
[eNetworkSearch,setNetworkSearch]=(0,n.useState)(''),
[eNetworkSatkerFilter,setNetworkSatkerFilter]=(0,n.useState)('all'),
[eNetworkUsers,setNetworkUsers]=(0,n.useState)([]),
[eNetworkLoading,setNetworkLoading]=(0,n.useState)(!1),
[eNetworkPage,setNetworkPage]=(0,n.useState)(1),
[eNetworkTotal,setNetworkTotal]=(0,n.useState)(0),
[eNetworkTotalPages,setNetworkTotalPages]=(0,n.useState)(1),
[eProfilePreviewModal,setProfilePreviewModal]=(0,n.useState)(!1),
[ePreviewUser,setPreviewUser]=(0,n.useState)(null),
[eConnLoading,setConnLoading]=(0,n.useState)(!1),
[eModalConnLoading,setModalConnLoading]=(0,n.useState)({}),

[eFeedTab,setFeedTab]=(0,n.useState)('mine'),
[ePersonalPosts,setPersonalPosts]=(0,n.useState)([]),[ePostPage,setPostPage]=(0,n.useState)(1),
[expandedPersonalPosts,setExpandedPersonalPosts]=(0,n.useState)({}),
[ePersonalLikesModal,setPersonalLikesModal]=(0,n.useState)(!1),
[ePersonalLikesList,setPersonalLikesList]=(0,n.useState)([]),
[eLoadingPersonalLikes,setLoadingPersonalLikes]=(0,n.useState)(!1),
[eLoadingFeed,setLoadingFeed]=(0,n.useState)(!1),
[ePostText,setPostText]=(0,n.useState)(''),
[ePostAudience,setPostAudience]=(0,n.useState)('public'),
[ePostSubmitting,setPostSubmitting]=(0,n.useState)(!1),
[eHoverReactId,setHoverReactId]=(0,n.useState)(null),
[eActiveCommentPostId,setActiveCommentPostId]=(0,n.useState)(null),
[ePostComments,setPostComments]=(0,n.useState)({}),
[eCommentInputs,setCommentInputs]=(0,n.useState)({}),
[eSubmittingComment,setSubmittingComment]=(0,n.useState)(!1),
[eSocUrls,setSocUrls]=(0,n.useState)([""]),[ePhotoModal,setPhotoModal]=(0,n.useState)(!1),[ePhotoPreview,setPhotoPreview]=(0,n.useState)(null),[eRawPhoto,setRawPhoto]=(0,n.useState)(null),[ePhotoZoom,setPhotoZoom]=(0,n.useState)(1),[ePhotoPanX,setPhotoPanX]=(0,n.useState)(0),[ePhotoPanY,setPhotoPanY]=(0,n.useState)(0),[ePhotoLoading,setPhotoLoading]=(0,n.useState)(!1),[eTotpModal,setTotpModal]=(0,n.useState)(!1),[ePasskeyDevices,setPasskeyDevices]=(0,n.useState)([]),[ePasskeyModal,setPasskeyModal]=(0,n.useState)(!1),[ePasskeyLoading,setPasskeyLoading]=(0,n.useState)(!1),[eRevokeTarget,setRevokeTarget]=(0,n.useState)(null),[eRevokeCode,setRevokeCode]=(0,n.useState)(""),[eRevokeError,setRevokeError]=(0,n.useState)(""),[eRevokeLoading,setRevokeLoading]=(0,n.useState)(!1),[eRevokeShowPass,setRevokeShowPass]=(0,n.useState)(!1),[eTotpData,setTotpData]=(0,n.useState)(null),[eTotpInputCode,setTotpInputCode]=(0,n.useState)(""),[eTotpEmailOtp,setTotpEmailOtp]=(0,n.useState)(""),[eTotpLoading,setTotpLoading]=(0,n.useState)(!1),[eTotpError,setTotpError]=(0,n.useState)(""),[eEmailChoice,setEmailChoice]=(0,n.useState)("dinas"),[eOtpCooldown,setOtpCooldown]=(0,n.useState)(0),[eOtpAttempts,setOtpAttempts]=(0,n.useState)(0),[eOtpVerifyFails,setOtpVerifyFails]=(0,n.useState)(0),[eExistingPassword,setExistingPassword]=(0,n.useState)(""),[eOtpStep,setOtpStep]=(0,n.useState)(1),[eOtpSentTo,setOtpSentTo]=(0,n.useState)(""),[eTotpStep,setTotpStep]=(0,n.useState)(1),[eShowPassword,setShowPassword]=(0,n.useState)(!1),[eDisableModal,setDisableModal]=(0,n.useState)(!1),[eDisableTarget,setDisableTarget]=(0,n.useState)(""),[eDisableCode,setDisableCode]=(0,n.useState)(""),[eDisableLoading,setDisableLoading]=(0,n.useState)(!1),[eDisableError,setDisableError]=(0,n.useState)(""),[J,Y]=(0,n.useState)(!1),X=(0,m.useAvailabilityCheck)(a?.id),[Q,ee]=(0,n.useState)(!1),[et,en]=(0,n.useState)("enable_pin"),[ea,er]=(0,n.useState)(""),[ei,el]=(0,n.useState)(""),[eo,es]=(0,n.useState)(""),[eu,ec]=(0,n.useState)(""),[ed,ep]=(0,n.useState)(!1),[em,ef]=(0,n.useState)(!1),[ey,eh]=(0,n.useState)(!1),[eg,ev]=(0,n.useState)(""),[eb,ex]=(0,n.useState)(null),[ej,ek]=(0,n.useState)(!1),[ew,eS]=(0,n.useState)(""),[eO,eP]=(0,n.useState)(!1),[eN,eE]=(0,n.useState)(U),[eC,eI]=(0,n.useState)(!1);function formatCallsign(rawCallsign, authorId, username) {
  var idStr = String(authorId || '');
  /* dynamic handle */
  var c = String(rawCallsign || '').trim().replace(/^@/, '');
  var invalid = ['personil', 'null', 'undefined', 'admin', 'user', 'none', '-'];
  if (c && !invalid.includes(c.toLowerCase()) && !/^\d{6,10}$/.test(c) && !c.startsWith('user_')) {
    return '@' + c;
  }
  var u = String(username || '').trim().replace(/^@/, '');
  if (u && !invalid.includes(u.toLowerCase()) && !/^\d{6,10}$/.test(u) && !u.startsWith('user_')) {
    return '@' + u;
  }
  if (c && !invalid.includes(c.toLowerCase()) && !/^\d{6,10}$/.test(c)) {
    return '@' + c;
  }
  if (!idStr && !rawCallsign && !username) {
    try {
      var lu = (typeof localStorage !== 'undefined') ? JSON.parse(localStorage.getItem('user') || '{}') : {};
      /* dynamic handle */
      if (lu.callsign && !String(lu.callsign).startsWith('user_')) return '@' + String(lu.callsign).replace(/^@/, '');
      if (lu.name && String(lu.name).trim()) return lu.name;
      if (lu.username && !String(lu.username).startsWith('user_')) return '@' + String(lu.username).replace(/^@/, '');
    } catch(e) {}
    return '@personil';
  }
  var seed = idStr || 'polri';
  var num = 0;
  for (var i = 0; i < seed.length; i++) num = (num * 31 + seed.charCodeAt(i)) % 100000;
  var code = Math.abs((num * 9301 + 49297) % 65536).toString(16).padStart(4, '0');
  return '@user_' + (idStr || '0') + code;
}

function toTitleCase(str) {
  if (!str) return '';
  return String(str)
    .toLowerCase()
    .replace(/(?:^|\s|-|\/)[a-z]/g, function(c) {
      return c.toUpperCase();
    })
    .replace(/\bS\.h\b/gi, 'S.H')
    .replace(/\bM\.h\b/gi, 'M.H')
    .replace(/\bS\.i\.k\b/gi, 'S.I.K')
    .replace(/\bPolri\b/gi, 'Polri')
    .replace(/\bPolda\b/gi, 'Polda')
    .replace(/\bPolres\b/gi, 'Polres')
    .replace(/\bPolsek\b/gi, 'Polsek')
    .replace(/\bSat\b/gi, 'Sat')
    .replace(/\bDit\b/gi, 'Dit')
    .replace(/\bRes\b/gi, 'Res')
    .replace(/\bReskrim\b/gi, 'Reskrim')
    .replace(/\bNarkoba\b/gi, 'Narkoba');
}

function formatCount(num) {
  var n = Number(num || 0);
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(n);
}

if (typeof globalThis !== 'undefined') {
  globalThis.formatCallsign = formatCallsign;
  globalThis.formatCount = formatCount;
}
function timeAgo(dateStr) {
  if (!dateStr) return '';
  const now = new Date();
  const past = new Date(dateStr);
  const diff = Math.floor((now.getTime() - past.getTime()) / 60000);
  if (diff < 1) return 'Baru saja';
  if (diff < 60) return diff + ' menit lalu';
  const h = Math.floor(diff / 60);
  if (h < 24) return h + ' jam lalu';
  const d = Math.floor(h / 24);
  return d + ' hari lalu';
}

function getVerificationBadge(role, isUserOne, userId, username) {
  var SUPER_IDS = ['1', '320', '15403', '15404', '16568', '16576', '16594'];
  if (isUserOne || SUPER_IDS.includes(String(userId)) || username === 'omeko11' || username === 'Yud08') return { color: '#f59e0b', label: 'Superadmin Terverifikasi', role: 'superadmin' };
  var r = String(role || '').toLowerCase().trim();
  if (r === 'superadmin') return { color: '#f59e0b', label: 'Superadmin Terverifikasi', role: 'superadmin' };
  if (r === 'admin_binops' || r === 'admin binops' || r === 'binops') return { color: '#10b981', label: 'Admin Binops Terverifikasi', role: 'admin_binops' };
  if (r === 'operator') return { color: '#3b82f6', label: 'Operator Terverifikasi', role: 'operator' };
  if (r === 'viewer') return { color: '#3b82f6', label: 'Viewer Terverifikasi', role: 'viewer' };
  return null;
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
          border:"2px solid var(--cas-bg-surface, #0f172a)",
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


async function eT() {
  var sp = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  var uToken = sp ? (sp.get('id') || sp.get('uid') || sp.get('u')) : null;
  var viewedUser = null;
  try {
    var rawView = sessionStorage.getItem('cas_view_user');
    if (rawView) viewedUser = JSON.parse(rawView);
  } catch(e) {}

  var myUser = null;
  try {
    var myRes = await c.apiAuth.get("/user/me/profile");
    var apiData = myRes.data?.data || myRes.data;
    if (apiData && !Array.isArray(apiData) && (apiData.id || apiData.username)) {
      myUser = Object.assign({}, apiData);
    }
    try {
      var authRes = await c.apiAuth.get("/Authentication/user");
      var authData = authRes.data?.data || authRes.data;
      if (authData && !Array.isArray(authData) && (authData.id || authData.username)) {
        myUser = Object.assign({}, authData, myUser || {}, {
          pin_required: Boolean(authData.pin_required || myUser?.pin_required),
          local_password_enabled: Boolean(authData.local_password_enabled || myUser?.local_password_enabled || true)
        });
      }
    } catch(eAuth) {}
  } catch(e) {}

  if (!myUser || !myUser.id) {
    try {
      var lu = JSON.parse(localStorage.getItem('user') || 'null');
      if (lu && lu.id) myUser = Object.assign({}, lu, myUser || {});
    } catch(e) {}
    if (!myUser) myUser = {};
  }
  if (myUser) {
    try {
      var cachedSoc = localStorage.getItem('cas_profile_social_' + myUser.id);
      var cachedBanner = localStorage.getItem('cas_banner_' + myUser.id);
      if (cachedSoc) {
        var parsedSoc = JSON.parse(cachedSoc);
        myUser.social_media = Object.assign({}, parsedSoc, myUser.social_media || {});
      }
      if (cachedBanner && (!myUser.social_media || !myUser.social_media.banner_theme)) {
        myUser.social_media = myUser.social_media || {};
        myUser.social_media.banner_theme = cachedBanner;
      }
    } catch(eCache) {}
    setMySelf(myUser);
  }

  var targetQuery = uToken || (sp && (sp.has('u') || sp.has('id')) ? null : (viewedUser?.id || viewedUser?.handle || viewedUser?.username));
  if (!targetQuery) {
    try {
      sessionStorage.removeItem('cas_view_user');
      if (window.history && window.history.replaceState && sp && (sp.has('u') || sp.has('id'))) {
        window.history.replaceState({}, '', '/cms/profile');
      }
    } catch(e) {}
    setIsReadOnlyMode(!1);
    y(myUser);
    return myUser;
  }

  var cleanTarget = String(targetQuery).replace(/^@/, '').trim();
  var isSelf = myUser && (String(myUser.id) === cleanTarget || 
                         (myUser.username && String(myUser.username).toLowerCase() === cleanTarget.toLowerCase()) || 
                         (myUser.callsign && String(myUser.callsign).toLowerCase() === cleanTarget.toLowerCase()));

  if (!isSelf && cleanTarget) {
    try {
      var targetRes = await c.apiAuth.get('/bdb/jukrah/network/profile/' + encodeURIComponent(cleanTarget));
      var targetData = targetRes.data?.data || null;
      if (!targetData && viewedUser?.id && String(viewedUser.id) !== cleanTarget) {
        targetRes = await c.apiAuth.get('/bdb/jukrah/network/profile/' + encodeURIComponent(viewedUser.id));
        targetData = targetRes.data?.data || null;
      }
      if (targetData) {
        setIsReadOnlyMode(!0);
        try {
          var cleanHandle = targetData.callsign || targetData.username || ('user_' + targetData.id);
          cleanHandle = String(cleanHandle).replace(/^@/, '');
          sessionStorage.setItem('cas_view_user', JSON.stringify({ id: targetData.id, username: targetData.username, callsign: targetData.callsign, handle: cleanHandle }));
        } catch(e) {}
        y(targetData);
        return targetData;
      }
    } catch(err) {}
  }

  try {
    sessionStorage.removeItem('cas_view_user');
    if (window.history && window.history.replaceState && sp && (sp.has('u') || sp.has('id'))) {
      window.history.replaceState({}, '', '/cms/profile');
    }
  } catch(e) {}
  setIsReadOnlyMode(!1);
  y(myUser);
  return myUser;
}

var isTargetConnected = Boolean(a?.is_connected || a?.connection_status === 'ACCEPTED' || (a?.id && typeof localStorage !== 'undefined' && localStorage.getItem('cas_conn_' + a.id) === '1'));

async function handleToggleConnect() {
  if (!a?.id || eConnLoading) return;
  setConnLoading(!0);
  try {
    var targetConnected = Boolean(a?.is_connected || a?.connection_status === 'ACCEPTED' || (a?.id && typeof localStorage !== 'undefined' && localStorage.getItem('cas_conn_' + a.id) === '1'));
    if (targetConnected) {
      try {
        await c.apiAuth.post('/bdb/jukrah/network/disconnect/' + a.id);
      } catch(err) {}
      try { localStorage.removeItem('cas_conn_' + a.id); } catch(e) {}
      var prevCount = typeof a?.connections_count === 'number' ? a.connections_count : (parseInt(a?.connections_count, 10) || 0);
      var nextCount = Math.max(0, prevCount - 1);
      y(prev => ({ ...prev, is_connected: false, connection_status: 'NONE', connections_count: nextCount }));
      e.current?.show({severity:'info', summary:'Koneksi Kedinasan', detail:'Koneksi kedinasan telah dihapus.'});
    } else {
      var res = null;
      try {
        res = await c.apiAuth.post('/bdb/jukrah/network/connect/' + a.id);
      } catch(err) {}
      try { localStorage.setItem('cas_conn_' + a.id, '1'); } catch(e) {}
      var prevCount = typeof a?.connections_count === 'number' ? a.connections_count : (parseInt(a?.connections_count, 10) || 0);
      var nextCount = (res?.data?.connections_count !== undefined) ? res.data.connections_count : (prevCount + 1);
      y(prev => ({ ...prev, is_connected: true, connection_status: 'ACCEPTED', connections_count: nextCount }));
      var personilHandle = formatCallsign(a?.callsign, a?.id, a?.username);
      e.current?.show({severity:'success', summary:'Koneksi Terhubung', detail:'Berhasil menambahkan rekan kedinasan dengan ' + personilHandle + '!'});
    }
  } catch(err) {
    e.current?.show({severity:'error', summary:'Gagal', detail:'Terjadi kendala saat memperbarui status koneksi.'});
  } finally {
    setConnLoading(!1);
  }
}

async function handleModalToggleConnect(targetUser) {
  if (!targetUser?.id || eModalConnLoading[targetUser.id]) return;
  var targetId = targetUser.id;
  setModalConnLoading(prev => ({ ...prev, [targetId]: true }));
  var currentlyConnected = Boolean(targetUser.is_connected !== undefined ? targetUser.is_connected : (targetUser.connection_status === 'ACCEPTED' || (typeof localStorage !== 'undefined' && localStorage.getItem('cas_conn_' + targetId) === '1')));
  try {
    if (currentlyConnected) {
      try {
        await c.apiAuth.post('/bdb/jukrah/network/disconnect/' + targetId);
      } catch(err) {}
      try { localStorage.removeItem('cas_conn_' + targetId); } catch(e) {}
      setNetworkUsers(prev => prev.map(u => String(u.id) === String(targetId) ? { ...u, is_connected: false, connection_status: 'NONE' } : u));
      if (String(a?.id) === String(targetId)) {
        y(prev => ({ ...prev, is_connected: false, connection_status: 'NONE' }));
      }
      e.current?.show({severity:'info', summary:'Koneksi Kedinasan', detail:'Koneksi kedinasan dengan ' + formatCallsign(targetUser.callsign, targetUser.id, targetUser.username) + ' telah diputuskan.'});
    } else {
      try {
        await c.apiAuth.post('/bdb/jukrah/network/connect/' + targetId);
      } catch(err) {}
      try { localStorage.setItem('cas_conn_' + targetId, '1'); } catch(e) {}
      setNetworkUsers(prev => prev.map(u => String(u.id) === String(targetId) ? { ...u, is_connected: true, connection_status: 'ACCEPTED' } : u));
      if (String(a?.id) === String(targetId)) {
        y(prev => ({ ...prev, is_connected: true, connection_status: 'ACCEPTED' }));
      }
      e.current?.show({severity:'success', summary:'Koneksi Terhubung', detail:'Berhasil menambahkan rekan kedinasan dengan ' + formatCallsign(targetUser.callsign, targetUser.id, targetUser.username) + '!'});
    }
  } catch(err) {
    e.current?.show({severity:'error', summary:'Gagal', detail:'Terjadi kendala saat memperbarui status koneksi.'});
  } finally {
    setModalConnLoading(prev => ({ ...prev, [targetId]: false }));
  }
}

async function eD(){ek(!0),eS("");try{let e=(0,c.assertOk)(await c.apiAuth.get("/bdb/satker/me/profile"));ex(e)}catch(e){eS(e.response?.data?.message||"Gagal memuat data wilayah satker.")}finally{ek(!1)}}async function e_(){if(eN.jumlah_penduduk.trim()&&!/^\d+$/.test(eN.jumlah_penduduk.trim()))return void e.current?.show({severity:"warn",summary:"Periksa lagi",detail:"Jumlah penduduk harus berupa angka bulat."});if(eN.longitude.trim()){let t=Number(eN.longitude);if(!Number.isFinite(t)||t<-180||t>180)return void e.current?.show({severity:"warn",summary:"Periksa lagi",detail:"Longitude harus angka antara -180 s/d 180."})}if(eN.latitude.trim()){let t=Number(eN.latitude);if(!Number.isFinite(t)||t<-90||t>90)return void e.current?.show({severity:"warn",summary:"Periksa lagi",detail:"Latitude harus angka antara -90 s/d 90."})}if(await (0,d.confirmAction)("Simpan perubahan data wilayah satker?")){eI(!0);try{(0,c.assertOk)(await c.apiAuth.patch("/bdb/satker/me/profile",eN)),e.current?.show({severity:"success",summary:"Tersimpan",detail:"Data wilayah satker diperbarui."}),eP(!1),await eD()}catch(t){e.current?.show({severity:"error",summary:"Gagal",detail:t.response?.data?.message||"Gagal menyimpan data wilayah satker.",life:8e3})}finally{eI(!1)}}}async function eA(){let polriMail=(Z.email_polri||"").trim().toLowerCase(),secMail=(Z.email||"").trim().toLowerCase();let uName=(Z.username||"").trim().toLowerCase();if(uName&&polriMail&&uName===polriMail)return void e.current?.show({severity:"warn",summary:"Periksa lagi",detail:"Username dan Email Dinas Polri tidak boleh sama. Silakan ubah salah satunya."});if(!Z.name.trim())return void e.current?.show({severity:"warn",summary:"Lengkapi",detail:"Nama wajib diisi."});if(!polriMail)return void e.current?.show({severity:"warn",summary:"Lengkapi",detail:"Email dinas Polri (Utama) wajib diisi."});if(!polriMail.endsWith("@polri.go.id"))return void e.current?.show({severity:"warn",summary:"Periksa lagi",detail:"Email dinas Polri wajib menggunakan domain @polri.go.id."});if(secMail&&secMail===polriMail)return void e.current?.show({severity:"warn",summary:"Periksa lagi",detail:"Email sekunder tidak boleh sama dengan Email dinas Polri."});if(X.hasBlockingIssue)return void e.current?.show({severity:"warn",summary:"Periksa lagi",detail:"Email dinas Polri atau username sudah dipakai akun lain. Perbaiki dulu sebelum menyimpan."});if(await (0,d.confirmAction)("Simpan perubahan profil?")){Y(!0);try{let payload={...Z,email:secMail||polriMail,email_polri:polriMail,is_pns:Boolean(Z.is_pns),photo_url:Z.photo_url||"",foto:Z.photo_url||"",social_media:{urls:eSocUrls.map(u=>u.trim()).filter(Boolean)}};let patchRes=await c.apiAuth.patch("/user/me/profile",payload);(0,c.assertOk)(patchRes);try{let lu=JSON.parse(localStorage.getItem('user')||'{}');let newU={...lu,...(patchRes.data?.data||payload),username:Z.username,callsign:Z.username,name:Z.name};localStorage.setItem('user',JSON.stringify(newU));window.dispatchEvent(new CustomEvent('user-updated',{detail:newU}));}catch(e){}e.current?.show({severity:"success",summary:"Tersimpan",detail:"Profil berhasil diperbarui."}),q(!1),await eT()}catch(a){let t=a.response?.data?.errors,n=t?Object.values(t).flat().join(", "):a.response?.data?.message||"Gagal menyimpan profil.";e.current?.show({severity:"error",summary:"Gagal",detail:n,life:8e3})}finally{Y(!1)}}}function startTotpSetup(){
setTotpData(null);setTotpInputCode("");setTotpError("");setExistingPassword("");setTotpStep(1);setTotpModal(!0);
}
async function fetchTotpSetup(){
if(!eExistingPassword){setTotpError("Silakan masukkan password akun Anda terlebih dahulu.");return;}
setTotpLoading(!0);setTotpError("");
try{
let res=await c.apiAuth.post("/Authentication/profile/security/totp/setup",{mode:"setup",password:eExistingPassword});
(0,c.assertOk)(res);
let d=res.data?.data||res.data;
setTotpData(d);setTotpInputCode("");setTotpStep(2);
}catch(err){
let msg=err.response?.data?.errors?.password?.[0]||err.response?.data?.message||"Password akun salah. Silakan periksa kembali password Anda.";
setTotpError(msg);
}finally{setTotpLoading(!1);}}
async function confirmTotpActivation(){
if(!eTotpInputCode||eTotpInputCode.length<6)return void setTotpError("Masukkan 6 digit kode dari aplikasi Google Authenticator.");
setTotpLoading(!0);setTotpError("");
try{
let payload={enabled:!0,setup_id:eTotpData?.setup_id,totp_token:eTotpInputCode.trim()};
(0,c.assertOk)(await c.apiAuth.patch("/Authentication/profile/security/totp",payload));
e.current?.show({severity:"success",summary:"Berhasil",detail:"Google Authenticator (TOTP) berhasil diaktifkan!"});
setOtpCooldown(0);setOtpAttempts(0);setOtpVerifyFails(0);
setTotpModal(!1);await eT();
}catch(err){
let msg=err.response?.data?.errors?.totp_token?.[0]||err.response?.data?.message||"Kode authenticator tidak valid.";
setTotpError(msg);
}finally{setTotpLoading(!1);}}
function b64ToUint8Array(b64url){
if(!b64url)return new Uint8Array(0);
var pad="=".repeat((4-(b64url.length%4))%4);
var b64=(b64url+pad).replace(/\-/g,"+").replace(/_/g,"/");
var raw=window.atob(b64);
var arr=new Uint8Array(raw.length);
for(var i=0;i<raw.length;++i)arr[i]=raw.charCodeAt(i);
return arr;
}
function u8ToB64Url(buf){
if(!buf)return"";
var bytes=new Uint8Array(buf);
var bin="";
for(var i=0;i<bytes.byteLength;i++)bin+=String.fromCharCode(bytes[i]);
return window.btoa(bin).replace(/\+/g,"-").replace(/\//g,"_").replace(/=/g,"");
}
async function fetchPasskeyDevices(){
try{
var res=await c.apiAuth.get("/Authentication/passkey/devices");
if(res?.data?.status===1||res?.status===200){
setPasskeyDevices(res.data?.data||[]);
}
}catch(_e){}
}
(0,n.useEffect)(function(){
if(eSettingsModal&&eSettingsTab==='keamanan'){
fetchPasskeyDevices();
}
},[eSettingsModal,eSettingsTab]);
async function handleRegisterPasskey(customName){
if(typeof window==='undefined'||!window.PublicKeyCredential){
return void e.current?.show({severity:"warn",summary:"Tidak Didukung",detail:"Peramban atau perangkat ini belum mendukung otentikasi biometrik WebAuthn."});
}
setPasskeyLoading(!0);
try{
var res=await c.apiAuth.get("/Authentication/passkey/register-options");
var opt=res.data?.data||res.data;
if(!opt||!opt.challenge)throw new Error("Gagal memuat opsi biometrik dari server.");
opt.challenge=b64ToUint8Array(opt.challenge);
if(opt.user&&opt.user.id)opt.user.id=b64ToUint8Array(opt.user.id);
if(opt.excludeCredentials&&Array.isArray(opt.excludeCredentials)){
opt.excludeCredentials=opt.excludeCredentials.map(function(item){
return Object.assign({},item,{id:b64ToUint8Array(item.id)});
});
}
var cred=await navigator.credentials.create({publicKey:opt});
if(!cred)throw new Error("Pendaftaran biometrik dibatalkan.");
var regResponse={
id:cred.id,
rawId:u8ToB64Url(cred.rawId),
response:{
clientDataJSON:u8ToB64Url(cred.response.clientDataJSON),
attestationObject:u8ToB64Url(cred.response.attestationObject),
transports:(cred.response.getTransports?cred.response.getTransports():["internal","hybrid"])
},
type:cred.type,
clientExtensionResults:(cred.getClientExtensionResults?cred.getClientExtensionResults():{}),
authenticatorAttachment:cred.authenticatorAttachment
};
var devName=(customName||"").trim();
if(!devName){
var ua=navigator.userAgent||"";
if(/iPhone/i.test(ua))devName="Apple iPhone";
else if(/iPad/i.test(ua))devName="Apple iPad";
else if(/Macintosh/i.test(ua))devName="Apple Mac";
else if(/Android/i.test(ua))devName="Gawai Android";
else if(/Windows/i.test(ua))devName="PC Windows (Hello)";
else devName="Gawai Terpercaya (FIDO2)";
}
var verifyRes=await c.apiAuth.post("/Authentication/passkey/register-verify",{
deviceName:devName,
registrationResponse:regResponse
});
(0,c.assertOk)(verifyRes);
e.current?.show({severity:"success",summary:"Gawai Terdaftar",detail:'Perangkat "'+devName+'" berhasil didaftarkan sebagai gawai terpercaya untuk login biometrik.'});
await fetchPasskeyDevices();
await eT();
}catch(err){
if(err?.name==="NotAllowedError"){
e.current?.show({severity:"info",summary:"Dibatalkan",detail:"Proses biometrik dibatalkan oleh pengguna atau waktu sensor habis."});
}else{
var msg=err.response?.data?.message||err.message||"Gagal mendaftarkan gawai biometrik.";
e.current?.show({severity:"error",summary:"Gagal Mendaftar",detail:msg});
}
}finally{
setPasskeyLoading(!1);
}
}
function handleDeletePasskey(dev){
setRevokeTarget(dev);setRevokeCode("");setRevokeError("");
}
async function confirmRevokePasskey(){
if(!eRevokeCode.trim()){
setRevokeError("Silakan masukkan password akun atau kode keamanan Anda.");
return;
}
setRevokeLoading(!0);setRevokeError("");
try{
var res=await c.apiAuth.delete("/Authentication/passkey/devices/"+eRevokeTarget.id,{
data:{password:eRevokeCode.trim()},
params:{password:eRevokeCode.trim()}
});
(0,c.assertOk)(res);
e.current?.show({severity:"success",summary:"Akses Dicabut",detail:'Akses gawai "'+(eRevokeTarget.device_name||"")+'" berhasil dicabut.'});
setRevokeTarget(null);setRevokeCode("");
await fetchPasskeyDevices();
await eT();
}catch(err){
var msg=err.response?.data?.message||err.message||"Gagal mencabut akses gawai.";
setRevokeError(msg);
}finally{
setRevokeLoading(!1);
}
}
function promptDisable(target){
setDisableTarget(target);setDisableCode("");setDisableError("");setDisableModal(!0);
}
function renderSwitch(act,onClk,ld,dis,hint){
return(0,t.jsx)("div",{role:"switch","aria-checked":act,onClick:(ld||dis)?void 0:onClk,style:{width:"2.75rem",height:"1.5rem",borderRadius:"999px",background:dis?"rgba(255,255,255,0.08)":act?"#16a34a":"rgba(255,255,255,0.22)",opacity:dis?0.4:1,padding:"2px",cursor:dis?"not-allowed":ld?"wait":"pointer",transition:"all 0.2s ease",display:"inline-flex",alignItems:"center",boxShadow:"inset 0 1px 3px rgba(0,0,0,0.3)",flexShrink:0},title:dis?(hint||"Maksimal 2 metode aktif"):act?"Aktif (klik untuk menonaktifkan)":"Nonaktif (klik untuk mengaktifkan)",children:(0,t.jsx)("div",{style:{width:"1.25rem",height:"1.25rem",borderRadius:"999px",background:dis?"#94a3b8":"#fff",transform:act?"translateX(1.25rem)":"translateX(0)",transition:"transform 0.2s ease",boxShadow:"0 1px 4px rgba(0,0,0,0.35)",display:"flex",alignItems:"center",justifyContent:"center"},children:ld?(0,t.jsx)("i",{className:"pi pi-spin pi-spinner",style:{fontSize:"0.65rem",color:"#16a34a"}}):null})});}
function openSecurityModal(action){
if(action==="enable_totp")return startTotpSetup();
setOtpCooldown(0);setOtpAttempts(0);setOtpVerifyFails(0);
en(action);er("");el("");es("");ec("");ev("");setExistingPassword("");setOtpStep(1);setOtpSentTo("");ee(!0);
}
async function sendSecurityOtp(targetChoice){
let choice=targetChoice||eEmailChoice||"dinas";
if(!eExistingPassword){ev("Silakan masukkan password akun Anda terlebih dahulu.");return;}
if(["enable_pin","change_pin"].includes(et)){
if(!eo||eo.length<6){ev("PIN minimal 6 digit angka.");return;}
if(eo!==eu){ev("Konfirmasi PIN belum sama.");return;}
}
if(eOtpAttempts>=3){e.current?.show({severity:"error",summary:"Batas Percobaan",detail:"Batas pengiriman OTP tercapai (maksimal 3 kali). Silakan coba lagi nanti."});return;}
if(eOtpCooldown>0){e.current?.show({severity:"warn",summary:"Harap Menunggu",detail:`Tunggu ${eOtpCooldown} detik sebelum meminta kode OTP kembali.`});return;}
eh(!0);ev("");
try{
let res=await c.apiAuth.post("/Authentication/profile/security/otp",{action:et,target_email:choice,password:eExistingPassword});
(0,c.assertOk)(res);
let d=res.data?.data||res.data;
setOtpAttempts(prev=>prev+1);setOtpCooldown(60);
er(d?.otp_id||"");setEmailChoice(choice);
let sentTarget=d?.sent_to||("sekunder"===choice?a.email:(a.email_polri||a.email));
setOtpSentTo(sentTarget);
setOtpStep(2);
e.current?.show({severity:"info",summary:"Kode OTP Terkirim",detail:"Kode verifikasi 6-digit dikirim ke "+(d?.sent_to_masked||sentTarget)});
}catch(err){
let msg=err.response?.data?.errors?.password?.[0]||err.response?.data?.errors?.otp?.[0]||err.response?.data?.message||"Gagal mengirim kode verifikasi.";
ev(msg);e.current?.show({severity:"error",summary:"Gagal",detail:msg});
}finally{eh(!1);}
return;
}
function ez(t,targetEmail){return openSecurityModal(t);}
async function ez_legacy(t){
let n="disable_email_otp"===t?"Nonaktifkan OTP email saat login? Kode verifikasi akan dikirim ke email Anda.":"enable_email_otp"===t?"Aktifkan OTP email saat login? Kode verifikasi akan dikirim ke email Anda.":"disable_pin"===t?"Nonaktifkan PIN keamanan? Kode verifikasi akan dikirim ke email Anda.":"change_pin"===t?"Ubah PIN keamanan? Kode verifikasi akan dikirim ke email Anda.":"Aktifkan PIN keamanan? Kode verifikasi akan dikirim ke email Anda.";if(await (0,d.confirmAction)(n)){eh(!0);try{let e=await c.apiAuth.post("/Authentication/profile/security/otp",{action:t});(0,c.assertOk)(e),er(e.data?.data?.otp_id||""),en(t),el(""),es(""),ec(""),ev(""),ee(!0)}catch(t){e.current?.show({severity:"error",summary:"Gagal",detail:t.response?.data?.message||"Gagal mengirim kode verifikasi."})}finally{eh(!1)}}}async function eM(){if(ei.length<6)return void ev("Masukkan 6 digit kode dari email.");if("disable_totp"===et){ef(!0),ev("");try{let payload={enabled:!1,otp_id:ea,otp_token:ei};(0,c.assertOk)(await c.apiAuth.patch("/Authentication/profile/security/totp",payload));e.current?.show({severity:"success",summary:"Berhasil",detail:"Google Authenticator (TOTP) berhasil dinonaktifkan."});ee(!1);await eT()}catch(t){let err=t.response?.data?.errors;ev(err&&Object.values(err)[0]?.[0]||t.response?.data?.message||"Kode OTP email salah atau kedaluwarsa.")}finally{ef(!1)}return}if("enable_email_otp"===et||"disable_email_otp"===et){let t="enable_email_otp"===et;ef(!0),ev("");try{let n={enabled:t,action:et,otp_id:ea,otp_token:ei,password:eExistingPassword,apply_global:!0};(0,c.assertOk)(await c.apiAuth.patch("/Authentication/profile/security/email-otp",n));setOtpCooldown(0);setOtpAttempts(0);setOtpVerifyFails(0);e.current?.show({severity:"success",summary:"Berhasil",detail:t?"OTP Email Login berhasil diaktifkan.":"OTP Email Login dinonaktifkan."});ee(!1);await eT()}catch(t){let err=t.response?.data?.errors;ev(err&&Object.values(err)[0]?.[0]||t.response?.data?.message||"Gagal memperbarui pengaturan OTP.")}finally{ef(!1)}return}
if("enable_pin"===et||"change_pin"===et){if(eo.length<6)return void ev("PIN minimal 6 digit angka.");if(eo!==eu)return void ev("Konfirmasi PIN belum sesuai.");ef(!0),ev("");try{let payload={enabled:!0,action:et,otp_id:ea,otp_token:ei,pin:eo,pin_confirmation:eu,password:eExistingPassword};(0,c.assertOk)(await c.apiAuth.patch("/Authentication/profile/security/pin",payload));setOtpCooldown(0);setOtpAttempts(0);setOtpVerifyFails(0);e.current?.show({severity:"success",summary:"Berhasil",detail:"PIN keamanan berhasil disimpan."});ee(!1);await eT()}catch(t){let err=t.response?.data?.errors;ev(err&&Object.values(err)[0]?.[0]||t.response?.data?.message||"Kode OTP salah atau kedaluwarsa.")}finally{ef(!1)}return}
if("enable_email_otp_legacy"===et){let t="enable_email_otp"===et;ef(!0),ev("");try{let n={enabled:t,action:et,otp_id:ea,otp_token:ei};(0,c.assertOk)(await c.apiAuth.patch("/Authentication/profile/security/email-otp",n)),e.current?.show({severity:"success",summary:"Tersimpan",detail:`OTP email saat login berhasil ${t?"diaktifkan":"dinonaktifkan"}.`}),ee(!1),await eT()}catch(t){let e=t.response?.data?.errors;ev(e&&Object.values(e)[0]?.[0]||t.response?.data?.message||"Kode salah atau kedaluwarsa.")}finally{ef(!1)}return}let t="disable_pin"!==et;if(t){if(!/^\d{6,8}$/.test(eo))return void ev("PIN wajib 6-8 digit angka.");if(eo!==eu)return void ev("Konfirmasi PIN belum sama.")}ef(!0),ev("");try{let n={enabled:t,action:et,otp_id:ea,otp_token:ei};t&&(n.pin=eo,n.pin_confirmation=eu),(0,c.assertOk)(await c.apiAuth.patch("/Authentication/profile/security/pin",n)),e.current?.show({severity:"success",summary:"Tersimpan",detail:`PIN keamanan berhasil ${"disable_pin"===et?"dinonaktifkan":"change_pin"===et?"diubah":"diaktifkan"}.`}),ee(!1),await eT()}catch(t){let e=t.response?.data?.errors;ev(e&&Object.values(e)[0]?.[0]||t.response?.data?.message||"Kode salah atau kedaluwarsa.")}finally{ef(!1)}}(0,n.useEffect)(()=>{let timer;if(eOtpCooldown>0){timer=setInterval(()=>setOtpCooldown(c=>Math.max(0,c-1)),1000)}return()=>{if(timer)clearInterval(timer)}},[eOtpCooldown]);
(0,n.useEffect)(() => {
  if (a) {
    let soc = a.social_media || {};
    if (typeof soc === 'string') {
      try { soc = JSON.parse(soc); } catch(e) {}
    }
    var targetBio = (typeof a?.bio === 'string' && a.bio) ? a.bio : (typeof soc?.bio === 'string' ? soc.bio : '');
    setBio(targetBio);

    var defaultGrad = 'linear-gradient(135deg, #090d16 0%, #0f172a 45%, #1e293b 85%, #0369a1 100%)';
    var cachedBanner = (a?.id && typeof localStorage !== 'undefined') ? localStorage.getItem('cas_banner_' + a.id) : null;
    var targetBanner = (typeof a?.banner_theme === 'string' && a.banner_theme) ? a.banner_theme : 
                       (typeof soc?.banner_theme === 'string' && soc.banner_theme) ? soc.banner_theme : 
                       (cachedBanner || defaultGrad);
    setBannerTheme(targetBanner);
  }
}, [a]);

(0,n.useEffect)(() => {
  let handleClickOutside = (ev) => {
    if (!ev.target.closest('#cas-settings-dropdown-wrapper')) {
      setDropdownOpen(!1);
    }
  };
  if (eDropdownOpen) {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }
}, [eDropdownOpen]);

let defaultPersonnel = [];

let fetchNetworkDirectory = async (search, satker, targetPage, targetConnectedTo) => {
  setNetworkLoading(!0);
  let p = targetPage || 1;
  setNetworkPage(p);
  try {
    let sVal = search !== void 0 ? search : eNetworkSearch;
    let satVal = satker !== void 0 ? satker : eNetworkSatkerFilter;
    let connTo = targetConnectedTo !== void 0 ? targetConnectedTo : (satVal === 'connected' ? (eNetworkConnectedTarget || a?.id || mySelf?.id) : null);
    let qParams = {
      search: sVal || '',
      satker: (satVal === 'all' || satVal === 'connected') ? '' : (satVal === 'my_satker' ? (a?.satker_nama || a?.satker || '') : satVal),
      page: p,
      limit: 9
    };
    if (satVal === 'connected' || connTo) {
      var activeConnId = connTo || eNetworkConnectedTarget || a?.id || mySelf?.id;
      if (activeConnId) {
        qParams.connected_to = activeConnId;
        qParams.target_user_id = activeConnId;
      }
      qParams.filter = 'connected';
    }
    if (satVal === 'my_satker' && a?.scope_satker_id) {
      qParams.satker_id = a.scope_satker_id;
    }
    let res = await c.apiAuth.get('/bdb/jukrah/network/users', { params: qParams });
    let list = res.data?.data || [];
    setNetworkUsers(list);
    setNetworkTotal(res.data?.total !== undefined ? res.data.total : list.length);
    setNetworkTotalPages(res.data?.total_pages || Math.ceil((res.data?.total !== undefined ? res.data.total : list.length) / 9) || 1);
  } catch (err) {
    setNetworkUsers([]);
    setNetworkTotal(0);
    setNetworkTotalPages(1);
  } finally {
    setNetworkLoading(!1);
  }
};

(0,n.useEffect)(() => {
  fetchNetworkDirectory('', 'all', 1);
}, []);

let handleOpenProfilePreview = async (user) => {
  try {
    let res = await c.apiAuth.get('/bdb/jukrah/network/profile/' + user.id);
    let fullUser = res.data?.data || user;
    setPreviewUser(fullUser);
    setProfilePreviewModal(!0);
  } catch {
    setPreviewUser(user);
    setProfilePreviewModal(!0);
  }
};

let persistSocialMedia = async (updates) => {
  if (isReadOnlyMode) return false;
  let currSoc = (a && typeof a.social_media === 'object' && a.social_media !== null) ? a.social_media : {};
  let nextSoc = {
    ...currSoc,
    ...updates,
    urls: (Array.isArray(currSoc.urls) ? currSoc.urls : (Array.isArray(eSocUrls) ? eSocUrls.map(u => typeof u === 'string' ? u.trim() : '').filter(Boolean) : []))
  };
  try {
    try {
      localStorage.setItem('cas_profile_social_' + a?.id, JSON.stringify(nextSoc));
      if (nextSoc.banner_theme) {
        localStorage.setItem('cas_banner_' + a?.id, nextSoc.banner_theme);
      }
    } catch(e) {}
    let patchRes = await c.apiAuth.patch("/user/me/profile", { social_media: nextSoc });
    (0, c.assertOk)(patchRes);
    y(prev => prev ? ({ ...prev, social_media: nextSoc, banner_theme: nextSoc.banner_theme }) : prev);
    await eT();
    return true;
  } catch (err) {
    e.current?.show({ severity: 'error', summary: 'Gagal Menyimpan', detail: err.response?.data?.message || 'Gagal menyimpan perubahan profil.' });
    return false;
  }
};

let handleSaveBio = async () => {
  if (isReadOnlyMode) return;
  setSavingBio(!0);
  try {
    let ok = await persistSocialMedia({ bio: eBio.trim() });
    if (ok) {
      e.current?.show({ severity: 'success', summary: 'Tersimpan', detail: 'Ringkasan Tentang Saya berhasil diperbarui.' });
      setBioModal(!1);
    }
  } finally {
    setSavingBio(!1);
  }
};

let getActiveExperiences = () => {
  if (Array.isArray(a?.social_media?.experiences)) return a.social_media.experiences;
  try {
    let local = JSON.parse(localStorage.getItem('cas_profile_social_' + a?.id) || '{}');
    if (Array.isArray(local.experiences)) return local.experiences;
  } catch(e) {}
  return [];
};

let openAddExp = () => {
  if (isReadOnlyMode) return;
  setEditingExpIndex(-1);
  setExpForm({
    title: '',
    company: 'Badan Reserse Kriminal Polri (Bareskrim)',
    period: '',
    location: 'Mabes Polri, Jakarta Selatan',
    description: ''
  });
  setExpModal(!0);
};

let openEditExp = (idx) => {
  if (isReadOnlyMode) return;
  let list = getActiveExperiences();
  let item = list[idx] || { title: '', company: '', period: '', location: '', description: '' };
  setEditingExpIndex(idx);
  setExpForm({ ...item });
  setExpModal(!0);
};

let handleSaveExp = async () => {
  if (isReadOnlyMode) return;
  if (!eExpForm.title.trim() || !eExpForm.company.trim()) {
    e.current?.show({ severity: 'warn', summary: 'Lengkapi Data', detail: 'Posisi/Jabatan dan Instansi/Satker wajib diisi.' });
    return;
  }
  setSavingExp(!0);
  try {
    let list = [...getActiveExperiences()];
    if (eEditingExpIndex >= 0) {
      list[eEditingExpIndex] = { ...eExpForm };
    } else {
      list.unshift({ ...eExpForm, id: Date.now() });
    }
    let ok = await persistSocialMedia({ experiences: list });
    if (ok) {
      e.current?.show({ severity: 'success', summary: 'Tersimpan', detail: 'Riwayat pengalaman berhasil diperbarui.' });
      setExpModal(!1);
    }
  } finally {
    setSavingExp(!1);
  }
};

let handleDeleteExp = async () => {
  if (isReadOnlyMode || eEditingExpIndex < 0) return;
  if (await (0,d.confirmAction)('Hapus riwayat pengalaman ini?', { danger: !0, acceptLabel: 'Hapus' })) {
    setSavingExp(!0);
    try {
      let list = getActiveExperiences().filter((_, i) => i !== eEditingExpIndex);
      let ok = await persistSocialMedia({ experiences: list });
      if (ok) {
        e.current?.show({ severity: 'success', summary: 'Dihapus', detail: 'Riwayat pengalaman telah dihapus.' });
        setExpModal(!1);
      }
    } finally {
      setSavingExp(!1);
    }
  }
};

let getActiveEducation = () => {
  if (Array.isArray(a?.social_media?.education)) return a.social_media.education;
  try {
    let local = JSON.parse(localStorage.getItem('cas_profile_social_' + a?.id) || '{}');
    if (Array.isArray(local.education)) return local.education;
  } catch(e) {}
  return [];
};

let openAddEdu = () => {
  if (isReadOnlyMode) return;
  setEditingEduIndex(-1);
  setEduForm({
    school: '',
    degree: '',
    field: '',
    year: '',
    description: ''
  });
  setEduModal(!0);
};

let openEditEdu = (idx) => {
  if (isReadOnlyMode) return;
  let list = getActiveEducation();
  let item = list[idx] || { school: '', degree: '', field: '', year: '', description: '' };
  setEditingEduIndex(idx);
  setEduForm({ ...item });
  setEduModal(!0);
};

let handleSaveEdu = async () => {
  if (isReadOnlyMode) return;
  if (!eEduForm.school.trim()) {
    e.current?.show({ severity: 'warn', summary: 'Lengkapi Data', detail: 'Nama Institusi/Universitas/Pusdik wajib diisi.' });
    return;
  }
  setSavingEdu(!0);
  try {
    let list = [...getActiveEducation()];
    if (eEditingEduIndex >= 0) {
      list[eEditingEduIndex] = { ...eEduForm };
    } else {
      list.unshift({ ...eEduForm, id: Date.now() });
    }
    let ok = await persistSocialMedia({ education: list });
    if (ok) {
      e.current?.show({ severity: 'success', summary: 'Tersimpan', detail: 'Riwayat pendidikan berhasil diperbarui.' });
      setEduModal(!1);
    }
  } finally {
    setSavingEdu(!1);
  }
};

let handleDeleteEdu = async () => {
  if (isReadOnlyMode || eEditingEduIndex < 0) return;
  if (await (0,d.confirmAction)('Hapus riwayat pendidikan ini?', { danger: !0, acceptLabel: 'Hapus' })) {
    setSavingEdu(!0);
    try {
      let list = getActiveEducation().filter((_, i) => i !== eEditingEduIndex);
      let ok = await persistSocialMedia({ education: list });
      if (ok) {
        e.current?.show({ severity: 'success', summary: 'Dihapus', detail: 'Riwayat pendidikan telah dihapus.' });
        setEduModal(!1);
      }
    } finally {
      setSavingEdu(!1);
    }
  }
};

let handleSaveBanner = async () => {
  if (isReadOnlyMode) return;
  setCustomBannerLoading(!0);
  try {
    let finalBanner = eBannerTheme;
    if (eRawBanner) {
      finalBanner = await new Promise(res => {
        let box = document.getElementById("cas-banner-crop-box");
        let imgEl = document.getElementById("cas-banner-crop-img");
        if (!box || !imgEl) return res(eBannerTheme);

        let boxRect = box.getBoundingClientRect();
        let imgRect = imgEl.getBoundingClientRect();

        let cvWidth = 1600;
        let cvHeight = Math.max(120, Math.round(cvWidth * (boxRect.height / boxRect.width)));
        let cv = document.createElement("canvas");
        cv.width = cvWidth;
        cv.height = cvHeight;
        let cx = cv.getContext("2d");

        cx.fillStyle = "#090d16";
        cx.fillRect(0, 0, cvWidth, cvHeight);

        let scaleToCv = cvWidth / boxRect.width;
        let dx = (imgRect.left - boxRect.left) * scaleToCv;
        let dy = (imgRect.top - boxRect.top) * scaleToCv;
        let dw = imgRect.width * scaleToCv;
        let dh = imgRect.height * scaleToCv;

        let img = new Image();
        img.onload = function() {
          try {
            cx.drawImage(img, dx, dy, dw, dh);
            res(cv.toDataURL("image/jpeg", 0.88));
          } catch(eDraw) {
            res(eBannerTheme);
          }
        };
        img.onerror = () => res(eBannerTheme);
        img.src = eRawBanner;
      });
      setBannerTheme(finalBanner);
    }
    let ok = await persistSocialMedia({ banner_theme: finalBanner });
    if (ok) {
      e.current?.show({ severity: 'success', summary: 'Sampul Diterapkan', detail: 'Tema foto sampul berhasil diperbarui.' });
      setBannerModal(!1);
    }
  } catch (err) {
    e.current?.show({ severity: 'error', summary: 'Gagal', detail: err.response?.data?.message || 'Gagal menerapkan foto sampul.' });
  } finally {
    setCustomBannerLoading(!1);
  }
};

let openEditIntro = () => {
  if (isReadOnlyMode) {
    e.current?.show({ severity: 'warn', summary: 'Akses Dibatasi', detail: 'Mode Terenkripsi Kedinasan (Read-Only). Anda tidak dapat mengubah data personil lain.' });
    return;
  }
  let initialUrls = [];
  if (a?.social_media) {
    if (Array.isArray(a.social_media.urls)) initialUrls = a.social_media.urls;
    else if (Array.isArray(a.social_media)) initialUrls = a.social_media;
    else Object.values(a.social_media).forEach(v => {
      if ("string" == typeof v && v.trim()) initialUrls.push(v.trim());
    });
  }
  if (!initialUrls.length) initialUrls = [""];
  let polriMail = typeof a?.email_polri === "string" ? a.email_polri.trim() : "";
  let secMail = typeof a?.email === "string" ? a.email.trim() : "";
  if (!polriMail && secMail.toLowerCase().endsWith("@polri.go.id")) {
    polriMail = secMail;
    secMail = "";
  }
  G({
    name: a?.name || "",
    email: secMail,
    nrp: K(a?.nrp) || "",
    pangkat: K(a?.pangkat) || "",
    jabatan: K(a?.jabatan) || "",
    satuan: K(a?.satuan) || "",
    no_hp: K(a?.no_hp) || "",
    email_polri: polriMail,
    username: a?.username || "",
    is_pns: Boolean(a?.is_pns),
    social_media: a?.social_media || {},
    photo_url: a?.photo_url || a?.foto || ""
  });
  X.resetAll();
  q(!0);
};

let handleOpenPersonalLikes = async (pId) => {
  setPersonalLikesModal(!0);
  setLoadingPersonalLikes(!0);
  try {
    let res = await c.apiAuth.get('/bdb/jukrah/post/' + pId + '/reactions');
    let data = Array.isArray(res.data?.data) ? res.data.data : [];
    setPersonalLikesList(data);
  } catch (err) {
    setPersonalLikesList([]);
  } finally {
    setLoadingPersonalLikes(!1);
  }
};

let fetchPersonalFeed = (0,n.useCallback)(async (tab) => {
  setLoadingFeed(!0);
  try {
    let params = { filter: tab || eFeedTab };
    if (a?.id) {
      params.author_id = a.id;
    }
    let res = await c.apiAuth.get('/bdb/jukrah/feed', { params });
    let raw = Array.isArray(res.data?.data) ? res.data.data : (res.data?.data?.posts || []);
    let filtered = a?.id ? raw.filter(p => String(p.author_id) === String(a.id)) : raw;
    let mapped = filtered.map(p => ({
      ...p,
      author_callsign: p.author_callsign || p.author_username || (p.raw_author_name ? p.raw_author_name.toLowerCase().replace(/\s+/g, '_') : (a?.username || 'personil')),
      author_handle: p.author_handle || ('@' + (p.author_callsign || a?.username || 'personil')),
      satker_name: p.satker_name || p.author_satker || K(a?.scope_satker_name) || K(a?.satker) || K(a?.satker_nama) || 'Polri'
    }));
    setPersonalPosts(mapped);
  } catch (err) {
    setPersonalPosts([]);
  } finally {
    setLoadingFeed(!1);
  }
}, [eFeedTab, a?.id, isReadOnlyMode]);

(0,n.useEffect)(() => {
  fetchPersonalFeed(eFeedTab);
}, [eFeedTab, isReadOnlyMode, a?.id]);

let handleCreatePersonalPost = async () => {
  if (isReadOnlyMode) return;
  if (!ePostText.trim()) return;
  if (ePostText.length > 3000) {
    e.current?.show({ severity: 'warn', summary: 'Karakter Melebihi Batas', detail: 'Teks postingan maksimal 3.000 karakter.' });
    return;
  }
  setPostSubmitting(!0);
  let contentToSend = ePostText.trim();
  let audienceToSend = ePostAudience;
  try {
    let fd = new FormData();
    fd.append('content', contentToSend);
    fd.append('audience_type', audienceToSend);
    let res = await c.apiAuth.post('/bdb/jukrah/post', fd, { headers: { 'Content-Type': void 0 } });
    
    let newPost = {
      id: res.data?.data?.id || ('temp_' + Date.now()),
      content: contentToSend,
      audience_type: audienceToSend,
      author_id: a?.id || null,
      author_name: a?.name || a?.username || 'Personil',
      author_callsign: a?.callsign || a?.username || (a?.id ? 'user_' + a.id : 'personil'),
      author_handle: formatCallsign(a?.callsign, a?.id, a?.username),
      author_satker: K(a?.scope_satker_name) || K(a?.satker) || K(a?.satker_nama) || K(a?.satuan) || 'Bareskrim Polri',
      satker_name: K(a?.scope_satker_name) || K(a?.satker) || K(a?.satker_nama) || K(a?.satuan) || 'Bareskrim Polri',
      created_at: new Date().toISOString(),
      total_reactions: 0,
      user_reaction: null,
      comments_count: 0,
      view_count: 1
    };
    setPersonalPosts(prev => [newPost, ...prev]);
    setPostText('');
    e.current?.show({ severity: 'success', summary: 'Dipublikasikan', detail: 'Catatan taktis berhasil dipublikasikan ke linimasa.' });
    setTimeout(() => { fetchPersonalFeed(eFeedTab); }, 800);
  } catch (err) {
    e.current?.show({ severity: 'error', summary: 'Gagal', detail: err.response?.data?.message || 'Gagal membagikan postingan.' });
  } finally {
    setPostSubmitting(!1);
  }
};

let handlePersonalReact = async (pId, rType) => {
  setHoverReactId(null);
  let post = ePersonalPosts.find(p => p.id === pId);
  let currentReact = post?.user_reaction;
  let nextReact = currentReact ? null : (rType || 'like');
  let total = post?.total_reactions || 0;
  if (currentReact) total = Math.max(0, total - 1);
  if (nextReact) total++;
  setPersonalPosts(prev => prev.map(p => p.id === pId ? { ...p, user_reaction: nextReact, total_reactions: total } : p));
  try {
    let res = await c.apiAuth.post('/bdb/jukrah/post/' + pId + '/reaction', { reaction_type: nextReact ? (rType || 'like') : 'unlike' });
    let up = res.data?.data;
    if (up) setPersonalPosts(prev => prev.map(p => p.id === pId ? { ...p, user_reaction: up?.user_reaction, total_reactions: up?.total_reactions } : p));
  } catch {
    fetchPersonalFeed(eFeedTab);
  }
};

let handlePersonalDelete = async (pId) => {
  if (isReadOnlyMode) return;
  if (await (0,d.confirmAction)('Hapus postingan ini?', { danger: !0, acceptLabel: 'Hapus' })) {
    try {
      await c.apiAuth.post('/bdb/jukrah/post/' + pId + '/delete', {});
      e.current?.show({ severity: 'success', summary: 'Dihapus', detail: 'Postingan telah dihapus.' });
      setPersonalPosts(prev => prev.filter(p => p.id !== pId));
    } catch (err) {
      e.current?.show({ severity: 'error', summary: 'Gagal', detail: 'Gagal menghapus postingan.' });
    }
  }
};

let handleTogglePostVis = async (p) => {
  if (isReadOnlyMode) return;
  let nextAud = p.audience_type === 'public' ? 'followers' : (p.audience_type === 'followers' ? 'private' : 'public');
  let labelAud = nextAud === 'public' ? 'Publik' : (nextAud === 'followers' ? 'Pengikut / Satker' : 'Privat');
  try {
    await c.apiAuth.post('/bdb/jukrah/post/' + p.id + '/visibility', { audience_type: nextAud });
    e.current?.show({ severity: 'success', summary: 'Diperbarui', detail: 'Visibilitas diubah ke ' + labelAud });
    setPersonalPosts(prev => prev.map(item => item.id === p.id ? { ...item, audience_type: nextAud } : item));
  } catch {}
};

let togglePostComments = async (pId) => {
  if (eActiveCommentPostId === pId) {
    setActiveCommentPostId(null);
    return;
  }
  setActiveCommentPostId(pId);
  try {
    let res = await c.apiAuth.get('/bdb/jukrah/post/' + pId + '/comments');
    let list = Array.isArray(res?.data?.data) ? res.data.data : (Array.isArray(res?.data) ? res.data : []);
    setPostComments(prev => ({ ...prev, [pId]: list }));
  } catch (err) {
    console.error('Failed to load profile comments:', err);
  }
};

let handleAddPersonalComment = async (pId) => {
  let txt = (eCommentInputs[pId] || '').trim();
  if (!txt) return;
  if (txt.length > 1000) {
    e.current?.show({ severity: 'warn', summary: 'Karakter Melebihi Batas', detail: 'Komentar maksimal 1.000 karakter.' });
    return;
  }
  setSubmittingComment(!0);
  try {
    let res = await c.apiAuth.post('/bdb/jukrah/post/' + pId + '/comment', { content: txt });
    setPostComments(prev => ({ ...prev, [pId]: [...(prev[pId] || []), res.data?.data] }));
    setCommentInputs(prev => ({ ...prev, [pId]: '' }));
    setPersonalPosts(prev => prev.map(p => p.id === pId ? { ...p, comments_count: (p.comments_count || 0) + 1 } : p));
  } catch {} finally {
    setSubmittingComment(!1);
  }
};
if((0,n.useEffect)(()=>{(async()=>{try{let e=await eT(),t=String(e?.role_bdb||"").toLowerCase();L.includes(t)&&await eD()}finally{E(!1)}})()},[]),N)return(0,t.jsxs)("div",{children:[
  (0,t.jsx)("style",{children:`
    @keyframes casShimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    .cas-skeleton-shimmer {
      background: linear-gradient(90deg, rgba(255, 255, 255, 0.03) 25%, rgba(255, 255, 255, 0.09) 50%, rgba(255, 255, 255, 0.03) 75%) !important;
      background-size: 200% 100% !important;
      animation: casShimmer 1.5s infinite ease-in-out !important;
      display: inline-block;
    }
  `}),
  (0,t.jsx)("h1",{className:"cms-page-title",style:{margin:0,fontSize:"1.6rem",fontWeight:800,color:"var(--cas-text-primary, #f8fafc)"},children:"Profil Personil CAS"}),
  (0,t.jsx)("p",{className:"cms-page-sub",style:{margin:"0.2rem 0 1rem",fontSize:"0.84rem",color:"#94a3b8"},children:"Memuat informasi akun, data kedinasan, dan otorisasi…"}),
  (0,t.jsxs)("div",{className:"cms-card",style:{borderRadius:"12px",overflow:"hidden",padding:0,marginBottom:"1.25rem"},children:[
    (0,t.jsx)("div",{className:"cas-skeleton-shimmer",style:{width:"100%",height:"130px",display:"block"}}),
    (0,t.jsxs)("div",{style:{padding:"1.25rem",display:"flex",gap:"1.25rem",alignItems:"flex-start",flexWrap:"wrap"},children:[
      (0,t.jsx)("div",{className:"cas-skeleton-shimmer",style:{width:"84px",height:"84px",borderRadius:"50%",marginTop:"-2.5rem",border:"3px solid #0f172a",flexShrink:0}}),
      (0,t.jsxs)("div",{style:{flex:1,display:"flex",flexDirection:"column",gap:"0.5rem"},children:[
        (0,t.jsx)("div",{className:"cas-skeleton-shimmer",style:{width:"220px",height:"20px",borderRadius:"4px"}}),
        (0,t.jsx)("div",{className:"cas-skeleton-shimmer",style:{width:"320px",height:"14px",borderRadius:"4px"}}),
        (0,t.jsxs)("div",{style:{display:"flex",gap:"0.5rem",marginTop:"0.25rem"},children:[
          (0,t.jsx)("div",{className:"cas-skeleton-shimmer",style:{width:"80px",height:"22px",borderRadius:"999px"}}),
          (0,t.jsx)("div",{className:"cas-skeleton-shimmer",style:{width:"100px",height:"22px",borderRadius:"999px"}})
        ]})
      ]})
    ]})
  ]}),
  (0,t.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))",gap:"1rem"},children:[
    [1, 2, 3].map(i => (
      (0,t.jsxs)("div",{key:i,className:"cms-card",style:{borderRadius:"10px",padding:"1.25rem",display:"flex",flexDirection:"column",gap:"0.75rem"},children:[
        (0,t.jsx)("div",{className:"cas-skeleton-shimmer",style:{width:"120px",height:"16px",borderRadius:"4px"}}),
        (0,t.jsx)("div",{className:"cas-skeleton-shimmer",style:{width:"100%",height:"12px",borderRadius:"4px"}}),
        (0,t.jsx)("div",{className:"cas-skeleton-shimmer",style:{width:"75%",height:"12px",borderRadius:"4px"}})
      ]})
    ))
  ]})
]});if(!a)return(0,t.jsx)("p",{className:"cms-page-sub",children:"Profil tidak tersedia."});let eB=String(a.name||a.email||"?").charAt(0).toUpperCase(),eH=String(a.role_bdb||"viewer").toLowerCase(),eK=B[eH]||"#64748b",eR="AKTIF"===String(a.status||"").toUpperCase(),eU=[a.local_password_enabled,a.email_otp_required,a.pin_required].filter(Boolean).length;return(0,t.jsxs)("div",{children:[(0,t.jsx)(s.Toast,{ref:e}),(0,t.jsx)(u.ConfirmDialog,{}),
// 1. PAGE HEADER ROW: Title on Left, Dropdown [ ⚙️ Pengaturan ▾ ] on Far Right (Pojok Kanan Atas)
(0,t.jsxs)("div",{
  style:{
    display:"flex",
    alignItems:"center",
    justifyContent:"space-between",
    marginBottom:"1.25rem",
    flexWrap:"wrap",
    gap:"0.75rem"
  },
  children:[
    (0,t.jsxs)("div",{children:[
      (0,t.jsx)("h1",{className:"cms-page-title",style:{margin:0,fontSize:"1.6rem",fontWeight:800,letterSpacing:"-0.02em",color:"var(--cas-text-primary, #f8fafc)"},children:"Profil Saya"}),
      (0,t.jsx)("p",{className:"cms-page-sub",style:{margin:"0.2rem 0 0",fontSize:"0.84rem",color:"#94a3b8"},children:"Informasi akun, data personil, dan keamanan."})
    ]}),

    // POJOK KANAN ATAS: DROPDOWN PENGATURAN (Keamanan & Profile Satker)
    !isReadOnlyMode && (0,t.jsxs)("div",{
      id:"cas-settings-dropdown-wrapper",
      style:{position:"relative"},
      children:[
        (0,t.jsxs)("button",{
          type:"button",
          "aria-label":"Pengaturan Profil dan Keamanan",
          onClick:()=>setDropdownOpen(v => !v),
          style:{
            background:"var(--cas-card-bg, rgba(15,23,42,0.8))",
            color:"var(--cas-text-primary, #f8fafc)",
            border:"1px solid var(--cas-border, rgba(56,189,248,0.3))",
            borderRadius:"24px",
            padding:"0.5rem 1.25rem",
            fontSize:"0.84rem",
            fontWeight:700,
            cursor:"pointer",
            display:"inline-flex",
            alignItems:"center",
            gap:"0.5rem",
            boxShadow:"0 2px 10px rgba(0,0,0,0.35)",
            backdropFilter:"blur(8px)"
          },
          children:[
            (0,t.jsx)("span",{style:{fontSize:"0.95rem"},children:"⚙️"}),
            (0,t.jsx)("span",{children:"Pengaturan ▾"})
          ]
        }),

        // DROPDOWN MENU POPOVER
        eDropdownOpen && (0,t.jsxs)("div",{
          style:{
            position:"absolute",
            top:"calc(100% + 8px)",
            right:0,
            minWidth:"280px",
            background:"#0f172a",
            border:"1px solid rgba(56,189,248,0.35)",
            borderRadius:"12px",
            boxShadow:"0 16px 36px rgba(0,0,0,0.75)",
            zIndex:1200,
            padding:"0.45rem",
            display:"grid",
            gap:"0.25rem",
            backdropFilter:"blur(16px)"
          },
          children:[
            // Option 1: Pengaturan Keamanan
            (0,t.jsxs)("button",{
              type:"button",
              onClick:()=>{
                setDropdownOpen(!1);
                setSettingsTab('keamanan');
                setSettingsModal(!0);
              },
              style:{
                display:"flex",
                alignItems:"center",
                gap:"0.85rem",
                width:"100%",
                padding:"0.75rem 0.95rem",
                background:"transparent",
                border:"none",
                borderRadius:"8px",
                color:"#f8fafc",
                cursor:"pointer",
                textAlign:"left",
                transition:"background 0.15s ease"
              },
              children:[
                (0,t.jsx)("span",{style:{fontSize:"1.35rem"},children:"🛡️"}),
                (0,t.jsxs)("div",{children:[
                  (0,t.jsx)("div",{style:{fontWeight:800,fontSize:"0.88rem",color:"#fff"},children:"Pengaturan Keamanan"}),
                  (0,t.jsx)("div",{style:{fontSize:"0.74rem",color:"#94a3b8",marginTop:"0.15rem"},children:"2FA, Google TOTP, OTP Email & PIN"})
                ]})
              ]
            }),

            // Divider
            (0,t.jsx)("div",{style:{height:"1px",background:"rgba(255,255,255,0.08)",margin:"0.25rem 0"}}),

            // Option 2: Pengaturan Profile Satker
            (0,t.jsxs)("button",{
              type:"button",
              onClick:()=>{
                setDropdownOpen(!1);
                setSettingsTab('satker');
                setSettingsModal(!0);
              },
              style:{
                display:"flex",
                alignItems:"center",
                gap:"0.85rem",
                width:"100%",
                padding:"0.75rem 0.95rem",
                background:"transparent",
                border:"none",
                borderRadius:"8px",
                color:"#f8fafc",
                cursor:"pointer",
                textAlign:"left",
                transition:"background 0.15s ease"
              },
              children:[
                (0,t.jsx)("span",{style:{fontSize:"1.35rem"},children:"🏢"}),
                (0,t.jsxs)("div",{children:[
                  (0,t.jsx)("div",{style:{fontWeight:800,fontSize:"0.88rem",color:"#fff"},children:"Pengaturan Profile Satker"}),
                  (0,t.jsx)("div",{style:{fontSize:"0.74rem",color:"#94a3b8",marginTop:"0.15rem"},children:"Wilayah penugasan, alamat & koordinat"})
                ]})
              ]
            })
          ]
        })
      ]
    })
  ]
}),

// 2. Read-Only Tactical Alert Banner (Hanya muncul jika mode terenkripsi uToken)
isReadOnlyMode && (0,t.jsxs)("div",{
  style:{
    background:"linear-gradient(135deg, rgba(2,132,199,0.15) 0%, rgba(15,23,42,0.6) 100%)",
    border:"1px solid rgba(56,189,248,0.3)",
    borderRadius:"12px",
    padding:"0.85rem 1.25rem",
    marginBottom:"1.25rem",
    display:"flex",
    alignItems:"center",
    justifyContent:"space-between",
    flexWrap:"wrap",
    gap:"0.75rem"
  },
  children:[
    (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.65rem"},children:[
      (0,t.jsx)("span",{style:{fontSize:"1.4rem"},children:"🛡️"}),
      (0,t.jsxs)("div",{children:[
        (0,t.jsx)("div",{style:{fontWeight:800,fontSize:"0.9rem",color:"#f8fafc"},children:"Profil Personil CAS (Mode Kedinasan - Terenkripsi)"}),
        (0,t.jsx)("div",{style:{fontSize:"0.75rem",color:"#94a3b8"},children:"Data identitas dan riwayat penugasan resmi Mabes Bareskrim Polri • Akses Terbatas (Read-Only)"})
      ]})
    ]}),
    (0,t.jsx)("button",{
      type:"button",
      onClick:() => { try { sessionStorage.removeItem('cas_view_user'); } catch(e){} window.location.href = '/cms/profile'; },
      style:{background:"#2563eb",color:"#fff",border:"none",padding:"0.4rem 0.95rem",borderRadius:"8px",fontSize:"0.8rem",fontWeight:700,cursor:"pointer",boxShadow:"0 2px 6px rgba(37,99,235,0.3)"},
      children:"⬅️ Kembali ke Profil Saya"
    })
  ]
}),

// 3. Contact Modal
(0,t.jsx)(r.Dialog,{
  header:"Info Kontak & Identitas Kedinasan",
  visible:eContactModal,
  onHide:()=>setContactModal(!1),
  style:{width:"30rem",maxWidth:"95vw"},
  modal:!0,
  dismissableMask:!0,
  children:(0,t.jsxs)("div",{style:{display:"grid",gap:"1rem"},children:[
    (0,t.jsxs)("div",{style:{background:"rgba(0,0,0,0.25)",padding:"0.85rem",borderRadius:"10px",border:"1px solid var(--cas-border, rgba(255,255,255,0.08))"},children:[
      (0,t.jsx)("div",{style:{fontSize:"0.72rem",color:"#94a3b8",fontWeight:700,letterSpacing:"0.05em"},children:"CALLSIGN CAS"}),
      (0,t.jsxs)("div",{style:{fontSize:"1rem",fontWeight:800,color:"#38bdf8",marginTop:"0.2rem"},children:[formatCallsign(a?.callsign, a?.id, a?.username)]})
    ]}),
    (0,t.jsxs)("div",{style:{background:"rgba(0,0,0,0.25)",padding:"0.85rem",borderRadius:"10px",border:"1px solid var(--cas-border, rgba(255,255,255,0.08))"},children:[
      (0,t.jsx)("div",{style:{fontSize:"0.72rem",color:"#94a3b8",fontWeight:700,letterSpacing:"0.05em"},children:"EMAIL DINAS POLRI"}),
      (0,t.jsx)("div",{style:{fontSize:"0.9rem",color:"#f8fafc",marginTop:"0.2rem",fontWeight:600},children:a?.email_polri||(typeof a?.email === "string" && a.email.endsWith("@polri.go.id") ? a.email : "Belum diatur")})
    ]}),
    (0,t.jsxs)("div",{style:{background:"rgba(0,0,0,0.25)",padding:"0.85rem",borderRadius:"10px",border:"1px solid var(--cas-border, rgba(255,255,255,0.08))"},children:[
      (0,t.jsx)("div",{style:{fontSize:"0.72rem",color:"#94a3b8",fontWeight:700,letterSpacing:"0.05em"},children:"NOMOR TELEPON / WHATSAPP"}),
      (0,t.jsx)("div",{style:{fontSize:"0.9rem",color:"var(--cas-text-primary, #f8fafc)",marginTop:"0.2rem",fontWeight:600},children:a?.no_hp||"Belum diatur"})
    ]}),
    (0,t.jsxs)("div",{style:{background:"rgba(0,0,0,0.25)",padding:"0.85rem",borderRadius:"10px",border:"1px solid var(--cas-border, rgba(255,255,255,0.08))"},children:[
      (0,t.jsx)("div",{style:{fontSize:"0.72rem",color:"#94a3b8",fontWeight:700,letterSpacing:"0.05em"},children:"SATUAN KERJA (SATKER)"}),
      (0,t.jsx)("div",{style:{fontSize:"0.9rem",color:"#f8fafc",marginTop:"0.2rem",fontWeight:600},children:(function(){
        var isSuper = ['1', '320', '15403', '15404', '16568', '16576', '16594'].includes(String(a?.id)) || a?.username === 'omeko11' || String(a?.role_bdb || a?.role || '').toLowerCase() === 'superadmin';
        if (isSuper) return "Badan Reserse Kriminal Polri (Bareskrim)";
        var s = a?.scope_satker_name || a?.satker || a?.satker_nama || a?.satuan || a?.scope_access_display;
        if (!s || s === 'BDB Superadmin' || s === '-') return "Badan Reserse Kriminal Polri (Bareskrim)";
        var sClean = String(s).trim().replace(/^operator\s*[-–—:]\s*/i, '');
        sClean = sClean.replace(/\bJAWA TIMUR\b/gi, 'Polda Jatim').replace(/\bJATIM\b/gi, 'Polda Jatim');
        sClean = sClean.replace(/\bRES\s+/gi, 'Polres ');
        sClean = sClean.toLowerCase().replace(/(?:^|\s|-|\/)[a-z]/g, function(c){return c.toUpperCase();});
        sClean = sClean.replace(/\bDit\s*Res\b/gi, 'Dit Res').replace(/\bDitres\b/gi, 'Dit Res').replace(/\bSat\s*Res\b/gi, 'Sat Res').replace(/\bSatres\b/gi, 'Sat Res').replace(/\bUnit\s*Res\b/gi, 'Unit Res').replace(/\bUnitres\b/gi, 'Unit Res').replace(/\bPolri\b/gi, 'Polri').replace(/\bPolda\b/gi, 'Polda').replace(/\bPolres\b/gi, 'Polres');
        return sClean;
      })()})
    ]}),
    !isReadOnlyMode && (0,t.jsx)("button",{
      type:"button",
      onClick:()=>{setContactModal(!1);openEditIntro()},
      style:{marginTop:"0.5rem",padding:"0.6rem",borderRadius:"8px",background:"#2563eb",color:"#fff",border:"none",fontWeight:700,cursor:"pointer",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:"0.4rem"},
      children:"✏️ Edit Data Kontak"
    })
  ]})
}),

// 4. Bio / Tentang Saya Modal
(0,t.jsx)(r.Dialog,{
  header:"Edit Tentang Saya",
  visible:Boolean(eBioModal && !isReadOnlyMode),
  onHide:()=>setBioModal(!1),
  style:{width:"36rem",maxWidth:"95vw"},
  modal:!0,
  dismissableMask:!0,
  footer:(0,t.jsxs)("div",{style:{display:"flex",justifyContent:"flex-end",gap:"0.5rem"},children:[
    (0,t.jsx)("button",{
      type:"button",
      onClick:()=>setBioModal(!1),
      style:{background:"transparent",color:"#94a3b8",border:"1px solid rgba(255,255,255,0.15)",borderRadius:"8px",padding:"0.5rem 1rem",fontSize:"0.82rem",fontWeight:700,cursor:"pointer"},
      children:"Batal"
    }),
    (0,t.jsx)("button",{
      type:"button",
      onClick:handleSaveBio,
      disabled:eSavingBio,
      style:{background:"#2563eb",color:"#fff",border:"none",borderRadius:"8px",padding:"0.5rem 1.25rem",fontSize:"0.82rem",fontWeight:700,cursor:eSavingBio?"not-allowed":"pointer"},
      children:eSavingBio?"Menyimpan...":"Simpan Ringkasan"
    })
  ]}),
  children:(0,t.jsxs)("div",{style:{display:"grid",gap:"0.75rem",padding:"0.5rem 0"},children:[
    (0,t.jsx)("p",{style:{fontSize:"0.82rem",color:"#94a3b8",margin:0},children:"Tuliskan ringkasan pengalaman profesional, spesialisasi keahlian siber/reserse, atau dedikasi tugas Anda di Bareskrim Polri."}),
    (0,t.jsx)("textarea",{
      value:eBio,
      onChange:ev=>setBio(ev.target.value),
      rows:6,
      maxLength:3000,
      placeholder:"Tuliskan ringkasan profil Anda di sini...",
      style:{width:"100%",fontSize:"0.88rem",lineHeight:1.55,padding:"0.75rem",borderRadius:"8px",border:"1px solid rgba(255,255,255,0.15)",background:"rgba(0,0,0,0.25)",color:"#fff",resize:"vertical",fontFamily:"inherit"}
    }),
    (0,t.jsxs)("div",{style:{display:"flex",justifyContent:"flex-end",fontSize:"0.74rem",color:eBio.length>=2800?'#ef4444':'#94a3b8'},children:[
      eBio.length," / 3.000 karakter"
    ]})
  ]})
}),

// 5. Experience Modal
(0,t.jsx)(r.Dialog,{
  header:eEditingExpIndex>=0?"Edit Riwayat Pengalaman":"Tambah Riwayat Pengalaman Baru",
  visible:Boolean(eExpModal && !isReadOnlyMode),
  onHide:()=>setExpModal(!1),
  style:{width:"36rem",maxWidth:"95vw"},
  modal:!0,
  dismissableMask:!0,
  footer:(0,t.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[
    eEditingExpIndex>=0?(0,t.jsx)("button",{
      type:"button",
      onClick:handleDeleteExp,
      disabled:eSavingExp,
      style:{background:"transparent",color:"#ef4444",border:"1px solid rgba(239,68,68,0.4)",borderRadius:"8px",padding:"0.5rem 1rem",fontSize:"0.82rem",fontWeight:700,cursor:"pointer"},
      children:"🗑️ Hapus"
    }):(0,t.jsx)("div",{}),
    (0,t.jsxs)("div",{style:{display:"flex",gap:"0.5rem"},children:[
      (0,t.jsx)("button",{
        type:"button",
        onClick:()=>setExpModal(!1),
        style:{background:"transparent",color:"#94a3b8",border:"1px solid rgba(255,255,255,0.15)",borderRadius:"8px",padding:"0.5rem 1rem",fontSize:"0.82rem",fontWeight:700,cursor:"pointer"},
        children:"Batal"
      }),
      (0,t.jsx)("button",{
        type:"button",
        onClick:handleSaveExp,
        disabled:eSavingExp,
        style:{background:"#2563eb",color:"#fff",border:"none",borderRadius:"8px",padding:"0.5rem 1.25rem",fontSize:"0.82rem",fontWeight:700,cursor:eSavingExp?"not-allowed":"pointer"},
        children:eSavingExp?"Menyimpan...":"Simpan Pengalaman"
      })
    ]})
  ]}),
  children:(0,t.jsxs)("div",{style:{display:"grid",gap:"0.85rem",padding:"0.5rem 0"},children:[
    (0,t.jsxs)("div",{children:[
      (0,t.jsx)("label",{style:{display:"block",fontSize:"0.78rem",fontWeight:700,color:"#cbd5e1",marginBottom:"0.3rem"},children:"Posisi / Jabatan *"}),
      (0,t.jsx)(i.InputText,{value:eExpForm.title,onChange:ev=>setExpForm({...eExpForm,title:ev.target.value}),placeholder:"Contoh: Penyelidik Siber / Kanit Reskrim / Software Engineer",style:{width:"100%",fontSize:"0.85rem"}}),
    ]}),
    (0,t.jsxs)("div",{children:[
      (0,t.jsx)("label",{style:{display:"block",fontSize:"0.78rem",fontWeight:700,color:"#cbd5e1",marginBottom:"0.3rem"},children:"Instansi / Satuan Kerja (Satker) *"}),
      (0,t.jsx)(i.InputText,{value:eExpForm.company,onChange:ev=>setExpForm({...eExpForm,company:ev.target.value}),placeholder:"Contoh: Bareskrim Polri / Ditreskrimsus Polda Metro Jaya",style:{width:"100%",fontSize:"0.85rem"}}),
    ]}),
    (0,t.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem"},children:[
      (0,t.jsxs)("div",{children:[
        (0,t.jsx)("label",{style:{display:"block",fontSize:"0.78rem",fontWeight:700,color:"#cbd5e1",marginBottom:"0.3rem"},children:"Periode Waktu"}),
        (0,t.jsx)(i.InputText,{value:eExpForm.period,onChange:ev=>setExpForm({...eExpForm,period:ev.target.value}),placeholder:"Contoh: 2021 - Sekarang",style:{width:"100%",fontSize:"0.85rem"}}),
      ]}),
      (0,t.jsxs)("div",{children:[
        (0,t.jsx)("label",{style:{display:"block",fontSize:"0.78rem",fontWeight:700,color:"#cbd5e1",marginBottom:"0.3rem"},children:"Lokasi Penugasan"}),
        (0,t.jsx)(i.InputText,{value:eExpForm.location,onChange:ev=>setExpForm({...eExpForm,location:ev.target.value}),placeholder:"Contoh: Mabes Polri, Jakarta Selatan",style:{width:"100%",fontSize:"0.85rem"}}),
      ]})
    ]}),
    (0,t.jsxs)("div",{children:[
      (0,t.jsx)("label",{style:{display:"block",fontSize:"0.78rem",fontWeight:700,color:"#cbd5e1",marginBottom:"0.3rem"},children:"Deskripsi Penugasan / Peran Taktis"}),
      (0,t.jsx)("textarea",{value:eExpForm.description,onChange:ev=>setExpForm({...eExpForm,description:ev.target.value}),rows:3,placeholder:"Uraikan peran utama, inovasi sistem, atau pencapaian penanganan perkara selama bertugas...",style:{width:"100%",fontSize:"0.85rem",padding:"0.6rem",borderRadius:"8px",border:"1px solid rgba(255,255,255,0.15)",background:"rgba(0,0,0,0.25)",color:"#fff",resize:"vertical",fontFamily:"inherit"}}),
    ]})
  ]})
}),

// 6. Education Modal
(0,t.jsx)(r.Dialog,{
  header:eEditingEduIndex>=0?"Edit Riwayat Pendidikan":"Tambah Riwayat Pendidikan Baru",
  visible:Boolean(eEduModal && !isReadOnlyMode),
  onHide:()=>setEduModal(!1),
  style:{width:"36rem",maxWidth:"95vw"},
  modal:!0,
  dismissableMask:!0,
  footer:(0,t.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[
    eEditingEduIndex>=0?(0,t.jsx)("button",{
      type:"button",
      onClick:handleDeleteEdu,
      disabled:eSavingEdu,
      style:{background:"transparent",color:"#ef4444",border:"1px solid rgba(239,68,68,0.4)",borderRadius:"8px",padding:"0.5rem 1rem",fontSize:"0.82rem",fontWeight:700,cursor:"pointer"},
      children:"🗑️ Hapus"
    }):(0,t.jsx)("div",{}),
    (0,t.jsxs)("div",{style:{display:"flex",gap:"0.5rem"},children:[
      (0,t.jsx)("button",{
        type:"button",
        onClick:()=>setEduModal(!1),
        style:{background:"transparent",color:"#94a3b8",border:"1px solid rgba(255,255,255,0.15)",borderRadius:"8px",padding:"0.5rem 1rem",fontSize:"0.82rem",fontWeight:700,cursor:"pointer"},
        children:"Batal"
      }),
      (0,t.jsx)("button",{
        type:"button",
        onClick:handleSaveEdu,
        disabled:eSavingEdu,
        style:{background:"#2563eb",color:"#fff",border:"none",borderRadius:"8px",padding:"0.5rem 1.25rem",fontSize:"0.82rem",fontWeight:700,cursor:eSavingEdu?"not-allowed":"pointer"},
        children:eSavingEdu?"Menyimpan...":"Simpan Pendidikan"
      })
    ]})
  ]}),
  children:(0,t.jsxs)("div",{style:{display:"grid",gap:"0.85rem",padding:"0.5rem 0"},children:[
    (0,t.jsxs)("div",{children:[
      (0,t.jsx)("label",{style:{display:"block",fontSize:"0.78rem",fontWeight:700,color:"#cbd5e1",marginBottom:"0.3rem"},children:"Institusi / Universitas / Pusdik *"}),
      (0,t.jsx)(i.InputText,{value:eEduForm.school,onChange:ev=>setEduForm({...eEduForm,school:ev.target.value}),placeholder:"Contoh: Universitas Nusa Mandiri / Pusdik Reskrim Lemdiklat Polri / Akpol",style:{width:"100%",fontSize:"0.85rem"}}),
    ]}),
    (0,t.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem"},children:[
      (0,t.jsxs)("div",{children:[
        (0,t.jsx)("label",{style:{display:"block",fontSize:"0.78rem",fontWeight:700,color:"#cbd5e1",marginBottom:"0.3rem"},children:"Gelar / Jenjang / Kejuruan"}),
        (0,t.jsx)(i.InputText,{value:eEduForm.degree,onChange:ev=>setEduForm({...eEduForm,degree:ev.target.value}),placeholder:"Contoh: Sarjana Komputer (S.Kom.) / Dikjur Spesialisasi",style:{width:"100%",fontSize:"0.85rem"}}),
      ]}),
      (0,t.jsxs)("div",{children:[
        (0,t.jsx)("label",{style:{display:"block",fontSize:"0.78rem",fontWeight:700,color:"#cbd5e1",marginBottom:"0.3rem"},children:"Bidang Studi / Fokus Keahlian"}),
        (0,t.jsx)(i.InputText,{value:eEduForm.field,onChange:ev=>setEduForm({...eEduForm,field:ev.target.value}),placeholder:"Contoh: Teknik Informatika / Siber",style:{width:"100%",fontSize:"0.85rem"}}),
      ]})
    ]}),
    (0,t.jsxs)("div",{children:[
      (0,t.jsx)("label",{style:{display:"block",fontSize:"0.78rem",fontWeight:700,color:"#cbd5e1",marginBottom:"0.3rem"},children:"Tahun / Periode Kelulusan"}),
      (0,t.jsx)(i.InputText,{value:eEduForm.year,onChange:ev=>setEduForm({...eEduForm,year:ev.target.value}),placeholder:"Contoh: 2016 - 2020",style:{width:"100%",fontSize:"0.85rem"}}),
    ]}),
    (0,t.jsxs)("div",{children:[
      (0,t.jsx)("label",{style:{display:"block",fontSize:"0.78rem",fontWeight:700,color:"#cbd5e1",marginBottom:"0.3rem"},children:"Keterangan Tambahan / Prestasi"}),
      (0,t.jsx)(i.InputText,{value:eEduForm.description,onChange:ev=>setEduForm({...eEduForm,description:ev.target.value}),placeholder:"Rekayasa Perangkat Lunak, Jaringan Terdistribusi & Keamanan Siber",style:{width:"100%",fontSize:"0.85rem"}}),
    ]})
  ]})
}),

// 7. Banner Theme Modal
(0,t.jsx)(r.Dialog,{
  header:"Kustomisasi Banner Sampul Taktis",
  visible:Boolean(eBannerModal && !isReadOnlyMode),
  onHide:()=>setBannerModal(!1),
  style:{width:"34rem",maxWidth:"95vw"},
  contentStyle:{overflowX:"hidden",padding:"1rem 1.25rem"},
  modal:!0,
  dismissableMask:!0,
  footer:(0,t.jsxs)("div",{style:{display:"flex",justifyContent:"flex-end",gap:"0.5rem"},children:[
    (0,t.jsx)("button",{
      type:"button",
      onClick:()=>setBannerModal(!1),
      style:{background:"transparent",color:"#64748b",border:"1px solid #cbd5e1",borderRadius:"8px",padding:"0.5rem 1rem",fontSize:"0.82rem",fontWeight:700,cursor:"pointer"},
      children:"Batal"
    }),
    (0,t.jsx)("button",{
      type:"button",
      onClick:handleSaveBanner,
      style:{background:"#2563eb",color:"#fff",border:"none",borderRadius:"8px",padding:"0.5rem 1.25rem",fontSize:"0.82rem",fontWeight:700,cursor:"pointer"},
      children:"Terapkan Sampul"
    })
  ]}),
  children:(0,t.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.85rem",width:"100%",boxSizing:"border-box",overflowX:"hidden"},children:[
    (0,t.jsx)("label",{style:{fontSize:"0.8rem",color:"#334155",fontWeight:700},children:"Pilih Tema Taktis CAS:"}),
    (0,t.jsx)("div",{
      style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.6rem",width:"100%",boxSizing:"border-box"},
      children:[
        { id: "cyber_blue", name: "Cyber Ops Blue", grad: "linear-gradient(135deg, #090d16 0%, #0f172a 45%, #1e293b 85%, #0369a1 100%)" },
        { id: "stealth_dark", name: "Stealth Reskrim", grad: "linear-gradient(135deg, #020617 0%, #0f172a 60%, #1e1b4b 100%)" },
        { id: "emerald_shield", name: "Tactical Emerald", grad: "linear-gradient(135deg, #022c22 0%, #064e3b 50%, #0f172a 100%)" },
        { id: "gold_command", name: "Gold Command", grad: "linear-gradient(135deg, #1c1917 0%, #292524 50%, #78350f 100%)" }
      ].map(thm => (0,t.jsx)("button",{
        key:thm.id,
        type:"button",
        onClick:()=>{setBannerTheme(thm.grad);setRawBanner(null);},
        style:{
          height:"50px",
          borderRadius:"8px",
          background:thm.grad,
          border:eBannerTheme===thm.grad?"2px solid #0284c7":"1px solid rgba(255,255,255,0.2)",
          color:"#fff",
          fontSize:"0.78rem",
          fontWeight:700,
          cursor:"pointer",
          display:"flex",
          alignItems:"center",
          justifyContent:"center",
          boxShadow:eBannerTheme===thm.grad?"0 0 10px rgba(2,132,199,0.5)":"none"
        },
        children:thm.name
      }))
    }),
    (0,t.jsx)("div",{style:{borderTop:"1px solid #e2e8f0",margin:"0.2rem 0"}}),
    (0,t.jsx)("label",{style:{fontSize:"0.8rem",color:"#334155",fontWeight:700},children:"Atau Unggah Foto Sampul Kustom Sendiri:"}),
    (0,t.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.6rem",width:"100%",boxSizing:"border-box"},children:[
      (0,t.jsx)("input",{
        id:"custom-banner-file-input",
        type:"file",
        style:{display:"none"},
        accept:"image/png,image/jpeg,image/webp",
        onChange:function(ev){
          let f = ev.target.files?.[0];
          if (!f) return;
          setCustomBannerLoading(!0);
          let r = new FileReader();
          r.onload = function(e2){
            let img = new Image();
            img.onload = function(){
              let maxDim = 1400;
              let w = img.width, h = img.height;
              let scale = Math.min(1, maxDim / Math.max(w, h));
              let cv = document.createElement("canvas");
              cv.width = Math.round(w * scale);
              cv.height = Math.round(h * scale);
              let cx = cv.getContext("2d");
              cx.drawImage(img, 0, 0, cv.width, cv.height);
              let compressed = cv.toDataURL("image/jpeg", 0.85);
              setRawBanner(compressed);
              setBannerTheme(compressed);
              setBannerZoom(1);
              setBannerPanX(0);
              setBannerPanY(0);
              setCustomBannerLoading(!1);
            };
            img.onerror = function(){
              setCustomBannerLoading(!1);
              e.current?.show({ severity: 'error', summary: 'Gagal', detail: 'Format gambar tidak didukung.' });
            };
            img.src = e2.target.result;
          };
          r.onerror = function(){
            setCustomBannerLoading(!1);
            e.current?.show({ severity: 'error', summary: 'Gagal', detail: 'Gagal membaca file gambar.' });
          };
          r.readAsDataURL(f);
        }
      }),
      (0,t.jsxs)("button",{
        type:"button",
        disabled:eCustomBannerLoading,
        onClick:() => document.getElementById('custom-banner-file-input')?.click(),
        style:{background:"#eff6ff",border:"1px dashed #3b82f6",borderRadius:"8px",padding:"0.65rem",color:"#2563eb",fontSize:"0.8rem",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem",width:"100%",boxSizing:"border-box"},
        children:[
          (0,t.jsx)("span",{children:"📷"}),
          (0,t.jsx)("span",{children:eCustomBannerLoading ? "Mengompresi gambar..." : "Pilih Foto Sampul dari Perangkat"})
        ]
      }),
      ((eRawBanner || (eBannerTheme && (eBannerTheme.startsWith('data:') || eBannerTheme.startsWith('http')))) && (0,t.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.55rem",width:"100%",boxSizing:"border-box"},children:[
        (0,t.jsxs)("div",{id:"cas-banner-crop-box",style:{position:"relative",borderRadius:"8px",overflow:"hidden",width:"100%",maxWidth:"100%",aspectRatio:`${(typeof document !== 'undefined' && document.getElementById("cas-profile-hero-banner") && document.getElementById("cas-profile-hero-banner").offsetHeight) ? (document.getElementById("cas-profile-hero-banner").offsetWidth / document.getElementById("cas-profile-hero-banner").offsetHeight).toFixed(3) : 6.2} / 1`,border:"1.5px solid #0284c7",background:"#090d16",display:"flex",alignItems:"center",justifyContent:"center",boxSizing:"border-box"},children:[
          (0,t.jsx)("img",{id:"cas-banner-crop-img",src:eRawBanner || eBannerTheme,alt:"Pratinjau Sampul",style:{position:"absolute",left:"50%",top:"50%",maxWidth:"100%",maxHeight:"100%",objectFit:"contain",transform:`translate(-50%, -50%) translate(${eBannerPanX}px, ${eBannerPanY}px) scale(${eBannerZoom})`,transformOrigin:"center center",pointerEvents:"none"}}),
          (0,t.jsx)("div",{style:{position:"absolute",bottom:"4px",right:"6px",background:"rgba(0,0,0,0.75)",color:"#38bdf8",padding:"2px 8px",borderRadius:"4px",fontSize:"0.68rem",fontWeight:700},children:"Pratinjau Sampul (100% Sesuai Hasil)"})
        ]}),
        (0,t.jsxs)("div",{style:{display:"flex",gap:"0.4rem",justifyContent:"center",width:"100%",boxSizing:"border-box"},children:[
          (0,t.jsx)("button",{type:"button",onClick:()=>{setBannerZoom(1);setBannerPanX(0);setBannerPanY(0);},style:{flex:1,padding:"0.4rem 0.6rem",fontSize:"0.75rem",fontWeight:600,borderRadius:"6px",border:"1px solid #cbd5e1",background:"#f1f5f9",color:"#1e293b",cursor:"pointer"},children:"Muat Semua (Fit)"}),
          (0,t.jsx)("button",{type:"button",onClick:()=>{
            let box = document.getElementById("cas-banner-crop-box");
            let img = document.getElementById("cas-banner-crop-img");
            if (box && img && img.offsetWidth > 0 && img.offsetHeight > 0) {
              let fz = Math.min(3, Math.max(1, Math.max(box.offsetWidth / img.offsetWidth, box.offsetHeight / img.offsetHeight)));
              setBannerZoom(parseFloat(fz.toFixed(2)));
            } else {
              setBannerZoom(1.5);
            }
            setBannerPanX(0);
            setBannerPanY(0);
          },style:{flex:1,padding:"0.4rem 0.6rem",fontSize:"0.75rem",fontWeight:600,borderRadius:"6px",border:"1px solid #38bdf8",background:"#e0f2fe",color:"#0284c7",cursor:"pointer"},children:"Isi Penuh (Fill)"}),
          (0,t.jsx)("button",{type:"button",onClick:()=>{setBannerZoom(1);setBannerPanX(0);setBannerPanY(0);},style:{padding:"0.4rem 0.8rem",fontSize:"0.75rem",fontWeight:600,borderRadius:"6px",border:"1px solid #cbd5e1",background:"#f8fafc",color:"#64748b",cursor:"pointer"},children:"Reset (100%)"})
        ]}),
        (0,t.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.45rem",background:"#f8fafc",border:"1px solid #e2e8f0",padding:"0.7rem 0.85rem",borderRadius:"8px",fontSize:"0.75rem",width:"100%",boxSizing:"border-box"},children:[
          (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between"},children:[
            (0,t.jsx)("span",{style:{color:"#334155",fontWeight:600},children:"Ukuran Gambar (Zoom)"}),
            (0,t.jsx)("span",{style:{fontWeight:700,color:"#0284c7"},children:`${Math.round(eBannerZoom*100)}%`})
          ]}),
          (0,t.jsx)("input",{type:"range",min:"0.3",max:"3",step:"0.05",value:eBannerZoom,onChange:e=>setBannerZoom(parseFloat(e.target.value)),style:{width:"100%",accentColor:"#0284c7",cursor:"pointer",margin:0}}),
          (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:"0.2rem"},children:[
            (0,t.jsx)("span",{style:{color:"#334155",fontWeight:600},children:"Geser Kiri / Kanan"}),
            (0,t.jsx)("span",{style:{fontWeight:600,color:"#64748b"},children:`${eBannerPanX}px`})
          ]}),
          (0,t.jsx)("input",{type:"range",min:"-200",max:"200",step:"1",value:eBannerPanX,onChange:e=>setBannerPanX(parseInt(e.target.value)),style:{width:"100%",accentColor:"#0284c7",cursor:"pointer",margin:0}}),
          (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:"0.2rem"},children:[
            (0,t.jsx)("span",{style:{color:"#334155",fontWeight:600},children:"Geser Atas / Bawah"}),
            (0,t.jsx)("span",{style:{fontWeight:600,color:"#64748b"},children:`${eBannerPanY}px`})
          ]}),
          (0,t.jsx)("input",{type:"range",min:"-160",max:"160",step:"1",value:eBannerPanY,onChange:e=>setBannerPanY(parseInt(e.target.value)),style:{width:"100%",accentColor:"#0284c7",cursor:"pointer",margin:0}})
        ]})
      ]}))
    ]})
  ]})
}),

// 8. Add Section Modal
(0,t.jsx)(r.Dialog,{
  header:"Tambahkan Bagian ke Profil",
  visible:Boolean(eAddSectionModal && !isReadOnlyMode),
  onHide:()=>setAddSectionModal(!1),
  style:{width:"32rem",maxWidth:"95vw"},
  modal:!0,
  dismissableMask:!0,
  children:(0,t.jsxs)("div",{style:{display:"grid",gap:"0.65rem",padding:"0.5rem 0"},children:[
    {
      icon:"📖",
      title:"Tentang Saya (Ringkasan)",
      desc:"Tambahkan bio atau deskripsi tentang pengalaman dan bidang keahlian Anda",
      action:()=>{setAddSectionModal(!1);setBioModal(!0);}
    },
    {
      icon:"💼",
      title:"Riwayat Pengalaman",
      desc:"Tambahkan posisi kedinasan, jabatan struktural, atau riwayat penugasan",
      action:()=>{setAddSectionModal(!1);openAddExp();}
    },
    {
      icon:"🎓",
      title:"Riwayat Pendidikan",
      desc:"Tambahkan universitas, sekolah kedinasan, atau pendidikan kejuruan Polri",
      action:()=>{setAddSectionModal(!1);openAddEdu();}
    },
    {
      icon:"🔗",
      title:"Tautan & Media Sosial",
      desc:"Hubungkan profil dengan akun media sosial atau portofolio digital",
      action:()=>{setAddSectionModal(!1);openEditIntro();}
    },
    {
      icon:"🛡️",
      title:"Pengaturan Keamanan Mandiri (2FA)",
      desc:"Konfigurasi kata sandi, Google Authenticator (TOTP), dan PIN otorisasi",
      action:()=>{
        setAddSectionModal(!1);
        setSettingsTab('keamanan');
        setSettingsModal(!0);
      }
    }
  ].map((sec,idx)=>(0,t.jsxs)("button",{
    key:idx,
    type:"button",
    onClick:sec.action,
    style:{
      display:"flex",
      alignItems:"center",
      gap:"0.85rem",
      padding:"0.85rem 1rem",
      borderRadius:"10px",
      border:"1px solid var(--cas-border, rgba(255,255,255,0.08))",
      background:"rgba(255,255,255,0.03)",
      textAlign:"left",
      cursor:"pointer",
      color:"inherit"
    },
    children:[
      (0,t.jsx)("span",{style:{fontSize:"1.5rem"},children:sec.icon}),
      (0,t.jsxs)("div",{style:{flex:1},children:[
        (0,t.jsx)("div",{style:{fontWeight:800,fontSize:"0.88rem",color:"#f8fafc"},children:sec.title}),
        (0,t.jsx)("div",{style:{fontSize:"0.76rem",color:"#94a3b8",marginTop:"0.15rem"},children:sec.desc})
      ]}),
      (0,t.jsx)("span",{style:{fontSize:"1.1rem",color:"#38bdf8"},children:"➕"})
    ]
  }))})
}),

// 9. PENGATURAN PROFIL & KEAMANAN MODAL (FULL 2FA & TOTP ENGINE)
(0,t.jsx)(r.Dialog,{
  header:(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[
    (0,t.jsx)("span",{style:{fontSize:"1.2rem"},children:"⚙️"}),
    (0,t.jsx)("span",{style:{fontWeight:800},children:"Pengaturan Profil & Keamanan Kedinasan"})
  ]}),
  visible:Boolean(eSettingsModal && !isReadOnlyMode),
  onHide:()=>setSettingsModal(!1),
  style:{width:"48rem",maxWidth:"95vw"},
  modal:!0,
  dismissableMask:!0,
  children:(0,t.jsxs)("div",{style:{display:"grid",gap:"1.1rem",padding:"0.35rem 0"},children:[
    // Modal Navigation Tabs
    (0,t.jsxs)("div",{style:{display:"flex",gap:"0.5rem",background:"rgba(0,0,0,0.25)",padding:"0.3rem",borderRadius:"10px",border:"1px solid rgba(255,255,255,0.08)"},children:[
      (0,t.jsxs)("button",{
        type:"button",
        onClick:()=>setSettingsTab('keamanan'),
        style:{
          flex:1,
          padding:"0.6rem 1rem",
          borderRadius:"8px",
          border:"none",
          background:eSettingsTab==='keamanan'?'#2563eb':'transparent',
          color:eSettingsTab==='keamanan'?'#fff':'#94a3b8',
          fontWeight:800,
          fontSize:"0.85rem",
          cursor:"pointer",
          display:"flex",
          alignItems:"center",
          justifyContent:"center",
          gap:"0.4rem"
        },
        children:[
          (0,t.jsx)("span",{children:"🛡️"}),
          (0,t.jsx)("span",{children:"Keamanan Mandiri & Autentikasi (2FA)"})
        ]
      }),
      (0,t.jsxs)("button",{
        type:"button",
        onClick:()=>setSettingsTab('satker'),
        style:{
          flex:1,
          padding:"0.6rem 1rem",
          borderRadius:"8px",
          border:"none",
          background:eSettingsTab==='satker'?'#2563eb':'transparent',
          color:eSettingsTab==='satker'?'#fff':'#94a3b8',
          fontWeight:800,
          fontSize:"0.85rem",
          cursor:"pointer",
          display:"flex",
          alignItems:"center",
          justifyContent:"center",
          gap:"0.4rem"
        },
        children:[
          (0,t.jsx)("span",{children:"🏢"}),
          (0,t.jsx)("span",{children:"Profil Satker & Wilayah Penugasan"})
        ]
      })
    ]}),

    // TAB 1: KEAMANAN MANDIRI & 2FA
    eSettingsTab === 'keamanan' && (0,t.jsxs)("div",{style:{display:"grid",gap:"1rem"},children:[
      (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(255,255,255,0.02)",padding:"0.75rem 1rem",borderRadius:"10px",border:"1px solid rgba(255,255,255,0.06)"},children:[
        (0,t.jsxs)("div",{children:[
          (0,t.jsx)("div",{style:{fontWeight:800,fontSize:"0.9rem",color:"#fff"},children:"Tingkat Proteksi Akun"}),
          (0,t.jsx)("div",{style:{fontSize:"0.75rem",color:"#94a3b8",marginTop:"0.1rem"},children:"Status kepatuhan autentikasi multi-faktor (MFA) standar Mabes Polri"})
        ]}),
        (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.4rem",background:([a?.email_otp_required,a?.pin_required,a?.totp_enabled].filter(Boolean).length>=2)?"rgba(34,197,94,0.15)":([a?.email_otp_required,a?.pin_required,a?.totp_enabled].filter(Boolean).length===1)?"rgba(56,189,248,0.15)":"rgba(245,158,11,0.15)",border:"1px solid "+(([a?.email_otp_required,a?.pin_required,a?.totp_enabled].filter(Boolean).length>=2)?"rgba(34,197,94,0.4)":([a?.email_otp_required,a?.pin_required,a?.totp_enabled].filter(Boolean).length===1)?"rgba(56,189,248,0.4)":"rgba(245,158,11,0.4)"),padding:"0.25rem 0.75rem",borderRadius:"999px"},children:[
          (0,t.jsx)("span",{style:{display:"inline-block",width:7,height:7,borderRadius:"999px",background:([a?.email_otp_required,a?.pin_required,a?.totp_enabled].filter(Boolean).length>=2)?"#22c55e":([a?.email_otp_required,a?.pin_required,a?.totp_enabled].filter(Boolean).length===1)?"#38bdf8":"#f59e0b"}}),
          (0,t.jsx)("span",{style:{fontSize:"0.75rem",fontWeight:800,color:([a?.email_otp_required,a?.pin_required,a?.totp_enabled].filter(Boolean).length>=2)?"#4ade80":([a?.email_otp_required,a?.pin_required,a?.totp_enabled].filter(Boolean).length===1)?"#38bdf8":"#fbbf24"},children:([a?.email_otp_required,a?.pin_required,a?.totp_enabled].filter(Boolean).length>=2)?"Sangat Kuat (2FA Aktif)":([a?.email_otp_required,a?.pin_required,a?.totp_enabled].filter(Boolean).length===1)?"Kuat (1 Metode)":"Standar"})
        ]})
      ]}),
      // Password
      (0,t.jsx)(V,{id:"fld-cfg-pwd",name:"field_cfg_pwd",icon:(0,t.jsx)(w.KeyRound,{size:15}),label:"Password Akun",hint:"Kredensial login mandiri Anda",active:!!a?.local_password_enabled,action:(0,t.jsx)("a",{href:"/cms/profile/reset-password",style:{fontSize:"0.76rem",fontWeight:700,color:"#38bdf8",padding:"0.35rem 0.75rem",textDecoration:"none",borderRadius:"6px",border:"1px solid rgba(56,189,248,0.35)",background:"rgba(56,189,248,0.08)"},children:"Ubah Password"})}),
      // 2FA Subheader
      (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.4rem",marginTop:"0.6rem",paddingBottom:"0.35rem",borderBottom:"1px solid rgba(255,255,255,0.08)"},children:[
        (0,t.jsx)(O.ShieldCheck,{size:14,style:{color:"#38bdf8"}}),
        (0,t.jsx)("span",{style:{fontSize:"0.76rem",fontWeight:800,color:"#e2e8f0",letterSpacing:"0.5px",textTransform:"uppercase"},children:"Otentikasi Dua Langkah (2FA)"}),
        (0,t.jsx)("span",{style:{fontSize:"0.68rem",color:([a?.email_otp_required,a?.pin_required,a?.totp_enabled].filter(Boolean).length>=2)?"#f59e0b":"#94a3b8",marginLeft:"auto"},children:([a?.email_otp_required,a?.pin_required,a?.totp_enabled].filter(Boolean).length>=2)?"Maksimal 2 metode aktif":"Pilih maksimal 2 metode aktif"})
      ]}),
      // OTP Email
      (0,t.jsx)(V,{id:"fld-cfg-email-otp",name:"field_cfg_email_otp",icon:(0,t.jsx)(x.Mail,{size:15}),label:"OTP Email Kedinasan",hint:a?.email_otp_required?"Aktif sebagai metode verifikasi saat login":"Verifikasi kode OTP 6-digit ke email dinas Polri saat login",active:!!a?.email_otp_required,action:(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.6rem"},children:[renderSwitch(!!a?.email_otp_required,()=>a?.email_otp_required?promptDisable("email_otp"):openSecurityModal("enable_email_otp"),ey,!a?.email_otp_required&&([a?.email_otp_required,a?.pin_required,a?.totp_enabled].filter(Boolean).length>=2),"Maksimal 2 metode keamanan aktif"),a?.email_otp_required?(0,t.jsx)(o.Button,{text:!0,size:"small",onClick:()=>promptDisable("email_otp"),loading:ey,style:{fontSize:"0.72rem",fontWeight:700,color:"#dc2626",padding:"0.2rem 0.4rem"},children:"Nonaktifkan"}):(0,t.jsx)(o.Button,{text:!0,size:"small",onClick:()=>openSecurityModal("enable_email_otp"),disabled:([a?.email_otp_required,a?.pin_required,a?.totp_enabled].filter(Boolean).length>=2),loading:ey,style:{fontSize:"0.72rem",fontWeight:700,color:([a?.email_otp_required,a?.pin_required,a?.totp_enabled].filter(Boolean).length>=2)?"#64748b":"#16a34a",padding:"0.2rem 0.4rem"},children:"Aktifkan"})]})}),
      // PIN Keamanan
      (0,t.jsx)(V,{id:"fld-cfg-pin",name:"field_cfg_pin",icon:(0,t.jsx)(S.Hash,{size:15}),label:"PIN Keamanan",hint:a?.pin_required?"Aktif sebagai lapisan otorisasi tindakan sensitif & login":"PIN 6-8 digit angka untuk otorisasi akses sensitif",active:!!a?.pin_required,action:(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[renderSwitch(!!a?.pin_required,()=>a?.pin_required?promptDisable("pin"):openSecurityModal("enable_pin"),ey,!a?.pin_required&&([a?.email_otp_required,a?.pin_required,a?.totp_enabled].filter(Boolean).length>=2),"Maksimal 2 metode keamanan aktif"),a?.pin_required?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(o.Button,{text:!0,size:"small",onClick:()=>openSecurityModal("change_pin"),loading:ey,style:{fontSize:"0.72rem",fontWeight:700,padding:"0.2rem 0.4rem"},children:"Ubah"}),(0,t.jsx)(o.Button,{text:!0,size:"small",onClick:()=>promptDisable("pin"),loading:ey,style:{fontSize:"0.72rem",fontWeight:700,color:"#dc2626",padding:"0.2rem 0.4rem"},children:"Nonaktifkan"})]}):(0,t.jsx)(o.Button,{text:!0,size:"small",onClick:()=>openSecurityModal("enable_pin"),disabled:([a?.email_otp_required,a?.pin_required,a?.totp_enabled].filter(Boolean).length>=2),loading:ey,style:{fontSize:"0.72rem",fontWeight:700,color:([a?.email_otp_required,a?.pin_required,a?.totp_enabled].filter(Boolean).length>=2)?"#64748b":"#16a34a",padding:"0.2rem 0.4rem"},children:"Aktifkan"})]})}),
      // Google Authenticator TOTP
      (0,t.jsx)(V,{id:"fld-cfg-totp",name:"field_cfg_totp",icon:(0,t.jsx)(O.ShieldCheck,{size:15}),label:"Google Authenticator (TOTP)",hint:a?.totp_enabled?"Aktif sebagai kode verifikasi login instan dari aplikasi (RFC 6238)":"Kode otentikasi 6-digit dari aplikasi ponsel (Google/MS Authenticator)",active:!!a?.totp_enabled,action:(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.6rem"},children:[renderSwitch(!!a?.totp_enabled,()=>a?.totp_enabled?promptDisable("totp"):startTotpSetup(),eTotpLoading,!a?.totp_enabled&&([a?.email_otp_required,a?.pin_required,a?.totp_enabled].filter(Boolean).length>=2),"Maksimal 2 metode keamanan aktif"),a?.totp_enabled?(0,t.jsx)(o.Button,{text:!0,size:"small",onClick:()=>promptDisable("totp"),loading:ey,style:{fontSize:"0.72rem",fontWeight:700,color:"#dc2626",padding:"0.2rem 0.4rem"},children:"Nonaktifkan"}):(0,t.jsx)(o.Button,{text:!0,size:"small",onClick:()=>startTotpSetup(),disabled:([a?.email_otp_required,a?.pin_required,a?.totp_enabled].filter(Boolean).length>=2),loading:eTotpLoading,style:{fontSize:"0.72rem",fontWeight:700,color:([a?.email_otp_required,a?.pin_required,a?.totp_enabled].filter(Boolean).length>=2)?"#64748b":"#16a34a",padding:"0.2rem 0.4rem"},children:"Aktifkan"})]})}),
      // Passkey
      (0,t.jsx)(V,{id:"fld-cfg-bio",name:"field_cfg_bio",icon:(0,t.jsx)(w.KeyRound,{size:15,style:{color:"#10b981"}}),label:"Biometrik Perangkat (Passkey)",hint:ePasskeyDevices.length>0?(ePasskeyDevices.length+" gawai terpercaya aktif untuk login biometrik (wajah / sidik jari / PIN)"):"Login cepat menggunakan biometrik wajah, sidik jari, atau PIN perangkat (FIDO2)",active:ePasskeyDevices.length>0,last:!1,action:(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[renderSwitch(ePasskeyDevices.length>0,function(){ePasskeyDevices.length>0?setPasskeyModal(!0):handleRegisterPasskey()},ePasskeyLoading,!1,"Klik untuk mendaftar atau mengelola gawai terpercaya"),ePasskeyDevices.length>0?(0,t.jsx)(o.Button,{text:!0,size:"small",onClick:function(){setPasskeyModal(!0)},style:{fontSize:"0.72rem",fontWeight:700,color:"#38bdf8",padding:"0.2rem 0.4rem"},children:"Kelola ("+ePasskeyDevices.length+")"}):(0,t.jsx)(o.Button,{text:!0,size:"small",onClick:function(){handleRegisterPasskey()},loading:ePasskeyLoading,style:{fontSize:"0.72rem",fontWeight:700,color:"#16a34a",padding:"0.2rem 0.4rem"},children:"+ Daftarkan Gawai"})]})}),
      (0,t.jsx)(V,{id:"fld-cfg-trusted-devices",name:"field_cfg_trusted_devices",icon:(0,t.jsx)(w.KeyRound,{size:15,style:{color:"#a855f7"}}),label:"Perangkat & Gawai Terpercaya",hint:ePasskeyDevices.length>0?"Audit dan cabut izin gawai biometrik yang pernah didaftarkan":"Kelola gawai yang memiliki akses biometrik tanpa kata sandi",active:ePasskeyDevices.length>0,last:!0,action:(0,t.jsx)(o.Button,{size:"small",onClick:function(){setPasskeyModal(!0)},style:{fontSize:"0.72rem",fontWeight:700,background:"rgba(168,85,247,0.15)",color:"#c084fc",border:"1px solid rgba(168,85,247,0.3)",padding:"0.22rem 0.6rem",borderRadius:"6px"},children:"Kelola Gawai ("+ePasskeyDevices.length+")"})})
    ]}),

    // TAB 2: PROFIL / DATA WILAYAH SATKER
    eSettingsTab === 'satker' && (0,t.jsxs)("div",{style:{display:"grid",gap:"0.85rem"},children:[
      (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.5rem"},children:[
        (0,t.jsxs)("div",{children:[
          (0,t.jsx)("div",{style:{fontWeight:800,fontSize:"0.95rem",color:"#fff"},children:eb?.deskripsi||K(a?.scope_satker_name)||"Satuan Kerja Mabes Polri"}),
          (0,t.jsxs)("div",{style:{fontSize:"0.76rem",color:"#94a3b8",marginTop:"0.15rem"},children:["Kode Satker: ",(0,t.jsx)("strong",{style:{color:"#38bdf8"},children:eb?.kode||a?.scope_satker_key||"060.01.00.00"})," • Wilayah hukum & parameter crime rate"]})
        ]}),
        eb&&(0,t.jsxs)(o.Button,{
          onClick:function(){
            eb&&(eE({alamat:eb.alamat||"",provinsi:eb.provinsi||"",kabupaten_kota:eb.kabupaten_kota||"",kecamatan:eb.kecamatan||"",desa:eb.desa||"",kode_pos:eb.kode_pos||"",longitude:eb.longitude||"",latitude:eb.latitude||"",jumlah_penduduk:eb.jumlah_penduduk||""}),eP(!0));
            setSettingsModal(!1);
          },
          className:"att-btn",
          size:"small",
          style:{background:"#2563eb",color:"#fff",border:"none",borderRadius:"8px",padding:"0.4rem 0.9rem",fontWeight:700},
          children:[(0,t.jsx)(I.Pencil,{size:14,style:{marginRight:"0.35rem"}})," Edit Wilayah"]
        })
      ]}),
      ej?(0,t.jsx)("p",{style:{fontSize:"0.8rem",color:"#94a3b8",margin:0},children:"Memuat data wilayah satker…"}):ew?(0,t.jsx)("p",{style:{fontSize:"0.8rem",color:"#dc2626",margin:0},children:ew}):eb?(0,t.jsxs)(t.Fragment,{children:[
        (0,t.jsx)(W,{id:"fld-cfg-sat-1",name:"field_cfg_sat_1",icon:(0,t.jsx)(k.MapPin,{size:15}),label:"Alamat",value:K(eb.alamat)||"Gedung Bareskrim Mabes Polri, Jl. Trunojoyo No. 3"}),
        (0,t.jsx)(W,{id:"fld-cfg-sat-2",name:"field_cfg_sat_2",icon:(0,t.jsx)(A,{id:"fld-cfg-sat-2-ico",name:"field_cfg_sat_2_ico",size:15}),label:"Provinsi",value:K(eb.provinsi)||"DKI Jakarta"}),
        (0,t.jsx)(W,{id:"fld-cfg-sat-3",name:"field_cfg_sat_3",icon:(0,t.jsx)(M.Landmark,{size:15}),label:"Kabupaten/Kota",value:K(eb.kabupaten_kota)||"Kota Jakarta Selatan"}),
        (0,t.jsx)(W,{id:"fld-cfg-sat-4",name:"field_cfg_sat_4",icon:(0,t.jsx)(b.Building2,{size:15}),label:"Kecamatan",value:K(eb.kecamatan)||"Kebayoran Baru"}),
        (0,t.jsx)(W,{id:"fld-cfg-sat-5",name:"field_cfg_sat_5",icon:(0,t.jsx)(b.Building2,{size:15}),label:"Desa/Kelurahan",value:K(eb.desa)||"Selong"}),
        (0,t.jsx)(W,{id:"fld-cfg-sat-6",name:"field_cfg_sat_6",icon:(0,t.jsx)(S.Hash,{size:15}),label:"Kode Pos",value:K(eb.kode_pos)||"12110"}),
        (0,t.jsx)(W,{id:"fld-cfg-sat-7",name:"field_cfg_sat_7",icon:(0,t.jsx)(z,{id:"fld-cfg-sat-7-ico",name:"field_cfg_sat_7_ico",size:15}),label:"Longitude",value:K(eb.longitude)||"106.7992"}),
        (0,t.jsx)(W,{id:"fld-cfg-sat-8",name:"field_cfg_sat_8",icon:(0,t.jsx)(z,{id:"fld-cfg-sat-8-ico",name:"field_cfg_sat_8_ico",size:15}),label:"Latitude",value:K(eb.latitude)||"-6.2383"}),
        (0,t.jsx)(W,{id:"fld-cfg-sat-9",name:"field_cfg_sat_9",icon:(0,t.jsx)(_.Users,{size:15}),label:"Jumlah Penduduk",value:function(e){let t=K(e);if(!t)return"FUNGSI"===String(eb?.tipe_satker||"").toUpperCase()?"Menginduk ke Wilayah Polda/Polres":"Belum diisi";let n=Number(t);return Number.isFinite(n)?`${n.toLocaleString("id-ID")} jiwa`:t}(eb.jumlah_penduduk),last:!0})
      ]}):(0,t.jsxs)("div",{style:{padding:"1rem",background:"rgba(255,255,255,0.02)",borderRadius:"8px",border:"1px dashed rgba(255,255,255,0.1)",textAlign:"center"},children:[
        (0,t.jsx)("p",{style:{fontSize:"0.84rem",color:"#94a3b8",margin:"0 0 0.5rem"},children:"Data wilayah satker otomatis menginduk ke Mabes Polri (Nasional)."}),
        !isReadOnlyMode && (0,t.jsx)("button",{type:"button",onClick:()=>openEditIntro(),style:{padding:"0.35rem 0.75rem",borderRadius:"6px",background:"#2563eb",color:"#fff",border:"none",fontWeight:700,fontSize:"0.76rem",cursor:"pointer"},children:"Perbarui Satuan Kerja di Profil"})
      ]})
    ]})
  ]})
}),

// 10. JARINGAN & KONEKSI CAS MODAL (LINKEDIN STYLE)
(0,t.jsx)(r.Dialog,{
  header:(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[
    (0,t.jsx)("span",{style:{fontSize:"1.2rem"},children:"👥"}),
    (0,t.jsx)("span",{style:{fontWeight:800},children:eNetworkModalTitle || "Jaringan & Koneksi Personil CAS"}),
    (0,t.jsx)("span",{style:{fontSize:"0.72rem",background:"rgba(56,189,248,0.15)",color:"#38bdf8",padding:"0.15rem 0.55rem",borderRadius:"999px",fontWeight:700},children:(eNetworkTotal || 0) + (eNetworkConnectedTarget ? " Koneksi" : " Personil")})
  ]}),
  visible:eNetworkModal,
  onHide:()=>setNetworkModal(!1),
  style:{width:"52rem",maxWidth:"95vw"},
  modal:!0,
  dismissableMask:!0,
  children:(0,t.jsxs)("div",{style:{display:"grid",gap:"1rem",padding:"0.25rem 0"},children:[
    // Search & Filter Bar
    (0,t.jsxs)("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:[
      (0,t.jsx)("div",{style:{flex:1,minWidth:"200px"},children:
        (0,t.jsx)(i.InputText,{
          value:eNetworkSearch,
          onChange:ev=>{
            setNetworkSearch(ev.target.value);
            fetchNetworkDirectory(ev.target.value, eNetworkSatkerFilter, 1, eNetworkConnectedTarget || a?.id || mySelf?.id);
          },
          placeholder:"🔍 Cari personil berdasarkan nama, NRP, callsign, atau fungsi…",
          style:{width:"100%",fontSize:"0.85rem",padding:"0.5rem 0.75rem"}
        })
      }),
      (0,t.jsxs)("select",{
        value:eNetworkSatkerFilter,
        onChange:ev=>{
          var val = ev.target.value;
          setNetworkSatkerFilter(val);
          var connTo = val === 'connected' ? (eNetworkConnectedTarget || a?.id || mySelf?.id) : null;
          if (val !== 'connected') {
            setNetworkConnectedTarget(null);
            setNetworkModalTitle('Jaringan & Direktori Personil CAS');
          } else {
            setNetworkConnectedTarget(connTo);
            setNetworkModalTitle('Daftar Koneksi ' + (a?.name || a?.callsign || 'Personil'));
          }
          fetchNetworkDirectory(eNetworkSearch, val, 1, connTo);
        },
        style:{fontSize:"0.82rem",padding:"0.45rem 0.75rem",borderRadius:"8px",border:"1px solid rgba(255,255,255,0.15)",background:"rgba(0,0,0,0.3)",color:"#fff"},
        children:[
          Boolean(a?.id) && (0,t.jsx)("option",{value:"connected",children:"Koneksi @" + formatCallsign(a?.callsign, a?.id, a?.username).replace(/^@/, '') + " (" + (typeof a?.connections_count === 'number' ? a.connections_count : (parseInt(a?.connections_count, 10) || 0)) + ")"}),
          (0,t.jsx)("option",{value:"all",children:"Semua Personil CAS (Nasional)"}),
          (0,t.jsx)("option",{value:"my_satker",children:"Satu Satker / Wilayah (" + (a?.satker_nama || a?.satker || "Satker") + ")"}),
          (0,t.jsx)("option",{value:"Bareskrim",children:"Mabes Bareskrim Polri"}),
          (0,t.jsx)("option",{value:"Polda Metro Jaya",children:"Polda Metro Jaya"}),
          (0,t.jsx)("option",{value:"Polda Jatim",children:"Polda Jawa Timur"}),
          (0,t.jsx)("option",{value:"Polda Sumut",children:"Polda Sumatera Utara"}),
          (0,t.jsx)("option",{value:"Polda Jabar",children:"Polda Jawa Barat"})
        ]
      })
    ]}),

    // Personnel Cards Grid
    eNetworkLoading ? (
      (0,t.jsx)("div",{
        style:{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(240px, 1fr))",gap:"0.85rem"},
        children:[1,2,3,4,5,6].map(i => (
          (0,t.jsxs)("div",{
            key:i,
            className:"cms-card",
            style:{padding:"1.1rem",borderRadius:"10px",display:"flex",flexDirection:"column",alignItems:"center",gap:"0.55rem",background:"var(--cas-bg-surface, rgba(255,255,255,0.03))"},
            children:[
              (0,t.jsx)("div",{className:"cas-skeleton-shimmer",style:{width:"52px",height:"52px",borderRadius:"50%"}}),
              (0,t.jsx)("div",{className:"cas-skeleton-shimmer",style:{width:"130px",height:"14px",borderRadius:"4px",marginTop:"0.2rem"}}),
              (0,t.jsx)("div",{className:"cas-skeleton-shimmer",style:{width:"170px",height:"11px",borderRadius:"4px"}}),
              (0,t.jsx)("div",{className:"cas-skeleton-shimmer",style:{width:"140px",height:"10px",borderRadius:"4px"}}),
              (0,t.jsx)("div",{className:"cas-skeleton-shimmer",style:{width:"100%",height:"28px",borderRadius:"6px",marginTop:"0.5rem"}})
            ]
          })
        ))
      })
    ) : (
      (0,t.jsx)("div",{
        style:{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(240px, 1fr))",gap:"0.85rem",maxHeight:"60vh",overflowY:"auto",paddingRight:"0.25rem"},
        children:eNetworkUsers.map(user => {
          var isUserSuper = ['1', '320', '15403', '15404', '16568', '16576', '16594'].includes(String(user.id)) || user.username === 'omeko11' || String(user.role_bdb || user.role || '').toLowerCase() === 'superadmin';
          var isTargetSelf = mySelf ? (String(user.id) === String(mySelf.id)) : (String(user.id) === String(a?.id));
          var userCallsign = formatCallsign(user.callsign, user.id, user.username);
          var userPhoto = user.photo_url || user.foto || user.photo || (isTargetSelf ? (mySelf?.photo_url || mySelf?.foto || mySelf?.photo) : null);
          var userBadge = getVerificationBadge(user.role_bdb || user.role, isUserSuper, user.id, user.username);
          var userInitials = String(userCallsign.replace(/^@/, '') || 'P').charAt(0).toUpperCase();
          var userSatker = isUserSuper ? 'Robinopsnal Bareskrim Polri' : (user.satker_nama || user.satker || user.satuan || 'Polri');

          return (0,t.jsxs)("div",{
            key:user.id,
            style:{
              background:"var(--cas-bg-surface, rgba(255,255,255,0.03))",
              border:"1px solid var(--cas-border, rgba(255,255,255,0.08))",
              borderRadius:"12px",
              padding:"1rem",
              display:"flex",
              flexDirection:"column",
              justifyContent:"space-between",
              gap:"0.75rem"
            },
            children:[
              (0,t.jsxs)("div",{style:{display:"flex",gap:"0.75rem",alignItems:"center"},children:[
                (0,t.jsx)("div",{
                  style:{display:"inline-flex",cursor:"pointer"},
                  onClick:() => {
                    if (isTargetSelf) {
                      try { sessionStorage.removeItem('cas_view_user'); } catch(e){}
                      window.location.href = '/cms/profile';
                    } else {
                      var h = (user.callsign || user.username || ('user_' + user.id)).replace(/^@/,'');
                      try {
                        sessionStorage.setItem('cas_view_user', JSON.stringify({ id: user.id, username: user.username, callsign: user.callsign, handle: h }));
                      } catch(e){}
                      window.location.href = '/cms/profile?id=' + encodeURIComponent(user.id) + '&u=' + encodeURIComponent(h);
                    }
                  },
                  children:renderCornerAvatar(userPhoto, userInitials, userBadge, 2.8, 15, 8.5)
                }),
                (0,t.jsxs)("div",{style:{minWidth:0,flex:1},children:[
                  (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"4px"},children:[
                    (0,t.jsx)("span",{
                      onClick:() => {
                    if (isTargetSelf) {
                      try { sessionStorage.removeItem('cas_view_user'); } catch(e){}
                      window.location.href = '/cms/profile';
                    } else {
                      var h = (user.callsign || user.username || ('user_' + user.id)).replace(/^@/,'');
                      try {
                        sessionStorage.setItem('cas_view_user', JSON.stringify({ id: user.id, username: user.username, callsign: user.callsign, handle: h }));
                      } catch(e){}
                      window.location.href = '/cms/profile?id=' + encodeURIComponent(user.id) + '&u=' + encodeURIComponent(h);
                    }
                  },
                      style:{fontWeight:800,fontSize:"0.9rem",color:isUserSuper ? "#f59e0b" : "#38bdf8",letterSpacing:"-0.01em",cursor:"pointer",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},
                      children:userCallsign
                    })
                  ]}),
                  (0,t.jsx)("div",{
                    style:{fontSize:"0.74rem",color:"#94a3b8",marginTop:"0.15rem",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},
                    children:toTitleCase(userSatker)
                  })
                ]})
              ]}),
              isTargetSelf ? (
                (0,t.jsxs)("div",{style:{fontSize:"0.75rem",fontWeight:700,color:"#38bdf8",background:"rgba(56,189,248,0.1)",border:"1px solid rgba(56,189,248,0.25)",padding:"0.42rem 0.6rem",borderRadius:"8px",textAlign:"center",display:"flex",alignItems:"center",justifyContent:"center",gap:"0.35rem"},children:[
                  (0,t.jsx)("span",{children:"👑"}),
                  (0,t.jsx)("span",{children:"Akun Utama (Superadmin)"})
                ]})
              ) : (
                (() => {
                  var isConnected = Boolean(user.is_connected !== undefined ? user.is_connected : (user.connection_status === 'ACCEPTED' || (typeof localStorage !== 'undefined' && localStorage.getItem('cas_conn_' + user.id) === '1')));
                  var isLoading = Boolean(eModalConnLoading[user.id]);
                  return isConnected ? (
                    (0,t.jsxs)("button",{
                      type:"button",
                      disabled:isLoading,
                      onClick:() => handleModalToggleConnect(user),
                      style:{
                        width:"100%",
                        padding:"0.42rem 0.6rem",
                        borderRadius:"8px",
                        background:"rgba(16,185,129,0.12)",
                        border:"1px solid rgba(52,211,153,0.4)",
                        color:"#34d399",
                        fontSize:"0.76rem",
                        fontWeight:700,
                        cursor:"pointer",
                        display:"inline-flex",
                        alignItems:"center",
                        justifyContent:"center",
                        gap:"0.35rem",
                        transition:"all 0.15s ease"
                      },
                      onMouseEnter:e => {
                        e.currentTarget.style.background = 'rgba(239,68,68,0.15)';
                        e.currentTarget.style.borderColor = 'rgba(239,68,68,0.45)';
                        e.currentTarget.style.color = '#f87171';
                        var lSpan = e.currentTarget.querySelector('.modal-conn-label');
                        if (lSpan) lSpan.innerText = 'Putus Koneksi';
                        var iSpan = e.currentTarget.querySelector('.modal-conn-ico');
                        if (iSpan) iSpan.innerText = '✕';
                      },
                      onMouseLeave:e => {
                        e.currentTarget.style.background = 'rgba(16,185,129,0.12)';
                        e.currentTarget.style.borderColor = 'rgba(52,211,153,0.4)';
                        e.currentTarget.style.color = '#34d399';
                        var lSpan = e.currentTarget.querySelector('.modal-conn-label');
                        if (lSpan) lSpan.innerText = 'Terhubung';
                        var iSpan = e.currentTarget.querySelector('.modal-conn-ico');
                        if (iSpan) iSpan.innerText = '✓';
                      },
                      children:[
                        (0,t.jsx)("span",{className:"modal-conn-ico",children:"✓"}),
                        (0,t.jsx)("span",{className:"modal-conn-label",children:isLoading ? "Memproses…" : "Terhubung"})
                      ]
                    })
                  ) : (
                    (0,t.jsxs)("button",{
                      type:"button",
                      disabled:isLoading,
                      onClick:() => handleModalToggleConnect(user),
                      style:{
                        width:"100%",
                        padding:"0.42rem 0.6rem",
                        borderRadius:"8px",
                        background:"#0284c7",
                        border:"1px solid #38bdf8",
                        color:"#fff",
                        fontSize:"0.76rem",
                        fontWeight:700,
                        cursor:"pointer",
                        display:"inline-flex",
                        alignItems:"center",
                        justifyContent:"center",
                        gap:"0.35rem",
                        boxShadow:"0 2px 8px rgba(2,132,199,0.3)",
                        transition:"all 0.15s ease"
                      },
                      children:[
                        (0,t.jsx)("span",{children:"+"}),
                        (0,t.jsx)("span",{children:isLoading ? "Memproses…" : "Tambahkan Koneksi"})
                      ]
                    })
                  );
                })()
              ),
              (0,t.jsx)("div",{style:{marginTop:"0.25rem"},children:[
                (0,t.jsx)("button",{
                  type:"button",
                  onClick:() => {
                    if (isTargetSelf) {
                      try { sessionStorage.removeItem('cas_view_user'); } catch(e){}
                      window.location.href = '/cms/profile';
                    } else {
                      var h = (user.callsign || user.username || ('user_' + user.id)).replace(/^@/,'');
                      try {
                        sessionStorage.setItem('cas_view_user', JSON.stringify({ id: user.id, username: user.username, callsign: user.callsign, handle: h }));
                      } catch(e){}
                      window.location.href = '/cms/profile?id=' + encodeURIComponent(user.id) + '&u=' + encodeURIComponent(h);
                    }
                  },
                  style:{width:"100%",padding:"0.45rem",borderRadius:"8px",background:"rgba(56,189,248,0.15)",border:"1px solid rgba(56,189,248,0.35)",color:"#38bdf8",fontSize:"0.78rem",fontWeight:700,cursor:"pointer",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:"0.4rem",transition:"all 0.15s ease"},
                  onMouseEnter:e => e.currentTarget.style.background = 'rgba(56,189,248,0.25)',
                  onMouseLeave:e => e.currentTarget.style.background = 'rgba(56,189,248,0.15)',
                  children:isTargetSelf ? "Profil Saya" : "Lihat Profil"
                })
              ]})
            ]
          });
        })
      })
    ),
    // Pagination Controls
    (0,t.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",padding:"0.75rem 0.5rem 0",borderTop:"1px solid rgba(255,255,255,0.08)",marginTop:"0.5rem"},children:[
      (0,t.jsx)("button",{
        type:"button",
        disabled:eNetworkPage <= 1,
        onClick:() => fetchNetworkDirectory(eNetworkSearch, eNetworkSatkerFilter, eNetworkPage - 1, eNetworkConnectedTarget || a?.id || mySelf?.id),
        style:{background:eNetworkPage <= 1 ? "rgba(255,255,255,0.04)" : "rgba(56,189,248,0.15)",color:eNetworkPage <= 1 ? "#64748b" : "#38bdf8",border:"1px solid " + (eNetworkPage <= 1 ? "rgba(255,255,255,0.08)" : "rgba(56,189,248,0.3)"),borderRadius:"8px",padding:"0.4rem 0.9rem",fontSize:"0.8rem",fontWeight:700,cursor:eNetworkPage <= 1 ? "not-allowed" : "pointer"},
        children:"◀ Sebelumnya"
      }),
      (0,t.jsxs)("span",{style:{fontSize:"0.8rem",color:"#94a3b8",fontWeight:600},children:[
        "Halaman ",
        (0,t.jsx)("strong",{style:{color:"#fff"},children:eNetworkPage}),
        " dari ",
        (0,t.jsx)("strong",{style:{color:"#fff"},children:eNetworkTotalPages}),
        " (Total " + (eNetworkTotal || 0) + (eNetworkConnectedTarget ? " Koneksi)" : " Personil)")
      ]}),
      (0,t.jsx)("button",{
        type:"button",
        disabled:eNetworkPage >= eNetworkTotalPages,
        onClick:() => fetchNetworkDirectory(eNetworkSearch, eNetworkSatkerFilter, eNetworkPage + 1, eNetworkConnectedTarget || a?.id || mySelf?.id),
        style:{background:eNetworkPage >= eNetworkTotalPages ? "rgba(255,255,255,0.04)" : "rgba(56,189,248,0.15)",color:eNetworkPage >= eNetworkTotalPages ? "#64748b" : "#38bdf8",border:"1px solid " + (eNetworkPage >= eNetworkTotalPages ? "rgba(255,255,255,0.08)" : "rgba(56,189,248,0.3)"),borderRadius:"8px",padding:"0.4rem 0.9rem",fontSize:"0.8rem",fontWeight:700,cursor:eNetworkPage >= eNetworkTotalPages ? "not-allowed" : "pointer"},
        children:"Selanjutnya ▶"
      })
    ]})
  ]})
}),

// 11. PREVIEW PROFIL MODAL
(0,t.jsx)(r.Dialog,{
  header:"Profil Personil CAS",
  visible:eProfilePreviewModal,
  onHide:()=>setProfilePreviewModal(!1),
  style:{width:"36rem",maxWidth:"95vw"},
  modal:!0,
  dismissableMask:!0,
  children:ePreviewUser ? (0,t.jsxs)("div",{style:{display:"grid",gap:"1rem",padding:"0 0 0.5rem 0"},children:[
    (0,t.jsxs)("div",{style:{position:"relative",height:"105px",borderRadius:"10px",background:"linear-gradient(135deg, #090d16 0%, #0f172a 50%, #0369a1 100%)",overflow:"hidden",display:"flex",alignItems:"flex-end",padding:"0.75rem 1rem"},children:[
      (0,t.jsx)("div",{style:{position:"absolute",inset:0,opacity:0.25,backgroundImage:"radial-gradient(rgba(56,189,248,0.5) 1px, transparent 1px)",backgroundSize:"18px 18px",pointerEvents:"none"}}),
      (0,t.jsxs)("div",{style:{position:"absolute",bottom:"-25px",left:"1.25rem",display:"flex",alignItems:"flex-end",gap:"0.75rem"},children:[
        (0,t.jsx)("div",{
          style:{
            width:"70px",
            height:"70px",
            borderRadius:"50%",
            background:"#0f172a",
            border:"3px solid var(--cas-bg-surface, #ffffff)",
            boxShadow:"0 4px 12px rgba(0,0,0,0.5)",
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            fontSize:"1.75rem",
            fontWeight:800,
            color:"#fff",
            overflow:"hidden"
          },
          children:ePreviewUser.photo_url || ePreviewUser.foto ? (0,t.jsx)("img",{src:ePreviewUser.photo_url||ePreviewUser.foto,alt:ePreviewUser.name,style:{width:"100%",height:"100%",objectFit:"cover"}}) : (ePreviewUser.name ? ePreviewUser.name.charAt(0).toUpperCase() : "👮")
        })
      ]})
    ]}),

    (0,t.jsxs)("div",{style:{marginTop:"1.8rem",padding:"0 0.5rem"},children:[
      (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem",flexWrap:"wrap"},children:[
        (0,t.jsx)("span",{style:{fontSize:"1.2rem",fontWeight:800,color:"#fff"},children:ePreviewUser.name}),
        (0,t.jsx)("span",{style:{fontSize:"0.74rem",fontWeight:700,padding:"0.15rem 0.55rem",borderRadius:"999px",background:"rgba(34,197,94,0.15)",color:"#4ade80",border:"1px solid rgba(34,197,94,0.3)"},children:"● Online / Aktif"})
      ]}),
      (0,t.jsxs)("div",{style:{fontSize:"0.84rem",color:"#38bdf8",fontWeight:700,marginTop:"0.2rem"},children:[
        formatCallsign(ePreviewUser.callsign, ePreviewUser.id, ePreviewUser.username)
      ]}),
      (0,t.jsxs)("div",{style:{fontSize:"0.86rem",color:"#e2e8f0",marginTop:"0.25rem",fontWeight:600},children:[
        ePreviewUser.pangkat ? ePreviewUser.pangkat + " • " : "",
        ePreviewUser.jabatan || ePreviewUser.role || "Penyidik Reserse Polri"
      ]}),
      (0,t.jsx)("div",{style:{fontSize:"0.78rem",color:"#94a3b8",marginTop:"0.15rem"},children:
        ePreviewUser.satker_nama || ePreviewUser.satker || ePreviewUser.satuan || "Badan Reserse Kriminal Polri"
      })
    ]}),

    (0,t.jsxs)("div",{style:{display:"grid",gap:"0.6rem",padding:"0 0.5rem"},children:[
      (0,t.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.6rem"},children:[
        (0,t.jsxs)("div",{style:{background:"rgba(255,255,255,0.03)",padding:"0.6rem 0.75rem",borderRadius:"8px",border:"1px solid rgba(255,255,255,0.06)"},children:[
          (0,t.jsx)("div",{style:{fontSize:"0.68rem",color:"#94a3b8",fontWeight:700},children:"NRP / IDENTITAS"}),
          (0,t.jsx)("div",{style:{fontSize:"0.82rem",color:"#fff",fontWeight:700,marginTop:"0.15rem"},children:ePreviewUser.nrp || "78090123"})
        ]}),
        (0,t.jsxs)("div",{style:{background:"rgba(255,255,255,0.03)",padding:"0.6rem 0.75rem",borderRadius:"8px",border:"1px solid rgba(255,255,255,0.06)"},children:[
          (0,t.jsx)("div",{style:{fontSize:"0.68rem",color:"#94a3b8",fontWeight:700},children:"STATUS KEDINASAN"}),
          (0,t.jsx)("div",{style:{fontSize:"0.82rem",color:"#4ade80",fontWeight:700,marginTop:"0.15rem"},children:"Polri Aktif"})
        ]})
      ]}),
      (0,t.jsxs)("div",{style:{background:"rgba(255,255,255,0.03)",padding:"0.6rem 0.75rem",borderRadius:"8px",border:"1px solid rgba(255,255,255,0.06)"},children:[
        (0,t.jsx)("div",{style:{fontSize:"0.68rem",color:"#94a3b8",fontWeight:700},children:"EMAIL DINAS POLRI"}),
        (0,t.jsx)("div",{style:{fontSize:"0.82rem",color:"#fff",fontWeight:600,marginTop:"0.15rem"},children:ePreviewUser.email_polri || (typeof ePreviewUser.email === "string" && ePreviewUser.email.endsWith("@polri.go.id") ? ePreviewUser.email : "reskrim.ops@polri.go.id")})
      ]}),
      ePreviewUser.bio && (0,t.jsxs)("div",{style:{background:"rgba(255,255,255,0.03)",padding:"0.6rem 0.75rem",borderRadius:"8px",border:"1px solid rgba(255,255,255,0.06)"},children:[
        (0,t.jsx)("div",{style:{fontSize:"0.68rem",color:"#94a3b8",fontWeight:700},children:"TENTANG PERSONIL"}),
        (0,t.jsx)("div",{style:{fontSize:"0.8rem",color:"#cbd5e1",marginTop:"0.2rem",lineHeight:1.45},children:ePreviewUser.bio})
      ]})
    ]}),

    (0,t.jsxs)("div",{style:{display:"flex",gap:"0.5rem",justifyContent:"flex-end",padding:"0.5rem",borderTop:"1px solid rgba(255,255,255,0.08)"},children:[
      (0,t.jsx)("button",{
        type:"button",
        onClick:()=>setProfilePreviewModal(!1),
        style:{background:"transparent",color:"#94a3b8",border:"1px solid rgba(255,255,255,0.15)",borderRadius:"8px",padding:"0.45rem 1rem",fontSize:"0.8rem",fontWeight:700,cursor:"pointer"},
        children:"Tutup"
      }),
      (0,t.jsx)("button",{
        type:"button",
        onClick:()=>{
          setProfilePreviewModal(!1);
          e.current?.show({severity:'info',summary:'Ruang Koordinasi',detail:'Menghubungkan ke ruang koordinasi taktis perkara dengan ' + ePreviewUser.name});
        },
        style:{background:"#2563eb",color:"#fff",border:"none",borderRadius:"8px",padding:"0.45rem 1.15rem",fontSize:"0.8rem",fontWeight:700,cursor:"pointer"},
        children:"💬 Kirim Pesan Taktis"
      })
    ]})
  ]}) : null
}),

// HERO CARD (Exact Pilihan B / Mockup media_1790609760611.png)
(0,t.jsxs)("div",{className:"cms-card",style:{padding:0,overflow:"hidden",marginBottom:"1.25rem",borderRadius:"16px",border:"1px solid var(--cas-border, rgba(255,255,255,0.1))",background:"var(--cas-bg-surface, #1e293b)",boxShadow:"0 8px 30px rgba(0,0,0,0.25)",WebkitMaskImage:"-webkit-radial-gradient(white, black)"},children:[
  // 1. Cover Banner (Height: 220px, WYSIWYG matching modal)
  (0,t.jsxs)("div",{id:"cas-profile-hero-banner",style:{position:"relative",height:"220px",borderTopLeftRadius:"15px",borderTopRightRadius:"15px",background:(eBannerTheme && (eBannerTheme.startsWith("data:") || eBannerTheme.startsWith("http"))) ? ("url(\"" + eBannerTheme + "\") center/cover no-repeat") : (eBannerTheme || "linear-gradient(135deg, #090d16 0%, #0f172a 45%, #1e293b 85%, #0369a1 100%)"),overflow:"hidden",display:"flex",alignItems:"flex-end",justifyContent:"space-between",padding:"1rem 1.5rem"},children:[


    // Edit cover button (Top right of banner, coral/orange pencil icon)
    !isReadOnlyMode && (0,t.jsx)("button",{
      type:"button",
      title:"Edit tema foto sampul",
      onClick:()=>{
        if(!isReadOnlyMode){
          if(!eRawBanner && eBannerTheme && (eBannerTheme.startsWith('data:') || eBannerTheme.startsWith('http'))){
            setRawBanner(eBannerTheme);
          }
          setBannerZoom(1);
          setBannerPanX(0);
          setBannerPanY(0);
          setBannerModal(!0);
        }
      },
      style:{position:"absolute",top:"14px",right:"16px",background:"rgba(15,23,42,0.75)",backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,0.25)",borderRadius:"50%",width:"36px",height:"36px",display:"inline-flex",alignItems:"center",justifyContent:"center",color:"#f97316",fontSize:"1rem",cursor:"pointer",boxShadow:"0 2px 6px rgba(0,0,0,0.3)"},
      children:"✏️"
    })
  ]}),

  // 2. Hero Body
  (0,t.jsxs)("div",{style:{padding:"0 1.75rem 1.5rem 1.75rem"},children:[
    // Top Row: Avatar on Left, Right side is COMPLETELY CLEAN (Tanpa pill Satker)!
    (0,t.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start"},children:[
      // Overlapping Avatar with Gold Verified Badge
      (0,t.jsxs)("div",{
        style:{position:"relative",marginTop:"-70px",width:"135px",height:"135px",flex:"0 0 135px"},
        children:[
          (0,t.jsx)("div",{
            title:isReadOnlyMode?"Foto Profil":"Klik foto untuk mengganti foto profil",
            onClick:()=>{if(!isReadOnlyMode){let f0=a?.photo_url||a?.foto||a?.photo||null;setPhotoPreview(f0);setRawPhoto(f0);setPhotoZoom(1);setPhotoPanX(0);setPhotoPanY(0);setPhotoModal(!0);}},
            style:{width:"100%",height:"100%",borderRadius:"50%",background:"var(--cas-bg-surface, #0f172a)",border:"4px solid var(--cas-bg-surface, #ffffff)",boxShadow:"0 8px 24px rgba(0,0,0,0.45)",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"3rem",fontWeight:800,color:"#fff",cursor:isReadOnlyMode?"default":"pointer",transition:"transform 0.15s ease"},
            children:
            (function(){
              var photoSrc = isReadOnlyMode ? (a?.photo_url || a?.foto || a?.photo || null) : (a?.photo_url || a?.foto || a?.photo || mySelf?.photo_url || (typeof localStorage !== 'undefined' && JSON.parse(localStorage.getItem('user')||'{}')?.photo_url) || null);
              if (photoSrc) {
                return (0,t.jsx)("img",{src:photoSrc,alt:a?.name||"Foto Profil",style:{width:"100%",height:"100%",objectFit:"cover"}});
              }
              return eB;
            })()
          }),
          // Tiered Verified Badge (Gold: Superadmin, Emerald: Admin Binops, Cyan Blue: Personil CAS)
          (function(){
            var isTargetSuper = ['1', '320', '15403', '15404', '16568', '16576', '16594'].includes(String(a?.id)) || a?.username === 'omeko11' || a?.callsign === 'omeko11' || String(a?.role_bdb || a?.role || '').toLowerCase().includes('super');
            var roleStr = isTargetSuper ? 'superadmin' : String(a?.role_bdb || a?.role || '').toLowerCase();
            var bColor = isTargetSuper ? '#f59e0b' : ((roleStr === 'admin_binops' || roleStr === 'binops') ? '#10b981' : '#38bdf8');
            var bLabel = isTargetSuper ? 'Superadmin Terverifikasi' : ((roleStr === 'admin_binops' || roleStr === 'binops') ? 'Admin Binops Terverifikasi' : ((roleStr === 'operator') ? 'Operator Terverifikasi' : 'Personil Terverifikasi'));
            return (0,t.jsxs)("div",{
              title:bLabel,
              style:{position:"absolute",bottom:"4px",right:"4px",width:"32px",height:"32px",borderRadius:"50%",background:bColor,border:"3px solid #1e293b",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 8px rgba(0,0,0,0.4)",cursor:isReadOnlyMode?"default":"pointer"},
              onClick:()=>{if(!isReadOnlyMode){let f0=a?.photo_url||a?.foto||a?.photo||null;setPhotoPreview(f0);setRawPhoto(f0);setPhotoZoom(1);setPhotoPanX(0);setPhotoPanY(0);setPhotoModal(!0);}},
              children:[
                (0,t.jsxs)("svg",{viewBox:"0 0 24 24",width:18,height:18,children:[
                  (0,t.jsx)("path",{d:"m6 12 4 4 8-8",stroke:"#ffffff",strokeWidth:3,strokeLinecap:"round",strokeLinejoin:"round",fill:"none"})
                ]})
              ]
            });
          })()
        ]
      })
      // Kanan atas Hero: Bersih (tanpa pill Satker)!
    ]}),

    // Identity, Location & Action Bar
    (0,t.jsxs)("div",{style:{marginTop:"0.85rem"},children:[
      // 1. Consolidated Identity Row: [verified badge] @Callsign [● Online]
      (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.65rem",flexWrap:"wrap"},children:[
        // [verified]
        (function(){
          var isSuper = ['1', '320', '15403', '15404', '16568', '16576', '16594'].includes(String(a?.id)) || a?.username === 'omeko11' || a?.callsign === 'omeko11' || String(a?.role_bdb || a?.role || '').toLowerCase().includes('super');
          var roleStr = isSuper ? 'superadmin' : String(a?.role_bdb || a?.role || '').toLowerCase();
          var bColor = isSuper ? '#f59e0b' : ((roleStr === 'admin_binops' || roleStr === 'binops') ? '#10b981' : '#38bdf8');
          var bLabel = isSuper ? 'Superadmin Terverifikasi' : ((roleStr === 'admin_binops' || roleStr === 'binops') ? 'Admin Binops Terverifikasi' : ((roleStr === 'operator') ? 'Operator Terverifikasi' : 'Personil Terverifikasi'));
          return (0,t.jsx)("span",{
            title:bLabel,
            style:{display:"inline-flex",alignItems:"center",justifyContent:"center",width:"22px",height:"22px",borderRadius:"50%",background:bColor,boxShadow:"0 1px 4px rgba(0,0,0,0.3)",flexShrink:0},
            children:(0,t.jsx)("svg",{viewBox:"0 0 24 24",width:13,height:13,children:(0,t.jsx)("path",{d:"m6 12 4 4 8-8",stroke:"#ffffff",strokeWidth:3.5,strokeLinecap:"round",strokeLinejoin:"round",fill:"none"})})
          });
        })(),
        // Callsign / Username (Large, prominent)
        (0,t.jsx)("span",{
          style:{fontSize:"1.65rem",fontWeight:800,color:"var(--cas-text-primary, #ffffff)",lineHeight:1.2},
          children:(function(){
            var u = a?.username ? String(a.username).trim().replace(/^@/, '') : '';
            var c = a?.callsign ? String(a.callsign).trim().replace(/^@/, '') : '';
            if (u && !u.startsWith('user_') && !['personil', 'null', 'undefined', '-'].includes(u.toLowerCase())) return '@' + u;
            if (c && !c.startsWith('user_') && !['personil', 'null', 'undefined', '-'].includes(c.toLowerCase())) return '@' + c;
            if (a?.name && String(a.name).trim()) return a.name;
            /* dynamic handle */
            return formatCallsign(a?.callsign, a?.id, a?.username);
          })()
        }),
        // [Online]
        (0,t.jsx)("span",{
          style:{fontSize:"0.76rem",fontWeight:700,padding:"0.18rem 0.6rem",borderRadius:"999px",background:"rgba(34,197,94,0.15)",color:"#4ade80",border:"1px solid rgba(34,197,94,0.35)",display:"inline-flex",alignItems:"center",gap:"0.3rem"},
          children:"● Online"
        })
      ]}),

      // Subline: Nasional • Info kontak • 4.120+ koneksi
      (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.55rem",flexWrap:"wrap",marginTop:"0.65rem",fontSize:"0.84rem",color:"#94a3b8"},children:[
        (0,t.jsx)("span",{children:(function(){
          var isSuper = ['1', '320', '15403', '15404', '16568', '16576', '16594'].includes(String(a?.id)) || a?.username === 'omeko11' || a?.callsign === 'omeko11' || String(a?.role_bdb || a?.role || '').toLowerCase().includes('super');
          if (isSuper) return "Robinopsnal Bareskrim Polri";
          var s = a?.scope_satker_name || a?.satker || a?.satker_nama || a?.satuan;
          if (!s || s === 'BDB Superadmin' || s === '-') s = "Bareskrim Polri";
          var sClean = String(s).trim().replace(/^operator\s*[-–—:]\s*/i, '');
          sClean = sClean.replace(/\bJAWA TIMUR\b/gi, 'Polda Jatim').replace(/\bJATIM\b/gi, 'Polda Jatim');
          sClean = sClean.toLowerCase().replace(/(?:^|\s|-|\/)[a-z]/g, function(c){return c.toUpperCase();});
          sClean = sClean.replace(/\bDit\s*Res\b/gi, 'Dit Res').replace(/\bDitres\b/gi, 'Dit Res').replace(/\bSat\s*Res\b/gi, 'Sat Res').replace(/\bSatres\b/gi, 'Sat Res').replace(/\bUnit\s*Res\b/gi, 'Unit Res').replace(/\bUnitres\b/gi, 'Unit Res').replace(/\bPolri\b/gi, 'Polri').replace(/\bPolda\b/gi, 'Polda');
          return sClean;
        })()}),
        (0,t.jsx)("span",{style:{color:"#64748b"},children:"•"}),
        (0,t.jsx)("button",{type:"button",onClick:()=>setContactModal(!0),style:{background:"transparent",border:"none",color:"#38bdf8",fontWeight:700,cursor:"pointer",padding:0,textDecoration:"underline"},children:"Info kontak"}),
        (0,t.jsx)("span",{style:{color:"#64748b"},children:"•"}),
        (0,t.jsxs)("button",{
          type:"button",
          onClick:()=>{
            var targetUid = a?.id || mySelf?.id;
            var targetName = a?.name || (a?.callsign ? '@' + a.callsign.replace(/^@/,'') : 'Personil');
            var cCount = typeof a?.connections_count === 'number' ? a.connections_count : (parseInt(a?.connections_count, 10) || 0);
            setNetworkUsers([]);
            setNetworkTotal(cCount);
            setNetworkConnectedTarget(targetUid);
            setNetworkSatkerFilter('connected');
            setNetworkSearch('');
            setNetworkModalTitle('Daftar Koneksi ' + targetName);
            setNetworkModal(!0);
            fetchNetworkDirectory('', 'connected', 1, targetUid);
          },
          style:{background:"transparent",border:"none",color:"#38bdf8",fontWeight:700,cursor:"pointer",padding:0,display:"inline-flex",alignItems:"center",gap:"0.3rem",textDecoration:"underline"},
          children:[
            (function(){
              var cCount = typeof a?.connections_count === 'number' ? a.connections_count : (parseInt(a?.connections_count, 10) || 0);
              var isSuper = ['1', '320', '15403', '15404', '16568', '16576', '16594'].includes(String(a?.id)) || a?.username === 'omeko11' || String(a?.role_bdb || a?.role || '').toLowerCase() === 'superadmin';
              if (isSuper) {
                var dispCount = cCount > 0 ? cCount : (eNetworkTotal || 3349);
                return dispCount.toLocaleString('id-ID') + " personil";
              }
              return cCount.toLocaleString('id-ID') + " koneksi";
            })()
          ]
        })
      ]}),

      // Tombol Aksi: [ ✏️ Edit Profile ] dan [ + Tambahkan bagian ]
      !isReadOnlyMode ? (
        (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.75rem",flexWrap:"wrap",marginTop:"1.1rem"},children:[
          (0,t.jsx)("button",{
            type:"button",
            onClick:openEditIntro,
            style:{background:"#2563eb",color:"#fff",border:"none",borderRadius:"24px",padding:"0.45rem 1.15rem",fontSize:"0.84rem",fontWeight:700,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"0.4rem",boxShadow:"0 2px 8px rgba(37,99,235,0.35)"},
            children:[
              (0,t.jsx)("span",{children:"✏️"}),
              (0,t.jsx)("span",{children:"Edit Profile"})
            ]
          }),
          (0,t.jsx)("button",{
            type:"button",
            onClick:()=>setAddSectionModal(!0),
            style:{background:"transparent",color:"#38bdf8",border:"1px solid #0284c7",borderRadius:"24px",padding:"0.45rem 1.15rem",fontSize:"0.84rem",fontWeight:700,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"0.35rem"},
            children:[
              (0,t.jsx)("span",{children:"+"}),
              (0,t.jsx)("span",{children:"Tambahkan bagian"})
            ]
          })
        ]})
      ) : (
        (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.65rem",flexWrap:"wrap",marginTop:"1.1rem"},children:[
          (() => {
            var isTargetConnected = Boolean(a?.is_connected || a?.connection_status === 'ACCEPTED' || (a?.id && typeof localStorage !== 'undefined' && localStorage.getItem('cas_conn_' + a.id) === '1'));
            return (0,t.jsx)("button",{
              type:"button",
              disabled:eConnLoading,
              onClick:handleToggleConnect,
              style:isTargetConnected ? {
                background:"rgba(16,185,129,0.14)",
                color:"#34d399",
                border:"1px solid rgba(52,211,153,0.45)",
                borderRadius:"24px",
                padding:"0.45rem 1.15rem",
                fontSize:"0.84rem",
                fontWeight:700,
                cursor:"pointer",
                display:"inline-flex",
                alignItems:"center",
                gap:"0.45rem",
                boxShadow:"0 2px 8px rgba(16,185,129,0.2)",
                transition:"all 0.2s ease"
              } : {
                background:"#0284c7",
                color:"#fff",
                border:"1px solid #38bdf8",
                borderRadius:"24px",
                padding:"0.45rem 1.15rem",
                fontSize:"0.84rem",
                fontWeight:700,
                cursor:"pointer",
                display:"inline-flex",
                alignItems:"center",
                gap:"0.45rem",
                boxShadow:"0 2px 10px rgba(2,132,199,0.35)",
                transition:"all 0.2s ease"
              },
              children:[
                (0,t.jsx)("span",{style:{fontSize:"0.95rem",fontWeight:800},children:isTargetConnected ? "✓" : "+"}),
                (0,t.jsx)("span",{children:eConnLoading ? "Menyimpan…" : (isTargetConnected ? "Terhubung" : "Tambahkan Koneksi")})
              ]
            });
          })(),

          (0,t.jsx)("button",{
            type:"button",
            onClick:()=>{
              window.dispatchEvent(new CustomEvent('cas-open-tactical-chat', {
                detail: {
                  id: a?.id,
                  name: toTitleCase(a?.name || 'Personil CAS'),
                  callsign: formatCallsign(a?.callsign, a?.id, a?.username),
                  satker: toTitleCase(a?.satker_nama || a?.satker || a?.satuan || 'Polri'),
                  photo: a?.photo_url || a?.foto || a?.photo
                }
              }));
            },
            style:{background:"#2563eb",color:"#fff",border:"none",borderRadius:"24px",padding:"0.45rem 1.15rem",fontSize:"0.84rem",fontWeight:700,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"0.4rem",boxShadow:"0 2px 8px rgba(37,99,235,0.35)"},
            children:[
              (0,t.jsx)("span",{children:"💬"}),
              (0,t.jsx)("span",{children:"Kirim Pesan Taktis"})
            ]
          }),

          (0,t.jsxs)("div",{
            style:{background:"rgba(56,189,248,0.12)",color:"#38bdf8",border:"1px solid rgba(56,189,248,0.3)",borderRadius:"24px",padding:"0.45rem 1.15rem",fontSize:"0.84rem",fontWeight:700,display:"inline-flex",alignItems:"center",gap:"0.4rem"},
            children:[
              (0,t.jsx)("span",{children:"🔒"}),
              (0,t.jsx)("span",{children:"Mode Kedinasan"})
            ]
          })
        ]})
      )
    ]})
  ]})
]}),

// TWO-COLUMN LAYOUT (Main Column + Sidebar Kanan)
(0,t.jsxs)("div",{className:"cas-two-col-profile profile-layout-grid",children:[

  // ================= LEFT COLUMN =================
  (0,t.jsxs)("div",{style:{display:"grid",gap:"1.25rem",minWidth:0},children:[

    // A. Tentang Saya (Bio & Ringkasan Diri)
    (0,t.jsxs)("div",{className:"cms-card",style:{padding:"1.25rem",borderRadius:"14px",border:"1px solid var(--cas-border, rgba(255,255,255,0.1))"},children:[
      (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.75rem"},children:[
        (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[
          (0,t.jsx)("span",{style:{fontSize:"1.2rem"},children:"🔖"}),
          (0,t.jsx)("h3",{style:{margin:0,fontSize:"1.1rem",fontWeight:800,color:"var(--cas-text-primary, #f8fafc)"},children:"Tentang Saya"})
        ]}),
        !isReadOnlyMode && (0,t.jsx)("button",{
          type:"button",
          "aria-label":"Edit Tentang Saya",
          title:"Edit Ringkasan Profil",
          onClick:()=>setBioModal(!0),
          style:{background:"transparent",border:"none",cursor:"pointer",fontSize:"1.15rem",color:"#f97316",padding:"0.2rem"},
          children:"✏️"
        })
      ]}),
      eBio.trim() ? (
        (0,t.jsx)("div",{style:{fontSize:"0.88rem",lineHeight:"1.6",color:"var(--cas-text-primary, #e2e8f0)",whiteSpace:"pre-wrap",wordBreak:"break-word"},children:eBio})
      ) : (
        (0,t.jsxs)("div",{style:{padding:"1rem 1.25rem",borderRadius:"10px",background:"rgba(56,189,248,0.03)",border:"1px dashed rgba(56,189,248,0.2)",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"0.75rem"},children:[
          (0,t.jsxs)("div",{children:[
            (0,t.jsx)("div",{style:{fontWeight:700,fontSize:"0.88rem",color:"#38bdf8"},children:isReadOnlyMode ? "Ringkasan belum ditambahkan" : "Belum ada ringkasan tentang profil Anda"}),
            (0,t.jsx)("div",{style:{fontSize:"0.78rem",color:"#94a3b8",marginTop:"0.2rem"},children:isReadOnlyMode ? "Personil bersangkutan belum menambahkan biodata publik." : "Tambahkan ringkasan peran operasional, keahlian reserse siber, atau moto integritas kedinasan."})
          ]}),
          !isReadOnlyMode && (0,t.jsx)("button",{
            type:"button",
            onClick:()=>setBioModal(!0),
            style:{background:"#2563eb",color:"#fff",border:"none",borderRadius:"8px",padding:"0.45rem 1rem",fontSize:"0.8rem",fontWeight:700,cursor:"pointer",boxShadow:"0 2px 6px rgba(37,99,235,0.3)"},
            children:"+ Tambahkan Ringkasan"
          })
        ]})
      )
    ]}),

    // B. Aktivitas & Linimasa Personal Card
    (0,t.jsxs)("div",{className:"cms-card",style:{padding:"1.25rem",borderRadius:"14px",border:"1px solid var(--cas-border, rgba(255,255,255,0.1))"},children:[
      // Header & Subtitle & 4 Tabs
      (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1rem",flexWrap:"wrap",gap:"0.75rem"},children:[
        (0,t.jsxs)("div",{children:[
          (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.45rem"},children:[
            (0,t.jsx)("span",{style:{fontSize:"1.25rem"},children:"📝"}),
            (0,t.jsx)("h3",{style:{margin:0,fontSize:"1.1rem",fontWeight:800,color:"var(--cas-text-primary, #f8fafc)"},children:"Aktivitas"})
          ]}),
          (0,t.jsx)("p",{style:{margin:"0.15rem 0 0",fontSize:"0.78rem",color:"#94a3b8"},children:isReadOnlyMode ? "Postingan dan catatan operasional personil" : "Postingan, catatan operasional, dan pemikiran taktis Anda"})
        ]}),

        // 4 Tabs: Postingan Saya, Tanggapan, Privat, Draft
        (0,t.jsxs)("div",{style:{display:"inline-flex",background:"var(--cas-bg-surface, rgba(255,255,255,0.05))",border:"1px solid var(--cas-border, rgba(255,255,255,0.1))",borderRadius:"8px",padding:"0.25rem",gap:"0.25rem"},children:[
          [
            { id: 'mine', label: isReadOnlyMode ? 'Postingan' : 'Postingan Saya' },
            { id: 'reposts', label: 'Tanggapan' }
          ].concat(!isReadOnlyMode ? [
            { id: 'private', label: '🔒 Privat' },
            { id: 'drafts', label: '📁 Draft' }
          ] : []).map(tab => (0,t.jsx)("button",{
            key:tab.id,
            type:"button",
            onClick:() => setFeedTab(tab.id),
            style:{
              background:eFeedTab === tab.id ? '#2563eb' : 'transparent',
              color:eFeedTab === tab.id ? '#fff' : 'var(--cas-text-secondary, #94a3b8)',
              border:"none",
              borderRadius:"6px",
              padding:"0.35rem 0.75rem",
              fontSize:"0.76rem",
              fontWeight:700,
              cursor:"pointer"
            },
            children:tab.label
          }))
        ]})
      ]}),

      // Quick Composer for personal notes/posts (Owner Only)
      !isReadOnlyMode && (0,t.jsxs)("div",{style:{padding:"0.9rem",borderRadius:"10px",marginBottom:"1.25rem",border:"1px solid var(--cas-border, rgba(255,255,255,0.1))",background:"rgba(0,0,0,0.18)"},children:[
        (0,t.jsx)("textarea",{
          id:"cas-post-composer",
          value:ePostText,
          onChange:ev => setPostText(ev.target.value),
          rows:2,
          placeholder:"Mulai buat postingan catatan taktis, pemikiran intelijen, atau temuan perkara baru... (Maks 3.000 karakter)",
          maxLength:3000,
          style:{width:"100%",fontSize:"0.86rem",padding:"0.65rem 0.85rem",borderRadius:"8px",border:"1px solid var(--cas-border, rgba(255,255,255,0.15))",background:"var(--cas-bg-surface-2, rgba(0,0,0,0.25))",color:"var(--cas-text-primary, #f8fafc)",resize:"vertical",fontFamily:"inherit"}
        }),
        (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:"0.6rem",flexWrap:"wrap",gap:"0.5rem"},children:[
          (0,t.jsxs)("div",{style:{display:"flex",gap:"0.5rem",alignItems:"center"},children:[
            (0,t.jsxs)("select",{
              value:ePostAudience,
              onChange:ev => setPostAudience(ev.target.value),
              style:{fontSize:"0.76rem",padding:"0.35rem 0.6rem",borderRadius:"6px",border:"1px solid var(--cas-border, rgba(255,255,255,0.15))",background:"var(--cas-bg-surface-2, rgba(0,0,0,0.06))",color:"var(--cas-text-primary, #f8fafc)"},
              children:[
                (0,t.jsx)("option",{value:"public",children:"🌐 Publik"}),
                (0,t.jsx)("option",{value:"followers",children:"👥 Pengikut / Teman Dekat / Satker tertentu"}),
                (0,t.jsx)("option",{value:"private",children:"🔒 Privat"})
              ]
            }),
            (0,t.jsxs)("span",{style:{fontSize:"0.72rem",color:ePostText.length >= 2800 ? '#ef4444' : '#94a3b8',fontWeight:600},children:[
              ePostText.length," / 3.000 karakter"
            ]})
          ]}),
          (0,t.jsx)("button",{
            type:"button",
            onClick:handleCreatePersonalPost,
            disabled:ePostSubmitting || !ePostText.trim(),
            style:{
              display:"inline-flex",
              alignItems:"center",
              gap:"0.35rem",
              padding:"0.45rem 1rem",
              borderRadius:"8px",
              background:"#2563eb",
              color:"#fff",
              border:"none",
              fontWeight:700,
              fontSize:"0.82rem",
              cursor:ePostSubmitting || !ePostText.trim() ? "not-allowed" : "pointer",
              opacity:ePostSubmitting || !ePostText.trim() ? 0.6 : 1
            },
            children:ePostSubmitting ? "Mengirim..." : "🚀 Publikasikan"
          })
        ]})
      ]}),

      // Personal Posts List
      eLoadingFeed ? (
        (0,t.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[
          [1, 2].map(i => (
            (0,t.jsxs)("div",{key:i,className:"cms-card",style:{borderRadius:"10px",padding:"1.1rem",display:"flex",flexDirection:"column",gap:"0.75rem"},children:[
              (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.75rem"},children:[
                (0,t.jsx)("div",{className:"cas-skeleton-shimmer",style:{width:"38px",height:"38px",borderRadius:"50%",flexShrink:0}}),
                (0,t.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.35rem"},children:[
                  (0,t.jsx)("div",{className:"cas-skeleton-shimmer",style:{width:"130px",height:"13px",borderRadius:"4px"}}),
                  (0,t.jsx)("div",{className:"cas-skeleton-shimmer",style:{width:"180px",height:"10px",borderRadius:"4px"}})
                ]})
              ]}),
              (0,t.jsx)("div",{className:"cas-skeleton-shimmer",style:{width:"100%",height:"12px",borderRadius:"4px"}}),
              (0,t.jsx)("div",{className:"cas-skeleton-shimmer",style:{width:"80%",height:"12px",borderRadius:"4px"}})
            ]})
          ))
        ]})
      ) : ePersonalPosts.length === 0 ? (
        (0,t.jsxs)("div",{style:{textAlign:"center",padding:"2.5rem",borderRadius:"12px",background:"rgba(0,0,0,0.12)",border:"1px dashed rgba(255,255,255,0.1)"},children:[
          (0,t.jsx)("div",{style:{fontSize:"2.2rem",marginBottom:"0.4rem"},children:"📭"}),
          (0,t.jsx)("div",{style:{fontWeight:700,fontSize:"0.95rem",color:"var(--cas-text-primary, #f1f5f9)"},children:"Belum ada postingan di kategori ini."}),
          (0,t.jsx)("div",{style:{fontSize:"0.78rem",color:"#94a3b8",marginTop:"0.2rem"},children:isReadOnlyMode ? "Personil ini belum mempublikasikan catatan taktis." : "Gunakan form di atas untuk membagikan tulisan atau catatan taktis pertama Anda."})
        ]})
      ) : (
        (()=>{
          let pageSize = 5;
          let totalPosts = ePersonalPosts.length;
          let totalPostPages = Math.max(1, Math.ceil(totalPosts / pageSize));
          let curPage = Math.min(ePostPage, totalPostPages);
          let pagedPosts = ePersonalPosts.slice((curPage - 1) * pageSize, curPage * pageSize);

          return (0,t.jsxs)("div",{style:{display:"grid",gap:"1rem"},children:[
            (0,t.jsx)("div",{style:{display:"grid",gap:"1rem"},children:
              pagedPosts.map(p => {
            var totRcts = p.total_reactions || 0;
            var isAuthorThisProfile = String(p.author_id) === String(a?.id);
            var isAuthorSuper = ['1', '320', '15403', '15404', '16568', '16576', '16594'].includes(String(p.author_id)) || String(p.author_role || '').toLowerCase() === 'superadmin';
            var pBadge = getVerificationBadge(p.author_role || a?.role, isAuthorSuper, p.author_id || a?.id, p.author_username || a?.username);
            var pHandle = formatCallsign(p.author_callsign || (isAuthorThisProfile ? a?.callsign : null), p.author_id || a?.id, p.author_username || (isAuthorThisProfile ? a?.username : null));
            var pAvatar = p.author_photo_url || p.photo_url || (isAuthorThisProfile ? (a?.photo_url || a?.foto || null) : null);
            var pInitials = String(p.author_name || (isAuthorThisProfile ? a?.name : null) || pHandle || 'P').charAt(0).toUpperCase();
            var pSatker = isAuthorSuper ? 'Robinopsnal Bareskrim Polri' : (p.satker_name || p.author_satker || a?.scope_satker_name || a?.satker || a?.satker_nama || 'Polri');
            var audLabel = p.audience_type === 'private' ? '🔒 Privat' : (p.audience_type === 'followers' ? '👥 Satker' : '🌐 Publik');

            return (0,t.jsxs)("div",{
              key:p.id,
              className:"cms-card",
              style:{
                padding:"1.25rem",
                borderRadius:"14px",
                border:"1px solid var(--cas-border, rgba(255,255,255,0.1))",
                background:"var(--cas-bg-surface, #1e293b)",
                position:"relative"
              },
              children:[
                // Post Header (Exact match with Feed)
                (0,t.jsxs)("div",{style:{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:"0.75rem",marginBottom:"0.85rem"},children:[
                  (0,t.jsxs)("div",{style:{display:"flex",gap:"0.75rem",alignItems:"center",minWidth:0,flex:1},children:[
                    (0,t.jsx)("div",{
                      style:{display:"inline-flex",cursor:"default"},
                      children:renderCornerAvatar(pAvatar, pInitials, pBadge, 2.5, 15, 8.5)
                    }),
                    (0,t.jsxs)("div",{children:[
                      (0,t.jsx)("div",{style:{display:"flex",alignItems:"center",gap:"0.45rem"},children:[
                        (0,t.jsx)("span",{
                          style:{fontWeight:800,fontSize:"0.92rem",color:"#38bdf8",letterSpacing:"-0.01em"},
                          children:pHandle
                        })
                      ]}),
                      (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.45rem",fontSize:"0.74rem",color:"#94a3b8",marginTop:"0.15rem",flexWrap:"wrap"},children:[
                        (0,t.jsx)("span",{children:audLabel}),
                        (0,t.jsx)("span",{style:{opacity:0.6},children:"•"}),
                        (0,t.jsx)("span",{children:timeAgo(p.created_at)}),
                        (0,t.jsx)("span",{style:{opacity:0.6},children:"•"}),
                        (0,t.jsx)("span",{style:{color:"#cbd5e1"},children:pSatker})
                      ]})
                    ]})
                  ]}),

                  // Context Action Buttons (Lucide icons matching Feed, no emojis!)
                  !isReadOnlyMode && (0,t.jsxs)("div",{style:{display:"flex",gap:"0.3rem",alignItems:"center"},children:[
                    (0,t.jsx)("button",{
                      type:"button",
                      onClick:() => handleTogglePostVis(p),
                      title:p.audience_type === 'private' ? 'Ubah ke Publik' : 'Ubah ke Privat',
                      style:{background:"transparent",border:"none",color:"#94a3b8",cursor:"pointer",padding:"0.3rem",borderRadius:"6px",display:"inline-flex",alignItems:"center"},
                      children:p.audience_type === 'private' ? (0,t.jsx)(IconLock,{size:15,style:{color:"#eab308"}}) : (0,t.jsx)(IconGlobe,{size:15})
                    }),
                    (0,t.jsx)("button",{
                      type:"button",
                      onClick:() => handlePersonalDelete(p.id),
                      title:"Hapus Postingan",
                      style:{background:"transparent",border:"none",color:"#ef4444",cursor:"pointer",padding:"0.3rem",borderRadius:"6px",display:"inline-flex",alignItems:"center"},
                      children:(0,t.jsx)(IconTrash2,{size:15})
                    })
                  ]})
                ]}),

                // Content with Lihat Selengkapnya Truncation
                (function(){
                  var content = String(p.content || '');
                  var isExp = !!expandedPersonalPosts[p.id];
                  var lines = content.split('\n');
                  var isLong = content.length > 180 || lines.length > 3;
                  var displayContent = content;
                  if (isLong && !isExp) {
                    if (lines.length > 3) {
                      displayContent = lines.slice(0, 3).join('\n') + '...';
                    } else {
                      displayContent = content.substring(0, 180) + '...';
                    }
                  }
                  return (0,t.jsxs)("div",{style:{marginBottom:"0.75rem"},children:[
                    (0,t.jsx)("div",{
                      style:{fontSize:"0.88rem",lineHeight:"1.5",color:"var(--cas-text-primary, #e2e8f0)",whiteSpace:"pre-wrap",wordBreak:"break-word"},
                      children:displayContent
                    }),
                    isLong && (0,t.jsx)("button",{
                      type:"button",
                      onClick:() => setExpandedPersonalPosts(prev => ({ ...prev, [p.id]: !prev[p.id] })),
                      style:{background:"transparent",border:"none",padding:"0.2rem 0",fontSize:"0.8rem",fontWeight:700,color:"#38bdf8",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"0.2rem",marginTop:"0.25rem"},
                      children:isExp ? '▲ Tampilkan lebih sedikit' : '▼ Lihat selengkapnya'
                    })
                  ]});
                })(),

                // Attached Media in Profile Activity
                (function(){
                  var mediaList = [];
                  if (Array.isArray(p.media) && p.media.length > 0) mediaList = p.media;
                  else if (Array.isArray(p.media_urls) && p.media_urls.length > 0) mediaList = p.media_urls;
                  else if (Array.isArray(p.attachments) && p.attachments.length > 0) mediaList = p.attachments;
                  if (!mediaList || mediaList.length === 0) return null;

                  var images = [];
                  var docs = [];
                  mediaList.forEach(function(mItem, mIdx){
                    var mUrl = typeof mItem === 'string' ? mItem : (mItem?.stream_url || (mItem?.token ? ('/api/bdb/jukrah/stream/' + mItem.token) : '') || mItem?.url || mItem?.file_url || '');
                    if (!mUrl) return;
                    var origName = (typeof mItem === 'object' && (mItem?.name || mItem?.file_name || mItem?.original_name)) ? (mItem.name || mItem.file_name || mItem.original_name) : '';
                    var extMatch = mUrl.match(/\.([a-zA-Z0-9]+)(\?|$)/) || origName.match(/\.([a-zA-Z0-9]+)$/);
                    var ext = extMatch ? extMatch[1].toLowerCase() : 'jpg';
                    var isImg = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp'].includes(ext) || mUrl.includes('image/') || String(mItem?.mime || '').startsWith('image/');
                    var safeName = origName && origName.startsWith('CAS_') ? origName : ('CAS_Lampiran_' + (isImg ? 'Foto' : 'Dokumen') + '_' + (p.id || 'act') + '_' + (mIdx + 1) + '.' + ext);
                    if (isImg) images.push({ url: mUrl, name: safeName });
                    else docs.push({ url: mUrl, name: safeName, ext: ext });
                  });

                  return (0,t.jsxs)("div",{style:{display:"grid",gap:"0.5rem",marginBottom:"0.75rem"},children:[
                    images.length > 0 && (0,t.jsx)("div",{
                      style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},
                      children:images.map(function(img, iIdx){
                        return (0,t.jsx)("img",{
                          key:iIdx,
                          src:img.url,
                          alt:img.name,
                          onClick:function(){ setLightboxMedia(img); },
                          style:{maxWidth:"100%",maxHeight:"16rem",borderRadius:"8px",objectFit:"cover",cursor:"zoom-in",border:"1px solid rgba(255,255,255,0.12)"}
                        });
                      })
                    }),
                    docs.length > 0 && (0,t.jsx)("div",{
                      style:{display:"grid",gap:"0.35rem"},
                      children:docs.map(function(doc, dIdx){
                        return (0,t.jsxs)("a",{
                          key:dIdx,
                          href:doc.url,
                          download:doc.name,
                          target:"_blank",
                          rel:"noopener noreferrer",
                          style:{display:"inline-flex",alignItems:"center",gap:"0.5rem",padding:"0.4rem 0.75rem",borderRadius:"6px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",color:"#38bdf8",textDecoration:"none",fontSize:"0.78rem",fontWeight:600},
                          children:[
                            (0,t.jsx)("span",{children:"📎"}),
                            (0,t.jsx)("span",{style:{wordBreak:"break-all"},children:doc.name}),
                            (0,t.jsx)("span",{style:{color:"#64748b",fontSize:"0.7rem",marginLeft:"auto"},children:"⬇️ Unduh"})
                          ]
                        });
                      })
                    })
                  ]});
                })(),

                // Instagram-Style Action Footer in Profile (Clean single-row, no subcard, [Heart] [X Suka])
                (0,t.jsx)("div",{
                  style:{
                    paddingTop:"0.75rem",
                    borderTop:"1px solid var(--cas-border, rgba(255,255,255,0.08))",
                    marginTop:"0.65rem"
                  },
                  children:(0,t.jsxs)("div",{
                    style:{display:"flex",alignItems:"center",justifyContent:"space-between"},
                    children:[
                      // Left Action Group: Like, Comment, Repost
                      (0,t.jsxs)("div",{
                        style:{display:"flex",alignItems:"center",gap:"1rem"},
                        children:[
                          // Like (Heart + Text) button
                          (0,t.jsxs)("div",{
                            style:{display:"inline-flex",alignItems:"center",gap:"0.2rem"},
                            children:[
                              (0,t.jsx)("button",{
                                type:"button",
                                onClick:() => handlePersonalReact(p.id, p.user_reaction ? null : 'like'),
                                style:{
                                  background:"transparent",
                                  border:"none",
                                  cursor:"pointer",
                                  padding:"0.3rem 0.2rem",
                                  display:"inline-flex",
                                  alignItems:"center",
                                  color:p.user_reaction ? '#ef4444' : 'var(--cas-text-primary, #cbd5e1)',
                                  transition:"transform 0.15s ease"
                                },
                                onMouseEnter:e => e.currentTarget.style.transform = 'scale(1.15)',
                                onMouseLeave:e => e.currentTarget.style.transform = 'scale(1)',
                                title:p.user_reaction ? 'Batalkan Suka' : 'Suka',
                                children:(0,t.jsx)(IconHeart,{
                                  size:20,
                                  style:{
                                    fill:p.user_reaction ? '#ef4444' : 'none',
                                    stroke:p.user_reaction ? '#ef4444' : 'currentColor',
                                    strokeWidth:2
                                  }
                                })
                              }),
                              (0,t.jsx)("button",{
                                type:"button",
                                onClick:() => handleOpenPersonalLikes(p.id),
                                style:{
                                  background:"transparent",
                                  border:"none",
                                  cursor:"pointer",
                                  padding:"0.3rem 0.2rem",
                                  fontSize:"0.84rem",
                                  fontWeight:600,
                                  color:p.user_reaction ? '#ef4444' : 'var(--cas-text-primary, #cbd5e1)',
                                  transition:"color 0.15s ease",
                                  textDecoration:"none"
                                },
                                onMouseEnter:e => e.currentTarget.style.textDecoration = 'underline',
                                onMouseLeave:e => e.currentTarget.style.textDecoration = 'none',
                                title:"Lihat daftar personil yang menyukai",
                                children:(totRcts > 0 ? (formatCount(totRcts) + " Suka") : "Suka")
                              })
                            ]
                          }),

                          // Comment button
                          (0,t.jsxs)("button",{
                            type:"button",
                            onClick:() => togglePostComments(p.id),
                            style:{
                              background:"transparent",
                              border:"none",
                              cursor:"pointer",
                              padding:"0.3rem 0.4rem",
                              display:"inline-flex",
                              alignItems:"center",
                              gap:"0.4rem",
                              color:eActiveCommentPostId === p.id ? '#38bdf8' : 'var(--cas-text-secondary, #94a3b8)',
                              transition:"transform 0.15s ease"
                            },
                            onMouseEnter:e => e.currentTarget.style.transform = 'scale(1.1)',
                            onMouseLeave:e => e.currentTarget.style.transform = 'scale(1)',
                            title:"Komentar",
                            children:[
                              (0,t.jsx)(IconMessageSquare,{size:19}),
                              Boolean(p.comments_count > 0) && (0,t.jsx)("span",{
                                style:{fontWeight:700,fontSize:"0.84rem",color:"var(--cas-text-primary, #cbd5e1)"},
                                children:p.comments_count
                              })
                            ]
                          }),

                          // Repost button
                          (0,t.jsxs)("button",{
                            type:"button",
                            onClick:() => {
                              setPostText('🔁 Diteruskan dari ' + pHandle + ':\n\"' + (p.content || '').substring(0, 100) + '...\"');
                              var composer = document.getElementById("cas-post-composer");
                              if (composer) { composer.focus(); composer.scrollIntoView({ behavior: 'smooth' }); }
                              e.current?.show({ severity: 'info', summary: 'Siap Dibagikan', detail: 'Teks kutipan dimuat ke formulir postingan.' });
                            },
                            style:{
                              background:"transparent",
                              border:"none",
                              cursor:"pointer",
                              padding:"0.3rem 0.4rem",
                              display:"inline-flex",
                              alignItems:"center",
                              gap:"0.4rem",
                              color:'var(--cas-text-secondary, #94a3b8)',
                              transition:"transform 0.15s ease"
                            },
                            onMouseEnter:e => e.currentTarget.style.transform = 'scale(1.1)',
                            onMouseLeave:e => e.currentTarget.style.transform = 'scale(1)',
                            title:"Teruskan postingan ini",
                            children:[
                              (0,t.jsx)(IconRepeat,{size:19}),
                              Boolean(p.repost_count > 0) && (0,t.jsx)("span",{
                                style:{fontWeight:700,fontSize:"0.84rem",color:"var(--cas-text-primary, #cbd5e1)"},
                                children:p.repost_count
                              })
                            ]
                          })
                        ]
                      }),

                      // Right Action: Bookmark
                      (0,t.jsx)("button",{
                        type:"button",
                        onClick:() => {
                          p.is_bookmarked = !p.is_bookmarked;
                          setPersonalPosts(prev => [...prev]);
                        },
                        style:{
                          background:"transparent",
                          border:"none",
                          cursor:"pointer",
                          padding:"0.3rem 0.4rem",
                          display:"inline-flex",
                          alignItems:"center",
                          color:p.is_bookmarked ? '#38bdf8' : 'var(--cas-text-secondary, #94a3b8)',
                          transition:"transform 0.15s ease"
                        },
                        onMouseEnter:e => e.currentTarget.style.transform = 'scale(1.1)',
                        onMouseLeave:e => e.currentTarget.style.transform = 'scale(1)',
                        title:p.is_bookmarked ? 'Hapus dari Tersimpan' : 'Simpan Postingan',
                        children:(0,t.jsx)(IconBookmark,{
                          size:20,
                          style:{
                            fill:p.is_bookmarked ? '#38bdf8' : 'none',
                            stroke:p.is_bookmarked ? '#38bdf8' : 'currentColor',
                            strokeWidth:2
                          }
                        })
                      })
                    ]
                  })
                }),

              // Comments drawer
              eActiveCommentPostId === p.id && (0,t.jsxs)("div",{style:{marginTop:"0.75rem",paddingTop:"0.75rem",borderTop:"1px solid rgba(255,255,255,0.06)"},children:[
                (0,t.jsxs)("div",{style:{display:"flex",gap:"0.4rem",marginBottom:"0.6rem"},children:[
                  (0,t.jsx)("input",{
                    type:"text",
                    value:eCommentInputs[p.id] || '',
                    onChange:ev => setCommentInputs({ ...eCommentInputs, [p.id]: ev.target.value }),
                    onKeyDown:ev => ev.key === 'Enter' && handleAddPersonalComment(p.id),
                    placeholder:"Balas tanggapan ini... (maks 1.000 karakter)",
                    maxLength:1000,
                    style:{flex:1,fontSize:"0.8rem",padding:"0.35rem 0.6rem",borderRadius:"6px",border:"1px solid var(--cas-border, rgba(255,255,255,0.15))",background:"rgba(0,0,0,0.25)",color:"#fff"}
                  }),
                  (0,t.jsx)("button",{
                    type:"button",
                    onClick:() => handleAddPersonalComment(p.id),
                    disabled:eSubmittingComment,
                    style:{background:"#2563eb",color:"#fff",border:"none",borderRadius:"6px",padding:"0.35rem 0.65rem",fontSize:"0.78rem",fontWeight:700,cursor:"pointer"},
                    children:"Kirim"
                  })
                ]}),
                (ePostComments[p.id] || []).map(cm => (0,t.jsxs)("div",{key:cm.id,style:{background:"rgba(255,255,255,0.03)",borderRadius:"6px",padding:"0.45rem 0.65rem",fontSize:"0.78rem",marginBottom:"0.35rem"},children:[
                  (0,t.jsx)("span",{style:{fontWeight:700,color:"#38bdf8",marginRight:"0.4rem"},children:formatCallsign(cm.author_callsign, cm.author_id, cm.author_username)}),
                  (0,t.jsx)("span",{style:{color:"#cbd5e1"},children:cm.content})
                ]}))
              ]})
            ]});
          })
        }),
        totalPostPages > 1 && (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0.65rem 0.5rem",marginTop:"0.5rem",borderTop:"1px solid var(--cas-border, rgba(255,255,255,0.08))",flexWrap:"wrap",gap:"0.5rem"},children:[
          (0,t.jsx)("button",{
            type:"button",
            onClick:() => setPostPage(p => Math.max(1, p - 1)),
            disabled:curPage <= 1,
            style:{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",color:"#cbd5e1",padding:"0.35rem 0.75rem",borderRadius:"6px",fontSize:"0.76rem",fontWeight:700,cursor:curPage<=1?"not-allowed":"pointer",opacity:curPage<=1?0.4:1},
            children:"← Sebelumnya"
          }),
          (0,t.jsxs)("span",{style:{fontSize:"0.76rem",color:"#94a3b8",fontWeight:600},children:[
            "Halaman ",curPage," dari ",totalPostPages," (",totalPosts," postingan)"
          ]}),
          (0,t.jsx)("button",{
            type:"button",
            onClick:() => setPostPage(p => Math.min(totalPostPages, p + 1)),
            disabled:curPage >= totalPostPages,
            style:{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",color:"#cbd5e1",padding:"0.35rem 0.75rem",borderRadius:"6px",fontSize:"0.76rem",fontWeight:700,cursor:curPage>=totalPostPages?"not-allowed":"pointer",opacity:curPage>=totalPostPages?0.4:1},
            children:"Selanjutnya →"
          })
        ]})
      ]});
    })()
  )
    ]}),

    // C. Pengalaman (Dynamic Experience Card)
    (0,t.jsxs)("div",{className:"cms-card",style:{padding:"1.25rem",borderRadius:"14px",border:"1px solid var(--cas-border, rgba(255,255,255,0.1))"},children:[
      (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1rem"},children:[
        (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[
          (0,t.jsx)("span",{style:{fontSize:"1.25rem"},children:"💼"}),
          (0,t.jsx)("h3",{style:{margin:0,fontSize:"1.1rem",fontWeight:800,color:"var(--cas-text-primary, #f8fafc)"},children:"Pengalaman"})
        ]}),
        !isReadOnlyMode && (0,t.jsxs)("div",{style:{display:"flex",gap:"0.5rem"},children:[
          (0,t.jsx)("button",{
            type:"button",
            "aria-label":"Tambahkan pengalaman",
            title:"Tambahkan riwayat pengalaman baru",
            onClick:openAddExp,
            style:{background:"transparent",border:"none",cursor:"pointer",fontSize:"1.15rem",color:"#94a3b8",padding:"0.2rem"},
            children:"➕"
          }),
          (0,t.jsx)("button",{
            type:"button",
            "aria-label":"Edit pengalaman",
            title:"Edit pengalaman",
            onClick:()=>openEditExp(0),
            style:{background:"transparent",border:"none",cursor:"pointer",fontSize:"1.15rem",color:"#94a3b8",padding:"0.2rem"},
            children:"✏️"
          })
        ]})
      ]}),
      getActiveExperiences().length === 0 ? ((0,t.jsx)("div",{style:{padding:"1.25rem 0",textAlign:"center",color:"#94a3b8",fontSize:"0.84rem"},children:"Belum ada riwayat pengalaman kedinasan yang ditambahkan."})) : getActiveExperiences().map((exp, idx, arr) => (
        (0,t.jsxs)("div",{key:exp.id||idx,style:{display:"flex",gap:"0.85rem",paddingTop:idx>0?"1rem":0,paddingBottom:idx<arr.length-1?"1rem":0,borderBottom:idx<arr.length-1?"1px solid rgba(255,255,255,0.06)":"none"},children:[
          (0,t.jsx)("div",{style:{width:"44px",height:"44px",borderRadius:"8px",background:"rgba(56,189,248,0.12)",border:"1px solid rgba(56,189,248,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.3rem",flexShrink:0},children:"🏢"}),
          (0,t.jsxs)("div",{style:{flex:1},children:[
            (0,t.jsxs)("div",{style:{display:"flex",alignItems:"flex-start",justifyContent:"space-between"},children:[
              (0,t.jsx)("div",{style:{fontWeight:800,fontSize:"0.92rem",color:"#fff"},children:exp.title||"Posisi Kedinasan"}),
              !isReadOnlyMode && (0,t.jsx)("button",{
                type:"button",
                title:"Edit pengalaman ini",
                onClick:()=>openEditExp(idx),
                style:{background:"transparent",border:"none",cursor:"pointer",color:"#94a3b8",fontSize:"0.85rem",padding:"0.15rem 0.35rem"},
                children:"✏️"
              })
            ]}),
            (0,t.jsx)("div",{style:{fontSize:"0.8rem",color:"#38bdf8",fontWeight:600},children:exp.company||"Satuan Kerja"}),
            (0,t.jsxs)("div",{style:{fontSize:"0.74rem",color:"#94a3b8",marginTop:"0.15rem"},children:[exp.period||"Periode", exp.location ? " • " + exp.location : ""]}),
            exp.description ? (0,t.jsx)("div",{style:{fontSize:"0.78rem",color:"#cbd5e1",marginTop:"0.4rem",lineHeight:1.45,whiteSpace:"pre-wrap"},children:exp.description}) : null
          ]})
        ]})
      ))
    ]}),

    // D. Pendidikan (Dynamic Education Card)
    (0,t.jsxs)("div",{className:"cms-card",style:{padding:"1.25rem",borderRadius:"14px",border:"1px solid var(--cas-border, rgba(255,255,255,0.1))"},children:[
      (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1rem"},children:[
        (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[
          (0,t.jsx)("span",{style:{fontSize:"1.25rem"},children:"🎓"}),
          (0,t.jsx)("h3",{style:{margin:0,fontSize:"1.1rem",fontWeight:800,color:"var(--cas-text-primary, #f8fafc)"},children:"Pendidikan"})
        ]}),
        !isReadOnlyMode && (0,t.jsxs)("div",{style:{display:"flex",gap:"0.5rem"},children:[
          (0,t.jsx)("button",{
            type:"button",
            "aria-label":"Tambahkan pendidikan",
            title:"Tambahkan riwayat pendidikan baru",
            onClick:openAddEdu,
            style:{background:"transparent",border:"none",cursor:"pointer",fontSize:"1.15rem",color:"#94a3b8",padding:"0.2rem"},
            children:"➕"
          }),
          (0,t.jsx)("button",{
            type:"button",
            "aria-label":"Edit pendidikan",
            title:"Edit pendidikan",
            onClick:()=>openEditEdu(0),
            style:{background:"transparent",border:"none",cursor:"pointer",fontSize:"1.15rem",color:"#94a3b8",padding:"0.2rem"},
            children:"✏️"
          })
        ]})
      ]}),
      getActiveEducation().length === 0 ? ((0,t.jsx)("div",{style:{padding:"1.25rem 0",textAlign:"center",color:"#94a3b8",fontSize:"0.84rem"},children:"Belum ada riwayat pendidikan atau pelatihan yang ditambahkan."})) : getActiveEducation().map((edu, idx, arr) => (
        (0,t.jsxs)("div",{key:edu.id||idx,style:{display:"flex",gap:"0.85rem",paddingTop:idx>0?"1rem":0,paddingBottom:idx<arr.length-1?"1rem":0,borderBottom:idx<arr.length-1?"1px solid rgba(255,255,255,0.06)":"none"},children:[
          (0,t.jsx)("div",{style:{width:"44px",height:"44px",borderRadius:"8px",background:"rgba(168,85,247,0.12)",border:"1px solid rgba(168,85,247,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.3rem",flexShrink:0},children:"🎓"}),
          (0,t.jsxs)("div",{style:{flex:1},children:[
            (0,t.jsxs)("div",{style:{display:"flex",alignItems:"flex-start",justifyContent:"space-between"},children:[
              (0,t.jsx)("div",{style:{fontWeight:800,fontSize:"0.92rem",color:"#fff"},children:edu.school||"Institusi Pendidikan"}),
              !isReadOnlyMode && (0,t.jsx)("button",{
                type:"button",
                title:"Edit pendidikan ini",
                onClick:()=>openEditEdu(idx),
                style:{background:"transparent",border:"none",cursor:"pointer",color:"#94a3b8",fontSize:"0.85rem",padding:"0.15rem 0.35rem"},
                children:"✏️"
              })
            ]}),
            (0,t.jsxs)("div",{style:{fontSize:"0.8rem",color:"#c084fc",fontWeight:600},children:[edu.degree||"", edu.field ? (edu.degree ? ", " : "") + edu.field : ""]}),
            edu.year ? (0,t.jsx)("div",{style:{fontSize:"0.74rem",color:"#94a3b8",marginTop:"0.15rem"},children:edu.year}) : null,
            edu.description ? (0,t.jsx)("div",{style:{fontSize:"0.78rem",color:"#cbd5e1",marginTop:"0.4rem",lineHeight:1.45,whiteSpace:"pre-wrap"},children:edu.description}) : null
          ]})
        ]})
      ))
    ]})

  ]}),

  // ================= SIDEBAR KANAN =================
  (0,t.jsxs)("div",{style:{display:"grid",gap:"1.25rem",minWidth:0,width:"100%",maxWidth:"100%",boxSizing:"border-box"},children:[

    // Card 1: Bahasa profil
    (0,t.jsxs)("div",{className:"cms-card",style:{padding:"1.25rem",borderRadius:"14px",border:"1px solid var(--cas-border, rgba(255,255,255,0.1))",boxSizing:"border-box",overflow:"hidden",maxWidth:"100%"},children:[
      (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.5rem"},children:[
        (0,t.jsx)("h4",{style:{margin:0,fontSize:"0.95rem",fontWeight:800,color:"var(--cas-text-primary, #f8fafc)"},children:"Bahasa profil"}),
        !isReadOnlyMode && (0,t.jsx)("button",{
          type:"button",
          "aria-label":"Edit bahasa profil",
          title:"Edit bahasa profil",
          onClick:()=>e.current?.show({severity:'info',summary:'Bahasa Profil',detail:'Bahasa utama profil dinas adalah Bahasa Indonesia.'}),
          style:{background:"transparent",border:"none",cursor:"pointer",fontSize:"1rem",color:"#f97316"},
          children:"✏️"
        })
      ]}),
      (0,t.jsx)("div",{style:{fontSize:"0.84rem",color:"#94a3b8"},children:"Bahasa Indonesia"})
    ]}),

    // Card 3: Orang yang Mungkin Anda Kenal
    (0,t.jsxs)("div",{className:"cms-card",style:{padding:"1.25rem",borderRadius:"14px",border:"1px solid var(--cas-border, rgba(255,255,255,0.1))",boxSizing:"border-box",overflow:"hidden",maxWidth:"100%"},children:[
      (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.75rem"},children:[
        (0,t.jsx)("h4",{style:{margin:0,fontSize:"0.95rem",fontWeight:800,color:"var(--cas-text-primary, #f8fafc)"},children:"Orang yang Mungkin Anda Kenal"}),
        (0,t.jsx)("span",{style:{fontSize:"1.1rem",color:"#38bdf8"},children:"👥"})
      ]}),
      (0,t.jsx)("div",{style:{display:"grid",gap:"0.85rem"},children:
        (eNetworkUsers && eNetworkUsers.length ? eNetworkUsers.filter(u => {
          var uId = String(u.id);
          var curId = String(a?.id);
          var uName = String(u.username || '').toLowerCase();
          var uCall = String(u.callsign || '').toLowerCase();
          if (uId === curId) return false;
          if (uId === '1' || uName === 'omeko11' || uCall === 'omeko11') return false;
          if (mySelf?.id && String(mySelf.id) === uId) return false;
          if (mySelf?.username && String(mySelf.username).toLowerCase() === uName) return false;
          try {
            var storedUser = JSON.parse(localStorage.getItem('user') || '{}');
            if (storedUser.id && String(storedUser.id) === uId) return false;
            if (storedUser.username && storedUser.username.toLowerCase() === uName) return false;
          } catch(e) {}
          return true;
        }).slice(0, 5) : []).map(pers => (
          (0,t.jsxs)("div",{key:pers.id,style:{display:"flex",alignItems:"center",gap:"0.55rem",minWidth:0,width:"100%"},children:[
            (0,t.jsx)("div",{
              onClick:() => {
                var h = formatCallsign(pers.callsign, pers.id, pers.username).replace(/^@/, '');
                try {
                  sessionStorage.setItem('cas_view_user', JSON.stringify({ id: pers.id, username: pers.username, callsign: pers.callsign, handle: h }));
                } catch(e){}
                window.location.href = '/cms/profile?id=' + encodeURIComponent(pers.id) + '&u=' + encodeURIComponent(h);
              },
              style:{width:"36px",height:"36px",borderRadius:"50%",background:"#0f172a",border:"1.5px solid #38bdf8",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:"0.88rem",color:"#fff",flexShrink:0,cursor:"pointer",overflow:"hidden"},
              children:pers.photo ? (0,t.jsx)("img",{src:pers.photo,alt:formatCallsign(pers.callsign, pers.id, pers.username),style:{width:"100%",height:"100%",objectFit:"cover"}}) : String(formatCallsign(pers.callsign, pers.id, pers.username) || '@P').replace(/^@/,'').charAt(0).toUpperCase()
            }),
            (0,t.jsxs)("div",{
              onClick:() => {
                var h = formatCallsign(pers.callsign, pers.id, pers.username).replace(/^@/, '');
                try {
                  sessionStorage.setItem('cas_view_user', JSON.stringify({ id: pers.id, username: pers.username, callsign: pers.callsign, handle: h }));
                } catch(e){}
                window.location.href = '/cms/profile?id=' + encodeURIComponent(pers.id) + '&u=' + encodeURIComponent(h);
              },
              style:{minWidth:0,flex:1,cursor:"pointer"},
              children:[
                (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.35rem",minWidth:0,overflow:"hidden"},children:[
                  (0,t.jsx)("span",{
                    title:(['1','320','15403','15404','16568','16576','16594'].includes(String(pers.id))||String(pers.role_bdb||pers.role||'').toLowerCase()==='superadmin')?'Superadmin Terverifikasi':'Personil Terverifikasi',
                    style:{display:"inline-flex",alignItems:"center",justifyContent:"center",width:"13px",height:"13px",borderRadius:"50%",background:(['1','320','15403','15404','16568','16576','16594'].includes(String(pers.id))||String(pers.role_bdb||pers.role||'').toLowerCase()==='superadmin')?'#f59e0b':'#38bdf8',flexShrink:0},
                    children:(0,t.jsx)("svg",{viewBox:"0 0 24 24",width:8,height:8,children:(0,t.jsx)("path",{d:"m6 12 4 4 8-8",stroke:"#ffffff",strokeWidth:3.5,strokeLinecap:"round",strokeLinejoin:"round",fill:"none"})})
                  }),
                  (0,t.jsx)("span",{style:{fontWeight:800,fontSize:"0.82rem",color:"#38bdf8",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:formatCallsign(pers.callsign, pers.id, pers.username)})
                ]}),
                (0,t.jsx)("div",{style:{fontSize:"0.72rem",color:"#94a3b8",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",marginTop:"1px"},children:toTitleCase(pers.satker_singkat || pers.satker_nama || pers.satker || 'Mabes Polri')})
              ]
            }),
            (0,t.jsx)("button",{
              type:"button",
              onClick:() => {
                var h = formatCallsign(pers.callsign, pers.id, pers.username).replace(/^@/, '');
                try {
                  sessionStorage.setItem('cas_view_user', JSON.stringify({ id: pers.id, username: pers.username, callsign: pers.callsign, handle: h }));
                } catch(e){}
                window.location.href = '/cms/profile?id=' + encodeURIComponent(pers.id) + '&u=' + encodeURIComponent(h);
              },
              style:{background:"rgba(56,189,248,0.08)",border:"1px solid rgba(56,189,248,0.4)",color:"#38bdf8",borderRadius:"6px",padding:"0.25rem 0.55rem",fontSize:"0.74rem",fontWeight:700,cursor:"pointer",flexShrink:0,whiteSpace:"nowrap"},
              children:"Lihat"
            })
          ]})
        ))
      }),
      (0,t.jsx)("button",{
        type:"button",
        onClick:()=>{
          setNetworkConnectedTarget(null);
          setNetworkSatkerFilter('all');
          setNetworkSearch('');
          setNetworkModalTitle('Direktori Jaringan Personil CAS');
          setNetworkModal(!0);
          fetchNetworkDirectory('', 'all', 1, null);
        },
        style:{width:"100%",marginTop:"0.85rem",padding:"0.45rem",borderRadius:"8px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",color:"#cbd5e1",fontSize:"0.76rem",fontWeight:700,cursor:"pointer",textAlign:"center"},
        children:"Lihat Semua Rekan" + (eNetworkTotal ? " (" + eNetworkTotal.toLocaleString("id-ID") + ")" : "")
      })
    ]})

  ]})

]}),
(0,t.jsx)(r.Dialog,{header:"Edit Profil",visible:Boolean($ && !isReadOnlyMode),onHide:()=>q(!1),style:{width:"32rem",maxWidth:"95vw"},modal:!0,footer:(0,t.jsxs)("div",{children:[(0,t.jsx)(o.Button,{label:"Batal",text:!0,onClick:()=>q(!1),disabled:J}),(0,t.jsx)(o.Button,{label:"Simpan",icon:"pi pi-check",onClick:eA,loading:J})]}),children:(0,t.jsxs)("div",{style:{display:"grid",gap:"0.7rem"},children:[(0,t.jsx)("p",{style:{margin:0,fontSize:"0.8rem",color:"#94a3b8"},children:"Data personil ini dipakai untuk melengkapi Profil Saya. Kosongkan field yang tidak ingin diubah."}),(0,t.jsx)(F,{label:"Nama Lengkap",required:!0,children:(0,t.jsx)(i.InputText,{id:"profile-form-name",name:"name",autoComplete:"name",value:Z.name,onChange:e=>G(t=>({...t,name:e.target.value})),style:{width:"100%"}})}),(0,t.jsx)(F,{label:"Status Kepegawaian Personel",children:(0,t.jsxs)("div",{style:{display:"flex",gap:"1.25rem",padding:"0.25rem 0"},children:[(0,t.jsxs)("label",{style:{display:"inline-flex",alignItems:"center",gap:"0.4rem",cursor:"pointer",fontWeight:!Z.is_pns?700:500,color:!Z.is_pns?"#38bdf8":"var(--cas-text-secondary, #94a3b8)"},children:[(0,t.jsx)("input",{type:"radio",name:"is_pns",checked:!Z.is_pns,onChange:()=>G(t=>({...t,is_pns:!1}))}),"Anggota Polri"]}),(0,t.jsxs)("label",{style:{display:"inline-flex",alignItems:"center",gap:"0.4rem",cursor:"pointer",fontWeight:Z.is_pns?700:500,color:Z.is_pns?"#38bdf8":"var(--cas-text-secondary, #94a3b8)"},children:[(0,t.jsx)("input",{type:"radio",name:"is_pns",checked:!!Z.is_pns,onChange:()=>G(t=>({...t,is_pns:!0}))}),"PNS Polri"]})]})}),(0,t.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.7rem"},children:[(0,t.jsx)(F,{id:"fld-3def3ti6rk0vr-30",name:"field_3def3ti6rk0vr_30",label:"NRP / NIP",children:(0,t.jsx)(i.InputText,{id:"profile-form-nrp",name:"nrp",autoComplete:"off",value:Z.nrp,onChange:e=>G(t=>({...t,nrp:e.target.value})),style:{width:"100%"}})}),(0,t.jsx)(F,{id:"fld-3def3ti6rk0vr-32",name:"field_3def3ti6rk0vr_32",label:"No. HP",children:(0,t.jsx)(i.InputText,{id:"profile-form-no-hp",name:"no_hp",autoComplete:"tel",value:Z.no_hp,onChange:e=>G(t=>({...t,no_hp:e.target.value})),style:{width:"100%"},placeholder:"08xxxxxxxxxx"})}),(0,t.jsx)(F,{id:"fld-3def3ti6rk0vr-34",name:"field_3def3ti6rk0vr_34",label:"Pangkat",children:(0,t.jsxs)("select",{id:"profile-form-pangkat",name:"pangkat",value:Z.pangkat,onChange:e=>G(t=>({...t,pangkat:e.target.value})),className:"p-inputtext",style:{width:"100%",height:"2.6rem",borderRadius:"6px",border:"1px solid #cbd5e1",padding:"0 0.5rem",backgroundColor:"var(--cas-bg-surface, #fff)",fontSize:"0.85rem",color:"var(--cas-text-primary, #1e293b)",borderColor:"var(--cas-border-card, #cbd5e1)"},children:[(0,t.jsx)("option",{value:"",children:"-- Pilih Pangkat --"}),(!Z.is_pns?["Bharada","Bharatu","Bharaka","Abripda","Abriptu","Abrip","Bripda","Briptu","Brigpol","Bripka","Aipda","Aiptu","Ipda","Iptu","AKP","Kompol","AKBP","Kombes Pol","Brigjen Pol","Irjen Pol","Komjen Pol","Jenderal Polisi"]:["Juru Muda (I/a)","Juru Muda Tingkat I (I/b)","Juru (I/c)","Juru Tingkat I (I/d)","Pengatur Muda (II/a)","Pengatur Muda Tingkat I (II/b)","Pengatur (II/c)","Pengatur Tingkat I (II/d)","Penata Muda (III/a)","Penata Muda Tingkat I (III/b)","Penata (III/c)","Penata Tingkat I (III/d)","Pembina (IV/a)","Pembina Tingkat I (IV/b)","Pembina Utama Muda (IV/c)","Pembina Utama Madya (IV/d)","Pembina Utama (IV/e)"]).map(e=>(0,t.jsx)("option",{value:e,children:e},e)),Z.pangkat&&!["Bharada","Bharatu","Bharaka","Abripda","Abriptu","Abrip","Bripda","Briptu","Brigpol","Bripka","Aipda","Aiptu","Ipda","Iptu","AKP","Kompol","AKBP","Kombes Pol","Brigjen Pol","Irjen Pol","Komjen Pol","Jenderal Polisi","Juru Muda (I/a)","Juru Muda Tingkat I (I/b)","Juru (I/c)","Juru Tingkat I (I/d)","Pengatur Muda (II/a)","Pengatur Muda Tingkat I (II/b)","Pengatur (II/c)","Pengatur Tingkat I (II/d)","Penata Muda (III/a)","Penata Muda Tingkat I (III/b)","Penata (III/c)","Penata Tingkat I (III/d)","Pembina (IV/a)","Pembina Tingkat I (IV/b)","Pembina Utama Muda (IV/c)","Pembina Utama Madya (IV/d)","Pembina Utama (IV/e)"].includes(Z.pangkat)&&(0,t.jsx)("option",{value:Z.pangkat,children:Z.pangkat},Z.pangkat)]})}),(0,t.jsx)(F,{id:"fld-3def3ti6rk0vr-36",name:"field_3def3ti6rk0vr_36",label:"Jabatan",children:(0,t.jsx)(i.InputText,{id:"profile-form-jabatan",name:"jabatan",autoComplete:"off",value:Z.jabatan,onChange:e=>G(t=>({...t,jabatan:e.target.value})),style:{width:"100%"},placeholder:"mis. Kanit Reskrim"})})]}),(0,t.jsxs)(F,{id:"fld-3def3ti6rk0vr-38",name:"field_3def3ti6rk0vr_38",label:"Satuan / Satker Penugasan",hint:"ditetapkan oleh Administrator",children:[(0,t.jsx)(i.InputText,{id:"profile-form-satuan",name:"satuan",autoComplete:"off",value:(['1','320','15403','15404','16568','16576','16594'].includes(String(a?.id))||String(a?.role_bdb||a?.role||'').toLowerCase()==='superadmin'?"Robinopsnal Bareskrim Polri":(K(a?.scope_satker_name)||K(a?.scope_access_display)||K(Z.satuan)||"—")),disabled:!0,readOnly:!0,style:{width:"100%",background:"#f8fafc",color:"#475569",cursor:"not-allowed"}}),(0,t.jsx)("small",{style:{display:"block",marginTop:"0.25rem",color:"#94a3b8",fontSize:"0.72rem"},children:"Satker penugasan dan cakupan hak akses diatur terpusat oleh Superadmin di menu Master Pengguna."})]}),(0,t.jsxs)(F,{id:"fld-3def3ti6rk0vr-40",name:"field_3def3ti6rk0vr_40",label:"Email Dinas Polri (Utama)",hint:"wajib @polri.go.id, login & OTP",children:[(0,t.jsx)(p.default,{id:"profile-form-email-polri",name:"email_polri",autoComplete:"email",value:Z.email_polri,onChange:e=>{G(t=>({...t,email_polri:e})),X.onChangeDebounced("email_polri",e)},onBlur:e=>X.onBlurNow("email_polri",e),status:(Z.username&&Z.email_polri&&Z.username.trim().toLowerCase()===Z.email_polri.trim().toLowerCase())?"error":X.status.email_polri,placeholder:"nrp@polri.go.id atau nip@polri.go.id"}),(Z.username&&Z.email_polri&&Z.username.trim().toLowerCase()===Z.email_polri.trim().toLowerCase())?(0,t.jsx)("small",{className:"bdb-error",style:{color:"#ef4444",fontWeight:600},children:"Email Dinas Polri tidak boleh sama dengan Username!"}):X.message.email_polri&&(0,t.jsx)("small",{className:"bdb-error",children:X.message.email_polri})]}),(0,t.jsx)(F,{label:"Email Sekunder",hint:"opsional / bebas (mis. Gmail, Yahoo)",children:(0,t.jsx)(i.InputText,{id:"profile-form-email",name:"email",autoComplete:"email",value:Z.email,onChange:e=>G(t=>({...t,email:e.target.value})),style:{width:"100%"},placeholder:"mis. nama@gmail.com"})}),(0,t.jsxs)(F,{id:"fld-3def3ti6rk0vr-41",name:"field_3def3ti6rk0vr_41",label:"Username",hint:"alternatif login selain email dinas Polri",children:[(0,t.jsx)(p.default,{id:"profile-form-username",name:"username",autoComplete:"username",value:Z.username,onChange:e=>{G(t=>({...t,username:e})),X.onChangeDebounced("username",e)},onBlur:e=>X.onBlurNow("username",e),status:(Z.username&&Z.email_polri&&Z.username.trim().toLowerCase()===Z.email_polri.trim().toLowerCase())?"error":X.status.username,placeholder:"Contoh: omeko11"}),(Z.username&&Z.email_polri&&Z.username.trim().toLowerCase()===Z.email_polri.trim().toLowerCase())?(0,t.jsx)("small",{className:"bdb-error",style:{color:"#ef4444",fontWeight:600},children:"Username tidak boleh sama dengan Email Dinas Polri!"}):X.message.username&&(0,t.jsx)("small",{className:"bdb-error",children:X.message.username})]}),(0,t.jsxs)(F,{label:"Media Sosial Personil (Membangun Komunitas)",hint:"masukkan URL profil (Instagram, LinkedIn, X, TikTok, dll.) - opsional",children:[(0,t.jsx)("div",{style:{display:"flex",flexDirection:"column",gap:"0.45rem"},children:eSocUrls.map((u,idx)=>(0,t.jsxs)("div",{style:{display:"flex",gap:"0.4rem",alignItems:"center"},children:[(0,t.jsx)(i.InputText,{placeholder:"https://... (URL medsos)",value:u,onChange:e=>{let next=[...eSocUrls];next[idx]=e.target.value;setSocUrls(next)},style:{flex:1}}),(idx===eSocUrls.length-1)&&(0,t.jsx)(o.Button,{type:"button",icon:"pi pi-plus",className:"p-button-outlined p-button-sm",onClick:()=>setSocUrls([...eSocUrls,""]),tooltip:"Tambah link medsos lain",style:{width:"2.5rem",height:"2.5rem",flexShrink:0}}),(eSocUrls.length>1)&&(0,t.jsx)(o.Button,{type:"button",icon:"pi pi-trash",className:"p-button-outlined p-button-danger p-button-sm",onClick:()=>setSocUrls(eSocUrls.filter((_,i)=>i!==idx)),tooltip:"Hapus",style:{width:"2.5rem",height:"2.5rem",flexShrink:0}})]},idx))})]})]})}),(0,t.jsx)(r.Dialog,{header:"Foto Profil Personel",visible:Boolean(ePhotoModal && !isReadOnlyMode),onHide:()=>setPhotoModal(!1),style:{width:"27rem",maxWidth:"95vw"},modal:!0,footer:(0,t.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%"},children:[eRawPhoto?(0,t.jsx)(o.Button,{label:"Hapus",icon:"pi pi-trash",severity:"danger",text:!0,size:"small",disabled:ePhotoLoading,onClick:()=>{setPhotoPreview(null);setRawPhoto(null);setPhotoZoom(1);setPhotoPanX(0);setPhotoPanY(0)}}):(0,t.jsx)("span",{}),(0,t.jsxs)("div",{style:{display:"flex",gap:"0.5rem"},children:[(0,t.jsx)(o.Button,{label:"Batal",text:!0,onClick:()=>setPhotoModal(!1),disabled:ePhotoLoading}),(0,t.jsx)(o.Button,{label:"Simpan Foto",icon:"pi pi-check",loading:ePhotoLoading,onClick:async function(){setPhotoLoading(!0);try{let finalBase64=null;if(eRawPhoto){finalBase64=await new Promise(res=>{let img=new Image;img.onload=function(){let sz=360,cv=document.createElement("canvas");cv.width=sz;cv.height=sz;let cx=cv.getContext("2d");let w=img.width,h=img.height,bs=Math.max(sz/w,sz/h)*ePhotoZoom,dw=w*bs,dh=h*bs;let dx=(sz-dw)/2+(ePhotoPanX*(sz/180)),dy=(sz-dh)/2+(ePhotoPanY*(sz/180));cx.drawImage(img,dx,dy,dw,dh);res(cv.toDataURL("image/jpeg",0.85))};img.onerror=()=>res(eRawPhoto);img.src=eRawPhoto})}let payload={photo_url:finalBase64||"",foto:finalBase64||""};(0,c.assertOk)(await c.apiAuth.patch("/user/me/profile",payload)),y(t=>({...t,photo_url:finalBase64||null,foto:finalBase64||null}));try{let cur=JSON.parse(localStorage.getItem("user")||"{}");cur.photo_url=finalBase64||null;cur.foto=finalBase64||null;localStorage.setItem("user",JSON.stringify(cur));window.dispatchEvent(new Event("storage"));window.dispatchEvent(new CustomEvent("user-updated",{detail:cur}))}catch(err){}e.current?.show({severity:"success",summary:"Tersimpan",detail:"Foto profil berhasil diperbarui."}),setPhotoModal(!1);setTimeout(()=>{window.location.reload()},400)}catch(t){e.current?.show({severity:"error",summary:"Gagal",detail:t.response?.data?.message||"Gagal menyimpan foto profil."})}finally{setPhotoLoading(!1)}}})]})]}),children:(0,t.jsxs)("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",padding:"0.5rem 0"},children:[(0,t.jsx)("input",{id:"user-photo-file-input",type:"file",style:{display:"none"},accept:"image/png,image/jpeg,image/webp,image/gif",onChange:function(ev){let f=ev.target.files?.[0];if(!f)return;let r=new FileReader;r.onload=function(e2){setRawPhoto(e2.target.result);setPhotoPreview(e2.target.result);setPhotoZoom(1);setPhotoPanX(0);setPhotoPanY(0)};r.readAsDataURL(f)}}),(0,t.jsx)("div",{style:{width:"11.5rem",height:"11.5rem",borderRadius:"999px",border:"3.5px solid #3b82f6",overflow:"hidden",boxShadow:"0 4px 14px rgba(0,0,0,0.25)",display:"flex",alignItems:"center",justifyContent:"center",background:"#0f172a",marginBottom:"0.9rem",position:"relative"},children:eRawPhoto?(0,t.jsx)("img",{src:eRawPhoto,alt:"Preview",style:{width:"100%",height:"100%",objectFit:"cover",transform:`scale(${ePhotoZoom}) translate(${ePhotoPanX}px, ${ePhotoPanY}px)`,transformOrigin:"center center",pointerEvents:"none"}}):(0,t.jsx)("div",{style:{fontSize:"3.5rem",fontWeight:800,color:"#94a3b8"},children:eB})}),eRawPhoto&&(0,t.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.4rem",width:"100%",maxWidth:"19rem",background:"rgba(255,255,255,0.06)",padding:"0.6rem 0.8rem",borderRadius:"8px",marginBottom:"0.75rem",fontSize:"0.74rem"},children:[(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between"},children:[(0,t.jsx)("span",{children:"Perbesar (Zoom)"}),(0,t.jsx)("span",{style:{fontWeight:700,color:"#3b82f6"},children:`${Math.round(ePhotoZoom*100)}%`})]}),(0,t.jsx)("input",{type:"range",min:"1",max:"2.5",step:"0.05",value:ePhotoZoom,onChange:e=>setPhotoZoom(parseFloat(e.target.value)),style:{width:"100%",accentColor:"#3b82f6",cursor:"pointer"}}),(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:"0.2rem"},children:[(0,t.jsx)("span",{children:"Geser Kiri / Kanan"}),(0,t.jsx)("span",{style:{fontWeight:600,color:"#94a3b8"},children:`${ePhotoPanX}px`})]}),(0,t.jsx)("input",{type:"range",min:"-50",max:"50",step:"1",value:ePhotoPanX,onChange:e=>setPhotoPanX(parseInt(e.target.value)),style:{width:"100%",accentColor:"#3b82f6",cursor:"pointer"}}),(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:"0.2rem"},children:[(0,t.jsx)("span",{children:"Geser Atas / Bawah"}),(0,t.jsx)("span",{style:{fontWeight:600,color:"#94a3b8"},children:`${ePhotoPanY}px`})]}),(0,t.jsx)("input",{type:"range",min:"-50",max:"50",step:"1",value:ePhotoPanY,onChange:e=>setPhotoPanY(parseInt(e.target.value)),style:{width:"100%",accentColor:"#3b82f6",cursor:"pointer"}}),(0,t.jsx)("button",{type:"button",style:{fontSize:"0.68rem",color:"#94a3b8",background:"none",border:"none",cursor:"pointer",textDecoration:"underline",alignSelf:"center",marginTop:"0.2rem"},onClick:()=>{setPhotoZoom(1);setPhotoPanX(0);setPhotoPanY(0)},children:"Reset Posisi & Zoom"})]}),(0,t.jsx)(o.Button,{label:eRawPhoto?"Ganti Foto dari Perangkat":"Pilih Foto dari Perangkat",icon:"pi pi-upload",size:"small",onClick:function(){let el=document.getElementById("user-photo-file-input");if(el)el.click()},disabled:ePhotoLoading,className:"p-button-outlined"}),(0,t.jsx)("p",{style:{fontSize:"0.72rem",color:"#94a3b8",marginTop:"0.5rem",marginBottom:0,textAlign:"center"},children:"Atur zoom & geser posisi agar pas di lingkaran. Foto otomatis dikonversi ke ukuran avatar optimal saat disimpan."})]})}),(0,t.jsx)(r.Dialog,{header:1===eTotpStep?"Setup Google Authenticator (TOTP) - Verifikasi":"Setup Google Authenticator (TOTP) - Pindai QR",visible:Boolean(eTotpModal && !isReadOnlyMode),onHide:()=>setTotpModal(!1),style:{width:"28rem",maxWidth:"95vw"},modal:!0,footer:1===eTotpStep?(0,t.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%"},children:[(0,t.jsx)(o.Button,{label:"Batal",text:!0,disabled:eTotpLoading,onClick:()=>setTotpModal(!1)}),(0,t.jsx)(o.Button,{label:"Lanjut: Tampilkan QR",icon:"pi pi-arrow-right",iconPos:"right",loading:eTotpLoading,onClick:fetchTotpSetup})]}):(0,t.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%"},children:[(0,t.jsx)(o.Button,{label:"Kembali",icon:"pi pi-arrow-left",text:!0,disabled:eTotpLoading,onClick:()=>setTotpStep(1)}),(0,t.jsx)(o.Button,{label:"Verifikasi & Aktifkan TOTP",icon:"pi pi-check",loading:eTotpLoading,onClick:confirmTotpActivation})]}),children:1===eTotpStep?(0,t.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"1rem",padding:"0.5rem 0"},children:[(0,t.jsxs)("div",{style:{background:"rgba(56,189,248,0.08)",border:"1px solid rgba(56,189,248,0.2)",borderRadius:8,padding:"0.65rem 0.8rem",display:"flex",gap:"0.6rem",alignItems:"flex-start"},children:[(0,t.jsx)("i",{className:"pi pi-shield",style:{color:"#38bdf8",fontSize:"1.1rem",marginTop:"0.15rem"}}),(0,t.jsxs)("div",{children:[(0,t.jsx)("div",{style:{fontWeight:700,fontSize:"0.82rem",color:"#38bdf8"},children:"Konfirmasi Keamanan"}),(0,t.jsx)("div",{style:{fontSize:"0.75rem",color:"#cbd5e1",marginTop:"0.15rem"},children:"Masukkan password akun Anda saat ini untuk mengonfirmasi kepemilikan akun sebelum mengaktifkan Google Authenticator."})]})]}),(0,t.jsxs)("div",{style:{display:"grid",gap:"0.35rem"},children:[(0,t.jsx)("label",{style:{fontSize:"0.78rem",fontWeight:700,color:"#e2e8f0"},children:"Password Akun Saat Ini:"}),(0,t.jsxs)("div",{style:{position:"relative",display:"flex",alignItems:"center"},children:[(0,t.jsx)(i.InputText,{type:eShowPassword?"text":"password",placeholder:"Masukkan password akun Anda",value:eExistingPassword,onChange:ev=>{setExistingPassword(ev.target.value);setTotpError("");},onKeyDown:ev=>{if(ev.key==="Enter")fetchTotpSetup();},style:{width:"100%",fontSize:"0.88rem",paddingRight:"2.5rem"}}),(0,t.jsx)("i",{className:eShowPassword?"pi pi-eye-slash":"pi pi-eye",style:{position:"absolute",right:"0.75rem",color:"#94a3b8",cursor:"pointer",fontSize:"0.95rem"},onClick:()=>setShowPassword(!eShowPassword)})]}),eTotpError&&(0,t.jsx)("small",{style:{color:"#ef4444",fontSize:"0.74rem",fontWeight:600},children:eTotpError})]})]}):(0,t.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.75rem",padding:"0.5rem 0"},children:[(0,t.jsx)("p",{style:{fontSize:"0.8rem",color:"#94a3b8",margin:0},children:"Buka aplikasi Google Authenticator, Microsoft Authenticator, atau FreeOTP di ponsel Anda, lalu pindai kode QR di bawah ini:"}),eTotpData?.totp_image&&(0,t.jsx)("div",{style:{display:"flex",justifyContent:"center",padding:"0.75rem",background:"#fff",borderRadius:"10px",width:"fit-content",margin:"0 auto",boxShadow:"0 2px 8px rgba(0,0,0,0.15)"},children:(0,t.jsx)("img",{src:eTotpData.totp_image,alt:"QR Code TOTP",style:{width:"160px",height:"160px",display:"block"}})}),eTotpData?.secret&&(0,t.jsxs)("div",{style:{background:"rgba(255,255,255,0.05)",padding:"0.5rem 0.75rem",borderRadius:"6px",display:"flex",alignItems:"center",justifyContent:"space-between"},children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("span",{style:{display:"block",fontSize:"0.68rem",color:"#64748b"},children:"Kunci Rahasia Manual:"}),(0,t.jsx)("span",{style:{fontFamily:"monospace",fontSize:"0.85rem",fontWeight:700,color:"#38bdf8",letterSpacing:"1px"},children:eTotpData.secret})]}),(0,t.jsx)(o.Button,{type:"button",icon:"pi pi-copy",className:"p-button-text p-button-sm",tooltip:"Salin Kunci",onClick:()=>{if(navigator.clipboard)navigator.clipboard.writeText(eTotpData.secret);e.current?.show({severity:"info",summary:"Disalin",detail:"Kunci rahasia berhasil disalin."});}})]}),(0,t.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.35rem"},children:[(0,t.jsx)("label",{style:{fontSize:"0.78rem",fontWeight:700,color:"#e2e8f0"},children:"Kode Authenticator (6 Digit dari Ponsel):"}),(0,t.jsx)(i.InputText,{placeholder:"000000",value:eTotpInputCode,onChange:ev=>setTotpInputCode(ev.target.value.replace(/\D/g,"").slice(0,6)),onKeyDown:ev=>{if(ev.key==="Enter"&&eTotpInputCode.length===6)confirmTotpActivation();},style:{width:"100%",fontSize:"1.2rem",letterSpacing:"5px",textAlign:"center",fontWeight:700,fontFamily:"monospace"},maxLength:6}),eTotpError&&(0,t.jsx)("small",{style:{color:"#ef4444",fontSize:"0.74rem",fontWeight:600},children:eTotpError})]})]})}),(0,t.jsx)(r.Dialog,{
header:"Daftar Perangkat Terpercaya (Passkey FIDO2)",
visible:Boolean(ePasskeyModal&&!isReadOnlyMode),
onHide:function(){setPasskeyModal(!1)},
style:{width:"34rem",maxWidth:"95vw"},
modal:!0,
children:(0,t.jsxs)("div",{
style:{display:"flex",flexDirection:"column",gap:"1rem",padding:"0.5rem 0"},
children:[
(0,t.jsxs)("div",{
style:{background:"rgba(56,189,248,0.08)",border:"1px solid rgba(56,189,248,0.2)",borderRadius:8,padding:"0.7rem 0.85rem",display:"flex",gap:"0.6rem",alignItems:"flex-start"},
children:[
(0,t.jsx)("i",{className:"pi pi-shield",style:{color:"#38bdf8",fontSize:"1.1rem",marginTop:"0.15rem"}}),
(0,t.jsxs)("div",{
children:[
(0,t.jsx)("div",{style:{fontWeight:700,fontSize:"0.82rem",color:"#38bdf8"},children:"Keamanan Kriptografi Perangkat Keras (FIDO2 / WebAuthn)"}),
(0,t.jsx)("div",{style:{fontSize:"0.74rem",color:"#cbd5e1",marginTop:"0.2rem",lineHeight:1.4},children:"Gawai terdaftar di bawah ini dapat melakukan login cepat tanpa sandi. Kunci privat tersimpan aman di Secure Enclave / TPM gawai Anda."})
]
})
]
}),
(0,t.jsxs)("div",{
style:{display:"flex",justifyContent:"space-between",alignItems:"center"},
children:[
(0,t.jsxs)("span",{style:{fontSize:"0.78rem",fontWeight:700,color:"#94a3b8"},children:["Perangkat Terdaftar: ",(0,t.jsx)("strong",{style:{color:"#fff"},children:ePasskeyDevices.length})]}),
(0,t.jsx)(o.Button,{
label:"+ Daftarkan Gawai Ini",
icon:"pi pi-plus",
size:"small",
loading:ePasskeyLoading,
onClick:function(){handleRegisterPasskey()},
style:{fontSize:"0.75rem",background:"#16a34a",borderColor:"#16a34a"}
})
]
}),
ePasskeyDevices.length===0?(0,t.jsxs)("div",{
style:{textAlign:"center",padding:"2rem 1rem",background:"rgba(255,255,255,0.02)",border:"1px dashed rgba(255,255,255,0.15)",borderRadius:8},
children:[
(0,t.jsx)("i",{className:"pi pi-mobile",style:{fontSize:"2rem",color:"#64748b",marginBottom:"0.5rem",display:"block"}}),
(0,t.jsx)("div",{style:{fontWeight:700,fontSize:"0.84rem",color:"#e2e8f0"},children:"Belum ada gawai biometrik terdaftar"}),
(0,t.jsx)("div",{style:{fontSize:"0.74rem",color:"#94a3b8",marginTop:"0.25rem",maxWidth:"320px",margin:"0.25rem auto 1rem"},children:"Daftarkan HP, laptop, atau tablet Anda untuk login instan tanpa perlu mengetik kata sandi."}),
(0,t.jsx)(o.Button,{
label:"Daftarkan Gawai Ini (Biometrik / PIN)",
icon:"pi pi-fingerprint",
loading:ePasskeyLoading,
onClick:function(){handleRegisterPasskey()},
style:{fontSize:"0.78rem"}
})
]
}):(0,t.jsx)("div",{
style:{display:"flex",flexDirection:"column",gap:"0.6rem",maxHeight:"260px",overflowY:"auto",paddingRight:"4px"},
children:ePasskeyDevices.map(function(dev){
return (0,t.jsxs)("div",{
key:dev.id,
style:{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:8,padding:"0.65rem 0.8rem",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.75rem"},
children:[
(0,t.jsxs)("div",{
style:{display:"flex",alignItems:"center",gap:"0.65rem"},
children:[
(0,t.jsx)("div",{
style:{width:"2.2rem",height:"2.2rem",borderRadius:"8px",background:"rgba(56,189,248,0.12)",color:"#38bdf8",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem",flexShrink:0},
children:(0,t.jsx)("i",{className:(/iPhone|Android|iPad/i.test(dev.device_name)?"pi pi-mobile":"pi pi-desktop")})
}),
(0,t.jsxs)("div",{
children:[
(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.4rem"},children:[
(0,t.jsx)("span",{style:{fontWeight:700,fontSize:"0.84rem",color:"#f8fafc"},children:dev.device_name}),
(0,t.jsx)("span",{style:{fontSize:"0.62rem",background:"rgba(34,197,94,0.15)",color:"#4ade80",padding:"1px 5px",borderRadius:"4px",fontWeight:700},children:"FIDO2"})
]}),
(0,t.jsxs)("div",{style:{fontSize:"0.69rem",color:"#94a3b8",marginTop:"0.15rem"},children:[
"Didaftarkan: ",
dev.created_at?new Date(dev.created_at).toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"}):"-",
dev.last_used_at?(" • Aktif: "+new Date(dev.last_used_at).toLocaleDateString("id-ID",{day:"numeric",month:"short"})):""
]})
]
})
]
}),
(0,t.jsx)(o.Button,{
icon:"pi pi-trash",
tooltip:"Cabut Akses Gawai",
tooltipOptions:{position:"left"},
text:!0,
severity:"danger",
disabled:ePasskeyLoading,
onClick:function(){handleDeletePasskey(dev)},
style:{padding:"0.35rem",color:"#ef4444"}
})
]
});
})
})
]
})
}),(0,t.jsx)(r.Dialog,{
header:"Otorisasi Cabut Akses Gawai",
visible:Boolean(eRevokeTarget&&!isReadOnlyMode),
onHide:function(){if(!eRevokeLoading)setRevokeTarget(null);},
style:{width:"28rem",maxWidth:"95vw"},
modal:!0,
footer:(0,t.jsxs)("div",{style:{display:"flex",justifyContent:"flex-end",gap:"0.5rem"},children:[
(0,t.jsx)(o.Button,{label:"Batal",text:!0,disabled:eRevokeLoading,onClick:function(){setRevokeTarget(null);}}),
(0,t.jsx)(o.Button,{label:"Konfirmasi Cabut Akses",severity:"danger",icon:"pi pi-trash",loading:eRevokeLoading,onClick:confirmRevokePasskey})
]}),
children:(0,t.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.9rem",padding:"0.5rem 0"},children:[
(0,t.jsxs)("div",{style:{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.25)",borderRadius:8,padding:"0.75rem 0.85rem",display:"flex",gap:"0.65rem",alignItems:"flex-start"},children:[
(0,t.jsx)("i",{className:"pi pi-exclamation-triangle",style:{color:"#ef4444",fontSize:"1.1rem",marginTop:"0.15rem"}}),
(0,t.jsxs)("div",{children:[
(0,t.jsxs)("div",{style:{fontWeight:700,fontSize:"0.84rem",color:"#f87171"},children:["Cabut Akses: ",eRevokeTarget?.device_name]}),
(0,t.jsx)("div",{style:{fontSize:"0.74rem",color:"#cbd5e1",marginTop:"0.2rem",lineHeight:1.4},children:"Kunci biometrik pada gawai ini akan dihapus dari sistem CAS. Gawai ini tidak akan bisa lagi dipakai login tanpa memasukkan kata sandi."})
]})
]}),
(0,t.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.35rem"},children:[
(0,t.jsx)("label",{style:{fontSize:"0.78rem",fontWeight:700,color:"#e2e8f0"},children:"Verifikasi Keamanan (Password / PIN / TOTP)"}),
(0,t.jsxs)("div",{style:{position:"relative"},children:[
(0,t.jsx)("input",{type:eRevokeShowPass?"text":"password",value:eRevokeCode,onChange:function(ev){setRevokeCode(ev.target.value);setRevokeError("");},onKeyDown:function(ev){if(ev.key==="Enter")confirmRevokePasskey();},placeholder:"Masukkan password akun Anda",style:{width:"100%",padding:"0.6rem 2.4rem 0.6rem 0.8rem",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.18)",borderRadius:"6px",color:"#fff",fontSize:"0.82rem"}}),
(0,t.jsx)("button",{type:"button",onClick:function(){setRevokeShowPass(!eRevokeShowPass);},style:{position:"absolute",right:"0.6rem",top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#94a3b8",cursor:"pointer",padding:0},children:(0,t.jsx)("i",{className:eRevokeShowPass?"pi pi-eye-slash":"pi pi-eye",style:{fontSize:"0.9rem"}})})
]}),
(0,t.jsx)("span",{style:{fontSize:"0.71rem",color:"#94a3b8"},children:"Masukkan Password Akun, PIN Keamanan, atau 6-digit TOTP Anda."}),
eRevokeError&&(0,t.jsx)("div",{style:{color:"#ef4444",fontSize:"0.74rem",fontWeight:600,marginTop:"0.2rem"},children:eRevokeError})
]})
]})
}),(0,t.jsx)(r.Dialog,{header:"Konfirmasi Nonaktifkan Metode Keamanan",visible:Boolean(eDisableModal && !isReadOnlyMode),onHide:()=>setDisableModal(!1),style:{width:"27rem",maxWidth:"95vw"},modal:!0,footer:(0,t.jsxs)("div",{style:{display:"flex",justifyContent:"flex-end",gap:"0.5rem"},children:[(0,t.jsx)(o.Button,{label:"Batal",text:!0,disabled:eDisableLoading,onClick:()=>setDisableModal(!1)}),(0,t.jsx)(o.Button,{label:"Konfirmasi & Nonaktifkan",severity:"danger",loading:eDisableLoading,onClick:async function(){
if(!eDisableCode||eDisableCode.length<6)return void setDisableError("Masukkan 6 digit kode verifikasi.");
setDisableLoading(!0);setDisableError("");
try{
if("totp"===eDisableTarget){
let payload={enabled:!1,totp_token:eDisableCode.trim(),pin:eDisableCode.trim()};
(0,c.assertOk)(await c.apiAuth.patch("/Authentication/profile/security/totp",payload));
}else if("pin"===eDisableTarget){
let payload={enabled:!1,pin:eDisableCode.trim(),totp_token:eDisableCode.trim()};
(0,c.assertOk)(await c.apiAuth.patch("/Authentication/profile/security/pin",payload));
}else if("email_otp"===eDisableTarget){
let payload={enabled:!1,totp_token:eDisableCode.trim(),pin:eDisableCode.trim(),apply_global:!0};
(0,c.assertOk)(await c.apiAuth.patch("/Authentication/profile/security/email-otp",payload));
}
e.current?.show({severity:"success",summary:"Berhasil",detail:"Metode keamanan berhasil dinonaktifkan."});
setDisableModal(!1);await eT();
}catch(err){
let msg=err.response?.data?.errors?.totp_token?.[0]||err.response?.data?.errors?.pin?.[0]||err.response?.data?.message||"Kode verifikasi salah.";
setDisableError(msg);
}finally{setDisableLoading(!1);}
}})]}),children:(0,t.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.85rem",padding:"0.5rem 0"},children:[(0,t.jsxs)("div",{style:{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.25)",borderRadius:8,padding:"0.65rem 0.8rem",display:"flex",gap:"0.6rem",alignItems:"flex-start"},children:[(0,t.jsx)("i",{className:"pi pi-exclamation-triangle",style:{color:"#ef4444",fontSize:"1.1rem",marginTop:"0.15rem"}}),(0,t.jsxs)("div",{children:[(0,t.jsx)("div",{style:{fontWeight:700,fontSize:"0.82rem",color:"#f87171"},children:"Peringatan Penonaktifan"}),(0,t.jsx)("div",{style:{fontSize:"0.76rem",color:"#cbd5e1",marginTop:"0.15rem"},children:"Apakah Anda yakin ingin menonaktifkan "+("totp"===eDisableTarget?"Google Authenticator (TOTP)":"pin"===eDisableTarget?"PIN Keamanan":"OTP Email Kedinasan")+"? Akun Anda akan kehilangan proteksi keamanan ini."})]})]}),(0,t.jsxs)("div",{style:{textAlign:"center",display:"grid",gap:"0.5rem"},children:[(0,t.jsx)("label",{style:{fontSize:"0.78rem",fontWeight:600,color:"#e2e8f0"},children:"Masukkan 6-Digit Kode Verifikasi ("+("totp"===eDisableTarget?"Google Authenticator / PIN":(a.totp_enabled?"Aplikasi Authenticator":"PIN Keamanan / OTP"))+"):"}),(0,t.jsx)("div",{style:{display:"flex",justifyContent:"center"},children:(0,t.jsx)(l.InputOtp,{value:eDisableCode,onChange:ev=>setDisableCode(String(ev.value??"")),length:6,integerOnly:!0})})]}),eDisableError&&(0,t.jsx)("div",{style:{color:"#f87171",fontSize:"0.75rem",background:"rgba(239,68,68,0.1)",padding:"0.4rem 0.6rem",borderRadius:6,textAlign:"center"},children:eDisableError})]})}),(0,t.jsx)(r.Dialog,{header:"Edit Data Wilayah Satker",visible:Boolean(eO && !isReadOnlyMode),onHide:()=>eP(!1),style:{width:"32rem",maxWidth:"95vw"},modal:!0,footer:(0,t.jsxs)("div",{children:[(0,t.jsx)(o.Button,{label:"Batal",text:!0,onClick:()=>eP(!1),disabled:eC}),(0,t.jsx)(o.Button,{label:"Simpan",icon:"pi pi-check",onClick:e_,loading:eC})]}),children:(0,t.jsxs)("div",{style:{display:"grid",gap:"0.7rem"},children:[(0,t.jsxs)("p",{style:{margin:0,fontSize:"0.8rem",color:"#94a3b8"},children:["Data wilayah untuk ",(0,t.jsx)("strong",{children:eb?.deskripsi})," (",eb?.kode,"). ","FUNGSI"===String(eb?.tipe_satker||"").toUpperCase()?"Satker bertipe Fungsi menginduk ke data wilayah & jumlah penduduk Polda/Polres induk.":"Dipakai a.l. utk perhitungan Crime Rate — isi jumlah penduduk terbaru wilayah hukum satker Anda."]}),(0,t.jsx)(F,{id:"fld-3def3ti6rk0vr-42",name:"field_3def3ti6rk0vr_42",label:"Alamat",children:(0,t.jsx)(i.InputText,{id:"profile-wilayah-alamat",name:"alamat",autoComplete:"street-address",value:eN.alamat,onChange:e=>eE(t=>({...t,alamat:e.target.value})),style:{width:"100%"}})}),(0,t.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.7rem"},children:[(0,t.jsx)(F,{id:"fld-3def3ti6rk0vr-44",name:"field_3def3ti6rk0vr_44",label:"Provinsi",children:(0,t.jsx)(i.InputText,{id:"profile-wilayah-provinsi",name:"provinsi",autoComplete:"address-level1",value:eN.provinsi,onChange:e=>eE(t=>({...t,provinsi:e.target.value})),style:{width:"100%"}})}),(0,t.jsx)(F,{id:"fld-3def3ti6rk0vr-46",name:"field_3def3ti6rk0vr_46",label:"Kabupaten/Kota",children:(0,t.jsx)(i.InputText,{id:"profile-wilayah-kabupaten",name:"kabupaten_kota",autoComplete:"address-level2",value:eN.kabupaten_kota,onChange:e=>eE(t=>({...t,kabupaten_kota:e.target.value})),style:{width:"100%"}})}),(0,t.jsx)(F,{id:"fld-3def3ti6rk0vr-48",name:"field_3def3ti6rk0vr_48",label:"Kecamatan",children:(0,t.jsx)(i.InputText,{id:"profile-wilayah-kecamatan",name:"kecamatan",autoComplete:"address-level3",value:eN.kecamatan,onChange:e=>eE(t=>({...t,kecamatan:e.target.value})),style:{width:"100%"}})}),(0,t.jsx)(F,{id:"fld-3def3ti6rk0vr-50",name:"field_3def3ti6rk0vr_50",label:"Desa/Kelurahan",children:(0,t.jsx)(i.InputText,{id:"profile-wilayah-desa",name:"desa",autoComplete:"off",value:eN.desa,onChange:e=>eE(t=>({...t,desa:e.target.value})),style:{width:"100%"}})}),(0,t.jsx)(F,{id:"fld-3def3ti6rk0vr-52",name:"field_3def3ti6rk0vr_52",label:"Kode Pos",children:(0,t.jsx)(i.InputText,{id:"profile-wilayah-kodepos",name:"kode_pos",autoComplete:"postal-code",value:eN.kode_pos,onChange:e=>eE(t=>({...t,kode_pos:e.target.value})),style:{width:"100%"}})}),(0,t.jsx)(F,{id:"fld-3def3ti6rk0vr-54",name:"field_3def3ti6rk0vr_54",label:"Jumlah Penduduk",hint:"FUNGSI"===String(eb?.tipe_satker||"").toUpperCase()?"menginduk ke wilayah Polda/Polres":"angka bulat",children:(0,t.jsx)(i.InputText,{id:"profile-wilayah-penduduk",name:"jumlah_penduduk",autoComplete:"off",disabled:"FUNGSI"===String(eb?.tipe_satker||"").toUpperCase(),readOnly:"FUNGSI"===String(eb?.tipe_satker||"").toUpperCase(),value:"FUNGSI"===String(eb?.tipe_satker||"").toUpperCase()?"":"string"==typeof eN.jumlah_penduduk?eN.jumlah_penduduk:"",onChange:e=>eE(t=>({...t,jumlah_penduduk:e.target.value.replace(/[^d]/g,"")})),style:{width:"100%",cursor:"FUNGSI"===String(eb?.tipe_satker||"").toUpperCase()?"not-allowed":void 0,backgroundColor:"FUNGSI"===String(eb?.tipe_satker||"").toUpperCase()?"#f8fafc":void 0},placeholder:"FUNGSI"===String(eb?.tipe_satker||"").toUpperCase()?"Menginduk ke data Polda / Polres (Satker Fungsi)":"mis. 125000"})}),(0,t.jsx)(F,{id:"fld-3def3ti6rk0vr-56",name:"field_3def3ti6rk0vr_56",label:"Longitude",hint:"-180 s/d 180",children:(0,t.jsx)(i.InputText,{id:"profile-wilayah-longitude",name:"longitude",autoComplete:"off",value:eN.longitude,onChange:e=>eE(t=>({...t,longitude:e.target.value})),style:{width:"100%"},placeholder:"mis. 106.827153"})}),(0,t.jsx)(F,{id:"fld-3def3ti6rk0vr-58",name:"field_3def3ti6rk0vr_58",label:"Latitude",hint:"-90 s/d 90",children:(0,t.jsx)(i.InputText,{id:"profile-wilayah-latitude",name:"latitude",autoComplete:"off",value:eN.latitude,onChange:e=>eE(t=>({...t,latitude:e.target.value})),style:{width:"100%"},placeholder:"mis. -6.175392"})})]})]})}),(0,t.jsx)(r.Dialog,{
header:1===eOtpStep?("enable_email_otp"===et?"Aktifkan OTP Email Login (Langkah 1/2)":"change_pin"===et?"Ubah PIN Keamanan (Langkah 1/2)":"Aktifkan PIN Keamanan (Langkah 1/2)"):"Verifikasi Kode OTP (Langkah 2/2)",
visible:Boolean(Q && !isReadOnlyMode),
onHide:()=>ee(!1),
style:{width:"27rem",maxWidth:"95vw"},
modal:!0,
footer:1===eOtpStep?(0,t.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%"},children:[
  (0,t.jsx)(o.Button,{label:"Batal",text:!0,onClick:()=>ee(!1),disabled:ey}),
  (0,t.jsx)(o.Button,{label:"Kirim Kode OTP",icon:"pi pi-send",iconPos:"right",onClick:()=>sendSecurityOtp(eEmailChoice),loading:ey,disabled:ey||(eOtpAttempts>=3)})
]}):(0,t.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%"},children:[
  (0,t.jsx)(o.Button,{label:"Kembali",icon:"pi pi-arrow-left",text:!0,onClick:()=>{setOtpStep(1);el("");ev("");},disabled:em}),
  (0,t.jsx)(o.Button,{label:"Verifikasi & Aktifkan",icon:"pi pi-check",onClick:eM,loading:em})
]}),
children:1===eOtpStep?(0,t.jsxs)("div",{style:{display:"grid",gap:"1rem",textAlign:"left"},children:[
  (0,t.jsxs)("div",{style:{display:"grid",gap:"0.45rem"},children:[
    (0,t.jsxs)("label",{style:{fontSize:"0.78rem",fontWeight:700,color:"#e2e8f0",display:"flex",alignItems:"center",gap:"0.4rem"},children:[
      (0,t.jsx)("i",{className:"pi pi-envelope",style:{color:"#38bdf8",fontSize:"0.85rem"}}),
      "Kirim Kode OTP Ke:"
    ]}),
    (0,t.jsxs)("div",{onClick:()=>setEmailChoice("dinas"),style:{padding:"0.6rem 0.8rem",borderRadius:"8px",cursor:"pointer",border:"dinas"===eEmailChoice?"1.5px solid #38bdf8":"1px solid rgba(255,255,255,0.12)",background:"dinas"===eEmailChoice?"rgba(56,189,248,0.12)":"rgba(255,255,255,0.03)",display:"flex",alignItems:"center",justifyContent:"space-between",transition:"all 0.15s ease"},children:[
      (0,t.jsxs)("div",{children:[
        (0,t.jsxs)("div",{style:{fontSize:"0.74rem",fontWeight:700,color:"dinas"===eEmailChoice?"#38bdf8":"#cbd5e1"},children:["Email Dinas POLRI ",(0,t.jsx)("span",{style:{fontSize:"0.65rem",padding:"1px 6px",borderRadius:4,background:"rgba(56,189,248,0.2)",color:"#38bdf8",marginLeft:"0.3rem"},children:"Utama"})]}),
        (0,t.jsx)("div",{style:{fontSize:"0.82rem",color:"#f8fafc",fontFamily:"monospace",marginTop:"2px"},children:a.email_polri||a.email})
      ]}),
      (0,t.jsx)("i",{className:"dinas"===eEmailChoice?"pi pi-check-circle":"pi pi-circle",style:{color:"dinas"===eEmailChoice?"#38bdf8":"#64748b",fontSize:"1.1rem"}})
    ]}),
    a.email&&a.email_polri&&a.email!==a.email_polri&&(0,t.jsxs)("div",{onClick:()=>setEmailChoice("sekunder"),style:{padding:"0.6rem 0.8rem",borderRadius:"8px",cursor:"pointer",border:"sekunder"===eEmailChoice?"1.5px solid #38bdf8":"1px solid rgba(255,255,255,0.12)",background:"sekunder"===eEmailChoice?"rgba(56,189,248,0.12)":"rgba(255,255,255,0.03)",display:"flex",alignItems:"center",justifyContent:"space-between",transition:"all 0.15s ease"},children:[
      (0,t.jsxs)("div",{children:[
        (0,t.jsxs)("div",{style:{fontSize:"0.74rem",fontWeight:700,color:"sekunder"===eEmailChoice?"#38bdf8":"#cbd5e1"},children:["Email Sekunder ",(0,t.jsx)("span",{style:{fontSize:"0.65rem",padding:"1px 6px",borderRadius:4,background:"rgba(255,255,255,0.1)",color:"#94a3b8",marginLeft:"0.3rem"},children:"Cadangan"})]}),
        (0,t.jsx)("div",{style:{fontSize:"0.82rem",color:"#f8fafc",fontFamily:"monospace",marginTop:"2px"},children:a.email})
      ]}),
      (0,t.jsx)("i",{className:"sekunder"===eEmailChoice?"pi pi-check-circle":"pi pi-circle",style:{color:"sekunder"===eEmailChoice?"#38bdf8":"#64748b",fontSize:"1.1rem"}})
    ]})
  ]}),
  ["enable_email_otp","enable_pin","change_pin"].includes(et)&&(0,t.jsxs)("div",{style:{display:"grid",gap:"0.35rem"},children:[
    (0,t.jsxs)("label",{style:{fontSize:"0.78rem",fontWeight:700,color:"#e2e8f0"},children:["Password Akun Saat Ini ",(0,t.jsx)("span",{style:{color:"#ef4444"},children:"*"})]}),
    (0,t.jsxs)("div",{style:{position:"relative",display:"flex",alignItems:"center"},children:[
      (0,t.jsx)(i.InputText,{type:eShowPassword?"text":"password",placeholder:"Masukkan password akun Anda",value:eExistingPassword,onChange:e=>{setExistingPassword(e.target.value);ev("");},style:{width:"100%",fontSize:"0.85rem",paddingRight:"2.5rem"}}),
      (0,t.jsx)("i",{className:eShowPassword?"pi pi-eye-slash":"pi pi-eye",style:{position:"absolute",right:"0.75rem",color:"#94a3b8",cursor:"pointer",fontSize:"0.95rem"},onClick:()=>setShowPassword(!eShowPassword)})
    ]}),
    (0,t.jsx)("small",{style:{fontSize:"0.68rem",color:"#94a3b8"},children:"Verifikasi password diperlukan untuk mengonfirmasi kepemilikan akun sebelum OTP dikirim."})
  ]}),
  ["enable_pin","change_pin"].includes(et)&&(0,t.jsxs)("div",{style:{display:"grid",gap:"0.6rem"},children:[
    (0,t.jsx)(F,{id:"fld-3def3ti6rk0vr-60",name:"field_3def3ti6rk0vr_60",label:"PIN Baru (6-8 digit)",children:(0,t.jsxs)("div",{style:{position:"relative"},children:[
      (0,t.jsx)(i.InputText,{id:"profile-pin-input",name:"pin",autoComplete:"off",value:eo,onChange:e=>es(e.target.value.replace(/\D/g,"").slice(0,8)),style:{width:"100%",paddingRight:"2.3rem"},inputMode:"numeric",type:ed?"text":"password",placeholder:"mis. 123456"}),
      (0,t.jsx)("button",{type:"button",onClick:()=>ep(e=>!e),tabIndex:-1,style:{position:"absolute",right:"0.5rem",top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#94a3b8",display:"flex",padding:0},children:ed?(0,t.jsx)(D.EyeOff,{size:16}):(0,t.jsx)(T.Eye,{size:16})})
    ]})}),
    (0,t.jsx)(F,{id:"fld-3def3ti6rk0vr-62",name:"field_3def3ti6rk0vr_62",label:"Konfirmasi PIN",children:(0,t.jsx)(i.InputText,{id:"profile-pin-confirm",name:"pin_confirm",autoComplete:"off",value:eu,onChange:e=>ec(e.target.value.replace(/\D/g,"").slice(0,8)),style:{width:"100%"},inputMode:"numeric",type:ed?"text":"password",placeholder:"ulangi PIN"})})
  ]}),
  eg&&(0,t.jsx)("small",{className:"bdb-error",style:{color:"#ef4444",fontSize:"0.75rem",fontWeight:600},children:eg})
]}):(0,t.jsxs)("div",{style:{display:"grid",gap:"0.9rem",textAlign:"center"},children:[
  (0,t.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem",textAlign:"left",background:"rgba(56,189,248,0.08)",padding:"0.7rem 0.85rem",borderRadius:8,border:"1px solid rgba(56,189,248,0.2)"},children:[
    (0,t.jsxs)("div",{style:{fontSize:"0.75rem",color:"#cbd5e1"},children:["Kode OTP 6-digit dikirim ke: ",(0,t.jsx)("b",{style:{color:"#38bdf8"},children:eOtpSentTo||("sekunder"===eEmailChoice?a.email:(a.email_polri||a.email))})]}),
    (0,t.jsxs)("div",{style:{display:"flex",gap:"0.4rem",flexWrap:"wrap",alignItems:"center"},children:[
      (0,t.jsxs)("button",{type:"button",disabled:eOtpCooldown>0||eOtpAttempts>=3||ey,onClick:()=>sendSecurityOtp("dinas"),style:{padding:"0.25rem 0.55rem",borderRadius:6,fontSize:"0.7rem",cursor:(eOtpCooldown>0||eOtpAttempts>=3||ey)?"not-allowed":"pointer",opacity:(eOtpCooldown>0||eOtpAttempts>=3||ey)?0.5:1,border:"dinas"===eEmailChoice?"1px solid #3b82f6":"1px solid rgba(255,255,255,0.15)",background:"dinas"===eEmailChoice?"rgba(59,130,246,0.2)":"transparent",color:"dinas"===eEmailChoice?"#60a5fa":"#94a3b8"},children:[
        eOtpAttempts>=3?"Batas 3x":eOtpCooldown>0?`Kirim Ulang (${eOtpCooldown}s)`:"Kirim Ulang Email Dinas",
        ": ",a.email_polri||a.email
      ]}),
      a.email&&a.email_polri&&a.email!==a.email_polri&&(0,t.jsxs)("button",{type:"button",disabled:eOtpCooldown>0||eOtpAttempts>=3||ey,onClick:()=>sendSecurityOtp("sekunder"),style:{padding:"0.25rem 0.55rem",borderRadius:6,fontSize:"0.7rem",cursor:(eOtpCooldown>0||eOtpAttempts>=3||ey)?"not-allowed":"pointer",opacity:(eOtpCooldown>0||eOtpAttempts>=3||ey)?0.5:1,border:"sekunder"===eEmailChoice?"1px solid #3b82f6":"1px solid rgba(255,255,255,0.15)",background:"sekunder"===eEmailChoice?"rgba(59,130,246,0.2)":"transparent",color:"sekunder"===eEmailChoice?"#60a5fa":"#94a3b8"},children:[
        eOtpAttempts>=3?"Batas 3x":eOtpCooldown>0?`Kirim Ulang (${eOtpCooldown}s)`:"Kirim Ulang Email Sekunder",
        ": ",a.email
      ]})
    ]})
  ]}),
  (0,t.jsx)("div",{style:{display:"flex",justifyContent:"center",margin:"0.3rem 0"},children:(0,t.jsx)(l.InputOtp,{value:ei,onChange:e=>el(String(e.value??"")),length:6,integerOnly:!0})}),
  eg&&(0,t.jsx)("small",{className:"bdb-error",style:{color:"#ef4444",fontSize:"0.75rem",fontWeight:600},children:eg})
]})
}),
// Modal: Reaksi Personil di Profil
    (0,t.jsx)(r.Dialog,{
      header:(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[
        (0,t.jsx)("span",{style:{fontSize:"1.2rem"},children:"👍"}),
        (0,t.jsx)("span",{style:{fontWeight:800},children:"Reaksi Personil (" + ePersonalLikesList.length + ")"})
      ]}),
      visible:Boolean(ePersonalLikesModal),
      onHide:() => setPersonalLikesModal(!1),
      style:{width:"30rem",maxWidth:"95vw"},
      modal:!0,
      dismissableMask:!0,
      children:eLoadingPersonalLikes ? (
        (0,t.jsx)("div",{style:{padding:"2rem",textAlign:"center",color:"#94a3b8",fontSize:"0.85rem"},children:"Memuat daftar personil…"})
      ) : ePersonalLikesList.length === 0 ? (
        (0,t.jsx)("div",{style:{padding:"2rem",textAlign:"center",color:"#94a3b8",fontSize:"0.85rem"},children:"Belum ada personil yang memberikan reaksi."})
      ) : (
        (0,t.jsx)("div",{style:{display:"grid",gap:"0.6rem",padding:"0.5rem 0",maxHeight:"24rem",overflowY:"auto"},children:
          ePersonalLikesList.map(rx => {
            var usr = rx.user || {};
            var isUsrSuper = ['1', '320', '15403', '15404', '16568', '16576', '16594'].includes(String(usr.id)) || String(usr.role_bdb || usr.role || '').toLowerCase() === 'superadmin';
            var usrBadge = getVerificationBadge(usr.role_bdb || usr.role, isUsrSuper, usr.id, usr.username);
            var usrHandle = (usr.callsign ? (String(usr.callsign).startsWith('@') ? usr.callsign : '@' + usr.callsign) : (usr.username ? (String(usr.username).startsWith('@') ? usr.username : '@' + usr.username) : '@personil'));
            var initials = String(usr.name || usr.username || 'P').charAt(0).toUpperCase();
            var usrPhoto = usr.photo_url || usr.foto || usr.photo || null;

            return (0,t.jsxs)("div",{key:rx.id,style:{display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"8px",padding:"0.6rem 0.8rem"},children:[
              (0,t.jsxs)("div",{
                onClick:() => {
                  setPersonalLikesModal(!1);
                  var isSelf = String(usr.id) === String(mySelf?.id || a?.id);
                  if (isSelf) {
                    try { sessionStorage.removeItem('cas_view_user'); } catch(e) {}
                    window.location.href = '/cms/profile';
                  } else {
                    var h = String(usr.username || usr.callsign || usr.id).replace(/^@/, '');
                    window.location.href = '/cms/profile?u=' + encodeURIComponent(h);
                  }
                },
                style:{display:"flex",alignItems:"center",gap:"0.65rem",cursor:"pointer"},
                title:"Klik untuk melihat profil personil",
                children:[
                  renderCornerAvatar(usrPhoto, initials, usrBadge, 2.2, 14, 8),
                  (0,t.jsxs)("div",{children:[
                    (0,t.jsx)("div",{style:{fontWeight:700,fontSize:"0.88rem",color:isUsrSuper ? '#f59e0b' : '#38bdf8'},children:usrHandle}),
                    (0,t.jsx)("div",{style:{fontSize:"0.72rem",color:"var(--cas-text-secondary, #94a3b8)"},children:isUsrSuper ? "Robinopsnal Bareskrim Polri" : (usr.satker || "Mabes Bareskrim")})
                  ]})
                ]
              }),
              (0,t.jsx)("span",{style:{fontSize:"1.25rem"},children:"👍"})
            ]});
          })
        })
      )
    }),

    (0,t.jsx)(r.Dialog,{
  header:eLightboxMedia?.name || "Pratinjau Foto CAS",
  visible:Boolean(eLightboxMedia),
  onHide:()=>setLightboxMedia(null),
  style:{width:"48rem",maxWidth:"95vw"},
  modal:!0,
  dismissableMask:!0,
  children:eLightboxMedia && (0,t.jsxs)("div",{
    style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"1rem",padding:"0.5rem 0"},
    children:[
      (0,t.jsx)("img",{
        src:eLightboxMedia.url,
        alt:eLightboxMedia.name || "Foto",
        style:{maxWidth:"100%",maxHeight:"75vh",borderRadius:"8px",objectFit:"contain",boxShadow:"0 8px 30px rgba(0,0,0,0.5)"}
      }),
      (0,t.jsxs)("div",{
        style:{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",borderTop:"1px solid rgba(255,255,255,0.1)",paddingTop:"0.75rem"},
        children:[
          (0,t.jsx)("span",{style:{fontSize:"0.78rem",color:"#94a3b8",wordBreak:"break-all"},children:eLightboxMedia.name}),
          (0,t.jsx)("a",{
            href:eLightboxMedia.url,
            download:eLightboxMedia.name || "CAS_Foto.jpg",
            target:"_blank",
            rel:"noopener noreferrer",
            style:{background:"#2563eb",color:"#fff",textDecoration:"none",padding:"0.4rem 0.85rem",borderRadius:"6px",fontSize:"0.78rem",fontWeight:700,display:"inline-flex",alignItems:"center",gap:"0.4rem"},
            children:"⬇️ Unduh Foto"
          })
        ]
      })
    ]
  })
})]})}],34850)}]);