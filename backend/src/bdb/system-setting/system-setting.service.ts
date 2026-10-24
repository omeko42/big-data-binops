import { ForbiddenException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AuditService } from '../audit/audit.service';

/** Kunci pengaturan wajib-tidaknya OTP email saat login -- berlaku utk SEMUA akun sekaligus. */
const LOGIN_OTP_KEY = 'login_email_otp_required';
/** Kunci mode maintenance -- kalau aktif, semua akun SELAIN superadmin diblokir masuk/pakai sistem. */
const MAINTENANCE_KEY = 'maintenance_mode_enabled';
const MAINTENANCE_MSG_KEY = 'maintenance_message';
const DEFAULT_MAINTENANCE_MSG = 'Sistem sedang dalam pemeliharaan (maintenance). Silakan coba lagi beberapa saat lagi.';
/** Kontak Pusat Bantuan -- ditampilkan di halaman login/OTP/PIN/dll biar pengguna yg terkendala auth tahu harus hubungi siapa. */
const HELP_TELP1_KEY = 'pusat_bantuan_telp1';
const HELP_TELP2_KEY = 'pusat_bantuan_telp2';
const HELP_EMAIL_KEY = 'pusat_bantuan_email';
/** Konfigurasi SMTP -- kalau smtp_enabled='true', MailService pakai nilai2 ini (bukan env EMAIL_*).
 *  Default kosong/false = perilaku lama tetap jalan (fallback ke process.env.EMAIL_*), lihat MailService. */
const SMTP_ENABLED_KEY = 'smtp_enabled';
const SMTP_HOST_KEY = 'smtp_host';
const SMTP_PORT_KEY = 'smtp_port';
const SMTP_SSL_KEY = 'smtp_ssl';
const SMTP_USER_KEY = 'smtp_user';
const SMTP_PASSWORD_KEY = 'smtp_password';
const SMTP_FROM_KEY = 'smtp_from';

/**
 * Pengaturan sistem global (key-value), dikontrol superadmin & admin_binops.
 * Akun operator/viewer hanya mengikuti nilainya -- tidak ada toggle per-akun.
 */
@Injectable()
export class SystemSettingService {
    private ready = false;
    constructor(
        private readonly dataSource: DataSource,
        private readonly audit: AuditService
    ) {}

    private async ensureTable() {
        if (this.ready) return;
        await this.dataSource.query(`
            create table if not exists bdb_system_settings (
                key text primary key,
                value text,
                updated_at timestamptz not null default now(),
                updated_by bigint references auth_users(id) on delete set null
            )`);
        this.ready = true;
    }

    private assertSuperadmin(authUser: any) {
        const role = String(authUser?.role_bdb || '').toLowerCase();
        if (role !== 'superadmin' && role !== 'admin_binops') {
            throw new ForbiddenException('Hanya superadmin/admin binops yang dapat mengubah pengaturan ini.');
        }
    }

    /** Lebih ketat dari assertSuperadmin -- khusus mode maintenance, hanya superadmin (bukan admin_binops) yg boleh kontrol. */
    private assertSuperadminOnly(authUser: any) {
        const role = String(authUser?.role_bdb || '').toLowerCase();
        if (role !== 'superadmin') {
            throw new ForbiddenException('Hanya superadmin yang dapat mengubah mode maintenance.');
        }
    }

    async getValue(key: string): Promise<string | null> {
        await this.ensureTable();
        const rows = await this.dataSource.query('select value from bdb_system_settings where key = $1', [key]);
        return rows.length ? rows[0].value : null;
    }

    private async setValue(key: string, value: string, authUser: any) {
        await this.ensureTable();
        await this.dataSource.query(
            `insert into bdb_system_settings (key, value, updated_at, updated_by)
             values ($1, $2, now(), $3)
             on conflict (key) do update set value = excluded.value, updated_at = now(), updated_by = excluded.updated_by`,
            [key, value, authUser?.id ? Number(authUser.id) : null]
        );
    }

    /** Dipanggil AuthService.signIn() -- true berarti SEMUA akun wajib OTP email saat login. */
    async isLoginOtpRequired(): Promise<boolean> {
        return (await this.getValue(LOGIN_OTP_KEY)) === 'true';
    }

    async getLoginOtpSetting() {
        return { enabled: await this.isLoginOtpRequired() };
    }

    async setLoginOtpSetting(authUser: any, enabled: boolean) {
        this.assertSuperadmin(authUser);
        await this.setValue(LOGIN_OTP_KEY, enabled ? 'true' : 'false', authUser);
        await this.audit.log({
            user: authUser,
            action: enabled ? 'ENABLE' : 'DISABLE',
            entity: 'system_setting',
            entityId: LOGIN_OTP_KEY,
            meta: { setting: LOGIN_OTP_KEY, enabled }
        });
        return { enabled };
    }

    /** true = mode maintenance aktif, SEMUA akun selain superadmin diblokir. Dipanggil AuthService.signIn() & endpoint publik status. */
    async isMaintenanceEnabled(): Promise<boolean> {
        return (await this.getValue(MAINTENANCE_KEY)) === 'true';
    }

    /** Status publik (tanpa auth) -- dipakai halaman /maintenance & guard frontend utk cek tanpa perlu login. */
    async getPublicMaintenanceStatus() {
        const enabled = await this.isMaintenanceEnabled();
        const message = (await this.getValue(MAINTENANCE_MSG_KEY)) || DEFAULT_MAINTENANCE_MSG;
        return { enabled, message };
    }

    async setMaintenanceStatus(authUser: any, enabled: boolean, message?: string) {
        this.assertSuperadminOnly(authUser);
        await this.setValue(MAINTENANCE_KEY, enabled ? 'true' : 'false', authUser);
        if (message !== undefined) {
            await this.setValue(MAINTENANCE_MSG_KEY, message.trim() || DEFAULT_MAINTENANCE_MSG, authUser);
        }
        await this.audit.log({
            user: authUser,
            action: enabled ? 'ENABLE' : 'DISABLE',
            entity: 'system_setting',
            entityId: MAINTENANCE_KEY,
            meta: { setting: MAINTENANCE_KEY, enabled, message }
        });
        return this.getPublicMaintenanceStatus();
    }

    /** Publik (tanpa auth) -- dipakai footer bantuan di halaman login/OTP/PIN/TOTP/forgot-password. */
    async getPusatBantuan() {
        const [telp1, telp2, email] = await Promise.all([this.getValue(HELP_TELP1_KEY), this.getValue(HELP_TELP2_KEY), this.getValue(HELP_EMAIL_KEY)]);
        return { telp1: telp1 || '', telp2: telp2 || '', email: email || '' };
    }

    async setPusatBantuan(authUser: any, data: { telp1?: string; telp2?: string; email?: string }) {
        this.assertSuperadmin(authUser);
        if (data.telp1 !== undefined) await this.setValue(HELP_TELP1_KEY, data.telp1.trim(), authUser);
        if (data.telp2 !== undefined) await this.setValue(HELP_TELP2_KEY, data.telp2.trim(), authUser);
        if (data.email !== undefined) await this.setValue(HELP_EMAIL_KEY, data.email.trim(), authUser);
        await this.audit.log({
            user: authUser,
            action: 'UPDATE',
            entity: 'system_setting',
            entityId: 'pusat_bantuan',
            meta: data
        });
        return this.getPusatBantuan();
    }

    /** Dipakai internal MailService -- termasuk password mentah, JANGAN diekspos lewat controller apa pun. */
    async getSmtpConfigInternal() {
        const [enabled, host, port, ssl, user, password, from] = await Promise.all([
            this.getValue(SMTP_ENABLED_KEY),
            this.getValue(SMTP_HOST_KEY),
            this.getValue(SMTP_PORT_KEY),
            this.getValue(SMTP_SSL_KEY),
            this.getValue(SMTP_USER_KEY),
            this.getValue(SMTP_PASSWORD_KEY),
            this.getValue(SMTP_FROM_KEY)
        ]);
        return {
            enabled: enabled === 'true',
            host: host || '',
            port: port || '',
            ssl: ssl === null ? 'true' : ssl,
            user: user || '',
            password: password || '',
            from: from || ''
        };
    }

    /** Versi utk halaman Pengaturan Sistem -- password TIDAK dikirim balik, cuma flag has_password. */
    async getSmtpConfig() {
        const cfg = await this.getSmtpConfigInternal();
        const { password, ...rest } = cfg;
        return { ...rest, has_password: !!password };
    }

    async setSmtpConfig(authUser: any, data: { enabled?: boolean; host?: string; port?: string; ssl?: string; user?: string; from?: string; password?: string }) {
        this.assertSuperadmin(authUser);
        if (data.enabled !== undefined) await this.setValue(SMTP_ENABLED_KEY, data.enabled ? 'true' : 'false', authUser);
        if (data.host !== undefined) await this.setValue(SMTP_HOST_KEY, data.host.trim(), authUser);
        if (data.port !== undefined) await this.setValue(SMTP_PORT_KEY, data.port.trim(), authUser);
        if (data.ssl !== undefined) await this.setValue(SMTP_SSL_KEY, data.ssl === 'true' ? 'true' : 'false', authUser);
        if (data.user !== undefined) await this.setValue(SMTP_USER_KEY, data.user.trim(), authUser);
        if (data.from !== undefined) await this.setValue(SMTP_FROM_KEY, data.from.trim(), authUser);
        // password kosong/tidak dikirim = biarkan yang tersimpan sebelumnya (jangan ditimpa kosong)
        if (data.password) await this.setValue(SMTP_PASSWORD_KEY, data.password, authUser);
        await this.audit.log({
            user: authUser,
            action: 'UPDATE',
            // entity 'email_smtp' (bukan 'system_setting' spt setting lain) SENGAJA -- biar bisa
            // difilter terpisah di Log Audit khusus aktivitas email (simpan config + test kirim,
            // lihat testSmtp() di system-setting.controller.ts), diminta user setelah insiden
            // diagnosa SMTP gagal terkirim sesi ini.
            entity: 'email_smtp',
            entityId: 'smtp_config',
            meta: { ...data, password: data.password ? '(diubah)' : undefined }
        });
        return this.getSmtpConfig();
    }
}
