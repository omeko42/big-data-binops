import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Client } from 'minio';
import { randomUUID } from 'crypto';

export interface UploadedFileLike {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
    size: number;
}

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

    async upload(file: UploadedFileLike, prefix = 'kerma'): Promise<string> {
        this.assert();
        const ext = (file.originalname.split('.').pop() || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const year = new Date().getFullYear();
        const key = `${prefix}/${year}/${randomUUID()}${ext ? '.' + ext : ''}`;
        await this.client.putObject(this.bucket, key, file.buffer, file.size, { 'Content-Type': file.mimetype || 'application/octet-stream' });
        return key;
    }

    async presignedUrl(objectKey: string, expirySeconds = 3600): Promise<string> {
        this.assert();
        const signed = await this.publicClient.presignedGetObject(this.bucket, objectKey, expirySeconds);
        return signed.replace(/^https?:\/\/[^/]+\/bdb-attachments\//i, '/bdb-attachments/');
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
