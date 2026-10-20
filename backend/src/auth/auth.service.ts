import { Injectable, UnauthorizedException, ConflictException, BadRequestException, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user/user.service';
import { DeviceService } from './device/device.service'; // Pastikan path sesuai
import { receivedInvitation, RefreshTokenDto, Register, RegisterTOTP, UserDto, verifyTOTP } from './user/dto/user.dto';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from './constants';
import * as crypto from 'crypto';
import { generatePowCaptcha, verifyPowCaptcha } from './pow-captcha.util';
import { authenticator } from 'otplib';
import * as QRCode from 'qrcode';
import { Auth } from '@app_core/helper/service/auth.helper.service';
import { MailService } from '@app_core/helper/service/mail.service';
import { DataSource, In } from 'typeorm';
import { TableHelperService } from '@app_core/helper/service/table.helper.service';
import { User } from './user/entities/user.entity';
import { CurrentUser } from '@app_core/helper/decoration/current-user.decorator';
import { permission } from 'process';
import { Permission } from './permission/entities/permission.entity';
import { OrganisasiRole } from 'src/orgaisasi/entity/role.entity';
import { Organisasi } from 'src/orgaisasi/entity/organisasi.entity';
import { resolveOrganisasiRoleId } from './organisasi-role.util';
import { ForgotPasswordConfirmDto, ForgotPasswordRequestDto, ResetPasswordDto, sendOtpEmailDto } from './user/dto/updateUser.dto';
import { OrganisasiLevel } from 'src/orgaisasi/entity/level.entity';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { AuditService } from 'src/bdb/audit/audit.service';
import { SystemSettingService } from 'src/bdb/system-setting/system-setting.service';
@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService,
        private deviceService: DeviceService,
        private readonly auth: Auth,
        private mailService: MailService,
        private readonly dataSource: DataSource,
        private readonly tableHelper: TableHelperService,
        private readonly audit: AuditService,
        private readonly systemSetting: SystemSettingService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}

    private normalizeEmail(email?: string): string {
        return String(email || '').trim().toLowerCase();
    }

    private normalizeRequestedRole(role?: string): string {
        const value = String(role || '').trim().toLowerCase();
        return ['admin_binops', 'operator', 'viewer', 'sharese'].includes(value) ? value : 'viewer';
    }

    private normalizeBdbRole(role?: string): string {
        const value = String(role || '').trim().toLowerCase();
        return ['superadmin', 'admin_binops', 'operator', 'viewer', 'sharese'].includes(value) ? value : 'viewer';
    }

    private cleanOptionalText(value: any): string | null {
        if (value === undefined || value === null) return null;
        const text = String(value).trim();
        return text === '' ? null : text;
    }

    private securityKey(): Uint8Array {
        const secret = process.env.CAPTCHA_SECRET || 'default_secret_key';
        const keyBuffer = crypto.createHash('sha256').update(secret).digest();
        return new Uint8Array(keyBuffer);
    }

    private encryptSecurityPayload(payload: Record<string, any>): string {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-cbc', this.securityKey(), iv);
        let encrypted = cipher.update(JSON.stringify(payload), 'utf8', 'base64');
        encrypted += cipher.final('base64');
        return iv.toString('base64') + ':' + encrypted;
    }

    /** Dekripsi payload TANPA cek kedaluwarsa -- dipakai utk resend (payload lama boleh sudah expired). */
    private decryptSecurityPayloadRaw(payloadId: string): any {
        const [ivBase64, encryptedBase64] = String(payloadId || '').split(':');
        if (!ivBase64 || !encryptedBase64) {
            throw new BadRequestException({
                errors: { otp_token: ['Format token tidak valid'] }
            });
        }

        const iv = Buffer.from(ivBase64, 'base64');
        const decipher = crypto.createDecipheriv('aes-256-cbc', this.securityKey(), iv);
        let decrypted = decipher.update(encryptedBase64, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        return JSON.parse(decrypted);
    }

    private decryptSecurityPayload(payloadId: string): any {
        const payload = this.decryptSecurityPayloadRaw(payloadId);
        if (payload.expired_at && new Date(payload.expired_at) < new Date()) {
            throw new BadRequestException({
                errors: { otp_token: ['Kode sudah kedaluwarsa'] }
            });
        }

        return payload;
    }

    /** OTP login SELALU dikirim ke email dinas Polri (bukan gmail/alias lain) -- konsisten dgn identitas resmi akun. */
    private async sendLoginOtp(user: User) {
        const emailPolri = this.normalizeEmail(user.email_polri);
        if (!emailPolri) {
            throw new BadRequestException({
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

    /** Kirim ulang OTP login -- dipakai kalau kode lama sudah kedaluwarsa/hilang. Tidak perlu password lagi. */
    async resendLoginOtp(otpId: string) {
        const payload = this.decryptSecurityPayloadRaw(otpId);
        if (payload.action !== 'login') {
            throw new BadRequestException({
                errors: { otp_token: ['Sesi OTP tidak valid'] }
            });
        }
        const user = await this.dataSource.getRepository(User).findOne({ where: { id: Number(payload.user_id) } });
        if (!user || this.normalizeEmail(user.email_polri) !== this.normalizeEmail(payload.email)) {
            throw new BadRequestException({
                errors: { otp_token: ['Sesi OTP tidak valid'] }
            });
        }
        return this.sendLoginOtp(user);
    }

    private otpRateLimits = new Map<string, { lastSentAt: number; attempts: number; windowStart: number }>();

    private checkOtpRateLimit(key: string) {
        const now = Date.now();
        const existing = this.otpRateLimits.get(key);
        if (!existing) {
            this.otpRateLimits.set(key, { lastSentAt: now, attempts: 1, windowStart: now });
            return;
        }

        // Window 15 menit
        if (now - existing.windowStart > 15 * 60 * 1000) {
            existing.windowStart = now;
            existing.attempts = 1;
            existing.lastSentAt = now;
            return;
        }

        // Cek jeda / cooldown 60 detik (1 menit) sebelum boleh kirim ulang
        const elapsed = now - existing.lastSentAt;
        if (elapsed < 60 * 1000) {
            const waitSeconds = Math.ceil((60 * 1000 - elapsed) / 1000);
            throw new BadRequestException({
                message: `Tunggu ${waitSeconds} detik sebelum meminta kode OTP kembali.`,
                errors: { otp: [`Tunggu ${waitSeconds} detik sebelum meminta kode OTP kembali.`] }
            });
        }

        // Cek batas maksimal 3 kali percobaan pengiriman
        if (existing.attempts >= 3) {
            throw new BadRequestException({
                message: 'Batas pengiriman OTP tercapai (maksimal 3 kali). Silakan coba lagi nanti.',
                errors: { otp: ['Batas pengiriman OTP tercapai (maksimal 3 kali). Silakan coba lagi dalam 15 menit.'] }
            });
        }

        existing.attempts += 1;
        existing.lastSentAt = now;
    }

    private clearOtpRateLimit(key: string) {
        this.otpRateLimits.delete(key);
    }

    private async createSecurityOtp(user: User, action: string, targetChoice?: string) {
        const rateLimitKey = `sec_otp:${user.id}:${action}`;
        this.checkOtpRateLimit(rateLimitKey);
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
    }

    private async validateSecurityOtp(user: User, action: string, otpId: string, otpToken: string) {
        const payload = await this.falidationOtp(otpId, otpToken);
        if (payload instanceof Error) {
            throw new BadRequestException({
                errors: { otp_token: ['OTP belum diisi'] }
            });
        }

        const pEmail = this.normalizeEmail(payload.email);
        const uEmail = this.normalizeEmail(user.email);
        const uEmailPolri = this.normalizeEmail(user.email_polri);
        if (payload.action !== action || Number(payload.user_id) !== Number(user.id) || (pEmail !== uEmail && pEmail !== uEmailPolri)) {
            throw new BadRequestException({
                errors: { otp_token: ['OTP tidak sesuai untuk tindakan ini'] }
            });
        }

        this.clearOtpRateLimit(`sec_otp:${user.id}:${action}`);
        return payload;
    }

    private validatePinFormat(pin: any, field = 'pin'): string {
        const value = String(pin || '').trim();
        if (!/^\d{6,8}$/.test(value)) {
            throw new BadRequestException({
                errors: { [field]: ['PIN wajib 6-8 digit angka'] }
            });
        }
        return value;
    }

    /**
     * Gerbang TERAKHIR sebelum sesi dibuat -- dipanggil setelah PIN/TOTP (kalau ada) lolos.
     * OTP email global selalu dicek di sini juga, supaya PIN/TOTP tidak jadi jalan pintas
     * yang melewati OTP wajib (mis. akun dgn TOTP aktif tetap harus OTP kalau global-nya nyala).
     */
    private async finishLoginAfterFactors(user: User, result: any, method: string): Promise<any> {
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

    private async createLoginSession(user: User, result: any, method: string, impersonatedBy?: { id: number; name: string }) {
        const compactUser: any = { id: user.id, name: user.name, username: user.username, email: user.email, role_bdb: user.role_bdb, role_name: user.role_name, organisasi_id: (user as any).organisasi_id || (user as any).organisasiId || (user as any).Organisasi?.id || 1, scope_satker_id: (user as any).scope_satker_id, scope_satker_key: (user as any).scope_satker_key };
        const device = await this.deviceService.create(user.id, result.device.model || 'Unknown Device', result.device.vendor || 'Unknown Token', result.os.name || 'Unknown OS', result.browser.name + result.browser.version || 'unknown browser');
        const payload: any = {
            id: user.id,
            username: user.name,
            device_id: device.id,
            device_token: device.device_token,
            user: compactUser
        };
        if (impersonatedBy) payload.impersonated_by = impersonatedBy;
        const accessToken = await this.jwtService.signAsync(payload, {
            // Sesi impersonate sengaja lebih pendek (30 menit) daripada login normal (240 menit).
            expiresIn: impersonatedBy ? '30m' : '240m'
        });
        const expiresAt = new Date(Date.now() + (impersonatedBy ? 29 : 230) * 60 * 1000).toISOString();
        const refreshToken = device.refresh_token;
        // Jangan timpa histori login asli target saat cuma di-impersonate oleh superadmin.
        if (!impersonatedBy) await this.usersService.markLogin(user.id, method);
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

    /**
     * Superadmin masuk sebagai user lain (tanpa tahu passwordnya) -- utk dukungan/investigasi.
     * Tidak boleh ke sesama superadmin, wajib keterangan (min. 10 kata), sesi lebih pendek,
     * dan setiap pemakaian tercatat penuh ke audit log (siapa impersonate siapa, kapan, alasan).
     */
    async impersonate(actorUser: any, targetUserId: number, uaResult: any, keterangan: string) {
        const actorRole = String(actorUser?.role_bdb || '').toLowerCase();
        const actorId = Number(actorUser?.id);
        if (actorRole !== 'superadmin') {
            throw new ForbiddenException('Hanya superadmin yang dapat impersonate akun lain.');
        }
        if (Number(targetUserId) === actorId) {
            throw new BadRequestException('Tidak bisa impersonate akun sendiri.');
        }
        const wordCount = String(keterangan || '').trim().split(/\s+/).filter(Boolean).length;
        if (wordCount < 10) {
            throw new BadRequestException('Keterangan/alasan impersonate wajib diisi, minimal 10 kata.');
        }

        const target = await this.usersService.findOne(String(targetUserId));
        if (!target) throw new NotFoundException('Pengguna tidak ditemukan.');
        if (String(target.role_bdb || '').toLowerCase() === 'superadmin') {
            throw new ForbiddenException('Tidak bisa impersonate akun superadmin.');
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

    async signIn(userDto: UserDto, result: any): Promise<any> {
        if (!(await this.validateCaptcha(userDto.captcha_id, userDto.captcha))) {
            throw new BadRequestException({
                errors: { captcha: ['invalid captcha'] }
            });
        }
        const user = await this.usersService.findByLoginIdentifier(userDto.email);
        if (!user) {
            throw new BadRequestException({
                errors: { password: ['invalid credentials'] }
            });
        }

        this.usersService.assertCanPasswordLogin(user);

        // Akun terkunci karena terlalu banyak gagal login?
        const lockedMinutes = this.usersService.lockRemainingMinutes(user);
        if (lockedMinutes > 0) {
            throw new BadRequestException({
                errors: { password: [`Akun terkunci karena 3x gagal login. Coba lagi dalam ${lockedMinutes} menit.`] }
            });
        }

        if (!(await bcrypt.compare(userDto.password, user.password))) {
            const r = await this.usersService.registerFailedLogin(user);
            throw new BadRequestException({
                errors: {
                    password: [r.locked ? `Password salah. Akun dikunci ${r.minutes} menit karena 3x gagal.` : `Password salah. Sisa percobaan: ${r.remaining}.`]
                }
            });
        }

        // Mode maintenance: SEMUA akun selain superadmin diblokir masuk, biar superadmin selalu bisa login utk mematikannya lagi.
        if (String(user.role_bdb || '').toLowerCase() !== 'superadmin' && (await this.systemSetting.isMaintenanceEnabled())) {
            const status = await this.systemSetting.getPublicMaintenanceStatus();
            throw new BadRequestException({
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

        // OTP email saat login: kontrol GLOBAL milik superadmin (bdb_system_settings), bukan per-akun.
        // Kalau aktif, SEMUA akun (termasuk superadmin) wajib OTP -- kode dikirim ke email dinas Polri.
        return this.finishLoginAfterFactors(user, result, 'LOCAL');
    }

    /** Verifikasi OTP email saat login lalu buat sesi. Dipanggil setelah signIn() mengembalikan requires_otp:true. */
    async verifyLoginOtp(dto: { otp_id?: string; otp_token?: string }, result: any): Promise<any> {
        const payload = await this.falidationOtp(dto?.otp_id, dto?.otp_token);
        if (payload instanceof Error) {
            throw new BadRequestException({
                errors: { otp_token: ['OTP belum diisi'] }
            });
        }
        if (payload.action !== 'login') {
            throw new BadRequestException({
                errors: { otp_token: ['OTP tidak sesuai untuk tindakan ini'] }
            });
        }
        const user = await this.usersService.findByLoginIdentifier(payload.email);
        if (!user || Number(user.id) !== Number(payload.user_id)) {
            throw new BadRequestException({
                errors: { otp_token: ['Sesi OTP tidak valid'] }
            });
        }
        return this.createLoginSession(user, result, 'LOCAL_OTP');
    }

    async verifyPin(dto: any, result: any): Promise<any> {
        const user = await this.usersService.findByLoginIdentifier(dto?.email);
        if (!user) {
            throw new BadRequestException({
                errors: { pin: ['invalid credentials'] }
            });
        }

        this.usersService.assertCanPasswordLogin(user);

        // Akun terkunci karena terlalu banyak gagal (password ATAU PIN) -- endpoint ini juga re-cek
        // password, jadi tanpa pengecekan ini lockout login bisa dilewati dgn menyerang verify-pin
        // langsung alih-alih /login.
        const lockedMinutes = this.usersService.lockRemainingMinutes(user);
        if (lockedMinutes > 0) {
            throw new BadRequestException({
                errors: { pin: [`Akun terkunci karena terlalu banyak percobaan gagal. Coba lagi dalam ${lockedMinutes} menit.`] }
            });
        }

        if (!(await bcrypt.compare(dto?.password || '', user.password))) {
            const r = await this.usersService.registerFailedLogin(user);
            throw new BadRequestException({
                errors: {
                    pin: [r.locked ? `Password salah. Akun dikunci ${r.minutes} menit karena terlalu banyak percobaan gagal.` : `Password salah. Sisa percobaan: ${r.remaining}.`]
                }
            });
        }

        if (!user.pin_required || !user.security_pin_hash) {
            throw new BadRequestException({
                errors: { pin: ['PIN login belum aktif'] }
            });
        }

        const pin = this.validatePinFormat(dto?.pin);
        if (!(await bcrypt.compare(pin, user.security_pin_hash))) {
            const r = await this.usersService.registerFailedLogin(user);
            throw new BadRequestException({
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

    async register(dto: Register, result: any): Promise<any> {
        const primaryEmail = this.normalizeEmail(dto.email);
        const emailGoogle = this.normalizeEmail(dto.email_google) || (primaryEmail.endsWith('@gmail.com') ? primaryEmail : null);
        const emailPolri = this.normalizeEmail(dto.email_polri) || (primaryEmail.endsWith('@polri.go.id') ? primaryEmail : null);
        const candidateEmails = Array.from(new Set([primaryEmail, emailGoogle, emailPolri].filter(Boolean)));

        for (const email of candidateEmails) {
            const existingUser = await this.usersService.findByEmail(email);
            if (existingUser) {
                throw new BadRequestException({
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
    async refreshToken(refreshTokenDto: RefreshTokenDto, res: any, req: any) {
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

    async signOut(request: Request): Promise<any> {
        const token = await this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException('Token not found');
        }
        let payload;
        try {
            payload = await this.jwtService.verifyAsync(token, {
                secret: jwtConstants.secret
            });
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
        if (!payload.device_id) {
            throw new UnauthorizedException('Device ID not found in token');
        }
        const device = await this.deviceService.remove(payload.device_id);
        return device;
    }

    private async extractTokenFromHeader(request: any): Promise<string | undefined> {
        const authHeader = request.headers.authorization;
        if (authHeader) {
            const [type, token] = authHeader.split(' ');
            return type === 'Bearer' ? token : undefined;
        }
        return undefined;
    }

    async user(@CurrentUser() authUser): Promise<any> {
        console.time('Total Execution');

        // Step 1: Load User + Org + Level + Role
        console.time('Step 1: Load User + Org + Level');
        const user = await this.dataSource.getRepository(User).createQueryBuilder('user').leftJoinAndSelect('user.Organisasi', 'org').leftJoinAndSelect('org.OrganisasiLevel', 'level').leftJoinAndSelect('user.OrganisasiRole', 'role').where('user.id = :id', { id: authUser.id }).getOne();
        console.timeEnd('Step 1: Load User + Org + Level');

        if (!user) throw new NotFoundException('User tidak ditemukan');

        // Step 2: Parallel Load Permission, Menu Tree, Root Levels
        console.time('Step 2: Parallel Load Permissions, Menu, Root Levels');

        const cacheKeyMenu = 'treeMenu';
        const cacheKeyRoot = 'rootLevels_Cache';

        const [levelPermissions, rolePermissions, treeMenu, rootLevels] = await Promise.all([
            this.dataSource.getRepository(Permission).createQueryBuilder('perm').innerJoin('perm.OrganisasiLevel', 'level').where('level.id = :levelId', { levelId: user.Organisasi?.OrganisasiLevel?.id }).getMany(),
            this.dataSource.getRepository(Permission).createQueryBuilder('perm').innerJoin('perm.OrganisasiRole', 'role').where('role.id = :roleId', { roleId: user.OrganisasiRole?.id }).getMany(),

            this.cacheGetOrSet.call(
                this,
                cacheKeyMenu,
                async () => {
                    return await this.dataSource.getTreeRepository(Permission).findTrees({ depth: 20 });
                },
                // 86400000
                0
            ),

            this.cacheGetOrSet.call(
                this,
                cacheKeyRoot,
                async () => {
                    return await this.dataSource.getRepository(OrganisasiLevel).find({
                        where: { level_name: In(['Mabes', 'Polda']) }
                    });
                },
                // 86400000
                0
            )
        ]);
        console.timeEnd('Step 2: Parallel Load Permissions, Menu, Root Levels');

        // Inject loaded permissions
        user.Organisasi.OrganisasiLevel.Permission = levelPermissions;
        user.OrganisasiRole.Permission = rolePermissions;

        // Step 3: Extract IDs
        console.time('Step 3: Extract Permission IDs');
        const permissionIds = rolePermissions.map(p => p.id);
        const levelPermissionIds = levelPermissions.map(p => p.id);
        console.timeEnd('Step 3: Extract Permission IDs');

        // Step 4: Filter Tree
        console.time('Step 4: Filter Tree Menu');
        function filterTree(tree: Permission[]): any[] {
            return tree
                .filter(node => permissionIds.includes(node.id) && levelPermissionIds.includes(node.id) && node.action === null && node.hide !== true)
                .map(node => {
                    let { Timestamps, ...rawNode } = node;
                    const newNode = rawNode as any;

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

        // Step 5: Clean Permissions
        console.time('Step 5: Clean Permissions');
        const cleanedPermission = rolePermissions.map(({ Timestamps, ...rest }) => rest);
        console.timeEnd('Step 5: Clean Permissions');

        // Step 6: Resolve Satker
        console.time('Step 6: Resolve Satker');
        const userPath = user.Organisasi?.OrganisasiLevel?.path ?? '';
        const matchedRoot = rootLevels.filter(root => userPath.startsWith(root.path)).sort((a, b) => b.path.length - a.path.length)[0];

        let satker = user.Organisasi?.name;
        if (matchedRoot) {
            const orgPathIds = user.Organisasi.path.split('/').filter(Boolean);
            const rootLevelPathIds = matchedRoot.path.split('/').filter(Boolean);
            const startIndex = rootLevelPathIds.length - 1;
            const resultOrgIds = orgPathIds.slice(startIndex);

            const orgs = await this.dataSource.getRepository(Organisasi).findBy({
                id: In(resultOrgIds)
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
        }
        const scopeAccessDisplay = roleBdb === 'superadmin'
            ? 'Nasional'
            : scopeRow?.nama_satker_canonical
                ? `${scopeRow.nama_satker_canonical} dan bawahannya`
                : satker || 'Belum pilih';

        // Step 7: Transform Result
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

    // Fungsi generic untuk cache get/set dengan TTL
    async cacheGetOrSet<T>(key: string, fetcher: () => Promise<T>, ttl: number): Promise<T> {
        const cached = await this.cacheManager.get<T>(key);
        if (cached !== undefined && cached !== null) {
            return cached;
        }
        const freshData = await fetcher();
        await this.cacheManager.set(key, freshData, ttl); // TTL dalam detik (sesuaikan kalau cacheManager-mu expect ms)
        return freshData;
    }

    async verifyOtp(action: string, otp_id: string, otp_token: string): Promise<any> {
        if (action === 'registration') {
            const payload = await this.falidationOtp(otp_id, otp_token);
            const queryRunner = this.dataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();
            try {
                const existingdata = await queryRunner.manager.findOne(User, {
                    where: { email: payload.new_user.email }
                });
                if (existingdata) {
                    throw new BadRequestException({
                        errors: { otp_token: ['Email sudah digunakan'] }
                    });
                }
                if (payload.new_user.password !== payload.new_user.password_confirmation) {
                    throw new BadRequestException({
                        message: 'Bad Request',
                        errors: {
                            password: ['Password confirmation does not match password']
                        }
                    });
                }
                const hashedPassword = await bcrypt.hash(payload.new_user.password, 10);
                // role_bdb SELALU 'viewer' di titik ini (baru disetel jadi role sungguhan saat
                // admin approve lewat UserService.reviewApproval()) -- organisasiRoleId (legacy)
                // WAJIB ikut cari id "viewer", JANGAN hardcode id manapun (lihat organisasi-role.util.ts
                // utk riwayat bug fatal: hardcode id 1/"superadmin" di sini bikin user yg baru
                // registrasi mandiri, begitu diapprove admin dgn role apa pun, tetap kebagian akses
                // menu penuh spt superadmin krn field ini tak pernah disentuh ulang).
                const viewerRoleId = await resolveOrganisasiRoleId(this.dataSource, 'viewer');
                const newData = queryRunner.manager.create(User, {
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
            } catch (error) {
                await queryRunner.rollbackTransaction();
                throw error;
            } finally {
                await queryRunner.release();
            }
        }
    }

    async captcha(): Promise<any> {
        // Captcha proof-of-work (self-hosted, tanpa Google & tanpa gambar):
        // user cukup klik "I'm not a robot", browser menghitung nonce PoW.
        return generatePowCaptcha();
    }

    async validateCaptcha(captchaId: string, userInput: string): Promise<boolean> {
        // userInput = nonce hasil proof-of-work dari browser
        return verifyPowCaptcha(captchaId, userInput);
    }
    async TotpRegistration(registerTotp: RegisterTOTP): Promise<any> {
        const secret = authenticator.generateSecret();
        const service = process.env.APP_NAME || 'Bareskrim-CAS';

        const user = await this.usersService.findByLoginIdentifier(registerTotp.email);
        if (!user) {
            throw new BadRequestException({
                message: 'Akun tidak ditemukan atau sesi login telah berakhir',
                errors: { password: ['invalid credentials'] }
            });
        }
        this.usersService.assertCanPasswordLogin(user);
        if (!(await bcrypt.compare(registerTotp.password, user.password))) {
            throw new BadRequestException({
                message: 'Password salah',
                errors: { password: ['invalid credentials'] }
            });
        }
        if (user.pin_required && user.security_pin_hash) {
            let pinSession: any;
            try {
                pinSession = this.decryptSecurityPayload((registerTotp as any).pin_session_id);
            } catch {
                throw new BadRequestException({
                    message: 'PIN belum diverifikasi',
                    errors: { pin: ['PIN belum diverifikasi'] }
                });
            }
            if (pinSession.action !== 'pin_verified' || Number(pinSession.user_id) !== Number(user.id) || this.normalizeEmail(pinSession.email) !== this.normalizeEmail(user.email)) {
                throw new BadRequestException({
                    message: 'Sesi verifikasi PIN tidak valid',
                    errors: { pin: ['PIN belum diverifikasi'] }
                });
            }
        }
        const label = user.email_polri || user.email || user.username || registerTotp.email;
        const otpAuthUrl = authenticator.keyuri(label, service, secret);
        const qrCodeImage = await QRCode.toDataURL(otpAuthUrl);
        user.totp_secret = secret;
        await this.usersService.save(user);
        return { totp_image: qrCodeImage };
    }

    async TotpValidation(verifyTotp: verifyTOTP, result: any): Promise<any> {
        const user = await this.usersService.findByLoginIdentifier(verifyTotp.email);
        if (!user) {
            throw new BadRequestException({
                message: 'Akun tidak ditemukan atau sesi login telah berakhir',
                errors: { password: ['invalid credentials'] }
            });
        }
        this.usersService.assertCanPasswordLogin(user);
        if (!(await bcrypt.compare(verifyTotp.password, user.password))) {
            throw new BadRequestException({
                message: 'Password salah',
                errors: { password: ['invalid credentials'] }
            });
        }
        if (user.pin_required && user.security_pin_hash) {
            let pinSession: any;
            try {
                pinSession = this.decryptSecurityPayload((verifyTotp as any).pin_session_id);
            } catch {
                throw new BadRequestException({
                    message: 'PIN belum diverifikasi',
                    errors: { pin: ['PIN belum diverifikasi'] }
                });
            }
            if (pinSession.action !== 'pin_verified' || Number(pinSession.user_id) !== Number(user.id) || this.normalizeEmail(pinSession.email) !== this.normalizeEmail(user.email)) {
                throw new BadRequestException({
                    message: 'Sesi verifikasi PIN tidak valid',
                    errors: { pin: ['PIN belum diverifikasi'] }
                });
            }
        }
        if (!user.totp_secret) {
            throw new BadRequestException({
                message: 'Aplikasi Authenticator belum dikonfigurasi pada akun ini',
                errors: { totp_token: ['Aplikasi Authenticator belum dikonfigurasi pada akun ini'] }
            });
        }
        if (!verifyTotp.totp_token) {
            throw new BadRequestException({
                message: 'Masukkan 6 digit kode authenticator',
                errors: { totp_token: ['Masukkan 6 digit kode authenticator'] }
            });
        }
        authenticator.options = { window: [4, 4] };
        const isValid = authenticator.check(String(verifyTotp.totp_token).trim(), user.totp_secret);
        if (!isValid) {
            throw new BadRequestException({
                message: 'Kode authenticator salah atau telah kedaluwarsa',
                errors: { totp_token: ['Kode authenticator salah atau telah kedaluwarsa'] }
            });
        }
        return this.finishLoginAfterFactors(user, result, 'LOCAL_TOTP');
    }

    async receivedInvitation(dto: receivedInvitation): Promise<any> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        const userEmail = `${dto.nrp}@polri.go.id`;
        const user = await queryRunner.manager.getRepository(User).createQueryBuilder('user').addSelect('user.password').leftJoinAndSelect('user.OrganisasiRole', 'OrganisasiRole').where('user.email = :email', { email: userEmail }).getOne();

        const role = await queryRunner.manager.findOneOrFail(OrganisasiRole, {
            where: { invitation_code: dto.role_code }
        });
        // role_bdb (kolom asli BDB) WAJIB ikut disamakan dgn OrganisasiRole yg diundang --
        // sebelumnya cuma OrganisasiRole yg diisi, role_bdb tak pernah disentuh. Dibatasi CHECK
        // constraint ke 4 role baku (auth_users_role_bdb_check) -- role CUSTOM sengaja tak dipaksa
        // isi (bakal gagal krn constraint), biarkan default apa adanya.
        const BAKU_ROLES = ['superadmin', 'admin_binops', 'operator', 'viewer', 'sharese'];
        const roleBdbForInvite = BAKU_ROLES.includes(String(role.role_name || '').trim().toLowerCase()) ? String(role.role_name).trim().toLowerCase() : undefined;
        try {
            await queryRunner.startTransaction();

            if (user) {
                if (user.invitation_code === dto.inv_code && role.id === user.OrganisasiRole.id) {
                    await this.falidationOtp(dto.otp_id, dto.otp_token);
                    const updatedUser = queryRunner.manager.merge(User, user, {
                        password: user.password ? user.password : await bcrypt.hash(dto.password, 10),
                        status: 'active'
                    });
                    console.log(updatedUser);

                    await queryRunner.manager.save(updatedUser);
                } else if (user.invitation_code != dto.inv_code) {
                    await this.falidationOtp(dto.otp_id, dto.otp_token);
                    const updatedUser = queryRunner.manager.merge(User, user, {
                        password: user.password ? user.password : await bcrypt.hash(dto.password, 10),
                        OrganisasiRole: { id: role.id },
                        Organisasi: { id: role.organisasi_id },
                        ...(roleBdbForInvite ? { role_bdb: roleBdbForInvite, role_name: roleBdbForInvite, requested_role_bdb: roleBdbForInvite } : {}),
                        status: 'waiting approval'
                    });
                    await queryRunner.manager.save(updatedUser);
                } else {
                    await this.falidationOtp(dto.otp_id, dto.otp_token);
                    const updatedUser = queryRunner.manager.merge(User, user, {
                        password: user.password ? user.password : await bcrypt.hash(dto.password, 10),
                        status: 'active'
                    });
                    await queryRunner.manager.save(updatedUser);
                }
            } else {
                await this.falidationOtp(dto.otp_id, dto.otp_token);
                const newUser = queryRunner.manager.create(User, {
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
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
    async sendOtp(dto: sendOtpEmailDto) {
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

    async updateProfile(authUser: User, dto: any) {
        const userRepository = this.dataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { id: Number(authUser.id) } });
        if (!user) throw new NotFoundException('User tidak ditemukan');

        const emailGoogle = this.cleanOptionalText(dto?.email_google);
        const emailPolri = this.cleanOptionalText(dto?.email_polri);
        const emailCandidates = [emailGoogle, emailPolri].map(email => this.normalizeEmail(email)).filter(Boolean);

        if (emailCandidates.length) {
            const conflictRows = await this.dataSource.query(
                `
                select id
                from auth_users
                where id <> $1
                  and (
                    lower(email) = any($2::text[])
                    or lower(coalesce(email_google, '')) = any($2::text[])
                    or lower(coalesce(email_polri, '')) = any($2::text[])
                  )
                limit 1
                `,
                [Number(user.id), emailCandidates]
            );

            if (conflictRows.length) {
                throw new ConflictException({
                    errors: { email: ['Email sudah digunakan akun lain'] }
                });
            }
        }

        const updateData: Record<string, any> = {};
        if (Object.prototype.hasOwnProperty.call(dto || {}, 'name')) updateData.name = this.cleanOptionalText(dto.name) || user.name;
        if (Object.prototype.hasOwnProperty.call(dto || {}, 'email_google')) updateData.email_google = emailGoogle;
        if (Object.prototype.hasOwnProperty.call(dto || {}, 'email_polri')) updateData.email_polri = emailPolri;

        if (Object.keys(updateData).length) {
            await userRepository.update(Number(user.id), updateData);
        }

        const nrp = this.cleanOptionalText(dto?.nrp || dto?.nip || dto?.nrp_nip);
        const noHp = this.cleanOptionalText(dto?.no_hp || dto?.phone || dto?.no_handphone);
        const profileName = this.cleanOptionalText(dto?.name || user.name);
        if (nrp || noHp || profileName) {
            const existingRows = await this.dataSource.query(
                `
                select id
                from trb_police
                where lower(email) = $1
                order by id desc
                limit 1
                `,
                [this.normalizeEmail(user.email)]
            );

            if (existingRows[0]?.id) {
                await this.dataSource.query(
                    `
                    update trb_police
                    set
                        nrp = coalesce($2, nrp),
                        nama = coalesce($3, nama),
                        no_hp = coalesce($4, no_hp),
                        email = $5,
                        updated_at = now()
                    where id = $1
                    `,
                    [existingRows[0].id, nrp, profileName, noHp, this.normalizeEmail(user.email)]
                );
            } else {
                await this.dataSource.query(
                    `
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
                    `,
                    [nrp, profileName, noHp, this.normalizeEmail(user.email)]
                );
            }
        }

        return this.user({ id: user.id });
    }

    async updateProfilePrimaryEmail(authUser: User, dto: any) {
        const userRepository = this.dataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { id: Number(authUser.id) } });
        if (!user) throw new NotFoundException('User tidak ditemukan');

        const field = String(dto?.field || '').trim();
        if (!['email_google', 'email_polri'].includes(field)) {
            throw new BadRequestException({
                errors: { field: ['Pilihan email tidak valid'] }
            });
        }

        const targetEmail = this.normalizeEmail(field === 'email_google' ? user.email_google : user.email_polri);
        const currentEmail = this.normalizeEmail(user.email);
        if (!targetEmail) {
            throw new BadRequestException({
                errors: { field: ['Email belum diisi'] }
            });
        }

        if (targetEmail === currentEmail) {
            return this.user({ id: user.id });
        }

        await this.validateSecurityOtp(user, 'set_primary_email', dto?.otp_id, dto?.otp_token);

        const conflicts = await this.dataSource.query(
            `
            select id
            from auth_users
            where id <> $1
              and (
                lower(email) = $2
                or lower(coalesce(email_google, '')) = $2
                or lower(coalesce(email_polri, '')) = $2
              )
            limit 1
            `,
            [Number(user.id), targetEmail]
        );
        if (conflicts.length) {
            throw new ConflictException({
                errors: { email: ['Email sudah digunakan akun lain'] }
            });
        }

        const updateData: Record<string, any> = { email: targetEmail };
        if (field === 'email_google') updateData.email_google = targetEmail;
        if (field === 'email_polri') updateData.email_polri = targetEmail;
        if (currentEmail.endsWith('@gmail.com') && field !== 'email_google' && !user.email_google) {
            updateData.email_google = currentEmail;
        }
        if (currentEmail.endsWith('@polri.go.id') && field !== 'email_polri' && !user.email_polri) {
            updateData.email_polri = currentEmail;
        }

        await userRepository.update(Number(user.id), updateData);
        await this.dataSource.query(
            `
            update trb_police
            set email = $2,
                updated_at = now()
            where lower(email) = $1
            `,
            [currentEmail, targetEmail]
        );

        return this.user({ id: user.id });
    }

    async requestProfileSecurityOtp(authUser: User, dto: any) {
        const action = String(dto?.action || '').trim();
        const allowedActions = ['set_primary_email', 'disable_totp', 'enable_totp', 'enable_pin', 'change_pin', 'disable_pin', 'enable_email_otp', 'disable_email_otp', 'self_deactivate'];
        if (!allowedActions.includes(action)) {
            throw new BadRequestException({
                errors: { action: ['Aksi keamanan tidak valid'] }
            });
        }

        const userRepository = this.dataSource.getRepository(User);
        const user = await userRepository
            .createQueryBuilder('user')
            .addSelect('user.password')
            .where('user.id = :id', { id: Number(authUser.id) })
            .getOne();
        if (!user) throw new NotFoundException('User tidak ditemukan');

        // Validasi password akun terlebih dahulu jika dikirimkan atau aksi aktivasi (mencegah OTP terbuang jika salah password)
        if (dto?.password || ['enable_email_otp', 'enable_pin', 'change_pin'].includes(action)) {
            if (!dto?.password) {
                throw new BadRequestException({
                    errors: { password: ['Silakan masukkan password akun Anda terlebih dahulu'] }
                });
            }
            if (!user.password) {
                throw new BadRequestException({
                    errors: { password: ['Akun ini belum memiliki password lokal'] }
                });
            }
            const isMatch = await bcrypt.compare(String(dto.password), String(user.password));
            if (!isMatch) {
                throw new BadRequestException({
                    errors: { password: ['Password akun salah. Silakan periksa kembali password Anda.'] }
                });
            }
        }

        return this.createSecurityOtp(user, action, dto?.target_email);
    }

    async createProfileTotpSetup(authUser: User, dto: any) {
        const userRepository = this.dataSource.getRepository(User);
        const user = await userRepository
            .createQueryBuilder('user')
            .addSelect('user.password')
            .where('user.id = :id', { id: Number(authUser.id) })
            .getOne();
        if (!user) throw new NotFoundException('User tidak ditemukan');

        if (!dto?.password) {
            throw new BadRequestException({
                errors: { password: ['Silakan masukkan password akun Anda untuk melanjutkan'] }
            });
        }
        if (!user.password) {
            throw new BadRequestException({
                errors: { password: ['Akun ini belum memiliki password lokal'] }
            });
        }
        const isMatch = await bcrypt.compare(String(dto.password), String(user.password));
        if (!isMatch) {
            throw new BadRequestException({
                errors: { password: ['Password akun salah. Silakan periksa kembali password Anda.'] }
            });
        }

        const mode = String(dto?.mode || '').trim().toLowerCase();
        const action = mode === 'reset' ? 'reset_totp' : 'enable_totp';
        const secret = authenticator.generateSecret();
        const service = process.env.APP_NAME || 'BIG DATA BINOPS';
        const email = this.normalizeEmail(user.email_polri || user.email);
        const otpAuthUrl = authenticator.keyuri(email, service, secret);
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

    private clearUserSecurityRateLimits(userId: number | string) {
        const id = Number(userId);
        const actions = ['set_primary_email', 'disable_totp', 'enable_totp', 'reset_totp', 'enable_pin', 'change_pin', 'disable_pin', 'enable_email_otp', 'disable_email_otp'];
        for (const act of actions) {
            this.clearOtpRateLimit(`sec_otp:${id}:${act}`);
        }
    }

    async updateProfileTotp(authUser: User, dto: any) {
        const userRepository = this.dataSource.getRepository(User);
        const user = await userRepository
            .createQueryBuilder('user')
            .addSelect('user.password')
            .addSelect('user.totp_secret')
            .addSelect('user.security_pin_hash')
            .where('user.id = :id', { id: Number(authUser.id) })
            .getOne();
        if (!user) throw new NotFoundException('User tidak ditemukan');

        const enabled = Boolean(dto?.enabled);
        if (enabled) {
            const setupPayload = this.decryptSecurityPayload(dto?.setup_id);
            const action = setupPayload.action;
            if (!['enable_totp', 'reset_totp'].includes(action) || Number(setupPayload.user_id) !== Number(user.id)) {
                throw new BadRequestException({
                    errors: { totp_token: ['Setup authenticator tidak valid atau telah kedaluwarsa'] }
                });
            }

            if (!dto?.totp_token || !authenticator.check(String(dto.totp_token).trim(), setupPayload.secret)) {
                throw new BadRequestException({
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

        // Disable TOTP: allow verification with TOTP token, Password, or PIN
        let verified = false;
        if (dto?.totp_token && user.totp_secret && authenticator.check(String(dto.totp_token).trim(), user.totp_secret)) {
            verified = true;
        } else if (dto?.password && user.password && (await bcrypt.compare(String(dto.password), String(user.password)))) {
            verified = true;
        } else if (dto?.pin && user.security_pin_hash && (await bcrypt.compare(String(dto.pin), String(user.security_pin_hash)))) {
            verified = true;
        } else if (dto?.otp_id && dto?.otp_token) {
            await this.validateSecurityOtp(user, 'disable_totp', dto.otp_id, dto.otp_token);
            verified = true;
        }

        if (!verified) {
            throw new BadRequestException({
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

    async updateProfileEmailOtp(authUser: User, dto: any) {
        const userRepository = this.dataSource.getRepository(User);
        const user = await userRepository
            .createQueryBuilder('user')
            .addSelect('user.password')
            .addSelect('user.totp_secret')
            .addSelect('user.security_pin_hash')
            .where('user.id = :id', { id: Number(authUser.id) })
            .getOne();
        if (!user) throw new NotFoundException('User tidak ditemukan');

        const enabled = Boolean(dto?.enabled);
        const action = enabled ? 'enable_email_otp' : 'disable_email_otp';

        if (enabled) {
            await this.validateSecurityOtp(user, action, dto?.otp_id, dto?.otp_token);
        } else {
            let verified = false;
            if (dto?.password && user.password && (await bcrypt.compare(String(dto.password), String(user.password)))) {
                verified = true;
            } else if (dto?.totp_token && user.totp_secret && authenticator.check(String(dto.totp_token).trim(), user.totp_secret)) {
                verified = true;
            } else if (dto?.pin && user.security_pin_hash && (await bcrypt.compare(String(dto.pin), String(user.security_pin_hash)))) {
                verified = true;
            } else if (dto?.otp_id && dto?.otp_token) {
                await this.validateSecurityOtp(user, action, dto.otp_id, dto.otp_token);
                verified = true;
            }
            if (!verified) {
                throw new BadRequestException({
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

    async updateProfilePin(authUser: User, dto: any) {
        const userRepository = this.dataSource.getRepository(User);
        const user = await userRepository
            .createQueryBuilder('user')
            .addSelect('user.password')
            .addSelect('user.totp_secret')
            .addSelect('user.security_pin_hash')
            .where('user.id = :id', { id: Number(authUser.id) })
            .getOne();
        if (!user) throw new NotFoundException('User tidak ditemukan');

        const enabled = Boolean(dto?.enabled);
        const action = String(dto?.action || (enabled ? (user.pin_required ? 'change_pin' : 'enable_pin') : 'disable_pin'));

        if (enabled) {
            const pin = this.validatePinFormat(dto?.pin);
            const pinConfirmation = this.validatePinFormat(dto?.pin_confirmation || dto?.pin, 'pin_confirmation');
            if (pin !== pinConfirmation) {
                throw new BadRequestException({
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
        } else {
            let verified = false;
            if (dto?.password && user.password && (await bcrypt.compare(String(dto.password), String(user.password)))) {
                verified = true;
            } else if (dto?.pin && user.security_pin_hash && (await bcrypt.compare(String(dto.pin), String(user.security_pin_hash)))) {
                verified = true;
            } else if (dto?.totp_token && user.totp_secret && authenticator.check(String(dto.totp_token).trim(), user.totp_secret)) {
                verified = true;
            } else if (dto?.otp_id && dto?.otp_token) {
                await this.validateSecurityOtp(user, action, dto.otp_id, dto.otp_token);
                verified = true;
            }

            if (!verified) {
                throw new BadRequestException({
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

    async forgotPasswordRequest(dto: ForgotPasswordRequestDto) {
        if (!(await this.validateCaptcha(dto.captcha_id, dto.captcha))) {
            throw new BadRequestException({
                errors: { captcha: ['invalid captcha'] }
            });
        }

        const email = this.normalizeEmail(dto.email);
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new BadRequestException({
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

    async forgotPasswordConfirm(dto: ForgotPasswordConfirmDto) {
        const email = this.normalizeEmail(dto.email);
        if (dto.password !== dto.password_confirmation) {
            throw new BadRequestException({
                message: 'Bad Request',
                errors: { password_confirmation: ['Konfirmasi password tidak sama'] }
            });
        }

        const payload = await this.falidationOtp(dto.otp_id, dto.otp_token);
        if (payload.action !== 'forgot_password' || this.normalizeEmail(payload.email) !== email) {
            throw new BadRequestException({
                errors: { otp_token: ['OTP tidak sesuai untuk reset password akun ini'] }
            });
        }

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const user = await queryRunner.manager
                .getRepository(User)
                .createQueryBuilder('user')
                .addSelect('user.password')
                .where('lower(user.email) = :email', { email })
                .orWhere('lower(user.email_google) = :email', { email })
                .orWhere('lower(user.email_polri) = :email', { email })
                .orWhere('lower(user.email_polri) = :email', { email })
                .getOne();

            if (!user) {
                throw new BadRequestException({
                    errors: { email: ['email tidak ditemukan'] }
                });
            }

            const hashedPassword = await bcrypt.hash(dto.password, 10);
            const loginMethod = user.login_method && user.login_method !== 'LOCAL' ? 'HYBRID' : user.login_method || 'HYBRID';
            await queryRunner.manager.update(User, user.id, {
                password: hashedPassword,
                local_password_enabled: true,
                login_method: loginMethod
            });

            await queryRunner.commitTransaction();
            return { message: 'Password berhasil direset' };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async falidationOtp(otp_id: string, otp_token: string) {
        if (!otp_id || !otp_token) {
            return new Error('otp tidak terisi / belum mengirimkan kode otp');
        }
        const secret = process.env.CAPTCHA_SECRET || 'default_secret_key';
        const keyBuffer = crypto.createHash('sha256').update(secret).digest();
        const key = new Uint8Array(keyBuffer);
        const [ivBase64, encryptedBase64] = otp_id.split(':');
        if (!ivBase64 || !encryptedBase64) {
            throw new BadRequestException({
                errors: { otp_token: ['Invalid format'] }
            });
        }
        const iv = Buffer.from(ivBase64, 'base64');
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        let decrypted = decipher.update(encryptedBase64, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        const payload = JSON.parse(decrypted);
        if (new Date(payload.expired_at) < new Date()) {
            throw new BadRequestException({
                errors: { otp_token: ['expired token'] }
            });
        }

        // Batasi percobaan tebak kode OTP spt lockout login (pakai akun yg sama) -- tanpa ini kode
        // 6 digit bisa di-brute-force ratusan ribu kali dlm jendela 5 menit sblm token kedaluwarsa.
        const otpUser = payload.user_id ? await this.usersService.findOne(String(payload.user_id)) : null;
        if (otpUser) {
            const lockedMinutes = this.usersService.lockRemainingMinutes(otpUser);
            if (lockedMinutes > 0) {
                throw new BadRequestException({
                    errors: { otp_token: [`Akun terkunci karena terlalu banyak percobaan gagal. Coba lagi dalam ${lockedMinutes} menit.`] }
                });
            }
        }

        const isMatch = await bcrypt.compare(otp_token, payload.otp);
        if (!isMatch) {
            if (otpUser) {
                const r = await this.usersService.registerFailedLogin(otpUser);
                throw new BadRequestException({
                    errors: {
                        otp_token: [r.locked ? `Kode OTP salah. Akun dikunci ${r.minutes} menit karena terlalu banyak percobaan gagal.` : `Kode OTP salah. Sisa percobaan: ${r.remaining}.`]
                    }
                });
            }
            throw new BadRequestException({
                errors: { otp_token: ['Invalid OTP token'] }
            });
        }
        return payload;
    }

    async resetPassword(dto: ResetPasswordDto, @CurrentUser() authUser, req) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const user = await queryRunner.manager
                .getRepository(User)
                .createQueryBuilder('user')
                .addSelect('user.password')
                .setLock('pessimistic_write')
                .where('user.id = :id', { id: authUser.id })
                .getOne();

            if (!user) {
                throw new NotFoundException('Pengguna tidak ditemukan');
            }

            const isMatch = await bcrypt.compare(dto.oldPassword, user.password);
            if (!isMatch) {
                throw new BadRequestException('Password lama salah');
            }

            const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
            await queryRunner.manager.update(User, authUser.id, { password: hashedPassword });
            await queryRunner.commitTransaction();
        } catch (error) {
            if (queryRunner.isTransactionActive) {
                await queryRunner.rollbackTransaction();
            }
            throw error;
        } finally {
            await queryRunner.release();
        }

        // Password sudah committed. Pencabutan device tidak boleh membatalkan password baru.
        let sessionRevoked = true;
        try {
            await this.signOut(req);
        } catch {
            sessionRevoked = false;
        }
        await this.usersService.logOwnPasswordChange(authUser, sessionRevoked);
        return { message: 'Password berhasil diubah' };
    }
}
