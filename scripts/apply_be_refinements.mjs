import fs from 'fs';

// 1. user.service.ts
let userCode = fs.readFileSync('user.service.ts', 'utf8');

// Update findByEmail
const findByEmailTarget = `.where('lower(user.email) = :email', { email: normalizedEmail })
            .orWhere('lower(user.email_google) = :email', { email: normalizedEmail })`;
const findByEmailReplacement = `.where('lower(user.email) = :email', { email: normalizedEmail })
            .orWhere('lower(user.email_google) = :email', { email: normalizedEmail })
            .orWhere('lower(user.email_polri) = :email', { email: normalizedEmail })`;

if (userCode.includes(findByEmailTarget)) {
    userCode = userCode.replace(findByEmailTarget, findByEmailReplacement);
    console.log("Updated findByEmail in user.service.ts");
} else {
    console.log("findByEmailTarget already updated or not found");
}

// Update findByLoginIdentifier
const findLoginTarget = `.where('lower(user.email_polri) = :id', { id: normalized })
            .orWhere('lower(user.username) = :id', { id: normalized })`;
const findLoginReplacement = `.where('lower(user.email_polri) = :id', { id: normalized })
            .orWhere('lower(user.username) = :id', { id: normalized })
            .orWhere('lower(user.email) = :id', { id: normalized })`;

if (userCode.includes(findLoginTarget)) {
    userCode = userCode.replace(findLoginTarget, findLoginReplacement);
    console.log("Updated findByLoginIdentifier in user.service.ts");
} else {
    console.log("findLoginTarget already updated or not found");
}

// Update updateOwnProfile signature & body
const updateOwnTarget = `async updateOwnProfile(authUser: User, dto: { name?: string; nrp?: string; pangkat?: string; jabatan?: string; satuan?: string; no_hp?: string; email_polri?: string; username?: string; is_pns?: boolean; social_media?: any; photo_url?: string; foto?: string }) {`;
const updateOwnReplacement = `async updateOwnProfile(authUser: User, dto: { name?: string; email?: string; nrp?: string; pangkat?: string; jabatan?: string; satuan?: string; no_hp?: string; email_polri?: string; username?: string; is_pns?: boolean; social_media?: any; photo_url?: string; foto?: string }) {`;

if (userCode.includes(updateOwnTarget)) {
    userCode = userCode.replace(updateOwnTarget, updateOwnReplacement);
    console.log("Updated updateOwnProfile signature in user.service.ts");
}

const updateOwnPolriSection = `                authUpdate.email_polri = emailPolri || null;
            }
        }`;

const updateOwnPolriReplacement = `                authUpdate.email_polri = emailPolri || null;
            }
        }
        if (dto.email !== undefined) {
            const secondaryEmail = this.normalizeEmail(dto.email);
            const targetEmail = secondaryEmail || authUpdate.email_polri || authUser.email_polri || authUser.email;
            if (targetEmail && targetEmail !== this.normalizeEmail(authUser.email)) {
                const check = await this.checkIdentifierAvailability('email', targetEmail, Number(authUser.id));
                if (!check.available) {
                    throw new ConflictException({ errors: { email: [\`Email ini sudah terdaftar\${check.satker_nama ? \` oleh satker \${check.satker_nama}\` : ''}. Butuh bantuan? Hubungi Pusat Bantuan.\`] } });
                }
                authUpdate.email = targetEmail;
            }
        }`;

if (userCode.includes(updateOwnPolriSection) && !userCode.includes('if (dto.email !== undefined)')) {
    userCode = userCode.replace(updateOwnPolriSection, updateOwnPolriReplacement);
    console.log("Added dto.email handling in updateOwnProfile in user.service.ts");
}

fs.writeFileSync('user.service.ts', userCode, 'utf8');

// 2. auth.service.ts
let authCode = fs.readFileSync('auth.service.ts', 'utf8');

const fpTarget = `.where('lower(user.email) = :email', { email })
                .orWhere('lower(user.email_google) = :email', { email })`;
const fpReplacement = `.where('lower(user.email) = :email', { email })
                .orWhere('lower(user.email_google) = :email', { email })
                .orWhere('lower(user.email_polri) = :email', { email })`;

if (authCode.includes(fpTarget)) {
    authCode = authCode.replace(fpTarget, fpReplacement);
    console.log("Updated forgotPasswordConfirm in auth.service.ts");
}

fs.writeFileSync('auth.service.ts', authCode, 'utf8');
console.log("Backend files updated locally.");
