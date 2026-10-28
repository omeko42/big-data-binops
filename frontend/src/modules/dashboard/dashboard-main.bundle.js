function toTitleCase(str) {
  if (!str) return '';
  return String(str)
    .toLowerCase()
    .replace(/(?:^|\s|-|\/)[a-z]/g, function(c) {
      return c.toUpperCase();
    })
    .replace(/\bPolri\b/gi, 'Polri')
    .replace(/\bPolda\b/gi, 'Polda')
    .replace(/\bPolres\b/gi, 'Polres')
    .replace(/\bPolsek\b/gi, 'Polsek')
    .replace(/\bDitreskrimum\b/gi, 'Ditreskrimum')
    .replace(/\bDitreskrimsus\b/gi, 'Ditreskrimsus')
    .replace(/\bDitresnarkoba\b/gi, 'Ditresnarkoba')
    .replace(/\bSatreskrim\b/gi, 'Satreskrim')
    .replace(/\bSatresnarkoba\b/gi, 'Satresnarkoba')
    .replace(/\bBareskrim\b/gi, 'Bareskrim')
    .replace(/\bRobinopsnal\b/gi, 'Robinopsnal');
}
function abbrSatkerName(raw, stripPoldaPrefix) {
  if (!raw) return '';
  let s = String(raw).trim().toUpperCase().replace(/\s+/g, ' ');
  if (stripPoldaPrefix) s = s.replace(/^POLDA\s+/i, '');
  const poldaMap = [
    [/\bNANGGROE ACEH DARUSSALAM\b/g, 'ACEH'],
    [/\bDAERAH ISTIMEWA YOGYAKARTA\b/g, 'DIY'],
    [/\bD\.?\s*I\.?\s*YOGYAKARTA\b/g, 'DIY'],
    [/\bKEPULAUAN BANGKA BELITUNG\b/g, 'BABEL'],
    [/\bBANGKA BELITUNG\b/g, 'BABEL'],
    [/\bKEPULAUAN RIAU\b/g, 'KEPRI'],
    [/\bSUMATERA UTARA\b/g, 'SUMUT'],
    [/\bSUMATERA BARAT\b/g, 'SUMBAR'],
    [/\bSUMATERA SELATAN\b/g, 'SUMSEL'],
    [/\bDKI JAKARTA\b/g, 'PMJ'],
    [/\bMETRO JAYA\b/g, 'PMJ'],
    [/\bJAWA BARAT\b/g, 'JABAR'],
    [/\bJAWA TENGAH\b/g, 'JATENG'],
    [/\bJAWA TIMUR\b/g, 'JATIM'],
    [/\bNUSA TENGGARA BARAT\b/g, 'NTB'],
    [/\bNUSA TENGGARA TIMUR\b/g, 'NTT'],
    [/\bKALIMANTAN BARAT\b/g, 'KALBAR'],
    [/\bKALIMANTAN TENGAH\b/g, 'KALTENG'],
    [/\bKALIMANTAN SELATAN\b/g, 'KALSEL'],
    [/\bKALIMANTAN TIMUR\b/g, 'KALTIM'],
    [/\bKALIMANTAN UTARA\b/g, 'KALTARA'],
    [/\bSULAWESI UTARA\b/g, 'SULUT'],
    [/\bSULAWESI TENGAH\b/g, 'SULTENG'],
    [/\bSULAWESI SELATAN\b/g, 'SULSEL'],
    [/\bSULAWESI TENGGARA\b/g, 'SULTRA'],
    [/\bSULAWESI BARAT\b/g, 'SULBAR'],
    [/\bMALUKU UTARA\b/g, 'MALUT'],
    [/\bPAPUA BARAT DAYA\b/g, 'PABD'],
    [/\bPAPUA BARAT\b/g, 'PABAR'],
    [/\bPAPUA TENGAH\b/g, 'PATENG'],
    [/\bPAPUA PEGUNUNGAN\b/g, 'PAPEG'],
    [/\bPAPUA SELATAN\b/g, 'PASEL']
  ];
  for (const [re, rep] of poldaMap) s = s.replace(re, rep);
  const unitMap = [
    [/\bPOLRESTABES\b/g, 'RESTABES'],
    [/\bPOLRESTA\b/g, 'RESTA'],
    [/\bPOLRES METRO\b/g, 'RES METRO'],
    [/\bPOLRES\b/g, 'RES'],
    [/\bPOLSEKTA\b/g, 'SEKTA'],
    [/\bPOLSEK\b/g, 'SEK'],
    [/\bDIT\s*RESKRIMUM\b/g, 'KRIMUM'],
    [/\bDIT\s*KRIMUM\b/g, 'KRIMUM'],
    [/\bDIT\s*RESKRIMSUS\b/g, 'KRIMSUS'],
    [/\bDIT\s*KRIMSUS\b/g, 'KRIMSUS'],
    [/\bDIT\s*RESNARKOBA\b/g, 'NARKOBA'],
    [/\bDIT\s*NARKOBA\b/g, 'NARKOBA'],
    [/\bDIT\s*RESSIBER\b/g, 'SIBER'],
    [/\bDIT\s*SIBER\b/g, 'SIBER'],
    [/\bDITRES\s*PPA\s*DAN\s*PPO\b/g, 'PPA-PPO'],
    [/\bDITPPA\s*PPO\b/g, 'PPA-PPO'],
    [/\bDITPIDEKSUS\b/g, 'PIDEKSUS'],
    [/\bDITPIDUM\b/g, 'PIDUM'],
    [/\bDITPIDKOR\b/g, 'PIDKOR'],
    [/\bDITPIDNARKOBA\b/g, 'PIDNARKOBA'],
    [/\bDITPIDTER\b/g, 'PIDTER'],
    [/\bDITPIDSIBER\b/g, 'PIDSIBER'],
    [/\bSAT\s*RESKRIM\b/g, 'SATRESKRIM'],
    [/\bSAT\s*RESNARKOBA\b/g, 'SATNARKOBA']
  ];
  for (const [re, rep] of unitMap) s = s.replace(re, rep);
  return s;
}
if (typeof window !== 'undefined') window.__casAbbrSatker = abbrSatkerName;
function getPihakVariant(k){if(k==="DPO")return"danger-bold";if(k==="Tersangka")return"danger";if(k==="Terlapor")return"warning";if(k==="Pelapor")return"success";if(k==="Saksi")return"purple";if(k==="Korban")return"cyan";return"danger"};function getPihakTag(e,f){let k=String((f&&f!=="ALL")?f:(e.kasta||e.keterlibatan||"")).toUpperCase();if(k==="DPO")return"DPO";if(k==="TERSANGKA")return"Tersangka";if(k==="TERLAPOR")return"Terlapor";if(k==="PELAPOR")return"Pelapor";if(k==="SAKSI")return"Saksi";if(k==="KORBAN")return"Korban";if(e.count_dpo>0)return"DPO";if(e.count_tersangka>0)return"Tersangka";if(e.count_terlapor>0)return"Terlapor";if(e.count_pelapor>0)return"Pelapor";if(e.count_saksi>0)return"Saksi";if(e.count_korban>0)return"Korban";return"Pihak"}function getPihakSev(k){return("DPO"===k||"Tersangka"===k)?"danger":("Terlapor"===k?"warning":("Korban"===k?"info":("Pelapor"===k?"success":"info")))};(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,62004,1311,e=>{"use strict";var t=e.i(71645),a=e.i(44506);function r(){return(r=Object.assign.bind()).apply(null,arguments)}var n=t.memo(t.forwardRef(function(e,n){var l=a.IconBase.getPTI(e);return t.createElement("svg",r({ref:n,width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",xmlns:"http://www.w3.org/2000/svg"},l),t.createElement("path",{d:"M7.01744 10.398C6.91269 10.3985 6.8089 10.378 6.71215 10.3379C6.61541 10.2977 6.52766 10.2386 6.45405 10.1641L1.13907 4.84913C1.03306 4.69404 0.985221 4.5065 1.00399 4.31958C1.02276 4.13266 1.10693 3.95838 1.24166 3.82747C1.37639 3.69655 1.55301 3.61742 1.74039 3.60402C1.92777 3.59062 2.11386 3.64382 2.26584 3.75424L7.01744 8.47394L11.769 3.75424C11.9189 3.65709 12.097 3.61306 12.2748 3.62921C12.4527 3.64535 12.6199 3.72073 12.7498 3.84328C12.8797 3.96582 12.9647 4.12842 12.9912 4.30502C13.0177 4.48162 12.9841 4.662 12.8958 4.81724L7.58083 10.1322C7.50996 10.2125 7.42344 10.2775 7.32656 10.3232C7.22968 10.3689 7.12449 10.3944 7.01744 10.398Z",fill:"currentColor"}))}));n.displayName="ChevronDownIcon",e.s(["ChevronDownIcon",0,n],62004);var l=e.i(48264),s=e.i(29168),i=e.i(78954),o=e.i(73193);function c(){return(c=Object.assign.bind()).apply(null,arguments)}function u(e){return(u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function d(e,t,a){var r;return(r=function(e,t){if("object"!=u(e)||!e)return e;var a=e[Symbol.toPrimitive];if(void 0!==a){var r=a.call(e,t||"default");if("object"!=u(r))return r;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(t,"string"),(t="symbol"==u(r)?r:r+"")in e)?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function m(e,t){(null==t||t>e.length)&&(t=e.length);for(var a=0,r=Array(t);a<t;a++)r[a]=e[a];return r}function p(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var a=null==e?null:"u">typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=a){var r,n,l,s,i=[],o=!0,c=!1;try{if(l=(a=a.call(e)).next,0===t){if(Object(a)!==a)return;o=!1}else for(;!(o=(r=l.call(a)).done)&&(i.push(r.value),i.length!==t);o=!0);}catch(e){c=!0,n=e}finally{try{if(!o&&null!=a.return&&(s=a.return(),Object(s)!==s))return}finally{if(c)throw n}}return i}}(e,t)||function(e,t){if(e){if("string"==typeof e)return m(e,t);var a=({}).toString.call(e).slice(8,-1);return"Object"===a&&e.constructor&&(a=e.constructor.name),"Map"===a||"Set"===a?Array.from(e):"Arguments"===a||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a)?m(e,t):void 0}}(e,t)||function(){throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var h=e.i(43456).ComponentBase.extend({defaultProps:{__TYPE:"VirtualScroller",__parentMetadata:null,id:null,style:null,className:null,tabIndex:0,items:null,itemSize:0,scrollHeight:null,scrollWidth:null,orientation:"vertical",step:0,numToleratedItems:null,delay:0,resizeDelay:10,appendOnly:!1,inline:!1,lazy:!1,disabled:!1,loaderDisabled:!1,loadingIcon:null,columns:null,loading:void 0,autoSize:!1,showSpacer:!0,showLoader:!1,loadingTemplate:null,loaderIconTemplate:null,itemTemplate:null,contentTemplate:null,onScroll:null,onScrollIndexChange:null,onLazyLoad:null,children:void 0},css:{styles:"\n.p-virtualscroller {\n    position: relative;\n    overflow: auto;\n    contain: strict;\n    transform: translateZ(0);\n    will-change: scroll-position;\n    outline: 0 none;\n}\n\n.p-virtualscroller-content {\n    position: absolute;\n    top: 0;\n    left: 0;\n    /*contain: content;*/\n    min-height: 100%;\n    min-width: 100%;\n    will-change: transform;\n}\n\n.p-virtualscroller-spacer {\n    position: absolute;\n    top: 0;\n    left: 0;\n    height: 1px;\n    width: 1px;\n    transform-origin: 0 0;\n    pointer-events: none;\n}\n\n.p-virtualscroller-loader {\n    position: sticky;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n}\n\n.p-virtualscroller-loader.p-component-overlay {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n}\n\n.p-virtualscroller-loading-icon {\n    font-size: 2rem;\n}\n\n.p-virtualscroller-horizontal > .p-virtualscroller-content {\n    display: flex;\n}\n\n/* Inline */\n.p-virtualscroller-inline .p-virtualscroller-content {\n    position: static;\n}\n"}});function f(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),a.push.apply(a,r)}return a}function g(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?f(Object(a),!0).forEach(function(t){d(e,t,a[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):f(Object(a)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))})}return e}var v=t.memo(t.forwardRef(function(e,a){var r=(0,s.useMergeProps)(),n=t.useContext(l.PrimeReactContext),u=h.getProps(e,n),m=(0,s.usePrevious)(e)||{},f="vertical"===u.orientation,v="horizontal"===u.orientation,y="both"===u.orientation,b=p(t.useState(y?{rows:0,cols:0}:0),2),j=b[0],x=b[1],k=p(t.useState(y?{rows:0,cols:0}:0),2),w=k[0],S=k[1],C=p(t.useState(0),2),N=C[0],_=C[1],T=p(t.useState(y?{rows:0,cols:0}:0),2),P=T[0],I=T[1],R=p(t.useState(u.numToleratedItems),2),z=R[0],O=R[1],D=p(t.useState(u.loading||!1),2),A=D[0],E=D[1],L=p(t.useState([]),2),M=L[0],W=L[1],B=h.setMetaData({props:u,state:{first:j,last:w,page:N,numItemsInViewport:P,numToleratedItems:z,loading:A,loaderArr:M}}).ptm;(0,s.useStyle)(h.css.styles,{name:"virtualscroller"});var H=t.useRef(null),$=t.useRef(null),U=t.useRef(null),F=t.useRef(null),K=t.useRef(y?{top:0,left:0}:0),J=t.useRef(null),V=t.useRef(null),Y=t.useRef({}),X=t.useRef({}),q=t.useRef(null),G=t.useRef(null),Z=t.useRef(null),Q=t.useRef(null),ee=t.useRef(!1),et=t.useRef(null),ea=t.useRef(!1),er=p((0,s.useResizeListener)({listener:function(e){return eS()},when:!u.disabled}),1)[0],en=p((0,s.useEventListener)({target:"window",type:"orientationchange",listener:function(e){return eS()},when:!u.disabled}),1)[0],el=function(){return H},es=function(e){return Math.floor((e+4*z)/(u.step||1))},ei=function(e){$.current=e||$.current||o.DomHandler.findSingle(H.current,".p-virtualscroller-content")},eo=function(e){return!u.step||N!==es(e)},ec=function(e){K.current=y?{top:0,left:0}:0,H.current&&H.current.scrollTo(e)},eu=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"auto",a=ep().numToleratedItems,r=ev(),n=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,t=arguments.length>1?arguments[1]:void 0;return e<=t?0:e},l=function(e,t,a){return e*t+a},s=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return ec({left:e,top:a,behavior:t})},i=y?{rows:0,cols:0}:0,o=!1;y?(s(l((i={rows:n(e[0],a[0]),cols:n(e[1],a[1])}).cols,u.itemSize[1],r.left),l(i.rows,u.itemSize[0],r.top)),o=j.rows!==i.rows||j.cols!==i.cols):(i=n(e,a),v?s(l(i,u.itemSize,r.left),0):s(0,l(i,u.itemSize,r.top)),o=j!==i),ee.current=o,x(i)},ed=function(e,t){var a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"auto";if(t){var r=em(),n=r.first,l=r.viewport,s=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return ec({left:e,top:t,behavior:a})};if("to-start"===t){if(y)l.first.rows-n.rows>e[0]?s(l.first.cols*u.itemSize[1],(l.first.rows-1)*u.itemSize[0]):l.first.cols-n.cols>e[1]&&s((l.first.cols-1)*u.itemSize[1],l.first.rows*u.itemSize[0]);else if(l.first-n>e){var i=(l.first-1)*u.itemSize;v?s(i,0):s(0,i)}}else if("to-end"===t){if(y)l.last.rows-n.rows<=e[0]+1?s(l.first.cols*u.itemSize[1],(l.first.rows+1)*u.itemSize[0]):l.last.cols-n.cols<=e[1]+1&&s((l.first.cols+1)*u.itemSize[1],l.first.rows*u.itemSize[0]);else if(l.last-n<=e+1){var o=(l.first+1)*u.itemSize;v?s(o,0):s(0,o)}}}else eu(e,a)},em=function(){var e=function(e,t){return Math.floor(e/(t||e))},t=j,a=0;if(H.current){var r=H.current,n=r.scrollTop,l=r.scrollLeft;a=y?{rows:(t={rows:e(n,u.itemSize[0]),cols:e(l,u.itemSize[1])}).rows+P.rows,cols:t.cols+P.cols}:(t=e(v?l:n,u.itemSize))+P}return{first:j,last:w,viewport:{first:t,last:a}}},ep=function(){var e=ev(),t=H.current?H.current.offsetWidth-e.left:0,a=H.current?H.current.offsetHeight-e.top:0,r=function(e,t){return Math.ceil(e/(t||e))},n=function(e){return Math.ceil(e/2)},l=y?{rows:r(a,u.itemSize[0]),cols:r(t,u.itemSize[1])}:r(v?t:a,u.itemSize),s=z||(y?[n(l.rows),n(l.cols)]:n(l));return{numItemsInViewport:l,numToleratedItems:s}},eh=function(){var e=ep(),t=e.numItemsInViewport,a=e.numToleratedItems,r=function(e,t,a){var r=arguments.length>3&&void 0!==arguments[3]&&arguments[3];return eg(e+t+(e<a?2:3)*a,r)},n=y?{rows:r(j.rows,t.rows,a[0]),cols:r(j.cols,t.cols,a[1],!0)}:r(j,t,a);I(t),O(a),S(n),u.showLoader&&W(y?Array.from({length:t.rows}).map(function(){return Array.from({length:t.cols})}):Array.from({length:t})),u.lazy&&Promise.resolve().then(function(){et.current={first:u.step?y?{rows:0,cols:j.cols}:0:j,last:Math.min(u.step?u.step:n,(u.items||[]).length)},u.onLazyLoad&&u.onLazyLoad(et.current)})},ef=function(e){u.autoSize&&!e&&Promise.resolve().then(function(){if($.current){$.current.style.minHeight=$.current.style.minWidth="auto",$.current.style.position="relative",H.current.style.contain="none";var e=[o.DomHandler.getWidth(H.current),o.DomHandler.getHeight(H.current)],t=e[0],a=e[1];(y||v)&&(H.current.style.width=(t<q.current?t:u.scrollWidth||q.current)+"px"),(y||f)&&(H.current.style.height=(a<G.current?a:u.scrollHeight||G.current)+"px"),$.current.style.minHeight=$.current.style.minWidth="",$.current.style.position="",H.current.style.contain=""}})},eg=function(){var e,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,a=arguments.length>1?arguments[1]:void 0;return u.items?Math.min(a?(null==(e=u.columns||u.items[0])?void 0:e.length)||0:(u.items||[]).length,t):0},ev=function(){if($.current){var e=getComputedStyle($.current),t=parseFloat(e.paddingLeft)+Math.max(parseFloat(e.left)||0,0),a=parseFloat(e.paddingRight)+Math.max(parseFloat(e.right)||0,0),r=parseFloat(e.paddingTop)+Math.max(parseFloat(e.top)||0,0),n=parseFloat(e.paddingBottom)+Math.max(parseFloat(e.bottom)||0,0);return{left:t,right:a,top:r,bottom:n,x:t+a,y:r+n}}return{left:0,right:0,top:0,bottom:0,x:0,y:0}},ey=function(){if(H.current){var e=H.current.parentElement,t=u.scrollWidth||"".concat(H.current.offsetWidth||e.offsetWidth,"px"),a=u.scrollHeight||"".concat(H.current.offsetHeight||e.offsetHeight,"px"),r=function(e,t){return H.current.style[e]=t};y||v?(r("height",a),r("width",t)):r("height",a)}},eb=function(){var e=u.items;if(e){var t=ev(),a=function(e,t,a){var r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0;return X.current=g(g({},X.current),d({},"".concat(e),(t||[]).length*a+r+"px"))};y?(a("height",e,u.itemSize[0],t.y),a("width",u.columns||e[1],u.itemSize[1],t.x)):v?a("width",u.columns||e,u.itemSize,t.x):a("height",e,u.itemSize,t.y)}},ej=function(e){if($.current&&!u.appendOnly){var t=e?e.first:j,a=function(e,t){return e*t},r=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;F.current&&(F.current.style.top="-".concat(t,"px")),Y.current=g(g({},Y.current),{transform:"translate3d(".concat(e,"px, ").concat(t,"px, 0)")})};if(y)r(a(t.cols,u.itemSize[1]),a(t.rows,u.itemSize[0]));else{var n=a(t,u.itemSize);v?r(n,0):r(0,n)}}},ex=function(e){var t=e.target,a=ev(),r=function(e,t){return e?e>t?e-t:e:0},n=function(e,t){return Math.floor(e/(t||e))},l=function(e,t,a,r,n,l){return e<=n?n:l?a-r-n:t+n-1},s=function(e,t,a,r,n,l,s){return e<=l?0:Math.max(0,s?e<t?a:e-l:e>t?a:e-2*l)},i=function(e,t,a,r,n,l){var s=t+r+2*n;return e>=n&&(s+=n+1),eg(s,l)},o=r(t.scrollTop,a.top),c=r(t.scrollLeft,a.left),d=y?{rows:0,cols:0}:0,m=w,p=!1,h=K.current;if(y){var f=K.current.top<=o,g=K.current.left<=c;if(!u.appendOnly||u.appendOnly&&(f||g)){var b={rows:n(o,u.itemSize[0]),cols:n(c,u.itemSize[1])},x={rows:l(b.rows,j.rows,w.rows,P.rows,z[0],f),cols:l(b.cols,j.cols,w.cols,P.cols,z[1],g)};d={rows:s(b.rows,x.rows,j.rows,w.rows,P.rows,z[0],f),cols:s(b.cols,x.cols,j.cols,w.cols,P.cols,z[1],g)},m={rows:i(b.rows,d.rows,w.rows,P.rows,z[0]),cols:i(b.cols,d.cols,w.cols,P.cols,z[1],!0)},p=d.rows!==j.rows||m.rows!==w.rows||d.cols!==j.cols||m.cols!==w.cols||ee.current,h={top:o,left:c}}}else{var k=v?c:o,S=K.current<=k;if(!u.appendOnly||u.appendOnly&&S){var C=n(k,u.itemSize),N=l(C,j,w,P,z,S);d=s(C,N,j,w,P,z,S),m=i(C,d,w,P,z),p=d!==j||m!==w||ee.current,h=k}}return{first:d,last:m,isRangeChanged:p,scrollPos:h}},ek=function(e){var t=ex(e),a=t.first,r=t.last,n=t.isRangeChanged,l=t.scrollPos;if(n){var s={first:a,last:r};if(ej(s),x(a),S(r),K.current=l,u.onScrollIndexChange&&u.onScrollIndexChange(s),u.lazy&&eo(a)){var i={first:u.step?Math.min(es(a)*u.step,(u.items||[]).length-u.step):a,last:Math.min(u.step?(es(a)+1)*u.step:r,(u.items||[]).length)};(!et.current||et.current.first!==i.first||et.current.last!==i.last)&&u.onLazyLoad&&u.onLazyLoad(i),et.current=i}}},ew=function(e){u.onScroll&&u.onScroll(e),u.delay?(J.current&&clearTimeout(J.current),eo(j)&&(!A&&u.showLoader&&(ex(e).isRangeChanged||u.step&&eo(j))&&E(!0),J.current=setTimeout(function(){ek(e),A&&u.showLoader&&(!u.lazy||void 0===u.loading)&&(E(!1),_(es(j)))},u.delay))):ek(e)},eS=function(){V.current&&clearTimeout(V.current),V.current=setTimeout(function(){if(H.current){var e=[o.DomHandler.getWidth(H.current),o.DomHandler.getHeight(H.current)],t=e[0],a=e[1],r=t!==q.current,n=a!==G.current;(y?r||n:v?r:!!f&&n)&&(O(u.numToleratedItems),q.current=t,G.current=a,Z.current=o.DomHandler.getWidth($.current),Q.current=o.DomHandler.getHeight($.current))}},u.resizeDelay)},eC=function(e){var t=(u.items||[]).length,a=y?j.rows+e:j+e;return{index:a,count:t,first:0===a,last:a===t-1,even:a%2==0,odd:a%2!=0,props:u}},eN=function(e,t){var a=M.length||0;return g({index:e,count:a,first:0===e,last:e===a-1,even:e%2==0,odd:e%2!=0,props:u},t)},e_=function(){var e=u.items;return e&&!A?y?e.slice(u.appendOnly?0:j.rows,w.rows).map(function(e){return u.columns?e:e.slice(u.appendOnly?0:j.cols,w.cols)}):v&&u.columns?e:e.slice(u.appendOnly?0:j,w):[]},eT=function(){H.current&&eI()&&(ei($.current),eP(),er(),en(),q.current=o.DomHandler.getWidth(H.current),G.current=o.DomHandler.getHeight(H.current),Z.current=o.DomHandler.getWidth($.current),Q.current=o.DomHandler.getHeight($.current))},eP=function(){!u.disabled&&eI()&&(ey(),eh(),eb())},eI=function(){if(o.DomHandler.isVisible(H.current)){var e=H.current.getBoundingClientRect();return e.width>0&&e.height>0}return!1};t.useEffect(function(){!ea.current&&eI()&&(eT(),ea.current=!0)}),(0,s.useUpdateEffect)(function(){eP()},[u.itemSize,u.scrollHeight,u.scrollWidth]),(0,s.useUpdateEffect)(function(){u.numToleratedItems!==z&&O(u.numToleratedItems)},[u.numToleratedItems]),(0,s.useUpdateEffect)(function(){u.numToleratedItems===z&&eP()},[z]),(0,s.useUpdateEffect)(function(){var e=void 0!==m.items&&null!==m.items,t=void 0!==u.items&&null!==u.items,a=(e?m.items.length:0)!==(t?u.items.length:0);y&&!a&&(a=(e&&m.items.length>0?m.items[0].length:0)!==(t&&u.items.length>0?u.items[0].length:0)),(!e||a)&&eP();var r=A;u.lazy&&m.loading!==u.loading&&u.loading!==A&&(E(u.loading),r=u.loading),ef(r)}),(0,s.useUpdateEffect)(function(){K.current=y?{top:0,left:0}:0},[u.orientation]),t.useImperativeHandle(a,function(){return{props:u,getElementRef:el,scrollTo:ec,scrollToIndex:eu,scrollInView:ed,getRenderedRange:em}});var eR=function(e){var a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=eN(e,a),n=o.ObjectUtils.getJSXElement(u.loadingTemplate,r);return t.createElement(t.Fragment,{key:e},n)},ez=function(e,a){var r=eC(a),n=o.ObjectUtils.getJSXElement(u.itemTemplate,e,r);return t.createElement(t.Fragment,{key:r.index},n)};if(u.disabled){var eO=o.ObjectUtils.getJSXElement(u.contentTemplate,{items:u.items,rows:u.items,columns:u.columns});return t.createElement(t.Fragment,null,u.children,eO)}var eD=(0,o.classNames)("p-virtualscroller",{"p-virtualscroller-inline":u.inline,"p-virtualscroller-both p-both-scroll":y,"p-virtualscroller-horizontal p-horizontal-scroll":v},u.className),eA=function(){var e="p-virtualscroller-loading-icon",a=r({className:e},B("loadingIcon")),n=u.loadingIcon||t.createElement(i.SpinnerIcon,c({},a,{spin:!0})),l=o.IconUtils.getJSXIcon(n,g({},a),{props:u});if(!u.loaderDisabled&&u.showLoader&&A){var s=(0,o.classNames)("p-virtualscroller-loader",{"p-component-overlay":!u.loadingTemplate}),d=l;if(u.loadingTemplate)d=M.map(function(e,t){return eR(t,y&&{numCols:P.cols})});else if(u.loaderIconTemplate){var m={iconClassName:e,element:d,props:u};d=o.ObjectUtils.getJSXElement(u.loaderIconTemplate,m)}var p=r({className:s},B("loader"));return t.createElement("div",p,d)}return null}(),eE=function(){var e=e_().map(ez),a=(0,o.classNames)("p-virtualscroller-content",{"p-virtualscroller-loading":A}),n=r({ref:$,style:Y.current,className:a},B("content")),l=t.createElement("div",n,e);if(u.contentTemplate){var s={style:Y.current,className:a,spacerStyle:X.current,contentRef:function(e){return $.current=o.ObjectUtils.getRefElement(e)},spacerRef:function(e){return U.current=o.ObjectUtils.getRefElement(e)},stickyRef:function(e){return F.current=o.ObjectUtils.getRefElement(e)},items:e_(),getItemOptions:function(e){return eC(e)},children:e,element:l,props:u,loading:A,getLoaderOptions:function(e,t){return eN(e,t)},loadingTemplate:u.loadingTemplate,itemSize:u.itemSize,rows:A?u.loaderDisabled?M:[]:e_(),columns:u.columns&&y||v?A&&u.loaderDisabled?y?M[0]:M:u.columns.slice(y?j.cols:j,y?w.cols:w):u.columns,vertical:f,horizontal:v,both:y};return o.ObjectUtils.getJSXElement(u.contentTemplate,s)}return l}(),eL=function(){if(u.showSpacer){var e=r({ref:U,style:X.current,className:"p-virtualscroller-spacer"},B("spacer"));return t.createElement("div",e)}return null}(),eM=r({ref:H,className:eD,tabIndex:u.tabIndex,style:u.style,onScroll:function(e){return ew(e)}},h.getOtherProps(u),B("root"));return t.createElement("div",eM,eE,eL,eA)}));v.displayName="VirtualScroller",e.s(["VirtualScroller",0,v],1311)},53729,e=>{"use strict";var t=e.i(71645),a=e.i(48264),r=e.i(43456),n=e.i(29168),l=e.i(73193);function s(e){return(s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function i(e,t,a){var r;return(r=function(e,t){if("object"!=s(e)||!e)return e;var a=e[Symbol.toPrimitive];if(void 0!==a){var r=a.call(e,t||"default");if("object"!=s(r))return r;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(t,"string"),(t="symbol"==s(r)?r:r+"")in e)?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}var o=r.ComponentBase.extend({defaultProps:{__TYPE:"Tag",value:null,severity:null,rounded:!1,icon:null,style:null,className:null,children:void 0},css:{classes:{value:"p-tag-value",icon:"p-tag-icon",root:function(e){var t=e.props;return(0,l.classNames)("p-tag p-component",i(i({},"p-tag-".concat(t.severity),null!==t.severity),"p-tag-rounded",t.rounded))}},styles:"\n@layer primereact {\n    .p-tag {\n        display: inline-flex;\n        align-items: center;\n        justify-content: center;\n    }\n    \n    .p-tag-icon,\n    .p-tag-value,\n    .p-tag-icon.pi {\n        line-height: 1.5;\n    }\n    \n    .p-tag.p-tag-rounded {\n        border-radius: 10rem;\n    }\n}\n"}});function c(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),a.push.apply(a,r)}return a}var u=t.forwardRef(function(e,s){var u=(0,n.useMergeProps)(),d=t.useContext(a.PrimeReactContext),m=o.getProps(e,d),p=o.setMetaData({props:m}),h=p.ptm,f=p.cx,g=p.isUnstyled;(0,r.useHandleStyle)(o.css.styles,g,{name:"tag"});var v=t.useRef(null),y=u({className:f("icon")},h("icon")),b=l.IconUtils.getJSXIcon(m.icon,function(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?c(Object(a),!0).forEach(function(t){i(e,t,a[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):c(Object(a)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))})}return e}({},y),{props:m});t.useImperativeHandle(s,function(){return{props:m,getElement:function(){return v.current}}});var j=u({ref:v,className:(0,l.classNames)(m.className,f("root")),style:m.style},o.getOtherProps(m),h("root")),x=u({className:f("value")},h("value"));return t.createElement("span",j,b,t.createElement("span",x,m.value),t.createElement("span",null,m.children))});u.displayName="Tag",e.s(["Tag",0,u])},72382,e=>{"use strict";let t=(0,e.i(56420).default)("eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);e.s(["Eye",0,t],72382)},53138,e=>{"use strict";let t=(0,e.i(56420).default)("triangle-alert",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);e.s(["AlertTriangle",0,t],53138)},73225,e=>{"use strict";let t=(0,e.i(56420).default)("file-search",[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["circle",{cx:"11.5",cy:"14.5",r:"2.5",key:"1bq0ko"}],["path",{d:"M13.3 16.3 15 18",key:"2quom7"}]]);e.s(["FileSearch",0,t],73225)},66595,e=>{"use strict";let t=(0,e.i(56420).default)("search",[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]]);e.s(["Search",0,t],66595)},29768,e=>{"use strict";let t=(0,e.i(56420).default)("calendar-days",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}],["path",{d:"M8 14h.01",key:"6423bh"}],["path",{d:"M12 14h.01",key:"1etili"}],["path",{d:"M16 14h.01",key:"1gbofw"}],["path",{d:"M8 18h.01",key:"lrp35t"}],["path",{d:"M12 18h.01",key:"mhygvu"}],["path",{d:"M16 18h.01",key:"kzsmim"}]]);e.s(["CalendarDays",0,t],29768)},74660,e=>{"use strict";var t=e.i(43476),a=e.i(9573);e.s(["default",0,function({refreshing:e,updatedAt:r,onRefresh:n}){return(0,t.jsxs)("div",{className:"dash-refresh",children:[(0,t.jsxs)("span",{className:"dash-refresh-time",children:[(0,t.jsx)("span",{className:`dash-dot${e?" live":""}`}),"Diperbarui ",(0,a.fmtUpdated)(r)]}),(0,t.jsxs)("button",{type:"button",className:"dash-refresh-btn",onClick:n,disabled:e,title:"Perbarui data sekarang",children:[(0,t.jsx)("i",{className:`pi pi-refresh${e?" pi-spin":""}`})," ",e?"Memuat…":"Refresh"]})]})}])},87278,e=>{"use strict";var t=e.i(43476),a=e.i(71645),r=e.i(48264),n=e.i(43456),l=e.i(29168),s=e.i(73193),i=n.ComponentBase.extend({defaultProps:{__TYPE:"Chart",id:null,type:null,data:null,options:null,plugins:null,width:null,height:null,style:null,className:null,children:void 0},css:{classes:{root:"p-chart"},inlineStyles:{root:function(e){var t=e.props;return Object.assign({width:t.width,height:t.height},t.style)}},styles:"\n        @layer primereact {\n            .p-chart {\n                position: relative\n            }\n        }\n        "}}),o=function(){try{return Chart}catch(e){return null}}(),c=a.memo(a.forwardRef(function(t,c){var u=(0,l.useMergeProps)(),d=a.useContext(r.PrimeReactContext),m=i.getProps(t,d),p=i.setMetaData({props:m}),h=p.ptm,f=p.cx,g=p.sx,v=p.isUnstyled;(0,n.useHandleStyle)(i.css.styles,v,{name:"chart"});var y=a.useRef(null),b=a.useRef(null),j=a.useRef(null),x=function(){k();var t={type:m.type,data:m.data,options:m.options,plugins:m.plugins};o?b.current=new o(j.current,t):e.A(17393).then(function(e){k(),j.current&&e&&(e.default?b.current=new e.default(j.current,t):b.current=new e(j.current,t))})},k=function(){b.current&&(b.current.destroy(),b.current=null)};a.useImperativeHandle(c,function(){return{props:m,getCanvas:function(){return j.current},getChart:function(){return b.current},getBase64Image:function(){return b.current.toBase64Image()},getElement:function(){return y.current},generateLegend:function(){return b.current&&b.current.generateLegend()},refresh:function(){return b.current&&b.current.update()}}}),a.useEffect(function(){x()}),(0,l.useUnmountEffect)(function(){k()});var w=m.options&&m.options.plugins&&m.options.plugins.title&&m.options.plugins.title.text,S=m.ariaLabel||w,C=u({id:m.id,ref:y,style:g("root"),className:(0,s.classNames)(m.className,f("root"))},i.getOtherProps(m),h("root")),N=u({ref:j,width:m.width,height:m.height,role:"img","aria-label":S},h("canvas"));return a.createElement("div",C,a.createElement("canvas",N))}),function(e,t){return e.data===t.data&&e.options===t.options&&e.type===t.type});c.displayName="Chart";var u=e.i(53729),d=e.i(68242),m=e.i(44080),p=e.i(54858),h=e.i(38036),f=e.i(9573),g=e.i(74660),v=e.i(18566),y=e.i(71028),b=e.i(53138),j=e.i(72382),x=e.i(29768),k=e.i(73225),w=e.i(31458),S=e.i(66595);let C=[{label:"Seluruh Data",value:"semua"},{label:"Hari Ini",value:"hari"},{label:"Minggu Ini",value:"minggu"},{label:"Bulan Ini",value:"bulan"},{label:"Triwulan Ini",value:"triwulan"},{label:"Semester Ini",value:"semester"},{label:"Tahun Ini",value:"tahun"},{label:"Rentang Kustom",value:"custom"}];function N(e){let t=e.getFullYear(),a=String(e.getMonth()+1).padStart(2,"0"),r=String(e.getDate()).padStart(2,"0");return`${t}-${a}-${r}`}let _={LP:"BELUM",PENYELIDIKAN:"LIDIK",PENYIDIKAN:"SIDIK",SP2_LIDIK:"SP2LID",SP3:"SP3",SPDP:"SPDP",PERMA:"PERMA",TAHAP_I:"THP I",TAHAP_II:"THP II",P19:"P19",P21:"P21",RESTORATIVE_JUSTICE:"RJ",PELIMPAHAN:"LIMPAH"},T=[{label:"CT vs CC",value:"ct_cc"},{label:"CP Aktual vs CP Tunggakan",value:"cp"},{label:"CC Aktual vs CC Tunggakan",value:"cc_split"},{label:"CR Baru (%)",value:"cr"},{label:"Crime Rate (per 100rb Penduduk)",value:"crime_rate"},{label:"Crime Clock (menit antar kejahatan)",value:"crime_clock"}],P={ct_cc:"CT = Crime Total (semua perkara aktif). CC = Crime Clearance (perkara selesai).",cp:"CP Aktual = masih diproses, belum lewat jatuh tempo. CP Tunggakan = masih diproses, sudah lewat jatuh tempo.",cc_split:"CC Aktual = selesai sebelum/tepat jatuh tempo. CC Tunggakan = selesai setelah lewat jatuh tempo.",cr:"Clearance Rate = (CC Aktual + CC Tunggakan) / (CT + CC Tunggakan) × 100%.",crime_rate:"Crime Rate = (CT / Jumlah Penduduk) × 100.000 — perkiraan jumlah orang berisiko menjadi korban kejahatan per Polda.",crime_clock:"Crime Clock = Total Detik dalam Periode / CT, dikonversi ke menit — rata-rata selang waktu antar kejadian kejahatan per Polda."};function I(e){if(!e)return"—";let t=String(e).trim().slice(0,10);if(/^\d{2}-\d{2}-\d{4}$/.test(t)){let p=t.split("-");t=`${p[2]}-${p[1]}-${p[0]}`}let a=new Date(t);return isNaN(a.getTime())?t:a.toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric"})}function R(e,t){return e?1===e?`No. LP: ${t||"-"}`:`No. LP: ${t||"-"} +${e-1} lainnya`:"No. LP: Nihil / Belum Terbit"}let z=e=>new Intl.NumberFormat("id-ID").format(e||0);function renderKpInfoIcon(sz){var s=sz||13;return(0,t.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",width:s,height:s,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round",style:{flexShrink:0,opacity:.78},children:[(0,t.jsx)("circle",{cx:"12",cy:"12",r:"10"}),(0,t.jsx)("path",{d:"M12 16v-4"}),(0,t.jsx)("path",{d:"M12 8h.01"})]})}function O({icon:e,title:a,sub:r,iconBg:n,iconColor:l}){return(0,t.jsx)("div",{className:"dash-panel-head",style:{marginBottom:"0.85rem"},children:(0,t.jsxs)("div",{className:"dash-panel-head-left",children:[(0,t.jsx)("span",{className:"dash-icon-badge",style:{background:n,color:l},children:e}),(0,t.jsxs)("div",{style:{minWidth:0},children:[(0,t.jsx)("div",{className:"dash-panel-title",children:a}),r&&(0,t.jsx)("div",{className:"dash-panel-sub",children:r})]})]})})}function D({label:e,value:a,color:r,bg:n,icon:l,note:s,rightBadge:o}){return(0,t.jsxs)("div",{className:"dash-hero-card",style:{"--dash-accent":r,display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"space-between",gap:"0.75rem",padding:"0.75rem 0.95rem",minHeight:"auto"},children:[(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.68rem",minWidth:0,flex:"1 1 auto"},children:[(0,t.jsx)("span",{className:"dash-icon-badge",style:{background:n,width:"2.4rem",height:"2.4rem",borderRadius:10,display:"inline-flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:(0,t.jsx)("i",{className:`pi ${l}`,style:{color:r,fontSize:"1.02rem"}})}),(0,t.jsxs)("div",{style:{minWidth:0,display:"flex",flexDirection:"column",gap:"0.12rem"},children:[(0,t.jsx)("div",{className:"dash-hero-label",style:{marginTop:0,fontSize:"0.76rem",fontWeight:800,lineHeight:1.25},children:e}),s&&(0,t.jsx)("div",{className:"dash-hero-note",style:{marginTop:0,fontSize:"0.69rem",opacity:0.8,lineHeight:1.2},children:s})]})]}),(0,t.jsxs)("div",{style:{display:"flex",flexDirection:"column",alignItems:"flex-end",justifyContent:"center",gap:"0.2rem",flexShrink:0},children:[(0,t.jsx)("div",{className:"dash-hero-value",style:{color:r,fontSize:"1.42rem",fontWeight:850,lineHeight:1.1,marginTop:0,whiteSpace:"nowrap"},children:a}),o&&(0,t.jsx)("span",{style:{fontSize:"0.64rem",fontWeight:700,padding:"0.1rem 0.45rem",borderRadius:999,background:"rgba(37,99,235,0.12)",color:r,border:"1px solid rgba(37,99,235,0.28)",whiteSpace:"nowrap"},children:o})]})]})}function A({label:e,value:a,small:r,title:n}){return(0,t.jsxs)("div",{className:"dash-minicard",style:{cursor:n?"help":"default"},title:n,children:[(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.28rem",fontSize:"0.7rem",fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.03em"},children:[(0,t.jsx)("span",{style:{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:e}),n&&renderKpInfoIcon(12)]}),(0,t.jsx)("div",{style:{fontSize:r?"0.92rem":"1.25rem",fontWeight:800,color:"inherit",marginTop:"0.2rem"},children:a})]})}function E({rows:e,loading:a,total:r}){return a?(0,t.jsx)("span",{style:{color:"#94a3b8"},children:"Memuat…"}):e.length?(0,t.jsx)("ol",{style:{margin:0,padding:0,listStyle:"none",display:"grid",gridTemplateColumns:"minmax(0,1fr)",gap:"0.48rem",minWidth:0,overflow:"hidden"},children:e.map((e,a)=>(0,t.jsxs)("li",{style:{display:"flex",alignItems:"center",gap:"0.65rem",fontSize:"0.85rem",minWidth:0,overflow:"hidden",height:"1.45rem",lineHeight:1},children:[(0,t.jsx)("span",{style:{flex:"0 0 auto",width:"1.45rem",height:"1.45rem",borderRadius:6,background:"rgba(255,255,255,0.08)",color:"var(--cas-text-primary, #f1f5f9)",border:"1px solid var(--cas-border-card, rgba(255,255,255,0.12))",fontWeight:800,fontSize:"0.72rem",display:"inline-flex",alignItems:"center",justifyContent:"center"},children:a+1}),e.badge&&(0,t.jsx)("span",{style:{flex:"0 0 auto",fontSize:"0.62rem",fontWeight:700,padding:"1px 5px",borderRadius:4,background:e.badge==="Satker"?"#eff6ff":"#f8fafc",color:e.badge==="Satker"?"#2563eb":"#64748b"},children:e.badge}),(0,t.jsx)("span",{style:{flex:1,minWidth:0,color:"var(--cas-text-primary, #f1f5f9)",fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},title:e.nama,children:e.nama}),(0,t.jsxs)("span",{style:{flex:"0 0 auto",textAlign:"right",whiteSpace:"nowrap",lineHeight:1},children:[(0,t.jsx)("strong",{style:{color:"var(--cas-text-primary, #0f172a)"},children:z(e.value)}),(0,t.jsx)("span",{style:{color:"var(--cas-text-muted, #94a3b8)",fontSize:"0.72rem",fontWeight:700},children:" LP "}),(0,t.jsxs)("span",{style:{color:"#94a3b8",fontSize:"0.68rem"},children:["(",(e.totalOverride||r)>0?(e.value/(e.totalOverride||r)*100).toLocaleString("id-ID",{minimumFractionDigits:2,maximumFractionDigits:2}):"0,00","%)"]})]})]},a))}):(0,t.jsx)("span",{style:{color:"#94a3b8"},children:"Belum ada data."})}function L({rows:e,loading:a,color:r,suffix:n,empty:l}){return a?(0,t.jsx)("span",{style:{color:"#94a3b8"},children:"Memuat…"}):e.length?(0,t.jsx)("ol",{style:{margin:0,padding:0,listStyle:"none",display:"grid",gridTemplateColumns:"minmax(0,1fr)",gap:"0.48rem",minWidth:0,overflow:"hidden"},children:e.map((e,a)=>(0,t.jsxs)("li",{style:{display:"flex",alignItems:"center",gap:"0.65rem",fontSize:"0.85rem",minWidth:0,overflow:"hidden",height:"1.45rem",lineHeight:1},children:[(0,t.jsx)("span",{style:{flex:"0 0 auto",width:"1.45rem",height:"1.45rem",borderRadius:6,background:"rgba(255,255,255,0.08)",color:"var(--cas-text-primary, #f1f5f9)",border:"1px solid var(--cas-border-card, rgba(255,255,255,0.12))",fontWeight:800,fontSize:"0.72rem",display:"inline-flex",alignItems:"center",justifyContent:"center"},children:a+1}),(0,t.jsx)("span",{style:{flex:1,minWidth:0,color:"var(--cas-text-primary, #f1f5f9)",fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},title:e.nama,children:e.nama}),(0,t.jsx)("strong",{style:{flex:"0 0 auto",color:r,whiteSpace:"nowrap"},children:z(e.value)}),(0,t.jsx)("span",{style:{flex:"0 0 auto",color:"var(--cas-text-muted, #94a3b8)",fontSize:"0.72rem",fontWeight:700,whiteSpace:"nowrap"},children:n})]},a))}):(0,t.jsx)("span",{style:{color:"#94a3b8"},children:l||"Belum ada data."})}function renderCasBadge(text,variant){if(!text)return null;var styles={danger:{bg:"rgba(239, 68, 68, 0.14)",border:"rgba(239, 68, 68, 0.3)",color:"#f87171"},"danger-bold":{bg:"rgba(220, 38, 38, 0.22)",border:"rgba(239, 68, 68, 0.5)",color:"#fca5a5",fontWeight:700},warning:{bg:"rgba(245, 158, 11, 0.14)",border:"rgba(245, 158, 11, 0.3)",color:"#fbbf24"},success:{bg:"rgba(16, 185, 129, 0.14)",border:"rgba(16, 185, 129, 0.3)",color:"#34d399"},blue:{bg:"rgba(59, 130, 246, 0.14)",border:"rgba(59, 130, 246, 0.3)",color:"#60a5fa"},indigo:{bg:"rgba(99, 102, 241, 0.14)",border:"rgba(99, 102, 241, 0.3)",color:"#818cf8"},cyan:{bg:"rgba(6, 182, 212, 0.14)",border:"rgba(6, 182, 212, 0.3)",color:"#38bdf8"},purple:{bg:"rgba(168, 85, 247, 0.14)",border:"rgba(168, 85, 247, 0.3)",color:"#c084fc"},neutral:{bg:"rgba(148, 163, 184, 0.12)",border:"rgba(148, 163, 184, 0.25)",color:"#94a3b8"}};var s=styles[variant]||styles.neutral;return(0,t.jsx)("span",{style:{display:"inline-flex",alignItems:"center",justifyContent:"center",background:s.bg,border:"1px solid "+s.border,color:s.color,borderRadius:"4px",fontSize:"0.66rem",fontWeight:s.fontWeight||600,padding:"1px 6px",lineHeight:"1.3",letterSpacing:"0.02em",whiteSpace:"nowrap",flexShrink:0},children:text})}function M({title:e,icon:a,items:r,emptyText:n,onLihatSemua:l,onOpenItem:s,headerExtra:o}){return(0,t.jsxs)("div",{className:"cms-card",style:{minWidth:0,height:"100%",minHeight:"29.5rem",display:"flex",flexDirection:"column",justifyContent:"flex-start",overflow:"visible",borderRadius:"12px"},children:[(0,t.jsxs)("div",{className:"dash-panel-head",style:{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"nowrap",gap:"0.35rem",minWidth:0,minHeight:"2.5rem",marginBottom:"0.75rem"},children:[(0,t.jsx)("div",{className:"dash-panel-head-left",style:{minWidth:0,flex:"1 1 auto",overflow:"hidden"},children:(0,t.jsxs)("span",{className:"dash-panel-title",style:{display:"flex",alignItems:"center",gap:"0.45rem",minWidth:0,overflow:"hidden",whiteSpace:"nowrap",fontSize:"0.84rem",fontWeight:700},children:[a,(0,t.jsx)("span",{style:{minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",display:"inline-flex",alignItems:"center"},title:typeof e==="string"?e:void 0,children:e})]})}),o]}),0===r.length?((typeof n==="string"&&n.includes("Memuat"))?(0,t.jsx)("div",{style:{display:"grid",gap:"0.5rem",minWidth:0,flex:"1 1 auto",alignContent:"start",gridAutoRows:"4.35rem"},children:[1,2,3,4,5].map(i=>(0,t.jsxs)("div",{key:i,className:"dash-kasus-item",style:{border:"1px solid var(--cas-border-card, #233554)",background:"rgba(255, 255, 255, 0.02)",borderRadius:8,padding:"0.55rem 0.75rem",minWidth:0,overflow:"hidden",height:"4.35rem",display:"flex",flexDirection:"column",justifyContent:"center",gap:"0.4rem"},children:[(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.4rem"},children:[(0,t.jsx)("div",{className:"cas-skeleton-shimmer",style:{width:i%2===0?"72%":"85%",height:"13px",borderRadius:"4px"}}),(0,t.jsx)("div",{className:"cas-skeleton-shimmer",style:{width:"48px",height:"14px",borderRadius:"4px"}})]}),(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.45rem",marginTop:"0.2rem"},children:[(0,t.jsx)("div",{className:"cas-skeleton-shimmer",style:{width:"55px",height:"11px",borderRadius:"4px"}}),(0,t.jsx)("div",{className:"cas-skeleton-shimmer",style:{width:"80px",height:"11px",borderRadius:"4px"}}),(0,t.jsx)("div",{className:"cas-skeleton-shimmer",style:{width:"40px",height:"11px",borderRadius:"4px"}})]})]}))}) : (0,t.jsx)("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"23.5rem",color:"#94a3b8",fontSize:"0.85rem",flex:"1 1 auto",border:"1px dashed var(--cas-border-card, #233554)",borderRadius:8},children:n})):(0,t.jsx)("div",{style:{display:"grid",gap:"0.5rem",minWidth:0,flex:"1 1 auto",alignContent:"start",gridAutoRows:"4.35rem"},children:r.map((e,idx)=>(0,t.jsxs)("div",{key:e.id?(e.id+"-"+idx+"-"+(e.tag||"")):("it-"+idx),onClick:()=>s(e.id),className:"dash-kasus-item",style:{cursor:"pointer",border:e._pinned?"1px solid rgba(245, 158, 11, 0.45)":"1px solid var(--cas-border-card, #233554)",background:e._pinned?"rgba(245, 158, 11, 0.06)":"rgba(255, 255, 255, 0.02)",borderRadius:8,padding:"0.55rem 0.75rem",minWidth:0,overflow:"hidden",height:"4.35rem",display:"flex",flexDirection:"column",justifyContent:"center",transition:"all .15s ease"},onMouseEnter:ev=>{ev.currentTarget.style.background=e._pinned?"rgba(245, 158, 11, 0.11)":"rgba(255, 255, 255, 0.05)";ev.currentTarget.style.borderColor=e._pinned?"rgba(245, 158, 11, 0.65)":"rgba(255, 255, 255, 0.16)";},onMouseLeave:ev=>{ev.currentTarget.style.background=e._pinned?"rgba(245, 158, 11, 0.06)":"rgba(255, 255, 255, 0.02)";ev.currentTarget.style.borderColor=e._pinned?"rgba(245, 158, 11, 0.45)":"var(--cas-border-card, #233554)";},children:[(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.4rem",minWidth:0,whiteSpace:"nowrap",overflow:"hidden"},children:[(0,t.jsxs)("span",{style:{flex:"1 1 auto",minWidth:0,fontWeight:650,fontSize:"0.83rem",color:"var(--cas-text-primary, #f1f5f9)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},title:e.judul||"-",children:[e._pinned&&(0,t.jsx)("span",{title:"Disematkan (Prioritas Rank #1)",style:{marginRight:"0.3rem"},children:"📌"}),e.judul||"-"]}),(0,t.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.25rem",flexShrink:0},children:[e._pinned?renderCasBadge("Disematkan","warning"):null,e.tag?renderCasBadge(e.tag,e.tagVariant||e.tagSeverity):null]})]}),(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.45rem",marginTop:"0.32rem",fontSize:"0.72rem",color:"var(--cas-text-muted, #94a3b8)",minWidth:0,whiteSpace:"nowrap",overflow:"hidden"},children:e.metaText?(0,t.jsx)("span",{style:{flex:"1 1 auto",minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},title:e.metaText,children:e.metaText}):[(!e.hideStatus&&e.status)?renderCasBadge(e.status,e.statusVariant||e.statusSeverity):null,(e.tanggal&&e.tanggal!=="—")?(0,t.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.22rem",flex:"0 0 auto",whiteSpace:"nowrap"},children:[(0,t.jsx)(x.CalendarDays,{size:11})," ",e.tanggal]}):null,e.lpInfo?(0,t.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.22rem",flex:"1 1 auto",minWidth:0,overflow:"hidden",whiteSpace:"nowrap"},title:e.lpInfo,children:[(0,t.jsx)(k.FileSearch,{size:11,style:{flex:"0 0 auto"}}),(0,t.jsx)("span",{style:{minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:e.lpInfo})]}):null]})]},e.id))})]})} e.s(["default",0,function(){let e=(0,v.useRouter)(),[r,n]=(0,a.useState)(null),[l,s]=(0,a.useState)(null),[i,o]=(0,a.useState)(null),[u,x]=(0,a.useState)([]),[k,W]=(0,a.useState)([]),[B,H]=(0,a.useState)([]),[dpoRows,setDpoRows]=(0,a.useState)([]),[casFeed,setCasFeed]=(0,a.useState)([]),[casFeedLoading,setCasFeedLoading]=(0,a.useState)(!0),[pihakJenis,setPihakJenis]=(0,a.useState)("ALL"),[pihakLoading,setPihakLoading]=(0,a.useState)(!1),[$,U]=(0,a.useState)([]),[F,K]=(0,a.useState)("ct_cc"),[J,V]=(0,a.useState)(!0),[Y,X]=(0,a.useState)("custom"),[q,G]=(0,a.useState)(()=>{let e=new Date;return N(new Date(e.getFullYear(),0,1))}),[Z,Q]=(0,a.useState)(()=>{let e=new Date;return N(new Date(e.getFullYear(),11,31))}),[appliedCustomFrom,setAppliedCustomFrom]=(0,a.useState)(q),[appliedCustomTo,setAppliedCustomTo]=(0,a.useState)(Z),[kejTab,setKejTab]=(0,a.useState)("semua"),[dashWelcomeOpen,setDashWelcomeOpen]=(0,a.useState)(!1),[dashKinerjaCompact,setDashKinerjaCompact]=(0,a.useState)(!1),[dashShowAllStatNums,setDashShowAllStatNums]=(0,a.useState)(!0),[dashStatTip,setDashStatTip]=(0,a.useState)(null),{from:ee,to:et}=(0,a.useMemo)(()=>(function(e,t,a){let r=new Date,n=N(r),l=r.getFullYear();if("semua"===e)return{from:"2000-01-01",to:n};if("custom"===e)return{from:t||n,to:a||n};if("hari"===e)return{from:n,to:n};if("minggu"===e){let e=r.getDay()||7,t=new Date(l,r.getMonth(),r.getDate()-(e-1)),a=new Date(l,r.getMonth(),r.getDate()-(e-1)+6);return{from:N(t),to:N(a)}}if("bulan"===e){let e=new Date(l,r.getMonth(),1),t=new Date(l,r.getMonth()+1,0);return{from:N(e),to:N(t)}}if("triwulan"===e){let e=3*Math.floor(r.getMonth()/3),t=new Date(l,e,1),a=new Date(l,e+3,0);return{from:N(t),to:N(a)}}if("semester"===e){let e=6>r.getMonth()?0:6,t=new Date(l,e,1),a=new Date(l,e+6,0);return{from:N(t),to:N(a)}}return{from:`${l}-01-01`,to:`${l}-12-31`}})(Y,appliedCustomFrom,appliedCustomTo),[Y,appliedCustomFrom,appliedCustomTo]),[dashPeriodOpen,setDashPeriodOpen]=(0,a.useState)(!1),
[dashPeriodMode,setDashPeriodMode]=(0,a.useState)("year"),
[dashPeriodMonth,setDashPeriodMonth]=(0,a.useState)(()=>{
  let e=new Date,
      t=new Date(e.getFullYear(),e.getMonth()-1,1);
  return String(t.getMonth()+1).padStart(2,"0")
}),
[dashPeriodYear,setDashPeriodYear]=(0,a.useState)(()=>{
  let e=new Date,
      t=new Date(e.getFullYear(),e.getMonth()-1,1);
  return String(t.getFullYear())
}),
[dashPeriodLabel,setDashPeriodLabel]=(0,a.useState)(()=>"Tahun "+new Date().getFullYear()),[ea,er]=(0,a.useState)("");function en(){let t=ea.trim();t.length<5||e.push(`/cms/pencarian?q=${encodeURIComponent(t)}`)}
function dashMonthOptions(){
  return[
    {label:"Januari",value:"01"},
    {label:"Februari",value:"02"},
    {label:"Maret",value:"03"},
    {label:"April",value:"04"},
    {label:"Mei",value:"05"},
    {label:"Juni",value:"06"},
    {label:"Juli",value:"07"},
    {label:"Agustus",value:"08"},
    {label:"September",value:"09"},
    {label:"Oktober",value:"10"},
    {label:"November",value:"11"},
    {label:"Desember",value:"12"}
  ]
}

function dashYearOptions(){
  let current=new Date().getFullYear(),
      out=[];
  for(let y=current;y>=2000;y--)
    out.push({label:String(y),value:String(y)});
  return out
}

function dashMonthRange(year,month){
  let y=Number(year),
      m=Number(month);

  if(
    !Number.isInteger(y) ||
    !Number.isInteger(m) ||
    m<1 ||
    m>12
  ) return null;

  let mm=String(m).padStart(2,"0"),
      last=new Date(y,m,0).getDate();

  return{
    from:String(y)+"-"+mm+"-01",
    to:String(y)+"-"+mm+"-"+String(last).padStart(2,"0"),
    label:new Date(y,m-1,1).toLocaleDateString(
      "id-ID",
      {month:"long",year:"numeric"}
    )
  }
}

function dashYearRange(year){
  let y=Number(year);

  if(!Number.isInteger(y))return null;

  return{
    from:String(y)+"-01-01",
    to:String(y)+"-12-31",
    label:String(y)
  }
}

function dashApplyPeriod(){
  let from="",
      to="",
      label="";

  if("month"===dashPeriodMode){
    let range=dashMonthRange(
      dashPeriodYear,
      dashPeriodMonth
    );

    if(!range)return;

    from=range.from;
    to=range.to;
    label=range.label;
  }else if("year"===dashPeriodMode){
    let range=dashYearRange(dashPeriodYear);

    if(!range)return;

    from=range.from;
    to=range.to;
    label=range.label;
  }else{
    from=q;
    to=Z;

    if(!from||!to)return;
    if(from>to)return;

    label=from+" s/d "+to;
  }

  G(from);
  Q(to);

  X("custom");
  setAppliedCustomFrom(from);
  setAppliedCustomTo(to);

  setDashPeriodLabel(label);
  setDashPeriodOpen(!1);
}

function dashResetPeriod(){
  let cy=String((new Date).getFullYear()),
      from=cy+"-01-01",
      to=cy+"-12-31",
      label="Tahun "+cy;
  setDashPeriodMode("year");
  setDashPeriodYear(cy);
  G(from);
  Q(to);
  X("custom");
  setAppliedCustomFrom(from);
  setAppliedCustomTo(to);
  setDashPeriodLabel(label);
  setDashPeriodOpen(!1);
}


const DASH_CACHE_TTL_MS=60000;
const PIHAK_RANK_CACHE_TTL_MS=60000;

function pihakRankCacheKey(kind=pihakJenis){
  try{
    let user=(0,h.getUser)();

    if(!user?.email)
      return null;

    let role=String(
      (0,h.deriveRoles)(user)?.label||
      "viewer"
    ).toLowerCase();

    let scope=String(
      user?.scope_satker_id??
      user?.satker_id??
      "none"
    );

    return[
      "bdb-dash-pihak-rank-v11",
      encodeURIComponent(
        String(user.email).toLowerCase()
      ),
      encodeURIComponent(role),
      encodeURIComponent(scope),
      ee,
      et,
      encodeURIComponent(String(kind||"ALL"))
    ].join(":")
  }catch{
    return null
  }
}

function pihakRankCacheRead(kind){
  try{
    let key=pihakRankCacheKey(kind);

    if(!key)
      return null;

    let raw=("undefined"!==typeof localStorage?localStorage.getItem(key):null)||sessionStorage.getItem(key);

    if(!raw)
      return null;

    let cached=JSON.parse(raw),
        savedAt=Number(cached?.savedAt||0);

    if(
      !savedAt ||
      Date.now()-savedAt>=PIHAK_RANK_CACHE_TTL_MS ||
      !Array.isArray(cached?.data)
    ){
      sessionStorage.removeItem(key);
      return null
    }

    return cached.data
  }catch{
    return null
  }
}

function pihakRankCacheWrite(kind,data){
  try{
    if(!Array.isArray(data) || data.length === 0) return;
    let key=pihakRankCacheKey(kind);

    if(!key)
      return;

    sessionStorage.setItem(
      key,
      JSON.stringify({
        savedAt:Date.now(),
        data
      })
    )
  }catch{}
}

let loadPihakRanking=(0,a.useCallback)(async(force=!1,overrideKind=null)=>{
  let req=++pihakRankReqRef.current,
      kind=overrideKind||pihakJenis;

  let hadRankCached=!1;
  if(!force){
    let cached=pihakRankCacheRead(kind);

    if(cached){
      if(req!==pihakRankReqRef.current)
        return;

      setDpoRows(cached);
      hadRankCached=!0;
      setPihakLoading(!1);
    }
  }

  if(!hadRankCached) setPihakLoading(!0);

  try{
    let response=await p.apiAuth.get(
      "/bdb/pihak-terlibat/ranking",
      {
        params:{
          from:ee,
          to:et,
          keterlibatan:kind,
          limit:5,
          scope:"national",
          dashboard:1,
          all_time:1,
          ...(force?{refresh:1}:{})
        }
      }
    );

    if(req!==pihakRankReqRef.current)
      return;

    let rows=
      Array.isArray(response?.data?.data)
        ?response.data.data
        :[];

    let _s=new Set();rows=(rows||[]).filter(x=>{let k=String((x.raw_nik&&x.raw_nik!=="KORPORASI"?x.raw_nik:"")||(x.nik&&x.nik!=="KORPORASI"?x.nik:"")||x.nama||"").trim().toUpperCase();if(!k||_s.has(k))return!1;_s.add(k);return!0}).slice(0,5);setDpoRows(rows);
    pihakRankCacheWrite(kind,rows)
  }catch{
    if(req===pihakRankReqRef.current)
      setDpoRows([])
  }finally{
    if(req===pihakRankReqRef.current)
      setPihakLoading(!1)
  }
},[ee,et,pihakJenis]);

function dashCacheKey(){
  try{
    let user=(0,h.getUser)();

    if(!user?.email)
      return null;

    let role=String(
      (0,h.deriveRoles)(user)?.label||
      "viewer"
    ).toLowerCase();

    let scope=String(
      user?.scope_satker_id??
      user?.satker_id??
      "none"
    );

    return[
      "bdb-dashboard-v13",
      encodeURIComponent(
        String(user.email).toLowerCase()
      ),
      encodeURIComponent(role),
      encodeURIComponent(scope),
      ee,
      et
    ].join(":")
  }catch{
    return null
  }
}

function dashCacheRead(){
  try{
    let key=dashCacheKey();

    if(!key)
      return null;

    let raw=sessionStorage.getItem(key);

    if(!raw)
      return null;

    let cached=JSON.parse(raw),
        savedAt=Number(cached?.savedAt||0);

    if(
      !savedAt ||
      Date.now()-savedAt>=DASH_CACHE_TTL_MS ||
      !cached?.data || !Array.isArray(cached?.data?.dpo) || !Array.isArray(cached?.data?.menonjol) || cached?.data?.menonjol.length === 0
    ){
      sessionStorage.removeItem(key);
      return null
    }

    return cached.data
  }catch{
    return null
  }
}

function dashCacheWrite(data){
  try{
    let key=dashCacheKey();

    if(!key)
      return;

    sessionStorage.setItem(
      key,
      JSON.stringify({
        savedAt:Date.now(),
        data
      })
    )
  }catch{}
}

function dashCacheApply(cached){
  if(
    Object.prototype.hasOwnProperty.call(
      cached,
      "dashboard"
    )
  ){
    s(cached.dashboard??null)
  }

  if(
    Object.prototype.hasOwnProperty.call(
      cached,
      "summary"
    )
  ){
    o(cached.summary??null)
  }

  if(
    Object.prototype.hasOwnProperty.call(
      cached,
      "menonjol"
    )
  ){
    x(
      Array.isArray(cached.menonjol)
        ?cached.menonjol
        :[]
    )
  }

  if(
    Object.prototype.hasOwnProperty.call(
      cached,
      "atensi"
    )
  ){
    W(
      Array.isArray(cached.atensi)
        ?cached.atensi
        :[]
    )
  }

  if(
    Object.prototype.hasOwnProperty.call(
      cached,
      "operasi"
    )
  ){
    H(
      Array.isArray(cached.operasi)
        ?cached.operasi
        :[]
    )
  }

  if(
    Object.prototype.hasOwnProperty.call(
      cached,
      "kinerja"
    )
  ){
    U(
      Array.isArray(cached.kinerja)
        ?cached.kinerja
        :[]
    )
  }

  if(
    Object.prototype.hasOwnProperty.call(
      cached,
      "dpo"
    )
  ){
    setDpoRows(
      Array.isArray(cached.dpo)
        ?cached.dpo
        :[]
    )
  }
}

let el=(0,a.useCallback)(async(e,t)=>{try{let a=await p.apiAuth.get("/bdb/kinerja-perkara/rekap",{params:{from:e,to:t,visibility:(()=>{let e=(0,h.deriveRoles)((0,h.getUser)());return e.isSuperadmin||e.isAdminBinops?"national":"scoped"})(),functionDomain:"INTERNAL_RESERSE",organizationDomain:"INTERNAL_POLRI"}}),r=(a.data?.data?.nodes||[])[0];if(!r?.has_children)return[];let n=await p.apiAuth.get("/bdb/kinerja-perkara/rekap",{params:{parent:r.kode,from:e,to:t,visibility:(()=>{let e=(0,h.deriveRoles)((0,h.getUser)());return e.isSuperadmin||e.isAdminBinops?"national":"scoped"})(),functionDomain:"INTERNAL_RESERSE",organizationDomain:"INTERNAL_POLRI"}});return(n.data?.data?.nodes||[]).map(e=>({nama:e.nama,ct:e.ct,cp_berjalan:e.cp_berjalan,cp_tunggakan:e.cp_tunggakan,cc_aktual:e.cc_aktual,cc_tunggakan:e.cc_tunggakan,cr:e.cr,crime_rate:e.crime_rate??null,crime_clock_detik:e.crime_clock_detik??null}))}catch{return[]}},[]),es=(0,a.useRef)(0),
pihakRankReqRef=(0,a.useRef)(0),
dashCacheForceRef=(0,a.useRef)(!1),
dashPeriodRef=(0,a.useRef)(null),
ei=(0,a.useCallback)(async()=>{
  let e=++es.current,
      force=dashCacheForceRef.current;

  dashCacheForceRef.current=!1;

  let hadCached=!1;
  if(!force){
    let cached=dashCacheRead();

    if(cached){
      if(e!==es.current)
        return;

      dashCacheApply(cached);
      hadCached=!0;
      V(!1);
    }
  }

  if(!hadCached) V(!0);

  try{
    let payload={
      dashboard:null,
      summary:null,
      menonjol:[],
      atensi:[],
      operasi:[],
      dpo:[],
      kinerja:[]
    };

    let pAnev=p.apiAuth.get(
      "/bdb/anev/dashboard",
      {
        params:{
          date_from:ee,
          date_to:et,
          functionDomain:"INTERNAL_RESERSE",
          organizationDomain:"INTERNAL_POLRI",
          ...(force?{refresh:1}:{})
        }
      }
    ).then(res=>{
      if(e===es.current){
        payload.dashboard=res?.data?.data||null;
        s(payload.dashboard);
      }
    }).catch(()=>{
      if(e===es.current) s(null);
    });

    let pSummary=p.apiAuth.get(
      "/bdb/kinerja-perkara/summary",
      {
        params:{
          from:ee,
          to:et,
          visibility:(()=>{
            let e=(0,h.deriveRoles)((0,h.getUser)());
            return e.isSuperadmin||e.isAdminBinops?"national":"scoped"
          })(),
          functionDomain:"INTERNAL_RESERSE",
          organizationDomain:"INTERNAL_POLRI",
          ...(force?{refresh:1}:{})
        }
      }
    ).then(res=>{
      if(e===es.current){
        payload.summary=res?.data?.data||null;
        o(payload.summary);
      }
    }).catch(()=>{
      if(e===es.current) o(null);
    });

    let pMenonjol=p.apiAuth.get(
      "/bdb/kasus-menonjol",
      {params:{row:10,page:1,scope:"national",dashboard:1}}
    ).then(res=>{
      if(e===es.current){
        let rows=Array.isArray(res?.data?.data)?res.data.data.slice(0,10):[];
        payload.menonjol=rows;
        x(rows);
      }
    }).catch(()=>{
      if(e===es.current) x([]);
    });

    let pAtensi=p.apiAuth.get(
      "/bdb/kasus-atensi",
      {params:{row:10,page:1,scope:"national",dashboard:1}}
    ).then(res=>{
      if(e===es.current){
        let rows=Array.isArray(res?.data?.data)?res.data.data.slice(0,10):[];
        payload.atensi=rows;
        W(rows);
      }
    }).catch(()=>{
      if(e===es.current) W([]);
    });

    let pOperasi=p.apiAuth.get(
      "/bdb/operasi-satgas",
      {
        params:{
          row:20,
          page:1,
          status:"AKTIF"
        }
      }
    ).then(res=>{
      if(e===es.current){
        let rows=Array.isArray(res?.data?.data)?res.data.data.slice(0,20):[];
        payload.operasi=rows;
        H(rows);
      }
    }).catch(()=>{
      if(e===es.current) H([]);
    });

    let pRanking=p.apiAuth.get(
      "/bdb/pihak-terlibat/ranking",
      {
        params:{
          from:ee,
          to:et,
          keterlibatan:pihakJenis,
          limit:5,
          scope:"national",
          dashboard:1,
          all_time:1,
          ...(force?{refresh:1}:{})
        }
      }
    ).then(res=>{
      if(e===es.current){
        let rows=Array.isArray(res?.data?.data)?res.data.data:[];
        payload.dpo=rows;
        setDpoRows(rows);
      }
    }).catch(()=>{
      if(e===es.current) setDpoRows([]);
    });

    let pKinerja=el(ee,et).then(rows=>{
      if(e===es.current){
        let r=Array.isArray(rows)?rows:[];
        payload.kinerja=r;
        U(r);
      }
    }).catch(()=>{
      if(e===es.current) U([]);
    });

    await Promise.all([pAnev,pSummary,pMenonjol,pAtensi,pOperasi,pRanking,pKinerja]);

    if(e===es.current){
      dashCacheWrite(payload);
    }
  }finally{
    e===es.current&&V(!1)
  }
},[el,ee,et]),
{refreshing:eo,updatedAt:ec,refresh:eu}=(0,f.useAutoRefresh)(ei,18e5);
function dashForceRefresh(){
  dashCacheForceRef.current=!0;
  try{p.apiAuth.post("/bdb/system/orchestrator/trigger-recalculate").catch(()=>{})}catch(e){}
  loadPihakRanking(!0);
  return eu()
}(0,a.useEffect)(()=>{},[]);(0,a.useEffect)(()=>{n((0,h.getUser)())},[]),(0,a.useEffect)(()=>{try{p.apiAuth.get("/bdb/jukrah/feed",{params:{limit:5}}).then(r=>{setCasFeed((r.data?.data||[]).slice(0,5))}).catch(()=>{setCasFeed([])}).finally(()=>{setCasFeedLoading(!1)})}catch(e){setCasFeedLoading(!1)}},[]),(0,a.useEffect)(()=>{
  let key=ee+"|"+et;

  if(null===dashPeriodRef.current){
    dashPeriodRef.current=key;
    eu();
    return
  }

  if(dashPeriodRef.current!==key){
    dashPeriodRef.current=key;
  }

  eu()
},[eu,ee,et]);let ed=(0,h.deriveRoles)(r),em=(0,a.useMemo)(()=>{if("ct_cc"===F){let list=(l?.scoped&&Array.isArray(l?.top_satker_ct)&&l.top_satker_ct.length>0)?l.top_satker_ct.filter(x=>x.ct>0):(l?.polda||[]);return{labels:list.map(e=>abbrSatkerName(e.nama,!0)),fullNames:list.map(e=>e.nama||""),datasets:[{label:"CT",data:list.map(e=>e.ct),backgroundColor:"#ef4444",borderRadius:4},{label:"CC",data:list.map(e=>((e.cc_aktual||0)+(e.cc_tunggakan||0))||e.cc||0),backgroundColor:"#16a34a",borderRadius:4}]}};let e=[...$];if("cp"===F)return e.sort((e,t)=>t.cp_tunggakan-e.cp_tunggakan),{labels:e.map(e=>abbrSatkerName(e.nama,!0)),fullNames:e.map(e=>e.nama||""),datasets:[{label:"CP Aktual",data:e.map(e=>e.cp_berjalan),backgroundColor:"#0891b2",borderRadius:4},{label:"CP Tunggakan",data:e.map(e=>e.cp_tunggakan),backgroundColor:"#dc2626",borderRadius:4}]};if("cc_split"===F)return e.sort((e,t)=>t.cc_aktual+t.cc_tunggakan-(e.cc_aktual+e.cc_tunggakan)),{labels:e.map(e=>abbrSatkerName(e.nama,!0)),fullNames:e.map(e=>e.nama||""),datasets:[{label:"CC Aktual",data:e.map(e=>e.cc_aktual),backgroundColor:"#16a34a",borderRadius:4},{label:"CC Tunggakan",data:e.map(e=>e.cc_tunggakan),backgroundColor:"#b45309",borderRadius:4}]};if("cr"===F)return e.sort((e,t)=>t.cr-e.cr),{labels:e.map(e=>abbrSatkerName(e.nama,!0)),fullNames:e.map(e=>e.nama||""),datasets:[{label:"CR Baru (%)",data:e.map(e=>e.cr),backgroundColor:"#2563eb",borderRadius:4}]};if("crime_rate"===F){let t=e.filter(e=>null!=e.crime_rate).sort((e,t)=>(t.crime_rate||0)-(e.crime_rate||0));return{labels:t.map(e=>abbrSatkerName(e.nama,!0)),fullNames:t.map(e=>e.nama||""),datasets:[{label:"Crime Rate (per 100rb Penduduk)",data:t.map(e=>e.crime_rate||0),backgroundColor:"#7c3aed",borderRadius:4}]}}let t=e.filter(e=>null!=e.crime_clock_detik).sort((e,t)=>(e.crime_clock_detik||0)-(t.crime_clock_detik||0));return{labels:t.map(e=>abbrSatkerName(e.nama,!0)),fullNames:t.map(e=>e.nama||""),datasets:[{label:"Crime Clock (menit antar kejahatan)",data:t.map(e=>Math.round((e.crime_clock_detik||0)/60*10)/10),backgroundColor:"#0891b2",borderRadius:4}]}},[l,$,F]),ep=(0,a.useMemo)(()=>{let e="cr"===F?"%":"crime_clock"===F?" menit":"";return{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"top",labels:{boxWidth:12,font:{size:11}}},tooltip:{callbacks:{title:items=>em.fullNames?.[items?.[0]?.dataIndex]||items?.[0]?.label||"",label:t=>`${t.dataset.label}: ${t.parsed.y}${e}`}}},scales:{x:{ticks:{font:{size:10,weight:"600"},maxRotation:45,minRotation:0,autoSkip:!1},grid:{display:!1}},y:{beginAtZero:!0,ticks:"cr"!==F&&"crime_clock"!==F?{precision:0}:{}}}}},[F,em]),eh=!J&&l&&l.scoped&&!l.scope_satker,ef=!J&&l&&l.scoped&&!!l.scope_satker&&!l.scope_ada_data,welcomeSatker=(String(r?.id)==='1'||r?.username==='omeko42'||r?.callsign==='omeko42'||String(r?.role_bdb||r?.role||'').toLowerCase().includes('super'))?"Robinopsnal Bareskrim Polri":((l?.scoped&&l?.scope_satker)?toTitleCase(l.scope_satker):"Robinopsnal Bareskrim Polri"),welcomeText=`Selamat datang, ${r?.name||r?.email||"Pengguna"} — ${welcomeSatker}.`;return(0,t.jsxs)("div",{children:[(0,t.jsxs)("div",{className:"dash-head",style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.45rem",flexWrap:"nowrap",marginBottom:"0.35rem"},children:[(0,t.jsxs)("div",{style:{display:"inline-flex",alignItems:"center",gap:"0.4rem",minWidth:0,flex:"1 1 auto",overflow:"hidden"},children:[(0,t.jsx)("h1",{className:"cms-page-title",style:{margin:0,fontSize:"1.05rem",fontWeight:800,whiteSpace:"nowrap"},children:"Ringkasan"}),l?.scoped&&(0,t.jsxs)("span",{className:"dash-scope-badge",style:{fontSize:"0.66rem",padding:"0.1rem 0.45rem",whiteSpace:"nowrap",flexShrink:0},children:[(0,t.jsx)("i",{className:"pi pi-sitemap",style:{fontSize:"0.65rem",marginRight:"0.25rem"}}),abbrSatkerName(l.scope_satker||"Belum ditetapkan",!1)]})]}),(0,t.jsx)("div",{style:{flexShrink:0},children:(0,t.jsx)(g.default,{refreshing:eo,updatedAt:ec,onRefresh:dashForceRefresh})})]}),(0,t.jsxs)("div",{className:"cms-card",style:{marginTop:"0.4rem",padding:"0.5rem 0.65rem",display:"flex",flexWrap:"nowrap",alignItems:"center",gap:"0.38rem"},children:[(0,t.jsxs)("div",{style:{position:"relative",flex:"1 1 auto",minWidth:0},children:[(0,t.jsx)(S.Search,{size:14,style:{position:"absolute",left:"0.58rem",top:"50%",transform:"translateY(-50%)",color:"#94a3b8",pointerEvents:"none"}}),(0,t.jsx)(m.InputText,{id:"dash-global-search",name:"search_global",value:ea,onChange:e=>er(e.target.value),onKeyDown:e=>"Enter"===e.key&&en(),placeholder:"Cari No. LP, nama, atau NIK…",style:{width:"100%",height:"34px",fontSize:"0.75rem",paddingLeft:"1.8rem",paddingRight:"0.5rem"}})]}),(0,t.jsxs)("button",{type:"button",className:"att-btn",onClick:en,disabled:ea.trim().length<5,title:ea.trim().length<5?"Ketik minimal 5 karakter":"Cari",style:{height:"34px",padding:"0 0.6rem",fontSize:"0.74rem",display:"inline-flex",alignItems:"center",gap:"0.28rem",flexShrink:0,whiteSpace:"nowrap"},children:[(0,t.jsx)(S.Search,{size:13}),"Cari"]}),
(0,t.jsxs)("div",{
style:{
  position:"relative",
  flexShrink:0
},
children:[
  (0,t.jsxs)("button",{
    type:"button",
    className:"att-btn",
    onClick:()=>setDashPeriodOpen(v=>!v),
    title:"Periode: "+dashPeriodLabel,
    style:{
      height:"34px",
      padding:"0 0.55rem",
      fontSize:"0.73rem",
      display:"inline-flex",
      alignItems:"center",
      gap:"0.32rem",
      whiteSpace:"nowrap"
    },
    children:[
      (0,t.jsx)("i",{
        className:"pi pi-calendar",
        style:{fontSize:"0.78rem"}
      }),
      (0,t.jsx)("strong",{
        style:{fontSize:"0.73rem"},
        children:dashPeriodLabel
      }),
      (0,t.jsx)("i",{
        className:"pi pi-chevron-down",
        style:{fontSize:"0.6rem"}
      })
    ]
  }),

  dashPeriodOpen&&(0,t.jsxs)("div",{
    style:{
      position:"absolute",
      right:0,
      top:"calc(100% + 0.45rem)",
      zIndex:50,
      width:"25rem",
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
        style:{
          display:"grid",
          gridTemplateColumns:"repeat(3,1fr)",
          gap:"0.4rem",
          marginBottom:"0.75rem"
        },
        children:[
          (0,t.jsx)("button",{
            type:"button",
            className:"att-btn",
            onClick:()=>setDashPeriodMode("month"),
            style:{
              background:"month"===dashPeriodMode?"#eff6ff":"#fff",
              borderColor:"month"===dashPeriodMode?"#93c5fd":"#dbe3ee",
              color:"month"===dashPeriodMode?"#1d4ed8":"#334155"
            },
            children:"Bulan"
          }),

          (0,t.jsx)("button",{
            type:"button",
            className:"att-btn",
            onClick:()=>setDashPeriodMode("year"),
            style:{
              background:"year"===dashPeriodMode?"#eff6ff":"#fff",
              borderColor:"year"===dashPeriodMode?"#93c5fd":"#dbe3ee",
              color:"year"===dashPeriodMode?"#1d4ed8":"#334155"
            },
            children:"Tahun"
          }),

          (0,t.jsx)("button",{
            type:"button",
            className:"att-btn",
            onClick:()=>setDashPeriodMode("custom"),
            style:{
              background:"custom"===dashPeriodMode?"#eff6ff":"#fff",
              borderColor:"custom"===dashPeriodMode?"#93c5fd":"#dbe3ee",
              color:"custom"===dashPeriodMode?"#1d4ed8":"#334155"
            },
            children:"Custom"
          })
        ]
      }),

      "month"===dashPeriodMode&&(0,t.jsxs)("div",{
        style:{
          display:"grid",
          gridTemplateColumns:"1fr 1fr",
          gap:"0.55rem"
        },
        children:[
          (0,t.jsx)(d.Dropdown,{
            id:"dash-period-month",
            inputId:"dash-period-month-select",
            name:"period_month",
            value:dashPeriodMonth,
            options:dashMonthOptions(),
            onChange:e=>setDashPeriodMonth(e.value),
            placeholder:"Bulan",
            style:{width:"100%"}
          }),
          (0,t.jsx)(d.Dropdown,{
            id:"dash-period-year",
            inputId:"dash-period-year-select",
            name:"period_year",
            value:dashPeriodYear,
            options:dashYearOptions(),
            onChange:e=>setDashPeriodYear(e.value),
            placeholder:"Tahun",
            style:{width:"100%"}
          })
        ]
      }),

      "year"===dashPeriodMode&&(0,t.jsx)(d.Dropdown,{
        id:"dash-period-year-single",
        inputId:"dash-period-year-single-select",
        name:"period_year_single",
        value:dashPeriodYear,
        options:dashYearOptions(),
        onChange:e=>setDashPeriodYear(e.value),
        placeholder:"Tahun",
        style:{width:"100%"}
      }),

      "custom"===dashPeriodMode&&(0,t.jsxs)("div",{
        style:{
          display:"grid",
          gridTemplateColumns:"1fr auto 1fr",
          alignItems:"center",
          gap:"0.45rem"
        },
        children:[
          (0,t.jsx)(m.InputText,{
            id:"dash-custom-from",
            name:"date_from",
            type:"date",
            value:q,
            onChange:e=>G(e.target.value),
            style:{width:"100%"}
          }),
          (0,t.jsx)("span",{
            style:{color:"#94a3b8"},
            children:"–"
          }),
          (0,t.jsx)(m.InputText,{
            id:"dash-custom-to",
            name:"date_to",
            type:"date",
            value:Z,
            onChange:e=>Q(e.target.value),
            style:{width:"100%"}
          })
        ]
      }),

      (0,t.jsxs)("div",{
        style:{
          display:"flex",
          justifyContent:"space-between",
          gap:"0.5rem",
          marginTop:"0.85rem",
          paddingTop:"0.7rem",
          borderTop:"1px solid #e2e8f0"
        },
        children:[
          (0,t.jsx)("button",{
            type:"button",
            className:"att-btn",
            onClick:dashResetPeriod,
            children:"Reset"
          }),

          (0,t.jsx)("button",{
            type:"button",
            className:"att-btn",
            disabled:
              "custom"===dashPeriodMode&&
              (!q||!Z||q>Z),
            onClick:dashApplyPeriod,
            style:{
              background:"#2563eb",
              borderColor:"#2563eb",
              color:"#fff"
            },
            children:"Terapkan"
          })
        ]
      })
    ]
  })
]
})]}),(0,t.jsxs)("div",{
  className:"cms-card",
  style:{
    marginTop:"1rem",
    padding:"1rem 1.15rem",
    borderRadius:"12px",
    border:"1px solid var(--cas-border, rgba(255,255,255,0.1))",
    background:"var(--cas-bg-card, #1e293b)",
    boxShadow:"0 2px 10px rgba(0,0,0,0.1)",
    maxWidth:"100%",
    boxSizing:"border-box",
    overflow:"hidden"
  },
  children:[
    // Header
    (0,t.jsxs)("div",{
      style:{
        display:"flex",
        justifyContent:"space-between",
        alignItems:"center",
        marginBottom:"0.75rem",
        paddingBottom:"0.6rem",
        borderBottom:"1px solid rgba(255,255,255,0.06)"
      },
      children:[
        (0,t.jsxs)("div",{
          style:{display:"flex",alignItems:"center",gap:"0.5rem"},
          children:[
            (0,t.jsx)("i",{className:"pi pi-bolt",style:{fontSize:"0.95rem",color:"#2563eb"}}),
            (0,t.jsx)("span",{
              style:{fontWeight:800,fontSize:"0.95rem",color:"var(--cas-text-primary, #f8fafc)"},
              children:"Sharese"
            }),
            (0,t.jsx)("span",{
              style:{fontSize:"0.68rem",background:"rgba(56,189,248,0.15)",color:"#38bdf8",padding:"0.1rem 0.5rem",borderRadius:"999px",fontWeight:700},
              children:"Terkini"
            })
          ]
        }),
        (0,t.jsxs)("button",{
          type:"button",
          onClick:()=>e.push("/cms/broadcaster"),
          style:{background:"transparent",border:"none",color:"#38bdf8",fontSize:"0.8rem",fontWeight:700,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"0.3rem"},
          children:["Buka Sharese ➔"]
        })
      ]
    }),

    // Body: Exactly 5 compact rows with ellipsis and click navigation
    casFeedLoading ? (
      (0,t.jsx)("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem",padding:"0.35rem 0.5rem"},children:[1,2,3,4,5].map(i=>(
        (0,t.jsxs)("div",{key:i,style:{display:"flex",alignItems:"center",gap:"0.65rem",padding:"0.45rem 0.6rem",borderRadius:"6px",background:"rgba(255, 255, 255, 0.02)"},children:[
          (0,t.jsx)("div",{className:"cas-skeleton-shimmer",style:{width:"28px",height:"28px",borderRadius:"50%",flexShrink:0}}),
          (0,t.jsxs)("div",{style:{flex:1,display:"flex",flexDirection:"column",gap:"0.3rem"},children:[
            (0,t.jsx)("div",{className:"cas-skeleton-shimmer",style:{width:i%2===0?"75%":"90%",height:"11px",borderRadius:"4px"}}),
            (0,t.jsx)("div",{className:"cas-skeleton-shimmer",style:{width:"40%",height:"9px",borderRadius:"3px"}})
          ]}),
          (0,t.jsx)("div",{className:"cas-skeleton-shimmer",style:{width:"35px",height:"10px",borderRadius:"3px"}})
        ]})
      ))})
    ) : casFeed.length === 0 ? (
      (0,t.jsxs)("div",{
        style:{padding:"0.8rem",textAlign:"center",color:"#94a3b8",fontSize:"0.82rem",display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem"},
        children:[
          (0,t.jsx)("span",{children:"📭"}),
          (0,t.jsx)("span",{children:"Belum ada informasi baru di Sharese."}),
          (0,t.jsx)("button",{
            type:"button",
            onClick:()=>e.push("/cms/broadcaster"),
            style:{background:"transparent",border:"none",color:"#38bdf8",fontWeight:700,cursor:"pointer",textDecoration:"underline",fontSize:"0.82rem"},
            children:"Mulai Buat Postingan"
          })
        ]
      })
    ) : (
      (0,t.jsx)("div",{
        style:{display:"flex",flexDirection:"column",gap:"0.4rem"},
        children:casFeed.slice(0, 5).map(item => {
          let isUserOne = String(item.author_id) === '1' || ['omeko42', 'omeko11', 'om.eko_42', 'om.eko_11'].includes(String(item.author_username || '').toLowerCase()) || ['omeko42', 'omeko11', 'om.eko_42', 'om.eko_11'].includes(String(item.author_callsign || '').toLowerCase().replace(/^@/, ''));
          let isSuper = isUserOne || String(item.author_role || '').toLowerCase() === 'superadmin';
          let roleStr = String(item.author_role || '').toLowerCase();
          let callsign = (function() {
            let idStr = String(item.author_id || '');
            /* dynamic handle */
            let c = String(item.author_callsign || '').trim().replace(/^@/, '');
            let invalid = ['personil', 'null', 'undefined', 'admin', 'user', 'none', '-', 'anak_serse'];
            if (c && !invalid.includes(c.toLowerCase()) && !c.startsWith('user_')) return '@' + c;
            let u = String(item.author_username || '').trim().replace(/^@/, '');
            if (u && !invalid.includes(u.toLowerCase()) && !u.startsWith('user_')) return '@' + u;
            if (c && !invalid.includes(c.toLowerCase())) return '@' + c;
            let seed = idStr || 'polri';
            let num = 0;
            for (let i = 0; i < seed.length; i++) num = (num * 31 + seed.charCodeAt(i)) % 100000;
            let code = Math.abs((num * 9301 + 49297) % 65536).toString(16).padStart(4, '0');
            return '@user_' + (idStr || '0') + code;
          })();
          let bColor = isSuper ? '#f59e0b' : ((roleStr === 'admin_binops' || roleStr === 'binops' || roleStr === 'admin binops') ? '#6366f1' : ((roleStr === 'operator') ? '#0095f6' : '#64748b'));
          let bTitle = isSuper ? 'Superadmin Terverifikasi' : ((roleStr === 'admin_binops' || roleStr === 'binops' || roleStr === 'admin binops') ? 'Admin Binops Terverifikasi' : ((roleStr === 'operator') ? 'Operator Satker Terverifikasi' : 'Personel Terverifikasi'));
          let satker = isUserOne ? 'Robinopsnal Bareskrim Polri' : toTitleCase(item.author_satker || item.satker_name || item.satker || item.satker_singkat || item.satker_nama || 'Mabes Bareskrim');
          let timeStr = item.created_at ? new Date(item.created_at).toLocaleDateString("id-ID", { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' }) : 'Baru saja';
          return (0,t.jsxs)("div",{
            key:item.id,
            onClick:()=>e.push("/cms/broadcaster"),
            title:"Klik untuk membuka postingan ini di Sharese",
            style:{
              display:"flex",
              flexDirection:"column",
              gap:"0.32rem",
              padding:"0.55rem 0.75rem",
              borderRadius:"8px",
              background:"rgba(255,255,255,0.02)",
              border:"1px solid rgba(255,255,255,0.05)",
              cursor:"pointer",
              fontSize:"0.82rem",
              maxWidth:"100%",
              boxSizing:"border-box",
              overflow:"hidden",
              transition:"background 0.15s ease"
            },
            onMouseEnter:ev => ev.currentTarget.style.background = "rgba(255,255,255,0.05)",
            onMouseLeave:ev => ev.currentTarget.style.background = "rgba(255,255,255,0.02)",
            children:[
              // Top row: Author & satker on left, reactions & time on right
              (0,t.jsxs)("div",{
                style:{
                  display:"flex",
                  alignItems:"center",
                  justifyContent:"space-between",
                  gap:"0.5rem",
                  width:"100%",
                  minWidth:0
                },
                children:[
                  (0,t.jsxs)("div",{
                    style:{display:"inline-flex",alignItems:"center",gap:"0.35rem",minWidth:0,flex:"1 1 auto",overflow:"hidden"},
                    children:[
                      (0,t.jsx)("span",{style:{fontWeight:800,color:"#38bdf8",whiteSpace:"nowrap",flexShrink:0},children:callsign}),
                      (0,t.jsx)("span",{
                        title:bTitle,
                        style:{display:"inline-flex",alignItems:"center",justifyContent:"center",flexShrink:0,lineHeight:1},
                        children:[
                          (0,t.jsxs)("svg",{viewBox:"0 0 24 24",width:15,height:15,children:[
                            (0,t.jsx)("path",{d:"M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34z",fill:bColor}),
                            (0,t.jsx)("path",{d:"M9.5 12.5l2 2 4.5-4.5",stroke:"#ffffff",strokeWidth:2.4,strokeLinecap:"round",strokeLinejoin:"round",fill:"none"})
                          ]})
                        ]
                      }),
                      (0,t.jsx)("span",{
                        style:{
                          fontSize:"0.68rem",
                          background:"rgba(148,163,184,0.14)",
                          color:"var(--cas-text-secondary, #cbd5e1)",
                          padding:"0.05rem 0.45rem",
                          borderRadius:"4px",
                          maxWidth:"none",
                          flex:"0 1 auto",
                          minWidth:0,
                          overflow:"hidden",
                          textOverflow:"ellipsis",
                          whiteSpace:"nowrap"
                        },
                        children:satker
                      })
                    ]
                  }),
                  (0,t.jsxs)("div",{
                    style:{display:"inline-flex",alignItems:"center",gap:"0.45rem",flexShrink:0,color:"var(--cas-text-secondary, #94a3b8)",fontSize:"0.72rem"},
                    children:[
                      Boolean(item.total_reactions > 0) && (0,t.jsxs)("span",{style:{color:"#38bdf8",fontWeight:700,display:"inline-flex",alignItems:"center",gap:"0.2rem",fontSize:"0.72rem"},children:["👍 ", item.total_reactions]}),
                      (0,t.jsx)("span",{style:{whiteSpace:"nowrap"},children:timeStr}),
                      (0,t.jsx)("span",{style:{color:"#60a5fa",fontWeight:800},children:"➔"})
                    ]
                  })
                ]
              }),
              // Content row: Truncated without spilling out of card on mobile
              (0,t.jsx)("div",{
                style:{
                  width:"100%",
                  minWidth:0,
                  overflow:"hidden",
                  textOverflow:"ellipsis",
                  whiteSpace:"nowrap",
                  color:"var(--cas-text-primary, #e2e8f0)",
                  fontSize:"0.82rem",
                  lineHeight:1.4
                },
                children:item.content || item.title || "-"
              })
            ]
          });
        })
      })
    )
  ]
}),eh?(0,t.jsxs)("div",{className:"cms-card",style:{marginTop:"1rem",display:"flex",alignItems:"flex-start",gap:"0.7rem"},children:[(0,t.jsx)("i",{className:"pi pi-info-circle",style:{color:"#f59e0b",marginTop:"0.15rem"}}),(0,t.jsxs)("div",{style:{color:"#64748b"},children:["Akun Anda ",(0,t.jsx)("strong",{children:"belum ditetapkan ke satker"}),". Hubungi admin untuk menetapkan lingkup satker agar data Ringkasan & Anev CT/CC muncul."]})]}):(0,t.jsxs)(t.Fragment,{children:[ef&&(0,t.jsxs)("div",{className:"cms-card",style:{marginTop:"1rem",display:"flex",alignItems:"flex-start",gap:"0.7rem",borderLeft:"4px solid #f59e0b"},children:[(0,t.jsx)("i",{className:"pi pi-info-circle",style:{color:"#f59e0b",marginTop:"0.15rem"}}),(0,t.jsxs)("div",{style:{color:"#64748b"},children:["Belum ada Laporan Polisi pada satker ",(0,t.jsx)("strong",{children:l?.scope_satker}),". Struktur data di bawah ditampilkan sebagai acuan — angka akan terisi begitu ada LP."]})]}),(0,t.jsx)("div",{className:"dash-section",children:(0,t.jsxs)("div",{className:"dash-hero-grid",children:[(0,t.jsx)(D,{id:"fld-dashboard-perma-31-1",name:"field_dashboard_perma_31_1",label:"CT — Crime Total",value:J?"…":z(i?.ct??0),color:"#ef4444",bg:"#fef2f2",icon:"pi-file",note:"Sesuai Kinerja Perkara"}),(0,t.jsx)(D,{id:"fld-dashboard-perma-31-2",name:"field_dashboard_perma_31_2",label:"CC — Crime Clearance",value:J?"…":z((i?.cc_aktual??0)+(i?.cc_tunggakan??0)),color:"#16a34a",bg:"#f0fdf4",icon:"pi-check-circle",note:"CC Aktual + CC Tunggakan"}),(0,t.jsx)(D,{id:"fld-dashboard-perma-31-3",name:"field_dashboard_perma_31_3",label:"CR - Clearance Rate",value:J?"…":`${(i?.cr??0).toFixed(2)}%`,color:"#2563eb",bg:"#eff6ff",icon:"pi-percentage",note:"Rumus baru Kinerja Perkara"})]})}),i&&(0,t.jsxs)("div",{className:"dash-section cms-card dash-panel-clickable",onClick:()=>e.push("/cms/report/kinerja-perkara"),children:[(0,t.jsxs)("div",{className:"dash-panel-head",style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.5rem"},children:[(0,t.jsxs)("div",{className:"dash-panel-head-left",children:[(0,t.jsx)("span",{className:"dash-icon-badge",style:{background:"#f5f3ff"},children:(0,t.jsx)(y.Gauge,{size:17,style:{color:"#7c3aed"}})}),(0,t.jsxs)("div",{style:{minWidth:0},children:[(0,t.jsxs)("div",{className:"dash-panel-title",style:{display:"flex",alignItems:"center",gap:"0.4rem",flexWrap:"wrap"},children:["Kinerja Perkara",(0,t.jsx)("span",{style:{fontSize:"0.66rem",fontWeight:800,padding:"0.1rem 0.5rem",borderRadius:999,background:i.scoped?"#eff6ff":"#f0fdf4",color:i.scoped?"#1d4ed8":"#15803d",border:`1px solid ${i.scoped?"#bfdbfe":"#bbf7d0"}`},title:i.scoped?"Data dibatasi hanya untuk satker Anda.":"Data mencakup seluruh satker (akses lihat-semua).",children:i.scoped?`Satker: ${abbrSatkerName(l?.scope_satker||"Anda",!1)}`:"Nasional"})]}),(0,t.jsxs)("div",{className:"dash-panel-sub",children:["Periode ",i.from," s/d ",i.to]})]})]})]}),(0,t.jsxs)("div",{className:"dash-integrasi-grid",children:[(0,t.jsx)(A,{id:"fld-dashboard-perma-31-4",name:"field_dashboard_perma_31_4",label:"CP Aktual",value:z(i.cp_berjalan),title:"Perkara masih diproses, belum lewat jatuh tempo."}),(0,t.jsx)(A,{id:"fld-dashboard-perma-31-5",name:"field_dashboard_perma_31_5",label:"CP Tunggakan",value:z(i.cp_tunggakan),title:"Perkara masih diproses, sudah lewat jatuh tempo."}),(0,t.jsx)(A,{id:"fld-dashboard-perma-31-6",name:"field_dashboard_perma_31_6",label:"PR (Lama)",value:`${(i.pr_lama??0).toFixed(2)}%`,title:"PR Lama = (CP Aktual + CP Tunggakan) / CT × 100%"}),(0,t.jsx)(A,{id:"fld-dashboard-perma-31-7",name:"field_dashboard_perma_31_7",label:"PR (Baru)",value:`${(i.pr??0).toFixed(2)}%`,title:"PR Baru = (CP Aktual + CP Tunggakan) / (CT + CP Tunggakan) × 100%"}),(0,t.jsx)(A,{id:"fld-dashboard-perma-31-8",name:"field_dashboard_perma_31_8",label:"CC Aktual",value:z(i.cc_aktual),title:"Perkara selesai sebelum/tepat jatuh tempo."}),(0,t.jsx)(A,{id:"fld-dashboard-perma-31-9",name:"field_dashboard_perma_31_9",label:"CC Tunggakan",value:z(i.cc_tunggakan),title:"Perkara selesai setelah lewat jatuh tempo."}),(0,t.jsx)(A,{id:"fld-dashboard-perma-31-10",name:"field_dashboard_perma_31_10",label:"CR (Lama)",value:`${(i.cr_lama??0).toFixed(2)}%`,title:"CR Lama = CC / (CT + CC) × 100% -- formula modul Anev CT/CC."}),(0,t.jsx)(A,{id:"fld-dashboard-perma-31-11",name:"field_dashboard_perma_31_11",label:"CR (Baru)",value:`${(i.cr??0).toFixed(2)}%`,title:"Clearance Rate = (CC Aktual + CC Tunggakan) / (CT + CC Tunggakan) × 100%"}),(0,t.jsx)(A,{id:"fld-dashboard-perma-31-12",name:"field_dashboard_perma_31_12",label:"Indeks Kinerja",value:(0,t.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.45rem",whiteSpace:"nowrap"},children:[(0,t.jsx)("strong",{style:{fontSize:"1.25rem",lineHeight:1,fontWeight:850,color:"var(--cas-text-primary, #f1f5f9)"},children:(i.indeks??0).toLocaleString("id-ID",{minimumFractionDigits:2,maximumFractionDigits:2})}),(0,t.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",padding:"0.24rem 0.48rem",borderRadius:"0.55rem",background:["#ef4444","#f97316","#eab308","#22c55e","#15803d"][Math.max(0,Math.min(4,(i.level??1)-1))],color:"#fff",fontSize:"0.66rem",lineHeight:1,fontWeight:800},children:["Lv.",i.level??"-"]})]}),title:"Indeks Kinerja dan Level 1–5 dihitung dari CR Baru."})]})]}),(0,t.jsxs)("div",{className:"dash-section",style:{display:"flex",flexWrap:"wrap",gap:"1rem",alignItems:"stretch"},children:[(0,t.jsxs)("div",{className:"cms-card",style:{flex:"3 1 32rem",minWidth:0,margin:0,display:"flex",flexDirection:"column",justifyContent:"space-between"},children:[(0,t.jsx)(O,{id:"fld-dashboard-perma-31-13",name:"field_dashboard_perma_31_13",icon:(0,t.jsx)("i",{className:"pi pi-chart-line"}),title:"Profil Risiko Kejahatan",iconBg:"#f5f3ff",iconColor:"#7c3aed"}),(0,t.jsxs)("div",{
className:"dash-integrasi-grid",
style:{gridTemplateColumns:"repeat(auto-fit, minmax(9.5rem, 1fr))"},
children:[

(0,t.jsxs)("div",{
className:"dash-minicard",
style:{cursor:"help"},
title:"Jumlah penduduk pada cakupan satker terpilih.",
children:[
(0,t.jsxs)("div",{
style:{
display:"flex",
alignItems:"center",
justifyContent:"space-between",
gap:"0.28rem",
fontSize:"0.7rem",
fontWeight:700,
color:"#94a3b8",
textTransform:"uppercase",
letterSpacing:"0.03em",
lineHeight:1.25
},
children:[(0,t.jsx)("span",{children:"Jumlah Penduduk"}),renderKpInfoIcon(12)]
}),
(0,t.jsx)("div",{
style:{
fontSize:"1.2rem",
fontWeight:800,
color:"inherit",
marginTop:"0.25rem",
lineHeight:1.2
},
children:i?.jumlah_penduduk
?z(i.jumlah_penduduk)
:"Belum Ada Data"
}),
(0,t.jsx)("div",{
style:{
fontSize:"0.7rem",
fontWeight:650,
color:"var(--cas-text-secondary, #cbd5e1)",
marginTop:"0.15rem",
lineHeight:1.25
},
children:"Orang"
})
]
}),

(0,t.jsxs)("div",{
className:"dash-minicard",
style:{cursor:"help"},
title:`Crime Rate = (CT / Jumlah Penduduk) × 100.000${i?.jumlah_penduduk?` — dari ${z(i.jumlah_penduduk)} penduduk`:" — data penduduk belum tersedia"}.`,
children:[
(0,t.jsxs)("div",{
style:{
display:"flex",
alignItems:"center",
justifyContent:"space-between",
gap:"0.28rem",
fontSize:"0.7rem",
fontWeight:700,
color:"#94a3b8",
textTransform:"uppercase",
letterSpacing:"0.03em",
lineHeight:1.25
},
children:[(0,t.jsx)("span",{children:"Tingkat Risiko Kejahatan"}),renderKpInfoIcon(12)]
}),
(0,t.jsx)("div",{
style:{
fontSize:"1.2rem",
fontWeight:800,
color:"inherit",
marginTop:"0.25rem",
lineHeight:1.2
},
children:null!=i?.crime_rate
?`${z(i.crime_rate)} Orang`
:"Belum Ada Data"
}),
(0,t.jsx)("div",{
style:{
fontSize:"0.7rem",
fontWeight:650,
color:"var(--cas-text-secondary, #cbd5e1)",
marginTop:"0.15rem",
lineHeight:1.25
},
children:"Berisiko menjadi korban kejahatan"
})
]
}),

(0,t.jsxs)("div",{
className:"dash-minicard",
style:{cursor:"help"},
title:`Crime Clock = Total Detik dalam Periode (${i?.periode_hari_inklusif?`${i.periode_hari_inklusif} hari`:"periode berjalan"}) / CT.`,
children:[
(0,t.jsxs)("div",{
style:{
display:"flex",
alignItems:"center",
justifyContent:"space-between",
gap:"0.28rem",
fontSize:"0.7rem",
fontWeight:700,
color:"#94a3b8",
textTransform:"uppercase",
letterSpacing:"0.03em",
lineHeight:1.25
},
children:[(0,t.jsx)("span",{children:"Indeks Waktu Kejahatan"}),renderKpInfoIcon(12)]
}),
(0,t.jsx)("div",{
style:{
fontSize:"1.2rem",
fontWeight:800,
color:"inherit",
marginTop:"0.25rem",
lineHeight:1.2
},
children:i?.crime_clock
?i.crime_clock.label
:"Belum Ada Data"
}),
(0,t.jsx)("div",{
style:{
fontSize:"0.7rem",
fontWeight:650,
color:"var(--cas-text-secondary, #cbd5e1)",
marginTop:"0.15rem",
lineHeight:1.25
},
children:"Rata-rata selang waktu terjadi kejahatan"
})
]
})

]
})]}),(0,t.jsxs)("div",{className:"cms-card",style:{flex:"2 1 21rem",minWidth:0,margin:0,display:"flex",flexDirection:"column",justifyContent:"space-between"},children:[(0,t.jsx)(O,{id:"fld-dashboard-perma-31-14",name:"field_dashboard_perma_31_14",icon:(0,t.jsx)("i",{className:"pi pi-calendar"}),title:"Aktivitas Hari Ini",iconBg:"#eff6ff",iconColor:"#2563eb"}),(0,t.jsxs)("div",{className:"dash-today-grid",style:{display:"grid",gridTemplateColumns:"repeat(2, minmax(0, 1fr))",gap:"0.55rem",margin:0},children:[(0,t.jsxs)("div",{className:"dash-today-card ct",title:"Jumlah Laporan Polisi yang masuk hari ini",style:{padding:"0.65rem 0.8rem",minWidth:0,display:"flex",flexDirection:"column",justifyContent:"space-between"},children:[(0,t.jsxs)("div",{className:"t",style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.3rem",fontSize:"0.72rem",fontWeight:800},children:[(0,t.jsx)("span",{children:"CT Hari Ini"}),renderKpInfoIcon(12)]}),(0,t.jsx)("div",{className:"v",style:{fontSize:"1.32rem",fontWeight:850,marginTop:"0.22rem",lineHeight:1.15},children:J?"…":z(l?.ct_today??0)}),(0,t.jsx)("div",{className:"s",style:{fontSize:"0.68rem",marginTop:"0.18rem"},children:"Laporan Polisi masuk hari ini"})]}),(0,t.jsxs)("div",{className:"dash-today-card cc",title:"Jumlah perkara selesai (Crime Clearance) hari ini",style:{padding:"0.65rem 0.8rem",minWidth:0,display:"flex",flexDirection:"column",justifyContent:"space-between"},children:[(0,t.jsxs)("div",{className:"t",style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.3rem",fontSize:"0.72rem",fontWeight:800},children:[(0,t.jsx)("span",{children:"CC Hari Ini"}),renderKpInfoIcon(12)]}),(0,t.jsx)("div",{className:"v",style:{fontSize:"1.32rem",fontWeight:850,marginTop:"0.22rem",lineHeight:1.15},children:J?"…":z(l?.cc_today??0)}),(0,t.jsx)("div",{className:"s",style:{fontSize:"0.68rem",marginTop:"0.18rem"},children:"Perkara selesai hari ini"})]})]})]})]}),(0,t.jsxs)("div",{className:"dash-section",children:[(0,t.jsx)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.5rem",marginBottom:"0.45rem"},children:(0,t.jsxs)("div",{className:"dash-panel-head-left",children:[(0,t.jsx)("span",{className:"dash-icon-badge",style:{background:"#f8fafc",color:"#64748b"},children:(0,t.jsx)("i",{className:"pi pi-list"})}),(0,t.jsx)("div",{className:"dash-panel-title",children:"Rincian Status LP"})]})}),(0,t.jsx)("div",{className:"lp-status-cards",style:{margin:0,gridTemplateColumns:"repeat(auto-fit,minmax(8.25rem,1fr))"},children:(l?.per_status||[]).map(e=>{let a,shortLbl="PERMA"===e.code?"PERMA":_[a=e.code]||a.replace(/_/g," "),numStr=z(e.jumlah),isSel=dashStatTip?.code===e.code;return(0,t.jsxs)("button",{type:"button",onClick:()=>setDashStatTip(isSel?null:{code:e.code,nama:e.nama||shortLbl,jumlah:numStr,kategori:e.kategori||"CT"}),className:`lp-stat ${"CC"===e.kategori?"cc":"ct"}${isSel?" active":""}`,title:`${e.nama||shortLbl}: ${numStr} LP (${"CC"===e.kategori?"Crime Clearance / CC":"Crime Total / CT"})`,style:{cursor:"pointer",textAlign:"left"},children:[(0,t.jsx)("div",{className:"lp-stat-head",style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.2rem",width:"100%"},children:(0,t.jsx)("span",{className:"l",style:{margin:0,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:shortLbl})}),(0,t.jsx)("div",{className:"n",children:numStr})]},e.code)})}),dashStatTip&&(0,t.jsxs)("div",{onClick:()=>setDashStatTip(null),style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.5rem",padding:"0.3rem 0.65rem",marginTop:"0.38rem",borderRadius:7,fontSize:"0.74rem",background:dashStatTip.kategori==="CC"?"rgba(22,163,74,0.12)":"rgba(239,68,68,0.12)",border:"1px solid "+(dashStatTip.kategori==="CC"?"rgba(22,163,74,0.3)":"rgba(239,68,68,0.3)"),color:"var(--cas-text-primary, #0f172a)",cursor:"pointer"},children:[(0,t.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.4rem",flexWrap:"wrap"},children:[renderKpInfoIcon(13),(0,t.jsx)("strong",{children:dashStatTip.nama}),(0,t.jsx)("span",{style:{opacity:0.7},children:"\u2022"}),(0,t.jsxs)("strong",{style:{color:dashStatTip.kategori==="CC"?"#16a34a":"#ef4444",fontSize:"0.8rem"},children:[dashStatTip.jumlah," LP"]})]}),(0,t.jsx)("span",{style:{fontSize:"0.72rem",opacity:0.7,fontWeight:700},children:"\u2715"})]})]}),(0,t.jsxs)("div",{className:"dash-section cms-card",style:{minWidth:0,overflow:"hidden"},children:[(0,t.jsxs)("div",{className:"dash-panel-head",children:[(0,t.jsxs)("div",{className:"dash-panel-head-left",style:{cursor:"help"},title:P[F],children:[(0,t.jsx)("span",{className:"dash-icon-badge",style:{background:"#eff6ff"},children:(0,t.jsx)("i",{className:"pi pi-chart-bar",style:{color:"#2563eb"}})}),(0,t.jsxs)("div",{className:"dash-panel-title",children:[T.find(e=>e.value===F)?.label,l?.scoped?" Lingkup Wilayah":" per Polda"]})]}),(0,t.jsx)(d.Dropdown,{id:"dash-filter-satker",inputId:"dash-filter-satker-select",name:"filter_satker",value:F,options:T,onChange:e=>K(e.value),style:{minWidth:"17rem",fontSize:"0.8rem"}})]}),J?(0,t.jsx)("span",{style:{color:"#94a3b8"},children:"Memuat…"}):0===(em.labels||[]).length?(0,t.jsxs)("span",{style:{color:"#94a3b8"},children:["Belum ada data","crime_rate"===F?" (jumlah penduduk belum diisi)":"","."]}):(0,t.jsx)("div",{style:{height:"22rem"},children:(0,t.jsx)(c,{id:"fld-dashboard-perma-31-16",name:"field_dashboard_perma_31_16",type:"bar",data:em,options:ep,style:{height:"100%"}})})]}),(0,t.jsxs)("div",{className:"dash-section dash-grid",style:{alignItems:"stretch"},children:[(0,t.jsxs)("div",{className:"cms-card",style:{minWidth:0,display:"flex",flexDirection:"column",height:"100%"},children:[(0,t.jsx)("div",{className:"cms-card-label",style:{marginBottom:"0.85rem",minHeight:"1.5rem",display:"flex",alignItems:"center",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},title:l?.label_kejahatan||(l?.scoped?(l?.is_nasional||l?.regional_nama?.includes("Nasional")?"10 Kejahatan Nasional · Tertinggi":"10 Kejahatan Regional · Tertinggi"):"10 Kejahatan Tertinggi"),children:l?.label_kejahatan||(l?.scoped?(l?.is_nasional||l?.regional_nama?.includes("Nasional")?"10 Kejahatan Nasional · Tertinggi":"10 Kejahatan Regional · Tertinggi"):"10 Kejahatan Tertinggi")}),(0,t.jsx)(E,{id:"fld-dashboard-perma-31-17",name:"field_dashboard_perma_31_17",rows:(l?.top_kejahatan||[]).map(e=>({nama:e.nama,value:e.jml,totalOverride:(l?.scoped&&l?.regional_ct)?l.regional_ct:(l?.ct||0)})),loading:J,total:(l?.scoped&&l?.regional_ct)?l.regional_ct:(l?.ct||0)})]}),(0,t.jsxs)("div",{className:"cms-card",style:{minWidth:0,display:"flex",flexDirection:"column",height:"100%"},children:[(0,t.jsx)("div",{className:"cms-card-label",style:{marginBottom:"0.85rem",minHeight:"1.5rem",display:"flex",alignItems:"center",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},title:l?.label_satker_ct||(l?.scoped?(l?.is_nasional||l?.regional_nama?.includes("Nasional")?"10 Satker · CT Tertinggi":"10 Satker Regional · CT Tertinggi"):"10 Satker · CT Tertinggi"),children:l?.label_satker_ct||(l?.scoped?(l?.is_nasional||l?.regional_nama?.includes("Nasional")?"10 Satker · CT Tertinggi":"10 Satker Regional · CT Tertinggi"):"10 Satker · CT Tertinggi")}),(0,t.jsx)(L,{id:"fld-dashboard-perma-31-18",name:"field_dashboard_perma_31_18",rows:(l?.top_satker_ct||[]).map(e=>({nama:e.nama,value:e.ct})),loading:J,color:"#ef4444",suffix:"LP"})]}),(0,t.jsxs)("div",{className:"cms-card",style:{minWidth:0,display:"flex",flexDirection:"column",height:"100%"},children:[(0,t.jsx)("div",{className:"cms-card-label",style:{marginBottom:"0.85rem",minHeight:"1.5rem",display:"flex",alignItems:"center",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},title:l?.label_satker_cc||(l?.scoped?(l?.is_nasional||l?.regional_nama?.includes("Nasional")?"10 Satker · CC Tertinggi":"10 Satker Regional · CC Tertinggi"):"10 Satker · CC Tertinggi"),children:l?.label_satker_cc||(l?.scoped?(l?.is_nasional||l?.regional_nama?.includes("Nasional")?"10 Satker · CC Tertinggi":"10 Satker Regional · CC Tertinggi"):"10 Satker · CC Tertinggi")}),(0,t.jsx)(L,{id:"fld-dashboard-perma-31-19",name:"field_dashboard_perma_31_19",rows:(l?.top_satker_cc||[]).map(e=>({nama:e.nama,value:e.cc})),loading:J,color:"#16a34a",suffix:"LP",empty:"Belum ada perkara selesai (CC)."})]})]}),(0,t.jsxs)("div",{className:"dash-section",children:[(0,t.jsx)(O,{id:"fld-dashboard-perma-31-20",name:"field_dashboard_perma_31_20",icon:(0,t.jsx)(b.AlertTriangle,{size:15}),title:"Sorotan",iconBg:"#fffbeb",iconColor:"#d97706"}),(0,t.jsxs)("div",{className:"dash-grid",style:{marginTop:0,alignItems:"stretch",gridTemplateColumns:"repeat(auto-fit, minmax(21rem, 1fr))",gap:"1rem"},children:[(0,t.jsx)(M,{title:(0,t.jsxs)("span",{style:{display:"inline-flex",alignItems:"center",gap:"0.35rem",minWidth:0,whiteSpace:"nowrap"},children:[(0,t.jsx)("span",{role:"button",tabIndex:0,onClick:ev=>{ev.stopPropagation();e.push("/cms/laporan/kasus-atensi/lihat")},style:{cursor:"pointer",color:"inherit",transition:"color .15s,text-decoration .15s"},onMouseEnter:ev=>{ev.currentTarget.style.color="#d97706";ev.currentTarget.style.textDecoration="underline"},onMouseLeave:ev=>{ev.currentTarget.style.color="inherit";ev.currentTarget.style.textDecoration="none"},title:"Buka Kasus Atensi",children:"Kasus Atensi"}),(0,t.jsx)("span",{style:{color:"var(--cas-text-muted, #94a3b8)",fontWeight:400,userSelect:"none"},children:"/"}),(0,t.jsx)("span",{role:"button",tabIndex:0,onClick:ev=>{ev.stopPropagation();e.push("/cms/laporan/kasus-menonjol/lihat")},style:{cursor:"pointer",color:"inherit",transition:"color .15s,text-decoration .15s"},onMouseEnter:ev=>{ev.currentTarget.style.color="#d97706";ev.currentTarget.style.textDecoration="underline"},onMouseLeave:ev=>{ev.currentTarget.style.color="inherit";ev.currentTarget.style.textDecoration="none"},title:"Buka Kasus Menonjol",children:"Menonjol"})]}),icon:(0,t.jsx)("span",{style:{display:"inline-flex",alignItems:"center",justifyContent:"center",width:"1.65rem",height:"1.65rem",borderRadius:"6px",background:"rgba(245, 158, 11, 0.12)",color:"#f59e0b",flexShrink:0},children:(0,t.jsx)(b.AlertTriangle,{size:14})}),emptyText:J?"Memuat…":"Belum ada kasus atensi/menonjol.",onLihatSemua:()=>e.push("/cms/laporan/kasus-menonjol/lihat"),items:[...u.map(e=>{let isoTgl=(function(v){if(!v)return"";let s=String(v).trim().slice(0,10);if(/^\d{2}-\d{2}-\d{4}$/.test(s)){let p=s.split("-");return p[2]+"-"+p[1]+"-"+p[0]}return s})(e.effective_date||e.tanggal_rilis||e.first_tgl_laporan||e.created_at);return{id:`menonjol:${e.id}`,_kind:"menonjol",_pinned:Boolean(e.is_pinned),_pinned_at:e.pinned_at||"",_skala:e.skala_viral,_tgl_rilis:e.tanggal_rilis,_tgl:isoTgl,_no_lp:e.first_no_laporan||"",_depth:null==e.satker_depth?999:Number(e.satker_depth),_lp:Number(e.jumlah_lp||0),_rilis:!!e.rilis,_created:e.created_at||e.tanggal_rilis||"",judul:e.judul,viral:"tidak viral"===e.skala_viral?"Tidak Viral":"Viral",viralSeverity:"tidak viral"===e.skala_viral?"secondary":"danger",tag:"nasional"===e.skala_viral?"Nasional":"regional"===e.skala_viral?"Regional":void 0,tagVariant:"nasional"===e.skala_viral?"danger":"warning",status:e.rilis?"Sudah Rilis":"Belum Rilis",statusVariant:e.rilis?"success":"neutral",tanggal:I(e.tanggal_rilis||e.first_tgl_laporan||e.created_at),lpInfo:Number(e.jumlah_lp||0)>1?`${Number(e.jumlah_lp)} LP`:R(e.jumlah_lp,e.first_no_laporan)}}),...k.map(e=>{let isoTgl=(function(v){if(!v)return"";let s=String(v).trim().slice(0,10);if(/^\d{2}-\d{2}-\d{4}$/.test(s)){let p=s.split("-");return p[2]+"-"+p[1]+"-"+p[0]}return s})(e.effective_date||e.tanggal_atensi||e.first_tgl_laporan||e.created_at);return{id:`atensi:${e.id}`,_kind:"atensi",_pinned:Boolean(e.is_pinned),_pinned_at:e.pinned_at||"",_level:e.level_atensi,_status_atensi:e.status_atensi,_tgl:isoTgl,_no_lp:e.first_no_laporan||"",_depth:null==e.satker_depth?999:Number(e.satker_depth),_lp:Number(e.jumlah_lp||0),_rilis:!1,_created:e.created_at||e.tanggal_atensi||"",judul:e.judul,tag:e.level_atensi?e.level_atensi.charAt(0).toUpperCase()+e.level_atensi.slice(1):"Atensi",tagVariant:"tinggi"===e.level_atensi?"danger":"sedang"===e.level_atensi?"warning":"purple",hideStatus:"selesai"!==e.status_atensi,status:"selesai"===e.status_atensi?"Selesai":"Aktif",statusVariant:"selesai"===e.status_atensi?"success":"blue",tanggal:I(e.tanggal_atensi||e.first_tgl_laporan||e.created_at),lpInfo:Number(e.jumlah_lp||0)>1?`${Number(e.jumlah_lp)} LP`:R(e.jumlah_lp,e.first_no_laporan)}})].sort((e,t)=>{
// 1. DISEMATKAN (Booming -> otomatis Rank 1)
let pDiff=(t._pinned?1:0)-(e._pinned?1:0);
if(pDiff)return pDiff;
if(e._pinned&&t._pinned){
let pa=String(t._pinned_at||"").localeCompare(String(e._pinned_at||""));
if(pa)return pa;
}

// 2. PALING TERBARU (Tanggal terbaru)
let r=String(t._tgl||t._created||"").localeCompare(String(e._tgl||e._created||""));
if(r)return r;

// 3. BANYAKNYA LP (Jumlah LP terbanyak)
r=Number(t._lp||0)-Number(e._lp||0);
if(r)return r;

// 4. DERAJAT TERTINGGI (Tingkat Satker: 1=Mabes/Bareskrim > 2=Polda > 3=Polres > 4=Polsek, lalu Skala/Level: Nasional/Tinggi > Regional/Sedang > Biasa)
let dE=null==e._depth||e._depth<=0?999:Number(e._depth);
let dT=null==t._depth||t._depth<=0?999:Number(t._depth);
r=dE-dT;
if(r)return r;

let rankLvl=x=>(x._skala==="nasional"||x._level==="tinggi")?3:(x._skala==="regional"||x._level==="sedang")?2:1;
r=rankLvl(t)-rankLvl(e);
if(r)return r;

r=String(t._created||"").localeCompare(String(e._created||""));
if(r)return r;

return Number(String(t.id).split(":").pop()||0)-Number(String(e.id).split(":").pop()||0);
}).filter((()=>{let s=new Set(),lpSet=new Set();return x=>{let k=(x.judul||"").trim().toLowerCase(),noLp=Number(x._lp||0)===1?String(x._no_lp||"").trim().toUpperCase():"";if(!k||s.has(k)||(noLp&&lpSet.has(noLp)))return!1;s.add(k);if(noLp)lpSet.add(noLp);return!0}})()).slice(0,5),onOpenItem:t=>{let[a,r]=String(t).split(":");e.push("atensi"===a?`/cms/laporan/kasus-atensi/lihat?open=${r}`:`/cms/laporan/kasus-menonjol/lihat?open=${r}`)}}),(0,t.jsx)(M,{id:"fld-dashboard-perma-31-21",name:"field_dashboard_perma_31_21",title:(0,t.jsx)("span",{role:"button",tabIndex:0,onClick:ev=>{ev.stopPropagation();e.push("/cms/master/operasi-satgas")},style:{cursor:"pointer",color:"inherit",transition:"color .15s,text-decoration .15s"},onMouseEnter:ev=>{ev.currentTarget.style.color="#2563eb";ev.currentTarget.style.textDecoration="underline"},onMouseLeave:ev=>{ev.currentTarget.style.color="inherit";ev.currentTarget.style.textDecoration="none"},title:"Buka Operasi & Satgas",children:"Operasi & Satgas"}),icon:(0,t.jsx)("span",{style:{display:"inline-flex",alignItems:"center",justifyContent:"center",width:"1.65rem",height:"1.65rem",borderRadius:"6px",background:"rgba(59, 130, 246, 0.12)",color:"#3b82f6",flexShrink:0},children:(0,t.jsx)(w.Flag,{size:14})}),emptyText:J?"Memuat…":"Belum ada operasi/satgas.",onLihatSemua:()=>e.push("/cms/master/operasi-satgas"),items:[...B].sort((e,t)=>{
// 1. DISEMATKAN (Booming -> otomatis Rank 1)
let pDiff=(t.is_pinned?1:0)-(e.is_pinned?1:0);
if(pDiff)return pDiff;
if(e.is_pinned&&t.is_pinned){
let pa=String(t.pinned_at||"").localeCompare(String(e.pinned_at||""));
if(pa)return pa;
}

// 2. PALING TERBARU (Tanggal mulai / dibentuk / dibuat terbaru)
let dtE=String(e.tanggal_mulai||e.tanggal_dibentuk||e.created_at||"").slice(0,10);
let dtT=String(t.tanggal_mulai||t.tanggal_dibentuk||t.created_at||"").slice(0,10);
let r=dtT.localeCompare(dtE);
if(r)return r;

// 3. BANYAKNYA LP (Jumlah LP terbanyak)
r=Number(t.jumlah_lp||0)-Number(e.jumlah_lp||0);
if(r)return r;

// 4. DERAJAT TERTINGGI (Tingkat Satker: 1=Mabes/Bareskrim > Polda > Polres, lalu Operasi > Satgas)
let dE=null==e.satker_depth||e.satker_depth<=0?999:Number(e.satker_depth);
let dT=null==t.satker_depth||t.satker_depth<=0?999:Number(t.satker_depth);
r=dE-dT;
if(r)return r;

let a=("OPERASI"===e.jenis?0:1)-("OPERASI"===t.jenis?0:1);
if(a)return a;

return Number(t.id||0)-Number(e.id||0)
}).slice(0,5).map(e=>({id:e.id,_pinned:Boolean(e.is_pinned),judul:e.nama,tag:"SATGAS"===e.jenis?"Satgas":"Operasi",tagVariant:"SATGAS"===e.jenis?"indigo":"blue",hideStatus:!0,status:"SELESAI"===e.status_tampil?"Selesai":"NONAKTIF"===e.status_tampil?"Nonaktif":"Aktif",statusSeverity:"SELESAI"===e.status_tampil?"secondary":"NONAKTIF"===e.status_tampil?"warning":"success",tanggal:I(e.tanggal_mulai||e.tanggal_dibentuk||e.created_at),lpInfo:`${e.jumlah_lp||0} LP`})).slice(0,5),onOpenItem:t=>e.push(`/cms/master/operasi-satgas?open=${t}`)}),(0,t.jsx)(M,{title:(0,t.jsx)("span",{role:"button",tabIndex:0,onClick:ev=>{ev.stopPropagation();e.push("/cms/laporan/rekap-pihak-terlibat")},style:{cursor:"pointer",color:"inherit",transition:"color .15s,text-decoration .15s"},onMouseEnter:ev=>{ev.currentTarget.style.color="#dc2626";ev.currentTarget.style.textDecoration="underline"},onMouseLeave:ev=>{ev.currentTarget.style.color="inherit";ev.currentTarget.style.textDecoration="none"},title:"Buka Rekap Pihak Terlibat",children:"Pihak Paling Sering Terlibat"}),icon:(0,t.jsx)("span",{style:{display:"inline-flex",alignItems:"center",justifyContent:"center",width:"1.65rem",height:"1.65rem",borderRadius:"6px",background:"rgba(239, 68, 68, 0.12)",color:"#ef4444",flexShrink:0},children:(0,t.jsx)("i",{className:"pi pi-users",style:{fontSize:"0.82rem"}})}),headerExtra:(0,t.jsx)(d.Dropdown,{id:"dash-filter-pihak-jenis",inputId:"dash-filter-pihak-jenis-select",name:"pihak_jenis",value:pihakJenis,options:[{label:"Semua",value:"ALL"},{label:"DPO",value:"DPO"},{label:"Tersangka",value:"TERSANGKA"},{label:"Terlapor",value:"TERLAPOR"},{label:"Pelapor",value:"PELAPOR"},{label:"Saksi",value:"SAKSI"},{label:"Korban",value:"KORBAN"}],onChange:e=>{setPihakJenis(e.value);setDpoRows([]);loadPihakRanking(!0,e.value)},style:{height:"1.65rem",width:"5.4rem",fontSize:"0.72rem",borderRadius:"6px",background:"var(--cas-bg-subtle, #f8fafc)",borderColor:"var(--cas-border-strong, #cbd5e1)",display:"inline-flex",alignItems:"center",flexShrink:0},pt:{root:{style:{height:"1.65rem",width:"5.4rem",padding:0}},input:{style:{padding:"0 0.35rem",fontSize:"0.72rem",color:"var(--cas-text-primary, #0f172a)"}},trigger:{style:{width:"1.3rem"}}}}),emptyText:(J||pihakLoading)?"Memuat…":"Belum ada pihak terlibat.",onLihatSemua:()=>e.push("/cms/laporan/rekap-pihak-terlibat"),items:(()=>{let s=new Set();let kRank=x=>{if(x.kasta_rank!=null&&Number.isFinite(Number(x.kasta_rank)))return Number(x.kasta_rank);let ks=String(x.kasta||x.keterlibatan||"").toUpperCase();if(ks==="DPO"||Number(x.count_dpo||0)>0)return 1;if(ks==="TERSANGKA"||Number(x.count_tersangka||0)>0)return 2;if(ks==="TERLAPOR"||Number(x.count_terlapor||0)>0)return 3;if(ks==="PELAPOR"||Number(x.count_pelapor||0)>0)return 4;if(ks==="SAKSI"||Number(x.count_saksi||0)>0)return 5;if(ks==="KORBAN"||Number(x.count_korban||0)>0)return 6;return 7};return[...(dpoRows||[])].filter(e=>{let k=String((e.raw_nik&&e.raw_nik!=="KORPORASI"?e.raw_nik:"")||(e.nik&&e.nik!=="KORPORASI"?e.nik:"")||e.nama||"").trim().toUpperCase();if(!k||s.has(k))return!1;s.add(k);return!0}).sort((e,t)=>{let krE=kRank(e);let krT=kRank(t);if(pihakJenis==="ALL"&&krE!==krT)return krE-krT;let cE=(pihakJenis!=="ALL"&&e.count_role)?Number(e.count_role):Number(e.total_lp||e.jumlah_lp||1);let cT=(pihakJenis!=="ALL"&&t.count_role)?Number(t.count_role):Number(t.total_lp||t.jumlah_lp||1);if(cT!==cE)return cT-cE;let stE=Number(e.satker_tier||99);let stT=Number(t.satker_tier||99);if(stE!==stT)return stE-stT;if(krE!==krT)return krE-krT;return String(t.last_seen||"").localeCompare(String(e.last_seen||""))}).slice(0,5).map(e=>{let t=getPihakTag(e,pihakJenis);let c=(pihakJenis!=="ALL"&&e.count_role)?e.count_role:Number(e.total_lp||e.jumlah_lp||1);let isCorp=e.tipe_subjek==="KORPORASI"||(e.nik&&(String(e.nik).startsWith("KORP:")||e.nik==="KORPORASI"))||e.tipe_identitas==="BADAN HUKUM";let idLabel=isCorp?"KORPORASI":(e.nik||"NIK tidak tersedia");let searchVal=isCorp?(e.nama||e.nik||""):(e.nik||e.nama||"");return{id:searchVal,judul:e.nama||"Tanpa Nama",tag:t,tagVariant:getPihakVariant(t),metaText:`${idLabel} • ${c} LP${e.is_lintas_wilayah?" • Lintas Wilayah":""}${e.satker_nama?` • ${abbrSatkerName(e.satker_nama,!1)}`:""}`}})})(),onOpenItem:t=>{let o=function(v){let s=JSON.stringify({s:String(v),n:1});let k="cas_pt_enc_2026_bareskrim";let r="";for(let i=0;i<s.length;i++){r+=String.fromCharCode(s.charCodeAt(i)^k.charCodeAt(i%k.length))}return btoa(r).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}(t);try{sessionStorage.setItem("cas_pt_jump",JSON.stringify({search:String(t),scope:"national"}))}catch(err){}e.push(`/cms/laporan/rekap-pihak-terlibat/${o}`)}})]})]}),l?.integrasi&&(0,t.jsxs)("div",{className:"dash-section cms-card",children:[(0,t.jsx)("div",{className:"dash-panel-head",children:(0,t.jsxs)("div",{className:"dash-panel-head-left",children:[(0,t.jsx)("span",{className:"dash-icon-badge",style:{background:"#eff6ff"},children:(0,t.jsx)("i",{className:"pi pi-sync",style:{color:"#2563eb"}})}),(0,t.jsx)("div",{className:"dash-panel-title",children:"Integrasi Data DORS"})]})}),(0,t.jsxs)("div",{className:"dash-integrasi-grid",children:[(0,t.jsx)(A,{id:"fld-dashboard-perma-31-22",name:"field_dashboard_perma_31_22",label:"Data Ditarik",value:z(l.integrasi.total_ditarik)}),(0,t.jsx)(A,{id:"fld-dashboard-perma-31-23",name:"field_dashboard_perma_31_23",label:"Termapping ke Satker",value:z(l.integrasi.total_termapping)}),l.integrasi.per_model.map(e=>(0,t.jsx)(A,{id:"fld-dashboard-perma-31-24",name:"field_dashboard_perma_31_24",label:e.label,value:z(e.jumlah)},e.model_lp)),(0,t.jsx)(A,{id:"fld-dashboard-perma-31-25",name:"field_dashboard_perma_31_25",label:"Terakhir Sinkron",value:function(e){if(!e)return"—";let t=new Date(e);return isNaN(t.getTime())?"—":t.toLocaleString("id-ID",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}(l.integrasi.terakhir_sync),small:!0})]})]})]})]})}],87278)},17393,e=>{e.v(t=>Promise.all(["static/chunks/1z_64d81ad-xe.js"].map(t=>e.l(t))).then(()=>t(1508)))}]);