import { BadRequestException, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Client } from 'minio';
import { randomUUID } from 'crypto';

export interface UploadedFileLike {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
    size: number;
}

const FORBIDDEN_EXTENSIONS = new Set([
    'php', 'phtml', 'php3', 'php4', 'php5', 'php7', 'phps', 'phar', 'pht', 'pgif',
    'jsp', 'jspx', 'jsw', 'jsv', 'jspf', 'war', 'ear', 'jar', 'class',
    'asp', 'aspx', 'asa', 'asax', 'ascx', 'ashx', 'asmx', 'cer', 'aSp',
    'exe', 'dll', 'so', 'dylib', 'bin', 'elf', 'msi', 'com', 'scr', 'hta', 'cpl', 'msc',
    'bat', 'cmd', 'ps1', 'psm1', 'vbs', 'vbe', 'ws', 'wsf', 'wsc', 'wsh',
    'sh', 'bash', 'zsh', 'ksh', 'csh', 'run', 'out',
    'py', 'pyc', 'pyo', 'rb', 'pl', 'pm', 'cgi', 'fcgi', 'lua', 'tcl',
    'js', 'mjs', 'cjs', 'ts', 'tsx', 'jsx', 'vue', 'svelte',
    'html', 'htm', 'xhtml', 'shtml', 'svg', 'svgz', 'xml', 'xsl', 'xslt',
    'htaccess', 'htpasswd', 'ini', 'conf', 'config', 'env', 'reg', 'lnk', 'inf'
]);

const ALLOWED_EXTENSION_SIGNATURES: Record<string, { mime: string; check: (buf: Buffer) => boolean }> = {
    pdf: {
        mime: 'application/pdf',
        check: (b) => b.length >= 5 && b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46 && b[4] === 0x2d // %PDF-
    },
    jpg: {
        mime: 'image/jpeg',
        check: (b) => b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff
    },
    jpeg: {
        mime: 'image/jpeg',
        check: (b) => b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff
    },
    png: {
        mime: 'image/png',
        check: (b) =>
            b.length >= 8 &&
            b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 &&
            b[4] === 0x0d && b[5] === 0x0a && b[6] === 0x1a && b[7] === 0x0a
    },
    gif: {
        mime: 'image/gif',
        check: (b) =>
            b.length >= 6 &&
            b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38 &&
            (b[4] === 0x37 || b[4] === 0x39) && b[5] === 0x61
    },
    webp: {
        mime: 'image/webp',
        check: (b) =>
            b.length >= 12 &&
            b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
            b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50
    },
    mp4: {
        mime: 'video/mp4',
        check: (b) =>
            b.length >= 12 &&
            b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70 // ....ftyp
    },
    m4v: {
        mime: 'video/mp4',
        check: (b) => b.length >= 12 && b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70
    },
    mov: {
        mime: 'video/quicktime',
        check: (b) =>
            b.length >= 12 &&
            ((b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70) ||
             (b[4] === 0x6d && b[5] === 0x6f && b[6] === 0x6f && b[7] === 0x76) ||
             (b[4] === 0x77 && b[5] === 0x69 && b[6] === 0x64 && b[7] === 0x65) ||
             (b[4] === 0x6d && b[5] === 0x64 && b[6] === 0x61 && b[7] === 0x74))
    },
    webm: {
        mime: 'video/webm',
        check: (b) => b.length >= 4 && b[0] === 0x1a && b[1] === 0x45 && b[2] === 0xdf && b[3] === 0xa3
    },
    xlsx: {
        mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        check: (b) => b.length >= 4 && b[0] === 0x50 && b[1] === 0x4b && b[2] === 0x03 && b[3] === 0x04
    },
    docx: {
        mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        check: (b) => b.length >= 4 && b[0] === 0x50 && b[1] === 0x4b && b[2] === 0x03 && b[3] === 0x04
    },
    pptx: {
        mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        check: (b) => b.length >= 4 && b[0] === 0x50 && b[1] === 0x4b && b[2] === 0x03 && b[3] === 0x04
    },
    xls: {
        mime: 'application/vnd.ms-excel',
        check: (b) =>
            b.length >= 8 &&
            b[0] === 0xd0 && b[1] === 0xcf && b[2] === 0x11 && b[3] === 0xe0 &&
            b[4] === 0xa1 && b[5] === 0xb1 && b[6] === 0x1a && b[7] === 0xe1
    },
    doc: {
        mime: 'application/msword',
        check: (b) =>
            b.length >= 8 &&
            b[0] === 0xd0 && b[1] === 0xcf && b[2] === 0x11 && b[3] === 0xe0 &&
            b[4] === 0xa1 && b[5] === 0xb1 && b[6] === 0x1a && b[7] === 0xe1
    },
    ppt: {
        mime: 'application/vnd.ms-powerpoint',
        check: (b) =>
            b.length >= 8 &&
            b[0] === 0xd0 && b[1] === 0xcf && b[2] === 0x11 && b[3] === 0xe0 &&
            b[4] === 0xa1 && b[5] === 0xb1 && b[6] === 0x1a && b[7] === 0xe1
    },
    zip: {
        mime: 'application/zip',
        check: (b) => b.length >= 4 && b[0] === 0x50 && b[1] === 0x4b && b[2] === 0x03 && b[3] === 0x04
    }
};

const DANGEROUS_PAYLOAD_PATTERNS: RegExp[] = [
    /<\?php/i,
    /<\?=/,
    /<script[\s>]/i,
    /<\/script>/i,
    /<!doctype\s+html/i,
    /<html[\s>]/i,
    /<svg[\s>]/i,
    /javascript\s*:/i,
    /vbscript\s*:/i,
    /\bon(?:load|error|click|mouseover|focus)\s*=/i,
    /\b(?:eval|shell_exec|passthru|system|proc_open|popen|pcntl_exec|base64_decode)\s*\(/i,
    /^#!\s*\/(?:usr\/)?bin\/(?:sh|bash|zsh|python|perl|ruby|node)/im
];

@Injectable()
export class MinioService implements OnModuleInit {
    /** Client "asli" -- dipakai untuk operasi nyata (upload/hapus/cek bucket). Selalu ke endpoint
     *  internal (default localhost) supaya tidak bergantung hairpin NAT saat backend & MinIO ada
     *  di server yang sama tapi diekspos lewat domain publik/proxy. */
    private client: Client;
    /** Client "publik" -- CUMA dipakai untuk menghitung presigned URL (murni tanda tangan HMAC
     *  lokal, tidak pernah benar-benar connect ke sini). Endpoint-nya harus domain yang bisa
     *  dijangkau BROWSER pengguna, karena URL hasilnya dikirim langsung ke client. Kalau
     *  MINIO_PUBLIC_ENDPOINT tidak diisi, fallback ke endpoint internal (cocok utk dev/single-host). */
    private publicClient: Client;
    private readonly bucket = process.env.MINIO_BUCKET || 'bdb-attachments';
    private readonly logger = new Logger('MinioService');
    ready = false;

    async onModuleInit() {
        try {
            const accessKey = process.env.MINIO_ACCESS_KEY || 'bdbadmin';
            const secretKey = process.env.MINIO_SECRET_KEY || '';
            const region = process.env.MINIO_REGION || 'us-east-1';
            this.client = new Client({
                endPoint: process.env.MINIO_ENDPOINT || '127.0.0.1',
                port: parseInt(process.env.MINIO_PORT || '9100', 10),
                useSSL: String(process.env.MINIO_USE_SSL || 'false') === 'true',
                accessKey,
                secretKey,
                region
            });
            this.publicClient = process.env.MINIO_PUBLIC_ENDPOINT
                ? new Client({
                      endPoint: process.env.MINIO_PUBLIC_ENDPOINT,
                      port: parseInt(process.env.MINIO_PUBLIC_PORT || '443', 10),
                      useSSL: String(process.env.MINIO_PUBLIC_USE_SSL ?? 'true') === 'true',
                      accessKey,
                      secretKey,
                      region
                  })
                : this.client;
            const exists = await this.client.bucketExists(this.bucket).catch(() => false);
            if (!exists) await this.client.makeBucket(this.bucket);
            this.ready = true;
            this.logger.log(`MinIO siap, bucket "${this.bucket}"`);
        } catch (e: any) {
            this.ready = false;
            this.logger.error('MinIO tidak tersedia: ' + (e?.message || e));
        }
    }

    private assert() {
        if (!this.ready || !this.client) {
            throw new Error('Object storage (MinIO) belum tersambung. Jalankan docker-compose.minio.yml dan set MINIO_* di .env.');
        }
    }

    /**
     * Validasi ketat keamanan file upload:
     * 1. Tolak ekstensi berbahaya & ekstensi ganda (mis. payload.php.jpg / shell.sh.png)
     * 2. Verifikasi Magic Bytes (Binary File Signature) terhadap ekstensi
     * 3. Pindai muatan Polyglot / Script berbahaya di dalam binary (PHP, <script>, <svg>, PE MZ, ELF)
     */
    validateAndSanitizeUpload(file: UploadedFileLike): { ext: string; safeMime: string } {
        if (!file || !file.buffer || !Buffer.isBuffer(file.buffer) || file.buffer.length === 0) {
            throw new BadRequestException('Berkas unggahan kosong atau tidak valid.');
        }
        const rawName = String(file.originalname || '').trim();
        if (!rawName || rawName.includes('\0') || rawName.includes('..') || rawName.includes('/') || rawName.includes('\\')) {
            throw new BadRequestException('Nama berkas mengandung karakter ilegal.');
        }

        const parts = rawName.split('.').map((p) => p.trim().toLowerCase()).filter(Boolean);
        if (parts.length < 2) {
            throw new BadRequestException('Berkas wajib memiliki ekstensi resmi (misal .pdf, .jpg, .png, .mp4, .xlsx).');
        }
        const ext = parts[parts.length - 1].replace(/[^a-z0-9]/g, '');

        // Periksa semua segmen ekstensi (anti double-extension seperti exploit.php.jpg)
        for (let i = 1; i < parts.length; i++) {
            const seg = parts[i].replace(/[^a-z0-9]/g, '');
            if (FORBIDDEN_EXTENSIONS.has(seg)) {
                this.logger.warn(`[SECURITY BLOCK] Percobaan unggah ekstensi berbahaya ditolak: "${rawName}"`);
                throw new BadRequestException(`Keamanan Sistem: Ekstensi ".${seg}" pada berkas "${rawName}" dilarang keras.`);
            }
        }

        const sigSpec = ALLOWED_EXTENSION_SIGNATURES[ext];
        if (!sigSpec) {
            this.logger.warn(`[SECURITY BLOCK] Ekstensi tidak terdaftar ditolak: "${rawName}" (.${ext})`);
            throw new BadRequestException(`Format berkas ".${ext}" tidak diizinkan. Gunakan format resmi (PDF, JPG, PNG, WEBP, MP4, XLSX, DOCX).`);
        }

        const buf = file.buffer;
        // Blokir header binary executable Windows (MZ) atau Linux (ELF)
        if (
            (buf.length >= 2 && buf[0] === 0x4d && buf[1] === 0x5a) ||
            (buf.length >= 4 && buf[0] === 0x7f && buf[1] === 0x45 && buf[2] === 0x4c && buf[3] === 0x46)
        ) {
            this.logger.warn(`[SECURITY BLOCK] Binary executable (PE/ELF) terdeteksi pada "${rawName}"`);
            throw new BadRequestException('Keamanan Sistem: Berkas terdeteksi sebagai program eksekusi (Executable/Binary) dan ditolak.');
        }

        // Verifikasi Magic Bytes sesuai ekstensi
        if (!sigSpec.check(buf)) {
            this.logger.warn(`[SECURITY BLOCK] Magic-bytes mismatch pada "${rawName}" (claimed: ${file.mimetype}, ext: .${ext})`);
            throw new BadRequestException(
                `Keamanan Sistem: Isi biner berkas "${rawName}" tidak sesuai dengan tanda tangan asli format .${ext.toUpperCase()} (terindikasi manipulasi ekstensi/MIME spoofing).`
            );
        }

        // Anti-Polyglot & Script Injection Scanner pada gambar & dokumen PDF
        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf'].includes(ext)) {
            const headLen = Math.min(buf.length, 65536);
            const tailStart = Math.max(0, buf.length - 16384);
            const sampleText =
                buf.subarray(0, headLen).toString('latin1') +
                '\n' +
                (tailStart > headLen ? buf.subarray(tailStart).toString('latin1') : '');

            for (const pattern of DANGEROUS_PAYLOAD_PATTERNS) {
                // Untuk PDF, izinkan objek standar PDF kecuali tag PHP / HTML / <script> eksplisit
                if (ext === 'pdf' && pattern.source.includes('eval')) continue;
                if (pattern.test(sampleText)) {
                    this.logger.warn(`[SECURITY BLOCK] Muatan Polyglot/Script berbahaya (${pattern}) ditemukan dalam "${rawName}"`);
                    throw new BadRequestException(
                        `Keamanan Sistem: Terdeteksi sisipan skrip/kode aktif berbahaya di dalam berkas "${rawName}" (Polyglot File Attack). Unggahan diblokir.`
                    );
                }
            }
        }

        file.mimetype = sigSpec.mime;
        return { ext, safeMime: sigSpec.mime };
    }

    async upload(file: UploadedFileLike, prefix = 'kerma'): Promise<string> {
        this.assert();
        const { ext, safeMime } = this.validateAndSanitizeUpload(file);
        const year = new Date().getFullYear();
        const key = `${prefix}/${year}/${randomUUID()}.${ext}`;
        await this.client.putObject(this.bucket, key, file.buffer, file.size || file.buffer.length, {
            'Content-Type': safeMime,
            'X-Content-Type-Options': 'nosniff'
        });
        return key;
    }

    async presignedUrl(objectKey: string, expirySeconds = 3600): Promise<string> {
        this.assert();
        const signed = await this.publicClient.presignedGetObject(this.bucket, objectKey, expirySeconds);
        return signed.replace(/^https?:\/\/[^/]+\/bdb-attachments\//i, '/bdb-attachments/');
    }

    async statObject(objectKey: string): Promise<any> {
        this.assert();
        return this.client.statObject(this.bucket, objectKey);
    }

    async getPartialObject(objectKey: string, offset: number, length: number): Promise<any> {
        this.assert();
        return this.client.getPartialObject(this.bucket, objectKey, offset, length);
    }

    async getObjectStream(objectKey: string): Promise<any> {
        this.assert();
        return this.client.getObject(this.bucket, objectKey);
    }

    async remove(objectKey: string): Promise<void> {
        this.assert();
        await this.client.removeObject(this.bucket, objectKey);
    }
}
