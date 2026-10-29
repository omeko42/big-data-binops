(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,67034,(e,t,r)=>{var n={675:function(e,t){"use strict";t.byteLength=function(e){var t=u(e),r=t[0],n=t[1];return(r+n)*3/4-n},t.toByteArray=function(e){var t,r,i=u(e),s=i[0],a=i[1],l=new o((s+a)*3/4-a),f=0,c=a>0?s-4:s;for(r=0;r<c;r+=4)t=n[e.charCodeAt(r)]<<18|n[e.charCodeAt(r+1)]<<12|n[e.charCodeAt(r+2)]<<6|n[e.charCodeAt(r+3)],l[f++]=t>>16&255,l[f++]=t>>8&255,l[f++]=255&t;return 2===a&&(t=n[e.charCodeAt(r)]<<2|n[e.charCodeAt(r+1)]>>4,l[f++]=255&t),1===a&&(t=n[e.charCodeAt(r)]<<10|n[e.charCodeAt(r+1)]<<4|n[e.charCodeAt(r+2)]>>2,l[f++]=t>>8&255,l[f++]=255&t),l},t.fromByteArray=function(e){for(var t,n=e.length,o=n%3,i=[],s=0,a=n-o;s<a;s+=16383)i.push(function(e,t,n){for(var o,i=[],s=t;s<n;s+=3)o=(e[s]<<16&0xff0000)+(e[s+1]<<8&65280)+(255&e[s+2]),i.push(r[o>>18&63]+r[o>>12&63]+r[o>>6&63]+r[63&o]);return i.join("")}(e,s,s+16383>a?a:s+16383));return 1===o?i.push(r[(t=e[n-1])>>2]+r[t<<4&63]+"=="):2===o&&i.push(r[(t=(e[n-2]<<8)+e[n-1])>>10]+r[t>>4&63]+r[t<<2&63]+"="),i.join("")};for(var r=[],n=[],o="u">typeof Uint8Array?Uint8Array:Array,i="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",s=0,a=i.length;s<a;++s)r[s]=i[s],n[i.charCodeAt(s)]=s;function u(e){var t=e.length;if(t%4>0)throw Error("Invalid string. Length must be a multiple of 4");var r=e.indexOf("=");-1===r&&(r=t);var n=r===t?0:4-r%4;return[r,n]}n[45]=62,n[95]=63},72:function(e,t,r){"use strict";var n=r(675),o=r(783),i="function"==typeof Symbol&&"function"==typeof Symbol.for?Symbol.for("nodejs.util.inspect.custom"):null;function s(e){if(e>0x7fffffff)throw RangeError('The value "'+e+'" is invalid for option "size"');var t=new Uint8Array(e);return Object.setPrototypeOf(t,a.prototype),t}function a(e,t,r){if("number"==typeof e){if("string"==typeof t)throw TypeError('The "string" argument must be of type string. Received type number');return f(e)}return u(e,t,r)}function u(e,t,r){if("string"==typeof e){var n=e,o=t;if(("string"!=typeof o||""===o)&&(o="utf8"),!a.isEncoding(o))throw TypeError("Unknown encoding: "+o);var i=0|p(n,o),u=s(i),l=u.write(n,o);return l!==i&&(u=u.slice(0,l)),u}if(ArrayBuffer.isView(e))return c(e);if(null==e)throw TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof e);if(x(e,ArrayBuffer)||e&&x(e.buffer,ArrayBuffer)||"u">typeof SharedArrayBuffer&&(x(e,SharedArrayBuffer)||e&&x(e.buffer,SharedArrayBuffer)))return function(e,t,r){var n;if(t<0||e.byteLength<t)throw RangeError('"offset" is outside of buffer bounds');if(e.byteLength<t+(r||0))throw RangeError('"length" is outside of buffer bounds');return Object.setPrototypeOf(n=void 0===t&&void 0===r?new Uint8Array(e):void 0===r?new Uint8Array(e,t):new Uint8Array(e,t,r),a.prototype),n}(e,t,r);if("number"==typeof e)throw TypeError('The "value" argument must not be of type number. Received type number');var f=e.valueOf&&e.valueOf();if(null!=f&&f!==e)return a.from(f,t,r);var d=function(e){if(a.isBuffer(e)){var t=0|h(e.length),r=s(t);return 0===r.length||e.copy(r,0,0,t),r}return void 0!==e.length?"number"!=typeof e.length||function(e){return e!=e}(e.length)?s(0):c(e):"Buffer"===e.type&&Array.isArray(e.data)?c(e.data):void 0}(e);if(d)return d;if("u">typeof Symbol&&null!=Symbol.toPrimitive&&"function"==typeof e[Symbol.toPrimitive])return a.from(e[Symbol.toPrimitive]("string"),t,r);throw TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof e)}function l(e){if("number"!=typeof e)throw TypeError('"size" argument must be of type number');if(e<0)throw RangeError('The value "'+e+'" is invalid for option "size"')}function f(e){return l(e),s(e<0?0:0|h(e))}function c(e){for(var t=e.length<0?0:0|h(e.length),r=s(t),n=0;n<t;n+=1)r[n]=255&e[n];return r}t.Buffer=a,t.SlowBuffer=function(e){return+e!=e&&(e=0),a.alloc(+e)},t.INSPECT_MAX_BYTES=50,t.kMaxLength=0x7fffffff,a.TYPED_ARRAY_SUPPORT=function(){try{var e=new Uint8Array(1),t={foo:function(){return 42}};return Object.setPrototypeOf(t,Uint8Array.prototype),Object.setPrototypeOf(e,t),42===e.foo()}catch(e){return!1}}(),!a.TYPED_ARRAY_SUPPORT&&"u">typeof console&&"function"==typeof console.error&&console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."),Object.defineProperty(a.prototype,"parent",{enumerable:!0,get:function(){if(a.isBuffer(this))return this.buffer}}),Object.defineProperty(a.prototype,"offset",{enumerable:!0,get:function(){if(a.isBuffer(this))return this.byteOffset}}),a.poolSize=8192,a.from=function(e,t,r){return u(e,t,r)},Object.setPrototypeOf(a.prototype,Uint8Array.prototype),Object.setPrototypeOf(a,Uint8Array),a.alloc=function(e,t,r){return(l(e),e<=0)?s(e):void 0!==t?"string"==typeof r?s(e).fill(t,r):s(e).fill(t):s(e)},a.allocUnsafe=function(e){return f(e)},a.allocUnsafeSlow=function(e){return f(e)};function h(e){if(e>=0x7fffffff)throw RangeError("Attempt to allocate Buffer larger than maximum size: 0x7fffffff bytes");return 0|e}function p(e,t){if(a.isBuffer(e))return e.length;if(ArrayBuffer.isView(e)||x(e,ArrayBuffer))return e.byteLength;if("string"!=typeof e)throw TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type '+typeof e);var r=e.length,n=arguments.length>2&&!0===arguments[2];if(!n&&0===r)return 0;for(var o=!1;;)switch(t){case"ascii":case"latin1":case"binary":return r;case"utf8":case"utf-8":return S(e).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return 2*r;case"hex":return r>>>1;case"base64":return T(e).length;default:if(o)return n?-1:S(e).length;t=(""+t).toLowerCase(),o=!0}}function d(e,t,r){var o,i,s,a=!1;if((void 0===t||t<0)&&(t=0),t>this.length||((void 0===r||r>this.length)&&(r=this.length),r<=0||(r>>>=0)<=(t>>>=0)))return"";for(e||(e="utf8");;)switch(e){case"hex":return function(e,t,r){var n=e.length;(!t||t<0)&&(t=0),(!r||r<0||r>n)&&(r=n);for(var o="",i=t;i<r;++i)o+=P[e[i]];return o}(this,t,r);case"utf8":case"utf-8":return b(this,t,r);case"ascii":return function(e,t,r){var n="";r=Math.min(e.length,r);for(var o=t;o<r;++o)n+=String.fromCharCode(127&e[o]);return n}(this,t,r);case"latin1":case"binary":return function(e,t,r){var n="";r=Math.min(e.length,r);for(var o=t;o<r;++o)n+=String.fromCharCode(e[o]);return n}(this,t,r);case"base64":return o=this,i=t,s=r,0===i&&s===o.length?n.fromByteArray(o):n.fromByteArray(o.slice(i,s));case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return function(e,t,r){for(var n=e.slice(t,r),o="",i=0;i<n.length;i+=2)o+=String.fromCharCode(n[i]+256*n[i+1]);return o}(this,t,r);default:if(a)throw TypeError("Unknown encoding: "+e);e=(e+"").toLowerCase(),a=!0}}function y(e,t,r){var n=e[t];e[t]=e[r],e[r]=n}function g(e,t,r,n,o){var i;if(0===e.length)return -1;if("string"==typeof r?(n=r,r=0):r>0x7fffffff?r=0x7fffffff:r<-0x80000000&&(r=-0x80000000),(i=r*=1)!=i&&(r=o?0:e.length-1),r<0&&(r=e.length+r),r>=e.length)if(o)return -1;else r=e.length-1;else if(r<0)if(!o)return -1;else r=0;if("string"==typeof t&&(t=a.from(t,n)),a.isBuffer(t))return 0===t.length?-1:m(e,t,r,n,o);if("number"==typeof t){if(t&=255,"function"==typeof Uint8Array.prototype.indexOf)if(o)return Uint8Array.prototype.indexOf.call(e,t,r);else return Uint8Array.prototype.lastIndexOf.call(e,t,r);return m(e,[t],r,n,o)}throw TypeError("val must be string, number or Buffer")}function m(e,t,r,n,o){var i,s=1,a=e.length,u=t.length;if(void 0!==n&&("ucs2"===(n=String(n).toLowerCase())||"ucs-2"===n||"utf16le"===n||"utf-16le"===n)){if(e.length<2||t.length<2)return -1;s=2,a/=2,u/=2,r/=2}function l(e,t){return 1===s?e[t]:e.readUInt16BE(t*s)}if(o){var f=-1;for(i=r;i<a;i++)if(l(e,i)===l(t,-1===f?0:i-f)){if(-1===f&&(f=i),i-f+1===u)return f*s}else -1!==f&&(i-=i-f),f=-1}else for(r+u>a&&(r=a-u),i=r;i>=0;i--){for(var c=!0,h=0;h<u;h++)if(l(e,i+h)!==l(t,h)){c=!1;break}if(c)return i}return -1}a.isBuffer=function(e){return null!=e&&!0===e._isBuffer&&e!==a.prototype},a.compare=function(e,t){if(x(e,Uint8Array)&&(e=a.from(e,e.offset,e.byteLength)),x(t,Uint8Array)&&(t=a.from(t,t.offset,t.byteLength)),!a.isBuffer(e)||!a.isBuffer(t))throw TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');if(e===t)return 0;for(var r=e.length,n=t.length,o=0,i=Math.min(r,n);o<i;++o)if(e[o]!==t[o]){r=e[o],n=t[o];break}return r<n?-1:+(n<r)},a.isEncoding=function(e){switch(String(e).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},a.concat=function(e,t){if(!Array.isArray(e))throw TypeError('"list" argument must be an Array of Buffers');if(0===e.length)return a.alloc(0);if(void 0===t)for(r=0,t=0;r<e.length;++r)t+=e[r].length;var r,n=a.allocUnsafe(t),o=0;for(r=0;r<e.length;++r){var i=e[r];if(x(i,Uint8Array)&&(i=a.from(i)),!a.isBuffer(i))throw TypeError('"list" argument must be an Array of Buffers');i.copy(n,o),o+=i.length}return n},a.byteLength=p,a.prototype._isBuffer=!0,a.prototype.swap16=function(){var e=this.length;if(e%2!=0)throw RangeError("Buffer size must be a multiple of 16-bits");for(var t=0;t<e;t+=2)y(this,t,t+1);return this},a.prototype.swap32=function(){var e=this.length;if(e%4!=0)throw RangeError("Buffer size must be a multiple of 32-bits");for(var t=0;t<e;t+=4)y(this,t,t+3),y(this,t+1,t+2);return this},a.prototype.swap64=function(){var e=this.length;if(e%8!=0)throw RangeError("Buffer size must be a multiple of 64-bits");for(var t=0;t<e;t+=8)y(this,t,t+7),y(this,t+1,t+6),y(this,t+2,t+5),y(this,t+3,t+4);return this},a.prototype.toString=function(){var e=this.length;return 0===e?"":0==arguments.length?b(this,0,e):d.apply(this,arguments)},a.prototype.toLocaleString=a.prototype.toString,a.prototype.equals=function(e){if(!a.isBuffer(e))throw TypeError("Argument must be a Buffer");return this===e||0===a.compare(this,e)},a.prototype.inspect=function(){var e="",r=t.INSPECT_MAX_BYTES;return e=this.toString("hex",0,r).replace(/(.{2})/g,"$1 ").trim(),this.length>r&&(e+=" ... "),"<Buffer "+e+">"},i&&(a.prototype[i]=a.prototype.inspect),a.prototype.compare=function(e,t,r,n,o){if(x(e,Uint8Array)&&(e=a.from(e,e.offset,e.byteLength)),!a.isBuffer(e))throw TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type '+typeof e);if(void 0===t&&(t=0),void 0===r&&(r=e?e.length:0),void 0===n&&(n=0),void 0===o&&(o=this.length),t<0||r>e.length||n<0||o>this.length)throw RangeError("out of range index");if(n>=o&&t>=r)return 0;if(n>=o)return -1;if(t>=r)return 1;if(t>>>=0,r>>>=0,n>>>=0,o>>>=0,this===e)return 0;for(var i=o-n,s=r-t,u=Math.min(i,s),l=this.slice(n,o),f=e.slice(t,r),c=0;c<u;++c)if(l[c]!==f[c]){i=l[c],s=f[c];break}return i<s?-1:+(s<i)},a.prototype.includes=function(e,t,r){return -1!==this.indexOf(e,t,r)},a.prototype.indexOf=function(e,t,r){return g(this,e,t,r,!0)},a.prototype.lastIndexOf=function(e,t,r){return g(this,e,t,r,!1)};function b(e,t,r){r=Math.min(e.length,r);for(var n=[],o=t;o<r;){var i,s,a,u,l=e[o],f=null,c=l>239?4:l>223?3:l>191?2:1;if(o+c<=r)switch(c){case 1:l<128&&(f=l);break;case 2:(192&(i=e[o+1]))==128&&(u=(31&l)<<6|63&i)>127&&(f=u);break;case 3:i=e[o+1],s=e[o+2],(192&i)==128&&(192&s)==128&&(u=(15&l)<<12|(63&i)<<6|63&s)>2047&&(u<55296||u>57343)&&(f=u);break;case 4:i=e[o+1],s=e[o+2],a=e[o+3],(192&i)==128&&(192&s)==128&&(192&a)==128&&(u=(15&l)<<18|(63&i)<<12|(63&s)<<6|63&a)>65535&&u<1114112&&(f=u)}null===f?(f=65533,c=1):f>65535&&(f-=65536,n.push(f>>>10&1023|55296),f=56320|1023&f),n.push(f),o+=c}var h=n,p=h.length;if(p<=4096)return String.fromCharCode.apply(String,h);for(var d="",y=0;y<p;)d+=String.fromCharCode.apply(String,h.slice(y,y+=4096));return d}function w(e,t,r){if(e%1!=0||e<0)throw RangeError("offset is not uint");if(e+t>r)throw RangeError("Trying to access beyond buffer length")}function E(e,t,r,n,o,i){if(!a.isBuffer(e))throw TypeError('"buffer" argument must be a Buffer instance');if(t>o||t<i)throw RangeError('"value" argument is out of bounds');if(r+n>e.length)throw RangeError("Index out of range")}function v(e,t,r,n,o,i){if(r+n>e.length||r<0)throw RangeError("Index out of range")}function R(e,t,r,n,i){return t*=1,r>>>=0,i||v(e,t,r,4,34028234663852886e22,-34028234663852886e22),o.write(e,t,r,n,23,4),r+4}function O(e,t,r,n,i){return t*=1,r>>>=0,i||v(e,t,r,8,17976931348623157e292,-17976931348623157e292),o.write(e,t,r,n,52,8),r+8}a.prototype.write=function(e,t,r,n){if(void 0===t)n="utf8",r=this.length,t=0;else if(void 0===r&&"string"==typeof t)n=t,r=this.length,t=0;else if(isFinite(t))t>>>=0,isFinite(r)?(r>>>=0,void 0===n&&(n="utf8")):(n=r,r=void 0);else throw Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");var o,i,s,a,u,l,f,c,h=this.length-t;if((void 0===r||r>h)&&(r=h),e.length>0&&(r<0||t<0)||t>this.length)throw RangeError("Attempt to write outside buffer bounds");n||(n="utf8");for(var p=!1;;)switch(n){case"hex":return function(e,t,r,n){r=Number(r)||0;var o=e.length-r;n?(n=Number(n))>o&&(n=o):n=o;var i=t.length;n>i/2&&(n=i/2);for(var s=0;s<n;++s){var a,u=parseInt(t.substr(2*s,2),16);if((a=u)!=a)break;e[r+s]=u}return s}(this,e,t,r);case"utf8":case"utf-8":return o=t,i=r,C(S(e,this.length-o),this,o,i);case"ascii":return s=t,a=r,C(_(e),this,s,a);case"latin1":case"binary":return function(e,t,r,n){return C(_(t),e,r,n)}(this,e,t,r);case"base64":return u=t,l=r,C(T(e),this,u,l);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return f=t,c=r,C(function(e,t){for(var r,n,o=[],i=0;i<e.length&&!((t-=2)<0);++i)n=(r=e.charCodeAt(i))>>8,o.push(r%256),o.push(n);return o}(e,this.length-f),this,f,c);default:if(p)throw TypeError("Unknown encoding: "+n);n=(""+n).toLowerCase(),p=!0}},a.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}},a.prototype.slice=function(e,t){var r=this.length;e=~~e,t=void 0===t?r:~~t,e<0?(e+=r)<0&&(e=0):e>r&&(e=r),t<0?(t+=r)<0&&(t=0):t>r&&(t=r),t<e&&(t=e);var n=this.subarray(e,t);return Object.setPrototypeOf(n,a.prototype),n},a.prototype.readUIntLE=function(e,t,r){e>>>=0,t>>>=0,r||w(e,t,this.length);for(var n=this[e],o=1,i=0;++i<t&&(o*=256);)n+=this[e+i]*o;return n},a.prototype.readUIntBE=function(e,t,r){e>>>=0,t>>>=0,r||w(e,t,this.length);for(var n=this[e+--t],o=1;t>0&&(o*=256);)n+=this[e+--t]*o;return n},a.prototype.readUInt8=function(e,t){return e>>>=0,t||w(e,1,this.length),this[e]},a.prototype.readUInt16LE=function(e,t){return e>>>=0,t||w(e,2,this.length),this[e]|this[e+1]<<8},a.prototype.readUInt16BE=function(e,t){return e>>>=0,t||w(e,2,this.length),this[e]<<8|this[e+1]},a.prototype.readUInt32LE=function(e,t){return e>>>=0,t||w(e,4,this.length),(this[e]|this[e+1]<<8|this[e+2]<<16)+0x1000000*this[e+3]},a.prototype.readUInt32BE=function(e,t){return e>>>=0,t||w(e,4,this.length),0x1000000*this[e]+(this[e+1]<<16|this[e+2]<<8|this[e+3])},a.prototype.readIntLE=function(e,t,r){e>>>=0,t>>>=0,r||w(e,t,this.length);for(var n=this[e],o=1,i=0;++i<t&&(o*=256);)n+=this[e+i]*o;return n>=(o*=128)&&(n-=Math.pow(2,8*t)),n},a.prototype.readIntBE=function(e,t,r){e>>>=0,t>>>=0,r||w(e,t,this.length);for(var n=t,o=1,i=this[e+--n];n>0&&(o*=256);)i+=this[e+--n]*o;return i>=(o*=128)&&(i-=Math.pow(2,8*t)),i},a.prototype.readInt8=function(e,t){return(e>>>=0,t||w(e,1,this.length),128&this[e])?-((255-this[e]+1)*1):this[e]},a.prototype.readInt16LE=function(e,t){e>>>=0,t||w(e,2,this.length);var r=this[e]|this[e+1]<<8;return 32768&r?0xffff0000|r:r},a.prototype.readInt16BE=function(e,t){e>>>=0,t||w(e,2,this.length);var r=this[e+1]|this[e]<<8;return 32768&r?0xffff0000|r:r},a.prototype.readInt32LE=function(e,t){return e>>>=0,t||w(e,4,this.length),this[e]|this[e+1]<<8|this[e+2]<<16|this[e+3]<<24},a.prototype.readInt32BE=function(e,t){return e>>>=0,t||w(e,4,this.length),this[e]<<24|this[e+1]<<16|this[e+2]<<8|this[e+3]},a.prototype.readFloatLE=function(e,t){return e>>>=0,t||w(e,4,this.length),o.read(this,e,!0,23,4)},a.prototype.readFloatBE=function(e,t){return e>>>=0,t||w(e,4,this.length),o.read(this,e,!1,23,4)},a.prototype.readDoubleLE=function(e,t){return e>>>=0,t||w(e,8,this.length),o.read(this,e,!0,52,8)},a.prototype.readDoubleBE=function(e,t){return e>>>=0,t||w(e,8,this.length),o.read(this,e,!1,52,8)},a.prototype.writeUIntLE=function(e,t,r,n){if(e*=1,t>>>=0,r>>>=0,!n){var o=Math.pow(2,8*r)-1;E(this,e,t,r,o,0)}var i=1,s=0;for(this[t]=255&e;++s<r&&(i*=256);)this[t+s]=e/i&255;return t+r},a.prototype.writeUIntBE=function(e,t,r,n){if(e*=1,t>>>=0,r>>>=0,!n){var o=Math.pow(2,8*r)-1;E(this,e,t,r,o,0)}var i=r-1,s=1;for(this[t+i]=255&e;--i>=0&&(s*=256);)this[t+i]=e/s&255;return t+r},a.prototype.writeUInt8=function(e,t,r){return e*=1,t>>>=0,r||E(this,e,t,1,255,0),this[t]=255&e,t+1},a.prototype.writeUInt16LE=function(e,t,r){return e*=1,t>>>=0,r||E(this,e,t,2,65535,0),this[t]=255&e,this[t+1]=e>>>8,t+2},a.prototype.writeUInt16BE=function(e,t,r){return e*=1,t>>>=0,r||E(this,e,t,2,65535,0),this[t]=e>>>8,this[t+1]=255&e,t+2},a.prototype.writeUInt32LE=function(e,t,r){return e*=1,t>>>=0,r||E(this,e,t,4,0xffffffff,0),this[t+3]=e>>>24,this[t+2]=e>>>16,this[t+1]=e>>>8,this[t]=255&e,t+4},a.prototype.writeUInt32BE=function(e,t,r){return e*=1,t>>>=0,r||E(this,e,t,4,0xffffffff,0),this[t]=e>>>24,this[t+1]=e>>>16,this[t+2]=e>>>8,this[t+3]=255&e,t+4},a.prototype.writeIntLE=function(e,t,r,n){if(e*=1,t>>>=0,!n){var o=Math.pow(2,8*r-1);E(this,e,t,r,o-1,-o)}var i=0,s=1,a=0;for(this[t]=255&e;++i<r&&(s*=256);)e<0&&0===a&&0!==this[t+i-1]&&(a=1),this[t+i]=(e/s|0)-a&255;return t+r},a.prototype.writeIntBE=function(e,t,r,n){if(e*=1,t>>>=0,!n){var o=Math.pow(2,8*r-1);E(this,e,t,r,o-1,-o)}var i=r-1,s=1,a=0;for(this[t+i]=255&e;--i>=0&&(s*=256);)e<0&&0===a&&0!==this[t+i+1]&&(a=1),this[t+i]=(e/s|0)-a&255;return t+r},a.prototype.writeInt8=function(e,t,r){return e*=1,t>>>=0,r||E(this,e,t,1,127,-128),e<0&&(e=255+e+1),this[t]=255&e,t+1},a.prototype.writeInt16LE=function(e,t,r){return e*=1,t>>>=0,r||E(this,e,t,2,32767,-32768),this[t]=255&e,this[t+1]=e>>>8,t+2},a.prototype.writeInt16BE=function(e,t,r){return e*=1,t>>>=0,r||E(this,e,t,2,32767,-32768),this[t]=e>>>8,this[t+1]=255&e,t+2},a.prototype.writeInt32LE=function(e,t,r){return e*=1,t>>>=0,r||E(this,e,t,4,0x7fffffff,-0x80000000),this[t]=255&e,this[t+1]=e>>>8,this[t+2]=e>>>16,this[t+3]=e>>>24,t+4},a.prototype.writeInt32BE=function(e,t,r){return e*=1,t>>>=0,r||E(this,e,t,4,0x7fffffff,-0x80000000),e<0&&(e=0xffffffff+e+1),this[t]=e>>>24,this[t+1]=e>>>16,this[t+2]=e>>>8,this[t+3]=255&e,t+4},a.prototype.writeFloatLE=function(e,t,r){return R(this,e,t,!0,r)},a.prototype.writeFloatBE=function(e,t,r){return R(this,e,t,!1,r)},a.prototype.writeDoubleLE=function(e,t,r){return O(this,e,t,!0,r)},a.prototype.writeDoubleBE=function(e,t,r){return O(this,e,t,!1,r)},a.prototype.copy=function(e,t,r,n){if(!a.isBuffer(e))throw TypeError("argument should be a Buffer");if(r||(r=0),n||0===n||(n=this.length),t>=e.length&&(t=e.length),t||(t=0),n>0&&n<r&&(n=r),n===r||0===e.length||0===this.length)return 0;if(t<0)throw RangeError("targetStart out of bounds");if(r<0||r>=this.length)throw RangeError("Index out of range");if(n<0)throw RangeError("sourceEnd out of bounds");n>this.length&&(n=this.length),e.length-t<n-r&&(n=e.length-t+r);var o=n-r;if(this===e&&"function"==typeof Uint8Array.prototype.copyWithin)this.copyWithin(t,r,n);else if(this===e&&r<t&&t<n)for(var i=o-1;i>=0;--i)e[i+t]=this[i+r];else Uint8Array.prototype.set.call(e,this.subarray(r,n),t);return o},a.prototype.fill=function(e,t,r,n){if("string"==typeof e){if("string"==typeof t?(n=t,t=0,r=this.length):"string"==typeof r&&(n=r,r=this.length),void 0!==n&&"string"!=typeof n)throw TypeError("encoding must be a string");if("string"==typeof n&&!a.isEncoding(n))throw TypeError("Unknown encoding: "+n);if(1===e.length){var o,i=e.charCodeAt(0);("utf8"===n&&i<128||"latin1"===n)&&(e=i)}}else"number"==typeof e?e&=255:"boolean"==typeof e&&(e=Number(e));if(t<0||this.length<t||this.length<r)throw RangeError("Out of range index");if(r<=t)return this;if(t>>>=0,r=void 0===r?this.length:r>>>0,e||(e=0),"number"==typeof e)for(o=t;o<r;++o)this[o]=e;else{var s=a.isBuffer(e)?e:a.from(e,n),u=s.length;if(0===u)throw TypeError('The value "'+e+'" is invalid for argument "value"');for(o=0;o<r-t;++o)this[o+t]=s[o%u]}return this};var A=/[^+/0-9A-Za-z-_]/g;function S(e,t){t=t||1/0;for(var r,n=e.length,o=null,i=[],s=0;s<n;++s){if((r=e.charCodeAt(s))>55295&&r<57344){if(!o){if(r>56319||s+1===n){(t-=3)>-1&&i.push(239,191,189);continue}o=r;continue}if(r<56320){(t-=3)>-1&&i.push(239,191,189),o=r;continue}r=(o-55296<<10|r-56320)+65536}else o&&(t-=3)>-1&&i.push(239,191,189);if(o=null,r<128){if((t-=1)<0)break;i.push(r)}else if(r<2048){if((t-=2)<0)break;i.push(r>>6|192,63&r|128)}else if(r<65536){if((t-=3)<0)break;i.push(r>>12|224,r>>6&63|128,63&r|128)}else if(r<1114112){if((t-=4)<0)break;i.push(r>>18|240,r>>12&63|128,r>>6&63|128,63&r|128)}else throw Error("Invalid code point")}return i}function _(e){for(var t=[],r=0;r<e.length;++r)t.push(255&e.charCodeAt(r));return t}function T(e){return n.toByteArray(function(e){if((e=(e=e.split("=")[0]).trim().replace(A,"")).length<2)return"";for(;e.length%4!=0;)e+="=";return e}(e))}function C(e,t,r,n){for(var o=0;o<n&&!(o+r>=t.length)&&!(o>=e.length);++o)t[o+r]=e[o];return o}function x(e,t){return e instanceof t||null!=e&&null!=e.constructor&&null!=e.constructor.name&&e.constructor.name===t.name}var P=function(){for(var e="0123456789abcdef",t=Array(256),r=0;r<16;++r)for(var n=16*r,o=0;o<16;++o)t[n+o]=e[r]+e[o];return t}()},783:function(e,t){t.read=function(e,t,r,n,o){var i,s,a=8*o-n-1,u=(1<<a)-1,l=u>>1,f=-7,c=r?o-1:0,h=r?-1:1,p=e[t+c];for(c+=h,i=p&(1<<-f)-1,p>>=-f,f+=a;f>0;i=256*i+e[t+c],c+=h,f-=8);for(s=i&(1<<-f)-1,i>>=-f,f+=n;f>0;s=256*s+e[t+c],c+=h,f-=8);if(0===i)i=1-l;else{if(i===u)return s?NaN:1/0*(p?-1:1);s+=Math.pow(2,n),i-=l}return(p?-1:1)*s*Math.pow(2,i-n)},t.write=function(e,t,r,n,o,i){var s,a,u,l=8*i-o-1,f=(1<<l)-1,c=f>>1,h=5960464477539062e-23*(23===o),p=n?0:i-1,d=n?1:-1,y=+(t<0||0===t&&1/t<0);for(isNaN(t=Math.abs(t))||t===1/0?(a=+!!isNaN(t),s=f):(s=Math.floor(Math.log(t)/Math.LN2),t*(u=Math.pow(2,-s))<1&&(s--,u*=2),s+c>=1?t+=h/u:t+=h*Math.pow(2,1-c),t*u>=2&&(s++,u/=2),s+c>=f?(a=0,s=f):s+c>=1?(a=(t*u-1)*Math.pow(2,o),s+=c):(a=t*Math.pow(2,c-1)*Math.pow(2,o),s=0));o>=8;e[r+p]=255&a,p+=d,a/=256,o-=8);for(s=s<<o|a,l+=o;l>0;e[r+p]=255&s,p+=d,s/=256,l-=8);e[r+p-d]|=128*y}}},o={};function i(e){var t=o[e];if(void 0!==t)return t.exports;var r=o[e]={exports:{}},s=!0;try{n[e](r,r.exports,i),s=!1}finally{s&&delete o[e]}return r.exports}i.ab="/ROOT/node_modules/next/dist/compiled/buffer/",t.exports=i(72)},54858,e=>{"use strict";let t,r,n,o;var i,s,a,u,l=e.i(47167);function f(e,t){return function(){return e.apply(t,arguments)}}let{toString:c}=Object.prototype,{getPrototypeOf:h}=Object,{iterator:p,toStringTag:d}=Symbol,y=(({hasOwnProperty:e})=>(t,r)=>e.call(t,r))(Object.prototype),g=(e,t)=>{let r=e,n=[];for(;null!=r&&r!==Object.prototype&&-1===n.indexOf(r);){if(n.push(r),y(r,t))return!0;r=h(r)}return!1},m=(t=Object.create(null),e=>{let r=c.call(e);return t[r]||(t[r]=r.slice(8,-1).toLowerCase())}),b=e=>(e=e.toLowerCase(),t=>m(t)===e),w=e=>t=>typeof t===e,{isArray:E}=Array,v=w("undefined");function R(e){return null!==e&&!v(e)&&null!==e.constructor&&!v(e.constructor)&&S(e.constructor.isBuffer)&&e.constructor.isBuffer(e)}let O=b("ArrayBuffer"),A=w("string"),S=w("function"),_=w("number"),T=e=>null!==e&&"object"==typeof e,C=e=>{if(!T(e))return!1;let t=h(e);return(null===t||t===Object.prototype||null===h(t))&&!g(e,d)&&!g(e,p)},x=b("Date"),P=b("File"),B=b("Blob"),U=b("FileList"),j="u">typeof globalThis?globalThis:"u">typeof self?self:"u">typeof window?window:e.g,N=void 0!==j.FormData?j.FormData:void 0,L=b("URLSearchParams"),[D,k,I,F]=["ReadableStream","Request","Response","Headers"].map(b);function M(e,t,{allOwnKeys:r=!1}={}){let n,o;if(null!=e)if("object"!=typeof e&&(e=[e]),E(e))for(n=0,o=e.length;n<o;n++)t.call(null,e[n],n,e);else{let o;if(R(e))return;let i=r?Object.getOwnPropertyNames(e):Object.keys(e),s=i.length;for(n=0;n<s;n++)o=i[n],t.call(null,e[o],o,e)}}function q(e,t){let r;if(R(e))return null;t=t.toLowerCase();let n=Object.keys(e),o=n.length;for(;o-- >0;)if(t===(r=n[o]).toLowerCase())return r;return null}let z="u">typeof globalThis?globalThis:"u">typeof self?self:"u">typeof window?window:e.g,W=e=>!v(e)&&e!==z,H=(r="u">typeof Uint8Array&&h(Uint8Array),e=>r&&e instanceof r),J=b("HTMLFormElement"),{propertyIsEnumerable:$}=Object.prototype,V=b("RegExp"),K=(e,t)=>{let r=Object.getOwnPropertyDescriptors(e),n={};M(r,(r,o)=>{let i;!1!==(i=t(r,o,e))&&(n[o]=i||r)}),Object.defineProperties(e,n)},X=b("AsyncFunction"),Y=(i="function"==typeof setImmediate,s=S(z.postMessage),i?setImmediate:s?(a=`axios@${Math.random()}`,u=[],z.addEventListener("message",({source:e,data:t})=>{e===z&&t===a&&u.length&&u.shift()()},!1),e=>{u.push(e),z.postMessage(a,"*")}):e=>setTimeout(e)),G="u">typeof queueMicrotask?queueMicrotask.bind(z):void 0!==l.default&&l.default.nextTick||Y,Q=e=>null!=e&&S(e[p]),Z={isArray:E,isArrayBuffer:O,isBuffer:R,isFormData:e=>{if(!e)return!1;if(N&&e instanceof N)return!0;let t=h(e);if(!t||t===Object.prototype||!S(e.append))return!1;let r=m(e);return"formdata"===r||"object"===r&&S(e.toString)&&"[object FormData]"===e.toString()},isArrayBufferView:function(e){return"u">typeof ArrayBuffer&&ArrayBuffer.isView?ArrayBuffer.isView(e):e&&e.buffer&&O(e.buffer)},isString:A,isNumber:_,isBoolean:e=>!0===e||!1===e,isObject:T,isPlainObject:C,isEmptyObject:e=>{if(!T(e)||R(e))return!1;try{return 0===Object.keys(e).length&&Object.getPrototypeOf(e)===Object.prototype}catch(e){return!1}},isReadableStream:D,isRequest:k,isResponse:I,isHeaders:F,isUndefined:v,isDate:x,isFile:P,isReactNativeBlob:e=>!!(e&&void 0!==e.uri),isReactNative:e=>e&&void 0!==e.getParts,isBlob:B,isRegExp:V,isFunction:S,isStream:e=>T(e)&&S(e.pipe),isURLSearchParams:L,isTypedArray:H,isFileList:U,forEach:M,merge:function e(...t){let{caseless:r,skipUndefined:n}=W(this)&&this||{},o={},i=(t,i)=>{if("__proto__"===i||"constructor"===i||"prototype"===i)return;let s=r&&"string"==typeof i&&q(o,i)||i,a=y(o,s)?o[s]:void 0;C(a)&&C(t)?o[s]=e(a,t):C(t)?o[s]=e({},t):E(t)?o[s]=t.slice():n&&v(t)||(o[s]=t)};for(let e=0,r=t.length;e<r;e++){let r=t[e];if(!r||R(r)||(M(r,i),"object"!=typeof r||E(r)))continue;let n=Object.getOwnPropertySymbols(r);for(let e=0;e<n.length;e++){let t=n[e];$.call(r,t)&&i(r[t],t)}}return o},extend:(e,t,r,{allOwnKeys:n}={})=>(M(t,(t,n)=>{r&&S(t)?Object.defineProperty(e,n,{__proto__:null,value:f(t,r),writable:!0,enumerable:!0,configurable:!0}):Object.defineProperty(e,n,{__proto__:null,value:t,writable:!0,enumerable:!0,configurable:!0})},{allOwnKeys:n}),e),trim:e=>e.trim?e.trim():e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,""),stripBOM:e=>(65279===e.charCodeAt(0)&&(e=e.slice(1)),e),inherits:(e,t,r,n)=>{e.prototype=Object.create(t.prototype,n),Object.defineProperty(e.prototype,"constructor",{__proto__:null,value:e,writable:!0,enumerable:!1,configurable:!0}),Object.defineProperty(e,"super",{__proto__:null,value:t.prototype}),r&&Object.assign(e.prototype,r)},toFlatObject:(e,t,r,n)=>{let o,i,s,a={};if(t=t||{},null==e)return t;do{for(i=(o=Object.getOwnPropertyNames(e)).length;i-- >0;)s=o[i],(!n||n(s,e,t))&&!a[s]&&(t[s]=e[s],a[s]=!0);e=!1!==r&&h(e)}while(e&&(!r||r(e,t))&&e!==Object.prototype)return t},kindOf:m,kindOfTest:b,endsWith:(e,t,r)=>{e=String(e),(void 0===r||r>e.length)&&(r=e.length),r-=t.length;let n=e.indexOf(t,r);return -1!==n&&n===r},toArray:e=>{if(!e)return null;if(E(e))return e;let t=e.length;if(!_(t))return null;let r=Array(t);for(;t-- >0;)r[t]=e[t];return r},forEachEntry:(e,t)=>{let r,n=(e&&e[p]).call(e);for(;(r=n.next())&&!r.done;){let n=r.value;t.call(e,n[0],n[1])}},matchAll:(e,t)=>{let r,n=[];for(;null!==(r=e.exec(t));)n.push(r);return n},isHTMLForm:J,hasOwnProperty:y,hasOwnProp:y,hasOwnInPrototypeChain:g,getSafeProp:(e,t)=>null!=e&&g(e,t)?e[t]:void 0,reduceDescriptors:K,freezeMethods:e=>{K(e,(t,r)=>{if(S(e)&&["arguments","caller","callee"].includes(r))return!1;if(S(e[r])){if(t.enumerable=!1,"writable"in t){t.writable=!1;return}t.set||(t.set=()=>{throw Error("Can not rewrite read-only method '"+r+"'")})}})},toObjectSet:(e,t)=>{let r={};return(E(e)?e:String(e).split(t)).forEach(e=>{r[e]=!0}),r},toCamelCase:e=>e.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g,function(e,t,r){return t.toUpperCase()+r}),noop:()=>{},toFiniteNumber:(e,t)=>null!=e&&Number.isFinite(e*=1)?e:t,findKey:q,global:z,isContextDefined:W,isSpecCompliantForm:function(e){return!!(e&&S(e.append)&&"FormData"===e[d]&&e[p])},toJSONObject:e=>{let t=new WeakSet,r=e=>{if(T(e)){if(t.has(e))return;if(R(e))return e;if(!("toJSON"in e)){t.add(e);let n=E(e)?[]:{};return M(e,(e,t)=>{let o=r(e);v(o)||(n[t]=o)}),t.delete(e),n}}return e};return r(e)},isAsyncFn:X,isThenable:e=>e&&(T(e)||S(e))&&S(e.then)&&S(e.catch),setImmediate:Y,asap:G,isIterable:Q,isSafeIterable:e=>null!=e&&g(e,p)&&Q(e)};var ee=e.i(67034);let et=Z.toObjectSet(["age","authorization","content-length","content-type","etag","expires","from","host","if-modified-since","if-unmodified-since","last-modified","location","max-forwards","proxy-authorization","referer","retry-after","user-agent"]),er=RegExp("[\\u0000-\\u0008\\u000a-\\u001f\\u007f]+","g"),en=RegExp("[^\\u0009\\u0020-\\u007e\\u0080-\\u00ff]+","g");function eo(e,t){return Z.isArray(e)?e.map(e=>eo(e,t)):function(e){let t=0,r=e.length;for(;t<r;){let r=e.charCodeAt(t);if(9!==r&&32!==r)break;t+=1}for(;r>t;){let t=e.charCodeAt(r-1);if(9!==t&&32!==t)break;r-=1}return 0===t&&r===e.length?e:e.slice(t,r)}(String(e).replace(t,""))}function ei(e){let t=Object.create(null);return Z.forEach(e.toJSON(),(e,r)=>{t[r]=eo(e,en)}),t}let es=Symbol("internals");function ea(e){return e&&String(e).trim().toLowerCase()}function eu(e){return!1===e||null==e?e:Z.isArray(e)?e.map(eu):eo(String(e),er)}function el(e,t,r,n,o){if(Z.isFunction(n))return n.call(this,t,r);if(o&&(t=r),Z.isString(t)){if(Z.isString(n))return -1!==t.indexOf(n);if(Z.isRegExp(n))return n.test(t)}}class ef{constructor(e){e&&this.set(e)}set(e,t,r){let n=this;function o(e,t,r){let o=ea(t);if(!o)return;let i=Z.findKey(n,o);i&&void 0!==n[i]&&!0!==r&&(void 0!==r||!1===n[i])||(n[i||t]=eu(e))}let i=(e,t)=>Z.forEach(e,(e,r)=>o(e,r,t));if(Z.isPlainObject(e)||e instanceof this.constructor)i(e,t);else{let n;if(Z.isString(e)&&(e=e.trim())&&(n=e,!/^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(n.trim()))){var s;let r,n,o,a;i((a={},(s=e)&&s.split("\n").forEach(function(e){o=e.indexOf(":"),r=e.substring(0,o).trim().toLowerCase(),n=e.substring(o+1).trim(),!r||a[r]&&et[r]||("set-cookie"===r?a[r]?a[r].push(n):a[r]=[n]:a[r]=a[r]?a[r]+", "+n:n)}),a),t)}else if(Z.isObject(e)&&Z.isSafeIterable(e)){let r=Object.create(null),n,o;for(let t of e){if(!Z.isArray(t))throw TypeError("Object iterator must return a key-value pair");o=t[0],Z.hasOwnProp(r,o)?(n=r[o],r[o]=Z.isArray(n)?[...n,t[1]]:[n,t[1]]):r[o]=t[1]}i(r,t)}else null!=e&&o(t,e,r)}return this}get(e,t){if(e=ea(e)){let r=Z.findKey(this,e);if(r){let e=this[r];if(!t)return e;if(!0===t){let t,r=Object.create(null),n=/([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;for(;t=n.exec(e);)r[t[1]]=t[2];return r}if(Z.isFunction(t))return t.call(this,e,r);if(Z.isRegExp(t))return t.exec(e);throw TypeError("parser must be boolean|regexp|function")}}}has(e,t){if(e=ea(e)){let r=Z.findKey(this,e);return!!(r&&void 0!==this[r]&&(!t||el(this,this[r],r,t)))}return!1}delete(e,t){let r=this,n=!1;function o(e){if(e=ea(e)){let o=Z.findKey(r,e);o&&(!t||el(r,r[o],o,t))&&(delete r[o],n=!0)}}return Z.isArray(e)?e.forEach(o):o(e),n}clear(e){let t=Object.keys(this),r=t.length,n=!1;for(;r--;){let o=t[r];(!e||el(this,this[o],o,e,!0))&&(delete this[o],n=!0)}return n}normalize(e){let t=this,r={};return Z.forEach(this,(n,o)=>{let i=Z.findKey(r,o);if(i){t[i]=eu(n),delete t[o];return}let s=e?o.trim().toLowerCase().replace(/([a-z\d])(\w*)/g,(e,t,r)=>t.toUpperCase()+r):String(o).trim();s!==o&&delete t[o],t[s]=eu(n),r[s]=!0}),this}concat(...e){return this.constructor.concat(this,...e)}toJSON(e){let t=Object.create(null);return Z.forEach(this,(r,n)=>{null!=r&&!1!==r&&(t[n]=e&&Z.isArray(r)?r.join(", "):r)}),t}[Symbol.iterator](){return Object.entries(this.toJSON())[Symbol.iterator]()}toString(){return Object.entries(this.toJSON()).map(([e,t])=>e+": "+t).join("\n")}getSetCookie(){return this.get("set-cookie")||[]}get[Symbol.toStringTag](){return"AxiosHeaders"}static from(e){return e instanceof this?e:new this(e)}static concat(e,...t){let r=new this(e);return t.forEach(e=>r.set(e)),r}static accessor(e){let t=(this[es]=this[es]={accessors:{}}).accessors,r=this.prototype;function n(e){let n=ea(e);if(!t[n]){let o;o=Z.toCamelCase(" "+e),["get","set","has"].forEach(t=>{Object.defineProperty(r,t+o,{__proto__:null,value:function(r,n,o){return this[t].call(this,e,r,n,o)},configurable:!0})}),t[n]=!0}}return Z.isArray(e)?e.forEach(n):n(e),this}}ef.accessor(["Content-Type","Content-Length","Accept","Accept-Encoding","User-Agent","Authorization"]),Z.reduceDescriptors(ef.prototype,({value:e},t)=>{let r=t[0].toUpperCase()+t.slice(1);return{get:()=>e,set(e){this[r]=e}}}),Z.freezeMethods(ef);class ec extends Error{static from(e,t,r,n,o,i){let s=new ec(e.message,t||e.code,r,n,o);return Object.defineProperty(s,"cause",{__proto__:null,value:e,writable:!0,enumerable:!1,configurable:!0}),s.name=e.name,null!=e.status&&null==s.status&&(s.status=e.status),i&&Object.assign(s,i),s}constructor(e,t,r,n,o){super(e),Object.defineProperty(this,"message",{__proto__:null,value:e,enumerable:!0,writable:!0,configurable:!0}),this.name="AxiosError",this.isAxiosError=!0,t&&(this.code=t),r&&(this.config=r),n&&(this.request=n),o&&(this.response=o,this.status=o.status)}toJSON(){let e,t,r,n=this.config,o=n&&Z.hasOwnProp(n,"redact")?n.redact:void 0,i=Z.isArray(o)&&o.length>0?(e=new Set(o.map(e=>String(e).toLowerCase())),t=[],(r=n=>{let o;if(null===n||"object"!=typeof n||Z.isBuffer(n))return n;if(-1===t.indexOf(n)){if(n instanceof ef&&(n=n.toJSON()),t.push(n),Z.isArray(n))o=[],n.forEach((e,t)=>{let n=r(e);Z.isUndefined(n)||(o[t]=n)});else{if(!Z.isPlainObject(n)&&function(e){if(Z.hasOwnProp(e,"toJSON"))return!0;let t=Object.getPrototypeOf(e);for(;t&&t!==Object.prototype;){if(Z.hasOwnProp(t,"toJSON"))return!0;t=Object.getPrototypeOf(t)}return!1}(n))return t.pop(),n;for(let[t,i]of(o=Object.create(null),Object.entries(n))){let n=e.has(t.toLowerCase())?"[REDACTED ****]":r(i);Z.isUndefined(n)||(o[t]=n)}}return t.pop(),o}})(n)):Z.toJSONObject(n);return{message:this.message,name:this.name,description:this.description,number:this.number,fileName:this.fileName,lineNumber:this.lineNumber,columnNumber:this.columnNumber,stack:this.stack,config:i,code:this.code,status:this.status}}}ec.ERR_BAD_OPTION_VALUE="ERR_BAD_OPTION_VALUE",ec.ERR_BAD_OPTION="ERR_BAD_OPTION",ec.ECONNABORTED="ECONNABORTED",ec.ETIMEDOUT="ETIMEDOUT",ec.ECONNREFUSED="ECONNREFUSED",ec.ERR_NETWORK="ERR_NETWORK",ec.ERR_FR_TOO_MANY_REDIRECTS="ERR_FR_TOO_MANY_REDIRECTS",ec.ERR_DEPRECATED="ERR_DEPRECATED",ec.ERR_BAD_RESPONSE="ERR_BAD_RESPONSE",ec.ERR_BAD_REQUEST="ERR_BAD_REQUEST",ec.ERR_CANCELED="ERR_CANCELED",ec.ERR_NOT_SUPPORT="ERR_NOT_SUPPORT",ec.ERR_INVALID_URL="ERR_INVALID_URL",ec.ERR_FORM_DATA_DEPTH_EXCEEDED="ERR_FORM_DATA_DEPTH_EXCEEDED";let eh=ec;function ep(e){return Z.isPlainObject(e)||Z.isArray(e)}function ed(e){return Z.endsWith(e,"[]")?e.slice(0,-2):e}function ey(e,t,r){return e?e.concat(t).map(function(e,t){return e=ed(e),!r&&t?"["+e+"]":e}).join(r?".":""):t}let eg=Z.toFlatObject(Z,{},null,function(e){return/^is[A-Z]/.test(e)}),em=function(e,t,r){if(!Z.isObject(e))throw TypeError("target must be an object");t=t||new FormData;let n=(r=Z.toFlatObject(r,{metaTokens:!0,dots:!1,indexes:!1},!1,function(e,t){return!Z.isUndefined(t[e])})).metaTokens,o=r.visitor||p,i=r.dots,s=r.indexes,a=r.Blob||"u">typeof Blob&&Blob,u=void 0===r.maxDepth?100:r.maxDepth,l=a&&Z.isSpecCompliantForm(t),f=[];if(!Z.isFunction(o))throw TypeError("visitor must be a function");function c(e){if(null===e)return"";if(Z.isDate(e))return e.toISOString();if(Z.isBoolean(e))return e.toString();if(!l&&Z.isBlob(e))throw new eh("Blob is not supported. Use a Buffer instead.");if(Z.isArrayBuffer(e)||Z.isTypedArray(e)){if(l&&"function"==typeof a)return new a([e]);if(void 0!==ee.Buffer)return ee.Buffer.from(e);throw new eh("Blob is not supported. Use a Buffer instead.",eh.ERR_NOT_SUPPORT)}return e}function h(e){if(e>u)throw new eh("Object is too deeply nested ("+e+" levels). Max depth: "+u,eh.ERR_FORM_DATA_DEPTH_EXCEEDED)}function p(e,r,o){let a=e;if(Z.isReactNative(t)&&Z.isReactNativeBlob(e))return t.append(ey(o,r,i),c(e)),!1;if(e&&!o&&"object"==typeof e)if(Z.endsWith(r,"{}"))r=n?r:r.slice(0,-2),e=function(e){if(u===1/0)return JSON.stringify(e);let t=[];return JSON.stringify(e,function(e,r){if(!Z.isObject(r))return r;for(;t.length&&t[t.length-1]!==this;)t.pop();return t.push(r),h(1+t.length-1),r})}(e);else{var l;if(Z.isArray(e)&&(l=e,Z.isArray(l)&&!l.some(ep))||(Z.isFileList(e)||Z.endsWith(r,"[]"))&&(a=Z.toArray(e)))return r=ed(r),a.forEach(function(e,n){Z.isUndefined(e)||null===e||t.append(!0===s?ey([r],n,i):null===s?r:r+"[]",c(e))}),!1}return!!ep(e)||(t.append(ey(o,r,i),c(e)),!1)}let d=Object.assign(eg,{defaultVisitor:p,convertValue:c,isVisitable:ep});if(!Z.isObject(e))throw TypeError("data must be an object");return!function e(r,n,i=0){if(!Z.isUndefined(r)){if(h(i),-1!==f.indexOf(r))throw Error("Circular reference detected in "+n.join("."));f.push(r),Z.forEach(r,function(r,s){!0===(!(Z.isUndefined(r)||null===r)&&o.call(t,r,Z.isString(s)?s.trim():s,n,d))&&e(r,n?n.concat(s):[s],i+1)}),f.pop()}}(e),t};function eb(e){let t={"!":"%21","'":"%27","(":"%28",")":"%29","~":"%7E","%20":"+"};return encodeURIComponent(e).replace(/[!'()~]|%20/g,function(e){return t[e]})}function ew(e,t){this._pairs=[],e&&em(e,this,t)}let eE=ew.prototype;function ev(e){return encodeURIComponent(e).replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+")}function eR(e,t,r){let n;if(!t)return e;e=e||"";let o=Z.isFunction(r)?{serialize:r}:r,i=Z.getSafeProp(o,"encode")||ev,s=Z.getSafeProp(o,"serialize");if(n=s?s(t,o):Z.isURLSearchParams(t)?t.toString():new ew(t,o).toString(i)){let t=e.indexOf("#");-1!==t&&(e=e.slice(0,t)),e+=(-1===e.indexOf("?")?"?":"&")+n}return e}eE.append=function(e,t){this._pairs.push([e,t])},eE.toString=function(e){let t=e?t=>e.call(this,t,eb):eb;return this._pairs.map(function(e){return t(e[0])+"="+t(e[1])},"").join("&")};let eO=class{constructor(){this.handlers=[]}use(e,t,r){return this.handlers.push({fulfilled:e,rejected:t,synchronous:!!r&&r.synchronous,runWhen:r?r.runWhen:null}),this.handlers.length-1}eject(e){this.handlers[e]&&(this.handlers[e]=null)}clear(){this.handlers&&(this.handlers=[])}forEach(e){Z.forEach(this.handlers,function(t){null!==t&&e(t)})}},eA={silentJSONParsing:!0,forcedJSONParsing:!0,clarifyTimeoutError:!1,legacyInterceptorReqResOrdering:!0,advertiseZstdAcceptEncoding:!1,validateStatusUndefinedResolves:!0},eS="u">typeof URLSearchParams?URLSearchParams:ew,e_="u">typeof FormData?FormData:null,eT="u">typeof Blob?Blob:null,eC="u">typeof window&&"u">typeof document,ex="object"==typeof navigator&&navigator||void 0,eP=eC&&(!ex||0>["ReactNative","NativeScript","NS"].indexOf(ex.product)),eB="u">typeof WorkerGlobalScope&&self instanceof WorkerGlobalScope&&"function"==typeof self.importScripts,eU=eC&&window.location.href||"http://localhost";e.s(["hasBrowserEnv",0,eC,"hasStandardBrowserEnv",0,eP,"hasStandardBrowserWebWorkerEnv",0,eB,"navigator",0,ex,"origin",0,eU],57536);let ej={...e.i(57536),isBrowser:!0,classes:{URLSearchParams:eS,FormData:e_,Blob:eT},protocols:["http","https","file","blob","url","data"]};function eN(e){if(e>100)throw new eh("FormData field is too deeply nested ("+e+" levels). Max depth: 100",eh.ERR_FORM_DATA_DEPTH_EXCEEDED)}let eL=function(e){if(Z.isFormData(e)&&Z.isFunction(e.entries)){let t={};return Z.forEachEntry(e,(e,r)=>{!function e(t,r,n,o){eN(o);let i=t[o++];if("__proto__"===i)return!0;let s=Number.isFinite(+i),a=o>=t.length;return(i=!i&&Z.isArray(n)?n.length:i,a)?Z.hasOwnProp(n,i)?n[i]=Z.isArray(n[i])?n[i].concat(r):[n[i],r]:n[i]=r:(Z.hasOwnProp(n,i)&&Z.isObject(n[i])||(n[i]=[]),e(t,r,n[i],o)&&Z.isArray(n[i])&&(n[i]=function(e){let t,r,n={},o=Object.keys(e),i=o.length;for(t=0;t<i;t++)n[r=o[t]]=e[r];return n}(n[i]))),!s}(function(e){let t,r=[],n=/\w+|\[(\w*)]/g;for(;null!==(t=n.exec(e));)eN(r.length),r.push("[]"===t[0]?"":t[1]||t[0]);return r}(e),r,t,0)}),t}return null},eD=(e,t)=>null!=e&&Z.hasOwnProp(e,t)?e[t]:void 0,ek={transitional:eA,adapter:["xhr","http","fetch"],transformRequest:[function(e,t){let r,n=t.getContentType()||"",o=n.indexOf("application/json")>-1,i=Z.isObject(e);if(i&&Z.isHTMLForm(e)&&(e=new FormData(e)),Z.isFormData(e))return o?JSON.stringify(eL(e)):e;if(Z.isArrayBuffer(e)||Z.isBuffer(e)||Z.isStream(e)||Z.isFile(e)||Z.isBlob(e)||Z.isReadableStream(e))return e;if(Z.isArrayBufferView(e))return e.buffer;if(Z.isURLSearchParams(e))return t.setContentType("application/x-www-form-urlencoded;charset=utf-8",!1),e.toString();if(i){let t=eD(this,"formSerializer");if(n.indexOf("application/x-www-form-urlencoded")>-1)return em(e,new ej.classes.URLSearchParams,{visitor:function(e,t,r,n){return ej.isNode&&Z.isBuffer(e)?(this.append(t,e.toString("base64")),!1):n.defaultVisitor.apply(this,arguments)},...t}).toString();if((r=Z.isFileList(e))||n.indexOf("multipart/form-data")>-1){let n=eD(this,"env"),o=n&&n.FormData;return em(r?{"files[]":e}:e,o&&new o,t)}}if(i||o){t.setContentType("application/json",!1);var s=e;if(Z.isString(s))try{return(0,JSON.parse)(s),Z.trim(s)}catch(e){if("SyntaxError"!==e.name)throw e}return(0,JSON.stringify)(s)}return e}],transformResponse:[function(e){let t=eD(this,"transitional")||ek.transitional,r=t&&t.forcedJSONParsing,n=eD(this,"responseType"),o="json"===n;if(Z.isResponse(e)||Z.isReadableStream(e))return e;if(e&&Z.isString(e)&&(r&&!n||o)){let r=t&&t.silentJSONParsing;try{return JSON.parse(e,eD(this,"parseReviver"))}catch(e){if(!r&&o){if("SyntaxError"===e.name)throw eh.from(e,eh.ERR_BAD_RESPONSE,this,null,eD(this,"response"));throw e}}}return e}],timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",maxContentLength:-1,maxBodyLength:-1,env:{FormData:ej.classes.FormData,Blob:ej.classes.Blob},validateStatus:function(e){return e>=200&&e<300},headers:{common:{Accept:"application/json, text/plain, */*","Content-Type":void 0}}};function eI(e,t){let r=this||ek,n=t||r,o=ef.from(n.headers),i=n.data;return Z.forEach(e,function(e){i=e.call(r,i,o.normalize(),t?t.status:void 0)}),o.normalize(),i}function eF(e){return!!(e&&e.__CANCEL__)}Z.forEach(["delete","get","head","post","put","patch","query"],e=>{ek.headers[e]={}});let eM=class extends eh{constructor(e,t,r){super(null==e?"canceled":e,eh.ERR_CANCELED,t,r),this.name="CanceledError",this.__CANCEL__=!0}};function eq(e,t,r){let n=r.config.validateStatus;!r.status||!n||n(r.status)?e(r):t(new eh("Request failed with status code "+r.status,r.status>=400&&r.status<500?eh.ERR_BAD_REQUEST:eh.ERR_BAD_RESPONSE,r.config,r.request,r))}let ez=function(e,t){let r,n=Array(e=e||10),o=Array(e),i=0,s=0;return t=void 0!==t?t:1e3,function(a){let u=Date.now(),l=o[s];r||(r=u),n[i]=a,o[i]=u;let f=s,c=0;for(;f!==i;)c+=n[f++],f%=e;if((i=(i+1)%e)===s&&(s=(s+1)%e),u-r<t)return;let h=l&&u-l;return h?Math.round(1e3*c/h):void 0}},eW=function(e,t){let r,n,o=0,i=1e3/t,s=(t,i=Date.now())=>{o=i,r=null,n&&(clearTimeout(n),n=null),e(...t)};return[(...e)=>{let t=Date.now(),a=t-o;a>=i?s(e,t):(r=e,n||(n=setTimeout(()=>{n=null,s(r)},i-a)))},()=>r&&s(r)]},eH=(e,t,r=3)=>{let n=0,o=ez(50,250);return eW(r=>{if(!r||"number"!=typeof r.loaded)return;let i=r.loaded,s=r.lengthComputable?r.total:void 0,a=null!=s?Math.min(i,s):i,u=Math.max(0,a-n),l=o(u);n=Math.max(n,a),e({loaded:a,total:s,progress:s?a/s:void 0,bytes:u,rate:l||void 0,estimated:l&&s?(s-a)/l:void 0,event:r,lengthComputable:null!=s,[t?"download":"upload"]:!0})},r)},eJ=(e,t)=>{let r=null!=e;return[n=>t[0]({lengthComputable:r,total:e,loaded:n}),t[1]]},e$=e=>(...t)=>Z.asap(()=>e(...t)),eV=ej.hasStandardBrowserEnv?(n=new URL(ej.origin),o=ej.navigator&&/(msie|trident)/i.test(ej.navigator.userAgent),e=>(e=new URL(e,ej.origin),n.protocol===e.protocol&&n.host===e.host&&(o||n.port===e.port))):()=>!0,eK=ej.hasStandardBrowserEnv?{write(e,t,r,n,o,i,s){if("u"<typeof document)return;let a=[`${e}=${encodeURIComponent(t)}`];Z.isNumber(r)&&a.push(`expires=${new Date(r).toUTCString()}`),Z.isString(n)&&a.push(`path=${n}`),Z.isString(o)&&a.push(`domain=${o}`),!0===i&&a.push("secure"),Z.isString(s)&&a.push(`SameSite=${s}`),document.cookie=a.join("; ")},read(e){if("u"<typeof document)return null;let t=document.cookie.split(";");for(let r=0;r<t.length;r++){let n=t[r].replace(/^\s+/,""),o=n.indexOf("=");if(-1!==o&&n.slice(0,o)===e)try{return decodeURIComponent(n.slice(o+1))}catch(e){return n.slice(o+1)}}return null},remove(e){this.write(e,"",Date.now()-864e5,"/")}}:{write(){},read:()=>null,remove(){}},eX=/^https?:(?!\/\/)/i,eY=/[\t\n\r]/g;function eG(e,t){if("string"==typeof e&&eX.test((function(e){let t=0;for(;t<e.length&&32>=e.charCodeAt(t);)t++;return e.slice(t)})(e).replace(eY,"")))throw new eh('Invalid URL: missing "//" after protocol',eh.ERR_INVALID_URL,t)}function eQ(e,t,r,n){eG(t,n);let o=!("string"==typeof t&&/^([a-z][a-z\d+\-.]*:)?\/\//i.test(t));return e&&(o||!1===r)?(eG(e,n),t?e.replace(/\/?\/$/,"")+"/"+t.replace(/^\/+/,""):e):t}let eZ=e=>e instanceof ef?{...e}:e;function e0(e,t){e=e||{},t=t||{};let r=Object.create(null);function n(e,t,r,n){return Z.isPlainObject(e)&&Z.isPlainObject(t)?Z.merge.call({caseless:n},e,t):Z.isPlainObject(t)?Z.merge({},t):Z.isArray(t)?t.slice():t}function o(e,t,r,o){return Z.isUndefined(t)?Z.isUndefined(e)?void 0:n(void 0,e,r,o):n(e,t,r,o)}function i(e,t){if(!Z.isUndefined(t))return n(void 0,t)}function s(e,t){return Z.isUndefined(t)?Z.isUndefined(e)?void 0:n(void 0,e):n(void 0,t)}function a(r,o,i){return Z.hasOwnProp(t,i)?n(r,o):Z.hasOwnProp(e,i)?n(void 0,r):void 0}Object.defineProperty(r,"hasOwnProperty",{__proto__:null,value:Object.prototype.hasOwnProperty,enumerable:!1,writable:!0,configurable:!0});let u={url:i,method:i,data:i,baseURL:s,transformRequest:s,transformResponse:s,paramsSerializer:s,timeout:s,timeoutMessage:s,withCredentials:s,withXSRFToken:s,adapter:s,responseType:s,xsrfCookieName:s,xsrfHeaderName:s,onUploadProgress:s,onDownloadProgress:s,decompress:s,maxContentLength:s,maxBodyLength:s,beforeRedirect:s,transport:s,httpAgent:s,httpsAgent:s,cancelToken:s,socketPath:s,allowedSocketPaths:s,responseEncoding:s,validateStatus:a,headers:(e,t,r)=>o(eZ(e),eZ(t),r,!0)};return Z.forEach(Object.keys({...e,...t}),function(n){if("__proto__"===n||"constructor"===n||"prototype"===n)return;let i=Z.hasOwnProp(u,n)?u[n]:o,s=i(Z.hasOwnProp(e,n)?e[n]:void 0,Z.hasOwnProp(t,n)?t[n]:void 0,n);Z.isUndefined(s)&&i!==a||(r[n]=s)}),Z.hasOwnProp(t,"validateStatus")&&Z.isUndefined(t.validateStatus)&&!1===function(r){let n=Z.hasOwnProp(t,"transitional")?t.transitional:void 0;if(!Z.isUndefined(n)){if(!Z.isPlainObject(n))return;else if(Z.hasOwnProp(n,r))return n[r]}let o=Z.hasOwnProp(e,"transitional")?e.transitional:void 0;if(Z.isPlainObject(o)&&Z.hasOwnProp(o,r))return o[r]}("validateStatusUndefinedResolves")&&(Z.hasOwnProp(e,"validateStatus")?r.validateStatus=n(void 0,e.validateStatus):delete r.validateStatus),r}let e1=["content-type","content-length"],e2=function(e){let t=e0({},e),r=e=>Z.hasOwnProp(t,e)?t[e]:void 0,n=r("data"),o=r("withXSRFToken"),i=r("xsrfHeaderName"),s=r("xsrfCookieName"),a=r("headers"),u=r("auth"),l=r("baseURL"),f=r("allowAbsoluteUrls"),c=r("url");if(t.headers=a=ef.from(a),t.url=eR(eQ(l,c,f,t),r("params"),r("paramsSerializer")),u){let t=Z.getSafeProp(u,"username")||"",r=Z.getSafeProp(u,"password")||"";try{a.set("Authorization","Basic "+btoa(t+":"+(r?encodeURIComponent(r).replace(/%([0-9A-F]{2})/gi,(e,t)=>String.fromCharCode(parseInt(t,16))):"")))}catch(t){throw eh.from(t,eh.ERR_BAD_OPTION_VALUE,e)}}if(Z.isFormData(n))if(ej.hasStandardBrowserEnv||ej.hasStandardBrowserWebWorkerEnv||Z.isReactNative(n))a.setContentType(void 0);else{var h,p;Z.isFunction(n.getHeaders)&&(h=a,p=n.getHeaders(),"content-only"!==r("formDataHeaderPolicy")?h.set(p):Object.entries(p||{}).forEach(([e,t])=>{e1.includes(e.toLowerCase())&&h.set(e,t)}))}if(ej.hasStandardBrowserEnv&&(Z.isFunction(o)&&(o=o(t)),!0===o||null==o&&eV(t.url))){let e=i&&s&&eK.read(s);e&&a.set(i,e)}return t},e5="u">typeof XMLHttpRequest&&function(e){return new Promise(function(t,r){var n;let o,i,s,a,u,l,f=e2(e),c=f.data,h=ef.from(f.headers).normalize(),{responseType:p,onUploadProgress:d,onDownloadProgress:y}=f;function g(){a&&a(),u&&u(),f.cancelToken&&f.cancelToken.unsubscribe(o),f.signal&&f.signal.removeEventListener("abort",o)}let m=new XMLHttpRequest;function b(){if(!m)return;let n=ef.from("getAllResponseHeaders"in m&&m.getAllResponseHeaders());eq(function(e){t(e),g()},function(e){r(e),g()},{data:p&&"text"!==p&&"json"!==p?m.response:m.responseText,status:m.status,statusText:m.statusText,headers:n,config:e,request:m}),m=null}m.open(f.method.toUpperCase(),f.url,!0),m.timeout=f.timeout,"onloadend"in m?m.onloadend=b:m.onreadystatechange=function(){!m||4!==m.readyState||(0!==m.status||m.responseURL&&m.responseURL.startsWith("file:"))&&setTimeout(b)},m.onabort=function(){m&&(r(new eh("Request aborted",eh.ECONNABORTED,e,m)),g(),m=null)},m.onerror=function(t){let n=new eh(t&&t.message?t.message:"Network Error",eh.ERR_NETWORK,e,m);n.event=t||null,r(n),g(),m=null},m.ontimeout=function(){let t=f.timeout?"timeout of "+f.timeout+"ms exceeded":"timeout exceeded",n=f.transitional||eA;f.timeoutErrorMessage&&(t=f.timeoutErrorMessage),r(new eh(t,n.clarifyTimeoutError?eh.ETIMEDOUT:eh.ECONNABORTED,e,m)),g(),m=null},void 0===c&&h.setContentType(null),"setRequestHeader"in m&&Z.forEach(ei(h),function(e,t){m.setRequestHeader(t,e)}),Z.isUndefined(f.withCredentials)||(m.withCredentials=!!f.withCredentials),p&&"json"!==p&&(m.responseType=f.responseType),y&&([s,u]=eH(y,!0),m.addEventListener("progress",s)),d&&m.upload&&([i,a]=eH(d),m.upload.addEventListener("progress",i),m.upload.addEventListener("loadend",a)),(f.cancelToken||f.signal)&&(o=t=>{m&&(r(!t||t.type?new eM(null,e,m):t),m.abort(),g(),m=null)},f.cancelToken&&f.cancelToken.subscribe(o),f.signal&&(f.signal.aborted?o():f.signal.addEventListener("abort",o)));let w=(n=f.url,(l=/^([-+\w]{1,25}):(?:\/\/)?/.exec(n))&&l[1]||"");if(w&&!ej.protocols.includes(w)){r(new eh("Unsupported protocol "+w+":",eh.ERR_BAD_REQUEST,e)),g();return}m.send(c||null)})},e6=function*(e,t){let r,n=e.byteLength;if(!t||n<t)return void(yield e);let o=0;for(;o<n;)r=o+t,yield e.slice(o,r),o=r},e8=async function*(e,t){for await(let r of e3(e))yield*e6(r,t)},e3=async function*(e){if(e[Symbol.asyncIterator])return void(yield*e);let t=e.getReader();try{for(;;){let{done:e,value:r}=await t.read();if(e)break;yield r}}finally{await t.cancel()}},e4=(e,t,r,n)=>{let o,i=e8(e,t),s=0,a=e=>{!o&&(o=!0,n&&n(e))};return new ReadableStream({async pull(e){try{let{done:t,value:n}=await i.next();if(t){a(),e.close();return}let o=n.byteLength;if(r){let e=s+=o;r(e)}e.enqueue(new Uint8Array(n))}catch(e){throw a(e),e}},cancel:e=>(a(e),i.return())},{highWaterMark:2})},e7=e=>e>=48&&e<=57||e>=65&&e<=70||e>=97&&e<=102,e9=(e,t,r)=>t+2<r&&e7(e.charCodeAt(t+1))&&e7(e.charCodeAt(t+2)),te="1.18.1",{isFunction:tt}=Z,tr=e=>{if(!Z.isString(e))return e;try{return decodeURIComponent(e)}catch(t){return e}},tn=(e,...t)=>{try{return!!e(...t)}catch(e){return!1}},to=e=>{let t,r=void 0!==Z.global&&null!==Z.global?Z.global:globalThis,{ReadableStream:n,TextEncoder:o}=r,{fetch:i,Request:s,Response:a}=e=Z.merge.call({skipUndefined:!0},{Request:r.Request,Response:r.Response},e),u=i?tt(i):"function"==typeof fetch,l=tt(s),f=tt(a);if(!u)return!1;let c=u&&tt(n),h=u&&("function"==typeof o?(t=new o,e=>t.encode(e)):async e=>new Uint8Array(await new s(e).arrayBuffer())),p=l&&c&&tn(()=>{let e=!1,t=new s(ej.origin,{body:new n,method:"POST",get duplex(){return e=!0,"half"}}),r=t.headers.has("Content-Type");return null!=t.body&&t.body.cancel(),e&&!r}),d=f&&c&&tn(()=>Z.isReadableStream(new a("").body)),y={stream:d&&(e=>e.body)};u&&["text","arrayBuffer","blob","formData","stream"].forEach(e=>{y[e]||(y[e]=(t,r)=>{let n=t&&t[e];if(n)return n.call(t);throw new eh(`Response type '${e}' is not supported`,eh.ERR_NOT_SUPPORT,r)})});let g=async e=>{if(null==e)return 0;if(Z.isBlob(e))return e.size;if(Z.isSpecCompliantForm(e)){let t=new s(ej.origin,{method:"POST",body:e});return(await t.arrayBuffer()).byteLength}return Z.isArrayBufferView(e)||Z.isArrayBuffer(e)?e.byteLength:(Z.isURLSearchParams(e)&&(e+=""),Z.isString(e))?(await h(e)).byteLength:void 0},m=async(e,t)=>{let r=Z.toFiniteNumber(e.getContentLength());return null==r?g(t):r};return async e=>{let t,{url:r,method:n,data:u,signal:f,cancelToken:h,timeout:b,onDownloadProgress:w,onUploadProgress:E,responseType:v,headers:R,withCredentials:O="same-origin",fetchOptions:A,maxContentLength:S,maxBodyLength:_}=e2(e),T=Z.isNumber(S)&&S>-1,C=Z.isNumber(_)&&_>-1,x=i||fetch;v=v?(v+"").toLowerCase():"text";let P=((e,t)=>{if(e=e?e.filter(Boolean):[],!t&&!e.length)return;let r=new AbortController,n=!1,o=function(e){if(!n){n=!0,s();let t=e instanceof Error?e:this.reason;r.abort(t instanceof eh?t:new eM(t instanceof Error?t.message:t))}},i=t&&setTimeout(()=>{i=null,o(new eh(`timeout of ${t}ms exceeded`,eh.ETIMEDOUT))},t),s=()=>{e&&(i&&clearTimeout(i),i=null,e.forEach(e=>{e.unsubscribe?e.unsubscribe(o):e.removeEventListener("abort",o)}),e=null)};e.forEach(e=>e.addEventListener("abort",o,{once:!0}));let{signal:a}=r;return a.unsubscribe=()=>Z.asap(s),a})([f,h&&h.toAbortSignal()],b),B=null,U=P&&P.unsubscribe&&(()=>{P.unsubscribe()}),j=null,N=()=>new eh("Request body larger than maxBodyLength limit",eh.ERR_BAD_REQUEST,e,B);try{var L;let i,f,h,b,D=(f="auth",Z.hasOwnProp(e,f)?e[f]:void 0);if(D){let e=Z.getSafeProp(D,"username")||"",t=Z.getSafeProp(D,"password")||"";i={username:e,password:t}}if(h=(L=r).indexOf("://"),b=L,-1!==h&&(b=b.slice(h+3)),b.includes("@")||b.includes(":")){let e=new URL(r,ej.origin);if(!i&&(e.username||e.password)){let t=tr(e.username),r=tr(e.password);i={username:t,password:r}}(e.username||e.password)&&(e.username="",e.password="",r=e.href)}if(i){let e;R.delete("authorization"),R.set("Authorization","Basic "+btoa((e=(i.username||"")+":"+(i.password||""),encodeURIComponent(e).replace(/%([0-9A-F]{2})/gi,(e,t)=>String.fromCharCode(parseInt(t,16))))))}if(T&&"string"==typeof r&&r.startsWith("data:")&&function(e){if(!e||"string"!=typeof e||!e.startsWith("data:"))return 0;let t=e.indexOf(",");if(t<0)return 0;let r=e.slice(5,t),n=e.slice(t+1);if(/;base64/i.test(r)){let e=n.length,t=n.length;for(let r=0;r<t;r++)if(37===n.charCodeAt(r)&&r+2<t){let t=n.charCodeAt(r+1),o=n.charCodeAt(r+2);e7(t)&&e7(o)&&(e-=2,r+=2)}let r=0,o=t-1,i=e=>e>=2&&37===n.charCodeAt(e-2)&&51===n.charCodeAt(e-1)&&(68===n.charCodeAt(e)||100===n.charCodeAt(e));o>=0&&(61===n.charCodeAt(o)?(r++,o--):i(o)&&(r++,o-=3)),1===r&&o>=0&&(61===n.charCodeAt(o)?r++:i(o)&&r++);let s=3*Math.floor(e/4)-(r||0);return s>0?s:0}let o=0;for(let e=0,t=n.length;e<t;e++){let r=n.charCodeAt(e);if(37===r&&e9(n,e,t))o+=1,e+=2;else if(r<128)o+=1;else if(r<2048)o+=2;else if(r>=55296&&r<=56319&&e+1<t){let t=n.charCodeAt(e+1);t>=56320&&t<=57343?(o+=4,e++):o+=3}else o+=3}return o}(r)>S)throw new eh("maxContentLength size of "+S+" exceeded",eh.ERR_BAD_RESPONSE,e,B);if(C&&"get"!==n&&"head"!==n){let e=await g(u);if("number"==typeof e&&isFinite(e)&&(t=e,e>_))throw N()}let k=C&&(Z.isReadableStream(u)||Z.isStream(u)),I=(e,t,r)=>e4(e,65536,e=>{if(C&&e>_)throw j=N();t&&t(e)},r);if(p&&"get"!==n&&"head"!==n&&(E||k)){if(t=null==t?await m(R,u):t,0!==t||k){let e,n=new s(r,{method:"POST",body:u,duplex:"half"});if(Z.isFormData(u)&&(e=n.headers.get("content-type"))&&R.setContentType(e),n.body){let[e,r]=E&&eJ(t,eH(e$(E)))||[];u=I(n.body,e,r)}}}else if(k&&!l&&c&&"get"!==n&&"head"!==n)u=I(u);else if(k&&l&&!p&&"get"!==n&&"head"!==n)throw new eh("Stream request bodies are not supported by the current fetch implementation",eh.ERR_NOT_SUPPORT,e,B);Z.isString(O)||(O=O?"include":"omit");let F=l&&"credentials"in s.prototype;if(Z.isFormData(u)){let e=R.getContentType();e&&/^multipart\/form-data/i.test(e)&&!/boundary=/i.test(e)&&R.delete("content-type")}R.set("User-Agent","axios/"+te,!1);let M={...A,signal:P,method:n.toUpperCase(),headers:ei(R.normalize()),body:u,duplex:"half",credentials:F?O:void 0};B=l&&new s(r,M);let q=await (l?x(B,A):x(r,M)),z=ef.from(q.headers);if(T){let t=Z.toFiniteNumber(z.getContentLength());if(null!=t&&t>S)throw new eh("maxContentLength size of "+S+" exceeded",eh.ERR_BAD_RESPONSE,e,B)}let W=d&&("stream"===v||"response"===v);if(d&&q.body&&(w||T||W&&U)){let t={};["status","statusText","headers"].forEach(e=>{t[e]=q[e]});let r=Z.toFiniteNumber(z.getContentLength()),[n,o]=w&&eJ(r,eH(e$(w),!0))||[];q=new a(e4(q.body,65536,t=>{if(T&&t>S)throw new eh("maxContentLength size of "+S+" exceeded",eh.ERR_BAD_RESPONSE,e,B);n&&n(t)},()=>{o&&o(),U&&U()}),t)}v=v||"text";let H=await y[Z.findKey(y,v)||"text"](q,e);if(T&&!d&&!W){let t;if(null!=H&&("number"==typeof H.byteLength?t=H.byteLength:"number"==typeof H.size?t=H.size:"string"==typeof H&&(t="function"==typeof o?new o().encode(H).byteLength:H.length)),"number"==typeof t&&t>S)throw new eh("maxContentLength size of "+S+" exceeded",eh.ERR_BAD_RESPONSE,e,B)}return!W&&U&&U(),await new Promise((t,r)=>{eq(t,r,{data:H,headers:ef.from(q.headers),status:q.status,statusText:q.statusText,config:e,request:B})})}catch(t){if(U&&U(),P&&P.aborted&&P.reason instanceof eh){let r=P.reason;throw r.config=e,B&&(r.request=B),t!==r&&Object.defineProperty(r,"cause",{__proto__:null,value:t,writable:!0,enumerable:!1,configurable:!0}),r}if(j)throw B&&!j.request&&(j.request=B),j;if(t instanceof eh)throw B&&!t.request&&(t.request=B),t;if(t&&"TypeError"===t.name&&/Load failed|fetch/i.test(t.message)){let r=new eh("Network Error",eh.ERR_NETWORK,e,B,t&&t.response);throw Object.defineProperty(r,"cause",{__proto__:null,value:t.cause||t,writable:!0,enumerable:!1,configurable:!0}),r}throw eh.from(t,t&&t.code,e,B,t&&t.response)}}},ti=new Map,ts=e=>{let t=e&&e.env||{},{fetch:r,Request:n,Response:o}=t,i=[n,o,r],s=i.length,a,u,l=ti;for(;s--;)a=i[s],void 0===(u=l.get(a))&&l.set(a,u=s?new Map:to(t)),l=u;return u};ts();let ta={http:null,xhr:e5,fetch:{get:ts}};Z.forEach(ta,(e,t)=>{if(e){try{Object.defineProperty(e,"name",{__proto__:null,value:t})}catch(e){}Object.defineProperty(e,"adapterName",{__proto__:null,value:t})}});let tu=e=>`- ${e}`,tl=e=>Z.isFunction(e)||null===e||!1===e,tf=function(e,t){let r,n,{length:o}=e=Z.isArray(e)?e:[e],i={};for(let s=0;s<o;s++){let o;if(n=r=e[s],!tl(r)&&void 0===(n=ta[(o=String(r)).toLowerCase()]))throw new eh(`Unknown adapter '${o}'`);if(n&&(Z.isFunction(n)||(n=n.get(t))))break;i[o||"#"+s]=n}if(!n){let e=Object.entries(i).map(([e,t])=>`adapter ${e} `+(!1===t?"is not supported by the environment":"is not available in the build"));throw new eh("There is no suitable adapter to dispatch the request "+(o?e.length>1?"since :\n"+e.map(tu).join("\n"):" "+tu(e[0]):"as no adapter specified"),eh.ERR_NOT_SUPPORT)}return n};function tc(e){if(e.cancelToken&&e.cancelToken.throwIfRequested(),e.signal&&e.signal.aborted)throw new eM(null,e)}function th(e){return tc(e),e.headers=ef.from(e.headers),e.data=eI.call(e,e.transformRequest),-1!==["post","put","patch"].indexOf(e.method)&&e.headers.setContentType("application/x-www-form-urlencoded",!1),tf(e.adapter||ek.adapter,e)(e).then(function(t){tc(e),e.response=t;try{t.data=eI.call(e,e.transformResponse,t)}finally{delete e.response}return t.headers=ef.from(t.headers),t},function(t){if(!eF(t)&&(tc(e),t&&t.response)){e.response=t.response;try{t.response.data=eI.call(e,e.transformResponse,t.response)}finally{delete e.response}t.response.headers=ef.from(t.response.headers)}return Promise.reject(t)})}let tp={};["object","boolean","number","function","string","symbol"].forEach((e,t)=>{tp[e]=function(r){return typeof r===e||"a"+(t<1?"n ":" ")+e}});let td={};tp.transitional=function(e,t,r){function n(e,t){return"[Axios v"+te+"] Transitional option '"+e+"'"+t+(r?". "+r:"")}return(r,o,i)=>{if(!1===e)throw new eh(n(o," has been removed"+(t?" in "+t:"")),eh.ERR_DEPRECATED);return t&&!td[o]&&(td[o]=!0,console.warn(n(o," has been deprecated since v"+t+" and will be removed in the near future"))),!e||e(r,o,i)}},tp.spelling=function(e){return(t,r)=>(console.warn(`${r} is likely a misspelling of ${e}`),!0)};let ty=function(e,t,r){if("object"!=typeof e||null===e)throw new eh("options must be an object",eh.ERR_BAD_OPTION_VALUE);let n=Object.keys(e),o=n.length;for(;o-- >0;){let i=n[o],s=Object.prototype.hasOwnProperty.call(t,i)?t[i]:void 0;if(s){let t=e[i],r=void 0===t||s(t,i,e);if(!0!==r)throw new eh("option "+i+" must be "+r,eh.ERR_BAD_OPTION_VALUE);continue}if(!0!==r)throw new eh("Unknown option "+i,eh.ERR_BAD_OPTION)}};class tg{constructor(e){this.defaults=e||{},this.interceptors={request:new eO,response:new eO}}async request(e,t){try{return await this._request(e,t)}catch(e){if(e instanceof Error){let t={};Error.captureStackTrace?Error.captureStackTrace(t):t=Error();let r=(()=>{if(!t.stack)return"";let e=t.stack.indexOf("\n");return -1===e?"":t.stack.slice(e+1)})();try{if(e.stack){if(r){let t=r.indexOf("\n"),n=-1===t?-1:r.indexOf("\n",t+1),o=-1===n?"":r.slice(n+1);String(e.stack).endsWith(o)||(e.stack+="\n"+r)}}else e.stack=r}catch(e){}}throw e}}_request(e,t){let r,n;"string"==typeof e?(t=t||{}).url=e:t=e||{};let{transitional:o,paramsSerializer:i,headers:s}=t=e0(this.defaults,t);void 0!==o&&ty(o,{silentJSONParsing:tp.transitional(tp.boolean),forcedJSONParsing:tp.transitional(tp.boolean),clarifyTimeoutError:tp.transitional(tp.boolean),legacyInterceptorReqResOrdering:tp.transitional(tp.boolean),advertiseZstdAcceptEncoding:tp.transitional(tp.boolean),validateStatusUndefinedResolves:tp.transitional(tp.boolean)},!1),null!=i&&(Z.isFunction(i)?t.paramsSerializer={serialize:i}:ty(i,{encode:tp.function,serialize:tp.function},!0)),void 0!==t.allowAbsoluteUrls||(void 0!==this.defaults.allowAbsoluteUrls?t.allowAbsoluteUrls=this.defaults.allowAbsoluteUrls:t.allowAbsoluteUrls=!0),ty(t,{baseUrl:tp.spelling("baseURL"),withXsrfToken:tp.spelling("withXSRFToken")},!0),t.method=(t.method||this.defaults.method||"get").toLowerCase();let a=s&&Z.merge(s.common,s[t.method]);s&&Z.forEach(["delete","get","head","post","put","patch","query","common"],e=>{delete s[e]}),t.headers=ef.concat(a,s);let u=[],l=!0;this.interceptors.request.forEach(function(e){if("function"==typeof e.runWhen&&!1===e.runWhen(t))return;l=l&&e.synchronous;let r=t.transitional||eA;r&&r.legacyInterceptorReqResOrdering?u.unshift(e.fulfilled,e.rejected):u.push(e.fulfilled,e.rejected)});let f=[];this.interceptors.response.forEach(function(e){f.push(e.fulfilled,e.rejected)});let c=0;if(!l){let e=[th.bind(this),void 0];for(e.unshift(...u),e.push(...f),n=e.length,r=Promise.resolve(t);c<n;)r=r.then(e[c++],e[c++]);return r}n=u.length;let h=t;for(;c<n;){let e=u[c++],t=u[c++];try{h=e(h)}catch(e){t.call(this,e);break}}try{r=th.call(this,h)}catch(e){return Promise.reject(e)}for(c=0,n=f.length;c<n;)r=r.then(f[c++],f[c++]);return r}getUri(e){return eR(eQ((e=e0(this.defaults,e)).baseURL,e.url,e.allowAbsoluteUrls,e),e.params,e.paramsSerializer)}}Z.forEach(["delete","get","head","options"],function(e){tg.prototype[e]=function(t,r){return this.request(e0(r||{},{method:e,url:t,data:r&&Z.hasOwnProp(r,"data")?r.data:void 0}))}}),Z.forEach(["post","put","patch","query"],function(e){function t(t){return function(r,n,o){return this.request(e0(o||{},{method:e,headers:t?{"Content-Type":"multipart/form-data"}:{},url:r,data:n}))}}tg.prototype[e]=t(),"query"!==e&&(tg.prototype[e+"Form"]=t(!0))});class tm{constructor(e){let t;if("function"!=typeof e)throw TypeError("executor must be a function.");this.promise=new Promise(function(e){t=e});const r=this;this.promise.then(e=>{if(!r._listeners)return;let t=r._listeners.length;for(;t-- >0;)r._listeners[t](e);r._listeners=null}),this.promise.then=e=>{let t,n=new Promise(e=>{r.subscribe(e),t=e}).then(e);return n.cancel=function(){r.unsubscribe(t)},n},e(function(e,n,o){r.reason||(r.reason=new eM(e,n,o),t(r.reason))})}throwIfRequested(){if(this.reason)throw this.reason}subscribe(e){this.reason?e(this.reason):this._listeners?this._listeners.push(e):this._listeners=[e]}unsubscribe(e){if(!this._listeners)return;let t=this._listeners.indexOf(e);-1!==t&&this._listeners.splice(t,1)}toAbortSignal(){let e=new AbortController,t=t=>{e.abort(t)};return this.subscribe(t),e.signal.unsubscribe=()=>this.unsubscribe(t),e.signal}static source(){let e;return{token:new tm(function(t){e=t}),cancel:e}}}let tb={Continue:100,SwitchingProtocols:101,Processing:102,EarlyHints:103,Ok:200,Created:201,Accepted:202,NonAuthoritativeInformation:203,NoContent:204,ResetContent:205,PartialContent:206,MultiStatus:207,AlreadyReported:208,ImUsed:226,MultipleChoices:300,MovedPermanently:301,Found:302,SeeOther:303,NotModified:304,UseProxy:305,Unused:306,TemporaryRedirect:307,PermanentRedirect:308,BadRequest:400,Unauthorized:401,PaymentRequired:402,Forbidden:403,NotFound:404,MethodNotAllowed:405,NotAcceptable:406,ProxyAuthenticationRequired:407,RequestTimeout:408,Conflict:409,Gone:410,LengthRequired:411,PreconditionFailed:412,PayloadTooLarge:413,UriTooLong:414,UnsupportedMediaType:415,RangeNotSatisfiable:416,ExpectationFailed:417,ImATeapot:418,MisdirectedRequest:421,UnprocessableEntity:422,Locked:423,FailedDependency:424,TooEarly:425,UpgradeRequired:426,PreconditionRequired:428,TooManyRequests:429,RequestHeaderFieldsTooLarge:431,UnavailableForLegalReasons:451,InternalServerError:500,NotImplemented:501,BadGateway:502,ServiceUnavailable:503,GatewayTimeout:504,HttpVersionNotSupported:505,VariantAlsoNegotiates:506,InsufficientStorage:507,LoopDetected:508,NotExtended:510,NetworkAuthenticationRequired:511,WebServerIsDown:521,ConnectionTimedOut:522,OriginIsUnreachable:523,TimeoutOccurred:524,SslHandshakeFailed:525,InvalidSslCertificate:526};Object.entries(tb).forEach(([e,t])=>{tb[t]=e});let tw=function e(t){let r=new tg(t),n=f(tg.prototype.request,r);return Z.extend(n,tg.prototype,r,{allOwnKeys:!0}),Z.extend(n,r,null,{allOwnKeys:!0}),n.create=function(r){return e(e0(t,r))},n}(ek);tw.Axios=tg,tw.CanceledError=eM,tw.CancelToken=tm,tw.isCancel=eF,tw.VERSION=te,tw.toFormData=em,tw.AxiosError=eh,tw.Cancel=tw.CanceledError,tw.all=function(e){return Promise.all(e)},tw.spread=function(e){return function(t){return e.apply(null,t)}},tw.isAxiosError=function(e){return Z.isObject(e)&&!0===e.isAxiosError},tw.mergeConfig=e0,tw.AxiosHeaders=ef,tw.formToJSON=e=>eL(Z.isHTMLForm(e)?new FormData(e):e),tw.getAdapter=tf,tw.HttpStatusCode=tb,tw.default=tw;let tE=("undefined"!=typeof window&&window.location&&"cas.bareskrim.polri.go.id"===window.location.hostname)?window.location.origin:"https://api-cas.bareskrim.polri.go.id",
  tv=tw.create({baseURL:`${tE}/api`,headers:{"Content-Type":"application/json"}}),
  tR=tw.create({baseURL:`${tE}/api`,headers:{"Content-Type":"application/json"}}),
  bdbIdleMs=144e5,
  bdbActivityKey="bdb.auth.last_activity",
  bdbRetryKey="__bdbAuthRetry",
  bdbRefreshLockName="bdb-auth-refresh",
  bdbRefreshLockKey="bdb.auth.refresh_lock",
  bdbRefreshPromise=null,
  bdbLastActivityWrite=0,
  bdbLogoutStarted=!1,
  bdbTabId="bdb-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2);

function bdbReadAuth(){
  try{return JSON.parse(localStorage.getItem("auth")||"null")||{}}
  catch{return{}}
}

function bdbCurrentAccess(){
  return localStorage.getItem("auth.access_token")||(bdbReadAuth().access_token??"")
}

function bdbCurrentRefresh(){
  return localStorage.getItem("auth.refresh")||(bdbReadAuth().refresh_token??"")
}

function bdbStoreAuth(e){
  let t={...bdbReadAuth(),...e};
  localStorage.setItem("auth",JSON.stringify(t));
  e.expires_at&&localStorage.setItem("auth.expires_at",String(e.expires_at));
  e.access_token&&localStorage.setItem("auth.access_token",String(e.access_token));
  e.refresh_token&&localStorage.setItem("auth.refresh",String(e.refresh_token))
}

function bdbIsIdle(e=Date.now()){
  let t=Number(localStorage.getItem(bdbActivityKey)||0);
  return!!t&&e-t>bdbIdleMs
}

function bdbIsPublicPanduanShare(){
  try{
    return typeof window!=="undefined"&&window.location.pathname.startsWith("/cms/panduan")&&new URLSearchParams(window.location.search).has("share")
  }catch{return!1}
}

function tS(reasonUrl){if(bdbIsPublicPanduanShare()&&!bdbCurrentAccess())return;if(bdbLogoutStarted)return;bdbLogoutStarted=!0;try{let _tok=bdbCurrentAccess();if(_tok&&typeof fetch==="function"){fetch(tE+"/api/Authentication/logout",{method:"GET",headers:{Authorization:"Bearer "+_tok},keepalive:!0}).catch(()=>{})}}catch(_e){}try{if(window.caches)caches.keys().then(k=>Promise.all(k.map(n=>caches.delete(n))))}catch(_e){}try{sessionStorage.clear()}catch(_e){}try{["auth.access_token","auth","user","auth.expires_at","auth.refresh","impersonator_stash","bdb.auth.last_activity"].forEach(k=>localStorage.removeItem(k));localStorage.setItem("bdb.auth.logout_broadcast",String(Date.now()));localStorage.clear()}catch(_e){}try{if(typeof BroadcastChannel!=="undefined"){let bc=new BroadcastChannel("bdb_auth_channel");bc.postMessage({type:"LOGOUT",ts:Date.now()});bc.close()}}catch(_e){}try{if(window.indexedDB){indexedDB.deleteDatabase("bdb_offline_db");indexedDB.deleteDatabase("keyval-store")}}catch(_e){}if(bdbIsPublicPanduanShare()){bdbLogoutStarted=!1;return}let targetUrl=typeof reasonUrl==="string"&&reasonUrl?reasonUrl:"/login?expired=1";if(!window.location.pathname.startsWith("/login")){"function"==typeof window.location.replace?window.location.replace(targetUrl):window.location.href=targetUrl}}

function bdbMarkActivity(){
  if(!bdbCurrentAccess()||bdbLogoutStarted)return;
  let e=Date.now(),t=Number(localStorage.getItem(bdbActivityKey)||0);
  if(t&&e-t>bdbIdleMs)return void tS();
  if(e-bdbLastActivityWrite>15e3){
    bdbLastActivityWrite=e;
    localStorage.setItem(bdbActivityKey,String(e))
  }
}

function bdbTokenNearExpiry(e){
  let t=[];
  try{
    let r=e.split(".")[1].replace(/-/g,"+").replace(/_/g,"/");
    r+="=".repeat((4-r.length%4)%4);
    let n=Number(JSON.parse(atob(r)).exp);
    Number.isFinite(n)&&t.push(1e3*n)
  }catch{}
  let r=Date.parse(localStorage.getItem("auth.expires_at")||"");
  Number.isFinite(r)&&t.push(r);
  return!!t.length&&Math.min(...t)-Date.now()<12e4
}

function bdbDelay(e){return new Promise(t=>setTimeout(t,e))}

function bdbReadRefreshLock(){
  try{return JSON.parse(localStorage.getItem(bdbRefreshLockKey)||"null")}
  catch{return null}
}

async function bdbDoRefresh(){
  if(bdbIsIdle())throw Error("Sesi berakhir karena tidak ada aktivitas.");
  let e=bdbCurrentRefresh();
  if(!e)throw Error("Refresh token tidak tersedia.");
  let t=await tv.post("/Authentication/refresh-token",{refresh_token:e},{timeout:15e3}),r=t?.data?.data;
  if(0===t?.data?.status||!r?.access_token||!r?.refresh_token)throw Error(t?.data?.message||"Refresh token gagal.");
  bdbStoreAuth(r);
  return r.access_token
}

async function bdbFallbackRefreshLock(e,t){
  let r=Date.now()+2e4;
  while(Date.now()<r){
    if(bdbIsIdle())throw Error("Sesi berakhir karena tidak ada aktivitas.");
    let n=bdbCurrentAccess();
    if(n&&n!==t&&!bdbTokenNearExpiry(n))return n;
    let o=Date.now(),i=bdbReadRefreshLock();
    if(!i||!i.owner||Number(i.expires||0)<=o){
      let i={owner:bdbTabId,expires:o+2e4};
      localStorage.setItem(bdbRefreshLockKey,JSON.stringify(i));
      await bdbDelay(60+Math.floor(40*Math.random()));
      let s=bdbReadRefreshLock();
      if(s?.owner===bdbTabId){
        try{return await e()}
        finally{bdbReadRefreshLock()?.owner===bdbTabId&&localStorage.removeItem(bdbRefreshLockKey)}
      }
    }else await bdbDelay(100)
  }
  let n=bdbCurrentAccess();
  if(n&&n!==t&&!bdbTokenNearExpiry(n))return n;
  throw Error("Refresh token sedang diproses terlalu lama.")
}

async function bdbRefreshUnderLock(e){
  let t=async()=>{
    if(bdbIsIdle())throw Error("Sesi berakhir karena tidak ada aktivitas.");
    let t=bdbCurrentAccess();
    return t&&t!==e&&!bdbTokenNearExpiry(t)?t:bdbDoRefresh()
  };
  return"undefined"!=typeof navigator&&navigator.locks?.request
    ?navigator.locks.request(bdbRefreshLockName,{mode:"exclusive"},t)
    :bdbFallbackRefreshLock(t,e)
}

async function bdbRefreshAccessToken(){
  if(bdbIsIdle())throw Error("Sesi berakhir karena tidak ada aktivitas.");
  if(bdbRefreshPromise)return bdbRefreshPromise;
  let e=bdbCurrentAccess();
  bdbRefreshPromise=bdbRefreshUnderLock(e).finally(()=>{bdbRefreshPromise=null});
  return bdbRefreshPromise
}

async function bdbRecoverRequest(e){
  if(!e||e[bdbRetryKey]||bdbIsIdle())throw Error("Sesi berakhir, silakan login ulang.");
  e[bdbRetryKey]=!0;
  let t=await bdbRefreshAccessToken();
  e.headers=e.headers||{};
  e.headers.Authorization=`Bearer ${t}`;
  return tR.request(e)
}

if("undefined"!=typeof window&&!window.__bdbIdleRefreshBound){
  window.__bdbIdleRefreshBound=!0;
  let e=()=>{if(window.location.pathname.startsWith("/cms")&&!bdbCurrentAccess()&&!bdbIsPublicPanduanShare())return void tS("/login");bdbMarkActivity()};
  ["pointerdown","mousemove","keydown","scroll","touchstart"].forEach(t=>window.addEventListener(t,e,{passive:!0}));
  document.addEventListener("visibilitychange",()=>{"visible"===document.visibilityState&&e()});
  window.addEventListener("focus",e);
  window.addEventListener("storage",ev=>{if(ev.key===null||ev.key==="bdb.auth.logout_broadcast"||((ev.key==="auth.access_token"||ev.key==="auth"||ev.key==="user")&&!ev.newValue)){if(!bdbCurrentAccess()&&!bdbIsPublicPanduanShare())tS("/login")}});
  try{if(typeof BroadcastChannel!=="undefined"){let bc=new BroadcastChannel("bdb_auth_channel");bc.onmessage=ev=>{if(ev?.data?.type==="LOGOUT"&&!bdbIsPublicPanduanShare())tS("/login")}}}catch(_e){}
  bdbMarkActivity();
  window.setInterval(()=>{if(window.location.pathname.startsWith("/cms")&&!bdbCurrentAccess()&&!bdbIsPublicPanduanShare())return void tS("/login");if(!bdbIsPublicPanduanShare()&&bdbIsIdle())tS("/login?expired=1")},4e3)
}

tv.interceptors.request.use(async e => {
  if (typeof window !== "undefined" && !window.navigator.onLine && String(e.method || "GET").toUpperCase() === "GET") {
    if (window.bdbOffline && typeof window.bdbOffline.getApiCache === "function") {
      try {
        const cached = await window.bdbOffline.getApiCache(e.url, e.params);
        if (cached && cached.data) {
          e.adapter = async () => ({
            data: cached.data,
            status: 200,
            statusText: "OK (Offline Fast-Path)",
            headers: { "x-bdb-cache": "hit" },
            config: e,
            request: {},
            __from_cache: true
          });
          window.bdbShowOfflineToast && window.bdbShowOfflineToast();
        }
      } catch (cErr) {}
    }
  }
  return e;
});

tv.interceptors.response.use(
  e => {
    if (e?.config && (!e.config.method || String(e.config.method).toUpperCase() === "GET") && e.status === 200) {
      if (typeof window !== "undefined" && window.bdbOffline) {
        window.bdbOffline.saveApiCache(e.config.url, e.config.params, e.data);
      }
    }
    return e;
  },
  async e => {
    const m = String(e?.config?.method || "GET").toUpperCase();
    const isGet = m === "GET";
    const isNetErr = typeof window !== "undefined" && (!window.navigator.onLine || !e?.response || (e?.response?.status >= 500) || e?.code === "ECONNABORTED" || String(e?.message||"").includes("Network Error"));
    if (isGet && isNetErr && typeof window !== "undefined" && window.bdbOffline) {
      try {
        const _cfg = e?.config || e?.response?.config; if (!_cfg || !_cfg.url) return Promise.reject(e); const cached = await window.bdbOffline.getApiCache(_cfg.url, _cfg.params);
        if (cached && cached.data) {
          window.bdbShowOfflineToast && window.bdbShowOfflineToast();
          return { data: cached.data, status: 200, statusText: "OK (Offline Cache Fallback)", headers: { "x-bdb-cache": "fallback" }, config: e.config, request: {}, __from_cache: true };
        }
      } catch (cErr) {}
    }
    return Promise.reject(e);
  }
);
tR.interceptors.request.use(async e => {
  if (bdbIsIdle()) throw tS(), Error("Sesi berakhir karena tidak ada aktivitas.");
  let t = bdbCurrentAccess();
  if (!t) { tS(); const err = Error("Sesi login tidak ditemukan."); err.__bdbAuthFatal = true; throw err; }
  if (bdbTokenNearExpiry(t)) {
    try { t = await bdbRefreshAccessToken(); }
    catch (rErr) { tS(); if (rErr && typeof rErr === "object") rErr.__bdbAuthFatal = true; throw rErr; }
  }
  t && (e.headers.Authorization = "Bearer " + t);
  const reqMethod = String(e.method || "GET").toUpperCase();
  if (["POST", "PUT", "PATCH", "DELETE"].includes(reqMethod)) {
    try {
      const activeU = JSON.parse(localStorage.getItem("user") || "null");
      const roleBdb = String(activeU?.role_bdb || activeU?.requested_role_bdb || activeU?.role?.role_name || "").toLowerCase();
      const reqUrl = String(e.url || "");
      const isAllowedMut = reqUrl.includes("/Authentication/logout") || reqUrl.includes("/Authentication/refresh") || reqUrl.includes("/network/probe");
      if ((roleBdb === "vendor_mitra" || roleBdb === "vendor" || roleBdb === "mitra") && !isAllowedMut) {
        if (typeof window !== "undefined" && typeof document !== "undefined") {
          try {
            let toastEl = document.getElementById("cas-vendor-readonly-toast");
            if (!toastEl) {
              toastEl = document.createElement("div");
              toastEl.id = "cas-vendor-readonly-toast";
              toastEl.style.cssText = "position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:99999;background:#0f172a;color:#f8fafc;border:1px solid #f59e0b;border-radius:10px;padding:10px 18px;font-size:13px;font-weight:700;box-shadow:0 10px 30px rgba(0,0,0,0.45);display:flex;align-items:center;gap:8px;";
              document.body.appendChild(toastEl);
            }
            toastEl.textContent = "🔒 Mode Vendor / Mitra (Read-Only): Akun Anda hanya memiliki akses lihat.";
            toastEl.style.display = "flex";
            clearTimeout(window.__casVendorToastTimer);
            window.__casVendorToastTimer = setTimeout(() => { if (toastEl) toastEl.style.display = "none"; }, 3500);
          } catch (_te) {}
        }
        const roErr = Error("Mode Vendor / Mitra (Read-Only): Akses tulis dinonaktifkan.");
        roErr.__bdbVendorReadOnly = true;
        roErr.response = { status: 403, data: { status: 0, message: "Mode Vendor / Mitra (Read-Only): Akses tulis dinonaktifkan." } };
        throw roErr;
      }
    } catch (roEx) {
      if (roEx && roEx.__bdbVendorReadOnly) throw roEx;
    }
  }
  if (typeof window !== "undefined" && !window.navigator.onLine && reqMethod === "GET") {
    if (window.bdbOffline && typeof window.bdbOffline.getApiCache === "function") {
      try {
        const cached = await window.bdbOffline.getApiCache(e.url, e.params);
        if (cached && cached.data) {
          e.adapter = async () => ({
            data: cached.data,
            status: 200,
            statusText: "OK (Offline Fast-Path)",
            headers: {},
            config: e,
            request: {},
            __from_cache: true
          });
          window.bdbShowOfflineToast && window.bdbShowOfflineToast();
        }
      } catch (cErr) {}
    }
  }
  return e;
});;

let tO=["invalid signature","jwt expired","invalid token","token expired","authorization token not found","belum tergabung ke organisasi"];
function tA(e){
  if(!e||"object"!=typeof e||0!==e.status)return!1;
  let t=String(e.message||"").toLowerCase();
  return tO.some(e=>t.includes(e))
}

tR.interceptors.response.use(
  e => {
    if (tA(e?.data)) return bdbRecoverRequest(e.config).catch(t => (tS(), Promise.reject(t)));
    // Cache successful GET API responses for offline menu availability
    if (e?.config && (!e.config.method || String(e.config.method).toUpperCase() === 'GET') && e.status === 200) {
      if (typeof window !== 'undefined' && window.bdbOffline) {
        window.bdbOffline.saveApiCache(e.config.url, e.config.params, e.data);
      }
    }
    return e;
  },
  async e => {
    if (e?.__bdbAuthFatal || e?.__bdbVendorReadOnly) return Promise.reject(e);
    if (e?.response?.status === 401 || tA(e?.response?.data)) {
      return bdbRecoverRequest(e.config).catch(t => (tS(), Promise.reject(t)));
    }
    const m = String(e?.config?.method || 'GET').toUpperCase();
    const isGet = m === 'GET';
    const isMut = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(m);
    const status = e?.response?.status || 0;
    if (isGet && [502, 503, 504].includes(status) && e?.config && (e.config.__bdb502Retry || 0) < 2) {
      e.config.__bdb502Retry = (e.config.__bdb502Retry || 0) + 1;
      await bdbDelay(850 * e.config.__bdb502Retry);
      return tR.request(e.config);
    }
    const isNetErr = typeof window !== 'undefined' && (!window.navigator.onLine || !e?.response || (status >= 500) || e?.code === 'ECONNABORTED' || String(e?.message||'').includes('Network Error'));

    // 1. Recover GET requests from offline cache
    if (isGet && isNetErr && typeof window !== 'undefined' && window.bdbOffline) {
      try {
        const cached = await window.bdbOffline.getApiCache(e.config.url, e.config.params);
        if (cached && cached.data) {
                      // Bottom offline toast suppressed as per user request
            try { let _t = document.getElementById("bdb-offline-toast"); if (_t) _t.remove(); } catch {}
          return {
            status: 200,
            statusText: 'OK (Mode Offline Cache)',
            headers: {},
            config: e.config,
            data: cached.data,
            __from_cache: true
          };
        }
      } catch (cErr) {
        console.warn('[BDB Offline] Cache lookup error:', cErr);
      }
    }

    // 2. Queue mutations into offline outbox
    if (isMut && isNetErr && !e?.config?.__bdbSkipOfflineQueue && typeof window !== 'undefined' && window.bdbOffline) {
      try {
        await window.bdbOffline.queueOutbox(e.config);
        return {
          status: 200,
          statusText: 'OK (Offline Queued)',
          headers: {},
          config: e.config,
          data: { status: 1, message: 'Pekerjaan tersimpan di Mode Offline. Akan disinkronkan otomatis saat server online.', data: { __offline_queued: true } }
        };
      } catch (qErr) {
        console.error('[BDB Offline] Queue error:', qErr);
      }
    }
    return Promise.reject(e);
  });let t_=0,tT=new Set;function tC(){tT.forEach(e=>e(t_))}function tx(){t_=Math.max(0,t_-1),tC()}[tv,tR].forEach(e=>{e.interceptors.request.use(e=>(t_+=1,tC(),e),e=>(tx(),Promise.reject(e))),e.interceptors.response.use(e=>(tx(),e),e=>(tx(),Promise.reject(e)))}),e.s(["BACKEND_URL",0,tE,"api",0,tv,"apiAuth",0,tR,"assertOk",0,function(e){if(e.data?.status===0){let t=Error(e.data.message||"Terjadi kesalahan.");throw t.response={data:e.data},t}return e.data.data},"onLoading",0,function(e){return tT.add(e),e(t_),()=>{tT.delete(e)}}],54858)}]);

/* === BDB OFFLINE & AUTO-SYNC ENGINE LOGIC === */
if (typeof window !== "undefined" && !window.__bdbOfflineEngineReady) {
  window.__bdbOfflineEngineReady = true;
  window.addEventListener("error", function(ev) {
    if (ev && ev.message && (ev.message.includes("Minified React error #418") || ev.message.includes("reading 'startTime'"))) {
      ev.preventDefault();
      ev.stopImmediatePropagation();
    }
  }, true);
  /* Suppress Chrome unused <link rel="preload"> warnings after React hydration finishes */
  (function bdbCleanPreloadLinks() {
    setTimeout(() => {
      try {
        const neutralize = (el) => {
          if (!el || el.tagName !== "LINK") return;
          const rel = (el.getAttribute("rel") || "").toLowerCase();
          if (rel === "preload") {
            setTimeout(() => {
              try {
                if (el.getAttribute("rel") === "preload") {
                  el.removeAttribute("rel");
                }
              } catch (e) {}
            }, 1500);
          }
        };
        document.querySelectorAll('link[rel="preload"]').forEach(neutralize);
        if (typeof MutationObserver !== "undefined" && document.head) {
          const obs = new MutationObserver((mutations) => {
            for (const m of mutations) {
              m.addedNodes.forEach(neutralize);
            }
          });
          obs.observe(document.head, { childList: true });
        }
      } catch (e) {}
    }, 2500);
  })();

  const DB_NAME = "bdb_offline_db";
  const DB_VER = 2;
  let _idb = null;
  function bdbOpenDB() {
    if (_idb) return Promise.resolve(_idb);
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VER);
      req.onupgradeneeded = (e) => {
        const d = e.target.result;
        if (!d.objectStoreNames.contains("drafts")) d.createObjectStore("drafts", { keyPath: "id" });
        if (!d.objectStoreNames.contains("outbox")) {
          const ob = d.createObjectStore("outbox", { keyPath: "id" });
          ob.createIndex("userId", "userId", { unique: false });
        }
        if (!d.objectStoreNames.contains("api_cache")) {
          const ac = d.createObjectStore("api_cache", { keyPath: "cacheKey" });
          ac.createIndex("userId", "userId", { unique: false });
          ac.createIndex("menuKey", "menuKey", { unique: false });
          ac.createIndex("endpoint", "endpoint", { unique: false });
        }
      };
      req.onsuccess = () => { _idb = req.result; resolve(_idb); };
      req.onerror = () => reject(req.error);
    });
  }
  function bdbGetActiveUser() {
    try { const u = JSON.parse(localStorage.getItem("user") || "null"); return u && (u.id || u.user_id) ? u : null; } catch { return null; }
  }
  function bdbCurrentAccess() {
    try {
      return localStorage.getItem("auth.access_token") || (JSON.parse(localStorage.getItem("auth") || "null")?.access_token) || localStorage.getItem("token") || "";
    } catch { return ""; }
  }
  window.bdbShowOfflineToast = function() {
    try { let el = document.getElementById("bdb-offline-toast"); if (el) el.remove(); } catch {}
  };
  function bdbShowSuccessToast(msg) {
    try { let el = document.getElementById("bdb-offline-toast"); if (el) el.remove(); } catch {}
  }
  function bdbNormalizeUrl(url) {
    let u = String(url || "").split("?")[0].trim();
    if (u.startsWith("http://") || u.startsWith("https://")) {
      try { u = new URL(u).pathname; } catch {}
    }
    if (u.startsWith("/api/")) u = u.substring(4);
    else if (u.startsWith("/api")) u = u.substring(4);
    if (!u.startsWith("/")) u = "/" + u;
    return u;
  }
  function bdbBuildCacheKey(url, params) {
    const user = bdbGetActiveUser();
    const uid = user ? (user.id || user.user_id) : "anon";
    let pStr = "";
    if (params && typeof params === "object") {
      const ignored = new Set(["refresh", "_t", "_ts", "t", "timestamp", "_", "cache_bust"]);
      const keys = Object.keys(params).filter(k => !ignored.has(k) && params[k] !== undefined && params[k] !== "").sort();
      if (keys.length > 0) {
        pStr = "?" + keys.map(k => k + "=" + encodeURIComponent(String(params[k]))).join("&");
      }
    }
    const cleanUrl = bdbNormalizeUrl(url);
    return uid + ":" + cleanUrl + pStr;
  }
  async function bdbSaveApiCache(url, params, data) {
    try {
      if (!data || data.status === 0 || (typeof Blob !== "undefined" && data instanceof Blob)) return;
      const user = bdbGetActiveUser();
      const uid = user ? (user.id || user.user_id) : "anon";
      const db = await bdbOpenDB();
      const cleanUrl = bdbNormalizeUrl(url);
      const cacheKey = bdbBuildCacheKey(url, params);
      const menuKey = typeof window !== "undefined" ? window.location.pathname : "";
      const tx = db.transaction("api_cache", "readwrite");
      tx.objectStore("api_cache").put({ cacheKey, menuKey, endpoint: cleanUrl, userId: uid, url: cleanUrl, params, data, timestamp: Date.now() });
    } catch (e) {}
  }
  async function bdbClearAllCache() {
    try {
      sessionStorage.clear();
      localStorage.removeItem("bdb_current_user_id");
      localStorage.removeItem("bdb_last_preload_13");
      if (_idb) {
        try { _idb.close(); } catch(e){}
        _idb = null;
      }
      if (typeof indexedDB !== "undefined") {
        indexedDB.deleteDatabase(DB_NAME);
      }
    } catch (e) {}
  }
  window.bdbClearAllCache = bdbClearAllCache;

  function bdbCheckUserSession() {
    try {
      if (localStorage.getItem("bdb_cache_v3_cleaned") !== "1") {
        localStorage.setItem("bdb_cache_v3_cleaned", "1");
        bdbOpenDB().then(db => {
          try { db.transaction("api_cache", "readwrite").objectStore("api_cache").clear(); } catch(_e) {}
        }).catch(() => {});
      }
      const user = bdbGetActiveUser();
      const curUid = user ? String(user.id || user.user_id || "") : "";
      const prevUid = localStorage.getItem("bdb_current_user_id");
      if (curUid && curUid !== "anon") {
        if (prevUid && prevUid !== curUid) {
          console.log("[BDB Cache] Pergantian akun terdeteksi (" + prevUid + " -> " + curUid + "). Membersihkan cache lokal lama...");
          bdbClearAllCache();
          localStorage.setItem("bdb_current_user_id", curUid);
        } else if (!prevUid) {
          localStorage.setItem("bdb_current_user_id", curUid);
        }
      } else if (prevUid) {
        console.log("[BDB Cache] Sesi logout terdeteksi. Membersihkan cache lokal...");
        bdbClearAllCache();
      }
    } catch(e) {}
  }
  try { bdbCheckUserSession(); } catch(e) {}

  async function bdbGetApiCache(url, params) {
    try {
      bdbCheckUserSession();
      const user = bdbGetActiveUser();
      if (!user) return null;
      const uid = String(user.id || user.user_id || "");
      if (!uid || uid === "anon") return null;
      const db = await bdbOpenDB();
      const exactKey = bdbBuildCacheKey(url, params);
      return new Promise((resolve) => {
        const tx = db.transaction("api_cache", "readonly");
        const store = tx.objectStore("api_cache");
        const req = store.get(exactKey);
        req.onsuccess = () => {
          if (req.result?.data && String(req.result.userId) === uid) return resolve(req.result);
          const cleanUrl = bdbNormalizeUrl(url);
          const idx = store.index("endpoint");
          const fReq = idx.getAll(IDBKeyRange.only(cleanUrl));
          fReq.onsuccess = () => {
            const list = (fReq.result || []).filter(item => item && String(item.userId) === uid && item.data);
            if (list.length > 0) {
              list.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
              resolve(list[0]);
            } else { resolve(null); }
          };
          fReq.onerror = () => resolve(null);
        };
        req.onerror = () => resolve(null);
      });
    } catch { return null; }
  }
  async function bdbPreload13Periods(force = false) {
    // Passive caching via tR.interceptors.response is active; avoid firing 122 background queries on page load.
    if (typeof window !== "undefined") {
      window.__bdbPreloading = false;
      try { sessionStorage.setItem("bdb_last_preload_13", String(Date.now())); } catch (_e) {}
    }
    return;
  }
  async function bdbSaveDraft(key, data) {
    const user = bdbGetActiveUser();
    if (!user) return;
    const db = await bdbOpenDB();
    const id = (user.id || user.user_id) + ":" + (user.satker_id || 0) + ":" + key;
    const tx = db.transaction("drafts", "readwrite");
    tx.objectStore("drafts").put({ id, userId: user.id || user.user_id, satkerId: user.satker_id || 0, key, data, updatedAt: Date.now() });
  }
  async function bdbGetDraft(key) {
    const user = bdbGetActiveUser();
    if (!user) return null;
    const db = await bdbOpenDB();
    const id = (user.id || user.user_id) + ":" + (user.satker_id || 0) + ":" + key;
    return new Promise((resolve) => {
      const tx = db.transaction("drafts", "readonly");
      const req = tx.objectStore("drafts").get(id);
      req.onsuccess = () => resolve(req.result?.data || null);
      req.onerror = () => resolve(null);
    });
  }
  async function bdbQueueOutbox(config) {
    const user = bdbGetActiveUser();
    const db = await bdbOpenDB();
    const item = {
      id: "outbox-" + Date.now() + "-" + Math.random().toString(36).slice(2, 9),
      userId: user ? (user.id || user.user_id) : null,
      satkerId: user ? (user.satker_id || null) : null,
      url: config.url,
      method: (config.method || "POST").toUpperCase(),
      data: config.data,
      params: config.params,
      timestamp: Date.now(),
      status: "pending"
    };
    const tx = db.transaction("outbox", "readwrite");
    tx.objectStore("outbox").put(item);
    return item;
  }
  async function bdbGetOutboxCount() {
    try {
      const user = bdbGetActiveUser();
      if (!user) return 0;
      const uid = user.id || user.user_id;
      const db = await bdbOpenDB();
      return new Promise((resolve) => {
        const tx = db.transaction("outbox", "readonly");
        const idx = tx.objectStore("outbox").index("userId");
        const req = idx.count(IDBKeyRange.only(uid));
        req.onsuccess = () => resolve(req.result || 0);
        req.onerror = () => resolve(0);
      });
    } catch { return 0; }
  }
  let _isSyncing = false;
  let _resyncAuthStopped = false;
  async function bdbTriggerResync() {
    if (_isSyncing || _resyncAuthStopped) return;
    const token = bdbCurrentAccess();
    if (!token || bdbTokenNearExpiry(token)) return;
    const user = bdbGetActiveUser();
    if (!user) return;
    const outboxCount = await bdbGetOutboxCount();
    if (!outboxCount) return;
    const uid = user.id || user.user_id;
    const db = await bdbOpenDB();
    try {
      const res = await fetch("/api/bdb/system/orchestrator/queue-status", { method: "GET", cache: "no-store", headers: { Authorization: "Bearer " + token } });
      if (res.status === 401 || res.status === 403) { _resyncAuthStopped = true; return; }
      if (!res.ok) return;
    } catch { return; }
    _isSyncing = true;
    if (typeof window !== "undefined") {
      window.__bdbIsSyncing = true;
      window.dispatchEvent(new CustomEvent("bdb-sync-status", { detail: { syncing: true } }));
    }
    try {
      const tx = db.transaction("outbox", "readonly");
      const idx = tx.objectStore("outbox").index("userId");
      const req = idx.getAll(IDBKeyRange.only(uid));
      req.onsuccess = async () => {
        const items = req.result || [];
        if (!items.length) {
          _isSyncing = false;
          if (typeof window !== "undefined") {
            window.__bdbIsSyncing = false;
            window.dispatchEvent(new CustomEvent("bdb-sync-status", { detail: { syncing: false } }));
          }
          return;
        }
        for (const item of items) {
          if (item.userId !== uid) continue;
          try {
            const token = bdbCurrentAccess();
            await tR({ url: item.url, method: item.method, data: item.data, params: item.params, headers: { Authorization: "Bearer " + token, "X-Offline-Synced": "1" }, __bdbSkipOfflineQueue: true });
            const delTx = db.transaction("outbox", "readwrite");
            delTx.objectStore("outbox").delete(item.id);
          } catch (err) { break; }
        }
        _isSyncing = false;
        if (typeof window !== "undefined") {
          window.__bdbIsSyncing = false;
          window.dispatchEvent(new CustomEvent("bdb-sync-status", { detail: { syncing: false } }));
        }
      };
    } catch {
      _isSyncing = false;
      if (typeof window !== "undefined") {
        window.__bdbIsSyncing = false;
        window.dispatchEvent(new CustomEvent("bdb-sync-status", { detail: { syncing: false } }));
      }
    }
  }
  let _draftTimer = null;
  document.addEventListener("input", (e) => {
    const el = e.target;
    if (!el || !["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName)) return;
    if (el.type === "password" || el.type === "hidden") return;
    clearTimeout(_draftTimer);
    _draftTimer = setTimeout(() => {
      const form = el.closest("form") || document.querySelector("main") || document.body;
      const fields = form.querySelectorAll("input, textarea, select");
      const payload = {};
      fields.forEach(f => {
        if (f.type === "password" || f.type === "hidden" || f.type === "file" || f.type === "range" || f.type === "checkbox" || f.type === "radio") return;
        const key = f.name || f.id || f.getAttribute("placeholder");
        if (key && f.value) payload[key] = f.value;
      });
      if (Object.keys(payload).length > 0) bdbSaveDraft(window.location.pathname, payload);
    }, 600);
  }, { passive: true });
  async function bdbRestoreDraft() {
    const draft = await bdbGetDraft(window.location.pathname);
    if (!draft) return;
    const form = document.querySelector("main") || document.body;
    let count = 0;
    Object.keys(draft).forEach(key => {
      const el = form.querySelector('[name="' + key + '"], #' + CSS.escape(key));
      if (el && !el.value && draft[key]) {
        el.value = draft[key];
        el.dispatchEvent(new Event("input", { bubbles: true }));
        count++;
      }
    });
  }
  window.addEventListener("popstate", () => setTimeout(bdbRestoreDraft, 800));
  setTimeout(bdbRestoreDraft, 1200);
  setTimeout(bdbPreload13Periods, 2500);
  window.addEventListener("online", () => {
    bdbTriggerResync();
    setTimeout(() => bdbPreload13Periods(true), 2000);
  });
  window.addEventListener("storage", (e) => {
    if (e.key === "auth" && e.newValue) setTimeout(() => bdbPreload13Periods(true), 1500);
    if (e.key === null || e.key === "bdb.auth.logout_broadcast" || ((e.key === "auth" || e.key === "user" || e.key === "auth.access_token") && !e.newValue)) {
      bdbClearAllCache();
      const isPubShare = typeof window !== "undefined" && window.location.pathname.startsWith("/cms/panduan") && new URLSearchParams(window.location.search).has("share");
      if (!bdbCurrentAccess() && !window.location.pathname.startsWith("/login") && !isPubShare) {
        window.location.replace("/login");
      }
    }
  });
  setInterval(() => bdbPreload13Periods(true), 30 * 60 * 1000);
  setInterval(async () => {
    const c = await bdbGetOutboxCount();
    if (c > 0) bdbTriggerResync();
  }, 7000);
  window.bdbOffline = {
    saveDraft: bdbSaveDraft,
    getDraft: bdbGetDraft,
    queueOutbox: bdbQueueOutbox,
    getOutboxCount: bdbGetOutboxCount,
    triggerResync: bdbTriggerResync,
    saveApiCache: bdbSaveApiCache,
    getApiCache: bdbGetApiCache,
    preload13Periods: bdbPreload13Periods,
    clearAllCache: bdbClearAllCache
  };
  if (!window.__bdbA11yFormGuardInstalled) {
    window.__bdbA11yFormGuardInstalled = true;
    let _fSeq = 0;
    const _origCE = Document.prototype.createElement;
    const bdbFixA11yForms = () => {
      try {
        const fields = document.querySelectorAll("input, select, textarea");
        for (let i = 0; i < fields.length; i++) {
          const f = fields[i];
          if (!f.id) f.id = f.name ? (f.name + "-" + (++_fSeq)) : ("bdb-field-" + (++_fSeq));
          if (!f.name) f.name = f.id;
        }
        const labels = document.querySelectorAll("label");
        let holder = null;
        for (let j = 0; j < labels.length; j++) {
          const lbl = labels[j];
          const forId = lbl.getAttribute("for");
          if (forId && document.getElementById(forId)) continue;
          const nested = lbl.querySelector('input:not([type="hidden"]), select, textarea, button, output, meter, progress');
          if (nested) {
            if (!nested.id) nested.id = "bdb-field-" + (++_fSeq);
            lbl.setAttribute("for", nested.id);
            continue;
          }
          let target = null;
          const sib = lbl.nextElementSibling;
          if (sib) {
            if (sib.matches && sib.matches('input:not([type="hidden"]), select, textarea, button')) target = sib;
            else if (sib.querySelector) target = sib.querySelector('input:not([type="hidden"]), select, textarea, button');
          }
          if (!target && lbl.parentElement) {
            target = lbl.parentElement.querySelector('input:not([type="hidden"]), select, textarea, button');
          }
          if (target) {
            if (!target.id) target.id = "bdb-field-" + (++_fSeq);
            lbl.setAttribute("for", target.id);
          } else if (document.body) {
            let sharedOut = document.getElementById("bdb-lbl-shared-out");
            if (!sharedOut) {
              if (!holder) {
                holder = document.getElementById("bdb-a11y-targets");
                if (!holder) {
                  holder = _origCE.call(document, "div");
                  holder.id = "bdb-a11y-targets";
                  holder.style.display = "none";
                  holder.setAttribute("aria-hidden", "true");
                  document.body.appendChild(holder);
                }
              }
              sharedOut = _origCE.call(document, "output");
              sharedOut.id = "bdb-lbl-shared-out";
              holder.appendChild(sharedOut);
            }
            lbl.setAttribute("for", "bdb-lbl-shared-out");
          }
        }
      } catch (_e) {}
    };
    const startA11yObserver = () => {
      bdbFixA11yForms();
      if (typeof MutationObserver !== "undefined" && document.body) {
        let a11yTimer = 0;
        const obs = new MutationObserver(() => {
          if (a11yTimer) return;
          a11yTimer = window.setTimeout(() => {
            a11yTimer = 0;
            if (document.querySelector("label:not([for]), input:not([id]), input:not([name]), select:not([id]), select:not([name]), textarea:not([id]), textarea:not([name])")) {
              bdbFixA11yForms();
            }
          }, 280);
        });
        obs.observe(document.body, { childList: true, subtree: true });
      }
    };
    setTimeout(startA11yObserver, 2000);
  }
}
