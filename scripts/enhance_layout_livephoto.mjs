import fs from 'fs';
import vm from 'vm';

let code = fs.readFileSync('0-gigr76s0g8t.patched.js', 'utf8');

const target1 = 'function L({user:e,roleLabel:n,onToggleSidebar:l,onToggleCollapse:i}){let o=(0,r.useRouter)(),';
const repl1 = 'function L({user:e,roleLabel:n,onToggleSidebar:l,onToggleCollapse:i}){let o=(0,r.useRouter)(),[livePhoto,setLivePhoto]=(0,t.useState)(()=>{try{let u=JSON.parse(localStorage.getItem("user")||"{}");return u?.photo_url||u?.foto||e?.photo_url||e?.foto||null}catch{return e?.photo_url||e?.foto||null}}),';
if (!code.includes(target1)) throw new Error('target1 not found');
code = code.replace(target1, repl1);

const target2 = '(0,t.useEffect)(()=>{el()},[el]);';
const repl2 = '(0,t.useEffect)(()=>{el()},[el]),(0,t.useEffect)(()=>{function uEv(ev){try{let u=ev?.detail||JSON.parse(localStorage.getItem("user")||"{}");let p=u?.photo_url||u?.foto||null;if(p)setLivePhoto(p)}catch{}}window.addEventListener("user-updated",uEv);window.addEventListener("storage",uEv);return()=>{window.removeEventListener("user-updated",uEv);window.removeEventListener("storage",uEv)}},[]);';
if (!code.includes(target2)) throw new Error('target2 not found');
code = code.replace(target2, repl2);

const target3 = 'ec=(e?.photo_url||e?.foto)?(0,a.jsx)("img",{src:e.photo_url||e.foto,';
const repl3 = 'ec=(livePhoto||e?.photo_url||e?.foto)?(0,a.jsx)("img",{src:livePhoto||e?.photo_url||e?.foto,';
if (!code.includes(target3)) throw new Error('target3 not found');
code = code.replace(target3, repl3);

new vm.Script(code);
console.log('Syntax check passed!');
fs.writeFileSync('0-gigr76s0g8t.patched.js', code, 'utf8');
console.log('Successfully updated 0-gigr76s0g8t.patched.js with livePhoto listener');
