import fs from 'fs';

let profile = fs.readFileSync('frontend-patch/3def3ti6rk0vr.patched.js', 'utf8');

const targetStr = `(0,n.useEffect)(() => {
  if (a?.social_media) {
    let soc = a.social_media;
    if (typeof soc.bio === 'string' && soc.bio) setBio(soc.bio);
    if (typeof soc.banner_theme === 'string' && soc.banner_theme) setBannerTheme(soc.banner_theme);
  }
  if (typeof a?.bio === 'string' && a.bio) setBio(a.bio);
  if (typeof a?.banner_theme === 'string' && a.banner_theme) setBannerTheme(a.banner_theme);
}, [a]);`;

const replacementStr = `(0,n.useEffect)(() => {
  if (a) {
    let soc = a.social_media || {};
    if (typeof soc === 'string') {
      try { soc = JSON.parse(soc); } catch(e) {}
    }
    var targetBio = (typeof a?.bio === 'string' && a.bio) ? a.bio : (typeof soc?.bio === 'string' ? soc.bio : '');
    setBio(targetBio);

    var defaultGrad = 'linear-gradient(135deg, #090d16 0%, #0f172a 45%, #1e293b 85%, #0369a1 100%)';
    var targetBanner = (typeof a?.banner_theme === 'string' && a.banner_theme) ? a.banner_theme : (typeof soc?.banner_theme === 'string' ? soc.banner_theme : defaultGrad);
    setBannerTheme(targetBanner);
  }
}, [a]);`;

if (!profile.includes(targetStr)) {
  throw new Error('targetStr not found!');
}

profile = profile.replace(targetStr, replacementStr);
new Function(profile);
fs.writeFileSync('frontend-patch/3def3ti6rk0vr.patched.js', profile);
console.log('Successfully updated banner and bio reset in useEffect([a])!');
