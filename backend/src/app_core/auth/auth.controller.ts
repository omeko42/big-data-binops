import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, Query, Req, Request, Res, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { receivedInvitation, RefreshTokenDto, Register, RegisterTOTP, UserDto, verifyTOTP } from './user/dto/user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './user/dto/createUser.dto';
import * as UAParserLib from 'ua-parser-js';
import { CustomValidationPipe } from '@app_core/helper/service/pipe.helper.service';
import { AuthGuard } from './auth.guard';
import { AuthLoginGuard } from './auth-login.guard';
import { CurrentUserInterceptor } from '@app_core/helper/interceptor/current-user.interceptor';
import { CurrentUser } from '@app_core/helper/decoration/current-user.decorator';
import { ControllerTag } from './route/route-name.decorator';
import { ForgotPasswordConfirmDto, ForgotPasswordRequestDto, ResetPasswordDto, sendOtpEmailDto } from './user/dto/updateUser.dto';
import { AuditService } from 'src/bdb/audit/audit.service';
import { SystemSettingService } from 'src/bdb/system-setting/system-setting.service';

@ApiTags('auth')
@ControllerTag('auth')
@ApiBearerAuth('access-token')
@UsePipes(new CustomValidationPipe())
@Controller('Authentication/')
export class AuthController {
    constructor(
        private authService: AuthService,
        private readonly audit: AuditService,
        private readonly jwtService: JwtService,
        private readonly systemSetting: SystemSettingService
    ) {}

    /** Status maintenance publik (tanpa auth) -- dipakai halaman /maintenance & guard frontend sblm/tanpa login. */
    @Get('maintenance-status')
    async maintenanceStatus(@Res() res) {
        return res.sendSuccess(await this.systemSetting.getPublicMaintenanceStatus());
    }

    /** Kontak Pusat Bantuan publik (tanpa auth) -- dipakai halaman login/OTP/PIN/TOTP/forgot-password. */
    @Get('pusat-bantuan')
    async pusatBantuan(@Res() res) {
        return res.sendSuccess(await this.systemSetting.getPusatBantuan());
    }

    @Post('register')
    async register(@Body() dto: Register, @Headers('user-agent') userAgent: string, @Res() res) {
        const parser = new UAParserLib.UAParser(userAgent);
        const result = parser.getResult();
        return res.sendSuccess(await this.authService.register(dto, result));
    }

    /** Login diaudit terpisah (bukan lewat GlobalAuditInterceptor): rute ini pre-auth, req.user belum ada. */
    @Post('login')
    @UseGuards(AuthLoginGuard)
    async login(@Body() userDto: UserDto, @Headers('user-agent') userAgent: string, @Res() res, @Req() req: any) {
        const parser = new UAParserLib.UAParser(userAgent);
        const result = parser.getResult();
        try {
            const data = await this.authService.signIn(userDto, result);
            let userId: number | undefined;
            let userName: string | undefined;
            if (data?.access_token) {
                const payload: any = this.jwtService.decode(data.access_token);
                userId = payload?.id ? Number(payload.id) : undefined;
                userName = payload?.username || payload?.user?.name;
            }
            const outcome = data?.access_token ? 'SUCCESS' : data?.requires_totp ? 'PARTIAL_TOTP' : data?.requires_pin ? 'PARTIAL_PIN' : 'SUCCESS';
            void this.audit.log({ userId, userName: userName || userDto?.email, action: 'LOGIN', entity: 'auth', meta: { email: userDto?.email, outcome }, ip: req?.ip });
            return res.sendSuccess(data);
        } catch (e: any) {
            const message = e?.response?.errors ? JSON.stringify(e.response.errors) : e?.message || 'Login gagal';
            void this.audit.log({ userName: userDto?.email, action: 'LOGIN', entity: 'auth', meta: { email: userDto?.email, outcome: 'ERROR', message }, ip: req?.ip });
            throw e;
        }
    }

    /** Langkah kedua login OTP-email: verifikasi kode lalu buat sesi. Diaudit terpisah, sama seperti login. */
    @Post('verify-login-otp')
    async verifyLoginOtp(@Body() dto: { otp_id?: string; otp_token?: string }, @Headers('user-agent') userAgent: string, @Res() res, @Req() req: any) {
        const parser = new UAParserLib.UAParser(userAgent);
        const result = parser.getResult();
        try {
            const data = await this.authService.verifyLoginOtp(dto, result);
            const payload: any = data?.access_token ? this.jwtService.decode(data.access_token) : null;
            void this.audit.log({ userId: payload?.id ? Number(payload.id) : undefined, userName: payload?.username, action: 'LOGIN_OTP', entity: 'auth', meta: { outcome: data?.access_token ? 'SUCCESS' : 'ERROR' }, ip: req?.ip });
            return res.sendSuccess(data);
        } catch (e: any) {
            const message = e?.response?.errors ? JSON.stringify(e.response.errors) : e?.message || 'Verifikasi OTP gagal';
            void this.audit.log({ action: 'LOGIN_OTP', entity: 'auth', meta: { outcome: 'ERROR', message }, ip: req?.ip });
            throw e;
        }
    }

    /** Kirim ulang OTP login (mis. kode lama kedaluwarsa) -- tidak perlu password lagi, cukup otp_id lama. */
    @Post('resend-login-otp')
    async resendLoginOtp(@Body() dto: { otp_id?: string }, @Res() res) {
        return res.sendSuccess(await this.authService.resendLoginOtp(dto?.otp_id || ''));
    }

    @Post('refresh-token')
    @UseGuards(AuthLoginGuard)
    async refreshToken(@Body() refreshTokenDto: RefreshTokenDto, @Res() res, @Req() req) {
        return res.sendSuccess(await this.authService.refreshToken(refreshTokenDto, res, req));
    }

    /** Superadmin masuk sebagai user lain (tanpa password-nya). Diaudit di dalam AuthService.impersonate(). */
    @Post('impersonate/:userId')
    @UseGuards(AuthGuard)
    @UseInterceptors(CurrentUserInterceptor)
    async impersonate(@CurrentUser() authUser, @Param('userId') userId: string, @Body() body: { keterangan?: string }, @Headers('user-agent') userAgent: string, @Res() res) {
        const parser = new UAParserLib.UAParser(userAgent);
        const result = parser.getResult();
        const data = await this.authService.impersonate(authUser, parseInt(userId, 10), result, body?.keterangan || '');
        return res.sendSuccess(data);
    }

    @Get('logout')
    @UseGuards(AuthGuard)
    async logout(@Request() req, @Res() res) {
        return res.sendSuccess(await this.authService.signOut(req));
    }

    @Get('user')
    @UseGuards(AuthGuard)
    @UseInterceptors(CurrentUserInterceptor)
    async user(@CurrentUser() authUser, @Res() res) {
        const user = await this.authService.user(authUser);
        return res.sendSuccess(user);
    }

    @Get('verify-otp/:otp_id/:otp_token/:action')
    async verifyOtp(@Param('action') action: string, @Param('otp_id') otp_id: string, @Param('otp_token') otp_token: string, @Request() req, @Res() res) {
        if (action === 'login') {
            return res.sendSuccess();
        } else if (action === 'register') {
            return res.sendSuccess(await this.authService.verifyOtp('registration', otp_id, otp_token));
        } else {
            return res.sendSuccess();
        }
    }

    @Get('captcha')
    async captcha(@Req() req, @Res({ passthrough: true }) res) {
        return res.sendSuccess(await this.authService.captcha());
    }

    @Get('captchaValidation/:captcha_id/:captcha')
    async captchaValidation(@Param('captcha_id') captcha_id: string, @Param('captcha') captcha: string, @Req() req, @Res({ passthrough: true }) res) {
        return res.sendSuccess(await this.authService.validateCaptcha(captcha_id, captcha));
    }

    @Post('captcha/verify')
    async captchaVerify(@Body() body: { id: string; selected: string }, @Res({ passthrough: true }) res) {
        const valid = await this.authService.validateCaptcha(body?.id, body?.selected);
        return res.sendSuccess({ valid });
    }

    @Post('totp-registration')
    async totpRegistration(@Body() registerTotp: RegisterTOTP, @Req() req, @Res({ passthrough: true }) res) {
        return res.sendSuccess(await this.authService.TotpRegistration(registerTotp));
    }

    @Post('verify-totp')
    async verifyTotp(@Body() verify: verifyTOTP, @Headers('user-agent') userAgent: string, @Res() res) {
        const parser = new UAParserLib.UAParser(userAgent);
        const result = parser.getResult();
        const data = await this.authService.TotpValidation(verify, result);
        console.log(data);

        return res.sendSuccess(data);
    }

    @Post('verify-pin')
    async verifyPin(@Body() dto: any, @Headers('user-agent') userAgent: string, @Res() res) {
        const parser = new UAParserLib.UAParser(userAgent);
        const result = parser.getResult();
        return res.sendSuccess(await this.authService.verifyPin(dto, result));
    }

    @Post('received-invitation')
    async receivedInvitation(@Body() dto: receivedInvitation, @Res() res) {
        return res.sendSuccess(await this.authService.receivedInvitation(dto));
    }

    @Post('sendOtp')
    async sendOtp(@Body() dto: sendOtpEmailDto, @Res() res) {
        return res.sendSuccess(await this.authService.sendOtp(dto));
    }

    @Patch('profile')
    @UseGuards(AuthGuard)
    @UseInterceptors(CurrentUserInterceptor)
    async updateProfile(@CurrentUser() authUser, @Body() dto: any, @Res() res) {
        return res.sendSuccess(await this.authService.updateProfile(authUser, dto));
    }

    @Patch('profile/primary-email')
    @UseGuards(AuthGuard)
    @UseInterceptors(CurrentUserInterceptor)
    async updateProfilePrimaryEmail(@CurrentUser() authUser, @Body() dto: any, @Res() res) {
        return res.sendSuccess(await this.authService.updateProfilePrimaryEmail(authUser, dto));
    }

    @Post('profile/security/otp')
    @UseGuards(AuthGuard)
    @UseInterceptors(CurrentUserInterceptor)
    async requestProfileSecurityOtp(@CurrentUser() authUser, @Body() dto: any, @Res() res) {
        return res.sendSuccess(await this.authService.requestProfileSecurityOtp(authUser, dto));
    }

    @Post('profile/security/totp-setup')
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

    @Post('profile/security/totp/setup')
    @UseGuards(AuthGuard)
    @UseInterceptors(CurrentUserInterceptor)
    async createProfileTotpSetup(@CurrentUser() authUser, @Body() dto: any, @Res() res) {
        return res.sendSuccess(await this.authService.createProfileTotpSetup(authUser, dto));
    }

    @Patch('profile/security/totp')
    @UseGuards(AuthGuard)
    @UseInterceptors(CurrentUserInterceptor)
    async updateProfileTotp(@CurrentUser() authUser, @Body() dto: any, @Res() res) {
        return res.sendSuccess(await this.authService.updateProfileTotp(authUser, dto));
    }

    @Patch('profile/security/pin')
    @UseGuards(AuthGuard)
    @UseInterceptors(CurrentUserInterceptor)
    async updateProfilePin(@CurrentUser() authUser, @Body() dto: any, @Res() res) {
        return res.sendSuccess(await this.authService.updateProfilePin(authUser, dto));
    }

    @Post('forgot-password/request')
    async forgotPasswordRequest(@Body() dto: ForgotPasswordRequestDto, @Res() res) {
        return res.sendSuccess(await this.authService.forgotPasswordRequest(dto));
    }

    @Post('forgot-password/confirm')
    async forgotPasswordConfirm(@Body() dto: ForgotPasswordConfirmDto, @Res() res) {
        return res.sendSuccess(await this.authService.forgotPasswordConfirm(dto));
    }

    @Post('reset-password')
    @UseInterceptors(CurrentUserInterceptor)
    async resetPassword(@Body() updateUserDto: ResetPasswordDto, @CurrentUser() authUser, @Res() res, @Req() req) {
        return res.sendSuccess(await this.authService.resetPassword(updateUserDto, authUser, req));
    }

    // ==========================================
    // PASSKEY / WEBAUTHN BIOMETRIC ENDPOINTS
    // ==========================================

    @Get('passkey/register-options')
    @UseGuards(AuthGuard)
    @UseInterceptors(CurrentUserInterceptor)
    async passkeyRegisterOptions(@CurrentUser() authUser, @Res() res) {
        return res.sendSuccess(await this.authService.passkeyRegisterOptions(authUser));
    }

    @Post('passkey/register-verify')
    @UseGuards(AuthGuard)
    @UseInterceptors(CurrentUserInterceptor)
    async passkeyRegisterVerify(@CurrentUser() authUser, @Body() dto: any, @Headers('user-agent') userAgent: string, @Res() res) {
        const parser = new UAParserLib.UAParser(userAgent);
        const result = parser.getResult();
        return res.sendSuccess(await this.authService.passkeyRegisterVerify(authUser, dto, result));
    }

    @Get('passkey/devices')
    @UseGuards(AuthGuard)
    @UseInterceptors(CurrentUserInterceptor)
    async passkeyGetDevices(@CurrentUser() authUser, @Res() res) {
        return res.sendSuccess(await this.authService.passkeyGetDevices(authUser));
    }

    @Delete('passkey/devices/:id')
    @UseGuards(AuthGuard)
    @UseInterceptors(CurrentUserInterceptor)
    async passkeyDeleteDevice(@CurrentUser() authUser, @Param('id') id: string, @Res() res) {
        return res.sendSuccess(await this.authService.passkeyDeleteDevice(authUser, parseInt(id, 10)));
    }

    @Get('passkey/login-options')
    async passkeyLoginOptions(@Query('username') username: string, @Res() res) {
        return res.sendSuccess(await this.authService.passkeyLoginOptions(username));
    }

    @Post('passkey/login-verify')
    async passkeyLoginVerify(@Body() dto: any, @Headers('user-agent') userAgent: string, @Req() req: any, @Res() res) {
        const parser = new UAParserLib.UAParser(userAgent);
        const result = parser.getResult();
        try {
            const data = await this.authService.passkeyLoginVerify(dto, result);
            const payload: any = data?.access_token ? this.jwtService.decode(data.access_token) : null;
            void this.audit.log({
                userId: payload?.id ? Number(payload.id) : undefined,
                userName: payload?.username,
                action: 'LOGIN_PASSKEY',
                entity: 'auth',
                meta: { outcome: 'SUCCESS' },
                ip: req?.ip
            });
            return res.sendSuccess(data);
        } catch (e: any) {
            void this.audit.log({
                action: 'LOGIN_PASSKEY',
                entity: 'auth',
                meta: { outcome: 'ERROR', message: e?.message || 'Login biometrik gagal' },
                ip: req?.ip
            });
            throw e;
        }
    }
}
