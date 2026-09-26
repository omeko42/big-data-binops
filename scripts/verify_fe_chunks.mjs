import { runFE } from './fe_exec.mjs';

const res1 = runFE(`curl -sI http://127.0.0.1:3000/_next/static/chunks/user-page-pagination-v9-dfbc949b.js | head -n 10`);
console.log("user-page chunk HTTP header:\n", res1);

const res2 = runFE(`curl -s http://127.0.0.1:3000/_next/static/chunks/user-page-pagination-v9-dfbc949b.js | grep -o "Email dinas Polri" | head -n 1`);
console.log("Found in user-page chunk:", res2.trim());

const res3 = runFE(`curl -sI http://127.0.0.1:3000/_next/static/chunks/3def3ti6rk0vr.js | head -n 10`);
console.log("profile chunk HTTP header:\n", res3);

const res4 = runFE(`curl -s http://127.0.0.1:3000/_next/static/chunks/3def3ti6rk0vr.js | grep -o "Bharada" | head -n 1`);
console.log("Found in profile chunk:", res4.trim());

const res5 = runFE(`curl -s http://127.0.0.1:3000/_next/static/chunks/3def3ti6rk0vr.js | grep -o "Ubah Password" | head -n 1`);
console.log("Found Ubah Password in profile chunk:", res5.trim());
