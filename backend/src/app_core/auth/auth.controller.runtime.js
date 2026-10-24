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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const auth_service_1 = require("./auth.service");
const user_dto_1 = require("./user/dto/user.dto");
const swagger_1 = require("@nestjs/swagger");
const UAParserLib = require("ua-parser-js");
const pipe_helper_service_1 = require("../helper/service/pipe.helper.service");
const auth_guard_1 = require("./auth.guard");
const auth_login_guard_1 = require("./auth-login.guard");
const current_user_interceptor_1 = require("../helper/interceptor/current-user.interceptor");
const current_user_decorator_1 = require("../helper/decoration/current-user.decorator");
const route_name_decorator_1 = require("./route/route-name.decorator");
const updateUser_dto_1 = require("./user/dto/updateUser.dto");
const audit_service_1 = require("../../bdb/audit/audit.service");
const system_setting_service_1 = require("../../bdb/system-setting/system-setting.service");
let AuthController = class AuthController {
    authService;
    audit;
    jwtService;
    systemSetting;
    constructor(authService, audit, jwtService, systemSetting) {
        this.authService = authService;
        this.audit = audit;
        this.jwtService = jwtService;
        this.systemSetting = systemSetting;
    }
    async maintenanceStatus(res) {
        return res.sendSuccess(await this.systemSetting.getPublicMaintenanceStatus());
    }
    async pusatBantuan(res) {
        return res.sendSuccess(await this.systemSetting.getPusatBantuan());
    }
    async register(dto, userAgent, res) {
        const parser = new UAParserLib.UAParser(userAgent);
        const result = parser.getResult();
        return res.sendSuccess(await this.authService.register(dto, result));
    }
    async login(userDto, userAgent, res, req) {
        const parser = new UAParserLib.UAParser(userAgent);
        const result = parser.getResult();
        try {
            const data = await this.authService.signIn(userDto, result);
            let userId;
            let userName;
            if (data?.access_token) {
                const payload = this.jwtService.decode(data.access_token);
                userId = payload?.id ? Number(payload.id) : undefined;
                userName = payload?.username || payload?.user?.name;
            }
            const outcome = data?.access_token ? 'SUCCESS' : data?.requires_totp ? 'PARTIAL_TOTP' : data?.requires_pin ? 'PARTIAL_PIN' : 'SUCCESS';
            void this.audit.log({ userId, userName: userName || userDto?.email, action: 'LOGIN', entity: 'auth', meta: { email: userDto?.email, outcome }, ip: req?.ip });
            return res.sendSuccess(data);
        }
        catch (e) {
            const message = e?.response?.errors ? JSON.stringify(e.response.errors) : e?.message || 'Login gagal';
            void this.audit.log({ userName: userDto?.email, action: 'LOGIN', entity: 'auth', meta: { email: userDto?.email, outcome: 'ERROR', message }, ip: req?.ip });
            throw e;
        }
    }
    async verifyLoginOtp(dto, userAgent, res, req) {
        const parser = new UAParserLib.UAParser(userAgent);
        const result = parser.getResult();
        try {
            const data = await this.authService.verifyLoginOtp(dto, result);
            const payload = data?.access_token ? this.jwtService.decode(data.access_token) : null;
            void this.audit.log({ userId: payload?.id ? Number(payload.id) : undefined, userName: payload?.username, action: 'LOGIN_OTP', entity: 'auth', meta: { outcome: data?.access_token ? 'SUCCESS' : 'ERROR' }, ip: req?.ip });
            return res.sendSuccess(data);
        }
        catch (e) {
            const message = e?.response?.errors ? JSON.stringify(e.response.errors) : e?.message || 'Verifikasi OTP gagal';
            void this.audit.log({ action: 'LOGIN_OTP', entity: 'auth', meta: { outcome: 'ERROR', message }, ip: req?.ip });
            throw e;
        }
    }
    async resendLoginOtp(dto, res) {
        return res.sendSuccess(await this.authService.resendLoginOtp(dto?.otp_id || ''));
    }
    async refreshToken(refreshTokenDto, res, req) {
        return res.sendSuccess(await this.authService.refreshToken(refreshTokenDto, res, req));
    }
    async impersonate(authUser, userId, body, userAgent, res) {
        const parser = new UAParserLib.UAParser(userAgent);
        const result = parser.getResult();
        const data = await this.authService.impersonate(authUser, parseInt(userId, 10), result, body?.keterangan || '');
        return res.sendSuccess(data);
    }
    async logout(req, res) {
        return res.sendSuccess(await this.authService.signOut(req));
    }
    async user(authUser, res) {
        const user = await this.authService.user(authUser);
        return res.sendSuccess(user);
    }
    async verifyOtp(action, otp_id, otp_token, req, res) {
        if (action === 'login') {
            return res.sendSuccess();
        }
        else if (action === 'register') {
            return res.sendSuccess(await this.authService.verifyOtp('registration', otp_id, otp_token));
        }
        else {
            return res.sendSuccess();
        }
    }
    async captcha(req, res) {
        return res.sendSuccess(await this.authService.captcha());
    }
    async captchaValidation(captcha_id, captcha, req, res) {
        return res.sendSuccess(await this.authService.validateCaptcha(captcha_id, captcha));
    }
    async captchaVerify(body, res) {
        const valid = await this.authService.validateCaptcha(body?.id, body?.selected);
        return res.sendSuccess({ valid });
    }
    async totpRegistration(registerTotp, req, res) {
        return res.sendSuccess(await this.authService.TotpRegistration(registerTotp));
    }
    async verifyTotp(verify, userAgent, res) {
        const parser = new UAParserLib.UAParser(userAgent);
        const result = parser.getResult();
        const data = await this.authService.TotpValidation(verify, result);
        console.log(data);
        return res.sendSuccess(data);
    }
    async verifyPin(dto, userAgent, res) {
        const parser = new UAParserLib.UAParser(userAgent);
        const result = parser.getResult();
        return res.sendSuccess(await this.authService.verifyPin(dto, result));
    }
    async receivedInvitation(dto, res) {
        return res.sendSuccess(await this.authService.receivedInvitation(dto));
    }
    async sendOtp(dto, res) {
        return res.sendSuccess(await this.authService.sendOtp(dto));
    }
    async updateProfile(authUser, dto, res) {
        return res.sendSuccess(await this.authService.updateProfile(authUser, dto));
    }
    async updateProfilePrimaryEmail(authUser, dto, res) {
        return res.sendSuccess(await this.authService.updateProfilePrimaryEmail(authUser, dto));
    }
    async requestProfileSecurityOtp(authUser, dto, res) {
        return res.sendSuccess(await this.authService.requestProfileSecurityOtp(authUser, dto));
    }
    async createProfileTotpSetupAlias(authUser, dto, res) {
        return res.sendSuccess(await this.authService.createProfileTotpSetup(authUser, dto));
    }
    async updateProfileEmailOtp(authUser, dto, res) {
        return res.sendSuccess(await this.authService.updateProfileEmailOtp(authUser, dto));
    }
    async createProfileTotpSetup(authUser, dto, res) {
        return res.sendSuccess(await this.authService.createProfileTotpSetup(authUser, dto));
    }
    async updateProfileTotp(authUser, dto, res) {
        return res.sendSuccess(await this.authService.updateProfileTotp(authUser, dto));
    }
    async updateProfilePin(authUser, dto, res) {
        return res.sendSuccess(await this.authService.updateProfilePin(authUser, dto));
    }
    async forgotPasswordRequest(dto, res) {
        return res.sendSuccess(await this.authService.forgotPasswordRequest(dto));
    }
    async forgotPasswordConfirm(dto, res) {
        return res.sendSuccess(await this.authService.forgotPasswordConfirm(dto));
    }
    async resetPassword(updateUserDto, authUser, res, req) {
        return res.sendSuccess(await this.authService.resetPassword(updateUserDto, authUser, req));
    }
    async passkeyRegisterOptions(authUser, res) {
        return res.sendSuccess(await this.authService.passkeyRegisterOptions(authUser));
    }
    async passkeyRegisterVerify(authUser, dto, userAgent, res) {
        const parser = new UAParserLib.UAParser(userAgent);
        const result = parser.getResult();
        return res.sendSuccess(await this.authService.passkeyRegisterVerify(authUser, dto, result));
    }
    async passkeyGetDevices(authUser, res) {
        return res.sendSuccess(await this.authService.passkeyGetDevices(authUser));
    }
    async passkeyDeleteDevice(authUser, id, body, query, req, res) {
        const dto = Object.assign({}, req?.body || {}, body || {}, query || {});
        return res.sendSuccess(await this.authService.passkeyDeleteDevice(authUser, parseInt(id, 10), dto));
    }
    async passkeyLoginOptions(username, res) {
        return res.sendSuccess(await this.authService.passkeyLoginOptions(username));
    }
    async passkeyLoginVerify(dto, userAgent, req, res) {
        const parser = new UAParserLib.UAParser(userAgent);
        const result = parser.getResult();
        try {
            const data = await this.authService.passkeyLoginVerify(dto, result);
            const payload = data?.access_token ? this.jwtService.decode(data.access_token) : null;
            void this.audit.log({
                userId: payload?.id ? Number(payload.id) : undefined,
                userName: payload?.username,
                action: 'LOGIN_PASSKEY',
                entity: 'auth',
                meta: { outcome: 'SUCCESS' },
                ip: req?.ip
            });
            return res.sendSuccess(data);
        } catch (e) {
            void this.audit.log({
                action: 'LOGIN_PASSKEY',
                entity: 'auth',
                meta: { outcome: 'ERROR', message: e?.message || 'Login biometrik gagal' },
                ip: req?.ip
            });
            throw e;
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)('maintenance-status'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "maintenanceStatus", null);
__decorate([
    (0, common_1.Get)('pusat-bantuan'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "pusatBantuan", null);
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('user-agent')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.Register, String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.UseGuards)(auth_login_guard_1.AuthLoginGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('user-agent')),
    __param(2, (0, common_1.Res)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.UserDto, String, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('verify-login-otp'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('user-agent')),
    __param(2, (0, common_1.Res)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyLoginOtp", null);
__decorate([
    (0, common_1.Post)('resend-login-otp'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resendLoginOtp", null);
__decorate([
    (0, common_1.Post)('refresh-token'),
    (0, common_1.UseGuards)(auth_login_guard_1.AuthLoginGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.RefreshTokenDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Post)('impersonate/:userId'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.UseInterceptors)(current_user_interceptor_1.CurrentUserInterceptor),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Headers)('user-agent')),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "impersonate", null);
__decorate([
    (0, common_1.Get)('logout'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)('user'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.UseInterceptors)(current_user_interceptor_1.CurrentUserInterceptor),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "user", null);
__decorate([
    (0, common_1.Get)('verify-otp/:otp_id/:otp_token/:action'),
    __param(0, (0, common_1.Param)('action')),
    __param(1, (0, common_1.Param)('otp_id')),
    __param(2, (0, common_1.Param)('otp_token')),
    __param(3, (0, common_1.Request)()),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyOtp", null);
__decorate([
    (0, common_1.Get)('captcha'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "captcha", null);
__decorate([
    (0, common_1.Get)('captchaValidation/:captcha_id/:captcha'),
    __param(0, (0, common_1.Param)('captcha_id')),
    __param(1, (0, common_1.Param)('captcha')),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "captchaValidation", null);
__decorate([
    (0, common_1.Post)('captcha/verify'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "captchaVerify", null);
__decorate([
    (0, common_1.Post)('totp-registration'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.RegisterTOTP, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "totpRegistration", null);
__decorate([
    (0, common_1.Post)('verify-totp'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('user-agent')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.verifyTOTP, String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyTotp", null);
__decorate([
    (0, common_1.Post)('verify-pin'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('user-agent')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyPin", null);
__decorate([
    (0, common_1.Post)('received-invitation'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.receivedInvitation, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "receivedInvitation", null);
__decorate([
    (0, common_1.Post)('sendOtp'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [updateUser_dto_1.sendOtpEmailDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "sendOtp", null);
__decorate([
    (0, common_1.Patch)('profile'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.UseInterceptors)(current_user_interceptor_1.CurrentUserInterceptor),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Patch)('profile/primary-email'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.UseInterceptors)(current_user_interceptor_1.CurrentUserInterceptor),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateProfilePrimaryEmail", null);
__decorate([
    (0, common_1.Post)('profile/security/otp'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.UseInterceptors)(current_user_interceptor_1.CurrentUserInterceptor),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "requestProfileSecurityOtp", null);
__decorate([
    (0, common_1.Post)('profile/security/totp-setup'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.UseInterceptors)(current_user_interceptor_1.CurrentUserInterceptor),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "createProfileTotpSetupAlias", null);
__decorate([
    (0, common_1.Patch)('profile/security/email-otp'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.UseInterceptors)(current_user_interceptor_1.CurrentUserInterceptor),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateProfileEmailOtp", null);
__decorate([
    (0, common_1.Post)('profile/security/totp/setup'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.UseInterceptors)(current_user_interceptor_1.CurrentUserInterceptor),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "createProfileTotpSetup", null);
__decorate([
    (0, common_1.Patch)('profile/security/totp'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.UseInterceptors)(current_user_interceptor_1.CurrentUserInterceptor),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateProfileTotp", null);
__decorate([
    (0, common_1.Patch)('profile/security/pin'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.UseInterceptors)(current_user_interceptor_1.CurrentUserInterceptor),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateProfilePin", null);
__decorate([
    (0, common_1.Post)('forgot-password/request'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [updateUser_dto_1.ForgotPasswordRequestDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPasswordRequest", null);
__decorate([
    (0, common_1.Post)('forgot-password/confirm'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [updateUser_dto_1.ForgotPasswordConfirmDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPasswordConfirm", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    (0, common_1.UseInterceptors)(current_user_interceptor_1.CurrentUserInterceptor),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Res)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [updateUser_dto_1.ResetPasswordDto, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Get)('passkey/register-options'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.UseInterceptors)(current_user_interceptor_1.CurrentUserInterceptor),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "passkeyRegisterOptions", null);
__decorate([
    (0, common_1.Post)('passkey/register-verify'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.UseInterceptors)(current_user_interceptor_1.CurrentUserInterceptor),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)('user-agent')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "passkeyRegisterVerify", null);
__decorate([
    (0, common_1.Get)('passkey/devices'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.UseInterceptors)(current_user_interceptor_1.CurrentUserInterceptor),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "passkeyGetDevices", null);
__decorate([
    (0, common_1.Delete)('passkey/devices/:id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.UseInterceptors)(current_user_interceptor_1.CurrentUserInterceptor),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Query)()),
    __param(4, (0, common_1.Req)()),
    __param(5, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "passkeyDeleteDevice", null);
__decorate([
    (0, common_1.Get)('passkey/login-options'),
    __param(0, (0, common_1.Query)('username')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "passkeyLoginOptions", null);
__decorate([
    (0, common_1.Post)('passkey/login-verify'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('user-agent')),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "passkeyLoginVerify", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, route_name_decorator_1.ControllerTag)('auth'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UsePipes)(new pipe_helper_service_1.CustomValidationPipe()),
    (0, common_1.Controller)('Authentication/'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        audit_service_1.AuditService,
        jwt_1.JwtService,
        system_setting_service_1.SystemSettingService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map