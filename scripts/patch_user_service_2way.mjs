import fs from 'fs';

// 1. Update user.service.ts
let userCode = fs.readFileSync('user.service.ts', 'utf8');

// Target 1: create()
const oldCreate = `if (rest.email_polri && rest.username && this.normalizeEmail(rest.email_polri) === this.normalizeEmail(rest.username)) {
            throw new BadRequestException({ errors: { username: ['Username tidak boleh sama dengan Email Dinas Polri. Gunakan username alfanumerik / alias lain.'] } });
        }`;

const newCreate = `if (rest.email_polri && rest.username && this.normalizeEmail(rest.email_polri) === this.normalizeEmail(rest.username)) {
            throw new BadRequestException({
                message: 'Username dan Email Dinas Polri tidak boleh sama. Gunakan username alfanumerik / alias unik.',
                errors: {
                    username: ['Username tidak boleh sama dengan Email Dinas Polri.'],
                    email_polri: ['Email Dinas Polri tidak boleh sama dengan Username.']
                }
            });
        }`;

if (!userCode.includes(oldCreate)) {
  console.error('oldCreate target not found in user.service.ts');
  process.exit(1);
}
userCode = userCode.replace(oldCreate, newCreate);

// Target 2: update()
const oldUpdate = `if (polriToCheck && usernameToCheck && this.normalizeEmail(polriToCheck) === this.normalizeEmail(usernameToCheck)) {
                throw new BadRequestException({ errors: { username: ['Username tidak boleh sama dengan Email Dinas Polri. Gunakan username alfanumerik / alias lain.'] } });
            }`;

const newUpdate = `if (polriToCheck && usernameToCheck && this.normalizeEmail(polriToCheck) === this.normalizeEmail(usernameToCheck)) {
                throw new BadRequestException({
                    message: 'Username dan Email Dinas Polri tidak boleh sama. Gunakan username alfanumerik / alias unik.',
                    errors: {
                        username: ['Username tidak boleh sama dengan Email Dinas Polri.'],
                        email_polri: ['Email Dinas Polri tidak boleh sama dengan Username.']
                    }
                });
            }`;

if (!userCode.includes(oldUpdate)) {
  console.error('oldUpdate target not found in user.service.ts');
  process.exit(1);
}
userCode = userCode.replace(oldUpdate, newUpdate);

// Target 3: updateProfile()
const oldProfile = `if (effectivePolri && effectiveUsername && this.normalizeEmail(effectivePolri) === this.normalizeEmail(effectiveUsername)) {
            throw new BadRequestException({ errors: { username: ['Username tidak boleh sama dengan Email Dinas Polri. Gunakan username alfanumerik / alias lain.'] } });
        }`;

const newProfile = `if (effectivePolri && effectiveUsername && this.normalizeEmail(effectivePolri) === this.normalizeEmail(effectiveUsername)) {
            throw new BadRequestException({
                message: 'Username dan Email Dinas Polri tidak boleh sama. Gunakan username alfanumerik / alias unik.',
                errors: {
                    username: ['Username tidak boleh sama dengan Email Dinas Polri.'],
                    email_polri: ['Email Dinas Polri tidak boleh sama dengan Username.']
                }
            });
        }`;

if (!userCode.includes(oldProfile)) {
  console.error('oldProfile target not found in user.service.ts');
  process.exit(1);
}
userCode = userCode.replace(oldProfile, newProfile);

fs.writeFileSync('user.service.ts', userCode, 'utf8');
console.log('user.service.ts updated successfully with 2-way validation.');
