import { runBE } from './fe_inspect.mjs';

console.log("=== 40-70 ===");
console.log(runBE("docker exec bdb-api sed -n '40,70p' /usr/src/app/src/bdb/pihak-terlibat/pihak-terlibat.service.ts"));
console.log("=== 80-105 ===");
console.log(runBE("docker exec bdb-api sed -n '80,105p' /usr/src/app/src/bdb/pihak-terlibat/pihak-terlibat.service.ts"));
console.log("=== 180-205 ===");
console.log(runBE("docker exec bdb-api sed -n '180,205p' /usr/src/app/src/bdb/pihak-terlibat/pihak-terlibat.service.ts"));
console.log("=== 615-650 ===");
console.log(runBE("docker exec bdb-api sed -n '615,650p' /usr/src/app/src/bdb/pihak-terlibat/pihak-terlibat.service.ts"));
console.log("=== 780-805 ===");
console.log(runBE("docker exec bdb-api sed -n '780,805p' /usr/src/app/src/bdb/pihak-terlibat/pihak-terlibat.service.ts"));
