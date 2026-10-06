import fs from 'fs';

let content = fs.readFileSync('3def3ti6rk0vr.js', 'utf8');

// 1. Profile paged posts author avatar fallback
const target1 = `var isAuthorOne = ['1', '320', '15403', '15404', '16568', '16576', '16594'].includes(String(p.author_id)) || String(p.author_id) === '1' || p.author_username === 'omeko11' || p.author_callsign === 'omeko11' || (!p.author_id && (a?.id === '1' || a?.username === 'omeko11'));
            var pBadge = getVerificationBadge(p.author_role || a?.role, isAuthorOne, p.author_id || a?.id, p.author_username || a?.username);
            var pHandle = formatCallsign(p.author_callsign || a?.callsign, p.author_id || a?.id, p.author_username || a?.username);
            var pAvatar = p.author_photo_url || p.photo_url || a?.photo_url || a?.photo || null;
            var pInitials = String(p.author_name || a?.name || pHandle || 'P').charAt(0).toUpperCase();
            var pSatker = isAuthorOne ? 'Robinopsnal Bareskrim Polri' : (p.satker_name || p.author_satker || a?.scope_satker_name || 'Polri');`;

const replace1 = `var isAuthorEko = String(p.author_id) === '1' || p.author_username === 'omeko11' || p.author_callsign === 'omeko11' || (!p.author_id && (a?.id === '1' || a?.username === 'omeko11'));
            var isAuthorSuper = isAuthorEko || ['1', '320', '15403', '15404', '16568', '16576', '16594'].includes(String(p.author_id)) || String(p.author_role || '').toLowerCase() === 'superadmin';
            var pBadge = getVerificationBadge(p.author_role || a?.role, isAuthorSuper, p.author_id || a?.id, p.author_username || a?.username);
            var pHandle = formatCallsign(p.author_callsign || a?.callsign, p.author_id || a?.id, p.author_username || a?.username);
            var pAvatar = p.author_photo_url || p.photo_url || (isAuthorEko ? (a?.photo_url || a?.foto || a?.photo) : null);
            var pInitials = String(p.author_name || a?.name || pHandle || 'P').charAt(0).toUpperCase();
            var pSatker = isAuthorSuper ? 'Robinopsnal Bareskrim Polri' : (p.satker_name || p.author_satker || a?.scope_satker_name || 'Polri');`;

if (!content.includes(target1)) {
    console.error('ERROR: Target 1 not found in 3def3ti6rk0vr.js');
    process.exit(1);
}
content = content.replace(target1, replace1);
console.log('Successfully patched Target 1 (Profile Paged Posts)');

// 2. Personal likes modal in profile
const target2 = `var usr = rx.user || {};
            var isUsrOne = ['1', '320', '15403', '15404', '16568', '16576', '16594'].includes(String(usr.id)) || String(usr.id) === '1' || usr.username === 'omeko11' || String(usr.role_bdb || usr.role || '').toLowerCase() === 'superadmin';
            var usrBadge = getVerificationBadge(usr.role_bdb || usr.role, isUsrOne, usr.id, usr.username);
            var usrHandle = isUsrOne ? '@omeko11' : (usr.callsign ? (String(usr.callsign).startsWith('@') ? usr.callsign : '@' + usr.callsign) : (usr.username ? (String(usr.username).startsWith('@') ? usr.username : '@' + usr.username) : '@personil'));
            var initials = String(usr.name || usr.username || 'P').charAt(0).toUpperCase();
            var usrPhoto = (isUsrOne && (a?.photo_url || a?.foto || a?.photo)) ? (a.photo_url || a.foto || a.photo) : (usr.photo_url || usr.foto || usr.photo || null);

            return (0,t.jsxs)("div",{key:rx.id,style:{display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"8px",padding:"0.6rem 0.8rem"},children:[
              (0,t.jsxs)("div",{
                onClick:() => {
                  setPersonalLikesModal(!1);
                  var isSelf = isUsrOne || String(usr.id) === String(a?.id);
                  if (isSelf) {
                    try { sessionStorage.removeItem('cas_view_user'); } catch(e) {}
                    window.location.href = '/cms/profile';
                  } else {
                    var h = usrHandle.replace(/^@/, '');
                    try {
                      sessionStorage.setItem('cas_view_user', JSON.stringify({ id: usr.id, handle: usrHandle, username: usr.username || h }));
                    } catch(e) {}
                    window.location.href = '/cms/profile?u=' + encodeURIComponent(h);
                  }
                },
                style:{display:"flex",alignItems:"center",gap:"0.65rem",cursor:"pointer"},
                title:"Klik untuk melihat profil personil",
                children:[
                  renderCornerAvatar(usrPhoto, initials, usrBadge, 2.2, 14, 8),
                  (0,t.jsxs)("div",{children:[
                    (0,t.jsx)("div",{style:{fontWeight:700,fontSize:"0.88rem",color:isUsrOne ? '#f59e0b' : '#38bdf8'},children:usrHandle}),
                    (0,t.jsx)("div",{style:{fontSize:"0.72rem",color:"var(--cas-text-secondary, #94a3b8)"},children:isUsrOne ? "Kasubdit • Robinopsnal Bareskrim Polri" : (usr.satker || "Mabes Bareskrim")})
                  ]})
                ]
              }),
              (0,t.jsx)("span",{style:{fontSize:"1.25rem"},children:"👍"})
            ]});`;

const replace2 = `var usr = rx.user || {};
            var isUsrEko = String(usr.id) === '1' || usr.username === 'omeko11';
            var isUsrSuper = isUsrEko || ['1', '320', '15403', '15404', '16568', '16576', '16594'].includes(String(usr.id)) || String(usr.role_bdb || usr.role || '').toLowerCase() === 'superadmin';
            var usrBadge = getVerificationBadge(usr.role_bdb || usr.role, isUsrSuper, usr.id, usr.username);
            var usrHandle = isUsrEko ? '@omeko11' : (usr.callsign ? (String(usr.callsign).startsWith('@') ? usr.callsign : '@' + usr.callsign) : (usr.username ? (String(usr.username).startsWith('@') ? usr.username : '@' + usr.username) : '@personil'));
            var initials = String(usr.name || usr.username || 'P').charAt(0).toUpperCase();
            var usrPhoto = (isUsrEko && (a?.photo_url || a?.foto || a?.photo)) ? (a.photo_url || a.foto || a.photo) : (usr.photo_url || usr.foto || usr.photo || null);

            return (0,t.jsxs)("div",{key:rx.id,style:{display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"8px",padding:"0.6rem 0.8rem"},children:[
              (0,t.jsxs)("div",{
                onClick:() => {
                  setPersonalLikesModal(!1);
                  var isSelf = isUsrEko || String(usr.id) === String(a?.id);
                  if (isSelf) {
                    try { sessionStorage.removeItem('cas_view_user'); } catch(e) {}
                    window.location.href = '/cms/profile';
                  } else {
                    var h = usrHandle.replace(/^@/, '');
                    try {
                      sessionStorage.setItem('cas_view_user', JSON.stringify({ id: usr.id, handle: usrHandle, username: usr.username || h }));
                    } catch(e) {}
                    window.location.href = '/cms/profile?u=' + encodeURIComponent(h);
                  }
                },
                style:{display:"flex",alignItems:"center",gap:"0.65rem",cursor:"pointer"},
                title:"Klik untuk melihat profil personil",
                children:[
                  renderCornerAvatar(usrPhoto, initials, usrBadge, 2.2, 14, 8),
                  (0,t.jsxs)("div",{children:[
                    (0,t.jsx)("div",{style:{fontWeight:700,fontSize:"0.88rem",color:isUsrSuper ? '#f59e0b' : '#38bdf8'},children:usrHandle}),
                    (0,t.jsx)("div",{style:{fontSize:"0.72rem",color:"var(--cas-text-secondary, #94a3b8)"},children:isUsrSuper ? "Robinopsnal Bareskrim Polri" : (usr.satker || "Mabes Bareskrim")})
                  ]})
                ]
              }),
              (0,t.jsx)("span",{style:{fontSize:"1.25rem"},children:"👍"})
            ]});`;

if (!content.includes(target2)) {
    console.error('ERROR: Target 2 not found in 3def3ti6rk0vr.js');
    process.exit(1);
}
content = content.replace(target2, replace2);
console.log('Successfully patched Target 2 (Profile Personal Likes Modal)');

fs.writeFileSync('3def3ti6rk0vr.patched.js', content, 'utf8');
console.log('Saved 3def3ti6rk0vr.patched.js!');
