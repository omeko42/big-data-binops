import fs from 'fs';
import vm from 'vm';
import { runFE, copyFileToFE } from './fe_exec.mjs';

let code = fs.readFileSync('0-gigr76s0g8t.patched.js', 'utf8');

const target = 'window.addEventListener("user-updated",uEv);window.addEventListener("storage",uEv);return()=>{window.removeEventListener("user-updated",uEv);window.removeEventListener("storage",uEv)}},[]);';
const replacement = 'window.addEventListener("user-updated",uEv);window.addEventListener("storage",uEv);try{M.apiAuth.get("/user/me/profile").then(res=>{let d=res.data?.data||res.data;let p=d?.photo_url||d?.foto||null;if(p){setLivePhoto(p);try{let u=JSON.parse(localStorage.getItem("user")||"{}");u.photo_url=p;u.foto=p;localStorage.setItem("user",JSON.stringify(u))}catch(e){}}}).catch(()=>{})}catch(e){}return()=>{window.removeEventListener("user-updated",uEv);window.removeEventListener("storage",uEv)}},[]);';

if (!code.includes(target)) throw new Error("target not found in 0-gigr76s0g8t.patched.js");
code = code.replace(target, replacement);

new vm.Script(code);
console.log("Syntax valid!");

fs.writeFileSync('0-gigr76s0g8t.patched.js', code, 'utf8');
console.log("Saved 0-gigr76s0g8t.patched.js");

copyFileToFE('0-gigr76s0g8t.patched.js', '/tmp/0-gigr76s0g8t.js');
const res = runFE(`
    docker exec bdb-web cp /usr/src/app/.next/static/chunks/0-gigr76s0g8t.js /usr/src/app/.next/static/chunks/0-gigr76s0g8t.js.bak3 2>/dev/null || true
    docker cp /tmp/0-gigr76s0g8t.js bdb-web:/usr/src/app/.next/static/chunks/0-gigr76s0g8t.js
    rm -f /tmp/0-gigr76s0g8t.js
    docker exec bdb-web ls -lh /usr/src/app/.next/static/chunks/0-gigr76s0g8t.js
`);
console.log(res);
