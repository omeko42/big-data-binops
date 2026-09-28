import fs from 'fs';
import cp from 'child_process';

let content = fs.readFileSync('frontend-patch/35hkjujo3bzza.patched.js', 'utf8');

const target1CRLF = `{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-color, #0f172a)" },\r\n                              children: post.author_handle\r\n                            }`;
const target1LF = `{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-color, #0f172a)" },\n                              children: post.author_handle\n                            }`;

const repl1 = `{ display: "inline-flex", alignItems: "center", gap: "0.35rem" },
                              children: [
                                (0, t.jsx)("span", {
                                  style: { fontSize: "0.82rem", fontWeight: 700, color: "var(--text-color, #0f172a)" },
                                  children: (function(item){
                                    if (!item) return "@anak_serse";
                                    if (String(item.author_id)==='1' || item.author_username==='omeko11' || item.author_callsign==='omeko11') return "@omeko11";
                                    if (item.author_callsign) return "@" + String(item.author_callsign).replace(/^@/, '');
                                    if (item.author_username) return "@" + item.author_username;
                                    return item.author_handle || (item.author_name ? ("@" + String(item.author_name).toLowerCase().replace(/[^a-z0-9]/g, '')) : "@anak_serse");
                                  })(post)
                                }),
                                (function(item){
                                  var isSuper = String(item?.author_id) === '1' || item?.author_username === 'omeko11' || item?.author_callsign === 'omeko11' || String(item?.author_role).toLowerCase() === 'superadmin';
                                  var r = String(item?.author_role || '').toLowerCase();
                                  var bColor = isSuper ? '#f59e0b' : ((r === 'admin_binops' || r === 'binops') ? '#10b981' : '#38bdf8');
                                  var bTitle = isSuper ? 'Superadmin Terverifikasi' : ((r === 'admin_binops' || r === 'binops') ? 'Admin Binops Terverifikasi' : 'Personil Terverifikasi');
                                  return (0, t.jsx)("span", {
                                    title: bTitle,
                                    style: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: "13px", height: "13px", borderRadius: "50%", background: bColor, flexShrink: 0 },
                                    children: [(0, t.jsx)("svg", { viewBox: "0 0 24 24", width: 8, height: 8, children: [(0, t.jsx)("path", { d: "m6 12 4 4 8-8", stroke: "#ffffff", strokeWidth: 3.5, strokeLinecap: "round", strokeLinejoin: "round", fill: "none" })] })]
                                  });
                                })(post)
                              ]
                            }`;

if (content.includes(target1CRLF)) {
  content = content.replace(target1CRLF, repl1);
  console.log('✓ Replaced target1CRLF in 35hk');
} else if (content.includes(target1LF)) {
  content = content.replace(target1LF, repl1);
  console.log('✓ Replaced target1LF in 35hk');
} else {
  console.log('Target1 not found');
}

fs.writeFileSync('frontend-patch/35hkjujo3bzza.patched.js', content, 'utf8');
cp.execSync('node -c frontend-patch/35hkjujo3bzza.patched.js');
console.log('✓ node -c syntax check passed for 35hk!');
