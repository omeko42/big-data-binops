import { runFE } from './fe_exec.mjs';

const res = runFE("curl -s http://127.0.0.1:3000/_next/static/chunks/3def3ti6rk0vr.js");
console.log("Has 'Keamanan Sangat Kuat'?", res.includes("Keamanan Sangat Kuat"));
console.log("Has 'OTP Email Kedinasan' (without 1.)?", res.includes('label:"OTP Email Kedinasan"'));
console.log("Has 'PIN Keamanan' (without 2.)?", res.includes('label:"PIN Keamanan"'));
console.log("Has 'Google Authenticator (TOTP)' (without 3.)?", res.includes('label:"Google Authenticator (TOTP)"'));
console.log("Has old '2/3 lapisan aktif'?", res.includes("2/3 lapisan aktif"));
console.log("Has old '1. OTP Email'?", res.includes("1. OTP Email"));
