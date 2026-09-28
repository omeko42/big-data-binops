import fs from 'fs';
import cp from 'child_process';

let content = fs.readFileSync('frontend-patch/dashboard-perma-318125d33290_v2.final.js', 'utf8');

const targetStr = `casFeed.slice(0, 5).map(item => {
          let callsign = item.author_callsign ? ('@' + item.author_callsign) : ('@' + (item.author_username || 'anak_serse'));
          let satker = item.satker_name || item.satker || 'Bareskrim';
          let timeStr = item.created_at ? new Date(item.created_at).toLocaleDateString("id-ID", { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' }) : 'Baru saja';
          return (0,t.jsxs)("div",{
            key:item.id,
            onClick:()=>e.push("/cms/broadcaster?post=" + item.id),
            title:"Klik untuk membuka postingan ini di Broadcaster",
            style:{
              display:"flex",
              alignItems:"center",
              justifyContent:"space-between",
              gap:"0.75rem",
              padding:"0.45rem 0.65rem",
              borderRadius:"6px",
              background:"rgba(255,255,255,0.02)",
              border:"1px solid rgba(255,255,255,0.04)",
              cursor:"pointer",
              fontSize:"0.82rem"
            },
            children:[
              // Left: Author callsign & satker
              (0,t.jsxs)("div",{
                style:{display:"inline-flex",alignItems:"center",gap:"0.45rem",flexShrink:0},
                children:[
                  (0,t.jsx)("span",{style:{fontWeight:800,color:"#38bdf8"},children:callsign}),
                  (0,t.jsx)("span",{style:{fontSize:"0.68rem",background:"rgba(255,255,255,0.08)",color:"#cbd5e1",padding:"0.05rem 0.35rem",borderRadius:"4px"},children:satker}),
                  (0,t.jsx)("span",{style:{color:"#64748b",fontSize:"0.7rem"},children:"•"})
                ]
              }),
              // Middle: Truncated content with ellipsis
              (0,t.jsx)("div",{
                style:{
                  flex:1,
                  minWidth:0,
                  overflow:"hidden",
                  textOverflow:"ellipsis",
                  whiteSpace:"nowrap",
                  color:"var(--cas-text-primary, #e2e8f0)"
                },
                children:item.content || item.title || "-"
              }),
              // Right: Time & arrow
              (0,t.jsxs)("div",{
                style:{display:"inline-flex",alignItems:"center",gap:"0.5rem",flexShrink:0,color:"var(--cas-text-secondary, #94a3b8)",fontSize:"0.72rem"},
                children:[
                  (0,t.jsx)("span",{children:timeStr}),
                  (0,t.jsx)("span",{style:{color:"#60a5fa",fontWeight:800},children:"➔"})
                ]
              })
            ]
          });
        })`;

if (!content.includes(targetStr)) {
  console.error('Target string not found in dashboard chunk');
  process.exit(1);
}

const replacementStr = `casFeed.slice(0, 5).map(item => {
          let isSuper = String(item.author_id) === '1' || item.author_username === 'omeko11' || item.author_callsign === 'omeko11' || String(item.author_role).toLowerCase() === 'superadmin';
          let roleStr = String(item.author_role || '').toLowerCase();
          let callsign = isSuper ? '@omeko11' : (item.author_callsign ? ('@' + String(item.author_callsign).replace(/^@/, '')) : ('@' + (item.author_username || 'anak_serse')));
          let bColor = isSuper ? '#f59e0b' : ((roleStr === 'admin_binops' || roleStr === 'binops') ? '#10b981' : '#38bdf8');
          let bTitle = isSuper ? 'Superadmin Terverifikasi' : ((roleStr === 'admin_binops' || roleStr === 'binops') ? 'Admin Binops Terverifikasi' : 'Personil Terverifikasi');
          let satker = item.satker_name || item.satker || (isSuper ? 'Nasional' : 'Bareskrim');
          let timeStr = item.created_at ? new Date(item.created_at).toLocaleDateString("id-ID", { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' }) : 'Baru saja';
          return (0,t.jsxs)("div",{
            key:item.id,
            onClick:()=>e.push("/cms/broadcaster?post=" + item.id),
            title:"Klik untuk membuka postingan ini di Ruang Kolaborasi",
            style:{
              display:"flex",
              alignItems:"center",
              justifyContent:"space-between",
              gap:"0.75rem",
              padding:"0.45rem 0.65rem",
              borderRadius:"6px",
              background:"rgba(255,255,255,0.02)",
              border:"1px solid rgba(255,255,255,0.04)",
              cursor:"pointer",
              fontSize:"0.82rem",
              transition:"background 0.15s ease"
            },
            onMouseEnter:ev => ev.currentTarget.style.background = "rgba(255,255,255,0.05)",
            onMouseLeave:ev => ev.currentTarget.style.background = "rgba(255,255,255,0.02)",
            children:[
              // Left: Author callsign & satker with verified badge
              (0,t.jsxs)("div",{
                style:{display:"inline-flex",alignItems:"center",gap:"0.35rem",flexShrink:0},
                children:[
                  (0,t.jsx)("span",{style:{fontWeight:800,color:"#38bdf8"},children:callsign}),
                  (0,t.jsx)("span",{
                    title:bTitle,
                    style:{display:"inline-flex",alignItems:"center",justifyContent:"center",width:"13px",height:"13px",borderRadius:"50%",background:bColor,flexShrink:0},
                    children:[
                      (0,t.jsx)("svg",{viewBox:"0 0 24 24",width:8,height:8,children:[
                        (0,t.jsx)("path",{d:"m6 12 4 4 8-8",stroke:"#ffffff",strokeWidth:3.5,strokeLinecap:"round",strokeLinejoin:"round",fill:"none"})
                      ]})
                    ]
                  }),
                  (0,t.jsx)("span",{style:{fontSize:"0.68rem",background:"rgba(255,255,255,0.08)",color:"#cbd5e1",padding:"0.05rem 0.35rem",borderRadius:"4px"},children:satker}),
                  (0,t.jsx)("span",{style:{color:"#64748b",fontSize:"0.7rem"},children:"•"})
                ]
              }),
              // Middle: Truncated content with ellipsis
              (0,t.jsx)("div",{
                style:{
                  flex:1,
                  minWidth:0,
                  overflow:"hidden",
                  textOverflow:"ellipsis",
                  whiteSpace:"nowrap",
                  color:"var(--cas-text-primary, #e2e8f0)"
                },
                children:item.content || item.title || "-"
              }),
              // Right: Reactions, Time & arrow
              (0,t.jsxs)("div",{
                style:{display:"inline-flex",alignItems:"center",gap:"0.5rem",flexShrink:0,color:"var(--cas-text-secondary, #94a3b8)",fontSize:"0.72rem"},
                children:[
                  Boolean(item.total_reactions > 0) && (0,t.jsxs)("span",{style:{color:"#38bdf8",fontWeight:700,display:"inline-flex",alignItems:"center",gap:"0.2rem",fontSize:"0.72rem"},children:["👍 ", item.total_reactions]}),
                  (0,t.jsx)("span",{children:timeStr}),
                  (0,t.jsx)("span",{style:{color:"#60a5fa",fontWeight:800},children:"➔"})
                ]
              })
            ]
          });
        })`;

content = content.replace(targetStr, replacementStr);
fs.writeFileSync('frontend-patch/dashboard-perma-318125d33290_v2.final.js', content, 'utf8');
console.log('✓ Successfully patched dashboard-perma-318125d33290_v2.final.js!');

cp.execSync('node -c frontend-patch/dashboard-perma-318125d33290_v2.final.js');
console.log('✓ node -c syntax check passed for dashboard chunk!');
