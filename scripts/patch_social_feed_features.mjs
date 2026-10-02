import fs from 'fs';

const filePath = 'scripts/build_social_feed.mjs';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Patch handleOpenUserProfile
const oldHandleProfileRegex = /var handleOpenUserProfile = async \(authorId, postContext\) => \{[\s\S]*?finally\s*\{[\s\S]*?setLoadingProfile\(!1\);[\s\S]*?\}[\s\S]*?\};/;

const newHandleProfile = `var handleOpenUserProfile = (authorId, postContext) => {
    if (!authorId && !postContext) return;
    var targetId = authorId || postContext?.author_id || postContext?.id || postContext?.user_id;
    if (!targetId) return;
    if (String(targetId) === String(currentUser?.id || currentUser?.user_id)) {
      window.location.href = '/cms/profile';
    } else {
      window.location.href = '/cms/profile?u=' + targetId;
    }
  };`;

if (!oldHandleProfileRegex.test(content)) {
  console.error('Could not find oldHandleProfileRegex in build_social_feed.mjs');
  process.exit(1);
}
content = content.replace(oldHandleProfileRegex, newHandleProfile);
console.log('✓ Patched handleOpenUserProfile to navigate directly to profile');

// 2. Patch Action Footer of Profile Modal
const oldActionFooterOtherUser = `(0,t.jsx)("button",{
                type:"button",
                onClick:() => {
                  setProfileModalOpen(!1);
                  toastRef.current?.show({severity:'info',summary:'Ruang Koordinasi',detail:'Jalur koordinasi taktis perkara dibuka dengan ' + previewUser.name});
                },
                style:{background:"#2563eb",color:"#fff",border:"none",borderRadius:"8px",padding:"0.45rem 1.15rem",fontSize:"0.8rem",fontWeight:700,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"0.35rem"},
                children:"💬 Kirim Pesan Taktis"
              })`;

const newActionFooterOtherUser = `(0,t.jsx)("button",{
                type:"button",
                onClick:() => {
                  window.location.href = '/cms/profile?u=' + previewUser.id;
                },
                style:{background:"#2563eb",color:"#fff",border:"none",borderRadius:"8px",padding:"0.45rem 1.15rem",fontSize:"0.8rem",fontWeight:700,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"0.35rem"},
                children:"👤 Buka Profil Lengkap"
              })`;

if (content.includes(oldActionFooterOtherUser)) {
  content = content.replace(oldActionFooterOtherUser, newActionFooterOtherUser);
  console.log('✓ Patched Profile Modal button to Buka Profil Lengkap');
} else {
  console.log('Notice: oldActionFooterOtherUser not found directly, checking variations...');
}

// 3. Patch Media Attachments Viewer
const oldMediaBlockStart = '// Media Attachments Viewer (Stream tokenized)';
const oldMediaBlockEnd = '// Redesigned Direct Action Footer';

const p1 = content.indexOf(oldMediaBlockStart);
const p2 = content.indexOf(oldMediaBlockEnd, p1);

if (p1 === -1 || p2 === -1) {
  console.error('Could not find media attachment markers in build_social_feed.mjs:', p1, p2);
  process.exit(1);
}

const newMediaBlock = `// Media Attachments Viewer (Support post.media & post.media_urls with preview & download)
              (()=>{
                var mediaList = (post.media && post.media.length > 0) ? post.media : (post.media_urls || []);
                if (!mediaList || mediaList.length === 0) return null;
                return (0,t.jsx)("div",{style:{display:"grid",gap:"0.6rem",marginBottom:"0.85rem"},children:
                  mediaList.map((m, mIdx) => {
                    var mUrl = m.stream_url || (m.token ? ('/api/bdb/jukrah/stream/' + m.token) : m.url) || '';
                    var mime = String(m.mime || m.type || '').toLowerCase();
                    var fileName = m.name || (m.key ? m.key.split('/').pop() : 'Berkas Terlampir');
                    var isImage = mime.startsWith('image/') || fileName.match(/\\.(png|jpe?g|webp|gif)$/i);
                    var isVideo = mime.startsWith('video/') || fileName.match(/\\.(mp4|webm|mkv)$/i);
                    var isPdf = mime === 'application/pdf' || fileName.match(/\\.pdf$/i);

                    if (isImage) {
                      return (0,t.jsxs)("div",{key:mIdx,style:{borderRadius:"8px",overflow:"hidden",maxHeight:"24rem",background:"#0f172a",display:"flex",flexDirection:"column",alignItems:"center",position:"relative",border:"1px solid rgba(255,255,255,0.08)"},children:[
                        (0,t.jsx)("img",{src:mUrl,alt:fileName,style:{maxWidth:"100%",maxHeight:"22rem",objectFit:"contain",cursor:"pointer"},onClick:()=>window.open(mUrl, '_blank')}),
                        (0,t.jsxs)("div",{style:{width:"100%",padding:"0.35rem 0.65rem",background:"rgba(15,23,42,0.9)",display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:"0.72rem",color:"#94a3b8"},children:[
                          (0,t.jsx)("span",{style:{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"70%"},children:fileName}),
                          (0,t.jsxs)("a",{href:mUrl + (mUrl.includes('?') ? '&' : '?') + 'download=1&filename=' + encodeURIComponent(fileName),download:fileName,target:"_blank",rel:"noreferrer",style:{color:"#38bdf8",fontWeight:700,textDecoration:"none",display:"inline-flex",alignItems:"center",gap:"0.25rem"},children:[
                            "⬇️ Unduh"
                          ]})
                        ]})
                      ]});
                    }
                    if (isVideo) {
                      return (0,t.jsxs)("div",{key:mIdx,style:{borderRadius:"8px",overflow:"hidden",maxHeight:"24rem",background:"#000",border:"1px solid rgba(255,255,255,0.08)"},children:[
                        (0,t.jsx)("video",{src:mUrl,controls:!0,style:{width:"100%",maxHeight:"22rem"}}),
                        (0,t.jsxs)("div",{style:{padding:"0.35rem 0.65rem",background:"rgba(15,23,42,0.9)",display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:"0.72rem",color:"#94a3b8"},children:[
                          (0,t.jsx)("span",{children:fileName}),
                          (0,t.jsxs)("a",{href:mUrl + (mUrl.includes('?') ? '&' : '?') + 'download=1&filename=' + encodeURIComponent(fileName),download:fileName,target:"_blank",rel:"noreferrer",style:{color:"#38bdf8",fontWeight:700,textDecoration:"none"},children:[
                            "⬇️ Unduh Video"
                          ]})
                        ]})
                      ]});
                    }

                    // Document / PDF / Berkas
                    var downloadUrl = mUrl ? (mUrl + (mUrl.includes('?') ? '&' : '?') + 'download=1&filename=' + encodeURIComponent(fileName)) : '#';
                    var sizeStr = m.size ? (' (' + (m.size > 1048576 ? (m.size / 1048576).toFixed(1) + ' MB' : Math.round(m.size / 1024) + ' KB') + ')') : '';

                    return (0,t.jsxs)("div",{
                      key:mIdx,
                      style:{
                        display:"flex",
                        alignItems:"center",
                        justifyContent:"space-between",
                        gap:"0.75rem",
                        background:"rgba(15, 23, 42, 0.65)",
                        border:"1px solid rgba(56, 189, 248, 0.25)",
                        borderRadius:"10px",
                        padding:"0.65rem 0.85rem",
                        flexWrap:"wrap"
                      },
                      children:[
                        (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.65rem",minWidth:0,flex:"1 1 14rem"},children:[
                          (0,t.jsx)("div",{style:{fontSize:"1.6rem",flexShrink:0},children:isPdf ? "📄" : "📁"}),
                          (0,t.jsxs)("div",{style:{minWidth:0},children:[
                            (0,t.jsx)("div",{style:{fontWeight:700,fontSize:"0.84rem",color:"#f8fafc",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},title:fileName,children:fileName}),
                            (0,t.jsxs)("div",{style:{fontSize:"0.7rem",color:"#94a3b8",display:"flex",gap:"0.4rem"},children:[
                              (0,t.jsx)("span",{children:(isPdf ? "Dokumen PDF" : "Berkas Lampiran") + sizeStr})
                            ]})
                          ]})
                        ]}),
                        (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.45rem",flexShrink:0},children:[
                          isPdf && (0,t.jsxs)("button",{
                            type:"button",
                            onClick:() => setPreviewPdf({ url: mUrl, name: fileName }),
                            style:{
                              background:"rgba(56, 189, 248, 0.15)",
                              color:"#38bdf8",
                              border:"1px solid rgba(56, 189, 248, 0.35)",
                              borderRadius:"6px",
                              padding:"0.4rem 0.75rem",
                              fontSize:"0.76rem",
                              fontWeight:700,
                              cursor:"pointer",
                              display:"inline-flex",
                              alignItems:"center",
                              gap:"0.35rem"
                            },
                            children:[
                              "👁️ Pratinjau"
                            ]
                          }),
                          (0,t.jsxs)("a",{
                            href:downloadUrl,
                            download:fileName,
                            target:"_blank",
                            rel:"noreferrer",
                            style:{
                              background:"#2563eb",
                              color:"#ffffff",
                              border:"none",
                              borderRadius:"6px",
                              padding:"0.4rem 0.85rem",
                              fontSize:"0.76rem",
                              fontWeight:700,
                              textDecoration:"none",
                              display:"inline-flex",
                              alignItems:"center",
                              gap:"0.35rem",
                              cursor:"pointer"
                            },
                            children:[
                              "⬇️ Unduh Berkas"
                            ]
                          })
                        ]})
                      ]
                    });
                  })
                );
              })(),

              `;

content = content.slice(0, p1) + newMediaBlock + content.slice(p2);
console.log('✓ Patched media attachment viewer with preview & download actions');

fs.writeFileSync(filePath, content, 'utf8');
console.log('SUCCESS: Patched scripts/build_social_feed.mjs!');
