import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web grep -o '[a-zA-Z0-9_-]*\\.js' /usr/src/app/.next/server/app/cms/broadcaster.html | sort -u`;
console.log('--- Broadcaster chunks ---');
console.log(runFE(cmd));

const cmd2 = `docker exec bdb-web grep -o '[a-zA-Z0-9_-]*\\.js' /usr/src/app/.next/server/app/cms/pengumuman.html | sort -u`;
console.log('--- Pengumuman chunks ---');
console.log(runFE(cmd2));

const cmd3 = `docker exec bdb-web grep -o '[a-zA-Z0-9_-]*\\.js' /usr/src/app/.next/server/app/cms/profile.html | sort -u`;
console.log('--- Profile chunks ---');
console.log(runFE(cmd3));
