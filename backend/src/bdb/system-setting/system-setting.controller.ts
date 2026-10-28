import { Body, Controller, ForbiddenException, Get, Patch, Post, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@app_core/auth/auth.guard';
import { CurrentUserInterceptor } from '@app_core/helper/interceptor/current-user.interceptor';
import { MailService } from '@app_core/helper/service/mail.service';
import { SystemSettingService } from './system-setting.service';
import { AuditService } from '../audit/audit.service';

@UseGuards(AuthGuard)
@UseInterceptors(CurrentUserInterceptor)
@Controller('bdb/system-setting')
export class SystemSettingController {
    constructor(
        private readonly service: SystemSettingService,
        private readonly mail: MailService,
        private readonly audit: AuditService
    ) {}

    private assertAdmin(user: any) {
        const role = String(user?.role_bdb || user?.role_name || '').toLowerCase();
        if (!['superadmin', 'admin_binops', 'vendor_mitra', 'vendor', 'mitra'].includes(role)) {
            throw new ForbiddenException('Hanya Superadmin atau Admin Binops yang memiliki akses ke pengaturan sistem.');
        }
    }

    @Get('login-otp')
    async getLoginOtp(@Req() req: any, @Res() res) {
        this.assertAdmin(req.user);
        return res.sendSuccess(await this.service.getLoginOtpSetting());
    }

    @Patch('login-otp')
    async setLoginOtp(@Req() req: any, @Body() body: { enabled?: boolean }, @Res() res) {
        this.assertAdmin(req.user);
        return res.sendSuccess(await this.service.setLoginOtpSetting(req.user, Boolean(body?.enabled)));
    }

    @Get('maintenance')
    async getMaintenance(@Req() req: any, @Res() res) {
        this.assertAdmin(req.user);
        return res.sendSuccess(await this.service.getPublicMaintenanceStatus());
    }

    @Patch('maintenance')
    async setMaintenance(@Req() req: any, @Body() body: { enabled?: boolean; message?: string }, @Res() res) {
        this.assertAdmin(req.user);
        return res.sendSuccess(await this.service.setMaintenanceStatus(req.user, Boolean(body?.enabled), body?.message));
    }

    @Get('pusat-bantuan')
    async getPusatBantuan(@Res() res) {
        return res.sendSuccess(await this.service.getPusatBantuan());
    }

    @Patch('pusat-bantuan')
    async setPusatBantuan(@Req() req: any, @Body() body: { telp1?: string; telp2?: string; email?: string }, @Res() res) {
        this.assertAdmin(req.user);
        return res.sendSuccess(await this.service.setPusatBantuan(req.user, body || {}));
    }

    /** Konfigurasi SMTP -- dipakai halaman Pengaturan Sistem > Email. Password tidak pernah dikirim balik. */
    @Get('smtp')
    async getSmtp(@Req() req: any, @Res() res) {
        this.assertAdmin(req.user);
        return res.sendSuccess(await this.service.getSmtpConfig());
    }

    @Patch('smtp')
    async setSmtp(@Req() req: any, @Body() body: { enabled?: boolean; host?: string; port?: string; ssl?: string; user?: string; from?: string; password?: string }, @Res() res) {
        this.assertAdmin(req.user);
        return res.sendSuccess(await this.service.setSmtpConfig(req.user, body || {}));
    }

    /** Uji kirim pakai nilai draft di form (belum tentu tersimpan) -- password kosong = pakai yang tersimpan di DB.
     *  Dicatat manual ke Log Audit (entity 'email_smtp', sama spt setSmtp() di atas) -- rute
     *  '/bdb/system-setting' ada di SKIP_PATH_PARTS GlobalAuditInterceptor, jadi TAK otomatis
     *  kecatat kalau tak ditulis manual di sini. Berguna sbg jejak diagnosa (siapa tes kirim ke
     *  mana, kapan, berhasil/gagal & alasannya) -- ditambah stlh investigasi laporan user soal
     *  email SMTP gagal terkirim. */
    @Post('smtp/test')
    async testSmtp(@Req() req: any, @Body() body: { host?: string; port?: string; ssl?: string; user?: string; password?: string; from?: string; to?: string }, @Res() res) {
        try {
            const result = await this.mail.sendTestEmail({ host: body?.host || '', port: body?.port || '', ssl: body?.ssl || 'true', user: body?.user || '', password: body?.password, from: body?.from, to: body?.to });
            await this.audit.log({
                user: req.user,
                action: 'TEST_SEND',
                entity: 'email_smtp',
                entityId: 'smtp_config',
                meta: { host: body?.host, user: body?.user, from: body?.from, to: body?.to },
                outcome: 'SUCCESS'
            });
            return res.sendSuccess(result);
        } catch (e: any) {
            await this.audit.log({
                user: req.user,
                action: 'TEST_SEND',
                entity: 'email_smtp',
                entityId: 'smtp_config',
                meta: { host: body?.host, user: body?.user, from: body?.from, to: body?.to, error: e?.response?.errors || e?.message },
                outcome: 'ERROR'
            });
            throw e;
        }
    }
}
