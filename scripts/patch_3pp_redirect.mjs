import fs from 'fs';
import cp from 'child_process';

console.log('=== UPDATING 3pp0f_cp6yg-o.patched.js FOR ENCRYPTED PROFILE REDIRECT ===');

let c3pp = fs.readFileSync('frontend-patch/3pp0f_cp6yg-o.patched.js', 'utf8').replace(/\r\n/g, '\n');

const startMarker = 'var handleOpenUserProfile = async (authorId, postContext) => {';
const endMarker = 'setLoadingProfile(!1);\n    }\n  };';

const startIdx = c3pp.indexOf(startMarker);
const endIdx = c3pp.indexOf(endMarker, startIdx);

if (startIdx === -1 || endIdx === -1) {
  throw new Error('Could not find handleOpenUserProfile boundaries in 3pp');
}

const replacementFn = `var handleOpenUserProfile = (authorId, postContext) => {
    if (!authorId && !postContext) return;
    var targetId = authorId || postContext?.author_id || postContext?.id;
    if (currentUser?.id && String(currentUser.id) === String(targetId)) {
      window.location.href = '/cms/profile';
      return;
    }
    var uname = postContext?.author_username || postContext?.username || 'polri';
    var rawKey = 'cas:pers:' + targetId + ':' + uname;
    var token = btoa(rawKey).replace(/=/g, '');
    window.location.href = '/cms/profile?u=' + token + '&ref=feed';
  };`;

c3pp = c3pp.substring(0, startIdx) + replacementFn + c3pp.substring(endIdx + endMarker.length);

fs.writeFileSync('frontend-patch/3pp0f_cp6yg-o.patched.js', c3pp, 'utf8');
cp.execSync('node -c frontend-patch/3pp0f_cp6yg-o.patched.js');
console.log('✓ 3pp0f_cp6yg-o.patched.js updated and syntax verified with 0 errors!');
