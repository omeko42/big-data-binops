// mail.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { SMTPClient } from 'emailjs';
import { DataSource } from 'typeorm';

type SmtpConfig = { user: string; password: string; host: string; port: number; ssl: boolean; from: string };

// Sama persis dgn key yg dipakai SystemSettingService (system-setting.service.ts) -- baca lgs lewat
// DataSource (bukan inject SystemSettingService) krn MailService dideklarasikan sbg provider di
// beberapa module berbeda (AuthModule, ReportModule, BareskrimOrganisasi module) yg tidak semuanya
// mengimpor SystemSettingService -- DataSource dari TypeOrmModule.forRoot() bersifat @Global(),
// jadi aman dipakai di module manapun tanpa wiring tambahan.
const SMTP_KEYS = ['smtp_enabled', 'smtp_host', 'smtp_port', 'smtp_ssl', 'smtp_user', 'smtp_password', 'smtp_from'];

@Injectable()
export class MailService {
    private settingsTableReady = false;
    constructor(private readonly dataSource: DataSource) {}

    private async ensureSettingsTable() {
        if (this.settingsTableReady) return;
        await this.dataSource.query(`
            create table if not exists bdb_system_settings (
                key text primary key,
                value text,
                updated_at timestamptz not null default now(),
                updated_by bigint references auth_users(id) on delete set null
            )`);
        this.settingsTableReady = true;
    }

    private async getDbSmtpSettings(): Promise<Record<string, string>> {
        await this.ensureSettingsTable();
        const rows = await this.dataSource.query('select key, value from bdb_system_settings where key = any($1)', [SMTP_KEYS]);
        const map: Record<string, string> = {};
        for (const r of rows) map[r.key] = r.value;
        return map;
    }

    /**
     * Konfigurasi SMTP AKTIF -- database (halaman Pengaturan Sistem > Email) kalau smtp_enabled='true',
     * kalau tidak fallback ke env EMAIL_* (perilaku lama, tetap jalan tanpa perlu setup apa pun).
     * Dibangun ulang tiap kirim (bukan di-cache di constructor) supaya perubahan dari halaman
     * pengaturan langsung berlaku tanpa restart server.
     */
    private async resolveConfig(): Promise<SmtpConfig> {
        const db = await this.getDbSmtpSettings();
        if (db.smtp_enabled === 'true' && db.smtp_host) {
            return {
                user: db.smtp_user || '',
                password: db.smtp_password || '',
                host: db.smtp_host,
                port: parseInt(db.smtp_port || '25', 10),
                ssl: db.smtp_ssl === 'true',
                from: db.smtp_from || db.smtp_user || 'noreply@example.com'
            };
        }
        return {
            user: process.env.EMAIL_USER || '',
            password: process.env.EMAIL_PASSWORD || '',
            host: process.env.EMAIL_HOST || 'localhost',
            port: parseInt(process.env.EMAIL_PORT || '25', 10),
            ssl: process.env.EMAIL_SSL === 'true',
            from: process.env.EMAIL_USER || 'noreply@example.com'
        };
    }

    async sendEmail(to: string, subject: string, text: string, htmlContent: string) {
        const cfg = await this.resolveConfig();
        const client = new SMTPClient({ user: cfg.user, password: cfg.password, host: cfg.host, port: cfg.port, ssl: cfg.ssl });
        try {
            return await client.sendAsync({
                from: cfg.from,
                to: to,
                subject: subject,
                text: text,
                attachment: [
                    {
                        data: htmlContent,
                        alternative: true
                    }
                ]
            });
        } catch (error) {
            throw new BadRequestException({
                message: 'Bad Request',
                errors: 'gagal kirim email, koneksi server email tidak tersambung silahkan coba lagi'
            });
        }
    }

    /**
     * Uji kirim dari halaman Pengaturan Sistem > Email -- pakai nilai draft yg sedang diketik user
     * (belum tentu tersimpan), bukan config aktif. password kosong = pakai password tersimpan di DB
     * (supaya tak perlu ketik ulang password cuma buat tes). Error asli ditampilkan (bukan digeneralisir)
     * krn endpoint ini khusus diagnosa superadmin, bukan alur pengguna umum.
     *
     * `to` WAJIB diisi eksplisit oleh user (ditemukan lewat investigasi laporan user "test bilang
     * tersambung tapi email tak pernah sampai" -- sebelum ini tujuan diam2 fallback ke `from`, dan
     * `from` sendiri diam2 fallback ke `user` (username SMTP auth, mis. "cas.bareskrim.polri.go.id"
     * -- BUKAN alamat kotak surat yg valid/bisa dicek) kalau field "From" dikosongkan. Transaksi SMTP
     * bisa saja diterima server (tak ada error), tapi email tak pernah nyampe ke mana pun yg bisa
     * dicek krn alamat tujuannya bukan mailbox sungguhan -- membingungkan & sulit didiagnosa.
     */
    async sendTestEmail(draft: { host: string; port: string; ssl: string; user: string; password?: string; from?: string; to?: string }) {
        let password = draft.password || '';
        if (!password) {
            const stored = await this.getDbSmtpSettings();
            password = stored.smtp_password || '';
        }
        const from = draft.from?.trim() || draft.user;
        const to = draft.to?.trim();
        if (!draft.host?.trim() || !to) {
            throw new BadRequestException({ message: 'Bad Request', errors: 'Isi SMTP Host & "Kirim Test Ke" (alamat email yang bisa Anda cek) dulu sebelum tes kirim.' });
        }
        const client = new SMTPClient({
            user: draft.user || '',
            password,
            host: draft.host.trim(),
            port: parseInt(draft.port || '25', 10),
            ssl: draft.ssl === 'true'
        });
        try {
            await client.sendAsync({
                from,
                to,
                subject: 'Uji Coba SMTP - BDB',
                text: 'Email ini dikirim otomatis untuk menguji konfigurasi SMTP BDB.',
                attachment: [{ data: '<p>Email ini dikirim otomatis untuk menguji konfigurasi SMTP BDB.</p>', alternative: true }]
            });
        } catch (error: any) {
            throw new BadRequestException({ message: 'Bad Request', errors: 'Gagal kirim: ' + (error?.message || 'koneksi SMTP gagal -- cek host/port/SSL/kredensial.') });
        }
        return { to };
    }

    createOtpEmail(otp: string): string {
        return `
                <html>
                  <body style="font-family: Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 0;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f6f8; padding: 40px 0;">
                      <tr>
                        <td align="center">
                          <table width="400" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 30px;">
                            <tr>
                              <td style="text-align: center;">
                                <h1 style="color: #333333; margin-bottom: 10px;">Your OTP Code</h1>
                                <p style="font-size: 16px; color: #555555; margin-top: 0;">Your verification code is</p>
                                <p style="font-size: 32px; font-weight: bold; color: #007BFF; margin: 10px 0;">${otp}</p>
                                <p style="font-size: 14px; color: #888888; margin-top: 20px;">This code will expire in <strong>10 minutes</strong>.</p>
                                <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0;">
                                <p style="font-size: 12px; color: #aaaaaa;">If you did not request this code, please ignore this email.</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </body>
                </html>
                `;
    }

    /** Kredensial login (dipakai user baru dari Import Massal & fitur reset password + kirim email). */
    createCredentialEmail(name: string, loginId: string, password: string): string {
        return `
                <html>
                  <body style="font-family: Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 0;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f6f8; padding: 40px 0;">
                      <tr>
                        <td align="center">
                          <table width="440" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 30px;">
                            <tr>
                              <td style="text-align: center;">
                                <h1 style="color: #333333; margin-bottom: 6px; font-size: 20px;">BIG DATA BINOPS</h1>
                                <p style="font-size: 15px; color: #555555; margin-top: 0;">Halo ${name || 'Pengguna'}, berikut kredensial login akun Anda</p>
                                <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0; text-align: left; background-color: #f8fafc; border-radius: 6px; padding: 16px;">
                                  <tr><td style="font-size: 13px; color: #64748b; padding: 4px 0;">Login (email/username)</td></tr>
                                  <tr><td style="font-size: 16px; font-weight: bold; color: #0f172a; padding-bottom: 10px;">${loginId}</td></tr>
                                  <tr><td style="font-size: 13px; color: #64748b; padding: 4px 0;">Password</td></tr>
                                  <tr><td style="font-size: 20px; font-weight: bold; color: #007BFF;">${password}</td></tr>
                                </table>
                                <p style="font-size: 13px; color: #888888;">Segera login dan ganti password ini. Jangan bagikan email ini ke siapa pun.</p>
                                <hr style="border: none; border-top: 1px solid #eeeeee; margin: 24px 0;">
                                <p style="font-size: 12px; color: #aaaaaa;">Jika Anda tidak merasa meminta ini, segera hubungi admin sistem BDB di instansi Anda.</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </body>
                </html>
                `;
    }

    InviteMemberEmailTemplate(inviteUrl: string, orgName: string = 'Your Team'): string {
        return `
    <html>
  <body style="font-family: Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f6f8; padding: 40px 0;">
      <tr>
        <td align="center">
          <table width="480" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 30px;">
            <tr>
              <td style="text-align: center;">
                <h2 style="color: #333333; margin-bottom: 10px;">You're Invited to Join ${orgName}</h2>
                <p style="font-size: 16px; color: #555555; margin-top: 0;">Someone has invited you to become a member of <strong>${orgName}</strong>.</p>
                <p style="font-size: 16px; color: #555555;">Click the button below to accept the invitation and join the team:</p>
                <a href="${inviteUrl}" style="display: inline-block; background-color: #007BFF; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; padding: 12px 24px; border-radius: 5px; margin: 20px 0;">
                  Join Now
                </a>
                <p style="font-size: 14px; color: #888888; margin-top: 20px;">
                  If the button above doesn’t work, you can copy and paste this link into your browser:
                </p>
                <p style="font-size: 14px; color: #555555; word-break: break-all; margin: 10px 0;">
                  <a href="${inviteUrl}" style="color: #007BFF;">${inviteUrl}</a>
                </p>
                <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0;">
                <p style="font-size: 12px; color: #aaaaaa;">We look forward to having you on the team.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>

  `;
    }
}
