"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeId = encodeId;
exports.decodeId = decodeId;
const crypto = require("crypto");
function key() {
    const secret = process.env.ID_SECRET || process.env.CAPTCHA_SECRET || 'default_secret_key';
    return crypto.createHash('sha256').update(secret).digest();
}
function iv(k) {
    return crypto.createHash('sha256').update(Buffer.concat([k, Buffer.from('lp-id-iv')])).digest().subarray(0, 16);
}
function encodeId(id) {
    const k = key();
    const cipher = crypto.createCipheriv('aes-256-cbc', new Uint8Array(k), new Uint8Array(iv(k)));
    const enc = Buffer.concat([cipher.update(String(id), 'utf8'), cipher.final()]);
    return enc.toString('base64url');
}
function decodeId(token) {
    if (!token)
        return null;
    try {
        const k = key();
        const decipher = crypto.createDecipheriv('aes-256-cbc', new Uint8Array(k), new Uint8Array(iv(k)));
        const dec = Buffer.concat([decipher.update(new Uint8Array(Buffer.from(token, 'base64url'))), decipher.final()]).toString('utf8');
        const n = parseInt(dec, 10);
        if (Number.isInteger(n) && n > 0)
            return n;
    }
    catch {
    }
    const raw = String(token).trim();
    if (/^\d+$/.test(raw)) {
        const n = parseInt(raw, 10);
        return Number.isInteger(n) && n > 0 ? n : null;
    }
    return null;
}
//# sourceMappingURL=id-cipher.util.js.map