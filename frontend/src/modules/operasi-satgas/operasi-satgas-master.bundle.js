(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,72382,e=>{"use strict";let t=(0,e.i(56420).default)("eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);e.s(["Eye",0,t],72382)},73225,e=>{"use strict";let t=(0,e.i(56420).default)("file-search",[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["circle",{cx:"11.5",cy:"14.5",r:"2.5",key:"1bq0ko"}],["path",{d:"M13.3 16.3 15 18",key:"2quom7"}]]);e.s(["FileSearch",0,t],73225)},22769,e=>{"use strict";var t=e.i(71645),n=e.i(48264),r=e.i(1743),i=e.i(43456),a=e.i(29168),l=e.i(62004),o=e.i(78954),s=e.i(58602),u=e.i(44080),c=e.i(28797),p=e.i(40623),d=e.i(73193),f=e.i(83438),m=e.i(27259),y=e.i(64952),h=e.i(1311);function g(e){return(g="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function b(e,t,n){var r;return(r=function(e,t){if("object"!=g(e)||!e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var r=n.call(e,t||"default");if("object"!=g(r))return r;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(t,"string"),(t="symbol"==g(r)?r:r+"")in e)?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function v(){return(v=Object.assign.bind()).apply(null,arguments)}function S(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function x(e,t){if(e){if("string"==typeof e)return S(e,t);var n=({}).toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?S(e,t):void 0}}function j(e){return function(e){if(Array.isArray(e))return S(e)}(e)||function(e){if("u">typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||x(e)||function(){throw TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function w(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"u">typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var r,i,a,l,o=[],s=!0,u=!1;try{if(a=(n=n.call(e)).next,0===t){if(Object(n)!==n)return;s=!1}else for(;!(s=(r=a.call(n)).done)&&(o.push(r.value),o.length!==t);s=!0);}catch(e){u=!0,i=e}finally{try{if(!s&&null!=n.return&&(l=n.return(),Object(l)!==l))return}finally{if(u)throw i}}return o}}(e,t)||x(e,t)||function(){throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var O=i.ComponentBase.extend({defaultProps:{__TYPE:"AutoComplete",id:null,appendTo:null,autoFocus:!1,autoHighlight:!1,className:null,completeMethod:null,delay:300,disabled:!1,dropdown:!1,dropdownAriaLabel:null,dropdownAutoFocus:!0,dropdownIcon:null,dropdownMode:"blank",emptyMessage:null,field:null,forceSelection:!1,inputClassName:null,inputId:null,inputRef:null,inputStyle:null,variant:null,invalid:!1,itemTemplate:null,loadingIcon:null,maxLength:null,minLength:1,multiple:!1,name:null,onBlur:null,onChange:null,onClear:null,onClick:null,onContextMenu:null,onDblClick:null,onDropdownClick:null,onFocus:null,onHide:null,onKeyPress:null,onKeyUp:null,onMouseDown:null,onSelect:null,onShow:null,onUnselect:null,optionGroupChildren:null,optionGroupLabel:null,optionGroupTemplate:null,panelClassName:null,panelFooterTemplate:null,panelStyle:null,placeholder:null,readOnly:!1,removeTokenIcon:null,scrollHeight:"200px",selectedItemTemplate:null,selectionLimit:null,showEmptyMessage:!1,size:null,style:null,suggestions:null,tabIndex:null,tooltip:null,tooltipOptions:null,transitionOptions:null,type:"text",value:null,virtualScrollerOptions:null,children:void 0},css:{classes:{root:function(e){var t=e.props,n=e.focusedState;return(0,d.classNames)("p-autocomplete p-component p-inputwrapper",{"p-autocomplete-dd":t.dropdown,"p-autocomplete-multiple":t.multiple,"p-inputwrapper-filled":t.value,"p-invalid":t.invalid,"p-inputwrapper-focus":n})},container:function(e){var t=e.props,n=e.context;return(0,d.classNames)("p-autocomplete-multiple-container p-component p-inputtext",{"p-disabled":t.disabled,"p-variant-filled":t.variant?"filled"===t.variant:n&&"filled"===n.inputStyle})},loadingIcon:"p-autocomplete-loader",dropdownButton:"p-autocomplete-dropdown",removeTokenIcon:"p-autocomplete-token-icon",token:"p-autocomplete-token p-highlight",tokenLabel:"p-autocomplete-token-label",inputToken:"p-autocomplete-input-token",input:function(e){var t=e.props,n=e.context;return(0,d.classNames)("p-autocomplete-input",{"p-autocomplete-dd-input":t.dropdown,"p-variant-filled":t.variant?"filled"===t.variant:n&&"filled"===n.inputStyle})},panel:function(e){var t=e.context;return(0,d.classNames)("p-autocomplete-panel p-component",{"p-ripple-disabled":t&&!1===t.ripple||!1===n.default.ripple})},listWrapper:"p-autocomplete-items-wrapper",list:function(e){var t=e.virtualScrollerOptions,n=e.options;return t?(0,d.classNames)("p-autocomplete-items",n.className):"p-autocomplete-items"},emptyMessage:"p-autocomplete-item",item:function(e){var t=e.suggestion,n=e.optionGroupLabel,r=e.selected;return n?(0,d.classNames)("p-autocomplete-item",{"p-disabled":t.disabled},{selected:r}):(0,d.classNames)("p-autocomplete-item",{"p-disabled":t.disabled},{"p-highlight":r})},itemGroup:"p-autocomplete-item-group",footer:"p-autocomplete-footer",transition:"p-connected-overlay"},styles:"\n@layer primereact {\n    .p-autocomplete {\n        display: inline-flex;\n        position: relative;\n    }\n    \n    .p-autocomplete-loader {\n        position: absolute;\n        top: 50%;\n        margin-top: -.5rem;\n    }\n    \n    .p-autocomplete-dd .p-autocomplete-input {\n        flex: 1 1 auto;\n        width: 1%;\n    }\n    \n    .p-autocomplete-dd .p-autocomplete-input,\n    .p-autocomplete-dd .p-autocomplete-multiple-container {\n         border-top-right-radius: 0;\n         border-bottom-right-radius: 0;\n     }\n    \n    .p-autocomplete-dd .p-autocomplete-dropdown {\n         border-top-left-radius: 0;\n         border-bottom-left-radius: 0px;\n    }\n    \n    .p-autocomplete .p-autocomplete-panel {\n        min-width: 100%;\n    }\n    \n    .p-autocomplete-panel {\n        position: absolute;\n        top: 0;\n        left: 0;\n    }\n    \n    .p-autocomplete-items {\n        margin: 0;\n        padding: 0;\n        list-style-type: none;\n    }\n    \n    .p-autocomplete-item {\n        cursor: pointer;\n        white-space: nowrap;\n        position: relative;\n        overflow: hidden;\n    }\n    \n    .p-autocomplete-multiple-container {\n        margin: 0;\n        padding: 0;\n        list-style-type: none;\n        cursor: text;\n        overflow: hidden;\n        display: flex;\n        align-items: center;\n        flex-wrap: wrap;\n    }\n    \n    .p-autocomplete-token {\n        cursor: default;\n        display: inline-flex;\n        align-items: center;\n        flex: 0 0 auto;\n    }\n    \n    .p-autocomplete-token-icon {\n        cursor: pointer;\n    }\n    \n    .p-autocomplete-input-token {\n        flex: 1 1 auto;\n        display: inline-flex;\n    }\n    \n    .p-autocomplete-input-token input {\n        border: 0 none;\n        outline: 0 none;\n        background-color: transparent;\n        margin: 0;\n        padding: 0;\n        box-shadow: none;\n        border-radius: 0;\n        width: 100%;\n    }\n    \n    .p-fluid .p-autocomplete {\n        display: flex;\n    }\n    \n    .p-fluid .p-autocomplete-dd .p-autocomplete-input {\n        width: 1%;\n    }\n    \n    .p-autocomplete-items-wrapper {\n        overflow: auto;\n    } \n}\n"}});function k(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function C(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?k(Object(n),!0).forEach(function(t){b(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):k(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}var E=t.memo(t.forwardRef(function(e,r){var i,l,o,s,u,c=(0,a.useMergeProps)(),p=e.ptm,g=e.cx,b=t.useContext(n.PrimeReactContext),S=function(t,n){return p(t,C({hostName:e.hostName},n))},x=function(t,n){return S(n,{context:{selected:e.selectedItem.current===t,disabled:t.disabled}})},w=function(t){return d.ObjectUtils.resolveFieldData(t,e.optionGroupLabel)},O=t.useRef({key:null,index:0,keyIndex:0}),k=function(n,r,i,a){var l=e.optionGroupTemplate?d.ObjectUtils.getJSXElement(e.optionGroupTemplate,n,i):e.getOptionGroupLabel(n)||n,o=c(C({index:i,className:g("itemGroup"),"data-p-highlight":!1},a),S("itemGroup"));return t.createElement("li",v({},o,{key:r||null}),l)},E=function(n,r,i,a){var l=e.selectedItem&&e.selectedItem.current&&Array.isArray(e.selectedItem.current)?e.selectedItem.current.some(function(e){return d.ObjectUtils.deepEquals(e,n)}):d.ObjectUtils.deepEquals(e.selectedItem.current,n),o=e.itemTemplate?d.ObjectUtils.getJSXElement(e.itemTemplate,n,i):e.field?d.ObjectUtils.resolveFieldData(n,e.field):n,s=c(C({index:i,role:"option",className:g("item",{optionGroupLabel:e.optionGroupLabel,suggestion:n,selected:l}),onClick:function(t){return e.onItemClick(t,n)},"aria-selected":l},a),x(n,"item"));return t.createElement("li",v({key:r},s),o,t.createElement(y.Ripple,null))},_=function(n,r){var i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},a={height:i.props?i.props.itemSize:void 0};if(e.optionGroupLabel){if(e.virtualScrollerOptions){var l,o,s=(l=e.suggestions,o=e.optionGroupLabel,l.findIndex(function(e){return e[o]===n}));if(-1!==s){O.current={key:n,index:r,keyIndex:s};var u=r+"_"+w(n);return k(n,u,r,{style:a})}var p=r+"_"+O.current.keyIndex,f=c({style:a,"data-group":O.current.keyIndex,"data-index":r-O.current.index-1,"data-p-disabled":n.disabled});return E(n,p,r,f)}var m=e.getOptionGroupChildren(n).map(function(e,t){var n=r+"_"+t,i=c({"data-group":r,"data-index":t,"data-p-disabled":e.disabled});return E(e,n,t,i)}),y=r+"_"+w(n);return t.createElement(t.Fragment,{key:y},k(n,void 0,r,{style:a}),m)}var h="".concat(r,"_").concat(d.ObjectUtils.isObject(n)?d.ObjectUtils.resolveFieldData(n,e.field):n),g=c({style:a,"data-p-disabled":n.disabled},x(n,"item"));return E(n,h,r,g)},P=function(t){try{return null==t?void 0:t.map(function(t){return[null==t?void 0:t[null==e?void 0:e.optionGroupLabel]].concat(j(null==t?void 0:t[null==e?void 0:e.optionGroupChildren]))}).flat()}catch(e){}},I=(i=C({},e.panelStyle||{}),l=function(){if(e.showEmptyMessage&&d.ObjectUtils.isEmpty(e.suggestions)){var r=e.emptyMessage||(0,n.localeOption)("emptyMessage"),i=c({className:g("emptyMessage")},S("emptyMessage")),a=c({className:g("list")},S("list"));return t.createElement("ul",a,t.createElement("li",i,r))}if(e.virtualScrollerOptions){var l=e.suggestions?e.optionGroupLabel?P(null==e?void 0:e.suggestions):e.suggestions:null,o=C(C({},e.virtualScrollerOptions),{style:C(C({},e.virtualScrollerOptions.style),{height:e.scrollHeight}),autoSize:!0,items:l,itemTemplate:function(e,t){return e&&_(e,t.index,t)},contentTemplate:function(n){var r=c({id:e.listId,ref:n.contentRef,style:n.style,className:g("list",{virtualScrollerProps:o,options:n}),role:"listbox"},S("list"));return t.createElement("ul",r,n.children)}});return t.createElement(h.VirtualScroller,v({ref:e.virtualScrollerRef},o,{pt:S("virtualScroller"),__parentMetadata:{parent:e.metaData}}))}var s=e.suggestions?e.suggestions.map(_):null,u=c({id:e.listId,className:g("list"),role:"listbox"},S("list")),p=c({className:g("listWrapper"),style:{maxHeight:e.scrollHeight||"auto"}},S("listWrapper"));return t.createElement("div",p,t.createElement("ul",u,s))}(),o=function(){if(e.panelFooterTemplate){var n=d.ObjectUtils.getJSXElement(e.panelFooterTemplate,e,e.onOverlayHide),r=c({className:g("footer")},S("footer"));return t.createElement("div",r,n)}return null}(),s=c({className:(0,d.classNames)(e.panelClassName,g("panel",{context:b})),style:i,onClick:function(t){return e.onClick(t)},"data-pr-is-overlay":!0},S("panel")),u=c({classNames:g("transition"),in:e.in,timeout:{enter:120,exit:100},options:e.transitionOptions,unmountOnExit:!0,onEnter:e.onEnter,onEntering:e.onEntering,onEntered:e.onEntered,onExit:e.onExit,onExited:e.onExited},S("transition")),t.createElement(f.CSSTransition,v({nodeRef:r},u),t.createElement("div",v({ref:r},s),l,o)));return t.createElement(m.Portal,{element:I,appendTo:e.appendTo})}));function _(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function P(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?_(Object(n),!0).forEach(function(t){b(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):_(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}E.displayName="AutoCompletePanel";var I=t.memo(t.forwardRef(function(e,f){var m,y,h,g,b,S,x=(0,a.useMergeProps)(),k=t.useContext(n.PrimeReactContext),C=O.getProps(e,k),_=w(t.useState(C.id),2),I=_[0],N=_[1],D=w(t.useState(!1),2),A=D[0],T=D[1],R=w(t.useState(!1),2),F=R[0],U=R[1],z=w(t.useState(!1),2),M=z[0],H=z[1],L={props:C,state:{id:I,searching:A,focused:F,overlayVisible:M}},B=O.setMetaData(L),K=B.ptm,G=B.cx,W=B.sx,V=B.isUnstyled;(0,i.useHandleStyle)(O.css.styles,V,{name:"autocomplete"});var q=t.useRef(null),$=t.useRef(null),J=t.useRef(C.inputRef),X=t.useRef(null),Y=t.useRef(null),Z=t.useRef(null),Q=t.useRef(null),ee=w((0,a.useOverlayListener)({target:q,overlay:$,listener:function(e,t){var n=t.type;t.valid&&("outside"===n?er(e)||ep():k.hideOverlaysOnDocumentScrolling?ep():d.DomHandler.isDocument(e.target)||ef())},when:M}),2),et=ee[0],en=ee[1],er=function(e){return C.multiple?e.target===X.current||X.current.contains(e.target):e.target===J.current},ei=function(e){Z.current&&clearTimeout(Z.current);var t=e.target.value;C.multiple||eo(e,t),d.ObjectUtils.isEmpty(t)?(ep(),C.onClear&&C.onClear(e)):t.length>=C.minLength?Z.current=setTimeout(function(){ea(e,t,"input")},C.delay):ep()},ea=function(e,t,n){null==t||("input"!==n||0!==t.trim().length)&&C.completeMethod&&(T(!0),C.completeMethod({originalEvent:e,query:t}))},el=function(e,t,n){C.multiple?(J.current.value="",!eC(t)&&eP()&&eo(e,C.value?[].concat(j(C.value),[t]):[t])):(eu(t),eo(e,t)),C.onSelect&&C.onSelect({originalEvent:e,value:t}),n||(d.DomHandler.focus(J.current),ep())},eo=function(e,t){C.onChange&&C.onChange({originalEvent:e,value:t,stopPropagation:function(){e.stopPropagation()},preventDefault:function(){e.preventDefault()},target:{name:C.name,id:I,value:t}}),Q.current=d.ObjectUtils.isNotEmpty(t)?t:null},es=function(e){if(d.ObjectUtils.isEmpty(e))return"";if("string"==typeof e)return e;if(C.selectedItemTemplate){var t,n=d.ObjectUtils.getJSXElement(C.selectedItemTemplate,e);return C.multiple||"string"==typeof n?n:e}return C.field&&null!=(t=d.ObjectUtils.resolveFieldData(e,C.field))?t:e},eu=function(e){J.current.value=es(e)},ec=function(){H(!0)},ep=function(){H(!1),T(!1)},ed=function(){var e,t=null==(e=eE())||null==(e=e.firstChild)?void 0:e.firstChild;t&&(V()||d.DomHandler.addClass(t,"p-highlight"),t.setAttribute("data-p-highlight",!0))},ef=function(){var e=C.multiple?X.current:J.current;d.DomHandler.alignOverlay($.current,e,C.appendTo||k&&k.appendTo||n.default.appendTo)},em=function(e){C.dropdownAutoFocus&&d.DomHandler.focus(J.current,C.dropdownAutoFocus),"blank"===C.dropdownMode?ea(e,"","dropdown"):"current"===C.dropdownMode&&ea(e,J.current.value,"dropdown"),C.onDropdownClick&&C.onDropdownClick({originalEvent:e,query:J.current.value})},ey=function(e,t){if(!C.disabled&&!C.readOnly){var n=C.value[t];eo(e,C.value.filter(function(e,n){return t!==n})),C.onUnselect&&C.onUnselect({originalEvent:e,value:n})}},eh=function(e){if(M){var t=d.DomHandler.findSingle($.current,'li[data-p-highlight="true"]');switch(e.which){case 40:if(t){var n=eb(t);n&&(V()||d.DomHandler.addClass(n,"p-highlight"),n.setAttribute("data-p-highlight",!0),V()||d.DomHandler.removeClass(t,"p-highlight"),t.setAttribute("data-p-highlight",!1),d.DomHandler.scrollInView(eE(),n))}else t=d.DomHandler.findSingle($.current,"li"),"itemgroup"===d.DomHandler.getAttribute(t,"data-pc-section")&&(t=eb(t)),t&&(V()||d.DomHandler.addClass(t,"p-highlight"),t.setAttribute("data-p-highlight",!0));e.preventDefault();break;case 38:if(t){var r=ev(t);r&&(V()||d.DomHandler.addClass(r,"p-highlight"),r.setAttribute("data-p-highlight",!0),V()||d.DomHandler.removeClass(t,"p-highlight"),t.setAttribute("data-p-highlight",!1),d.DomHandler.scrollInView(eE(),r))}e.preventDefault();break;case 13:t&&(eg(e,t),ep(),e.preventDefault());break;case 27:ep(),e.preventDefault();break;case 9:t&&eg(e,t),ep()}}if(C.multiple&&8===e.which&&C.value&&C.value.length&&!J.current.value){var i=C.value[C.value.length-1];eo(e,C.value.slice(0,-1)),C.onUnselect&&C.onUnselect({originalEvent:e,value:i})}},eg=function(e,t){C.optionGroupLabel?el(e,e_(C.suggestions[t.dataset.group])[t.dataset.index]):el(e,C.suggestions[t.getAttribute("index")])},eb=function(e){var t=e.nextElementSibling;return t?"itemgroup"===d.DomHandler.getAttribute(t,"data-pc-section")?eb(t):t:null},ev=function(e){var t=e.previousElementSibling;return t?"itemgroup"===d.DomHandler.getAttribute(t,"data-pc-section")?ev(t):t:null},eS=function(e){U(!0),C.onFocus&&C.onFocus(e)},ex=function(e){if(C.multiple){J.current.value="";return}var t=d.ObjectUtils.trim(e.target.value).toLowerCase(),n=(C.suggestions||[]).flatMap(function(e){return e.items?e.items:[e]}).find(function(e){var n=C.field?d.ObjectUtils.resolveFieldData(e,C.field):e,r=n?d.ObjectUtils.trim(n).toLowerCase():"";return r&&t===r});n?el(e,n,!0):(J.current.value="",eo(e,null),C.onClear&&C.onClear(e))},ej=function(e){U(!1),C.forceSelection&&ex(e),C.onBlur&&C.onBlur(e)},ew=function(e){d.DomHandler.focus(J.current),C.onClick&&C.onClick(e)},eO=function(e){eS(e),V()||d.DomHandler.addClass(X.current,"p-focus"),X.current.setAttribute("data-p-focus",!0)},ek=function(e){ej(e),V()||d.DomHandler.removeClass(X.current,"p-focus"),X.current.setAttribute("data-p-focus",!1)},eC=function(e){return!!C.value&&C.value.some(function(t){return d.ObjectUtils.equals(t,e)})},eE=function(){var e;return null==$||null==(e=$.current)?void 0:e.firstChild},e_=function(e){return d.ObjectUtils.resolveFieldData(e,C.optionGroupChildren)},eP=function(){return!C.value||!C.selectionLimit||C.value.length<C.selectionLimit};t.useEffect(function(){d.ObjectUtils.combinedRefs(J,C.inputRef)},[J,C.inputRef]),t.useEffect(function(){d.ObjectUtils.isNotEmpty(C.value)&&(Q.current=C.value)},[C.value]),(0,a.useMountEffect)(function(){I||N((0,d.UniqueComponentId)()),C.autoFocus&&d.DomHandler.focus(J.current,C.autoFocus),ef()}),(0,a.useUpdateEffect)(function(){A&&C.autoHighlight&&C.suggestions&&C.suggestions.length&&ed()},[A]),(0,a.useUpdateEffect)(function(){A&&(d.ObjectUtils.isNotEmpty(C.suggestions)||C.showEmptyMessage?ec():ep(),T(!1))},[C.suggestions]),(0,a.useUpdateEffect)(function(){J.current&&!C.multiple&&eu(C.value),M&&ef()}),(0,a.useUnmountEffect)(function(){Z.current&&clearTimeout(Z.current),d.ZIndexUtils.clear($.current)}),t.useImperativeHandle(f,function(){return{props:C,search:ea,show:ec,hide:ep,focus:function(){return d.DomHandler.focus(J.current)},getElement:function(){return q.current},getOverlay:function(){return $.current},getInput:function(){return J.current},getVirtualScroller:function(){return Y.current}}});var eI=function(e,t){switch(e.code){case"Space":case"NumpadEnter":case"Enter":ey(e,t),e.preventDefault(),e.stopPropagation()}},eN=function(e){var n=M?I+"_list":null,r=x({className:G("inputToken")},K("inputToken")),i=x(P({id:C.inputId,ref:J,"aria-autocomplete":"list","aria-controls":n,"aria-expanded":M,"aria-haspopup":"listbox",autoComplete:"off",className:C.inputClassName,disabled:C.disabled,maxLength:C.maxLength,name:C.name,onBlur:ek,onChange:e?ei:void 0,onFocus:eO,onKeyDown:e?eh:void 0,onKeyPress:C.onKeyPress,onKeyUp:C.onKeyUp,placeholder:e?C.placeholder:void 0,readOnly:C.readOnly||!e,required:C.required,role:"combobox",style:C.inputStyle,tabIndex:C.tabIndex,type:C.type},eR),K("input"));return t.createElement("li",r,t.createElement("input",i))},eD=I+"_list",eA=d.ObjectUtils.isNotEmpty(C.tooltip),eT=O.getOtherProps(C),eR=d.ObjectUtils.reduceKeys(eT,d.DomHandler.ARIA_PROPS),eF=function(){if(A){var e=x({className:G("loadingIcon")},K("loadingIcon")),n=C.loadingIcon||t.createElement(o.SpinnerIcon,v({},e,{spin:!0}));return d.IconUtils.getJSXIcon(n,P({},e),{props:C})}return null}(),eU=C.multiple?(m=eP(),y=d.ObjectUtils.isNotEmpty(C.value)?C.value.map(function(e,r){var i=x({className:G("removeTokenIcon"),onClick:function(e){return ey(e,r)},tabIndex:C.tabIndex||"0","aria-label":(0,n.localeOption)("clear"),onKeyDown:function(e){return eI(e,r)}},K("removeTokenIcon")),a=C.removeTokenIcon||t.createElement(s.TimesCircleIcon,i),l=!C.disabled&&d.IconUtils.getJSXIcon(a,P({},i),{props:C}),o=x({className:G("token")},K("token")),u=x({className:G("tokenLabel")},K("tokenLabel"));return t.createElement("li",v({key:r+"multi-item"},o),t.createElement("span",u,es(e)),l)}):(Q.current=null,null),h=eN(m),g=x({ref:X,className:G("container",{context:k}),onClick:m?ew:void 0,onContextMenu:C.onContextMenu,onMouseDown:C.onMouseDown,onDoubleClick:C.onDblClick,"data-p-focus":F,"data-p-disabled":C.disabled},K("container")),t.createElement("ul",g,y,h)):(b=es(C.value),S=M?I+"_list":null,t.createElement(u.InputText,v({ref:J,id:C.inputId,type:C.type,name:C.name,defaultValue:b,role:"combobox","aria-autocomplete":"list","aria-controls":S,"aria-haspopup":"listbox","aria-expanded":M,className:(0,d.classNames)(C.inputClassName,G("input",{context:k})),style:C.inputStyle,autoComplete:"off",readOnly:C.readOnly,required:C.required,disabled:C.disabled,placeholder:C.placeholder,size:C.size,maxLength:C.maxLength,tabIndex:C.tabIndex,onBlur:ej,onFocus:eS,onChange:ei,onMouseDown:C.onMouseDown,onKeyUp:C.onKeyUp,onKeyDown:eh,onKeyPress:C.onKeyPress,onContextMenu:C.onContextMenu,onClick:C.onClick,onDoubleClick:C.onDblClick,pt:K("input"),unstyled:C.unstyled},eR,{__parentMetadata:{parent:L}}))),ez=function(){if(C.dropdown){var e=C.dropdownAriaLabel||C.placeholder||(0,n.localeOption)("choose");return t.createElement(r.Button,{type:"button",icon:C.dropdownIcon||t.createElement(l.ChevronDownIcon,null),className:G("dropdownButton"),disabled:C.disabled,onClick:em,"aria-label":e,pt:K("dropdownButton"),__parentMetadata:{parent:L}})}return null}(),eM=x({id:I,ref:q,style:C.style,className:(0,d.classNames)(C.className,G("root",{focusedState:F}))},eT,K("root"));return t.createElement(t.Fragment,null,t.createElement("span",eM,eU,eF,ez,t.createElement(E,v({hostName:"AutoComplete",ref:$,virtualScrollerRef:Y},C,{listId:eD,onItemClick:el,selectedItem:Q,onOverlayHide:ep,onClick:function(e){c.OverlayService.emit("overlay-click",{originalEvent:e,target:q.current})},getOptionGroupLabel:function(e){return C.optionGroupLabel?d.ObjectUtils.resolveFieldData(e,C.optionGroupLabel):e},getOptionGroupChildren:e_,in:M,onEnter:function(){d.ZIndexUtils.set("overlay",$.current,k&&k.autoZIndex||n.default.autoZIndex,k&&k.zIndex.overlay||n.default.zIndex.overlay),d.DomHandler.addStyles($.current,{position:"absolute",top:"0",left:"0"}),ef()},onEntering:function(){C.autoHighlight&&C.suggestions&&C.suggestions.length&&ed()},onEntered:function(){et(),C.onShow&&C.onShow()},onExit:function(){en()},onExited:function(){d.ZIndexUtils.clear($.current),C.onHide&&C.onHide()},ptm:K,cx:G,sx:W}))),eA&&t.createElement(p.Tooltip,v({target:q,content:C.tooltip,pt:K("tooltip")},C.tooltipOptions)))}));I.displayName="AutoComplete",e.s(["AutoComplete",0,I])},70454,e=>{"use strict";var t=e.i(71645),n=e.i(48264),r=e.i(43456),i=e.i(29168),a=e.i(40623),l=e.i(73193);function o(){return(o=Object.assign.bind()).apply(null,arguments)}function s(e){return(s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}var u=r.ComponentBase.extend({defaultProps:{__TYPE:"InputSwitch",autoFocus:!1,checked:!1,className:null,disabled:!1,falseValue:!1,id:null,inputId:null,inputRef:null,invalid:!1,name:null,onBlur:null,onChange:null,onFocus:null,style:null,tabIndex:null,tooltip:null,tooltipOptions:null,trueValue:!0,children:void 0},css:{classes:{root:function(e){var t=e.props,n=e.checked;return(0,l.classNames)("p-inputswitch p-component",{"p-highlight":n,"p-disabled":t.disabled,"p-invalid":t.invalid})},input:"p-inputswitch-input",slider:"p-inputswitch-slider"}}});function c(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}var p=t.memo(t.forwardRef(function(e,p){var d=(0,i.useMergeProps)(),f=t.useContext(n.PrimeReactContext),m=u.getProps(e,f),y=u.setMetaData({props:m}),h=y.ptm,g=y.cx,b=y.isUnstyled;(0,r.useHandleStyle)(u.css.styles,b,{name:"inputswitch"});var v=t.useRef(null),S=t.useRef(m.inputRef),x=m.checked===m.trueValue;t.useImperativeHandle(p,function(){return{props:m,focus:function(){return l.DomHandler.focus(S.current)},getElement:function(){return v.current},getInput:function(){return S.current}}}),t.useEffect(function(){l.ObjectUtils.combinedRefs(S,m.inputRef)},[S,m.inputRef]),(0,i.useMountEffect)(function(){m.autoFocus&&l.DomHandler.focus(S.current,m.autoFocus)});var j=l.ObjectUtils.isNotEmpty(m.tooltip),w=u.getOtherProps(m),O=l.ObjectUtils.reduceKeys(w,l.DomHandler.ARIA_PROPS),k=d({className:(0,l.classNames)(m.className,g("root",{checked:x})),style:m.style,role:"checkbox","aria-checked":x,"data-p-highlight":x,"data-p-disabled":m.disabled},w,h("root")),C=d(function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?c(Object(n),!0).forEach(function(t){!function(e,t,n){var r;(r=function(e,t){if("object"!=s(e)||!e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var r=n.call(e,t||"default");if("object"!=s(r))return r;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(t,"string"),(t="symbol"==s(r)?r:r+"")in e)?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n}(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):c(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}({type:"checkbox",id:m.inputId,name:m.name,checked:x,onChange:function(e){if(m.onChange){var t=x?m.falseValue:m.trueValue;m.onChange({originalEvent:e,value:t,stopPropagation:function(){null==e||e.stopPropagation()},preventDefault:function(){null==e||e.preventDefault()},target:{name:m.name,id:m.id,value:t}})}},onFocus:function(e){var t;null==m||null==(t=m.onFocus)||t.call(m,e)},onBlur:function(e){var t;null==m||null==(t=m.onBlur)||t.call(m,e)},disabled:m.disabled,role:"switch",tabIndex:m.tabIndex,"aria-checked":x,className:g("input")},O),h("input")),E=d({className:g("slider")},h("slider"));return t.createElement(t.Fragment,null,t.createElement("div",o({id:m.id,ref:v},k),t.createElement("input",o({ref:S},C)),t.createElement("span",E)),j&&t.createElement(a.Tooltip,o({target:v,content:m.tooltip,pt:h("tooltip")},m.tooltipOptions)))}));p.displayName="InputSwitch",e.s(["InputSwitch",0,p])},38644,e=>{"use strict";var t=e.i(71645),n=e.i(48264),r=e.i(43456),i=e.i(29168),a=e.i(40623),l=e.i(73193),o=e.i(64952);function s(){return(s=Object.assign.bind()).apply(null,arguments)}function u(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function c(e,t){if(e){if("string"==typeof e)return u(e,t);var n=({}).toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?u(e,t):void 0}}function p(e){return function(e){if(Array.isArray(e))return u(e)}(e)||function(e){if("u">typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||c(e)||function(){throw TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function d(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"u">typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var r,i,a,l,o=[],s=!0,u=!1;try{if(a=(n=n.call(e)).next,0===t){if(Object(n)!==n)return;s=!1}else for(;!(s=(r=a.call(n)).done)&&(o.push(r.value),o.length!==t);s=!0);}catch(e){u=!0,i=e}finally{try{if(!s&&null!=n.return&&(l=n.return(),Object(l)!==l))return}finally{if(u)throw i}}return o}}(e,t)||c(e,t)||function(){throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var f=r.ComponentBase.extend({defaultProps:{__TYPE:"SelectButton",id:null,value:null,options:null,optionLabel:null,optionValue:null,optionDisabled:null,tabIndex:null,multiple:!1,invalid:!1,unselectable:!0,allowEmpty:!0,disabled:!1,style:null,className:null,dataKey:null,tooltip:null,tooltipOptions:null,itemTemplate:null,onChange:null,children:void 0},css:{classes:{root:function(e){var t=e.props;return(0,l.classNames)("p-selectbutton p-button-group p-component",{"p-invalid":t.invalid})},button:function(e){var t=e.itemProps,n=e.focusedState;return(0,l.classNames)("p-button p-component",{"p-highlight":t.selected,"p-disabled":t.disabled,"p-focus":n})},label:"p-button-label p-c"}}}),m=t.memo(function(e){var n,r=d(t.useState(!1),2),a=r[0],s=r[1],u=(0,i.useMergeProps)(),c=e.ptm,p=e.cx,f=function(t){return c(t,{hostName:e.hostName,context:{selected:e.selected,disabled:e.disabled,option:e.option}})},m=function(t,n){e.setFocusedIndex(n),e.onClick&&e.onClick({originalEvent:t,option:e.option})},y=function(e,t){switch(e.code){case"Space":m(e,t),e.preventDefault();break;case"ArrowDown":case"ArrowRight":h(e,"next"),e.preventDefault();break;case"ArrowUp":case"ArrowLeft":h(e,"prev"),e.preventDefault()}},h=function(t,n){for(var r,i,a=0;a<=e.elementRef.current.children.length-1;a++)"0"===e.elementRef.current.children[a].getAttribute("tabindex")&&(r={elem:e.elementRef.current.children[a],index:a});i="prev"===n?0===r.index?e.elementRef.current.children.length-1:r.index-1:r.index===e.elementRef.current.children.length-1?0:r.index+1,e.setFocusedIndex(i),e.elementRef.current.children[i].focus()},g=(n=u({className:p("label")},f("label")),e.template?l.ObjectUtils.getJSXElement(e.template,e.option):t.createElement("span",n,e.label)),b=u({className:(0,l.classNames)(e.className,p("button",{itemProps:e,focusedState:a})),role:"button","aria-label":e.label,"aria-pressed":e.selected,onClick:function(t){return m(t,e.index)},onKeyDown:function(t){return y(t,e.index)},tabIndex:e.tabIndex,"aria-disabled":e.disabled,onFocus:function(){s(!0)},onBlur:function(){s(!1)}},f("button"));return t.createElement("div",b,g,!e.disabled&&t.createElement(o.Ripple,null))});m.displayName="SelectButtonItem";var y=t.memo(t.forwardRef(function(e,o){var u=(0,i.useMergeProps)(),c=t.useContext(n.PrimeReactContext),y=f.getProps(e,c),h=d(t.useState(0),2),g=h[0],b=h[1],v=t.useRef(null),S=f.setMetaData({props:y}),x=S.ptm,j=S.cx,w=S.isUnstyled;(0,r.useHandleStyle)(f.css.styles,w,{name:"selectbutton",styled:!0});var O=function(e){if(!(y.disabled||C(e.option))){var t,n=E(e.option);if(!n||y.unselectable&&y.allowEmpty){var r=k(e.option);if(y.multiple){var i=y.value?p(y.value):[];t=n?i.filter(function(e){return!l.ObjectUtils.equals(e,r,y.dataKey)}):[].concat(p(i),[r])}else t=n?null:r;y.onChange&&y.onChange({originalEvent:e.originalEvent,value:t,stopPropagation:function(){e.originalEvent.stopPropagation()},preventDefault:function(){e.originalEvent.preventDefault()},target:{name:y.name,id:y.id,value:t}})}}},k=function(e){return y.optionValue?l.ObjectUtils.resolveFieldData(e,y.optionValue):e&&void 0!==e.value?e.value:e},C=function(e){return y.optionDisabled?l.ObjectUtils.isFunction(y.optionDisabled)?y.optionDisabled(e):l.ObjectUtils.resolveFieldData(e,y.optionDisabled):!!e&&void 0!==e.disabled&&e.disabled},E=function(e){var t=k(e);return y.multiple?!!y.value&&!!y.value.length&&y.value.some(function(e){return l.ObjectUtils.equals(e,t,y.dataKey)}):l.ObjectUtils.equals(y.value,t,y.dataKey)};t.useImperativeHandle(o,function(){return{props:y,focus:function(){return l.DomHandler.focusFirstElement(v.current)},getElement:function(){return v.current}}});var _=l.ObjectUtils.isNotEmpty(y.tooltip),P=y.options&&y.options.length?y.options.map(function(e,n){var r=y.disabled||C(e),i=y.optionLabel?l.ObjectUtils.resolveFieldData(e,y.optionLabel):e&&void 0!==e.label?e.label:e,a=y.disabled||n!==g?"-1":"0",o=E(e);return t.createElement(m,{hostName:"SelectButton",key:i+"_"+n,label:i,className:e.className,option:e,setFocusedIndex:b,onClick:O,template:y.itemTemplate,selected:o,tabIndex:a,index:n,disabled:r,ptm:x,cx:j,elementRef:v})}):null,I=u({ref:v,id:y.id,className:(0,l.classNames)(y.className,j("root")),style:y.style,role:"group"},f.getOtherProps(y),x("root"));return t.createElement(t.Fragment,null,t.createElement("div",I,P,y.children),_&&t.createElement(a.Tooltip,s({target:v,content:y.tooltip,pt:x("tooltip")},y.tooltipOptions)))}));y.displayName="SelectButton",e.s(["SelectButton",0,y])},89269,e=>{"use strict";var t=e.i(71645),n=e.i(48264),r=e.i(43456),i=e.i(29168),a=e.i(83128),l=e.i(40623),o=e.i(73193);function s(){return(s=Object.assign.bind()).apply(null,arguments)}function u(e){return(u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}var c=r.ComponentBase.extend({defaultProps:{__TYPE:"InputTextarea",__parentMetadata:null,autoResize:!1,invalid:!1,variant:null,keyfilter:null,onBlur:null,onFocus:null,onBeforeInput:null,onInput:null,onKeyDown:null,onKeyUp:null,onPaste:null,tooltip:null,tooltipOptions:null,validateOnly:!1,children:void 0,className:null},css:{classes:{root:function(e){var t=e.props,n=e.context,r=e.isFilled;return(0,o.classNames)("p-inputtextarea p-inputtext p-component",{"p-disabled":t.disabled,"p-filled":r,"p-inputtextarea-resizable":t.autoResize,"p-invalid":t.invalid,"p-variant-filled":t.variant?"filled"===t.variant:n&&"filled"===n.inputStyle})}},styles:"\n@layer primereact {\n    .p-inputtextarea-resizable {\n        overflow: hidden;\n        resize: none;\n    }\n    \n    .p-fluid .p-inputtextarea {\n        width: 100%;\n    }\n}\n"}});function p(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function d(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?p(Object(n),!0).forEach(function(t){!function(e,t,n){var r;(r=function(e,t){if("object"!=u(e)||!e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var r=n.call(e,t||"default");if("object"!=u(r))return r;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(t,"string"),(t="symbol"==u(r)?r:r+"")in e)?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n}(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):p(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}var f=t.memo(t.forwardRef(function(e,u){var p=(0,i.useMergeProps)(),f=t.useContext(n.PrimeReactContext),m=c.getProps(e,f),y=t.useRef(u),h=t.useRef(0),g=c.setMetaData(d(d({props:m},m.__parentMetadata),{},{context:{disabled:m.disabled}})),b=g.ptm,v=g.cx,S=g.isUnstyled;(0,r.useHandleStyle)(c.css.styles,S,{name:"inputtextarea"});var x=function(e){var t=y.current;t&&j()&&(h.current||(h.current=t.scrollHeight,t.style.overflow="hidden"),(h.current!==t.scrollHeight||e)&&(t.style.height="",t.style.height=t.scrollHeight+"px",parseFloat(t.style.height)>=parseFloat(t.style.maxHeight)?(t.style.overflowY="scroll",t.style.height=t.style.maxHeight):t.style.overflow="hidden",h.current=t.scrollHeight))},j=function(){if(o.DomHandler.isVisible(y.current)){var e=y.current.getBoundingClientRect();return e.width>0&&e.height>0}return!1};t.useEffect(function(){o.ObjectUtils.combinedRefs(y,u)},[y,u]),t.useEffect(function(){m.autoResize&&x(!0)},[m.autoResize,m.value]);var w=t.useMemo(function(){return o.ObjectUtils.isNotEmpty(m.value)||o.ObjectUtils.isNotEmpty(m.defaultValue)},[m.value,m.defaultValue]),O=o.ObjectUtils.isNotEmpty(m.tooltip),k=p({ref:y,className:(0,o.classNames)(m.className,v("root",{context:f,isFilled:w})),autoComplete:m.autoComplete,onFocus:function(e){m.autoResize&&x(),m.onFocus&&m.onFocus(e)},onBlur:function(e){m.autoResize&&x(),m.onBlur&&m.onBlur(e)},onKeyUp:function(e){m.autoResize&&x(),m.onKeyUp&&m.onKeyUp(e)},onKeyDown:function(e){m.onKeyDown&&m.onKeyDown(e),m.keyfilter&&a.KeyFilter.onKeyPress(e,m.keyfilter,m.validateOnly)},onBeforeInput:function(e){m.onBeforeInput&&m.onBeforeInput(e),m.keyfilter&&a.KeyFilter.onBeforeInput(e,m.keyfilter,m.validateOnly)},onInput:function(e){var t=e.target;m.autoResize&&x(o.ObjectUtils.isEmpty(t.value)),m.onInput&&m.onInput(e),o.ObjectUtils.isNotEmpty(t.value)?o.DomHandler.addClass(t,"p-filled"):o.DomHandler.removeClass(t,"p-filled")},onPaste:function(e){m.onPaste&&m.onPaste(e),m.keyfilter&&a.KeyFilter.onPaste(e,m.keyfilter,m.validateOnly)}},c.getOtherProps(m),b("root"));return t.createElement(t.Fragment,null,t.createElement("textarea",k),O&&t.createElement(l.Tooltip,s({target:y,content:m.tooltip,pt:b("tooltip")},m.tooltipOptions)))}));f.displayName="InputTextarea",e.s(["InputTextarea",0,f])},71326,97778,e=>{"use strict";var t=e.i(71645),n=e.i(48264),r=e.i(1743),i=e.i(43456),a=e.i(71144),l=e.i(29168),o=e.i(28797),s=e.i(27259),u=e.i(73193);function c(){return(c=Object.assign.bind()).apply(null,arguments)}function p(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function d(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"u">typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var r,i,a,l,o=[],s=!0,u=!1;try{if(a=(n=n.call(e)).next,0===t){if(Object(n)!==n)return;s=!1}else for(;!(s=(r=a.call(n)).done)&&(o.push(r.value),o.length!==t);s=!0);}catch(e){u=!0,i=e}finally{try{if(!s&&null!=n.return&&(l=n.return(),Object(l)!==l))return}finally{if(u)throw i}}return o}}(e,t)||function(e,t){if(e){if("string"==typeof e)return p(e,t);var n=({}).toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?p(e,t):void 0}}(e,t)||function(){throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function f(e){return(f="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}var m=i.ComponentBase.extend({defaultProps:{__TYPE:"ConfirmDialog",accept:null,acceptClassName:null,acceptIcon:null,acceptLabel:null,appendTo:null,breakpoints:null,children:void 0,className:null,content:null,defaultFocus:"accept",footer:null,icon:null,message:null,onHide:null,reject:null,rejectClassName:null,rejectIcon:null,rejectLabel:null,tagKey:void 0,visible:void 0},css:{classes:{root:"p-confirm-dialog",message:"p-confirm-dialog-message",icon:"p-confirm-dialog-icon",acceptButton:"p-confirm-dialog-accept",rejectButton:function(e){var t=e.getPropValue;return(0,u.classNames)("p-confirm-dialog-reject",{"p-button-text":!t("rejectClassName")})}}}});function y(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function h(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?y(Object(n),!0).forEach(function(t){!function(e,t,n){var r;(r=function(e,t){if("object"!=f(e)||!e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var r=n.call(e,t||"default");if("object"!=f(r))return r;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(t,"string"),(t="symbol"==f(r)?r:r+"")in e)?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n}(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):y(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}var g=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return(e=h(h({},e),{visible:void 0===e.visible||e.visible})).visible&&o.OverlayService.emit("confirm-dialog",e),{show:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};o.OverlayService.emit("confirm-dialog",h(h(h({},e),t),{visible:!0}))},hide:function(){o.OverlayService.emit("confirm-dialog",{visible:!1})}}},b=t.memo(t.forwardRef(function(e,p){var f,y,g,b,v,S,x,j=(0,l.useMergeProps)(),w=t.useContext(n.PrimeReactContext),O=m.getProps(e,w),k=d(t.useState(O.visible),2),C=k[0],E=k[1],_=d(t.useState(!1),2),P=_[0],I=_[1],N=t.useRef(null),D=t.useRef(!1),A=t.useRef(null),T=function(){var e=O.group;return N.current&&(e=N.current.group),Object.assign({},O,N.current,{group:e})},R=function(e){return T()[e]},F=function(e){for(var t=arguments.length,n=Array(t>1?t-1:0),r=1;r<t;r++)n[r-1]=arguments[r];return u.ObjectUtils.getPropValue(R(e),n)},U=R("acceptLabel")||(0,n.localeOption)("accept"),z=R("rejectLabel")||(0,n.localeOption)("reject"),M={props:O,state:{visible:C}},H=m.setMetaData(M),L=H.ptm,B=H.cx,K=H.isUnstyled;(0,i.useHandleStyle)(m.css.styles,K,{name:"confirmdialog"});var G=function(){D.current||(D.current=!0,F("accept"),q("accept"))},W=function(){D.current||(D.current=!0,F("reject"),q("reject"))},V=function(){T().group===O.group&&(E(!0),D.current=!1,A.current=document.activeElement)},q=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"cancel";C&&("string"!=typeof e&&(e="cancel"),E(!1),F("onHide",e),u.DomHandler.focus(A.current),A.current=null)},$=function(e){if(e.tagKey===O.tagKey&&(void 0===e.group||e.group===O.group)){var t=C!==e.visible;R("target")===e.target||O.target?t&&(N.current=e,e.visible?V():q()):(q(),N.current=e,I(!0))}};t.useEffect(function(){O.visible?V():q()},[O.visible]),t.useEffect(function(){return O.target||O.message||o.OverlayService.on("confirm-dialog",$),function(){o.OverlayService.off("confirm-dialog",$)}},[O.target]),(0,l.useUpdateEffect)(function(){P&&V()},[P]),(0,l.useUnmountEffect)(function(){o.OverlayService.off("confirm-dialog",$)}),t.useImperativeHandle(p,function(){return{props:O,confirm:$}});var J=(f=T(),y=u.ObjectUtils.getJSXElement(R("message"),f),g=j({className:B("icon")},L("icon")),b=u.IconUtils.getJSXIcon(R("icon"),h({},g),{props:f}),v=function(){var e=R("defaultFocus"),n=(0,u.classNames)("p-confirm-dialog-accept",R("acceptClassName")),i=(0,u.classNames)("p-confirm-dialog-reject",{"p-button-text":!R("rejectClassName")},R("rejectClassName")),a=j({label:z,autoFocus:"reject"===e,icon:R("rejectIcon"),className:(0,u.classNames)(R("rejectClassName"),B("rejectButton",{getPropValue:R})),onClick:W,pt:L("rejectButton"),unstyled:O.unstyled,__parentMetadata:{parent:M}},L("rejectButton")),l=j({label:U,autoFocus:void 0===e||"accept"===e,icon:R("acceptIcon"),className:(0,u.classNames)(R("acceptClassName"),B("acceptButton")),onClick:G,pt:L("acceptButton"),unstyled:O.unstyled,__parentMetadata:{parent:M}},L("acceptButton")),o=t.createElement(t.Fragment,null,t.createElement(r.Button,a),t.createElement(r.Button,l));if(R("footer")){var s={accept:G,reject:W,acceptClassName:n,rejectClassName:i,acceptLabel:U,rejectLabel:z,element:o,props:T()};return u.ObjectUtils.getJSXElement(R("footer"),s)}return o}(),S=j({className:B("message")},L("message")),x=j({visible:C,className:(0,u.classNames)(R("className"),B("root")),footer:v,onHide:q,breakpoints:R("breakpoints"),pt:f.pt,unstyled:O.unstyled,appendTo:R("appendTo"),__parentMetadata:{parent:M}},m.getOtherProps(f)),t.createElement(a.Dialog,c({},x,{content:null==e?void 0:e.content}),b,t.createElement("span",S,y)));return t.createElement(s.Portal,{element:J,appendTo:R("appendTo")})}));b.displayName="ConfirmDialog",e.s(["ConfirmDialog",0,b,"confirmDialog",0,g],97778),e.s(["confirmAction",0,function(e,t){return new Promise(n=>{let r=!1,i=e=>{r||(r=!0,n(e))};g({message:e,header:t?.header||"Konfirmasi",icon:t?.danger?"pi pi-exclamation-triangle":"pi pi-question-circle",acceptLabel:t?.acceptLabel||"Ya, lanjutkan",rejectLabel:"Batal",acceptClassName:t?.danger?"p-button-danger":void 0,accept:()=>i(!0),reject:()=>i(!1),onHide:()=>i(!1)})})}],71326)},73474,e=>{"use strict";let t=(0,e.i(56420).default)("trash-2",[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]]);e.s(["Trash2",0,t],73474)},26091,e=>{"use strict";let t=(0,e.i(56420).default)("file-text",[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]);e.s(["FileText",0,t],26091)},64801,e=>{"use strict";let t=(0,e.i(56420).default)("paperclip",[["path",{d:"m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551",key:"1miecu"}]]);e.s(["Paperclip",0,t],64801)},63676,e=>{"use strict";let t=(0,e.i(56420).default)("x",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);e.s(["X",0,t],63676)},35610,e=>{"use strict";let t=(0,e.i(56420).default)("cloud-upload",[["path",{d:"M12 13v8",key:"1l5pq0"}],["path",{d:"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242",key:"1pljnt"}],["path",{d:"m8 17 4-4 4 4",key:"1quai1"}]]);e.s(["UploadCloud",0,t],35610)},84761,e=>{"use strict";var t=e.i(43476),n=e.i(71645),r=e.i(71144),i=e.i(17580),a=e.i(24718),l=e.i(44080),o=e.i(53729),s=e.i(1743),u=e.i(54858);e.s(["default",0,function({visible:e,onHide:c,initialSelected:p,onConfirm:d}){let[f,m]=(0,n.useState)([]),[y,h]=(0,n.useState)(0),[g,b]=(0,n.useState)(!1),[v,S]=(0,n.useState)(1),[x,j]=(0,n.useState)(5),[w,O]=(0,n.useState)(""),[k,C]=(0,n.useState)(""),[E,_]=(0,n.useState)({});(0,n.useEffect)(()=>{if(!e)return;let t={};(p||[]).forEach(e=>{t[e.id]=e}),_(t),O(""),C(""),S(1)},[e,p]);let P=(0,n.useCallback)(async()=>{if(e){b(!0);try{let e=(await u.apiAuth.get("/bdb/laporan-polisi",{params:{search:w,page:v,row:x}})).data;m(e?.data||[]),h(e?.total||0)}catch{m([]),h(0)}finally{b(!1)}}},[e,w,v,x]);(0,n.useEffect)(()=>{P()},[P]),(0,n.useEffect)(()=>{if(!e)return;let t=setTimeout(()=>{S(1),O(k)},400);return()=>clearTimeout(t)},[k,e]);let I=Object.keys(E).length,N=f.filter(e=>E[e.id]),D=(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between"},children:[(0,t.jsxs)("span",{style:{fontSize:"0.85rem",color:"#64748b",fontWeight:600},children:["Dipilih: ",I]}),(0,t.jsxs)("div",{children:[(0,t.jsx)(s.Button,{label:"Batal",text:!0,onClick:c}),(0,t.jsx)(s.Button,{label:"Gunakan Pilihan",icon:"pi pi-check",onClick:function(){d(Object.values(E)),c()}})]})]});return(0,t.jsxs)(r.Dialog,{header:"Pilih Laporan Polisi",visible:e,onHide:c,style:{width:"56rem",maxWidth:"96vw"},footer:D,modal:!0,children:[(0,t.jsx)(l.InputText,{id:"ops-tag-lp-search",name:"search_lp",value:k,onChange:e=>C(e.target.value),placeholder:"Cari nomor LP…",style:{width:"100%",marginBottom:"0.75rem"}}),(0,t.jsxs)(i.DataTable,{value:f,loading:g,lazy:!0,paginator:!0,first:(v-1)*x,rows:x,rowsPerPageOptions:[5,10,25],totalRecords:y,onPage:function(e){S(Math.floor((e.first||0)/(e.rows||x))+1),j(e.rows||x)},selectionMode:"multiple",selection:N,onSelectionChange:function(e){let t=e.value||[];_(e=>{let n={...e};for(let e of f)t.find(t=>t.id===e.id)||delete n[e.id];for(let e of t)n[e.id]=e;return n})},dataKey:"id",size:"small",stripedRows:!0,emptyMessage:"Tidak ada LP ditemukan.",children:[(0,t.jsx)(a.Column,{selectionMode:"multiple",headerStyle:{width:"3rem"}}),(0,t.jsx)(a.Column,{header:"No",body:(e,t)=>(v-1)*x+t.rowIndex+1,style:{width:"3rem"}}),(0,t.jsx)(a.Column,{header:"Nomor LP",body:e=>(0,t.jsxs)("div",{children:[(0,t.jsx)("div",{style:{fontWeight:700},children:e.no_laporan}),(0,t.jsx)("div",{style:{fontSize:"0.72rem",color:"#94a3b8"},children:function(e){if(!e)return"—";let t=String(e).slice(0,10),n=new Date(t);return isNaN(n.getTime())?t:n.toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric"})}(e.tgl_laporan)})]})}),(0,t.jsx)(a.Column,{header:"Kejahatan",body:e=>e.dugaan_tindak_pidana||"—"}),(0,t.jsx)(a.Column,{header:"Satker",body:e=>[e.unit_nama,e.satker_nama].filter(Boolean).join(" ")||"—"}),(0,t.jsx)(a.Column,{header:"Status",body:e=>(0,t.jsx)(o.Tag,{value:e.status_nama||"-"})})]})]})}])},16015,(e,t,n)=>{},98547,(e,t,n)=>{var r=e.i(47167);e.r(16015);var i=e.r(71645),a=i&&"object"==typeof i&&"default"in i?i:{default:i},l=void 0!==r.default&&r.default.env&&!0,o=function(e){return"[object String]"===Object.prototype.toString.call(e)},s=function(){function e(e){var t=void 0===e?{}:e,n=t.name,r=void 0===n?"stylesheet":n,i=t.optimizeForSpeed,a=void 0===i?l:i;u(o(r),"`name` must be a string"),this._name=r,this._deletedRulePlaceholder="#"+r+"-deleted-rule____{}",u("boolean"==typeof a,"`optimizeForSpeed` must be a boolean"),this._optimizeForSpeed=a,this._serverSheet=void 0,this._tags=[],this._injected=!1,this._rulesCount=0;var s="u">typeof window&&document.querySelector('meta[property="csp-nonce"]');this._nonce=s?s.getAttribute("content"):null}var t,n=e.prototype;return n.setOptimizeForSpeed=function(e){u("boolean"==typeof e,"`setOptimizeForSpeed` accepts a boolean"),u(0===this._rulesCount,"optimizeForSpeed cannot be when rules have already been inserted"),this.flush(),this._optimizeForSpeed=e,this.inject()},n.isOptimizeForSpeed=function(){return this._optimizeForSpeed},n.inject=function(){var e=this;if(u(!this._injected,"sheet already injected"),this._injected=!0,"u">typeof window&&this._optimizeForSpeed){this._tags[0]=this.makeStyleTag(this._name),this._optimizeForSpeed="insertRule"in this.getSheet(),this._optimizeForSpeed||(l||console.warn("StyleSheet: optimizeForSpeed mode not supported falling back to standard mode."),this.flush(),this._injected=!0);return}this._serverSheet={cssRules:[],insertRule:function(t,n){return"number"==typeof n?e._serverSheet.cssRules[n]={cssText:t}:e._serverSheet.cssRules.push({cssText:t}),n},deleteRule:function(t){e._serverSheet.cssRules[t]=null}}},n.getSheetForTag=function(e){if(e.sheet)return e.sheet;for(var t=0;t<document.styleSheets.length;t++)if(document.styleSheets[t].ownerNode===e)return document.styleSheets[t]},n.getSheet=function(){return this.getSheetForTag(this._tags[this._tags.length-1])},n.insertRule=function(e,t){if(u(o(e),"`insertRule` accepts only strings"),"u"<typeof window)return"number"!=typeof t&&(t=this._serverSheet.cssRules.length),this._serverSheet.insertRule(e,t),this._rulesCount++;if(this._optimizeForSpeed){var n=this.getSheet();"number"!=typeof t&&(t=n.cssRules.length);try{n.insertRule(e,t)}catch(t){return l||console.warn("StyleSheet: illegal rule: \n\n"+e+"\n\nSee https://stackoverflow.com/q/20007992 for more info"),-1}}else{var r=this._tags[t];this._tags.push(this.makeStyleTag(this._name,e,r))}return this._rulesCount++},n.replaceRule=function(e,t){if(this._optimizeForSpeed||"u"<typeof window){var n="u">typeof window?this.getSheet():this._serverSheet;if(t.trim()||(t=this._deletedRulePlaceholder),!n.cssRules[e])return e;n.deleteRule(e);try{n.insertRule(t,e)}catch(r){l||console.warn("StyleSheet: illegal rule: \n\n"+t+"\n\nSee https://stackoverflow.com/q/20007992 for more info"),n.insertRule(this._deletedRulePlaceholder,e)}}else{var r=this._tags[e];u(r,"old rule at index `"+e+"` not found"),r.textContent=t}return e},n.deleteRule=function(e){if("u"<typeof window)return void this._serverSheet.deleteRule(e);if(this._optimizeForSpeed)this.replaceRule(e,"");else{var t=this._tags[e];u(t,"rule at index `"+e+"` not found"),t.parentNode.removeChild(t),this._tags[e]=null}},n.flush=function(){this._injected=!1,this._rulesCount=0,"u">typeof window?(this._tags.forEach(function(e){return e&&e.parentNode.removeChild(e)}),this._tags=[]):this._serverSheet.cssRules=[]},n.cssRules=function(){var e=this;return"u"<typeof window?this._serverSheet.cssRules:this._tags.reduce(function(t,n){return n?t=t.concat(Array.prototype.map.call(e.getSheetForTag(n).cssRules,function(t){return t.cssText===e._deletedRulePlaceholder?null:t})):t.push(null),t},[])},n.makeStyleTag=function(e,t,n){t&&u(o(t),"makeStyleTag accepts only strings as second parameter");var r=document.createElement("style");this._nonce&&r.setAttribute("nonce",this._nonce),r.type="text/css",r.setAttribute("data-"+e,""),t&&r.appendChild(document.createTextNode(t));var i=document.head||document.getElementsByTagName("head")[0];return n?i.insertBefore(r,n):i.appendChild(r),r},t=[{key:"length",get:function(){return this._rulesCount}}],function(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}(e.prototype,t),e}();function u(e,t){if(!e)throw Error("StyleSheet: "+t+".")}var c=function(e){for(var t=5381,n=e.length;n;)t=33*t^e.charCodeAt(--n);return t>>>0},p={};function d(e,t){if(!t)return"jsx-"+e;var n=String(t),r=e+n;return p[r]||(p[r]="jsx-"+c(e+"-"+n)),p[r]}function f(e,t){"u"<typeof window&&(t=t.replace(/\/style/gi,"\\/style"));var n=e+t;return p[n]||(p[n]=t.replace(/__jsx-style-dynamic-selector/g,e)),p[n]}var m=function(){function e(e){var t=void 0===e?{}:e,n=t.styleSheet,r=void 0===n?null:n,i=t.optimizeForSpeed,a=void 0!==i&&i;this._sheet=r||new s({name:"styled-jsx",optimizeForSpeed:a}),this._sheet.inject(),r&&"boolean"==typeof a&&(this._sheet.setOptimizeForSpeed(a),this._optimizeForSpeed=this._sheet.isOptimizeForSpeed()),this._fromServer=void 0,this._indices={},this._instancesCounts={}}var t=e.prototype;return t.add=function(e){var t=this;void 0===this._optimizeForSpeed&&(this._optimizeForSpeed=Array.isArray(e.children),this._sheet.setOptimizeForSpeed(this._optimizeForSpeed),this._optimizeForSpeed=this._sheet.isOptimizeForSpeed()),"u">typeof window&&!this._fromServer&&(this._fromServer=this.selectFromServer(),this._instancesCounts=Object.keys(this._fromServer).reduce(function(e,t){return e[t]=0,e},{}));var n=this.getIdAndRules(e),r=n.styleId,i=n.rules;if(r in this._instancesCounts){this._instancesCounts[r]+=1;return}var a=i.map(function(e){return t._sheet.insertRule(e)}).filter(function(e){return -1!==e});this._indices[r]=a,this._instancesCounts[r]=1},t.remove=function(e){var t=this,n=this.getIdAndRules(e).styleId;if(function(e,t){if(!e)throw Error("StyleSheetRegistry: "+t+".")}(n in this._instancesCounts,"styleId: `"+n+"` not found"),this._instancesCounts[n]-=1,this._instancesCounts[n]<1){var r=this._fromServer&&this._fromServer[n];r?(r.parentNode.removeChild(r),delete this._fromServer[n]):(this._indices[n].forEach(function(e){return t._sheet.deleteRule(e)}),delete this._indices[n]),delete this._instancesCounts[n]}},t.update=function(e,t){this.add(t),this.remove(e)},t.flush=function(){this._sheet.flush(),this._sheet.inject(),this._fromServer=void 0,this._indices={},this._instancesCounts={}},t.cssRules=function(){var e=this,t=this._fromServer?Object.keys(this._fromServer).map(function(t){return[t,e._fromServer[t]]}):[],n=this._sheet.cssRules();return t.concat(Object.keys(this._indices).map(function(t){return[t,e._indices[t].map(function(e){return n[e].cssText}).join(e._optimizeForSpeed?"":"\n")]}).filter(function(e){return!!e[1]}))},t.styles=function(e){var t,n;return t=this.cssRules(),void 0===(n=e)&&(n={}),t.map(function(e){var t=e[0],r=e[1];return a.default.createElement("style",{id:"__"+t,key:"__"+t,nonce:n.nonce?n.nonce:void 0,dangerouslySetInnerHTML:{__html:r}})})},t.getIdAndRules=function(e){var t=e.children,n=e.dynamic,r=e.id;if(n){var i=d(r,n);return{styleId:i,rules:Array.isArray(t)?t.map(function(e){return f(i,e)}):[f(i,t)]}}return{styleId:d(r),rules:Array.isArray(t)?t:[t]}},t.selectFromServer=function(){return Array.prototype.slice.call(document.querySelectorAll('[id^="__jsx-"]')).reduce(function(e,t){return e[t.id.slice(2)]=t,e},{})},e}(),y=i.createContext(null);function h(){return new m}function g(){return i.useContext(y)}y.displayName="StyleSheetContext";var b=a.default.useInsertionEffect||a.default.useLayoutEffect,v="u">typeof window?h():void 0;function S(e){var t=v||g();return t&&("u"<typeof window?t.add(e):b(function(){return t.add(e),function(){t.remove(e)}},[e.id,String(e.dynamic)])),null}S.dynamic=function(e){return e.map(function(e){return d(e[0],e[1])}).join(" ")},n.StyleRegistry=function(e){var t=e.registry,n=e.children,r=i.useContext(y),l=i.useState(function(){return r||t||h()})[0];return a.default.createElement(y.Provider,{value:l},n)},n.createStyleRegistry=h,n.style=S,n.useStyleRegistry=g},37902,(e,t,n)=>{t.exports=e.r(98547).style},33688,e=>{"use strict";var a=e.i(43476),i=e.i(71645),t=e.i(44080),s=e.i(89269),l=e.i(53729),m=e.i(54858),k=e.i(84761),w=e.i(71326),cd=e.i(97778),ts=e.i(85118);e.s(["default",0,function SusopsgasKelolaUnifiedPage() {
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
      return "OPS_SATGAS";
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
  }],33688)}]);
