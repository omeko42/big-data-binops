import fs from 'fs';
import { execSync } from 'child_process';

let content = fs.readFileSync('scratch/0-gigr76s0g8t.live.js', 'utf8');

// 1. Replace formatCallsign fallback
const oldFallback = `      if (lu.username === 'omeko11' || String(lu.id) === '1' || String(lu.role_bdb||'').toLowerCase().includes('super')) return '@omeko11';
      if (lu.callsign) return '@' + String(lu.callsign).replace(/^@/, '');
      if (lu.username) return '@' + String(lu.username).replace(/^@/, '');
    } catch(e) {}
    return '@omeko11';`;

const newFallback = `      if (String(lu.id) === '1' || lu.username === 'omeko11' || lu.callsign === 'omeko11') return '@omeko11';
      if (lu.callsign && !String(lu.callsign).startsWith('user_')) return '@' + String(lu.callsign).replace(/^@/, '');
      if (lu.name && String(lu.name).trim()) return lu.name;
      if (lu.username && !String(lu.username).startsWith('user_')) return '@' + String(lu.username).replace(/^@/, '');
    } catch(e) {}
    return '@personil';`;

if (!content.includes(oldFallback)) {
  console.error('ERROR: oldFallback not found!');
  process.exit(1);
}
content = content.replace(oldFallback, newFallback);
console.log('✓ Replaced oldFallback in formatCallsign');

// 2. Replace isSuper and eo
const oldSuperAndEo = `let isSuper=Boolean(!curUser||String(curUser?.id)==='1'||String(curUser?.user_id)==='1'||curUser?.username==='omeko11'||curUser?.callsign==='omeko11'||String(curUser?.role_bdb||curUser?.role?.role_name||curUser?.role||'').toLowerCase().includes('super'));
let eo=isSuper?'@omeko11':(curUser?formatCallsign(curUser?.callsign,curUser?.id||curUser?.user_id,curUser?.username):'@omeko11');`;

const newSuperAndEo = `let isSuper=Boolean(curUser&&(String(curUser?.id)==='1'||String(curUser?.user_id)==='1'||curUser?.username==='omeko11'||curUser?.callsign==='omeko11'||String(curUser?.role_bdb||curUser?.role?.role_name||curUser?.role||'').toLowerCase().includes('super')||['1','320','15403','15404','16568','16576','16594'].includes(String(curUser?.id||curUser?.user_id))));
let eo=(function(){if(!curUser)return"Pengguna";var uid=String(curUser.id||curUser.user_id||'');if(uid==='1'||curUser.username==='omeko11'||curUser.callsign==='omeko11')return'@omeko11';var c=curUser.callsign?String(curUser.callsign).trim().replace(/^@/,''):'';if(c&&!c.startsWith('user_')&&!['personil','null','undefined','-'].includes(c.toLowerCase()))return'@'+c;if(curUser.name&&String(curUser.name).trim())return curUser.name;var u=curUser.username?String(curUser.username).trim().replace(/^@/,''):'';if(u&&!u.startsWith('user_')&&!['personil','null','undefined','-'].includes(u.toLowerCase()))return'@'+u;return formatCallsign(curUser.callsign,uid,curUser.username);})();`;

if (!content.includes(oldSuperAndEo)) {
  console.error('ERROR: oldSuperAndEo not found!');
  process.exit(1);
}
content = content.replace(oldSuperAndEo, newSuperAndEo);
console.log('✓ Replaced isSuper and eo');

// Write out patched file
fs.writeFileSync('scratch/0-gigr76s0g8t.patched.js', content);
fs.writeFileSync('frontend-patch/0-gigr76s0g8t.patched.js', content);

// Syntax validation
try {
  execSync('node -c scratch/0-gigr76s0g8t.patched.js');
  console.log('✓ Syntax check passed on scratch/0-gigr76s0g8t.patched.js');
} catch (e) {
  console.error('Syntax error:', e);
  process.exit(1);
}
