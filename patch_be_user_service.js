const fs = require('fs');

const path = '/usr/src/app/dist/app_core/auth/user/user.service.js';
let code = fs.readFileSync(path, 'utf8');

// Backup
fs.writeFileSync(path + '.bak-banner-fix-' + Date.now(), code);

// 1. In getOwnProfile: replace 'social_media: user.social_media || policeProfile?.social_media || {},'
const target1 = 'social_media: user.social_media || policeProfile?.social_media || {},';
const replace1 = `social_media: (() => {
            const uSoc = (user.social_media && typeof user.social_media === 'object') ? user.social_media : {};
            const pSoc = (policeProfile?.social_media && typeof policeProfile.social_media === 'object') ? policeProfile.social_media : {};
            const m = { ...pSoc, ...uSoc };
            if (pSoc.banner_theme && !uSoc.banner_theme) m.banner_theme = pSoc.banner_theme;
            return m;
        })(),`;

if (!code.includes(target1)) {
  console.error('Target 1 not found!');
  process.exit(1);
}
code = code.replace(target1, replace1);

// 2. In updateOwnProfile: ensure direct update of auth_users.social_media
const target2 = `        if (dto.social_media !== undefined)
            authUpdate.social_media = dto.social_media;`;
const replace2 = `        if (dto.social_media !== undefined) {
            authUpdate.social_media = dto.social_media;
            try {
                await this.dataSource.query('UPDATE auth_users SET social_media = $1 WHERE id = $2', [JSON.stringify(dto.social_media), Number(authUser.id)]);
            } catch (eSoc) {}
        }`;

if (!code.includes(target2)) {
  console.error('Target 2 not found!');
  process.exit(1);
}
code = code.replace(target2, replace2);

fs.writeFileSync(path, code);
console.log('Successfully patched user.service.js in bdb-api!');
