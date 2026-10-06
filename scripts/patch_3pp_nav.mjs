import fs from 'fs';

let feed = fs.readFileSync('frontend-patch/3pp0f_cp6yg-o.patched.js', 'utf8');

// 1. In mention click:
const oldMenNav = `window.location.href = '/cms/profile';
        },
        style: {
          color: "#38bdf8",`;

const newMenNav = `window.location.href = '/cms/profile?u=' + encodeURIComponent(handle);
        },
        style: {
          color: "#38bdf8",`;

if (feed.includes(oldMenNav)) {
  feed = feed.replace(oldMenNav, newMenNav);
  console.log('1. Updated mention click to include ?u= param.');
}

// 2. In author click:
const oldAuthNav = `sessionStorage.setItem('cas_view_user', JSON.stringify({
          id: targetId,
          handle: '@' + handle,
          username: targetUsername || handle,
          callsign: targetCallsign || handle
        }));
      } catch(e) {}
      window.location.href = '/cms/profile';`;

const newAuthNav = `sessionStorage.setItem('cas_view_user', JSON.stringify({
          id: targetId,
          handle: '@' + handle,
          username: targetUsername || handle,
          callsign: targetCallsign || handle
        }));
      } catch(e) {}
      window.location.href = '/cms/profile?u=' + encodeURIComponent(handle);`;

if (feed.includes(oldAuthNav)) {
  feed = feed.replace(oldAuthNav, newAuthNav);
  console.log('2. Updated author click to include ?u= param.');
}

new Function(feed);
fs.writeFileSync('frontend-patch/3pp0f_cp6yg-o.patched.js', feed);
console.log('3pp0f chunk validated successfully!');
