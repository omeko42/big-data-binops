import fs from 'fs';

let authCode = fs.readFileSync('auth.service.ts', 'utf8');

const targetMethod = `private async createSecurityOtp(user: User, action: string, targetChoice?: string) {`;

const rateLimitingCode = `private otpRateLimits = new Map<string, { lastSentAt: number; attempts: number; windowStart: number }>();

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
                message: \`Tunggu \${waitSeconds} detik sebelum meminta kode OTP kembali.\`,
                errors: { otp: [\`Tunggu \${waitSeconds} detik sebelum meminta kode OTP kembali.\`] }
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
        const rateLimitKey = \`sec_otp:\${user.id}:\${action}\`;
        this.checkOtpRateLimit(rateLimitKey);`;

if (!authCode.includes(targetMethod)) {
  console.error('targetMethod createSecurityOtp not found in auth.service.ts');
  process.exit(1);
}

authCode = authCode.replace(targetMethod, rateLimitingCode);

// Also in validateSecurityOtp on success, clear the rate limit:
const oldValSuccess = `return payload;
    }

    private validatePinFormat`;

const newValSuccess = `this.clearOtpRateLimit(\`sec_otp:\${user.id}:\${action}\`);
        return payload;
    }

    private validatePinFormat`;

if (!authCode.includes(oldValSuccess)) {
  console.error('oldValSuccess not found in auth.service.ts');
  process.exit(1);
}
authCode = authCode.replace(oldValSuccess, newValSuccess);

fs.writeFileSync('auth.service.ts', authCode, 'utf8');
console.log('auth.service.ts updated successfully with OTP rate limiting.');
