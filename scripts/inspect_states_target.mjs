import fs from 'fs';

const c = fs.readFileSync('3def3ti6rk0vr.patched.js', 'utf8');

const sIdx = c.indexOf('[ePhotoModal,setPhotoModal]');
console.log("States at:", sIdx);
console.log(c.substring(sIdx - 100, sIdx + 400));
