import * as crypto from 'crypto';

/**
 * Captcha proof-of-work (self-hosted, TANPA layanan pihak ketiga & TANPA gambar).
 *
 * Model "Saya bukan robot" tanpa tantangan visual: saat user mengklik kotak,
 * browser menghitung sebuah `nonce` sehingga sha256(prefix + ":" + nonce) memiliki
 * sejumlah bit-nol di depan (proof-of-work). Perhitungan ini murah untuk satu kali
 * login manusia (sub-detik) namun memberatkan bila di-otomasi massal oleh bot.
 *
 * Tantangan bersifat STATELESS & tak bisa dipalsukan: prefix + difficulty + kedaluwarsa
 * ditandatangani HMAC-SHA256 memakai CAPTCHA_SECRET. Kompatibel dengan interface lama:
 *   `id` -> captcha_id (token tertandatangani), `captcha` -> nonce (hasil PoW).
 */

const TTL_MS = 5 * 60 * 1000; // 5 menit
const DIFFICULTY_BITS = 20; // ~1 juta percobaan rata-rata (~0,5-2 detik di browser, jauh lbh mahal utk bot massal drpd 16-bit)

function secret(): string {
    return process.env.CAPTCHA_SECRET || 'default_secret_key';
}
function b64url(data: string | Buffer): string {
    return Buffer.from(data).toString('base64url');
}
function sign(body: string): string {
    return crypto.createHmac('sha256', secret()).update(body).digest('base64url');
}

export interface PowCaptcha {
    id: string; // token tertandatangani (captcha_id)
    prefix: string; // string acak yang harus di-hash bersama nonce
    difficulty: number; // jumlah bit-nol di depan yang wajib dipenuhi
    algo: string; // 'sha256'
    mode: string; // 'pow'
    expired_at: string;
}

export function generatePowCaptcha(): PowCaptcha {
    const prefix = crypto.randomBytes(16).toString('hex');
    const expiredAt = Date.now() + TTL_MS;
    const body = b64url(JSON.stringify({ p: prefix, d: DIFFICULTY_BITS, e: expiredAt }));
    return {
        id: `${body}.${sign(body)}`,
        prefix,
        difficulty: DIFFICULTY_BITS,
        algo: 'sha256',
        mode: 'pow',
        expired_at: new Date(expiredAt).toISOString()
    };
}

/** Hitung jumlah bit-nol di depan sebuah digest hex. */
function leadingZeroBits(hex: string): number {
    let bits = 0;
    for (const ch of hex) {
        const v = parseInt(ch, 16);
        if (v === 0) {
            bits += 4;
            continue;
        }
        if (v < 2) bits += 3;
        else if (v < 4) bits += 2;
        else if (v < 8) bits += 1;
        break;
    }
    return bits;
}

export function verifyPowCaptcha(id: string, nonce: string | number): boolean {
    try {
        if (!id || nonce === undefined || nonce === null || nonce === '') return false;
        const [body, sig] = String(id).split('.');
        if (!body || !sig) return false;
        // verifikasi tanda tangan (timing-safe)
        const expected = sign(body);
        const a = new Uint8Array(Buffer.from(sig));
        const b = new Uint8Array(Buffer.from(expected));
        if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
        const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
        if (typeof payload.e !== 'number' || Date.now() > payload.e) return false;
        const difficulty = Number(payload.d) || DIFFICULTY_BITS;
        const digest = crypto.createHash('sha256').update(`${payload.p}:${String(nonce)}`).digest('hex');
        return leadingZeroBits(digest) >= difficulty;
    } catch {
        return false;
    }
}
