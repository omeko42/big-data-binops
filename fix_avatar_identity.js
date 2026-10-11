const fs = require('fs');

console.log('=== FIXING 3pp0f_cp6yg-o.patched.js ===');
let f1 = fs.readFileSync('3pp0f_cp6yg-o.patched.js', 'utf8');

// 1. Post card author avatar
const oldPostAuthor = `          var isAuthor = String(post.author_id) === String(currentUser?.id || currentUser?.user_id);
          var canEdit = isAuthor || isOfficialRole || post.can_edit;
          var isAuthorEko = String(post.author_id) === '1' || post.author_username === 'omeko11' || post.author_callsign === 'omeko11';
          var authorAvatar = (isAuthorEko && (currentUser?.photo_url || currentUser?.foto)) ? (currentUser.photo_url || currentUser.foto) : (post.author_photo_url || post.author_photo || null);
          
          var isUserSuper = isAuthorEko || ['1', '320', '15403', '15404', '16568', '16576', '16594'].includes(String(post.author_id)) || String(post.author_role || '').toLowerCase() === 'superadmin';
          var authorHandle = formatCallsign(post.author_callsign, post.author_id, post.author_username);
          var authorBadge = getVerificationBadge(post.author_role, isUserSuper, post.author_id, post.author_username);
          var authorNameDisplay = isAuthorEko ? 'EKO' : post.author_name;
          var authorInitials = String(authorNameDisplay || authorHandle || 'P').charAt(0).toUpperCase();`;

const newPostAuthor = `          var isAuthor = String(post.author_id) === String(currentUser?.id || currentUser?.user_id);
          var canEdit = isAuthor || isOfficialRole || post.can_edit;
          var authorAvatar = isAuthor ? (currentUser?.photo_url || currentUser?.foto || post.author_photo_url || post.author_photo || null) : (post.author_photo_url || post.author_photo || null);
          var isUserSuper = ['1', '320', '15403', '15404', '16568', '16576', '16594'].includes(String(post.author_id)) || String(post.author_role || '').toLowerCase() === 'superadmin';
          var authorHandle = formatCallsign(post.author_callsign, post.author_id, post.author_username);
          var authorBadge = getVerificationBadge(post.author_role, isUserSuper, post.author_id, post.author_username);
          var authorNameDisplay = isAuthor ? (currentUser?.name || post.author_name || authorHandle) : (post.author_name || authorHandle);
          var authorInitials = String(authorNameDisplay || authorHandle || 'P').charAt(0).toUpperCase();`;

if (!f1.includes(oldPostAuthor)) {
  console.error('ERROR: oldPostAuthor not found!');
  process.exit(1);
}
f1 = f1.replace(oldPostAuthor, newPostAuthor);
console.log('Fixed post author avatar.');

// 2. Comments author avatar
const oldCmAuthor = `                      var isCmAuthor = String(cm.user_id || cm.author_id) === String(currentUser?.id || currentUser?.user_id);
                      var isCmEko = String(cm.author_id || cm.user_id) === '1' || cm.author_username === 'omeko11' || cm.author_callsign === 'omeko11';
                      var isCmSuper = isCmEko || ['1', '320', '15403', '15404', '16568', '16576', '16594'].includes(String(cm.author_id || cm.user_id)) || String(cm.author_role || cm.role_bdb || '').toLowerCase() === 'superadmin';
                      var cmBadge = getVerificationBadge(cm.author_role || cm.role_bdb, isCmSuper, cm.author_id || cm.user_id, cm.author_username);
                      var cmHandle = formatCallsign(cm.author_callsign, cm.author_id || cm.user_id, cm.author_username);
                      var cmInitials = String(cm.author_name || cmHandle || 'P').charAt(0).toUpperCase();
                      var cmAvatar = (isCmEko && (currentUser?.photo_url || currentUser?.foto)) ? (currentUser.photo_url || currentUser.foto) : (cm.author_photo_url || cm.author_photo || null);`;

const newCmAuthor = `                      var isCmAuthor = String(cm.user_id || cm.author_id) === String(currentUser?.id || currentUser?.user_id);
                      var isCmSuper = ['1', '320', '15403', '15404', '16568', '16576', '16594'].includes(String(cm.author_id || cm.user_id)) || String(cm.author_role || cm.role_bdb || '').toLowerCase() === 'superadmin';
                      var cmBadge = getVerificationBadge(cm.author_role || cm.role_bdb, isCmSuper, cm.author_id || cm.user_id, cm.author_username);
                      var cmHandle = formatCallsign(cm.author_callsign, cm.author_id || cm.user_id, cm.author_username);
                      var cmInitials = String(cm.author_name || cmHandle || 'P').charAt(0).toUpperCase();
                      var cmAvatar = isCmAuthor ? (currentUser?.photo_url || currentUser?.foto || cm.author_photo_url || cm.author_photo || null) : (cm.author_photo_url || cm.author_photo || null);`;

if (!f1.includes(oldCmAuthor)) {
  console.error('ERROR: oldCmAuthor not found!');
  process.exit(1);
}
f1 = f1.replace(oldCmAuthor, newCmAuthor);
console.log('Fixed comment author avatar.');

// 3. Reactions modal user avatar
const oldUsrReact = `            var reactObj = REACTIONS.find(r => r.type === rx.reaction_type) || { emoji: '👍', label: 'Suka' };
            var isUsrEko = String(usr.id) === '1' || usr.username === 'om.eko_42' || usr.username === 'omeko11';
            var isUsrSuper = isUsrEko || ['1', '320', '15403', '15404', '16568', '16576', '16594'].includes(String(usr.id)) || String(usr.role_bdb || usr.role || '').toLowerCase() === 'superadmin';
            var usrBadge = getVerificationBadge(usr.role_bdb || usr.role, isUsrSuper, usr.id, usr.username);
            var usrHandle = formatCallsign(usr.callsign, usr.id, usr.username);
            var initials = String(usr.name || usr.username || 'P').charAt(0).toUpperCase();
            var usrPhoto = (isUsrEko && (currentUser?.photo_url || currentUser?.foto)) ? (currentUser.photo_url || currentUser.foto) : (usr.photo_url || usr.foto || null);`;

const newUsrReact = `            var reactObj = REACTIONS.find(r => r.type === rx.reaction_type) || { emoji: '👍', label: 'Suka' };
            var isThisUserMe = String(usr.id) === String(currentUser?.id || currentUser?.user_id);
            var isUsrSuper = ['1', '320', '15403', '15404', '16568', '16576', '16594'].includes(String(usr.id)) || String(usr.role_bdb || usr.role || '').toLowerCase() === 'superadmin';
            var usrBadge = getVerificationBadge(usr.role_bdb || usr.role, isUsrSuper, usr.id, usr.username);
            var usrHandle = formatCallsign(usr.callsign, usr.id, usr.username);
            var initials = String(usr.name || usr.username || 'P').charAt(0).toUpperCase();
            var usrPhoto = isThisUserMe ? (currentUser?.photo_url || currentUser?.foto || usr.photo_url || usr.foto || null) : (usr.photo_url || usr.foto || null);`;

if (!f1.includes(oldUsrReact)) {
  console.error('ERROR: oldUsrReact not found!');
  process.exit(1);
}
f1 = f1.replace(oldUsrReact, newUsrReact);
console.log('Fixed reaction user avatar.');

fs.writeFileSync('3pp0f_cp6yg-o.patched.js', f1, 'utf8');
console.log('Saved updated 3pp0f_cp6yg-o.patched.js');


console.log('=== FIXING 3def3ti6rk0vr.patched.js ===');
let f2 = fs.readFileSync('3def3ti6rk0vr.patched.js', 'utf8');

// 4. Personal feed post avatar in profile
const oldProfilePost = `            var isAuthorEko = String(p.author_id) === '1' || p.author_username === 'omeko11' || p.author_callsign === 'omeko11' || (!p.author_id && (a?.id === '1' || a?.username === 'omeko11'));
            var isAuthorSuper = isAuthorEko || ['1', '320', '15403', '15404', '16568', '16576', '16594'].includes(String(p.author_id)) || String(p.author_role || '').toLowerCase() === 'superadmin';
            var pBadge = getVerificationBadge(p.author_role || a?.role, isAuthorSuper, p.author_id || a?.id, p.author_username || a?.username);
            var pHandle = formatCallsign(p.author_callsign || a?.callsign, p.author_id || a?.id, p.author_username || a?.username);
            var pAvatar = p.author_photo_url || p.photo_url || (isAuthorEko ? (a?.photo_url || a?.foto || null) : null);
            var pInitials = String(p.author_name || a?.name || pHandle || 'P').charAt(0).toUpperCase();`;

const newProfilePost = `            var isAuthorThisProfile = String(p.author_id) === String(a?.id);
            var isAuthorSuper = ['1', '320', '15403', '15404', '16568', '16576', '16594'].includes(String(p.author_id)) || String(p.author_role || '').toLowerCase() === 'superadmin';
            var pBadge = getVerificationBadge(p.author_role || a?.role, isAuthorSuper, p.author_id || a?.id, p.author_username || a?.username);
            var pHandle = formatCallsign(p.author_callsign || (isAuthorThisProfile ? a?.callsign : null), p.author_id || a?.id, p.author_username || (isAuthorThisProfile ? a?.username : null));
            var pAvatar = p.author_photo_url || p.photo_url || (isAuthorThisProfile ? (a?.photo_url || a?.foto || null) : null);
            var pInitials = String(p.author_name || (isAuthorThisProfile ? a?.name : null) || pHandle || 'P').charAt(0).toUpperCase();`;

if (!f2.includes(oldProfilePost)) {
  console.error('ERROR: oldProfilePost not found!');
  process.exit(1);
}
f2 = f2.replace(oldProfilePost, newProfilePost);
console.log('Fixed profile post avatar.');

// 5. Personal likes modal in profile
const oldLikesUsr = `            var isUsrEko = String(usr.id) === '1' || usr.username === 'omeko11';
            var isUsrSuper = isUsrEko || ['1', '320', '15403', '15404', '16568', '16576', '16594'].includes(String(usr.id)) || String(usr.role_bdb || usr.role || '').toLowerCase() === 'superadmin';`;

const newLikesUsr = `            var isUsrSuper = ['1', '320', '15403', '15404', '16568', '16576', '16594'].includes(String(usr.id)) || String(usr.role_bdb || usr.role || '').toLowerCase() === 'superadmin';`;

if (!f2.includes(oldLikesUsr)) {
  console.error('ERROR: oldLikesUsr not found!');
  process.exit(1);
}
f2 = f2.replace(oldLikesUsr, newLikesUsr);
console.log('Fixed profile likes user badge.');

fs.writeFileSync('3def3ti6rk0vr.patched.js', f2, 'utf8');
console.log('Saved updated 3def3ti6rk0vr.patched.js');
console.log('ALL AVATAR OVERRIDES FIXED 100%!');
