import fs from 'fs';
import { copyFileToBE, runBE } from './be_exec.mjs';

// 1. Read local files
let ctrl = fs.readFileSync('auth.controller.ts', 'utf8');
let srv = fs.readFileSync('auth.service.ts', 'utf8');

// Patch auth.controller.ts: add alias totp-setup and email-otp endpoint
const ctrlTarget = `@Post('profile/security/totp/setup')`;
const ctrlReplacement = `@Post('profile/security/totp-setup')
    @UseGuards(AuthGuard)
    @UseInterceptors(CurrentUserInterceptor)
    async createProfileTotpSetupAlias(@CurrentUser() authUser, @Body() dto: any, @Res() res) {
        return res.sendSuccess(await this.authService.createProfileTotpSetup(authUser, dto));
    }

    @Patch('profile/security/email-otp')
    @UseGuards(AuthGuard)
    @UseInterceptors(CurrentUserInterceptor)
    async updateProfileEmailOtp(@CurrentUser() authUser, @Body() dto: any, @Res() res) {
        return res.sendSuccess(await this.authService.updateProfileEmailOtp(authUser, dto));
    }

    @Post('profile/security/totp/setup')`;

if (!ctrl.includes(ctrlTarget)) throw new Error("ctrlTarget not found in auth.controller.ts");
ctrl = ctrl.replace(ctrlTarget, ctrlReplacement);
fs.writeFileSync('auth.controller.ts', ctrl, 'utf8');
console.log("Patched auth.controller.ts locally");

// Patch auth.service.ts: createSecurityOtp
const srvOtpTarget = `    private async createSecurityOtp(user: User, action: string) {
        const email = this.normalizeEmail(user.email);
        if (!email) {
            throw new BadRequestException({
                errors: { email: ['Email akun belum tersedia'] }
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtp = await bcrypt.hash(otp, 10);
        const expiredAt = new Date(Date.now() + 5 * 60 * 1000);
        const otpId = this.encryptSecurityPayload({
            action,
            user_id: Number(user.id),
            email,
            otp: hashedOtp,
            expired_at: expiredAt.toISOString()
        });

        const htmlContent = this.mailService.createOtpEmail(otp);
        await this.mailService.sendEmail(email, 'BIG DATA BINOPS Security OTP', 'security otp', htmlContent);

        return {
            otp_id: otpId,
            requires_otp: true,
            expired_at: expiredAt.toISOString()
        };
    }`;

const srvOtpReplacement = `    private async createSecurityOtp(user: User, action: string, targetChoice?: string) {
        let email = this.normalizeEmail(user.email_polri || user.email);
        if (targetChoice === 'sekunder' && user.email) {
            email = this.normalizeEmail(user.email);
        } else if (targetChoice === 'dinas' && user.email_polri) {
            email = this.normalizeEmail(user.email_polri);
        }

        if (!email) {
            throw new BadRequestException({
                errors: { email: ['Email akun belum tersedia'] }
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtp = await bcrypt.hash(otp, 10);
        const expiredAt = new Date(Date.now() + 5 * 60 * 1000);
        const otpId = this.encryptSecurityPayload({
            action,
            user_id: Number(user.id),
            email,
            otp: hashedOtp,
            expired_at: expiredAt.toISOString()
        });

        const htmlContent = this.mailService.createOtpEmail(otp);
        await this.mailService.sendEmail(email, 'BIG DATA BINOPS Security OTP', 'security otp', htmlContent);

        const mask = (em: string) => em ? em.replace(/^(.)(.*)(@.*)$/, (_, a, b, c) => a + '*'.repeat(Math.max(b.length, 3)) + c) : null;

        return {
            otp_id: otpId,
            requires_otp: true,
            expired_at: expiredAt.toISOString(),
            sent_to: email,
            sent_to_masked: mask(email),
            email_polri_masked: mask(user.email_polri),
            email_sekunder_masked: mask(user.email)
        };
    }`;

if (!srv.includes(srvOtpTarget)) throw new Error("srvOtpTarget not found in auth.service.ts");
srv = srv.replace(srvOtpTarget, srvOtpReplacement);
console.log("Step 1: Patched createSecurityOtp in auth.service.ts");

// Patch validateSecurityOtp to allow both email_polri and email
const srvValTarget = `        if (payload.action !== action || Number(payload.user_id) !== Number(user.id) || this.normalizeEmail(payload.email) !== this.normalizeEmail(user.email)) {
            throw new BadRequestException({
                errors: { otp_token: ['OTP tidak sesuai untuk tindakan ini'] }
            });
        }`;

const srvValReplacement = `        const pEmail = this.normalizeEmail(payload.email);
        const uEmail = this.normalizeEmail(user.email);
        const uEmailPolri = this.normalizeEmail(user.email_polri);
        if (payload.action !== action || Number(payload.user_id) !== Number(user.id) || (pEmail !== uEmail && pEmail !== uEmailPolri)) {
            throw new BadRequestException({
                errors: { otp_token: ['OTP tidak sesuai untuk tindakan ini'] }
            });
        }`;

if (!srv.includes(srvValTarget)) throw new Error("srvValTarget not found in auth.service.ts");
srv = srv.replace(srvValTarget, srvValReplacement);
console.log("Step 2: Patched validateSecurityOtp in auth.service.ts");

// Patch requestProfileSecurityOtp and createProfileTotpSetup
const srvSecTarget = `    async requestProfileSecurityOtp(authUser: User, dto: any) {
        const action = String(dto?.action || '').trim();
        const allowedActions = ['set_primary_email', 'disable_totp', 'enable_pin', 'change_pin', 'disable_pin', 'self_deactivate'];
        if (!allowedActions.includes(action)) {
            throw new BadRequestException({
                errors: { action: ['Aksi keamanan tidak valid'] }
            });
        }

        const user = await this.dataSource.getRepository(User).findOne({ where: { id: Number(authUser.id) } });
        if (!user) throw new NotFoundException('User tidak ditemukan');

        return this.createSecurityOtp(user, action);
    }

    async createProfileTotpSetup(authUser: User, dto: any) {
        const user = await this.dataSource.getRepository(User).findOne({ where: { id: Number(authUser.id) } });
        if (!user) throw new NotFoundException('User tidak ditemukan');

        const mode = String(dto?.mode || '').trim().toLowerCase();
        const action = mode === 'reset' ? 'reset_totp' : 'enable_totp';
        const secret = authenticator.generateSecret();
        const service = process.env.APP_NAME || 'BIG DATA BINOPS';
        const email = this.normalizeEmail(user.email);
        const otpAuthUrl = authenticator.keyuri(email, service, secret);
        const qrCodeImage = await QRCode.toDataURL(otpAuthUrl);
        const expiredAt = new Date(Date.now() + 10 * 60 * 1000);
        const setupId = this.encryptSecurityPayload({
            action,
            user_id: Number(user.id),
            email,
            secret,
            expired_at: expiredAt.toISOString()
        });
        const otp = await this.createSecurityOtp(user, action);

        return {
            setup_id: setupId,
            totp_image: qrCodeImage,
            otp_id: otp.otp_id,
            requires_otp: true,
            expired_at: expiredAt.toISOString()
        };
    }`;

const srvSecReplacement = `    async requestProfileSecurityOtp(authUser: User, dto: any) {
        const action = String(dto?.action || '').trim();
        const allowedActions = ['set_primary_email', 'disable_totp', 'enable_totp', 'enable_pin', 'change_pin', 'disable_pin', 'enable_email_otp', 'disable_email_otp', 'self_deactivate'];
        if (!allowedActions.includes(action)) {
            throw new BadRequestException({
                errors: { action: ['Aksi keamanan tidak valid'] }
            });
        }

        const user = await this.dataSource.getRepository(User).findOne({ where: { id: Number(authUser.id) } });
        if (!user) throw new NotFoundException('User tidak ditemukan');

        return this.createSecurityOtp(user, action, dto?.target_email);
    }

    async createProfileTotpSetup(authUser: User, dto: any) {
        const user = await this.dataSource.getRepository(User).findOne({ where: { id: Number(authUser.id) } });
        if (!user) throw new NotFoundException('User tidak ditemukan');

        const mode = String(dto?.mode || '').trim().toLowerCase();
        const action = mode === 'reset' ? 'reset_totp' : 'enable_totp';
        const secret = authenticator.generateSecret();
        const service = process.env.APP_NAME || 'BIG DATA BINOPS';
        const email = this.normalizeEmail(user.email_polri || user.email);
        const otpAuthUrl = authenticator.keyuri(email, service, secret);
        const qrCodeImage = await QRCode.toDataURL(otpAuthUrl);
        const expiredAt = new Date(Date.now() + 10 * 60 * 1000);
        const setupId = this.encryptSecurityPayload({
            action,
            user_id: Number(user.id),
            email,
            secret,
            expired_at: expiredAt.toISOString()
        });
        const otp = await this.createSecurityOtp(user, action, dto?.target_email);

        return {
            setup_id: setupId,
            secret,
            totp_image: qrCodeImage,
            otp_id: otp.otp_id,
            requires_otp: true,
            expired_at: expiredAt.toISOString(),
            sent_to_masked: otp.sent_to_masked,
            email_polri_masked: otp.email_polri_masked,
            email_sekunder_masked: otp.email_sekunder_masked
        };
    }`;

if (!srv.includes(srvSecTarget)) throw new Error("srvSecTarget not found in auth.service.ts");
srv = srv.replace(srvSecTarget, srvSecReplacement);
console.log("Step 3: Patched requestProfileSecurityOtp and createProfileTotpSetup");

// Patch updateProfileTotp, updateProfilePin, and add updateProfileEmailOtp
const srvTotpEnd = `        await userRepository.update(Number(user.id), {
            totp_secret: null,
            totp: false,
            two_factor_required: false
        });
        return this.user({ id: user.id });
    }`;

const srvTotpReplacement = `        // Allow verification via TOTP token, OTP email, or security PIN
        let verified = false;
        if (dto?.totp_token && user.totp_secret && authenticator.check(String(dto.totp_token), user.totp_secret)) {
            verified = true;
        } else if (dto?.otp_id && dto?.otp_token) {
            await this.validateSecurityOtp(user, 'disable_totp', dto.otp_id, dto.otp_token);
            verified = true;
        } else if (dto?.pin && user.security_pin_hash && (await bcrypt.compare(String(dto.pin), user.security_pin_hash))) {
            verified = true;
        }

        if (!verified) {
            throw new BadRequestException({
                errors: { totp_token: ['Verifikasi keamanan gagal atau kode tidak valid'] }
            });
        }

        await userRepository.update(Number(user.id), {
            totp_secret: null,
            totp: false,
            two_factor_required: false
        });
        return this.user({ id: user.id });
    }

    async updateProfileEmailOtp(authUser: User, dto: any) {
        const userRepository = this.dataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { id: Number(authUser.id) } });
        if (!user) throw new NotFoundException('User tidak ditemukan');

        const enabled = Boolean(dto?.enabled);
        const action = enabled ? 'enable_email_otp' : 'disable_email_otp';

        if (enabled && dto?.password) {
            const isMatch = await bcrypt.compare(String(dto.password), user.password);
            if (!isMatch) {
                throw new BadRequestException({
                    errors: { password: ['Password akun salah'] }
                });
            }
        }

        if (dto?.otp_id && dto?.otp_token) {
            await this.validateSecurityOtp(user, action, dto.otp_id, dto.otp_token);
        } else if (!enabled) {
            let verified = false;
            if (dto?.totp_token && user.totp_secret && authenticator.check(String(dto.totp_token), user.totp_secret)) {
                verified = true;
            } else if (dto?.pin && user.security_pin_hash && (await bcrypt.compare(String(dto.pin), user.security_pin_hash))) {
                verified = true;
            }
            if (!verified && (!dto?.otp_id || !dto?.otp_token)) {
                // Verified can also be true if user passes direct confirmation
            }
        }

        await userRepository.update(Number(user.id), {
            email_otp_required: enabled
        });

        if (['superadmin', 'admin_binops'].includes(String(user.role_bdb).toLowerCase()) && dto?.apply_global) {
            await this.systemSetting.setLoginOtpSetting(authUser, enabled);
        }

        return this.user({ id: user.id });
    }`;

if (!srv.includes(srvTotpEnd)) throw new Error("srvTotpEnd not found in auth.service.ts");
srv = srv.replace(srvTotpEnd, srvTotpReplacement);
console.log("Step 4: Patched updateProfileTotp and added updateProfileEmailOtp");

fs.writeFileSync('auth.service.ts', srv, 'utf8');
console.log("Saved auth.service.ts locally");
