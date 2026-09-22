import * as crypto from 'crypto';

// Obfuscasi ID numerik -> token opaque (URL-safe) agar tak bisa dienumerasi/di-jump.
// Deterministik (token stabil per-id, bisa di-bookmark), reversible hanya di server (butuh secret).
function key(): Buffer {
    const secret = process.env.ID_SECRET || process.env.CAPTCHA_SECRET || 'default_secret_key';
    return crypto.createHash('sha256').update(secret).digest(); // 32 byte
}
function iv(k: Buffer): Buffer {
    return crypto.createHash('sha256').update(Buffer.concat([k, Buffer.from('lp-id-iv')])).digest().subarray(0, 16);
}

/** id numerik -> token opaque (base64url). */
export function encodeId(id: number | string): string {
    const k = key();
    const cipher = crypto.createCipheriv('aes-256-cbc', new Uint8Array(k), new Uint8Array(iv(k)));
    const enc = Buffer.concat([cipher.update(String(id), 'utf8'), cipher.final()]);
    return enc.toString('base64url');
}

/** token opaque -> id numerik (atau null bila tak valid). Menerima juga id numerik mentah utk kompatibilitas internal. */
export function decodeId(token: string): number | null {
    if (!token) return null;
    try {
        const k = key();
        const decipher = crypto.createDecipheriv('aes-256-cbc', new Uint8Array(k), new Uint8Array(iv(k)));
        const dec = Buffer.concat([decipher.update(new Uint8Array(Buffer.from(token, 'base64url'))), decipher.final()]).toString('utf8');
        const n = parseInt(dec, 10);
        return Number.isInteger(n) && n > 0 ? n : null;
    } catch {
        return null;
    }
}
