"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const user_service_1 = require("./user/user.service");
const device_service_1 = require("./device/device.service");
const bcrypt = require("bcrypt");
const constants_1 = require("./constants");
const crypto = require("crypto");
const pow_captcha_util_1 = require("./pow-captcha.util");
const otplib_1 = require("otplib");
const QRCode = require("qrcode");
const auth_helper_service_1 = require("../helper/service/auth.helper.service");
const mail_service_1 = require("../helper/service/mail.service");
const typeorm_1 = require("typeorm");
const table_helper_service_1 = require("../helper/service/table.helper.service");
const user_entity_1 = require("./user/entities/user.entity");
const current_user_decorator_1 = require("../helper/decoration/current-user.decorator");
const permission_entity_1 = require("./permission/entities/permission.entity");
const role_entity_1 = require("../../orgaisasi/entity/role.entity");
const organisasi_entity_1 = require("../../orgaisasi/entity/organisasi.entity");
const organisasi_role_util_1 = require("./organisasi-role.util");
const updateUser_dto_1 = require("./user/dto/updateUser.dto");
const level_entity_1 = require("../../orgaisasi/entity/level.entity");
const cache_manager_1 = require("@nestjs/cache-manager");
const audit_service_1 = require("../../bdb/audit/audit.service");
const system_setting_service_1 = require("../../bdb/system-setting/system-setting.service");
let AuthService = class AuthService {
    usersService;
    jwtService;
    deviceService;
    auth;
    mailService;
    dataSource;
    tableHelper;
    audit;
    systemSetting;
    cacheManager;
    constructor(usersService, jwtService, deviceService, auth, mailService, dataSource, tableHelper, audit, systemSetting, cacheManager) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.deviceService = deviceService;
        this.auth = auth;
        this.mailService = mailService;
        this.dataSource = dataSource;
        this.tableHelper = tableHelper;
        this.audit = audit;
        this.systemSetting = systemSetting;
        this.cacheManager = cacheManager;
    }
    normalizeEmail(email) {
        return String(email || '').trim().toLowerCase();
    }
    normalizeRequestedRole(role) {
        const value = String(role || '').trim().toLowerCase();
        return ['admin_binops', 'operator', 'viewer', 'sharese'].includes(value) ? value : 'viewer';
    }
    normalizeBdbRole(role) {
        const value = String(role || '').trim().toLowerCase();
        return ['superadmin', 'admin_binops', 'operator', 'viewer', 'sharese'].includes(value) ? value : 'viewer';
    }
    cleanOptionalText(value) {
        if (value === undefined || value === null)
            return null;
        const text = String(value).trim();
        return text === '' ? null : text;
    }
    securityKey() {
        const secret = process.env.CAPTCHA_SECRET || 'default_secret_key';
        const keyBuffer = crypto.createHash('sha256').update(secret).digest();
        return new Uint8Array(keyBuffer);
    }
    encryptSecurityPayload(payload) {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-cbc', this.securityKey(), iv);
        let encrypted = cipher.update(JSON.stringify(payload), 'utf8', 'base64');
        encrypted += cipher.final('base64');
        return iv.toString('base64') + ':' + encrypted;
    }
    decryptSecurityPayloadRaw(payloadId) {
        const [ivBase64, encryptedBase64] = String(payloadId || '').split(':');
        if (!ivBase64 || !encryptedBase64) {
            throw new common_1.BadRequestException({
                errors: { otp_token: ['Format token tidak valid'] }
            });
        }
        const iv = Buffer.from(ivBase64, 'base64');
        const decipher = crypto.createDecipheriv('aes-256-cbc', this.securityKey(), iv);
        let decrypted = decipher.update(encryptedBase64, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        return JSON.parse(decrypted);
    }
    decryptSecurityPayload(payloadId) {
        const payload = this.decryptSecurityPayloadRaw(payloadId);
        if (payload.expired_at && new Date(payload.expired_at) < new Date()) {
            throw new common_1.BadRequestException({
                errors: { otp_token: ['Kode sudah kedaluwarsa'] }
            });
        }
        return payload;
    }
    async sendLoginOtp(user) {
        const emailPolri = this.normalizeEmail(user.email_polri);
        if (!emailPolri) {
            throw new common_1.BadRequestException({
                errors: { email: ['Email dinas Polri (@polri.go.id) belum diisi di akun ini. Hubungi superadmin untuk melengkapi.'] }
            });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtp = await bcrypt.hash(otp, 10);
        const expiredAt = new Date(Date.now() + 5 * 60 * 1000);
        const otpId = this.encryptSecurityPayload({
            action: 'login',
            user_id: Number(user.id),
            email: emailPolri,
            otp: hashedOtp,
            expired_at: expiredAt.toISOString()
        });
        const htmlContent = this.mailService.createOtpEmail(otp);
        await this.mailService.sendEmail(emailPolri, 'BIG DATA BINOPS Security OTP', 'login otp', htmlContent);
        return {
            otp_id: otpId,
            requires_otp: true,
            expired_at: expiredAt.toISOString(),
            otp_email: emailPolri
        };
    }
    async resendLoginOtp(otpId) {
        const payload = this.decryptSecurityPayloadRaw(otpId);
        if (payload.action !== 'login') {
            throw new common_1.BadRequestException({
                errors: { otp_token: ['Sesi OTP tidak valid'] }
            });
        }
        const user = await this.dataSource.getRepository(user_entity_1.User).findOne({ where: { id: Number(payload.user_id) } });
        if (!user || this.normalizeEmail(user.email_polri) !== this.normalizeEmail(payload.email)) {
            throw new common_1.BadRequestException({
                errors: { otp_token: ['Sesi OTP tidak valid'] }
            });
        }
        return this.sendLoginOtp(user);
    }
    otpRateLimits = new Map();
    checkOtpRateLimit(key) {
        const now = Date.now();
        const existing = this.otpRateLimits.get(key);
        if (!existing) {
            this.otpRateLimits.set(key, { lastSentAt: now, attempts: 1, windowStart: now });
            return;
        }
        if (now - existing.windowStart > 15 * 60 * 1000) {
            existing.windowStart = now;
            existing.attempts = 1;
            existing.lastSentAt = now;
            return;
        }
        const elapsed = now - existing.lastSentAt;
        if (elapsed < 60 * 1000) {
            const waitSeconds = Math.ceil((60 * 1000 - elapsed) / 1000);
            throw new common_1.BadRequestException({
                message: `Tunggu ${waitSeconds} detik sebelum meminta kode OTP kembali.`,
                errors: { otp: [`Tunggu ${waitSeconds} detik sebelum meminta kode OTP kembali.`] }
            });
        }
        if (existing.attempts >= 3) {
            throw new common_1.BadRequestException({
                message: 'Batas pengiriman OTP tercapai (maksimal 3 kali). Silakan coba lagi nanti.',
                errors: { otp: ['Batas pengiriman OTP tercapai (maksimal 3 kali). Silakan coba lagi dalam 15 menit.'] }
            });
        }
        existing.attempts += 1;
        existing.lastSentAt = now;
    }
    clearOtpRateLimit(key) {
        this.otpRateLimits.delete(key);
    }
    async createSecurityOtp(user, action, targetChoice) {
        const rateLimitKey = `sec_otp:${user.id}:${action}`;
        this.checkOtpRateLimit(rateLimitKey);
        let email = this.normalizeEmail(user.email_polri || user.email);
        if (targetChoice === 'sekunder' && user.email) {
            email = this.normalizeEmail(user.email);
        }
        else if (targetChoice === 'dinas' && user.email_polri) {
            email = this.normalizeEmail(user.email_polri);
        }
        if (!email) {
            throw new common_1.BadRequestException({
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
        const mask = (em) => em ? em.replace(/^(.)(.*)(@.*)$/, (_, a, b, c) => a + '*'.repeat(Math.max(b.length, 3)) + c) : null;
        return {
            otp_id: otpId,
            requires_otp: true,
            expired_at: expiredAt.toISOString(),
            sent_to: email,
            sent_to_masked: mask(email),
            email_polri_masked: mask(user.email_polri),
            email_sekunder_masked: mask(user.email)
        };
    }
    async validateSecurityOtp(user, action, otpId, otpToken) {
        const payload = await this.falidationOtp(otpId, otpToken);
        if (payload instanceof Error) {
            throw new common_1.BadRequestException({
                errors: { otp_token: ['OTP belum diisi'] }
            });
        }
        const pEmail = this.normalizeEmail(payload.email);
        const uEmail = this.normalizeEmail(user.email);
        const uEmailPolri = this.normalizeEmail(user.email_polri);
        if (payload.action !== action || Number(payload.user_id) !== Number(user.id) || (pEmail !== uEmail && pEmail !== uEmailPolri)) {
            throw new common_1.BadRequestException({
                errors: { otp_token: ['OTP tidak sesuai untuk tindakan ini'] }
            });
        }
        this.clearOtpRateLimit(`sec_otp:${user.id}:${action}`);
        return payload;
    }
    validatePinFormat(pin, field = 'pin') {
        const value = String(pin || '').trim();
        if (!/^\d{6,8}$/.test(value)) {
            throw new common_1.BadRequestException({
                errors: { [field]: ['PIN wajib 6-8 digit angka'] }
            });
        }
        return value;
    }
    async finishLoginAfterFactors(user, result, method) {
        if (await this.systemSetting.isLoginOtpRequired()) {
            const otp = await this.sendLoginOtp(user);
            return {
                requires_otp: true,
                requires_totp: false,
                requires_pin: false,
                totp_secret: false,
                access_token: '',
                refresh_token: '',
                otp_id: otp.otp_id,
                expired_at: otp.expired_at,
                otp_email: otp.otp_email
            };
        }
        return this.createLoginSession(user, result, method);
    }
    async createLoginSession(user, result, method, impersonatedBy) {
        const compactUser = { id: user.id, name: user.name, username: user.username, email: user.email, role_bdb: user.role_bdb, role_name: user.role_name, organisasi_id: user.organisasi_id || user.organisasiId || user.Organisasi?.id || 1, scope_satker_id: user.scope_satker_id, scope_satker_key: user.scope_satker_key };
        const device = await this.deviceService.create(user.id, result.device.model || 'Unknown Device', result.device.vendor || 'Unknown Token', result.os.name || 'Unknown OS', result.browser.name + result.browser.version || 'unknown browser');
        const payload = {
            id: user.id,
            username: user.name,
            device_id: device.id,
            device_token: device.device_token,
            user: compactUser
        };
        if (impersonatedBy)
            payload.impersonated_by = impersonatedBy;
        const accessToken = await this.jwtService.signAsync(payload, {
            expiresIn: impersonatedBy ? '30m' : '240m'
        });
        const expiresAt = new Date(Date.now() + (impersonatedBy ? 29 : 230) * 60 * 1000).toISOString();
        const refreshToken = device.refresh_token;
        if (!impersonatedBy)
            await this.usersService.markLogin(user.id, method);
        return {
            requires_otp: false,
            requires_totp: false,
            requires_pin: false,
            totp_secret: false,
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_at: expiresAt,
            impersonated: !!impersonatedBy
        };
    }
    async impersonate(actorUser, targetUserId, uaResult, keterangan) {
        const actorRole = String(actorUser?.role_bdb || '').toLowerCase();
        const actorId = Number(actorUser?.id);
        if (actorRole !== 'superadmin') {
            throw new common_1.ForbiddenException('Hanya superadmin yang dapat impersonate akun lain.');
        }
        if (Number(targetUserId) === actorId) {
            throw new common_1.BadRequestException('Tidak bisa impersonate akun sendiri.');
        }
        const wordCount = String(keterangan || '').trim().split(/\s+/).filter(Boolean).length;
        if (wordCount < 10) {
            throw new common_1.BadRequestException('Keterangan/alasan impersonate wajib diisi, minimal 10 kata.');
        }
        const target = await this.usersService.findOne(String(targetUserId));
        if (!target)
            throw new common_1.NotFoundException('Pengguna tidak ditemukan.');
        if (String(target.role_bdb || '').toLowerCase() === 'superadmin') {
            throw new common_1.ForbiddenException('Tidak bisa impersonate akun superadmin.');
        }
        const session = await this.createLoginSession(target, uaResult, 'IMPERSONATE', { id: actorId, name: actorUser.name });
        await this.audit.log({
            userId: actorId,
            userName: actorUser.name,
            action: 'IMPERSONATE',
            entity: 'auth',
            entityId: target.id,
            meta: {
                target_user_id: target.id,
                target_name: target.name,
                target_email: target.email,
                target_role: target.role_bdb,
                keterangan: keterangan.trim()
            }
        });
        return session;
    }
    async signIn(userDto, result) {
        if (!(await this.validateCaptcha(userDto.captcha_id, userDto.captcha))) {
            throw new common_1.BadRequestException({
                errors: { captcha: ['invalid captcha'] }
            });
        }
        const user = await this.usersService.findByLoginIdentifier(userDto.email);
        if (!user) {
            throw new common_1.BadRequestException({
                errors: { password: ['invalid credentials'] }
            });
        }
        this.usersService.assertCanPasswordLogin(user);
        const lockedMinutes = this.usersService.lockRemainingMinutes(user);
        if (lockedMinutes > 0) {
            throw new common_1.BadRequestException({
                errors: { password: [`Akun terkunci karena 3x gagal login. Coba lagi dalam ${lockedMinutes} menit.`] }
            });
        }
        if (!(await bcrypt.compare(userDto.password, user.password))) {
            const r = await this.usersService.registerFailedLogin(user);
            throw new common_1.BadRequestException({
                errors: {
                    password: [r.locked ? `Password salah. Akun dikunci ${r.minutes} menit karena 3x gagal.` : `Password salah. Sisa percobaan: ${r.remaining}.`]
                }
            });
        }
        if (String(user.role_bdb || '').toLowerCase() !== 'superadmin' && (await this.systemSetting.isMaintenanceEnabled())) {
            const status = await this.systemSetting.getPublicMaintenanceStatus();
            throw new common_1.BadRequestException({
                errors: { account: [status.message] },
                data: { maintenance: true }
            });
        }
        const requiresTotp = Boolean(user.totp || user.two_factor_required);
        const requiresPin = Boolean(user.pin_required && user.security_pin_hash);
        if (requiresPin) {
            return {
                requires_otp: false,
                requires_totp: requiresTotp,
                requires_pin: true,
                totp_secret: user.totp_secret ? true : false,
                access_token: '',
                refresh_token: ''
            };
        }
        if (requiresTotp) {
            return {
                requires_otp: false,
                requires_totp: true,
                requires_pin: false,
                totp_secret: user.totp_secret ? true : false,
                access_token: '',
                refresh_token: ''
            };
        }
        return this.finishLoginAfterFactors(user, result, 'LOCAL');
    }
    async verifyLoginOtp(dto, result) {
        const payload = await this.falidationOtp(dto?.otp_id, dto?.otp_token);
        if (payload instanceof Error) {
            throw new common_1.BadRequestException({
                errors: { otp_token: ['OTP belum diisi'] }
            });
        }
        if (payload.action !== 'login') {
            throw new common_1.BadRequestException({
                errors: { otp_token: ['OTP tidak sesuai untuk tindakan ini'] }
            });
        }
        const user = await this.usersService.findByLoginIdentifier(payload.email);
        if (!user || Number(user.id) !== Number(payload.user_id)) {
            throw new common_1.BadRequestException({
                errors: { otp_token: ['Sesi OTP tidak valid'] }
            });
        }
        return this.createLoginSession(user, result, 'LOCAL_OTP');
    }
    async verifyPin(dto, result) {
        const user = await this.usersService.findByLoginIdentifier(dto?.email);
        if (!user) {
            throw new common_1.BadRequestException({
                errors: { pin: ['invalid credentials'] }
            });
        }
        this.usersService.assertCanPasswordLogin(user);
        const lockedMinutes = this.usersService.lockRemainingMinutes(user);
        if (lockedMinutes > 0) {
            throw new common_1.BadRequestException({
                errors: { pin: [`Akun terkunci karena terlalu banyak percobaan gagal. Coba lagi dalam ${lockedMinutes} menit.`] }
            });
        }
        if (!(await bcrypt.compare(dto?.password || '', user.password))) {
            const r = await this.usersService.registerFailedLogin(user);
            throw new common_1.BadRequestException({
                errors: {
                    pin: [r.locked ? `Password salah. Akun dikunci ${r.minutes} menit karena terlalu banyak percobaan gagal.` : `Password salah. Sisa percobaan: ${r.remaining}.`]
                }
            });
        }
        if (!user.pin_required || !user.security_pin_hash) {
            throw new common_1.BadRequestException({
                errors: { pin: ['PIN login belum aktif'] }
            });
        }
        const pin = this.validatePinFormat(dto?.pin);
        if (!(await bcrypt.compare(pin, user.security_pin_hash))) {
            const r = await this.usersService.registerFailedLogin(user);
            throw new common_1.BadRequestException({
                errors: {
                    pin: [r.locked ? `PIN salah. Akun dikunci ${r.minutes} menit karena terlalu banyak percobaan gagal.` : `PIN salah. Sisa percobaan: ${r.remaining}.`]
                }
            });
        }
        const requiresTotp = Boolean(user.totp || user.two_factor_required);
        if (requiresTotp) {
            return {
                requires_otp: false,
                requires_totp: true,
                requires_pin: false,
                pin_session_id: this.encryptSecurityPayload({
                    action: 'pin_verified',
                    user_id: Number(user.id),
                    email: this.normalizeEmail(user.email),
                    expired_at: new Date(Date.now() + 5 * 60 * 1000).toISOString()
                }),
                totp_secret: user.totp_secret ? true : false,
                access_token: '',
                refresh_token: ''
            };
        }
        return this.finishLoginAfterFactors(user, result, 'LOCAL_PIN');
    }
    async register(dto, result) {
        const primaryEmail = this.normalizeEmail(dto.email);
        const emailGoogle = this.normalizeEmail(dto.email_google) || (primaryEmail.endsWith('@gmail.com') ? primaryEmail : null);
        const emailPolri = this.normalizeEmail(dto.email_polri) || (primaryEmail.endsWith('@polri.go.id') ? primaryEmail : null);
        const candidateEmails = Array.from(new Set([primaryEmail, emailGoogle, emailPolri].filter(Boolean)));
        for (const email of candidateEmails) {
            const existingUser = await this.usersService.findByEmail(email);
            if (existingUser) {
                throw new common_1.BadRequestException({
                    errors: { email: ['email sudah digunakan'] }
                });
            }
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtp = await bcrypt.hash(otp, 10);
        const expiredAt = new Date(Date.now() + 5 * 60 * 1000);
        const payload = {
            new_user: {
                ...dto,
                email: primaryEmail,
                email_google: emailGoogle,
                email_polri: emailPolri,
                requested_role_bdb: this.normalizeRequestedRole(dto.requested_role_bdb)
            },
            otp: hashedOtp,
            expired_at: expiredAt.toISOString()
        };
        const secret = process.env.CAPTCHA_SECRET || 'default_secret_key';
        const keyBuffer = crypto.createHash('sha256').update(secret).digest();
        const key = new Uint8Array(keyBuffer);
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        let encrypted = cipher.update(JSON.stringify(payload), 'utf8', 'base64');
        encrypted += cipher.final('base64');
        const otp_id = iv.toString('base64') + ':' + encrypted;
        const htmlContent = this.mailService.createOtpEmail(otp);
        await this.mailService.sendEmail(dto.email, 'Bareskrim CAS OTP', 'otp verivication', htmlContent);
        return {
            otp_id: otp_id,
            requires_otp: true
        };
    }
    async refreshToken(refreshTokenDto, res, req) {
        const renew_refres_toke = await this.deviceService.ReNewRefreshToken(refreshTokenDto.refresh_token);
        const accessToken = await this.jwtService.signAsync(renew_refres_toke.payload, { expiresIn: '240m' });
        const expiresAt = new Date(Date.now() + 230 * 60 * 1000).toISOString();
        return {
            requires_otp: false,
            access_token: accessToken,
            refresh_token: renew_refres_toke.data.refresh_token,
            expires_at: expiresAt
        };
    }
    async signOut(request) {
        const token = await this.extractTokenFromHeader(request);
        if (!token) {
            throw new common_1.UnauthorizedException('Token not found');
        }
        let payload;
        try {
            payload = await this.jwtService.verifyAsync(token, {
                secret: constants_1.jwtConstants.secret
            });
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
        if (!payload.device_id && !payload.device_token) {
            throw new common_1.UnauthorizedException('Device ID not found in token');
        }
        await this.dataSource.query(
            'DELETE FROM auth_devices WHERE id = $1 OR device_token = $2',
            [payload.device_id || 0, payload.device_token || '']
        );
        return { logged_out: true };
    }
    async extractTokenFromHeader(request) {
        const authHeader = request.headers.authorization;
        if (authHeader) {
            const [type, token] = authHeader.split(' ');
            return type === 'Bearer' ? token : undefined;
        }
        return undefined;
    }
    async user(authUser) {
        console.time('Total Execution');
        console.time('Step 1: Load User + Org + Level');
        const user = await this.dataSource.getRepository(user_entity_1.User).createQueryBuilder('user').leftJoinAndSelect('user.Organisasi', 'org').leftJoinAndSelect('org.OrganisasiLevel', 'level').leftJoinAndSelect('user.OrganisasiRole', 'role').where('user.id = :id', { id: authUser.id }).getOne();
        console.timeEnd('Step 1: Load User + Org + Level');
        if (!user)
            throw new common_1.NotFoundException('User tidak ditemukan');
        console.time('Step 2: Parallel Load Permissions, Menu, Root Levels');
        const cacheKeyMenu = 'treeMenu';
        const cacheKeyRoot = 'rootLevels_Cache';
        const [levelPermissions, rolePermissions, treeMenu, rootLevels] = await Promise.all([
            this.dataSource.getRepository(permission_entity_1.Permission).createQueryBuilder('perm').innerJoin('perm.OrganisasiLevel', 'level').where('level.id = :levelId', { levelId: user.Organisasi?.OrganisasiLevel?.id }).getMany(),
            this.dataSource.getRepository(permission_entity_1.Permission).createQueryBuilder('perm').innerJoin('perm.OrganisasiRole', 'role').where('role.id = :roleId', { roleId: user.OrganisasiRole?.id }).getMany(),
            this.cacheGetOrSet.call(this, cacheKeyMenu, async () => {
                return await this.dataSource.getTreeRepository(permission_entity_1.Permission).findTrees({ depth: 20 });
            }, 0),
            this.cacheGetOrSet.call(this, cacheKeyRoot, async () => {
                return await this.dataSource.getRepository(level_entity_1.OrganisasiLevel).find({
                    where: { level_name: (0, typeorm_1.In)(['Mabes', 'Polda']) }
                });
            }, 0)
        ]);
        console.timeEnd('Step 2: Parallel Load Permissions, Menu, Root Levels');
        user.Organisasi.OrganisasiLevel.Permission = levelPermissions;
        user.OrganisasiRole.Permission = rolePermissions;
        console.time('Step 3: Extract Permission IDs');
        const permissionIds = rolePermissions.map(p => p.id);
        const levelPermissionIds = levelPermissions.map(p => p.id);
        console.timeEnd('Step 3: Extract Permission IDs');
        console.time('Step 4: Filter Tree Menu');
        function filterTree(tree) {
            return tree
                .filter(node => permissionIds.includes(node.id) && levelPermissionIds.includes(node.id) && node.action === null && node.hide !== true)
                .map(node => {
                let { Timestamps, ...rawNode } = node;
                const newNode = rawNode;
                newNode.label = newNode.menu ?? newNode.group;
                newNode.items = newNode.children ? filterTree(newNode.children) : [];
                delete newNode.children;
                delete newNode.method;
                delete newNode.access_route;
                delete newNode.group;
                delete newNode.action;
                delete newNode.form_id;
                delete newNode.parent_menu;
                return newNode;
            });
        }
        const filteredTree = filterTree(treeMenu);
        console.timeEnd('Step 4: Filter Tree Menu');
        console.time('Step 5: Clean Permissions');
        const cleanedPermission = rolePermissions.map(({ Timestamps, ...rest }) => rest);
        console.timeEnd('Step 5: Clean Permissions');
        console.time('Step 6: Resolve Satker');
        const userPath = user.Organisasi?.OrganisasiLevel?.path ?? '';
        const matchedRoot = rootLevels.filter(root => userPath.startsWith(root.path)).sort((a, b) => b.path.length - a.path.length)[0];
        let satker = user.Organisasi?.name;
        if (matchedRoot) {
            const orgPathIds = user.Organisasi.path.split('/').filter(Boolean);
            const rootLevelPathIds = matchedRoot.path.split('/').filter(Boolean);
            const startIndex = rootLevelPathIds.length - 1;
            const resultOrgIds = orgPathIds.slice(startIndex);
            const orgs = await this.dataSource.getRepository(organisasi_entity_1.Organisasi).findBy({
                id: (0, typeorm_1.In)(resultOrgIds)
            });
            satker = orgs
                .sort((a, b) => b.path.length - a.path.length)
                .map(org => org.name)
                .join(' ');
        }
        console.timeEnd('Step 6: Resolve Satker');
        const [scopeRowsMaster, policeRows] = await Promise.all([
            this.dataSource.query(`
                select id, satker_key, nama_satker_canonical, level, full_path
                from bdb_satker_master
                where ($1::bigint is not null and id = $1::bigint)
                   or ($2::text is not null and satker_key = $2::text)
                order by id asc
                limit 1
                `, [user.scope_satker_id ? Number(user.scope_satker_id) : null, user.scope_satker_key || null]),
            this.dataSource.query(`
                select nrp, nama, satuan, no_hp, pangkat, jabatan, email, foto, is_pns, social_media
                from trb_police
                where lower(email) = any($1::text[])
                order by id desc
                limit 1
                `, [[this.normalizeEmail(user.email), this.normalizeEmail(user.email_polri)].filter(Boolean)])
        ]);
        let scopeRow = scopeRowsMaster[0];
        if (!scopeRow) {
            const bdbSatkerRows = await this.dataSource.query(`
                select id, kode as satker_key, coalesce(deskripsi, nama_singkat) as nama_satker_canonical, tipe_satker as level, coalesce(deskripsi, nama_singkat) as full_path
                from bdb_satker
                where ($1::bigint is not null and id = $1::bigint)
                   or ($2::text is not null and kode = $2::text)
                order by id asc
                limit 1
            `, [user.scope_satker_id ? Number(user.scope_satker_id) : null, user.scope_satker_key || null]);
            scopeRow = bdbSatkerRows[0];
        }
        const policeProfile = policeRows[0];
        const roleBdb = this.normalizeBdbRole(user.role_bdb);
        if (scopeRow?.nama_satker_canonical && roleBdb !== 'superadmin') {
            satker = scopeRow.nama_satker_canonical;
        } else if (roleBdb !== 'superadmin' && satker && String(satker).toLowerCase().includes('superadmin')) {
            satker = policeProfile?.satuan || 'Polri';
        }
        const scopeAccessDisplay = roleBdb === 'superadmin'
            ? 'Nasional'
            : scopeRow?.nama_satker_canonical
                ? `${scopeRow.nama_satker_canonical} dan bawahannya`
                : satker || 'Belum pilih';
        console.time('Step 7: Transform Final Object');
        const transformUser = {
            id: user.id,
            user_name: user.name,
            name: user.name,
            email: user.email,
            email_google: user.email_google,
            email_polri: user.email_polri,
            username: user.username,
            callsign: user.callsign,
            login_method: user.login_method,
            local_password_enabled: user.local_password_enabled,
            role_bdb: user.role_bdb,
            requested_role_bdb: user.requested_role_bdb,
            approval_status: user.approval_status,
            status: user.status,
            scope_satker_id: user.scope_satker_id,
            scope_satker_key: user.scope_satker_key,
            scope_satker_name: roleBdb === 'superadmin' ? '-' : scopeRow?.nama_satker_canonical || null,
            satker_nama: roleBdb === 'superadmin' ? 'Robinopsnal Bareskrim Polri' : scopeRow?.nama_satker_canonical || satker || null,
            scope_satker_level: roleBdb === 'superadmin' ? null : scopeRow?.level || null,
            scope_access_display: scopeAccessDisplay,
            nrp: policeProfile?.nrp || null,
            no_hp: policeProfile?.no_hp || null,
            satuan: policeProfile?.satuan || null,
            pangkat: policeProfile?.pangkat || null,
            jabatan: policeProfile?.jabatan || null,
            foto: user.photo_url || policeProfile?.foto || null,
            photo_url: user.photo_url || policeProfile?.foto || null,
            is_pns: Boolean(user.is_pns || policeProfile?.is_pns),
            social_media: user.social_media || policeProfile?.social_media || {},
            two_factor_required: user.two_factor_required,
            email_otp_required: await this.systemSetting.isLoginOtpRequired(),
            totp_enabled: Boolean(user.totp_secret || user.totp),
            pin_required: Boolean(user.pin_required),
            satker: satker,
            Organisasi: user.Organisasi,
            role: {
                role_name: user.OrganisasiRole.role_name,
                role_bdb: user.role_bdb,
                menu: filteredTree,
                permission: cleanedPermission
            }
        };
        console.timeEnd('Step 7: Transform Final Object');
        console.timeEnd('Total Execution');
        return transformUser;
    }
    async cacheGetOrSet(key, fetcher, ttl) {
        const cached = await this.cacheManager.get(key);
        if (cached !== undefined && cached !== null) {
            return cached;
        }
        const freshData = await fetcher();
        await this.cacheManager.set(key, freshData, ttl);
        return freshData;
    }
    async verifyOtp(action, otp_id, otp_token) {
        if (action === 'registration') {
            const payload = await this.falidationOtp(otp_id, otp_token);
            const queryRunner = this.dataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();
            try {
                const existingdata = await queryRunner.manager.findOne(user_entity_1.User, {
                    where: { email: payload.new_user.email }
                });
                if (existingdata) {
                    throw new common_1.BadRequestException({
                        errors: { otp_token: ['Email sudah digunakan'] }
                    });
                }
                if (payload.new_user.password !== payload.new_user.password_confirmation) {
                    throw new common_1.BadRequestException({
                        message: 'Bad Request',
                        errors: {
                            password: ['Password confirmation does not match password']
                        }
                    });
                }
                const hashedPassword = await bcrypt.hash(payload.new_user.password, 10);
                const viewerRoleId = await (0, organisasi_role_util_1.resolveOrganisasiRoleId)(this.dataSource, 'viewer');
                const newData = queryRunner.manager.create(user_entity_1.User, {
                    name: payload.new_user.name,
                    email: payload.new_user.email,
                    email_google: payload.new_user.email_google || null,
                    email_polri: payload.new_user.email_polri || null,
                    password: hashedPassword,
                    login_method: 'HYBRID',
                    local_password_enabled: true,
                    role_name: 'viewer',
                    role_bdb: 'viewer',
                    requested_role_bdb: this.normalizeRequestedRole(payload.new_user.requested_role_bdb),
                    requested_scope_satker_id: payload.new_user.requested_scope_satker_id || null,
                    requested_scope_satker_key: payload.new_user.requested_scope_satker_key || null,
                    approval_status: 'PENDING_APPROVAL',
                    status: 'PENDING_APPROVAL',
                    two_factor_required: false,
                    email_otp_required: true,
                    totp: false,
                    otp: false,
                    Organisasi: { id: 1 },
                    ...(viewerRoleId != null ? { OrganisasiRole: { id: viewerRoleId } } : {}),
                    Police: {
                        nrp: payload.new_user.nrp,
                        nama: payload.new_user.nama,
                        jenis_kelamin: payload.new_user.jenis_kelamin,
                        pangkat: payload.new_user.pangkat,
                        jabatan: payload.new_user.jabatan,
                        satuan: payload.new_user.satuan,
                        no_hp: payload.new_user.no_hp,
                        email: payload.new_user.email
                    }
                });
                await queryRunner.manager.save(newData);
                await queryRunner.commitTransaction();
                return newData;
            }
            catch (error) {
                await queryRunner.rollbackTransaction();
                throw error;
            }
            finally {
                await queryRunner.release();
            }
        }
    }
    async captcha() {
        return (0, pow_captcha_util_1.generatePowCaptcha)();
    }
    async validateCaptcha(captchaId, userInput) {
        return (0, pow_captcha_util_1.verifyPowCaptcha)(captchaId, userInput);
    }
    async TotpRegistration(registerTotp) {
        const secret = otplib_1.authenticator.generateSecret();
        const service = process.env.APP_NAME || 'Bareskrim-CAS';
        const user = await this.usersService.findByLoginIdentifier(registerTotp.email);
        if (!user) {
            throw new common_1.BadRequestException({
                message: 'Akun tidak ditemukan atau sesi login telah berakhir',
                errors: { password: ['invalid credentials'] }
            });
        }
        this.usersService.assertCanPasswordLogin(user);
        if (!(await bcrypt.compare(registerTotp.password, user.password))) {
            throw new common_1.BadRequestException({
                message: 'Password salah',
                errors: { password: ['invalid credentials'] }
            });
        }
        if (user.pin_required && user.security_pin_hash) {
            let pinSession;
            try {
                pinSession = this.decryptSecurityPayload(registerTotp.pin_session_id);
            }
            catch {
                throw new common_1.BadRequestException({
                    message: 'PIN belum diverifikasi',
                    errors: { pin: ['PIN belum diverifikasi'] }
                });
            }
            if (pinSession.action !== 'pin_verified' || Number(pinSession.user_id) !== Number(user.id) || this.normalizeEmail(pinSession.email) !== this.normalizeEmail(user.email)) {
                throw new common_1.BadRequestException({
                    message: 'Sesi verifikasi PIN tidak valid',
                    errors: { pin: ['PIN belum diverifikasi'] }
                });
            }
        }
        const label = user.email_polri || user.email || user.username || registerTotp.email;
        const otpAuthUrl = otplib_1.authenticator.keyuri(label, service, secret);
        const qrCodeImage = await QRCode.toDataURL(otpAuthUrl);
        user.totp_secret = secret;
        await this.usersService.save(user);
        return { totp_image: qrCodeImage };
    }
    async TotpValidation(verifyTotp, result) {
        const user = await this.usersService.findByLoginIdentifier(verifyTotp.email);
        if (!user) {
            throw new common_1.BadRequestException({
                message: 'Akun tidak ditemukan atau sesi login telah berakhir',
                errors: { password: ['invalid credentials'] }
            });
        }
        this.usersService.assertCanPasswordLogin(user);
        if (!(await bcrypt.compare(verifyTotp.password, user.password))) {
            throw new common_1.BadRequestException({
                message: 'Password salah',
                errors: { password: ['invalid credentials'] }
            });
        }
        if (user.pin_required && user.security_pin_hash) {
            let pinSession;
            try {
                pinSession = this.decryptSecurityPayload(verifyTotp.pin_session_id);
            }
            catch {
                throw new common_1.BadRequestException({
                    message: 'PIN belum diverifikasi',
                    errors: { pin: ['PIN belum diverifikasi'] }
                });
            }
            if (pinSession.action !== 'pin_verified' || Number(pinSession.user_id) !== Number(user.id) || this.normalizeEmail(pinSession.email) !== this.normalizeEmail(user.email)) {
                throw new common_1.BadRequestException({
                    message: 'Sesi verifikasi PIN tidak valid',
                    errors: { pin: ['PIN belum diverifikasi'] }
                });
            }
        }
        if (!user.totp_secret) {
            throw new common_1.BadRequestException({
                message: 'Aplikasi Authenticator belum dikonfigurasi pada akun ini',
                errors: { totp_token: ['Aplikasi Authenticator belum dikonfigurasi pada akun ini'] }
            });
        }
        if (!verifyTotp.totp_token) {
            throw new common_1.BadRequestException({
                message: 'Masukkan 6 digit kode authenticator',
                errors: { totp_token: ['Masukkan 6 digit kode authenticator'] }
            });
        }
        otplib_1.authenticator.options = { window: [4, 4] };
        const isValid = otplib_1.authenticator.check(String(verifyTotp.totp_token).trim(), user.totp_secret);
        if (!isValid) {
            throw new common_1.BadRequestException({
                message: 'Kode authenticator salah atau telah kedaluwarsa',
                errors: { totp_token: ['Kode authenticator salah atau telah kedaluwarsa'] }
            });
        }
        return this.finishLoginAfterFactors(user, result, 'LOCAL_TOTP');
    }
    async receivedInvitation(dto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        const userEmail = `${dto.nrp}@polri.go.id`;
        const user = await queryRunner.manager.getRepository(user_entity_1.User).createQueryBuilder('user').addSelect('user.password').leftJoinAndSelect('user.OrganisasiRole', 'OrganisasiRole').where('user.email = :email', { email: userEmail }).getOne();
        const role = await queryRunner.manager.findOneOrFail(role_entity_1.OrganisasiRole, {
            where: { invitation_code: dto.role_code }
        });
        const BAKU_ROLES = ['superadmin', 'admin_binops', 'operator', 'viewer', 'sharese'];
        const roleBdbForInvite = BAKU_ROLES.includes(String(role.role_name || '').trim().toLowerCase()) ? String(role.role_name).trim().toLowerCase() : undefined;
        try {
            await queryRunner.startTransaction();
            if (user) {
                if (user.invitation_code === dto.inv_code && role.id === user.OrganisasiRole.id) {
                    await this.falidationOtp(dto.otp_id, dto.otp_token);
                    const updatedUser = queryRunner.manager.merge(user_entity_1.User, user, {
                        password: user.password ? user.password : await bcrypt.hash(dto.password, 10),
                        status: 'active'
                    });
                    console.log(updatedUser);
                    await queryRunner.manager.save(updatedUser);
                }
                else if (user.invitation_code != dto.inv_code) {
                    await this.falidationOtp(dto.otp_id, dto.otp_token);
                    const updatedUser = queryRunner.manager.merge(user_entity_1.User, user, {
                        password: user.password ? user.password : await bcrypt.hash(dto.password, 10),
                        OrganisasiRole: { id: role.id },
                        Organisasi: { id: role.organisasi_id },
                        ...(roleBdbForInvite ? { role_bdb: roleBdbForInvite, role_name: roleBdbForInvite, requested_role_bdb: roleBdbForInvite } : {}),
                        status: 'waiting approval'
                    });
                    await queryRunner.manager.save(updatedUser);
                }
                else {
                    await this.falidationOtp(dto.otp_id, dto.otp_token);
                    const updatedUser = queryRunner.manager.merge(user_entity_1.User, user, {
                        password: user.password ? user.password : await bcrypt.hash(dto.password, 10),
                        status: 'active'
                    });
                    await queryRunner.manager.save(updatedUser);
                }
            }
            else {
                await this.falidationOtp(dto.otp_id, dto.otp_token);
                const newUser = queryRunner.manager.create(user_entity_1.User, {
                    email: userEmail,
                    OrganisasiRole: { id: role.id },
                    Organisasi: { id: role.organisasi_id },
                    ...(roleBdbForInvite ? { role_bdb: roleBdbForInvite, role_name: roleBdbForInvite, requested_role_bdb: roleBdbForInvite } : {}),
                    password: await bcrypt.hash(dto.password, 10),
                    status: 'waiting approval'
                });
                await queryRunner.manager.save(newUser);
            }
            await queryRunner.commitTransaction();
            return 'Email berhasil dikirim';
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async sendOtp(dto) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtp = await bcrypt.hash(otp, 10);
        const expiredAt = new Date(Date.now() + 5 * 60 * 1000);
        const payload = {
            otp: hashedOtp,
            expired_at: expiredAt.toISOString()
        };
        const secret = process.env.CAPTCHA_SECRET || 'default_secret_key';
        const keyBuffer = crypto.createHash('sha256').update(secret).digest();
        const key = new Uint8Array(keyBuffer);
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        let encrypted = cipher.update(JSON.stringify(payload), 'utf8', 'base64');
        encrypted += cipher.final('base64');
        const otp_id = iv.toString('base64') + ':' + encrypted;
        const htmlContent = this.mailService.createOtpEmail(otp);
        await this.mailService.sendEmail(dto.email, 'Bareskrim CAS OTP', 'otp verivication', htmlContent);
        return {
            otp_id: otp_id,
            requires_otp: true
        };
    }
    async updateProfile(authUser, dto) {
        const userRepository = this.dataSource.getRepository(user_entity_1.User);
        const user = await userRepository.findOne({ where: { id: Number(authUser.id) } });
        if (!user)
            throw new common_1.NotFoundException('User tidak ditemukan');
        const emailGoogle = this.cleanOptionalText(dto?.email_google);
        const emailPolri = this.cleanOptionalText(dto?.email_polri);
        const emailCandidates = [emailGoogle, emailPolri].map(email => this.normalizeEmail(email)).filter(Boolean);
        if (emailCandidates.length) {
            const conflictRows = await this.dataSource.query(`
                select id
                from auth_users
                where id <> $1
                  and (
                    lower(email) = any($2::text[])
                    or lower(coalesce(email_google, '')) = any($2::text[])
                    or lower(coalesce(email_polri, '')) = any($2::text[])
                  )
                limit 1
                `, [Number(user.id), emailCandidates]);
            if (conflictRows.length) {
                throw new common_1.ConflictException({
                    errors: { email: ['Email sudah digunakan akun lain'] }
                });
            }
        }
        const updateData = {};
        if (Object.prototype.hasOwnProperty.call(dto || {}, 'name'))
            updateData.name = this.cleanOptionalText(dto.name) || user.name;
        if (Object.prototype.hasOwnProperty.call(dto || {}, 'email_google'))
            updateData.email_google = emailGoogle;
        if (Object.prototype.hasOwnProperty.call(dto || {}, 'email_polri'))
            updateData.email_polri = emailPolri;
        if (Object.keys(updateData).length) {
            await userRepository.update(Number(user.id), updateData);
        }
        const nrp = this.cleanOptionalText(dto?.nrp || dto?.nip || dto?.nrp_nip);
        const noHp = this.cleanOptionalText(dto?.no_hp || dto?.phone || dto?.no_handphone);
        const profileName = this.cleanOptionalText(dto?.name || user.name);
        if (nrp || noHp || profileName) {
            const existingRows = await this.dataSource.query(`
                select id
                from trb_police
                where lower(email) = $1
                order by id desc
                limit 1
                `, [this.normalizeEmail(user.email)]);
            if (existingRows[0]?.id) {
                await this.dataSource.query(`
                    update trb_police
                    set
                        nrp = coalesce($2, nrp),
                        nama = coalesce($3, nama),
                        no_hp = coalesce($4, no_hp),
                        email = $5,
                        updated_at = now()
                    where id = $1
                    `, [existingRows[0].id, nrp, profileName, noHp, this.normalizeEmail(user.email)]);
            }
            else {
                await this.dataSource.query(`
                    insert into trb_police (
                        nrp,
                        nama,
                        jenis_kelamin,
                        pangkat,
                        jabatan,
                        satuan,
                        no_hp,
                        email,
                        created_at,
                        updated_at
                    )
                    values ($1, $2, 'l', '-', '-', '-', $3, $4, now(), now())
                    `, [nrp, profileName, noHp, this.normalizeEmail(user.email)]);
            }
        }
        return this.user({ id: user.id });
    }
    async updateProfilePrimaryEmail(authUser, dto) {
        const userRepository = this.dataSource.getRepository(user_entity_1.User);
        const user = await userRepository.findOne({ where: { id: Number(authUser.id) } });
        if (!user)
            throw new common_1.NotFoundException('User tidak ditemukan');
        const field = String(dto?.field || '').trim();
        if (!['email_google', 'email_polri'].includes(field)) {
            throw new common_1.BadRequestException({
                errors: { field: ['Pilihan email tidak valid'] }
            });
        }
        const targetEmail = this.normalizeEmail(field === 'email_google' ? user.email_google : user.email_polri);
        const currentEmail = this.normalizeEmail(user.email);
        if (!targetEmail) {
            throw new common_1.BadRequestException({
                errors: { field: ['Email belum diisi'] }
            });
        }
        if (targetEmail === currentEmail) {
            return this.user({ id: user.id });
        }
        await this.validateSecurityOtp(user, 'set_primary_email', dto?.otp_id, dto?.otp_token);
        const conflicts = await this.dataSource.query(`
            select id
            from auth_users
            where id <> $1
              and (
                lower(email) = $2
                or lower(coalesce(email_google, '')) = $2
                or lower(coalesce(email_polri, '')) = $2
              )
            limit 1
            `, [Number(user.id), targetEmail]);
        if (conflicts.length) {
            throw new common_1.ConflictException({
                errors: { email: ['Email sudah digunakan akun lain'] }
            });
        }
        const updateData = { email: targetEmail };
        if (field === 'email_google')
            updateData.email_google = targetEmail;
        if (field === 'email_polri')
            updateData.email_polri = targetEmail;
        if (currentEmail.endsWith('@gmail.com') && field !== 'email_google' && !user.email_google) {
            updateData.email_google = currentEmail;
        }
        if (currentEmail.endsWith('@polri.go.id') && field !== 'email_polri' && !user.email_polri) {
            updateData.email_polri = currentEmail;
        }
        await userRepository.update(Number(user.id), updateData);
        await this.dataSource.query(`
            update trb_police
            set email = $2,
                updated_at = now()
            where lower(email) = $1
            `, [currentEmail, targetEmail]);
        return this.user({ id: user.id });
    }
    async requestProfileSecurityOtp(authUser, dto) {
        const action = String(dto?.action || '').trim();
        const allowedActions = ['set_primary_email', 'disable_totp', 'enable_totp', 'enable_pin', 'change_pin', 'disable_pin', 'enable_email_otp', 'disable_email_otp', 'self_deactivate'];
        if (!allowedActions.includes(action)) {
            throw new common_1.BadRequestException({
                errors: { action: ['Aksi keamanan tidak valid'] }
            });
        }
        const userRepository = this.dataSource.getRepository(user_entity_1.User);
        const user = await userRepository
            .createQueryBuilder('user')
            .addSelect('user.password')
            .where('user.id = :id', { id: Number(authUser.id) })
            .getOne();
        if (!user)
            throw new common_1.NotFoundException('User tidak ditemukan');
        if (dto?.password || ['enable_email_otp', 'enable_pin', 'change_pin'].includes(action)) {
            if (!dto?.password) {
                throw new common_1.BadRequestException({
                    errors: { password: ['Silakan masukkan password akun Anda terlebih dahulu'] }
                });
            }
            if (!user.password) {
                throw new common_1.BadRequestException({
                    errors: { password: ['Akun ini belum memiliki password lokal'] }
                });
            }
            const isMatch = await bcrypt.compare(String(dto.password), String(user.password));
            if (!isMatch) {
                throw new common_1.BadRequestException({
                    errors: { password: ['Password akun salah. Silakan periksa kembali password Anda.'] }
                });
            }
        }
        return this.createSecurityOtp(user, action, dto?.target_email);
    }
    async createProfileTotpSetup(authUser, dto) {
        const userRepository = this.dataSource.getRepository(user_entity_1.User);
        const user = await userRepository
            .createQueryBuilder('user')
            .addSelect('user.password')
            .where('user.id = :id', { id: Number(authUser.id) })
            .getOne();
        if (!user)
            throw new common_1.NotFoundException('User tidak ditemukan');
        if (!dto?.password) {
            throw new common_1.BadRequestException({
                errors: { password: ['Silakan masukkan password akun Anda untuk melanjutkan'] }
            });
        }
        if (!user.password) {
            throw new common_1.BadRequestException({
                errors: { password: ['Akun ini belum memiliki password lokal'] }
            });
        }
        const isMatch = await bcrypt.compare(String(dto.password), String(user.password));
        if (!isMatch) {
            throw new common_1.BadRequestException({
                errors: { password: ['Password akun salah. Silakan periksa kembali password Anda.'] }
            });
        }
        const mode = String(dto?.mode || '').trim().toLowerCase();
        const action = mode === 'reset' ? 'reset_totp' : 'enable_totp';
        const secret = otplib_1.authenticator.generateSecret();
        const service = process.env.APP_NAME || 'BIG DATA BINOPS';
        const email = this.normalizeEmail(user.email_polri || user.email);
        const otpAuthUrl = otplib_1.authenticator.keyuri(email, service, secret);
        const qrCodeImage = await QRCode.toDataURL(otpAuthUrl);
        const expiredAt = new Date(Date.now() + 15 * 60 * 1000);
        const setupId = this.encryptSecurityPayload({
            action,
            user_id: Number(user.id),
            email,
            secret,
            expired_at: expiredAt.toISOString()
        });
        return {
            setup_id: setupId,
            secret,
            totp_image: qrCodeImage,
            expired_at: expiredAt.toISOString()
        };
    }
    clearUserSecurityRateLimits(userId) {
        const id = Number(userId);
        const actions = ['set_primary_email', 'disable_totp', 'enable_totp', 'reset_totp', 'enable_pin', 'change_pin', 'disable_pin', 'enable_email_otp', 'disable_email_otp'];
        for (const act of actions) {
            this.clearOtpRateLimit(`sec_otp:${id}:${act}`);
        }
    }
    async updateProfileTotp(authUser, dto) {
        const userRepository = this.dataSource.getRepository(user_entity_1.User);
        const user = await userRepository
            .createQueryBuilder('user')
            .addSelect('user.password')
            .addSelect('user.totp_secret')
            .addSelect('user.security_pin_hash')
            .where('user.id = :id', { id: Number(authUser.id) })
            .getOne();
        if (!user)
            throw new common_1.NotFoundException('User tidak ditemukan');
        const enabled = Boolean(dto?.enabled);
        if (enabled) {
            const setupPayload = this.decryptSecurityPayload(dto?.setup_id);
            const action = setupPayload.action;
            if (!['enable_totp', 'reset_totp'].includes(action) || Number(setupPayload.user_id) !== Number(user.id)) {
                throw new common_1.BadRequestException({
                    errors: { totp_token: ['Setup authenticator tidak valid atau telah kedaluwarsa'] }
                });
            }
            if (!dto?.totp_token || !otplib_1.authenticator.check(String(dto.totp_token).trim(), setupPayload.secret)) {
                throw new common_1.BadRequestException({
                    errors: { totp_token: ['Kode authenticator (6 digit) tidak valid atau salah'] }
                });
            }
            await userRepository.update(Number(user.id), {
                totp_secret: setupPayload.secret,
                totp: true,
                two_factor_required: true
            });
            this.clearUserSecurityRateLimits(user.id);
            return this.user({ id: user.id });
        }
        let verified = false;
        if (dto?.totp_token && user.totp_secret && otplib_1.authenticator.check(String(dto.totp_token).trim(), user.totp_secret)) {
            verified = true;
        }
        else if (dto?.password && user.password && (await bcrypt.compare(String(dto.password), String(user.password)))) {
            verified = true;
        }
        else if (dto?.pin && user.security_pin_hash && (await bcrypt.compare(String(dto.pin), String(user.security_pin_hash)))) {
            verified = true;
        }
        else if (dto?.otp_id && dto?.otp_token) {
            await this.validateSecurityOtp(user, 'disable_totp', dto.otp_id, dto.otp_token);
            verified = true;
        }
        if (!verified) {
            throw new common_1.BadRequestException({
                errors: { totp_token: ['Verifikasi gagal: Masukkan kode Authenticator yang benar atau Password akun Anda'] }
            });
        }
        await userRepository.update(Number(user.id), {
            totp_secret: null,
            totp: false,
            two_factor_required: false
        });
        this.clearUserSecurityRateLimits(user.id);
        return this.user({ id: user.id });
    }
    async updateProfileEmailOtp(authUser, dto) {
        const userRepository = this.dataSource.getRepository(user_entity_1.User);
        const user = await userRepository
            .createQueryBuilder('user')
            .addSelect('user.password')
            .addSelect('user.totp_secret')
            .addSelect('user.security_pin_hash')
            .where('user.id = :id', { id: Number(authUser.id) })
            .getOne();
        if (!user)
            throw new common_1.NotFoundException('User tidak ditemukan');
        const enabled = Boolean(dto?.enabled);
        const action = enabled ? 'enable_email_otp' : 'disable_email_otp';
        if (enabled) {
            await this.validateSecurityOtp(user, action, dto?.otp_id, dto?.otp_token);
        }
        else {
            let verified = false;
            if (dto?.password && user.password && (await bcrypt.compare(String(dto.password), String(user.password)))) {
                verified = true;
            }
            else if (dto?.totp_token && user.totp_secret && otplib_1.authenticator.check(String(dto.totp_token).trim(), user.totp_secret)) {
                verified = true;
            }
            else if (dto?.pin && user.security_pin_hash && (await bcrypt.compare(String(dto.pin), String(user.security_pin_hash)))) {
                verified = true;
            }
            else if (dto?.otp_id && dto?.otp_token) {
                await this.validateSecurityOtp(user, action, dto.otp_id, dto.otp_token);
                verified = true;
            }
            if (!verified) {
                throw new common_1.BadRequestException({
                    errors: { password: ['Verifikasi keamanan diperlukan untuk menonaktifkan fitur ini'] }
                });
            }
        }
        await userRepository.update(Number(user.id), {
            email_otp_required: enabled
        });
        if (['superadmin', 'admin_binops'].includes(String(user.role_bdb).toLowerCase()) && dto?.apply_global) {
            await this.systemSetting.setLoginOtpSetting(authUser, enabled);
        }
        this.clearUserSecurityRateLimits(user.id);
        return this.user({ id: user.id });
    }
    async updateProfilePin(authUser, dto) {
        const userRepository = this.dataSource.getRepository(user_entity_1.User);
        const user = await userRepository
            .createQueryBuilder('user')
            .addSelect('user.password')
            .addSelect('user.totp_secret')
            .addSelect('user.security_pin_hash')
            .where('user.id = :id', { id: Number(authUser.id) })
            .getOne();
        if (!user)
            throw new common_1.NotFoundException('User tidak ditemukan');
        const enabled = Boolean(dto?.enabled);
        const action = String(dto?.action || (enabled ? (user.pin_required ? 'change_pin' : 'enable_pin') : 'disable_pin'));
        if (enabled) {
            const pin = this.validatePinFormat(dto?.pin);
            const pinConfirmation = this.validatePinFormat(dto?.pin_confirmation || dto?.pin, 'pin_confirmation');
            if (pin !== pinConfirmation) {
                throw new common_1.BadRequestException({
                    errors: { pin_confirmation: ['Konfirmasi PIN belum sama'] }
                });
            }
            await this.validateSecurityOtp(user, action, dto?.otp_id, dto?.otp_token);
            await userRepository.update(Number(user.id), {
                pin_required: true,
                security_pin_hash: await bcrypt.hash(pin, 10)
            });
            this.clearUserSecurityRateLimits(user.id);
            return this.user({ id: user.id });
        }
        else {
            let verified = false;
            if (dto?.password && user.password && (await bcrypt.compare(String(dto.password), String(user.password)))) {
                verified = true;
            }
            else if (dto?.pin && user.security_pin_hash && (await bcrypt.compare(String(dto.pin), String(user.security_pin_hash)))) {
                verified = true;
            }
            else if (dto?.totp_token && user.totp_secret && otplib_1.authenticator.check(String(dto.totp_token).trim(), user.totp_secret)) {
                verified = true;
            }
            else if (dto?.otp_id && dto?.otp_token) {
                await this.validateSecurityOtp(user, action, dto.otp_id, dto.otp_token);
                verified = true;
            }
            if (!verified) {
                throw new common_1.BadRequestException({
                    errors: { password: ['Verifikasi gagal: Masukkan password akun atau PIN lama Anda'] }
                });
            }
            await userRepository.update(Number(user.id), {
                pin_required: false,
                security_pin_hash: null
            });
            this.clearUserSecurityRateLimits(user.id);
            return this.user({ id: user.id });
        }
    }
    async forgotPasswordRequest(dto) {
        if (!(await this.validateCaptcha(dto.captcha_id, dto.captcha))) {
            throw new common_1.BadRequestException({
                errors: { captcha: ['invalid captcha'] }
            });
        }
        const email = this.normalizeEmail(dto.email);
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new common_1.BadRequestException({
                errors: { email: ['email tidak ditemukan'] }
            });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtp = await bcrypt.hash(otp, 10);
        const expiredAt = new Date(Date.now() + 5 * 60 * 1000);
        const payload = {
            action: 'forgot_password',
            email,
            otp: hashedOtp,
            expired_at: expiredAt.toISOString()
        };
        const secret = process.env.CAPTCHA_SECRET || 'default_secret_key';
        const keyBuffer = crypto.createHash('sha256').update(secret).digest();
        const key = new Uint8Array(keyBuffer);
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        let encrypted = cipher.update(JSON.stringify(payload), 'utf8', 'base64');
        encrypted += cipher.final('base64');
        const otp_id = iv.toString('base64') + ':' + encrypted;
        const htmlContent = this.mailService.createOtpEmail(otp);
        await this.mailService.sendEmail(email, 'BIG DATA BINOPS Reset Password OTP', 'reset password otp', htmlContent);
        return {
            otp_id,
            requires_otp: true,
            message: 'OTP reset password berhasil dikirim'
        };
    }
    async forgotPasswordConfirm(dto) {
        const email = this.normalizeEmail(dto.email);
        if (dto.password !== dto.password_confirmation) {
            throw new common_1.BadRequestException({
                message: 'Bad Request',
                errors: { password_confirmation: ['Konfirmasi password tidak sama'] }
            });
        }
        const payload = await this.falidationOtp(dto.otp_id, dto.otp_token);
        if (payload.action !== 'forgot_password' || this.normalizeEmail(payload.email) !== email) {
            throw new common_1.BadRequestException({
                errors: { otp_token: ['OTP tidak sesuai untuk reset password akun ini'] }
            });
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const user = await queryRunner.manager
                .getRepository(user_entity_1.User)
                .createQueryBuilder('user')
                .addSelect('user.password')
                .where('lower(user.email) = :email', { email })
                .orWhere('lower(user.email_google) = :email', { email })
                .orWhere('lower(user.email_polri) = :email', { email })
                .orWhere('lower(user.email_polri) = :email', { email })
                .getOne();
            if (!user) {
                throw new common_1.BadRequestException({
                    errors: { email: ['email tidak ditemukan'] }
                });
            }
            const hashedPassword = await bcrypt.hash(dto.password, 10);
            const loginMethod = user.login_method && user.login_method !== 'LOCAL' ? 'HYBRID' : user.login_method || 'HYBRID';
            await queryRunner.manager.update(user_entity_1.User, user.id, {
                password: hashedPassword,
                local_password_enabled: true,
                login_method: loginMethod
            });
            await queryRunner.commitTransaction();
            return { message: 'Password berhasil direset' };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async falidationOtp(otp_id, otp_token) {
        if (!otp_id || !otp_token) {
            return new Error('otp tidak terisi / belum mengirimkan kode otp');
        }
        const secret = process.env.CAPTCHA_SECRET || 'default_secret_key';
        const keyBuffer = crypto.createHash('sha256').update(secret).digest();
        const key = new Uint8Array(keyBuffer);
        const [ivBase64, encryptedBase64] = otp_id.split(':');
        if (!ivBase64 || !encryptedBase64) {
            throw new common_1.BadRequestException({
                errors: { otp_token: ['Invalid format'] }
            });
        }
        const iv = Buffer.from(ivBase64, 'base64');
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        let decrypted = decipher.update(encryptedBase64, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        const payload = JSON.parse(decrypted);
        if (new Date(payload.expired_at) < new Date()) {
            throw new common_1.BadRequestException({
                errors: { otp_token: ['expired token'] }
            });
        }
        const otpUser = payload.user_id ? await this.usersService.findOne(String(payload.user_id)) : null;
        if (otpUser) {
            const lockedMinutes = this.usersService.lockRemainingMinutes(otpUser);
            if (lockedMinutes > 0) {
                throw new common_1.BadRequestException({
                    errors: { otp_token: [`Akun terkunci karena terlalu banyak percobaan gagal. Coba lagi dalam ${lockedMinutes} menit.`] }
                });
            }
        }
        const isMatch = await bcrypt.compare(otp_token, payload.otp);
        if (!isMatch) {
            if (otpUser) {
                const r = await this.usersService.registerFailedLogin(otpUser);
                throw new common_1.BadRequestException({
                    errors: {
                        otp_token: [r.locked ? `Kode OTP salah. Akun dikunci ${r.minutes} menit karena terlalu banyak percobaan gagal.` : `Kode OTP salah. Sisa percobaan: ${r.remaining}.`]
                    }
                });
            }
            throw new common_1.BadRequestException({
                errors: { otp_token: ['Invalid OTP token'] }
            });
        }
        return payload;
    }
    async resetPassword(dto, authUser, req) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const user = await queryRunner.manager
                .getRepository(user_entity_1.User)
                .createQueryBuilder('user')
                .addSelect('user.password')
                .setLock('pessimistic_write')
                .where('user.id = :id', { id: authUser.id })
                .getOne();
            if (!user) {
                throw new common_1.NotFoundException('Pengguna tidak ditemukan');
            }
            const isMatch = await bcrypt.compare(dto.oldPassword, user.password);
            if (!isMatch) {
                throw new common_1.BadRequestException('Password lama salah');
            }
            const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
            await queryRunner.manager.update(user_entity_1.User, authUser.id, { password: hashedPassword });
            await queryRunner.commitTransaction();
        }
        catch (error) {
            if (queryRunner.isTransactionActive) {
                await queryRunner.rollbackTransaction();
            }
            throw error;
        }
        finally {
            await queryRunner.release();
        }
        let sessionRevoked = true;
        try {
            await this.signOut(req);
        }
        catch {
            sessionRevoked = false;
        }
        await this.usersService.logOwnPasswordChange(authUser, sessionRevoked);
        return { message: 'Password berhasil diubah' };
    }

    getRPInfo() {
        return {
            rpName: 'CAS Bareskrim Polri',
            rpID: 'cas.bareskrim.polri.go.id',
            expectedOrigin: 'https://cas.bareskrim.polri.go.id'
        };
    }

    inferPasskeyExpectedOs(pk) {
        if (pk?.os_name) return String(pk.os_name).trim();
        const dn = String(pk?.device_name || '').toLowerCase();
        if (dn.includes('windows')) return 'Windows';
        if (dn.includes('mac')) return 'Mac OS';
        if (dn.includes('iphone') || dn.includes('ipad') || dn.includes('ios')) return 'iOS';
        if (dn.includes('android')) return 'Android';
        return '';
    }

    async passkeyRegisterOptions(user) {
        const { generateRegistrationOptions } = require('@simplewebauthn/server');
        const { rpName, rpID } = this.getRPInfo();

        const uid = Number(user.id);
        const existingKeys = await this.dataSource.query(
            'SELECT credential_id, transports FROM auth_passkeys WHERE user_id = $1',
            [uid]
        );

        const options = await generateRegistrationOptions({
            rpName,
            rpID,
            userID: new Uint8Array(Buffer.from(String(uid))),
            userName: user.username || user.email || ('user_' + uid),
            userDisplayName: user.name || user.username || 'Personil CAS',
            attestationType: 'none',
            excludeCredentials: existingKeys.map((k) => ({
                id: k.credential_id,
                transports: ['internal']
            })),
            authenticatorSelection: {
                authenticatorAttachment: 'platform',
                residentKey: 'required',
                requireResidentKey: true,
                userVerification: 'required'
            }
        });

        await this.dataSource.query(
            `INSERT INTO auth_passkey_challenges (id, user_id, challenge, type, expires_at)
             VALUES ($1, $2, $3, 'registration', NOW() + INTERVAL '5 minutes')
             ON CONFLICT (id) DO UPDATE SET challenge = $3, expires_at = NOW() + INTERVAL '5 minutes'`,
            ['reg_' + uid, uid, options.challenge]
        );

        return options;
    }

    async passkeyRegisterVerify(user, dto, userAgentResult) {
        const { verifyRegistrationResponse } = require('@simplewebauthn/server');
        const { rpID, expectedOrigin } = this.getRPInfo();
        const uid = Number(user.id);

        const challengeRows = await this.dataSource.query(
            `SELECT challenge FROM auth_passkey_challenges 
             WHERE id = $1 AND type = 'registration' AND expires_at > NOW()`,
            ['reg_' + uid]
        );

        if (!challengeRows.length) {
            throw new common_1.BadRequestException('Sesi pendaftaran biometrik telah kedaluwarsa. Silakan ulangi.');
        }

        const expectedChallenge = challengeRows[0].challenge;
        const regResponse = dto.registrationResponse || dto;

        if (regResponse.authenticatorAttachment && regResponse.authenticatorAttachment !== 'platform') {
            throw new common_1.BadRequestException(
                'Pendaftaran ditolak: Hanya autentikator biometrik bawaan perangkat fisik (Platform Authenticator / Windows Hello / Touch ID) yang diizinkan.'
            );
        }

        let verification;
        try {
            verification = await verifyRegistrationResponse({
                response: regResponse,
                expectedChallenge,
                expectedOrigin,
                expectedRPID: rpID,
                requireUserVerification: true
            });
        } catch (err) {
            throw new common_1.BadRequestException('Gagal memverifikasi pendaftaran biometrik (pastikan biometrik/PIN perangkat diverifikasi): ' + (err?.message || 'Data tidak valid'));
        }

        if (!verification.verified || !verification.registrationInfo) {
            throw new common_1.BadRequestException('Verifikasi pendaftaran biometrik gagal.');
        }

        const info = verification.registrationInfo;
        const credentialID = info.credentialID || info.credential?.id || regResponse.id;
        const pubKey = info.credentialPublicKey || info.credential?.publicKey;
        const publicKeyB64 = pubKey ? Buffer.from(pubKey).toString('base64') : '';
        const counter = Number(info.counter || 0);
        const aaguid = String(info.aaguid || '').toLowerCase() || null;
        const credentialDeviceType = info.credentialDeviceType || 'singleDevice';
        const credentialBackedUp = Boolean(info.credentialBackedUp);

        const os = userAgentResult?.os?.name || '';
        const vendor = userAgentResult?.device?.vendor || '';
        const model = userAgentResult?.device?.model || '';
        const browser = userAgentResult?.browser?.name || '';

        // Allow platform & browser-managed passkeys (Windows Hello TPM & Chrome Passkey Enclave) — device/OS binding is enforced via os_name & browser_name

        const transports = ['internal'];

        let devName = String(dto.deviceName || '').trim();
        if (!devName) {
            if (vendor || model) {
                devName = (vendor + ' ' + model).trim();
            } else if (os) {
                devName = (os + ' (' + (browser || 'Browser') + ')').trim();
            } else {
                devName = 'Gawai Terpercaya (FIDO2)';
            }
        }

        await this.dataSource.query(
            `INSERT INTO auth_passkeys (
                user_id, credential_id, public_key, counter, device_name, transports,
                aaguid, credential_device_type, credential_backed_up, os_name, browser_name,
                created_at, last_used_at
             )
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
             ON CONFLICT (credential_id) DO UPDATE SET
                public_key = $3, counter = $4, device_name = $5, transports = $6,
                aaguid = $7, credential_device_type = $8, credential_backed_up = $9,
                os_name = $10, browser_name = $11, last_used_at = NOW()`,
            [uid, credentialID, publicKeyB64, counter, devName, transports, aaguid, credentialDeviceType, credentialBackedUp, os || null, browser || null]
        );

        await this.dataSource.query('DELETE FROM auth_passkey_challenges WHERE id = $1', ['reg_' + uid]);

        void this.audit.log({
            userId: uid,
            userName: user.username,
            action: 'PASSKEY_REGISTER',
            entity: 'auth_passkeys',
            meta: {
                device_name: devName,
                os_name: os || null,
                browser_name: browser || null,
                credential_device_type: credentialDeviceType,
                credential_backed_up: credentialBackedUp,
                aaguid
            }
        });

        return { verified: true, device_name: devName };
    }

    async passkeyGetDevices(user) {
        const uid = Number(user.id);
        const rows = await this.dataSource.query(
            `SELECT id, device_name, device_type, transports, os_name, browser_name, credential_device_type, credential_backed_up, created_at, last_used_at
             FROM auth_passkeys
             WHERE user_id = $1
             ORDER BY last_used_at DESC NULLS LAST, created_at DESC`,
            [uid]
        );
        return rows.map((r) => ({
            id: Number(r.id),
            device_name: r.device_name || 'Gawai Terpercaya',
            os_name: r.os_name || null,
            browser_name: r.browser_name || null,
            credential_device_type: r.credential_device_type || 'singleDevice',
            credential_backed_up: Boolean(r.credential_backed_up),
            transports: r.transports || [],
            created_at: r.created_at,
            last_used_at: r.last_used_at
        }));
    }

    async passkeyDeleteDevice(user, deviceId, dto) {
        const uid = Number(user.id);
        const inputCode = String(dto?.password || dto?.code || dto?.pin || dto?.totp_token || dto?.verification || '').trim();

        if (!inputCode) {
            throw new common_1.BadRequestException('Masukkan password akun atau kode keamanan (PIN / 2FA) untuk konfirmasi pencabutan gawai.');
        }

        const uRows = await this.dataSource.query('SELECT id, password, security_pin_hash, totp_secret FROM auth_users WHERE id = $1 LIMIT 1', [uid]); const userEntity = uRows[0];
        if (!userEntity) {
            throw new common_1.NotFoundException('Data personil tidak ditemukan.');
        }

        const bcrypt = require('bcrypt');
        let verified = false;

        if (userEntity.password && (await bcrypt.compare(inputCode, userEntity.password))) {
            verified = true;
        }
        else if (userEntity.security_pin_hash && (await bcrypt.compare(inputCode, userEntity.security_pin_hash))) {
            verified = true;
        }
        else if (userEntity.totp_secret) {
            try {
                const otplib = require('otplib');
                if (otplib.authenticator.check(inputCode, userEntity.totp_secret)) {
                    verified = true;
                }
            } catch(_e) {}
        }

        if (!verified) {
            throw new common_1.BadRequestException('Password atau kode verifikasi keamanan salah. Otorisasi pencabutan akses ditolak.');
        }

        const res = await this.dataSource.query(
            'DELETE FROM auth_passkeys WHERE id = $1 AND user_id = $2 RETURNING device_name',
            [deviceId, uid]
        );
        if (!res.length) {
            throw new common_1.NotFoundException('Perangkat tidak ditemukan atau sudah dihapus.');
        }

        void this.audit.log({
            userId: uid,
            userName: user.username,
            action: 'PASSKEY_REVOKE',
            entity: 'auth_passkeys',
            meta: { device_id: deviceId, device_name: res[0].device_name }
        });

        return { success: true, message: 'Akses gawai berhasil dicabut.' };
    }

    async passkeyLoginOptions(username) {
        const { generateAuthenticationOptions } = require('@simplewebauthn/server');
        const { rpID } = this.getRPInfo();

        let allowCredentials = [];
        let targetUid = null;

        if (username) {
            const cleanUser = String(username).trim().toLowerCase();
            const uRows = await this.dataSource.query(
                'SELECT id FROM auth_users WHERE LOWER(username) = $1 OR LOWER(email) = $1 OR LOWER(callsign) = $1',
                [cleanUser]
            );
            if (uRows.length) {
                targetUid = Number(uRows[0].id);
                const pkRows = await this.dataSource.query(
                    'SELECT credential_id, transports FROM auth_passkeys WHERE user_id = $1',
                    [targetUid]
                );
                allowCredentials = pkRows.map((pk) => ({
                    id: pk.credential_id,
                    transports: ['internal']
                }));
            }
        }

        const options = await generateAuthenticationOptions({
            rpID,
            userVerification: 'required',
            allowCredentials: allowCredentials.length > 0 ? allowCredentials : undefined
        });

        await this.dataSource.query(
            `INSERT INTO auth_passkey_challenges (id, user_id, challenge, type, expires_at)
             VALUES ($1, $2, $3, 'authentication', NOW() + INTERVAL '5 minutes')`,
            [options.challenge, targetUid, options.challenge]
        );

        return options;
    }

    async passkeyLoginVerify(dto, userAgentResult) {
        const { verifyAuthenticationResponse } = require('@simplewebauthn/server');
        const { rpID, expectedOrigin } = this.getRPInfo();

        const authResponse = dto.authResponse || dto;
        const credId = authResponse?.id;
        if (!credId) {
            throw new common_1.BadRequestException('ID kredensial biometrik tidak ditemukan.');
        }

        const pkRows = await this.dataSource.query(
            `SELECT p.id, p.user_id, p.credential_id, p.public_key, p.counter, p.transports, p.device_name,
                    p.aaguid, p.credential_device_type, p.credential_backed_up, p.os_name, p.browser_name,
                    u.id as user_db_id, u.username, u.name, u.email, u.role_bdb, u.role_name, u.scope_satker_id, u.status
             FROM auth_passkeys p
             JOIN auth_users u ON u.id = p.user_id
             WHERE p.credential_id = $1`,
            [credId]
        );

        if (!pkRows.length) {
            throw new common_1.UnauthorizedException('Kredensial biometrik tidak terdaftar pada sistem CAS.');
        }

        const pk = pkRows[0];
        if (String(pk.status).toUpperCase() === 'NONAKTIF' || String(pk.status).toLowerCase() === 'inactive') {
            throw new common_1.UnauthorizedException('Akun personil sedang dinonaktifkan.');
        }

        let clientChallenge = null;
        try {
            const rawClientData = authResponse?.response?.clientDataJSON;
            if (typeof rawClientData === 'string' && rawClientData.length > 0) {
                const decoded = JSON.parse(Buffer.from(rawClientData, 'base64url').toString('utf8'));
                if (decoded && typeof decoded.challenge === 'string') {
                    clientChallenge = decoded.challenge;
                }
            }
        } catch (_e) {}

        if (dto.challenge && clientChallenge && dto.challenge !== clientChallenge) {
            throw new common_1.UnauthorizedException('Challenge otentikasi biometrik tidak cocok (mismatch).');
        }

        const challengeToFind = clientChallenge || dto.challenge;
        if (!challengeToFind) {
            throw new common_1.BadRequestException('Challenge verifikasi biometrik tidak ditemukan.');
        }

        const chRows = await this.dataSource.query(
            `SELECT challenge, user_id FROM auth_passkey_challenges 
             WHERE challenge = $1 AND type = 'authentication' AND expires_at > NOW()
               AND (user_id IS NULL OR user_id = $2)`,
            [challengeToFind, pk.user_id]
        );

        if (!chRows.length) {
            throw new common_1.BadRequestException('Sesi verifikasi biometrik kedaluwarsa atau tidak valid. Silakan coba lagi.');
        }

        const challengeRow = chRows[0];

        await this.dataSource.query(
            'DELETE FROM auth_passkey_challenges WHERE challenge = $1',
            [challengeRow.challenge]
        );

        const storedCounter = Number(pk.counter || 0);
        let verification;
        try {
            verification = await verifyAuthenticationResponse({
                response: authResponse,
                expectedChallenge: challengeRow.challenge,
                expectedOrigin,
                expectedRPID: rpID,
                authenticator: {
                    credentialID: pk.credential_id,
                    credentialPublicKey: new Uint8Array(Buffer.from(pk.public_key, 'base64')),
                    counter: storedCounter,
                    transports: ['internal']
                },
                credential: {
                    id: pk.credential_id,
                    publicKey: Buffer.from(pk.public_key, 'base64'),
                    counter: storedCounter,
                    transports: ['internal']
                },
                requireUserVerification: true
            });
        } catch (err) {
            throw new common_1.UnauthorizedException('Verifikasi biometrik gagal: ' + (err?.message || 'Tanda tangan tidak valid'));
        }

        if (!verification.verified) {
            throw new common_1.UnauthorizedException('Verifikasi biometrik ditolak.');
        }

        const authInfo = verification.authenticationInfo || {};
        const currentOs = String(userAgentResult?.os?.name || '').trim();
        const currentBrowser = String(userAgentResult?.browser?.name || '').trim();
        const expectedOs = this.inferPasskeyExpectedOs(pk);

        if (expectedOs && currentOs && expectedOs.toLowerCase() !== currentOs.toLowerCase()) {
            void this.audit.log({
                userId: Number(pk.user_db_id),
                userName: pk.username,
                action: 'LOGIN_PASSKEY_BLOCKED',
                entity: 'auth',
                meta: {
                    reason: 'OS_MISMATCH',
                    registered_device: pk.device_name,
                    expected_os: expectedOs,
                    actual_os: currentOs
                }
            });
            throw new common_1.UnauthorizedException(
                `Login biometrik ditolak: Kredensial "${pk.device_name}" terdaftar untuk sistem operasi ${expectedOs}, tidak dapat digunakan pada perangkat ${currentOs} yang belum didaftarkan.`
            );
        }

        if (pk.browser_name && currentBrowser && String(pk.browser_name).toLowerCase() !== currentBrowser.toLowerCase()) {
            throw new common_1.UnauthorizedException(
                `Login biometrik ditolak: Peramban (${currentBrowser}) tidak sesuai dengan peramban yang didaftarkan (${pk.browser_name}).`
            );
        }

        // OS & Browser binding already enforced above via expectedOs and pk.browser_name

        const newCounter = Number(authInfo.newCounter ?? storedCounter);
        await this.dataSource.query(
            `UPDATE auth_passkeys
             SET counter = $1,
                 credential_device_type = COALESCE(credential_device_type, $2),
                 credential_backed_up = COALESCE($3, credential_backed_up),
                 os_name = COALESCE(os_name, $4),
                 browser_name = COALESCE(browser_name, $5),
                 last_used_at = NOW()
             WHERE id = $6`,
            [
                newCounter,
                authInfo.credentialDeviceType || null,
                typeof authInfo.credentialBackedUp === 'boolean' ? authInfo.credentialBackedUp : false,
                currentOs || null,
                currentBrowser || null,
                pk.id
            ]
        );

        const userEntity = await this.usersService.findOne(pk.user_db_id);
        if (!userEntity) {
            throw new common_1.NotFoundException('Data personil tidak ditemukan.');
        }

        const lockedMinutes = this.usersService.lockRemainingMinutes(userEntity);
        if (lockedMinutes > 0) {
            throw new common_1.UnauthorizedException(`Akun terkunci karena 3x gagal login. Coba lagi dalam ${lockedMinutes} menit.`);
        }

        void this.audit.log({
            userId: Number(pk.user_db_id),
            userName: pk.username,
            action: 'LOGIN_PASSKEY',
            entity: 'auth',
            meta: {
                device_name: pk.device_name,
                os_name: currentOs || null,
                browser_name: currentBrowser || null,
                credential_device_type: authInfo.credentialDeviceType || null,
                credential_backed_up: Boolean(authInfo.credentialBackedUp),
                outcome: 'SUCCESS'
            }
        });

        return this.createLoginSession(userEntity, userAgentResult, 'PASSKEY_BIOMETRIC');
    }
};
exports.AuthService = AuthService;
__decorate([
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "user", null);
__decorate([
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [updateUser_dto_1.ResetPasswordDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "resetPassword", null);
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(9, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService,
        device_service_1.DeviceService,
        auth_helper_service_1.Auth,
        mail_service_1.MailService,
        typeorm_1.DataSource,
        table_helper_service_1.TableHelperService,
        audit_service_1.AuditService,
        system_setting_service_1.SystemSettingService, Object])
], AuthService);
//# sourceMappingURL=auth.service.js.map