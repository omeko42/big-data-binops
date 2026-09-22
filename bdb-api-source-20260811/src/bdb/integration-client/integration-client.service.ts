import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as os from 'os';
import * as path from 'path';
import { promises as fs } from 'fs';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { AuditService } from '../audit/audit.service';
import { ExternalLpService } from 'src/external/service/external-lp.service';
import { EXTERNAL_API_SCOPES, EXTERNAL_API_SCOPE_CODES, buildLpDataFlags } from './scopes';
import { buildApiDocHtml } from './api-doc-template';

const execFileAsync = promisify(execFile);
const puppeteer = require('puppeteer');

const USERNAME_RE = /^[a-zA-Z0-9_.-]{3,100}$/;

/** Klien integrasi keluar (pihak luar yang menarik data via /external/v1/*). Superadmin-only. */
@Injectable()
export class IntegrationClientService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly audit: AuditService,
        private readonly externalLpService: ExternalLpService
    ) {}

    private assertSuperadmin(authUser: any) {
        const role = (authUser?.role_bdb || '').toLowerCase();
        if (role !== 'superadmin') {
            throw new ForbiddenException('Hanya superadmin yang dapat mengelola Portal Integrasi Keluar.');
        }
    }

    private normalizeScopes(input: unknown): string[] {
        const arr = Array.isArray(input) ? input : [];
        const unique = Array.from(new Set(arr.map(s => String(s).trim()).filter(Boolean)));
        const invalid = unique.filter(s => !EXTERNAL_API_SCOPE_CODES.includes(s));
        if (invalid.length) {
            throw new BadRequestException(`Scope tidak dikenal: ${invalid.join(', ')}`);
        }
        return unique;
    }

    private generatePassword(): string {
        // 24 byte acak -> ~32 karakter base64url, unik per klien (tidak ada secret bersama).
        return crypto.randomBytes(24).toString('base64url');
    }

    /** Pakai password kustom dari admin (opsional) atau generate otomatis bila kosong. */
    private resolvePassword(custom?: string): string {
        if (custom === undefined || custom === null || custom === '') return this.generatePassword();
        const p = String(custom);
        if (p.length < 10) throw new BadRequestException('Password minimal 10 karakter.');
        return p;
    }

    scopesRegistry(authUser: any) {
        this.assertSuperadmin(authUser);
        return { status: 1, data: EXTERNAL_API_SCOPES };
    }

    /** Log akses /external/v1/* (siapa, kapan, url+parameter, sukses/gagal, keterangan). */
    async accessLog(authUser: any, opts: { search?: string; page?: string; row?: string }) {
        this.assertSuperadmin(authUser);
        return this.audit.list({ ...opts, entity: 'external_api' });
    }

    async list(authUser: any, search?: string) {
        this.assertSuperadmin(authUser);
        const params: any[] = [];
        let where = '';
        if (search && search.trim()) {
            params.push(`%${search.trim()}%`);
            where = 'where nama_klien ilike $1 or username ilike $1';
        }
        const rows = await this.dataSource.query(
            `select id, nama_klien, username, status, allowed_scopes, allowed_ips, keterangan, created_at, updated_at, last_used_at, last_used_ip
             from bdb_integration_client ${where} order by created_at desc`,
            params
        );
        return { status: 1, data: rows };
    }

    async create(authUser: any, body: { nama_klien?: string; username?: string; allowed_scopes?: string[]; allowed_ips?: string[]; keterangan?: string; password?: string }) {
        this.assertSuperadmin(authUser);
        const nama_klien = (body.nama_klien || '').trim();
        const username = (body.username || '').trim();
        if (!nama_klien) throw new BadRequestException('Nama klien wajib diisi.');
        if (!USERNAME_RE.test(username)) {
            throw new BadRequestException('Username 3-100 karakter, hanya huruf/angka/._- (tanpa spasi).');
        }
        const scopes = this.normalizeScopes(body.allowed_scopes);
        const ips = Array.isArray(body.allowed_ips) ? Array.from(new Set(body.allowed_ips.map(ip => String(ip).trim()).filter(Boolean))) : [];
        const keterangan = body.keterangan?.trim() || null;

        const existing = await this.dataSource.query('select id from bdb_integration_client where username=$1', [username]);
        if (existing.length) throw new BadRequestException('Username sudah dipakai klien lain.');

        const password = this.resolvePassword(body.password);
        const passwordHash = await bcrypt.hash(password, 10);
        const ins = await this.dataSource.query(
            `insert into bdb_integration_client (nama_klien, username, password_hash, allowed_scopes, allowed_ips, keterangan, created_by)
             values ($1,$2,$3,$4,$5,$6,$7) returning id, created_at`,
            [nama_klien, username, passwordHash, JSON.stringify(scopes), JSON.stringify(ips), keterangan, authUser?.id || null]
        );

        await this.audit.log({ user: authUser, action: 'CREATE', entity: 'integration_client', entityId: ins[0].id, meta: { nama_klien, username, allowed_scopes: scopes, allowed_ips: ips } });

        return {
            status: 1,
            message: 'Klien integrasi dibuat. Salin password sekarang — tidak akan ditampilkan lagi.',
            data: { id: ins[0].id, nama_klien, username, password, allowed_scopes: scopes, allowed_ips: ips, created_at: ins[0].created_at }
        };
    }

    private async findOrThrow(id: number) {
        const rows = await this.dataSource.query('select id, nama_klien, username, status from bdb_integration_client where id=$1', [id]);
        if (!rows.length) throw new NotFoundException('Klien integrasi tidak ditemukan.');
        return rows[0];
    }

    async regenerateSecret(authUser: any, id: number, customPassword?: string) {
        this.assertSuperadmin(authUser);
        const client = await this.findOrThrow(id);
        const password = this.resolvePassword(customPassword);
        const passwordHash = await bcrypt.hash(password, 10);
        await this.dataSource.query('update bdb_integration_client set password_hash=$2, updated_at=now() where id=$1', [id, passwordHash]);
        await this.audit.log({ user: authUser, action: 'REGENERATE_SECRET', entity: 'integration_client', entityId: id, meta: { username: client.username } });
        return { status: 1, message: 'Password baru dibuat. Salin sekarang — tidak akan ditampilkan lagi.', data: { id, username: client.username, password } };
    }

    async updateScopes(authUser: any, id: number, allowed_scopes: string[]) {
        this.assertSuperadmin(authUser);
        const client = await this.findOrThrow(id);
        const scopes = this.normalizeScopes(allowed_scopes);
        await this.dataSource.query('update bdb_integration_client set allowed_scopes=$2, updated_at=now() where id=$1', [id, JSON.stringify(scopes)]);
        await this.audit.log({ user: authUser, action: 'UPDATE_SCOPES', entity: 'integration_client', entityId: id, meta: { username: client.username, allowed_scopes: scopes } });
        return { status: 1, message: 'Scope akses diperbarui.', data: { id, allowed_scopes: scopes } };
    }

    async updateIps(authUser: any, id: number, allowed_ips: string[]) {
        this.assertSuperadmin(authUser);
        const client = await this.findOrThrow(id);
        const ips = Array.isArray(allowed_ips) ? Array.from(new Set(allowed_ips.map(ip => String(ip).trim()).filter(Boolean))) : [];
        await this.dataSource.query('update bdb_integration_client set allowed_ips=$2, updated_at=now() where id=$1', [id, JSON.stringify(ips)]);
        await this.audit.log({ user: authUser, action: 'UPDATE_IPS', entity: 'integration_client', entityId: id, meta: { username: client.username, allowed_ips: ips } });
        return { status: 1, message: 'Daftar IP whitelist diperbarui.', data: { id, allowed_ips: ips } };
    }

    async updateStatus(authUser: any, id: number, status: string) {
        this.assertSuperadmin(authUser);
        const s = (status || '').toUpperCase();
        if (!['AKTIF', 'NONAKTIF'].includes(s)) throw new BadRequestException('Status harus AKTIF atau NONAKTIF.');
        const client = await this.findOrThrow(id);
        await this.dataSource.query('update bdb_integration_client set status=$2, updated_at=now() where id=$1', [id, s]);
        await this.audit.log({ user: authUser, action: s === 'AKTIF' ? 'ACTIVATE' : 'DEACTIVATE', entity: 'integration_client', entityId: id, meta: { username: client.username } });
        return { status: 1, message: `Klien ${s === 'AKTIF' ? 'diaktifkan' : 'dinonaktifkan'}.`, data: { id, status: s } };
    }

    /**
     * "Uji Coba" dari CMS -- simulasikan panggilan klien TANPA perlu password asli (password
     * cuma tersimpan sbg hash, tak bisa dipakai ulang). Pakai allowed_scopes klien YANG SUDAH
     * TERSIMPAN (bukan scope pilihan bebas di dialog test) supaya hasilnya persis mencerminkan
     * apa yg akan diterima klien ini lewat panggilan asli -- termasuk field tambahan mana yg
     * ikut keluar sesuai checklist scope yg sudah diatur utk klien tsb.
     */
    async testCall(authUser: any, id: number, body: { mode?: 'list' | 'detail'; id?: string } & Record<string, any>) {
        this.assertSuperadmin(authUser);
        const rows = await this.dataSource.query('select id, username, status, allowed_scopes from bdb_integration_client where id=$1', [id]);
        if (!rows.length) throw new NotFoundException('Klien integrasi tidak ditemukan.');
        const client = rows[0];
        const scopes: string[] = Array.isArray(client.allowed_scopes) ? client.allowed_scopes : JSON.parse(client.allowed_scopes || '[]');

        if (client.status !== 'AKTIF') {
            return { status: 0, statusCode: 403, message: `Klien "${client.username}" nonaktif -- panggilan asli akan ditolak.` };
        }
        if (!scopes.includes('laporan_polisi.read')) {
            return { status: 0, statusCode: 403, message: `Klien "${client.username}" tidak memiliki izin akses "laporan_polisi.read".` };
        }

        const flags = buildLpDataFlags(scopes);
        const result: any =
            body.mode === 'detail'
                ? await this.externalLpService.detail(String(body.id || ''), flags)
                : await this.externalLpService.list({ page: body.page, limit: body.limit, status: body.status, updated_from: body.updated_from, updated_to: body.updated_to }, flags);

        await this.audit.log({ user: authUser, action: 'TEST_CALL', entity: 'integration_client', entityId: id, meta: { username: client.username, allowed_scopes: scopes, mode: body.mode || 'list', query: body } });

        return { status: 1, statusCode: 200, data: result?.data, meta: result?.meta };
    }

    private generateDocPassword(): string {
        const hex = crypto.randomBytes(6).toString('hex').toUpperCase();
        return `BDB-${hex.slice(0, 4)}-${hex.slice(4, 8)}-${hex.slice(8, 12)}`;
    }

    /** Sama seperti resolvePassword() tapi khusus dokumen (bukan kredensial klien) -- default format lebih mudah dibacakan/diketik. */
    private resolveDocPassword(custom?: string): string {
        if (custom === undefined || custom === null || custom === '') return this.generateDocPassword();
        const p = String(custom);
        if (p.length < 10) throw new BadRequestException('Password minimal 10 karakter.');
        return p;
    }

    /**
     * Dokumentasi API PDF khusus utk satu klien -- isi (scope yg dimiliki, contoh field yg keluar)
     * mengikuti allowed_scopes klien saat ini, supaya tidak menampilkan field yg sebenarnya tidak
     * bisa diakses klien tsb. Dikunci password (AES-256 via qpdf, WAJIB terpasang di server).
     *
     * SEKALIAN membuat ulang password API klien (spt regenerateSecret) & menyertakan password
     * BARU itu langsung di dalam dokumen -- itulah alasan dokumennya dikunci password: supaya
     * aman menaruh kredensial API sungguhan di dalamnya (bukan cuma placeholder <password>).
     * Password lama klien otomatis tidak berlaku lagi begitu ini dijalankan.
     */
    async generateDocumentation(authUser: any, id: number, customPassword?: string): Promise<{ buffer: Buffer; pdfPassword: string; apiUsername: string; apiPassword: string; filename: string }> {
        this.assertSuperadmin(authUser);
        const rows = await this.dataSource.query('select id, nama_klien, username, allowed_scopes from bdb_integration_client where id=$1', [id]);
        if (!rows.length) throw new NotFoundException('Klien integrasi tidak ditemukan.');
        const client = rows[0];
        const scopes: string[] = Array.isArray(client.allowed_scopes) ? client.allowed_scopes : JSON.parse(client.allowed_scopes || '[]');

        // Buat ulang password API klien -- sama persis spt regenerateSecret(), krn password lama
        // sudah hash (tak bisa dipakai ulang) & dokumen ini WAJIB memuat password sungguhan yg valid.
        const apiPassword = this.generatePassword();
        const apiPasswordHash = await bcrypt.hash(apiPassword, 10);
        await this.dataSource.query('update bdb_integration_client set password_hash=$2, updated_at=now() where id=$1', [id, apiPasswordHash]);

        const pdfPassword = this.resolveDocPassword(customPassword);

        const html = buildApiDocHtml({ namaKlien: client.nama_klien, username: client.username, scopes, generatedAt: new Date(), apiPassword });

        const browser = await puppeteer.launch({
            headless: true,
            // --disable-dev-shm-usage: /dev/shm default Docker cuma 64MB, kekecilan utk renderer
            // Chromium (bikin protokol DevTools timeout diam-diam) -- tulis ke /tmp saja. Container
            // tetap WAJIB dijalankan dgn --shm-size (lihat DEPLOY_3SERVER.md), flag ini saja tak cukup.
            args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined
        });
        let plainBuffer: Buffer;
        try {
            const page = await browser.newPage();
            await page.setContent(html, { waitUntil: 'networkidle0' });
            plainBuffer = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '20mm', bottom: '18mm', left: '16mm', right: '16mm' } });
        } finally {
            await browser.close();
        }

        const tmpDir = os.tmpdir();
        const stamp = crypto.randomBytes(6).toString('hex');
        const plainPath = path.join(tmpDir, `bdb-apidoc-${stamp}.plain.pdf`);
        const lockedPath = path.join(tmpDir, `bdb-apidoc-${stamp}.locked.pdf`);
        try {
            await fs.writeFile(plainPath, plainBuffer);
            try {
                await execFileAsync('qpdf', ['--encrypt', pdfPassword, pdfPassword, '256', '--print=full', '--modify=none', '--extract=n', '--', plainPath, lockedPath]);
            } catch (e: any) {
                if (e?.code === 'ENOENT') {
                    throw new InternalServerErrorException('Tool "qpdf" tidak ditemukan di server -- wajib terpasang utk mengunci PDF dokumentasi (mis. apt-get install qpdf / brew install qpdf).');
                }
                throw new InternalServerErrorException('Gagal mengunci PDF: ' + (e?.stderr || e?.message || e));
            }
            const lockedBuffer = await fs.readFile(lockedPath);

            await this.audit.log({ user: authUser, action: 'GENERATE_DOC', entity: 'integration_client', entityId: id, meta: { username: client.username, allowed_scopes: scopes, api_password_regenerated: true } });

            const safeSlug = String(client.username || 'klien').replace(/[^a-zA-Z0-9_-]/g, '');
            return { buffer: lockedBuffer, pdfPassword, apiUsername: client.username, apiPassword, filename: `BDB-API-Dokumentasi-${safeSlug}.pdf` };
        } finally {
            await fs.unlink(plainPath).catch(() => {});
            await fs.unlink(lockedPath).catch(() => {});
        }
    }

    async remove(authUser: any, id: number) {
        this.assertSuperadmin(authUser);
        const client = await this.findOrThrow(id);
        await this.dataSource.query('delete from bdb_integration_client where id=$1', [id]);
        await this.audit.log({ user: authUser, action: 'DELETE', entity: 'integration_client', entityId: id, meta: { username: client.username } });
        return { status: 1, message: 'Klien integrasi dihapus.' };
    }
}
